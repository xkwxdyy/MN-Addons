# MNTask 插件与网页交互开发指南

> 本指南将手把手教你如何在 MarginNote 插件中实现网页与原生代码的交互，让你能够创建功能丰富的用户界面。

## 目录

1. [基础概念](#第一章基础概念)
2. [通信机制详解](#第二章通信机制详解)
3. [Hello World 示例](#第三章hello-world-示例)
4. [看板功能实战](#第四章看板功能实战)
5. [调试技巧](#第五章调试技巧)
6. [API 参考](#附录api-参考)

---

## 第一章：基础概念

### 1.1 什么是 WebView？

WebView 是一个可以在原生应用中显示网页内容的组件。想象一下，它就像是在你的插件中嵌入了一个迷你浏览器。

```javascript
// 在 MarginNote 插件中创建一个 WebView
const webView = new UIWebView({
    x: 0,      // 横坐标
    y: 0,      // 纵坐标
    width: 400,  // 宽度
    height: 300  // 高度
});
```

**为什么使用 WebView？**
- 可以使用 HTML/CSS/JavaScript 创建丰富的界面
- 开发速度快，调试方便
- 可以复用 Web 开发经验

### 1.2 插件与网页的关系

```
┌─────────────────────────────────────┐
│       MarginNote 插件 (原生)         │
│                                     │
│  ┌─────────────────────────────┐   │
│  │      WebView 组件           │   │
│  │  ┌───────────────────────┐  │   │
│  │  │    HTML 页面          │  │   │
│  │  │  - 用户界面           │  │   │
│  │  │  - JavaScript 逻辑    │  │   │
│  │  └───────────────────────┘  │   │
│  └─────────────────────────────┘   │
│                                     │
│      原生功能（文件操作等）           │
└─────────────────────────────────────┘
```

### 1.3 为什么需要交互？

网页可以提供漂亮的界面，但无法直接访问 MarginNote 的数据。原生代码可以访问数据，但创建界面比较困难。两者结合，各取所长！

**交互场景示例：**
1. 网页显示任务列表 → 用户点击任务 → 通知插件打开对应笔记
2. 插件获取任务数据 → 传递给网页 → 网页渲染成美观的卡片

---

## 第二章：通信机制详解

### 2.1 网页到插件：URL Scheme

网页通过特殊的 URL 来触发插件的功能，就像点击 `mailto:` 链接会打开邮件客户端一样。

```javascript
// 在网页中触发插件功能
window.location.href = 'mntask://updateTaskStatus?id=12345&status=completed';
```

**工作原理：**
1. 网页设置 `window.location.href` 为特殊 URL
2. WebView 拦截这个 URL 请求
3. 插件解析 URL 并执行相应操作

### 2.2 插件到网页：JavaScript 注入

插件可以在网页中执行 JavaScript 代码，向网页传递数据或调用函数。

```javascript
// 在插件中执行网页的 JavaScript
webView.evaluateJavaScript('updateTaskList(' + JSON.stringify(tasks) + ')', (result) => {
    // result 是 JavaScript 执行的返回值
});
```

### 2.3 数据格式与编码

由于数据需要在 URL 和 JavaScript 中传递，需要正确编码：

```javascript
// 网页端：编码数据
const data = { name: "测试任务", status: "进行中" };
const encoded = encodeURIComponent(JSON.stringify(data));
window.location.href = `mntask://createTask?data=${encoded}`;

// 插件端：解码数据
const encoded = getParameterFromURL('data');
const decoded = decodeURIComponent(encoded);
const data = JSON.parse(decoded);
```

**注意事项：**
- 始终使用 `encodeURIComponent` 编码中文和特殊字符
- 使用 JSON 格式传递复杂数据
- 注意数据大小限制（URL 长度限制）

---

## 第三章：Hello World 示例

让我们创建一个最简单的交互示例，理解基本流程。

### 3.1 创建 HTML 页面

创建文件 `hello.html`：

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Hello MNTask</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
        }
        button {
            padding: 10px 20px;
            font-size: 16px;
            margin: 10px;
        }
        #message {
            margin-top: 20px;
            padding: 10px;
            background: #f0f0f0;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <h1>Hello MNTask!</h1>
    
    <!-- 按钮：向插件发送消息 -->
    <button onclick="sayHello()">向插件说 Hello</button>
    
    <!-- 显示来自插件的消息 -->
    <div id="message">等待消息...</div>
    
    <script>
        // 向插件发送消息
        function sayHello() {
            console.log('发送 Hello 到插件');
            // 使用 URL Scheme 通知插件
            window.location.href = 'mntask://sayHello?message=Hello%20from%20webpage';
        }
        
        // 接收插件的消息
        function receiveMessage(text) {
            console.log('收到插件消息:', text);
            document.getElementById('message').innerText = '插件说：' + text;
        }
        
        // 页面加载完成后通知插件
        window.onload = function() {
            console.log('页面已加载');
            window.location.href = 'mntask://pageReady';
        };
    </script>
</body>
</html>
```

### 3.2 插件端代码

在插件中处理网页的请求：

```javascript
/**
 * 处理 WebView 的 URL 请求
 * @param {UIWebView} webView - WebView 实例
 * @param {NSURLRequest} request - URL 请求
 * @param {number} navigationType - 导航类型
 * @returns {boolean} 是否允许加载
 */
webViewShouldStartLoadWithRequestNavigationType: function(webView, request, navigationType) {
    const url = request.URL().absoluteString();
    
    // 检查是否是我们的自定义协议
    if (url.startsWith('mntask://')) {
        // 解析 URL
        const [protocol, rest] = url.split('://');
        const [command, queryString] = rest.split('?');
        
        // 处理不同的命令
        switch (command) {
            case 'sayHello':
                // 获取参数
                const message = this.getQueryParameter(queryString, 'message');
                const decoded = decodeURIComponent(message);
                
                // 显示提示
                MNUtil.showHUD('网页说：' + decoded);
                
                // 回复网页
                webView.evaluateJavaScript(
                    `receiveMessage('Hello from plugin! 当前时间：${new Date().toLocaleTimeString()}')`,
                    (result) => {
                        console.log('JavaScript 执行完成');
                    }
                );
                break;
                
            case 'pageReady':
                console.log('网页已准备就绪');
                // 可以开始传递初始数据
                break;
        }
        
        // 返回 false 阻止实际加载这个 URL
        return false;
    }
    
    // 其他 URL 正常加载
    return true;
}

/**
 * 从查询字符串中获取参数值
 * @param {string} queryString - 查询字符串，如 "key1=value1&key2=value2"
 * @param {string} key - 参数名
 * @returns {string} 参数值
 */
getQueryParameter: function(queryString, key) {
    const params = queryString.split('&');
    for (let param of params) {
        const [k, v] = param.split('=');
        if (k === key) return v;
    }
    return '';
}
```

### 3.3 运行和测试

1. 将 HTML 文件放在插件目录中
2. 在插件中创建 WebView 并加载页面
3. 点击按钮，观察交互效果

**预期效果：**
- 点击按钮后，插件显示 HUD 提示
- 网页显示插件返回的消息和时间

---

## 第四章：看板功能实战

现在让我们实现一个真实的功能：今日任务看板。

### 4.1 需求分析

**功能需求：**
1. 显示今日的任务列表
2. 支持任务状态切换（未开始/进行中/已完成）
3. 支持启动任务（打开对应笔记）
4. 支持筛选和搜索
5. 实时更新任务数据

**技术需求：**
1. 美观的卡片式界面
2. 流畅的动画效果
3. 响应式设计（支持不同尺寸）
4. 良好的性能（大量任务时不卡顿）

### 4.2 架构设计

```
┌─────────────────────────────────────────────┐
│                 插件端                       │
│  ┌─────────────────────────────────────┐   │
│  │      任务数据管理 (MNTaskManager)     │   │
│  └─────────────────────┬───────────────┘   │
│                        │                     │
│  ┌─────────────────────┴───────────────┐   │
│  │   WebView 管理 (settingController)   │   │
│  └─────────────────────┬───────────────┘   │
└────────────────────────┼────────────────────┘
                         │ 
                    数据 & 命令
                         │
┌────────────────────────┼────────────────────┐
│                 网页端  │                    │
│  ┌─────────────────────┴───────────────┐   │
│  │    通信桥接 (MNTaskBridge)          │   │
│  └─────────────────────┬───────────────┘   │
│                        │                     │
│  ┌─────────────────────┼───────────────┐   │
│  │   数据管理          │   UI 渲染      │   │
│  │  (DataManager)      │  (UIRenderer)  │   │
│  └─────────────────────┴───────────────┘   │
└──────────────────────────────────────────────┘
```

### 4.3 创建通信桥接库

创建 `mntask-bridge.js`：

```javascript
/**
 * MNTask 网页与插件通信桥接库
 * @class MNTaskBridge
 * @description 封装了网页与插件之间的所有通信逻辑
 * 
 * @example
 * // 初始化桥接器
 * const bridge = new MNTaskBridge();
 * 
 * // 监听数据
 * bridge.on('tasksLoaded', (tasks) => {
 *     console.log('收到任务数据：', tasks);
 * });
 * 
 * // 发送命令
 * bridge.send('updateTaskStatus', { taskId: '123', status: '已完成' });
 */
class MNTaskBridge {
    /**
     * 构造函数
     * @param {Object} options - 配置选项
     * @param {boolean} options.debug - 是否开启调试模式
     * @param {string} options.protocol - URL 协议，默认 'mntask://'
     */
    constructor(options = {}) {
        this.debug = options.debug || false;
        this.protocol = options.protocol || 'mntask://';
        this.handlers = new Map();
        this.ready = false;
        
        // 初始化
        this._init();
    }
    
    /**
     * 初始化
     * @private
     */
    _init() {
        // 页面加载完成后通知插件
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this._notifyReady();
            });
        } else {
            this._notifyReady();
        }
        
        // 暴露全局接收函数
        window.MNTaskBridge = this;
        window.receiveFromPlugin = this.receive.bind(this);
    }
    
    /**
     * 通知插件页面已准备就绪
     * @private
     */
    _notifyReady() {
        this.ready = true;
        this._sendURL('ready');
        this._log('MNTaskBridge 已就绪');
    }
    
    /**
     * 发送消息到插件
     * @param {string} command - 命令名称
     * @param {Object} data - 数据对象
     * 
     * @example
     * bridge.send('updateTaskStatus', { 
     *     taskId: '12345', 
     *     status: '已完成' 
     * });
     */
    send(command, data = {}) {
        if (!this.ready) {
            this._log('警告：Bridge 尚未就绪', 'warn');
            return;
        }
        
        // 编码数据
        const encoded = encodeURIComponent(JSON.stringify(data));
        
        // 发送 URL
        this._sendURL(command, { data: encoded });
        
        this._log(`发送命令：${command}`, 'info', data);
    }
    
    /**
     * 接收来自插件的数据
     * @param {string} type - 数据类型
     * @param {string} jsonData - JSON 格式的数据
     * 
     * @example
     * // 插件调用：
     * webView.evaluateJavaScript(
     *     `receiveFromPlugin('tasks', '${JSON.stringify(tasks)}')`
     * );
     */
    receive(type, jsonData) {
        try {
            const data = JSON.parse(jsonData);
            this._log(`接收数据：${type}`, 'info', data);
            
            // 触发对应的处理器
            const handlers = this.handlers.get(type);
            if (handlers) {
                handlers.forEach(handler => {
                    try {
                        handler(data);
                    } catch (error) {
                        this._log(`处理器错误：${error.message}`, 'error');
                    }
                });
            }
        } catch (error) {
            this._log(`解析数据错误：${error.message}`, 'error');
        }
    }
    
    /**
     * 监听特定类型的数据
     * @param {string} type - 数据类型
     * @param {Function} handler - 处理函数
     * @returns {Function} 取消监听的函数
     * 
     * @example
     * const unsubscribe = bridge.on('tasks', (tasks) => {
     *     console.log('任务列表：', tasks);
     * });
     * 
     * // 取消监听
     * unsubscribe();
     */
    on(type, handler) {
        if (!this.handlers.has(type)) {
            this.handlers.set(type, new Set());
        }
        
        this.handlers.get(type).add(handler);
        
        // 返回取消监听的函数
        return () => {
            const handlers = this.handlers.get(type);
            if (handlers) {
                handlers.delete(handler);
            }
        };
    }
    
    /**
     * 发送 URL 到插件
     * @private
     * @param {string} command - 命令
     * @param {Object} params - 参数
     */
    _sendURL(command, params = {}) {
        // 构建查询字符串
        const query = Object.keys(params)
            .map(key => `${key}=${params[key]}`)
            .join('&');
        
        // 构建完整 URL
        const url = `${this.protocol}${command}${query ? '?' + query : ''}`;
        
        // 设置 location
        window.location.href = url;
    }
    
    /**
     * 日志输出
     * @private
     * @param {string} message - 日志消息
     * @param {string} level - 日志级别
     * @param {any} data - 附加数据
     */
    _log(message, level = 'log', data = null) {
        if (!this.debug) return;
        
        const prefix = '[MNTaskBridge]';
        const timestamp = new Date().toLocaleTimeString();
        
        switch (level) {
            case 'info':
                console.info(`${prefix} ${timestamp} - ${message}`, data || '');
                break;
            case 'warn':
                console.warn(`${prefix} ${timestamp} - ${message}`, data || '');
                break;
            case 'error':
                console.error(`${prefix} ${timestamp} - ${message}`, data || '');
                break;
            default:
                console.log(`${prefix} ${timestamp} - ${message}`, data || '');
        }
    }
}

// 自动创建全局实例
const bridge = new MNTaskBridge({ debug: true });
```

### 4.4 创建任务看板页面

创建 `todayboard_new.html`：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>今日任务看板</title>
    
    <!-- 引入通信桥接库 -->
    <script src="mntask-bridge.js"></script>
    
    <style>
        /* 基础样式重置 */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background-color: #f5f5f7;
            color: #1d1d1f;
            line-height: 1.5;
        }
        
        /* 容器布局 */
        .container {
            display: flex;
            height: 100vh;
        }
        
        /* 侧边栏筛选器 */
        .sidebar {
            width: 200px;
            background: white;
            border-right: 1px solid #e5e5e7;
            padding: 20px;
            overflow-y: auto;
        }
        
        .sidebar h3 {
            font-size: 14px;
            font-weight: 600;
            color: #86868b;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        /* 主内容区 */
        .main-content {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
        }
        
        /* 头部工具栏 */
        .toolbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding: 10px 0;
        }
        
        .toolbar h1 {
            font-size: 24px;
            font-weight: 600;
        }
        
        .toolbar-actions {
            display: flex;
            gap: 10px;
        }
        
        .btn {
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .btn-primary {
            background: #007aff;
            color: white;
        }
        
        .btn-primary:hover {
            background: #0063d1;
        }
        
        /* 任务卡片网格 */
        .task-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 16px;
        }
        
        /* 任务卡片样式 */
        .task-card {
            background: white;
            border-radius: 12px;
            padding: 16px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            transition: all 0.2s;
            cursor: pointer;
        }
        
        .task-card:hover {
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
            transform: translateY(-2px);
        }
        
        .task-header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 8px;
        }
        
        .task-type {
            font-size: 12px;
            padding: 2px 8px;
            border-radius: 4px;
            font-weight: 500;
        }
        
        .type-目标 { background: #e3f2fd; color: #1976d2; }
        .type-项目 { background: #f3e5f5; color: #7b1fa2; }
        .type-任务 { background: #e8f5e9; color: #388e3c; }
        .type-动作 { background: #fff3e0; color: #f57c00; }
        
        .task-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 8px;
            line-height: 1.4;
        }
        
        .task-meta {
            display: flex;
            gap: 12px;
            font-size: 13px;
            color: #86868b;
        }
        
        .task-actions {
            display: flex;
            gap: 8px;
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid #f0f0f0;
        }
        
        .task-action {
            flex: 1;
            padding: 6px 12px;
            border: 1px solid #e5e5e7;
            border-radius: 6px;
            background: white;
            font-size: 13px;
            cursor: pointer;
            text-align: center;
            transition: all 0.2s;
        }
        
        .task-action:hover {
            background: #f5f5f7;
            border-color: #007aff;
            color: #007aff;
        }
        
        /* 加载状态 */
        .loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: #86868b;
        }
        
        .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #f0f0f0;
            border-top-color: #007aff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 16px;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        /* 空状态 */
        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #86868b;
        }
        
        .empty-state-icon {
            font-size: 48px;
            margin-bottom: 16px;
        }
        
        /* 筛选器样式 */
        .filter-group {
            margin-bottom: 24px;
        }
        
        .filter-option {
            display: flex;
            align-items: center;
            padding: 6px 0;
            cursor: pointer;
        }
        
        .filter-option input[type="checkbox"] {
            margin-right: 8px;
        }
        
        .filter-option label {
            cursor: pointer;
            font-size: 14px;
        }
        
        /* 响应式设计 */
        @media (max-width: 768px) {
            .container {
                flex-direction: column;
            }
            
            .sidebar {
                width: 100%;
                border-right: none;
                border-bottom: 1px solid #e5e5e7;
            }
            
            .task-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- 侧边栏筛选器 -->
        <aside class="sidebar">
            <h3>状态筛选</h3>
            <div class="filter-group" id="statusFilters">
                <div class="filter-option">
                    <input type="checkbox" id="status-notstarted" checked>
                    <label for="status-notstarted">🔵 未开始</label>
                </div>
                <div class="filter-option">
                    <input type="checkbox" id="status-inprogress" checked>
                    <label for="status-inprogress">🟡 进行中</label>
                </div>
                <div class="filter-option">
                    <input type="checkbox" id="status-completed">
                    <label for="status-completed">🟢 已完成</label>
                </div>
            </div>
            
            <h3>类型筛选</h3>
            <div class="filter-group" id="typeFilters">
                <div class="filter-option">
                    <input type="checkbox" id="type-goal" checked>
                    <label for="type-goal">🎯 目标</label>
                </div>
                <div class="filter-option">
                    <input type="checkbox" id="type-project" checked>
                    <label for="type-project">📁 项目</label>
                </div>
                <div class="filter-option">
                    <input type="checkbox" id="type-task" checked>
                    <label for="type-task">📋 任务</label>
                </div>
                <div class="filter-option">
                    <input type="checkbox" id="type-action" checked>
                    <label for="type-action">⚡ 动作</label>
                </div>
            </div>
            
            <h3>优先级筛选</h3>
            <div class="filter-group" id="priorityFilters">
                <div class="filter-option">
                    <input type="checkbox" id="priority-high" checked>
                    <label for="priority-high">🔴 高优先级</label>
                </div>
                <div class="filter-option">
                    <input type="checkbox" id="priority-medium" checked>
                    <label for="priority-medium">🟡 中优先级</label>
                </div>
                <div class="filter-option">
                    <input type="checkbox" id="priority-low" checked>
                    <label for="priority-low">🟢 低优先级</label>
                </div>
            </div>
        </aside>
        
        <!-- 主内容区 -->
        <main class="main-content">
            <!-- 工具栏 -->
            <div class="toolbar">
                <h1>今日任务看板</h1>
                <div class="toolbar-actions">
                    <button class="btn btn-primary" onclick="refreshTasks()">
                        🔄 刷新
                    </button>
                </div>
            </div>
            
            <!-- 任务显示区域 -->
            <div id="taskContainer">
                <!-- 初始加载状态 -->
                <div class="loading">
                    <div class="loading-spinner"></div>
                    <p>正在加载任务...</p>
                </div>
            </div>
        </main>
    </div>
    
    <script>
        // ==================== 全局变量 ====================
        
        /**
         * 所有任务数据
         * @type {Array<Object>}
         */
        let allTasks = [];
        
        /**
         * 当前筛选器状态
         * @type {Object}
         */
        const filters = {
            statuses: new Set(['未开始', '进行中']),
            types: new Set(['目标', '项目', '任务', '动作']),
            priorities: new Set(['高', '中', '低'])
        };
        
        // ==================== 初始化 ====================
        
        /**
         * 页面加载完成后初始化
         */
        document.addEventListener('DOMContentLoaded', function() {
            console.log('页面加载完成，开始初始化');
            
            // 初始化筛选器事件
            initializeFilters();
            
            // 监听任务数据
            bridge.on('tasks', handleTasksReceived);
            
            // 请求任务数据
            requestTasks();
        });
        
        /**
         * 初始化筛选器事件监听
         */
        function initializeFilters() {
            // 监听所有筛选器复选框的变化
            document.querySelectorAll('.filter-option input[type="checkbox"]').forEach(checkbox => {
                checkbox.addEventListener('change', handleFilterChange);
            });
        }
        
        /**
         * 处理筛选器变化
         * @param {Event} event - 变化事件
         */
        function handleFilterChange(event) {
            const checkbox = event.target;
            const filterId = checkbox.id;
            
            // 解析筛选器类型和值
            const [filterType, filterValue] = filterId.split('-');
            
            // 映射筛选器值到中文
            const valueMap = {
                'notstarted': '未开始',
                'inprogress': '进行中',
                'completed': '已完成',
                'goal': '目标',
                'project': '项目',
                'task': '任务',
                'action': '动作',
                'high': '高',
                'medium': '中',
                'low': '低'
            };
            
            const actualValue = valueMap[filterValue] || filterValue;
            
            // 更新筛选器状态
            switch (filterType) {
                case 'status':
                    if (checkbox.checked) {
                        filters.statuses.add(actualValue);
                    } else {
                        filters.statuses.delete(actualValue);
                    }
                    break;
                case 'type':
                    if (checkbox.checked) {
                        filters.types.add(actualValue);
                    } else {
                        filters.types.delete(actualValue);
                    }
                    break;
                case 'priority':
                    if (checkbox.checked) {
                        filters.priorities.add(actualValue);
                    } else {
                        filters.priorities.delete(actualValue);
                    }
                    break;
            }
            
            // 重新渲染任务
            renderTasks();
        }
        
        // ==================== 数据处理 ====================
        
        /**
         * 请求任务数据
         */
        function requestTasks() {
            console.log('请求任务数据');
            bridge.send('requestTasks', { 
                date: new Date().toISOString().split('T')[0] 
            });
        }
        
        /**
         * 刷新任务
         */
        function refreshTasks() {
            // 显示加载状态
            showLoading();
            
            // 请求最新数据
            requestTasks();
        }
        
        /**
         * 处理接收到的任务数据
         * @param {Array<Object>} tasks - 任务数组
         */
        function handleTasksReceived(tasks) {
            console.log('收到任务数据：', tasks);
            
            // 保存任务数据
            allTasks = tasks;
            
            // 渲染任务
            renderTasks();
        }
        
        /**
         * 根据筛选器过滤任务
         * @param {Array<Object>} tasks - 原始任务数组
         * @returns {Array<Object>} 过滤后的任务数组
         */
        function filterTasks(tasks) {
            return tasks.filter(task => {
                // 检查状态
                if (!filters.statuses.has(task.status)) {
                    return false;
                }
                
                // 检查类型
                if (!filters.types.has(task.type)) {
                    return false;
                }
                
                // 检查优先级
                const priority = task.priority || '低';
                if (!filters.priorities.has(priority)) {
                    return false;
                }
                
                return true;
            });
        }
        
        // ==================== UI 渲染 ====================
        
        /**
         * 渲染任务列表
         */
        function renderTasks() {
            const container = document.getElementById('taskContainer');
            
            // 过滤任务
            const filteredTasks = filterTasks(allTasks);
            
            // 检查是否有任务
            if (filteredTasks.length === 0) {
                showEmptyState();
                return;
            }
            
            // 创建任务网格
            const grid = document.createElement('div');
            grid.className = 'task-grid';
            
            // 渲染每个任务
            filteredTasks.forEach(task => {
                const card = createTaskCard(task);
                grid.appendChild(card);
            });
            
            // 更新容器
            container.innerHTML = '';
            container.appendChild(grid);
        }
        
        /**
         * 创建任务卡片
         * @param {Object} task - 任务数据
         * @returns {HTMLElement} 任务卡片元素
         */
        function createTaskCard(task) {
            const card = document.createElement('div');
            card.className = 'task-card';
            card.dataset.taskId = task.id;
            
            // 任务头部
            const header = document.createElement('div');
            header.className = 'task-header';
            
            // 任务类型标签
            const typeLabel = document.createElement('span');
            typeLabel.className = `task-type type-${task.type}`;
            typeLabel.textContent = task.type;
            
            // 状态图标
            const statusIcon = getStatusIcon(task.status);
            
            header.appendChild(typeLabel);
            header.appendChild(document.createTextNode(statusIcon));
            
            // 任务标题
            const title = document.createElement('div');
            title.className = 'task-title';
            title.textContent = task.title;
            
            // 任务元信息
            const meta = document.createElement('div');
            meta.className = 'task-meta';
            
            // 优先级
            if (task.priority) {
                const priority = document.createElement('span');
                priority.textContent = getPriorityIcon(task.priority) + ' ' + task.priority;
                meta.appendChild(priority);
            }
            
            // 计划时间
            if (task.plannedTime) {
                const time = document.createElement('span');
                time.textContent = '⏱ ' + task.plannedTime;
                meta.appendChild(time);
            }
            
            // 进度
            if (task.progress !== undefined) {
                const progress = document.createElement('span');
                progress.textContent = '📊 ' + task.progress + '%';
                meta.appendChild(progress);
            }
            
            // 操作按钮
            const actions = document.createElement('div');
            actions.className = 'task-actions';
            
            // 更新状态按钮
            const statusButton = document.createElement('button');
            statusButton.className = 'task-action';
            statusButton.textContent = getNextStatusText(task.status);
            statusButton.onclick = (e) => {
                e.stopPropagation();
                updateTaskStatus(task.id, getNextStatus(task.status));
            };
            
            // 启动任务按钮
            const launchButton = document.createElement('button');
            launchButton.className = 'task-action';
            launchButton.textContent = '🚀 启动';
            launchButton.onclick = (e) => {
                e.stopPropagation();
                launchTask(task.id);
            };
            
            actions.appendChild(statusButton);
            actions.appendChild(launchButton);
            
            // 组装卡片
            card.appendChild(header);
            card.appendChild(title);
            if (meta.children.length > 0) {
                card.appendChild(meta);
            }
            card.appendChild(actions);
            
            // 点击卡片查看详情
            card.onclick = () => viewTaskDetail(task.id);
            
            return card;
        }
        
        /**
         * 显示加载状态
         */
        function showLoading() {
            const container = document.getElementById('taskContainer');
            container.innerHTML = `
                <div class="loading">
                    <div class="loading-spinner"></div>
                    <p>正在加载任务...</p>
                </div>
            `;
        }
        
        /**
         * 显示空状态
         */
        function showEmptyState() {
            const container = document.getElementById('taskContainer');
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <h2>没有找到任务</h2>
                    <p>尝试调整筛选条件或添加新任务</p>
                </div>
            `;
        }
        
        // ==================== 任务操作 ====================
        
        /**
         * 更新任务状态
         * @param {string} taskId - 任务 ID
         * @param {string} newStatus - 新状态
         */
        function updateTaskStatus(taskId, newStatus) {
            console.log('更新任务状态：', taskId, newStatus);
            
            // 乐观更新 UI
            const task = allTasks.find(t => t.id === taskId);
            if (task) {
                task.status = newStatus;
                renderTasks();
            }
            
            // 发送到插件
            bridge.send('updateTaskStatus', {
                taskId: taskId,
                status: newStatus
            });
        }
        
        /**
         * 启动任务
         * @param {string} taskId - 任务 ID
         */
        function launchTask(taskId) {
            console.log('启动任务：', taskId);
            bridge.send('launchTask', { taskId: taskId });
        }
        
        /**
         * 查看任务详情
         * @param {string} taskId - 任务 ID
         */
        function viewTaskDetail(taskId) {
            console.log('查看任务详情：', taskId);
            bridge.send('viewTaskDetail', { taskId: taskId });
        }
        
        // ==================== 工具函数 ====================
        
        /**
         * 获取状态图标
         * @param {string} status - 任务状态
         * @returns {string} 状态图标
         */
        function getStatusIcon(status) {
            const icons = {
                '未开始': '🔵',
                '进行中': '🟡',
                '已完成': '🟢'
            };
            return icons[status] || '⚪';
        }
        
        /**
         * 获取优先级图标
         * @param {string} priority - 优先级
         * @returns {string} 优先级图标
         */
        function getPriorityIcon(priority) {
            const icons = {
                '高': '🔴',
                '中': '🟡',
                '低': '🟢'
            };
            return icons[priority] || '⚪';
        }
        
        /**
         * 获取下一个状态
         * @param {string} currentStatus - 当前状态
         * @returns {string} 下一个状态
         */
        function getNextStatus(currentStatus) {
            const statusFlow = {
                '未开始': '进行中',
                '进行中': '已完成',
                '已完成': '未开始'
            };
            return statusFlow[currentStatus] || '未开始';
        }
        
        /**
         * 获取下一个状态的按钮文本
         * @param {string} currentStatus - 当前状态
         * @returns {string} 按钮文本
         */
        function getNextStatusText(currentStatus) {
            const texts = {
                '未开始': '▶️ 开始',
                '进行中': '✅ 完成',
                '已完成': '🔄 重置'
            };
            return texts[currentStatus] || '更新状态';
        }
    </script>
</body>
</html>
```

### 4.5 插件端实现

在 `settingController.js` 中添加处理代码：

```javascript
/**
 * 处理今日看板的 URL Scheme 请求
 * @memberof taskSettingController
 * @param {string} url - 完整的 URL
 * @returns {boolean} 是否处理了该请求
 * 
 * @example
 * // URL 格式：mntask://command?param1=value1&param2=value2
 * // 示例：mntask://updateTaskStatus?taskId=12345&status=已完成
 */
taskSettingController.prototype.handleTodayBoardProtocol = function(url) {
    // 检查是否是我们的协议
    if (!url.startsWith('mntask://')) {
        return false;
    }
    
    try {
        // 解析 URL
        const urlObj = new URL(url.replace('mntask://', 'http://'));
        const command = urlObj.pathname.substring(1); // 移除开头的 /
        const params = Object.fromEntries(urlObj.searchParams);
        
        console.log(`处理命令：${command}`, params);
        
        // 根据命令执行不同操作
        switch (command) {
            case 'ready':
                // 页面已准备就绪，发送初始数据
                this.sendInitialData();
                break;
                
            case 'requestTasks':
                // 请求任务数据
                this.sendTasksToWebView();
                break;
                
            case 'updateTaskStatus':
                // 更新任务状态
                this.updateTaskStatus(params.taskId, params.status);
                break;
                
            case 'launchTask':
                // 启动任务
                this.launchTask(params.taskId);
                break;
                
            case 'viewTaskDetail':
                // 查看任务详情
                this.viewTaskDetail(params.taskId);
                break;
                
            default:
                console.log(`未知命令：${command}`);
                return false;
        }
        
        return true;
    } catch (error) {
        console.error('解析 URL 失败：', error);
        return false;
    }
}

/**
 * 发送任务数据到 WebView
 * @memberof taskSettingController
 */
taskSettingController.prototype.sendTasksToWebView = function() {
    try {
        // 获取今日任务
        const tasks = MNTaskManager.filterTodayTasks();
        
        // 转换为适合显示的格式
        const displayTasks = tasks.map(task => {
            const taskInfo = MNTaskManager.parseTaskTitle(task.noteTitle);
            
            return {
                id: task.noteId,
                title: taskInfo.content || task.noteTitle,
                type: taskInfo.type || '任务',
                status: taskInfo.status || '未开始',
                priority: MNTaskManager.getTaskPriority(task) || '低',
                plannedTime: MNTaskManager.getPlannedTime(task),
                progress: MNTaskManager.getTaskProgress(task) || 0,
                // ... 其他字段
            };
        });
        
        // 发送到 WebView
        const jsonData = JSON.stringify(displayTasks);
        const script = `receiveFromPlugin('tasks', '${jsonData.replace(/'/g, "\\'")}')`;
        
        this.todayBoardWebView.evaluateJavaScript(script, (result) => {
            console.log('任务数据已发送到 WebView');
        });
    } catch (error) {
        console.error('发送任务数据失败：', error);
    }
}
```

---

## 第五章：调试技巧

### 5.1 日志系统

创建统一的日志系统帮助调试：

```javascript
/**
 * 日志管理器
 * @class Logger
 */
class Logger {
    constructor(prefix = '[MNTask]') {
        this.prefix = prefix;
        this.enabled = true;
        this.logToPlugin = true;
    }
    
    log(message, ...args) {
        if (!this.enabled) return;
        
        const timestamp = new Date().toLocaleTimeString();
        const fullMessage = `${this.prefix} ${timestamp} - ${message}`;
        
        console.log(fullMessage, ...args);
        
        // 同时发送到插件端记录
        if (this.logToPlugin && window.bridge) {
            window.bridge.send('log', { 
                level: 'info', 
                message: fullMessage,
                data: args 
            });
        }
    }
    
    error(message, error) {
        const timestamp = new Date().toLocaleTimeString();
        const fullMessage = `${this.prefix} ${timestamp} - ERROR: ${message}`;
        
        console.error(fullMessage, error);
        
        if (this.logToPlugin && window.bridge) {
            window.bridge.send('log', { 
                level: 'error', 
                message: fullMessage,
                error: error.message,
                stack: error.stack 
            });
        }
    }
}

const logger = new Logger('[TodayBoard]');
```

### 5.2 常见问题

#### 问题 1：WebView 中的 JavaScript 没有执行

**症状：**
- 调用函数后没有反应
- Console 没有输出

**解决方法：**
1. 检查 WebView 是否已加载完成
2. 确保 JavaScript 语法正确
3. 使用 try-catch 捕获错误

```javascript
// 安全的 JavaScript 执行
const script = `
    try {
        ${yourCode}
    } catch (error) {
        console.error('执行错误：', error);
        'error:' + error.message; // 返回错误信息
    }
`;
```

#### 问题 2：数据传递失败

**症状：**
- 网页收不到数据
- 数据格式错误

**解决方法：**
1. 检查编码是否正确
2. 验证 JSON 格式
3. 注意引号转义

```javascript
// 正确的数据传递
const data = { name: "测试", value: 123 };
const jsonStr = JSON.stringify(data);
// 转义单引号
const escaped = jsonStr.replace(/'/g, "\\'");
const script = `receiveData('${escaped}')`;
```

#### 问题 3：URL Scheme 不触发

**症状：**
- 设置 location.href 后没反应
- 插件没有收到请求

**解决方法：**
1. 确保 URL 格式正确
2. 检查是否返回了 false
3. 添加日志确认

### 5.3 性能优化

#### 1. 减少 DOM 操作

```javascript
// 不好的做法：频繁操作 DOM
tasks.forEach(task => {
    container.innerHTML += createTaskHTML(task);
});

// 好的做法：批量更新
const html = tasks.map(task => createTaskHTML(task)).join('');
container.innerHTML = html;
```

#### 2. 使用虚拟列表

当任务数量很多时，只渲染可见区域的任务：

```javascript
class VirtualList {
    constructor(container, itemHeight, renderItem) {
        this.container = container;
        this.itemHeight = itemHeight;
        this.renderItem = renderItem;
        this.items = [];
        
        // 监听滚动
        container.addEventListener('scroll', () => this.render());
    }
    
    setItems(items) {
        this.items = items;
        this.render();
    }
    
    render() {
        const scrollTop = this.container.scrollTop;
        const containerHeight = this.container.clientHeight;
        
        // 计算可见范围
        const startIndex = Math.floor(scrollTop / this.itemHeight);
        const endIndex = Math.ceil((scrollTop + containerHeight) / this.itemHeight);
        
        // 只渲染可见项
        const visibleItems = this.items.slice(startIndex, endIndex);
        
        // ... 渲染逻辑
    }
}
```

#### 3. 防抖和节流

```javascript
// 防抖：用于搜索输入
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 使用
const search = debounce((query) => {
    bridge.send('search', { query });
}, 300);

// 节流：用于滚动事件
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
```

---

## 附录：API 参考

### URL Scheme 协议

| 命令 | 参数 | 说明 | 示例 |
|------|------|------|------|
| ready | 无 | 页面加载完成 | `mntask://ready` |
| requestTasks | date | 请求任务数据 | `mntask://requestTasks?date=2025-01-12` |
| updateTaskStatus | taskId, status | 更新任务状态 | `mntask://updateTaskStatus?taskId=123&status=已完成` |
| launchTask | taskId | 启动任务 | `mntask://launchTask?taskId=123` |
| viewTaskDetail | taskId | 查看任务详情 | `mntask://viewTaskDetail?taskId=123` |

### JavaScript 接口

#### 接收数据

```javascript
/**
 * 接收来自插件的数据
 * @global
 * @param {string} type - 数据类型
 * @param {string} jsonData - JSON 格式的数据
 */
function receiveFromPlugin(type, jsonData) {
    // 由 bridge 自动处理
}
```

#### Bridge API

```javascript
// 发送命令
bridge.send(command, data);

// 监听数据
bridge.on(type, handler);

// 取消监听
const unsubscribe = bridge.on(type, handler);
unsubscribe();
```

### 数据结构

#### 任务对象

```typescript
interface Task {
    id: string;           // 任务 ID
    title: string;        // 任务标题
    type: string;         // 类型：目标/项目/任务/动作
    status: string;       // 状态：未开始/进行中/已完成
    priority?: string;    // 优先级：高/中/低
    plannedTime?: string; // 计划时间
    progress?: number;    // 进度百分比
    dueDate?: string;     // 截止日期
    tags?: string[];      // 标签列表
}
```

---

## 结语

恭喜你完成了这个教程！你已经学会了：

1. ✅ WebView 的基本概念
2. ✅ 网页与插件的通信机制
3. ✅ 创建功能完整的任务看板
4. ✅ 调试和优化技巧

### 下一步

1. **扩展功能**：添加拖拽排序、批量操作等
2. **美化界面**：使用现代 CSS 框架
3. **提升性能**：实现增量更新、缓存机制
4. **分享经验**：将你的插件分享给社区

### 获取帮助

- 查看示例代码：`/mntask/examples/`
- 阅读 API 文档：本文档的 API 参考章节
- 社区讨论：MarginNote 中文论坛

祝你开发愉快！🎉