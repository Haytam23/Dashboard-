// Minimal debug server for Vercel
import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.json({ 
    message: 'Debug server working!', 
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'Debug health check working!', 
    timestamp: new Date().toISOString()
  });
});

export default app;
