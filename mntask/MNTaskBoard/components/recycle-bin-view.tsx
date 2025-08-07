/**
 * Recycle bin view component for displaying and managing deleted tasks.
 */

import React from "react"
import { Task } from "@/types/task"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Clock,
  RotateCcw,
  Trash2,
  AlertCircle,
  CheckSquare,
  Square,
  Package,
  Target,
  Flag,
  Calendar
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { zhCN } from "date-fns/locale"
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

interface RecycleBinViewProps {
  tasks: Task[]
  selectedTasks: string[]
  onToggleSelection: (taskId: string) => void
  onRestoreTask: (taskId: string) => void
  onPermanentlyDelete: (taskId: string) => void
  onEmptyRecycleBin: () => void
  onRestoreSelected: () => void
  onPermanentlyDeleteSelected: () => void
  onClearSelection: () => void
}

export function RecycleBinView({
  tasks,
  selectedTasks,
  onToggleSelection,
  onRestoreTask,
  onPermanentlyDelete,
  onEmptyRecycleBin,
  onRestoreSelected,
  onPermanentlyDeleteSelected,
  onClearSelection,
}: RecycleBinViewProps) {
  const isSelectionMode = selectedTasks.length > 0

  // Get task type icon
  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case "action":
        return <CheckSquare className="h-4 w-4 text-blue-400" />
      case "project":
        return <Package className="h-4 w-4 text-purple-400" />
      case "key-result":
        return <Target className="h-4 w-4 text-green-400" />
      case "objective":
        return <Flag className="h-4 w-4 text-orange-400" />
      default:
        return <Square className="h-4 w-4 text-slate-400" />
    }
  }

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-400"
      case "medium":
        return "text-yellow-400"
      case "low":
        return "text-green-400"
      default:
        return "text-slate-400"
    }
  }

  // Get task type label
  const getTaskTypeLabel = (type: string) => {
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

  // Calculate days until auto-deletion
  const getDaysUntilDeletion = (deletedAt: Date | undefined) => {
    if (!deletedAt) return 7
    const deletedDate = new Date(deletedAt)
    const sevenDaysLater = new Date(deletedDate)
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7)
    const now = new Date()
    const daysLeft = Math.ceil((sevenDaysLater.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(0, daysLeft)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Trash2 className="h-5 w-5 text-slate-400" />
          <h2 className="text-xl font-semibold text-white">回收站</h2>
          <span className="text-sm text-slate-300">
            ({tasks.length} 个任务)
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {isSelectionMode && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onClearSelection}
              >
                取消选择
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onRestoreSelected}
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                恢复选中 ({selectedTasks.length})
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    永久删除选中
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>确认永久删除</AlertDialogTitle>
                    <AlertDialogDescription>
                      确定要永久删除选中的 {selectedTasks.length} 个任务吗？此操作不可恢复。
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction onClick={onPermanentlyDeleteSelected}>
                      永久删除
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
          
          {tasks.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  清空回收站
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>确认清空回收站</AlertDialogTitle>
                  <AlertDialogDescription>
                    确定要永久删除回收站中的所有 {tasks.length} 个任务吗？此操作不可恢复。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>取消</AlertDialogCancel>
                  <AlertDialogAction onClick={onEmptyRecycleBin}>
                    清空回收站
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {/* Info message */}
      <Card className="mb-4 bg-slate-800/50 border-slate-700">
        <CardContent className="py-3">
          <div className="flex items-center gap-2 text-sm text-slate-200">
            <AlertCircle className="h-4 w-4" />
            <span>回收站中的任务将在删除后 7 天自动清理</span>
          </div>
        </CardContent>
      </Card>

      {/* Task list */}
      {tasks.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Trash2 className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-300">回收站为空</p>
          </div>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="space-y-2">
            {tasks.map((task) => {
              const daysLeft = getDaysUntilDeletion(task.deletedAt)
              const isSelected = selectedTasks.includes(task.id)
              
              return (
                <Card
                  key={task.id}
                  className={`
                    bg-slate-800/50 border-slate-700 hover:bg-slate-800/70
                    transition-colors cursor-pointer
                    ${isSelected ? "ring-2 ring-blue-500" : ""}
                  `}
                >
                  <CardContent className="py-3">
                    <div className="flex items-start gap-3">
                      {/* Selection checkbox */}
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onToggleSelection(task.id)}
                        className="mt-1 border-2 border-slate-400 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500"
                      />

                      {/* Task content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {getTaskTypeIcon(task.type)}
                          <span className="text-sm font-medium text-white">
                            {task.title}
                          </span>
                          {task.priority && (
                            <span className={`text-xs ${getPriorityColor(task.priority)}`}>
                              {task.priority === "high" ? "高" : task.priority === "medium" ? "中" : "低"}
                            </span>
                          )}
                        </div>
                        
                        {task.description && (
                          <p className="text-sm text-slate-300 mb-2 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-slate-300">
                          <span>{getTaskTypeLabel(task.type)}</span>
                          {task.deletedAt && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              删除于 {formatDistanceToNow(new Date(task.deletedAt), {
                                addSuffix: true,
                                locale: zhCN
                              })}
                            </span>
                          )}
                          <span className={`flex items-center gap-1 ${daysLeft <= 2 ? "text-red-400" : ""}`}>
                            <Clock className="h-3 w-3" />
                            {daysLeft} 天后自动删除
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            onRestoreTask(task.id)
                          }}
                          title="恢复任务"
                          className="border-green-600 text-green-400 hover:bg-green-600/10 hover:text-green-300"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => e.stopPropagation()}
                              title="永久删除"
                              className="border-red-600 text-red-400 hover:bg-red-600/10 hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>确认永久删除</AlertDialogTitle>
                              <AlertDialogDescription>
                                确定要永久删除任务"{task.title}"吗？此操作不可恢复。
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>取消</AlertDialogCancel>
                              <AlertDialogAction onClick={() => onPermanentlyDelete(task.id)}>
                                永久删除
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}