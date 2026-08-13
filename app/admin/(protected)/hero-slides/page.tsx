import { query } from "@/lib/db";
import { toCamelCase } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Plus, Trash2 } from "lucide-react";
import DeleteHeroSlideButton from "@/components/admin/DeleteHeroSlideButton";

export default async function AdminHeroSlidesPage() {
  const raw = await query(`SELECT * FROM hero_slides ORDER BY sort_order ASC`);
  const slides = toCamelCase(raw);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-2xl">Hero Slides</h1>
        <Link href="/admin/hero-slides/new" className="btn-primary">
          <Plus size={16} /> Add Slide
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {slides.map((s: any) => (
          <div key={s.id} className="overflow-hidden rounded-2xl border border-parrot-100 bg-white shadow-soft">
            <div className="relative h-32 w-full">
              <Image src={s.image} alt={s.title} fill className="object-cover" unoptimized />
              {!s.isActive && (
                <span className="absolute left-2 top-2 rounded-full bg-accent-500 px-2 py-1 text-[10px] font-semibold text-white">
                  Hidden
                </span>
              )}
            </div>
            <div className="p-4">
              <p className="font-medium text-ink line-clamp-1">{s.title}</p>
              <p className="mt-1 text-xs text-ink/40">Order: {s.sortOrder}</p>
              <div className="mt-3 flex items-center gap-3">
                <Link href={`/admin/hero-slides/${s.id}/edit`} className="text-xs font-medium text-parrot-700 hover:underline">
                  Edit
                </Link>
                <DeleteHeroSlideButton slideId={s.id} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {slides.length === 0 && (
        <p className="py-12 text-center text-sm text-ink/40">No hero slides yet. Add your first one.</p>
      )}
    </div>
  );
}