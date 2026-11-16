import { NextResponse } from "next/server";
import {
  ALWAYS_NOTIFY_EMAILS,
  callPipedrive,
  createPerson,
  dealUrl,
  findPerson,
  etykietyZHandlowcem,
  getEnv,
  handlowiecZEtykiet,
  KONTO_PIPEDRIVE,
  type KluczEtykiety,
  nextBusinessDay,
  PIPELINE_ID,
  resolveOrganization,
  STAGE_ID_NEW_LEAD,
} from "@/lib/pipedrive/client";
import { sendContactConfirmationEmail } from "@/lib/email/contactConfirmation";
import { sendLeadNotificationEmail } from "@/lib/email/leadNotification";
import { addContactToAudience } from "@/lib/email/audience";
import { evaluateSubmission, getClientIp, isRateLimited } from "@/lib/antispam";
import { HANDLOWCY } from "@/lib/kalendarz/config";

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  nip?: string;
  role?: string;
  message?: string;
  page?: string;
  formSource?: string;
  leadSource?: string;
  marketingConsent?: boolean;
  honeypot?: string;
  elapsedMs?: number;
  utm?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
  };
};

type DealListItem = {
  label?: unknown;
};

function toErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) return error.message;
  return fallback;
}

/**
 * Obaj handlowcy pracują na jednym koncie Pipedrive, więc kolejkę prowadzimy
 * po etykietach „Jarek” i „Sebastian”, nie po właścicielu deala.
 */
