import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Info } from "lucide-react";
import PageHeader from "./PageHeader";

export interface ServicePageProps {
  title: string;
  desc: string;
  route: string;
  intro: { heading: string; body: string };
  facts: { label: string; value: string }[];
  cta: { label: string; to: string };
  secondary?: { label: string; to: string };
  steps: { title: string; body: string }[];
  notes: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
  related: { label: string; to: string }[];
}

/**
 * Shared layout for a single USPS service page: at-a-glance facts, how it
 * works, good-to-know notes, FAQs and related services. Keeps the eight
 * service pages structurally identical so nothing looks bolted on.
 */
export default function ServicePage({
  title,
  desc,
  route,
  intro,
  facts,
  cta,
  secondary,
  steps,
  notes,
  faqs,
  related,
}: ServicePageProps) {
  return (
    <>
      <section className="bg-white pt-10">
        <div className="mx-auto max-w-7xl px-4">
          <PageHeader title={title} route={route} desc={desc} />
        </div>
      </section>

      {/* Intro + at a glance */}
      <section className="pb-12">
        <div className="mx-auto max-w-7xl px-4 grid lg:grid-cols-[minmax(0,1fr)_340px] gap-8 items-start">
          <div>
            <h2 className="text-2xl lg:text-[30px] font-black text-usps-darker tracking-tight leading-tight">
              {intro.heading}
            </h2>
            <p className="mt-3 text-[14px] text-slate-600 leading-relaxed max-w-2xl">{intro.body}</p>

            <div className="mt-6 flex flex-wrap gap-2.5">
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

            {/* How it works */}
            <h3 className="mt-10 text-[17px] font-black text-usps-darker">How it works</h3>
            <ol className="mt-4 space-y-4">
              {steps.map((s, i) => (
                <li key={s.title} className="flex gap-3.5">
                  <span className="shrink-0 h-7 w-7 rounded-full bg-usps-blue text-white text-[12px] font-black flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-bold text-[13.5px] text-slate-900 leading-snug">{s.title}</p>
                    <p className="text-[12.5px] text-slate-600 mt-0.5 leading-relaxed">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <aside className="bg-usps-light border border-slate-200 rounded-xl p-5 lg:sticky lg:top-32">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 mb-3">
              At a glance
            </h3>
            <dl className="space-y-3">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-[11.5px] font-semibold text-slate-500">{f.label}</dt>
                  <dd className="text-[13.5px] font-bold text-usps-darker leading-snug">{f.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      {/* Good to know */}
      <section className="py-12 bg-slate-50 border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-2xl font-black text-usps-darker tracking-tight">Good to know</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {notes.map((n) => (
              <div key={n.title} className="bg-white border border-slate-200 rounded-xl p-5">
                <CheckCircle2 className="h-6 w-6 text-usps-blue mb-2.5" />
                <h3 className="font-bold text-[13.5px] text-usps-darker leading-snug">{n.title}</h3>
                <p className="text-[12.5px] text-slate-600 mt-1 leading-relaxed">{n.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-black text-usps-darker tracking-tight mb-4">
            Frequently asked questions
          </h2>
          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {faqs.map((f) => (
              <details key={f.q} className="group py-3">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-bold text-[13.5px] text-slate-800 hover:text-usps-blue">
                  {f.q}
                  <span className="text-usps-blue text-lg leading-none group-open:hidden">+</span>
                  <span className="text-usps-blue text-lg leading-none hidden group-open:block">−</span>
                </summary>
                <p className="text-[12.5px] text-slate-600 mt-2 leading-relaxed pr-8">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="pb-14">
        <div className="mx-auto max-w-7xl px-4">
          <div className="rounded-xl bg-usps-darker text-white p-6 sm:p-7">
            <div className="flex items-center gap-2 mb-4">
              <Info className="h-4 w-4 text-usps-gold" />
              <h2 className="font-black text-[16px]">Related services</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {related.map((r) => (
                <Link
                  key={r.label}
                  to={r.to}
                  className="flex items-center justify-between gap-2 bg-white/10 hover:bg-white/20 rounded-lg px-4 py-3 text-[13px] font-semibold transition-colors"
                >
                  {r.label} <ArrowRight className="h-3.5 w-3.5 opacity-70" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
