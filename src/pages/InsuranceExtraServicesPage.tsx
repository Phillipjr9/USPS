import { Link } from "react-router-dom";
import { Shield, DollarSign, Truck } from "lucide-react";
import PageHeader from "../components/PageHeader";

export default function InsuranceExtraServicesPage() {
  return (
    <section id="insurance" className="py-14 lg:py-20 bg-white scroll-mt-28">
      <div className="mx-auto max-w-7xl px-4">
        <PageHeader
          title="Insurance & Extra Services"
          route="ship"
          desc="Add insurance, signature confirmation, and other extra services to your shipment."
        />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-lg font-black text-usps-darker mb-6">Purchase Insurance</h3>
              <p className="text-slate-600 mb-6">
                Protect your shipment against loss or damage with USPS insurance. Coverage is
                available for domestic and international shipments.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-usps-blue shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Domestic Insurance</p>
                    <p className="text-[13px] text-slate-600">Coverage up to $5,000 for most domestic mail and package services.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-usps-blue shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">International Insurance</p>
                    <p className="text-[13px] text-slate-600">Coverage available for Priority Mail Express International® and other services.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-usps-blue shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Registered Mail™</p>
                    <p className="text-[13px] text-slate-600">The most secure service USPS offers, with chain-of-custody documentation.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-lg font-black text-usps-darker mb-6">Extra Services</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="h-5 w-5 rounded-full bg-usps-light text-usps-blue shrink-0 flex items-center justify-center mt-0.5">
                    <DollarSign className="h-3 w-3" />
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">Certified Mail™</p>
                    <p className="text-[13px] text-slate-600">Proof of mailing and delivery for important documents.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="h-5 w-5 rounded-full bg-usps-light text-usps-blue shrink-0 flex items-center justify-center mt-0.5">
                    <DollarSign className="h-3 w-3" />
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">Signature Confirmation™</p>
                    <p className="text-[13px] text-slate-600">Requires a signature at delivery for added security.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="h-5 w-5 rounded-full bg-usps-light text-usps-blue shrink-0 flex items-center justify-center mt-0.5">
                    <DollarSign className="h-3 w-3" />
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">Restricted Delivery</p>
                    <p className="text-[13px] text-slate-600">Deliver only to a specific person or their authorized agent.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="h-5 w-5 rounded-full bg-usps-light text-usps-blue shrink-0 flex items-center justify-center mt-0.5">
                    <DollarSign className="h-3 w-3" />
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">Adult Signature Required</p>
                    <p className="text-[13px] text-slate-600">Requires signature from an adult 21 years or older.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-usps-blue rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-black text-white mb-6">Quick Links</h3>
              <div className="space-y-3">
                <Link to="/ship" className="block p-3 rounded-xl border border-white/20 text-white/90 hover:bg-white/10 transition-colors text-sm">
                  Ship a Package
                </Link>
                <Link to="/help" className="block p-3 rounded-xl border border-white/20 text-white/90 hover:bg-white/10 transition-colors text-sm">
                  File a Claim
                </Link>
                <Link to="/help" className="block p-3 rounded-xl border border-white/20 text-white/90 hover:bg-white/10 transition-colors text-sm">
                  Insurance FAQs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
