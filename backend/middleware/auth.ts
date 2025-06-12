// backend/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Allow OPTIONS requests to pass through without authentication
  if (req.method === 'OPTIONS') {
    console.log('requireAuth: OPTIONS request detected, bypassing authentication.');
    return next(); // Crucial for preflight requests
  }

  const auth = req.headers.authorization?.split(' ')[1];

  if (!auth) {
    console.warn('requireAuth: No authorization token found, sending 401.');
    res.sendStatus(401);
    return;
  }

  try {
    const decoded = jwt.verify(auth, process.env.JWT_SECRET as string);
    (req as any).user = decoded;
    console.log('requireAuth: Token successfully verified for user:', (decoded as any).id);
    next();
  } catch (error) {
    console.error('requireAuth: Authentication failed during token verification:', error);
    res.sendStatus(401);
    return;
  }
}