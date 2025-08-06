/**
 * Custom hook for managing perspectives and filtering logic.
 * Extracted from mntask-board.tsx for better separation of concerns.
 */

import { useState, useEffect, useRef } from "react"
import type { Task, Perspective, PerspectiveFilter, FilterRule, FilterCondition, FilterOperator } from "@/types/task"
import { toast } from "sonner"
import { apiStorage } from "@/services/apiStorage"

/**
 * Get filter summary text for display.
 */
function getFilterSummary(filters: PerspectiveFilter): string {
  const parts: string[] = []

  if (filters.tags.length > 0) {
    parts.push(`标签: ${filters.tags.join(", ")}`)
  }

  if (filters.taskTypes.length > 0 && filters.taskTypes.length < 4) {
    parts.push(`类型: ${filters.taskTypes.join(", ")}`)
  }

  if (filters.statuses.length > 0 && filters.statuses.length < 4) {
    parts.push(`状态: ${filters.statuses.join(", ")}`)
  }

  if (filters.priorities.length > 0 && filters.priorities.length < 3) {
    parts.push(`优先级: ${filters.priorities.join(", ")}`)
  }

  if (filters.focusTask !== "all") {
    parts.push(filters.focusTask === "focus" ? "焦点任务" : "非焦点任务")
  }

  if (filters.priorityFocus !== "all") {
    parts.push(filters.priorityFocus === "priority" ? "优先焦点" : "非优先焦点")
  }

  return parts.length > 0 ? parts.join(" | ") : "无筛选"
}

