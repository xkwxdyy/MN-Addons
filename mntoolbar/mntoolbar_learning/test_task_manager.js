/**
 * 任务管理功能测试脚本
 * 用于测试任务管理的各项功能
 */

// 确保必要的模块已加载
if (typeof TaskUtils === 'undefined') {
  JSB.require('taskUtils')
}
if (typeof TaskManager === 'undefined') {
  JSB.require('taskManager')
}

// 测试工具函数
const TaskTest = {
  // 创建测试任务
  createTestTask: function(title = "测试任务") {
    try {
      const config = {
        title: title,
        description: "这是一个测试任务",
        priority: TaskUtils.TaskPriority.HIGH,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7天后
        status: TaskUtils.TaskStatus.NOT_STARTED
      }
      
      const task = TaskUtils.createTaskNote(config)
      
      // 添加到当前笔记本
      const focusNote = MNNote.getFocusNote()
      if (focusNote) {
        focusNote.addChild(task)
      }
      
      MNUtil.showHUD(`✅ 创建测试任务: ${title}`)
      return task
      
    } catch (error) {
      MNUtil.showHUD(`❌ 创建失败: ${error.message}`)
      return null
    }
  },
  
  // 创建读书任务
  createReadingTask: function() {
    try {
      const task = this.createTestTask("【任务】阅读《深度工作》")
      if (task) {
        // 设置初始进度
        TaskUtils.updateTaskProgress(task, 0, 296, "页")
        
        // 添加相关标签
        task.appendTags(["读书", "效率"])
        
        // 创建章节子任务
        const chapters = [
          "第一章：深度工作的价值",
          "第二章：深度工作的规则",
          "第三章：深度工作的训练"
        ]
        
        chapters.forEach(chapter => {
          const subtask = TaskUtils.createSubtask(task, {
            title: chapter,
            status: TaskUtils.TaskStatus.NOT_STARTED
          })
        })
        
        MNUtil.showHUD("✅ 创建读书任务成功")
      }
    } catch (error) {
      MNUtil.showHUD(`❌ 创建读书任务失败: ${error.message}`)
    }
  },
  
  // 测试进度更新
  testProgressUpdate: function() {
    const focusNote = MNNote.getFocusNote()
    if (!focusNote || !TaskUtils.isTaskNote(focusNote)) {
      MNUtil.showHUD("❌ 请先选择一个任务卡片")
      return
    }
    
    try {
      // 模拟进度更新
      const progress = TaskUtils.getTaskProgress(focusNote) || { current: 0, total: 100, unit: "" }
      const newProgress = Math.min(progress.current + 20, progress.total)
      
      TaskUtils.updateTaskProgress(focusNote, newProgress, progress.total, progress.unit)
      MNUtil.showHUD(`✅ 进度更新: ${newProgress}/${progress.total}${progress.unit}`)
      
    } catch (error) {
      MNUtil.showHUD(`❌ 更新进度失败: ${error.message}`)
    }
  },
  
  // 测试状态切换
  testStatusToggle: function() {
    const focusNote = MNNote.getFocusNote()
    if (!focusNote || !TaskUtils.isTaskNote(focusNote)) {
      MNUtil.showHUD("❌ 请先选择一个任务卡片")
      return
    }
    
    try {
      const currentStatus = TaskUtils.getTaskStatus(focusNote)
      let newStatus
      
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
      
      TaskUtils.setTaskStatus(focusNote, newStatus)
      MNUtil.showHUD(`✅ 状态已更新`)
      
    } catch (error) {
      MNUtil.showHUD(`❌ 状态切换失败: ${error.message}`)
    }
  },
  
  // 测试今日任务标记
  testMarkAsToday: function() {
    const focusNote = MNNote.getFocusNote()
    if (!focusNote || !TaskUtils.isTaskNote(focusNote)) {
      MNUtil.showHUD("❌ 请先选择一个任务卡片")
      return
    }
    
    try {
      TaskUtils.markAsToday(focusNote)
      MNUtil.showHUD("✅ 已标记为今日任务")
      
    } catch (error) {
      MNUtil.showHUD(`❌ 标记失败: ${error.message}`)
    }
  },
  
  // 测试任务关联
  testTaskLink: function() {
    const focusNote = MNNote.getFocusNote()
    if (!focusNote) {
      MNUtil.showHUD("❌ 请先选择一个笔记")
      return
    }
    
    try {
      // 创建一个任务并关联到当前笔记
      const task = this.createTestTask("【任务】研究 " + focusNote.noteTitle)
      if (task) {
        TaskUtils.addRelatedNote(task, focusNote)
        MNUtil.showHUD("✅ 任务已关联到当前笔记")
      }
      
    } catch (error) {
      MNUtil.showHUD(`❌ 关联失败: ${error.message}`)
    }
  },
  
  // 测试批量创建
  testBatchCreate: function() {
    try {
      const tasks = [
        { title: "【今日】写周报", priority: TaskUtils.TaskPriority.HIGH },
        { title: "【今日】代码评审", priority: TaskUtils.TaskPriority.MEDIUM },
        { title: "【任务】学习新框架", priority: TaskUtils.TaskPriority.LOW },
        { title: "【项目】插件优化", priority: TaskUtils.TaskPriority.HIGH }
      ]
      
      tasks.forEach(taskConfig => {
        this.createTestTask(taskConfig.title)
      })
      
      MNUtil.showHUD(`✅ 批量创建 ${tasks.length} 个任务`)
      
    } catch (error) {
      MNUtil.showHUD(`❌ 批量创建失败: ${error.message}`)
    }
  },
  
  // 测试任务统计
  testStatistics: function() {
    try {
      const notebookId = MNUtil.currentNotebookId
      const allTasks = TaskUtils.getAllTasks(notebookId)
      const todayTasks = TaskUtils.getTodayTasks(notebookId)
      const inProgressTasks = TaskUtils.getTasksByStatus(notebookId, TaskUtils.TaskStatus.IN_PROGRESS)
      const completedTasks = TaskUtils.getTasksByStatus(notebookId, TaskUtils.TaskStatus.COMPLETED)
      
      const report = `
📊 任务统计报告
总任务数: ${allTasks.length}
今日任务: ${todayTasks.length}
进行中: ${inProgressTasks.length}
已完成: ${completedTasks.length}
      `.trim()
      
      MNUtil.copy(report)
      MNUtil.showHUD("✅ 统计报告已复制")
      
    } catch (error) {
      MNUtil.showHUD(`❌ 统计失败: ${error.message}`)
    }
  },
  
  // 运行所有测试
  runAllTests: function() {
    MNUtil.showHUD("🔧 开始运行测试...")
    
    // 使用延迟确保每个测试都能看到结果
    const tests = [
      () => this.createTestTask("测试任务1"),
      () => this.createReadingTask(),
      () => this.testProgressUpdate(),
      () => this.testStatusToggle(),
      () => this.testMarkAsToday(),
      () => this.testTaskLink(),
      () => this.testBatchCreate(),
      () => this.testStatistics()
    ]
    
    let index = 0
    const runNext = () => {
      if (index < tests.length) {
        tests[index]()
        index++
        MNUtil.delay(1.5).then(runNext)
      } else {
        MNUtil.showHUD("✅ 所有测试完成")
      }
    }
    
    runNext()
  }
}

