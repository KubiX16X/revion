<!--
NOTKA DLA WŁAŚCICIELA (komentarz HTML)

To wzór przygotowany 10.10.2026 na podstawie przepisów obowiązujących w tym dniu (Prawo przedsiębiorców w brzmieniu
od 1.01.2026, ustawa o VAT, ustawa o PIT, Ordynacja podatkowa, rozporządzenie MF z 17.12.2024 w sprawie zwolnień
z kas rejestrujących, Dz.U. 2024 poz. 1902) i ustaleń z `strona/dokumenty/research-prawo.json`. To nie jest indywidualna porada
podatkowa. Przed ważnymi decyzjami (np. przy zbliżaniu się do limitu albo przed sprzedażą za granicę na większą
skalę) skonsultuj się z księgową lub doradcą podatkowym.
Ten plik jest dla Ciebie, nie do publikacji. Wzór ewidencji jest w pliku ewidencja-sprzedazy.csv
(plik CSV nie może zawierać tej notki, bo zepsułaby kolumny).
-->

# Działalność nierejestrowana w 2026 r.: obowiązki Revion

Krótka ściąga: co musisz robić, sprzedając Life OS i Pakiet Pro bez zakładania firmy. Miejsca, które warto potwierdzić u księgowej, są oznaczone **[DO POTWIERDZENIA]**.

## 1. Warunki i limit w 2026 r.

Możesz sprzedawać bez rejestracji firmy, jeśli spełniasz **oba** warunki (art. 5 ust. 1 Prawa przedsiębiorców):

1. **Przychód należny w żadnym kwartale nie przekracza 225% minimalnego wynagrodzenia.** W 2026 r. minimalne wynagrodzenie wynosi 4806 zł, więc limit to **10 813,50 zł na kwartał**.
2. **W ostatnich 60 miesiącach nie prowadziłeś działalności gospodarczej.**

Ważne:

- Limit liczy się **osobno dla każdego kwartału** (do 2025 r. był miesięczny). Nadwyżki z jednego kwartału nie przenosisz na następny.
- Liczysz **cenę zapłaconą przez klienta**. Prowizje Stripe nie zmniejszają przychodu: to Twój koszt.
- **Przekroczenie limitu** sprawia, że od dnia przekroczenia prowadzisz działalność gospodarczą. Masz wtedy 7 dni na złożenie wniosku do CEIDG.

### Ile to sprzedaży

| Sprzedajesz w kwartale tylko… | Maksymalnie sprzedaży w kwartale | Miesięcznie (średnio) |
|---|---|---|
| Life OS po 47 zł | 230 | ok. 76 |
| Pakiet Pro po 69 zł | 156 | ok. 52 |

Rocznie daje to maksymalnie ok. **43 254 zł** (4 × 10 813,50 zł), ale tylko przy równej sprzedaży w każdym kwartale.

**Ustaw sobie alarm przy ok. 8 000 zł przychodu w kwartale.** To moment, żeby zaplanować rejestrację firmy, zanim limit przekroczy jedna udana kampania.

## 2. Ewidencja sprzedaży

**Obowiązek:** uproszczona ewidencja sprzedaży (art. 109 ust. 1 ustawy o VAT). Wzór: `ewidencja-sprzedazy.csv`.

**Kiedy wpisywać:** codziennie. Sprzedaż z danego dnia wpisz najpóźniej przed pierwszą sprzedażą następnego dnia. W praktyce: raz dziennie, np. rano, na podstawie listy płatności w Stripe.

**Kolumny we wzorze:**

| Kolumna | Po co |
|---|---|
| Lp. | kolejny numer wpisu (wymagany) |
| Data sprzedaży | dzień płatności (wymagana) |
| Wartość sprzedaży (zł) | kwota zapłacona przez klienta (wymagana) |
| Narastająco od początku miesiąca | suma od początku miesiąca, jak w urzędowych wzorach ewidencji |
| Narastająco od początku kwartału | do pilnowania limitu 10 813,50 zł, który od 2026 r. jest kwartalny. Prowadź obie sumy, dopóki urząd nie zaktualizuje wzoru **[DO POTWIERDZENIA]** |
| Produkt | Life OS albo Pakiet Pro |
| Numer płatności Stripe | identyfikator `pi_…`: wiąże wpis z konkretną wpłatą. Jest potrzebny do zwolnienia z kasy fiskalnej (pkt 6) |
| Sposób zapłaty | karta, BLIK, Google Pay itd. |
| Kraj nabywcy | do pilnowania progu VAT dla sprzedaży za granicę (pkt 5) |
| Nr rachunku lub faktury | jeśli klient o nie poprosił |
| Uwagi | np. zwrot, korekta |

