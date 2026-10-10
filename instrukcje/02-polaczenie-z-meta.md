# Krok 2. Połączenie agenta z Meta: aplikacja i token (ok. 30 minut, jednorazowo)

Agent publikuje przez **oficjalne Graph API Meta** (tego samego używają Buffer czy Hootsuite).
Posty pojawiają się normalnie na stronie i na Instagramie, a w **Meta Business Suite** widzisz je
razem ze statystykami i komentarzami, tak jak posty dodane ręcznie.

Na końcu tego kroku będziesz mieć 3 wartości do sekretów GitHuba: **token strony**, **ID strony** i **ID Instagrama**.
**Tokenu nie wklejaj do czatu ani do żadnego pliku w repozytorium.** To jak hasło do Twojej strony.

## 1. Aplikacja dla deweloperów (10 min)

1. Wejdź na **developers.facebook.com** → zaloguj się tym samym Facebookiem, który zarządza stroną Revion.
   Jeśli to pierwszy raz, Meta poprosi o rejestrację konta dewelopera (potwierdzenie telefonu).
2. **Moje aplikacje** → **Utwórz aplikację**.
3. Nazwa: `Revion Agent`, e-mail: e-mail marki.
4. Przypadek użycia: wybierz **Inne** (Other), potem typ aplikacji **Firma** (Business).
   Jeśli Meta zapyta o portfolio biznesowe, wybierz **Revion**.
5. W panelu aplikacji dodaj produkty: **Logowanie przez Facebooka dla firm** (Facebook Login for Business)
   oraz **Instagram** (wariant „API z logowaniem przez Facebooka”), jeśli są na liście.

## 2. Token i ID (10 min)

1. Otwórz **Graph API Explorer**: developers.facebook.com/tools/explorer
2. Po prawej: **Aplikacja Meta** = `Revion Agent`, **Użytkownik lub strona** = **Token użytkownika**.
3. W **Uprawnieniach** dodaj:
   `pages_show_list`, `pages_read_engagement`, `pages_manage_posts`, `business_management`,
   `instagram_basic`, `instagram_content_publish`, `instagram_manage_insights`, `read_insights`.
4. Kliknij **Generate Access Token**. W okienku logowania zaznacz **stronę Revion** i **Instagram Revion**,
   potwierdź wszystkie uprawnienia.
5. Przedłuż token: kliknij ikonę **ⓘ** obok tokenu → **Otwórz w narzędziu Access Token Tool**
   (albo wejdź na developers.facebook.com/tools/debug/accesstoken i wklej token) →
   na dole **Przedłuż token dostępu** (Extend Access Token) → skopiuj nowy, długi token.
6. Wróć do Graph API Explorera, wklej długi token w pole **Token dostępu** i wpisz zapytanie:

   ```
   me/accounts?fields=name,id,access_token,instagram_business_account
   ```

   Kliknij **Prześlij** (Submit). W odpowiedzi przy stronie **Revion** znajdziesz:
   - `access_token` → to jest **META_TOKEN** (token strony),
   - `id` → to jest **META_PAGE_ID**,
   - `instagram_business_account.id` → to jest **META_IG_USER_ID**.

   Brak `instagram_business_account`? Instagram nie jest kontem „Firma” albo nie jest połączony ze stroną
   (krok 1, punkt 3).
7. Sprawdź token strony w **Access Token Debugger** (developers.facebook.com/tools/debug/accesstoken):
   przy **Wygasa** (Expires) powinno być **Nigdy** (Never). Taki token działa bezterminowo, dopóki jesteś
   administratorem strony i nie usuniesz aplikacji. Zmiana hasła do Facebooka może go unieważnić:
   wtedy powtórz punkty 1–6.

## 3. Tryb aplikacji: żeby posty widzieli wszyscy (5 min)

Aplikacje Meta startują w **trybie deweloperskim**. Meta podaje, że treści utworzone w tym trybie widzą tylko
osoby z rolą w aplikacji. Dlatego po pierwszym poście testowym (krok 3) **sprawdź go w oknie incognito**
(niezalogowany). Jeśli go nie widać:

1. Panel aplikacji → **Ustawienia aplikacji** → **Podstawowe**: dodaj link do **polityki prywatności**
   (z revion.pl), ikonę i kategorię → **Zapisz**.
2. Przełącz **Tryb aplikacji** na **Na żywo** (Live) albo kliknij **Opublikuj** aplikację.

Aplikacja używa tylko Twojej strony i Twojego Instagrama, więc w większości przypadków wystarcza
„standardowy dostęp” i przegląd aplikacji (App Review) nie jest potrzebny. Gdyby Meta jednak go zażądała,
napisz do mnie: przygotuję zgłoszenie albo przełączymy publikację na Buffer (ma zatwierdzoną aplikację Meta),
a reszta agenta zostanie bez zmian.

## Gotowe, gdy masz:

- [ ] META_TOKEN (token strony, „Wygasa: Nigdy”),
- [ ] META_PAGE_ID,
- [ ] META_IG_USER_ID.

Dalej: `03-github-i-wlaczenie.md`.
