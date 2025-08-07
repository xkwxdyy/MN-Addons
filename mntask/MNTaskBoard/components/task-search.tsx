"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { Command } from "cmdk"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Task } from "@/types/task"
import { 
  Search, 
  Target, 
  Clock, 
  CheckCircle2, 
  Circle, 
  PauseCircle,
  AlertCircle,
  Tag,
  Calendar,
  Inbox,
  Eye,
  History,
  TrendingUp,
  Filter,
  X,
  ArrowRight,
  Hash
} from "lucide-react"
import { cn } from "@/lib/utils"

interface TaskSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tasks: Task[]
  onSelectTask: (task: Task) => void
  onQuickAction?: (task: Task, action: "complete" | "pause" | "resume" | "delete") => void
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "todo":
      return <Circle className="w-4 h-4 text-slate-400" />
    case "in-progress":
      return <Clock className="w-4 h-4 text-blue-400" />
    case "paused":
      return <PauseCircle className="w-4 h-4 text-yellow-400" />
    case "completed":
      return <CheckCircle2 className="w-4 h-4 text-green-400" />
    default:
      return <Circle className="w-4 h-4 text-slate-400" />
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "action":
      return <ArrowRight className="w-4 h-4 text-purple-400" />
    case "project":
      return <Target className="w-4 h-4 text-blue-400" />
    case "key-result":
      return <TrendingUp className="w-4 h-4 text-green-400" />
    case "objective":
      return <Eye className="w-4 h-4 text-orange-400" />
    default:
      return <Circle className="w-4 h-4 text-slate-400" />
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "text-red-400"
    case "medium":
      return "text-yellow-400"
    case "low":
      return "text-slate-400"
    default:
      return "text-slate-400"
  }
}

