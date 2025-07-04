/**
 * 任务管理脑图控制器
 * 用于创建和管理任务看板视图
 */

// 获取实例的工厂函数
const getTaskDashboardController = () => self

var taskDashboardController = JSB.defineClass(
  'taskDashboardController : NSObject',
  {
    /**
     * 初始化任务管理脑图
     * @param {string} rootNoteId - 作为任务管理根目录的卡片 ID（可选）
     */
    initDashboard: function(rootNoteId) {
      let self = getTaskDashboardController()
      MNUtil.log(`🎯 taskDashboardController.initDashboard - 开始初始化，rootNoteId: ${rootNoteId || 'null'}`);
      
      // 获取根卡片
      let rootNote
      if (rootNoteId) {
        // 使用指定的卡片作为根目录
        MNUtil.log(`📝 尝试创建 MNNote 实例，ID: ${rootNoteId}`);
        rootNote = MNNote.new(rootNoteId)
        if (!rootNote) {
          MNUtil.log("❌ MNNote.new() 返回 null");
          MNUtil.showHUD("❌ 无效的卡片 ID")
          return null
        }
        MNUtil.log("✅ MNNote 实例创建成功");
      } else {
        // 使用当前焦点卡片
        MNUtil.log("📝 没有指定 ID，尝试获取焦点卡片");
        rootNote = MNNote.getFocusNote()
        if (!rootNote) {
          // 如果没有焦点卡片，提示用户
          MNUtil.log("❌ 没有焦点卡片");
          MNUtil.showHUD("请先选择一个卡片作为任务管理根目录")
          return null
        }
      }
      
      // 设置任务管理根目录
      self.rootNote = rootNote
      MNUtil.log(`✅ 根卡片设置成功: ${rootNote.noteTitle || rootNote.noteId}`);
      
      // 初始化看板结构
      MNUtil.log("🏗️ 开始设置看板结构");
      self.setupDashboardStructure(rootNote)
      
      MNUtil.log("✅ initDashboard 完成，返回 rootNote");
      return rootNote
    },
    
    /**
     * 设置看板结构
     */
    setupDashboardStructure: function(rootNote) {
      let self = getTaskDashboardController()
      
      // 设置根卡片样式
      MNUtil.undoGrouping(() => {
        // 更新根卡片
        rootNote.noteTitle = "📊 任务管理看板"
        rootNote.colorIndex = 11  // 深紫色
        rootNote.appendTags(["任务管理", "看板"])
        
        // 检查是否已经初始化过（通过检查是否有特定标签的子卡片）
        const hasInbox = rootNote.childNotes.some(child => 
          child.tags && child.tags.includes("Inbox")
        )
        
        if (hasInbox) {
          MNUtil.showHUD("看板结构已存在")
          rootNote.focusInMindMap(0.5)
          return
        }
        
        // 创建主要分区
        const sections = self.createMainSections(rootNote)
        
        // 刷新显示
        rootNote.refresh()
        
        // 展开子脑图
        rootNote.focusInMindMap(0.5)
        
        MNUtil.showHUD("✅ 任务管理看板已初始化")
      })
    },
    
    /**
     * 创建主要分区
     */
    createMainSections: function(rootNote) {
      let self = getTaskDashboardController()
      const sections = {}
      
      // 1. 创建今日聚焦区（顶部）
      sections.inbox = rootNote.createChildNote({
        title: "📌 今日聚焦 / Inbox",
        colorIndex: 7  // 橙色
      })
      sections.inbox.appendTags(["今日聚焦", "Inbox"])
      sections.inbox.appendTextComment("待处理任务和今日必做事项")
      
      // 2. 创建 OKR 层级分区（中间主体）
      sections.okrLevels = self.createOKRLevels(rootNote)
      
      // 3. 创建进度看板（右侧）
      sections.progressBoard = rootNote.createChildNote({
        title: "📊 进度看板",
        colorIndex: 11  // 深紫色
      })
      sections.progressBoard.appendTags(["进度统计"])
      sections.progressBoard.appendTextComment("任务统计和进度追踪")
      
      // 4. 创建归档区（底部）
      sections.archive = rootNote.createChildNote({
        title: "📦 归档区",
        colorIndex: 14  // 深灰色
      })
      sections.archive.appendTags(["归档", "历史"])
      sections.archive.appendTextComment("已完成的历史任务")
      
      return sections
    },
    
    /**
     * 创建 OKR 层级分区
     */
    createOKRLevels: function(parentNote) {
      let self = getTaskDashboardController()
      
      // 创建 OKR 主分区
      const okrSection = parentNote.createChildNote({
        title: "🎯 OKR 任务管理",
        colorIndex: 10  // 深蓝色
      })
      okrSection.appendTags(["OKR"])
      okrSection.appendTextComment("按层级组织的任务")
      
      // 创建层级分区
      const levels = {}
      
      // 目标层级
      levels.objectives = okrSection.createChildNote({
        title: "🎯 目标 (Objectives)",
        colorIndex: 10
      })
      levels.objectives.appendTags(["目标", "Objective"])
      
      // 关键结果层级
      levels.keyResults = okrSection.createChildNote({
        title: "📊 关键结果 (Key Results)",
        colorIndex: 15
      })
      levels.keyResults.appendTags(["关键结果", "KeyResult"])
      
      // 项目层级
      levels.projects = okrSection.createChildNote({
        title: "📁 项目 (Projects)",
        colorIndex: 9
      })
      levels.projects.appendTags(["项目", "Project"])
      
      // 任务层级
      levels.tasks = okrSection.createChildNote({
        title: "📋 任务 (Tasks)",
        colorIndex: 2
      })
      levels.tasks.appendTags(["任务", "Task"])
      
      // 为每个层级创建状态分区
      Object.values(levels).forEach(levelNote => {
        self.createStatusSections(levelNote)
      })
      
      return okrSection
    },
    
    /**
     * 创建状态分区
     */
    createStatusSections: function(parentNote) {
      let self = getTaskDashboardController()
      
      // 创建状态子分区
      const statuses = [
        { name: "📋 未开始", colorIndex: 0, tag: "未开始" },
        { name: "🚀 进行中", colorIndex: 6, tag: "进行中" },
        { name: "✅ 已完成", colorIndex: 5, tag: "已完成" }
      ]
      
      statuses.forEach(status => {
        const statusNote = parentNote.createChildNote({
          title: status.name,
          colorIndex: status.colorIndex
        })
        statusNote.appendTags([status.tag, "状态分区"])
      })
    },
    
    /**
     * 添加任务到看板
     * @param {MNNote} taskNote - 要添加的任务卡片
     * @param {Object} options - 选项
     */
    addTaskToDashboard: function(taskNote, options = {}) {
      let self = getTaskDashboardController()
      
      if (!self.rootNote) {
        MNUtil.showHUD("❌ 请先初始化任务管理看板")
        return
      }
      
      // 获取任务类型和状态
      const taskType = MNTaskManager.getTaskType(taskNote)
      const taskStatus = MNTaskManager.getTaskStatus(taskNote)
      
      if (!taskType) {
        MNUtil.showHUD("❌ 无法识别任务类型")
        return
      }
      
      // 将任务复制或移动到对应的分区
      const targetSection = self.findTargetSection(taskType.key, taskStatus)
      if (targetSection) {
        if (options.move) {
          // 移动任务
          taskNote.removeFromParent()
          targetSection.addChild(taskNote)
        } else {
          // 复制任务到看板
          const clonedTask = taskNote.clone()
          clonedTask.appendTags(["看板任务"])
          targetSection.addChild(clonedTask)
        }
        
        targetSection.refresh()
        MNUtil.showHUD("✅ 已添加到看板")
      } else {
        MNUtil.showHUD("❌ 找不到合适的分区")
      }
    },
    
    /**
     * 查找目标分区
     * @param {string} taskType - 任务类型 key
     * @param {string} taskStatus - 任务状态 key
     */
    findTargetSection: function(taskType, taskStatus) {
      let self = getTaskDashboardController()
      
      if (!self.rootNote) return null
      
      // 遍历查找 OKR 分区
      const okrSection = self.rootNote.childNotes.find(child => 
        child.tags && child.tags.includes("OKR")
      )
      
      if (!okrSection) return null
      
      // 查找对应的任务类型分区
      const typeSection = okrSection.childNotes.find(child => {
        if (!child.tags) return false
        
        const typeTagMap = {
          objective: "Objective",
          keyResult: "KeyResult", 
          project: "Project",
          task: "Task"
        }
        
        return child.tags.includes(typeTagMap[taskType])
      })
      
      if (!typeSection) return null
      
      // 查找对应的状态分区
      const statusTagMap = {
        notStarted: "未开始",
        inProgress: "进行中",
        completed: "已完成"
      }
      
      const statusTag = statusTagMap[taskStatus] || "未开始"
      const statusSection = typeSection.childNotes.find(child =>
        child.tags && child.tags.includes(statusTag)
      )
      
      return statusSection
    },
    
    /**
     * 将任务移动到今日聚焦
     */
    moveToInbox: function(taskNote) {
      let self = getTaskDashboardController()
      
      if (!self.rootNote) {
        MNUtil.showHUD("❌ 请先初始化任务管理看板")
        return
      }
      
      // 查找 Inbox 分区
      const inbox = self.rootNote.childNotes.find(child =>
        child.tags && child.tags.includes("Inbox")
      )
      
      if (inbox) {
        taskNote.removeFromParent()
        inbox.addChild(taskNote)
        taskNote.appendTags(["今日"])
        inbox.refresh()
        MNUtil.showHUD("✅ 已加入今日聚焦")
      }
    },
    
    /**
     * 更新看板统计
     */
    updateDashboardStatistics: function() {
      let self = getTaskDashboardController()
      
      if (!self.rootNote) return
      
      const stats = {
        total: 0,
        byStatus: {
          notStarted: 0,
          inProgress: 0,
          completed: 0
        },
        byType: {
          objective: 0,
          keyResult: 0,
          project: 0,
          task: 0
        }
      }
      
      // 递归统计所有任务
      self.countTasks(self.rootNote, stats)
      
      // 更新进度看板显示
      self.updateProgressBoard(stats)
    },
    
    /**
     * 递归统计任务
     */
    countTasks: function(note, stats) {
      let self = getTaskDashboardController()
      
      // 检查是否是任务卡片
      const taskType = MNTaskManager.getTaskType(note)
      if (taskType) {
        stats.total++
        stats.byType[taskType.key] = (stats.byType[taskType.key] || 0) + 1
        
        const status = MNTaskManager.getNoteStatus(note)
        if (status) {
          stats.byStatus[status] = (stats.byStatus[status] || 0) + 1
        }
      }
      
      // 递归处理子卡片
      if (note.childNotes && note.childNotes.length > 0) {
        note.childNotes.forEach(child => {
          self.countTasks(child, stats)
        })
      }
    },
    
    /**
     * 更新进度看板
     */
    updateProgressBoard: function(stats) {
      let self = getTaskDashboardController()
      
      if (!self.rootNote) return
      
      // 查找进度看板分区
      const progressBoard = self.rootNote.childNotes.find(child =>
        child.tags && child.tags.includes("进度统计")
      )
      
      if (!progressBoard) return
      
      // 清除旧的评论（保留第一条描述）
      while (progressBoard.comments.length > 1) {
        progressBoard.removeCommentByIndex(1)
      }
      
      // 添加统计信息
      progressBoard.appendTextComment(`📊 总任务数：${stats.total}`)
      progressBoard.appendTextComment(`⬜ 未开始：${stats.byStatus.notStarted}`)
      progressBoard.appendTextComment(`🔵 进行中：${stats.byStatus.inProgress}`)
      progressBoard.appendTextComment(`✅ 已完成：${stats.byStatus.completed}`)
      
      // 计算完成率
      const completionRate = stats.total > 0 
        ? Math.round((stats.byStatus.completed / stats.total) * 100)
        : 0
      
      progressBoard.appendTextComment(`📈 完成率：${completionRate}%`)
      
      // 添加类型统计
      progressBoard.appendTextComment("---")
      progressBoard.appendTextComment(`🎯 目标：${stats.byType.objective}`)
      progressBoard.appendTextComment(`📊 关键结果：${stats.byType.keyResult}`)
      progressBoard.appendTextComment(`📁 项目：${stats.byType.project}`)
      progressBoard.appendTextComment(`📋 任务：${stats.byType.task}`)
      
      // 如果有 HTML 进度条功能
      if (typeof MNTaskManager.addProgressComment === 'function') {
        MNTaskManager.addProgressComment(progressBoard, completionRate)
      }
      
      progressBoard.refresh()
    }
  },
  {
    // 类方法
    new: function() {
      MNUtil.log("🏗️ taskDashboardController.new() 被调用");
      const controller = taskDashboardController.alloc().init()
      MNUtil.log("🏗️ controller 创建结果: " + (controller ? "成功" : "失败"));
      return controller
    }
  }
)

// 导出控制器
if (typeof module !== 'undefined' && module.exports) {
  module.exports = taskDashboardController
}