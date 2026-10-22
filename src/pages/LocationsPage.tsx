import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  Calculator,
  Check,
  ChevronDown,
  Clock,
  ExternalLink,
  Loader2,
  Mail,
  MapPin,
  Navigation,
  Package,
  Phone,
  Printer,
  Search,
  Share2,
  SlidersHorizontal,
  Stamp,
  Store,
  Truck,
  X,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import LocationsMap from "../components/LocationsMap";
import { SERVICE_LINKS } from "../data/content";
import { toRoute } from "../data/links";
import {
  CITY_COORDS,
  DAYS,
  DEFAULT_ORIGIN,
  FILTER_GROUPS,
  LOCATIONS,
  LOCATION_TYPES,
  RADIUS_OPTIONS,
  STATES,
  TYPE_COLOR,
  distanceMiles,
  matchesFilters,
  type LocationType,
  type UspsLocation,
} from "../data/locations";

type Sort = "distance" | "type-az" | "type-za";

/** "8:00 AM – 6:30 PM" → { open: 8, close: 18.5 } */
function parseRange(raw?: string): { open: number; close: number } | null {
  if (!raw) return null;
  const m = raw.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)\s*–\s*(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
  if (!m) return null;
  const to24 = (h: string, mins: string | undefined, ap: string) => {
    let n = Number(h);
    if (ap.toUpperCase() === "PM" && n !== 12) n += 12;
    if (ap.toUpperCase() === "AM" && n === 12) n = 0;
    return n + Number(mins ?? 0) / 60;
  };
  return { open: to24(m[1], m[2], m[3]), close: to24(m[4], m[5], m[6]) };
}

/** Today's open state, or null when the record has no counter hours. */
function openNow(loc: UspsLocation): boolean | null {
  const day = DAYS[(new Date().getDay() + 6) % 7];
  const range = parseRange(loc.hours[day]);
  if (!range && !loc.lobby24h) return null;
  if (loc.lobby24h) return true;
  if (!range) return false;
  const now = new Date();
  const h = now.getHours() + now.getMinutes() / 60;
  return h >= range.open && h < range.close;
}

