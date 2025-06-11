

// src/api/projectService.ts

import { Project, Tasks } from "@/types";

// import type { Project, Tasks } from '../types';

// const BASE = import.meta.env.VITE_API_URL;

// /**
//  * Fetch all projects from backend
//  */
// export async function fetchProjects(): Promise<Project[]> {
//   const res = await fetch(`${BASE}/projects`);
//   if (!res.ok) throw new Error(`Error fetching projects: ${res.statusText}`);
//   return res.json();
// }

// /**
//  * Create a new project (with optional initial tasks)
//  */
// export async function createProject(data: {
//   name: string;
//   description?: string;
//   startDate: string;
//   endDate: string;
//   category: string;
//   priority: 'low' | 'medium' | 'high';
//   tasks?: Array<{
//     title: string;
//     description?: string;
//     assignee?: string;
//     dueDate: string;
//   }>;
// }): Promise<{ id: string }> {
//   // Remap our `title` → DB’s `name`
//   const payload = {
//     name: data.name,
//     description: data.description,
//     startDate: data.startDate,
//     endDate: data.endDate,
//     category: data.category,
//     priority: data.priority,
//     tasks: data.tasks?.map(t => ({
//       name: t.title,
//       description: t.description,
//       assignee: t.assignee,
//       dueDate: t.dueDate,
//     })) ?? [],
//   };

//   const res = await fetch(`${BASE}/projects`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(payload),
//   });
//   if (!res.ok) throw new Error(`Error creating project: ${res.statusText}`);
//   return res.json() as Promise<{ id: string }>;
// }

// /**
//  * Fetch tasks for a specific project
//  */
// export async function fetchTasksByProjectId(projectId: string): Promise<Tasks[]> {
//   const res = await fetch(`${BASE}/projects/${projectId}/tasks`);
//   if (!res.ok) throw new Error(`Error fetching tasks: ${res.statusText}`);
//   return res.json();
// }

// /**
//  * Update a task's status
//  */
// // export async function updateTaskStatus(
// //   taskId: string,
// //   newStatus: 'in-progress' | 'completed'
// // ): Promise<Tasks> {
// //   const res = await fetch(`${BASE}/tasks/${taskId}`, {
// //     method: 'PATCH',
// //     headers: { 'Content-Type': 'application/json' },
// //     body: JSON.stringify({ status: newStatus }),
// //   });
// //   if (!res.ok) throw new Error(`Error updating task: ${res.statusText}`);
// //   return res.json();
// // }
// export async function updateTaskStatus(
//   taskId: string,
//   newStatus: 'in-progress'|'completed'
// ): Promise<Tasks> {
//   // PATCH /tasks/:id/status
//   const res = await fetch(`${BASE}/tasks/${taskId}/status`, {
//     method: 'PATCH',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ status: newStatus })
//   });
//   if (!res.ok) throw new Error(`Error updating task status: ${res.statusText}`);
//   return res.json();
// }
// /**
//  * Calculate project progress on the client side
//  */

// export function calculateProjectProgress(
//   projectId: string,
//   tasks: Tasks[]
// ): number {
//   const projectTasks = tasks.filter(t => t.projectId === projectId)
//   if (projectTasks.length === 0) return 0
//   const completed = projectTasks.filter(t => t.status === 'completed').length
//   return Math.round((completed / projectTasks.length) * 100)
// }
// export async function deleteTask(taskId: string): Promise<void> {
//   const res = await fetch(`${BASE}/tasks/${taskId}`, { method: 'DELETE' });
//   if (!res.ok) throw new Error(`Error deleting task: ${res.statusText}`);
// }

// export async function deleteProject(projectId: string): Promise<void> {
//   const res = await fetch(`${BASE}/projects/${projectId}`, {
//     method: 'DELETE',
//   });
//   if (!res.ok) {
//     throw new Error(`Error deleting project: ${res.statusText}`);
//   }
// }


// // src/api/projectService.ts
// const API_BASE = 'http://localhost:4000';

