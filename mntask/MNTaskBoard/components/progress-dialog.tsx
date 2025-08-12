"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface ProgressDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (progress: string) => void
  taskTitle?: string
}

export function ProgressDialog({
  open,
  onOpenChange,
  onConfirm,
  taskTitle,
}: ProgressDialogProps) {
  const [progress, setProgress] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setProgress("")
      setIsSubmitting(false)
      // Auto-focus the textarea when dialog opens
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 100)
    }
  }, [open])
  
  const handleSubmit = async () => {
    if (!progress.trim()) return
    
    setIsSubmitting(true)
    await onConfirm(progress.trim())
    setIsSubmitting(false)
    onOpenChange(false)
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Cmd/Ctrl + Enter
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault()
      handleSubmit()
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            添加进展
          </DialogTitle>
          {taskTitle && (
            <p className="text-sm text-slate-400 mt-1">
              任务: {taskTitle}
            </p>
          )}
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="progress" className="text-sm font-medium text-slate-300">
              进展内容
            </Label>
            <Textarea
              ref={textareaRef}
              id="progress"
              placeholder="描述任务进展..."
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[120px] bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
              autoFocus
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-slate-500">
                按 Cmd/Ctrl + Enter 快速提交
              </p>
              <p className="text-xs text-slate-500">
                {progress.length} 字符
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!progress.trim() || isSubmitting}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                提交中...
              </>
            ) : (
              "确认添加"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}