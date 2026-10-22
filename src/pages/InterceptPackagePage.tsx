import { Link } from "react-router-dom";
import { Truck, Search, AlertCircle } from "lucide-react";
import PageHeader from "../components/PageHeader";

export default function InterceptPackagePage() {
  return (
    <section id="intercept" className="py-14 lg:py-20 bg-white scroll-mt-28">
      <div className="mx-auto max-w-7xl px-4">
        <PageHeader
          title="Intercept a Package"
          route="track"
          desc="Stop or redirect a package that is already in transit."
        />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-lg font-black text-usps-darker mb-6">Package Intercept Service</h3>
              <p className="text-slate-600 mb-6">
                USPS Package Intercept® allows you to stop delivery or redirect a package that is
                already in transit. You can request that the package be held at a Post Office™,
                returned to sender, or delivered to a different address.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Search className="h-5 w-5 text-usps-blue shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Eligibility</p>
                    <p className="text-[13px] text-slate-600">Most domestic package services with tracking are eligible for Package Intercept.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-usps-red shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Fee Applies</p>
                    <p className="text-[13px] text-slate-600">A Package Intercept fee applies per piece, plus any postage for rerouting.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-usps-blue shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Options</p>
                    <p className="text-[13px] text-slate-600">Hold at Post Office, return to sender, or redirect to a different address.</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 rounded-xl bg-usps-light border border-usps-blue/20">
                <p className="text-sm font-bold text-usps-darker">How to Request:</p>
                <p className="text-[13px] text-slate-600 mt-1">
                  Sign in to your USPS.com® account, enter your tracking number, and select
                  "Request Package Intercept" if the option is available.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-lg font-black text-usps-darker mb-6">What You Can Do</h3>
              <ul className="space-y-3 text-slate-600 text-sm list-disc list-inside">
                <li>Request that a package be held at a Post Office for pickup</li>
                <li>Redirect a package to a different address</li>
                <li>Return a package to the sender</li>
                <li>Cancel a Package Intercept request</li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-usps-blue rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-black text-white mb-6">Related Links</h3>
              <div className="space-y-3">
                <Link to="/track" className="block p-3 rounded-xl border border-white/20 text-white/90 hover:bg-white/10 transition-colors text-sm">
                  Track Your Package
                </Link>
                <Link to="/help" className="block p-3 rounded-xl border border-white/20 text-white/90 hover:bg-white/10 transition-colors text-sm">
                  File a Claim
                </Link>
                <Link to="/help" className="block p-3 rounded-xl border border-white/20 text-white/90 hover:bg-white/10 transition-colors text-sm">
                  Package Intercept FAQs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
