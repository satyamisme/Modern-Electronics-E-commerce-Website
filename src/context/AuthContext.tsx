import React, { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import { AuthUser, AuthState, LoginCredentials, Permission, SignUpData } from '../types/auth';
import { AuthService } from '../services/authService';
import { useSupabase } from '../hooks/useSupabase'; // Will use the real one now

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'SET_USER_PROFILE'; payload: AuthUser | null } // Changed from LOGIN_SUCCESS and SET_PROFILE
  | { type: 'AUTH_ERROR'; payload: string } // Changed from LOGIN_FAILURE
  | { type: 'LOGOUT_SUCCESS' } // Changed from LOGOUT
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading true until Supabase auth state is checked
  error: null,
};

const AuthContext = createContext<{
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  signUp: (signUpData: SignUpData) => Promise<void>;
  hasPermission: (permission: Permission) => boolean;
  clearError: () => void;
}>({
  state: initialState,
  login: async () => {},
  logout: async () => {},
  signUp: async () => {},
  hasPermission: () => false,
  clearError: () => {},
});

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    case 'SET_USER_PROFILE':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT_SUCCESS':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { user: supabaseUser, session, loading: supabaseLoading, signIn: supabaseSignIn, signOut: supabaseSignOut, signUp: supabaseSignUp } = useSupabase();

  const fetchAndSetUserProfile = useCallback(async () => {
    if (supabaseUser && session) {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const profile = await AuthService.getCurrentProfile(); // This uses supabase.auth.getUser() internally
        if (profile) {
          // TODO: Fetch actual permissions based on role from AuthService or a dedicated PermissionService
          // For now, permissions array will be empty or use a default set based on role.
          const permissions = await AuthService.hasPermission(`${profile.role}.*`) ? [`${profile.role}.*`] : [];

          const authUser: AuthUser = {
            id: profile.id,
            email: profile.email, // email from profile table
            name: profile.full_name || '',
            role: profile.role as AuthUser['role'], // Cast to ensure type alignment
            permissions, // This should be populated based on the role
            lastLogin: supabaseUser.last_sign_in_at ? new Date(supabaseUser.last_sign_in_at) : new Date(),
            createdAt: new Date(profile.created_at),
            isActive: true, // Assuming active, or fetch this from profile if available
            // department: profile.department, // If department is part of your Profile type
          };
          dispatch({ type: 'SET_USER_PROFILE', payload: authUser });
        } else {
          // This case might happen if a user exists in Supabase auth but not in profiles table (e.g., incomplete signup)
          console.warn(`Profile not found for authenticated user ${supabaseUser.id}. Logging out.`);
          await AuthService.signOut(); // This will trigger onAuthStateChange, leading to LOGOUT_SUCCESS
          dispatch({ type: 'SET_USER_PROFILE', payload: null });
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        dispatch({ type: 'AUTH_ERROR', payload: (error as Error).message });
        // Potentially sign out the user if profile load fails critically
        await AuthService.signOut();
      }
    } else {
      dispatch({ type: 'SET_USER_PROFILE', payload: null });
    }
  }, [supabaseUser, session]);


  useEffect(() => {
    if (!supabaseLoading) { // Only act once Supabase hook has initialized
      fetchAndSetUserProfile();
    } else {
      dispatch({ type: 'SET_LOADING', payload: true });
    }
  }, [supabaseUser, session, supabaseLoading, fetchAndSetUserProfile]);


  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      // useSupabase's signIn will trigger onAuthStateChange, which then calls fetchAndSetUserProfile
      const { error } = await supabaseSignIn({ email: credentials.email, password: credentials.password });
      if (error) {
        throw error;
      }
      // Profile will be set by the useEffect listening to supabaseUser changes
    } catch (error: any) {
      dispatch({ type: 'AUTH_ERROR', payload: error.message || 'Failed to login' });
    }
  };

  const signUp = async (signUpData: SignUpData) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const { email, password, fullName, phone, role = 'customer' } = signUpData;
      // Supabase user creation
      const { data: authData, error: authError } = await supabaseSignUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName, // Optional: pass metadata to Supabase Auth user
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("User registration failed in Supabase Auth.");

      // Profile creation in 'profiles' table
      await AuthService.createProfile({
        id: authData.user.id,
        email: email,
        full_name: fullName,
        phone: phone,
        role: role,
      });

      // After successful signup and profile creation, Supabase onAuthStateChange
      // will handle setting the user profile in the context.
      // If email confirmation is required, user won't be set until confirmed.
      // You might want to dispatch a success message or redirect here.

    } catch (error: any) {
      dispatch({ type: 'AUTH_ERROR', payload: error.message || 'Failed to sign up' });
    }
  };

  const logout = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await supabaseSignOut();
      // onAuthStateChange in useSupabase will set user to null, then
      // useEffect here will dispatch SET_USER_PROFILE with null
      dispatch({ type: 'LOGOUT_SUCCESS' }); // Explicitly update state
    } catch (error: any) {
      dispatch({ type: 'AUTH_ERROR', payload: error.message || 'Failed to logout' });
    }
  };

  const hasPermission = useCallback((permission: Permission): boolean => {
    if (!state.user || !state.isAuthenticated) return false;
    if (state.user.role === 'super_admin') return true; // Super admin has all permissions

    // Check direct permissions if they are stored on the AuthUser object
    if (state.user.permissions?.includes(permission)) {
      return true;
    }
    // Check wildcard permissions like 'products.*'
    const mainPermissionArea = permission.split('.')[0];
    if (state.user.permissions?.includes(`${mainPermissionArea}.*`)) {
      return true;
    }

    // Fallback to checking against AuthService if permissions are not directly on user object
    // This might be too slow for frequent checks, consider caching permissions on AuthUser
    // For now, this is a conceptual placeholder for a more robust permission check.
    // The actual permissions should be loaded into state.user.permissions.
    // const checkPermissionViaService = async () => {
    //   return await AuthService.hasPermission(permission);
    // };
    // For synchronous context function, we rely on state.user.permissions
    
    console.warn(`Permission check for '${permission}' on user '${state.user.email}' (role: ${state.user.role}) resulted in denial. User permissions: ${state.user.permissions?.join(', ')}`);
    return false;
  }, [state.user, state.isAuthenticated]);

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider value={{ state, login, logout, signUp, hasPermission, clearError }}>
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