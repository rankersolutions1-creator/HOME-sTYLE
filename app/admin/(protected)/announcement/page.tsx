import { queryOne } from "@/lib/db";
import { toCamelCase } from "@/lib/utils";
import AnnouncementSettingsForm from "@/components/admin/AnnouncementSettingsForm";

export default async function AdminAnnouncementPage() {
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
      <h1 className="mb-8 font-display text-2xl">Announcement Bar</h1>
      <AnnouncementSettingsForm
        initial={{
          announcementEnabled: settings.announcementEnabled,
          announcementText: settings.announcementText,
          marqueeEnabled: settings.marqueeEnabled,
          marqueeItems: settings.marqueeItems ?? [],
        }}
      />
    </div>
  );
}