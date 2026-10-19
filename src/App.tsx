import { useEffect, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import QuickTools from "./components/QuickTools";
import ShipSection from "./components/ShipSection";
import { HolidayBanner, FeaturedProducts, InformedDelivery, BusinessBanner, EDDMBand, Promo250 } from "./components/FeatureSections";
import Store from "./components/Store";
import { News, Help } from "./components/NewsHelp";
import Footer from "./components/Footer";
import CartDrawer, { CartItem } from "./components/CartDrawer";
import { ArrowUp, CheckCircle2, X } from "lucide-react";

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [cookies, setCookies] = useState(true);
  const [ordered, setOrdered] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const addToCart = (name: string, price: string) => {
    setCart((c) => {
      const ex = c.find((i) => i.name === name);
      if (ex) return c.map((i) => (i.name === name ? { ...i, qty: i.qty + 1 } : i));
      return [...c, { name, price, qty: 1 }];
    });
    setToast(`${name} added to cart`);
    setTimeout(() => setToast(null), 2200);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header cartCount={cart.reduce((s, i) => s + i.qty, 0)} onCartOpen={() => setCartOpen(true)} />

      <main>
        <Hero />
        <QuickTools />
        <HolidayBanner />
        <FeaturedProducts />
        <ShipSection />
        <InformedDelivery />
        <Store onAdd={addToCart} />
        <Promo250 />
        <BusinessBanner />
        <EDDMBand />
        <News />
        <Help />
      </main>

      <Footer />

      <CartDrawer
        open={cartOpen}
        items={cart}
        onClose={() => setCartOpen(false)}
        onRemove={(name) => setCart((c) => c.filter((i) => i.name !== name))}
        onCheckout={() => {
          setCartOpen(false);
          setOrdered(true);
          setCart([]);
        }}
      />

      {/* Order confirmation */}
      {ordered && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-usps-darker/70 backdrop-blur-sm" onClick={() => setOrdered(false)} />
          <div className="relative bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl fade-slide">
            <button onClick={() => setOrdered(false)} className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 rounded-full" aria-label="Close"><X className="h-5 w-5" /></button>
            <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto fill-green-100" />
            <h3 className="font-black text-xl mt-4">Order Placed!</h3>
            <p className="text-sm text-slate-600 mt-2">Confirmation <b className="font-mono">#USPS-{Math.floor(100000 + Math.random() * 899999)}</b><br />A receipt was sent to your email. Stamps ship in 3–5 days.</p>
            <button onClick={() => setOrdered(false)} className="mt-5 w-full bg-usps-blue hover:bg-usps-dark text-white font-bold py-3 rounded-full text-sm transition-colors">
              Continue Browsing
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[75] bg-usps-darker text-white text-[13.5px] font-semibold px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 fade-slide max-w-[90vw] truncate">
          <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" /> {toast}
        </div>
      )}

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className={`fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full bg-usps-blue hover:bg-usps-dark text-white shadow-xl flex items-center justify-center transition-all ${showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
      >
        <ArrowUp className="h-5 w-5" />
      </button>

      {/* Cookie banner */}
      {cookies && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t-2 border-usps-blue shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
          <div className="mx-auto max-w-7xl px-4 py-3.5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <p className="text-[12.5px] text-slate-600 flex-1">
              <b className="text-slate-900">We use cookies.</b> USPS.com uses cookies to improve your experience, analyze traffic, and remember preferences. See our <a href="#" className="text-usps-blue font-semibold hover:underline">Privacy Policy</a>.
            </p>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setCookies(false)} className="text-[13px] font-bold border-2 border-slate-200 hover:border-slate-400 px-4 py-2 rounded-full transition-colors">Manage</button>
              <button onClick={() => setCookies(false)} className="text-[13px] font-bold bg-usps-blue hover:bg-usps-dark text-white px-5 py-2 rounded-full transition-colors">Accept All</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
