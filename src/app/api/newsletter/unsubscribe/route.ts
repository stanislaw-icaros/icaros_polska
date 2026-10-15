import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { unsubscribeFromNewsletter } from "@/lib/email/audience";
import { UNSUBSCRIBE_PAGE_PATH, verifyUnsubscribeToken } from "@/lib/email/unsubscribe";

/**
 * Wypisanie z listy na podstawie podpisanego linku z wiadomości.
 * Ten sam endpoint obsługuje przycisk na stronie /newsletter/wypisz oraz
 * jednoklikowe „Wypisz się” w Gmailu i Apple Mail, które wysyła tu POST
 * (RFC 8058, nagłówki List-Unsubscribe / List-Unsubscribe-Post).
 */
export async function POST(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const email = verifyUnsubscribeToken(params.get("e"), params.get("t"));
  if (!email) {
    return NextResponse.json(
      { success: false, error: "Link do wypisania jest nieprawidłowy lub nieaktualny." },
      { status: 400 }
    );
  }

  try {
    const result = await unsubscribeFromNewsletter(email);
    if (result.status === "skipped") {
      console.error("Newsletter unsubscribe: brak RESEND_API_KEY / RESEND_AUDIENCE_ID.");
      return NextResponse.json(
        { success: false, error: "Wypisanie jest chwilowo niedostępne. Napisz na kontakt@icaros.com.pl." },
        { status: 503 }
      );
    }

    console.info(`[newsletter] ${result.status} email=${email}`);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    console.error(
      "Newsletter unsubscribe failed:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      { success: false, error: "Nie udało się wypisać adresu. Napisz na kontakt@icaros.com.pl." },
      { status: 500 }
    );
  }
}

/**
 * Część klientów pocztowych otwiera link z List-Unsubscribe zwykłym GET-em,
 * a skanery linków robią to bez wiedzy odbiorcy. GET niczego więc nie zmienia,
 * tylko prowadzi na stronę z przyciskiem potwierdzenia.
 */
export async function GET(request: NextRequest) {
  const target = new URL(UNSUBSCRIBE_PAGE_PATH, request.nextUrl.origin);
  target.search = request.nextUrl.search;
  return NextResponse.redirect(target);
}
