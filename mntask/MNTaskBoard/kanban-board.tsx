"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DraggableTaskCard } from "./draggable-task-card"
import {
  Clock,
  Play,
  Pause,
  CheckCircle,
  Target,
  FolderOpen,
  TrendingUp,
  Crosshair,
  Filter,
  X,
  Plus,
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
  isInPending?: boolean
  progressHistory?: Array<{
    id: string
    content: string
    timestamp: Date
    type: "progress" | "status" | "comment"
  }>
}

interface KanbanBoardProps {
  tasks: Task[]
  pendingTasks: Task[]
  allTasks: Task[] // 新增：所有任务列表
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void
  onOpenDetails: (taskId: string) => void
  onDeleteTask: (taskId: string) => void
  onAddToFocus: (taskId: string) => void
  onAddToPending?: (taskId: string) => void
  onRemoveFromPending?: (taskId: string) => void
  onAddTask?: (task: Omit<Task, "id" | "createdAt">) => void
}

type TaskTypeFilter = "all" | "action" | "project" | "key-result" | "objective"
type TaskStatus = "todo" | "in-progress" | "completed" | "paused"

export function KanbanBoard({
  tasks,
  pendingTasks,
  allTasks, // 使用所有任务列表
  onUpdateTask,
  onOpenDetails,
  onDeleteTask,
  onAddToFocus,
  onAddToPending,
  onRemoveFromPending,
  onAddTask,
}: KanbanBoardProps) {
  const [selectedFilter, setSelectedFilter] = useState<TaskTypeFilter>("all")
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskType, setNewTaskType] = useState<"action" | "project" | "key-result" | "objective">("action")
  const [showAddTask, setShowAddTask] = useState(false)
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null)

  // 使用 allTasks 而不是合并 tasks 和 pendingTasks
  // 这样可以显示所有任务，包括那些既不在焦点也不在待处理中的任务
  const displayTasks = allTasks

  // 根据类型筛选任务
  const filteredTasks =
    selectedFilter === "all" ? displayTasks : displayTasks.filter((task) => task.type === selectedFilter)

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
    if (type === "all") return displayTasks.length
    return displayTasks.filter((task) => task.type === type).length
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

  // 添加新任务
  const handleAddTask = () => {
    if (!newTaskTitle.trim()) {
      toast.error("请输入任务标题")
      return
    }

    const newTask: Omit<Task, "id" | "createdAt"> = {
      title: newTaskTitle.trim(),
      description: "",
      completed: false,
      isFocusTask: false,
      isPriorityFocus: false,
      priority: "low",
      status: "todo",
      type: newTaskType,
      tags: [],
      progressHistory: [],
      isInPending: false,
    }

    // 如果有 onAddTask 回调，使用它；否则使用默认逻辑
    if (onAddTask) {
      onAddTask(newTask)
    }

    // 清空输入框但保持添加状态，方便连续添加
    setNewTaskTitle("")
    // 不关闭 showAddTask 状态

    toast.success(`${getTypeInfo(newTaskType).text}任务创建成功`, {
      duration: 2000, // 缩短提示时间，避免干扰连续添加
    })
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
                placeholder="输入任务标题..."
                className="bg-slate-600/50 border-slate-500 text-white placeholder:text-slate-400"
                onKeyPress={(e) => {
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
            <p className="text-sm">暂无{title}任务</p>
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
      {/* 筛选器 */}
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
        </div>

        <div className="flex gap-3">
          <Input
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="输入任务标题后按 Enter 快速添加..."
            className="flex-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
            onKeyPress={(e) => {
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

        <div className="text-xs text-slate-400">
          提示：输入任务标题后按 Enter 键可快速添加任务，任务将出现在"待开始"列中
        </div>
      </div>

      {/* 拖拽提示 */}
      <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3">
        <p className="text-blue-300 text-sm flex items-center gap-2">
          <Target className="w-4 h-4" />
          提示：拖拽任务卡片到不同列可以快速更改任务状态，动作任务可通过菜单加入焦点或待处理列表
        </p>
      </div>

      {/* 看板列 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {renderKanbanColumn("todo", "待开始", Clock, "text-slate-400", "bg-slate-600/50 text-slate-300", todoTasks)}
        {renderKanbanColumn(
          "in-progress",
          "进行中",
          Play,
          "text-blue-400",
          "bg-blue-600/20 text-blue-300",
          inProgressTasks,
        )}
        {renderKanbanColumn(
          "paused",
          "已暂停",
          Pause,
          "text-yellow-400",
          "bg-yellow-600/20 text-yellow-300",
          pausedTasks,
        )}
        {renderKanbanColumn(
          "completed",
          "已完成",
          CheckCircle,
          "text-green-400",
          "bg-green-600/20 text-green-300",
          completedTasks,
        )}
      </div>
    </div>
  )
}
