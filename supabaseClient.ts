import { createClient } from '@supabase/supabase-js';

// Safely access environment variables
const env = (import.meta as any).env || {};

// Credenciais atualizadas para integração com o banco de dados
const supabaseUrl = env.VITE_SUPABASE_URL || 'https://ygzdmlrgtmkeqqbcpqjh.supabase.co';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_6SnD9gX5lbhFSdsEqXHZaw_b5RHYuuT';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});