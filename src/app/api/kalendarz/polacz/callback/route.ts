import { handlowiec } from "@/lib/kalendarz/config";
import { wymienKod } from "@/lib/kalendarz/google";
import { odczytajStan } from "@/lib/kalendarz/podpis";
import { zapiszToken } from "@/lib/kalendarz/tokeny";
import { wyczyscPamiec } from "@/lib/kalendarz/terminy";
import { wyslijInformacjeOPodlaczeniu } from "@/lib/email/rozmowa";
import { ALWAYS_NOTIFY_EMAILS } from "@/lib/pipedrive/client";

/** Powrót z Google po zatwierdzeniu dostępu do kalendarza. */

function escape(tekst: string): string {
  return tekst
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function strona(options: {
  naglowek: string;
  tresc: string;
  szczegoly?: string;
  blad?: boolean;
}): Response {
  const html = `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex" />
  <title>Kalendarz ICAROS</title>
  <style>
    :root { color-scheme: light dark; }
    body { margin:0; min-height:100vh; display:grid; place-items:center; padding:24px;
      font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
      background:#f4f4f5; color:#0a0a0a; }
    .karta { max-width:520px; width:100%; background:#fff; border:1px solid rgba(10,10,10,.08);
      border-radius:16px; padding:36px 32px; box-shadow:0 20px 50px rgba(10,10,10,.08); }
    .pasek { height:4px; border-radius:4px; margin:-36px -32px 28px; background:linear-gradient(135deg,#ff6600,#ff7b1f); }
    h1 { margin:0 0 12px; font-size:24px; letter-spacing:-.02em; }
    p { margin:0 0 14px; font-size:16px; line-height:1.6; color:#3f3f46; }
    code { font-family:ui-monospace,SFMono-Regular,Menlo,monospace; font-size:13px; word-break:break-all; }
    details { margin-top:18px; border-top:1px solid rgba(10,10,10,.08); padding-top:14px; }
    summary { cursor:pointer; font-size:14px; color:#52525b; }
    .pole { margin-top:10px; background:#fafafa; border:1px solid rgba(10,10,10,.08);
      border-radius:10px; padding:12px; }
    @media (prefers-color-scheme: dark) {
      body { background:#0a0a0a; color:#fafafa; }
      .karta { background:#161616; border-color:rgba(255,255,255,.1); }
      p { color:#d4d4d8; }
      .pole { background:#1f1f1f; border-color:rgba(255,255,255,.1); }
      summary { color:#a1a1aa; }
    }
  </style>
</head>
<body>
  <div class="karta">
    <div class="pasek"></div>
    <h1>${escape(options.naglowek)}</h1>
    <p>${options.tresc}</p>
    ${options.szczegoly || ""}
  </div>
</body>
</html>`;

  return new Response(html, {
    status: options.blad ? 400 : 200,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}

export async function GET(request: Request) {
  const adres = new URL(request.url);
  const blad = adres.searchParams.get("error");

  if (blad) {
    return strona({
      naglowek: "Dostęp nie został nadany",
      tresc:
        "Google zgłosił, że zgoda nie została udzielona. Otwórz link jeszcze raz i zatwierdź dostęp do kalendarza.",
      blad: true,
    });
  }

  const kod = adres.searchParams.get("code");
  const kluczOsoby = odczytajStan(adres.searchParams.get("state"));
  const osoba = kluczOsoby ? handlowiec(kluczOsoby) : undefined;

  if (!kod || !osoba) {
    return strona({
      naglowek: "Link wygasł",
      tresc:
        "Ten link do podłączenia kalendarza jest już nieważny. Poproś o nowy i otwórz go w ciągu pół godziny.",
      blad: true,
    });
  }

  try {
    const { tokenOdswiezania, email } = await wymienKod({ kod, baza: adres.origin });
    const gdzie = await zapiszToken(osoba, tokenOdswiezania);
    wyczyscPamiec();

    try {
      await wyslijInformacjeOPodlaczeniu({
        odbiorcy: ALWAYS_NOTIFY_EMAILS,
        handlowiec: osoba,
        kontoGoogle: email,
        token: gdzie === "recznie" ? tokenOdswiezania : undefined,
      });
    } catch (bladMaila) {
      console.error(
        "[kalendarz] informacja o podlaczeniu nie poszla:",
        bladMaila instanceof Error ? bladMaila.message : bladMaila
      );
    }

    console.log(`[kalendarz] podlaczono kalendarz ${osoba.klucz} (${gdzie})`);

    const gotowe = gdzie === "redis";
    return strona({
      naglowek: `Gotowe, kalendarz jest podłączony`,
      tresc: gotowe
        ? `Od teraz wolne godziny w kalendarzu ${escape(
            osoba.imie
          )} pokazują się na stronie, a umówione rozmowy wpisują się automatycznie. Nic więcej nie trzeba robić.`
        : `Zgoda została zapisana. Został jeszcze jeden krok po stronie administratora, dostał już wiadomość z instrukcją. Kalendarz ${escape(
            osoba.imie
          )} zacznie oddawać terminy po tej zmianie.`,
      szczegoly: gotowe
        ? ""
        : `<details>
      <summary>Dla administratora: token do zmiennych środowiskowych</summary>
      <div class="pole"><code>${escape(osoba.zmiennaTokenu)}=${escape(tokenOdswiezania)}</code></div>
      <p style="margin-top:12px;font-size:13px;">Po dodaniu tej zmiennej i wdrożeniu kalendarz działa bez dalszej obsługi. Podłączenie Redisa sprawi, że następny raz zapisze się sam.</p>
    </details>`,
    });
  } catch (problem) {
    console.error(
      "[kalendarz] wymiana kodu nie wyszla:",
      problem instanceof Error ? problem.message : problem
    );
    return strona({
      naglowek: "Nie udało się zapisać zgody",
      tresc: escape(
        problem instanceof Error ? problem.message : "Nieznany błąd po stronie Google."
      ),
      blad: true,
    });
  }
}
