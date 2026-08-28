/**
 * Konfiguracja podkładu mapy - wspólna dla pełnej mapy i mini-mapy.
 *
 * CARTO wymaga klucza do swoich basemap. Bez klucza serwer nadal oddaje kafelki,
 * ale z przekątnym napisem "API KEY REQUIRED". Klucz jest darmowy i nie wymaga
 * zakładania konta (carto.com/basemaps/apikey, limit 5 mln kafelków miesięcznie) -
 * wystarczy wpisać go do NEXT_PUBLIC_CARTO_API_KEY.
 *
 * Bez klucza spadamy na standardowe kafelki OpenStreetMap, dociągnięte filtrem CSS
 * (map-tiles-light / map-tiles-dark w globals.css) do szarej palety strony.
 */

export type MapTheme = "light" | "dark";

// Odwołanie musi być dosłowne - Next podmienia process.env.NEXT_PUBLIC_* na
// wartość dopiero przy budowaniu, więc dynamiczny odczyt klucza nie zadziała.
const CARTO_KEY = process.env.NEXT_PUBLIC_CARTO_API_KEY;

const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

export type TileConfig = {
  url: string;
  attribution: string;
  maxZoom: number;
  /** Podane tylko dla CARTO - OSM serwuje kafelki z jednego hosta. */
  subdomains?: string;
  /** Klasa warstwy kafelków; filtr dopasowujący fallback do palety strony. */
  className?: string;
};

export function tileConfig(theme: MapTheme): TileConfig {
  const dark = theme === "dark";

  if (CARTO_KEY) {
    const style = dark ? "dark_all" : "light_all";
    return {
      url: `https://{s}.basemaps.cartocdn.com/${style}/{z}/{x}/{y}{r}.png?key=${CARTO_KEY}`,
      attribution: `${OSM_ATTRIBUTION} &copy; <a href="https://carto.com/attributions">CARTO</a>`,
      subdomains: "abcd",
      maxZoom: 19,
    };
  }

  return {
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: OSM_ATTRIBUTION,
    maxZoom: 19,
    className: dark ? "map-tiles-dark" : "map-tiles-light",
  };
}
