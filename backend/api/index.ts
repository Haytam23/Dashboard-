// API endpoint for Vercel serverless functions - root
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json({
      message: 'Dashboard Backend API is working!',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      endpoints: [
        'GET /api/health - Health check',
        'POST /api/auth/login - User login',
        'POST /api/auth/register - User registration',
        'GET /api/projects - List projects (auth required)',
        'POST /api/projects - Create project (auth required)',
        'GET /api/tasks - List tasks (auth required)',
        'POST /api/tasks - Create task (auth required)'
      ]
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
