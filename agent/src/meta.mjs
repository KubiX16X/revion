// Klient Meta Graph API: publikacja na stronie Facebook i na Instagramie (konto profesjonalne połączone ze stroną).
// Wszystko, co tu publikujemy, widać potem normalnie w Meta Business Suite (posty, statystyki, komentarze).
import { readFileSync } from 'node:fs';
import { basename } from 'node:path';

export class MetaBlad extends Error {
  constructor(komunikat, { status, kod, podkod, trace } = {}) {
    super(komunikat);
    this.name = 'MetaBlad';
    this.status = status;
    this.kod = kod;
    this.podkod = podkod;
    this.trace = trace;
  }

  get tokenNiewazny() {
    return this.kod === 190 || this.kod === 102;
  }

  // błędy chwilowe: warto spróbować ponownie za chwilę
  get chwilowy() {
    return this.status >= 500 || [1, 2, 4, 17, 32, 341, 9007].includes(this.kod);
  }
}

const czekaj = (ms) => new Promise((r) => setTimeout(r, ms));

export function utworzMeta({ token, pageId, igUserId, wersja = 'v26.0', fetchImpl = fetch, sleep = czekaj, proby = 3 }) {
  if (!token) throw new Error('Brak tokenu Meta (sekret META_TOKEN).');
  const baza = `https://graph.facebook.com/${wersja}`;

  // Ponawiamy tylko zapytania bez skutków ubocznych (odczyty, wgrywanie nieopublikowanych grafik).
  // Publikacji nie ponawiamy w ciemno: gdyby Meta przyjęła post mimo błędu, powstałby duplikat.
  // Wyjątek: kod 9007 ("grafika jeszcze się przetwarza") oznacza, że nic nie zostało opublikowane.
  async function zapytanie(metoda, sciezka, parametry = {}, { formularz, bezpieczne = metoda === 'GET' } = {}) {
    for (let proba = 1; ; proba++) {
      let url = `${baza}/${sciezka}`;
      const init = { method: metoda };
      if (formularz) {
        formularz.set('access_token', token);
        init.body = formularz;
      } else if (metoda === 'GET') {
        url += `?${new URLSearchParams({ ...parametry, access_token: token })}`;
      } else {
        init.body = new URLSearchParams({ ...parametry, access_token: token });
      }
      let odp;
      try {
        odp = await fetchImpl(url, init);
      } catch (e) {
        // błąd sieci: nie pokazujemy adresu (zawiera token w zapytaniach GET)
        if (bezpieczne && proba < proby) {
          await sleep(2000 * proba);
          continue;
        }
        throw new MetaBlad(`Brak połączenia z Meta (${e.cause?.code ?? e.code ?? e.message})`, { status: 0 });
      }
      const tekst = await odp.text();
      let dane;
      try {
        dane = tekst ? JSON.parse(tekst) : {};
      } catch {
        dane = { error: { message: `Nieoczekiwana odpowiedź (HTTP ${odp.status})` } };
      }
      if (odp.ok && !dane.error) return dane;
      const e = dane.error ?? {};
      const blad = new MetaBlad(
        `${metoda} /${sciezka.split('?')[0]}: ${e.error_user_msg || e.message || `HTTP ${odp.status}`}` +
          (e.code ? ` (kod ${e.code}${e.error_subcode ? `/${e.error_subcode}` : ''})` : ''),
        { status: odp.status, kod: e.code, podkod: e.error_subcode, trace: e.fbtrace_id },
      );
      if (blad.chwilowy && (bezpieczne || blad.kod === 9007) && proba < proby) {
        await sleep(3000 * proba);
        continue;
      }
      throw blad;
    }
  }

  const wymagaj = (wartosc, nazwa) => {
    if (!wartosc) throw new Error(`Brak ${nazwa}. Uruchom "npm run sprawdz", żeby go znaleźć.`);
    return wartosc;
  };

  // --- Facebook ---

  // zdjęcie wgrane bez publikacji; potem dołączamy je do posta (jedno albo kilka naraz)
  async function wgrajZdjecieFb(plik) {
    const formularz = new FormData();
    formularz.set('published', 'false');
    formularz.set('source', new Blob([readFileSync(plik)], { type: 'image/jpeg' }), basename(plik));
    const { id } = await zapytanie('POST', `${wymagaj(pageId, 'META_PAGE_ID')}/photos`, {}, { formularz, bezpieczne: true });
    return id;
  }

  async function publikujFacebook({ opis, pliki }) {
    if (!pliki.length) throw new Error('Post bez grafik');
    const zdjecia = [];
    for (const plik of pliki) zdjecia.push(await wgrajZdjecieFb(plik));
    const parametry = { message: opis };
    zdjecia.forEach((id, i) => {
      parametry[`attached_media[${i}]`] = JSON.stringify({ media_fbid: id });
    });
    const { id } = await zapytanie('POST', `${pageId}/feed`, parametry);
    return { id, link: `https://www.facebook.com/${id}`, zdjecia };
  }

  // publiczny adres wgranego zdjęcia (największa wersja); Instagram pobiera grafiki tylko z adresu URL
  async function adresZdjeciaFb(idZdjecia) {
    const { images = [] } = await zapytanie('GET', idZdjecia, { fields: 'images' });
    const najwieksze = [...images].sort((a, b) => b.width - a.width)[0];
    if (!najwieksze?.source) throw new MetaBlad(`Facebook nie zwrócił adresu zdjęcia ${idZdjecia}`);
    return najwieksze.source;
  }

  async function ostatniePostyFacebook(limit = 10) {
    const { data = [] } = await zapytanie('GET', `${wymagaj(pageId, 'META_PAGE_ID')}/published_posts`, {
      fields: 'id,message,created_time,permalink_url',
      limit: String(limit),
    });
    return data;
  }

  // --- Instagram ---

  // kontener przetwarza się chwilę po stronie Instagrama; czekamy na FINISHED
  async function czekajNaKontener(id, { maks = 40, odstep = 3000 } = {}) {
    for (let i = 0; i < maks; i++) {
      const { status_code: stan, status } = await zapytanie('GET', id, { fields: 'status_code,status' });
      if (stan === 'FINISHED' || stan === 'PUBLISHED') return;
      if (stan === 'ERROR' || stan === 'EXPIRED') {
        throw new MetaBlad(`Instagram odrzucił grafikę (${stan}${status ? `: ${status}` : ''})`);
      }
      await sleep(odstep);
    }
    throw new MetaBlad(`Instagram nie przetworzył grafiki w rozsądnym czasie (kontener ${id})`);
  }

  async function publikujInstagram({ opis, adresy }) {
    const ig = wymagaj(igUserId, 'META_IG_USER_ID');
    if (!adresy.length) throw new Error('Post bez grafik');
    if (adresy.length > 10) throw new Error('Karuzela na Instagramie może mieć maksymalnie 10 grafik');
    let kontener;
    if (adresy.length === 1) {
      ({ id: kontener } = await zapytanie('POST', `${ig}/media`, { image_url: adresy[0], caption: opis }, { bezpieczne: true }));
    } else {
      const dzieci = [];
      for (const image_url of adresy) {
        const { id } = await zapytanie('POST', `${ig}/media`, { image_url, is_carousel_item: 'true' }, { bezpieczne: true });
        dzieci.push(id);
      }
      for (const id of dzieci) await czekajNaKontener(id);
      ({ id: kontener } = await zapytanie(
        'POST',
        `${ig}/media`,
        { media_type: 'CAROUSEL', children: dzieci.join(','), caption: opis },
        { bezpieczne: true },
      ));
    }
    await czekajNaKontener(kontener);
    const { id } = await zapytanie('POST', `${ig}/media_publish`, { creation_id: kontener });
    let link = null;
    try {
      ({ permalink: link } = await zapytanie('GET', id, { fields: 'permalink' }));
    } catch {
      // post jest opublikowany; brak linku nie jest błędem
    }
    return { id, link };
  }

  async function ostatniePostyInstagram(limit = 10) {
    const { data = [] } = await zapytanie('GET', `${wymagaj(igUserId, 'META_IG_USER_ID')}/media`, {
      fields: 'id,caption,timestamp,permalink',
      limit: String(limit),
    });
    return data;
  }

  return {
    zapytanie,
    wgrajZdjecieFb,
    publikujFacebook,
    adresZdjeciaFb,
    ostatniePostyFacebook,
    publikujInstagram,
    ostatniePostyInstagram,
    czekajNaKontener,
  };
}
