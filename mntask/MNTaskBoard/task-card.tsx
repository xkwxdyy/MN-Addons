"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Play,
  Pause,
  Square,
  Trash2,
  MoreVertical,
  Minus,
  Zap,
  MapPin,
  Plus,
  Star,
  Target,
  FolderOpen,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle,
  Flame,
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

interface TaskCardProps {
  task: Task
  onToggleFocus: (taskId: string) => void
  onTogglePriorityFocus: (taskId: string) => void
  onToggleStatus?: (taskId: string) => void
  onComplete: (taskId: string) => void
  onDelete: (taskId: string) => void
  onLocateTask: (taskId: string) => void
  onLaunchTask: (taskId: string) => void
  onOpenDetails: (taskId: string) => void
  onStartTask: (taskId: string) => void
  onPauseTask: (taskId: string) => void
  onResumeTask: (taskId: string) => void
  onAddProgress: (taskId: string, progress: string) => void
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

export function TaskCard({
  task,
  onToggleFocus,
  onTogglePriorityFocus,
  onComplete,
  onDelete,
  onLocateTask,
  onLaunchTask,
  onOpenDetails,
  onStartTask,
  onPauseTask,
  onResumeTask,
  onAddProgress,
}: TaskCardProps) {
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
    onOpenDetails(task.id)
  }

  return (
    <Card
      className={`bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-200 cursor-pointer ${
        task.isPriorityFocus ? "priority-focus-card priority-focus-enter overflow-hidden" : ""
      }`}
      onClick={handleCardClick}
      data-task-id={task.id}
    >
      <CardContent className={`${task.isPriorityFocus ? "p-6 md:p-8" : "p-3 md:p-4"}`}>
        {/* 顶部徽章行 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 flex-wrap">
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

            {/* 优先焦点徽章 - 圆角胶囊设计 */}
            {task.isPriorityFocus && (
              <div className="priority-badge-animated inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-500 via-orange-400 to-red-500 text-white text-xs font-bold shadow-lg shadow-orange-500/30">
                <Flame className="w-3.5 h-3.5" />
                <span>优先焦点</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* 优先焦点星标按钮 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onTogglePriorityFocus(task.id)
              }}
              className={`p-1 md:p-1 h-9 w-9 md:h-6 md:w-6 transition-all ${
                task.isPriorityFocus ? "text-orange-400 hover:text-orange-300 animate-pulse" : "text-slate-500 hover:text-orange-400"
              }`}
              title={task.isPriorityFocus ? "取消优先焦点" : "设为优先焦点"}
            >
              <Flame className={`w-5 h-5 md:w-4 md:h-4 ${task.isPriorityFocus ? "drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]" : ""}`} />
            </Button>

            {/* 更多操作菜单 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm" className="p-1 md:p-1 h-9 w-9 md:h-6 md:w-6 text-slate-400 hover:text-white">
                  <MoreVertical className="w-5 h-5 md:w-4 md:h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                {!task.completed && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleFocus(task.id)
                    }}
                    className="text-slate-300 hover:bg-slate-700"
                  >
                    <Minus className="w-4 h-4 mr-2" />
                    移出焦点
                  </DropdownMenuItem>
                )}
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
        </div>

        {/* 任务标题 */}
        <h3 className={`text-white font-medium mb-2 line-clamp-2 leading-relaxed ${
          task.isPriorityFocus ? "text-xl md:text-2xl font-bold" : "text-base md:text-sm"
        }`}>{task.title}</h3>

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
          <div className={`mb-3 p-2 bg-slate-700/30 rounded-md border-l-2 ${
            task.isPriorityFocus ? "border-orange-500" : "border-slate-600"
          }`}>
            <p className={`text-slate-300 leading-relaxed italic ${
              task.isPriorityFocus ? "text-sm" : "text-xs line-clamp-3"
            }`}>{task.description}</p>
          </div>
        )}

        {/* 最新进展 */}
        {task.progress && (
          <div className={`mb-3 p-2 bg-blue-900/20 rounded border-l-2 border-blue-500 ${
            task.isPriorityFocus ? "p-3" : "p-2"
          }`}>
            <div className="flex items-center gap-1 mb-1">
              <div className={`bg-blue-400 rounded-full ${
                task.isPriorityFocus ? "w-3 h-3" : "w-2 h-2"
              }`}></div>
              <span className={`text-blue-300 font-medium ${
                task.isPriorityFocus ? "text-sm" : "text-xs"
              }`}>最近进展</span>
              <span className={`text-slate-400 ${
                task.isPriorityFocus ? "text-sm" : "text-xs"
              }`}>
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
            <p className={`text-slate-300 ${
              task.isPriorityFocus ? "text-sm" : "text-xs line-clamp-2"
            }`}>{task.progress}</p>
          </div>
        )}

        {/* 底部操作按钮 */}
        <div className={`flex items-center justify-between border-t border-slate-700 ${
          task.isPriorityFocus ? "pt-4" : "pt-2"
        }`}>
          <div className="flex items-center gap-2">
            {/* 状态控制按钮 */}
            {task.status === "todo" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onStartTask(task.id)
                }}
                className={`text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 ${
                  task.isPriorityFocus ? "p-3 h-12" : "p-2 md:p-1 h-10 md:h-8"
                }`}
              >
                <Play className={task.isPriorityFocus ? "w-5 h-5" : "w-5 h-5 md:w-4 md:h-4"} />
                <span className={`ml-1 ${task.isPriorityFocus ? "text-base" : "text-sm md:text-xs"}`}>继续</span>
              </Button>
            )}

            {task.status === "in-progress" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onPauseTask(task.id)
                }}
                className={`text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/20 ${
                  task.isPriorityFocus ? "p-3 h-12" : "p-2 md:p-1 h-10 md:h-8"
                }`}
              >
                <Pause className={task.isPriorityFocus ? "w-5 h-5" : "w-5 h-5 md:w-4 md:h-4"} />
                <span className={`ml-1 ${task.isPriorityFocus ? "text-base" : "text-sm md:text-xs"}`}>暂停</span>
              </Button>
            )}

            {task.status === "paused" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onResumeTask(task.id)
                }}
                className={`text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 ${
                  task.isPriorityFocus ? "p-3 h-12" : "p-2 md:p-1 h-10 md:h-8"
                }`}
              >
                <Play className={task.isPriorityFocus ? "w-5 h-5" : "w-5 h-5 md:w-4 md:h-4"} />
                <span className={`ml-1 ${task.isPriorityFocus ? "text-base" : "text-sm md:text-xs"}`}>继续</span>
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onComplete(task.id)
              }}
              className={`text-green-400 hover:text-green-300 hover:bg-green-900/20 ${
                task.isPriorityFocus ? "p-3 h-12" : "p-2 md:p-1 h-10 md:h-8"
              }`}
            >
              <Square className={task.isPriorityFocus ? "w-5 h-5" : "w-4 h-4"} />
              <span className={`ml-1 ${task.isPriorityFocus ? "text-base" : "text-sm md:text-xs"}`}>完成</span>
            </Button>
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
                const progress = prompt("请输入进展内容:")
                if (progress?.trim()) {
                  onAddProgress(task.id, progress.trim())
                }
              }}
              className="p-1 h-6 w-6 text-slate-400 hover:text-blue-400 hover:bg-blue-900/20"
              title="进展"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
