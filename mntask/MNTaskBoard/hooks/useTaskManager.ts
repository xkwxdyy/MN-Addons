/**
 * Custom hook for managing all task-related operations and state.
 * Extracted from mntask-board.tsx for better separation of concerns.
 */

import { useState, useEffect, useRef } from "react"
import type { Task, PerspectiveFilter } from "@/types/task"
import { SAMPLE_TASKS, SAMPLE_PENDING_TASKS } from "@/constants"
import { toast } from "sonner"
import { apiStorage } from "@/services/apiStorage"

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
  const [focusTasks, setFocusTasks] = useState<Task[]>([])
  const [pendingTasks, setPendingTasks] = useState<Task[]>([])
  const [inboxTasks, setInboxTasks] = useState<Task[]>([])
  const [allTasks, setAllTasks] = useState<Task[]>([])
  const [selectedPendingTasks, setSelectedPendingTasks] = useState<string[]>([])
  const [selectedInboxTasks, setSelectedInboxTasks] = useState<string[]>([])
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Load focusTasks from API on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const data = await apiStorage.loadData()
        
        // If no data exists, use sample data
        if ((data.focusTasks || data.tasks || []).length === 0 && data.pendingTasks.length === 0 && data.allTasks.length === 0) {
          setFocusTasks(SAMPLE_TASKS)
          setPendingTasks(SAMPLE_PENDING_TASKS)
          setInboxTasks([])
          // allTasks will be set by useEffect
          
          // Save sample data
          await apiStorage.saveData({
            focusTasks: SAMPLE_TASKS,
            pendingTasks: SAMPLE_PENDING_TASKS,
            inboxTasks: [],
            allTasks: [...SAMPLE_TASKS, ...SAMPLE_PENDING_TASKS],
            perspectives: []
          })
        } else {
          setFocusTasks((data.focusTasks || data.tasks || []).map((task: any, index: number) => ({
            ...task,
            order: task.order ?? index,
            type: task.type || "action",
            tags: task.tags || [],
          })))
          setPendingTasks(data.pendingTasks)
          setInboxTasks(data.inboxTasks || [])
          // allTasks will be set by useEffect
        }
      } catch (error) {
        console.error('Failed to load data:', error)
        toast.error('Failed to load data. Using default data.')
        setFocusTasks(SAMPLE_TASKS)
        setPendingTasks(SAMPLE_PENDING_TASKS)
        // allTasks will be set by useEffect
      } finally {
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [])

  // Save focusTasks to API (debounced)
  useEffect(() => {
    if (isLoading) return // Don't save while loading
    
    // Clear any existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    
    // Set new timeout for debounced save
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        // Calculate allTasks instead of using state to avoid circular dependency
        const computedAllTasks = [...focusTasks, ...pendingTasks, ...inboxTasks]
        
        // Use updateData to only update task-related fields
        await apiStorage.updateData({
          focusTasks,
          pendingTasks,
          inboxTasks,
          allTasks: computedAllTasks
        })
      } catch (error) {
        console.error('Failed to save tasks:', error)
      }
    }, 1000) // Debounce for 1 second
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [focusTasks, pendingTasks, inboxTasks, isLoading]) // Removed allTasks from dependencies

  // Sync allTasks state when component focusTasks change
  // This is separate from saving to avoid circular dependency
  useEffect(() => {
    if (isLoading) return // Don't update while loading
    
    // Update allTasks to reflect the current state
    const computedAllTasks = [...focusTasks, ...pendingTasks, ...inboxTasks]
    setAllTasks(computedAllTasks)
  }, [focusTasks, pendingTasks, inboxTasks, isLoading])

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
    setFocusTasks(
      focusTasks.map((task) => {
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
    const task = focusTasks.find((t) => t.id === taskId)
    if (!task) return

    if (task.isFocusTask) {
      // Move out of focus to pending
      const updatedTask = {
        ...task,
        isFocusTask: false,
        isPriorityFocus: false,
        order: undefined,
        status: task.status === "in-progress" ? "paused" as const :
                task.status === "completed" ? "todo" as const :
                task.status === "paused" ? "paused" as const :
                "todo" as const,
        isInPending: true,
      }

      setFocusTasks(focusTasks.filter((t) => t.id !== taskId))
      setPendingTasks([...pendingTasks, updatedTask])
      // allTasks will be automatically synced via useEffect
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

    setFocusTasks(focusTasks.map(updateTask))
    setPendingTasks(pendingTasks.map(updateTask))
    // allTasks will be automatically synced via useEffect
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

    setFocusTasks(focusTasks.map(updateTask))
    setPendingTasks(pendingTasks.map(updateTask))
    // allTasks will be automatically synced via useEffect
  }

  const pauseTask = (taskId: string) => {
    const updateTask = (task: Task) =>
      task.id === taskId
        ? {
            ...task,
            status: "paused" as const,
          }
        : task

    setFocusTasks(focusTasks.map(updateTask))
    setPendingTasks(pendingTasks.map(updateTask))
    // allTasks will be automatically synced via useEffect
  }

  const resumeTask = (taskId: string) => {
    const updateTask = (task: Task) =>
      task.id === taskId
        ? {
            ...task,
            status: "in-progress" as const,
          }
        : task

    setFocusTasks(focusTasks.map(updateTask))
    setPendingTasks(pendingTasks.map(updateTask))
    // allTasks will be automatically synced via useEffect
  }

  const completeTask = (taskId: string) => {
    const taskUpdates = {
      completed: true,
      status: "completed" as const,
      isFocusTask: false,
      isPriorityFocus: false,
      order: undefined,
    }

    setFocusTasks(focusTasks.map((task) => (task.id === taskId ? { ...task, ...taskUpdates } : task)))
    setPendingTasks(pendingTasks.map((task) => (task.id === taskId ? { ...task, ...taskUpdates } : task)))
    // allTasks will be automatically synced via useEffect
  }

  const deleteTask = (taskId: string) => {
    const childTasks = getChildTasks(taskId)

    if (childTasks.length > 0) {
      setFocusTasks(
        focusTasks
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
      setFocusTasks(focusTasks.filter((task) => task.id !== taskId))
      setPendingTasks(pendingTasks.filter((task) => task.id !== taskId))
      // allTasks will be automatically synced via useEffect
    }
  }

  const deletePendingTask = (taskId: string) => {
    const childTasks = getChildTasks(taskId)

    if (childTasks.length > 0) {
      setFocusTasks(focusTasks.map((task) => (task.parentId === taskId ? { ...task, parentId: undefined } : task)))

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
      // allTasks will be automatically synced via useEffect
    }
  }

  const removeFromPending = (taskId: string) => {
    const taskToRemove = pendingTasks.find((task) => task.id === taskId)
    if (taskToRemove) {
      // 从待处理列表中移除
      setPendingTasks(pendingTasks.filter((task) => task.id !== taskId))
      
      // 确保任务存在于 allTasks 中，并更新状态
      setAllTasks(prev => {
        const existsInAll = prev.some(task => task.id === taskId)
        
        if (existsInAll) {
          // 如果已存在，更新其状态
          return prev.map(task => 
            task.id === taskId 
              ? { ...task, isInPending: false }
              : task
          )
        } else {
          // 如果不存在，添加到 allTasks
          console.log(`Task ${taskId} not found in allTasks, adding it`)
          return [...prev, { ...taskToRemove, isInPending: false }]
        }
      })
      
      toast.success("任务已移至任务库")
    }
  }

  const addProgress = (taskId: string, progress: string) => {
    setFocusTasks(
      focusTasks.map((task) => {
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

    setAllTasks(
      allTasks.map((task) => {
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

    // Set task types to 'project' for focusTasks with children
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
      const maxOrder = Math.max(...focusTasks.filter((t) => t.isFocusTask && !t.isPriorityFocus).map((t) => t.order || 0), 0)
      const focusTask = {
        ...taskFromPending,
        isFocusTask: true,
        status: "in-progress" as const,
        order: maxOrder + 1,
        isInPending: false,
      }
      setFocusTasks([...focusTasks, focusTask])
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
    if (taskFromAll && !taskFromAll.isFocusTask) {
      const maxOrder = Math.max(...focusTasks.filter((t) => t.isFocusTask && !t.isPriorityFocus).map((t) => t.order || 0), 0)
      const focusTask = {
        ...taskFromAll,
        isFocusTask: true,
        status: "in-progress" as const,
        order: maxOrder + 1,
        isInPending: false,
      }

      setFocusTasks([...focusTasks, focusTask])

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
    const taskFromFocus = focusTasks.find((task) => task.id === taskId)
    if (taskFromFocus) {
      const pendingTask = {
        ...taskFromFocus,
        isFocusTask: false,
        isPriorityFocus: false,
        order: undefined,
        status: taskFromFocus.status === "in-progress" ? "paused" as const :
                taskFromFocus.status === "completed" ? "todo" as const :
                taskFromFocus.status === "paused" ? "paused" as const :
                "todo" as const,
        isInPending: true,
      }

      setFocusTasks(focusTasks.filter((task) => task.id !== taskId))
      setPendingTasks([...pendingTasks, pendingTask])

      setAllTasks(
        allTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                isFocusTask: false,
                isPriorityFocus: false,
                order: undefined,
                status: taskFromFocus.status === "in-progress" ? "paused" as const :
                        taskFromFocus.status === "completed" ? "todo" as const :
                        taskFromFocus.status === "paused" ? "paused" as const :
                        "todo" as const,
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
    if (taskFromAll && !taskFromAll.isInPending) {
      const pendingTask = {
        ...taskFromAll,
        isFocusTask: false,
        isPriorityFocus: false,
        order: undefined,
        status: taskFromAll.status === "in-progress" ? "paused" as const :
                taskFromAll.status === "completed" ? "todo" as const :
                taskFromAll.status === "paused" ? "paused" as const :
                "todo" as const,
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
                status: taskFromAll.status === "in-progress" ? "paused" as const :
                        taskFromAll.status === "completed" ? "todo" as const :
                        taskFromAll.status === "paused" ? "paused" as const :
                        "todo" as const,
                isInPending: true,
              }
            : task,
        ),
      )

      toast.success("任务已添加到待处理列表")
    }
  }

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setFocusTasks(prev => {
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
    setFocusTasks((prevTasks) =>
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
    setFocusTasks((prevTasks) =>
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
    const focusTasksToMove = focusTasks
      .filter((task) => task.isFocusTask)
      .map((task) => ({
        ...task,
        isFocusTask: false,
        isPriorityFocus: false,
        order: undefined,
        status: "todo" as const,
        isInPending: true,
      }))

    const nonFocusTasks = focusTasks.filter((task) => !task.isFocusTask)

    setFocusTasks(nonFocusTasks)
    setPendingTasks([...pendingTasks, ...focusTasksToMove])
  }

  const addSelectedToFocus = () => {
    selectedPendingTasks.forEach((taskId) => {
      const taskToMove = pendingTasks.find((task) => task.id === taskId)
      if (taskToMove) {
        const maxOrder = Math.max(
          ...focusTasks.filter((t) => t.isFocusTask && !t.isPriorityFocus).map((t) => t.order || 0),
          0,
        )
        const focusTask = {
          ...taskToMove,
          isFocusTask: true,
          status: "in-progress" as const,
          order: maxOrder + selectedPendingTasks.indexOf(taskId) + 1,
          isInPending: false,
        }
        setFocusTasks((prev) => [...prev, focusTask])
      }
    })

    setPendingTasks((prev) => prev.filter((task) => !selectedPendingTasks.includes(task.id)))
    setSelectedPendingTasks([])
    setIsSelectionMode(false)
  }

  const resetData = async () => {
    setFocusTasks([])
    setPendingTasks([])
    setAllTasks([])
    
    // Clear file storage (only task-related data)
    await apiStorage.updateData({
      focusTasks: [],
      pendingTasks: [],
      allTasks: []
    })
    
    toast.success("数据已重置")
  }

  const importTasks = (focusTasks: Task[], pendingTasksList: Task[], allTasksList?: Task[]) => {
    // Set focus tasks
    setFocusTasks(focusTasks)
    
    // Set pending tasks
    setPendingTasks(pendingTasksList)
    
    // Set all focusTasks - if not provided, construct from focus and pending
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
    
    // The useEffect hook will automatically save to API storage
  }

  const refreshData = async () => {
    try {
      const data = await apiStorage.loadData()
      
      setFocusTasks(data.tasks.map((task: any, index: number) => ({
        ...task,
        order: task.order ?? index,
        type: task.type || "action",
        tags: task.tags || [],
      })))
      setPendingTasks(data.pendingTasks)
      setInboxTasks(data.inboxTasks || [])
      
      toast.success("数据已刷新")
      return true
    } catch (error) {
      console.error('Failed to refresh data:', error)
      toast.error('刷新失败，请重试')
      return false
    }
  }

  // Inbox operations
  const addToInbox = (title: string, additionalProps?: Partial<Task>) => {
    const { title: parsedTitle, tags } = parseTaskTitleWithTags(title)
    
    if (!parsedTitle.trim()) {
      toast.error("请输入任务标题")
      return
    }

    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title: parsedTitle,
      completed: false,
      isFocusTask: false,
      isPriorityFocus: false,
      priority: "low",
      status: "todo",
      type: "action",
      isInInbox: true,
      tags: tags.length > 0 ? tags : [],
      createdAt: new Date(),
      progressHistory: [],
      ...additionalProps
    }

    setInboxTasks(prev => [...prev, newTask])
    setAllTasks(prev => [...prev, newTask])
    toast.success("已添加到收件箱")
    return newTask
  }

  const deleteInboxTask = (taskId: string) => {
    setInboxTasks(prev => prev.filter(t => t.id !== taskId))
    setAllTasks(prev => prev.filter(t => t.id !== taskId))
    toast.success("已从收件箱删除")
  }

  const moveFromInboxToFocus = (taskId: string) => {
    const task = inboxTasks.find(t => t.id === taskId)
    if (!task) return

    const updatedTask = { ...task, isFocusTask: true, isInInbox: false }
    setInboxTasks(prev => prev.filter(t => t.id !== taskId))
    setFocusTasks(prev => [...prev, updatedTask])
    setAllTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t))
    toast.success("已移至焦点任务")
  }

  const moveFromInboxToPending = (taskId: string) => {
    const task = inboxTasks.find(t => t.id === taskId)
    if (!task) return

    const updatedTask = { ...task, isInPending: true, isInInbox: false }
    setInboxTasks(prev => prev.filter(t => t.id !== taskId))
    setPendingTasks(prev => [...prev, updatedTask])
    setAllTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t))
    toast.success("已移至待处理任务")
  }

  const moveSelectedFromInbox = (destination: "focus" | "pending") => {
    const selectedTasks = inboxTasks.filter(t => selectedInboxTasks.includes(t.id))
    
    if (selectedTasks.length === 0) {
      toast.error("请先选择任务")
      return
    }

    if (destination === "focus") {
      const updatedTasks = selectedTasks.map(t => ({ ...t, isFocusTask: true, isInInbox: false }))
      setInboxTasks(prev => prev.filter(t => !selectedInboxTasks.includes(t.id)))
      setFocusTasks(prev => [...prev, ...updatedTasks])
      setAllTasks(prev => prev.map(t => {
        const updated = updatedTasks.find(ut => ut.id === t.id)
        return updated || t
      }))
      toast.success(`已将 ${selectedTasks.length} 个任务移至焦点任务`)
    } else {
      const updatedTasks = selectedTasks.map(t => ({ ...t, isInPending: true, isInInbox: false }))
      setInboxTasks(prev => prev.filter(t => !selectedInboxTasks.includes(t.id)))
      setPendingTasks(prev => [...prev, ...updatedTasks])
      setAllTasks(prev => prev.map(t => {
        const updated = updatedTasks.find(ut => ut.id === t.id)
        return updated || t
      }))
      toast.success(`已将 ${selectedTasks.length} 个任务移至待处理`)
    }

    setSelectedInboxTasks([])
  }

  const toggleInboxTaskSelection = (taskId: string) => {
    setSelectedInboxTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    )
  }

  const clearInboxSelection = () => {
    setSelectedInboxTasks([])
  }

  const updateInboxTask = (taskId: string, updates: Partial<Task>) => {
    setInboxTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t))
    setAllTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t))
  }

  return {
    // Loading state
    isLoading,
    
    // State
    focusTasks,
    pendingTasks,
    inboxTasks,
    allTasks,
    selectedPendingTasks,
    selectedInboxTasks,
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
    refreshData,
    
    // Inbox operations
    addToInbox,
    deleteInboxTask,
    moveFromInboxToFocus,
    moveFromInboxToPending,
    moveSelectedFromInbox,
    toggleInboxTaskSelection,
    clearInboxSelection,
    updateInboxTask,
  }
}