export interface Tasks {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  assignee: string;
  dueDate: string;
  status: 'in-progress' | 'completed';
  completedAt?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
}