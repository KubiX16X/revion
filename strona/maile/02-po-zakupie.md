# Sekwencja 02: po zakupie

Ten plik zawiera:

- **(a) Potwierdzenia zamówienia na trwałym nośniku:** A1 Life OS, A2 Pakiet Pro, A3 dokupione „Skupienie Absolutne” (29 zł).
- **(b) Onboarding:** dzień 1, dzień 3, dzień 7 (dwie wersje: ze zgodą marketingową i bez niej), dzień 10 (tylko kupujący Life OS).
- **(c) Plan awaryjny:** co zrobić, gdy potwierdzenie nie wyszło automatycznie.

Konfiguracja automatyzacji: `00-instrukcja-mailerlite.md`, sekcje 7B i 7C.

## Dlaczego potwierdzenie jest takie długie

Prawo odstąpienia od umowy przy treściach cyfrowych wygasa tylko wtedy, gdy spełnione są **łącznie** trzy warunki (art. 38 ust. 1 pkt 13 ustawy o prawach konsumenta):

1. klient wyraźnie zgodził się na dostarczenie treści przed upływem 14 dni,
2. został poinformowany, że traci prawo odstąpienia, i przyjął to do wiadomości,
3. sprzedawca przesłał mu **potwierdzenie na trwałym nośniku**, obejmujące także tę zgodę.

Punkty 1 i 2 załatwia pole wyboru w Stripe. Punkt 3 to właśnie ten e-mail. Strona WWW nie jest trwałym nośnikiem, a MailerLite nie pozwala dołączać załączników. Dlatego najważniejsze informacje o umowie są **w treści maila**, a regulamin w PDF jest dodatkowo podlinkowany. Bez tego maila klient zachowuje 14 dni na odstąpienie z pełnym zwrotem, a gdy brakuje informacji o prawie odstąpienia, termin wydłuża się nawet o 12 miesięcy (źródło: `strona/dokumenty/research-prawo.json`, punkt 5).

## Tekst zgody: musi być identyczny w Stripe i w mailu

W każdym linku płatności Stripe włącz „Require customers to accept your terms of service” i ustaw własny tekst przy polu (Payment link → Options → custom text dla akceptacji regulaminu). Treść:

