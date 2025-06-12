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
    const auth = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!auth) {
        console.warn('requireAuth: No authorization token found, sending 401.');
        res.sendStatus(401);
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(auth, process.env.JWT_SECRET);
        req.user = decoded;
        console.log('requireAuth: Token successfully verified for user:', decoded.id);
        next();
    }
    catch (error) {
        console.error('requireAuth: Authentication failed during token verification:', error);
        res.sendStatus(401);
        return;
    }
}
