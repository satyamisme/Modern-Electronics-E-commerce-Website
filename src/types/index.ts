// src/types/index.ts

// Re-exporting from domain-specific type files
export * from './product';
export * from './payment';
// OrderDetails from payment.ts can serve as the primary "Order" type.
// The CartItem from payment.ts is also now the primary one.

// General application types
export interface Review {
  id: string;
  productId: string | number;
  userId: string;
  userName: string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  verifiedPurchase?: boolean;
  createdAt: string | Date;
  updatedAt?: string | Date;
  helpfulVotes?: number;
}

export interface Address { // Generic Address type, KuwaitAddress is in payment.ts for specific needs
  id?: string;
  type?: 'home' | 'work' | 'other';
  recipientName?: string;
  streetAddressLine1: string;
  streetAddressLine2?: string;
  city: string;
  stateOrProvince?: string;
  postalCode: string;
  country: string;
  isDefaultShipping?: boolean;
  isDefaultBilling?: boolean;
  phone?: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_say';
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  emailVerified: boolean;
  roles: string[];
  profile?: UserProfile;
  addresses?: Address[];
  // orderHistory can be fetched or use OrderDetails[] from payment.ts
  // wishlist can be string[] of Product['id']
  wishlist?: Array<Product['id']>;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface AppNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  duration?: number;
}

export interface FilterOption {
  id: string;
  label: string;
  value: string | number | boolean;
  count?: number;
}

export interface FilterGroup {
  id: string;
  name: string;
  type: 'select' | 'multiselect' | 'range' | 'boolean';
  options?: FilterOption[];
  rangeMin?: number;
  rangeMax?: number;
  currentValue?: any;
}

export interface SearchFilters {
  [key: string]: any;
  // categoryId?: string;
  // brandName?: string[];
  // priceMin?: number;
  // priceMax?: number;
  // minRating?: number;
}

export interface SortOption {
  id: string;
  label: string;
}

export interface SearchState {
  searchTerm: string;
  appliedFilters: SearchFilters;
  availableFilters?: FilterGroup[];
  results: Product[]; // Uses the new Product type from product.ts
  isLoading: boolean;
  totalResults: number;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  sortBy?: SortOption;
  availableSortOptions?: SortOption[];
  error?: string | null;
}

// Enums / Literal Types
export type UserRole = 'Super Admin' | 'Admin' | 'Manager' | 'Editor' | 'Viewer' | 'Customer';
export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Refunded';