import { query } from "@/lib/db";
import { toCamelCase } from "@/lib/utils";
import ProductCard from "@/components/ProductCard";
import { Search } from "lucide-react";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const searchTerm = (q ?? "").trim();

  let products: any[] = [];

  if (searchTerm) {
    const raw = await query(
      `SELECT p.*,
         COALESCE(
           (SELECT json_agg(json_build_object('id', pi.id, 'url', pi.url, 'alt', pi.alt) ORDER BY pi.sort_order)
            FROM product_images pi WHERE pi.product_id = p.id), '[]'
         ) AS images,
         COALESCE(
           (SELECT json_agg(json_build_object('id', pv.id, 'label', pv.label, 'swatchHex', pv.swatch_hex))
            FROM product_variants pv WHERE pv.product_id = p.id), '[]'
         ) AS variants
       FROM products p
       JOIN categories c ON c.id = p.category_id
       WHERE p.is_active = true
         AND (
           p.name ILIKE $1
           OR p.description ILIKE $1
           OR c.name ILIKE $1
         )
       ORDER BY p.created_at DESC`,
      [`%${searchTerm}%`]
    );
    products = toCamelCase(raw);
  }

  return (
    <div className="container-x py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-parrot-600">Search</p>
        <h1 className="section-title mt-1">
          {searchTerm ? `Results for "${searchTerm}"` : "Search Products"}
        </h1>
        {searchTerm && (
          <p className="mt-2 text-sm text-ink/50">
            {products.length} {products.length === 1 ? "product" : "products"} found
          </p>
        )}
      </div>

      {!searchTerm ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-parrot-200 bg-parrot-50/30 py-24 text-center">
          <Search size={40} className="mb-4 text-parrot-300" />
          <p className="text-ink/50">Type something in the search bar above to get started.</p>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p: any) => (
            <ProductCard
              key={p.id}
              id={p.id}
              name={p.name}
              slug={p.slug}
              price={p.price}
              compareAtPrice={p.compareAtPrice}
              images={p.images}
              isNew={p.isNew}
              isReadyToShip={p.isReadyToShip}
              stock={p.stock}
              variants={p.variants}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-parrot-200 bg-parrot-50/30 py-24 text-center">
          <Search size={40} className="mb-4 text-parrot-300" />
          <p className="text-ink/50">No products match &quot;{searchTerm}&quot;.</p>
        </div>
      )}
    </div>
  );
}