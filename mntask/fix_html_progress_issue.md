# MNTask HTML进展显示问题修复

修复日期：2025-07-25

## 问题描述

1. **进展内容显示HTML代码**
   - 问题：进展记录显示为原始HTML代码，如 `relative; padding-left:28px; margin:14px 0...`
   - 原因：进展数据包含HTML标签，但没有被正确清理

2. **焦点任务卡片按钮溢出**
   - 问题：进展内容过长导致按钮被挤出卡片框外
   - 原因：未处理的HTML代码占用大量空间

3. **JavaScript错误**
   - 问题：日志显示 Script error，"添加进展"按钮无响应
   - 原因：缺少详细的错误信息

## 解决方案

### 1. 添加HTML清理函数（第8900行）
```javascript
// 去除HTML标签
function stripHTMLTags(html) {
    if (!html) return '';
    // 创建临时DOM元素来解析HTML
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    // 返回纯文本内容
    return tmp.textContent || tmp.innerText || '';
}
```

### 2. 修复进展内容显示

#### 焦点任务卡片（第6598行）
```javascript
// 修改前
${task.fields.progressLog[task.fields.progressLog.length - 1].note}

// 修改后
${stripHTMLTags(task.fields.progressLog[task.fields.progressLog.length - 1].note)}
```

#### 任务详情弹窗（第9842行）
```javascript
// 修改前
<div class="progress-log-note">${log.note}</div>

// 修改后
<div class="progress-log-note">${stripHTMLTags(log.note)}</div>
```

### 3. 改进进展数据转换

在 `convertProgressData` 函数中（第14143-14160行），对所有进展内容使用 `stripHTMLTags`：
- 字符串格式：`stripHTMLTags(progress)`
- 对象格式：`stripHTMLTags(progress.content || progress.note || progress.text || JSON.stringify(progress))`
- 默认处理：`stripHTMLTags(String(progress))`

### 4. 添加CSS文本截断保护（第831-843行）
```css
.recent-progress-content {
    max-height: 3.6em; /* 限制最多显示3行 */
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3; /* 标准属性 */
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
}
```

### 5. 添加全局错误处理器（第6038-6072行）
```javascript
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('🚨 JavaScript错误:', {
        message: msg,
        source: url,
        line: lineNo,
        column: columnNo,
        error: error
    });
    // 发送错误日志到原生端...
    return true;
};
```

## 关键改进

1. **数据清理**：所有进展内容在显示前都会清理HTML标签
2. **显示优化**：限制进展内容最多显示3行，超出部分显示省略号
3. **错误调试**：详细的错误信息有助于快速定位问题
4. **一致性**：确保所有地方的进展显示都使用相同的处理方式

## 测试要点

1. 验证包含HTML的进展内容是否正确显示为纯文本
2. 确认焦点任务卡片的按钮始终在框内可见
3. 测试"添加进展"功能是否正常工作
4. 检查长进展内容是否正确截断并显示省略号