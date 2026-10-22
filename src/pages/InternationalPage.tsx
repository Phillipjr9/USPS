import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageHeader from "../components/PageHeader";

export default function InternationalPage() {
  return (
    <section id="international" className="py-14 lg:py-20 bg-white scroll-mt-28">
      <div className="mx-auto max-w-7xl px-4">
        <PageHeader
          title="Send Worldwide"
          route="international"
          desc="Affordable international shipping to 180+ countries with tracking, customs forms, and clear country restrictions."
        />
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {[
            {
              title: "Calculate International Prices",
              desc: "Get postage and delivery estimates for any destination country.",
              to: "/calculate" as const,
            },
            {
              title: "Customs Forms",
              desc: "Prepare and print customs documentation for international shipments.",
              to: "/help" as const,
            },
            {
              title: "Country Restrictions",
              desc: "Check what can and cannot be mailed to each country.",
              to: "/help" as const,
            },
            {
              title: "International Tracking",
              desc: "Track your outbound and inbound international packages.",
              to: "/track" as const,
            },
            {
              title: "APO/FPO/DPO Mail",
              desc: "Send mail to military and diplomatic posts overseas.",
              to: "/help" as const,
            },
            {
              title: "Prohibited Items",
              desc: "Review items prohibited or restricted from international mail.",
              to: "/help" as const,
            },
          ].map((c) => (
            <Link key={c.title} to={c.to} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md hover:border-usps-blue transition-colors">
              <h3 className="font-black text-[16px] text-slate-900">{c.title}</h3>
              <p className="text-[13.5px] text-slate-600 mt-2">{c.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-bold text-usps-blue group-hover:gap-2 transition-all">
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
