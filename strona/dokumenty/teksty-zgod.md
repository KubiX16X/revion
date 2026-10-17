<!--
NOTKA DLA WŁAŚCICIELA (komentarz HTML – nie wyświetla się na stronie)

To wzór przygotowany 10.10.2026 na podstawie przepisów obowiązujących w tym dniu (art. 12, 17, 21 i 38 ust. 1
pkt 13 ustawy o prawach konsumenta; art. 398 Prawa komunikacji elektronicznej; RODO) oraz dokumentacji Stripe
(consent_collection, custom_text). To nie jest indywidualna porada prawna. Przed wdrożeniem warto skonsultować
go z prawnikiem. Ten plik jest dla Ciebie, nie do publikacji na stronie.

Najważniejsze: utrata prawa odstąpienia działa tylko wtedy, gdy spełnisz RAZEM trzy warunki:
(1) wymagany checkbox z tekstem zgody w KAŻDYM linku Stripe, (2) informacja o utracie prawa przed płatnością,
(3) e-mail z potwierdzeniem i dosłowną treścią zgody wysłany od razu po zakupie. Ciężar dowodu jest po Twojej stronie.
Jeśli zmienisz tekst zgody, zmień go wszędzie: Stripe, § 8 ust. 3 regulaminu, e-mail z części D, `maile/02-po-zakupie.md` (A1–A3) i `maile/00-instrukcja-mailerlite.md` (sekcja 8).
-->

# Teksty zgód i instrukcja wdrożenia

Ten plik zawiera cztery części:

- **A.** Teksty do wklejenia w Stripe Payment Links.
- **B.** Instrukcja, jak je włączyć w Stripe i sprawdzić.
- **C.** Zgoda i teksty przy formularzu newslettera w MailerLite.
- **D.** E-mail z potwierdzeniem zakupu (trwały nośnik): co musi zawierać i gotowy wzór.

Braki do uzupełnienia są oznaczone **[DO UZUPEŁNIENIA: …]**.

---

## A. Teksty do Stripe Payment Links

Te same teksty wklej w obu linkach: Life OS (29 zł) i Pakiet Pro (69 zł).

### A1. Tekst przy obowiązkowym polu akceptacji regulaminu (terms of service)

Pole w API: `custom_text.terms_of_service_acceptance.message`. Limit: 1200 znaków. Ten tekst ma 404 znaki. Stripe obsługuje w nim linki w formacie Markdown.

```text
Akceptuję [Regulamin](https://revion.pl/regulamin/). Wyrażam zgodę na dostarczenie treści cyfrowych (szablon Notion i pliki PDF/ZIP) od razu po płatności, przed upływem 14 dni na odstąpienie od umowy, i przyjmuję do wiadomości, że po ich dostarczeniu tracę ustawowe prawo odstąpienia od umowy. Niezależnie od tego mam 14 dni od zakupu na zwrot całej kwoty w ramach dobrowolnej gwarancji (§ 9 Regulaminu).
```

Dlaczego tak:

- **„Wyrażam zgodę na dostarczenie… od razu, przed upływem 14 dni”** to wyraźna i uprzednia zgoda (art. 38 ust. 1 pkt 13 upk).
- **„przyjmuję do wiadomości, że… tracę”** to przyjęcie do wiadomości informacji o utracie prawa. Musi paść przed płatnością.
- **Zdanie o gwarancji** usuwa sprzeczność z hasłem „14 dni na zwrot” ze strony i jasno oddziela gwarancję od prawa ustawowego. Bez niego klient mógłby uznać komunikaty za mylące.

### A2. Pole dodatkowe (zalecane, mocniejszy dowód)

Drugie, osobne potwierdzenie zbierane jako wymagane pole wyboru (custom field typu dropdown z jedną opcją). Klient musi je aktywnie wybrać, a Stripe zapisuje wybór w danych płatności.

| Ustawienie | Wartość |
|---|---|
| Typ pola | lista rozwijana (Dropdown) |
| Klucz (key) | `zgodadostawa` |
| Etykieta (maks. 50 znaków) | `Prawo odstąpienia – potwierdzenie` (33 znaki) |
| Jedyna opcja: wartość | `tak` |
| Jedyna opcja: etykieta (maks. 100 znaków) | `Chcę dostęp od razu; wiem, że tracę prawo odstąpienia` (53 znaki) |
| Pole opcjonalne? | **nie** (pole wymagane) |

