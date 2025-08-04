"use client"

import { Button } from "@/components/ui/button"
import { Target, LayoutGrid, Eye } from "lucide-react"

interface HeaderProps {
  currentView: "focus" | "kanban" | "perspective"
  onViewChange: (view: "focus" | "kanban" | "perspective") => void
}

export function Header({ currentView, onViewChange }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">MNTask</h1>
            <p className="text-xs text-slate-400">任务管理系统</p>
          </div>
        </div>

        {/* 视图切换 */}
        <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg p-1">
          <Button
            variant={currentView === "focus" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange("focus")}
            className={`flex items-center gap-2 ${
              currentView === "focus"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "text-slate-300 hover:text-white hover:bg-slate-700"
            }`}
          >
            <Target className="w-4 h-4" />
            焦点视图
          </Button>
          <Button
            variant={currentView === "kanban" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange("kanban")}
            className={`flex items-center gap-2 ${
              currentView === "kanban"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "text-slate-300 hover:text-white hover:bg-slate-700"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            看板视图
          </Button>
          <Button
            variant={currentView === "perspective" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange("perspective")}
            className={`flex items-center gap-2 ${
              currentView === "perspective"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "text-slate-300 hover:text-white hover:bg-slate-700"
            }`}
          >
            <Eye className="w-4 h-4" />
            透视视图
          </Button>
        </div>
      </div>
    </header>
  )
}
