"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Target,
  Star,
  Play,
  Pause,
  Square,
  CheckCircle,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Calendar,
  FolderOpen,
  TrendingUp,
  Crosshair,
  MapPin,
} from "lucide-react"
import { toast } from "sonner"

interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  isFocusTask: boolean
  isPriorityFocus: boolean
  priority: "low" | "medium" | "high"
  status: "todo" | "in-progress" | "completed" | "paused"
  type: "action" | "project" | "key-result" | "objective"
  createdAt: Date
  updatedAt?: Date
  progress?: string
  category?: string
  order?: number
  parentId?: string
  isInPending?: boolean
  tags?: string[]
  progressHistory?: Array<{
    id: string
    content: string
    timestamp: Date
    type: "progress" | "status" | "comment"
  }>
}

interface TaskDetailsModalProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void
  onToggleFocus: (taskId: string) => void
  onTogglePriorityFocus: (taskId: string) => void
  onUpdateProgress: (taskId: string, progressId: string, content: string) => void
  onDeleteProgress: (taskId: string, progressId: string) => void
  availableParentTasks: Task[]
  allTasks: Task[]
  availableTags: string[]
  onAddTask: (taskData: Omit<Task, "id" | "createdAt">) => void
  onOpenSubtaskDetails: (subtask: Task) => void
  onLocateTaskInBoard: (taskId: string, taskType: string) => void
}

