

// // backend/server.ts
// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import cookieParser from 'cookie-parser';

// import { projectRouter } from './src/routes/projects';
// import { taskRouter } from './src/routes/tasks';
// import { authRouter } from './src/routes/auth';
// import { requireAuth } from './middleware/auth'; 

// import { pool } from './src/db'; 

// dotenv.config();
// const app = express();

// const allowedOrigins = [
//   'http://localhost:5173', // Your local Vite dev URL
//   // **CRUCIAL: PASTE THE EXACT ORIGIN YOU COPIED FROM YOUR BROWSER HERE.**
//   'https://dashboard-lfg-front.vercel.app' // This should be the exact value from window.location.origin
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     // Log the incoming origin for debugging in Vercel logs
//     console.log(`CORS check: Request Origin: ${origin}`); // THIS LOG IS KEY!

//     if (!origin) return callback(null, true); // Allow requests with no origin

//     if (allowedOrigins.indexOf(origin) === -1) {
//       const msg = `CORS Error: Origin '${origin}' is not allowed by the backend's CORS policy. Allowed: ${allowedOrigins.join(', ')}.`;
//       console.error(msg);
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   },
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   credentials: true,
//   exposedHeaders: ['Set-Cookie']
// }));

// app.use(cookieParser());
// app.use(express.json());

// console.log('Mounting /auth router...');
// app.use('/auth', authRouter);

// console.log('Mounting protected /projects and /tasks routers with requireAuth...');
// app.use('/projects', requireAuth, projectRouter);
// app.use('/tasks', requireAuth, taskRouter);

// app.get('/', (req, res) => {
//   res.send('Project Management Backend API is running!');
// });

// const port = process.env.PORT || 4000;

// async function startServer() {
//   try {
//     console.log('Attempting to connect to PostgreSQL database...');
//     await pool.query('SELECT 1;'); 
//     console.log('PostgreSQL database connected successfully!');

//     app.listen(port, () => {
//       console.log(`Server running on port ${port}`);
//     });
//   } catch (error) {
//     console.error('FATAL ERROR: Failed to start server due to database connection issue:', error);
//     process.exit(1); 
//   }
// }

// startServer();


// backend/server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// Import routers based on your file structure (backend/src/routes/)
import { projectRouter } from './src/routes/projects';
import { taskRouter } from './src/routes/tasks';
import { authRouter } from './src/routes/auth';

// Import middleware based on your file structure (backend/middleware/)
import { requireAuth } from './middleware/auth'; 

// Import database pool based on your file structure (backend/src/db.ts)
import { pool } from './src/db'; 

dotenv.config(); // Loads environment variables from .env file
const app = express();

const allowedOrigins = [
  'http://localhost:5173', // Your local Vite dev URL
  // CRUCIAL: This must be the EXACT URL of your deployed frontend.
  // Copy it from your browser's console using `window.location.origin` if unsure.
  'https://dashboard-lfg-front.vercel.app' 
];

// CORS Middleware - MUST BE APPLIED FIRST
app.use(cors({
  origin: function (origin, callback) {
    // Log the incoming origin for debugging in Vercel logs
    console.log(`CORS check: Request Origin: ${origin}`); 

    // Allow requests with no origin (e.g., from Postman, curl, or same-origin requests)
    if (!origin) return callback(null, true);

    // Check if the requesting origin is in our allowed list
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `CORS Error: Origin '${origin}' is not allowed by the backend's CORS policy. Allowed: ${allowedOrigins.join(', ')}.`;
      console.error(msg);
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Explicitly allow all common methods
  credentials: true, // Allow cookies to be sent across origins
  exposedHeaders: ['Set-Cookie'] // If your backend sets cookies, expose this header
}));

// Other general middleware
app.use(cookieParser());
app.use(express.json());

// Public Auth Endpoints (No authentication needed for login/register)
console.log('Mounting /auth router...');
app.use('/auth', authRouter);

// Protected Resource Endpoints (require authentication)
console.log('Mounting protected /projects and /tasks routers with requireAuth...');
app.use('/projects', requireAuth, projectRouter);
app.use('/tasks', requireAuth, taskRouter);

// Default route for health check or basic message
app.get('/', (req, res) => {
  res.send('Project Management Backend API is running!');
});

// IMPORTANT: FOR VERCEL SERVERLESS FUNCTIONS
// Do NOT use app.listen() here. Vercel handles the server listening.
// Instead, we export the 'app' instance directly.

// Initialize function to handle asynchronous tasks like database connection
// This runs once when the serverless function is initialized (cold start).
async function init() {
  try {
    console.log('Attempting to connect to PostgreSQL database...');
    // A simple query to test the connection. If this fails, the serverless function
    // will still be "live", but subsequent DB operations will fail.
    await pool.query('SELECT 1;'); 
    console.log('PostgreSQL database connected successfully!');
  } catch (error) {
    console.error('FATAL ERROR: Failed to establish database connection during initialization:', error);
    // In a serverless environment, throwing here won't stop the 'function'
    // from being ready to receive requests, but it signals a critical issue.
    // Requests relying on DB will fail.
  }
}

// Call init once when the module loads (on cold start)
init();

// Export the Express app instance for Vercel
export default app;