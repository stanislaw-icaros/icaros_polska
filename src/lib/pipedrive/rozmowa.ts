import {
  ALWAYS_NOTIFY_EMAILS,
  callPipedrive,
  createPerson,
  dealUrl,
  findPerson,
  getEnv,
  OWNER_A,
  OWNER_B,
  ownerEmails,
  PIPELINE_ID,
  resolveOrganization,
  STAGE_ID_NEW_LEAD,
  type PipedriveUser,
} from "./client";
import { HANDLOWCY, type Handlowiec, type KluczHandlowca } from "@/lib/kalendarz/config";
import { etykietaPelna } from "@/lib/kalendarz/czas";

/**
 * Zapis umówionej rozmowy w Pipedrive.
 *
 * Rezerwacja nie tworzy drugiego deala, jeśli osoba ma już otwartą sprawę:
 * dopisuje się do istniejącej, przestawia etap i zakłada zadanie telefoniczne
 * na wybraną godzinę, przypisane do handlowca, który tę rozmowę prowadzi.
 */

/**
 * Identyfikatory handlowców w Pipedrive. Bierzemy je z tych samych stałych,
 * z których korzystają formularze kontaktowe, bo one mają wpisane wartości
 * domyślne. Czytanie samej zmiennej środowiskowej zostawiało kalendarz bez
 * właściciela sprawy i wywracało cały zapis rezerwacji.
 */
const ID_W_PIPEDRIVE: Record<string, number> = {
  PIPEDRIVE_OWNER_A_ID: OWNER_A,
  PIPEDRIVE_OWNER_B_ID: OWNER_B,
};

export function idPipedrive(osoba: Handlowiec): number | undefined {
  const wartosc = ID_W_PIPEDRIVE[osoba.zmiennaPipedrive];
  return Number.isFinite(wartosc) && wartosc > 0 ? wartosc : undefined;
}

/** Odwrotne przypisanie: z właściciela deala na handlowca z kalendarza. */
export function handlowiecZIdPipedrive(idWlasciciela?: number): KluczHandlowca | undefined {
  if (!idWlasciciela) return undefined;
  return HANDLOWCY.find((osoba) => idPipedrive(osoba) === idWlasciciela)?.klucz;
}

type OtwartaSprawa = {
  id: number;
  title?: string;
  stage_id?: number;
  user_id?: { id: number } | number;
};

export type KontekstLeada = {
  personId?: number;
  orgId?: number;
  dealId?: number;
  /** Właściciel otwartej sprawy, jeśli lead jest już w systemie. */
  wlascicielSprawy?: KluczHandlowca;
};

/**
 * Sprawdza, czy dzwoniący jest już w Pipedrive. Wywołujemy to przed wyborem
 * handlowca, żeby znany lead trafił do osoby, która go prowadzi.
 */
export async function rozpoznajLeada(options: {
  email?: string;
  telefon?: string;
}): Promise<KontekstLeada> {
  try {
    const osoba = await findPerson(options.email, options.telefon);
    if (!osoba) return {};

    const sprawy = await callPipedrive<OtwartaSprawa[]>(
      `/persons/${osoba.id}/deals?status=open&limit=5&sort=update_time DESC`
    );
    const otwarta = (Array.isArray(sprawy.data) ? sprawy.data : [])[0];
    const idWlasciciela =
      typeof otwarta?.user_id === "object" ? otwarta?.user_id?.id : otwarta?.user_id;

    return {
      personId: osoba.id,
      orgId: osoba.organization?.id,
      dealId: otwarta?.id,
      wlascicielSprawy: handlowiecZIdPipedrive(idWlasciciela),
    };
  } catch (blad) {
    console.error(
      "[kalendarz] rozpoznanie leada w Pipedrive nie wyszlo:",
      blad instanceof Error ? blad.message : blad
    );
    return {};
  }
}

export type DaneRozmowy = {
  kontekst: KontekstLeada;
  handlowiec: Handlowiec;
  start: Date;
  dlugoscMin: number;
  imie: string;
  telefon: string;
  email?: string;
  firma?: string;
  temat?: string;
  zrodlo: string;
  strona?: string;
  linkOdwolania?: string;
  zgodaMarketingowa?: boolean;
  utm?: Record<string, string | undefined>;
};

