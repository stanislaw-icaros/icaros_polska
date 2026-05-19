import { Resend } from "resend";

const BRAND_ORANGE = "#ff6600";
const BRAND_ORANGE_SOFT = "#ff7b1f";

const FONT_STACK =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type LeadNotificationData = {
  /** Imię i nazwisko handlowca, który obsługuje tego leada (round-robin). */
  ownerName: string;
  leadName?: string;
  phone?: string;
  email?: string;
  company?: string;
  nip?: string;
  role?: string;
  message?: string;
  formSource?: string;
  dealUrl?: string;
};

function dataRow(label: string, value: string | undefined): string {
  if (!value?.trim()) return "";
  return `<tr>
            <td class="email-muted" style="padding:9px 0;font-family:${FONT_STACK};font-size:12px;line-height:1.5;color:#a1a1aa;width:120px;vertical-align:top;border-bottom:1px solid rgba(10,10,10,0.06);">${escapeHtml(
              label
            )}</td>
            <td class="email-heading" style="padding:9px 0;font-family:${FONT_STACK};font-size:14px;line-height:1.5;color:#0a0a0a;font-weight:600;border-bottom:1px solid rgba(10,10,10,0.06);">${escapeHtml(
              value.trim()
            )}</td>
          </tr>`;
}

export function buildLeadNotificationEmailHtml(data: LeadNotificationData): string {
  const phoneBlock = data.phone?.trim()
    ? `<tr>
            <td style="padding:18px 40px 0 40px;font-family:${FONT_STACK};">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="email-box" style="background-color:rgba(255,102,0,0.06);border:1px solid rgba(255,102,0,0.2);border-radius:12px;">
                <tr>
                  <td style="padding:16px 20px;font-family:${FONT_STACK};">
                    <p class="email-brand" style="margin:0 0 4px 0;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${BRAND_ORANGE};">Zadzwoń pod numer</p>
                    <a href="tel:${escapeHtml(data.phone.trim().replace(/\s+/g, ""))}" class="email-heading" style="font-family:${FONT_STACK};font-size:22px;font-weight:700;letter-spacing:-0.01em;color:#0a0a0a;text-decoration:none;">${escapeHtml(
                      data.phone.trim()
                    )}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`
    : "";

  const messageBlock = data.message?.trim()
    ? `<tr>
            <td style="padding:20px 40px 0 40px;font-family:${FONT_STACK};">
              <p class="email-muted" style="margin:0 0 6px 0;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#a1a1aa;">Szczegóły zgłoszenia</p>
              <div class="email-text" style="font-family:${FONT_STACK};font-size:13px;line-height:1.65;color:#3f3f46;white-space:pre-wrap;">${escapeHtml(
                data.message.trim()
              )}</div>
            </td>
          </tr>`
    : "";

  const dealButton = data.dealUrl
    ? `<tr>
            <td align="center" style="padding:28px 40px 4px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                <tr>
                  <td align="center" style="background-color:${BRAND_ORANGE};background-image:linear-gradient(135deg, ${BRAND_ORANGE} 0%, ${BRAND_ORANGE_SOFT} 100%);">
                    <a href="${escapeHtml(
                      data.dealUrl
                    )}" target="_blank" style="display:block;padding:16px 40px;font-family:${FONT_STACK};font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">
                      Otwórz deal w Pipedrive
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="pl" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>Nowy lead z formularza</title>
  <style type="text/css">
    :root { color-scheme: light dark; supported-color-schemes: light dark; }
    a { text-decoration: none; }
    @media (prefers-color-scheme: dark) {
      .email-body { background-color: #0a0a0a !important; }
      .email-card { background-color: #161616 !important; border-color: rgba(255,255,255,0.08) !important; }
      .email-heading { color: #fafafa !important; }
      .email-text { color: #d4d4d8 !important; }
      .email-muted { color: #a1a1aa !important; border-bottom-color: rgba(255,255,255,0.08) !important; }
      .email-foot { color: #8a8a93 !important; border-top-color: rgba(255,255,255,0.08) !important; }
      .email-brand { color: #ff8c42 !important; }
      .email-box { background-color: rgba(255,102,0,0.12) !important; border-color: rgba(255,102,0,0.3) !important; }
      .email-copyright { color: #5c5c63 !important; }
    }
  </style>
</head>
<body class="email-body" style="margin:0;padding:0;background-color:#f4f4f5;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
    Nowy lead kontaktowy - obsługuje ${escapeHtml(data.ownerName)}.
  </div>
  <table role="presentation" class="email-body" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f5;margin:0;padding:32px 16px;">
    <tr>
      <td align="center" style="padding:0;">
        <table role="presentation" class="email-card" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background-color:#ffffff;border:1px solid rgba(10,10,10,0.06);border-radius:16px;overflow:hidden;box-shadow:0 20px 50px rgba(10,10,10,0.08);">
          <tr>
            <td style="padding:0;background:linear-gradient(135deg, ${BRAND_ORANGE} 0%, ${BRAND_ORANGE_SOFT} 100%);height:4px;line-height:4px;font-size:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:34px 40px 0 40px;font-family:${FONT_STACK};">
              <p class="email-brand" style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.28em;text-transform:uppercase;color:${BRAND_ORANGE};">ICAROS POLSKA</p>
              <p class="email-muted" style="margin:7px 0 0 0;font-size:11px;font-weight:600;letter-spacing:0.24em;text-transform:uppercase;color:#a1a1aa;border:0;">Nowy lead z formularza</p>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 40px 0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(135deg, ${BRAND_ORANGE} 0%, ${BRAND_ORANGE_SOFT} 100%);border-radius:12px;">
                <tr>
                  <td style="padding:16px 22px;font-family:${FONT_STACK};">
                    <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:rgba(255,255,255,0.85);">Ten lead obsługuje</p>
                    <p style="margin:4px 0 0 0;font-size:21px;font-weight:700;letter-spacing:-0.02em;color:#ffffff;">${escapeHtml(
                      data.ownerName
                    )}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="email-heading" style="padding:22px 40px 0 40px;font-family:${FONT_STACK};font-size:22px;font-weight:700;letter-spacing:-0.02em;line-height:1.2;color:#0a0a0a;">
              ${escapeHtml(data.company?.trim() || data.leadName?.trim() || "Nowe zgłoszenie kontaktowe")}
            </td>
          </tr>
          ${phoneBlock}
          <tr>
            <td style="padding:14px 40px 0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${dataRow("Osoba", data.leadName)}
                ${dataRow("E-mail", data.email)}
                ${dataRow("Placówka", data.company)}
                ${dataRow("NIP", data.nip)}
                ${dataRow("Rola", data.role)}
                ${dataRow("Źródło", data.formSource)}
              </table>
            </td>
          </tr>
          ${messageBlock}
          ${dealButton}
          <tr>
            <td class="email-foot" style="padding:30px 40px 34px 40px;font-family:${FONT_STACK};font-size:12px;line-height:1.65;color:#8a8a93;border-top:1px solid rgba(10,10,10,0.06);margin-top:18px;">
              Automatyczne powiadomienie o nowym zgłoszeniu z formularza na icaros.com.pl.<br />
              Przypisanie do handlowca jest naprzemienne (round-robin) - dzwoni osoba wskazana powyżej.
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

export async function sendLeadNotificationEmail(
  params: LeadNotificationData & { to: string[] }
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM?.trim();
  if (!apiKey || !from || params.to.length === 0) {
    return;
  }

  const resend = new Resend(apiKey);
  const label = params.company?.trim() || params.leadName?.trim() || "zgłoszenie";

  await resend.emails.send({
    from,
    to: params.to,
    subject: `Nowy lead: ${label} - obsługuje ${params.ownerName}`,
    html: buildLeadNotificationEmailHtml(params),
    replyTo: "kontakt@icaros.com.pl",
  });
}
