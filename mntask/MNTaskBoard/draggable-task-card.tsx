"use client"

import type React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Target, Clock, Trash2, Eye } from "lucide-react"
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
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({
        taskId: task.id,
        currentStatus: task.status,
      }),
    )
    e.dataTransfer.effectAllowed = "move"
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "low":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/30"
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return "高"
      case "medium":
        return "中"
      case "low":
        return "低"
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

  const typeInfo = getTypeInfo(task.type)

  return (
    <Card
      className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-colors cursor-move"
      draggable
      onDragStart={handleDragStart}
      data-task-id={task.id}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-sm">{typeInfo.emoji}</span>
            <h3 className="font-medium text-white text-sm truncate">{task.title}</h3>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-400 hover:text-white">
                <MoreHorizontal className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-800 border-slate-700" align="end">
              <DropdownMenuItem
                onClick={() => onOpenDetails(task.id)}
                className="text-slate-300 hover:bg-slate-700 focus:bg-slate-700"
              >
                <Eye className="w-4 h-4 mr-2" />
                查看详情
              </DropdownMenuItem>
              {task.isFocusTask && onAddToPending && (
                <DropdownMenuItem
                  onClick={() => onAddToPending(task.id)}
                  className="text-slate-300 hover:bg-slate-700 focus:bg-slate-700"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  移到待处理
                </DropdownMenuItem>
              )}
              {!task.isFocusTask && onAddToFocus && (
                <DropdownMenuItem
                  onClick={() => onAddToFocus(task.id)}
                  className="text-slate-300 hover:bg-slate-700 focus:bg-slate-700"
                >
                  <Target className="w-4 h-4 mr-2" />
                  添加到焦点
                </DropdownMenuItem>
              )}
              {task.isInPending && onRemoveFromPending && (
                <DropdownMenuItem
                  onClick={() => onRemoveFromPending(task.id)}
                  className="text-slate-300 hover:bg-slate-700 focus:bg-slate-700"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  移出待处理
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator className="bg-slate-600" />
              <DropdownMenuItem
                onClick={() => onDeleteTask(task.id)}
                className="text-red-400 hover:bg-red-900/20 focus:bg-red-900/20"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                删除任务
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
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
            <Badge className={`${getStatusColor(task.status)} border-0 text-xs`}>{getStatusText(task.status)}</Badge>
            <Badge className={`${getPriorityColor(task.priority)} border text-xs`}>
              {getPriorityText(task.priority)}
            </Badge>
          </div>
          {task.isPriorityFocus && <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-xs">优先</Badge>}
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
      </CardContent>
    </Card>
  )
}