export type WynikPipedrive = {
  dealId?: number;
  link?: string;
  emaileHandlowcow: string[];
  nazwaWlasciciela?: string;
};

function polaWlasne(dane: DaneRozmowy): Record<string, string> {
  const pola: Record<string, string> = {};
  const ustaw = (nazwaZmiennej: string, wartosc?: string) => {
    const klucz = getEnv(nazwaZmiennej);
    if (klucz && wartosc) pola[klucz] = wartosc;
  };

  ustaw("PIPEDRIVE_FIELD_LEAD_SOURCE", dane.zrodlo);
  ustaw("PIPEDRIVE_FIELD_FORM_SOURCE", "Kalendarz rozmów");
  ustaw("PIPEDRIVE_FIELD_PAGE_SOURCE", dane.strona);
  ustaw("PIPEDRIVE_FIELD_UTM_SOURCE", dane.utm?.utm_source);
  ustaw("PIPEDRIVE_FIELD_UTM_MEDIUM", dane.utm?.utm_medium);
  ustaw("PIPEDRIVE_FIELD_UTM_CAMPAIGN", dane.utm?.utm_campaign);
  ustaw("PIPEDRIVE_FIELD_UTM_CONTENT", dane.utm?.utm_content);

  return pola;
}

function trescNotatki(dane: DaneRozmowy): string {
  return [
    "UMOWIONA ROZMOWA Z KALENDARZA",
    "",
    `Termin: ${etykietaPelna(dane.start)} (${dane.dlugoscMin} min, telefonicznie)`,
    `Rozmawia: ${dane.handlowiec.pelneImie}`,
    "",
    `Imie i nazwisko: ${dane.imie}`,
    `Telefon: ${dane.telefon}`,
    dane.email ? `Email: ${dane.email}` : "",
    dane.firma ? `Placowka / firma: ${dane.firma}` : "",
    dane.temat ? `Temat podany przez klienta: ${dane.temat}` : "",
    `Zrodlo rezerwacji: ${dane.zrodlo}`,
    dane.strona ? `Strona: ${dane.strona}` : "",
    typeof dane.zgodaMarketingowa === "boolean"
      ? `Zgoda marketingowa: ${dane.zgodaMarketingowa ? "TAK" : "NIE"}`
      : "",
    dane.linkOdwolania ? "" : "",
    dane.linkOdwolania ? `Link do odwolania terminu: ${dane.linkOdwolania}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

/** Zakłada lub aktualizuje sprawę, dopisuje notatkę i zadanie telefoniczne. */
export async function zapiszRozmowe(dane: DaneRozmowy): Promise<WynikPipedrive> {
  const ownerId = idPipedrive(dane.handlowiec);
  if (!ownerId) {
    throw new Error(
      `Brak identyfikatora Pipedrive dla ${dane.handlowiec.imie} (${dane.handlowiec.zmiennaPipedrive}).`
    );
  }

  let orgId = dane.kontekst.orgId;
  if (dane.firma?.trim()) {
    orgId = (await resolveOrganization(dane.firma.trim(), ownerId)) || orgId;
  }

  let personId = dane.kontekst.personId;
  if (!personId) {
    personId = await createPerson({
      name: dane.imie,
      ownerId,
      orgId,
      email: dane.email,
      phone: dane.telefon,
    });
  } else if (orgId && !dane.kontekst.orgId) {
    await callPipedrive(`/persons/${personId}`, {
      method: "PUT",
      body: JSON.stringify({ org_id: orgId }),
    });
  }

  if (!personId) throw new Error("Nie udalo sie ustalic person_id w Pipedrive.");

  const etapUmowionejRozmowy = Number(getEnv("PIPEDRIVE_STAGE_ID_CALL_BOOKED") || "0");
  const pola = polaWlasne(dane);
  let dealId = dane.kontekst.dealId;

  if (dealId) {
    await callPipedrive(`/deals/${dealId}`, {
      method: "PUT",
      body: JSON.stringify({
        user_id: ownerId,
        ...(etapUmowionejRozmowy > 0 ? { stage_id: etapUmowionejRozmowy } : {}),
        ...pola,
      }),
    });
  } else {
    const tytul = dane.firma?.trim()
      ? `ICAROS - ${dane.firma.trim()}`
      : `ICAROS - ${dane.imie}`;
    const utworzony = await callPipedrive<{ id: number }>("/deals", {
      method: "POST",
      body: JSON.stringify({
        title: tytul,
        user_id: ownerId,
        person_id: personId,
        org_id: orgId,
        pipeline_id: PIPELINE_ID,
        stage_id: etapUmowionejRozmowy > 0 ? etapUmowionejRozmowy : STAGE_ID_NEW_LEAD,
        currency: "EUR",
        ...pola,
      }),
    });
    dealId = utworzony?.data?.id;
  }

  if (dealId) {
    await callPipedrive("/notes", {
      method: "POST",
      body: JSON.stringify({
        deal_id: dealId,
        content: trescNotatki(dane),
        pinned_to_deal_flag: true,
      }),
    });
  }

  // Zadanie telefoniczne dokładnie na umówioną godzinę. Pipedrive przyjmuje czas w UTC.
  try {
    await callPipedrive("/activities", {
      method: "POST",
      body: JSON.stringify({
        subject: `Rozmowa z ${dane.imie}${dane.firma?.trim() ? ` (${dane.firma.trim()})` : ""}`,
        type: "call",
        deal_id: dealId,
        person_id: personId,
        org_id: orgId,
        user_id: ownerId,
        due_date: dane.start.toISOString().slice(0, 10),
        due_time: dane.start.toISOString().slice(11, 16),
        duration: `00:${String(dane.dlugoscMin).padStart(2, "0")}`,
        note: [
          `Termin wybrany przez klienta: ${etykietaPelna(dane.start)}`,
          `Telefon: ${dane.telefon}`,
          dane.email ? `Email: ${dane.email}` : "",
          dane.temat ? `Temat: ${dane.temat}` : "",
          `Zrodlo: ${dane.zrodlo}`,
        ]
          .filter(Boolean)
          .join("\n"),
      }),
    });
  } catch (blad) {
    console.error(
      "[kalendarz] zadanie telefoniczne w Pipedrive nie powstalo:",
      blad instanceof Error ? blad.message : blad
    );
  }

  let emaileHandlowcow: string[] = [...ALWAYS_NOTIFY_EMAILS];
  let nazwaWlasciciela: string | undefined;
  try {
    const { users, emails } = await ownerEmails();
    nazwaWlasciciela = users.find((user: PipedriveUser) => user.id === ownerId)?.name;
    emaileHandlowcow = [...new Set([...emails, ...ALWAYS_NOTIFY_EMAILS])];
  } catch (blad) {
    console.error(
      "[kalendarz] nie udalo sie pobrac adresow handlowcow:",
      blad instanceof Error ? blad.message : blad
    );
  }

  return {
    dealId,
    link: dealId ? dealUrl(dealId) : undefined,
    emaileHandlowcow,
    nazwaWlasciciela,
  };
}

/** Oznacza w Pipedrive, że klient sam odwołał termin. */
export async function odnotujOdwolanie(options: {
  dealId?: number;
  imie: string;
  termin: Date;
  handlowiec: Handlowiec;
}): Promise<void> {
  if (!options.dealId) return;
  try {
    await callPipedrive("/notes", {
      method: "POST",
      body: JSON.stringify({
        deal_id: options.dealId,
        content: [
          "ODWOLANA ROZMOWA",
          "",
          `Klient odwolal termin ${etykietaPelna(options.termin)}.`,
          `Rozmowe mial prowadzic ${options.handlowiec.pelneImie}.`,
          "Termin zostal zwolniony w kalendarzu.",
        ].join("\n"),
      }),
    });
  } catch (blad) {
    console.error(
      "[kalendarz] notatka o odwolaniu nie powstala:",
      blad instanceof Error ? blad.message : blad
    );
  }
}
