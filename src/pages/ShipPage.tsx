import { useState } from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, ArrowRight, Check, Zap, Star, PiggyBank, Mail, Truck } from "lucide-react";
import { SHIP_SERVICES } from "../data/content";
import PageHeader from "../components/PageHeader";

const ICONS: any = { Zap, Star, PiggyBank, Mail, Truck };

export default function ShipPage() {
  const [billing, setBilling] = useState<"retail" | "commercial">("retail");

  return (
    <section id="ship" className="py-14 lg:py-20 bg-white scroll-mt-28">
      <div className="mx-auto max-w-7xl px-4">
        <PageHeader
          title="Mail & Ship"
          route="ship"
          desc="Choose the service that fits your timeline and budget. Every label includes USPS Tracking®."
        />
        <div className="flex items-center gap-3 mb-8">
          {(["retail", "commercial"] as const).map((b) => (
            <button
              key={b}
              onClick={() => setBilling(b)}
              className={`px-4 py-2 rounded-full border transition-colors ${
                billing === b ? "bg-usps-blue border-usps-blue text-white" : "border-slate-200 text-slate-500 hover:text-slate-800"
              }`}
            >
              {b}
            </button>
          ))}
          <Link to="/calculate" className="ml-auto inline-flex items-center gap-2 text-usps-blue font-bold text-[14px] hover:gap-3 transition-all">
            Start a shipment <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {SHIP_SERVICES.map((svc) => {
            const Icon = ICONS[svc.name.includes("Express") ? "Zap" : svc.name.includes("Priority") ? "Star" : svc.name.includes("Ground") ? "PiggyBank" : "Mail"];
            const price = billing === "commercial"
              ? `$${(parseFloat(svc.price.replace("$", "")) * 0.82).toFixed(2)}`
              : svc.price;
            return (
              <div
                key={svc.name}
                className={`relative bg-white rounded-2xl p-6 flex flex-col border-2 transition-all hover:-translate-y-1 hover:shadow-xl ${
                  svc.popular ? "border-usps-blue shadow-lg shadow-blue-100" : "border-transparent shadow-sm hover:border-slate-200"
                }`}
              >
                {svc.popular && (
                  <span className="absolute -top-3 left-6 bg-usps-blue text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1">
                    <BadgeCheck className="h-3.5 w-3.5" /> {svc.tag}
                  </span>
                )}
                <span className={`h-11 w-11 rounded-xl flex items-center justify-center mb-4 ${
                  svc.popular ? "bg-usps-blue text-white" : "bg-usps-light text-usps-blue"
                }`}>
                  <Icon className="h-5 w-5" />
                </span>
                {!svc.popular && <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{svc.tag}</span>}
                <h3 className="font-black text-[17px] text-slate-900 leading-tight mt-1">{svc.name}</h3>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-[11px] text-slate-400 font-semibold">from</span>
                  <span className="text-3xl font-black text-usps-blue">{price}</span>
                </div>
                <p className="text-[13px] font-semibold text-slate-500">{svc.time}</p>
                <ul className="mt-4 space-y-2 flex-1">
                  {svc.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[13.5px] text-slate-700">
                      <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <Link to="/calculate" className={`text-center font-bold text-[13.5px] py-2.5 rounded-full transition-colors ${
                    svc.popular ? "bg-usps-red hover:bg-usps-reddark text-white" : "bg-usps-blue hover:bg-usps-dark text-white"
                  }`}>
                    Ship Now
                  </Link>
                  <Link to="/ship" className="text-center font-bold text-[13.5px] py-2.5 rounded-full border-2 border-slate-200 hover:border-usps-blue text-slate-700 hover:text-usps-blue transition-colors">
                    Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 bg-usps-darker rounded-2xl p-6 lg:p-8 flex flex-col lg:flex-row items-start lg:items-center gap-6 overflow-hidden relative">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1.5px, transparent 0)", backgroundSize: "22px 22px" }} />
          <div className="relative h-16 w-16 shrink-0 bg-usps-light rounded-2xl p-2 flex items-center justify-center">
            <Truck className="h-8 w-8 text-usps-blue" />
          </div>
          <div className="relative flex-1">
            <p className="text-usps-gold text-[12px] font-bold uppercase tracking-[0.2em]">Free Supplies</p>
            <h3 className="text-white text-xl lg:text-2xl font-black mt-1">Priority Mail® boxes & envelopes ship free to your door</h3>
            <p className="text-white/70 text-[14px] mt-1">Order packs of 10–25 online. Delivered in 7–10 days. No charge, ever.</p>
          </div>
          <div className="relative flex flex-wrap gap-3">
            <Link to="/store" className="bg-white text-usps-darker font-bold px-6 py-3 rounded-full text-[14px] hover:bg-usps-gold transition-colors">Order Free Boxes</Link>
            <Link to="/store" className="border-2 border-white/40 text-white font-bold px-6 py-3 rounded-full text-[14px] hover:border-white transition-colors">Browse Supplies</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
