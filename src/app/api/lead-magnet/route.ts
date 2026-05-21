import { NextResponse } from "next/server";
import { sendLeadMagnetEmail } from "@/lib/email/leadMagnet";
import { addContactToAudience } from "@/lib/email/audience";

type LeadMagnetPayload = {
  firstName?: string;
  email?: string;
  company?: string;
  marketingConsent?: boolean;
  utm?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
  };
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as LeadMagnetPayload;
    const email = payload.email?.trim().toLowerCase();
    const company = payload.company?.trim();
    const firstName = payload.firstName?.trim();

    if (!email || !EMAIL_PATTERN.test(email)) {
      return NextResponse.json(
        { success: false, error: "Podaj prawidłowy adres e-mail." },
        { status: 400 }
      );
    }

    // Wysyłka raportu PDF - nie blokuje odpowiedzi, użytkownik i tak pobierze go na stronie quizu.
    try {
      await sendLeadMagnetEmail({ to: email, company, firstName });
    } catch (emailError: unknown) {
      console.error(
        "Lead magnet email (Resend) failed:",
        emailError instanceof Error ? emailError.message : emailError
      );
    }

    // Wszyscy lądują w Resend Audience dla widoczności w CRM, ale tylko ci ze
    // zgodą marketingową mają unsubscribed=false (czyli dostają broadcasty).
    try {
      await addContactToAudience(email, firstName, {
        unsubscribed: payload.marketingConsent !== true,
      });
    } catch (audienceError: unknown) {
      console.error(
        "Resend audience add failed:",
        audienceError instanceof Error ? audienceError.message : audienceError
      );
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Wystąpił błąd serwera.",
      },
      { status: 500 }
    );
  }
}
