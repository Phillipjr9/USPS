import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import PageHeader from "../components/PageHeader";

export default function FileClaimPage() {
  return (
    <section id="file-claim" className="py-14 lg:py-20 bg-white scroll-mt-28">
      <div className="mx-auto max-w-7xl px-4">
        <PageHeader
          title="File a Claim"
          route="help"
          desc="File a claim for a lost, damaged, or missing insured package."
        />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-lg font-black text-usps-darker mb-6">When to File a Claim</h3>
              <p className="text-slate-600 mb-6">
                You may file a claim if your insured package was lost, damaged, or had missing
                contents. Claims must be filed within specific timeframes depending on the service.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-usps-blue shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Lost Package</p>
                    <p className="text-[13px] text-slate-600">File if your package was insured and hasn't been delivered within the expected timeframe.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-usps-blue shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Damaged Package</p>
                    <p className="text-[13px] text-slate-600">File if your insured package arrived damaged. Keep the packaging and contents.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-usps-blue shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Missing Contents</p>
                    <p className="text-[13px] text-slate-600">File if your insured package arrived but items were missing.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-lg font-black text-usps-darker mb-6">What You Need</h3>
              <ul className="space-y-3 text-slate-600 text-sm list-disc list-inside">
                <li>Tracking number or USPS Tracking® label</li>
                <li>Proof of insurance (receipt or label)</li>
                <li>Proof of value (receipt, invoice, or online purchase confirmation)</li>
                <li>Photos of damage (if applicable)</li>
                <li>Sender and recipient information</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-lg font-black text-usps-darker mb-6">Claim Timeframes</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">Service</th>
                      <th className="py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">Earliest</th>
                      <th className="py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">Latest</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="py-3 text-sm text-slate-700">Priority Mail Express®</td>
                      <td className="py-3 text-sm text-slate-500">7 days after mailing</td>
                      <td className="py-3 text-sm text-slate-500">60 days</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-3 text-sm text-slate-700">Priority Mail®</td>
                      <td className="py-3 text-sm text-slate-500">7 days after mailing</td>
                      <td className="py-3 text-sm text-slate-500">60 days</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-3 text-sm text-slate-700">Ground Advantage®</td>
                      <td className="py-3 text-sm text-slate-500">7 days after mailing</td>
                      <td className="py-3 text-sm text-slate-500">60 days</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-3 text-sm text-slate-700">Registered Mail™</td>
                      <td className="py-3 text-sm text-slate-500">7 days after mailing</td>
                      <td className="py-3 text-sm text-slate-500">60 days</td>
                    </tr>
                  </tbody>
                </table>
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
                <Link to="/help" className="block p-3 rounded-xl border border-white/20 text-white/90 hover:bg-white/10 transition-colors text-sm">
                  Claims FAQs
                </Link>
                <Link to="/help" className="block p-3 rounded-xl border border-white/20 text-white/90 hover:bg-white/10 transition-colors text-sm">
                  Request a Refund
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
