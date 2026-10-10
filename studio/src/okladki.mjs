// Okładki serii „Biblioteka Revion” (A5, 1748×2480 px = 300 dpi) i mockupy 3D.
// Użycie: node src/okladki.mjs   -> produkty/<ebook>/okladka.png, mockup-3d.png, grafiki/pakiet-3d.png
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { KOLORY, REVION, cssFontow, htmlDoPng, zamknij } from './wspolne.mjs';
import { znak, napis } from './logo.mjs';

const W = 874; // CSS px (x2 = 1748 px)
const H = 1240;

// powtarzalny „los” (te same okładki przy każdym renderze)
function los(ziarno) {
  let s = ziarno;
  return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
}

const ZIARNO_SZUMU = `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`;
const ziarno = `url("data:image/svg+xml;utf8,${encodeURIComponent(ZIARNO_SZUMU)}")`;

const baza = (tresc, dodatkoweCss = '') => `<!doctype html><html lang="pl"><head><meta charset="utf-8"><style>
${cssFontow(['archivo', 'inter', 'mono', 'literata'])}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:${KOLORY.atrament}}
.ok{position:relative;width:${W}px;height:${H}px;overflow:hidden;color:#fff;font-family:'Inter Variable'}
.ziarno{position:absolute;inset:0;background-image:${ziarno};opacity:.07;mix-blend-mode:overlay;pointer-events:none}
.gora{position:absolute;top:58px;left:64px;right:64px;display:flex;justify-content:space-between;align-items:center}
.seria{font:600 13px/1 'JetBrains Mono Variable';letter-spacing:.24em;text-transform:uppercase;color:#8A94A6}
.dol{position:absolute;left:64px;right:64px;bottom:56px;display:flex;justify-content:space-between;align-items:center;
  border-top:1px solid rgba(255,255,255,.12);padding-top:26px}
.dol .opis{font:500 13px/1.4 'Inter Variable';color:#8A94A6;letter-spacing:.04em;text-align:right}
.tytul{display:block;width:100%;font-family:'Archivo Variable';font-weight:900;font-stretch:125%;letter-spacing:-.035em;line-height:.9;text-transform:uppercase;padding-top:.06em}
.metal{background:linear-gradient(170deg,#FFFFFF 0%,#D9E0EA 38%,#8F9BAE 52%,#EEF2F7 64%,#A7B2C3 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
.podtytul{font:400 23px/1.42 'Literata Variable';color:#B9C3D1}
${dodatkoweCss}
</style><script>
// każdy tytuł w jednej linii, możliwie duży, ale nie szerszy niż blok
window.dopasuj = () => {
  for (const el of document.querySelectorAll('.tytul')) {
    el.style.whiteSpace = 'nowrap';
    let r = parseFloat(getComputedStyle(el).fontSize);
    while (el.scrollWidth > el.clientWidth + 1 && r > 20) { r -= 1; el.style.fontSize = r + 'px'; }
  }
  for (const el of document.querySelectorAll('[data-dosun]')) {
    const cel = document.querySelector(el.dataset.dosun);
    const dol = cel.getBoundingClientRect().top - 40;
    const nadmiar = el.getBoundingClientRect().bottom - dol;
    if (nadmiar > 0) el.style.top = (parseFloat(getComputedStyle(el).top) - nadmiar) + 'px';
  }
};
</script></head><body><div class="ok">${tresc}<div class="ziarno"></div></div></body></html>`;

const stopka = (opis) => `<div class="dol"><div style="display:flex;align-items:center;gap:16px">${znak({ rozmiar: 44 })}${napis({ rozmiar: 17 })}</div><div class="opis">${opis}</div></div>`;

