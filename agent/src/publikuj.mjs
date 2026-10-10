// Publikuje posty z kolejki, których godzina już minęła. GitHub Actions uruchamia go co godzinę.
// Użycie: node src/publikuj.mjs [--na-sucho] [--teraz 2026-10-12T19:00:00+02:00]
//
// Zasady:
// - publikujemy tylko posty ze statusem "zaplanowany" (status "wstrzymany" = pomiń),
// - najwyżej max_postow_dziennie na platformę dziennie; zaległe posty schodzą po jednym w kolejne dni,
// - jeśli Facebook się udał, a Instagram nie, następne uruchomienie ponawia tylko Instagram,
// - przed publikacją sprawdzamy, czy identyczny post już nie wisi na profilu (ochrona przed duplikatem),
// - po 3 nieudanych próbach post dostaje status "blad" i czeka na człowieka.
import { existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { utworzMeta } from './meta.mjs';
import { REPO, argumenty, dataLokalna, wczytajPosty, wczytajUstawienia, zapiszPost, zbudujOpis } from './wspolne.mjs';

const MAKS_PROB = 3;

const porownywalny = (t) => String(t ?? '').replace(/\s+/g, ' ').trim().slice(0, 300);

async function znajdzIstniejacy(meta, platforma, opis, teraz) {
  const wzor = porownywalny(opis);
  const odCzasu = teraz.getTime() - 3 * 86400000;
  if (platforma === 'facebook') {
    const posty = await meta.ostatniePostyFacebook(10);
    const p = posty.find((x) => Date.parse(x.created_time) > odCzasu && porownywalny(x.message) === wzor);
    return p ? { id: p.id, link: p.permalink_url ?? `https://www.facebook.com/${p.id}` } : null;
  }
  const posty = await meta.ostatniePostyInstagram(10);
  const p = posty.find((x) => Date.parse(x.timestamp) > odCzasu && porownywalny(x.caption) === wzor);
  return p ? { id: p.id, link: p.permalink ?? null } : null;
}

async function wszystkieDostepne(adresy, fetchImpl) {
  try {
    const odp = await Promise.all(adresy.map((a) => fetchImpl(a, { method: 'HEAD' })));
    return odp.every((o) => o.ok);
  } catch {
    return false;
  }
}

// Instagram pobiera grafiki z publicznego adresu. Najpierw próbujemy pliku z publicznego repozytorium
// (dokładnie ten commit, który publikujemy); jeśli repozytorium jest prywatne, bierzemy adresy grafik
// wgranych na Facebooka bez publikacji.
async function adresyDlaInstagrama({ pliki, meta, zdjeciaFb, env, fetchImpl }) {
  if (env.GITHUB_REPOSITORY && env.GITHUB_SHA) {
    const adresy = pliki.map(
      (f) => `https://raw.githubusercontent.com/${env.GITHUB_REPOSITORY}/${env.GITHUB_SHA}/${relative(REPO, f).split(sep).join('/')}`,
    );
    if (await wszystkieDostepne(adresy, fetchImpl)) return adresy;
  }
  let idZdjec = zdjeciaFb;
  if (!idZdjec) {
    idZdjec = [];
    for (const plik of pliki) idZdjec.push(await meta.wgrajZdjecieFb(plik));
  }
  const adresy = [];
  for (const id of idZdjec) adresy.push(await meta.adresZdjeciaFb(id));
  return adresy;
}

export async function publikujZaplanowane({
  posty,
  ustawienia,
  meta,
  teraz = new Date(),
  naSucho = false,
  log = console.log,
  zapisz = zapiszPost,
  env = process.env,
  fetchImpl = fetch,
}) {
  const strefa = ustawienia.strefa_czasowa;
  const dzisiaj = dataLokalna(teraz, strefa);
  const dzisiajNa = (platforma) =>
    posty.filter((p) => {
      const kiedy = p.dane.wyniki?.[platforma]?.kiedy;
      return kiedy && dataLokalna(new Date(kiedy), strefa) === dzisiaj;
    }).length;

  const zalegle = posty.filter((p) => p.dane.status === 'zaplanowany' && Date.parse(p.dane.kiedy) <= teraz.getTime());
  const wynik = { opublikowane: [], bledy: [], post: null };
  if (!zalegle.length) {
    log('Nic do publikacji w tej chwili.');
    return wynik;
  }

  // najstarszy zaległy post; facebook przed instagramem, żeby Instagram mógł użyć wgranych już grafik
  const post = zalegle[0];
  wynik.post = post.dane.id;
  const platformy = ['facebook', 'instagram'].filter(
    (p) => (post.dane.platformy ?? ustawienia.platformy).includes(p) && ustawienia.platformy.includes(p),
  );
  const brakujace = platformy.filter((p) => !post.dane.wyniki?.[p]?.id);
  const dzisPlatformy = brakujace.filter((p) => dzisiajNa(p) < ustawienia.max_postow_dziennie);
  if (!dzisPlatformy.length) {
    log(`"${post.dane.id}": dzienny limit postów osiągnięty, publikacja jutro.`);
    return wynik;
  }

  const pliki = (post.dane.grafiki ?? []).map((g) => join(post.katalog, g));
  const brak = pliki.filter((f) => !existsSync(f));
  if (!pliki.length || brak.length) {
    const blad = `brak grafik: ${brak.length ? brak.map((f) => relative(post.katalog, f)).join(', ') : 'lista "grafiki" jest pusta'}`;
    wynik.bledy.push(blad);
    if (!naSucho) {
      post.dane.status = 'blad';
      post.dane.blad = blad;
      zapisz(post);
    }
    log(`"${post.dane.id}": ${blad}`);
    return wynik;
  }

  let zdjeciaFb = null;
  let tokenNiewazny = false;
  for (const platforma of dzisPlatformy) {
    try {
      const opis = zbudujOpis(post.dane, platforma, ustawienia);
      if (naSucho) {
        log(`[na sucho] ${platforma}: "${post.dane.id}" (${pliki.length} graf.)\n${opis}\n`);
        wynik.opublikowane.push(platforma);
        continue;
      }
      let istniejacy = null;
      try {
        istniejacy = await znajdzIstniejacy(meta, platforma, opis, teraz);
      } catch (e) {
        log(`Uwaga: nie udało się sprawdzić ostatnich postów na ${platforma} (${e.message}). Publikuję dalej.`);
      }
      let opublikowany;
      if (istniejacy) {
        log(`${platforma}: "${post.dane.id}" był już opublikowany (${istniejacy.link ?? istniejacy.id}), zapisuję wynik.`);
        opublikowany = istniejacy;
      } else if (platforma === 'facebook') {
        opublikowany = await meta.publikujFacebook({ opis, pliki });
        zdjeciaFb = opublikowany.zdjecia;
      } else {
        const adresy = await adresyDlaInstagrama({ pliki, meta, zdjeciaFb, env, fetchImpl });
        opublikowany = await meta.publikujInstagram({ opis, adresy });
      }
      post.dane.wyniki = {
        ...post.dane.wyniki,
        [platforma]: { id: opublikowany.id, link: opublikowany.link ?? null, kiedy: teraz.toISOString() },
      };
      wynik.opublikowane.push(platforma);
      log(`${platforma}: opublikowano "${post.dane.id}" ${opublikowany.link ?? ''}`);
    } catch (e) {
      if (naSucho) {
        wynik.bledy.push(`${platforma}: ${e.message}`);
        continue;
      }
      post.dane.proby = (post.dane.proby ?? 0) + 1;
      post.dane.blad = `${platforma}: ${e.message}`;
      wynik.bledy.push(post.dane.blad);
      log(`${platforma}: BŁĄD "${post.dane.id}": ${e.message}`);
      if (e.tokenNiewazny) {
        tokenNiewazny = true;
        break;
      }
    }
  }

  if (!naSucho) {
    if (platformy.every((p) => post.dane.wyniki?.[p]?.id)) {
      post.dane.status = 'opublikowany';
      delete post.dane.blad;
    } else if ((post.dane.proby ?? 0) >= MAKS_PROB) {
      post.dane.status = 'blad';
    }
    zapisz(post);
  }
  if (tokenNiewazny) {
    wynik.bledy.push('Token Meta jest nieważny albo wygasł: wygeneruj nowy (instrukcje/02-polaczenie-z-meta.md).');
  }
  return wynik;
}

async function main() {
  const args = argumenty();
  const ustawienia = wczytajUstawienia();
  const naSucho = Boolean(args['na-sucho']);
  if (!ustawienia.agent_wlaczony && !naSucho) {
    console.log('Agent jest wyłączony ("agent_wlaczony": false w ustawienia.json). Nic nie publikuję.');
    return;
  }
  const meta = naSucho
    ? null
    : utworzMeta({
        token: process.env.META_TOKEN,
        pageId: process.env.META_PAGE_ID,
        igUserId: process.env.META_IG_USER_ID,
        wersja: ustawienia.wersja_graph_api,
      });
  const teraz = args.teraz ? new Date(args.teraz) : new Date();
  const wynik = await publikujZaplanowane({ posty: wczytajPosty(), ustawienia, meta, teraz, naSucho });
  if (wynik.bledy.length) {
    console.error(`\nBłędy:\n- ${wynik.bledy.join('\n- ')}`);
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => {
    console.error(e.message);
    process.exitCode = 1;
  });
}
