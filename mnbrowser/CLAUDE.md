# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

MN Browser 是一个 MarginNote 4 插件，在 MarginNote 应用内提供嵌入式网页浏览器功能。用户可以浏览网页内容、搜索资料，并将网络资源与笔记工作流程无缝集成。

## 架构说明

### 核心文件
- `main.js` - 插件入口，管理插件生命周期和观察者
- `webviewController.js` - 浏览器窗口的 UI 控制器，处理 webview 交互
- `utils.js` - 工具函数和浏览器特定的辅助方法
- `app.js` - 应用程序特定逻辑
- `mnaddon.json` - 插件元数据配置

### 文件依赖关系
```
main.js
├── utils.js (browserUtils)
├── webviewController.js (browserController)
└── settingController.js
```

## 开发命令

### 测试运行
1. 将 mnbrowser 文件夹复制到 MarginNote 4 的插件目录
2. 重启 MarginNote 4 或重新加载插件
3. 无需构建过程 - 直接执行 JavaScript 代码

### 常用开发任务
```bash
# 检查语法错误（如果配置了 jslint/eslint）
npx eslint *.js

# 格式化代码（如果配置了 prettier）
npx prettier --write "*.js" --tab-width 2
```

## 关键 API 和模式

### MNUtils 依赖
此插件需要先安装 MNUtils 插件。所有 MNUtils API 通过全局 `MNUtil` 对象访问。

### 浏览器配置
配置通过 `browserConfig` 对象存储，使用 NSUserDefaults 持久化：
- `entrieNames` - 网站书签
- `webAppEntries` - Web 应用配置
- `engine` - 搜索引擎设置
- `toolbar` - 工具栏显示设置

### WebView 控制器模式
`browserController` 类继承自 `UIViewController` 并实现 `UIWebViewDelegate`：
```javascript
// 创建浏览器实例
let browser = browserController.new()
browser.init()
browser.loadPage(url)
```

### 观察者模式
插件使用观察者监听 MarginNote 事件：
- `PopupMenuOnSelection` - 文本选择菜单
- `PopupMenuOnNote` - 笔记上下文菜单
- `searchInBrowser` - 在浏览器中搜索文本
- `openInBrowser` - 在浏览器中打开 URL

### 错误处理
错误记录到 `browserUtils.errorLog` 数组：
```javascript
browserUtils.addErrorLog(error, "functionName")
```

## 🔗 HTML 数据与卡片连接机制（核心技术）

这是 MN Browser 最核心的技术实现，展示了如何从网页提取数据并智能地传递到 MarginNote 的卡片系统中。

### 数据流转架构

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  HTML 页面  │ ──> │ JavaScript   │ ──> │ 数据转换处理  │ ──> │ MarginNote   │
│  (WebView)  │     │ 提取引擎      │     │ (Markdown)   │     │ 卡片系统      │
└─────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
       ↑                    │                     │                      │
       └────────────────────┴─────────────────────┴──────────────────────┘
                          URL Scheme 双向通信机制
```

### 1. HTML 数据提取层

#### 文本选择提取
```javascript
// webviewController.js:2997
getSelectedTextInWebview: async function() {
  let ret = await this.runJavaScript(`
    function getCurrentSelect(){
      let selectionObj = window.getSelection();
      return selectionObj.toString();
    };
    getCurrentSelect()
  `)
  return ret
}
```

#### 视频帧捕获
```javascript
// webviewController.js:3972
getVideoFrameInfo: async function(){
  // 在 WebView 中执行 JavaScript 捕获视频帧
  let imageBase64 = await this.runJavaScript(`
    const video = document.getElementsByTagName('video')[0];
    video.crossOrigin = "anonymous";
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    // 2倍分辨率以提高清晰度
    canvas.width = video.videoWidth * 2;
    canvas.height = video.videoHeight * 2;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');  // 返回 Base64 编码的图片
  `)
  
  // 获取视频时间戳信息
  let timestamp = await this.getTimestamp(this.webview.url)
  timestamp.image = imageBase64
  return timestamp
}
```

#### 网页截图
```javascript
// 通过原生 API 截图（当 Canvas 方法失败时的备选方案）
screenshot: async function(width){
  return new Promise((resolve, reject) => {
    this.webview.takeSnapshotWithWidth(width, (snapshot) => {
      resolve(snapshot.pngData())
    })
  })
}
```

### 2. 数据转换处理层

#### Markdown 格式转换
```javascript
// utils.js:334
static videoInfo2MD(videoFrameInfo){
  let timeStamp = this.videoTime2MD(videoFrameInfo)
  // 生成包含图片和时间戳的 Markdown
  return `![image.png](${videoFrameInfo.image})\n${timeStamp}`
}

