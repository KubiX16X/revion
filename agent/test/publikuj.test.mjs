import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { utworzMeta } from '../src/meta.mjs';
import { publikujZaplanowane } from '../src/publikuj.mjs';
import { udawaneGraph, bezCzekania } from './pomocnicze.mjs';

const ustawienia = {
  strefa_czasowa: 'Europe/Warsaw',
  platformy: ['facebook', 'instagram'],
  max_postow_dziennie: 1,
  link: 'https://revion.pl/',
  tekst_linku_instagram: 'link w bio',
  hashtagi_stale: ['#revion'],
};

function post(id, kiedy, extra = {}) {
  const katalog = mkdtempSync(join(tmpdir(), `revion-${id}-`));
  mkdirSync(katalog, { recursive: true });
  for (const g of ['01.jpg', '02.jpg']) writeFileSync(join(katalog, g), Buffer.from([0xff, 0xd8, 0xff, 0xd9]));
  return {
    plik: join(katalog, 'post.json'),
    katalog,
    dane: { id, kiedy, status: 'zaplanowany', opis: `Post ${id}. Więcej: {LINK}`, hashtagi: ['nowosc'], grafiki: ['01.jpg', '02.jpg'], ...extra },
  };
}

const uruchom = (posty, g, teraz, extra = {}) =>
  publikujZaplanowane({
    posty,
    ustawienia,
    meta: utworzMeta({ token: 'T', pageId: 'PAGE', igUserId: 'IG', fetchImpl: g.fetchImpl, sleep: bezCzekania }),
    teraz: new Date(teraz),
    log: () => {},
    zapisz: () => {},
    env: {},
    fetchImpl: g.fetchImpl,
    ...extra,
  });

test('publikuje zaległy post na Facebooku i Instagramie, z linkiem na FB i "link w bio" na IG', async () => {
  const p = post('a', '2026-10-12T18:30:00+02:00');
  const g = udawaneGraph();
  const wynik = await uruchom([p], g, '2026-10-12T18:47:00+02:00');
  assert.deepEqual(wynik.opublikowane, ['facebook', 'instagram']);
  assert.equal(p.dane.status, 'opublikowany');
  const fb = g.wywolania.find((w) => w.sciezka === 'PAGE/feed');
  assert.equal(fb.parametry.message, 'Post a. Więcej: https://revion.pl/\n\n#nowosc #revion');
  const ig = g.wywolania.find((w) => w.sciezka === 'IG/media' && w.parametry.media_type === 'CAROUSEL');
  assert.equal(ig.parametry.caption, 'Post a. Więcej: link w bio\n\n#nowosc #revion');
  // Instagram dostaje adresy zdjęć wgranych na Facebooka (repozytorium niedostępne w teście)
  const elementy = g.wywolania.filter((w) => w.parametry.is_carousel_item === 'true');
  assert.deepEqual(elementy.map((w) => w.parametry.image_url), ['https://fbcdn.example/ph1.jpg', 'https://fbcdn.example/ph2.jpg']);
  assert.ok(p.dane.wyniki.facebook.link.startsWith('https://www.facebook.com/'));
  assert.ok(p.dane.wyniki.instagram.link.startsWith('https://www.instagram.com/'));
});

test('nie publikuje przed czasem ani postów wstrzymanych', async () => {
  const g = udawaneGraph();
  const wynik = await uruchom(
    [post('a', '2026-10-12T18:30:00+02:00'), post('b', '2026-10-10T18:30:00+02:00', { status: 'wstrzymany' })],
    g,
    '2026-10-12T18:00:00+02:00',
  );
  assert.deepEqual(wynik.opublikowane, []);
  assert.equal(g.wywolania.length, 0);
});

test('limit dzienny: drugi zaległy post czeka do jutra, do swojej godziny', async () => {
  const a = post('a', '2026-10-12T09:00:00+02:00', {
    status: 'opublikowany',
    wyniki: { facebook: { id: '1', kiedy: '2026-10-12T07:10:00Z' }, instagram: { id: '2', kiedy: '2026-10-12T07:10:00Z' } },
  });
  const b = post('b', '2026-10-12T18:30:00+02:00');
  const g = udawaneGraph();
  const dzis = await uruchom([a, b], g, '2026-10-12T19:00:00+02:00');
  assert.deepEqual(dzis.opublikowane, []);
  assert.equal(b.dane.status, 'zaplanowany');
  const jutro = await uruchom([a, b], g, '2026-10-13T18:47:00+02:00');
  assert.deepEqual(jutro.opublikowane, ['facebook', 'instagram']);
});

test('Facebook OK, Instagram błąd: następne uruchomienie ponawia tylko Instagram', async () => {
  const p = post('a', '2026-10-12T18:30:00+02:00');
  const g = udawaneGraph({ bledy: { 'POST IG/media_publish': [{ message: 'boom', code: 100 }] } });
  const pierwsze = await uruchom([p], g, '2026-10-12T18:47:00+02:00');
  assert.deepEqual(pierwsze.opublikowane, ['facebook']);
  assert.equal(p.dane.status, 'zaplanowany');
  assert.equal(p.dane.proby, 1);
  assert.match(p.dane.blad, /instagram: .*boom/);

  const drugie = await uruchom([p], g, '2026-10-12T19:47:00+02:00');
  assert.deepEqual(drugie.opublikowane, ['instagram']);
  assert.equal(p.dane.status, 'opublikowany');
  assert.equal(p.dane.blad, undefined);
  assert.equal(g.wywolania.filter((w) => w.sciezka === 'PAGE/feed').length, 1);
});

