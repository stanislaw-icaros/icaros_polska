"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MAP_DEFAULT_CENTER,
  MAP_DEFAULT_ZOOM,
  type IcarosLocation,
} from "@/lib/mapa/locations";
import type { MapTheme } from "./MapCanvas";

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
}: {
  locations: IcarosLocation[];
  theme?: MapTheme;
  className?: string;
}) {
  const dark = theme === "dark";
  const tileUrl = dark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  return (
    <div className={`relative w-full ${className}`}>
      <MapContainer
        center={MAP_DEFAULT_CENTER}
        zoom={MAP_DEFAULT_ZOOM - 1}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        zoomControl={false}
        attributionControl={false}
        className={`h-full w-full ${dark ? "bg-[#0a0a0a]" : "bg-[#eef1f4]"}`}
      >
        <TileLayer url={tileUrl} subdomains="abcd" maxZoom={19} />
        {locations.map((loc) => (
          <Marker key={loc.id} position={loc.coords} icon={miniPin()} interactive={false} />
        ))}
      </MapContainer>
    </div>
  );
}
