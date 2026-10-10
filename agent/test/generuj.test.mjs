import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { generujTydzien, sprawdzBrief, sprawdzTydzien, nastepnyPoniedzialek, wynikPosta } from '../src/generuj.mjs';
import { zamknijPrzegladarke } from '../src/grafiki.mjs';
import { wczytajUstawienia } from '../src/wspolne.mjs';

after(() => zamknijPrzegladarke());

const ustawienia = { ...wczytajUstawienia(), harmonogram: [{ dzien: 'pon', godzina: '18:30' }, { dzien: 'pt', godzina: '17:00' }] };
const brief = '# Revion\nSprzedajemy przykładowy produkt.';

const slajd = (typ, extra = {}) => ({ typ, etykieta: '', naglowek: 'Nagłówek', tekst: '', punkty: [], przycisk: '', ...extra });
const post = (temat, extra = {}) => ({
  temat,
  filar: 'Edukacja',
  cel: 'zaufanie',
  opis: 'Hak.\n\nTreść. Więcej: {LINK}',
  hashtagi: ['revion', 'porady'],
  slajdy: [slajd('okladka', { naglowek: `${temat} ==teraz==` }), slajd('lista', { punkty: ['Jeden', 'Dwa'] }), slajd('cta', { przycisk: 'Zapisz się' })],
  ...extra,
});
const tydzien = (posty) => ({ posty, tiktoki: [{ tytul: 'T', hak: 'H', scenariusz: 'S', tekst_na_ekranie: 'E', opis: 'O' }], notatka: 'Plan.' });

function udawanyKlient(odpowiedzi) {
  const zapytania = [];
  return {
    zapytania,
    beta: {
      messages: {
        parse: async (params) => {
          zapytania.push(params);
          return { stop_reason: 'end_turn', parsed_output: odpowiedzi.shift(), content: [] };
        },
      },
    },
  };
}

test('brief z polami [UZUPEŁNIJ] blokuje generowanie', () => {
  assert.throws(() => sprawdzBrief('Produkt: [UZUPEŁNIJ: nazwa]'), /1 pól \[UZUPEŁNIJ\]/);
  assert.doesNotThrow(() => sprawdzBrief(brief));
});

test('następny poniedziałek w strefie marki', () => {
  assert.equal(nastepnyPoniedzialek(new Date('2026-10-10T15:00:00Z'), 'Europe/Warsaw'), '2026-10-12'); // sobota
  assert.equal(nastepnyPoniedzialek(new Date('2026-10-12T08:00:00Z'), 'Europe/Warsaw'), '2026-10-19'); // poniedziałek
});

test('walidacja wyłapuje złą liczbę postów, za długie teksty i hashtagi w opisie', () => {
  const bledy = sprawdzTydzien(tydzien([post('A', { opis: 'x #tag' }), post('B', { slajdy: [slajd('tekst', { naglowek: 'x'.repeat(120) })] })]), 3);
  assert.ok(bledy.some((b) => /dokładnie 3/.test(b)));
  assert.ok(bledy.some((b) => /hashtagi mają być w osobnym polu/.test(b)));
  assert.ok(bledy.some((b) => /pierwszy slajd/.test(b)));
  assert.ok(bledy.some((b) => /nagłówek ma 120 znaków/.test(b)));
});

test('generuje tydzień: posty w kolejce, grafiki, poprawka po błędzie walidacji', async () => {
  const kolejka = mkdtempSync(join(tmpdir(), 'revion-kolejka-'));
  const klient = udawanyKlient([
    tydzien([post('Pierwszy')]), // za mało postów -> poprawka
    tydzien([post('Pierwszy temat'), post('Drugi temat', { slajdy: [slajd('cytat', { naglowek: 'Krótki cytat', tekst: 'Autor' })] })]),
  ]);
  const wynik = await generujTydzien({ klient, ustawienia, brief, notatki: 'Promocja -10%', posty: [], od: '2026-10-12', katalogKolejki: kolejka, log: () => {} });

  assert.equal(klient.zapytania.length, 2);
  assert.equal(klient.zapytania[0].model, 'claude-opus-5-5');
  assert.equal(klient.zapytania[0].fallbacks, 'default');
  assert.match(klient.zapytania[0].messages[0].content, /Promocja -10%/);
  assert.match(klient.zapytania[0].messages[0].content, /1\. pon 2026-10-12, godz\. 18:30/);
  assert.match(klient.zapytania[1].messages[0].content, /Potrzeba dokładnie 2 postów/);

  assert.equal(wynik.posty.length, 2);
  const [a, b] = wynik.posty;
  assert.equal(a.dane.kiedy, '2026-10-12T18:30:00+02:00');
  assert.equal(b.dane.kiedy, '2026-10-16T17:00:00+02:00');
  assert.equal(a.dane.status, 'zaplanowany');
  assert.deepEqual(a.dane.grafiki, ['01.jpg', '02.jpg', '03.jpg']);
  assert.deepEqual(b.dane.grafiki, ['01.jpg']);
  assert.ok(existsSync(join(a.katalog, '03.jpg')));
  const zapisany = JSON.parse(readFileSync(join(a.katalog, 'post.json'), 'utf8'));
  assert.equal(zapisany.slajdy[0].punkty, undefined, 'puste pola nie trafiają do post.json');
  assert.deepEqual(readdirSync(join(kolejka, '2026-10-12_tydzien')).sort(), ['2026-10-12-pierwszy-temat', '2026-10-16-drugi-temat']);
});

test('nie nadpisuje tygodnia, który już ma posty', async () => {
  const istniejacy = [{ dane: { kiedy: '2026-10-12T18:30:00+02:00', status: 'zaplanowany', temat: 'x' } }];
  await assert.rejects(
    () => generujTydzien({ klient: udawanyKlient([]), ustawienia, brief, notatki: '', posty: istniejacy, od: '2026-10-12', log: () => {} }),
    /ma już posty/,
  );
});

test('wynik zaangażowania liczy zapisy i udostępnienia mocniej niż polubienia', () => {
  assert.equal(wynikPosta({}), null);
  assert.equal(wynikPosta({ statystyki: { facebook: { reakcje: 10, komentarze: 1 }, instagram: { polubienia: 5, zapisy: 2 } } }), 10 + 2 + 5 + 6);
});
