import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';



export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {                           // ← GOOD: returns void
  const auth = req.headers.authorization?.split(' ')[1];
  if (!auth) {
    res.sendStatus(401);
    return;                         // stop here, don’t call next()
  }

  try {
    // e.g. jwt.verify(auth, SECRET)
    (req as any).user = /* decoded payload */
    next();                         // pass control to the next middleware/route
  } catch {
    res.sendStatus(401);
    return;
  }
}