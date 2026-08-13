import { queryOne } from "@/lib/db";
import { toCamelCase } from "@/lib/utils";
import CategoryForm from "@/components/admin/CategoryForm";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params;
  const raw = await queryOne<any>(`SELECT * FROM categories WHERE id = $1`, [id]);
  if (!raw) notFound();
  const category = toCamelCase(raw);

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl">Edit Category</h1>
      <CategoryForm
        initialValues={{
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description ?? "",
          image: category.image ?? "",
          sortOrder: category.sortOrder,
          featured: category.featured,
          navFeatured: category.navFeatured,
        }}
      />
    </div>
  );
}