function handlowiecZSkrotu(seed: string): KluczEtykiety {
  const hash = [...seed.toLowerCase()].reduce(
    (acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0,
    0
  );
  return Math.abs(hash) % 2 === 0 ? "jarek" : "sebastian";
}

async function wybierzHandlowca(): Promise<KluczEtykiety | undefined> {
  try {
    // Kolejka bez stanu: ostatni deal z etykietą handlowca decyduje, kto teraz.
    const recentDeals = await callPipedrive<DealListItem[]>(
      `/deals?limit=20&sort=add_time DESC`
    );
    const deals = Array.isArray(recentDeals?.data) ? recentDeals.data : [];
    const ostatni = deals.map((deal) => handlowiecZEtykiet(deal?.label)).find(Boolean);
    if (ostatni === "jarek") return "sebastian";
    if (ostatni === "sebastian") return "jarek";
  } catch {
    // niżej skrót z danych zgłoszenia
  }
  return undefined;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ContactPayload;
    const name = payload.name?.trim();
    const email = payload.email?.trim().toLowerCase();
    const phone = payload.phone?.trim();
    const ownerSeed = email || phone || name || "";

    if (!name || (!email && !phone)) {
      return NextResponse.json(
        { success: false, error: "Name and at least one contact field (email or phone) are required." },
        { status: 400 }
      );
    }

    // Ochrona antyspamowa - blokada botów i fejków przed utworzeniem leada.
    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: "Zbyt wiele zgłoszeń. Spróbuj ponownie za chwilę." },
        { status: 429 }
      );
    }
    const verdict = evaluateSubmission({
      name,
      email,
      phone,
      company: payload.company,
      message: payload.message,
      honeypot: payload.honeypot,
      elapsedMs: payload.elapsedMs,
    });
    if (verdict.spam) {
      console.warn(`[antispam] pipedrive blocked (${verdict.reason}) ip=${ip} email=${email || "-"}`);
      // Cicha odpowiedź "sukces" - nie tworzymy leada i nie zdradzamy botom sygnału.
      return NextResponse.json({ success: true }, { status: 200 });
    }

    let personId: number | undefined;
    let orgId: number | undefined;
    const ownerId = KONTO_PIPEDRIVE;
    const prowadzi = (await wybierzHandlowca()) || handlowiecZSkrotu(ownerSeed);
    const handlowiecLeada = HANDLOWCY.find((osoba) => osoba.klucz === prowadzi);

    // 1) Resolve the organization first, independently of the person. This way the
    // deal is always linked to the placówka, also when the person already exists.
    const companyName = payload.company?.trim();
    if (companyName) {
      orgId = await resolveOrganization(companyName, ownerId);
    }

    // 2) Resolve the person - reuse an existing record or create a new one.
    const existingPerson = await findPerson(email, phone);
    if (existingPerson) {
      personId = existingPerson.id;

      if (!orgId) {
        // No company on this submission - fall back to the person's existing org.
        orgId = existingPerson.organization?.id;
      } else if (!existingPerson.organization?.id) {
        // Person exists without an org - link them to the resolved placówka.
        await callPipedrive(`/persons/${personId}`, {
          method: "PUT",
          body: JSON.stringify({ org_id: orgId }),
        });
      }
    } else {
      personId = await createPerson({ name, ownerId, orgId, email, phone });
    }

    if (!personId) {
      throw new Error("Could not resolve person_id.");
    }

    const customFields: Record<string, string | undefined> = {};
    const leadSource = payload.leadSource || "Formularz WWW";
    const formSource = payload.formSource || "Strona główna - formularz główny";

    if (getEnv("PIPEDRIVE_FIELD_LEAD_SOURCE")) {
      customFields[getEnv("PIPEDRIVE_FIELD_LEAD_SOURCE") as string] = leadSource;
    }
    if (getEnv("PIPEDRIVE_FIELD_PAGE_SOURCE") && payload.page) {
      customFields[getEnv("PIPEDRIVE_FIELD_PAGE_SOURCE") as string] = payload.page;
    }
    if (getEnv("PIPEDRIVE_FIELD_FORM_SOURCE")) {
      customFields[getEnv("PIPEDRIVE_FIELD_FORM_SOURCE") as string] = formSource;
    }
    if (getEnv("PIPEDRIVE_FIELD_UTM_SOURCE") && payload.utm?.utm_source) {
      customFields[getEnv("PIPEDRIVE_FIELD_UTM_SOURCE") as string] = payload.utm.utm_source;
    }
    if (getEnv("PIPEDRIVE_FIELD_UTM_MEDIUM") && payload.utm?.utm_medium) {
      customFields[getEnv("PIPEDRIVE_FIELD_UTM_MEDIUM") as string] = payload.utm.utm_medium;
    }
    if (getEnv("PIPEDRIVE_FIELD_UTM_CAMPAIGN") && payload.utm?.utm_campaign) {
      customFields[getEnv("PIPEDRIVE_FIELD_UTM_CAMPAIGN") as string] = payload.utm.utm_campaign;
    }
    if (getEnv("PIPEDRIVE_FIELD_UTM_CONTENT") && payload.utm?.utm_content) {
      customFields[getEnv("PIPEDRIVE_FIELD_UTM_CONTENT") as string] = payload.utm.utm_content;
    }

    const dealTitle = payload.company?.trim()
      ? `ICAROS - ${payload.company.trim()}`
      : `ICAROS - ${name}`;

    const createdDeal = await callPipedrive<{ id: number }>("/deals", {
      method: "POST",
      body: JSON.stringify({
        title: dealTitle,
        user_id: ownerId,
        label: etykietyZHandlowcem(undefined, prowadzi),
        person_id: personId,
        org_id: orgId,
        pipeline_id: PIPELINE_ID,
        stage_id: STAGE_ID_NEW_LEAD,
        currency: "EUR",
        ...customFields,
      }),
    });

    const noteLines = [
      "NOWE ZGLOSZENIE Z FORMULARZA",
      "",
      `Imie i nazwisko: ${name}`,
      email ? `Email: ${email}` : "",
      phone ? `Telefon: ${phone}` : "",
      payload.company ? `Placowka / firma: ${payload.company}` : "",
      payload.nip ? `NIP: ${payload.nip}` : "",
      payload.role ? `Rola: ${payload.role}` : "",
      payload.message ? "" : "",
      payload.message ? `Wiadomosc: ${payload.message}` : "",
      payload.page ? `Strona: ${payload.page}` : "",
      `Zrodlo formularza: ${formSource}`,
      typeof payload.marketingConsent === "boolean"
        ? `Zgoda marketingowa: ${payload.marketingConsent ? "TAK" : "NIE"}`
        : "",
    ].filter(Boolean);

    if (createdDeal?.data && typeof createdDeal.data === "object" && "id" in createdDeal.data) {
      const dealId = (createdDeal.data as { id: number }).id;

      await callPipedrive("/notes", {
        method: "POST",
        body: JSON.stringify({
          deal_id: dealId,
          content: noteLines.join("\n"),
          pinned_to_deal_flag: true,
        }),
      });

      // Zadanie "oddzwoń" powiazane z dealem / osoba / organizacja i przypisane
      // do wlasciciela deala. Telefon trafia tez do tresci, zeby handlowiec widzial
      // od razu na liscie zadan, do kogo i na jaki numer dzwonic.
      try {
        const activityNote = [
          "Oddzwoń do nowego leada (najlepiej w ciągu 24h).",
          name ? `Osoba: ${name}` : "",
          phone ? `Telefon: ${phone}` : "",
          email ? `Email: ${email}` : "",
          payload.company?.trim() ? `Placówka: ${payload.company.trim()}` : "",
          `Zrodlo: ${formSource}`,
        ]
          .filter(Boolean)
          .join("\n");

        await callPipedrive("/activities", {
          method: "POST",
          body: JSON.stringify({
            subject: `[${handlowiecLeada?.imie || "Zespół"}] Oddzwoń do leada - ${payload.company?.trim() || name}`,
            type: "call",
            deal_id: dealId,
            person_id: personId,
            org_id: orgId,
            user_id: ownerId,
            due_date: nextBusinessDay(),
            note: activityNote,
          }),
        });
      } catch (activityError: unknown) {
        console.error(
          "Pipedrive activity creation failed:",
          activityError instanceof Error ? activityError.message : activityError
        );
      }

      // Powiadomienie e-mail do zespołu sprzedaży - trafia do obu handlowców,
      // z wyraźnym oznaczeniem, kto obsługuje tego leada (round-robin).
      try {
        const recipients = [
          ...new Set([
            ...HANDLOWCY.map((osoba) => osoba.emailPowiadomien.toLowerCase()),
            ...ALWAYS_NOTIFY_EMAILS,
          ]),
        ];

        await sendLeadNotificationEmail({
          to: recipients,
          ownerName: handlowiecLeada?.pelneImie || "Zespół ICAROS",
          leadName: name,
          phone,
          email,
          company: payload.company,
          nip: payload.nip,
          role: payload.role,
          message: payload.message,
          formSource,
          dealUrl: dealUrl(dealId),
        });
      } catch (notifyError: unknown) {
        console.error(
          "Lead notification email failed:",
          notifyError instanceof Error ? notifyError.message : notifyError
        );
      }
    }

    if (email) {
      try {
        await sendContactConfirmationEmail({
          to: email,
          recipientName: name,
          company: payload.company,
        });
      } catch (confirmationError: unknown) {
        console.error(
          "Contact confirmation email (Resend) failed:",
          confirmationError instanceof Error ? confirmationError.message : confirmationError
        );
      }

      // Wszyscy z mailem trafiają do Resend Audience dla widoczności w CRM,
      // ale tylko ze zgodą marketingową mają unsubscribed=false (czyli dostają broadcasty).
      try {
        await addContactToAudience(email, name, {
          unsubscribed: payload.marketingConsent !== true,
        });
      } catch (audienceError: unknown) {
        console.error(
          "Resend audience add failed:",
          audienceError instanceof Error ? audienceError.message : audienceError
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        dealId:
          createdDeal?.data && typeof createdDeal.data === "object" && "id" in createdDeal.data
            ? (createdDeal.data as { id: number }).id
            : undefined,
        ownerId,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: toErrorMessage(error, "Unexpected server error"),
      },
      { status: 500 }
    );
  }
}
