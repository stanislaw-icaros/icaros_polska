"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MAP_DEFAULT_CENTER,
  MAP_DEFAULT_ZOOM,
  type IcarosLocation,
} from "@/lib/mapa/locations";

export type MapTheme = "light" | "dark";

/** Zestaw klas zależny od motywu - lista placówek i nakładki na mapie. */
function themeTokens(theme: MapTheme) {
  const dark = theme === "dark";
  return {
    dark,
    frame: dark ? "border-white/[0.08]" : "border-foreground/[0.10]",
    aside: dark
      ? "border-white/[0.08] bg-white/[0.02]"
      : "border-foreground/[0.10] bg-foreground/[0.02]",
    asideHeadBorder: dark ? "border-white/[0.08]" : "border-foreground/[0.10]",
    label: dark ? "text-white/40" : "text-foreground/40",
    count: dark ? "text-white" : "text-foreground",
    countUnit: dark ? "text-white/50" : "text-foreground/50",
    itemBorder: dark ? "border-white/[0.06]" : "border-foreground/[0.07]",
    itemActive: dark ? "bg-white/[0.05]" : "bg-foreground/[0.04]",
    itemHover: dark ? "hover:bg-white/[0.03]" : "hover:bg-foreground/[0.03]",
    typeLabel: dark ? "text-white/40" : "text-foreground/45",
    name: dark ? "text-white" : "text-foreground",
    address: dark ? "text-white/50" : "text-foreground/55",
    publicLabel: dark ? "text-white/45" : "text-foreground/50",
    chip: dark
      ? "border-white/10 bg-white/[0.03] text-white/70"
      : "border-foreground/10 bg-foreground/[0.03] text-foreground/70",
    overlay: dark
      ? "border-white/10 bg-foreground/85 text-white"
      : "border-foreground/10 bg-white/85 text-foreground",
    overlayLabel: dark ? "text-white/45" : "text-foreground/45",
    mapBg: dark ? "bg-[#0a0a0a]" : "bg-[#eef1f4]",
    tileUrl: dark
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  };
}

/** Pinezka w kolorach marki (DivIcon - bez zewnętrznych assetów Leafletu). */
function pinIcon(active: boolean) {
  const scale = active ? 1.15 : 1;
  return L.divIcon({
    className: "",
    html: `
      <div style="transform: translate(-50%, -100%) scale(${scale}); transform-origin: bottom center; transition: transform .2s ease;">
        <svg width="30" height="40" viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 15 25 15 25s15-14.5 15-25C30 6.7 23.3 0 15 0z" fill="${active ? "#ff7b1f" : "#ff6600"}"/>
          <circle cx="15" cy="15" r="5.5" fill="#0a0a0a"/>
        </svg>
      </div>`,
    iconSize: [30, 40],
    iconAnchor: [0, 0],
    popupAnchor: [0, -34],
  });
}

/** Reaguje na zmianę zaznaczenia: przelot do placówki + otwarcie popupu. */
function MapController({
  selectedId,
  markerRefs,
  locations,
}: {
  selectedId: string | null;
  markerRefs: React.RefObject<Record<string, L.Marker | null>>;
  locations: IcarosLocation[];
}) {
  const map = useMap();
  useEffect(() => {
    if (!selectedId) return;
    const loc = locations.find((l) => l.id === selectedId);
    if (!loc) return;
    map.flyTo(loc.coords, Math.max(map.getZoom(), 12), { duration: 0.9 });
    const marker = markerRefs.current[selectedId];
    if (marker) {
      // poczekaj aż mapa zacznie lecieć, potem otwórz popup
      window.setTimeout(() => marker.openPopup(), 300);
    }
  }, [selectedId, map, markerRefs, locations]);
  return null;
}

function LocationPopup({ loc }: { loc: IcarosLocation }) {
  return (
    <div className="min-w-[210px] text-[#0a0a0a]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#ff6600]">
        {loc.type}
      </p>
      <p className="mt-1 text-[15px] font-bold leading-tight">{loc.name}</p>
      <p className="mt-1.5 text-[12.5px] leading-snug text-black/65">{loc.address}</p>
      <div className="mt-2 flex items-center gap-1.5">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: loc.publicAccess ? "#16a34a" : "#9ca3af" }}
        />
        <span className="text-[11px] font-medium text-black/60">
          {loc.publicAccess ? "Dostępne publicznie" : "Dostęp na zaproszenie"}
        </span>
      </div>
      {loc.devices.length ? (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {loc.devices.map((d) => (
            <span
              key={d}
              className="border border-black/10 bg-black/[0.04] px-2 py-0.5 text-[10.5px] font-medium"
            >
              {d}
            </span>
          ))}
        </div>
      ) : null}
      {loc.url ? (
        <a
          href={loc.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2.5 inline-flex items-center gap-1.5 text-[12px] font-semibold hover:underline"
          style={{ color: "#ff6600" }}
        >
          Strona placówki →
        </a>
      ) : null}
    </div>
  );
}

