import { Link } from "react-router-dom";
import { Search, Mail, Truck, ArrowRight } from "lucide-react";
import PageHeader from "../components/PageHeader";

export default function FindMissingMailPage() {
  return (
    <section id="missing-mail" className="py-14 lg:py-20 bg-white scroll-mt-28">
      <div className="mx-auto max-w-7xl px-4">
        <PageHeader
          title="Find Missing Mail"
          route="help"
          desc="Submit a request to help USPS locate your missing mail or package."
        />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-lg font-black text-usps-darker mb-6">Missing Mail Search</h3>
              <p className="text-slate-600 mb-6">
                If your mail or package hasn't arrived when expected, submit a Missing Mail search
                request. USPS will search for your item and send you updates.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Search className="h-5 w-5 text-usps-blue shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">When to Search</p>
                    <p className="text-[13px] text-slate-600">Wait at least 7 days from the expected delivery date before submitting a search request.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-usps-blue shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">What You Need</p>
                    <p className="text-[13px] text-slate-600">Sender and recipient addresses, tracking number (if available), and description of contents.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-usps-blue shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">What Happens Next</p>
                    <p className="text-[13px] text-slate-600">USPS will search for your item and email you with results and next steps.</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 rounded-xl bg-usps-light border border-usps-blue/20">
                <p className="text-sm font-bold text-usps-darker">Tip:</p>
                <p className="text-[13px] text-slate-600 mt-1">
                  Sign up for Informed Delivery® to preview your incoming mail and track packages
                  before they arrive.
                </p>
              </div>
              <Link to="/track" className="bg-usps-blue hover:bg-usps-dark text-white font-bold px-6 py-3.5 rounded-full inline-block transition-colors text-sm">
                Search for Missing Mail <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-lg font-black text-usps-darker mb-6">Related Services</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="h-5 w-5 rounded-full bg-usps-light text-usps-blue shrink-0 flex items-center justify-center mt-0.5">
                    <Search className="h-3 w-3" />
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">Informed Delivery®</p>
                    <p className="text-[13px] text-slate-600">Preview your incoming mail daily.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="h-5 w-5 rounded-full bg-usps-light text-usps-blue shrink-0 flex items-center justify-center mt-0.5">
                    <Truck className="h-3 w-3" />
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">USPS Tracking®</p>
                    <p className="text-[13px] text-slate-600">Track packages in real time.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="h-5 w-5 rounded-full bg-usps-light text-usps-blue shrink-0 flex items-center justify-center mt-0.5">
                    <Mail className="h-3 w-3" />
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">Hold Mail</p>
                    <p className="text-[13px] text-slate-600">Hold delivery while you're away.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-usps-blue rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-black text-white mb-6">Quick Links</h3>
              <div className="space-y-3">
                <Link to="/track" className="block p-3 rounded-xl border border-white/20 text-white/90 hover:bg-white/10 transition-colors text-sm">
                  Track Your Package
                </Link>
                <Link to="/informed" className="block p-3 rounded-xl border border-white/20 text-white/90 hover:bg-white/10 transition-colors text-sm">
                  Sign Up for Informed Delivery
                </Link>
                <Link to="/help" className="block p-3 rounded-xl border border-white/20 text-white/90 hover:bg-white/10 transition-colors text-sm">
                  Missing Mail FAQs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
