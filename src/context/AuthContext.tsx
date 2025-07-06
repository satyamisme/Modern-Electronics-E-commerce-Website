import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthUser, AuthState, LoginCredentials, Permission } from '../types/auth';
import { AuthService } from '../services/authService';
import { useSupabase } from '../hooks/useSupabase';

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: AuthUser }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_PROFILE'; payload: any };

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
  signUp: (email: string, password: string, userData: any) => Promise<void>;
}>({
  state: initialState,
  dispatch: () => null,
  login: async () => {},
  logout: () => {},
  hasPermission: () => false,
  signUp: async () => {}
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

    case 'SET_PROFILE':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false
      };
    
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { user: supabaseUser, loading } = useSupabase();

  // Load user profile when Supabase user changes
  useEffect(() => {
    const loadProfile = async () => {
      if (supabaseUser) {
        try {
          const profile = await AuthService.getCurrentProfile();
          if (profile) {
            const authUser: AuthUser = {
              id: profile.id,
              email: profile.email,
              name: profile.full_name || '',
              role: profile.role as any,
              permissions: [], // Will be set based on role
              lastLogin: new Date(),
              createdAt: new Date(profile.created_at),
              isActive: true,
              department: undefined
            };
            dispatch({ type: 'SET_PROFILE', payload: authUser });
          }
        } catch (error) {
          console.error('Error loading profile:', error);
          dispatch({ type: 'LOGIN_FAILURE', payload: 'Failed to load user profile' });
        }
      } else {
        dispatch({ type: 'SET_PROFILE', payload: null });
      }
    };

    if (!loading) {
      loadProfile();
    }
  }, [supabaseUser, loading]);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const { user } = await AuthService.signIn(credentials.email, credentials.password);
      
      if (user) {
        const profile = await AuthService.getCurrentProfile();
        if (profile) {
          const authUser: AuthUser = {
            id: profile.id,
            email: profile.email,
            name: profile.full_name || '',
            role: profile.role as any,
            permissions: [], // Will be set based on role
            lastLogin: new Date(),
            createdAt: new Date(profile.created_at),
            isActive: true,
            department: undefined
          };
          dispatch({ type: 'LOGIN_SUCCESS', payload: authUser });
        }
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: (error as Error).message });
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      await AuthService.signUp(email, password, userData);
      // User will be automatically logged in after email verification
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: (error as Error).message });
    }
  };

  const logout = async () => {
    try {
      await AuthService.signOut();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!state.user) return false;
    
    // Super admin has all permissions
    if (state.user.role === 'super_admin') return true;

    // Define role permissions (simplified)
    const rolePermissions: Record<string, Permission[]> = {
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

    const userPermissions = rolePermissions[state.user.role] || [];
    return userPermissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ state, dispatch, login, logout, hasPermission, signUp }}>
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