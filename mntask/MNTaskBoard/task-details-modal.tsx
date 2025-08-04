"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Trash2, Edit3, Check, Minus, Pin, Link, X, Plus, Tag } from "lucide-react"
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
  onOpenSubtaskDetails?: (subtask: Task) => void
  onLocateTaskInBoard?: (taskId: string, taskType: string) => void
}

// 预定义的标签颜色
const tagColors = [
  "bg-red-500/20 text-red-300 border-red-500/30",
  "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "bg-green-500/20 text-green-300 border-green-500/30",
  "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "bg-pink-500/20 text-pink-300 border-pink-500/30",
  "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "bg-teal-500/20 text-teal-300 border-teal-500/30",
  "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
]

// 根据标签名称生成一致的颜色
const getTagColor = (tag: string): string => {
  const hash = tag.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0)
    return a & a
  }, 0)
  return tagColors[Math.abs(hash) % tagColors.length]
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
}: TaskDetailsModalProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editingProgressId, setEditingProgressId] = useState<string | null>(null)
  const [editingProgressContent, setEditingProgressContent] = useState("")
  const [newTag, setNewTag] = useState("")
  const [showTagSuggestions, setShowTagSuggestions] = useState(false)
  const [newProgressContent, setNewProgressContent] = useState("")
  // 添加本地进展历史状态，用于立即更新显示
  const [localProgressHistory, setLocalProgressHistory] = useState<Array<{
    id: string
    content: string
    timestamp: Date
    type: "progress" | "status" | "comment"
  }>>([])

  useEffect(() => {
    if (task) {
      setEditingTask({ ...task, tags: task.tags || [] })
      setLocalProgressHistory(task.progressHistory || [])
    }
  }, [task])

  if (!task || !editingTask) return null

  // 生成任务路径
  const generateTaskPath = (task: Task): string => {
    if (!task.parentId) {
      return task.category || ""
    }

    const parentTask = allTasks.find((t) => t.id === task.parentId)
    if (!parentTask) {
      return task.category || ""
    }

    const parentPath = generateTaskPath(parentTask)
    return parentPath ? `${parentPath} >> ${parentTask.title}` : parentTask.title
  }

  // 获取子任务
  const getChildTasks = (parentId: string): Task[] => {
    return allTasks.filter((task) => task.parentId === parentId)
  }

  const childTasks = getChildTasks(task.id)
  const parentTask = task.parentId ? allTasks.find((t) => t.id === task.parentId) : null

  const handleSave = () => {
    onUpdateTask(task.id, {
      title: editingTask.title,
      description: editingTask.description,
      category: editingTask.category,
      type: editingTask.type,
      priority: editingTask.priority,
      status: editingTask.status,
      completed: editingTask.status === "completed",
      parentId: editingTask.parentId,
      tags: editingTask.tags,
    })
    onClose()
  }

  const handleCancel = () => {
    setEditingTask({ ...task, tags: task.tags || [] })
    setLocalProgressHistory(task.progressHistory || [])
    onClose()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "bg-slate-600 text-slate-300"
      case "in-progress":
        return "bg-blue-600 text-blue-100"
      case "paused":
        return "bg-yellow-600 text-yellow-100"
      case "completed":
        return "bg-green-600 text-green-100"
      default:
        return "bg-slate-600 text-slate-300"
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
        return "未知"
    }
  }

  const getTypeInfo = (type: string) => {
    switch (type) {
      case "action":
        return { emoji: "⚡️", text: "动作" }
      case "project":
        return { emoji: "📁", text: "项目" }
      case "key-result":
        return { emoji: "📈", text: "关键结果" }
      case "objective":
        return { emoji: "🎯", text: "目标" }
      default:
        return { emoji: "⚡️", text: "动作" }
    }
  }

  const typeInfo = getTypeInfo(editingTask.type)

  const startEditingProgress = (progressId: string, content: string) => {
    setEditingProgressId(progressId)
    setEditingProgressContent(content)
  }

  const saveProgressEdit = () => {
    if (editingProgressId && editingProgressContent.trim()) {
      onUpdateProgress(task.id, editingProgressId, editingProgressContent.trim())

      // 更新本地状态
      setLocalProgressHistory((prev) =>
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

  // 添加标签
  const addTag = (tagToAdd: string) => {
    const trimmedTag = tagToAdd.trim()
    if (trimmedTag && !editingTask.tags?.some((tag) => tag.toLowerCase() === trimmedTag.toLowerCase())) {
      setEditingTask({
        ...editingTask,
        tags: [...(editingTask.tags || []), trimmedTag],
      })
      setNewTag("")
      setShowTagSuggestions(false)
    }
  }

  // 删除标签
  const removeTag = (tagToRemove: string) => {
    setEditingTask({
      ...editingTask,
      tags: editingTask.tags?.filter((tag) => tag !== tagToRemove),
    })
  }

  // 处理标签输入
  const handleTagInputChange = (value: string) => {
    setNewTag(value)
    setShowTagSuggestions(value.length > 0)
  }

  // 处理标签输入的回车键
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (newTag.trim()) {
        addTag(newTag)
      }
    } else if (e.key === "Escape") {
      setNewTag("")
      setShowTagSuggestions(false)
    }
  }

  // 过滤可用标签，排除已选择的标签，支持模糊搜索
  const getFilteredAvailableTags = () => {
    if (!newTag.trim()) return []

    const currentTags = editingTask.tags || []
    const filtered = availableTags
      .filter((tag) => !currentTags.some((currentTag) => currentTag.toLowerCase() === tag.toLowerCase()))
      .filter((tag) => tag.toLowerCase().includes(newTag.toLowerCase()))
      .slice(0, 5) // 限制显示数量

    return filtered
  }

  const filteredTags = getFilteredAvailableTags()

  const handleAddProgress = () => {
    if (!newProgressContent.trim() || !task) return

    const newProgressEntry = {
      id: Date.now().toString(),
      content: newProgressContent.trim(),
      timestamp: new Date(),
      type: "progress" as const,
    }

    // 立即更新本地状态
    const updatedProgressHistory = [...localProgressHistory, newProgressEntry]
    setLocalProgressHistory(updatedProgressHistory)

    // 调用父组件的更新函数
    onUpdateTask(task.id, {
      progress: newProgressContent.trim(),
      progressHistory: updatedProgressHistory,
      updatedAt: new Date(),
    })

    // 清空输入框
    setNewProgressContent("")

    // 显示成功提示
    toast?.success?.("进展已添加")
  }

  const handleDeleteProgress = (progressId: string) => {
    // 更新本地状态
    const updatedProgressHistory = localProgressHistory.filter((p) => p.id !== progressId)
    setLocalProgressHistory(updatedProgressHistory)

    // 调用父组件的删除函数
    onDeleteProgress(task.id, progressId)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-slate-900 border-slate-700 text-white overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <span className="text-lg">{typeInfo.emoji}</span>
            任务详情
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 状态徽章 */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={`${getStatusColor(editingTask.status)} border-0`}>
              {getStatusText(editingTask.status)}
            </Badge>
            {editingTask.isPriorityFocus && (
              <Badge className="bg-red-500/20 text-red-300 border-red-500/30">优先焦点</Badge>
            )}
          </div>

          {/* 标签管理 */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              标签
            </label>

            {/* 现有标签显示 */}
            <div className="flex flex-wrap gap-2">
              {editingTask.tags?.map((tag, index) => (
                <Badge key={index} className={`${getTagColor(tag)} border text-xs flex items-center gap-1 pr-1`}>
                  <span>{tag}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTag(tag)}
                    className="p-0 h-4 w-4 hover:bg-transparent text-current opacity-70 hover:opacity-100"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
              {(!editingTask.tags || editingTask.tags.length === 0) && (
                <span className="text-slate-400 text-sm">暂无标签</span>
              )}
            </div>

            {/* 添加新标签 */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="flex-1 relative">
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
                    placeholder="输入新标签..."
                    className="bg-slate-800 border-slate-700 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />

                  {/* 标签建议下拉列表 */}
                  {showTagSuggestions && filteredTags.length > 0 && (
                    <div
                      className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-300 rounded-lg shadow-xl z-50 max-h-40 overflow-y-auto"
                      data-tag-suggestion
                    >
                      {filteredTags.map((tag) => (
                        <div
                          key={tag}
                          onMouseDown={(e) => {
                            e.preventDefault()
                            addTag(tag)
                          }}
                          className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 last:border-b-0"
                        >
                          <Badge className={`${getTagColor(tag)} border text-xs`}>{tag}</Badge>
                          <span className="font-medium">{tag}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => addTag(newTag)}
                  disabled={
                    !newTag.trim() || editingTask.tags?.some((tag) => tag.toLowerCase() === newTag.trim().toLowerCase())
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-xs text-slate-400">
                输入标签名称，按回车或点击加号添加。输入时会显示匹配的已有标签供选择。
              </div>
            </div>
          </div>

          {/* 父任务关联 */}
          {(editingTask.type === "action" || editingTask.type === "project") && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Link className="w-4 h-4" />
                父任务
              </label>
              <Select
                value={editingTask.parentId || "none"}
                onValueChange={(value) =>
                  setEditingTask({ ...editingTask, parentId: value === "none" ? undefined : value })
                }
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="选择父任务（可选）" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="none" className="text-white hover:bg-slate-700">
                    无父任务
                  </SelectItem>
                  {availableParentTasks.map((parentTask) => (
                    <SelectItem key={parentTask.id} value={parentTask.id} className="text-white hover:bg-slate-700">
                      <div className="flex items-center gap-2">
                        <span>📁</span>
                        <span>{parentTask.title}</span>
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
          )}

          {/* 子任务显示 */}
          {childTasks.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Link className="w-4 h-4" />
                子任务 ({childTasks.length})
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {childTasks.map((childTask) => (
                  <div
                    key={childTask.id}
                    className="text-xs text-slate-300 bg-slate-800/50 border border-slate-700 rounded px-3 py-2 hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div
                        className="flex items-center gap-2 flex-1 cursor-pointer hover:text-white transition-colors"
                        onClick={() => onOpenSubtaskDetails?.(childTask)}
                        title="点击查看详情"
                      >
                        <span>{getTypeInfo(childTask.type).emoji}</span>
                        <span className="font-medium">{childTask.title}</span>
                        <Badge className={`${getStatusColor(childTask.status)} border-0 text-xs`}>
                          {getStatusText(childTask.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            onOpenSubtaskDetails?.(childTask)
                          }}
                          className="p-1 h-6 w-6 text-slate-400 hover:text-blue-400"
                          title="查看详情"
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            onLocateTaskInBoard?.(childTask.id, childTask.type)
                          }}
                          className="p-1 h-6 w-6 text-slate-400 hover:text-green-400"
                          title="在看板中定位"
                        >
                          <span className="text-sm">📍</span>
                        </Button>
                      </div>
                    </div>
                    {childTask.description && (
                      <div className="mt-1 text-slate-400 text-xs truncate">{childTask.description}</div>
                    )}
                  </div>
                ))}
              </div>
              <div className="text-xs text-slate-400">点击子任务可查看详情，点击📍可在看板中定位该任务</div>
            </div>
          )}

          {/* 路径字段 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">路径</label>
            <div className="bg-slate-800/50 border border-slate-700 rounded px-3 py-2 text-white text-sm">
              {generateTaskPath(editingTask) || "无路径"}
            </div>
            <Input
              value={editingTask.category || ""}
              onChange={(e) => setEditingTask({ ...editingTask, category: e.target.value })}
              placeholder="请输入基础路径..."
              className="bg-slate-800 border-slate-700 text-white"
            />
            <div className="text-xs text-slate-400">基础路径会与父任务路径组合生成完整路径</div>
          </div>

          {/* 任务标题 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">任务标题</label>
            <Input
              value={editingTask.title}
              onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
              placeholder="请输入任务标题..."
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          {/* 任务描述 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">任务描述</label>
            <Textarea
              value={editingTask.description || ""}
              onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
              placeholder="请输入任务描述..."
              className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
            />
          </div>

          {/* 任务类型、状态、优先级 */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">任务类型</label>
              <Select
                value={editingTask.type}
                onValueChange={(value: "action" | "project" | "key-result" | "objective") =>
                  setEditingTask({ ...editingTask, type: value })
                }
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
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
                  <SelectItem value="key-result" className="text-white hover:bg-slate-700">
                    <div className="flex items-center gap-2">
                      <span>📈</span>
                      <span>关键结果</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="objective" className="text-white hover:bg-slate-700">
                    <div className="flex items-center gap-2">
                      <span>🎯</span>
                      <span>目标</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">状态</label>
              <Select
                value={editingTask.status}
                onValueChange={(value: "todo" | "in-progress" | "completed" | "paused") =>
                  setEditingTask({
                    ...editingTask,
                    status: value,
                    completed: value === "completed",
                  })
                }
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="todo" className="text-white hover:bg-slate-700">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                      <span>待开始</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="in-progress" className="text-white hover:bg-slate-700">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>进行中</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="paused" className="text-white hover:bg-slate-700">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span>已暂停</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="completed" className="text-white hover:bg-slate-700">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>已完成</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">优先级</label>
              <Select
                value={editingTask.priority}
                onValueChange={(value: "low" | "medium" | "high") =>
                  setEditingTask({ ...editingTask, priority: value })
                }
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
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

          {/* 进展历史 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium text-white">进展历史</h3>
              <Badge className="bg-slate-700 text-slate-300 border-slate-600">
                {localProgressHistory.length} 条记录
              </Badge>
            </div>

            {/* 添加新进展 */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <Textarea
                  value={newProgressContent}
                  onChange={(e) => setNewProgressContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleAddProgress()
                    }
                  }}
                  placeholder="记录任务进展..."
                  className="flex-1 bg-slate-800 border-slate-700 text-white text-sm min-h-[80px] resize-none"
                />
                <Button
                  onClick={handleAddProgress}
                  disabled={!newProgressContent.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 self-start disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  添加
                </Button>
              </div>
              <div className="text-xs text-slate-400">记录任务的最新进展，按 Enter 快速添加（Shift+Enter 换行）</div>
            </div>

            {/* 进展历史列表 - 修复滚动问题 */}
            <div className="border border-slate-700 rounded-lg bg-slate-800/30">
              <div className="max-h-80 overflow-y-auto p-1">
                {localProgressHistory && localProgressHistory.length > 0 ? (
                  <div className="space-y-3 p-3">
                    {localProgressHistory
                      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                      .map((progress) => (
                        <div key={progress.id} className="bg-slate-800/70 rounded-lg p-3 border border-slate-700">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                                <span className="text-xs text-slate-400">进展更新</span>
                                <span className="text-xs text-slate-500">
                                  {new Date(progress.timestamp).toLocaleString("zh-CN")}
                                </span>
                              </div>
                              {editingProgressId === progress.id ? (
                                <div className="space-y-2">
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
                                <p className="text-sm text-slate-300 whitespace-pre-wrap break-words">
                                  {progress.content}
                                </p>
                              )}
                            </div>
                            {editingProgressId !== progress.id && (
                              <div className="flex gap-1 flex-shrink-0">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => startEditingProgress(progress.id, progress.content)}
                                  className="p-1 h-6 w-6 text-slate-400 hover:text-blue-400"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteProgress(progress.id)}
                                  className="p-1 h-6 w-6 text-slate-400 hover:text-red-400"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <p>暂无进展记录</p>
                    <p className="text-xs mt-1">在上方输入框中添加第一条进展记录</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-slate-700" />

        {/* 底部按钮 */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => onToggleFocus(task.id)}
              className="text-slate-400 hover:text-white"
              tabIndex={-1}
            >
              <Minus className="w-4 h-4 mr-2" />
              移出焦点
            </Button>
            <Button
              variant="ghost"
              onClick={() => onTogglePriorityFocus(task.id)}
              className="text-slate-400 hover:text-white"
              tabIndex={-1}
            >
              <Pin className="w-4 h-4 mr-2" />
              设为优先
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleCancel} className="text-slate-400 hover:text-white" tabIndex={-1}>
              取消
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white" tabIndex={-1}>
              保存更改
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
