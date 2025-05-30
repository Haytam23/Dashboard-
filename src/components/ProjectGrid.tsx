// src/components/ProjectGrid.tsx
import React, { useMemo, useState } from 'react'
import { Project, Tasks }       from '@/types'
import { ProjectCard }          from './ProjectCard'
import { calculateProjectProgress } from '@/api/projectService'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input }                from '@/components/ui/input'
import { MagnifyingGlassIcon }  from '@radix-ui/react-icons'
import { Trash2 }               from 'lucide-react'
import { Button }               from '@/components/ui/button'

type Status = 'all' | 'in-progress' | 'completed'

interface ProjectGridProps {
  projects: Project[]
  tasks:    Tasks[]
  selectedProjectId: string | null
  onSelectProject:   (projectId: string) => void
  onDeleteProject:   (projectId: string) => void
}

export function ProjectGrid({
  projects,
  tasks,
  selectedProjectId,
  onSelectProject,
  onDeleteProject,
}: ProjectGridProps) {
  const [searchQuery,    setSearchQuery]    = useState('')
  const [categoryFilter, setCategoryFilter] = useState<'all' | string>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all'|'low'|'medium'|'high'>('all')
  const [statusFilter,   setStatusFilter]   = useState<Status>('all')

  // Precompute progress and status for each project
  const meta = useMemo(() => {
    return projects.map(p => {
      const prog = calculateProjectProgress(p.id, tasks)
      const stat: Status = prog === 100 ? 'completed' : 'in-progress'
      console.debug(`Project "${p.name}" prog=${prog}% → status="${stat}"`)
      return { id: p.id, prog, stat }
    })
  }, [projects, tasks])

  // collect categories
  const categories = useMemo(() => {
    const uniq = Array.from(new Set(projects.map(p => p.category)))
    return ['all', ...uniq]
  }, [projects])

  // final filtered list
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const m = meta.find(m => m.id === p.id)!
      const inSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      const inCat  = categoryFilter === 'all' || p.category === categoryFilter
      const inPri  = priorityFilter === 'all'  || p.priority === priorityFilter
      const inStat = statusFilter   === 'all'  || m.stat === statusFilter
      return inSearch && inCat && inPri && inStat
    })
  }, [projects, meta, searchQuery, categoryFilter, priorityFilter, statusFilter])

  return (
    <div className="space-y-4">
      {/* filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        <div className="relative w-full lg:w-64">
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-8 w-full"
          />
          <MagnifyingGlassIcon className="absolute top-1/2 left-2.5 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            {categories.map(c => (
              <SelectItem key={c} value={c}>
                {c === 'all' ? 'All Categories' : c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={v => setPriorityFilter(v as 'all'|'low'|'medium'|'high')}>
          <SelectTrigger className="w-full sm:w-32"><SelectValue placeholder="Priority" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>

        {/* <Select value={statusFilter} onValueChange={v => setStatusFilter(v as Status)}>
          <SelectTrigger className="w-full sm:w-32"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select> */}
      </div>

      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground mb-2">No projects found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map(p => {
            const { prog } = meta.find(m => m.id === p.id)!
            return (
              <ProjectCard
                key={p.id}
                project={p}
                progress={prog}
                isSelected={selectedProjectId === p.id}
                onClick={() => onSelectProject(p.id)}
                actions={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="p-1 hover:bg-red-700/20"
                    onClick={e => {
                      e.stopPropagation()
                      onDeleteProject(p.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-400"/>
                  </Button>
                }
                
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