**Jak prowadzić:**

- Otwórz plik w Excelu lub Arkuszach Google. Usuń trzy wiersze z przykładem.
- Kolumny „narastająco” możesz liczyć formułą. Na początku każdego miesiąca zacznij sumę miesięczną od zera, a na początku każdego kwartału (1.01, 1.04, 1.07, 1.10) sumę kwartalną.
- **Zwrot w ramach gwarancji:** dopisz nowy wiersz w dniu zwrotu z kwotą ujemną i numerem tej samej płatności. Nie kasuj wiersza ze sprzedażą. Do pilnowania limitu bezpieczniej patrzeć na sumę **przed** zwrotami. Jak zwroty wpływają na przychód należny i PIT, potwierdź u księgowej **[DO POTWIERDZENIA]**.
- Nie wpisuj adresów e-mail ani nazwisk klientów (RODO: ewidencja tego nie wymaga, a numer płatności wystarczy).
- Możesz to zautomatyzować: scenariusz Make lub Zapier z pliku `teksty-zgod.md` (część D2) może dopisywać każdą płatność do arkusza. Mimo to codziennie sprawdzaj, czy wpisy zgadzają się ze Stripe.
- Przechowuj ewidencję, raporty Stripe (Payments i Payouts, eksport CSV) i wyciągi z konta **przez 5 lat od końca roku, w którym minął termin zapłaty podatku**. Dla sprzedaży z 2026 r. oznacza to przechowywanie do końca 2032 r.

## 3. Rachunki i faktury

- **Rachunek wystawiasz na żądanie klienta** (art. 87 Ordynacji podatkowej). Sam z siebie nie musisz.
- Rachunek powinien zawierać co najmniej: Twoje imię, nazwisko i adres; dane nabywcy; numer kolejny i datę wystawienia; nazwę produktu; cenę i kwotę do zapłaty; Twój podpis (przy wersji papierowej). Numeracja np. `R/1/2026`, `R/2/2026`.
- Dopisek na rachunku: „Sprzedawca zwolniony z VAT na podstawie art. 113 ust. 1 ustawy o VAT”.
- **Firma może zażądać faktury.** Jako podatnik zwolniony z VAT wystawiasz wtedy fakturę bez VAT, z tym samym dopiskiem.
- **KSeF:** od 2026 r. faktury dla firm co do zasady wystawia się w Krajowym Systemie e-Faktur. Dla najmniejszych podatników (faktury do ok. 10 000 zł brutto miesięcznie) przewidziano przejściowe zwolnienie do końca 2026 r. Przed wystawieniem pierwszej faktury firmie sprawdź aktualne zasady na ksef.podatki.gov.pl albo u księgowej **[DO POTWIERDZENIA]**. Rachunki dla konsumentów nie idą przez KSeF.

## 4. Podatek dochodowy (PIT)

- Przychód z działalności nierejestrowanej to przychód z tzw. **innych źródeł**. Rozliczasz go **raz w roku w zeznaniu PIT-36**. Za 2026 r. termin mija **30.04.2027**.
- **Nie płacisz zaliczek** w ciągu roku.
- Podatek liczy się według skali: **12%** (powyżej 120 000 zł dochodu: 32%), z kwotą wolną **30 000 zł** liczoną łącznie z Twoimi innymi dochodami opodatkowanymi skalą (np. z umowy o pracę).
- **Dochód = przychód − koszty.** Odliczysz udokumentowane koszty związane ze sprzedażą, np.: prowizje Stripe, hosting i domenę revion.pl, płatny plan MailerLite, Make lub Zapier, narzędzia graficzne. Zbieraj faktury i potwierdzenia płatności w jednym folderze.
- Składek ZUS z tego tytułu nie płacisz.

