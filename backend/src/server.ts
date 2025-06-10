// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import cookieParser from 'cookie-parser';

// import { projectRouter } from './routes/projects';
// import { taskRouter } from './routes/tasks';
// import { authRouter } from './routes/auth';
// import { requireAuth } from '../middleware/auth';

// dotenv.config();
// const app = express();

// // app.use(cors());
// app.use(cors({
//   origin: 'http://localhost:5173',   // your Vite dev URL
//   credentials: true,                 // allow cookies
// }));
// app.use(cookieParser());
// app.use(express.json());


// // app.use(requireAuth);                // Protect all routes below this middleware

// // Public auth endpoints
// app.use('/auth', authRouter);

// // Protected resource endpoints
// app.use('/projects', projectRouter);
// app.use('/tasks',    taskRouter);

// const port = process.env.PORT || 4000;
// app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
// server.ts
// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import cookieParser from 'cookie-parser';

// import { projectRouter } from './routes/projects';
// import { taskRouter } from './routes/tasks';
// import { authRouter } from './routes/auth';
// // If requireAuth is specifically for protecting routes, keep it
// import { requireAuth } from '../middleware/auth'; // Adjust path if needed

// dotenv.config();
// const app = express();

// // CORS Configuration - IMPORTANT for production
// const allowedOrigins = [
//   'http://localhost:5173', // Your Vite dev URL
//   // !! ADD YOUR DEPLOYED FRONTEND URL HERE !!
//   // Example: 'https://your-frontend-project.vercel.app',
//   'https://project-management.vercel.app', // Example production URL
//   // You can also add other staging/production frontend URLs if you have them.
//   // For now, leave as a comment and add when you have the URL.
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     // allow requests with no origin (like mobile apps or curl requests)
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.indexOf(origin) === -1) {
//       const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   },
//   credentials: true, // Allow cookies to be sent
// }));

// app.use(cookieParser());
// app.use(express.json());

// // Public auth endpoints
// app.use('/auth', authRouter);

// // Protect specific routes or all routes after this point
// // If you uncomment app.use(requireAuth);, it will protect all routes below it.
// // If your '/auth' routes also need to be protected (e.g., /auth/profile), keep this line after public auth.
// // If only '/projects' and '/tasks' need protection, move this middleware
// // app.use(requireAuth);

// // Protected resource endpoints
// // If requireAuth is meant to protect these, move it here
// app.use('/projects', requireAuth, projectRouter); // Example: apply middleware per route
// app.use('/tasks', requireAuth, taskRouter);      // Example: apply middleware per route


// const port = process.env.PORT || 4000;
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
//   // IMPORTANT: You need to call your database connection function here.
//   // Assuming you have a function like `connectDB()` that sets up the database connection.
//   // connectDB(); // Example: if you have a separate db connection module
// });


// backend/server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import { projectRouter } from './routes/projects';
import { taskRouter } from './routes/tasks';
import { authRouter } from './routes/auth';
import { requireAuth } from '../middleware/auth';

// !! IMPORT YOUR DATABASE POOL HERE !!
import { pool } from './db'; // Adjust path if your db.ts is in src, e.g., './src/db'

dotenv.config();
const app = express();

const allowedOrigins = [
  'http://localhost:5173', // Your Vite dev URL
  'https://project-management.vercel.app', // Your deployed frontend URL
  // Add other deployed frontend URLs if applicable
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

// Public auth endpoints
app.use('/auth', authRouter);

// Protected resource endpoints
app.use('/projects', requireAuth, projectRouter);
app.use('/tasks', requireAuth, taskRouter);

const port = process.env.PORT || 4000;

// Function to start the server after database check
async function startServer() {
  try {
    // Test the database connection by making a simple query
    console.log('Attempting to connect to PostgreSQL...');
    await pool.query('SELECT 1;'); // A simple query to test the connection
    console.log('PostgreSQL database connected successfully!');

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('FATAL: Failed to start server due to database connection error:', error);
    console.error('Please check your DATABASE_URL environment variable and Azure PostgreSQL firewall rules.');
    process.exit(1); // Exit process if database connection cannot be established
  }
}

startServer(); // Call the async function to start the server