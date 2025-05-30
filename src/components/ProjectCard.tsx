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
  /** Anything you pass here will appear under the badge */
  actions?: React.ReactNode;
}

export function ProjectCard({
  project,
  progress,
  isSelected,
  onClick,
  actions,
}: ProjectCardProps) {
  const startDate = parseISO(project.startDate);
  const endDate = parseISO(project.endDate);
  const today = new Date();

  const isUpcoming = isAfter(startDate, today);
  const isOverdue = isBefore(endDate, today) && progress < 100;

  const getProgressColor = () => {
    if (isOverdue) return 'bg-red-500';
    if (progress < 30) return 'bg-amber-500';
    if (progress < 70) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const formatDate = (date: Date) => format(date, 'MMM d, yyyy');

  return (
    <Card
      onClick={onClick}
      className={`h-full transition-all duration-200 cursor-pointer hover:shadow-lg hover:scale-[1.01] ${
        isSelected
          ? 'ring-2 ring-primary border-transparent shadow-md'
          : 'hover:border-primary/50'
      }`}
    >
      <CardHeader className="relative pb-2">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-lg line-clamp-2">{project.name}</h3>
          <div className="flex flex-col items-end">
            {/* priority badge */}
            <PriorityBadge priority={project.priority} />
            {/* your new actions slot */}
            {actions && <div className="mt-1">{actions}</div>}
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description}
        </p>
      </CardHeader>

      <CardContent className="py-2">
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar size={14} />
            <span>
              {formatDate(startDate)} – {formatDate(endDate)}
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

      
    </Card>
  );
}
