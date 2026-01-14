import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('Testing connection with:');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey ? supabaseAnonKey.substring(0, 10) + '...' : 'MISSING');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  try {
    console.log('Querying public.profiles...');
    const { data, error } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true });

    if (error) {
      console.error('❌ Query failed:', error.message);
      console.error('   Error details:', JSON.stringify(error, null, 2));
    } else {
      console.log('✅ Connection successful!');
      console.log('   Table "profiles" exists (or at least is accessible).');
    }

    // Also check auth
    console.log('Checking auth...');
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();
    if (authError) {
      console.error('❌ Auth check failed:', authError.message);
    } else {
      console.log('✅ Auth service reachable.');
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

test();
