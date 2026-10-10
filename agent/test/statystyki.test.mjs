import { test } from 'node:test';
import assert from 'node:assert/strict';
import { utworzMeta } from '../src/meta.mjs';
import { pobierzStatystyki } from '../src/statystyki.mjs';
import { sprawdz } from '../src/sprawdz.mjs';

const json = (d, status = 200) => new Response(JSON.stringify(d), { status });

test('statystyki: Facebook i Instagram trafiają do post.json, stare posty są pomijane', async () => {
  const fetchImpl = async (url) => {
    const u = new URL(url);
    const s = u.pathname.replace(/^\/v[\d.]+\//, '');
    if (s === 'PAGE_1') return json({ reactions: { summary: { total_count: 12 } }, comments: { summary: { total_count: 3 } }, shares: { count: 2 } });
    if (s === 'm1') return json({ like_count: 40, comments_count: 5 });
    if (s === 'm1/insights') return json({ data: [{ name: 'reach', values: [{ value: 900 }] }, { name: 'saved', total_value: { value: 7 } }, { name: 'shares', values: [{ value: 1 }] }, { name: 'views', values: [{ value: 1500 }] }] });
    return json({ error: { message: 'nieznane', code: 100 } }, 400);
  };
  const meta = utworzMeta({ token: 'T', pageId: 'PAGE', igUserId: 'IG', fetchImpl, sleep: async () => {} });
  const swiezy = { dane: { id: 'a', wyniki: { facebook: { id: 'PAGE_1', kiedy: '2026-10-12T16:40:00Z' }, instagram: { id: 'm1', kiedy: '2026-10-12T16:41:00Z' } } } };
  const stary = { dane: { id: 'b', wyniki: { facebook: { id: 'PAGE_0', kiedy: '2026-08-01T16:40:00Z' } } } };
  const ile = await pobierzStatystyki({ posty: [swiezy, stary], meta, teraz: new Date('2026-10-17T12:00:00Z'), log: () => {}, zapisz: () => {} });
  assert.equal(ile, 1);
  assert.deepEqual(swiezy.dane.statystyki.facebook, { reakcje: 12, komentarze: 3, udostepnienia: 2 });
  assert.deepEqual(swiezy.dane.statystyki.instagram, { polubienia: 40, komentarze: 5, zasieg: 900, zapisy: 7, udostepnienia: 1, wyswietlenia: 1500 });
  assert.equal(stary.dane.statystyki, undefined);
});

test('sprawdz: bez sekretów wypisuje, czego brakuje', async () => {
  const linie = [];
  const bledy = await sprawdz({ env: {}, log: (t) => linie.push(t) });
  assert.ok(bledy >= 4);
  const tekst = linie.join('\n');
  assert.match(tekst, /brak META_TOKEN/);
  assert.match(tekst, /brak ANTHROPIC_API_KEY/);
});

test('sprawdz: podpowiada właściwe ID Instagrama', async () => {
  const fetchImpl = async (url) => {
    const s = new URL(url).pathname.replace(/^\/v[\d.]+\//, '');
    if (s === 'PAGE') return json({ name: 'Revion', instagram_business_account: { id: '1784', username: 'revion.pl' } });
    if (s === 'PAGE/published_posts') return json({ data: [] });
    return json({ error: { message: 'x', code: 100 } }, 400);
  };
  const linie = [];
  await sprawdz({ env: { META_TOKEN: 'T', META_PAGE_ID: 'PAGE' }, log: (t) => linie.push(t), fetchImpl });
  assert.match(linie.join('\n'), /brak META_IG_USER_ID: wpisz 1784 \(konto @revion\.pl\)/);
});
