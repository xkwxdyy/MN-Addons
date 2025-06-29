# MarginNote 插件框架开发指南

> 从零开始，打造你的第一个专业 MarginNote 插件！

## 目录

1. [前言](#前言)
2. [基础知识](#基础知识)
3. [环境准备](#环境准备)
4. [插件基础结构](#插件基础结构)
5. [UI 系统详解](#ui-系统详解)
   - [创建弹出菜单](#创建弹出菜单)
   - [构建控制面板](#构建控制面板)
   - [实现多页面切换](#实现多页面切换)
6. [实战：开发你的第一个插件](#实战开发你的第一个插件)
7. [进阶技巧](#进阶技巧)
8. [常见问题](#常见问题)

## 前言

恭喜你！你已经体验到了 MN ChatAI 插件的强大功能。那些优雅的菜单、漂亮的控制面板、流畅的页面切换，都是通过 MarginNote 的原生 UI 系统实现的。本指南将手把手教你如何实现这些功能。

## 基础知识

### 什么是 MarginNote 插件？

MarginNote 插件是基于 JSBox（JavaScript Bridge）框架开发的扩展程序，可以：
- 访问和操作笔记、文档
- 创建自定义 UI 界面
- 响应用户操作事件
- 与 iOS/macOS 原生 API 交互

### 核心概念

1. **JSB（JavaScript Bridge）**：连接 JavaScript 和 Objective-C 的桥梁
2. **MNUtils**：MarginNote 提供的核心 API 框架
3. **控制器（Controller）**：管理视图和逻辑的组件
4. **视图（View）**：用户界面元素

## 环境准备

### 1. 安装 MNUtils

MNUtils 是开发 MarginNote 插件的必备框架：

```bash
# 在 MarginNote 的插件目录下
# macOS: ~/Library/Containers/QReader.MarginNoteMac/Data/Library/MarginNote Extensions/
# iOS: 通过文件 App 访问 MarginNote 的插件目录
```

### 2. 创建插件目录结构

```
my-first-addon/
├── mnaddon.json      # 插件配置文件
├── main.js           # 插件入口文件
├── logo.png          # 插件图标（建议 100x100）
└── utils.js          # 工具函数（可选）
```

### 3. 配置 mnaddon.json

```json
{
  "addonid": "myfirstaddon",
  "name": "My First Addon",
  "author": "Your Name",
  "version": "1.0.0",
  "marginnote_version_min": "4.0.0",
  "cert_key": ""
}
```

## 插件基础结构

### main.js 完整框架

```javascript
JSB.newAddon = function (mainPath) {
  // 1. 加载依赖
  JSB.require('utils')  // 加载工具函数
  JSB.require('mnutils')  // 加载 MNUtils（必需）
  
  // 检查 MNUtils 是否存在
  if (typeof MNUtil == 'undefined') {
    Application.sharedInstance().showHUD("请先安装 MNUtils", 2)
    return undefined
  }
  
  // 2. 定义获取类实例的函数（重要：用于内部访问）
  const getMyAddonClass = () => self
  
  // 3. 定义插件主类
  var MyAddonClass = JSB.defineClass('MyAddon : JSExtension', {
    // 插件初始化
    init: function(mainPath) {
      self.mainPath = mainPath
      self.isNewWindow = false
      self.lastAction = Date.now()
      // 初始化其他状态变量
    },
    
    // 场景连接时调用（插件启动）
    sceneWillConnect: async function () {
      try {
        let self = getMyAddonClass()
        self.init(mainPath)
        
        // 注册事件观察者
        self.addObserver('onPopupMenuOnSelection:', 'PopupMenuOnSelection')
        self.addObserver('onPopupMenuOnNote:', 'PopupMenuOnNote')
        self.addObserver('onProcessNewExcerpt:', 'ProcessNewExcerpt')
        self.addObserver('onAddonBroadcast:', 'AddonBroadcast')
        
        MNUtil.log("🚀 插件启动成功")
      } catch (error) {
        MNUtil.addErrorLog(error, "sceneWillConnect")
      }
    },
    
    // 场景断开时调用（清理资源）
    sceneDidDisconnect: function () {
      if (typeof MNUtil === 'undefined') return
      let self = getMyAddonClass()
      
      // 移除所有观察者
      let names = ['PopupMenuOnSelection', 'PopupMenuOnNote', 
                   'ProcessNewExcerpt', 'AddonBroadcast']
      self.removeObservers(names)
    },
    
    // 笔记本打开时调用
    notebookWillOpen: async function (notebookid) {
      try {
        let self = getMyAddonClass()
        self.init(mainPath)
        
        // 刷新插件命令状态
        MNUtil.refreshAddonCommands()
        
        // 延迟执行初始化任务
        MNUtil.delay(1).then(() => {
          // 自动导入配置等操作
          MNUtil.studyView.becomeFirstResponder()
        })
      } catch (error) {
        MNUtil.addErrorLog(error, "notebookWillOpen")
      }
    },
    
    // 控制器布局调整（响应窗口变化）
    controllerWillLayoutSubviews: function (controller) {
      if (typeof MNUtil === 'undefined') return
      if (controller !== MNUtil.studyController) return
      
      let studyFrame = MNUtil.studyView.bounds
      // 更新你的视图布局
    },
    
    // 工具栏按钮配置
    queryAddonCommandStatus: function () {
      return {
        image: 'logo.png',
        object: self,
        selector: 'toggleAddon:',
        checked: false  // 按钮状态
      }
    }
  })
  
  // 4. 添加原型方法
  MyAddonClass.prototype.addObserver = function (selector, name) {
    NSNotificationCenter.defaultCenter().addObserverSelectorName(this, selector, name)
  }
  
  MyAddonClass.prototype.removeObservers = function (names) {
    names.forEach(name => {
      NSNotificationCenter.defaultCenter().removeObserverName(self, name)
    })
  }
  
  return MyAddonClass
}
```

## UI 系统详解

### 创建弹出菜单

弹出菜单是插件最常用的交互方式。让我们实现一个像 ChatAI 那样的菜单：

```javascript
// 1. 添加工具栏按钮
queryAddonCommandStatus: function () {
  return {
    image: "logo.png",
    object: self,
    selector: "toggleMenu:",
    checked: false
  }
},

// 2. 实现菜单弹出方法
toggleMenu: function (button) {
  // 构建菜单项数组
  var menuItems = [
    {
      title: "⚙️  设置",
      object: self,
      selector: "openSettings:",
      param: null
    },
    {
      title: "📊  统计",
      object: self,
      selector: "showStats:",
      param: null
    },
    {
      title: "❓  帮助",
      object: self,
      selector: "showHelp:",
      param: null
    }
  ]
  
  // 使用 MNUtils 弹出菜单
  self.popover = this.showPopover(button, menuItems, 200)
},

// 3. 辅助方法：显示弹出菜单
showPopover: function (button, items, width) {
  // 创建菜单控制器
  var menuController = MenuController.new()
  menuController.commandTable = items
  menuController.rowHeight = 40
  menuController.preferredContentSize = {
    width: width,
    height: menuController.rowHeight * items.length
  }
  
  // 创建弹出控制器
  var popover = UIPopoverController.new(menuController)
  
  // 计算位置并显示
  var rect = button.convertRectToView(button.bounds, MNUtil.studyView)
  popover.presentPopoverFromRectInViewPermittedArrowDirectionsAnimated(
    rect, 
    MNUtil.studyView, 
    1 << 2, // 向上箭头
    true
  )
  
  return popover
}
```

### 构建控制面板

控制面板是插件的核心界面，让我们创建一个多页面的设置面板：

```javascript
// 1. 创建设置视图
openSettings: function () {
  if (!self.settingController) {
    self.settingController = SettingController.new()
    self.settingController.mainPath = self.mainPath
  }
  
  self.settingController.show()
}

// 2. 定义设置控制器
var SettingController = JSB.defineClass('SettingController : UIViewController', {
  viewDidLoad: function () {
    // 创建主视图
    this.view.backgroundColor = MNUtil.hexColorAlpha("#f1f6ff", 0.95)
    this.view.layer.cornerRadius = 15
    this.view.frame = MNUtil.genFrame(100, 100, 400, 500)
    
    // 添加标题栏
    this.createTitleBar()
    
    // 添加标签页按钮
    this.createTabs()
    
    // 创建内容页面
    this.createPages()
    
    // 默认显示第一页
    this.switchToPage(0)
  },
  
  // 创建标题栏
  createTitleBar: function () {
    // 标题标签
    var titleLabel = UILabel.new()
    titleLabel.text = "插件设置"
    titleLabel.font = UIFont.boldSystemFontOfSize(18)
    titleLabel.textAlignment = 1 // 居中
    titleLabel.frame = MNUtil.genFrame(0, 10, 400, 30)
    this.view.addSubview(titleLabel)
    
    // 关闭按钮
    var closeButton = MNButton.new()
    closeButton.setTitleForState("✕", 0)
    closeButton.frame = MNUtil.genFrame(360, 10, 30, 30)
    closeButton.addTargetActionForControlEvents(this, "close", 1 << 6)
    this.view.addSubview(closeButton)
  },
  
  // 创建标签页按钮
  createTabs: function () {
    var tabs = ["常规", "高级", "关于"]
    this.tabButtons = []
    
    tabs.forEach((title, index) => {
      var button = MNButton.new()
      MNButton.setConfig(button, {
        title: title,
        font: 16,
        color: index === 0 ? "#457bd3" : "#9bb2d6",
        bold: index === 0
      })
      button.frame = MNUtil.genFrame(20 + index * 120, 50, 100, 35)
      button.tag = index
      button.addTargetActionForControlEvents(this, "tabTapped:", 1 << 6)
      
      this.view.addSubview(button)
      this.tabButtons.push(button)
    })
  },
  
  // 创建页面容器
  createPages: function () {
    this.pages = []
    
    // 常规设置页
    var generalPage = this.createGeneralPage()
    this.pages.push(generalPage)
    
    // 高级设置页
    var advancedPage = this.createAdvancedPage()
    this.pages.push(advancedPage)
    
    // 关于页面
    var aboutPage = this.createAboutPage()
    this.pages.push(aboutPage)
  },
  
  // 创建常规设置页
  createGeneralPage: function () {
    var page = UIView.new()
    page.frame = MNUtil.genFrame(20, 100, 360, 380)
    page.backgroundColor = UIColor.whiteColor()
    page.layer.cornerRadius = 10
    
    // 添加设置项
    var y = 20
    
    // 开关设置
    this.addSwitch(page, "启用自动同步", y, "autoSync")
    y += 50
    
    this.addSwitch(page, "显示调试信息", y, "debugMode")
    y += 50
    
    // 选择器设置
    this.addSelector(page, "主题颜色", y, ["蓝色", "绿色", "紫色"], "themeColor")
    
    this.view.addSubview(page)
    return page
  },
  
  // 添加开关控件
  addSwitch: function (parent, title, y, key) {
    // 标签
    var label = UILabel.new()
    label.text = title
    label.frame = MNUtil.genFrame(20, y, 200, 30)
    parent.addSubview(label)
    
    // 开关
    var switchControl = UISwitch.new()
    switchControl.frame = MNUtil.genFrame(280, y, 60, 30)
    switchControl.on = this.getConfig(key, false)
    switchControl.addTargetActionForControlEvents(this, "switchChanged:", 1 << 12)
    switchControl.tag = key
    parent.addSubview(switchControl)
  },
  
  // 标签页切换
  tabTapped: function (button) {
    this.switchToPage(button.tag)
  },
  
  // 切换页面
  switchToPage: function (index) {
    // 更新按钮状态
    this.tabButtons.forEach((btn, i) => {
      var isSelected = i === index
      MNButton.setConfig(btn, {
        color: isSelected ? "#457bd3" : "#9bb2d6",
        bold: isSelected
      })
    })
    
    // 显示/隐藏页面
    this.pages.forEach((page, i) => {
      page.hidden = i !== index
    })
  },
  
  // 显示控制器
  show: function () {
    this.view.hidden = false
    MNUtil.studyView.addSubview(this.view)
    
    // 添加拖动手势
    this.addDragGesture()
  },
  
  // 添加拖动手势
  addDragGesture: function () {
    var pan = UIPanGestureRecognizer.alloc().initWithTargetAction(this, "handlePan:")
    this.view.addGestureRecognizer(pan)
  },
  
  // 处理拖动
  handlePan: function (gesture) {
    var translation = gesture.translationInView(this.view)
    var center = this.view.center
    
    center.x += translation.x
    center.y += translation.y
    
    this.view.center = center
    gesture.setTranslationInView({x: 0, y: 0}, this.view)
  }
})
```

### 实现多页面切换

多页面切换的核心是管理多个视图的显示/隐藏状态：

```javascript
// 页面管理器
var PageManager = {
  pages: [],
  currentIndex: 0,
  
  // 添加页面
  addPage: function (view, button) {
    this.pages.push({
      view: view,
      button: button
    })
  },
  
  // 切换到指定页面
  switchTo: function (index) {
    if (index < 0 || index >= this.pages.length) return
    
    this.pages.forEach((page, i) => {
      var isActive = i === index
      
      // 更新视图显示
      page.view.hidden = !isActive
      
      // 更新按钮样式
      MNButton.setConfig(page.button, {
        color: isActive ? "#457bd3" : "#9bb2d6",
        bold: isActive,
        alpha: isActive ? 1.0 : 0.7
      })
    })
    
    this.currentIndex = index
  }
}
```

## 高级开发技术

### 1. 多控制器架构

ChatAI 插件采用多控制器架构，实现功能分离和模块化：

```javascript
// utils.js - 工具类，管理所有控制器
var chatAIUtils = {
  // 控制器实例
  chatController: null,      // 主设置控制器
  notifyController: null,     // 通知窗口控制器
  dynamicController: null,    // 动态浮动按钮控制器
  sideOutputController: null, // 侧边栏控制器（MN4）
  
  // 初始化控制器
  ensureChatAIController: function() {
    if (!this.chatController) {
      this.chatController = webviewController.new()
      this.chatController.mainPath = mainPath
    }
  },
  
  ensureNotifyController: function() {
    if (!this.notifyController) {
      this.notifyController = notificationController.new()
      this.notifyController.mainPath = mainPath
    }
  },
  
  // 初始化动态控制器
  initDynamicController: function() {
    this.dynamicController = dynamicController.new()
    this.dynamicController.view.hidden = true
    MNUtil.studyView.addSubview(this.dynamicController.view)
  },
  
  // 确保视图添加到正确的父视图
  ensureView: function(view) {
    if (!MNUtil.isDescendantOfStudyView(view)) {
      MNUtil.studyView.addSubview(view)
    }
  }
}
```

### 2. 事件处理机制详解

#### 选中文本事件的完整处理流程

```javascript
onPopupMenuOnSelection: async function (sender) {
  if (typeof MNUtil === 'undefined') return
  let self = getMNChatglmClass()
  
  try {
    // 1. 检查发送者窗口（多窗口支持）
    if (!chatAIUtils.checkSender(sender, self.window)) return
    
    // 2. 获取选中文本
    chatAIUtils.currentSelection = sender.userInfo.documentController.selectionText
    
    // 3. 结束编辑状态（iOS 键盘处理）
    if (chatAIUtils.isMN4() && chatAIUtils.sideOutputController) {
      chatAIUtils.sideOutputController.userInput.endEditing(true)
    }
    
    // 4. 计算动态按钮位置
    let studyFrame = MNUtil.studyView.frame
    let winFrame = MNUtil.parseWinRect(sender.userInfo.winRect)
    
    // 根据箭头方向调整偏移量
    let xOffset = sender.userInfo.arrow === 1 ? 20 : -80
    let yOffset = sender.userInfo.arrow === 1 ? -60 : -30
    
    winFrame.x = winFrame.x + xOffset - studyFrame.x
    winFrame.y = winFrame.y + yOffset
    
    // 边界约束
    winFrame.x = MNUtil.constrain(winFrame.x, 0, studyFrame.width - 40)
    
    // 5. 显示动态控制器
    let dynamicFrame = MNUtil.genFrame(winFrame.x, winFrame.y, 40, 40)
    await self.checkDynamicController(dynamicFrame)
    
    // 6. 确保视图层级正确
    chatAIUtils.ensureView(chatAIUtils.dynamicController.view)
    
    // 7. 智能触发检查
    if (!self.checkShouldProceed(chatAIUtils.currentSelection, -1, "onSelection")) {
      return
    }
    
    // 8. 触发 AI 对话
    chatAIUtils.chatController.askWithDelay()
    
  } catch (error) {
    chatAIUtils.addErrorLog(error, "onPopupMenuOnSelection")
  }
}
```

#### 智能触发系统

```javascript
checkShouldProceed: function (text, colorIndex = -1, param = "") {
  // 1. 检查插件是否激活
  if (!chatAIUtils.chatController.view.window || !chatAIConfig.config.autoAction) {
    return false
  }
  
  // 2. 检查特定事件是否启用
  if (param !== "" && !chatAIConfig.config[param]) {
    return false
  }
  
  // 3. 检查是否在聊天模式（避免干扰）
  if (chatAIUtils.notifyController.onChat) {
    return false
  }
  
  // 4. 颜色过滤（根据笔记颜色决定是否触发）
  if (colorIndex !== -1 && !chatAIConfig.getConfig("colorConfig")[colorIndex]) {
    return false
  }
  
  // 5. 短文本过滤
  if (chatAIConfig.config.ignoreShortText && chatAIUtils.countWords(text) < 10) {
    return false
  }
  
  return true
}
```

### 3. WebView 高级集成

ChatAI 使用 WebView 实现富文本界面：

```javascript
// webviewController.js - WebView 控制器示例
var webviewController = JSB.defineClass('webviewController : UIViewController', {
  viewDidLoad: function() {
    let self = this
    
    // 创建 WebView
    self.webView = UIWebView.new()
    self.webView.delegate = self
    self.webView.scrollView.delegate = self
    self.view.addSubview(self.webView)
    
    // 加载 HTML
    let htmlPath = self.mainPath + '/index.html'
    let htmlContent = NSString.stringWithContentsOfFileEncodingError(htmlPath, 4, null)
    let baseURL = NSURL.fileURLWithPath(self.mainPath)
    self.webView.loadHTMLStringBaseURL(htmlContent, baseURL)
  },
  
  // WebView 加载完成
  webViewDidFinishLoad: function(webView) {
    // 注入 JavaScript
    webView.evaluateJavaScript(`
      // 设置主题
      document.body.className = '${MNUtil.isDarkMode() ? 'dark' : 'light'}';
      
      // 初始化 Markdown 渲染器
      window.md = window.markdownit({
        html: true,
        linkify: true,
        typographer: true
      });
      
      // 初始化数学公式支持
      MathJax.startup.defaultReady();
    `)
  },
  
  // JavaScript 与原生通信
  webViewShouldStartLoadWithRequestNavigationType: function(webView, request, type) {
    let url = request.URL.absoluteString
    
    if (url.startsWith('jsbox://')) {
      let action = url.replace('jsbox://', '')
      let params = action.split('?')
      
      switch (params[0]) {
        case 'copy':
          MNUtil.copy(decodeURIComponent(params[1]))
          MNUtil.showHUD("已复制")
          break
          
        case 'openNote':
          let noteId = params[1]
          MNNote.new(noteId).focusInMindMap()
          break
          
        case 'executePrompt':
          self.executePrompt(params[1])
          break
      }
      
      return false  // 阻止加载
    }
    
    return true
  }
})
```

### 4. 手势处理高级技巧

```javascript
// 添加拖动手势
addDragGesture: function() {
  let self = this
  
  // 创建拖动手势识别器
  self.panGesture = UIPanGestureRecognizer.alloc().initWithTargetAction(self, "handlePan:")
  self.view.addGestureRecognizer(self.panGesture)
  
  // 创建长按手势
  self.longPressGesture = UILongPressGestureRecognizer.alloc().initWithTargetAction(self, "handleLongPress:")
  self.longPressGesture.minimumPressDuration = 0.5
  self.view.addGestureRecognizer(self.longPressGesture)
},

// 处理拖动
handlePan: function(gesture) {
  let translation = gesture.translationInView(self.view)
  let velocity = gesture.velocityInView(self.view)
  
  switch (gesture.state) {
    case 1: // Began
      self.dragStartFrame = self.view.frame
      break
      
    case 2: // Changed
      let newFrame = self.dragStartFrame
      newFrame.x += translation.x
      newFrame.y += translation.y
      
      // 边界检查
      let studyFrame = MNUtil.studyView.bounds
      newFrame.x = MNUtil.constrain(newFrame.x, 0, studyFrame.width - newFrame.width)
      newFrame.y = MNUtil.constrain(newFrame.y, 0, studyFrame.height - newFrame.height)
      
      self.view.frame = newFrame
      break
      
    case 3: // Ended
      // 吸附到边缘效果
      if (Math.abs(velocity.x) > 1000) {
        let studyWidth = MNUtil.studyView.bounds.width
        let targetX = velocity.x > 0 ? studyWidth - self.view.frame.width : 0
        
        MNUtil.animate(function() {
          self.view.frame = {
            x: targetX,
            y: self.view.frame.y,
            width: self.view.frame.width,
            height: self.view.frame.height
          }
        }, 0.3)
      }
      break
  }
},

// 处理长按
handleLongPress: function(gesture) {
  if (gesture.state === 1) { // Began
    // 震动反馈（iOS）
    if (MNUtil.isIOS()) {
      let generator = UIImpactFeedbackGenerator.alloc().initWithStyle(1)
      generator.prepare()
      generator.impactOccurred()
    }
    
    // 显示更多选项
    self.showMoreOptions(gesture.view)
  }
}
```

### 5. 配置管理系统

```javascript
// 配置管理类
var MyConfig = {
  // 默认配置
  defaultConfig: {
    autoAction: true,
    theme: "auto",
    language: "zh-CN",
    shortcuts: {
      copy: "cmd+c",
      paste: "cmd+v"
    }
  },
  
  // 获取配置
  getConfig: function(key) {
    let config = NSUserDefaults.standardUserDefaults().objectForKey("MyAddon_config")
    if (!config) {
      config = this.defaultConfig
      this.saveConfig(config)
    }
    return key ? config[key] : config
  },
  
  // 保存配置
  saveConfig: function(config) {
    NSUserDefaults.standardUserDefaults().setObjectForKey(config, "MyAddon_config")
  },
  
  // 更新配置项
  updateConfig: function(key, value) {
    let config = this.getConfig()
    config[key] = value
    this.saveConfig(config)
  },
  
  // 导出配置
  exportConfig: function() {
    let config = this.getConfig()
    let jsonString = JSON.stringify(config, null, 2)
    MNUtil.copy(jsonString)
    MNUtil.showHUD("配置已复制到剪贴板")
  },
  
  // 导入配置
  importConfig: function(jsonString) {
    try {
      let config = JSON.parse(jsonString)
      this.saveConfig(config)
      MNUtil.showHUD("配置导入成功")
      return true
    } catch (error) {
      MNUtil.showHUD("配置格式错误")
      return false
    }
  },
  
  // iCloud 同步
  syncToiCloud: function() {
    let config = this.getConfig()
    NSUbiquitousKeyValueStore.defaultStore().setObjectForKey(config, "MyAddon_config")
    NSUbiquitousKeyValueStore.defaultStore().synchronize()
  },
  
  // 从 iCloud 恢复
  syncFromiCloud: function() {
    let config = NSUbiquitousKeyValueStore.defaultStore().objectForKey("MyAddon_config")
    if (config) {
      this.saveConfig(config)
      MNUtil.showHUD("从 iCloud 同步成功")
    }
  }
}
```

### 6. 工具系统实现

ChatAI 的工具系统展示了如何实现可扩展的功能架构：

```javascript
// 工具类定义
class chatAITool {
  constructor(name, config) {
    this.name = name
    this.args = config.args
    this.description = config.description
    this.needNote = config.needNote ?? false
  }
  
  // 生成工具描述（用于 AI）
  body() {
    return {
      type: "function",
      function: {
        name: this.name,
        description: this.description,
        parameters: {
          type: "object",
          properties: this.args,
          required: Object.keys(this.args)
        }
      }
    }
  }
  
  // 执行工具
  async execute(func, noteId) {
    let args = JSON.parse(func.function.arguments)
    
    switch (this.name) {
      case "setTitle":
        return this.setTitle(args, noteId)
      case "addComment":
        return this.addComment(args, noteId)
      case "searchNotes":
        return this.searchNotes(args)
      // ... 更多工具
    }
  }
  
  // 设置笔记标题
  setTitle(args, noteId) {
    let note = MNNote.new(noteId)
    MNUtil.undoGrouping(() => {
      note.noteTitle = args.title
    })
    return {
      success: true,
      response: `标题已设置为：${args.title}`
    }
  }
  
  // 搜索笔记
  async searchNotes(args) {
    let results = []
    let notebooks = MNUtil.getNotebooks()
    
    for (let notebook of notebooks) {
      let notes = notebook.notes.filter(note => 
        note.noteTitle.includes(args.query) ||
        note.excerptText.includes(args.query)
      )
      results.push(...notes)
    }
    
    return {
      success: true,
      response: `找到 ${results.length} 条相关笔记`,
      data: results
    }
  }
}

// 注册工具
var toolRegistry = {
  tools: [],
  
  register: function(tool) {
    this.tools.push(tool)
  },
  
  getTools: function() {
    return this.tools.map(tool => tool.body())
  },
  
  execute: async function(funcCall) {
    let tool = this.tools.find(t => t.name === funcCall.function.name)
    if (tool) {
      return await tool.execute(funcCall)
    }
    return { success: false, response: "工具未找到" }
  }
}

// 初始化工具
toolRegistry.register(new chatAITool("setTitle", {
  args: {
    title: { type: "string", description: "新标题" }
  },
  description: "设置笔记标题",
  needNote: true
}))
```

### 7. 动画系统使用

```javascript
// 动画工具类
var AnimationUtils = {
  // 淡入效果
  fadeIn: function(view, duration = 0.3) {
    view.alpha = 0
    view.hidden = false
    
    MNUtil.animate(function() {
      view.alpha = 1
    }, duration)
  },
  
  // 淡出效果
  fadeOut: function(view, duration = 0.3) {
    MNUtil.animate(function() {
      view.alpha = 0
    }, duration, function() {
      view.hidden = true
      view.alpha = 1
    })
  },
  
  // 弹性动画
  springAnimation: function(view, toFrame, duration = 0.5) {
    UIView.animateWithDurationDelayUsingSpringWithDampingInitialSpringVelocityOptionsAnimationsCompletion(
      duration,
      0,
      0.7,  // 阻尼系数
      0.5,  // 初始速度
      0,
      function() {
        view.frame = toFrame
      },
      null
    )
  },
  
  // 缩放动画
  scaleAnimation: function(view, scale, duration = 0.3) {
    MNUtil.animate(function() {
      view.transform = CGAffineTransformMakeScale(scale, scale)
    }, duration)
  },
  
  // 组合动画
  complexAnimation: function(view, animations, duration = 0.5) {
    MNUtil.animate(function() {
      if (animations.alpha !== undefined) view.alpha = animations.alpha
      if (animations.frame) view.frame = animations.frame
      if (animations.transform) view.transform = animations.transform
      if (animations.backgroundColor) view.backgroundColor = animations.backgroundColor
    }, duration)
  }
}
```

### 8. 调试技巧和最佳实践

```javascript
// 调试工具类
var DebugUtils = {
  // 安全的日志输出
  log: function(message, prefix = "🔧") {
    if (typeof MNUtil !== "undefined" && MNUtil.log) {
      MNUtil.log(`${prefix} ${message}`)
    }
  },
  
  // 错误日志记录
  addErrorLog: function(error, functionName, context = {}) {
    let errorInfo = {
      time: new Date().toISOString(),
      function: functionName,
      error: error.toString(),
      stack: error.stack,
      context: context
    }
    
    // 保存到本地
    let logs = NSUserDefaults.standardUserDefaults().objectForKey("MyAddon_errorLogs") || []
    logs.push(errorInfo)
    
    // 只保留最近 100 条
    if (logs.length > 100) {
      logs = logs.slice(-100)
    }
    
    NSUserDefaults.standardUserDefaults().setObjectForKey(logs, "MyAddon_errorLogs")
    
    // 显示错误提示
    MNUtil.showHUD(`❌ ${functionName}: ${error.message}`)
  },
  
  // 性能监控
  measureTime: function(label, fn) {
    let start = Date.now()
    let result = fn()
    let duration = Date.now() - start
    
    this.log(`${label} 耗时: ${duration}ms`, "⏱")
    return result
  },
  
  // 内存使用监控
  checkMemory: function() {
    let info = NSProcessInfo.processInfo()
    let memory = info.physicalMemory / 1024 / 1024 / 1024
    this.log(`内存使用: ${memory.toFixed(2)}GB`, "💾")
  },
  
  // 对象检查
  inspectObject: function(obj, depth = 2) {
    let seen = new WeakSet()
    
    function stringify(obj, currentDepth) {
      if (currentDepth > depth) return '...'
      if (obj === null) return 'null'
      if (obj === undefined) return 'undefined'
      if (seen.has(obj)) return '[Circular]'
      
      if (typeof obj === 'object') {
        seen.add(obj)
        
        if (Array.isArray(obj)) {
          return '[' + obj.map(item => stringify(item, currentDepth + 1)).join(', ') + ']'
        }
        
        let pairs = []
        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            pairs.push(`${key}: ${stringify(obj[key], currentDepth + 1)}`)
          }
        }
        return '{' + pairs.join(', ') + '}'
      }
      
      return String(obj)
    }
    
    MNUtil.copy(stringify(obj, 0))
    MNUtil.showHUD("对象已复制到剪贴板")
  }
}

// 全局错误处理
if (typeof MNUtil !== "undefined") {
  // 包装所有方法以捕获错误
  function wrapMethod(obj, methodName) {
    let original = obj[methodName]
    obj[methodName] = function() {
      try {
        return original.apply(this, arguments)
      } catch (error) {
        DebugUtils.addErrorLog(error, methodName)
        return undefined
      }
    }
  }
}
```

## 实战：开发你的第一个插件

让我们创建一个简单但完整的笔记统计插件：

```javascript
// main.js
JSB.newAddon = function (mainPath) {
  JSB.require('mnutils')
  if (typeof MNUtil == 'undefined') return undefined
  
  var NoteStatsClass = JSB.defineClass('NoteStats : JSExtension', {
    // 初始化
    sceneWillConnect: function () {
      self.mainPath = mainPath
      self.stats = {
        noteCount: 0,
        tagCount: 0,
        colorUsage: {}
      }
    },
    
    // 工具栏按钮
    queryAddonCommandStatus: function () {
      return {
        image: "logo.png",
        object: self,
        selector: "showMenu:",
        checked: false
      }
    },
    
    // 显示菜单
    showMenu: function (button) {
      var items = [
        {title: "📊  查看统计", object: self, selector: "showStats:"},
        {title: "🔄  刷新数据", object: self, selector: "refreshStats:"},
        {title: "📤  导出报告", object: self, selector: "exportReport:"}
      ]
      
      this.showPopover(button, items, 180)
    },
    
    // 显示统计
    showStats: function () {
      this.refreshStatsData()
      
      if (!self.statsView) {
        self.statsView = this.createStatsView()
      }
      
      self.statsView.hidden = false
      this.updateStatsDisplay()
    },
    
    // 创建统计视图
    createStatsView: function () {
      var view = UIView.new()
      view.backgroundColor = MNUtil.hexColorAlpha("#ffffff", 0.95)
      view.layer.cornerRadius = 15
      view.frame = MNUtil.genFrame(200, 100, 300, 400)
      
      // 标题
      var title = UILabel.new()
      title.text = "笔记统计"
      title.font = UIFont.boldSystemFontOfSize(20)
      title.textAlignment = 1
      title.frame = MNUtil.genFrame(0, 20, 300, 30)
      view.addSubview(title)
      
      // 统计内容
      self.statsLabel = UILabel.new()
      self.statsLabel.numberOfLines = 0
      self.statsLabel.frame = MNUtil.genFrame(20, 70, 260, 300)
      view.addSubview(self.statsLabel)
      
      // 关闭按钮
      var closeBtn = MNButton.new()
      MNButton.setConfig(closeBtn, {
        title: "关闭",
        color: "#ff4444",
        font: 16
      })
      closeBtn.frame = MNUtil.genFrame(100, 350, 100, 35)
      closeBtn.addTargetActionForControlEvents(self, "closeStats", 1 << 6)
      view.addSubview(closeBtn)
      
      MNUtil.studyView.addSubview(view)
      return view
    },
    
    // 刷新统计数据
    refreshStatsData: function () {
      var notebook = MNUtil.currentNotebook
      if (!notebook) return
      
      var allNotes = notebook.notes
      self.stats.noteCount = allNotes.length
      self.stats.tagCount = 0
      self.stats.colorUsage = {}
      
      var allTags = new Set()
      
      allNotes.forEach(note => {
        // 统计标签
        note.tags.forEach(tag => allTags.add(tag))
        
        // 统计颜色
        var color = note.colorIndex
        if (!self.stats.colorUsage[color]) {
          self.stats.colorUsage[color] = 0
        }
        self.stats.colorUsage[color]++
      })
      
      self.stats.tagCount = allTags.size
    },
    
    // 更新显示
    updateStatsDisplay: function () {
      var text = `总笔记数：${self.stats.noteCount}\n\n`
      text += `标签总数：${self.stats.tagCount}\n\n`
      text += "颜色使用统计：\n"
      
      Object.keys(self.stats.colorUsage).forEach(color => {
        text += `  颜色 ${color}：${self.stats.colorUsage[color]} 个\n`
      })
      
      self.statsLabel.text = text
    }
  })
  
  return NoteStatsClass
}
```

## 更多高级技术

### 9. URL Scheme 支持

MarginNote 支持通过 URL Scheme 调用插件功能：

```javascript
// 处理 URL Scheme 调用
onAddonBroadcast: async function (sender) {
  try {
    let message = sender.userInfo.message
    
    // 检查是否是你的插件的 URL Scheme
    if (/myaddon\?/.test(message)) {
      // 解析参数
      let arguments = message.match(/(?<=myaddon\?).*/)[0].split("&")
      let config = {}
      
      arguments.forEach((arg) => {
        let kv = arg.split("=")
        switch (kv[0]) {
          case "text":
          case "prompt":
            config[kv[0]] = decodeURIComponent(kv[1])
            break
          default:
            config[kv[0]] = kv[1]
            break
        }
      })
      
      // 处理不同的 action
      switch (config.action) {
        case "process":
          // marginnote4app://addon/myaddon?action=process&text={content}
          this.processText(config.text)
          break
          
        case "open":
          // marginnote4app://addon/myaddon?action=open
          this.openMainView()
          break
          
        case "export":
          // marginnote4app://addon/myaddon?action=export&format=markdown
          this.exportNotes(config.format)
          break
      }
    }
  } catch (error) {
    MNUtil.addErrorLog(error, "onAddonBroadcast")
  }
}
```

### 10. MN3 和 MN4 兼容性处理

```javascript
// 版本检测工具
var VersionUtils = {
  isMN3: function() {
    return !MNUtil.isMN4
  },
  
  isMN4: function() {
    return MNUtil.isMN4
  },
  
  // 获取当前版本号
  getVersion: function() {
    let version = Application.sharedInstance().osType === 0 ? 
      NSBundle.mainBundle().infoDictionary.CFBundleShortVersionString :
      NSBundle.mainBundle().infoDictionary.CFBundleVersion
    return version
  },
  
  // 版本兼容的 API 调用
  compatibleCall: function(mn4Func, mn3Func) {
    if (this.isMN4()) {
      return mn4Func()
    } else {
      return mn3Func()
    }
  }
}

// 使用示例
openSideBar: function() {
  VersionUtils.compatibleCall(
    // MN4 版本
    () => {
      if (!chatAIUtils.sideOutputController) {
        chatAIUtils.sideOutputController = sideOutputController.new()
        MNExtensionPanel.show()
        MNExtensionPanel.addSubview("myView", chatAIUtils.sideOutputController.view)
      } else {
        MNExtensionPanel.show("myView")
      }
    },
    // MN3 版本
    () => {
      MNUtil.showHUD("侧边栏功能仅在 MN4 中可用")
    }
  )
}
```

### 11. 笔记操作高级技巧

```javascript
// 笔记工具类
var NoteUtils = {
  // 获取笔记的完整文本（包括所有评论）
  getFullText: async function(note) {
    let text = ""
    
    // 标题
    if (note.noteTitle) {
      text += "# " + note.noteTitle + "\n\n"
    }
    
    // 摘录文本
    if (note.excerptText) {
      text += note.excerptText + "\n\n"
    }
    
    // 评论
    let comments = note.comments
    for (let comment of comments) {
      if (comment.type === "TextNote") {
        text += comment.text + "\n"
      } else if (comment.type === "HtmlNote") {
        // 处理 HTML 评论
        let html = await this.getHtmlContent(comment)
        text += html + "\n"
      }
    }
    
    // 标签
    if (note.tags && note.tags.length) {
      text += "\n标签：" + note.tags.join(", ")
    }
    
    return text
  },
  
  // 批量操作笔记
  batchOperation: function(notes, operation) {
    MNUtil.undoGrouping(() => {
      notes.forEach(note => {
        operation(note)
      })
    })
  },
  
  // 创建笔记层级结构
  buildHierarchy: function(notes) {
    let map = {}
    let roots = []
    
    // 建立映射
    notes.forEach(note => {
      map[note.noteId] = {
        ...note,
        children: []
      }
    })
    
    // 构建层级
    notes.forEach(note => {
      if (note.parentId && map[note.parentId]) {
        map[note.parentId].children.push(map[note.noteId])
      } else {
        roots.push(map[note.noteId])
      }
    })
    
    return roots
  },
  
  // 查找相关笔记
  findRelatedNotes: function(note, depth = 2) {
    let related = new Set()
    let queue = [{note: note, depth: 0}]
    
    while (queue.length > 0) {
      let {note: currentNote, depth: currentDepth} = queue.shift()
      
      if (currentDepth >= depth) continue
      
      // 父笔记
      if (currentNote.parentNote) {
        related.add(currentNote.parentNote.noteId)
        queue.push({note: currentNote.parentNote, depth: currentDepth + 1})
      }
      
      // 子笔记
      currentNote.childNotes.forEach(child => {
        related.add(child.noteId)
        queue.push({note: child, depth: currentDepth + 1})
      })
      
      // 链接的笔记
      currentNote.linkedNotes.forEach(linked => {
        related.add(linked.noteId)
        queue.push({note: linked, depth: currentDepth + 1})
      })
    }
    
    return Array.from(related)
  }
}
```

### 12. 网络请求和 API 集成

```javascript
// 网络请求工具
var NetworkUtils = {
  // 基础请求方法
  request: async function(url, options = {}) {
    return new Promise((resolve, reject) => {
      let request = NSMutableURLRequest.requestWithURL(NSURL.URLWithString(url))
      
      // 设置方法
      request.HTTPMethod = options.method || "GET"
      
      // 设置请求头
      if (options.headers) {
        Object.keys(options.headers).forEach(key => {
          request.setValueForHTTPHeaderField(options.headers[key], key)
        })
      }
      
      // 设置请求体
      if (options.body) {
        if (typeof options.body === 'object') {
          request.HTTPBody = NSJSONSerialization.dataWithJSONObjectOptionsError(options.body, 0, null)
          request.setValueForHTTPHeaderField("application/json", "Content-Type")
        } else {
          request.HTTPBody = NSString.stringWithString(options.body).dataUsingEncoding(4)
        }
      }
      
      // 创建会话
      let session = NSURLSession.sharedSession()
      let task = session.dataTaskWithRequestCompletionHandler(request, (data, response, error) => {
        if (error) {
          reject(error)
          return
        }
        
        try {
          let result = NSJSONSerialization.JSONObjectWithDataOptionsError(data, 0, null)
          resolve(result)
        } catch {
          let text = NSString.alloc().initWithDataEncoding(data, 4)
          resolve(text)
        }
      })
      
      task.resume()
    })
  },
  
  // GET 请求
  get: function(url, headers = {}) {
    return this.request(url, { method: "GET", headers })
  },
  
  // POST 请求
  post: function(url, body, headers = {}) {
    return this.request(url, { method: "POST", body, headers })
  },
  
  // 上传文件
  uploadFile: async function(url, filePath, fieldName = "file") {
    return new Promise((resolve, reject) => {
      let boundary = "Boundary-" + NSUUID.UUID().UUIDString
      let request = NSMutableURLRequest.requestWithURL(NSURL.URLWithString(url))
      request.HTTPMethod = "POST"
      request.setValueForHTTPHeaderField(`multipart/form-data; boundary=${boundary}`, "Content-Type")
      
      // 构建表单数据
      let formData = NSMutableData.data()
      
      // 文件部分
      formData.appendData(NSString.stringWithFormat(`--%@\r\n`, boundary).dataUsingEncoding(4))
      formData.appendData(NSString.stringWithFormat(`Content-Disposition: form-data; name="%@"; filename="%@"\r\n`, fieldName, filePath.lastPathComponent).dataUsingEncoding(4))
      formData.appendData(NSString.stringWithString("Content-Type: application/octet-stream\r\n\r\n").dataUsingEncoding(4))
      
      // 文件内容
      let fileData = NSData.dataWithContentsOfFile(filePath)
      formData.appendData(fileData)
      
      formData.appendData(NSString.stringWithFormat(`\r\n--%@--\r\n`, boundary).dataUsingEncoding(4))
      
      request.HTTPBody = formData
      
      // 发送请求
      let session = NSURLSession.sharedSession()
      let task = session.dataTaskWithRequestCompletionHandler(request, (data, response, error) => {
        if (error) {
          reject(error)
          return
        }
        
        let result = NSString.alloc().initWithDataEncoding(data, 4)
        resolve(result)
      })
      
      task.resume()
    })
  }
}
```

### 13. 文件操作和数据导出

```javascript
// 文件操作工具
var FileUtils = {
  // 获取插件目录
  getAddonPath: function() {
    return self.mainPath
  },
  
  // 读取文件
  readFile: function(path) {
    return NSString.stringWithContentsOfFileEncodingError(path, 4, null)
  },
  
  // 写入文件
  writeFile: function(path, content) {
    return NSString.stringWithString(content).writeToFileAtomicallyEncoding(path, true, 4)
  },
  
  // 检查文件是否存在
  fileExists: function(path) {
    return NSFileManager.defaultManager().fileExistsAtPath(path)
  },
  
  // 创建目录
  createDirectory: function(path) {
    return NSFileManager.defaultManager().createDirectoryAtPathWithIntermediateDirectoriesAttributesError(
      path, true, null, null
    )
  },
  
  // 导出为 Markdown
  exportToMarkdown: function(notes) {
    let markdown = ""
    
    notes.forEach(note => {
      // 标题
      if (note.noteTitle) {
        markdown += `# ${note.noteTitle}\n\n`
      }
      
      // 摘录
      if (note.excerptText) {
        markdown += `> ${note.excerptText}\n\n`
      }
      
      // 评论
      note.comments.forEach(comment => {
        if (comment.type === "TextNote") {
          markdown += `${comment.text}\n\n`
        }
      })
      
      // 标签
      if (note.tags && note.tags.length) {
        markdown += `标签：${note.tags.map(tag => `\`${tag}\``).join(", ")}\n\n`
      }
      
      // 链接
      markdown += `[查看原文](${note.noteURL})\n\n`
      markdown += "---\n\n"
    })
    
    return markdown
  },
  
  // 导出为 JSON
  exportToJSON: function(notes) {
    let data = notes.map(note => ({
      id: note.noteId,
      title: note.noteTitle,
      excerpt: note.excerptText,
      comments: note.comments.map(c => ({
        type: c.type,
        content: c.text || c.html
      })),
      tags: note.tags,
      color: note.colorIndex,
      createTime: note.createTime,
      modifyTime: note.modifyTime
    }))
    
    return JSON.stringify(data, null, 2)
  },
  
  // 保存到相册（截图）
  saveToPhotos: function(image) {
    UIImageWriteToSavedPhotosAlbum(image, self, "imageSaved:error:contextInfo:", null)
  }
}
```

### 14. 性能优化技巧

```javascript
// 性能优化工具
var PerformanceUtils = {
  // 防抖函数
  debounce: function(func, wait) {
    let timeout
    return function() {
      let context = this
      let args = arguments
      clearTimeout(timeout)
      timeout = setTimeout(() => func.apply(context, args), wait)
    }
  },
  
  // 节流函数
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
  },
  
  // 分批处理大量数据
  batchProcess: async function(items, batchSize, processor) {
    let results = []
    
    for (let i = 0; i < items.length; i += batchSize) {
      let batch = items.slice(i, i + batchSize)
      
      // 处理一批
      let batchResults = await Promise.all(
        batch.map(item => processor(item))
      )
      
      results.push(...batchResults)
      
      // 让出控制权，避免阻塞 UI
      await MNUtil.delay(0.01)
      
      // 更新进度
      let progress = Math.round((i + batch.length) / items.length * 100)
      MNUtil.showHUD(`处理中... ${progress}%`)
    }
    
    return results
  },
  
  // 缓存管理
  CacheManager: {
    cache: {},
    
    get: function(key) {
      let item = this.cache[key]
      if (item && item.expiry > Date.now()) {
        return item.value
      }
      delete this.cache[key]
      return null
    },
    
    set: function(key, value, ttl = 3600000) { // 默认 1 小时
      this.cache[key] = {
        value: value,
        expiry: Date.now() + ttl
      }
    },
    
    clear: function() {
      this.cache = {}
    }
  }
}
```

## 进阶技巧

### 1. 动画效果

使用 MNUtil.animate 创建流畅动画：

```javascript
// 淡入效果
MNUtil.animate(function() {
  view.alpha = 1.0
}, 0.3)

// 位置动画
MNUtil.animate(function() {
  view.frame = MNUtil.genFrame(100, 100, 300, 400)
}, 0.5)
```

### 2. 手势识别

添加各种手势支持：

```javascript
// 拖动手势
var pan = UIPanGestureRecognizer.alloc().initWithTargetAction(self, "handlePan:")
view.addGestureRecognizer(pan)

// 点击手势
var tap = UITapGestureRecognizer.alloc().initWithTargetAction(self, "handleTap:")
view.addGestureRecognizer(tap)

// 长按手势
var longPress = UILongPressGestureRecognizer.alloc().initWithTargetAction(self, "handleLongPress:")
view.addGestureRecognizer(longPress)
```

### 3. 数据持久化

使用 NSUserDefaults 保存配置：

```javascript
// 保存数据
NSUserDefaults.standardUserDefaults().setObjectForKey(data, "myAddonConfig")

// 读取数据
var data = NSUserDefaults.standardUserDefaults().objectForKey("myAddonConfig")
```

### 4. WebView 集成

创建 WebView 显示富文本内容：

```javascript
var webView = UIWebView.new()
webView.frame = MNUtil.genFrame(0, 0, 400, 300)
webView.loadHTMLStringBaseURL("<h1>Hello World</h1>", null)
view.addSubview(webView)
```

### 5. 自定义绘制

使用 Core Graphics 绘制自定义图形：

```javascript
// 创建自定义视图
var customView = UIView.new()
customView.drawRect = function(rect) {
  var ctx = UIGraphicsGetCurrentContext()
  
  // 绘制圆形
  CGContextSetFillColorWithColor(ctx, UIColor.redColor().CGColor())
  CGContextFillEllipseInRect(ctx, MNUtil.genFrame(10, 10, 50, 50))
  
  // 绘制文字
  var str = "Hello"
  str.drawInRectWithAttributes(MNUtil.genFrame(70, 20, 100, 30), {
    NSFontAttributeName: UIFont.systemFontOfSize(16),
    NSForegroundColorAttributeName: UIColor.blackColor()
  })
}
```

## 常见问题

### Q1: 插件不显示在工具栏？

确保实现了 `queryAddonCommandStatus` 方法并返回正确的配置。

### Q2: 视图位置错乱？

使用 `MNUtil.studyView` 作为父视图，并在 `controllerWillLayoutSubviews` 中更新布局。

### Q3: 手势冲突？

设置手势识别器的代理，实现 `gestureRecognizerShouldBegin` 方法。

### Q4: 内存泄漏？

在 `sceneDidDisconnect` 中清理所有资源和监听器。

## 常用 API 快速参考

### MNUtil 核心 API

```javascript
// 系统信息
MNUtil.isMN4                    // 是否是 MN4
MNUtil.isIOS()                  // 是否是 iOS
MNUtil.isMacOS()                // 是否是 macOS
MNUtil.isDarkMode()             // 是否是深色模式
MNUtil.studyView                // 学习视图
MNUtil.studyController          // 学习控制器
MNUtil.currentWindow            // 当前窗口
MNUtil.focusWindow              // 焦点窗口

// UI 操作
MNUtil.showHUD(text, duration)  // 显示提示
MNUtil.waitHUD(text)            // 显示等待提示
MNUtil.stopHUD()                // 停止等待提示
MNUtil.alert(title, message)    // 显示警告
MNUtil.confirm(title, message, buttons) // 确认对话框
MNUtil.input(title, placeholder) // 输入对话框

// 工具函数
MNUtil.copy(text)               // 复制到剪贴板
MNUtil.log(message)             // 日志输出
MNUtil.delay(seconds)           // 延迟执行
MNUtil.animate(block, duration) // 动画
MNUtil.undoGrouping(block)      // 撤销分组
MNUtil.genFrame(x,y,w,h)        // 生成 frame
MNUtil.constrain(value,min,max) // 约束值
MNUtil.hexColorAlpha(hex,alpha) // 颜色转换

// 笔记操作
MNUtil.currentNotebook          // 当前笔记本
MNUtil.currentDocumentController // 当前文档控制器
MNUtil.currentSelection         // 当前选择
MNUtil.getDocImage(selected, pure) // 获取文档图片
```

### MNNote 笔记 API

```javascript
// 创建和获取
MNNote.new(noteId)              // 通过 ID 获取笔记
MNNote.getFocusNote()           // 获取焦点笔记
MNNote.getFocusNotes()          // 获取所有焦点笔记
MNNote.createWithTitleNotebook(title, notebook) // 创建笔记

// 笔记属性
note.noteId                     // 笔记 ID
note.noteTitle                  // 标题
note.excerptText                // 摘录文本
note.excerptPic                 // 摘录图片
note.colorIndex                 // 颜色索引 (0-15)
note.fillIndex                  // 填充索引
note.mindmapBranchIndex         // 脑图分支索引
note.tags                       // 标签数组
note.createTime                 // 创建时间
note.modifyTime                 // 修改时间
note.startPage                  // 起始页
note.endPage                    // 结束页
note.noteURL                    // 笔记链接

// 关系
note.parentNote                 // 父笔记
note.childNotes                 // 子笔记数组
note.linkedNotes                // 链接的笔记
note.summaryLinks               // 摘要链接

// 评论操作
note.comments                   // 所有评论
note.appendTextComment(text)    // 添加文本评论
note.appendMarkdownComment(md)  // 添加 Markdown 评论
note.appendHtmlComment(html, text) // 添加 HTML 评论
note.appendImageComment(image)  // 添加图片评论
note.appendNoteLink(note)       // 添加笔记链接
note.removeCommentByIndex(index) // 删除评论

// 笔记操作
note.merge(note)                // 合并笔记
note.addAsChildNote(note)       // 添加子笔记
note.addAsChildMindmap(note)    // 添加为脑图子节点
note.focusInMindMap(duration)   // 在脑图中聚焦
note.focusInDocument()          // 在文档中聚焦
```

### MNNotebook 笔记本 API

```javascript
// 获取笔记本
MNUtil.currentNotebook          // 当前笔记本
MNUtil.getNotebooks()           // 所有笔记本
notebook.notes                  // 笔记本中的所有笔记
notebook.docMd5                 // 文档 MD5
notebook.lastVisit              // 最后访问时间

// 笔记本操作
notebook.addNote(note)          // 添加笔记
notebook.removeNote(note)       // 删除笔记
```

### MNDocument 文档 API

```javascript
// 文档属性
doc.docMd5                      // 文档 MD5
doc.pathFile                    // 文件路径
doc.docTitle                    // 文档标题
doc.pageCount                   // 页数
doc.currentPageIndex            // 当前页索引

// 文档操作
doc.highlightFromSelection()    // 从选择创建高亮
doc.imageFromSelection()        // 从选择获取图片
doc.textFromSelection()         // 从选择获取文本
```

### UI 组件创建

```javascript
// 创建按钮
let button = UIButton.buttonWithType(0)
button.setTitleForState("按钮", 0)
button.setTitleColorForState(UIColor.whiteColor(), 0)
button.backgroundColor = UIColor.blueColor()
button.layer.cornerRadius = 5
button.addTargetActionForControlEvents(self, "buttonTapped:", 1 << 6)

// 创建标签
let label = UILabel.new()
label.text = "标签文本"
label.font = UIFont.systemFontOfSize(16)
label.textColor = UIColor.blackColor()
label.textAlignment = 1 // 居中

// 创建输入框
let textField = UITextField.new()
textField.placeholder = "请输入"
textField.borderStyle = 3
textField.delegate = self

// 创建开关
let switchControl = UISwitch.new()
switchControl.on = true
switchControl.addTargetActionForControlEvents(self, "switchChanged:", 1 << 12)
```

## 最佳实践总结

### 1. 代码组织

```javascript
// 推荐的文件结构
my-addon/
├── main.js           // 主入口，简洁清晰
├── utils.js          // 工具函数集合
├── config.js         // 配置管理
├── controllers/      // 控制器目录
│   ├── mainController.js
│   ├── settingController.js
│   └── webviewController.js
├── resources/        // 资源文件
│   ├── html/
│   ├── css/
│   └── images/
└── lib/             // 第三方库
```

### 2. 错误处理模式

```javascript
// 统一的错误处理
function safeExecute(func, funcName) {
  return async function(...args) {
    try {
      return await func.apply(this, args)
    } catch (error) {
      ErrorHandler.log(error, funcName)
      return null
    }
  }
}

// 使用示例
MyClass.prototype.riskyOperation = safeExecute(async function(param) {
  // 可能出错的操作
}, "riskyOperation")
```

### 3. 状态管理

```javascript
// 集中式状态管理
var StateManager = {
  _state: {},
  
  get(key) {
    return this._state[key]
  },
  
  set(key, value) {
    let oldValue = this._state[key]
    this._state[key] = value
    this.notify(key, oldValue, value)
  },
  
  notify(key, oldValue, newValue) {
    // 通知相关组件更新
    NSNotificationCenter.defaultCenter().postNotificationNameObjectUserInfo(
      "StateChanged",
      null,
      {key, oldValue, newValue}
    )
  }
}
```

### 4. 插件间通信

```javascript
// 发送消息给其他插件
MNUtil.postNotification("MyAddonMessage", {
  action: "dataUpdate",
  data: {/* ... */}
})

// 接收其他插件的消息
self.addObserver('onAddonMessage:', 'MyAddonMessage')

onAddonMessage: function(sender) {
  let info = sender.userInfo
  switch (info.action) {
    case "dataUpdate":
      this.handleDataUpdate(info.data)
      break
  }
}
```

### 5. 性能优化原则

1. **延迟加载**：只在需要时加载模块和资源
2. **批量操作**：使用 `MNUtil.undoGrouping` 包装多个操作
3. **防抖节流**：对频繁触发的事件使用防抖或节流
4. **异步处理**：使用 `async/await` 避免阻塞 UI
5. **资源清理**：在 `sceneDidDisconnect` 中释放资源

### 6. 用户体验要点

1. **即时反馈**：操作后立即显示 HUD 提示
2. **错误友好**：提供清晰的错误信息和解决方案
3. **动画流畅**：使用适当的动画时长（0.3-0.5秒）
4. **状态持久**：记住用户的设置和窗口位置
5. **快捷操作**：提供键盘快捷键和手势支持

## 总结

恭喜！你已经掌握了 MarginNote 插件开发的核心技能和高级技术：

✅ 完整的插件架构设计  
✅ 多控制器系统实现  
✅ 高级事件处理机制  
✅ WebView 深度集成  
✅ 工具系统和扩展架构  
✅ 性能优化和调试技巧  
✅ 跨版本兼容性处理  
✅ 专业的错误处理和日志系统

现在，你已经具备了开发专业 MarginNote 插件的所有知识。记住：

1. **架构优先**：良好的架构是成功的一半
2. **用户至上**：始终从用户角度思考功能设计
3. **持续学习**：研究优秀插件，学习最佳实践
4. **社区贡献**：分享你的插件，帮助他人

祝你开发出优秀的 MarginNote 插件！🚀

## 相关资源

- [MNUtils API 文档](../MNUTILS_API_GUIDE.md)
- [MarginNote 4 核心概念](../MARGINNOTE4_CONCEPTS.md)
- [MN ChatAI 源码分析](./CLAUDE.md)
- [MarginNote 开发者论坛](https://bbs.marginnote.cn/)
- [JSBox 文档](https://docs.xteko.com/)

---

> 💡 **提示**：本指南基于 MN ChatAI 插件的深入分析，涵盖了从基础到高级的完整开发知识。建议结合源码学习，实践中不断提升。如有问题，欢迎在社区交流讨论。