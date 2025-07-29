"use client"
import { useDrag, useDrop } from "react-dnd"
import { TaskCard } from "./task-card"

interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  isFocusTask: boolean
  isPriorityFocus: boolean
  priority: "low" | "medium" | "high"
  status: "todo" | "in-progress" | "completed" | "paused"
  type: "action" | "project" | "key-result" | "objective"
  createdAt: Date
  updatedAt?: Date
  progress?: string
  category?: string
  order?: number
  progressHistory?: Array<{
    id: string
    content: string
    timestamp: Date
    type: "progress" | "status" | "comment"
  }>
}

interface DraggableTaskCardProps {
  task: Task
  index: number
  onMoveTask: (dragIndex: number, hoverIndex: number) => void
  onToggleFocus: (taskId: string) => void
  onTogglePriorityFocus: (taskId: string) => void
  onToggleStatus: (taskId: string) => void
  onComplete: (taskId: string) => void
  onDelete: (taskId: string) => void
  onLocateTask: (taskId: string) => void
  onLaunchTask: (taskId: string) => void
  onOpenDetails: (taskId: string) => void
  onStartTask: (taskId: string) => void
  onPauseTask: (taskId: string) => void
  onResumeTask: (taskId: string) => void
  onAddProgress: (taskId: string, progress: string) => void
}

export function DraggableTaskCard({
  task,
  index,
  onMoveTask,
  onToggleFocus,
  onTogglePriorityFocus,
  onToggleStatus,
  onComplete,
  onDelete,
  onLocateTask,
  onLaunchTask,
  onOpenDetails,
  onStartTask,
  onPauseTask,
  onResumeTask,
  onAddProgress,
}: DraggableTaskCardProps) {
  const [{ isDragging }, drag] = useDrag({
    type: "task",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: "task",
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        onMoveTask(item.index, index)
        item.index = index
      }
    },
  })

  return (
    <div ref={(node) => drag(drop(node))} style={{ opacity: isDragging ? 0.5 : 1 }} className="cursor-move">
      <TaskCard
        task={task}
        onToggleFocus={onToggleFocus}
        onTogglePriorityFocus={onTogglePriorityFocus}
        onToggleStatus={onToggleStatus}
        onComplete={onComplete}
        onDelete={onDelete}
        onLocateTask={onLocateTask}
        onLaunchTask={onLaunchTask}
        onOpenDetails={onOpenDetails}
        onStartTask={onStartTask}
        onPauseTask={onPauseTask}
        onResumeTask={onResumeTask}
        onAddProgress={onAddProgress}
      />
    </div>
  )
}
