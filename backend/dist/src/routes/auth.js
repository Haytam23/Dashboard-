"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.authRouter = void 0;
// src/routes/auth.ts
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const um = __importStar(require("../models/userModel"));
const auth_1 = require("../../middleware/auth");
exports.authRouter = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error('FATAL: JWT_SECRET is not set in ENV!');
    process.exit(1);
}
const FRONTEND_URL = process.env.FRONTEND_URL;
// POST /auth/register
// (Use this once to seed the owner account; you can remove or secure it afterward.)
exports.authRouter.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const existing = yield um.findUserByEmail(email);
        if (existing) {
            res.status(400).json({ error: 'Email already registered' });
            return;
        }
        const hash = yield bcrypt_1.default.hash(password, 10);
        const user = yield um.createUser(email, hash);
        res.status(201).json({ id: user.id });
    }
    catch (err) {
        console.error('Registration failed:', err);
        res.status(500).json({ error: 'Registration error' });
    }
}));
// POST /auth/login
// authRouter.post('/login', async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { email, password } = req.body as { email: string; password: string };
//     console.log('[LOGIN] Attempting login for:', email);
//     // 1) Fetch user
//     const user = await um.findUserByEmail(email);
//     if (!user) {
//       console.warn('[LOGIN] No user found for email:', email);
//       res.status(401).json({ error: 'Invalid credentials' });
//       return;
//     }
//     // 2) Compare password
//     const match = await bcrypt.compare(password, user.password);
//     if (!match) {
//       console.warn('[LOGIN] Password mismatch for user:', email);
//       res.status(401).json({ error: 'Invalid credentials' });
//       return;
//     }
//     // 3) Sign JWT
//     const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, {
//       expiresIn: '8h',
//     });
//     console.log('[LOGIN] Success, issuing token for:', email);
//     res.json({ token });
//   } catch (err) {
//     console.error('[LOGIN] Unexpected error:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });
const dotenv_1 = __importDefault(require("dotenv"));
const userModel_1 = require("../models/userModel");
dotenv_1.default.config();
// Make sure to register cookie-parser in your server.ts:
//    import cookieParser from 'cookie-parser';
//    app.use(cookieParser());
/**
 * POST /auth/login
 * Issues an HttpOnly cookie on successful login.
 */
exports.authRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('[LOGIN] Request body:', req.body);
        const { email, password } = req.body;
        console.log(`[LOGIN] Attempting login for email: ${email}`);
        const user = yield (0, userModel_1.findUserByEmail)(email);
        console.log(`[LOGIN] User found:`, user ? 'Yes' : 'No');
        if (!user) {
            console.log('[LOGIN] No user found, returning 401');
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        console.log('[LOGIN] Comparing password...');
        const match = yield bcrypt_1.default.compare(password, user.password);
        console.log(`[LOGIN] Password match:`, match);
        if (!match) {
            console.log('[LOGIN] Password mismatch, returning 401');
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        // Sign a JWT valid for 8 hours
        console.log('[LOGIN] Password matches, creating JWT token...');
        const token = jsonwebtoken_1.default.sign({ sub: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: '8h',
        }); // Set it as a Secure, HttpOnly cookie
        console.log('[LOGIN] Setting cookie and sending success response');
        console.log('[LOGIN] Cookie settings: httpOnly=true, secure=true, sameSite=none, maxAge=8h');
        console.log('[LOGIN] Request origin:', req.headers.origin);
        console.log('[LOGIN] User-Agent:', req.headers['user-agent']);
        res
            .cookie('token', token, {
            httpOnly: true,
            secure: true, // Always true for cross-origin cookies
            sameSite: 'none', // Required for cross-origin cookies
            maxAge: 1000 * 60 * 60 * 8, // 8 hours
        })
            .json({ success: true });
        console.log('[LOGIN] Login successful for:', email);
    }
    catch (err) {
        console.error('[LOGIN] Unexpected error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
/**
 * GET /auth/whoami
 * Checks the cookie, returns 200 if valid.
 */
exports.authRouter.get('/whoami', auth_1.requireAuth, // Now this will properly read req.cookies.token
(_req, res) => {
    res.json({ success: true });
});
/**
 * POST /auth/logout
 * Clears the cookie so the user is logged out.
 */
exports.authRouter.post('/logout', (_req, res) => {
    res
        .clearCookie('token', {
        httpOnly: true,
        secure: true, // Always true for cross-origin cookies
        sameSite: 'none', // Required for cross-origin cookies
    })
        .json({ success: true });
});
// POST /auth/forgot-password
exports.authRouter.post('/forgot-password', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield um.findUserByEmail(email);
        // Always respond 200 to avoid revealing whether the email exists
        if (!user) {
            res.sendStatus(200);
            return;
        }
        const token = crypto_1.default.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 3600000); // 1 hour
        yield um.setResetToken(user.id, token, expires);
        // Send email (configure SMTP transporter via environment)
        const transporter = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: !!process.env.SMTP_SECURE,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
        const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}`;
        yield transporter.sendMail({
            to: email,
            subject: 'Your Password Reset Link',
            text: `Click or paste this link to reset your password:\n\n${resetUrl}`
        });
        res.sendStatus(200);
    }
    catch (err) {
        console.error('Forgot password error:', err);
        res.sendStatus(500);
    }
}));
// POST /auth/reset-password
exports.authRouter.post('/reset-password', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, password } = req.body;
        const user = yield um.findByResetToken(token);
        if (!user) {
            res.status(400).json({ error: 'Invalid or expired token' });
            return;
        }
        const hash = yield bcrypt_1.default.hash(password, 10);
        yield um.updatePassword(user.id, hash);
        res.sendStatus(200);
    }
    catch (err) {
        console.error('Reset password error:', err);
        res.sendStatus(500);
    }
}));
// POST /auth/change-password
// Protected: must include Authorization: Bearer <token>
exports.authRouter.post('/change-password', auth_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const userId = payload.sub;
        const { oldPassword, newPassword } = req.body;
        const user = yield um.findUserById(userId);
        if (!user || !(yield bcrypt_1.default.compare(oldPassword, user.password))) {
            res.status(400).json({ error: 'Current password is incorrect' });
            return;
        }
        const hash = yield bcrypt_1.default.hash(newPassword, 10);
        yield um.updatePassword(user.id, hash);
        res.sendStatus(200);
    }
    catch (err) {
        console.error('Change password error:', err);
        res.status(500).json({ error: 'Could not change password' });
    }
}));
