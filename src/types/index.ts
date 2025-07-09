// Re-defining Product types to align with Supabase schema and src/types/product.ts for consistency
export interface ProductImage {
  id?: string; // May not always have from DB if just URL
  url: string;
  altText?: string;
  isPrimary?: boolean;
  sortOrder?: number;
}

export interface ProductSpecification {
  // Using a Record<string, string> for simplicity as per original Product type and Supabase JSONB
  // If more structure is needed later, can adopt {id, name, value} from src/types/product.ts
  [key: string]: string;
}

export interface Product {
  id: string; // UUID from Supabase
  name: string;
  slug?: string; // From Supabase schema
  brand?: string | null; // From Supabase schema
  categoryId?: string | null; // Foreign key to categories table
  categoryName?: string; // Denormalized or joined from categories table
  categorySlug?: string; // Denormalized or joined from categories table
  price: number;
  originalPrice?: number | null;
  description?: string | null;
  sku?: string | null;
  stockCount: number; // from stock_count
  isActive?: boolean; // from is_active
  get inStock(): boolean; // Derived property
  images: ProductImage[]; // From product_images table
  specifications?: ProductSpecification | null; // JSONB in Supabase
  features?: string[] | null; // text[] in Supabase
  tags?: string[] | null; // text[] in Supabase
  rating?: number | null;
  reviewCount?: number | null;
  createdAt: string | Date; // timestamp with time zone in Supabase
  updatedAt: string | Date; // timestamp with time zone in Supabase
}

// Derived property for inStock
Object.defineProperty(Product.prototype, 'inStock', {
  get: function() {
    return this.stockCount > 0 && this.isActive;
  }
});


export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string; // Keep if variants are a feature
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string; // May need to join with profiles table or store denormalized
  rating: number;
  title?: string | null;
  comment?: string | null;
  images?: string[] | null; // Assuming array of URLs
  isVerified?: boolean;
  isApproved?: boolean;
  createdAt: string | Date;
  helpfulCount?: number;
}

export interface User { // This is distinct from AuthUser and Supabase User. This is app-level.
  id: string; // Usually matches Supabase auth user ID
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
  phone?: string | null;
  addresses?: Address[]; // Assuming Address type is defined
  // orders: Order[]; // Might be too heavy, fetch on demand
  wishlistProductIds?: string[]; // List of product IDs
}

export interface Address {
  id: string;
  userId: string;
  type: 'home' | 'work' | 'other';
  governorate: string; // Specific to Kuwait
  area: string;
  block: string;
  street: string;
  building: string;
  floor?: string | null;
  apartment?: string | null;
  additionalInfo?: string | null;
  phone?: string | null;
  isDefault?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface OrderItem { // Based on Supabase order_items
  id: string;
  orderId: string;
  productId?: string | null;
  productName: string; // Denormalized
  productSku?: string | null;
  quantity: number;
  unitPrice: number; // At the time of purchase
  totalPrice: number;
  // Potentially add product image URL here for cart/order display
}

export interface Order { // Based on Supabase orders table
  id: string;
  userId?: string | null; // Link to user profile
  orderNumber: string; // Auto-generated or from Supabase
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  subtotal: number;
  shippingCost: number;
  taxAmount: number; // Usually 0 for Kuwait
  discountAmount: number;
  totalAmount: number;
  currency: 'KWD';
  paymentMethod?: string | null;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentTransactionId?: string | null;
  shippingAddress: Address; // Could be stored as JSONB or reference to addresses table
  billingAddress?: Address; // Could be stored as JSONB or reference to addresses table
  customerNotes?: string | null;
  adminNotes?: string | null;
  trackingNumber?: string | null;
  shippedAt?: string | Date | null;
  deliveredAt?: string | Date | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  orderItems: OrderItem[]; // Fetched as related records
}


export interface Category {
  id: string; // UUID from Supabase
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null; // from image_url
  parentId?: string | null; // from parent_id
  // children: Category[]; // This would require recursive fetching or specific query logic
  productCount?: number; // This would be a calculated field or fetched separately
  isActive?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface Filter {
  category?: string;
  brand?: string[];
  priceRange?: [number, number];
  inStock?: boolean;
  rating?: number;
  features?: string[];
  sortBy?: 'price' | 'rating' | 'newest' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchState {
  query: string;
  filters: Filter;
  results: Product[];
  loading: boolean;
  totalResults: number;
  currentPage: number;
  totalPages: number;
  error?: string;
}