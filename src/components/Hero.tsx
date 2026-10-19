import { useState } from "react";
import { ChevronLeft, CheckCircle2, Circle, Package, Search, Loader2, ArrowRight } from "lucide-react";
import { IMAGES, ICONS, mockTracking, calcPostage, zipLookup, POST_OFFICES } from "../data/content";

type Tab = "track" | "zip" | "calc" | "pickup" | "locations";

const TABS: { id: Tab; label: string; icon: string; alt: string }[] = [
  { id: "track", label: "Track", icon: ICONS.tracking, alt: "Track a package icon" },
  { id: "zip", label: "ZIP Code™", icon: ICONS.zip, alt: "ZIP Code lookup icon" },
  { id: "calc", label: "Calculate", icon: ICONS.calculator, alt: "Calculate a price icon" },
  { id: "pickup", label: "Pickup", icon: ICONS.pickup, alt: "Schedule a pickup icon" },
  { id: "locations", label: "Locations", icon: ICONS.location, alt: "Find locations icon" },
];

export default function Hero() {
  const [tab, setTab] = useState<Tab>("track");

  return (
    <section>
      <h1 className="sr-only">USPS.com Home Page</h1>

      {/* ===== Premium feature band — real USPS Ground Advantage® hero ===== */}
      <div className="relative overflow-hidden bg-usps-darker">
        {/* Desktop hero photo */}
        <img
          src={IMAGES.heroGA}
          alt="A person holding a clipboard with shipping boxes in the background."
          className="hidden md:block absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Mobile hero photo */}
        <img
          src={IMAGES.heroGAMobile}
          alt="A person holding a clipboard with shipping boxes in the background."
          className="md:hidden absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-usps-darker/90 via-usps-darker/55 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 md:py-16 lg:py-20">
          <div className="max-w-xl text-white fade-slide">
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black leading-[1.08] tracking-tight">
              Ship with USPS Ground Advantage<sup className="text-[0.5em]">®</sup>
            </h2>
            <p className="mt-3 text-[15px] lg:text-[17px] text-white/90 leading-relaxed">
              Our simplified ground shipping solution helps your business deliver in 2-5 days*,
              with no hidden fees and USPS Tracking<sup>®</sup> included in the cost.
            </p>
            <a
              href="#ship"
              className="mt-5 inline-flex items-center gap-2 bg-usps-red hover:bg-usps-reddark text-white font-bold px-7 py-3 rounded-full text-[15px] transition-all hover:gap-3 shadow-lg shadow-red-950/40"
            >
              Learn More <ArrowRight className="h-4 w-4" />
            </a>
            <p className="mt-4 text-[11px] text-white/60 leading-snug max-w-md">
              *For mailable items up to 70 lbs. Expected delivery in 2-5 days. Packages going to certain
              places (including Alaska, Hawaii, and offshore destinations), or containing hazardous
              materials may receive slower service.
            </p>
          </div>
        </div>
      </div>

      {/* ===== Search or Track Packages widget ===== */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <h2 className="text-xl lg:text-2xl font-black text-usps-darker tracking-tight mb-4">
            Search or Track Packages
          </h2>
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="flex bg-slate-100 overflow-x-auto no-scrollbar" role="tablist" aria-label="Quick tools">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex-1 min-w-[96px] flex flex-col items-center gap-1.5 py-3.5 px-2 text-[12px] font-bold uppercase tracking-wide transition-colors border-b-[3px] ${
                    tab === t.id
                      ? "bg-white text-usps-blue border-usps-red"
                      : "text-slate-500 border-transparent hover:text-usps-blue hover:bg-slate-50"
                  }`}
                >
                  <img src={t.icon} alt={t.alt} className="h-8 w-8 object-contain" loading="lazy" />
                  {t.label}
                </button>
              ))}
            </div>
            <div className="p-5 lg:p-6">
              {tab === "track" && <TrackPanel />}
              {tab === "zip" && <ZipPanel />}
              {tab === "calc" && <CalcPanel />}
              {tab === "pickup" && <PickupPanel />}
              {tab === "locations" && <LocationsPanel />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- TRACK PANEL ---------------- */
function TrackPanel() {
  const [num, setNum] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof mockTracking> | null>(null);

  const submit = (e?: React.FormEvent, preset?: string) => {
    e?.preventDefault();
    const val = preset ?? num;
    if (!val.trim()) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(mockTracking(val.trim()));
      setLoading(false);
    }, 900);
  };

  if (result) {
    const pct = ((result.stageIndex + 1) / 5) * 100;
    return (
      <div className="fade-slide max-w-3xl">
        <button onClick={() => { setResult(null); setNum(""); }} className="text-[13px] font-semibold text-usps-blue hover:underline flex items-center gap-1 mb-3">
          <ChevronLeft className="h-4 w-4" /> Track another package
        </button>
        <div className="bg-usps-light rounded-lg p-4 mb-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{result.service}</p>
              <p className="font-mono text-[13px] font-bold text-usps-darker break-all">{result.number}</p>
            </div>
            <span className={`shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${result.status === "Delivered" ? "bg-green-600 text-white" : "bg-usps-blue text-white"}`}>
              {result.status}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-600">Expected: <span className="font-bold text-slate-900">{result.eta}</span></p>
          <div className="mt-3">
            <div className="h-2 bg-white rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-usps-blue to-green-500 rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
            </div>
            <div className="flex justify-between mt-1.5">
              {["Created", "Accepted", "Transit", "Out for delivery", "Delivered"].map((l, i) => (
                <span key={l} className={`text-[9px] font-bold uppercase ${i <= result.stageIndex ? "text-usps-blue" : "text-slate-400"}`}>{l}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-x-6">
          {result.events.map((ev, i) => (
            <div key={i} className="flex gap-3 pb-4 relative">
              {i < result.events.length - 1 && <span className="absolute left-[9px] top-5 bottom-0 w-[2px] bg-slate-200 sm:hidden" />}
              <span className={`mt-0.5 shrink-0 ${i === 0 ? "text-green-600" : "text-slate-300"}`}>
                {i === 0 ? <CheckCircle2 className="h-[18px] w-[18px] fill-green-100" /> : <Circle className="h-[18px] w-[18px] fill-white" />}
              </span>
              <div>
                <p className="text-[13.5px] font-bold text-slate-900 leading-tight">{ev.title}</p>
                <p className="text-[12.5px] text-slate-600">{ev.desc} — {ev.loc}</p>
                <p className="text-[11.5px] text-slate-400">{ev.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => submit(e)} className="fade-slide max-w-3xl">
      <label htmlFor="hero-track" className="text-[13px] font-bold text-slate-700">Search or Enter a Tracking Number</label>
      <div className="mt-2 flex flex-col sm:flex-row gap-2">
        <input
          id="hero-track"
          value={num}
          onChange={(e) => setNum(e.target.value)}
          placeholder="e.g. 9400 1118 9922 3040 0000 00"
          className="flex-1 border-2 border-slate-300 focus:border-usps-blue rounded-md px-4 py-3 text-[15px] font-mono outline-none transition-colors"
        />
        <button type="submit" disabled={loading || !num.trim()} className="bg-usps-blue hover:bg-usps-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-md text-[15px] flex items-center justify-center gap-2 transition-colors">
          {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Tracking…</> : <><Search className="h-4 w-4" /> Search</>}
        </button>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-[12.5px]">
        <span className="text-slate-500">Try a sample:</span>
        {["9400111899223040000018", "EJ958083578US"].map((s) => (
          <button key={s} type="button" onClick={() => submit(undefined, s)} className="font-mono font-bold text-usps-blue hover:underline">
            {s}
          </button>
        ))}
      </div>
      <p className="mt-3 text-[12.5px] text-slate-500">
        <Package className="h-3.5 w-3.5 inline mr-1 text-usps-blue" />
        Get <a href="#informed" className="text-usps-blue font-semibold hover:underline">Informed Delivery®</a> alerts for all your packages.
      </p>
    </form>
  );
}

/* ---------------- ZIP PANEL ---------------- */
function ZipPanel() {
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zips, setZips] = useState<string[] | null>(null);
  return (
    <div className="fade-slide max-w-3xl">
      <h3 className="text-lg font-bold text-slate-900">Look Up a ZIP Code™</h3>
      <p className="text-[13px] text-slate-500 mb-3">Find the ZIP+4 for any U.S. address.</p>
      <div className="grid sm:grid-cols-[1fr_120px_auto] gap-2 items-end">
        <div>
          <label className="text-[12px] font-bold text-slate-700 uppercase">City</label>
          <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="New York" className="mt-1 w-full border-2 border-slate-300 focus:border-usps-blue rounded-md px-3 py-2.5 text-sm outline-none" />
        </div>
        <div>
          <label className="text-[12px] font-bold text-slate-700 uppercase">State</label>
          <input value={state} onChange={(e) => setState(e.target.value)} placeholder="NY" maxLength={2} className="mt-1 w-full border-2 border-slate-300 focus:border-usps-blue rounded-md px-3 py-2.5 text-sm uppercase outline-none" />
        </div>
        <button
          onClick={() => city && state && setZips(zipLookup(city, state))}
          disabled={!city || !state}
          className="bg-usps-blue hover:bg-usps-dark disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-md text-[14px] transition-colors"
        >
          Find
        </button>
      </div>
      {zips && (
        <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3 fade-slide">
          <p className="text-[12px] font-bold text-green-800 uppercase tracking-wide mb-1.5">Results for {city}, {state.toUpperCase()}</p>
          <div className="flex gap-2">
            {zips.map((z) => (
              <span key={z} className="bg-white border border-green-200 font-mono font-bold text-[15px] px-3 py-1.5 rounded-md text-slate-900">{z}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- CALC PANEL ---------------- */
function CalcPanel() {
  const [from, setFrom] = useState("10001");
  const [to, setTo] = useState("90210");
  const [lbs, setLbs] = useState(2);
  const [oz, setOz] = useState(0);
  const [shape, setShape] = useState("Package");
  const [res, setRes] = useState<ReturnType<typeof calcPostage> | null>(null);

  return (
    <div className="fade-slide max-w-3xl">
      <h3 className="text-lg font-bold text-slate-900">Calculate a Price</h3>
      <div className="grid grid-cols-2 sm:grid-cols-[1fr_1fr_90px_90px_1.2fr_auto] gap-2 mt-2 items-end">
        <div>
          <label className="text-[12px] font-bold text-slate-700 uppercase">From ZIP</label>
          <input value={from} onChange={(e) => setFrom(e.target.value.replace(/\D/g, "").slice(0, 5))} className="mt-1 w-full border-2 border-slate-300 focus:border-usps-blue rounded-md px-3 py-2 text-sm font-mono outline-none" />
        </div>
        <div>
          <label className="text-[12px] font-bold text-slate-700 uppercase">To ZIP</label>
          <input value={to} onChange={(e) => setTo(e.target.value.replace(/\D/g, "").slice(0, 5))} className="mt-1 w-full border-2 border-slate-300 focus:border-usps-blue rounded-md px-3 py-2 text-sm font-mono outline-none" />
        </div>
        <div>
          <label className="text-[12px] font-bold text-slate-700 uppercase">Lbs</label>
          <input type="number" min={0} max={70} value={lbs} onChange={(e) => setLbs(+e.target.value)} className="mt-1 w-full border-2 border-slate-300 focus:border-usps-blue rounded-md px-3 py-2 text-sm outline-none" />
        </div>
        <div>
          <label className="text-[12px] font-bold text-slate-700 uppercase">Oz</label>
          <input type="number" min={0} max={15} value={oz} onChange={(e) => setOz(+e.target.value)} className="mt-1 w-full border-2 border-slate-300 focus:border-usps-blue rounded-md px-3 py-2 text-sm outline-none" />
        </div>
        <div>
          <label className="text-[12px] font-bold text-slate-700 uppercase">Shape</label>
          <select value={shape} onChange={(e) => setShape(e.target.value)} className="mt-1 w-full border-2 border-slate-300 focus:border-usps-blue rounded-md px-2 py-2 text-[13px] outline-none bg-white">
            <option>Package</option>
            <option>Large Envelope</option>
            <option>Letter</option>
            <option>Flat Rate Box</option>
          </select>
        </div>
        <button onClick={() => setRes(calcPostage(from, to, lbs, oz, shape))} className="bg-usps-blue hover:bg-usps-dark text-white font-bold px-6 py-2 rounded-md text-[14px] transition-colors whitespace-nowrap">
          Calculate
        </button>
      </div>
      {res && (
        <div className="mt-3 grid sm:grid-cols-3 gap-2 fade-slide">
          {[
            { n: "Ground Advantage®", p: res.ground, d: res.days.ground },
            { n: "Priority Mail®", p: res.priority, d: res.days.priority },
            { n: "Express®", p: res.express, d: res.days.express },
          ].map((r) => (
            <div key={r.n} className="bg-slate-50 rounded-lg px-3 py-2.5 text-center border border-slate-100">
              <p className="font-bold text-[13px] text-slate-700">{r.n}</p>
              <p className="font-black text-xl text-usps-blue">${r.p.toFixed(2)}</p>
              <p className="text-[11.5px] text-slate-500">{r.d} · Zone {res.zone}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- PICKUP PANEL ---------------- */
function PickupPanel() {
  const [done, setDone] = useState(false);
  const [addr, setAddr] = useState("");
  const [date, setDate] = useState(new Date(Date.now() + 86400000).toISOString().slice(0, 10));
  const [count, setCount] = useState(1);
  if (done) {
    return (
      <div className="fade-slide text-center py-4 max-w-xl mx-auto">
        <CheckCircle2 className="h-14 w-14 text-green-600 mx-auto fill-green-100" />
        <h3 className="text-lg font-bold mt-3">Pickup Scheduled!</h3>
        <p className="text-sm text-slate-600 mt-1">Carrier will collect <b>{count} package{count > 1 ? "s" : ""}</b> on <b>{new Date(date + "T12:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</b></p>
        <p className="text-[12px] text-slate-500 mt-2 font-mono">Confirmation #PU-{Math.floor(100000 + Math.random() * 899999)}</p>
        <button onClick={() => { setDone(false); setAddr(""); }} className="mt-4 text-usps-blue font-bold text-sm hover:underline">Schedule another pickup</button>
      </div>
    );
  }
  return (
    <div className="fade-slide max-w-3xl">
      <h3 className="text-lg font-bold text-slate-900">Schedule a Pickup</h3>
      <p className="text-[13px] text-slate-500 mb-3">Free carrier pickup during regular delivery.</p>
      <div className="grid sm:grid-cols-[1fr_170px_110px_auto] gap-2 items-end">
        <div>
          <label className="text-[12px] font-bold text-slate-700 uppercase">Pickup Address</label>
          <input value={addr} onChange={(e) => setAddr(e.target.value)} placeholder="Street address, City, ST ZIP" className="mt-1 w-full border-2 border-slate-300 focus:border-usps-blue rounded-md px-3 py-2.5 text-sm outline-none" />
        </div>
        <div>
          <label className="text-[12px] font-bold text-slate-700 uppercase">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full border-2 border-slate-300 focus:border-usps-blue rounded-md px-3 py-2 text-sm outline-none" />
        </div>
        <div>
          <label className="text-[12px] font-bold text-slate-700 uppercase">Packages</label>
          <input type="number" min={1} max={20} value={count} onChange={(e) => setCount(+e.target.value)} className="mt-1 w-full border-2 border-slate-300 focus:border-usps-blue rounded-md px-3 py-2 text-sm outline-none" />
        </div>
        <button onClick={() => addr && setDone(true)} disabled={!addr} className="bg-usps-blue hover:bg-usps-dark disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-md text-[14px] transition-colors whitespace-nowrap">
          Schedule Free Pickup
        </button>
      </div>
    </div>
  );
}

/* ---------------- LOCATIONS PANEL ---------------- */
function LocationsPanel() {
  const [zip, setZip] = useState("10001");
  const [searched, setSearched] = useState(true);
  return (
    <div className="fade-slide max-w-3xl">
      <h3 className="text-lg font-bold text-slate-900">Find USPS Locations</h3>
      <div className="flex gap-2 mt-2 max-w-md">
        <input value={zip} onChange={(e) => setZip(e.target.value)} placeholder="ZIP Code or City, State" className="flex-1 border-2 border-slate-300 focus:border-usps-blue rounded-md px-3 py-2.5 text-sm outline-none" />
        <button onClick={() => setSearched(true)} className="bg-usps-blue hover:bg-usps-dark text-white font-bold px-6 rounded-md text-sm transition-colors">Find</button>
      </div>
      {searched && (
        <div className="mt-3 grid sm:grid-cols-2 gap-2">
          {POST_OFFICES.map((p) => (
            <div key={p.name} className="border border-slate-200 rounded-lg p-3 hover:border-usps-blue hover:shadow-md transition-all cursor-pointer group">
              <div className="flex items-start justify-between gap-2">
                <p className="font-bold text-[13.5px] text-slate-900 group-hover:text-usps-blue leading-tight">{p.name}</p>
                <span className="text-[11px] font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded shrink-0">{p.dist}</span>
              </div>
              <p className="text-[12.5px] text-slate-500">{p.addr}</p>
              <p className="text-[12px] text-slate-600 mt-1">{p.hours}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
