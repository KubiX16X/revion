# Revion: centrum dowodzenia

Revion sprzedaje **Life OS**, szablon Notion po polsku, oraz ebooki z serii „Biblioteka Revion”.
W tym repozytorium jest wszystko: szczera ocena biznesu, nowa strona sprzedażowa, ebooki, grafiki,
dokumenty prawne, maile i agent AI, który sam publikuje posty na Facebooku i Instagramie.

**Zacznij od `diagnoza-i-plan.md`**: szczera ocena (czy to ma sens), liczby, alternatywy i plan na 90 dni.

## Co jest gotowe

| Folder / plik | Co to jest |
|---|---|
| `diagnoza-i-plan.md` | ocena biznesu, co było złe na starej stronie, scenariusze przychodu, plan, alternatywy, 10 pomysłów na TikToka |
| `strona/` | nowa strona główna i strony dostawy (kod HTML do Elementora), obrazy WebP, fonty, **`JAK-WDROZYC.md`** |
| `strona/dokumenty/` | regulamin, polityka prywatności i cookies, teksty zgód (Stripe, newsletter), formularze, ewidencja sprzedaży |
| `strona/maile/` | sekwencje do MailerLite: darmowy ebook, po zakupie, mail do obecnych klientów, instrukcja konfiguracji |
| `produkty/ebook-nawyki/` | ebook „Nawyki Żelaznej Dyscypliny” (darmowy magnes na newsletter + prezent do zamówień): PDF, okładka, mockup, źródła |
| `produkty/ebook-skupienie/` | ebook „Skupienie Absolutne” (Pakiet Pro). **Treść i PDF nie są w publicznym repozytorium**, patrz niżej |
| `produkty/ikony-notion/` | 50 ikon do Notion w 2 wariantach (podgląd w repozytorium, paczka ZIP lokalnie) |
| `grafiki/` | logo (SVG, PNG), zdjęcie profilowe, okładka FB, okładki wyróżnionych relacji IG, obraz do udostępniania linku, mockupy |
| `marka.md`, `ustawienia.json`, `kolejka/` | brief i ustawienia agenta social media, 3 posty startowe w kolejce |
| `instrukcje/` | konta FB/IG/TikTok, połączenie z Meta, włączenie agenta na GitHubie |
| `agent/` | kod agenta (Node.js) i testy |
| `studio/` | narzędzia, z których powstały grafiki, okładki, strona i PDF-y |

## Kolejność wdrożenia

1. Przeczytaj `diagnoza-i-plan.md` i zdecyduj (zostajesz przy Revion czy wybierasz alternatywę).
2. Wdróż stronę: `strona/JAK-WDROZYC.md` (Stripe, Elementor, strony dostawy, regulamin).
3. MailerLite: `strona/maile/00-instrukcja-mailerlite.md`.
4. Profile i agent: `instrukcje/01-konta.md`, `02-polaczenie-z-meta.md`, `03-github-i-wlaczenie.md`.
5. TikTok: pierwsze 10 pomysłów jest w `diagnoza-i-plan.md`, kolejne agent przysyła co sobotę.

## Ważne: repozytorium jest publiczne

Każdy może je przeglądać na GitHubie. Sekrety (tokeny, klucze) są bezpieczne, ale treść płatnego ebooka
nie może tu trafić. Dlatego „Skupienie Absolutne” (tekst i PDF) oraz paczka ikon są wykluczone z repozytorium
(`.gitignore`) i dostajesz je bezpośrednio w czacie. Jeśli zmienisz repozytorium na prywatne
(Settings → General → Danger Zone → Change visibility), mogę je też tu zapisać.

## Agent social media w skrócie

```
 SOBOTA (automatycznie)                         CO GODZINĘ (automatycznie)
 ┌──────────────────────────────┐               ┌──────────────────────────────┐
 │ 1. wyniki ostatnich postów    │               │ czy minęła godzina posta?    │
 │ 2. Claude pisze 4 posty       │   Ty: Merge   │   → Facebook (karuzela)      │
 │    (marka.md + notatki)       │ ────────────► │   → Instagram (karuzela)     │
 │ 3. grafiki w kolorach marki   │   (5 minut)   │ zapis wyniku i linków        │
 │ 4. pull request z podglądem   │               │                              │
 │    + 3 scenariusze TikToków   │               │ max 1 post dziennie          │
 └──────────────────────────────┘               └──────────────────────────────┘
```

Agent jest **wyłączony** (`"agent_wlaczony": false`), dopóki nie skończysz instrukcji 01–03.
Koszty: Meta API i GitHub Actions 0 zł; Claude API zwykle poniżej 5 zł tygodniowo.

## Dla Claude'a

```bash
# agent
cd agent && npm ci && npm test
node src/sprawdz.mjs                       # stan konfiguracji
node src/grafiki.mjs <folder>/post.json    # grafiki posta
node src/publikuj.mjs --na-sucho           # co by wyszło teraz
node src/generuj.mjs --od 2026-10-19       # tydzień postów (wymaga ANTHROPIC_API_KEY)

# studio (grafiki, PDF, strona)
cd studio && npm ci
node src/okladki.mjs                       # okładki i mockupy 3D
node src/sklad.mjs ../produkty/ebook-nawyki     # PDF darmowego ebooka
# Skupienie Absolutne: najpierw skopiuj lokalnie rozdziały zrodlo/0*.md (nie ma ich w repozytorium), potem:
# node src/sklad.mjs ../produkty/ebook-skupienie
node src/strona.mjs --podglad              # strona z strona/konfiguracja.json (+ podgląd PNG w strona/lokalnie/)
#   prawdziwe linki do płatnych produktów: strona/konfiguracja.lokalna.json (poza repozytorium)
node src/profile.mjs && node src/ikony.mjs && node src/eksport-logo.mjs
```

Ebooki: źródła Markdown w `produkty/<ebook>/zrodlo/` (składnia ramek w `produkty/PRZEWODNIK-STYLU.md`),
spis rozdziałów w `ksiazka.json`. Post w kolejce agenta: patrz `agent/przyklad/post.json`.
