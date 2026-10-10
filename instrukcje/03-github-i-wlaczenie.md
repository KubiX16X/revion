# Krok 3. Włączenie agenta na GitHubie (ok. 20 minut, jednorazowo)

Agent działa w **GitHub Actions**: na serwerach GitHuba, bez Twojego komputera, za darmo
(repozytorium jest publiczne, więc minuty Actions nic nie kosztują).

## 1. Repozytorium (0 min)

Wszystko jest już w repozytorium **github.com/KubiX16X/revion**, na domyślnej gałęzi `main`.
GitHub uruchamia zaplanowane akcje tylko z domyślnej gałęzi, więc nic nie musisz scalać.
Sprawdź tylko: **Actions** → jeśli GitHub pyta o włączenie akcji, kliknij **I understand… enable them**.

## 2. Klucz do Claude, który pisze posty (5 min)

1. Wejdź na **console.anthropic.com** i załóż konto.
2. **Billing**: doładuj 5–10 USD. Tydzień postów kosztuje zwykle mniej niż 5 zł.
3. **API Keys** → **Create Key** → nazwa `revion-agent` → skopiuj klucz (pokazuje się tylko raz).

To osobne konto od subskrypcji Claude; płacisz tylko za to, co agent faktycznie zużyje.

## 3. Sekrety w repozytorium (5 min)

github.com/KubiX16X/revion → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**.
Dodaj cztery sekrety (nazwa musi się zgadzać co do litery):

| Nazwa | Wartość |
|---|---|
| `META_TOKEN` | token strony z kroku 2 |
| `META_PAGE_ID` | ID strony z kroku 2 |
| `META_IG_USER_ID` | ID Instagrama z kroku 2 |
| `ANTHROPIC_API_KEY` | klucz z punktu 2 powyżej |

Sekretów nikt nie widzi (nawet w publicznym repozytorium) i nie da się ich odczytać po zapisaniu.

## 4. Uprawnienia akcji (1 min)

**Settings** → **Actions** → **General** → sekcja **Workflow permissions**:
- zaznacz **Read and write permissions**,
- zaznacz **Allow GitHub Actions to create and approve pull requests**,
- **Save**.

## 5. Brief marki (0 min)

`marka.md` jest już uzupełniony na podstawie revion.pl. Jeśli coś się zmieni (ceny, oferta, ton),
popraw plik na GitHubie: otwórz go → ikona ołówka → **Commit changes**. Agent czyta go przy każdym tygodniu postów.

## 6. Test połączenia (2 min)

**Actions** → **Revion: publikacja postów** → **Run workflow** → tryb **sprawdz** → **Run workflow**.
Po minucie kliknij uruchomienie i krok „Sprawdź połączenie”. Wszystkie linie powinny mieć ✓.
Przy ✗ jest napisane, co poprawić.

## 7. Włączenie i pierwszy tydzień (5 min)

1. W `ustawienia.json` zmień `"agent_wlaczony": false` na `"agent_wlaczony": true` → **Commit changes**.
2. **Actions** → **Revion: posty na kolejny tydzień** → **Run workflow** (pole z datą zostaw puste).
3. Po kilku minutach w **Pull requests** pojawi się „Revion: posty na tydzień od …” z podglądem grafik,
   opisami i scenariuszami na TikToka. Przejrzyj i kliknij **Merge**.
4. Od tej chwili posty wychodzą same o godzinach z harmonogramu. Po pierwszym poście sprawdź go w oknie
   incognito (krok 2, punkt 3).

## Ustawienia, które możesz zmieniać (`ustawienia.json`)

| Pole | Co robi |
|---|---|
| `agent_wlaczony` | główny włącznik (`true` / `false`) |
| `akceptacja` | `"pr"`: co sobotę zatwierdzasz posty w pull requeście; `"auto"`: posty idą bez Twojej akceptacji |
| `harmonogram` | dni (`pon`, `wt`, `sro`, `czw`, `pt`, `sob`, `nd`) i godziny publikacji |
| `max_postow_dziennie` | ochrona przed zasypaniem profilu, gdy posty się zaległy |
| `link` | adres, który trafia do opisów na Facebooku |
| `hashtagi_stale` | hashtagi dodawane do każdego posta |
| `wyglad` | kolory grafik i napis w logo |
| `platformy` | `["facebook", "instagram"]`; usuń jedną, żeby publikować tylko na drugiej |

## Gdy coś pójdzie nie tak

- GitHub wyśle Ci e-mail o nieudanej akcji. Opis błędu jest w logu akcji i w `post.json` danego posta (pole `blad`).
- Post z błędem po 3 próbach dostaje status `blad` i czeka. Po naprawie zmień status na `zaplanowany`.
- Żeby wstrzymać jeden post: w jego `post.json` zmień `"status": "zaplanowany"` na `"wstrzymany"`.
- Żeby zatrzymać wszystko: `"agent_wlaczony": false`.
