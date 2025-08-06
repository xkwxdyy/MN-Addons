/**
 * Task management type definitions.
 */

export type TaskPriority = "low" | "medium" | "high"
export type TaskStatus = "todo" | "in-progress" | "completed" | "paused"
export type TaskType = "action" | "project" | "key-result" | "objective"
export type ViewMode = "focus" | "kanban" | "perspective"
export type TaskTypeFilter = "all" | "action" | "project" | "key-result" | "objective"

export interface ProgressHistoryItem {
  id: string
  content: string
  timestamp: Date
  type: "progress" | "status" | "comment"
}

export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  isFocusTask: boolean
  isPriorityFocus: boolean
  priority: TaskPriority
  status: TaskStatus
  type: TaskType
  createdAt: Date
  updatedAt?: Date
  progress?: string
  category?: string
  order?: number
  parentId?: string // Parent task ID for hierarchical relationships
  isInPending?: boolean // Whether the task appears in pending list
  tags?: string[] // Task tags
  progressHistory?: ProgressHistoryItem[]
}

export interface PerspectiveFilter {
  tags: string[]
  taskTypes: string[]
  statuses: string[]
  priorities: string[]
  focusTask: string // "all" | "focus" | "non-focus"
  priorityFocus: string // "all" | "priority" | "non-priority"
}

export interface Perspective {
  id: string
  name: string
  description?: string
  filters: PerspectiveFilter
  groupBy: "none" | "type" | "status" | "priority"
  createdAt: Date
}

export interface ExportData {
  version: string
  exportDate: string
  focusTasks: Task[]
  pendingTasks: Task[]
  allTasks: Task[]
  totalTasks: number
}