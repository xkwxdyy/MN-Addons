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

## iframe 视图切换时序问题（2025-01-11）

### 问题描述
切换到日志视图时，页面一直显示"加载中"，需要手动点击"刷新看板"才能加载数据。

### 根本原因
1. 切换视图时只是改变了 iframe 的 src
2. 没有等待 iframe 加载完成就尝试传递数据
3. 或者根本没有触发数据加载

### 解决方案

#### 在 iframe 加载完成后通知原生代码
```javascript
// sidebarContainer.html
iframe.onload = function() {
    // ... 现有代码 ...
    
    // 根据不同视图通知原生代码加载数据
    if (viewName === 'log') {
        window.location.href = 'mntask://loadLogData';
    }
    if (viewName === 'todayboard') {
        window.location.href = 'mntask://loadTodayBoardData';
    }
};
```

#### 在原生代码中处理加载请求
```javascript
// settingController.js
case 'loadLogData':
    this.showLogs()
    break
    
case 'loadTodayBoardData':
    this.loadTodayBoardData()
    break
```

### 关键要点
1. **iframe 加载是异步的**：必须等待 onload 事件
2. **使用 URL 协议通信**：从 WebView 通知原生代码
3. **事件驱动设计**：iframe 加载完成后主动请求数据
4. **每个视图都需要初始化**：不同视图可能需要不同的数据

## 项目视图架构设计（2025-01-11）

### 需求背景
用户需要按项目分类查看任务，而不是所有任务混在一起。需要实现类似文件管理器的两栏布局：左侧显示项目列表，右侧显示选中项目的任务。

### 架构设计

#### 1. 两栏布局实现
```html
<div class="container">
  <div class="project-sidebar">
    <!-- 项目列表 -->
  </div>
  <div class="content-area">
    <!-- 任务列表 -->
  </div>
</div>
```

#### 2. 数据流设计
```
原生代码 (settingController.js)
  ├── loadProjectsData() → 加载所有项目
  └── loadProjectTasks(projectId) → 加载特定项目的任务
          ↓
sidebarContainer.html (代理函数)
  ├── loadProjectsFromPlugin()
  └── loadProjectTasksFromPlugin()
          ↓
projectview.html (iframe)
  └── projectManager 对象处理数据和 UI
```

#### 3. 项目数据结构
```javascript
{
  id: task.noteId,
  name: taskInfo.content,
  icon: '📁',
  taskCount: childTasks.length,
  status: taskInfo.status
}
```

### 实现要点

#### 1. 项目筛选逻辑
- 使用 `MNTaskManager.filterTasksSync({ types: ['项目'] })` 获取所有项目
- 为每个项目计算子任务数量
- 按状态排序：进行中 > 未开始 > 已完成

#### 2. URL 协议扩展
在 `handleTodayBoardProtocol` 中添加：
- `loadProjectsData`：加载项目列表
- `loadProjectTasks`：加载特定项目的任务
- 复用现有的任务操作协议（updateTaskStatus、launchTask、viewTaskDetail）

#### 3. 任务卡片复用
项目视图中的任务卡片完全复用今日看板的样式和功能，确保用户体验一致性。

### 经验总结
1. **视图独立性**：每个视图（todayboard、projectview、log）都是独立的 HTML 文件
2. **代理函数模式**：主容器提供统一的数据传递接口
3. **协议驱动**：视图通过 URL 协议向原生代码请求数据
4. **组件复用**：相同的 UI 组件（如任务卡片）应该在不同视图间复用样式和行为