import fs from "node:fs";
import path from "node:path";

/**
 * Wspólna warstwa dostępu do Pipedrive.
 *
 * Korzystają z niej formularz kontaktowy i kalendarz rozmów, dzięki czemu
 * identyfikatory pól, wybór właściciela i obsługa limitów API są w jednym miejscu.
 */

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

export function getEnv(name: string) {
  return process.env[name] || (localEnv as Record<string, string>)[name];
}

export const API_TOKEN = getEnv("PIPEDRIVE_API_TOKEN");
export const DOMAIN = getEnv("PIPEDRIVE_COMPANY_DOMAIN");
const BASE_URL = DOMAIN ? `https://${DOMAIN}.pipedrive.com/api/v1` : "";

export const PIPELINE_ID = Number(getEnv("PIPEDRIVE_PIPELINE_ID") || "2");
export const STAGE_ID_NEW_LEAD = Number(getEnv("PIPEDRIVE_STAGE_ID_NEW_LEAD") || "6");

export const OWNER_A = Number(getEnv("PIPEDRIVE_OWNER_A_ID") || "25511085"); // Jaroslaw Lupiezowiec
export const OWNER_B = Number(getEnv("PIPEDRIVE_OWNER_B_ID") || "25511096"); // Sebastian Wilk
export const FALLBACK_OWNER = Number(getEnv("PIPEDRIVE_OWNER_FALLBACK_ID") || "25511096");

/** Adresy zawsze powiadamiane o nowym leadzie (oprócz przypisanego handlowca). */
export const ALWAYS_NOTIFY_EMAILS = (
  getEnv("LEAD_NOTIFY_EMAILS") || "stanislaw.drozniak@icaros.com.pl"
)
  .split(",")
  .map((address) => address.trim().toLowerCase())
  .filter(Boolean);

export type PipedriveResponse<T = unknown> = {
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

export type SearchItem = {
  item: {
    id: number;
    organization?: { id: number };
  };
};

export type PipedriveUser = {
  id: number;
  name?: string;
  email?: string;
};

/** Nastepny dzien roboczy w formacie YYYY-MM-DD (pomija sobote i niedziele). */
export function nextBusinessDay(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  const weekday = date.getDay();
  if (weekday === 6) date.setDate(date.getDate() + 2);
  else if (weekday === 0) date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

export async function callPipedrive<T = unknown>(
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

export function dealUrl(dealId: number): string | undefined {
  return DOMAIN ? `https://${DOMAIN}.pipedrive.com/deal/${dealId}` : undefined;
}

/** Znajduje organizację po dokładnej nazwie albo ją tworzy. */
export async function resolveOrganization(
  name: string,
  ownerId: number
): Promise<number | undefined> {
  const search = await callPipedrive<{ items?: SearchItem[] }>(
    `/organizations/search?term=${encodeURIComponent(
      name
    )}&fields=name&exact_match=true&limit=1`
  );

  const items = search.data?.items ?? [];
  if (items.length > 0) return items[0].item.id;

  const created = await callPipedrive<{ id: number }>("/organizations", {
    method: "POST",
    body: JSON.stringify({ name, owner_id: ownerId }),
  });
  return created?.data?.id;
}

/** Szuka osoby po mailu, a w razie braku po telefonie. */
export async function findPerson(
  email?: string,
  phone?: string
): Promise<SearchItem["item"] | undefined> {
  let search: PipedriveResponse<{ items?: SearchItem[] }> | null = null;

  if (email) {
    search = await callPipedrive(
      `/persons/search?term=${encodeURIComponent(email)}&fields=email&exact_match=true&limit=1`
    );
  } else if (phone) {
    search = await callPipedrive(
      `/persons/search?term=${encodeURIComponent(phone)}&fields=phone&exact_match=true&limit=1`
    );
  }

  return (search?.data?.items ?? [])[0]?.item;
}

export async function createPerson(options: {
  name: string;
  ownerId: number;
  orgId?: number;
  email?: string;
  phone?: string;
}): Promise<number | undefined> {
  const created = await callPipedrive<{ id: number }>("/persons", {
    method: "POST",
    body: JSON.stringify({
      name: options.name,
      owner_id: options.ownerId,
      org_id: options.orgId,
      email: options.email
        ? [{ value: options.email, primary: true, label: "work" }]
        : undefined,
      phone: options.phone
        ? [{ value: options.phone, primary: true, label: "work" }]
        : undefined,
    }),
  });
  return created?.data?.id;
}

/** Adresy e-mail obu handlowców, do powiadomień o leadzie. */
export async function ownerEmails(): Promise<{ users: PipedriveUser[]; emails: string[] }> {
  const response = await callPipedrive<PipedriveUser[]>("/users");
  const users = Array.isArray(response?.data) ? response.data : [];
  const emails = [OWNER_A, OWNER_B]
    .map((id) => users.find((user) => user.id === id)?.email)
    .filter((value): value is string => Boolean(value))
    .map((address) => address.toLowerCase());
  return { users, emails };
}
