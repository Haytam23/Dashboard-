import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ProgressWithText } from '@/components/ui/progress-with-text';
import { PriorityBadge } from '@/components/PriorityBadge';
import { formatDistanceToNow, format, isAfter, isBefore, parseISO } from 'date-fns';
import { Project } from '@/types';
import { ClipboardList, Calendar } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  progress: number;
  isSelected: boolean;
  onClick: () => void;
}

export function ProjectCard({ project, progress, isSelected, onClick }: ProjectCardProps) {
  const startDate = parseISO(project.startDate);
  const endDate = parseISO(project.endDate);
  const today = new Date();
  
  // Determine project timeline status
  const isUpcoming = isAfter(startDate, today);
  const isOverdue = isBefore(endDate, today) && progress < 100;
  
  // Get progress indicator color based on status and progress
  const getProgressColor = () => {
    if (isOverdue) return 'bg-red-500';
    if (progress < 30) return 'bg-amber-500';
    if (progress < 70) return 'bg-blue-500';
    return 'bg-green-500';
  };
  
  // Format date for display
  const formatDate = (date: Date) => format(date, 'MMM d, yyyy');

  return (
    <Card 
      className={`h-full transition-all duration-200 cursor-pointer hover:shadow-lg hover:scale-[1.01] ${
        isSelected 
          ? 'ring-2 ring-primary border-transparent shadow-md' 
          : 'hover:border-primary/50'
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-lg line-clamp-2">{project.name}</h3>
          <PriorityBadge priority={project.priority} />
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
      </CardHeader>
      
      <CardContent className="py-2">
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar size={14} />
            <span>
              {formatDate(startDate)} - {formatDate(endDate)}
            </span>
          </div>
          
          {isUpcoming && (
            <div className="text-sm text-blue-600 font-medium">
              Starts {formatDistanceToNow(startDate, { addSuffix: true })}
            </div>
          )}
          
          {isOverdue && (
            <div className="text-sm text-red-600 font-medium">
              Overdue by {formatDistanceToNow(endDate)}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sm">
              <ClipboardList size={14} />
              <span>Progress</span>
            </div>
            <span className="text-sm font-medium">
              {progress}%
            </span>
          </div>
          <ProgressWithText 
            value={progress} 
            showText={false}
            indicatorColor={getProgressColor()}
          />
        </div>
      </CardFooter>
    </Card>
  );
}