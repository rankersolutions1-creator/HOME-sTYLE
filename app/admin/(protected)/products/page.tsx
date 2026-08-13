import { query } from "@/lib/db";
import { toCamelCase, formatPKR } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

interface Props {
  searchParams: Promise<{ tab?: string }>;
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const { tab } = await searchParams;
  const showHidden = tab === "hidden";

  const raw = await query(
    `SELECT p.*,
       c.name AS category_name,
       COALESCE(
         (SELECT json_agg(json_build_object('url', pi.url) ORDER BY pi.sort_order)
          FROM product_images pi WHERE pi.product_id = p.id), '[]'
       ) AS images
     FROM products p
     JOIN categories c ON c.id = p.category_id
     WHERE p.is_active = $1
     ORDER BY p.created_at DESC`,
    [!showHidden]
  );
  const products = toCamelCase(raw);

  const activeCountRaw = await query(`SELECT COUNT(*)::int AS count FROM products WHERE is_active = true`);
  const hiddenCountRaw = await query(`SELECT COUNT(*)::int AS count FROM products WHERE is_active = false`);
  const activeCount = activeCountRaw[0].count;
  const hiddenCount = hiddenCountRaw[0].count;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl">Products</h1>
          <p className="mt-1 text-sm text-ink/50">{products.length} shown</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-parrot-100">
        <Link
          href="/admin/products"
          className={`border-b-2 px-4 py-2.5 text-sm font-medium transition ${
            !showHidden
              ? "border-parrot-500 text-parrot-700"
              : "border-transparent text-ink/50 hover:text-ink"
          }`}
        >
          Active Products ({activeCount})
        </Link>
        <Link
          href="/admin/products?tab=hidden"
          className={`border-b-2 px-4 py-2.5 text-sm font-medium transition ${
            showHidden
              ? "border-parrot-500 text-parrot-700"
              : "border-transparent text-ink/50 hover:text-ink"
          }`}
        >
          Past / Hidden Products ({hiddenCount})
        </Link>
      </div>
{/* 
      <div className="overflow-hidden rounded-2xl border border-parrot-100 bg-white shadow-soft">
        <table className="w-full text-sm"> */}
        <div className="overflow-x-auto rounded-2xl border border-parrot-100 bg-white shadow-soft">
  <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-parrot-100 bg-parrot-50/50 text-left text-ink/50">
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p: any) => (
              <tr key={p.id} className="border-b border-parrot-50 last:border-0">
                <td className="flex items-center gap-3 p-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-parrot-50">
                    {p.images[0] && (
                      <Image src={p.images[0].url} alt={p.name} fill className="object-cover" />
                    )}
                  </div>
                  <span className="font-medium">{p.name}</span>
                </td>
                <td className="p-4 text-ink/60">{p.categoryName}</td>
                <td className="p-4">{formatPKR(p.price)}</td>
                <td className="p-4">{p.stock}</td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      p.isActive ? "bg-parrot-50 text-parrot-700" : "bg-accent-50 text-accent-600"
                    }`}
                  >
                    {p.isActive ? "Active" : "Hidden"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="text-xs font-medium text-parrot-700 hover:underline"
                    >
                      Edit
                    </Link>
                    {!showHidden && <DeleteProductButton productId={p.id} />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="py-12 text-center text-sm text-ink/40">
            {showHidden ? "No hidden products." : "No active products yet. Add your first one."}
          </p>
        )}
      </div>
    </div>
  );
}