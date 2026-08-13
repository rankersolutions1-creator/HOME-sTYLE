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

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const d = slideSchema.parse(body);

    const result = await pool.query(
      `INSERT INTO hero_slides
        (image, badge, title, subtitle, primary_btn_text, primary_btn_link, secondary_btn_text, secondary_btn_link, sort_order, is_active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`,
      [d.image, d.badge || null, d.title, d.subtitle || null, d.primaryBtnText, d.primaryBtnLink,
       d.secondaryBtnText || null, d.secondaryBtnLink || null, d.sortOrder, d.isActive]
    );

    return NextResponse.json({ id: result.rows[0].id }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0]?.message }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Failed to create slide" }, { status: 500 });
  }
}