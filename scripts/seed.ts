require("dotenv").config();

const { pool } = require("../lib/db");
const bcrypt = require("bcryptjs");

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await pool.query(
    `INSERT INTO admin_users (name, email, password, role)
     VALUES ('Admin', 'admin@homestyle.com.pk', $1, 'ADMIN')
     ON CONFLICT (email) DO NOTHING`,
    [hashedPassword]
  );

  const categories: [string, string, string][] = [
    ["Beds", "beds", "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=800&q=80"],
    ["Sofas", "sofas", "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80"],
    ["Bedroom Chairs", "bedroom-chairs", "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80"],
    ["Media Walls", "media-walls", "https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&w=800&q=80"],
    ["Kids Furniture", "kids-furniture", "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=80"],
    ["Dining Sets", "dining-sets", "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80"],
  ];

  const categoryIds: Record<string, string> = {};
  for (const [name, slug, image] of categories) {
    const res = await pool.query(
      `INSERT INTO categories (name, slug, image) VALUES ($1, $2, $3)
       ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      [name, slug, image]
    );
    categoryIds[slug] = res.rows[0].id;
  }

  const products = [
    {
      name: "Cresta Grand King Size Bed",
      slug: "cresta-grand-king-size-bed",
      description: "A sturdy king-size bed with a modern upholstered headboard.",
      price: 88400,
      compareAtPrice: 110500,
      stock: 12,
      categorySlug: "beds",
      isFeatured: true,
      isNew: true,
      images: ["https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=900&q=80"],
    },
    {
      name: "Alexa Velvet Sofa Chair",
      slug: "alexa-velvet-sofa-chair",
      description: "A plush velvet accent chair, available in multiple colors.",
      price: 43200,
      compareAtPrice: 54000,
      stock: 20,
      categorySlug: "sofas",
      isFeatured: true,
      isNew: true,
      images: ["https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=900&q=80"],
      variants: [
        { label: "Rose Hip Velvet", swatchHex: "#b85c6b" },
        { label: "Winter Blue", swatchHex: "#3a5a80" },
      ],
    },
    {
      name: "Majestic 3-Seater Sofa",
      slug: "majestic-3-seater-sofa",
      description: "A generously sized 3-seater sofa with deep cushioning.",
      price: 97000,
      compareAtPrice: 125000,
      stock: 8,
      categorySlug: "sofas",
      isFeatured: true,
      images: ["https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=900&q=80"],
    },
    {
      name: "Bedroom Accent Chair",
      slug: "bedroom-accent-chair",
      description: "Comfortable and stylish bedroom chair.",
      price: 24500,
      stock: 15,
      categorySlug: "bedroom-chairs",
      isNew: true,
      images: ["https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&w=900&q=80"],
    },
    {
      name: "Modern TV Media Wall",
      slug: "modern-tv-media-wall",
      description: "Upgrade your living room with this modern media wall.",
      price: 68000,
      compareAtPrice: 82000,
      stock: 6,
      categorySlug: "media-walls",
      isFeatured: true,
      images: ["https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80"],
    },
    {
      name: "Colorful Kids Bunk Bed",
      slug: "colorful-kids-bunk-bed",
      description: "Safe and colorful bunk bed for children.",
      price: 52000,
      stock: 10,
      categorySlug: "kids-furniture",
      isNew: true,
      images: ["https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=900&q=80"],
    },
    {
      name: "6-Seater Dining Set",
      slug: "6-seater-dining-set",
      description: "Elegant 6-seater dining table set, solid wood.",
      price: 115000,
      compareAtPrice: 140000,
      stock: 5,
      categorySlug: "dining-sets",
      isFeatured: true,
      images: ["https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=900&q=80"],
    },
    {
      name: "Queen Size Wooden Bed",
      slug: "queen-size-wooden-bed",
      description: "Classic queen-size wooden bed frame.",
      price: 62000,
      stock: 14,
      categorySlug: "beds",
      images: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80"],
    },
  ];

  for (const p of products) {
    const res = await pool.query(
      `INSERT INTO products (name, slug, description, price, compare_at_price, stock, category_id, is_featured, is_new)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (slug) DO NOTHING
       RETURNING id`,
      [
        p.name,
        p.slug,
        p.description,
        p.price,
        p.compareAtPrice ?? null,
        p.stock,
        categoryIds[p.categorySlug],
        p.isFeatured ?? false,
        p.isNew ?? false,
      ]
    );
    if (res.rows.length === 0) continue;
    const productId = res.rows[0].id;

    for (let i = 0; i < p.images.length; i++) {
      await pool.query(
        `INSERT INTO product_images (product_id, url, sort_order) VALUES ($1, $2, $3)`,
        [productId, p.images[i], i]
      );
    }

    if ("variants" in p && p.variants) {
      for (const v of p.variants) {
        await pool.query(
          `INSERT INTO product_variants (product_id, label, swatch_hex, stock) VALUES ($1,$2,$3,10)`,
          [productId, v.label, v.swatchHex]
        );
      }
    }
    console.log(`Seeded: ${p.name}`);
  }

  console.log("\nSeed complete. Admin login: admin@homestyle.com.pk / admin123");
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});