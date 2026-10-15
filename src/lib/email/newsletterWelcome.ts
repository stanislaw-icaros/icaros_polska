import { Resend } from "resend";
import { NEWSLETTER_LEAD } from "@/lib/newsletter";
import { buildUnsubscribeLinks } from "@/lib/email/unsubscribe";

const BRAND_ORANGE = "#ff6600";
const BRAND_ORANGE_SOFT = "#ff7b1f";

const FONT_STACK =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

const CONTACT_EMAIL = "kontakt@icaros.com.pl";

export const NEWSLETTER_WELCOME_SUBJECT = "Jesteś na liście · ICAROS Polska";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Potwierdzenie zapisu na listę. Krótka wiadomość: podziękowanie, ta sama
 * obietnica co na stronie zapisu i widoczny link do wypisania się.
 * Bez linku (brak sekretu podpisu) zostaje odnośnik do napisania maila.
 */
export function buildNewsletterWelcomeEmailHtml(options: {
  firstName?: string;
  unsubscribeUrl?: string;
}): string {
  const greeting = options.firstName?.trim()
    ? `, ${escapeHtml(options.firstName.trim())}`
    : "";
  const optOut = options.unsubscribeUrl
    ? `Nie chcesz tych wiadomości?
              <a href="${options.unsubscribeUrl}" target="_blank" class="email-link" style="color:${BRAND_ORANGE};text-decoration:underline;font-weight:600;">Wypisz się z listy</a>.
              Zajmuje to jedno kliknięcie, bez podawania powodu.`
    : `Nie chcesz tych wiadomości? Napisz jedno słowo na
              <a href="mailto:${CONTACT_EMAIL}" class="email-link" style="color:${BRAND_ORANGE};text-decoration:underline;font-weight:600;">${CONTACT_EMAIL}</a>
              i usuwamy adres z listy.`;

  return `<!DOCTYPE html>
<html lang="pl" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>Jesteś na liście · ICAROS Polska</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style type="text/css">
    :root { color-scheme: light dark; supported-color-schemes: light dark; }
    a { text-decoration: none; }
    @media (prefers-color-scheme: dark) {
      .email-body { background-color: #0a0a0a !important; }
      .email-card { background-color: #161616 !important; border-color: rgba(255,255,255,0.08) !important; box-shadow: 0 24px 56px rgba(0,0,0,0.5) !important; }
      .email-heading { color: #fafafa !important; }
      .email-text { color: #d4d4d8 !important; }
      .email-muted { color: #a1a1aa !important; }
      .email-eyebrow { color: #a1a1aa !important; }
      .email-foot { color: #8a8a93 !important; border-top-color: rgba(255,255,255,0.08) !important; }
      .email-brand { color: #ff8c42 !important; }
      .email-link { color: #ff8c42 !important; }
      .email-copyright { color: #5c5c63 !important; }
    }
  </style>
</head>
<body class="email-body" style="margin:0;padding:0;background-color:#f4f4f5;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
    Potwierdzamy zapis na listę ICAROS Polska.
  </div>
  <table role="presentation" class="email-body" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f5;margin:0;padding:32px 16px;">
    <tr>
      <td align="center" style="padding:0;">
        <table role="presentation" class="email-card" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background-color:#ffffff;border:1px solid rgba(10,10,10,0.06);border-radius:16px;overflow:hidden;box-shadow:0 20px 50px rgba(10,10,10,0.08);">
          <tr>
            <td style="padding:0;background:linear-gradient(135deg, ${BRAND_ORANGE} 0%, ${BRAND_ORANGE_SOFT} 100%);height:4px;line-height:4px;font-size:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:38px 40px 0 40px;font-family:${FONT_STACK};">
              <p class="email-brand" style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.28em;text-transform:uppercase;color:${BRAND_ORANGE};">ICAROS POLSKA</p>
              <p class="email-eyebrow" style="margin:7px 0 0 0;font-size:11px;font-weight:600;letter-spacing:0.24em;text-transform:uppercase;color:#a1a1aa;">Potwierdzenie zapisu</p>
            </td>
          </tr>
          <tr>
            <td class="email-heading" style="padding:14px 40px 0 40px;font-family:${FONT_STACK};font-size:27px;font-weight:700;letter-spacing:-0.03em;line-height:1.15;color:#0a0a0a;">
              Dziękujemy${greeting}
            </td>
          </tr>
          <tr>
            <td class="email-text" style="padding:13px 40px 0 40px;font-family:${FONT_STACK};font-size:16px;line-height:1.65;color:#3f3f46;">
              Twój adres jest na liście ICAROS Polska. ${escapeHtml(NEWSLETTER_LEAD)}
            </td>
          </tr>
          <tr>
            <td class="email-text" style="padding:20px 40px 0 40px;font-family:${FONT_STACK};font-size:15px;line-height:1.65;color:#52525b;">
              Wiadomości przychodzą z adresu
              <a href="mailto:${CONTACT_EMAIL}" class="email-link" style="color:${BRAND_ORANGE};text-decoration:none;font-weight:600;">${CONTACT_EMAIL}</a>.
              Warto dodać go do kontaktów i można na niego po prostu odpowiedzieć.
            </td>
          </tr>
          <tr>
            <td class="email-muted" style="padding:24px 40px 0 40px;font-family:${FONT_STACK};font-size:14px;line-height:1.7;color:#71717a;">
              ${optOut}
            </td>
          </tr>
          <tr>
            <td class="email-foot" style="padding:30px 40px 36px 40px;font-family:${FONT_STACK};font-size:12px;line-height:1.65;color:#8a8a93;border-top:1px solid rgba(10,10,10,0.06);">
              ICAROS Polska - oficjalny dystrybutor ICAROS w Polsce.<br />
              Otrzymujesz tę wiadomość, ponieważ ten adres został zapisany na listę na icaros.com.pl.
            </td>
          </tr>
        </table>
        <p class="email-copyright" style="margin:20px 0 0 0;font-family:${FONT_STACK};font-size:11px;color:#a1a1aa;text-align:center;">
          © ${new Date().getFullYear()} ICAROS Polska
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Wersja tekstowa: część klientów pokazuje ją zamiast HTML-a. */
export function buildNewsletterWelcomeEmailText(options: {
  firstName?: string;
  unsubscribeUrl?: string;
}): string {
  const greeting = options.firstName?.trim() ? `, ${options.firstName.trim()}` : "";
  const optOut = options.unsubscribeUrl
    ? `Nie chcesz tych wiadomości? Wypisz się z listy: ${options.unsubscribeUrl}`
    : `Nie chcesz tych wiadomości? Napisz na ${CONTACT_EMAIL} i usuwamy adres z listy.`;

  return `ICAROS POLSKA
Potwierdzenie zapisu

Dziękujemy${greeting}

Twój adres jest na liście ICAROS Polska. ${NEWSLETTER_LEAD}

Wiadomości przychodzą z adresu ${CONTACT_EMAIL}. Warto dodać go do kontaktów i można na niego po prostu odpowiedzieć.

${optOut}

ICAROS Polska - oficjalny dystrybutor ICAROS w Polsce.
Otrzymujesz tę wiadomość, ponieważ ten adres został zapisany na listę na icaros.com.pl.`;
}

/**
 * Bez RESEND_API_KEY / RESEND_FROM działa jako no-op (np. lokalnie bez .env).
 * Nagłówki List-Unsubscribe dają przycisk „Wypisz się” w Gmailu i Apple Mail,
 * który wypisuje adres bez wchodzenia na stronę (RFC 8058).
 */
export async function sendNewsletterWelcomeEmail(params: {
  to: string;
  firstName?: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM?.trim();
  if (!apiKey || !from) return;

  const links = buildUnsubscribeLinks(params.to);
  const resend = new Resend(apiKey);

  await resend.emails.send({
    from,
    to: params.to,
    subject: NEWSLETTER_WELCOME_SUBJECT,
    html: buildNewsletterWelcomeEmailHtml({
      firstName: params.firstName,
      unsubscribeUrl: links?.page,
    }),
    text: buildNewsletterWelcomeEmailText({
      firstName: params.firstName,
      unsubscribeUrl: links?.page,
    }),
    replyTo: CONTACT_EMAIL,
    headers: links
      ? {
          "List-Unsubscribe": `<${links.oneClick}>, <mailto:${CONTACT_EMAIL}?subject=Wypisz%20mnie%20z%20newslettera>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        }
      : undefined,
  });
}
