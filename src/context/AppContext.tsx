import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Product, CartItem, User, Filter, SearchState, Category } from '../types'; // Added Category
import { ProductService } from '../services/productService';

interface AppState {
  user: User | null; // This User type is from src/types, not Supabase User or AuthUser
  cart: CartItem[];
  wishlist: string[]; // Array of product IDs
  searchState: SearchState;
  categories: Category[]; // Added categories to app state
  isLoading: boolean; // General loading for app-wide actions
  compareProducts: Product[]; // Max 4 products for comparison
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string } // productId
  | { type: 'UPDATE_CART_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_TO_WISHLIST'; payload: string } // productId
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string } // productId
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SEARCH_FILTERS'; payload: Partial<Filter> } // Allow partial filter updates
  | { type: 'SET_SEARCH_RESULTS'; payload: { products: Product[]; total: number; page: number; limit: number; } }
  | { type: 'SET_SEARCH_LOADING'; payload: boolean }
  | { type: 'ADD_TO_COMPARE'; payload: Product }
  | { type: 'REMOVE_FROM_COMPARE'; payload: string } // productId
  | { type: 'CLEAR_COMPARE' }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AppState = {
  user: null,
  cart: [],
  wishlist: [],
  searchState: {
    query: '',
    filters: { limit: 12, offset: 0 }, // Default filters including pagination
    results: [], // Initial search results
    loading: true, // Search specific loading, start true for initial load
    totalResults: 0,
    currentPage: 1,
    totalPages: 1,
  },
  categories: [],
  isLoading: true, // App loading initially true until products/categories are fetched
  compareProducts: [],
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({ state: initialState, dispatch: () => null });

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'ADD_TO_CART': {
      const existingItem = state.cart.find(item => item.product.id === action.payload.product.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.product.id === action.payload.product.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      }
      return {
        ...state,
        cart: [...state.cart, { product: action.payload.product, quantity: action.payload.quantity }]
      };
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.product.id !== action.payload)
      };
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.product.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'ADD_TO_WISHLIST':
      if (state.wishlist.includes(action.payload)) return state;
      return { ...state, wishlist: [...state.wishlist, action.payload] };
    case 'REMOVE_FROM_WISHLIST':
      return { ...state, wishlist: state.wishlist.filter(id => id !== action.payload) };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchState: { ...state.searchState, query: action.payload, currentPage: 1, filters: {...state.searchState.filters, offset: 0} } };
    case 'SET_SEARCH_FILTERS':
      return { ...state, searchState: { ...state.searchState, filters: { ...state.searchState.filters, ...action.payload, offset:0 }, currentPage: 1 } };
    case 'SET_SEARCH_RESULTS':
      return {
        ...state,
        searchState: {
          ...state.searchState,
          results: action.payload.products,
          totalResults: action.payload.total,
          currentPage: action.payload.page,
          totalPages: action.payload.limit > 0 ? Math.ceil(action.payload.total / action.payload.limit) : 1,
          loading: false,
        },
      };
    case 'SET_SEARCH_LOADING':
      return { ...state, searchState: { ...state.searchState, loading: action.payload } };
    case 'ADD_TO_COMPARE':
      if (state.compareProducts.length >= 4 || state.compareProducts.find(p => p.id === action.payload.id)) return state;
      return { ...state, compareProducts: [...state.compareProducts, action.payload] };
    case 'REMOVE_FROM_COMPARE':
      return { ...state, compareProducts: state.compareProducts.filter(p => p.id !== action.payload) };
    case 'CLEAR_COMPARE':
      return { ...state, compareProducts: [] };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  useEffect(() => {
    const loadInitialData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_SEARCH_LOADING', payload: true });
      try {
        const initialLimit = state.searchState.filters.limit || 12;
        // ProductService.getProducts now returns { products: Product[], total: number }
        const { products: productsData, total: totalProducts } = await ProductService.getProducts({
            limit: initialLimit,
            offset: 0
        });

        dispatch({
          type: 'SET_SEARCH_RESULTS',
          payload: { products: productsData, total: totalProducts, page: 1, limit: initialLimit }
        });

        const categoriesData = await ProductService.getCategories();
        dispatch({ type: 'SET_CATEGORIES', payload: categoriesData });

      } catch (error) {
        console.error('AppContext: Error loading initial app data:', error);
        // Optionally dispatch an error action to update state.error
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
        dispatch({ type: 'SET_SEARCH_LOADING', payload: false });
      }
    };
    
    loadInitialData();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartItems: CartItem[] = JSON.parse(savedCart);
        // Basic validation for cart items might be good here
        if (Array.isArray(cartItems)) {
            cartItems.forEach((item: CartItem) => {
             if(item.product && typeof item.quantity === 'number') {
                dispatch({ type: 'ADD_TO_CART', payload: { product: item.product, quantity: item.quantity } });
             }
            });
        }
      } catch (error) {
        console.error('AppContext: Error loading cart from localStorage:', error);
        localStorage.removeItem('cart');
      }
    }
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        const wishlistItems: string[] = JSON.parse(savedWishlist);
        if (Array.isArray(wishlistItems)) {
            wishlistItems.forEach((productId: string) => {
              if(typeof productId === 'string') {
                dispatch({ type: 'ADD_TO_WISHLIST', payload: productId });
              }
            });
        }
      } catch (error) {
        console.error('AppContext: Error loading wishlist from localStorage:', error);
        localStorage.removeItem('wishlist');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.cart));
  }, [state.cart]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
  }, [state.wishlist]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}