# Mail jednorazowy 03: do dwóch dotychczasowych klientów

**Cel:** przeprosić za brakujący prezent i zepsuty link, dostarczyć nowe pliki i w podziękowaniu dać za darmo wszystko z Pakietu Pro.

## Zanim wyślesz

1. **Sprawdź w Stripe (Payments)** każdą z dwóch płatności: datę, kwotę, adres e-mail i to, co klient kupił. Stary sklep miał 8 kombinacji, więc kwota mówi, co było w koszyku:

   | Kwota | Co kupiono w starym sklepie | Akapity opcjonalne do wstawienia |
   |---|---|---|
   | 47 zł | sam Life OS | brak |
   | 59 zł | Life OS + ikony | [IKONY] |
   | 76 zł | Life OS + wsparcie VIP | [VIP] |
   | 88 zł | Life OS + ikony + VIP | [IKONY], [VIP] |
   | 99 zł | pakiet „Tytan VIP”: Life OS + ikony + ebook + VIP | [TYTAN], [IKONY], [DEEP WORK], [VIP] |
   | 106 zł | Life OS + ebook „Deep Work Masterclass” | [DEEP WORK] |
   | 118 zł | Life OS + ikony + ebook | [IKONY], [DEEP WORK] |
   | 135 zł | Life OS + ebook + VIP | [DEEP WORK], [VIP] |

   Kwoty wyliczono z cen na starej stronie: Life OS 47 zł, ikony +12 zł, VIP +29 zł, ebook +59 zł, a wszystkie trzy dodatki razem z Life OS 99 zł. Jeśli płatność w Stripe ma inną kwotę albo inny opis produktu, kieruj się opisem ze Stripe.

2. **Upewnij się, że wszystkie linki działają:** Life OS, oba PDF i ZIP z ikonami (w `konfiguracja.json` dwa z nich to jeszcze `#WKLEJ-…`). Otwórz każdy link w oknie prywatnym przeglądarki.
3. **Wyślij ręcznie, osobno do każdej osoby,** ze skrzynki `kontakt@revion.pl`, a nie jako kampanię MailerLite. To wiadomość o realizacji ich zamówienia, nie newsletter. Nie mamy też ich zgody marketingowej.
4. **Nie dodawaj tych osób do grup „Klienci Life OS” ani „Klienci Pakiet Pro”.** Uruchomiłoby to automatyzację B, która wysłałaby im potwierdzenie zakupu za 47 albo 69 zł, czyli nieprawdziwe. Jeśli chcesz ich mieć w MailerLite (np. do informacji o aktualizacjach), utwórz osobną grupę *Klienci sprzed zmian* bez żadnej automatyzacji.
5. **Odpowiedz w ciągu 24 godzin w dni robocze,** jeśli ktoś poprosi o zwrot albo o pomoc. Zwrot zrób w Stripe (Payments → płatność → Refund) i potwierdź go mailem.

## Temat i tekst podglądu

**Temat A:** Przepraszam: brakujący prezent i nowe pliki dla Ciebie
**Temat B:** Naprawiam swój błąd: Twój zakup w Revion w nowej wersji

**Tekst podglądu:** Brakujący ebook, działające linki i darmowe przejście na Pakiet Pro w podziękowaniu.

## Treść

Cześć [UZUPEŁNIJ: imię, jeśli znasz je z płatności; jeśli nie, zostaw samo „Cześć,”],

piszę, bo coś zawaliłem i chcę to naprawić.

Przy Twoim zakupie z [UZUPEŁNIJ: data płatności ze Stripe] obiecałem w prezencie ebook „Nawyki Żelaznej Dyscypliny”. Na stronie z dostępem nie było jednak do niego linku. To mój błąd i przepraszam.

**[TYTAN – wstaw, jeśli klient kupił pakiet „Tytan VIP”:]** Do tego link do paczki ikon na Twojej stronie z dostępem był zepsuty i nie dało się jej pobrać. Za to też przepraszam.

Przez ostatnie tygodnie przejrzałem cały sklep. Ebooki powstały od nowa, z badaniami i źródłami, a sklep ma teraz dwa proste pakiety. W podziękowaniu za zaufanie na samym starcie Revion dostajesz za darmo **wszystko z nowego Pakietu Pro**:

**1. Revion Life OS (szablon Notion).** Link bez zmian. Jeśli masz już kopię na swoim koncie, nic nie musisz robić.
→ [LINK: Life OS – wklej nowy link do szablonu w Notion, patrz strona/JAK-WDROZYC.md, krok 0]

