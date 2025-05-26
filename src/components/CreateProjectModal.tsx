"use client"

import type React from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Plus,
  X,
  Calendar,
  User,
  Flag,
  FolderOpen,
  FileText,
  Target,
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap,
} from "lucide-react"
import { Task, Project } from "../types";

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (project: any) => void
}

const priorityConfig = {
  low: {
    color: "bg-emerald-500/10 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400",
    icon: CheckCircle2,
    label: "Low Priority",
    accent: "text-emerald-500",
  },
  medium: {
    color: "bg-amber-500/10 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400",
    icon: Clock,
    label: "Medium Priority",
    accent: "text-amber-500",
  },
  high: {
    color: "bg-red-500/10 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-400",
    icon: AlertCircle,
    label: "High Priority",
    accent: "text-red-500",
  },
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, onCreate }) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      category: "",
      priority: "medium",
      tasks: [{ title: "", description: "", assignee: "", dueDate: "", priority: "medium" }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: "tasks" })
  const watchedPriority = watch("priority")
  const watchedTasks = watch("tasks")

  const onSubmit = (data: any) => {
    const newProject = {
      id: uuidv4(),
      ...data,
      tasks: data.tasks.map((task: any) => ({
        ...task,
        id: uuidv4(),
        status: "pending",
      })),
    }
    onCreate(newProject)
    reset()
    onClose()
  }

  const addTask = () => {
    append({ title: "", description: "", assignee: "", dueDate: "", priority: "medium" })
  }

  const PriorityIcon = priorityConfig[watchedPriority as keyof typeof priorityConfig]?.icon || Clock

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full max-h-[95vh] flex flex-col p-0 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700">
        {/* Header */}
        
        {/* Top Buttons */}
        <div className="flex gap-3 w-full px-6 pt-6 pb-2 bg-white/70 dark:bg-slate-800/70 z-10">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 border-slate-300 border-slate-600 text-slate-700 text-slate-300 hover:bg-slate-50 hover:bg-slate-700"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-project-form"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Project
          </Button>
        </div>

        {/* Scrollable Content */}
        <form
          id="create-project-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto px-6 pb-6 pt-2"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Project Information */}
            <div className="space-y-6">
              <Card className="border-slate-200 dark:border-slate-700 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Project Information</h3>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Project Name & Category */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        Project Name *
                      </Label>
                      <Input
                        id="name"
                        placeholder="Enter project name"
                        className="border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-slate-800"
                        {...register("name", { required: "Project name is required" })}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <X className="h-3 w-3" />
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="category"
                        className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2"
                      >
                        <FolderOpen className="h-4 w-4" />
                        Category *
                      </Label>
                      <Input
                        id="category"
                        placeholder="e.g., Web Development, Marketing"
                        className="border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-slate-800"
                        {...register("category", { required: "Category is required" })}
                      />
                      {errors.category && (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <X className="h-3 w-3" />
                          {errors.category.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="startDate"
                        className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2"
                      >
                        <Calendar className="h-4 w-4" />
                        Start Date *
                      </Label>
                      <Input
                        id="startDate"
                        type="date"
                        className="border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-slate-800"
                        {...register("startDate", { required: "Start date is required" })}
                      />
                      {errors.startDate && (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <X className="h-3 w-3" />
                          {errors.startDate.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="endDate"
                        className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2"
                      >
                        <Calendar className="h-4 w-4" />
                        End Date *
                      </Label>
                      <Input
                        id="endDate"
                        type="date"
                        className="border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-slate-800"
                        {...register("endDate", { required: "End date is required" })}
                      />
                      {errors.endDate && (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <X className="h-3 w-3" />
                          {errors.endDate.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Priority */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Flag className="h-4 w-4" />
                      Priority
                    </Label>
                    <Select value={watchedPriority} onValueChange={(value) => setValue("priority", value)}>
                      <SelectTrigger className="border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-slate-800">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(priorityConfig).map(([key, config]) => {
                          const IconComponent = config.icon
                          return (
                            <SelectItem key={key} value={key}>
                              <div className="flex items-center gap-2">
                                <IconComponent className={`h-4 w-4 ${config.accent}`} />
                                {config.label}
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      rows={4}
                      className="border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500 resize-none bg-white dark:bg-slate-800"
                      placeholder="Describe your project goals and objectives..."
                      {...register("description")}
                    />
                  </div>

                  {/* Project Summary */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Project Summary</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <PriorityIcon
                          className={`h-4 w-4 ${priorityConfig[watchedPriority as keyof typeof priorityConfig]?.accent}`}
                        />
                        <span className="text-slate-600 dark:text-slate-400">Priority:</span>
                        <Badge className={priorityConfig[watchedPriority as keyof typeof priorityConfig]?.color}>
                          {priorityConfig[watchedPriority as keyof typeof priorityConfig]?.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-slate-500" />
                        <span className="text-slate-600 dark:text-slate-400">Tasks:</span>
                        <Badge variant="secondary">{fields.length}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Tasks */}
            <div className="space-y-6">
              <Card className="border-slate-200 border-slate-700 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm h-full flex flex-col">
                <CardHeader className="pb-4 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/10 rounded-lg">
                        <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Project Tasks</h3>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      >
                        {fields.length} {fields.length === 1 ? "task" : "tasks"}
                      </Badge>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={addTask}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white shadow-sm"
                    >
                      <Plus className="h-4 w-4" />
                      Add Task
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-hidden">
                  <ScrollArea className="h-full pr-4">
                    <div className="space-y-4">
                      {fields.map((field, index) => (
                        <Card
                          key={field.id}
                          className="border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 hover:shadow-md"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full flex items-center justify-center text-xs font-medium">
                                  {index + 1}
                                </div>
                                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                  Task #{index + 1}
                                </h4>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => remove(index)}
                                className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label
                                  htmlFor={`tasks.${index}.title`}
                                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                                >
                                  Title *
                                </Label>
                                <Input
                                  id={`tasks.${index}.title`}
                                  placeholder="Task title"
                                  className="border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-slate-800"
                                  {...register(`tasks.${index}.title`, { required: "Title is required" })}
                                />
                                {errors.tasks?.[index]?.title && (
                                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                    <X className="h-3 w-3" />
                                    {errors.tasks[index]?.title?.message}
                                  </p>
                                )}
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                  <Label
                                    htmlFor={`tasks.${index}.assignee`}
                                    className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1"
                                  >
                                    <User className="h-3 w-3" />
                                    Assignee
                                  </Label>
                                  <Input
                                    id={`tasks.${index}.assignee`}
                                    placeholder="Assign to..."
                                    className="border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-slate-800"
                                    {...register(`tasks.${index}.assignee`)}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label
                                    htmlFor={`tasks.${index}.dueDate`}
                                    className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1"
                                  >
                                    <Calendar className="h-3 w-3" />
                                    Due Date
                                  </Label>
                                  <Input
                                    id={`tasks.${index}.dueDate`}
                                    type="date"
                                    className="border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-slate-800"
                                    {...register(`tasks.${index}.dueDate`)}
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                  <Flag className="h-3 w-3" />
                                  Priority
                                </Label>
                                <Select
                                  value={watch(`tasks.${index}.priority`)}
                                  onValueChange={(value) => setValue(`tasks.${index}.priority`, value)}
                                >
                                  <SelectTrigger className="border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-slate-800">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Object.entries(priorityConfig).map(([key, config]) => {
                                      const IconComponent = config.icon
                                      return (
                                        <SelectItem key={key} value={key}>
                                          <div className="flex items-center gap-2">
                                            <IconComponent className={`h-4 w-4 ${config.accent}`} />
                                            {key.charAt(0).toUpperCase() + key.slice(1)}
                                          </div>
                                        </SelectItem>
                                      )
                                    })}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label
                                  htmlFor={`tasks.${index}.description`}
                                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                                >
                                  Description
                                </Label>
                                <Textarea
                                  id={`tasks.${index}.description`}
                                  rows={2}
                                  className="border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500 resize-none bg-white dark:bg-slate-800"
                                  placeholder="Task description..."
                                  {...register(`tasks.${index}.description`)}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      {fields.length === 0 && (
                        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                            <Target className="h-8 w-8 text-slate-400" />
                          </div>
                          <p className="text-sm font-medium mb-2">No tasks added yet</p>
                          <p className="text-xs">Click "Add Task" to get started with your project tasks.</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
