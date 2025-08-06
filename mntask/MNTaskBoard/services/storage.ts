/**
 * Local storage service for persisting application data.
 */

import type { Task, Perspective, ViewMode } from "@/types/task"
import { STORAGE_KEYS } from "@/constants"

export class StorageService {
  /**
   * Save tasks to localStorage.
   */
  static saveTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks))
    } catch (error) {
      console.error("Failed to save tasks:", error)
    }
  }

  /**
   * Load tasks from localStorage.
   */
  static loadTasks(): Task[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS)
      if (!saved) return []
      
      return JSON.parse(saved).map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: task.updatedAt ? new Date(task.updatedAt) : undefined,
        type: task.type || "action",
        tags: task.tags || [],
      }))
    } catch (error) {
      console.error("Failed to load tasks:", error)
      return []
    }
  }

  /**
   * Save pending tasks to localStorage.
   */
  static savePendingTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PENDING, JSON.stringify(tasks))
    } catch (error) {
      console.error("Failed to save pending tasks:", error)
    }
  }

  /**
   * Load pending tasks from localStorage.
   */
  static loadPendingTasks(): Task[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PENDING)
      if (!saved) return []
      
      return JSON.parse(saved).map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: task.updatedAt ? new Date(task.updatedAt) : undefined,
        type: task.type || "action",
        tags: task.tags || [],
        isInPending: true,
      }))
    } catch (error) {
      console.error("Failed to load pending tasks:", error)
      return []
    }
  }

  /**
   * Save all tasks to localStorage.
   */
  static saveAllTasks(tasks: Task[]): void {
    try {
      console.log("Saving allTasks to localStorage, count:", tasks.length)
      if (tasks.length > 0 && tasks[0].description !== undefined) {
        console.log("First task has description:", tasks[0].description)
      }
      localStorage.setItem(STORAGE_KEYS.ALL_TASKS, JSON.stringify(tasks))
    } catch (error) {
      console.error("Failed to save all tasks:", error)
    }
  }

  /**
   * Load all tasks from localStorage.
   */
  static loadAllTasks(): Task[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ALL_TASKS)
      if (!saved) return []
      
      const parsedTasks = JSON.parse(saved).map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: task.updatedAt ? new Date(task.updatedAt) : undefined,
        type: task.type || "action",
        tags: task.tags || [],
      }))
      
      console.log("Loaded allTasks from localStorage, sample task:", parsedTasks[0])
      if (parsedTasks[0]) {
        console.log("First task description:", parsedTasks[0].description)
      }
      
      return parsedTasks
    } catch (error) {
      console.error("Failed to load all tasks:", error)
      return []
    }
  }

  /**
   * Save perspectives to localStorage.
   */
  static savePerspectives(perspectives: Perspective[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PERSPECTIVES, JSON.stringify(perspectives))
    } catch (error) {
      console.error("Failed to save perspectives:", error)
    }
  }

  /**
   * Load perspectives from localStorage.
   */
  static loadPerspectives(): Perspective[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PERSPECTIVES)
      if (!saved) return []
      
      return JSON.parse(saved).map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt),
      }))
    } catch (error) {
      console.error("Failed to load perspectives:", error)
      return []
    }
  }

  /**
   * Save view mode preference.
   */
  static saveViewMode(mode: ViewMode): void {
    try {
      localStorage.setItem(STORAGE_KEYS.VIEW_MODE, mode)
    } catch (error) {
      console.error("Failed to save view mode:", error)
    }
  }

  /**
   * Load view mode preference.
   */
  static loadViewMode(): ViewMode {
    try {
      return (localStorage.getItem(STORAGE_KEYS.VIEW_MODE) as ViewMode) || "focus"
    } catch (error) {
      console.error("Failed to load view mode:", error)
      return "focus"
    }
  }

  /**
   * Save boolean preference.
   */
  static saveBooleanPreference(key: string, value: boolean): void {
    try {
      localStorage.setItem(key, value.toString())
    } catch (error) {
      console.error(`Failed to save preference ${key}:`, error)
    }
  }

  /**
   * Load boolean preference.
   */
  static loadBooleanPreference(key: string, defaultValue: boolean): boolean {
    try {
      const saved = localStorage.getItem(key)
      return saved ? saved === "true" : defaultValue
    } catch (error) {
      console.error(`Failed to load preference ${key}:`, error)
      return defaultValue
    }
  }

  /**
   * Save selected perspective ID.
   */
  static saveSelectedPerspective(key: string, perspectiveId: string | null): void {
    try {
      if (perspectiveId) {
        localStorage.setItem(key, perspectiveId)
      } else {
        localStorage.removeItem(key)
      }
    } catch (error) {
      console.error(`Failed to save selected perspective ${key}:`, error)
    }
  }

  /**
   * Load selected perspective ID.
   */
  static loadSelectedPerspective(key: string): string | null {
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.error(`Failed to load selected perspective ${key}:`, error)
      return null
    }
  }

  /**
   * Clear all stored data.
   */
  static clearAll(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })
    } catch (error) {
      console.error("Failed to clear storage:", error)
    }
  }
}