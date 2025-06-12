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
const projects_1 = require("./src/routes/projects");
const tasks_1 = require("./src/routes/tasks");
const auth_1 = require("./src/routes/auth");
// Import middleware based on your file structure (backend/middleware/)
const auth_2 = require("./middleware/auth");
// Import database pool based on your file structure (backend/src/db.ts)
const db_1 = require("./src/db");
dotenv_1.default.config(); // Loads environment variables from .env file
const app = (0, express_1.default)(); // Initialize Express app
const allowedOrigins = [
    'http://localhost:5173', // Local development
    'https://dashboard-frontend-haytamraiss23-gmailcoms-projects.vercel.app'
];
// EXPLICIT OPTIONS HANDLER - MUST BE FIRST
// This handles preflight requests for ALL routes
app.options('*', (req, res) => {
    try {
        const origin = req.headers.origin;
        console.log(`OPTIONS preflight request from origin: ${origin}`);
        console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
        // Check if origin is allowed
        if (!origin || allowedOrigins.includes(origin)) {
            res.setHeader('Access-Control-Allow-Origin', origin || '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie, X-Requested-With, Accept, Origin');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            res.setHeader('Access-Control-Max-Age', '86400'); // Cache preflight for 24 hours
            console.log(`OPTIONS preflight approved for origin: ${origin}`);
            res.status(200).end();
            return;
        }
        else {
            console.log(`OPTIONS preflight REJECTED for origin: ${origin}. Allowed: ${allowedOrigins.join(', ')}`);
            res.status(403).json({ error: 'Origin not allowed' });
            return;
        }
    }
    catch (error) {
        console.error('Error in OPTIONS handler:', error);
        res.status(500).json({ error: 'Internal server error in OPTIONS handler' });
        return;
    }
});
// CORS Middleware - APPLIED AFTER OPTIONS HANDLER
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        console.log(`CORS check: Request Origin: ${origin}`);
        if (!origin) { // Allow requests with no origin (e.g., direct browser access, curl)
            console.log("CORS: Origin undefined, allowing.");
            return callback(null, true);
        }
        if (allowedOrigins.includes(origin)) { // Use .includes() for clarity
            console.log(`CORS: Origin '${origin}' is allowed.`);
            return callback(null, true);
        }
        else {
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
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
// Public Auth Endpoints (No authentication needed for login/register)
console.log('Mounting /auth router...');
app.use('/auth', auth_1.authRouter);
// Protected Resource Endpoints (require authentication)
console.log('Mounting protected /projects and /tasks routers with requireAuth...');
app.use('/projects', auth_2.requireAuth, projects_1.projectRouter);
app.use('/tasks', auth_2.requireAuth, tasks_1.taskRouter);
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
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Attempting to connect to PostgreSQL database...');
            // A simple query to test the connection.
            yield db_1.pool.query('SELECT 1;');
            console.log('PostgreSQL database connected successfully!');
        }
        catch (error) {
            console.error('FATAL ERROR: Failed to establish database connection during initialization:', error);
            // In a serverless environment, throwing here won't necessarily stop the 'function'
            // from being deployed, but it signals a critical issue. Requests relying on the DB will fail.
        }
    });
}
// Call init once when the module loads (on cold start)
init();
// Export the Express app instance for Vercel
// This is crucial for Vercel to recognize and run your Express application.
exports.default = app;
