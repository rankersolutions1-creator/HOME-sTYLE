import { query, queryOne } from "@/lib/db";
import { toCamelCase, formatPKR } from "@/lib/utils";
import { Package, ShoppingBag, DollarSign, Clock } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const productCountRow = await queryOne<any>(`SELECT COUNT(*)::int AS count FROM products`);
  const orderCountRow = await queryOne<any>(`SELECT COUNT(*)::int AS count FROM orders`);
  const pendingRow = await queryOne<any>(
    `SELECT COUNT(*)::int AS count FROM orders WHERE status = 'PENDING'`
  );
  const revenueRow = await queryOne<any>(
    `SELECT COALESCE(SUM(total), 0)::int AS total FROM orders`
  );

  const recentOrdersRaw = await query(
    `SELECT * FROM orders ORDER BY created_at DESC LIMIT 5`
  );
  const recentOrders = toCamelCase(recentOrdersRaw);

  const stats = [
    { label: "Total Products", value: productCountRow?.count ?? 0, icon: Package },
    { label: "Total Orders", value: orderCountRow?.count ?? 0, icon: ShoppingBag },
    { label: "Pending Orders", value: pendingRow?.count ?? 0, icon: Clock },
    { label: "Total Revenue", value: formatPKR(revenueRow?.total ?? 0), icon: DollarSign },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl">Dashboard</h1>
      <p className="mt-1 text-sm text-ink/50">Overview of your store</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-parrot-100 bg-white p-5 shadow-soft">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-parrot-50 text-parrot-600">
              <s.icon size={18} />
            </div>
            <p className="text-2xl font-semibold text-ink">{s.value}</p>
            <p className="text-xs text-ink/50">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-parrot-100 bg-white p-6 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm font-medium text-parrot-700 hover:underline">
            View All
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink/40">No orders yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-parrot-100 text-left text-ink/50">
                <th className="pb-2">Order #</th>
                <th className="pb-2">Customer</th>
                <th className="pb-2">Status</th>
                <th className="pb-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o: any) => (
                <tr key={o.id} className="border-b border-parrot-50 last:border-0">
                  <td className="py-3 font-medium text-parrot-700">{o.orderNumber}</td>
                  <td className="py-3">{o.customerName}</td>
                  <td className="py-3">
                    <span className="rounded-full bg-parrot-50 px-2.5 py-1 text-xs font-medium text-parrot-700">
                      {o.status}
                    </span>
                  </td>
                  <td className="py-3 text-right font-medium">{formatPKR(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}