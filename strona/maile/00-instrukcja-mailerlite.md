# Instrukcja: MailerLite, Stripe i Make krok po kroku

Ten plik opisuje, jak uruchomić maile z plików `01-darmowy-ebook.md`, `02-po-zakupie.md` i `03-obecni-klienci.md`. Zrób kroki po kolei. Nazwy przycisków podaję po angielsku, bo tak wyglądają panele MailerLite, Stripe i Make. Jeśli coś w panelu nazywa się trochę inaczej, szukaj najbliższego odpowiednika.

## 0. Jak to działa w skrócie

```
Zapis na darmowy ebook
  formularz na revion.pl albo strona zapisu MailerLite
  → mail z potwierdzeniem zapisu (double opt-in)
  → grupa „Darmowy ebook”
  → automatyzacja A: 7 maili w 13 dni (01-darmowy-ebook.md)

Zakup
  link płatności Stripe (pole akceptacji regulaminu + zgoda na natychmiastowe dostarczenie)
  → strona z dostępem po płatności (noindex)
  → Stripe wysyła zdarzenie „checkout.session.completed”
  → Make zapisuje kupującego w MailerLite: pola + grupa „Klienci Life OS” albo „Klienci Pakiet Pro”
  → automatyzacja B: potwierdzenie na trwałym nośniku + onboarding (02-po-zakupie.md)

Dokupienie „Skupienie Absolutne” (29 zł)
  → Make → grupa „Klienci Skupienie (dokupka)”
  → automatyzacja C: potwierdzenie A3
```

## 1. Kolejność prac (lista kontrolna)

- [ ] Skrzynka `kontakt@revion.pl` działa, a Ty regularnie ją czytasz (odpowiedzi na maile trafiają właśnie tam).
- [ ] Nowy regulamin jest opublikowany na revion.pl, a jego wersja w PDF (z datą w nazwie pliku) leży na serwerze. Regulamin opisuje gwarancję 14 dni i zawiera ten sam tekst zgody co Stripe (sekcja 8).
- [ ] Pliki są na miejscu i linki działają: Life OS, PDF „Nawyki”, PDF „Skupienie Absolutne”, ZIP z ikonami. Prawdziwe linki do płatnych plików (Life OS, PDF „Skupienie”, ZIP) wklejasz tylko w MailerLite i Elementorze (albo podajesz mi do `strona/konfiguracja.lokalna.json`), nigdy do `konfiguracja.json`: repozytorium jest publiczne.
- [ ] Linki płatności Stripe są gotowe i ustawione (sekcja 8): Life OS 47 zł, Pakiet Pro 69 zł, Skupienie 29 zł (albo dopłata 22 zł, patrz `02-po-zakupie.md`, B4).
- [ ] MailerLite: domena, nadawca, stopka, pola, grupy, formularz, strona zapisu (sekcje 2–6).
- [ ] Maile wklejone i automatyzacje zbudowane (sekcja 7), ale **jeszcze niewłączone**.
- [ ] Make połączony ze Stripe i MailerLite (sekcja 9).
- [ ] Test na sobie (sekcja 11). Dopiero potem włączasz automatyzacje i podmieniasz linki na stronie.
- [ ] Mail do dwóch dotychczasowych klientów (`03-obecni-klienci.md`), wysłany ręcznie.

## 2. Plan MailerLite i limity

Darmowy plan MailerLite został mocno okrojony w lipcu 2026. Według serwisów branżowych obecnie obejmuje: **250 aktywnych subskrybentów, 2 500 maili miesięcznie, 3 aktywne automatyzacje, 3 formularze i 1 stronę docelową (landing page)**, a stopka zawiera logo MailerLite. Nie znalazłem potwierdzenia na stronie MailerLite, więc przed startem sprawdź aktualne limity w cenniku (mailerlite.com/pricing) albo w panelu.

Co to oznacza w praktyce:

