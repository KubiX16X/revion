// Okładki stron szablonu Revion Life OS w Notion (1500×600). Ważna treść w środku kadru:
// Notion przycina okładkę z góry i z dołu na komputerze, a z boków na telefonie.
// Użycie: node src/notion.mjs  -> grafiki/notion/okladka-*.jpg
import { mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { REVION, KOLORY, cssFontow, htmlDoPng, zamknij } from './wspolne.mjs';
import { znak, napis } from './logo.mjs';

const CEL = join(REVION, 'grafiki', 'notion');

const OKLADKI = [
  { plik: 'kokpit', tytul: 'Główny Kokpit', podpis: 'Dziś · Inbox · Projekty · Nawyki' },
  { plik: 'inbox', tytul: 'Inbox', podpis: 'Wrzuć w kilka sekund, uporządkuj wieczorem' },
  { plik: 'zadania', tytul: 'Zadania', podpis: 'Trzy priorytety na dziś, reszta czeka w kolejce' },
  { plik: 'projekty', tytul: 'Projekty', podpis: 'Duże rzeczy rozbite na małe kroki' },
  { plik: 'cele', tytul: 'Cele i nawyki', podpis: 'Codzienna tabelka i cele z postępem' },
  { plik: 'finanse', tytul: 'Finanse', podpis: 'Przychody, wydatki i stałe opłaty' },
  { plik: 'wiedza', tytul: 'Biblioteka wiedzy', podpis: 'Książki, kursy i notatki w jednym miejscu' },
  { plik: 'start', tytul: 'Jak zacząć', podpis: 'Pierwsze 10 minut z Life OS' },
];

const html = ({ tytul, podpis }) => `<!doctype html><html lang="pl"><head><meta charset="utf-8"><style>
${cssFontow(['archivo', 'inter', 'mono'])}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1500px;height:600px;overflow:hidden;background:${KOLORY.atrament};color:#fff}
.tlo{position:absolute;inset:0;background:
  radial-gradient(45% 80% at 50% 50%,rgba(0,229,255,.13),transparent 65%),
  radial-gradient(70% 120% at 50% 120%,#0E1A2E 0%,transparent 60%),
  linear-gradient(180deg,#05060A 0%,#0B1120 100%)}
.siatka{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px);background-size:50px 50px;background-position:25px 0;
  mask-image:radial-gradient(60% 70% at 50% 50%,#000 20%,transparent 75%);-webkit-mask-image:radial-gradient(60% 70% at 50% 50%,#000 20%,transparent 75%)}
.srodek{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;align-items:center;text-align:center}
.logo{display:flex;align-items:center;gap:12px;margin-bottom:22px;opacity:.95}
.logo .os{font:600 13px/1 'JetBrains Mono Variable';letter-spacing:.32em;color:${KOLORY.cyjan};margin-left:4px}
h1{font:900 74px/1 'Archivo Variable';font-stretch:118%;letter-spacing:-.01em;
  background:linear-gradient(180deg,#FFFFFF 0%,#C9D6E6 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
.kreska{width:84px;height:3px;border-radius:2px;background:${KOLORY.cyjan};box-shadow:0 0 18px rgba(0,229,255,.7);margin:22px 0 16px}
p{font:500 19px/1.3 'Inter Variable';color:#9FB0C4;letter-spacing:.01em}
</style></head><body><div class="tlo"></div><div class="siatka"></div>
<div class="srodek"><div class="logo">${znak({ rozmiar: 30 })}${napis({ rozmiar: 13 })}<span class="os">LIFE OS</span></div>
<h1>${tytul}</h1><div class="kreska"></div><p>${podpis}</p></div></body></html>`;

async function main() {
  mkdirSync(CEL, { recursive: true });
  for (const o of OKLADKI) {
    const png = join(CEL, `okladka-${o.plik}.png`);
    await htmlDoPng(html(o), png, { szerokosc: 1500, wysokosc: 600, skala: 1 });
    // JPEG: kilka razy mniejszy plik, Notion i tak kompresuje okładki
    execFileSync('python3', ['-c', `from PIL import Image; Image.open(${JSON.stringify(png)}).convert('RGB').save(${JSON.stringify(png.replace(/\.png$/, '.jpg'))}, quality=90, optimize=True, progressive=True)`]);
    rmSync(png);
    rmSync(png.replace(/\.png$/, '.html'), { force: true });
  }
  console.log(`Okładki Notion: ${OKLADKI.length} w ${CEL}`);
}

main().finally(zamknij);
