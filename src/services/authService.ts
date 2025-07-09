import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

import type { SignUpWithPasswordCredentials, SignInWithPasswordCredentials, User } from '@supabase/supabase-js';

export class AuthService {
  // Sign up new user - this typically involves Supabase auth and then creating a profile
  static async signUp(credentials: SignUpWithPasswordCredentials, profileData: Omit<ProfileInsert, 'id' | 'email'>) {
    const { data: authData, error: authError } = await supabase.auth.signUp(credentials);

    if (authError) {
      console.error('Error signing up (auth):', authError);
      throw authError;
    }
    if (!authData.user) {
      throw new Error('User not created after sign up.');
    }

    // Create profile for the new user
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: authData.user.email!, // Email should exist on user object after successful signup
        ...profileData
      });

    if (profileError) {
      console.error('Error creating profile after sign up:', profileError);
      // Potentially handle user deletion from auth if profile creation fails, or mark for cleanup
      throw profileError;
    }
    return { authData, profileData };
  }

  // Sign in user - Supabase auth handles this, profile is fetched separately if needed
  static async signIn(credentials: SignInWithPasswordCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    if (error) {
      console.error('Error signing in:', error);
      throw error;
    }
    return data;
  }

  // Sign out user
  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
    return true;
  }

  // Reset password
  static async resetPassword(email: string, options?: { redirectTo?: string }) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, options);
    if (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
    return data;
  }

  // Update password for the currently logged-in user
  static async updatePassword(newPassword: string) {
     const { data, error } = await supabase.auth.updateUser({ password: newPassword });
     if (error) {
        console.error('Error updating password:', error);
        throw error;
     }
     return data;
  }

  // Get current user's Supabase auth User object
  static async getCurrentAuthUser(): Promise<User | null> {
    const { data: { user } , error } = await supabase.auth.getUser();
    if (error) {
        console.error('Error fetching current auth user:', error);
        // Depending on policy, you might want to throw error or return null
        return null;
    }
    return user;
  }


  // Get current user profile from 'profiles' table
  static async getCurrentProfile(): Promise<Profile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching current profile:', error);
      // Do not throw error here, as a missing profile might be a valid state post-signup before profile creation
      return null;
    }
    return profile;
  }

  // Create user profile (typically used if signup doesn't create one, or for admin creation)
  // Ensure `id` and `email` in `profile` match an existing auth user or are new.
  static async createProfile(profile: ProfileInsert): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
    return data;
  }

  // Update user profile for the currently logged-in user
  static async updateProfile(updates: ProfileUpdate): Promise<Profile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated to update profile.');

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
    return data;
  }

  // Update any user's profile (admin only)
  static async updateUserProfileById(userId: string, updates: ProfileUpdate): Promise<Profile | null> {
    // Add permission check here if this is admin-only
    // e.g., const isAdmin = await this.isAdmin(); if (!isAdmin) throw new Error('Permission denied');
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error(`Error updating profile for user ${userId}:`, error);
      throw error;
    }
    return data;
  }


  // Check if current user has a specific role (e.g., 'admin', 'super_admin')
  static async hasRole(roleName: Profile['role']): Promise<boolean> {
    const profile = await this.getCurrentProfile();
    return profile?.role === roleName;
  }

  // Example: Check if user is any kind of admin
  static async isAdmin(): Promise<boolean> {
    const profile = await this.getCurrentProfile();
    return profile?.role === 'admin' || profile?.role === 'super_admin';
  }

  // Placeholder for a more complex permission system if needed
  // This would likely involve a separate 'permissions' or 'role_permissions' table
  static async hasPermission(permissionKey: string): Promise<boolean> {
    const profile = await this.getCurrentProfile();
    if (!profile) return false;

    // Simple role-based permission mapping (example)
    const permissionsByRole: Record<Profile['role'], string[]> = {
      customer: ['orders.read_own', 'profile.update_own'],
      editor: ['products.read', 'products.update', 'orders.read_own', 'profile.update_own'],
      manager: ['products.read', 'products.update', 'orders.read', 'orders.update', 'users.read', 'profile.update_own'],
      admin: ['products.*', 'orders.*', 'users.*', 'settings.read', 'analytics.read', 'profile.update_own'],
      super_admin: ['*'], // Wildcard for all permissions
      viewer: ['*.read', 'profile.update_own'],
    };

    const userPermissions = permissionsByRole[profile.role] || [];

    if (userPermissions.includes('*')) return true; // Super admin has all permissions
    if (userPermissions.includes(permissionKey)) return true;

    // Handle wildcard permissions like 'products.*'
    const mainPermission = permissionKey.split('.')[0];
    if (userPermissions.includes(`${mainPermission}.*`)) return true;

    return false;
  }

  // Get all users (admin only)
  static async getUsers(filters?: {
    role?: Profile['role'];
    search?: string;
    limit?: number;
    offset?: number;
    sortBy?: string;
    ascending?: boolean;
  }): Promise<Profile[]> {
    // Add permission check here: e.g. if (!await this.hasPermission('users.read')) throw new Error('Permission Denied');
    
    let query = supabase.from('profiles').select('*');

    if (filters?.role) {
      query = query.eq('role', filters.role);
    }
    if (filters?.search) {
      query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.range(filters.offset, (filters.offset + (filters.limit || 10)) -1 );
    }
    if (filters?.sortBy) {
      query = query.order(filters.sortBy as keyof Profile, { ascending: filters.ascending !== undefined ? filters.ascending : true });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
    return data || [];
  }

  // Update user role (admin only)
  static async updateUserRole(userId: string, role: Profile['role']): Promise<Profile | null> {
    // Add permission check here: e.g. if (!await this.hasPermission('users.update_role')) throw new Error('Permission Denied');
    const { data, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error(`Error updating role for user ${userId}:`, error);
      throw error;
    }
    return data;
  }

  // Delete a user's profile (admin only, auth user must be deleted separately)
  static async deleteUserProfile(userId: string): Promise<void> {
    // Add permission check here
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);
    if (error) {
      console.error(`Error deleting profile for user ${userId}:`, error);
      throw error;
    }
    // Note: Deleting the Supabase Auth user is a separate, protected operation,
    // usually done via a server-side admin client or edge function.
    // supabase.auth.admin.deleteUser(userId) would be used if this service ran with admin privileges.
  }
}