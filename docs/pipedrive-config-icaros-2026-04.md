# ICAROS Polska - Kompletna konfiguracja Pipedrive
### Dokumentacja implementacji CRM · Wersja 1.0 · Kwiecien 2026

> Zapis roboczy dokumentacji przekazanej przez wlasciciela projektu.
> Ta kopia sluzy jako stale zrodlo referencyjne dla konfiguracji CRM.

---

## Spis tresci

1. Zanim zaczniesz
2. Plan konta i koszty
3. Sekwencja implementacji
4. Pipeline i etapy sprzedazy
5. Pola niestandardowe (custom fields)
6. Typy aktywnosci
7. Automatyzacje
8. Integracja Next.js -> Pipedrive
9. Integracja Woodpecker -> Pipedrive
10. Integracja Meta Ads -> Pipedrive
11. Sledzenie UTM i zrodel leadow
12. Leasing PKO - workflow
13. Dashboardy i raportowanie
14. Formularz na stronie - zmiany
15. Tagi i konwencje nazewnictwa
16. Dla developera - specyfikacja API

---

## 1) Zanim zaczniesz

- Pipedrive nie ma importu pelnego szablonu CRM (pipeline + pola + automatyzacje).
- Kolejnosc: najpierw pola custom, potem integracje.
- Na start konieczne:
  - pipeline z etapami
  - pola custom (Lead Source + UTM)
  - integracja Woodpecker
  - formularz strony -> Pipedrive
  - podstawowe follow-up automatyzacje

## 2) Plan konta

Rekomendowany plan: **Growth**.

## 3) Sekwencja implementacji

### Faza 1: Konto
- Ustawienia: EUR, Europe/Warsaw, DD/MM/YYYY.
- Dodaj uzytkownikow.
- Usun lub wyczysc domyslny pipeline.

### Faza 2: Pipeline
- Nazwa: `ICAROS Sprzedaz Polska`
- Etapy:
  1. Nowy Lead / Zapytanie
  2. Zakwalifikowany (BANT)
  3. Demo umowione
  4. Trial sprzetu
  5. Oferta wyslana
  6. Wniosek leasingowy
  7. Negocjacje / Umowa
  8. Zamkniety - Wygrana

### Faza 3: Pola niestandardowe

#### Grupa 1 - Tracking i zrodlo
- Zrodlo leadu (enum): Formularz WWW, Woodpecker, Meta Ads, Targi/Event, LinkedIn, Telefon/Polecenie
- UTM Source (text)
- UTM Medium (text)
- UTM Campaign (text)
- UTM Content (text)
- Strona zrodlowa (text)

#### Grupa 2 - Placowka
- Typ placowki (enum): Klinika rehabilitacyjna, Centrum fizjoterapii, Centrum seniora, Obiekt wellness/spa, Klub sportowy, Szpital, Uczelnia, Hotel
- Wojewodztwo (enum): Mazowieckie, Malopolskie, Slaskie, Wielkopolskie, Dolnoslaskie, Pomorskie, Lodzkie, Kujawsko-Pomorskie, Lubelskie, Podkarpackie, Inne
- Liczba gabinetow (number)
- Szacowane przychody (enum): <500K PLN, 500K-2M PLN, 2-5M PLN, >5M PLN, Nieznane

#### Grupa 3 - Produkt i decyzja
- Model ICAROS (enum): Health, Guardian, Cloud, Circle (pakiet), Inne/Custom
- Rola decydenta (enum): Wlasciciel/Dyrektor, Dyrektor Medyczny, Kierownik Rehabilitacji, Zamowienia/Przetarg, CFO/Finanse
- Status budzetu (enum): Potwierdzony, Czeka na akceptacje, Szuka finansowania, Brak budzetu, Nieznany
- Oczekiwana data dostawy (date)

#### Grupa 4 - Finansowanie i leasing
- Zrodlo finansowania (enum): Srodki wlasne, Leasing PKO, Kredyt bankowy, Dotacja UE, NFZ, Mieszane, Do ustalenia
- Status leasingu (enum): Nie dotyczy, Wniosek przygotowany, Zlozony, W trakcie oceny, Zatwierdzony, Odrzucony, Ponownie zlozony
- Okres leasingu (mies.) (number)
- Rata miesieczna (PLN) (monetary)
- Numer wniosku PKO (text)

#### Grupa 5 - Konkurencja
- Status konkurencji (enum): Brak konkurencji, Oceniaja alternatywy, Oferta konkurencyjna, Preferujemy my
- Obecna technologia (text)
- Powod przegranej (enum): Budzet, Wybrali konkurencje, Brak decyzji/timing, Polityka wewnetrzna, Utrata kontaktu, Wybrali inne rozwiazanie

### Faza 4: Typy aktywnosci
- Demo ICAROS
- Wizyta w placowce
- Trial sprzetu
- Oferta wyslana
- Wniosek leasingowy
- Negocjacje umowy
- Wizyta referencyjna
- Szkolenie
- Dostawa/Instalacja

