import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export interface CartItem {
  name: string;
  price: string;
  qty: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (name: string, price: string) => void;
  removeFromCart: (name: string) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  ordered: boolean;
  setOrdered: (ordered: boolean) => void;
  toast: string | null;
  setToast: (toast: string | null) => void;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_KEY = "usps_cart";

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(readCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Keep the cart across reloads and browser restarts.
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      /* storage unavailable */
    }
  }, [cart]);

  const clearCart = useCallback(() => setCart([]), []);

  const addToCart = useCallback((name: string, price: string) => {
    setCart((c) => {
      const ex = c.find((i) => i.name === name);
      if (ex) return c.map((i) => (i.name === name ? { ...i, qty: i.qty + 1 } : i));
      return [...c, { name, price, qty: 1 }];
    });
    setToast(`${name} added to cart`);
    setTimeout(() => setToast(null), 2200);
  }, []);

  const removeFromCart = useCallback((name: string) => {
    setCart((c) => c.filter((i) => i.name !== name));
  }, []);

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    cartOpen,
    setCartOpen,
    ordered,
    setOrdered,
    toast,
    setToast,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
