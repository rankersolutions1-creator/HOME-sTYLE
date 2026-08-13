This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


# HomeStyle Interior & Decor — Next.js Store

## Setup

1. Install dependencies:
   npm install

2. Copy `.env.example` to `.env` and fill in:
   - DATABASE_URL (Neon or Supabase Postgres connection string)
   - NEXTAUTH_SECRET (run: openssl rand -base64 32)
   - Cloudinary credentials

3. Push the schema to your database:
   npx prisma db push

4. Seed placeholder data (admin user + categories + products):
   npx prisma db seed

5. Run the dev server:
   npm run dev

## Admin login
   Email: admin@homestyle.com.pk
   Password: admin123
   (change this immediately after first login — there's currently no
   "change password" UI in the scaffold, update directly via Prisma Studio:
   npx prisma studio)

## Cloudinary setup for image uploads
   Create an unsigned upload preset named `homestyle_products` in your
   Cloudinary dashboard (Settings → Upload → Add upload preset → 
   Signing Mode: Unsigned) so the admin product form can upload directly
   from the browser.

## Deploy
   Push to GitHub, import into Vercel, add the same environment variables
   there, and set the Postgres DATABASE_URL to your Neon/Supabase
   production database. Vercel will run `prisma generate` automatically
   via the postinstall script.
```

```
homestyle
├─ AGENTS.md
├─ app
│  ├─ (storefront)
│  │  ├─ about
│  │  │  └─ page.tsx
│  │  ├─ cart
│  │  │  └─ page.tsx
│  │  ├─ catalog
│  │  │  └─ page.tsx
│  │  ├─ category
│  │  │  └─ [slug]
│  │  │     └─ page.tsx
│  │  ├─ checkout
│  │  │  └─ page.tsx
│  │  ├─ contact
│  │  │  └─ page.tsx
│  │  ├─ custom-order
│  │  │  └─ page.tsx
│  │  ├─ layout.tsx
│  │  ├─ page.tsx
│  │  ├─ products
│  │  │  ├─ page.tsx
│  │  │  └─ [slug]
│  │  │     └─ page.tsx
│  │  └─ search
│  │     └─ page.tsx
│  ├─ admin
│  │  ├─ (protected)
│  │  │  ├─ announcement
│  │  │  │  └─ page.tsx
│  │  │  ├─ categories
│  │  │  │  ├─ new
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ [id]
│  │  │  │     └─ edit
│  │  │  │        └─ page.tsx
│  │  │  ├─ dashboard
│  │  │  │  └─ page.tsx
│  │  │  ├─ hero-slides
│  │  │  │  ├─ new
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ [id]
│  │  │  │     └─ edit
│  │  │  │        └─ page.tsx
│  │  │  ├─ layout.tsx
│  │  │  ├─ orders
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ [id]
│  │  │  │     └─ page.tsx
│  │  │  ├─ products
│  │  │  │  ├─ new
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ [id]
│  │  │  │     └─ edit
│  │  │  │        └─ page.tsx
│  │  │  └─ settings
│  │  │     └─ page.tsx
│  │  └─ login
│  │     └─ page.tsx
│  ├─ api
│  │  ├─ admin
│  │  │  ├─ categories
│  │  │  │  ├─ route.ts
│  │  │  │  └─ [id]
│  │  │  │     └─ route.ts
│  │  │  ├─ change-password
│  │  │  │  └─ route.ts
│  │  │  ├─ hero-slides
│  │  │  │  ├─ route.ts
│  │  │  │  └─ [id]
│  │  │  │     └─ route.ts
│  │  │  ├─ orders
│  │  │  │  └─ [id]
│  │  │  │     └─ route.ts
│  │  │  ├─ products
│  │  │  │  ├─ route.ts
│  │  │  │  └─ [id]
│  │  │  │     └─ route.ts
│  │  │  └─ settings
│  │  │     └─ route.ts
│  │  ├─ auth
│  │  │  └─ [...nextauth]
│  │  │     └─ route.ts
│  │  └─ orders
│  │     └─ route.ts
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ order-confirmation
│     └─ [id]
│        └─ page.tsx
├─ CLAUDE.md
├─ components
│  ├─ admin
│  │  ├─ AnnouncementSettingsForm.tsx
│  │  ├─ CategoryForm.tsx
│  │  ├─ ChangePasswordForm.tsx
│  │  ├─ DeleteCategoryButton.tsx
│  │  ├─ DeleteHeroSlideButton.tsx
│  │  ├─ DeleteProductButton.tsx
│  │  ├─ HeroSlideForm.tsx
│  │  ├─ OrderStatusSelect.tsx
│  │  ├─ ProductForm.tsx
│  │  └─ SignOutButton.tsx
│  ├─ AnnouncementBar.tsx
│  ├─ CartDrawer.tsx
│  ├─ CategoryCard.tsx
│  ├─ ClearCartOnMount.tsx
│  ├─ CustomOrderCTA.tsx
│  ├─ Footer.tsx
│  ├─ Header.tsx
│  ├─ Hero.tsx
│  ├─ MarqueeBar.tsx
│  ├─ ProductCard.tsx
│  ├─ ProductDetailClient.tsx
│  ├─ ProductSortSelect.tsx
│  ├─ Providers.tsx
│  ├─ SearchBar.tsx
│  └─ WhatsAppButton.tsx
├─ eslint.config.mjs
├─ lib
│  ├─ auth.ts
│  ├─ db.ts
│  └─ utils.ts
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ proxy.ts
├─ public
│  ├─ custom.png
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ logo.png
│  ├─ next.svg
│  ├─ vercel.svg
│  └─ window.svg
├─ README.md
├─ schema.sql
├─ scripts
│  └─ seed.ts
├─ store
│  └─ cart.ts
├─ tsconfig.json
└─ types
   └─ index.ts

```