## 5. VAT

- **Zwolnienie podmiotowe:** do **240 000 zł** sprzedaży rocznie (limit od 2026 r.). Przy limicie działalności nierejestrowanej (ok. 43 tys. zł rocznie) nie zbliżysz się do niego.
- **Sprzedaż konsumentom z innych krajów UE:** ebooki i szablony dostarczane przez internet to dla VAT usługi elektroniczne. Dopóki łączna sprzedaż takich usług konsumentom z innych krajów UE nie przekroczy **10 000 euro rocznie**, rozliczasz ją jak sprzedaż krajową, czyli zwolnioną. Powyżej tego progu VAT należy się w kraju klienta (procedura OSS). Skonsultuj to z księgową, zanim próg będzie blisko.
- **Klienci spoza UE** (np. Wielka Brytania, Norwegia, Szwajcaria, USA): mogą obowiązywać lokalne przepisy o VAT dla usług cyfrowych, czasem bez progu kwotowego. Nie zostało to szczegółowo sprawdzone **[DO POTWIERDZENIA]**.
- **Co zrobić:** sprawdzaj kolumnę „Kraj nabywcy” w ewidencji. Jeśli Twój plan Stripe pozwala na własne reguły Radar, rozważ blokadę kart spoza UE. Strona jest po polsku, więc taka sprzedaż i tak będzie rzadka.

## 6. Kasa fiskalna

Masz dwie drogi do zwolnienia z kasy:

1. **Zwolnienie ze względu na limit:** do **20 000 zł** sprzedaży konsumentom w roku. W pierwszym roku limit liczy się proporcjonalnie do okresu sprzedaży. Jeśli zacząłeś sprzedawać 31.01.2026, limit na 2026 r. wynosi ok. **18 356 zł** (20 000 zł × 335/365). Twój maksymalny roczny przychód (ok. 43 tys. zł) jest wyższy, więc przy dobrej sprzedaży ten limit nie wystarczy.
2. **Zwolnienie ze względu na sposób zapłaty** (rozporządzenie MF z 17.12.2024, Dz.U. 2024 poz. 1902, obowiązuje do 31.12.2027): nie potrzebujesz kasy, jeśli **całą zapłatę** dostajesz przez bank, pocztę lub SKOK **i z ewidencji jednoznacznie wynika, której sprzedaży dotyczy dana wpłata**. Urzędy w interpretacjach uznają za taką zapłatę płatności przez operatorów płatności (np. PayU, karty).

**Co to znaczy dla Revion:** płatności przez Stripe z wypłatą na Twoje konto najpewniej spełniają warunek z pkt 2, pod warunkiem że:

- każda sprzedaż w ewidencji ma numer płatności Stripe;
- przechowujesz raporty Stripe (płatności i wypłaty) i wyciągi z konta;
- nie przyjmujesz zapłaty gotówką ani „do ręki”.

Interpretacji podatkowej dotyczącej wprost Stripe nie znaleziono, więc pewność jest średnia. **Zanim przekroczysz 20 000 zł sprzedaży w roku**, zapytaj doradcę albo wystąp o interpretację indywidualną (opłata 40 zł; interpretacja chroni Cię, jeśli się do niej zastosujesz) **[DO POTWIERDZENIA]**.

## 7. Pozostałe obowiązki

Działalność nierejestrowana musi przestrzegać tych samych przepisów co firma, a Prezes UOKiK może ją kontrolować.

- **Prawo konsumenckie:** regulamin, zgoda w Stripe i e-mail z potwierdzeniem (pliki w tym folderze), odpowiedź na reklamację w 14 dni.
- **Ceny i promocje (Omnibus):** przy każdej obniżce podawaj najniższą cenę z 30 dni przed obniżką. Prowadź **rejestr zmian cen** (data, produkt, cena) i rób zrzuty strony.
- **Opinie:** publikuj tylko prawdziwe, sprawdzone po numerze płatności, i przechowuj dowód (e-mail od klienta i numer płatności).
- **RODO:**
  - zaakceptuj umowy powierzenia (DPA) w panelach Stripe, MailerLite, Make lub Zapier i u hostingodawcy;
  - prowadź prosty rejestr czynności przetwarzania: arkusz z celami z polityki prywatności, rodzajami danych, odbiorcami i okresami przechowywania;
  - przechowuj dowody zgód: eksport z MailerLite, dane sesji Stripe z polem consent i kopie wysłanych potwierdzeń.
