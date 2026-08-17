import { Pool } from 'pg';

declare global {
  // eslint-disable-next-line no-var
  var pool: Pool | undefined;
}

const pool = global.pool || new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Set to higher if expecting massive concurrency, free tier might limit this
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: process.env.DATABASE_URL?.includes('supabase') ? { rejectUnauthorized: false } : undefined,
});

if (process.env.NODE_ENV !== 'production') {
  global.pool = pool;
}

export default pool;