### Faza 5: Produkty
- ICAROS Health (24 900 EUR), ICR-HEALTH
- ICAROS Guardian (do uzupelnienia), ICR-GUARD
- ICAROS Cloud (do uzupelnienia), ICR-CLOUD
- ICAROS Circle (49 900 EUR), ICR-CIRCLE

### Faza 6: Automatyzacje
1. Nowy deal -> follow-up telefon + email
2. Etap Demo umowione -> aktywnosc Demo ICAROS za 3 dni
3. Etap Oferta wyslana -> follow-up po 5 dniach + expected close +30 dni
4. Etap Wniosek leasingowy -> aktywnosc leasing + telefon kontrolny za 7 dni
5. Deal wygrany -> Dostawa/Instalacja + Szkolenie + mail do zespolu
6. Brak aktywnosci X dni -> alert mailowy do wlasciciela

## 4) Pipeline - kryteria wyjscia etapow

- Nowy Lead -> Zakwalifikowany: rozmowa kwalifikacyjna + budzet/decydent
- Zakwalifikowany -> Demo: potwierdzony termin demonstracji
- Demo -> Trial: decyzja o tescie
- Trial -> Oferta: trial pozytywny
- Oferta -> Wniosek leasingowy: klient wybiera leasing
- Wniosek -> Negocjacje: finansowanie potwierdzone lub gotowka
- Negocjacje -> Zamkniety: umowa podpisana

## 5) Pola niestandardowe - uwagi developerskie

- Po utworzeniu kazdego pola zapisz `key` (hash key) z API.
- Klucze sa wymagane do mapowania custom fields w API dla deali.

## 6) Typy aktywnosci - konwencja tytulow

`[Typ] - [Nazwa placowki] - [Dodatkowy kontekst]`

## 7) Automatyzacje - uwagi

- Bazowa konfiguracja: ok. 8 automatyzacji.
- Deal utworzony przez API uruchamia automatyzacje.

## 8) Integracja Next.js -> Pipedrive

- Token tylko po stronie serwera (route handler), nigdy w kliencie.
- Wymagane env:
  - `PIPEDRIVE_API_TOKEN`
  - `PIPEDRIVE_COMPANY_DOMAIN`
  - `PIPEDRIVE_PIPELINE_ID`
  - `PIPEDRIVE_STAGE_ID_NEW_LEAD`
  - hash keys pol custom
- Formularz wysyla: dane kontaktu, UTM, page, leadSource.

## 9) Integracja Woodpecker

- Natywna integracja OAuth.
- Two-way sync.
- Akcja: `Interested` -> utworz deal w `Zakwalifikowany (BANT)`.

## 10) Integracja Meta Ads

- Rekomendacja: Make.com lub Outfunnel.
- Mapowanie leadow Meta -> Person/Deal/Note + notyfikacje.

## 11) UTM

Konwencje:
- `utm_source`: facebook | instagram | google | linkedin | woodpecker | direct
- `utm_medium`: paid_social | cpc | email | organic | referral
- `utm_campaign`: `icaros_[segment]_[opis]_[miesiac][rok]`
- `utm_content`: `[typ]_[opis]`

## 12) Leasing PKO - workflow

- Etap `Wniosek leasingowy` gdy klient wybral leasing.
- Uzupelniane pola: status leasingu, okres, rata, numer wniosku, zrodlo finansowania.

## 13) Dashboardy

1. Sprzedaz: funnel, weighted value, wygrane.
2. Aktywnosc handlowcow: aktywnosci i alarmy bez aktywnosci.
3. Marketing: lead source, konwersje, czas etapow.

## 14) Formularz strony

Aktualne pola: imie i nazwisko, firma, NIP, email, telefon, rola, wiadomosc.

Dodatkowo:
- hidden `lead_source=Formularz WWW`
- hidden `page`
- UTM wstrzykiwane JS
- strona podziekowania `/dziekujemy` + pixel retargeting Meta

## 15) Konwencje nazewnictwa

- Deal: `ICAROS - [Nazwa placowki]`
- Notatki: blok STAN / ZAINTERESOWANIE / NASTEPNY KROK / BUDZET / DECYDENT / TERMIN
- Labels: Goracy lead, Obserwuj, Czeka na leasing, Zagrozony, Cold

## 16) Specyfikacja API (dla developera)

Przykladowe endpointy:
- GET `/api/v1/persons/search`
- GET `/api/v1/organizations/search`
- POST `/api/v1/persons`
- POST `/api/v1/organizations`
- POST `/api/v1/deals`
- PATCH `/api/v1/deals/{id}`
- POST `/api/v1/notes`
- POST `/api/v1/activities`
- GET `/api/v2/dealFields`
- POST `/api/v1/webhooks`

Rate limiting:
- 80 requestow / 2 sekundy / token

---

## Zakres prac na teraz

W tej iteracji wdrazamy:
1. Pola niestandardowe deali.
2. Workflow/automatyzacje (w zakresie dostepnym technicznie i przez dostep API/UI).

