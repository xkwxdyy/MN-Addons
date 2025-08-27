# MN ChatAI 插件项目深度分析

> 本文档基于对 MN ChatAI 插件源码的深入分析，详细记录了该优秀项目的架构设计、实现技巧和最佳实践，可作为 MarginNote 插件开发的学习参考。

## 目录

1. [项目概述](#项目概述)
2. [架构设计](#架构设计)
3. [核心实现分析](#核心实现分析)
4. [生命周期管理](#生命周期管理)
5. [事件处理机制](#事件处理机制)
6. [UI 系统设计](#ui-系统设计)
7. [AI 功能集成](#ai-功能集成)
8. [工具系统架构](#工具系统架构)
9. [设计模式与最佳实践](#设计模式与最佳实践)
10. [开发技巧总结](#开发技巧总结)

## 项目概述

MN ChatAI 是一个功能强大的 MarginNote AI 对话插件，展现了专业的插件开发技术：

### 核心特性
- **多模型支持**：集成 OpenAI、Claude、Gemini 等多种 AI 模型
- **智能交互**：支持选中文本、笔记自动触发 AI 对话
- **多视图管理**：浮动窗口、侧边栏、通知窗口等多种 UI 形态
- **工具扩展**：内置可扩展的工具系统，支持搜索、OCR、视觉分析等
- **云同步**：支持 iCloud 配置同步

### 技术栈
- **运行时**：JSBox (JSB) JavaScript 运行时
- **UI 框架**：UIKit + WebView 混合架构
- **前端技术**：HTML5 + Tailwind CSS + Markdown 渲染
- **数学支持**：MathJax 数学公式渲染
- **代码高亮**：highlight.js

## 架构设计

### 1. 插件入口架构

```javascript
JSB.newAddon = function (mainPath) {
  // 1. 依赖加载
  JSB.require('utils')
  if (!chatAIUtils.checkMNUtilsFolder(mainPath)) { return undefined }
  JSB.require('webviewController')
  JSB.require('notificationController')
  JSB.require('dynamicController')
  JSB.require('sideOutputController')
  
  // 2. 类定义
  var MNChatglmClass = JSB.defineClass('MNChatglm : JSExtension', {
    // 实例方法
  }, {
    // 类方法
  })
  
  // 3. 原型扩展
  MNChatglmClass.prototype.addObserver = function() {}
  
  return MNChatglmClass
}
```

**设计亮点**：
- 模块化加载，每个功能独立文件
- 依赖检查机制，确保 MNUtils 存在
- 使用 JSB.defineClass 定义原生类

### 2. 多控制器架构

项目采用多控制器分离设计，各司其职：

```
MNChatglm (主控制器)
├── webviewController (主界面)
├── notificationController (通知对话)
├── dynamicController (动态按钮)
└── sideOutputController (侧边栏)
```

每个控制器负责独立的功能模块，通过主控制器协调。

### 3. 事件驱动架构

通过 NSNotificationCenter 实现事件驱动：

```javascript
// 注册观察者
self.addObserver('onPopupMenuOnSelection:', 'PopupMenuOnSelection')
self.addObserver('onPopupMenuOnNote:', 'PopupMenuOnNote')
self.addObserver('onChatOnNote:', 'chatOnNote')
self.addObserver('onAddonBroadcast:', 'AddonBroadcast')
```

## 核心实现分析

### 1. 生命周期管理

```javascript
sceneWillConnect: async function () {
  // 窗口初始化
  if (!(await chatAIUtils.checkMNUtil(true))) return
  
  // 初始化状态
  self.init(mainPath)
  self.isNewWindow = false
  self.textProcessed = false
  
  // 注册所有观察者
  self.addObserver('onPopupMenuOnSelection:', 'PopupMenuOnSelection')
  // ... 更多观察者
}

sceneDidDisconnect: function () {
  // 清理资源
  if (typeof MNUtil === 'undefined') return
  let self = getMNChatglmClass()
  self.removeObservers(names)
}
```

**最佳实践**：
- 异步初始化，确保依赖加载完成
- 完整的资源清理机制
- 错误边界处理

### 2. 笔记本生命周期

```javascript
notebookWillOpen: async function (notebookid) {
  // 笔记本打开时初始化
  self.init(mainPath)
  chatAIUtils.forceToRefresh = true
  chatAIUtils.ensureChatAIController()
  chatAIUtils.ensureNotifyController()
  
  // 自动导入配置
  if (chatAIConfig.autoImport(true)) {
    chatAIConfig.import(false)
  }
  
  // 刷新模型配置
  let today = chatAIUtils.getToday()
  if (!chatAIConfig.modelConfig.refreshDay || today !== chatAIConfig.modelConfig.refreshDay) {
    chatAINetwork.fetchModelConfig().then((res) => {
      // 更新模型配置
    })
  }
}
```

### 3. 视图布局管理

```javascript
controllerWillLayoutSubviews: function (controller) {
  if (controller !== MNUtil.studyController) return
  
  let studyFrame = MNUtil.studyView.bounds
  let windowFrame = MNUtil.currentWindow.bounds
  
  // 聊天控制器位置约束
  if (!chatAIUtils.chatController.view.hidden) {
    let currentFrame = chatAIUtils.chatController.currentFrame
    currentFrame.x = MNUtil.constrain(currentFrame.x, 0, studyFrame.width-currentFrame.width)
    currentFrame.y = MNUtil.constrain(currentFrame.y, 0, studyFrame.height-20)
    chatAIUtils.chatController.view.frame = currentFrame
  }
  
  // 通知控制器位置调整
  if (!chatAIUtils.notifyController.view.hidden && !chatAIUtils.notifyController.onAnimate) {
    let currentFrame = chatAIUtils.notifyController.currentFrame
    currentFrame.height = Math.min(currentFrame.height, windowFrame.height - currentFrame.y)
    currentFrame.y = chatAIUtils.getY()
    currentFrame.x = chatAIUtils.getX()
    chatAIUtils.notifyController.view.frame = currentFrame
  }
}
```

**设计技巧**：
- 响应式布局，自动适应窗口变化
- 位置约束，防止视图超出边界
- 动画状态检测，避免布局冲突

## 事件处理机制

### 1. 选中文本事件

```javascript
onPopupMenuOnSelection: async function (sender) {
  if (!chatAIUtils.checkSender(sender, self.window)) return
  
  // 获取选中文本
  chatAIUtils.currentSelection = sender.userInfo.documentController.selectionText
  
  // 计算动态按钮位置
  let winFrame = MNUtil.parseWinRect(sender.userInfo.winRect)
  let xOffset = sender.userInfo.arrow === 1 ? 20 : -80
  let yOffset = sender.userInfo.arrow === 1 ? -60 : -30
  
  // 显示动态控制器
  await self.checkDynamicController(dynamicFrame)
  chatAIUtils.dynamicController.view.hidden = false
  
  // 触发 AI 对话
  if (self.checkShouldProceed(chatAIUtils.currentSelection, -1, "onSelection")) {
    chatAIUtils.chatController.askWithDelay()
  }
}
```

### 2. 笔记点击事件

```javascript
onPopupMenuOnNote: async function (sender) {
  let note = MNNote.new(sender.userInfo.note.noteId)
  
  // 获取笔记内容
  let text = await chatAIUtils.getTextForSearch(note)
  chatAIUtils.currentSelection = text
  
  // 检查是否应该触发
  if (!self.checkShouldProceed(chatAIUtils.currentSelection, note.colorIndex+16, "onNote")) {
    return
  }
  
  // 避免重复触发
  let question = await chatAIUtils.chatController.getQuestion()
  let sameQuestion = (JSON.stringify(question) === JSON.stringify(self.lastQuestion))
  if (!chatAIUtils.notifyController.view.hidden && sameQuestion) {
    return
  }
  
  self.lastQuestion = await chatAIUtils.chatController.askWithDelay()
}
```

### 3. 新摘录处理

```javascript
onProcessNewExcerpt: async function (sender) {
  let note = MNNote.new(sender.userInfo.noteid)
  let text = await chatAIUtils.getTextForSearch(note)
  
  // 标签检测功能
  if (chatAIConfig.getConfig("newExcerptTagDetection")) {
    let promptKeys = chatAIConfig.config.promptNames
    let promptNames = promptKeys.map(key => chatAIConfig.prompts[key].title)
    let commonPrompts = chatAIUtils.findCommonElements(note.tags, promptNames)
    
    if (commonPrompts.length) {
      let firstPrompt = commonPrompts[0]
      note.removeCommentByIndex(0)
      let promptKey = chatAIUtils.findKeyByTitle(chatAIConfig.prompts, firstPrompt)
      chatAIUtils.chatController.askWithDelay(promptKey)
    }
  }
}
```

## UI 系统设计

### 1. 动态控制器

动态控制器实现了智能的浮动按钮系统：

```javascript
checkDynamicController: async function (dynamicFrame, fullWindow = false, animate = true) {
  if (!chatAIUtils.dynamicController) {
    chatAIUtils.initDynamicController()
    chatAIUtils.dynamicController.mainPath = mainPath
    chatAIUtils.dynamicController.firstFrame = dynamicFrame
    chatAIUtils.dynamicController.view.hidden = true
  }
  
  if (chatAIUtils.dynamicController.pinned) {
    chatAIUtils.dynamicController.view.hidden = false
    return
  }
  
  return new Promise((resolve, reject) => {
    chatAIUtils.dynamicController.setLayout(dynamicFrame).then(() => {
      chatAIUtils.dynamicController.view.hidden = false
      if (fullWindow) {
        chatAIUtils.dynamicController.openInput()
        chatAIUtils.dynamicController.pinned = true
      }
      resolve()
    })
  })
}
```

### 2. 通知系统

通知控制器负责显示 AI 响应：

```javascript
// 位置自适应
if (!chatAIUtils.notifyController.view.hidden && !chatAIUtils.notifyController.onAnimate) {
  let currentFrame = chatAIUtils.notifyController.currentFrame
  currentFrame.height = Math.min(currentFrame.height, windowFrame.height - currentFrame.y)
  currentFrame.y = chatAIUtils.getY()  // 根据配置获取 Y 位置
  currentFrame.x = chatAIUtils.getX()  // 根据配置获取 X 位置
  chatAIUtils.notifyController.view.frame = currentFrame
}
```

### 3. 侧边栏集成（MN4）

```javascript
openSideBar: async function (params) {
  if (chatAIUtils.isMN3()) {
    MNUtil.showHUD("Only available in MN4")
    return
  }
  
  if (!chatAIUtils.sideOutputController) {
    chatAIUtils.sideOutputController = sideOutputController.new()
    MNUtil.toggleExtensionPanel()
    MNExtensionPanel.show()
    MNExtensionPanel.addSubview("chatAISideOutputView", chatAIUtils.sideOutputController.view)
  } else {
    MNExtensionPanel.show("chatAISideOutputView")
  }
  
  chatAIUtils.sideOutputController.openChatView(false)
}
```

## AI 功能集成

### 1. 多模型支持

通过配置系统支持多种 AI 模型：

```javascript
onDefaultModelChanged: function (sender) {
  let modelConfig = sender.userInfo
  let settingController = chatAIUtils.chatController
  
  if (settingController && !settingController.view.hidden) {
    settingController.sourceButton.setTitleForState("Source: " + modelConfig.source, 0)
    settingController.setModel(sender.userInfo.source)
    settingController.setModelButton(sender.userInfo.source)
    
    // 更新模型选择按钮状态
    let allSources = chatAIConfig.allSource(true)
    let sourceIndex = allSources.indexOf(modelConfig.source)
    for (let i = 0; i < allSources.length; i++) {
      if (i === sourceIndex) {
        MNButton.setConfig(settingController["scrollSourceButton" + i], {color: "#2c70de"})
      } else {
        MNButton.setConfig(settingController["scrollSourceButton" + i], {color: "#9bb2d6"})
      }
    }
  }
}
```

### 2. URL Scheme 支持

支持通过 URL Scheme 调用插件功能：

```javascript
onAddonBroadcast: async function (sender) {
  let message = sender.userInfo.message
  
  if (/mnchatai\?/.test(message)) {
    let arguments = message.match(/(?<=mnchatai\?).*/)[0].split("&")
    let config = {}
    
    arguments.forEach((arg) => {
      let kv = arg.split("=")
      switch (kv[0]) {
        case "user":
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
      case "ask":
        // marginnote4app://addon/mnchatai?action=ask&user={query}
        // marginnote4app://addon/mnchatai?action=ask&user={query}&mode=vision
        // marginnote4app://addon/mnchatai?action=ask&user={query}&mode=ocr
        break
        
      case "executeprompt":
        // marginnote4app://addon/mnchatai?action=executeprompt&prompt={query}
        break
        
      case "opensetting":
        // marginnote4app://addon/mnchatai?action=opensetting
        break
        
      case "togglesidebar":
        // marginnote4app://addon/mnchatai?action=togglesidebar
        break
    }
  }
}
```

### 3. 视觉和 OCR 功能

```javascript
if (config.mode === "vision") {
  let imageDatas
  let system
  
  if (currentNoteId) {
    imageDatas = chatAIUtils.getImagesFromNote(MNNote.new(currentNoteId))
    system = chatAIConfig.dynamicPrompt.note
  } else {
    imageDatas = [MNUtil.getDocImage(true, true)]
    system = chatAIConfig.dynamicPrompt.text
  }
  
  let question = [{role: "system", content: systemMessage}, 
                  chatAIUtils.genUserMessage(user, imageDatas)]
  chatAIUtils.notifyController.askByVision(question)
}
```

## 工具系统架构

### 1. 工具栏集成

```javascript
toggleAddon: async function (button) {
  if (!chatAIUtils.addonBar) {
    chatAIUtils.addonBar = button.superview.superview
  }
  
  var commandTable = [
    {title: '⚙️   Setting', object: self, selector: 'openSetting:', param: [1,2,3]},
    {title: '🤖   Float Window', object: self, selector: 'openFloat:', param: beginFrame},
    {title: '💬   Chat Mode', object: self, selector: 'openSideBar:', param: [1,3,2]},
    {title: '🔄   Manual Sync', object: self, selector: 'syncConfig:', param: [1,2,3]},
    {title: '↔️   Location: ' + (chatAIConfig.config.notifyLoc ? "Right" : "Left"), 
     object: self, selector: "toggleWindowLocation:", param: chatAIConfig.config.notifyLoc}
  ]
  
  // 添加 Prompt 快捷方式
  let promptKeys = chatAIConfig.config.promptNames
  let promptTable = promptKeys.map(key => {
    return {title: "🚀   " + chatAIConfig.prompts[key].title, 
            object: self, selector: 'executePrompt:', param: key}
  })
  
  commandTable = commandTable.concat(promptTable)
  self.popoverController = chatAIUtils.getPopoverAndPresent(button, commandTable, 200, 4)
}
```

### 2. 智能触发系统

```javascript
checkShouldProceed: function (text, colorIndex = -1, param = "") {
  // 多重检查机制
  if (!chatAIUtils.chatController.view.window || !chatAIConfig.config.autoAction) {
    return false
  }
  
  if (param !== "" && !chatAIConfig.config[param]) {
    return false
  }
  
  // 聊天模式下禁用
  if (chatAIUtils.notifyController.onChat) {
    return false
  }
  
  // 颜色过滤
  if (colorIndex !== -1 && !chatAIConfig.getConfig("colorConfig")[colorIndex]) {
    return false
  }
  
  // 短文本过滤
  if (chatAIConfig.config.ignoreShortText && chatAIUtils.countWords(text) < 10) {
    return false
  }
  
  return true
}
```

## 设计模式与最佳实践

### 1. 单例模式

通过 `getMNChatglmClass()` 确保获取同一实例：

```javascript
const getMNChatglmClass = () => self
```

### 2. 观察者模式

使用 NSNotificationCenter 实现事件监听：

```javascript
MNChatglmClass.prototype.addObserver = function (selector, name) {
  NSNotificationCenter.defaultCenter().addObserverSelectorName(this, selector, name)
}

MNChatglmClass.prototype.removeObservers = function (names) {
  names.forEach(name => {
    NSNotificationCenter.defaultCenter().removeObserverName(self, name)
  })
}
```

### 3. 策略模式

不同场景使用不同的处理策略：

```javascript
// 根据不同的 action 执行不同策略
switch (config.action) {
  case "ask":
    // 问答策略
    break
  case "executeprompt":
    // 执行 Prompt 策略
    break
  case "opensetting":
    // 打开设置策略
    break
}
```

### 4. 防抖处理

避免重复触发：

```javascript
// 时间间隔检查
if (Date.now() - self.dateGetText < 500) {
  chatAIUtils.notifyController.notShow = true
  return
}

// 相同问题检查
let sameQuestion = (JSON.stringify(question) === JSON.stringify(self.lastQuestion))
if (!chatAIUtils.notifyController.view.hidden && sameQuestion) {
  return
}
```

### 5. 错误边界

完善的错误处理机制：

```javascript
try {
  // 业务逻辑
} catch (error) {
  chatAIUtils.addErrorLog(error, "functionName")
  MNUtil.showHUD("Error: " + error.message)
}
```

## 开发技巧总结

### 1. 依赖管理

- 使用 `JSB.require()` 加载模块
- 检查 MNUtils 是否存在
- 使用 `typeof MNUtil === 'undefined'` 进行安全检查

### 2. 视图管理

- 使用 `ensureView()` 确保视图添加到正确的父视图
- 通过 `hidden` 属性控制视图显示/隐藏
- 使用 `frame` 进行精确布局

### 3. 状态管理

- 使用实例变量管理插件状态
- 通过 NSUserDefaults 持久化配置
- 支持 iCloud 同步配置

### 4. 性能优化

- 使用 `askWithDelay()` 延迟执行，避免频繁触发
- 动画使用 `MNUtil.animate()` 统一管理
- 及时清理资源和监听器

### 5. 兼容性处理

- 区分 MN3 和 MN4 版本
- 使用 `chatAIUtils.isMN4()` 进行版本检测
- 为不同版本提供不同功能

### 6. 调试技巧

- 使用 `MNUtil.showHUD()` 显示调试信息
- 使用 `chatAIUtils.addErrorLog()` 记录错误

## 学习要点

1. **模块化设计**：将功能拆分到不同的控制器，便于维护和扩展
2. **事件驱动**：充分利用 MarginNote 的通知系统
3. **错误处理**：每个关键函数都有 try-catch 保护
4. **用户体验**：智能触发、防重复、位置记忆等细节处理
5. **扩展性**：工具系统、Prompt 系统都设计为可扩展架构

这个项目展示了如何开发一个功能完整、用户体验良好的 MarginNote 插件，值得深入学习和参考。

## 后续开发建议

1. **TypeScript 支持**：考虑添加类型定义，提高代码可维护性
2. **单元测试**：为核心功能添加测试用例
3. **文档完善**：添加 API 文档和开发指南
4. **性能监控**：添加性能监控和错误上报机制
5. **插件间通信**：探索与其他插件的协作可能性