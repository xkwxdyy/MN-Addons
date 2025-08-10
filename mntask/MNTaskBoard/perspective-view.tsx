"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Eye, Plus, Edit, Trash2, Filter, Target, FolderOpen, TrendingUp, Crosshair, Clock, X, Layers } from "lucide-react"
import { TaskCard } from "./task-card"
import { PendingTaskCard } from "./pending-task-card"
import { PerspectiveCard } from "./perspective-card"
import { FilterRuleEditor } from "@/components/filter-rule-editor"
import { toast } from "sonner"
import type { FilterRule, Task, Perspective, PerspectiveFilter } from "@/types/task"

interface PerspectiveViewProps {
  focusTasks: Task[]
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
  applyPerspectiveFilter?: (tasks: Task[], filters: PerspectiveFilter) => Task[]
  applyFilterRules?: (tasks: Task[], rules: FilterRule) => Task[]
}

export function PerspectiveView({
  focusTasks,
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
  applyPerspectiveFilter,
  applyFilterRules,
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
    useAdvancedFilters: false,
    filters: {
      tags: [] as string[],
      taskTypes: [] as string[],
      statuses: [] as string[],
      priorities: [] as string[],
      focusTask: "all",
      priorityFocus: "all",
    },
    filterRules: null as FilterRule | null,
    tagMatchMode: "any" as "any" | "all", // 标签匹配模式
  })

  // 重置表单
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      groupBy: "none",
      useAdvancedFilters: false,
      filters: {
        tags: [],
        taskTypes: [],
        statuses: [],
        priorities: [],
        focusTask: "all",
        priorityFocus: "all",
      },
      filterRules: null,
      tagMatchMode: "any",
    })
  }


  // 获取当前选中的透视
  const selectedPerspective = selectedPerspectiveId ? perspectives.find((p) => p.id === selectedPerspectiveId) : null

  // 获取筛选后的任务
  const allTasks = useMemo(() => [...focusTasks, ...pendingTasks], [focusTasks, pendingTasks])
  
  const filteredTasks = useMemo(() => {
    if (!selectedPerspective) return allTasks
    
    // 使用新的筛选规则系统（如果有）
    if (selectedPerspective.filterRules && applyFilterRules) {
      return applyFilterRules(allTasks, selectedPerspective.filterRules)
    }
    // 使用传统的筛选系统
    else if (selectedPerspective.filters && applyPerspectiveFilter) {
      return applyPerspectiveFilter(allTasks, selectedPerspective.filters)
    }
    
    return allTasks
  }, [selectedPerspective, allTasks, applyPerspectiveFilter, applyFilterRules])

  // 根据是否显示已完成任务进行筛选
  const displayTasks = useMemo(() => {
    return showCompletedTasks ? filteredTasks : filteredTasks.filter((task) => !task.completed)
  }, [showCompletedTasks, filteredTasks])
  
  // 预计算每个透视的任务数量，避免在渲染时重复计算
  const perspectiveTasksMap = useMemo(() => {
    const map = new Map<string, Task[]>()
    perspectives.forEach(p => {
      if (p.id === selectedPerspectiveId) {
        map.set(p.id, displayTasks)
      } else {
        // 使用新的筛选规则系统（如果有）
        if (p.filterRules && applyFilterRules) {
          map.set(p.id, applyFilterRules(allTasks, p.filterRules))
        }
        // 使用传统的筛选系统
        else if (p.filters && applyPerspectiveFilter) {
          map.set(p.id, applyPerspectiveFilter(allTasks, p.filters))
        } else {
          map.set(p.id, allTasks)
        }
      }
    })
    return map
  }, [perspectives, selectedPerspectiveId, displayTasks, allTasks, applyPerspectiveFilter, applyFilterRules])

  // Helper functions for text conversion
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

    // 准备透视数据
    const perspectiveData: any = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      groupBy: formData.groupBy,
    }

    // 根据筛选模式设置筛选规则
    if (formData.useAdvancedFilters && formData.filterRules) {
      perspectiveData.filterRules = formData.filterRules
    } else {
      // 在简单模式下，如果选择了"包含所有"标签，需要转换为高级规则
      if (formData.tagMatchMode === "all" && formData.filters.tags.length > 0) {
        perspectiveData.filterRules = {
          id: `rule-${Date.now()}`,
          operator: "all",
          conditions: [{
            field: "tags",
            values: formData.filters.tags,
            tagMatchMode: "all"
          }],
          ruleGroups: []
        }
        // 将其他筛选条件也添加到规则中
        if (formData.filters.taskTypes.length > 0) {
          perspectiveData.filterRules.conditions.push({
            field: "taskTypes",
            values: formData.filters.taskTypes
          })
        }
        if (formData.filters.statuses.length > 0) {
          perspectiveData.filterRules.conditions.push({
            field: "statuses",
            values: formData.filters.statuses
          })
        }
        if (formData.filters.priorities.length > 0) {
          perspectiveData.filterRules.conditions.push({
            field: "priorities",
            values: formData.filters.priorities
          })
        }
        if (formData.filters.focusTask !== "all") {
          perspectiveData.filterRules.conditions.push({
            field: "focusTask",
            values: [formData.filters.focusTask]
          })
        }
        if (formData.filters.priorityFocus !== "all") {
          perspectiveData.filterRules.conditions.push({
            field: "priorityFocus",
            values: [formData.filters.priorityFocus]
          })
        }
      } else {
        // 使用传统的筛选器
        perspectiveData.filters = formData.filters
      }
    }

    const newPerspective = onCreatePerspective(perspectiveData)
    onPerspectiveChange(newPerspective.id)
    setIsCreateDialogOpen(false)
    resetForm()
  }

  // 处理编辑透视
  const handleEditPerspective = (perspective: Perspective) => {
    setEditingPerspective(perspective)
    
    // 判断是否使用高级筛选
    const useAdvanced = !!perspective.filterRules
    
    // 从 filterRules 中推断标签匹配模式
    let tagMatchMode: "any" | "all" = "any"
    if (perspective.filterRules) {
      const tagCondition = perspective.filterRules.conditions?.find(c => c.field === "tags")
      if (tagCondition?.tagMatchMode) {
        tagMatchMode = tagCondition.tagMatchMode
      }
    }
    
    setFormData({
      name: perspective.name,
      description: perspective.description || "",
      groupBy: perspective.groupBy,
      useAdvancedFilters: useAdvanced,
      filters: perspective.filters || {
        tags: [],
        taskTypes: [],
        statuses: [],
        priorities: [],
        focusTask: "all",
        priorityFocus: "all",
      },
      filterRules: perspective.filterRules || null,
      tagMatchMode: tagMatchMode,
    })
    setIsEditDialogOpen(true)
  }

  // 处理更新透视
  const handleUpdatePerspective = () => {
    if (!editingPerspective || !formData.name.trim()) {
      toast.error("请输入透视名称")
      return
    }

    const updateData: any = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      groupBy: formData.groupBy,
    }

    // 根据筛选模式设置筛选规则
    if (formData.useAdvancedFilters && formData.filterRules) {
      updateData.filterRules = formData.filterRules
      updateData.filters = undefined // 清除旧的筛选器
    } else {
      // 在简单模式下，如果选择了"包含所有"标签，需要转换为高级规则
      if (formData.tagMatchMode === "all" && formData.filters.tags.length > 0) {
        updateData.filterRules = {
          id: `rule-${Date.now()}`,
          operator: "all",
          conditions: [{
            field: "tags",
            values: formData.filters.tags,
            tagMatchMode: "all"
          }],
          ruleGroups: []
        }
        // 将其他筛选条件也添加到规则中
        if (formData.filters.taskTypes.length > 0) {
          updateData.filterRules.conditions.push({
            field: "taskTypes",
            values: formData.filters.taskTypes
          })
        }
        if (formData.filters.statuses.length > 0) {
          updateData.filterRules.conditions.push({
            field: "statuses",
            values: formData.filters.statuses
          })
        }
        if (formData.filters.priorities.length > 0) {
          updateData.filterRules.conditions.push({
            field: "priorities",
            values: formData.filters.priorities
          })
        }
        if (formData.filters.focusTask !== "all") {
          updateData.filterRules.conditions.push({
            field: "focusTask",
            values: [formData.filters.focusTask]
          })
        }
        if (formData.filters.priorityFocus !== "all") {
          updateData.filterRules.conditions.push({
            field: "priorityFocus",
            values: [formData.filters.priorityFocus]
          })
        }
        updateData.filters = undefined // 清除传统筛选器
      } else {
        // 使用传统的筛选器
        updateData.filters = formData.filters
        updateData.filterRules = undefined // 清除高级规则
      }
    }

    onUpdatePerspective(editingPerspective.id, updateData)

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
        <div className="flex items-center gap-2">
          <Eye className="w-6 h-6 text-blue-400" />
          <h1 className="text-2xl font-bold text-white">透视视图</h1>
        </div>

        <div className="flex items-center gap-2">
          {/* 显示已完成任务切换 */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="show-completed"
              checked={showCompletedTasks}
              onCheckedChange={(checked) => setShowCompletedTasks(checked === true)}
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

                {/* 筛选模式选择 */}
                <Tabs
                  value={formData.useAdvancedFilters ? "advanced" : "simple"}
                  onValueChange={(value) => {
                    const useAdvanced = value === "advanced"
                    if (useAdvanced && !formData.filterRules) {
                      // 初始化高级筛选规则
                      setFormData({
                        ...formData,
                        useAdvancedFilters: useAdvanced,
                        filterRules: {
                          id: `rule-${Date.now()}`,
                          operator: "all",
                          conditions: [],
                          ruleGroups: []
                        }
                      })
                    } else {
                      setFormData({ ...formData, useAdvancedFilters: useAdvanced })
                    }
                  }}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 bg-slate-700">
                    <TabsTrigger value="simple" className="data-[state=active]:bg-slate-600">
                      <Filter className="w-3 h-3 mr-1" />
                      简单筛选
                    </TabsTrigger>
                    <TabsTrigger value="advanced" className="data-[state=active]:bg-slate-600">
                      <Layers className="w-3 h-3 mr-1" />
                      高级筛选
                    </TabsTrigger>
                  </TabsList>

                  {/* 简单筛选模式 */}
                  <TabsContent value="simple" className="space-y-4 mt-4">
                    <h3 className="text-white font-medium">筛选条件</h3>

                    {/* 标签筛选 */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-white text-sm">标签</label>
                        <Select
                          value={formData.tagMatchMode}
                          onValueChange={(value) => setFormData({ ...formData, tagMatchMode: value as "any" | "all" })}
                        >
                          <SelectTrigger className="w-32 h-7 text-xs bg-slate-700/50 border-slate-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="any" className="text-white text-xs">包含任一</SelectItem>
                            <SelectItem value="all" className="text-white text-xs">包含所有</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
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
                  </TabsContent>

                  {/* 高级筛选模式 */}
                  <TabsContent value="advanced" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <h3 className="text-white font-medium">高级筛选规则</h3>
                      <p className="text-slate-400 text-xs">
                        使用嵌套规则组创建复杂的筛选条件（支持 AND、OR、NOT 逻辑）
                      </p>
                    </div>
                    
                    {formData.filterRules && (
                      <FilterRuleEditor
                        rule={formData.filterRules}
                        availableTags={availableTags}
                        onUpdate={(rule) => setFormData({ ...formData, filterRules: rule })}
                        isRoot={true}
                      />
                    )}
                  </TabsContent>
                </Tabs>
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

      {/* 透视选择区域 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-slate-300">选择透视</h2>
          {selectedPerspective && (
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              当前: {selectedPerspective.name}
            </Badge>
          )}
        </div>
        
        {/* 透视卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* 全部任务卡片 */}
          <PerspectiveCard
            perspective={null}
            tasks={allTasks}
            isSelected={!selectedPerspectiveId}
            isAllTasks={true}
            onSelect={() => onPerspectiveChange(null)}
          />
          
          {/* 用户创建的透视卡片 */}
          {perspectives.map((perspective) => {
            // 使用预计算的任务数量
            const perspectiveTasks = perspectiveTasksMap.get(perspective.id) || []
            
            return (
              <PerspectiveCard
                key={perspective.id}
                perspective={perspective}
                tasks={perspectiveTasks}
                isSelected={perspective.id === selectedPerspectiveId}
                onSelect={() => onPerspectiveChange(perspective.id)}
                onEdit={() => handleEditPerspective(perspective)}
                onDelete={() => {
                  if (confirm(`确定要删除透视 "${perspective.name}" 吗？此操作无法撤销。`)) {
                    handleDeletePerspective(perspective.id)
                  }
                }}
              />
            )
          })}
        </div>
      </div>
      
      {/* 分隔线 */}
      {selectedPerspectiveId && <Separator className="bg-slate-700" />}

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

            {/* 筛选模式选择 */}
            <Tabs
              value={formData.useAdvancedFilters ? "advanced" : "simple"}
              onValueChange={(value) => {
                const useAdvanced = value === "advanced"
                if (useAdvanced && !formData.filterRules) {
                  // 初始化高级筛选规则
                  setFormData({
                    ...formData,
                    useAdvancedFilters: useAdvanced,
                    filterRules: {
                      id: `rule-${Date.now()}`,
                      operator: "all",
                      conditions: [],
                      ruleGroups: []
                    }
                  })
                } else {
                  setFormData({ ...formData, useAdvancedFilters: useAdvanced })
                }
              }}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 bg-slate-700">
                <TabsTrigger value="simple" className="data-[state=active]:bg-slate-600">
                  <Filter className="w-3 h-3 mr-1" />
                  简单筛选
                </TabsTrigger>
                <TabsTrigger value="advanced" className="data-[state=active]:bg-slate-600">
                  <Layers className="w-3 h-3 mr-1" />
                  高级筛选
                </TabsTrigger>
              </TabsList>

              {/* 简单筛选模式 */}
              <TabsContent value="simple" className="space-y-4 mt-4">
                <h3 className="text-white font-medium">筛选条件</h3>

                {/* 标签筛选 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-white text-sm">标签</label>
                    <Select
                      value={formData.tagMatchMode}
                      onValueChange={(value) => setFormData({ ...formData, tagMatchMode: value as "any" | "all" })}
                    >
                      <SelectTrigger className="w-32 h-7 text-xs bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="any" className="text-white text-xs">包含任一</SelectItem>
                        <SelectItem value="all" className="text-white text-xs">包含所有</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
              </TabsContent>

              {/* 高级筛选模式 */}
              <TabsContent value="advanced" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <h3 className="text-white font-medium">高级筛选规则</h3>
                  <p className="text-slate-400 text-xs">
                    使用嵌套规则组创建复杂的筛选条件（支持 AND、OR、NOT 逻辑）
                  </p>
                </div>
                
                {formData.filterRules && (
                  <FilterRuleEditor
                    rule={formData.filterRules}
                    availableTags={availableTags}
                    onUpdate={(rule) => setFormData({ ...formData, filterRules: rule })}
                    isRoot={true}
                  />
                )}
              </TabsContent>
            </Tabs>
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
