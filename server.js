import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!', timestamp: new Date().toISOString() });
});

// Basic API example
app.get('/api/data', (req, res) => {
  res.json({
    data: [
      { id: 1, title: 'Item 1', description: 'First item' },
      { id: 2, title: 'Item 2', description: 'Second item' },
    ],
    total: 2,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ API health check: http://localhost:${PORT}/api/health`);
});
