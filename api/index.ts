// api/index.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../backend/server';   // adjust the path if your server.ts lives elsewhere

export default function handler(req: VercelRequest, res: VercelResponse) {
  // hand every request off to your Express app
  return app(req, res);
}
