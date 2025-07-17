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

## 项目层级导航实现（2025-01-11）

### 需求背景
项目可能有多层级结构（项目包含子项目），需要实现类似文件管理器的导航体验。

### 实现方案

#### 1. 导航栈管理
```javascript
// projectview.html
const projectManager = {
    navigationStack: [],  // 导航历史栈
    currentLevel: null,   // 当前层级（null 表示顶级）
    
    // 进入子项目
    enterProject(project) {
        this.navigationStack.push({
            id: project.id,
            name: project.name
        });
        this.currentLevel = project.id;
        window.location.href = `mntask://loadSubProjects?parentId=${encodeURIComponent(project.id)}`;
    },
    
    // 返回上一级
    goBack() {
        if (this.navigationStack.length > 0) {
            this.navigationStack.pop();
            // 处理返回逻辑...
        }
    }
}
```

#### 2. 面包屑导航 UI
```html
<div class="breadcrumb" id="breadcrumb">
    <span class="breadcrumb-item" onclick="goToLevel(null)">项目</span>
    <span class="breadcrumb-separator">></span>
    <span class="breadcrumb-item">子项目名称</span>
</div>
```

#### 3. 后端支持
修改 `loadProjectsData` 支持父项目参数：
```javascript
// settingController.js
taskSettingController.prototype.loadProjectsData = async function(parentId = null) {
    if (parentId === null) {
        // 加载顶级项目
        projectTasks = TaskFilterEngine.filter({
            boardKeys: ['target', 'project'],
            customFilter: (task) => taskInfo.type === '项目'
        })
    } else {
        // 加载指定项目的子项目
        const parentNote = MNNote.new(parentId)
        projectTasks = getSubProjects(parentNote)
    }
}
```

### 关键要点
1. **状态管理**：维护导航栈和当前层级
2. **URL 参数传递**：通过 parentId 参数区分不同层级的请求
3. **UI 反馈**：面包屑导航让用户清楚当前位置
4. **子项目识别**：通过 `hasSubProjects` 标记显示不同的 UI

## iPad 平台 NSNull 问题解决方案（2025-01-12）

### 问题描述
在 iPad 上运行时，WebView 的 `evaluateJavaScript` 方法可能返回 NSNull 对象而不是预期的字符串结果，导致后续代码尝试调用 `result.startsWith()` 时出错。

### 错误信息
```
📡 JavaScript 执行结果: [object NSNull]
❌ 执行 JavaScript 失败: result.startsWith is not a function. (In 'result.startsWith('error:')', 'result.startsWith' is undefined)
```

### 根本原因
1. **平台差异**：iOS/iPadOS 的 JavaScript 桥接行为与 macOS 不同
2. **返回值处理**：即使 JavaScript 正确执行并返回值，`evaluateJavaScript` 仍可能返回 NSNull
3. **类型假设**：代码假设返回值是字符串，直接调用 `startsWith` 方法

### 解决方案

#### 1. 添加 NSNull 检测方法
```javascript
taskSettingController.prototype.isNSNull = function(obj) {
  return (obj === NSNull.new())
}
```

#### 2. 改进 JavaScript 执行结果处理
```javascript
this[webViewName].evaluateJavaScript(script, (result) => {
  // 处理 NSNull 情况
  if (this.isNSNull(result)) {
    // 如果脚本包含 IIFE 包装，很可能执行成功但返回了 NSNull
    if (script.includes('(function()')) {
      resolve('success')
    } else {
      resolve(undefined)
    }
    return
  }
  resolve(result)
})
```

#### 3. 加强类型检查
```javascript
// 在使用 startsWith 之前检查类型
if (result && typeof result === 'string' && result.startsWith('error:')) {
  // 处理错误
}
```

### 关键要点
1. **不要假设返回类型**：始终检查返回值的类型
2. **平台测试**：在 Mac 和 iPad 上都要测试
3. **参考成熟方案**：mnutils 和 mnai 已经处理了这个问题
4. **优雅降级**：NSNull 不一定意味着失败，可能只是返回值丢失

## iPad iframe postMessage 通信问题（2025-01-12）

### 问题描述
在 iPad 上，虽然解决了 NSNull 问题，但 iframe 内的页面仍然显示"加载中"，无法接收到通过 postMessage 发送的数据。

### 问题分析
1. **Mac 正常，iPad 异常**：同样的代码在 Mac 上工作正常
2. **时序问题**：iPad 上 iframe 的加载和消息监听器注册的时序可能不同
3. **postMessage 限制**：iOS WebView 对 postMessage 的处理可能有特殊性

### 解决方案：增强消息重试机制

在 `sidebarContainer.html` 中改进数据传递函数：

```javascript
function loadTasksFromPlugin(encodedTasks) {
    const iframe = document.querySelector('.content-frame');
    
    if (!iframe || !iframe.contentWindow) {
        return 'iframe_not_ready';
    }
    
    try {
        const tasks = JSON.parse(decodeURIComponent(encodedTasks));
        
        // 定义发送消息的函数
        const sendMessage = () => {
            if (iframe.contentWindow) {
                iframe.contentWindow.postMessage({
                    type: 'loadTasks',
                    tasks: tasks
                }, '*');
                console.log('[sidebarContainer] 消息已发送到 iframe');
            }
        };
        
        // 立即发送一次
        sendMessage();
        
        // iPad 上可能需要多次重试，使用递增的延迟时间
        setTimeout(sendMessage, 100);
        setTimeout(sendMessage, 300);
        setTimeout(sendMessage, 600);
        
        // 最后一次尝试，确保 iframe 完全加载
        setTimeout(sendMessage, 1000);
        
        return 'success';
    } catch (error) {
        console.error('[sidebarContainer] 解析任务失败:', error);
        return 'error: ' + error.message;
    }
}
```

### 关键要点
1. **多次重试**：使用递增的延迟时间（0ms, 100ms, 300ms, 600ms, 1000ms）
2. **日志追踪**：添加 console.log 便于调试
3. **统一处理**：所有数据加载函数都采用相同的重试机制
4. **平台差异**：接受并适应 iOS/iPadOS 的特殊性

### 其他可选方案
1. **双向通信确认**：iframe 加载完成后主动通知父窗口
2. **直接函数调用**：在 iframe 中暴露全局函数供父窗口调用
3. **缓存机制**：父窗口缓存数据，等待 iframe ready 信号

## 复杂筛选逻辑实现（2025-01-11）

### 需求背景
项目视图需要默认隐藏已完成的动作，但保留已完成的目标、项目等其他类型的任务。

### 实现方案

#### 1. 筛选器状态设计
```javascript
filters: {
    statuses: new Set(['未开始', '进行中']),  // 默认不包含"已完成"
    types: new Set(['目标', '关键结果', '项目', '动作']),
    priorities: new Set(['高', '中', '低']),
    hideCompletedActions: true  // 特殊规则标记
}
```

#### 2. 筛选逻辑实现
```javascript
shouldShowTask(task) {
    // 特殊规则：隐藏已完成的动作
    if (this.filters.hideCompletedActions && 
        task.type === '动作' && 
        task.status === '已完成') {
        return false;
    }
    
    // 常规筛选
    return this.filters.statuses.has(task.status) && 
           this.filters.types.has(task.type) &&
           this.filters.priorities.has(task.priority || '低');
}
```

#### 3. UI 提示
```html
<p class="filter-hint">提示：默认隐藏已完成的动作</p>
```

#### 4. 筛选结果统计
```javascript
updateStats(filteredTasks = null) {
    const tasksToCount = filteredTasks || this.tasks;
    const stats = {
        total: tasksToCount.length,
        filtered: filteredTasks ? `(已筛选 ${this.tasks.length - filteredTasks.length} 项)` : ''
    };
    
    document.getElementById('contentStats').innerHTML = `
        <span>显示: ${stats.total} ${stats.filtered}</span>
    `;
}
```

### 关键要点
1. **业务规则优先**：特殊筛选规则应该在常规筛选之前处理
2. **用户提示**：让用户知道有特殊的筛选规则在生效
3. **统计反馈**：显示筛选前后的数量对比
4. **灵活配置**：通过复选框让用户可以关闭特殊规则

## WebView 初始化时序问题的新解决方案（2025-01-11）

### 问题描述
项目视图和任务队列在切换时一直显示"加载中"，需要手动刷新才能加载数据。

### 根本原因
sidebarContainer.html 在 iframe 的 onload 事件中立即发送数据加载请求，但此时 iframe 内的 JavaScript 可能还未完全初始化，导致无法正确接收和处理数据。

### 解决方案

#### 1. 子页面主动加载
让每个视图在自己初始化完成后主动请求数据：
```javascript
// projectview.html
init() {
    this.bindEvents();
    this.setupFilters();
    this.showLoadingState();
    
    // 延迟加载数据，确保 WebView 通信准备就绪
    setTimeout(() => {
        console.log('项目视图初始化完成，开始加载数据');
        window.location.href = 'mntask://loadProjectsData';
    }, 100);
}
```

#### 2. 移除父容器的自动加载
```javascript
// sidebarContainer.html
// 注释掉自动加载，改为由子页面初始化后主动加载
// if (viewName === 'projects') {
//     window.location.href = 'mntask://loadProjectsData';
// }
```

### 与之前解决方案的对比
- **之前**：今日看板通过让父容器延迟发送数据解决
- **现在**：项目视图通过子页面主动请求解决
- **优势**：子页面掌控自己的初始化时机，更加可靠

### 关键要点
1. **初始化控制权**：让每个视图控制自己的初始化时机
2. **适度延迟**：100ms 延迟确保 WebView 通信机制就绪
3. **调试友好**：添加 console.log 便于跟踪加载流程
4. **统一处理**：相同问题的视图使用相同的解决方案

## API 文档与源码不一致问题（2025-01-11）

### 问题描述
在开发过程中发现 `mnutils/MNUTILS_API_GUIDE.md` 文档中记载的某些 API 实际上不存在或参数不一致。

### 典型案例

#### 1. MNUtil.select() 方法不存在
```javascript
// ❌ 文档中的错误示例
const selectedIndex = await MNUtil.select("选择任务类型", options, false);
if (selectedIndex === null) return;  // 文档说取消返回 null

