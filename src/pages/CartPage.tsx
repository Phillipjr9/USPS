import { Link } from "react-router-dom";
import { ShoppingCart, Truck, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, setOrdered, setCartOpen } = useCart();
  const onCheckout = () => {
    setOrdered(true);
    setCartOpen(false);
  };

  const total = cart.reduce((sum, it) => {
    const p = it.price === "Free" ? 0 : parseFloat(it.price.replace("$", "")) || 0;
    return sum + p * it.qty;
  }, 0);

  return (
    <section id="cart" className="py-14 lg:py-20 bg-white scroll-mt-28">
      <div className="mx-auto max-w-3xl px-4">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/" className="text-[12px] text-usps-blue hover:underline flex items-center gap-1">
            <span>←</span> Back to home
          </Link>
          <h2 className="text-3xl font-black text-usps-darker tracking-tight flex items-center gap-3">
            <ShoppingCart className="h-7 w-7 text-usps-blue" /> Postal Store® Cart
          </h2>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <span className="h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center mb-6">
              <ShoppingCart className="h-10 w-10 text-slate-300" />
            </span>
            <h3 className="font-bold text-lg text-slate-800">Your cart is empty</h3>
            <p className="text-sm text-slate-500 mt-1 mb-6">Stamps, supplies and gifts ship free on orders over $40.</p>
            <Link to="/" className="bg-usps-blue hover:bg-usps-dark text-white font-bold px-6 py-3 rounded-full text-sm transition-colors">Continue Shopping</Link>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mx-5 mt-4 bg-green-50 border border-green-200 rounded-lg px-3 py-2.5 text-[12.5px] font-semibold text-green-800">
              <Truck className="h-4 w-4" />
              {total >= 40 ? "You've unlocked FREE shipping!" : `Add $${(40 - total).toFixed(2)} more for FREE shipping`}
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {cart.map((it) => (
                <div key={it.name} className="flex gap-3 border border-slate-200 rounded-xl p-3">
                  <div className="h-16 w-16 rounded-lg bg-usps-light flex items-center justify-center shrink-0 font-black text-usps-blue text-xl">
                    {it.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[13.5px] text-slate-900 leading-tight truncate">{it.name}</p>
                    <p className="text-[12px] text-slate-500">Qty: {it.qty}</p>
                    <p className="font-black text-usps-blue text-[15px]">{it.price}</p>
                  </div>
                  <button onClick={() => removeFromCart(it.name)} className="self-start p-1.5 text-slate-400 hover:text-usps-red hover:bg-red-50 rounded-lg transition-colors" aria-label={`Remove ${it.name}`}>
                    <span className="sr-only">Remove {it.name}</span>
                    ✕
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
      </div>
    </section>
  );
}
