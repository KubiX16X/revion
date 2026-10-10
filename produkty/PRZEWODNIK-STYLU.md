# Przewodnik stylu ebooków Revion

Dotyczy wszystkich ebooków serii „Biblioteka Revion”. Źródła ebooków to pliki Markdown w `produkty/<ebook>/zrodlo/`,
składane do PDF poleceniem `cd studio && node src/sklad.mjs ../produkty/<ebook>`.
Rozdziały płatnych ebooków (`zrodlo/0*.md`, PDF) nie trafiają do publicznego repozytorium (`.gitignore`).

## Czytelnik

Ktoś, kto chce ogarnąć swoje życie i pracę: student, freelancer, osoba na etacie, twórca. Zmęczony „motywacyjnymi”
treściami bez konkretów. Ma 10 minut dziennie na lekturę i chce od razu coś zrobić. Zna słowo „Notion”, ale nie musi.

## Obietnica serii

**Konkret, który działa, oparty na badaniach, bez ściemy.** Wyróżniamy się na tle poradników „bądź jak mnich, wstawaj
o 5:00” tym, że mówimy, co naprawdę ma dowody, a co jest mitem, i dajemy gotowe protokoły do wdrożenia.

## Ton

- Na „Ty”, bezpośrednio, z energią, ale bez krzyku i bez coachingowego żargonu.
- Formy grzecznościowe wielką literą: Ty, Ciebie, Tobie, Twój (zgodnie ze stroną revion.pl).
- Krótkie zdania (średnio 12–16 słów), krótkie akapity (2–4 zdania).
- Unikaj form rodzajowych: pisz w czasie teraźniejszym i trybie rozkazującym („Zapisz”, „Masz”, „Zauważ”).
  Gdy się nie da, pisz „zrobiłeś/zrobiłaś”.
- Zero obietnic bez pokrycia: nie „zrobisz w 4 godziny to, co inni w tydzień”, tylko „zrobisz więcej w mniej godzin,
  bo przestaniesz tracić czas na przełączanie się”.
- Humor dozwolony, wyśmiewanie czytelnika nie.
- Nie straszymy i nie moralizujemy. Nie piszemy o „przegrywach” ani o „zwycięzcach” w sensie pogardliwym.

## Rzetelność (najważniejsze)

- Każda teza naukowa ma źródło: w tekście „(Lally i in., 2010)”, na końcu rozdziału w sekcji `## Źródła`
  pełny opis z DOI albo adresem URL.
- Korzystaj z bazy faktów z researchu. Gdy badanie się nie zreplikowało albo dowody są słabe, napisz to wprost
  („to popularna teza, ale dowody są słabe”). To nasz wyróżnik, nie słabość.
- Nie wymyślaj liczb, cytatów, badań ani historii „klientów”. Przykłady opisuj jako hipotetyczne
  („Wyobraź sobie Kasię, która…”), nigdy jako prawdziwe przypadki.
- Bez porad medycznych. Przy śnie, kofeinie, suplementach i zdrowiu psychicznym dodaj zdrowy rozsądek
  („jeśli masz problemy ze snem od miesięcy, porozmawiaj z lekarzem”).
- Nazwy cudzych koncepcji przypisuj autorom (np. „głęboka praca” – Cal Newport, „flow” – Mihaly Csikszentmihalyi,
  „Atomowe nawyki” – James Clear, „5 Second Rule” – Mel Robbins). Cytaty max 1–2 zdania, z autorem i tytułem.

## Budowa rozdziału

1. Mocne otwarcie (scena z życia, pytanie albo zaskakujący fakt). Bez „W tym rozdziale dowiesz się…”.
2. 3–5 sekcji `##` z konkretną treścią. Śródtytuły mówią, co czytelnik zyska („Dlaczego plan rano przegrywa”),
   a nie są ogólnikami („Wprowadzenie”).
3. Ramki (składnia niżej): w każdym rozdziale co najmniej 1 × `nauka`, 1 × `protokol`, 1 × `cwiczenie`;
   opcjonalnie `pulapka`, `wskazowka`, `checklista`, `cytat`. Najwyżej 1 × `revion` na rozdział.
4. Na końcu krótka sekcja `## W skrócie` (3–5 punktów) i `## Źródła`.

## Składnia Markdown

- Nagłówki rozdziału: tylko `##` i `###` (tytuł rozdziału i jego numer są w `ksiazka.json`, nie w pliku).
- `**pogrubienie**` oszczędnie (max 1–2 na akapit), `==wyróżnienie==` dla najważniejszej frazy w sekcji.
- Listy, tabele (krótkie, max 4 kolumny), cytaty `>`.
- Ramki:

```
:::nauka Krótki tytuł badania
Treść: kto, kiedy, co zrobił, jaki wynik, co z tego wynika. (Autor, rok)
:::

:::protokol Nazwa protokołu
1. **Krok:** opis.
2. **Krok:** opis.
:::

:::cwiczenie Tytuł ćwiczenia
Co zrobić, ile to trwa, czego się spodziewać.
:::

:::pulapka Tytuł
Typowy błąd i jak go uniknąć.
:::

:::wskazowka Tytuł
Praktyczna drobnostka.
:::

:::checklista Tytuł
- [ ] punkt
- [ ] punkt
:::

:::cytat
Treść cytatu (max 2 zdania).

Autor, „Tytuł”
:::

:::revion Jak to zrobić w Life OS
Jedno-dwa zdania, jak dana technika wygląda w szablonie Revion Life OS (widok Dziś z 3 priorytetami, tracker nawyków,
cele z postępem, projekty, finanse, biblioteka wiedzy, inbox). Bez nachalnej sprzedaży.
:::
```

## Polska typografia

- Cudzysłowy „…”, półpauza z odstępami – (nie dywiz) w zdaniach, liczby z jednostką: „20 minut”, „7,5 godziny”.
- Godziny: 22:30. Przecinek dziesiętny: 0,65. Tysiące: 10 000.
- Bez emoji w ebookach.
