import { Resend } from "resend";

const BRAND_ORANGE = "#ff6600";
const BRAND_ORANGE_SOFT = "#ff7b1f";

const FONT_STACK =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

/** Adres, na który mają wracać odpowiedzi (CTA newslettera to odpowiedź na maila). */
export const NEWSLETTER_REPLY_TO = "kontakt@icaros.com.pl";

export const NEWSLETTER_SUBJECT =
  "Business Priority Pass i zaproszenia VIP na dwa targi w Nadarzynie";

export const NEWSLETTER_PREVIEW_TEXT =
  "Imienne wejściówki poza otwartą rejestracją na Warsaw Medical Expo i Targi Rehabilitacji.";

/**
 * Placeholder Resend, podmieniany per odbiorca dopiero w broadcastach.
 * W mailu testowym podstawiamy pod niego zwykły URL, żeby dało się kliknąć.
 */
export const RESEND_UNSUBSCRIBE_PLACEHOLDER = "{{{RESEND_UNSUBSCRIBE_URL}}}";

const FAIRS = [
  {
    name: "Warsaw Medical Expo",
    date: "15-17 września 2026",
    place: "hala B, stoisko B16",
    pass: "imienny Business Priority Pass o wartości 249 zł",
  },
  {
    name: "Targi Rehabilitacji i Fizjoterapii",
    date: "1-3 października 2026",
    place: "hala E, stoisko E1.26b",
    pass: "zaproszenie VIP GOLD",
  },
];

const BENEFITS = [
  "dedykowaną kolejkę Fast Track przy wejściu",
  "osobistą opiekę concierge'a",
  "pełny wstęp na wszystkie konferencje branżowe",
  "dostęp do strefy VIP Room: kawa, spokój i przestrzeń do rozmów z dala od targowego zgiełku",
  "bezpłatne wejście przez wszystkie dni targów",
];

