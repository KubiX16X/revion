// Wspólne dla wszystkich skryptów agenta: ścieżki, ustawienia, kolejka postów, daty w strefie marki.
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const AGENT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const REVION = resolve(AGENT, '..');
export const REPO = REVION; // katalog główny repozytorium (adresy raw.githubusercontent.com)
export const KOLEJKA = join(REVION, 'kolejka');

export const PLATFORMY = ['facebook', 'instagram'];
export const DNI = ['nd', 'pon', 'wt', 'sro', 'czw', 'pt', 'sob']; // indeks = Date.getUTCDay()

export function wczytajUstawienia(plik = join(REVION, 'ustawienia.json')) {
  const u = JSON.parse(readFileSync(plik, 'utf8'));
  const bledy = [];
  if (!/^https?:\/\//.test(u.link ?? '')) bledy.push('"link" musi zaczynać się od https://');
  if (!Array.isArray(u.platformy) || !u.platformy.every((p) => PLATFORMY.includes(p))) {
    bledy.push(`"platformy" może zawierać tylko: ${PLATFORMY.join(', ')}`);
  }
  for (const slot of u.harmonogram ?? []) {
    if (!DNI.includes(slot.dzien)) bledy.push(`nieznany dzień "${slot.dzien}" (dozwolone: ${DNI.join(', ')})`);
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(slot.godzina ?? '')) bledy.push(`zła godzina "${slot.godzina}" (format GG:MM)`);
  }
  if (!['pr', 'auto'].includes(u.akceptacja)) bledy.push('"akceptacja" to "pr" albo "auto"');
  if (bledy.length) throw new Error(`Błędy w ustawienia.json:\n- ${bledy.join('\n- ')}`);
  return { max_postow_dziennie: 1, hashtagi_stale: [], tekst_linku_instagram: 'link w bio', ...u };
}

// Każdy post to folder z plikiem post.json i grafikami 01.jpg, 02.jpg… (szukamy w podfolderach kolejki).
export function wczytajPosty(katalog = KOLEJKA) {
  if (!existsSync(katalog)) return [];
  const wynik = [];
  const przejdz = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const sciezka = join(dir, e.name);
      if (e.isDirectory()) przejdz(sciezka);
      else if (e.name === 'post.json') {
        wynik.push({ plik: sciezka, katalog: dir, dane: JSON.parse(readFileSync(sciezka, 'utf8')) });
      }
    }
  };
  przejdz(katalog);
  return wynik.sort((a, b) => Date.parse(a.dane.kiedy) - Date.parse(b.dane.kiedy));
}

export function zapiszPost(post) {
  writeFileSync(post.plik, JSON.stringify(post.dane, null, 2) + '\n');
}

// "YYYY-MM-DD" w podanej strefie czasowej
export function dataLokalna(data, strefa) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: strefa, year: 'numeric', month: '2-digit', day: '2-digit' }).format(data);
}

// przesunięcie strefy względem UTC w minutach w danej chwili (np. +120 latem w Polsce)
function przesuniecie(strefa, chwila) {
  const nazwa = new Intl.DateTimeFormat('en-US', { timeZone: strefa, timeZoneName: 'longOffset' })
    .formatToParts(chwila)
    .find((p) => p.type === 'timeZoneName').value; // "GMT+02:00" albo "GMT"
  const m = nazwa.match(/GMT([+-])(\d{2}):(\d{2})/);
  return m ? (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3])) : 0;
}

// "2026-10-12" + "18:30" w strefie marki -> "2026-10-12T18:30:00+02:00"
export function isoWStrefie(dzien, godzina, strefa) {
  const [r, mies, d] = dzien.split('-').map(Number);
  const [g, min] = godzina.split(':').map(Number);
  const lokalnieJakoUtc = Date.UTC(r, mies - 1, d, g, min);
  let off = przesuniecie(strefa, new Date(lokalnieJakoUtc));
  off = przesuniecie(strefa, new Date(lokalnieJakoUtc - off * 60000)); // druga iteracja na zmianę czasu
  const znak = off < 0 ? '-' : '+';
  const abs = Math.abs(off);
  const pad = (n) => String(n).padStart(2, '0');
  return `${dzien}T${godzina}:00${znak}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`;
}

// sloty publikacji z harmonogramu na 7 dni, zaczynając od dnia "od" (YYYY-MM-DD)
export function slotyTygodnia(od, ustawienia) {
  const sloty = [];
  const start = Date.parse(`${od}T12:00:00Z`);
  for (let i = 0; i < 7; i++) {
    const chwila = new Date(start + i * 86400000);
    const dzien = chwila.toISOString().slice(0, 10);
    const nazwa = DNI[chwila.getUTCDay()];
    for (const slot of ustawienia.harmonogram.filter((s) => s.dzien === nazwa)) {
      sloty.push({ dzien, nazwa, kiedy: isoWStrefie(dzien, slot.godzina, ustawienia.strefa_czasowa) });
    }
  }
  return sloty.sort((a, b) => Date.parse(a.kiedy) - Date.parse(b.kiedy));
}

export function normalizujHashtag(t) {
  const czysty = String(t).trim().replace(/^#+/, '').replace(/[^\p{L}\p{N}_]/gu, '');
  return czysty ? `#${czysty}` : '';
}

// Opis gotowy do publikacji: {LINK} -> adres strony na Facebooku, "link w bio" na Instagramie; na końcu hashtagi.
export function zbudujOpis(post, platforma, ustawienia) {
  const link = platforma === 'facebook' ? ustawienia.link : ustawienia.tekst_linku_instagram;
  let tekst = String(post.opis ?? '').replaceAll('{LINK}', link).trim();
  const tagi = [...new Set([...(post.hashtagi ?? []), ...ustawienia.hashtagi_stale].map(normalizujHashtag))].filter(Boolean);
  if (tagi.length) tekst += `\n\n${tagi.join(' ')}`;
  if (platforma === 'instagram') {
    if (tekst.length > 2200) throw new Error(`Opis na Instagram ma ${tekst.length} znaków (limit 2200)`);
    if (tagi.length > 5) throw new Error(`Za dużo hashtagów na Instagram: ${tagi.length} (limit 5)`);
  }
  return tekst;
}

// liczba niewypełnionych pól [UZUPEŁNIJ …] w briefie marki
export const brakiWBriefie = (tekst) => (tekst.match(/\[UZUPEŁNIJ[^\]]*\]/g) ?? []).length;

export function argumenty(argv = process.argv.slice(2)) {
  const wynik = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) wynik._.push(a);
    else if (argv[i + 1] && !argv[i + 1].startsWith('--')) wynik[a.slice(2)] = argv[++i];
    else wynik[a.slice(2)] = true;
  }
  return wynik;
}
