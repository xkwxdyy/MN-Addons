"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, FolderPlus, GripVertical } from "lucide-react"
import type { FilterRule, FilterCondition, FilterOperator, FilterFieldType, TagMatchMode } from "@/types/task"

interface FilterRuleEditorProps {
  rule: FilterRule
  availableTags: string[]
  depth?: number
  onUpdate: (rule: FilterRule) => void
  onDelete?: () => void
  isRoot?: boolean
}

export function FilterRuleEditor({
  rule,
  availableTags,
  depth = 0,
  onUpdate,
  onDelete,
  isRoot = false
}: FilterRuleEditorProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  // Generate unique ID for new rules/conditions
  const generateId = () => `rule-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

  // Update the operator
  const updateOperator = (operator: FilterOperator) => {
    onUpdate({ ...rule, operator })
  }

  // Add a new condition
  const addCondition = () => {
    const newCondition: FilterCondition = {
      field: "tags",
      values: [],
      tagMatchMode: "any"
    }
    const conditions = [...(rule.conditions || []), newCondition]
    onUpdate({ ...rule, conditions })
  }

  // Update a condition
  const updateCondition = (index: number, condition: FilterCondition) => {
    const conditions = [...(rule.conditions || [])]
    conditions[index] = condition
    onUpdate({ ...rule, conditions })
  }

  // Delete a condition
  const deleteCondition = (index: number) => {
    const conditions = (rule.conditions || []).filter((_, i) => i !== index)
    onUpdate({ ...rule, conditions })
  }

  // Add a nested rule group
  const addRuleGroup = () => {
    const newRuleGroup: FilterRule = {
      id: generateId(),
      operator: "all",
      conditions: [],
      ruleGroups: []
    }
    const ruleGroups = [...(rule.ruleGroups || []), newRuleGroup]
    onUpdate({ ...rule, ruleGroups })
  }

  // Update a nested rule group
  const updateRuleGroup = (index: number, ruleGroup: FilterRule) => {
    const ruleGroups = [...(rule.ruleGroups || [])]
    ruleGroups[index] = ruleGroup
    onUpdate({ ...rule, ruleGroups })
  }

  // Delete a nested rule group
  const deleteRuleGroup = (index: number) => {
    const ruleGroups = (rule.ruleGroups || []).filter((_, i) => i !== index)
    onUpdate({ ...rule, ruleGroups })
  }

  // Get operator color
  const getOperatorColor = (operator: FilterOperator) => {
    switch (operator) {
      case "all":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "any":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "none":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/30"
    }
  }

  // Get operator label
  const getOperatorLabel = (operator: FilterOperator) => {
    switch (operator) {
      case "all":
        return "满足所有条件 (AND)"
      case "any":
        return "满足任一条件 (OR)"
      case "none":
        return "不满足任何条件 (NOT)"
      default:
        return operator
    }
  }

  return (
    <Card className={`bg-slate-800/50 border-slate-700 ${depth > 0 ? 'ml-8' : ''}`}>
      <CardContent className="p-4">
        {/* Rule Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <GripVertical className="w-4 h-4 text-slate-500" />
            
            {/* Operator Selector */}
            <Select value={rule.operator} onValueChange={updateOperator}>
              <SelectTrigger className={`w-48 h-8 text-xs ${getOperatorColor(rule.operator)}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all" className="text-white text-xs">
                  满足所有条件 (AND)
                </SelectItem>
                <SelectItem value="any" className="text-white text-xs">
                  满足任一条件 (OR)
                </SelectItem>
                <SelectItem value="none" className="text-white text-xs">
                  不满足任何条件 (NOT)
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Condition/Group Count */}
            {((rule.conditions?.length || 0) + (rule.ruleGroups?.length || 0)) > 0 && (
              <Badge className="bg-slate-700 text-slate-300 text-xs">
                {rule.conditions?.length || 0} 条件, {rule.ruleGroups?.length || 0} 组
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Add Condition Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={addCondition}
              className="h-7 px-2 text-xs text-slate-400 hover:text-white"
            >
              <Plus className="w-3 h-3 mr-1" />
              添加条件
            </Button>

            {/* Add Rule Group Button */}
            {depth < 3 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={addRuleGroup}
                className="h-7 px-2 text-xs text-slate-400 hover:text-white"
              >
                <FolderPlus className="w-3 h-3 mr-1" />
                添加规则组
              </Button>
            )}

            {/* Delete Button (not for root) */}
            {!isRoot && onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="h-7 w-7 p-0 text-slate-400 hover:text-red-400"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Conditions */}
        {rule.conditions && rule.conditions.length > 0 && (
          <div className="space-y-2 mb-4">
            {rule.conditions.map((condition, index) => (
              <FilterConditionEditor
                key={index}
                condition={condition}
                availableTags={availableTags}
                onUpdate={(updated) => updateCondition(index, updated)}
                onDelete={() => deleteCondition(index)}
              />
            ))}
          </div>
        )}

        {/* Nested Rule Groups */}
        {rule.ruleGroups && rule.ruleGroups.length > 0 && (
          <div className="space-y-3">
            {rule.ruleGroups.map((ruleGroup, index) => (
              <FilterRuleEditor
                key={ruleGroup.id}
                rule={ruleGroup}
                availableTags={availableTags}
                depth={depth + 1}
                onUpdate={(updated) => updateRuleGroup(index, updated)}
                onDelete={() => deleteRuleGroup(index)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {(!rule.conditions || rule.conditions.length === 0) && 
         (!rule.ruleGroups || rule.ruleGroups.length === 0) && (
          <div className="text-center py-4 text-slate-500 text-sm">
            点击上方按钮添加条件或规则组
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Filter Condition Editor Component
interface FilterConditionEditorProps {
  condition: FilterCondition
  availableTags: string[]
  onUpdate: (condition: FilterCondition) => void
  onDelete: () => void
}

function FilterConditionEditor({
  condition,
  availableTags,
  onUpdate,
  onDelete
}: FilterConditionEditorProps) {
  const updateField = (field: FilterFieldType) => {
    onUpdate({ ...condition, field, values: [] })
  }

  const updateValues = (values: string[]) => {
    onUpdate({ ...condition, values })
  }

  const toggleValue = (value: string) => {
    const newValues = condition.values.includes(value)
      ? condition.values.filter(v => v !== value)
      : [...condition.values, value]
    updateValues(newValues)
  }

  const updateTagMatchMode = (mode: TagMatchMode) => {
    onUpdate({ ...condition, tagMatchMode: mode })
  }

  // Get field label
  const getFieldLabel = (field: FilterFieldType) => {
    switch (field) {
      case "tags": return "标签"
      case "taskTypes": return "任务类型"
      case "statuses": return "状态"
      case "priorities": return "优先级"
      case "focusTask": return "焦点任务"
      case "priorityFocus": return "优先焦点"
      default: return field
    }
  }

  // Get available values for field
  const getFieldValues = (field: FilterFieldType): (string[] | { value: string; label: string }[]) => {
    switch (field) {
      case "tags":
        return availableTags
      case "taskTypes":
        return [
          { value: "action", label: "动作" },
          { value: "project", label: "项目" },
          { value: "key-result", label: "关键结果" },
          { value: "objective", label: "目标" }
        ]
      case "statuses":
        return [
          { value: "todo", label: "待开始" },
          { value: "in-progress", label: "进行中" },
          { value: "paused", label: "已暂停" },
          { value: "completed", label: "已完成" }
        ]
      case "priorities":
        return [
          { value: "low", label: "低" },
          { value: "medium", label: "中" },
          { value: "high", label: "高" }
        ]
      case "focusTask":
        return [
          { value: "focus", label: "焦点任务" },
          { value: "non-focus", label: "非焦点任务" }
        ]
      case "priorityFocus":
        return [
          { value: "priority", label: "优先焦点" },
          { value: "non-priority", label: "非优先焦点" }
        ]
      default:
        return []
    }
  }

  const fieldValues = getFieldValues(condition.field)
  const isStringArray = condition.field === "tags"

  return (
    <div className="flex items-center gap-2 p-2 bg-slate-700/30 rounded-md">
      {/* Field Selector */}
      <Select value={condition.field} onValueChange={updateField}>
        <SelectTrigger className="w-32 h-7 text-xs bg-slate-700/50 border-slate-600 text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-slate-800 border-slate-700">
          <SelectItem value="tags" className="text-white text-xs">标签</SelectItem>
          <SelectItem value="taskTypes" className="text-white text-xs">任务类型</SelectItem>
          <SelectItem value="statuses" className="text-white text-xs">状态</SelectItem>
          <SelectItem value="priorities" className="text-white text-xs">优先级</SelectItem>
          <SelectItem value="focusTask" className="text-white text-xs">焦点任务</SelectItem>
          <SelectItem value="priorityFocus" className="text-white text-xs">优先焦点</SelectItem>
        </SelectContent>
      </Select>

      {/* Tag Match Mode (only for tags) */}
      {condition.field === "tags" && (
        <Select 
          value={condition.tagMatchMode || "any"} 
          onValueChange={updateTagMatchMode}
        >
          <SelectTrigger className="w-24 h-7 text-xs bg-slate-700/50 border-slate-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="any" className="text-white text-xs">包含任一</SelectItem>
            <SelectItem value="all" className="text-white text-xs">包含所有</SelectItem>
          </SelectContent>
        </Select>
      )}

      {/* Values */}
      <div className="flex-1 flex flex-wrap gap-1">
        {isStringArray ? (
          // Tags as string array
          (fieldValues as string[]).map(tag => (
            <Badge
              key={tag}
              className={`cursor-pointer text-xs ${
                condition.values.includes(tag)
                  ? "bg-blue-500/30 text-blue-300 border-blue-500/50"
                  : "bg-slate-600/50 text-slate-300 border-slate-500/30 hover:bg-slate-500/50"
              }`}
              onClick={() => toggleValue(tag)}
            >
              {tag}
            </Badge>
          ))
        ) : (
          // Other fields with value/label pairs
          (fieldValues as { value: string; label: string }[]).map(option => (
            <Badge
              key={option.value}
              className={`cursor-pointer text-xs ${
                condition.values.includes(option.value)
                  ? "bg-blue-500/30 text-blue-300 border-blue-500/50"
                  : "bg-slate-600/50 text-slate-300 border-slate-500/30 hover:bg-slate-500/50"
              }`}
              onClick={() => toggleValue(option.value)}
            >
              {option.label}
            </Badge>
          ))
        )}
      </div>

      {/* Delete Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        className="h-7 w-7 p-0 text-slate-400 hover:text-red-400"
      >
        <Trash2 className="w-3 h-3" />
      </Button>
    </div>
  )
}