// utils.js:338
static videoTime2MD(videoFrameInfo){
  let formatedVideoTime = this.formatSeconds(videoFrameInfo.time)
  // 生成可点击的时间戳链接，使用 MarginNote URL Scheme
  if (browserConfig.getConfig("timestampDetail")) {
    return `[[${formatedVideoTime}] (${videoFrameInfo.bv})](marginnote4app://addon/BilibiliExcerpt?videoId=${videoFrameInfo.bv}&t=${videoFrameInfo.time})`
  } else {
    return `[${formatedVideoTime}](marginnote4app://addon/BilibiliExcerpt?videoId=${videoFrameInfo.bv}&t=${videoFrameInfo.time})`
  }
}
```

### 3. 数据写入卡片层

#### 控制标志
```javascript
// webviewController.js 初始化
self.shouldCopy = false    // 控制是否复制到剪贴板
self.shouldComment = false // 控制是否作为评论添加
```

#### 视频内容处理动作
```javascript
// webviewController.js:4069
videoFrameAction: async function(target){
  let videoFrameInfo = await this.getVideoFrameInfo()
  let focusNote = MNNote.getFocusNote()
  
  switch (target) {
    case "excerpt":  // 写入卡片摘录
      let MDVideoInfo = browserUtils.videoInfo2MD(videoFrameInfo)
      MNUtil.undoGrouping(() => {
        focusNote.excerptText = (focusNote.excerptText || "") + "\n" + MDVideoInfo
        focusNote.excerptTextMarkdown = true
        focusNote.processMarkdownBase64Images()  // 处理 Base64 图片
      })
      break;
      
    case "childNote":  // 创建子卡片
      let config = {
        excerptText: MDVideoInfo,
        excerptTextMarkdown: true
      }
      let childNote = focusNote.createChildNote(config)
      childNote.focusInMindMap(0.5)  // 聚焦到新卡片
      break;
      
    case "comment":  // 添加为评论
      MNUtil.undoGrouping(() => {
        focusNote.excerptTextMarkdown = true
        focusNote.appendMarkdownComment(MDVideoInfo)
        focusNote.processMarkdownBase64Images()
      })
      break;
      
    case "newNote":  // 创建独立卡片
      let mindmap = MNUtil.mindmapView.mindmapNodes[0].note.childMindMap
      if (mindmap) {
        let newNote = MNNote.new(mindmap).createChildNote(config)
        newNote.focusInMindMap(0.5)
      }
      break;
  }
}
```

### 4. JavaScript 与原生代码通信

#### URL Scheme 通信机制
```javascript
// 主页 HTML 中的通信实现
function generateUrlScheme(scheme, host, params) {
  let url = `${scheme}://${host || ''}`;
  if (params && Object.keys(params).length > 0) {
    const queryParts = [];
    for (const key in params) {
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent(params[key]);
      queryParts.push(`${encodedKey}=${encodedValue}`);
    }
    url += `?${queryParts.join('&')}`;
  }
  return url;
}

