import { query } from "@/lib/db";
import { toCamelCase, formatPKR } from "@/lib/utils";
import Link from "next/link";
import { Eye } from "lucide-react";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  CONFIRMED: "bg-blue-50 text-blue-700",
  PROCESSING: "bg-purple-50 text-purple-700",
  SHIPPED: "bg-indigo-50 text-indigo-700",
  DELIVERED: "bg-parrot-50 text-parrot-700",
  CANCELLED: "bg-accent-50 text-accent-600",
};

export default async function AdminOrdersPage() {
  const raw = await query(
    `SELECT o.*,
       COALESCE(
         (SELECT COUNT(*)::int FROM order_items oi WHERE oi.order_id = o.id), 0
       ) AS item_count
     FROM orders o
     ORDER BY o.created_at DESC`
  );
  const orders = toCamelCase(raw);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl">Orders</h1>
        <p className="mt-1 text-sm text-ink/50">{orders.length} total</p>
      </div>

      {/* <div className="overflow-hidden rounded-2xl border border-parrot-100 bg-white shadow-soft">
        <table className="w-full text-sm"> */}
        <div className="overflow-x-auto rounded-2xl border border-parrot-100 bg-white shadow-soft">
  <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-parrot-100 bg-parrot-50/50 text-left text-ink/50">
              <th className="p-4">Order #</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Items</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o: any) => (
              <tr key={o.id} className="border-b border-parrot-50 align-top last:border-0 hover:bg-parrot-50/30">
                <td className="p-4 font-medium text-parrot-700">{o.orderNumber}</td>
                <td className="p-4">
                  {o.customerName}
                  <p className="text-xs text-ink/40">
                    {o.address}, {o.city}
                  </p>
                </td>
                <td className="p-4">{o.phone}</td>
                <td className="p-4">{o.itemCount} item(s)</td>
                <td className="p-4 font-medium">{formatPKR(o.total)}</td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[o.status] ?? "bg-ink/5 text-ink/60"}`}
                  >
                    {o.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="flex items-center gap-1 text-xs font-medium text-parrot-700 hover:underline"
                    >
                      <Eye size={13} /> View
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="py-12 text-center text-sm text-ink/40">No orders yet.</p>
        )}
      </div>
    </div>
  );
}