// ✅ 实际正确的 API
const selectedIndex = await MNUtil.userSelect("选择任务类型", "", options);
if (selectedIndex === 0) return;  // 实际取消返回 0
```

#### 2. 索引差异
- 文档描述：选项索引从 0 开始
- 实际情况：选项索引从 1 开始（0 是取消按钮）

#### 3. 缺失的方法
文档中未提及但实际存在的有用方法：
```javascript
// xdyyutils.js 中存在但文档未记录
note.getIncludingCommentIndex("状态：");  // 查找包含特定文本的评论
note.getIncludingHtmlCommentIndex("字段名");
note.getTextCommentsIndexArr("完整文本");
```

### 解决方法

#### 1. 直接查看源码
```bash
# 搜索方法是否存在
grep -n "methodName" mnutils.js
grep -n "methodName" xdyyutils.js
```

#### 2. 验证参数
查看方法的实际实现，确认参数个数和类型：
```javascript
// mnutils.js 第 921 行
static async userSelect(mainTitle, subTitle, items) {
    // 需要三个参数，不是文档中的两个
}
```

### 最佳实践
1. **源码是真相**：始终以 `mnutils.js` 和 `xdyyutils.js` 为准
2. **先查文档后验证**：文档提供思路，源码确认细节
3. **测试边界情况**：特别是取消按钮等特殊返回值
4. **记录差异**：发现差异时记录下来，避免重复踩坑

### 经验总结
1. **文档滞后是常态**：API 更新后文档可能没有同步
2. **IDE 不可靠**：JSB 框架下 IDE 的智能提示可能不准确
3. **grep 是好帮手**：快速验证方法是否存在
4. **保持怀疑**：遇到"Not supported yet"等错误时，首先怀疑是 API 名称或参数错误

## iframe 与父窗口通信问题（2025-01-12）

### 问题描述
在 iframe 架构下，子页面（如 todayboard.html）中的任务操作按钮无法正确触发原生代码的协议处理。

### 根本原因
iframe 中直接使用 `window.location.href = 'mntask://...'` 无法正确传递到原生代码，因为：
1. iframe 有自己的浏览上下文
2. URL 协议需要在主 WebView（父窗口）中触发才能被原生代码截获

### 解决方案

#### 1. 子页面使用 postMessage 发送消息
```javascript
// todayboard.html 中的任务操作
updateTaskStatus(taskId) {
    window.parent.postMessage({
        action: 'updateStatus',
        params: { id: taskId }
    }, '*');
}
```

#### 2. 父窗口接收并转发协议
```javascript
// sidebarContainer.html
window.addEventListener('message', function(event) {
    if (event.data && event.data.action) {
        const params = event.data.params || {};
        const queryString = Object.keys(params)
            .map(key => `${key}=${encodeURIComponent(params[key])}`)
            .join('&');
        
        const url = `mntask://${event.data.action}${queryString ? '?' + queryString : ''}`;
        window.location.href = url;
    }
});
```

### 关键要点
1. **iframe 通信必须使用 postMessage**：不能直接触发 URL 协议
2. **参数编码很重要**：使用 encodeURIComponent 确保特殊字符正确传递
3. **调试日志很有用**：在消息传递的每个环节添加日志
4. **父窗口是协议中转站**：所有协议都需要通过父窗口转发

## 视图重复加载优化（2025-01-12）

### 问题描述
切换回已加载的视图（如今日看板）时，会重新加载 iframe，导致闪烁和性能浪费。

### 解决方案
在 loadView 函数中添加智能检测：
```javascript
const currentSrc = iframe.src;
const isSameView = currentSrc && currentSrc.includes(config.url);

