import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';

interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high';
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const getColor = () => {
    switch (priority) {
      case 'low':
        return 'border-blue-500 bg-blue-100 text-blue-700 hover:bg-blue-200';
      case 'medium':
        return 'border-amber-500 bg-amber-100 text-amber-700 hover:bg-amber-200';
      case 'high':
        return 'border-red-500 bg-red-100 text-red-700 hover:bg-red-200';
      default:
        return '';
    }
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "capitalize whitespace-nowrap",
        getColor(),
        className
      )}
    >
      {priority}
    </Badge>
  );
}