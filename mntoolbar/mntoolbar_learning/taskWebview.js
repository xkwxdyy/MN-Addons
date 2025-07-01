/**
 * 任务管理 WebView 控制器
 * 负责管理任务界面的显示和交互
 */

const getTaskWebviewController = () => self

var TaskWebviewController = JSB.defineClass("TaskWebviewController : UIViewController", {
  // 初始化
  viewDidLoad: function() {
    let self = getTaskWebviewController()
    
    try {
      // 初始化任务管理器
      if (!self.taskManager) {
        self.taskManager = TaskManager.new()
      }
      
      // 创建 WebView
      self.setupWebView()
      
      // 创建导航栏
      self.setupNavigationBar()
      
      // 加载 HTML
      self.loadTaskView()
      
      if (typeof MNUtil !== "undefined" && MNUtil.log) {
        MNUtil.log("🔧 TaskWebviewController initialized")
      }
      
    } catch (error) {
      MNUtil.addErrorLog(error, "TaskWebviewController.viewDidLoad")
    }
  },
  
  // 设置 WebView
  setupWebView: function() {
    let self = getTaskWebviewController()
    
    // 创建 WebView 配置
    const config = WKWebViewConfiguration.new()
    const userContentController = config.userContentController
    
    // 注册消息处理器
    const handlers = [
      "ready",          // 页面加载完成
      "createTask",     // 创建任务
      "toggleStatus",   // 切换状态
      "updateProgress", // 更新进度
      "editTask",       // 编辑任务
      "deleteTask",     // 删除任务
      "focusTask",      // 聚焦任务
      "refresh",        // 刷新
      "showSettings",   // 显示设置
      "exportReport",   // 导出报告
      "search"          // 搜索
    ]
    
    handlers.forEach(name => {
      userContentController.addScriptMessageHandlerName(self, name)
    })
    
    // 创建 WebView
    self.webView = WKWebView.alloc().initWithFrameConfiguration(
      self.view.bounds,
      config
    )
    
    self.webView.navigationDelegate = self
    self.webView.UIDelegate = self
    self.webView.autoresizingMask = (1 << 1) | (1 << 4) // 自适应宽高
    
    // 设置背景色
    self.webView.backgroundColor = UIColor.systemBackgroundColor()
    self.webView.opaque = false
    
    // 添加到视图
    self.view.addSubview(self.webView)
  },
  
  // 设置导航栏
  setupNavigationBar: function() {
    let self = getTaskWebviewController()
    
    self.navigationItem.title = "任务管理"
    
    // 关闭按钮
    const closeButton = UIBarButtonItem.alloc().initWithTitleStyleTargetAction(
      "关闭",
      0,
      self,
      "close"
    )
    self.navigationItem.leftBarButtonItem = closeButton
    
    // 添加按钮
    const addButton = UIBarButtonItem.alloc().initWithBarButtonSystemItemTargetAction(
      4, // UIBarButtonSystemItemAdd
      self,
      "createNewTask"
    )
    self.navigationItem.rightBarButtonItem = addButton
  },
  
  // 加载任务视图
  loadTaskView: function() {
    let self = getTaskWebviewController()
    
    const htmlPath = MNUtil.mainPath + "/resources/task.html"
    const htmlURL = NSURL.fileURLWithPath(htmlPath)
    
    if (NSFileManager.defaultManager().fileExistsAtPath(htmlPath)) {
      self.webView.loadFileURLAllowingReadAccessToURL(htmlURL, htmlURL.URLByDeletingLastPathComponent())
    } else {
      MNUtil.showHUD("❌ 任务界面文件不存在")
      if (typeof MNUtil !== "undefined" && MNUtil.log) {
        MNUtil.log("❌ Task HTML not found at: " + htmlPath)
      }
    }
  },
  
  // WebView 消息处理
  userContentControllerDidReceiveScriptMessage: function(userContentController, message) {
    let self = getTaskWebviewController()
    
    try {
      const name = message.name
      const body = message.body
      
      switch (name) {
        case "ready":
          self.onReady()
          break
          
        case "createTask":
          self.showCreateTaskDialog()
          break
          
        case "toggleStatus":
          self.taskManager.toggleTaskStatus(body)
          self.refreshTaskList()
          break
          
        case "updateProgress":
          self.taskManager.quickUpdateProgress(body)
          break
          
        case "editTask":
          self.showEditTaskDialog(body)
          break
          
        case "deleteTask":
          self.taskManager.deleteTask(body)
          self.refreshTaskList()
          break
          
        case "focusTask":
          self.taskManager.focusTask(body)
          break
          
        case "refresh":
          self.refreshTaskList()
          break
          
        case "showSettings":
          self.showTaskSettings()
          break
          
        case "exportReport":
          self.taskManager.exportTaskReport()
          break
          
        case "search":
          self.searchTasks(body)
          break
      }
      
    } catch (error) {
      MNUtil.addErrorLog(error, "TaskWebview.messageHandler", { name: message.name })
    }
  },
  
  // 页面加载完成
  onReady: function() {
    let self = getTaskWebviewController()
    self.refreshTaskList()
  },
  
  // 刷新任务列表
  refreshTaskList: function() {
    let self = getTaskWebviewController()
    
    self.taskManager.refreshTasks()
    const groupedTasks = self.taskManager.getGroupedTasks()
    const stats = self.taskManager.getTaskStatistics()
    
    // 转换任务数据为前端格式
    const tasksData = {}
    for (const [group, tasks] of Object.entries(groupedTasks)) {
      tasksData[group] = tasks.map(task => TaskUtils.getTaskMetadata(task))
    }
    
    // 发送数据到 WebView
    const data = {
      tasks: tasksData,
      stats: stats
    }
    
    const script = `loadTasks(${JSON.stringify(data)})`
    self.webView.evaluateJavaScriptCompletionHandler(script, null)
  },
  
  // 搜索任务
  searchTasks: function(keyword) {
    let self = getTaskWebviewController()
    
    const searchResults = self.taskManager.searchTasks(keyword)
    
    // 重新分组搜索结果
    const groupedTasks = {
      today: [],
      inProgress: [],
      notStarted: [],
      completed: [],
      paused: [],
      cancelled: []
    }
    
    searchResults.forEach(task => {
      const metadata = TaskUtils.getTaskMetadata(task)
      
      // 今日任务优先
      if (TaskUtils.getTaskType(task) === "TODAY" || task.tags.includes("今日")) {
        groupedTasks.today.push(metadata)
        return
      }
      
      // 按状态分组
      const status = TaskUtils.getTaskStatus(task)
      switch (status) {
        case TaskUtils.TaskStatus.IN_PROGRESS:
          groupedTasks.inProgress.push(metadata)
          break
        case TaskUtils.TaskStatus.NOT_STARTED:
          groupedTasks.notStarted.push(metadata)
          break
        case TaskUtils.TaskStatus.COMPLETED:
          groupedTasks.completed.push(metadata)
          break
        case TaskUtils.TaskStatus.PAUSED:
          groupedTasks.paused.push(metadata)
          break
        case TaskUtils.TaskStatus.CANCELLED:
          groupedTasks.cancelled.push(metadata)
          break
      }
    })
    
    const stats = self.taskManager.getTaskStatistics()
    
    const data = {
      tasks: groupedTasks,
      stats: stats
    }
    
    const script = `loadTasks(${JSON.stringify(data)})`
    self.webView.evaluateJavaScriptCompletionHandler(script, null)
  },
  
  // 显示创建任务对话框
  showCreateTaskDialog: function() {
    let self = getTaskWebviewController()
    
    // 获取当前焦点笔记（可能作为关联卡片）
    const focusNote = MNNote.getFocusNote()
    const relatedInfo = focusNote ? `\n关联卡片：${focusNote.noteTitle}` : ""
    
    MNUtil.input(
      "创建新任务",
      "请输入任务信息" + relatedInfo,
      [
        { key: "title", title: "任务名称", placeholder: "输入任务名称" },
        { key: "description", title: "任务描述", placeholder: "可选" },
        { key: "priority", title: "优先级", placeholder: "高/中/低" },
        { key: "dueDate", title: "截止日期", placeholder: "YYYY-MM-DD" }
      ]
    ).then(result => {
      if (result && result.title) {
        const config = {
          title: result.title,
          description: result.description || "",
          priority: result.priority || TaskUtils.TaskPriority.MEDIUM,
          relatedNoteId: focusNote ? focusNote.noteId : null
        }
        
        // 解析日期
        if (result.dueDate) {
          const date = new Date(result.dueDate)
          if (!isNaN(date.getTime())) {
            config.dueDate = date
          }
        }
        
        self.taskManager.createTask(config)
        self.refreshTaskList()
      }
    })
  },
  
  // 创建新任务（从导航栏）
  createNewTask: function() {
    let self = getTaskWebviewController()
    self.showCreateTaskDialog()
  },
  
  // 显示编辑任务对话框
  showEditTaskDialog: function(taskId) {
    let self = getTaskWebviewController()
    
    const task = MNNote.new(taskId, false)
    if (!task) {
      MNUtil.showHUD("❌ 任务不存在")
      return
    }
    
    const metadata = TaskUtils.getTaskMetadata(task)
    
    MNUtil.input(
      "编辑任务",
      "修改任务信息",
      [
        { key: "title", title: "任务名称", placeholder: metadata.title },
        { key: "priority", title: "优先级", placeholder: metadata.priority },
        { key: "status", title: "状态", placeholder: "未开始/进行中/已完成/暂停" }
      ]
    ).then(result => {
      if (result) {
        const updates = {}
        
        if (result.title && result.title !== metadata.title) {
          updates.title = result.title
        }
        
        if (result.priority && result.priority !== metadata.priority) {
          updates.priority = result.priority
        }
        
        if (result.status) {
          const statusMap = {
            "未开始": TaskUtils.TaskStatus.NOT_STARTED,
            "进行中": TaskUtils.TaskStatus.IN_PROGRESS,
            "已完成": TaskUtils.TaskStatus.COMPLETED,
            "暂停": TaskUtils.TaskStatus.PAUSED
          }
          if (statusMap[result.status] !== undefined) {
            updates.status = statusMap[result.status]
          }
        }
        
        if (Object.keys(updates).length > 0) {
          self.taskManager.updateTask(taskId, updates)
          self.refreshTaskList()
        }
      }
    })
  },
  
  // 显示任务设置
  showTaskSettings: function() {
    let self = getTaskWebviewController()
    
    // 创建设置控制器
    if (!self.settingsController) {
      JSB.require("taskSettings")
      self.settingsController = TaskSettingsController.new()
    }
    
    const nav = UINavigationController.alloc().initWithRootViewController(self.settingsController)
    nav.modalPresentationStyle = 2 // UIModalPresentationFormSheet
    
    self.presentViewControllerAnimatedCompletion(nav, true, null)
  },
  
  // 关闭
  close: function() {
    let self = getTaskWebviewController()
    self.dismissViewControllerAnimatedCompletion(true, null)
  },
  
  // WebView 导航委托
  webViewDidFinishNavigation: function(webView, navigation) {
    if (typeof MNUtil !== "undefined" && MNUtil.log) {
      MNUtil.log("✅ Task WebView loaded")
    }
  },
  
  webViewDidFailNavigationWithError: function(webView, navigation, error) {
    MNUtil.addErrorLog(error, "TaskWebView.navigation")
  },
  
  // 内存警告
  didReceiveMemoryWarning: function() {
    let self = getTaskWebviewController()
    
    // 刷新任务数据，释放缓存
    if (self.taskManager) {
      self.taskManager.refreshTasks()
    }
    
    if (typeof MNUtil !== "undefined" && MNUtil.log) {
      MNUtil.log("⚠️ TaskWebview received memory warning")
    }
  }
})

// 加载必要的依赖
JSB.require("taskUtils")
JSB.require("taskManager")