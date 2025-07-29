"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Star, Plus, Rocket, Clock, CheckCircle, Circle, Trash2, Calendar } from "lucide-react"

interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  isFocusTask: boolean
  priority: "low" | "medium" | "high"
  status: "todo" | "in-progress" | "completed"
  createdAt: Date
  dueDate?: Date
}

export default function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [filter, setFilter] = useState<"all" | "focus" | "completed">("all")

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("focus-tasks")
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      }))
      setTasks(parsedTasks)
    } else {
      // Initialize with sample tasks
      const sampleTasks: Task[] = [
        {
          id: "1",
          title: "Complete project proposal",
          description: "Finalize the Q1 project proposal document",
          completed: false,
          isFocusTask: true,
          priority: "high",
          status: "in-progress",
          createdAt: new Date(),
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        },
        {
          id: "2",
          title: "Review team feedback",
          description: "Go through all team member feedback from last sprint",
          completed: false,
          isFocusTask: false,
          priority: "medium",
          status: "todo",
          createdAt: new Date(),
        },
        {
          id: "3",
          title: "Update documentation",
          description: "Update API documentation with latest changes",
          completed: true,
          isFocusTask: false,
          priority: "low",
          status: "completed",
          createdAt: new Date(),
        },
        {
          id: "4",
          title: "Prepare presentation slides",
          description: "Create slides for upcoming client meeting",
          completed: false,
          isFocusTask: true,
          priority: "high",
          status: "todo",
          createdAt: new Date(),
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        },
      ]
      setTasks(sampleTasks)
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("focus-tasks", JSON.stringify(tasks))
  }, [tasks])

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle.trim(),
        completed: false,
        isFocusTask: false,
        priority: "medium",
        status: "todo",
        createdAt: new Date(),
      }
      setTasks([newTask, ...tasks])
      setNewTaskTitle("")
    }
  }

  const toggleFocusTask = (taskId: string) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, isFocusTask: !task.isFocusTask } : task)))
  }

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              status: !task.completed ? "completed" : "todo",
            }
          : task,
      ),
    )
  }

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "in-progress":
        return <Rocket className="w-4 h-4 text-blue-500" />
      default:
        return <Circle className="w-4 h-4 text-gray-400" />
    }
  }

  const filteredTasks = tasks.filter((task) => {
    switch (filter) {
      case "focus":
        return task.isFocusTask && !task.completed
      case "completed":
        return task.completed
      default:
        return true
    }
  })

  // Sort tasks: focus tasks first, then by creation date
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.isFocusTask && !b.isFocusTask) return -1
    if (!a.isFocusTask && b.isFocusTask) return 1
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  const focusTasksCount = tasks.filter((task) => task.isFocusTask && !task.completed).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Task Management Board</h1>
          <p className="text-slate-300">Stay focused on what matters most</p>
        </div>

        {/* Focus Tasks Summary */}
        {focusTasksCount > 0 && (
          <Card className="mb-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Focus Tasks</h3>
                  <p className="text-slate-300">
                    You have {focusTasksCount} focus task{focusTasksCount !== 1 ? "s" : ""} to complete
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add New Task */}
        <Card className="mb-6 bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add a new task..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
              <Button onClick={addTask} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-blue-600" : "border-slate-600 text-slate-300 hover:bg-slate-700"}
          >
            All Tasks ({tasks.length})
          </Button>
          <Button
            variant={filter === "focus" ? "default" : "outline"}
            onClick={() => setFilter("focus")}
            className={filter === "focus" ? "bg-amber-600" : "border-slate-600 text-slate-300 hover:bg-slate-700"}
          >
            <Star className="w-4 h-4 mr-1" />
            Focus ({focusTasksCount})
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "outline"}
            onClick={() => setFilter("completed")}
            className={filter === "completed" ? "bg-green-600" : "border-slate-600 text-slate-300 hover:bg-slate-700"}
          >
            Completed ({tasks.filter((t) => t.completed).length})
          </Button>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {sortedTasks.map((task) => (
            <Card
              key={task.id}
              className={`transition-all duration-200 hover:shadow-lg ${
                task.isFocusTask && !task.completed
                  ? "bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30 shadow-amber-500/10"
                  : task.completed
                    ? "bg-slate-800/30 border-slate-700/50 opacity-75"
                    : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Completion Checkbox */}
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTaskCompletion(task.id)}
                    className="mt-1 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                  />

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className={`font-medium ${task.completed ? "text-slate-400 line-through" : "text-white"}`}>
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className={`text-sm mt-1 ${task.completed ? "text-slate-500" : "text-slate-300"}`}>
                            {task.description}
                          </p>
                        )}
                      </div>

                      {/* Focus Star Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFocusTask(task.id)}
                        className={`p-1 h-8 w-8 ${
                          task.isFocusTask
                            ? "text-amber-400 hover:text-amber-300"
                            : "text-slate-500 hover:text-amber-400"
                        }`}
                      >
                        <Star className={`w-4 h-4 ${task.isFocusTask ? "fill-amber-400" : ""}`} />
                      </Button>
                    </div>

                    {/* Task Metadata */}
                    <div className="flex items-center gap-3 mt-3">
                      {/* Status */}
                      <div className="flex items-center gap-1">
                        {getStatusIcon(task.status)}
                        <span className="text-xs text-slate-400 capitalize">{task.status.replace("-", " ")}</span>
                      </div>

                      {/* Priority */}
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                        <span className="text-xs text-slate-400 capitalize">{task.priority}</span>
                      </div>

                      {/* Due Date */}
                      {task.dueDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span className="text-xs text-slate-400">{task.dueDate.toLocaleDateString()}</span>
                        </div>
                      )}

                      {/* Focus Badge */}
                      {task.isFocusTask && (
                        <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs">
                          <Star className="w-3 h-3 mr-1 fill-amber-300" />
                          Focus
                        </Badge>
                      )}

                      {/* Delete Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTask(task.id)}
                        className="p-1 h-6 w-6 ml-auto text-slate-500 hover:text-red-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {sortedTasks.length === 0 && (
            <Card className="bg-slate-800/30 border-slate-700">
              <CardContent className="p-8 text-center">
                <div className="text-slate-400">
                  {filter === "focus" ? (
                    <>
                      <Star className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No focus tasks yet. Click the star icon on any task to mark it as a focus task.</p>
                    </>
                  ) : filter === "completed" ? (
                    <>
                      <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No completed tasks yet. Complete some tasks to see them here.</p>
                    </>
                  ) : (
                    <>
                      <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No tasks yet. Add your first task above to get started.</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
