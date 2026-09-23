import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

async function runKeepAlive() {
  const timestamp = new Date().toISOString();
  console.log(`\n========================================`);
  console.log(`[${timestamp}] Running Supabase Keep-Alive Ping`);
  console.log(`========================================`);

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ Error: Supabase credentials not found.');
    console.error('Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env or environment.');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const startTime = Date.now();

  try {
    // 1. Primary ping: Query a product ID
    let { data, error } = await supabase
      .from('products')
      .select('id')
      .limit(1);

    // 2. Fallback: Query admin_config if products query fails
    if (error) {
      console.warn('⚠️ Warning: Products query returned error, trying admin_config table...');
      const fallback = await supabase
        .from('admin_config')
        .select('key')
        .limit(1);
      data = fallback.data;
      error = fallback.error;
    }

    if (error) {
      throw error;
    }

    const latencyMs = Date.now() - startTime;
    console.log('✅ Supabase Keep-Alive Success!');
    console.log(`- Database: Connected & Active`);
    console.log(`- Query Latency: ${latencyMs}ms`);
    console.log(`- Records returned: ${data?.length || 0}`);
    console.log(`- Status: 7-day inactivity pause timer has been reset.`);
    console.log(`========================================\n`);
  } catch (err) {
    console.error('❌ Failed to ping Supabase:', err.message || err);
    process.exit(1);
  }
}

runKeepAlive();
