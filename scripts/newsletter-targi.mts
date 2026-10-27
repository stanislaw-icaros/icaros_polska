/**
 * Kampania: zaproszenia na targi w Nadarzynie (wrzesień/październik 2026).
 *
 *   node --env-file=.env.local scripts/newsletter-targi.mts render
 *   node --env-file=.env.local scripts/newsletter-targi.mts test [adres]
 *   node --env-file=.env.local scripts/newsletter-targi.mts preview <adres> [adres...]
 *   node --env-file=.env.local scripts/newsletter-targi.mts draft
 *   node --env-file=.env.local scripts/newsletter-targi.mts send --confirm
 *
 * `send` bez --confirm nic nie robi. Broadcast leci wyłącznie do kontaktów
 * subscribed w audience, więc osoby bez zgody marketingowej są pomijane.
 */
import { writeFileSync } from "node:fs";
import { Resend } from "resend";
import {
  NEWSLETTER_PREVIEW_TEXT,
  NEWSLETTER_REPLY_TO,
  NEWSLETTER_SUBJECT,
  buildNewsletterTargiHtml,
  buildNewsletterTargiText,
  sendNewsletterTargiCopy,
  sendNewsletterTargiTest,
} from "../src/lib/email/newsletterTargi2026.ts";

const BROADCAST_NAME = "Targi Nadarzyn 2026 - zaproszenia VIP";
const DEFAULT_TEST_TO = "stanislaw.drozniak@icaros.com.pl";

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

/** Ilu odbiorców realnie dostanie broadcast. */
async function audienceStats() {
  const res = await client().contacts.list({ audienceId: segmentId() });
  const rows = res.data?.data ?? [];
  const subscribed = rows.filter((c) => !c.unsubscribed);
  return { total: rows.length, subscribed: subscribed.length };
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
    const out = "/private/tmp/claude-502/-Users-stanislawdrozniak-strony-www-icaros-polska/fe1168af-494a-43c7-a07e-4bda3556c007/scratchpad/newsletter-targi.html";
    writeFileSync(
      out,
      buildNewsletterTargiHtml({
        unsubscribeUrl: "https://www.icaros.com.pl/#test-linku-rezygnacji",
      })
    );
    console.log("Podgląd HTML:", out);
    break;
  }

  case "test": {
    const to = rest[0] || DEFAULT_TEST_TO;
    const id = await sendNewsletterTargiTest(to);
    console.log(`Mail testowy wysłany do ${to} (id: ${id})`);
    break;
  }

  case "preview": {
    if (rest.length === 0) throw new Error("Podaj co najmniej jeden adres");
    // Poza broadcastem: nikogo nie dopisujemy do audience, nikt nie trafia na listę.
    const sent = await sendNewsletterTargiCopy(rest);
    for (const s of sent) console.log(`Podgląd wysłany do ${s.to} (id: ${s.id})`);
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
      from: process.env.RESEND_FROM!.trim(),
      replyTo: NEWSLETTER_REPLY_TO,
      subject: NEWSLETTER_SUBJECT,
      previewText: NEWSLETTER_PREVIEW_TEXT,
      html: buildNewsletterTargiHtml({}),
      text: buildNewsletterTargiText({}),
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
          `(${stats.total} kontaktów na liście, ${stats.total - stats.subscribed} bez zgody / wypisanych).`
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
