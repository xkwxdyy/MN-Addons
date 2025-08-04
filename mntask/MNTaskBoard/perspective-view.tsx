"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TaskCard } from "./task-card"
import { PendingTaskCard } from "./pending-task-card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Eye,
  Plus,
  Edit,
  Trash2,
  Save,
  Target,
  FolderOpen,
  TrendingUp,
  Crosshair,
  Filter,
  Tag,
  Clock,
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

const defaultFilter: PerspectiveFilter = {
  tags: [],
  taskTypes: [],
  statuses: [],
  priorities: [],
  focusTask: "all",
  priorityFocus: "all",
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
  const [currentFilter, setCurrentFilter] = useState<PerspectiveFilter>(defaultFilter)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingPerspective, setEditingPerspective] = useState<Perspective | null>(null)
  const [newPerspectiveName, setNewPerspectiveName] = useState("")
  const [newPerspectiveDescription, setNewPerspectiveDescription] = useState("")
  const [tempFilter, setTempFilter] = useState<PerspectiveFilter>(defaultFilter)

  const selectedPerspective = selectedPerspectiveId ? perspectives.find((p) => p.id === selectedPerspectiveId) : null

  // 合并所有任务
  const allTasks = [...tasks, ...pendingTasks]

  // 应用筛选条件
  const applyFilter = (tasks: Task[], filter: PerspectiveFilter): Task[] => {
    return tasks.filter((task) => {
      // 标签筛选
      if (filter.tags.length > 0) {
        const hasMatchingTag = filter.tags.some((tag) => task.tags?.includes(tag))
        if (!hasMatchingTag) return false
      }

      // 任务类型筛选
      if (filter.taskTypes.length > 0 && !filter.taskTypes.includes(task.type)) {
        return false
      }

      // 状态筛选
      if (filter.statuses.length > 0 && !filter.statuses.includes(task.status)) {
        return false
      }

      // 优先级筛选
      if (filter.priorities.length > 0 && !filter.priorities.includes(task.priority)) {
        return false
      }

      // 焦点任务筛选
      if (filter.focusTask === "focus" && !task.isFocusTask) return false
      if (filter.focusTask === "non-focus" && task.isFocusTask) return false

      // 优先焦点筛选
      if (filter.priorityFocus === "priority" && !task.isPriorityFocus) return false
      if (filter.priorityFocus === "non-priority" && task.isPriorityFocus) return false

      return true
    })
  }

  const filteredTasks = selectedPerspective ? applyFilter(allTasks, selectedPerspective.filters) : allTasks

  // 分离焦点任务和待处理任务
  const focusTasks = filteredTasks.filter((task) => task.isFocusTask)
  const pendingFilteredTasks = filteredTasks.filter((task) => !task.isFocusTask)

  const createPerspective = () => {
    if (!newPerspectiveName.trim()) {
      toast.error("请输入透视名称")
      return
    }

    const perspectiveData = {
      name: newPerspectiveName.trim(),
      description: newPerspectiveDescription.trim(),
      filters: { ...tempFilter },
    }

    onCreatePerspective(perspectiveData)
    setNewPerspectiveName("")
    setNewPerspectiveDescription("")
    setTempFilter(defaultFilter)
    setIsCreateDialogOpen(false)
  }

  const updatePerspectiveHandler = () => {
    if (!editingPerspective || !newPerspectiveName.trim()) {
      toast.error("请输入透视名称")
      return
    }

    const updates = {
      name: newPerspectiveName.trim(),
      description: newPerspectiveDescription.trim(),
      filters: { ...tempFilter },
    }

    onUpdatePerspective(editingPerspective.id, updates)
    setEditingPerspective(null)
    setNewPerspectiveName("")
    setNewPerspectiveDescription("")
    setTempFilter(defaultFilter)
    setIsEditDialogOpen(false)
  }

  const deletePerspectiveHandler = (perspectiveId: string) => {
    onDeletePerspective(perspectiveId)
  }

  const openEditDialog = (perspective: Perspective) => {
    setEditingPerspective(perspective)
    setNewPerspectiveName(perspective.name)
    setNewPerspectiveDescription(perspective.description || "")
    setTempFilter({ ...perspective.filters })
    setIsEditDialogOpen(true)
  }

  const openCreateDialog = () => {
    setNewPerspectiveName("")
    setNewPerspectiveDescription("")
    setTempFilter(defaultFilter)
    setIsCreateDialogOpen(true)
  }

  const getFilterSummary = (filters: PerspectiveFilter): string => {
    const parts: string[] = []

    if (filters.tags.length > 0) {
      parts.push(`标签: ${filters.tags.join(", ")}`)
    }
    if (filters.taskTypes.length > 0) {
      const typeNames = filters.taskTypes.map((type) => {
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
      })
      parts.push(`类型: ${typeNames.join(", ")}`)
    }
    if (filters.statuses.length > 0) {
      const statusNames = filters.statuses.map((status) => {
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
      })
      parts.push(`状态: ${statusNames.join(", ")}`)
    }
    if (filters.priorities.length > 0) {
      const priorityNames = filters.priorities.map((priority) => {
        switch (priority) {
          case "low":
            return "低"
          case "medium":
            return "中"
          case "high":
            return "高"
          default:
            return priority
        }
      })
      parts.push(`优先级: ${priorityNames.join(", ")}`)
    }

    return parts.length > 0 ? parts.join(" | ") : "无筛选条件"
  }

  return (
    <div className="p-6 space-y-6">
      {/* 透视管理区域 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">透视视图</h1>
          <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            创建透视
          </Button>
        </div>

        {/* 透视列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {perspectives.map((perspective) => (
            <Card
              key={perspective.id}
              className={`cursor-pointer transition-all ${
                selectedPerspective?.id === perspective.id
                  ? "bg-blue-600/20 border-blue-500"
                  : "bg-slate-800/30 border-slate-700 hover:bg-slate-700/30"
              }`}
              onClick={() => onPerspectiveChange(perspective.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-lg">{perspective.name}</CardTitle>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        openEditDialog(perspective)
                      }}
                      className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        deletePerspectiveHandler(perspective.id)
                      }}
                      className="h-8 w-8 p-0 text-slate-400 hover:text-red-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                {perspective.description && <p className="text-slate-400 text-sm">{perspective.description}</p>}
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <p className="text-slate-300 text-xs">{getFilterSummary(perspective.filters)}</p>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-slate-600/50 text-slate-300 border-0 text-xs">
                      {applyFilter(allTasks, perspective.filters).length} 个任务
                    </Badge>
                    <span className="text-slate-500 text-xs">
                      {new Date(perspective.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {perspectives.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-400">
              <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg mb-2">暂无透视</p>
              <p className="text-sm">创建你的第一个透视来开始筛选任务</p>
            </div>
          )}
        </div>
      </div>

      {/* 任务展示区域 */}
      {selectedPerspective && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">
              {selectedPerspective.name} - {filteredTasks.length} 个任务
            </h2>
          </div>

          {/* 焦点任务 */}
          {focusTasks.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-red-400" />
                <h3 className="text-lg font-medium text-white">焦点任务</h3>
                <Badge className="bg-red-500/20 text-red-300 border-red-500/30">{focusTasks.length}</Badge>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {focusTasks.map((task) => (
                  <div key={task.id} id={`task-${task.id}`}>
                    <TaskCard
                      task={task}
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
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 待处理任务 */}
          {pendingFilteredTasks.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-400" />
                <h3 className="text-lg font-medium text-white">待处理任务</h3>
                <Badge className="bg-slate-700 text-slate-300 border-slate-600">{pendingFilteredTasks.length}</Badge>
              </div>
              <div className="space-y-3">
                {pendingFilteredTasks.map((task) => (
                  <div key={task.id} id={`task-${task.id}`}>
                    <PendingTaskCard
                      task={task}
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
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredTasks.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <Filter className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg mb-2">没有匹配的任务</p>
              <p className="text-sm">尝试调整透视的筛选条件</p>
            </div>
          )}
        </div>
      )}

      {!selectedPerspective && perspectives.length > 0 && (
        <div className="text-center py-12 text-slate-400">
          <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-lg mb-2">选择一个透视</p>
          <p className="text-sm">点击上方的透视卡片来查看筛选后的任务</p>
        </div>
      )}

      {/* 创建透视对话框 */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">创建新透视</DialogTitle>
            <DialogDescription className="text-slate-300">设置筛选条件来创建自定义透视</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">
                透视名称
              </Label>
              <Input
                id="name"
                value={newPerspectiveName}
                onChange={(e) => setNewPerspectiveName(e.target.value)}
                placeholder="输入透视名称..."
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">
                描述（可选）
              </Label>
              <Input
                id="description"
                value={newPerspectiveDescription}
                onChange={(e) => setNewPerspectiveDescription(e.target.value)}
                placeholder="输入透视描述..."
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>

            {/* 标签筛选 */}
            <div className="space-y-2">
              <Label className="text-white flex items-center gap-2">
                <Tag className="w-4 h-4" />
                标签筛选
              </Label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-${tag}`}
                      checked={tempFilter.tags.includes(tag)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setTempFilter({ ...tempFilter, tags: [...tempFilter.tags, tag] })
                        } else {
                          setTempFilter({ ...tempFilter, tags: tempFilter.tags.filter((t) => t !== tag) })
                        }
                      }}
                      className="border-slate-600 data-[state=checked]:bg-blue-600"
                    />
                    <Label htmlFor={`tag-${tag}`} className="text-slate-300 text-sm">
                      {tag}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* 任务类型筛选 */}
            <div className="space-y-2">
              <Label className="text-white">任务类型</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "action", label: "动作", icon: Target },
                  { value: "project", label: "项目", icon: FolderOpen },
                  { value: "key-result", label: "关键结果", icon: TrendingUp },
                  { value: "objective", label: "目标", icon: Crosshair },
                ].map(({ value, label, icon: Icon }) => (
                  <div key={value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${value}`}
                      checked={tempFilter.taskTypes.includes(value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setTempFilter({ ...tempFilter, taskTypes: [...tempFilter.taskTypes, value] })
                        } else {
                          setTempFilter({
                            ...tempFilter,
                            taskTypes: tempFilter.taskTypes.filter((t) => t !== value),
                          })
                        }
                      }}
                      className="border-slate-600 data-[state=checked]:bg-blue-600"
                    />
                    <Label htmlFor={`type-${value}`} className="text-slate-300 text-sm flex items-center gap-1">
                      <Icon className="w-3 h-3" />
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* 任务状态筛选 */}
            <div className="space-y-2">
              <Label className="text-white">任务状态</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "todo", label: "待开始" },
                  { value: "in-progress", label: "进行中" },
                  { value: "paused", label: "已暂停" },
                  { value: "completed", label: "已完成" },
                ].map(({ value, label }) => (
                  <div key={value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${value}`}
                      checked={tempFilter.statuses.includes(value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setTempFilter({ ...tempFilter, statuses: [...tempFilter.statuses, value] })
                        } else {
                          setTempFilter({ ...tempFilter, statuses: tempFilter.statuses.filter((s) => s !== value) })
                        }
                      }}
                      className="border-slate-600 data-[state=checked]:bg-blue-600"
                    />
                    <Label htmlFor={`status-${value}`} className="text-slate-300 text-sm">
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* 优先级筛选 */}
            <div className="space-y-2">
              <Label className="text-white">优先级</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "low", label: "低" },
                  { value: "medium", label: "中" },
                  { value: "high", label: "高" },
                ].map(({ value, label }) => (
                  <div key={value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`priority-${value}`}
                      checked={tempFilter.priorities.includes(value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setTempFilter({ ...tempFilter, priorities: [...tempFilter.priorities, value] })
                        } else {
                          setTempFilter({
                            ...tempFilter,
                            priorities: tempFilter.priorities.filter((p) => p !== value),
                          })
                        }
                      }}
                      className="border-slate-600 data-[state=checked]:bg-blue-600"
                    />
                    <Label htmlFor={`priority-${value}`} className="text-slate-300 text-sm">
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* 焦点筛选 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white text-sm">焦点任务</Label>
                <Select
                  value={tempFilter.focusTask}
                  onValueChange={(value) => setTempFilter({ ...tempFilter, focusTask: value })}
                >
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue placeholder="选择焦点筛选" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all" className="text-slate-300">
                      全部任务
                    </SelectItem>
                    <SelectItem value="focus" className="text-slate-300">
                      仅焦点任务
                    </SelectItem>
                    <SelectItem value="non-focus" className="text-slate-300">
                      仅非焦点任务
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white text-sm">优先焦点</Label>
                <Select
                  value={tempFilter.priorityFocus}
                  onValueChange={(value) => setTempFilter({ ...tempFilter, priorityFocus: value })}
                >
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue placeholder="选择优先焦点筛选" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all" className="text-slate-300">
                      全部任务
                    </SelectItem>
                    <SelectItem value="priority" className="text-slate-300">
                      仅优先焦点
                    </SelectItem>
                    <SelectItem value="non-priority" className="text-slate-300">
                      仅非优先焦点
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              取消
            </Button>
            <Button onClick={createPerspective} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Save className="w-4 h-4 mr-2" />
              创建透视
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑透视对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">编辑透视</DialogTitle>
            <DialogDescription className="text-slate-300">修改透视的筛选条件</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-white">
                透视名称
              </Label>
              <Input
                id="edit-name"
                value={newPerspectiveName}
                onChange={(e) => setNewPerspectiveName(e.target.value)}
                placeholder="输入透视名称..."
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description" className="text-white">
                描述（可选）
              </Label>
              <Input
                id="edit-description"
                value={newPerspectiveDescription}
                onChange={(e) => setNewPerspectiveDescription(e.target.value)}
                placeholder="输入透视描述..."
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>

            {/* 标签筛选 */}
            <div className="space-y-2">
              <Label className="text-white flex items-center gap-2">
                <Tag className="w-4 h-4" />
                标签筛选
              </Label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-tag-${tag}`}
                      checked={tempFilter.tags.includes(tag)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setTempFilter({ ...tempFilter, tags: [...tempFilter.tags, tag] })
                        } else {
                          setTempFilter({ ...tempFilter, tags: tempFilter.tags.filter((t) => t !== tag) })
                        }
                      }}
                      className="border-slate-600 data-[state=checked]:bg-blue-600"
                    />
                    <Label htmlFor={`edit-tag-${tag}`} className="text-slate-300 text-sm">
                      {tag}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* 任务类型筛选 */}
            <div className="space-y-2">
              <Label className="text-white">任务类型</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "action", label: "动作", icon: Target },
                  { value: "project", label: "项目", icon: FolderOpen },
                  { value: "key-result", label: "关键结果", icon: TrendingUp },
                  { value: "objective", label: "目标", icon: Crosshair },
                ].map(({ value, label, icon: Icon }) => (
                  <div key={value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-type-${value}`}
                      checked={tempFilter.taskTypes.includes(value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setTempFilter({ ...tempFilter, taskTypes: [...tempFilter.taskTypes, value] })
                        } else {
                          setTempFilter({
                            ...tempFilter,
                            taskTypes: tempFilter.taskTypes.filter((t) => t !== value),
                          })
                        }
                      }}
                      className="border-slate-600 data-[state=checked]:bg-blue-600"
                    />
                    <Label htmlFor={`edit-type-${value}`} className="text-slate-300 text-sm flex items-center gap-1">
                      <Icon className="w-3 h-3" />
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* 任务状态筛选 */}
            <div className="space-y-2">
              <Label className="text-white">任务状态</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "todo", label: "待开始" },
                  { value: "in-progress", label: "进行中" },
                  { value: "paused", label: "已暂停" },
                  { value: "completed", label: "已完成" },
                ].map(({ value, label }) => (
                  <div key={value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-status-${value}`}
                      checked={tempFilter.statuses.includes(value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setTempFilter({ ...tempFilter, statuses: [...tempFilter.statuses, value] })
                        } else {
                          setTempFilter({ ...tempFilter, statuses: tempFilter.statuses.filter((s) => s !== value) })
                        }
                      }}
                      className="border-slate-600 data-[state=checked]:bg-blue-600"
                    />
                    <Label htmlFor={`edit-status-${value}`} className="text-slate-300 text-sm">
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* 优先级筛选 */}
            <div className="space-y-2">
              <Label className="text-white">优先级</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "low", label: "低" },
                  { value: "medium", label: "中" },
                  { value: "high", label: "高" },
                ].map(({ value, label }) => (
                  <div key={value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-priority-${value}`}
                      checked={tempFilter.priorities.includes(value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setTempFilter({ ...tempFilter, priorities: [...tempFilter.priorities, value] })
                        } else {
                          setTempFilter({
                            ...tempFilter,
                            priorities: tempFilter.priorities.filter((p) => p !== value),
                          })
                        }
                      }}
                      className="border-slate-600 data-[state=checked]:bg-blue-600"
                    />
                    <Label htmlFor={`edit-priority-${value}`} className="text-slate-300 text-sm">
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* 焦点筛选 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white text-sm">焦点任务</Label>
                <Select
                  value={tempFilter.focusTask}
                  onValueChange={(value) => setTempFilter({ ...tempFilter, focusTask: value })}
                >
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue placeholder="选择焦点筛选" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all" className="text-slate-300">
                      全部任务
                    </SelectItem>
                    <SelectItem value="focus" className="text-slate-300">
                      仅焦点任务
                    </SelectItem>
                    <SelectItem value="non-focus" className="text-slate-300">
                      仅非焦点任务
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white text-sm">优先焦点</Label>
                <Select
                  value={tempFilter.priorityFocus}
                  onValueChange={(value) => setTempFilter({ ...tempFilter, priorityFocus: value })}
                >
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue placeholder="选择优先焦点筛选" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all" className="text-slate-300">
                      全部任务
                    </SelectItem>
                    <SelectItem value="priority" className="text-slate-300">
                      仅优先焦点
                    </SelectItem>
                    <SelectItem value="non-priority" className="text-slate-300">
                      仅非优先焦点
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              取消
            </Button>
            <Button onClick={updatePerspectiveHandler} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Save className="w-4 h-4 mr-2" />
              保存更改
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
