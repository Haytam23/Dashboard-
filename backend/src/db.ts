// import { Pool } from 'pg';
// import dotenv from 'dotenv';
// dotenv.config();

// // console.log('▶️ DATABASE_URL=', process.env.DATABASE_URL);

// export const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// backend/src/db.ts
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // Ensure dotenv is loaded here too for DB connection

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('DATABASE_URL environment variable is not set. Please set it in your .env file or Vercel config.');
    throw new Error('DATABASE_URL is required'); // Don't exit process in serverless
}

export const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false // Required for Supabase in some environments, or if you use a specific CA cert
    }
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    // Don't exit process in serverless environment
});

console.log('PostgreSQL Pool initialized.');