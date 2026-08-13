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

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const client = await pool.connect();
  try {
    const body = await req.json();
    const data = productSchema.parse(body);

    await client.query("BEGIN");

    const productResult = await client.query(
      `INSERT INTO products
        (name, slug, description, price, compare_at_price, stock, category_id, is_featured, is_new, is_ready_to_ship, is_active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING id`,
      [
        data.name,
        data.slug,
        data.description,
        data.price,
        data.compareAtPrice ?? null,
        data.stock,
        data.categoryId,
        data.isFeatured,
        data.isNew,
        data.isReadyToShip,
        data.isActive,
      ]
    );
    const productId = productResult.rows[0].id;

    for (let i = 0; i < data.images.length; i++) {
      await client.query(
        `INSERT INTO product_images (product_id, url, sort_order) VALUES ($1, $2, $3)`,
        [productId, data.images[i], i]
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({ id: productId }, { status: 201 });
  } catch (err) {
    await client.query("ROLLBACK");
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0]?.message }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  } finally {
    client.release();
  }
}