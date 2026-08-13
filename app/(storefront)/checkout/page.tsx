"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useCart } from "@/store/cart";
import { formatPKR } from "@/lib/utils";
import { toast } from "sonner";
import { Truck } from "lucide-react";

interface CheckoutForm {
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  notes?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>();

  const onSubmit = async (form: CheckoutForm) => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({
            productId: i.productId,
            variantLabel: i.variantLabel,
            quantity: i.quantity,
            unitPrice: i.price,
          })),
        }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Something went wrong");
      }
      const { id } = await res.json();
      router.push(`/order-confirmation/${id}`);
      // cart is cleared on the confirmation page itself, not here —
      // clearing here caused a flash back to the empty-cart view
      // mid-navigation
    } catch (err: any) {
      toast.error(err.message ?? "Failed to place order");
      setSubmitting(false);
    }
  };

  if (items.length === 0 && !submitting) {
    return (
      <div className="container-x py-24 text-center">
        <p className="text-ink/60">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="container-x py-10">
      <h1 className="section-title mb-8">Checkout</h1>
      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full Name" error={errors.customerName?.message}>
              <input
                {...register("customerName", { required: "Name is required" })}
                className="input"
                placeholder="Your full name"
              />
            </Field>
            <Field label="Phone Number" error={errors.phone?.message}>
              <input
                {...register("phone", { required: "Phone is required", minLength: 10 })}
                className="input"
                placeholder="03XX XXXXXXX"
              />
            </Field>
          </div>

          <Field label="Email (optional)">
            <input {...register("email")} type="email" className="input" placeholder="you@example.com" />
          </Field>

          <Field label="Delivery Address" error={errors.address?.message}>
            <textarea
              {...register("address", { required: "Address is required" })}
              className="input min-h-[90px]"
              placeholder="House #, Street, Area"
            />
          </Field>

          <Field label="City" error={errors.city?.message}>
            <input {...register("city", { required: "City is required" })} className="input" placeholder="Sialkot" />
          </Field>

          <Field label="Order Notes (optional)">
            <textarea {...register("notes")} className="input min-h-[70px]" placeholder="Any special instructions" />
          </Field>

          <div className="rounded-2xl border border-parrot-200 bg-parrot-50 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-parrot-700">
              <Truck size={16} /> Cash on Delivery
            </p>
            <p className="mt-1 text-xs text-ink/50">
              Pay in cash when your order arrives. Online payments coming soon.
            </p>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
            {submitting ? "Placing Order..." : `Place Order — ${formatPKR(subtotal())}`}
          </button>
        </form>

        <div className="h-fit rounded-2xl border border-parrot-100 bg-white p-6 shadow-soft">
          <h2 className="mb-4 font-display text-xl">Order Summary</h2>
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={`${item.productId}-${item.variantLabel ?? ""}`} className="flex justify-between text-sm">
                <span className="text-ink/70">
                  {item.name} × {item.quantity}
                  {item.variantLabel && <span className="text-ink/40"> ({item.variantLabel})</span>}
                </span>
                <span className="font-medium">{formatPKR(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-parrot-100 pt-4 font-semibold">
            <span>Total</span>
            <span>{formatPKR(subtotal())}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-accent-500">{error}</span>}
    </label>
  );
}