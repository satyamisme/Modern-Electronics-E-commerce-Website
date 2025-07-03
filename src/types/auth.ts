export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  avatar?: string;
  permissions: Permission[];
  lastLogin: Date;
  createdAt: Date;
  isActive: boolean;
  department?: string;
}

export type AdminRole = 'super_admin' | 'admin' | 'manager' | 'editor' | 'viewer';

export type Permission = 
  | 'products.create'
  | 'products.read'
  | 'products.update'
  | 'products.delete'
  | 'orders.read'
  | 'orders.update'
  | 'orders.delete'
  | 'users.create'
  | 'users.read'
  | 'users.update'
  | 'users.delete'
  | 'analytics.read'
  | 'settings.read'
  | 'settings.update';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  super_admin: [
    'products.create', 'products.read', 'products.update', 'products.delete',
    'orders.read', 'orders.update', 'orders.delete',
    'users.create', 'users.read', 'users.update', 'users.delete',
    'analytics.read', 'settings.read', 'settings.update'
  ],
  admin: [
    'products.create', 'products.read', 'products.update', 'products.delete',
    'orders.read', 'orders.update', 'orders.delete',
    'users.read', 'users.update',
    'analytics.read', 'settings.read'
  ],
  manager: [
    'products.read', 'products.update',
    'orders.read', 'orders.update',
    'users.read',
    'analytics.read'
  ],
  editor: [
    'products.create', 'products.read', 'products.update',
    'orders.read'
  ],
  viewer: [
    'products.read',
    'orders.read',
    'analytics.read'
  ]
};