/**
 * Application constants and configuration.
 */

import type { Task, TaskPriority, TaskStatus, TaskType } from "@/types/task"

// Storage keys
export const STORAGE_KEYS = {
  TASKS: "mntask-tasks",
  PENDING: "mntask-pending",
  ALL_TASKS: "mntask-all-tasks",
  PERSPECTIVES: "mntask-perspectives",
  VIEW_MODE: "viewMode",
  SHOW_ALL_PENDING_TYPES: "showAllPendingTypes",
  FOCUS_SELECTED_PERSPECTIVE: "focusSelectedPerspective",
  KANBAN_SELECTED_PERSPECTIVE: "kanbanSelectedPerspective",
  PERSPECTIVE_SELECTED: "perspectiveSelectedPerspective",
} as const

// Task type options
export const TASK_TYPE_OPTIONS: { value: TaskType; label: string }[] = [
  { value: "action", label: "动作" },
  { value: "project", label: "项目" },
  { value: "key-result", label: "关键结果" },
  { value: "objective", label: "目标" },
]

// Task status options
export const TASK_STATUS_OPTIONS: { value: TaskStatus; label: string; color: string }[] = [
  { value: "todo", label: "待开始", color: "bg-gray-500" },
  { value: "in-progress", label: "进行中", color: "bg-blue-500" },
  { value: "paused", label: "已暂停", color: "bg-yellow-500" },
  { value: "completed", label: "已完成", color: "bg-green-500" },
]

// Task priority options
export const TASK_PRIORITY_OPTIONS: { value: TaskPriority; label: string; color: string }[] = [
  { value: "low", label: "低", color: "text-gray-500" },
  { value: "medium", label: "中", color: "text-yellow-500" },
  { value: "high", label: "高", color: "text-red-500" },
]

// Export data configuration
export const EXPORT_CONFIG = {
  VERSION: "1.0",
  FILE_NAME_PREFIX: "mntask-export",
} as const

// UI configuration
export const UI_CONFIG = {
  MAX_QUICK_ADD_TASKS: 10,
  DEFAULT_QUICK_ADD_COUNT: 3,
  TOAST_DURATION: 3000,
  MODAL_ANIMATION_DURATION: 300,
} as const

// Sample data for initial setup
export const SAMPLE_TASKS: Task[] = [
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

export const SAMPLE_PENDING_TASKS: Task[] = [
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
    order: 0,
    isInPending: true,
    tags: ["开发", "插件"],
  },
]