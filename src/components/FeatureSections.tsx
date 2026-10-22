import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Store, CheckCircle2, CalendarClock } from "lucide-react";
import { IMAGES, FEATURED_PRODUCTS } from "../data/content";

/** Real USPS.com holiday ship-by-date banner */
export function HolidayBanner() {
  return (
    <section className="relative overflow-hidden">
      <img
        src={IMAGES.giftBg}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-usps-darker/45" />
      <div className="relative mx-auto max-w-7xl px-4 py-12 lg:py-16 grid lg:grid-cols-2 gap-8 items-center">
        <div className="text-white">
          <p className="text-[12px] font-bold tracking-[0.2em] uppercase text-usps-gold mb-2">Holiday Shipping</p>
          <h2 className="text-3xl lg:text-[40px] font-black tracking-tight leading-[1.1]">
            Let USPS Deliver Your Season&rsquo;s Greetings
          </h2>
          <p className="mt-3 text-white/85 text-[15px] max-w-lg">
            Ship by the deadlines to arrive by Dec 25: Ground Advantage® by Dec 17,
            Priority Mail® by Dec 19, Priority Mail Express® by Dec 21.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/ship" className="inline-flex items-center gap-2 bg-usps-red hover:bg-usps-reddark text-white font-bold px-6 py-3 rounded-full text-[14px] transition-colors">
              <CalendarClock className="h-4 w-4" /> Holiday Deadlines
            </Link>
            <Link to="/store" className="inline-flex items-center gap-2 border-2 border-white/60 hover:border-white hover:bg-white/10 text-white font-bold px-6 py-2.5 rounded-full text-[14px] transition-all">
              Shop Holiday Stamps
            </Link>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <img
            src={IMAGES.giftboxes}
            alt="Shipping boxes being offered to ship this Season's Greetings."
            className="max-h-64 lg:max-h-80 w-auto drop-shadow-2xl"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

/** Real "Featured USPS® Products & Services" */
export function FeaturedProducts() {
  return (
    <section className="py-14 lg:py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-2xl lg:text-[32px] font-black text-usps-darker tracking-tight mb-6">
          Featured USPS<sup className="text-[0.55em]">®</sup> Products &amp; Services
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {FEATURED_PRODUCTS.map((f) => (
            <Link key={f.title} to="/" className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="h-52 overflow-hidden bg-slate-100">
                <img src={f.img} alt={f.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <div className="p-5">
                <h3 className="font-black text-[17px] text-slate-900 group-hover:text-usps-blue transition-colors">{f.title}</h3>
                <p className="text-[13.5px] text-slate-600 mt-1.5 leading-relaxed">{f.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-[13.5px] font-bold text-usps-red group-hover:gap-2.5 transition-all">
                  {f.cta} <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/** USPS 250th anniversary promo — real artwork */
export function Promo250() {
  return (
    <section className="bg-usps-darker py-10">
      <div className="mx-auto max-w-7xl px-4">
        <Link to="/250" className="block rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow">
          <img
            src={IMAGES.promo250}
            alt="USPS 250th anniversary. Delivering since 1775. Celebrate 250 years of USPS! Explore now."
            className="hidden sm:block w-full h-auto"
            loading="lazy"
          />
          <img
            src={IMAGES.promo250m}
            alt="USPS 250th anniversary. Delivering since 1775. Celebrate 250 years of USPS! Explore now."
            className="sm:hidden w-full h-auto"
            loading="lazy"
          />
        </Link>
      </div>
    </section>
  );
}

/** Informed Delivery® with the real product photo */
export function InformedDelivery() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <section id="informed" className="py-14 lg:py-20 bg-slate-50 overflow-hidden scroll-mt-28">
      <div className="mx-auto max-w-7xl px-4 grid lg:grid-cols-2 gap-10 items-center">
        <div className="relative flex justify-center order-2 lg:order-1">
          <div className="absolute h-72 w-72 bg-usps-sky/50 rounded-full blur-3xl" />
          <img
            src={IMAGES.informed}
            alt="An Informed Delivery preview email on a smartphone."
            className="relative rounded-2xl shadow-2xl w-full max-w-md rotate-[-1.5deg] hover:rotate-0 transition-transform duration-500"
            loading="lazy"
          />
        </div>

        <div className="order-1 lg:order-2">
          <p className="text-[12px] font-bold tracking-[0.2em] uppercase text-usps-blue mb-2">Informed Delivery®</p>
          <h2 className="text-3xl lg:text-[42px] font-black text-usps-darker tracking-tight leading-[1.1]">
            See what&rsquo;s coming<br />before it arrives
          </h2>
          <p className="mt-4 text-slate-600 text-[16px] leading-relaxed max-w-lg">
            Get a daily email with grayscale images of your letter mail plus tracking for packages — and manage deliveries from your phone. Free for every mailbox in America.
          </p>
          <ul className="mt-5 space-y-2.5">
            {["Daily digest email with mail previews", "Real-time package tracking & alerts", "Leave delivery instructions for carriers", "Works with the USPS Mobile® app"].map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-[14.5px] font-medium text-slate-700">
                <CheckCircle2 className="h-5 w-5 text-green-600 fill-green-50" /> {f}
              </li>
            ))}
          </ul>
          {!done ? (
            <form onSubmit={(e) => { e.preventDefault(); email.includes("@") && setDone(true); }} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="flex-1 border-2 border-slate-200 focus:border-usps-blue rounded-full px-5 py-3 text-sm outline-none"
              />
              <button className="bg-usps-blue hover:bg-usps-dark text-white font-bold px-6 py-3 rounded-full text-sm inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap">
                Sign Up Free <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 max-w-md flex items-center gap-3 fade-slide">
              <CheckCircle2 className="h-8 w-8 text-green-600 shrink-0" />
              <div>
                <p className="font-bold text-green-900 text-[14px]">You&rsquo;re on the list!</p>
                <p className="text-[13px] text-green-700">Verify your identity at {email} to activate previews.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/** Business section using real USPS promo art */
export function BusinessBanner() {
  const cards = [
    { title: "USPS Connect®", desc: "Same-day & next-day delivery for local businesses.", img: IMAGES.goBusiness, alt: "Business image with call to action." },
    { title: "Mail & Ship", desc: "Commercial pricing, pickup and returns services.", img: IMAGES.goShip, alt: "Mail and Ship image with call to action." },
    { title: "Go International", desc: "Affordable delivery to 180+ countries.", img: IMAGES.goIntl, alt: "International image with call to action" },
  ];
  return (
    <section id="business" className="py-14 lg:py-16 bg-white scroll-mt-28">
      <div className="mx-auto max-w-7xl px-4">
        <p className="text-[12px] font-bold tracking-[0.2em] uppercase text-usps-blue mb-2">USPS for Business</p>
        <h2 className="text-3xl lg:text-[36px] font-black text-usps-darker tracking-tight">Reach every door. Ship every order.</h2>
        <div className="mt-6 grid sm:grid-cols-3 gap-4">
          {cards.map((c) => (
            <Link key={c.title} to="/" className="group relative rounded-2xl overflow-hidden min-h-[240px] flex flex-col justify-end shadow-md hover:shadow-xl hover:-translate-y-1 transition-all">
              <img src={c.img} alt={c.alt} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-usps-darker/95 via-usps-darker/35 to-transparent" />
              <div className="relative p-5 text-white">
                <h3 className="font-black text-[18px]">{c.title}</h3>
                <p className="text-[13px] text-white/80 mt-1">{c.desc}</p>
                <span className="mt-3 inline-flex items-center gap-2 text-[13px] font-bold text-usps-gold group-hover:gap-3 transition-all">
                  Explore <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function EDDMBand() {
  const [zips, setZips] = useState("10001");
  const [routes, setRoutes] = useState<number | null>(null);
  return (
    <section className="bg-usps-gold py-10">
      <div className="mx-auto max-w-7xl px-4 flex flex-col lg:flex-row items-center gap-6">
        <div className="flex items-center gap-4 flex-1">
          <span className="hidden sm:flex h-14 w-14 rounded-2xl bg-usps-darker text-usps-gold items-center justify-center shrink-0">
            <Store className="h-7 w-7" />
          </span>
          <div>
            <h3 className="text-usps-darker font-black text-xl lg:text-2xl leading-tight">How many customers live around you?</h3>
            <p className="text-usps-darker/70 font-medium text-[14px]">Enter a ZIP to estimate Every Door Direct Mail® routes & reach.</p>
          </div>
        </div>
        <div className="flex w-full lg:w-auto gap-2">
          <input
            value={zips}
            onChange={(e) => setZips(e.target.value)}
            placeholder="ZIP Code"
            maxLength={5}
            className="flex-1 lg:w-40 bg-white rounded-full px-5 py-3 font-mono font-bold text-usps-darker outline-none border-2 border-transparent focus:border-usps-darker"
          />
          <button
            onClick={() => setRoutes(12 + (parseInt(zips) % 30))}
            className="bg-usps-darker hover:bg-black text-white font-bold px-6 py-3 rounded-full text-sm transition-colors whitespace-nowrap"
          >
            Estimate Reach
          </button>
        </div>
        {routes !== null && (
          <div className="bg-usps-darker text-white rounded-2xl px-5 py-3 flex items-center gap-4 fade-slide w-full lg:w-auto justify-center">
            <div className="text-center"><p className="text-2xl font-black text-usps-gold">{routes}</p><p className="text-[11px] uppercase font-bold tracking-wider text-white/60">Routes</p></div>
            <div className="h-10 w-px bg-white/20" />
            <div className="text-center"><p className="text-2xl font-black text-usps-gold">{(routes * 480).toLocaleString()}</p><p className="text-[11px] uppercase font-bold tracking-wider text-white/60">Homes</p></div>
            <div className="h-10 w-px bg-white/20" />
            <div className="text-center"><p className="text-2xl font-black">~${((routes * 480 * 0.22) / 1000).toFixed(1)}k</p><p className="text-[11px] uppercase font-bold tracking-wider text-white/60">From</p></div>
          </div>
        )}
      </div>
    </section>
  );
}
