import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { sendLeadNotificationEmail } from "@/lib/email/leadNotification";
import { evaluateSubmission, getClientIp, isRateLimited } from "@/lib/antispam";

type PreferencePayload = {
  email?: string;
  days?: string[];
  hours?: string[];
  note?: string;
  honeypot?: string;
  elapsedMs?: number;
  utm?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
  };
};

function parseEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, "utf8");
  const entries = content
    .split(/\r?\n/)
    .filter((line) => line.trim() && !line.trim().startsWith("#") && line.includes("="))
    .map((line) => {
      const index = line.indexOf("=");
      return [line.slice(0, index).trim(), line.slice(index + 1).trim()] as const;
    });
  return Object.fromEntries(entries);
}

const localEnv = {
  ...parseEnvFile(path.join(process.cwd(), ".env.pipedrive.local")),
  ...parseEnvFile(path.join(process.cwd(), ".env.pipedrive.setup.local")),
  ...parseEnvFile(path.join(process.cwd(), ".env.pipedrive.fields.local")),
};

function getEnv(name: string) {
  return process.env[name] || (localEnv as Record<string, string>)[name];
}

const API_TOKEN = getEnv("PIPEDRIVE_API_TOKEN");
const DOMAIN = getEnv("PIPEDRIVE_COMPANY_DOMAIN");
const BASE_URL = DOMAIN ? `https://${DOMAIN}.pipedrive.com/api/v1` : "";

// Strona /poznaj-system jest obsługiwana przez dyrektora krajowego (Sebastian Wilk).
const PREFERENCE_OWNER = Number(getEnv("PIPEDRIVE_OWNER_FALLBACK_ID") || "25511096");

// Powiadomienie trafia do zespołu; Sebastian (właściciel) jest dodawany dynamicznie z Pipedrive.
const ALWAYS_NOTIFY_EMAILS = (
  getEnv("LEAD_NOTIFY_EMAILS") || "stanislaw.drozniak@icaros.com.pl"
)
  .split(",")
  .map((address) => address.trim().toLowerCase())
  .filter(Boolean);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type PipedriveResponse<T = unknown> = {
  success?: boolean;
  error?: string;
  error_info?: string;
  data?: T;
};

type SearchItem = {
  item: {
    id: number;
    organization?: { id: number };
  };
};

type PipedriveUser = {
  id: number;
  name?: string;
  email?: string;
};

function toErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) return error.message;
  return fallback;
}

