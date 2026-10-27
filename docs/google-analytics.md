# Google Analytics 4 na icaros.com.pl

Strona ma gotowe podpięcie GA4. Brakuje tylko identyfikatora pomiaru z konta
ICAROS Polska. Bez zmiennej `NEXT_PUBLIC_GA_ID` nie ładuje się żaden skrypt
Google, więc strona działa tak samo jak dotąd.

## 1. Załóż usługę w koncie ICAROS Polska

1. Wejdź na https://analytics.google.com na koncie firmowym.
2. Administracja, potem "Utwórz" i "Usługa".
3. Nazwa usługi: `ICAROS Polska`, strefa czasowa Polska, waluta PLN.
4. Branża: opieka zdrowotna, rozmiar firmy według stanu faktycznego.
5. Cel: "Generowanie potencjalnych klientów".
6. Platforma: "Witryna". Adres `https://www.icaros.com.pl`, nazwa strumienia
   `icaros.com.pl`.
7. Po zapisaniu Google pokaże **identyfikator pomiaru** w formacie
   `G-XXXXXXXXXX`. To jest wartość, której potrzebujemy.

W ustawieniach strumienia warto zostawić włączony pomiar zaawansowany, ale
odsłony podstron i tak wysyłamy sami (patrz niżej), więc nic nie trzeba zmieniać.

## 2. Wklej identyfikator

W Vercelu, w projekcie strony: Settings, Environment Variables, dodaj dla
środowisk Production i Preview:

```
NEXT_PUBLIC_GA_ID = G-XXXXXXXXXX
```

Potem Redeploy. Lokalnie ta sama zmienna idzie do `.env.local`.

## 3. Co jest mierzone

Skrypt GA ładuje się dopiero po zgodzie analitycznej w banerze cookies
(`src/components/GoogleAnalytics.tsx`). Bez zgody nie wysyłamy nic.

| Zdarzenie | Kiedy | Parametry |
| --- | --- | --- |
| `page_view` | wejście na każdą podstronę, także przy przejściu bez przeładowania | `page_path`, `page_location`, `page_title` |
| `map_open` | kliknięcie w odnośnik prowadzący na mapę placówek | `place`: `hero`, `strona_glowna_przycisk`, `strona_glowna_mapka`, `menu`, `menu-mobile`, `stopka`, `baza-wiedzy`, `faq`, `jak_to_dziala`, `film` |
| `map_location_click` | wybór placówki na mapie, z pinezki albo z listy | `location_name`, `city` |
| `map_location_website` | przejście ze strony mapy na stronę placówki | `location_name`, `city` |
| `booking_click` | kliknięcie "Umów prezentację" w strefie biznes | `place`: `menu`, `menu-mobile`, `stopka` |
| `contact_click` | kliknięcie "Skontaktuj się" w strefie pacjenta | `place` |
| `contact_form_submit` | wysłanie formularza kontaktowego | `place` |
| `newsletter_click` | kliknięcie paska newslettera odsyłającego na stronę zapisu | `place` |
| `newsletter_signup` | skuteczny zapis na listę | `place` |

Zdarzenia wysyłamy przez `src/lib/analytics/track.ts`. Gdy ruszy kalendarz
rezerwacji, wystarczy na przycisku wywołać `trackBookingClick("kalendarz")`
i kliknięcia trafią do tej samej statystyki.

## 4. Konwersje w GA4

Po kilku dniach zbierania danych oznacz w GA4 jako kluczowe zdarzenia
(Administracja, Zdarzenia): `contact_form_submit`, `newsletter_signup`,
`booking_click`. Dzięki temu wejdą do raportów konwersji i do Google Ads.
