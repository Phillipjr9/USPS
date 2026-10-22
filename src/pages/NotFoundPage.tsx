import { Link } from "react-router-dom";
import { ArrowLeft, Package, Truck, Search, ListTree } from "lucide-react";

const LINKS = [
  { label: "Track a Package", to: "/track", icon: Package },
  { label: "Find a Location", to: "/locations", icon: Truck },
  { label: "Buy Stamps", to: "/store", icon: Package },
];

export default function NotFoundPage() {
  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <div className="mx-auto mb-8 h-16 w-16 rounded-full bg-usps-light flex items-center justify-center">
          <Package className="h-8 w-8 text-usps-blue" />
        </div>
        <h1 className="text-[64px] font-black text-usps-darker tracking-tight mb-2">404</h1>
        <h2 className="text-xl text-slate-600 mb-8">We can&rsquo;t find that page.</h2>
        <p className="text-slate-500 mb-10 max-w-md mx-auto">The page you&rsquo;re looking for has moved or doesn&rsquo;t exist. Use one of the links below to get back on track.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {LINKS.map((l) => (
            <Link key={l.label} to={l.to} className="inline-flex items-center gap-2 bg-usps-blue hover:bg-usps-dark text-white font-bold px-6 py-3 rounded-full transition-colors">
              <l.icon className="h-4 w-4" /> {l.label}
            </Link>
          ))}
          <Link to="/" className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-usps-blue hover:underline font-semibold">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 text-[13px] font-semibold text-usps-blue sm:flex-row sm:gap-6">
          <Link to="/search" className="inline-flex items-center gap-1.5 hover:underline">
            <Search className="h-3.5 w-3.5" /> Search the site
          </Link>
          <Link to="/site-index" className="inline-flex items-center gap-1.5 hover:underline">
            <ListTree className="h-3.5 w-3.5" /> Browse the site index
          </Link>
          <Link to="/help" className="inline-flex items-center gap-1.5 hover:underline">
            Help &amp; Support
          </Link>
        </div>
      </div>
    </section>
  );
}
