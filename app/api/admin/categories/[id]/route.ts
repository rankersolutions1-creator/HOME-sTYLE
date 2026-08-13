import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { pool } from "@/lib/db";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  image: z.string().optional(),
  sortOrder: z.number().default(0),
  featured: z.boolean().default(false),
  navFeatured: z.boolean().default(false),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    const data = categorySchema.parse(body);

    await pool.query(
      `UPDATE categories SET name = $1, slug = $2, description = $3, image = $4, sort_order = $5, featured = $6, nav_featured = $7
       WHERE id = $8`,
      [
        data.name,
        data.slug,
        data.description || null,
        data.image || null,
        data.sortOrder,
        data.featured,
        data.navFeatured,
        id,
      ]
    );

    return NextResponse.json({ id });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0]?.message }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const check = await pool.query(
      `SELECT COUNT(*)::int AS count FROM products WHERE category_id = $1`,
      [id]
    );
    if (check.rows[0].count > 0) {
      return NextResponse.json(
        { error: "Cannot delete a category that still has products." },
        { status: 400 }
      );
    }
    await pool.query(`DELETE FROM categories WHERE id = $1`, [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}