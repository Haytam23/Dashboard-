import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PriorityBadge } from '@/components/PriorityBadge';
import { formatDistanceToNow, format, isAfter, isBefore, parseISO } from 'date-fns';
import { Project } from '../../backend/src/types';
import { Calendar } from 'lucide-react';

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

  const formatDate = (date: Date) => format(date, 'MMM d, yyyy');

  return (
    <Card
      onClick={onClick}
      className={`
        h-full transition-all duration-200 cursor-pointer 
        bg-slate-800/40 backdrop-blur-lg border border-slate-700/50 rounded-lg
        text-white
        hover:shadow-lg hover:scale-[1.01]
        ${
          isSelected
            ? 'ring-2 ring-blue-500 border-transparent shadow-md'
            : 'hover:border-blue-500/50'
        }
      `}
    >
      <CardHeader className="relative pb-2">
        <div className="flex justify-between items-start gap-2">
          {/* Project Title */}
          <h3 className="font-semibold text-lg line-clamp-2">
            {project.name}
          </h3>

          <div className="flex flex-col items-end">
            {/* Priority Badge */}
            <PriorityBadge priority={project.priority} />

            {/* Actions (e.g., delete button) */}
            {actions && <div className="mt-1">{actions}</div>}
          </div>
        </div>
        {/* Description */}
        <p className="text-sm text-muted-foreground/70 line-clamp-2">
          {project.description}
        </p>
      </CardHeader>

      <CardContent className="py-2 text-white">
        <div className="space-y-4">
          {/* Calendar Dates */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground/70">
            <Calendar size={14} />
            <span>
              {formatDate(startDate)} – {formatDate(endDate)}
            </span>
          </div>

          {/* Upcoming or Overdue Notice */}
          {isUpcoming && (
            <div className="text-sm text-blue-400 font-medium">
              Starts {formatDistanceToNow(startDate, { addSuffix: true })}
            </div>
          )}

          {isOverdue && (
            <div className="text-sm text-red-400 font-medium">
              Overdue by {formatDistanceToNow(endDate)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
























