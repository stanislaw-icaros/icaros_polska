# ICAROS Polska - Brief: Facebook Ads Funnel
# Przeznaczenie: kontekst dla Claude Code do zbudowania landing page + quiz + lead capture

---

## 1. CO ROBIMY I PO CO

Budujemy lejek reklamowy na Facebooku dla ICAROS Polska - dystrybutora niemieckiego sprzętu rehabilitacyjnego VR na Polskę (B2B). Sprzedajemy placówkom rehabilitacyjnym, fizjoterapeutycznym i senioralnym.

Cel lejka: pozyskanie danych kontaktowych od osób decyzyjnych w placówkach medycznych (właściciele, dyrektorzy, kierownicy) - od "zimnych" (sam email) do "gorących" (telefon + kwalifikacja).

Reklama na Facebooku kieruje na landing page. Na landing page osoba zostawia email i dostaje PDF z raportem. Jednocześnie jest przekierowywana na krótki quiz kwalifikacyjny. Na końcu quizu widzi spersonalizowany wynik finansowy i może zostawić numer telefonu do rozmowy.

---

## 2. CO JUŻ MAMY (zasoby gotowe)

- Strona: icaros.com.pl na Next.js / Vercel (20 USD/mies.)
- Kalkulator ROI: https://www.icaros.com.pl/lp/kalkulator (działający)
- Lead magnet PDF: "Jak technologia VR zmienia rehabilitację w Europie" - 12 stron, zahostowany, link gotowy
- CRM: Pipedrive (plan Growth), formularz na stronie już integruje się z Pipedrive
- Domena: icaros.com.pl
- Subdomena mailowa: mail.icaros.com.pl (SPF + DKIM skonfigurowane)
- Social media: Facebook, LinkedIn, YouTube postawione
- Budżet na reklamy Facebook: ok. 600-650 EUR/mies.
- Kampania cold email w Woodpeckerze: działa równolegle (494 kontakty, region Śląsk)

---

## 3. FLOW LEJKA - KROK PO KROKU

### Krok 1: Reklama na Facebooku
- Reklama z CTA "Pobierz bezpłatny raport"
- Targetowanie: właściciele/dyrektorzy placówek medycznych, fizjoterapeuci, kierownicy klinik rehabilitacyjnych
- Region: woj. śląskie + opolskie (na start, potem rozszerzamy)
- Reklama kieruje na: icaros.com.pl/lp/raport (landing page)

### Krok 2: Landing page z formularzem lead magnet
- URL: icaros.com.pl/lp/raport
- Cel: zebrać email i nazwę placówki w zamian za PDF
- Pola formularza (TYLKO 2, minimum tarcia):
  - Email (wymagane)
  - Nazwa placówki (wymagane)
- Po kliknięciu "Pobierz raport":
  - (a) W tle: wysyłany jest automail z linkiem do PDF na podany adres
  - (b) Na ekranie: natychmiastowe przekierowanie na stronę z quizem (krok 3)
- Dane z formularza lecą do Pipedrive jako nowy lead (leadSource: "Facebook Ads", formSource: "lead-magnet-raport")

### Krok 3: Quiz kwalifikacyjny (strona po formularzu)
- URL: icaros.com.pl/lp/raport/quiz (lub jako widok na tej samej stronie)
- Informacja na górze: "Twój raport jest w drodze na email. W międzyczasie - sprawdź w 30 sekund, jak VR może wyglądać w Twojej placówce."
- Format: 3 pytania, każde to kliknięcie w jeden z 3-4 przycisków (zero pisania)
- Pytania:

**Pytanie 1: "Jaki typ placówki prowadzisz?"**
- Klinika rehabilitacyjna
- Gabinet fizjoterapii
- Centrum senioralne / dom opieki
- Szpital / oddział rehabilitacji

**Pytanie 2: "Ilu pacjentów przyjmujecie dziennie?"**
- 1-5
- 5-15
- 15-30
- 30+

**Pytanie 3: "Czy rozważaliście nowe technologie w terapii?"**
- Tak, aktywnie szukamy
- Interesuje nas, ale jeszcze nie szukaliśmy
- Nie, raczej tradycyjne metody

### Krok 4: Spersonalizowany wynik
- Na podstawie odpowiedzi z quizu wyświetlamy prosty szacunek finansowy
- Logika obliczenia (uproszczona):

  Jeśli placówka ma 5-15 pacjentów/dzień:
  - Szacowany przychód z VR: ok. 4 800 PLN/mies. (3 sesje VR dziennie x 80 PLN x 20 dni)
  - Szacowany zysk po kosztach leasingu: ok. 3 350 PLN/mies.
  - Szacowany roczny zysk: ok. 40 000 PLN

  Jeśli placówka ma 15-30 pacjentów/dzień:
  - Szacowany przychód z VR: ok. 9 000 PLN/mies. (5 sesji VR dziennie x 90 PLN x 20 dni)
  - Szacowany zysk po kosztach leasingu: ok. 4 180 PLN/mies.
  - Szacowany roczny zysk: ok. 50 000 PLN

  Jeśli 1-5 pacjentów/dzień:
  - Szacowany przychód: ok. 3 200 PLN/mies. (2 sesje x 80 PLN x 20 dni)
  - Przekaz: "Nawet przy 2 pacjentach dziennie system się finansuje"

  Jeśli 30+ pacjentów/dzień:
  - Szacowany przychód: ok. 12 000 PLN/mies. (6 sesji x 100 PLN x 20 dni)
  - Przekaz: "Przy Państwa skali zwrot inwestycji może nastąpić już w pierwszym roku"

