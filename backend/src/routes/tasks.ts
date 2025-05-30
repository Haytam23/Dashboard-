import { Router } from 'express';
import * as tm from '../models/taskModel';
import type { Tasks } from '../types'; // <-- Use Task, not Tasks
import { requireAuth } from '../../middleware/auth';

export const taskRouter = Router();

// Protect all /tasks routes
taskRouter.use(requireAuth);

// PATCH /tasks/:id (status only)
taskRouter.patch('/:id/status', async (req, res) => {
  try {
    const updated = await tm.updateTaskStatus(req.params.id, req.body.status);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Could not update task status' });
  }
});

// DELETE /tasks/:id
taskRouter.delete('/:id', async (req, res) => {
  try {
    await tm.deleteTask(req.params.id);
    res.sendStatus(204);
  } catch {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

