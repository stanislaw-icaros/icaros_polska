import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

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

const PIPELINE_ID = Number(getEnv("PIPEDRIVE_PIPELINE_ID") || "2");
const STAGE_ID_NEW_LEAD = Number(getEnv("PIPEDRIVE_STAGE_ID_NEW_LEAD") || "6");

const OWNER_A = Number(getEnv("PIPEDRIVE_OWNER_A_ID") || "25511085"); // Jaroslaw Lupiezowiec
const OWNER_B = Number(getEnv("PIPEDRIVE_OWNER_B_ID") || "25511096"); // Sebastian Wilk
const FALLBACK_OWNER = Number(getEnv("PIPEDRIVE_OWNER_FALLBACK_ID") || "25511096");

type PipedriveResponse<T = unknown> = {
  success?: boolean;
  error?: string;
  error_info?: string;
  data?: T;
  additional_data?: {
    pagination?: {
      more_items_in_collection?: boolean;
      next_start?: number;
    };
  };
};

type SearchItem = {
  item: {
    id: number;
    organization?: { id: number };
  };
};

type DealListItem = {
  owner_id?: { id: number };
};

function toErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) return error.message;
  return fallback;
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
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
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
      // keep raw text for richer errors
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

function getHashBasedOwner(seed: string) {
  const hash = [...seed.toLowerCase()].reduce(
    (acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0,
    0
  );
  return Math.abs(hash) % 2 === 0 ? OWNER_A : OWNER_B;
}

async function chooseOwnerId() {
  try {
    // Stateless round-robin: look at the most recently created deal owner
    // and alternate between two configured owners.
    const recentDeals = await callPipedrive<DealListItem[]>(
      `/deals?limit=20&sort=add_time DESC`
    );

    const deals = Array.isArray(recentDeals?.data)
      ? (recentDeals.data as DealListItem[])
      : [];
    const lastAssigned = deals.find((deal) => deal?.owner_id?.id === OWNER_A || deal?.owner_id?.id === OWNER_B);

    if (lastAssigned?.owner_id?.id === OWNER_A) return OWNER_B;
    if (lastAssigned?.owner_id?.id === OWNER_B) return OWNER_A;
  } catch {
    // fallback below
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

    let personId: number | undefined;
    let orgId: number | undefined;
    const ownerId = (await chooseOwnerId()) || getHashBasedOwner(ownerSeed) || FALLBACK_OWNER;

    let personSearch: PipedriveResponse<{ items?: SearchItem[] }> | null = null;
    if (email) {
      personSearch = await callPipedrive(
        `/persons/search?term=${encodeURIComponent(email)}&fields=email&exact_match=true&limit=1`
      );
    } else if (phone) {
      personSearch = await callPipedrive(
        `/persons/search?term=${encodeURIComponent(phone)}&fields=phone&exact_match=true&limit=1`
      );
    }

    const personItems = personSearch?.data?.items ?? [];
    if (personItems.length > 0) {
      const existingPerson = personItems[0].item;
      personId = existingPerson.id;
      orgId = existingPerson.organization?.id;
    } else {
      if (payload.company?.trim()) {
        const orgSearch = await callPipedrive<{ items?: SearchItem[] }>(
          `/organizations/search?term=${encodeURIComponent(
            payload.company.trim()
          )}&fields=name&exact_match=true&limit=1`
        );

        const orgItems = orgSearch.data?.items ?? [];
        if (orgItems.length > 0) {
          orgId = orgItems[0].item.id;
        } else {
          const createdOrg = await callPipedrive<{ id: number }>("/organizations", {
            method: "POST",
            body: JSON.stringify({
              name: payload.company.trim(),
              owner_id: ownerId,
            }),
          });
          orgId = createdOrg?.data?.id;
        }
      }

      const createdPerson = await callPipedrive<{ id: number }>("/persons", {
        method: "POST",
        body: JSON.stringify({
          name,
          owner_id: ownerId,
          org_id: orgId,
          email: email ? [{ value: email, primary: true, label: "work" }] : undefined,
          phone: phone ? [{ value: phone, primary: true, label: "work" }] : undefined,
        }),
      });
      personId = createdPerson?.data?.id;
    }

    if (!personId) {
      throw new Error("Could not resolve person_id.");
    }

    const customFields: Record<string, string | undefined> = {};
    const leadSource = payload.leadSource || "Formularz WWW";
    const formSource = payload.formSource || "Strona główna — formularz główny";

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
      ? `ICAROS — ${payload.company.trim()}`
      : `ICAROS — ${name}`;

    const createdDeal = await callPipedrive<{ id: number }>("/deals", {
      method: "POST",
      body: JSON.stringify({
        title: dealTitle,
        user_id: ownerId,
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