- **Automatyzacje:** cały system mieści się w trzech (A, B, C). Nie twórz kopii roboczych jako aktywnych automatyzacji.
- **Maile:** jedna osoba z darmowym ebookiem to 7 maili, a kupujący to 4–5 maili. Przy limicie 2 500 zmieścisz ok. 300 nowych zapisów miesięcznie, mniej, jeśli wysyłasz też newsletter.
- **Uwaga:** gdy wyczerpie się limit maili albo przekroczysz 250 subskrybentów, MailerLite przestaje wysyłać. Wtedy **nie wyjdą też potwierdzenia zamówień**, a bez nich klienci zachowują prawo odstąpienia. Gdy zbliżysz się do 80% któregoś limitu, przejdź na płatny plan.
- **Nowe konto** MailerLite przechodzi weryfikację, zanim pozwoli wysyłać. Załóż je z wyprzedzeniem i uzupełnij dane o stronie zgodnie z prawdą.

## 3. Nadawca i domena (SPF, DKIM, DMARC)

Bez uwierzytelnionej domeny maile lądują w spamie albo nie wychodzą wcale. MailerLite nie pozwala wysyłać z adresów typu gmail.com.

1. **MailerLite → Account settings → Domains → Add domain:** wpisz `revion.pl`.
2. MailerLite pokaże rekordy DNS do dodania. Zaloguj się do panelu, w którym zarządzasz DNS domeny revion.pl (zwykle hosting albo rejestrator), i dodaj je **dokładnie** tak, jak podaje MailerLite:
   - **DKIM:** rekord o nazwie i wartości z panelu MailerLite.
   - **SPF:** domena może mieć **tylko jeden** rekord SPF (TXT zaczynający się od `v=spf1`). Jeśli już masz SPF dla poczty na hostingu, nie dodawaj drugiego, tylko dopisz do istniejącego fragment `include:…` podany przez MailerLite, np. `v=spf1 include:_spf.twojhosting.pl include:_spf.mlsend.com ~all` (dokładną wartość dla MailerLite skopiuj z panelu).
   - **DMARC:** jeśli domena go nie ma, dodaj rekord TXT o nazwie `_dmarc` i wartości `v=DMARC1; p=none; rua=mailto:kontakt@revion.pl`. To tryb obserwacji: niczego nie blokuje, a poprawia wiarygodność nadawcy w Gmailu i Yahoo.
3. Odczekaj (zmiany DNS potrafią wejść w życie nawet po 24–48 godzinach) i kliknij w MailerLite „Check/Verify”. Wszystkie pozycje mają być zielone.
4. **Nadawca we wszystkich mailach:**
   - nazwa: `Kuba z Revion` (albo `Jakub z Revion`; ważne, żeby była taka sama wszędzie),
   - adres: `kontakt@revion.pl`,
   - adres odpowiedzi (reply-to): `kontakt@revion.pl`.

## 4. Stopka

Każdy mail musi mieć dane nadawcy, informację, skąd odbiorca jest na liście, i link do wypisu. MailerLite wstawia blok stopki z linkiem „Unsubscribe”. Uzupełnij dane firmy w ustawieniach konta (domyślna stopka i dane nadawcy), a w samym bloku stopki wpisz poniższy tekst. Link do wypisu to element stopki albo znacznik `{$unsubscribe}`.

**Stopka „newsletter”** (automatyzacja A i wszystkie kampanie):

> Revion · Jakub Sroczyński · ul. Lawendowa 21, 58-500 Jelenia Góra · kontakt@revion.pl
> Dostajesz tę wiadomość, bo ten adres zapisano na newsletter Revion na revion.pl (z darmowym ebookiem) i potwierdzono zapis.
> Polityka prywatności: revion.pl/polityka-prywatnosci · Wypisz się jednym kliknięciem: [link wypisu]

**Stopka „transakcyjna”** (automatyzacje B i C):

> Revion · Jakub Sroczyński · ul. Lawendowa 21, 58-500 Jelenia Góra · kontakt@revion.pl
> Dostajesz tę wiadomość, bo z tym adresem e-mail kupiono produkt Revion. Wiadomości o zamówieniu i pomocy we wdrożeniu wysyłamy w ramach umowy.
> Polityka prywatności: revion.pl/polityka-prywatnosci · Wypisz się z tych wiadomości: [link wypisu]

## 5. Pola i grupy

### Pola (Subscribers → Fields → Create field, typ „Text”)

| Nazwa pola | Po co |
|---|---|
| `pakiet` | „Life OS”, „Pakiet Pro” albo „Skupienie”; ułatwia filtrowanie |
| `nr_zamowienia` | identyfikator płatności Stripe, wstawiany do potwierdzenia |
| `data_zakupu` | data i godzina zakupu, wstawiana do potwierdzenia |
| `gwarancja_do` | ostatni dzień 14-dniowej gwarancji |
| `zgoda_marketing` | `tak`, jeśli kupujący wybrał w Stripe zgodę na porady i oferty |

