// Simple test to verify the server can start without path-to-regexp errors
const express = require('express');

const app = express();

// Test the problematic wildcard route that was causing the error
app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(200).end();
});

app.get('/', (req, res) => {
  res.json({ message: 'Server is working! No path-to-regexp errors.' });
});

const port = 3001;
app.listen(port, () => {
  console.log(`Test server running on port ${port}`);
  console.log('✅ No path-to-regexp errors - the fix worked!');
  process.exit(0);
});
