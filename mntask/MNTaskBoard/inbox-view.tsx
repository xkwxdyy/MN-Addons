"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import type { Task } from "@/types/task"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Inbox, 
  Plus, 
  Trash2, 
  Target, 
  Clock, 
  CheckSquare, 
  X,
  ArrowRight,
  Hash,
  AlertCircle,
  Edit2,
  MoreHorizontal,
  Send
} from "lucide-react"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface InboxViewProps {
  tasks: Task[]
  selectedTasks: string[]
  onAddTask: (title: string) => void
  onDeleteTask: (taskId: string) => void
  onMoveToFocus: (taskId: string) => void
  onMoveToPending: (taskId: string) => void
  onMoveSelectedTasks: (destination: "focus" | "pending") => void
  onToggleSelection: (taskId: string) => void
  onClearSelection: () => void
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void
  onOpenTaskDetails?: (task: Task) => void
}

export function InboxView({
  tasks,
  selectedTasks,
  onAddTask,
  onDeleteTask,
  onMoveToFocus,
  onMoveToPending,
  onMoveSelectedTasks,
  onToggleSelection,
  onClearSelection,
  onUpdateTask,
  onOpenTaskDetails
}: InboxViewProps) {
  const [newTaskInput, setNewTaskInput] = useState("")
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState("")
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleAddTask = () => {
    if (newTaskInput.trim()) {
      onAddTask(newTaskInput)
      setNewTaskInput("")
      inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleAddTask()
    }
  }

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id)
    setEditingTitle(task.title)
  }

  const saveEdit = () => {
    if (editingTaskId && editingTitle.trim()) {
      onUpdateTask(editingTaskId, { title: editingTitle })
      setEditingTaskId(null)
      setEditingTitle("")
    }
  }

  const cancelEdit = () => {
    setEditingTaskId(null)
    setEditingTitle("")
  }

  const toggleSelectionMode = () => {
    if (isSelectionMode) {
      onClearSelection()
    }
    setIsSelectionMode(!isSelectionMode)
  }

  // Parse tags from title for display
  const parseTaskDisplay = (title: string) => {
    const tagRegex = /#(\S+)/g
    const tags: string[] = []
    let match
    let cleanTitle = title

    while ((match = tagRegex.exec(title)) !== null) {
      tags.push(match[1])
    }

    cleanTitle = title.replace(tagRegex, "").trim()
    return { cleanTitle, parsedTags: tags }
  }

  // Get task priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-yellow-500"
      default:
        return "text-gray-400"
    }
  }

  // Get task type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "project":
        return <Target className="h-3 w-3" />
      case "action":
        return <CheckSquare className="h-3 w-3" />
      default:
        return null
    }
  }

  return (
    <div className="flex-1 p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Inbox className="h-6 w-6 text-blue-500" />
          <h1 className="text-2xl font-bold">收件箱</h1>
          <Badge variant="secondary">{tasks.length}</Badge>
        </div>
        
        {/* Batch actions */}
        {tasks.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              variant={isSelectionMode ? "default" : "outline"}
              size="sm"
              onClick={toggleSelectionMode}
            >
              {isSelectionMode ? "取消选择" : "批量管理"}
            </Button>
            
            {isSelectionMode && selectedTasks.length > 0 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onMoveSelectedTasks("focus")}
                >
                  <Target className="h-4 w-4 mr-1" />
                  移至焦点 ({selectedTasks.length})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onMoveSelectedTasks("pending")}
                >
                  <Clock className="h-4 w-4 mr-1" />
                  移至待处理 ({selectedTasks.length})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClearSelection}
                >
                  清除选择
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Quick input */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={newTaskInput}
              onChange={(e) => setNewTaskInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="快速添加任务... (使用 #标签 设置标签，!高 !!中 !!!低 设置优先级)"
              className="flex-1"
            />
            <Button onClick={handleAddTask} disabled={!newTaskInput.trim()}>
              <Plus className="h-4 w-4 mr-1" />
              添加
            </Button>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            提示：按 Enter 快速添加，支持 #标签 自动识别
          </div>
        </CardContent>
      </Card>

      {/* Task list */}
      {tasks.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Inbox className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">收件箱为空</p>
            <p className="text-sm text-muted-foreground mt-2">
              在上方输入框中快速添加任务，稍后整理
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => {
            const { cleanTitle, parsedTags } = parseTaskDisplay(task.title)
            const isEditing = editingTaskId === task.id
            const isSelected = selectedTasks.includes(task.id)

            return (
              <Card 
                key={task.id} 
                className={`transition-all ${isSelected ? "ring-2 ring-primary" : ""}`}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    {/* Selection checkbox */}
                    {isSelectionMode && (
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onToggleSelection(task.id)}
                      />
                    )}

                    {/* Task content */}
                    <div className="flex-1">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <Input
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveEdit()
                              if (e.key === "Escape") cancelEdit()
                            }}
                            autoFocus
                            className="h-8"
                          />
                          <Button size="sm" variant="ghost" onClick={saveEdit}>
                            <Send className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={cancelEdit}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div 
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() => onOpenTaskDetails?.(task)}
                        >
                          {getTypeIcon(task.type)}
                          <span className="font-medium">{cleanTitle}</span>
                          {task.tags && task.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {parsedTags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          <AlertCircle className={`h-3 w-3 ${getPriorityColor(task.priority)}`} />
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {!isEditing && !isSelectionMode && (
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEditing(task)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onMoveToFocus(task.id)}>
                              <Target className="h-4 w-4 mr-2" />
                              移至焦点任务
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onMoveToPending(task.id)}>
                              <Clock className="h-4 w-4 mr-2" />
                              移至待处理
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => onDeleteTask(task.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              删除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>
                  
                  {/* Task metadata */}
                  <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                    <span>创建于 {new Date(task.createdAt).toLocaleDateString()}</span>
                    {task.type && (
                      <span className="capitalize">{task.type}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Tips */}
      {tasks.length > 10 && (
        <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800 dark:text-yellow-200">
                  收件箱任务较多
                </p>
                <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                  建议定期整理收件箱，将任务移至焦点或待处理列表
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}