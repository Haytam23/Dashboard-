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
    process.exit(1); // Exit if DB URL is missing
}

export const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false // Required for Supabase in some environments, or if you use a specific CA cert
    }
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1); // Exit process with failure
});

console.log('PostgreSQL Pool initialized.');