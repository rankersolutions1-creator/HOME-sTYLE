import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantLabel?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantLabel?: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  subtotal: () => number;
  totalItems: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const items = get().items;
        const existing = items.find(
          (i) => i.productId === item.productId && i.variantLabel === item.variantLabel
        );
        if (existing) {
          set({
            items: items.map((i) =>
              i === existing
                ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock || 99) }
                : i
            ),
          });
        } else {
          set({ items: [...items, item] });
        }
        set({ isOpen: true });
      },

      removeItem: (productId, variantLabel) => {
        set({
          items: get().items.filter(
            (i) => !(i.productId === productId && i.variantLabel === variantLabel)
          ),
        });
      },

      updateQuantity: (productId, quantity, variantLabel) => {
        set({
          items: get().items.map((i) =>
            i.productId === productId && i.variantLabel === variantLabel
              ? { ...i, quantity: Math.max(1, quantity) }
              : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "homestyle-cart" }
  )
);