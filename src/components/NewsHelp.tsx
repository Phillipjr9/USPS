import { useState } from "react";
import { ChevronDown, ArrowRight, Phone, MessageCircle, MapPin, Clock } from "lucide-react";
import { NEWS_ITEMS, FAQS, POST_OFFICES, UPDATES, IMAGES } from "../data/content";

export function News() {
  return (
    <section className="py-14 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img src={IMAGES.electionMail} alt="Official Election Mail. Authorized by the U.S. Postal Service." className="h-10 w-auto" loading="lazy" />
            <h2 className="text-2xl lg:text-[28px] font-black text-usps-darker tracking-tight">USPS Updates</h2>
          </div>
          <a href="#help" className="hidden sm:inline-flex items-center gap-2 text-usps-blue font-bold text-[14px] hover:gap-3 transition-all">
            Newsroom <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* Real update cards with official USPS photography */}
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          {UPDATES.map((n) => (
            <a key={n.title} href="#help" className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group">
              <div className="h-40 overflow-hidden bg-slate-100">
                <img src={n.img} alt={n.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <div className="p-5">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-usps-light text-usps-blue px-2.5 py-1 rounded-full">{n.tag}</span>
                <h3 className="font-black text-[16px] text-slate-900 leading-snug mt-2.5 group-hover:text-usps-blue transition-colors">{n.title}</h3>
                <p className="text-[13.5px] text-slate-600 mt-1.5 leading-relaxed">{n.desc}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {NEWS_ITEMS.map((n) => (
            <a key={n.title} href="#help" className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-usps-light text-usps-blue px-2.5 py-1 rounded-full">{n.tag}</span>
                <span className="text-[12px] text-slate-400 font-medium">{n.date}</span>
              </div>
              <h3 className="font-black text-[16.5px] text-slate-900 leading-snug group-hover:text-usps-blue transition-colors">{n.title}</h3>
              <p className="text-[13.5px] text-slate-600 mt-2 leading-relaxed">{n.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-usps-red group-hover:gap-2.5 transition-all">Read more <ArrowRight className="h-3.5 w-3.5" /></span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Help() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="help" className="py-14 lg:py-20 bg-white scroll-mt-28">
      <div className="mx-auto max-w-7xl px-4 grid lg:grid-cols-[1fr_380px] gap-10">
        <div>
          <p className="text-[12px] font-bold tracking-[0.2em] uppercase text-usps-blue mb-2">Help & FAQs</p>
          <h2 className="text-3xl lg:text-[36px] font-black text-usps-darker tracking-tight mb-6">Answers, fast.</h2>
          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {FAQS.map((f, i) => (
              <div key={i}>
                <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between gap-4 py-5 text-left group">
                  <span className={`font-bold text-[15.5px] ${open === i ? "text-usps-blue" : "text-slate-900 group-hover:text-usps-blue"} transition-colors`}>{f.q}</span>
                  <span className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center transition-colors ${open === i ? "bg-usps-blue text-white" : "bg-slate-100 text-slate-500 group-hover:bg-usps-light group-hover:text-usps-blue"}`}>
                    <ChevronDown className={`h-4 w-4 transition-transform ${open === i ? "rotate-180" : ""}`} />
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${open === i ? "max-h-40 pb-5" : "max-h-0"}`}>
                  <p className="text-[14.5px] text-slate-600 leading-relaxed pr-10">{f.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-usps-blue rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10" />
            <h3 className="font-black text-xl">Still need help?</h3>
            <p className="text-white/75 text-[13.5px] mt-1">Real humans, 7 days a week.</p>
            <div className="mt-4 space-y-2.5">
              <a href="#help" className="flex items-center gap-3 bg-white/10 hover:bg-white/15 rounded-xl p-3.5 transition-colors">
                <Phone className="h-5 w-5 text-usps-gold" />
                <span><span className="block font-bold text-[14px]">1-800-ASK-USPS®</span><span className="block text-[12px] text-white/60">1-800-275-8777 · TTY 711</span></span>
              </a>
              <a href="#help" className="flex items-center gap-3 bg-white/10 hover:bg-white/15 rounded-xl p-3.5 transition-colors">
                <MessageCircle className="h-5 w-5 text-usps-gold" />
                <span><span className="block font-bold text-[14px]">Chat with us</span><span className="block text-[12px] text-white/60">Typically replies in 2 min</span></span>
              </a>
            </div>
          </div>

          <div id="locations" className="bg-slate-50 border border-slate-200 rounded-2xl p-6 scroll-mt-32">
            <h3 className="font-black text-[17px] text-slate-900 flex items-center gap-2"><MapPin className="h-5 w-5 text-usps-red" /> Nearby Post Offices</h3>
            <p className="text-[12.5px] text-slate-500 flex items-center gap-1.5 mt-1"><Clock className="h-3.5 w-3.5" /> Open now near 10001</p>
            <div className="mt-3 space-y-2.5">
              {POST_OFFICES.slice(0, 3).map((p) => (
                <div key={p.name} className="bg-white rounded-xl p-3.5 border border-slate-100">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-[13.5px] text-slate-900 leading-tight">{p.name}</p>
                    <span className="text-[11px] font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded shrink-0">{p.dist}</span>
                  </div>
                  <p className="text-[12.5px] text-slate-500 mt-0.5">{p.addr}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {p.services.map((sv) => (
                      <span key={sv} className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{sv}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <a href="#tools" className="mt-3 block text-center font-bold text-[13.5px] text-usps-blue hover:underline">See all locations & hours</a>
          </div>
        </div>
      </div>
    </section>
  );
}
