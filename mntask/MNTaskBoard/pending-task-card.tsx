"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ProgressDialog } from "@/components/progress-dialog"
import {
  Trash2,
  MoreVertical,
  Zap,
  MapPin,
  Plus,
  Target,
  X,
  Clock,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  FolderOpen,
  TrendingUp,
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
  progressHistory?: Array<{
    id: string
    content: string
    timestamp: Date
    type: "progress" | "status" | "comment"
  }>
}

interface PendingTaskCardProps {
  task: Task
  isSelected: boolean
  isSelectionMode: boolean
  onToggleSelection: (taskId: string) => void
  onOpenDetails: (taskId: string) => void
  onDelete: (taskId: string) => void
  onRemoveFromPending: (taskId: string) => void
  onAddToFocus: (taskId: string) => void
  onLocateTask: (taskId: string) => void
  onLaunchTask: (taskId: string) => void
  onAddProgress: (taskId: string, progress: string) => void
  onStartTask?: (taskId: string) => void
  onPauseTask?: (taskId: string) => void
  onCompleteTask?: (taskId: string) => void
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

export function PendingTaskCard({
  task,
  isSelected,
  isSelectionMode,
  onToggleSelection,
  onOpenDetails,
  onDelete,
  onRemoveFromPending,
  onAddToFocus,
  onLocateTask,
  onLaunchTask,
  onAddProgress,
  onStartTask,
  onPauseTask,
  onCompleteTask,
}: PendingTaskCardProps) {
  const [progressDialogOpen, setProgressDialogOpen] = useState(false)
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

  const handleCardClick = () => {
    if (isSelectionMode) {
      onToggleSelection(task.id)
    } else {
      onOpenDetails(task.id)
    }
  }

  return (
    <>
    <Card
      className={`bg-slate-800/30 border-slate-700 cursor-pointer hover:bg-slate-800/50 transition-colors ${
        isSelectionMode && isSelected ? "ring-2 ring-purple-500 bg-slate-800/60" : ""
      }`}
      onClick={handleCardClick}
      data-task-id={task.id}
    >
      <CardContent className="p-3 md:p-4">
        {/* 顶部徽章行 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* 选择模式复选框 */}
            {isSelectionMode && (
              <div
                className="flex items-center mr-2"
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleSelection(task.id)
                }}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => {
                    e.stopPropagation()
                    onToggleSelection(task.id)
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 cursor-pointer"
                />
              </div>
            )}

            {/* 任务类型徽章 - 矩形设计 */}
            <div
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-medium ${typeInfo.color}`}
            >
              <TypeIcon className="w-3 h-3" />
              <span>{typeInfo.text}</span>
            </div>

            {/* 状态徽章 - 胶囊设计带状态点 */}
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor}`}
            >
              <div className={`w-2 h-2 rounded-full ${statusInfo.dotColor}`} />
              <span>{statusInfo.text}</span>
            </div>

            {/* 优先级徽章 - 菱形切角设计 */}
            <div
              className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium ${priorityInfo.color}`}
              style={{
                clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
              }}
            >
              <PriorityIcon className="w-3 h-3" />
              <span>{priorityInfo.text}</span>
            </div>
          </div>

          {!isSelectionMode && (
            <div className="flex items-center gap-1">
              {/* 更多操作菜单 */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="sm" className="p-1 md:p-1 h-9 w-9 md:h-6 md:w-6 text-slate-400 hover:text-white">
                    <MoreVertical className="w-5 h-5 md:w-4 md:h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(task.id)
                    }}
                    className="text-red-400 hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    删除任务
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* 任务标题 */}
        <h3 className="text-white font-medium mb-2 line-clamp-2 leading-relaxed">{task.title}</h3>

        {/* 标签显示 */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} className={`${getTagColor(tag)} border text-xs px-2 py-0.5`}>
                {tag}
              </Badge>
            ))}
            {task.tags.length > 3 && (
              <Badge className="bg-slate-600/50 text-slate-400 border-slate-600 text-xs px-2 py-0.5">
                +{task.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* 路径信息 */}
        {task.category && <p className="text-xs text-slate-400 mb-3 truncate">{task.category}</p>}

        {/* 任务描述 */}
        {task.description && (
          <div className="mb-3 p-2 bg-slate-700/30 rounded-md border-l-2 border-slate-600">
            <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed italic">{task.description}</p>
          </div>
        )}

        {/* 最新进展 */}
        {task.progress && (
          <div className="mb-3 p-2 bg-blue-900/20 rounded border-l-2 border-blue-500">
            <div className="flex items-center gap-1 mb-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-xs text-blue-300 font-medium">最近进展</span>
              <span className="text-xs text-slate-400">
                {task.updatedAt
                  ? new Date(task.updatedAt).toLocaleString("zh-CN", {
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}
              </span>
            </div>
            <p className="text-xs text-slate-300 line-clamp-2">{task.progress}</p>
          </div>
        )}

        {/* 底部操作按钮 */}
        {!isSelectionMode && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-700">
            <div className="flex items-center gap-2">
              {/* 加入焦点按钮 */}
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  onAddToFocus(task.id)
                }}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-sm px-3 py-1 h-8"
              >
                <Target className="w-3 h-3 mr-1" />
                加入焦点
              </Button>

              {/* 状态切换按钮组 */}
              {task.status === "todo" && onStartTask && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    onStartTask(task.id)
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 h-8"
                >
                  <Play className="w-3 h-3 mr-1" />
                  开始
                </Button>
              )}
              {task.status === "in-progress" && onPauseTask && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    onPauseTask(task.id)
                  }}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white text-sm px-3 py-1 h-8"
                >
                  <Pause className="w-3 h-3 mr-1" />
                  暂停
                </Button>
              )}
              {task.status === "paused" && onStartTask && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    onStartTask(task.id)
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 h-8"
                >
                  <Play className="w-3 h-3 mr-1" />
                  继续
                </Button>
              )}
              {task.status !== "completed" && onCompleteTask && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    onCompleteTask(task.id)
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 h-8"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  完成
                </Button>
              )}
            </div>

            <div className="flex items-center gap-1">
              {/* 启动任务按钮 */}
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onLaunchTask(task.id)
                }}
                className="p-1 h-6 w-6 text-slate-400 hover:text-purple-400 hover:bg-purple-900/20"
                title="启动任务"
              >
                <Zap className="w-3 h-3" />
              </Button>

              {/* 定位卡片按钮 */}
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onLocateTask(task.id)
                }}
                className="p-1 h-6 w-6 text-slate-400 hover:text-yellow-400 hover:bg-yellow-900/20"
                title="定位卡片"
              >
                <MapPin className="w-3 h-3" />
              </Button>

              {/* 添加进展按钮 */}
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setProgressDialogOpen(true)
                }}
                className="p-1 h-6 w-6 text-slate-400 hover:text-blue-400 hover:bg-blue-900/20"
                title="进展"
              >
                <Plus className="w-3 h-3" />
              </Button>

              {/* 从待处理中移除按钮 */}
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemoveFromPending(task.id)
                }}
                className="p-1 h-6 w-6 text-slate-500 hover:text-orange-400 hover:bg-orange-900/20"
                title="从待处理中移除"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
    
    {/* Progress Dialog */}
    <ProgressDialog
      open={progressDialogOpen}
      onOpenChange={setProgressDialogOpen}
      onConfirm={(progress) => {
        onAddProgress(task.id, progress)
        setProgressDialogOpen(false)
      }}
      taskTitle={task.title}
    />
    </>
  )
}
