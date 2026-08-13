import { queryOne } from "@/lib/db";
import { toCamelCase } from "@/lib/utils";
import ChangePasswordForm from "@/components/admin/ChangePasswordForm";

export default async function AdminSettingsPage() {
  const raw = await queryOne<any>(`SELECT * FROM site_settings WHERE id = 1`);
  const settings = toCamelCase(
    raw ?? {
      announcement_enabled: true,
      announcement_text: "",
      marquee_enabled: true,
      marquee_items: [],
    }
  );

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl">Settings</h1>
      <div className="space-y-10">
        <ChangePasswordForm />
      </div>
    </div>
  );
}