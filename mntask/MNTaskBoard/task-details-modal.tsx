"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Trash2, Edit3, Check, Minus, Pin, Link } from "lucide-react"

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
  parentId?: string
  progressHistory?: Array<{
    id: string
    content: string
    timestamp: Date
    type: "progress" | "status" | "comment"
  }>
}

interface TaskDetailsModalProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void
  onToggleFocus: (taskId: string) => void
  onTogglePriorityFocus: (taskId: string) => void
  onUpdateProgress: (taskId: string, progressId: string, content: string) => void
  onDeleteProgress: (taskId: string, progressId: string) => void
  availableParentTasks: Task[]
  allTasks: Task[]
}

export function TaskDetailsModal({
  task,
  isOpen,
  onClose,
  onUpdateTask,
  onToggleFocus,
  onTogglePriorityFocus,
  onUpdateProgress,
  onDeleteProgress,
  availableParentTasks,
  allTasks,
}: TaskDetailsModalProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editingProgressId, setEditingProgressId] = useState<string | null>(null)
  const [editingProgressContent, setEditingProgressContent] = useState("")

  useEffect(() => {
    if (task) {
      setEditingTask({ ...task })
    }
  }, [task])

  if (!task || !editingTask) return null

  // 生成任务路径
  const generateTaskPath = (task: Task): string => {
    if (!task.parentId) {
      return task.category || ""
    }

    const parentTask = allTasks.find((t) => t.id === task.parentId)
    if (!parentTask) {
      return task.category || ""
    }

    const parentPath = generateTaskPath(parentTask)
    return parentPath ? `${parentPath} >> ${parentTask.title}` : parentTask.title
  }

  // 获取子任务
  const getChildTasks = (parentId: string): Task[] => {
    return allTasks.filter((task) => task.parentId === parentId)
  }

  const childTasks = getChildTasks(task.id)
  const parentTask = task.parentId ? allTasks.find((t) => t.id === task.parentId) : null

  const handleSave = () => {
    onUpdateTask(task.id, {
      title: editingTask.title,
      description: editingTask.description,
      category: editingTask.category,
      type: editingTask.type,
      priority: editingTask.priority,
      status: editingTask.status,
      completed: editingTask.status === "completed",
      parentId: editingTask.parentId,
    })
    onClose()
  }

  const handleCancel = () => {
    setEditingTask({ ...task })
    onClose()
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

  const typeInfo = getTypeInfo(editingTask.type)

  const startEditingProgress = (progressId: string, content: string) => {
    setEditingProgressId(progressId)
    setEditingProgressContent(content)
  }

  const saveProgressEdit = () => {
    if (editingProgressId && editingProgressContent.trim()) {
      onUpdateProgress(task.id, editingProgressId, editingProgressContent.trim())
      setEditingProgressId(null)
      setEditingProgressContent("")
    }
  }

  const cancelProgressEdit = () => {
    setEditingProgressId(null)
    setEditingProgressContent("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-slate-900 border-slate-700 text-white overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <span className="text-lg">{typeInfo.emoji}</span>
            任务详情
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 状态徽章 */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={`${getStatusColor(editingTask.status)} border-0`}>
              {getStatusText(editingTask.status)}
            </Badge>
            {editingTask.isPriorityFocus && (
              <Badge className="bg-red-500/20 text-red-300 border-red-500/30">优先焦点</Badge>
            )}
          </div>

          {/* 父任务关联 */}
          {(editingTask.type === "action" || editingTask.type === "project") && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Link className="w-4 h-4" />
                父任务
              </label>
              <Select
                value={editingTask.parentId || "none"}
                onValueChange={(value) =>
                  setEditingTask({ ...editingTask, parentId: value === "none" ? undefined : value })
                }
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="选择父任务（可选）" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="none" className="text-white hover:bg-slate-700">
                    无父任务
                  </SelectItem>
                  {availableParentTasks.map((parentTask) => (
                    <SelectItem key={parentTask.id} value={parentTask.id} className="text-white hover:bg-slate-700">
                      <div className="flex items-center gap-2">
                        <span>📁</span>
                        <span>{parentTask.title}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {parentTask && (
                <div className="text-xs text-slate-400 bg-slate-800/50 rounded px-2 py-1">
                  当前父任务: {parentTask.title}
                </div>
              )}
            </div>
          )}

          {/* 子任务显示 */}
          {childTasks.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Link className="w-4 h-4" />
                子任务 ({childTasks.length})
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {childTasks.map((childTask) => (
                  <div
                    key={childTask.id}
                    className="text-xs text-slate-300 bg-slate-800/50 rounded px-2 py-1 flex items-center gap-2"
                  >
                    <span>{getTypeInfo(childTask.type).emoji}</span>
                    <span>{childTask.title}</span>
                    <Badge className={`${getStatusColor(childTask.status)} border-0 text-xs ml-auto`}>
                      {getStatusText(childTask.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 路径字段 - 显示生成的路径 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">路径</label>
            <div className="bg-slate-800/50 border border-slate-700 rounded px-3 py-2 text-white text-sm">
              {generateTaskPath(editingTask) || "无路径"}
            </div>
            <Input
              value={editingTask.category || ""}
              onChange={(e) => setEditingTask({ ...editingTask, category: e.target.value })}
              placeholder="请输入基础路径..."
              className="bg-slate-800 border-slate-700 text-white"
              onFocus={(e) => e.target.blur()}
            />
            <div className="text-xs text-slate-400">基础路径会与父任务路径组合生成完整路径</div>
          </div>

          {/* 任务标题 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">任务标题</label>
            <Input
              value={editingTask.title}
              onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
              placeholder="请输入任务标题..."
              className="bg-slate-800 border-slate-700 text-white"
              onFocus={(e) => e.target.blur()}
            />
          </div>

          {/* 任务描述 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">任务描述</label>
            <Textarea
              value={editingTask.description || ""}
              onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
              placeholder="请输入任务描述..."
              className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
              onFocus={(e) => e.target.blur()}
            />
          </div>

          {/* 任务类型、状态、优先级 */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">任务类型</label>
              <Select
                value={editingTask.type}
                onValueChange={(value: "action" | "project" | "key-result" | "objective") =>
                  setEditingTask({ ...editingTask, type: value })
                }
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="action" className="text-white hover:bg-slate-700">
                    <div className="flex items-center gap-2">
                      <span>⚡️</span>
                      <span>动作</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="project" className="text-white hover:bg-slate-700">
                    <div className="flex items-center gap-2">
                      <span>📁</span>
                      <span>项目</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="key-result" className="text-white hover:bg-slate-700">
                    <div className="flex items-center gap-2">
                      <span>📈</span>
                      <span>关键结果</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="objective" className="text-white hover:bg-slate-700">
                    <div className="flex items-center gap-2">
                      <span>🎯</span>
                      <span>目标</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">状态</label>
              <Select
                value={editingTask.status}
                onValueChange={(value: "todo" | "in-progress" | "completed" | "paused") =>
                  setEditingTask({
                    ...editingTask,
                    status: value,
                    completed: value === "completed",
                  })
                }
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="todo" className="text-white hover:bg-slate-700">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                      <span>待开始</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="in-progress" className="text-white hover:bg-slate-700">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>进行中</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="paused" className="text-white hover:bg-slate-700">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span>已暂停</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="completed" className="text-white hover:bg-slate-700">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>已完成</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">优先级</label>
              <Select
                value={editingTask.priority}
                onValueChange={(value: "low" | "medium" | "high") =>
                  setEditingTask({ ...editingTask, priority: value })
                }
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="low" className="text-white hover:bg-slate-700">
                    低优先级
                  </SelectItem>
                  <SelectItem value="medium" className="text-white hover:bg-slate-700">
                    中优先级
                  </SelectItem>
                  <SelectItem value="high" className="text-white hover:bg-slate-700">
                    高优先级
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 进展历史 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium text-white">进展历史</h3>
              <Badge className="bg-slate-700 text-slate-300 border-slate-600">
                {task.progressHistory?.length || 0} 条记录
              </Badge>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {task.progressHistory && task.progressHistory.length > 0 ? (
                task.progressHistory
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .map((progress) => (
                    <div key={progress.id} className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span className="text-xs text-slate-400">进展更新</span>
                            <span className="text-xs text-slate-500">
                              {new Date(progress.timestamp).toLocaleString("zh-CN")}
                            </span>
                          </div>
                          {editingProgressId === progress.id ? (
                            <div className="space-y-2">
                              <Textarea
                                value={editingProgressContent}
                                onChange={(e) => setEditingProgressContent(e.target.value)}
                                className="bg-slate-700 border-slate-600 text-white text-sm"
                                rows={2}
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={saveProgressEdit}
                                  className="bg-green-600 hover:bg-green-700 text-white h-7 px-2"
                                >
                                  <Check className="w-3 h-3 mr-1" />
                                  保存
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={cancelProgressEdit}
                                  className="text-slate-400 hover:text-white h-7 px-2"
                                >
                                  取消
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-slate-300 whitespace-pre-wrap">{progress.content}</p>
                          )}
                        </div>
                        {editingProgressId !== progress.id && (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startEditingProgress(progress.id, progress.content)}
                              className="p-1 h-6 w-6 text-slate-400 hover:text-blue-400"
                            >
                              <Edit3 className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDeleteProgress(task.id, progress.id)}
                              className="p-1 h-6 w-6 text-slate-400 hover:text-red-400"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <p>暂无进展记录</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <Separator className="bg-slate-700" />

        {/* 底部按钮 */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => onToggleFocus(task.id)}
              className="text-slate-400 hover:text-white"
              tabIndex={-1}
            >
              <Minus className="w-4 h-4 mr-2" />
              移出焦点
            </Button>
            <Button
              variant="ghost"
              onClick={() => onTogglePriorityFocus(task.id)}
              className="text-slate-400 hover:text-white"
              tabIndex={-1}
            >
              <Pin className="w-4 h-4 mr-2" />
              设为优先
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleCancel} className="text-slate-400 hover:text-white" tabIndex={-1}>
              取消
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white" tabIndex={-1}>
              保存更改
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
