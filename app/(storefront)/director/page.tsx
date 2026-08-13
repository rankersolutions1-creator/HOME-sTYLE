import { Quote } from "lucide-react";
import DirectorImage from "@/components/DirectorImage";

export const metadata = {
  title: "Director's Vision | Homestyle",
  description:
    "A personal message from our director — the vision, values, and passion behind Homestyle Furniture.",
};

export default function DirectorPage() {
  return (
    <main className="min-h-screen bg-cream">
      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden bg-accent-500 py-24 text-white">
        {/* decorative blurs using real dark tones */}
        <span className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-parrot-800/30 blur-3xl" />
        <span className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-parrot-900/30 blur-3xl" />

        <div className="container-x relative text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-parrot-300">
            Leadership &amp; Vision
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Director&apos;s Message
          </h1>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-parrot-500" />
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            The story, values, and vision that shape every piece of furniture we
            craft.
          </p>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="container-x py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 rounded-3xl border border-parrot-100 bg-white p-8 shadow-card lg:grid-cols-[280px_1fr] lg:p-14">

            {/* Left — Director photo + name */}
            <aside className="flex flex-col items-center gap-5 text-center lg:items-start lg:text-left">
              <DirectorImage />

              <div>
                <h2 className="font-display text-xl font-bold text-ink">
Rana Jamshaid                </h2>
                <p className="mt-1 text-sm font-semibold text-parrot-500">
                  Founder &amp; Director
                </p>
                <p className="mt-0.5 text-xs text-ink/40">
                  Homestyle Furniture
                </p>
              </div>

              {/* divider + est. */}
              <div className="w-full border-t border-parrot-100 pt-4">
                <p className="text-xs text-ink/40">Sialkot, Pakistan</p>
              </div>

              {/* small accent bar */}
              <div className="hidden h-1 w-12 rounded-full bg-parrot-500 lg:block" />
            </aside>

            {/* Right — Message body */}
            <article className="flex flex-col gap-6">
              {/* Opening quote */}
              <div className="flex items-start gap-3 rounded-2xl bg-parrot-50 p-5">
                <Quote
                  size={32}
                  className="mt-1 shrink-0 text-parrot-500"
                  fill="currentColor"
                />
                <p className="text-lg font-semibold italic leading-relaxed text-ink/80">
                  &ldquo;Furniture is not just wood and fabric — it is the
                  silent foundation of every memory made at home.&rdquo;
                </p>
              </div>

              <div className="space-y-4 text-base leading-relaxed text-ink/70">
                <p>
                  Assalam-o-Alaikum and a warm welcome to Homestyle. When I
                  founded this company, I had a single, clear vision: to bring
                  world-class craftsmanship to every Pakistani home — without
                  compromise on quality or affordability.
                </p>
                <p>
                  Over the years I have watched families grow, homes transform,
                  and children build their earliest memories surrounded by
                  furniture that we built with our own hands. That privilege
                  never gets old. Every sofa delivered, every bed assembled,
                  every kids&apos; room furnished is a reminder of why we do
                  what we do.
                </p>
                <p>
                  Our craftsmen are not merely workers — they are artists. Each
                  joint is hand-fitted, each fabric hand-selected, and each
                  finish inspected with the same care I would apply to my own
                  home. We do not cut corners, because you deserve better.
                </p>
                <p>
                  Looking ahead, our vision is to expand our design language
                  while staying rooted in the warmth of traditional
                  craftsmanship. We are investing in sustainable materials,
                  faster delivery, and a custom-order experience that lets every
                  family personalise their space exactly as they imagine it.
                </p>
                <p>
                  Thank you for trusting Homestyle. Your home is our greatest
                  portfolio, and your satisfaction is our highest honour.
                </p>
              </div>

              {/* Closing signature */}
              <div className="mt-2 flex items-center gap-4 border-t border-parrot-100 pt-6">
                <div className="h-10 w-1 rounded-full bg-parrot-500" />
                <div>
                  <p className="font-display font-bold text-ink">
       Rana Jamshaid
                  </p>
                  <p className="text-sm text-parrot-500">
                    Founder &amp; Director, Homestyle Furniture
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

          {/* ── Values Strip ── */}
      <section className="bg-cream py-16">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-3xl bg-accent-500 px-6 py-16 shadow-card sm:px-12 lg:px-16">
            {/* subtle warm glow accents */}
            <span className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-parrot-500/10 blur-3xl" />
            <span className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-parrot-500/10 blur-3xl" />

            {/* Heading */}
            <div className="relative mb-12 text-center">
              <span className="inline-block rounded-full bg-parrot-500/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-parrot-300">
                Our Pillars
              </span>
              <h3 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">
                The Values We Build On
              </h3>
              <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-parrot-500" />
              <p className="mx-auto mt-4 max-w-xl text-sm text-white/60">
                Four unshakeable principles guide every design, every stitch,
                and every delivery we make.
              </p>
            </div>

            {/* Cards */}
            <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {VALUES.map((v) => (
                <div
                  key={v.title}
                  className="group flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-parrot-500/40 hover:bg-white/10"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-parrot-500/15 text-2xl transition group-hover:bg-parrot-500/25">
                    {v.icon}
                  </div>
                  <h4 className="font-display font-semibold text-white">
                    {v.title}
                  </h4>
                  <p className="text-sm leading-relaxed text-white/60">
                    {v.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ── Data ── */
const VALUES = [
  {
    icon: "🪵",
    title: "Authentic Craftsmanship",
    desc: "Every piece is built by skilled artisans who take pride in their work.",
  },
  {
    icon: "🏡",
    title: "Home First",
    desc: "We design for real families and real life — not just showrooms.",
  },
  {
    icon: "🤝",
    title: "Trust & Integrity",
    desc: "Honest pricing, honest timelines, and honest quality. Always.",
  },
  {
    icon: "🌱",
    title: "Sustainable Future",
    desc: "Responsibly sourced materials and eco-conscious manufacturing.",
  },
];