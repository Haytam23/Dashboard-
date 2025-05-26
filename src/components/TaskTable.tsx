import React, { useState, useMemo } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { BadgeStatus } from '@/components/ui/badge-status';
import { Project, Task } from '@/types';
import { format, isPast, parseISO } from 'date-fns';
import { 
  CalendarIcon, 
  CheckCircle2, 
  Circle, 
  SearchIcon, 
  SlidersHorizontal, 
  UserIcon, 
  XCircle 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface TaskTableProps {
  project: Project;
  tasks: Task[];
  onToggleStatus: (taskId: string, newStatus: 'in-progress' | 'completed') => void;
}

export function TaskTable({ project, tasks, onToggleStatus }: TaskTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Set<string>>(new Set(['in-progress', 'completed']));
  
  // Get the sorted and filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => 
        (task.name.toLowerCase().includes(search.toLowerCase()) ||
         task.assignee.toLowerCase().includes(search.toLowerCase())) &&
        statusFilter.has(task.status)
      )
      .sort((a, b) => {
        // Sort by status first (in-progress first)
        if (a.status !== b.status) {
          return a.status === 'in-progress' ? -1 : 1;
        }
        
        // Then sort by due date
        return parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime();
      });
  }, [tasks, search, statusFilter]);
  
  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = parseISO(dateStr);
    return format(date, 'MMM d, yyyy');
  };
  
  // Check if date is past
  const isDatePast = (dateStr: string) => {
    return isPast(parseISO(dateStr)) && new Date().toDateString() !== parseISO(dateStr).toDateString();
  };

  const toggleStatusFilter = (status: string) => {
    const newFilter = new Set(statusFilter);
    if (newFilter.has(status)) {
      newFilter.delete(status);
    } else {
      newFilter.add(status);
    }
    setStatusFilter(newFilter);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <h2 className="text-xl font-semibold">{project.name} Tasks</h2>
        
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-60">
            <SearchIcon className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tasks or assignees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="h-4 w-4 mr-1" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuCheckboxItem
                  checked={statusFilter.has('in-progress')}
                  onCheckedChange={() => toggleStatusFilter('in-progress')}
                >
                  <Circle className="h-4 w-4 mr-2 text-amber-500" />
                  In Progress
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter.has('completed')}
                  onCheckedChange={() => toggleStatusFilter('completed')}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                  Completed
                </DropdownMenuCheckboxItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {filteredTasks.length === 0 ? (
        <div className="text-center py-8">
          <XCircle className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
          <h3 className="mt-2 text-lg font-medium">No tasks found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {tasks.length === 0 
              ? "This project doesn't have any tasks yet."
              : "Try adjusting your filters or search query."}
          </p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead className="hidden sm:table-cell">Assignee</TableHead>
                <TableHead className="hidden md:table-cell">Due Date</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => {
                const isPastDue = isDatePast(task.dueDate) && task.status !== 'completed';
                
                return (
                  <TableRow key={task.id} className="group">
                    <TableCell className="font-medium">
                      <div className="max-w-xs">
                        <div className="truncate">{task.name}</div>
                        {task.description && (
                          <div className="text-muted-foreground text-sm truncate">
                            {task.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex items-center gap-1.5">
                        <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{task.assignee}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell className={`hidden md:table-cell ${isPastDue ? 'text-red-600' : ''}`}>
                      <div className="flex items-center gap-1.5">
                        <CalendarIcon className={`h-3.5 w-3.5 ${isPastDue ? 'text-red-600' : 'text-muted-foreground'}`} />
                        <span>{formatDate(task.dueDate)}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <BadgeStatus
                        status={task.status}
                        onClick={() => onToggleStatus(
                          task.id,
                          task.status === 'completed' ? 'in-progress' : 'completed'
                        )}
                        className="ml-auto transition-all duration-300 opacity-80 group-hover:opacity-100"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}