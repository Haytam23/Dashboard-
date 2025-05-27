// import { Project, Task } from '../types';
// import { mockProjects, mockTasks } from './mockData';

// // Simulated API delay
// const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// /**
//  * Fetch all projects
//  */
// export const fetchProjects = async (): Promise<Project[]> => {
//   // Simulate network request
//   await delay(300);
//   return [...mockProjects];
// };

// /**
//  * Fetch tasks for a specific project
//  */
// export const fetchTasksByProjectId = async (projectId: string): Promise<Task[]> => {
//   // Simulate network request
//   await delay(200);
//   return mockTasks.filter(task => task.projectId === projectId);
// };

// /**
//  * Fetch all tasks
//  */
// export const fetchAllTasks = async (): Promise<Task[]> => {
//   // Simulate network request
//   await delay(300);
//   return [...mockTasks];
// };

// /**
//  * Update a task's status
//  */
// export const updateTaskStatus = async (
//   taskId: string,
//   newStatus: 'in-progress' | 'completed'
// ): Promise<Task> => {
//   // Simulate network request
//   await delay(200);
  
//   // Find the task in our mock data
//   const taskIndex = mockTasks.findIndex(task => task.id === taskId);
  
//   if (taskIndex === -1) {
//     throw new Error(`Task with id ${taskId} not found`);
//   }
  
//   // Update the task status
//   mockTasks[taskIndex] = {
//     ...mockTasks[taskIndex],
//     status: newStatus
//   };
  
//   // Return the updated task
//   return mockTasks[taskIndex];
// };

// /**
//  * Calculate project progress based on completed tasks
//  */
// export const calculateProjectProgress = (projectId: string, tasks: Task[]): number => {
//   const projectTasks = tasks.filter(task => task.projectId === projectId);
  
//   if (projectTasks.length === 0) {
//     return 0;
//   }
  
//   const completedTasks = projectTasks.filter(task => task.status === 'completed');
//   return Math.round((completedTasks.length / projectTasks.length) * 100);
// };



// src/api/projectService.ts

import type { Project, Tasks } from '../types';

const BASE = import.meta.env.VITE_API_URL;

/**
 * Fetch all projects from backend
 */
export async function fetchProjects(): Promise<Project[]> {
  const res = await fetch(`${BASE}/projects`);
  if (!res.ok) throw new Error(`Error fetching projects: ${res.statusText}`);
  return res.json();
}

/**
 * Create a new project (with optional initial tasks)
 */
export async function createProject(data: {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  tasks?: Array<{
    title: string;
    description?: string;
    assignee?: string;
    dueDate: string;
  }>;
}): Promise<{ id: string }> {
  // Remap our `title` → DB’s `name`
  const payload = {
    name: data.name,
    description: data.description,
    startDate: data.startDate,
    endDate: data.endDate,
    category: data.category,
    priority: data.priority,
    tasks: data.tasks?.map(t => ({
      name: t.title,
      description: t.description,
      assignee: t.assignee,
      dueDate: t.dueDate,
    })) ?? [],
  };

  const res = await fetch(`${BASE}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Error creating project: ${res.statusText}`);
  return res.json() as Promise<{ id: string }>;
}

/**
 * Fetch tasks for a specific project
 */
export async function fetchTasksByProjectId(projectId: string): Promise<Tasks[]> {
  const res = await fetch(`${BASE}/projects/${projectId}/tasks`);
  if (!res.ok) throw new Error(`Error fetching tasks: ${res.statusText}`);
  return res.json();
}

/**
 * Update a task's status
 */
export async function updateTaskStatus(
  taskId: string,
  newStatus: 'in-progress' | 'completed'
): Promise<Tasks> {
  const res = await fetch(`${BASE}/tasks/${taskId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus }),
  });
  if (!res.ok) throw new Error(`Error updating task: ${res.statusText}`);
  return res.json();
}

/**
 * Calculate project progress on the client side
 */
export function calculateProjectProgress(projectId: string, tasks: Tasks[]): number {
  const projectTasks = tasks.filter(t => t.projectId === projectId);
  if (projectTasks.length === 0) return 0;
  const completed = projectTasks.filter(t => t.status === 'completed').length;
  return Math.round((completed / projectTasks.length) * 100);
}
