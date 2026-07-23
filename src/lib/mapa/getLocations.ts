import { locations as fallbackLocations, type IcarosLocation } from "./locations";

/**
 * Źródło prawdy dla mapy: arkusz Google "Lokalizacje ICAROS", opublikowany do
 * sieci jako CSV. Edycja arkusza aktualizuje mapę bez zmian w kodzie.
 *
 * Nagłówki arkusza (kolejność kolumn ma znaczenie):
 *   LP | data wstawienia | nazwa | nazwa krótka | miasto | kod pocztowy |
 *   ulica i numer | lat | lng | link | sprzęt | dostępny publicznie | charakter obiektu
 *
 * Gdyby arkusz był nieosiągalny lub pusty, wracamy do listy zaszytej w kodzie
 * (`locations` w ./locations.ts), żeby strona nigdy nie została bez pinezek.
 */
const CSV_URL =
  process.env.LOCATIONS_CSV_URL ??
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRNuABSwPCz9FlC9SZE5eQFlaxzgmk5rdaurvBZvovE_JZtqSjCvuPSCp32HtK54q7IGaoshL4ZByxG/pub?output=csv";

/** Jak długo trzymać wynik w cache zanim odświeżymy z arkusza (sekundy). */
const REVALIDATE_SECONDS = 3600;

/** Minimalny parser CSV zgodny z RFC 4180 (obsługuje cudzysłowy i przecinki w polach). */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function slugify(input: string): string {
  const from = "ąćęłńóśźżĄĆĘŁŃÓŚŹŻ";
  const to = "acelnoszzacelnoszz";
  const mapped = input
    .split("")
    .map((c) => {
      const idx = from.indexOf(c);
      return idx === -1 ? c : to[idx];
    })
    .join("");
  return mapped
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Zamienia wiersz arkusza na obiekt lokalizacji; zwraca null dla wierszy bez współrzędnych. */
function rowToLocation(cols: string[]): IcarosLocation | null {
  const get = (i: number) => (cols[i] ?? "").trim();

  const name = get(2);
  const shortName = get(3) || name;
  const city = get(4);
  const postal = get(5);
  const street = get(6);
  const lat = Number.parseFloat(get(7).replace(",", "."));
  const lng = Number.parseFloat(get(8).replace(",", "."));
  const url = get(9);
  const devicesRaw = get(10);
  const publicRaw = get(11).toUpperCase();
  const type = get(12);

  if (!name || !Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  const address = [street, [postal, city].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(", ");

  const devices = devicesRaw
    .split(",")
    .map((d) => d.trim())
    .filter(Boolean)
    .map((d) => (/^icaros/i.test(d) ? d : `ICAROS ${d}`));

  return {
    id: slugify(`${shortName}-${city}`) || slugify(name),
    name,
    shortName,
    type: type || "Placówka",
    coords: [lat, lng],
    city,
    address,
    devices,
    publicAccess: publicRaw === "TAK",
    url: url || undefined,
  };
}

/**
 * Pobiera i parsuje listę placówek z arkusza. Wynik jest cache'owany przez
 * Next.js na `REVALIDATE_SECONDS`. Przy jakimkolwiek błędzie wraca do listy
 * zaszytej w kodzie.
 *
 * Uwaga: mapa celowo pokazuje WSZYSTKIE placówki z jakimkolwiek sprzętem ICAROS,
 * także z Lightningiem. Lightning jest ukryty w pozostałych częściach serwisu
 * (wycofany ze sprzedaży), ale mapa to jedyne miejsce, gdzie może się pojawić.
 */
export async function getLocations(): Promise<IcarosLocation[]> {
  try {
    const res = await fetch(CSV_URL, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return fallbackLocations;

    const rows = parseCsv(await res.text());
    if (rows.length < 2) return fallbackLocations;

    const parsed = rows
      .slice(1) // pomiń nagłówek
      .map(rowToLocation)
      .filter((loc): loc is IcarosLocation => loc !== null);

    return parsed.length ? parsed : fallbackLocations;
  } catch {
    return fallbackLocations;
  }
}
