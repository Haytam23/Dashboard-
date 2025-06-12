"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Minimal backend server for debugging
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const allowedOrigins = [
    'http://localhost:5173',
    'https://dashboard-frontend-one-pi.vercel.app'
];
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.json({
        message: 'Minimal Backend API is working!',
        timestamp: new Date().toISOString()
    });
});
app.get('/test', (req, res) => {
    res.json({
        message: 'Test endpoint working!',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
    });
});
// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});
exports.default = app;
