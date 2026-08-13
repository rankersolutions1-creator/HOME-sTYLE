import { query, queryOne } from "@/lib/db";
import { toCamelCase } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, PackageSearch } from "lucide-react";
import ProductCard from "@/components/ProductCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  // Get category
  const categoryRaw = await queryOne<any>(
    `SELECT * FROM categories WHERE slug = $1`,
    [slug]
  );

  if (!categoryRaw) {
    notFound();
  }

  const category = toCamelCase(categoryRaw);

  // Get products
  const productsRaw = await query(
    `SELECT 
      p.*,

      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', pi.id,
              'url', pi.url,
              'alt', pi.alt
            )
            ORDER BY pi.sort_order
          )
          FROM product_images pi
          WHERE pi.product_id = p.id
        ),
        '[]'
      ) AS images,

      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', pv.id,
              'label', pv.label,
              'swatchHex', pv.swatch_hex
            )
          )
          FROM product_variants pv
          WHERE pv.product_id = p.id
        ),
        '[]'
      ) AS variants

    FROM products p
    WHERE p.category_id = $1
      AND p.is_active = true
    ORDER BY p.created_at DESC`,
    [category.id]
  );

  const products = toCamelCase(productsRaw);

  return (
    <div>
      {/* Banner */}
      <div className="relative h-64 w-full overflow-hidden bg-ink sm:h-80">
        <Image
          src={category.image ?? "/images/placeholder.jpg"}
          alt={category.name}
          fill
          priority
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-ink/10" />

        <div className="container-x absolute inset-0 flex flex-col justify-end pb-8">
          {/* Breadcrumb */}
          <nav className="mb-3 flex items-center gap-1.5 text-xs text-white/70">
            <Link href="/" className="hover:text-white">
              Home
            </Link>

            <ChevronRight size={12} />

            <Link href="/products" className="hover:text-white">
              Collection
            </Link>

            <ChevronRight size={12} />

            <span className="text-white">{category.name}</span>
          </nav>

          {/* Category title */}
          <h1 className="font-display text-3xl font-medium text-white sm:text-5xl">
            {category.name}
          </h1>

          {/* Description */}
          {category.description && (
            <p className="mt-2 max-w-xl text-sm text-white/80 sm:text-base">
              {category.description}
            </p>
          )}

          {/* Product count */}
          <p className="mt-3 text-xs font-medium uppercase tracking-wide text-parrot-300">
            {products.length}{" "}
            {products.length === 1 ? "Product" : "Products"}
          </p>
        </div>
      </div>

      {/* Products */}
      <div className="container-x py-12">
        {products.length > 0 ? (
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
            {/* Icon */}
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-parrot-100 text-parrot-500">
              <PackageSearch size={28} />
            </div>

            {/* Message */}
            <h3 className="font-display text-xl text-ink">
              Nothing here yet
            </h3>

            <p className="mt-2 max-w-sm text-sm text-ink/50">
              We&apos;re restocking {category.name.toLowerCase()}. Check back
              soon, or explore the rest of our collection in the meantime.
            </p>

            {/* Buttons */}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/products" className="btn-primary">
                Browse All Products
              </Link>

              <a
                href="https://wa.me/923303111222"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                Ask on WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}