// // function getAuthHeaders() {
// //   const token = localStorage.getItem('token');       // or import a helper from your AuthContext
// //   return token
// //     ? { Authorization: `Bearer ${token}` }
// //     : {};
// // }
// import type { Project, Tasks } from '../types';

// const BASE = import.meta.env.VITE_API_URL!;
// function authHeaders() {
//   const token = localStorage.getItem('token');
//   return {
//     'Content-Type': 'application/json',
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//   };
// }

// async function handleResponse(res: Response) {
//   if (res.status === 401) {
//     // token missing/invalid → force login
//     window.location.href = '/login';
//     return Promise.reject(new Error('Unauthorized'));
//   }
//   if (!res.ok) {
//     const err = await res.json().catch(() => null);
//     throw new Error(err?.error || res.statusText);
//   }
//   return res.json();
// }

// /**
//  * Fetch all projects from backend
//  */
// export async function fetchProjects(): Promise<Project[]> {
//   const res = await fetch(`${BASE}/projects`, {
//     headers: authHeaders(),
//   });
//   return handleResponse(res);
// }

// /**
//  * Create a new project (with optional initial tasks)
//  */
// export async function createProject(data: {
//   name: string;
//   description?: string;
//   startDate: string;
//   endDate: string;
//   category: string;
//   priority: 'low' | 'medium' | 'high';
//   tasks?: Array<{
//     name: string;
//     description?: string;
//     assignee?: string;
//     dueDate: string;
//     status?: 'pending' | 'in-progress' | 'completed';
//   }>;
// }): Promise<{ id: string }> {
//   const res = await fetch(`${BASE}/projects`, {
//     method: 'POST',
//     headers: authHeaders(),
//     body: JSON.stringify(data),
//   });
//   return handleResponse(res);
// }

// /**
//  * Fetch tasks for a specific project
//  */
// export async function fetchTasksByProjectId(
//   projectId: string
// ): Promise<Tasks[]> {
//   const res = await fetch(`${BASE}/projects/${projectId}/tasks`, {
//     headers: authHeaders(),
//   });
//   return handleResponse(res);
// }

// /**
//  * Fetch all tasks
//  */
// export async function fetchAllTasks(): Promise<Tasks[]> {
//   const res = await fetch(`${BASE}/tasks`, {
//     headers: authHeaders(),
//   });
//   return handleResponse(res);
// }

// /**
//  * Update a task's status
//  */

// export async function updateTaskStatus(taskId: string, newStatus: string) {
//   const url = `${API_BASE}/tasks/${taskId}/status`;
//   console.log('PATCH →', url);

//   // Build a string-to-string map explicitly
//   const token = localStorage.getItem('token');
//   const headers: Record<string, string> = {
//     'Content-Type': 'application/json',
//   };
//   if (token) {
//     headers['Authorization'] = `Bearer ${token}`;
//   }

//   const res = await fetch(url, {
//     method: 'PATCH',
//     headers,                // now a proper Record<string,string>
//     body: JSON.stringify({ status: newStatus }),
//   });

//   if (res.status === 401) {
//     localStorage.removeItem('token');
//     window.location.replace('/login');
//     throw new Error('Not authorized');
//   }
//   if (res.status === 404) {
//     throw new Error(`Task ${taskId} not found (404)`);
//   }
//   if (!res.ok) {
//     throw new Error(`Error ${res.status}: ${res.statusText}`);
//   }

//   return res.json();
// }

// /**
//  * Calculate project progress on the client side
//  */


// /**
//  * Delete a task
//  */
// export async function deleteTask(taskId: string): Promise<void> {
//   const res = await fetch(`${BASE}/tasks/${taskId}`, {
//     method: 'DELETE',
//     headers: authHeaders(),
//   });
//   if (res.status === 401) {
//     window.location.href = '/login';
//     return Promise.reject(new Error('Unauthorized'));
//   }
//   if (!res.ok) throw new Error(res.statusText);
// }

