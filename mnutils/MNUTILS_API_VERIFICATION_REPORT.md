# MNUtils API 验证报告

本报告验证了 MNUTILS_API_GUIDE.md 文档中 MNUtil 类核心方法在 mnutils.js 源码中的实际存在情况。

## 验证结果总览

✅ = 已验证存在且参数正确  
❌ = 不存在或参数不匹配  
⚠️ = 存在但有差异

## MNUtil 类核心方法验证

### 1. ✅ static init(mainPath)
- **位置**: 第 156 行
- **实际定义**: `static init(mainPath)`
- **状态**: 完全匹配

### 2. ✅ static get app()
- **位置**: 第 263 行
- **实际定义**: `static get app()`
- **状态**: 完全匹配，返回 Application.sharedInstance()

### 3. ✅ static get db()
- **位置**: 第 271 行
- **实际定义**: `static get db()`
- **状态**: 完全匹配，返回 Database.sharedInstance()

### 4. ✅ static get studyController()
- **位置**: 第 287 行
- **实际定义**: `static get studyController()`
- **状态**: 完全匹配

### 5. ✅ static get selectionText()
- **位置**: 第 339 行
- **实际定义**: `static get selectionText()`
- **状态**: 完全匹配

### 6. ✅ static get clipboardText()
- **位置**: 第 462 行
- **实际定义**: `static get clipboardText()`
- **状态**: 完全匹配

### 7. ✅ static showHUD(message, duration = 2, view = this.currentWindow)
- **位置**: 第 867 行
- **实际定义**: `static showHUD(message, duration = 2, view = this.currentWindow)`
- **状态**: 完全匹配，包括默认参数

### 8. ✅ static copy(object)
- **位置**: 第 986 行
- **实际定义**: `static copy(object)`
- **状态**: 完全匹配，支持多种对象类型

### 9. ⚠️ static getNoteById(noteid, alert = true)
- **位置**: 第 1140 行
- **实际定义**: `static getNoteById(noteid, alert = true)`
- **文档差异**: 文档中参数名为 `noteId`，实际为 `noteid`（小写）
- **功能**: 正确，当 alert 为 true 时会在找不到笔记时显示 HUD

### 10. ✅ static noteExists(noteId)
- **位置**: 第 1128 行
- **实际定义**: `static noteExists(noteId)`
- **状态**: 完全匹配

### 11. ✅ static addErrorLog(error, source, info)
- **位置**: 第 181 行
- **实际定义**: `static addErrorLog(error, source, info)`
- **状态**: 完全匹配

### 12. ✅ static log(log)
- **位置**: 第 202 行
- **实际定义**: `static log(log)`
- **状态**: 完全匹配，支持字符串和对象参数

### 13. ✅ static isMN4()
- **位置**: 第 559 行
- **实际定义**: `static isMN4()`
- **状态**: 完全匹配

### 14. ✅ static isMacOS()
- **位置**: 第 553 行
- **实际定义**: `static isMacOS()`
- **状态**: 完全匹配

### 15. ✅ static delay(seconds)
- **位置**: 第 1291 行
- **实际定义**: `static async delay(seconds)`
- **注意**: 实际是 async 方法，返回 Promise

### 16. ✅ static undoGrouping(func)
- **位置**: 第 1526 行
- **实际定义**: `static undoGrouping(f, notebookId = this.currentNotebookId)`
- **注意**: 实际有两个参数，第二个参数有默认值

### 17. ✅ static UUID()
- **位置**: 第 2267 行
- **实际定义**: `static UUID()`
- **状态**: 完全匹配

### 18. ✅ static openURL(url)
- **位置**: 第 1091 行
- **实际定义**: `static openURL(url)`
- **状态**: 完全匹配

## 额外发现的重要方法

在验证过程中，发现了一些文档中未提及但非常有用的方法：

1. **static get currentWindow** - 获取当前窗口
2. **static get studyView** - 获取学习视图
3. **static get mindmapView** - 获取脑图视图
4. **static get currentNotebook** - 获取当前笔记本
5. **static get currentNotebookId** - 获取当前笔记本 ID
6. **static get currentDocmd5** - 获取当前文档 MD5
7. **static isfileExists(path)** - 检查文件是否存在
8. **static refreshAfterDBChanged(notebookId)** - 数据库更改后刷新
9. **static focusNoteInMindMapById(noteId, delay=0)** - 在脑图中聚焦笔记

## 结论

1. **整体准确性**: 文档中的 18 个核心方法全部存在于源码中，准确率 100%
2. **细节差异**: 
   - `getNoteById` 的参数名有细微差异（noteid vs noteId）
   - `delay` 方法实际是 async 方法
   - `undoGrouping` 实际有第二个可选参数
3. **建议**: 文档基本准确，但建议：
   - 更新参数名称的细节差异
   - 标注 async 方法
   - 补充一些常用但未记录的方法

## 使用建议

开发者在使用 MNUtils API 时：
1. 优先参考文档了解功能概览
2. 在实际使用前，在源码中确认方法签名
3. 注意 async 方法需要使用 await 或 .then()
4. 充分利用源码中的 JSDoc 注释了解参数和返回值