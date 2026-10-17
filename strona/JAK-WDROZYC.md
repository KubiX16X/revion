# Jak wdrożyć nową stronę Revion (ok. 2–3 godziny, jednorazowo)

Wszystko robisz w panelu WordPressa, w Stripe i w MailerLite. Nie potrzebujesz programisty.
Kod strony jest gotowy w plikach `strona-glowna-v2.html`, `dostawa-life-os.html` i `dostawa-pakiet-pro.html`.

> Zanim zaczniesz: zrób kopię obecnej strony (Elementor → przy stronie głównej „Zapisz jako szablon”
> albo kopia całej witryny w panelu hostingu).

> **Kolejność ma znaczenie:** 0 → 1 → 5 (regulamin) → 5a (maile po zakupie) → 4 (strony dostawy) → 2 (Stripe)
> → 3 (strona główna) → 6 → 7 → 8. Zgoda w Stripe odwołuje się do nowego regulaminu i do maila z potwierdzeniem,
> a przekierowanie po płatności musi trafiać na gotową, opublikowaną stronę dostawy. Kroki 0, 1 i część 2
> (BLIK, wyłączenie starych linków) możesz zrobić od razu.

> **Repozytorium na GitHubie jest publiczne.** Prawdziwych linków do płatnych produktów (Notion, PDF, ZIP)
> nie wpisuj do plików w repozytorium. Podmieniasz je tylko w Elementorze, Stripe i MailerLite
> (albo daj je mi, wpiszę je do pliku `strona/konfiguracja.lokalna.json`, który nie trafia na GitHuba).

## 0. Life OS 2.0: opublikuj nowy szablon (20 min, zrób najpierw)

Nowy szablon **„Revion Life OS · Główny Kokpit”** (ciemna okładka) jest już w Twoim Notion, obok starego
„REVION LIFE OS”. Ma wszystko, co obiecuje strona i ebooki: sekcję „Dziś” z trzema priorytetami, Inbox, projekty
z paskiem postępu, cele, codzienną tabelkę nawyków, przegląd tygodnia, finanse ze stałymi opłatami i bibliotekę
wiedzy. Ma też nowy adres, więc przy okazji zamyka problem starego linku, który trafił do publicznego repozytorium.

1. **Przejrzyj nowy szablon (5 min).** Zacznij od strony „Jak zacząć”. Przykładowe wpisy („Przykład: …”) zostaw:
   pokazują kupującym, jak wypełniać system.
2. **Rzeczy, których nie da się ustawić automatycznie (10 min):**
   - Cele i nawyki → codzienna tabelka → strzałka przy **New** → **New template** „Nowy dzień”, w polu „Data”
     wybierz **Today** (instrukcja jest też w szablonie, w rozwijanym bloku pod tabelką).
   - Okładki stron są teraz pobierane z GitHuba. Na każdej z 8 stron kliknij okładkę → **Change cover** →
     **Upload** i wskaż ten sam plik z `grafiki/notion/` (wtedy szablon nie zależy od repozytorium).
   - Zrób 4 zrzuty ekranu nowego szablonu do strony sprzedażowej: `lifeos-kokpit.png`, `lifeos-projekty.png`,
     `lifeos-nawyki.png`, `lifeos-finanse.png` (szczegóły w kroku 1).
   - Finanse → Transakcje → pod kolumną „Kwota” kliknij **Calculate** → **Sum**. To samo w Budżecie
     pod „Limit wydatków”, jeśli chcesz.
3. **Opublikuj:** na stronie „Revion Life OS · Główny Kokpit” **Share** → zakładka **Publish** → **Publish**, włącz
   **Allow duplicate as template**, wyłącz **Search engine indexing**. Skopiuj link.
4. **Zanim wyłączysz stary szablon,** podmień link na nowy na wszystkich 7 starych stronach dostawy w Elementorze
   (przycisk „URUCHOM” przy Revion Life OS). Nikt, kto zapłaci w trakcie zmian, nie trafi na martwy link.
5. Dopiero teraz w starym „REVION LIFE OS”: **Share** → **Publish** → **Unpublish**.
6. Nowy link wklejasz tylko w miejscach dla kupujących: strony dostawy (krok 4), maile potwierdzeń w MailerLite
   (`maile/02-po-zakupie.md`; albo e-mail D3 z `dokumenty/teksty-zgod.md`, jeśli wysyłasz go z Make) i mail
   do obecnych klientów wysyłany ręcznie (`maile/03-obecni-klienci.md`). Nigdzie publicznie.

Klienci, którzy skopiowali stary szablon, zachowują swoją kopię. Nową wersję dostaną w mailu do obecnych klientów.

## 1. Obrazy i pliki (20 min)