export default function LocationsPage() {
  const [street, setStreet] = useState("");
  const [cityZip, setCityZip] = useState("10001");
  const [stateCode, setStateCode] = useState("NY");
  const [origin, setOrigin] = useState(DEFAULT_ORIGIN);
  const [types, setTypes] = useState<Set<LocationType>>(new Set(LOCATION_TYPES.map((t) => t.type)));
  const [showAllTypes, setShowAllTypes] = useState(false);
  const [filters, setFilters] = useState<string[]>([]);
  const [radius, setRadius] = useState(10);
  const [sort, setSort] = useState<Sort>("distance");
  const [panelOpen, setPanelOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [showAllDetails, setShowAllDetails] = useState(false);
  const [fitSignal, setFitSignal] = useState(0);
  const [areaIds, setAreaIds] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    let list = LOCATIONS.filter((l) => types.has(l.type) && matchesFilters(l, filters))
      .map((l) => ({ ...l, distance: distanceMiles(origin, l) }))
      .filter((l) => l.distance <= radius);
    if (areaIds) list = list.filter((l) => areaIds.includes(l.id));
    list.sort((a, b) => {
      if (sort === "distance") return a.distance - b.distance;
      const cmp = a.type.localeCompare(b.type);
      return sort === "type-az" ? cmp : -cmp;
    });
    return list;
  }, [types, filters, origin, radius, areaIds, sort]);

  const current = results.find((r) => r.id === selected) ?? null;

  const toggleType = (t: LocationType) => {
    setTypes((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
    setAreaIds(null);
  };

  const toggleFilter = (f: string) => {
    setFilters((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
    setAreaIds(null);
  };

  const resetAll = () => {
    setTypes(new Set(LOCATION_TYPES.map((t) => t.type)));
    setFilters([]);
    setRadius(100);
    setAreaIds(null);
    setSelected(null);
    setError(null);
    setFitSignal((n) => n + 1);
  };

  /** Resolves a typed ZIP or "City, ST" into map coordinates. */
  const resolveOrigin = async (): Promise<{ lat: number; lng: number; label: string } | null> => {
    const q = cityZip.trim().replace(/\s+/g, " ");
    if (!q) {
      setError("Enter a city and state, or a ZIP Code™.");
      return null;
    }

    if (/^\d{5}$/.test(q)) {
      try {
        const res = await fetch(`https://api.zippopotam.us/us/${q}`, {
          signal: AbortSignal.timeout(7000),
        });
        if (!res.ok) throw new Error("not found");
        const data = await res.json();
        const place = data?.places?.[0];
        if (!place) throw new Error("not found");
        return {
          lat: Number(place.latitude),
          lng: Number(place.longitude),
          label: `${place["place name"]}, ${place["state abbreviation"]} ${q}`,
        };
      } catch {
        setError(`We couldn't find ZIP Code™ ${q}. Check the number, or use your current location.`);
        return null;
      }
    }

    const city = q.split(",")[0].trim().toLowerCase();
    const st = (q.split(",")[1] ?? stateCode).trim().toUpperCase();
    const hit = CITY_COORDS[`${city}, ${st.toLowerCase()}`];
    if (hit) return hit;

    setError(
      `We couldn't locate "${q}". Try a ZIP Code™ or pick the state from the list, then search again.`
    );
    return null;
  };

  const runSearch = async () => {
    setError(null);
    setBusy(true);
    const next = await resolveOrigin();
    setBusy(false);
    if (!next) return;
    setOrigin(next);
    setSelected(null);
    setAreaIds(null);
    setFitSignal((n) => n + 1);
  };

  const useCurrentLocation = () => {
    setError(null);
    if (!navigator.geolocation) {
      setError("This browser can't share your location. Enter a ZIP Code™ instead.");
      return;
    }
    setBusy(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setBusy(false);
        setOrigin({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          label: "your current location",
        });
        setSelected(null);
        setAreaIds(null);
        setFitSignal((n) => n + 1);
      },
      () => {
        setBusy(false);
        setError(
          "We couldn't access your location. Allow location access in your browser, or enter a ZIP Code™."
        );
      },
      { timeout: 8000, maximumAge: 60_000 }
    );
  };

  const share = async (loc: UspsLocation) => {
    const text = `${loc.name}, ${loc.street}, ${loc.city}, ${loc.state} ${loc.zip}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: loc.name, text });
        return;
      } catch {
        /* dismissed — fall through to clipboard */
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  const directionsUrl = (loc: UspsLocation) =>
    `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`;

  const onlineIcons = [Printer, Stamp, Mail, Store, Calculator, Package, Truck, MapPin];

  return (
    <>
      {/* ---------------- Search ---------------- */}
      <section className="bg-usps-light border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 pt-10 pb-8">
          <PageHeader
            title="Find USPS Locations"
            route="locations"
            desc="Search for nearby Post Office™ locations, Collection Boxes, Self-Service Kiosks, and services like PO Boxes™ and Money Orders."
          />

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-[15px] font-black text-usps-darker">Find a Location</h3>
              <button
                type="button"
                onClick={useCurrentLocation}
                disabled={busy}
                className="flex items-center gap-2 text-[13px] font-bold text-usps-blue hover:text-usps-dark border border-usps-blue/30 hover:border-usps-blue rounded-full px-4 py-2 transition-colors disabled:opacity-50"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
                Use Current Location
              </button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
              <label className="block">
                <span className="block text-[12px] font-bold text-slate-700 mb-1">Street Address</span>
                <input
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Optional"
                  className="w-full border-2 border-slate-300 focus:border-usps-blue rounded-md px-3 py-2.5 text-[13.5px] outline-none"
                />
              </label>
              <label className="block">
                <span className="block text-[12px] font-bold text-slate-700 mb-1">City or ZIP Code™</span>
                <input
                  value={cityZip}
                  onChange={(e) => setCityZip(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runSearch()}
                  placeholder="New York or 10001"
                  className="w-full border-2 border-slate-300 focus:border-usps-blue rounded-md px-3 py-2.5 text-[13.5px] outline-none"
                />
              </label>
              <label className="block">
                <span className="block text-[12px] font-bold text-slate-700 mb-1">State</span>
                <select
                  value={stateCode}
                  onChange={(e) => setStateCode(e.target.value)}
                  className="w-full border-2 border-slate-300 focus:border-usps-blue rounded-md px-3 py-2.5 text-[13.5px] outline-none bg-white"
                >
                  {STATES.map(([code, name]) => (
                    <option key={code} value={code}>
                      {code} — {name}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={runSearch}
                  disabled={busy}
                  className="flex-1 flex items-center justify-center gap-2 bg-usps-blue hover:bg-usps-dark text-white font-bold px-5 py-2.5 rounded-md text-[13.5px] transition-colors disabled:opacity-60"
                >
                  <Search className="h-4 w-4" /> Search
                </button>
                <button
                  type="button"
                  onClick={resetAll}
                  className="px-4 py-2.5 rounded-md border-2 border-slate-300 hover:border-usps-blue hover:text-usps-blue text-[13px] font-bold text-slate-600 transition-colors"
                >
                  See All
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="mt-3 flex items-start gap-2 text-[12.5px] font-semibold text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-px" /> {error}
              </p>
            )}

            {/* Location types */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-bold text-slate-700">Location Type(s)</p>
                <button
                  type="button"
                  onClick={() => setShowAllTypes((s) => !s)}
                  className="text-[12px] font-bold text-usps-blue hover:underline flex items-center gap-1"
                >
                  {showAllTypes ? "See less" : "See more location types"}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showAllTypes ? "rotate-180" : ""}`} />
                </button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-2.5">
                {(showAllTypes ? LOCATION_TYPES : LOCATION_TYPES.slice(0, 4)).map((t) => {
                  const on = types.has(t.type);
                  return (
                    <button
                      key={t.type}
                      type="button"
                      onClick={() => toggleType(t.type)}
                      aria-pressed={on}
                      className={`flex items-start gap-2 text-left rounded-lg border-2 px-3 py-2 transition-colors ${
                        on ? "border-usps-blue bg-usps-light/60" : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <span
                        className={`mt-0.5 h-4 w-4 rounded border-2 flex items-center justify-center shrink-0 ${
                          on ? "bg-usps-blue border-usps-blue" : "border-slate-300 bg-white"
                        }`}
                      >
                        {on && <Check className="h-3 w-3 text-white" />}
                      </span>
                      <span>
                        <span className="block text-[12.5px] font-bold text-slate-800 leading-tight">{t.short}</span>
                        <span className="block text-[11px] text-slate-500 leading-snug mt-0.5">{t.desc}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
              {types.size === 0 && (
                <p className="mt-2 text-[12px] font-semibold text-red-700">At least one location type must be selected.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Results + map ---------------- */}
      <section className="py-8 lg:py-10 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <p className="text-[15px] font-black text-usps-darker">
                {results.length} {results.length === 1 ? "Result" : "Results"}
              </p>
              <p className="text-[12px] text-slate-500">
                within {radius} miles of {origin.label}
                {areaIds ? " · searched area" : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[12px] font-bold text-slate-600">Sort</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="border-2 border-slate-300 rounded-md px-2.5 py-1.5 text-[12.5px] font-semibold bg-white outline-none focus:border-usps-blue"
              >
                <option value="distance">Distance</option>
                <option value="type-az">Location Type (A–Z)</option>
                <option value="type-za">Location Type (Z–A)</option>
              </select>
              <button
                type="button"
                onClick={() => setPanelOpen((p) => !p)}
                aria-expanded={panelOpen}
                className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-[12.5px] font-bold border-2 transition-colors ${
                  panelOpen || filters.length
                    ? "border-usps-blue text-usps-blue bg-usps-light/50"
                    : "border-slate-300 text-slate-600 hover:border-usps-blue hover:text-usps-blue"
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" /> Filter &amp; Sort
                {filters.length > 0 && (
                  <span className="ml-1 bg-usps-blue text-white rounded-full px-1.5 text-[10px]">{filters.length}</span>
                )}
              </button>
            </div>
          </div>

          {/* Filter panel */}
          {panelOpen && (
            <div className="mb-5 border border-slate-200 rounded-xl bg-slate-50 p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-[14px] text-usps-darker">Filter &amp; Sort</h4>
                <button
                  type="button"
                  onClick={() => setFilters([])}
                  className="text-[12px] font-bold text-usps-blue hover:underline"
                >
                  Clear filters
                </button>
              </div>

              <div className="mt-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Distance</p>
                <div className="flex flex-wrap gap-1.5">
                  {RADIUS_OPTIONS.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setRadius(r);
                        setAreaIds(null);
                        setFitSignal((n) => n + 1);
                      }}
                      className={`px-3 py-1.5 rounded-full text-[12px] font-bold border transition-colors ${
                        radius === r
                          ? "bg-usps-blue text-white border-usps-blue"
                          : "bg-white text-slate-600 border-slate-300 hover:border-usps-blue"
                      }`}
                    >
                      {r} {r === 1 ? "mile" : "miles"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4 mt-4">
                {FILTER_GROUPS.map((g) => (
                  <div key={g.heading}>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">{g.heading}</p>
                    <ul className="space-y-1">
                      {g.filters.map((f) => {
                        const on = filters.includes(f);
                        return (
                          <li key={f}>
                            <button
                              type="button"
                              onClick={() => toggleFilter(f)}
                              aria-pressed={on}
                              className="flex items-start gap-1.5 text-left group"
                            >
                              <span
                                className={`mt-0.5 h-3.5 w-3.5 rounded-sm border-2 flex items-center justify-center shrink-0 ${
                                  on ? "bg-usps-blue border-usps-blue" : "border-slate-300 bg-white"
                                }`}
                              >
                                {on && <Check className="h-2.5 w-2.5 text-white" />}
                              </span>
                              <span className={`text-[12px] leading-tight ${on ? "font-bold text-usps-blue" : "text-slate-600 group-hover:text-slate-900"}`}>
                                {f}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => setPanelOpen(false)}
                  className="bg-usps-blue hover:bg-usps-dark text-white font-bold px-5 py-2 rounded-md text-[12.5px] transition-colors"
                >
                  Apply Filter(s)
                </button>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-5">
            {/* Map first on mobile */}
            <div className="lg:order-2">
              <div className="lg:sticky lg:top-32">
                <LocationsMap
                  locations={results}
                  selectedId={selected}
                  onSelect={setSelected}
                  onSearchArea={(ids) => {
                    setAreaIds(ids);
                    setPanelOpen(false);
                  }}
                  fitSignal={fitSignal}
                  originLabel={origin.label}
                />
                {areaIds && (
                  <button
                    type="button"
                    onClick={() => setAreaIds(null)}
                    className="mt-2 text-[12px] font-bold text-usps-blue hover:underline"
                  >
                    Clear “Search this Area” and show all results
                  </button>
                )}
              </div>
            </div>

            {/* List */}
            <div className="lg:order-1 space-y-2.5">
              {current && (
                <div className="border-2 border-usps-blue rounded-xl overflow-hidden bg-white shadow-md">
                  <div className="flex items-start justify-between gap-3 px-4 py-3" style={{ background: `${TYPE_COLOR[current.type]}0f` }}>
                    <div>
                      <p className="text-[10.5px] font-bold uppercase tracking-wider" style={{ color: TYPE_COLOR[current.type] }}>
                        {current.type}
                      </p>
                      <h3 className="font-black text-[16px] text-usps-darker leading-tight">{current.name}</h3>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => share(current)}
                        className="flex items-center gap-1 text-[11.5px] font-bold text-slate-600 hover:text-usps-blue px-2 py-1 rounded hover:bg-white transition-colors"
                      >
                        {copied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
                        {copied ? "Copied" : "Share"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelected(null)}
                        aria-label="Close details"
                        className="p-1 rounded text-slate-500 hover:bg-white hover:text-slate-900"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="px-4 py-3">
                    <p className="text-[13px] text-slate-700">
                      {current.street}, {current.city}, {current.state} {current.zip}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-[12px]">
                      <span className="font-bold text-usps-blue">{current.distance.toFixed(1)} mi away</span>
                      {(() => {
                        const open = openNow(current);
                        if (open === null) return null;
                        return (
                          <span className={`font-bold ${open ? "text-green-700" : "text-red-600"}`}>
                            {open ? "Open now" : "Closed now"}
                          </span>
                        );
                      })()}
                      {current.phone && (
                        <a href={`tel:${current.phone.replace(/[^\d]/g, "")}`} className="flex items-center gap-1 text-slate-600 hover:text-usps-blue font-semibold">
                          <Phone className="h-3.5 w-3.5" /> {current.phone}
                        </a>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 mt-3">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Hours</p>
                        <ul className="space-y-0.5">
                          {DAYS.map((d) => (
                            <li key={d} className="flex justify-between gap-3 text-[11.5px]">
                              <span className="text-slate-500 w-9">{d}</span>
                              <span className={`${current.hours[d] ? "text-slate-800" : "text-slate-400"} font-medium`}>
                                {current.hours[d] ?? "Closed"}
                              </span>
                            </li>
                          ))}
                        </ul>
                        {current.lobby24h && (
                          <p className="mt-1 text-[11px] font-semibold text-green-700 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> 24-hour lobby access
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Services
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {(showAllDetails ? current.services : current.services.slice(0, 6)).map((s) => (
                            <span key={s} className="text-[10.5px] font-semibold bg-slate-100 text-slate-700 rounded px-1.5 py-0.5">
                              {s}
                            </span>
                          ))}
                        </div>
                        {current.tty && <p className="text-[11px] text-slate-500 mt-2">TTY: {current.tty}</p>}
                        <button
                          type="button"
                          onClick={() => setShowAllDetails((v) => !v)}
                          className="mt-2 text-[11.5px] font-bold text-usps-blue hover:underline"
                        >
                          {showAllDetails ? "See less" : "View All Location Details"}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      <a
                        href={directionsUrl(current)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 bg-usps-blue hover:bg-usps-dark text-white font-bold text-[12.5px] px-4 py-2 rounded-md transition-colors"
                      >
                        <Navigation className="h-3.5 w-3.5" /> Directions
                      </a>
                      <a
                        href={`tel:18002758777`}
                        className="flex items-center gap-1.5 border-2 border-slate-300 hover:border-usps-blue hover:text-usps-blue text-slate-700 font-bold text-[12.5px] px-4 py-2 rounded-md transition-colors"
                      >
                        <Phone className="h-3.5 w-3.5" /> 1-800-ASK-USPS®
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {results.length === 0 && (
                <div className="border border-slate-200 rounded-xl p-6 text-center bg-slate-50">
                  <Building2 className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-bold text-slate-800 text-[14px]">No locations match these filters</p>
                  <p className="text-[12.5px] text-slate-500 mt-1">
                    Try a wider distance, or clear a location type or service filter.
                  </p>
                  <button
                    type="button"
                    onClick={resetAll}
                    className="mt-3 bg-usps-blue text-white font-bold text-[12.5px] px-4 py-2 rounded-md hover:bg-usps-dark transition-colors"
                  >
                    Show all locations
                  </button>
                </div>
              )}

              <ul className="space-y-2.5">
                {results.map((loc, i) => (
                  <li key={loc.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(loc.id)}
                      className={`w-full text-left flex items-start gap-3 border rounded-lg p-3 transition-all hover:shadow-md ${
                        selected === loc.id ? "border-usps-blue bg-usps-light/40" : "border-slate-200 hover:border-usps-blue bg-white"
                      }`}
                    >
                      <span
                        className="h-6 w-6 rounded-full shrink-0 flex items-center justify-center text-[11px] font-black text-white mt-0.5"
                        style={{ background: TYPE_COLOR[loc.type] }}
                      >
                        {i + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[10px] font-bold uppercase tracking-wider" style={{ color: TYPE_COLOR[loc.type] }}>
                          {loc.type}
                        </span>
                        <span className="block font-bold text-[13.5px] text-slate-900 leading-tight">{loc.name}</span>
                        <span className="block text-[12px] text-slate-500 mt-0.5">
                          {loc.street}, {loc.city}, {loc.state} {loc.zip}
                        </span>
                        <span className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-[11.5px] font-bold text-usps-blue">{loc.distance.toFixed(1)} mi</span>
                          {(() => {
                            const open = openNow(loc);
                            if (open === null) return null;
                            return (
                              <span className={`text-[11px] font-bold ${open ? "text-green-700" : "text-red-600"}`}>
                                {open ? "Open now" : "Closed"}
                              </span>
                            );
                          })()}
                          <span className="text-[11px] text-slate-400 truncate">
                            {loc.services.slice(0, 2).join(" · ")}
                          </span>
                        </span>
                      </span>
                      <ExternalLink className="h-3.5 w-3.5 text-slate-300 shrink-0 mt-1" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Streamline your visit ---------------- */}
      <section className="py-12 bg-slate-50 border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-2xl lg:text-3xl font-black text-usps-darker tracking-tight">
            Streamline Your Visit to the Post Office
          </h2>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            {[
              {
                icon: Package,
                title: "Prepare Your Mail & Packages",
                body: "If you're sending packages or letters, have them properly packaged and addressed before going to the Post Office.",
                link: ["How to Send a Letter", "/shipping-restrictions"],
                link2: ["How to Send a Package", "/ship"],
              },
              {
                icon: Printer,
                title: "Complete Forms in Advance",
                body: "If you're applying for a passport or filling out other forms, complete them beforehand and bring the required documents.",
                link: ["Passport Help", "/passport-services"],
                link2: ["Filling Out Customs Forms", "/customs-forms"],
              },
              {
                icon: Clock,
                title: "Schedule Passport Appointments",
                body: "Check if your local Post Office offers passport appointment scheduling and reserve a time slot to avoid long waits.",
                link: ["Schedule a Passport Appointment", "/passport-services"],
                link2: ["Find a Location", "/locations"],
              },
            ].map((c) => (
              <div key={c.title} className="bg-white rounded-xl border border-slate-200 p-5">
                <c.icon className="h-8 w-8 text-usps-blue mb-3" />
                <h3 className="font-black text-[15px] text-usps-darker leading-snug">{c.title}</h3>
                <p className="text-[12.5px] text-slate-600 mt-1.5 leading-relaxed">{c.body}</p>
                <div className="mt-3 flex flex-col gap-1">
                  <Link to={c.link[1]} className="text-[12.5px] font-bold text-usps-blue hover:underline flex items-center gap-1">
                    {c.link[0]} <ArrowRight className="h-3 w-3" />
                  </Link>
                  <Link to={c.link2[1]} className="text-[12.5px] font-bold text-usps-blue hover:underline flex items-center gap-1">
                    {c.link2[0]} <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- What can I do in person ---------------- */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 grid lg:grid-cols-[320px_1fr] gap-8">
          <div>
            <MapPin className="h-8 w-8 text-usps-blue mb-3" />
            <h2 className="text-2xl font-black text-usps-darker leading-tight">
              What can I do at a USPS location that I can't do online?
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              ["Verify Your Identity In-Person", "Some USPS® services require identity verification. If you can't verify online, bring acceptable ID and any required documents."],
              ["Complete Customs Forms & Specialized Services", "You may need to visit a Post Office for certain customs forms, bulk mailings, or services for businesses."],
              ["Weigh & Pay for Packages", "If you don't have a scale or printer, weigh your packages and pay at a self-service kiosk or the counter — cash accepted."],
              ["Get Expert Help from a Retail Associate", "Sometimes it helps to speak to a local expert about your specific mailing or receiving situation."],
            ].map(([title, body]) => (
              <div key={title}>
                <h3 className="font-bold text-[14px] text-usps-darker">{title}</h3>
                <p className="text-[12.5px] text-slate-600 mt-1 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Location types ---------------- */}
      <section className="py-12 bg-slate-50 border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-2xl font-black text-usps-darker tracking-tight">USPS Location Types</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {LOCATION_TYPES.map((t) => (
              <div key={t.type} className="bg-white rounded-xl border border-slate-200 p-4">
                <span className="inline-block h-2.5 w-2.5 rounded-full mb-2" style={{ background: t.color }} />
                <h3 className="font-bold text-[13.5px] text-usps-darker">{t.type}</h3>
                <p className="text-[12px] text-slate-600 mt-1 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Online services ---------------- */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-usps-red mb-1">Always Open</p>
          <h2 className="text-2xl font-black text-usps-darker tracking-tight">USPS Online Services</h2>
          <p className="text-[13px] text-slate-600 mt-1 max-w-2xl">
            USPS offers many online services to help you get your shipping and mailing needs covered from home or work.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {SERVICE_LINKS.slice(0, 8).map((s, i) => {
              const Icon = onlineIcons[i] ?? Package;
              return (
                <Link
                  key={s.label}
                  to={toRoute(s.label)}
                  className="flex items-center gap-3 border border-slate-200 rounded-lg p-3 hover:border-usps-blue hover:shadow-md transition-all"
                >
                  <Icon className="h-6 w-6 text-usps-blue shrink-0" />
                  <span className="text-[12.5px] font-bold text-slate-800 leading-tight">{s.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- FAQs ---------------- */}
      <section className="pb-14">
        <div className="mx-auto max-w-7xl px-4">
          <div className="rounded-xl bg-usps-light border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-black text-[18px] text-usps-darker">Can't find what you're looking for?</h2>
              <p className="text-[13px] text-slate-600 mt-1">
                Visit FAQs for answers to common questions about USPS locations and services.
              </p>
            </div>
            <Link
              to="/help"
              className="inline-flex items-center gap-2 bg-usps-blue hover:bg-usps-dark text-white font-bold px-5 py-2.5 rounded-md text-[13px] transition-colors whitespace-nowrap"
            >
              FAQs <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
