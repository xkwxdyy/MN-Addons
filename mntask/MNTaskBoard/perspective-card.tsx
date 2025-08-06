"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Edit, Trash2, Eye, Filter, Layers, Hash, Target, CheckCircle, Play, Pause, BarChart3 } from "lucide-react"
import type { Task, Perspective } from "@/types/task"
import { cn } from "@/lib/utils"

interface PerspectiveCardProps {
  perspective: Perspective | null
  tasks: Task[]
  isSelected: boolean
  isAllTasks?: boolean
  onSelect: () => void
  onEdit?: () => void
  onDelete?: () => void
}

// 生成渐变背景
const gradients = [
  "from-blue-500/10 to-cyan-500/10",
  "from-purple-500/10 to-pink-500/10",
  "from-green-500/10 to-emerald-500/10",
  "from-orange-500/10 to-yellow-500/10",
  "from-indigo-500/10 to-blue-500/10",
  "from-red-500/10 to-rose-500/10",
  "from-teal-500/10 to-cyan-500/10",
  "from-violet-500/10 to-purple-500/10",
]

const getGradient = (name: string): string => {
  const hash = name.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0)
    return a & a
  }, 0)
  return gradients[Math.abs(hash) % gradients.length]
}

// 获取透视图标
const getPerspectiveIcon = (perspective: Perspective | null, isAllTasks: boolean) => {
  if (isAllTasks) return <BarChart3 className="w-5 h-5" />
  if (!perspective) return <Eye className="w-5 h-5" />
  
  // 根据分组方式选择图标
  switch (perspective.groupBy) {
    case "type":
      return <Layers className="w-5 h-5" />
    case "status":
      return <Target className="w-5 h-5" />
    case "priority":
      return <Hash className="w-5 h-5" />
    default:
      return <Filter className="w-5 h-5" />
  }
}

export function PerspectiveCard({
  perspective,
  tasks,
  isSelected,
  isAllTasks = false,
  onSelect,
  onEdit,
  onDelete,
}: PerspectiveCardProps) {
  // 计算任务统计
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.status === "completed").length
  const inProgressTasks = tasks.filter(t => t.status === "in-progress").length
  const todoTasks = tasks.filter(t => t.status === "todo").length
  const pausedTasks = tasks.filter(t => t.status === "paused").length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const name = isAllTasks ? "全部任务" : (perspective?.name || "未命名透视")
  const description = isAllTasks 
    ? "查看所有任务，不应用任何筛选条件" 
    : (perspective?.description || "")
  const gradient = getGradient(name)

  return (
    <Card
      className={cn(
        "relative overflow-hidden cursor-pointer transition-all duration-300 border-2",
        "hover:shadow-xl hover:scale-[1.02] hover:border-blue-500/50",
        isSelected 
          ? "border-blue-500 shadow-lg shadow-blue-500/20 scale-[1.02]" 
          : "border-slate-700 hover:border-slate-600",
        "bg-gradient-to-br",
        gradient
      )}
      onClick={onSelect}
    >
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-slate-800/40 backdrop-blur-sm" />
      
      {/* 内容 */}
      <div className="relative">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                "bg-gradient-to-br from-white/10 to-white/5",
                "backdrop-blur-sm border border-white/10"
              )}>
                {getPerspectiveIcon(perspective, isAllTasks)}
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">{name}</h3>
                {description && (
                  <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">{description}</p>
                )}
              </div>
            </div>
            
            {!isAllTasks && perspective && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit?.()
                    }}
                    className="text-white hover:bg-slate-700"
                  >
                    <Edit className="w-3 h-3 mr-2" />
                    编辑
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete?.()
                    }}
                    className="text-red-400 hover:bg-slate-700 hover:text-red-300"
                  >
                    <Trash2 className="w-3 h-3 mr-2" />
                    删除
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 pb-4">
          {/* 任务统计数字 */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-3xl font-bold text-white">{totalTasks}</span>
            <span className="text-slate-400 text-sm">个任务</span>
          </div>
          
          {/* 进度条 */}
          <div className="mb-3">
            <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-slate-400">完成进度</span>
              <span className="text-xs text-white font-medium">{completionRate}%</span>
            </div>
          </div>
          
          {/* 状态分布 */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-400" />
                <span className="text-xs text-slate-300">已完成</span>
              </div>
              <span className="text-xs text-white font-medium ml-auto">{completedTasks}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Play className="w-3 h-3 text-blue-400" />
                <span className="text-xs text-slate-300">进行中</span>
              </div>
              <span className="text-xs text-white font-medium ml-auto">{inProgressTasks}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Target className="w-3 h-3 text-yellow-400" />
                <span className="text-xs text-slate-300">待开始</span>
              </div>
              <span className="text-xs text-white font-medium ml-auto">{todoTasks}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Pause className="w-3 h-3 text-orange-400" />
                <span className="text-xs text-slate-300">已暂停</span>
              </div>
              <span className="text-xs text-white font-medium ml-auto">{pausedTasks}</span>
            </div>
          </div>
          
          {/* 底部信息 */}
          {perspective && (
            <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {perspective.groupBy !== "none" && (
                  <Badge className="bg-slate-700/50 text-slate-300 border-slate-600 text-xs">
                    按{perspective.groupBy === "type" ? "类型" : 
                       perspective.groupBy === "status" ? "状态" : "优先级"}分组
                  </Badge>
                )}
              </div>
              {isSelected && (
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                  当前使用
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  )
}