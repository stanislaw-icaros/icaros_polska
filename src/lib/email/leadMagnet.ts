import { Resend } from "resend";

const BRAND_ORANGE = "#ff6600";
const BRAND_ORANGE_SOFT = "#ff7b1f";

/** Publiczny adres raportu PDF (plik w /public). Nadpisywalny przez env. */
const REPORT_PDF_URL =
  process.env.LEAD_MAGNET_PDF_URL?.trim() ||
  "https://www.icaros.com.pl/raport-vr-rehabilitacja.pdf";

const UNSUBSCRIBE_MAILTO =
  "mailto:kontakt@icaros.com.pl?subject=Rezygnacja%20z%20materia%C5%82%C3%B3w%20ICAROS";

const FONT_STACK =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

const REPORT_HIGHLIGHTS = [
  "Realne dane finansowe i modele leasingu dla placówek",
  "Wyniki 9 badań klinicznych nad terapią w VR",
  "Doświadczenia 100+ klinik rehabilitacyjnych w Europie",
];

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildLeadMagnetEmailHtml(options: {
  company?: string;
  firstName?: string;
}): string {
  const greeting = options.firstName?.trim()
    ? `, ${escapeHtml(options.firstName.trim())}`
    : "";
  const companyLine = options.company?.trim()
    ? `<tr>
            <td style="padding:18px 40px 0 40px;font-family:${FONT_STACK};">
              <p class="email-muted" style="margin:0;font-size:13px;line-height:1.6;color:#71717a;">
                Placówka: <strong class="strong-text" style="font-weight:600;color:#0a0a0a;">${escapeHtml(
                  options.company.trim()
                )}</strong>
              </p>
            </td>
          </tr>`
    : "";

  const highlightRows = REPORT_HIGHLIGHTS.map(
    (item) => `<tr>
                  <td width="22" valign="top" style="padding:5px 0;font-family:${FONT_STACK};">
                    <div style="width:6px;height:6px;margin-top:7px;background:${BRAND_ORANGE};"></div>
                  </td>
                  <td valign="top" class="email-text" style="padding:5px 0;font-family:${FONT_STACK};font-size:14px;line-height:1.6;color:#3f3f46;">
                    ${escapeHtml(item)}
                  </td>
                </tr>`
  ).join("");

  return `<!DOCTYPE html>
<html lang="pl" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>Twój raport jest gotowy · ICAROS Polska</title>
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
      .strong-text { color: #fafafa !important; }
      .email-eyebrow { color: #a1a1aa !important; }
      .email-foot { color: #8a8a93 !important; border-top-color: rgba(255,255,255,0.08) !important; }
      .email-brand { color: #ff8c42 !important; }
      .email-link { color: #ff8c42 !important; }
      .email-copyright { color: #5c5c63 !important; }
      .email-highlights { background-color: rgba(255,102,0,0.10) !important; border-color: rgba(255,102,0,0.28) !important; }
    }
  </style>
</head>
<body class="email-body" style="margin:0;padding:0;background-color:#f4f4f5;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
    Twój raport o VR w rehabilitacji jest gotowy do pobrania.
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
              <p class="email-eyebrow" style="margin:7px 0 0 0;font-size:11px;font-weight:600;letter-spacing:0.24em;text-transform:uppercase;color:#a1a1aa;">Bezpłatny raport</p>
            </td>
          </tr>
          <tr>
            <td class="email-heading" style="padding:14px 40px 0 40px;font-family:${FONT_STACK};font-size:27px;font-weight:700;letter-spacing:-0.03em;line-height:1.15;color:#0a0a0a;">
              Twój raport jest gotowy${greeting}
            </td>
          </tr>
          <tr>
            <td class="email-text" style="padding:13px 40px 0 40px;font-family:${FONT_STACK};font-size:16px;line-height:1.65;color:#3f3f46;">
              Dziękujemy za zainteresowanie. Raport „Jak technologia VR zmienia rehabilitację w Europie” pobierzesz jednym kliknięciem poniżej. To konkretne dane z rynku europejskiego, z krajów, gdzie technologia VR ma już szersze zastosowanie.
            </td>
          </tr>
          ${companyLine}
          <tr>
            <td align="center" style="padding:30px 40px 6px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                <tr>
                  <td align="center" style="background-color:${BRAND_ORANGE};background-image:linear-gradient(135deg, ${BRAND_ORANGE} 0%, ${BRAND_ORANGE_SOFT} 100%);">
                    <a href="${REPORT_PDF_URL}" target="_blank" style="display:block;padding:18px 46px;font-family:${FONT_STACK};font-size:15px;font-weight:700;letter-spacing:0.02em;color:#ffffff;text-decoration:none;">
                      Pobierz raport (PDF)
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:14px 40px 0 40px;font-family:${FONT_STACK};">
              <p class="email-muted" style="margin:0;font-size:12px;line-height:1.6;color:#a1a1aa;text-align:center;">
                Gdyby przycisk nie działał,
                <a href="${REPORT_PDF_URL}" target="_blank" class="email-link" style="color:${BRAND_ORANGE};text-decoration:underline;font-weight:600;">otwórz raport tutaj</a>.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:26px 40px 0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="email-highlights" style="background-color:rgba(255,102,0,0.05);border:1px solid rgba(255,102,0,0.18);border-radius:12px;">
                <tr>
                  <td style="padding:18px 22px;font-family:${FONT_STACK};">
                    <p class="email-brand" style="margin:0 0 10px 0;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${BRAND_ORANGE};">Co znajdziesz w środku</p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      ${highlightRows}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="email-text" style="padding:26px 40px 0 40px;font-family:${FONT_STACK};font-size:15px;line-height:1.65;color:#52525b;">
              Masz pytania o wdrożenie ICAROS u siebie? Napisz na
              <a href="mailto:kontakt@icaros.com.pl" class="email-link" style="color:${BRAND_ORANGE};text-decoration:none;font-weight:600;">kontakt@icaros.com.pl</a>
              - odpowiemy konkretnie.
            </td>
          </tr>
          <tr>
            <td class="email-foot" style="padding:30px 40px 36px 40px;font-family:${FONT_STACK};font-size:12px;line-height:1.65;color:#8a8a93;border-top:1px solid rgba(10,10,10,0.06);">
              ICAROS Polska - oficjalny dystrybutor ICAROS w Polsce.<br />
              Otrzymujesz tę wiadomość, ponieważ poprosiłeś o raport na stronie icaros.com.pl.<br />
              Nie chcesz otrzymywać od nas materiałów?
              <a href="${UNSUBSCRIBE_MAILTO}" class="email-link" style="color:${BRAND_ORANGE};text-decoration:underline;">Wypisz się</a>.
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

export async function sendLeadMagnetEmail(params: {
  to: string;
  company?: string;
  firstName?: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM?.trim();
  if (!apiKey || !from) {
    return;
  }

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from,
    to: params.to,
    subject: "Twój raport o VR w rehabilitacji · ICAROS Polska",
    html: buildLeadMagnetEmailHtml({
      company: params.company,
      firstName: params.firstName,
    }),
    replyTo: "kontakt@icaros.com.pl",
    headers: {
      "List-Unsubscribe": `<${UNSUBSCRIBE_MAILTO}>`,
    },
  });
}
