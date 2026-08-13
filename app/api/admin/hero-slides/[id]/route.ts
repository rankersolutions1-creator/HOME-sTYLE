import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { pool } from "@/lib/db";
import { z } from "zod";

const slideSchema = z.object({
  image: z.string().min(1),
  badge: z.string().optional(),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  primaryBtnText: z.string().min(1),
  primaryBtnLink: z.string().min(1),
  secondaryBtnText: z.string().optional(),
  secondaryBtnLink: z.string().optional(),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    const d = slideSchema.parse(body);

    await pool.query(
      `UPDATE hero_slides SET
        image = $1, badge = $2, title = $3, subtitle = $4,
        primary_btn_text = $5, primary_btn_link = $6,
        secondary_btn_text = $7, secondary_btn_link = $8,
        sort_order = $9, is_active = $10, updated_at = now()
       WHERE id = $11`,
      [d.image, d.badge || null, d.title, d.subtitle || null, d.primaryBtnText, d.primaryBtnLink,
       d.secondaryBtnText || null, d.secondaryBtnLink || null, d.sortOrder, d.isActive, id]
    );

    return NextResponse.json({ id });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0]?.message }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Failed to update slide" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await pool.query(`DELETE FROM hero_slides WHERE id = $1`, [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete slide" }, { status: 500 });
  }
}