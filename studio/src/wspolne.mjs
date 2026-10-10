// Wspólne dla studia graficznego Revion: kolory marki, fonty (z polskimi znakami), renderowanie HTML -> PNG/PDF.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const STUDIO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const REVION = resolve(STUDIO, '..');
const MODULY = join(STUDIO, 'node_modules');

export const KOLORY = {
  atrament: '#05060A', // tło główne (prawie czarne)
  noc: '#0B1120', // granat
  noc2: '#111A2E',
  stal: '#8A94A6',
  srebro: '#D7DEE8',
  cyjan: '#00E5FF', // akcent marki (ekran)
  cyjanDruk: '#007C8C', // akcent na jasnym tle (kontrast WCAG AA)
  papier: '#F6F7F9',
  tekst: '#171B24',
};

// Fonty z pakietów @fontsource-variable, z pełnymi ścieżkami (strona musi być otwarta z pliku, nie setContent)
const FONTY = {
  archivo: ['@fontsource-variable/archivo', 'standard.css'],
  inter: ['@fontsource-variable/inter', 'standard.css'],
  'inter-italic': ['@fontsource-variable/inter', 'standard-italic.css'],
  literata: ['@fontsource-variable/literata', 'standard.css'],
  'literata-italic': ['@fontsource-variable/literata', 'standard-italic.css'],
  mono: ['@fontsource-variable/jetbrains-mono', 'index.css'],
  unbounded: ['@fontsource-variable/unbounded', 'index.css'],
  grotesk: ['@fontsource-variable/space-grotesk', 'index.css'],
};

export function cssFontow(nazwy = Object.keys(FONTY)) {
  return nazwy
    .map((n) => {
      const [pakiet, plik] = FONTY[n];
      const katalog = join(MODULY, pakiet);
      const css = readFileSync(join(katalog, plik), 'utf8');
      // tylko latin i latin-ext (polskie znaki), z adresami file://
      return css
        .split('/*')
        .filter((blok) => /latin/.test(blok.split('*/')[0]) && !/cyrillic|greek|vietnamese/.test(blok.split('*/')[0]))
        .map((blok) => `/*${blok}`)
        .join('')
        .replace(/url\(\.\/files\//g, `url(${pathToFileURL(join(katalog, 'files')).href}/`);
    })
    .join('\n');
}

export const PAGED_JS = pathToFileURL(join(MODULY, 'pagedjs', 'dist', 'paged.polyfill.js')).href;

let przegladarka = null;
export async function przegladarkaRevion() {
  if (!przegladarka) {
    const { chromium } = await import('playwright');
    przegladarka = await chromium.launch();
  }
  return przegladarka;
}

export async function zamknij() {
  await przegladarka?.close();
  przegladarka = null;
}

// zapisuje HTML obok wyniku i robi zrzut PNG w zadanym rozmiarze (skala 1–3 dla ostrości)
export async function htmlDoPng(html, plikPng, { szerokosc, wysokosc, skala = 2, przezroczyste = false } = {}) {
  mkdirSync(dirname(plikPng), { recursive: true });
  const plikHtml = plikPng.replace(/\.png$/, '.html');
  writeFileSync(plikHtml, html);
  const b = await przegladarkaRevion();
  const p = await b.newPage({ viewport: { width: szerokosc, height: wysokosc }, deviceScaleFactor: skala });
  try {
    await p.goto(pathToFileURL(plikHtml).href, { waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);
    // strony mogą dopasować tekst do szerokości (np. tytuły okładek) po załadowaniu fontów
    await p.evaluate(() => (typeof window.dopasuj === 'function' ? window.dopasuj() : null));
    await p.waitForTimeout(150);
    await p.screenshot({ path: plikPng, omitBackground: przezroczyste, type: 'png' });
  } finally {
    await p.close();
  }
  return plikPng;
}

// skład książki przez Paged.js (spis treści z numerami stron, żywe paginy) -> PDF
export async function htmlDoPdf(html, plikPdf) {
  mkdirSync(dirname(plikPdf), { recursive: true });
  const plikHtml = plikPdf.replace(/\.pdf$/, '.html');
  writeFileSync(plikHtml, html);
  const b = await przegladarkaRevion();
  const p = await b.newPage();
  const bledy = [];
  p.on('pageerror', (e) => bledy.push(e.message));
  try {
    await p.goto(pathToFileURL(plikHtml).href, { waitUntil: 'load' });
    await p.waitForFunction(() => window.__sklad === 'gotowe', null, { timeout: 180000 });
    if (bledy.length) throw new Error(`Błędy w składzie: ${bledy.join('; ')}`);
    const strony = await p.evaluate(() => document.querySelectorAll('.pagedjs_page').length);
    await p.pdf({ path: plikPdf, preferCSSPageSize: true, printBackground: true, tagged: true, outline: true });
    return strony;
  } finally {
    await p.close();
  }
}
