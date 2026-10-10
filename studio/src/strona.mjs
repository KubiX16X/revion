// Strona sprzedażowa Revion v2 (blok HTML do Elementora) + strony dostawy + podglądy PNG.
// Użycie: node src/strona.mjs [--podglad]
//   -> strona/strona-glowna-v2.html, dostawa-life-os.html, dostawa-pakiet-pro.html
// Zasady: bez fałszywych liczników, cen odniesienia i opinii; wszystkie twierdzenia sprawdzalne.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { REVION, htmlDoPng, zamknij } from './wspolne.mjs';
import { znak } from './logo.mjs';

const STRONA = join(REVION, 'strona');
const CFG = JSON.parse(readFileSync(join(STRONA, 'konfiguracja.json'), 'utf8'));

const font = (plik) => readFileSync(join(STRONA, 'fonty', plik)).toString('base64');
const FONTY = [800, 900]
  .map((w) =>
    ['latin', 'latin-ext']
      .map((z) => `@font-face{font-family:"Revion Display";font-weight:${w};font-display:swap;src:url(data:font/woff2;base64,${font(`archivo-${w}-${z}.woff2`)}) format("woff2");${z === 'latin-ext' ? 'unicode-range:U+0100-017F;' : ''}}`)
      .join(''),
  )
  .join('');

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const img = (nazwa) => `${CFG.obrazy_baza}${nazwa}`;
const ikona = (sciezka) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${sciezka}</svg>`;
const IK = {
  kokpit: ikona('<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>'),
  inbox: ikona('<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>'),
  projekty: ikona('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 7v7M12 7v4M16 7v9"/>'),
  cele: ikona('<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>'),
  finanse: ikona('<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>'),
  wiedza: ikona('<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>'),
  telefon: ikona('<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>'),
  ok: ikona('<path d="M20 6 9 17l-5-5"/>'),
  x: ikona('<path d="M18 6 6 18M6 6l12 12"/>'),
  tarcza: ikona('<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>'),
  strzalka: ikona('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  mail: ikona('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>'),
};

const CSS = `
${FONTY}
.rv{--tlo:#05060A;--noc:#0B1120;--karta:rgba(17,26,46,.72);--linia:rgba(148,178,214,.14);--cyjan:#00E5FF;--cyjan2:#00A8C8;--tekst:#E9EEF5;--szary:#9AA6B6;--szary2:#6F7A8D;
  --font:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;--display:"Revion Display",var(--font);
  background:var(--tlo);color:var(--tekst);font-family:var(--font);line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden;
  background-image:radial-gradient(90% 60% at 50% -10%,rgba(0,170,210,.18),transparent 60%)}
