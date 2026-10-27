/**
 * Kampania: newsletter ICAROS Polska, październik 2026.
 *
 *   node --env-file=.env.local scripts/newsletter-2026-10.mts render
 *   node --env-file=.env.local scripts/newsletter-2026-10.mts test [adres]
 *   node --env-file=.env.local scripts/newsletter-2026-10.mts preview <adres> [adres...]
 *   node --env-file=.env.local scripts/newsletter-2026-10.mts draft
 *   node --env-file=.env.local scripts/newsletter-2026-10.mts send --confirm
 *
 * `send` bez --confirm nic nie wysyła, tylko liczy odbiorców. Broadcast leci
 * wyłącznie do kontaktów subscribed, więc osoby bez zgody są pomijane.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Resend } from "resend";

const HERE = dirname(fileURLToPath(import.meta.url));
const CAMPAIGN_DIR = join(HERE, "..", "src", "lib", "email", "campaigns");

const BROADCAST_NAME = "Newsletter ICAROS Polska - październik 2026";
const SUBJECT =
  "ICAROS Guardian w badaniu nad chorobą Parkinsona i nowy tryb wieloosobowy";
/** Preheader jest już wbudowany w HTML, Resend nie musi go dostawać osobno. */
const PREVIEW_TEXT =
  "Pierwsze wyniki badania ICAROS Guardian u osób z chorobą Parkinsona, tryb wieloosobowy w ICAROS App i medal Quality & Innovation.";
const REPLY_TO = "kontakt@icaros.com.pl";
const DEFAULT_TEST_TO = "stanislaw.drozniak@icaros.com.pl";

/** Placeholder Resend działa tylko w broadcastach, poza nimi podstawiamy zwykły URL. */
const UNSUB_PLACEHOLDER = "{{{RESEND_UNSUBSCRIBE_URL}}}";
const FALLBACK_UNSUB_URL = "https://www.icaros.com.pl/newsletter#rezygnacja";

const html = readFileSync(join(CAMPAIGN_DIR, "newsletter-2026-10.html"), "utf8");
const text = readFileSync(join(CAMPAIGN_DIR, "newsletter-2026-10.txt"), "utf8");

if (!html.includes(UNSUB_PLACEHOLDER) || !text.includes(UNSUB_PLACEHOLDER)) {
  throw new Error("Brak placeholdera rezygnacji w HTML albo w wersji tekstowej");
}

function withFallbackUnsub(body: string): string {
  return body.split(UNSUB_PLACEHOLDER).join(FALLBACK_UNSUB_URL);
}

function client(): Resend {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) throw new Error("Brak RESEND_API_KEY");
  return new Resend(apiKey);
}

function segmentId(): string {
  const id = process.env.RESEND_AUDIENCE_ID?.trim();
  if (!id) throw new Error("Brak RESEND_AUDIENCE_ID");
  return id;
}

function from(): string {
  const value = process.env.RESEND_FROM?.trim();
  if (!value) throw new Error("Brak RESEND_FROM");
  return value;
}

async function audienceStats() {
  const res = await client().contacts.list({ audienceId: segmentId() });
  const rows = res.data?.data ?? [];
  return {
    total: rows.length,
    subscribed: rows.filter((c) => !c.unsubscribed).length,
  };
}

/** Wysyłka poza broadcastem, pojedynczo, bez dopisywania kogokolwiek do listy. */
async function sendCopies(recipients: string[], subjectPrefix?: string) {
  const resend = client();
  const subject = subjectPrefix ? `${subjectPrefix} ${SUBJECT}` : SUBJECT;
  for (const to of recipients) {
    const res = await resend.emails.send({
      from: from(),
      to,
      subject,
      html: withFallbackUnsub(html),
      text: withFallbackUnsub(text),
      replyTo: REPLY_TO,
    });
    if (res.error) throw new Error(`${to}: ${res.error.message}`);
    console.log(`Wysłane do ${to} (id: ${res.data?.id})`);
  }
}

async function findDraft(): Promise<string | null> {
  const res = await client().broadcasts.list();
  const match = (res.data?.data ?? []).find(
    (b) => b.name === BROADCAST_NAME && b.status === "draft"
  );
  return match?.id ?? null;
}

const [command, ...rest] = process.argv.slice(2);

switch (command) {
  case "render": {
    const out = rest[0];
    if (!out) throw new Error("Podaj ścieżkę wyjściową, np. render /tmp/podglad.html");
    writeFileSync(out, withFallbackUnsub(html));
    console.log("Podgląd HTML:", out);
    break;
  }

  case "test":
    await sendCopies([rest[0] || DEFAULT_TEST_TO], "[TEST]");
    break;

  case "preview": {
    if (rest.length === 0) throw new Error("Podaj co najmniej jeden adres");
    await sendCopies(rest);
    break;
  }

  case "draft": {
    const existing = await findDraft();
    if (existing) {
      console.log(`Draft już istnieje: ${existing} (nie tworzę drugiego)`);
      break;
    }
    const res = await client().broadcasts.create({
      name: BROADCAST_NAME,
      segmentId: segmentId(),
      from: from(),
      replyTo: REPLY_TO,
      subject: SUBJECT,
      previewText: PREVIEW_TEXT,
      html,
      text,
    });
    if (res.error) throw new Error(res.error.message);
    console.log(`Draft broadcastu utworzony: ${res.data?.id}`);
    break;
  }

  case "send": {
    const stats = await audienceStats();
    if (!rest.includes("--confirm")) {
      console.log(
        `WSTRZYMANE. Bez --confirm nic nie wysyłam.\n` +
          `Broadcast poszedłby do ${stats.subscribed} odbiorców ` +
          `(${stats.total} kontaktów, ${stats.total - stats.subscribed} bez zgody / wypisanych).`
      );
      break;
    }
    const id = await findDraft();
    if (!id) throw new Error("Brak draftu. Najpierw: draft");
    const res = await client().broadcasts.send(id);
    if (res.error) throw new Error(res.error.message);
    console.log(`Wysłane do ${stats.subscribed} odbiorców. Broadcast: ${id}`);
    break;
  }

  default:
    console.log(
      "Użycie: render | test [adres] | preview <adres...> | draft | send --confirm"
    );
}
