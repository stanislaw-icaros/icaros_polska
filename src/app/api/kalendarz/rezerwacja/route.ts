import { NextResponse } from "next/server";
import { evaluateSubmission, getClientIp, isRateLimited } from "@/lib/antispam";
import { umowRozmowe, type Zgloszenie } from "@/lib/kalendarz/rezerwacja";

type Cialo = Zgloszenie & {
  zgodaDanych?: boolean;
  honeypot?: string;
  elapsedMs?: number;
};

export async function POST(request: Request) {
  let cialo: Cialo;
  try {
    cialo = (await request.json()) as Cialo;
  } catch {
    return NextResponse.json(
      { success: false, error: "Nieprawidłowe dane zgłoszenia." },
      { status: 400 }
    );
  }

  if (cialo.zgodaDanych !== true) {
    return NextResponse.json(
      { success: false, error: "Do rezerwacji potrzebna jest zgoda na kontakt." },
      { status: 400 }
    );
  }

  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { success: false, error: "Zbyt wiele zgłoszeń. Spróbuj ponownie za chwilę." },
      { status: 429 }
    );
  }

  const ocena = evaluateSubmission({
    name: cialo.imie,
    email: cialo.email,
    phone: cialo.telefon,
    company: cialo.firma,
    message: cialo.temat,
    honeypot: cialo.honeypot,
    elapsedMs: cialo.elapsedMs,
  });
  if (ocena.spam) {
    console.warn(`[antispam] kalendarz zablokowany (${ocena.reason}) ip=${ip}`);
    // Cicha odpowiedź: bot nie dowiaduje się, że został odrzucony,
    // ale żaden termin nie zostaje zajęty.
    return NextResponse.json({ success: true, cichaBlokada: true }, { status: 200 });
  }

  try {
    const wynik = await umowRozmowe(cialo);

    if (wynik.status === "zajety") {
      return NextResponse.json(
        {
          success: false,
          zajety: true,
          error: "Ten termin właśnie został zajęty. Wybierz inną godzinę.",
        },
        { status: 409 }
      );
    }
    if (wynik.status === "blad") {
      return NextResponse.json({ success: false, error: wynik.komunikat }, { status: 400 });
    }

    return NextResponse.json(
      {
        success: true,
        start: wynik.start,
        osoba: wynik.osoba,
        dlugoscMin: wynik.dlugoscMin,
        linkOdwolania: wynik.linkOdwolania,
      },
      { status: 201 }
    );
  } catch (blad) {
    console.error(
      "[kalendarz] rezerwacja nie przeszla:",
      blad instanceof Error ? blad.message : blad
    );
    return NextResponse.json(
      {
        success: false,
        error:
          "Nie udało się zapisać terminu. Spróbuj ponownie albo napisz na kontakt@icaros.com.pl.",
      },
      { status: 500 }
    );
  }
}
