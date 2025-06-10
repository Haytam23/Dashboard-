// middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'; // Assuming you use JWT for authentication

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Allow OPTIONS requests to pass through without authentication
  if (req.method === 'OPTIONS') {
    return next();
  }

  const auth = req.headers.authorization?.split(' ')[1];

  // If no authorization header is present
  if (!auth) {
    res.sendStatus(401); // Send 401 Unauthorized status
    return; // Stop processing this request
  }

  try {
    // You need to actually verify the JWT token here.
    // Replace `SECRET` with your actual JWT secret from environment variables.
    // It's highly recommended to get this from process.env.JWT_SECRET.
    // Ensure you have dotenv.config() called in your server.ts.
    const decoded = jwt.verify(auth, process.env.JWT_SECRET as string); // Add 'as string' for TypeScript

    // Attach the decoded user payload to the request object for later use
    // You might want to extend the Request type to include 'user' for better type safety
    (req as any).user = decoded;

    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    // Log the error for debugging purposes (e.g., token expired, invalid signature)
    console.error('Authentication failed:', error);
    res.sendStatus(401); // Send 401 Unauthorized status for invalid tokens
    return; // Stop processing this request
  }
}