Po utworzeniu sprawdź, jak wygląda znacznik pola w edytorze maila (przycisk personalizacji). Maile w `02-po-zakupie.md` zakładają format `{$nazwa_pola}`.

### Grupy (Subscribers → Groups → Create group)

| Grupa | Kto w niej jest | Wyzwala |
|---|---|---|
| Darmowy ebook | osoby z formularza zapisu (po potwierdzeniu) | automatyzację A |
| Klienci Life OS | kupujący Life OS za 47 zł (dodaje Make) | automatyzację B |
| Klienci Pakiet Pro | kupujący Pakiet Pro za 69 zł (dodaje Make) | automatyzację B |
| Klienci Skupienie (dokupka) | dokupienie ebooka za 29 zł (dodaje Make) | automatyzację C |

Opcjonalnie: *Klienci sprzed zmian* (dwie osoby z `03-obecni-klienci.md`, bez automatyzacji).

### Zasada wysyłki kampanii (ważne)

Klienci trafiają do MailerLite po to, żeby dostać potwierdzenie i pomoc, a nie zawsze mają zgodę na newsletter. Dlatego **nigdy nie wysyłaj kampanii do „All subscribers”**. Newsletter wysyłaj do:

- grupy *Darmowy ebook*, oraz
- segmentu „klienci ze zgodą”: pole `zgoda_marketing` równe `tak` (Subscribers → Segments → Create segment).

## 6. Formularz na stronie i strona zapisu

Darmowy plan pozwala na 3 formularze i 1 stronę docelową. Potrzebujesz jednego formularza osadzonego (na revion.pl, sekcja „Darmowy ebook”) i jednej strony zapisu (do linku w bio i w postach).

### 6.1 Formularz osadzony (Forms → Embedded forms → Create)

- **Nazwa:** „revion.pl – darmowy ebook”. **Grupa:** *Darmowy ebook*.
- **Pola:** e-mail (wymagany). Imię możesz pominąć: maile nie używają personalizacji imieniem, a każde pole obniża liczbę zapisów.
- **Pole zgody** (checkbox, niezaznaczony domyślnie, wymagany):
  > Chcę otrzymać ebook „Nawyki Żelaznej Dyscypliny” i newsletter Revion: porady o nawykach i organizacji oraz informacje o produktach Revion. Wypiszę się w każdej chwili jednym kliknięciem.
- **Tekst pod przyciskiem:**
  > Administratorem danych jest Jakub Sroczyński (Revion), ul. Lawendowa 21, 58-500 Jelenia Góra. Adres e-mail przetwarzam, żeby wysyłać newsletter, na podstawie Twojej zgody, do czasu jej wycofania. Dostawcą narzędzia do wysyłki jest MailerLite. Szczegóły i Twoje prawa: polityka prywatności (link).
- **Przycisk:** „Wyślij mi darmowy ebook”.
- **Komunikaty systemowe** (błąd adresu, „dziękujemy”) przetłumacz na polski w ustawieniach formularza.
- **Double opt-in: włącz.** Podwójne potwierdzenie chroni przed literówkami i cudzymi adresami, a jednocześnie jest dowodem zgody.

**Mail z prośbą o potwierdzenie zapisu (double opt-in):**

- Temat: `Potwierdź zapis i odbierz ebook`
- Treść:
  > Cześć,
  >
  > kliknij przycisk poniżej, żeby potwierdzić zapis na newsletter Revion. Zaraz potem wyślę Ci ebook „Nawyki Żelaznej Dyscypliny”.
  >
  > **[Przycisk: Potwierdzam i odbieram ebook]**
  >
  > Jeśli ten adres zapisał ktoś inny, zignoruj tę wiadomość. Bez kliknięcia nie wyślę nic więcej.
  >
  > Kuba z Revion

**Strona po wysłaniu formularza (przed potwierdzeniem):**

> **Sprawdź skrzynkę.** Wysłałem Ci maila z przyciskiem potwierdzenia. Nie widzisz go? Zajrzyj do spamu albo do zakładki „Oferty”.

