// src/types/product.ts

export interface ProductSpecification {
  id: string; // Added for keying in lists and potential DB use
  name: string;
  value: string;
}

export interface ProductFeature {
  id: string;
  text: string;
}

export interface ProductTag {
  id: string;
  name: string;
}

export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  isMain?: boolean;
}

export interface Product {
  id: string | number;
  name: string;
  brand?: string;
  category: string; // This could be a Category['id'] or Category['slug']
  price: number; // Store in the smallest currency unit if possible (e.g., fils for KWD)
  originalPrice?: number;
  description: string;
  sku?: string;
  stock: number; // Changed from stockCount, inStock is derived (stock > 0)
  images: ProductImage[];
  specifications?: ProductSpecification[];
  features?: ProductFeature[];
  tags?: ProductTag[];
  rating?: number;
  reviewCount?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface Category {
  id: string | number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  // parentCategory?: string | number;
  productCount?: number; // From original type, kept it
  children?: Category[]; // From original type
}
