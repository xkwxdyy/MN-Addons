/**
 * 设置面板控制器
 * 展示设置界面的实现
 */

// 获取控制器实例
const getSettingsController = () => self

var settingsController = JSB.defineClass('settingsController : UIViewController', {
  
  // ========== 初始化 ==========
  
  init: function() {
    let self = super.init()
    
    self.mainPath = ""
    self.parent = null
    
    self.currentFrame = TaskConfig.getPanelFrame("settingsPanel") || 
                       {x: 150, y: 150, width: 400, height: 450}
    
    return self
  },
  
  // ========== 生命周期 ==========
  
  viewDidLoad: function() {
    try {
      let self = getSettingsController()
      
      // 设置基础视图
      self.setupView()
      
      // 创建UI
      self.createTitleBar()
      self.createSettingsContent()
      
      // 添加手势
      self.setupGestures()
      
      TaskUtils.log("⚙️ 设置面板加载完成")
      
    } catch (error) {
      TaskUtils.addErrorLog(error, "settingsController.viewDidLoad")
    }
  },
  
  viewWillLayoutSubviews: function() {
    let self = getSettingsController()
    self.updateLayout()
  },
  
  // ========== 视图设置 ==========
  
  setupView: function() {
    let self = getSettingsController()
    
    self.view.hidden = true
    self.view.frame = self.currentFrame
    self.view.backgroundColor = TaskUtils.hexColorAlpha("#ffffff", 0.95)
    
    // 圆角和阴影
    self.view.layer.cornerRadius = 10
    self.view.layer.shadowOffset = {width: 0, height: 2}
    self.view.layer.shadowRadius = 10
    self.view.layer.shadowOpacity = 0.3
    self.view.layer.shadowColor = UIColor.blackColor()
  },
  
  createTitleBar: function() {
    let self = getSettingsController()
    
    // 标题栏
    self.titleBar = UIView.new()
    self.titleBar.backgroundColor = TaskUtils.hexColorAlpha("#f8f8f8", 1)
    self.view.addSubview(self.titleBar)
    
    // 标题
    self.titleLabel = UILabel.new()
    self.titleLabel.text = "⚙️ 设置"
    self.titleLabel.textAlignment = 1
    self.titleLabel.font = UIFont.boldSystemFontOfSize(16)
    self.titleBar.addSubview(self.titleLabel)
    
    // 关闭按钮
    self.closeButton = UIButton.buttonWithType(0)
    self.closeButton.setTitleForState("✕", 0)
    self.closeButton.titleLabel.font = UIFont.systemFontOfSize(20)
    self.closeButton.addTargetActionForControlEvents(self, "onClose:", 1 << 6)
    self.closeButton.backgroundColor = UIColor.colorWithHexString("#ff4444")
    self.closeButton.layer.cornerRadius = 15
    self.titleBar.addSubview(self.closeButton)
  },
  
  createSettingsContent: function() {
    let self = getSettingsController()
    
    // 滚动视图
    self.scrollView = UIScrollView.new()
    self.scrollView.backgroundColor = UIColor.whiteColor()
    self.scrollView.alwaysBounceVertical = true
    self.view.addSubview(self.scrollView)
    
    // 设置项
    let y = 20
    
    // 主题设置
    self.createSectionTitle("主题设置", y)
    y += 40
    
    self.createRadioGroup("theme", ["浅色", "深色", "自动"], 
                         TaskConfig.get("ui.theme") === "dark" ? 1 : 0, y)
    y += 50
    
    // 功能设置
    self.createSectionTitle("功能设置", y)
    y += 40
    
    self.createSwitch("autoProcess", "自动处理新摘录", 
                     TaskConfig.get("features.autoProcessNewExcerpt"), y)
    y += 40
    
    self.createSwitch("showFloat", "显示浮动按钮", 
                     TaskConfig.get("features.showFloatButton"), y)
    y += 40
    
    self.createSwitch("shortcuts", "启用快捷键", 
                     TaskConfig.get("features.enableShortcuts"), y)
    y += 60
    
    // 关于
    self.createSectionTitle("关于", y)
    y += 40
    
    let aboutLabel = UILabel.new()
    aboutLabel.text = "MN Task v1.0.0\n一个简洁的 MarginNote 插件框架示例"
    aboutLabel.numberOfLines = 0
    aboutLabel.textAlignment = 1
    aboutLabel.font = UIFont.systemFontOfSize(14)
    aboutLabel.textColor = UIColor.grayColor()
    aboutLabel.frame = {x: 20, y: y, width: 360, height: 60}
    self.scrollView.addSubview(aboutLabel)
    
    y += 80
    
    // 设置内容大小
    self.scrollView.contentSize = {width: 400, height: y}
  },
  
  // ========== UI 组件创建 ==========
  
  createSectionTitle: function(title, y) {
    let self = getSettingsController()
    
    let label = UILabel.new()
    label.text = title
    label.font = UIFont.boldSystemFontOfSize(16)
    label.textColor = UIColor.colorWithHexString("#333333")
    label.frame = {x: 20, y: y, width: 200, height: 30}
    self.scrollView.addSubview(label)
  },
  
  createSwitch: function(key, title, value, y) {
    let self = getSettingsController()
    
    // 标签
    let label = UILabel.new()
    label.text = title
    label.font = UIFont.systemFontOfSize(14)
    label.frame = {x: 20, y: y, width: 250, height: 30}
    self.scrollView.addSubview(label)
    
    // 开关
    let switchView = UISwitch.new()
    switchView.on = value
    switchView.frame = {x: 320, y: y, width: 60, height: 30}
    switchView.addTargetActionForControlEvents(self, "onSwitchChanged:", 1 << 12)
    switchView.tag = key.hashCode ? key.hashCode() : 0
    self.scrollView.addSubview(switchView)
    
    self["switch_" + key] = switchView
  },
  
  createRadioGroup: function(key, options, selectedIndex, y) {
    let self = getSettingsController()
    
    let x = 20
    options.forEach((option, index) => {
      let button = UIButton.buttonWithType(0)
      button.setTitleForState(option, 0)
      button.setTitleColorForState(UIColor.blackColor(), 0)
      button.backgroundColor = index === selectedIndex ? 
                              UIColor.colorWithHexString("#007AFF") :
                              UIColor.colorWithHexString("#e0e0e0")
      button.layer.cornerRadius = 15
      button.titleLabel.font = UIFont.systemFontOfSize(14)
      button.frame = {x: x, y: y, width: 80, height: 30}
      button.tag = index
      button.addTargetActionForControlEvents(self, "onRadioChanged:", 1 << 6)
      self.scrollView.addSubview(button)
      
      self["radio_" + key + "_" + index] = button
      x += 90
    })
  },
  
  // ========== 手势处理 ==========
  
  setupGestures: function() {
    let self = getSettingsController()
    
    // 拖动手势
    self.moveGesture = new UIPanGestureRecognizer(self, "onMoveGesture:")
    self.titleBar.addGestureRecognizer(self.moveGesture)
  },
  
  onMoveGesture: function(gesture) {
    let self = getSettingsController()
    
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
        TaskConfig.savePanelFrame("settingsPanel", self.currentFrame)
      }
    } catch (error) {
      TaskUtils.addErrorLog(error, "settingsController.onMoveGesture")
    }
  },
  
  // ========== 布局 ==========
  
  updateLayout: function() {
    let self = getSettingsController()
    let bounds = self.view.bounds
    
    // 标题栏
    self.titleBar.frame = {x: 0, y: 0, width: bounds.width, height: 44}
    self.titleLabel.frame = {x: 50, y: 0, width: bounds.width - 100, height: 44}
    self.closeButton.frame = {x: bounds.width - 40, y: 7, width: 30, height: 30}
    
    // 滚动视图
    self.scrollView.frame = {x: 0, y: 44, width: bounds.width, height: bounds.height - 44}
  },
  
  // ========== 事件处理 ==========
  
  onClose: function(sender) {
    let self = getSettingsController()
    self.hide()
  },
  
  onSwitchChanged: function(sender) {
    let isOn = sender.on
    
    // 根据 tag 确定是哪个开关
    if (sender === self.switch_autoProcess) {
      TaskConfig.set("features.autoProcessNewExcerpt", isOn)
      TaskUtils.showHUD("自动处理新摘录: " + (isOn ? "开启" : "关闭"))
    } else if (sender === self.switch_showFloat) {
      TaskConfig.set("features.showFloatButton", isOn)
      TaskUtils.showHUD("浮动按钮: " + (isOn ? "显示" : "隐藏"))
    } else if (sender === self.switch_shortcuts) {
      TaskConfig.set("features.enableShortcuts", isOn)
      TaskUtils.showHUD("快捷键: " + (isOn ? "启用" : "禁用"))
    }
  },
  
  onRadioChanged: function(sender) {
    let self = getSettingsController()
    let index = sender.tag
    
    // 更新主题设置
    let themes = ["light", "dark", "auto"]
    TaskConfig.set("ui.theme", themes[index])
    
    // 更新按钮状态
    for (let i = 0; i < 3; i++) {
      let button = self["radio_theme_" + i]
      if (button) {
        button.backgroundColor = i === index ?
                                UIColor.colorWithHexString("#007AFF") :
                                UIColor.colorWithHexString("#e0e0e0")
      }
    }
    
    TaskUtils.showHUD("主题已更改为: " + ["浅色", "深色", "自动"][index])
  },
  
  // ========== 显示/隐藏 ==========
  
  show: function() {
    let self = getSettingsController()
    
    self.view.hidden = false
    MNUtil.studyView.bringSubviewToFront(self.view)
    self.view.frame = self.currentFrame
  },
  
  hide: function() {
    let self = getSettingsController()
    self.view.hidden = true
  }
})

// 类方法
settingsController.new = function() {
  return settingsController.alloc().init()
}