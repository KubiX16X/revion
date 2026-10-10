// Skład ebooków Revion do PDF (A5, Paged.js): okładka, strona tytułowa, spis treści z numerami stron,
// otwarcia rozdziałów na ciemnym tle, żywe paginy, ramki (badania, ćwiczenia, protokoły, pułapki), źródła.
// Użycie: node src/sklad.mjs <katalog-produktu> [kolejne…]
//   katalog-produktu/zrodlo/ksiazka.json + pliki .md  ->  katalog-produktu/<plik>.pdf
import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { marked } from 'marked';
import { KOLORY, PAGED_JS, cssFontow, htmlDoPdf, zamknij } from './wspolne.mjs';
import { znak, napis } from './logo.mjs';

marked.setOptions({ gfm: true, breaks: false });

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// twarde spacje po jednoliterowych spójnikach i przyimkach (polska typografia: bez „wiszących” spójników)
const twarde = (html) =>
  html.replace(/(^|[\s>(„])([aiouwzAIOUWZ]|[Ss]ię|do|na|po|od|za|ze|we|to|nie) (?=[^\s<])/g, '$1$2 ');

const ETYKIETY = {
  nauka: 'Co mówią badania',
  cwiczenie: 'Ćwiczenie',
  pulapka: 'Pułapka',
  protokol: 'Protokół',
  wskazowka: 'Wskazówka',
  checklista: 'Checklista',
  cytat: '',
  revion: 'W Life OS',
};

// :::typ Tytuł … ::: -> ramka; w środku zwykły markdown
function ramki(md) {
  return md.replace(/^:::(\w+)[ \t]*(.*)\n([\s\S]*?)^:::[ \t]*$/gm, (_, typ, tytul, srodek) => {
    if (!(typ in ETYKIETY)) throw new Error(`Nieznany typ ramki ":::${typ}"`);
    const etykieta = ETYKIETY[typ];
    const naglowek = etykieta || tytul ? `<div class="ramka-glowa"><span class="ramka-typ">${esc(etykieta)}</span>${tytul ? `<span class="ramka-tytul">${esc(tytul)}</span>` : ''}</div>` : '';
    return `\n<div class="ramka ramka-${typ}">${naglowek}<div class="ramka-tresc">${tresc(srodek)}</div></div>\n`;
  });
}

function tresc(md) {
  let html = marked.parse(md);
  html = html
    .replace(/==(.+?)==/g, '<mark>$1</mark>')
    .replace(/<li>(\s*<p>)?\s*<input checked="" disabled="" type="checkbox">\s*/g, '<li class="kratka zaznaczona">$1<span class="pole"></span>')
    .replace(/<li>(\s*<p>)?\s*<input disabled="" type="checkbox">\s*/g, '<li class="kratka">$1<span class="pole"></span>');
  return twarde(html);
}

function czesc(md) {
  // sekcja "## Źródła" na końcu rozdziału dostaje osobny, drobny styl
  const [glowna, zrodla] = md.split(/^## Źródła\s*$/m);
  return (
    tresc(ramki(glowna)) +
    (zrodla ? `<section class="zrodla"><h2>Źródła</h2>${tresc(zrodla)}</section>` : '')
  );
}

function css(k) {
  return `
${cssFontow(['archivo', 'inter', 'inter-italic', 'literata', 'literata-italic', 'mono'])}
:root{--atrament:${k.atrament};--noc:${k.noc};--cyjan:${k.cyjan};--morski:${k.cyjanDruk};--stal:${k.stal};--tekst:${k.tekst}}
@page{size:148mm 210mm;margin:17mm 16mm 19mm 16mm;
  @top-left{font:600 6.4pt/1 'Inter Variable';letter-spacing:.14em;text-transform:uppercase;color:#7A8394}
  @bottom-right{content:counter(page);font:600 7.5pt/1 'Inter Variable';color:#7A8394}
}
@page okladka{margin:0;@top-left{content:none}@top-right{content:none}@bottom-right{content:none}}
@page ciemna{margin:0;background:${k.atrament};@top-left{content:none}@top-right{content:none}@bottom-right{content:none}}
@page cicha{@top-left{content:none}@top-right{content:none}@bottom-right{content:none}}
@page spis{@top-left{content:none}@top-right{content:none}}

html{font-family:'Literata Variable',Georgia,serif;font-size:9.7pt;line-height:1.56;color:var(--tekst);font-optical-sizing:auto;
  -webkit-print-color-adjust:exact;print-color-adjust:exact;font-variant-numeric:oldstyle-nums proportional-nums;text-rendering:geometricPrecision}
body{margin:0}
h1,h2,h3,h4,.ramka-glowa,.sans{font-family:'Inter Variable',sans-serif;font-variant-numeric:lining-nums}
p{margin:0 0 .62em;orphans:2;widows:2}
strong{font-weight:640}
em{font-style:italic}
mark{background:linear-gradient(transparent 55%,rgba(0,229,255,.32) 55%);color:inherit;padding:0 .05em}
a{color:inherit;text-decoration:none}
h2{font-size:13.6pt;line-height:1.22;font-weight:760;letter-spacing:-.012em;margin:1.5em 0 .55em;break-after:avoid;color:#0E1320}
h2::before{content:'';display:block;width:9mm;height:.9mm;background:var(--morski);margin-bottom:3.2mm}
h3{font-size:10.6pt;font-weight:720;margin:1.2em 0 .4em;break-after:avoid;color:#0E1320}
h4{font-size:9pt;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--morski);margin:1.1em 0 .3em;break-after:avoid}
ul,ol{margin:.2em 0 .8em;padding-left:1.25em}
li{margin:.18em 0}
ul li::marker{color:var(--morski)}
ol li::marker{font:700 8.4pt 'Inter Variable';color:var(--morski)}
li.kratka{list-style:none;position:relative;margin-left:-1.25em;padding-left:1.6em}
.pole{position:absolute;left:0;top:.28em;width:.82em;height:.82em;border:1.2px solid var(--morski);border-radius:2px}
.zaznaczona .pole{background:var(--morski)}
blockquote{margin:1em 0;padding:0 0 0 4.5mm;border-left:2px solid var(--morski);font-style:italic;color:#2B3240}
hr{border:0;height:0;margin:1.4em 0;text-align:center;break-after:avoid}
hr::after{content:'◆  ◆  ◆';font-size:6pt;letter-spacing:.4em;color:var(--morski)}
table{width:100%;border-collapse:collapse;margin:.8em 0 1.1em;font:8pt/1.4 'Inter Variable';font-variant-numeric:lining-nums tabular-nums;break-inside:avoid}
th{text-align:left;font-weight:700;color:#0E1320;border-bottom:1.4px solid #0E1320;padding:1.6mm 2mm 1.6mm 0;font-size:7.4pt;letter-spacing:.04em;text-transform:uppercase}
td{border-bottom:.5px solid #D4D9E1;padding:1.6mm 2mm 1.6mm 0;vertical-align:top}
code{font:8.2pt 'JetBrains Mono Variable',monospace;background:#EEF1F5;padding:.05em .3em;border-radius:2px}

/* ramki */
.ramka{margin:1em 0 1.15em;padding:4mm 4.5mm 3.2mm;border-radius:2.2mm;break-inside:avoid;font-size:9.1pt;line-height:1.5}
.ramka p:last-child,.ramka ul:last-child,.ramka ol:last-child{margin-bottom:0}
.ramka-glowa{display:flex;flex-direction:column;gap:.6mm;margin-bottom:2.2mm}
.ramka-typ{font:700 6.4pt/1 'JetBrains Mono Variable',monospace;letter-spacing:.16em;text-transform:uppercase}
.ramka-tytul{font:740 10.4pt/1.25 'Inter Variable';color:#0E1320}
.ramka-nauka{background:#EAF5F6;border-left:1.2mm solid var(--morski)}
.ramka-nauka .ramka-typ{color:var(--morski)}
.ramka-cwiczenie{background:#F1F3F7;border:.4mm dashed #9AA4B5}
.ramka-cwiczenie .ramka-typ{color:#4A5568}
.ramka-pulapka{background:#FFF4E6;border-left:1.2mm solid #D97A00}
.ramka-pulapka .ramka-typ{color:#B36200}
.ramka-wskazowka{background:#F3F0FF;border-left:1.2mm solid #6D5DD3}
.ramka-wskazowka .ramka-typ{color:#5546B8}
.ramka-checklista{background:#F1F3F7}
.ramka-checklista .ramka-typ{color:var(--morski)}
.ramka-revion{background:var(--noc);color:#DCE3EC}
.ramka-revion .ramka-typ{color:var(--cyjan)}
.ramka-revion .ramka-tytul,.ramka-revion strong{color:#fff}
.ramka-protokol{background:var(--atrament);color:#DCE3EC;padding:5mm 5mm 4mm}
.ramka-protokol .ramka-typ{color:var(--cyjan)}
.ramka-protokol .ramka-tytul{color:#fff;font-size:11.4pt}
.ramka-protokol strong{color:#fff}
.ramka-protokol mark{background:linear-gradient(transparent 55%,rgba(0,229,255,.38) 55%)}
.ramka-protokol ol{counter-reset:krok;list-style:none;padding-left:0}
.ramka-protokol ol>li{counter-increment:krok;position:relative;padding-left:8mm;margin:.45em 0}
.ramka-protokol ol>li::before{content:counter(krok,decimal-leading-zero);position:absolute;left:0;top:.05em;font:700 7.6pt/1.6 'JetBrains Mono Variable';color:var(--cyjan)}
.ramka-protokol ul li::marker{color:var(--cyjan)}
.ramka-cytat{background:none;padding:2mm 0 2mm 0;text-align:left}
.ramka-cytat .ramka-tresc{font:italic 400 12.5pt/1.42 'Literata Variable';color:#0E1320}
.ramka-cytat .ramka-tresc p:last-child{font:600 7.4pt/1.4 'Inter Variable';font-style:normal;letter-spacing:.08em;text-transform:uppercase;color:var(--morski);margin-top:2mm}
.ramka-cytat::before{content:'“';display:block;font:800 40pt/0.6 'Archivo Variable';color:var(--morski);height:7mm}

.zrodla{margin-top:2.2em;font-size:7.2pt;line-height:1.45;color:#4A5262;break-before:auto}
.zrodla h2{font-size:9pt;margin-top:0}
.zrodla h2::before{width:6mm;height:.6mm}
.zrodla ol,.zrodla ul{padding-left:1.4em}
.zrodla a{word-break:break-all;color:var(--morski)}

/* strony specjalne */
.okladka{page:okladka;break-after:page;width:148mm;height:210mm;margin:0;padding:0}
.okladka img{display:block;width:148mm;height:210mm;object-fit:cover}
.tytulowa{page:cicha;break-after:page;height:174mm;display:flex;flex-direction:column;justify-content:space-between}
.tytulowa .seria{font:600 6.8pt/1 'JetBrains Mono Variable';letter-spacing:.18em;text-transform:uppercase;color:var(--morski)}
.tytulowa h1{font:800 26pt/1.02 'Archivo Variable';font-stretch:112%;letter-spacing:-.02em;margin:5mm 0 4mm;color:#0B1120}
.tytulowa .podtytul{font:400 11pt/1.45 'Literata Variable';color:#3A4252;max-width:100mm}
.tytulowa .stopka{display:flex;align-items:center;gap:3mm}
.redakcja{page:cicha;break-after:page;display:flex;flex-direction:column;justify-content:flex-end;height:174mm;font:7.2pt/1.55 'Inter Variable';color:#5A6272}
.redakcja p{margin-bottom:.9em}
.spis{page:spis;break-after:page}
.od-nowej{break-before:page}
.spis h2::before{display:none}
.spis h2{font:800 20pt/1 'Archivo Variable';font-stretch:112%;margin:0 0 8mm}
.spis ol{list-style:none;padding:0;margin:0}
.spis li{display:grid;grid-template-columns:9mm 1fr auto;gap:2mm;align-items:baseline;padding:2.6mm 0;border-bottom:.4px solid #D4D9E1;font:520 9.3pt/1.3 'Inter Variable';margin:0}
.spis .nr{font:700 7.4pt 'JetBrains Mono Variable';color:var(--morski)}
.spis .str a::after{content:target-counter(attr(href),page);font:600 8.6pt 'Inter Variable';color:#5A6272;font-variant-numeric:tabular-nums}
.spis li a{display:contents}
.spis li .str{text-align:right}

.otwarcie{page:ciemna;break-before:page;break-after:page;height:210mm;width:148mm;position:relative;color:#fff;overflow:hidden;
  background:radial-gradient(120% 70% at 85% 0%,rgba(0,229,255,.16),transparent 55%),linear-gradient(180deg,#0B1120,#05060A 70%)}
.otwarcie .siatka{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px);background-size:7.4mm 7.4mm;mask-image:linear-gradient(180deg,#000,transparent 75%);-webkit-mask-image:linear-gradient(180deg,#000,transparent 75%)}
.otwarcie .gora{position:absolute;top:14mm;left:15mm;right:15mm;display:flex;justify-content:space-between;align-items:center;font:600 6.6pt/1 'JetBrains Mono Variable';letter-spacing:.2em;text-transform:uppercase;color:#8A94A6}
.otwarcie .numer{position:absolute;left:12mm;top:36mm;font:900 118pt/0.8 'Archivo Variable';font-stretch:125%;letter-spacing:-.04em;color:transparent;-webkit-text-stroke:.5mm rgba(0,229,255,.85)}
.otwarcie .dol{position:absolute;left:15mm;right:15mm;bottom:22mm}
.otwarcie .etykieta{font:600 7pt/1 'JetBrains Mono Variable';letter-spacing:.2em;text-transform:uppercase;color:var(--cyjan);margin-bottom:5mm}
.otwarcie h1{font:800 25pt/1.04 'Archivo Variable';font-stretch:108%;letter-spacing:-.02em;margin:0 0 6mm;color:#fff}
.otwarcie .lead{font:400 10.2pt/1.5 'Literata Variable';color:#B9C3D1;max-width:108mm}
.otwarcie .linia{width:18mm;height:.8mm;background:var(--cyjan);margin-bottom:6mm;box-shadow:0 0 4mm rgba(0,229,255,.6)}
.cz-wstep h1.cicha,.cz-zakonczenie h1.cicha{font:800 20pt/1.05 'Archivo Variable';font-stretch:108%;margin:0 0 7mm}
.promo{page:ciemna;break-before:page;height:210mm;width:148mm;position:relative;color:#DCE3EC;
  background:radial-gradient(90% 60% at 50% 0%,rgba(0,229,255,.18),transparent 60%),#05060A}
.promo .w{position:absolute;inset:22mm 16mm 20mm}
.promo .etykieta{font:600 7pt/1 'JetBrains Mono Variable';letter-spacing:.2em;text-transform:uppercase;color:var(--cyjan)}
.promo h2{font:800 22pt/1.05 'Archivo Variable';font-stretch:110%;color:#fff;margin:5mm 0 5mm}
.promo h2::before{display:none}
.promo p{font:400 9.6pt/1.55 'Literata Variable';color:#B9C3D1}
.promo ul{list-style:none;padding:0;margin:5mm 0}
.promo li{font:520 9pt/1.45 'Inter Variable';padding:2mm 0 2mm 6mm;position:relative;border-bottom:.4px solid rgba(255,255,255,.08)}
.promo li::before{content:'';position:absolute;left:0;top:3.6mm;width:2.4mm;height:2.4mm;background:var(--cyjan);border-radius:.4mm}
.promo .przycisk{display:inline-block;margin-top:6mm;padding:3.4mm 6mm;border-radius:10mm;background:var(--cyjan);color:#05060A;font:800 9pt/1 'Inter Variable';letter-spacing:.02em}
.promo .stopka{position:absolute;bottom:0;left:0;right:0;display:flex;align-items:center;gap:3mm;font:600 6.8pt/1 'Inter Variable';color:#6B7588;letter-spacing:.12em;text-transform:uppercase}
`;
}

export function zlozHtml(katalog) {
  const zrodlo = join(katalog, 'zrodlo');
  const k = JSON.parse(readFileSync(join(zrodlo, 'ksiazka.json'), 'utf8'));
  const rozdzialy = k.czesci.map((c, i) => ({ ...c, id: `cz${i + 1}`, html: czesc(readFileSync(join(zrodlo, c.plik), 'utf8')) }));

  const okladka = k.okladka && existsSync(join(katalog, k.okladka))
    ? `<section class="okladka"><img src="${pathToFileURL(join(katalog, k.okladka)).href}" alt=""></section>`
    : '';

  const tytulowa = `<section class="tytulowa">
    <div><div class="seria">${esc(k.seria)}</div><h1 class="ksiazka-tytul">${esc(k.tytul)}</h1><div class="podtytul">${esc(k.podtytul)}</div></div>
    <div class="stopka">${znak({ wariant: 'atrament', rozmiar: 34 })}${napis({ kolor: '#0B1120', rozmiar: 13 })}</div>
  </section>`;

  const redakcja = `<section class="redakcja">${tresc(k.redakcja)}</section>`;

  const spis = `<section class="spis"><h2>Spis treści</h2><ol>${rozdzialy
    .map((r) => `<li><span class="nr">${esc(r.numer ?? '')}</span><a href="#${r.id}">${esc(r.tytul)}</a><span class="str"><a href="#${r.id}"></a></span></li>`)
    .join('')}</ol></section>`;

  const tekstCss = (t) => `"${String(t).replace(/["\\]/g, '\\$&')}"`;
  const styl = "font:600 6.4pt/1 'Inter Variable';letter-spacing:.14em;text-transform:uppercase;color:#7A8394";
  const paginy = rozdzialy
    .map((r) => `@page ${r.id}{@top-left{content:${tekstCss(k.tytul)};${styl}}@top-right{content:${tekstCss(r.tytul)};${styl}}}\n.strona-${r.id}{page:${r.id}}`)
    .join('\n');

  const czesci = rozdzialy
    .map((r) => {
      if (r.typ === 'rozdzial') {
        return `<section class="otwarcie" id="${r.id}"><div class="siatka"></div>
          <div class="gora"><span>${esc(k.tytul)}</span><span>Rozdział ${esc(r.numer)}</span></div>
          <div class="numer">${esc(r.numer)}</div>
          <div class="dol"><div class="linia"></div><div class="etykieta">${esc(r.etykieta ?? `Rozdział ${r.numer}`)}</div><h1>${esc(r.tytul)}</h1>${r.lead ? `<div class="lead">${esc(r.lead)}</div>` : ''}</div>
        </section><section class="cz-rozdzial strona-${r.id}">${r.html}</section>`;
      }
      return `<section class="cz-${r.typ} strona-${r.id} od-nowej" id="${r.id}"><h1 class="cicha">${esc(r.tytul)}</h1>${r.html}</section>`;
    })
    .join('\n');

  const promo = k.promo
    ? `<section class="promo"><div class="w"><div class="etykieta">${esc(k.promo.etykieta)}</div><h2>${esc(k.promo.tytul)}</h2>${tresc(k.promo.tekst)}
      <ul>${k.promo.punkty.map((p) => `<li>${esc(p)}</li>`).join('')}</ul><span class="przycisk">${esc(k.promo.przycisk)}</span>
      <div class="stopka">${znak({ rozmiar: 26 })}<span>revion.pl</span></div></div></section>`
    : '';

  return `<!doctype html><html lang="pl"><head><meta charset="utf-8"><title>${esc(k.tytul)}</title>
<style>${css(KOLORY)}\n${paginy}</style>
<script>window.PagedConfig={auto:true,after:()=>{window.__sklad='gotowe'}};</script>
<script src="${PAGED_JS}"></script></head><body>
${okladka}${tytulowa}${redakcja}${spis}${czesci}${promo}
</body></html>`;
}

async function main() {
  const katalogi = process.argv.slice(2);
  if (!katalogi.length) throw new Error('Użycie: node src/sklad.mjs <katalog-produktu>');
  try {
    for (const kat of katalogi.map((x) => resolve(x))) {
      const k = JSON.parse(readFileSync(join(kat, 'zrodlo', 'ksiazka.json'), 'utf8'));
      const plik = join(kat, k.plik_pdf);
      const strony = await htmlDoPdf(zlozHtml(kat), plik);
      console.log(`${plik}: ${strony} stron`);
    }
  } finally {
    await zamknij();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(async (e) => {
    console.error(e.message);
    await zamknij();
    process.exitCode = 1;
  });
}