if (isSameView) {
    // 相同视图，直接触发数据刷新
    switch (viewName) {
        case 'todayboard':
            window.location.href = 'mntask://loadTodayBoardData';
            break;
        // ... 其他视图
    }
} else {
    // 不同视图，重新加载 iframe
    iframe.src = config.url;
}
```

### 优化效果
1. **减少页面重载**：相同视图切换时不会重新加载页面
2. **提升响应速度**：数据刷新比页面重载快得多
3. **改善用户体验**：减少闪烁和等待时间

## 任务启动功能闪退问题（2025-01-17）

### 问题描述
点击「启动任务」按钮后，MarginNote 4 应用程序直接闪退。崩溃日志显示异常发生在 NSUserDefaults 操作时。

### 崩溃信息
```
Exception Type:        EXC_CRASH (SIGABRT)
Exception Codes:       0x0000000000000000, 0x0000000000000000
Termination Reason:    Namespace SIGNAL, Code 6 Abort trap: 6

崩溃调用栈：
Foundation -[NSUserDefaults(NSUserDefaults) setObject:forKey:] + 68
JavaScriptCore JSC::ObjCCallbackFunctionImpl::call
```

### 根本原因
1. **类型不兼容**：NSUserDefaults 只能存储 Objective-C 兼容的类型（NSString、NSNumber、NSArray、NSDictionary 等）
2. **直接存储 JS 对象**：代码尝试将 JavaScript 对象直接传给 `setObjectForKey`，导致崩溃
3. **调用路径**：`launchTask` → `taskConfig.saveLaunchedTaskState(state)` → `NSUserDefaults.setObjectForKey`

### 解决方案

#### 1. 修改保存方法，使用 JSON 序列化
```javascript
// utils.js
static saveLaunchedTaskState(state) {
  const notebookId = this.getCurrentNotebookId()
  if (!notebookId) return
  
  const key = `MNTask_launchedTaskState_${notebookId}`
  // 序列化为 JSON 字符串
  const jsonString = JSON.stringify(state)
  this.save(key, jsonString)
}
```

#### 2. 修改读取方法，使用 JSON 反序列化
```javascript
// utils.js
static getLaunchedTaskState() {
  const notebookId = this.getCurrentNotebookId()
  if (!notebookId) return {
    isTaskLaunched: false,
    currentLaunchedTaskId: null
  }
  
  const key = `MNTask_launchedTaskState_${notebookId}`
  const jsonString = this.getByDefault(key, null)
  
  if (jsonString) {
    try {
      return JSON.parse(jsonString)
    } catch (e) {
      // 解析失败返回默认值
    }
  }
  
  return {
    isTaskLaunched: false,
    currentLaunchedTaskId: null
  }
}
```

### 关键要点
1. **JSB 框架限制**：JavaScript 对象不能直接传给 Objective-C API
2. **序列化必要性**：复杂数据结构必须序列化为字符串再存储
3. **错误处理**：JSON.parse 可能失败，需要 try-catch 保护
4. **通用原则**：使用 NSUserDefaults 时始终确保数据类型兼容

## 任务字段查找方法问题（2025-01-17）

### 问题描述
`getLaunchLink` 方法无法找到任务卡片中的启动链接，导致启动任务功能失效。

### 问题分析
启动字段在任务卡片中的存储格式特殊：
```html
<span id="subField" style="...">[启动](marginnote4app://note/xxx)</span>
```

关键点：
1. 字段名不是普通的"启动"文本
2. 整个 `[启动](url)` 是作为字段名存在的
3. `TaskFieldUtils.getFieldContent(note, "启动")` 无法匹配这种格式

### 解决方案

#### 使用正确的查找方法
```javascript
// xdyy_utils_extensions.js
static getLaunchLink(note) {
  // 查找包含 "[启动]" 的评论
  const launchIndex = note.getIncludingCommentIndex("[启动]");
  if (launchIndex === -1) return null;
  
  const comment = note.MNComments[launchIndex];
  if (!comment || !comment.text) return null;
  
  // 从评论文本中提取链接
  const linkMatch = comment.text.match(/\[启动\]\(([^)]+)\)/);
  if (linkMatch) {
    return linkMatch[1];  // 返回 URL 部分
  }
  return null;
}
```

### 相关代码
在 `addOrUpdateLaunchLink` action 中，启动字段是这样创建的：
```javascript
// xdyy_custom_actions_registry.js
const launchLink = `[启动](${linkToUse})`;
const fieldHtml = TaskFieldUtils.createFieldHtml(launchLink, 'subField');
```

### 关键要点
1. **字段格式特殊性**：某些字段的"字段名"本身就包含了值（如 Markdown 链接）
2. **查找方法选择**：对于特殊格式的字段，使用 `getIncludingCommentIndex` 而不是 `getFieldContent`
3. **正则表达式提取**：使用正则表达式从 HTML 中提取所需的 URL
4. **API 一致性**：查找和创建字段的方法要保持一致

## MNTask 制卡功能问题汇总（2025-01-17）

### 1. TaskFieldUtils 方法名冲突问题

#### 问题描述
在任务制卡功能中，所有字段的内容都返回 null，导致无法正确识别字段位置。"所属"字段被添加到卡片末尾而不是"信息"字段下方，父任务中的链接也无法移动到正确的状态字段下方。

#### 问题原因
TaskFieldUtils 类中存在两个同名的 `getFieldContent` 方法：
```javascript
// 第一个方法（行 260）
static getFieldContent(comment) {
  // 从 HTML 中提取 <span> 标签内的文本
  const regex = /<span[^>]*>(.*?)<\/span>/
  const match = text.match(regex)
  return match ? match[1].trim() : text
}