export function usePerspectives() {
  // Perspective state
  const [perspectives, setPerspectives] = useState<Perspective[]>([])
  const [focusSelectedPerspectiveId, setFocusSelectedPerspectiveId] = useState<string | null>(null)
  const [kanbanSelectedPerspectiveId, setKanbanSelectedPerspectiveId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Load perspectives and selected IDs from API storage
  useEffect(() => {
    const loadPerspectivesData = async () => {
      setIsLoading(true)
      try {
        const data = await apiStorage.loadData()
        
        // Load perspectives
        if (data.perspectives && data.perspectives.length > 0) {
          setPerspectives(data.perspectives)
        }
        
        // Try to load selected perspectives from localStorage (UI state)
        const savedFocusSelectedPerspective = localStorage.getItem("mntask-focus-selected-perspective")
        const savedKanbanSelectedPerspective = localStorage.getItem("mntask-kanban-selected-perspective")
        
        if (savedFocusSelectedPerspective) {
          setFocusSelectedPerspectiveId(savedFocusSelectedPerspective)
        }
        
        if (savedKanbanSelectedPerspective) {
          setKanbanSelectedPerspectiveId(savedKanbanSelectedPerspective)
        }
      } catch (error) {
        console.error('Failed to load perspectives:', error)
        toast.error('Failed to load perspectives')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadPerspectivesData()
  }, [])

  // Save perspectives to API storage (debounced)
  useEffect(() => {
    if (isLoading) return
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        // Use updateData to only update perspectives
        await apiStorage.updateData({
          perspectives
        })
      } catch (error) {
        console.error('Failed to save perspectives:', error)
      }
    }, 1000)
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [perspectives, isLoading])

  // Save selected perspectives to localStorage (UI state only)
  useEffect(() => {
    localStorage.setItem("mntask-focus-selected-perspective", focusSelectedPerspectiveId || "")
    localStorage.setItem("mntask-kanban-selected-perspective", kanbanSelectedPerspectiveId || "")
  }, [focusSelectedPerspectiveId, kanbanSelectedPerspectiveId])

  // CRUD operations
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
    const updatedPerspectives = perspectives.map((p) => 
      p.id === perspectiveId ? { ...p, ...updates } : p
    )
    setPerspectives(updatedPerspectives)
    toast.success("透视更新成功")
  }

  const deletePerspective = (perspectiveId: string) => {
    setPerspectives(perspectives.filter((p) => p.id !== perspectiveId))
    
    // Clear selection if deleted perspective was selected
    if (focusSelectedPerspectiveId === perspectiveId) {
      setFocusSelectedPerspectiveId(null)
    }
    if (kanbanSelectedPerspectiveId === perspectiveId) {
      setKanbanSelectedPerspectiveId(null)
    }
    
    toast.success("透视删除成功")
  }

  // Evaluate a single filter condition against a task
  const evaluateCondition = (task: Task, condition: FilterCondition): boolean => {
    const { field, values, tagMatchMode } = condition
    
    switch (field) {
      case "tags":
        if (!values || values.length === 0) return true
        if (!task.tags || task.tags.length === 0) return false
        
        if (tagMatchMode === "all") {
          // Task must have ALL specified tags
          return values.every(tag => task.tags?.includes(tag))
        } else {
          // Task must have ANY of the specified tags (default behavior)
          return values.some(tag => task.tags?.includes(tag))
        }
        
      case "taskTypes":
        if (!values || values.length === 0) return true
        return values.includes(task.type)
        
      case "statuses":
        if (!values || values.length === 0) return true
        return values.includes(task.status)
        
      case "priorities":
        if (!values || values.length === 0) return true
        return values.includes(task.priority)
        
      case "focusTask":
        if (!values || values.length === 0 || values[0] === "all") return true
        if (values[0] === "focus") return task.isFocusTask
        if (values[0] === "non-focus") return !task.isFocusTask
        return true
        
      case "priorityFocus":
        if (!values || values.length === 0 || values[0] === "all") return true
        if (values[0] === "priority") return task.isPriorityFocus
        if (values[0] === "non-priority") return !task.isPriorityFocus
        return true
        
      default:
        return true
    }
  }

  // Recursively evaluate filter rules (supports nested rule groups)
  const evaluateFilterRule = (task: Task, rule: FilterRule): boolean => {
    const { operator, conditions = [], ruleGroups = [] } = rule
    
    // Evaluate conditions
    const conditionResults = conditions.map(condition => evaluateCondition(task, condition))
    
    // Evaluate nested rule groups recursively
    const ruleGroupResults = ruleGroups.map(ruleGroup => evaluateFilterRule(task, ruleGroup))
    
    // Combine all results
    const allResults = [...conditionResults, ...ruleGroupResults]
    
    if (allResults.length === 0) return true
    
    switch (operator) {
      case "all": // AND
        return allResults.every(result => result)
        
      case "any": // OR
        return allResults.some(result => result)
        
      case "none": // NOT
        return !allResults.some(result => result)
        
      default:
        return true
    }
  }

  // Apply filter rules to tasks (new nested rule system)
  const applyFilterRules = (tasks: Task[], filterRules: FilterRule): Task[] => {
    return tasks.filter(task => evaluateFilterRule(task, filterRules))
  }

  // Apply perspective filter to tasks (legacy system for backward compatibility)
  const applyPerspectiveFilter = (tasks: Task[], filters: PerspectiveFilter): Task[] => {
    return tasks.filter((task) => {
      // Tag filter
      if (filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(
          (tag) => task.tags?.includes(tag)
        )
        if (!hasMatchingTag) return false
      }

      // Task type filter
      if (filters.taskTypes.length > 0) {
        if (!filters.taskTypes.includes(task.type)) return false
      }

      // Status filter
      if (filters.statuses.length > 0) {
        if (!filters.statuses.includes(task.status)) return false
      }

      // Priority filter
      if (filters.priorities.length > 0) {
        if (!filters.priorities.includes(task.priority)) return false
      }

      // Focus task filter
      if (filters.focusTask !== "all") {
        if (filters.focusTask === "focus" && !task.isFocusTask) return false
        if (filters.focusTask === "non-focus" && task.isFocusTask) return false
      }

      // Priority focus filter
      if (filters.priorityFocus !== "all") {
        if (filters.priorityFocus === "priority" && !task.isPriorityFocus) return false
        if (filters.priorityFocus === "non-priority" && task.isPriorityFocus) return false
      }

      return true
    })
  }

  // Get currently selected perspectives
  const getFocusSelectedPerspective = focusSelectedPerspectiveId
    ? perspectives.find((p) => p.id === focusSelectedPerspectiveId)
    : null

  const getKanbanSelectedPerspective = kanbanSelectedPerspectiveId
    ? perspectives.find((p) => p.id === kanbanSelectedPerspectiveId)
    : null

  // Apply perspective filter to task list based on view
  const getFilteredTasks = (taskList: Task[], view: "focus" | "kanban"): Task[] => {
    let selectedPerspective = null
    
    if (view === "focus") {
      selectedPerspective = getFocusSelectedPerspective
    } else if (view === "kanban") {
      selectedPerspective = getKanbanSelectedPerspective
    }

    if (!selectedPerspective) return taskList
    
    // Use new filter rules if available, otherwise fall back to legacy filters
    if (selectedPerspective.filterRules) {
      return applyFilterRules(taskList, selectedPerspective.filterRules)
    } else if (selectedPerspective.filters) {
      return applyPerspectiveFilter(taskList, selectedPerspective.filters)
    }
    
    return taskList
  }

  // Reset perspectives (used when resetting all data)
  const resetPerspectives = async () => {
    setPerspectives([])
    setFocusSelectedPerspectiveId(null)
    setKanbanSelectedPerspectiveId(null)
    
    // Clear UI state from localStorage
    localStorage.removeItem("mntask-focus-selected-perspective")
    localStorage.removeItem("mntask-kanban-selected-perspective")
    
    // Clear from API storage
    try {
      await apiStorage.updateData({
        perspectives: []
      })
    } catch (error) {
      console.error('Failed to reset perspectives:', error)
    }
  }

  return {
    // Loading state
    isLoading,
    
    // State
    perspectives,
    focusSelectedPerspectiveId,
    kanbanSelectedPerspectiveId,
    
    // Setters
    setFocusSelectedPerspectiveId,
    setKanbanSelectedPerspectiveId,
    
    // CRUD operations
    createPerspective,
    updatePerspective,
    deletePerspective,
    
    // Filter operations
    applyPerspectiveFilter,
    applyFilterRules,
    evaluateCondition,
    evaluateFilterRule,
    getFilteredTasks,
    
    // Getters
    getFocusSelectedPerspective,
    getKanbanSelectedPerspective,
    
    // Utilities
    getFilterSummary,
    resetPerspectives,
  }
}