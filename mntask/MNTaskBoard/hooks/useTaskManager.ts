/**
 * Custom hook for managing all task-related operations and state.
 * Extracted from mntask-board.tsx for better separation of concerns.
 */

import { useState, useEffect } from "react"
import type { Task, PerspectiveFilter } from "@/types/task"
import { SAMPLE_TASKS, SAMPLE_PENDING_TASKS } from "@/constants"
import { toast } from "sonner"

// Parse task title with tags
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

// Parse indented task list
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

export function useTaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [pendingTasks, setPendingTasks] = useState<Task[]>([])
  const [allTasks, setAllTasks] = useState<Task[]>([])
  const [selectedPendingTasks, setSelectedPendingTasks] = useState<string[]>([])
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState("")

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("mntask-tasks")
    const savedPending = localStorage.getItem("mntask-pending")
    const savedAllTasks = localStorage.getItem("mntask-all-tasks")

    if (savedAllTasks) {
      const parsedAllTasks = JSON.parse(savedAllTasks).map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: task.updatedAt ? new Date(task.updatedAt) : undefined,
        type: task.type || "action",
        tags: task.tags || [],
      }))
      setAllTasks(parsedAllTasks)
    }

    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks).map((task: any, index: number) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: task.updatedAt ? new Date(task.updatedAt) : undefined,
        order: task.order ?? index,
        type: task.type || "action",
        tags: task.tags || [],
      }))
      setTasks(parsedTasks)
    } else {
      setTasks(SAMPLE_TASKS)
    }

    if (savedPending) {
      const parsedPending = JSON.parse(savedPending).map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: task.updatedAt ? new Date(task.updatedAt) : undefined,
        type: task.type || "action",
        tags: task.tags || [],
      }))
      setPendingTasks(parsedPending)
    } else {
      setPendingTasks(SAMPLE_PENDING_TASKS)
    }

    // If no saved allTasks, build from focus and pending
    if (!savedAllTasks) {
      const initialAllTasks = [...(SAMPLE_TASKS || []), ...(SAMPLE_PENDING_TASKS || [])]
      setAllTasks(initialAllTasks)
    }
  }, [])

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem("mntask-tasks", JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem("mntask-pending", JSON.stringify(pendingTasks))
  }, [pendingTasks])

  useEffect(() => {
    localStorage.setItem("mntask-all-tasks", JSON.stringify(allTasks))
  }, [allTasks])

  // Helper functions
  const getAllTasksList = (): Task[] => {
    return allTasks
  }

  const getAllTags = (): string[] => {
    const allTagsSet = new Set<string>()
    allTasks.forEach((task) => {
      task.tags?.forEach((tag) => {
        allTagsSet.add(tag)
      })
    })
    return Array.from(allTagsSet).sort()
  }

  const isDescendantOf = (potentialParentId: string, taskId: string, allTasksList: Task[]): boolean => {
    const task = allTasksList.find((t) => t.id === taskId)
    if (!task || !task.parentId) return false
    if (task.parentId === potentialParentId) return true
    return isDescendantOf(potentialParentId, task.parentId, allTasksList)
  }

  const getAvailableParentTasks = (currentTaskId?: string): Task[] => {
    const allTasksList = getAllTasksList()
    return allTasksList.filter(
      (task) =>
        task.type === "project" &&
        task.id !== currentTaskId &&
        !isDescendantOf(task.id, currentTaskId || "", allTasksList),
    )
  }

  const getChildTasks = (parentId: string): Task[] => {
    const allTasksList = getAllTasksList()
    return allTasksList.filter((task) => task.parentId === parentId)
  }

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

  // Task operations
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
      // Move out of focus to pending
      const updatedTask = {
        ...task,
        isFocusTask: false,
        isPriorityFocus: false,
        order: undefined,
        status: "todo" as const,
        isInPending: true,
      }

      setTasks(tasks.filter((t) => t.id !== taskId))
      setPendingTasks([...pendingTasks, updatedTask])
      // Also update in allTasks
      setAllTasks(allTasks.map((t) => t.id === taskId ? updatedTask : t))
    } else {
      console.warn("toggleFocusTask called on non-focus task")
    }
  }

  const toggleTaskStatus = (taskId: string) => {
    const updateTask = (task: Task) => {
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
    }

    setTasks(tasks.map(updateTask))
    setPendingTasks(pendingTasks.map(updateTask))
    setAllTasks(allTasks.map(updateTask))
  }

  const startTask = (taskId: string) => {
    const updateTask = (task: Task) =>
      task.id === taskId
        ? {
            ...task,
            status: "in-progress" as const,
            completed: false,
          }
        : task

    setTasks(tasks.map(updateTask))
    setPendingTasks(pendingTasks.map(updateTask))
    setAllTasks(allTasks.map(updateTask))
  }

  const pauseTask = (taskId: string) => {
    const updateTask = (task: Task) =>
      task.id === taskId
        ? {
            ...task,
            status: "paused" as const,
          }
        : task

    setTasks(tasks.map(updateTask))
    setPendingTasks(pendingTasks.map(updateTask))
    setAllTasks(allTasks.map(updateTask))
  }

  const resumeTask = (taskId: string) => {
    const updateTask = (task: Task) =>
      task.id === taskId
        ? {
            ...task,
            status: "in-progress" as const,
          }
        : task

    setTasks(tasks.map(updateTask))
    setPendingTasks(pendingTasks.map(updateTask))
    setAllTasks(allTasks.map(updateTask))
  }

  const completeTask = (taskId: string) => {
    const taskUpdates = {
      completed: true,
      status: "completed" as const,
      isFocusTask: false,
      isPriorityFocus: false,
      order: undefined,
    }

    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, ...taskUpdates } : task)))
    setPendingTasks(pendingTasks.map((task) => (task.id === taskId ? { ...task, ...taskUpdates } : task)))
    setAllTasks(allTasks.map((task) => (task.id === taskId ? { ...task, ...taskUpdates } : task)))
  }

  const deleteTask = (taskId: string) => {
    const childTasks = getChildTasks(taskId)

    if (childTasks.length > 0) {
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
    const childTasks = getChildTasks(taskId)

    if (childTasks.length > 0) {
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

  const removeFromPending = (taskId: string) => {
    const taskToRemove = pendingTasks.find((task) => task.id === taskId)
    if (taskToRemove) {
      setPendingTasks(pendingTasks.filter((task) => task.id !== taskId))
      setAllTasks(allTasks.map((task) => (task.id === taskId ? { ...task, isInPending: false } : task)))
      toast.success("任务已从待处理列表中移除")
    }
  }

  const addProgress = (taskId: string, progress: string) => {
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

  const addToPending = (
    newTaskTitleInput?: string,
    selectedPerspectiveFilters?: PerspectiveFilter,
    selectedPerspectiveName?: string
  ) => {
    const titleToUse = newTaskTitleInput || newTaskTitle
    if (!titleToUse.trim()) return

    const parsedLines = parseIndentedTaskList(titleToUse)
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
        type: "action",
        createdAt: new Date(),
        isInPending: true,
        tags: [...line.tags],
        parentId: parentId,
      }

      // Apply perspective filters if provided
      if (selectedPerspectiveFilters) {
        const filters = selectedPerspectiveFilters

        if (filters.tags.length > 0) {
          const existingTags = newTask.tags || []
          const allTags = [...new Set([...existingTags, ...filters.tags])]
          newTask.tags = allTags
        }

        if (filters.taskTypes.length === 1) {
          newTask.type = filters.taskTypes[0] as "action" | "project" | "key-result" | "objective"
        }

        if (filters.priorities.length === 1) {
          newTask.priority = filters.priorities[0] as "low" | "medium" | "high"
        }

        if (filters.statuses.length === 1) {
          newTask.status = filters.statuses[0] as "todo" | "in-progress" | "completed" | "paused"
          newTask.completed = newTask.status === "completed"
        }
      }

      newTasks.push(newTask)
      parentStack.push({ id: newTask.id, indentation: line.indentation })
    })

    // Set task types to 'project' for tasks with children
    const taskIdsWithChildren = new Set(newTasks.map((t) => t.parentId).filter(Boolean))
    newTasks.forEach((task) => {
      if (taskIdsWithChildren.has(task.id)) {
        task.type = "project"
      }
    })

    setPendingTasks((prev) => [...prev, ...newTasks])
    setAllTasks((prev) => [...prev, ...newTasks])
    if (!newTaskTitleInput) {
      setNewTaskTitle("")
    }

    // Show success message
    if (selectedPerspectiveFilters && selectedPerspectiveName) {
      const appliedConditions: string[] = []

      if (selectedPerspectiveFilters.tags.length > 0) {
        appliedConditions.push(`标签: ${selectedPerspectiveFilters.tags.join(", ")}`)
      }
      if (selectedPerspectiveFilters.taskTypes.length === 1) {
        appliedConditions.push(`类型: ${selectedPerspectiveFilters.taskTypes[0]}`)
      }
      if (selectedPerspectiveFilters.priorities.length === 1) {
        appliedConditions.push(`优先级: ${selectedPerspectiveFilters.priorities[0]}`)
      }
      if (selectedPerspectiveFilters.statuses.length === 1) {
        appliedConditions.push(`状态: ${selectedPerspectiveFilters.statuses[0]}`)
      }

      if (appliedConditions.length > 0) {
        toast.success(`成功添加 ${newTasks.length} 个任务并自动应用透视条件`, {
          description: appliedConditions.join(" | "),
          duration: 4000,
        })
      } else {
        toast.success(`成功添加 ${newTasks.length} 个任务到 ${selectedPerspectiveName} 透视`)
      }
    } else {
      toast.success(`成功添加 ${newTasks.length} 个任务`)
    }
  }

  const addTaskToPending = (
    taskData: Omit<Task, "id" | "createdAt">,
    selectedPerspectiveFilters?: PerspectiveFilter
  ) => {
    const finalTaskData = { ...taskData }

    // Apply perspective filters if provided
    if (selectedPerspectiveFilters) {
      const filters = selectedPerspectiveFilters

      if (filters.tags.length > 0) {
        const existingTags = finalTaskData.tags || []
        const newTags = [...new Set([...existingTags, ...filters.tags])]
        finalTaskData.tags = newTags
      }

      if (filters.taskTypes.length === 1 && !taskData.type) {
        finalTaskData.type = filters.taskTypes[0] as "action" | "project" | "key-result" | "objective"
      }

      if (filters.priorities.length === 1 && !taskData.priority) {
        finalTaskData.priority = filters.priorities[0] as "low" | "medium" | "high"
      }

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
    setAllTasks([...allTasks, newTask])

    const appliedTags = newTask.tags || []
    if (appliedTags.length > 0 && selectedPerspectiveFilters && selectedPerspectiveFilters.tags.length > 0) {
      toast.success(`任务已添加并自动应用透视标签: ${appliedTags.join(", ")}`)
    }
  }

  const addToFocus = (taskId: string) => {
    // First check pending tasks
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

    // Check all tasks
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

      setTasks([...tasks, focusTask])

      if (taskFromAll.isInPending) {
        setPendingTasks(pendingTasks.filter((task) => task.id !== taskId))
      }

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

  const addToPendingFromKanban = (taskId: string) => {
    // Check focus tasks
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

      setTasks(tasks.filter((task) => task.id !== taskId))
      setPendingTasks([...pendingTasks, pendingTask])

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

    // Check all tasks
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

      const existsInPending = pendingTasks.some((task) => task.id === taskId)
      if (!existsInPending) {
        setPendingTasks([...pendingTasks, pendingTask])
      }

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

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => {
      const updated = prev.map((task) => (task.id === taskId ? { ...task, ...updates } : task))
      return updated
    })
    
    setPendingTasks(prev => {
      const updated = prev.map((task) => (task.id === taskId ? { ...task, ...updates } : task))
      return updated
    })
    
    setAllTasks(prev => {
      const updated = prev.map((task) => (task.id === taskId ? { ...task, ...updates } : task))
      return updated
    })
  }

  const updateProgress = (taskId: string, progressId: string, content: string) => {
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
  }

  const deleteProgress = (taskId: string, progressId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          const updatedProgressHistory = task.progressHistory?.filter((progress) => progress.id !== progressId) || []
          return { ...task, progressHistory: updatedProgressHistory, updatedAt: new Date() }
        }
        return task
      }),
    )

    setPendingTasks((prevPendingTasks) =>
      prevPendingTasks.map((task) => {
        if (task.id === taskId) {
          const updatedProgressHistory = task.progressHistory?.filter((progress) => progress.id !== progressId) || []
          return { ...task, progressHistory: updatedProgressHistory, updatedAt: new Date() }
        }
        return task
      }),
    )

    setAllTasks((prevAllTasks) =>
      prevAllTasks.map((task) => {
        if (task.id === taskId) {
          const updatedProgressHistory = task.progressHistory?.filter((progress) => progress.id !== progressId) || []
          return { ...task, progressHistory: updatedProgressHistory, updatedAt: new Date() }
        }
        return task
      }),
    )
  }

  const toggleTaskSelection = (taskId: string) => {
    setSelectedPendingTasks((prev) => (prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]))
  }

  const selectFocusTasks = () => {
    setIsSelectionMode(!isSelectionMode)
    setSelectedPendingTasks([])
  }

  const clearFocusTasks = () => {
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

  const resetData = () => {
    setTasks([])
    setPendingTasks([])
    setAllTasks([])
    localStorage.removeItem("mntask-tasks")
    localStorage.removeItem("mntask-pending")
    localStorage.removeItem("mntask-all-tasks")
    toast.success("数据已重置")
  }

  const importTasks = (focusTasks: Task[], pendingTasksList: Task[], allTasksList?: Task[]) => {
    // Set focus tasks
    setTasks(focusTasks)
    
    // Set pending tasks
    setPendingTasks(pendingTasksList)
    
    // Set all tasks - if not provided, construct from focus and pending
    if (allTasksList) {
      setAllTasks(allTasksList)
    } else {
      // Build allTasks from focus and pending, avoiding duplicates
      const taskMap = new Map<string, Task>()
      
      // Add all focus tasks
      focusTasks.forEach(task => {
        taskMap.set(task.id, task)
      })
      
      // Add all pending tasks
      pendingTasksList.forEach(task => {
        taskMap.set(task.id, task)
      })
      
      setAllTasks(Array.from(taskMap.values()))
    }
    
    // The useEffect hook will automatically save to localStorage
  }

  return {
    // State
    tasks,
    pendingTasks,
    allTasks,
    selectedPendingTasks,
    isSelectionMode,
    newTaskTitle,
    setNewTaskTitle,

    // Helper functions
    getAllTasksList,
    getAllTags,
    getAvailableParentTasks,
    getChildTasks,
    generateTaskPath,

    // Task operations
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
    resetData,
    importTasks,
  }
}