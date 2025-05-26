import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BadgeStatusProps {
  status: 'in-progress' | 'completed';
  onClick?: () => void;
  className?: string;
}

export function BadgeStatus({ status, onClick, className }: BadgeStatusProps) {
  const isCompleted = status === 'completed';
  
  return (
    <Badge 
      variant="outline"
      onClick={onClick}
      className={cn(
        "cursor-pointer transition-all duration-300 whitespace-nowrap",
        isCompleted ? "border-green-500 bg-green-100 text-green-700 hover:bg-green-200" : 
                     "border-amber-500 bg-amber-100 text-amber-700 hover:bg-amber-200",
        className
      )}
    >
      {isCompleted ? '✓ Completed' : '↻ In Progress'}
    </Badge>
  );
}