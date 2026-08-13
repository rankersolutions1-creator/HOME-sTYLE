import { query } from "@/lib/db";
import { toCamelCase } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppButton from "@/components/WhatsAppButton";
import AnnouncementBar from "@/components/AnnouncementBar";

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const raw = await query(
    `SELECT name, slug FROM categories WHERE nav_featured = true ORDER BY sort_order ASC LIMIT 3`
  );
  const navCategories = toCamelCase(raw);

  return (
    <>
      <AnnouncementBar />
      <Header navCategories={navCategories} />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <WhatsAppButton />
    </>
  );
}