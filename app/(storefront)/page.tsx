// import { query, queryOne } from "@/lib/db";
// import { toCamelCase } from "@/lib/utils";
// import Hero from "@/components/Hero";
// import MarqueeBar from "@/components/MarqueeBar";
// import CategoryCard from "@/components/CategoryCard";
// import ProductCard from "@/components/ProductCard";
// import CustomOrderCTA from "@/components/CustomOrderCTA";
// import Link from "next/link";
// import { ArrowRight } from "lucide-react";

// export const revalidate = 60;

// export default async function HomePage() {
//   const [categoriesRaw, featuredRaw, heroSlidesRaw, settingsRaw] = await Promise.all([
//     query(`SELECT * FROM categories ORDER BY sort_order ASC LIMIT 6`),
//     query(
//       `SELECT p.*,
//          COALESCE(
//            (SELECT json_agg(json_build_object('id', pi.id, 'url', pi.url, 'alt', pi.alt) ORDER BY pi.sort_order)
//             FROM product_images pi WHERE pi.product_id = p.id), '[]'
//          ) AS images,
//          COALESCE(
//            (SELECT json_agg(json_build_object('id', pv.id, 'label', pv.label, 'swatchHex', pv.swatch_hex))
//             FROM product_variants pv WHERE pv.product_id = p.id), '[]'
//          ) AS variants
//        FROM products p
//        WHERE p.is_featured = true AND p.is_active = true
//        ORDER BY p.created_at DESC
//        LIMIT 8`
//     ),
//     query(`SELECT * FROM hero_slides WHERE is_active = true ORDER BY sort_order ASC`),
//     queryOne(`SELECT marquee_enabled, marquee_items FROM site_settings WHERE id = 1`),
//   ]);

//   const categories = toCamelCase(categoriesRaw);
//   const featuredProducts = toCamelCase(featuredRaw);
//   const heroSlides = toCamelCase(heroSlidesRaw);
//   const settings = toCamelCase(settingsRaw ?? { marquee_enabled: false, marquee_items: [] });

//   return (
//     <>
//       <Hero slides={heroSlides} />
//       <MarqueeBar enabled={settings.marqueeEnabled} items={settings.marqueeItems ?? []} />

//       <section className="container-x py-16">
//         <div className="mb-10 flex items-end justify-between">
//           <div>
//             <p className="text-sm font-semibold uppercase tracking-wide text-parrot-600">
//               Shop by Category
//             </p>
//             <h2 className="section-title mt-2">Explore Our Collection</h2>
//           </div>
//           <Link
//             href="/products"
//             className="hidden items-center gap-1 text-sm font-semibold text-parrot-700 hover:underline md:flex"
//           >
//             View All <ArrowRight size={15} />
//           </Link>
//         </div>

//         {categories.length > 0 ? (
//           <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
//             {categories.map((cat: any, i: number) => (
//               <CategoryCard
//                 key={cat.id}
//                 name={cat.name}
//                 slug={cat.slug}
//                 image={cat.image ?? "/images/placeholder.jpg"}
//                 index={i}
//               />
//             ))}
//           </div>
//         ) : (
//           <EmptyState label="No categories yet — add some from the admin dashboard." />
//         )}
//       </section>

//       <section className="bg-parrot-50/50 py-16">
//         <div className="container-x">
//           <div className="mb-10 text-center">
//             <p className="text-sm font-semibold uppercase tracking-wide text-parrot-600">
//               Hot Selling
//             </p>
//             <h2 className="section-title mt-2">Featured Products</h2>
//           </div>

//           {featuredProducts.length > 0 ? (
//             <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
//               {featuredProducts.map((p: any) => (
//                 <ProductCard
//                   key={p.id}
//                   id={p.id}
//                   name={p.name}
//                   slug={p.slug}
//                   price={p.price}
//                   compareAtPrice={p.compareAtPrice}
//                   images={p.images}
//                   isNew={p.isNew}
//                   isReadyToShip={p.isReadyToShip}
//                   stock={p.stock}
//                   variants={p.variants}
//                 />
//               ))}
//             </div>
//           ) : (
//             <EmptyState label="No featured products yet — add products and mark them Featured in the admin dashboard." />
//           )}
//         </div>
//       </section>

//       <CustomOrderCTA />
//     </>
//   );
// }

// function EmptyState({ label }: { label: string }) {
//   return (
//     <div className="rounded-2xl border border-dashed border-parrot-200 bg-white py-16 text-center text-sm text-ink/50">
//       {label}
//     </div>
//   );
// }
import { query, queryOne } from "@/lib/db";
import { toCamelCase } from "@/lib/utils";
import Hero from "@/components/Hero";
import MarqueeBar from "@/components/MarqueeBar";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import CustomOrderCTA from "@/components/CustomOrderCTA";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const revalidate = 60;

export default async function HomePage() {
  const [categoriesRaw, featuredRaw, heroSlidesRaw, settingsRaw] = await Promise.all([
    query(
      `SELECT * FROM categories
       WHERE featured = true
       ORDER BY sort_order ASC
       LIMIT 6`
    ),
    query(
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
       WHERE p.is_featured = true AND p.is_active = true
       ORDER BY p.created_at DESC
       LIMIT 8`
    ),
    query(`SELECT * FROM hero_slides WHERE is_active = true ORDER BY sort_order ASC`),
    queryOne(`SELECT marquee_enabled, marquee_items FROM site_settings WHERE id = 1`),
  ]);

  let categories = toCamelCase(categoriesRaw);

  // Fallback: if no categories are marked Featured yet, show all so homepage isn't empty
  if (categories.length === 0) {
    const allCategoriesRaw = await query(
      `SELECT * FROM categories ORDER BY sort_order ASC LIMIT 6`
    );
    categories = toCamelCase(allCategoriesRaw);
  }

  const featuredProducts = toCamelCase(featuredRaw);
  const heroSlides = toCamelCase(heroSlidesRaw);
  const settings = toCamelCase(settingsRaw ?? { marquee_enabled: false, marquee_items: [] });

  return (
    <>
      <Hero slides={heroSlides} />
      <MarqueeBar enabled={settings.marqueeEnabled} items={settings.marqueeItems ?? []} />

      <section className="container-x py-16">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-parrot-600">
              Shop by Category
            </p>
            <h2 className="section-title mt-2">Explore Our Collection</h2>
          </div>
          <Link
            href="/products"
            className="hidden items-center gap-1 text-sm font-semibold text-parrot-700 hover:underline md:flex"
          >
            View All <ArrowRight size={15} />
          </Link>
        </div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat: any, i: number) => (
              <CategoryCard
                key={cat.id}
                name={cat.name}
                slug={cat.slug}
                image={cat.image ?? "/images/placeholder.jpg"}
                index={i}
              />
            ))}
          </div>
        ) : (
          <EmptyState label="No categories yet — add some from the admin dashboard." />
        )}
      </section>

      <section className="bg-parrot-50/50 py-16">
        <div className="container-x">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-parrot-600">
              Hot Selling
            </p>
            <h2 className="section-title mt-2">Featured Products</h2>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
              {featuredProducts.map((p: any) => (
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
            <EmptyState label="No featured products yet — add products and mark them Featured in the admin dashboard." />
          )}
        </div>
      </section>

      <CustomOrderCTA />
    </>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-parrot-200 bg-white py-16 text-center text-sm text-ink/50">
      {label}
    </div>
  );
}