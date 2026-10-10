import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { isoWStrefie, slotyTygodnia, zbudujOpis, normalizujHashtag, dataLokalna, wczytajUstawienia, REPO, KOLEJKA } from '../src/wspolne.mjs';

test('godzina w strefie marki z poprawnym przesunięciem latem i zimą', () => {
  assert.equal(isoWStrefie('2026-10-12', '18:30', 'Europe/Warsaw'), '2026-10-12T18:30:00+02:00');
  assert.equal(isoWStrefie('2026-11-02', '18:30', 'Europe/Warsaw'), '2026-11-02T18:30:00+01:00');
  // dzień zmiany czasu (25.10.2026, 03:00 -> 02:00)
  assert.equal(isoWStrefie('2026-10-25', '19:00', 'Europe/Warsaw'), '2026-10-25T19:00:00+01:00');
});

test('sloty tygodnia według harmonogramu', () => {
  const u = { strefa_czasowa: 'Europe/Warsaw', harmonogram: [{ dzien: 'pon', godzina: '18:30' }, { dzien: 'pt', godzina: '17:00' }] };
  const sloty = slotyTygodnia('2026-10-12', u);
  assert.deepEqual(sloty.map((s) => s.kiedy), ['2026-10-12T18:30:00+02:00', '2026-10-16T17:00:00+02:00']);
});

test('data lokalna po północy UTC', () => {
  assert.equal(dataLokalna(new Date('2026-10-12T22:30:00Z'), 'Europe/Warsaw'), '2026-10-13');
});

test('hashtagi: bez duplikatów, bez znaków specjalnych, z polskimi literami', () => {
  assert.equal(normalizujHashtag('##Zdrowie Psychiczne!'), '#ZdrowiePsychiczne');
  assert.equal(normalizujHashtag('#'), '');
  const u = { link: 'https://revion.pl/', tekst_linku_instagram: 'link w bio', hashtagi_stale: ['#revion'] };
  const opis = zbudujOpis({ opis: 'A {LINK}', hashtagi: ['revion', 'jakość'] }, 'instagram', u);
  assert.equal(opis, 'A link w bio\n\n#revion #jakość');
});

test('za długi opis na Instagram jest błędem', () => {
  const u = { link: 'https://revion.pl/', tekst_linku_instagram: 'link w bio', hashtagi_stale: [] };
  assert.throws(() => zbudujOpis({ opis: 'x'.repeat(2300), hashtagi: [] }, 'instagram', u), /limit 2200/);
  assert.doesNotThrow(() => zbudujOpis({ opis: 'x'.repeat(2300), hashtagi: [] }, 'facebook', u));
});

test('ustawienia z repozytorium są poprawne', () => {
  const u = wczytajUstawienia();
  assert.equal(u.marka, 'Revion');
  assert.ok(u.harmonogram.length > 0);
});

test('katalog główny repozytorium: tam są workflowy, a kolejka ma ścieżkę "kolejka/" (adresy grafik dla Instagrama)', () => {
  assert.ok(existsSync(join(REPO, '.github', 'workflows', 'revion-publikacja.yml')));
  assert.ok(existsSync(join(REPO, 'ustawienia.json')));
  assert.equal(relative(REPO, join(KOLEJKA, '2026-10-12_start', 'a', '01.jpg')).split(/[\\/]/).join('/'), 'kolejka/2026-10-12_start/a/01.jpg');
});
