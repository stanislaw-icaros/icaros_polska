import { NextResponse } from "next/server";
import crypto from "node:crypto";

const API_VERSION = "v21.0";
const ALLOWED_EVENTS = ["ViewContent", "Contact", "CompleteRegistration"];

type MetaEventPayload = {
  eventName?: string;
  eventId?: string;
  sourceUrl?: string;
  email?: string;
  phone?: string;
};

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

/** Email: trim + lowercase, potem SHA-256 (wymagane przez Meta). */
function hashEmail(email: string): string {
  return sha256(email.trim().toLowerCase());
}

/** Telefon: format E.164 bez znaku "+", polskie 9-cyfrowe dostają prefiks 48. */
function hashPhone(phone: string): string {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.length === 9) digits = `48${digits}`;
  return sha256(digits);
}

function readCookie(cookieHeader: string, name: string): string | undefined {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = cookieHeader.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

export async function POST(request: Request) {
  try {
    const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID?.trim();
    const accessToken = process.env.META_CAPI_ACCESS_TOKEN?.trim();
    if (!pixelId || !accessToken) {
      // Brak konfiguracji — tracking jest opcjonalny, nie traktujemy jako błąd.
      return NextResponse.json({ success: false, skipped: true }, { status: 200 });
    }

    const body = (await request.json()) as MetaEventPayload;
    if (!body.eventName || !ALLOWED_EVENTS.includes(body.eventName) || !body.eventId) {
      return NextResponse.json(
        { success: false, error: "Invalid event" },
        { status: 400 }
      );
    }

    const userAgent = request.headers.get("user-agent") || undefined;
    const clientIp =
      (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() || undefined;
    const cookieHeader = request.headers.get("cookie") || "";
    const fbp = readCookie(cookieHeader, "_fbp");
    const fbc = readCookie(cookieHeader, "_fbc");

    const userData: Record<string, unknown> = {};
    if (body.email?.trim()) userData.em = [hashEmail(body.email)];
    if (body.phone?.trim()) userData.ph = [hashPhone(body.phone)];
    if (userAgent) userData.client_user_agent = userAgent;
    if (clientIp) userData.client_ip_address = clientIp;
    if (fbp) userData.fbp = fbp;
    if (fbc) userData.fbc = fbc;

    const payload = {
      data: [
        {
          event_name: body.eventName,
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_source_url: body.sourceUrl,
          event_id: body.eventId,
          user_data: userData,
        },
      ],
    };

    const response = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(
        accessToken
      )}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("Meta CAPI error:", response.status, text);
      return NextResponse.json({ success: false }, { status: 200 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    console.error(
      "Meta CAPI request failed:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
