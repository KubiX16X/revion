// Grafiki postów (JPG 1080×1350, format 4:5 na Facebook i Instagram) w kolorach marki z ustawienia.json.
// Użycie: node src/grafiki.mjs <ścieżka/do/post.json> [kolejne post.json…]
// Typy slajdów: okladka, tekst, lista, cytat, cta. W tekstach: **pogrubienie**, ==wyróżnienie==, nowa linia.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { AGENT, wczytajUstawienia } from './wspolne.mjs';

export const SZEROKOSC = 1080;
export const WYSOKOSC = 1350;
export const TYPY_SLAJDOW = ['okladka', 'tekst', 'lista', 'cytat', 'cta'];

const fonty = () =>
  [
    ['Inter-Regular.woff2', 400],
    ['Inter-Bold.woff2', 700],
    ['Inter-ExtraBold.woff2', 800],
  ]
    .map(([plik, waga]) => {
      const b64 = readFileSync(join(AGENT, 'fonty', plik)).toString('base64');
      return `@font-face{font-family:Inter;font-weight:${waga};src:url(data:font/woff2;base64,${b64}) format('woff2');}`;
    })
    .join('\n');

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// emoji na grafikach wyglądają różnie na różnych serwerach, więc trzymamy je tylko w opisach
const bezEmoji = (s = '') => String(s).replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, '').replace(/ {2,}/g, ' ');

// twarde spacje po krótkich słowach i między liczbą a słowem, żeby nie zostawały same na końcu linii
const twardeSpacje = (s) =>
  s
    .replace(/(\d) (?=[\p{L}%])/gu, '$1 ')
    .replace(/(^|[\s( ])([wizoauWIZOAU]) /g, '$1$2 ')
    .replace(/(^|[\s ])(do|od|na|po|za|we|ze|to|nie|Do|Od|Na|Po|Za|To|Nie) /g, '$1$2 ');

const md = (s = '') =>
  twardeSpacje(esc(bezEmoji(s).trim()))
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/==(.+?)==/g, '<mark>$1</mark>')
    .replace(/\n/g, '<br>');

