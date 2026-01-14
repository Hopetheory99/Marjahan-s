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

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  console.log('🔍 Checking Supabase connection...');

  // 1. Verify connection by querying profiles (should fail if table doesn't exist, or return empty)
  // Since RLS is public read, we can try to select.
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .limit(1);

  if (profileError) {
    console.error('❌ Connection failed or table missing:', profileError.message);
    if (profileError.code === '42P01') {
      console.error('   Hint: The "profiles" table does not exist. Please run the schema script.');
    }
    process.exit(1);
  } else {
    console.log('✅ Connection verified. "profiles" table exists.');
  }

  // 2. Create Admin User
  const email = 'admin.auto@marjahans.com';
  const password = 'Password123!';

  console.log(`\n👤 Attempting to create/login admin user: ${email}`);

  // Try to sign in first (if exists)
  let { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError && authError.message.includes('Invalid login credentials')) {
    // Try sign up
    console.log('   User not found, signing up...');
    const signUpResult = await supabase.auth.signUp({
      email,
      password,
    });
    authData = signUpResult.data;
    authError = signUpResult.error;
  }

  if (authError) {
    console.error('❌ Authentication failed:', authError.message);
    process.exit(1);
  }

  const userId = authData.user?.id;
  console.log(`✅ User authenticated! ID: ${userId}`);

  // 3. Promote to Admin
  console.log('\n⬆️  Attempting to promote to admin...');

  // We utilize the fact that the RLS "Users can update own profile" might allow updating the role
  // if not explicitly restricted.
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ role: 'admin' })
    .eq('id', userId);

  if (updateError) {
    console.error('❌ Failed to update role:', updateError.message);
    console.log(
      '   Note: This is expected if RLS prevents role updates. You must use the Dashboard.',
    );
  } else {
    // Verify the update
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (profile?.role === 'admin') {
      console.log('✅ Success! User promoted to admin.');
      console.log('   Credentials:');
      console.log(`   Email: ${email}`);
      console.log(`   Password: ${password}`);
    } else {
      console.warn('⚠️  Update ran but role is still:', profile?.role);
      console.warn('   The RLS policy likely ignored the disallowed column update silently.');
    }
  }
}

main();