### A3. Tekst nad przyciskiem zapłaty (submit)

Pole w API: `custom_text.submit.message`. Ten tekst ma 300 znaków. Spełnia obowiązek podania kluczowych informacji tuż przed złożeniem zamówienia (art. 17 upk).

```text
Sprzedawca: Jakub Sroczyński (Revion), ul. Lawendowa 21, 58-500 Jelenia Góra, kontakt@revion.pl. Cena końcowa, sprzedawca zwolniony z VAT. Dostęp od razu po płatności, potwierdzenie na e-mail. [Regulamin](https://revion.pl/regulamin/) · [Polityka prywatności](https://revion.pl/polityka-prywatnosci/)
```

### A4. Opisy produktów w Stripe

Stripe pokazuje je na stronie płatności obok ceny. Ustawiasz je w katalogu produktów (Product catalog → produkt → Description).

**Life OS (29 zł):**

```text
Szablon Revion Life OS w Notion (6 modułów, działa na darmowym planie Notion) + ebook PDF „Nawyki Żelaznej Dyscypliny” w prezencie + przyszłe aktualizacje szablonu + pomoc mailowa. Treść cyfrowa: dostęp od razu po płatności.
```

**Pakiet Pro (69 zł):**

```text
Wszystko z Life OS + ebook PDF „Skupienie Absolutne” (ok. 100 stron) + 50 ikon do Notion (PNG, 2 warianty) + przyszłe aktualizacje szablonu i ebooków. Treść cyfrowa: dostęp od razu po płatności.
```

---

## B. Jak to włączyć w Stripe

Nazwy przycisków w panelu Stripe mogą się nieco różnić od opisanych (Stripe zmienia interfejs i tłumaczenia). Jeśli czegoś nie widzisz w panelu, użyj wariantu przez API (krok B3).

### B1. Dane firmy (raz na całe konto)

1. **Settings → Business → Public details** (Ustawienia → Firma → Dane publiczne).
2. Uzupełnij:
   - Public business name: `Revion`;
   - Support email: `kontakt@revion.pl`;
   - Support phone: [DO UZUPEŁNIENIA: jeśli Stripe wymaga numeru, wpisz go i podaj ten sam numer w § 1 regulaminu];
   - Website: `https://revion.pl`;
   - **Terms of service URL: `https://revion.pl/regulamin/`** (bez tego Stripe nie pozwoli włączyć wymaganej akceptacji regulaminu);
   - Privacy policy URL: `https://revion.pl/polityka-prywatnosci/`.
3. **Settings → Customer emails** (E-maile do klientów): włącz **Successful payments**. Stripe wyśle klientowi własne potwierdzenie płatności. To dodatkowy dowód, ale **nie zastępuje** e-maila z części D, bo nie zawiera treści zgody.

### B2. Każdy link płatności (Life OS i Pakiet Pro)

1. **Payment Links** → wybierz link → **Edit** (Edytuj).
2. W sekcji opcji (Options / Advanced options) zaznacz **Require customers to accept your terms of service** (Wymagaj akceptacji warunków).
3. W opcji własnych tekstów (**Add custom text**):
   - przy akceptacji regulaminu (Terms of service) wklej tekst **A1**;
   - przy przycisku zapłaty (Submit button) wklej tekst **A3**.
