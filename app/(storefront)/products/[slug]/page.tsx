import { queryOne } from "@/lib/db";
import { toCamelCase } from "@/lib/utils";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/ProductDetailClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

const PRODUCT_QUERY = `
  SELECT p.*,
    json_build_object('id', c.id, 'name', c.name, 'slug', c.slug) AS category,
    COALESCE(
      (SELECT json_agg(json_build_object('id', pi.id, 'url', pi.url, 'alt', pi.alt) ORDER BY pi.sort_order)
       FROM product_images pi WHERE pi.product_id = p.id), '[]'
    ) AS images,
    COALESCE(
      (SELECT json_agg(json_build_object('id', pv.id, 'label', pv.label, 'swatchHex', pv.swatch_hex, 'stock', pv.stock))
       FROM product_variants pv WHERE pv.product_id = p.id), '[]'
    ) AS variants
  FROM products p
  JOIN categories c ON c.id = p.category_id
  WHERE p.slug = $1
`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await queryOne<any>(`SELECT name, description FROM products WHERE slug = $1`, [
    slug,
  ]);
  if (!product) return {};
  return {
    title: `${product.name} | HomeStyle Interior & Decor`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const raw = await queryOne<any>(PRODUCT_QUERY, [slug]);
  if (!raw || !raw.is_active) notFound();

  const product = toCamelCase(raw);
  return <ProductDetailClient product={product} />;
}