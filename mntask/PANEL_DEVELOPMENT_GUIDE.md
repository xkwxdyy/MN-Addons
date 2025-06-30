# MarginNote 插件面板开发完全指南

> 基于 MN ChatAI 项目的深度分析，本指南详细介绍了 MarginNote 插件面板开发的方方面面，包括各种UI组件、交互模式、配置管理、数据同步等核心技术。

## 目录

1. [架构概述](#架构概述)
2. [面板类型与实现](#面板类型与实现)
3. [UI 组件开发](#ui-组件开发)
4. [布局管理](#布局管理)
5. [手势与交互](#手势与交互)
6. [配置管理系统](#配置管理系统)
7. [数据同步机制](#数据同步机制)
8. [WebView 集成](#webview-集成)
9. [最佳实践](#最佳实践)
10. [常见问题与解决方案](#常见问题与解决方案)

## 架构概述

### 多控制器架构

MN ChatAI 采用多控制器分离设计，每个控制器负责独立的功能模块：

```javascript
// 主控制器
MNChatglm (主插件入口)
├── webviewController      // 主设置面板
├── notificationController // 通知对话框
├── dynamicController      // 动态浮动按钮
└── sideOutputController   // MN4 侧边栏面板
```

### 控制器基类

所有控制器都继承自 UIViewController：

```javascript
JSB.defineClass('ControllerName : UIViewController <DelegateProtocols>', {
  // 实例方法
}, {
  // 类方法
})
```

### 生命周期管理

```javascript
// 视图加载
viewDidLoad: function() {
  // 初始化UI组件
  // 设置默认状态
  // 添加手势识别器
}

// 视图即将显示
viewWillAppear: function(animated) {
  // 更新数据
  // 刷新UI
}

// 布局子视图
viewWillLayoutSubviews: function() {
  // 调整布局
  // 响应窗口变化
}
```

## 面板类型与实现

### 1. 主设置面板（webviewController）

主设置面板是插件的核心配置界面，采用多页签设计：

```javascript
// 创建设置视图
createSettingView: function() {
  // 创建容器视图
  self.creatView("settingView")
  self.settingView.backgroundColor = MNUtil.hexColorAlpha("#ecf3fc", 0.9)
  
  // 创建标签页按钮
  self.createButton("configButton", "configButtonTapped:")
  self.createButton("modelTab", "modelTabTapped:")
  self.createButton("customButtonTab", "customButtonTabTapped:")
  self.createButton("triggerButton", "triggerButtonTapped:")
  self.createButton("syncConfig", "syncConfigTapped:")
  self.createButton("advancedButton", "advancedButtonTapped:")
  
  // 创建各个页面的内容视图
  self.createConfigView()    // Prompt 配置页
  self.createModelView()      // 模型设置页
  self.createCustomView()     // 自定义按钮页
  self.createTriggerView()    // 触发器设置页
  self.createSyncView()       // 同步设置页
  self.createAdvancedView()   // 高级设置页
}

// 页面切换逻辑
switchView: function(viewName) {
  // 隐藏所有视图
  self.configView.hidden = true
  self.modelView.hidden = true
  self.customButtonView.hidden = true
  self.autoActionView.hidden = true
  self.syncView.hidden = true
  self.advanceView.hidden = true
  
  // 显示目标视图
  self[viewName].hidden = false
  
  // 更新按钮状态
  self.updateTabButtonStates(viewName)
}
```

### 2. 通知对话框（notificationController）

通知对话框用于显示 AI 响应，支持动画效果和位置记忆：

```javascript
// 显示通知
show: function(notifyLoc, fromOutside = true, maintainHeight = false) {
  self.onAnimate = true
  
  // 计算目标位置
  let targetHeight = maintainHeight ? self.currentFrame.height : 120
  self.currentFrame.height = targetHeight
  
  // 根据位置设置初始frame（用于动画）
  switch (self.notifyLoc) {
    case 0: // 左侧
      self.currentFrame.x = chatAIUtils.getX()
      if (fromOutside) {
        self.view.frame = {x: -300, y: chatAIUtils.getY(), width: chatAIUtils.getWidth(), height: targetHeight}
      }
      break
    case 1: // 右侧
      self.currentFrame.x = windowFrame.width - 450
      if (fromOutside) {
        self.view.frame = {x: windowFrame.width, y: chatAIUtils.getY(), width: chatAIUtils.getWidth(), height: targetHeight}
      }
      break
  }
  
  // 执行动画
  self.view.hidden = false
  MNUtil.animate(() => {
    self.view.layer.opacity = preOpacity
    self.view.frame = preFrame
  }, 0.4).then(() => {
    self.onAnimate = false
  })
}
```

### 3. 动态浮动按钮（dynamicController）

动态按钮提供快速访问功能，支持拖动和展开：

```javascript
// 设置布局
setLayout: async function(frame) {
  return new Promise((resolve, reject) => {
    self.lastFrame = frame
    self.view.hidden = false
    
    if (self.onClick || self.pinned) {
      // 展开状态
      self.lastFrame.width = 300
      self.lastFrame.height = 215
      self.view.backgroundColor = MNUtil.hexColorAlpha("#ecf3fc", 0.95)
      
      // 显示所有控件
      self.aiButton.hidden = true
      self.closeButton.hidden = false
      self.sendButton.hidden = false
      self.promptInput.hidden = false
      self.scrollview.hidden = false
      
      // 动画展开
      MNUtil.animate(() => {
        self.view.frame = self.lastFrame
      }, 0.2).then(() => {
        self.onClick = false
        resolve()
      })
    } else {
      // 收缩状态
      self.lastFrame.width = 64
      self.lastFrame.height = 35
      self.view.backgroundColor = MNUtil.hexColorAlpha("#e4eeff", 0.55)
      
      // 隐藏控件
      self.aiButton.hidden = false
      self.closeButton.hidden = true
      self.sendButton.hidden = true
      self.promptInput.hidden = true
      self.scrollview.hidden = true
      
      self.view.frame = self.lastFrame
      resolve()
    }
  })
}

// 拖动手势处理
onMoveGesture: function(gesture) {
  self.pinned = true
  let location = chatAIUtils.getNewLoc(gesture)
  let frame = self.view.frame
  frame.x = location.x
  frame.y = location.y
  self.setFrame(frame)
}
```

### 4. 侧边栏面板（sideOutputController）

MN4 专属的侧边栏聊天界面：

```javascript
// 初始化侧边栏
viewDidLoad: function() {
  self.view.frame = MNUtil.genFrame(0, 0, MNExtensionPanel.width, MNExtensionPanel.height)
  self.view.backgroundColor = MNUtil.hexColorAlpha("#ffffff", 0)
  
  // 创建聊天视图
  self.createChatView()
  
  // 监听面板大小变化
  self.observePanelResize()
}

// 打开聊天界面
openChatView: function(toLoad = true) {
  if (toLoad) {
    self.chatView.loadFileURLAllowingReadAccessToURL(
      NSURL.fileURLWithPath(self.mainPath + `/index.html`),
      NSURL.fileURLWithPath(self.mainPath + '/')
    )
  }
  
  self.chatView.hidden = false
  self.setChatLayout()
  
  // 导入聊天历史
  self.importData()
}
```

## UI 组件开发

### 1. 按钮创建

统一的按钮创建方法：

```javascript
createButton: function(buttonName, targetAction, superview) {
  self[buttonName] = UIButton.buttonWithType(0)
  self[buttonName].autoresizingMask = (1 << 0 | 1 << 3)
  self[buttonName].setTitleColorForState(UIColor.whiteColor(), 0)
  self[buttonName].setTitleColorForState(chatAIConfig.highlightColor, 1)
  self[buttonName].backgroundColor = MNUtil.hexColorAlpha("#9bb2d6", 0.8)
  self[buttonName].layer.cornerRadius = 8
  self[buttonName].layer.masksToBounds = true
  self[buttonName].titleLabel.font = UIFont.systemFontOfSize(16)
  
  if (targetAction) {
    self[buttonName].addTargetActionForControlEvents(self, targetAction, 1 << 6)
  }
  
  if (superview) {
    self[superview].addSubview(self[buttonName])
  } else {
    self.view.addSubview(self[buttonName])
  }
}
```

### 2. 输入框创建

文本输入框的创建：

```javascript
creatTextView: function(viewName, superview = "view", color = "#ffffff", alpha = 0.8) {
  self[viewName] = UITextView.new()
  self[viewName].font = UIFont.systemFontOfSize(17)
  self[viewName].layer.cornerRadius = 8
  self[viewName].backgroundColor = MNUtil.hexColorAlpha(color, alpha)
  self[viewName].textColor = UIColor.blackColor()
  self[viewName].delegate = self
  self[viewName].editable = true
  self[viewName].scrollEnabled = false
  self[viewName].bounces = false
  self[viewName].layer.borderWidth = 4
  
  self[superview].addSubview(self[viewName])
}
```

### 3. 滚动视图

用于长列表内容：

```javascript
createScrollview: function(viewName, superview = "view") {
  self[viewName] = UIScrollView.new()
  self[viewName].delegate = self
  self[viewName].showsVerticalScrollIndicator = true
  self[viewName].showsHorizontalScrollIndicator = false
  self[viewName].scrollEnabled = true
  self[viewName].bounces = true
  self[viewName].alwaysBounceVertical = true
  self[viewName].pagingEnabled = false
  
  self[superview].addSubview(self[viewName])
}
```

### 4. WebView 输入框

用于 JSON 编辑等高级功能：

```javascript
createWebviewInput: function(inputName, superview = "view") {
  self[inputName] = new UIWebView()
  self[inputName].delegate = self
  self[inputName].autoresizingMask = (1 << 1 | 1 << 4)
  self[inputName].opaque = false
  self[inputName].backgroundColor = UIColor.clearColor()
  self[inputName].layer.cornerRadius = 8
  self[inputName].layer.masksToBounds = true
  self[inputName].scrollView.bounces = false
  
  // 加载编辑器HTML
  self[inputName].loadFileURLAllowingReadAccessToURL(
    NSURL.fileURLWithPath(mainPath + '/jsoneditor.html'),
    NSURL.fileURLWithPath(mainPath + '/')
  )
  
  self[superview].addSubview(self[inputName])
}
```

## 布局管理

### 1. 自适应布局

响应窗口大小变化：

```javascript
controllerWillLayoutSubviews: function(controller) {
  if (controller !== MNUtil.studyController) return
  
  let studyFrame = MNUtil.studyView.bounds
  let windowFrame = MNUtil.currentWindow.bounds
  
  // 聊天控制器位置约束
  if (!chatAIUtils.chatController.view.hidden) {
    let currentFrame = chatAIUtils.chatController.currentFrame
    currentFrame.x = MNUtil.constrain(currentFrame.x, 0, studyFrame.width - currentFrame.width)
    currentFrame.y = MNUtil.constrain(currentFrame.y, 0, studyFrame.height - 20)
    chatAIUtils.chatController.view.frame = currentFrame
  }
  
  // 通知控制器自适应
  if (!chatAIUtils.notifyController.view.hidden && !chatAIUtils.notifyController.onAnimate) {
    let currentFrame = chatAIUtils.notifyController.currentFrame
    currentFrame.height = Math.min(currentFrame.height, windowFrame.height - currentFrame.y)
    currentFrame.y = chatAIUtils.getY()
    currentFrame.x = chatAIUtils.getX()
    chatAIUtils.notifyController.view.frame = currentFrame
  }
}
```

### 2. 动态布局计算

根据内容调整布局：

```javascript
settingViewLayout: function() {
  var viewFrame = self.view.bounds
  var width = viewFrame.width
  var height = viewFrame.height
  let buttonHeight = 25
  
  // 顶部按钮栏
  self.closeButton.frame = {x: 5, y: 5, width: 30, height: buttonHeight}
  self.moveButton.frame = {x: width * 0.5 - 75, y: 0, width: 150, height: 16}
  
  // 标签页按钮（自适应宽度）
  if (width >= 600) {
    // 宽屏布局：6个按钮一行
    let buttonWidth = (width - 50) / 6
    self.configButton.frame = {x: 5, y: 20, width: buttonWidth, height: buttonHeight}
    self.modelTab.frame = {x: 5 + buttonWidth, y: 20, width: buttonWidth, height: buttonHeight}
    // ...
  } else {
    // 窄屏布局：3个按钮一行
    let buttonWidth = (width - 20) / 3
    self.configButton.frame = {x: 5, y: 20, width: buttonWidth, height: buttonHeight}
    self.modelTab.frame = {x: 5 + buttonWidth, y: 20, width: buttonWidth, height: buttonHeight}
    // ...
  }
  
  // 内容区域
  let contentY = width >= 600 ? 50 : 75
  self.settingView.frame = {x: 5, y: contentY, width: width - 10, height: height - contentY - 10}
}
```

### 3. 位置记忆

保存和恢复面板位置：

```javascript
// 保存位置
saveFrameToConfig: function() {
  let frame = self.view.frame
  chatAIConfig.config.panelFrame = {
    x: frame.x,
    y: frame.y,
    width: frame.width,
    height: frame.height
  }
  chatAIConfig.save("MNChatglm_config")
}

// 恢复位置
restoreFrameFromConfig: function() {
  let savedFrame = chatAIConfig.config.panelFrame
  if (savedFrame) {
    self.view.frame = savedFrame
    self.currentFrame = savedFrame
  }
}
```

## 手势与交互

### 1. 拖动手势

实现面板拖动：

```javascript
// 添加拖动手势
self.moveGesture = new UIPanGestureRecognizer(self, "onMoveGesture:")
self.moveButton.addGestureRecognizer(self.moveGesture)

// 处理拖动
onMoveGesture: function(gesture) {
  let translation = gesture.translationInView(MNUtil.studyView)
  let velocity = gesture.velocityInView(MNUtil.studyView)
  
  if (gesture.state === 1) { // Began
    self.startFrame = self.view.frame
    self.startPoint = translation
  } else if (gesture.state === 2) { // Changed
    let frame = self.view.frame
    frame.x = self.startFrame.x + translation.x - self.startPoint.x
    frame.y = self.startFrame.y + translation.y - self.startPoint.y
    
    // 边界检查
    let studyFrame = MNUtil.studyView.bounds
    frame.x = MNUtil.constrain(frame.x, 0, studyFrame.width - frame.width)
    frame.y = MNUtil.constrain(frame.y, 0, studyFrame.height - frame.height)
    
    self.view.frame = frame
  } else if (gesture.state === 3) { // Ended
    self.currentFrame = self.view.frame
    MNUtil.studyView.bringSubviewToFront(self.view)
  }
}
```

### 2. 调整大小手势

实现面板大小调整：

```javascript
// 添加调整大小手势
self.resizeGesture = new UIPanGestureRecognizer(self, "onResizeGesture:")
self.resizeButton.addGestureRecognizer(self.resizeGesture)

// 处理调整大小
onResizeGesture: function(gesture) {
  let baseframe = gesture.view.frame
  let frame = self.view.frame
  let translation = chatAIUtils.getTranslation(gesture)
  
  let width = translation.x - frame.x + baseframe.width
  let height = translation.y - frame.y + baseframe.height + 15
  
  // 最小尺寸限制
  width = Math.max(width, 330)
  height = Math.max(height, 465)
  
  self.view.frame = {x: frame.x, y: frame.y, width: width, height: height}
  self.currentFrame = self.view.frame
  
  if (gesture.state === 3) { // Ended
    MNUtil.studyView.bringSubviewToFront(self.view)
  }
}
```

### 3. 长按手势

实现长按菜单：

```javascript
// 添加长按手势
MNButton.addLongPressGesture(self.button, self, "onLongPress:")

// 处理长按
onLongPress: function(gesture) {
  if (gesture.state === 1) { // Began
    let button = gesture.view
    
    var commandTable = [
      {title: '🔧 Configure', object: self, selector: 'configureButton:', param: button.action},
      {title: '🎨 Change Icon', object: self, selector: 'changeIcon:', param: button.action},
      {title: '🗑️ Reset', object: self, selector: 'resetButton:', param: button.action}
    ]
    
    self.popoverController = MNUtil.getPopoverAndPresent(button, commandTable, 200, 2)
  }
}
```

### 4. 点击手势

处理点击事件：

```javascript
// 单击和双击区分
promptSaveTapped: async function(button) {
  let clickDate = Date.now()
  
  if (button.clickDate && clickDate - button.clickDate < 500) {
    // 双击：执行操作
    self.executePrompt()
  } else {
    // 单击：保存配置
    button.clickDate = Date.now()
    self.saveConfig()
  }
}
```

## 配置管理系统

### 1. 配置结构设计

```javascript
// 配置对象结构
static config = {
  // UI 设置
  ui: {
    theme: "auto",           // auto, light, dark
    language: "zh",          // zh, en
    panelWidth: 450,
    notifyLocation: 0,       // 0: left, 1: right
    autoHide: true,
    hideDelay: 3000
  },
  
  // 功能设置
  features: {
    autoAction: false,
    onSelection: true,
    onNote: true,
    ignoreShortText: false,
    minTextLength: 10
  },
  
  // 模型配置
  models: {
    defaultSource: "Built-in",
    defaultModel: "gpt-4o-mini",
    apiKeys: {},
    endpoints: {},
    customModels: []
  },
  
  // 同步设置
  sync: {
    source: "None",          // None, iCloud, MNNote, WebDAV
    autoExport: false,
    autoImport: false,
    lastSyncTime: 0,
    conflictResolution: "ask" // ask, local, remote
  }
}
```

### 2. 配置保存

```javascript
// 保存配置到本地
save: function(key, value) {
  if (key) {
    // 保存单个配置项
    self.config[key] = value
  }
  
  // 更新修改时间
  self.config.modifiedTime = Date.now()
  
  // 持久化到 NSUserDefaults
  NSUserDefaults.standardUserDefaults().setObjectForKey(self.config, "PluginConfig")
  NSUserDefaults.standardUserDefaults().synchronize()
  
  // 触发自动导出
  if (self.config.sync.autoExport) {
    self.export(false)
  }
}
```

### 3. 配置加载

```javascript
// 从本地加载配置
load: function() {
  let savedConfig = NSUserDefaults.standardUserDefaults().objectForKey("PluginConfig")
  
  if (savedConfig) {
    // 合并默认配置（处理新增配置项）
    self.config = Object.assign({}, self.defaultConfig, savedConfig)
  } else {
    // 使用默认配置
    self.config = self.defaultConfig
  }
  
  // 应用配置
  self.applyConfig()
}

// 应用配置到UI
applyConfig: function() {
  // 应用主题
  self.applyTheme(self.config.ui.theme)
  
  // 应用语言
  self.applyLanguage(self.config.ui.language)
  
  // 应用UI设置
  self.view.frame.width = self.config.ui.panelWidth
  self.notifyController.notifyLoc = self.config.ui.notifyLocation
}
```

### 4. 配置验证

```javascript
// 验证配置有效性
validateConfig: function(config) {
  if (!config || typeof config !== 'object') {
    return false
  }
  
  // 检查必要字段
  const requiredFields = ['ui', 'features', 'models', 'sync']
  for (let field of requiredFields) {
    if (!(field in config)) {
      return false
    }
  }
  
  // 验证数据类型
  if (typeof config.ui.panelWidth !== 'number' || config.ui.panelWidth < 300) {
    return false
  }
  
  // 验证枚举值
  if (!['auto', 'light', 'dark'].includes(config.ui.theme)) {
    return false
  }
  
  return true
}
```

## 数据同步机制

### 1. iCloud 同步

```javascript
// 初始化 iCloud
initCloudStore: function() {
  self.cloudStore = NSUbiquitousKeyValueStore.defaultStore()
  
  // 监听 iCloud 变化
  NSNotificationCenter.defaultCenter().addObserverSelectorName(
    self,
    'onCloudConfigChange:',
    'NSUbiquitousKeyValueStoreDidChangeExternallyNotification'
  )
}

// 写入 iCloud
writeToCloud: function() {
  self.config.lastSyncTime = Date.now()
  self.cloudStore.setObjectForKey(self.config, "PluginConfig")
  self.cloudStore.synchronize()
}

// 从 iCloud 读取
readFromCloud: function() {
  let cloudConfig = self.cloudStore.objectForKey("PluginConfig")
  
  if (cloudConfig && self.validateConfig(cloudConfig)) {
    // 处理冲突
    if (self.config.modifiedTime > cloudConfig.modifiedTime) {
      // 本地更新，询问是否覆盖云端
      let confirm = await MNUtil.confirm("Local config is newer", "Upload to iCloud?")
      if (confirm) {
        self.writeToCloud()
      }
    } else {
      // 云端更新，导入
      self.config = cloudConfig
      self.applyConfig()
    }
  }
}
```

### 2. 笔记同步

```javascript
// 导出到笔记
exportToNote: function(note) {
  let configJson = JSON.stringify(self.config, null, 2)
  
  MNUtil.undoGrouping(() => {
    note.noteTitle = "Plugin Config"
    note.excerptText = "```json\n" + configJson + "\n```"
    note.excerptTextMarkdown = true
    note.colorIndex = 3 // 黄色
  })
}

// 从笔记导入
importFromNote: function(note) {
  let text = note.excerptText
  
  // 提取 JSON
  if (text.includes("```json")) {
    text = text.match(/```json\n([\s\S]*?)\n```/)[1]
  }
  
  try {
    let config = JSON.parse(text)
    if (self.validateConfig(config)) {
      self.config = config
      self.applyConfig()
      return true
    }
  } catch (e) {
    MNUtil.showHUD("Invalid config format")
  }
  
  return false
}
```

### 3. WebDAV 同步

```javascript
// WebDAV 上传
uploadToWebDAV: async function() {
  let url = self.config.sync.webdavUrl + "/plugin-config.json"
  let auth = {
    user: self.config.sync.webdavUser,
    password: self.config.sync.webdavPassword
  }
  
  let configJson = JSON.stringify(self.config)
  
  let response = await chatAINetwork.uploadWebDAVFile(url, auth.user, auth.password, configJson)
  
  if (response.statusCode === 201 || response.statusCode === 204) {
    MNUtil.showHUD("Upload success")
    return true
  } else {
    MNUtil.showHUD("Upload failed: " + response.statusCode)
    return false
  }
}

// WebDAV 下载
downloadFromWebDAV: async function() {
  let url = self.config.sync.webdavUrl + "/plugin-config.json"
  let auth = {
    user: self.config.sync.webdavUser,
    password: self.config.sync.webdavPassword
  }
  
  let configText = await chatAINetwork.readWebDAVFile(url, auth.user, auth.password)
  
  try {
    let config = JSON.parse(configText)
    if (self.validateConfig(config)) {
      self.config = config
      self.applyConfig()
      return true
    }
  } catch (e) {
    MNUtil.showHUD("Invalid config from WebDAV")
  }
  
  return false
}
```

### 4. 加密同步

```javascript
// 加密配置
encryptConfig: function(config, password) {
  let configJson = JSON.stringify(config)
  return MNUtil.xorEncryptDecrypt(configJson, password)
}

// 解密配置
decryptConfig: function(encryptedText, password) {
  let decryptedText = MNUtil.xorEncryptDecrypt(encryptedText, password)
  
  try {
    let config = JSON.parse(decryptedText)
    return config
  } catch (e) {
    return null
  }
}

// 上传加密配置
uploadEncrypted: async function() {
  let password = await MNUtil.inputText("Enter password", "")
  if (!password) return
  
  let encrypted = self.encryptConfig(self.config, password)
  
  // 上传到云存储
  let success = await self.uploadToCloudStorage(encrypted)
  
  if (success) {
    // 保存密码提示
    self.config.sync.passwordHint = password.substring(0, 2) + "***"
    self.save()
  }
}
```

### 5. 冲突解决

```javascript
// 冲突检测与解决
resolveConflict: async function(localConfig, remoteConfig) {
  // 比较时间戳
  let localTime = localConfig.modifiedTime
  let remoteTime = remoteConfig.modifiedTime
  
  if (Math.abs(localTime - remoteTime) < 5000) {
    // 时间接近，可能是并发修改
    let choice = await MNUtil.userSelect(
      "Config conflict detected",
      "Choose which version to keep",
      ["Use Local", "Use Remote", "Merge"]
    )
    
    switch (choice) {
      case 0: // Use Local
        return localConfig
        
      case 1: // Use Remote
        return remoteConfig
        
      case 2: // Merge
        return self.mergeConfigs(localConfig, remoteConfig)
    }
  } else if (localTime > remoteTime) {
    // 本地更新
    return localConfig
  } else {
    // 远程更新
    return remoteConfig
  }
}

// 配置合并
mergeConfigs: function(config1, config2) {
  let merged = {}
  
  // 合并策略：
  // 1. UI 设置使用最新的
  // 2. API Keys 合并两者
  // 3. 功能开关使用最新的
  
  merged.ui = config1.modifiedTime > config2.modifiedTime ? config1.ui : config2.ui
  merged.features = config1.modifiedTime > config2.modifiedTime ? config1.features : config2.features
  
  // 合并 API Keys
  merged.models = {
    apiKeys: Object.assign({}, config1.models.apiKeys, config2.models.apiKeys),
    endpoints: Object.assign({}, config1.models.endpoints, config2.models.endpoints)
  }
  
  merged.modifiedTime = Date.now()
  
  return merged
}
```

## WebView 集成

### 1. WebView 创建与配置

```javascript
// 创建 WebView
createWebView: function() {
  self.webView = new UIWebView()
  self.webView.delegate = self
  self.webView.autoresizingMask = (1 << 1 | 1 << 4)
  self.webView.opaque = false
  self.webView.backgroundColor = UIColor.clearColor()
  self.webView.scrollView.bounces = false
  
  // 加载本地 HTML
  self.webView.loadFileURLAllowingReadAccessToURL(
    NSURL.fileURLWithPath(mainPath + '/index.html'),
    NSURL.fileURLWithPath(mainPath + '/')
  )
  
  self.view.addSubview(self.webView)
}
```

### 2. JavaScript 交互

```javascript
// 执行 JavaScript
runJavaScript: async function(code) {
  return new Promise((resolve, reject) => {
    self.webView.evaluateJavaScript(code, (result, error) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}

// 从 WebView 获取数据
getWebViewContent: async function() {
  let content = await self.runJavaScript('getContent()')
  return content
}

// 向 WebView 发送数据
setWebViewContent: async function(content) {
  let escaped = content.replace(/'/g, "\\'").replace(/\n/g, "\\n")
  await self.runJavaScript(`setContent('${escaped}')`)
}
```

### 3. WebView 代理方法

```javascript
// WebView 开始加载
webViewDidStartLoad: function(webView) {
  self.isLoading = true
  MNUtil.showHUD("Loading...")
}

// WebView 加载完成
webViewDidFinishLoad: function(webView) {
  self.isLoading = false
  MNUtil.stopHUD()
  
  // 初始化 WebView
  self.initializeWebView()
}

// WebView 加载失败
webViewDidFailLoadWithError: function(webView, error) {
  self.isLoading = false
  MNUtil.showHUD("Load failed: " + error.localizedDescription)
}

// 拦截 URL 请求
webViewShouldStartLoadWithRequestNavigationType: function(webView, request, navigationType) {
  let url = request.URL.absoluteString
  
  // 处理自定义协议
  if (url.startsWith("mnai://")) {
    self.handleCustomProtocol(url)
    return false
  }
  
  return true
}
```

### 4. 主题支持

```javascript
// 切换主题
changeTheme: function(theme) {
  self.theme = theme
  
  // 更新 WebView 主题
  self.runJavaScript(`changeTheme('${theme}')`)
  
  // 更新原生 UI
  if (theme === "dark") {
    self.view.backgroundColor = MNUtil.hexColorAlpha("#1e1e1e", 0.95)
    self.webView.backgroundColor = MNUtil.hexColorAlpha("#1e1e1e", 1)
  } else {
    self.view.backgroundColor = MNUtil.hexColorAlpha("#ffffff", 0.95)
    self.webView.backgroundColor = MNUtil.hexColorAlpha("#ffffff", 1)
  }
}

// 自动主题检测
checkTheme: function() {
  let isDarkMode = false
  
  if (MNUtil.isMN4) {
    // MN4 支持系统主题
    isDarkMode = UIScreen.mainScreen().traitCollection.userInterfaceStyle === 2
  } else {
    // MN3 根据背景色判断
    let bgColor = MNUtil.currentDocumentController.document.backgroundColor
    isDarkMode = bgColor.red < 0.5
  }
  
  self.changeTheme(isDarkMode ? "dark" : "light")
}
```

## 最佳实践

### 1. 性能优化

```javascript
// 1. 延迟加载
lazyLoadView: function() {
  if (!self.contentView) {
    self.createContentView()
  }
  self.contentView.hidden = false
}

// 2. 防抖处理
debounce: function(func, wait) {
  let timeout
  return function() {
    let context = this
    let args = arguments
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(context, args)
    }, wait)
  }
}

// 3. 节流处理
throttle: function(func, limit) {
  let inThrottle
  return function() {
    let args = arguments
    let context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// 4. 批量更新
batchUpdate: function(updates) {
  MNUtil.undoGrouping(() => {
    updates.forEach(update => update())
  })
}
```

### 2. 错误处理

```javascript
// 全局错误捕获
tryCatch: function(func, errorHandler) {
  try {
    return func()
  } catch (error) {
    if (errorHandler) {
      errorHandler(error)
    } else {
      chatAIUtils.addErrorLog(error, func.name)
      MNUtil.showHUD("Error: " + error.message)
    }
  }
}

// 异步错误处理
asyncTryCatch: async function(func, errorHandler) {
  try {
    return await func()
  } catch (error) {
    if (errorHandler) {
      return errorHandler(error)
    } else {
      chatAIUtils.addErrorLog(error, func.name)
      MNUtil.showHUD("Error: " + error.message)
    }
  }
}

// 错误日志
addErrorLog: function(error, functionName, additionalInfo) {
  let errorInfo = {
    time: new Date().toISOString(),
    function: functionName,
    error: error.toString(),
    stack: error.stack,
    additional: additionalInfo
  }
  
  // 保存到本地
  let errors = NSUserDefaults.standardUserDefaults().objectForKey("ErrorLogs") || []
  errors.push(errorInfo)
  
  // 只保留最近100条
  if (errors.length > 100) {
    errors = errors.slice(-100)
  }
  
  NSUserDefaults.standardUserDefaults().setObjectForKey(errors, "ErrorLogs")
}
```

### 3. 内存管理

```javascript
// 清理资源
cleanup: function() {
  // 移除观察者
  NSNotificationCenter.defaultCenter().removeObserver(self)
  
  // 取消网络请求
  if (self.connection) {
    self.connection.cancel()
    self.connection = null
  }
  
  // 清理 WebView
  if (self.webView) {
    self.webView.stopLoading()
    self.webView.loadHTMLStringBaseURL("", null)
    self.webView.removeFromSuperview()
    self.webView = null
  }
  
  // 清理大对象
  self.largeData = null
}

// 内存警告处理
didReceiveMemoryWarning: function() {
  // 清理缓存
  self.cache = {}
  
  // 释放不必要的视图
  if (self.view.hidden && self.contentView) {
    self.contentView.removeFromSuperview()
    self.contentView = null
  }
}
```

### 4. 用户体验

```javascript
// 1. 加载提示
showLoading: function(message) {
  self.loadingView.hidden = false
  self.loadingLabel.text = message || "Loading..."
  self.activityIndicator.startAnimating()
}

hideLoading: function() {
  self.loadingView.hidden = true
  self.activityIndicator.stopAnimating()
}

// 2. 平滑动画
animateChanges: function(changes, duration = 0.3) {
  UIView.animateWithDurationAnimationsCompletion(
    duration,
    () => {
      changes()
    },
    (finished) => {
      if (finished) {
        self.onAnimationComplete()
      }
    }
  )
}

// 3. 反馈机制
provideFeedback: function(type) {
  switch (type) {
    case "success":
      // 震动反馈（iOS）
      if (UIDevice.currentDevice().systemVersion >= "10.0") {
        let generator = UINotificationFeedbackGenerator.new()
        generator.notificationOccurred(0) // Success
      }
      break
      
    case "error":
      // 错误提示
      MNUtil.showHUD("❌ Operation failed", 2)
      break
      
    case "warning":
      // 警告提示
      MNUtil.showHUD("⚠️ Please note", 2)
      break
  }
}

// 4. 智能默认值
getSmartDefault: function(key) {
  // 根据用户习惯返回默认值
  let history = self.userHistory[key] || []
  
  if (history.length > 0) {
    // 返回最常用的值
    let frequency = {}
    history.forEach(item => {
      frequency[item] = (frequency[item] || 0) + 1
    })
    
    let maxFreq = 0
    let mostUsed = null
    
    Object.keys(frequency).forEach(item => {
      if (frequency[item] > maxFreq) {
        maxFreq = frequency[item]
        mostUsed = item
      }
    })
    
    return mostUsed
  }
  
  return self.defaultValues[key]
}
```

### 5. 调试技巧

```javascript
// 1. 调试模式
DEBUG: false,

log: function(message) {
  if (self.DEBUG) {
    console.log("[Plugin]", message)
    
    // 同时显示在界面上
    if (self.debugView) {
      self.debugView.text += "\n" + message
      self.debugView.scrollRangeToVisible({location: self.debugView.text.length, length: 0})
    }
  }
}

// 2. 性能监控
measurePerformance: function(name, func) {
  let start = Date.now()
  let result = func()
  let duration = Date.now() - start
  
  self.log(`${name} took ${duration}ms`)
  
  // 记录慢操作
  if (duration > 100) {
    self.performanceWarnings.push({
      name: name,
      duration: duration,
      time: new Date().toISOString()
    })
  }
  
  return result
}

// 3. 状态快照
captureState: function() {
  return {
    view: {
      frame: self.view.frame,
      hidden: self.view.hidden,
      alpha: self.view.alpha
    },
    config: JSON.parse(JSON.stringify(self.config)),
    timestamp: Date.now()
  }
}

// 4. 远程调试
enableRemoteDebug: function() {
  // 创建调试服务器
  self.debugServer = MNUtil.createHTTPServer(8080)
  
  self.debugServer.handleRequest = function(request, response) {
    if (request.path === "/state") {
      response.writeJSON(self.captureState())
    } else if (request.path === "/logs") {
      response.writeJSON(self.logs)
    } else if (request.path === "/execute") {
      let result = eval(request.body)
      response.writeJSON({result: result})
    }
  }
  
  self.debugServer.start()
}
```

## 常见问题与解决方案

### 1. 视图不显示

```javascript
// 问题：视图创建后不显示
// 解决方案：
ensureViewVisible: function() {
  // 1. 确保添加到正确的父视图
  if (!self.view.superview) {
    MNUtil.studyView.addSubview(self.view)
  }
  
  // 2. 确保不被隐藏
  self.view.hidden = false
  
  // 3. 确保在可见区域
  let studyFrame = MNUtil.studyView.bounds
  let viewFrame = self.view.frame
  
  if (viewFrame.x < 0 || viewFrame.x > studyFrame.width ||
      viewFrame.y < 0 || viewFrame.y > studyFrame.height) {
    // 重置到默认位置
    self.view.frame = {x: 50, y: 50, width: 400, height: 300}
  }
  
  // 4. 确保在最前面
  MNUtil.studyView.bringSubviewToFront(self.view)
}
```

### 2. 手势冲突

```javascript
// 问题：自定义手势与系统手势冲突
// 解决方案：
gestureRecognizerShouldBegin: function(gestureRecognizer) {
  // 检查手势位置
  let location = gestureRecognizer.locationInView(self.view)
  
  // 如果在特定区域，禁用手势
  if (self.isInSystemArea(location)) {
    return false
  }
  
  return true
}

// 同时识别多个手势
gestureRecognizerShouldRecognizeSimultaneouslyWithGestureRecognizer: function(gesture1, gesture2) {
  // 允许拖动和点击同时识别
  if (gesture1 === self.panGesture && gesture2 === self.tapGesture) {
    return true
  }
  
  return false
}
```

### 3. 内存泄漏

```javascript
// 问题：循环引用导致内存泄漏
// 解决方案：

// 1. 使用弱引用
createWeakReference: function(object) {
  let weakRef = {
    get: function() {
      return object
    }
  }
  
  return weakRef
}

// 2. 及时清理闭包
clearClosures: function() {
  // 清理定时器
  if (self.timers) {
    self.timers.forEach(timer => {
      clearTimeout(timer)
    })
    self.timers = []
  }
  
  // 清理事件监听
  if (self.listeners) {
    self.listeners.forEach(listener => {
      listener.target.removeEventListener(listener.event, listener.handler)
    })
    self.listeners = []
  }
}

// 3. 避免保留大对象
processLargeData: function(data) {
  // 处理完立即释放
  let result = self.transformData(data)
  data = null // 显式释放
  
  return result
}
```

### 4. 异步操作管理

```javascript
// 问题：多个异步操作导致状态混乱
// 解决方案：

// 1. 使用操作队列
operationQueue: [],
isProcessing: false,

addOperation: function(operation) {
  self.operationQueue.push(operation)
  self.processQueue()
}

processQueue: async function() {
  if (self.isProcessing) return
  
  self.isProcessing = true
  
  while (self.operationQueue.length > 0) {
    let operation = self.operationQueue.shift()
    
    try {
      await operation()
    } catch (error) {
      self.handleError(error)
    }
  }
  
  self.isProcessing = false
}

// 2. 取消机制
currentOperation: null,

startCancellableOperation: function() {
  // 取消之前的操作
  if (self.currentOperation) {
    self.currentOperation.cancel()
  }
  
  // 创建新操作
  self.currentOperation = {
    cancelled: false,
    cancel: function() {
      this.cancelled = true
    }
  }
  
  // 执行操作
  self.performOperation(self.currentOperation)
}

performOperation: async function(operation) {
  for (let i = 0; i < 100; i++) {
    if (operation.cancelled) {
      return
    }
    
    await self.doWork(i)
  }
}
```

### 5. 跨版本兼容

```javascript
// 问题：MN3 和 MN4 API 差异
// 解决方案：

// 1. 版本检测
isMN4: function() {
  return typeof MNExtensionPanel !== 'undefined'
}

// 2. 兼容层
getStudyView: function() {
  if (self.isMN4()) {
    return MNUtil.studyView
  } else {
    return Application.sharedInstance().studyController().view
  }
}

// 3. 功能降级
showPanel: function() {
  if (self.isMN4()) {
    // MN4: 使用侧边栏
    MNExtensionPanel.show()
    MNExtensionPanel.addSubview("myPanel", self.view)
  } else {
    // MN3: 使用浮动窗口
    self.getStudyView().addSubview(self.view)
    self.view.hidden = false
  }
}

// 4. API 适配
addNote: function(config) {
  if (self.isMN4()) {
    // MN4 API
    return MNNote.createNote(config)
  } else {
    // MN3 API
    let note = MNNote.new()
    note.noteTitle = config.title
    note.excerptText = config.content
    return note
  }
}
```

## 总结

本指南基于 MN ChatAI 项目的实际代码，详细介绍了 MarginNote 插件面板开发的各个方面。主要要点：

1. **架构设计**：采用多控制器架构，各司其职，便于维护和扩展
2. **UI 开发**：提供统一的组件创建方法，支持主题和响应式布局
3. **交互设计**：支持多种手势，提供流畅的用户体验
4. **配置管理**：完整的配置系统，支持多种同步方式
5. **性能优化**：注意内存管理，使用防抖节流等优化技术
6. **错误处理**：完善的错误捕获和日志系统
7. **兼容性**：同时支持 MN3 和 MN4，优雅降级

通过学习这些技术和模式，开发者可以创建功能强大、用户体验良好的 MarginNote 插件。记住始终以用户体验为中心，保持代码的可维护性和可扩展性。