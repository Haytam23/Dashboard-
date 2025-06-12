

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
const app = express(); // Initialize Express app

const allowedOrigins = [
  'http://localhost:5173', // Local development
  'https://dashboard-lafarge-frontend.vercel.app', // Keep this for future deployments
]

// EXPLICIT OPTIONS HANDLER - MUST BE FIRST
// This handles preflight requests for ALL routes
app.options('*', (req: express.Request, res: express.Response) => {
  const origin = req.headers.origin;
  console.log(`OPTIONS preflight request from origin: ${origin}`);
  
  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie, X-Requested-With, Accept, Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400'); // Cache preflight for 24 hours
    console.log(`OPTIONS preflight approved for origin: ${origin}`);
    res.status(200).end();
    return;
  } else {
    console.log(`OPTIONS preflight REJECTED for origin: ${origin}`);
    res.status(403).end();
    return;
  }
});

// CORS Middleware - APPLIED AFTER OPTIONS HANDLER
app.use(cors({
  origin: function (origin, callback) {
    console.log(`CORS check: Request Origin: ${origin}`);
    
    if (!origin) { // Allow requests with no origin (e.g., direct browser access, curl)
      console.log("CORS: Origin undefined, allowing.");
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) { // Use .includes() for clarity
      console.log(`CORS: Origin '${origin}' is allowed.`);
      return callback(null, true);
    } else {
      const msg = `CORS Error: Origin '${origin}' is not allowed by the backend's CORS policy. Allowed: ${allowedOrigins.join(', ')}.`;
      console.error(msg);
      return callback(new Error(msg), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Explicitly list all methods, especially OPTIONS
  credentials: true, // Allow cookies/credentials
  exposedHeaders: ['Set-Cookie'] // Important if you're setting cookies
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
// This is the route that should respond to GET /
app.get('/', (req, res) => {
  res.send('Project Management Backend API is running!');
});

// IMPORTANT FOR VERCEL:
// 1. Remove the app.listen() call. Vercel automatically handles listening.
// 2. Export the Express app instance so Vercel can find and execute it.

// Initialize function to handle asynchronous tasks like database connection.
// This runs once when the serverless function is initialized (on cold start).
async function init() {
  try {
    console.log('Attempting to connect to PostgreSQL database...');
    // A simple query to test the connection.
    await pool.query('SELECT 1;');
    
    console.log('PostgreSQL database connected successfully!');
  } catch (error) {
    console.error('FATAL ERROR: Failed to establish database connection during initialization:', error);
    // In a serverless environment, throwing here won't necessarily stop the 'function'
    // from being deployed, but it signals a critical issue. Requests relying on the DB will fail.
  }
}

// Call init once when the module loads (on cold start)
init();

// Export the Express app instance for Vercel
// This is crucial for Vercel to recognize and run your Express application.
export default app;