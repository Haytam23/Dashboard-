// backend/src/routes/projects.ts
import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import * as pm from '../models/projectModel';
import * as tm from '../models/taskModel';
import { Project, Task } from '../types';

export const projectRouter = Router();

// GET /projects
projectRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const projects = await pm.getAllProjects();
    res.json(projects);
  } catch (err) {
    console.error('Failed to fetch projects:', err);
    res.status(500).json({ error: 'Could not fetch projects' });
  }
});

// POST /projects
projectRouter.post('/', async (req: Request, res: Response) => {
  const id = uuidv4();

  type IncomingTask = {
    name: string;
    description?: string;
    assignee?: string;
    dueDate: string;
  };

  const {
    name,
    description,
    startDate,
    endDate,
    category,
    priority,
    tasks,
  } = req.body as {
    name: string;
    description?: string;
    startDate: string;
    endDate: string;
    category: string;
    priority: string;
    tasks?: IncomingTask[];
  };

  // 1) Insert project
  try {
    const project: Project = {
      id,
      name,
      description,
      startDate,
      endDate,
      category,
      priority: priority as any,
    };
    await pm.createProject(project);
  } catch (err) {
    console.error('Project insert failed:', err);
    res.status(500).json({ error: 'Failed to create project' });
    return;                  // <— stop further execution, but don’t return res
  }

  // 2) Insert tasks if any
  if (Array.isArray(tasks) && tasks.length) {
    for (const t of tasks) {
      try {
        const task: Task = {
          id: uuidv4(),
          projectId: id,
          name: t.name,
          description: t.description,
          assignee: t.assignee,
          dueDate: t.dueDate,
          status: 'pending',
          completedAt: undefined,
        };
        await tm.createTask(task);
      } catch (taskErr) {
        console.error(`Failed to insert task "${t.name}":`, taskErr);
        // swallow and continue
      }
    }
  }

  // 3) Return success
  res.status(201).json({ id });
  // no `return res...`, just fall off
});

// GET /projects/:id/tasks
projectRouter.get('/:id/tasks', async (req: Request, res: Response) => {
  try {
    const tasks = await tm.getTasksByProject(req.params.id);
    res.json(tasks);
  } catch (err) {
    console.error('Failed to fetch tasks:', err);
    res.status(500).json({ error: 'Could not fetch tasks' });
  }
});
