import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { STORE_CAROUSEL } from "../data/content";
import { useCart } from "../context/CartContext";
import PageHeader from "../components/PageHeader";

export default function StorePage() {
  const ref = useRef<HTMLDivElement>(null);
  const [slide, setSlide] = useState(0);
  const { addToCart } = useCart();

  const scroll = (dir: number) => {
    ref.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
    setSlide((s) => (s + dir + STORE_CAROUSEL.length) % STORE_CAROUSEL.length);
  };

  const add = (name: string, price: string) => {
    addToCart(name, price);
  };

  return (
    <section id="store" className="py-14 lg:py-16 bg-white scroll-mt-28">
      <div className="mx-auto max-w-7xl px-4">
        <PageHeader
          title="Postal Store®"
          route="store"
          desc="Shop Forever® stamps, shipping supplies, gifts, collectibles and more."
        />

        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-[12px] font-bold tracking-[0.2em] uppercase text-usps-red mb-2">Postal Store®</p>
            <h2 className="text-3xl lg:text-[36px] font-black text-usps-darker tracking-tight">Shop Stamps, Supplies & Gifts</h2>
          </div>
          <div className="flex items-center gap-2">
            {STORE_CAROUSEL.map((_, i) => (
              <span key={i} className={`h-2 rounded-full transition-all ${i === slide % STORE_CAROUSEL.length ? "w-6 bg-usps-blue" : "w-2 bg-slate-200"}`} />
            ))}
            <button onClick={() => scroll(-1)} className="h-10 w-10 rounded-full border-2 border-slate-200 flex items-center justify-center hover:border-usps-blue hover:text-usps-blue transition-colors" aria-label="Scroll left">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={() => scroll(1)} className="h-10 w-10 rounded-full border-2 border-slate-200 flex items-center justify-center hover:border-usps-blue hover:text-usps-blue transition-colors" aria-label="Scroll right">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div ref={ref} className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2 -mx-4 px-4">
          {STORE_CAROUSEL.map((p) => (
            <div key={p.title} className="snap-start shrink-0 w-[270px] bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img src={p.img} alt={p.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                {p.badge && (
                  <span className={`absolute top-3 left-3 text-[10.5px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${p.price === "Free" ? "bg-green-600 text-white" : p.badge === "New" ? "bg-usps-gold text-usps-darker" : "bg-usps-blue text-white"}`}>
                    {p.badge}
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-black text-[16px] text-slate-900 leading-snug">{p.title}</h3>
                <p className="text-[12.5px] text-slate-500 mt-0.5">{p.desc}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className={`text-lg font-black ${p.price === "Free" ? "text-green-600" : "text-usps-blue"}`}>${p.price}</span>
                  <button onClick={() => add(p.title, p.price)} className="flex items-center gap-1.5 text-[13px] font-bold px-4 py-2 rounded-full bg-slate-100 hover:bg-usps-blue hover:text-white text-slate-800 transition-all">
                    <ShoppingCart className="h-3.5 w-3.5" /> Shop
                  </button>
                </div>
              </div>
            </div>
          ))}
          <Link to="/store" className="snap-start shrink-0 w-[220px] bg-usps-blue rounded-2xl p-6 flex flex-col justify-center items-start text-white hover:bg-usps-dark transition-colors">
            <p className="font-black text-xl leading-tight">Shop all<br />Postal Store®</p>
            <span className="mt-4 bg-white text-usps-blue text-[13px] font-bold px-4 py-2 rounded-full">Visit the Store →</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