**2. Ebook „Nawyki Żelaznej Dyscypliny” (PDF, ok. 70 stron).** To brakujący prezent, w nowym wydaniu.
→ [LINK: PDF – https://revion.pl/wp-content/uploads/2026/10/Nawyki-Zelaznej-Dyscypliny-Revion.pdf]

**3. Ebook „Skupienie Absolutne” (PDF, ok. 100 stron).** Protokoły głębokiej pracy: środowisko bez rozproszeń, biologia skupienia, rytuały i plan na 30 dni.
→ [LINK: PDF Skupienie Absolutne – UZUPEŁNIJ: konfiguracja.json → dostawa.ebook_skupienie]

**4. 50 ikon do Notion (ZIP).** Dwa warianty: „neon” i „kafel”, instrukcja w środku.
→ [LINK: ZIP ikon – UZUPEŁNIJ: konfiguracja.json → dostawa.ikony]

**[DEEP WORK – wstaw, jeśli klient kupił ebook „Deep Work Masterclass”:]** Ebook „Deep Work Masterclass”, który kupiono w starym sklepie, zastępuje „Skupienie Absolutne” z punktu 3. To nowa książka, napisana od zera i pod nową nazwą, z badaniami i źródłami przy każdym rozdziale. Stary plik możesz zachować.

**[IKONY – wstaw, jeśli klient kupił ikony:]** Paczkę ikon ze starego sklepu zastępuje nowy pakiet z punktu 4: 50 ikon w dwóch wariantach i z instrukcją ustawiania w Notion.

**[VIP – wstaw, jeśli klient kupił „Wsparcie VIP”:]** Płatne „Wsparcie VIP” wycofałem. Pomoc mailowa należy się każdemu klientowi, bez dopłat, więc masz ją dalej, tak jak wszyscy. Jeśli chcesz, oddam Ci 29 zł za VIP. Wystarczy, że odpiszesz „zwrot VIP”.

Zapisz tego maila. Linki są Twoim stałym dostępem, także do przyszłych aktualizacji. O nowych wersjach szablonu i ebooków dam Ci znać.

Jeszcze jedno. Jeśli po tym wszystkim wolisz po prostu zwrot pieniędzy, napisz. Oddam całą kwotę, bez pytań.

Potrzebujesz pomocy z Life OS albo rachunku za zakup? Odpisz na tego maila. Odpowiadam w ciągu 24 godzin w dni robocze.

Dziękuję za cierpliwość i za zaufanie na starcie.

Kuba
Jakub Sroczyński, Revion
ul. Lawendowa 21, 58-500 Jelenia Góra · kontakt@revion.pl

## Dlaczego tak, a nie inaczej

- **Przeprosiny bez tłumaczenia się.** Klient nie potrzebuje historii o problemach technicznych, tylko działających plików. Jedno zdanie „to mój błąd” buduje więcej zaufania niż akapit wyjaśnień.
- **Darmowy Pakiet Pro zamiast rabatu na przyszłość.** Przy dwóch osobach koszt jest zerowy (pliki cyfrowe), a gest jest konkretny i natychmiastowy.
- **Propozycja zwrotu.** Stary sklep nie wysyłał potwierdzenia na trwałym nośniku i nie zbierał zgody na utratę prawa odstąpienia, więc ci klienci najpewniej nadal mogą odstąpić od umowy, a termin mógł się wydłużyć nawet o 12 miesięcy (`strona/dokumenty/research-prawo.json`, punkt 5: „Klientom sprzed zmiany nie odmawiaj zwrotu”). Uczciwa, otwarta propozycja jest lepsza niż spór i reklamacja płatności w Stripe.
- **Zwrot 29 zł za VIP.** Usługa była nieokreślona (wspólny kod, „omiń kolejkę” przy braku kolejki), a przy usługach prawo odstąpienia działa inaczej niż przy treściach cyfrowych (`strona/dokumenty/research-prawo.json`, punkt 11). Zwrot na życzenie zamyka temat.
- **Bez prośby o opinię i bez oferty.** Ci klienci nie wyrazili zgody na informacje handlowe. Mail dotyczy wyłącznie ich zamówienia.
- **Nie piszemy o starym liczniku ani o cenie 197 zł.** Mail dotyczy tego, co klient kupił i co dostaje. Zmiany na stronie mówią same za siebie.
