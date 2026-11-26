/**
 * Potwierdzenie statusu profesjonalisty.
 *
 * Ustawa z 7 kwietnia 2022 r. o wyrobach medycznych pozwala kierować reklamę
 * wyrobów przeznaczonych dla użytkowników innych niż laicy wyłącznie do
 * profesjonalistów. ICAROS Health i Guardian to wyroby medyczne klasy I, więc
 * dopóki odwiedzający nie potwierdzi, kim jest, nie widzi strony.
 *
 * Zapisujemy tylko potwierdzenie. Brak odpowiedzi i odpowiedź „nie jestem
 * profesjonalistą" wyglądają tak samo: przy następnym wejściu pytamy znowu.
 * To jedna odpowiedź na całą domenę, więc po potwierdzeniu przechodzenie
 * między strefą pacjenta a strefą biznes niczego już nie pyta.
 *
 * Potwierdzenie trzymamy w localStorage i w ciasteczku, bo czyta je też
 * skrypt w `layout.tsx`, odpalany przed pierwszym malowaniem strony.
 */

export const KLUCZ_STATUSU = "icaros_status_profesjonalisty";
export const WARTOSC_POTWIERDZENIA = "profesjonalista";

/**
 * Ścieżki poza bramą.
 *
 * Brama stoi przed domeną dlatego, że ICAROS Health i Guardian są wyrobami
 * medycznymi klasy I. ICAROS Cloud nim nie jest: producent opisuje go jako
 * sprzęt fitness, bez deklaracji medycznych, a sprzedawcy jako balance board.
 * Landing Cloud nie reklamuje więc wyrobu medycznego i pytanie o status
 * profesjonalisty byłoby tam tylko przeszkodą przed zamówieniem.
 *
 * Poza bramą są też polityka prywatności i polityka cookies. To dokumenty,
 * nie reklama wyrobu, a człowiek musi móc je przeczytać, zanim cokolwiek
 * zadeklaruje albo zostawi dane (prowadzą do nich formularz Cloud i pas zgody
 * na cookies).
 *
 * Trzymamy to jako przedrostki ścieżek, bo ten sam kod czyta skrypt odpalany
 * przed pierwszym malowaniem strony i komponent bramy.
 */
export const SCIEZKI_BEZ_BRAMY = ["/cloud", "/polityka-prywatnosci", "/polityka-cookies"] as const;

/**
 * Subdomena landingu Cloud (cloud.icaros.com.pl) jest poza bramą w całości.
 * Tam ścieżką jest „/", więc sama lista ścieżek by nie wystarczyła.
 * `src/proxy.ts` pilnuje, żeby na tej subdomenie dało się otworzyć tylko
 * landing i obie polityki. Przedrostek zamiast pełnej nazwy, żeby to samo
 * działało lokalnie pod `cloud.localhost`.
 */
export const PRZEDROSTEK_HOSTA_CLOUD = "cloud.";

export function czyHostPozaBrama(host: string): boolean {
  return host.toLowerCase().startsWith(PRZEDROSTEK_HOSTA_CLOUD);
}

export function czyPozaBrama(sciezka: string): boolean {
  return SCIEZKI_BEZ_BRAMY.some(
    (przedrostek) => sciezka === przedrostek || sciezka.startsWith(`${przedrostek}/`)
  );
}

/** Atrybut na <html>, pod który podpięte jest ukrycie treści w globals.css. */
export const ATRYBUT_BRAMY = "brama";

const POL_ROKU = 60 * 60 * 24 * 180;

function wCiasteczku(): boolean {
  if (typeof document === "undefined") return false;
  return `; ${document.cookie}`.includes(`; ${KLUCZ_STATUSU}=${WARTOSC_POTWIERDZENIA}`);
}

export function czyPotwierdzony(): boolean {
  if (typeof window === "undefined") return false;

  try {
    if (window.localStorage.getItem(KLUCZ_STATUSU) === WARTOSC_POTWIERDZENIA) return true;
  } catch {
    // Prywatne okno albo zablokowane dane strony: zostaje ciasteczko.
  }
  return wCiasteczku();
}

export function zapiszPotwierdzenie(): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  try {
    window.localStorage.setItem(KLUCZ_STATUSU, WARTOSC_POTWIERDZENIA);
  } catch {
    // Bez pamięci przeglądarki zostaje samo ciasteczko.
  }
  document.cookie = `${KLUCZ_STATUSU}=${WARTOSC_POTWIERDZENIA}; Path=/; Max-Age=${POL_ROKU}; SameSite=Lax`;
  delete document.documentElement.dataset[ATRYBUT_BRAMY];
  window.dispatchEvent(new Event("status-profesjonalisty"));
}

/**
 * Skrypt odpalany przed pierwszym malowaniem strony. Bez niego treść mignęłaby
 * przez ułamek sekundy, zanim React zdąży postawić bramę.
 */
export const SKRYPT_BRAMY = `(function(){try{if(location.hostname.indexOf("${PRZEDROSTEK_HOSTA_CLOUD}")===0)return;var p=location.pathname,b=${JSON.stringify(SCIEZKI_BEZ_BRAMY)};for(var i=0;i<b.length;i++){if(p===b[i]||p.indexOf(b[i]+"/")===0)return}var k="${KLUCZ_STATUSU}",w="${WARTOSC_POTWIERDZENIA}",ok=false;try{ok=localStorage.getItem(k)===w}catch(e){}if(!ok){ok=("; "+document.cookie).indexOf("; "+k+"="+w)>-1}if(!ok){document.documentElement.dataset.${ATRYBUT_BRAMY}="zamknieta"}}catch(e){}})()`;
