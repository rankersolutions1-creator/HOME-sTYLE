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

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = categorySchema.parse(body);

    const result = await pool.query(
      `INSERT INTO categories (name, slug, description, image, sort_order, featured, nav_featured)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
      [
        data.name,
        data.slug,
        data.description || null,
        data.image || null,
        data.sortOrder,
        data.featured,
        data.navFeatured,
      ]
    );

    return NextResponse.json({ id: result.rows[0].id }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0]?.message }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}