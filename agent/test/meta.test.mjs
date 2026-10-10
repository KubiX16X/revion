import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { utworzMeta, MetaBlad } from '../src/meta.mjs';
import { udawaneGraph, bezCzekania } from './pomocnicze.mjs';

const katalog = mkdtempSync(join(tmpdir(), 'revion-meta-'));
const plik = (n) => {
  const f = join(katalog, n);
  writeFileSync(f, Buffer.from([0xff, 0xd8, 0xff, 0xd9]));
  return f;
};

const meta = (g, extra = {}) =>
  utworzMeta({ token: 'TOKEN', pageId: 'PAGE', igUserId: 'IG', fetchImpl: g.fetchImpl, sleep: bezCzekania, ...extra });

test('Facebook: karuzela = zdjęcia wgrane bez publikacji + jeden post z attached_media', async () => {
  const g = udawaneGraph();
  const wynik = await meta(g).publikujFacebook({ opis: 'Cześć', pliki: [plik('01.jpg'), plik('02.jpg')] });
  const [w1, w2, post] = g.wywolania;
  assert.equal(w1.sciezka, 'PAGE/photos');
  assert.equal(w1.parametry.published, 'false');
  assert.equal(w1.parametry.access_token, 'TOKEN');
  assert.equal(w2.sciezka, 'PAGE/photos');
  assert.equal(post.sciezka, 'PAGE/feed');
  assert.equal(post.parametry.message, 'Cześć');
  assert.equal(post.parametry['attached_media[0]'], '{"media_fbid":"ph1"}');
  assert.equal(post.parametry['attached_media[1]'], '{"media_fbid":"ph2"}');
  assert.deepEqual(wynik.zdjecia, ['ph1', 'ph2']);
  assert.match(wynik.link, /^https:\/\/www\.facebook\.com\/PAGE_\d+$/);
});

test('Instagram: pojedyncza grafika czeka na przetworzenie i publikuje', async () => {
  const g = udawaneGraph({ statusyKontenera: { c1: ['IN_PROGRESS', 'IN_PROGRESS', 'FINISHED'] } });
  const wynik = await meta(g).publikujInstagram({ opis: 'Opis', adresy: ['https://x/1.jpg'] });
  const sciezki = g.wywolania.map((w) => `${w.metoda} ${w.sciezka}`);
  assert.deepEqual(sciezki, ['POST IG/media', 'GET c1', 'GET c1', 'GET c1', 'POST IG/media_publish', 'GET m2']);
  assert.equal(g.wywolania[0].parametry.image_url, 'https://x/1.jpg');
  assert.equal(g.wywolania[0].parametry.caption, 'Opis');
  assert.equal(g.wywolania[4].parametry.creation_id, 'c1');
  assert.equal(wynik.link, 'https://www.instagram.com/p/m2/');
});

test('Instagram: karuzela = elementy + kontener CAROUSEL z opisem', async () => {
  const g = udawaneGraph();
  await meta(g).publikujInstagram({ opis: 'Karuzela', adresy: ['https://x/1.jpg', 'https://x/2.jpg'] });
  const tworzenie = g.wywolania.filter((w) => w.sciezka === 'IG/media' && w.metoda === 'POST');
  assert.equal(tworzenie.length, 3);
  assert.equal(tworzenie[0].parametry.is_carousel_item, 'true');
  assert.equal(tworzenie[0].parametry.caption, undefined);
  assert.equal(tworzenie[2].parametry.media_type, 'CAROUSEL');
  assert.equal(tworzenie[2].parametry.children, 'c1,c2');
  assert.equal(tworzenie[2].parametry.caption, 'Karuzela');
});

test('Instagram: kontener z błędem kończy się czytelnym wyjątkiem', async () => {
  const g = udawaneGraph({ statusyKontenera: { c1: ['ERROR'] } });
  await assert.rejects(() => meta(g).publikujInstagram({ opis: 'x', adresy: ['https://x/1.jpg'] }), /odrzucił grafikę/);
});

test('Instagram: ponad 10 grafik jest odrzucane przed wywołaniem API', async () => {
  const g = udawaneGraph();
  await assert.rejects(
    () => meta(g).publikujInstagram({ opis: 'x', adresy: Array.from({ length: 11 }, (_, i) => `https://x/${i}.jpg`) }),
    /maksymalnie 10/,
  );
  assert.equal(g.wywolania.length, 0);
});

test('Błąd tokenu jest rozpoznawany i nie jest ponawiany', async () => {
  const g = udawaneGraph({ bledy: { 'GET PAGE/published_posts': { message: 'Session has expired', code: 190 } } });
  const blad = await meta(g).ostatniePostyFacebook().catch((e) => e);
  assert.ok(blad instanceof MetaBlad);
  assert.equal(blad.tokenNiewazny, true);
  assert.match(blad.message, /kod 190/);
  assert.equal(g.wywolania.length, 1);
});

test('Chwilowy błąd odczytu jest ponawiany, a publikacji posta nie ponawiamy w ciemno', async () => {
  const g1 = udawaneGraph({ bledy: { 'GET PAGE/published_posts': [{ message: 'tmp', code: 2, status: 500 }] } });
  await meta(g1).ostatniePostyFacebook();
  assert.equal(g1.wywolania.length, 2);

  const g2 = udawaneGraph({ bledy: { 'POST PAGE/feed': [{ message: 'tmp', code: 2, status: 500 }] } });
  await assert.rejects(() => meta(g2).publikujFacebook({ opis: 'x', pliki: [plik('a.jpg')] }), /tmp/);
  assert.equal(g2.wywolania.filter((w) => w.sciezka === 'PAGE/feed').length, 1);
});

test('Adres zdjęcia z Facebooka: największa wersja', async () => {
  const g = udawaneGraph();
  assert.equal(await meta(g).adresZdjeciaFb('ph7'), 'https://fbcdn.example/ph7.jpg');
});

test('Token nie trafia do treści błędu', async () => {
  const g = udawaneGraph({ bledy: { 'GET IG/media': { message: 'Unsupported get request', code: 100 } } });
  const blad = await meta(g).ostatniePostyInstagram().catch((e) => e);
  assert.doesNotMatch(blad.message, /TOKEN/);
});
