import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Subdomena landingu ICAROS Cloud.
 *
 * `cloud.icaros.com.pl` wskazuje na ten sam projekt na Vercelu co www, a tutaj
 * przepisujemy jej korzeń na `/cloud`. Dzięki temu nie ma drugiego projektu,
 * drugiego zestawu zmiennych środowiskowych ani drugiego deploya, a strona
 * dalej używa tych samych API (Pipedrive, Resend, kalendarz, CAPI).
 *
 * Przepisanie, nie przekierowanie: w pasku adresu zostaje
 * `cloud.icaros.com.pl`, a reklama prowadzi pod własny adres z własnymi UTM.
 *
 * Na subdomenie da się otworzyć tylko trzy rzeczy: landing, politykę
 * prywatności i politykę cookies. Każdy inny adres wraca na landing. To ważne,
 * bo subdomena jest poza bramką profesjonalisty (patrz
 * `src/lib/profesjonalista.ts`), więc nie może pokazywać reszty serwisu.
 *
 * Host rozpoznajemy po przedrostku `cloud.`, żeby to samo dało się sprawdzić
 * lokalnie pod `cloud.localhost`.
 */
const PRZEDROSTEK_HOSTA = "cloud.";
const SCIEZKA_CLOUD = "/cloud";
const SCIEZKI_WSPOLNE = ["/polityka-prywatnosci", "/polityka-cookies"];

export function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.toLowerCase() ?? "";
  if (!host.startsWith(PRZEDROSTEK_HOSTA)) return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (pathname === SCIEZKA_CLOUD || pathname.startsWith(`${SCIEZKA_CLOUD}/`)) {
    return NextResponse.next();
  }
  if (SCIEZKI_WSPOLNE.includes(pathname)) return NextResponse.next();

  const cel = request.nextUrl.clone();
  if (pathname === "/") {
    cel.pathname = SCIEZKA_CLOUD;
    return NextResponse.rewrite(cel);
  }

  cel.pathname = "/";
  cel.search = "";
  return NextResponse.redirect(cel);
}

export const config = {
  /**
   * Pliki statyczne, obrazy i API zostawiamy w spokoju: formularz na
   * subdomenie strzela do `/api/pipedrive` i to ma dojść tam, gdzie zawsze.
   */
  matcher: ["/((?!api|_next/static|_next/image|favicon|cloud|.*\\..*).*)"],
};
