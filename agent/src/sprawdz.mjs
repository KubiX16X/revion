// Sprawdza, czy agent jest gotowy: ustawienia, brief marki, sekrety, połączenie ze stroną FB i Instagramem.
// Użycie: node src/sprawdz.mjs   (w GitHub Actions: "Revion: publikacja" → Run workflow → tryb "sprawdz")
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { utworzMeta } from './meta.mjs';
import { REVION, brakiWBriefie, wczytajPosty, wczytajUstawienia } from './wspolne.mjs';

// 1 post, 2 posty, 5 postów
const posty_ = (n) => `${n} ${n === 1 ? 'post' : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100) ? 'posty' : 'postów'}`;

export async function sprawdz({ env = process.env, log = console.log, fetchImpl = fetch } = {}) {
  let bledy = 0;
  const ok = (t) => log(`  ✓ ${t}`);
  const zle = (t) => {
    bledy++;
    log(`  ✗ ${t}`);
  };
  const uwaga = (t) => log(`  ! ${t}`);

  log('Ustawienia i brief');
  let ustawienia;
  try {
    ustawienia = wczytajUstawienia();
    ok(`ustawienia.json poprawne (${posty_(ustawienia.harmonogram.length)} tygodniowo, akceptacja: ${ustawienia.akceptacja})`);
    if (ustawienia.agent_wlaczony) ok('agent włączony');
    else uwaga('agent wyłączony: ustaw "agent_wlaczony": true w ustawienia.json, gdy wszystko będzie gotowe');
  } catch (e) {
    zle(e.message);
  }
  const braki = brakiWBriefie(readFileSync(join(REVION, 'marka.md'), 'utf8'));
  if (braki) zle(`marka.md: ${braki} pól [UZUPEŁNIJ] do wypełnienia (bez tego agent nie napisze postów)`);
  else ok('marka.md uzupełniony');

  log('\nSekrety (GitHub → Settings → Secrets and variables → Actions)');
  for (const [nazwa, opis] of [
    ['META_TOKEN', 'token strony z Meta'],
    ['META_PAGE_ID', 'ID strony na Facebooku'],
    ['META_IG_USER_ID', 'ID konta Instagram'],
    ['ANTHROPIC_API_KEY', 'klucz do Claude, który pisze posty'],
  ]) {
    if (env[nazwa]) ok(`${nazwa} ustawiony`);
    else zle(`brak ${nazwa} (${opis})`);
  }

  if (env.META_TOKEN && env.META_PAGE_ID) {
    log('\nPołączenie z Meta');
    const meta = utworzMeta({
      token: env.META_TOKEN,
      pageId: env.META_PAGE_ID,
      igUserId: env.META_IG_USER_ID,
      wersja: ustawienia?.wersja_graph_api,
      fetchImpl,
    });
    try {
      const strona = await meta.zapytanie('GET', env.META_PAGE_ID, { fields: 'name,instagram_business_account{id,username}' });
      ok(`strona na Facebooku: ${strona.name}`);
      const ig = strona.instagram_business_account;
      if (!ig) zle('do strony nie jest podłączone konto Instagram (profesjonalne). Instrukcja: instrukcje/01-konta.md');
      else if (!env.META_IG_USER_ID) zle(`brak META_IG_USER_ID: wpisz ${ig.id} (konto @${ig.username})`);
      else if (env.META_IG_USER_ID !== ig.id) zle(`META_IG_USER_ID (${env.META_IG_USER_ID}) to nie konto tej strony; poprawne: ${ig.id} (@${ig.username})`);
      else ok(`Instagram: @${ig.username}`);
      await meta.ostatniePostyFacebook(1);
      ok('odczyt postów strony działa');
      if (env.META_IG_USER_ID) {
        const limit = await meta.zapytanie('GET', `${env.META_IG_USER_ID}/content_publishing_limit`, { fields: 'quota_usage,config' });
        const l = limit.data?.[0];
        ok(`limit publikacji Instagrama: wykorzystano ${l?.quota_usage ?? 0} z ${l?.config?.quota_total ?? '?'} na dobę`);
      }
    } catch (e) {
      zle(e.tokenNiewazny ? `token nieważny albo wygasł (${e.message})` : e.message);
    }
  }

  log('\nKolejka');
  const posty = wczytajPosty();
  const zaplanowane = posty.filter((p) => p.dane.status === 'zaplanowany');
  const zBledem = posty.filter((p) => p.dane.status === 'blad');
  ok(`zaplanowane: ${zaplanowane.length}, opublikowane: ${posty.filter((p) => p.dane.status === 'opublikowany').length}`);
  if (zaplanowane[0]) ok(`najbliższy: ${zaplanowane[0].dane.kiedy} „${zaplanowane[0].dane.temat}”`);
  for (const p of zBledem) zle(`błąd w „${p.dane.temat}”: ${p.dane.blad}`);

  log(bledy ? `\nDo poprawy: ${bledy}.` : '\nWszystko gotowe.');
  return bledy;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  sprawdz()
    .then((bledy) => {
      process.exitCode = bledy ? 1 : 0;
    })
    .catch((e) => {
      console.error(e.message);
      process.exitCode = 1;
    });
}
