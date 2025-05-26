import { Project, Task } from '../types';
import { mockProjects, mockTasks } from './mockData';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch all projects
 */
export const fetchProjects = async (): Promise<Project[]> => {
  // Simulate network request
  await delay(300);
  return [...mockProjects];
};

/**
 * Fetch tasks for a specific project
 */
export const fetchTasksByProjectId = async (projectId: string): Promise<Task[]> => {
  // Simulate network request
  await delay(200);
  return mockTasks.filter(task => task.projectId === projectId);
};

/**
 * Fetch all tasks
 */
export const fetchAllTasks = async (): Promise<Task[]> => {
  // Simulate network request
  await delay(300);
  return [...mockTasks];
};

/**
 * Update a task's status
 */
export const updateTaskStatus = async (
  taskId: string,
  newStatus: 'in-progress' | 'completed'
): Promise<Task> => {
  // Simulate network request
  await delay(200);
  
  // Find the task in our mock data
  const taskIndex = mockTasks.findIndex(task => task.id === taskId);
  
  if (taskIndex === -1) {
    throw new Error(`Task with id ${taskId} not found`);
  }
  
  // Update the task status
  mockTasks[taskIndex] = {
    ...mockTasks[taskIndex],
    status: newStatus
  };
  
  // Return the updated task
  return mockTasks[taskIndex];
};

/**
 * Calculate project progress based on completed tasks
 */
export const calculateProjectProgress = (projectId: string, tasks: Task[]): number => {
  const projectTasks = tasks.filter(task => task.projectId === projectId);
  
  if (projectTasks.length === 0) {
    return 0;
  }
  
  const completedTasks = projectTasks.filter(task => task.status === 'completed');
  return Math.round((completedTasks.length / projectTasks.length) * 100);
};