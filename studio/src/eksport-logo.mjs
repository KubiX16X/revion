// Eksport logo Revion: znak SVG (3 warianty), favicon, logo poziome PNG (przezroczyste tło).
// Użycie: node src/eksport-logo.mjs  -> grafiki/logo/
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { REVION, cssFontow, htmlDoPng, zamknij } from './wspolne.mjs';
import { znak, napis } from './logo.mjs';

const L = join(REVION, 'grafiki', 'logo');
mkdirSync(L, { recursive: true });
for (const w of ['stal', 'atrament', 'bialy']) writeFileSync(join(L, `znak-${w}.svg`), znak({ wariant: w, rozmiar: 512 }));
// favicon: znak na ciemnym kafelku
writeFileSync(join(L, 'favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="#05060A"/><g transform="translate(8 8) scale(.84)"><rect x="21" y="15" width="12" height="70" fill="#E3E8EF"/><path d="M33 15h23a18.5 18.5 0 0 1 0 37H33V40.5h23a7 7 0 0 0 0-14H33z" fill="#E3E8EF"/><path d="M46 52h13.5l21 33H67z" fill="#00E5FF"/></g></svg>`);
const poziome = (wariant, kolor) => `<!doctype html><html><head><meta charset="utf-8"><style>${cssFontow(['archivo'])}
html,body{margin:0;width:640px;height:160px;background:transparent}
.l{height:160px;display:flex;align-items:center;gap:22px;padding-left:10px}</style></head>
<body><div class="l">${znak({ wariant, rozmiar: 120 })}${napis({ kolor, rozmiar: 44 })}</div></body></html>`;
try {
  await htmlDoPng(poziome('stal', '#E6EBF2'), join(L, 'logo-poziome-na-ciemne.png'), { szerokosc: 640, wysokosc: 160, skala: 3, przezroczyste: true });
  await htmlDoPng(poziome('atrament', '#0B1120'), join(L, 'logo-poziome-na-jasne.png'), { szerokosc: 640, wysokosc: 160, skala: 3, przezroczyste: true });
  rmSync(join(L, 'logo-poziome-na-ciemne.html'));
  rmSync(join(L, 'logo-poziome-na-jasne.html'));
} finally {
  await zamknij();
}
console.log('Logo wyeksportowane do', L);
