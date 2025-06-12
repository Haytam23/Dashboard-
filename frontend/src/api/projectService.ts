

// src/api/projectService.ts

import { Project, Tasks } from "@/types";


// This is correct:
const BASE = import.meta.env.VITE_API_URL!;

// Ensure this is exactly what you want your Vercel frontend to fetch from.
// Example: If your backend is deployed at https://my-backend-api.vercel.app,
// then VITE_API_URL should be set to 'https://my-backend-api.vercel.app'
// and your backend routes should look like '/api/projects' etc.

// Safari detection utility
const isiOSSafari = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && /Safari/.test(navigator.userAgent);
};

const isSafari = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  return /safari/.test(userAgent) && !/chrome/.test(userAgent) && !/android/.test(userAgent);
};

function authHeaders() {
  // Since we're using HttpOnly cookies for authentication,
  // we don't need to set Authorization headers
  return {
    'Content-Type': 'application/json',
  };
}

async function handleResponse(res: Response) {
  if (res.status === 401) {
    // Check if we're on Safari with fallback auth before redirecting
    const isUsingSafari = isiOSSafari() || isSafari();
    const hasSafariFallback = localStorage.getItem('auth-safari-fallback');
    
    if (isUsingSafari && hasSafariFallback) {
      console.log('🍎 Safari: API call got 401 but we have fallback auth');
      // Throw a special error that components can handle gracefully
      throw new Error('SAFARI_COOKIE_BLOCKED');
    }
    
    // For non-Safari or Safari without fallback, redirect to login
    console.log('❌ API: 401 unauthorized, redirecting to login');
    window.location.href = '/login';
    return Promise.reject(new Error('Unauthorized'));
  }
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error || res.statusText);
  }
  return res.json();
}


export async function fetchProjects(): Promise<Project[]> {
  const res = await fetch(`${BASE}/projects`, {
    headers: authHeaders(),
    credentials: 'include', // Add this line
  });
  return handleResponse(res);
}

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
    credentials: 'include', // Add this line
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function fetchTasksByProjectId(
  projectId: string
): Promise<Tasks[]> {
  const res = await fetch(`${BASE}/projects/${projectId}/tasks`, {
    headers: authHeaders(),
    credentials: 'include', // Add this line
  });
  return handleResponse(res);
}

export async function fetchAllTasks(): Promise<Tasks[]> {
  const res = await fetch(`${BASE}/tasks`, {
    headers: authHeaders(),
    credentials: 'include', // Add this line
  });
  return handleResponse(res);
}

export async function updateTaskStatus(taskId: string, newStatus: string) {
  const url = `${BASE}/tasks/${taskId}/status`;
  console.log('PATCH →', url);

  const res = await fetch(url, {
    method: 'PATCH',
    headers: authHeaders(),
    credentials: 'include',
    body: JSON.stringify({ status: newStatus }),
  });

  if (res.status === 401) {
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

export async function deleteTask(taskId: string): Promise<void> {
  const res = await fetch(`${BASE}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: authHeaders(),
    credentials: 'include', // Add this line
  });
  if (res.status === 401) {
    window.location.href = '/login';
    return Promise.reject(new Error('Unauthorized'));
  }
  if (!res.ok) throw new Error(res.statusText);
}

export async function deleteProject(projectId: string): Promise<void> {
  const res = await fetch(`${BASE}/projects/${projectId}`, {
    method: 'DELETE',
    headers: authHeaders(),
    credentials: 'include', // Add this line
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