// /**
//  * Delete a project
//  */
// export async function deleteProject(projectId: string): Promise<void> {
//   const res = await fetch(`${BASE}/projects/${projectId}`, {
//     method: 'DELETE',
//     headers: authHeaders(),
//   });
//   if (res.status === 401) {
//     window.location.href = '/login';
//     return Promise.reject(new Error('Unauthorized'));
//   }
//   if (!res.ok) throw new Error(res.statusText);
// }

// /**
//  * Calculate project progress on the client side
//  */
// export function calculateProjectProgress(
//   projectId: string,
//   tasks: Tasks[]
// ): number {
//   const projectTasks = tasks.filter((t) => t.projectId === projectId);
//   if (projectTasks.length === 0) return 0;
//   const completed = projectTasks.filter((t) => t.status === 'completed').length;
//   return Math.round((completed / projectTasks.length) * 100);
// }

// src/api/projectService.ts

// REMOVE this line: const API_BASE = 'http://localhost:4000';

// This is correct:
const BASE = import.meta.env.VITE_API_URL!;

// Ensure this is exactly what you want your Vercel frontend to fetch from.
// Example: If your backend is deployed at https://my-backend-api.vercel.app,
// then VITE_API_URL should be set to 'https://my-backend-api.vercel.app'
// and your backend routes should look like '/api/projects' etc.

function authHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse(res: Response) {
  if (res.status === 401) {
    // token missing/invalid → force login
    window.location.href = '/login';
    return Promise.reject(new Error('Unauthorized'));
  }
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error || res.statusText);
  }
  return res.json();
}

/**
 * Fetch all projects from backend
 */
export async function fetchProjects(): Promise<Project[]> {
  const res = await fetch(`${BASE}/projects`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
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
    name: string;
    description?: string;
    assignee?: string;
    dueDate: string;
    status?: 'pending' | 'in-progress' | 'completed';
  }>;
}): Promise<{ id: string }> {
  const res = await fetch(`${BASE}/projects`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

/**
 * Fetch tasks for a specific project
 */
export async function fetchTasksByProjectId(
  projectId: string
): Promise<Tasks[]> {
  const res = await fetch(`${BASE}/projects/${projectId}/tasks`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

/**
 * Fetch all tasks
 */
export async function fetchAllTasks(): Promise<Tasks[]> {
  const res = await fetch(`${BASE}/tasks`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

/**
 * Update a task's status
 */
export async function updateTaskStatus(taskId: string, newStatus: string) {
  // Use BASE here, not the removed API_BASE
  const url = `${BASE}/tasks/${taskId}/status`; // <-- Corrected
  console.log('PATCH →', url);

  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ status: newStatus }),
  });

  if (res.status === 401) {
    localStorage.removeItem('token');
    window.location.replace('/login');
    throw new Error('Not authorized');
  }
  if (res.status === 404) {
    throw new Error(`Task ${taskId} not found (404)`);
  }
  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

/**
 * Delete a task
 */
export async function deleteTask(taskId: string): Promise<void> {
  const res = await fetch(`${BASE}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (res.status === 401) {
    window.location.href = '/login';
    return Promise.reject(new Error('Unauthorized'));
  }
  if (!res.ok) throw new Error(res.statusText);
}

/**
 * Delete a project
 */
export async function deleteProject(projectId: string): Promise<void> {
  const res = await await fetch(`${BASE}/projects/${projectId}`, { // Removed extra 'await'
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (res.status === 401) {
    window.location.href = '/login';
    return Promise.reject(new Error('Unauthorized'));
  }
  if (!res.ok) throw new Error(res.statusText);
}

/**
 * Calculate project progress on the client side
 */
export function calculateProjectProgress(
  projectId: string,
  tasks: Tasks[]
): number {
  const projectTasks = tasks.filter((t) => t.projectId === projectId);
  if (projectTasks.length === 0) return 0;
  const completed = projectTasks.filter((t) => t.status === 'completed').length;
  return Math.round((completed / projectTasks.length) * 100);
}