/** Następny dzień roboczy w formacie YYYY-MM-DD (pomija sobotę i niedzielę). */
function nextBusinessDay(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  const weekday = date.getDay();
  if (weekday === 6) date.setDate(date.getDate() + 2);
  else if (weekday === 0) date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

async function callPipedrive<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
  retries = 3
): Promise<PipedriveResponse<T>> {
  if (!API_TOKEN || !DOMAIN) {
    throw new Error(
      "Missing PIPEDRIVE_API_TOKEN or PIPEDRIVE_COMPANY_DOMAIN environment variables"
    );
  }

  const separator = endpoint.includes("?") ? "&" : "?";
  const url = `${BASE_URL}${endpoint}${separator}api_token=${encodeURIComponent(API_TOKEN)}`;

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    const response = await fetch(url, {
      ...options,
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      cache: "no-store",
    });

    if (response.status === 429 && attempt < retries) {
      const retryAfter = Number(response.headers.get("Retry-After") || "2");
      await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
      continue;
    }

    const text = await response.text();
    let json: PipedriveResponse<T> = {};
    try {
      json = JSON.parse(text) as PipedriveResponse<T>;
    } catch {
      // zachowaj surowy tekst dla czytelniejszego błędu
    }

    if (!response.ok || (json && json.success === false)) {
      throw new Error(
        `Pipedrive error ${response.status}: ${json?.error || json?.error_info || text}`
      );
    }

    return json;
  }

  throw new Error("Pipedrive request failed after retries");
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as PreferencePayload;
    const email = payload.email?.trim().toLowerCase();
    const days = Array.isArray(payload.days) ? payload.days.filter(Boolean) : [];
    const hours = Array.isArray(payload.hours) ? payload.hours.filter(Boolean) : [];

    if (!email || !EMAIL_PATTERN.test(email)) {
      return NextResponse.json(
        { success: false, error: "Podaj prawidłowy adres e-mail." },
        { status: 400 }
      );
    }
    if (days.length === 0 && hours.length === 0 && !payload.note?.trim()) {
      return NextResponse.json(
        { success: false, error: "Zaznacz preferowane dni lub godziny kontaktu." },
        { status: 400 }
      );
    }

    // Ochrona antyspamowa.
    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: "Zbyt wiele zgłoszeń. Spróbuj ponownie za chwilę." },
        { status: 429 }
      );
    }
    const verdict = evaluateSubmission({
      email,
      note: payload.note,
      honeypot: payload.honeypot,
      elapsedMs: payload.elapsedMs,
    });
    if (verdict.spam) {
      console.warn(`[antispam] contact-preference blocked (${verdict.reason}) ip=${ip} email=${email}`);
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // 1) Znajdź istniejący kontakt po dokładnym adresie e-mail.
    const personSearch = await callPipedrive<{ items?: SearchItem[] }>(
      `/persons/search?term=${encodeURIComponent(email)}&fields=email&exact_match=true&limit=1`
    );

    const personItems = personSearch.data?.items ?? [];
    let personId: number | undefined;
    let orgId: number | undefined;
    let matchedExisting = false;

    if (personItems.length > 0) {
      personId = personItems[0].item.id;
      orgId = personItems[0].item.organization?.id;
      matchedExisting = true;
    } else {
      // Brak kontaktu - tworzymy nowy, żeby preferencje nie przepadły.
      const createdPerson = await callPipedrive<{ id: number }>("/persons", {
        method: "POST",
        body: JSON.stringify({
          name: email,
          owner_id: PREFERENCE_OWNER,
          email: [{ value: email, primary: true, label: "work" }],
        }),
      });
      personId = createdPerson?.data?.id;
    }

    if (!personId) {
      throw new Error("Nie udało się ustalić kontaktu w Pipedrive.");
    }

    // 2) Dopisz notatkę z preferencjami kontaktu do tego konkretnego kontaktu.
    const utm = payload.utm || {};
    const noteLines = [
      "PREFEROWANY KONTAKT (strona /poznaj-system)",
      "",
      `E-mail: ${email}`,
      days.length ? `Preferowane dni: ${days.join(", ")}` : "",
      hours.length ? `Preferowane godziny: ${hours.join(", ")}` : "",
      payload.note?.trim() ? `Uwagi: ${payload.note.trim()}` : "",
      matchedExisting
        ? "(dopisane do istniejącego kontaktu)"
        : "(utworzono nowy kontakt - wcześniej nie istniał)",
      utm.utm_source ? `utm_source: ${utm.utm_source}` : "",
      utm.utm_campaign ? `utm_campaign: ${utm.utm_campaign}` : "",
    ].filter(Boolean);

    await callPipedrive("/notes", {
      method: "POST",
      body: JSON.stringify({
        person_id: personId,
        content: noteLines.join("\n"),
        pinned_to_person_flag: true,
      }),
    });

    // 3) Zadanie "oddzwoń w preferowanym terminie" dla dyrektora krajowego.
    try {
      const activityNote = [
        "Kontakt w preferowanym przez klienta terminie (z /poznaj-system).",
        `E-mail: ${email}`,
        days.length ? `Dni: ${days.join(", ")}` : "",
        hours.length ? `Godziny: ${hours.join(", ")}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      await callPipedrive("/activities", {
        method: "POST",
        body: JSON.stringify({
          subject: `Oddzwoń w preferowanym terminie - ${email}`,
          type: "call",
          person_id: personId,
          org_id: orgId,
          user_id: PREFERENCE_OWNER,
          due_date: nextBusinessDay(),
          note: activityNote,
        }),
      });
    } catch (activityError: unknown) {
      console.error(
        "Pipedrive activity (contact preference) failed:",
        activityError instanceof Error ? activityError.message : activityError
      );
    }

    // 4) Natychmiastowe powiadomienie e-mail do zespołu (i do Sebastiana jako właściciela),
    //    żeby znał preferowany termin i nie dublował kontaktu SMS-em o godziny.
    try {
      let ownerName = "Sebastian Wilk";
      const recipients = new Set(ALWAYS_NOTIFY_EMAILS);

      try {
        const usersResp = await callPipedrive<PipedriveUser[]>("/users");
        const users = Array.isArray(usersResp?.data) ? usersResp.data : [];
        const owner = users.find((user) => user.id === PREFERENCE_OWNER);
        if (owner?.name) ownerName = owner.name;
        if (owner?.email) recipients.add(owner.email.toLowerCase());
      } catch (usersError: unknown) {
        console.error(
          "Pipedrive users lookup (contact preference) failed:",
          usersError instanceof Error ? usersError.message : usersError
        );
      }

      const messageLines = [
        days.length ? `Preferowane dni: ${days.join(", ")}` : "",
        hours.length ? `Preferowane godziny: ${hours.join(", ")}` : "",
        payload.note?.trim() ? `Uwagi klienta: ${payload.note.trim()}` : "",
        matchedExisting
          ? "(dopisane do istniejącego kontaktu w Pipedrive)"
          : "(utworzono nowy kontakt w Pipedrive)",
      ].filter(Boolean);

      await sendLeadNotificationEmail({
        to: [...recipients],
        ownerName,
        leadName: email,
        email,
        message: messageLines.join("\n"),
        formSource: "Strona /poznaj-system - preferowany termin kontaktu",
      });
    } catch (notifyError: unknown) {
      console.error(
        "Contact preference notification email failed:",
        notifyError instanceof Error ? notifyError.message : notifyError
      );
    }

    return NextResponse.json(
      { success: true, matchedExisting, personId },
      { status: 201 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: toErrorMessage(error, "Unexpected server error") },
      { status: 500 }
    );
  }
}
