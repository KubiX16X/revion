// Wtyczka WordPress „Revion – strona”: strona główna, strony dostawy, dokumenty prawne i pliki w jednym ZIP-ie.
// Użycie: node src/wtyczka.mjs -> strona/lokalnie/revion-strona.zip
// ZIP zawiera płatne pliki (Skupienie, ikony), więc powstaje tylko lokalnie (strona/lokalnie jest w .gitignore).
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { marked } from 'marked';
import { REVION, STUDIO, przegladarkaRevion, zamknij } from './wspolne.mjs';
import { stronaGlowna, stronaDostawy, stronaEbooka, twardeSpacje } from './strona.mjs';

const STRONA = join(REVION, 'strona');
const BUDOWA = join(STRONA, 'lokalnie', 'wtyczka');
const CEL = join(BUDOWA, 'revion-strona');
const ZIP = join(STRONA, 'lokalnie', 'revion-strona.zip');
const CFG = JSON.parse(readFileSync(join(STRONA, 'konfiguracja.json'), 'utf8'));
const PLIK_LOKALNY = join(STRONA, 'konfiguracja.lokalna.json');
const LOKALNA = existsSync(PLIK_LOKALNY) ? JSON.parse(readFileSync(PLIK_LOKALNY, 'utf8')) : {};

const dzis = new Date();
const DATA = `${String(dzis.getDate()).padStart(2, '0')}.${String(dzis.getMonth() + 1).padStart(2, '0')}.${dzis.getFullYear()}`;
const PDF_REGULAMINU = `Regulamin-Revion-${DATA.replaceAll('.', '-')}.pdf`;

const T = (n) => `{{REVION_${n}}}`;
const cfg = {
  ...CFG,
  stripe: { life_os: T('STRIPE_LIFE_OS'), pakiet_pro: T('STRIPE_PRO') },
  zrzuty: { kokpit: T('ZRZUT_KOKPIT'), projekty: T('ZRZUT_PROJEKTY'), nawyki: T('ZRZUT_NAWYKI'), finanse: T('ZRZUT_FINANSE') },
  dostawa: { life_os: T('NOTION'), ebook_nawyki: T('PDF_NAWYKI'), ebook_skupienie: T('PDF_SKUPIENIE'), ikony: T('ZIP_IKONY') },
  mailerlite_strona_zapisu: T('MAILERLITE'),
  darmowy_ebook_strona: T('URL_EBOOK'),
  zrzuty_podpisy: LOKALNA.wtyczka?.podpisy ?? {},
  linki: { regulamin: T('URL_REGULAMIN'), polityka: T('URL_POLITYKA'), kontakt: T('URL_KONTAKT'), cookies: T('URL_COOKIES'), home: T('URL_HOME') },
};