// czarny albo biały tekst na danym tle (kontrast WCAG)
export function tekstNaTle(hex) {
  const [r, g, b] = hex
    .replace('#', '')
    .match(/../g)
    .map((x) => parseInt(x, 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  const jasnosc = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return jasnosc > 0.179 ? '#111111' : '#FFFFFF';
}

function css(w) {
  return `
${fonty()}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${SZEROKOSC}px;height:${WYSOKOSC}px}
body{font-family:Inter,sans-serif;-webkit-font-smoothing:antialiased;overflow:hidden}
.slajd{position:relative;width:100%;height:100%;padding:96px 88px 0;display:flex;flex-direction:column}
.ciemny{background:${w.tlo};color:${w.tekst}}
.jasny{background:${w.tlo_jasne};color:${w.tekst_ciemny}}
.akcentowy{background:${w.akcent};color:${tekstNaTle(w.akcent)}}
mark{background:${w.akcent};color:${tekstNaTle(w.akcent)};padding:0 .14em;border-radius:.12em;box-decoration-break:clone;-webkit-box-decoration-break:clone}
.akcentowy mark{background:${tekstNaTle(w.akcent)};color:${w.akcent}}
strong{font-weight:800}
.gora{display:flex;justify-content:space-between;align-items:center;font-weight:800;font-size:30px;letter-spacing:.18em}
.znak{display:flex;align-items:center;gap:16px}
.znak .r{display:block;width:44px;height:44px;--akcent-znaku:${w.akcent}}
.akcentowy .znak .r{--akcent-znaku:currentColor}
.licznik{font-weight:700;letter-spacing:.08em;opacity:.55}
.tresc{flex:1;display:flex;flex-direction:column;justify-content:center;min-height:0;padding:40px 0 48px;overflow:hidden}
.fit{overflow:hidden;max-height:100%}
.dol{height:120px;display:flex;justify-content:space-between;align-items:center;font-size:28px;font-weight:700;border-top:2px solid currentColor;border-color:color-mix(in srgb,currentColor 18%,transparent)}
.dol .strona{opacity:.6}
.dol .dalej{display:flex;align-items:center;gap:14px}
.dol .dalej b{display:inline-flex;align-items:center;justify-content:center;width:56px;height:56px;border-radius:50%;background:${w.akcent};color:${tekstNaTle(w.akcent)};font-size:30px}
.akcentowy .dol .dalej b{background:${tekstNaTle(w.akcent)};color:${w.akcent}}
.etykieta{font-size:30px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;opacity:.6;margin-bottom:36px}
h1{font-size:120px;line-height:1.1;font-weight:800;letter-spacing:-.035em}
h2{font-size:84px;line-height:1.12;font-weight:800;letter-spacing:-.03em}
.okladka h1+p{margin-top:48px}
p{font-size:44px;line-height:1.38;font-weight:400}
h2+p{margin-top:40px}
ol{list-style:none;margin-top:52px;display:flex;flex-direction:column;gap:30px}
li{display:flex;gap:30px;align-items:flex-start;font-size:42px;line-height:1.3}
li .nr{flex:none;width:68px;height:68px;border-radius:50%;background:${w.akcent};color:${tekstNaTle(w.akcent)};display:flex;align-items:center;justify-content:center;font-weight:800;font-size:32px;margin-top:-6px}
.cytat .znakcytatu{font-size:220px;line-height:.7;font-weight:800;color:${w.akcent};height:120px}
.cytat blockquote{font-size:72px;line-height:1.22;font-weight:800;letter-spacing:-.025em}
.cytat blockquote+p{margin-top:48px;opacity:.7}
.cta .przycisk{margin-top:64px;align-self:flex-start;display:inline-flex;align-items:center;gap:20px;padding:30px 44px;border-radius:999px;background:${tekstNaTle(w.akcent)};color:${w.akcent};font-size:40px;font-weight:800}
`;
}

function trescSlajdu(s) {
  switch (s.typ) {
    case 'okladka':
      return `<div class="fit">${s.etykieta ? `<div class="etykieta">${md(s.etykieta)}</div>` : ''}<h1>${md(s.naglowek)}</h1>${s.tekst ? `<p>${md(s.tekst)}</p>` : ''}</div>`;
    case 'tekst':
      return `<div class="fit">${s.etykieta ? `<div class="etykieta">${md(s.etykieta)}</div>` : ''}<h2>${md(s.naglowek)}</h2>${s.tekst ? `<p>${md(s.tekst)}</p>` : ''}</div>`;
    case 'lista':
      return `<div class="fit"><h2>${md(s.naglowek)}</h2><ol>${(s.punkty ?? [])
        .map((p, i) => `<li><span class="nr">${i + 1}</span><span>${md(p)}</span></li>`)
        .join('')}</ol></div>`;
    case 'cytat':
      return `<div class="fit"><div class="znakcytatu">“</div><blockquote>${md(s.naglowek)}</blockquote>${s.tekst ? `<p>${md(s.tekst)}</p>` : ''}</div>`;
    case 'cta':
      return `<div class="fit"><h2>${md(s.naglowek)}</h2>${s.tekst ? `<p>${md(s.tekst)}</p>` : ''}${s.przycisk ? `<div class="przycisk">${md(s.przycisk)} <span>→</span></div>` : ''}</div>`;
    default:
      throw new Error(`Nieznany typ slajdu "${s.typ}" (dozwolone: ${TYPY_SLAJDOW.join(', ')})`);
  }
}

// znak Revion: geometryczne „R”, noga w kolorze akcentu
const ZNAK = `<svg class="r" viewBox="0 0 100 100" aria-hidden="true"><rect x="21" y="15" width="12" height="70" fill="currentColor"/><path d="M33 15h23a18.5 18.5 0 0 1 0 37H33V40.5h23a7 7 0 0 0 0-14H33z" fill="currentColor"/><path d="M46 52h13.5l21 33H67z" fill="var(--akcent-znaku)"/></svg>`;

const TLO = { okladka: 'ciemny', tekst: 'jasny', lista: 'jasny', cytat: 'ciemny', cta: 'akcentowy' };

export function htmlSlajdu(slajd, nr, razem, ustawienia) {
  const w = ustawienia.wyglad;
  const domena = new URL(ustawienia.link).hostname.replace(/^www\./, '');
  const stopka =
    nr < razem
      ? `<span class="strona">${esc(domena)}</span><span class="dalej">Przesuń <b>→</b></span>`
      : `<span class="strona">${esc(domena)}</span><span class="strona">${esc(ustawienia.marka)}</span>`;
  return `<!doctype html><html lang="pl"><head><meta charset="utf-8"><style>${css(w)}</style></head><body>
<div class="slajd ${TLO[slajd.typ] ?? 'jasny'} ${slajd.typ}">
  <div class="gora"><span class="znak">${ZNAK}${esc(w.logo_tekst ?? ustawienia.marka)}</span>${razem > 1 ? `<span class="licznik">${nr}/${razem}</span>` : ''}</div>
  <div class="tresc">${trescSlajdu(slajd)}</div>
  <div class="dol">${stopka}</div>
</div></body></html>`;
}

// zmniejsza czcionkę w .fit, aż treść się zmieści; zwraca false, gdy nie da się zmieścić czytelnie
const DOPASUJ = () => {
  const fit = document.querySelector('.fit');
  const pudlo = document.querySelector('.tresc');
  let skala = 1;
  const wysokoscWnetrza = () => pudlo.clientHeight - 88; // padding .tresc
  while (fit.scrollHeight > wysokoscWnetrza() && skala > 0.7) {
    skala -= 0.03;
    fit.style.zoom = String(skala);
  }
  return fit.scrollHeight <= wysokoscWnetrza() + 1;
};

let przegladarka = null;
async function strona() {
  if (!przegladarka) {
    const { chromium } = await import('playwright');
    przegladarka = await chromium.launch(process.env.PLAYWRIGHT_EXECUTABLE ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE } : {});
  }
  return przegladarka.newPage({ viewport: { width: SZEROKOSC, height: WYSOKOSC }, deviceScaleFactor: 1 });
}

export async function zamknijPrzegladarke() {
  await przegladarka?.close();
  przegladarka = null;
}

// renderuje slajdy posta do katalogu jako 01.jpg, 02.jpg…; zwraca listę nazw plików
export async function renderujPost(post, katalog, ustawienia) {
  const slajdy = post.slajdy ?? [];
  if (!slajdy.length) throw new Error(`Post "${post.id}" nie ma slajdów`);
  if (slajdy.length > 10) throw new Error(`Post "${post.id}" ma ${slajdy.length} slajdów (maksymalnie 10)`);
  const pliki = [];
  const p = await strona();
  try {
    for (const [i, slajd] of slajdy.entries()) {
      await p.setContent(htmlSlajdu(slajd, i + 1, slajdy.length, ustawienia), { waitUntil: 'load' });
      await p.evaluate(() => document.fonts.ready);
      if (!(await p.evaluate(DOPASUJ))) {
        throw new Error(`Post "${post.id}", slajd ${i + 1}: za dużo tekstu, skróć go`);
      }
      const nazwa = `${String(i + 1).padStart(2, '0')}.jpg`;
      writeFileSync(join(katalog, nazwa), await p.screenshot({ type: 'jpeg', quality: 92 }));
      pliki.push(nazwa);
    }
  } finally {
    await p.close();
  }
  return pliki;
}

async function main() {
  const pliki = process.argv.slice(2);
  if (!pliki.length) {
    console.error('Użycie: node src/grafiki.mjs <post.json> [kolejne…]');
    process.exitCode = 1;
    return;
  }
  const ustawienia = wczytajUstawienia();
  try {
    for (const plik of pliki) {
      const post = JSON.parse(readFileSync(plik, 'utf8'));
      post.grafiki = await renderujPost(post, dirname(plik), ustawienia);
      writeFileSync(plik, JSON.stringify(post, null, 2) + '\n');
      console.log(`${plik}: ${post.grafiki.length} grafik`);
    }
  } finally {
    await zamknijPrzegladarke();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(async (e) => {
    console.error(e.message);
    await zamknijPrzegladarke();
    process.exitCode = 1;
  });
}
