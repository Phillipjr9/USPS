import { Link } from "react-router-dom";
import { FileText, Truck } from "lucide-react";
import PageHeader from "../components/PageHeader";

export default function CustomsFormsPage() {
  return (
    <section id="customs-forms" className="py-14 lg:py-20 bg-white scroll-mt-28">
      <div className="mx-auto max-w-7xl px-4">
        <PageHeader
          title="Customs Forms"
          route="international"
          desc="Prepare customs documentation for international shipments."
        />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-lg font-black text-usps-darker mb-6">Customs Forms Overview</h3>
              <p className="text-slate-600 mb-6">
                Customs forms are required for most international shipments. They provide
                information about the contents, value, and purpose of your package to customs
                officials in the destination country.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-usps-blue shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">PS Form 2976</p>
                    <p className="text-[13px] text-slate-600">Customs declaration form for First-Class Mail International® and other services.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-usps-blue shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">PS Form 2976-R</p>
                    <p className="text-[13px] text-slate-600">Customs declaration for Priority Mail Express International® and Priority Mail International®.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-usps-blue shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">CN22 / CN23</p>
                    <p className="text-[13px] text-slate-600">International customs forms used for shipments to certain countries.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-lg font-black text-usps-darker mb-6">How to Complete a Customs Form</h3>
              <ol className="space-y-3 text-slate-600 text-sm list-decimal list-inside">
                <li>Describe the contents of your package in detail.</li>
                <li>State the value of each item in the destination currency.</li>
                <li>Indicate the reason for export (gift, sale, documents, etc.).</li>
                <li>Sign and date the form.</li>
                <li>Attach the form to the outside of your package.</li>
              </ol>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-lg font-black text-usps-darker mb-6">When Is a Customs Form Required?</h3>
              <ul className="space-y-3 text-slate-600 text-sm list-disc list-inside">
                <li>All shipments to countries outside the U.S.</li>
                <li>APO/FPO/DPO destinations</li>
                <li>U.S. territories and possessions</li>
                <li>Most commercial international shipments</li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-usps-blue rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-black text-white mb-6">Quick Links</h3>
              <div className="space-y-3">
                <Link to="/international" className="block p-3 rounded-xl border border-white/20 text-white/90 hover:bg-white/10 transition-colors text-sm">
                  Ship Internationally
                </Link>
                <Link to="/help" className="block p-3 rounded-xl border border-white/20 text-white/90 hover:bg-white/10 transition-colors text-sm">
                  Customs Forms FAQs
                </Link>
                <Link to="/shipping-restrictions" className="block p-3 rounded-xl border border-white/20 text-white/90 hover:bg-white/10 transition-colors text-sm">
                  Country Restrictions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