// 测试入口
function testTaskManager() {
  // 确保 MNUtil 已初始化
  if (typeof MNUtil === 'undefined') {
    console.log("❌ MNUtil 未初始化")
    return
  }
  
  // 显示测试菜单
  const menu = new Menu(null, null, 250)
  menu.menuItems = [
    { title: "创建测试任务", object: TaskTest, selector: "createTestTask", param: "" },
    { title: "创建读书任务", object: TaskTest, selector: "createReadingTask", param: "" },
    { title: "测试进度更新", object: TaskTest, selector: "testProgressUpdate", param: "" },
    { title: "测试状态切换", object: TaskTest, selector: "testStatusToggle", param: "" },
    { title: "标记为今日任务", object: TaskTest, selector: "testMarkAsToday", param: "" },
    { title: "测试任务关联", object: TaskTest, selector: "testTaskLink", param: "" },
    { title: "批量创建任务", object: TaskTest, selector: "testBatchCreate", param: "" },
    { title: "查看任务统计", object: TaskTest, selector: "testStatistics", param: "" },
    { title: "运行所有测试", object: TaskTest, selector: "runAllTests", param: "" }
  ]
  
  // 设置菜单位置
  const button = {
    bounds: { x: 0, y: 0, width: 100, height: 40 },
    convertRectToView: function(rect, view) {
      return { x: 100, y: 100, width: 100, height: 40 }
    }
  }
  
  menu.sender = button
  menu.show()
}

// 导出测试函数
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TaskTest,
    testTaskManager
  }
}

// 如果直接运行，显示使用说明
if (typeof MNUtil !== 'undefined') {
  MNUtil.showHUD("✅ 测试脚本已加载，运行 testTaskManager() 开始测试")
}