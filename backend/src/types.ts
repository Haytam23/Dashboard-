export interface Project {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  category: string;
  priority: 'low'|'medium'|'high';
}

export interface Task {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  assignee?: string;
  dueDate: string;
  status: 'pending'|'in-progress'|'completed';
  completedAt?: string;
}
