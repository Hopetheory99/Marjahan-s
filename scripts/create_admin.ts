import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);

async function main() {
  const email = 'marjahan.admin@gmail.com';
  const password = 'Password123!';

  console.log(`Creating user: ${email}`);

  // 1. Sign Up
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    console.error('❌ Sign up error:', signUpError.message);
    if (signUpError.message.includes('already registered')) {
      console.log('   User already exists. Trying to log in...');
    } else {
      process.exit(1);
    }
  }

  // 2. Sign In (to get session if signUp didn't give it, or if user existed)
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    console.error('❌ Sign in failed:', signInError.message);
    if (signInError.message.includes('Email not confirmed')) {
      console.log('⚠️  ACTION REQUIRED: Email not confirmed!');
      console.log('   Go to Supabase Dashboard -> Auth -> Users.');
      console.log(`   Find ${email} and manually confirm it inside the dashboard.`);
    }
    process.exit(1);
  }

  if (signInData.session) {
    console.log('✅ Logged in successfully!');
    const userId = signInData.user.id;

    // 3. Promote
    console.log('Attempting to promote to admin...');
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', userId);

    if (updateError) {
      console.error('❌ Update failed:', updateError.message);
    } else {
      // Double check
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      if (profile?.role === 'admin') {
        console.log('🎉 SUCCESS: User is now ADMIN!');
      } else {
        console.log('⚠️  Update call succeeded but role is still:', profile?.role);
        console.log('   (RLS probably blocked the column update silently)');
      }
    }
  }
}

main();