// 01: siatka 66 dni (mediana czasu tworzenia nawyku w badaniu Lally i in., 2010)
function okladkaNawyki() {
  const r = los(7);
  const kolumny = 11;
  const wiersze = 6;
  const pominiete = new Set([9, 23, 38]); // pojedyncze opuszczone dni: łańcuch się nie urywa
  const wypelnione = 51;
  let komorki = '';
  for (let i = 0; i < kolumny * wiersze; i++) {
    const x = (i % kolumny) * 66;
    const y = Math.floor(i / kolumny) * 66;
    if (i < wypelnione && !pominiete.has(i)) {
      const a = (0.55 + 0.45 * (i / wypelnione)).toFixed(2);
      const blask = i > wypelnione - 9 ? `filter="url(#blask)"` : '';
      komorki += `<rect x="${x}" y="${y}" width="54" height="54" rx="7" fill="rgba(0,229,255,${a})" ${blask}/>`;
    } else if (i === wypelnione) {
      komorki += `<rect x="${x + 1.5}" y="${y + 1.5}" width="51" height="51" rx="7" fill="none" stroke="#00E5FF" stroke-width="3" filter="url(#blask)"/>`;
    } else {
      komorki += `<rect x="${x + 1}" y="${y + 1}" width="52" height="52" rx="7" fill="none" stroke="rgba(214,224,236,${(0.14 + r() * 0.06).toFixed(2)})" stroke-width="2"/>`;
    }
  }
  const siatka = `<svg class="siatka" viewBox="-20 -20 742 412" width="742" height="412">
    <defs><filter id="blask" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>${komorki}</svg>`;
  return baza(
    `<div class="tlo"></div>
    <div class="gora"><span class="seria">Biblioteka Revion · 01</span><span class="seria">Ebook</span></div>
    <div class="art">${siatka}<div class="podpis"><span>Dzień 52 / 66</span><span>Mediana czasu budowania nawyku: 66 dni</span></div></div>
    <div class="blok" data-dosun=".dol">
      <div class="nad">5 nawyków opartych na badaniach</div>
      <div class="tytul t1">Nawyki</div>
      <div class="tytul t2 metal">Żelaznej</div>
      <div class="tytul t3">Dyscypliny</div>
      <div class="podtytul">Dyscyplina, która nie zależy od silnej woli.<br>Mniej walki z pokusami, więcej systemu.</div>
    </div>
    ${stopka('Nawyki · Poranek · Energia<br>Otoczenie · Planowanie')}`,
    `.tlo{position:absolute;inset:0;background:radial-gradient(80% 50% at 50% 26%,rgba(0,229,255,.17),transparent 62%),
      repeating-linear-gradient(90deg,rgba(255,255,255,.018) 0 1px,transparent 1px 3px),linear-gradient(180deg,#0B1120 0%,#05060A 62%)}
    .art{position:absolute;top:138px;left:66px}
    .podpis{display:flex;justify-content:space-between;margin-top:6px;width:722px;font:600 12px/1 'JetBrains Mono Variable';letter-spacing:.16em;text-transform:uppercase;color:#6F7A8D}
    .podpis span:first-child{color:#00E5FF}
    .blok{position:absolute;left:62px;right:60px;top:640px}
    .nad{font:600 15px/1 'JetBrains Mono Variable';letter-spacing:.22em;text-transform:uppercase;color:#00E5FF;margin:0 0 26px 4px}
    .t1{font-size:104px;color:#fff}
    .t2{font-size:118px;margin:10px 0 2px}
    .t3{font-size:96px;color:#fff;font-stretch:118%}
    .podtytul{margin-top:34px;max-width:640px}`,
  );
}

