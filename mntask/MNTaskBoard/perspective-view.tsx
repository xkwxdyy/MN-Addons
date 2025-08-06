"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Eye, Plus, Edit, Trash2, Filter, Target, FolderOpen, TrendingUp, Crosshair, Clock, X } from "lucide-react"
import { TaskCard } from "./task-card"
import { PendingTaskCard } from "./pending-task-card"
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

interface PerspectiveFilter {
  tags: string[]
  taskTypes: string[]
  statuses: string[]
  priorities: string[]
  focusTask: string // "all" | "focus" | "non-focus"
  priorityFocus: string // "all" | "priority" | "non-priority"
}

interface Perspective {
  id: string
  name: string
  description?: string
  filters: PerspectiveFilter
  groupBy: "none" | "type" | "status" | "priority"
  createdAt: Date
}

interface PerspectiveViewProps {
  tasks: Task[]
  pendingTasks: Task[]
  perspectives: Perspective[]
  selectedPerspectiveId: string | null
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void
  onOpenDetails: (taskId: string) => void
  onDeleteTask: (taskId: string) => void
  onAddToFocus: (taskId: string) => void
  onToggleFocus: (taskId: string) => void
  onTogglePriorityFocus: (taskId: string) => void
  onToggleStatus: (taskId: string) => void
  onComplete: (taskId: string) => void
  onLocateTask: (taskId: string) => void
  onLaunchTask: (taskId: string) => void
  onStartTask: (taskId: string) => void
  onPauseTask: (taskId: string) => void
  onResumeTask: (taskId: string) => void
  onAddProgress: (taskId: string, progress: string) => void
  onRemoveFromPending: (taskId: string) => void
  availableTags: string[]
  onPerspectiveChange: (perspectiveId: string | null) => void
  onCreatePerspective: (perspective: Omit<Perspective, "id" | "createdAt">) => Perspective
  onUpdatePerspective: (perspectiveId: string, updates: Partial<Perspective>) => void
  onDeletePerspective: (perspectiveId: string) => void
}

