"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Check,
  Minus,
  Pin,
  X,
  Plus,
  Calendar,
  Clock,
  ChevronsRight,
  Folder,
  Target,
  TrendingUp,
  Zap,
  AlertTriangle,
  Info,
  MessageSquare,
  Edit3,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

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
  tags?: string[]
  progressHistory?: Array<{
    id: string
    content: string
    timestamp: Date
    type: "progress" | "status" | "comment"
  }>
  isInPending?: boolean
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
  onOpenSubtaskDetails?: (subtask: Task) => void
  onLocateTaskInBoard?: (taskId: string, taskType: string) => void
  onAddTask?: (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => void
}

const tagColors = [
  "bg-red-900/50 text-red-300 border-red-500/30",
  "bg-blue-900/50 text-blue-300 border-blue-500/30",
  "bg-green-900/50 text-green-300 border-green-500/30",
  "bg-yellow-900/50 text-yellow-300 border-yellow-500/30",
  "bg-purple-900/50 text-purple-300 border-purple-500/30",
  "bg-pink-900/50 text-pink-300 border-pink-500/30",
  "bg-indigo-900/50 text-indigo-300 border-indigo-500/30",
  "bg-orange-900/50 text-orange-300 border-orange-500/30",
  "bg-teal-900/50 text-teal-300 border-teal-500/30",
  "bg-cyan-900/50 text-cyan-300 border-cyan-500/30",
]

const getTagColor = (tag: string): string => {
  const hash = tag.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0)
    return a & a
  }, 0)
  return tagColors[Math.abs(hash) % tagColors.length]
}

const getStatusInfo = (status: Task["status"]) => {
  switch (status) {
    case "todo":
      return { text: "待开始", icon: Clock, color: "text-slate-400", bgColor: "bg-slate-700" }
    case "in-progress":
      return { text: "进行中", icon: Zap, color: "text-blue-300", bgColor: "bg-blue-900/50" }
    case "paused":
      return { text: "已暂停", icon: Minus, color: "text-yellow-300", bgColor: "bg-yellow-900/50" }
    case "completed":
      return { text: "已完成", icon: Check, color: "text-green-300", bgColor: "bg-green-900/50" }
    default:
      return { text: "未知", icon: Info, color: "text-slate-400", bgColor: "bg-slate-700" }
  }
}

const getTypeInfo = (type: Task["type"]) => {
  switch (type) {
    case "action":
      return { emoji: "⚡️", text: "动作", icon: Zap }
    case "project":
      return { emoji: "📁", text: "项目", icon: Folder }
    case "key-result":
      return { emoji: "📈", text: "关键结果", icon: TrendingUp }
    case "objective":
      return { emoji: "🎯", text: "目标", icon: Target }
    default:
      return { emoji: "⚡️", text: "动作", icon: Zap }
  }
}