// 第二个方法（行 306）
static getFieldContent(note, fieldName) {
  // 从笔记中查找指定字段名的内容
  // 如果找不到返回 null
}
```

JavaScript 不支持方法重载，第二个方法定义会覆盖第一个方法。当代码调用 `TaskFieldUtils.getFieldContent(text)` 时，实际调用的是第二个方法，参数不匹配导致返回 null。

#### 解决方案
将第一个方法重命名为 `extractFieldText`，避免方法名冲突：
```javascript
static extractFieldText(comment) {
  const regex = /<span[^>]*>(.*?)<\/span>/
  const match = text.match(regex)
  return match ? match[1].trim() : text
}
```

#### 经验教训
- **JavaScript 没有方法重载**：同名方法会被后定义的覆盖
- **命名要有区分度**：功能不同的方法应该有不同的名称
- **调试技巧**：当方法返回意外结果时，检查是否有同名方法冲突

### 2. 父子任务链接管理问题

#### 问题描述
每次对已制卡的动作卡片点击"制卡"时，父项目卡片中会出现重复的子卡片链接。

#### 问题原因
`linkParentTask` 方法直接调用 `parent.appendNoteLink(note, "To")` 创建新链接，没有检查是否已存在链接。

#### 解决方案
在创建链接前先检查是否已存在：
```javascript
// 1. 检查父任务中是否已有指向子任务的链接
const parentParsed = this.parseTaskComments(parent)
let existingLinkIndex = -1

