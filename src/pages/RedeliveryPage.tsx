import { Link } from "react-router-dom";
import { Truck, Calendar, ArrowRight } from "lucide-react";
import PageHeader from "../components/PageHeader";

export default function RedeliveryPage() {
  return (
    <section id="redelivery" className="py-14 lg:py-20 bg-white scroll-mt-28">
      <div className="mx-auto max-w-7xl px-4">
        <PageHeader
          title="Schedule a Redelivery"
          route="track"
          desc="Request redelivery of a package that couldn't be delivered to your address."
        />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-lg font-black text-usps-darker mb-6">Request Redelivery</h3>
              <p className="text-slate-600 mb-6">
                If you missed a delivery, you can schedule redelivery online. USPS will attempt to
                redeliver your package on a date that works for you.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-usps-blue shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">What You Need</p>
                    <p className="text-[13px] text-slate-600">Tracking number or redelivery confirmation number from your PS Form 3849.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-usps-blue shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Delivery Options</p>
                    <p className="text-[13px] text-slate-600">Choose a delivery date, leave delivery instructions, or schedule for a specific time.</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 rounded-xl bg-usps-light border border-usps-blue/20">
                <p className="text-sm font-bold text-usps-darker">PS Form 3849:</p>
                <p className="text-[13px] text-slate-600 mt-1">
                  If you received a "We're Sorry We Missed You" notice (PS Form 3849), use the
                  redelivery confirmation number on the form to schedule redelivery online.
                </p>
              </div>
              <Link to="/track" className="bg-usps-blue hover:bg-usps-dark text-white font-bold px-6 py-3.5 rounded-full inline-block transition-colors text-sm">
                Schedule Redelivery Now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-lg font-black text-usps-darker mb-6">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-slate-900">How soon can I schedule redelivery?</p>
                  <p className="text-[13px] text-slate-600">You can schedule redelivery as soon as the delivery attempt has been scanned into our system.</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Is redelivery free?</p>
                  <p className="text-[13px] text-slate-600">Yes, redelivery is a free service for most packages.</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">How many redelivery attempts?</p>
                  <p className="text-[13px] text-slate-600">USPS will make one additional delivery attempt after you schedule redelivery.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-usps-blue rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-black text-white mb-6">Related Services</h3>
              <div className="space-y-3">
                <Link to="/track" className="block p-3 rounded-xl border border-white/20 text-white/90 hover:bg-white/10 transition-colors text-sm">
                  Track Your Package
                </Link>
                <Link to="/help" className="block p-3 rounded-xl border border-white/20 text-white/90 hover:bg-white/10 transition-colors text-sm">
                  Delivery Instructions
                </Link>
                <Link to="/help" className="block p-3 rounded-xl border border-white/20 text-white/90 hover:bg-white/10 transition-colors text-sm">
                  Hold Mail Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
