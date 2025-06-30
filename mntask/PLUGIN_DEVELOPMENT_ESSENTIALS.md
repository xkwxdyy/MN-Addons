# MarginNote 插件开发核心要点指南

> 基于 MN ChatAI 项目的深度分析，本指南总结了 MarginNote 插件开发中的核心技术要点，帮助初学者快速掌握插件开发的关键知识。

## 目录

1. [插件生命周期管理](#插件生命周期管理)
2. [事件系统与通知机制](#事件系统与通知机制)
3. [数据持久化与状态管理](#数据持久化与状态管理)
4. [MarginNote 核心功能交互](#marginnote-核心功能交互)
5. [网络请求与 AI 集成](#网络请求与-ai-集成)
6. [工具系统架构](#工具系统架构)
7. [错误处理与调试](#错误处理与调试)
8. [开发最佳实践](#开发最佳实践)
9. [初学者学习路径](#初学者学习路径)

## 插件生命周期管理

### 1. 插件入口结构

每个 MarginNote 插件都从 `JSB.newAddon` 开始：

```javascript
JSB.newAddon = function (mainPath) {
  // 1. 加载依赖
  JSB.require('utils')
  JSB.require('mnutils')
  
  // 2. 检查依赖
  if (typeof MNUtil === 'undefined') {
    Application.sharedInstance().showHUD("请先安装 MNUtils", 2)
    return undefined
  }
  
  // 3. 定义获取实例的函数（重要！）
  const getMyAddonClass = () => self
  
  // 4. 定义插件类
  var MyAddonClass = JSB.defineClass('MyAddon : JSExtension', {
    // 实例方法
  }, {
    // 类方法
  })
  
  return MyAddonClass
}
```

### 2. 核心生命周期方法

```javascript
// 场景连接时（插件启动）
sceneWillConnect: async function() {
  // 异步初始化，确保依赖加载完成
  if (!(await checkDependencies())) return
  
  // 初始化插件状态
  self.init(mainPath)
  
  // 注册所有观察者
  self.addObserver('onPopupMenuOnNote:', 'PopupMenuOnNote')
  // ... 更多观察者
}

// 场景断开时（插件关闭）
sceneDidDisconnect: function() {
  // 清理资源
  self.removeObservers(['PopupMenuOnNote', ...])
  // 保存状态
  self.saveState()
}

// 笔记本打开时
notebookWillOpen: async function(notebookId) {
  // 初始化笔记本相关功能
  self.currentNotebook = notebookId
  // 加载配置
  self.loadConfig()
  // 刷新UI
  self.refreshUI()
}

// 文档打开时
documentDidOpen: function(docMd5) {
  // 处理文档相关逻辑
  self.currentDocument = docMd5
}
```

### 3. 初始化最佳实践

```javascript
init: function(mainPath) {
  // 1. 保存路径
  self.mainPath = mainPath
  
  // 2. 初始化状态变量
  self.isNewWindow = false
  self.lastAction = Date.now()
  self.config = {}
  
  // 3. 初始化UI
  MNUtil.init(self.mainPath)
  
  // 4. 加载配置
  self.loadConfig()
  
  // 5. 设置默认值
  self.setDefaults()
}
```

## 事件系统与通知机制

### 1. 观察者模式实现

```javascript
// 添加观察者
MyAddonClass.prototype.addObserver = function(selector, name) {
  NSNotificationCenter.defaultCenter().addObserverSelectorName(
    this, selector, name
  )
}

// 移除观察者
MyAddonClass.prototype.removeObservers = function(names) {
  names.forEach(name => {
    NSNotificationCenter.defaultCenter().removeObserverName(self, name)
  })
}
```

### 2. 核心事件处理

```javascript
// 笔记菜单事件
onPopupMenuOnNote: async function(sender) {
  // 检查事件来源
  if (!self.checkSender(sender)) return
  
  // 获取笔记
  let note = MNNote.new(sender.userInfo.note.noteId)
  
  // 添加菜单项
  let menuItem = {
    title: "我的功能",
    object: self,
    selector: 'myFunction:',
    param: {
      noteId: note.noteId,
      rect: sender.userInfo.winRect
    }
  }
  sender.userInfo.menuController.commandTable.push(menuItem)
}

// 选中文本事件
onPopupMenuOnSelection: async function(sender) {
  // 获取选中文本
  let selectedText = sender.userInfo.documentController.selectionText
  
  // 计算位置
  let winFrame = MNUtil.parseWinRect(sender.userInfo.winRect)
  
  // 显示动态UI
  self.showDynamicUI(winFrame, selectedText)
}

// 新摘录处理
onProcessNewExcerpt: async function(sender) {
  let note = MNNote.new(sender.userInfo.noteid)
  
  // 自动处理逻辑
  if (self.shouldAutoProcess(note)) {
    self.processNote(note)
  }
}
```

### 3. 自定义事件

```javascript
// 发送自定义通知
NSNotificationCenter.defaultCenter().postNotificationNameObjectUserInfo(
  'MyCustomEvent',
  self,
  {data: 'some data'}
)

// 监听自定义通知
self.addObserver('onMyCustomEvent:', 'MyCustomEvent')

onMyCustomEvent: function(sender) {
  let data = sender.userInfo.data
  // 处理自定义事件
}
```

### 4. URL Scheme 支持

```javascript
onAddonBroadcast: async function(sender) {
  let message = sender.userInfo.message
  
  // 解析 URL Scheme
  if (/myaddon\?/.test(message)) {
    let params = self.parseURLParams(message)
    
    switch (params.action) {
      case "open":
        self.openPanel()
        break
      case "process":
        self.processWithParams(params)
        break
    }
  }
}

// URL 参数解析
parseURLParams: function(url) {
  let params = {}
  let query = url.match(/(?<=myaddon\?).*/)[0]
  query.split("&").forEach(param => {
    let [key, value] = param.split("=")
    params[key] = decodeURIComponent(value)
  })
  return params
}
```

## 数据持久化与状态管理

### 1. NSUserDefaults 本地存储

```javascript
// 保存配置
saveConfig: function() {
  NSUserDefaults.standardUserDefaults().setObjectForKey(
    self.config,
    "MyAddon_config"
  )
}

// 读取配置
loadConfig: function() {
  let saved = NSUserDefaults.standardUserDefaults().objectForKey("MyAddon_config")
  if (saved) {
    self.config = saved
  } else {
    self.config = self.getDefaultConfig()
  }
}

// 删除配置
clearConfig: function() {
  NSUserDefaults.standardUserDefaults().removeObjectForKey("MyAddon_config")
}
```

### 2. iCloud 同步

```javascript
// 保存到 iCloud
saveToCloud: function() {
  let store = NSUbiquitousKeyValueStore.defaultStore()
  store.setObjectForKey(self.config, "MyAddon_config")
  store.synchronize()
}

// 从 iCloud 读取
loadFromCloud: function() {
  let store = NSUbiquitousKeyValueStore.defaultStore()
  let cloudConfig = store.objectForKey("MyAddon_config")
  if (cloudConfig) {
    self.config = cloudConfig
  }
}

// 监听 iCloud 变化
onCloudConfigChange: function(sender) {
  let changedKeys = sender.userInfo.NSUbiquitousKeyValueStoreChangedKeysKey
  if (changedKeys && changedKeys.includes("MyAddon_config")) {
    self.loadFromCloud()
    self.refreshUI()
  }
}
```

### 3. 文件系统操作

```javascript
// 导出配置到文件
exportConfig: function() {
  let jsonString = JSON.stringify(self.config, null, 2)
  let data = NSString.stringWithString(jsonString)
    .dataUsingEncoding(NSUTF8StringEncoding)
  
  let fileName = "MyAddon_config_" + self.getTimestamp() + ".json"
  let tempPath = NSTemporaryDirectory() + fileName
  
  data.writeToFileAtomically(tempPath, true)
  
  // 分享文件
  MNUtil.shareFile(tempPath)
}

// 导入配置文件
importConfig: function(fileData) {
  try {
    let jsonString = NSString.alloc().initWithDataEncoding(
      fileData, NSUTF8StringEncoding
    )
    let config = JSON.parse(jsonString)
    
    // 验证配置
    if (self.validateConfig(config)) {
      self.config = config
      self.saveConfig()
      MNUtil.showHUD("配置导入成功")
    }
  } catch (error) {
    MNUtil.showHUD("配置导入失败：" + error.message)
  }
}
```

### 4. 状态管理最佳实践

```javascript
// 状态对象设计
self.state = {
  // UI 状态
  ui: {
    currentPage: 0,
    isExpanded: false,
    lastPosition: {x: 0, y: 0}
  },
  
  // 数据状态
  data: {
    currentNote: null,
    selectedText: "",
    history: []
  },
  
  // 临时状态（不持久化）
  temp: {
    isProcessing: false,
    lastAction: Date.now()
  }
}

// 状态更新方法
updateState: function(path, value) {
  // 使用路径更新嵌套对象
  let keys = path.split('.')
  let obj = self.state
  
  for (let i = 0; i < keys.length - 1; i++) {
    obj = obj[keys[i]]
  }
  
  obj[keys[keys.length - 1]] = value
  
  // 触发UI更新
  self.onStateChanged(path, value)
}
```

## MarginNote 核心功能交互

### 1. 笔记操作

```javascript
// 获取焦点笔记
getFocusNote: function() {
  let focusNote = MNNote.getFocusNote()
  if (!focusNote) {
    MNUtil.showHUD("没有选中笔记")
    return null
  }
  return focusNote
}

// 创建新笔记
createNote: function(text, parentNote) {
  // 使用撤销组包装操作
  MNUtil.undoGrouping(() => {
    let newNote = MNNote.createWithTextNotebookDocument(
      text,
      MNUtil.currentNotebookId,
      MNUtil.currentDocumentController.document
    )
    
    if (parentNote) {
      parentNote.addChild(newNote)
    }
    
    return newNote
  })
}

// 修改笔记属性
modifyNote: function(note) {
  MNUtil.undoGrouping(() => {
    // 修改标题
    note.noteTitle = "新标题"
    
    // 修改颜色
    note.colorIndex = 2  // 淡蓝色
    
    // 添加标签
    note.appendTags(["重要", "待复习"])
    
    // 添加评论
    note.appendTextComment("这是一条评论")
    note.appendMarkdownComment("**Markdown** 评论")
  })
}

// 搜索笔记
searchNotes: function(keyword) {
  let notebook = MNUtil.currentNotebook
  let allNotes = notebook.notes
  
  return allNotes.filter(note => {
    let text = note.noteTitle + note.excerptText
    return text.includes(keyword)
  })
}
```

### 2. 文档操作

```javascript
// 获取当前文档信息
getDocumentInfo: function() {
  let doc = MNUtil.currentDocumentController.document
  
  return {
    md5: doc.md5,
    fileName: doc.fileName,
    pageCount: doc.pageCount,
    currentPage: MNUtil.currentDocumentController.currentPageIndex
  }
}

// 跳转到页面
gotoPage: function(pageIndex) {
  MNUtil.currentDocumentController.gotoPageIndexAnimated(pageIndex, true)
}

// 获取页面图片
getPageImage: function(pageIndex) {
  let doc = MNUtil.currentDocumentController.document
  return doc.imageOfPageIndex(pageIndex)
}

// 高亮文本
highlightText: function(pageIndex, rect, color) {
  MNUtil.undoGrouping(() => {
    let doc = MNUtil.currentDocumentController.document
    let selection = {
      pageIndex: pageIndex,
      rects: [rect]
    }
    
    let note = MNNote.createWithDocumentSelection(doc, selection)
    note.colorIndex = color
  })
}
```

### 3. 脑图操作

```javascript
// 获取脑图视图
getMindmapView: function() {
  if (!MNUtil.mindmapView) {
    MNUtil.showHUD("请先打开脑图视图")
    return null
  }
  return MNUtil.mindmapView
}

// 展开/折叠节点
toggleNode: function(note) {
  let mindmapView = self.getMindmapView()
  if (mindmapView) {
    if (note.isExpanded) {
      mindmapView.collapseNode(note)
    } else {
      mindmapView.expandNode(note)
    }
  }
}

// 定位到笔记
focusOnNote: function(note) {
  let mindmapView = self.getMindmapView()
  if (mindmapView) {
    mindmapView.focusOnNote(note)
  }
}
```

### 4. 选择和剪贴板

```javascript
// 获取选中文本
getSelectedText: function() {
  let docCtrl = MNUtil.currentDocumentController
  return docCtrl.selectionText || ""
}

// 获取选择区域
getSelection: function() {
  let docCtrl = MNUtil.currentDocumentController
  return {
    text: docCtrl.selectionText,
    pageIndex: docCtrl.currentPageIndex,
    rect: docCtrl.selectionRect
  }
}

// 操作剪贴板
copyToClipboard: function(text) {
  UIPasteboard.generalPasteboard().string = text
  MNUtil.showHUD("已复制到剪贴板")
}

// 从剪贴板读取
getFromClipboard: function() {
  return UIPasteboard.generalPasteboard().string || ""
}
```

## 网络请求与 AI 集成

### 1. 基础网络请求

```javascript
// GET 请求
fetchData: async function(url) {
  return new Promise((resolve, reject) => {
    let request = NSMutableURLRequest.requestWithURL(NSURL.URLWithString(url))
    request.HTTPMethod = "GET"
    request.setValueForHTTPHeaderField("application/json", "Content-Type")
    
    let session = NSURLSession.sharedSession()
    let dataTask = session.dataTaskWithRequestCompletionHandler(
      request,
      (data, response, error) => {
        if (error) {
          reject(error)
          return
        }
        
        let json = NSJSONSerialization.JSONObjectWithDataOptions(data, 0)
        resolve(json)
      }
    )
    
    dataTask.resume()
  })
}

// POST 请求
postData: async function(url, data) {
  return new Promise((resolve, reject) => {
    let request = NSMutableURLRequest.requestWithURL(NSURL.URLWithString(url))
    request.HTTPMethod = "POST"
    request.setValueForHTTPHeaderField("application/json", "Content-Type")
    
    let jsonData = NSJSONSerialization.dataWithJSONObjectOptions(data, 0)
    request.HTTPBody = jsonData
    
    let session = NSURLSession.sharedSession()
    let dataTask = session.dataTaskWithRequestCompletionHandler(
      request,
      (data, response, error) => {
        if (error) {
          reject(error)
          return
        }
        
        let json = NSJSONSerialization.JSONObjectWithDataOptions(data, 0)
        resolve(json)
      }
    )
    
    dataTask.resume()
  })
}
```

### 2. AI 模型集成

```javascript
// OpenAI API 调用
callOpenAI: async function(messages) {
  let requestBody = {
    model: self.config.model || "gpt-3.5-turbo",
    messages: messages,
    temperature: 0.7,
    stream: false
  }
  
  return new Promise((resolve, reject) => {
    let request = NSMutableURLRequest.requestWithURL(
      NSURL.URLWithString("https://api.openai.com/v1/chat/completions")
    )
    request.HTTPMethod = "POST"
    request.setValueForHTTPHeaderField("application/json", "Content-Type")
    request.setValueForHTTPHeaderField(
      "Bearer " + self.config.apiKey,
      "Authorization"
    )
    
    let jsonData = NSJSONSerialization.dataWithJSONObjectOptions(requestBody, 0)
    request.HTTPBody = jsonData
    
    // 执行请求
    self.performRequest(request).then(resolve).catch(reject)
  })
}

// 处理 AI 响应
processAIResponse: function(response) {
  if (response.choices && response.choices.length > 0) {
    let content = response.choices[0].message.content
    
    // 处理 Markdown
    if (self.config.renderMarkdown) {
      content = self.renderMarkdown(content)
    }
    
    // 处理数学公式
    if (self.config.renderMath) {
      content = self.renderMathJax(content)
    }
    
    return content
  }
  
  throw new Error("Invalid AI response")
}
```

### 3. 流式响应处理

```javascript
// 处理 SSE (Server-Sent Events)
handleStreamResponse: function(url, headers, body, onData, onComplete) {
  let request = NSMutableURLRequest.requestWithURL(NSURL.URLWithString(url))
  request.HTTPMethod = "POST"
  
  // 设置请求头
  Object.keys(headers).forEach(key => {
    request.setValueForHTTPHeaderField(headers[key], key)
  })
  
  request.HTTPBody = NSJSONSerialization.dataWithJSONObjectOptions(body, 0)
  
  // 创建会话
  let config = NSURLSessionConfiguration.defaultSessionConfiguration()
  let delegate = self.createStreamDelegate(onData, onComplete)
  let session = NSURLSession.sessionWithConfigurationDelegateDelegateQueue(
    config, delegate, null
  )
  
  let task = session.dataTaskWithRequest(request)
  task.resume()
}

// 创建流代理
createStreamDelegate: function(onData, onComplete) {
  return {
    URLSessionDidReceiveData: function(session, dataTask, data) {
      let text = NSString.alloc().initWithDataEncoding(data, NSUTF8StringEncoding)
      let lines = text.split("\n")
      
      lines.forEach(line => {
        if (line.startsWith("data: ")) {
          let jsonStr = line.substring(6)
          if (jsonStr !== "[DONE]") {
            try {
              let json = JSON.parse(jsonStr)
              onData(json)
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      })
    },
    
    URLSessionDidCompleteWithError: function(session, task, error) {
      if (error) {
        onComplete(null, error)
      } else {
        onComplete("success", null)
      }
    }
  }
}
```

## 工具系统架构

### 1. 工具定义结构

```javascript
// 工具注册系统
self.tools = {
  search: {
    name: "搜索",
    description: "在笔记中搜索内容",
    icon: "🔍",
    action: "searchInNotes",
    params: {
      keyword: {type: "string", required: true},
      scope: {type: "enum", values: ["current", "all"], default: "all"}
    }
  },
  
  makeCard: {
    name: "制作卡片",
    description: "将笔记转换为复习卡片",
    icon: "🎴",
    action: "convertToCard",
    params: {
      noteId: {type: "string", required: true},
      type: {type: "enum", values: ["qa", "cloze"], default: "qa"}
    }
  },
  
  ocr: {
    name: "OCR识别",
    description: "识别图片中的文字",
    icon: "📷",
    action: "performOCR",
    params: {
      image: {type: "image", required: true}
    }
  }
}

// 执行工具
executeTool: function(toolName, params) {
  let tool = self.tools[toolName]
  if (!tool) {
    throw new Error("Tool not found: " + toolName)
  }
  
  // 验证参数
  self.validateParams(tool.params, params)
  
  // 执行动作
  let action = self[tool.action]
  if (typeof action === 'function') {
    return action.call(self, params)
  }
  
  throw new Error("Tool action not implemented: " + tool.action)
}
```

### 2. AI 工具系统

```javascript
// AI 可调用的工具
self.aiTools = [
  {
    type: "function",
    function: {
      name: "search_notes",
      description: "Search notes in MarginNote",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search query"
          }
        },
        required: ["query"]
      }
    }
  },
  
  {
    type: "function",
    function: {
      name: "create_note",
      description: "Create a new note",
      parameters: {
        type: "object",
        properties: {
          title: {type: "string"},
          content: {type: "string"},
          parentId: {type: "string"}
        },
        required: ["content"]
      }
    }
  }
]

// 处理 AI 工具调用
handleToolCall: function(toolCall) {
  let functionName = toolCall.function.name
  let args = JSON.parse(toolCall.function.arguments)
  
  switch (functionName) {
    case "search_notes":
      return self.searchNotes(args.query)
      
    case "create_note":
      return self.createNote(args.content, args.parentId)
      
    default:
      throw new Error("Unknown function: " + functionName)
  }
}
```

### 3. 扩展机制

```javascript
// 注册自定义工具
registerTool: function(tool) {
  // 验证工具定义
  if (!tool.name || !tool.action) {
    throw new Error("Invalid tool definition")
  }
  
  // 添加到工具列表
  self.tools[tool.id] = tool
  
  // 更新UI
  self.refreshToolbar()
}

// 加载外部工具
loadExternalTools: function() {
  let toolsPath = self.mainPath + "/tools/"
  let files = NSFileManager.defaultManager().contentsOfDirectoryAtPath(toolsPath)
  
  files.forEach(file => {
    if (file.endsWith(".js")) {
      JSB.require(toolsPath + file)
      
      // 假设每个工具文件导出一个 register 函数
      if (typeof registerTool === 'function') {
        registerTool(self)
      }
    }
  })
}
```

## 错误处理与调试

### 1. 错误边界

```javascript
// 全局错误处理
safeExecute: function(func, context) {
  try {
    return func.call(self)
  } catch (error) {
    self.handleError(error, context)
    return null
  }
}

// 异步错误处理
safeExecuteAsync: async function(func, context) {
  try {
    return await func.call(self)
  } catch (error) {
    self.handleError(error, context)
    return null
  }
}

// 错误处理器
handleError: function(error, context) {
  // 记录错误
  self.logError(error, context)
  
  // 用户提示
  let message = "操作失败"
  if (self.config.debugMode) {
    message += ": " + error.message
  }
  MNUtil.showHUD(message)
  
  // 错误恢复
  self.recoverFromError(context)
}
```

### 2. 日志系统

```javascript
// 日志级别
LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
}

// 日志记录
log: function(level, message, data) {
  if (level < self.config.logLevel) return
  
  let timestamp = new Date().toISOString()
  let logEntry = {
    timestamp: timestamp,
    level: level,
    message: message,
    data: data
  }
  
  // 控制台输出
  if (self.config.consoleLog) {
    console.log(`[${timestamp}] ${message}`, data)
  }
  
  // 保存到文件
  if (self.config.fileLog) {
    self.saveLogToFile(logEntry)
  }
  
  // 发送到服务器
  if (self.config.remoteLog) {
    self.sendLogToServer(logEntry)
  }
}

// 便捷方法
debug: function(message, data) {
  self.log(LogLevel.DEBUG, message, data)
}

info: function(message, data) {
  self.log(LogLevel.INFO, message, data)
}

warn: function(message, data) {
  self.log(LogLevel.WARN, message, data)
}

error: function(message, data) {
  self.log(LogLevel.ERROR, message, data)
}
```

### 3. 调试工具

```javascript
// 性能监控
measurePerformance: function(name, func) {
  let start = Date.now()
  let result = func()
  let duration = Date.now() - start
  
  self.debug(`Performance: ${name} took ${duration}ms`)
  
  return result
}

// 对象检查
inspectObject: function(obj) {
  let type = typeof obj
  let className = obj.constructor ? obj.constructor.name : "Unknown"
  
  self.debug("Object inspection:", {
    type: type,
    className: className,
    properties: Object.keys(obj),
    methods: Object.getOwnPropertyNames(obj.constructor.prototype)
  })
}

// 内存监控
checkMemory: function() {
  if (typeof performance !== 'undefined' && performance.memory) {
    self.debug("Memory usage:", {
      usedJSHeapSize: performance.memory.usedJSHeapSize,
      totalJSHeapSize: performance.memory.totalJSHeapSize,
      jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
    })
  }
}
```

### 4. 开发模式

```javascript
// 开发模式配置
self.devConfig = {
  debugMode: true,
  logLevel: LogLevel.DEBUG,
  showHUD: true,
  mockData: true,
  hotReload: true
}

// 条件执行
if (self.devConfig.debugMode) {
  // 调试代码
  self.enableDebugUI()
  self.loadMockData()
}

// 热重载支持
enableHotReload: function() {
  NSTimer.scheduledTimerWithTimeIntervalTargetSelectorUserInfoRepeats(
    2.0, self, "checkForChanges:", null, true
  )
}

checkForChanges: function() {
  // 检查文件变化
  let currentModTime = self.getFileModificationTime(self.mainPath + "/main.js")
  if (currentModTime > self.lastModTime) {
    self.reload()
  }
}
```

## 开发最佳实践

### 1. 代码组织

```javascript
// 模块化结构
MyAddon/
├── main.js           // 主入口
├── controllers/      // 控制器
│   ├── mainController.js
│   └── settingsController.js
├── models/          // 数据模型
│   ├── config.js
│   └── note.js
├── views/           // 视图组件
│   ├── panel.js
│   └── button.js
├── utils/           // 工具函数
│   ├── network.js
│   └── storage.js
└── resources/       // 资源文件
    ├── images/
    └── html/
```

### 2. 命名规范

```javascript
// 类名：PascalCase
class MyController {}

// 方法名：camelCase
function getUserData() {}

// 常量：UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3

// 私有方法：下划线前缀
function _internalMethod() {}

// 事件处理器：on前缀
function onButtonClick() {}
```

### 3. 异步处理

```javascript
// 使用 async/await
async function loadData() {
  try {
    let result = await fetchFromServer()
    processData(result)
  } catch (error) {
    handleError(error)
  }
}

// Promise 链式调用
fetchData()
  .then(data => processData(data))
  .then(result => updateUI(result))
  .catch(error => handleError(error))
  .finally(() => hideLoading())

// 并发处理
async function loadAllData() {
  let [notes, config, user] = await Promise.all([
    loadNotes(),
    loadConfig(),
    loadUserData()
  ])
  
  return {notes, config, user}
}
```

### 4. 内存管理

```javascript
// 及时清理资源
cleanup: function() {
  // 移除观察者
  self.removeObservers()
  
  // 清理定时器
  if (self.timer) {
    self.timer.invalidate()
    self.timer = null
  }
  
  // 清理大对象
  self.largeData = null
  
  // 清理视图
  if (self.webView) {
    self.webView.removeFromSuperview()
    self.webView = null
  }
}

// 弱引用处理
createWeakReference: function(object) {
  let weakRef = NSValue.valueWithNonretainedObject(object)
  return {
    get: function() {
      return weakRef.nonretainedObjectValue
    }
  }
}
```

### 5. 性能优化

```javascript
// 防抖处理
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

// 节流处理
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

// 懒加载
lazyLoad: function(loader) {
  let cached
  return function() {
    if (!cached) {
      cached = loader()
    }
    return cached
  }
}
```

## 初学者学习路径

### 第一阶段：基础入门（1-2周）

1. **环境搭建**
   - 安装 MNUtils
   - 创建第一个 Hello World 插件
   - 了解基本文件结构

2. **基础 API 学习**
   - 生命周期方法
   - 简单的 UI 创建（按钮、HUD）
   - 基本的笔记操作

3. **实践项目**
   - 创建一个简单的笔记颜色批量修改工具

### 第二阶段：核心功能（2-3周）

1. **事件系统**
   - 理解观察者模式
   - 处理菜单事件
   - 响应用户操作

2. **数据管理**
   - 配置的保存和读取
   - 状态管理
   - 数据导入导出

3. **UI 进阶**
   - 创建设置面板
   - 多页面管理
   - WebView 集成

4. **实践项目**
   - 开发一个笔记模板插件

### 第三阶段：高级特性（3-4周）

1. **网络功能**
   - API 调用
   - 异步处理
   - 错误处理

2. **AI 集成**
   - 接入 AI API
   - 处理 AI 响应
   - 实现智能功能

3. **性能优化**
   - 代码优化
   - 内存管理
   - 调试技巧

4. **实践项目**
   - 开发一个 AI 辅助学习插件

### 第四阶段：专业开发（持续）

1. **架构设计**
   - 模块化开发
   - 设计模式应用
   - 代码重构

2. **高级技巧**
   - 自定义工具系统
   - 插件间通信
   - 扩展机制

3. **发布维护**
   - 版本管理
   - 用户反馈处理
   - 持续更新

## 学习资源推荐

### 必读文档
1. MarginNote 官方插件文档
2. MNUtils API 文档
3. JSBox 开发指南

### 参考项目
1. MN ChatAI - 完整的 AI 插件示例
2. MNToolbar - 工具栏扩展示例
3. 官方示例插件

### 开发工具
1. VS Code + JSBox 插件
2. Safari Web Inspector（调试 WebView）
3. Console.app（查看日志）

### 社区资源
1. MarginNote 论坛
2. GitHub 上的开源插件
3. 开发者交流群

## 总结

MarginNote 插件开发是一个循序渐进的过程。从简单的功能开始，逐步掌握各种 API 和技巧，最终能够开发出功能强大的插件。关键是要：

1. **多看源码** - 学习优秀插件的实现
2. **多写代码** - 实践是最好的老师
3. **多问多交流** - 加入社区，互相学习
4. **持续优化** - 不断改进代码质量

希望这份指南能帮助你快速入门 MarginNote 插件开发，创造出更多优秀的插件！