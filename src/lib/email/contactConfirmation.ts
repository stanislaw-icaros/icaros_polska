import { Resend } from "resend";

const BRAND_ORANGE = "#ff6600";
const BRAND_ORANGE_SOFT = "#ff7b1f";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function firstNameFromFullName(fullName: string): string {
  const trimmed = fullName.trim();
  if (!trimmed) return "";
  return trimmed.split(/\s+/)[0] || trimmed;
}

export function buildContactConfirmationEmailHtml(options: {
  recipientName: string;
  company?: string;
}): string {
  const greetingName = escapeHtml(firstNameFromFullName(options.recipientName) || options.recipientName.trim());
  const companyLine =
    options.company?.trim() ?
      `<tr>
          <td class="email-muted muted-text" style="padding: 0 40px 8px 40px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #52525b;">
            Placówka / firma: <strong class="email-strong strong-text" style="font-weight: 600; color: #0a0a0a;">${escapeHtml(options.company.trim())}</strong>
          </td>
        </tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="pl" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>Potwierdzenie zgłoszenia — ICAROS Polska</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style type="text/css">
    :root { color-scheme: light dark; supported-color-schemes: light dark; }
    @media (prefers-color-scheme: dark) {
      .email-body { background-color: #0a0a0a !important; }
      .email-card { background-color: #141414 !important; border-color: rgba(255,255,255,0.08) !important; box-shadow: 0 24px 48px rgba(0,0,0,0.45) !important; }
      .email-heading { color: #fafafa !important; }
      .email-text { color: #d4d4d8 !important; }
      .muted-text { color: #a1a1aa !important; }
      .strong-text { color: #fafafa !important; }
      .email-foot { color: #71717a !important; border-top-color: rgba(255,255,255,0.08) !important; }
      .email-badge { background-color: rgba(255,102,0,0.12) !important; border-color: rgba(255,102,0,0.35) !important; }
      .email-badge-text { color: #fdba74 !important; }
      .email-link { color: #fdba74 !important; }
      .email-brand { color: #ff8c42 !important; }
      .email-copyright { color: #52525b !important; }
    }
  </style>
</head>
<body class="email-body" style="margin:0;padding:0;background-color:#f4f4f5;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
    Dziękujemy za zgłoszenie — ICAROS Polska. Odezwiemy się tak szybko, jak to możliwe.
  </div>
  <table role="presentation" class="email-body" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f5;margin:0;padding:32px 16px;">
    <tr>
      <td align="center" style="padding:0;">
        <table role="presentation" class="email-card" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background-color:#ffffff;border:1px solid rgba(10,10,10,0.06);border-radius:16px;overflow:hidden;box-shadow:0 20px 50px rgba(10,10,10,0.08);">
          <tr>
            <td style="padding:0;background:linear-gradient(135deg, ${BRAND_ORANGE} 0%, ${BRAND_ORANGE_SOFT} 100%);height:4px;line-height:4px;font-size:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:36px 40px 8px 40px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
              <p class="email-brand" style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.28em;text-transform:uppercase;color:${BRAND_ORANGE};">ICAROS POLSKA</p>
              <p class="muted-text" style="margin:8px 0 0 0;font-size:11px;font-weight:600;letter-spacing:0.28em;text-transform:uppercase;color:#a1a1aa;">Potwierdzenie zgłoszenia</p>
            </td>
          </tr>
          <tr>
            <td class="email-heading" style="padding:0 40px 8px 40px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:26px;font-weight:700;letter-spacing:-0.03em;line-height:1.15;color:#0a0a0a;">
              Dziękujemy, ${greetingName}
            </td>
          </tr>
          <tr>
            <td class="email-text" style="padding:12px 40px 0 40px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:16px;line-height:1.65;color:#3f3f46;">
              Otrzymaliśmy Twoje zgłoszenie z formularza na stronie. Wszystko dotarło do nas poprawnie — możesz być spokojny o przesłane dane.
            </td>
          </tr>
          <tr>
            <td style="padding:28px 40px 0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="email-badge" style="background-color:rgba(255,102,0,0.06);border:1px solid rgba(255,102,0,0.2);border-radius:12px;">
                <tr>
                  <td style="padding:18px 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                    <p class="email-badge-text" style="margin:0 0 6px 0;font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:${BRAND_ORANGE};">Następny krok</p>
                    <p class="email-text" style="margin:0;font-size:15px;line-height:1.6;color:#3f3f46;">
                      Skontaktujemy się z Tobą <strong class="email-strong strong-text" style="font-weight:600;color:#0a0a0a;">tak szybko, jak to możliwe</strong> — zwykle w ciągu jednego dnia roboczego. Jeśli sprawa jest pilna, odpowiadamy jeszcze szybciej.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ${companyLine}
          <tr>
            <td class="email-text" style="padding:24px 40px 0 40px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.65;color:#52525b;">
              Tymczasem, jeśli masz dodatkowe pytania, napisz na
              <a href="mailto:kontakt@icaros.com.pl" class="email-link" style="color:${BRAND_ORANGE};text-decoration:none;font-weight:600;">kontakt@icaros.com.pl</a>
              — chętnie pomożemy.
            </td>
          </tr>
          <tr>
            <td class="email-foot" style="padding:32px 40px 36px 40px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:#71717a;border-top:1px solid rgba(10,10,10,0.06);margin-top:8px;">
              ICAROS Polska — oficjalny dystrybutor ICAROS w Polsce.<br />
              Ta wiadomość jest automatycznym potwierdzeniem zgłoszenia; nie musisz na nią odpowiadać.
            </td>
          </tr>
        </table>
        <p class="email-copyright" style="margin:20px 0 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:11px;color:#a1a1aa;text-align:center;max-width:480px;">
          © ${new Date().getFullYear()} ICAROS Polska
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildContactConfirmationSubject(recipientName: string): string {
  const name = firstNameFromFullName(recipientName) || recipientName.trim() || "Państwo";
  return `Dziękujemy, ${name} — odezwiemy się wkrótce · ICAROS Polska`;
}

export async function sendContactConfirmationEmail(params: {
  to: string;
  recipientName: string;
  company?: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM?.trim();
  if (!apiKey || !from) {
    return;
  }

  const resend = new Resend(apiKey);
  const html = buildContactConfirmationEmailHtml({
    recipientName: params.recipientName,
    company: params.company,
  });
  const subject = buildContactConfirmationSubject(params.recipientName);

  await resend.emails.send({
    from,
    to: params.to,
    subject,
    html,
    replyTo: "kontakt@icaros.com.pl",
  });
}
