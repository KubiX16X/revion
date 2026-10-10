# Revion: szczera ocena i plan na dochód (pół)pasywny

**Stan na 10.10.2026.** Podstawa: kod wszystkich stron revion.pl (przesłany przez Ciebie) oraz research:
prawo konsumenckie, rynek szablonów Notion w Polsce i badania naukowe do ebooków.
Nie widzę Twoich statystyk strony ani panelu Stripe, więc liczby przychodów poniżej to modele z jawnymi założeniami.

## Werdykt w 30 sekund

- **Czy to ma sens? Tak, ale jako mały, półpasywny biznes, a nie maszyna do pieniędzy.**
  Polski szablon „Life OS” w Notion za kilkadziesiąt złotych to realny produkt na realnym, choć małym rynku.
- **Ocena pomysłu: 6/10. Ocena dotychczasowego wykonania: 2/10.**
- **2 sprzedaże w pół roku to nie wina produktu.** To skutek trzech rzeczy naraz: zerowego ruchu
  (brak profili, listy mailowej, reklam), braku zaufania (nieznana marka, wymyślone opinie, fałszywy licznik)
  i chaosu w ofercie (8 kombinacji cen).
- **Realny cel po 6–12 miesiącach regularnej pracy: ok. 1,5–3 tys. zł miesięcznie.** Więcej jest możliwe,
  ale wymaga trafionego formatu wideo i reklam opłacanych z zysku.
- **Uwaga na sufit:** działalność nierejestrowana w 2026 r. to maks. 10 813,50 zł przychodu na kwartał
  (ok. 3,6 tys. zł miesięcznie). Powyżej masz 7 dni na wpis do CEIDG.

## Co jest dobre i zostaje

- **Produkt da się pokazać na wideo.** Nagranie ekranu z pulpitem Notion to idealny materiał na TikToka i Reels.
  Większość produktów cyfrowych tego nie ma.
- **Cena 47 zł jest rynkowa.** Polskie szablony „życiowe” kosztują 19–49,90 zł, finansowe 87–159 zł.
- **Rynek jest rozdrobniony.** Kilkanaście małych sprzedawców, bez wyraźnego lidera i bez nikogo, kto regularnie
  robi krótkie wideo o Notion po polsku na dużą skalę.
- **Masz wyróżnik.** Konkurencja to głównie pastelowe planery kierowane do kobiet albo narzędzia B2B.
  Ciemna, „techniczna” estetyka i ton „dyscypliny” dla 18–35-latków nie mają polskiego odpowiednika.
- **Prawdziwe zrzuty ekranu i uczciwa sekcja „dla kogo / nie dla kogo”** – to było najlepsze na starej stronie.
- **Tani zestaw narzędzi:** Stripe, WordPress, MailerLite. Nie trzeba płacić za platformę.

## Co było złe (i co już naprawiłem w tej paczce)

| Problem na starej stronie | Dlaczego to poważne | Co jest teraz |
|---|---|---|
| Licznik „oferta wygasa za 20:00”, który startuje od nowa po odświeżeniu | Czarna lista (art. 7 pkt 7 ustawy o nieuczciwych praktykach). UOKiK ukarał sklep Bak Drop 100 710 zł właśnie za taki licznik. | Nowa strona bez licznika. Pilność tylko prawdziwa (np. cena premierowa z datą końca). |
| Przekreślone „197 zł”, które nigdy nie obowiązywało | Fikcyjna obniżka, naruszenie zasad Omnibus | Usunięte. 47 zł to zwykła cena. |
| Opinie „Marek, Karolina, Piotr” przy 2 sprzedażach | Czarna lista (fałszywe opinie, brak weryfikacji). W 2026 r. UOKiK postawił zarzuty Samsungowi nawet za słabą weryfikację. | Usunięte. Mail w 7. dniu po zakupie zbiera prawdziwe opinie za zgodą. |
| „Gwarancja satysfakcji” obok „nie oferuję zwrotów” | Sprzeczne, wprowadza w błąd | Jedna jasna zasada: 14 dni na zwrot (rekomendacja; możesz ją wyłączyć w konfiguracji strony). |
| Regulamin powołuje się na checkbox, którego nie ma | Bez zgody każdy klient ma 14 dni na odstąpienie | Gotowy tekst zgody do Stripe i e-mail z potwierdzeniem (`strona/dokumenty/`). |
| Prezent (ebook o nawykach) nie ma linku na żadnej stronie dostawy; zepsuty link do ikon w pakiecie „Tytan”; brak strony dla zestawu ebook + VIP | Niedostarczenie opłaconej treści cyfrowej | Nowe strony dostawy (2 zamiast 7), mail z przeprosinami i plikami dla 2 obecnych klientów. |
| 8 linków płatności, ebook + VIP za 135 zł droższe niż wszystko za 99 zł, dodatek droższy niż produkt, płatne „wsparcie VIP” | Chaos decyzyjny, sugeruje, że produkt jest trudny | Dwa pakiety: **Life OS 47 zł** i **Pakiet Pro 69 zł**. |
| Brak jakiegokolwiek zapisu na newsletter | Kto nie kupi przy pierwszej wizycie, przepada na zawsze | Darmowy ebook „Nawyki Żelaznej Dyscypliny” za zapis + 7 maili sprzedających automatycznie. |
| Ebook „Deep Work Masterclass” | „Deep Work” to tytuł książki Cala Newporta | Nowy ebook od zera: „Skupienie Absolutne”. |
| Logo to JPG z generatora AI; brak tagów Open Graph i Pixela | Brak zaufania i brak pomiaru | Nowe logo (SVG), instrukcja OG i Pixela (po zgodzie cookies). |
| Teksty „link wygasa po jednym kliknięciu” przy publicznych linkach | Nieprawda; strony dostawy może otworzyć każdy | Prawdziwe teksty, noindex, docelowo dostawa mailem. |

