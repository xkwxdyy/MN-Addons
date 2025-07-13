# 测试新看板功能指南

## 概述

v0.12.0 版本引入了全新的看板架构，虽然保持了向后兼容性，但新功能需要进一步的插件端集成才能完全使用。本文档说明如何测试和验证新功能。

## 已完成的部分

### 1. 开发文档
- 📚 **路径**：`/docs/webview-plugin-guide.md`
- **内容**：完整的插件与网页交互开发指南
- **特点**：深入浅出，对新手友好

### 2. 通信桥接库
- 📦 **文件**：`mntask-bridge.js`
- **功能**：封装所有通信逻辑
- **特点**：Promise 支持、错误处理、完整文档

### 3. 示例代码
- 🎯 **文件**：`/examples/01-hello-world.html`
- **测试方法**：
  1. 在浏览器中直接打开文件
  2. 查看交互示例和代码展示
  3. 学习基本的通信原理

### 4. 新看板页面
- 🎨 **文件**：`todayboard_new.html`
- **测试方法**：
  1. 在浏览器中打开查看界面
  2. 测试响应式设计（调整窗口大小）
  3. 查看筛选器交互
  4. 查看加载和空状态

## 需要插件端实现的部分

### 1. URL Scheme 处理
需要在 `settingController.js` 中实现 `handleTodayBoardProtocol` 方法：

```javascript
// 在 webViewShouldStartLoadWithRequestNavigationType 中添加
if (url.startsWith('mntask://')) {
    return this.handleTodayBoardProtocol(url);
}
```

### 2. 数据发送接口
实现向新看板发送数据的方法：

```javascript
// 发送任务数据到新看板
sendTasksToNewBoard() {
    const tasks = MNTaskManager.filterTodayTasks();
    const jsonData = JSON.stringify(tasks);
    this.todayBoardWebView.evaluateJavaScript(
        `receiveFromPlugin('tasks', '${jsonData}')`
    );
}
```

### 3. 切换到新看板
修改加载逻辑，使用新的 HTML 文件：

```javascript
// 加载新看板
const htmlPath = taskConfig.mainPath + '/todayboard_new.html';
this.todayBoardWebView.loadFileURLAllowingReadAccessToURL(
    NSURL.fileURLWithPath(htmlPath),
    NSURL.fileURLWithPath(taskConfig.mainPath)
);
```

## 测试步骤

### 第一阶段：静态测试（可立即进行）

1. **查看文档**
   - 阅读 `/docs/webview-plugin-guide.md`
   - 理解通信原理和架构设计

2. **运行示例**
   - 在浏览器打开 `/examples/01-hello-world.html`
   - 观察界面和交互效果
   - 查看控制台日志

3. **预览新界面**
   - 在浏览器打开 `todayboard_new.html`
   - 测试所有 UI 交互
   - 检查响应式设计

### 第二阶段：集成测试（需要插件端支持）

1. **实现 URL Scheme 处理**
2. **测试数据加载**
3. **测试任务操作**
4. **验证性能提升**

## 模拟数据测试

如果想立即看到完整效果，可以在浏览器控制台运行：

```javascript
// 模拟接收任务数据
receiveFromPlugin('tasks', JSON.stringify([
    {
        id: '1',
        title: '完成项目提案',
        type: '任务',
        status: '进行中',
        priority: '高',
        plannedTime: '2小时',
        progress: 60
    },
    {
        id: '2',
        title: '代码审查',
        type: '动作',
        status: '未开始',
        priority: '中',
        plannedTime: '1小时'
    }
]));
```

## 已知限制

1. **数据持久化**：目前数据不会保存，刷新页面会丢失
2. **实时同步**：需要插件端实现定时刷新机制
3. **错误恢复**：网络错误时的重试机制需要完善

## 反馈与改进

如果在测试过程中发现任何问题或有改进建议，请记录在 `/log.md` 文件中，我们会及时处理。

## 下一步计划

1. 完成插件端的集成代码
2. 添加更多示例（数据传递、任务卡片等）
3. 优化性能和错误处理
4. 扩展到其他视图（项目视图、任务队列）

---

💡 **提示**：新架构的核心优势在于简化和性能，即使在当前的过渡阶段，你也可以通过阅读文档和代码来学习现代的 Web 开发实践。