function postMessageToAddon(scheme, host, params) {
  let url = generateUrlScheme(scheme, host, params)
  window.location.href = url  // 触发 URL Scheme 处理
}
```

#### URL Scheme 处理示例
```javascript
// webviewController.js 中拦截处理
webViewDidStartLoadRequest: function(webView, request, navigationType) {
  var url = request.URL.absoluteString;
  
  if (url.startsWith('browser://')) {
    // 处理自定义 URL Scheme
    if (url.includes('showhud')) {
      let message = extractParam(url, 'message')
      MNUtil.showHUD(decodeURIComponent(message))
    } else if (url.includes('copyimage')) {
      let imageData = extractParam(url, 'image')
      // 处理图片数据...
    }
    return false;  // 阻止实际导航
  }
  return true;
}
```

### 5. 数据传输优化策略

#### Base64 图片处理
- 视频截图使用 2 倍分辨率提高清晰度
- 图片数据通过 Base64 编码在 JavaScript 和原生代码间传递
- MarginNote 自动处理 Markdown 中的 Base64 图片并转换为实际图片资源

#### 异步处理
- 所有数据提取操作都是异步的，避免阻塞 UI
- 使用 Promise 包装原生异步 API
- 错误处理确保操作失败时的优雅降级

#### 撤销支持
- 所有修改卡片的操作都包装在 `MNUtil.undoGrouping()` 中
- 用户可以撤销任何数据导入操作

### 6. 实际应用场景

#### 场景 1：B站视频笔记
1. 用户观看 B站视频时点击截图按钮
2. 插件捕获当前视频帧和时间戳
3. 生成包含截图和可点击时间戳的 Markdown
4. 用户选择目标（摘录/评论/新卡片）
5. 数据自动整合到 MarginNote 卡片中

#### 场景 2：网页文本摘录
1. 用户在网页中选择文本
2. 通过上下文菜单触发摘录
3. 文本通过 `getSelectedTextInWebview()` 提取
4. 根据 `shouldCopy` 和 `shouldComment` 标志决定处理方式
5. 文本添加到当前聚焦的卡片

### 7. 技术要点总结

1. **evaluateJavaScript**：核心数据提取机制，在 WebView 中执行任意 JavaScript 代码
2. **Base64 编码**：解决图片数据在 JavaScript 和 Objective-C 之间传递的问题
3. **Markdown 格式**：统一的富文本格式，支持图片、链接等多媒体内容
4. **URL Scheme**：实现网页 JavaScript 到原生代码的通信桥梁
5. **MNNote API**：MarginNote 提供的卡片操作接口，支持创建、修改、关联卡片
6. **异步处理**：确保 UI 响应性的关键设计
7. **撤销支持**：通过 `undoGrouping` 实现用户友好的操作体验

### 8. 调试技巧

```javascript
// 调试数据提取
let data = await this.getSelectedTextInWebview()
MNUtil.copyJSON(data)  // 复制到剪贴板查看

// 调试视频信息
let videoInfo = await this.getVideoFrameInfo()
MNUtil.log("Video info:", JSON.stringify(videoInfo))

// 调试 URL Scheme
console.log("URL Scheme:", url)
browserUtils.addErrorLog({url: url}, "URL_SCHEME_DEBUG")
```

## 重要注意事项

1. **MNUtils 依赖**：使用 MNUtils API 前必须检查是否已加载
2. **平台差异**：通过 `Application.sharedInstance().osType` 检查平台特定代码
3. **框架管理**：使用 `MNFrame.set()` 统一设置框架
4. **URL 处理**：插件对某些域名（bilibili、wolai 等）有特殊处理
5. **内存管理**：注意 webview 加载/卸载，防止内存泄漏

## Git 工作流
项目使用 `github` 作为远程仓库名（不是 `origin`）：
```bash
git push github dev
```

## 常见问题和解决方案

1. **找不到 MNUtils**：确保已安装并先加载 MNUtils 插件
2. **WebView 不加载**：检查 URL 格式和网络连接
3. **UI 不更新**：框架改变后调用 `view.setNeedsDisplay()`
4. **持久化问题**：保存到 NSUserDefaults 前先 JSON 序列化对象

## 代码风格指南

1. 变量和函数使用 camelCase
2. 类使用 PascalCase
3. 为公共方法添加 JSDoc 注释
4. 使用回调或 Promise 处理异步操作
5. 始终检查 Objective-C API 返回的 nil/null 值
6. 修改笔记的操作使用 `MNUtil.undoGrouping()`

## 调试技巧

1. 使用 `MNUtil.log()` 输出调试信息
2. 在 Console 应用中查看崩溃日志
3. 使用 `browserUtils.showHUD()` 显示用户可见的调试消息
4. 监控 `browserUtils.errorLog` 查看累积的错误

## 相关文档
- 父目录 CLAUDE.md 包含通用的 MN-Addon 开发指南
- MNUtils API 指南位于 ../mnutils/MNUtils_API_Guide.md
- MarginNote 4 插件开发指南位于 ../MarginNote4_addon_develop_guide.md