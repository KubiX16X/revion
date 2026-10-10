// Pobiera wyniki opublikowanych postów z ostatnich 30 dni i zapisuje je w post.json ("statystyki").
// Generator czyta je w sobotę i rozwija tematy, które działały. Te same liczby widać w Meta Business Suite.
// Użycie: node src/statystyki.mjs
import { pathToFileURL } from 'node:url';
import { utworzMeta } from './meta.mjs';
import { wczytajPosty, wczytajUstawienia, zapiszPost } from './wspolne.mjs';

const wartosc = (m) => m?.total_value?.value ?? m?.values?.[0]?.value ?? 0;

async function facebook(meta, id) {
  const d = await meta.zapytanie('GET', id, {
    fields: 'reactions.summary(total_count).limit(0),comments.summary(total_count).limit(0),shares',
  });
  return {
    reakcje: d.reactions?.summary?.total_count ?? 0,
    komentarze: d.comments?.summary?.total_count ?? 0,
    udostepnienia: d.shares?.count ?? 0,
  };
}

async function instagram(meta, id, log) {
  const d = await meta.zapytanie('GET', id, { fields: 'like_count,comments_count' });
  const wynik = { polubienia: d.like_count ?? 0, komentarze: d.comments_count ?? 0 };
  try {
    const { data = [] } = await meta.zapytanie('GET', `${id}/insights`, { metric: 'reach,saved,shares,views' });
    const m = Object.fromEntries(data.map((x) => [x.name, wartosc(x)]));
    Object.assign(wynik, { zasieg: m.reach ?? 0, zapisy: m.saved ?? 0, udostepnienia: m.shares ?? 0, wyswietlenia: m.views ?? 0 });
  } catch (e) {
    log(`Uwaga: brak szczegółowych statystyk Instagrama dla ${id} (${e.message}).`);
  }
  return wynik;
}

export async function pobierzStatystyki({ posty, meta, teraz = new Date(), log = console.log, zapisz = zapiszPost }) {
  const od = teraz.getTime() - 30 * 86400000;
  let ile = 0;
  for (const post of posty) {
    const wyniki = post.dane.wyniki ?? {};
    const swieze = Object.values(wyniki).some((w) => w?.kiedy && Date.parse(w.kiedy) > od);
    if (!swieze) continue;
    const statystyki = { ...post.dane.statystyki };
    try {
      if (wyniki.facebook?.id) statystyki.facebook = await facebook(meta, wyniki.facebook.id);
      if (wyniki.instagram?.id) statystyki.instagram = await instagram(meta, wyniki.instagram.id, log);
    } catch (e) {
      log(`Nie udało się pobrać statystyk "${post.dane.id}": ${e.message}`);
      if (e.tokenNiewazny) throw e;
      continue;
    }
    post.dane.statystyki = { ...statystyki, pobrano: teraz.toISOString() };
    zapisz(post);
    ile++;
  }
  log(`Zaktualizowano statystyki ${ile} postów.`);
  return ile;
}

async function main() {
  const ustawienia = wczytajUstawienia();
  const meta = utworzMeta({
    token: process.env.META_TOKEN,
    pageId: process.env.META_PAGE_ID,
    igUserId: process.env.META_IG_USER_ID,
    wersja: ustawienia.wersja_graph_api,
  });
  await pobierzStatystyki({ posty: wczytajPosty(), meta });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => {
    console.error(e.message);
    process.exitCode = 1;
  });
}
