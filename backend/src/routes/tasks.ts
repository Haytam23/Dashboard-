import { Router } from 'express';
import * as tm from '../models/taskModel';

export const taskRouter = Router();

taskRouter.patch('/:id', async (req, res) => {
  const updated = await tm.updateTaskStatus(req.params.id, req.body.status);
  res.json(updated);
});
