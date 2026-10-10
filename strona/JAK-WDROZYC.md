# Jak wdrożyć nową stronę Revion (ok. 2–3 godziny, jednorazowo)

Wszystko robisz w panelu WordPressa, w Stripe i w MailerLite. Nie potrzebujesz programisty.
Kod strony jest gotowy w plikach `strona-glowna-v2.html`, `dostawa-life-os.html` i `dostawa-pakiet-pro.html`.

> Zanim zaczniesz: zrób kopię obecnej strony (Elementor → przy stronie głównej „Zapisz jako szablon”
> albo kopia całej witryny w panelu hostingu).

## 1. Obrazy i pliki (20 min)

1. WordPress → **Media → Dodaj nowy**. Wgraj z folderu `strona/obrazy/`:
   `pakiet-ebookow-3d.webp`, `ebook-nawyki-okladka.webp`, `ebook-skupienie-okladka.webp`, `revion-og.jpg`.
2. Kliknij jeden z wgranych plików i sprawdź jego adres. Strona zakłada adresy w postaci
   `https://revion.pl/wp-content/uploads/2026/10/nazwa-pliku.webp` (WordPress układa pliki według miesiąca wgrania).
   Jeśli adres jest inny (np. inny miesiąc albo dopisek `-1`), napisz do mnie: podmienię adresy w kodzie w minutę.
3. Wgraj pliki produktów:
   - `Nawyki-Zelaznej-Dyscypliny-Revion.pdf` (darmowy ebook) – pod tą nazwą.
   - PDF „Skupienie Absolutne” i ZIP z ikonami **zmień przed wgraniem na trudne do zgadnięcia nazwy**,
     np. `skupienie-absolutne-k7q2m9.pdf` i `ikony-revion-x4p8t1.zip`. Skopiuj ich adresy.

## 2. Stripe (30 min)

1. **Ustawienia → Dane publiczne:** wpisz adres regulaminu `https://revion.pl/regulamin/`.
2. **Ustawienia → Metody płatności:** włącz BLIK (oraz Google Pay i Apple Pay, jeśli są wyłączone).
3. **Link „Life OS” (istniejący, 47 zł):** edytuj produkt i ustaw nazwę „Revion Life OS + ebook Nawyki Żelaznej
   Dyscypliny”. W linku płatności:
   - **Po płatności → Przekieruj na stronę:** adres nowej strony dostawy Life OS (krok 4),
   - **Wymagaj akceptacji warunków (terms of service):** włączone, z tekstem z `dokumenty/teksty-zgod.md`.
4. **Nowy link „Pakiet Pro” (69 zł):** produkt „Revion Pakiet Pro: Life OS + Skupienie Absolutne + 50 ikon”,
   te same ustawienia co wyżej, przekierowanie na stronę dostawy Pakietu Pro. Skopiuj adres linku.
5. **Wyłącz stare linki** (59, 76, 88, 99, 106, 118, 135 zł), żeby nikt nie kupił zestawów, których już nie ma.
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

1. Utwórz dwie nowe strony z adresami trudnymi do zgadnięcia, np. `/dostep-lifeos-k7q2/` i `/dostep-pro-m9x4/`.
2. W pliku `dostawa-pakiet-pro.html` podmień `#WKLEJ-LINK-DO-PDF-SKUPIENIE-ABSOLUTNE` i `#WKLEJ-LINK-DO-ZIP-IKON`
   na adresy z kroku 1.3. Wklej kod każdej strony w widżet HTML (układ: Elementor Canvas).
3. W ustawieniach SEO obu stron (Yoast albo Rank Math) ustaw **noindex** i nie dodawaj ich do menu.
4. Stare strony dostawy (7 sztuk) przełącz na **szkic** dopiero po wysłaniu maila do 2 obecnych klientów
   (`maile/03-obecni-klienci.md`).

## 5. Regulamin, polityka prywatności, cookies (20 min)

1. Zastąp treść stron `/regulamin/` i `/polityka-prywatnosci/` dokumentami z folderu `dokumenty/`
   (edytor WordPressa sam zamieni Markdown na nagłówki i listy po wklejeniu).
2. Dodaj stronę `/polityka-cookies/`.
3. Uzupełnij wszystkie miejsca oznaczone `[DO UZUPEŁNIENIA: …]`.
4. Polecam 30-minutową konsultację z prawnikiem przed publikacją. Dokumenty są przygotowane na podstawie
   aktualnych przepisów, ale to wzory, nie porada prawna.

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

Gdy coś nie działa, napisz do mnie, co widzisz (najlepiej ze zrzutem ekranu).
