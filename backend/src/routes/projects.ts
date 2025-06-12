// backend/src/routes/projects.ts
import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import * as pm from '../models/projectModel';
import * as tm from '../models/taskModel';
import { Project, Tasks } from '../types';
import { requireAuth } from '../../middleware/auth';

export const projectRouter = Router();

// protect every /tasks route
projectRouter.use(requireAuth);

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
    console.log(`[PROJECT CREATE] Processing ${tasks.length} tasks for project ${id}`);
    for (const t of tasks) {
      try {
        console.log(`[PROJECT CREATE] Creating task: ${JSON.stringify(t)}`);
        const task: Tasks = {
          id: uuidv4(),
          projectId: id,
          name: t.name,
          description: t.description,
          assignee: t.assignee,
          dueDate: t.dueDate,
          status: 'in-progress',
          completedAt: undefined,
          priority: 'medium', // Default priority, can be changed later
        };
        console.log(`[PROJECT CREATE] Task object created: ${JSON.stringify(task)}`);
        await tm.createTask(task);
        console.log(`[PROJECT CREATE] Task "${t.name}" inserted successfully`);
      } catch (taskErr) {
        console.error(`[PROJECT CREATE] Failed to insert task "${t.name}":`, taskErr);
        // swallow and continue
      }
    }
  } else {
    console.log(`[PROJECT CREATE] No tasks to process for project ${id}`);
  }

  // 3) Return success
  res.status(201).json({ id });
  // no `return res...`, just fall off
});

// GET /projects/:id/tasks
projectRouter.get('/:id/tasks', async (req: Request, res: Response) => {
  try {
    console.log(`[FETCH TASKS] Fetching tasks for project: ${req.params.id}`);
    const tasks = await tm.getTasksByProject(req.params.id);
    console.log(`[FETCH TASKS] Found ${tasks.length} tasks for project ${req.params.id}`);
    res.json(tasks);
  } catch (err) {
    console.error('[FETCH TASKS] Failed to fetch tasks:', err);
    res.status(500).json({ error: 'Could not fetch tasks' });
  }
});

// backend/src/routes/projects.ts
projectRouter.delete('/:id', async (req, res) => {
  try {
    await pm.deleteProject(req.params.id);
    res.sendStatus(204);
  } catch {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