.rv *,.rv *::before,.rv *::after{box-sizing:border-box;margin:0;padding:0}
.rv img{max-width:100%;height:auto;display:block}
.rv a{color:inherit;text-decoration:none}
.rv .w{width:min(1120px,100% - 40px);margin-inline:auto}
.rv section{padding:clamp(64px,9vw,112px) 0;position:relative}
.rv h1,.rv h2,.rv h3{font-family:var(--display);font-weight:900;letter-spacing:-.025em;line-height:1.04;color:#fff}
.rv h1{font-size:clamp(2.15rem,5.6vw,4.3rem)}
.rv h2{font-size:clamp(1.7rem,3.8vw,2.9rem);margin-bottom:18px}
.rv h3{font-size:1.12rem;font-weight:800;letter-spacing:-.01em;margin-bottom:8px;line-height:1.25}
.rv p{color:var(--szary);font-size:1.04rem}
.rv .metal{background:linear-gradient(175deg,#fff 10%,#C9D2DE 55%,#8F9BAE 75%,#E6EBF2);-webkit-background-clip:text;background-clip:text;color:transparent}
.rv .cyj{color:var(--cyjan)}
.rv .nad{display:inline-flex;align-items:center;gap:10px;font:700 .74rem/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.2em;text-transform:uppercase;color:var(--cyjan);margin-bottom:20px}
.rv .nad::before{content:"";width:22px;height:2px;background:var(--cyjan);box-shadow:0 0 10px var(--cyjan)}
.rv .lead{font-size:clamp(1.05rem,1.6vw,1.22rem);color:#B9C3D1;max-width:640px}
.rv .srodek{text-align:center}.rv .srodek .lead{margin-inline:auto}
.rv .btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:17px 28px;border-radius:999px;font-weight:800;font-size:1.02rem;transition:transform .2s,box-shadow .2s,background .2s;cursor:pointer;border:0}
.rv .btn svg{width:20px;height:20px}
.rv .btn-g{background:var(--cyjan);color:#03131A;box-shadow:0 10px 34px rgba(0,229,255,.32)}
.rv .btn-g:hover{transform:translateY(-2px);box-shadow:0 14px 44px rgba(0,229,255,.45)}
.rv .btn-d{background:rgba(255,255,255,.06);color:#fff;box-shadow:inset 0 0 0 1px var(--linia)}
.rv .btn-d:hover{background:rgba(255,255,255,.1)}
.rv .karta{background:var(--karta);border:1px solid var(--linia);border-radius:20px;padding:26px;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
.rv .ik{width:46px;height:46px;border-radius:13px;display:grid;place-items:center;background:rgba(0,229,255,.08);box-shadow:inset 0 0 0 1px rgba(0,229,255,.25);color:var(--cyjan);margin-bottom:18px}
.rv .ik svg{width:24px;height:24px}
/* pasek */
.rv .pasek{position:sticky;top:0;z-index:50;background:rgba(5,6,10,.78);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid var(--linia)}
.rv .pasek .w{display:flex;justify-content:space-between;align-items:center;height:68px}
.rv .logo{display:flex;align-items:center;gap:12px;font-family:var(--display);font-weight:800;letter-spacing:.3em;font-size:.95rem;color:#E6EBF2}
.rv .logo svg{width:30px;height:30px}
.rv .pasek .btn{padding:11px 20px;font-size:.92rem}
.rv .pasek .lnk{color:var(--szary);font-size:.92rem;margin-right:18px}
.rv .pasek .lnk:hover{color:#fff}
/* hero */
.rv .hero{padding-top:clamp(48px,7vw,88px)}
.rv .hero .w{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center}
.rv .hero .ekran{transform:perspective(1600px) rotateY(-9deg) rotateX(2deg) scale(1.06);transform-origin:left center}
.rv .hero h1{font-size:clamp(2.1rem,4.3vw,3.35rem)}
.rv .hero h1{margin-bottom:24px}
.rv .cta{display:flex;flex-wrap:wrap;gap:14px;margin:34px 0 26px}
.rv .zaufanie{display:flex;flex-wrap:wrap;gap:10px 22px;color:var(--szary);font-size:.9rem}
.rv .zaufanie span{display:inline-flex;align-items:center;gap:8px}
.rv .zaufanie svg{width:16px;height:16px;color:var(--cyjan)}
.rv .ekran{position:relative;border-radius:18px;padding:10px;background:linear-gradient(160deg,#1B2840,#0B1120);box-shadow:0 40px 90px rgba(0,0,0,.6),0 0 0 1px rgba(148,178,214,.18),0 0 80px rgba(0,229,255,.12)}
.rv .ekran::before{content:"";position:absolute;top:-1px;left:20%;right:20%;height:1px;background:linear-gradient(90deg,transparent,var(--cyjan),transparent)}
.rv .ekran img{border-radius:10px;width:100%;aspect-ratio:16/10;object-fit:cover;object-position:top left;background:#0B1120}
.rv .kropki{display:flex;gap:6px;padding:4px 6px 10px}.rv .kropki i{width:9px;height:9px;border-radius:50%;background:#2A3854}
/* sekcje */
.rv .siatka3{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.rv .siatka2{display:grid;grid-template-columns:repeat(2,1fr);gap:18px}
.rv .problemy{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-top:40px}
.rv .problem{display:flex;gap:14px;align-items:flex-start;padding:22px;border-radius:16px;background:rgba(255,80,80,.04);border:1px solid rgba(255,120,120,.12)}
.rv .problem svg{flex:none;width:22px;height:22px;color:#FF7A7A;margin-top:2px}
.rv .problem p{color:#C9D2DE}
.rv .wniosek{margin-top:36px;font-family:var(--display);font-weight:800;font-size:clamp(1.25rem,2.4vw,1.7rem);color:#fff}
.rv .kroki{counter-reset:k;display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:44px}
.rv .krok{counter-increment:k;position:relative;padding-top:58px}
.rv .krok::before{content:"0" counter(k);position:absolute;top:22px;left:26px;font:900 1.1rem/1 var(--display);color:var(--cyjan);letter-spacing:.05em}
.rv .galeria{display:grid;grid-template-columns:repeat(2,1fr);gap:20px;margin-top:44px}
.rv .galeria figure{margin:0}
.rv .galeria figcaption{margin-top:12px;font:700 .74rem/1 ui-monospace,Menlo,monospace;letter-spacing:.18em;text-transform:uppercase;color:var(--szary2)}
.rv .porownanie{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:44px}
.rv .porownanie ul{list-style:none;display:grid;gap:14px;margin-top:14px}
.rv .porownanie li{display:flex;gap:12px;color:#C9D2DE}
.rv .porownanie li svg{flex:none;width:20px;height:20px;margin-top:3px}
.rv .tak{border-color:rgba(0,229,255,.35);box-shadow:0 0 50px rgba(0,229,255,.08)}
.rv .tak li svg{color:var(--cyjan)}
.rv .nie li svg{color:#FF7A7A}
.rv .nie{opacity:.85}
.rv .numer{font:900 .9rem/1 var(--display);color:var(--cyjan);margin-right:10px}
.rv .lista-dla li{display:flex;gap:14px;padding:16px 0;border-bottom:1px solid var(--linia);color:#C9D2DE}
.rv .lista-dla{list-style:none;margin-top:14px}
.rv .cytat-dla{margin-top:26px;padding:20px 22px;border-left:3px solid var(--cyjan);background:rgba(0,229,255,.05);border-radius:0 12px 12px 0;color:#DCE3EC;font-style:italic}
.rv .ebooki{display:grid;grid-template-columns:1.1fr .9fr;gap:48px;align-items:center}
.rv .ebook{display:flex;gap:18px;align-items:flex-start;padding:20px 0;border-bottom:1px solid var(--linia)}
.rv .ebook img{width:86px;flex:none;border-radius:4px;box-shadow:0 12px 30px rgba(0,0,0,.5)}
.rv .ebook .plakietka{display:inline-block;font:700 .68rem/1 ui-monospace,Menlo,monospace;letter-spacing:.14em;text-transform:uppercase;color:var(--cyjan);border:1px solid rgba(0,229,255,.35);border-radius:999px;padding:5px 9px;margin-bottom:10px}
/* oferta */
.rv .oferty{display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-top:48px;align-items:stretch}
.rv .oferta{display:flex;flex-direction:column;padding:34px 30px}
.rv .oferta.pro{border:1px solid rgba(0,229,255,.55);box-shadow:0 0 0 1px rgba(0,229,255,.15),0 30px 80px rgba(0,229,255,.12);position:relative}
.rv .oferta .wyroznik{position:absolute;top:-13px;left:30px;background:var(--cyjan);color:#03131A;font:800 .72rem/1 var(--font);letter-spacing:.12em;text-transform:uppercase;padding:7px 12px;border-radius:999px}
.rv .oferta .nazwa{font:800 .8rem/1 ui-monospace,Menlo,monospace;letter-spacing:.2em;text-transform:uppercase;color:var(--szary)}
.rv .cena{font:900 3.4rem/1 var(--display);color:#fff;margin:16px 0 4px;letter-spacing:-.03em}
.rv .cena small{font-size:1.1rem;color:var(--szary);font-weight:800;margin-left:6px}
.rv .oferta .pod{font-size:.9rem;color:var(--szary2);margin-bottom:22px}
.rv .oferta ul{list-style:none;display:grid;gap:12px;margin-bottom:30px;flex:1}
.rv .oferta li{display:flex;gap:12px;color:#DCE3EC;font-size:.98rem}
.rv .oferta li svg{flex:none;width:20px;height:20px;color:var(--cyjan);margin-top:2px}
.rv .oferta .btn{width:100%}
.rv .platnosc{margin-top:22px;color:var(--szary2);font-size:.86rem;text-align:center}
.rv .gwarancja{display:flex;gap:22px;align-items:center;margin-top:30px;padding:26px 28px}
.rv .gwarancja .ik{margin:0;flex:none;width:58px;height:58px}
.rv .gwarancja .ik svg{width:30px;height:30px}
/* faq */
.rv .faq{max-width:820px;margin:40px auto 0;display:grid;gap:12px}
.rv details{background:var(--karta);border:1px solid var(--linia);border-radius:16px;padding:0 24px}
.rv summary{list-style:none;cursor:pointer;padding:20px 0;font-weight:700;color:#fff;display:flex;justify-content:space-between;gap:16px;align-items:center}
.rv summary::-webkit-details-marker{display:none}
.rv summary::after{content:"+";font:400 1.6rem/1 var(--font);color:var(--cyjan);transition:transform .2s}
.rv details[open] summary::after{transform:rotate(45deg)}
.rv details p{padding:0 0 20px}
/* lead magnet */
.rv .magnes{display:grid;grid-template-columns:.8fr 1.2fr;gap:44px;align-items:center;padding:44px}
.rv .magnes img{width:100%;max-width:300px;margin-inline:auto;border-radius:6px;box-shadow:0 30px 70px rgba(0,0,0,.6),0 0 60px rgba(0,229,255,.12);transform:rotate(-3deg)}
.rv .formularz{margin-top:24px;padding:20px;border-radius:14px;border:1px dashed rgba(0,229,255,.4);background:rgba(0,229,255,.04)}
.rv .formularz .zgoda{font-size:.8rem;color:var(--szary2);margin-top:12px}
/* final */
.rv .final{text-align:center;background:radial-gradient(60% 80% at 50% 100%,rgba(0,229,255,.12),transparent 70%)}
.rv .final .cta{justify-content:center}
.rv footer{border-top:1px solid var(--linia);padding:40px 0 48px;color:var(--szary2);font-size:.86rem}
.rv footer .w{display:flex;flex-wrap:wrap;justify-content:space-between;gap:20px}
.rv footer a{color:var(--szary)}
.rv footer a:hover{color:#fff}
.rv .drobne{max-width:620px;line-height:1.55}
@media (max-width:900px){
  .rv .hero .ekran{transform:none}
  .rv .hero .w,.rv .ebooki,.rv .magnes{grid-template-columns:1fr}
  .rv .siatka3,.rv .kroki{grid-template-columns:1fr 1fr}
  .rv .oferty,.rv .porownanie,.rv .galeria,.rv .problemy,.rv .siatka2{grid-template-columns:1fr}
  .rv .magnes{padding:28px}
}
@media (max-width:600px){
  .rv .siatka3,.rv .kroki{grid-template-columns:1fr}
  .rv .pasek .lnk{display:none}
  .rv .cta .btn{width:100%}
  .rv .gwarancja{flex-direction:column;align-items:flex-start}
  .rv .karta{padding:22px}
  .rv .karta.krok{padding-top:58px}
}
@media (prefers-reduced-motion:reduce){.rv *{transition:none!important}}
`;

const modul = (ik, tytul, tekst) => `<div class="karta"><div class="ik">${IK[ik]}</div><h3>${tytul}</h3><p>${tekst}</p></div>`;
const lista = (punkty, ik = 'ok') => `<ul>${punkty.map((p) => `<li>${IK[ik]}<span>${p}</span></li>`).join('')}</ul>`;

function stronaGlowna(c) {
  const k = c.stripe;
  const gwarancja = c.gwarancja_14_dni;
  return `<!-- ============================================================
REVION · STRONA GŁÓWNA v2 (blok „HTML” w Elementorze, szablon strony: Elementor Canvas / pełna szerokość)
Wygenerowane skryptem studio/src/strona.mjs z pliku strona/konfiguracja.json. Nie edytuj ręcznie, tylko konfigurację.
Bez fałszywego licznika, bez fikcyjnej ceny odniesienia i bez nieudokumentowanych opinii (art. 7 upnpr, Omnibus).
============================================================ -->
<style>${CSS}</style>
<div class="rv">

<header class="pasek"><div class="w">
  <a class="logo" href="#top" aria-label="Revion">${znak({ rozmiar: 30 })}<span>REVION</span></a>
  <nav><a class="lnk" href="#od-srodka">Zobacz od środka</a><a class="lnk" href="#darmowy-ebook">Darmowy ebook</a><a class="btn btn-g" href="#oferta">Kup Life OS</a></nav>
</div></header>

<section class="hero" id="top"><div class="w">
  <div>
    <div class="nad">Szablon Notion po polsku</div>
    <h1>Przestań nosić <span class="metal">wszystko w głowie.</span></h1>
    <p class="lead">Revion Life OS to gotowy pulpit w Notion, w którym zadania, nawyki, cele, projekty i finanse są w jednym miejscu. Rano widzisz tylko trzy rzeczy na dziś, a reszta czeka uporządkowana.</p>
    <div class="cta">
      <a class="btn btn-g" href="#oferta">Chcę Life OS · ${c.ceny.life_os} zł ${IK.strzalka}</a>
      <a class="btn btn-d" href="#darmowy-ebook">Najpierw darmowy ebook</a>
    </div>
    <div class="zaufanie">
      <span>${IK.ok}Płacisz raz, bez abonamentu</span>
      <span>${IK.ok}Działa na darmowym planie Notion</span>
      <span>${IK.ok}Dostęp od razu po płatności</span>
      ${gwarancja ? `<span>${IK.ok}14 dni na zwrot pieniędzy</span>` : ''}
    </div>
  </div>
  <div class="ekran"><div class="kropki"><i></i><i></i><i></i></div><img src="${c.zrzuty.kokpit}" alt="Kokpit Revion Life OS w Notion" loading="eager" width="1600" height="1000"></div>
</div></section>

<section><div class="w">
  <div class="nad">Brzmi znajomo?</div>
  <h2>Masz dużo spraw i <span class="metal">zero miejsca, w którym się spotykają.</span></h2>
  <div class="problemy">
    <div class="problem">${IK.x}<p>Notatki w telefonie, zadania na kartkach, terminy w kalendarzu. Nic się ze sobą nie łączy.</p></div>
    <div class="problem">${IK.x}<p>Rano reagujesz na to, co wyskoczy. Wieczorem masz wrażenie, że nic ważnego nie ruszyło.</p></div>
    <div class="problem">${IK.x}<p>Cele z początku roku znikają, bo nikt nie sprawdza postępów. Ty też nie.</p></div>
    <div class="problem">${IK.x}<p>Opłaty i terminy wypadają z głowy w najgorszym możliwym momencie.</p></div>
  </div>
  <p class="wniosek">To nie brak motywacji. <span class="cyj">To brak systemu.</span></p>
</div></section>

<section id="co-dostajesz"><div class="w">
  <div class="srodek"><div class="nad">Co jest w środku</div><h2>Sześć modułów. <span class="metal">Jeden pulpit.</span></h2>
  <p class="lead">Life OS zastępuje kilka osobnych aplikacji jednym, uporządkowanym miejscem w Notion.</p></div>
  <div class="siatka3" style="margin-top:44px">
    ${modul('kokpit', 'Kokpit „Dziś”', 'Widzisz zadania na dziś i aktywne projekty. Reszta jest schowana, ale nie zgubiona.')}
    ${modul('inbox', 'Inbox', 'Pomysł, zadanie, link: wrzucasz w kilka sekund i wracasz do swoich spraw. Porządkujesz raz dziennie.')}
    ${modul('projekty', 'Projekty', 'Duży, przytłaczający projekt rozbijasz na małe kroki, które da się zrobić jeden po drugim.')}
    ${modul('cele', 'Cele i nawyki', 'Codzienna tabelka nawyków i cele z postępem. Widzisz, co rośnie, a co stoi.')}
    ${modul('finanse', 'Finanse i budżet', 'Przychody, wydatki i oszczędności w jednym widoku. Wiesz, gdzie uciekają pieniądze.')}
    ${modul('wiedza', 'Biblioteka wiedzy', 'Notatki z książek, kursów i artykułów w jednym, przeszukiwalnym miejscu.')}
  </div>
  <div class="karta" style="margin-top:18px;display:flex;gap:16px;align-items:center"><div class="ik" style="margin:0;flex:none">${IK.telefon}</div><p style="color:#DCE3EC">Działa na komputerze, tablecie i telefonie (iOS i Android). Zadanie dodane w tramwaju czeka na Ciebie przy biurku.</p></div>
</div></section>

<section id="od-srodka"><div class="w">
  <div class="srodek"><div class="nad">Zobacz od środka</div><h2>Prawdziwe zrzuty ekranu, <span class="metal">nie wizualizacje.</span></h2></div>
  <div class="galeria">
    <figure class="ekran"><img src="${c.zrzuty.kokpit}" alt="Kokpit" loading="lazy" width="1600" height="1000"><figcaption>Kokpit</figcaption></figure>
    <figure class="ekran"><img src="${c.zrzuty.projekty}" alt="Zadania i projekty" loading="lazy" width="1600" height="1000"><figcaption>Zadania i projekty</figcaption></figure>
    <figure class="ekran"><img src="${c.zrzuty.nawyki}" alt="Śledzenie nawyków" loading="lazy" width="1600" height="1000"><figcaption>Śledzenie nawyków</figcaption></figure>
    <figure class="ekran"><img src="${c.zrzuty.finanse}" alt="Finanse i budżet" loading="lazy" width="1600" height="1000"><figcaption>Finanse i budżet</figcaption></figure>
  </div>
</div></section>

<section><div class="w">
  <div class="srodek"><div class="nad">Jak to działa</div><h2>Od zakupu do pierwszego zadania <span class="metal">w kilka minut.</span></h2></div>
  <div class="kroki">
    <div class="karta krok"><h3>Płacisz raz</h3><p>Bezpieczna płatność przez Stripe. Zaraz po niej dostajesz link do Life OS.</p></div>
    <div class="karta krok"><h3>Klikasz „Duplicate”</h3><p>Szablon kopiuje się do Twojego konta Notion. Wystarczy darmowe konto.</p></div>
    <div class="karta krok"><h3>Wrzucasz pierwsze zadania</h3><p>Inbox, potem „Dziś” i trzy priorytety. Od tej chwili system pamięta za Ciebie.</p></div>
  </div>
</div></section>

<section><div class="w">
  <div class="srodek"><div class="nad">Różnica</div><h2>Dzień z systemem <span class="metal">i bez niego.</span></h2></div>
  <div class="porownanie">
    <div class="karta tak"><h3>Z Life OS</h3>${lista([
      'Wszystko w jednym miejscu: pomysły lądują w Inboxie, zamiast krążyć po głowie.',
      'Widok „Dziś” pokazuje trzy priorytety. Wiesz, od czego zacząć.',
      'Odhaczasz zadania i wieczorem widzisz, co naprawdę zrobione.',
      'Nawyki w codziennej tabelce: widać serię i widać przerwę.',
      'Przychody i wydatki w jednym widoku.',
    ])}</div>
    <div class="karta nie"><h3>Bez systemu</h3>${lista([
      'Notatki w trzech aplikacjach i na kartkach.',
      'Dzień układa się sam, zwykle pod cudze priorytety.',
      'Wieczorem poczucie, że „znowu nic konkretnego”.',
      'Postanowienia noworoczne porzucone w lutym.',
      'Opłaty i terminy przypominają o sobie za późno.',
    ], 'x')}</div>
  </div>
</div></section>

<section><div class="w">
  <div class="srodek"><div class="nad">Silnik systemu</div><h2>Notion, czyli notatnik, arkusz i kalendarz <span class="metal">w jednym.</span></h2>
  <p class="lead">Notion to aplikacja do organizacji, z której korzysta wiele milionów ludzi na świecie. Sam Notion to jednak puste klocki. Life OS to gotowa konstrukcja: wgrywasz i używasz.</p></div>
  <div class="siatka3" style="margin-top:44px">
    ${modul('ok', 'Darmowy plan wystarczy', 'Life OS działa na darmowym planie Notion. Nie płacisz żadnego abonamentu.')}
    ${modul('telefon', 'Działa wszędzie', 'Telefon, tablet, komputer. Dane synchronizują się automatycznie.')}
    ${modul('kokpit', 'Czarna robota zrobiona', 'Bazy, widoki i połączenia są gotowe. Ty tylko wpisujesz swoje sprawy.')}
  </div>
</div></section>

<section><div class="w siatka2">
  <div class="karta tak"><h3>Life OS jest dla Ciebie, jeśli:</h3><ol class="lista-dla">
    <li><span class="numer">01</span>Masz dużo spraw na głowie i potrzebujesz jednego miejsca, żeby nad nimi zapanować.</li>
    <li><span class="numer">02</span>Jesteś freelancerem, twórcą, studentem, przedsiębiorcą albo po prostu sam(a) jesteś swoim szefem.</li>
    <li><span class="numer">03</span>Papierowe planery lądowały u Ciebie w szufladzie po dwóch tygodniach.</li>
    <li><span class="numer">04</span>Lubisz ładne, czyste miejsce pracy, bo ono naprawdę motywuje.</li>
  </ol></div>
  <div class="karta nie"><h3>Odpuść, jeśli:</h3><ol class="lista-dla">
    <li><span class="numer">01</span>Szukasz magicznej pigułki. System organizuje pracę, ale jej za Ciebie nie zrobi.</li>
    <li><span class="numer">02</span>Kochasz kartkę i długopis i nie chcesz żadnej aplikacji.</li>
    <li><span class="numer">03</span>Nie masz 15 minut, żeby poznać nowe miejsce pracy.</li>
  </ol>
  <p class="cytat-dla">Żaden szablon nie zmieni nawyków za Ciebie. Daje za to miejsce, w którym zmiana jest łatwiejsza do utrzymania.</p></div>
</div></section>

<section><div class="w ebooki">
  <div>
    <div class="nad">Biblioteka Revion</div>
    <h2>Do systemu dokładamy <span class="metal">wiedzę, jak go używać.</span></h2>
    <p class="lead">Dwa ebooki oparte na badaniach, bez motywacyjnej waty. Każdy rozdział kończy się protokołem do wdrożenia.</p>
    <div class="ebook"><img src="${img('ebook-nawyki-okladka.webp')}" alt="Okładka ebooka Nawyki Żelaznej Dyscypliny" loading="lazy" width="800" height="1135"><div><span class="plakietka">W prezencie do każdego zamówienia</span><h3>Nawyki Żelaznej Dyscypliny</h3><p>Dyscyplina, która nie zależy od silnej woli: poranek, wieczorne planowanie, energia, otoczenie i plan na 30 dni. ${c.strony.nawyki} stron.</p></div></div>
    <div class="ebook"><img src="${img('ebook-skupienie-okladka.webp')}" alt="Okładka ebooka Skupienie Absolutne" loading="lazy" width="800" height="1135"><div><span class="plakietka">W Pakiecie Pro</span><h3>Skupienie Absolutne</h3><p>Protokoły głębokiej pracy: środowisko bez rozproszeń, biologia skupienia, rytuały i plan na 30 dni. ${c.strony.skupienie} stron.</p></div></div>
  </div>
  <img src="${img('pakiet-ebookow-3d.webp')}" alt="Ebooki Nawyki Żelaznej Dyscypliny i Skupienie Absolutne" loading="lazy" width="1400" height="1194">
</div></section>

<section id="oferta"><div class="w">
  <div class="srodek"><div class="nad">Oferta</div><h2>Wybierz swój pakiet</h2>
  <p class="lead">Jedna płatność, dostęp na zawsze, przyszłe aktualizacje szablonu w cenie.</p></div>
  <div class="oferty">
    <div class="karta oferta">
      <div class="nazwa">Life OS</div>
      <div class="cena">${c.ceny.life_os}<small>zł</small></div>
      <div class="pod">płatność jednorazowa</div>
      ${lista(['Szablon Revion Life OS w Notion (6 modułów)', 'Ebook „Nawyki Żelaznej Dyscypliny” w prezencie', 'Przyszłe aktualizacje szablonu', 'Pomoc mailowa przy wdrożeniu'])}
      <a class="btn btn-d" href="${k.life_os}">Kupuję Life OS · ${c.ceny.life_os} zł</a>
    </div>
    <div class="karta oferta pro">
      <span class="wyroznik">Najwięcej w pakiecie</span>
      <div class="nazwa">Pakiet Pro</div>
      <div class="cena">${c.ceny.pakiet_pro}<small>zł</small></div>
      <div class="pod">płatność jednorazowa</div>
      ${lista(['Wszystko z pakietu Life OS', 'Ebook „Skupienie Absolutne” (protokoły głębokiej pracy)', '50 ikon do Notion w dwóch wariantach', 'Przyszłe aktualizacje szablonu i ebooków'])}
      <a class="btn btn-g" href="${k.pakiet_pro}">Kupuję Pakiet Pro · ${c.ceny.pakiet_pro} zł ${IK.strzalka}</a>
    </div>
  </div>
  <p class="platnosc">Bezpieczna płatność przez Stripe: karta, BLIK, Google Pay lub Apple Pay. Ceny końcowe. Na prośbę wystawiamy rachunek.</p>
  ${gwarancja ? `<div class="karta gwarancja"><div class="ik">${IK.tarcza}</div><div><h3>14 dni na zwrot, bez tłumaczenia się</h3><p>Jeśli Life OS nie sprawdzi się u Ciebie, napisz na ${esc(c.email)} w ciągu 14 dni od zakupu. Oddamy całą kwotę. Szczegóły w regulaminie.</p></div></div>` : ''}
</div></section>

<section><div class="w">
  <div class="srodek"><div class="nad">Pytania</div><h2>Pytania i odpowiedzi</h2></div>
  <div class="faq">
    <details><summary>Czy to opłata jednorazowa?</summary><p>Tak. Płacisz raz i masz dostęp na zawsze, razem z przyszłymi aktualizacjami szablonu. Żadnych subskrypcji.</p></details>
    <details><summary>Czy potrzebuję płatnego Notion?</summary><p>Nie. Life OS działa na darmowym planie Notion. Wystarczy założyć bezpłatne konto na notion.com.</p></details>
    <details><summary>Nie znam Notion. Dam radę?</summary><p>Tak. Szablon jest gotowy, a codzienna praca to dopisywanie zadań i odhaczanie ich. Pierwsze uruchomienie zajmuje kilka minut. Jeśli utkniesz, napisz na ${esc(c.email)} – pomożemy.</p></details>
    <details><summary>Jak i kiedy dostanę produkt?</summary><p>Od razu po płatności przechodzisz na stronę z dostępem: link do Life OS (klikasz „Duplicate”) i ebooki w PDF. Zapisz tę stronę – to Twój stały dostęp. Potwierdzenie zakupu przychodzi też na e-mail.</p></details>
    <details><summary>Czy działa na telefonie?</summary><p>Tak. Notion ma aplikacje na iOS i Androida, a Life OS jest ułożony tak, żeby dało się z niego wygodnie korzystać w biegu.</p></details>
    ${gwarancja ? `<details><summary>Co, jeśli mi się nie spodoba?</summary><p>Masz 14 dni od zakupu na zwrot całej kwoty. Napisz na ${esc(c.email)} z adresu użytego przy zakupie i tyle.</p></details>` : `<details><summary>Co, jeśli coś nie działa?</summary><p>Napisz na ${esc(c.email)}. Pomożemy, aż wszystko zadziała. Masz też pełne prawa z tytułu niezgodności treści cyfrowej z umową (szczegóły w regulaminie).</p></details>`}
    <details><summary>Czy mogę udostępnić szablon znajomym?</summary><p>Licencja obejmuje użytek własny, więc prosimy nie przekazywać linku dalej. Jeśli ktoś chce Life OS, wyślij mu link do revion.pl. Dziękujemy!</p></details>
  </div>
</div></section>

<section id="darmowy-ebook"><div class="w">
  <div class="karta magnes">
    <img src="${img('ebook-nawyki-okladka.webp')}" alt="Darmowy ebook Nawyki Żelaznej Dyscypliny" loading="lazy" width="800" height="1135">
    <div>
      <div class="nad">Za darmo</div>
      <h2>Nie kupuj w ciemno. <span class="metal">Zacznij od ebooka.</span></h2>
      <p class="lead">„Nawyki Żelaznej Dyscypliny”: pięć nawyków opartych na badaniach i plan na 30 dni. Wyślemy go na Twój e-mail, a w kolejnych dniach kilka krótkich lekcji o ogarnianiu dnia. Wypiszesz się jednym kliknięciem.</p>
      <div class="formularz">
        <!-- WKLEJ TUTAJ FORMULARZ MAILERLITE (MailerLite → Forms → Embedded forms → kod HTML) -->
        <a class="btn btn-g" href="${c.mailerlite_strona_zapisu}">${IK.mail} Wyślij mi darmowy ebook</a>
        <p class="zgoda">Zapis na newsletter jest dobrowolny. Administratorem danych jest ${esc(c.sprzedawca.nazwa)}. Szczegóły w <a href="${c.linki.polityka}" style="text-decoration:underline">polityce prywatności</a>.</p>
      </div>
    </div>
  </div>
</div></section>

<section class="final"><div class="w">
  <h2>Przestań planować w pięciu miejscach. <span class="metal">Zacznij działać z jednego.</span></h2>
  <div class="cta"><a class="btn btn-g" href="#oferta">Wybieram pakiet ${IK.strzalka}</a><a class="btn btn-d" href="#darmowy-ebook">Najpierw darmowy ebook</a></div>
</div></section>

<footer><div class="w">
  <div class="drobne">
    <div class="logo" style="margin-bottom:14px">${znak({ rozmiar: 26 })}<span>REVION</span></div>
    Sprzedawca: ${esc(c.sprzedawca.nazwa)}, ${esc(c.sprzedawca.adres)} (działalność nierejestrowana). Kontakt: <a href="mailto:${esc(c.email)}">${esc(c.email)}</a>.<br>
    Notion jest znakiem towarowym Notion Labs, Inc. Revion nie jest powiązany z Notion Labs, Inc.
  </div>
  <div><a href="${c.linki.regulamin}">Regulamin</a> · <a href="${c.linki.polityka}">Polityka prywatności</a> · <a href="${c.linki.kontakt}">Kontakt</a><br>© 2026 Revion</div>
</div></footer>

</div>`;
}

function stronaDostawy(c, wariant) {
  const zasoby = [
    { ik: 'kokpit', tytul: 'Revion Life OS', opis: 'Szablon Notion. Otwórz i kliknij „Duplicate” w prawym górnym rogu.', link: c.dostawa.life_os, przycisk: 'Otwórz w Notion' },
    { ik: 'wiedza', tytul: 'Nawyki Żelaznej Dyscypliny', opis: `Ebook PDF, ${c.strony.nawyki} stron.`, link: c.dostawa.ebook_nawyki, przycisk: 'Pobierz PDF' },
  ];
  if (wariant === 'pakiet-pro') {
    zasoby.push(
      { ik: 'cele', tytul: 'Skupienie Absolutne', opis: `Ebook PDF, ${c.strony.skupienie} stron.`, link: c.dostawa.ebook_skupienie, przycisk: 'Pobierz PDF' },
      { ik: 'projekty', tytul: '50 ikon do Notion', opis: 'Paczka ZIP: warianty „neon” i „kafel”, instrukcja w środku.', link: c.dostawa.ikony, przycisk: 'Pobierz ZIP' },
    );
  }
  return `<!-- REVION · STRONA DOSTAWY: ${wariant === 'pakiet-pro' ? 'PAKIET PRO' : 'LIFE OS'}
Ustaw w Elementorze/SEO: noindex, nofollow, wyłącz z mapy strony. Adres strony nie powinien być łatwy do zgadnięcia. -->
<style>${CSS}
.rv .dost{max-width:760px;margin:0 auto;padding:72px 0}
.rv .zasob{display:flex;gap:18px;align-items:center;justify-content:space-between;margin-top:14px}
.rv .zasob .l{display:flex;gap:16px;align-items:center}
.rv .zasob .ik{margin:0;flex:none}
.rv .kroki2{list-style:none;display:grid;gap:10px;margin:22px 0 34px;counter-reset:k}
.rv .kroki2 li{counter-increment:k;color:#C9D2DE;display:flex;gap:12px}
.rv .kroki2 li::before{content:"0" counter(k);font:900 .9rem/1.6 var(--display);color:var(--cyjan)}
@media (max-width:600px){.rv .zasob{flex-direction:column;align-items:flex-start}.rv .zasob .btn{width:100%}}
</style>
<div class="rv"><div class="w dost">
  <div class="logo" style="margin-bottom:40px">${znak({ rozmiar: 30 })}<span>REVION</span></div>
  <div class="nad">Płatność przyjęta</div>
  <h1 style="font-size:clamp(2rem,5vw,3.2rem);margin-bottom:16px">Dziękujemy! <span class="metal">Oto Twój dostęp.</span></h1>
  <p class="lead">Zapisz tę stronę w zakładkach. Linki poniżej są Twoim stałym dostępem, także do przyszłych aktualizacji.</p>
  <ol class="kroki2">
    <li>Otwórz Life OS i kliknij „Duplicate”, żeby skopiować go do swojego konta Notion (wystarczy darmowe).</li>
    <li>Pobierz ebooki i zapisz je na urządzeniu.</li>
    <li>Zacznij od Inboxu: wrzuć wszystko, co masz w głowie, i wybierz trzy priorytety na dziś.</li>
  </ol>
  ${zasoby.map((z) => `<div class="karta zasob"><div class="l"><div class="ik">${IK[z.ik]}</div><div><h3 style="margin:0">${z.tytul}</h3><p style="font-size:.92rem">${z.opis}</p></div></div><a class="btn btn-g" href="${z.link}" ${z.link.includes('notion') ? '' : 'download'}>${z.przycisk}</a></div>`).join('\n  ')}
  <p style="margin-top:34px;font-size:.92rem">Coś nie działa albo potrzebujesz rachunku? Napisz na <a href="mailto:${esc(c.email)}" class="cyj">${esc(c.email)}</a>. Odpowiadamy w ciągu 24 godzin w dni robocze.</p>
  <p style="margin-top:10px;font-size:.8rem;color:var(--szary2)">Licencja na użytek własny: prosimy nie udostępniać linków publicznie.</p>
</div></div>`;
}

// polska typografia: twarda spacja po jednoliterowych słowach (tylko w tekście, nie w CSS i atrybutach)
function twardeSpacje(html) {
  return html
    .split(/(<style>[\s\S]*?<\/style>)/)
    .map((czesc) =>
      czesc.startsWith('<style>')
        ? czesc
        : czesc.replace(/>([^<]+)</g, (_, t) => `>${t.replace(/(^|[\s(„])([aiouwzAIOUWZ]) /g, '$1$2&nbsp;')}<`),
    )
    .join('');
}

async function main() {
  mkdirSync(STRONA, { recursive: true });
  writeFileSync(join(STRONA, 'strona-glowna-v2.html'), twardeSpacje(stronaGlowna(CFG)));
  writeFileSync(join(STRONA, 'dostawa-life-os.html'), twardeSpacje(stronaDostawy(CFG, 'life-os')));
  writeFileSync(join(STRONA, 'dostawa-pakiet-pro.html'), twardeSpacje(stronaDostawy(CFG, 'pakiet-pro')));
  console.log('Strony zapisane w', STRONA);
  if (process.argv.includes('--podglad')) {
    // podgląd lokalny: obrazy z repozytorium zamiast adresów na revion.pl
    const P = join(REVION, '..', '..', 'tmp');
    const podmien = (html) => {
      let h = html;
      for (const [, url] of Object.entries(CFG.zrzuty)) h = h.replaceAll(url, pathToFileURL(join(STRONA, 'obrazy', 'zrzut-zastepczy.webp')).href);
      return h.replaceAll(CFG.obrazy_baza, pathToFileURL(join(STRONA, 'obrazy')).href + '/');
    };
    const cel = process.env.PODGLAD_DIR ?? P;
    const opakuj = (html) => `<!doctype html><html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#05060A">${podmien(html)}</body></html>`;
    const { chromium } = await import('playwright');
    const b = await chromium.launch();
    for (const [nazwa, html] of [['strona', twardeSpacje(stronaGlowna(CFG))], ['dostawa', twardeSpacje(stronaDostawy(CFG, 'pakiet-pro'))]]) {
      const plik = join(cel, `podglad-${nazwa}.html`);
      writeFileSync(plik, opakuj(html));
      for (const [tryb, w] of [['desktop', 1440], ['mobile', 390]]) {
        const p = await b.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
        await p.goto(pathToFileURL(plik).href, { waitUntil: 'load' });
        // przewiń, żeby załadować obrazy z loading="lazy"
        await p.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); }
          window.scrollTo(0, 0);
        });
        await p.waitForTimeout(500);
        await p.screenshot({ path: join(cel, `podglad-${nazwa}-${tryb}.png`), fullPage: true });
        await p.close();
      }
    }
    await b.close();
    console.log('Podglądy w', cel);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main()
    .catch((e) => {
      console.error(e.stack);
      process.exitCode = 1;
    })
    .finally(zamknij);
}

export { stronaGlowna, stronaDostawy, htmlDoPng };