export function PerspectiveView({
  tasks,
  pendingTasks,
  perspectives,
  selectedPerspectiveId,
  onUpdateTask,
  onOpenDetails,
  onDeleteTask,
  onAddToFocus,
  onToggleFocus,
  onTogglePriorityFocus,
  onToggleStatus,
  onComplete,
  onLocateTask,
  onLaunchTask,
  onStartTask,
  onPauseTask,
  onResumeTask,
  onAddProgress,
  onRemoveFromPending,
  availableTags,
  onPerspectiveChange,
  onCreatePerspective,
  onUpdatePerspective,
  onDeletePerspective,
}: PerspectiveViewProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingPerspective, setEditingPerspective] = useState<Perspective | null>(null)
  const [showCompletedTasks, setShowCompletedTasks] = useState(false)

  // 表单状态
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    groupBy: "none" as "none" | "type" | "status" | "priority",
    filters: {
      tags: [] as string[],
      taskTypes: [] as string[],
      statuses: [] as string[],
      priorities: [] as string[],
      focusTask: "all",
      priorityFocus: "all",
    },
  })

  // 重置表单
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      groupBy: "none",
      filters: {
        tags: [],
        taskTypes: [],
        statuses: [],
        priorities: [],
        focusTask: "all",
        priorityFocus: "all",
      },
    })
  }

  // 应用透视筛选
  const applyPerspectiveFilter = (allTasks: Task[], filters: PerspectiveFilter): Task[] => {
    return allTasks.filter((task) => {
      // 标签筛选
      if (filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some((tag) => task.tags?.includes(tag))
        if (!hasMatchingTag) return false
      }

      // 任务类型筛选
      if (filters.taskTypes.length > 0 && !filters.taskTypes.includes(task.type)) {
        return false
      }

      // 状态筛选
      if (filters.statuses.length > 0 && !filters.statuses.includes(task.status)) {
        return false
      }

      // 优先级筛选
      if (filters.priorities.length > 0 && !filters.priorities.includes(task.priority)) {
        return false
      }

      // 焦点任务筛选
      if (filters.focusTask === "focus" && !task.isFocusTask) return false
      if (filters.focusTask === "non-focus" && task.isFocusTask) return false

      // 优先焦点筛选
      if (filters.priorityFocus === "priority" && !task.isPriorityFocus) return false
      if (filters.priorityFocus === "non-priority" && task.isPriorityFocus) return false

      return true
    })
  }

  // 获取当前选中的透视
  const selectedPerspective = selectedPerspectiveId ? perspectives.find((p) => p.id === selectedPerspectiveId) : null

  // 获取筛选后的任务
  const allTasks = [...tasks, ...pendingTasks]
  const filteredTasks = selectedPerspective ? applyPerspectiveFilter(allTasks, selectedPerspective.filters) : allTasks

  // 根据是否显示已完成任务进行筛选
  const displayTasks = showCompletedTasks ? filteredTasks : filteredTasks.filter((task) => !task.completed)

  // 按分组方式组织任务
  const groupTasks = (tasks: Task[], groupBy: string) => {
    if (groupBy === "none") {
      return { 所有任务: tasks }
    }

    const groups: Record<string, Task[]> = {}

    tasks.forEach((task) => {
      let groupKey = ""
      switch (groupBy) {
        case "type":
          groupKey = getTypeText(task.type)
          break
        case "status":
          groupKey = getStatusText(task.status)
          break
        case "priority":
          groupKey = getPriorityText(task.priority)
          break
        default:
          groupKey = "所有任务"
      }

      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push(task)
    })

    return groups
  }

  const groupedTasks = selectedPerspective
    ? groupTasks(displayTasks, selectedPerspective.groupBy)
    : groupTasks(displayTasks, "none")

  // 处理创建透视
  const handleCreatePerspective = () => {
    if (!formData.name.trim()) {
      toast.error("请输入透视名称")
      return
    }

    const newPerspective = onCreatePerspective({
      name: formData.name.trim(),
      description: formData.description.trim(),
      filters: formData.filters,
      groupBy: formData.groupBy,
    })

    onPerspectiveChange(newPerspective.id)
    setIsCreateDialogOpen(false)
    resetForm()
  }

  // 处理编辑透视
  const handleEditPerspective = (perspective: Perspective) => {
    setEditingPerspective(perspective)
    setFormData({
      name: perspective.name,
      description: perspective.description || "",
      groupBy: perspective.groupBy,
      filters: { ...perspective.filters },
    })
    setIsEditDialogOpen(true)
  }

  // 处理更新透视
  const handleUpdatePerspective = () => {
    if (!editingPerspective || !formData.name.trim()) {
      toast.error("请输入透视名称")
      return
    }

    onUpdatePerspective(editingPerspective.id, {
      name: formData.name.trim(),
      description: formData.description.trim(),
      filters: formData.filters,
      groupBy: formData.groupBy,
    })

    setIsEditDialogOpen(false)
    setEditingPerspective(null)
    resetForm()
  }

  // 处理删除透视
  const handleDeletePerspective = (perspectiveId: string) => {
    onDeletePerspective(perspectiveId)
    if (selectedPerspectiveId === perspectiveId) {
      onPerspectiveChange(null)
    }
  }

  // 辅助函数
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

  // 生成任务路径
  const generateTaskPath = (task: Task, allTasksList: Task[]): string => {
    if (!task.parentId) {
      return task.category || ""
    }

    const parentTask = allTasksList.find((t) => t.id === task.parentId)
    if (!parentTask) {
      return task.category || ""
    }

    const parentPath = generateTaskPath(parentTask, allTasksList)
    return parentPath ? `${parentPath} >> ${parentTask.title}` : parentTask.title
  }

  return (
    <div className="p-6 space-y-6">
      {/* 头部控制区域 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Eye className="w-6 h-6 text-blue-400" />
            <h1 className="text-2xl font-bold text-white">透视视图</h1>
          </div>

          {/* 透视选择器 */}
          <Select
            value={selectedPerspectiveId || "all"}
            onValueChange={(value) => onPerspectiveChange(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-64 bg-slate-800/50 border-slate-700 text-white">
              <SelectValue placeholder="选择透视..." />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all" className="text-white hover:bg-slate-700">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <span>全部任务</span>
                </div>
              </SelectItem>
              {perspectives.map((perspective) => (
                <SelectItem key={perspective.id} value={perspective.id} className="text-white hover:bg-slate-700">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{perspective.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedPerspective && (
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">{displayTasks.length} 个任务</Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPerspectiveChange(null)}
                className="p-1 h-6 w-6 text-slate-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* 显示已完成任务切换 */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="show-completed"
              checked={showCompletedTasks}
              onCheckedChange={setShowCompletedTasks}
              className="border-slate-600 data-[state=checked]:bg-blue-600"
            />
            <label htmlFor="show-completed" className="text-sm text-slate-300 cursor-pointer">
              显示已完成任务
            </label>
          </div>

          {/* 创建透视按钮 */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                创建透视
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 w-[95vw] max-w-2xl max-h-[90vh] flex flex-col">
              <DialogHeader className="px-6 pt-6 pb-4">
                <DialogTitle className="text-white">创建新透视</DialogTitle>
                <DialogDescription className="text-slate-400">创建一个新的透视来筛选和组织你的任务</DialogDescription>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto px-6 space-y-4">
                {/* 基本信息 */}
                <div className="space-y-2">
                  <label className="text-white text-sm font-medium">透视名称</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="输入透视名称..."
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-white text-sm font-medium">描述（可选）</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="描述这个透视的用途..."
                    className="bg-slate-700/50 border-slate-600 text-white"
                    rows={2}
                  />
                </div>

                {/* 分组方式 */}
                <div className="space-y-2">
                  <label className="text-white text-sm font-medium">分组方式</label>
                  <Select
                    value={formData.groupBy}
                    onValueChange={(value) =>
                      setFormData({ ...formData, groupBy: value as "none" | "type" | "status" | "priority" })
                    }
                  >
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="none" className="text-white">
                        不分组
                      </SelectItem>
                      <SelectItem value="type" className="text-white">
                        按类型分组
                      </SelectItem>
                      <SelectItem value="status" className="text-white">
                        按状态分组
                      </SelectItem>
                      <SelectItem value="priority" className="text-white">
                        按优先级分组
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="bg-slate-600" />

                {/* 筛选条件 */}
                <div className="space-y-4">
                  <h3 className="text-white font-medium">筛选条件</h3>

                  {/* 标签筛选 */}
                  <div className="space-y-2">
                    <label className="text-white text-sm">标签</label>
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map((tag) => (
                        <Badge
                          key={tag}
                          className={`cursor-pointer text-xs ${
                            formData.filters.tags.includes(tag)
                              ? "bg-blue-500/30 text-blue-300 border-blue-500/50"
                              : "bg-slate-600/50 text-slate-300 border-slate-500/30 hover:bg-slate-500/50"
                          }`}
                          onClick={() => {
                            const newTags = formData.filters.tags.includes(tag)
                              ? formData.filters.tags.filter((t) => t !== tag)
                              : [...formData.filters.tags, tag]
                            setFormData({
                              ...formData,
                              filters: { ...formData.filters, tags: newTags },
                            })
                          }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* 任务类型筛选 */}
                  <div className="space-y-2">
                    <label className="text-white text-sm">任务类型</label>
                    <div className="flex flex-wrap gap-2">
                      {["action", "project", "key-result", "objective"].map((type) => (
                        <Badge
                          key={type}
                          className={`cursor-pointer text-xs ${
                            formData.filters.taskTypes.includes(type)
                              ? "bg-green-500/30 text-green-300 border-green-500/50"
                              : "bg-slate-600/50 text-slate-300 border-slate-500/30 hover:bg-slate-500/50"
                          }`}
                          onClick={() => {
                            const newTypes = formData.filters.taskTypes.includes(type)
                              ? formData.filters.taskTypes.filter((t) => t !== type)
                              : [...formData.filters.taskTypes, type]
                            setFormData({
                              ...formData,
                              filters: { ...formData.filters, taskTypes: newTypes },
                            })
                          }}
                        >
                          <div className="flex items-center gap-1">
                            {getTypeIcon(type)}
                            {getTypeText(type)}
                          </div>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* 状态筛选 */}
                  <div className="space-y-2">
                    <label className="text-white text-sm">状态</label>
                    <div className="flex flex-wrap gap-2">
                      {["todo", "in-progress", "paused", "completed"].map((status) => (
                        <Badge
                          key={status}
                          className={`cursor-pointer text-xs ${
                            formData.filters.statuses.includes(status)
                              ? "bg-yellow-500/30 text-yellow-300 border-yellow-500/50"
                              : "bg-slate-600/50 text-slate-300 border-slate-500/30 hover:bg-slate-500/50"
                          }`}
                          onClick={() => {
                            const newStatuses = formData.filters.statuses.includes(status)
                              ? formData.filters.statuses.filter((s) => s !== status)
                              : [...formData.filters.statuses, status]
                            setFormData({
                              ...formData,
                              filters: { ...formData.filters, statuses: newStatuses },
                            })
                          }}
                        >
                          {getStatusText(status)}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* 优先级筛选 */}
                  <div className="space-y-2">
                    <label className="text-white text-sm">优先级</label>
                    <div className="flex flex-wrap gap-2">
                      {["low", "medium", "high"].map((priority) => (
                        <Badge
                          key={priority}
                          className={`cursor-pointer text-xs ${
                            formData.filters.priorities.includes(priority)
                              ? "bg-purple-500/30 text-purple-300 border-purple-500/50"
                              : "bg-slate-600/50 text-slate-300 border-slate-500/30 hover:bg-slate-500/50"
                          }`}
                          onClick={() => {
                            const newPriorities = formData.filters.priorities.includes(priority)
                              ? formData.filters.priorities.filter((p) => p !== priority)
                              : [...formData.filters.priorities, priority]
                            setFormData({
                              ...formData,
                              filters: { ...formData.filters, priorities: newPriorities },
                            })
                          }}
                        >
                          {getPriorityText(priority)}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* 焦点任务筛选 */}
                  <div className="space-y-2">
                    <label className="text-white text-sm">焦点任务</label>
                    <Select
                      value={formData.filters.focusTask}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          filters: { ...formData.filters, focusTask: value },
                        })
                      }
                    >
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="all" className="text-white">
                          全部任务
                        </SelectItem>
                        <SelectItem value="focus" className="text-white">
                          仅焦点任务
                        </SelectItem>
                        <SelectItem value="non-focus" className="text-white">
                          仅非焦点任务
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 优先焦点筛选 */}
                  <div className="space-y-2">
                    <label className="text-white text-sm">优先焦点</label>
                    <Select
                      value={formData.filters.priorityFocus}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          filters: { ...formData.filters, priorityFocus: value },
                        })
                      }
                    >
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="all" className="text-white">
                          全部任务
                        </SelectItem>
                        <SelectItem value="priority" className="text-white">
                          仅优先焦点
                        </SelectItem>
                        <SelectItem value="non-priority" className="text-white">
                          仅非优先焦点
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <DialogFooter className="px-6 pb-6 pt-4 border-t border-slate-700">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false)
                    resetForm()
                  }}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                >
                  取消
                </Button>
                <Button onClick={handleCreatePerspective} className="bg-blue-600 hover:bg-blue-700 text-white">
                  创建透视
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 当前透视信息 */}
      {selectedPerspective && (
        <Card className="bg-slate-800/30 border-slate-700">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-blue-400" />
                <div>
                  <CardTitle className="text-white text-lg">{selectedPerspective.name}</CardTitle>
                  {selectedPerspective.description && (
                    <p className="text-slate-400 text-sm mt-1">{selectedPerspective.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditPerspective(selectedPerspective)}
                  className="text-slate-400 hover:text-white"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-slate-800 border-slate-700">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">删除透视</AlertDialogTitle>
                      <AlertDialogDescription className="text-slate-300">
                        确定要删除透视 "{selectedPerspective.name}" 吗？此操作无法撤销。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600">
                        取消
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeletePerspective(selectedPerspective.id)}
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        删除
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span>
                分组:{" "}
                {selectedPerspective.groupBy === "none"
                  ? "不分组"
                  : `按${selectedPerspective.groupBy === "type" ? "类型" : selectedPerspective.groupBy === "status" ? "状态" : "优先级"}分组`}
              </span>
              <span>•</span>
              <span>创建于: {new Date(selectedPerspective.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span>任务数: {displayTasks.length}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 编辑透视对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 w-[95vw] max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="text-white">编辑透视</DialogTitle>
            <DialogDescription className="text-slate-400">修改透视的筛选条件和分组方式</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 space-y-4">
            {/* 基本信息 */}
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">透视名称</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="输入透视名称..."
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-white text-sm font-medium">描述（可选）</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="描述这个透视的用途..."
                className="bg-slate-700/50 border-slate-600 text-white"
                rows={2}
              />
            </div>

            {/* 分组方式 */}
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">分组方式</label>
              <Select
                value={formData.groupBy}
                onValueChange={(value) =>
                  setFormData({ ...formData, groupBy: value as "none" | "type" | "status" | "priority" })
                }
              >
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="none" className="text-white">
                    不分组
                  </SelectItem>
                  <SelectItem value="type" className="text-white">
                    按类型分组
                  </SelectItem>
                  <SelectItem value="status" className="text-white">
                    按状态分组
                  </SelectItem>
                  <SelectItem value="priority" className="text-white">
                    按优先级分组
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator className="bg-slate-600" />

            {/* 筛选条件 - 与创建对话框相同的内容 */}
            <div className="space-y-4">
              <h3 className="text-white font-medium">筛选条件</h3>

              {/* 标签筛选 */}
              <div className="space-y-2">
                <label className="text-white text-sm">标签</label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <Badge
                      key={tag}
                      className={`cursor-pointer text-xs ${
                        formData.filters.tags.includes(tag)
                          ? "bg-blue-500/30 text-blue-300 border-blue-500/50"
                          : "bg-slate-600/50 text-slate-300 border-slate-500/30 hover:bg-slate-500/50"
                      }`}
                      onClick={() => {
                        const newTags = formData.filters.tags.includes(tag)
                          ? formData.filters.tags.filter((t) => t !== tag)
                          : [...formData.filters.tags, tag]
                        setFormData({
                          ...formData,
                          filters: { ...formData.filters, tags: newTags },
                        })
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* 任务类型筛选 */}
              <div className="space-y-2">
                <label className="text-white text-sm">任务类型</label>
                <div className="flex flex-wrap gap-2">
                  {["action", "project", "key-result", "objective"].map((type) => (
                    <Badge
                      key={type}
                      className={`cursor-pointer text-xs ${
                        formData.filters.taskTypes.includes(type)
                          ? "bg-green-500/30 text-green-300 border-green-500/50"
                          : "bg-slate-600/50 text-slate-300 border-slate-500/30 hover:bg-slate-500/50"
                      }`}
                      onClick={() => {
                        const newTypes = formData.filters.taskTypes.includes(type)
                          ? formData.filters.taskTypes.filter((t) => t !== type)
                          : [...formData.filters.taskTypes, type]
                        setFormData({
                          ...formData,
                          filters: { ...formData.filters, taskTypes: newTypes },
                        })
                      }}
                    >
                      <div className="flex items-center gap-1">
                        {getTypeIcon(type)}
                        {getTypeText(type)}
                      </div>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* 状态筛选 */}
              <div className="space-y-2">
                <label className="text-white text-sm">状态</label>
                <div className="flex flex-wrap gap-2">
                  {["todo", "in-progress", "paused", "completed"].map((status) => (
                    <Badge
                      key={status}
                      className={`cursor-pointer text-xs ${
                        formData.filters.statuses.includes(status)
                          ? "bg-yellow-500/30 text-yellow-300 border-yellow-500/50"
                          : "bg-slate-600/50 text-slate-300 border-slate-500/30 hover:bg-slate-500/50"
                      }`}
                      onClick={() => {
                        const newStatuses = formData.filters.statuses.includes(status)
                          ? formData.filters.statuses.filter((s) => s !== status)
                          : [...formData.filters.statuses, status]
                        setFormData({
                          ...formData,
                          filters: { ...formData.filters, statuses: newStatuses },
                        })
                      }}
                    >
                      {getStatusText(status)}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* 优先级筛选 */}
              <div className="space-y-2">
                <label className="text-white text-sm">优先级</label>
                <div className="flex flex-wrap gap-2">
                  {["low", "medium", "high"].map((priority) => (
                    <Badge
                      key={priority}
                      className={`cursor-pointer text-xs ${
                        formData.filters.priorities.includes(priority)
                          ? "bg-purple-500/30 text-purple-300 border-purple-500/50"
                          : "bg-slate-600/50 text-slate-300 border-slate-500/30 hover:bg-slate-500/50"
                      }`}
                      onClick={() => {
                        const newPriorities = formData.filters.priorities.includes(priority)
                          ? formData.filters.priorities.filter((p) => p !== priority)
                          : [...formData.filters.priorities, priority]
                        setFormData({
                          ...formData,
                          filters: { ...formData.filters, priorities: newPriorities },
                        })
                      }}
                    >
                      {getPriorityText(priority)}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* 焦点任务筛选 */}
              <div className="space-y-2">
                <label className="text-white text-sm">焦点任务</label>
                <Select
                  value={formData.filters.focusTask}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      filters: { ...formData.filters, focusTask: value },
                    })
                  }
                >
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all" className="text-white">
                      全部任务
                    </SelectItem>
                    <SelectItem value="focus" className="text-white">
                      仅焦点任务
                    </SelectItem>
                    <SelectItem value="non-focus" className="text-white">
                      仅非焦点任务
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 优先焦点筛选 */}
              <div className="space-y-2">
                <label className="text-white text-sm">优先焦点</label>
                <Select
                  value={formData.filters.priorityFocus}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      filters: { ...formData.filters, priorityFocus: value },
                    })
                  }
                >
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all" className="text-white">
                      全部任务
                    </SelectItem>
                    <SelectItem value="priority" className="text-white">
                      仅优先焦点
                    </SelectItem>
                    <SelectItem value="non-priority" className="text-white">
                      仅非优先焦点
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 pb-6 pt-4 border-t border-slate-700">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false)
                setEditingPerspective(null)
                resetForm()
              }}
              className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
            >
              取消
            </Button>
            <Button onClick={handleUpdatePerspective} className="bg-blue-600 hover:bg-blue-700 text-white">
              保存更改
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 任务列表 */}
      <div className="space-y-6">
        {Object.entries(groupedTasks).map(([groupName, groupTasks]) => (
          <div key={groupName} className="space-y-4">
            {selectedPerspective && selectedPerspective.groupBy !== "none" && (
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-white">{groupName}</h2>
                <Badge className="bg-slate-700 text-slate-300 border-slate-600">{groupTasks.length}</Badge>
              </div>
            )}

            {groupTasks.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {groupTasks.map((task) => {
                  const taskPath = generateTaskPath(task, allTasks)
                  const taskWithPath = { ...task, category: taskPath }

                  return (
                    <div key={task.id} id={`task-${task.id}`}>
                      {task.isFocusTask ? (
                        <TaskCard
                          task={taskWithPath}
                          onToggleFocus={onToggleFocus}
                          onTogglePriorityFocus={onTogglePriorityFocus}
                          onToggleStatus={onToggleStatus}
                          onComplete={onComplete}
                          onDelete={onDeleteTask}
                          onLocateTask={onLocateTask}
                          onLaunchTask={onLaunchTask}
                          onOpenDetails={onOpenDetails}
                          onStartTask={onStartTask}
                          onPauseTask={onPauseTask}
                          onResumeTask={onResumeTask}
                          onAddProgress={onAddProgress}
                        />
                      ) : (
                        <PendingTaskCard
                          task={taskWithPath}
                          isSelected={false}
                          isSelectionMode={false}
                          onToggleSelection={() => {}}
                          onOpenDetails={onOpenDetails}
                          onDelete={onDeleteTask}
                          onRemoveFromPending={onRemoveFromPending}
                          onAddToFocus={onAddToFocus}
                          onLocateTask={onLocateTask}
                          onLaunchTask={onLaunchTask}
                          onAddProgress={onAddProgress}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>此分组下暂无任务</p>
              </div>
            )}
          </div>
        ))}

        {displayTasks.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
            {selectedPerspective ? (
              <>
                <p className="text-lg mb-2">当前透视下暂无任务</p>
                <p className="text-sm">尝试调整筛选条件或切换到其他透视</p>
              </>
            ) : (
              <>
                <p className="text-lg mb-2">暂无任务</p>
                <p className="text-sm">创建一个透视来开始管理你的任务</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
