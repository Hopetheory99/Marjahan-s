import { createClient } from '@supabase/supabase-js';

import { logger } from './logger';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  logger.warn('Missing Supabase environment variables. Please check your .env file.', {
    service: 'supabase',
  });
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
