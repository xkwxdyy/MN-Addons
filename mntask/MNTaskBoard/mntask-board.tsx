"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Header } from "./header"
import { Sidebar } from "./sidebar"
import { TaskCard } from "./task-card"
import { PendingTaskCard } from "./pending-task-card"
import { KanbanBoard } from "./kanban-board"
import { PerspectiveView } from "./perspective-view"
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
  isInPending?: boolean // 是否在待处理列表中显示
  tags?: string[] // 标签数组
  progressHistory?: Array<{
    id: string
    content: string
    timestamp: Date
    type: "progress" | "status" | "comment"
  }>
}

interface PerspectiveFilter {
  tags: string[]
  taskTypes: string[]
  statuses: string[]
  priorities: string[]
  focusTask: string // "all" | "focus" | "non-focus"
  priorityFocus: string // "all" | "priority" | "non-priority"
}

interface Perspective {
  id: string
  name: string
  description?: string
  filters: PerspectiveFilter
  createdAt: Date
}

interface ExportData {
  version: string
  exportDate: string
  focusTasks: Task[]
  pendingTasks: Task[]
  allTasks: Task[]
  totalTasks: number
}

type TaskTypeFilter = "all" | "action" | "project" | "key-result" | "objective"

const sampleTasks: Task[] = [
  {
    id: "1",
    title: "提取评论如果是行内链接的话，也要进行相应处理！",
    description: "需要检查评论中的行内链接格式，确保在提取过程中能够正确识别和处理这些链接，避免丢失重要的引用信息。",
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
    tags: ["bug修复", "链接处理", "紧急"],
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
    tags: ["bug修复", "剪贴板"],
  },
]

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
    isInPending: true,
    tags: ["插件开发", "MarginNote", "工具"],
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
    isInPending: true,
    tags: ["UI优化", "用户体验"],
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
    isInPending: true,
    tags: ["任务管理", "系统开发", "个人项目"],
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
    isInPending: true,
    tags: ["KPI", "质量保证", "月度目标"],
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
    isInPending: true,
    tags: ["学习成长", "专业技能", "长期目标"],
  },
]

// 解析任务标题中的标签语法
const parseTaskTitleWithTags = (input: string): { title: string; tags: string[] } => {
  const tagRegex = /#(?:"([^"]+)"|'([^']+)'|"([^"]+)"|'([^']+)'|【([^】]+)】|（([^）]+)）|([^\s#]+))/g
  const tags: string[] = []
  let match
  let title = input

  while ((match = tagRegex.exec(input)) !== null) {
    const tag = match[1] || match[2] || match[3] || match[4] || match[5] || match[6] || match[7]
    if (tag && tag.trim()) {
      tags.push(tag.trim())
    }
  }

  title = input.replace(tagRegex, "").trim()
  return { title, tags }
}

// 解析缩进任务列表
const parseIndentedTaskList = (text: string): { title: string; tags: string[]; indentation: number }[] => {
  const lines = text.split("\n").filter((line) => line.trim() !== "")
  return lines.map((line) => {
    const indentationMatch = line.match(/^(\s*)/)
    const indentation = indentationMatch ? Math.floor(indentationMatch[1].length / 2) : 0
    const titleWithTags = line.trim()
    const { title, tags } = parseTaskTitleWithTags(titleWithTags)
    return { title, tags, indentation }
  })
}

