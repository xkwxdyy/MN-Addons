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