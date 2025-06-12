"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/server.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// Import routers based on your file structure (backend/src/routes/)
// ADDING BACK ROUTERS ONE BY ONE TO IDENTIFY THE PROBLEMATIC ONE
const auth_1 = require("./src/routes/auth");
const projects_1 = require("./src/routes/projects");
const tasks_1 = require("./src/routes/tasks");
// Import middleware based on your file structure (backend/middleware/)
const auth_2 = require("./middleware/auth");
// Import database pool based on your file structure (backend/src/db.ts)
// import { pool } from './src/db'; // Temporarily disabled for debugging
dotenv_1.default.config(); // Loads environment variables from .env file
const app = (0, express_1.default)(); // Initialize Express app
const allowedOrigins = [
    'http://localhost:5173', // Local development
    'https://dashboard-frontend-one-pi.vercel.app' // Your actual frontend URL
];
// Simple CORS configuration - let the cors middleware handle everything
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        console.log(`CORS check: Request Origin: ${origin}`);
        if (!origin || allowedOrigins.includes(origin)) {
            console.log(`CORS: Origin '${origin}' is allowed.`);
            return callback(null, true);
        }
        else {
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
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
// Error handling middleware for debugging
app.use((err, req, res, next) => {
    console.error('Express error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message,
        timestamp: new Date().toISOString()
    });
});
// Public Auth Endpoints (No authentication needed for login/register)
console.log('Setting up basic routes...');
app.use('/auth', auth_1.authRouter);
// Protected Resource Endpoints (require authentication)
console.log('Basic routes configured...');
app.use('/projects', auth_2.requireAuth, projects_1.projectRouter);
app.use('/tasks', auth_2.requireAuth, tasks_1.taskRouter);
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
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Backend initialized successfully without database connection');
            // Temporarily disabled database connection for debugging
            // console.log('Attempting to connect to PostgreSQL database...');
            // Only test connection if DATABASE_URL is available
            // if (process.env.DATABASE_URL) {
            //   await pool.query('SELECT 1;');
            //   console.log('PostgreSQL database connected successfully!');
            // } else {
            //   console.warn('DATABASE_URL not set - running without database connection');
            // }
        }
        catch (error) {
            console.error('WARNING: Failed to establish database connection during initialization:', error);
            // In a serverless environment, don't crash the server - just log the warning
            console.warn('Server will continue without database functionality');
        }
    });
}
// Call init once when the module loads (on cold start)
init();
// Export the Express app instance for Vercel
// This is crucial for Vercel to recognize and run your Express application.
exports.default = app;
