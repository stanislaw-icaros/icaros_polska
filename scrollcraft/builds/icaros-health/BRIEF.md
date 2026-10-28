# ICAROS Health — landing

**Self-authored under explicit creative delegation.** Stanisław asked for "absolutny top
designerski", named one reference (puture.co.kr), handed over the promo film as the style
anchor, and said to decide the rest. Answers below are authored decisions unless quoted.

---

## 1. Vibe, and references

Quoted: "super premium", "zwala z nóg", "bajerancki efekt, ale nie aż taki chamski, że on
potem będzie ciężki i taki trudny do scrollowania".

Reference given: puture.co.kr. What was taken from it: a persistent world behind the content,
a camera the scroll drives, and a ground that changes state as you travel. What was **not**
taken: its chapter numbers, its eyebrow labels, its glass cards, its gradients.

The real art direction came from the client's own film (`ICAROS - PROMO.mov`, 59s): near-black
ground, warm orange rim light on white machinery, one accent (#ff6600) carrying the key words,
alpine horizon at dawn. Tagline on its endcard: "Więcej niż terapia."

## 2. The scroll journey

Quoted: "Sam początek ma po prostu pokazywać niektóre elementy (…) że coś się dzieje",
"potem jest jakaś możliwość kliknięcia na przykład i rozszerzona rzeczywistość, ten VR się
robi", "ten filmik potem dorzucimy", "na końcu (…) jakiś odnośnik do kalendarza".

Authored sequence: dark open → the honest problem → how the machine works → **the handover** →
the evidence → Walter → the film → the facts → the booking.

## 3. The energy curve

Quiet and dark at the top. One loud act in the middle. Then steadily quieter and more factual,
and a close that stops rather than fades.

## 4. The feeling curve

| Act | Feeling | What on screen causes it |
|---|---|---|
| 1 Horyzont | Curiosity | A woman prone on a white machine in a black room. As you scroll, the room fills in with the Alps around her. She has not moved. |
| 2 Pięć minut | Recognition | Real clinic footage, and a plain sentence about what core rehab actually is: lying on a mat counting to thirty. |
| 3 Ciało jest sterem | Clarity | The point-cloud body from the film, three labels arriving on it one at a time. |
| 4 **Weź ster** (PEAK) | Agency, then awe | Everything stops. The page hands over the control it has been driving itself. The visitor drags, and the world comes in under their own hand. |
| 5 Co z tego wychodzi | Trust | Three real numbers with their papers named. |
| 6 Walter | Intimacy | One man, one long paragraph, no quotation marks. |
| 7 Film | Appetite | The full film, opened from a still of itself. |
| 8 Fakty | Confidence | Class I, Germany, 124 kg, 140–200 cm. Answers set as reading text. |
| 9 Lądowanie | Resolve | The handle runs to the edge and stops. Only the world is left. One button. |

**Authored silence:** the last screen of act 3 holds with almost nothing on it. That is
deliberate, so act 4 has something to be a change from. It is not dead scroll.

## 5. The peak

> "Przeciągnąłem palcem i sala zniknęła, a ona dalej leżała na tym samym sprzęcie, tylko już
> nad Alpami."

Act 4. It gets the client's own footage, the longest scroll span on the page, and the empty
screen in front of it.

## 6. Tell-someone sentence

> It's the site where you drag a line across a woman on a rehab machine and the dark room fills
> in with the Alps around her, and the whole page changes with it.

## 7. One unbroken world, or distinct scenes

Neither of the eight listed grammars fit, so a ninth is authored: **two-state page**.

- **Navigation** — the horizon handle. A persistent vertical control, no top bar. It carries
  both state names (Sala / Lot), the page's progress, and the single action.
- **Sequence** — every act declares where it sits on the Sala↔Lot axis. The handle animates to
  that position as you scroll. From act 4 on, the visitor may override it at any time.
- **Ending** — the handle runs to the far edge and stops there. The world is all that is left.
  The CTA is the only object in it.
- **Bans** — no top navigation bar; no act without a position on the two-world axis; no card
  grids; no second persistent control; no scroll cue; no device family twice in a row.

**Signature move:** the horizon handle. One control, present the whole page, that scrubs the
client's own footage *and* regrades every ground, ink, caption and number on the page between
the clinic state and the flight state. Not an image comparison slider: the two images are one
continuous shot, and the control owns the page, not a picture.

## 8. Assets

Owned, and used first: `ICAROS - PROMO.mov` (11 stills + one 3.8s scrub clip), the existing
product photography in `/public`.

Generated (Higgsfield `gpt_image_2_5`, 7 plates, ~1.75 credits): alpine landscape plates for the
flight sections. Used as landscape, never captioned as a screenshot from the software.

Not used: the Medical Expo phone photos (quality), the Drive media folders (nothing above what
the film gives).

## 9. Score table

| Act | Device | Why this one |
|---|---|---|
| 1 Horyzont | `scrub` (the only one) | The world arriving under the reader's own scroll is the strongest possible open, and the footage already does it |
| 2 Pięć minut | `flow` + `in` | Plain, honest, fast. A held shot here would flatter a problem that should not be flattered |
| 3 Ciało jest sterem | `reveal` + `pin` | The labels are a sequence, so they need a frame that holds still |
| 4 Weź ster | pointer, page-driven | The peak is the handover, so the device has to be the visitor's own hand |
| 5 Co z tego wychodzi | `count` | Real figures, counted, because they are checkable |
| 6 Walter | `in`, long measure | A letter wants no device at all |
| 7 Film | `reveal` to full bleed | The one act that breaks the two-column frame |
| 8 Fakty | `flow`, short stagger | Administrative. Compress it |
| 9 Lądowanie | handle travel | The close is the signature move resolving |

Checks: 9 acts, 6 device families, no family twice in a row, one `scrub`, the peak has the
largest span, no two adjacent acts share a feeling.

## 10. Fingerprint gate

Registry empty (first build in this workspace). Nothing to clear.

---

## 11. Przebudowa po pierwszej recenzji (2026-10-27)

Zarzut właściciela był słuszny: pierwsza wersja była przepisanym filmem. Ten sam
bohater, ten sam cytat, te same liczby, nic ponadto. „Weź ster" pokazywał
funkcję, a nie sens. Sekcja o mechanice była czarnym tłem z kilkoma napisami.
Dane i pytania wyglądały jak zrzut taniego PDF-a.

Co się zmieniło:

- **Źródła.** Treść idzie teraz z katalogu ICAROS 2026 (wersja polska),
  z opracowania badań w `src/lib/studies.ts` i z icaros.com. Film jest jednym ze
  źródeł, nie kanwą. Bohaterką strony jest Sandra z katalogu, nie Walter z filmu.
- **Poprawka rzeczowa.** Wynik „+41% siły nóg u seniorów" dotyczy ICAROS
  Guardian, nie Healtha. W pierwszej wersji stał wśród liczb Healtha. Teraz stoi
  przy Circle, z publikacją Massing i wsp.
- **Nowe sekcje:** przebieg sesji (cztery etapy, przełączane, ze zmiennymi
  parametrami), budowa urządzenia (render producenta z przygaszaniem wszystkiego
  poza wybranym elementem), trasy i gry (oficjalne nazwy doświadczeń),
  zaangażowanie pacjentów (cztery wyniki plus dwa cytaty badaczy), ICAROS Circle.
- **Sens zamiast sztuczki.** Suwak horyzontu nie jest już wolnostojącą zabawką:
  po obu jego stronach stoi opis tego samego momentu sesji, więc przesuwanie
  pokazuje odpowiedniość między pracą ciała a obrazem w goglach.
- **Rejestr.** Nagłówki nazywają temat zwykłymi słowami („Efekty treningu",
  „Przebieg sesji", „Kontakt”), bez marketingowej poezji. Odbiorcą są
  przedstawiciele placówek medycznych, więc forma jest bezosobowa o nich
  i pierwszoosobowa o nas.
- **Film.** Duży, wyśrodkowany przycisk zamiast małego w rogu, stan ładowania do
  momentu gotowości odtwarzacza, podpowiedź jakości.
- **Dane i pytania.** Odpowiedzi chowają się w elementach `<details>`, dane
  stoją z powietrzem.
- **Zamknięcie.** Nowa treść o rozmowie i ustaleniu potrzeb placówki, krótsza
  sekcja, bez pustej czerni po ostatnim ekranie.

Wygenerowano 10 własnych scen (gpt_image_2_5, ok. 2,5 kredytu): siedem tras
z katalogu doświadczeń plus DEEP, GRAVITY i FLIGHT.

Długość strony wzrosła do około 16,6 wysokości ekranu, czyli ponad budżet
8 do 14 z SKILL.md. To świadoma decyzja: właściciel poprosił o więcej treści,
a to jest strona z informacją, nie sama scrollowana opowieść.

---

## 12. Druga runda poprawek (2026-10-27, wieczór)

Zarzuty właściciela: biało-czarna przeplatanka wygląda tanio, czarny ekran
prawie nigdy nie powinien się pojawiać, budowa urządzenia ma być prowadzona
scrollem jak na dobrych stronach produktowych, a kadry urządzenia mamy
generować sami, bo „wszystko, co tam mamy, jest wygenerowane".

- **Całość na ciemno.** Nie ma już sekcji na papierze. Zostały trzy tony tła
  (#07070a, #0b0c11, #13151c), każda sekcja dostaje własne, bardzo delikatne
  światło w jednym z czterech miejsc, a styki sekcji są wygaszane, więc różnica
  tonów nie czyta się jako pozioma kreska.
- **Budowa urządzenia.** Sekcja na trzy ekrany, przyklejona, pięć wygenerowanych
  ujęć tego samego urządzenia przenika się jedno w drugie. Każde ujęcie
  przejeżdża przez kadr własnym tempem, więc zmiana czyta się jako jazda kamery,
  a nie jako dwa zdjęcia nałożone na siebie. Światło sceny wędruje razem z nią.
  Okna przenikania są dobrane tak, że jedno ujęcie gasze dokładnie w tempie,
  w jakim wschodzi następne (2 × plateau + przenikanie = rozstaw środków).
- **Urządzenia Circle.** Cztery katalogowe zdjęcia na bieli zostały przeświecone
  na czerń z tym samym światłem co reszta strony (Higgsfield, nano_banana_2,
  z oryginalnym zdjęciem jako referencją). I.S.T. Board wymagał drugiego
  podejścia, bo pierwsze zgubiło sens sceny.
- **Suwak i znak firmowy.** Leżą raz na czerni, raz na jasnym alpejskim kadrze.
  Zamiast cienia pod literami jest neutralny scrim przy lewej krawędzi.
- **Cytat pacjentki** zszedł do 36 px i stracił etykietę „Opinia pacjentki"
  (została w strukturze jako `sr-only`).

### Świadome odstępstwa od inspektora

Po poprawkach `inspect.mjs` zostawia dwa FAIL-e i obydwa są zamierzone:

1. `gradient` — siedem radialnych świateł sekcji. To jest dokładnie to, o co
   prosił właściciel: „czarny ekran prawie nigdy nie powinien mieć miejsca,
   może jakiś gradient światła". Flat colour wraca do tego, co odrzucił.
2. `covered-text` — inspektor otwiera stronę w świeżej przeglądarce, więc brama
   zgody na cookies jest podniesiona, a jej zasłona (`fixed inset-0`) przykrywa
   każdy duży nagłówek. Po wyborze zgody zasłony nie ma. To zachowanie bramy,
   nie wada układu.

WARN-y zostawione świadomie: `long-pin` i `pinned-over-picture` przy Budowie
(sekcja ma trzy ekrany, bo pokazuje pięć ujęć, a tytuł stoi w kolumnie, w której
nie ma zdjęcia), `blank-gap` tam, gdzie ekran wypełnia warstwa `fixed` i DOM
tego nie widzi.

### Czego nie dało się sprawdzić automatem

Ruch sterowany scrollem (scena horyzontu, Budowa, przełącznik Sala/Lot,
zamknięcie) chodzi na `requestAnimationFrame`, a w ukrytym panelu przeglądarki
ta pętla stoi. Sprawdzone zostało to, co widzi `inspect.mjs` we własnej, realnej
przeglądarce i co widać na jego zrzutach. Płynność przewijania na żywo i brak
migania na końcu strony zostają do obejrzenia na oczy.

---

## 13. Trzecia runda, uwagi z przeglądu (2026-10-27, noc)

- **Budowa urządzenia.** Same ujęcia z różnych stron nie wystarczały: nie było
  widać, o którym elemencie mowa. Teraz całe urządzenie jest przygaszone,
  opisywany element świeci pełnym światłem (druga kopia kadru wycięta owalem
  w jego miejscu), obrysowuje go obrączka, a od niej biegnie linia w stronę
  opisu. Współrzędne każdego elementu siedzą w `tresc.ts` przy jego ujęciu,
  a kadr trzyma proporcję zdjęć, więc trafiają co do miejsca.
- **Kadr bez prostokąta.** Zdjęcia mają czyste czarne tło, które odcinało się
  od sekcji. Warstwy idą teraz w trybie `screen` na tle w kolorze sekcji, więc
  czerń znika bez śladu i urządzenie leży wprost na stronie. Mieszanie musi być
  na warstwie, nie na samym `img`: każda warstwa ma własne krycie, czyli własny
  kontekst, i obraz mieszałby się sam ze sobą.
- **Porównanie z matą.** Trzy kolumny miały trzy role i wyglądały identycznie.
  Cecha zeszła do rozmiaru podpisu, mata została zwykłym tekstem, a ICAROS
  dostał własną, jaśniejszą płytę ciągnącą się przez całe zestawienie.
- **Wynik Guardiana.** Zamiast liczby wielkości nagłówka i niezwiązanych z nią
  programów obok: najpierw samo `+41%` przez pół ekranu, odliczające przy
  wejściu w kadr, pod nim zdanie, a przypis mały z boku. Programy zeszły niżej
  i dostały paski długości sesji, więc widać je bez czytania minut.
- **Opinia pacjentki.** Była czarną pustką z trzema wierszami tekstu. Teraz
  cytat leży na pełnym kadrze trasy, nad którą pacjent lata podczas sesji.
- **Dane techniczne wypadły.** Przy tej rozmowie nic nie wnosiły. Pytania
  dostały całą sekcję: nagłówek w osobnej kolumnie, duże wiersze, powietrze.
  Została jedna linijka, która dla placówki ma znaczenie: klasa I, Niemcy.
- **Panel terapeuty.** Zdjęcie tabletu z filmu, robione pod kątem na jasnym
  blacie, zastąpił zbudowany na stronie widok aplikacji. Liczby są z materiałów
  producenta i tak jest podpisany. Jeden kafelek z sumą wypadł, bo zapis
  „1d 21s" z filmu nie daje się uczciwie odczytać.
- **Kadry sesji.** Wejście i Kalibracja brały wcześniej plakaty w proporcji
  2.39:1, skalowane w górę i przycinane do 16:10, stąd miękkość. Teraz są to
  wycinki 1286 × 804 prosto z filmu, bez powiększania.
- **Kafelki Circle** straciły etykiety pozycji („Na siedząco", „W podporze"),
  bo dokładały tekstu i zaśmiecały układ.

Inspektor zostawia te same dwa świadome odstępstwa co w rundzie poprzedniej
(światła sekcji i zasłona bramy zgody przy świeżym otwarciu strony). Doszedł
`blank-gap` wskazujący na sekcję Circle: zrzuty pokazują ją wypełnioną, więc
to artefakt sondy, która trafia w moment przed odsłonięciem treści.

Do oglądania sekcji powstał własny skrypt na tej samej przeglądarce co
inspektor, bo panel przeglądarki w aplikacji nie maluje warstw rastrowych.

---

## 14. Czwarta runda: przestrzeń, sterowanie, język (2026-10-28)

### Sterowanie

Pomarańczowy tor z suwakiem zniknął. Wyglądał jak nawigacja, a przy
przełączniku Sala/Lot napisy wyglądały jak przyciski, którymi nie były:
kliknięcie przesuwało linię zamiast przełączyć widok. Teraz sceną steruje samo
przewijanie, a tam, gdzie da się wybrać widok, stoją zwykłe przyciski
(`Przelacznik` w `czesci.tsx`). Po znaku firmowym w rogu został sam znak,
w nowym `Znak.tsx`; na telefonie odjeżdża razem z hero, bo tam nie ma lewego
marginesu i wchodziłby na nagłówki sekcji.

Doszła `Podpowiedz`: wokół grupy przycisków pulsuje ledwie widoczna pomarańczowa
poświata i gaśnie na dobre po pierwszym kliknięciu. Bez niej nikt przewijający
stronę nie zauważał, że etapy sesji i trasy da się przeklikać. Poświata jest
płaskim kolorem o zmiennym kryciu, nie cieniem i nie gradientem.

### Przestrzeń

Sekcje, w których tłoczyło się za dużo naraz, rozeszły się na osobne:

- **Zaangażowanie pacjentów** trzymało dwa cytaty badaczy i cztery liczby
  w jednym rzędzie. Cytaty wyprowadziły się do nowej sekcji **Opinie badaczy**,
  liczby dostały po własnym wierszu.
- **Dane techniczne** wypadły już wcześniej; **Pytania** stoją teraz w dwóch
  kolumnach i wypełniają szerokość.
- Każdy wynik idzie przez wspólny komponent `Wynik`: wielka liczba odliczająca
  przy wejściu w ekran (`Licznik`), obok jedno zdanie, a źródło schowane pod
  znacznikiem `i` (`Zrodlo`), który pokazuje przypis po najechaniu albo
  dotknięciu. Szary przypis przy każdym wierszu zabierał miejsce, a czytał go
  co setny czytelnik.

Strona urosła do około 21 wysokości ekranu. To świadoma decyzja: właściciel
poprosił o dłuższą stronę z powietrzem zamiast gęstej.

### Język

Hero nie zaczyna się już od hasła. Ktoś trafia tu z reklamy i chce najpierw
wiedzieć, co ogląda, więc jest nazwa, pod nią jedno zdanie czym to jest,
a dopiero potem reszta: „ICAROS Health / Nowoczesne technologie VR
w rehabilitacji / Wyrób medyczny klasy I do treningu stabilności tułowia
i równowagi". Tytuł i opis strony poszły za nagłówkiem.

### Cytaty i drobne

Cytaty mają teraz wspólny komponent `Cytat` z rysowanym znakiem cudzysłowu.
Znak jest rysowany, nie literą: polski „ siada przy linii pisma i nad cytatem
wygląda, jakby zsunął się z miejsca. Kafelki Circle reagują na najechanie:
kadr się rozjaśnia, nazwa przechodzi na akcent.

Inspektor zostawia te same dwa świadome odstępstwa co wcześniej: światła sekcji
i zasłonę bramy zgody przy świeżym otwarciu strony.

---

## 15. Piąta runda (2026-10-28)

### Sekcja porównania, trzecie podejście

Zestawienie „z matą" stawiało urządzenie za sto tysięcy obok maty za kilkanaście
złotych i brzmiało dziwnie, a pierwszy ekran po hero nie może budzić takiego
pytania. Punktem odniesienia jest teraz samo ćwiczenie: podpór na
przedramionach, czyli standardowy sposób trenowania stabilności tułowia bez
sprzętu. Nagłówek nazywa temat wprost: „Co zmienia trening na ICAROS". Doszły
wiersze o doborze trudności i o powrotach na kolejne sesje, więc zestawienie
mówi o skuteczności i adherencji, a nie o sprzęcie.

Kolumny przestały wyglądać tak samo. Nazwa cechy jest małym podpisem poza
płytami, a obie zestawiane strony leżą na własnych płytach: ciemniejszej dla
treningu bez sprzętu, jaśniejszej dla ICAROS. Źródła poszły pod znacznik `i`.

### Kadry przebiegu sesji

Wejście, Kalibracja i Trening brały wcześniej klatki z filmu. Wejście miało
na sobie dym z ujęcia filmowego, który na stronie nie znaczył nic, a Kalibracja
i Trening były zupełnie innymi ujęciami, więc przełączanie zakładek przesuwało
cały kadr zamiast pokazać, że to ten sam moment w dwóch światach.

Teraz wszystkie trzy są generowane (Higgsfield, nano_banana_2, 2k):

- Wejście: czysty kadr urządzenia na czerni, ze stopniami wejściowymi, bez dymu.
- Trening: pacjentka na urządzeniu nad alpejską doliną.
- Kalibracja: ten sam kadr, wygenerowany z poprzedniego przez podmianę
  otoczenia na ciemną salę.

Dzięki temu, że Kalibracja powstała z Treningu, a nie obok niego, obie klatki
mają tę samą pozycję kamery i tę samą skalę. Wycinek 16:10 jest dla obu
identyczny. Przełączenie zakładki czyta się jako zmiana świata, nie przeskok
kadru.

### Drobne

- Budowa urządzenia straciła obrączkę. Element jest już podświetlony, a kółko
  tylko dokładało kreski; została sama linia, która działa jak strzałka.
- „Kurs trzyma przechyłem tułowia" zmienione na „Kierunek nadaje praca tułowia".
- Zapowiedź filmu zamiast opisu zawartości mówi wprost: „Wolisz oglądać?
  Zobacz, jak wygląda ICAROS na filmie".
- Znak firmowy z lewego górnego rogu zniknął na życzenie właściciela.
  Powrót na stronę główną zostaje w stopce.
- Przypis o materiałach obejmuje teraz także ujęcia sesji.

### Poprawka sterowania po kliknięciu (2026-10-28)

Po kliknięciu Sala albo Lot scena trzymała wybór tak długo, jak sekcja była
w kadrze, czyli przez dwa ekrany przewijania nic się nie działo i wyglądało to
na zacięcie. Zostało po przeciąganiu, przy którym scroll nie mógł walczyć
z ręką. Przy przyciskach pierwsze przewinięcie (ponad 60 px) odbiera
sterowanie z powrotem, a animacja przejścia jest wtedy zatrzymywana, żeby obie
strony nie pisały po tej samej wartości. Strefa sekcji przestała być do czegoś
potrzebna i wypadła z kontekstu sceny.

### Jakość tła sceny (2026-10-28)

Tło hero to przewijane wideo: scroll ustawia `currentTime` klipu, a sprężyna
wygładza skok kółka. Klip był jednak przeskalowany w górę z natywnych
1920 × 804 do 2580 × 1080, więc bitrate szedł na zmyślone piksele, a w cieniach
sypały się kwadraty.

Przekodowany prosto z filmu (segment 12,0 do 15,8 s) w natywnej rozdzielczości,
CRF 19, `tune film`, `aq-mode=3` dla ciemnych przejść, gęsty GOP (`-g 8`)
zachowany, bo od niego zależy płynność przewijania. Telefon dostał natywny
kadr pionowy 602 × 804 zamiast rozciągniętego 752 × 1004.

Koszt: komputer 3,6 → 5,7 MB, telefon 0,95 → 1,17 MB. Plakat `poster-sala`
podniesiony z 50 do 101 kB, bo to on jest pierwszą klatką przed wczytaniem
wideo.

---

## 16. Strona staje się ofertą Circle (2026-10-28)

Adres `/health` zmienił się na `/oferta`, ze stałym przekierowaniem w
`next.config.ts` i wpisem w mapie strony. Katalog komponentów i plików
publicznych zostaje pod nazwą `health`, bo to nazwa wewnętrzna, nie adres.

Ramą całej strony jest teraz ICAROS Circle, czyli system czterech urządzeń.
Treść zostaje taka jak była, bo chodzi głównie o Healtha, ale hero i tytuł
mówią, czym jest całość, a Health jest w nich nazwany jako jedno z czterech
urządzeń. Bez tego zdanie o wyrobie klasy I do treningu w podporze byłoby
nieprawdą wobec Guardiana i Clouda, które działają na stojąco.

Sekcja na dole nazywa się teraz „Cztery urządzenia systemu", żeby nie
powtarzać nagłówka hero. Każdy kafelek jest przyciskiem: kliknięcie otwiera
okno ze skrótem o urządzeniu, złożonym z `products.ts`, czyli tego samego
źródła co podstrony produktów. W oknie jest kadr, nazwa, zdanie wprowadzające,
cztery efekty dla pacjenta, wymiary i odnośnik do pełnego opisu. Okno zamyka
Escape i kliknięcie w tło, klawiatura z niego nie wychodzi, a po zamknięciu
wraca na kafelek, z którego wyszło.
