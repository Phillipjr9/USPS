import { Link } from "react-router-dom";
import { ArrowRight, CalendarCheck, Landmark, Mail, Sparkles, Stamp, Users } from "lucide-react";

const TIMELINE = [
  {
    year: "1775",
    title: "A postal system for a new nation",
    body: "The Second Continental Congress appoints Benjamin Franklin the first Postmaster General. Twenty-eight post offices serve the colonies.",
  },
  {
    year: "1789",
    title: "The Postal Service Act",
    body: "Congress establishes the Post Office Department, guaranteeing the privacy of letters and low-cost delivery of newspapers.",
  },
  {
    year: "1863",
    title: "Free city delivery begins",
    body: "Carriers start delivering mail to city doorsteps, and the first mail-order catalogs put rural America on equal footing with cities.",
  },
  {
    year: "1918",
    title: "The first airmail",
    body: "Mail takes to the sky between Washington, Philadelphia and New York, cutting days off cross-country delivery.",
  },
  {
    year: "1971",
    title: "USPS becomes an independent agency",
    body: "The Postal Reorganization Act transforms the Department into the United States Postal Service® we know today.",
  },
  {
    year: "2026",
    title: "250 years of delivering",
    body: "A quarter of a millennium of connecting Americans — to each other, to their businesses, and to the world.",
  },
];

const STATS = [
  { icon: Landmark, value: "1775", label: "Delivering since" },
  { icon: CalendarCheck, value: "250", label: "Years of service" },
  { icon: Users, value: "640,000+", label: "Employees nationwide" },
  { icon: Mail, value: "34,000+", label: "Retail locations" },
];

export default function AnniversaryPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-usps-darker text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]" aria-hidden="true">
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full border-[40px] border-usps-gold" />
          <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-full border-[30px] border-usps-gold" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 lg:py-24">
          <p className="inline-flex items-center gap-2 text-[11.5px] font-bold tracking-[0.25em] uppercase text-usps-gold mb-4">
            <Sparkles className="h-4 w-4" /> USPS 250th Anniversary
          </p>
          <h1 className="text-4xl lg:text-6xl font-black tracking-tight leading-[1.05] max-w-3xl">
            Delivering for America since 1775
          </h1>
          <p className="mt-5 text-white/75 text-[15px] lg:text-[17px] leading-relaxed max-w-2xl">
            For 250 years the Postal Service has reached every address, every territory and every
            generation. From horseback routes to same-day city delivery, we've kept the country
            connected — one letter, one package, one block at a time.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/store"
              className="inline-flex items-center gap-2 bg-usps-gold hover:bg-usps-gold/90 text-usps-darker font-black px-6 py-3 rounded-full text-[14px] transition-colors"
            >
              <Stamp className="h-4 w-4" /> Shop anniversary stamps
            </Link>
            <Link
              to="/ship"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold px-6 py-3 rounded-full text-[14px] transition-colors"
            >
              Ship with USPS <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-usps-light border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <s.icon className="h-8 w-8 text-usps-blue shrink-0" />
              <div>
                <p className="text-2xl font-black text-usps-darker leading-none">{s.value}</p>
                <p className="text-[11.5px] font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="py-14 bg-white">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-black text-usps-darker tracking-tight">250 years, six turning points</h2>
          <p className="text-[13.5px] text-slate-600 mt-2 max-w-2xl">
            The Postal Service has reinvented itself with every generation it served.
          </p>

          <ol className="mt-8 relative border-l-2 border-slate-200 ml-1.5">
            {TIMELINE.map((t) => (
              <li key={t.year} className="relative pl-7 pb-8 last:pb-0">
                <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-usps-blue ring-4 ring-white" />
                <p className="text-[12px] font-black tracking-widest text-usps-red">{t.year}</p>
                <h3 className="font-bold text-[15.5px] text-usps-darker mt-0.5">{t.title}</h3>
                <p className="text-[13px] text-slate-600 mt-1 leading-relaxed max-w-2xl">{t.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Celebrate */}
      <section className="py-14 bg-slate-50 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-3xl font-black text-usps-darker tracking-tight">Celebrate with us</h2>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            {[
              {
                icon: Stamp,
                title: "Anniversary stamps",
                body: "Commemorative issues marking a quarter millennium of American mail.",
                to: "/store",
                cta: "Shop stamps",
              },
              {
                icon: Mail,
                title: "Send a letter that lasts",
                body: "Hand-canceled postmarks from a Post Office counter make a keepsake of any envelope.",
                to: "/locations",
                cta: "Find a Post Office",
              },
              {
                icon: Landmark,
                title: "Visit a historic Post Office",
                body: "Landmark buildings across the country are hosting anniversary events all year.",
                to: "/news",
                cta: "See events",
              },
            ].map((c) => (
              <div key={c.title} className="bg-white border border-slate-200 rounded-xl p-5">
                <c.icon className="h-8 w-8 text-usps-blue mb-3" />
                <h3 className="font-black text-[15.5px] text-usps-darker">{c.title}</h3>
                <p className="text-[12.5px] text-slate-600 mt-1.5 leading-relaxed">{c.body}</p>
                <Link
                  to={c.to}
                  className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-bold text-usps-blue hover:underline"
                >
                  {c.cta} <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