const STEPS = [
  "które targi Państwa interesują,",
  "ile zaproszeń Państwo potrzebują,",
  "ewentualnie adres do wysyłki wejściówek w wersji papierowej.",
];

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildNewsletterTargiHtml(options: {
  /** URL rezygnacji. Domyślnie placeholder Resend (działa tylko w broadcastach). */
  unsubscribeUrl?: string;
}): string {
  const unsubscribeUrl = options.unsubscribeUrl || RESEND_UNSUBSCRIBE_PLACEHOLDER;

  const fairRows = FAIRS.map(
    (fair) => `<tr>
            <td style="padding:14px 40px 0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="email-box" style="background-color:rgba(255,102,0,0.05);border:1px solid rgba(255,102,0,0.18);border-radius:12px;">
                <tr>
                  <td style="padding:18px 22px;font-family:${FONT_STACK};">
                    <p class="email-heading" style="margin:0;font-size:17px;font-weight:700;letter-spacing:-0.01em;line-height:1.3;color:#0a0a0a;">
                      ${escapeHtml(fair.name)}
                    </p>
                    <p class="email-text" style="margin:7px 0 0 0;font-size:14px;line-height:1.6;color:#3f3f46;">
                      <strong class="strong-text" style="font-weight:600;color:#0a0a0a;">${escapeHtml(
                        fair.date
                      )}</strong><br />
                      ${escapeHtml(fair.place)}
                    </p>
                    <p class="email-muted" style="margin:10px 0 0 0;padding-top:10px;border-top:1px solid rgba(255,102,0,0.16);font-size:13px;line-height:1.6;color:#71717a;">
                      ${escapeHtml(fair.pass)}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`
  ).join("");

  const benefitRows = BENEFITS.map(
    (item) => `<tr>
                  <td width="22" valign="top" style="padding:5px 0;font-family:${FONT_STACK};">
                    <div style="width:6px;height:6px;margin-top:8px;background:${BRAND_ORANGE};"></div>
                  </td>
                  <td valign="top" class="email-text" style="padding:5px 0;font-family:${FONT_STACK};font-size:14px;line-height:1.6;color:#3f3f46;">
                    ${escapeHtml(item)}
                  </td>
                </tr>`
  ).join("");

  const stepRows = STEPS.map(
    (item, index) => `<tr>
                  <td width="26" valign="top" style="padding:5px 0;font-family:${FONT_STACK};font-size:14px;line-height:1.6;font-weight:700;color:${BRAND_ORANGE};">
                    ${index + 1}.
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
  <title>${escapeHtml(NEWSLETTER_SUBJECT)} · ICAROS Polska</title>
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
      .email-box { background-color: rgba(255,102,0,0.10) !important; border-color: rgba(255,102,0,0.28) !important; }
    }
    @media only screen and (max-width: 600px) {
      .email-pad { padding-left: 24px !important; padding-right: 24px !important; }
    }
  </style>
</head>
<body class="email-body" style="margin:0;padding:0;background-color:#f4f4f5;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
    ${escapeHtml(NEWSLETTER_PREVIEW_TEXT)}
  </div>
  <table role="presentation" class="email-body" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f5;margin:0;padding:32px 16px;">
    <tr>
      <td align="center" style="padding:0;">
        <table role="presentation" class="email-card" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background-color:#ffffff;border:1px solid rgba(10,10,10,0.06);border-radius:16px;overflow:hidden;box-shadow:0 20px 50px rgba(10,10,10,0.08);">
          <tr>
            <td style="padding:0;background:linear-gradient(135deg, ${BRAND_ORANGE} 0%, ${BRAND_ORANGE_SOFT} 100%);height:4px;line-height:4px;font-size:0;">&nbsp;</td>
          </tr>
          <tr>
            <td class="email-pad" style="padding:38px 40px 0 40px;font-family:${FONT_STACK};">
              <p class="email-brand" style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.28em;text-transform:uppercase;color:${BRAND_ORANGE};">ICAROS POLSKA</p>
              <p class="email-eyebrow" style="margin:7px 0 0 0;font-size:11px;font-weight:600;letter-spacing:0.24em;text-transform:uppercase;color:#a1a1aa;">Zaproszenia na targi</p>
            </td>
          </tr>
          <tr>
            <td class="email-heading email-pad" style="padding:14px 40px 0 40px;font-family:${FONT_STACK};font-size:27px;font-weight:700;letter-spacing:-0.03em;line-height:1.15;color:#0a0a0a;">
              Zapraszamy do Nadarzyna
            </td>
          </tr>
          <tr>
            <td class="email-text email-pad" style="padding:16px 40px 0 40px;font-family:${FONT_STACK};font-size:16px;line-height:1.65;color:#3f3f46;">
              Szanowni Państwo,
            </td>
          </tr>
          <tr>
            <td class="email-text email-pad" style="padding:13px 40px 0 40px;font-family:${FONT_STACK};font-size:16px;line-height:1.65;color:#3f3f46;">
              czy planują Państwo udział w tegorocznych targach w Ptak Warsaw Expo w Nadarzynie?
            </td>
          </tr>
          ${fairRows}
          <tr>
            <td class="email-text email-pad" style="padding:20px 40px 0 40px;font-family:${FONT_STACK};font-size:15px;line-height:1.65;color:#3f3f46;">
              Jako wystawca obu wydarzeń dysponujemy ograniczoną pulą zaproszeń, których nie ma w otwartej rejestracji, i chcielibyśmy przekazać je Państwu.
            </td>
          </tr>
          <tr>
            <td class="email-pad" style="padding:28px 40px 0 40px;font-family:${FONT_STACK};">
              <p class="email-brand" style="margin:0 0 10px 0;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${BRAND_ORANGE};">Co obejmuje zaproszenie</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${benefitRows}
              </table>
            </td>
          </tr>
          <tr>
            <td class="email-pad" style="padding:28px 40px 0 40px;font-family:${FONT_STACK};">
              <p class="email-brand" style="margin:0 0 10px 0;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${BRAND_ORANGE};">Dlaczego warto nas odwiedzić</p>
              <p class="email-text" style="margin:0;font-size:15px;line-height:1.65;color:#3f3f46;">
                Urządzeń ICAROS trudno w pełni ocenić na podstawie katalogów czy zdjęć. Dopiero bezpośredni trening w wirtualnej rzeczywistości, z elementem grywalizacji (exergames), pokazuje ich realny wpływ na zaangażowanie pacjenta, aktywację mięśni głębokich i wyniki całej terapii. Targi to jedna z nielicznych okazji, żeby samemu stanąć na urządzeniu i to poczuć.
              </p>
            </td>
          </tr>
          <tr>
            <td class="email-pad" style="padding:28px 40px 0 40px;font-family:${FONT_STACK};">
              <p class="email-brand" style="margin:0 0 10px 0;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${BRAND_ORANGE};">Jak odebrać zaproszenie</p>
              <p class="email-text" style="margin:0 0 10px 0;font-size:15px;line-height:1.65;color:#3f3f46;">
                Wystarczy odpowiedzieć na tę wiadomość i wskazać:
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${stepRows}
              </table>
            </td>
          </tr>
          <tr>
            <td class="email-pad" style="padding:22px 40px 0 40px;font-family:${FONT_STACK};">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="border-radius:10px;background:linear-gradient(135deg, ${BRAND_ORANGE} 0%, ${BRAND_ORANGE_SOFT} 100%);">
                    <a href="mailto:${NEWSLETTER_REPLY_TO}?subject=${encodeURIComponent(
    "Zaproszenie na targi w Nadarzynie"
  )}" target="_blank" style="display:inline-block;padding:14px 28px;font-family:${FONT_STACK};font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;">
                      Odpowiedz i odbierz zaproszenie
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="email-text email-pad" style="padding:22px 40px 0 40px;font-family:${FONT_STACK};font-size:15px;line-height:1.65;color:#3f3f46;">
              Wejściówki prześlemy elektronicznie na wskazany adres e-mail albo pocztą na adres korespondencyjny. Warsaw Medical Expo startuje już 15 września, więc przy tych targach prosimy o wiadomość w tym tygodniu.
            </td>
          </tr>
          <tr>
            <td class="email-text email-pad" style="padding:22px 40px 0 40px;font-family:${FONT_STACK};font-size:15px;line-height:1.65;color:#3f3f46;">
              Serdecznie zapraszamy do Nadarzyna,<br />
              <strong class="strong-text" style="font-weight:600;color:#0a0a0a;">Zespół ICAROS Polska</strong><br />
              <a href="https://www.icaros.com.pl" target="_blank" class="email-link" style="color:${BRAND_ORANGE};text-decoration:none;font-weight:600;">www.icaros.com.pl</a>
            </td>
          </tr>
          <tr>
            <td class="email-foot email-pad" style="padding:30px 40px 36px 40px;font-family:${FONT_STACK};font-size:12px;line-height:1.65;color:#8a8a93;border-top:1px solid rgba(10,10,10,0.06);">
              ICAROS Polska - oficjalny dystrybutor ICAROS w Polsce.<br />
              Otrzymują Państwo tę wiadomość, ponieważ wyrazili Państwo zgodę na otrzymywanie informacji marketingowych od ICAROS Polska.<br />
              <a href="${unsubscribeUrl}" target="_blank" class="email-link" style="color:#8a8a93;text-decoration:underline;">Zrezygnuj z otrzymywania wiadomości</a>
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

export function buildNewsletterTargiText(options: {
  unsubscribeUrl?: string;
}): string {
  const unsubscribeUrl = options.unsubscribeUrl || RESEND_UNSUBSCRIBE_PLACEHOLDER;
  return `Szanowni Państwo,

czy planują Państwo udział w tegorocznych targach w Ptak Warsaw Expo w Nadarzynie?

${FAIRS.map((f) => `${f.name}, ${f.date}, ${f.place}`).join("\n")}

Jako wystawca obu wydarzeń dysponujemy ograniczoną pulą zaproszeń, których nie ma w otwartej rejestracji, i chcielibyśmy przekazać je Państwu. Na Warsaw Medical Expo jest to ${
    FAIRS[0].pass
  }, na Targach Rehabilitacji ${FAIRS[1].pass}.

CO OBEJMUJE ZAPROSZENIE
${BENEFITS.map((b) => `- ${b}`).join("\n")}

DLACZEGO WARTO NAS ODWIEDZIĆ
Urządzeń ICAROS trudno w pełni ocenić na podstawie katalogów czy zdjęć. Dopiero bezpośredni trening w wirtualnej rzeczywistości, z elementem grywalizacji (exergames), pokazuje ich realny wpływ na zaangażowanie pacjenta, aktywację mięśni głębokich i wyniki całej terapii. Targi to jedna z nielicznych okazji, żeby samemu stanąć na urządzeniu i to poczuć.

JAK ODEBRAĆ ZAPROSZENIE
Wystarczy odpowiedzieć na tę wiadomość i wskazać:
${STEPS.map((s, i) => `${i + 1}. ${s}`).join("\n")}

Wejściówki prześlemy elektronicznie na wskazany adres e-mail albo pocztą na adres korespondencyjny. Warsaw Medical Expo startuje już 15 września, więc przy tych targach prosimy o wiadomość w tym tygodniu.

Serdecznie zapraszamy do Nadarzyna,
Zespół ICAROS Polska
www.icaros.com.pl

---
ICAROS Polska - oficjalny dystrybutor ICAROS w Polsce.
Otrzymują Państwo tę wiadomość, ponieważ wyrazili Państwo zgodę na otrzymywanie informacji marketingowych od ICAROS Polska.
Rezygnacja: ${unsubscribeUrl}`;
}

/** Zastępczy link rezygnacji dla wysyłek poza broadcastem (placeholder Resend tam nie działa). */
const FALLBACK_UNSUBSCRIBE_URL = "https://www.icaros.com.pl/#rezygnacja";

/**
 * Wysyła kopię newslettera poza broadcastem, pojedynczo, bez dopisywania
 * kogokolwiek do audience. Do testów i do podglądu wewnątrz zespołu.
 */
export async function sendNewsletterTargiCopy(
  recipients: string[],
  options?: { subjectPrefix?: string }
): Promise<{ to: string; id: string }[]> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM?.trim();
  if (!apiKey || !from) throw new Error("Brak RESEND_API_KEY lub RESEND_FROM");

  const resend = new Resend(apiKey);
  const html = buildNewsletterTargiHtml({
    unsubscribeUrl: FALLBACK_UNSUBSCRIBE_URL,
  });
  const text = buildNewsletterTargiText({
    unsubscribeUrl: FALLBACK_UNSUBSCRIBE_URL,
  });
  const subject = options?.subjectPrefix
    ? `${options.subjectPrefix} ${NEWSLETTER_SUBJECT}`
    : NEWSLETTER_SUBJECT;

  const sent: { to: string; id: string }[] = [];
  // Osobna wiadomość na adres, żeby odbiorcy nie widzieli się nawzajem w polu To.
  for (const to of recipients) {
    const result = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text,
      replyTo: NEWSLETTER_REPLY_TO,
    });
    if (result.error) throw new Error(`${to}: ${result.error.message}`);
    sent.push({ to, id: result.data?.id ?? "" });
  }
  return sent;
}

/** Wysyła pojedynczy mail testowy (poza broadcastem, bez ruszania listy). */
export async function sendNewsletterTargiTest(to: string): Promise<string> {
  const [sent] = await sendNewsletterTargiCopy([to], { subjectPrefix: "[TEST]" });
  return sent.id;
}
