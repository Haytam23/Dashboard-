"use strict";
// import { Pool } from 'pg';
// import dotenv from 'dotenv';
// dotenv.config();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
// // console.log('▶️ DATABASE_URL=', process.env.DATABASE_URL);
// export const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });
// backend/src/db.ts
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Ensure dotenv is loaded here too for DB connection
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    console.error('DATABASE_URL environment variable is not set. Please set it in your .env file or Vercel config.');
    process.exit(1); // Exit if DB URL is missing
}
exports.pool = new pg_1.Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false // Required for Supabase in some environments, or if you use a specific CA cert
    }
});
exports.pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1); // Exit process with failure
});
console.log('PostgreSQL Pool initialized.');
