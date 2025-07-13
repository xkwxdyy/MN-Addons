# 🚑 插件开发常见错误排查手册

> 💡 别担心，每个开发者都会遇到这些问题！这个手册会帮你快速找到解决方案。

## 📋 目录

- [第1部分：网页开发常见错误](#第1部分网页开发常见错误)
- [第2部分：插件通信问题](#第2部分插件通信问题)
- [第3部分：WebView 相关问题](#第3部分webview-相关问题)
- [第4部分：调试技巧大全](#第4部分调试技巧大全)
- [第5部分：性能优化建议](#第5部分性能优化建议)

---

## 第1部分：网页开发常见错误

### 🔴 错误1：按钮点击没反应

**症状**：
- 点击按钮，什么都没发生
- 控制台没有任何输出

**可能原因**：
1. 函数名拼写错误
2. 忘记添加 `onclick` 属性
3. JavaScript 有语法错误
4. 函数定义在 `window.onload` 内部（作用域问题）

**解决方案**：

```html
<!-- ❌ 错误示例 -->
<button onclick="sayHelo()">点击</button>  <!-- 函数名拼错了 -->
<button>点击</button>  <!-- 忘记添加 onclick -->

<!-- ✅ 正确示例 -->
<button onclick="sayHello()">点击</button>

<script>
// ❌ 错误：函数在 window.onload 内部
window.onload = function() {
    function sayHello() {  // 这个函数外部访问不到
        alert('Hello');
    }
}

// ✅ 正确：函数在全局作用域
function sayHello() {
    alert('Hello');
}

window.onload = function() {
    // 初始化代码
}
</script>
```

**排查步骤**：
1. 打开控制台（F12）
2. 看是否有红色错误信息
3. 在函数开头加 `console.log('函数被调用')`
4. 检查函数名大小写是否一致

---

### 🔴 错误2：getElementById 返回 null

**症状**：
```
Uncaught TypeError: Cannot read property 'innerHTML' of null
```

**可能原因**：
1. 元素 ID 拼写错误
2. JavaScript 在元素加载前执行
3. 元素确实不存在

**解决方案**：

```javascript
// ❌ 错误示例
document.getElementById('mesage').innerHTML = 'Hello';  // ID 拼错了

// ❌ 错误：脚本在元素之前执行
<script>
    document.getElementById('message').innerHTML = 'Hello';  // 此时元素还不存在
</script>
<div id="message"></div>

// ✅ 正确：等待页面加载完成
window.onload = function() {
    document.getElementById('message').innerHTML = 'Hello';
}

// ✅ 或者把脚本放在元素后面
<div id="message"></div>
<script>
    document.getElementById('message').innerHTML = 'Hello';
</script>
```

---

### 🔴 错误3：样式不生效

**症状**：
- CSS 写了但页面没变化
- 样式被其他样式覆盖

**可能原因**：
1. 选择器写错
2. CSS 语法错误
3. 样式优先级问题
4. 忘记保存文件

**解决方案**：

```css
/* ❌ 错误示例 */
.mesage {  /* 类名拼错 */
    color: red;
}

#message {
    color: blue;  /* 缺少分号可能影响后面的样式 */
    font-size: 16px
}

/* ✅ 正确示例 */
.message {
    color: red;
}

/* 提高优先级 */
.container .message {  /* 更具体的选择器 */
    color: red;
}

.message {
    color: red !important;  /* 最后的手段 */
}
```

**排查步骤**：
1. 右键元素 → 检查
2. 在样式面板查看是否有删除线
3. 检查类名/ID 是否匹配
4. 确认文件已保存（Ctrl+S）

---

### 🔴 错误4：数据类型错误

**症状**：
```
"2" + 2 = "22"  // 不是 4
```

**常见场景**：
```javascript
// ❌ 错误：字符串拼接而不是数字相加
const input = document.getElementById('number').value;  // "5"
const result = input + 10;  // "510" 而不是 15

// ✅ 正确：转换为数字
const input = document.getElementById('number').value;
const result = parseInt(input) + 10;  // 15

// 或使用 Number()
const result = Number(input) + 10;

// 或使用 + 操作符
const result = +input + 10;
```

---

## 第2部分：插件通信问题

### 🔴 错误5：URL Scheme 不工作

**症状**：
- 发送消息到插件没反应
- 插件没有收到消息

**可能原因**：
1. URL Scheme 格式错误
2. 参数没有编码
3. 插件端没有正确处理

**解决方案**：

```javascript
// ❌ 错误：特殊字符没有编码
window.location.href = 'mntask://save?data=hello world&name=测试';

// ❌ 错误：格式不对
window.location.href = 'http://mntask/save';  // 应该是 mntask://

// ✅ 正确：编码特殊字符
const data = encodeURIComponent('hello world');
const name = encodeURIComponent('测试');
window.location.href = `mntask://save?data=${data}&name=${name}`;

// ✅ 对于复杂数据，使用 JSON
const complexData = {
    title: '测试任务',
    tags: ['重要', '紧急']
};
const encoded = encodeURIComponent(JSON.stringify(complexData));
window.location.href = `mntask://save?data=${encoded}`;
```

---

### 🔴 错误6：插件调用网页函数失败

**症状**：
- 插件执行 `evaluateJavaScript` 但网页没反应
- 控制台显示函数未定义

**可能原因**：
1. 函数不在全局作用域
2. 函数名拼写错误
3. 参数格式错误

**解决方案**：

```javascript
// ❌ 错误：函数在局部作用域
(function() {
    function receiveData(data) {  // 插件访问不到
        console.log(data);
    }
})();

// ✅ 正确：函数在全局作用域
window.receiveData = function(data) {
    console.log(data);
}

// 或直接定义
function receiveData(data) {
    console.log(data);
}

// 插件端调用时注意引号
// ❌ 错误：引号不匹配
webView.evaluateJavaScript('receiveData("test")');  // 如果 test 包含引号会出错

// ✅ 正确：使用转义或模板字符串
const message = 'He said "Hello"';
webView.evaluateJavaScript(`receiveData('${message.replace(/'/g, "\\'")}')`);
```

---

### 🔴 错误7：数据传递失败

**症状**：
- JSON 解析错误
- 数据丢失或损坏

**解决方案**：

```javascript
// ❌ 错误：直接传递对象
window.location.href = 'mntask://save?data=' + {name: 'test'};  // 变成 [object Object]

// ❌ 错误：JSON 格式错误
const badJson = '{"name": "test",}';  // 多余的逗号

// ✅ 正确：完整的编码流程
function sendDataToPlugin(data) {
    try {
        // 1. 转换为 JSON
        const jsonString = JSON.stringify(data);
        
        // 2. 编码
        const encoded = encodeURIComponent(jsonString);
        
        // 3. 发送
        window.location.href = `mntask://data?content=${encoded}`;
        
        console.log('数据已发送:', data);
    } catch (error) {
        console.error('发送数据失败:', error);
    }
}

// 接收端解码
function receiveFromPlugin(encodedData) {
    try {
        // 1. 解码
        const jsonString = decodeURIComponent(encodedData);
        
        // 2. 解析 JSON
        const data = JSON.parse(jsonString);
        
        console.log('收到数据:', data);
        return data;
    } catch (error) {
        console.error('解析数据失败:', error);
        return null;
    }
}
```

---

## 第3部分：WebView 相关问题

### 🔴 错误8：WebView 白屏

**症状**：
- WebView 创建了但显示空白
- 没有任何内容

**可能原因**：
1. HTML 文件路径错误
2. HTML 文件有语法错误
3. WebView frame 为 0
4. 加载方法使用错误

**解决方案**：

```javascript
// 检查文件路径
const htmlPath = taskConfig.mainPath + '/todayboard.html';
console.log('HTML 路径:', htmlPath);
console.log('文件是否存在:', NSFileManager.defaultManager().fileExistsAtPath(htmlPath));

// 确保 WebView 有正确的大小
const webView = new UIWebView({
    x: 0,
    y: 0,
    width: containerView.bounds.width,  // 不要硬编码
    height: containerView.bounds.height
});

// 使用正确的加载方法
webView.loadFileURLAllowingReadAccessToURL(
    NSURL.fileURLWithPath(htmlPath),
    NSURL.fileURLWithPath(taskConfig.mainPath)
);
```

---

### 🔴 错误9：iPad 上 NSNull 问题

**症状**：
```
result.startsWith is not a function
[object NSNull]
```

**根本原因**（从 mnai/mnutils 学到）：
- iOS/iPadOS 的 JavaScript 桥接行为特殊
- 即使执行成功也可能返回 NSNull
- 这是系统级别的差异，不是代码错误

**完整解决方案**：

```javascript
// 1. 添加 NSNull 检测（必须！）
function isNSNull(obj) {
    return (obj === NSNull.new());
}

// 2. 安全的 JavaScript 执行包装
async function runJavaScript(script, webView) {
    return new Promise((resolve) => {
        webView.evaluateJavaScript(script, (result) => {
            // 关键：NSNull 检测
            if (isNSNull(result)) {
                // NSNull 不一定是错误，可能只是没有返回值
                if (script.includes('(function()')) {
                    // IIFE 通常执行成功但无返回值
                    resolve('success');
                } else {
                    resolve(undefined);
                }
                return;
            }
            
            // null 或 undefined
            if (result === null || result === undefined) {
                resolve(undefined);
                return;
            }
            
            // 正常返回
            resolve(result);
        });
    });
}

// 3. 使用时的安全检查
const result = await runJavaScript('getStatus()', webView);
if (result && typeof result === 'string') {
    // 安全使用字符串方法
    if (result.startsWith('error:')) {
        console.error('出错了');
    }
}
```

**最佳实践**：
1. 永远使用 Promise 包装 evaluateJavaScript
2. 始终检查 NSNull
3. 不要假设返回值类型
4. 在 Mac 和 iPad 都要测试

---

## 第4部分：调试技巧大全

### 🛠️ 技巧1：使用 Console.log 调试

```javascript
// 在关键位置添加日志
function processTask(task) {
    console.log('1. 开始处理任务:', task);
    
    if (!task) {
        console.log('2. 任务为空，退出');
        return;
    }
    
    console.log('3. 任务类型:', task.type);
    
    // 使用 console.table 显示数组或对象
    console.table(task);
    
    // 使用 console.group 组织日志
    console.group('任务详情');
    console.log('ID:', task.id);
    console.log('标题:', task.title);
    console.log('状态:', task.status);
    console.groupEnd();
}
```

### 🛠️ 技巧2：使用断点调试

1. 打开开发者工具（F12）
2. 切换到 Sources 标签
3. 找到你的 HTML 文件
4. 点击行号设置断点
5. 刷新页面，代码会在断点处暂停

```javascript
function calculateTotal(items) {
    let total = 0;
    
    // 在这里设置断点
    debugger;  // 或者在浏览器中点击行号
    
    items.forEach(item => {
        total += item.price;
    });
    
    return total;
}
```

### 🛠️ 技巧3：检查网络请求

1. 打开 Network 标签
2. 刷新页面
3. 查看所有请求
4. 点击请求查看详情

特别注意 `mntask://` 开头的请求，这些是发送给插件的。

### 🛠️ 技巧4：使用 try-catch 捕获错误

```javascript
function riskyOperation() {
    try {
        // 可能出错的代码
        const data = JSON.parse(someString);
        processData(data);
    } catch (error) {
        console.error('操作失败:', error);
        console.error('错误堆栈:', error.stack);
        
        // 显示友好的错误信息
        showMessage('操作失败，请重试');
        
        // 可以上报错误
        reportError(error);
    }
}
```

### 🛠️ 技巧5：性能分析

```javascript
// 测量代码执行时间
console.time('数据处理');

processLargeDataSet();

console.timeEnd('数据处理');  // 输出: 数据处理: 123.456ms

// 或使用 performance API
const startTime = performance.now();

doSomething();

const endTime = performance.now();
console.log(`执行时间: ${endTime - startTime} 毫秒`);
```

---

## 第5部分：性能优化建议

### ⚡ 优化1：减少 DOM 操作

```javascript
// ❌ 不好：多次操作 DOM
for (let i = 0; i < 100; i++) {
    document.getElementById('list').innerHTML += `<li>Item ${i}</li>`;
}

// ✅ 好：一次性更新
let html = '';
for (let i = 0; i < 100; i++) {
    html += `<li>Item ${i}</li>`;
}
document.getElementById('list').innerHTML = html;

// ✅ 更好：使用 DocumentFragment
const fragment = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
    const li = document.createElement('li');
    li.textContent = `Item ${i}`;
    fragment.appendChild(li);
}
document.getElementById('list').appendChild(fragment);
```

### ⚡ 优化2：防抖和节流

```javascript
// 防抖：用户停止输入后才执行
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

// 使用防抖
const searchInput = document.getElementById('search');
searchInput.addEventListener('input', debounce(function(e) {
    searchTasks(e.target.value);
}, 300));

// 节流：固定时间间隔执行
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}
```

### ⚡ 优化3：懒加载

```javascript
// 只在需要时加载数据
let tasksLoaded = false;
let tasksData = null;

function showTasks() {
    if (!tasksLoaded) {
        // 第一次加载
        loadTasksFromPlugin().then(tasks => {
            tasksData = tasks;
            tasksLoaded = true;
            renderTasks(tasksData);
        });
    } else {
        // 使用缓存的数据
        renderTasks(tasksData);
    }
}
```

---

## 🎯 快速诊断清单

遇到问题时，按照这个清单排查：

1. **基础检查**
   - [ ] 文件已保存？
   - [ ] 浏览器已刷新？
   - [ ] 控制台有错误信息？
   - [ ] 函数名拼写正确？
   - [ ] 元素 ID 正确？

2. **通信检查**
   - [ ] URL Scheme 格式正确？
   - [ ] 参数已编码？
   - [ ] 函数在全局作用域？
   - [ ] JSON 格式正确？

3. **WebView 检查**
   - [ ] HTML 文件路径正确？
   - [ ] WebView 有正确的大小？
   - [ ] 使用了正确的加载方法？
   - [ ] 检查了 NSNull？

4. **性能检查**
   - [ ] 避免了频繁的 DOM 操作？
   - [ ] 大数据集分批处理？
   - [ ] 使用了防抖/节流？
   - [ ] 清理了定时器和监听器？

---

## 🆘 还是解决不了？

1. **准备问题描述**
   - 我想做什么？
   - 我试了什么？
   - 出现了什么错误？（完整的错误信息）
   - 我的代码是什么？（相关部分）

2. **寻求帮助的地方**
   - MarginNote 官方论坛
   - GitHub Issues
   - 开发者社区

3. **提问模板**
   ```markdown
   **问题描述**：
   简单描述你遇到的问题
   
   **重现步骤**：
   1. 第一步
   2. 第二步
   3. 看到错误
   
   **期望行为**：
   应该发生什么
   
   **实际行为**：
   实际发生了什么
   
   **代码片段**：
   ```javascript
   // 相关代码
   ```
   
   **错误信息**：
   ```
   完整的错误信息
   ```
   
   **环境信息**：
   - MarginNote 版本：
   - 系统版本：
   - 设备类型：
   ```

---

## 💪 记住

> 每个错误都是学习的机会！
> 
> 调试是开发的一部分，不是失败的标志。
> 
> 保持耐心，你一定能解决问题的！

祝你调试顺利！🚀