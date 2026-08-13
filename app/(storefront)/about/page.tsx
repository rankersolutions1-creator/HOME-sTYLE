import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="container-x grid gap-12 py-16 lg:grid-cols-2 lg:items-center">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
        <Image
          src="https://images.unsplash.com/photo-1618221710640-c0eaaa2adb49?auto=format&fit=crop&w=900&q=80"
          alt="HomeStyle showroom"
          fill
          className="object-cover"
        />
      </div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-parrot-600">About Us</p>
        <h1 className="section-title mt-2">Crafting Homes That Feel Like You</h1>
        <p className="mt-5 leading-relaxed text-ink/60">
          HomeStyle Interior &amp; Decor has been serving Sialkot with quality furniture and
          modern interior solutions — from luxury sofas and beds to custom-made pieces built
          around your space and style. We believe great furniture should be both beautiful and
          built to last.
        </p>
        <p className="mt-4 leading-relaxed text-ink/60">
          Every piece we sell is checked for craftsmanship and durability, and our team is happy
          to design custom furniture to your exact size, color, and finish preferences.
        </p>
      </div>
    </div>
  );
}