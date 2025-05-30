import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { projectRouter } from './routes/projects';
import { taskRouter } from './routes/tasks';
import { authRouter } from './routes/auth';
import { requireAuth } from '../middleware/auth';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();

// app.use(cors());
app.use(cors({
  origin: 'http://localhost:5173',   // your Vite dev URL
  credentials: true,                 // allow cookies
}));
app.use(cookieParser());
app.use(express.json());

// Public auth endpoints
app.use('/auth', authRouter);

// Protected resource endpoints
app.use(requireAuth);                // Protect all routes below this middleware
app.use('/projects', projectRouter);
app.use('/tasks',    taskRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
