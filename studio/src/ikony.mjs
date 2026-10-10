// Pakiet 50 ikon do Notion w stylu Revion (glify Lucide, licencja ISC) w dwóch wariantach:
// "neon" (przezroczyste tło, do jasnego i ciemnego motywu) i "kafel" (ciemny kafelek z poświatą).
// Użycie: node src/ikony.mjs  -> produkty/ikony-notion/{neon,kafel}/*.png, podglad.png, Pakiet-Ikon-Revion.zip
import { readFileSync, copyFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { REVION, STUDIO, KOLORY, cssFontow, htmlDoPng, zamknij } from './wspolne.mjs';
import { znak, napis } from './logo.mjs';

export const IKONY = [
  ['kokpit', 'layout-dashboard'], ['dom', 'house'], ['dzis', 'sun'], ['inbox', 'inbox'], ['zadania', 'square-check-big'],
  ['lista', 'list-todo'], ['kalendarz', 'calendar-days'], ['projekty', 'square-kanban'], ['cele', 'target'], ['kamien-milowy', 'flag'],
  ['nawyki', 'repeat'], ['seria', 'flame'], ['energia', 'zap'], ['skupienie', 'focus'], ['timer', 'timer'],
  ['czas', 'clock'], ['klepsydra', 'hourglass'], ['sen', 'moon'], ['kawa', 'coffee'], ['trening', 'dumbbell'],
  ['zdrowie', 'heart-pulse'], ['woda', 'droplets'], ['dieta', 'apple'], ['odpoczynek', 'bed'], ['natura', 'leaf'],
  ['finanse', 'wallet'], ['oszczednosci', 'piggy-bank'], ['wydatki', 'receipt-text'], ['karta', 'credit-card'], ['gotowka', 'banknote'],
  ['wzrost', 'trending-up'], ['wykres', 'chart-column'], ['budzet', 'chart-pie'], ['zakupy', 'shopping-cart'], ['praca', 'briefcase'],
  ['wiedza', 'book-open'], ['notatki', 'notebook-pen'], ['drugi-mozg', 'brain-circuit'], ['pomysly', 'lightbulb'], ['nauka', 'graduation-cap'],
  ['archiwum', 'archive'], ['folder', 'folder-open'], ['tworczosc', 'pen-tool'], ['kod', 'code'], ['ludzie', 'users'],
  ['podroze', 'plane'], ['kierunek', 'compass'], ['wyzwanie', 'mountain'], ['sukces', 'trophy'], ['start', 'rocket'],
];

const LUCIDE = join(STUDIO, 'node_modules', 'lucide-static');

function glif(nazwa, { kolor = 'url(#g)', grubosc = 1.7 } = {}) {
  const svg = readFileSync(join(LUCIDE, 'icons', `${nazwa}.svg`), 'utf8');
  const srodek = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${kolor}" stroke-width="${grubosc}" stroke-linecap="round" stroke-linejoin="round">
  <defs><linearGradient id="g" gradientUnits="userSpaceOnUse" x1="2" y1="2" x2="22" y2="22"><stop offset="0" stop-color="#E9FDFF"/><stop offset=".45" stop-color="#00E5FF"/><stop offset="1" stop-color="#00A8C8"/></linearGradient></defs>${srodek}</svg>`;
}

const strona = (tresc) => `<!doctype html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}html,body{width:256px;height:256px;background:transparent;overflow:hidden}
.k{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}
.kafel{position:absolute;inset:14px;border-radius:56px;background:radial-gradient(90% 90% at 30% 15%,#1A2944 0%,#0B1120 55%,#05060A 100%);
  box-shadow:inset 0 0 0 1.5px rgba(0,229,255,.22),inset 0 1px 0 rgba(255,255,255,.08)}
.kafel::after{content:'';position:absolute;inset:0;border-radius:inherit;background:radial-gradient(60% 50% at 50% 55%,rgba(0,229,255,.16),transparent 70%)}
svg{position:relative;filter:drop-shadow(0 0 6px rgba(0,229,255,.55))}
</style></head><body>${tresc}</body></html>`;

async function main() {
  const cel = join(REVION, 'produkty', 'ikony-notion');
  rmSync(cel, { recursive: true, force: true });
  for (const [i, [nazwa, lucide]] of IKONY.entries()) {
    const plik = `${String(i + 1).padStart(2, '0')}-${nazwa}.png`;
    await htmlDoPng(strona(`<div class="k">${glif(lucide).replace('<svg ', '<svg width="168" height="168" ')}</div>`), join(cel, 'neon', plik), { szerokosc: 256, wysokosc: 256, skala: 2, przezroczyste: true });
    await htmlDoPng(strona(`<div class="kafel"></div><div class="k">${glif(lucide, { grubosc: 1.8 }).replace('<svg ', '<svg width="132" height="132" ')}</div>`), join(cel, 'kafel', plik), { szerokosc: 256, wysokosc: 256, skala: 2, przezroczyste: true });
  }
  // podgląd do sprzedaży: wszystkie kafle na ciemnym tle
  const siatka = IKONY.map(([nazwa]) => nazwa);
  const podglad = `<!doctype html><html><head><meta charset="utf-8"><style>${cssFontow(['archivo', 'inter', 'mono'])}
  *{margin:0;padding:0;box-sizing:border-box}html,body{width:1600px;height:1100px;overflow:hidden;background:radial-gradient(70% 60% at 50% 30%,#13213A,#05060A 75%)}
  .g{position:absolute;left:90px;top:250px;display:grid;grid-template-columns:repeat(10,1fr);gap:22px 22px;width:1420px}
  .g div{display:flex;flex-direction:column;align-items:center;gap:8px}
  .g img{width:118px;height:118px}
  .g span{font:600 11px/1 'JetBrains Mono Variable';letter-spacing:.06em;color:#6F7A8D;text-transform:uppercase}
  .h{position:absolute;left:96px;top:84px;right:96px;display:flex;justify-content:space-between;align-items:flex-end}
  .t{font:900 64px/1 'Archivo Variable';font-stretch:125%;letter-spacing:-.03em;color:#fff;text-transform:uppercase}
  .t em{font-style:normal;color:#00E5FF}
  .p{font:500 18px/1.45 'Inter Variable';color:#8A94A6;text-align:right}
  </style></head><body><div class="h"><div><div style="display:flex;align-items:center;gap:14px;margin-bottom:22px">${znak({ rozmiar: 34 })}${napis({ rozmiar: 14 })}</div><div class="t">50 ikon <em>do Notion</em></div></div><div class="p">2 warianty: neon i kafel<br>512 × 512 px, przezroczyste tło</div></div>
  <div class="g">${siatka.map((n, i) => `<div><img src="${pathToFileURL(join(cel, 'kafel', `${String(i + 1).padStart(2, '0')}-${n}.png`)).href}"><span>${n.replace(/-/g, ' ')}</span></div>`).join('')}</div></body></html>`;
  await htmlDoPng(podglad, join(cel, 'podglad.png'), { szerokosc: 1600, wysokosc: 1100, skala: 1 });
  rmSync(join(cel, 'podglad.html'));
  for (const w of ['neon', 'kafel']) {
    execFileSync('sh', ['-c', `rm -f '${join(cel, w)}'/*.html`]);
  }
  copyFileSync(join(LUCIDE, 'LICENSE'), join(cel, 'LICENCJA-Lucide.txt'));
  writeFileSync(
    join(cel, 'JAK-UZYWAC.txt'),
    [
      'Pakiet 50 ikon Revion do Notion',
      '',
      'Folder "neon": ikony na przezroczystym tle (wyglądają dobrze w jasnym i ciemnym motywie Notion).',
      'Folder "kafel": ikony na ciemnym kafelku (najlepsze w ciemnym motywie).',
      '',
      'Jak ustawić ikonę strony w Notion:',
      '1. Najedź na tytuł strony i kliknij "Dodaj ikonę" (albo kliknij obecną ikonę).',
      '2. Wybierz zakładkę "Prześlij" (Upload) i wskaż plik PNG z tego pakietu.',
      '3. Ikona pojawi się przy stronie, w pasku bocznym i w bazach danych.',
      '',
      'Licencja: na użytek własny (szczegóły w regulaminie revion.pl).',
      'Glify pochodzą z biblioteki Lucide (licencja ISC, treść w pliku LICENCJA-Lucide.txt).',
      '',
    ].join('\r\n'),
  );
  execFileSync('zip', ['-qr', 'Pakiet-Ikon-Revion.zip', 'neon', 'kafel', 'LICENCJA-Lucide.txt', 'JAK-UZYWAC.txt'], { cwd: cel });
  console.log(`Ikony: ${IKONY.length} × 2 warianty w ${cel}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main()
    .catch((e) => {
      console.error(e.message);
      process.exitCode = 1;
    })
    .finally(zamknij);
}
