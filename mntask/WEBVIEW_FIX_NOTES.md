# 今日看板 WebView 修复说明

## 问题背景
用户报告今日看板功能显示"加载任务数据失败"，即使在 v0.8.5 将看板集成到 settingController 后问题依然存在。

## 问题根源
通过研究 MNUtils 的日志查看器实现，发现了以下关键问题：

### 1. WebView 结构混乱
原始实现创建了嵌套的 WebView 结构：
```javascript
// 错误的实现
this.todayBoardWebView = UIView // 容器视图
this.todayBoardWebView.webView = UIWebView // 实际的 WebView
```

### 2. JavaScript 调用错误
```javascript
// 错误：使用了嵌套的 webView 属性
this.todayBoardWebView.webView.stringByEvaluatingJavaScriptFromString(script)
```

### 3. 缺少 webViewDidFinishLoad 实现
没有等待 HTML 完全加载就尝试调用 JavaScript 函数，导致 `loadTasksFromPlugin` 函数未定义。

## 解决方案

### 1. 明确 WebView 结构
保持 todayBoardWebView 作为容器视图，创建独立的 WebView 实例：
```javascript
// 正确的实现
this.todayBoardWebView = UIView // 容器视图保持不变
this.todayBoardWebViewInstance = UIWebView // 实际的 WebView 实例
```

### 2. 实现 webViewDidFinishLoad
确保在 HTML 加载完成后再传递数据：
```javascript
webViewDidFinishLoad: function(webView) {
  if (webView === self.todayBoardWebViewInstance) {
    self.todayBoardWebViewInitialized = true
    self.loadTodayBoardData() // 在这里加载数据
  }
}
```

### 3. 正确的 JavaScript 调用
直接在 WebView 实例上调用：
```javascript
this.todayBoardWebViewInstance.stringByEvaluatingJavaScriptFromString(script)
```

## MNUtils 的实现模式

MNUtils 的日志查看器提供了很好的参考：

1. **数据编码**：`encodeURIComponent(JSON.stringify(data))`
2. **JavaScript 函数调用**：`showLogsFromAddon(\`${encodedData}\`)`
3. **HTML 端解码**：`JSON.parse(decodeURIComponent(encodedData))`

## 关键学习点

1. **WebView 生命周期管理**：必须等待 webViewDidFinishLoad 再进行 JavaScript 交互
2. **正确的对象引用**：明确区分容器视图和 WebView 实例
3. **数据传递模式**：使用 URL 编码确保数据安全传递
4. **错误处理**：添加充分的日志和错误捕获

## 测试要点

1. 验证今日看板能正常显示任务数据
2. 检查 WebView 的内存管理
3. 测试数据刷新功能
4. 确保与其他视图切换正常

## 后续修复（v0.8.7）

### 变量作用域问题
在 v0.8.6 修复后，发现了新的错误：`ReferenceError: Can't find variable: todayTasks`

**问题原因**：
- `todayTasks` 在 try 块内定义
- 在 catch 块中被引用
- 如果错误发生在变量定义之前，会导致引用错误

**解决方案**：
移除 catch 块中对 todayTasks 的引用，简化错误处理逻辑。

## 关键发现（v0.8.8）

### JavaScript 执行方法差异
经过深入研究 MNUtils 的 log viewer 实现，发现了根本问题：

**MNTask 使用的方法（已弃用）**：
```javascript
// 同步执行，iOS 9 后已弃用
this.todayBoardWebViewInstance.stringByEvaluatingJavaScriptFromString(script)
```

**MNUtils 使用的方法（推荐）**：
```javascript
// 异步执行，支持回调
this[webViewName].evaluateJavaScript(script, result => {
  // 处理结果
})
```

### v0.8.8 解决方案

1. **新增 runJavaScript 方法**：
```javascript
taskSettingController.prototype.runJavaScript = async function(script, webViewName = 'todayBoardWebViewInstance') {
  return new Promise((resolve, reject) => {
    try {
      if (!this[webViewName]) {
        reject(new Error(`WebView ${webViewName} not found`))
        return
      }
      
      this[webViewName].evaluateJavaScript(script, result => {
        resolve(result)
      })
    } catch (error) {
      reject(error)
    }
  })
}
```

2. **更新 loadTodayBoardData 为异步方法**：
- 方法签名改为 `async function()`
- 使用 `await this.runJavaScript(script)` 替代原有的同步调用
- 添加成功日志，便于调试

### 为什么之前的修复都失败了

- v0.8.6：修复了 WebView 结构问题 ✓
- v0.8.7：修复了变量作用域问题 ✓
- **但是**：一直使用的是已弃用的同步方法，这可能在某些情况下无法正确执行

### 技术要点

1. **iOS WebView API 演进**：
   - `stringByEvaluatingJavaScriptFromString` - iOS 2.0+，iOS 9 后弃用
   - `evaluateJavaScript` - iOS 8.0+，推荐使用

2. **Promise 封装**：
   - 将回调式 API 封装为 Promise，支持 async/await
   - 更好的错误处理和链式调用

3. **与 MNUtils 保持一致**：
   - 采用相同的实现模式，确保兼容性
   - 便于后续维护和升级

这次修复从根本上解决了 WebView JavaScript 执行的问题，采用了现代化的异步 API。