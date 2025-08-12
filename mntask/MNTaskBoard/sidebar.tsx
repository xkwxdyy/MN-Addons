/**
 * Sidebar component for MNTaskBoard.
 * Supports responsive design with drawer for mobile and fixed sidebar for desktop.
 */

"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

interface SidebarProps {
  focusTasksCount: number
  pendingTasksCount: number
  isSelectionMode: boolean
  onAddToPending: () => void
  onSelectFocusTasks: () => void
  onClearFocusTasks: () => void
  onResetData: () => void
  onExportData: () => void
  onImportData: () => void
}

export function Sidebar(props: SidebarProps) {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)

  const SidebarContent = () => (
    <div className="p-4 h-full overflow-y-auto">
      <div className="space-y-4">
        {/* Task counts */}
        <div className="bg-slate-900/50 rounded-lg p-3">
          <div className="text-sm text-slate-400 mb-2">任务统计</div>
          <div className="space-y-2">
            <div className="flex justify-between text-white">
              <span>焦点任务</span>
              <span className="font-bold">{props.focusTasksCount}</span>
            </div>
            <div className="flex justify-between text-white">
              <span>待处理任务</span>
              <span className="font-bold">{props.pendingTasksCount}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={() => {
              props.onSelectFocusTasks()
              if (isMobile) setIsOpen(false)
            }}
            className="w-full px-3 py-3 md:py-2 text-sm bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-white rounded-lg transition-colors min-h-[44px] md:min-h-0"
          >
            {props.isSelectionMode ? "取消选择模式" : "批量选择任务"}
          </button>
          
          <button
            onClick={() => {
              props.onClearFocusTasks()
              if (isMobile) setIsOpen(false)
            }}
            className="w-full px-3 py-3 md:py-2 text-sm bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-white rounded-lg transition-colors min-h-[44px] md:min-h-0"
          >
            清空焦点任务
          </button>
          
          <button
            onClick={() => {
              props.onExportData()
              if (isMobile) setIsOpen(false)
            }}
            className="w-full px-3 py-3 md:py-2 text-sm bg-blue-600 hover:bg-blue-700 active:bg-blue-500 text-white rounded-lg transition-colors min-h-[44px] md:min-h-0"
          >
            导出数据
          </button>
          
          <button
            onClick={() => {
              props.onImportData()
              if (isMobile) setIsOpen(false)
            }}
            className="w-full px-3 py-3 md:py-2 text-sm bg-green-600 hover:bg-green-700 active:bg-green-500 text-white rounded-lg transition-colors min-h-[44px] md:min-h-0"
          >
            导入数据
          </button>
          
          <button
            onClick={() => {
              props.onResetData()
              if (isMobile) setIsOpen(false)
            }}
            className="w-full px-3 py-3 md:py-2 text-sm bg-red-600 hover:bg-red-700 active:bg-red-500 text-white rounded-lg transition-colors min-h-[44px] md:min-h-0"
          >
            重置数据
          </button>
        </div>
      </div>
    </div>
  )

  // Mobile: Drawer with hamburger menu
  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(true)}
          className="fixed left-4 top-24 z-40 md:hidden bg-slate-800/90 backdrop-blur-sm border border-slate-700 w-10 h-10"
        >
          <Menu className="h-5 w-5 text-white" />
        </Button>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0 bg-slate-800 border-slate-700">
            <SheetHeader className="p-4 border-b border-slate-700">
              <SheetTitle className="text-white">菜单</SheetTitle>
            </SheetHeader>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </>
    )
  }

  // Desktop: Fixed sidebar
  return (
    <div className="w-64 bg-slate-800/50 border-r border-slate-700 fixed left-0 top-20 h-[calc(100vh-80px)] overflow-y-auto">
      <SidebarContent />
    </div>
  )
}