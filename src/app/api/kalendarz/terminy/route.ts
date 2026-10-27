import { NextResponse } from "next/server";
import { dostepnoscZPamieci } from "@/lib/kalendarz/terminy";

const BEZ_PAMIECI = { "Cache-Control": "private, no-store" };

/** Wolne terminy dla kalendarza na stronie. */
export async function GET() {
  try {
    const dostepnosc = await dostepnoscZPamieci();

    // Ostrzeżenia i obciążenie handlowców zostają w logach serwera.
    return NextResponse.json(
      {
        dni: dostepnosc.dni,
        handlowcy: dostepnosc.handlowcy,
        dlugoscMin: dostepnosc.dlugoscMin,
        strefa: dostepnosc.strefa,
        awaria: dostepnosc.dni.length === 0 && dostepnosc.ostrzezenia.length > 0,
      },
      { headers: BEZ_PAMIECI }
    );
  } catch (blad) {
    console.error(
      "[kalendarz] nie udalo sie policzyc terminow:",
      blad instanceof Error ? blad.message : blad
    );
    return NextResponse.json(
      { dni: [], handlowcy: [], dlugoscMin: 15, strefa: "Europe/Warsaw", awaria: true },
      { headers: BEZ_PAMIECI }
    );
  }
}
