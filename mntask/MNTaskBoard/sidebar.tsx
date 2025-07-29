"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Plus, Trash2, RotateCcw, Download, Upload } from "lucide-react"

interface SidebarProps {
  focusTasksCount: number
  pendingTasksCount: number
  isSelectionMode?: boolean
  onAddToPending: () => void
  onSelectFocusTasks: () => void
  onClearFocusTasks: () => void
  onResetData: () => void
  onExportData: () => void
  onImportData: () => void
}

export function Sidebar({
  focusTasksCount,
  pendingTasksCount,
  isSelectionMode = false,
  onAddToPending,
  onSelectFocusTasks,
  onClearFocusTasks,
  onResetData,
  onExportData,
  onImportData,
}: SidebarProps) {
  return (
    <div className="w-64 bg-slate-900/30 border-r border-slate-700 p-4 pb-8 space-y-4 fixed h-full overflow-y-auto">
      {/* 统计信息 */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-sm flex items-center gap-2">
            <Target className="w-4 h-4 text-red-400" />
            任务统计
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">焦点任务</span>
            <Badge className="bg-red-500/20 text-red-300 border-red-500/30">{focusTasksCount}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">待处理任务</span>
            <Badge className="bg-slate-700 text-slate-300 border-slate-600">{pendingTasksCount}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* 快速操作 */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-sm flex items-center gap-2">
            <Plus className="w-4 h-4 text-green-400" />
            快速操作
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button onClick={onSelectFocusTasks} className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm">
            <Target className="w-4 h-4 mr-2" />
            {isSelectionMode ? "退出选择模式" : "选择焦点任务"}
          </Button>
          <Button
            onClick={onClearFocusTasks}
            variant="outline"
            className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 text-sm bg-transparent"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            清空焦点任务
          </Button>
        </CardContent>
      </Card>

      {/* 数据管理 */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-sm flex items-center gap-2">
            <Download className="w-4 h-4 text-blue-400" />
            数据管理
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            onClick={onExportData}
            variant="outline"
            className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 text-sm bg-transparent"
          >
            <Download className="w-4 h-4 mr-2" />
            导出数据
          </Button>
          <Button
            onClick={onImportData}
            variant="outline"
            className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 text-sm bg-transparent"
          >
            <Upload className="w-4 h-4 mr-2" />
            导入数据
          </Button>
        </CardContent>
      </Card>

      {/* 危险操作 */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-sm flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-red-400" />
            危险操作
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={onResetData}
            variant="outline"
            className="w-full border-red-600 text-red-400 hover:bg-red-500/10 text-sm bg-transparent"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            重置所有数据
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