1. WordPress → **Media → Dodaj nowy**. Wgraj z folderu `strona/obrazy/`:
   `pakiet-ebookow-3d.webp`, `ebook-nawyki-okladka.webp`, `ebook-skupienie-okladka.webp`, `revion-og.jpg`.
   Do tego **4 zrzuty ekranu nowego szablonu** (strona obiecuje „prawdziwe zrzuty ekranu”, a stare pokazują stary
   szablon). Zrób je w Notion w trybie ciemnym, w proporcjach ok. 16:10, i wgraj pod nazwami:
   `lifeos-kokpit.png` (Główny Kokpit), `lifeos-projekty.png` (Projekty, widok „Według statusu”),
   `lifeos-nawyki.png` (Cele i nawyki), `lifeos-finanse.png` (Finanse).
2. Kliknij jeden z wgranych plików i sprawdź jego adres. Strona zakłada adresy w postaci
   `https://revion.pl/wp-content/uploads/2026/10/nazwa-pliku.webp` (WordPress układa pliki według miesiąca wgrania).
   Jeśli adres jest inny (np. inny miesiąc albo dopisek `-1`), napisz do mnie: podmienię adresy w kodzie w minutę.
3. Wgraj pliki produktów:
   - `Nawyki-Zelaznej-Dyscypliny-Revion.pdf` (darmowy ebook) – pod tą nazwą.
   - PDF „Skupienie Absolutne” i ZIP z ikonami **zmień przed wgraniem na trudne do zgadnięcia nazwy**:
     dopisz na końcu nazwy 12 losowych liter i cyfr, które sam wymyślisz (np. wygenerowane w menedżerze haseł).
     Nie kopiuj żadnego przykładu z instrukcji. Skopiuj adresy plików.

## 2. Stripe (30 min)

1. **Ustawienia → Dane publiczne:** wpisz adres regulaminu `https://revion.pl/regulamin/`.
2. **Ustawienia → Metody płatności:** włącz BLIK (oraz Google Pay i Apple Pay, jeśli są wyłączone).
3. **Nowy link „Life OS” (29 zł):** cena się zmieniła, a ceny istniejącego linku (47 zł) nie da się zmienić, więc
   utwórz nowy produkt „Revion Life OS + ebook Nawyki Żelaznej Dyscypliny” za 29 zł i nowy link płatności.
   Stary link za 47 zł wyłącz dopiero, gdy na stronie jest już nowy. W nowym linku płatności:
   - **Po płatności → Przekieruj na stronę:** adres nowej strony dostawy Life OS z kroku 4. Zmień przekierowanie
     dopiero wtedy, gdy ta strona jest opublikowana, ma wklejony kod i wszystkie jej linki działają.
     Do tego czasu zostaw obecne przekierowanie,
   - **Wymagaj akceptacji warunków (terms of service):** włączone, z tekstem z `dokumenty/teksty-zgod.md` (A1),
     z polem A2 i tekstem A3 z tego samego pliku. Włącz to dopiero po kroku 5 (nowy regulamin) i 5a (maile).
4. **Nowy link „Pakiet Pro” (69 zł):** produkt „Revion Pakiet Pro: Life OS + Skupienie Absolutne + 50 ikon”,
   te same ustawienia co wyżej, przekierowanie na stronę dostawy Pakietu Pro. Skopiuj adres linku.
   Nie wklejaj go na stronę główną (krok 3), dopóki strona dostawy Pakietu Pro nie jest opublikowana.
5. **Wyłącz stare linki** (47, 59, 76, 88, 99, 106, 118, 135 zł), żeby nikt nie kupił zestawów, których już nie ma.
6. Załóż arkusz „historia cen” (data, produkt, cena). Przy przyszłych promocjach musisz podawać najniższą cenę
   z 30 dni przed obniżką, a arkusz to Twój dowód.

## 3. Strona główna (30 min)

1. Otwórz `strona-glowna-v2.html` w dowolnym edytorze tekstu (Notatnik, TextEdit) i podmień dwa miejsca:
   - `#WKLEJ-LINK-STRIPE-PAKIET-PRO-69-ZL` → link Stripe z kroku 2.4,
   - `#WKLEJ-LINK-DO-STRONY-ZAPISU-MAILERLITE` → adres strony zapisu z MailerLite (`maile/00-instrukcja-mailerlite.md`).
     Możesz też wkleić kod formularza MailerLite w miejsce komentarza `WKLEJ TUTAJ FORMULARZ MAILERLITE`
     i usunąć przycisk pod nim.
2. WordPress → Strony → strona główna → **Edytuj w Elementorze**. Usuń stary widżet HTML.
3. Dodaj widżet **HTML** i wklej całą zawartość pliku.
4. Ustawienia strony (ikona koła zębatego) → **Układ strony: Elementor Canvas** (bez nagłówka i stopki motywu).
5. Zapisz i sprawdź na telefonie oraz w oknie incognito.

## 4. Strony dostawy (20 min)

