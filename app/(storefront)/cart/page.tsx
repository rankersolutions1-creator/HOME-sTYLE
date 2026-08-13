"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/store/cart";
import { formatPKR } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-x flex flex-col items-center justify-center gap-4 py-24 text-center">
        <ShoppingBag size={56} className="text-ink/20" strokeWidth={1.2} />
        <h1 className="font-display text-2xl">Your cart is empty</h1>
        <Link href="/products" className="btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container-x py-10">
      <h1 className="section-title mb-8">Your Cart</h1>
      <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
        <ul className="divide-y divide-parrot-100">
          {items.map((item) => (
            <li key={`${item.productId}-${item.variantLabel ?? ""}`} className="flex gap-4 py-6">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-parrot-50">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex flex-1 items-center justify-between">
                <div>
                  <p className="font-medium text-ink">{item.name}</p>
                  {item.variantLabel && <p className="text-sm text-ink/50">{item.variantLabel}</p>}
                  <p className="mt-1 font-semibold text-parrot-700">{formatPKR(item.price)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center rounded-full border border-parrot-200">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantLabel)}
                      className="p-2 hover:text-parrot-600"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantLabel)}
                      className="p-2 hover:text-parrot-600"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.variantLabel)}
                    className="text-accent-500 hover:text-accent-600"
                    aria-label="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="h-fit rounded-2xl border border-parrot-100 bg-white p-6 shadow-soft">
          <h2 className="mb-4 font-display text-xl">Order Summary</h2>
          <div className="flex justify-between text-sm text-ink/60">
            <span>Subtotal</span>
            <span>{formatPKR(subtotal())}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm text-ink/60">
            <span>Delivery</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="mt-4 flex justify-between border-t border-parrot-100 pt-4 font-semibold">
            <span>Total</span>
            <span>{formatPKR(subtotal())}</span>
          </div>
          <Link href="/checkout" className="btn-primary mt-6 w-full">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}