// 02: rozproszone punkty „zbiegają się” w jeden jasny punkt skupienia
function okladkaSkupienie() {
  const r = los(42);
  const cx = 437;
  const cy = 430;
  let punkty = '';
  for (let i = 0; i < 520; i++) {
    const kat = r() * Math.PI * 2;
    const odl = 70 + Math.pow(r(), 0.75) * 520;
    const x = cx + Math.cos(kat) * odl;
    const y = cy + Math.sin(kat) * odl * 0.92;
    const blisko = Math.max(0, 1 - odl / 560);
    const rozm = (0.9 + r() * 2.2 * (1 - blisko)).toFixed(2);
    const kolor = blisko > 0.55 ? `rgba(0,229,255,${(0.35 + blisko * 0.6).toFixed(2)})` : `rgba(190,201,216,${(0.08 + r() * 0.32).toFixed(2)})`;
    // krótkie „smugi” skierowane do środka
    const dl = 4 + blisko * 26;
    const x2 = x - Math.cos(kat) * dl;
    const y2 = y - Math.sin(kat) * dl * 0.92;
    punkty += blisko > 0.3
      ? `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${kolor}" stroke-width="${rozm}" stroke-linecap="round"/>`
      : `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rozm}" fill="${kolor}"/>`;
  }
  const kregi = [64, 118, 186, 268, 364]
    .map((rr, i) => `<ellipse cx="${cx}" cy="${cy}" rx="${rr}" ry="${(rr * 0.92).toFixed(1)}" fill="none" stroke="rgba(0,229,255,${(0.32 - i * 0.055).toFixed(3)})" stroke-width="${i === 0 ? 2 : 1.2}" ${i > 2 ? 'stroke-dasharray="2 9"' : ''}/>`)
    .join('');
  const art = `<svg class="art" viewBox="0 0 ${W} 900" width="${W}" height="900">
    <defs>
      <radialGradient id="rdzen"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".18" stop-color="#B8F7FF"/><stop offset=".45" stop-color="rgba(0,229,255,.55)"/><stop offset="1" stop-color="rgba(0,229,255,0)"/></radialGradient>
      <filter id="mgla"><feGaussianBlur stdDeviation="24"/></filter>
    </defs>
    ${punkty}${kregi}
    <circle cx="${cx}" cy="${cy}" r="120" fill="url(#rdzen)" filter="url(#mgla)" opacity=".85"/>
    <circle cx="${cx}" cy="${cy}" r="34" fill="url(#rdzen)"/>
    <circle cx="${cx}" cy="${cy}" r="9" fill="#fff"/>
  </svg>`;
  return baza(
    `<div class="tlo"></div>${art}
    <div class="gora"><span class="seria">Biblioteka Revion · 02</span><span class="seria">Ebook</span></div>
    <div class="blok" data-dosun=".dol">
      <div class="nad">Protokoły głębokiej pracy</div>
      <div class="tytul t1">Skupienie</div>
      <div class="tytul t2 metal">Absolutne</div>
      <div class="podtytul">Jak pracować głęboko w świecie, który zarabia na Twoim rozproszeniu.</div>
    </div>
    ${stopka('Uwaga · Sen · Energia<br>Środowisko · Rytuały')}`,
    `.tlo{position:absolute;inset:0;background:radial-gradient(70% 45% at 50% 35%,rgba(0,140,170,.22),transparent 65%),linear-gradient(180deg,#081019 0%,#05060A 70%)}
    .art{position:absolute;top:0;left:0}
    .blok{position:absolute;left:62px;right:60px;top:806px}
    .nad{font:600 15px/1 'JetBrains Mono Variable';letter-spacing:.22em;text-transform:uppercase;color:#00E5FF;margin:0 0 26px 4px}
    .t1{font-size:112px;color:#fff}
    .t2{font-size:112px;margin-top:8px}
    .podtytul{margin-top:32px;max-width:640px}`,
  );
}

