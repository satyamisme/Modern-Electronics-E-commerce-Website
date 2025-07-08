import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AdminUser, ProductFormData, OrderManagement, InventoryAlert, SalesAnalytics } from '../types/admin';
import { Product } from '../types';
import { ProductService } from '../services/productService';

interface AdminState {
  currentUser: AdminUser | null;
  products: Product[];
  orders: OrderManagement[];
  inventoryAlerts: InventoryAlert[];
  analytics: SalesAnalytics | null;
  isLoading: boolean;
  selectedProduct: Product | null;
  editMode: boolean;
}

type AdminAction =
  | { type: 'SET_ADMIN_USER'; payload: AdminUser | null }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'SET_ORDERS'; payload: OrderManagement[] }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: string } }
  | { type: 'SET_INVENTORY_ALERTS'; payload: InventoryAlert[] }
  | { type: 'SET_ANALYTICS'; payload: SalesAnalytics }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SELECTED_PRODUCT'; payload: Product | null }
  | { type: 'SET_EDIT_MODE'; payload: boolean };

const initialState: AdminState = {
  currentUser: null,
  products: [],
  orders: [],
  inventoryAlerts: [],
  analytics: null,
  isLoading: false,
  selectedProduct: null,
  editMode: false
};

const AdminContext = createContext<{
  state: AdminState;
  dispatch: React.Dispatch<AdminAction>;
}>({ state: initialState, dispatch: () => null });

function adminReducer(state: AdminState, action: AdminAction): AdminState {
  switch (action.type) {
    case 'SET_ADMIN_USER':
      return { ...state, currentUser: action.payload };
    
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.id ? action.payload : product
        )
      };
    
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(product => product.id !== action.payload)
      };
    
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? { ...order, status: action.payload.status as any }
            : order
        )
      };
    
    case 'SET_INVENTORY_ALERTS':
      return { ...state, inventoryAlerts: action.payload };
    
    case 'SET_ANALYTICS':
      return { ...state, analytics: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_SELECTED_PRODUCT':
      return { ...state, selectedProduct: action.payload };
    
    case 'SET_EDIT_MODE':
      return { ...state, editMode: action.payload };
    
    default:
      return state;
  }
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(adminReducer, initialState);
  
  // Load products from API on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await ProductService.getProducts();
        if (products) {
          dispatch({ type: 'SET_PRODUCTS', payload: products });
        }
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };
    
    loadProducts();
  }, []);

  // Mock admin user login
  useEffect(() => {
    const mockAdmin: AdminUser = {
      id: 'admin-123',
      email: 'admin@lakkiphones.com',
      name: 'Super Admin',
      role: 'super_admin',
      permissions: ['products', 'orders', 'analytics', 'users', 'settings'],
      lastLogin: new Date(),
      createdAt: new Date('2024-01-01')
    };
    dispatch({ type: 'SET_ADMIN_USER', payload: mockAdmin });
  }, []);

  return (
    <AdminContext.Provider value={{ state, dispatch }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}