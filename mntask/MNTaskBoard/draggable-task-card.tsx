"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  MoreHorizontal,
  Target,
  Clock,
  Trash2,
  Eye,
  Zap,
  FolderOpen,
  TrendingUp,
  AlertCircle,
  Play,
  Pause,
  CheckCircle,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
  onAddToFocus?: (taskId: string) => void
  onAddToPending?: (taskId: string) => void
  onRemoveFromPending?: (taskId: string) => void
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

export function DraggableTaskCard({
  task,
  onUpdateTask,
  onOpenDetails,
  onDeleteTask,
  onAddToFocus,
  onAddToPending,
  onRemoveFromPending,
}: DraggableTaskCardProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartTime, setDragStartTime] = useState(0)
  const [touchStartPos, setTouchStartPos] = useState<{ x: number; y: number } | null>(null)

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true)
    setDragStartTime(Date.now())
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({
        taskId: task.id,
        currentStatus: task.status,
      }),
    )
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragEnd = () => {
    // Add a small delay to prevent click event from firing immediately after drag
    setTimeout(() => {
      setIsDragging(false)
    }, 100)
  }

  // Touch event handlers for mobile drag support
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setTouchStartPos({ x: touch.clientX, y: touch.clientY })
    setDragStartTime(Date.now())
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartPos) return
    const touch = e.touches[0]
    const deltaX = Math.abs(touch.clientX - touchStartPos.x)
    const deltaY = Math.abs(touch.clientY - touchStartPos.y)
    
    // If moved more than 10px, consider it a drag
    if (deltaX > 10 || deltaY > 10) {
      setIsDragging(true)
    }
  }

  const handleTouchEnd = () => {
    setTimeout(() => {
      setIsDragging(false)
      setTouchStartPos(null)
    }, 100)
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent click if we just finished dragging
    if (isDragging || Date.now() - dragStartTime < 200) {
      return
    }

    // Don't trigger if clicking on interactive elements
    const target = e.target as HTMLElement
    if (target.closest("button") || target.closest('[role="button"]') || target.closest(".dropdown-trigger")) {
      return
    }

    onOpenDetails(task.id)
  }

  // 获取任务类型信息
  const getTaskTypeInfo = (type: string) => {
    switch (type) {
      case "action":
        return { icon: Zap, text: "动作", color: "bg-blue-100 text-blue-800 border-blue-200" }
      case "project":
        return { icon: FolderOpen, text: "项目", color: "bg-purple-100 text-purple-800 border-purple-200" }
      case "key-result":
        return { icon: TrendingUp, text: "关键结果", color: "bg-green-100 text-green-800 border-green-200" }
      case "objective":
        return { icon: Target, text: "目标", color: "bg-orange-100 text-orange-800 border-orange-200" }
      default:
        return { icon: Zap, text: "动作", color: "bg-blue-100 text-blue-800 border-blue-200" }
    }
  }

  // 获取状态信息
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "todo":
        return {
          icon: Clock,
          text: "待开始",
          color: "bg-slate-500",
          dotColor: "bg-slate-300",
          bgColor: "bg-slate-100 text-slate-700",
        }
      case "in-progress":
        return {
          icon: Play,
          text: "进行中",
          color: "bg-blue-500",
          dotColor: "bg-blue-400",
          bgColor: "bg-blue-100 text-blue-700",
        }
      case "paused":
        return {
          icon: Pause,
          text: "已暂停",
          color: "bg-yellow-500",
          dotColor: "bg-yellow-400",
          bgColor: "bg-yellow-100 text-yellow-700",
        }
      case "completed":
        return {
          icon: CheckCircle,
          text: "已完成",
          color: "bg-green-500",
          dotColor: "bg-green-400",
          bgColor: "bg-green-100 text-green-700",
        }
      default:
        return {
          icon: Clock,
          text: "待开始",
          color: "bg-slate-500",
          dotColor: "bg-slate-300",
          bgColor: "bg-slate-100 text-slate-700",
        }
    }
  }

  // 获取优先级信息
  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case "high":
        return {
          icon: AlertCircle,
          text: "高",
          color: "bg-gradient-to-r from-red-500 to-red-600 text-white",
          borderColor: "border-red-300",
        }
      case "medium":
        return {
          icon: Zap,
          text: "中",
          color: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white",
          borderColor: "border-yellow-300",
        }
      case "low":
        return {
          icon: Clock,
          text: "低",
          color: "bg-gradient-to-r from-slate-400 to-slate-500 text-white",
          borderColor: "border-slate-300",
        }
      default:
        return {
          icon: Clock,
          text: "低",
          color: "bg-gradient-to-r from-slate-400 to-slate-500 text-white",
          borderColor: "border-slate-300",
        }
    }
  }

  const typeInfo = getTaskTypeInfo(task.type)
  const statusInfo = getStatusInfo(task.status)
  const priorityInfo = getPriorityInfo(task.priority)
  const TypeIcon = typeInfo.icon
  const StatusIcon = statusInfo.icon
  const PriorityIcon = priorityInfo.icon

  return (
    <Card
      className={`bg-slate-800/50 border-slate-700 transition-all duration-200 ${
        isDragging
          ? "cursor-grabbing opacity-50 scale-105"
          : "cursor-pointer hover:bg-slate-700/50 hover:border-slate-600 hover:shadow-lg"
      }`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleCardClick}
      data-task-id={task.id}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <TypeIcon className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <h3 className="font-medium text-white text-sm truncate">{task.title}</h3>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Quick View Details Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onOpenDetails(task.id)
              }}
              className="h-6 w-6 p-0 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
              title="查看详情"
            >
              <Eye className="w-3 h-3" />
            </Button>

            {/* More Options Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-slate-400 hover:text-white dropdown-trigger"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-800 border-slate-700" align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onOpenDetails(task.id)
                  }}
                  className="text-slate-300 hover:bg-slate-700 focus:bg-slate-700"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  查看详情
                </DropdownMenuItem>
                {task.isFocusTask && onAddToPending && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onAddToPending(task.id)
                    }}
                    className="text-slate-300 hover:bg-slate-700 focus:bg-slate-700"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    移到待处理
                  </DropdownMenuItem>
                )}
                {!task.isFocusTask && onAddToFocus && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onAddToFocus(task.id)
                    }}
                    className="text-slate-300 hover:bg-slate-700 focus:bg-slate-700"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    添加到焦点
                  </DropdownMenuItem>
                )}
                {!task.isFocusTask && !task.isInPending && onAddToPending && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onAddToPending(task.id)
                    }}
                    className="text-slate-300 hover:bg-slate-700 focus:bg-slate-700"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    添加到待处理
                  </DropdownMenuItem>
                )}
                {task.isInPending && onRemoveFromPending && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemoveFromPending(task.id)
                    }}
                    className="text-slate-300 hover:bg-slate-700 focus:bg-slate-700"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    移出待处理
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-slate-600" />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteTask(task.id)
                  }}
                  className="text-red-400 hover:bg-red-900/20 focus:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  删除任务
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3 group">
        {task.description && <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{task.description}</p>}

        {/* 标签显示 */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} className={`${getTagColor(tag)} border text-xs`}>
                {tag}
              </Badge>
            ))}
            {task.tags.length > 3 && (
              <Badge className="bg-slate-600/50 text-slate-300 border-slate-500/50 text-xs">
                +{task.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {/* 状态徽章 - 胶囊设计带状态点 */}
            <div
              className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor}`}
            >
              <div className={`w-2 h-2 rounded-full ${statusInfo.dotColor}`} />
              <span>{statusInfo.text}</span>
            </div>

            {/* 优先级徽章 - 菱形切角设计 */}
            <div
              className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium ${priorityInfo.color}`}
              style={{
                clipPath: "polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)",
              }}
            >
              <PriorityIcon className="w-3 h-3" />
              <span>{priorityInfo.text}</span>
            </div>
          </div>
          {task.isPriorityFocus && (
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-medium">
              <span>优先</span>
            </div>
          )}
        </div>

        {task.category && (
          <div className="text-xs text-slate-500 truncate" title={task.category}>
            📂 {task.category}
          </div>
        )}

        {task.progress && (
          <div className="text-xs text-slate-400 bg-slate-700/30 rounded px-2 py-1 line-clamp-2">
            💬 {task.progress}
          </div>
        )}

        {/* Click hint - only show on hover */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs text-slate-500 text-center py-1">
          点击查看详情 • 拖拽移动状态
        </div>
      </CardContent>
    </Card>
  )
}
