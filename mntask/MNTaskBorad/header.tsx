"use client"

import { Target } from "lucide-react"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/50 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6 text-red-400" />
            <h1 className="text-xl font-bold text-white">MNTask</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-400">任务管理系统</div>
        </div>
      </div>
    </header>
  )
}