- **Rejestr reklamacji i zwrotów:** data wpływu, numer płatności, czego dotyczy, decyzja i data odpowiedzi.

## 8. Kalendarz

| Kiedy | Co |
|---|---|
| **Codziennie** | wpis sprzedaży z poprzedniego dnia do ewidencji i porównanie ze Stripe |
| **Na bieżąco** | rachunek lub faktura, jeśli ktoś poprosi; odpowiedź na reklamację w 14 dni; zwrot w ramach gwarancji w 14 dni |
| **Co miesiąc** | zapis faktur kosztowych; kontrola sumy kwartalnej (alarm przy ok. 8 000 zł) |
| **Po każdym kwartale** | zamknięcie sumy kwartalnej; kontrola sprzedaży za granicę (kolumna „Kraj nabywcy”) |
| **Do 30 kwietnia** | PIT-36 za poprzedni rok (za 2026 r. do 30.04.2027) |
| **Przed reklamami lub wyraźnym wzrostem sprzedaży** | plan przejścia na jednoosobową działalność gospodarczą (JDG) z księgową: forma opodatkowania, ulga na start (6 miesięcy bez składek społecznych, ale ze składką zdrowotną) |

## Źródła

- biznes.gov.pl – działalność nierejestrowana: https://www.biznes.gov.pl/pl/portal/00115
- podatki.gov.pl – działalność nierejestrowana: https://podatki.gov.pl/poradniki-i-informatory/dzialalnosc-nierejestrowana
- pit.pl – zmiany w działalności nierejestrowanej od 2026 r.: https://www.pit.pl/aktualnosci/zmiany-w-dzialalnosci-nierejestrowanej-z-podpisem-prezydenta-nowe-limity-i-zasady-rozliczania-2026-1011566
- pit.pl – działalność nierejestrowana na nowych zasadach w 2026 r.: https://www.pit.pl/aktualnosci/ponad-10-tys-zlotych-bez-zakladania-firmy-dzialalnosc-nierejestrowana-na-nowych-zasadach-w-2026-roku-1011738
- poradnikprzedsiebiorcy.pl – limit działalności nierejestrowanej w 2026 r.: https://poradnikprzedsiebiorcy.pl/-czym-jest-dzialalnosc-nierejestrowana-co-mowi-o-niej-ustawa
- shoper.pl – ewidencja sprzedaży (kolumny): https://www.shoper.pl/learn/artykul/wystartowac-wlasnym-biznesem-bez-firmy
- podatki.biz – limit zwolnienia z VAT 240 tys. zł: https://www.podatki.biz/artykuly/w-przyszlym-roku-limit-zwolnienia-podmiotowego-z-vat-bedzie-wynosil-240-tys-zl_16_59193.htm
- biznes.gov.pl – kasa fiskalna: https://www.biznes.gov.pl/pl/portal/00243
- ifirma.pl – płatność kartą a zwolnienie z kasy: https://www.ifirma.pl/blog/platnosc-karta-platnicza-a-zwolnienie-z-kasy-fiskalnej-zmiany-2025/
- poradnikprzedsiebiorcy.pl – płatność przez PayU a kasa fiskalna: https://poradnikprzedsiebiorcy.pl/-czy-platnosc-przez-payu-zwalnia-z-kasy-fiskalnej
- tax4ecommerce.pl – kasa fiskalna w sklepie internetowym w 2026 r.: https://tax4ecommerce.pl/kasa-fiskalna-w-sklepie-internetowym-kto-musi-ja-miec-w-2026-roku/
- poradnikprzedsiebiorcy.pl – rejestracja do VAT OSS: https://poradnikprzedsiebiorcy.pl/-rejestracja-do-vat-oss-jak-przebiega-i-kiedy-jej-dokonac
- poradnikprzedsiebiorcy.pl – działalność nierejestrowana a KSeF: https://poradnikprzedsiebiorcy.pl/-dzialalnosc-nierejestrowana-w-ksef-korzysci-podatkowe