for (let link of parentParsed.links) {
  if (link.linkedNoteId === note.noteId) {
    existingLinkIndex = link.index
    break
  }
}

// 2. 根据情况创建或使用现有链接
let linkIndexInParent
if (existingLinkIndex !== -1) {
  linkIndexInParent = existingLinkIndex  // 使用现有链接
} else {
  parent.appendNoteLink(note, "To")       // 创建新链接
  linkIndexInParent = parent.MNComments.length - 1
}
```

#### 链接管理最佳实践
- **检查存在性**：创建前先检查是否已存在
- **移动而非创建**：状态改变时移动现有链接到新位置
- **维护唯一性**：确保父子之间只有一个链接

### 3. 失效链接清理时机问题

#### 问题描述
对已是任务卡片的卡片点击"制卡"时，不会清理失效链接，导致无效链接累积。

#### 问题原因
`convertToTaskCard` 方法在处理已是任务卡片的情况时，只更新字段和处理父子关系，没有调用 `cleanupBrokenLinks`。

#### 解决方案
在处理已是任务卡片时，先清理失效链接：
```javascript
MNUtil.undoGrouping(() => {
  // 先清理失效链接
  const removedLinksCount = this.cleanupBrokenLinks(noteToConvert)
  if (removedLinksCount > 0) {
    MNUtil.log(`✅ 清理了 ${removedLinksCount} 个失效链接`)
  }
  
  // 然后进行其他处理...
})
```

#### 清理策略
- **主动清理**：每次制卡时都检查并清理失效链接
- **日志反馈**：告知用户清理了多少个失效链接
- **性能考虑**：cleanupBrokenLinks 只在必要时调用

## GitHub Issue 工作流规范（2025-01-17）

### 概述
标准化的 GitHub 问题管理流程，确保问题追踪的专业性和可追溯性。

### 1. 问题发现与记录
当开发过程中发现问题时：
- 创建临时记录文件（如 `fix_summary.md`）
- 详细记录：
  - 问题现象
  - 复现步骤
  - 原因分析
  - 解决方案

### 2. 代码修复流程
- 在本地分支进行修复
- 确保修复经过充分测试
- 保持代码改动的原子性（一个提交解决一个问题）
- 避免在一个提交中混杂多个不相关的修改

### 3. 提交规范
```bash
# 1. 添加修改的文件
git add [修改的文件]

