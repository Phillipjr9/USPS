import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import PageHeader from "./PageHeader";
import { NAV_ITEMS } from "../data/content";
import { toRoute } from "../data/links";

export interface SectionHighlight {
  icon: LucideIcon;
  title: string;
  body: string;
  to: string;
  cta: string;
}

interface Props {
  /** Label of the matching item in NAV_ITEMS — drives the explore grid. */
  navLabel: string;
  title: string;
  desc: string;
  route: string;
  intro: { heading: string; body: string };
  cta: { label: string; to: string };
  secondary?: { label: string; to: string };
  highlights: SectionHighlight[];
}

/**
 * Landing page for a primary navigation section. The link grid is generated
 * from the same NAV_ITEMS data that feeds the mega menu, so a section page and
 * its dropdown can never drift apart.
 */
export default function SectionLanding({
  navLabel,
  title,
  desc,
  route,
  intro,
  cta,
  secondary,
  highlights,
}: Props) {
  const item = NAV_ITEMS.find((n) => n.label === navLabel);
  const columns = item?.columns ?? [];

  return (
    <>
      <section className="bg-white pt-10">
        <div className="mx-auto max-w-7xl px-4">
          <PageHeader title={title} route={route} desc={desc} />
        </div>
      </section>

      {/* Intro */}
      <section className="pb-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="rounded-2xl bg-usps-light border border-slate-200 p-6 sm:p-8 lg:flex lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="text-2xl lg:text-[30px] font-black text-usps-darker tracking-tight leading-tight">
                {intro.heading}
              </h2>
              <p className="mt-3 text-[14px] text-slate-600 leading-relaxed">{intro.body}</p>
            </div>
            <div className="mt-5 lg:mt-0 flex flex-wrap gap-2.5 shrink-0">
              <Link
                to={cta.to}
                className="inline-flex items-center gap-2 bg-usps-blue hover:bg-usps-dark text-white font-bold px-5 py-3 rounded-md text-[13.5px] transition-colors"
              >
                {cta.label} <ArrowRight className="h-4 w-4" />
              </Link>
              {secondary && (
                <Link
                  to={secondary.to}
                  className="inline-flex items-center gap-2 border-2 border-usps-blue/30 hover:border-usps-blue text-usps-blue font-bold px-5 py-3 rounded-md text-[13.5px] transition-colors"
                >
                  {secondary.label}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="pb-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {highlights.map((h) => (
              <Link
                key={h.title}
                to={h.to}
                className="group border border-slate-200 rounded-xl p-5 hover:border-usps-blue hover:shadow-lg transition-all"
              >
                <h.icon className="h-8 w-8 text-usps-blue mb-3" />
                <h3 className="font-black text-[15.5px] text-usps-darker leading-snug">{h.title}</h3>
                <p className="text-[12.5px] text-slate-600 mt-1.5 leading-relaxed">{h.body}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-bold text-usps-blue group-hover:gap-2 transition-all">
                  {h.cta} <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Explore — mirrors the mega menu */}
      {columns.length > 0 && (
        <section className="py-12 bg-slate-50 border-y border-slate-200">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="text-2xl font-black text-usps-darker tracking-tight">
              Explore {navLabel}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {columns.map((col) => (
                <div key={col.heading}>
                  <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-2">
                    {col.heading}
                  </p>
                  <ul className="space-y-1.5">
                    {col.links.map((link) => (
                      <li key={link}>
                        <Link
                          to={toRoute(link)}
                          className="text-[13.5px] text-slate-700 hover:text-usps-blue hover:underline underline-offset-2 transition-colors"
                        >
                          {link}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Help strip */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="rounded-xl bg-usps-darker text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="font-black text-[19px]">Need a hand?</h2>
              <p className="text-white/70 text-[13px] mt-1">
                Answers to the questions people ask most about {navLabel.toLowerCase()}.
              </p>
            </div>
            <Link
              to="/help"
              className="inline-flex items-center gap-2 bg-usps-gold hover:bg-usps-gold/90 text-usps-darker font-bold px-5 py-2.5 rounded-md text-[13px] transition-colors whitespace-nowrap"
            >
              Visit Help &amp; FAQs <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
