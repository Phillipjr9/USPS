import { Link } from "react-router-dom";
import { ArrowRight, Settings } from "lucide-react";
import { IMAGES } from "../data/content";
import PageHeader from "../components/PageHeader";

const cards = [
  { title: "USPS Connect®", desc: "Same-day & next-day delivery for local businesses.", img: IMAGES.goBusiness, alt: "Business image with call to action." },
  { title: "Mail & Ship", desc: "Commercial pricing, pickup and returns services.", img: IMAGES.goShip, alt: "Mail and Ship image with call to action." },
  { title: "Go International", desc: "Affordable delivery to 180+ countries.", img: IMAGES.goIntl, alt: "International image with call to action." },
  { title: "Shipping Admin", desc: "Create shipping labels and manage outgoing packages.", icon: Settings, alt: "Shipping Admin dashboard", to: "/admin/dashboard" },
];

export default function BusinessPage() {
  return (
    <section id="business" className="py-14 lg:py-16 bg-white scroll-mt-28">
      <div className="mx-auto max-w-7xl px-4">
        <PageHeader
          title="USPS for Business"
          route="business"
          desc="Reach every door. Ship every order. Tools and pricing for businesses of every size."
        />
        <div className="mt-6 grid sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {cards.map((c) => {
            if (c.to) {
              return (
                <Link key={c.title} to={c.to} className="group relative rounded-2xl overflow-hidden min-h-[240px] flex flex-col justify-end shadow-md hover:shadow-xl hover:-translate-y-1 transition-all border-2 border-slate-100 hover:border-usps-blue">
                  <div className="absolute inset-0 bg-usps-darker flex items-center justify-center p-8">
                    <c.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="relative p-5">
                    <h3 className="font-black text-[18px]">{c.title}</h3>
                    <p className="text-[13px] text-white/80 mt-1">{c.desc}</p>
                    <span className="mt-3 inline-flex items-center gap-2 text-[13px] font-bold text-usps-gold group-hover:gap-3 transition-all">
                      Open Admin <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              );
            }
            return (
              <Link key={c.title} to="/business" className="group relative rounded-2xl overflow-hidden min-h-[240px] flex flex-col justify-end shadow-md hover:shadow-xl hover:-translate-y-1 transition-all">
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
