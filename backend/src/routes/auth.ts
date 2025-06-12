// src/routes/auth.ts
import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import * as um from '../models/userModel';
import { requireAuth } from '../../middleware/auth';
import type { User } from '../types';

export const authRouter = Router();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('FATAL: JWT_SECRET is not set in ENV!');
  process.exit(1);
}
const FRONTEND_URL = process.env.FRONTEND_URL!;

// POST /auth/register
// (Use this once to seed the owner account; you can remove or secure it afterward.)
authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const existing = await um.findUserByEmail(email);
    if (existing) {
      res.status(400).json({ error: 'Email already registered' });
      return;
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await um.createUser(email, hash);
    res.status(201).json({ id: user.id });
  } catch (err) {
    console.error('Registration failed:', err);
    res.status(500).json({ error: 'Registration error' });
  }
});

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





import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { findUserByEmail } from '../models/userModel';

dotenv.config();


// Make sure to register cookie-parser in your server.ts:
//    import cookieParser from 'cookie-parser';
//    app.use(cookieParser());

/**
 * POST /auth/login
 * Issues an HttpOnly cookie on successful login.
 */
authRouter.post(
  '/login',
  async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('[LOGIN] Request body:', req.body);
      const { email, password } = req.body as {
        email: string;
        password: string;
      };
      console.log(`[LOGIN] Attempting login for email: ${email}`);

      const user = await findUserByEmail(email);
      console.log(`[LOGIN] User found:`, user ? 'Yes' : 'No');
      if (!user) {
        console.log('[LOGIN] No user found, returning 401');
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      console.log('[LOGIN] Comparing password...');
      const match = await bcrypt.compare(password, user.password);
      console.log(`[LOGIN] Password match:`, match);
      if (!match) {
        console.log('[LOGIN] Password mismatch, returning 401');
        res.status(401).json({ error: 'Invalid credentials' });
        return;      }

      // Sign a JWT valid for 8 hours
      console.log('[LOGIN] Password matches, creating JWT token...');
      const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: '8h',
      });      // Set it as a Secure, HttpOnly cookie
      console.log('[LOGIN] Setting cookie and sending success response');
      console.log('[LOGIN] Cookie settings: httpOnly=true, secure=true, sameSite=none, maxAge=8h');
      console.log('[LOGIN] Request origin:', req.headers.origin);
      console.log('[LOGIN] User-Agent:', req.headers['user-agent']);
        res
        .cookie('token', token, {
          httpOnly: true,
          secure: true, // Always true for cross-origin cookies
          sameSite: 'none', // Required for cross-origin cookies
          domain: '.vercel.app', // Allow cookie to be sent to all vercel.app subdomains
          maxAge: 1000 * 60 * 60 * 8, // 8 hours
        })
        .json({ success: true });
      console.log('[LOGIN] Login successful for:', email);
    } catch (err) {
      console.error('[LOGIN] Unexpected error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * GET /auth/whoami
 * Checks the cookie, returns 200 if valid.
 */
authRouter.get(
  '/whoami',
  requireAuth, // Now this will properly read req.cookies.token
  (_req: Request, res: Response) => {
    res.json({ success: true });
  }
);

/**
 * POST /auth/logout
 * Clears the cookie so the user is logged out.
 */
authRouter.post('/logout', (_req: Request, res: Response) => {
  res
    .clearCookie('token', {
      httpOnly: true,
      secure: true, // Always true for cross-origin cookies
      sameSite: 'none', // Required for cross-origin cookies
      domain: '.vercel.app', // Match the domain used when setting the cookie
    })
    .json({ success: true });
});

// POST /auth/forgot-password
authRouter.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body as { email: string };
    const user = await um.findUserByEmail(email);
    // Always respond 200 to avoid revealing whether the email exists
    if (!user) {
      res.sendStatus(200);
      return;
    }
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600_000); // 1 hour
    await um.setResetToken(user.id, token, expires);

    // Send email (configure SMTP transporter via environment)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: !!process.env.SMTP_SECURE,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}`;
    await transporter.sendMail({
      to: email,
      subject: 'Your Password Reset Link',
      text: `Click or paste this link to reset your password:\n\n${resetUrl}`
    });

    res.sendStatus(200);
  } catch (err) {
    console.error('Forgot password error:', err);
    res.sendStatus(500);
  }
});

// POST /auth/reset-password
authRouter.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body as { token: string; password: string };
    const user = await um.findByResetToken(token);
    if (!user) {
      res.status(400).json({ error: 'Invalid or expired token' });
      return;
    }
    const hash = await bcrypt.hash(password, 10);
    await um.updatePassword(user.id, hash);
    res.sendStatus(200);
  } catch (err) {
    console.error('Reset password error:', err);
    res.sendStatus(500);
  }
});

// POST /auth/change-password
// Protected: must include Authorization: Bearer <token>
authRouter.post('/change-password', requireAuth, async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization!;
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string };
    const userId = payload.sub;

    const { oldPassword, newPassword } = req.body as { oldPassword: string; newPassword: string };
    const user = await um.findUserById(userId);
    if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
      res.status(400).json({ error: 'Current password is incorrect' });
      return;
    }
    const hash = await bcrypt.hash(newPassword, 10);
    await um.updatePassword(user.id, hash);
    res.sendStatus(200);
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ error: 'Could not change password' });
  }
});
