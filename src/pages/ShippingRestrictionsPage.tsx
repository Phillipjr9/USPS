import { Link } from "react-router-dom";
import { AlertTriangle, Package, ArrowRight } from "lucide-react";
import PageHeader from "../components/PageHeader";

export default function ShippingRestrictionsPage() {
  return (
    <section id="restrictions" className="py-14 lg:py-20 bg-white scroll-mt-28">
      <div className="mx-auto max-w-7xl px-4">
        <PageHeader
          title="Shipping Restrictions"
          route="ship"
          desc="Learn what items are prohibited or restricted from being mailed through USPS."
        />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-lg font-black text-usps-darker mb-6">Prohibited Items</h3>
              <p className="text-slate-600 mb-6">
                Certain items are prohibited from being mailed through USPS. These items cannot be
                sent under any circumstances.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-usps-red shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Explosives & Fireworks</p>
                    <p className="text-[13px] text-slate-600">Fireworks, ammunition, explosives, and other dangerous materials.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-usps-red shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Flammable Liquids</p>
                    <p className="text-[13px] text-slate-600">Gasoline, lighter fluid, paint thinners, and other flammable materials.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-usps-red shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Illegal Drugs</p>
                    <p className="text-[13px] text-slate-600">Controlled substances and illegal narcotics are strictly prohibited.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-usps-red shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Perishable Items</p>
                    <p className="text-[13px] text-slate-600">Certain perishable foods and plants may be restricted based on destination.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-lg font-black text-usps-darker mb-6">Restricted Items</h3>
              <p className="text-slate-600 mb-6">
                Restricted items may be mailed only under specific conditions or with special
                packaging and documentation.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Package className="h-5 w-5 text-usps-blue shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Alcoholic Beverages</p>
                    <p className="text-[13px] text-slate-600">Restricted; requires proper licensing and packaging.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Package className="h-5 w-5 text-usps-blue shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Perishable Foods</p>
                    <p className="text-[13px] text-slate-600">May require special packaging and expedited shipping.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Package className="h-5 w-5 text-usps-blue shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Plant Materials</p>
                    <p className="text-[13px] text-slate-600">Certain plants and seeds may be restricted to prevent pests and diseases.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Package className="h-5 w-5 text-usps-blue shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Hazardous Materials</p>
                    <p className="text-[13px] text-slate-600">Certain chemicals, batteries, and aerosols may be restricted.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-lg font-black text-usps-darker mb-6">International Restrictions</h3>
              <p className="text-slate-600 mb-6">
                Each country has its own rules about what can be imported. Check the destination
                country's restrictions before shipping internationally.
              </p>
              <Link to="/international" className="bg-usps-blue hover:bg-usps-dark text-white font-bold px-6 py-3 rounded-full inline-block transition-colors text-sm">
                View International Restrictions <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-usps-blue rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-black text-white mb-6">Related Links</h3>
              <div className="space-y-3">
                <Link to="/ship" className="block p-3 rounded-xl border border-white/20 text-white/90 hover:bg-white/10 transition-colors text-sm">
                  Ship a Package
                </Link>
                <Link to="/international" className="block p-3 rounded-xl border border-white/20 text-white/90 hover:bg-white/10 transition-colors text-sm">
                  International Shipping
                </Link>
                <Link to="/help" className="block p-3 rounded-xl border border-white/20 text-white/90 hover:bg-white/10 transition-colors text-sm">
                  Shipping Restrictions FAQs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
