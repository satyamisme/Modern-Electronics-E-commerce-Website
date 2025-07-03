// src/types/product.ts

export interface ProductSpecification {
  name: string;
  value: string;
}

export interface ProductFeature {
  id: string; // Or number
  text: string;
}

export interface ProductTag {
  id: string; // Or number
  name: string;
}

export interface ProductImage {
  id: string; // Or number
  url: string;
  altText?: string;
  isMain?: boolean;
}

export interface Product {
  id: string | number; // Could be string (UUID) or number
  name: string;
  brand?: string;
  category: string; // Or an ID referencing a Category type
  price: number; // Consider storing as smallest currency unit (e.g., fils for KWD)
  originalPrice?: number; // For discounts
  description: string;
  sku?: string; // Stock Keeping Unit
  stock: number;
  images: ProductImage[];
  specifications?: ProductSpecification[];
  features?: ProductFeature[];
  tags?: ProductTag[];
  rating?: number; // Average rating
  reviewCount?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  // Potentially Kuwait-specific fields if they don't fit elsewhere
  // e.g., isKuwaitCompliant?: boolean;
}

export interface Category {
  id: string | number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  // parentCategory?: string | number; // For subcategories
}

// You might also want types for product filters, sorting options, etc.
// export interface ProductFilters {
//   category?: string;
//   brand?: string[];
//   priceMin?: number;
//   priceMax?: number;
//   ratingMin?: number;
//   // ... other filterable attributes
// }

// export type ProductSortOption =
//   | 'price_asc'
//   | 'price_desc'
//   | 'rating_desc'
//   | 'name_asc'
//   | 'newest';
