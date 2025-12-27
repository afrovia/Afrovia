import { createClient } from '@supabase/supabase-js';

// Safely access environment variables
const env = (import.meta as any).env || {};

// Use environment variables for security in production
const supabaseUrl = env.VITE_SUPABASE_URL || 'https://bndpoenuyakgoqkwbgio.supabase.co';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Rw_vA1RoSJEneMqaUNzSBA_J8J64SGj';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});