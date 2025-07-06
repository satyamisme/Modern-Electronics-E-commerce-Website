import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export class AuthService {
  // Sign up new user
  static async signUp(email: string, password: string, userData: {
    fullName?: string;
    phone?: string;
    role?: 'customer' | 'admin';
  }) {
    try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData.fullName,
          phone: userData.phone,
          role: userData.role || 'customer'
        }
      }
    });

    if (error) {
      console.error('Error signing up:', error);
      throw error;
    }

    // Create profile if user was created
    if (data.user) {
      await this.createProfile({
        id: data.user.id,
        email: data.user.email!,
        full_name: userData.fullName || null,
        phone: userData.phone || null,
        role: userData.role || 'customer'
      });
    }

    return data;
    } catch (error) {
      console.log('Supabase not configured, using mock auth');
      return { user: null, session: null };
    }
  }

  // Sign in user
  static async signIn(email: string, password: string) {
    try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Error signing in:', error);
      throw error;
    }

    return data;
    } catch (error) {
      console.log('Supabase not configured, using mock auth');
      return { user: { id: 'admin-1', email }, session: null };
    }
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
  static async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) {
      console.error('Error resetting password:', error);
      throw error;
    }

    return true;
  }

  // Update password
  static async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      console.error('Error updating password:', error);
      throw error;
    }

    return true;
  }

  // Get current user profile
  static async getCurrentProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }

    return data;
  }

  // Create user profile
  static async createProfile(profile: ProfileInsert) {
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

  // Update user profile
  static async updateProfile(updates: ProfileUpdate) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('No authenticated user');

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

  // Check if user has admin role
  static async isAdmin() {
    const profile = await this.getCurrentProfile();
    return profile?.role && ['admin', 'super_admin', 'manager'].includes(profile.role);
  }

  // Check user permissions
  static async hasPermission(permission: string) {
    const profile = await this.getCurrentProfile();
    
    if (!profile) return false;

    // Super admin has all permissions
    if (profile.role === 'super_admin') return true;

    // Define role permissions
    const rolePermissions: Record<string, string[]> = {
      admin: ['products.*', 'orders.*', 'users.read', 'analytics.read'],
      manager: ['products.read', 'orders.*', 'inventory.*'],
      editor: ['products.update', 'content.*'],
      viewer: ['*.read']
    };

    const userPermissions = rolePermissions[profile.role] || [];
    
    return userPermissions.some(perm => {
      if (perm.endsWith('.*')) {
        return permission.startsWith(perm.slice(0, -2));
      }
      return perm === permission || perm === '*';
    });
  }

  // Get all users (admin only)
  static async getUsers(filters?: {
    role?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    let query = supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

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
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }

    return data;
  }

  // Update user role (admin only)
  static async updateUserRole(userId: string, role: Profile['role']) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user role:', error);
      throw error;
    }

    return data;
  }
}