import React from 'react';
import { format, formatDistance, parseISO } from 'date-fns';
import { Project, Tasks } from '../types';
import { ProgressWithText } from '@/components/ui/progress-with-text';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PriorityBadge } from './PriorityBadge';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  LayoutList, 
  Users, 
  Tag 
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip
} from 'recharts';


interface ProjectSummaryProps {
  project: Project;
  tasks: Tasks[];
  progress: number;
  onDelete?: (projectId: string) => void;
  
}

export function ProjectSummary({ project, tasks, progress ,onDelete}: ProjectSummaryProps) {
  const startDate = parseISO(project.startDate);
  const endDate = parseISO(project.endDate);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = totalTasks - completedTasks;

  // Get unique assignees and their task counts
  const assigneeStats = tasks.reduce((acc, task) => {
    acc[task.assignee] = (acc[task.assignee] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const assigneeData = Object.entries(assigneeStats).map(([name, count]) => ({
    name,
    tasks: count,
  }));

  // Task status data for pie chart
  const statusData = [
    { name: 'Completed', value: completedTasks },
    { name: 'In Progress', value: inProgressTasks },
  ];

  const COLORS = ['hsl(var(--neon-green))', 'hsl(var(--neon-blue))'];

  // Calculate time remaining
  const timeRemaining = formatDistance(endDate, new Date(), { addSuffix: true });

  // --- FIX: Generate lineData for completed tasks over time ---
  // Group completed tasks by completion date
  const completedTasksByDate: Record<string, number> = {};
  tasks.forEach(task => {
    if (task.status === 'completed' && task.completedAt) {
      const date = format(parseISO(task.completedAt), 'yyyy-MM-dd');
      completedTasksByDate[date] = (completedTasksByDate[date] || 0) + 1;
    }
  });

  // Create a sorted array of dates and cumulative completed tasks
  const sortedDates = Object.keys(completedTasksByDate).sort();
  let cumulative = 0;
  const lineData = sortedDates.map(date => {
    cumulative += completedTasksByDate[date];
    return { date, completed: cumulative };
  });

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="card glow md:col-span-2">
        <CardHeader className="pb-2">
          <div className="flex flex-wrap gap-2 justify-between items-start">
            <CardTitle className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--neon-blue))] to-[hsl(var(--neon-purple))]">
              {project.name}
            </CardTitle>
            <div className="flex items-center gap-4">
              <PriorityBadge priority={project.priority} />
             
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">{project.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-[hsl(var(--neon-blue))]" />
                  <span className="text-muted-foreground">Timeline:</span>
                  <span>
                    {format(startDate, 'MMM d, yyyy')} - {format(endDate, 'MMM d, yyyy')}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-[hsl(var(--neon-purple))]" />
                  <span className="text-muted-foreground">Remaining Time:</span>
                  <span>{timeRemaining}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="h-4 w-4 text-[hsl(var(--neon-pink))]" />
                  <span className="text-muted-foreground">Category:</span>
                  <span>{project.category}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <LayoutList className="h-4 w-4 text-[hsl(var(--neon-green))]" />
                  <span className="text-muted-foreground">Task Completion:</span>
                  <span>
                    {completedTasks} of {totalTasks} tasks completed
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-[hsl(var(--neon-yellow))]" />
                  <span className="text-muted-foreground">Progress:</span>
                  <span>{progress}% complete</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-[hsl(var(--neon-blue))]" />
                  <span className="text-muted-foreground">Team Members:</span>
                  <span>{Object.keys(assigneeStats).length} assignees</span>
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <div className="text-sm mb-2">Overall Progress</div>
              <ProgressWithText 
                value={progress} 
                indicatorColor="bg-gradient-to-r from-[hsl(var(--neon-blue))] to-[hsl(var(--neon-purple))]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      
  {/* Completed Tasks Over Time Line Chart */}
      <Card className="card glow">
        <CardHeader><CardTitle>Completed Tasks Over Time</CardTitle></CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {lineData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--foreground))" tick={{ fill: 'hsl(var(--foreground))' }} />
                  <YAxis allowDecimals={false} stroke="hsl(var(--foreground))" tick={{ fill: 'hsl(var(--foreground))' }}/>
                  <ReTooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}/>
                  <Line type="monotone" dataKey="completed" stroke="hsl(var(--neon-green))" strokeWidth={2} dot={{ r: 3 }}/>
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                No completed-task data yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      {/* Task Status Chart */}
      <Card className="card glow">
        <CardHeader>
          <CardTitle className="text-lg">Task Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ReTooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}