export default function MapCanvas({
  locations,
  theme = "dark",
}: {
  locations: IcarosLocation[];
  theme?: MapTheme;
}) {
  const t = themeTokens(theme);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const markerRefs = useRef<Record<string, L.Marker | null>>({});

  // Liczba placówek per miasto - pomocne przy ocenie "ile ICAROSów w okolicy".
  const cityCount = useMemo(() => {
    return locations.reduce<Record<string, number>>((acc, l) => {
      acc[l.city] = (acc[l.city] || 0) + 1;
      return acc;
    }, {});
  }, [locations]);

  return (
    <div className={`grid grid-cols-1 overflow-hidden border ${t.frame} lg:grid-cols-[360px_1fr]`}>
      {/* Lista placówek */}
      <aside
        className={`max-h-[560px] overflow-y-auto border-b ${t.aside} lg:max-h-[640px] lg:border-b-0 lg:border-r`}
      >
        <div className={`border-b ${t.asideHeadBorder} px-6 py-5`}>
          <p className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${t.label}`}>
            Placówki
          </p>
          <p className={`mt-1 text-[22px] font-bold ${t.count}`}>
            {locations.length}{" "}
            <span className={`text-[14px] font-medium ${t.countUnit}`}>
              {locations.length === 1 ? "lokalizacja" : "lokalizacji"}
            </span>
          </p>
        </div>
        <ul>
          {locations.map((loc) => {
            const active = selectedId === loc.id;
            return (
              <li key={loc.id}>
                <button
                  onClick={() => setSelectedId(loc.id)}
                  className={`w-full border-b ${t.itemBorder} px-6 py-5 text-left transition-colors ${
                    active ? t.itemActive : t.itemHover
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: active ? "#ff7b1f" : "#ff6600" }}
                    />
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${t.typeLabel}`}
                    >
                      {loc.type}
                    </span>
                  </div>
                  <p className={`mt-1.5 text-[15px] font-semibold leading-tight ${t.name}`}>
                    {loc.shortName}
                  </p>
                  <p className={`mt-1 text-[12.5px] leading-snug ${t.address}`}>{loc.address}</p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: loc.publicAccess ? "#22c55e" : t.dark ? "rgba(255,255,255,0.3)" : "rgba(10,10,10,0.25)" }}
                    />
                    <span className={`text-[11px] font-medium ${t.publicLabel}`}>
                      {loc.publicAccess ? "Dostępne publicznie" : "Dostęp na zaproszenie"}
                    </span>
                  </div>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {loc.devices.map((d) => (
                      <span
                        key={d}
                        className={`border px-2 py-0.5 text-[10.5px] font-medium ${t.chip}`}
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Mapa */}
      <div className="relative h-[440px] sm:h-[520px] lg:h-[640px]">
        <MapContainer
          center={MAP_DEFAULT_CENTER}
          zoom={MAP_DEFAULT_ZOOM}
          scrollWheelZoom={false}
          className={`h-full w-full ${t.mapBg}`}
        >
          <TileLayer
            url={t.tileUrl}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            subdomains="abcd"
            maxZoom={19}
          />
          {locations.map((loc) => (
            <Marker
              key={loc.id}
              position={loc.coords}
              icon={pinIcon(selectedId === loc.id)}
              ref={(ref) => {
                markerRefs.current[loc.id] = ref;
              }}
              eventHandlers={{ click: () => setSelectedId(loc.id) }}
            >
              <Popup>
                <LocationPopup loc={loc} />
              </Popup>
            </Marker>
          ))}
          <MapController
            selectedId={selectedId}
            markerRefs={markerRefs}
            locations={locations}
          />
        </MapContainer>

        {/* Liczba miast - subtelna nakładka */}
        <div className={`pointer-events-none absolute bottom-4 left-4 z-[400] border px-3.5 py-2 backdrop-blur-sm ${t.overlay}`}>
          <p className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${t.overlayLabel}`}>
            Miasta
          </p>
          <p className="mt-0.5 text-[13px] font-bold">
            {Object.keys(cityCount).length}
          </p>
        </div>
      </div>
    </div>
  );
}