1. Utwórz dwie nowe strony z adresami trudnymi do zgadnięcia: `/dostep-` plus 12 losowych liter i cyfr,
   które sam wymyślisz (inne dla każdej strony). Nie kopiuj przykładów z instrukcji.
2. Pobierz pliki `dostawa-life-os.html` i `dostawa-pakiet-pro.html` na komputer i w kopiach podmień:
   - `#WKLEJ-LINK-NOTION-LIFE-OS` (w obu plikach) → nowy link z kroku 0,
   - `#WKLEJ-LINK-DO-PDF-SKUPIENIE-ABSOLUTNE` i `#WKLEJ-LINK-DO-ZIP-IKON` (Pakiet Pro) → adresy z kroku 1.3.

   Wklej kod każdej strony w widżet HTML (układ: Elementor Canvas). Zmienionych plików nie wgrywaj na GitHuba.
3. W ustawieniach SEO obu stron (Yoast albo Rank Math) ustaw **noindex** i nie dodawaj ich do menu.
4. Stare strony dostawy (7 sztuk) przełącz na **szkic** dopiero po wysłaniu maila do 2 obecnych klientów
   (`maile/03-obecni-klienci.md`).

## 5. Regulamin, polityka prywatności, cookies (20 min)

1. Zastąp treść stron `/regulamin/` i `/polityka-prywatnosci/` dokumentami z folderu `dokumenty/`
   (edytor WordPressa sam zamieni Markdown na nagłówki i listy po wklejeniu).
2. Dodaj stronę `/polityka-cookies/`.
3. Dodaj strony `/formularz-reklamacji/` i `/formularz-zwrotu/` z plików `dokumenty/formularz-reklamacji.md`
   i `dokumenty/formularz-zwrotu.md`.
4. Gotowy regulamin zapisz jako PDF z datą w nazwie (np. `Regulamin-Revion-2026-10-15.pdf`), wgraj w Media i nie
   nadpisuj go przy kolejnych zmianach. Adres PDF i stron z formularzami wpisz w regulaminie (§ 5 ust. 10,
   Załączniki) i w mailach A1–A3.
5. Uzupełnij wszystkie miejsca oznaczone `[DO UZUPEŁNIENIA: …]`.
6. Polecam 30-minutową konsultację z prawnikiem przed publikacją. Dokumenty są przygotowane na podstawie
   aktualnych przepisów, ale to wzory, nie porada prawna.

## 5a. Maile po zakupie (60–90 min)

Skonfiguruj MailerLite i Make według `maile/00-instrukcja-mailerlite.md` (sekcje 1–11). Zrób testowy zakup
w trybie testowym Stripe. Dopiero gdy przychodzi potwierdzenie A1/A2 z dosłownym tekstem zgody, włącz zgodę
w prawdziwych linkach (krok 2). To potwierdzenie na trwałym nośniku: bez niego klient zachowuje prawo odstąpienia.

## 6. SEO i udostępnianie linku (10 min)

W Yoast albo Rank Math dla strony głównej:
- **Tytuł:** `Revion Life OS – szablon Notion po polsku: zadania, nawyki, cele, finanse`
- **Opis:** `Gotowy pulpit w Notion po polsku. Zadania, nawyki, cele, projekty i finanse w jednym miejscu. Płacisz raz, działa na darmowym Notion. Darmowy ebook o nawykach.`
- **Obraz społecznościowy (Facebook i X):** `revion-og.jpg`.
- **Ikona witryny:** Wygląd → Dostosuj → Tożsamość witryny → wgraj `grafiki/zdjecie-profilowe.png`.

## 7. Zgody cookies i Meta Pixel (opcjonalnie, przed reklamami)

1. Zainstaluj darmową wtyczkę zgód (np. Complianz albo CookieYes). Przycisk „Odrzuć” musi być równie widoczny
   jak „Akceptuj”.
2. Dopiero potem Meta Pixel (np. przez integrację we wtyczce zgód), uruchamiany tylko po zgodzie na cookies
   marketingowe.

## 8. Test końcowy (15 min)

- [ ] Strona na telefonie: wszystkie przyciski prowadzą tam, gdzie trzeba.
- [ ] Zakup w trybie testowym Stripe (oba pakiety): checkbox zgody, przekierowanie, linki na stronie dostawy działają.
- [ ] E-mail z potwierdzeniem przychodzi (po konfiguracji MailerLite i Make).
- [ ] Zapis na darmowy ebook: mail z PDF przychodzi.
- [ ] Udostępnienie linku revion.pl na Messengerze pokazuje obraz `revion-og.jpg`.
- [ ] Stary szablon (link ze starych stron dostawy) w oknie incognito pokazuje błąd, a nowy Life OS 2.0 się otwiera i ma przycisk Duplicate.

Gdy coś nie działa, napisz do mnie, co widzisz (najlepiej ze zrzutem ekranu).
