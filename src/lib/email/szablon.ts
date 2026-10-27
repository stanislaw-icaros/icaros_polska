/**
 * Wspólna koperta wiadomości transakcyjnych.
 *
 * Trzyma oprawę w jednym miejscu: biała karta, pomarańczowy pasek, tryb ciemny
 * i bezpieczna szerokość dla klientów pocztowych. Moduły maili dostarczają
 * tylko treść, nie kopiują tabelek HTML.
 */

export const POMARANCZOWY = "#ff6600";
export const POMARANCZOWY_JASNY = "#ff7b1f";

export const KROJ =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

export function escapeHtml(tekst: string): string {
  return tekst
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function imieZNazwy(nazwa: string): string {
  const przyciete = nazwa.trim();
  if (!przyciete) return "";
  return przyciete.split(/\s+/)[0] || przyciete;
}

export type Wiersz = { etykieta: string; wartosc: string; mocny?: boolean };

export type TrescMaila = {
  /** Tekst podglądu na liście wiadomości. */
  podglad: string;
  tytulStrony: string;
  naglowek: string;
  /** Akapity treści, zwykły tekst. */
  akapity: string[];
  /** Wyróżniona ramka z danymi, np. termin rozmowy. */
  ramka?: { naglowek?: string; wiersze: Wiersz[] };
  przycisk?: { etykieta: string; url: string };
  /** Dodatkowe akapity po ramce. */
  dopiski?: string[];
  /** Linki w jednej linii na dole treści. */
  linki?: { etykieta: string; url: string }[];
  stopka?: string[];
};

function akapit(tekst: string, pierwszy: boolean): string {
  return `<tr>
            <td class="email-text" style="padding:${pierwszy ? "13" : "16"}px 40px 0 40px;font-family:${KROJ};font-size:16px;line-height:1.65;color:#3f3f46;">
              ${tekst}
            </td>
          </tr>`;
}

function ramkaHtml(ramka: NonNullable<TrescMaila["ramka"]>): string {
  const wiersze = ramka.wiersze
    .map(
      (wiersz) => `<tr>
                    <td style="padding:3px 0;font-family:${KROJ};font-size:14px;line-height:1.6;color:#52525b;" class="email-text">
                      ${escapeHtml(wiersz.etykieta)}:
                      <strong class="strong-text" style="font-weight:600;color:#0a0a0a;${
                        wiersz.mocny ? "font-size:16px;" : ""
                      }">${escapeHtml(wiersz.wartosc)}</strong>
                    </td>
                  </tr>`
    )
    .join("\n");

  const naglowek = ramka.naglowek
    ? `<p class="email-brand" style="margin:0 0 10px 0;font-size:13px;font-weight:700;color:${POMARANCZOWY};">${escapeHtml(
        ramka.naglowek
      )}</p>`
    : "";

  return `<tr>
            <td style="padding:24px 40px 0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="email-box" style="background-color:rgba(255,102,0,0.05);border:1px solid rgba(255,102,0,0.18);border-radius:12px;">
                <tr>
                  <td style="padding:20px 22px;font-family:${KROJ};">
                    ${naglowek}
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      ${wiersze}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`;
}

export function kopertaHtml(tresc: TrescMaila): string {
  const akapity = tresc.akapity
    .map((text, index) => akapit(text, index === 0))
    .join("\n");

  const ramka = tresc.ramka ? ramkaHtml(tresc.ramka) : "";

  const przycisk = tresc.przycisk
    ? `<tr>
            <td style="padding:26px 40px 0 40px;font-family:${KROJ};">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="border-radius:10px;background-color:${POMARANCZOWY};">
                    <a href="${tresc.przycisk.url}" target="_blank" style="display:inline-block;padding:14px 26px;font-family:${KROJ};font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:10px;">${escapeHtml(
                      tresc.przycisk.etykieta
                    )}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`
    : "";

  const dopiski = (tresc.dopiski || [])
    .map(
      (text) => `<tr>
            <td class="email-muted" style="padding:16px 40px 0 40px;font-family:${KROJ};font-size:13px;line-height:1.6;color:#71717a;">
              ${text}
            </td>
          </tr>`
    )
    .join("\n");

  const linki = tresc.linki?.length
    ? `<tr>
            <td style="padding:20px 40px 0 40px;font-family:${KROJ};font-size:14px;line-height:1.7;">
              ${tresc.linki
                .map(
                  (link) =>
                    `<a href="${link.url}" target="_blank" class="email-link" style="color:${POMARANCZOWY};text-decoration:underline;font-weight:600;">${escapeHtml(
                      link.etykieta
                    )}</a>`
                )
                .join('<span style="color:#d4d4d8;"> &nbsp;|&nbsp; </span>')}
            </td>
          </tr>`
    : "";

  const stopka = (
    tresc.stopka || [
      "ICAROS Polska, oficjalny dystrybutor ICAROS w Polsce.",
      "Tę wiadomość wysłał nasz kalendarz rozmów, nie musisz na nią odpowiadać.",
    ]
  ).join("<br />");

  return `<!DOCTYPE html>
<html lang="pl" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>${escapeHtml(tresc.tytulStrony)}</title>
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
      .email-foot { color: #8a8a93 !important; border-top-color: rgba(255,255,255,0.08) !important; }
      .email-brand { color: #ff8c42 !important; }
      .email-link { color: #ff8c42 !important; }
      .email-copyright { color: #5c5c63 !important; }
      .email-box { background-color: rgba(255,102,0,0.10) !important; border-color: rgba(255,102,0,0.28) !important; }
    }
  </style>
</head>
<body class="email-body" style="margin:0;padding:0;background-color:#f4f4f5;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
    ${escapeHtml(tresc.podglad)}
  </div>
  <table role="presentation" class="email-body" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f5;margin:0;padding:32px 16px;">
    <tr>
      <td align="center" style="padding:0;">
        <table role="presentation" class="email-card" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background-color:#ffffff;border:1px solid rgba(10,10,10,0.06);border-radius:16px;overflow:hidden;box-shadow:0 20px 50px rgba(10,10,10,0.08);">
          <tr>
            <td style="padding:0;background:linear-gradient(135deg, ${POMARANCZOWY} 0%, ${POMARANCZOWY_JASNY} 100%);height:4px;line-height:4px;font-size:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:36px 40px 0 40px;font-family:${KROJ};">
              <p class="email-brand" style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.28em;text-transform:uppercase;color:${POMARANCZOWY};">ICAROS POLSKA</p>
            </td>
          </tr>
          <tr>
            <td class="email-heading" style="padding:16px 40px 0 40px;font-family:${KROJ};font-size:26px;font-weight:700;letter-spacing:-0.03em;line-height:1.2;color:#0a0a0a;">
              ${escapeHtml(tresc.naglowek)}
            </td>
          </tr>
          ${akapity}
          ${ramka}
          ${przycisk}
          ${dopiski}
          ${linki}
          <tr>
            <td class="email-foot" style="padding:30px 40px 36px 40px;font-family:${KROJ};font-size:12px;line-height:1.65;color:#8a8a93;border-top:1px solid rgba(10,10,10,0.06);">
              ${stopka}
            </td>
          </tr>
        </table>
        <p class="email-copyright" style="margin:20px 0 0 0;font-family:${KROJ};font-size:11px;color:#a1a1aa;text-align:center;">
          &copy; ${new Date().getFullYear()} ICAROS Polska
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
