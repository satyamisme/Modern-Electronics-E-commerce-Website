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
          dispatch({ type: 'SET_PROFILE', payload: null });
        }
      } else {
        dispatch({ type: 'SET_PROFILE', payload: null });
      }
    };

    loadProfile();
  }, [supabaseUser, loading]);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'LOGIN_START' });

    // For demo purposes, allow direct login with hardcoded credentials
    if (credentials.email === 'admin@lakkiphones.com' && credentials.password === 'admin123') {
      const mockUser: AuthUser = {
        id: 'admin-1',
        email: 'admin@lakkiphones.com',
        name: 'Super Admin',
        role: 'super_admin',
        permissions: [],
        lastLogin: new Date(),
        createdAt: new Date('2024-01-01'),
        isActive: true,
        department: undefined
      };
      dispatch({ type: 'LOGIN_SUCCESS', payload: mockUser });
      return;
    }

    if (credentials.email === 'manager@lakkiphones.com' && credentials.password === 'admin123') {
      const mockUser: AuthUser = {
        id: 'manager-1',
        email: 'manager@lakkiphones.com',
        name: 'Manager User',
        role: 'manager',
        permissions: [],
        lastLogin: new Date(),
        createdAt: new Date('2024-01-01'),
        isActive: true,
        department: undefined
      };
      dispatch({ type: 'LOGIN_SUCCESS', payload: mockUser });
      return;
    }

    if (credentials.email === 'editor@lakkiphones.com' && credentials.password === 'admin123') {
      const mockUser: AuthUser = {
        id: 'editor-1',
        email: 'editor@lakkiphones.com',
        name: 'Editor User',
        role: 'editor',
        permissions: [],
        lastLogin: new Date(),
        createdAt: new Date('2024-01-01'),
        isActive: true,
        department: undefined
      };
      dispatch({ type: 'LOGIN_SUCCESS', payload: mockUser });
      return;
    }

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
    
    // For demo purposes, allow all permissions
    return true;
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