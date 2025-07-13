# 🌟 MarginNote WebView 最佳实践指南

> 💡 这份指南总结了从 mnbrowser、mnai、mnutils 三个成熟插件中提取的 WebView 处理精华，帮助你避免踩坑，写出更好的代码。

## 📚 目录

1. [WebView 创建的正确姿势](#webview-创建的正确姿势)
2. [网页加载的三种方式](#网页加载的三种方式)
3. [JavaScript 执行与 NSNull 问题](#javascript-执行与-nsnull-问题)
4. [插件与网页通信的标准做法](#插件与网页通信的标准做法)
5. [性能优化技巧](#性能优化技巧)
6. [常见坑点与解决方案](#常见坑点与解决方案)
7. [实战代码模板](#实战代码模板)

---

## WebView 创建的正确姿势

### 🎯 基础创建模式

```javascript
// ✅ 正确的创建方式（参考 mnai）
createWebView() {
    // 1. 创建 WebView
    this.webView = new UIWebView({
        x: 0,
        y: 0,
        width: this.view.bounds.width,
        height: this.view.bounds.height
    });
    
    // 2. 基础设置
    this.webView.backgroundColor = UIColor.whiteColor();
    this.webView.opaque = false;  // 支持透明
    this.webView.scalesPageToFit = false;  // 禁止缩放
    
    // 3. 自动调整大小（重要！）
    this.webView.autoresizingMask = (1 << 1 | 1 << 4);
    // 1 << 1: UIViewAutoresizingFlexibleWidth
    // 1 << 4: UIViewAutoresizingFlexibleHeight
    
    // 4. 设置委托
    this.webView.delegate = this;
    
    // 5. 美化外观
    this.webView.layer.cornerRadius = 8;
    this.webView.layer.masksToBounds = true;
    
    // 6. 禁用弹性滚动（可选）
    this.webView.scrollView.bounces = false;
    
    // 7. 添加到视图
    this.view.addSubview(this.webView);
}
```

### 💡 为什么这样做？

- **autoresizingMask**：让 WebView 自动适应容器大小变化（比如旋转屏幕）
- **delegate 设置**：必须设置才能拦截 URL、处理加载事件
- **圆角和遮罩**：让界面更美观，符合 iOS 设计规范
- **禁用弹性滚动**：避免内容过度滚动的橡皮筋效果

---

## 网页加载的三种方式

### 方式1：加载本地 HTML 文件（推荐）

```javascript
// ✅ 最佳实践（来自 mnutils）
loadLocalHTML() {
    const htmlPath = this.pluginPath + '/index.html';
    
    // 使用 loadFileURLAllowingReadAccessToURL
    // 第一个参数：HTML 文件路径
    // 第二个参数：允许访问的目录（通常是插件目录）
    this.webView.loadFileURLAllowingReadAccessToURL(
        NSURL.fileURLWithPath(htmlPath),
        NSURL.fileURLWithPath(this.pluginPath)
    );
}
```

### 方式2：加载 HTML 字符串

```javascript
// 适用于动态生成的内容（参考 mnbrowser）
loadHTMLString() {
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { 
                    font-family: -apple-system, sans-serif;
                    padding: 20px;
                }
            </style>
        </head>
        <body>
            <h1>动态内容</h1>
            <div id="content">${this.generateContent()}</div>
        </body>
        </html>
    `;
    
    // baseURL 很重要！决定了相对路径的解析基准
    const baseURL = NSURL.fileURLWithPath(this.pluginPath);
    this.webView.loadHTMLStringBaseURL(html, baseURL);
}
```

### 方式3：加载网络 URL

```javascript
// 适用于在线内容（参考 mnbrowser）
loadWebPage(url) {
    // 创建请求
    const request = NSMutableURLRequest.requestWithURL(NSURL.URLWithString(url));
    
    // 设置 User-Agent（可选）
    const userAgent = this.isMobile ? 
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)" :
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6)";
    request.setValueForHTTPHeaderField(userAgent, "User-Agent");
    
    // 加载请求
    this.webView.loadRequest(request);
}
```

### 🎯 使用场景对比

| 方式 | 使用场景 | 优点 | 缺点 |
|------|---------|------|------|
| loadFileURL | 插件自带界面 | 可访问本地资源、安全 | 需要预先准备文件 |
| loadHTMLString | 动态生成内容 | 灵活、无需文件 | 不能直接加载本地资源 |
| loadRequest | 在线内容 | 可访问网络资源 | 需要网络、有安全限制 |

---

## JavaScript 执行与 NSNull 问题

### 🚨 必须知道的坑：NSNull

在 iPad 上，`evaluateJavaScript` 可能返回 NSNull 而不是预期的结果！

```javascript
// ❌ 错误做法
this.webView.evaluateJavaScript(script, (result) => {
    // iPad 上可能崩溃！
    if (result.startsWith('error:')) {
        console.error('出错了');
    }
});

// ✅ 正确做法（参考 mnai 和 mnutils）
runJavaScript(script) {
    return new Promise((resolve, reject) => {
        this.webView.evaluateJavaScript(script, (result) => {
            // 关键：检查 NSNull
            if (this.isNSNull(result)) {
                resolve(undefined);  // 或者 resolve('')
                return;
            }
            
            // 安全地处理结果
            if (typeof result === 'string') {
                resolve(result);
            } else {
                resolve(String(result));
            }
        });
    });
}

// NSNull 检测方法
isNSNull(obj) {
    return (obj === NSNull.new());
}
```

### 💡 延迟执行技巧

有时网页还没准备好，需要延迟执行：

```javascript
// 方法1：使用 setTimeout（参考 mnbrowser）
async executeDelayed(script, delay = 100) {
    await this.delay(delay);
    return await this.runJavaScript(script);
}

// 方法2：等待页面 ready
async waitForPageReady() {
    const checkScript = `
        (function() {
            if (document.readyState === 'complete' && 
                typeof window.myApp !== 'undefined') {
                return 'ready';
            }
            return 'loading';
        })()
    `;
    
    let attempts = 0;
    while (attempts < 30) {  // 最多等待 3 秒
        const status = await this.runJavaScript(checkScript);
        if (status === 'ready') {
            return true;
        }
        await this.delay(100);
        attempts++;
    }
    return false;
}

// 工具方法：延迟
delay(seconds) {
    return new Promise(resolve => {
        NSTimer.scheduledTimerWithTimeInterval(seconds, false, resolve);
    });
}
```

---

## 插件与网页通信的标准做法

### 📤 网页 → 插件（URL Scheme）

```javascript
// 在 WebView delegate 中拦截
webViewShouldStartLoadWithRequestNavigationType(webView, request, type) {
    const url = request.URL().absoluteString();
    
    // 方案1：简单命令（参考 mnai）
    if (url.startsWith('mntask://copy?')) {
        const content = this.getURLParameter(url, 'content');
        const text = decodeURIComponent(content);
        MNUtil.copy(text);
        return false;  // 阻止加载
    }
    
    // 方案2：复杂数据（参考 mntask）
    if (url.startsWith('mntask://data?')) {
        const encoded = this.getURLParameter(url, 'content');
        try {
            const jsonString = decodeURIComponent(encoded);
            const data = JSON.parse(jsonString);
            this.handleData(data);
        } catch (error) {
            console.error('数据解析失败:', error);
        }
        return false;
    }
    
    // 方案3：打开笔记（参考 mnai）
    if (/^marginnote\d*app:\/\//.test(url)) {
        const noteId = url.replace(/^marginnote\d*app:\/\/note\//, '');
        const note = MNNote.new(noteId);
        note.focusInMindMap();
        return false;
    }
    
    return true;  // 允许其他 URL 加载
}

// 工具方法：获取 URL 参数
getURLParameter(url, name) {
    const regex = new RegExp('[?&]' + name + '=([^&#]*)');
    const results = regex.exec(url);
    return results ? results[1] : null;
}
```

### 📥 插件 → 网页（JavaScript 注入）

```javascript
// 方案1：调用函数（最常用）
async sendToWebView(action, data) {
    const jsonString = JSON.stringify(data);
    // 注意转义！
    const escaped = jsonString.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const script = `window.receiveFromPlugin('${action}', '${escaped}')`;
    
    return await this.runJavaScript(script);
}

// 方案2：直接设置内容
async updateContent(html) {
    // 使用模板字符串避免转义问题
    const script = `
        document.getElementById('content').innerHTML = \`${html}\`;
    `;
    return await this.runJavaScript(script);
}

// 方案3：执行复杂操作
async executeComplexOperation() {
    const script = `
        (function() {
            try {
                // 复杂操作
                const result = processData();
                return JSON.stringify({ success: true, data: result });
            } catch (error) {
                return JSON.stringify({ success: false, error: error.message });
            }
        })()
    `;
    
    const resultString = await this.runJavaScript(script);
    try {
        return JSON.parse(resultString);
    } catch (error) {
        return { success: false, error: 'Parse error' };
    }
}
```

---

## 性能优化技巧

### 1. WebView 复用

```javascript
// ❌ 不好：每次都创建新的
showContent(content) {
    if (this.webView) {
        this.webView.removeFromSuperview();
    }
    this.webView = new UIWebView(...);
    // ...
}

// ✅ 好：复用已有的
showContent(content) {
    if (!this.webView) {
        this.createWebView();
    }
    this.updateWebViewContent(content);
}
```

### 2. 批量操作

```javascript
// ❌ 不好：多次调用
for (const item of items) {
    await this.runJavaScript(`addItem('${item.id}', '${item.title}')`);
}

// ✅ 好：一次传递所有数据
const script = `
    const items = ${JSON.stringify(items)};
    items.forEach(item => addItem(item.id, item.title));
`;
await this.runJavaScript(script);
```

### 3. 避免频繁更新

```javascript
// 使用防抖（参考 mnbrowser）
class WebViewController {
    constructor() {
        this.updateTimer = null;
    }
    
    scheduleUpdate(content) {
        // 取消之前的更新
        if (this.updateTimer) {
            this.updateTimer.invalidate();
        }
        
        // 延迟 0.3 秒更新
        this.updateTimer = NSTimer.scheduledTimerWithTimeInterval(0.3, false, () => {
            this.performUpdate(content);
            this.updateTimer = null;
        });
    }
}
```

---

## 常见坑点与解决方案

### 坑点1：WebView 白屏

```javascript
// 检查清单
troubleshootWhiteScreen() {
    // 1. 检查 frame
    console.log('WebView frame:', this.webView.frame);
    
    // 2. 检查文件路径
    const exists = NSFileManager.defaultManager().fileExistsAtPath(this.htmlPath);
    console.log('HTML 文件存在:', exists);
    
    // 3. 检查 delegate
    console.log('Delegate 设置:', this.webView.delegate === this);
    
    // 4. 尝试加载简单内容
    this.webView.loadHTMLStringBaseURL('<h1>Test</h1>', null);
}
```

### 坑点2：内存泄漏

```javascript
// 正确的清理方式
cleanup() {
    // 1. 停止加载
    this.webView.stopLoading();
    
    // 2. 清除 delegate（重要！）
    this.webView.delegate = null;
    
    // 3. 移除视图
    this.webView.removeFromSuperview();
    
    // 4. 释放引用
    this.webView = null;
}
```

### 坑点3：JavaScript 执行时机

```javascript
// 确保页面加载完成
webViewDidFinishLoad(webView) {
    console.log('页面加载完成');
    
    // 现在可以安全执行 JavaScript
    this.initializePage();
}

webViewDidFailLoadWithError(webView, error) {
    console.error('加载失败:', error);
    
    // 显示错误信息
    const errorHTML = `
        <div style="text-align: center; padding: 50px;">
            <h2>加载失败</h2>
            <p>${error.localizedDescription()}</p>
            <button onclick="location.reload()">重试</button>
        </div>
    `;
    webView.loadHTMLStringBaseURL(errorHTML, null);
}
```

---

## 实战代码模板

### 完整的 WebView 控制器模板

```javascript
// 基于三个插件的最佳实践整合
class WebViewController {
    constructor(view, pluginPath) {
        this.view = view;
        this.pluginPath = pluginPath;
        this.webView = null;
    }
    
    // 初始化
    init() {
        this.createWebView();
        this.loadContent();
    }
    
    // 创建 WebView
    createWebView() {
        this.webView = new UIWebView(this.view.bounds);
        this.webView.backgroundColor = UIColor.whiteColor();
        this.webView.autoresizingMask = (1 << 1 | 1 << 4);
        this.webView.delegate = this;
        this.webView.layer.cornerRadius = 8;
        this.webView.layer.masksToBounds = true;
        this.webView.scrollView.bounces = false;
        this.view.addSubview(this.webView);
    }
    
    // 加载内容
    loadContent() {
        const htmlPath = this.pluginPath + '/index.html';
        this.webView.loadFileURLAllowingReadAccessToURL(
            NSURL.fileURLWithPath(htmlPath),
            NSURL.fileURLWithPath(this.pluginPath)
        );
    }
    
    // 执行 JavaScript（带 NSNull 检查）
    async runJavaScript(script) {
        return new Promise((resolve) => {
            this.webView.evaluateJavaScript(script, (result) => {
                if (result === NSNull.new()) {
                    resolve(undefined);
                } else {
                    resolve(result);
                }
            });
        });
    }
    
    // 发送数据到网页
    async sendData(action, data) {
        const jsonString = JSON.stringify(data);
        const escaped = jsonString.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        const script = `
            if (window.receiveFromPlugin) {
                window.receiveFromPlugin('${action}', '${escaped}');
                'success';
            } else {
                'error: receiveFromPlugin not found';
            }
        `;
        return await this.runJavaScript(script);
    }
    
    // URL 拦截
    webViewShouldStartLoadWithRequestNavigationType(webView, request, type) {
        const url = request.URL().absoluteString();
        
        if (url.startsWith('mntask://')) {
            this.handleCustomProtocol(url);
            return false;
        }
        
        return true;
    }
    
    // 处理自定义协议
    handleCustomProtocol(url) {
        const [protocol, params] = url.split('?');
        const command = protocol.replace('mntask://', '');
        
        // 解析参数
        const paramObj = {};
        if (params) {
            params.split('&').forEach(param => {
                const [key, value] = param.split('=');
                paramObj[key] = decodeURIComponent(value);
            });
        }
        
        // 处理命令
        this.handleCommand(command, paramObj);
    }
    
    // 清理
    cleanup() {
        if (this.webView) {
            this.webView.stopLoading();
            this.webView.delegate = null;
            this.webView.removeFromSuperview();
            this.webView = null;
        }
    }
    
    // 工具方法
    delay(seconds) {
        return new Promise(resolve => {
            NSTimer.scheduledTimerWithTimeInterval(seconds, false, resolve);
        });
    }
}
```

---

## 🎯 核心要点总结

1. **始终检查 NSNull**：这是 iPad 兼容性的关键
2. **使用正确的加载方法**：本地文件用 `loadFileURLAllowingReadAccessToURL`
3. **设置 autoresizingMask**：确保 WebView 自适应大小
4. **URL Scheme 通信**：网页到插件的标准方式
5. **异步执行 JavaScript**：使用 Promise 封装
6. **及时清理资源**：避免内存泄漏
7. **错误处理要优雅**：提供用户友好的错误提示

记住这些要点，你就能避免 90% 的 WebView 相关问题！🚀