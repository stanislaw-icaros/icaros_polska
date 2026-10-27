"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MAP_DEFAULT_CENTER,
  MAP_DEFAULT_ZOOM,
  type IcarosLocation,
} from "@/lib/mapa/locations";
import { tileConfig, type MapTheme } from "@/lib/mapa/tiles";

/** Mała pinezka w kolorze marki (bez zewnętrznych assetów Leafletu). */
function miniPin() {
  return L.divIcon({
    className: "",
    html: `
      <div style="transform: translate(-50%, -100%); transform-origin: bottom center;">
        <svg width="20" height="27" viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 15 25 15 25s15-14.5 15-25C30 6.7 23.3 0 15 0z" fill="#ff6600"/>
          <circle cx="15" cy="15" r="5.5" fill="#0a0a0a"/>
        </svg>
      </div>`,
    iconSize: [20, 27],
    iconAnchor: [0, 0],
  });
}

/**
 * Kompaktowa, poglądowa mapka lokalizacji (np. na stronie kontaktu).
 * Bez listy i popupów - pełna, interaktywna mapa jest pod /mapa.
 */
export default function MiniMap({
  locations,
  theme = "light",
  className = "h-[240px]",
  zoom = MAP_DEFAULT_ZOOM - 1,
  fitToMarkers = false,
}: {
  locations: IcarosLocation[];
  theme?: MapTheme;
  className?: string;
  /** Domyślnie o stopień dalej niż pełna mapa; większe kafelki potrzebują bliższego kadru. */
  zoom?: number;
  /**
   * Dopasowanie kadru do pinezek zamiast stałego środka i przybliżenia.
   * Przy wąskich kontenerach (telefon) stały zoom ucina pół Polski.
   */
  fitToMarkers?: boolean;
}) {
  const dark = theme === "dark";
  const tiles = tileConfig(theme);

  const bounds =
    fitToMarkers && locations.length > 1
      ? L.latLngBounds(locations.map((loc) => loc.coords))
      : undefined;

  return (
    <div className={`relative w-full ${className}`}>
      <MapContainer
        {...(bounds
          ? { bounds, boundsOptions: { padding: [26, 26] as [number, number], maxZoom: MAP_DEFAULT_ZOOM } }
          : { center: MAP_DEFAULT_CENTER, zoom })}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        zoomControl={false}
        attributionControl={false}
        className={`h-full w-full ${dark ? "bg-[#0a0a0a]" : "bg-[#eef1f4]"}`}
      >
        <TileLayer {...tiles} />
        {locations.map((loc) => (
          <Marker key={loc.id} position={loc.coords} icon={miniPin()} interactive={false} />
        ))}
      </MapContainer>
    </div>
  );
}
