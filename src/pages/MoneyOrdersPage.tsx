import { Link } from "react-router-dom";
import { Mail, DollarSign, Clock } from "lucide-react";
import PageHeader from "../components/PageHeader";

export default function MoneyOrdersPage() {
  return (
    <section id="money-orders" className="py-14 lg:py-20 bg-white scroll-mt-28">
      <div className="mx-auto max-w-7xl px-4">
        <PageHeader
          title="Money Orders"
          route="locations"
          desc="Send a secure, prepaid payment with a USPS Money Order."
        />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-lg font-black text-usps-darker mb-6">What Is a Money Order?</h3>
              <p className="text-slate-600 mb-6">
                A USPS Money Order is a secure, prepaid payment method you can purchase at any
                Post Office™. It's safer than cash and can be replaced if lost or stolen.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-usps-blue shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Purchase a Money Order</p>
                    <p className="text-[13px] text-slate-600">Buy a money order at any Post Office with cash, debit card, or traveler's check.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-usps-blue shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Send a Money Order</p>
                    <p className="text-[13px] text-slate-600">Mail your money order to anyone in the U.S. or internationally.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-usps-blue shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Replace a Lost or Stolen Money Order</p>
                    <p className="text-[13px] text-slate-600">File a claim to replace a money order that has been lost, stolen, or damaged.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-lg font-black text-usps-darker mb-6">Money Order Fees & Limits</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">Amount</th>
                      <th className="py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">Fee</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="py-3 text-sm text-slate-700">$0.01 – $500.00</td>
                      <td className="py-3 text-sm font-bold text-slate-900">$2.10</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-3 text-sm text-slate-700">$500.01 – $1,000.00</td>
                      <td className="py-3 text-sm font-bold text-slate-900">$3.00</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-3 text-sm text-slate-700">Postal Military Money Order</td>
                      <td className="py-3 text-sm font-bold text-slate-900">$0.70</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-lg font-black text-usps-darker mb-6">How to Fill Out a Money Order</h3>
              <ol className="space-y-3 text-slate-600 text-sm list-decimal list-inside">
                <li>Write the payee's name in the "Pay to the Order of" field.</li>
                <li>Fill in your name and address in the purchaser section.</li>
                <li>Sign the front of the money order.</li>
                <li>Keep your receipt for tracking and proof of purchase.</li>
              </ol>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-usps-blue rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-black text-white mb-6">Quick Links</h3>
              <div className="space-y-3">
                <Link to="/locations" className="block p-3 rounded-xl border border-white/20 text-white/90 hover:bg-white/10 transition-colors text-sm">
                  Find a Post Office
                </Link>
                <Link to="/help" className="block p-3 rounded-xl border border-white/20 text-white/90 hover:bg-white/10 transition-colors text-sm">
                  Replace a Lost Money Order
                </Link>
                <Link to="/help" className="block p-3 rounded-xl border border-white/20 text-white/90 hover:bg-white/10 transition-colors text-sm">
                  Money Order FAQs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
