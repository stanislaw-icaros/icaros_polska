import { Resend } from "resend";

/**
 * `skipped` oznacza brak konfiguracji Resend (np. lokalnie bez .env) - kontakt
 * nie trafił na listę, ale nie jest to błąd żądania.
 */
export type AudienceResult = { status: "added" | "updated" | "skipped" };

function getConfig(): { apiKey: string; audienceId: string } | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const audienceId = process.env.RESEND_AUDIENCE_ID?.trim();
  if (!apiKey || !audienceId) return null;
  return { apiKey, audienceId };
}

/**
 * Dodaje kontakt do listy w Resend.
 * `unsubscribed: true` oznacza, że kontakt jest widoczny na liście, ale nie
 * dostanie broadcastów - używamy tego dla osób bez zgody marketingowej,
 * żeby zachować widoczność lead-a w jednym miejscu (Resend automatycznie
 * pomija unsubscribed przy wysyłce kampanii).
 *
 * Bez RESEND_API_KEY / RESEND_AUDIENCE_ID działa jako no-op.
 * Błąd API Resend leci wyjątkiem - SDK zwraca go w polu `error`, a nie rzuca sam.
 */
export async function addContactToAudience(
  email: string,
  firstName?: string,
  options?: { unsubscribed?: boolean }
): Promise<AudienceResult> {
  const config = getConfig();
  if (!config) return { status: "skipped" };

  const resend = new Resend(config.apiKey);
  const { error } = await resend.contacts.create({
    email,
    firstName: firstName?.trim() || undefined,
    audienceId: config.audienceId,
    unsubscribed: options?.unsubscribed ?? false,
  });
  if (error) throw new Error(error.message);

  return { status: "added" };
}

/**
 * Zapis na newsletter: po tej operacji kontakt ma być na liście jako subscribed.
 * Adres może już tam być (np. trafił tam wcześniej bez zgody marketingowej,
 * z formularza kontaktowego, albo ktoś wypisał się i zapisuje ponownie),
 * dlatego najpierw sprawdzamy, czy istnieje, i wtedy go aktualizujemy.
 */
export async function subscribeToNewsletter(
  email: string,
  firstName?: string
): Promise<AudienceResult> {
  const config = getConfig();
  if (!config) return { status: "skipped" };

  const resend = new Resend(config.apiKey);
  const name = firstName?.trim() || undefined;

  const existing = await resend.contacts.get({
    email,
    audienceId: config.audienceId,
  });
  // 404 to normalna sytuacja (nowy adres); inny błąd oznacza problem z API.
  if (existing.error && existing.error.name !== "not_found") {
    throw new Error(existing.error.message);
  }

  if (existing.data) {
    const { error } = await resend.contacts.update({
      email,
      audienceId: config.audienceId,
      firstName: name,
      unsubscribed: false,
    });
    if (error) throw new Error(error.message);
    return { status: "updated" };
  }

  const { error } = await resend.contacts.create({
    email,
    firstName: name,
    audienceId: config.audienceId,
    unsubscribed: false,
  });
  if (error) throw new Error(error.message);
  return { status: "added" };
}