export function TaskDetailsModal({
  task,
  isOpen,
  onClose,
  onUpdateTask,
  onToggleFocus,
  onTogglePriorityFocus,
  onUpdateProgress,
  onDeleteProgress,
  availableParentTasks,
  allTasks,
  availableTags,
  onAddTask,
  onOpenSubtaskDetails,
  onLocateTaskInBoard,
}: TaskDetailsModalProps) {
  const [editingTitle, setEditingTitle] = useState(false)
  const [tempTitle, setTempTitle] = useState("")
  const [tempDescription, setTempDescription] = useState("")
  const [tempTags, setTempTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [newProgress, setNewProgress] = useState("")
  const [editingProgressId, setEditingProgressId] = useState<string | null>(null)
  const [editingProgressContent, setEditingProgressContent] = useState("")
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("")

  // 添加本地状态来跟踪当前任务的状态，确保UI能及时响应
  const [currentTask, setCurrentTask] = useState<Task | null>(null)

  const titleInputRef = useRef<HTMLInputElement>(null)
  const progressTextareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-focus on progress textarea when modal opens
  useEffect(() => {
    if (isOpen && currentTask && progressTextareaRef.current) {
      const timer = setTimeout(() => {
        // First blur any currently focused element
        if (document.activeElement && document.activeElement !== document.body) {
          ;(document.activeElement as HTMLElement).blur()
        }
        // Then focus on progress textarea
        progressTextareaRef.current?.focus()
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [isOpen, currentTask])

  // 当传入的task发生变化时，更新本地状态和临时状态
  useEffect(() => {
    if (task) {
      setCurrentTask(task)
      setTempTitle(task.title)
      setTempDescription(task.description || "")
      setTempTags(task.tags || [])
      setNewProgress("")
      setEditingTitle(false)
      setEditingProgressId(null)
      setNewSubtaskTitle("")
    }
  }, [task])

  useEffect(() => {
    if (editingTitle && titleInputRef.current) {
      titleInputRef.current.focus()
      titleInputRef.current.select()
    }
  }, [editingTitle])

  if (!currentTask) return null

  const handleSave = () => {
    const updates: Partial<Task> = {}
    let hasChanges = false

    if (tempTitle !== currentTask.title) {
      updates.title = tempTitle
      hasChanges = true
    }
    if (tempDescription !== (currentTask.description || "")) {
      updates.description = tempDescription
      hasChanges = true
    }
    if (JSON.stringify(tempTags) !== JSON.stringify(currentTask.tags || [])) {
      updates.tags = tempTags
      hasChanges = true
    }

    if (hasChanges) {
      updates.updatedAt = new Date()
      onUpdateTask(currentTask.id, updates)
      // 立即更新本地状态
      setCurrentTask({ ...currentTask, ...updates })
    }
  }

  const handleClose = () => {
    // 在关闭前自动保存更改
    handleSave()
    onClose()
  }

  const handleTitleSave = () => {
    if (tempTitle.trim() && tempTitle !== currentTask.title) {
      const updates = { title: tempTitle.trim(), updatedAt: new Date() }
      onUpdateTask(currentTask.id, updates)
      // 立即更新本地状态
      setCurrentTask({ ...currentTask, ...updates })
    }
    setEditingTitle(false)
  }

  const handleTitleCancel = () => {
    setTempTitle(currentTask.title)
    setEditingTitle(false)
  }

  const handleAddProgress = () => {
    if (newProgress.trim()) {
      const progressEntry = {
        id: Date.now().toString(),
        content: newProgress.trim(),
        timestamp: new Date(),
        type: "progress" as const,
      }

      const updatedProgressHistory = [...(currentTask.progressHistory || []), progressEntry]
      const updates = {
        progress: newProgress.trim(),
        progressHistory: updatedProgressHistory,
        updatedAt: new Date(),
      }

      onUpdateTask(currentTask.id, updates)
      // 立即更新本地状态
      setCurrentTask({ ...currentTask, ...updates })
      setNewProgress("")
      toast.success("进展已添加")
    }
  }

  const handleEditProgress = (progressId: string, content: string) => {
    setEditingProgressId(progressId)
    setEditingProgressContent(content)
  }

  const handleSaveProgress = () => {
    if (editingProgressId && editingProgressContent.trim()) {
      onUpdateProgress(currentTask.id, editingProgressId, editingProgressContent.trim())
      setEditingProgressId(null)
      setEditingProgressContent("")
      toast.success("进展已更新")
    }
  }

  const handleCancelEditProgress = () => {
    setEditingProgressId(null)
    setEditingProgressContent("")
  }

  const handleDeleteProgress = (progressId: string) => {
    onDeleteProgress(currentTask.id, progressId)
    toast.success("进展已删除")
  }

  const handleAddTag = () => {
    if (newTag.trim() && !tempTags.includes(newTag.trim())) {
      setTempTags([...tempTags, newTag.trim()])
      setNewTag("")
      // 自动保存标签更改
      setTimeout(() => handleSave(), 0)
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTempTags(tempTags.filter((tag) => tag !== tagToRemove))
    // 自动保存标签更改
    setTimeout(() => handleSave(), 0)
  }

  const handleStatusChange = (newStatus: "todo" | "in-progress" | "completed" | "paused") => {
    const updates = {
      status: newStatus,
      completed: newStatus === "completed",
      updatedAt: new Date(),
    }

    onUpdateTask(currentTask.id, updates)
    // 立即更新本地状态以确保UI响应
    setCurrentTask({ ...currentTask, ...updates })
    toast.success(`状态已更新为: ${getStatusText(newStatus)}`)
  }

  const handlePriorityChange = (newPriority: "low" | "medium" | "high") => {
    const updates = { priority: newPriority, updatedAt: new Date() }
    onUpdateTask(currentTask.id, updates)
    // 立即更新本地状态
    setCurrentTask({ ...currentTask, ...updates })
    toast.success(`优先级已更新为: ${getPriorityText(newPriority)}`)
  }

  const handleTypeChange = (newType: "action" | "project" | "key-result" | "objective") => {
    const updates = { type: newType, updatedAt: new Date() }
    onUpdateTask(currentTask.id, updates)
    // 立即更新本地状态
    setCurrentTask({ ...currentTask, ...updates })
    toast.success(`类型已更新为: ${getTypeText(newType)}`)
  }

  const handleParentChange = (parentId: string) => {
    const updates = { parentId: parentId === "none" ? undefined : parentId, updatedAt: new Date() }
    onUpdateTask(currentTask.id, updates)
    // 立即更新本地状态
    setCurrentTask({ ...currentTask, ...updates })
    toast.success("父任务已更新")
  }

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) {
      return
    }

    const subtaskData: Omit<Task, "id" | "createdAt"> = {
      title: newSubtaskTitle.trim(),
      description: "",
      completed: false,
      isFocusTask: false,
      isPriorityFocus: false,
      priority: "low",
      status: "todo",
      type: "action",
      parentId: currentTask.id,
      isInPending: true,
      tags: currentTask.tags || [],
    }

    onAddTask(subtaskData)
    setNewSubtaskTitle("")
    toast.success("子任务已创建")
  }

  const handleSubtaskInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddSubtask()
    }
  }

  const getSubtasks = () => {
    return allTasks.filter((t) => t.parentId === currentTask.id)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "todo":
        return <Square className="w-4 h-4" />
      case "in-progress":
        return <Play className="w-4 h-4" />
      case "paused":
        return <Pause className="w-4 h-4" />
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Square className="w-4 h-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "todo":
        return "待开始"
      case "in-progress":
        return "进行中"
      case "paused":
        return "已暂停"
      case "completed":
        return "已完成"
      default:
        return status
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "low":
        return "低优先级"
      case "medium":
        return "中优先级"
      case "high":
        return "高优先级"
      default:
        return priority
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "action":
        return <Target className="w-4 h-4" />
      case "project":
        return <FolderOpen className="w-4 h-4" />
      case "key-result":
        return <TrendingUp className="w-4 h-4" />
      case "objective":
        return <Crosshair className="w-4 h-4" />
      default:
        return <Target className="w-4 h-4" />
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case "action":
        return "动作"
      case "project":
        return "项目"
      case "key-result":
        return "关键结果"
      case "objective":
        return "目标"
      default:
        return type
    }
  }

  const subtasks = getSubtasks()
  const canHaveSubtasks = ["project", "key-result", "objective"].includes(currentTask.type)

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-800 border-slate-700 w-screen sm:w-[95vw] sm:max-w-6xl h-screen sm:h-auto sm:max-h-[90vh] flex flex-col overflow-hidden p-0 rounded-none sm:rounded-lg">
        <DialogHeader className="px-6 py-4 border-b border-slate-700">
          <DialogTitle className="flex items-center gap-3 text-white">
            {getTypeIcon(currentTask.type)}
            {editingTitle ? (
              <div className="flex items-center gap-2 flex-1">
                <Input
                  ref={titleInputRef}
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleTitleSave()
                    } else if (e.key === "Escape") {
                      handleTitleCancel()
                    }
                  }}
                  className="bg-slate-700/50 border-slate-600 text-white text-lg font-semibold"
                />
                <Button size="sm" onClick={handleTitleSave} className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleTitleCancel}
                  className="border-slate-600 bg-transparent"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <span
                className="text-lg font-semibold cursor-pointer hover:text-blue-400 transition-colors flex-1"
                onClick={() => setEditingTitle(true)}
              >
                {currentTask.title}
              </span>
            )}
          </DialogTitle>
          <DialogDescription className="sr-only">
            编辑任务详情，包括描述、状态、优先级和其他属性
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden h-0">
          {/* Left Column - Main Content */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Task Description */}
              <div className="space-y-2">
                <label className="text-white font-medium">任务描述</label>
                <Textarea
                  value={tempDescription}
                  onChange={(e) => setTempDescription(e.target.value)}
                  onBlur={handleSave} // 失去焦点时自动保存
                  placeholder="添加更详细的描述..."
                  className="bg-slate-700/50 border-slate-600 text-white min-h-[120px]"
                  tabIndex={-1}
                />
              </div>

              {/* Subtasks */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-medium">子任务 ({subtasks.length})</h3>
                </div>

                <div className="space-y-3">
                  {subtasks.length > 0 ? (
                    subtasks.map((subtask) => (
                      <div
                        key={subtask.id}
                        className="bg-slate-700/30 border border-slate-600 rounded-lg p-4 hover:bg-slate-700/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getTypeIcon(subtask.type)}
                              <span className="text-white font-medium">{subtask.title}</span>
                              <Badge
                                className={`text-xs ${
                                  subtask.status === "completed"
                                    ? "bg-green-500/20 text-green-300 border-green-500/30"
                                    : subtask.status === "in-progress"
                                      ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                                      : subtask.status === "paused"
                                        ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                                        : "bg-slate-500/20 text-slate-300 border-slate-500/30"
                                }`}
                              >
                                {getStatusText(subtask.status)}
                              </Badge>
                            </div>
                            {subtask.description && (
                              <p className="text-slate-300 text-sm mb-2">{subtask.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-1 ml-4">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onOpenSubtaskDetails(subtask)}
                              className="text-slate-400 hover:text-white p-1 h-8 w-8"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onLocateTaskInBoard(subtask.id, subtask.type)}
                              className="text-slate-400 hover:text-white p-1 h-8 w-8"
                            >
                              <MapPin className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-slate-400">
                      <div className="text-sm">暂无子任务</div>
                    </div>
                  )}
                </div>

                {canHaveSubtasks && (
                  <div className="relative mt-4">
                    <Plus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      value={newSubtaskTitle}
                      onChange={(e) => setNewSubtaskTitle(e.target.value)}
                      onKeyDown={handleSubtaskInputKeyDown}
                      placeholder="添加一个动作并按 Enter 键"
                      className="bg-slate-700/50 border-slate-600 text-white pl-9"
                    />
                  </div>
                )}

                {!canHaveSubtasks && subtasks.length === 0 && (
                  <div className="text-center py-4 text-slate-400">
                    <div className="text-xs mt-1">当前任务类型不支持添加子任务</div>
                  </div>
                )}
              </div>

              {/* Progress History */}
              <div className="space-y-4">
                <h3 className="text-white font-medium">进展历史</h3>

                <div className="flex gap-3">
                  <Textarea
                    ref={progressTextareaRef}
                    value={newProgress}
                    onChange={(e) => setNewProgress(e.target.value)}
                    placeholder="记录你的进展..."
                    className="flex-1 bg-slate-700/50 border-slate-600 text-white min-h-[80px]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleAddProgress()
                      }
                    }}
                    tabIndex={0}
                  />
                  <Button
                    onClick={handleAddProgress}
                    disabled={!newProgress.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white self-start"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    添加
                  </Button>
                </div>

                <ScrollArea className="max-h-64">
                  <div className="space-y-3">
                    {currentTask.progressHistory && currentTask.progressHistory.length > 0 ? (
                      [...currentTask.progressHistory].reverse().map((progress) => (
                        <div key={progress.id} className="bg-slate-700/30 border border-slate-600 rounded-lg p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              {editingProgressId === progress.id ? (
                                <div className="space-y-2">
                                  <Textarea
                                    value={editingProgressContent}
                                    onChange={(e) => setEditingProgressContent(e.target.value)}
                                    className="bg-slate-700/50 border-slate-600 text-white"
                                    rows={3}
                                  />
                                  <div className="flex items-center gap-2">
                                    <Button
                                      size="sm"
                                      onClick={handleSaveProgress}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <Save className="w-3 h-3 mr-1" />
                                      保存
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={handleCancelEditProgress}
                                      className="border-slate-600 text-slate-300 bg-transparent"
                                    >
                                      取消
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-white text-sm whitespace-pre-wrap">{progress.content}</p>
                              )}
                            </div>
                            {editingProgressId !== progress.id && (
                              <div className="flex items-center gap-1 ml-3">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEditProgress(progress.id, progress.content)}
                                  className="text-slate-400 hover:text-white p-1 h-6 w-6"
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteProgress(progress.id)}
                                  className="text-slate-400 hover:text-red-400 p-1 h-6 w-6"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 mt-2">
                            {new Date(progress.timestamp).toLocaleString()}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-slate-400 text-sm">暂无进展记录</div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>

          {/* Right Column - Attributes */}
          <div className="w-full md:w-80 bg-slate-800/50 border-t md:border-t-0 md:border-l border-slate-700 p-4 md:p-6 overflow-y-auto">
            <div className="space-y-6">
              <h3 className="text-white font-medium">属性</h3>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-white text-sm font-medium">状态</label>
                <Select value={currentTask.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(currentTask.status)}
                        {getStatusText(currentTask.status)}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="todo" className="text-white">
                      <div className="flex items-center gap-2">
                        <Square className="w-4 h-4" />
                        待开始
                      </div>
                    </SelectItem>
                    <SelectItem value="in-progress" className="text-white">
                      <div className="flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        进行中
                      </div>
                    </SelectItem>
                    <SelectItem value="paused" className="text-white">
                      <div className="flex items-center gap-2">
                        <Pause className="w-4 h-4" />
                        已暂停
                      </div>
                    </SelectItem>
                    <SelectItem value="completed" className="text-white">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        已完成
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <label className="text-white text-sm font-medium">优先级</label>
                <Select value={currentTask.priority} onValueChange={handlePriorityChange}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue>{getPriorityText(currentTask.priority)}</SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="low" className="text-white">
                      低优先级
                    </SelectItem>
                    <SelectItem value="medium" className="text-white">
                      中优先级
                    </SelectItem>
                    <SelectItem value="high" className="text-white">
                      高优先级
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Type */}
              <div className="space-y-2">
                <label className="text-white text-sm font-medium">类型</label>
                <Select value={currentTask.type} onValueChange={handleTypeChange}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(currentTask.type)}
                        {getTypeText(currentTask.type)}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="action" className="text-white">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        动作
                      </div>
                    </SelectItem>
                    <SelectItem value="project" className="text-white">
                      <div className="flex items-center gap-2">
                        <FolderOpen className="w-4 h-4" />
                        项目
                      </div>
                    </SelectItem>
                    <SelectItem value="key-result" className="text-white">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        关键结果
                      </div>
                    </SelectItem>
                    <SelectItem value="objective" className="text-white">
                      <div className="flex items-center gap-2">
                        <Crosshair className="w-4 h-4" />
                        目标
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="text-white text-sm font-medium">标签</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tempTags.map((tag) => (
                    <Badge
                      key={tag}
                      className="bg-blue-500/20 text-blue-300 border-blue-500/30 cursor-pointer hover:bg-blue-500/30"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="添加标签..."
                    className="bg-slate-700/50 border-slate-600 text-white"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                  />
                  <Button size="sm" onClick={handleAddTag} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {availableTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {availableTags
                      .filter((tag) => !tempTags.includes(tag))
                      .slice(0, 10)
                      .map((tag) => (
                        <Badge
                          key={tag}
                          className="bg-slate-600/50 text-slate-300 border-slate-500/30 cursor-pointer hover:bg-slate-500/50 text-xs"
                          onClick={() => {
                            setTempTags([...tempTags, tag])
                            // 自动保存标签更改
                            setTimeout(() => handleSave(), 0)
                          }}
                        >
                          {tag}
                        </Badge>
                      ))}
                  </div>
                )}
              </div>

              {/* Focus Controls */}
              <div className="space-y-3">
                <label className="text-white text-sm font-medium">关联关系</label>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onToggleFocus(currentTask.id)}
                    className={`w-full justify-start ${
                      currentTask.isFocusTask
                        ? "bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30"
                        : "border-slate-600 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    <Target className="w-4 h-4 mr-2" />
                    {currentTask.isFocusTask ? "移出焦点" : "添加到焦点"}
                  </Button>
                  {currentTask.isFocusTask && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onTogglePriorityFocus(currentTask.id)}
                      className={`w-full justify-start ${
                        currentTask.isPriorityFocus
                          ? "bg-yellow-500/20 border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/30"
                          : "border-slate-600 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      <Star className="w-4 h-4 mr-2" />
                      {currentTask.isPriorityFocus ? "取消优先焦点" : "设为优先焦点"}
                    </Button>
                  )}
                </div>
              </div>

              {/* Parent Task */}
              <div className="space-y-2">
                <label className="text-white text-sm font-medium">父任务</label>
                <Select value={currentTask.parentId || "none"} onValueChange={handleParentChange}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="none" className="text-white">
                      无父任务
                    </SelectItem>
                    {availableParentTasks.map((parentTask) => (
                      <SelectItem key={parentTask.id} value={parentTask.id} className="text-white">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(parentTask.type)}
                          <span className="truncate">{parentTask.title}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Path */}
              {currentTask.category && (
                <div className="space-y-2">
                  <label className="text-white text-sm font-medium">路径</label>
                  <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-3">
                    <p className="text-slate-300 text-sm">{currentTask.category}</p>
                  </div>
                </div>
              )}

              <Separator className="bg-slate-600" />

              {/* Metadata */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar className="w-4 h-4" />
                  <span>创建于: {new Date(currentTask.createdAt).toLocaleString()}</span>
                </div>
                {currentTask.updatedAt && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span>更新于: {new Date(currentTask.updatedAt).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-700 flex justify-end">
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
          >
            关闭
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
