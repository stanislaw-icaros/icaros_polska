import { Resend } from "resend";

/**
 * Dodaje kontakt do listy nurture w Resend (audience).
 * Wywoływać wyłącznie dla osób, które wyraziły zgodę marketingową.
 * Bez RESEND_API_KEY / RESEND_AUDIENCE_ID działa jako no-op.
 */
/**
 * Dodaje kontakt do listy w Resend.
 * `unsubscribed: true` oznacza, że kontakt jest widoczny na liście, ale nie
 * dostanie broadcastów - używamy tego dla osób bez zgody marketingowej,
 * żeby zachować widoczność lead-a w jednym miejscu (Resend automatycznie
 * pomija unsubscribed przy wysyłce kampanii).
 */
export async function addContactToAudience(
  email: string,
  firstName?: string,
  options?: { unsubscribed?: boolean }
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const audienceId = process.env.RESEND_AUDIENCE_ID?.trim();
  if (!apiKey || !audienceId) return;

  const resend = new Resend(apiKey);
  await resend.contacts.create({
    email,
    firstName: firstName?.trim() || undefined,
    audienceId,
    unsubscribed: options?.unsubscribed ?? false,
  });
}
