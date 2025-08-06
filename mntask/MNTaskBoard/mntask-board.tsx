"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import type { Task, ExportData, TaskTypeFilter } from "@/types/task"
import { STORAGE_KEYS, SAMPLE_TASKS, SAMPLE_PENDING_TASKS, EXPORT_CONFIG, TASK_TYPE_OPTIONS, TASK_STATUS_OPTIONS, TASK_PRIORITY_OPTIONS } from "@/constants"
import { useTaskManager } from "@/hooks/useTaskManager"
import { usePerspectives } from "@/hooks/usePerspectives"
import { Header } from "./header"
import { Sidebar } from "./sidebar"
import { TaskCard } from "./task-card"
import { PendingTaskCard } from "./pending-task-card"
import { KanbanBoard } from "./kanban-board"
import { PerspectiveView } from "./perspective-view"
import { InboxView } from "./inbox-view"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Target, Clock, Plus, Eye, Filter, X } from "lucide-react"
import { TaskDetailsModal } from "./task-details-modal"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

// Helper function for status text
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'todo': '待开始',
    'in-progress': '进行中',
    'paused': '已暂停',
    'completed': '已完成'
  }
  return statusMap[status] || status
}

export default function MNTaskBoard() {
  // Task management hook
  const {
    isLoading: isTasksLoading,
    tasks,
    pendingTasks,
    inboxTasks,
    allTasks,
    selectedPendingTasks,
    selectedInboxTasks,
    isSelectionMode,
    newTaskTitle,
    setNewTaskTitle,
    getAllTasksList,
    getAllTags,
    getAvailableParentTasks,
    getChildTasks,
    generateTaskPath,
    togglePriorityFocus,
    toggleFocusTask,
    toggleTaskStatus,
    startTask,
    pauseTask,
    resumeTask,
    completeTask,
    deleteTask,
    deletePendingTask,
    removeFromPending,
    addProgress,
    addToPending,
    addTaskToPending,
    addToFocus,
    addToPendingFromKanban,
    updateTask,
    updateProgress,
    deleteProgress,
    toggleTaskSelection,
    selectFocusTasks,
    clearFocusTasks,
    addSelectedToFocus,
    resetData: resetTaskData,
    importTasks,
    // Inbox operations
    addToInbox,
    deleteInboxTask,
    moveFromInboxToFocus,
    moveFromInboxToPending,
    moveSelectedFromInbox,
    toggleInboxTaskSelection,
    clearInboxSelection,
    updateInboxTask,
  } = useTaskManager()

  // UI state - 移动端默认显示 Inbox
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const [currentView, setCurrentView] = useState<"focus" | "kanban" | "perspective" | "inbox">(
    isMobile ? "inbox" : "focus"
  )
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showImportConfirm, setShowImportConfirm] = useState(false)
  const [importData, setImportData] = useState<ExportData | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 透视管理
  const {
    perspectives,
    focusSelectedPerspectiveId,
    kanbanSelectedPerspectiveId,
    setFocusSelectedPerspectiveId,
    setKanbanSelectedPerspectiveId,
    createPerspective,
    updatePerspective,
    deletePerspective,
    applyPerspectiveFilter,
    getFilteredTasks,
    getFocusSelectedPerspective,
    getKanbanSelectedPerspective,
    getFilterSummary,
    resetPerspectives,
  } = usePerspectives()

  // 看板任务类型筛选状态
  const [kanbanTaskTypeFilter, setKanbanTaskTypeFilter] = useState<TaskTypeFilter>("all")

  // 焦点视图待处理任务类型显示控制
  const [showAllPendingTypes, setShowAllPendingTypes] = useState(false)


  // Load view state from localStorage
  // Note: View state is pure UI state, so we keep it in localStorage for simplicity
  // This doesn't need to be persisted to the file system
  useEffect(() => {
    const savedView = localStorage.getItem("mntask-current-view")

    // 恢复视图状态
    if (savedView && (savedView === "focus" || savedView === "kanban" || savedView === "perspective")) {
      setCurrentView(savedView)
    }
  }, [])

  // 保存视图状态 (UI state only)
  useEffect(() => {
    localStorage.setItem("mntask-current-view", currentView)
  }, [currentView])


  // 应用透视筛选后的任务列表
  const filteredTasks = getFilteredTasks(tasks, "focus")
  const filteredPendingTasks = getFilteredTasks(
    showAllPendingTypes ? pendingTasks : pendingTasks.filter((task) => task.type === "action"),
    "focus",
  )

  // 计算实际的筛选任务数量（不包括已完成的任务）
  const getFilteredTaskCount = (): number => {
    const activeFocusTasks = filteredTasks.filter((task) => !task.completed)
    const activePendingTasks = filteredPendingTasks.filter((task) => !task.completed)
    return activeFocusTasks.length + activePendingTasks.length
  }

  const focusTasksCount = allTasks.filter((task) => task.isFocusTask && !task.completed).length









  // 从待处理列表中移除任务（但不删除任务本身）




  // 修复：支持从待处理任务和总任务列表中添加到焦点

  // 修复：将任务添加到待处理列表



  const resetData = () => {
    resetTaskData()  // Call the hook's reset function
    resetPerspectives()  // Call the perspectives hook's reset function
    setShowResetConfirm(false)
    toast.success("数据已重置")
  }

  const handleResetClick = () => {
    setShowResetConfirm(true)
  }

  const openTaskDetails = (taskId: string) => {
    // 优先从 allTasks 中获取最新的任务数据
    const task = allTasks.find((t) => t.id === taskId)
    if (task) {
      setSelectedTask(task)
      setIsDetailsModalOpen(true)
    } else {
      // 尝试从其他数组中查找
      const taskInFocus = tasks.find((t) => t.id === taskId)
      const taskInPending = pendingTasks.find((t) => t.id === taskId)
      
      if (taskInFocus) {
        setSelectedTask(taskInFocus)
        setIsDetailsModalOpen(true)
      } else if (taskInPending) {
        setSelectedTask(taskInPending)
        setIsDetailsModalOpen(true)
      }
    }
  }

  const locateTask = (taskId: string) => {
    // 这里可以添加定位任务的逻辑，比如滚动到任务位置并高亮
    const taskElement = document.getElementById(`task-${taskId}`)
    if (taskElement) {
      taskElement.scrollIntoView({ behavior: "smooth", block: "center" })
      taskElement.classList.add("ring-2", "ring-yellow-400", "ring-opacity-75")
      setTimeout(() => {
        taskElement.classList.remove("ring-2", "ring-yellow-400", "ring-opacity-75")
      }, 2000)
    }
  }

  const launchTask = (taskId: string) => {
    // 这里可以添加启动外部软件的逻辑
    // 比如打开特定的应用程序或网页链接
  }


  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      const perspective = getFocusSelectedPerspective
      if (perspective) {
        addToPending(undefined, perspective.filters, perspective.name)
      } else {
        addToPending()
      }
    }
  }

  // 排序逻辑：优先焦点任务 -> 焦点任务(按order) -> 普通任务(按创建时间)
  const sortedTasks = [...filteredTasks.filter((task) => !task.completed)].sort((a, b) => {
    if (a.isPriorityFocus && !b.isPriorityFocus) return -1
    if (!a.isPriorityFocus && b.isPriorityFocus) return 1

    if (a.isFocusTask && !b.isFocusTask) return -1
    if (!a.isFocusTask && b.isFocusTask) return 1

    if (a.isFocusTask && b.isFocusTask) {
      return (a.order || 0) - (b.order || 0)
    } else {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  // 分离焦点任务和普通任务
  const focusTasks = sortedTasks.filter((task) => task.isFocusTask)





  const exportData = () => {
    try {
      const exportData: ExportData = {
        version: "1.0.0",
        exportDate: new Date().toISOString(),
        focusTasks: tasks,
        pendingTasks: pendingTasks,
        allTasks: allTasks,
        totalTasks: allTasks.length,
      }

      const dataStr = JSON.stringify(exportData, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)

      // 创建更详细的文件名
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-").split("T")[0]
      const timeStr = new Date().toTimeString().split(" ")[0].replace(/:/g, "-")
      const filename = `mntask-backup-${timestamp}-${timeStr}.json`

      const link = document.createElement("a")
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      // 提供保存路径建议
      toast.success(`数据导出成功！共导出 ${exportData.totalTasks} 个任务`, {
        description: `建议将文件移动到: /Users/xiakangwei/Nutstore/Github/repository/MN-addon-develop/MN-Addon/mntask/data-backup/`,
        duration: 8000,
      })
    } catch (error) {
      console.error("Export failed:", error)
      toast.error("导出失败，请重试")
    }
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const data = JSON.parse(content) as ExportData

        // 验证数据格式
        if (
          !data.focusTasks ||
          !data.pendingTasks ||
          !Array.isArray(data.focusTasks) ||
          !Array.isArray(data.pendingTasks)
        ) {
          throw new Error("Invalid data format")
        }
        
        // allTasks is optional but if provided, should be an array
        if (data.allTasks && !Array.isArray(data.allTasks)) {
          throw new Error("Invalid allTasks format")
        }

        setImportData(data)
        setShowImportConfirm(true)
      } catch (error) {
        console.error("Import failed:", error)
        toast.error("文件格式错误，请选择有效的备份文件")
      }
    }
    reader.readAsText(file)

    // 清空文件输入，允许重复选择同一文件
    event.target.value = ""
  }

  const confirmImport = () => {
    if (!importData) return

    try {
      // Process focus tasks
      const processedFocusTasks = importData.focusTasks.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: task.updatedAt ? new Date(task.updatedAt) : undefined,
        tags: task.tags || [],
        progressHistory:
          task.progressHistory?.map((entry: any) => ({
            ...entry,
            timestamp: new Date(entry.timestamp),
          })) || [],
      }))
      
      // Process pending tasks
      const processedPendingTasks = importData.pendingTasks.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: task.updatedAt ? new Date(task.updatedAt) : undefined,
        tags: task.tags || [],
        progressHistory:
          task.progressHistory?.map((entry: any) => ({
            ...entry,
            timestamp: new Date(entry.timestamp),
          })) || [],
      }))
      
      // Process all tasks if provided
      let processedAllTasks: Task[] | undefined
      if (importData.allTasks) {
        processedAllTasks = importData.allTasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: task.updatedAt ? new Date(task.updatedAt) : undefined,
          tags: task.tags || [],
          progressHistory:
            task.progressHistory?.map((entry: any) => ({
              ...entry,
              timestamp: new Date(entry.timestamp),
            })) || [],
        }))
      }
      
      // Import the tasks using the new importTasks method
      importTasks(processedFocusTasks, processedPendingTasks, processedAllTasks)
      
      setShowImportConfirm(false)
      setImportData(null)

      toast.success(`数据导入成功！共导入 ${importData.totalTasks || (processedFocusTasks.length + processedPendingTasks.length)} 个任务`)
    } catch (error) {
      console.error("Import failed:", error)
      toast.error("导入失败，请重试")
    }
  }

  // Show loading state
  if (isTasksLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">正在加载任务数据...</p>
          <p className="text-slate-400 text-sm mt-2">首次加载可能需要几秒钟</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header currentView={currentView} onViewChange={setCurrentView} />

      {/* 隐藏的文件输入 */}
      <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileChange} style={{ display: "none" }} />

      {/* 主内容区域 - 添加顶部间距以避免与固定header重叠 */}
      <div className="pt-20 flex" style={{ minHeight: "calc(100vh - 80px)" }}>
        {/* 只在焦点视图显示侧边栏 */}
        {currentView === "focus" && (
          <Sidebar
            focusTasksCount={focusTasksCount}
            pendingTasksCount={filteredPendingTasks.length}
            isSelectionMode={isSelectionMode}
            onAddToPending={addToPending}
            onSelectFocusTasks={selectFocusTasks}
            onClearFocusTasks={clearFocusTasks}
            onResetData={handleResetClick}
            onExportData={exportData}
            onImportData={handleImportClick}
          />
        )}

        <div className={`flex-1 overflow-y-auto ${currentView === "focus" ? "md:ml-64 p-4 md:p-6" : ""}`}>
          {currentView === "focus" ? (
            <>
              {/* 透视选择器 */}
              <div className="mb-4 md:mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                    <span className="text-sm md:text-base text-white font-medium">透视筛选:</span>
                  </div>
                  <Select
                    value={focusSelectedPerspectiveId || "all"}
                    onValueChange={(value) => setFocusSelectedPerspectiveId(value === "all" ? null : value)}
                  >
                    <SelectTrigger className="w-full sm:w-64 bg-slate-800/50 border-slate-700 text-white">
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
                        <SelectItem
                          key={perspective.id}
                          value={perspective.id}
                          className="text-white hover:bg-slate-700"
                        >
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            <span>{perspective.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {getFocusSelectedPerspective && (
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                        {getFilteredTaskCount()} 个任务
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFocusSelectedPerspectiveId(null)}
                        className="p-1 h-6 w-6 text-slate-400 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
                {getFocusSelectedPerspective && (
                  <div className="mt-2 text-sm text-slate-400">
                    {getFocusSelectedPerspective.description && (
                      <p className="mb-1">{getFocusSelectedPerspective.description}</p>
                    )}
                    <p>筛选条件: {getFocusSelectedPerspective.filters ? getFilterSummary(getFocusSelectedPerspective.filters) : '无'}</p>
                  </div>
                )}
              </div>

              {/* 焦点任务区域 */}
              {focusTasks.length > 0 && (
                <div className="mb-6 md:mb-8">
                  <div className="flex items-center gap-2 mb-4 md:mb-6">
                    <Target className="w-4 h-4 md:w-5 md:h-5 text-red-400" />
                    <h2 className="text-lg md:text-xl font-semibold text-white">
                      {getFocusSelectedPerspective ? `${getFocusSelectedPerspective.name} - 焦点任务` : "焦点任务"}
                    </h2>
                    <Badge className="bg-red-500/20 text-red-300 border-red-500/30">{focusTasksCount}</Badge>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {focusTasks.map((task) => {
                      const allTasksList = getAllTasksList()
                      const taskPath = generateTaskPath(task, allTasksList)
                      const taskWithPath = { ...task, category: taskPath }

                      return (
                        <div key={task.id} id={`task-${task.id}`}>
                          <TaskCard
                            task={taskWithPath}
                            onToggleFocus={toggleFocusTask}
                            onTogglePriorityFocus={togglePriorityFocus}
                            onToggleStatus={toggleTaskStatus}
                            onComplete={completeTask}
                            onDelete={deleteTask}
                            onLocateTask={locateTask}
                            onLaunchTask={launchTask}
                            onOpenDetails={openTaskDetails}
                            onStartTask={startTask}
                            onPauseTask={pauseTask}
                            onResumeTask={resumeTask}
                            onAddProgress={addProgress}
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* 待处理任务区域 */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 md:w-5 md:h-5 text-slate-400" />
                    <h2 className="text-lg md:text-xl font-semibold text-white">
                      {getFocusSelectedPerspective ? `${getFocusSelectedPerspective.name} - 待处理任务` : "待处理任务"}
                    </h2>
                    <Badge className="bg-slate-700 text-slate-300 border-slate-600">
                      共 {filteredPendingTasks.length} 项{showAllPendingTypes ? "任务" : "动作"}
                    </Badge>
                    {!showAllPendingTypes && pendingTasks.length > filteredPendingTasks.length && (
                      <Badge className="bg-yellow-600/20 text-yellow-300 border-yellow-600/30 text-xs">
                        {getFocusSelectedPerspective
                          ? "透视筛选"
                          : `已隐藏 ${pendingTasks.length - filteredPendingTasks.length} 项非动作任务`}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAllPendingTypes(!showAllPendingTypes)}
                      className={`border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent ${
                        showAllPendingTypes ? "bg-slate-700 text-white" : ""
                      }`}
                    >
                      {showAllPendingTypes ? "显示所有类型" : "仅显示动作"}
                    </Button>
                  </div>
                </div>

                {isSelectionMode && (
                  <div className="flex items-center justify-between bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-4">
                      <span className="text-white text-sm">已选择 {selectedPendingTasks.length} 个任务</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Select all pending tasks
                          const allIds = filteredPendingTasks.map((task) => task.id)
                          allIds.forEach(id => {
                            if (!selectedPendingTasks.includes(id)) {
                              toggleTaskSelection(id)
                            }
                          })
                        }}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                      >
                        全选
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Clear all selections
                          selectedPendingTasks.forEach(id => toggleTaskSelection(id))
                        }}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                      >
                        清空
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          selectFocusTasks()  // This toggles selection mode
                        }}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                      >
                        取消
                      </Button>
                      <Button
                        onClick={addSelectedToFocus}
                        disabled={selectedPendingTasks.length === 0}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white disabled:opacity-50"
                      >
                        <Target className="w-4 h-4 mr-2" />
                        添加到焦点 ({selectedPendingTasks.length})
                      </Button>
                    </div>
                  </div>
                )}

                {/* 快速添加任务 */}
                <Card className="bg-slate-800/30 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <Textarea
                        placeholder={`快速添加任务...使用 2 个空格创建层级任务`}
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="flex-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 min-h-[100px] text-sm"
                      />
                      <Button
                        onClick={() => {
                          const perspective = getFocusSelectedPerspective
                          if (perspective) {
                            addToPending(undefined, perspective.filters, perspective.name)
                          } else {
                            addToPending()
                          }
                        }}
                        className="bg-purple-600 hover:bg-purple-700 text-white self-start"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        添加
                      </Button>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      提示: 使用缩进创建层级任务。按 (Cmd/Ctrl + Enter) 快速提交。
                    </p>

                    {getFocusSelectedPerspective && getFocusSelectedPerspective.filters && (
                      <div className="mt-2 text-xs text-slate-400 flex items-center gap-2">
                        <Eye className="w-3 h-3" />
                        <span>新任务将自动应用透视条件:</span>
                        {getFocusSelectedPerspective.filters.tags.length > 0 && (
                          <div className="flex gap-1">
                            {getFocusSelectedPerspective.filters.tags.map((tag) => (
                              <Badge key={tag} className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {getFocusSelectedPerspective.filters.taskTypes.length === 1 && (
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                            {getTypeText(getFocusSelectedPerspective.filters.taskTypes[0])}
                          </Badge>
                        )}
                        {getFocusSelectedPerspective.filters.priorities.length === 1 && (
                          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs">
                            {getPriorityText(getFocusSelectedPerspective.filters.priorities[0])}优先级
                          </Badge>
                        )}
                        {getFocusSelectedPerspective.filters.statuses.length === 1 && (
                          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs">
                            {getStatusText(getFocusSelectedPerspective.filters.statuses[0])}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="space-y-3">
                  {filteredPendingTasks.map((task) => {
                    const allTasksList = getAllTasksList()
                    const taskPath = generateTaskPath(task, allTasksList)
                    const taskWithPath = { ...task, category: taskPath }

                    return (
                      <div key={task.id} id={`task-${task.id}`}>
                        <PendingTaskCard
                          task={taskWithPath}
                          isSelected={selectedPendingTasks.includes(task.id)}
                          isSelectionMode={isSelectionMode}
                          onToggleSelection={toggleTaskSelection}
                          onOpenDetails={openTaskDetails}
                          onDelete={deletePendingTask}
                          onRemoveFromPending={removeFromPending}
                          onAddToFocus={addToFocus}
                          onLocateTask={locateTask}
                          onLaunchTask={launchTask}
                          onAddProgress={addProgress}
                        />
                      </div>
                    )
                  })}

                  {filteredPendingTasks.length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                      <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      {getFocusSelectedPerspective ? (
                        <>
                          <p>当前透视下暂无待处理的{showAllPendingTypes ? "任务" : "动作任务"}</p>
                          <p className="text-sm">尝试切换到"全部任务"或调整透视筛选条件</p>
                        </>
                      ) : (
                        <>
                          <p>暂无待处理的{showAllPendingTypes ? "任务" : "动作任务"}</p>
                          <p className="text-sm">
                            使用上方输入框快速添加新的{showAllPendingTypes ? "任务" : "动作任务"}
                          </p>
                          {!showAllPendingTypes && pendingTasks.length > 0 && (
                            <p className="text-xs text-yellow-400 mt-2">
                              提示：当前隐藏了 {pendingTasks.length} 个非动作类型的任务，点击右上角按钮可显示所有类型
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : currentView === "kanban" ? (
            /* 看板视图 */
            <KanbanBoard
              tasks={tasks}
              pendingTasks={pendingTasks}
              allTasks={allTasks}
              perspectives={perspectives}
              selectedPerspectiveId={kanbanSelectedPerspectiveId}
              selectedTaskTypeFilter={kanbanTaskTypeFilter}
              onUpdateTask={updateTask}
              onOpenDetails={openTaskDetails}
              onDeleteTask={deleteTask}
              onAddToFocus={addToFocus}
              onAddToPending={addToPendingFromKanban}
              onRemoveFromPending={removeFromPending}
              onAddTask={(taskData) => {
          const perspective = getFocusSelectedPerspective
          if (perspective && perspective.filters) {
            addTaskToPending(taskData, perspective.filters)
          } else {
            addTaskToPending(taskData)
          }
        }}
              onPerspectiveChange={setKanbanSelectedPerspectiveId}
              onTaskTypeFilterChange={setKanbanTaskTypeFilter}
            />
          ) : currentView === "perspective" ? (
            /* 透视视图 */
            <PerspectiveView
              tasks={tasks}
              pendingTasks={pendingTasks}
              perspectives={perspectives}
              selectedPerspectiveId={focusSelectedPerspectiveId}
              onUpdateTask={updateTask}
              onOpenDetails={openTaskDetails}
              onDeleteTask={deleteTask}
              onAddToFocus={addToFocus}
              onToggleFocus={toggleFocusTask}
              onTogglePriorityFocus={togglePriorityFocus}
              onToggleStatus={toggleTaskStatus}
              onComplete={completeTask}
              onLocateTask={locateTask}
              onLaunchTask={launchTask}
              onStartTask={startTask}
              onPauseTask={pauseTask}
              onResumeTask={resumeTask}
              onAddProgress={addProgress}
              onRemoveFromPending={removeFromPending}
              availableTags={getAllTags()}
              onPerspectiveChange={setFocusSelectedPerspectiveId}
              onCreatePerspective={createPerspective}
              onUpdatePerspective={updatePerspective}
              onDeletePerspective={deletePerspective}
            />
          ) : (
            /* Inbox 视图 */
            <InboxView
              tasks={inboxTasks}
              selectedTasks={selectedInboxTasks}
              onAddTask={addToInbox}
              onDeleteTask={deleteInboxTask}
              onMoveToFocus={moveFromInboxToFocus}
              onMoveToPending={moveFromInboxToPending}
              onMoveSelectedTasks={moveSelectedFromInbox}
              onToggleSelection={toggleInboxTaskSelection}
              onClearSelection={clearInboxSelection}
              onUpdateTask={updateInboxTask}
              onOpenTaskDetails={openTaskDetails}
            />
          )}
        </div>
      </div>

      <TaskDetailsModal
        task={selectedTask}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onUpdateTask={updateTask}
        onToggleFocus={toggleFocusTask}
        onTogglePriorityFocus={togglePriorityFocus}
        onUpdateProgress={updateProgress}
        onDeleteProgress={deleteProgress}
        availableParentTasks={getAvailableParentTasks(selectedTask?.id)}
        allTasks={getAllTasksList()}
        availableTags={getAllTags()}
        onAddTask={(taskData) => {
          const perspective = getFocusSelectedPerspective
          if (perspective) {
            addTaskToPending(taskData, perspective.filters)
          } else {
            addTaskToPending(taskData)
          }
        }}
        onOpenSubtaskDetails={(subtask) => {
          setSelectedTask(subtask)
          // Keep the modal open to show the subtask details
        }}
        onLocateTaskInBoard={(taskId, taskType) => {

          // 首先确保任务存在于allTasks中
          const taskToLocate = allTasks.find((t) => t.id === taskId)
          if (!taskToLocate) {
            toast.error("找不到要定位的任务")
            return
          }

          // Switch to kanban view
          setCurrentView("kanban")

          // Close the current modal
          setIsDetailsModalOpen(false)

          // Set the appropriate task type filter and perspective
          const taskTypeFilter = taskType as TaskTypeFilter
          setKanbanTaskTypeFilter(taskTypeFilter)

          // 如果任务不在当前透视中，清除透视筛选
          if (kanbanSelectedPerspectiveId) {
            const perspective = perspectives.find((p) => p.id === kanbanSelectedPerspectiveId)
            if (perspective && perspective.filters) {
              const filteredTasks = applyPerspectiveFilter([taskToLocate], perspective.filters)
              if (filteredTasks.length === 0) {
                setKanbanSelectedPerspectiveId(null)
                // Task not in current perspective, clearing perspective filter
              }
            }
          }

          // Wait for the view to switch and state to update, then locate the task
          setTimeout(() => {
            // Attempting to locate task element...

            // Try multiple selectors to find the task
            const selectors = [`[data-task-id="${taskId}"]`, `#task-${taskId}`, `[data-testid="task-${taskId}"]`]

            let taskElement: Element | null = null
            for (const selector of selectors) {
              taskElement = document.querySelector(selector)
              if (taskElement) {
                // Found task element with selector
                break
              }
            }

            if (taskElement) {
              // Scroll to the task
              taskElement.scrollIntoView({ behavior: "smooth", block: "center" })

              // Add a temporary highlight effect
              taskElement.classList.add("ring-2", "ring-blue-500", "ring-opacity-75", "transition-all", "duration-300")

              // Remove highlight after animation
              setTimeout(() => {
                taskElement?.classList.remove(
                  "ring-2",
                  "ring-blue-500",
                  "ring-opacity-75",
                  "transition-all",
                  "duration-300",
                )
              }, 3000)

              // Show success message
              const typeText =
                taskType === "action"
                  ? "动作"
                  : taskType === "project"
                    ? "项目"
                    : taskType === "key-result"
                      ? "关键结果"
                      : "目标"
              toast.success(`已切换到看板视图并定位到${typeText}任务: ${taskToLocate.title}`)
            } else {
              // Task element not found, task might not be visible in current filters

              // Check if task should be visible
              const shouldBeVisible = taskTypeFilter === "all" || taskToLocate.type === taskTypeFilter
              if (shouldBeVisible) {
                toast.error(`任务已切换到看板视图，但无法定位任务。任务可能不在当前筛选条件中。`)
              } else {
                toast.warning(`已切换到看板视图，请检查任务类型筛选器是否正确设置为"${taskType}"`)
              }
            }
          }, 500) // Increased timeout to ensure state updates and re-render
        }}
      />
      <AlertDialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <AlertDialogContent className="bg-slate-800 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">确认重置数据</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              此操作将永久删除所有任务数据，包括：
            </AlertDialogDescription>
            <div className="text-slate-300">
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>所有焦点任务</li>
                <li>所有待处理任务</li>
                <li>任务进展记录</li>
                <li>任务历史数据</li>
                <li>所有透视配置</li>
              </ul>
            </div>
            <AlertDialogDescription className="text-red-400 font-semibold mt-2">
              此操作无法撤销！
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600">
              取消
            </AlertDialogCancel>
            <AlertDialogAction onClick={resetData} className="bg-red-600 text-white hover:bg-red-700">
              确认重置
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 导入数据确认对话框 */}
      <AlertDialog open={showImportConfirm} onOpenChange={setShowImportConfirm}>
        <AlertDialogContent className="bg-slate-800 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">确认导入数据</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              {importData && (
                <>
                  即将导入 {importData.totalTasks} 个任务（{importData.focusTasks.length} 个焦点任务，
                  {importData.pendingTasks.length} 个待处理任务）。 导入时间：
                  {new Date(importData.exportDate).toLocaleString()}
                </>
              )}
            </AlertDialogDescription>
            <AlertDialogDescription className="text-yellow-400 font-semibold">
              此操作将覆盖当前所有数据！
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600"
              onClick={() => setImportData(null)}
            >
              取消
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmImport} className="bg-blue-600 text-white hover:bg-blue-700">
              确认导入
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}


// 辅助函数：获取任务类型文本
function getTypeText(type: string): string {
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

// 辅助函数：获取优先级文本
function getPriorityText(priority: string): string {
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