const getTypeLabel = (type: string) => {
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

const getStatusLabel = (status: string) => {
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
}

export function TaskSearch({ 
  open, 
  onOpenChange, 
  tasks, 
  onSelectTask,
  onQuickAction 
}: TaskSearchProps) {
  const [search, setSearch] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<{
    type: string[]
    status: string[]
    priority: string[]
    location: string[]
    tags: string[]
  }>({
    type: [],
    status: [],
    priority: [],
    location: [],
    tags: []
  })
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  // Load search history
  useEffect(() => {
    const history = localStorage.getItem("mntask-search-history")
    if (history) {
      setSearchHistory(JSON.parse(history))
    }
  }, [])

  // Save search to history
  const saveToHistory = useCallback((query: string) => {
    if (!query.trim()) return
    const history = [...searchHistory]
    const index = history.indexOf(query)
    if (index > -1) {
      history.splice(index, 1)
    }
    history.unshift(query)
    const newHistory = history.slice(0, 5)
    setSearchHistory(newHistory)
    localStorage.setItem("mntask-search-history", JSON.stringify(newHistory))
  }, [searchHistory])

  // Get all unique tags from tasks
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    tasks.forEach(task => {
      task.tags?.forEach(tag => tags.add(tag))
    })
    return Array.from(tags)
  }, [tasks])

  // Filter tasks based on search and filters
  const filteredTasks = useMemo(() => {
    let filtered = tasks

    // Apply text search
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(task => {
        const titleMatch = task.title.toLowerCase().includes(searchLower)
        const descMatch = task.description?.toLowerCase().includes(searchLower)
        const tagMatch = task.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        return titleMatch || descMatch || tagMatch
      })
    }

    // Apply type filter
    if (selectedFilters.type.length > 0) {
      filtered = filtered.filter(task => selectedFilters.type.includes(task.type))
    }

    // Apply status filter
    if (selectedFilters.status.length > 0) {
      filtered = filtered.filter(task => selectedFilters.status.includes(task.status))
    }

    // Apply priority filter
    if (selectedFilters.priority.length > 0) {
      filtered = filtered.filter(task => selectedFilters.priority.includes(task.priority))
    }

    // Apply location filter
    if (selectedFilters.location.length > 0) {
      filtered = filtered.filter(task => {
        const locations: string[] = []
        if (task.isFocusTask) locations.push("focus")
        if (task.isInPending) locations.push("pending")
        if (task.isInInbox) locations.push("inbox")
        return selectedFilters.location.some(loc => locations.includes(loc))
      })
    }

    // Apply tag filter
    if (selectedFilters.tags.length > 0) {
      filtered = filtered.filter(task => 
        task.tags?.some(tag => selectedFilters.tags.includes(tag))
      )
    }

    // Sort by relevance and date
    filtered.sort((a, b) => {
      // Priority tasks first
      if (a.isPriorityFocus && !b.isPriorityFocus) return -1
      if (!a.isPriorityFocus && b.isPriorityFocus) return 1
      
      // Then by status (in-progress > todo > paused > completed)
      const statusOrder = { "in-progress": 0, "todo": 1, "paused": 2, "completed": 3 }
      const statusDiff = statusOrder[a.status] - statusOrder[b.status]
      if (statusDiff !== 0) return statusDiff
      
      // Finally by date
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return filtered
  }, [tasks, search, selectedFilters])

  // Group tasks by type
  const groupedTasks = useMemo(() => {
    const groups: Record<string, Task[]> = {}
    filteredTasks.forEach(task => {
      if (!groups[task.type]) {
        groups[task.type] = []
      }
      groups[task.type].push(task)
    })
    return groups
  }, [filteredTasks])

  const toggleFilter = (filterType: keyof typeof selectedFilters, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(v => v !== value)
        : [...prev[filterType], value]
    }))
  }

  const clearFilters = () => {
    setSelectedFilters({
      type: [],
      status: [],
      priority: [],
      location: [],
      tags: []
    })
  }

  const hasActiveFilters = Object.values(selectedFilters).some(arr => arr.length > 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 bg-slate-900/95 backdrop-blur-sm border-slate-700">
        <Command className="rounded-lg border-0">
          <div className="flex items-center border-b border-slate-700 px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 text-slate-400" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="搜索任务..."
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm text-white outline-none placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-7 px-2 text-xs text-slate-300 hover:text-white"
                >
                  清除筛选
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "h-7 px-2 text-slate-400 hover:text-white",
                  showFilters && "bg-slate-800 text-white"
                )}
              >
                <Filter className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="border-b border-slate-700 p-3 space-y-2">
              {/* Type filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-500">类型:</span>
                {["action", "project", "key-result", "objective"].map(type => (
                  <Button
                    key={type}
                    variant={selectedFilters.type.includes(type) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleFilter("type", type)}
                    className={cn(
                      "h-6 px-2 text-xs",
                      selectedFilters.type.includes(type) ? "text-white" : "text-slate-300 hover:text-white"
                    )}
                  >
                    {getTypeLabel(type)}
                  </Button>
                ))}
              </div>

              {/* Status filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-500">状态:</span>
                {["todo", "in-progress", "paused", "completed"].map(status => (
                  <Button
                    key={status}
                    variant={selectedFilters.status.includes(status) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleFilter("status", status)}
                    className={cn(
                      "h-6 px-2 text-xs",
                      selectedFilters.status.includes(status) ? "text-white" : "text-slate-300 hover:text-white"
                    )}
                  >
                    {getStatusLabel(status)}
                  </Button>
                ))}
              </div>

              {/* Priority filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-500">优先级:</span>
                {["high", "medium", "low"].map(priority => (
                  <Button
                    key={priority}
                    variant={selectedFilters.priority.includes(priority) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleFilter("priority", priority)}
                    className={cn(
                      "h-6 px-2 text-xs",
                      selectedFilters.priority.includes(priority) ? "text-white" : "text-slate-300 hover:text-white"
                    )}
                  >
                    {priority === "high" ? "高" : priority === "medium" ? "中" : "低"}
                  </Button>
                ))}
              </div>

              {/* Location filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-500">位置:</span>
                {[
                  { value: "focus", label: "焦点任务" },
                  { value: "pending", label: "待处理" },
                  { value: "inbox", label: "收件箱" }
                ].map(loc => (
                  <Button
                    key={loc.value}
                    variant={selectedFilters.location.includes(loc.value) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleFilter("location", loc.value)}
                    className={cn(
                      "h-6 px-2 text-xs",
                      selectedFilters.location.includes(loc.value) ? "text-white" : "text-slate-300 hover:text-white"
                    )}
                  >
                    {loc.label}
                  </Button>
                ))}
              </div>

              {/* Tag filters */}
              {allTags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-slate-500">标签:</span>
                  {allTags.map(tag => (
                    <Button
                      key={tag}
                      variant={selectedFilters.tags.includes(tag) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleFilter("tags", tag)}
                      className={cn(
                        "h-6 px-2 text-xs flex items-center",
                        selectedFilters.tags.includes(tag) ? "text-white" : "text-slate-300 hover:text-white"
                      )}
                    >
                      <Hash className="w-3 h-3 mr-1" />
                      <span>{tag}</span>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}

          <Command.List className="max-h-[400px] overflow-y-auto p-2">
            {/* Search history */}
            {!search && searchHistory.length > 0 && (
              <Command.Group heading="搜索历史" className="[&_[cmdk-group-heading]]:text-slate-400 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1">
                {searchHistory.map((query, index) => (
                  <Command.Item
                    key={index}
                    value={query}
                    onSelect={() => setSearch(query)}
                    className="flex items-center gap-2 p-2 rounded-md cursor-pointer text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <History className="w-4 h-4 text-slate-500" />
                    <span className="text-sm">{query}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Search results */}
            {search || hasActiveFilters ? (
              filteredTasks.length === 0 ? (
                <div className="py-6 text-center text-sm text-slate-500">
                  没有找到匹配的任务
                </div>
              ) : (
                Object.entries(groupedTasks).map(([type, tasks]) => (
                  <Command.Group key={type} heading={getTypeLabel(type)} className="[&_[cmdk-group-heading]]:text-slate-400 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1">
                    {tasks.slice(0, 10).map((task) => (
                      <Command.Item
                        key={task.id}
                        value={`${task.title} ${task.description || ""} ${task.tags?.join(" ") || ""}`}
                        onSelect={() => {
                          saveToHistory(search)
                          onSelectTask(task)
                          onOpenChange(false)
                        }}
                        className="flex items-center justify-between p-2 rounded-md cursor-pointer text-slate-300 hover:bg-slate-800 hover:text-white mb-1"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          {getTypeIcon(task.type)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-white">
                                {task.title}
                              </span>
                              {task.isPriorityFocus && (
                                <Badge variant="destructive" className="text-xs px-1 py-0">
                                  重点
                                </Badge>
                              )}
                              <span className={cn("text-xs", getPriorityColor(task.priority))}>
                                {task.priority === "high" ? "高" : task.priority === "medium" ? "中" : "低"}
                              </span>
                            </div>
                            {task.description && (
                              <p className="text-xs text-slate-500 line-clamp-1 mt-1">
                                {task.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              {getStatusIcon(task.status)}
                              <span className="text-xs text-slate-500">
                                {getStatusLabel(task.status)}
                              </span>
                              {task.tags && task.tags.length > 0 && (
                                <div className="flex items-center gap-1">
                                  {task.tags.map(tag => (
                                    <Badge key={tag} variant="outline" className="text-xs px-1 py-0 text-slate-300 border-slate-600">
                                      #{tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Quick actions */}
                        {onQuickAction && (
                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            {task.status !== "completed" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  onQuickAction(task, "complete")
                                  onOpenChange(false)
                                }}
                                className="h-6 w-6 p-0"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                              </Button>
                            )}
                            {task.status === "in-progress" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  onQuickAction(task, "pause")
                                  onOpenChange(false)
                                }}
                                className="h-6 w-6 p-0"
                              >
                                <PauseCircle className="w-3 h-3" />
                              </Button>
                            )}
                            {task.status === "paused" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  onQuickAction(task, "resume")
                                  onOpenChange(false)
                                }}
                                className="h-6 w-6 p-0"
                              >
                                <Clock className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        )}
                      </Command.Item>
                    ))}
                  </Command.Group>
                ))
              )
            ) : (
              <div className="py-6 text-center text-sm text-slate-400">
                输入关键词搜索任务，或使用筛选器
              </div>
            )}
          </Command.List>

          <div className="border-t border-slate-700 px-3 py-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <span>
                  <kbd className="px-1 py-0.5 bg-slate-800 rounded">↑↓</kbd> 导航
                </span>
                <span>
                  <kbd className="px-1 py-0.5 bg-slate-800 rounded">Enter</kbd> 选择
                </span>
                <span>
                  <kbd className="px-1 py-0.5 bg-slate-800 rounded">Esc</kbd> 关闭
                </span>
              </div>
              <span>
                找到 {filteredTasks.length} 个任务
              </span>
            </div>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  )
}