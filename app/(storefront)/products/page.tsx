import { query } from "@/lib/db";
import { toCamelCase } from "@/lib/utils";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import ProductSortSelect from "@/components/ProductSortSelect";

export const revalidate = 30;

interface Props {
  searchParams: Promise<{ category?: string; sort?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;

  const categoriesRaw = await query(`SELECT * FROM categories ORDER BY name ASC`);
  const categories = toCamelCase(categoriesRaw);

  const orderByClause =
    params.sort === "price-asc"
      ? "p.price ASC"
      : params.sort === "price-desc"
      ? "p.price DESC"
      : "p.created_at DESC";

  const whereClauses = ["p.is_active = true"];
  const sqlParams: any[] = [];

  if (params.category) {
    sqlParams.push(params.category);
    whereClauses.push(`c.slug = $${sqlParams.length}`);
  }

  const productsRaw = await query(
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
     WHERE ${whereClauses.join(" AND ")}
     ORDER BY ${orderByClause}`,
    sqlParams
  );
  const products = toCamelCase(productsRaw);

  return (
    <div className="container-x py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-parrot-600">Shop</p>
        <h1 className="section-title mt-1">All Collection</h1>
      </div>

      <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
        <aside className="space-y-6">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-ink">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/products"
                  className={`hover:text-parrot-600 ${
                    !params.category ? "font-semibold text-parrot-700" : "text-ink/60"
                  }`}
                >
                  All Products
                </Link>
              </li>
              {categories.map((c: any) => (
                <li key={c.id}>
                  <Link
                    href={`/products?category=${c.slug}`}
                    className={`hover:text-parrot-600 ${
                      params.category === c.slug ? "font-semibold text-parrot-700" : "text-ink/60"
                    }`}
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-ink/50">{products.length} products</p>
            <ProductSortSelect currentSort={params.sort ?? ""} currentCategory={params.category} />
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3">
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
            <div className="rounded-2xl border border-dashed border-parrot-200 py-20 text-center text-ink/50">
              No products found. Add some from the admin dashboard.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}