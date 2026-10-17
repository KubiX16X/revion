// Plan startowy: 14 dni, 2 posty dziennie (Facebook + Instagram), 18–31.10.2026.
// Fakty i liczby pochodzą z ebooków Revion (źródło prawdy dla treści metod).
// Posty z linkiem "oferta" kierują na revion.pl/#oferta, pozostałe na darmowy ebook.

export const START = '2026-10-18';
export const GODZINY = ['08:00', '19:30'];

// istniejące posty startowe z kolejki (grafiki już są)
const K = '../kolejka/2026-10-12_start/';
export const ISTNIEJACE = {
  witaj: `${K}2026-10-12-witaj-w-revion`,
  wieczor: `${K}2026-10-16-wieczorne-5-minut`,
  mit21: `${K}2026-10-14-mit-21-dni`,
};

const CTA_EBOOK = (rozdzial) => ({ typ: 'cta', naglowek: 'Więcej w darmowym ebooku', tekst: `„Nawyki Żelaznej Dyscypliny”, ${rozdzial}.`, przycisk: 'Link w bio' });

export const POSTY = [
  // dzień 1 (nd 18.10)
  { istniejacy: 'witaj' },
  { istniejacy: 'wieczor' },
  // dzień 2
  {
    id: 'pierwsza-godzina', filar: 'Nawyki', cel: 'zasieg',
    hashtagi: ['poranek', 'nawyki', 'produktywnosc', 'samodyscyplina'],
    opis: 'Monk Mode w wersji z internetu to pobudka o 5:00, lodowaty prysznic i dwie godziny rytuałów. Prościej i uczciwiej: pierwsza godzina po przebudzeniu bez telefonu i bez cudzych priorytetów.\n\nRobisz w niej to, co zaplanowane poprzedniego wieczoru. Może zacząć się o 6:00, 7:30 albo 9:30. Liczy się, kto ustala jej program: Ty czy skrzynka odbiorcza.\n\nNa start wystarczą dwie rzeczy: ładowarka poza sypialnią i zwykły budzik.\n\nWięcej w darmowym ebooku „Nawyki Żelaznej Dyscypliny”, rozdział 01: {LINK}',
    slajdy: [{ typ: 'okladka', etykieta: 'Monk Mode bez 5:00', naglowek: 'Pierwsza godzina ==bez telefonu==', tekst: 'Nie chodzi o pobudkę przed świtem. Chodzi o to, kto ustala program poranka: Ty czy skrzynka odbiorcza.' }],
  },
  { istniejacy: 'mit21' },
  // dzień 3
  {
    id: 'pytanie-rozproszenia', filar: 'Skupienie', cel: 'zaufanie',
    hashtagi: ['skupienie', 'koncentracja', 'produktywnosc', 'pracazdalna'],
    opis: 'Szybka ankieta. Co najczęściej wybija Cię z rytmu?\n\nA – telefon\nB – maile i komunikatory\nC – ludzie wokół\nD – własne myśli\n\nNapisz literę w komentarzu. Na każde z tych rozproszeń jest osobny sposób i w kolejnych dniach pokażemy je po kolei.',
    slajdy: [{ typ: 'okladka', etykieta: 'Pytanie', naglowek: 'Co Cię ==najbardziej== rozprasza?', tekst: 'A – telefon. B – maile i komunikatory. C – ludzie wokół. D – własne myśli. Napisz literę w komentarzu.' }],
  },
  {
    id: 'nie-opuszczaj-dwa-razy', filar: 'Nawyki', cel: 'newsletter',
    hashtagi: ['nawyki', 'samodyscyplina', 'motywacja', 'rozwojosobisty'],
    opis: 'Najczęstszy powód porzucenia nawyku to nie lenistwo. To jeden opuszczony dzień i myśl „no to po ptakach”.\n\nZasada z „Atomowych nawyków” Jamesa Cleara: nie opuszczaj dwa razy z rzędu. Badanie Lally i in. (2010) mówi to samo: pominięcie jednej okazji nie wpłynęło istotnie na budowanie nawyku.\n\nPrzygotuj wersję minimum na gorsze dni. Jedna strona zamiast dwudziestu. Pięć minut zamiast pół godziny. Liczy się, że wracasz.\n\nCały rozdział o łańcuchu, który się nie urywa, jest w darmowym ebooku: {LINK}',
    slajdy: [
      { typ: 'okladka', etykieta: 'Zasada na gorszy dzień', naglowek: 'Nie opuszczaj ==dwa razy== z rzędu', tekst: 'Jeden pusty dzień to przypadek. Dwa to początek nowego nawyku.' },
      { typ: 'tekst', etykieta: 'Problem', naglowek: '„No to po ptakach”', tekst: 'Jedno opuszczenie nie szkodzi nawykowi. Szkodzi myśl, że skoro seria się urwała, to już nie ma sensu.' },
      { typ: 'lista', naglowek: 'Plan na gorszy dzień', punkty: ['Ustal ==wersję minimum==, np. 1 strona zamiast 20', 'Zrób ją nawet o 22:00', 'Odhacz i idź spać', 'Jutro wracasz do pełnej wersji'] },
      { typ: 'tekst', etykieta: 'Co mówią badania', naglowek: 'Jeden dzień nie przekreśla postępu', tekst: 'W badaniu Lally i in. (2010) pominięcie jednej okazji nie wpłynęło istotnie na budowanie nawyku. Ogólnie regularność dawała lepsze wyniki.' },
      CTA_EBOOK('rozdział 06. Zapisz ten post na gorszy dzień'),
    ],
  },
  // dzień 4
  {
    id: 'cytat-mniej-decyzji', filar: 'Planowanie', cel: 'zasieg',
    hashtagi: ['motywacja', 'planowanie', 'produktywnosc', 'samodyscyplina'],
    opis: 'Motywacja przychodzi i odchodzi. Plan zrobiony wieczorem zostaje.\n\nKażda decyzja odłożona na rano to szczelina, przez którą wchodzi telefon, mail i „najpierw ogarnę biurko”.\n\nZapisz, jeśli też zaczynasz dzień od pytania „od czego zacząć?”.',
    slajdy: [{ typ: 'cytat', naglowek: 'Nie potrzebujesz więcej ==motywacji==. Potrzebujesz mniej decyzji rano.', tekst: 'Revion' }],
  },
  {
    id: 'trzy-priorytety', filar: 'Systemy i Notion', cel: 'sprzedaz', link: 'oferta',
    hashtagi: ['notion', 'planowanie', 'organizacja', 'produktywnosc'],
    opis: 'Długa lista zadań wygląda produktywnie. W praktyce wybierasz z niej to, co najłatwiejsze albo najgłośniejsze.\n\nSpróbuj inaczej: wieczorem wybierz najwyżej trzy sprawy na jutro i ponumeruj je. Przy jedynce zapisz pierwszy fizyczny krok, np. „otwórz plik i napisz trzy zdania”. Rano zaczynasz od jedynki.\n\nW Revion Life OS tak działa sekcja „Dziś”: rano widzisz tylko trzy priorytety, a reszta czeka w Inboxie i projektach. Szablon Notion po polsku, 29 zł jednorazowo: {LINK}',
    slajdy: [
      { typ: 'okladka', etykieta: 'Lista zadań', naglowek: '20 zadań na liście? Wybierz ==3==', tekst: 'Dlaczego krótka lista działa lepiej niż długa.' },
      { typ: 'tekst', etykieta: 'Problem', naglowek: 'Długa lista nie mówi, od czego zacząć', tekst: 'Przy 20 pozycjach wybierasz to, co najłatwiejsze albo najgłośniejsze. Ważne czeka do jutra.' },
      { typ: 'lista', naglowek: 'Zasada 3 priorytetów', punkty: ['Wieczorem wybierz ==najwyżej 3== sprawy na jutro', 'Ponumeruj je: 1 jest najważniejsza', 'Przy jedynce zapisz pierwszy fizyczny krok', 'Rano zaczynasz od 1, nie od skrzynki', 'Reszta dostaje inny dzień albo trafia do projektu'] },
      { typ: 'tekst', etykieta: 'Gdy zrobisz 3', naglowek: 'Wtedy bierzesz kolejne', tekst: 'Trzy to nie limit pracy na cały dzień. To minimum, które sprawia, że dzień jest udany.' },
      { typ: 'cta', naglowek: 'Tak działa sekcja „Dziś” w Life OS', tekst: 'Rano widzisz tylko trzy priorytety. Szablon Notion po polsku, 29 zł raz.', przycisk: 'Link w bio' },
    ],
  },
  // dzień 5
  {
    id: 'telefon-w-innym-pokoju', filar: 'Skupienie', cel: 'zasieg',
    hashtagi: ['skupienie', 'telefon', 'deepwork', 'produktywnosc'],
    opis: 'Ekranem w dół to za mało. Wystarczy jedna wibracja i ręka sama sięga.\n\nNa czas bloku pracy telefon idzie do innego pokoju. Słynny efekt „drenażu mózgu” od samej obecności telefonu słabo się potwierdza w nowszych badaniach, ale odległość nadal działa: żeby sprawdzić, musisz wstać.\n\nSpróbuj przez jeden blok, 45 minut. Napisz w komentarzu, jak poszło.',
    slajdy: [{ typ: 'okladka', etykieta: 'Skupienie', naglowek: 'Telefon w ==innym pokoju==, nie ekranem w dół', tekst: 'Najtańsza ochrona przed powiadomieniami i odruchem sprawdzania.' }],
  },
  {
    id: 'sen-6-godzin', filar: 'Energia', cel: 'newsletter',
    hashtagi: ['sen', 'zdrowie', 'produktywnosc', 'nawyki'],
    opis: '„Mi wystarcza 6 godzin.” Brzmi znajomo?\n\nW badaniu Van Dongena i in. (2003) osoby śpiące po 6 godzin przez dwa tygodnie działały coraz gorzej, aż do poziomu jak po nocy bez snu. Najgorsze: prawie tego nie czuły. Subiektywna senność rosła tylko nieznacznie.\n\nDlatego sen jest pierwszym nawykiem dyscypliny, a nie nagrodą za nią. Co najmniej 7 godzin i stała pora wstawania, także w weekend.\n\nWięcej w darmowym ebooku, rozdział 04: {LINK}',
    slajdy: [
      { typ: 'okladka', etykieta: 'Sen', naglowek: '6 godzin snu ==wystarcza==? Mózg ma inne zdanie', tekst: 'Co się dzieje po dwóch tygodniach krótkiego snu.' },
      { typ: 'tekst', etykieta: 'Badanie', naglowek: '14 dni po 6 godzin', tekst: 'W badaniu Van Dongena i in. (2003) uwaga osób śpiących po 6 godzin przez dwa tygodnie działała coraz gorzej, aż do poziomu jak po nocy bez snu.' },
      { typ: 'tekst', etykieta: 'Haczyk', naglowek: 'Prawie tego nie czuli', tekst: 'Subiektywna senność rosła tylko nieznacznie. Badani działali coraz gorzej, a mieli wrażenie, że się przyzwyczaili.' },
      { typ: 'lista', naglowek: 'Co możesz zrobić', punkty: ['Śpij co najmniej ==7 godzin==', 'Wstawaj o stałej porze, także w weekend', 'Ostatnia kawa ok. 9 godzin przed snem', 'Ładowarka do telefonu poza sypialnią'] },
      CTA_EBOOK('rozdział 04'),
    ],
  },
  // dzień 6
  {
    id: 'dlaczego-revion', filar: 'Marka', cel: 'zaufanie',
    hashtagi: ['notion', 'organizacja', 'produktywnosc', 'rozwojosobisty'],
    opis: 'Zadania w jednej aplikacji, nawyki w drugiej, budżet w arkuszu, pomysły w notatkach w telefonie. Każde miejsce osobno działa. Razem robią chaos.\n\nRevion powstał z prostego założenia: jedno miejsce na dzień, nawyki, cele i pieniądze, po polsku i bez abonamentu. Do tego treści oparte na badaniach, a nie na motywacyjnych hasłach. Przy każdej liczbie podajemy źródło.\n\nNa tym profilu dwa razy dziennie: konkretne sposoby na skupienie, nawyki i planowanie. Obserwuj, jeśli to Twoje tematy.',
    slajdy: [{ typ: 'okladka', etykieta: 'Dlaczego Revion', naglowek: 'Mniej aplikacji. ==Jedno miejsce==.', tekst: 'Dzień, nawyki, cele i pieniądze w jednym systemie. Po polsku, bez abonamentu, z źródłami przy każdej liczbie.' }],
  },
  {
    id: 'inbox-5-sekund', filar: 'Systemy i Notion', cel: 'sprzedaz', link: 'oferta',
    hashtagi: ['notion', 'organizacja', 'planowanie', 'produktywnosc'],
    opis: 'Jeśli coś krąży Ci po głowie, zapisz to. Od razu i w jednym miejscu.\n\nInbox to miejsce na wszystko, co przychodzi do głowy: zadanie, pomysł, sprawę do załatwienia. Wrzucasz w kilka sekund, bez daty i bez projektu, i wracasz do pracy. Wieczorem każda sprawa dostaje datę, trafia do projektu albo do kosza.\n\nW Revion Life OS Inbox jest gotowy na Głównym Kokpicie i w aplikacji Notion na telefonie. Szablon po polsku, 29 zł jednorazowo: {LINK}',
    slajdy: [
      { typ: 'okladka', etykieta: 'Metoda', naglowek: 'Głowa jest od ==myślenia==, nie od pamiętania', tekst: 'Inbox: wrzucasz w kilka sekund, porządkujesz wieczorem.' },
      { typ: 'tekst', etykieta: 'Problem', naglowek: 'Sprawy krążą po głowie', tekst: 'Niedokończone sprawy wracają w najmniej odpowiednich momentach: w trakcie pracy, przed snem, w rozmowie.' },
      { typ: 'lista', naglowek: 'Jak działa Inbox', punkty: ['Każda myśl ląduje w jednym miejscu', 'Bez daty, bez projektu, bez zastanawiania', 'Wieczorem: data, projekt albo kosz', 'Trzy najważniejsze dostają priorytet 1, 2, 3'] },
      { typ: 'tekst', etykieta: 'Na telefonie', naglowek: 'Widżet na ekranie głównym', tekst: 'Nowa sprawa trafia do Inboxu w kilka sekund, nawet w tramwaju. Wracasz do tego, co robisz.' },
      { typ: 'cta', naglowek: 'Inbox jest gotowy w Life OS', tekst: 'Szablon Notion po polsku. Działa na darmowym planie Notion. 29 zł raz, bez abonamentu.', przycisk: 'Link w bio' },
    ],
  },
  // dzień 7
  {
    id: 'jesli-to', filar: 'Nawyki', cel: 'zasieg',
    hashtagi: ['nawyki', 'cele', 'samodyscyplina', 'psychologia'],
    opis: 'Postanowienie „będę się uczyć codziennie” rzadko przetrwa pierwszy trudny dzień. Plan „jeśli–to” radzi sobie dużo lepiej.\n\nMetaanaliza 94 testów pokazała, że plany w formie „jeśli X, to Y” wyraźnie zwiększają szansę realizacji celu w porównaniu z samym postanowieniem (Gollwitzer i Sheeran, 2006).\n\nNapisz w komentarzu swój plan na jedną przeszkodę, która najczęściej Cię zatrzymuje.',
    slajdy: [{ typ: 'okladka', etykieta: 'Najlepiej przebadany trik', naglowek: '„==Jeśli== X, ==to== Y”', tekst: 'Plan na przeszkodę, zanim się pojawi. Np. „Jeśli o 8:30 zadzwoni szef, to po rozmowie wracam do pliku”.' }],
  },
  {
    id: 'przeglad-10-minut', filar: 'Nawyki', cel: 'newsletter',
    hashtagi: ['nawyki', 'planowanie', 'rozwojosobisty', 'samodyscyplina'],
    opis: 'Nawyki rzadko znikają z hukiem. Zwykle po cichu: jeden dzień, potem drugi, a po dwóch tygodniach nikt już nie pamięta, że był plan.\n\nRaz w tygodniu zrób przegląd w 10 minut:\n1. Policz dni z ostatnich 7 i z ostatnich 30.\n2. Znajdź wzór: kiedy nawyk wypadał?\n3. Napraw jedno: jedna zmiana dla najsłabszego nawyku.\n4. Zdecyduj: utrzymujesz, zmniejszasz czy dodajesz.\n5. Pokaż liczby jednej zaufanej osobie.\n\nTracker i cały protokół są w darmowym ebooku „Nawyki Żelaznej Dyscypliny”, rozdział 06: {LINK}',
    slajdy: [
      { typ: 'okladka', etykieta: 'Protokół', naglowek: 'Przegląd tygodnia w ==10 minut==', tekst: 'Żeby nawyki nie znikały po cichu.' },
      { typ: 'lista', naglowek: '5 kroków', punkty: ['**Policz:** dni z ostatnich 7 i 30', '**Znajdź wzór:** kiedy nawyk wypadał?', '**Napraw jedno:** zmiana dla najsłabszego', '**Zdecyduj:** utrzymać, zmniejszyć, dodać?', '**Pokaż:** liczby jednej zaufanej osobie'] },
      { typ: 'tekst', etykieta: 'Krok 3', naglowek: 'Napraw jedno, nie wszystko', tekst: 'Plan „jeśli–to” na trudną sytuację, mniejsze minimum, inna pora albo zmiana w otoczeniu. Jedna rzecz na tydzień.' },
      { typ: 'tekst', etykieta: 'Krok 4', naglowek: 'Nowy nawyk dopiero przy 5 z 7', tekst: 'Kolejny nawyk dodaj, gdy obecne od dwóch tygodni trzymają się co najmniej 5 dni na 7. To umowny próg, nie wynik badań.' },
      CTA_EBOOK('rozdział 06. Zapisz na niedzielę wieczorem'),
    ],
  },
  // dzień 8 (nd 25.10, zmiana czasu na zimowy)
  {
    id: 'pytanie-odblokowania', filar: 'Skupienie', cel: 'zaufanie',
    hashtagi: ['telefon', 'skupienie', 'cyfrowyminimalizm', 'nawyki'],
    opis: 'Zgadnij, ile razy dziennie odblokowujesz telefon. Zapamiętaj tę liczbę.\n\nTeraz sprawdź: na iPhonie w Ustawienia → Czas przed ekranem, na Androidzie w Cyfrowej równowadze.\n\nNapisz w komentarzu: zgadłeś(-aś) czy wyszło więcej? Bez oceniania. To tylko punkt wyjścia.',
    slajdy: [{ typ: 'okladka', etykieta: 'Mały eksperyment', naglowek: 'Ile razy dziennie ==odblokowujesz== telefon?', tekst: 'Najpierw zgadnij. Potem sprawdź w ustawieniach: „Czas przed ekranem” albo „Cyfrowa równowaga”.' }],
  },
  {
    id: 'kawa-o-ktorej', filar: 'Energia', cel: 'newsletter',
    hashtagi: ['kawa', 'sen', 'energia', 'zdrowie'],
    opis: 'Kawa o 16:00 „bo i tak dobrze śpię”? Kofeina działa dłużej, niż czujesz, i może skracać sen, nawet gdy zasypiasz bez problemu.\n\nZasada z ebooka: ostatnia kawa około 9 godzin przed snem. Śpisz od 23:00? Ostatnia kawa o 14:00.\n\nA popularna reguła „90 minut bez kawy po przebudzeniu”? Nie ma na nią dowodów. Ważniejsza jest godzina ostatniej kawy niż pierwszej.\n\nSen, kawa i szczyt energii w rozdziale 04 darmowego ebooka: {LINK}',
    slajdy: [
      { typ: 'okladka', etykieta: 'Energia', naglowek: 'Ostatnia kawa? ==9 godzin== przed snem', tekst: 'I dlaczego reguła „90 minut bez kawy po przebudzeniu” nie ma dowodów.' },
      { typ: 'tekst', etykieta: 'Zasada', naglowek: 'Kofeina działa dłużej, niż czujesz', tekst: 'Kawa po południu może skracać sen, nawet jeśli zasypiasz bez problemu. Ostatnią wypij około 9 godzin przed snem.' },
      { typ: 'lista', naglowek: 'Przykład', punkty: ['Śpisz od 23:00 → ostatnia kawa ok. ==14:00==', 'Śpisz od 24:00 → ok. 15:00', 'Potem woda, herbata ziołowa albo kawa bezkofeinowa'] },
      { typ: 'tekst', etykieta: 'Mit', naglowek: '„90 minut bez kawy po przebudzeniu”', tekst: 'Popularna reguła z internetu nie ma dowodów. Ważniejsza jest godzina ostatniej kawy niż pierwszej.' },
      CTA_EBOOK('rozdział 04: sen, kawa i szczyt energii'),
    ],
  },
  // dzień 9
  {
    id: 'zacznij-od-2-minut', filar: 'Nawyki', cel: 'zasieg',
    hashtagi: ['nawyki', 'prokrastynacja', 'motywacja', 'samodyscyplina'],
    opis: 'Większość nawyków nie przegrywa w środku. Przegrywa w pierwszych sekundach, gdy trzeba zacząć.\n\nDlatego na start zmniejsz nawyk do wersji na około 2 minuty: jedna strona, jedno ćwiczenie, otwarcie pliku. Często po starcie robisz więcej. A jeśli nie, i tak dziś odhaczasz.\n\nJaki nawyk zmniejszysz od jutra? Napisz w komentarzu.',
    slajdy: [{ typ: 'okladka', etykieta: 'Na start', naglowek: 'Zacznij od ==2 minut==', tekst: 'Nie „przeczytam 30 stron”, tylko „otworzę książkę i przeczytam stronę”. Trudny jest start, nie środek.' }],
  },
  {
    id: 'dzien-w-life-os', filar: 'Systemy i Notion', cel: 'sprzedaz', link: 'oferta',
    hashtagi: ['notion', 'szablonnotion', 'planowanie', 'organizacja'],
    opis: 'Jak wygląda zwykły dzień w Revion Life OS?\n\nRano, 2 minuty: otwierasz Główny Kokpit. Sekcja „Dziś” pokazuje trzy priorytety, a przy jedynce czeka zapisany pierwszy krok.\n\nW ciągu dnia: każda nowa sprawa trafia do Inboxu w kilka sekund, także z telefonu.\n\nWieczorem, 5 minut: Inbox do zera, trzy priorytety na jutro, odhaczone nawyki. Plan gotowy, koniec pracy.\n\nW środku są też projekty z paskiem postępu, cele, przegląd tygodnia, budżet ze stałymi opłatami i biblioteka wiedzy. Szablon Notion po polsku, 29 zł jednorazowo, działa na darmowym planie Notion. Masz 14 dni na zwrot pieniędzy: {LINK}',
    slajdy: [
      { typ: 'okladka', etykieta: 'Revion Life OS', naglowek: 'Jeden dzień w ==Life OS==', tekst: 'Szablon Notion po polsku: od poranka do wieczornego zamknięcia.' },
      { typ: 'tekst', etykieta: 'Rano, 2 minuty', naglowek: 'Otwierasz Główny Kokpit', tekst: 'Sekcja „Dziś” pokazuje trzy priorytety. Zaczynasz od jedynki, a przy niej czeka zapisany pierwszy krok.' },
      { typ: 'tekst', etykieta: 'W ciągu dnia', naglowek: 'Wszystko do Inboxu', tekst: 'Nowa sprawa trafia do Inboxu w kilka sekund, także z telefonu. Nie przerywasz pracy, żeby ją od razu załatwiać.' },
      { typ: 'tekst', etykieta: 'Wieczorem, 5 minut', naglowek: 'Zamknięcie dnia', tekst: 'Inbox do zera, trzy priorytety na jutro, odhaczone nawyki. Plan gotowy, koniec pracy.' },
      { typ: 'lista', naglowek: 'Co jeszcze jest w środku', punkty: ['Projekty z paskiem postępu', 'Cele i codzienna tabelka nawyków', 'Przegląd tygodnia w 20 minut', 'Budżet i stałe opłaty', 'Biblioteka wiedzy'] },
      { typ: 'cta', naglowek: 'Revion Life OS · 29 zł', tekst: 'Płacisz raz, działa na darmowym planie Notion. 14 dni na zwrot pieniędzy.', przycisk: 'Link w bio' },
    ],
  },
  // dzień 10
  {
    id: 'licz-dni-nie-serie', filar: 'Nawyki', cel: 'zasieg',
    hashtagi: ['nawyki', 'motywacja', 'rozwojosobisty', 'samodyscyplina'],
    opis: 'Aplikacje do nawyków kochają serie. Problem w tym, że zerwana seria potrafi zniechęcić bardziej niż sam opuszczony dzień.\n\nPolicz inaczej: ile dni z ostatnich 30 się udało. 22 z 30 to bardzo dobry wynik, nawet jeśli seria urwała się po drodze dwa razy. Nagradzaj powrót, nie nieskończoną serię.\n\nZapisz na moment, gdy seria pęknie.',
    slajdy: [{ typ: 'cytat', naglowek: 'Licz dni z ostatnich 30, ==nie serię==.', tekst: '22 z 30 to świetny miesiąc. Nawet jeśli seria urwała się dwa razy.' }],
  },
  {
    id: 'przelaczanie-kosztuje', filar: 'Skupienie', cel: 'sprzedaz', link: 'oferta',
    hashtagi: ['skupienie', 'deepwork', 'produktywnosc', 'pracazdalna'],
    opis: '„Tylko zerknę na maila” rzadko trwa tylko chwilę.\n\nSophie Leroy (2009) opisała resztki uwagi: po przełączeniu część uwagi zostaje przy poprzednim zadaniu, zwłaszcza niedokończonym. Wracasz do pracy, ale nie cały. Pojedyncze przełączenie kosztuje niewiele, ale w ciągu dnia robimy ich dziesiątki.\n\nCo pomaga: dochodź do naturalnego punktu, zanim przerwiesz. Przed przerwą zapisz następny krok. Pocztę sprawdzaj w 2–4 stałych oknach dziennie.\n\nWięcej o głębokiej pracy w ebooku „Skupienie Absolutne”, w Pakiecie Pro razem z Life OS i 50 ikonami do Notion, 69 zł: {LINK}',
    slajdy: [
      { typ: 'okladka', etykieta: 'Skupienie', naglowek: 'Każde przełączenie ==kosztuje==', tekst: 'Dlaczego „tylko zerknę na maila” zabiera więcej, niż myślisz.' },
      { typ: 'tekst', etykieta: 'Zjawisko', naglowek: 'Resztki uwagi', tekst: 'Po przełączeniu część uwagi zostaje przy poprzednim zadaniu, zwłaszcza niedokończonym (Leroy, 2009). Wracasz, ale nie cały.' },
      { typ: 'tekst', etykieta: 'Skala', naglowek: 'Dziesiątki razy dziennie', tekst: 'Pojedyncze przełączenie kosztuje niewiele. Ale w ciągu dnia przełączamy się dziesiątki albo setki razy i to się sumuje.' },
      { typ: 'lista', naglowek: 'Co z tym zrobić', punkty: ['Dochodź do naturalnego punktu, zanim przerwiesz', 'Przed przerwą zapisz następny krok', 'Pocztę sprawdzaj w 2–4 stałych oknach', 'Myśli spoza zadania zapisuj na kartce'] },
      { typ: 'cta', naglowek: 'Więcej w „Skupieniu Absolutnym”', tekst: 'Ebook o głębokiej pracy w Pakiecie Pro: Life OS, ebook i 50 ikon do Notion za 69 zł.', przycisk: 'Link w bio' },
    ],
  },
  // dzień 11
  {
    id: 'kartka-parkingowa', filar: 'Skupienie', cel: 'zasieg',
    hashtagi: ['skupienie', 'koncentracja', 'produktywnosc', 'deepwork'],
    opis: 'W trakcie pracy przypominasz sobie: trzeba zadzwonić do dentysty, odpisać Ani, kupić baterie. I już jesteś w innej karcie przeglądarki.\n\nProsty trik: kartka obok klawiatury. Każda myśl spoza zadania ląduje na niej w kilka sekund, a Ty wracasz do pracy. Po bloku przepisujesz wszystko do swojej listy.\n\nTo jeden z rytuałów z ebooka „Skupienie Absolutne”. Zapisz i wypróbuj przy następnym bloku.',
    slajdy: [{ typ: 'okladka', etykieta: 'Trik na skupienie', naglowek: 'Kartka ==parkingowa==', tekst: 'Myśl spoza zadania ląduje na kartce obok klawiatury. Ty wracasz do pracy. Kartkę przeglądasz po bloku.' }],
  },
  {
    id: 'tarcie', filar: 'Nawyki', cel: 'newsletter',
    hashtagi: ['nawyki', 'samodyscyplina', 'minimalizm', 'produktywnosc'],
    opis: 'Osoby z wysoką samokontrolą częściej omijają pokusy, niż z nimi walczą. Zamiast polegać na silnej woli, urządzają otoczenie tak, żeby walk było mniej.\n\nZasada tarcia działa w obie strony. Dobre nawyki ułatw do zera kroków: książka na poduszce, strój na trening przygotowany wieczorem. Złe utrudnij o kilka kroków i jedną decyzję: wyloguj się z mediów na komputerze, ładowarkę telefonu przenieś do innego pokoju.\n\nCały rozdział o architekturze otoczenia jest w darmowym ebooku, rozdział 05: {LINK}',
    slajdy: [
      { typ: 'okladka', etykieta: 'Otoczenie', naglowek: 'Ułatw dobre. ==Utrudnij== złe.', tekst: 'Mniej walki z pokusami, więcej zrobionych rzeczy.' },
      { typ: 'tekst', etykieta: 'Samokontrola', naglowek: 'Silna wola to unikanie walk', tekst: 'Osoby z wysoką samokontrolą częściej omijają pokusy, niż się im opierają. Urządzają otoczenie tak, żeby walk było mniej.' },
      { typ: 'lista', naglowek: 'Dobre nawyki: zero kroków', punkty: ['Książka na poduszce, nie na półce', 'Strój na trening przygotowany wieczorem', 'Butelka wody na biurku'] },
      { typ: 'lista', naglowek: 'Złe nawyki: kilka kroków więcej', punkty: ['Wyloguj się z mediów na komputerze', 'Rozpraszające aplikacje poza ekranem głównym', 'Ładowarka telefonu w innym pokoju'] },
      CTA_EBOOK('rozdział 05: architektura otoczenia'),
    ],
  },
  // dzień 12
  {
    id: 'pytanie-planowanie', filar: 'Planowanie', cel: 'zaufanie',
    hashtagi: ['planowanie', 'organizacja', 'produktywnosc', 'poranek'],
    opis: 'Szybkie pytanie: kiedy planujesz dzień?\n\nR – rano, przy kawie\nW – wieczorem, przed końcem pracy\nN – nie planuję, jakoś to idzie\n\nNapisz literę w komentarzu. Ciekawi nas, co u Ciebie działa najlepiej.',
    slajdy: [{ typ: 'okladka', etykieta: 'Pytanie', naglowek: 'Planujesz dzień ==rano== czy ==wieczorem==?', tekst: 'R – rano. W – wieczorem. N – nie planuję. Napisz literę w komentarzu.' }],
  },
  {
    id: 'mit-dopamine-detox', filar: 'Skupienie', cel: 'zaufanie', link: 'oferta',
    hashtagi: ['dopamina', 'cyfrowyminimalizm', 'skupienie', 'psychologia'],
    opis: '„Dopamine detox”: dzień bez telefonu, muzyki i jedzenia, żeby „zresetować dopaminę”. Brzmi naukowo, ale nim nie jest. Dopamina to nie zapas, który się wyczerpuje i odnawia po dniu bez bodźców.\n\nCo ma sens: przerwy od ekranu i kontrola bodźców w otoczeniu. Ograniczenie mediów społecznościowych limitem daje mały, ale realny efekt na samopoczucie i oddaje czas. Limit działa lepiej niż zakaz na zawsze.\n\nTrening uwagi (medytacja, długie czytanie, cyfrowy minimalizm) to rozdział 07 ebooka „Skupienie Absolutne” z Pakietu Pro: {LINK}',
    slajdy: [
      { typ: 'okladka', etykieta: 'Mit vs fakt', naglowek: '„Dopamine detox”? ==Nie do końca==.', tekst: 'Co naprawdę ma sens w przerwach od bodźców.' },
      { typ: 'tekst', etykieta: 'Mit', naglowek: 'Nie „resetujesz” dopaminy', tekst: 'Dopamina to nie zapas, który się wyczerpuje i odnawia po dniu bez telefonu. Takie „resetowanie” nie ma podstaw w badaniach.' },
      { typ: 'tekst', etykieta: 'Co ma sens', naglowek: 'Kontrola bodźców działa', tekst: 'Przerwy od ekranu mają sens. Limit na media społecznościowe daje mały, ale realny efekt i działa lepiej niż zakaz na zawsze.' },
      { typ: 'lista', naglowek: 'Zamiast detoksu', punkty: ['Limit czasu na 1–2 aplikacje', 'Telefon poza sypialnią', 'Jeden wieczór w tygodniu bez ekranu', '10 minut nudy bez sięgania po telefon'] },
      { typ: 'cta', naglowek: 'Trening uwagi', tekst: 'Rozdział 07 ebooka „Skupienie Absolutne”: medytacja, czytanie, cyfrowy minimalizm. W Pakiecie Pro.', przycisk: 'Link w bio' },
    ],
  },
  // dzień 13
  {
    id: 'notatka-powrotu', filar: 'Systemy i Notion', cel: 'zaufanie',
    hashtagi: ['produktywnosc', 'skupienie', 'pracazdalna', 'notion'],
    opis: 'Najtrudniejsze w powrocie do pracy po przerwie są pierwsze minuty: gdzie to było, co miało być dalej.\n\nPrzed każdą przerwą zapisz jedno zdanie: gdzie przerywasz i jaki jest następny krok. Np. „slajd 4 gotowy, teraz wykres sprzedaży”. Po powrocie od razu wiesz, od czego zacząć.\n\nW Revion Life OS każde zadanie i projekt ma na to kolumnę „Notatka powrotu”.',
    slajdy: [{ typ: 'okladka', etykieta: 'Zanim przerwiesz', naglowek: 'Zapisz ==następny krok==', tekst: 'Jedno zdanie przed przerwą: gdzie przerywasz i co robisz dalej. Po powrocie zaczynasz od razu.' }],
  },
  {
    id: 'laczenie-pokus', filar: 'Nawyki', cel: 'newsletter',
    hashtagi: ['nawyki', 'motywacja', 'psychologia', 'prokrastynacja'],
    opis: 'Ulubiony serial tylko na rowerku stacjonarnym. Najlepszy podcast tylko przy sprzątaniu.\n\nTo łączenie pokus. W badaniu Milkman i in. (2014) osoby, które mogły słuchać wciągających audiobooków tylko podczas ćwiczeń, chodziły na trening częściej niż grupa kontrolna. Uczciwie: przewaga słabła z czasem, a to jedno, niewielkie badanie. Łączenie pokus pomaga ruszyć, ale samo nie utrzyma nawyku na lata.\n\nWięcej trików na start w darmowym ebooku, rozdział 03: {LINK}',
    slajdy: [
      { typ: 'okladka', etykieta: 'Badanie', naglowek: 'Serial ==tylko== na rowerku', tekst: 'Łączenie pokus: przyjemność dostępna tylko przy nielubianym zadaniu.' },
      { typ: 'tekst', etykieta: 'Badanie', naglowek: 'Audiobooki tylko na siłowni', tekst: 'Uczestnicy, którzy mogli słuchać wciągających audiobooków tylko podczas ćwiczeń, chodzili na trening częściej (Milkman i in., 2014).' },
      { typ: 'tekst', etykieta: 'Uczciwie', naglowek: 'Pomaga ruszyć, nie utrzyma na lata', tekst: 'Przewaga słabła z czasem. To jedno, niewielkie badanie. Traktuj to jako start, a nie cały system.' },
      { typ: 'lista', naglowek: 'Twoje połączenia', punkty: ['Ulubiony podcast tylko przy sprzątaniu', 'Najlepsza kawa tylko przy trudnym mailu', 'Serial tylko na rowerku stacjonarnym'] },
      CTA_EBOOK('rozdział 03'),
    ],
  },
  // dzień 14
  {
    id: 'darmowy-ebook', filar: 'Marka', cel: 'newsletter',
    hashtagi: ['ebook', 'nawyki', 'samodyscyplina', 'rozwojosobisty'],
    opis: 'Za darmo i bez haczyków: ebook „Nawyki Żelaznej Dyscypliny”, ok. 70 stron.\n\nW środku:\n– pierwsza godzina dnia bez telefonu i bez pobudki o 5:00\n– wieczorne 5 minut, czyli strategia Generała i Żołnierza\n– zasada 3 sekund i start od 2 minut\n– sen, kawa i szczyt energii\n– otoczenie, które pracuje za Ciebie\n– tracker i plan na 30 dni\n\nW każdym rozdziale jest protokół do wdrożenia, a przy każdej liczbie źródło. Odbierz: {LINK}',
    slajdy: [{ typ: 'okladka', etykieta: 'Za darmo', naglowek: 'Ebook „Nawyki ==Żelaznej Dyscypliny==”', tekst: 'Ok. 70 stron: poranek, wieczorne planowanie, energia, otoczenie i plan na 30 dni. Przy każdej liczbie źródło.' }],
  },
  {
    id: 'listopad-jeden-system', filar: 'Systemy i Notion', cel: 'sprzedaz', link: 'oferta',
    hashtagi: ['notion', 'szablonnotion', 'planowanie', 'organizacja'],
    opis: 'Jutro listopad. Zamiast kolejnej aplikacji: jeden system na dzień, nawyki, cele i pieniądze.\n\nPlan na pierwszy tydzień: wieczorem trzy priorytety na jutro, codziennie 2–3 nawyki w tabelce, w niedzielę przegląd tygodnia, a na start miesiąca budżet i stałe opłaty.\n\nRevion Life OS to gotowy szablon Notion po polsku, 29 zł jednorazowo. Pakiet Pro (69 zł) dokłada ebook „Skupienie Absolutne” i 50 ikon do Notion. Oba działają na darmowym planie Notion, a na zwrot pieniędzy masz 14 dni: {LINK}',
    slajdy: [
      { typ: 'okladka', etykieta: '1 listopada', naglowek: 'Nowy miesiąc. ==Jeden system==.', tekst: 'Zacznij listopad z planem, a nie z kolejną aplikacją.' },
      { typ: 'lista', naglowek: 'Plan na pierwszy tydzień', punkty: ['Wieczorem: 3 priorytety na jutro', 'Codziennie: 2–3 nawyki w tabelce', 'W niedzielę: przegląd tygodnia', 'Na start miesiąca: budżet i stałe opłaty'] },
      { typ: 'tekst', etykieta: 'Revion Life OS · 29 zł', naglowek: 'Wszystko w jednym szablonie Notion', tekst: 'Kokpit z sekcją „Dziś”, Inbox, projekty, cele i nawyki, finanse i biblioteka wiedzy. Po polsku, płacisz raz.' },
      { typ: 'tekst', etykieta: 'Pakiet Pro · 69 zł', naglowek: 'Life OS + ebook + 50 ikon', tekst: 'Dodatkowo ebook „Skupienie Absolutne” o głębokiej pracy i 50 ikon do Notion w dwóch wariantach.' },
      { typ: 'cta', naglowek: '14 dni na zwrot pieniędzy', tekst: 'Jeśli nie pasuje, oddamy całą kwotę bez podawania przyczyny. Działa na darmowym planie Notion.', przycisk: 'Link w bio' },
    ],
  },
];
