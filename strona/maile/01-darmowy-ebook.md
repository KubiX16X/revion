# Sekwencja 01: darmowy ebook „Nawyki Żelaznej Dyscypliny”

Automatyzacja w MailerLite: **„A – Darmowy ebook”**. Konfigurację krok po kroku opisuje `00-instrukcja-mailerlite.md`, sekcja 7A.

- **Wyzwalacz:** subskrybent dołącza do grupy **Darmowy ebook**. Przy podwójnym potwierdzeniu (double opt-in) do grupy trafia dopiero po kliknięciu w link potwierdzający.
- **Kto dostaje:** osoby, które zapisały się przez formularz i zgodziły się na newsletter z poradami i ofertami.
- **Długość:** 7 maili w 13 dni. Potem subskrybent zostaje na liście i dostaje zwykły newsletter.
- **Nadawca:** Kuba z Revion `<kontakt@revion.pl>`. Odpowiedzi trafiają na tę samą skrzynkę.
- **Stopka:** wersja „newsletter” z `00-instrukcja-mailerlite.md`, sekcja 4.

## Harmonogram

| # | Opóźnienie po poprzednim kroku | Dzień | Temat przewodni | Warunek przed wysłaniem |
|---|---|---|---|---|
| 1 | natychmiast | 0 | Ebook + jedno szybkie zwycięstwo | brak |
| 2 | 2 dni | 2 | Poranek: pierwsza godzina, nie 5:00 (rozdz. 01) | brak |
| 3 | 2 dni | 4 | Dlaczego powstał Revion (szablon do uzupełnienia) | brak |
| 4 | 2 dni | 6 | Wieczorne 5 minut i Life OS od środka (rozdz. 02) | nie jest klientem |
| 5 | 2 dni | 8 | Szczere odpowiedzi na obiekcje | nie jest klientem |
| 6 | 2 dni | 10 | Oferta: Life OS 29 zł / Pakiet Pro 69 zł, gwarancja 14 dni | nie jest klientem |
| 7 | 3 dni | 13 | Technika 3–2–1 i miękkie zaproszenie (rozdz. 03) | nie jest klientem |

**„Nie jest klientem”** oznacza, że subskrybent nie należy ani do grupy *Klienci Life OS*, ani do *Klienci Pakiet Pro*. Kto kupi w trakcie serii, przestaje dostawać maile sprzedażowe. Ustawienie warunku opisuje instrukcja w sekcji 7A.

**Pora wysyłki:** jeśli MailerLite pozwala ustawić godzinę w kroku opóźnienia, wybierz stałą porę, np. 18:30 czasu polskiego. Mail 1 wychodzi od razu po potwierdzeniu zapisu.

## Zasady, których pilnujemy w tej serii

- Żadnych liczników, „ceny tylko dziś”, cen przekreślonych ani wartości w złotych przy prezencie.
- Żadnych opinii klientów, dopóki nie zbierzesz prawdziwych (patrz `02-po-zakupie.md`, mail z 7. dnia).
- Każda liczba i każde badanie pochodzi z ebooka, a ebook podaje źródła. Jeśli zmienisz treść, nie dopisuj liczb „z głowy”.
- Piszemy na „Ty”, formy grzecznościowe wielką literą (Ty, Ciebie, Twój). Unikamy form rodzajowych czytelnika.
- Bez emoji w tematach i w treści. Bez wykrzykników.

## Oznaczenia

- `[LINK: opis – adres]` to przycisk albo link. W MailerLite wstaw blok „Button” i wklej adres.
- `[OBRAZ: …]` to zdjęcie do wstawienia blokiem „Image” (adres i tekst alternatywny podane w nawiasie).
- `[UZUPEŁNIJ: …]` uzupełnia właściciel. Przed włączeniem automatyzacji w plikach nie może zostać ani jeden taki nawias.
- Adres PDF ebooka: `https://revion.pl/wp-content/uploads/2026/10/Nawyki-Zelaznej-Dyscypliny-Revion.pdf` (z `konfiguracja.json`).

---

## Mail 1 · dzień 0 · ebook i jedno szybkie zwycięstwo

**Opóźnienie:** natychmiast po dołączeniu do grupy (czyli po potwierdzeniu zapisu).

**Temat A:** Twój ebook „Nawyki Żelaznej Dyscypliny”
**Temat B:** Ebook w środku i zadanie na 30 sekund