## Ile to może zarabiać

Na każdej sprzedaży przez Stripe (karty z EOG: 1,5% + 1 zł) zostaje ok. **45,30 zł z 47 zł** i **ok. 67 zł z 69 zł**.

Przyjmuję średni koszyk ok. 55 zł (część osób weźmie Pakiet Pro). Widełki konwersji to typowe zakresy dla
tanich produktów cyfrowych, a nie gwarancja.

| Scenariusz (po 6–12 miesiącach) | Założenia | Sprzedaże / mies. | Przychód / mies. |
|---|---|---|---|
| Pesymistyczny | TikTok nagrywany „od czasu do czasu”, brak listy mailowej | 0–5 | 0–300 zł |
| **Realny** | 4–5 filmów tygodniowo przez pół roku, agent publikuje na FB/IG, lista 500–1 500 osób, maile działają | **25–50** | **1,4–2,8 tys. zł** |
| Optymistyczny | Jeden format wideo się „przyjmie”, reklamy opłacane z zysku | 100–200 | 5,5–11 tys. zł (wymaga założenia firmy) |

Skąd biorą się sprzedaże: przy konwersji strony 1–2% 30 sprzedaży miesięcznie wymaga ok. 1 500–3 000 wejść
miesięcznie. Alternatywnie: lista 1 000–3 000 osób, z której 1–3% kupuje w miesiącu.
Dlatego **najcenniejszym aktywem jest lista mailowa**, a nie liczba obserwujących.

## Czy to będzie pasywne?

| Działa samo | Zostaje po Twojej stronie |
|---|---|
| Posty na Facebooku i Instagramie (agent pisze, robi grafiki, publikuje, uczy się z wyników) | TikTok: 2–3 h tygodniowo (agent daje 3 scenariusze co tydzień), te same filmy jako Rolki |
| Płatność i dostęp do produktu | Odpowiedzi na komentarze i maile: ok. 10 minut dziennie |
| Maile po zapisie i po zakupie (sprzedają 24/7) | 5 minut w sobotę na zatwierdzenie postów (albo zero przy trybie automatycznym) |
| | Poprawki szablonu i ebooków: raz na kwartał |

Uczciwie: pierwsze 2–3 miesiące to **budowa**. Półpasywnie robi się wtedy, gdy lista rośnie z każdego filmu,
a maile sprzedają bez Twojego udziału.

## Plan na 90 dni

### Tydzień 1: wdrożenie (ok. 4–6 godzin)

- [ ] Wgraj nową stronę (`strona/JAK-WDROZYC.md`) i obrazy, ustaw noindex na stronach dostawy.
- [ ] Stripe: link 69 zł dla Pakietu Pro, checkbox zgody (tekst w `strona/dokumenty/teksty-zgod.md`), BLIK.
      Wyłącz stare linki (59, 76, 88, 99, 106, 118, 135 zł).
- [ ] Nowy regulamin i polityka prywatności (`strona/dokumenty/`). Najlepiej z krótką konsultacją prawnika.
- [ ] MailerLite: formularz i automatyzacje (`strona/maile/00-instrukcja-mailerlite.md`).
- [ ] Wyślij mail do 2 obecnych klientów (`strona/maile/03-obecni-klienci.md`).
- [ ] Profile FB, IG, TikTok i agent (`instrukcje/01–03`). Grafiki profili są w `grafiki/`.

### Tygodnie 2–6: ruch

- TikTok 4–5 razy w tygodniu, te same filmy jako Rolki na FB i IG.
- Agent: 4 posty tygodniowo na FB i IG.
- **Cel:** 100 osób na liście i pierwsze 5–10 sprzedaży.
  Jeśli lista nie rośnie, zmieniamy hak filmów albo prezent za zapis, a nie kanał.

### Tygodnie 7–12: dźwignia