**Strona po kliknięciu w potwierdzenie:**

> **Gotowe.** Ebook jest już w drodze na Twój e-mail. Możesz też pobrać go od razu: [przycisk „Pobierz PDF”, link do PDF].

**Osadzenie na revion.pl:** w MailerLite skopiuj kod formularza (Embed → HTML). Strona v2 to własny blok HTML w Elementorze, więc wklej kod formularza w sekcji `#darmowy-ebook` zamiast przycisku z adresem `#WKLEJ-LINK-DO-STRONY-ZAPISU-MAILERLITE` (albo w widżecie „HTML” Elementora). Jeśli MailerLite każe dodać skrypt w nagłówku strony, możesz go wkleić w tym samym bloku HTML, nad formularzem. Sprawdź wygląd na telefonie.

### 6.2 Strona zapisu (Sites → Landing pages → Create)

Jedna prosta strona do linku w bio i w postach. Adres wpisz do `konfiguracja.json` jako `mailerlite_strona_zapisu`.

- **Nagłówek:** Dyscyplina, która nie zależy od silnej woli
- **Podtytuł:** Darmowy ebook „Nawyki Żelaznej Dyscypliny”: pięć nawyków opartych na badaniach i plan na 30 dni. Ok. 70 stron, każdy rozdział kończy się protokołem do wdrożenia.
- **Punkty:**
  - Poranek bez telefonu i bez budzika na 5:00
  - Wieczorne 5 minut, które oszczędzają poranek
  - Zasada 3 sekund na moment wahania
  - Energia, otoczenie i łańcuch nawyków, który się nie urywa
- **Grafika:** okładka ebooka.
- **Formularz:** jak w 6.1 (ta sama zgoda, ten sam tekst pod przyciskiem, double opt-in, grupa *Darmowy ebook*).
- **Pod formularzem:** Wyślemy ebook na Twój e-mail, a w kolejnych dniach kilka krótkich lekcji. Wypiszesz się jednym kliknięciem.
- **Stopka strony:** dane sprzedawcy i link do polityki prywatności.

## 7. Automatyzacje

Wklej maile z plików 01 i 02 jako kroki „Email”. Dla każdego maila ustaw: temat, tekst podglądu (Preview text), nadawcę, treść, przyciski i stopkę. Tematy A/B: jeśli Twój plan pozwala na test A/B tematów w automatyzacji, wpisz oba warianty. Jeśli nie, używaj wariantu A przez pierwsze 4 tygodnie, potem przełącz na B i porównaj **kliknięcia** (nie otwarcia).

W ustawieniach każdej automatyzacji zostaw wyłączone ponowne wejście (subskrybent przechodzi ją raz).

### 7A. „A – Darmowy ebook”

**Wyzwalacz:** When subscriber joins a group → *Darmowy ebook*.

**Kroki:**

1. Email: Mail 1
2. Delay: 2 dni
3. Email: Mail 2
4. Delay: 2 dni
5. Email: Mail 3
6. Delay: 2 dni
7. Condition: „Subscriber is in group” *Klienci Life OS* **lub** *Klienci Pakiet Pro* (dopasowanie: dowolny warunek, „any”)
   - Tak: koniec (nic nie dodawaj).
   - Nie: przejdź dalej.
8. Email: Mail 4
9. Delay: 2 dni
10. Condition: jak w kroku 7 → Nie: Email: Mail 5
11. Delay: 2 dni
12. Condition: jak w kroku 7 → Nie: Email: Mail 6
13. Delay: 3 dni
14. Condition: jak w kroku 7 → Nie: Email: Mail 7

Jeśli w kroku „Delay” można wybrać godzinę wysyłki, ustaw stałą porę, np. 18:30.

### 7B. „B – Po zakupie”

**Wyzwalacz:** When subscriber joins a group → zaznacz **obie** grupy: *Klienci Life OS* i *Klienci Pakiet Pro*.

> Jeśli wyzwalacz pozwala wybrać tylko jedną grupę: utwórz dodatkową grupę *Klienci – wszyscy*, ustaw na nią wyzwalacz, a w Make dodawaj każdego kupującego do *Klienci – wszyscy* **i** do grupy jego pakietu w tym samym kroku (sekcja 9).

**Kroki:**

