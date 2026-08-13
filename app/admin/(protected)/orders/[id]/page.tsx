import { queryOne } from "@/lib/db";
import { toCamelCase, formatPKR } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Phone, MapPin, Mail, StickyNote } from "lucide-react";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;

  const raw = await queryOne<any>(
    `SELECT o.*,
       COALESCE(
         (SELECT json_agg(json_build_object(
            'id', oi.id,
            'quantity', oi.quantity,
            'unitPrice', oi.unit_price,
            'variantLabel', oi.variant_label,
            'productName', p.name,
            'productSlug', p.slug,
            'productImage', (
              SELECT pi.url FROM product_images pi
              WHERE pi.product_id = p.id ORDER BY pi.sort_order LIMIT 1
            )
          ))
          FROM order_items oi
          JOIN products p ON p.id = oi.product_id
          WHERE oi.order_id = o.id), '[]'
       ) AS items
     FROM orders o
     WHERE o.id = $1`,
    [id]
  );

  if (!raw) notFound();
  const order = toCamelCase(raw);

  return (
    <div>
      <Link
        href="/admin/orders"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-parrot-700 hover:underline"
      >
        <ArrowLeft size={15} /> Back to Orders
      </Link>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl">{order.orderNumber}</h1>
          <p className="mt-1 text-sm text-ink/50">
            Placed on {new Date(order.createdAt).toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" })}
          </p>
        </div>
        <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Items */}
        <div className="rounded-2xl border border-parrot-100 bg-white p-6 shadow-soft">
          <h2 className="mb-4 font-display text-lg">Items Ordered</h2>
          <ul className="divide-y divide-parrot-50">
            {order.items.map((item: any) => (
              <li key={item.id} className="flex items-center gap-4 py-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-parrot-50">
                  {item.productImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <Link
                    href={`/products/${item.productSlug}`}
                    target="_blank"
                    className="font-medium text-ink hover:text-parrot-700 hover:underline"
                  >
                    {item.productName}
                  </Link>
                  {item.variantLabel && (
                    <p className="text-xs text-ink/50">Variant: {item.variantLabel}</p>
                  )}
                  <p className="text-xs text-ink/50">
                    {formatPKR(item.unitPrice)} × {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-ink">{formatPKR(item.unitPrice * item.quantity)}</p>
              </li>
            ))}
          </ul>

          <div className="mt-4 space-y-2 border-t border-parrot-100 pt-4 text-sm">
            <div className="flex justify-between text-ink/60">
              <span>Subtotal</span>
              <span>{formatPKR(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-ink/60">
              <span>Delivery</span>
              <span>{order.deliveryFee > 0 ? formatPKR(order.deliveryFee) : "Free"}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-ink">
              <span>Total</span>
              <span>{formatPKR(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Customer info */}
        <div className="h-fit space-y-6">
          <div className="rounded-2xl border border-parrot-100 bg-white p-6 shadow-soft">
            <h2 className="mb-4 font-display text-lg">Customer</h2>
            <p className="font-medium text-ink">{order.customerName}</p>
            <ul className="mt-3 space-y-2 text-sm text-ink/70">
              <li className="flex items-start gap-2">
                <Phone size={15} className="mt-0.5 shrink-0 text-parrot-600" />
                <a href={`tel:${order.phone}`} className="hover:text-parrot-700">{order.phone}</a>
              </li>
              {order.email && (
                <li className="flex items-start gap-2">
                  <Mail size={15} className="mt-0.5 shrink-0 text-parrot-600" />
                  {order.email}
                </li>
              )}
              <li className="flex items-start gap-2">
                <MapPin size={15} className="mt-0.5 shrink-0 text-parrot-600" />
                <span>
                  {order.address}, {order.city}
                </span>
              </li>
              {order.notes && (
                <li className="flex items-start gap-2">
                  <StickyNote size={15} className="mt-0.5 shrink-0 text-parrot-600" />
                  <span className="italic text-ink/60">{order.notes}</span>
                </li>
              )}
            </ul>
          </div>

          <div className="rounded-2xl border border-parrot-100 bg-white p-6 shadow-soft">
            <h2 className="mb-2 font-display text-lg">Payment</h2>
            <p className="text-sm text-ink/70">Method: {order.paymentMethod}</p>
          </div>
        </div>
      </div>
    </div>
  );
}