// Raz w tygodniu: Claude pisze posty na kolejny tydzień (według marka.md, notatek i wyników poprzednich postów),
// a my renderujemy do nich grafiki. Wynik trafia do kolejka/<data>_tydzien/.
// Użycie: node src/generuj.mjs [--od 2026-10-12] [--pr-opis /ścieżka/pr.md]
// Wymaga ANTHROPIC_API_KEY.
import { appendFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';
import Anthropic from '@anthropic-ai/sdk';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import { z } from 'zod';
import { renderujPost, zamknijPrzegladarke } from './grafiki.mjs';
import { KOLEJKA, REPO, REVION, argumenty, brakiWBriefie, dataLokalna, slotyTygodnia, wczytajPosty, wczytajUstawienia, zbudujOpis } from './wspolne.mjs';

const Slajd = z.object({
  typ: z.enum(['okladka', 'tekst', 'lista', 'cytat', 'cta']),
  etykieta: z.string().describe('Krótka etykieta nad nagłówkiem (np. "Błąd nr 2"). Pusty tekst, jeśli niepotrzebna.'),
  naglowek: z.string(),
  tekst: z.string().describe('Pusty tekst, jeśli slajd ma tylko nagłówek.'),
  punkty: z.array(z.string()).describe('Tylko dla typu "lista", w innych typach pusta lista.'),
  przycisk: z.string().describe('Tylko dla typu "cta" (np. "Zapisz się na newsletter"), w innych pusty tekst.'),
});

const Post = z.object({
  temat: z.string(),
  filar: z.string(),
  cel: z.enum(['zasieg', 'zaufanie', 'newsletter', 'sprzedaz']),
  opis: z.string().describe('Opis posta bez hashtagów. {LINK} w miejscu linku.'),
  hashtagi: z.array(z.string()),
  slajdy: z.array(Slajd),
});

const Tiktok = z.object({
  tytul: z.string(),
  hak: z.string().describe('Pierwsze 2 sekundy: zdanie albo scena, która zatrzymuje przewijanie.'),
  scenariusz: z.string(),
  tekst_na_ekranie: z.string(),
  opis: z.string(),
});

export const Tydzien = z.object({
  posty: z.array(Post),
  tiktoki: z.array(Tiktok),
  notatka: z.string().describe('3–5 zdań dla właściciela: plan tygodnia i jeden wniosek z wyników.'),
});

export const LIMITY = { naglowek: 90, tekst: 280, punkt: 90, punkty: 6, slajdy: 8, opis: 1600, hashtagi: 4 };

const SYSTEM = `Jesteś strategiem social media i copywriterem polskiej marki internetowej. Piszesz posty na Facebooka i Instagrama
(karuzele i pojedyncze grafiki 4:5), które budują zaufanie, zapisy na newsletter i sprzedaż. Piszesz po polsku,
poprawnie, naturalnie, bez kalek z angielskiego.

Zasady treści:
- Opierasz się wyłącznie na briefie marki. Nie wymyślasz faktów o produkcie, opinii klientów, liczb, wyników,
  promocji, terminów ani gwarancji. Jeśli czegoś nie ma w briefie, piszesz ogólniej albo wybierasz inny temat.
- Bez obietnic zdrowotnych i finansowych, bez straszenia i sztucznej presji.
- Jeden post = jedna myśl. Okładka (pierwszy slajd, typ "okladka") to hak: maksymalnie ok. 8 słów,
  konkretna korzyść, liczba albo zaskoczenie. 1–3 kluczowe słowa wyróżnij ==tak==.
- Środkowe slajdy dają realną wartość (wskazówka, krok, przykład), ostatni slajd karuzeli to typ "cta"
  z jednym wezwaniem (zapis na newsletter, odwiedzenie strony, zapisanie posta, komentarz).
- Mieszaj formaty: większość to karuzele 4–7 slajdów, czasem pojedyncza grafika (1 slajd: okladka albo cytat).
- Cele w tygodniu: mniej więcej 60% zasięg/zaufanie, 25% newsletter, 15% sprzedaż. Sprzedaż tylko konkretami z briefu.
- Na slajdach bez emoji. W opisie emoji oszczędnie (0–3). **Pogrubienie** rzadko.
- Opis: pierwsza linia to hak (widać ją przed „więcej”), potem krótkie akapity, na końcu pytanie albo wezwanie.
  Tam, gdzie ma być link do strony lub zapisu, wstaw dokładnie {LINK} (na Facebooku zamieni się w adres,
  na Instagramie w „link w bio”). Hashtagi podajesz osobno: 3–4 trafne, polskie, bez znaku spacji.
- Nie powtarzaj tematów z ostatnich postów. Ucz się z wyników: rozwijaj to, co działało, porzucaj to, co nie działało.

Typy slajdów: okladka, tekst, lista, cytat, cta. Cele postów: zasieg, zaufanie, newsletter, sprzedaz.

Limity (twarde, bo grafiki mają stały rozmiar): nagłówek do ${LIMITY.naglowek} znaków, tekst slajdu do ${LIMITY.tekst} znaków,
lista do ${LIMITY.punkty} punktów po ${LIMITY.punkt} znaków, do ${LIMITY.slajdy} slajdów, opis do ${LIMITY.opis} znaków.

Dodatkowo przygotuj 3 pomysły na krótkie filmy na TikToka (właściciel nagrywa je sam, telefonem, bez montażu):
hak na pierwsze 2 sekundy, scenariusz do ok. 120 słów, tekst na ekranie i opis. Niech wiążą się z tematami tygodnia.`;

export function sprawdzBrief(tekst) {
  const braki = brakiWBriefie(tekst);
  if (braki) {
    throw new Error(
      `marka.md ma jeszcze ${braki} pól [UZUPEŁNIJ]. Uzupełnij brief, zanim agent zacznie pisać posty (żeby niczego nie zmyślał).`,
    );
  }
}

// wynik zaangażowania posta (jeśli statystyki.mjs zdążył je pobrać)
export function wynikPosta(dane) {
  const fb = dane.statystyki?.facebook ?? {};
  const ig = dane.statystyki?.instagram ?? {};
  const w =
    (fb.reakcje ?? 0) +
    2 * (fb.komentarze ?? 0) +
    3 * (fb.udostepnienia ?? 0) +
    (ig.polubienia ?? 0) +
    2 * (ig.komentarze ?? 0) +
    3 * (ig.zapisy ?? 0) +
    3 * (ig.udostepnienia ?? 0);
  return dane.statystyki ? w : null;
}

function historia(posty) {
  const ostatnie = posty.filter((p) => p.dane.status !== 'przyklad').slice(-24);
  if (!ostatnie.length) return 'Brak wcześniejszych postów: to pierwszy tydzień.';
  const linie = ostatnie.map((p) => {
    const w = wynikPosta(p.dane);
    const zasieg = p.dane.statystyki?.instagram?.zasieg;
    return `- ${p.dane.kiedy.slice(0, 10)} [${p.dane.status}] ${p.dane.filar ?? '?'} / ${p.dane.cel ?? '?'}: ${p.dane.temat}` +
      (w === null ? '' : ` | wynik ${w}${zasieg ? `, zasięg IG ${zasieg}` : ''}`);
  });
  return linie.join('\n');
}

export function sprawdzTydzien(tydzien, liczbaSlotow) {
  const bledy = [];
  if (tydzien.posty.length !== liczbaSlotow) bledy.push(`Potrzeba dokładnie ${liczbaSlotow} postów, jest ${tydzien.posty.length}.`);
  tydzien.posty.forEach((p, i) => {
    const nr = `Post ${i + 1} („${p.temat}”)`;
    if (!p.slajdy.length || p.slajdy.length > LIMITY.slajdy) bledy.push(`${nr}: liczba slajdów musi być od 1 do ${LIMITY.slajdy}.`);
    if (p.slajdy[0] && !['okladka', 'cytat'].includes(p.slajdy[0].typ)) bledy.push(`${nr}: pierwszy slajd musi być typu "okladka" albo "cytat".`);
    if (p.opis.length > LIMITY.opis) bledy.push(`${nr}: opis ma ${p.opis.length} znaków (limit ${LIMITY.opis}).`);
    if (/#\p{L}/u.test(p.opis)) bledy.push(`${nr}: hashtagi mają być w osobnym polu, nie w opisie.`);
    p.slajdy.forEach((s, j) => {
      const gdzie = `${nr}, slajd ${j + 1}`;
      if (!s.naglowek.trim()) bledy.push(`${gdzie}: pusty nagłówek.`);
      if (s.naglowek.length > LIMITY.naglowek) bledy.push(`${gdzie}: nagłówek ma ${s.naglowek.length} znaków (limit ${LIMITY.naglowek}).`);
      if (s.tekst.length > LIMITY.tekst) bledy.push(`${gdzie}: tekst ma ${s.tekst.length} znaków (limit ${LIMITY.tekst}).`);
      if (s.typ === 'lista' && (!s.punkty.length || s.punkty.length > LIMITY.punkty)) bledy.push(`${gdzie}: lista musi mieć od 1 do ${LIMITY.punkty} punktów.`);
      if (s.punkty.some((x) => x.length > LIMITY.punkt)) bledy.push(`${gdzie}: punkt dłuższy niż ${LIMITY.punkt} znaków.`);
    });
  });
  return bledy;
}

const slug = (s) =>
  s
    .toLowerCase()
    .replace(/ł/g, 'l')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40)
    .replace(/-$/, '');

// najbliższy poniedziałek po dniu "teraz" (w strefie marki)
export function nastepnyPoniedzialek(teraz, strefa) {
  const dzis = Date.parse(`${dataLokalna(teraz, strefa)}T12:00:00Z`);
  const dzien = new Date(dzis).getUTCDay();
  const ile = ((8 - dzien) % 7) || 7;
  return new Date(dzis + ile * 86400000).toISOString().slice(0, 10);
}

function podsumowanie({ tydzien, posty, od, ustawienia, adresGrafik }) {
  const linie = [`# Posty na tydzień od ${od}`, '', tydzien.notatka, ''];
  linie.push(
    '**Jak zatwierdzić:** scal ten pull request (Merge). Posty wyjdą same o podanych godzinach.',
    '**Jak wstrzymać jeden post:** w jego `post.json` zmień `"status": "zaplanowany"` na `"wstrzymany"`.',
    '',
  );
  for (const p of posty) {
    linie.push(`## ${p.dane.kiedy.slice(0, 16).replace('T', ', godz. ')}: ${p.dane.temat}`, '');
    linie.push(`Filar: ${p.dane.filar} · cel: ${p.dane.cel} · ${p.dane.grafiki.length} graf.`, '');
    linie.push(p.dane.grafiki.map((g) => `<img src="${adresGrafik(p, g)}" width="180">`).join(' '), '');
    linie.push('<details><summary>Opis (Facebook)</summary>', '', '```', zbudujOpis(p.dane, 'facebook', ustawienia), '```', '</details>', '');
  }
  linie.push('---', '', '# TikTok na ten tydzień (nagrywasz Ty)', '');
  for (const [i, t] of tydzien.tiktoki.entries()) {
    linie.push(
      `## ${i + 1}. ${t.tytul}`,
      '',
      `**Hak (2 sekundy):** ${t.hak}`,
      '',
      `**Scenariusz:** ${t.scenariusz}`,
      '',
      `**Tekst na ekranie:** ${t.tekst_na_ekranie}`,
      '',
      `**Opis:** ${t.opis}`,
      '',
    );
  }
  return linie.join('\n');
}

export async function generujTydzien({ klient, ustawienia, brief, notatki, posty, od, katalogKolejki = KOLEJKA, log = console.log }) {
  sprawdzBrief(brief);
  const sloty = slotyTygodnia(od, ustawienia);
  if (!sloty.length) throw new Error('Harmonogram w ustawienia.json jest pusty.');
  const zajete = new Set(posty.map((p) => p.dane.kiedy));
  if (sloty.some((s) => zajete.has(s.kiedy))) {
    throw new Error(`Tydzień od ${od} ma już posty w kolejce. Usuń je albo wybierz inny tydzień (--od).`);
  }

  const zadanie = `Brief marki:
<brief>
${brief}
</brief>

Notatki właściciela na ten tydzień:
<notatki>
${notatki.trim() || '(brak)'}
</notatki>

Link do strony: ${ustawienia.link}

Ostatnie posty (data, status, filar / cel: temat | wynik zaangażowania, im więcej, tym lepiej):
<historia>
${historia(posty)}
</historia>

Napisz dokładnie ${sloty.length} postów, po kolei na te terminy:
${sloty.map((s, i) => `${i + 1}. ${s.nazwa} ${s.dzien}, godz. ${s.kiedy.slice(11, 16)}`).join('\n')}`;

  const katalogTygodnia = join(katalogKolejki, `${od}_tydzien`);
  let poprawki = '';

  for (let proba = 1; proba <= 3; proba++) {
    log(`Claude pisze posty (próba ${proba})…`);
    const odp = await klient.beta.messages.parse({
      model: ustawienia.model,
      max_tokens: 16000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: 'high', format: betaZodOutputFormat(Tydzien) },
      system: SYSTEM,
      messages: [{ role: 'user', content: zadanie + poprawki }],
    });
    if (odp.stop_reason === 'refusal') throw new Error(`Model odmówił: ${odp.stop_details?.explanation ?? 'bez wyjaśnienia'}`);
    if (odp.stop_reason === 'max_tokens') throw new Error('Odpowiedź się nie zmieściła (max_tokens). Zmniejsz liczbę postów w harmonogramie.');
    const tydzien = odp.parsed_output;
    if (!tydzien) throw new Error('Model nie zwrócił poprawnego JSON-a.');

    let bledy = sprawdzTydzien(tydzien, sloty.length);
    const gotowe = [];
    if (!bledy.length) {
      rmSync(katalogTygodnia, { recursive: true, force: true });
      for (const [i, p] of tydzien.posty.entries()) {
        const slot = sloty[i];
        const id = `${slot.dzien}-${slug(p.temat) || `post-${i + 1}`}`;
        const katalog = join(katalogTygodnia, id);
        mkdirSync(katalog, { recursive: true });
        const dane = {
          id,
          kiedy: slot.kiedy,
          status: 'zaplanowany',
          platformy: ustawienia.platformy,
          temat: p.temat,
          filar: p.filar,
          cel: p.cel,
          opis: p.opis,
          hashtagi: p.hashtagi.slice(0, LIMITY.hashtagi),
          slajdy: p.slajdy.map((s) => Object.fromEntries(Object.entries(s).filter(([, v]) => (Array.isArray(v) ? v.length : v !== '')))),
        };
        try {
          dane.grafiki = await renderujPost(dane, katalog, ustawienia);
          zbudujOpis(dane, 'instagram', ustawienia); // limity Instagrama
        } catch (e) {
          bledy.push(`Post ${i + 1} („${p.temat}”): ${e.message}`);
          continue;
        }
        const plik = join(katalog, 'post.json');
        writeFileSync(plik, JSON.stringify(dane, null, 2) + '\n');
        gotowe.push({ plik, katalog, dane });
      }
    }
    if (!bledy.length) return { tydzien, posty: gotowe, katalogTygodnia };

    log(`Do poprawy:\n- ${bledy.join('\n- ')}`);
    rmSync(katalogTygodnia, { recursive: true, force: true });
    // zamiast dopisywać rozmowę wysyłamy jedno pytanie z poprzednią wersją i listą poprawek
    poprawki =
      `\n\nTwoja poprzednia wersja (poniżej) ma problemy. Popraw je i zwróć cały tydzień jeszcze raz:\n- ${bledy.join('\n- ')}` +
      `\n<poprzednia_wersja>\n${JSON.stringify(tydzien)}\n</poprzednia_wersja>`;
  }
  throw new Error('Po 3 próbach posty wciąż nie spełniają limitów. Spróbuj ponownie albo napisz do Claude’a.');
}

