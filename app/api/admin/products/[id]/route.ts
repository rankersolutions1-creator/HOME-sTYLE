import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { pool } from "@/lib/db";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(5),
  price: z.number().min(0),
  compareAtPrice: z.number().min(0).nullable().optional(),
  stock: z.number().min(0),
  categoryId: z.string(),
  isFeatured: z.boolean(),
  isNew: z.boolean(),
  isReadyToShip: z.boolean(),
  isActive: z.boolean(),
  images: z.array(z.string()).min(1),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const client = await pool.connect();
  try {
    const { id } = await params;
    const body = await req.json();
    const data = productSchema.parse(body);

    await client.query("BEGIN");

    await client.query(
      `UPDATE products SET
         name = $1, slug = $2, description = $3, price = $4, compare_at_price = $5,
         stock = $6, category_id = $7, is_featured = $8, is_new = $9,
         is_ready_to_ship = $10, is_active = $11
       WHERE id = $12`,
      [data.name, data.slug, data.description, data.price, data.compareAtPrice ?? null,
       data.stock, data.categoryId, data.isFeatured, data.isNew, data.isReadyToShip, data.isActive, id]
    );

    await client.query(`DELETE FROM product_images WHERE product_id = $1`, [id]);

    for (let i = 0; i < data.images.length; i++) {
      await client.query(
        `INSERT INTO product_images (product_id, url, sort_order) VALUES ($1, $2, $3)`,
        [id, data.images[i], i]
      );
    }

    await client.query("COMMIT");
    return NextResponse.json({ id });
  } catch (err) {
    await client.query("ROLLBACK");
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0]?.message }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;

    const check = await pool.query(
      `SELECT COUNT(*)::int AS count FROM order_items WHERE product_id = $1`,
      [id]
    );

    if (check.rows[0].count > 0) {
      // Product has order history — can't hard delete without breaking past orders.
      // Deactivate it instead so it disappears from the storefront but stays in order records.
      await pool.query(`UPDATE products SET is_active = false WHERE id = $1`, [id]);
      return NextResponse.json({
        deactivated: true,
        message: "This product has existing orders, so it was hidden from the store instead of deleted.",
      });
    }

    await pool.query(`DELETE FROM products WHERE id = $1`, [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}