import { useEffect, useRef, useState } from "react";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Layers, Crosshair } from "lucide-react";
import { LOCATION_TYPES, TYPE_COLOR, type UspsLocation } from "../data/locations";

export interface MapLocation extends UspsLocation {
  distance: number;
}

interface Props {
  locations: MapLocation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** Called with the ids visible in the current viewport. */
  onSearchArea: (ids: string[]) => void;
  /** Increment to re-fit the map to the current result set. */
  fitSignal: number;
  originLabel: string;
}

const STREET_TILES = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const SATELLITE_TILES =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

export default function LocationsMap({
  locations,
  selectedId,
  onSelect,
  onSearchArea,
  fitSignal,
  originLabel,
}: Props) {
  const holder = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const tilesRef = useRef<{ street: L.TileLayer; satellite: L.TileLayer } | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const dataRef = useRef<MapLocation[]>(locations);
  const [satellite, setSatellite] = useState(false);
  const [ready, setReady] = useState(false);

  dataRef.current = locations;

  /* Create the map exactly once (StrictMode mounts twice in development). */
  useEffect(() => {
    if (!holder.current || mapRef.current) return;

    const map = L.map(holder.current, {
      center: [40.7484, -73.9857],
      zoom: 12,
      zoomControl: true,
      attributionControl: true,
    });

    const street = L.tileLayer(STREET_TILES, {
      maxZoom: 19,
      subdomains: "abc",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    });
    const sat = L.tileLayer(SATELLITE_TILES, {
      maxZoom: 19,
      attribution: "Imagery &copy; Esri, Maxar, Earthstar Geographics",
    });
    street.addTo(map);

    layerRef.current = L.layerGroup().addTo(map);
    tilesRef.current = { street, satellite: sat };
    mapRef.current = map;
    setReady(true);

    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
      tilesRef.current = null;
      markersRef.current = {};
      setReady(false);
    };
  }, []);

  /* Swap basemap. */
  useEffect(() => {
    const map = mapRef.current;
    const tiles = tilesRef.current;
    if (!map || !tiles) return;
    if (satellite) {
      map.removeLayer(tiles.street);
      tiles.satellite.addTo(map);
    } else {
      map.removeLayer(tiles.satellite);
      tiles.street.addTo(map);
    }
  }, [satellite]);

  /* Redraw pins whenever the result set or the selection changes. */
  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();
    markersRef.current = {};

    locations.forEach((loc, i) => {
      const color = TYPE_COLOR[loc.type];
      const active = loc.id === selectedId;
      const icon = L.divIcon({
        className: "usps-pin-wrap",
        html: `<div class="usps-pin${active ? " usps-pin-active" : ""}" style="background:${color}"><span>${i + 1}</span></div>`,
        iconSize: [26, 34],
        iconAnchor: [13, 34],
      });
      const marker = L.marker([loc.lat, loc.lng], { icon, title: loc.name, alt: loc.name });
      marker.bindTooltip(`${loc.name}`, { direction: "top", offset: [0, -30], className: "usps-tip" });
      marker.on("click", () => onSelect(loc.id));
      marker.addTo(layer);
      markersRef.current[loc.id] = marker;
    });

  }, [locations, selectedId]);

  /*
   * Fit only for a brand-new search (or the first paint). Selecting a pin or
   * changing a filter must not yank the viewport out from under the user.
   */
  const fitted = useRef(false);
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    if (fitted.current && fitSignal === 0) return;
    const data = dataRef.current;
    if (data.length === 0) return;
    if (data.length === 1) {
      map.setView([data[0].lat, data[0].lng], 15);
    } else {
      map.fitBounds(L.latLngBounds(data.map((l) => [l.lat, l.lng] as [number, number])).pad(0.18));
    }
    fitted.current = true;
  }, [fitSignal, ready]);

  /* Pan to the selection when it changes from the results list. */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedId) return;
    const loc = locations.find((l) => l.id === selectedId);
    const marker = markersRef.current[selectedId];
    if (!loc || !marker) return;
    map.panTo([loc.lat, loc.lng], { animate: true });
    if (map.getZoom() < 14) map.setZoom(15);
    marker.openTooltip();
  }, [selectedId, locations]);

  const searchThisArea = () => {
    const map = mapRef.current;
    if (!map) return;
    const bounds = map.getBounds();
    const ids = dataRef.current
      .filter((l) => bounds.contains([l.lat, l.lng]))
      .map((l) => l.id);
    onSearchArea(ids);
  };

  return (
    <div className="relative isolate h-[320px] sm:h-[420px] lg:h-[560px] rounded-xl overflow-hidden border border-slate-300 bg-slate-100">
      <div ref={holder} className="absolute inset-0 z-0" aria-label="Map of USPS locations" role="application" />

      {ready && (
        <>
          {/* Street / Satellite + zoom */}
          <div className="absolute top-3 right-3 z-[500] flex flex-col gap-2 items-end">
            <button
              type="button"
              onClick={() => setSatellite((s) => !s)}
              className="flex items-center gap-2 bg-white/95 backdrop-blur px-3 py-2 rounded-md shadow-md border border-slate-200 text-[12px] font-bold text-slate-700 hover:bg-white transition-colors"
              aria-pressed={satellite}
            >
              <Layers className="h-3.5 w-3.5 text-usps-blue" />
              {satellite ? "Satellite" : "Street"}
            </button>
          </div>

          {/* Search this area */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[500]">
            <button
              type="button"
              onClick={searchThisArea}
              className="flex items-center gap-2 bg-usps-blue hover:bg-usps-dark text-white px-4 py-2 rounded-full shadow-lg text-[12.5px] font-bold transition-colors"
            >
              <Crosshair className="h-3.5 w-3.5" /> Search this Area
            </button>
          </div>

          {/* Legend */}
          <div className="absolute bottom-3 left-3 z-[500] bg-white/95 backdrop-blur rounded-lg shadow-md border border-slate-200 px-3 py-2 max-w-[190px]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Location types</p>
            <ul className="space-y-1">
              {LOCATION_TYPES.map((t) => (
                <li key={t.type} className="flex items-center gap-1.5 text-[11px] font-medium text-slate-700">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: t.color }} />
                  {t.short}
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile gesture hint + origin */}
          <div className="absolute bottom-3 right-3 z-[500] flex flex-col items-end gap-1.5">
            <span className="sm:hidden bg-white/95 backdrop-blur rounded-md px-2.5 py-1.5 text-[10.5px] font-semibold text-slate-600 shadow border border-slate-200">
              Use two fingers to move the map
            </span>
            <span className="bg-usps-darker/85 text-white rounded-md px-2.5 py-1.5 text-[10.5px] font-semibold shadow">
              Searching near {originLabel}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
