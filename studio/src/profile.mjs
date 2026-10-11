// Grafiki profili Revion: zdjęcie profilowe (FB/IG/TikTok), okładka strony na Facebooku, okładki wyróżnionych relacji IG.
// Użycie: node src/profile.mjs  -> grafiki/*.png
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { REVION, KOLORY, cssFontow, htmlDoPng, zamknij } from './wspolne.mjs';
import { znak, napis } from './logo.mjs';

const G = join(REVION, 'grafiki');

const strona = (w, h, tresc, css = '') => `<!doctype html><html lang="pl"><head><meta charset="utf-8"><style>
${cssFontow(['archivo', 'inter', 'mono', 'literata'])}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${w}px;height:${h}px;overflow:hidden;background:${KOLORY.atrament};color:#fff;font-family:'Inter Variable'}
.siatka{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);background-size:44px 44px}
${css}</style></head><body>${tresc}</body></html>`;

// zdjęcie profilowe: znak na ciemnym tle z poświatą (czytelny także w kółku 40 px)
function avatar() {
  return strona(540, 540, `<div class="t"></div><div class="z">${znak({ rozmiar: 300 })}</div>`, `
  .t{position:absolute;inset:0;background:radial-gradient(60% 60% at 50% 45%,#16263F 0%,#0A1222 55%,#05060A 100%)}
  .t::after{content:'';position:absolute;inset:0;background:radial-gradient(35% 35% at 58% 62%,rgba(0,229,255,.20),transparent 70%)}
  .z{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}
  .z svg{filter:drop-shadow(0 10px 30px rgba(0,0,0,.6)) drop-shadow(0 0 22px rgba(0,229,255,.18))}`);
}

// okładka FB 1640×924: ważna treść w środkowym pasie 1640×624 (widoczny na telefonie i komputerze)
function okladkaFb({ tytul, akcent, podpis }) {
  const karty = `
    <div class="ui">
      <div class="karta k1"><b>Dziś</b><i class="l w80"></i><i class="l w60 c"></i><i class="l w70"></i></div>
      <div class="karta k2"><b>Nawyki</b><div class="kropki">${Array.from({ length: 21 }, (_, i) => `<s class="${[4, 11].includes(i) ? 'p' : i < 17 ? 'z' : ''}"></s>`).join('')}</div></div>
      <div class="karta k3"><b>Cele</b><div class="pasek"><span style="width:72%"></span></div><div class="pasek"><span style="width:45%"></span></div></div>
    </div>`;
  return strona(820, 462, `<div class="tlo"></div><div class="siatka"></div>${karty}
    <div class="tekst"><div class="logo">${znak({ rozmiar: 30 })}${napis({ rozmiar: 12 })}</div>
    <div class="h">${tytul}<br><em>${akcent}</em></div><div class="p">${podpis}</div></div>`, `
  .tlo{position:absolute;inset:0;background:radial-gradient(60% 90% at 78% 50%,rgba(0,229,255,.16),transparent 60%),linear-gradient(90deg,#05060A 0%,#0B1120 100%)}
  .siatka{mask-image:linear-gradient(90deg,transparent 30%,#000 75%);-webkit-mask-image:linear-gradient(90deg,transparent 30%,#000 75%)}
  .tekst{position:absolute;left:60px;top:50%;transform:translateY(-50%)}
  .logo{display:flex;align-items:center;gap:10px;margin-bottom:18px}
  .h{font:900 40px/.98 'Archivo Variable';font-stretch:122%;letter-spacing:-.03em;text-transform:uppercase}
  .h em{font-style:normal;background:linear-gradient(170deg,#fff,#AEB8C7 55%,#E3E8EF);-webkit-background-clip:text;color:transparent}
  .p{margin-top:14px;font:400 14px/1.45 'Literata Variable';color:#9AA6B6;max-width:330px}
  .ui{position:absolute;right:18px;top:50%;transform:translateY(-50%) perspective(900px) rotateY(-14deg) rotateX(4deg);width:330px;height:250px}
  .karta{position:absolute;background:rgba(17,26,46,.78);border:1px solid rgba(0,229,255,.18);border-radius:14px;padding:14px 16px;box-shadow:0 20px 50px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.06);backdrop-filter:blur(6px)}
  .karta b{display:block;font:700 10px/1 'JetBrains Mono Variable';letter-spacing:.18em;text-transform:uppercase;color:#00E5FF;margin-bottom:12px}
  .k1{left:0;top:0;width:190px}
  .k2{left:120px;top:78px;width:210px;z-index:2}
  .k3{left:20px;top:168px;width:180px}
  .l{display:block;height:8px;border-radius:4px;background:rgba(214,224,236,.18);margin:8px 0}
  .l.c{background:rgba(0,229,255,.55)}
  .w80{width:80%}.w60{width:60%}.w70{width:70%}
  .kropki{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}
  .kropki s{display:block;height:18px;border-radius:4px;border:1px solid rgba(214,224,236,.2)}
  .kropki s.z{background:rgba(0,229,255,.75);border-color:transparent;box-shadow:0 0 8px rgba(0,229,255,.4)}
  .kropki s.p{border-color:rgba(214,224,236,.35)}
  .pasek{height:8px;border-radius:4px;background:rgba(214,224,236,.15);margin:10px 0}
  .pasek span{display:block;height:100%;border-radius:4px;background:linear-gradient(90deg,#00A8C8,#00E5FF)}`);
}

