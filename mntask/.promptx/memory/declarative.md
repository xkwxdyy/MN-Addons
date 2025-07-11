# 陈述性记忆

## 高价值记忆（评分 ≥ 7）

- 2025/07/06 00:31 START
MN-Addon 开发陷阱：变量重复声明导致的静默加载失败

问题描述：
- 插件突然无法找到某个类（如 MNTaskManager），报错 "Can't find variable: ClassName"
- 没有任何语法错误提示，文件似乎没有被成功加载

根本原因：
JavaScript 文件中存在语法错误（如在同一作用域内重复声明 const 变量），但被文件末尾的 try-catch 静默处理了。

真实案例：
在 xdyy_utils_extensions.js 的 linkParentTask 方法中，第786行和第836行重复声明了 const parentParts 变量，导致语法错误。

为什么难以发现：
文件末尾的初始化代码静默处理了所有错误：
```javascript
} catch (error) {
  // 静默处理错误 - 这导致问题难以发现！
}
```

诊断方法：
1. 使用 node -c filename.js 检查语法错误
2. 查看 git diff 重点检查变量声明
3. 搜索变量名检查是否重复声明

解决方案：
1. 修复语法错误（删除重复声明或重命名）
2. 改进错误处理，在 catch 块中添加日志
3. 开发时启用语法检查，提交前验证
4. 使用 ESLint 配置 no-redeclare 规则

经验总结：
- 当类突然"消失"时，首先怀疑文件加载失败
- 文件加载失败通常是因为语法错误
- 静默的 try-catch 是调试的大敌
- 始终使用工具验证语法正确性 --tags MN-Addon JavaScript 语法错误 调试技巧 MarginNote插件
--tags #最佳实践 #工具使用 #评分:8 #有效期:长期
- END



- 2025/07/11 01:22 START
## MNToolbar 按钮开发陷阱总结

### 1. MNNote.appendMarkdownComment 空内容检查
- 问题：MNNote 包装器会检查 `comment && comment.trim()`，空内容直接返回
- 解决：使用原生 API `focusNote.note.appendMarkdownComment()` 绕过检查

### 2. 空输入值的不同表现
- 手动输入空框：`alert.textFieldAtIndex(0).text` 返回 `undefined`
- 代码传入空字符串：`""` 或 `" "` 都会被 trim 掉
- 关键：理解 undefined、null、空字符串的差异

### 3. MNToolbar 按钮键名必须使用 custom+数字格式
- 错误：使用 `registerButton("proof", ...)` 导致单击无反应
- 正确：必须使用 `registerButton("custom8", ...)` 格式
- 原因：按钮系统只识别 custom 格式的键名
- 症状：长按菜单正常但单击失效

### 4. 调试策略
- API 层级：区分包装器和原生 API
- 框架约定：注意隐含的命名规则
- 底层方案：高层 API 受限时使用底层 API --tags MN-Addon MNToolbar 开发陷阱 按钮开发
--tags #最佳实践 #评分:8 #有效期:长期
- END

- 2025/07/11 19:52 START
## MN-Addon 开发陷阱：不存在的 API 方法（getHTMLCommentFieldText）

### 问题描述
在开发 MNTask 今日看板刷新功能时，`sortTodayTasks` 方法中使用了 `task.getHTMLCommentFieldText("排序")`，但这个方法在 MNNote 对象上并不存在，导致：
- 排序功能执行失败
- 整个今日看板刷新流程中断
- 看板只显示标题，没有任务内容

### 根本原因
1. 文档与实现不同步：可能是旧版本的 API 或计划中的功能
2. 复制代码未验证：从其他项目复制代码时没有验证 API 是否存在
3. 缺少运行时检查：没有在使用前检查方法是否存在

### 解决方案
最终采用简化实现：直接使用 TaskFilterEngine.sort 进行智能排序，避免依赖不存在的 API。

### 经验教训
1. 当遇到"函数不存在"错误时，首先确认该 API 是否真的存在
2. 不要假设所有看起来合理的方法都已实现
3. 简单的解决方案往往比复杂的更可靠
4. 查阅源码而非文档：直接在 mnutils.js 和 xdyyutils.js 中搜索方法
5. 添加防御性编程：对不确定的 API 添加 typeof 检查或 try-catch --tags MN-Addon API陷阱 调试技巧 MarginNote插件 MNTask
--tags #流程管理 #评分:8 #有效期:长期
- END

- 2025/07/11 20:24 START
## MN-Addon 开发原则：函数调用 vs Action 调用（极其重要）

在 MNTask 和 MNToolbar 项目中的核心架构原则：

### 核心原则
**在函数内部，永远不要通过 Action 系统调用功能，而应该直接调用封装好的函数。**

### 架构设计
1. **Action 应该是薄包装层**：Action 只负责接收用户交互并调用核心函数
2. **核心逻辑封装在可复用的函数中**：所有业务逻辑都在独立的函数或类方法中
3. **函数之间直接相互调用**：不通过 Action 系统

### 错误示例
```javascript
// ❌ 在函数内部通过 Action 系统调用
MNTaskGlobal.executeCustomAction("refreshTodayBoard", context)
```

### 正确示例
```javascript
// ✅ 直接调用函数
this.refreshTodayBoard()  // 或 MNTaskManager.refreshTodayBoard()
```

### 为什么重要
1. 避免循环依赖和上下文问题
2. 提高性能（直接调用更快）
3. 易于测试和维护
4. 避免构造复杂的 context 对象

### 实际案例
今日看板刷新功能重构：将 refreshTodayBoard action 的逻辑提取到 MNTaskManager.refreshTodayBoard() 方法，updateTaskStatus 直接调用该方法而不是通过 action。

记住：Action 是为用户交互设计的，不是为代码内部调用设计的！ --tags MN-Addon 架构原则 开发规范 MNTask MNToolbar
--tags #其他 #评分:8 #有效期:长期
- END

- 2025/07/11 20:36 START
MN-Addon WebView 显示和数据传递问题解决方案：

1. WebView 显示问题：
   - 必须在容器视图布局完成后创建 WebView（使用延迟初始化）
   - 使用 loadFileURLAllowingReadAccessToURL 而不是 loadRequest
   - 正确设置 frame：使用容器的 bounds

2. iframe 架构数据传递：
   - 主容器(sidebarContainer.html)需要代理函数接收原生调用
   - 使用 postMessage 转发数据到 iframe
   - iframe 页面需要监听 message 事件
   - 保持原有 API 兼容性：原生代码仍调用 loadTasksFromPlugin --tags WebView MarginNote iframe postMessage MNTask
--tags #其他 #评分:8 #有效期:长期
- END