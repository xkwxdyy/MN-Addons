import type { Perspective, FilterRule } from "@/types/task"

/**
 * Preset smart perspective templates inspired by OmniFocus
 */

// Generate unique ID for perspectives
const generateId = () => `smart-perspective-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

// Today's tasks
const todayTasks: Omit<Perspective, "id" | "createdAt"> = {
  name: "今日任务",
  description: "今天需要处理的所有任务",
  icon: "📅",
  isSmartPerspective: true,
  groupBy: "priority",
  filterRules: {
    id: generateId(),
    operator: "all",
    conditions: [
      {
        field: "statuses",
        values: ["todo", "in-progress"],
      },
      {
        field: "focusTask",
        values: ["focus"],
      }
    ],
    ruleGroups: []
  }
}

// High priority tasks
const highPriorityTasks: Omit<Perspective, "id" | "createdAt"> = {
  name: "高优先级",
  description: "所有高优先级的任务",
  icon: "🔥",
  isSmartPerspective: true,
  groupBy: "type",
  filterRules: {
    id: generateId(),
    operator: "all",
    conditions: [
      {
        field: "priorities",
        values: ["high"],
      },
      {
        field: "statuses",
        values: ["todo", "in-progress"],
      }
    ],
    ruleGroups: []
  }
}

// In-progress projects
const inProgressProjects: Omit<Perspective, "id" | "createdAt"> = {
  name: "进行中项目",
  description: "所有正在进行的项目",
  icon: "🚀",
  isSmartPerspective: true,
  groupBy: "priority",
  filterRules: {
    id: generateId(),
    operator: "all",
    conditions: [
      {
        field: "taskTypes",
        values: ["project"],
      },
      {
        field: "statuses",
        values: ["in-progress"],
      }
    ],
    ruleGroups: []
  }
}

// Paused tasks
const pausedTasks: Omit<Perspective, "id" | "createdAt"> = {
  name: "已暂停",
  description: "所有暂停的任务（需要恢复）",
  icon: "⏸️",
  isSmartPerspective: true,
  groupBy: "type",
  filterRules: {
    id: generateId(),
    operator: "all",
    conditions: [
      {
        field: "statuses",
        values: ["paused"],
      }
    ],
    ruleGroups: []
  }
}

// Untagged tasks
const untaggedTasks: Omit<Perspective, "id" | "createdAt"> = {
  name: "无标签任务",
  description: "还没有添加标签的任务",
  icon: "🏷️",
  isSmartPerspective: true,
  groupBy: "type",
  filterRules: {
    id: generateId(),
    operator: "all",
    conditions: [
      {
        field: "tags",
        values: [],
      },
      {
        field: "statuses",
        values: ["todo", "in-progress"],
      }
    ],
    ruleGroups: []
  }
}

// Complex example: Important but not urgent
const importantNotUrgent: Omit<Perspective, "id" | "createdAt"> = {
  name: "重要非紧急",
  description: "重要但不紧急的任务（目标和关键结果）",
  icon: "🎯",
  isSmartPerspective: true,
  groupBy: "type",
  filterRules: {
    id: generateId(),
    operator: "any",
    conditions: [],
    ruleGroups: [
      {
        id: generateId(),
        operator: "all",
        conditions: [
          {
            field: "taskTypes",
            values: ["objective"],
          },
          {
            field: "statuses",
            values: ["todo", "in-progress"],
          }
        ],
        ruleGroups: []
      },
      {
        id: generateId(),
        operator: "all",
        conditions: [
          {
            field: "taskTypes",
            values: ["key-result"],
          },
          {
            field: "priorities",
            values: ["medium", "low"],
          },
          {
            field: "statuses",
            values: ["todo", "in-progress"],
          }
        ],
        ruleGroups: []
      }
    ]
  }
}

// Quick wins: Small tasks with low effort
const quickWins: Omit<Perspective, "id" | "createdAt"> = {
  name: "快速完成",
  description: "可以快速完成的小任务",
  icon: "⚡",
  isSmartPerspective: true,
  groupBy: "status",
  filterRules: {
    id: generateId(),
    operator: "all",
    conditions: [
      {
        field: "taskTypes",
        values: ["action"],
      },
      {
        field: "priorities",
        values: ["low", "medium"],
      },
      {
        field: "statuses",
        values: ["todo"],
      }
    ],
    ruleGroups: []
  }
}

// Review needed: Completed recently
const recentlyCompleted: Omit<Perspective, "id" | "createdAt"> = {
  name: "最近完成",
  description: "最近完成的任务（用于回顾）",
  icon: "✅",
  isSmartPerspective: true,
  groupBy: "type",
  filterRules: {
    id: generateId(),
    operator: "all",
    conditions: [
      {
        field: "statuses",
        values: ["completed"],
      }
    ],
    ruleGroups: []
  }
}

// Export all smart perspectives
export const SMART_PERSPECTIVES = [
  todayTasks,
  highPriorityTasks,
  inProgressProjects,
  pausedTasks,
  untaggedTasks,
  importantNotUrgent,
  quickWins,
  recentlyCompleted,
]

// Function to create a smart perspective with proper ID and timestamp
export function createSmartPerspective(template: Omit<Perspective, "id" | "createdAt">): Perspective {
  return {
    ...template,
    id: `smart-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    createdAt: new Date(),
  }
}