import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { pool } from "@/lib/db";
import { z } from "zod";

const settingsSchema = z.object({
  announcementEnabled: z.boolean(),
  announcementText: z.string(),
  marqueeEnabled: z.boolean(),
  marqueeItems: z.array(z.string()),
});

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = settingsSchema.parse(body);

    await pool.query(
      `UPDATE site_settings
       SET announcement_enabled = $1,
           announcement_text = $2,
           marquee_enabled = $3,
           marquee_items = $4,
           updated_at = now()
       WHERE id = 1`,
      [data.announcementEnabled, data.announcementText, data.marqueeEnabled, data.marqueeItems]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0]?.message }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}