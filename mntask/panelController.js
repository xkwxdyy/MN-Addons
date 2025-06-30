/**
 * 主面板控制器
 * 展示多页签切换功能
 */

// 获取控制器实例（重要模式！）
const getPanelController = () => self

var panelController = JSB.defineClass('panelController : UIViewController', {
  
  // ========== 初始化 ==========
  
  /**
   * 初始化方法
   */
  init: function() {
    let self = super.init()
    
    // 基础属性
    self.mainPath = ""
    self.parent = null
    
    // 界面属性
    self.currentFrame = TaskConfig.getPanelFrame("mainPanel") || 
                       {x: 100, y: 100, width: 450, height: 500}
    self.currentTab = 0  // 当前选中的标签页
    
    // 页签定义
    self.tabs = [
      {title: "📋 任务列表", view: null},
      {title: "📊 统计", view: null},
      {title: "🏷️ 标签管理", view: null},
      {title: "⚙️ 设置", view: null}
    ]
    
    return self
  },
  
  // ========== 生命周期方法 ==========
  
  /**
   * 视图加载完成
   */
  viewDidLoad: function() {
    try {
      let self = getPanelController()
      
      // 设置基础视图
      self.setupView()
      
      // 创建UI组件
      self.createTitleBar()
      self.createTabBar()
      self.createContentArea()
      self.createTabContents()
      
      // 添加手势
      self.setupGestures()
      
      // 切换到默认标签页
      self.switchToTab(0)
      
      TaskUtils.log("📋 主面板加载完成")
      
    } catch (error) {
      TaskUtils.addErrorLog(error, "panelController.viewDidLoad")
    }
  },
  
  /**
   * 视图即将布局子视图
   */
  viewWillLayoutSubviews: function() {
    let self = getPanelController()
    self.updateLayout()
  },
  
  // ========== 视图设置 ==========
  
  /**
   * 设置基础视图
   */
  setupView: function() {
    let self = getPanelController()
    
    self.view.hidden = true
    self.view.frame = self.currentFrame
    self.view.backgroundColor = TaskUtils.hexColorAlpha("#ffffff", 0.95)
    
    // 圆角和阴影
    self.view.layer.cornerRadius = 10
    self.view.layer.shadowOffset = {width: 0, height: 2}
    self.view.layer.shadowRadius = 10
    self.view.layer.shadowOpacity = 0.3
    self.view.layer.shadowColor = UIColor.blackColor()
    self.view.layer.masksToBounds = false
  },
  
  /**
   * 创建标题栏
   */
  createTitleBar: function() {
    let self = getPanelController()
    
    // 标题栏容器
    self.titleBar = UIView.new()
    self.titleBar.backgroundColor = TaskUtils.hexColorAlpha("#f8f8f8", 1)
    self.view.addSubview(self.titleBar)
    
    // 标题
    self.titleLabel = UILabel.new()
    self.titleLabel.text = "📋 MN Task 主面板"
    self.titleLabel.textAlignment = 1
    self.titleLabel.font = UIFont.boldSystemFontOfSize(16)
    self.titleBar.addSubview(self.titleLabel)
    
    // 移动按钮
    self.createButton("moveButton", "", self.titleBar)
    if (typeof MNButton !== 'undefined') {
      MNButton.setConfig(self.moveButton, {
        title: "⋮⋮⋮",
        color: "#3a81fb",
        opacity: 0.5,
        radius: 8
      })
    } else {
      self.moveButton.setTitleForState("⋮⋮⋮", 0)
      self.moveButton.backgroundColor = UIColor.colorWithHexString("#3a81fb")
      self.moveButton.layer.cornerRadius = 8
    }
    
    // 关闭按钮
    self.createButton("closeButton", "onClose:", self.titleBar)
    if (typeof MNButton !== 'undefined') {
      MNButton.setConfig(self.closeButton, {
        title: "✕",
        color: "#ff4444",
        font: 20,
        radius: 15
      })
    } else {
      self.closeButton.setTitleForState("✕", 0)
      self.closeButton.backgroundColor = UIColor.colorWithHexString("#ff4444")
      self.closeButton.layer.cornerRadius = 15
    }
  },
  
  /**
   * 创建标签栏
   */
  createTabBar: function() {
    let self = getPanelController()
    
    // 标签栏容器
    self.tabBar = UIView.new()
    self.tabBar.backgroundColor = TaskUtils.hexColorAlpha("#f0f0f0", 1)
    self.view.addSubview(self.tabBar)
    
    // 创建标签按钮
    self.tabButtons = []
    self.tabs.forEach((tab, index) => {
      let button = self.createButton("tabButton" + index, "onTabClick:", self.tabBar)
      button.tag = index
      
      if (typeof MNButton !== 'undefined') {
        MNButton.setConfig(button, {
          title: tab.title,
          color: index === 0 ? "#007AFF" : "#999999",
          font: 14
        })
      } else {
        button.setTitleForState(tab.title, 0)
        button.backgroundColor = UIColor.colorWithHexString(
          index === 0 ? "#007AFF" : "#999999"
        )
        button.titleLabel.font = UIFont.systemFontOfSize(14)
      }
      
      self.tabButtons.push(button)
    })
  },
  
  /**
   * 创建内容区域
   */
  createContentArea: function() {
    let self = getPanelController()
    
    // 内容容器
    self.contentContainer = UIView.new()
    self.contentContainer.backgroundColor = UIColor.whiteColor()
    self.contentContainer.clipsToBounds = true
    self.view.addSubview(self.contentContainer)
  },
  
  /**
   * 创建各个标签页内容
   */
  createTabContents: function() {
    let self = getPanelController()
    
    // 任务列表页
    self.createTaskListView()
    
    // 统计页
    self.createStatisticsView()
    
    // 标签管理页
    self.createTagsView()
    
    // 设置页
    self.createSettingsView()
  },
  
  /**
   * 创建任务列表视图
   */
  createTaskListView: function() {
    let self = getPanelController()
    
    let view = UIView.new()
    view.backgroundColor = UIColor.whiteColor()
    view.hidden = true
    self.contentContainer.addSubview(view)
    
    // 标题
    let titleLabel = UILabel.new()
    titleLabel.text = "任务列表"
    titleLabel.font = UIFont.boldSystemFontOfSize(18)
    titleLabel.textAlignment = 1
    titleLabel.frame = {x: 20, y: 20, width: 200, height: 30}
    view.addSubview(titleLabel)
    
    // 添加任务按钮
    let addButton = self.createButton("addTaskButton", "onAddTask:", view)
    if (typeof MNButton !== 'undefined') {
      MNButton.setConfig(addButton, {
        title: "➕ 添加任务",
        color: "#4CAF50",
        font: 16
      })
    } else {
      addButton.setTitleForState("➕ 添加任务", 0)
      addButton.backgroundColor = UIColor.colorWithHexString("#4CAF50")
    }
    addButton.frame = {x: 20, y: 60, width: 120, height: 35}
    
    // 任务列表（示例）
    let listLabel = UILabel.new()
    listLabel.text = "• 学习 MarginNote 插件开发\n• 完成项目文档\n• 整理笔记\n• 复习知识点"
    listLabel.numberOfLines = 0
    listLabel.frame = {x: 20, y: 110, width: 400, height: 200}
    view.addSubview(listLabel)
    
    self.tabs[0].view = view
  },
  
  /**
   * 创建统计视图
   */
  createStatisticsView: function() {
    let self = getPanelController()
    
    let view = UIView.new()
    view.backgroundColor = UIColor.whiteColor()
    view.hidden = true
    self.contentContainer.addSubview(view)
    
    // 统计信息
    let statsLabel = UILabel.new()
    statsLabel.text = "📊 任务统计\n\n总任务数：" + (TaskConfig.get("userData.taskCount") || 0) + 
                     "\n已完成：0\n进行中：0\n待办：0"
    statsLabel.numberOfLines = 0
    statsLabel.textAlignment = 1
    statsLabel.frame = {x: 20, y: 50, width: 400, height: 200}
    view.addSubview(statsLabel)
    
    self.tabs[1].view = view
  },
  
  /**
   * 创建标签管理视图
   */
  createTagsView: function() {
    let self = getPanelController()
    
    let view = UIView.new()
    view.backgroundColor = UIColor.whiteColor()
    view.hidden = true
    self.contentContainer.addSubview(view)
    
    // 标签列表
    let tagsLabel = UILabel.new()
    tagsLabel.text = "🏷️ 标签管理\n\n• 重要\n• 紧急\n• 学习\n• 工作\n• 生活"
    tagsLabel.numberOfLines = 0
    tagsLabel.frame = {x: 20, y: 50, width: 400, height: 200}
    view.addSubview(tagsLabel)
    
    self.tabs[2].view = view
  },
  
  /**
   * 创建设置视图
   */
  createSettingsView: function() {
    let self = getPanelController()
    
    let view = UIView.new()
    view.backgroundColor = UIColor.whiteColor()
    view.hidden = true
    self.contentContainer.addSubview(view)
    
    // 设置选项
    let settingsLabel = UILabel.new()
    settingsLabel.text = "⚙️ 设置选项"
    settingsLabel.font = UIFont.boldSystemFontOfSize(18)
    settingsLabel.frame = {x: 20, y: 20, width: 200, height: 30}
    view.addSubview(settingsLabel)
    
    // 重置按钮
    let resetButton = self.createButton("resetButton", "onReset:", view)
    if (typeof MNButton !== 'undefined') {
      MNButton.setConfig(resetButton, {
        title: "🔄 重置配置",
        color: "#FF9800",
        font: 16
      })
    } else {
      resetButton.setTitleForState("🔄 重置配置", 0)
      resetButton.backgroundColor = UIColor.colorWithHexString("#FF9800")
    }
    resetButton.frame = {x: 20, y: 70, width: 120, height: 35}
    
    // 导出配置按钮
    let exportButton = self.createButton("exportButton", "onExport:", view)
    if (typeof MNButton !== 'undefined') {
      MNButton.setConfig(exportButton, {
        title: "📤 导出配置",
        color: "#2196F3",
        font: 16
      })
    } else {
      exportButton.setTitleForState("📤 导出配置", 0)
      exportButton.backgroundColor = UIColor.colorWithHexString("#2196F3")
    }
    exportButton.frame = {x: 150, y: 70, width: 120, height: 35}
    
    self.tabs[3].view = view
  },
  
  // ========== 手势处理 ==========
  
  /**
   * 设置手势
   */
  setupGestures: function() {
    let self = getPanelController()
    
    // 拖动手势
    self.moveGesture = new UIPanGestureRecognizer(self, "onMoveGesture:")
    self.moveButton.addGestureRecognizer(self.moveGesture)
    
    // 双击复位
    self.doubleTapGesture = new UITapGestureRecognizer(self, "onDoubleTap:")
    self.doubleTapGesture.numberOfTapsRequired = 2
    self.moveButton.addGestureRecognizer(self.doubleTapGesture)
    
    // 调整大小手势
    self.resizeButton = self.createButton("resizeButton", "", self.view)
    self.resizeButton.backgroundColor = TaskUtils.hexColorAlpha("#cccccc", 0.5)
    self.resizeButton.layer.cornerRadius = 7
    
    self.resizeGesture = new UIPanGestureRecognizer(self, "onResizeGesture:")
    self.resizeButton.addGestureRecognizer(self.resizeGesture)
  },
  
  /**
   * 拖动手势处理
   */
  onMoveGesture: function(gesture) {
    let self = getPanelController()
    
    try {
      let location = gesture.locationInView(MNUtil.studyView)
      let frame = self.view.frame
      
      if (gesture.state === 1) { // Began
        self.dragStartLocation = location
        self.dragStartFrame = frame
      } else if (gesture.state === 2) { // Changed
        let deltaX = location.x - self.dragStartLocation.x
        let deltaY = location.y - self.dragStartLocation.y
        
        let newFrame = {
          x: self.dragStartFrame.x + deltaX,
          y: self.dragStartFrame.y + deltaY,
          width: frame.width,
          height: frame.height
        }
        
        // 边界检查
        let studyFrame = MNUtil.studyView.bounds
        newFrame.x = TaskUtils.constrain(newFrame.x, 0, studyFrame.width - newFrame.width)
        newFrame.y = TaskUtils.constrain(newFrame.y, 0, studyFrame.height - newFrame.height)
        
        self.view.frame = newFrame
        self.currentFrame = newFrame
        
      } else if (gesture.state === 3) { // Ended
        MNUtil.studyView.bringSubviewToFront(self.view)
        TaskConfig.savePanelFrame("mainPanel", self.currentFrame)
      }
    } catch (error) {
      TaskUtils.addErrorLog(error, "onMoveGesture")
    }
  },
  
  /**
   * 双击复位
   */
  onDoubleTap: function(gesture) {
    let self = getPanelController()
    
    TaskUtils.animate(() => {
      self.view.frame = {x: 100, y: 100, width: 450, height: 500}
      self.currentFrame = self.view.frame
      self.updateLayout()
    }, 0.3)
    
    TaskConfig.savePanelFrame("mainPanel", self.currentFrame)
  },
  
  /**
   * 调整大小手势
   */
  onResizeGesture: function(gesture) {
    let self = getPanelController()
    
    try {
      let location = gesture.locationInView(MNUtil.studyView)
      
      if (gesture.state === 1) { // Began
        self.resizeStartFrame = self.view.frame
      } else if (gesture.state === 2) { // Changed
        let newWidth = location.x - self.resizeStartFrame.x
        let newHeight = location.y - self.resizeStartFrame.y
        
        // 限制最小和最大尺寸
        newWidth = TaskUtils.constrain(newWidth, 350, 800)
        newHeight = TaskUtils.constrain(newHeight, 300, 700)
        
        self.view.frame = {
          x: self.resizeStartFrame.x,
          y: self.resizeStartFrame.y,
          width: newWidth,
          height: newHeight
        }
        
        self.currentFrame = self.view.frame
        self.updateLayout()
        
      } else if (gesture.state === 3) { // Ended
        TaskConfig.savePanelFrame("mainPanel", self.currentFrame)
      }
    } catch (error) {
      TaskUtils.addErrorLog(error, "onResizeGesture")
    }
  },
  
  // ========== 布局管理 ==========
  
  /**
   * 更新布局
   */
  updateLayout: function() {
    let self = getPanelController()
    let bounds = self.view.bounds
    
    // 标题栏
    self.titleBar.frame = {x: 0, y: 0, width: bounds.width, height: 44}
    self.titleLabel.frame = {x: 50, y: 0, width: bounds.width - 100, height: 44}
    self.moveButton.frame = {x: bounds.width/2 - 40, y: 10, width: 80, height: 24}
    self.closeButton.frame = {x: bounds.width - 40, y: 7, width: 30, height: 30}
    
    // 标签栏
    self.tabBar.frame = {x: 0, y: 44, width: bounds.width, height: 44}
    
    // 标签按钮
    let tabWidth = bounds.width / self.tabs.length
    self.tabButtons.forEach((button, index) => {
      button.frame = {x: tabWidth * index, y: 0, width: tabWidth, height: 44}
    })
    
    // 内容区域
    self.contentContainer.frame = {x: 0, y: 88, width: bounds.width, height: bounds.height - 88}
    
    // 各标签页内容
    self.tabs.forEach(tab => {
      if (tab.view) {
        tab.view.frame = self.contentContainer.bounds
      }
    })
    
    // 调整大小按钮
    self.resizeButton.frame = {x: bounds.width - 20, y: bounds.height - 20, width: 15, height: 15}
  },
  
  // ========== 标签切换 ==========
  
  /**
   * 切换到指定标签页
   */
  switchToTab: function(index) {
    let self = getPanelController()
    
    // 隐藏所有标签页
    self.tabs.forEach((tab, i) => {
      if (tab.view) {
        tab.view.hidden = true
      }
      
      // 更新按钮颜色
      if (typeof MNButton !== 'undefined') {
        MNButton.setConfig(self.tabButtons[i], {
          color: i === index ? "#007AFF" : "#999999"
        })
      } else {
        self.tabButtons[i].backgroundColor = UIColor.colorWithHexString(
          i === index ? "#007AFF" : "#999999"
        )
      }
    })
    
    // 显示选中的标签页
    if (self.tabs[index].view) {
      self.tabs[index].view.hidden = false
    }
    
    self.currentTab = index
  },
  
  // ========== 事件处理 ==========
  
  /**
   * 标签点击
   */
  onTabClick: function(sender) {
    let self = getPanelController()
    self.switchToTab(sender.tag)
  },
  
  /**
   * 关闭面板
   */
  onClose: function(sender) {
    let self = getPanelController()
    self.hide()
  },
  
  /**
   * 添加任务
   */
  onAddTask: function(sender) {
    TaskConfig.incrementTaskCount()
    TaskUtils.showHUD("✅ 任务已添加")
    
    // 刷新统计
    let self = getPanelController()
    if (self.tabs[1].view) {
      let statsLabel = self.tabs[1].view.subviews[0]
      if (statsLabel) {
        statsLabel.text = "📊 任务统计\n\n总任务数：" + TaskConfig.get("userData.taskCount") + 
                         "\n已完成：0\n进行中：0\n待办：0"
      }
    }
  },
  
  /**
   * 重置配置
   */
  onReset: function(sender) {
    TaskConfig.reset()
  },
  
  /**
   * 导出配置
   */
  onExport: function(sender) {
    TaskConfig.export()
  },
  
  // ========== 显示/隐藏 ==========
  
  /**
   * 显示面板
   */
  show: function() {
    let self = getPanelController()
    
    self.view.hidden = false
    MNUtil.studyView.bringSubviewToFront(self.view)
    
    // 确保位置正确
    self.view.frame = self.currentFrame
  },
  
  /**
   * 隐藏面板
   */
  hide: function() {
    let self = getPanelController()
    self.view.hidden = true
  },
  
  // ========== 辅助方法 ==========
  
  /**
   * 创建按钮
   */
  createButton: function(name, action, superview) {
    let self = getPanelController()
    
    self[name] = UIButton.buttonWithType(0)
    self[name].autoresizingMask = (1 << 0 | 1 << 3)
    self[name].layer.cornerRadius = 8
    
    if (action && action !== "") {
      self[name].addTargetActionForControlEvents(self, action, 1 << 6)
    }
    
    if (superview) {
      superview.addSubview(self[name])
    }
    
    return self[name]
  }
})

// 类方法：创建新实例
panelController.new = function() {
  return panelController.alloc().init()
}