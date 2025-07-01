/**
 * 任务管理工具类
 * 提供任务相关的工具函数和常量定义
 */

var TaskUtils = {
  /**
   * 任务状态定义
   */
  TaskStatus: {
    NOT_STARTED: 0,   // 未开始 - 淡黄色
    IN_PROGRESS: 5,   // 进行中 - 绿色
    COMPLETED: 2,     // 已完成 - 淡蓝色
    PAUSED: 3,        // 暂停中 - 淡红色
    CANCELLED: 14     // 已取消 - 深灰色
  },

  /**
   * 任务类型标识
   */
  TaskPrefix: {
    TASK: "【任务】",
    TODAY: "【今日】",
    COMPLETED: "【完成】",
    PROJECT: "【项目】",
    SUBTASK: "【子任务】"
  },

  /**
   * 任务优先级
   */
  TaskPriority: {
    HIGH: "高",
    MEDIUM: "中",
    LOW: "低"
  },

  /**
   * 判断卡片是否是任务卡片
   * @param {MNNote} note 
   * @returns {boolean}
   */
  isTaskNote: function(note) {
    if (!note || !note.noteTitle) return false
    const title = note.noteTitle
    return Object.values(TaskUtils.TaskPrefix).some(prefix => title.startsWith(prefix))
  },

  /**
   * 获取任务类型
   * @param {MNNote} note 
   * @returns {string|null}
   */
  static getTaskType(note) {
    if (!note || !note.noteTitle) return null
    const title = note.noteTitle
    for (const [key, prefix] of Object.entries(this.TaskPrefix)) {
      if (title.startsWith(prefix)) {
        return key
      }
    }
    return null
  }

  /**
   * 获取任务名称（去除前缀）
   * @param {MNNote} note 
   * @returns {string}
   */
  static getTaskName(note) {
    if (!note || !note.noteTitle) return ""
    const title = note.noteTitle
    for (const prefix of Object.values(this.TaskPrefix)) {
      if (title.startsWith(prefix)) {
        return title.substring(prefix.length).trim()
      }
    }
    return title
  }

  /**
   * 创建任务标题
   * @param {string} taskName 
   * @param {string} type 
   * @returns {string}
   */
  static createTaskTitle(taskName, type = "TASK") {
    const prefix = this.TaskPrefix[type] || this.TaskPrefix.TASK
    return `${prefix}${taskName}`
  }

  /**
   * 获取任务状态
   * @param {MNNote} note 
   * @returns {number}
   */
  static getTaskStatus(note) {
    if (!note) return null
    return note.colorIndex
  }

  /**
   * 设置任务状态
   * @param {MNNote} note 
   * @param {number} status 
   */
  static setTaskStatus(note, status) {
    if (!note) return
    note.colorIndex = status
  }

  /**
   * 获取任务进度信息
   * @param {MNNote} note 
   * @returns {{current: number, total: number, unit: string}|null}
   */
  static getTaskProgress(note) {
    if (!note || !note.comments) return null
    
    for (const comment of note.comments) {
      if (comment.type === "TextNote" && comment.text.startsWith("进度：")) {
        const match = comment.text.match(/进度：(\d+)\/(\d+)(.*)/)
        if (match) {
          return {
            current: parseInt(match[1]),
            total: parseInt(match[2]),
            unit: match[3] || ""
          }
        }
      }
    }
    return null
  }

  /**
   * 更新任务进度
   * @param {MNNote} note 
   * @param {number} current 
   * @param {number} total 
   * @param {string} unit 
   */
  static updateTaskProgress(note, current, total, unit = "") {
    if (!note) return
    
    const progressText = `进度：${current}/${total}${unit}`
    
    // 查找并更新现有进度评论
    let progressCommentIndex = -1
    for (let i = 0; i < note.comments.length; i++) {
      const comment = note.comments[i]
      if (comment.type === "TextNote" && comment.text.startsWith("进度：")) {
        progressCommentIndex = i
        break
      }
    }
    
    if (progressCommentIndex >= 0) {
      // 更新现有评论
      const comment = note.comments[progressCommentIndex]
      comment.text = progressText
    } else {
      // 添加新评论
      note.appendTextComment(progressText)
    }
    
    // 根据进度更新状态
    if (current >= total && note.colorIndex !== this.TaskStatus.COMPLETED) {
      this.setTaskStatus(note, this.TaskStatus.COMPLETED)
      // 更新标题前缀
      const taskName = this.getTaskName(note)
      note.noteTitle = this.createTaskTitle(taskName, "COMPLETED")
    } else if (current > 0 && note.colorIndex === this.TaskStatus.NOT_STARTED) {
      this.setTaskStatus(note, this.TaskStatus.IN_PROGRESS)
    }
  }

  /**
   * 获取任务的关联卡片
   * @param {MNNote} note 
   * @returns {MNNote[]}
   */
  static getRelatedNotes(note) {
    if (!note || !note.comments) return []
    
    const relatedNotes = []
    for (const comment of note.comments) {
      if (comment.type === "LinkNote") {
        try {
          const linkedNote = MNNote.new(comment.noteid, false)
          if (linkedNote) {
            relatedNotes.push(linkedNote)
          }
        } catch (e) {
          // 忽略无效链接
        }
      }
    }
    return relatedNotes
  }

  /**
   * 添加关联卡片
   * @param {MNNote} taskNote 
   * @param {MNNote} relatedNote 
   */
  static addRelatedNote(taskNote, relatedNote) {
    if (!taskNote || !relatedNote) return
    taskNote.appendNoteLink(relatedNote, "To")
  }

  /**
   * 获取任务的元数据
   * @param {MNNote} note 
   * @returns {Object}
   */
  static getTaskMetadata(note) {
    if (!note) return {}
    
    const metadata = {
      id: note.noteId,
      title: this.getTaskName(note),
      type: this.getTaskType(note),
      status: this.getTaskStatus(note),
      progress: this.getTaskProgress(note),
      createdAt: note.createDate,
      modifiedAt: note.modifiedDate,
      tags: note.tags || [],
      priority: this.getTaskPriority(note),
      dueDate: this.getTaskDueDate(note),
      relatedNotes: this.getRelatedNotes(note).map(n => ({
        id: n.noteId,
        title: n.noteTitle
      }))
    }
    
    return metadata
  }

  /**
   * 获取任务优先级
   * @param {MNNote} note 
   * @returns {string}
   */
  static getTaskPriority(note) {
    if (!note || !note.tags) return this.TaskPriority.MEDIUM
    
    if (note.tags.includes("高优先级") || note.tags.includes("紧急")) {
      return this.TaskPriority.HIGH
    } else if (note.tags.includes("低优先级")) {
      return this.TaskPriority.LOW
    }
    return this.TaskPriority.MEDIUM
  }

  /**
   * 获取任务截止日期
   * @param {MNNote} note 
   * @returns {Date|null}
   */
  static getTaskDueDate(note) {
    if (!note || !note.comments) return null
    
    for (const comment of note.comments) {
      if (comment.type === "TextNote" && comment.text.startsWith("截止日期：")) {
        const dateStr = comment.text.substring(5).trim()
        const date = new Date(dateStr)
        return isNaN(date.getTime()) ? null : date
      }
    }
    return null
  }

  /**
   * 设置任务截止日期
   * @param {MNNote} note 
   * @param {Date} date 
   */
  static setTaskDueDate(note, date) {
    if (!note || !date) return
    
    const dateStr = date.toLocaleDateString('zh-CN')
    const dueDateText = `截止日期：${dateStr}`
    
    // 查找并更新现有截止日期评论
    let dueDateCommentIndex = -1
    for (let i = 0; i < note.comments.length; i++) {
      const comment = note.comments[i]
      if (comment.type === "TextNote" && comment.text.startsWith("截止日期：")) {
        dueDateCommentIndex = i
        break
      }
    }
    
    if (dueDateCommentIndex >= 0) {
      const comment = note.comments[dueDateCommentIndex]
      comment.text = dueDateText
    } else {
      note.appendTextComment(dueDateText)
    }
  }

  /**
   * 创建任务卡片
   * @param {Object} config 
   * @returns {MNNote}
   */
  static createTaskNote(config = {}) {
    const {
      title = "新任务",
      type = "TASK",
      status = this.TaskStatus.NOT_STARTED,
      priority = this.TaskPriority.MEDIUM,
      dueDate = null,
      description = "",
      relatedNoteId = null
    } = config
    
    // 创建任务卡片
    const taskNote = MNNote.new({
      noteTitle: this.createTaskTitle(title, type),
      colorIndex: status
    })
    
    // 添加描述
    if (description) {
      taskNote.appendTextComment(description)
    }
    
    // 添加优先级标签
    if (priority === this.TaskPriority.HIGH) {
      taskNote.appendTags(["高优先级"])
    } else if (priority === this.TaskPriority.LOW) {
      taskNote.appendTags(["低优先级"])
    }
    
    // 设置截止日期
    if (dueDate) {
      this.setTaskDueDate(taskNote, dueDate)
    }
    
    // 添加关联卡片
    if (relatedNoteId) {
      try {
        const relatedNote = MNNote.new(relatedNoteId, false)
        if (relatedNote) {
          this.addRelatedNote(taskNote, relatedNote)
        }
      } catch (e) {
        // 忽略无效链接
      }
    }
    
    return taskNote
  }

  /**
   * 将任务标记为今日任务
   * @param {MNNote} note 
   */
  static markAsToday(note) {
    if (!note) return
    
    const taskName = this.getTaskName(note)
    note.noteTitle = this.createTaskTitle(taskName, "TODAY")
    
    // 添加今日标签
    if (!note.tags.includes("今日")) {
      note.appendTags(["今日"])
    }
  }

  /**
   * 获取所有任务卡片
   * @param {string} notebookId 
   * @returns {MNNote[]}
   */
  static getAllTasks(notebookId) {
    const notebook = MNUtil.getNoteBookById(notebookId)
    if (!notebook || !notebook.notes) return []
    
    return notebook.notes.filter(note => this.isTaskNote(note))
  }

  /**
   * 获取今日任务
   * @param {string} notebookId 
   * @returns {MNNote[]}
   */
  static getTodayTasks(notebookId) {
    const allTasks = this.getAllTasks(notebookId)
    return allTasks.filter(note => {
      const type = this.getTaskType(note)
      return type === "TODAY" || note.tags.includes("今日")
    })
  }

  /**
   * 根据状态筛选任务
   * @param {string} notebookId 
   * @param {number} status 
   * @returns {MNNote[]}
   */
  static getTasksByStatus(notebookId, status) {
    const allTasks = this.getAllTasks(notebookId)
    return allTasks.filter(note => note.colorIndex === status)
  }

  /**
   * 创建子任务
   * @param {MNNote} parentTask 
   * @param {Object} config 
   * @returns {MNNote}
   */
  static createSubtask(parentTask, config = {}) {
    if (!parentTask) return null
    
    // 创建子任务，类型设为 SUBTASK
    config.type = "SUBTASK"
    const subtask = this.createTaskNote(config)
    
    // 添加到父任务下
    parentTask.addChild(subtask)
    
    return subtask
  }

  /**
   * 获取任务的所有子任务
   * @param {MNNote} parentTask 
   * @returns {MNNote[]}
   */
  static getSubtasks(parentTask) {
    if (!parentTask || !parentTask.childNotes) return []
    
    return parentTask.childNotes.filter(note => {
      const type = this.getTaskType(note)
      return type === "SUBTASK"
    })
  }

  /**
   * 计算任务的总体进度（包括子任务）
   * @param {MNNote} taskNote 
   * @returns {{current: number, total: number, percentage: number}}
   */
  static calculateOverallProgress(taskNote) {
    if (!taskNote) return { current: 0, total: 0, percentage: 0 }
    
    const subtasks = this.getSubtasks(taskNote)
    
    if (subtasks.length === 0) {
      // 没有子任务，返回自身进度
      const progress = this.getTaskProgress(taskNote)
      if (progress) {
        const percentage = Math.round((progress.current / progress.total) * 100)
        return { ...progress, percentage }
      }
      return { current: 0, total: 1, percentage: 0 }
    }
    
    // 有子任务，计算子任务完成情况
    const completedSubtasks = subtasks.filter(task => 
      this.getTaskStatus(task) === this.TaskStatus.COMPLETED
    ).length
    
    const percentage = Math.round((completedSubtasks / subtasks.length) * 100)
    return {
      current: completedSubtasks,
      total: subtasks.length,
      percentage
    }
  }
}

// 任务管理配置
const taskConfig = {
  // 默认显示设置
  showCompleted: false,
  showCancelled: false,
  sortBy: "priority", // priority, dueDate, createDate, status
  
  // 界面设置
  viewMode: "list", // list, kanban
  showProgress: true,
  showDueDate: true,
  
  // 保存配置
  save() {
    MNUtil.setCloudKey("taskManagerConfig", JSON.stringify(this))
  },
  
  // 加载配置
  load() {
    try {
      const saved = MNUtil.readCloudKey("taskManagerConfig")
      if (saved) {
        const config = JSON.parse(saved)
        Object.assign(this, config)
      }
    } catch (e) {
      if (typeof MNUtil !== "undefined" && MNUtil.log) {
        MNUtil.log("🔧 Failed to load task config: " + e.message)
      }
    }
  }
}