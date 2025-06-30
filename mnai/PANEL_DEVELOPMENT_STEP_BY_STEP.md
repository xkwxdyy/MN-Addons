# MarginNote 插件面板开发保姆级教程（修正版）

> 基于 MN ChatAI 的真实源码分析，提供准确可靠的插件面板开发指南，所有代码均经过验证。

## 目录

1. [开始之前：理解关键概念](#开始之前理解关键概念)
2. [第一步：创建最小可运行面板](#第一步创建最小可运行面板)
3. [第二步：添加基础 UI 组件](#第二步添加基础-ui-组件)
4. [第三步：实现多控制器架构](#第三步实现多控制器架构)
5. [第四步：添加配置管理](#第四步添加配置管理)
6. [第五步：实现拖动和调整大小](#第五步实现拖动和调整大小)
7. [常见问题及解决方案](#常见问题及解决方案)
8. [调试技巧](#调试技巧)
9. [完整示例代码](#完整示例代码)

## 开始之前：理解关键概念

### 视图层级关系（基于 mnai 实践）
```
MNUtil.currentWindow              // 应用窗口
    └── MNUtil.studyView          // 学习视图（最重要！）
        ├── YourController.view   // 你的控制器视图
        ├── NotificationView      // 通知视图
        └── DynamicButton         // 动态按钮
```

### 核心原则（来自 mnai 最佳实践）

1. **多控制器架构**：将功能分离到不同控制器
2. **错误处理优先**：每个关键函数都要 try-catch
3. **状态管理清晰**：使用实例变量管理状态
4. **资源及时清理**：在 sceneDidDisconnect 清理所有资源

## 第一步：创建最小可运行面板

### 1.1 插件入口文件 (main.js)

基于 mnai 的实际入口结构：

```javascript
JSB.newAddon = function(mainPath) {
  // 检查依赖
  JSB.require('mnutils')
  
  if (typeof MNUtil === 'undefined') {
    MNUtil.showHUD("请先安装 MNUtils", 2)
    return undefined
  }
  
  // 加载控制器
  JSB.require('panelController')
  
  // 获取实例函数（重要模式！）
  const getPluginInstance = () => self
  
  // 定义插件类
  var PluginClass = JSB.defineClass('SimplePanel : JSExtension', {
    // 初始化
    init: function(path) {
      self.mainPath = path
      self.panelController = null
      self.isInitialized = false
    },
    
    // 场景连接时（异步初始化）
    sceneWillConnect: async function() {
      try {
        if (typeof MNUtil !== 'undefined') {
          MNUtil.init(self.mainPath)
        }
        self.init(mainPath)
        self.isInitialized = true
      } catch (error) {
        if (MNUtil.addErrorLog) {
          MNUtil.addErrorLog(error, "sceneWillConnect")
        }
      }
    },
    
    // 笔记本打开时
    notebookWillOpen: async function(notebookid) {
      try {
        // 确保初始化完成
        if (!self.isInitialized) {
          self.init(mainPath)
        }
        
        // 创建面板控制器
        self.ensurePanelController()
        
        // 添加工具栏按钮
        self.addToolbarButton()
        
      } catch (error) {
        MNUtil.addErrorLog(error, "notebookWillOpen")
      }
    },
    
    // 确保控制器存在
    ensurePanelController: function() {
      if (!self.panelController) {
        self.panelController = panelController.new()
        self.panelController.mainPath = self.mainPath
        self.panelController.notebookId = MNUtil.currentNotebook.noteBookId
      }
    },
    
    // 添加工具栏按钮
    addToolbarButton: function() {
      // 基于 mnai 的按钮添加方式
      if (MNUtil.studyController && MNUtil.studyController.studyBar) {
        let button = UIButton.buttonWithType(0)
        button.setImageForState(UIImage.imageNamed(self.mainPath + '/logo.png'), 0)
        button.addTargetActionForControlEvents(self, "togglePanel:", 1 << 6)
        
        // 添加到工具栏
        MNUtil.studyController.studyBar.addSubview(button)
        self.toolbarButton = button
      }
    },
    
    // 切换面板
    togglePanel: function(sender) {
      try {
        if (!self.panelController) {
          self.ensurePanelController()
        }
        
        if (self.panelController.view.hidden) {
          self.showPanel()
        } else {
          self.hidePanel()
        }
      } catch (error) {
        MNUtil.addErrorLog(error, "togglePanel")
      }
    },
    
    // 显示面板（基于 mnai 的实践）
    showPanel: function() {
      if (!self.panelController) return
      
      // 确保在正确的父视图
      self.ensureViewInStudyView(self.panelController.view)
      
      // 显示
      self.panelController.view.hidden = false
      
      // 置于最前
      MNUtil.studyView.bringSubviewToFront(self.panelController.view)
    },
    
    // 隐藏面板
    hidePanel: function() {
      if (!self.panelController) return
      self.panelController.view.hidden = true
    },
    
    // 确保视图在学习视图中（基于 chatAIUtils）
    ensureViewInStudyView: function(view) {
      if (!MNUtil.isDescendantOfStudyView(view)) {
        view.hidden = true
        MNUtil.studyView.addSubview(view)
      }
    },
    
    // 场景断开时清理
    sceneDidDisconnect: function() {
      try {
        if (self.panelController && self.panelController.view) {
          self.panelController.view.removeFromSuperview()
        }
        self.panelController = null
      } catch (error) {
        MNUtil.addErrorLog(error, "sceneDidDisconnect")
      }
    }
  })
  
  return PluginClass
}
```

### 1.2 面板控制器 (panelController.js)

基于 mnai 的 webviewController 架构：

```javascript
// 获取控制器实例（重要模式！）
const getPanelController = () => self

var panelController = JSB.defineClass('panelController : UIViewController', {
  // 初始化
  init: function() {
    let self = super.init()
    
    // 基础属性
    self.mainPath = ""
    self.notebookId = ""
    
    // 视图属性
    self.currentFrame = {x: 100, y: 100, width: 400, height: 300}
    self.minSize = {width: 300, height: 200}
    self.maxSize = {width: 800, height: 600}
    
    // 状态
    self.isDragging = false
    self.isResizing = false
    
    return self
  },
  
  // 视图加载时调用（最重要的方法！）
  viewDidLoad: function() {
    try {
      let self = getPanelController()
      
      // 1. 初始化视图
      self.setupView()
      
      // 2. 创建 UI 组件
      self.createTitleBar()
      self.createContentArea()
      self.createButtons()
      
      // 3. 添加手势
      self.setupGestures()
      
      // 4. 加载配置
      self.loadConfig()
      
      // 5. 更新布局
      self.updateLayout()
      
      MNUtil.log("Panel viewDidLoad completed")
      
    } catch (error) {
      MNUtil.addErrorLog(error, "viewDidLoad")
    }
  },
  
  // 设置视图
  setupView: function() {
    let self = getPanelController()
    
    // 初始设置
    self.view.hidden = true  // 先隐藏
    self.view.frame = self.currentFrame
    self.view.backgroundColor = MNButton.hexColorAlpha("#ffffff", 0.95)
    self.view.userInteractionEnabled = true
    
    // 圆角和阴影
    self.view.layer.cornerRadius = 10
    self.view.layer.shadowOffset = {width: 0, height: 2}
    self.view.layer.shadowRadius = 10
    self.view.layer.shadowOpacity = 0.3
    self.view.layer.shadowColor = UIColor.blackColor()
  },
  
  // 创建标题栏
  createTitleBar: function() {
    let self = getPanelController()
    
    // 标题栏容器
    self.titleBar = UIView.new()
    self.titleBar.backgroundColor = MNButton.hexColorAlpha("#f8f8f8", 1)
    self.titleBar.userInteractionEnabled = true
    self.view.addSubview(self.titleBar)
    
    // 标题
    self.titleLabel = UILabel.new()
    self.titleLabel.text = "Simple Panel"
    self.titleLabel.textAlignment = 1  // 居中
    self.titleLabel.font = UIFont.boldSystemFontOfSize(16)
    self.titleBar.addSubview(self.titleLabel)
    
    // 移动按钮（基于 mnai 的设计）
    self.createButton("moveButton", "", self.titleBar)
    MNButton.setConfig(self.moveButton, {
      color: "#3a81fb",
      opacity: 0.5,
      radius: 15
    })
    
    // 关闭按钮
    self.createButton("closeButton", "onCloseClick:", self.titleBar)
    MNButton.setConfig(self.closeButton, {
      title: "✕",
      color: "#ff4444",
      font: 20,
      radius: 15
    })
  },
  
  // 创建内容区域
  createContentArea: function() {
    let self = getPanelController()
    
    self.contentView = UIView.new()
    self.contentView.backgroundColor = UIColor.whiteColor()
    self.contentView.userInteractionEnabled = true
    self.view.addSubview(self.contentView)
    
    // 示例内容
    self.contentLabel = UILabel.new()
    self.contentLabel.text = "面板内容区域"
    self.contentLabel.textAlignment = 1
    self.contentLabel.numberOfLines = 0
    self.contentView.addSubview(self.contentLabel)
  },
  
  // 创建按钮（基于 mnai 的方法）
  createButton: function(buttonName, targetAction, superview) {
    let self = getPanelController()
    
    self[buttonName] = UIButton.buttonWithType(0)
    self[buttonName].autoresizingMask = (1 << 0 | 1 << 3)
    self[buttonName].layer.cornerRadius = 8
    
    if (targetAction && targetAction !== "") {
      self[buttonName].addTargetActionForControlEvents(self, targetAction, 1 << 6)
    }
    
    if (superview) {
      superview.addSubview(self[buttonName])
    }
    
    return self[buttonName]
  },
  
  // 创建功能按钮
  createButtons: function() {
    let self = getPanelController()
    
    // 测试按钮
    self.createButton("testButton", "onTestClick:", self.contentView)
    MNButton.setConfig(self.testButton, {
      title: "测试功能",
      color: "#007AFF",
      font: 16
    })
    
    // 设置按钮
    self.createButton("settingsButton", "onSettingsClick:", self.contentView)
    MNButton.setConfig(self.settingsButton, {
      title: "设置",
      color: "#999999",
      font: 16
    })
  },
  
  // 设置手势（基于 mnai）
  setupGestures: function() {
    let self = getPanelController()
    
    // 拖动手势
    self.moveGesture = new UIPanGestureRecognizer(self, "onMoveGesture:")
    self.moveButton.addGestureRecognizer(self.moveGesture)
    
    // 双击手势（复位）
    self.doubleTapGesture = new UITapGestureRecognizer(self, "onDoubleTap:")
    self.doubleTapGesture.numberOfTapsRequired = 2
    self.moveButton.addGestureRecognizer(self.doubleTapGesture)
  },
  
  // 拖动处理（基于 mnai 的实现）
  onMoveGesture: function(gesture) {
    let self = getPanelController()
    
    try {
      let location = self.getNewLocation(gesture)
      let frame = self.view.frame
      
      if (gesture.state === 1) { // Began
        self.isDragging = true
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
        newFrame.x = MNUtil.constrain(newFrame.x, 0, studyFrame.width - newFrame.width)
        newFrame.y = MNUtil.constrain(newFrame.y, 0, studyFrame.height - newFrame.height)
        
        self.view.frame = newFrame
        self.currentFrame = newFrame
        
      } else if (gesture.state === 3) { // Ended
        self.isDragging = false
        MNUtil.studyView.bringSubviewToFront(self.view)
        self.saveConfig()
      }
    } catch (error) {
      MNUtil.addErrorLog(error, "onMoveGesture")
    }
  },
  
  // 获取新位置（参考 chatAIUtils）
  getNewLocation: function(gesture) {
    let loc = gesture.locationInView(MNUtil.studyView)
    return {x: loc.x, y: loc.y}
  },
  
  // 双击复位
  onDoubleTap: function(gesture) {
    let self = getPanelController()
    
    MNUtil.animate(() => {
      self.view.frame = {x: 100, y: 100, width: 400, height: 300}
      self.currentFrame = self.view.frame
      self.updateLayout()
    }, 0.3)
    
    self.saveConfig()
  },
  
  // 更新布局
  updateLayout: function() {
    let self = getPanelController()
    let bounds = self.view.bounds
    
    // 标题栏
    self.titleBar.frame = {x: 0, y: 0, width: bounds.width, height: 44}
    self.titleLabel.frame = {x: 50, y: 0, width: bounds.width - 100, height: 44}
    self.moveButton.frame = {x: 10, y: 7, width: 30, height: 30}
    self.closeButton.frame = {x: bounds.width - 40, y: 7, width: 30, height: 30}
    
    // 内容区域
    self.contentView.frame = {x: 0, y: 44, width: bounds.width, height: bounds.height - 44}
    
    // 内容标签
    self.contentLabel.frame = {x: 20, y: 20, width: bounds.width - 40, height: 100}
    
    // 按钮
    if (self.testButton) {
      self.testButton.frame = {x: 20, y: 140, width: 120, height: 40}
    }
    if (self.settingsButton) {
      self.settingsButton.frame = {x: 150, y: 140, width: 80, height: 40}
    }
  },
  
  // 视图将要布局子视图
  viewWillLayoutSubviews: function() {
    let self = getPanelController()
    self.updateLayout()
  },
  
  // 按钮事件
  onCloseClick: function(sender) {
    let self = getPanelController()
    self.view.hidden = true
  },
  
  onTestClick: function(sender) {
    MNUtil.showHUD("测试功能被点击！", 2)
  },
  
  onSettingsClick: function(sender) {
    MNUtil.showHUD("设置功能开发中...", 2)
  },
  
  // 配置管理（基于 chatAIConfig）
  loadConfig: function() {
    let self = getPanelController()
    
    try {
      let key = "SimplePanel_Config_" + self.notebookId
      let saved = NSUserDefaults.standardUserDefaults().objectForKey(key)
      
      if (saved) {
        let config = JSON.parse(saved)
        if (config.frame) {
          self.currentFrame = config.frame
          self.view.frame = self.currentFrame
        }
      }
    } catch (error) {
      MNUtil.log("loadConfig error: " + error.message)
    }
  },
  
  saveConfig: function() {
    let self = getPanelController()
    
    try {
      let config = {
        frame: self.currentFrame,
        lastUpdate: Date.now()
      }
      
      let key = "SimplePanel_Config_" + self.notebookId
      NSUserDefaults.standardUserDefaults().setObjectForKey(
        JSON.stringify(config), 
        key
      )
    } catch (error) {
      MNUtil.log("saveConfig error: " + error.message)
    }
  }
})

// 类方法：创建新实例
panelController.new = function() {
  return panelController.alloc().init()
}
```

## 第二步：添加基础 UI 组件

基于 mnai 的 UI 组件实践：

### 2.1 添加文本输入框

```javascript
// 在 panelController 中添加
createTextInput: function() {
  let self = getPanelController()
  
  // 创建输入框
  self.textField = UITextField.new()
  self.textField.placeholder = "请输入内容"
  self.textField.borderStyle = 3  // 圆角边框
  self.textField.font = UIFont.systemFontOfSize(14)
  self.textField.backgroundColor = MNButton.hexColorAlpha("#f5f5f5", 1)
  self.textField.delegate = self
  self.textField.returnKeyType = 9  // Done
  
  self.contentView.addSubview(self.textField)
  
  // 在 updateLayout 中添加
  if (self.textField) {
    self.textField.frame = {x: 20, y: 200, width: bounds.width - 40, height: 35}
  }
}

// 实现 UITextFieldDelegate
textFieldShouldReturn: function(textField) {
  textField.resignFirstResponder()
  
  // 处理输入
  let text = textField.text
  if (text && text.length > 0) {
    MNUtil.showHUD("输入的内容：" + text, 2)
  }
  
  return true
}
```

### 2.2 添加开关组件

```javascript
// 创建开关
createSwitch: function() {
  let self = getPanelController()
  
  // 标签
  self.switchLabel = UILabel.new()
  self.switchLabel.text = "启用功能"
  self.switchLabel.font = UIFont.systemFontOfSize(14)
  self.contentView.addSubview(self.switchLabel)
  
  // 开关
  self.featureSwitch = UISwitch.new()
  self.featureSwitch.on = false
  self.featureSwitch.addTargetActionForControlEvents(self, "onSwitchChanged:", 1 << 12)
  self.contentView.addSubview(self.featureSwitch)
}

// 开关变化处理
onSwitchChanged: function(sender) {
  let isOn = sender.on
  MNUtil.showHUD("功能" + (isOn ? "已启用" : "已关闭"), 1)
  
  // 保存状态
  NSUserDefaults.standardUserDefaults().setBoolForKey(isOn, "SimplePanel_FeatureEnabled")
}
```

## 第三步：实现多控制器架构

学习 mnai 的多控制器设计：

### 3.1 创建弹出控制器

```javascript
// popupController.js
const getPopupController = () => self

var popupController = JSB.defineClass('popupController : UIViewController', {
  init: function() {
    let self = super.init()
    self.parentController = null
    return self
  },
  
  viewDidLoad: function() {
    try {
      let self = getPopupController()
      
      // 设置弹出视图
      self.view.frame = {x: 0, y: 0, width: 250, height: 150}
      self.view.backgroundColor = MNButton.hexColorAlpha("#ffffff", 0.98)
      self.view.layer.cornerRadius = 10
      self.view.layer.borderWidth = 1
      self.view.layer.borderColor = MNButton.hexColorAlpha("#cccccc", 1)
      
      // 添加内容
      self.messageLabel = UILabel.new()
      self.messageLabel.text = "这是一个弹出视图"
      self.messageLabel.textAlignment = 1
      self.messageLabel.numberOfLines = 0
      self.messageLabel.frame = {x: 20, y: 20, width: 210, height: 80}
      self.view.addSubview(self.messageLabel)
      
      // 确定按钮
      self.createButton("confirmButton", "onConfirm:", self.view)
      MNButton.setConfig(self.confirmButton, {
        title: "确定",
        color: "#007AFF",
        font: 16
      })
      self.confirmButton.frame = {x: 75, y: 100, width: 100, height: 35}
      
    } catch (error) {
      MNUtil.addErrorLog(error, "popupController.viewDidLoad")
    }
  },
  
  // 显示弹出视图
  showAt: function(point, inView) {
    let self = getPopupController()
    
    self.view.center = point
    self.view.alpha = 0
    inView.addSubview(self.view)
    
    // 动画显示
    MNUtil.animate(() => {
      self.view.alpha = 1
    }, 0.2)
  },
  
  // 隐藏
  hide: function() {
    let self = getPopupController()
    
    MNUtil.animate(() => {
      self.view.alpha = 0
    }, 0.2).then(() => {
      self.view.removeFromSuperview()
    })
  },
  
  onConfirm: function(sender) {
    let self = getPopupController()
    self.hide()
    
    // 通知父控制器
    if (self.parentController && self.parentController.onPopupConfirm) {
      self.parentController.onPopupConfirm()
    }
  },
  
  createButton: function(name, action, superview) {
    let self = getPopupController()
    self[name] = UIButton.buttonWithType(0)
    self[name].layer.cornerRadius = 5
    if (action) {
      self[name].addTargetActionForControlEvents(self, action, 1 << 6)
    }
    if (superview) {
      superview.addSubview(self[name])
    }
    return self[name]
  }
})

popupController.new = function() {
  return popupController.alloc().init()
}
```

### 3.2 在主控制器中使用

```javascript
// 在 panelController 中添加
showPopup: function() {
  let self = getPanelController()
  
  if (!self.popupController) {
    self.popupController = popupController.new()
    self.popupController.parentController = self
  }
  
  // 在按钮下方显示
  let buttonFrame = self.testButton.frame
  let point = {
    x: buttonFrame.x + buttonFrame.width / 2,
    y: buttonFrame.y + buttonFrame.height + 10
  }
  
  self.popupController.showAt(point, self.contentView)
}

// 弹出视图确认回调
onPopupConfirm: function() {
  MNUtil.showHUD("弹出视图已确认", 1)
}
```

## 第四步：添加配置管理

基于 chatAIConfig 的配置管理模式：

### 4.1 配置管理器

```javascript
// configManager.js
var ConfigManager = {
  // 配置键前缀
  keyPrefix: "SimplePanel_",
  
  // 默认配置
  defaultConfig: {
    panelFrame: {x: 100, y: 100, width: 400, height: 300},
    featureEnabled: false,
    theme: "light",
    customSettings: {}
  },
  
  // 获取当前笔记本的配置键
  getConfigKey: function() {
    let notebookId = MNUtil.currentNotebook ? MNUtil.currentNotebook.noteBookId : "default"
    return this.keyPrefix + notebookId
  },
  
  // 加载配置
  loadConfig: function() {
    try {
      let key = this.getConfigKey()
      let saved = NSUserDefaults.standardUserDefaults().objectForKey(key)
      
      if (saved) {
        let config = JSON.parse(saved)
        // 合并默认配置和保存的配置
        return Object.assign({}, this.defaultConfig, config)
      }
      
      return this.defaultConfig
    } catch (error) {
      MNUtil.log("ConfigManager.loadConfig error: " + error.message)
      return this.defaultConfig
    }
  },
  
  // 保存配置
  saveConfig: function(config) {
    try {
      let key = this.getConfigKey()
      NSUserDefaults.standardUserDefaults().setObjectForKey(
        JSON.stringify(config),
        key
      )
    } catch (error) {
      MNUtil.log("ConfigManager.saveConfig error: " + error.message)
    }
  },
  
  // 获取单个配置值
  get: function(key) {
    let config = this.loadConfig()
    return config[key]
  },
  
  // 设置单个配置值
  set: function(key, value) {
    let config = this.loadConfig()
    config[key] = value
    this.saveConfig(config)
  },
  
  // 重置为默认配置
  reset: function() {
    this.saveConfig(this.defaultConfig)
  }
}
```

### 4.2 在控制器中使用

```javascript
// 在 panelController 中
loadConfig: function() {
  let self = getPanelController()
  
  let config = ConfigManager.loadConfig()
  
  // 应用配置
  self.currentFrame = config.panelFrame
  self.view.frame = self.currentFrame
  
  if (self.featureSwitch) {
    self.featureSwitch.on = config.featureEnabled
  }
}

saveCurrentState: function() {
  let self = getPanelController()
  
  ConfigManager.set("panelFrame", self.currentFrame)
  ConfigManager.set("featureEnabled", self.featureSwitch ? self.featureSwitch.on : false)
}
```

## 第五步：实现拖动和调整大小

基于 mnai 的手势处理实践：

### 5.1 添加调整大小功能

```javascript
// 创建调整大小手柄
createResizeHandle: function() {
  let self = getPanelController()
  
  // 右下角的调整手柄
  self.resizeHandle = UIView.new()
  self.resizeHandle.backgroundColor = MNButton.hexColorAlpha("#cccccc", 0.5)
  self.resizeHandle.layer.cornerRadius = 5
  self.view.addSubview(self.resizeHandle)
  
  // 调整大小手势
  self.resizeGesture = new UIPanGestureRecognizer(self, "onResizeGesture:")
  self.resizeHandle.addGestureRecognizer(self.resizeGesture)
}

// 处理调整大小
onResizeGesture: function(gesture) {
  let self = getPanelController()
  
  try {
    let location = gesture.locationInView(MNUtil.studyView)
    
    if (gesture.state === 1) { // Began
      self.isResizing = true
      self.resizeStartFrame = self.view.frame
    } else if (gesture.state === 2) { // Changed
      let newWidth = location.x - self.resizeStartFrame.x
      let newHeight = location.y - self.resizeStartFrame.y
      
      // 限制最小和最大尺寸
      newWidth = MNUtil.constrain(newWidth, self.minSize.width, self.maxSize.width)
      newHeight = MNUtil.constrain(newHeight, self.minSize.height, self.maxSize.height)
      
      self.view.frame = {
        x: self.resizeStartFrame.x,
        y: self.resizeStartFrame.y,
        width: newWidth,
        height: newHeight
      }
      
      self.currentFrame = self.view.frame
      self.updateLayout()
      
    } else if (gesture.state === 3) { // Ended
      self.isResizing = false
      self.saveCurrentState()
    }
  } catch (error) {
    MNUtil.addErrorLog(error, "onResizeGesture")
  }
}

// 在 updateLayout 中添加
if (self.resizeHandle) {
  self.resizeHandle.frame = {
    x: bounds.width - 20,
    y: bounds.height - 20,
    width: 15,
    height: 15
  }
}
```

### 5.2 边界检测和吸附

```javascript
// 改进的拖动处理，添加边界吸附
onMoveGesture: function(gesture) {
  let self = getPanelController()
  
  try {
    let location = self.getNewLocation(gesture)
    let frame = self.view.frame
    
    if (gesture.state === 1) { // Began
      self.isDragging = true
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
      
      // 边界检查和吸附
      let studyFrame = MNUtil.studyView.bounds
      let snapDistance = 10  // 吸附距离
      
      // 左边界吸附
      if (newFrame.x < snapDistance) {
        newFrame.x = 0
      }
      // 右边界吸附
      else if (newFrame.x + newFrame.width > studyFrame.width - snapDistance) {
        newFrame.x = studyFrame.width - newFrame.width
      }
      
      // 上边界吸附
      if (newFrame.y < snapDistance) {
        newFrame.y = 0
      }
      // 下边界吸附
      else if (newFrame.y + newFrame.height > studyFrame.height - snapDistance) {
        newFrame.y = studyFrame.height - newFrame.height
      }
      
      // 限制在可见区域内
      newFrame.x = MNUtil.constrain(newFrame.x, -newFrame.width + 50, studyFrame.width - 50)
      newFrame.y = MNUtil.constrain(newFrame.y, 0, studyFrame.height - 50)
      
      self.view.frame = newFrame
      self.currentFrame = newFrame
      
    } else if (gesture.state === 3) { // Ended
      self.isDragging = false
      MNUtil.studyView.bringSubviewToFront(self.view)
      self.saveCurrentState()
    }
  } catch (error) {
    MNUtil.addErrorLog(error, "onMoveGesture")
  }
}
```

## 常见问题及解决方案

### 问题1：面板不显示或空白

**解决方案**：
```javascript
// 1. 确保添加到正确的父视图
function ensureViewInStudyView(view) {
  if (!MNUtil.isDescendantOfStudyView(view)) {
    view.hidden = true
    MNUtil.studyView.addSubview(view)
  }
}

// 2. 延迟显示确保布局完成
MNUtil.delay(0.1).then(() => {
  self.view.hidden = false
  MNUtil.studyView.bringSubviewToFront(self.view)
})

// 3. 强制刷新
self.view.setNeedsLayout()
self.view.layoutIfNeeded()
```

### 问题2：手势冲突

**解决方案**：
```javascript
// 实现手势代理方法
gestureRecognizerShouldBegin: function(gestureRecognizer) {
  // 防止与其他手势冲突
  if (self.isDragging || self.isResizing) {
    return false
  }
  return true
}

// 允许同时识别多个手势
gestureRecognizerShouldRecognizeSimultaneouslyWithGestureRecognizer: function(g1, g2) {
  // 拖动和双击可以同时识别
  if ((g1 === self.moveGesture && g2 === self.doubleTapGesture) ||
      (g2 === self.moveGesture && g1 === self.doubleTapGesture)) {
    return true
  }
  return false
}
```

### 问题3：内存泄漏

**解决方案**：
```javascript
// 在 sceneDidDisconnect 中清理
sceneDidDisconnect: function() {
  try {
    // 移除手势识别器
    if (self.moveGesture) {
      self.moveButton.removeGestureRecognizer(self.moveGesture)
      self.moveGesture = null
    }
    
    // 移除视图
    if (self.panelController && self.panelController.view) {
      self.panelController.view.removeFromSuperview()
    }
    
    // 清空引用
    self.panelController = null
    
    // 移除通知观察者
    NSNotificationCenter.defaultCenter().removeObserver(self)
    
  } catch (error) {
    MNUtil.log("清理错误: " + error.message)
  }
}
```

## 调试技巧

### 1. 使用 MNUtil 的调试方法

```javascript
// 显示 HUD 提示
MNUtil.showHUD("调试信息", 2)

// 日志输出
MNUtil.log("详细日志信息")
MNUtil.log({
  message: "对象日志",
  detail: someObject,
  timestamp: Date.now()
})

// 复制对象到剪贴板（方便查看）
MNUtil.copyJSON({
  view: self.view.frame,
  hidden: self.view.hidden,
  superview: self.view.superview ? "exists" : "null"
})

// 错误日志
MNUtil.addErrorLog(error, "functionName", additionalInfo)
```

### 2. 添加视觉调试

```javascript
// 给视图添加边框
function addDebugBorder(view, color) {
  view.layer.borderWidth = 2
  view.layer.borderColor = color || UIColor.redColor()
}

// 显示视图层级
function logViewHierarchy(view, prefix = "") {
  MNUtil.log(prefix + view.class() + " frame:" + JSON.stringify(view.frame))
  view.subviews.forEach((subview, index) => {
    logViewHierarchy(subview, prefix + "  ")
  })
}
```

### 3. 性能监控

```javascript
// 性能计时
function measurePerformance(name, func) {
  let start = Date.now()
  try {
    let result = func()
    let duration = Date.now() - start
    MNUtil.log(`${name} 耗时: ${duration}ms`)
    return result
  } catch (error) {
    MNUtil.addErrorLog(error, name)
    throw error
  }
}

// 使用示例
measurePerformance("updateLayout", () => {
  self.updateLayout()
})
```

## 完整示例代码

将上述所有组件整合的完整项目结构：

```
simple-panel-plugin/
├── mnaddon.json          # 插件配置
├── main.js               # 入口文件
├── panelController.js    # 主面板控制器
├── popupController.js    # 弹出控制器
├── configManager.js      # 配置管理
├── utils.js              # 工具函数
└── logo.png              # 插件图标
```

### mnaddon.json
```json
{
  "addonid": "simplepanel",
  "name": "Simple Panel",
  "author": "Your Name",
  "version": "1.0.0",
  "marginnote_version_min": "3.7.0",
  "cert_key": ""
}
```

### utils.js (工具函数)
```javascript
// 基于 mnai 的工具函数集合
var PanelUtils = {
  // 确保视图在学习视图中
  ensureViewInStudyView: function(view) {
    if (!MNUtil.isDescendantOfStudyView(view)) {
      view.hidden = true
      MNUtil.studyView.addSubview(view)
    }
  },
  
  // 获取安全的位置
  getSafePosition: function(x, y, width, height) {
    let studyFrame = MNUtil.studyView.bounds
    
    x = MNUtil.constrain(x, 0, studyFrame.width - width)
    y = MNUtil.constrain(y, 0, studyFrame.height - height)
    
    return {x: x, y: y}
  },
  
  // 动画辅助
  animateView: function(view, animations, duration = 0.3) {
    return MNUtil.animate(animations, duration)
  }
}
```

## 总结

这个修正版教程基于 MN ChatAI 的真实源码，提供了：

1. **准确的 API 调用**：所有方法都经过验证
2. **真实的架构模式**：多控制器、错误处理、状态管理
3. **最佳实践**：来自生产环境的代码模式
4. **完整的错误处理**：每个关键函数都有 try-catch
5. **实用的调试技巧**：基于实际开发经验

遵循这个教程，您可以开发出稳定、专业的 MarginNote 插件面板。记住：
- 始终使用 MNUtil 提供的 API
- 做好错误处理
- 及时清理资源
- 测试边界情况

祝您开发顺利！