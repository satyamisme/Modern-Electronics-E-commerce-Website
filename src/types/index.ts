export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  specifications: Record<string, string>;
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewCount: number;
  features: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  verified: boolean;
  createdAt: Date;
  helpful: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  addresses: Address[];
  orders: Order[];
  wishlist: string[];
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  parent?: string;
  children: Category[];
  productCount: number;
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
}