export default function MNTaskBoard() {
  const [currentView, setCurrentView] = useState<"focus" | "kanban" | "perspective">("focus")
  const [tasks, setTasks] = useState<Task[]>([])
  const [pendingTasks, setPendingTasks] = useState<Task[]>([])
  const [allTasks, setAllTasks] = useState<Task[]>([]) // 存储所有任务的总列表
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [selectedPendingTasks, setSelectedPendingTasks] = useState<string[]>([])
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showImportConfirm, setShowImportConfirm] = useState(false)
  const [importData, setImportData] = useState<ExportData | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 透视相关状态
  const [perspectives, setPerspectives] = useState<Perspective[]>([])
  const [focusSelectedPerspectiveId, setFocusSelectedPerspectiveId] = useState<string | null>(null)
  const [kanbanSelectedPerspectiveId, setKanbanSelectedPerspectiveId] = useState<string | null>(null)

  // 看板任务类型筛选状态
  const [kanbanTaskTypeFilter, setKanbanTaskTypeFilter] = useState<TaskTypeFilter>("all")

  // 焦点视图待处理任务类型显示控制
  const [showAllPendingTypes, setShowAllPendingTypes] = useState(false)

  // 透视管理函数
  const createPerspective = (perspective: Omit<Perspective, "id" | "createdAt">) => {
    const newPerspective: Perspective = {
      ...perspective,
      id: `perspective-${Date.now()}`,
      createdAt: new Date(),
    }
    setPerspectives([...perspectives, newPerspective])
    toast.success("透视创建成功")
    return newPerspective
  }

  const updatePerspective = (perspectiveId: string, updates: Partial<Perspective>) => {
    const updatedPerspectives = perspectives.map((p) => (p.id === perspectiveId ? { ...p, ...updates } : p))
    setPerspectives(updatedPerspectives)

    // 如果正在编辑当前选中的透视，更新选中状态
    if (focusSelectedPerspectiveId === perspectiveId) {
      // 透视选择状态会自动保持，因为ID没变
    }

    toast.success("透视更新成功")
  }

  const deletePerspective = (perspectiveId: string) => {
    setPerspectives(perspectives.filter((p) => p.id !== perspectiveId))
    if (focusSelectedPerspectiveId === perspectiveId) {
      setFocusSelectedPerspectiveId(null)
    }
    toast.success("透视删除成功")
  }

  // 生成任务路径
  const generateTaskPath = (task: Task, allTasksList: Task[]): string => {
    if (!task.parentId) {
      return task.category || ""
    }

    const parentTask = allTasksList.find((t) => t.id === task.parentId)
    if (!parentTask) {
      return task.category || ""
    }

    const parentPath = generateTaskPath(parentTask, allTasksList)
    return parentPath ? `${parentPath} >> ${parentTask.title}` : parentTask.title
  }

  // 获取所有任务（包括焦点任务和待处理任务）
  const getAllTasksList = (): Task[] => {
    return allTasks
  }

  // 获取所有已使用的标签
  const getAllTags = (): string[] => {
    const allTagsSet = new Set<string>()
    allTasks.forEach((task) => {
      task.tags?.forEach((tag) => {
        allTagsSet.add(tag)
      })
    })
    return Array.from(allTagsSet).sort()
  }

  // 获取可作为父任务的任务列表（项目类型）
  const getAvailableParentTasks = (currentTaskId?: string): Task[] => {
    const allTasksList = getAllTasksList()
    return allTasksList.filter(
      (task) =>
        task.type === "project" &&
        task.id !== currentTaskId &&
        !isDescendantOf(task.id, currentTaskId || "", allTasksList),
    )
  }

  // 检查是否为子任务（避免循环引用）
  const isDescendantOf = (potentialParentId: string, taskId: string, allTasksList: Task[]): boolean => {
    const task = allTasksList.find((t) => t.id === taskId)
    if (!task || !task.parentId) return false
    if (task.parentId === potentialParentId) return true
    return isDescendantOf(potentialParentId, task.parentId, allTasksList)
  }

  // 获取任务的子任务
  const getChildTasks = (parentId: string): Task[] => {
    const allTasksList = getAllTasksList()
    return allTasksList.filter((task) => task.parentId === parentId)
  }

  // 应用透视筛选
  const applyPerspectiveFilter = (tasks: Task[], filters: PerspectiveFilter): Task[] => {
    return tasks.filter((task) => {
      // 标签筛选
      if (filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some((tag) => task.tags?.includes(tag))
        if (!hasMatchingTag) return false
      }

      // 任务类型筛选
      if (filters.taskTypes.length > 0 && !filters.taskTypes.includes(task.type)) {
        return false
      }

      // 状态筛选
      if (filters.statuses.length > 0 && !filters.statuses.includes(task.status)) {
        return false
      }

      // 优先级筛选
      if (filters.priorities.length > 0 && !filters.priorities.includes(task.priority)) {
        return false
      }

      // 焦点任务筛选
      if (filters.focusTask === "focus" && !task.isFocusTask) return false
      if (filters.focusTask === "non-focus" && task.isFocusTask) return false

      // 优先焦点筛选
      if (filters.priorityFocus === "priority" && !task.isPriorityFocus) return false
      if (filters.priorityFocus === "non-priority" && task.isPriorityFocus) return false

      return true
    })
  }

  // 获取当前选中的透视
  const getFocusSelectedPerspective = focusSelectedPerspectiveId
    ? perspectives.find((p) => p.id === focusSelectedPerspectiveId)
    : null

  const getKanbanSelectedPerspective = kanbanSelectedPerspectiveId
    ? perspectives.find((p) => p.id === kanbanSelectedPerspectiveId)
    : null

  // 应用透视筛选到任务列表
  const getFilteredTasks = (taskList: Task[], view: "focus" | "kanban"): Task[] => {
    let selectedPerspective = null
    if (view === "focus") {
      selectedPerspective = getFocusSelectedPerspective
    } else if (view === "kanban") {
      selectedPerspective = getKanbanSelectedPerspective
    }

    if (!selectedPerspective) return taskList
    return applyPerspectiveFilter(taskList, selectedPerspective.filters)
  }

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("mntask-tasks")
    const savedPending = localStorage.getItem("mntask-pending")
    const savedAllTasks = localStorage.getItem("mntask-all-tasks")
    const savedView = localStorage.getItem("mntask-current-view")
    const savedPerspectives = localStorage.getItem("mntask-perspectives")
    const savedFocusSelectedPerspective = localStorage.getItem("mntask-focus-selected-perspective")
    const savedKanbanSelectedPerspective = localStorage.getItem("mntask-kanban-selected-perspective")

    // 恢复视图状态
    if (savedView && (savedView === "focus" || savedView === "kanban" || savedView === "perspective")) {
      setCurrentView(savedView)
    }

    // 恢复透视数据
    if (savedPerspectives) {
      const parsed = JSON.parse(savedPerspectives).map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt),
      }))
      setPerspectives(parsed)
    }

    // 恢复选中的透视
    if (savedFocusSelectedPerspective) {
      setFocusSelectedPerspectiveId(savedFocusSelectedPerspective)
    }

    if (savedKanbanSelectedPerspective) {
      setKanbanSelectedPerspectiveId(savedKanbanSelectedPerspective)
    }

    if (savedAllTasks) {
      const parsedAllTasks = JSON.parse(savedAllTasks).map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        type: task.type || "action",
        tags: task.tags || [], // 确保标签属性存在
      }))
      setAllTasks(parsedAllTasks)
    }

    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks).map((task: any, index: number) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        order: task.order ?? index,
        type: task.type || "action", // 为旧数据设置默认类型
        tags: task.tags || [], // 确保标签属性存在
      }))
      setTasks(parsedTasks)
    } else {
      // Initialize with sample tasks
      setTasks(sampleTasks)
    }

    if (savedPending) {
      const parsedPending = JSON.parse(savedPending).map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        type: task.type || "action", // 为旧数据设置默认类型
        tags: task.tags || [], // 确保标签属性存在
      }))
      setPendingTasks(parsedPending)
    } else {
      // Initialize with sample pending task
      setPendingTasks(samplePending)
    }

    // 如果没有保存的总任务列表，从焦点任务和待处理任务中构建
    if (!savedAllTasks) {
      const initialAllTasks = [...(sampleTasks || []), ...(samplePending || [])]
      setAllTasks(initialAllTasks)
    }
  }, [])

  // 保存视图状态
  useEffect(() => {
    localStorage.setItem("mntask-current-view", currentView)
  }, [currentView])

  // 保存透视数据
  useEffect(() => {
    localStorage.setItem("mntask-perspectives", JSON.stringify(perspectives))
  }, [perspectives])

  // 保存选中的透视
  useEffect(() => {
    localStorage.setItem("mntask-focus-selected-perspective", focusSelectedPerspectiveId || "")
    localStorage.setItem("mntask-kanban-selected-perspective", kanbanSelectedPerspectiveId || "")
  }, [focusSelectedPerspectiveId, kanbanSelectedPerspectiveId])

  // 同步更新总任务列表
  useEffect(() => {
    const combinedTasks = [...tasks, ...pendingTasks]
    const uniqueTasks = combinedTasks.reduce(
      (acc: Task[], current) => {
        const existingIndex = acc.findIndex((task) => task.id === current.id)
        if (existingIndex >= 0) {
          // 如果任务已存在，更新它
          acc[existingIndex] = current
        } else {
          // 如果任务不存在，添加它
          acc.push(current)
        }
        return acc
      },
      [...allTasks.filter((task) => !combinedTasks.some((ct) => ct.id === task.id))],
    )

    setAllTasks(uniqueTasks)
  }, [tasks, pendingTasks])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("mntask-tasks", JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem("mntask-pending", JSON.stringify(pendingTasks))
  }, [pendingTasks])

  useEffect(() => {
    localStorage.setItem("mntask-all-tasks", JSON.stringify(allTasks))
  }, [allTasks])

  // 应用透视筛选后的任务列表
  const filteredTasks = getFilteredTasks(tasks, "focus")
  const filteredPendingTasks = getFilteredTasks(
    showAllPendingTypes ? pendingTasks : pendingTasks.filter((task) => task.type === "action"),
    "focus",
  )

  const focusTasksCount = filteredTasks.filter((task) => task.isFocusTask && !task.completed).length
  const priorityFocusCount = filteredTasks.filter((task) => task.isPriorityFocus && !task.completed).length

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
        isInPending: true,
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
    const allTasksList = getAllTasksList()
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

      setAllTasks(
        allTasks
          .map((task) => (task.parentId === taskId ? { ...task, parentId: undefined } : task))
          .filter((task) => task.id !== taskId),
      )
    } else {
      setTasks(tasks.filter((task) => task.id !== taskId))
      setPendingTasks(pendingTasks.filter((task) => task.id !== taskId))
      setAllTasks(allTasks.filter((task) => task.id !== taskId))
    }
  }

  const deletePendingTask = (taskId: string) => {
    // 删除任务时，需要处理子任务
    const allTasksList = getAllTasksList()
    const childTasks = getChildTasks(taskId)

    if (childTasks.length > 0) {
      // 如果有子任务，将子任务的父任务ID清空
      setTasks(tasks.map((task) => (task.parentId === taskId ? { ...task, parentId: undefined } : task)))

      setPendingTasks(
        pendingTasks
          .map((task) => (task.parentId === taskId ? { ...task, parentId: undefined } : task))
          .filter((task) => task.id !== taskId),
      )

      setAllTasks(
        allTasks
          .map((task) => (task.parentId === taskId ? { ...task, parentId: undefined } : task))
          .filter((task) => task.id !== taskId),
      )
    } else {
      setPendingTasks(pendingTasks.filter((task) => task.id !== taskId))
      setAllTasks(allTasks.filter((task) => task.id !== taskId))
    }
  }

  // 从待处理列表中移除任务（但不删除任务本身）
  const removeFromPending = (taskId: string) => {
    const taskToRemove = pendingTasks.find((task) => task.id === taskId)
    if (taskToRemove) {
      // 从待处理列表中移除
      setPendingTasks(pendingTasks.filter((task) => task.id !== taskId))

      // 在总任务列表中标记为不在待处理中
      setAllTasks(allTasks.map((task) => (task.id === taskId ? { ...task, isInPending: false } : task)))

      toast.success("任务已从待处理列表中移除")
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

    const parsedLines = parseIndentedTaskList(newTaskTitle)
    if (parsedLines.length === 0) {
      toast.error("请输入任务内容")
      return
    }

    const newTasks: Task[] = []
    const parentStack: { id: string; indentation: number }[] = []

    parsedLines.forEach((line) => {
      while (parentStack.length > 0 && line.indentation <= parentStack[parentStack.length - 1].indentation) {
        parentStack.pop()
      }
      const parentId = parentStack.length > 0 ? parentStack[parentStack.length - 1].id : undefined

      const newTask: Task = {
        id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        title: line.title,
        completed: false,
        isFocusTask: false,
        isPriorityFocus: false,
        priority: "low",
        status: "todo",
        type: "action", // Default type, will be updated
        createdAt: new Date(),
        isInPending: true,
        tags: line.tags,
        parentId: parentId,
      }
      newTasks.push(newTask)
      parentStack.push({ id: newTask.id, indentation: line.indentation })
    })

    // Post-process to set task types to 'project' for tasks with children
    const taskIdsWithChildren = new Set(newTasks.map((t) => t.parentId).filter(Boolean))
    newTasks.forEach((task) => {
      if (taskIdsWithChildren.has(task.id)) {
        task.type = "project"
      }
    })

    setPendingTasks((prev) => [...prev, ...newTasks])
    setNewTaskTitle("")
    toast.success(`成功添加 ${newTasks.length} 个任务`)
  }

  const addTaskToPending = (taskData: Omit<Task, "id" | "createdAt">) => {
    const finalTaskData = { ...taskData }

    // 如果当前有选中的透视，自动应用透视的筛选条件
    if (getFocusSelectedPerspective) {
      const filters = getFocusSelectedPerspective.filters

      // 自动添加透视中的标签（合并而不是覆盖）
      if (filters.tags.length > 0) {
        const existingTags = finalTaskData.tags || []
        const newTags = [...new Set([...existingTags, ...filters.tags])]
        finalTaskData.tags = newTags
      }

      // 如果透视指定了特定的任务类型且原任务没有指定类型，使用透视的类型
      if (filters.taskTypes.length === 1 && !taskData.type) {
        finalTaskData.type = filters.taskTypes[0] as "action" | "project" | "key-result" | "objective"
      }

      // 如果透视指定了特定的优先级且原任务没有指定优先级，使用透视的优先级
      if (filters.priorities.length === 1 && !taskData.priority) {
        finalTaskData.priority = filters.priorities[0] as "low" | "medium" | "high"
      }

      // 如果透视指定了特定的状态且原任务没有指定状态，使用透视的状态
      if (filters.statuses.length === 1 && !taskData.status) {
        finalTaskData.status = filters.statuses[0] as "todo" | "in-progress" | "completed" | "paused"
        finalTaskData.completed = finalTaskData.status === "completed"
      }
    }

    const newTask: Task = {
      ...finalTaskData,
      id: `task-${Date.now()}`,
      createdAt: new Date(),
    }
    setPendingTasks([...pendingTasks, newTask])

    // 显示提示信息
    const appliedTags = newTask.tags || []
    if (appliedTags.length > 0 && getFocusSelectedPerspective && getFocusSelectedPerspective.filters.tags.length > 0) {
      toast.success(`任务已添加并自动应用透视标签: ${appliedTags.join(", ")}`)
    }
  }

  // 修复：支持从待处理任务和总任务列表中添加到焦点
  const addToFocus = (taskId: string) => {
    // 首先从待处理任务中查找
    const taskFromPending = pendingTasks.find((task) => task.id === taskId)
    if (taskFromPending) {
      const maxOrder = Math.max(...tasks.filter((t) => t.isFocusTask && !t.isPriorityFocus).map((t) => t.order || 0), 0)
      const focusTask = {
        ...taskFromPending,
        isFocusTask: true,
        status: "in-progress" as const,
        order: maxOrder + 1,
        isInPending: false,
      }
      setTasks([...tasks, focusTask])
      setPendingTasks(pendingTasks.filter((task) => task.id !== taskId))

      // 同时更新 allTasks 中的任务状态
      setAllTasks(
        allTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                isFocusTask: true,
                status: "in-progress" as const,
                order: maxOrder + 1,
                isInPending: false,
              }
            : task,
        ),
      )

      toast.success("任务已添加到焦点")
      return
    }

    // 如果在待处理任务中没找到，从总任务列表中查找
    const taskFromAll = allTasks.find((task) => task.id === taskId)
    if (taskFromAll && taskFromAll.type === "action" && !taskFromAll.isFocusTask) {
      const maxOrder = Math.max(...tasks.filter((t) => t.isFocusTask && !t.isPriorityFocus).map((t) => t.order || 0), 0)
      const focusTask = {
        ...taskFromAll,
        isFocusTask: true,
        status: "in-progress" as const,
        order: maxOrder + 1,
        isInPending: false,
      }

      // 添加到焦点任务
      setTasks([...tasks, focusTask])

      // 如果任务在待处理列表中，从待处理列表中移除
      if (taskFromAll.isInPending) {
        setPendingTasks(pendingTasks.filter((task) => task.id !== taskId))
      }

      // 更新 allTasks 中的任务状态
      setAllTasks(
        allTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                isFocusTask: true,
                status: "in-progress" as const,
                order: maxOrder + 1,
                isInPending: false,
              }
            : task,
        ),
      )

      toast.success("任务已添加到焦点")
    }
  }

  // 修复：将任务添加到待处理列表
  const addToPendingFromKanban = (taskId: string) => {
    // 从焦点任务中查找
    const taskFromFocus = tasks.find((task) => task.id === taskId)
    if (taskFromFocus && taskFromFocus.type === "action") {
      const pendingTask = {
        ...taskFromFocus,
        isFocusTask: false,
        isPriorityFocus: false,
        order: undefined,
        status: "todo" as const,
        isInPending: true,
      }

      // 从焦点任务中移除
      setTasks(tasks.filter((task) => task.id !== taskId))
      // 添加到待处理任务
      setPendingTasks([...pendingTasks, pendingTask])

      // 重要：同时更新 allTasks 中的任务状态
      setAllTasks(
        allTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                isFocusTask: false,
                isPriorityFocus: false,
                order: undefined,
                status: "todo" as const,
                isInPending: true,
              }
            : task,
        ),
      )

      toast.success("任务已添加到待处理列表")
      return
    }

    // 从总任务列表中查找（可能是其他视图中的任务）
    const taskFromAll = allTasks.find((task) => task.id === taskId)
    if (taskFromAll && taskFromAll.type === "action" && !taskFromAll.isInPending) {
      const pendingTask = {
        ...taskFromAll,
        isFocusTask: false,
        isPriorityFocus: false,
        order: undefined,
        status: "todo" as const,
        isInPending: true,
      }

      // 添加到待处理任务（如果不存在）
      const existsInPending = pendingTasks.some((task) => task.id === taskId)
      if (!existsInPending) {
        setPendingTasks([...pendingTasks, pendingTask])
      }

      // 重要：同时更新 allTasks 中的任务状态
      setAllTasks(
        allTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                isFocusTask: false,
                isPriorityFocus: false,
                order: undefined,
                status: "todo" as const,
                isInPending: true,
              }
            : task,
        ),
      )

      toast.success("任务已添加到待处理列表")
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
        isInPending: true,
      }))

    const nonFocusTasks = tasks.filter((task) => !task.isFocusTask)

    setTasks(nonFocusTasks)
    setPendingTasks([...pendingTasks, ...focusTasksToMove])
  }

  const resetData = () => {
    setTasks([])
    setPendingTasks([])
    setAllTasks([])
    setPerspectives([])
    setFocusSelectedPerspectiveId(null)
    setKanbanSelectedPerspectiveId(null)
    localStorage.removeItem("mntask-tasks")
    localStorage.removeItem("mntask-pending")
    localStorage.removeItem("mntask-all-tasks")
    localStorage.removeItem("mntask-perspectives")
    localStorage.removeItem("mntask-focus-selected-perspective")
    localStorage.removeItem("mntask-kanban-selected-perspective")
    setShowResetConfirm(false)
    toast.success("数据已重置")
  }

  const handleResetClick = () => {
    setShowResetConfirm(true)
  }

  const openTaskDetails = (taskId: string) => {
    const task =
      tasks.find((t) => t.id === taskId) ||
      pendingTasks.find((t) => t.id === taskId) ||
      allTasks.find((t) => t.id === taskId)
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
    // 更新总任务列表
    setAllTasks(allTasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task)))
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      addToPending()
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

    // 更新总任务列表
    setAllTasks((prevAllTasks) =>
      prevAllTasks.map((task) => {
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

    // 更新总任务列表
    setAllTasks((prevAllTasks) =>
      prevAllTasks.map((task) => {
        if (task.id === taskId) {
          const updatedProgressHistory = task.progressHistory?.filter((progress) => progress.id !== progressId) || []
          const updatedTask = { ...task, progressHistory: updatedProgressHistory, updatedAt: new Date() }

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
          isInPending: false,
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
        tags: task.tags || [], // 确保标签属性存在
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
        tags: task.tags || [], // 确保标签属性存在
        progressHistory:
          task.progressHistory?.map((entry: any) => ({
            ...entry,
            timestamp: new Date(entry.timestamp),
          })) || [],
      }))

      const processedAllTasks = (importData.allTasks || [...importData.focusTasks, ...importData.pendingTasks]).map(
        (task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: task.updatedAt ? new Date(task.updatedAt) : undefined,
          tags: task.tags || [], // 确保标签属性存在
          progressHistory:
            task.progressHistory?.map((entry: any) => ({
              ...entry,
              timestamp: new Date(entry.timestamp),
            })) || [],
        }),
      )

      setTasks(processedFocusTasks)
      setPendingTasks(processedPendingTasks)
      setAllTasks(processedAllTasks)
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

        <div className={`flex-1 overflow-y-auto ${currentView === "focus" ? "ml-64 p-6" : ""}`}>
          {currentView === "focus" ? (
            <>
              {/* 透视选择器 */}
              <div className="mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-blue-400" />
                    <span className="text-white font-medium">透视筛选:</span>
                  </div>
                  <Select
                    value={focusSelectedPerspectiveId || "all"}
                    onValueChange={(value) => setFocusSelectedPerspectiveId(value === "all" ? null : value)}
                  >
                    <SelectTrigger className="w-64 bg-slate-800/50 border-slate-700 text-white">
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
                        {filteredTasks.length + filteredPendingTasks.length} 个任务
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
                    <p>筛选条件: {getFilterSummary(getFocusSelectedPerspective.filters)}</p>
                  </div>
                )}
              </div>

              {/* 焦点任务区域 */}
              {focusTasks.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-6">
                    <Target className="w-5 h-5 text-red-400" />
                    <h2 className="text-xl font-semibold text-white">
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-slate-400" />
                    <h2 className="text-xl font-semibold text-white">
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
                        onClick={() => setSelectedPendingTasks(filteredPendingTasks.map((task) => task.id))}
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
                      <Textarea
                        placeholder={`快速添加任务...使用 2 个空格创建层级任务`}
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="flex-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 min-h-[100px] text-sm"
                      />
                      <Button
                        onClick={addToPending}
                        className="bg-purple-600 hover:bg-purple-700 text-white self-start"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        添加
                      </Button>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      提示: 使用缩进创建层级任务。按 (Cmd/Ctrl + Enter) 快速提交。
                    </p>

                    {getFocusSelectedPerspective && (
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
              onUpdateTask={updateTask}
              onOpenDetails={openTaskDetails}
              onDeleteTask={deleteTask}
              onAddToFocus={addToFocus}
              onAddToPending={addToPendingFromKanban}
              onRemoveFromPending={removeFromPending}
              onAddTask={addTaskToPending}
              onPerspectiveChange={setKanbanSelectedPerspectiveId}
              onTaskTypeFilterChange={setKanbanTaskTypeFilter}
            />
          ) : (
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
        onOpenSubtaskDetails={(subtask) => {
          setSelectedTask(subtask)
          // Keep the modal open to show the subtask details
        }}
        onLocateTaskInBoard={(taskId, taskType) => {
          console.log("Locating task:", taskId, "of type:", taskType)

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
            if (perspective) {
              const filteredTasks = applyPerspectiveFilter([taskToLocate], perspective.filters)
              if (filteredTasks.length === 0) {
                setKanbanSelectedPerspectiveId(null)
                console.log("Task not in current perspective, clearing perspective filter")
              }
            }
          }

          // Wait for the view to switch and state to update, then locate the task
          setTimeout(() => {
            console.log("Attempting to locate task element...")

            // Try multiple selectors to find the task
            const selectors = [`[data-task-id="${taskId}"]`, `#task-${taskId}`, `[data-testid="task-${taskId}"]`]

            let taskElement: Element | null = null
            for (const selector of selectors) {
              taskElement = document.querySelector(selector)
              if (taskElement) {
                console.log("Found task element with selector:", selector)
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
              console.log("Task element not found, task might not be visible in current filters")

              // Check if task should be visible
              const shouldBeVisible = taskTypeFilter === "all" || taskToLocate.type === taskTypeFilter
              if (shouldBeVisible) {
                toast.error(`任务已切换到看板视图，但无法定位任务。任务可能不在当前筛选条件中。`)
              } else {
                toast.warning(`已切换到看板视图，请检查任务类型筛选器是否正确设置为"${taskType}"`)
              }
            }
          }, 300) // Increased timeout to ensure state updates
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

// 辅助函数：获取筛选条件摘要
function getFilterSummary(filters: PerspectiveFilter): string {
  const parts: string[] = []

  if (filters.tags.length > 0) {
    parts.push(`标签: ${filters.tags.join(", ")}`)
  }
  if (filters.taskTypes.length > 0) {
    const typeNames = filters.taskTypes.map((type) => {
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
    })
    parts.push(`类型: ${typeNames.join(", ")}`)
  }
  if (filters.statuses.length > 0) {
    const statusNames = filters.statuses.map((status) => {
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
          return status
      }
    })
    parts.push(`状态: ${statusNames.join(", ")}`)
  }
  if (filters.priorities.length > 0) {
    const priorityNames = filters.priorities.map((priority) => {
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
    })
    parts.push(`优先级: ${priorityNames.join(", ")}`)
  }

  return parts.length > 0 ? parts.join(" | ") : "无筛选条件"
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