- Pierwsze prawdziwe opinie na stronę (z informacją, jak je weryfikujesz).
- Test: wersja „Student OS” przed sesją zimową (tani spin-off Life OS, patrz alternatywy).
- Reklamy 20–30 zł dziennie **tylko** na film, który już organicznie zebrał najwięcej zapisów, i tylko na darmowy ebook.
- Przy przychodzie zbliżającym się do 8 tys. zł w kwartale przygotuj JDG (ulga na start).

**Co tydzień patrzymy na 5 liczb:** wyświetlenia filmów, wejścia na stronę, zapisy na listę, sprzedaże, konwersja.

## Alternatywy (gdybyś chciał zacząć od zera)

Moja rekomendacja: **zostać przy Revion i rozbudować go o warianty**, a nie zaczynać od zera.
Masz już produkt, ebooki, stronę, grafiki i agenta. Gdybyś jednak wolał coś innego, oto trzy realne kierunki:

| Kierunek | Dla kogo i co | Cena | Plusy | Minusy | Ocena |
|---|---|---|---|---|---|
| **Revion Student OS** (spin-off) | Studenci: plan zajęć, sesja, notatki, budżet studenta w Notion | 29–39 zł | Największa grupa Notion na TikToku, sezonowość (październik, sesje), łatwo zbudować z Life OS | Niska cena, studenci liczą każdą złotówkę | 7/10 |
| **Revion Finanse** (Notion + Arkusze Google) | Młodzi dorośli: budżet domowy, oszczędzanie, długi | 49–89 zł | Ludzie płacą więcej za finanse (rynek 87–159 zł), wersja w Arkuszach Google trafia do większej grupy niż Notion | Trzeba zbudować nowy produkt, temat wymaga ostrożności (bez porad inwestycyjnych) | 7/10 |
| **Mapa Opiekuna** (projekt w tym repozytorium) | Opiekunowie rodzinni: świadczenia i sprawy urzędowe | 67–97 zł | Ogromna wartość dla kupującego (tysiące zł świadczeń), mała konkurencja | Wrażliwa grupa, coroczna aktualizacja przepisów, więcej pracy z ludźmi, mniej „pasywne” | 7/10, ale inny charakter |

**Ważne:** masz w repozytorium dwa projekty. Przy kilku godzinach tygodniowo nie da się prowadzić obu na pełnych
obrotach. Wybierz jeden główny na 90 dni. Jeśli celem jest dochód możliwie pasywny, wybrałbym Revion.

## Pierwsze 10 TikToków

Nagrywasz ekran (telefon albo komputer) i mówisz do kamery albo lektorem. Hak w pierwszych 2 sekundach.

1. „Tak wygląda mój cały tydzień w jednym ekranie.” (przewijanie Kokpitu)
2. „Nawyk nie powstaje w 21 dni. Badanie mówi: mediana 66.” (ebook, rozdział 06)
3. „Zrób to wieczorem, a rano nie będziesz się zastanawiać, od czego zacząć.” (Strategia Generała)
4. „Masz notatki w trzech aplikacjach? Pokażę, jak to połączyć.” (Inbox → Dziś)
5. „Silna wola to nie bateria. Ta teoria nie przetrwała replikacji.” (mit vs fakt)
6. „Ile naprawdę wydałem w tym miesiącu? Sprawdźmy w Notion.” (Finanse, na przykładowych liczbach)
7. „3 priorytety zamiast listy 15 zadań. Dlaczego to działa.”
8. „Telefon na biurku obniża skupienie? Co mówią badania, a co jest mitem.” (Skupienie Absolutne)
9. „Mój projekt był za duży, więc rozbiłem go na kroki po 20 minut.” (Projekty)
10. „Pobierz za darmo ebook o nawykach, link w bio.” (lead magnet, raz w tygodniu)

## Źródła najważniejszych ustaleń

- UOKiK, kara 100 710 zł za fałszywy licznik (Bak Drop, 2023): https://uokik.gov.pl/en/a-false-time-meter-at-an-intermediary-which-pretends-to-be-a-store
- UOKiK, kara ponad 31 mln zł dla Amazon (m.in. liczniki czasu): https://uokik.gov.pl/en/pln-31-million-fine-for-amazon
- Ustawa o informowaniu o cenach towarów i usług (Omnibus, najniższa cena z 30 dni): https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20230000168
- Zarzuty UOKiK dla Samsunga za weryfikację opinii (2026): https://www.wiadomoscihandlowe.pl/handel-i-dystrybucja/samsung-i-weryfikowanie-opinii-uokik-stawia-zarzuty-2531444
- Działalność nierejestrowana, limit i obowiązki: https://www.biznes.gov.pl/pl/portal/00115
- Konkurencja i ceny: https://onaplanuje.pl/ · https://ogarniamsie.pl/kategoria-produktu/planer-cyfrowy/planer-online/notion-szablony/ · https://www.szablonynotion.pl/produkty · https://arturtomala.pl/szablony
- Pełne wyniki researchu (z wszystkimi źródłami): `produkty/*/zrodlo/baza-faktow.json` (nauka) oraz raport prawny i rynkowy w `strona/dokumenty/`.