# 2. 创建语义化提交
git commit -m "fix: 简要描述修复内容

- 详细说明修复的问题 (#issue-number)
- 列出主要改动点
- 说明影响范围

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# 3. 推送到远程仓库
git push [remote-name] [branch-name]
```

### 4. 创建 Issue
**重要原则**：必须在代码提交并推送后才创建 issue

```bash
gh issue create \
  --title "[插件名] 问题简要描述" \
  --body "## 问题描述
详细描述问题现象...

## 复现步骤
1. 步骤一
2. 步骤二
3. ...

## 原因分析
说明问题的根本原因...

## 解决方案
描述采用的解决方案...

## 相关代码
- 修复位置：[GitHub 代码永久链接]
- Commit: [commit hash]

## 修复状态
✅ 已在 [branch] 分支修复" \
  --label "插件名" \
  --label "bug/feature/enhancement"
```

### 5. Issue 更新最佳实践

#### 使用代码永久链接
```
https://github.com/[用户名]/[仓库名]/blob/[commit-hash]/[文件路径]#L[行号]
```
示例：
```
https://github.com/xkwxdyy/MN-Addons/blob/0a16a5805278ffa676a7365c22361e94d16d1876/mntask/xdyy_utils_extensions.js#L538-L546
```

#### 更新 Issue 评论
```bash
gh issue comment [issue-number] --body "已在 commit [hash] 中修复

### 相关代码链接：
- [具体修复描述]：[代码永久链接]

### 修复说明：
[详细说明修复的内容]"
```

### 6. 关闭 Issue
```bash
# 验证修复后关闭
gh issue close [issue-number] --comment "已修复并验证通过"

# 或者简单关闭
gh issue close [issue-number]
```

### 7. 完整工作流示例

以 TaskFieldUtils 方法名冲突问题为例：

1. **发现问题**：字段内容提取全部返回 null
2. **分析原因**：发现存在同名方法导致覆盖
3. **本地修复**：将方法重命名为 `extractFieldText`
4. **测试验证**：确认字段内容能正确提取
5. **提交代码**：
   ```bash
   git add xdyy_utils_extensions.js
   git commit -m "fix: 修复 TaskFieldUtils 方法名冲突导致字段提取失败 (#3)"
   git push github dev
   ```
6. **创建 Issue**：包含问题描述、原因分析、解决方案
7. **更新 Issue**：添加具体的代码链接
8. **关闭 Issue**：确认修复后关闭

### 8. 注意事项

#### 标签使用规范
- **插件标签**：必须添加（如 `mntask`、`mnai`）
- **类型标签**：
  - `bug`：错误修复
  - `feature`：新功能
  - `enhancement`：功能改进
  - `documentation`：文档更新

#### 代码链接要求
- 使用包含 commit hash 的永久链接
- 链接到具体的代码行或代码块
- 多个相关位置都要提供链接

#### Issue 描述规范
- 标题简洁明了，包含插件名
- 正文结构化，使用 Markdown 格式
- 包含足够的上下文信息
- 提供复现步骤（如适用）

#### 时机把握
- **先代码后 Issue**：确保 Issue 创建时代码已经在仓库中
- **及时更新**：重要进展及时更新到 Issue 评论中
- **及时关闭**：问题解决后及时关闭，避免积压

### 9. 批量处理技巧

当一次修复多个相关问题时：
```bash
# 1. 一次提交修复多个问题
git commit -m "fix: 修复 MNTask 制卡功能的多个问题

- 修复问题 A (#1)
- 修复问题 B (#2)
- 修复问题 C (#3)"

# 2. 分别更新各个 Issue
for issue in 1 2 3; do
  gh issue comment $issue --body "已在 commit [hash] 中修复
  相关代码：[对应的代码链接]"
done

# 3. 批量关闭
gh issue close 1 2 3
```

### 10. 文档维护

- 重要问题的解决方案应记录到 CLAUDE.md
- 通用性的解决方案可以整理成最佳实践
- 定期回顾和更新文档，保持其时效性

## Git 操作重要提醒（2025-01-17）

### 关键事项
1. **提交后必须 push**：完成 git commit 后，一定要记得执行 git push 推送到远程仓库
2. **远程仓库名称**：MN-Addon 项目的远程仓库名是 `github`，不是默认的 `origin`

### 正确的 Git 工作流
```bash
# 1. 添加文件
git add [文件名]

# 2. 提交更改
git commit -m "提交信息"

# 3. 推送到远程仓库（重要！）
git push github [分支名]  # 注意：是 github 而不是 origin
```

### 常见错误
```bash
# ❌ 错误：使用 origin
git push origin dev  # 会报错：'origin' does not appear to be a git repository

# ✅ 正确：使用 github
git push github dev
```

### 检查远程仓库配置
```bash
# 查看当前配置的远程仓库
git remote -v

# 输出示例：
# github  https://github.com/xkwxdyy/MN-Addons.git (fetch)
# github  https://github.com/xkwxdyy/MN-Addons.git (push)
```

### 重要提醒
- 在创建 GitHub Issue 之前，确保代码已经推送到远程仓库
- 使用 `git push github [分支名]` 而不是 `git push origin [分支名]`
- 如果忘记 push，Issue 中引用的代码链接将无法访问