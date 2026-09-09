import { NextResponse } from "next/server";
import { subscribeToNewsletter } from "@/lib/email/audience";
import { evaluateSubmission, getClientIp, isRateLimited } from "@/lib/antispam";

type NewsletterPayload = {
  email?: string;
  firstName?: string;
  consent?: boolean;
  honeypot?: string;
  elapsedMs?: number;
  /** Skąd przyszedł zapis - do rozpoznania, które miejsce w serwisie działa. */
  source?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as NewsletterPayload;
    const email = payload.email?.trim().toLowerCase();
    const firstName = payload.firstName?.trim();

    if (!email || !EMAIL_PATTERN.test(email)) {
      return NextResponse.json(
        { success: false, error: "Podaj prawidłowy adres e-mail." },
        { status: 400 }
      );
    }

    // Zapis na listę to zgoda marketingowa - bez niej nie ma podstawy do wysyłki.
    if (payload.consent !== true) {
      return NextResponse.json(
        { success: false, error: "Zaznacz zgodę na otrzymywanie newslettera." },
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

    const verdict = evaluateSubmission({
      name: firstName,
      email,
      honeypot: payload.honeypot,
      elapsedMs: payload.elapsedMs,
    });
    if (verdict.spam) {
      // Cicha blokada: bot dostaje sukces, kontakt nie trafia na listę.
      console.warn(`[antispam] newsletter blocked (${verdict.reason}) ip=${ip} email=${email}`);
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const result = await subscribeToNewsletter(email, firstName);
    if (result.status === "skipped") {
      console.error("Newsletter: brak RESEND_API_KEY / RESEND_AUDIENCE_ID, zapis nie został wykonany.");
      return NextResponse.json(
        { success: false, error: "Zapis jest chwilowo niedostępny. Spróbuj ponownie później." },
        { status: 503 }
      );
    }

    console.info(`[newsletter] ${result.status} email=${email} source=${payload.source || "-"}`);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: unknown) {
    console.error(
      "Newsletter subscribe failed:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      { success: false, error: "Nie udało się zapisać adresu. Spróbuj ponownie za chwilę." },
      { status: 500 }
    );
  }
}
