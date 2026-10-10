// Udawane Graph API do testów: zapisuje wywołania i odpowiada jak Meta.
export function udawaneGraph({ statusyKontenera = {}, bledy = {}, istniejaceFb = [], istniejaceIg = [], headOk = false } = {}) {
  const wywolania = [];
  let licznik = 0;
  const odpytania = {};

  const fetchImpl = async (url, init = {}) => {
    const u = new URL(url);
    const metoda = init.method ?? 'GET';
    const sciezka = u.pathname.replace(/^\/v[\d.]+\//, '');
    let parametry = Object.fromEntries(u.searchParams);
    if (init.body instanceof URLSearchParams) parametry = Object.fromEntries(init.body);
    else if (init.body instanceof FormData) parametry = Object.fromEntries([...init.body.entries()].map(([k, v]) => [k, typeof v === 'string' ? v : `<plik ${v.name}>`]));
    wywolania.push({ metoda, sciezka, parametry });

    const klucz = `${metoda} ${sciezka}`;
    if (metoda === 'HEAD') return odpowiedz(headOk ? 200 : 404, {});
    if (bledy[klucz]) {
      const b = Array.isArray(bledy[klucz]) ? bledy[klucz].shift() : bledy[klucz];
      if (b) return odpowiedz(b.status ?? 400, { error: b });
    }
    if (metoda === 'POST' && sciezka === 'PAGE/photos') return odpowiedz(200, { id: `ph${++licznik}` });
    if (metoda === 'POST' && sciezka === 'PAGE/feed') return odpowiedz(200, { id: `PAGE_${++licznik}` });
    if (metoda === 'GET' && sciezka === 'PAGE/published_posts') return odpowiedz(200, { data: istniejaceFb });
    if (metoda === 'GET' && sciezka === 'IG/media') return odpowiedz(200, { data: istniejaceIg });
    if (metoda === 'POST' && sciezka === 'IG/media') return odpowiedz(200, { id: `c${++licznik}` });
    if (metoda === 'POST' && sciezka === 'IG/media_publish') return odpowiedz(200, { id: `m${++licznik}` });
    if (metoda === 'GET' && /^ph\d+$/.test(sciezka)) {
      return odpowiedz(200, {
        images: [
          { width: 540, source: `https://fbcdn.example/${sciezka}-maly.jpg` },
          { width: 1080, source: `https://fbcdn.example/${sciezka}.jpg` },
        ],
      });
    }
    if (metoda === 'GET' && /^c\d+$/.test(sciezka)) {
      odpytania[sciezka] = (odpytania[sciezka] ?? 0) + 1;
      const kolejka = statusyKontenera[sciezka] ?? ['FINISHED'];
      return odpowiedz(200, { status_code: kolejka[Math.min(odpytania[sciezka], kolejka.length) - 1] });
    }
    if (metoda === 'GET' && /^m\d+$/.test(sciezka)) return odpowiedz(200, { permalink: `https://www.instagram.com/p/${sciezka}/` });
    if (metoda === 'HEAD') return odpowiedz(headOk ? 200 : 404, {});
    return odpowiedz(404, { error: { message: `nieznane: ${klucz}`, code: 803 } });
  };

  return { fetchImpl, wywolania, licznik: () => licznik };
}

function odpowiedz(status, dane) {
  return new Response(JSON.stringify(dane), { status, headers: { 'content-type': 'application/json' } });
}

export const bezCzekania = async () => {};