const sprawdz = (html, nazwa) => {
  const zostalo = html.match(/#WKLEJ-[A-Z0-9-]+|https:\/\/revion\.pl\/wp-content\/uploads\/[^"' )]+/g);
  if (zostalo) throw new Error(`${nazwa}: zostały stałe adresy ${[...new Set(zostalo)].join(', ')}`);
  return html;
};

function szablony() {
  let glowna = twardeSpacje(stronaGlowna(cfg)).replaceAll(CFG.obrazy_baza, T('OBRAZY'));
  // galerię zrzutów i link do niej wtyczka ukrywa, dopóki właściciel nie doda prawdziwych zrzutów
  const przed = glowna;
  glowna = glowna
    .replace(/<section id="od-srodka">[\s\S]*?<\/section>/, (m) => `<!--REVION_ZRZUTY-->${m}<!--/REVION_ZRZUTY-->`)
    .replace('<a class="lnk" href="#od-srodka">Zobacz od środka</a>', (m) => `<!--REVION_ZRZUTY-->${m}<!--/REVION_ZRZUTY-->`);
  if ((glowna.match(/<!--REVION_ZRZUTY-->/g) ?? []).length !== 2 || glowna === przed) throw new Error('Nie znaleziono galerii zrzutów');
  mkdirSync(join(CEL, 'szablony'), { recursive: true });
  writeFileSync(join(CEL, 'szablony', 'glowna.html'), sprawdz(glowna, 'glowna'));
  for (const w of ['life-os', 'pakiet-pro']) {
    const html = twardeSpacje(stronaDostawy(cfg, w)).replaceAll(CFG.obrazy_baza, T('OBRAZY'));
    writeFileSync(join(CEL, 'szablony', `dostawa-${w}.html`), sprawdz(html, w));
  }
  const ebook = twardeSpacje(stronaEbooka(cfg)).replaceAll(CFG.obrazy_baza, T('OBRAZY'));
  writeFileSync(join(CEL, 'szablony', 'ebook.html'), sprawdz(ebook, 'ebook'));
  cpSync(join(STUDIO, 'wtyczka', 'szablony', 'szkielet.php'), join(CEL, 'szablony', 'szkielet.php'));
}

// Dokumenty: uzupełniamy to, co wiadomo; resztę zaznaczamy na żółto do edycji w WordPressie.
const DOKUMENTY = {
  regulamin: [
    ['[DO UZUPEŁNIENIA: data publikacji, np. 15.10.2026]', DATA],
    [/\n {3}- telefon: \[DO UZUPEŁNIENIA:[^\]]*\]\./, ''],
    ['[DO UZUPEŁNIENIA: link do pliku PDF z tą wersją regulaminu]', T('URL_REGULAMIN_PDF')],
    [' [DO UZUPEŁNIENIA: potwierdź ten minimalny okres albo wpisz inny]', ''],
    [' [DO UZUPEŁNIENIA: potwierdź częstotliwość albo wpisz własną]', ''],
    ['[DO UZUPEŁNIENIA: adres strony z polityką cookies, np. https://revion.pl/polityka-cookies/]', T('URL_COOKIES')],
    ['[DO UZUPEŁNIENIA: data wejścia w życie, ta sama co data wersji na górze]', DATA],
    ['[DO UZUPEŁNIENIA: link do strony lub PDF z plikiem formularz-reklamacji]', T('URL_REKLAMACJA')],
    ['[DO UZUPEŁNIENIA: link do strony lub PDF z plikiem formularz-zwrotu]', T('URL_ZWROT')],
  ],
  'polityka-prywatnosci': [
    ['[DO UZUPEŁNIENIA: data publikacji]', DATA],
    [/\n\| \*\*Statystyki strony\*\* \(analityka\)[^\n]*/, ''],
    [/\n\| \*\*Reklama i mierzenie jej skuteczności\*\* \(Meta Pixel\)[^\n]*/, ''],
    [/\n\| \[DO UZUPEŁNIENIA: Make \(Celonis\)[^\n]*/, ''],
    [/\n\| \*\*Meta Platforms Ireland Limited\*\*[^\n]*/, ''],
    [/\n- \*\*Meta Pixel\*\* \(tylko po Twojej zgodzie\)[^\n]*/, ''],
    ['Dotyczy to w szczególności Stripe (Stripe, Inc., USA), Meta (Meta Platforms, Inc., USA), Google (USA, jeśli używamy Google Analytics), narzędzia do automatyzacji (Zapier, Inc., USA albo podwykonawcy Make) oraz podwykonawców MailerLite.', 'Dotyczy to w szczególności Stripe (Stripe, Inc., USA) oraz podwykonawców MailerLite.'],
    ['[DO UZUPEŁNIENIA: nazwa i kraj podmiotu z umowy powierzenia w panelu MailerLite, zwykle MailerLite Limited, Irlandia]', 'MailerLite Limited (Irlandia)'],
    [/\n\| \[DO UZUPEŁNIENIA: Google Ireland Limited[^\n]*/, ''],
    [/\n\| \[DO UZUPEŁNIENIA: biuro rachunkowe[^\n]*/, ''],
    ['[DO UZUPEŁNIENIA: adres strony, np. https://revion.pl/polityka-cookies/]', T('URL_COOKIES')],
  ],
  'polityka-cookies': [
    ['[DO UZUPEŁNIENIA: data publikacji]', DATA],
    [/## 2\. Jakich cookies używamy[\s\S]*?## 5\. Strony innych firm/, `## 2. Jakich cookies używamy

Na revion.pl nie używamy cookies analitycznych ani marketingowych (np. Google Analytics, Meta Pixel). Strona może zapisywać tylko pliki niezbędne do jej działania i bezpieczeństwa. Takie pliki nie wymagają zgody (art. 399 Prawa komunikacji elektronicznej), dlatego nie wyświetlamy banera zgód.

## 3. Zmiany

Jeśli włączymy statystyki albo reklamy (np. Meta Pixel), najpierw dodamy baner zgód i zaktualizujemy tę politykę. Takie pliki zapiszemy dopiero po Twojej zgodzie.

## 4. Strony innych firm`],
    ['## 6. Ustawienia przeglądarki', '## 5. Ustawienia przeglądarki'],
    [' formularz zapisu **MailerLite** albo', ''],
  ],
  'formularz-reklamacji': [],
  'formularz-zwrotu': [],
};

function dokumenty() {
  mkdirSync(join(CEL, 'dokumenty'), { recursive: true });
  let regulaminHtml = '';
  for (const [nazwa, zmiany] of Object.entries(DOKUMENTY)) {
    let md = readFileSync(join(STRONA, 'dokumenty', `${nazwa}.md`), 'utf8').replace(/<!--[\s\S]*?-->\s*/g, '');
    for (const [a, b] of zmiany) {
      const przed = md;
      md = typeof a === 'string' ? md.replaceAll(a, b) : md.replace(a, b);
      if (md === przed) throw new Error(`${nazwa}: nie znaleziono ${a}`);
    }
    md = md.replace(/^# .*\n+/, ''); // tytuł to tytuł strony w WordPressie
    const html = marked.parse(md, { gfm: true }).replace(
      /\[DO UZUPEŁNIENIA[^\]]*\]/g,
      (m) => `<mark style="background:#fff3a0;padding:0 3px">${m}</mark>`,
    );
    writeFileSync(join(CEL, 'dokumenty', `${nazwa}.html`), html);
    if (nazwa === 'regulamin') regulaminHtml = html;
  }
  return regulaminHtml;
}

async function pdfRegulaminu(html) {
  const adresy = {
    URL_REGULAMIN_PDF: 'https://revion.pl/regulamin/',
    URL_COOKIES: 'https://revion.pl/polityka-cookies/',
    URL_REKLAMACJA: 'https://revion.pl/formularz-reklamacji/',
    URL_ZWROT: 'https://revion.pl/formularz-zwrotu/',
  };
  const tresc = html.replace(/\{\{REVION_([A-Z_]+)\}\}/g, (_, k) => adresy[k] ?? _);
  const dok = `<!doctype html><html lang="pl"><head><meta charset="utf-8"><style>
    body{font:11pt/1.5 "Inter Variable",Arial,sans-serif;color:#111;margin:0}
    h1{font-size:18pt;margin:0 0 6pt}h2{font-size:13pt;margin:16pt 0 6pt}
    p,li{margin:0 0 5pt}table{border-collapse:collapse;width:100%}td,th{border:1px solid #bbb;padding:4pt;vertical-align:top;font-size:9.5pt}
    a{color:#111}</style></head><body><h1>Regulamin sklepu internetowego revion.pl</h1>${tresc}</body></html>`;
  const b = await przegladarkaRevion();
  const p = await b.newPage();
  await p.setContent(dok, { waitUntil: 'load' });
  await p.pdf({ path: join(CEL, 'pliki', PDF_REGULAMINU), format: 'A4', margin: { top: '18mm', bottom: '18mm', left: '18mm', right: '18mm' } });
  await p.close();
}

function pliki() {
  mkdirSync(join(CEL, 'pliki'), { recursive: true });
  const kopie = [
    [join(REVION, 'produkty', 'ebook-nawyki', 'Nawyki-Zelaznej-Dyscypliny-Revion.pdf'), 'Nawyki-Zelaznej-Dyscypliny-Revion.pdf'],
    [join(REVION, 'produkty', 'ebook-skupienie', 'Skupienie-Absolutne-Revion.pdf'), 'Skupienie-Absolutne-Revion.pdf'],
    [join(REVION, 'produkty', 'ikony-notion', 'Pakiet-Ikon-Revion.zip'), 'Pakiet-Ikon-Revion.zip'],
  ];
  for (const [z, n] of kopie) {
    if (!existsSync(z)) throw new Error(`Brak pliku ${z}`);
    cpSync(z, join(CEL, 'pliki', n));
  }
  cpSync(join(STRONA, 'obrazy'), join(CEL, 'obrazy'), { recursive: true });
}

function ciszaWKatalogach(katalog) {
  writeFileSync(join(katalog, 'index.php'), '<?php\n// Silence is golden.\n');
  for (const n of readdirSync(katalog)) if (statSync(join(katalog, n)).isDirectory()) ciszaWKatalogach(join(katalog, n));
}

async function main() {
  rmSync(BUDOWA, { recursive: true, force: true });
  mkdirSync(CEL, { recursive: true });
  cpSync(join(STUDIO, 'wtyczka', 'revion-strona.php'), join(CEL, 'revion-strona.php'));
  cpSync(join(STUDIO, 'wtyczka', 'znak-wodny.php'), join(CEL, 'znak-wodny.php'));
  const wtyczkaLok = LOKALNA.wtyczka ?? {};
  const linki = Object.fromEntries(Object.entries(wtyczkaLok.linki ?? {}).filter(([, v]) => /^(https:\/\/|wtyczka:)/.test(v)));
  const php = (o) => JSON.stringify(o).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  writeFileSync(join(CEL, 'wersja.php'), `<?php\nif ( ! defined( 'ABSPATH' ) ) {\n\texit;\n}\ndefine( 'REVION_REGULAMIN_PDF', '${PDF_REGULAMINU}' );\ndefine( 'REVION_DOMYSLNE', '${php(linki)}' );\ndefine( 'REVION_SLUGI', '${php(wtyczkaLok.slugi ?? {})}' );\ndefine( 'REVION_PRO_GROSZE', ${Math.round(CFG.ceny.pakiet_pro * 100)} );\n`);
  console.log('Wbudowane linki:', Object.keys(linki).join(', ') || 'brak');
  for (const [k, v] of Object.entries(wtyczkaLok.slugi ?? {})) console.log(`Strona ${k}: https://revion.pl/${v}/`);
  szablony();
  pliki();
  await pdfRegulaminu(dokumenty());
  for (const n of readdirSync(CEL)) if (statSync(join(CEL, n)).isDirectory()) ciszaWKatalogach(join(CEL, n));
  rmSync(ZIP, { force: true });
  execFileSync('zip', ['-r', '-q', '-X', ZIP, 'revion-strona'], { cwd: BUDOWA });
  console.log(`Wtyczka: ${ZIP} (${(statSync(ZIP).size / 1048576).toFixed(1)} MB), regulamin z dnia ${DATA}`);
}

main()
  .catch((e) => {
    console.error(e.stack);
    process.exitCode = 1;
  })
  .finally(zamknij);