// mockup 3D: prawdziwa bryła (przód, grzbiet z tytułem, blok kartek, góra), światło i cień
function mockup(okladki, { szerokosc = 1600, wysokosc = 1100, tlo = true } = {}) {
  const KW = 437;
  const KH = 620;
  const ustawienia = okladki.length > 1
    ? [{ x: -250, z: -60, y: 0, obrot: 32 }, { x: 205, z: 70, y: 22, obrot: 32 }]
    : [{ x: 0, z: 0, y: 0, obrot: 30 }];
  const ksiazka = ({ plik, tytul, grubosc = 26 }, i) => {
    const u = ustawienia[i];
    const D = grubosc;
    return `<div class="ksiazka" style="transform:translate3d(${u.x}px,${u.y}px,${u.z}px) rotateX(-6deg) rotateY(${u.obrot}deg)">
      <div class="sciana przod" style="width:${KW}px;height:${KH}px;margin:${-KH / 2}px 0 0 ${-KW / 2}px;transform:translateZ(${D / 2}px);background-image:url('${pathToFileURL(plik).href}')"><div class="polysk"></div></div>
      <div class="sciana tyl" style="width:${KW}px;height:${KH}px;margin:${-KH / 2}px 0 0 ${-KW / 2}px;transform:rotateY(180deg) translateZ(${D / 2}px)"></div>
      <div class="sciana grzbiet" style="width:${D}px;height:${KH}px;margin:${-KH / 2}px 0 0 ${-D / 2}px;transform:rotateY(-90deg) translateZ(${KW / 2}px)"><span>${tytul}</span><i></i></div>
      <div class="sciana kartki" style="width:${D}px;height:${KH - 8}px;margin:${-(KH - 8) / 2}px 0 0 ${-D / 2}px;transform:rotateY(90deg) translateZ(${KW / 2 - 3}px)"></div>
      <div class="sciana gorna" style="width:${KW - 3}px;height:${D}px;margin:${-D / 2}px 0 0 ${-KW / 2}px;transform:rotateX(90deg) translateZ(${KH / 2 - 3}px)"></div>
    </div>`;
  };
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  ${cssFontow(['archivo'])}
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:${szerokosc}px;height:${wysokosc}px;overflow:hidden;background:transparent}
  .scena{position:absolute;inset:0;perspective:2200px;perspective-origin:50% 38%;
    ${tlo ? 'background:radial-gradient(55% 60% at 50% 40%,#16253F 0%,#0B1324 42%,#05060A 100%)' : 'background:transparent'}}
  ${tlo ? '' : '.poswiata{display:none}'}
  .poswiata{position:absolute;left:50%;top:44%;width:1100px;height:760px;transform:translate(-50%,-50%);background:radial-gradient(50% 50% at 50% 50%,rgba(0,229,255,.14),transparent 70%)}
  .cien{position:absolute;left:50%;top:${wysokosc / 2 + 400}px;width:${okladki.length > 1 ? 1300 : 720}px;height:110px;transform:translateX(-50%);background:radial-gradient(50% 50% at 50% 50%,rgba(0,0,0,.85),transparent 72%);filter:blur(14px)}
  .swiat{position:absolute;left:50%;top:47%;transform-style:preserve-3d;transform:scale(1.22)}
  .ksiazka{position:absolute;left:0;top:0;transform-style:preserve-3d}
  .sciana{position:absolute;left:0;top:0;backface-visibility:hidden}
  .przod{background-size:cover;background-position:center;border-radius:1px 5px 5px 1px;overflow:hidden}
  .przod::before{content:'';position:absolute;left:9px;top:0;bottom:0;width:4px;background:linear-gradient(90deg,rgba(0,0,0,.45),rgba(255,255,255,.10),rgba(0,0,0,0));z-index:2}
  .polysk{position:absolute;inset:0;background:linear-gradient(112deg,rgba(255,255,255,0) 22%,rgba(255,255,255,.12) 40%,rgba(255,255,255,0) 58%),linear-gradient(90deg,rgba(255,255,255,.05),rgba(0,0,0,.18))}
  .tyl{background:#04050A}
  .grzbiet{background:linear-gradient(90deg,#02030A 0%,#0E1628 45%,#060912 100%);display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:30px 0 24px}
  .grzbiet span{writing-mode:vertical-rl;transform:rotate(180deg);font:800 12.5px/1 'Archivo Variable';font-stretch:118%;letter-spacing:.2em;text-transform:uppercase;color:#C9D2DE;white-space:nowrap}
  .grzbiet i{display:block;width:10px;height:10px;background:#00E5FF;border-radius:2px;box-shadow:0 0 10px rgba(0,229,255,.8)}
  .kartki{background:repeating-linear-gradient(90deg,#F4F5F7 0 1px,#D5D9E0 1px 2px)}
  .gorna{background:repeating-linear-gradient(0deg,#F4F5F7 0 1px,#D5D9E0 1px 2px)}
  </style></head><body><div class="scena"><div class="poswiata"></div><div class="cien"></div>
  <div class="swiat">${okladki.map(ksiazka).join('')}</div></div></body></html>`;
}

async function main() {
  const P = join(REVION, 'produkty');
  const nawyki = join(P, 'ebook-nawyki', 'okladka.png');
  const skupienie = join(P, 'ebook-skupienie', 'okladka.png');
  await htmlDoPng(okladkaNawyki(), nawyki, { szerokosc: W, wysokosc: H, skala: 2 });
  await htmlDoPng(okladkaSkupienie(), skupienie, { szerokosc: W, wysokosc: H, skala: 2 });
  await htmlDoPng(mockup([{ plik: nawyki, tytul: 'Nawyki Żelaznej Dyscypliny', grubosc: 20 }]), join(P, 'ebook-nawyki', 'mockup-3d.png'), { szerokosc: 1600, wysokosc: 1100, skala: 2 });
  await htmlDoPng(mockup([{ plik: skupienie, tytul: 'Skupienie Absolutne', grubosc: 30 }]), join(P, 'ebook-skupienie', 'mockup-3d.png'), { szerokosc: 1600, wysokosc: 1100, skala: 2 });
  await htmlDoPng(
    mockup([{ plik: nawyki, tytul: 'Nawyki Żelaznej Dyscypliny', grubosc: 20 }, { plik: skupienie, tytul: 'Skupienie Absolutne', grubosc: 30 }]),
    join(REVION, 'grafiki', 'pakiet-ebookow-3d.png'),
    { szerokosc: 1600, wysokosc: 1100, skala: 2 },
  );
  await htmlDoPng(
    mockup([{ plik: nawyki, tytul: 'Nawyki Żelaznej Dyscypliny', grubosc: 20 }, { plik: skupienie, tytul: 'Skupienie Absolutne', grubosc: 30 }], { tlo: false }),
    join(REVION, 'grafiki', 'pakiet-ebookow-3d-przezroczysty.png'),
    { szerokosc: 1600, wysokosc: 1100, skala: 2, przezroczyste: true },
  );
  console.log('Okładki i mockupy gotowe.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main()
    .catch((e) => {
      console.error(e.message);
      process.exitCode = 1;
    })
    .finally(zamknij);
}