1. Condition: „Subscriber is in group” *Klienci Pakiet Pro*
   - **Tak (gałąź Pakiet Pro):**
     1. Email: A2 (potwierdzenie Pakiet Pro), bez opóźnienia
     2. Delay: 1 dzień
     3. Email: B1 (z akapitem o ikonach)
     4. Delay: 2 dni
     5. Email: B2
     6. Delay: 4 dni
     7. Condition: pole `zgoda_marketing` równe `tak` **lub** grupa *Darmowy ebook* (dowolny warunek)
        - Tak: Email: B3 (prośba o opinię)
        - Nie: Email: B3-bez-zgody
   - **Nie (gałąź Life OS):**
     1. Email: A1 (potwierdzenie Life OS), bez opóźnienia
     2. Delay: 1 dzień
     3. Email: B1 (bez akapitu o ikonach)
     4. Delay: 2 dni
     5. Email: B2
     6. Delay: 4 dni
     7. Condition: zgoda jak wyżej
        - **Tak:**
          1. Email: B3
          2. Delay: 3 dni
          3. Condition: grupa *Klienci Pakiet Pro* **lub** *Klienci Skupienie (dokupka)* (dowolny warunek)
             - Tak: koniec.
             - Nie: Email: B4 (Skupienie za 29 zł)
        - **Nie:** Email: B3-bez-zgody (koniec, bez B4)

Gałęzie warunków w MailerLite nie łączą się z powrotem, dlatego maile B1–B3 występują w obu gałęziach. To celowe.

### 7C. „C – Dokupienie Skupienia”

**Wyzwalacz:** When subscriber joins a group → *Klienci Skupienie (dokupka)*.

**Kroki:** Email: A3, bez opóźnienia. Koniec.

(Jeśli wybierzesz wariant „dopłata 22 zł do Pakietu Pro”, wyzwalaczem jest grupa *Dopłata do Pro*, a mail A3 zmieniasz zgodnie z `02-po-zakupie.md`, B4.)

## 8. Stripe: przygotowanie linków płatności

Bez tych ustawień potwierdzenie z maila A1–A3 nie ma czego potwierdzać.

