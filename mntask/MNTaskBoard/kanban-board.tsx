"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DraggableTaskCard } from "./draggable-task-card"
import { Target, FolderOpen, TrendingUp, Crosshair, Filter, X, Plus, Eye } from "lucide-react"
import { toast } from "sonner"
import type { Task, Perspective, PerspectiveFilter } from "@/types/task"

interface KanbanBoardProps {
  focusTasks: Task[]
  pendingTasks: Task[]
  allTasks: Task[]
  perspectives: Perspective[]
  selectedPerspectiveId: string | null
  selectedTaskTypeFilter?: TaskTypeFilter
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void
  onOpenDetails: (taskId: string) => void
  onDeleteTask: (taskId: string) => void
  onAddToFocus: (taskId: string) => void
  onAddToPending?: (taskId: string) => void
  onRemoveFromPending?: (taskId: string) => void
  onAddTask?: (task: Omit<Task, "id" | "createdAt">) => void
  onPerspectiveChange: (perspectiveId: string | null) => void
  onTaskTypeFilterChange?: (filter: TaskTypeFilter) => void
}

type TaskTypeFilter = "all" | "action" | "project" | "key-result" | "objective"
type TaskStatus = "todo" | "in-progress" | "completed" | "paused"

export function KanbanBoard({
  focusTasks: _focusTasks,
  pendingTasks: _pendingTasks,
  allTasks,
  perspectives,
  selectedPerspectiveId,
  selectedTaskTypeFilter,
  onUpdateTask,
  onOpenDetails,
  onDeleteTask,
  onAddToFocus,
  onAddToPending,
  onRemoveFromPending,
  onAddTask,
  onPerspectiveChange,
  onTaskTypeFilterChange,
}: KanbanBoardProps) {
  const [selectedFilter, setSelectedFilter] = useState<TaskTypeFilter>(selectedTaskTypeFilter || "all")
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskType, setNewTaskType] = useState<"action" | "project" | "key-result" | "objective">("action")
  const [showAddTask, setShowAddTask] = useState(false)
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null)

  // Sync external filter changes with internal state
  useEffect(() => {
    if (selectedTaskTypeFilter) {
      setSelectedFilter(selectedTaskTypeFilter)
    }
  }, [selectedTaskTypeFilter])

  // 应用透视筛选
  const applyPerspectiveFilter = (tasks: Task[], filters: PerspectiveFilter): Task[] => {
    return tasks.filter((task) => {
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

  // 应用透视筛选到任务列表
  const getFilteredTasks = (taskList: Task[]): Task[] => {
    if (!selectedPerspective || !selectedPerspective.filters) return taskList
    return applyPerspectiveFilter(taskList, selectedPerspective.filters)
  }

  // 使用透视筛选后的 allTasks
  const perspectiveFilteredTasks = getFilteredTasks(allTasks)

  // 根据类型筛选任务
  const filteredTasks =
    selectedFilter === "all"
      ? perspectiveFilteredTasks
      : perspectiveFilteredTasks.filter((task) => task.type === selectedFilter)

  // 按状态分组任务
  const todoTasks = filteredTasks.filter((task) => task.status === "todo")
  const inProgressTasks = filteredTasks.filter((task) => task.status === "in-progress")
  const pausedTasks = filteredTasks.filter((task) => task.status === "paused")
  const completedTasks = filteredTasks.filter((task) => task.status === "completed")

  // 获取任务类型信息
  const getTypeInfo = (type: string) => {
    switch (type) {
      case "action":
        return { icon: Target, text: "动作", color: "text-blue-400" }
      case "project":
        return { icon: FolderOpen, text: "项目", color: "text-green-400" }
      case "key-result":
        return { icon: TrendingUp, text: "关键结果", color: "text-purple-400" }
      case "objective":
        return { icon: Crosshair, text: "目标", color: "text-orange-400" }
      default:
        return { icon: Target, text: "动作", color: "text-blue-400" }
    }
  }

  // 获取类型统计
  const getTypeStats = (type: TaskTypeFilter) => {
    if (type === "all") return perspectiveFilteredTasks.length
    return perspectiveFilteredTasks.filter((task) => task.type === type).length
  }

  const filterOptions: { key: TaskTypeFilter; label: string; icon: any }[] = [
    { key: "all", label: "全部", icon: Filter },
    { key: "action", label: "动作", icon: Target },
    { key: "project", label: "项目", icon: FolderOpen },
    { key: "key-result", label: "关键结果", icon: TrendingUp },
    { key: "objective", label: "目标", icon: Crosshair },
  ]

  // 拖拽处理函数
  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverColumn(status)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    // 只有当鼠标真正离开列区域时才清除高亮
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverColumn(null)
    }
  }

  const handleDrop = (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault()
    setDragOverColumn(null)

    try {
      const data = JSON.parse(e.dataTransfer.getData("text/plain"))
      const { taskId, currentStatus } = data

      if (currentStatus === newStatus) {
        return // 状态没有改变，不需要更新
      }

      // 更新任务状态
      const updates: Partial<Task> = {
        status: newStatus,
        completed: newStatus === "completed",
      }

      onUpdateTask(taskId, updates)

      // 显示成功消息
      const statusNames = {
        todo: "待开始",
        "in-progress": "进行中",
        paused: "已暂停",
        completed: "已完成",
      }

      toast.success(`任务状态已更新为：${statusNames[newStatus]}`)
    } catch (error) {
      console.error("拖拽处理失败:", error)
      toast.error("拖拽操作失败，请重试")
    }
  }

  // 解析任务标题中的标签语法
  const parseTaskTitleWithTags = (input: string): { title: string; tags: string[] } => {
    // 支持多种引号格式的正则表达式：
    // #标签 - 无引号的标签
    // #"标签" - 英文双引号
    // #'标签' - 英文单引号
    // #"标签" - 中文双引号
    // #'标签' - 中文单引号
    // #【标签】- 中文方括号
    // #（标签）- 中文圆括号
    const tagRegex = /#(?:"([^"]+)"|'([^']+)'|"([^"]+)"|'([^']+)'|【([^】]+)】|（([^）]+)）|([^\s#]+))/g
    const tags: string[] = []
    let match

    // 提取所有标签
    while ((match = tagRegex.exec(input)) !== null) {
      // match[1] - 英文双引号内容
      // match[2] - 英文单引号内容
      // match[3] - 中文双引号内容
      // match[4] - 中文单引号内容
      // match[5] - 中文方括号内容
      // match[6] - 中文圆括号内容
      // match[7] - 无引号内容
      const tag = match[1] || match[2] || match[3] || match[4] || match[5] || match[6] || match[7]
      if (tag && tag.trim()) {
        tags.push(tag.trim())
      }
    }

    // 移除标签部分，获取纯净的任务标题
    const title = input.replace(tagRegex, "").trim()

    return { title, tags }
  }

  // 添加新任务
  const handleAddTask = () => {
    if (!newTaskTitle.trim()) {
      toast.error("请输入任务标题")
      return
    }

    // 解析任务标题和标签
    const { title, tags: parsedTags } = parseTaskTitleWithTags(newTaskTitle)

    if (!title) {
      toast.error("请输入任务标题")
      return
    }

    // 基础任务数据
    const baseTask: Omit<Task, "id" | "createdAt"> = {
      title: title,
      description: "",
      completed: false,
      isFocusTask: false,
      isPriorityFocus: false,
      priority: "low",
      status: "todo",
      type: newTaskType,
      tags: [...parsedTags], // 使用解析出的标签
      progressHistory: [],
      isInPending: false,
    }

    // 如果当前有选中的透视，自动应用透视的筛选条件
    if (selectedPerspective) {
      const filters = selectedPerspective.filters

      // 合并透视标签和解析出的标签
      if (filters.tags.length > 0) {
        const allTags = [...new Set([...(baseTask.tags || []), ...filters.tags])]
        baseTask.tags = allTags
      }

      // 如果透视指定了特定的任务类型，使用第一个类型
      if (filters.taskTypes.length === 1) {
        baseTask.type = filters.taskTypes[0] as "action" | "project" | "key-result" | "objective"
      }

      // 如果透视指定了特定的优先级，使用第一个优先级
      if (filters.priorities.length === 1) {
        baseTask.priority = filters.priorities[0] as "low" | "medium" | "high"
      }

      // 如果透视指定了特定的状态，使用第一个状态
      if (filters.statuses.length === 1) {
        baseTask.status = filters.statuses[0] as "todo" | "in-progress" | "completed" | "paused"
        baseTask.completed = baseTask.status === "completed"
      }
    }

    // 如果有 onAddTask 回调，使用它；否则使用默认逻辑
    if (onAddTask) {
      onAddTask(baseTask)
    }

    // 清空输入框但保持添加状态，方便连续添加
    setNewTaskTitle("")
    // 不关闭 showAddTask 状态

    // 显示提示信息
    const appliedTags = baseTask.tags || []
    if (appliedTags.length > 0) {
      if (parsedTags.length > 0 && selectedPerspective && selectedPerspective.filters.tags.length > 0) {
        toast.success(
          `${getTypeInfo(newTaskType).text}任务创建成功！应用标签: ${appliedTags.join(", ")} (包含解析标签和透视标签)`,
        )
      } else if (parsedTags.length > 0) {
        toast.success(`${getTypeInfo(newTaskType).text}任务创建成功！应用标签: ${appliedTags.join(", ")}`)
      } else if (selectedPerspective && selectedPerspective.filters.tags.length > 0) {
        toast.success(`${getTypeInfo(newTaskType).text}任务创建成功并自动应用透视标签: ${appliedTags.join(", ")}`)
      }
    } else {
      toast.success(`${getTypeInfo(newTaskType).text}任务创建成功`, {
        duration: 2000, // 缩短提示时间，避免干扰连续添加
      })
    }
  }

  // 根据当前筛选类型设置默认任务类型
  const getDefaultTaskType = (): "action" | "project" | "key-result" | "objective" => {
    if (selectedFilter === "all") return "action"
    return selectedFilter as "action" | "project" | "key-result" | "objective"
  }

  // 当筛选类型改变时，更新新任务的默认类型
  const handleFilterChange = (newFilter: TaskTypeFilter) => {
    setSelectedFilter(newFilter)
    if (newFilter !== "all") {
      setNewTaskType(newFilter as "action" | "project" | "key-result" | "objective")
    }
    // 通知父组件筛选器变化
    onTaskTypeFilterChange?.(newFilter)
  }

  // 获取筛选条件摘要
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

  // 获取任务类型文本
  const getTypeText = (type: string): string => {
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

  // 获取优先级文本
  const getPriorityText = (priority: string): string => {
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
  }

  // 渲染看板列
  const renderKanbanColumn = (
    status: TaskStatus,
    title: string,
    icon: React.ComponentType<any>,
    iconColor: string,
    badgeColor: string,
    tasks: Task[],
  ) => (
    <Card
      className={`bg-slate-800/30 border-slate-700 transition-all ${
        dragOverColumn === status ? "ring-2 ring-blue-400 bg-slate-700/50" : ""
      }`}
      onDragOver={(e) => handleDragOver(e, status)}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDrop(e, status)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-slate-300">
            {React.createElement(icon, { className: `w-5 h-5 ${iconColor}` })}
            <span>{title}</span>
            <Badge className={`${badgeColor} border-0`}>{tasks.length}</Badge>
          </CardTitle>
          {status === "todo" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setNewTaskType(getDefaultTaskType())
                setShowAddTask(true)
              }}
              className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700"
            >
              <Plus className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 min-h-[200px]">
        {/* 拖拽提示区域 */}
        {dragOverColumn === status && (
          <div className="border-2 border-dashed border-blue-400 rounded-lg p-4 text-center text-blue-400 text-sm">
            释放以移动任务到{title}
          </div>
        )}

        {/* 添加任务表单 */}
        {status === "todo" && showAddTask && (
          <Card className="bg-slate-700/30 border-slate-600">
            <CardContent className="p-3 space-y-3">
              <Input
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder={selectedPerspective ? `输入${selectedPerspective.name}任务标题...` : "输入任务标题..."}
                className="bg-slate-600/50 border-slate-500 text-white placeholder:text-slate-400"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddTask()
                  }
                }}
              />
              <div className="flex items-center gap-2">
                <Select
                  value={newTaskType}
                  onValueChange={(value: "action" | "project" | "key-result" | "objective") => setNewTaskType(value)}
                >
                  <SelectTrigger className="bg-slate-600/50 border-slate-500 text-white text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="action" className="text-slate-300">
                      <div className="flex items-center gap-2">
                        <Target className="w-3 h-3" />
                        动作
                      </div>
                    </SelectItem>
                    <SelectItem value="project" className="text-slate-300">
                      <div className="flex items-center gap-2">
                        <FolderOpen className="w-3 h-3" />
                        项目
                      </div>
                    </SelectItem>
                    <SelectItem value="key-result" className="text-slate-300">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-3 h-3" />
                        关键结果
                      </div>
                    </SelectItem>
                    <SelectItem value="objective" className="text-slate-300">
                      <div className="flex items-center gap-2">
                        <Crosshair className="w-3 h-3" />
                        目标
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm" onClick={handleAddTask} className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                  添加
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAddTask(false)
                    setNewTaskTitle("")
                  }}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  取消
                </Button>
              </div>

              {selectedPerspective && (
                <div className="text-xs text-slate-400 flex items-center gap-2 flex-wrap">
                  <Eye className="w-3 h-3" />
                  <span>将自动应用透视条件:</span>
                  {selectedPerspective.filters.tags.length > 0 && (
                    <div className="flex gap-1">
                      {selectedPerspective.filters.tags.map((tag) => (
                        <Badge key={tag} className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {selectedPerspective.filters.taskTypes.length === 1 && (
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                      {getTypeText(selectedPerspective.filters.taskTypes[0])}
                    </Badge>
                  )}
                  {selectedPerspective.filters.priorities.length === 1 && (
                    <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs">
                      {getPriorityText(selectedPerspective.filters.priorities[0])}优先级
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {tasks.map((task) => (
          <DraggableTaskCard
            key={task.id}
            task={task}
            onUpdateTask={onUpdateTask}
            onOpenDetails={onOpenDetails}
            onDeleteTask={onDeleteTask}
            onAddToFocus={onAddToFocus}
            onAddToPending={onAddToPending}
            onRemoveFromPending={onRemoveFromPending}
          />
        ))}

        {tasks.length === 0 && !showAddTask && dragOverColumn !== status && (
          <div className="text-center py-8 text-slate-400">
            {React.createElement(icon, { className: "w-8 h-8 mx-auto mb-2 opacity-50" })}
            <p className="text-sm">{selectedPerspective ? `当前透视下暂无${title}任务` : `暂无${title}任务`}</p>
            {status === "todo" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setNewTaskType(getDefaultTaskType())
                  setShowAddTask(true)
                }}
                className="mt-2 text-slate-400 hover:text-white"
              >
                <Plus className="w-4 h-4 mr-1" />
                添加任务
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="p-6 space-y-6">
      {/* 透视选择器 */}
      <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-400" />
            <span className="text-white font-medium">透视筛选:</span>
          </div>
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
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                {perspectiveFilteredTasks.length} 个任务
              </Badge>
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
        {selectedPerspective && (
          <div className="text-sm text-slate-400">
            {selectedPerspective.description && <p className="mb-1">{selectedPerspective.description}</p>}
            <p>筛选条件: {getFilterSummary(selectedPerspective.filters)}</p>
          </div>
        )}
      </div>

      {/* 任务类型筛选器 */}
      <div className="flex items-center gap-4 bg-slate-800/30 rounded-lg p-4 border border-slate-700">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-400" />
          <span className="text-white font-medium">任务类型筛选:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => {
            const IconComponent = option.icon
            const isSelected = selectedFilter === option.key
            const count = getTypeStats(option.key)

            return (
              <Button
                key={option.key}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange(option.key)}
                className={`flex items-center gap-2 ${
                  isSelected
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{option.label}</span>
                <Badge className="bg-slate-600/50 text-slate-300 border-0 text-xs">{count}</Badge>
              </Button>
            )
          })}
        </div>
        {selectedFilter !== "all" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFilterChange("all")}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4 mr-1" />
            清除筛选
          </Button>
        )}
      </div>

      {/* 快速添加任务区域 */}
      <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700 space-y-4">
        <div className="flex items-center gap-2">
          <Plus className="w-5 h-5 text-slate-400" />
          <span className="text-white font-medium">快速添加任务</span>
          {selectedPerspective && (
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
              将添加到 {selectedPerspective.name}
            </Badge>
          )}
        </div>

        <div className="flex gap-3">
          <Input
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder={
              selectedPerspective
                ? `输入${selectedPerspective.name}任务标题后按 Enter 快速添加...`
                : "输入任务标题后按 Enter 快速添加..."
            }
            className="flex-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddTask()
              }
            }}
          />
          <Select
            value={newTaskType}
            onValueChange={(value: "action" | "project" | "key-result" | "objective") => setNewTaskType(value)}
          >
            <SelectTrigger className="w-32 bg-slate-700/50 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="action" className="text-slate-300">
                <div className="flex items-center gap-2">
                  <Target className="w-3 h-3" />
                  动作
                </div>
              </SelectItem>
              <SelectItem value="project" className="text-slate-300">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-3 h-3" />
                  项目
                </div>
              </SelectItem>
              <SelectItem value="key-result" className="text-slate-300">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3 h-3" />
                  关键结果
                </div>
              </SelectItem>
              <SelectItem value="objective" className="text-slate-300">
                <div className="flex items-center gap-2">
                  <Crosshair className="w-3 h-3" />
                  目标
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleAddTask}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!newTaskTitle.trim()}
          >
            <Plus className="w-4 h-4 mr-2" />
            添加
          </Button>
        </div>

        {selectedPerspective && (
          <div className="text-xs text-slate-400 flex items-center gap-2 flex-wrap">
            <Eye className="w-3 h-3" />
            <span>将自动应用透视条件:</span>
            {selectedPerspective.filters.tags.length > 0 && (
              <div className="flex gap-1">
                {selectedPerspective.filters.tags.map((tag) => (
                  <Badge key={tag} className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            {selectedPerspective.filters.taskTypes.length === 1 && (
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                {getTypeText(selectedPerspective.filters.taskTypes[0])}
              </Badge>
            )}
            {selectedPerspective.filters.priorities.length === 1 && (
              <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs">
                {getPriorityText(selectedPerspective.filters.priorities[0])}优先级
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* 看板列 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {renderKanbanColumn("todo", "待开始", Target, "text-blue-400", "bg-blue-500/20 text-blue-300", todoTasks)}
        {renderKanbanColumn(
          "in-progress",
          "进行中",
          TrendingUp,
          "text-green-400",
          "bg-green-500/20 text-green-300",
          inProgressTasks,
        )}
        {renderKanbanColumn("paused", "已暂停", X, "text-yellow-400", "bg-yellow-500/20 text-yellow-300", pausedTasks)}
        {renderKanbanColumn(
          "completed",
          "已完成",
          Crosshair,
          "text-purple-400",
          "bg-purple-500/20 text-purple-300",
          completedTasks,
        )}
      </div>
    </div>
  )
}
