// Buduje plan startowy na 14 dni: grafiki (1080×1350), opisy na Facebooka i Instagram, plan.html i ZIP.
// Użycie: cd social && node zbuduj-plan.mjs
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { renderujPost, zamknijPrzegladarke } from '../agent/src/grafiki.mjs';
import { wczytajUstawienia, zbudujOpis } from '../agent/src/wspolne.mjs';
import { START, GODZINY, ISTNIEJACE, POSTY } from './posty-14-dni.mjs';

const TU = dirname(fileURLToPath(import.meta.url));
const NAZWA = `${START}_14-dni`;
const CEL = join(TU, NAZWA);
const ZIP = join(TU, 'Revion-social-14-dni.zip');
const DNI = ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'];
const CELE = { zasieg: 'Zasięg', zaufanie: 'Zaangażowanie', newsletter: 'Darmowy ebook', sprzedaz: 'Sprzedaż' };
const LINKI = { oferta: 'https://revion.pl/#oferta' };

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const dzien = (n) => {
  const d = new Date(`${START}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d;
};
const iso = (d) => d.toISOString().slice(0, 10);
// czas letni do 25.10.2026 (zmiana o 3:00), potem zimowy
const strefa = (dataIso) => (dataIso < '2026-10-25' ? '+02:00' : '+01:00');

async function main() {
  const ustawienia = wczytajUstawienia();
  rmSync(CEL, { recursive: true, force: true });
  mkdirSync(join(CEL, 'posty'), { recursive: true });
  const wpisy = [];

  for (const [i, wpis] of POSTY.entries()) {
    const d = dzien(Math.floor(i / 2));
    const godzina = GODZINY[i % 2];
    let post;
    let katalogZrodla = null;
    if (wpis.istniejacy) {
      katalogZrodla = join(TU, ISTNIEJACE[wpis.istniejacy]);
      post = JSON.parse(readFileSync(join(katalogZrodla, 'post.json'), 'utf8'));
    } else {
      post = { ...wpis, temat: wpis.temat ?? wpis.id, platformy: ['facebook', 'instagram'] };
    }
    const folder = `${String(i + 1).padStart(2, '0')}_${iso(d)}_${godzina.replace(':', '')}_${post.id.replace(/^\d{4}-\d{2}-\d{2}-/, '')}`;
    const katalog = join(CEL, 'posty', folder);
    mkdirSync(katalog, { recursive: true });
    post.kiedy = `${iso(d)}T${godzina}:00${strefa(iso(d))}`;
    post.status = 'reczny';
    if (katalogZrodla) {
      for (const g of post.grafiki) cpSync(join(katalogZrodla, g), join(katalog, g));
    } else {
      post.grafiki = await renderujPost(post, katalog, ustawienia);
    }
    writeFileSync(join(katalog, 'post.json'), JSON.stringify(post, null, 2) + '\n');
    const u = { ...ustawienia, link: LINKI[post.link] ?? ustawienia.link };
    const fb = zbudujOpis(post, 'facebook', u);
    const ig = zbudujOpis(post, 'instagram', u);
    writeFileSync(join(katalog, 'opis-facebook.txt'), fb + '\n');
    writeFileSync(join(katalog, 'opis-instagram.txt'), ig + '\n');
    wpisy.push({ nr: i + 1, d, godzina, folder, post, fb, ig });
    console.log(`${folder}: ${post.grafiki.length} graf.`);
  }

  writeFileSync(join(CEL, 'plan.html'), planHtml(wpisy));
  rmSync(ZIP, { force: true });
  execFileSync('zip', ['-r', '-q', '-X', ZIP, NAZWA], { cwd: TU });
  console.log(`Plan: ${join(CEL, 'plan.html')}\nZIP: ${ZIP}`);
}

function karta(w) {
  const ile = w.post.grafiki.length;
  const obrazy = w.post.grafiki
    .map((g) => `<a href="posty/${w.folder}/${g}" target="_blank"><img src="posty/${w.folder}/${g}" alt="${esc(w.post.temat)}, grafika ${g}" loading="lazy"></a>`)
    .join('');
  const pole = (platforma, tekst) => `<div class="opis"><div class="opis-gora"><b>${platforma}</b><button type="button" onclick="kopiuj(this)">Kopiuj opis</button></div><textarea readonly rows="8">${esc(tekst)}</textarea></div>`;
  return `<article class="post" id="post-${w.nr}">
  <header><span class="godz">${w.godzina}</span><span class="nr">#${w.nr}</span><h3>${esc(w.post.temat)}</h3><span class="cel cel-${esc(w.post.cel)}">${esc(CELE[w.post.cel] ?? w.post.cel)}</span></header>
  <p class="fmt">${ile > 1 ? `Karuzela: ${ile} grafik, wrzuć je w kolejności 01 → ${String(ile).padStart(2, '0')}` : '1 grafika'} · folder <code>posty/${w.folder}</code></p>
  <div class="obrazy">${obrazy}</div>
  <div class="opisy">${pole('Facebook', w.fb)}${pole('Instagram', w.ig)}</div>
</article>`;
}

function planHtml(wpisy) {
  const dni = [];
  for (let i = 0; i < wpisy.length; i += 2) dni.push(wpisy.slice(i, i + 2));
  const sekcje = dni
    .map((para, n) => {
      const d = para[0].d;
      return `<section class="dzien"><h2><span>Dzień ${n + 1}</span> ${DNI[d.getUTCDay()]} ${String(d.getUTCDate()).padStart(2, '0')}.${String(d.getUTCMonth() + 1).padStart(2, '0')}</h2>${para.map(karta).join('\n')}</section>`;
    })
    .join('\n');
  const licz = {};
  for (const w of wpisy) licz[w.post.cel] = (licz[w.post.cel] ?? 0) + 1;
  const proporcje = Object.entries(CELE).map(([k, n]) => `${n.toLowerCase()}: ${licz[k] ?? 0}`).join(', ');
  const spis = wpisy
    .map((w) => `<tr><td>${String(w.d.getUTCDate()).padStart(2, '0')}.${String(w.d.getUTCMonth() + 1).padStart(2, '0')}</td><td>${w.godzina}</td><td><a href="#post-${w.nr}">${esc(w.post.temat)}</a></td><td>${esc(CELE[w.post.cel] ?? '')}</td><td>${w.post.grafiki.length}</td></tr>`)
    .join('');
  return `<!doctype html><html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Revion: plan social media na 14 dni</title>
<style>
:root{--tlo:#05060A;--karta:#0E1422;--linia:#1E2638;--tekst:#E6EDF5;--szary:#8B97A8;--akcent:#00E5FF}
*{box-sizing:border-box}body{margin:0;background:var(--tlo);color:var(--tekst);font:16px/1.55 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
.w{max-width:1100px;margin:0 auto;padding:32px 16px 80px}
h1{font-size:clamp(1.8rem,4vw,2.6rem);margin:0 0 8px}h1 span{color:var(--akcent)}
.lead{color:var(--szary);margin:0 0 24px}
.ramka{background:var(--karta);border:1px solid var(--linia);border-radius:14px;padding:18px 20px;margin:0 0 24px}
.ramka h2{margin:0 0 10px;font-size:1.15rem}.ramka ol,.ramka ul{margin:0;padding-left:20px}.ramka li{margin:4px 0}
table{width:100%;border-collapse:collapse;font-size:.92rem}td{border-top:1px solid var(--linia);padding:6px 8px}a{color:var(--akcent)}
.dzien h2{font-size:1.4rem;margin:40px 0 14px;padding-bottom:8px;border-bottom:1px solid var(--linia)}.dzien h2 span{color:var(--akcent);margin-right:8px}
.post{background:var(--karta);border:1px solid var(--linia);border-radius:14px;padding:18px;margin:0 0 18px}
.post header{display:flex;flex-wrap:wrap;align-items:center;gap:10px}.post h3{margin:0;font-size:1.1rem;flex:1;min-width:200px}
.godz{background:var(--akcent);color:#001418;font-weight:800;border-radius:999px;padding:3px 12px}.nr{color:var(--szary);font-weight:700}
.cel{font-size:.8rem;border:1px solid var(--linia);border-radius:999px;padding:2px 10px;color:var(--szary)}.cel-sprzedaz{border-color:var(--akcent);color:var(--akcent)}
.fmt{color:var(--szary);font-size:.88rem;margin:8px 0 12px}code{background:#060a12;padding:1px 6px;border-radius:6px;font-size:.85em}
.obrazy{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px;margin-bottom:14px}.obrazy img{width:100%;aspect-ratio:4/5;object-fit:cover;border-radius:8px;display:block;border:1px solid var(--linia)}
.opisy{display:grid;grid-template-columns:1fr 1fr;gap:12px}@media (max-width:760px){.opisy{grid-template-columns:1fr}}
.opis-gora{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
button{background:transparent;color:var(--akcent);border:1px solid var(--akcent);border-radius:999px;padding:5px 14px;font:inherit;font-size:.85rem;cursor:pointer}button.ok{background:var(--akcent);color:#001418}
textarea{width:100%;background:#060a12;color:var(--tekst);border:1px solid var(--linia);border-radius:10px;padding:10px;font:14px/1.5 inherit;resize:vertical}
</style></head><body><div class="w">
<h1>Plan social media: <span>14 dni, 2 posty dziennie</span></h1>
<p class="lead">Revion · Facebook i Instagram · 18–31 października 2026 · o 8:00 i 19:30. Każdy post ma gotowe grafiki i dwa opisy do skopiowania: na Facebooka (z linkiem) i na Instagram (z „link w bio”).</p>
<div class="ramka"><h2>Zanim zaczniesz (15 minut)</h2><ol>
<li>Zdjęcie profilowe i okładka na Facebooku: pliki z folderu <code>grafiki/</code> w repozytorium (<code>zdjecie-profilowe.png</code>, <code>okladka-facebook.png</code>).</li>
<li>Bio na Instagramie: „Szablon Notion i ebooki po polsku. Mniej chaosu, więcej systemu. ↓ Darmowy ebook o nawykach”. Link w bio: <code>https://revion.pl/#darmowy-ebook</code>.</li>
<li>Najszybciej: w Meta Business Suite → Planer zaplanuj od razu cały tydzień (oba posty dziennie, na Facebook i Instagram naraz). Grafiki wrzucaj w kolejności 01, 02, 03…</li>
</ol></div>
<div class="ramka"><h2>Jak rozbujać profil od zera</h2><ul>
<li><b>Pierwsza godzina po publikacji:</b> odpowiedz na każdy komentarz. To najmocniejszy sygnał dla algorytmu.</li>
<li><b>Posty z pytaniem</b> (ankiety A/B/C/D): odpowiedz każdej osobie, najlepiej pytaniem zwrotnym.</li>
<li><b>Codziennie 10 minut:</b> zostaw 5–10 merytorycznych komentarzy pod postami profili o produktywności, Notion i nawykach. Konkret, nie „super!”.</li>
<li><b>Karuzele udostępniaj w relacjach</b> z naklejką „nowy post”. Te same grafiki możesz wrzucić na TikToka jako post ze zdjęciami.</li>
<li><b>Po 14 dniach:</b> w statystykach sprawdź, które posty miały najwięcej zapisań i udostępnień, i rób więcej takich tematów.</li>
<li>Proporcja w planie: ${proporcje}. Sprzedaż jest miękka: najpierw wartość, na końcu link.</li>
</ul></div>
<div class="ramka"><h2>Spis postów</h2><table><tbody>${spis}</tbody></table></div>
${sekcje}
</div>
<script>
function kopiuj(b){const t=b.closest('.opis').querySelector('textarea');const ok=()=>{b.textContent='Skopiowano';b.classList.add('ok');setTimeout(()=>{b.textContent='Kopiuj opis';b.classList.remove('ok')},1500)};
if(navigator.clipboard){navigator.clipboard.writeText(t.value).then(ok,()=>{t.select();document.execCommand('copy');ok()})}else{t.select();document.execCommand('copy');ok()}}
</script>
</body></html>`;
}

main()
  .catch((e) => {
    console.error(e.stack);
    process.exitCode = 1;
  })
  .finally(zamknijPrzegladarke);
