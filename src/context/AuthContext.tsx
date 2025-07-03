import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthUser, AuthState, LoginCredentials, Permission, ROLE_PERMISSIONS } from '../types/auth';

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: AuthUser }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
}>({
  state: initialState,
  dispatch: () => null,
  login: async () => {},
  logout: () => {},
  hasPermission: () => false
});

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        error: null
      };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    default:
      return state;
  }
}

// Mock users database
const MOCK_USERS: AuthUser[] = [
  {
    id: 'user-1',
    email: 'admin@techstore.com',
    name: 'Super Admin',
    role: 'super_admin',
    permissions: ROLE_PERMISSIONS.super_admin,
    lastLogin: new Date(),
    createdAt: new Date('2024-01-01'),
    isActive: true,
    department: 'IT'
  },
  {
    id: 'user-2',
    email: 'manager@techstore.com',
    name: 'Store Manager',
    role: 'manager',
    permissions: ROLE_PERMISSIONS.manager,
    lastLogin: new Date(),
    createdAt: new Date('2024-01-01'),
    isActive: true,
    department: 'Operations'
  },
  {
    id: 'user-3',
    email: 'editor@techstore.com',
    name: 'Content Editor',
    role: 'editor',
    permissions: ROLE_PERMISSIONS.editor,
    lastLogin: new Date(),
    createdAt: new Date('2024-01-01'),
    isActive: true,
    department: 'Marketing'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('admin_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch (error) {
        localStorage.removeItem('admin_user');
      }
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user = MOCK_USERS.find(u => u.email === credentials.email);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }

      if (!user.isActive) {
        throw new Error('Account is deactivated');
      }

      // In real app, verify password hash
      if (credentials.password !== 'admin123') {
        throw new Error('Invalid email or password');
      }

      const updatedUser = { ...user, lastLogin: new Date() };
      localStorage.setItem('admin_user', JSON.stringify(updatedUser));
      dispatch({ type: 'LOGIN_SUCCESS', payload: updatedUser });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: (error as Error).message });
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_user');
    dispatch({ type: 'LOGOUT' });
  };

  const hasPermission = (permission: Permission): boolean => {
    return state.user?.permissions.includes(permission) || false;
  };

  return (
    <AuthContext.Provider value={{ state, dispatch, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}