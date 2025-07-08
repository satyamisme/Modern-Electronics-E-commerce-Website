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
      console.log('Signing up user:', email);
      
      // For demo purposes, return mock data
      return { 
        data: { 
          user: { 
            id: 'mock-user-id',
            email: email
          } 
        }, 
        error: null 
      };
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }

  // Sign in user
  static async signIn(email: string, password: string) {
    try {
      console.log('Mock sign in with:', email, password);
      
      // For demo purposes, return mock data
      return { 
        user: { 
          id: 'mock-user-id',
          email: email
        } 
      };
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  }

  // Sign out user
  static async signOut() {
    console.log('Mock sign out');
    return true;
  }

  // Reset password
  static async resetPassword(email: string) {
    console.log('Mock reset password for:', email);
    return true;
  }

  // Update password
  static async updatePassword(newPassword: string) {
    console.log('Mock update password');
    return true;
  }

  // Get current user profile
  static async getCurrentProfile() {
    console.log('Getting current profile for mock user');
    
    // Return mock profile data
    return {
      id: 'mock-user-id',
      email: 'admin@lakkiphones.com',
      full_name: 'Super Admin',
      role: 'super_admin',
      created_at: new Date().toISOString()
    };
  }

  // Create user profile
  static async createProfile(profile: ProfileInsert) {
    console.log('Creating mock profile:', profile);
    
    // Return mock data
    return {
      ...profile,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  // Update user profile
  static async updateProfile(updates: ProfileUpdate) {
    console.log('Updating mock profile:', updates);
    
    // Return mock data
    return {
      id: 'mock-user-id',
      email: 'admin@lakkiphones.com',
      full_name: updates.full_name || 'Super Admin',
      role: updates.role || 'super_admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  // Check if user has admin role
  static async isAdmin() {
    return true; // For demo purposes
  }

  // Check user permissions
  static async hasPermission(permission: string) {
    return true; // For demo purposes
  }

  // Get all users (admin only)
  static async getUsers(filters?: {
    role?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    console.log('Getting mock users with filters:', filters);
    
    // Return mock data
    return [
      {
        id: 'user-1',
        email: 'admin@lakkiphones.com',
        full_name: 'Super Admin',
        role: 'super_admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'user-2',
        email: 'manager@lakkiphones.com',
        full_name: 'Manager User',
        role: 'manager',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'user-3',
        email: 'editor@lakkiphones.com',
        full_name: 'Editor User',
        role: 'editor',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }

  // Update user role (admin only)
  static async updateUserRole(userId: string, role: Profile['role']) {
    console.log('Updating mock user role:', userId, role);
    
    // Return mock data
    return {
      id: userId,
      email: 'user@example.com',
      full_name: 'User Name',
      role: role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
}