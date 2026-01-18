import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { logger } from '../services/logger';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  logger.error('Missing Supabase credentials in .env', new Error('Missing Env Vars'));
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testRLS() {
  logger.info('Starting RLS Verification Suite...');

  const tests = [
    {
      name: 'Products table is readable by everyone',
      test: async () => {
        const { error } = await supabase.from('products').select('id').limit(1);
        return !error;
      },
    },
    {
      name: 'Orders table is NOT readable by anonymous users without order_id',
      test: async () => {
        const { data } = await supabase.from('orders').select('*');
        // Should return empty array or error depending on exact RLS but definitely not all orders
        return !data || data.length === 0;
      },
    },
    {
      name: 'Coupons are NOT readable by anonymous users',
      test: async () => {
        const { data, error } = await supabase.from('coupons').select('*');
        return error || !data || data.length === 0;
      },
    },
  ];

  let passed = 0;
  for (const t of tests) {
    try {
      const result = await t.test();
      if (result) {
        logger.info(`✅ PASSED: ${t.name}`);
        passed++;
      } else {
        logger.error(`❌ FAILED: ${t.name}`, new Error('RLS Failure'));
      }
    } catch (err) {
      logger.error(`💥 EXCEPTION: ${t.name}`, err as Error);
    }
  }

  logger.info(`RLS Test Completion: ${passed}/${tests.length} passed.`);

  if (passed === tests.length) {
    logger.info('Security Audit: RLS Policies Confirmed Secure.');
  } else {
    logger.warn('Security Audit: RLS Policies REQUIRE ATTENTION.');
    process.exit(1);
  }
}

testRLS().catch((err) => {
  logger.error('RLS Test Script crashed', err);
  process.exit(1);
});