1. **Settings → Business → Public details:** nazwa „Revion”, e-mail wsparcia `kontakt@revion.pl`, adres strony, **adres regulaminu** `https://revion.pl/regulamin/` i polityki prywatności. Bez adresu regulaminu Stripe nie pokaże pola akceptacji.
2. **Każdy link płatności** (Life OS 47 zł, Pakiet Pro 69 zł, Skupienie 29 zł):
   - **„Require customers to accept your terms of service”: włącz.**
   - **Własny tekst przy polu akceptacji** (custom text dla terms of service acceptance), dosłownie:
     > Akceptuję [Regulamin](https://revion.pl/regulamin/). Żądam dostarczenia treści cyfrowej natychmiast, przed upływem 14 dni na odstąpienie od umowy, i przyjmuję do wiadomości, że z chwilą dostarczenia tracę ustawowe prawo odstąpienia od umowy. Niezależnie od tego przysługuje mi dobrowolna 14-dniowa gwarancja zwrotu opisana w Regulaminie.

     Jeśli panel nie pokazuje tej opcji, da się ją ustawić przez API Stripe (pole `custom_text.terms_of_service_acceptance`, do 1200 znaków).
   - **Pole niestandardowe na zgodę marketingową** (Add custom field → Dropdown, **opcjonalne**):
     - etykieta: `Porady i oferty Revion na e-mail?` (Stripe ogranicza długość etykiety, ok. 50 znaków),
     - opcja 1: `Tak, chcę dostawać porady i oferty` (wartość: `tak`),
     - opcja 2: `Nie, dziękuję` (wartość: `nie`).
     Nic nie jest wybrane domyślnie. Zgoda jest dobrowolna i nie wpływa na zakup.
   - **Tekst przy przycisku płatności** (custom text pod przyciskiem):
     > Zgoda na porady i oferty e-mailem jest dobrowolna i możesz ją wycofać w każdej chwili. Administrator danych: Jakub Sroczyński (Revion). Szczegóły: revion.pl/polityka-prywatnosci
   - **Po płatności:** „Don't show confirmation page” → przekierowanie na stronę z dostępem (Life OS: strona z `dostawa-life-os.html`, Pakiet Pro: z `dostawa-pakiet-pro.html`). Strony dostawy mają mieć `noindex` i nie mogą być w mapie strony.
   - **Metody płatności:** włącz te, które obiecuje strona i mail 6 (karta, BLIK, Google Pay, Apple Pay), albo usuń z tekstów te, których nie masz.
   - **Kody rabatowe:** nie włączaj, dopóki nie dostosujesz maili (potwierdzenia podają stałą cenę).
3. **Settings → Customer emails → „Successful payments”: włącz.** Stripe wyśle dodatkowy dowód płatności (siatka bezpieczeństwa, sekcja (c) w pliku 02).
4. **Zapisz identyfikatory linków.** W Payment Links kliknij każdy link i znajdź jego ID zaczynające się od `plink_`. Będą potrzebne w Make.

## 9. Połączenie Stripe → MailerLite przez Make (zalecane)

Darmowy plan Make (stan z września 2026 według serwisów branżowych): 1 000 kredytów miesięcznie i 2 aktywne scenariusze. Jeden zakup zużywa ok. 2–3 kredytów, więc zapas jest ogromny. Wyzwalacz Stripe działa natychmiast, niezależnie od 15-minutowego minimum dla scenariuszy harmonogramowych.

### 9.1 Scenariusz

1. Załóż konto na make.com → **Create a new scenario**.
2. **Moduł 1: Stripe → „Watch Events”** (wyzwalacz natychmiastowy).
   - Połączenie: klucz API ze Stripe (Developers → API keys). Traktuj go jak hasło i nie wklejaj nigdzie poza Make.
   - Typy zdarzeń: `checkout.session.completed` oraz `checkout.session.async_payment_succeeded` (to drugie na wypadek metod płatności potwierdzanych z opóźnieniem).
   - Make sam utworzy webhook w Stripe. Jeśli tego modułu nie ma albo nie działa, użyj **Webhooks → Custom webhook**, a w Stripe dodaj endpoint ręcznie (Developers → Webhooks → Add endpoint, te same dwa zdarzenia). Adresu webhooka nie publikuj nigdzie.
3. **Router** z trzema trasami. Na każdej trasie filtr (ikona klucza na linii), oba warunki muszą być spełnione:
   - `data.object.payment_status` równe `paid`, **oraz**
   - `data.object.payment_link` równe identyfikatorowi linku:
     - trasa „Life OS”: `plink_…` linku za 47 zł,
     - trasa „Pakiet Pro”: `plink_…` linku za 69 zł,
     - trasa „Skupienie”: `plink_…` linku za 29 zł.
   - Prostsza alternatywa: filtr po kwocie `data.object.amount_total` (w groszach: `4700`, `6900`, `2900`). Działa, dopóki nie zmienisz cen i nie włączysz kodów rabatowych.
4. **Na końcu każdej trasy: MailerLite → „Create/Update a Subscriber”** (połączenie: klucz API z MailerLite, Integrations → API).
   - **Email:** `data.object.customer_details.email`
   - **Fields:**
     - `pakiet`: `Life OS` / `Pakiet Pro` / `Skupienie` (wpisz na stałe w danej trasie)
     - `nr_zamowienia`: `data.object.payment_intent`
     - `data_zakupu`: `{{formatDate(now; "DD.MM.YYYY, HH:mm"; "Europe/Warsaw")}}`
     - `gwarancja_do`: `{{formatDate(addDays(now; 14); "DD.MM.YYYY"; "Europe/Warsaw")}}`
     - `zgoda_marketing`: wartość z pola niestandardowego, np. `data.object.custom_fields[1].dropdown.value` (sprawdź w wyniku testu, pod którym numerem jest to pole). Gdy klient nic nie wybrał, wartość jest pusta. Make domyślnie nie wysyła pustych pól, więc nie skasuje wartości zapisanej wcześniej. Sprawdź to na teście: subskrybent z `zgoda_marketing = tak`, który przy kolejnym zakupie nic nie wybierze, ma zachować `tak`.
   - **Groups:** grupa danej trasy (*Klienci Life OS*, *Klienci Pakiet Pro* albo *Klienci Skupienie (dokupka)*).
   - **Status:** nie ustawiaj. Nie wolno „przywracać” na listę osoby, która się wcześniej wypisała.
5. **Kolejność ma znaczenie.** Pola muszą być zapisane, zanim subskrybent trafi do grupy, bo dołączenie do grupy od razu uruchamia potwierdzenie. Jeśli moduł „Create/Update a Subscriber” nie ma pola „Groups”, ustaw w nim same pola, a dopiero po nim dodaj moduł „Add Subscriber to a Group”.
6. **Ustawienia scenariusza:** włącz zapisywanie nieudanych uruchomień (Allow storing of incomplete executions), żeby dało się je ponowić, i zostaw powiadomienia e-mail o błędach. Na koniec włącz scenariusz (przełącznik ON).

### 9.2 Gdy coś pójdzie nie tak

- Make przyśle maila o błędzie. Otwórz historię scenariusza, popraw przyczynę i ponów uruchomienie.
- Jeśli potwierdzenie nie wyszło, wyślij je ręcznie (plik 02, sekcja (c)).

## 10. Alternatywa: Zapier

Zapier ma wyzwalacz Stripe **„Checkout Session Completed”** (natychmiastowy) i akcję MailerLite **„Create/Update Subscriber”**. Ograniczenie: rozróżnienie produktów wymaga filtra albo ścieżek, czyli zapów wielokrokowych, a te na darmowym planie Zapiera zwykle nie są dostępne. Sprawdź aktualny cennik. Jeśli wolisz Zapiera, licz się z płatnym planem albo z trzema osobnymi zapami i innym sposobem rozpoznania produktu. Mapowanie pól i kolejność (najpierw pola, potem grupa) są takie same jak w Make. Uważaj, żeby w Zapierze wybrać aplikację „MailerLite”, a nie „MailerLite Classic”, jeśli Twoje konto jest w nowej wersji.

## 11. Test na sobie (zanim włączysz cokolwiek dla klientów)

Do testów użyj prywatnego Gmaila z dopiskiem, np. `twojadres+revion1@gmail.com`. Gmail dostarczy to na Twoją skrzynkę, a MailerLite potraktuje jako nowego subskrybenta.

**Zapis i automatyzacja A:**

- [ ] Zapisz się przez formularz na revion.pl (na telefonie i na komputerze).
- [ ] Przyszedł mail z potwierdzeniem zapisu po polsku, a przycisk działa.
- [ ] Obie strony (przed i po potwierdzeniu) wyświetlają się poprawnie, a link do PDF działa.
- [ ] Mail 1 przyszedł do głównej skrzynki, nie do spamu. Link do PDF działa.
- [ ] Maile 2–7: w edytorze każdego użyj „Send test”. Sprawdź tematy, podglądy, linki, obrazy, wygląd na telefonie i stopkę.
- [ ] Warunek „nie jest klientem”: dodaj testowego subskrybenta ręcznie do grupy *Klienci Life OS* i sprawdź w podglądzie automatyzacji, że nie dostanie maili 4–7.

**Zakup i automatyzacje B, C** (najtaniej w trybie testowym Stripe):

- [ ] W Stripe przełącz się na tryb testowy i utwórz te same trzy linki płatności (mają inne `plink_…`). W Make utwórz połączenie z testowym kluczem API.
- [ ] Kup przez testowy link kartą `4242 4242 4242 4242` (dowolna przyszła data i dowolny CVC). Zaznacz pole regulaminu i wybierz zgodę „Tak”.
- [ ] Stripe przekierował na właściwą stronę z dostępem.
- [ ] W Make scenariusz wykonał się bez błędów, a w MailerLite subskrybent ma wypełnione pola i właściwą grupę.
- [ ] Mail A1/A2/A3 przyszedł od razu. **Nie ma w nim surowych znaczników** typu `{$data_zakupu}`. Tekst zgody jest identyczny z tekstem w Stripe. Wszystkie linki działają.
- [ ] Onboarding: przed włączeniem automatyzacji tymczasowo ustaw opóźnienia na kilka minut, przejdź całą ścieżkę obu gałęzi (ze zgodą i bez), a potem **przywróć** właściwe opóźnienia. Rób to tylko wtedy, gdy w automatyzacji nie ma jeszcze prawdziwych klientów.
- [ ] Po testach przełącz Make na klucz produkcyjny i prawdziwe `plink_…`, a potem zrób jeden prawdziwy zakup najtańszego produktu i zwróć sobie pieniądze w Stripe. Kosztuje to tylko prowizję Stripe (przy zwrocie zwykle nie wraca), ale potwierdza, że wszystko działa na produkcji.
- [ ] Kliknij link wypisu w jednym z testowych maili i sprawdź, że działa.
- [ ] Usuń testowych subskrybentów z MailerLite, bo liczą się do limitu 250.

## 12. Utrzymanie

**Co tydzień (10 minut):**

- Porównaj płatności w Stripe z grupami klientów w MailerLite. Brakującym klientom wyślij potwierdzenie ręcznie (plik 02, sekcja (c)).
- Odpowiedz na wszystkie maile z `kontakt@revion.pl` (zwroty, reklamacje, pytania, opinie). Na reklamację masz 14 dni, a brak odpowiedzi oznacza jej uznanie.
- Zapisz w arkuszu nowe opinie wraz ze zgodą na publikację i numerem płatności.

**Co miesiąc:**

- Sprawdź zużycie limitów MailerLite (subskrybenci, maile) i Make (kredyty).
- Popatrz na kliknięcia i wypisy w każdym mailu automatyzacji. Mail, po którym wypisuje się wyraźnie więcej osób niż po innych, wymaga poprawy.

**Przy każdej zmianie oferty** (cena, skład pakietu, nowy plik): zaktualizuj stronę, linki Stripe, filtry w Make, potwierdzenia A1–A3, maile 5–6 i regulamin. Nowy regulamin zapisz jako nowy PDF z nową datą i podmień link w potwierdzeniach.

## 13. Do uzupełnienia przed startem

- [ ] `konfiguracja.json` (publiczne, można wpisać): `stripe.pakiet_pro`, `mailerlite_strona_zapisu`.
- [ ] Linki do płatnych plików (`dostawa.life_os`, `dostawa.ebook_skupienie`, `dostawa.ikony`): tylko w MailerLite, Elementorze albo `strona/konfiguracja.lokalna.json`, nie w repozytorium.
- [ ] Link Stripe za 29 zł („Skupienie Absolutne”) albo, zalecane, link dopłaty 22 zł do Pakietu Pro (`02-po-zakupie.md`, B4).
- [ ] Link do PDF regulaminu z datą wersji (A1, A2, A3) i zgodność regulaminu z mailami: termin zwrotu w gwarancji, skutki zwrotu dla licencji, tekst zgody.
- [ ] Mail 3 z pliku 01: Twoja prawdziwa historia.
- [ ] Mail 7 z pliku 01: jak często będzie wychodził newsletter.
- [ ] Telefon w potwierdzeniach: dodaj albo usuń nawias.
- [ ] Nazwa nadawcy: „Kuba z Revion” czy „Jakub z Revion”.
- [ ] Nazwy sekcji Life OS w mailach B1 i B2 zgodne z szablonem.
- [ ] Identyfikatory `plink_…` w filtrach Make.

## Źródła do limitów narzędzi

Limity darmowych planów zmieniają się często. Te liczby pochodzą z serwisów branżowych z 2026 r., a nie z cenników producentów, więc sprawdź je przed startem:

- MailerLite, zmiana darmowego planu od 1.07.2026: https://mailsoftly.com/blog/mailerlite-free-plan-changes/, https://www.mailmodo.com/guides/mailerlite-pricing/, https://blog.groupmail.io/mailerlite-free-plan-limits/
- Make, darmowy plan i kredyty (2026): https://www.jetadmin.io/blog/make-pricing/amp/, https://use-apify.com/blog/make-com-free-plan-limits
- Zapier, szablon Stripe „Checkout Session Completed” → MailerLite: https://zapier.com/apps/mailerlite/integrations/stripe/1752311/add-subscribers-to-groups-in-mailerlite-with-new-payments-in-stripe, https://community.zapier.com/how-do-i-3/how-do-i-add-customers-to-mailerlite-group-after-checkout-28440
- Stripe, pole akceptacji regulaminu i własny tekst: https://docs.stripe.com/payments/checkout/customization/policies
- Prośba o opinię bez zgody marketingowej (WSA w Warszawie, II SA/Wa 715/22): https://czasopismo.legeartis.org/2023/01/badanie-satysfakcji-klientow-przetwarzanie-danych-celach-marketingowych-zgoda-odbiorcy-uzasadniony-interes-wyrok/