test('po 3 nieudanych próbach status "blad"', async () => {
  const p = post('a', '2026-10-12T18:30:00+02:00', { platformy: ['facebook'] });
  const blad = { message: 'nie', code: 100 };
  const g = udawaneGraph({ bledy: { 'POST PAGE/feed': [blad, blad, blad] } });
  for (const h of ['18:47', '19:47', '20:47']) await uruchom([p], g, `2026-10-12T${h}:00+02:00`);
  assert.equal(p.dane.status, 'blad');
  assert.equal(p.dane.proby, 3);
});

test('ochrona przed duplikatem: identyczny post już jest na profilu', async () => {
  const p = post('a', '2026-10-12T18:30:00+02:00');
  const g = udawaneGraph({
    istniejaceFb: [{ id: 'PAGE_99', message: 'Post a. Więcej: https://revion.pl/\n\n#nowosc #revion', created_time: '2026-10-12T16:31:00+0000' }],
  });
  await uruchom([p], g, '2026-10-12T18:47:00+02:00');
  assert.equal(p.dane.wyniki.facebook.id, 'PAGE_99');
  assert.equal(g.wywolania.filter((w) => w.sciezka === 'PAGE/feed').length, 0);
  assert.equal(p.dane.status, 'opublikowany');
});

test('publiczne repozytorium: Instagram dostaje adresy plików z GitHuba z dokładnego commita', async () => {
  const p = post('a', '2026-10-12T18:30:00+02:00', { platformy: ['instagram'] });
  const g = udawaneGraph({ headOk: true });
  await uruchom([p], g, '2026-10-12T18:47:00+02:00', { env: { GITHUB_REPOSITORY: 'KubiX16X/revion', GITHUB_SHA: 'abc123' } });
  const adres = g.wywolania.find((w) => w.parametry.is_carousel_item === 'true').parametry.image_url;
  assert.match(adres, /^https:\/\/raw\.githubusercontent\.com\/KubiX16X\/revion\/abc123\/.+\/01\.jpg$/);
  assert.equal(g.wywolania.filter((w) => w.sciezka === 'PAGE/photos').length, 0);
});

test('brak grafiki: post dostaje status "blad" bez wywołań API', async () => {
  const p = post('a', '2026-10-12T18:30:00+02:00', { grafiki: ['01.jpg', '09.jpg'] });
  const g = udawaneGraph();
  const wynik = await uruchom([p], g, '2026-10-12T18:47:00+02:00');
  assert.equal(p.dane.status, 'blad');
  assert.match(wynik.bledy[0], /09\.jpg/);
  assert.equal(g.wywolania.length, 0);
});

test('nieważny token przerywa i podpowiada, co zrobić', async () => {
  const p = post('a', '2026-10-12T18:30:00+02:00');
  const g = udawaneGraph({ bledy: { 'POST PAGE/photos': { message: 'expired', code: 190 } } });
  const wynik = await uruchom([p], g, '2026-10-12T18:47:00+02:00');
  assert.equal(wynik.opublikowane.length, 0);
  assert.ok(wynik.bledy.some((b) => /Token Meta/.test(b)));
  assert.equal(g.wywolania.filter((w) => w.sciezka.startsWith('IG')).length, 0);
  assert.equal(p.dane.proby, undefined);
  assert.equal(p.dane.status, 'zaplanowany');
});

test('post bez brakujących platform nie blokuje kolejki', async () => {
  const p = post('a', '2026-10-12T18:30:00+02:00');
  p.dane.wyniki = { facebook: { id: 'F1', kiedy: '2026-10-12T16:30:00Z' }, instagram: { id: 'I1', kiedy: '2026-10-12T16:30:00Z' } };
  const g = udawaneGraph();
  await uruchom([p], g, '2026-10-13T18:47:00+02:00');
  assert.equal(p.dane.status, 'opublikowany');
  assert.equal(g.wywolania.length, 0);
});

test('zaległy post z wcześniejszego dnia czeka na swoją godzinę', async () => {
  const p = post('a', '2026-10-12T18:30:00+02:00');
  const g = udawaneGraph();
  const noca = await uruchom([p], g, '2026-10-13T00:17:00+02:00');
  assert.equal(noca.opublikowane.length, 0);
  const wieczorem = await uruchom([p], g, '2026-10-13T18:47:00+02:00');
  assert.ok(wieczorem.opublikowane.length > 0);
});

test('na sucho: nic nie wysyła i nie zmienia statusu', async () => {
  const p = post('a', '2026-10-12T18:30:00+02:00');
  const g = udawaneGraph();
  const wynik = await uruchom([p], g, '2026-10-12T18:47:00+02:00', { naSucho: true, meta: null });
  assert.deepEqual(wynik.opublikowane, ['facebook', 'instagram']);
  assert.equal(p.dane.status, 'zaplanowany');
  assert.equal(g.wywolania.length, 0);
});

test('za długi opis na Instagram liczy się jako nieudana próba, Facebook wychodzi normalnie', async () => {
  const p = post('a', '2026-10-12T18:30:00+02:00', { opis: 'x'.repeat(2300) });
  const g = udawaneGraph();
  const wynik = await uruchom([p], g, '2026-10-12T18:47:00+02:00');
  assert.deepEqual(wynik.opublikowane, ['facebook']);
  assert.match(p.dane.blad, /instagram: .*limit 2200/);
  assert.equal(p.dane.proby, 1);
});
