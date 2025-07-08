import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export function useSupabase() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // For demo purposes, we're not actually connecting to Supabase
  useEffect(() => {
    setLoading(false);
  }, []);

  return {
    user,
    loading,
    signUp: () => Promise.resolve({ data: { user: null }, error: null }),
    signIn: () => Promise.resolve({ data: { user: null }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    resetPassword: () => Promise.resolve({ error: null }),
  };
}