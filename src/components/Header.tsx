import { useEffect, useRef, useState } from "react";
import { Search, Menu, X, ChevronDown, ChevronRight, User, ShoppingCart, Globe, Bell, MapPin, Truck, Calculator, Mail, Package, ArrowRight } from "lucide-react";
import Logo from "./Logo";
import { NAV_ITEMS } from "../data/content";

const TOP_SEARCHES = ["PO BOXES", "PASSPORTS", "FREE BOXES", "TRACKING", "CHANGE OF ADDRESS", "HOLIDAY HOURS"];
const ALERTS = [
  "Postmarks: Ask a retail associate to hand-cancel your mail for free on the day you send it.",
  "Holiday deadlines: Send Ground Advantage® by Dec 17 for Christmas arrival.",
  "Service alert: Normal operations nationwide — check local Post Office hours before visiting.",
];

export default function Header({ cartCount, onCartOpen }: { cartCount: number; onCartOpen: () => void }) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [alertIdx, setAlertIdx] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setAlertIdx((i) => (i + 1) % ALERTS.length), 5000);
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => {
      clearInterval(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  /** Mega menus only on pointer-sized desktop layouts */
  const isDesktop = () => typeof window !== "undefined" && window.innerWidth >= 1024;

  const enterMenu = (label: string) => {
    if (!isDesktop()) return;
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };
  const leaveMenu = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), 140);
  };

  const activeItem = NAV_ITEMS.find((n) => n.label === openMenu);

  return (
    <header className="sticky top-0 z-50">
      {/* Service alert ticker */}
      <div className="bg-usps-darker text-white text-[12.5px]">
        <div className="mx-auto max-w-7xl px-4 flex items-center gap-2.5 h-9">
          <Bell className="h-3.5 w-3.5 text-usps-gold shrink-0" />
          <div className="relative flex-1 overflow-hidden h-full flex items-center">
            {ALERTS.map((a, i) => (
              <p
                key={i}
                className={`absolute inset-x-0 truncate transition-all duration-500 ${
                  i === alertIdx ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
                }`}
              >
                <span className="font-semibold text-usps-gold mr-2">Service Alert</span>
                <span className="text-slate-200">{a}</span>
              </p>
            ))}
          </div>
          <div className="hidden sm:flex items-center gap-1">
            {ALERTS.map((_, i) => (
              <button
                key={i}
                onClick={() => setAlertIdx(i)}
                aria-label={`Alert ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === alertIdx ? "w-5 bg-usps-gold" : "w-1.5 bg-white/30 hover:bg-white/60"}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Utility bar */}
      <div className="bg-white border-b border-slate-200 hidden md:block">
        <div className="mx-auto max-w-7xl px-4 h-8 flex items-center justify-end gap-5 text-[12px] font-medium text-slate-600">
          <a href="#business" className="hover:text-usps-blue flex items-center gap-1"><Globe className="h-3.5 w-3.5" /> Español</a>
          <a href="#business" className="hover:text-usps-blue">Business Customer Gateway</a>
          <a href="#help" className="hover:text-usps-blue">Register / Sign In</a>
          <a href="#locations" className="hover:text-usps-blue flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Find Locations</a>
        </div>
      </div>

      {/* Main bar */}
      <div className={`bg-white transition-shadow relative ${scrolled ? "shadow-md" : ""}`}>
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-4">
          <button
            className="lg:hidden p-2 -ml-2 text-usps-blue hover:bg-slate-100 rounded-md"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          <Logo />

          <div className="flex-1 hidden md:flex justify-center px-6">
            <div className={`flex w-full max-w-xl items-center rounded-full border-2 transition-colors overflow-hidden ${searchOpen ? "border-usps-blue" : "border-slate-200 hover:border-slate-300"}`}>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                placeholder="Search USPS.com — try “tracking”, “stamps”, “ZIP Code”…"
                className="flex-1 px-5 py-2.5 text-sm outline-none bg-transparent"
              />
              {query && (
                <button onClick={() => setQuery("")} className="p-1 mr-1 text-slate-400 hover:text-slate-600" aria-label="Clear">
                  <X className="h-4 w-4" />
                </button>
              )}
              <button className="bg-usps-blue hover:bg-usps-dark text-white px-5 py-2.5 flex items-center gap-2 text-sm font-semibold transition-colors" aria-label="Search">
                <Search className="h-4 w-4" />
                <span className="hidden lg:inline">Search</span>
              </button>
            </div>
          </div>

          <div className="ml-auto md:ml-0 flex items-center gap-1 sm:gap-2">
            <button
              className="md:hidden p-2 text-usps-blue hover:bg-slate-100 rounded-full"
              onClick={() => setSearchOpen((s) => !s)}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <a href="#help" className="hidden sm:flex items-center gap-1.5 text-[13px] font-semibold text-usps-blue hover:bg-usps-light px-3 py-2 rounded-full transition-colors">
              <User className="h-4 w-4" /> Sign In
            </a>
            <button onClick={onCartOpen} className="relative flex items-center gap-1.5 text-[13px] font-semibold text-usps-blue hover:bg-usps-light px-3 py-2 rounded-full transition-colors" aria-label="Cart">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-usps-red text-white text-[10px] font-bold h-5 min-w-5 px-1 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile search expand */}
        {searchOpen && (
          <div className="md:hidden px-4 pb-3">
            <div className="flex items-center rounded-full border-2 border-usps-blue overflow-hidden">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search USPS.com"
                className="flex-1 px-4 py-2.5 text-sm outline-none"
              />
              <button className="bg-usps-blue text-white px-4 py-2.5" aria-label="Search"><Search className="h-4 w-4" /></button>
            </div>
          </div>
        )}

        {/* Search suggestions dropdown (desktop) */}
        {searchOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setSearchOpen(false)} />
            <div className="hidden md:block fixed left-1/2 -translate-x-1/2 top-[136px] w-full max-w-xl z-50 bg-white rounded-xl shadow-2xl border border-slate-200 p-4 mega-animate">
              <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-2">Top Searches</p>
              <div className="flex flex-wrap gap-2">
                {TOP_SEARCHES.filter((t) => !query || t.includes(query.toUpperCase())).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setQuery(t); setSearchOpen(false); }}
                    className="text-[12px] font-semibold bg-slate-100 hover:bg-usps-blue hover:text-white px-3 py-1.5 rounded-full transition-colors"
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-[13px]">
                {[
                  { icon: Truck, label: "Track a package" },
                  { icon: Mail, label: "Buy stamps" },
                  { icon: Calculator, label: "Calculate postage" },
                ].map((s) => (
                  <a key={s.label} href="#tools" onClick={() => setSearchOpen(false)} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-slate-700 font-medium">
                    <s.icon className="h-4 w-4 text-usps-blue" /> {s.label}
                  </a>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Primary nav */}
        <nav className="bg-usps-blue relative" ref={navRef} onMouseLeave={leaveMenu} aria-label="Main navigation">
          <div className="mx-auto max-w-7xl px-2 sm:px-4 flex items-stretch overflow-x-auto no-scrollbar">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onMouseEnter={() => enterMenu(item.label)}
                onClick={() => {
                  if (isDesktop()) setOpenMenu(openMenu === item.label ? null : item.label);
                  else setMobileOpen(true);
                }}
                aria-haspopup={isDesktop()}
                aria-expanded={isDesktop() ? openMenu === item.label : undefined}
                className={`relative shrink-0 whitespace-nowrap px-4 sm:px-5 py-3 text-[14.5px] font-medium text-white/95 hover:text-white transition-colors flex items-center gap-1 ${
                  openMenu === item.label ? "bg-usps-dark" : "hover:bg-white/10"
                }`}
              >
                {item.label}
                <ChevronDown className={`h-3.5 w-3.5 opacity-70 transition-transform ${openMenu === item.label ? "rotate-180" : ""}`} />
                {openMenu === item.label && <span className="absolute bottom-0 inset-x-0 h-[3px] bg-usps-red" />}
              </button>
            ))}
            <a href="#tools" className="ml-auto shrink-0 whitespace-nowrap flex items-center gap-2 px-5 py-3 text-[14px] font-bold text-white bg-usps-red hover:bg-usps-reddark transition-colors">
              <Package className="h-4 w-4" /> Click-N-Ship®
            </a>
          </div>

          {/* Mega menu */}
          {activeItem && (
            <div className="absolute inset-x-0 top-full z-50 mega-animate" onMouseEnter={() => enterMenu(activeItem.label)}>
              <div className="bg-white border-b-4 border-usps-red shadow-2xl">
                <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                  {activeItem.columns.map((col) => (
                    <div key={col.heading}>
                      <p className="text-[12px] font-bold tracking-wider text-usps-blue uppercase border-b-2 border-usps-light pb-2 mb-3">
                        {col.heading}
                      </p>
                      <ul className="space-y-2.5">
                        {col.links.map((l) => (
                          <li key={l}>
                            <a href="#tools" className="text-[14px] text-slate-700 hover:text-usps-blue hover:underline underline-offset-4 flex items-center gap-1 group">
                              {l}
                              <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-usps-red" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  {activeItem.featured && (
                    <a href="#tools" className="group/feat relative rounded-xl overflow-hidden flex flex-col justify-end min-h-[260px] text-white shadow-lg">
                      {activeItem.featured.img ? (
                        <img
                          src={activeItem.featured.img}
                          alt={`${activeItem.label} image with call to action.`}
                          className="absolute inset-0 w-full h-full object-cover group-hover/feat:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-usps-blue to-usps-darker" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-usps-darker/95 via-usps-darker/40 to-transparent" />
                      <div className="relative p-5">
                        <p className="text-[11px] font-bold tracking-widest uppercase text-usps-gold mb-1.5">Featured</p>
                        <h4 className="text-lg font-bold leading-tight mb-1">{activeItem.featured.title}</h4>
                        <p className="text-[13px] text-white/80">{activeItem.featured.desc}</p>
                        <span className="mt-3 inline-flex items-center gap-2 bg-white text-usps-blue text-[13px] font-bold px-4 py-2 rounded-full group-hover/feat:bg-usps-gold group-hover/feat:text-usps-darker transition-colors w-fit">
                          {activeItem.featured.cta} <ChevronRight className="h-4 w-4" />
                        </span>
                      </div>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>
      </div>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-[60] lg:hidden transition-opacity ${mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-usps-darker/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        <div className={`absolute left-0 top-0 bottom-0 w-[86%] max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-usps-blue text-white">
            <span className="font-black text-xl">USPS<span className="text-usps-gold">.</span>com</span>
            <button onClick={() => setMobileOpen(false)} className="p-2 hover:bg-white/10 rounded-full" aria-label="Close menu"><X className="h-5 w-5" /></button>
          </div>
          <div className="flex-1 overflow-y-auto thin-scroll">
            <a href="#tools" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 m-4 bg-usps-red text-white font-bold px-4 py-3 rounded-lg">
              <Package className="h-5 w-5" /> Click-N-Ship® <ChevronRight className="h-4 w-4 ml-auto" />
            </a>
            {NAV_ITEMS.map((item) => (
              <MobileNavGroup key={item.label} label={item.label} columns={item.columns} onNavigate={() => setMobileOpen(false)} />
            ))}
          </div>
          <div className="p-4 border-t border-slate-200 grid grid-cols-2 gap-2 text-sm font-semibold">
            <a href="#help" className="flex items-center justify-center gap-2 border border-slate-300 rounded-lg py-2.5 text-usps-blue"><User className="h-4 w-4" /> Sign In</a>
            <a href="#locations" className="flex items-center justify-center gap-2 bg-usps-blue text-white rounded-lg py-2.5"><MapPin className="h-4 w-4" /> Locations</a>
          </div>
        </div>
      </div>
    </header>
  );
}

function MobileNavGroup({ label, columns, onNavigate }: { label: string; columns: { heading: string; links: string[] }[]; onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  const all = columns.flatMap((c) => c.links);
  return (
    <div className="border-b border-slate-100">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between px-5 py-3.5 font-semibold text-[15px] text-slate-800">
        {label}
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[480px]" : "max-h-0"}`}>
        <div className="px-5 pb-4 space-y-1">
          {columns.map((c) => (
            <div key={c.heading} className="mb-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-usps-blue/70 mt-2 mb-1">{c.heading}</p>
              {c.links.map((l) => (
                <a key={l} href="#tools" onClick={onNavigate} className="block py-1.5 text-[14px] text-slate-600 hover:text-usps-blue">{l}</a>
              ))}
            </div>
          ))}
          {all.length === 0 && null}
        </div>
      </div>
    </div>
  );
}
