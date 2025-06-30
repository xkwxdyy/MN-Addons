/**
 * 浮动面板控制器
 * 展示可收缩展开的浮动按钮
 */

// 获取控制器实例
const getFloatController = () => self

var floatController = JSB.defineClass('floatController : UIViewController', {
  
  // ========== 初始化 ==========
  
  init: function() {
    let self = super.init()
    
    self.mainPath = ""
    self.parent = null
    
    // 初始位置
    self.currentFrame = TaskConfig.getPanelFrame("floatPanel") || 
                       {x: 200, y: 200, width: 60, height: 60}
    
    // 状态
    self.isExpanded = false
    self.isDragging = false
    
    return self
  },
  
  // ========== 生命周期 ==========
  
  viewDidLoad: function() {
    try {
      let self = getFloatController()
      
      // 设置基础视图
      self.setupView()
      
      // 创建UI
      self.createFloatButton()
      self.createExpandedView()
      
      // 添加手势
      self.setupGestures()
      
      // 初始状态
      self.setExpanded(false, false)
      
      TaskUtils.log("🎈 浮动面板加载完成")
      
    } catch (error) {
      TaskUtils.addErrorLog(error, "floatController.viewDidLoad")
    }
  },
  
  viewWillLayoutSubviews: function() {
    let self = getFloatController()
    self.updateLayout()
  },
  
  // ========== 视图设置 ==========
  
  setupView: function() {
    let self = getFloatController()
    
    self.view.hidden = true
    self.view.frame = self.currentFrame
    self.view.backgroundColor = TaskUtils.hexColorAlpha("#007AFF", 0.9)
    self.view.layer.cornerRadius = 30
    self.view.layer.shadowOffset = {width: 0, height: 2}
    self.view.layer.shadowRadius = 5
    self.view.layer.shadowOpacity = 0.3
    self.view.layer.shadowColor = UIColor.blackColor()
  },
  
  createFloatButton: function() {
    let self = getFloatController()
    
    // 浮动按钮
    self.floatButton = UIButton.buttonWithType(0)
    self.floatButton.setTitleForState("🚀", 0)
    self.floatButton.titleLabel.font = UIFont.systemFontOfSize(30)
    self.floatButton.addTargetActionForControlEvents(self, "onFloatButtonClick:", 1 << 6)
    self.view.addSubview(self.floatButton)
  },
  
  createExpandedView: function() {
    let self = getFloatController()
    
    // 展开后的内容容器
    self.expandedContainer = UIView.new()
    self.expandedContainer.backgroundColor = UIColor.clearColor()
    self.expandedContainer.hidden = true
    self.view.addSubview(self.expandedContainer)
    
    // 功能按钮
    let buttons = [
      {icon: "📋", title: "任务", action: "openTasks:"},
      {icon: "🔍", title: "搜索", action: "openSearch:"},
      {icon: "⚡", title: "快捷", action: "openQuick:"},
      {icon: "❌", title: "关闭", action: "closeFloat:"}
    ]
    
    self.actionButtons = []
    buttons.forEach((btn, index) => {
      let button = UIButton.buttonWithType(0)
      button.setTitleForState(btn.icon, 0)
      button.titleLabel.font = UIFont.systemFontOfSize(25)
      button.backgroundColor = TaskUtils.hexColorAlpha("#ffffff", 0.9)
      button.layer.cornerRadius = 25
      button.addTargetActionForControlEvents(self, btn.action, 1 << 6)
      self.expandedContainer.addSubview(button)
      
      self.actionButtons.push(button)
    })
    
    // 提示标签
    self.hintLabel = UILabel.new()
    self.hintLabel.text = "拖动移动位置"
    self.hintLabel.font = UIFont.systemFontOfSize(12)
    self.hintLabel.textColor = UIColor.whiteColor()
    self.hintLabel.textAlignment = 1
    self.hintLabel.hidden = true
    self.expandedContainer.addSubview(self.hintLabel)
  },
  
  // ========== 手势处理 ==========
  
  setupGestures: function() {
    let self = getFloatController()
    
    // 拖动手势
    self.moveGesture = new UIPanGestureRecognizer(self, "onMoveGesture:")
    self.view.addGestureRecognizer(self.moveGesture)
    
    // 长按手势（显示提示）
    self.longPressGesture = new UILongPressGestureRecognizer(self, "onLongPress:")
    self.longPressGesture.minimumPressDuration = 0.5
    self.view.addGestureRecognizer(self.longPressGesture)
  },
  
  onMoveGesture: function(gesture) {
    let self = getFloatController()
    
    try {
      let location = gesture.locationInView(MNUtil.studyView)
      
      if (gesture.state === 1) { // Began
        self.isDragging = true
        self.dragStartLocation = location
        self.dragStartFrame = self.view.frame
      } else if (gesture.state === 2) { // Changed
        let deltaX = location.x - self.dragStartLocation.x
        let deltaY = location.y - self.dragStartLocation.y
        
        let newCenter = {
          x: self.dragStartFrame.x + self.dragStartFrame.width/2 + deltaX,
          y: self.dragStartFrame.y + self.dragStartFrame.height/2 + deltaY
        }
        
        // 边界吸附
        let studyFrame = MNUtil.studyView.bounds
        let snapDistance = 20
        
        // 左边吸附
        if (newCenter.x < snapDistance + self.view.frame.width/2) {
          newCenter.x = self.view.frame.width/2
        }
        // 右边吸附
        else if (newCenter.x > studyFrame.width - snapDistance - self.view.frame.width/2) {
          newCenter.x = studyFrame.width - self.view.frame.width/2
        }
        
        // 上边吸附
        if (newCenter.y < snapDistance + self.view.frame.height/2) {
          newCenter.y = self.view.frame.height/2
        }
        // 下边吸附
        else if (newCenter.y > studyFrame.height - snapDistance - self.view.frame.height/2) {
          newCenter.y = studyFrame.height - self.view.frame.height/2
        }
        
        self.view.center = newCenter
        
      } else if (gesture.state === 3) { // Ended
        self.isDragging = false
        
        // 保存位置
        self.currentFrame = self.view.frame
        TaskConfig.savePanelFrame("floatPanel", {
          x: self.view.center.x - 30,
          y: self.view.center.y - 30,
          width: 60,
          height: 60
        })
      }
    } catch (error) {
      TaskUtils.addErrorLog(error, "floatController.onMoveGesture")
    }
  },
  
  onLongPress: function(gesture) {
    let self = getFloatController()
    
    if (gesture.state === 1) { // Began
      self.hintLabel.hidden = false
      self.hintLabel.alpha = 0
      
      TaskUtils.animate(() => {
        self.hintLabel.alpha = 1
      }, 0.2)
      
      // 3秒后自动隐藏
      TaskUtils.delay(3).then(() => {
        TaskUtils.animate(() => {
          self.hintLabel.alpha = 0
        }, 0.2).then(() => {
          self.hintLabel.hidden = true
        })
      })
    }
  },
  
  // ========== 展开/收缩 ==========
  
  setExpanded: function(expanded, animated = true) {
    let self = getFloatController()
    
    self.isExpanded = expanded
    
    if (animated) {
      TaskUtils.animate(() => {
        if (expanded) {
          // 展开
          self.view.frame = {
            x: self.currentFrame.x,
            y: self.currentFrame.y,
            width: 240,
            height: 200
          }
          self.view.layer.cornerRadius = 20
          self.view.backgroundColor = TaskUtils.hexColorAlpha("#f0f0f0", 0.95)
          
          self.floatButton.alpha = 0
          self.expandedContainer.alpha = 1
        } else {
          // 收缩
          self.view.frame = self.currentFrame
          self.view.layer.cornerRadius = 30
          self.view.backgroundColor = TaskUtils.hexColorAlpha("#007AFF", 0.9)
          
          self.floatButton.alpha = 1
          self.expandedContainer.alpha = 0
        }
        
        self.updateLayout()
      }, 0.3).then(() => {
        self.floatButton.hidden = expanded
        self.expandedContainer.hidden = !expanded
      })
    } else {
      // 无动画
      if (expanded) {
        self.view.frame = {
          x: self.currentFrame.x,
          y: self.currentFrame.y,
          width: 240,
          height: 200
        }
        self.view.layer.cornerRadius = 20
        self.view.backgroundColor = TaskUtils.hexColorAlpha("#f0f0f0", 0.95)
      } else {
        self.view.frame = self.currentFrame
        self.view.layer.cornerRadius = 30
        self.view.backgroundColor = TaskUtils.hexColorAlpha("#007AFF", 0.9)
      }
      
      self.floatButton.hidden = expanded
      self.expandedContainer.hidden = !expanded
      self.updateLayout()
    }
  },
  
  // ========== 布局 ==========
  
  updateLayout: function() {
    let self = getFloatController()
    let bounds = self.view.bounds
    
    if (self.isExpanded) {
      // 展开状态布局
      self.expandedContainer.frame = bounds
      
      // 功能按钮
      let buttonSize = 50
      let spacing = 20
      let startX = (bounds.width - buttonSize * 4 - spacing * 3) / 2
      let y = 40
      
      self.actionButtons.forEach((button, index) => {
        button.frame = {
          x: startX + (buttonSize + spacing) * index,
          y: y,
          width: buttonSize,
          height: buttonSize
        }
      })
      
      // 提示标签
      self.hintLabel.frame = {
        x: 20,
        y: bounds.height - 40,
        width: bounds.width - 40,
        height: 20
      }
      
    } else {
      // 收缩状态
      self.floatButton.frame = bounds
    }
  },
  
  // ========== 事件处理 ==========
  
  onFloatButtonClick: function(sender) {
    let self = getFloatController()
    
    if (!self.isDragging) {
      self.setExpanded(true)
    }
  },
  
  openTasks: function(sender) {
    let self = getFloatController()
    
    // 收缩浮动面板
    self.setExpanded(false)
    
    // 打开主面板
    if (self.parent) {
      self.parent.openMainPanel()
    }
  },
  
  openSearch: function(sender) {
    TaskUtils.showHUD("🔍 搜索功能开发中...")
  },
  
  openQuick: function(sender) {
    TaskUtils.showHUD("⚡ 快捷功能开发中...")
  },
  
  closeFloat: function(sender) {
    let self = getFloatController()
    self.setExpanded(false)
  },
  
  // ========== 显示/隐藏 ==========
  
  show: function() {
    let self = getFloatController()
    
    self.view.hidden = false
    MNUtil.studyView.bringSubviewToFront(self.view)
    
    // 恢复位置
    if (self.isExpanded) {
      self.view.frame = {
        x: self.currentFrame.x,
        y: self.currentFrame.y,
        width: 240,
        height: 200
      }
    } else {
      self.view.frame = self.currentFrame
    }
  },
  
  hide: function() {
    let self = getFloatController()
    self.view.hidden = true
    
    // 如果是展开状态，先收缩
    if (self.isExpanded) {
      self.setExpanded(false, false)
    }
  }
})

// 类方法
floatController.new = function() {
  return floatController.alloc().init()
}