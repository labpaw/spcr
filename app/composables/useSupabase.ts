/**
 * Composable for Supabase client
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

export const useSupabase = () => {
  // Initialize Supabase client if not already created
  if (!supabaseClient) {
    const config = useRuntimeConfig();
    const supabaseUrl = config.public.supabaseUrl as string;
    const supabaseKey = config.public.supabaseKey as string;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase URL or Key is missing');
      throw new Error('Supabase configuration is incomplete');
    }

    supabaseClient = createClient(supabaseUrl, supabaseKey);
  }

  return {
    supabase: supabaseClient,
  };
};