**Tekst podglądu:** PDF do pobrania i jedna rzecz, którą zrobisz jeszcze dziś wieczorem.

**Treść:**

Cześć,

dzięki za zapis. Obiecany ebook jest tutaj:

**Przycisk:** „Pobierz ebook (PDF)” → [LINK: PDF ebooka – https://revion.pl/wp-content/uploads/2026/10/Nawyki-Zelaznej-Dyscypliny-Revion.pdf]

Zapisz plik na telefonie albo komputerze. Do tego maila możesz też wrócić w każdej chwili.

Zanim zaczniesz czytać, jedna rzecz na dziś. Zajmie 30 sekund.

**Dziś wieczorem zapisz jedno zdanie na jutro: najważniejsze zadanie, jego pierwszy fizyczny krok i godzinę startu.**

Na przykład: „Raport kwartalny → otwieram plik i wpisuję nagłówki trzech sekcji → 8:30”.

Dlaczego to działa? Rano pytanie „od czego zacząć?” zawsze ma łatwą odpowiedź: od maila, od drobiazgu, od „najpierw ogarnę biurko”. Plan z wieczora zamyka to pytanie, zanim padnie. Badania nad planami typu „kiedy, gdzie i jak” pokazują, że wyraźnie zwiększają one szansę, że zrobisz to, co zamierzasz (Gollwitzer i Sheeran, 2006).

Jutro rano przeczytaj swoje zdanie i ruszaj. Bez poprawiania planu.

Pełna wersja tej metody, „Wieczorne 5 minut”, jest w rozdziale 02.

**Co dalej?** Przez najbliższe dwa tygodnie wyślę Ci jeszcze sześć krótkich maili. W każdym jedna rzecz do wdrożenia. Pod koniec pokażę Ci też Revion Life OS, czyli szablon Notion, w którym te nawyki mają jedno miejsce. Nie musisz go kupować. Ebook działa także z kartką i długopisem.

Jedna prośba: odpisz na tego maila jednym słowem. Z czym masz dziś największy kłopot? Poranek, odkładanie, skupienie czy porządek w sprawach? Czytam każdą odpowiedź. Przy okazji Twoja odpowiedź pomaga, żeby kolejne maile trafiały do głównej skrzynki, a nie do spamu.

Kuba
Revion

P.S. Ten mail trafił do zakładki „Oferty” albo do spamu? Przeciągnij go do głównej skrzynki. Wtedy kolejne lekcje dotrą tam, gdzie je zobaczysz.

**CTA:** Pobierz ebook (PDF) → [LINK: PDF ebooka – https://revion.pl/wp-content/uploads/2026/10/Nawyki-Zelaznej-Dyscypliny-Revion.pdf]

---

## Mail 2 · dzień 2 · poranek bez 5:00

**Opóźnienie:** 2 dni po mailu 1.

**Temat A:** Nie musisz wstawać o 5:00
**Temat B:** Kto ustala program Twojej pierwszej godziny?

**Tekst podglądu:** Stała pora pobudki daje więcej niż wczesna. I jedna zmiana na dziś wieczór.

**Treść:**

Cześć,

budzik dzwoni, a ręka sięga po telefon, zanim otworzysz oczy. Maile, grupa z pracy albo ze studiów, rolka „na 30 sekund”. Kwadrans później wstajesz z łóżka z cudzą listą spraw w głowie.

Problem rzadko polega na tym, że wstajesz za późno. Częściej na tym, że pierwsze minuty dnia oddajesz innym.

W ebooku definiujemy „Monk Mode” skromniej niż internet: **to pierwsza godzina po przebudzeniu bez telefonu i bez cudzych priorytetów.** Bez lodowatego prysznica i bez budzika na 5:00.

Wstawanie o 5:00 ma świetny marketing, ale słabe dane. Badania wskazują trzy rzeczy ważniejsze niż godzina na budziku:

- **Chronotyp.** „Sowy” i „skowronki” to w dużej mierze biologia, częściowo zapisana w genach. Najpóźniejszy chronotyp mają zwykle osoby około 20. roku życia.
- **Długość snu.** Dorośli potrzebują regularnie co najmniej 7 godzin snu. Pobudka o 5:00 przy zasypianiu o północy to 5 godzin snu, a nie dyscyplina.
- **Regularność.** Ta sama pora pobudki przez cały tydzień daje więcej niż wczesna pora pobudki.

**Jedna zmiana na dziś: telefon ładuje się poza sypialnią.** Jeśli to Twój budzik, zwykły budzik kosztuje kilkadziesiąt złotych. Postaw go po drugiej stronie pokoju. Wtedy pierwszą decyzję jutra podejmiesz Ty, a nie aplikacja.

A jutro rano: najpierw światło (odsłoń okno, kilka minut na balkonie albo w drodze), potem jedno zadanie zapisane wieczorem, dopiero potem skrzynka.

Chcesz sprawdzić swój punkt wyjścia? W rozdziale 01 jest ćwiczenie „Audyt pierwszej godziny”. Przez 3 dni notujesz, co robisz po przebudzeniu i czyj to priorytet: Twój czy cudzy. Czwartego dnia zaznaczasz moment, w którym pojawił się pierwszy cudzy priorytet. Twój cel: przesunąć go o godzinę później.

**Przycisk:** „Otwórz rozdział 01” → [LINK: PDF ebooka – https://revion.pl/wp-content/uploads/2026/10/Nawyki-Zelaznej-Dyscypliny-Revion.pdf]

Kuba

P.S. Jeśli od miesięcy źle śpisz mimo 7–8 godzin w łóżku, porozmawiaj z lekarzem. Żadna poranna rutyna nie zastąpi diagnozy.

**CTA:** Otwórz rozdział 01 → [LINK: PDF ebooka – https://revion.pl/wp-content/uploads/2026/10/Nawyki-Zelaznej-Dyscypliny-Revion.pdf]

---

## Mail 3 · dzień 4 · dlaczego powstał Revion (SZABLON DO UZUPEŁNIENIA)

**Opóźnienie:** 2 dni po mailu 2.

### Instrukcja dla właściciela: przeczytaj, zanim uzupełnisz

Ten mail działa tylko wtedy, gdy historia jest prawdziwa. Dlatego nie ma tu gotowego tekstu do podpisania, tylko pytania i początki zdań.

- Pisz wyłącznie to, co się wydarzyło. Lepiej krótko i zwyczajnie niż efektownie i nieprawdziwie.
- Nie podawaj liczb, których nie mierzyłeś (np. „odzyskałem 10 godzin tygodniowo”). Pisz „mniej zapominam”, „wiem, od czego zacząć dzień”, jeśli tak jest.
- Nie obiecuj czytelnikowi efektów. Opisujesz swoją drogę, a nie jego przyszłość.
- Nie wymyślaj postaci ani „klientów”. Jeśli przywołujesz znajomego, zapytaj go o zgodę.
- Na każde pole wystarczą 2–4 zdania, krótkie (12–16 słów). Cały mail: 250–350 słów.
- Usuń wszystkie nawiasy kwadratowe. Tekst poza nawiasami jest gotowy i oparty na ebooku.

**Temat A:** Dlaczego w ogóle powstał Revion
**Temat B:** [UZUPEŁNIJ: temat z Twojej historii, np. „Mój system w pięciu aplikacjach i na trzech kartkach” – tylko jeśli to prawda]

**Tekst podglądu:** Krótko o tym, kto do Ciebie pisze. I dlaczego nie wierzę w silną wolę.

**Treść:**

Cześć,

dziś mniej technik, a więcej o tym, kto do Ciebie pisze.

[UZUPEŁNIJ – scena otwierająca, 2–3 zdania. Konkretny moment, w którym poczułeś, że Twój sposób ogarniania spraw się sypie. Pytania pomocnicze: gdzie byłeś? Co zapomniałeś albo zawaliłeś? Ile aplikacji, kartek i notatek było wtedy w użyciu? Początek zdania do wykorzystania: „Pamiętam dzień, w którym…”.]

[UZUPEŁNIJ – co próbowałeś wcześniej, 2–3 zdania. Planery papierowe, aplikacje, poranne rutyny z YouTube? Co z tego zostało po dwóch tygodniach? Początek: „Wcześniej próbowałem…”.]

[UZUPEŁNIJ – moment zwrotny, 2–4 zdania. Kiedy i dlaczego zacząłeś budować własny system w Notion? Jak wyglądała pierwsza wersja? Który element okazał się najważniejszy: widok z trzema rzeczami na dziś, Inbox, tabelka nawyków, finanse? Początek: „W końcu usiadłem i…”.]

[UZUPEŁNIJ – co się zmieniło, 2–3 zdania. Tylko to, co naprawdę zauważyłeś, bez liczb, których nie mierzyłeś. Możesz też uczciwie napisać, co wciąż nie działa idealnie. Początek: „Dziś…”.]

Najciekawsze przyszło później, kiedy zacząłem czytać badania. Okazało się, że ludzie, których nazywamy zdyscyplinowanymi, wcale nie wygrywają więcej bitew z pokusami. W badaniu zespołu Wilhelma Hofmanna osoby z wysoką samokontrolą zgłaszały **mniej** takich bitew (Hofmann i in., 2012). Częściej omijały pokusy, niż je pokonywały. Brian Galla i Angela Duckworth (2015) pokazali z kolei, że spora część ich przewagi bierze się z nawyków, czyli z ustawionych automatów, które działają bez negocjacji.

Dla mnie to była ulga. Skoro dyscyplina to w dużej mierze system, a nie cecha charakteru, to da się ją zbudować.

Dlatego Revion robi dwie rzeczy. Ebooki z Biblioteki Revion zbierają to, co ma dowody, i mówią wprost, co jest mitem. Life OS daje miejsce, w którym te nawyki żyją na co dzień. [UZUPEŁNIJ albo usuń: jedno zdanie, dlaczego udostępniasz to innym i dla kogo to robisz.]

Za dwa dni pokażę Ci, jak „Wieczorne 5 minut” z rozdziału 02 wygląda w Life OS. Na prawdziwych zrzutach ekranu, nie na wizualizacjach.

Kuba
[UZUPEŁNIJ albo usuń: jedno zdanie o sobie, np. czym zajmujesz się poza Revion. Podaj tylko to, co chcesz ujawnić publicznie.]

P.S. Masz własną historię z dyscypliną, która „nie działa”? Odpisz. Nie wykorzystam jej nigdzie bez Twojej zgody.

**CTA:** brak przycisku. Celem maila jest odpowiedź (reply) i zaufanie. Jeśli chcesz link, dodaj w P.S.: „Ebook masz tutaj” → [LINK: PDF ebooka – https://revion.pl/wp-content/uploads/2026/10/Nawyki-Zelaznej-Dyscypliny-Revion.pdf]

---

## Mail 4 · dzień 6 · Wieczorne 5 minut i Life OS od środka

**Opóźnienie:** 2 dni po mailu 3.
**Warunek:** nie jest klientem (szczegóły w instrukcji, sekcja 7A).

**Temat A:** 5 minut wieczorem, które oszczędzają poranek
**Temat B:** Wieczorem Generał, rano Żołnierz

**Tekst podglądu:** Protokół z rozdziału 02 krok po kroku i to, jak wygląda w Life OS.

**Treść:**

Cześć,

w ebooku jest metafora, którą lubię najbardziej. Wieczorem jesteś Generałem: widzisz mapę i spokojnie decydujesz, gdzie uderzyć jutro. Rano jesteś Żołnierzem: znasz rozkaz i ruszasz. Gdy grasz obie role w tej samej minucie, przegrywają obie.

Tak wygląda protokół „Wieczorne 5 minut”:

1. **Zrzut (1 minuta).** Wypisz wszystko, co krąży Ci po głowie. Bez porządkowania.
2. **Wybór (1 minuta).** Zaznacz najwyżej trzy rzeczy na jutro. Pierwsza ma przybliżać Cię do celu, a nie gasić cudze pożary.
3. **Pierwszy krok (2 minuty).** Przy każdej dopisz fizyczną czynność na start i godzinę.
4. **Jeśli–to (30 sekund).** Jedna przeszkoda i Twoja odpowiedź, np. „Jeśli o 8:30 zadzwoni szef, to po rozmowie od razu wracam do pliku”.
5. **Zamknięcie (30 sekund).** Resztę przenieś na „parking” i zamknij notes.

Co na to badania? W niewielkim badaniu w laboratorium snu osoby, które przed snem przez 5 minut pisały listę zadań na jutro, zasypiały szybciej niż te, które wypisywały rzeczy już zrobione (Scullin i in., 2018). Z kolei zapisanie konkretnego planu wyciszało natrętne myśli o niedokończonym celu, choć sam cel wciąż czekał (Masicampo i Baumeister, 2011).

Wszystko to zrobisz w zeszycie. Naprawdę. Jeśli jednak wolisz mieć plan, nawyki i projekty w jednym miejscu, tak wygląda to w Revion Life OS:

- **Zrzut** robisz w Inboxie. Wrzucasz sprawę w kilka sekund i wracasz do swoich rzeczy.
- **Trzy priorytety** dostają numer 1, 2 i 3, a potem jutrzejszą datę. Rano otwierasz Główny Kokpit, a sekcja „Dziś” pokazuje tylko je.
- **Parking** to projekty i sprawy z datą na później. Nic nie znika, ale nic nie kusi z ekranu.
- **Nawyki** odhaczasz w codziennej tabelce w sekcji Cele i nawyki. Widać, ile dni z ostatniego tygodnia się udało.

[OBRAZ: zrzut Kokpitu – https://revion.pl/wp-content/uploads/2026/10/lifeos-kokpit.png – tekst alternatywny: „Główny Kokpit Revion Life OS z sekcją Dziś”]

[OBRAZ: zrzut śledzenia nawyków – https://revion.pl/wp-content/uploads/2026/10/lifeos-nawyki.png – tekst alternatywny: „Codzienna tabelka nawyków w Revion Life OS”]

To prawdziwe zrzuty z szablonu. Więcej zobaczysz na stronie:

**Przycisk:** „Zobacz Life OS od środka” → [LINK: strona, sekcja zrzutów – https://revion.pl/#od-srodka]

Kuba

P.S. Wieczór bez sił nawet na pięć minut? Zrób wersję awaryjną: tylko priorytet główny i jego pierwszy krok. 30 sekund, czyli dokładnie to zadanie z pierwszego maila.

**CTA:** Zobacz Life OS od środka → [LINK: https://revion.pl/#od-srodka]

---

## Mail 5 · dzień 8 · szczere odpowiedzi na obiekcje

**Opóźnienie:** 2 dni po mailu 4.
**Warunek:** nie jest klientem.

**Temat A:** „Nie znam Notion” i inne dobre powody, żeby odpuścić
**Temat B:** 6 pytań o Life OS i szczere odpowiedzi

**Tekst podglądu:** Także o tym, kiedy Life OS nie ma dla Ciebie sensu.

**Treść:**

Cześć,

zanim cokolwiek kupisz, należą Ci się konkretne odpowiedzi. Oto pytania, które sam zadałbym przed zakupem.

**„Nie znam Notion. Dam radę?”**
Notion to aplikacja, która łączy notatnik, arkusz i kalendarz. Life OS jest już zbudowany: bazy, widoki i połączenia są gotowe. Na co dzień dopisujesz zadania i je odhaczasz. Pierwsze uruchomienie zajmuje kilka minut, a gdy utkniesz, piszesz do mnie.

**„Czy muszę płacić za Notion?”**
Nie. Life OS działa na darmowym planie Notion. Wystarczy bezpłatne konto.

**„Próbowałem już planerów i aplikacji. Po dwóch tygodniach wszystko leżało.”**
Zwykle nie chodzi o charakter, tylko o to, że system był za duży albo rozrzucony po kilku miejscach. Life OS nie jest magiczny. Daje jedno miejsce i sekcję „Dziś” z trzema priorytetami, żeby dnia nie zaczynać od przeglądania wszystkiego. Najlepiej działa z nawykami z ebooka: wieczorny plan i jedna zmiana naraz.

**„Czy to działa na telefonie?”**
Tak. Notion ma aplikacje na iOS i Androida. Zadanie dodane w tramwaju czeka na Ciebie przy biurku.

**„To abonament?”**
Nie. Płacisz raz i masz stały dostęp, razem z przyszłymi aktualizacjami szablonu.

**„A jeśli mi nie podejdzie?”**
Masz 14 dni od zakupu na zwrot całej kwoty. Piszesz na kontakt@revion.pl z adresu użytego przy zakupie. Bez tłumaczenia się.

I jeszcze jedno, równie ważne. **Odpuść Life OS, jeśli:**

- szukasz narzędzia, które zrobi pracę za Ciebie (system organizuje pracę, ale jej nie wykonuje),
- kochasz kartkę i długopis i nie chcesz żadnej aplikacji – wtedy ebook i zeszyt w zupełności wystarczą,
- nie masz kwadransa, żeby poznać nowe miejsce pracy.

**Przycisk:** „Sprawdź, co jest w Life OS” → [LINK: strona, sekcja oferty – https://revion.pl/#oferta]

Masz pytanie, którego tu nie ma? Odpisz na tego maila. Odpowiem osobiście, zwykle w ciągu 24 godzin w dni robocze.

Kuba

**CTA:** Sprawdź, co jest w Life OS → [LINK: https://revion.pl/#oferta]

---

## Mail 6 · dzień 10 · oferta: Life OS 29 zł albo Pakiet Pro 69 zł

**Opóźnienie:** 2 dni po mailu 5.
**Warunek:** nie jest klientem.

**Temat A:** Life OS czy Pakiet Pro? Krótkie porównanie
**Temat B:** Dwa pakiety, jedna płatność, 14 dni na zwrot

**Tekst podglądu:** Bez licznika i bez „ceny tylko dziś”. Po prostu konkretna oferta.

**Treść:**

Cześć,

przez ostatnie 10 dni pisałem o poranku, o wieczornym planie i o tym, że dyscyplina to system. Dziś konkretnie: jeśli chcesz mieć ten system w jednym miejscu, masz do wyboru dwa pakiety.

**Life OS – 29 zł**

- szablon Revion Life OS w Notion: Kokpit „Dziś”, Inbox, Projekty, Cele i nawyki, Finanse i budżet, Biblioteka wiedzy,
- ebook „Nawyki Żelaznej Dyscypliny” w prezencie (ten sam, który już masz, więc nie płacisz za niego drugi raz),
- przyszłe aktualizacje szablonu,
- pomoc mailowa przy wdrożeniu.

**Przycisk:** „Kupuję Life OS · 29 zł” → [LINK: https://buy.stripe.com/4gM5kE8JT3xX26e8Vx8N20e]

**Pakiet Pro – 69 zł**

Wszystko z Life OS, a do tego:

- ebook „Skupienie Absolutne” (ok. 100 stron): protokoły głębokiej pracy, czyli środowisko bez rozproszeń, biologia skupienia, rytuały wejścia i wyjścia, tydzień zaplanowany pod skupienie i plan na 30 dni,
- 50 ikon do Notion w dwóch wariantach: „neon” (przezroczyste tło) i „kafel” (ciemny kafelek). Glify pochodzą z otwartej biblioteki Lucide, a ikony są dopasowane do stylu Revion,
- przyszłe aktualizacje szablonu i ebooków.

**Przycisk:** „Kupuję Pakiet Pro · 69 zł” → [LINK: https://buy.stripe.com/14AeVegclecB4em1t58N20f]

**Który wybrać?**
Life OS, jeśli chcesz przede wszystkim ogarnąć zadania, nawyki i finanse. Pakiet Pro, jeśli Twoja praca wymaga dłuższego skupienia (nauka, pisanie, projekty dla klientów) i chcesz wiedzieć, jak chronić te godziny przed rozproszeniami.

**Co się dzieje po zakupie?**
Płacisz przez Stripe: kartą, BLIK-iem, Google Pay albo Apple Pay. Zaraz potem widzisz stronę z dostępem, a na maila przychodzi potwierdzenie z tymi samymi linkami. Otwierasz Life OS, klikasz „Duplicate” i szablon ląduje na Twoim koncie Notion.

**14 dni na zwrot**
Jeśli Life OS nie sprawdzi się u Ciebie, napisz na kontakt@revion.pl w ciągu 14 dni od zakupu. Oddam całą kwotę, bez tłumaczenia się. Szczegóły są w regulaminie.

Nie ma tu licznika ani ceny „tylko dziś”. Kup, kiedy będzie Ci pasować, albo wcale. Następny mail i tak będzie o czymś przydatnym.

Kuba

P.S. Pytanie przed zakupem? Odpisz na tego maila. Odpowiadam w ciągu 24 godzin w dni robocze.

**CTA główne:** Kupuję Life OS · 29 zł → [LINK: https://buy.stripe.com/4gM5kE8JT3xX26e8Vx8N20e]
**CTA drugie:** Kupuję Pakiet Pro · 69 zł → [LINK: https://buy.stripe.com/14AeVegclecB4em1t58N20f]

> Uwaga techniczna: metody płatności w tekście (karta, BLIK, Google Pay, Apple Pay) muszą być włączone w Stripe. Jeśli któraś nie jest, usuń ją z maila i ze strony.

---

## Mail 7 · dzień 13 · technika 3–2–1 i miękkie zaproszenie

**Opóźnienie:** 3 dni po mailu 6.
**Warunek:** nie jest klientem.

**Temat A:** Co zrobić, gdy wewnętrzny negocjator ma argumenty
**Temat B:** 3, 2, 1 i ruch, zanim zaczniesz dyskutować

**Tekst podglądu:** Ostatni mail z tej serii: technika na moment wahania i co dalej.

**Treść:**

Cześć,

budzik dzwoni o 6:50. Plan był jasny: krótki trening przed pracą. A w głowie zaczyna się rozprawa: „Zimno. Ciemno. Wieczorem będziesz mieć więcej siły”.

To wewnętrzny negocjator. Każdy jego argument brzmi rozsądnie i zawsze ma w zanadrzu kolejny. Dyskusji z nim nie wygrasz. Możesz za to w niej nie uczestniczyć.

Najpierw ważna rzecz: odkładanie to rzadko lenistwo. Badacze opisują prokrastynację jako ucieczkę od nieprzyjemnego nastroju: nudy, niepewności, lęku przed oceną (Sirois i Pychyl, 2013). Dlatego argument „to ważne dla mojej przyszłości” tak często przegrywa. Walczysz rozumem z emocją, i to w chwili, gdy emocja jest najsilniejsza: tuż przed startem.

Co z tym zrobić? Protokół **3–2–1 Start**:

1. **Zauważ wahanie:** „za chwilę”, „jeszcze tylko…”, ręka sięgająca po telefon.
2. **Nazwij jeden fizyczny ruch** na kilka sekund: „stopy na podłogę”, „otwieram plik”.
3. **Policz w myślach 3–2–1** i na „1” wykonaj ruch, nawet niezgrabnie.
4. **Daj sobie 2 minuty.** Potem wolno Ci przerwać.

Uczciwie: to technika pokrewna „5 Second Rule” Mel Robbins i nie znamy badań, które testowałyby samo odliczanie. Działa raczej dlatego, że jest planem „jeśli–to” (jeśli się waham, to liczę i ruszam), a takie plany mają solidne wsparcie w badaniach. Do tego zmniejsza zadanie do jednego ruchu i skraca czas na negocjacje.

I zasada na gorsze dni: **nigdy nie opuszczaj dwa razy z rzędu.** Jeden opuszczony dzień to wypadek. W znanym badaniu zespołu Phillippy Lally nawyk stawał się automatyczny typowo po około 66 dniach, przy ogromnych różnicach między ludźmi: od 18 do 254 dni. Pojedyncze opuszczenie nie przekreślało postępów (Lally i in., 2010). Te 21 dni to więc mit, a jeden słabszy dzień niczego nie niszczy.

To ostatni mail z tej serii. Od teraz będę pisać rzadziej, mniej więcej [UZUPEŁNIJ: raz w tygodniu / raz na dwa tygodnie]: jedna technika, jedno badanie, zero waty. Jeśli to nie dla Ciebie, link do wypisu jest w stopce. Bez urazy.

A jeśli kiedyś zechcesz mieć wieczorny plan, trzy priorytety i tracker nawyków w jednym miejscu, Life OS jest tutaj. Bez pośpiechu.

**Przycisk:** „Zobacz Revion Life OS” → [LINK: strona, sekcja oferty – https://revion.pl/#oferta]

Dzięki za te dwa tygodnie.

Kuba

P.S. Zrób dziś „Listę pierwszych ruchów” z rozdziału 03: wypisz 5 rzeczy, które odkładasz najczęściej, i przy każdej zapisz ruch na 10 sekund oraz wersję 2-minutową. Gdy negocjator znów się odezwie, nie wymyślasz ruchu, tylko odczytujesz go z listy.

**CTA:** Zobacz Revion Life OS → [LINK: https://revion.pl/#oferta]

---

## Po serii

- Subskrybent zostaje w grupie *Darmowy ebook* i dostaje zwykły newsletter. Kampanie wysyłaj **tylko** do tej grupy (oraz do klientów z polem `zgoda_marketing = tak`), nigdy do „wszystkich subskrybentów”. Szczegóły w instrukcji, sekcja 5.
- Po 4–6 tygodniach porównaj warianty tematów. Patrz na **kliknięcia**, nie na otwarcia, bo otwarcia są zawyżane przez ochronę prywatności w Apple Mail. Przy małej liście (poniżej kilkuset osób na wariant) traktuj wyniki jako wskazówkę, nie dowód.
- Odpowiedzi na mail 1 („z czym masz największy kłopot”) zapisuj w arkuszu. To najlepsze źródło tematów na newsletter i słów, których używają Twoi czytelnicy.
