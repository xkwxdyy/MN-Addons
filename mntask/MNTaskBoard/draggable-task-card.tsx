"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MoreVertical,
  Target,
  Clock,
  Play,
  Pause,
  CheckCircle,
  Trash2,
  Eye,
  FolderOpen,
  TrendingUp,
  Crosshair,
  X,
} from "lucide-react"

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

interface DraggableTaskCardProps {
  task: Task
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void
  onOpenDetails: (taskId: string) => void
  onDeleteTask: (taskId: string) => void
  onAddToFocus: (taskId: string) => void
  onAddToPending?: (taskId: string) => void
  onRemoveFromPending?: (taskId: string) => void
}

export function DraggableTaskCard({
  task,
  onUpdateTask,
  onOpenDetails,
  onDeleteTask,
  onAddToFocus,
  onAddToPending,
  onRemoveFromPending,
}: DraggableTaskCardProps) {
  // 获取任务类型信息
  const getTypeInfo = (type: string) => {
    switch (type) {
      case "action":
        return { icon: Target, text: "动作", color: "text-blue-400", bgColor: "bg-blue-500/10" }
      case "project":
        return { icon: FolderOpen, text: "项目", color: "text-green-400", bgColor: "bg-green-500/10" }
      case "key-result":
        return { icon: TrendingUp, text: "关键结果", color: "text-purple-400", bgColor: "bg-purple-500/10" }
      case "objective":
        return { icon: Crosshair, text: "目标", color: "text-orange-400", bgColor: "bg-orange-500/10" }
      default:
        return { icon: Target, text: "动作", color: "text-blue-400", bgColor: "bg-blue-500/10" }
    }
  }

  // 获取状态信息
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "todo":
        return { icon: Clock, text: "待开始", color: "text-slate-400", bgColor: "bg-slate-500/10" }
      case "in-progress":
        return { icon: Play, text: "进行中", color: "text-blue-400", bgColor: "bg-blue-500/10" }
      case "paused":
        return { icon: Pause, text: "已暂停", color: "text-yellow-400", bgColor: "bg-yellow-500/10" }
      case "completed":
        return { icon: CheckCircle, text: "已完成", color: "text-green-400", bgColor: "bg-green-500/10" }
      default:
        return { icon: Clock, text: "待开始", color: "text-slate-400", bgColor: "bg-slate-500/10" }
    }
  }

  // 获取优先级颜色
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500"
      case "medium":
        return "border-l-yellow-500"
      case "low":
        return "border-l-green-500"
      default:
        return "border-l-slate-500"
    }
  }

  const typeInfo = getTypeInfo(task.type)
  const statusInfo = getStatusInfo(task.status)
  const TypeIcon = typeInfo.icon
  const StatusIcon = statusInfo.icon

  // 拖拽处理
  const handleDragStart = (e: React.DragEvent) => {
    const dragData = {
      taskId: task.id,
      currentStatus: task.status,
    }
    e.dataTransfer.setData("text/plain", JSON.stringify(dragData))
    e.dataTransfer.effectAllowed = "move"
  }

  // 状态切换
  const handleStatusChange = () => {
    let newStatus: "todo" | "in-progress" | "completed" | "paused"
    switch (task.status) {
      case "todo":
        newStatus = "in-progress"
        break
      case "in-progress":
        newStatus = "paused"
        break
      case "paused":
        newStatus = "completed"
        break
      case "completed":
        newStatus = "todo"
        break
      default:
        newStatus = "in-progress"
    }

    onUpdateTask(task.id, {
      status: newStatus,
      completed: newStatus === "completed",
    })
  }

  return (
    <Card
      className={`bg-slate-700/30 border-slate-600 hover:bg-slate-700/50 transition-all cursor-move border-l-4 ${getPriorityColor(
        task.priority,
      )}`}
      draggable
      onDragStart={handleDragStart}
    >
      <CardContent className="p-4">
        {/* 任务标题和状态 */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3
              className="text-white font-medium text-sm leading-tight cursor-pointer hover:text-blue-300 transition-colors"
              onClick={() => onOpenDetails(task.id)}
            >
              {task.title}
            </h3>
            {task.description && <p className="text-slate-400 text-xs mt-1 line-clamp-2">{task.description}</p>}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-400 hover:text-white">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
              <DropdownMenuItem onClick={() => onOpenDetails(task.id)} className="text-slate-300 hover:bg-slate-700">
                <Eye className="w-4 h-4 mr-2" />
                查看详情
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleStatusChange} className="text-slate-300 hover:bg-slate-700">
                <StatusIcon className="w-4 h-4 mr-2" />
                切换状态
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-600" />
              {/* 只有动作类型且不在焦点中的任务才显示"加入焦点"选项 */}
              {task.type === "action" && !task.isFocusTask && (
                <DropdownMenuItem onClick={() => onAddToFocus(task.id)} className="text-blue-300 hover:bg-slate-700">
                  <Target className="w-4 h-4 mr-2" />
                  加入焦点
                </DropdownMenuItem>
              )}
              {/* 只有动作类型且不在待处理中的任务才显示"加入待处理"选项 */}
              {task.type === "action" && !task.isInPending && onAddToPending && (
                <DropdownMenuItem
                  onClick={() => onAddToPending(task.id)}
                  className="text-yellow-300 hover:bg-slate-700"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  加入待处理
                </DropdownMenuItem>
              )}
              {/* 只有动作类型且在待处理中的任务才显示"从待处理中移除"选项 */}
              {task.type === "action" && task.isInPending && onRemoveFromPending && (
                <DropdownMenuItem
                  onClick={() => onRemoveFromPending(task.id)}
                  className="text-orange-300 hover:bg-slate-700"
                >
                  <X className="w-4 h-4 mr-2" />
                  从待处理中移除
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator className="bg-slate-600" />
              <DropdownMenuItem onClick={() => onDeleteTask(task.id)} className="text-red-300 hover:bg-slate-700">
                <Trash2 className="w-4 h-4 mr-2" />
                删除任务
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* 任务信息标签 */}
        <div className="flex flex-wrap gap-2 mb-3">
          {/* 任务类型 */}
          <Badge className={`${typeInfo.bgColor} ${typeInfo.color} border-0 text-xs`}>
            <TypeIcon className="w-3 h-3 mr-1" />
            {typeInfo.text}
          </Badge>

          {/* 任务状态 */}
          <Badge className={`${statusInfo.bgColor} ${statusInfo.color} border-0 text-xs`}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {statusInfo.text}
          </Badge>

          {/* 焦点标识 */}
          {task.isFocusTask && (
            <Badge className="bg-red-500/20 text-red-300 border-0 text-xs">
              <Target className="w-3 h-3 mr-1" />
              焦点
            </Badge>
          )}

          {/* 待处理标识 */}
          {task.isInPending && (
            <Badge className="bg-orange-500/20 text-orange-300 border-0 text-xs">
              <Clock className="w-3 h-3 mr-1" />
              待处理
            </Badge>
          )}
        </div>

        {/* 标签 */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} className="bg-slate-600/50 text-slate-300 border-0 text-xs px-2 py-0.5">
                {tag}
              </Badge>
            ))}
            {task.tags.length > 3 && (
              <Badge className="bg-slate-600/50 text-slate-400 border-0 text-xs px-2 py-0.5">
                +{task.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* 任务路径/分类 */}
        {task.category && (
          <div className="text-xs text-slate-500 truncate" title={task.category}>
            {task.category}
          </div>
        )}

        {/* 创建时间 */}
        <div className="text-xs text-slate-500 mt-2">{new Date(task.createdAt).toLocaleDateString()}</div>
      </CardContent>
    </Card>
  )
}
