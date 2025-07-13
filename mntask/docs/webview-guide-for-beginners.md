# 🌟 零基础学会 MNTask 插件开发 - 超详细新手教程

> 👋 嗨！欢迎来到插件开发的世界！如果你完全没有编程经验，不用担心，这个教程就是为你准备的。我会像朋友聊天一样，一步一步带你学会插件开发。

## 📚 目录

- [第0章：开始之前的准备](#第0章开始之前的准备)
- [第1章：插件到底是什么？](#第1章插件到底是什么)
- [第2章：认识 HTML - 你的第一个网页](#第2章认识-html---你的第一个网页)
- [第3章：让网页动起来 - JavaScript 入门](#第3章让网页动起来---javascript-入门)
- [第4章：插件和网页如何"聊天"](#第4章插件和网页如何聊天)
- [第5章：做个计数器 - 第一个交互功能](#第5章做个计数器---第一个交互功能)
- [第6章：一步步做任务看板](#第6章一步步做任务看板)
- [第7章：遇到问题怎么办](#第7章遇到问题怎么办)
- [第8章：进阶技巧 - 让你的插件更专业](#第8章进阶技巧---让你的插件更专业)

---

## 第0章：开始之前的准备

### 你需要准备什么？

1. **一台电脑**（Mac 或 Windows 都可以）
2. **MarginNote 4**（已安装）
3. **一个文本编辑器**（推荐使用免费的 Visual Studio Code）
4. **耐心和好奇心**（最重要！）

### 安装文本编辑器

1. 打开浏览器，搜索"Visual Studio Code"
2. 进入官网下载并安装
3. 安装完成后打开它

就像 Word 用来写文档，VS Code 是用来写代码的"Word"。

### 创建你的工作文件夹

1. 在桌面创建一个文件夹，命名为"我的插件练习"
2. 用 VS Code 打开这个文件夹（File → Open Folder）

准备工作完成！让我们开始学习吧！

---

## 第1章：插件到底是什么？

### 用最简单的话解释

想象一下：
- **MarginNote** 就像是一栋大楼 🏢
- **插件** 就像是你在大楼里租的一个房间 🏠
- **网页** 就像是你房间里的装修 🎨

插件可以：
- 📝 读取和修改你的笔记
- 🎯 添加新的功能
- 🎨 显示漂亮的界面

### 插件的组成部分

一个插件就像一个汉堡包 🍔：

```
🍞 上层面包 = 配置文件（告诉 MarginNote 这是什么插件）
🥬 生菜     = JavaScript 文件（插件的"大脑"）
🍖 肉饼     = HTML 文件（插件的"脸面"）
🍞 下层面包 = 其他资源文件（图片、样式等）
```

### 为什么需要 WebView？

还记得我们说插件是一个房间吗？WebView 就是房间里的一扇特殊的窗户：

```
普通的插件界面：
┌─────────────┐
│ [按钮] [按钮] │  ← 只能显示简单的按钮
│ [输入框]     │  ← 样式有限
└─────────────┘

有了 WebView：
┌─────────────┐
│ ╔═════════╗ │
│ ║ 🎨 漂亮  ║ │  ← 可以显示网页
│ ║ 的界面   ║ │  ← 想怎么设计就怎么设计
│ ╚═════════╝ │
└─────────────┘
```

---

## 第2章：认识 HTML - 你的第一个网页

### 什么是 HTML？

HTML 就像是搭积木，每个积木块都有自己的作用：

- `<h1>` = 大标题积木
- `<p>` = 段落积木  
- `<button>` = 按钮积木
- `<div>` = 容器积木（用来装其他积木）

### 动手做：你的第一个网页

1. 在 VS Code 中创建新文件，命名为 `my-first-page.html`
2. 输入以下代码（可以直接复制）：

```html
<!DOCTYPE html>
<html>
<head>
    <title>我的第一个网页</title>
</head>
<body>
    <h1>你好，世界！</h1>
    <p>这是我做的第一个网页。</p>
    <button>点我试试</button>
</body>
</html>
```

3. 保存文件（Ctrl+S 或 Cmd+S）
4. 在文件夹中找到这个文件，双击用浏览器打开

🎉 恭喜！你刚刚创建了第一个网页！

### 理解每一行代码

让我们像剥洋葱一样，一层层理解这些代码：

```html
<!DOCTYPE html>        <!-- 告诉浏览器：这是一个 HTML 文件 -->
<html>                 <!-- HTML 的开始，就像书的封面 -->
<head>                 <!-- 头部：放一些"幕后"信息 -->
    <title>我的第一个网页</title>  <!-- 网页标题，显示在浏览器标签上 -->
</head>                <!-- 头部结束 -->
<body>                 <!-- 身体：放所有看得见的内容 -->
    <h1>你好，世界！</h1>        <!-- 大标题 -->
    <p>这是我做的第一个网页。</p>  <!-- 段落 -->
    <button>点我试试</button>    <!-- 按钮 -->
</body>                <!-- 身体结束 -->
</html>                <!-- HTML 的结束，就像书的封底 -->
```

### 练习：修改你的网页

试着做以下修改，每次修改后保存并刷新浏览器查看效果：

1. **改标题**：把"你好，世界！"改成你的名字
2. **加段落**：在按钮前面再加一个 `<p>` 段落
3. **加按钮**：再加一个按钮，文字改成"第二个按钮"

### 让网页更漂亮

现在网页很朴素，让我们加点"化妆品"（CSS样式）：

```html
<!DOCTYPE html>
<html>
<head>
    <title>我的第一个网页</title>
    <style>
        /* 这里是 CSS，用来美化网页 */
        body {
            background-color: #f0f0f0;  /* 背景色：浅灰色 */
            font-family: Arial;         /* 字体 */
            padding: 20px;              /* 内边距 */
        }
        
        h1 {
            color: #333;                /* 标题颜色：深灰色 */
        }
        
        button {
            background-color: #4CAF50;  /* 按钮背景：绿色 */
            color: white;               /* 按钮文字：白色 */
            padding: 10px 20px;         /* 按钮内边距 */
            border: none;               /* 去掉边框 */
            border-radius: 5px;         /* 圆角 */
            cursor: pointer;            /* 鼠标变手型 */
        }
        
        button:hover {
            background-color: #45a049;  /* 鼠标悬停时的颜色 */
        }
    </style>
</head>
<body>
    <h1>你好，世界！</h1>
    <p>这是我做的第一个网页。</p>
    <button>点我试试</button>
</body>
</html>
```

保存并刷新，是不是漂亮多了？

---

## 第3章：让网页动起来 - JavaScript 入门

### 什么是 JavaScript？

如果说：
- HTML 是网页的**骨架** 🦴
- CSS 是网页的**衣服** 👔
- JavaScript 就是网页的**大脑** 🧠

JavaScript 让网页能够响应你的操作！

### 让按钮真的能点击

修改你的网页，加入 JavaScript：

```html
<!DOCTYPE html>
<html>
<head>
    <title>会动的网页</title>
    <style>
        body {
            background-color: #f0f0f0;
            font-family: Arial;
            padding: 20px;
            text-align: center;
        }
        
        button {
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin: 5px;
            font-size: 16px;
        }
        
        button:hover {
            background-color: #45a049;
        }
        
        #message {
            margin-top: 20px;
            font-size: 20px;
            color: #333;
        }
    </style>
</head>
<body>
    <h1>JavaScript 练习</h1>
    <p>点击下面的按钮试试看！</p>
    
    <button onclick="sayHello()">说你好</button>
    <button onclick="changeColor()">变颜色</button>
    <button onclick="showTime()">显示时间</button>
    
    <div id="message">这里会显示消息</div>
    
    <script>
        // 这是 JavaScript 代码区域
        
        // 函数1：说你好
        function sayHello() {
            // 找到显示消息的地方，改变它的内容
            document.getElementById('message').innerHTML = '你好！很高兴见到你！😊';
        }
        
        // 函数2：改变颜色
        function changeColor() {
            // 生成随机颜色
            const colors = ['red', 'blue', 'green', 'orange', 'purple'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            
            // 改变消息的颜色
            document.getElementById('message').style.color = randomColor;
            document.getElementById('message').innerHTML = '我变成' + randomColor + '色了！';
        }
        
        // 函数3：显示时间
        function showTime() {
            // 获取当前时间
            const now = new Date();
            const timeString = now.toLocaleTimeString('zh-CN');
            
            // 显示时间
            document.getElementById('message').innerHTML = '现在是：' + timeString;
        }
    </script>
</body>
</html>
```

### 理解 JavaScript 的工作原理

让我们用餐厅来比喻：

1. **HTML** = 餐厅的桌椅（结构）
2. **用户点击** = 顾客点菜
3. **onclick** = 服务员（连接顾客和厨房）
4. **function** = 厨师（执行具体操作）
5. **getElementById** = 找到指定的餐桌
6. **innerHTML** = 上菜

流程是这样的：
```
顾客点击按钮 → 触发 onclick → 调用 function → 执行代码 → 更新页面
```

### 练习：添加更多功能

试着自己添加一个新按钮和功能：

```javascript
// 函数4：计数器
let count = 0;  // 创建一个变量存储数字

function addCount() {
    count = count + 1;  // 数字加1
    document.getElementById('message').innerHTML = '你已经点击了 ' + count + ' 次';
}
```

别忘了在 HTML 中加上按钮：
```html
<button onclick="addCount()">点击计数</button>
```

---

## 第4章：插件和网页如何"聊天"

### 理解通信原理

还记得我们说插件是房间，WebView 是窗户吗？现在我们要学习如何通过窗户传递消息。

想象这个场景：
- 你在**房间里**（插件）📦
- 朋友在**窗外**（网页）🌐
- 你们需要**传纸条**（数据）📨

有两种传纸条的方式：

#### 方式1：从网页到插件（扔纸团）

```
网页说："嘿，插件！用户点了这个按钮！"
     ↓
使用特殊的网址（URL Scheme）
     ↓
插件收到消息，执行操作
```

#### 方式2：从插件到网页（用喇叭喊）

```
插件说："网页，这里有新数据要显示！"
     ↓
执行 JavaScript 代码
     ↓
网页更新显示
```

### 实际的代码是什么样的？

#### 网页发消息给插件：

```javascript
// 在网页中
function tellPlugin(message) {
    // 使用特殊的网址格式
    window.location.href = 'mntask://hello?message=' + message;
}
```

这就像在窗户上贴了一张纸条，插件会看到并处理。

#### 插件发消息给网页：

```javascript
// 在插件中（这部分我们后面会详细讲）
webView.evaluateJavaScript('showMessage("来自插件的问候")');
```

这就像用喇叭对着窗户喊话，网页会听到并执行。

### 做个简单的通信示例

创建文件 `communication-test.html`：

```html
<!DOCTYPE html>
<html>
<head>
    <title>通信测试</title>
    <style>
        body {
            font-family: Arial;
            padding: 20px;
            text-align: center;
        }
        
        .container {
            max-width: 500px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        button {
            background-color: #007aff;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            cursor: pointer;
            margin: 10px;
        }
        
        button:hover {
            background-color: #0051d5;
        }
        
        .message-box {
            margin-top: 20px;
            padding: 15px;
            background-color: #f0f0f0;
            border-radius: 8px;
            min-height: 50px;
        }
        
        .log {
            text-align: left;
            margin-top: 20px;
            padding: 10px;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            max-height: 200px;
            overflow-y: auto;
        }
        
        .log-entry {
            margin: 5px 0;
            padding: 5px;
            background-color: white;
            border-radius: 3px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📡 通信测试页面</h1>
        <p>这个页面演示网页如何与插件通信</p>
        
        <h3>1. 发送消息到插件</h3>
        <button onclick="sendToPlugin('打招呼')">👋 打招呼</button>
        <button onclick="sendToPlugin('请求数据')">📊 请求数据</button>
        <button onclick="sendToPlugin('保存设置')">💾 保存设置</button>
        
        <h3>2. 接收插件的消息</h3>
        <div class="message-box" id="messageBox">
            等待插件的消息...
        </div>
        
        <h3>3. 通信日志</h3>
        <div class="log" id="log"></div>
    </div>
    
    <script>
        // 添加日志的函数
        function addLog(message, type = 'info') {
            const log = document.getElementById('log');
            const time = new Date().toLocaleTimeString();
            const entry = document.createElement('div');
            entry.className = 'log-entry';
            
            // 根据类型选择图标
            const icon = type === 'send' ? '📤' : '📥';
            
            entry.innerHTML = `${icon} [${time}] ${message}`;
            log.appendChild(entry);
            
            // 自动滚动到底部
            log.scrollTop = log.scrollHeight;
        }
        
        // 发送消息到插件
        function sendToPlugin(action) {
            // 记录日志
            addLog(`发送消息: ${action}`, 'send');
            
            // 构造特殊的 URL
            const url = `mntask://${action}?time=${Date.now()}`;
            
            // 发送（在真实插件中，这会被插件拦截）
            window.location.href = url;
            
            // 模拟效果（仅用于演示）
            setTimeout(() => {
                simulatePluginResponse(action);
            }, 1000);
        }
        
        // 接收插件的消息
        function receiveFromPlugin(message) {
            // 记录日志
            addLog(`收到消息: ${message}`, 'receive');
            
            // 更新显示
            const messageBox = document.getElementById('messageBox');
            messageBox.innerHTML = `✅ 收到插件消息：<br><strong>${message}</strong>`;
        }
        
        // 模拟插件响应（仅用于演示）
        function simulatePluginResponse(action) {
            let response = '';
            
            switch(action) {
                case '打招呼':
                    response = '你好！我是插件，很高兴认识你！';
                    break;
                case '请求数据':
                    response = '这是任务数据：[任务1, 任务2, 任务3]';
                    break;
                case '保存设置':
                    response = '设置已保存成功！';
                    break;
            }
            
            receiveFromPlugin(response);
        }
        
        // 页面加载完成
        window.onload = function() {
            addLog('页面加载完成，准备通信', 'info');
        };
    </script>
</body>
</html>
```

### 通信流程详解

让我们把通信过程分解成慢动作：

**步骤1：用户点击按钮**
```
用户点击 [打招呼] 按钮
     ↓
触发 onclick="sendToPlugin('打招呼')"
```

**步骤2：构造特殊 URL**
```javascript
const url = `mntask://打招呼?time=${Date.now()}`;
// 结果类似：mntask://打招呼?time=1641234567890
```

**步骤3：发送 URL**
```javascript
window.location.href = url;
// 浏览器尝试"访问"这个特殊地址
```

**步骤4：插件拦截**
```
插件发现 URL 以 "mntask://" 开头
     ↓
知道这是给自己的消息
     ↓
解析内容并处理
```

**步骤5：插件回复**
```javascript
// 插件执行 JavaScript
webView.evaluateJavaScript('receiveFromPlugin("你好！")');
```

**步骤6：网页更新**
```
网页的 receiveFromPlugin 函数被调用
     ↓
更新页面显示
```

---

## 第5章：做个计数器 - 第一个交互功能

现在我们要做一个真正能用的功能：计数器。这个计数器的特别之处是，数字保存在插件中，网页只负责显示。

### 需求分析

我们要做什么：
1. 显示一个数字（开始是0）
2. 点击"加1"按钮，数字增加
3. 点击"减1"按钮，数字减少
4. 点击"重置"按钮，数字归零
5. **重要**：数字保存在插件中，刷新页面后还在

### 第一步：创建网页界面

创建文件 `counter.html`：

```html
<!DOCTYPE html>
<html>
<head>
    <title>我的计数器</title>
    <style>
        body {
            font-family: Arial;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background-color: #f0f0f0;
        }
        
        .counter-container {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            text-align: center;
        }
        
        h1 {
            color: #333;
            margin-bottom: 30px;
        }
        
        .number-display {
            font-size: 72px;
            font-weight: bold;
            color: #007aff;
            margin: 30px 0;
            min-height: 100px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .button-group {
            display: flex;
            gap: 10px;
            justify-content: center;
        }
        
        button {
            padding: 15px 30px;
            font-size: 18px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .btn-add {
            background-color: #4CAF50;
            color: white;
        }
        
        .btn-add:hover {
            background-color: #45a049;
            transform: translateY(-2px);
        }
        
        .btn-subtract {
            background-color: #f44336;
            color: white;
        }
        
        .btn-subtract:hover {
            background-color: #da190b;
            transform: translateY(-2px);
        }
        
        .btn-reset {
            background-color: #ff9800;
            color: white;
        }
        
        .btn-reset:hover {
            background-color: #e68900;
            transform: translateY(-2px);
        }
        
        .status {
            margin-top: 20px;
            padding: 10px;
            background-color: #e8f5e9;
            border-radius: 5px;
            color: #2e7d32;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="counter-container">
        <h1>🔢 超级计数器</h1>
        
        <div class="number-display" id="number">
            0
        </div>
        
        <div class="button-group">
            <button class="btn-subtract" onclick="subtract()">➖ 减一</button>
            <button class="btn-reset" onclick="reset()">🔄 重置</button>
            <button class="btn-add" onclick="add()">➕ 加一</button>
        </div>
        
        <div class="status" id="status">
            准备就绪
        </div>
    </div>
    
    <script>
        // ==================== 状态管理 ====================
        let currentNumber = 0;  // 当前显示的数字
        
        // ==================== 显示更新 ====================
        
        // 更新数字显示
        function updateDisplay(number) {
            currentNumber = number;
            document.getElementById('number').textContent = number;
            
            // 添加动画效果
            const display = document.getElementById('number');
            display.style.transform = 'scale(1.2)';
            setTimeout(() => {
                display.style.transform = 'scale(1)';
            }, 200);
        }
        
        // 更新状态信息
        function updateStatus(message) {
            const status = document.getElementById('status');
            status.textContent = message;
            
            // 短暂高亮
            status.style.backgroundColor = '#ffeb3b';
            setTimeout(() => {
                status.style.backgroundColor = '#e8f5e9';
            }, 500);
        }
        
        // ==================== 与插件通信 ====================
        
        // 发送命令到插件
        function sendCommand(command, value = null) {
            // 构造 URL
            let url = `mntask://counter/${command}`;
            if (value !== null) {
                url += `?value=${value}`;
            }
            
            // 记录操作
            console.log('发送命令:', url);
            updateStatus(`发送命令: ${command}`);
            
            // 发送
            window.location.href = url;
        }
        
        // 接收插件的数据
        function receiveData(data) {
            console.log('收到数据:', data);
            
            if (data.number !== undefined) {
                updateDisplay(data.number);
                updateStatus('数据已更新');
            }
            
            if (data.message) {
                updateStatus(data.message);
            }
        }
        
        // ==================== 按钮操作 ====================
        
        // 加一
        function add() {
            sendCommand('add');
        }
        
        // 减一
        function subtract() {
            sendCommand('subtract');
        }
        
        // 重置
        function reset() {
            if (confirm('确定要重置为0吗？')) {
                sendCommand('reset');
            }
        }
        
        // ==================== 初始化 ====================
        
        // 页面加载完成后
        window.onload = function() {
            console.log('计数器页面加载完成');
            updateStatus('正在连接插件...');
            
            // 请求初始数据
            setTimeout(() => {
                sendCommand('getData');
            }, 100);
        };
        
        // ==================== 插件会调用的函数 ====================
        
        // 这个函数会被插件调用来更新数字
        window.updateCounter = function(number) {
            updateDisplay(number);
            updateStatus('计数器已更新');
        };
        
        // 这个函数会被插件调用来发送完整数据
        window.setCounterData = function(jsonString) {
            try {
                const data = JSON.parse(jsonString);
                receiveData(data);
            } catch (error) {
                console.error('解析数据失败:', error);
                updateStatus('数据格式错误');
            }
        };
    </script>
</body>
</html>
```

### 第二步：理解数据流

让我们画个图来理解数据是如何流动的：

```
用户点击 [加一] 按钮
    ↓
网页：sendCommand('add')
    ↓
发送 URL: mntask://counter/add
    ↓
插件：收到命令
    ↓
插件：当前数字 + 1
    ↓
插件：保存新数字
    ↓
插件：调用 updateCounter(新数字)
    ↓
网页：更新显示
```

### 第三步：插件端需要做什么

虽然我们现在还不能真正编写插件代码，但了解插件需要做什么很重要：

```javascript
// 插件端的伪代码（仅供理解）

// 1. 保存数字的地方
let counterValue = 0;

// 2. 处理网页发来的命令
function handleCommand(command) {
    switch(command) {
        case 'add':
            counterValue += 1;
            updateWebView(counterValue);
            break;
            
        case 'subtract':
            counterValue -= 1;
            updateWebView(counterValue);
            break;
            
        case 'reset':
            counterValue = 0;
            updateWebView(counterValue);
            break;
            
        case 'getData':
            updateWebView(counterValue);
            break;
    }
}

// 3. 更新网页显示
function updateWebView(number) {
    webView.evaluateJavaScript(`updateCounter(${number})`);
}
```

### 第四步：测试和调试

1. **在浏览器中测试**
   - 打开 `counter.html`
   - 打开开发者工具（F12）
   - 查看 Console 标签
   - 点击按钮，观察日志

2. **模拟插件响应**
   
   在浏览器的控制台中输入：
   ```javascript
   // 模拟插件更新数字
   updateCounter(42);
   
   // 模拟插件发送完整数据
   setCounterData('{"number": 100, "message": "来自插件的数据"}');
   ```

3. **常见问题排查**
   - 如果按钮没反应：检查 onclick 是否正确
   - 如果样式不对：检查 CSS 类名是否匹配
   - 如果控制台报错：查看错误信息，通常会指出哪一行

---

## 第6章：一步步做任务看板

现在我们要做一个真正的任务看板！我们会把它分解成20个小步骤，每一步都很简单。

### 总体规划

我们要做的任务看板包含：
1. 任务列表显示
2. 任务筛选功能
3. 添加新任务
4. 更新任务状态
5. 删除任务

### 步骤1：创建基础HTML结构

创建文件 `task-board.html`：

```html
<!DOCTYPE html>
<html>
<head>
    <title>任务看板</title>
    <meta charset="UTF-8">
    <style>
        /* 基础样式 */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, Arial, sans-serif;
            background-color: #f5f5f5;
            color: #333;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        h1 {
            text-align: center;
            color: #2c3e50;
            margin-bottom: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📋 我的任务看板</h1>
    </div>
</body>
</html>
```

保存并在浏览器中打开，你应该看到一个标题。

### 步骤2：添加任务卡片的HTML

在 `<h1>` 标签后添加：

```html
<!-- 任务列表容器 -->
<div class="task-list" id="taskList">
    <!-- 示例任务卡片 -->
    <div class="task-card">
        <div class="task-header">
            <span class="task-type">任务</span>
            <span class="task-status">未开始</span>
        </div>
        <h3 class="task-title">学习JavaScript</h3>
        <p class="task-description">完成第5章的所有练习</p>
        <div class="task-footer">
            <button class="btn btn-start">开始</button>
            <button class="btn btn-delete">删除</button>
        </div>
    </div>
</div>
```

### 步骤3：美化任务卡片

在 `<style>` 标签中添加：

```css
/* 任务列表样式 */
.task-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 20px;
}

/* 任务卡片样式 */
.task-card {
    background: white;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    transition: transform 0.2s, box-shadow 0.2s;
}

.task-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 20px rgba(0,0,0,0.15);
}

/* 任务头部 */
.task-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.task-type {
    background-color: #3498db;
    color: white;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
}

.task-status {
    font-size: 12px;
    color: #7f8c8d;
}

/* 任务标题 */
.task-title {
    margin-bottom: 10px;
    color: #2c3e50;
}

/* 任务描述 */
.task-description {
    color: #7f8c8d;
    font-size: 14px;
    margin-bottom: 15px;
}

/* 任务底部 */
.task-footer {
    display: flex;
    gap: 10px;
}

/* 按钮样式 */
.btn {
    padding: 8px 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s;
}

.btn-start {
    background-color: #2ecc71;
    color: white;
}

.btn-start:hover {
    background-color: #27ae60;
}

.btn-delete {
    background-color: #e74c3c;
    color: white;
}

.btn-delete:hover {
    background-color: #c0392b;
}
```

刷新页面，你应该看到一个漂亮的任务卡片！

### 步骤4：创建任务数据结构

在 `</body>` 标签前添加 `<script>` 标签：

```html
<script>
// ==================== 数据管理 ====================

// 任务数据数组
let tasks = [
    {
        id: 1,
        type: '任务',
        title: '学习JavaScript',
        description: '完成第5章的所有练习',
        status: '未开始',
        createdAt: new Date().toISOString()
    },
    {
        id: 2,
        type: '项目',
        title: '个人网站',
        description: '设计并开发个人作品展示网站',
        status: '进行中',
        createdAt: new Date().toISOString()
    },
    {
        id: 3,
        type: '目标',
        title: '掌握前端开发',
        description: '在6个月内成为合格的前端开发者',
        status: '进行中',
        createdAt: new Date().toISOString()
    }
];

// 打印任务数据（用于调试）
console.log('任务数据:', tasks);
</script>
```

### 步骤5：动态渲染任务列表

继续在 `<script>` 中添加：

```javascript
// ==================== 渲染功能 ====================

// 渲染单个任务卡片
function createTaskCard(task) {
    // 根据状态决定按钮文字
    let buttonText = '开始';
    let buttonClass = 'btn-start';
    
    if (task.status === '进行中') {
        buttonText = '完成';
        buttonClass = 'btn-complete';
    } else if (task.status === '已完成') {
        buttonText = '重做';
        buttonClass = 'btn-redo';
    }
    
    // 根据类型决定颜色
    const typeColors = {
        '任务': '#3498db',
        '项目': '#9b59b6',
        '目标': '#e67e22'
    };
    
    const typeColor = typeColors[task.type] || '#95a5a6';
    
    // 创建HTML
    return `
        <div class="task-card" data-task-id="${task.id}">
            <div class="task-header">
                <span class="task-type" style="background-color: ${typeColor}">${task.type}</span>
                <span class="task-status">${task.status}</span>
            </div>
            <h3 class="task-title">${task.title}</h3>
            <p class="task-description">${task.description}</p>
            <div class="task-footer">
                <button class="btn ${buttonClass}" onclick="updateTaskStatus(${task.id})">
                    ${buttonText}
                </button>
                <button class="btn btn-delete" onclick="deleteTask(${task.id})">
                    删除
                </button>
            </div>
        </div>
    `;
}

// 渲染所有任务
function renderTasks() {
    const taskList = document.getElementById('taskList');
    
    // 清空现有内容
    taskList.innerHTML = '';
    
    // 如果没有任务，显示提示
    if (tasks.length === 0) {
        taskList.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #7f8c8d;">
                <p style="font-size: 48px;">📭</p>
                <p>还没有任务，点击上方按钮添加第一个任务吧！</p>
            </div>
        `;
        return;
    }
    
    // 渲染每个任务
    tasks.forEach(task => {
        taskList.innerHTML += createTaskCard(task);
    });
}

// 页面加载完成后渲染任务
window.onload = function() {
    renderTasks();
};
</script>
```

在 `<style>` 中添加新的按钮样式：

```css
.btn-complete {
    background-color: #f39c12;
    color: white;
}

.btn-complete:hover {
    background-color: #e67e22;
}

.btn-redo {
    background-color: #95a5a6;
    color: white;
}

.btn-redo:hover {
    background-color: #7f8c8d;
}
```

### 步骤6：实现状态更新功能

在 `<script>` 中添加：

```javascript
// ==================== 任务操作 ====================

// 更新任务状态
function updateTaskStatus(taskId) {
    // 找到对应的任务
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    // 更新状态（状态流转）
    if (task.status === '未开始') {
        task.status = '进行中';
    } else if (task.status === '进行中') {
        task.status = '已完成';
    } else if (task.status === '已完成') {
        task.status = '未开始';
    }
    
    // 重新渲染
    renderTasks();
    
    // 显示提示
    showMessage(`任务"${task.title}"状态已更新为：${task.status}`);
}

// 删除任务
function deleteTask(taskId) {
    // 确认删除
    if (!confirm('确定要删除这个任务吗？')) {
        return;
    }
    
    // 找到任务的索引
    const index = tasks.findIndex(t => t.id === taskId);
    if (index === -1) return;
    
    // 保存任务标题用于提示
    const taskTitle = tasks[index].title;
    
    // 删除任务
    tasks.splice(index, 1);
    
    // 重新渲染
    renderTasks();
    
    // 显示提示
    showMessage(`任务"${taskTitle}"已删除`);
}

// 显示提示消息
function showMessage(message) {
    // 创建提示元素
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    // 添加到页面
    document.body.appendChild(toast);
    
    // 3秒后自动消失
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}
</script>
```

在 `<style>` 中添加提示样式：

```css
/* 提示消息样式 */
.toast {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #2c3e50;
    color: white;
    padding: 15px 25px;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    animation: slideIn 0.3s ease;
}

.toast.fade-out {
    animation: fadeOut 0.3s ease;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes fadeOut {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}
```

### 步骤7：添加新任务功能

在 `<h1>` 标签后添加：

```html
<!-- 添加任务按钮 -->
<div class="toolbar">
    <button class="btn btn-primary" onclick="showAddTaskForm()">
        ➕ 添加新任务
    </button>
</div>

<!-- 添加任务表单（默认隐藏） -->
<div class="modal" id="addTaskModal" style="display: none;">
    <div class="modal-content">
        <h2>添加新任务</h2>
        
        <div class="form-group">
            <label>任务类型</label>
            <select id="taskType">
                <option value="任务">任务</option>
                <option value="项目">项目</option>
                <option value="目标">目标</option>
            </select>
        </div>
        
        <div class="form-group">
            <label>任务标题</label>
            <input type="text" id="taskTitle" placeholder="输入任务标题">
        </div>
        
        <div class="form-group">
            <label>任务描述</label>
            <textarea id="taskDescription" placeholder="输入任务描述"></textarea>
        </div>
        
        <div class="form-buttons">
            <button class="btn btn-primary" onclick="addTask()">添加</button>
            <button class="btn btn-cancel" onclick="hideAddTaskForm()">取消</button>
        </div>
    </div>
</div>
```

添加相关样式：

```css
/* 工具栏样式 */
.toolbar {
    text-align: center;
    margin-bottom: 20px;
}

.btn-primary {
    background-color: #3498db;
    color: white;
    font-size: 16px;
    padding: 10px 20px;
}

.btn-primary:hover {
    background-color: #2980b9;
}

/* 模态框样式 */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 30px;
    border-radius: 10px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 5px 30px rgba(0,0,0,0.3);
}

.modal-content h2 {
    margin-bottom: 20px;
    color: #2c3e50;
}

/* 表单样式 */
.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    color: #555;
    font-weight: bold;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 14px;
}

.form-group textarea {
    min-height: 80px;
    resize: vertical;
}

.form-buttons {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 20px;
}

.btn-cancel {
    background-color: #95a5a6;
    color: white;
}

.btn-cancel:hover {
    background-color: #7f8c8d;
}
```

添加 JavaScript 功能：

```javascript
// ==================== 添加任务功能 ====================

// 显示添加任务表单
function showAddTaskForm() {
    document.getElementById('addTaskModal').style.display = 'flex';
    // 聚焦到标题输入框
    document.getElementById('taskTitle').focus();
}

// 隐藏添加任务表单
function hideAddTaskForm() {
    document.getElementById('addTaskModal').style.display = 'none';
    // 清空表单
    document.getElementById('taskType').value = '任务';
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDescription').value = '';
}

// 添加新任务
function addTask() {
    // 获取表单数据
    const type = document.getElementById('taskType').value;
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    
    // 验证
    if (!title) {
        alert('请输入任务标题！');
        document.getElementById('taskTitle').focus();
        return;
    }
    
    // 创建新任务
    const newTask = {
        id: Date.now(), // 使用时间戳作为ID
        type: type,
        title: title,
        description: description || '暂无描述',
        status: '未开始',
        createdAt: new Date().toISOString()
    };
    
    // 添加到任务数组
    tasks.unshift(newTask); // 添加到开头
    
    // 重新渲染
    renderTasks();
    
    // 隐藏表单
    hideAddTaskForm();
    
    // 显示提示
    showMessage(`任务"${title}"已添加`);
}

// 点击模态框背景关闭
document.getElementById('addTaskModal').addEventListener('click', function(e) {
    if (e.target === this) {
        hideAddTaskForm();
    }
});
```

### 步骤8：添加筛选功能

在工具栏中添加筛选器：

```html
<!-- 修改工具栏 -->
<div class="toolbar">
    <button class="btn btn-primary" onclick="showAddTaskForm()">
        ➕ 添加新任务
    </button>
    
    <div class="filters">
        <label>筛选：</label>
        <select id="filterStatus" onchange="filterTasks()">
            <option value="all">所有状态</option>
            <option value="未开始">未开始</option>
            <option value="进行中">进行中</option>
            <option value="已完成">已完成</option>
        </select>
        
        <select id="filterType" onchange="filterTasks()">
            <option value="all">所有类型</option>
            <option value="任务">任务</option>
            <option value="项目">项目</option>
            <option value="目标">目标</option>
        </select>
    </div>
</div>
```

添加筛选器样式：

```css
/* 更新工具栏样式 */
.toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 10px;
}

.filters {
    display: flex;
    align-items: center;
    gap: 10px;
}

.filters label {
    font-weight: bold;
    color: #555;
}

.filters select {
    padding: 8px 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
}
```

添加筛选功能：

```javascript
// ==================== 筛选功能 ====================

// 保存原始任务列表
let allTasks = [...tasks];

// 筛选任务
function filterTasks() {
    const statusFilter = document.getElementById('filterStatus').value;
    const typeFilter = document.getElementById('filterType').value;
    
    // 从原始列表开始筛选
    let filteredTasks = [...allTasks];
    
    // 按状态筛选
    if (statusFilter !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.status === statusFilter);
    }
    
    // 按类型筛选
    if (typeFilter !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.type === typeFilter);
    }
    
    // 更新当前显示的任务
    tasks = filteredTasks;
    
    // 重新渲染
    renderTasks();
    
    // 显示筛选结果统计
    const message = `找到 ${tasks.length} 个任务`;
    showMessage(message);
}

// 修改添加任务函数，同时更新原始列表
function addTask() {
    // ... 原有代码 ...
    
    // 添加到任务数组
    tasks.unshift(newTask);
    allTasks.unshift(newTask); // 同时添加到原始列表
    
    // ... 其余代码 ...
}

// 修改删除任务函数
function deleteTask(taskId) {
    // ... 原有代码 ...
    
    // 删除任务
    tasks.splice(index, 1);
    
    // 同时从原始列表删除
    const allIndex = allTasks.findIndex(t => t.id === taskId);
    if (allIndex !== -1) {
        allTasks.splice(allIndex, 1);
    }
    
    // ... 其余代码 ...
}
```

### 步骤9：添加数据持久化

添加保存和加载功能：

```javascript
// ==================== 数据持久化 ====================

// 保存任务到本地存储
function saveTasks() {
    try {
        localStorage.setItem('mntask_tasks', JSON.stringify(allTasks));
        console.log('任务已保存到本地');
    } catch (error) {
        console.error('保存任务失败:', error);
    }
}

// 从本地存储加载任务
function loadTasks() {
    try {
        const saved = localStorage.getItem('mntask_tasks');
        if (saved) {
            allTasks = JSON.parse(saved);
            tasks = [...allTasks];
            console.log('已加载保存的任务');
        }
    } catch (error) {
        console.error('加载任务失败:', error);
    }
}

// 修改所有会改变数据的函数，添加保存功能
const originalUpdateStatus = updateTaskStatus;
updateTaskStatus = function(taskId) {
    originalUpdateStatus(taskId);
    saveTasks();
};

const originalDeleteTask = deleteTask;
deleteTask = function(taskId) {
    originalDeleteTask(taskId);
    saveTasks();
};

const originalAddTask = addTask;
addTask = function() {
    originalAddTask();
    saveTasks();
};

// 修改页面加载事件
window.onload = function() {
    loadTasks(); // 先加载保存的任务
    renderTasks();
};
```

### 步骤10：与插件通信

现在让我们把这个看板连接到插件：

```javascript
// ==================== 插件通信 ====================

// 发送消息到插件
function sendToPlugin(action, data = {}) {
    const message = {
        action: action,
        data: data,
        timestamp: Date.now()
    };
    
    const url = `mntask://taskboard?message=${encodeURIComponent(JSON.stringify(message))}`;
    console.log('发送到插件:', message);
    window.location.href = url;
}

// 接收插件的数据
window.receiveFromPlugin = function(action, jsonData) {
    console.log('收到插件消息:', action, jsonData);
    
    try {
        const data = JSON.parse(jsonData);
        
        switch(action) {
            case 'loadTasks':
                // 加载插件提供的任务
                allTasks = data.tasks || [];
                tasks = [...allTasks];
                renderTasks();
                showMessage('任务已从插件加载');
                break;
                
            case 'taskUpdated':
                // 任务已在插件端更新
                showMessage(data.message || '任务已更新');
                break;
                
            default:
                console.log('未知的操作:', action);
        }
    } catch (error) {
        console.error('处理插件数据失败:', error);
    }
};

// 页面加载时请求插件数据
window.onload = function() {
    // 先尝试加载本地数据
    loadTasks();
    renderTasks();
    
    // 然后请求插件数据
    setTimeout(() => {
        sendToPlugin('requestTasks');
    }, 100);
};

// 修改数据操作函数，同步到插件
updateTaskStatus = function(taskId) {
    originalUpdateStatus(taskId);
    saveTasks();
    
    // 同步到插件
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        sendToPlugin('updateTask', task);
    }
};
```

### 完整的任务看板

恭喜！你现在有了一个功能完整的任务看板，它包含：

1. ✅ 显示任务列表
2. ✅ 添加新任务
3. ✅ 更新任务状态
4. ✅ 删除任务
5. ✅ 筛选功能
6. ✅ 数据持久化
7. ✅ 与插件通信

### 测试你的看板

1. **基础功能测试**
   - 添加几个不同类型的任务
   - 点击按钮改变状态
   - 删除任务
   - 刷新页面，检查任务是否还在

2. **筛选测试**
   - 选择不同的状态筛选
   - 选择不同的类型筛选
   - 组合筛选

3. **通信测试**
   - 打开控制台查看日志
   - 观察发送到插件的消息

---

## 第7章：遇到问题怎么办

### 常见问题和解决方法

#### 问题1：点击按钮没反应

**可能原因：**
1. 函数名拼写错误
2. 忘记添加 onclick
3. JavaScript 有语法错误

**解决步骤：**
1. 打开浏览器控制台（F12）
2. 看是否有红色错误信息
3. 检查函数名是否一致
4. 在函数开头加 `console.log('函数被调用')` 测试

#### 问题2：样式不生效

**可能原因：**
1. CSS 选择器写错
2. 样式被覆盖
3. 忘记保存文件

**解决步骤：**
1. 检查类名是否匹配
2. 在浏览器中右键 → 检查元素
3. 查看样式面板，看样式是否被划掉

#### 问题3：数据丢失

**可能原因：**
1. 没有调用保存函数
2. 浏览器不支持 localStorage
3. 数据格式错误

**解决步骤：**
1. 在控制台输入 `localStorage.getItem('mntask_tasks')` 查看
2. 确保每次修改后都调用 `saveTasks()`
3. 使用 try-catch 捕获错误

### 调试技巧

#### 1. 使用 console.log

在关键位置添加日志：

```javascript
function updateTaskStatus(taskId) {
    console.log('开始更新任务状态, ID:', taskId);
    
    const task = tasks.find(t => t.id === taskId);
    console.log('找到的任务:', task);
    
    if (!task) {
        console.log('任务不存在！');
        return;
    }
    
    // ... 其他代码
}
```

#### 2. 使用断点调试

1. 打开开发者工具
2. 切换到 Sources 标签
3. 找到你的 HTML 文件
4. 在行号上点击设置断点
5. 刷新页面，代码会在断点处暂停

#### 3. 检查网络请求

1. 切换到 Network 标签
2. 点击按钮触发请求
3. 查看是否有 `mntask://` 的请求
4. 这能帮你确认是否正确发送到插件

### 获取帮助

如果遇到解决不了的问题：

1. **先自己尝试**
   - Google 错误信息
   - 查看相似的代码示例
   - 逐步简化代码找出问题

2. **准备问题描述**
   - 我想做什么？
   - 我试了什么？
   - 出现了什么错误？
   - 我的代码是什么？

3. **寻求帮助**
   - MarginNote 论坛
   - 相关的开发者社区
   - GitHub Issues

### 学习资源

1. **基础知识**
   - MDN Web Docs（最权威的 Web 技术文档）
   - W3Schools（适合初学者）
   - 菜鸟教程（中文）

2. **视频教程**
   - YouTube 上搜索 "HTML CSS JavaScript 入门"
   - B站上的前端教程

3. **实践项目**
   - CodePen（在线代码编辑器）
   - JSFiddle（JavaScript 测试）

---

## 第8章：进阶技巧 - 让你的插件更专业

> 💡 恭喜你走到这里！现在让我们学习一些来自成熟插件的高级技巧，让你的代码更加专业和稳定。

### 🚨 必须掌握的技巧1：处理 iPad 上的特殊问题

还记得我们说插件会调用网页的函数吗？在 iPad 上，有一个特殊的"坑"需要注意。

#### 什么是 NSNull 问题？

想象这样一个场景：
- 在 Mac 上：插件问网页"1+1等于几？"，网页回答"2" ✅
- 在 iPad 上：插件问同样的问题，网页可能回答"[空白]" 😱

这个"空白"就是 NSNull，它会导致你的代码出错！

#### 解决方案：给插件端的代码加上"保护罩"

```javascript
// 插件端的代码（了解即可，将来会用到）

// ❌ 危险的做法
webView.evaluateJavaScript(script, (result) => {
    // 在 iPad 上可能出错！
    if (result.startsWith('success')) {  // 💥 崩溃！
        console.log('成功了');
    }
});

// ✅ 安全的做法
webView.evaluateJavaScript(script, (result) => {
    // 先检查是不是 NSNull
    if (result === null || result === undefined || isNSNull(result)) {
        console.log('结果为空');
        return;
    }
    
    // 确保是字符串再使用字符串方法
    if (typeof result === 'string' && result.startsWith('success')) {
        console.log('成功了');
    }
});

// 检查 NSNull 的方法
function isNSNull(obj) {
    // 这是 MarginNote 插件特有的检查方式
    return (obj === NSNull.new());
}
```

#### 💡 为什么要知道这个？

虽然你现在主要写网页代码，但了解这个问题能帮你：
1. 理解为什么有时候插件没反应
2. 将来写插件代码时避免踩坑
3. 调试问题时知道可能的原因

### ⚡ 技巧2：让网页和插件通信更可靠

#### 问题：网页还没准备好

有时候插件想和网页"说话"，但网页还在"睡觉"（加载中）：

```javascript
// 在网页中添加"我准备好了"的信号
window.onload = function() {
    console.log('页面加载完成');
    
    // 告诉插件：我准备好了！
    window.pageReady = true;  // 设置标记
    
    // 主动通知插件
    window.location.href = 'mntask://pageReady';
};

// 插件要调用的函数都放在全局
window.receiveData = function(data) {
    // 处理数据
};
```

#### 技巧：使用延迟和重试

```javascript
// 网页端：确保消息能被收到
function sendToPlugin(command, data) {
    const message = {
        command: command,
        data: data,
        timestamp: Date.now()
    };
    
    // 第一次尝试
    const url = `mntask://message?data=${encodeURIComponent(JSON.stringify(message))}`;
    window.location.href = url;
    
    // 如果特别重要，可以重试
    if (command === 'important') {
        setTimeout(() => {
            console.log('重试发送消息');
            window.location.href = url;
        }, 500);
    }
}
```

### 🎯 技巧3：优雅的错误处理

#### 原则：永远不要让错误"炸掉"你的程序

```javascript
// ❌ 危险：一个错误就崩溃
function processData(jsonString) {
    const data = JSON.parse(jsonString);  // 如果不是 JSON 就崩溃
    updateDisplay(data);
}

// ✅ 安全：优雅地处理错误
function processData(jsonString) {
    try {
        // 可能出错的代码都放在 try 里
        const data = JSON.parse(jsonString);
        
        // 检查数据是否有效
        if (!data || typeof data !== 'object') {
            throw new Error('数据格式不正确');
        }
        
        updateDisplay(data);
        return { success: true };
        
    } catch (error) {
        // 出错了也不怕
        console.error('处理数据出错:', error.message);
        
        // 显示友好的错误提示
        showMessage('数据处理失败，请重试');
        
        return { success: false, error: error.message };
    }
}
```

### 🚀 技巧4：性能优化小窍门

#### 1. 批量更新，不要一个个改

```javascript
// ❌ 慢：改100次页面
for (let i = 0; i < 100; i++) {
    document.getElementById('list').innerHTML += `<li>项目 ${i}</li>`;
}

// ✅ 快：只改1次页面
let html = '';
for (let i = 0; i < 100; i++) {
    html += `<li>项目 ${i}</li>`;
}
document.getElementById('list').innerHTML = html;
```

#### 2. 防止频繁触发

用户快速点击按钮时，不要每次都执行：

```javascript
// 防抖函数：停止操作后才执行
let timer = null;
function searchWithDebounce(keyword) {
    // 取消之前的定时器
    if (timer) {
        clearTimeout(timer);
    }
    
    // 等待 300 毫秒
    timer = setTimeout(() => {
        // 真正执行搜索
        doSearch(keyword);
    }, 300);
}

// 用户输入时调用
document.getElementById('searchInput').oninput = function() {
    searchWithDebounce(this.value);
};
```

### 💾 技巧5：数据安全保存

#### 问题：localStorage 可能失败

```javascript
// ✅ 安全的保存方式
function saveData(key, data) {
    try {
        // 检查是否支持
        if (typeof(Storage) === "undefined") {
            console.warn('浏览器不支持 localStorage');
            return false;
        }
        
        // 转换为字符串
        const jsonString = JSON.stringify(data);
        
        // 检查大小（localStorage 通常限制 5-10MB）
        if (jsonString.length > 1024 * 1024 * 4) {  // 4MB
            console.warn('数据太大，可能保存失败');
        }
        
        // 保存
        localStorage.setItem(key, jsonString);
        return true;
        
    } catch (error) {
        console.error('保存失败:', error);
        
        // 可能是空间不足
        if (error.name === 'QuotaExceededError') {
            showMessage('存储空间不足，请清理一些数据');
        }
        
        return false;
    }
}

// 安全的读取方式
function loadData(key, defaultValue = null) {
    try {
        const jsonString = localStorage.getItem(key);
        if (!jsonString) {
            return defaultValue;
        }
        
        return JSON.parse(jsonString);
        
    } catch (error) {
        console.error('读取数据失败:', error);
        return defaultValue;
    }
}
```

### 🎨 技巧6：让界面更流畅

#### 使用 CSS 动画而不是 JavaScript

```css
/* 定义过渡效果 */
.task-card {
    transition: all 0.3s ease;
}

.task-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 20px rgba(0,0,0,0.2);
}

/* 淡入效果 */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.new-item {
    animation: fadeIn 0.5s ease;
}
```

#### 使用 CSS 类而不是直接改样式

```javascript
// ❌ 不好：直接改样式
element.style.backgroundColor = 'red';
element.style.color = 'white';
element.style.padding = '10px';

// ✅ 好：使用 CSS 类
element.classList.add('error-state');

// 在 CSS 中定义
.error-state {
    background-color: red;
    color: white;
    padding: 10px;
}
```

### 🔧 技巧7：调试的专业方法

#### 1. 使用 console 的各种方法

```javascript
// 不只是 console.log！
console.log('普通信息');
console.warn('警告信息');  // 黄色
console.error('错误信息'); // 红色

// 分组显示
console.group('用户信息');
console.log('名字:', user.name);
console.log('年龄:', user.age);
console.log('爱好:', user.hobbies);
console.groupEnd();

// 表格显示
const users = [
    { name: '张三', age: 20 },
    { name: '李四', age: 25 }
];
console.table(users);

// 计时
console.time('数据处理');
processLargeData();
console.timeEnd('数据处理');  // 显示用时
```

#### 2. 添加调试模式

```javascript
// 在开发时打开，发布时关闭
const DEBUG = true;

function debugLog(...args) {
    if (DEBUG) {
        console.log('[调试]', ...args);
    }
}

// 使用
debugLog('当前状态:', state);
debugLog('收到数据:', data);
```

### 💡 小结：从新手到专业

掌握这些技巧后，你的代码会：
- **更稳定**：不会因为小错误崩溃
- **更快速**：优化后运行更流畅
- **更专业**：符合行业最佳实践
- **更易维护**：出问题容易定位和修复

记住：
> 这些技巧不是一次就能掌握的，慢慢来！
> 
> 先让代码能跑，再让代码跑得好。
> 
> 每个高手都是从不断踩坑中成长起来的！

---

## 🎉 恭喜你！

你已经完成了这个教程！现在你已经掌握了：

1. ✅ HTML 基础 - 网页的结构
2. ✅ CSS 基础 - 网页的样式
3. ✅ JavaScript 基础 - 网页的交互
4. ✅ 插件通信原理 - 网页与插件的对话
5. ✅ 实战项目 - 完整的任务看板

### 下一步

1. **继续改进你的看板**
   - 添加拖拽排序
   - 添加任务优先级
   - 添加截止日期
   - 美化界面设计

2. **学习更多技术**
   - 学习 Vue.js 或 React
   - 了解数据库知识
   - 学习 Node.js

3. **分享你的作品**
   - 把代码上传到 GitHub
   - 写博客分享经验
   - 帮助其他新手

记住：编程是一项需要不断练习的技能。每天写一点代码，你会越来越熟练！

祝你在编程之路上越走越远！🚀

---

## 附录：快速参考

### HTML 标签速查

```html
<h1>~<h6>  标题
<p>        段落
<div>      容器
<span>     行内容器
<button>   按钮
<input>    输入框
<select>   下拉框
<ul><li>   无序列表
<ol><li>   有序列表
```

### CSS 属性速查

```css
color: 文字颜色
background-color: 背景色
font-size: 字体大小
margin: 外边距
padding: 内边距
border: 边框
display: 显示方式
position: 定位方式
```

### JavaScript 基础语法

```javascript
// 变量
let name = '张三';
const age = 18;

// 函数
function sayHello(name) {
    return '你好，' + name;
}

// 条件
if (age >= 18) {
    console.log('成年人');
} else {
    console.log('未成年');
}

// 循环
for (let i = 0; i < 10; i++) {
    console.log(i);
}

// 数组方法
array.push()    // 添加
array.pop()     // 删除最后一个
array.find()    // 查找
array.filter()  // 筛选
array.map()     // 转换
```

---

💡 **最后的建议**：保持好奇心，享受创造的乐趣！编程就像搭积木，一块一块地构建你的数字世界。加油！