4. Zalecane: w **Add custom fields** dodaj pole z tabeli **A2** (Dropdown, jedna opcja, pole wymagane).
5. **After payment** (Po płatności): wybierz przekierowanie (**Don't show confirmation page → redirect**) na adres strony dostępu dla danego pakietu: [DO UZUPEŁNIENIA: losowe, nieindeksowane adresy stron dostawy Life OS i Pakietu Pro].
6. Zapisz. Jeśli panel nie pozwala zmienić istniejącego linku, utwórz nowy (krok B3), a jego adres wpisz w `strona/konfiguracja.json` (`stripe.life_os` albo `stripe.pakiet_pro`) i wygeneruj stronę ponownie: `cd studio && node src/strona.mjs`.

### B3. Wariant przez API (gdy panel nie ma którejś opcji)

Utwórz w Stripe klucz ograniczony (Developers → API keys → **Create restricted key**) z uprawnieniem zapisu tylko do Payment Links. Nie wklejaj klucza nigdzie poza swoim terminalem. Komenda tworzy nowy link (zamień `price_…` na ID ceny produktu z katalogu Stripe i uzupełnij adres strony dostępu):

```bash
curl https://api.stripe.com/v1/payment_links \
  -u "$STRIPE_KEY:" \
  -d "line_items[0][price]=price_TU_WPISZ_ID_CENY" \
  -d "line_items[0][quantity]=1" \
  -d "consent_collection[terms_of_service]=required" \
  --data-urlencode "custom_text[terms_of_service_acceptance][message]=Akceptuję [Regulamin](https://revion.pl/regulamin/). Wyrażam zgodę na dostarczenie treści cyfrowych (szablon Notion i pliki PDF/ZIP) od razu po płatności, przed upływem 14 dni na odstąpienie od umowy, i przyjmuję do wiadomości, że po ich dostarczeniu tracę ustawowe prawo odstąpienia od umowy. Niezależnie od tego mam 14 dni od zakupu na zwrot całej kwoty w ramach dobrowolnej gwarancji (§ 9 Regulaminu)." \
  --data-urlencode "custom_text[submit][message]=Sprzedawca: Jakub Sroczyński (Revion), ul. Lawendowa 21, 58-500 Jelenia Góra, kontakt@revion.pl. Cena końcowa, sprzedawca zwolniony z VAT. Dostęp od razu po płatności, potwierdzenie na e-mail. [Regulamin](https://revion.pl/regulamin/) · [Polityka prywatności](https://revion.pl/polityka-prywatnosci/)" \
  -d "custom_fields[0][key]=zgodadostawa" \
  -d "custom_fields[0][type]=dropdown" \
  -d "custom_fields[0][label][type]=custom" \
  --data-urlencode "custom_fields[0][label][custom]=Prawo odstąpienia – potwierdzenie" \
  -d "custom_fields[0][dropdown][options][0][value]=tak" \
  --data-urlencode "custom_fields[0][dropdown][options][0][label]=Chcę dostęp od razu; wiem, że tracę prawo odstąpienia" \
  -d "after_completion[type]=redirect" \
  --data-urlencode "after_completion[redirect][url]=[DO UZUPEŁNIENIA: adres strony dostępu]"
```

Odpowiedź zawiera pole `url` (nowy link `https://buy.stripe.com/…`). Stary link wyłącz w panelu (Deactivate), żeby nikt nie kupił bez zgody.

### B4. Webhook do automatycznego e-maila

1. W Make utwórz scenariusz z wyzwalaczem **Webhooks → Custom webhook** i skopiuj jego adres. W Zapierze: wyzwalacz Stripe albo Webhooks. **Sprawdź, czy wyzwalacz działa natychmiast (instant).** Wyzwalacz sprawdzany co 15 minut (np. w darmowym Zapierze) opóźni potwierdzenie.
2. W Stripe: **Developers → Webhooks → Add endpoint**, wklej adres z Make lub Zapiera i wybierz zdarzenie **`checkout.session.completed`**.
3. Dalsze kroki scenariusza opisuje część D.

### B5. Test przed publikacją (tryb testowy Stripe)

1. Włącz **Test mode**, utwórz takie same linki testowe i zapłać kartą testową `4242 4242 4242 4242` (dowolna przyszła data, dowolny CVC).
2. Sprawdź:
   - [ ] bez zaznaczenia pola zgody i bez wyboru w polu A2 nie da się zapłacić;
   - [ ] tekst przy polu zgody i nad przyciskiem jest poprawny, a link do regulaminu działa;
   - [ ] po płatności otwiera się właściwa strona dostępu, a wszystkie linki na niej działają;
   - [ ] w **Developers → Events** zdarzenie `checkout.session.completed` ma `consent.terms_of_service = "accepted"` i `custom_fields[0].dropdown.value = "tak"`;
   - [ ] e-mail z części D przyszedł w ciągu kilku minut, ma poprawne dane, linki i treść zgody;
   - [ ] wykonaj testowy zwrot (Refund) i sprawdź, jak wygląda dla klienta.
3. Powtórz test w trybie na żywo jednym prawdziwym zakupem za 29 zł i od razu zwróć sobie pieniądze.

---

## C. Newsletter (MailerLite): zgoda i teksty przy formularzu

Przycisk „Wyślij mi darmowy ebook” na stronie prowadzi do strony zapisu w MailerLite. Ustaw ją tak:

1. **Forms** (Formularze) → strona zapisu → **Settings: Double opt-in włączony** (zapis zostaje potwierdzony dopiero po kliknięciu linku w e-mailu; MailerLite zapisuje datę i IP).
2. Dodaj pole wyboru zgody (**Marketing permissions / GDPR** albo zwykły checkbox) jako **wymagane i niezaznaczone domyślnie**.
3. Pod formularzem wklej klauzulę informacyjną C2.
4. Ebook wysyłaj w pierwszym e-mailu po potwierdzeniu zapisu (automatyzacja „subscriber joins group”).

### C1. Tekst pola zgody (checkbox, niezaznaczony)

```text
Chcę zapisać się na newsletter Revion i otrzymywać na podany e-mail darmowy ebook „Nawyki Żelaznej Dyscypliny”, krótkie lekcje oraz informacje o nowościach i ofertach Revion. Mogę wypisać się w każdej chwili jednym kliknięciem.
```

### C2. Klauzula informacyjna pod formularzem

```text
Administratorem danych jest Jakub Sroczyński (Revion), ul. Lawendowa 21, 58-500 Jelenia Góra, kontakt@revion.pl. Twój e-mail (i imię, jeśli je podasz) przetwarzamy na podstawie Twojej zgody (art. 6 ust. 1 lit. a RODO), żeby wysyłać newsletter, do czasu jej wycofania. Sprawdzamy, czy wiadomości są otwierane i klikane, żeby wysyłać ciekawsze treści. Newsletter wysyłamy przez MailerLite. Masz prawo dostępu do danych, ich poprawienia, usunięcia i przeniesienia, wycofania zgody w każdej chwili oraz skargi do Prezesa UODO. Więcej w polityce prywatności: https://revion.pl/polityka-prywatnosci/. Zasady newslettera: § 13 regulaminu: https://revion.pl/regulamin/.
```

### C3. Przycisk formularza

Napis na przycisku powinien jasno mówić, że to zapis na newsletter:

```text
Zapisuję się i odbieram ebook
```

### C4. E-mail z prośbą o potwierdzenie zapisu (double opt-in)

**Temat:** `Potwierdź zapis i odbierz ebook`

```text
Cześć!

Kliknij przycisk poniżej, żeby potwierdzić zapis na newsletter Revion. Zaraz potem wyślemy Ci ebook „Nawyki Żelaznej Dyscypliny”.

[ Potwierdzam zapis ]

Jeśli to nie Ty zapisałeś ten adres, zignoruj tę wiadomość: bez kliknięcia nie wyślemy niczego więcej.

Revion · Jakub Sroczyński, ul. Lawendowa 21, 58-500 Jelenia Góra · kontakt@revion.pl
```

### C5. Stopka każdego newslettera

```text
Dostajesz tę wiadomość, bo zapisałeś(-aś) się na newsletter Revion na revion.pl. Wypisz się jednym kliknięciem: {$unsubscribe}. Administrator danych: Jakub Sroczyński (Revion), ul. Lawendowa 21, 58-500 Jelenia Góra, kontakt@revion.pl. Polityka prywatności: https://revion.pl/polityka-prywatnosci/
```

(`{$unsubscribe}` to znacznik MailerLite. Jeśli Twój edytor używa innego, wstaw jego link wypisu.)

---

## D. E-mail z potwierdzeniem zakupu (trwały nośnik)

### D1. Co e-mail musi zawierać i dlaczego

Strona WWW (w tym strona dostępu) **nie jest trwałym nośnikiem**, bo możesz ją zmienić. E-mail jest. Dlatego najważniejsze informacje muszą być **w treści e-maila**, a nie tylko pod linkiem.

| Element | Podstawa |
|---|---|
| Dane sprzedawcy: imię i nazwisko, adres, e-mail (i telefon, jeśli go udostępniasz); informacja, że działalność jest nierejestrowana | art. 21 ust. 1 w zw. z art. 12 ust. 1 upk |
| Produkt i jego główne cechy, cena końcowa, data i godzina zakupu, numer płatności, sposób płatności | art. 12 ust. 1 upk |
| Linki do Treści cyfrowych i sposób dostawy | art. 12 ust. 1 upk |
| **Dosłowna treść zgody i przyjęcia do wiadomości** (tekst A1, a jeśli używasz pola A2 także jego treść) z datą i godziną | art. 21 ust. 1 i art. 38 ust. 1 pkt 13 upk |
| Informacja, że prawo odstąpienia wygasło po dostarczeniu | art. 12 ust. 1 i art. 38 ust. 1 pkt 13 upk |
| Dobrowolna gwarancja zwrotu: termin (konkretna data) i jak z niej skorzystać | art. 12 ust. 1 upk (informacja o gwarancji) |
| Odpowiedzialność za zgodność z umową (2 lata) i jak złożyć reklamację | art. 12 ust. 1 upk, rozdział 5b upk |
| Wymagania techniczne, kompatybilność, brak zabezpieczeń DRM | art. 12 ust. 1 upk (funkcjonalność i kompatybilność treści cyfrowej) |
| Aktualizacje, licencja, pomoc mailowa | opis umowy (§ 7 i § 12 regulaminu) |
| Pozasądowe sposoby rozwiązywania sporów | art. 12 ust. 1 upk |
| Wersja regulaminu z dnia zakupu i link do jej niezmiennego PDF | art. 8 ustawy o świadczeniu usług drogą elektroniczną; dowód treści umowy |

**Kiedy wysłać:** automatycznie, od razu po płatności (w ciągu kilku minut). Przepis wymaga potwierdzenia „w rozsądnym czasie po zawarciu umowy”, a jest ono warunkiem utraty prawa odstąpienia. Wysyłka ręczna następnego dnia osłabia Twoją pozycję.

### D2. Skąd wziąć dane (zdarzenie Stripe `checkout.session.completed`)

| Znacznik w e-mailu | Pole ze Stripe | Uwagi |
|---|---|---|
| `{{imie}}` | `customer_details.name` | może być puste: wtedy „Cześć!” |
| `{{email}}` | `customer_details.email` | adres odbiorcy |
| `{{produkt}}` | `payment_link` (`plink_…`) | w scenariuszu zamień ID linku na „Life OS” albo „Pakiet Pro” |
| `{{kwota}}` | `amount_total` | kwota w groszach: podziel przez 100 |
| `{{data_zakupu}}` | `created` zdarzenia (nie sesji) | znacznik czasu Unix: zamień na datę i godzinę w strefie Europe/Warsaw |
| `{{data_konca_gwarancji}}` | `created` zdarzenia + 14 dni | np. w Make: `formatDate(addDays(parseDate(created; "X"); 14); "DD.MM.YYYY"; "Europe/Warsaw")` |
| `{{id_platnosci}}` | `payment_intent` (`pi_…`) albo `id` (`cs_…`) | do ewidencji sprzedaży i identyfikacji wpłaty |
| `{{zgoda}}` | `consent.terms_of_service` | wysyłaj e-mail tylko, gdy wartość to `accepted`; inaczej powiadom siebie |
| `{{zgoda_pole}}` | `custom_fields[0].dropdown.value` | `tak`, jeśli używasz pola A2 |
| `{{kraj}}` | `customer_details.address.country` | do ewidencji (sprzedaż za granicę a VAT) |

**Scenariusz (Make albo Zapier):**

1. Webhook Stripe `checkout.session.completed`.
2. Filtr: `consent.terms_of_service = accepted`.
3. Dopisz wiersz do arkusza Google „Ewidencja i zgody” (data, kwota, produkt, ID płatności, kraj, wartość zgody). To jednocześnie dowód zgody i podstawa ewidencji sprzedaży (plik `ewidencja-sprzedazy.csv`).
4. MailerLite: dodaj albo zaktualizuj subskrybenta z polami z tabeli i dodaj go do grupy „Klienci Life OS” albo „Klienci Pakiet Pro” (te same nazwy co w `strona/maile/00-instrukcja-mailerlite.md`, sekcja 9). Automatyzacja grupy wysyła e-mail z dostępem (A1 albo A2 z `strona/maile/02-po-zakupie.md`), oparty na treści D3 poniżej.

**Ważne przy MailerLite:**

- Kupujący **nie zapisał się na newsletter**. Trzymaj klientów w osobnych grupach i nigdy nie wybieraj ich w kampaniach. Do newslettera trafiają tylko po własnym zapisie przez formularz z części C.
- MailerLite jest narzędziem do marketingu i jego zasady mogą ograniczać wysyłkę do osób bez zgody marketingowej. Sprawdź to w warunkach MailerLite. Bezpieczniejsza alternatywa to wysyłka e-maila D3 bezpośrednio ze scenariusza Make lub Zapier (moduł e-mail lub SMTP z adresu kontakt@revion.pl) albo przez MailerSend, transakcyjną usługę tej samej firmy.
- Automatyzacja „dołączył do grupy” nie uruchomi się przy drugim zakupie tej samej osoby, bo jest już w grupie, a ponowne wejście jest wyłączone (`strona/maile/00-instrukcja-mailerlite.md`, sekcja 7). Przy drugim zakupie potwierdzenie wyślij ręcznie (`strona/maile/02-po-zakupie.md`, sekcja (c)). Raz w tygodniu porównuj płatności w Stripe z grupami w MailerLite.
- Zachowuj kopie wysłanych e-maili (historia w narzędziu i wiersz w arkuszu) przez okres przedawnienia roszczeń.

### D3. Wzór e-maila

**Temat:** `Revion: potwierdzenie zakupu {{produkt}} i Twój dostęp`

```text
Cześć {{imie}},

dziękujemy za zakup! Ten e-mail to potwierdzenie zawarcia umowy. Zachowaj go: zawiera Twój stały dostęp i najważniejsze informacje o umowie.

TWOJE ZAMÓWIENIE
• Produkt: {{produkt}}
• Cena: {{kwota}} zł – cena końcowa, płatność jednorazowa (sprzedawca zwolniony z VAT na podstawie art. 113 ust. 1 ustawy o VAT)
• Data i godzina zakupu (zawarcia umowy): {{data_zakupu}}
• Numer płatności: {{id_platnosci}}
• Płatność przez: Stripe

TWÓJ DOSTĘP
• Revion Life OS (szablon Notion): [DO UZUPEŁNIENIA: link do szablonu w Notion] – otwórz i kliknij „Duplicate”
• Ebook „Nawyki Żelaznej Dyscypliny” (PDF, ok. 70 stron): https://revion.pl/wp-content/uploads/2026/10/Nawyki-Zelaznej-Dyscypliny-Revion.pdf
• [tylko Pakiet Pro] Ebook „Skupienie Absolutne” (PDF, ok. 100 stron): [DO UZUPEŁNIENIA: link do PDF]
• [tylko Pakiet Pro] 50 ikon do Notion (ZIP, warianty „neon” i „kafel”): [DO UZUPEŁNIENIA: link do ZIP]
• Strona ze wszystkimi linkami: [DO UZUPEŁNIENIA: adres strony dostępu]

TWOJA ZGODA I PRAWO ODSTĄPIENIA OD UMOWY
Przed płatnością, {{data_zakupu}}, zaznaczyłeś(-aś) na stronie płatności Stripe pole o treści:
„Akceptuję Regulamin. Wyrażam zgodę na dostarczenie treści cyfrowych (szablon Notion i pliki PDF/ZIP) od razu po płatności, przed upływem 14 dni na odstąpienie od umowy, i przyjmuję do wiadomości, że po ich dostarczeniu tracę ustawowe prawo odstąpienia od umowy. Niezależnie od tego mam 14 dni od zakupu na zwrot całej kwoty w ramach dobrowolnej gwarancji (§ 9 Regulaminu).”
W polu „Prawo odstąpienia – potwierdzenie” wybrałeś(-aś): „Chcę dostęp od razu; wiem, że tracę prawo odstąpienia”. [DO UZUPEŁNIENIA: usuń to zdanie, jeśli nie dodasz pola A2]
Potwierdzamy: dostarczanie treści cyfrowych zaczęliśmy na Twoją wyraźną prośbę przed upływem 14 dni na odstąpienie od umowy. Po ich dostarczeniu ustawowe prawo odstąpienia od umowy wygasło (art. 38 ust. 1 pkt 13 ustawy o prawach konsumenta).

GWARANCJA ZWROTU 14 DNI
Niezależnie od tego do {{data_konca_gwarancji}} możesz poprosić o zwrot całej kwoty bez podawania przyczyny. Napisz na kontakt@revion.pl z tego adresu e-mail. Zwrócimy pieniądze w ciągu 14 dni tą samą metodą płatności (§ 9 Regulaminu).

GDY COŚ NIE DZIAŁA (REKLAMACJA)
Odpowiadamy za zgodność produktu z umową przez 2 lata od dostarczenia. Napisz na kontakt@revion.pl: opisz problem i napisz, czego oczekujesz (naprawa, obniżenie ceny albo odstąpienie od umowy). Odpowiemy w ciągu 14 dni (§ 10 Regulaminu).

NAJWAŻNIEJSZE INFORMACJE O UMOWIE
• Sprzedawca: Jakub Sroczyński (Revion), ul. Lawendowa 21, 58-500 Jelenia Góra; działalność nierejestrowana (bez wpisu do CEIDG); e-mail: kontakt@revion.pl [DO UZUPEŁNIENIA: telefon, jeśli go udostępniasz].
• Co kupiłeś(-aś): [DO UZUPEŁNIENIA w każdej z dwóch wersji e-maila: Life OS – szablon Revion Life OS w Notion (Kokpit „Dziś”, Inbox, Projekty, Cele i nawyki, Finanse i budżet, Biblioteka wiedzy), ebook „Nawyki Żelaznej Dyscypliny” w prezencie, przyszłe aktualizacje szablonu, pomoc mailowa. Pakiet Pro – to samo oraz ebook „Skupienie Absolutne”, 50 ikon do Notion i aktualizacje ebooków.]
• Wymagania: konto w Notion (wystarczy darmowe), przeglądarka albo aplikacja Notion (komputer, iOS, Android), program do plików PDF; w Pakiecie Pro także rozpakowanie pliku ZIP. Pliki nie mają zabezpieczeń DRM; pliki z Pakietu Pro są oznaczone znakiem wodnym z Twoim adresem e-mail.
• Dostawa: od razu po płatności, przez stronę dostępu i ten e-mail, bez opłat.
• Aktualizacje: nowe wersje bez dopłaty pod tymi samymi linkami (§ 7 Regulaminu). Pomoc: kontakt@revion.pl, zwykle w ciągu 24 godzin w dni robocze.
• Licencja: na użytek własny jednej osoby. Prosimy nie udostępniać linków ani plików (§ 12 Regulaminu).
• Rachunek: wystawimy na prośbę wysłaną na kontakt@revion.pl.
• Spory: możesz skorzystać z pomocy rzecznika konsumentów, mediacji Inspekcji Handlowej albo sądu polubownego (§ 15 Regulaminu).
• Regulamin w wersji z dnia [DO UZUPEŁNIENIA: data wersji], obowiązującej w dniu zakupu (zapisz go): [DO UZUPEŁNIENIA: link do PDF tej wersji]
• Polityka prywatności: https://revion.pl/polityka-prywatnosci/

Powodzenia z Life OS!
Jakub, Revion

—
To potwierdzenie zakupu (wiadomość transakcyjna). Nie zapisuje Cię na newsletter.
```

### D4. Dopisek na stronach dostępu

Na obu stronach dostawy dodaj jedno zdanie nad linkami, żeby klient wiedział, gdzie szukać potwierdzenia:

```text
Potwierdzenie zakupu z treścią Twojej zgody i warunkami umowy wysłaliśmy na Twój e-mail. Jeśli nie widzisz go w ciągu kilku minut, sprawdź spam albo napisz na kontakt@revion.pl.
```