- Wynik wyświetla się jako czytelna karta z liczbami
- Pod wynikiem: "To szacunek na podstawie danych z polskiego rynku rehabilitacji i doświadczeń klinik w Europie. Rzeczywiste wyniki zależą od specyfiki Twojej placówki."
- Link do pełnego kalkulatora: "Chcesz policzyć dokładniej? Skorzystaj z naszego kalkulatora ROI: www.icaros.com.pl/lp/kalkulator"

### Krok 5: CTA - zostawienie telefonu
- Pod wynikiem quizu:
- Nagłówek: "Chcesz sprawdzić, jak to wyglądałoby w Twojej placówce?"
- Podpis: "Zostaw numer - oddzwonimy i odpowiemy na pytania. Bez zobowiązań."
- Pole: numer telefonu (OPCJONALNE - kto nie chce, nie musi)
- Przycisk: "Poproś o kontakt"
- Jeśli zostawią telefon: dane lecą do Pipedrive z tagiem "hot-lead-quiz" + odpowiedzi z quizu w notatkach
- Jeśli nie zostawią: OK, mamy email z kroku 2 i odpowiedzi z quizu

---

## 4. JAKIE DANE ZBIERAMY I CO Z NIMI ROBIMY

### Poziom 1 - email + firma (wszyscy, krok 2):
- Trafia do: Pipedrive (leadSource: "Facebook Ads")
- Dostaje: PDF na maila (automat)
- Co potem: nurture mailowy (ręczny, raz na 2-4 tygodnie - case study, nowości)
- Custom Audience w Meta do retargetingu

### Poziom 2 - email + firma + odpowiedzi z quizu (ci co przeszli quiz):
- Trafia do: Pipedrive z danymi kwalifikacyjnymi (typ placówki, wielkość, zainteresowanie)
- Co potem: segmentowana komunikacja - inny mail do kliniki rehab, inny do centrum senioralnego
- Priorytetyzacja: kto odpowiedział "aktywnie szukamy" jest cieplejszy niż "raczej tradycyjne metody"

### Poziom 3 - email + firma + quiz + telefon (gorące leady):
- Trafia do: Pipedrive jako lead priorytetowy, tag "hot-lead-quiz"
- Co potem: Sebastian lub Jarosław dzwoni w ciągu 24h
- Pierwsza rozmowa: nie sprzedaż, a pytania o placówkę i propozycja demo na żywo

---

## 5. KREACJE REKLAMOWE - KIERUNEK

Dwa warianty reklam do testowania (A/B):

### Wariant A - "Biznes i ROI":
- Kąt: Twoja placówka może zarabiać X tysięcy więcej miesięcznie
- Przekaz: system VR do rehabilitacji jako inwestycja, która się zwraca
- CTA: "Pobierz raport z danymi finansowymi"
- Ton: rzeczowy, biznesowy, liczby

### Wariant B - "Innowacja i wyróżnik":
- Kąt: Wyróżnij swoją placówkę technologią, którą stosuje 100+ klinik w Europie
- Przekaz: pacjenci ćwiczą przez gry VR, podwójna aktywacja mięśni vs tradycyjne ćwiczenia
- CTA: "Pobierz raport z badaniami klinicznymi"
- Ton: inspirujący, innowacyjny, jakość

Oba warianty kierują na TEN SAM landing page (icaros.com.pl/lp/raport).

Budżet: 15-20 EUR/dzień, split 50/50 między warianty. Po tygodniu wyłączamy gorszy.

---

## 6. KONTEKST REGULACYJNY

- ICAROS Health i Guardian to certyfikowane wyroby medyczne klasy I (MDR)
- Reklamy NIE mogą być ściśle medyczne - używamy kąta biznesowego i innowacyjnego
- Na stronie jest bramka "jestem profesjonalistą" (już istnieje)
- W formularzu jest NIP/nazwa placówki jako naturalny filtr B2B
- Opt-out / RODO: zgoda na przetwarzanie danych przy formularzu

---

## 7. INFORMACJE O PRODUKCIE (do użycia w landing page i quizie)

- ICAROS Circle (pełny system 4 urządzeń): 212 000 PLN lub leasing 4 820 PLN/mies.
- ICAROS Health: 106 000 PLN lub 2 410 PLN/mies. - rehabilitacja neurologiczna/ortopedyczna
- ICAROS Guardian: 63 500 PLN lub 1 444 PLN/mies. - prewencja upadków, seniorzy
- Leasing: 48 rat, 10% wpłaty, 1% wykupu, przez EFL
- Demo/trial: montaż w placówce na 2 tygodnie za ok. 800-1000 PLN (odliczane od zakupu)
- Stosowany w 100+ klinikach w Europie
- 9 badań klinicznych, w tym z Politechniki Monachijskiej
- Podwójna aktywacja mięśni vs tradycyjne ćwiczenia (badanie TU Monachium)

---

## 8. STACK TECHNICZNY

- Frontend: Next.js (App Router) na Vercel
- Formularz: integracja z Pipedrive API (już działa na stronie głównej - wzorzec do powtórzenia)
- Automail z PDF: do rozwiązania - opcje: Pipedrive automation, prosty endpoint API z nodemailerem, lub webhook do zewnętrznego toola
- Quiz: frontend-only (React state), wyniki na podstawie odpowiedzi, bez backendu
- Tracking: Meta Pixel (do ustawienia), UTM parameters w URL-ach

---

## 9. STYL I TON

- Profesjonalny ale ludzki, nie korporacyjny
- Nie używać em dashes (-) - zawsze zwykłe myślniki (-) lub przeformatować zdanie
- Nie używać żargonu sprzedażowego ("door opener", "punkt wejścia")
- Nie pisać "prezentacja online" - nie mamy tego sformalizowanego
- Ceny polskie w PLN (nie z niemieckich materiałów)
- Wszystko brzmi jakby pisał człowiek, nie szablon marketingowy
