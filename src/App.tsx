import React, { useState, useEffect, useMemo } from 'react';
import { fetchProjects, fetchAllTasks, updateTaskStatus, calculateProjectProgress } from './api/projectService';
import { Project, Task } from './types';
import { ProjectGrid } from './components/ProjectGrid';
import { TaskTable } from './components/TaskTable';
import { Navbar } from './components/Navbar';
import { ProjectSummary } from './components/ProjectSummary';
import { EmptyState } from './components/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, LayoutGrid, Table as TableIcon, ScrollText } from 'lucide-react';
import { Button } from './components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { CreateProjectModal } from '@/components/CreateProjectModal';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNewProject, setShowNewProject] = useState(false);

  const { toast } = useToast();

  // Load initial data
  useEffect(() => {
    async function loadData() {
      try {
        const [projectsData, tasksData] = await Promise.all([
          fetchProjects(),
          fetchAllTasks()
        ]);
        setProjects(projectsData);
        setTasks(tasksData);
      } catch (error) {
        console.error('Failed to load data:', error);
        toast({
          title: 'Error loading data',
          description: 'There was a problem loading the project data.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [toast]);

  // Memoized selected project and its tasks/progress
  const selectedProject = useMemo(
    () => projects.find(p => p.id === selectedProjectId) || null,
    [selectedProjectId, projects]
  );

  const projectTasks = useMemo(
    () => tasks.filter(t => t.projectId === selectedProjectId),
    [selectedProjectId, tasks]
  );

  const projectProgress = useMemo(
    () => selectedProjectId ? calculateProjectProgress(selectedProjectId, tasks) : 0,
    [selectedProjectId, tasks]
  );

  // Toggle task status handler
  const handleToggleStatus = async (taskId: string, newStatus: 'in-progress' | 'completed') => {
    try {
      const updatedTask = await updateTaskStatus(taskId, newStatus);
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
      toast({
        title: newStatus === 'completed' ? 'Task completed' : 'Task reopened',
        description: `"${updatedTask.name}" has been ${newStatus === 'completed' ? 'completed' : 'reopened'}.`,
      });
    } catch {
      toast({
        title: 'Error updating task',
        description: 'Could not update task status.',
        variant: 'destructive',
      });
    }
  };

  // Back to overview
  const handleBackClick = () => setSelectedProjectId(null);

  // Create project callback
  const onCreateProject = (data: any) => {
    const newProject: Project & { tasks: Task[] } = {
      id: uuidv4(),
      ...data,
      tasks: data.tasks.map((task: any) => ({
        ...task,
        id: uuidv4(),
        status: 'pending',
      })),
    };
    setProjects(prev => [newProject, ...prev]);
    setShowNewProject(false);
    toast({
      title: 'Project created',
      description: `Project "${data.name}" has been added.`,
    });
  };

  // Render loading skeletons
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto py-8 px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(6).fill(null).map((_, i) => (
              <div key={i} className="border rounded-lg p-4 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto py-8 px-4">
        {selectedProject ? (
          <div className="space-y-6 animate-in fade-in-50 duration-300">
            <Button variant="ghost" size="sm" onClick={handleBackClick} className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Projects</span>
            </Button>

            <ProjectSummary
              project={selectedProject}
              tasks={projectTasks}
              progress={projectProgress}
            />

            <Tabs defaultValue="list" className="w-full">
              <TabsList>
                <TabsTrigger value="list"><TableIcon className="h-4 w-4" /> Task List</TabsTrigger>
                <TabsTrigger value="details"><ScrollText className="h-4 w-4" /> Project Details</TabsTrigger>
              </TabsList>

              <TabsContent value="list" className="mt-6">
                <TaskTable
                  project={selectedProject}
                  tasks={projectTasks}
                  onToggleStatus={handleToggleStatus}
                />
              </TabsContent>
              <TabsContent value="details" className="mt-6">
                <EmptyState
                  title="Project details"
                  description="Analytics coming soon."
                />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Projects Overview</h1>
              <Button onClick={() => setShowNewProject(true)} className="gap-2">
                <LayoutGrid className="h-4 w-4" />
                <span>New Project</span>
              </Button>
            </div>

            <Separator className="my-6" />

            {projects.length === 0 ? (
              <EmptyState
                title="No projects found"
                description="Get started by creating your first project."
                action={{
                  label: 'Create Project',
                  onClick: () => setShowNewProject(true),
                }}
              />
            ) : (
              <ProjectGrid
                projects={projects}
                tasks={tasks}
                selectedProjectId={selectedProjectId}
                onSelectProject={setSelectedProjectId}
              />
            )}
          </>
        )}
      </main>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={showNewProject}
        onClose={() => setShowNewProject(false)}
        onCreate={onCreateProject}
      />

      <Toaster />
    </div>
  );
}

export default App;
