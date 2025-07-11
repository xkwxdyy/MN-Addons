# MN-Addon 开发经验与常见问题

## WebView 显示问题解决方案（2025-01-11）

### 问题描述
在开发 MNTask 的今日看板功能时，遇到 WebView 完全白屏的问题。虽然 WebView 实例创建成功，但内容无法显示。

### 根本原因
1. **Frame 设置时机错误**：在容器视图还未布局完成时就创建 WebView，导致 WebView 的 frame 为 0
2. **文件加载方式不当**：使用了 `loadRequest` 而不是 `loadFileURLAllowingReadAccessToURL`

### 解决方案

#### 1. 延迟 WebView 创建
```javascript
// 在 createTodayBoardWebView 中不立即创建 WebView
taskSettingController.prototype.createTodayBoardWebView = function() {
  // 仅标记未初始化，等待视图显示时再创建
  this.todayBoardWebViewInstance = null
  this.todayBoardWebViewInitialized = false
}
```

#### 2. 在视图显示时初始化
```javascript
// 在 viewManager 的 onShow 回调中初始化
onShow: function(self) {
  if (!self.todayBoardWebViewInitialized) {
    self.initTodayBoardWebView()
  }
}
```

#### 3. 正确设置 Frame
```javascript
// 使用容器的 bounds 来创建 WebView
const containerBounds = this.todayBoardWebView.bounds
const webView = new UIWebView({
  x: 0, 
  y: 0, 
  width: containerBounds.width, 
  height: containerBounds.height
})
```

#### 4. 正确的文件加载方式
```javascript
// 使用 loadFileURLAllowingReadAccessToURL 加载本地 HTML
this.todayBoardWebViewInstance.loadFileURLAllowingReadAccessToURL(
  NSURL.fileURLWithPath(htmlPath),
  NSURL.fileURLWithPath(taskConfig.mainPath)
)
```

### 关键要点
1. **确保容器视图已布局**：WebView 必须在容器视图完成布局后创建
2. **使用正确的加载方法**：本地文件必须使用 `loadFileURLAllowingReadAccessToURL`
3. **设置正确的 delegate**：确保 WebView 的 delegate 正确设置
4. **Frame 管理**：在 `settingViewLayout` 中更新 WebView 实例的 frame

## iframe 架构下的数据传递问题（2025-01-11）

### 问题描述
使用 sidebarContainer.html 作为主容器，通过 iframe 加载具体页面（如 todayboard.html）后，原生代码无法直接调用 iframe 中的函数，导致"今日看板初始化失败"。

### 架构说明
```
WebView (加载 sidebarContainer.html)
  └── iframe (加载 todayboard.html)
       └── loadTasksFromPlugin 函数
```

### 解决方案

#### 1. 在主容器中添加代理函数
主容器需要提供一个与原生代码交互的接口：
```javascript
// sidebarContainer.html
function loadTasksFromPlugin(encodedTasks) {
    const iframe = document.querySelector('.content-frame');
    if (iframe && iframe.contentWindow) {
        const tasks = JSON.parse(decodeURIComponent(encodedTasks));
        iframe.contentWindow.postMessage({
            type: 'loadTasks',
            tasks: tasks
        }, '*');
    }
}
```

#### 2. 在 iframe 页面中监听消息
子页面需要监听来自父窗口的消息：
```javascript
// todayboard.html
window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'loadTasks') {
        boardManager.loadTasks(encodeURIComponent(JSON.stringify(event.data.tasks)));
    }
});
```

#### 3. 保持原生代码调用方式不变
这样可以保持向后兼容性：
```javascript
// settingController.js
const script = `loadTasksFromPlugin('${encodedTasks}')`
await this.runJavaScriptInWebView(script)
```

### 关键要点
1. **使用 postMessage 进行跨 iframe 通信**
2. **主容器作为消息中转站**
3. **保持原有 API 的兼容性**
4. **注意数据的编码和解码**