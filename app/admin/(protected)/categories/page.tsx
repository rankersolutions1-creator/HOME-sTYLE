import { query } from "@/lib/db";
import { toCamelCase } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import DeleteCategoryButton from "@/components/admin/DeleteCategoryButton";

export default async function AdminCategoriesPage() {
  const raw = await query(
    `SELECT c.*, COALESCE((SELECT COUNT(*)::int FROM products p WHERE p.category_id = c.id), 0) AS product_count
     FROM categories c ORDER BY sort_order ASC`
  );
  const categories = toCamelCase(raw);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl">Categories</h1>
          <p className="mt-1 text-sm text-ink/50">{categories.length} total</p>
        </div>
        <Link href="/admin/categories/new" className="btn-primary">
          <Plus size={16} /> Add Category
        </Link>
      </div>
{/* 
      <div className="overflow-hidden rounded-2xl border border-parrot-100 bg-white shadow-soft">
        <table className="w-full text-sm"> */}
        <div className="overflow-x-auto rounded-2xl border border-parrot-100 bg-white shadow-soft">
  <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-parrot-100 bg-parrot-50/50 text-left text-ink/50">
              <th className="p-4">Category</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Products</th>
              <th className="p-4">Order</th>
              <th className="p-4">Featured</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c: any) => (
              <tr key={c.id} className="border-b border-parrot-50 last:border-0">
                <td className="flex items-center gap-3 p-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-parrot-50">
                    {c.image && <Image src={c.image} alt={c.name} fill className="object-cover" />}
                  </div>
                  <span className="font-medium">{c.name}</span>
                </td>
                <td className="p-4 text-ink/60">{c.slug}</td>
                <td className="p-4">{c.productCount}</td>
                <td className="p-4">{c.sortOrder}</td>
                <td className="p-4">
                  {c.featured && (
                    <span className="rounded-full bg-parrot-50 px-2.5 py-1 text-xs font-medium text-parrot-700">Yes</span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/categories/${c.id}/edit`} className="text-xs font-medium text-parrot-700 hover:underline">
                      Edit
                    </Link>
                    <DeleteCategoryButton categoryId={c.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <p className="py-12 text-center text-sm text-ink/40">No categories yet.</p>
        )}
      </div>
    </div>
  );
}