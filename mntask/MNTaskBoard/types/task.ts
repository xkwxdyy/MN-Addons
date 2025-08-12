/**
 * Task management type definitions.
 */

export type TaskPriority = "low" | "medium" | "high"
export type TaskStatus = "todo" | "in-progress" | "completed" | "paused"
export type TaskType = "action" | "project" | "key-result" | "objective"
export type ViewMode = "focus" | "library" | "perspective" | "inbox" | "recycle"
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
  deletedAt?: Date // When the task was deleted
  isDeleted?: boolean // Whether the task is in recycle bin
  progress?: string
  category?: string
  order?: number
  parentId?: string // Parent task ID for hierarchical relationships
  isInPending?: boolean // Whether the task appears in pending list
  isInInbox?: boolean // Whether the task appears in inbox
  tags?: string[] // Task tags
  progressHistory?: ProgressHistoryItem[]
}

// Filter rule types and operators
export type FilterOperator = "all" | "any" | "none" // Corresponds to AND, OR, NOT
export type FilterFieldType = "tags" | "taskTypes" | "statuses" | "priorities" | "focusTask" | "priorityFocus"
export type TagMatchMode = "all" | "any" // Match all tags or any tag

// Individual filter condition
export interface FilterCondition {
  field: FilterFieldType
  values: string[]
  // For tags, specify whether to match all or any
  tagMatchMode?: TagMatchMode
}

// Filter rule that can contain conditions and nested rule groups
export interface FilterRule {
  id: string
  operator: FilterOperator
  conditions?: FilterCondition[]
  ruleGroups?: FilterRule[] // Nested rule groups for complex logic
}

// Legacy filter interface (for backward compatibility)
export interface PerspectiveFilter {
  tags: string[]
  taskTypes: string[]
  statuses: string[]
  priorities: string[]
  focusTask: string // "all" | "focus" | "non-focus"
  priorityFocus: string // "all" | "priority" | "non-priority"
}

// Enhanced perspective with support for both legacy and new filter formats
export interface Perspective {
  id: string
  name: string
  description?: string
  filters?: PerspectiveFilter // Legacy filter format
  filterRules?: FilterRule // New nested filter rules
  groupBy: "none" | "type" | "status" | "priority"
  createdAt: Date
  isSmartPerspective?: boolean // Flag for preset smart perspectives
  icon?: string // Optional icon for the perspective
}

export interface ExportData {
  version: string
  exportDate: string
  focusTasks: Task[]
  pendingTasks: Task[]
  allTasks: Task[]
  totalTasks: number
}