import { NextResponse } from "next/server";
import { HANDLOWCY, handlowiec } from "@/lib/kalendarz/config";
import { adresAutoryzacji } from "@/lib/kalendarz/google";
import { zbudujStan } from "@/lib/kalendarz/podpis";

/**
 * Start podłączania kalendarza.
 *
 * Link generuje administrator i wysyła go handlowcowi. Handlowiec klika,
 * zatwierdza dostęp w Google i wraca na stronę z potwierdzeniem. Nie dotyka
 * żadnych ustawień technicznych.
 */
export async function GET(request: Request) {
  const adres = new URL(request.url);
  const kluczAdmina = process.env.KALENDARZ_ADMIN_KLUCZ?.trim();

  if (!kluczAdmina) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Brak KALENDARZ_ADMIN_KLUCZ w zmiennych środowiskowych. Bez niego podłączanie kalendarzy jest wyłączone.",
      },
      { status: 503 }
    );
  }

  if (adres.searchParams.get("klucz") !== kluczAdmina) {
    return NextResponse.json({ success: false, error: "Brak dostępu." }, { status: 403 });
  }

  const osoba = handlowiec(adres.searchParams.get("osoba") || "");
  if (!osoba) {
    return NextResponse.json(
      {
        success: false,
        error: `Podaj parametr osoba. Dostępne: ${HANDLOWCY.map((element) => element.klucz).join(", ")}.`,
      },
      { status: 400 }
    );
  }

  const stan = zbudujStan(osoba.klucz);
  if (!stan) {
    return NextResponse.json(
      {
        success: false,
        error: "Brak sekretu do podpisania żądania (KALENDARZ_SECRET albo RESEND_API_KEY).",
      },
      { status: 503 }
    );
  }

  try {
    return NextResponse.redirect(
      adresAutoryzacji({
        baza: adres.origin,
        stan,
        podpowiedzKonta: osoba.kontoGoogle || undefined,
      })
    );
  } catch (blad) {
    return NextResponse.json(
      { success: false, error: blad instanceof Error ? blad.message : "Błąd konfiguracji." },
      { status: 503 }
    );
  }
}
