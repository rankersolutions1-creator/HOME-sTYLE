import { query, queryOne } from "@/lib/db";
import { toCamelCase } from "@/lib/utils";
import ProductForm from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  const productRaw = await queryOne<any>(
    `SELECT p.*,
       COALESCE(
         (SELECT json_agg(json_build_object('url', pi.url) ORDER BY pi.sort_order)
          FROM product_images pi WHERE pi.product_id = p.id), '[]'
       ) AS images
     FROM products p WHERE p.id = $1`,
    [id]
  );
  if (!productRaw) notFound();
  const product = toCamelCase(productRaw);

  const categoriesRaw = await query(`SELECT id, name FROM categories ORDER BY name ASC`);
  const categories = toCamelCase(categoriesRaw);

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl">Edit Product</h1>
      <ProductForm
        categories={categories}
        initialValues={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          stock: product.stock,
          categoryId: product.categoryId,
          isFeatured: product.isFeatured,
          isNew: product.isNew,
          isReadyToShip: product.isReadyToShip,
          isActive: product.isActive,
          images: product.images.map((i: any) => i.url),
        }}
      />
    </div>
  );
}