import { useState } from "react";
import { ChevronDown, Globe, ArrowUp } from "lucide-react";
import { SOCIALS_REAL } from "../data/content";

const COLS: { heading: string; links: string[] }[] = [
  { heading: "Mail & Shipping", links: ["Click-N-Ship®", "Calculate Postage", "Look Up ZIP Code™", "Schedule a Pickup", "Find Locations", "Postage Prices", "Free Boxes"] },
  { heading: "Track & Manage", links: ["Track a Package", "Informed Delivery®", "Hold Mail", "Change of Address", "Forward Mail", "Rent a PO Box", "Missing Mail"] },
  { heading: "Postal Store", links: ["Stamps", "Shipping Supplies", "Gifts & Collectibles", "Order Status", "Returns", "Bulk Orders"] },
  { heading: "Business", links: ["USPS Connect®", "Every Door Direct Mail®", "Business Gateway", "Commercial Pricing", "Direct Mail", "Small Business"] },
  { heading: "About USPS", links: ["Newsroom", "Careers", "Postal Inspectors", "Sustainability", "Investor Info", "Contact Us", "FAQs"] },
];

export default function Footer() {
  const [lang, setLang] = useState("English");
  const [email, setEmail] = useState("");
  const [sub, setSub] = useState(false);

  return (
    <footer className="bg-usps-darker text-white">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-8 flex flex-col lg:flex-row items-start lg:items-center gap-5">
          <div className="flex-1">
            <h3 className="font-black text-xl">Get shipping tips & stamp news</h3>
            <p className="text-white/60 text-[13.5px]">Monthly email. No spam, unsubscribe anytime.</p>
          </div>
          {!sub ? (
            <form onSubmit={(e) => { e.preventDefault(); email.includes("@") && setSub(true); }} className="flex w-full lg:w-auto gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="flex-1 lg:w-72 bg-white/10 border border-white/20 rounded-full px-5 py-3 text-sm placeholder:text-white/40 outline-none focus:border-usps-gold"
              />
              <button className="bg-usps-red hover:bg-usps-reddark font-bold px-6 py-3 rounded-full text-sm transition-colors whitespace-nowrap">Sign Up</button>
            </form>
          ) : (
            <p className="bg-green-500/15 border border-green-400/30 text-green-300 font-semibold text-sm px-5 py-3 rounded-full fade-slide">
              ✓ Thanks! Check {email} to confirm.
            </p>
          )}
        </div>
      </div>

      {/* Link columns */}
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {COLS.map((c) => (
            <FooterCol key={c.heading} heading={c.heading} links={c.links} />
          ))}
        </div>

        {/* Social + language */}
        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-5 justify-between">
          <div className="flex items-center gap-2">
            {SOCIALS_REAL.map((s) => (
              <a key={s.name} href="#" aria-label={s.name} className="h-10 w-10 rounded-full bg-white hover:bg-slate-200 flex items-center justify-center transition-all hover:scale-110 overflow-hidden">
                <img src={s.img} alt={s.name} className="h-6 w-6 object-contain" loading="lazy" />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === "English" ? "Español" : "English")}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/15 rounded-full px-4 py-2.5 text-[13px] font-semibold transition-colors"
            >
              <Globe className="h-4 w-4" /> {lang} <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2 bg-white/10 hover:bg-white/15 rounded-full px-4 py-2.5 text-[13px] font-semibold transition-colors" aria-label="Back to top">
              <ArrowUp className="h-4 w-4" /> Top
            </button>
          </div>
        </div>
      </div>

      {/* Legal */}
      <div className="bg-black/30">
        <div className="mx-auto max-w-7xl px-4 py-5">
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-white/50 font-medium">
            {["Privacy Policy", "Terms of Use", "FOIA", "No FEAR Act", "Accessibility", "Cookie Preferences", "Site Index", "Copyright © 2026 USPS"].map((l) => (
              <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
            ))}
          </div>
          <p className="mt-3 text-[11.5px] text-white/35 leading-relaxed max-w-4xl">
            This is a concept clone built for demonstration purposes. USPS®, Priority Mail®, Priority Mail Express®, Ground Advantage®, First-Class Mail®, Forever®, Informed Delivery®, Click-N-Ship®, Every Door Direct Mail®, and the Eagle logo are trademarks of the United States Postal Service®.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ heading, links }: { heading: string; links: string[] }) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full text-[12px] font-bold tracking-[0.15em] uppercase text-usps-gold mb-3 lg:pointer-events-none"
      >
        {heading}
        <ChevronDown className={`h-4 w-4 lg:hidden transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <ul className={`space-y-2 overflow-hidden transition-all ${open ? "max-h-64" : "max-h-0 lg:max-h-64"}`}>
        {links.map((l) => (
          <li key={l}>
            <a href="#" className="text-[13.5px] text-white/70 hover:text-white hover:underline underline-offset-4 transition-colors">{l}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