// okładka wyróżnionej relacji (IG ucina do koła w środku)
function wyroznienie(ikona, podpis) {
  return strona(540, 960, `<div class="t"></div><div class="k"><div class="o">${ikona}</div><div class="p">${podpis}</div></div>`, `
  .t{position:absolute;inset:0;background:radial-gradient(50% 30% at 50% 50%,#13213A,#05060A 80%)}
  .k{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px}
  .o{width:250px;height:250px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:radial-gradient(70% 70% at 35% 25%,#1A2944,#0B1120 60%,#05060A);box-shadow:inset 0 0 0 2px rgba(0,229,255,.28),0 0 40px rgba(0,229,255,.12)}
  .o svg{width:110px;height:110px;filter:drop-shadow(0 0 8px rgba(0,229,255,.6))}
  .p{font:700 15px/1 'JetBrains Mono Variable';letter-spacing:.24em;text-transform:uppercase;color:#8A94A6;opacity:0}`);
}

// obraz do udostępniania linku (Open Graph) 1200×630: Facebook, Messenger, WhatsApp, LinkedIn
function obrazOg({ tytul, akcent, podpis, ebooki }) {
  return strona(600, 315, `<div class="tlo"></div><div class="siatka"></div>
    <div class="tekst"><div class="logo">${znak({ rozmiar: 24 })}${napis({ rozmiar: 10 })}</div>
    <div class="h">${tytul}<br><em>${akcent}</em></div><div class="p">${podpis}</div><div class="cta">revion.pl</div></div>
    <img class="ks" src="${ebooki}">`, `
  .tlo{position:absolute;inset:0;background:radial-gradient(60% 90% at 80% 55%,rgba(0,229,255,.18),transparent 62%),linear-gradient(90deg,#05060A,#0B1120)}
  .siatka{background-size:30px 30px;mask-image:linear-gradient(90deg,transparent 35%,#000 80%);-webkit-mask-image:linear-gradient(90deg,transparent 35%,#000 80%)}
  .tekst{position:absolute;left:38px;top:50%;transform:translateY(-50%);width:285px;z-index:2}
  .logo{display:flex;align-items:center;gap:8px;margin-bottom:14px}
  .h{font:900 27px/1 'Archivo Variable';font-stretch:120%;letter-spacing:-.03em}
  .h em{font-style:normal;background:linear-gradient(170deg,#fff,#AEB8C7 55%,#E3E8EF);-webkit-background-clip:text;color:transparent}
  .p{margin-top:10px;font:400 11px/1.45 'Literata Variable';color:#9AA6B6}
  .cta{display:inline-block;margin-top:14px;padding:6px 12px;border-radius:99px;background:#00E5FF;color:#03131A;font:800 10px/1 'Inter Variable';letter-spacing:.04em}
  .ks{position:absolute;right:-36px;top:50%;transform:translateY(-50%);width:360px}`);
}

export async function grafikiProfili({ fb, ikonySvg, og }) {
  if (og) await htmlDoPng(obrazOg(og), join(G, 'obraz-udostepniania-og.png'), { szerokosc: 600, wysokosc: 315, skala: 2 });
  await htmlDoPng(avatar(), join(G, 'zdjecie-profilowe.png'), { szerokosc: 540, wysokosc: 540, skala: 2 });
  await htmlDoPng(okladkaFb(fb), join(G, 'okladka-facebook.png'), { szerokosc: 820, wysokosc: 462, skala: 2 });
  for (const [nazwa, svg] of Object.entries(ikonySvg)) {
    await htmlDoPng(wyroznienie(svg, nazwa), join(G, 'wyroznione-ig', `${nazwa}.png`), { szerokosc: 540, wysokosc: 960, skala: 2 });
  }
}

async function main() {
  const { readFileSync } = await import('node:fs');
  const { STUDIO } = await import('./wspolne.mjs');
  const lucide = (n) =>
    readFileSync(join(STUDIO, 'node_modules', 'lucide-static', 'icons', `${n}.svg`), 'utf8')
      .replace(/stroke="currentColor"/, 'stroke="#00E5FF"')
      .replace(/stroke-width="2"/, 'stroke-width="1.6"')
      .replace(/width="24"/, '')
      .replace(/height="24"/, '');
  await grafikiProfili({
    fb: { tytul: 'Mniej chaosu.', akcent: 'Więcej systemu.', podpis: 'Szablon do Notion i ebooki, które porządkują dzień, nawyki i finanse.' },
    og: {
      tytul: 'Przestań nosić',
      akcent: 'wszystko w\u00a0głowie.',
      podpis: 'Zadania, nawyki, cele i finanse w\u00a0jednym pulpicie Notion. Po polsku.',
      ebooki: pathToFileURL(join(G, 'pakiet-ebookow-3d-przezroczysty.png')).href,
    },
    ikonySvg: {
      'life-os': lucide('layout-dashboard'),
      ebooki: lucide('book-open'),
      'za-darmo': lucide('gift'),
      faq: lucide('message-circle-question'),
      'od-srodka': lucide('eye'),
    },
  });
  console.log('Grafiki profili gotowe.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main()
    .catch((e) => {
      console.error(e.message);
      process.exitCode = 1;
    })
    .finally(zamknij);
}
