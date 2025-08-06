"use client"

import { Button } from "@/components/ui/button"
import { Target, LayoutGrid, Eye, Menu, Inbox, RefreshCw } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  currentView: "focus" | "kanban" | "perspective" | "inbox"
  onViewChange: (view: "focus" | "kanban" | "perspective" | "inbox") => void
  onRefresh?: () => void
  isRefreshing?: boolean
}

export function Header({ currentView, onViewChange, onRefresh, isRefreshing = false }: HeaderProps) {
  const isMobile = useIsMobile()

  const viewOptions = [
    { value: "inbox" as const, label: "收件箱", icon: Inbox },
    { value: "focus" as const, label: "焦点视图", icon: Target },
    { value: "kanban" as const, label: "看板视图", icon: LayoutGrid },
    { value: "perspective" as const, label: "透视视图", icon: Eye },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
      <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
        {/* Logo */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Target className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-white">MNTask</h1>
            <p className="text-xs text-slate-400 hidden md:block">任务管理系统</p>
          </div>
        </div>

        {/* 视图切换和刷新按钮 */}
        <div className="flex items-center gap-2">
          {/* 刷新按钮 */}
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="text-slate-400 hover:text-white hover:bg-slate-700"
              title="刷新数据"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          )}
          
          {/* 视图切换 - 移动端使用下拉菜单，桌面端使用按钮组 */}
          {isMobile ? (
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700"
              >
                {(() => {
                  const currentOption = viewOptions.find((v) => v.value === currentView)
                  if (currentOption) {
                    const Icon = currentOption.icon
                    return (
                      <>
                        <Icon className="w-4 h-4 mr-2" />
                        {currentOption.label}
                      </>
                    )
                  }
                  return null
                })()}
                <Menu className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
              {viewOptions.map((option) => {
                const Icon = option.icon
                return (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => onViewChange(option.value)}
                    className={`text-slate-300 hover:bg-slate-700 ${
                      currentView === option.value ? "bg-slate-700 text-white" : ""
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {option.label}
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg p-1">
            {viewOptions.map((option) => {
              const Icon = option.icon
              return (
                <Button
                  key={option.value}
                  variant={currentView === option.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onViewChange(option.value)}
                  className={`flex items-center gap-2 ${
                    currentView === option.value
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "text-slate-300 hover:text-white hover:bg-slate-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden lg:inline">{option.label}</span>
                </Button>
              )
            })}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}