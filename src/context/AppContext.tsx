import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Product, CartItem, User, Filter, SearchState } from '../types';
import { ProductService } from '../services/productService';
import { products } from '../data/products';

interface AppState {
  user: User | null;
  cart: CartItem[];
  wishlist: string[];
  searchState: SearchState;
  isLoading: boolean;
  compareProducts: Product[];
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_TO_WISHLIST'; payload: string }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'SET_SEARCH_STATE'; payload: Partial<SearchState> }
  | { type: 'ADD_TO_COMPARE'; payload: Product }
  | { type: 'REMOVE_FROM_COMPARE'; payload: string }
  | { type: 'CLEAR_COMPARE' }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AppState = {
  user: null,
  cart: [],
  wishlist: [],
  searchState: {
    query: '',
    filters: {},
    results: [],
    loading: false,
    totalResults: 0,
    currentPage: 1,
    totalPages: 1
  },
  isLoading: false,
  compareProducts: []
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({ state: initialState, dispatch: () => null });

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'ADD_TO_CART':
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
      return {
        ...state,
        wishlist: [...state.wishlist, action.payload]
      };
    
    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.filter(id => id !== action.payload)
      };
    
    case 'SET_SEARCH_STATE':
      return {
        ...state,
        searchState: { ...state.searchState, ...action.payload }
      };
    
    case 'ADD_TO_COMPARE':
      if (state.compareProducts.length >= 4) return state;
      return {
        ...state,
        compareProducts: [...state.compareProducts, action.payload]
      };
    
    case 'REMOVE_FROM_COMPARE':
      return {
        ...state,
        compareProducts: state.compareProducts.filter(p => p.id !== action.payload)
      };
    
    case 'CLEAR_COMPARE':
      return { ...state, compareProducts: [] };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // Load products from mock data on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        // Use mock data directly instead of API call
        dispatch({ type: 'SET_SEARCH_STATE', payload: { results: products } });
        dispatch({ type: 'SET_LOADING', payload: false });
      } catch (error) {
        console.error('Error loading products:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    
    loadProducts();
  }, []);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedWishlist = localStorage.getItem('wishlist');
    
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        cartItems.forEach((item: CartItem) => {
          dispatch({ type: 'ADD_TO_CART', payload: { product: item.product, quantity: item.quantity } });
        });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        localStorage.removeItem('cart');
      }
    }
    
    if (savedWishlist) {
      try {
        const wishlistItems = JSON.parse(savedWishlist);
        wishlistItems.forEach((productId: string) => {
          dispatch({ type: 'ADD_TO_WISHLIST', payload: productId });
        });
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
        localStorage.removeItem('wishlist');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.cart));
  }, [state.cart]);

  // Save wishlist to localStorage whenever it changes
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