# Kalendarz rozmów: konfiguracja

Strona `/kalendarz` pokazuje wolne godziny Sebastiana i Jarka, przyjmuje rezerwację
15-minutowej rozmowy telefonicznej, wpisuje ją do kalendarza Google tej osoby,
zakłada zadanie w Pipedrive i wysyła potwierdzenie z plikiem do kalendarza.

Dopóki kalendarze nie są podłączone, strona pokazuje komunikat z telefonem i mailem.
Nic się nie psuje, po prostu nie ma czego rezerwować.

## 1. Konta Google

Sebastian i Jarek podłączają swoje własne kalendarze, te, których używają na co dzień.
Mogą to być prywatne konta Gmail albo konta firmowe.

Domena icaros.com.pl ma dziś pocztę na serwerach lh.pl, nie w Google Workspace.
Workspace to osobna, płatna usługa Google, rozliczana za każdego użytkownika.
Nie trzeba jej kupować, żeby kalendarz działał.

Różnica jest jedna. Przy kontach Workspace aplikację ustawia się jako wewnętrzną
i przy podłączaniu nie ma żadnych ostrzeżeń. Przy prywatnych Gmailach Google raz
pokaże ekran „Google nie zweryfikował tej aplikacji”. Trzeba wtedy kliknąć
„Zaawansowane”, potem „Przejdź do icaros.com.pl”. To jest jednorazowe, dotyczy dwóch
osób i nie ma wpływu na działanie kalendarza. Limit stu kont dla niezweryfikowanych
aplikacji nas nie dotyczy, podłączamy dwa.

## 2. Projekt w Google Cloud

1. Wejdź na https://console.cloud.google.com i załóż projekt, np. „ICAROS kalendarz”.
2. W „APIs & Services” włącz **Google Calendar API**.
3. W „Google Auth Platform” skonfiguruj ekran zgody:
   - typ użytkownika: **External** (albo **Internal**, jeśli konta są w Workspace),
   - nazwa aplikacji: `ICAROS Polska`, adres strony: `https://www.icaros.com.pl`,
   - link do polityki prywatności: `https://www.icaros.com.pl/polityka-prywatnosci`,
   - zakres: `https://www.googleapis.com/auth/calendar.events`.
4. Ustaw status publikacji na **In production**. To ważne. W trybie „Testing”
   Google unieważnia dostęp po siedmiu dniach i kalendarz przestaje działać.
   Publikacja nie wymaga przechodzenia weryfikacji, kończy się tylko tym
   ostrzeżeniem opisanym wyżej.
5. W „Credentials” utwórz **OAuth client ID**, typ **Web application**, i wpisz
   adresy powrotu:
   - `https://www.icaros.com.pl/api/kalendarz/polacz/callback`
   - `http://localhost:3040/api/kalendarz/polacz/callback` (do pracy lokalnej)
6. Zapisz `Client ID` i `Client secret`.

## 3. Zmienne środowiskowe

W Vercel, w ustawieniach projektu, dodaj:

| Zmienna | Do czego służy |
| --- | --- |
| `GOOGLE_CLIENT_ID` | z punktu 2 |
| `GOOGLE_CLIENT_SECRET` | z punktu 2 |
| `KALENDARZ_ADMIN_KLUCZ` | dowolne długie hasło, chroni link do podłączania kalendarzy |
| `KALENDARZ_SECRET` | dowolny długi ciąg, podpisuje linki do odwołania terminu |
| `NEXT_PUBLIC_SITE_URL` | `https://www.icaros.com.pl`, używane w linkach w mailach |
| `CRON_SECRET` | chroni zadanie wysyłające przypomnienia |
| `GCAL_KONTO_JAREK` | adres Gmail Jarka, tylko podpowiedź przy logowaniu |
| `GCAL_KONTO_SEBASTIAN` | adres Gmail Sebastiana |
| `GCAL_REFRESH_TOKEN_JAREK` | uzupełniane w kroku 4 |
| `GCAL_REFRESH_TOKEN_SEBASTIAN` | uzupełniane w kroku 4 |

Reszta, czyli Pipedrive i Resend, jest już ustawiona i kalendarz korzysta z tego samego.

## 4. Podłączenie kalendarzy

Dla każdej osoby otwórz albo wyślij link:

```
https://www.icaros.com.pl/api/kalendarz/polacz?osoba=jarek&klucz=TWOJ_KLUCZ_ADMINA
https://www.icaros.com.pl/api/kalendarz/polacz?osoba=sebastian&klucz=TWOJ_KLUCZ_ADMINA
```

Osoba loguje się na swoje konto Google i klika „Zezwól”. To wszystko, co robi.
Po powrocie widzi stronę z potwierdzeniem.

Bez Redisa token trzeba raz wkleić do zmiennych środowiskowych. Dostaniesz go mailem
i zobaczysz na stronie potwierdzenia, w sekcji „Dla administratora”. Wklej wartość
do `GCAL_REFRESH_TOKEN_JAREK` albo `GCAL_REFRESH_TOKEN_SEBASTIAN` i wdroż projekt.

