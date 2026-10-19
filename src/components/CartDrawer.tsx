import { X, ShoppingCart, Trash2, ArrowRight, Truck } from "lucide-react";

export interface CartItem {
  name: string;
  price: string;
  qty: number;
}

export default function CartDrawer({
  open,
  items,
  onClose,
  onRemove,
  onCheckout,
}: {
  open: boolean;
  items: CartItem[];
  onClose: () => void;
  onRemove: (name: string) => void;
  onCheckout: () => void;
}) {
  const total = items.reduce((sum, it) => {
    const p = it.price === "Free" ? 0 : parseFloat(it.price.replace("$", "")) || 0;
    return sum + p * it.qty;
  }, 0);

  return (
    <div className={`fixed inset-0 z-[70] transition-opacity ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      <div className="absolute inset-0 bg-usps-darker/60 backdrop-blur-sm" onClick={onClose} />
      <aside className={`absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h3 className="font-black text-lg flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-usps-blue" /> Postal Store® Cart
            <span className="bg-usps-blue text-white text-[12px] px-2 py-0.5 rounded-full">{items.reduce((s, i) => s + i.qty, 0)}</span>
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full" aria-label="Close cart"><X className="h-5 w-5" /></button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <span className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <ShoppingCart className="h-9 w-9 text-slate-300" />
            </span>
            <p className="font-bold text-lg text-slate-800">Your cart is empty</p>
            <p className="text-sm text-slate-500 mt-1 mb-5">Stamps, supplies and gifts ship free<br />on orders over $40.</p>
            <button onClick={onClose} className="bg-usps-blue hover:bg-usps-dark text-white font-bold px-6 py-3 rounded-full text-sm transition-colors">
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mx-5 mt-4 bg-green-50 border border-green-200 rounded-lg px-3 py-2.5 text-[12.5px] font-semibold text-green-800">
              <Truck className="h-4 w-4" />
              {total >= 40 ? "You've unlocked FREE shipping!" : `Add $${(40 - total).toFixed(2)} more for FREE shipping`}
            </div>
            <div className="flex-1 overflow-y-auto thin-scroll p-5 space-y-3">
              {items.map((it) => (
                <div key={it.name} className="flex gap-3 border border-slate-200 rounded-xl p-3">
                  <div className="h-16 w-16 rounded-lg bg-usps-light flex items-center justify-center shrink-0 font-black text-usps-blue text-xl">
                    {it.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[13.5px] text-slate-900 leading-tight truncate">{it.name}</p>
                    <p className="text-[12px] text-slate-500">Qty: {it.qty}</p>
                    <p className="font-black text-usps-blue text-[15px]">{it.price}</p>
                  </div>
                  <button onClick={() => onRemove(it.name)} className="self-start p-1.5 text-slate-400 hover:text-usps-red hover:bg-red-50 rounded-lg transition-colors" aria-label={`Remove ${it.name}`}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="p-5 border-t border-slate-200 bg-slate-50">
              <div className="flex justify-between text-[14px] mb-1"><span className="text-slate-600">Subtotal</span><span className="font-bold">${total.toFixed(2)}</span></div>
              <div className="flex justify-between text-[14px] mb-3"><span className="text-slate-600">Shipping</span><span className="font-bold text-green-600">{total >= 40 ? "FREE" : "$4.95"}</span></div>
              <button onClick={onCheckout} className="w-full bg-usps-red hover:bg-usps-reddark text-white font-bold py-3.5 rounded-full flex items-center justify-center gap-2 transition-colors">
                Checkout <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
