import { NextResponse } from "next/server";
import { DLUGOSC_ROZMOWY_MIN, handlowiec } from "@/lib/kalendarz/config";
import { pobierzWpisy, usunRozmowe } from "@/lib/kalendarz/google";
import { odczytajBilet } from "@/lib/kalendarz/podpis";
import { wyczyscPamiec } from "@/lib/kalendarz/terminy";
import { SCIEZKA_KALENDARZA } from "@/lib/kalendarz/rezerwacja";
import { odnotujOdwolanie } from "@/lib/pipedrive/rozmowa";
import { anulujPrzypomnienie, wyslijOdwolanieRozmowy } from "@/lib/email/rozmowa";
import { SITE_URL } from "@/lib/email/unsubscribe";

/** Odwołanie terminu z podpisanego linku w mailu. */
export async function POST(request: Request) {
  let cialo: { b?: string; t?: string };
  try {
    cialo = (await request.json()) as { b?: string; t?: string };
  } catch {
    return NextResponse.json({ success: false, error: "Nieprawidłowy link." }, { status: 400 });
  }

  const bilet = odczytajBilet(cialo.b, cialo.t);
  if (!bilet) {
    return NextResponse.json(
      { success: false, error: "Ten link do odwołania jest nieprawidłowy." },
      { status: 400 }
    );
  }

  const osoba = handlowiec(bilet.o);
  if (!osoba) {
    return NextResponse.json({ success: false, error: "Nieznany termin." }, { status: 400 });
  }

  const start = new Date(bilet.s);
  if (start.getTime() < Date.now()) {
    return NextResponse.json(
      { success: false, error: "Ta rozmowa już się odbyła, nie ma czego odwoływać." },
      { status: 409 }
    );
  }

  try {
    // Dane klienta czytamy z samego wydarzenia, dzięki temu nie trzymamy
    // osobnej bazy rezerwacji.
    const wpisy = await pobierzWpisy(
      osoba,
      new Date(start.getTime() - 60_000),
      new Date(start.getTime() + DLUGOSC_ROZMOWY_MIN * 60_000 + 60_000)
    );
    const wpis = wpisy.find((element) => element.id === bilet.w);

    await usunRozmowe(osoba, bilet.w);
    wyczyscPamiec();

    // Przypomnienie czeka w kolejce Resend, trzeba je skasować, inaczej
    // przyjdzie do kogoś, kto nie ma już umówionej rozmowy.
    const przypomnienie = wpis?.wlasciwosci.przypomnienieId;
    if (przypomnienie) await anulujPrzypomnienie(przypomnienie);

    const imie = wpis?.wlasciwosci.klientImie || "Klient";
    await odnotujOdwolanie({ dealId: bilet.d, imie, termin: start, handlowiec: osoba });

    const email = wpis?.wlasciwosci.klientEmail;
    if (email) {
      await wyslijOdwolanieRozmowy({
        imie,
        telefon: wpis?.wlasciwosci.klientTelefon || "",
        email,
        start,
        koniec: new Date(start.getTime() + DLUGOSC_ROZMOWY_MIN * 60_000),
        handlowiec: osoba,
        dlugoscMin: DLUGOSC_ROZMOWY_MIN,
        idWydarzenia: bilet.w,
        linkKalendarzaStrony: `${SITE_URL}${SCIEZKA_KALENDARZA}`,
      });
    }

    console.log(`[kalendarz] odwolano termin ${start.toISOString()} u ${osoba.imie}`);
    return NextResponse.json({ success: true });
  } catch (blad) {
    console.error(
      "[kalendarz] odwolanie nie wyszlo:",
      blad instanceof Error ? blad.message : blad
    );
    return NextResponse.json(
      {
        success: false,
        error: "Nie udało się odwołać terminu. Napisz na kontakt@icaros.com.pl.",
      },
      { status: 500 }
    );
  }
}
