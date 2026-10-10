// Logo Revion: geometryczne „R” (stalowy trzon i brzuszek, cyjanowa noga = ruch do przodu) + napis REVION.
// Warianty: "stal" (na ciemne tło), "atrament" (na jasne tło), "bialy" (jednokolorowy).
import { KOLORY } from './wspolne.mjs';

let licznik = 0;

export function znak({ wariant = 'stal', rozmiar = 100 } = {}) {
  const id = `stal${++licznik}`;
  const wypelnienie = { stal: `url(#${id})`, atrament: KOLORY.noc, bialy: '#FFFFFF' }[wariant];
  const noga = wariant === 'bialy' ? '#FFFFFF' : KOLORY.cyjan;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${rozmiar}" height="${rozmiar}" role="img" aria-label="Revion">
  <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#F4F7FB"/><stop offset=".55" stop-color="#AEB8C7"/><stop offset="1" stop-color="#E3E8EF"/>
  </linearGradient></defs>
  <rect x="21" y="15" width="12" height="70" fill="${wypelnienie}"/>
  <path d="M33 15h23a18.5 18.5 0 0 1 0 37H33V40.5h23a7 7 0 0 0 0-14H33z" fill="${wypelnienie}"/>
  <path d="M46 52h13.5l21 33H67z" fill="${noga}"/>
</svg>`;
}

// napis w Archivo Expanded; wymaga załadowanego fontu 'Archivo Variable'
export function napis({ kolor = '#E6EBF2', rozmiar = 30 } = {}) {
  return `<span style="font-family:'Archivo Variable';font-weight:700;font-stretch:125%;letter-spacing:.32em;font-size:${rozmiar}px;color:${kolor};padding-left:.32em;line-height:1">REVION</span>`;
}
