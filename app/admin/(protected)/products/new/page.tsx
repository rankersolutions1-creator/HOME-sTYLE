import { query } from "@/lib/db";
import { toCamelCase } from "@/lib/utils";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const raw = await query(`SELECT id, name FROM categories ORDER BY name ASC`);
  const categories = toCamelCase(raw);

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl">Add Product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}