async function main() {
  const args = argumenty();
  const ustawienia = wczytajUstawienia();
  const od = args.od ?? nastepnyPoniedzialek(new Date(), ustawienia.strefa_czasowa);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(od)) throw new Error('--od w formacie RRRR-MM-DD');
  const brief = readFileSync(join(REVION, 'marka.md'), 'utf8');
  const plikNotatek = join(REVION, 'notatki-do-agenta.md');
  const notatki = existsSync(plikNotatek) ? readFileSync(plikNotatek, 'utf8').replace(/<!--[\s\S]*?-->/g, '') : '';
  try {
    const wynik = await generujTydzien({ klient: new Anthropic(), ustawienia, brief, notatki, posty: wczytajPosty(), od });
    const rel = (p, g) => `./${relative(wynik.katalogTygodnia, join(p.katalog, g))}`;
    writeFileSync(join(wynik.katalogTygodnia, 'README.md'), podsumowanie({ ...wynik, od, ustawienia, adresGrafik: rel }));
    if (args['pr-opis']) {
      // w opisie pull requesta potrzebne są pełne adresy grafik z gałęzi PR
      const baza = `https://github.com/${process.env.GITHUB_REPOSITORY}/raw/${process.env.GALAZ}`;
      const pelny = (p, g) => `${baza}/${relative(REPO, join(p.katalog, g))}`;
      writeFileSync(args['pr-opis'], podsumowanie({ ...wynik, od, ustawienia, adresGrafik: pelny }));
    }
    console.log(`Gotowe: ${wynik.posty.length} postów w ${relative(REPO, wynik.katalogTygodnia)}`);
    if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `od=${od}\n`);
  } finally {
    await zamknijPrzegladarke();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => {
    console.error(e instanceof Anthropic.APIError ? `Błąd API Claude (${e.status}): ${e.message}` : e.message);
    process.exitCode = 1;
  });
}
