/**
 * 任务管理器核心类
 * 负责任务的创建、更新、删除等核心业务逻辑
 */

const getTaskManager = () => self

var TaskManager = JSB.defineClass("TaskManager : NSObject", {
  // 初始化
  init: function() {
    let self = getTaskManager()
    self.currentNotebookId = MNUtil.currentNotebookId
    self.tasks = []
    self.isInitialized = false
    
    // 加载配置
    taskConfig.load()
    
    // 初始化任务数据
    self.refreshTasks()
    self.isInitialized = true
    
    if (typeof MNUtil !== "undefined" && MNUtil.log) {
      MNUtil.log("🔧 TaskManager initialized")
    }
    
    return self
  },
  
  // 刷新任务列表
  refreshTasks: function() {
    let self = getTaskManager()
    self.tasks = TaskUtils.getAllTasks(self.currentNotebookId)
    self.sortTasks()
  },
  
  // 排序任务
  sortTasks: function() {
    let self = getTaskManager()
    const sortBy = taskConfig.sortBy || "priority"
    
    self.tasks.sort((a, b) => {
      switch (sortBy) {
        case "priority":
          const priorityOrder = { "高": 0, "中": 1, "低": 2 }
          const aPriority = priorityOrder[TaskUtils.getTaskPriority(a)] || 1
          const bPriority = priorityOrder[TaskUtils.getTaskPriority(b)] || 1
          return aPriority - bPriority
          
        case "dueDate":
          const aDate = TaskUtils.getTaskDueDate(a)
          const bDate = TaskUtils.getTaskDueDate(b)
          if (!aDate && !bDate) return 0
          if (!aDate) return 1
          if (!bDate) return -1
          return aDate.getTime() - bDate.getTime()
          
        case "createDate":
          return new Date(b.createDate) - new Date(a.createDate)
          
        case "status":
          return a.colorIndex - b.colorIndex
          
        default:
          return 0
      }
    })
  },
  
  // 获取分组后的任务
  getGroupedTasks: function() {
    let self = getTaskManager()
    
    const groups = {
      today: [],
      inProgress: [],
      notStarted: [],
      completed: [],
      paused: [],
      cancelled: []
    }
    
    self.tasks.forEach(task => {
      // 今日任务优先
      if (TaskUtils.getTaskType(task) === "TODAY" || task.tags.includes("今日")) {
        groups.today.push(task)
        return
      }
      
      // 按状态分组
      const status = TaskUtils.getTaskStatus(task)
      switch (status) {
        case TaskUtils.TaskStatus.IN_PROGRESS:
          groups.inProgress.push(task)
          break
        case TaskUtils.TaskStatus.NOT_STARTED:
          groups.notStarted.push(task)
          break
        case TaskUtils.TaskStatus.COMPLETED:
          if (taskConfig.showCompleted) {
            groups.completed.push(task)
          }
          break
        case TaskUtils.TaskStatus.PAUSED:
          groups.paused.push(task)
          break
        case TaskUtils.TaskStatus.CANCELLED:
          if (taskConfig.showCancelled) {
            groups.cancelled.push(task)
          }
          break
      }
    })
    
    return groups
  },
  
  // 创建新任务
  createTask: function(config) {
    let self = getTaskManager()
    
    MNUtil.undoGrouping(() => {
      try {
        const taskNote = TaskUtils.createTaskNote(config)
        
        // 添加到当前笔记本
        const focusNote = MNNote.getFocusNote()
        if (focusNote) {
          focusNote.addChild(taskNote)
        }
        
        self.refreshTasks()
        
        MNUtil.showHUD("✅ 任务创建成功")
        
        // 聚焦到新任务
        MNUtil.delay(0.3).then(() => {
          taskNote.focusInMindMap()
        })
        
      } catch (error) {
        MNUtil.addErrorLog(error, "createTask", config)
        MNUtil.showHUD("❌ 创建任务失败")
      }
    })
  },
  
  // 更新任务
  updateTask: function(taskId, updates) {
    let self = getTaskManager()
    
    MNUtil.undoGrouping(() => {
      try {
        const task = MNNote.new(taskId, false)
        if (!task) {
          MNUtil.showHUD("❌ 任务不存在")
          return
        }
        
        // 更新标题
        if (updates.title !== undefined) {
          const type = TaskUtils.getTaskType(task)
          task.noteTitle = TaskUtils.createTaskTitle(updates.title, type)
        }
        
        // 更新状态
        if (updates.status !== undefined) {
          TaskUtils.setTaskStatus(task, updates.status)
          
          // 如果标记为完成，更新标题前缀
          if (updates.status === TaskUtils.TaskStatus.COMPLETED) {
            const taskName = TaskUtils.getTaskName(task)
            task.noteTitle = TaskUtils.createTaskTitle(taskName, "COMPLETED")
          }
        }
        
        // 更新进度
        if (updates.progress !== undefined) {
          const { current, total, unit } = updates.progress
          TaskUtils.updateTaskProgress(task, current, total, unit)
        }
        
        // 更新优先级
        if (updates.priority !== undefined) {
          // 移除旧的优先级标签
          task.removeTags(["高优先级", "低优先级"])
          
          // 添加新的优先级标签
          if (updates.priority === TaskUtils.TaskPriority.HIGH) {
            task.appendTags(["高优先级"])
          } else if (updates.priority === TaskUtils.TaskPriority.LOW) {
            task.appendTags(["低优先级"])
          }
        }
        
        // 更新截止日期
        if (updates.dueDate !== undefined) {
          TaskUtils.setTaskDueDate(task, updates.dueDate)
        }
        
        // 更新描述
        if (updates.description !== undefined) {
          // 查找并更新描述评论（第一个文本评论）
          let found = false
          for (let i = 0; i < task.comments.length; i++) {
            const comment = task.comments[i]
            if (comment.type === "TextNote" && 
                !comment.text.startsWith("进度：") && 
                !comment.text.startsWith("截止日期：")) {
              comment.text = updates.description
              found = true
              break
            }
          }
          if (!found && updates.description) {
            task.appendTextComment(updates.description)
          }
        }
        
        self.refreshTasks()
        MNUtil.showHUD("✅ 任务更新成功")
        
      } catch (error) {
        MNUtil.addErrorLog(error, "updateTask", { taskId, updates })
        MNUtil.showHUD("❌ 更新任务失败")
      }
    })
  },
  
  // 删除任务
  deleteTask: function(taskId) {
    let self = getTaskManager()
    
    MNUtil.undoGrouping(() => {
      try {
        const task = MNNote.new(taskId, false)
        if (!task) {
          MNUtil.showHUD("❌ 任务不存在")
          return
        }
        
        // 确认删除
        MNUtil.confirm(
          "删除任务",
          `确定要删除任务"${TaskUtils.getTaskName(task)}"吗？`,
          ["取消", "删除"]
        ).then(result => {
          if (result === 1) {
            task.delete(true) // 包括子任务一起删除
            self.refreshTasks()
            MNUtil.showHUD("✅ 任务已删除")
          }
        })
        
      } catch (error) {
        MNUtil.addErrorLog(error, "deleteTask", taskId)
        MNUtil.showHUD("❌ 删除任务失败")
      }
    })
  },
  
  // 标记为今日任务
  markAsToday: function(taskId) {
    let self = getTaskManager()
    
    MNUtil.undoGrouping(() => {
      try {
        const task = MNNote.new(taskId, false)
        if (!task) {
          MNUtil.showHUD("❌ 任务不存在")
          return
        }
        
        TaskUtils.markAsToday(task)
        self.refreshTasks()
        MNUtil.showHUD("✅ 已标记为今日任务")
        
      } catch (error) {
        MNUtil.addErrorLog(error, "markAsToday", taskId)
        MNUtil.showHUD("❌ 操作失败")
      }
    })
  },
  
  // 快速更新进度
  quickUpdateProgress: function(taskId) {
    let self = getTaskManager()
    
    const task = MNNote.new(taskId, false)
    if (!task) {
      MNUtil.showHUD("❌ 任务不存在")
      return
    }
    
    const currentProgress = TaskUtils.getTaskProgress(task)
    const current = currentProgress ? currentProgress.current : 0
    const total = currentProgress ? currentProgress.total : 100
    const unit = currentProgress ? currentProgress.unit : ""
    
    // 弹出输入框
    MNUtil.input(
      "更新进度",
      `当前进度：${current}/${total}${unit}`,
      [
        { key: "current", title: "当前值", placeholder: current.toString() },
        { key: "total", title: "总数", placeholder: total.toString() },
        { key: "unit", title: "单位", placeholder: unit || "页/章节/个" }
      ]
    ).then(result => {
      if (result) {
        const newCurrent = parseInt(result.current) || current
        const newTotal = parseInt(result.total) || total
        const newUnit = result.unit || unit
        
        self.updateTask(taskId, {
          progress: {
            current: newCurrent,
            total: newTotal,
            unit: newUnit
          }
        })
      }
    })
  },
  
  // 创建子任务
  createSubtask: function(parentTaskId, config) {
    let self = getTaskManager()
    
    MNUtil.undoGrouping(() => {
      try {
        const parentTask = MNNote.new(parentTaskId, false)
        if (!parentTask) {
          MNUtil.showHUD("❌ 父任务不存在")
          return
        }
        
        const subtask = TaskUtils.createSubtask(parentTask, config)
        self.refreshTasks()
        
        MNUtil.showHUD("✅ 子任务创建成功")
        
        // 聚焦到新子任务
        MNUtil.delay(0.3).then(() => {
          subtask.focusInMindMap()
        })
        
      } catch (error) {
        MNUtil.addErrorLog(error, "createSubtask", { parentTaskId, config })
        MNUtil.showHUD("❌ 创建子任务失败")
      }
    })
  },
  
  // 切换任务状态
  toggleTaskStatus: function(taskId) {
    let self = getTaskManager()
    
    const task = MNNote.new(taskId, false)
    if (!task) {
      MNUtil.showHUD("❌ 任务不存在")
      return
    }
    
    const currentStatus = TaskUtils.getTaskStatus(task)
    let newStatus
    
    // 状态循环：未开始 -> 进行中 -> 已完成 -> 未开始
    switch (currentStatus) {
      case TaskUtils.TaskStatus.NOT_STARTED:
        newStatus = TaskUtils.TaskStatus.IN_PROGRESS
        break
      case TaskUtils.TaskStatus.IN_PROGRESS:
        newStatus = TaskUtils.TaskStatus.COMPLETED
        break
      case TaskUtils.TaskStatus.COMPLETED:
        newStatus = TaskUtils.TaskStatus.NOT_STARTED
        break
      default:
        newStatus = TaskUtils.TaskStatus.IN_PROGRESS
    }
    
    self.updateTask(taskId, { status: newStatus })
  },
  
  // 聚焦到任务
  focusTask: function(taskId) {
    let self = getTaskManager()
    
    try {
      const task = MNNote.new(taskId, false)
      if (!task) {
        MNUtil.showHUD("❌ 任务不存在")
        return
      }
      
      task.focusInMindMap(0.3)
      
      // 如果有关联卡片，提供选项
      const relatedNotes = TaskUtils.getRelatedNotes(task)
      if (relatedNotes.length > 0) {
        const options = ["查看任务"].concat(relatedNotes.map(n => n.noteTitle))
        
        MNUtil.select("选择要查看的内容", options, false).then(selected => {
          if (selected && selected.length > 0 && selected[0] > 0) {
            const selectedNote = relatedNotes[selected[0] - 1]
            selectedNote.focusInMindMap(0.3)
          }
        })
      }
      
    } catch (error) {
      MNUtil.addErrorLog(error, "focusTask", taskId)
      MNUtil.showHUD("❌ 无法定位任务")
    }
  },
  
  // 获取任务统计信息
  getTaskStatistics: function() {
    let self = getTaskManager()
    
    const stats = {
      total: self.tasks.length,
      today: 0,
      inProgress: 0,
      notStarted: 0,
      completed: 0,
      overdue: 0
    }
    
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    
    self.tasks.forEach(task => {
      // 今日任务
      if (TaskUtils.getTaskType(task) === "TODAY" || task.tags.includes("今日")) {
        stats.today++
      }
      
      // 状态统计
      const status = TaskUtils.getTaskStatus(task)
      switch (status) {
        case TaskUtils.TaskStatus.IN_PROGRESS:
          stats.inProgress++
          break
        case TaskUtils.TaskStatus.NOT_STARTED:
          stats.notStarted++
          break
        case TaskUtils.TaskStatus.COMPLETED:
          stats.completed++
          break
      }
      
      // 过期任务
      const dueDate = TaskUtils.getTaskDueDate(task)
      if (dueDate && dueDate < now && status !== TaskUtils.TaskStatus.COMPLETED) {
        stats.overdue++
      }
    })
    
    return stats
  },
  
  // 搜索任务
  searchTasks: function(keyword) {
    let self = getTaskManager()
    
    if (!keyword) return self.tasks
    
    const lowerKeyword = keyword.toLowerCase()
    
    return self.tasks.filter(task => {
      const title = TaskUtils.getTaskName(task).toLowerCase()
      const tags = (task.tags || []).join(" ").toLowerCase()
      
      // 搜索标题和标签
      if (title.includes(lowerKeyword) || tags.includes(lowerKeyword)) {
        return true
      }
      
      // 搜索评论内容
      for (const comment of task.comments) {
        if (comment.type === "TextNote" && 
            comment.text.toLowerCase().includes(lowerKeyword)) {
          return true
        }
      }
      
      return false
    })
  },
  
  // 批量操作
  batchUpdateStatus: function(taskIds, newStatus) {
    let self = getTaskManager()
    
    MNUtil.undoGrouping(() => {
      let successCount = 0
      
      taskIds.forEach(taskId => {
        try {
          const task = MNNote.new(taskId, false)
          if (task) {
            TaskUtils.setTaskStatus(task, newStatus)
            successCount++
          }
        } catch (error) {
          // 忽略单个错误，继续处理其他任务
        }
      })
      
      self.refreshTasks()
      MNUtil.showHUD(`✅ 成功更新 ${successCount} 个任务`)
    })
  },
  
  // 导出任务报告
  exportTaskReport: function() {
    let self = getTaskManager()
    
    const stats = self.getTaskStatistics()
    const groups = self.getGroupedTasks()
    
    let report = "# 任务报告\n\n"
    report += `生成时间：${new Date().toLocaleString('zh-CN')}\n\n`
    
    report += "## 统计信息\n"
    report += `- 总任务数：${stats.total}\n`
    report += `- 今日任务：${stats.today}\n`
    report += `- 进行中：${stats.inProgress}\n`
    report += `- 未开始：${stats.notStarted}\n`
    report += `- 已完成：${stats.completed}\n`
    report += `- 过期任务：${stats.overdue}\n\n`
    
    // 今日任务
    if (groups.today.length > 0) {
      report += "## 今日任务\n"
      groups.today.forEach(task => {
        const progress = TaskUtils.getTaskProgress(task)
        const progressText = progress ? ` (${progress.current}/${progress.total}${progress.unit})` : ""
        report += `- ${TaskUtils.getTaskName(task)}${progressText}\n`
      })
      report += "\n"
    }
    
    // 进行中的任务
    if (groups.inProgress.length > 0) {
      report += "## 进行中\n"
      groups.inProgress.forEach(task => {
        const progress = TaskUtils.getTaskProgress(task)
        const progressText = progress ? ` (${progress.current}/${progress.total}${progress.unit})` : ""
        report += `- ${TaskUtils.getTaskName(task)}${progressText}\n`
      })
      report += "\n"
    }
    
    // 复制到剪贴板
    MNUtil.copy(report)
    MNUtil.showHUD("✅ 报告已复制到剪贴板")
  }
})