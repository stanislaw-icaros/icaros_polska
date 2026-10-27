import { NextResponse } from "next/server";
import { DLUGOSC_ROZMOWY_MIN } from "@/lib/kalendarz/config";
import { czesci, zDatyIGodziny, dodajDni } from "@/lib/kalendarz/czas";
import { zaktualizujRozmowe } from "@/lib/kalendarz/google";
import { pobierzUmowioneRozmowy } from "@/lib/kalendarz/terminy";
import { wyslijPrzypomnienieOrozmowie } from "@/lib/email/rozmowa";

/**
 * Przypomnienia o rozmowach zaplanowanych na dzisiaj.
 *
 * Uruchamia to zadanie cron z vercel.json. Informacja o wysłanym przypomnieniu
 * ląduje w samym wydarzeniu, więc ponowne wywołanie nie wyśle drugiego maila.
 */

const ZNACZNIK_WYSLANO = "przypomnienieWyslane";

function autoryzacjaOk(request: Request): boolean {
  const sekret = process.env.CRON_SECRET?.trim();
  if (!sekret) return true; // bez sekretu zadanie jest otwarte, ale nic nie ujawnia

  const naglowek = request.headers.get("authorization");
  if (naglowek === `Bearer ${sekret}`) return true;

  const klucz = new URL(request.url).searchParams.get("klucz");
  return klucz === sekret;
}

export async function GET(request: Request) {
  if (!autoryzacjaOk(request)) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const teraz = new Date();
  const dzis = czesci(teraz).data;
  const koniecDnia = zDatyIGodziny(dodajDni(dzis, 1), "00:00");

  try {
    const rozmowy = await pobierzUmowioneRozmowy(teraz, koniecDnia);
    let wyslane = 0;
    let pominiete = 0;

    for (const { osoba, wpis } of rozmowy) {
      const email = wpis.wlasciwosci.klientEmail;
      if (!email || wpis.wlasciwosci[ZNACZNIK_WYSLANO]) {
        pominiete += 1;
        continue;
      }

      try {
        await wyslijPrzypomnienieOrozmowie({
          imie: wpis.wlasciwosci.klientImie || "Klient",
          telefon: wpis.wlasciwosci.klientTelefon || "",
          email,
          firma: wpis.wlasciwosci.klientFirma,
          temat: wpis.wlasciwosci.temat,
          start: wpis.start,
          koniec: new Date(wpis.start.getTime() + DLUGOSC_ROZMOWY_MIN * 60_000),
          handlowiec: osoba,
          dlugoscMin: DLUGOSC_ROZMOWY_MIN,
          linkOdwolania: wpis.wlasciwosci.linkOdwolania,
          idWydarzenia: wpis.id,
        });

        await zaktualizujRozmowe(osoba, wpis.id, {
          wlasciwosci: { [ZNACZNIK_WYSLANO]: new Date().toISOString() },
        });
        wyslane += 1;
      } catch (blad) {
        console.error(
          `[kalendarz] przypomnienie dla ${email} nie poszlo:`,
          blad instanceof Error ? blad.message : blad
        );
      }
    }

    console.log(`[kalendarz] przypomnienia: wyslane ${wyslane}, pominiete ${pominiete}`);
    return NextResponse.json({ success: true, wyslane, pominiete, rozmowy: rozmowy.length });
  } catch (blad) {
    console.error(
      "[kalendarz] zadanie przypomnien nie wyszlo:",
      blad instanceof Error ? blad.message : blad
    );
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
