// backend/server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// Import routers based on your file structure (backend/src/routes/)
// ADDING BACK ROUTERS ONE BY ONE TO IDENTIFY THE PROBLEMATIC ONE
import { authRouter } from './src/routes/auth';
import { projectRouter } from './src/routes/projects';
import { taskRouter } from './src/routes/tasks';

// Import middleware based on your file structure (backend/middleware/)
import { requireAuth } from './middleware/auth';

// Import database pool based on your file structure (backend/src/db.ts)
import { pool } from './src/db';

dotenv.config(); // Loads environment variables from .env file
const app = express(); // Initialize Express app

const allowedOrigins = [
  'http://localhost:5173', // Local development
  'https://dashboard-frontend-one-pi.vercel.app' // Your actual frontend URL
]

// Simple CORS configuration - let the cors middleware handle everything
app.use(cors({
  origin: function (origin, callback) {
    console.log(`CORS check: Request Origin: ${origin}`);
    
    if (!origin || allowedOrigins.includes(origin)) {
      console.log(`CORS: Origin '${origin}' is allowed.`);
      return callback(null, true);
    } else {
      const msg = `CORS Error: Origin '${origin}' is not allowed.`;
      console.error(msg);
      return callback(new Error(msg), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
  exposedHeaders: ['Set-Cookie']
}));

// Other general middleware
app.use(cookieParser());
app.use(express.json());

// Error handling middleware for debugging
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Express error:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// Public Auth Endpoints (No authentication needed for login/register)
console.log('Setting up basic routes...');
app.use('/auth', authRouter);

// Protected Resource Endpoints (require authentication)
console.log('Basic routes configured...');
app.use('/projects', requireAuth, projectRouter);
app.use('/tasks', requireAuth, taskRouter);

// Default route for health check or basic message
// This is the route that should respond to GET /
app.get('/', (req, res) => {
  res.json({ 
    message: 'Project Management Backend API is running!', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// IMPORTANT FOR VERCEL:
// 1. Remove the app.listen() call. Vercel automatically handles listening.
// 2. Export the Express app instance so Vercel can find and execute it.

// Initialize function to handle asynchronous tasks like database connection.
// This runs once when the serverless function is initialized (on cold start).
async function init() {
  try {
    console.log('Backend initializing...');
    console.log('Attempting to connect to PostgreSQL database...');
    // Only test connection if DATABASE_URL is available
    if (process.env.DATABASE_URL) {
      await pool.query('SELECT 1;');
      console.log('PostgreSQL database connected successfully!');
    } else {
      console.warn('DATABASE_URL not set - running without database connection');
    }
  } catch (error) {
    console.error('WARNING: Failed to establish database connection during initialization:', error);
    // In a serverless environment, don't crash the server - just log the warning
    console.warn('Server will continue without database functionality');
  }
}

// Call init once when the module loads (on cold start)
init();

// Export the Express app instance for Vercel
// This is crucial for Vercel to recognize and run your Express application.
export default app;