Jeśli podłączysz w Vercel bazę Redis (Upstash ma darmowy plan), token zapisze się sam
i ten krok znika. Wystarczy, że w projekcie pojawią się zmienne `KV_REST_API_URL`
i `KV_REST_API_TOKEN` albo ich odpowiedniki z Upstash.

Link do podłączenia jest ważny 30 minut od wygenerowania.

## 5. Przypomnienia

Plik `vercel.json` uruchamia codziennie o 5:00 UTC zadanie
`/api/kalendarz/przypomnienia`. Wysyła ono maile do osób, które mają rozmowę
tego samego dnia. Informacja o wysłanym przypomnieniu zapisuje się w samym
wydarzeniu, więc nikt nie dostanie go dwa razy.

Na planie Hobby w Vercel zadanie może chodzić raz dziennie. Na planie Pro można
ustawić częściej, np. co godzinę, wtedy przypomnienie trafia bliżej rozmowy.

## 6. Co blokuje terminy

Kalendarz czyta wyłącznie **główny kalendarz** każdej osoby. Wspólne kalendarze
firmowe nie zabierają godzin.

Termin znika z listy, gdy w tym czasie jest wydarzenie oznaczone jako **Zajęty**.
Wydarzenia ustawione jako **Wolny**, przypomnienia i zadania nie blokują niczego.
Wydarzenie, które ktoś odrzucił, też nie blokuje.

Wokół każdego zajętego wpisu zostawiamy 10 minut odstępu, żeby rozmowa nie
zaczynała się dokładnie w sekundzie po spotkaniu.

## 7. Ustawienia do zmiany w kodzie

Wszystko siedzi w `src/lib/kalendarz/config.ts`:

- `GODZINY_STANDARDOWE`: godziny pracy, dziś poniedziałek do czwartku 9:00 do 16:00
  i piątek 9:00 do 15:00. Każda osoba może mieć własne, wystarczy podmienić pole
  `godziny` w jej wpisie.
- `DLUGOSC_ROZMOWY_MIN`: 15 minut.
- `MIN_WYPRZEDZENIE_H` i `NAJWCZESNIEJ_OD_JUTRA`: najwcześniejszy możliwy termin,
  dziś jest to następny dzień i co najmniej 12 godzin do przodu.
- `HORYZONT_DNI`: jak daleko w przyszłość widać terminy, dziś 21 dni.
- `LIMIT_ROZMOW_NA_DZIEN`: maksymalnie 6 rozmów dziennie na osobę.

Dni ustawowo wolne są liczone automatycznie, z Wielkanocą i Bożym Ciałem włącznie.

## 8. Kto dostaje rozmowę

1. Jeśli klient wskazał konkretną osobę i ta osoba jest wtedy wolna, dostaje rozmowę.
2. Jeśli klient jest już w Pipedrive i ma otwartą sprawę, rozmowę dostaje opiekun
   tej sprawy, o ile jest wolny. Dzięki temu znany lead nie trafia do kogoś innego.
3. W pozostałych przypadkach bierze ją ten, kto ma mniej umówionych rozmów.
   Przy remisie ten, kto dawniej rozmawiał.

## 9. Linki do wstawiania

Do newslettera, stopek i SMS-ów:

```
https://www.icaros.com.pl/kalendarz?zrodlo=newsletter
https://www.icaros.com.pl/kalendarz?zrodlo=sms
https://www.icaros.com.pl/kalendarz?zrodlo=mail
https://www.icaros.com.pl/kalendarz?zrodlo=formularz-fb
https://www.icaros.com.pl/kalendarz?zrodlo=stopka
```

Źródło trafia do notatki przy sprawie w Pipedrive, do pola źródła leada,
do opisu wydarzenia w kalendarzu i do maila z powiadomieniem.

Można też od razu wskazać osobę, np. gdy Sebastian wysyła SMS po targach:

```
https://www.icaros.com.pl/kalendarz?zrodlo=sms&osoba=sebastian
```

Parametry `utm_source`, `utm_medium`, `utm_campaign` i `utm_content` są zapisywane
w Pipedrive tak samo jak przy formularzu kontaktowym.

## 10. Podgląd bez Google

Do pracy lokalnej w `.env.local` jest `KALENDARZ_PRZYKLADOWE_TERMINY=1`.
Przy `npm run dev` kalendarz pokazuje wtedy same godziny pracy, bez zaglądania
do Google. Rezerwacja w tym trybie się nie uda, bo nie ma gdzie zapisać wydarzenia.
Na produkcji przełącznik jest ignorowany.

## 11. Czego jeszcze nie ma

- Etapu „Umówiony call” w Pipedrive. Jeśli go założysz, dodaj
  `PIPEDRIVE_STAGE_ID_CALL_BOOKED` i rezerwacja będzie przestawiać sprawę na ten etap.
  Bez tej zmiennej sprawa zostaje tam, gdzie jest, a rozmowa dopisuje się jako zadanie.
- Osobnej strony dla leadów z Facebooka z filmem nad kalendarzem.
- Podmiany formularzy kontaktowych na przyciski z terminem.
- Automatycznego telefonu po siedmiu dniach bez rezerwacji i zamykania leada.
