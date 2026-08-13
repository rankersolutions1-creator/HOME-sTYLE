export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  variantLabel?: string;
  quantity: number;
  stock: number;
}

export interface ProductWithRelations {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  isReadyToShip: boolean;
  isFeatured: boolean;
  isNew: boolean;
  images: { id: string; url: string; alt: string | null }[];
  variants: { id: string; label: string; swatchHex: string | null }[];
  category: { id: string; name: string; slug: string };
}