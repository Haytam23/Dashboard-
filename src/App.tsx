// src/App.tsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  fetchProjects,
  createProject,
  fetchTasksByProjectId,
  updateTaskStatus,
  calculateProjectProgress
} from './api/projectService';
import { Project, Tasks } from './types';
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
import { CreateProjectModal } from '@/components/CreateProjectModal';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Tasks[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);

  const { toast } = useToast();

  // 1️⃣ Fetch projects on mount
  useEffect(() => {
    async function loadProjects() {
      try {
        const pr = await fetchProjects();
        setProjects(pr);
      } catch (err) {
        console.error(err);
        toast({
          title: 'Error loading projects',
          description: 'Could not fetch projects.',
          variant: 'destructive',
        });
      } finally {
        setLoadingProjects(false);
      }
    }
    loadProjects();
  }, [toast]);

  // 2️⃣ Whenever a project is selected, fetch its tasks
  useEffect(() => {
    if (!selectedProjectId) return;

    setLoadingTasks(true);
    async function loadTasks() {
      try {
        const t = await fetchTasksByProjectId(selectedProjectId as string);
        setTasks(t);
      } catch (err) {
        console.error(err);
        toast({
          title: 'Error loading tasks',
          description: 'Could not fetch tasks for this project.',
          variant: 'destructive',
        });
      } finally {
        setLoadingTasks(false);
      }
    }
    loadTasks();
  }, [selectedProjectId, toast]);

  // Memoized selected project and its progress
  const selectedProject = useMemo(
    () => projects.find(p => p.id === selectedProjectId) || null,
    [selectedProjectId, projects]
  );

  const projectProgress = useMemo(
    () => selectedProjectId ? calculateProjectProgress(selectedProjectId, tasks) : 0,
    [selectedProjectId, tasks]
  );

  // Toggle task status
  const handleToggleStatus = async (taskId: string, newStatus: 'in-progress' | 'completed') => {
    try {
      const updated = await updateTaskStatus(taskId, newStatus);
      setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
      toast({
        title: newStatus === 'completed' ? 'Task completed' : 'Task reopened',
        description: `"${updated.name}" has been ${newStatus}.`,
      });
    } catch {
      toast({
        title: 'Error updating task',
        description: 'Could not update status.',
        variant: 'destructive',
      });
    }
  };

  // Back to overview
  const handleBackClick = () => {
    setSelectedProjectId(null);
    setTasks([]);
  };

  // Create project callback
  const onCreateProject = async (data: any) => {
    try {
      // persist to backend
      const { id } = await createProject(data);
      // optimistically add to UI
      setProjects(prev => [{ id, ...data }, ...prev]);
      setShowNewProject(false);
      toast({
        title: 'Project created',
        description: `Project "${data.name}" created successfully.`,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error creating project',
        description: 'Could not create project.',
        variant: 'destructive',
      });
    }
  };

  // Loading state for projects
  if (loadingProjects) {
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
              tasks={tasks}
              progress={projectProgress}
            />

            <Tabs defaultValue="list" className="w-full">
              <TabsList>
                <TabsTrigger value="list">
                  <TableIcon className="h-4 w-4" /> Task List
                </TabsTrigger>
                <TabsTrigger value="details">
                  <ScrollText className="h-4 w-4" /> Project Details
                </TabsTrigger>
              </TabsList>

              <TabsContent value="list" className="mt-6">
                {loadingTasks ? (
                  <Skeleton className="h-48 w-full" />
                ) : (
                  <TaskTable
                    project={selectedProject}
                    tasks={tasks}
                    onToggleStatus={handleToggleStatus}
                  />
                )}
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
