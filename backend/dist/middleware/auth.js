"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function requireAuth(req, res, next) {
    var _a;
    // Allow OPTIONS requests to pass through without authentication
    if (req.method === 'OPTIONS') {
        console.log('requireAuth: OPTIONS request detected, bypassing authentication.');
        return next(); // Crucial for preflight requests
    }
    // First try to get token from cookie (for cookie-based auth)
    let token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
    // If no cookie token, try Authorization header (for Bearer token auth)
    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
    }
    // Enhanced logging for cookie debugging
    console.log('requireAuth: All cookies received:', JSON.stringify(req.cookies || {}));
    console.log('requireAuth: Cookie header:', req.headers.cookie || 'No cookie header');
    console.log('requireAuth: User-Agent:', req.headers['user-agent'] || 'No user agent');
    console.log('requireAuth: Origin:', req.headers.origin || 'No origin');
    console.log('requireAuth: Token found:', token ? 'Yes' : 'No');
    if (!token) {
        console.warn('requireAuth: No authorization token found, sending 401.');
        res.sendStatus(401);
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log('requireAuth: Token successfully verified for user:', decoded.sub);
        next();
    }
    catch (error) {
        console.error('requireAuth: Authentication failed during token verification:', error);
        res.sendStatus(401);
        return;
    }
}
