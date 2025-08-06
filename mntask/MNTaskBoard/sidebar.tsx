/**
 * Sidebar component for MNTaskBoard.
 */

import type React from "react"

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
  return (
    <div className="w-64 bg-slate-800/50 border-r border-slate-700 p-4 fixed left-0 top-20 h-[calc(100vh-80px)] overflow-y-auto">
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
            onClick={props.onSelectFocusTasks}
            className="w-full px-3 py-2 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            {props.isSelectionMode ? "取消选择模式" : "批量选择任务"}
          </button>
          
          <button
            onClick={props.onClearFocusTasks}
            className="w-full px-3 py-2 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            清空焦点任务
          </button>
          
          <button
            onClick={props.onExportData}
            className="w-full px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            导出数据
          </button>
          
          <button
            onClick={props.onImportData}
            className="w-full px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            导入数据
          </button>
          
          <button
            onClick={props.onResetData}
            className="w-full px-3 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            重置数据
          </button>
        </div>
      </div>
    </div>
  )
}