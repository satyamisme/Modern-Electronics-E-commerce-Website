// src/types/index.ts

// Re-exporting from domain-specific type files
export * from './product';
export * from './payment'; // This will export CartItem, Cart, KuwaitAddress, OrderDetails etc.
// Note: OrderDetails from payment.ts can serve as the primary "Order" type.

// General application types that don't strictly fit into product or payment,
// or are widely used across different domains.

export interface Review {
  id: string;
  productId: string | number; // Align with Product['id']
  userId: string;
  userName: string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[]; // URLs of review images
  verifiedPurchase?: boolean;
  createdAt: string | Date;
  updatedAt?: string | Date;
  helpfulVotes?: number;
}

export interface Address { // Generic Address type
  id?: string; // Optional if it's part of a larger object not yet saved
  type?: 'home' | 'work' | 'other';
  recipientName?: string;
  streetAddressLine1: string;
  streetAddressLine2?: string;
  city: string;
  stateOrProvince?: string; // More generic than 'state'
  postalCode: string;
  country: string; // Consider ISO country codes
  isDefaultShipping?: boolean;
  isDefaultBilling?: boolean;
  phone?: string;
}

export interface UserProfile { // More specific than just User for some contexts
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_say';
}

export interface User { // Core user identity and auth-related info
  id: string;
  email: string;
  name?: string; // Optional, might be derived from UserProfile
  avatarUrl?: string;
  emailVerified: boolean;
  roles: string[]; // e.g., ['customer', 'editor'] - ties into Admin roles
  profile?: UserProfile; // Embedded or linked profile data
  addresses?: Address[]; // Array of generic addresses
  // Orders might be fetched separately or be a list of Order IDs/basic summaries
  // orderHistory?: Array<{ orderId: string; date: string; total: number; status: string }>;
  // wishlist?: Array<string | number>; // Array of Product IDs
  createdAt: string | Date;
  updatedAt: string | Date;
}


// UI State or specific component state types can also live here if very generic
// For example, a generic notification type
export interface AppNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  duration?: number; // Auto-dismiss duration in ms
}

// Search and Filter related types - these seem general enough
export interface FilterOption {
  id: string;
  label: string;
  value: string | number | boolean;
  count?: number; // Number of items matching this filter option
}

export interface FilterGroup {
  id: string; // e.g., 'category', 'brand', 'price'
  name: string; // Display name, e.g., "Category", "Brand", "Price Range"
  type: 'select' | 'multiselect' | 'range' | 'boolean';
  options?: FilterOption[]; // For select, multiselect
  rangeMin?: number;
  rangeMax?: number;
  currentValue?: any; // Can be string, string[], [number, number], boolean
}

export interface SearchFilters { // This replaces the old Filter interface
  [key: string]: any; // Allow arbitrary filter keys
  // Example specific filters:
  // categoryId?: string;
  // brandName?: string[];
  // priceMin?: number;
  // priceMax?: number;
  // minRating?: number;
}

export interface SortOption {
  id: string; // e.g., 'price_asc', 'newest'
  label: string; // e.g., "Price: Low to High", "Newest Arrivals"
}

export interface SearchState {
  searchTerm: string;
  appliedFilters: SearchFilters; // Updated from Filter to SearchFilters
  availableFilters?: FilterGroup[]; // Filters derived from current result set
  results: any[]; // Ideally Product[], but could be more generic search result type. product.ts Product type will be used.
  isLoading: boolean;
  totalResults: number;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  sortBy?: SortOption; // Current sort option
  availableSortOptions?: SortOption[];
  error?: string | null;
}

// It's good practice to also export any enums or constant literal types if defined here.
// Example:
// export type UserRole = 'Admin' | 'Editor' | 'Viewer' | 'Customer';
// export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Refunded';