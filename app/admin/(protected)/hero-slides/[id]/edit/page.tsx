import { queryOne } from "@/lib/db";
import { toCamelCase } from "@/lib/utils";
import HeroSlideForm from "@/components/admin/HeroSlideForm";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditHeroSlidePage({ params }: Props) {
  const { id } = await params;
  const raw = await queryOne<any>(`SELECT * FROM hero_slides WHERE id = $1`, [id]);
  if (!raw) notFound();
  const slide = toCamelCase(raw);

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl">Edit Hero Slide</h1>
      <HeroSlideForm
        initialValues={{
          id: slide.id,
          image: slide.image,
          badge: slide.badge ?? "",
          title: slide.title,
          subtitle: slide.subtitle ?? "",
          primaryBtnText: slide.primaryBtnText,
          primaryBtnLink: slide.primaryBtnLink,
          secondaryBtnText: slide.secondaryBtnText ?? "",
          secondaryBtnLink: slide.secondaryBtnLink ?? "",
          sortOrder: slide.sortOrder,
          isActive: slide.isActive,
        }}
      />
    </div>
  );
}