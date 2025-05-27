import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { projectRouter } from './routes/projects';
import { taskRouter } from './routes/tasks';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/projects', projectRouter);
app.use('/tasks',    taskRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
