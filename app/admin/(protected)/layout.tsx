
// import Link from "next/link";
// import Image from "next/image";
// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";

// import { LayoutDashboard, Package, ShoppingBag, Folder, Settings,ChevronRight, Image as ImageIcon,Megaphone  } from "lucide-react";

// import { authOptions } from "@/lib/auth";
// import SignOutButton from "@/components/admin/SignOutButton";

// export default async function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const session = await getServerSession(authOptions);

//   if (!session) {
//     redirect("/admin/login");
//   }

// const links = [
//   { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
//   { href: "/admin/hero-slides", label: "Hero Slides", icon: ImageIcon },
//     { href: "/admin/announcement", label: "Announcement Bar", icon: Megaphone },
//   { href: "/admin/categories", label: "Categories", icon: Folder },
//   { href: "/admin/products", label: "Products", icon: Package },
//   { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
//   { href: "/admin/settings", label: "Settings", icon: Settings },
// ];

//   return (
//     <div className="flex min-h-screen bg-cream">
//       {/* Sidebar */}
//       <aside className="hidden w-60 shrink-0 flex-col border-r border-parrot-100 bg-white md:flex">
//         {/* Logo */}
// <div className="border-b border-parrot-100 px-5 py-5">
//   <Link
//     href="/admin/dashboard"
//     className="flex items-center justify-center"
//   >
//     <Image
//       src="/logo.png"
//       alt="HomeStyle"
//       width={105}
//       height={30}
//       className="h-auto w-[105px] object-contain"
//       priority
//     />
//   </Link>
// </div>

//         {/* Navigation */}
//         <div className="flex-1 px-3 py-6">
//           <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-ink/35">
//             Management
//           </p>

//           <nav className="flex flex-col gap-1">
//             {links.map((link) => {
//               const Icon = link.icon;

//               return (
//                 <Link
//                   key={link.href}
//                   href={link.href}
//                   className="group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-ink/65 transition-all duration-200 hover:bg-parrot-50 hover:text-parrot-700"
//                 >
//                   <span className="flex items-center gap-3">
//                     <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cream text-ink/50 transition group-hover:bg-white group-hover:text-parrot-600">
//                       <Icon size={17} strokeWidth={1.8} />
//                     </span>

//                     {link.label}
//                   </span>

//                   <ChevronRight
//                     size={14}
//                     className="text-ink/20 transition-transform group-hover:translate-x-0.5 group-hover:text-parrot-500"
//                   />
//                 </Link>
//               );
//             })}
//           </nav>
//         </div>

//         {/* Account */}
//         <div className="border-t border-parrot-100 p-4">
//           <div className="mb-3 rounded-xl bg-cream px-3 py-3">
//             <p className="text-[10px] font-semibold uppercase tracking-wide text-ink/35">
//               Signed in as
//             </p>

//             <p className="mt-1 truncate text-xs font-medium text-ink/70">
//               {session.user?.email}
//             </p>
//           </div>

//           <SignOutButton />
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="min-w-0 flex-1">
//         <div className="min-h-screen p-5 sm:p-6 lg:p-10">
//           {children}
//         </div>
//       </main>
//     </div>
//   );
// }
import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { ComponentType } from "react";

import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Folder,
  Settings,
  ChevronRight,
  Image as ImageIcon,
  Megaphone,
} from "lucide-react";

import { authOptions } from "@/lib/auth";
import SignOutButton from "@/components/admin/SignOutButton";
import AdminMobileNav from "@/components/admin/AdminMobileNav";

const ICON_MAP: Record<string, ComponentType<{ size?: number; strokeWidth?: number }>> = {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Folder,
  Settings,
  ImageIcon,
  Megaphone,
};

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "LayoutDashboard" as const },
  { href: "/admin/hero-slides", label: "Hero Slides", icon: "ImageIcon" as const },
  { href: "/admin/announcement", label: "Announcement Bar", icon: "Megaphone" as const },
  { href: "/admin/categories", label: "Categories", icon: "Folder" as const },
  { href: "/admin/products", label: "Products", icon: "Package" as const },
  { href: "/admin/orders", label: "Orders", icon: "ShoppingBag" as const },
  { href: "/admin/settings", label: "Settings", icon: "Settings" as const },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream md:flex-row">
      {/* Mobile top bar + slide-out menu */}
      <AdminMobileNav links={links} userEmail={session.user?.email ?? ""} />

      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-parrot-100 bg-white md:flex">
        {/* Logo */}
        <div className="border-b border-parrot-100 px-5 py-5">
          <Link
            href="/admin/dashboard"
            className="flex items-center justify-center"
          >
            <Image
              src="/logo.png"
              alt="HomeStyle"
              width={105}
              height={30}
              className="h-auto w-[105px] object-contain"
              priority
            />
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-3 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-ink/35">
            Management
          </p>

          <nav className="flex flex-col gap-1">
            {links.map((link) => {
              const Icon = ICON_MAP[link.icon];

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-ink/65 transition-all duration-200 hover:bg-parrot-50 hover:text-parrot-700"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cream text-ink/50 transition group-hover:bg-white group-hover:text-parrot-600">
                      <Icon size={17} strokeWidth={1.8} />
                    </span>

                    {link.label}
                  </span>

                  <ChevronRight
                    size={14}
                    className="text-ink/20 transition-transform group-hover:translate-x-0.5 group-hover:text-parrot-500"
                  />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Account */}
        <div className="border-t border-parrot-100 p-4">
          <div className="mb-3 rounded-xl bg-cream px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-ink/35">
              Signed in as
            </p>

            <p className="mt-1 truncate text-xs font-medium text-ink/70">
              {session.user?.email}
            </p>
          </div>

          <SignOutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1">
        <div className="min-h-screen p-4 sm:p-6 lg:p-10">{children}</div>
      </main>
    </div>
  );
}