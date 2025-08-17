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
