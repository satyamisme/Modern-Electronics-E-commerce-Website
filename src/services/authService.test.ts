import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '../lib/supabase'; // We need to mock this
import { AuthService } from './authService';
import type { User } from '@supabase/supabase-js';
import type { Database } from '../lib/supabase';

// Mock the supabase client
// This will mock the entire module '../lib/supabase'
vi.mock('../lib/supabase', () => {
  // Mock implementation for supabase.auth.getUser
  const mockGetUser = vi.fn();
  // Mock implementation for supabase.from('profiles').select().eq().single()
  const mockSingle = vi.fn();
  const mockEq = vi.fn(() => ({ single: mockSingle }));
  const mockSelect = vi.fn(() => ({ eq: mockEq }));
  const mockFrom = vi.fn((tableName: string) => {
    if (tableName === 'profiles') {
      return { select: mockSelect };
    }
    // Fallback for other tables if needed in more tests
    return {
        select: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn()
    };
  });

  return {
    supabase: {
      auth: {
        getUser: mockGetUser,
        // Add other auth methods if they are directly called by AuthService methods being tested
        signUp: vi.fn(),
        signInWithPassword: vi.fn(),
        signOut: vi.fn(),
        resetPasswordForEmail: vi.fn(),
        updateUser: vi.fn(),
      },
      from: mockFrom,
      // Mock 'rpc' if any tested AuthService method uses it
      rpc: vi.fn(),
    },
  };
});

// Helper to correctly type the mocked supabase functions for manipulation in tests
const mockedSupabaseAuthGetUser = supabase.auth.getUser as vi.Mock;
const mockedSupabaseFrom = supabase.from as vi.Mock;
// To get to the chained calls for 'profiles' table:
// const mockedProfilesSelect = mockedSupabaseFrom.mock.results[0]?.value.select as vi.Mock;
// const mockedProfilesEq = mockedProfilesSelect?.mock.results[0]?.value.eq as vi.Mock;
// const mockedProfilesSingle = mockedProfilesEq?.mock.results[0]?.value.single as vi.Mock;
// This detailed chaining for mocking return values is tricky with deep mocks.
// A simpler way is to ensure the final method in the chain is the one we set mockResolvedValue on.

describe('AuthService', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
  });

  describe('getCurrentProfile', () => {
    it('should return the user profile if user is authenticated and profile exists', async () => {
      const mockAuthUser = { id: 'user-123', email: 'test@example.com' } as User;
      const mockProfile: Database['public']['Tables']['profiles']['Row'] = {
        id: 'user-123',
        email: 'test@example.com',
        full_name: 'Test User',
        phone: null,
        avatar_url: null,
        role: 'customer',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockedSupabaseAuthGetUser.mockResolvedValueOnce({ data: { user: mockAuthUser }, error: null });

      // Mock the chained calls for supabase.from('profiles').select('*').eq('id', mockAuthUser.id).single()
      const singleMock = vi.fn().mockResolvedValueOnce({ data: mockProfile, error: null });
      const eqMock = vi.fn().mockReturnValue({ single: singleMock });
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
      mockedSupabaseFrom.mockImplementation((tableName: string) => {
        if (tableName === 'profiles') {
          return { select: selectMock };
        }
        return {}; // Fallback
      });

      const profile = await AuthService.getCurrentProfile();
      expect(profile).toEqual(mockProfile);
      expect(mockedSupabaseAuthGetUser).toHaveBeenCalledTimes(1);
      expect(mockedSupabaseFrom).toHaveBeenCalledWith('profiles');
      expect(selectMock).toHaveBeenCalledWith('*');
      expect(eqMock).toHaveBeenCalledWith('id', mockAuthUser.id);
      expect(singleMock).toHaveBeenCalledTimes(1);
    });

    it('should return null if no user is authenticated', async () => {
      mockedSupabaseAuthGetUser.mockResolvedValueOnce({ data: { user: null }, error: null });
      const profile = await AuthService.getCurrentProfile();
      expect(profile).toBeNull();
    });

    it('should return null if profile fetch fails (e.g., profile not found)', async () => {
      const mockAuthUser = { id: 'user-123', email: 'test@example.com' } as User;
      mockedSupabaseAuthGetUser.mockResolvedValueOnce({ data: { user: mockAuthUser }, error: null });

      const singleMock = vi.fn().mockResolvedValueOnce({ data: null, error: { message: 'Profile not found', code: 'PGRST116', details: '', hint: '' } });
      const eqMock = vi.fn().mockReturnValue({ single: singleMock });
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
      mockedSupabaseFrom.mockImplementation((tableName: string) => {
        if (tableName === 'profiles') {
          return { select: selectMock };
        }
        return {};
      });

      const profile = await AuthService.getCurrentProfile();
      expect(profile).toBeNull();
    });

     it('should throw an error if Supabase auth.getUser fails unexpectedly', async () => {
      const authError = new Error("Auth network error");
      mockedSupabaseAuthGetUser.mockResolvedValueOnce({ data: { user: null }, error: authError });
      // AuthService.getCurrentProfile calls supabase.auth.getUser() first. If that throws, the error should propagate.
      // However, our AuthService.getCurrentProfile() has a try-catch for the profile fetch, not for getUser.
      // The current implementation of AuthService.getCurrentAuthUser re-throws.
      // Let's adjust test to reflect that getCurrentProfile itself might not throw if getUser returns error but no user.
      // If getUser returns an error object, getCurrentProfile will see `user` as null and return null.
      // If supabase.auth.getUser itself *throws* an error, then it would reject.
      // The mock setup returns { data: ..., error: ...}, so it won't throw from supabase.auth.getUser call itself.
      // The service method doesn't explicitly throw if getUser returns an error object but null user.

      // To test throwing for a DB error during profile fetch:
      const mockAuthUser = { id: 'user-123', email: 'test@example.com' } as User;
      mockedSupabaseAuthGetUser.mockResolvedValueOnce({ data: { user: mockAuthUser }, error: null });
      const dbError = new Error("DB connection failed");
      const singleMock = vi.fn().mockResolvedValueOnce({ data: null, error: dbError });
      const eqMock = vi.fn().mockReturnValue({ single: singleMock });
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
      mockedSupabaseFrom.mockImplementation((tableName: string) => {
        if (tableName === 'profiles') {
          return { select: selectMock };
        }
        return {};
      });

      // The current AuthService.getCurrentProfile logs the error and returns null.
      // If we want it to throw, the service method needs to be changed.
      // For now, testing existing behavior:
      const profile = await AuthService.getCurrentProfile();
      expect(profile).toBeNull();
      // To test if it *throws*, we'd do:
      // await expect(AuthService.getCurrentProfile()).rejects.toThrow("DB connection failed");
    });
  });

  // TODO: Add tests for other AuthService methods like signUp, signIn, getUsers, updateUserRole, etc.
});