const getPriorityInfo = (priority: Task["priority"]) => {
  switch (priority) {
    case "low":
      return { text: "低", icon: Minus, color: "text-slate-400" }
    case "medium":
      return { text: "中", icon: ChevronsRight, color: "text-yellow-400" }
    case "high":
      return { text: "高", icon: AlertTriangle, color: "text-red-400" }
    default:
      return { text: "低", icon: Minus, color: "text-slate-400" }
  }
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
  onOpenSubtaskDetails,
  onLocateTaskInBoard,
  onAddTask,
}: TaskDetailsModalProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editingProgressId, setEditingProgressId] = useState<string | null>(null)
  const [editingProgressContent, setEditingProgressContent] = useState("")
  const [newTag, setNewTag] = useState("")
  const [showTagSuggestions, setShowTagSuggestions] = useState(false)
  const [newProgressContent, setNewProgressContent] = useState("")
  const [localProgressHistory, setLocalProgressHistory] = useState<Task["progressHistory"]>([])
  const [showAddSubtaskForm, setShowAddSubtaskForm] = useState(false)
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("")
  const [newSubtaskDescription, setNewSubtaskDescription] = useState("")
  const [newSubtaskType, setNewSubtaskType] = useState<"action" | "project">("action")
  const [newSubtaskPriority, setNewSubtaskPriority] = useState<"low" | "medium" | "high">("low")
  const [editingTitle, setEditingTitle] = useState(false)

  const progressTextareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (task) {
      setEditingTask({ ...task, tags: task.tags || [] })
      setLocalProgressHistory(task.progressHistory || [])
      setEditingTitle(false)
    } else {
      setEditingTask(null)
      setLocalProgressHistory([])
      setEditingTitle(false)
    }
  }, [task])

  // Focus on progress textarea when modal opens
  useEffect(() => {
    if (isOpen && task && progressTextareaRef.current) {
      // Longer delay to ensure modal is fully rendered and other focus events have completed
      const timer = setTimeout(() => {
        // First blur any currently focused element
        if (document.activeElement && document.activeElement instanceof HTMLElement) {
          document.activeElement.blur()
        }
        // Then focus on progress textarea
        progressTextareaRef.current?.focus()
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [isOpen, task])

  if (!task || !editingTask) return null

  const generateTaskPath = (currentTask: Task): string => {
    if (!currentTask.parentId) return currentTask.category || ""
    const parent = allTasks.find((t) => t.id === currentTask.parentId)
    if (!parent) return currentTask.category || ""
    const parentPath = generateTaskPath(parent)
    return parentPath ? `${parentPath} / ${parent.title}` : parent.title
  }

  const getChildTasks = (parentId: string): Task[] => {
    return allTasks.filter((t) => t.parentId === parentId)
  }

  const childTasks = getChildTasks(task.id)
  const parentTask = task.parentId ? allTasks.find((t) => t.id === task.parentId) : null

  const handleSave = () => {
    onUpdateTask(task.id, editingTask)
    onClose()
  }

  const handleCancel = () => {
    setEditingTask({ ...task, tags: task.tags || [] })
    setLocalProgressHistory(task.progressHistory || [])
    onClose()
  }

  const startEditingProgress = (progressId: string, content: string) => {
    setEditingProgressId(progressId)
    setEditingProgressContent(content)
  }

  const saveProgressEdit = () => {
    if (editingProgressId && editingProgressContent.trim()) {
      onUpdateProgress(task.id, editingProgressId, editingProgressContent.trim())
      setLocalProgressHistory((prev = []) =>
        prev.map((p) => (p.id === editingProgressId ? { ...p, content: editingProgressContent.trim() } : p)),
      )
      setEditingProgressId(null)
      setEditingProgressContent("")
    }
  }

  const cancelProgressEdit = () => {
    setEditingProgressId(null)
    setEditingProgressContent("")
  }

  const addTag = (tagToAdd: string) => {
    const trimmedTag = tagToAdd.trim()
    if (trimmedTag && !editingTask.tags?.includes(trimmedTag)) {
      setEditingTask({ ...editingTask, tags: [...(editingTask.tags || []), trimmedTag] })
      setNewTag("")
      setShowTagSuggestions(false)
    }
  }

  const removeTag = (tagToRemove: string) => {
    setEditingTask({ ...editingTask, tags: editingTask.tags?.filter((tag) => tag !== tagToRemove) })
  }

  const handleTagInputChange = (value: string) => {
    setNewTag(value)
    setShowTagSuggestions(value.length > 0)
  }

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (newTag.trim()) addTag(newTag)
    } else if (e.key === "Escape") {
      setNewTag("")
      setShowTagSuggestions(false)
    }
  }

  const getFilteredAvailableTags = () => {
    if (!newTag.trim()) return []
    const currentTags = editingTask.tags || []
    return availableTags
      .filter((tag) => !currentTags.some((currentTag) => currentTag.toLowerCase() === tag.toLowerCase()))
      .filter((tag) => tag.toLowerCase().includes(newTag.toLowerCase()))
      .slice(0, 5)
  }

  const handleAddProgress = () => {
    if (!newProgressContent.trim() || !task) return
    const newProgressEntry = {
      id: Date.now().toString(),
      content: newProgressContent.trim(),
      timestamp: new Date(),
      type: "progress" as const,
    }
    const updatedProgressHistory = [...(localProgressHistory || []), newProgressEntry]
    setLocalProgressHistory(updatedProgressHistory)
    onUpdateTask(task.id, {
      progress: newProgressContent.trim(),
      progressHistory: updatedProgressHistory,
      updatedAt: new Date(),
    })
    setNewProgressContent("")
    toast.success("进展已添加")
  }

  const handleDeleteProgressInternal = (progressId: string) => {
    const updatedProgressHistory = (localProgressHistory || []).filter((p) => p.id !== progressId)
    setLocalProgressHistory(updatedProgressHistory)
    onDeleteProgress(task.id, progressId)
  }

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim() || !task || !onAddTask) return
    const newSubtask: Omit<Task, "id" | "createdAt" | "updatedAt"> = {
      title: newSubtaskTitle.trim(),
      description: newSubtaskDescription.trim() || undefined,
      completed: false,
      isFocusTask: false,
      isPriorityFocus: false,
      priority: newSubtaskPriority,
      status: "todo",
      type: newSubtaskType,
      category: task.category,
      parentId: task.id,
      isInPending: true,
      tags: [],
      progressHistory: [],
    }
    onAddTask(newSubtask)
    setNewSubtaskTitle("")
    setNewSubtaskDescription("")
    setNewSubtaskType("action")
    setNewSubtaskPriority("low")
    setShowAddSubtaskForm(false)
    toast.success("子任务已创建并添加到待处理列表")
  }

  const typeInfo = getTypeInfo(editingTask.type)
  const filteredTags = getFilteredAvailableTags()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] bg-slate-900/95 border-slate-700 text-white p-0 flex flex-col backdrop-blur-sm">
        <DialogHeader className="px-6 py-4 border-b border-slate-800 flex-shrink-0">
          <DialogTitle className="text-xl font-semibold flex items-center gap-3">
            <span className="text-2xl">{typeInfo.emoji}</span>
            {editingTitle ? (
              <Input
                value={editingTask.title}
                onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                onBlur={() => setEditingTitle(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setEditingTitle(false)
                  }
                  if (e.key === "Escape") {
                    setEditingTask({ ...editingTask, title: task.title })
                    setEditingTitle(false)
                  }
                }}
                className="text-xl font-semibold bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
                autoFocus
              />
            ) : (
              <div
                onClick={() => setEditingTitle(true)}
                className="text-xl font-semibold cursor-pointer hover:bg-slate-800/50 px-1 py-0.5 rounded transition-colors"
                title="点击编辑标题"
              >
                {editingTask.title}
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-x-6 overflow-hidden px-6 pb-6">
          {/* Main Content */}
          <ScrollArea className="col-span-2 pr-4 -mr-4">
            <div className="space-y-6 py-2">
              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">任务描述</label>
                <Textarea
                  value={editingTask.description || ""}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  placeholder="添加更详细的描述..."
                  className="bg-slate-800/50 border-slate-700 text-slate-200 min-h-[120px] resize-none focus:bg-slate-800"
                  tabIndex={-1}
                />
              </div>

              {/* Subtasks */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-slate-400">子任务 ({childTasks.length})</h3>
                  {(editingTask.type === "project" ||
                    editingTask.type === "key-result" ||
                    editingTask.type === "objective") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAddSubtaskForm(!showAddSubtaskForm)}
                      className="text-slate-400 hover:text-white"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      添加子任务
                    </Button>
                  )}
                </div>

                {/* Add Subtask Form */}
                {showAddSubtaskForm && (
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-4">
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">子任务标题 *</label>
                        <Input
                          value={newSubtaskTitle}
                          onChange={(e) => setNewSubtaskTitle(e.target.value)}
                          placeholder="输入子任务标题..."
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">子任务描述</label>
                        <Textarea
                          value={newSubtaskDescription}
                          onChange={(e) => setNewSubtaskDescription(e.target.value)}
                          placeholder="输入子任务描述（可选）..."
                          className="bg-slate-700 border-slate-600 text-white min-h-[60px] resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-300">任务类型</label>
                          <Select
                            value={newSubtaskType}
                            onValueChange={(value: "action" | "project") => setNewSubtaskType(value)}
                          >
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700">
                              <SelectItem value="action" className="text-white hover:bg-slate-700">
                                <div className="flex items-center gap-2">
                                  <span>⚡️</span>
                                  <span>动作</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="project" className="text-white hover:bg-slate-700">
                                <div className="flex items-center gap-2">
                                  <span>📁</span>
                                  <span>项目</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-300">优先级</label>
                          <Select
                            value={newSubtaskPriority}
                            onValueChange={(value: "low" | "medium" | "high") => setNewSubtaskPriority(value)}
                          >
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700">
                              <SelectItem value="low" className="text-white hover:bg-slate-700">
                                低优先级
                              </SelectItem>
                              <SelectItem value="medium" className="text-white hover:bg-slate-700">
                                中优先级
                              </SelectItem>
                              <SelectItem value="high" className="text-white hover:bg-slate-700">
                                高优先级
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-600">
                      <div className="text-xs text-slate-400">
                        新子任务将添加到待处理列表，并自动设置当前任务为父任务
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setShowAddSubtaskForm(false)
                            setNewSubtaskTitle("")
                            setNewSubtaskDescription("")
                            setNewSubtaskType("action")
                            setNewSubtaskPriority("low")
                          }}
                          className="text-slate-400 hover:text-white"
                        >
                          取消
                        </Button>
                        <Button
                          onClick={handleAddSubtask}
                          disabled={!newSubtaskTitle.trim()}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          创建子任务
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Existing Subtasks */}
                <div className="space-y-2">
                  {childTasks.length > 0 ? (
                    childTasks.map((child) => (
                      <div
                        key={child.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:bg-slate-800/70 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <span className="text-lg">{getTypeInfo(child.type).emoji}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-white truncate">{child.title}</div>
                            {child.description && (
                              <div className="text-xs text-slate-400 truncate mt-1">{child.description}</div>
                            )}
                          </div>
                          <Badge variant="outline" className={cn("border-0", getStatusInfo(child.status).bgColor)}>
                            {getStatusInfo(child.status).text}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onOpenSubtaskDetails?.(child)}
                            className="p-1 h-7 w-7 text-slate-400 hover:text-blue-400"
                            title="查看详情"
                          >
                            <Edit3 className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onLocateTaskInBoard?.(child.id, child.type)}
                            className="p-1 h-7 w-7 text-slate-400 hover:text-green-400"
                            title="在看板中定位"
                          >
                            <span className="text-sm">📍</span>
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : !showAddSubtaskForm ? (
                    <div className="text-center py-8 text-slate-400 bg-slate-800/30 rounded-lg border border-slate-700">
                      <p className="text-sm">暂无子任务</p>
                      {editingTask.type === "project" ||
                      editingTask.type === "key-result" ||
                      editingTask.type === "objective" ? (
                        <p className="text-xs mt-1">点击上方"添加子任务"按钮创建第一个子任务</p>
                      ) : (
                        <p className="text-xs mt-1">只有项目、关键结果和目标类型的任务可以添加子任务</p>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Progress History */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-slate-400">进展历史</h3>
                <div className="flex gap-3">
                  <Textarea
                    ref={progressTextareaRef}
                    value={newProgressContent}
                    onChange={(e) => setNewProgressContent(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleAddProgress()
                      }
                    }}
                    placeholder="记录你的进展..."
                    className="bg-slate-800/50 border-slate-700 text-slate-200 resize-none focus:bg-slate-800"
                    rows={2}
                    tabIndex={0}
                  />
                  <Button onClick={handleAddProgress} disabled={!newProgressContent.trim()}>
                    <Plus className="w-4 h-4 mr-1" />
                    添加
                  </Button>
                </div>
                <div className="space-y-3">
                  {(localProgressHistory || [])
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map((p) => (
                      <div key={p.id} className="flex items-start gap-3 text-sm">
                        <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <MessageSquare className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-slate-300">进展更新</p>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500">
                                {new Date(p.timestamp).toLocaleString("zh-CN")}
                              </span>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => startEditingProgress(p.id, p.content)}
                                  className="p-1 h-6 w-6 text-slate-400 hover:text-blue-400"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteProgressInternal(p.id)}
                                  className="p-1 h-6 w-6 text-slate-400 hover:text-red-400"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          {editingProgressId === p.id ? (
                            <div className="space-y-2 mt-2">
                              <Textarea
                                value={editingProgressContent}
                                onChange={(e) => setEditingProgressContent(e.target.value)}
                                className="bg-slate-700 border-slate-600 text-white text-sm resize-none"
                                rows={2}
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={saveProgressEdit}
                                  className="bg-green-600 hover:bg-green-700 text-white h-7 px-2"
                                >
                                  <Check className="w-3 h-3 mr-1" />
                                  保存
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={cancelProgressEdit}
                                  className="text-slate-400 hover:text-white h-7 px-2"
                                >
                                  取消
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-slate-400 whitespace-pre-wrap mt-1">{p.content}</p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Sidebar */}
          <ScrollArea className="col-span-1 border-l border-slate-800 pl-6 -ml-6">
            <div className="space-y-6 py-2">
              {/* Attributes */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-slate-400">属性</h3>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center justify-between p-2 rounded-md hover:bg-slate-800/50">
                    <span className="text-slate-300">状态</span>
                    <Select
                      value={editingTask.status}
                      onValueChange={(value: Task["status"]) =>
                        setEditingTask({
                          ...editingTask,
                          status: value,
                          completed: value === "completed",
                        })
                      }
                    >
                      <SelectTrigger className="w-[120px] bg-transparent border-none focus:ring-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700 text-white">
                        {["todo", "in-progress", "paused", "completed"].map((s) => {
                          const sInfo = getStatusInfo(s as Task["status"])
                          return (
                            <SelectItem key={s} value={s} className="hover:bg-slate-700">
                              <div className="flex items-center gap-2">
                                <sInfo.icon className={cn("w-4 h-4", sInfo.color)} />
                                {sInfo.text}
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-md hover:bg-slate-800/50">
                    <span className="text-slate-300">优先级</span>
                    <Select
                      value={editingTask.priority}
                      onValueChange={(value: Task["priority"]) => setEditingTask({ ...editingTask, priority: value })}
                    >
                      <SelectTrigger className="w-[120px] bg-transparent border-none focus:ring-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700 text-white">
                        {["low", "medium", "high"].map((p) => {
                          const pInfo = getPriorityInfo(p as Task["priority"])
                          return (
                            <SelectItem key={p} value={p} className="hover:bg-slate-700">
                              <div className="flex items-center gap-2">
                                <pInfo.icon className={cn("w-4 h-4", pInfo.color)} />
                                {pInfo.text}优先级
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-md hover:bg-slate-800/50">
                    <span className="text-slate-300">类型</span>
                    <Select
                      value={editingTask.type}
                      onValueChange={(value: Task["type"]) => setEditingTask({ ...editingTask, type: value })}
                    >
                      <SelectTrigger className="w-[120px] bg-transparent border-none focus:ring-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700 text-white">
                        {["action", "project", "key-result", "objective"].map((t) => {
                          const tInfo = getTypeInfo(t as Task["type"])
                          return (
                            <SelectItem key={t} value={t} className="hover:bg-slate-700">
                              <div className="flex items-center gap-2">
                                {tInfo.emoji} {tInfo.text}
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-slate-400">标签</h3>
                <div className="flex flex-wrap gap-2">
                  {editingTask.tags?.map((tag) => (
                    <Badge key={tag} className={cn("border", getTagColor(tag))}>
                      {tag}
                      <button onClick={() => removeTag(tag)} className="ml-1.5 opacity-70 hover:opacity-100">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="relative">
                  <Input
                    value={newTag}
                    onChange={(e) => handleTagInputChange(e.target.value)}
                    onKeyDown={handleTagKeyPress}
                    onFocus={() => setShowTagSuggestions(newTag.length > 0)}
                    onBlur={(e) => {
                      const relatedTarget = e.relatedTarget as HTMLElement
                      if (relatedTarget && relatedTarget.closest("[data-tag-suggestion]")) {
                        return
                      }
                      setTimeout(() => setShowTagSuggestions(false), 150)
                    }}
                    placeholder="添加标签..."
                    className="bg-slate-800/50 border-slate-700 focus:bg-slate-800"
                  />
                  {showTagSuggestions && filteredTags.length > 0 && (
                    <div
                      className="absolute bottom-full left-0 right-0 mb-1 bg-slate-800 border border-slate-700 rounded-md shadow-lg z-10"
                      data-tag-suggestion
                    >
                      {filteredTags.map((tag) => (
                        <div
                          key={tag}
                          onMouseDown={(e) => {
                            e.preventDefault()
                            addTag(tag)
                          }}
                          className="px-3 py-2 hover:bg-slate-700 cursor-pointer text-sm flex items-center gap-2"
                        >
                          <Badge className={cn("border text-xs", getTagColor(tag))}>{tag}</Badge>
                          <span className="font-medium">{tag}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Relations */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-slate-400">关联关系</h3>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">父任务</label>
                  <Select
                    value={editingTask.parentId || "none"}
                    onValueChange={(value) =>
                      setEditingTask({ ...editingTask, parentId: value === "none" ? undefined : value })
                    }
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-700">
                      <SelectValue placeholder="选择父任务" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      <SelectItem value="none">无父任务</SelectItem>
                      {availableParentTasks.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          <div className="flex items-center gap-2">
                            <span>{getTypeInfo(p.type).emoji}</span>
                            <span>{p.title}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {parentTask && (
                    <div className="text-xs text-slate-400 bg-slate-800/50 rounded px-2 py-1">
                      当前父任务: {parentTask.title}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">路径</label>
                  <Input
                    value={editingTask.category || ""}
                    onChange={(e) => setEditingTask({ ...editingTask, category: e.target.value })}
                    placeholder="请输入基础路径..."
                    className="bg-slate-800/50 border-slate-700"
                  />
                  {generateTaskPath(editingTask) && (
                    <div className="text-xs text-slate-400 bg-slate-800/50 rounded px-2 py-1">
                      完整路径: {generateTaskPath(editingTask)}
                    </div>
                  )}
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-3 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  创建于: {new Date(editingTask.createdAt).toLocaleString("zh-CN")}
                </div>
                {editingTask.updatedAt && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    更新于: {new Date(editingTask.updatedAt).toLocaleString("zh-CN")}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-slate-800 flex-shrink-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => onToggleFocus(task.id)}
                className="text-slate-400 hover:text-white"
              >
                <Minus className="w-4 h-4 mr-2" />
                {task.isFocusTask ? "移出焦点" : "加入焦点"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => onTogglePriorityFocus(task.id)}
                className="text-slate-400 hover:text-white"
              >
                <Pin className="w-4 h-4 mr-2" />
                {task.isPriorityFocus ? "取消优先" : "设为优先"}
              </Button>
            </div>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              保存更改
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