> Akceptuję [Regulamin](https://revion.pl/regulamin/). Wyrażam zgodę na dostarczenie treści cyfrowych (szablon Notion i pliki PDF/ZIP) od razu po płatności, przed upływem 14 dni na odstąpienie od umowy, i przyjmuję do wiadomości, że po ich dostarczeniu tracę ustawowe prawo odstąpienia od umowy. Niezależnie od tego mam 14 dni od zakupu na zwrot całej kwoty w ramach dobrowolnej gwarancji (§ 9 Regulaminu).

To ten sam tekst co w `dokumenty/teksty-zgod.md` (A1) i w § 8 ust. 3 regulaminu. W mailu jest cytowany słowo w słowo (bez linku w nawiasie kwadratowym). Jeśli zmienisz go w Stripe, zmień go też we wszystkich trzech potwierdzeniach. Jeśli nowy regulamin zaproponuje inne brzmienie, ujednolić trzeba wszystkie trzy miejsca: Stripe, regulamin i maile.

## Pola używane w mailach

Make zapisuje je przy subskrybencie w chwili zakupu (instrukcja, sekcja 9):

| Znacznik w mailu | Co zawiera | Przykład |
|---|---|---|
| `{$data_zakupu}` | data i godzina płatności (czas polski) | 12.10.2026, 19:42 |
| `{$nr_zamowienia}` | identyfikator płatności Stripe | pi_3Q… |
| `{$gwarancja_do}` | ostatni dzień gwarancji (data zakupu + 14 dni) | 26.10.2026 |

Sprawdź w edytorze MailerLite (przycisk personalizacji), jak dokładnie wygląda znacznik każdego pola. Jeśli inaczej niż w tabeli, popraw w mailach. W mailu testowym nie może zostać ani jeden „surowy” znacznik.

## Kto co dostaje

| Mail | Life OS | Pakiet Pro | Dokupione Skupienie | Warunek |
|---|---|---|---|---|
| A1 potwierdzenie Life OS | tak | – | – | natychmiast |
| A2 potwierdzenie Pakiet Pro | – | tak | – | natychmiast |
| A3 potwierdzenie Skupienie | – | – | tak | natychmiast |
| B1 dzień 1 | tak | tak (z akapitem o ikonach) | – | wszyscy kupujący |
| B2 dzień 3 | tak | tak | – | wszyscy kupujący |
| B3 dzień 7: prośba o opinię | tak | tak | – | **tylko ze zgodą marketingową** |
| B3-bez-zgody dzień 7: czy wszystko działa | tak | tak | – | bez zgody marketingowej |
| B4 dzień 10: Skupienie za 29 zł | tak | – | – | zgoda marketingowa + nie ma jeszcze Skupienia ani Pakietu Pro |

**Dlaczego prośba o opinię i propozycja zakupu tylko za zgodą?** Mail z ofertą to informacja handlowa, a na jej wysłanie e-mailem potrzebna jest uprzednia zgoda (art. 398 Prawa komunikacji elektronicznej). Co do prośby o opinię stanowiska są rozbieżne: WSA w Warszawie (18.11.2022, II SA/Wa 715/22, wyrok nieprawomocny) uznał, że wysłanie jej bez zgody marketingowej było naruszeniem. Bezpieczniej wysyłać ją tylko osobom ze zgodą. Potwierdzenie (A1–A3) i maile z pomocą we wdrożeniu (B1, B2, B3-bez-zgody) dotyczą wykonania umowy i pomocy obiecanej w ofercie, więc idą do wszystkich. **Nie wstawiaj do nich żadnych ofert, rabatów ani próśb o opinię.**

„Zgoda marketingowa” = pole `zgoda_marketing` równe `tak` (wybór w formularzu Stripe) **albo** przynależność do grupy *Darmowy ebook* (zgoda z formularza zapisu).

---

# (a) Potwierdzenia zamówienia

## A1 · Potwierdzenie zamówienia: Life OS (29 zł)

**Opóźnienie:** natychmiast, pierwszy krok gałęzi „Life OS” w automatyzacji B.

**Temat:** Potwierdzenie zamówienia: Revion Life OS
**Tekst podglądu:** Twoje linki dostępu, dane zamówienia i informacje o umowie. Zachowaj ten e-mail.

**Treść:**

Cześć,

dziękuję za zakup. Płatność dotarła, a dostęp jest gotowy. **Zachowaj ten e-mail.** To potwierdzenie zamówienia i Twój stały dostęp do plików.

### Twój dostęp

**1. Revion Life OS (szablon Notion).** Otwórz link i kliknij „Duplicate” w prawym górnym rogu. Szablon skopiuje się na Twoje konto Notion (wystarczy darmowe).

**Przycisk:** „Otwórz Life OS w Notion” → [LINK: Life OS – wklej nowy link do szablonu w Notion, patrz strona/JAK-WDROZYC.md, krok 0]

**2. Ebook „Nawyki Żelaznej Dyscypliny” (PDF, ok. 70 stron), w prezencie.**

**Przycisk:** „Pobierz ebook (PDF)” → [LINK: PDF – https://revion.pl/wp-content/uploads/2026/10/Nawyki-Zelaznej-Dyscypliny-Revion.pdf]

Na start: po skopiowaniu szablonu otwórz Inbox i wrzuć do niego wszystko, co masz w głowie. Potem wybierz trzy priorytety na dziś. Jutro dostaniesz krótki mail „Pierwsze 10 minut w Life OS”.

### Twoje zamówienie

- **Produkt:** Revion Life OS, szablon Notion (6 modułów: Kokpit „Dziś”, Inbox, Projekty, Cele i nawyki, Finanse i budżet, Biblioteka wiedzy), ebook PDF „Nawyki Żelaznej Dyscypliny” w prezencie, przyszłe aktualizacje szablonu, pomoc mailowa przy wdrożeniu.
- **Cena:** 29,00 zł. Cena końcowa, płatność jednorazowa, bez abonamentu i bez dodatkowych opłat.
- **Data zakupu:** {$data_zakupu}
- **Numer płatności:** {$nr_zamowienia}
- **Płatność:** przez operatora płatności Stripe.
- **Dostarczenie:** linki w tym e-mailu i na stronie wyświetlonej po płatności.

### Sprzedawca

Jakub Sroczyński (Revion), ul. Lawendowa 21, 58-500 Jelenia Góra, działalność nierejestrowana. E-mail: kontakt@revion.pl. [UZUPEŁNIJ albo usuń: telefon, jeśli używasz go do kontaktu z klientami]

### Twoja zgoda i prawo odstąpienia od umowy

Przy płatności w formularzu Stripe zostało zaakceptowane oświadczenie:

> „Akceptuję Regulamin. Wyrażam zgodę na dostarczenie treści cyfrowych (szablon Notion i pliki PDF/ZIP) od razu po płatności, przed upływem 14 dni na odstąpienie od umowy, i przyjmuję do wiadomości, że po ich dostarczeniu tracę ustawowe prawo odstąpienia od umowy. Niezależnie od tego mam 14 dni od zakupu na zwrot całej kwoty w ramach dobrowolnej gwarancji (§ 9 Regulaminu).”

W polu „Prawo odstąpienia – potwierdzenie” wybrano: „Chcę dostęp od razu; wiem, że tracę prawo odstąpienia”. [UZUPEŁNIJ: usuń to zdanie, jeśli nie dodasz pola A2 z dokumenty/teksty-zgod.md]

Ten e-mail potwierdza tę zgodę i to oświadczenie na trwałym nośniku. Treść cyfrowa została dostarczona od razu po płatności. Dlatego zgodnie z art. 38 ust. 1 pkt 13 ustawy o prawach konsumenta ustawowe prawo odstąpienia od umowy nie przysługuje.

### Gwarancja zwrotu: 14 dni

Niezależnie od tego masz dobrowolną gwarancję. Do {$gwarancja_do} (14 dni od zakupu) możesz poprosić o zwrot całej kwoty bez podawania przyczyny. Wystarczy mail na kontakt@revion.pl z adresu użytego przy zakupie, np. „Proszę o zwrot, płatność {$nr_zamowienia}”. Pieniądze wrócą tą samą metodą płatności przez Stripe w ciągu 14 dni od otrzymania wiadomości. Po zwrocie umowa i licencja wygasają, więc prosimy, usuń kopię szablonu i pobrane pliki (§ 9 Regulaminu).

### Gdy coś nie działa (reklamacje)

Odpowiadam za zgodność treści cyfrowej z umową. Jeśli link nie działa, plik się nie otwiera albo coś nie zgadza się z opisem, napisz na kontakt@revion.pl. Najpierw doprowadzę treść do zgodności z umową, np. wyślę działający plik. Jeśli to się nie uda, możesz żądać obniżenia ceny albo odstąpić od umowy i otrzymać zwrot pieniędzy. Na reklamację odpowiem w ciągu 14 dni. Szczegóły, w tym terminy, są w regulaminie. W razie sporu możesz też skorzystać z pozasądowych sposobów jego rozwiązania, np. z pomocy miejskiego lub powiatowego rzecznika konsumentów.

### Co jest potrzebne

Konto w Notion (wystarczy darmowe), przeglądarka albo aplikacja Notion na komputer lub telefon oraz program do odczytu plików PDF.

### Licencja i aktualizacje

Kupujesz licencję na użytek własny. Prosimy, nie udostępniaj linków ani plików publicznie i nie odsprzedawaj ich. O nowych wersjach szablonu poinformuję Cię mailem.

### Dokumenty

- **Przycisk/link:** „Regulamin obowiązujący w dniu zakupu (PDF)” → [LINK: UZUPEŁNIJ – PDF regulaminu z datą wersji w nazwie, np. https://revion.pl/wp-content/uploads/2026/10/Regulamin-Revion-2026-10-XX.pdf]
- **Link:** „Polityka prywatności” → [LINK: https://revion.pl/polityka-prywatnosci/]

Potrzebujesz rachunku? Odpisz na tego maila.

Kuba
Revion

*Stopka: wersja „transakcyjna” z instrukcji, sekcja 4.*

---

## A2 · Potwierdzenie zamówienia: Pakiet Pro (69 zł)

**Opóźnienie:** natychmiast, pierwszy krok gałęzi „Pakiet Pro” w automatyzacji B.

**Temat:** Potwierdzenie zamówienia: Revion Pakiet Pro
**Tekst podglądu:** Life OS, dwa ebooki i 50 ikon: linki dostępu i informacje o umowie. Zachowaj ten e-mail.

**Treść:**

Cześć,

dziękuję za zakup. Płatność dotarła, a dostęp jest gotowy. **Zachowaj ten e-mail.** To potwierdzenie zamówienia i Twój stały dostęp do plików.

### Twój dostęp

**1. Revion Life OS (szablon Notion).** Otwórz link i kliknij „Duplicate” w prawym górnym rogu. Szablon skopiuje się na Twoje konto Notion (wystarczy darmowe).

**Przycisk:** „Otwórz Life OS w Notion” → [LINK: Life OS – wklej nowy link do szablonu w Notion, patrz strona/JAK-WDROZYC.md, krok 0]

**2. Ebook „Nawyki Żelaznej Dyscypliny” (PDF, ok. 70 stron).**

**Przycisk:** „Pobierz ebook (PDF)” → [LINK: PDF – https://revion.pl/wp-content/uploads/2026/10/Nawyki-Zelaznej-Dyscypliny-Revion.pdf]

**3. Ebook „Skupienie Absolutne” (PDF, ok. 100 stron).**

**Przycisk:** „Pobierz ebook (PDF)” → [LINK: PDF Skupienie Absolutne – adres pliku z JAK-WDROZYC.md, krok 1.3]

**4. 50 ikon do Notion (paczka ZIP).** W środku dwa warianty: „neon” (przezroczyste tło, pasuje do jasnego i ciemnego motywu) i „kafel” (ciemny kafelek, najlepszy w ciemnym motywie), instrukcja i licencja.

**Przycisk:** „Pobierz ikony (ZIP)” → [LINK: ZIP ikon – adres pliku z JAK-WDROZYC.md, krok 1.3]

Na start: po skopiowaniu szablonu otwórz Inbox i wrzuć do niego wszystko, co masz w głowie. Potem wybierz trzy priorytety na dziś. Jutro dostaniesz krótki mail „Pierwsze 10 minut w Life OS”.

### Twoje zamówienie

- **Produkt:** Revion Pakiet Pro: szablon Notion Revion Life OS (6 modułów: Kokpit „Dziś”, Inbox, Projekty, Cele i nawyki, Finanse i budżet, Biblioteka wiedzy), ebook PDF „Nawyki Żelaznej Dyscypliny”, ebook PDF „Skupienie Absolutne”, 50 ikon do Notion w dwóch wariantach (PNG w paczce ZIP), przyszłe aktualizacje szablonu i ebooków, pomoc mailowa przy wdrożeniu.
- **Cena:** 69,00 zł. Cena końcowa, płatność jednorazowa, bez abonamentu i bez dodatkowych opłat.
- **Data zakupu:** {$data_zakupu}
- **Numer płatności:** {$nr_zamowienia}
- **Płatność:** przez operatora płatności Stripe.
- **Dostarczenie:** linki w tym e-mailu i na stronie wyświetlonej po płatności.

### Sprzedawca

Jakub Sroczyński (Revion), ul. Lawendowa 21, 58-500 Jelenia Góra, działalność nierejestrowana. E-mail: kontakt@revion.pl. [UZUPEŁNIJ albo usuń: telefon]

### Twoja zgoda i prawo odstąpienia od umowy

Przy płatności w formularzu Stripe zostało zaakceptowane oświadczenie:

> „Akceptuję Regulamin. Wyrażam zgodę na dostarczenie treści cyfrowych (szablon Notion i pliki PDF/ZIP) od razu po płatności, przed upływem 14 dni na odstąpienie od umowy, i przyjmuję do wiadomości, że po ich dostarczeniu tracę ustawowe prawo odstąpienia od umowy. Niezależnie od tego mam 14 dni od zakupu na zwrot całej kwoty w ramach dobrowolnej gwarancji (§ 9 Regulaminu).”

W polu „Prawo odstąpienia – potwierdzenie” wybrano: „Chcę dostęp od razu; wiem, że tracę prawo odstąpienia”. [UZUPEŁNIJ: usuń to zdanie, jeśli nie dodasz pola A2 z dokumenty/teksty-zgod.md]

Ten e-mail potwierdza tę zgodę i to oświadczenie na trwałym nośniku. Treść cyfrowa została dostarczona od razu po płatności. Dlatego zgodnie z art. 38 ust. 1 pkt 13 ustawy o prawach konsumenta ustawowe prawo odstąpienia od umowy nie przysługuje.

### Gwarancja zwrotu: 14 dni

Niezależnie od tego masz dobrowolną gwarancję. Do {$gwarancja_do} (14 dni od zakupu) możesz poprosić o zwrot całej kwoty bez podawania przyczyny. Wystarczy mail na kontakt@revion.pl z adresu użytego przy zakupie, np. „Proszę o zwrot, płatność {$nr_zamowienia}”. Pieniądze wrócą tą samą metodą płatności przez Stripe w ciągu 14 dni od otrzymania wiadomości. Po zwrocie umowa i licencja wygasają, więc prosimy, usuń kopię szablonu i pobrane pliki (§ 9 Regulaminu).

### Gdy coś nie działa (reklamacje)

Odpowiadam za zgodność treści cyfrowej z umową. Jeśli link nie działa, plik się nie otwiera albo coś nie zgadza się z opisem, napisz na kontakt@revion.pl. Najpierw doprowadzę treść do zgodności z umową, np. wyślę działający plik. Jeśli to się nie uda, możesz żądać obniżenia ceny albo odstąpić od umowy i otrzymać zwrot pieniędzy. Na reklamację odpowiem w ciągu 14 dni. Szczegóły, w tym terminy, są w regulaminie. W razie sporu możesz też skorzystać z pozasądowych sposobów jego rozwiązania, np. z pomocy miejskiego lub powiatowego rzecznika konsumentów.

### Co jest potrzebne

Konto w Notion (wystarczy darmowe), przeglądarka albo aplikacja Notion na komputer lub telefon, program do odczytu plików PDF i możliwość rozpakowania pliku ZIP.

### Licencja i aktualizacje

Kupujesz licencję na użytek własny. Prosimy, nie udostępniaj linków ani plików publicznie i nie odsprzedawaj ich. Glify ikon pochodzą z otwartej biblioteki Lucide (licencja ISC, jej treść jest w paczce). O nowych wersjach szablonu i ebooków poinformuję Cię mailem.

### Dokumenty

- **Przycisk/link:** „Regulamin obowiązujący w dniu zakupu (PDF)” → [LINK: UZUPEŁNIJ – PDF regulaminu z datą wersji]
- **Link:** „Polityka prywatności” → [LINK: https://revion.pl/polityka-prywatnosci/]

Potrzebujesz rachunku? Odpisz na tego maila.

Kuba
Revion

*Stopka: wersja „transakcyjna”.*

---

## A3 · Potwierdzenie zamówienia: „Skupienie Absolutne” dokupione do Life OS (29 zł)

**Nie włączaj tego maila ani linku 29 zł / 40 zł, dopóki regulamin (§ 2 pkt 7, § 3, § 9 ust. 7), `konfiguracja.json` i `dokumenty/teksty-zgod.md` nie obejmują tej oferty. Dziś regulamin zna tylko Life OS i Pakiet Pro.**

Ten mail jest potrzebny, bo propozycja z dnia 10 (B4) to osobna umowa, więc także ona wymaga potwierdzenia na trwałym nośniku. Wysyła go automatyzacja C po dołączeniu do grupy *Klienci Skupienie (dokupka)*. W Stripe ten link płatności też musi mieć pole akceptacji regulaminu z tym samym tekstem zgody.

**Opóźnienie:** natychmiast, jedyny krok automatyzacji C.

**Temat:** Potwierdzenie zamówienia: ebook „Skupienie Absolutne”
**Tekst podglądu:** Link do PDF, dane zamówienia i informacje o umowie. Zachowaj ten e-mail.

**Treść:**

Cześć,

dziękuję za zakup. Płatność dotarła, a ebook jest gotowy do pobrania. **Zachowaj ten e-mail.** To potwierdzenie zamówienia i Twój stały dostęp do pliku.

### Twój dostęp

**Ebook „Skupienie Absolutne” (PDF, ok. 100 stron).**

**Przycisk:** „Pobierz ebook (PDF)” → [LINK: PDF Skupienie Absolutne – adres pliku z JAK-WDROZYC.md, krok 1.3]

Na start: przeczytaj wstęp i rozdział 01. Ćwiczenie z rozdziału 01 zrobisz w jeden zwykły dzień pracy.

### Twoje zamówienie

- **Produkt:** ebook PDF „Skupienie Absolutne” (Biblioteka Revion · 02, ok. 100 stron), przyszłe aktualizacje ebooka.
- **Cena:** 29,00 zł. Cena końcowa, płatność jednorazowa.
- **Data zakupu:** {$data_zakupu}
- **Numer płatności:** {$nr_zamowienia}
- **Płatność:** przez operatora płatności Stripe.
- **Dostarczenie:** link w tym e-mailu i na stronie wyświetlonej po płatności.

### Sprzedawca

Jakub Sroczyński (Revion), ul. Lawendowa 21, 58-500 Jelenia Góra, działalność nierejestrowana. E-mail: kontakt@revion.pl. [UZUPEŁNIJ albo usuń: telefon]

### Twoja zgoda i prawo odstąpienia od umowy

Przy płatności w formularzu Stripe zostało zaakceptowane oświadczenie:

> „Akceptuję Regulamin. Wyrażam zgodę na dostarczenie treści cyfrowych (szablon Notion i pliki PDF/ZIP) od razu po płatności, przed upływem 14 dni na odstąpienie od umowy, i przyjmuję do wiadomości, że po ich dostarczeniu tracę ustawowe prawo odstąpienia od umowy. Niezależnie od tego mam 14 dni od zakupu na zwrot całej kwoty w ramach dobrowolnej gwarancji (§ 9 Regulaminu).”

W polu „Prawo odstąpienia – potwierdzenie” wybrano: „Chcę dostęp od razu; wiem, że tracę prawo odstąpienia”. [UZUPEŁNIJ: usuń to zdanie, jeśli nie dodasz pola A2 z dokumenty/teksty-zgod.md]

Ten e-mail potwierdza tę zgodę i to oświadczenie na trwałym nośniku. Treść cyfrowa została dostarczona od razu po płatności. Dlatego zgodnie z art. 38 ust. 1 pkt 13 ustawy o prawach konsumenta ustawowe prawo odstąpienia od umowy nie przysługuje.

### Gwarancja zwrotu: 14 dni

Niezależnie od tego do {$gwarancja_do} (14 dni od zakupu) możesz poprosić o zwrot całych 29 zł bez podawania przyczyny. Wystarczy mail na kontakt@revion.pl z adresu użytego przy zakupie. Pieniądze wrócą tą samą metodą płatności przez Stripe w ciągu 14 dni od otrzymania wiadomości. Po zwrocie umowa i licencja wygasają, więc prosimy, usuń pobrany plik.

### Gdy coś nie działa (reklamacje)

Jeśli plik się nie otwiera albo coś nie zgadza się z opisem, napisz na kontakt@revion.pl. Najpierw doprowadzę treść do zgodności z umową. Jeśli to się nie uda, możesz żądać obniżenia ceny albo odstąpić od umowy i otrzymać zwrot pieniędzy. Na reklamację odpowiem w ciągu 14 dni. Szczegóły są w regulaminie. W razie sporu możesz też skorzystać z pomocy miejskiego lub powiatowego rzecznika konsumentów.

### Co jest potrzebne i licencja

Program do odczytu plików PDF. Licencja na użytek własny: prosimy, nie udostępniaj pliku publicznie i nie odsprzedawaj go.

### Dokumenty

- **Przycisk/link:** „Regulamin obowiązujący w dniu zakupu (PDF)” → [LINK: UZUPEŁNIJ – PDF regulaminu z datą wersji]
- **Link:** „Polityka prywatności” → [LINK: https://revion.pl/polityka-prywatnosci/]

Kuba
Revion

*Stopka: wersja „transakcyjna”.*

---

# (b) Onboarding

Wszystkie maile onboardingowe idą z automatyzacji B, w obu gałęziach (Life OS i Pakiet Pro). Gdy treść się różni, oznaczono to w tekście.

> **Sprawdź w szablonie przed włączeniem:** nazwy „Kokpit”, „widok Dziś”, „Inbox”, „Cele i nawyki”, „Projekty” pochodzą ze strony i z ebooka. Jeśli w Life OS sekcje nazywają się inaczej, popraw maile B1 i B2, żeby klient klikał dokładnie w to, co widzi.

## B1 · Dzień 1 · Pierwsze 10 minut w Life OS

**Opóźnienie:** 1 dzień po potwierdzeniu (A1 lub A2).

**Temat A:** Pierwsze 10 minut w Life OS
**Temat B:** Od pustego szablonu do planu na jutro w 10 minut

**Tekst podglądu:** Pięć kroków i minutnik. Bez czytania instrukcji na 20 stron.

**Treść:**

Cześć,

od wczoraj masz Life OS. Dziś pięć kroków na 10 minut. Ustaw minutnik i zaczynamy.

**1. Skopiuj szablon (1 minuta).** Jeśli Life OS jest jeszcze tylko linkiem w mailu, otwórz go, kliknij „Duplicate” w prawym górnym rogu i wybierz swoje konto Notion.

**2. Przypnij Kokpit (1 minuta).** Otwórz Kokpit i dodaj go do ulubionych: menu „•••” w prawym górnym rogu → „Add to Favorites”. Na telefonie zainstaluj aplikację Notion i zaloguj się tym samym kontem. Kokpit będzie na wierzchu.

**3. Zrzut do Inboxu (3 minuty).** Wpisz do Inboxu wszystko, co nosisz w głowie: zadania, sprawy, pomysły. Jedna rzecz to jeden wpis. Bez porządkowania.

**4. Trzy priorytety (3 minuty).** Z Inboxu wybierz najwyżej trzy rzeczy na dziś. Najpierw nadaj im priorytet 1, 2 i 3, potem dzisiejszą datę. Przy każdej wpisz w „Notatce powrotu” pierwszy fizyczny krok, np. „otwórz plik i napisz trzy zdania”. Od teraz zakładka „3 priorytety” w sekcji „Dziś” na Głównym Kokpicie pokazuje tylko je.

**5. Nawyki (2 minuty).** W codziennej tabelce na stronie Cele i nawyki wybierz na start 2–3 nawyki. Dobry kandydat: „Telefon poza sypialnią” z rozdziału 01 ebooka. Pozostałe kolumny zmień na swoje albo usuń według rozwijanego bloku „Jak zmienić nawyki na swoje” pod tabelką.

Finanse, Projekty i Biblioteka wiedzy mogą poczekać do przyszłego tygodnia. Najpierw niech zadziała codzienny rytm: Inbox, „Dziś”, odhaczanie.

**[Tylko w gałęzi Pakiet Pro – wstaw ten akapit przed przyciskiem:]**
**Bonus dla Pakietu Pro: ikony.** Najedź na tytuł strony i kliknij „Add icon” (albo obecną ikonę) → zakładka „Upload” → wybierz plik PNG z paczki. Wariant „neon” pasuje do jasnego i ciemnego motywu, „kafel” najlepiej wygląda w ciemnym. Zacznij od Kokpitu, Inboxu i Celów, bo te strony otwierasz najczęściej.

**Przycisk:** „Otwórz Life OS” → [LINK: Life OS – wklej nowy link do szablonu w Notion, patrz strona/JAK-WDROZYC.md, krok 0]

Coś nie działa albo nie wiesz, gdzie kliknąć? Odpisz na tego maila, najlepiej ze zrzutem ekranu. Odpowiadam w ciągu 24 godzin w dni robocze.

Kuba

**CTA:** Otwórz Life OS → [LINK: Life OS – adres jak wyżej]

---

## B2 · Dzień 3 · Wieczorne 5 minut

**Opóźnienie:** 2 dni po B1.

**Temat A:** Wieczorne 5 minut w Life OS
**Temat B:** Jutro rano nie pytaj siebie „od czego zacząć?”

**Tekst podglądu:** Protokół z rozdziału 02 przełożony na Inbox i sekcję „Dziś”.

**Treść:**

Cześć,

dziś jeden nawyk, dzięki któremu Life OS staje się codziennym narzędziem, a nie kolejną aplikacją w telefonie. To „Wieczorne 5 minut” z rozdziału 02 ebooka, w wersji dla Life OS:

1. **Zrzut (1 minuta) – Inbox.** Wrzuć wszystko, co krąży Ci po głowie.
2. **Wybór (1 minuta) – priorytet i jutrzejsza data.** Najwyżej trzy rzeczy dostają numer 1, 2 i 3, a potem datę na jutro. Pierwsza ma przybliżać Cię do celu.
3. **Pierwszy krok (2 minuty).** Przy każdej dopisz w kolumnie „Notatka powrotu” fizyczną czynność i godzinę startu. Zamiast „Klient z Gdańska”: „Wyślij maila z dwoma terminami rozmowy, 9:15”.
4. **Jeśli–to (30 sekund).** Jedna przeszkoda i Twoja odpowiedź, np. „Jeśli o 8:30 zadzwoni szef, to po rozmowie wracam do pliku”. Dopisz ją w „Notatce powrotu” priorytetu 1.
5. **Zamknięcie (30 sekund).** Reszta dostaje datę na później, trafia do projektu albo do kosza. Zamykasz Notion.

Rano otwierasz Główny Kokpit, a sekcja „Dziś” pokazuje trzy priorytety. Nic nie wybierasz, tylko czytasz i ruszasz. Plan zmieniasz wyłącznie wtedy, gdy wydarzy się coś nowego. „Nie chce mi się” nie jest nową informacją.

**Kiedy?** Najlepiej o stałej porze: po ostatnich zajęciach, przy zamykaniu laptopa, po wysłaniu ostatniego maila. Planujesz tuż przed snem? Rób to na kartce, żeby telefon został poza sypialnią, a rano przepisz trzy priorytety do Life OS. To zajmie minutę.

**Wieczór bez sił?** Wersja awaryjna: tylko priorytet 1 i jego pierwszy krok. 30 sekund.

**Przycisk:** „Otwórz Life OS” → [LINK: Life OS – wklej nowy link do szablonu w Notion, patrz strona/JAK-WDROZYC.md, krok 0]

Kuba

P.S. Dlaczego wieczorem, a nie rano? W niewielkim badaniu w laboratorium snu osoby, które przed snem przez 5 minut pisały listę zadań na jutro, zasypiały szybciej niż te, które wypisywały rzeczy już zrobione (Scullin i in., 2018). Więcej w rozdziale 02.

**CTA:** Otwórz Life OS → [LINK: Life OS]

---

## B3 · Dzień 7 · Prośba o szczerą opinię (TYLKO ze zgodą marketingową)

**Opóźnienie:** 4 dni po B2.
**Warunek:** `zgoda_marketing = tak` **lub** subskrybent jest w grupie *Darmowy ebook*. Pozostali dostają B3-bez-zgody.

**Temat A:** Jak Ci idzie z Life OS? Szczerze
**Temat B:** Tydzień z Life OS: co działa, a co nie?

**Tekst podglądu:** Trzy krótkie pytania. Krytyka też się przyda.

**Treść:**

Cześć,

minął tydzień od zakupu. Mam dwie sprawy.

**Po pierwsze: czy wszystko działa?** Jeśli coś się nie kopiuje, nie wyświetla albo jest niejasne, odpisz. To ważniejsze niż wszystko poniżej.

**Po drugie: prośba o szczerą opinię.** Odpowiedz na tego maila, wystarczy kilka zdań:

1. Z czym był największy kłopot przed Life OS?
2. Co po tygodniu działa najlepiej?
3. Co poprawić, dodać albo usunąć?

Krytyczne uwagi są tak samo cenne jak pochwały. Na ich podstawie poprawiam szablon, a aktualizacje dostajesz w cenie.

**Czy mogę opublikować Twoją opinię?** Tylko jeśli się zgodzisz. Jeśli tak, dopisz na końcu odpowiedzi zdanie:

> „Zgadzam się na publikację mojej opinii na revion.pl i w profilach Revion w mediach społecznościowych, z imieniem i pierwszą literą nazwiska.”

Jak to u mnie wygląda:

- publikuję wyłącznie opinie osób, które kupiły produkt, i każdą sprawdzam po numerze zamówienia,
- publikuję opinię w Twoich słowach; jeśli trzeba ją skrócić, najpierw wyślę Ci skróconą wersję do akceptacji,
- publikuję także opinie krytyczne,
- za opinię nie dostajesz rabatu ani prezentu, żeby nic nie wpływało na jej treść,
- zgodę możesz wycofać w każdej chwili mailem, a wtedy usunę opinię.

Nie chcesz publikacji? Też w porządku. Twoja odpowiedź i tak pomoże mi ulepszyć Life OS.

Dziękuję,
Kuba

**CTA:** odpowiedź na maila (bez przycisku).

> **Dla właściciela, zanim opublikujesz pierwszą opinię:**
> - Zapisuj w arkuszu: imię i inicjał, datę, cytat, numer płatności ze Stripe, datę zgody. Zachowaj cały mail z odpowiedzią.
> - Sprawdź numer zamówienia w Stripe (adres e-mail nadawcy = adres z płatności).
> - Pod opiniami na stronie dodaj notkę, która opisuje to, co **naprawdę** robisz, np.: „Publikujemy wyłącznie opinie osób, które kupiły Life OS. Każdą sprawdzamy po numerze zamówienia. Publikujemy wszystkie, także krytyczne”. Jeśli nie publikujesz wszystkich, nie pisz, że publikujesz.
> - Lista zasad w mailu (krytyczne też, bez zmian treści, bez nagród) jest obietnicą. Jeśli którejś nie chcesz przestrzegać, usuń ją z maila przed włączeniem automatyzacji.

---

## B3-bez-zgody · Dzień 7 · Czy wszystko działa (bez zgody marketingowej)

**Opóźnienie:** 4 dni po B2 (ta sama pozycja co B3, druga gałąź warunku).
**Warunek:** brak zgody marketingowej. Mail czysto serwisowy: bez prośby o opinię, bez ofert.

**Temat A:** Czy Life OS działa tak, jak trzeba?
**Temat B:** Tydzień z Life OS: potrzebujesz pomocy?

**Tekst podglądu:** Jeśli coś się nie kopiuje albo jest niejasne, odpisz.

**Treść:**

Cześć,

minął tydzień od zakupu, więc pytam krótko: czy wszystko działa?

Jeśli coś się nie kopiuje, nie wyświetla na telefonie albo nie wiesz, gdzie kliknąć, odpisz na tego maila, najlepiej ze zrzutem ekranu. Odpowiadam w ciągu 24 godzin w dni robocze.

Przypominam, gdzie są Twoje pliki:

**Przycisk:** „Otwórz Life OS” → [LINK: Life OS – wklej nowy link do szablonu w Notion, patrz strona/JAK-WDROZYC.md, krok 0]

Ebooki i pozostałe pliki znajdziesz w mailu z potwierdzeniem zamówienia.

Kuba

**CTA:** Otwórz Life OS → [LINK: Life OS]

---

## B4 · Dzień 10 · „Skupienie Absolutne” za 29 zł (tylko kupujący Life OS)

**Nie włączaj tego maila ani linku 29 zł / 40 zł, dopóki regulamin (§ 2 pkt 7, § 3, § 9 ust. 7), `konfiguracja.json` i `dokumenty/teksty-zgod.md` nie obejmują tej oferty. Dziś regulamin zna tylko Life OS i Pakiet Pro.**

**Opóźnienie:** 3 dni po B3.
**Warunek:** gałąź Life OS **i** zgoda marketingowa **i** subskrybent nie jest w grupach *Klienci Pakiet Pro* ani *Klienci Skupienie (dokupka)*. Kupujący Pakiet Pro tego maila nie dostają, bo ebook już mają.

**Temat A:** Masz plan na dzień. A skupienie?
**Temat B:** Ile kosztuje „szybkie zerknięcie” do skrzynki

**Tekst podglądu:** Resztki uwagi, telefon na biurku i ebook, który się tym zajmuje.

**Treść:**

Cześć,

masz już plan na dzień. Teraz kolejny problem, który zna chyba każdy: siadasz do priorytetu głównego, a po kwadransie łapiesz się na sprawdzaniu poczty.

Sophie Leroy (2009) opisała zjawisko, które nazwała resztkami uwagi. Gdy przełączasz się z jednego zadania na drugie, część uwagi zostaje przy poprzednim, zwłaszcza gdy nie zostało skończone. W jej badaniach osoby, które przeskakiwały do nowego zadania przed domknięciem poprzedniego, radziły sobie z nim gorzej. Każde „szybkie zerknięcie” do skrzynki zostawia taki ślad, a Ty wracasz do pracy tylko z częścią głowy.

**Jedna rzecz na jutro:** na czas pierwszego bloku pracy wycisz powiadomienia i odłóż telefon do innego pokoju. Łatwiej nie walczyć z pokusą, której nie masz pod ręką.

Tym tematem zajmuje się cały ebook „Skupienie Absolutne” (ok. 100 stron), druga część Biblioteki Revion:

- skąd biorą się rozproszenia i ile naprawdę kosztuje przełączanie się między zadaniami,
- ile godzin głębokiej pracy dziennie to realny cel,
- środowisko bez rozproszeń: telefon, komputer, hałas, muzyka,
- biologia skupienia: sen, kofeina, ruch i przerwy,
- rytuały wejścia w blok pracy i zamknięcia dnia,
- tydzień zaplanowany pod skupienie i plan na 30 dni.

Ten sam styl co „Nawyki Żelaznej Dyscypliny”: badania ze źródłami, uczciwie o tym, co jest mitem, i gotowe protokoły. Bloki pracy od razu zaplanujesz w widoku „Dziś” i w projektach Life OS.

Jako klient Life OS możesz dokupić ten ebook za 29 zł. Tu też działa 14-dniowa gwarancja zwrotu.

**Przycisk:** „Dokupuję Skupienie Absolutne · 29 zł” → [LINK: Stripe 29 zł – do utworzenia]

To jedyny mail z propozycją zakupu w tej serii. Jeśli nie teraz, nic się nie stanie.

Kuba

**CTA:** Dokupuję Skupienie Absolutne · 29 zł → [LINK: Stripe 29 zł – do utworzenia]

### Uwaga o cenie: rozważ wariant „dopłata do Pakietu Pro”

Przy obecnych cenach klient, który kupi Life OS (29 zł) i dokupi Skupienie (29 zł), zapłaci **58 zł**, czyli 11 zł mniej niż za Pakiet Pro (69 zł), ale bez ikon. Prostsza oferta to **dopłata różnicy do Pakietu Pro: 40 zł** (Skupienie i ikony, łącznie tyle samo co Pro od razu). Jeśli ją wybierzesz:

1. W Stripe utwórz link „Dopłata do Pakietu Pro” na 40 zł (z tym samym polem akceptacji regulaminu i tekstem zgody).
2. W Make dodaj tę trasę: grupa *Dopłata do Pro* (wyzwalacz automatyzacji C) oraz grupa *Klienci Pakiet Pro*.
3. W A3 zmień produkt na „Dopłata do Pakietu Pro: ebook PDF „Skupienie Absolutne” i 50 ikon do Notion (ZIP)”, cenę na 40,00 zł i dodaj link do ZIP z ikonami.
4. W B4 zamień trzy ostatnie akapity przed podpisem na:

> Masz Life OS za 29 zł. Pakiet Pro kosztuje 69 zł. Możesz dopłacić różnicę, **40 zł**, i dostać to, co mają kupujący Pakiet Pro: ebook „Skupienie Absolutne” i 50 ikon do Notion w dwóch wariantach. Łącznie zapłacisz tyle samo, ile przy zakupie Pakietu Pro od razu. Tu też działa 14-dniowa gwarancja zwrotu.
>
> **Przycisk:** „Dopłacam do Pakietu Pro · 40 zł” → [LINK: Stripe 40 zł – do utworzenia]
>
> To jedyny mail z propozycją zakupu w tej serii. Jeśli nie teraz, nic się nie stanie.

Temat B4 może zostać bez zmian.

---

# (c) Plan awaryjny: potwierdzenie nie wyszło

MailerLite **nie wyśle** potwierdzenia, gdy kupujący wcześniej wypisał się z Twojej listy, gdy jego adres odbija maile albo gdy wyczerpie się miesięczny limit maili. Wtedy nie ma potwierdzenia na trwałym nośniku, więc klient zachowuje prawo odstąpienia. Dlatego:

1. **Raz w tygodniu** porównaj listę płatności w Stripe (Payments) z grupami klientów w MailerLite. Każda płatność bez subskrybenta w grupie albo ze statusem „Unsubscribed”/„Bounced” wymaga ręcznej wysyłki.
2. **Ręczna wysyłka:** skopiuj właściwy mail (A1, A2 lub A3) do zwykłej poczty `kontakt@revion.pl`, wpisz ręcznie datę zakupu, numer płatności i datę końca gwarancji i wyślij z tematem jak w automatyzacji. Zachowaj wysłaną wiadomość.
3. **Kupujący, który już był klientem Life OS i kupuje Pakiet Pro** (rzadki przypadek): automatyzacja B nie wpuści go drugi raz, więc potwierdzenie A2 wyślij ręcznie.
4. **Dodatkowa siatka bezpieczeństwa:** w Stripe włącz automatyczne potwierdzenia płatności e-mailem (Settings → Customer emails → Successful payments). Nie zastąpią maila A1–A3, bo nie zawierają tekstu zgody, ale klient zawsze dostanie dowód płatności.
