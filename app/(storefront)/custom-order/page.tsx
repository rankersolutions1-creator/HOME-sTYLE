"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { MessageCircle, Ruler, Palette, Hammer } from "lucide-react";

interface CustomOrderForm {
  name: string;
  phone: string;
  email?: string;
  furnitureType: string;
  dimensions?: string;
  colorPreference?: string;
  details: string;
}

export default function CustomOrderPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CustomOrderForm>();

  const onSubmit = async (data: CustomOrderForm) => {
    setSubmitting(true);
    // No backend endpoint for this yet — route straight to WhatsApp with prefilled details,
    // which matches how the original site actually took custom orders.
    const message = `Custom Order Request

Name: ${data.name}
Phone: ${data.phone}
${data.email ? `Email: ${data.email}\n` : ""}Furniture Type: ${data.furnitureType}
${data.dimensions ? `Dimensions: ${data.dimensions}\n` : ""}${data.colorPreference ? `Color Preference: ${data.colorPreference}\n` : ""}
Details: ${data.details}`;

    const waUrl = `https://wa.me/923303111222?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
    setSubmitted(true);
    setSubmitting(false);
    reset();
  };

  return (
    <div>
      {/* Banner */}
      <div className="relative h-56 w-full overflow-hidden sm:h-72">
        <Image
          src="https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&w=2000&q=85"
          alt="Custom furniture"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/10" />
        <div className="container-x absolute inset-0 flex flex-col justify-end pb-8">
          <span className="badge-sale w-fit">Made To Order</span>
          <h1 className="mt-3 font-display text-3xl font-medium text-white sm:text-5xl">
            Custom Furniture Orders
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/80 sm:text-base">
            Your size, your color, your design — built to order.
          </p>
        </div>
      </div>

      <div className="container-x grid gap-12 py-14 lg:grid-cols-[1fr_1.2fr]">
        {/* How it works */}
        <div>
          <h2 className="font-display text-2xl">How Custom Orders Work</h2>
          <div className="mt-6 space-y-6">
            {[
              { icon: Ruler, title: "Tell us your size", desc: "Share the dimensions or room space you're designing for." },
              { icon: Palette, title: "Pick your finish", desc: "Choose your fabric, wood tone, or color preference." },
              { icon: Hammer, title: "We build it", desc: "Our craftsmen build your piece to spec and deliver it to your door." },
            ].map((step) => (
              <div key={step.title} className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-parrot-50 text-parrot-600">
                  <step.icon size={20} />
                </div>
                <div>
                  <p className="font-semibold text-ink">{step.title}</p>
                  <p className="mt-1 text-sm text-ink/60">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-parrot-200 bg-parrot-50 p-5">
            <p className="text-sm text-ink/70">
              Prefer to talk it through directly? Message us on WhatsApp and we&apos;ll guide you
              through the whole process.
            </p>
            <a
              href="https://wa.me/923303111222"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-4"
            >
              <MessageCircle size={16} /> Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-parrot-100 bg-white p-6 shadow-soft sm:p-8">
          <h2 className="mb-6 font-display text-xl">Request a Custom Piece</h2>

          {submitted ? (
            <div className="py-10 text-center">
              <p className="font-medium text-parrot-700">Request sent!</p>
              <p className="mt-2 text-sm text-ink/60">
                We&apos;ve opened WhatsApp with your details — send the message to complete your
                request, and our team will get back to you shortly.
              </p>
              <button onClick={() => setSubmitted(false)} className="btn-outline mt-6">
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full Name" error={errors.name?.message}>
                  <input {...register("name", { required: "Name is required" })} className="input" />
                </Field>
                <Field label="Phone Number" error={errors.phone?.message}>
                  <input {...register("phone", { required: "Phone is required" })} className="input" placeholder="03XX XXXXXXX" />
                </Field>
              </div>

              <Field label="Email (optional)">
                <input {...register("email")} type="email" className="input" />
              </Field>

              <Field label="Furniture Type" error={errors.furnitureType?.message}>
                <input
                  {...register("furnitureType", { required: "Please specify what you need" })}
                  className="input"
                  placeholder="e.g. King size bed, 3-seater sofa"
                />
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Dimensions (optional)">
                  <input {...register("dimensions")} className="input" placeholder="e.g. 6x6.5 ft" />
                </Field>
                <Field label="Color / Fabric Preference (optional)">
                  <input {...register("colorPreference")} className="input" placeholder="e.g. Walnut wood, grey velvet" />
                </Field>
              </div>

              <Field label="Additional Details" error={errors.details?.message}>
                <textarea
                  {...register("details", { required: "Please add some details" })}
                  className="input min-h-[100px]"
                  placeholder="Describe the design, features, or reference image you have in mind"
                />
              </Field>

              <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
                {submitting ? "Sending..." : "Send Request via WhatsApp"}
              </button>
            </form>
          )}
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