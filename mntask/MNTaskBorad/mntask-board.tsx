"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Header } from "./header"
import { Sidebar } from "./sidebar"
import { TaskCard } from "./task-card"
import { PendingTaskCard } from "./pending-task-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Target, Clock, Plus } from "lucide-react"
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

interface ProgressEntry {
  id: string
  content: string
  timestamp: Date
  type: "progress"
}

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
  parentId?: string // 父任务ID
  progressHistory?: Array<{
    id: string
    content: string
    timestamp: Date
    type: "progress" | "status" | "comment"
  }>
}

interface ExportData {
  version: string
  exportDate: string
  focusTasks: Task[]
  pendingTasks: Task[]
  totalTasks: number
}

export default function MNTaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [pendingTasks, setPendingTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [selectedPendingTasks, setSelectedPendingTasks] = useState<string[]>([])
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showImportConfirm, setShowImportConfirm] = useState(false)
  const [importData, setImportData] = useState<ExportData | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 生成任务路径
  const generateTaskPath = (task: Task, allTasks: Task[]): string => {
    if (!task.parentId) {
      return task.category || ""
    }

    const parentTask = allTasks.find((t) => t.id === task.parentId)
    if (!parentTask) {
      return task.category || ""
    }

    const parentPath = generateTaskPath(parentTask, allTasks)
    return parentPath ? `${parentPath} >> ${parentTask.title}` : parentTask.title
  }

  // 获取所有任务（包括焦点任务和待处理任务）
  const getAllTasks = (): Task[] => {
    return [...tasks, ...pendingTasks]
  }

  // 获取可作为父任务的任务列表（项目类型）
  const getAvailableParentTasks = (currentTaskId?: string): Task[] => {
    const allTasks = getAllTasks()
    return allTasks.filter(
      (task) =>
        task.type === "project" && task.id !== currentTaskId && !isDescendantOf(task.id, currentTaskId || "", allTasks),
    )
  }

  // 检查是否为子任务（避免循环引用）
  const isDescendantOf = (potentialParentId: string, taskId: string, allTasks: Task[]): boolean => {
    const task = allTasks.find((t) => t.id === taskId)
    if (!task || !task.parentId) return false
    if (task.parentId === potentialParentId) return true
    return isDescendantOf(potentialParentId, task.parentId, allTasks)
  }

  // 获取任务的子任务
  const getChildTasks = (parentId: string): Task[] => {
    const allTasks = getAllTasks()
    return allTasks.filter((task) => task.parentId === parentId)
  }

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("mntask-tasks")
    const savedPending = localStorage.getItem("mntask-pending")

    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks).map((task: any, index: number) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        order: task.order ?? index,
        type: task.type || "action", // 为旧数据设置默认类型
      }))
      setTasks(parsedTasks)
    } else {
      // Initialize with sample tasks
      const sampleTasks: Task[] = [
        {
          id: "1",
          title: "提取评论如果是行内链接的话，也要进行相应处理！",
          description:
            "需要检查评论中的行内链接格式，确保在提取过程中能够正确识别和处理这些链接，避免丢失重要的引用信息。",
          completed: false,
          isFocusTask: true,
          isPriorityFocus: true,
          priority: "low",
          status: "in-progress",
          type: "action",
          createdAt: new Date(),
          order: 0,
          progress: "2025/01/28 12:00:00 提取评论如果是行内链接的话，也要进行相应处理！",
          category: "开发 MarginNote 插件",
          parentId: "project-1",
        },
        {
          id: "2",
          title: "Bug: 查找后会复制一个 ID",
          description:
            "在执行查找操作后，系统会意外复制一个ID到剪贴板，这可能会干扰用户的正常工作流程。需要调试并修复这个问题。",
          completed: false,
          isFocusTask: true,
          isPriorityFocus: false,
          priority: "low",
          status: "paused",
          type: "action",
          createdAt: new Date(),
          order: 1,
          progress:
            "2025/01/28 11:30:00 relative; padding-left:28px; margin:14px 0; color:#1E40AF; font-weight:500; font-size:0.92em",
          category: "开发 MarginNote 插件",
          parentId: "project-1",
        },
      ]
      setTasks(sampleTasks)
    }

    if (savedPending) {
      const parsedPending = JSON.parse(savedPending).map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        type: task.type || "action", // 为旧数据设置默认类型
      }))
      setPendingTasks(parsedPending)
    } else {
      // Initialize with sample pending task
      const samplePending: Task[] = [
        {
          id: "project-1",
          title: "开发 MNUtils 插件",
          description: "开发一个功能强大的 MarginNote 工具插件，包含多种实用功能。",
          completed: false,
          isFocusTask: false,
          isPriorityFocus: false,
          priority: "high",
          status: "todo",
          type: "project",
          createdAt: new Date(),
          category: "开发 MarginNote 插件",
        },
        {
          id: "pending-1",
          title: "思路卡片的标题要修改前缀！",
          description: "当前思路卡片的标题前缀不够清晰，需要重新设计一个更直观的前缀格式，帮助用户快速识别卡片类型。",
          completed: false,
          isFocusTask: false,
          isPriorityFocus: false,
          priority: "medium",
          status: "todo",
          type: "action",
          createdAt: new Date(),
          category: "开发 MarginNote 插件",
          parentId: "project-1",
        },
        {
          id: "pending-2",
          title: "完成 MNTask 任务管理系统",
          description: "开发一个完整的任务管理系统，包含焦点任务、待处理任务、进度跟踪等功能模块。",
          completed: false,
          isFocusTask: false,
          isPriorityFocus: false,
          priority: "high",
          status: "todo",
          type: "project",
          createdAt: new Date(),
          category: "个人项目",
        },
        {
          id: "pending-3",
          title: "每月完成 5 个高质量插件功能",
          description: "通过持续开发和优化，确保每个月都能交付 5 个经过充分测试的插件功能。",
          completed: false,
          isFocusTask: false,
          isPriorityFocus: false,
          priority: "high",
          status: "todo",
          type: "key-result",
          createdAt: new Date(),
          category: "工作目标",
        },
        {
          id: "pending-4",
          title: "成为 MarginNote 插件开发专家",
          description: "通过深入学习和实践，掌握 MarginNote 插件开发的各种技术和最佳实践，成为该领域的专家。",
          completed: false,
          isFocusTask: false,
          isPriorityFocus: false,
          priority: "medium",
          status: "todo",
          type: "objective",
          createdAt: new Date(),
          category: "职业发展",
        },
      ]
      setPendingTasks(samplePending)
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("mntask-tasks", JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem("mntask-pending", JSON.stringify(pendingTasks))
  }, [pendingTasks])

  const focusTasksCount = tasks.filter((task) => task.isFocusTask && !task.completed).length
  const priorityFocusCount = tasks.filter((task) => task.isPriorityFocus && !task.completed).length

  const togglePriorityFocus = (taskId: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          if (task.isFocusTask) {
            const newIsPriorityFocus = !task.isPriorityFocus
            return {
              ...task,
              isPriorityFocus: newIsPriorityFocus,
              order: newIsPriorityFocus ? -1 : task.order,
            }
          }
          return task
        } else {
          return {
            ...task,
            isPriorityFocus: false,
            order: task.order === -1 ? 0 : task.order,
          }
        }
      }),
    )
  }

  const toggleFocusTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    if (task.isFocusTask) {
      // 移出焦点 - 将任务移到待处理列表
      const updatedTask = {
        ...task,
        isFocusTask: false,
        isPriorityFocus: false,
        order: undefined,
        status: "todo" as const, // 重置状态为待办
      }

      setTasks(tasks.filter((t) => t.id !== taskId))
      setPendingTasks([...pendingTasks, updatedTask])
    } else {
      // 这个分支不应该被调用，因为待处理任务应该使用 addToFocus
      console.warn("toggleFocusTask called on non-focus task")
    }
  }

  const toggleTaskStatus = (taskId: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
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

          return {
            ...task,
            status: newStatus,
            completed: newStatus === "completed",
          }
        }
        return task
      }),
    )
  }

  const startTask = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: "in-progress" as const,
              completed: false,
            }
          : task,
      ),
    )
  }

  const pauseTask = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: "paused" as const,
            }
          : task,
      ),
    )
  }

  const resumeTask = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: "in-progress" as const,
            }
          : task,
      ),
    )
  }

  const completeTask = (taskId: string) => {
    setTasks(
      tasks.map((task) => (task.id === taskId ? { ...task, completed: true, status: "completed" as const } : task)),
    )
  }

  const deleteTask = (taskId: string) => {
    // 删除任务时，需要处理子任务
    const allTasks = getAllTasks()
    const childTasks = getChildTasks(taskId)

    if (childTasks.length > 0) {
      // 如果有子任务，将子任务的父任务ID清空
      setTasks(
        tasks
          .map((task) => (task.parentId === taskId ? { ...task, parentId: undefined } : task))
          .filter((task) => task.id !== taskId),
      )

      setPendingTasks(
        pendingTasks
          .map((task) => (task.parentId === taskId ? { ...task, parentId: undefined } : task))
          .filter((task) => task.id !== taskId),
      )
    } else {
      setTasks(tasks.filter((task) => task.id !== taskId))
    }
  }

  const deletePendingTask = (taskId: string) => {
    // 删除任务时，需要处理子任务
    const allTasks = getAllTasks()
    const childTasks = getChildTasks(taskId)

    if (childTasks.length > 0) {
      // 如果有子任务，将子任务的父任务ID清空
      setTasks(tasks.map((task) => (task.parentId === taskId ? { ...task, parentId: undefined } : task)))

      setPendingTasks(
        pendingTasks
          .map((task) => (task.parentId === taskId ? { ...task, parentId: undefined } : task))
          .filter((task) => task.id !== taskId),
      )
    } else {
      setPendingTasks(pendingTasks.filter((task) => task.id !== taskId))
    }
  }

  const addProgress = (taskId: string, progress: string) => {
    // Update focus tasks
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const newProgressEntry = {
            id: Date.now().toString(),
            content: progress,
            timestamp: new Date(),
            type: "progress" as const,
          }

          return {
            ...task,
            progress: progress,
            progressHistory: [...(task.progressHistory || []), newProgressEntry],
            updatedAt: new Date(),
          }
        }
        return task
      }),
    )

    // Update pending tasks
    setPendingTasks(
      pendingTasks.map((task) => {
        if (task.id === taskId) {
          const newProgressEntry = {
            id: Date.now().toString(),
            content: progress,
            timestamp: new Date(),
            type: "progress" as const,
          }

          return {
            ...task,
            progress: progress,
            progressHistory: [...(task.progressHistory || []), newProgressEntry],
            updatedAt: new Date(),
          }
        }
        return task
      }),
    )
  }

  const addToPending = () => {
    if (!newTaskTitle.trim()) return

    const newTask: Task = {
      id: `pending-${Date.now()}`,
      title: newTaskTitle.trim(),
      completed: false,
      isFocusTask: false,
      isPriorityFocus: false,
      priority: "low",
      status: "todo",
      type: "action", // 默认类型为动作
      createdAt: new Date(),
    }
    setPendingTasks([...pendingTasks, newTask])
    setNewTaskTitle("")
  }

  const addToFocus = (taskId: string) => {
    const taskToMove = pendingTasks.find((task) => task.id === taskId)
    if (taskToMove) {
      const maxOrder = Math.max(...tasks.filter((t) => t.isFocusTask && !t.isPriorityFocus).map((t) => t.order || 0), 0)
      const focusTask = {
        ...taskToMove,
        isFocusTask: true,
        status: "in-progress" as const,
        order: maxOrder + 1,
      }
      setTasks([...tasks, focusTask])
      setPendingTasks(pendingTasks.filter((task) => task.id !== taskId))
    }
  }

  const removePendingTask = (taskId: string) => {
    setPendingTasks(pendingTasks.filter((task) => task.id !== taskId))
  }

  const selectFocusTasks = () => {
    setIsSelectionMode(!isSelectionMode)
    setSelectedPendingTasks([])
  }

  const clearFocusTasks = () => {
    // 将所有焦点任务移回待处理列表
    const focusTasksToMove = tasks
      .filter((task) => task.isFocusTask)
      .map((task) => ({
        ...task,
        isFocusTask: false,
        isPriorityFocus: false,
        order: undefined,
        status: "todo" as const,
      }))

    const nonFocusTasks = tasks.filter((task) => !task.isFocusTask)

    setTasks(nonFocusTasks)
    setPendingTasks([...pendingTasks, ...focusTasksToMove])
  }

  const resetData = () => {
    setTasks([])
    setPendingTasks([])
    localStorage.removeItem("mntask-tasks")
    localStorage.removeItem("mntask-pending")
    setShowResetConfirm(false)
    toast.success("数据已重置")
  }

  const handleResetClick = () => {
    setShowResetConfirm(true)
  }

  const openTaskDetails = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId) || pendingTasks.find((t) => t.id === taskId)
    if (task) {
      setSelectedTask(task) // 确保设置最新的任务数据
      setIsDetailsModalOpen(true)
    }
  }

  const locateTask = (taskId: string) => {
    console.log("Locate task:", taskId)
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
    console.log("Launch task in external software:", taskId)
    // 这里可以添加启动外部软件的逻辑
    // 比如打开特定的应用程序或网页链接
  }

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    // 更新焦点任务
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task)))
    // 更新待处理任务
    setPendingTasks(pendingTasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task)))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addToPending()
    }
  }

  // 排序逻辑：优先焦点任务 -> 焦点任务(按order) -> 普通任务(按创建时间)
  const sortedTasks = [...tasks.filter((task) => !task.completed)].sort((a, b) => {
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

  const updateProgress = (taskId: string, progressId: string, content: string) => {
    // 更新焦点任务
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          const updatedProgressHistory =
            task.progressHistory?.map((progress) =>
              progress.id === progressId ? { ...progress, content } : progress,
            ) || []
          return { ...task, progressHistory: updatedProgressHistory, updatedAt: new Date() }
        }
        return task
      }),
    )

    // 更新待处理任务
    setPendingTasks((prevPendingTasks) =>
      prevPendingTasks.map((task) => {
        if (task.id === taskId) {
          const updatedProgressHistory =
            task.progressHistory?.map((progress) =>
              progress.id === progressId ? { ...progress, content } : progress,
            ) || []
          return { ...task, progressHistory: updatedProgressHistory, updatedAt: new Date() }
        }
        return task
      }),
    )

    // 如果当前选中的任务就是被修改的任务，也要更新选中任务的状态
    if (selectedTask && selectedTask.id === taskId) {
      const updatedProgressHistory =
        selectedTask.progressHistory?.map((progress) =>
          progress.id === progressId ? { ...progress, content } : progress,
        ) || []
      setSelectedTask({
        ...selectedTask,
        progressHistory: updatedProgressHistory,
        updatedAt: new Date(),
      })
    }
  }

  const deleteProgress = (taskId: string, progressId: string) => {
    // 更新焦点任务
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          const updatedProgressHistory = task.progressHistory?.filter((progress) => progress.id !== progressId) || []
          const updatedTask = { ...task, progressHistory: updatedProgressHistory, updatedAt: new Date() }

          // 如果这是当前选中的任务，同时更新选中任务状态
          if (selectedTask && selectedTask.id === taskId) {
            setSelectedTask(updatedTask)
          }

          return updatedTask
        }
        return task
      }),
    )

    // 更新待处理任务
    setPendingTasks((prevPendingTasks) =>
      prevPendingTasks.map((task) => {
        if (task.id === taskId) {
          const updatedProgressHistory = task.progressHistory?.filter((progress) => progress.id !== progressId) || []
          const updatedTask = { ...task, progressHistory: updatedProgressHistory, updatedAt: new Date() }

          // 如果这是当前选中的任务，同时更新选中任务状态
          if (selectedTask && selectedTask.id === taskId) {
            setSelectedTask(updatedTask)
          }

          return updatedTask
        }
        return task
      }),
    )
  }

  const toggleTaskSelection = (taskId: string) => {
    setSelectedPendingTasks((prev) => (prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]))
  }

  const addSelectedToFocus = () => {
    selectedPendingTasks.forEach((taskId) => {
      const taskToMove = pendingTasks.find((task) => task.id === taskId)
      if (taskToMove) {
        const maxOrder = Math.max(
          ...tasks.filter((t) => t.isFocusTask && !t.isPriorityFocus).map((t) => t.order || 0),
          0,
        )
        const focusTask = {
          ...taskToMove,
          isFocusTask: true,
          status: "in-progress" as const,
          order: maxOrder + selectedPendingTasks.indexOf(taskId) + 1,
        }
        setTasks((prev) => [...prev, focusTask])
      }
    })

    setPendingTasks((prev) => prev.filter((task) => !selectedPendingTasks.includes(task.id)))
    setSelectedPendingTasks([])
    setIsSelectionMode(false)
  }

  const exportData = () => {
    try {
      const exportData: ExportData = {
        version: "1.0.0",
        exportDate: new Date().toISOString(),
        focusTasks: tasks,
        pendingTasks: pendingTasks,
        totalTasks: tasks.length + pendingTasks.length,
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
      // 处理日期字段
      const processedFocusTasks = importData.focusTasks.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: task.updatedAt ? new Date(task.updatedAt) : undefined,
        progressHistory:
          task.progressHistory?.map((entry: any) => ({
            ...entry,
            timestamp: new Date(entry.timestamp),
          })) || [],
      }))

      const processedPendingTasks = importData.pendingTasks.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: task.updatedAt ? new Date(task.updatedAt) : undefined,
        progressHistory:
          task.progressHistory?.map((entry: any) => ({
            ...entry,
            timestamp: new Date(entry.timestamp),
          })) || [],
      }))

      setTasks(processedFocusTasks)
      setPendingTasks(processedPendingTasks)
      setShowImportConfirm(false)
      setImportData(null)

      toast.success(`数据导入成功！共导入 ${importData.totalTasks} 个任务`)
    } catch (error) {
      console.error("Import failed:", error)
      toast.error("导入失败，请重试")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />

      {/* 隐藏的文件输入 */}
      <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileChange} style={{ display: "none" }} />

      {/* 主内容区域 - 添加顶部间距以避免与固定header重叠 */}
      <div className="pt-20 flex" style={{ minHeight: "calc(100vh - 80px)" }}>
        <Sidebar
          focusTasksCount={focusTasksCount}
          pendingTasksCount={pendingTasks.length}
          isSelectionMode={isSelectionMode}
          onAddToPending={addToPending}
          onSelectFocusTasks={selectFocusTasks}
          onClearFocusTasks={clearFocusTasks}
          onResetData={handleResetClick}
          onExportData={exportData}
          onImportData={handleImportClick}
        />

        <div className="flex-1 p-6 ml-64 overflow-y-auto">
          {/* 焦点任务区域 */}
          {focusTasks.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-6">
                <Target className="w-5 h-5 text-red-400" />
                <h2 className="text-xl font-semibold text-white">焦点任务</h2>
                <Badge className="bg-red-500/20 text-red-300 border-red-500/30">{focusTasksCount}</Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {focusTasks.map((task) => {
                  const allTasks = getAllTasks()
                  const taskPath = generateTaskPath(task, allTasks)
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-400" />
                <h2 className="text-xl font-semibold text-white">待处理任务</h2>
                <Badge className="bg-slate-700 text-slate-300 border-slate-600">共 {pendingTasks.length} 项</Badge>
              </div>
            </div>

            {isSelectionMode && (
              <div className="flex items-center justify-between bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-4">
                  <span className="text-white text-sm">已选择 {selectedPendingTasks.length} 个任务</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPendingTasks(pendingTasks.map((task) => task.id))}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                  >
                    全选
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPendingTasks([])}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                  >
                    清空
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsSelectionMode(false)
                      setSelectedPendingTasks([])
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
                  <Input
                    placeholder="快速添加任务... (输入后按Enter)"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  />
                  <Button onClick={addToPending} className="bg-purple-600 hover:bg-purple-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    添加
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              {pendingTasks.map((task) => {
                const allTasks = getAllTasks()
                const taskPath = generateTaskPath(task, allTasks)
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
                      onAddToFocus={addToFocus}
                      onLocateTask={locateTask}
                      onLaunchTask={launchTask}
                      onAddProgress={addProgress}
                    />
                  </div>
                )
              })}

              {pendingTasks.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>暂无待处理任务</p>
                  <p className="text-sm">使用上方输入框快速添加新任务</p>
                </div>
              )}
            </div>
          </div>
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
        allTasks={getAllTasks()}
      />
      <AlertDialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <AlertDialogContent className="bg-slate-800 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">确认重置数据</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              此操作将永久删除所有任务数据，包括：
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>所有焦点任务</li>
                <li>所有待处理任务</li>
                <li>任务进展记录</li>
                <li>任务历史数据</li>
              </ul>
              <strong className="text-red-400 block mt-2">此操作无法撤销！</strong>
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
