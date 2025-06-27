# ✅ MarginNote4 插件开发框架 - MNUtils API 参考指南
## 0. 开发原则

### 0.1 基本原则

1. **深度理解**：每次输出前必须深度理解项目背景、用户意图和技术栈特征
2. **权威参考**：当信息不确定时，先查询权威资料（官方文档、标准或源码）
3. **精确回答**：仅回答与问题直接相关内容，避免冗余和教程式铺陈
4. **任务分解**：面对复杂需求，拆分为可管理的子任务

### 0.2 ⚠️ 严禁擅自修改用户内容（极其重要）

**绝对禁止擅自生成内容替换用户的原始内容！**

在进行任何代码解耦、重构、迁移或整理工作时：

1. **必须严格复制原始内容**：
   - 从 git 历史、现有文件或用户提供的内容中逐字复制
   - 保持所有注释、空行、格式完全一致
   - 即使是被注释掉的代码也必须保留

2. **禁止自创或简化**：
   - 不得简化菜单结构或删减菜单项
   - 不得改变函数参数或默认值
   - 不得"优化"代码或改进命名
   - 不得删除看似"无用"的代码

3. **保持完整性**：
   - 每个菜单项、每个按钮配置、每个参数都必须完整保留
   - 保持原有的层级结构和顺序
   - 保持原有的中英文内容、emoji 等

4. **遇到不确定立即询问**：
   - 如果某个部分不清楚或缺失，必须询问用户
   - 不得自行推测或填充内容
   - 不得基于"常见做法"来补充

**违反此原则会导致功能丢失、用户工作被破坏，是绝对不可接受的错误。**

### 0.3 源码阅读规范

1. **完整阅读原则**：
   - 【极其重要】必须完整阅读整个文件，避免断章取义
   - 理解上下文依赖和完整的业务逻辑
   - 注意文件间的引用关系

2. **大文件处理**：
   - 超过 500 行的文件应分段阅读
   - 每段控制在 100-200 行
   - 记录段间的关联关系


> **重要**: MNUtils 不仅是一个插件，更是 MarginNote4 插件开发的核心 API 框架。本指南详细记录了所有 API 接口、设计模式和最佳实践，为插件开发者提供完整的技术参考。

## 📌 关于本文档

本文档是 MNUtils 项目的完整 API 参考文档。MNUtils 是 MarginNote 插件开发的核心框架，在其他插件项目中已默认加载。

**框架规模**:
- **mnutils.js**: 6,878 行，提供 9 个核心类，300+ API 方法
- **xdyyutils.js**: 6,175 行，学术场景扩展（可选）
- **支持版本**: MarginNote 3.7.11+ (MN3/MN4)

**文档目的**: 让 AI 了解 MNUtils 提供了哪些类、每个类的功能和所有可用的 API 方法。

## 🎯 框架定位与价值

MNUtils 是 MarginNote4 生态系统中的基础设施层，为插件开发者提供：

1. **完整的 API 封装**: 将 Objective-C 原生接口封装为友好的 JavaScript API
2. **学术场景优化**: 针对数学、科研等学术领域的深度定制
3. **开发效率提升**: 丰富的工具函数和设计模式，减少重复开发
4. **稳定性保障**: 经过大量实践验证的错误处理和性能优化

## 📚 快速开始

### 环境要求
- MarginNote 3.7.11+ (支持 MN3/MN4)
- JavaScript ES6+
- 基础的 Objective-C Bridge 知识（可选）

### 基础使用
```javascript
// 在插件的 main.js 中使用 MNUtils
// 注意：MNUtils 已在其他插件中默认加载，直接使用即可

// 1. 初始化（必须）
MNUtil.init(self.path);

// 2. 开始使用 API
let focusNote = MNNote.getFocusNote();
MNUtil.showHUD("Hello MarginNote!");

// 3. 如需学术功能，确保 xdyyutils 已加载
if (typeof MNMath !== 'undefined') {
  // 使用学术功能
  MNMath.makeNote(focusNote);
}
```

## 🏗️ 架构设计

### 分层架构
```
┌─────────────────────────────────────┐
│   应用层 (Your Plugin)              │ ← 你的插件代码
├─────────────────────────────────────┤
│   扩展层 (xdyyutils.js)             │ ← 学术场景扩展 API
├─────────────────────────────────────┤
│   核心层 (mnutils.js)               │ ← MarginNote 核心 API
├─────────────────────────────────────┤
│   桥接层 (JSBridge)                 │ ← JavaScript-ObjC 桥接
├─────────────────────────────────────┤
│   原生层 (UIKit/CoreData)           │ ← iOS/macOS 系统框架
└─────────────────────────────────────┘
```

### 核心文件说明
| 文件 | 规模 | 作用 | 重要性 |
|------|------|------|--------|
| **mnutils.js** | 6,878行 | 核心 API 封装，提供 9 个主要类 | ⭐⭐⭐⭐⭐ |
| **xdyyutils.js** | 6,175行 | 学术场景扩展，13 种卡片类型 | ⭐⭐⭐⭐ |
| **main.js** | - | 插件入口，业务逻辑实现 | ⭐⭐⭐ |
| **mnaddon.json** | - | 插件配置清单 | ⭐⭐⭐ |

### 技术栈
- **开发语言**: JavaScript ES6+ (支持 async/await)
- **运行平台**: MarginNote 3/4 插件系统
- **UI 框架**: UIKit (通过 JSBridge 调用)
- **数据存储**: CoreData (封装为 JavaScript API)
- **设计模式**: 静态工具类、工厂模式、装饰器模式

## 📖 核心 API 参考 - mnutils.js

> mnutils.js 是 MNUtils 框架的核心，提供了 9 个主要类和超过 300 个 API 方法。这些 API 覆盖了 MarginNote 的所有核心功能。

### 🔧 MNUtils 核心类总览

| 类名 | 代码行数 | 主要功能 | API 数量 |
|------|----------|----------|----------|
| **Menu** | 1-139 | 弹出菜单 UI 组件 | 12 |
| **MNUtil** | 140-2787 | 核心工具类，系统级功能 | 304+ |
| **MNConnection** | 2788-3171 | 网络请求、WebView、WebDAV | 14 |
| **MNButton** | 3172-3754 | 自定义按钮 UI 组件 | 27 |
| **MNDocument** | 3755-3879 | PDF 文档操作接口 | 14 |
| **MNNotebook** | 3880-4172 | 笔记本/学习集管理 | 35 |
| **MNNote** | 4173-6337 | 笔记核心类 | 149+ |
| **MNComment** | 6338-6757 | 评论/内容管理 | 20+ |
| **MNExtensionPanel** | 6758-6841 | 插件面板控制 | 11 |

### 📌 Menu 类 - 弹出菜单组件

```javascript
class Menu {
  // 属性
  preferredPosition = 2        // 弹出方向：左0, 下1, 上2, 右4
  titles = []                  // 菜单项标题数组
  commandTable = []            // 命令表
  
  // 构造函数
  constructor(sender, delegate, width = 200, preferredPosition = 2)
  
  // 核心方法
  addMenuItem(title, selector, params = "", checked = false)
  addMenuItems(items)          // 批量添加菜单项
  insertMenuItem(index, title, selector, params, checked)
  insertMenuItems(index, items) // 批量插入菜单项到指定位置
  show()                       // 显示菜单（自动调整位置避免超出屏幕）
  dismiss()                    // 关闭菜单
  
  // 属性访问
  set menuItems(items)         // 设置菜单项
  get menuItems()              // 获取菜单项
  set rowHeight(height)        // 设置行高
  get rowHeight()              // 获取行高
  set fontSize(size)           // 设置字体大小
  get fontSize()               // 获取字体大小
  
  // 静态方法
  static item(title, selector, params, checked)  // 快速创建菜单项
  static dismissCurrentMenu()  // 关闭当前显示的菜单
  
  // 静态属性
  static popover              // 当前显示的菜单弹窗实例
}

// 使用示例
let menu = new Menu(button, self, 250);
menu.addMenuItem("复制", "copyNote:", note);
menu.addMenuItem("制卡", "makeCard:", note, note.isCard);
menu.show();
```

**最佳实践**:
- 使用 `preferredPosition` 设置首选弹出方向，Menu 会自动调整避免超出屏幕
- 使用 `static item()` 方法快速创建菜单项对象
- 记得在适当时机调用 `dismiss()` 关闭菜单
- 可以通过 `rowHeight` 和 `fontSize` 调整菜单外观

### 2. MNUtil 类 - 核心工具类 ⭐⭐⭐⭐⭐

MNUtil 是整个框架的核心，提供了 304+ 个静态方法。所有方法都是静态的，直接通过 `MNUtil.methodName()` 调用。

```javascript
class MNUtil {
  // === 主题与颜色 ===
  static themeColor = {
    Gray: UIColor.colorWithHexString("#414141"),
    Default: UIColor.colorWithHexString("#FFFFFF"),
    Dark: UIColor.colorWithHexString("#000000"),
    Green: UIColor.colorWithHexString("#E9FBC7"),
    Sepia: UIColor.colorWithHexString("#F5EFDC")
  }
  
  // === 初始化 ===
  static init(mainPath)  // 必须在插件启动时调用
  
  // === 环境访问器 (懒加载) ===
  static get app()              // Application 实例
  static get db()               // Database 实例
  static get currentWindow()    // 当前窗口
  static get studyController()  // 学习控制器
  static get studyView()        // 学习视图
  static get mindmapView()      // 脑图视图
  static get readerController() // 阅读器控制器
  static get notebookController() // 笔记本控制器
  static get currentDocController() // 当前文档控制器
  static get studyMode()        // 学习模式: 0/1=文档, 2=学习, 3=复习
  
  // === 选择与剪贴板 ===
  static get selectionText()    // 获取选中文本
  static get isSelectionText()  // 是否选中文本（非图片）
  static get currentSelection() // 获取完整选择信息
  static get clipboardText()    // 剪贴板文本
  static get clipboardImage()   // 剪贴板图片
  
  // === 核心工具方法 ===
  static showHUD(message, duration = 2, view = this.currentWindow)
  static copy(object)           // 复制到剪贴板（自动序列化）
  static copyJSON(object)       // 复制 JSON 格式
  static copyImage(imageData)   // 复制图片数据
  
  // === 笔记操作 ===
  static getNoteById(noteid, alert = true)  // 根据 ID 获取笔记
  static noteExists(noteId)     // 检查笔记是否存在
  static isNoteInReview(noteId) // 笔记是否在复习中
  
  // === 错误处理与日志 ===
  static addErrorLog(error, source, info)  // 添加错误日志
  static log(log)              // 通用日志
  static clearLogs()           // 清空日志
  
  // === 版本与平台 ===
  static get version()         // 获取 MN 版本信息
  static isMN4()               // 是否 MarginNote 4
  static isMN3()               // 是否 MarginNote 3
  static isIOS()               // 是否 iOS 平台
  static isMacOS()             // 是否 macOS 平台
  
  // === 文档与笔记本管理 ===
  static getDocById(md5)       // 根据 MD5 获取文档
  static getNoteBookById(id)   // 根据 ID 获取笔记本
  static getNoteIdByURL(url)   // 从 URL 解析笔记 ID
  static getNotebookIdByURL(url) // 从 URL 解析笔记本 ID
  static importDocument(filePath) // 导入文档
  static importPDFFromFile()    // 弹窗选择并导入 PDF
  static openDoc(md5, notebookId) // 打开文档
  static openNotebook(notebook, needConfirm) // 打开笔记本
  static findToc(md5, excludeNotebookId) // 查找文档的目录笔记
  static getDocTocNotes(md5, notebookId) // 获取文档的目录笔记
  
  // === 界面控制 ===
  static toggleExtensionPanel() // 切换扩展面板
  static refreshAddonCommands() // 刷新插件命令
  static refreshAfterDBChanged(notebookId) // 数据库变化后刷新
  static focusNoteInMindMapById(noteId, delay) // 在脑图中聚焦笔记
  static focusNoteInFloatMindMapById(noteId, delay) // 在浮动脑图中聚焦
  static focusNoteInDocumentById(noteId, delay) // 在文档中聚焦
  
  // === 实用工具方法 ===
  static genFrame(x, y, width, height)  // 生成框架对象
  static setFrame(view, x, y, width, height) // 设置视图框架
  static isfileExists(path)     // 检查文件是否存在
  static createFolder(path)     // 创建文件夹
  static createFolderDev(path)  // 创建文件夹（包括中间目录）
  static getFileName(path)      // 从路径获取文件名
  static getFileFold(path)      // 获取文件所在文件夹路径
  static copyFile(sourcePath, targetPath) // 复制文件
  static subpathsOfDirectory(path) // 获取目录下所有子路径
  static contentsOfDirectory(path) // 获取目录内容列表
  static mergeWhitespace(str)   // 合并连续空白字符
  static parseWinRect(winRect)  // 解析窗口矩形字符串
  static typeOf(obj)            // 获取对象类型
  static isValidJSON(jsonString) // 检查 JSON 是否有效
  static getValidJSON(text)     // 尝试解析 JSON
  static deepEqual(obj1, obj2)  // 深度比较对象
  static UUID()                 // 生成 UUID
  static sort(arr, type)        // 数组排序并去重
  static constrain(value, min, max) // 约束数值范围
  static textMatchPhrase(text, query) // 支持 .AND. .OR. 语法的文本匹配
  static runJavaScript(webview, script) // 在 WebView 中执行 JavaScript
  
  // === 弹窗与用户交互 ===
  static confirm(title, message, buttons)     // 确认弹窗
  static input(title, subTitle, items)       // 输入弹窗
  static select(title, options, allowMulti)   // 选择弹窗
  static selectIndex(title, options, allowMulti) // 选择并返回索引
  static waitHUD(message)       // 显示等待提示
  static stopHUD(delay, view)   // 停止等待提示
  
  // === 图像与选择处理 ===
  static genSelection(docController) // 生成选择信息
  static getImageFromSelection() // 获取选中区域图像
  static mergeImages(images, spacing) // 合并多张图片
  static UIImageToNSData(image) // UIImage 转 NSData
  static NSDataToUIImage(data, scale) // NSData 转 UIImage
  
  // === 异步与动画 ===
  static delay(seconds)         // 延迟执行
  static animate(func, time)    // 动画执行
  static undoGrouping(func)     // 撤销分组
  
  // === 通知与事件 ===
  static addObserver(observer, selector, name)
  static addObserverForPopupMenuOnNote(observer, selector)
  static addObserverForClosePopupMenuOnNote(observer, selector)
  static addObserverForPopupMenuOnSelection(observer, selector)
  static addObserverForClosePopupMenuOnSelection(observer, selector)
  static addObserverForProcessNewExcerpt(observer, selector)
  static addObserverForAddonBroadcast(observer, selector)
  static removeObserver(observer, name)
  
  // === 颜色管理 ===
  static getColorIndex(color)   // 颜色名或索引转换
  static colorIndexToString(index) // 颜色索引转字符串
  
  // === 命令执行 ===
  static excuteCommand(command) // 执行 MarginNote 命令
  static openURL(url)           // 打开 URL
  
  // === 数据存储 ===
  static readCloudKey(key)      // 读取 iCloud 键值
  static setCloudKey(key, value) // 设置 iCloud 键值
  static readJSON(path)         // 读取 JSON 文件
  static writeJSON(path, object) // 写入 JSON 文件
  static readText(path)         // 读取文本文件
  static writeText(path, string) // 写入文本文件
  static data2string(data)      // NSData 转字符串
  
  // === 文件路径 ===
  static get dbFolder()         // 数据库文件夹
  static get cacheFolder()      // 缓存文件夹
  static get documentFolder()   // 文档文件夹
  static get tempFolder()       // 临时文件夹
  static get mainPath()         // 插件主路径
  
  // === Markdown 与 AST ===
  static markdown2AST(markdown) // Markdown 转 AST
  static buildTree(tokens)      // 构建树结构
  static processList(items)     // 处理列表项
  
  // === 日期与时间 ===
  static getDateObject()        // 获取日期对象
  
  // === 特殊工具 ===
  static emojiNumber(index)     // 数字转 emoji (0-10)
  static getStatusCodeDescription(code) // HTTP 状态码描述
  static render(template, config) // Mustache 模板渲染
  static createJsonEditor(htmlPath) // 创建 JSON 编辑器
  static moveElement(arr, element, direction) // 移动数组元素
  static countWords(str)        // 统计中英文字数
  static importNotebook(path, merge) // 导入笔记本
  static getRandomElement(arr)  // 从数组中随机获取元素
  static stopHUD(delay, view)   // 停止 HUD 显示
  static userSelect(mainTitle, subTitle, items) // 用户选择弹窗
  
  // === 媒体处理 ===
  static getMediaByHash(hash)   // 根据 hash 获取媒体数据
  static hasMNImages(markdown)  // 检查是否包含 MN 图片
  static isPureMNImages(markdown) // 检查是否纯 MN 图片
  static getMNImageFromMarkdown(markdown) // 从 Markdown 提取 MN 图片
  
  // === 选择的点击信息 ===
  static get popUpNoteInfo()      // 弹出菜单的笔记信息
  static get popUpSelectionInfo() // 弹出菜单的选择区域信息
}
```

**重要属性和常量**:
```javascript
// 当前活动的文本视图（用于检测焦点）
static activeTextView

// 弹出菜单相关信息
static popUpNoteInfo      // 弹出笔记信息
static popUpSelectionInfo  // 弹出选择信息

// 全局状态
static onAlert            // 是否正在显示 alert
static onWaitHUD         // 是否正在显示等待 HUD

// 日志系统
static errorLog = []      // 错误日志数组
static logs = []          // 通用日志数组

// 版本信息缓存
static mnVersion          // MarginNote 版本信息缓存

// 颜色常量映射
static colorOption = [
  "light yellow", "light green", "light blue", "light red",
  "yellow", "green", "blue", "red",
  "orange", "dark green", "dark blue", "deep red",
  "white", "light gray", "dark gray", "purple"
]
```

**常用方法示例**:
```javascript
// 1. 初始化（必须）
MNUtil.init(self.path);

// 2. 显示提示
MNUtil.showHUD("操作成功！");

// 3. 获取当前笔记
let note = MNUtil.getNoteById(noteId, false); // 不显示错误提示

// 4. 错误处理
try {
  // 你的代码
} catch (error) {
  MNUtil.addErrorLog(error, "functionName", {noteId: noteId});
}

// 5. 环境检测
if (MNUtil.isMN4()) {
  // MarginNote 4 特有功能
}
```

### 3. MNNote 类 - 笔记核心类 ⭐⭐⭐⭐⭐

MNNote 是最重要的类之一，提供了 149+ 个属性和方法。

```javascript
class MNNote {
  // === 构造函数（支持多种输入） ===
  constructor(note)  // 支持: MbBookNote对象 / URL字符串 / ID字符串 / 配置对象
  
  // === 静态工厂方法 ===
  static new(note, alert = true)    // 智能创建笔记对象
  static getFocusNote()             // 获取当前焦点笔记
  static getFocusNotes()            // 获取当前焦点笔记（数组形式）
  static getSelectedNotes()         // 获取选中的笔记数组
  
  // === 核心属性 (149+ getter/setter) ===
  get noteId()           // 笔记 ID
  get noteURL()          // 笔记 URL (marginnote4app://note/xxx)
  get title()            // 笔记标题
  get noteTitle()        // 笔记标题（同 title）
  get excerptText()      // 摘录文本
  get comments()         // 评论数组
  get colorIndex()       // 颜色索引 (0-15)
  get parentNote()       // 父笔记
  get childNotes()       // 子笔记数组
  get tags()             // 标签数组
  get modifiedDate()     // 修改时间
  get createDate()       // 创建时间
  
  // === 笔记操作方法 ===
  open()                 // 打开笔记
  copy()                 // 复制笔记
  paste()                // 粘贴为子笔记
  delete(withDescendant = false)  // 删除笔记
  clone()                // 克隆笔记
  merge(note)            // 合并笔记
  refresh()              // 刷新笔记显示
  focusInMindMap(delay)  // 在脑图中聚焦
  
  // === 层级关系管理 ===
  addChild(note)         // 添加子笔记
  removeFromParent()     // 从父笔记移除
  createChildNote(config) // 创建子笔记
  
  // === 评论系统 (50+ 方法) ===
  appendTextComment(comment, index)      // 添加文本评论
  appendMarkdownComment(comment, index)  // 添加 Markdown 评论
  appendHtmlComment(html, text, size, tag, index)  // 添加 HTML 评论
  moveComment(fromIndex, toIndex, msg = false)     // 移动评论（xdyyutils 中默认值已改为 false）
  removeCommentByIndex(index)            // 删除指定评论
  removeCommentsByIndices(indices)       // 批量删除评论
  sortCommentsByNewIndices(arr)          // 重新排序评论
  
  // === 内容操作 ===
  appendTitles(...titles)                // 添加标题
  appendTags(tags)                       // 添加标签
  removeTags(tagsToRemove)               // 删除标签
  appendNoteLink(note, type)             // 添加笔记链接
  getCommentIndex(comment)               // 获取评论索引
  getTextCommentIndex(text)              // 获取文本评论索引
  getCommentIndicesByCondition(condition) // 根据条件获取评论索引数组
  removeCommentsByIndices(indices)       // 批量删除评论
  removeCommentByCondition(condition)    // 根据条件删除评论
  removeAllComments()                    // 删除所有评论
  removeCommentButLinkTag(filter, f)     // 删除评论但保留链接和标签
  tidyupTags()                           // 整理标签（确保在最后）
  clearFormat()                          // 清除格式
  
  // === 更多属性 (getter) ===
  get allNoteText()      // 所有笔记文本
  get allMarkdownText()  // 所有 Markdown 文本
  get allText()          // 所有文本
  get ancestorNodes()    // 祖先节点数组
  get descendantNodes()  // 后代节点对象
  get siblingNotes()     // 兄弟笔记数组
  get startPage()        // 起始页
  get endPage()          // 结束页
  get docTitle()         // 文档标题
  get noteBook()         // 所属笔记本
  get isOCR()            // 是否 OCR 笔记
  get hasInk()           // 是否有手写
  get hasComments()      // 是否有评论
  get hasTags()          // 是否有标签
  get hasChildren()      // 是否有子笔记
  get mindmapBranchColor() // 脑图分支颜色
  
  // === 辅助属性 ===
  get MNComments()       // 评论对象数组 (MNComment 实例)
  get pic()              // 图片数据
  get childMap()         // 子脑图
  get currentChildMap()  // 当前子脑图
  get groupNoteId()      // 组笔记 ID
  get summaryLinks()     // 摘要链接
  
  // === 静态方法 ===
  static clone(noteIdOrConfig)           // 克隆笔记
  static getByNoteId(noteId)             // 根据 ID 获取
  static getByNoteIdFromURL(url)         // 从 URL 获取
}
```

**使用示例**:
```javascript
// 1. 获取笔记
let note = MNNote.getFocusNote();                    // 当前焦点笔记
let note2 = MNNote.new("marginnote4app://note/xxx"); // 通过 URL
let note3 = MNNote.new("6B45B7C5-xxxx");            // 通过 ID

// 2. 基本操作
note.title = "新标题";
note.colorIndex = 2;  // 淡蓝色
note.appendTags(["重要", "待复习"]);

// 3. 评论操作
note.appendTextComment("这是一条评论");
note.appendMarkdownComment("**加粗文本**");
note.moveComment(0, 2);  // 移动第一条到第三位

// 4. 层级操作
let childConfig = {
  title: "子笔记",
  content: "内容",
  colorIndex: 5
};
let child = note.createChildNote(childConfig);
```

### 4. MNComment 类 - 评论系统

支持多种评论类型，管理笔记中的各种内容。

```javascript
class MNComment {
  // === 评论类型（通过 getCommentType 方法动态判断） ===
  // 支持的类型包括：
  // - textComment: 纯文本评论
  // - markdownComment: Markdown 格式评论
  // - imageComment: 图片评论
  // - drawingComment: 手写评论
  // - mergedImageComment: 合并的图片评论（通常是摘录图片）
  // - blankImageComment: 空白图片评论
  // - imageCommentWithDrawing: 带手写的图片评论
  // - htmlComment: HTML 评论
  // - tagComment: 标签评论（以 # 开头）
  // - linkComment: 链接评论
  // - summaryComment: 摘要评论
  
  // === 核心属性 ===
  get type()            // 评论类型
  get text()            // 文本内容
  get markdown()        // Markdown 内容
  get imageData()       // 图片数据
  get index()           // 在笔记中的索引
  get originalNoteId()  // 原始笔记 ID
  
  // === 内容操作 ===
  set text(value)       // 设置文本
  set markdown(value)   // 设置 Markdown
  
  // === 静态方法 ===
  static from(note)     // 从笔记获取所有评论
  static getCommentType(comment) // 根据评论对象判断类型
  static getTypeByIndex(note, index) // 获取指定索引的评论类型
  
  // === 类型判断 ===
  get isTextComment()      // 是否文本评论
  get isMarkdownComment()  // 是否 Markdown 评论
  get isImageComment()     // 是否图片评论
  get isLinkComment()      // 是否链接评论
  get isHtmlComment()      // 是否 HTML 评论
}
```

**评论类型说明**:
- `textComment`: 纯文本评论
- `markdownComment`: Markdown 格式评论
- `imageComment`: 图片评论
- `mergedImageComment`: 合并的图片评论（通常是摘录图片）

### 5. MNConnection 类 - 网络请求与 WebView 管理

提供网络请求、WebDAV 支持和 WebView 控制功能。

```javascript
class MNConnection {
  // === URL 和请求管理 ===
  static genURL(url)                    // 生成 NSURL 对象
  static requestWithURL(url)            // 创建请求对象
  static initRequest(url, options)      // 初始化 HTTP 请求
  static sendRequest(request)           // 发送异步请求
  static fetch(url, options = {})       // 类似浏览器的 fetch API
  
  // === WebView 控制 ===
  static loadRequest(webview, url, desktop)  // 加载 URL
  static loadFile(webview, file, baseURL)    // 加载本地文件
  static loadHTML(webview, html, baseURL)    // 加载 HTML 字符串
  
  // === WebDAV 支持 ===
  static readWebDAVFile(url, username, password)      // 读取 WebDAV 文件
  static uploadWebDAVFile(url, username, password, content)  // 上传到 WebDAV
  
  // === 实用工具 ===
  static btoa(str)                      // Base64 编码
  static getOnlineImage(url, scale=3)   // 下载在线图片
  
  // === ChatGPT API 支持 ===
  static initRequestForChatGPT(history, apikey, url, model, temperature)
}
```

**使用示例**:
```javascript
// 1. 发送 HTTP 请求
let response = await MNConnection.fetch("https://api.example.com/data", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  json: { key: "value" },
  timeout: 30
});

// 2. WebDAV 操作
let fileContent = await MNConnection.readWebDAVFile(
  "https://dav.example.com/file.txt",
  "username",
  "password"
);

// 3. 下载图片
let image = MNConnection.getOnlineImage("https://example.com/image.png");
if (image) {
  note.appendImageComment(image);
}
```

### 6. MNButton 类 - 自定义按钮组件

创建和管理自定义按钮 UI 元素。

```javascript
class MNButton {
  // === 静态属性 ===
  static get highlightColor()   // 高亮颜色
  
  // === 构造函数 ===
  constructor(config = {}, superView)
  
  // === 配置选项 ===
  // config: {
  //   color: string,      // 按钮颜色
  //   title: string,      // 按钮标题
  //   bold: boolean,      // 是否粗体
  //   font: number,       // 字体大小
  //   opacity: number,    // 透明度
  //   radius: number,     // 圆角半径
  //   alpha: number       // Alpha 通道
  // }
}

// 使用示例
let button = new MNButton({
  title: "点击我",
  color: "#2c4d81",
  radius: 8,
  font: 16
}, parentView);
```

### 7. MNDocument 类 - 文档操作接口

管理 PDF 文档的核心类。

```javascript
class MNDocument {
  // === 核心属性 ===
  get docMd5()          // 文档 MD5 标识
  get docTitle()        // 文档标题
  get pageCount()       // 页数
  get currentTopicId()  // 当前笔记本 ID
  
  // === 文档操作 ===
  open(notebookId)      // 在指定笔记本中打开
  textContentsForPageNo(pageNo)  // 获取指定页的文本内容
  
  // === 关联查询 ===
  get tocNotes()        // 目录笔记
  get documentNotebooks()  // 文档笔记本列表
  get studySets()          // 包含此文档的学习集
  
  // === 笔记查询 ===
  documentNotebookInStudySet(notebookId)  // 获取学习集中的文档笔记本
  notesInDocumentInStudySet(notebookId)   // 获取文档在学习集中的笔记
  mainNoteInNotebook(notebookId)          // 获取主笔记
}
```

### 8. MNNotebook 类 - 笔记本管理

管理笔记本（学习集、文档笔记本、复习组）。

```javascript
class MNNotebook {
  // === 静态方法 ===
  static get currentNotebook()       // 当前笔记本
  static allNotebooks()              // 所有笔记本
  static allDocumentNotebooks()      // 所有文档笔记本
  static allStudySets()              // 所有学习集
  static allReviewGroups()           // 所有复习组
  
  // === 核心属性 ===
  get id()              // 笔记本 ID
  get title()           // 标题
  get type()            // 类型: documentNotebook/studySet/reviewGroup
  get url()             // marginnote4app://notebook/xxx
  get notes()           // 包含的笔记数组
  get documents()       // 包含的文档数组
  
  // === 操作方法 ===
  open()                // 打开笔记本
  openDoc(docMd5)       // 在笔记本中打开文档
  importDoc()           // 导入新文档
}
```

### 9. MNExtensionPanel 类 - 扩展面板管理

控制插件的扩展面板 UI。

```javascript
class MNExtensionPanel {
  // 主要通过 MNUtil 的静态方法访问
  // MNUtil.extensionPanelController  // 获取控制器
  // MNUtil.extensionPanelView        // 获取视图
  // MNUtil.extensionPanelOn          // 是否显示
  // MNUtil.toggleExtensionPanel()    // 切换显示/隐藏
}
```

## 🎓 学术扩展 API - xdyyutils.js

> xdyyutils.js 是针对学术场景（特别是数学学科）的深度优化扩展，提供了知识卡片管理、智能链接、中文排版等高级功能。

⚠️ **注意事项**:
- 部分方法重写了 mnutils.js 的默认行为（如 MNUtil.getNoteById 的 alert 参数默认值从 true 改为 false）
- 使用前请确认这些改动符合你的需求

### 核心模块概览

| 模块 | 功能 | 使用场景 |
|------|------|----------|
| **MNMath** | 数学卡片管理系统 | 知识结构化、学术笔记 |
| **HtmlMarkdownUtils** | HTML 样式工具 | 富文本展示、层级管理 |
| **Pangu** | 中文排版优化 | 中英文混排、数学符号 |
| **String.prototype** | 字符串扩展 (85+ 方法) | 文本处理、格式转换 |
| **MNNote.prototype** | 笔记扩展 (30+ 方法) | 工作流、批量操作 |

### MNMath 类 - 数学卡片管理系统 ⭐⭐⭐⭐⭐

#### 13 种知识卡片类型（完整定义）

```javascript
static types = {
  // === 知识结构类 (8种) ===
  定义: {
    refName: '定义',
    prefixName: '定义',
    englishName: 'definition',
    templateNoteId: '78D28C80-C4AC-48D1-A8E0-BF01908F6B60',
    ifIndependent: false,
    colorIndex: 2,  // 淡蓝色
    fields: ["相关思考", "相关链接"]
  },
  命题: {
    refName: '命题',
    prefixName: '命题',
    englishName: 'proposition',
    templateNoteId: 'DDF06F4F-1371-42B2-94C4-111AE7F56CAB',
    ifIndependent: false,
    colorIndex: 10, // 深蓝色
    fields: ["证明", "相关思考", "关键词： ", "相关链接", "应用"]
  },
  例子: {
    refName: '例子',
    prefixName: '例子',
    englishName: 'example',
    templateNoteId: 'DDF06F4F-1371-42B2-94C4-111AE7F56CAB',
    ifIndependent: false,
    colorIndex: 15,  // 紫色
    fields: ["证明", "相关思考", "关键词： ", "相关链接", "应用"]
  },
  反例: {
    refName: '反例',
    prefixName: '反例',
    englishName: 'counterexample',
    templateNoteId: '4F85B579-FC0E-4657-B0DE-9557EDEB162A',
    ifIndependent: false,
    colorIndex: 3,  // 粉色
    fields: ["反例", "相关思考", "关键词： ", "相关链接", "应用"]
  },
  归类: {
    refName: '归类',
    prefixName: '归类',
    englishName: 'classification',
    templateNoteId: '68CFDCBF-5748-448C-91D0-7CE0D98BFE2C',
    ifIndependent: false,
    colorIndex: 0,  // 淡黄色
    fields: ["所属", "相关思考", "包含"]
  },
  思想方法: {
    refName: '思想方法',
    prefixName: '思想方法',
    englishName: 'thoughtMethod',
    templateNoteId: '38B7FA59-8A23-498D-9954-A389169E5A64',
    ifIndependent: false,
    colorIndex: 9,  // 深绿色
    fields: ["原理", "相关思考", "关键词： ", "相关链接", "应用"]
  },
  问题: {
    refName: '问题',
    prefixName: '问题',
    englishName: 'question',
    templateNoteId: 'BED89238-9D63-4150-8EB3-4AAF9179D338',
    ifIndependent: false,
    colorIndex: 1,  // 淡绿色
    fields: ["问题详情", "研究脉络", "研究思路", "研究结论", "相关思考", "相关链接"]
  },
  思路: {
    refName: '思路',
    prefixName: '思路',
    englishName: 'idea',
    templateNoteId: '6FF1D6DB-3349-4617-9972-FC55BFDCB675',
    ifIndependent: true,
    colorIndex: 13,  // 淡灰色
    fields: ["思路详情", "具体尝试", "结论", "相关思考", "相关链接"]
  },
  
  // === 文献管理类 (5种) ===
  作者: {
    refName: '作者',
    prefixName: '作者',
    englishName: 'author',
    templateNoteId: '143B444E-9E4F-4373-B635-EF909248D8BF',
    ifIndependent: false,
    colorIndex: 2,  // 淡蓝色
    fields: ["个人信息", "研究进展", "文献"]
  },
  研究进展: {
    refName: '研究进展',
    prefixName: '研究进展',
    englishName: 'researchProgress',
    templateNoteId: 'C59D8428-68EA-4161-82BE-EA4314C3B5E9',
    ifIndependent: true,
    colorIndex: 6,  // 蓝色
    fields: ["进展详情", "相关思考", "相关作者", "被引用情况"]
  },
  论文: {
    refName: '论文',
    prefixName: '论文',
    englishName: 'paper',
    templateNoteId: '032FC61B-37BD-4A90-AE9D-5A946842F49B',
    ifIndependent: false,
    colorIndex: 15,  // 紫色
    fields: ["文献信息", "相关思考", "符号与约定", "参考文献", "被引用情况"]
  },
  书作: {
    refName: '书作',
    prefixName: '书作',
    englishName: 'book',
    templateNoteId: '032FC61B-37BD-4A90-AE9D-5A946842F49B',
    ifIndependent: false,
    colorIndex: 15,  // 紫色
    fields: ["文献信息", "相关思考", "符号与约定", "参考文献", "被引用情况"]
  },
  文献: {
    refName: '文献',
    prefixName: '文献',
    englishName: 'literature',
    templateNoteId: '032FC61B-37BD-4A90-AE9D-5A946842F49B',
    ifIndependent: false,
    colorIndex: 15,  // 紫色
    fields: ["文献信息", "相关思考", "符号与约定", "参考文献", "被引用情况"]
  }
}
```

**卡片类型属性说明**:
- `refName`: 在 "xxx" 相关 zz 格式中的 zz 部分
- `prefixName`: 在【xxx：yyyy】zzz 格式中的 xxx 部分
- `englishName`: 英文名称
- `templateNoteId`: 模板卡片 ID
- `ifIndependent`: 是否独立卡片（影响标题处理逻辑）
- `colorIndex`: 颜色索引（0-15）
- `fields`: 字段列表

#### 核心制卡方法

```javascript
// 一键制卡（推荐）
static makeNote(note, addToReview = true, reviewEverytime = true)

// 手动制卡流程
static toNoExceptVersion(note)  // 1. 转为非摘录版本
static makeCard(note)           // 2. 执行制卡

// 制卡工作流（8个步骤）
1. renewNote()           // 处理旧版卡片
2. mergeTemplate()       // 合并模板
3. changeTitle()         // 修改标题为【类型 >> 内容】
4. changeNoteColor()     // 设置卡片颜色
5. linkParentNote()      // 建立智能链接
6. refreshNotes()        // 刷新显示
7. addToReview()         // 加入复习
8. focusInMindMap()      // 聚焦卡片
```

#### 智能功能

```javascript
// 智能内容识别
static autoGetNewContentToMoveIndexArr(note)  // 自动识别新添加内容

// 智能链接管理
static linkParentNote(note)     // 自动建立父子链接
static cleanupOldParentLinks()  // 清理失效链接

// 弹窗式交互
static moveCommentsByPopup(note)            // 移动内容
static replaceFieldContentByPopup(note)     // 替换字段内容
```

**使用示例**:
```javascript
// 1. 一键制卡
let note = MNNote.getFocusNote();
MNUtil.undoGrouping(() => {
  MNMath.makeNote(note);  // 自动完成所有步骤
});

// 2. 智能内容整理
MNMath.replaceFieldContentByPopup(note);
// 用户选择：目标字段 → 内容来源（自动识别/其他字段）
```

### HtmlMarkdownUtils 类 - HTML 样式工具

提供丰富的 HTML 样式和图标，支持 5 级层次结构。

```javascript
// 预定义图标
static icons = {
  level1: '🚩', level2: '▸', level3: '▪', level4: '•', level5: '·',
  key: '🔑', alert: '⚠️', danger: '❗❗❗', remark: '📝',
  goal: '🎯', question: '❓', idea: '💡', method: '✨'
}

// 创建带样式的 HTML 文本
static createHtmlMarkdownText(text, type = 'none')

// 使用示例
let html = HtmlMarkdownUtils.createHtmlMarkdownText("重要内容", "danger");
note.appendHtmlComment(html, "重要内容", 16, "danger");
```

### Pangu 类 - 中文排版优化

自动优化中英文混排，基于 [pangu.js](https://github.com/vinta/pangu.js) 规则。

```javascript
class Pangu {
  // === 主要方法 ===
  static spacing(text)              // 自动添加空格优化排版
  static spacingText(text)          // 同 spacing
  static autoSpacingPage()          // 自动优化整个页面
  
  // === 转换规则 ===
  // 1. CJK 字符与英文/数字之间添加空格
  // 2. 处理标点符号间距
  // 3. 统一全角/半角标点
  
  // === 特殊数学符号处理 ===
  // - C[a,b] 格式：单独字母紧跟括号
  // - ∞ 无穷符号特殊处理
  // - ∑ 自动转换为 Σ
}

// 使用示例
let text = "学习JavaScript很有趣！";
let formatted = Pangu.spacing(text);
// 输出: "学习 JavaScript 很有趣！"

// 数学符号示例
Pangu.spacing("设C[a,b]为闭区间");     // "设 C[a,b] 为闭区间"
Pangu.spacing("当n→∞时");              // "当 n→∞ 时"
```

### HtmlMarkdownUtils 类 - HTML 样式工具

提供丰富的 HTML 样式和图标，支持 5 级层次结构。

```javascript
class HtmlMarkdownUtils {
  // === 预定义图标 ===
  static icons = {
    // 层级图标
    level1: '🚩', level2: '▸', level3: '▪', level4: '•', level5: '·',
    
    // 语义图标
    key: '🔑',      // 关键点
    alert: '⚠️',    // 警告
    danger: '❗❗❗', // 危险
    remark: '📝',   // 备注
    goal: '🎯',     // 目标
    question: '❓', // 问题
    idea: '💡',     // 想法
    method: '✨'    // 方法
  }
  
  // === 前缀文本 ===
  static prefix = {
    danger: '',
    alert: '注意：',
    key: '',
    level1: '', level2: '', level3: '', level4: '', level5: '',
    remark: '',
    goal: '',
    question: '',
    idea: '思路：',
    method: '方法：'
  }
  
  // === 样式定义（完整CSS） ===
  static styles = {
    // 危险提示 - 深红背景，粗体
    danger: 'font-weight:700;color:#6A0C0C;background:#FFC9C9;border-left:6px solid #A93226;font-size:1em;padding:8px 15px;display:inline-block;transform:skew(-3deg);box-shadow:2px 2px 5px rgba(0,0,0,0.1);',
    
    // 警告提示 - 橙色边框
    alert: 'background:#FFF;color:#FF8C5A;border:2px solid currentColor;border-radius:3px;padding:6px 12px;font-weight:600;box-shadow:0 1px 3px rgba(255,140,90,0.2);display:inline-block;',
    
    // 关键内容 - 橙色左边框
    key: 'color: #B33F00;background: #FFF1E6;border-left: 6px solid #FF6B35;padding:16px 12px 1px;line-height:2;position:relative;top:6px;display:inline-block;font-family:monospace;margin-top:-2px;',
    
    // 5级层次样式
    level1: "font-weight:600;color:#1E40AF;background:linear-gradient(15deg,#EFF6FF 30%,#DBEAFE);border:2px solid #3B82F6;border-radius:12px;padding:10px 18px;display:inline-block;box-shadow:2px 2px 0px #BFDBFE,4px 4px 8px rgba(59,130,246,0.12);position:relative;margin:4px 8px;",
    level2: "font-weight:600;color:#4F79A3; background:linear-gradient(90deg,#F3E5F5 50%,#ede0f7);font-size:1.1em;padding:6px 12px;border-left:4px solid #7A9DB7;transform:skew(-1.5deg);box-shadow:1px 1px 3px rgba(0,0,0,0.05);margin-left:40px;position:relative;",
    level3: "font-weight:500;color:#7A9DB7;background:#E8F0FE;padding:4px 10px;border-radius:12px;border:1px solid #B3D4FF;font-size:0.95em;margin-left:80px;position:relative;",
    level4: "font-weight:400;color:#9DB7CA;background:#F8FBFF;padding:3px 8px;border-left:2px dashed #B3D4FF;font-size:0.9em;margin-left:120px;position:relative;",
    level5: "font-weight:300;color:#B3D4FF;background:#FFFFFF;padding:2px 6px;border-radius:8px;border:1px dashed #B3D4FF;font-size:0.85em;margin-left:160px;position:relative;",
    
    // 备注 - 黄色左边框
    remark: 'background:#F5E6C9;color:#6d4c41;display:inline-block;border-left:5px solid #D4AF37;padding:2px 8px 3px 12px;border-radius:0 4px 4px 0;box-shadow:1px 1px 3px rgba(0,0,0,0.08);margin:0 2px;line-height:1.3;vertical-align:baseline;position:relative;',
    
    // 目标 - 绿色圆角按钮样式
    goal: 'font-weight:900;font-size:0.7em;color:#F8FDFF;background:#00BFA5 radial-gradient(circle at 100% 0%,#64FFDA 0%,#009688 00%);padding:12px 24px;border-radius:50px;display:inline-block;position:relative;box-shadow:0 4px 8px rgba(0, 191, 166, 0.26);text-shadow:0 1px 3px rgba(0,0,0,0.35);border:2px solid rgba(255,255,255,0.3)',
    
    // 问题 - 紫色双边框
    question: 'font-weight:700;color:#3D1A67;background:linear-gradient(15deg,#F8F4FF 30%,#F1E8FF);border:3px double #8B5CF6;border-radius:16px 4px 16px 4px;padding:14px 22px;display:inline-block;box-shadow:4px 4px 0px #DDD6FE,8px 8px 12px rgba(99,102,241,0.12);position:relative;margin:4px 8px;',
    
    // 思路 - 蓝色虚线边框
    idea: 'font-weight:600;color:#4A4EB2;background:linear-gradient(15deg,#F0F4FF 30%,#E6EDFF);border:2px dashed #7B7FD1;border-radius:12px;padding:10px 18px;display:inline-block;box-shadow:0 0 0 2px rgba(123,127,209,0.2),inset 0 0 10px rgba(123,127,209,0.1);position:relative;margin:4px 8px;',
    
    // 方法 - 深蓝色块状样式
    method: 'display:block;font-weight:700;color:#FFFFFF;background:linear-gradient(135deg,#0D47A1 0%,#082C61 100%);font-size:1.3em;padding:12px 20px 12px 24px;border-left:10px solid #041E42;margin:0 0 12px 0;border-radius:0 6px 6px 0;box-shadow:0 4px 10px rgba(0,0,0,0.25),inset 0 0 10px rgba(255,255,255,0.1);text-shadow:1px 1px 2px rgba(0,0,0,0.35);position:relative;'
  }
  
  // === 主要方法 ===
  static createHtmlMarkdownText(text, type = 'none')
  static getHtmlCommentTemplate(type, text = "")
  static getSpanTemplate(type)
  static getSpanContent(comment)          // 获取 span 标签的内容
  static getSpanTextContent(comment)      // 获取纯文本内容（不含图标和前缀）
  static getSpanType(comment)            // 获取 span 的类型
  static getSpanNextLevelType(currentType)
  static getSpanLastLevelType(type)      // 获取上一级类型
  static parseLeadingDashes(text)        // 解析前导短横线数量
  
  // === 问答功能 ===
  static async addQuestionHtmlMDComment(note, questionPlaceholder = "❓ ", answerPlaceholder = "💡 ", explanationPlaceholder = "✍︎ ")
  static createQuestionHtml(question, answer, explanation)  // 创建问答HTML
  static updateQuestionPart(comment, part, newContent)      // 更新问答部分
  static parseQuestionHtml(html)                           // 解析问答HTML
  static isQuestionComment(comment)                        // 判断是否问答评论
}

// 使用示例
let html = HtmlMarkdownUtils.createHtmlMarkdownText("重要内容", "danger");
note.appendHtmlComment(html, "重要内容", 16, "danger");

// 创建多级结构
let level1 = HtmlMarkdownUtils.createHtmlMarkdownText("第一级", "level1");
let level2 = HtmlMarkdownUtils.createHtmlMarkdownText("第二级", "level2");

// 问答功能示例
await HtmlMarkdownUtils.addQuestionHtmlMDComment(note);  // 弹窗收集问答内容
let qHtml = HtmlMarkdownUtils.createQuestionHtml("什么是函数？", "函数是...", "详细解释...");
```

### String.prototype 扩展 

xdyyutils.js 为 String 原型添加了以下方法：

```javascript
// === 判断类方法 ===
str.isPositiveInteger()         // 是否正整数
str.ifKnowledgeNoteTitle()      // 是否知识卡片标题格式【xxx：xxx】
str.isKnowledgeNoteTitle()      // 同上
str.ifReferenceNoteTitle()      // 是否文献笔记标题【文献：xxx】
str.ifWithBracketPrefix()       // 是否有【】前缀
str.ifGreenClassificationNoteTitle()  // 是否绿色归类卡片标题 "xxx" 相关 xxx
str.isGreenClassificationNoteTitle()  // 同上
str.ifYellowClassificationNoteTitle() // 是否黄色归类卡片标题 "xxx"："xxx" 相关 xxx
str.isYellowClassificationNoteTitle() // 同上
str.isClassificationNoteTitle() // 是否归类卡片标题（绿色或黄色）

// === 笔记 ID/URL 相关 ===
str.ifNoteIdorURL()            // 是否笔记 ID 或 URL
str.isNoteIdorURL()            // 同上（多个别名）
str.ifValidNoteId()            // 是否有效的笔记 ID（UUID 格式）
str.isValidNoteId()            // 同上
str.ifValidNoteURL()           // 是否有效的笔记 URL
str.isValidNoteURL()           // 同上
str.isLink()                   // 是否链接（同 isValidNoteURL）
str.ifNoteBookId()             // 是否笔记本 ID

// === 转换类方法 ===
str.toKnowledgeNotePrefix()     // 获取知识卡片的前缀部分
str.toKnowledgeNoteTitle()      // 获取知识卡片的标题部分（去除【】前缀）
str.toReferenceNoteTitle()      // 获取文献笔记的标题部分
str.toReferenceNoteTitlePrefixContent() // 获取文献卡片标题的前缀内容
str.toNoBracketPrefixContent()  // 获取无前缀的部分
str.toNoBracketPrefixContentFirstTitleLinkWord() // 获取无前缀部分的第一个词
str.toBracketPrefixContent()    // 获取前缀的内容
str.toBracketPrefixContentArrowSuffix() // 【xxx】yyy 变成 【xxx→yyy】
str.toGreenClassificationNoteTitle()    // 获取绿色归类卡片的标题
str.toGreenClassificationNoteTitleType() // 获取绿色归类卡片的类型
str.toYellowClassificationNoteTitle()   // 获取黄色归类卡片的标题
str.toYellowClassificationNoteTitleType() // 获取黄色归类卡片的类型
str.toClassificationNoteTitle()  // 获取归类卡片的标题
str.toClassificationNoteTitleType() // 获取归类卡片的类型
str.toNoteURL()                 // ID 或 URL 统一转为 URL
str.toNoteBookId()              // 转为笔记本 ID
str.toNoteId()                  // URL 或 ID 统一转为 ID
str.toNoteID()                  // 同上

// === 文本处理 ===
str.toDotPrefix()               // 转为 "- xxx" 格式
str.removeDotPrefix()           // 移除 "- " 前缀
str.splitStringByFourSeparators() // 按逗号、分号（中英文）分割
str.parseCommentIndices(totalComments) // 解析评论索引（支持范围、XYZ）
str.toTitleCasePro()            // 智能标题大小写转换
```

**使用示例**:
```javascript
// 1. 判断和验证
"【定义 >> 函数】连续性".ifKnowledgeNoteTitle()  // true
"marginnote4app://note/xxx".isNoteIdorURL()     // true
"123".isPositiveInteger()                        // true

// 2. 格式转换
"1,3-5,Y,Z".parseCommentIndices(10)  // [1,3,4,5,9,10]
"ABCD-1234".toNoteURL()  // "marginnote4app://note/ABCD-1234"
"hello world".toTitleCasePro()  // "Hello World"

// 3. 文本处理
"【定义 >> 函数】连续性".toKnowledgeNoteTitle()  // "函数"
"- 内容".removeDotPrefix()  // "内容"
"a,b；c;d".splitStringByFourSeparators()  // ["a", "b", "c", "d"]
```

### MNNote.prototype 扩展

xdyyutils.js 为 MNNote 原型添加了以下方法：

```javascript
// === 笔记类型判断 ===
note.ifReferenceNote()          // 是否文献笔记（标题以【文献或【参考文献开头）
note.ifOldReferenceNote()       // 是否旧版文献笔记
note.ifTemplateOldVersion()     // 是否旧模板制作的卡片

// === 批量操作 ===
note.pasteChildNotesByIdArr(["id1", "id2", "id3"])  // 批量粘贴子笔记
note.pasteChildNoteById(id)     // 粘贴单个子笔记
note.deleteCommentsByPopup()    // 弹窗选择删除评论
note.deleteCommentsByPopupAndMoveNewContentTo(target, toBottom) // 删除评论并移动新内容
note.clearAllComments()         // 清空所有评论
note.removeCommentsByTypes(types) // 按类型删除评论（link/paint/text/markdown/html/excerpt）
note.removeCommentsByType(type) // 同上（单数形式）
note.removeCommentsByOneType(type) // 删除单一类型
note.removeCommentsByText(text) // 根据文本内容删除评论
note.removeCommentsByTrimText(text) // 根据去空格后的文本删除

// === HTML 块操作 ===
note.moveHtmlBlock(htmltext, toIndex) // 移动 HTML 块到指定位置
note.moveHtmlBlockToBottom(htmltext)  // 移动 HTML 块到底部
note.moveHtmlBlockToTop(htmltext)     // 移动 HTML 块到顶部
note.getHtmlBlockIndexArr(htmltext)   // 获取 HTML 块索引数组
note.getHtmlBlockContentIndexArr(htmltext) // 获取块内容索引数组（不含 HTML 本身）
note.getHtmlBlockTextContentArr(htmltext)  // 获取块文本内容数组
note.getHtmlCommentIndex(htmlcomment)      // 获取 HTML 评论索引
note.getIncludingHtmlCommentIndex(htmlComment) // 获取包含特定文本的 HTML 评论索引
note.getNextHtmlCommentIndex(htmltext)     // 获取下一个 HTML 评论索引
note.getHtmlCommentsIndexArr()             // 获取所有 HTML 评论索引数组

// === 链接管理 ===
note.hasLink(link)              // 是否有指定链接
note.LinkGetType(link)          // 获取链接类型（"Double"/"Single"/"NoLink"）
note.LinkIfSingle(link)         // 是否单向链接
note.LinkIfDouble(link)         // 是否双向链接
note.renewLinks()               // 更新链接（别名：LinkRenew/renewLink/LinksRenew）
note.clearFailedLinks()         // 清理失效链接
note.fixProblemLinks()          // 修复问题链接
note.linkRemoveDuplicatesAfterIndex(startIndex) // 去重指定索引后的链接
note.convertLinksToMN4Version() // 转换链接到 MN4 版本
note.getTextCommentsIndexArr(text) // 获取文本评论索引数组
note.getLinkCommentsIndexArr(link) // 获取链接评论索引数组

// === 内容合并 ===
note.mergeInto(targetNote, htmlType)      // 合并到目标笔记
note.mergeIntoAndMove(targetNote, targetIndex, htmlType) // 合并并移动到指定位置
note.mergIntoAndRenewReplaceholder(targetNote, htmlType) // 合并并更新占位符

// === 特殊功能 ===
note.toBeProgressNote()         // 转为进度卡片（灰色）
note.toBeIndependent()          // 让卡片独立出来
note.move()                     // 移动卡片（主要用于文献卡片）
note.moveProofDown()            // 把证明内容移到最下方
note.moveToInput()              // 移动到输入区
note.getTitleLinkWordsArr()     // 获取标题的所有链接词数组
note.getFirstTitleLinkWord()    // 获取第一个标题链接词
note.generateCustomTitleLinkFromFirstTitlelinkWord(keyword) // 生成自定义标题链接
note.ifCommentsAllLinksByIndexArr(indexArr) // 检测评论是否全是链接
note.getProofHtmlCommentIndexByNoteType(type) // 获取证明相关 HTML 索引
note.getProofNameByType(type)   // 获取证明名称
note.getRenewProofHtmlCommentByNoteType(type) // 更新证明 HTML

// === 批量移动和更新 ===
note.moveCommentsByIndexArr(indexArr, toIndex) // 批量移动评论
note.renew()                    // 更新笔记（别名：renewNote/renewCard）
note.refresh(delay)             // 刷新笔记显示
note.refreshAll(delay)          // 刷新笔记及其父子笔记

// === 工具方法 ===
note.renewHtmlCommentFromId(comment, id) // 更新 HTML 评论（从模板 ID）
note.mergeClonedNoteFromId(id)  // 合并克隆的笔记
```

**使用示例**:
```javascript
// 1. 批量操作
note.pasteChildNotesByIdArr(["id1", "id2", "id3"]);
note.removeCommentsByTypes(["link", "paint"]);  // 删除链接和手写

// 2. HTML 块操作
let blocks = note.getHtmlBlockIndexArr("证明：");
note.moveHtmlBlockToBottom("证明：");  // 移动证明块到底部

// 3. 链接管理
if (note.hasLink(targetNote.noteURL)) {
  if (note.LinkIfDouble(targetNote.noteURL)) {
    console.log("双向链接");
  }
}

// 4. 内容合并
let targetNote = MNNote.getFocusNote();
selectedNotes.forEach(n => n.mergeInto(targetNote, "level1"));
```

## 🎨 设计模式与架构

### 核心设计模式

1. **静态工具类模式**
   - 所有核心功能通过静态方法提供
   - 无需实例化，直接调用
   - 例：`MNUtil.showHUD()`, `MNMath.makeNote()`

2. **工厂模式**
   - 智能对象创建，自动类型识别
   - 例：`MNNote.new()` 支持 ID/URL/对象输入

3. **装饰器模式**
   - 原型扩展增强原有功能
   - 例：String.prototype 和 MNNote.prototype 扩展

4. **策略模式**
   - 不同卡片类型的差异化处理
   - 例：归类卡片特殊的链接规则

5. **观察者模式**
   - 日志系统的事件通知机制
   - 例：错误自动记录和复制

### 性能优化策略

```javascript
// 1. 懒加载 - 按需加载系统组件
static get studyController() {
  if (!this._studyController) {
    this._studyController = this.app.studyController(this.currentWindow);
  }
  return this._studyController;
}

// 2. 批量操作 - 减少 API 调用
note.appendTextComments("评论1", "评论2", "评论3");  // 一次调用
note.removeCommentsByIndices([1, 3, 5]);             // 批量删除

// 3. 撤销分组 - 支持批量撤销
MNUtil.undoGrouping(() => {
  // 多个操作作为一个撤销单元
  note1.title = "新标题";
  note2.colorIndex = 5;
  note3.addTag("重要");
});

// 4. 索引优化 - 从后往前删除
let indices = [1, 3, 5].sort((a, b) => b - a);
indices.forEach(i => note.removeCommentByIndex(i));
```

## 💡 最佳实践

### 1. 初始化与环境检测

```javascript
// 插件入口 main.js
JSB.require('mnutils');
JSB.require('xdyyutils');  // 如需学术功能

// 初始化（必须）
MNUtil.init(self.path);

// 环境检测
if (MNUtil.isMN4()) {
  // MarginNote 4 特有功能
}

// 版本兼容处理
let version = MNUtil.version;
if (version.version >= "3.7.21") {
  // 使用新 API
}
```

### 2. 错误处理与日志

```javascript
// 统一错误处理模式
function safeExecute(func, funcName) {
  try {
    return func();
  } catch (error) {
    MNUtil.addErrorLog(error, funcName, {
      noteId: MNNote.getFocusNote()?.noteId,
      timestamp: new Date().toISOString()
    });
    MNUtil.showHUD("操作失败，错误已记录");
    return null;
  }
}

// 使用示例
safeExecute(() => {
  let note = MNNote.getFocusNote();
  MNMath.makeNote(note);
}, "makeNote");
```

### 3. 用户体验优化

```javascript
// 1. 减少弹窗干扰
let note = MNUtil.getNoteById(noteId, false);  // 静默模式

// 2. 使用 HUD 代替 alert
MNUtil.showHUD("操作成功", 1.5);  // 1.5秒后自动消失

// 3. 批量操作前显示等待提示
MNUtil.waitHUD("正在处理，请稍候...");
// 执行耗时操作
MNUtil.showHUD("处理完成");

// 4. 操作完成后刷新
note.refresh();
MNUtil.refreshAfterDBChange();
```

### 4. 内存管理

```javascript
// 1. 及时释放大对象
let largeData = processData();
// 使用完毕后
largeData = null;

// 2. 避免循环引用
note.customData = {
  // 不要存储 note 自身的引用
  noteId: note.noteId  // 只存储 ID
};

// 3. 使用弱引用存储临时数据
let cache = new WeakMap();
cache.set(note.note, tempData);
```

## 🔧 高级主题

### 弹窗 API 使用

```javascript
// 标准弹窗调用方式
UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
  "选择操作",          // 标题
  "请选择一个选项",    // 消息
  0,                  // 样式: 0=普通, 1=密码, 2=输入框
  "取消",             // 取消按钮
  ["选项1", "选项2"], // 其他按钮
  (alert, buttonIndex) => {
    if (buttonIndex === 0) return;  // 取消
    // buttonIndex >= 1 对应其他按钮
    let selected = ["选项1", "选项2"][buttonIndex - 1];
  }
);
```

### 异步操作处理

```javascript
// 使用 delay 处理异步
MNUtil.delay(0.5).then(() => {
  // 0.5秒后执行
  let note = MNNote.getFocusNote();
  note.focusInMindMap();
});

// 链式异步操作
async function processNotes() {
  let notes = MNNote.getSelectNotes();
  for (let note of notes) {
    MNMath.makeNote(note);
    await MNUtil.delay(0.2);  // 避免卡顿
  }
  MNUtil.showHUD(`处理完成 ${notes.length} 个笔记`);
}
```

### 文件路径处理

```javascript
// 使用绝对路径
let imagePath = MNUtil.mainPath + "/images/icon.png";

// 检查文件存在
if (NSFileManager.defaultManager().fileExistsAtPath(imagePath)) {
  // 处理文件
}

// 创建目录
MNUtil.createFolder(MNUtil.documentFolder + "/MyPlugin");
```

## ⚠️ 注意事项

### 1. 中文标点符号
- **重要**: 使用 `""` 而不是 `""`
- 使用 `Pangu.spacing()` 自动处理中英文间距
- 数学符号需要特殊处理（∞、∑ 等）

### 2. API 兼容性
```javascript
// MN3 到 MN4 的主要变化
- marginnote3app:// → marginnote4app://
- 某些 API 方法名变化
- 使用 MNUtil.isMN4() 进行版本判断
```

### 3. 性能考虑
- 避免在循环中频繁调用 API
- 大批量操作使用 `undoGrouping`
- 适当使用 `delay` 避免界面卡顿
- 注意内存泄漏，及时释放大对象

### 4. 调试技巧
```javascript
// 1. 使用日志系统
MNUtil.log({
  message: "调试信息",
  level: "DEBUG",
  detail: { noteId: note.noteId }
});

// 2. 复制对象到剪贴板查看
MNUtil.copyJSON({
  note: note.noteTitle,
  comments: note.comments.length
});

// 3. 错误自动复制
// MNUtil.addErrorLog 会自动复制错误信息
```

## 📚 API 使用示例

```javascript
// === 基础操作 ===
// 获取当前笔记
let note = MNNote.getFocusNote();
let notes = MNNote.getSelectNotes();

// 创建新笔记
let newNote = MNNote.new({
  title: "新笔记",
  content: "内容",
  colorIndex: 5,
  tags: ["重要", "待办"]
});

// === 评论操作 ===
note.appendTextComment("普通文本");
note.appendMarkdownComment("**Markdown** 文本");
note.appendHtmlComment(html, "显示文本", 16, "style");

// === 批量操作 ===
MNUtil.undoGrouping(() => {
  notes.forEach(note => {
    note.colorIndex = 3;
    note.appendTags(["已处理"]);
  });
});

// === 网络请求 ===
let response = await MNConnection.fetch("https://api.example.com/data", {
  method: "POST",
  json: { key: "value" }
});

// === 菜单创建 ===
let menu = new Menu(button, self, 250);
menu.addMenuItem("复制", "copyNote:", note);
menu.addMenuItem("制卡", "makeCard:", note, note.isCard);
menu.show();

// === 学术功能（需要 xdyyutils）===
if (typeof MNMath !== 'undefined') {
  MNMath.makeNote(note);  // 制作知识卡片
  let formatted = Pangu.spacing(note.title);  // 优化中文排版
}
```

## 📊 完整 API 快速参考表

| 类名 | 核心功能 | 最常用的 API |
|------|----------|-------------|
| **MNUtil** | 系统工具 | `showHUD()`, `copy()`, `getNoteById()`, `delay()`, `undoGrouping()` |
| **MNNote** | 笔记操作 | `getFocusNote()`, `getSelectedNotes()`, `new()`, `title`, `colorIndex`, `appendTextComment()` |
| **MNComment** | 评论管理 | `text`, `type`, `from()`, `getCommentType()` |
| **MNNotebook** | 笔记本 | `currentNotebook`, `notes`, `open()`, `type` |
| **MNDocument** | 文档 | `docMd5`, `pageCount`, `open()`, `textContentsForPageNo()` |
| **MNConnection** | 网络 | `fetch()`, `readWebDAVFile()`, `getOnlineImage()` |
| **Menu** | 菜单 UI | `addMenuItem()`, `show()`, `dismiss()` |
| **MNButton** | 按钮 UI | `new(config)` |
| **MNMath** | 知识卡片 | `makeNote()`, `types.*`, `linkParentNote()` |
| **Pangu** | 中文排版 | `spacing()` |

## ⚠️ 重要说明

1. **框架已默认加载**: 在其他插件项目中，MNUtils 已经被默认加载，可以直接使用上述所有类和方法。

2. **初始化要求**: 使用 MNUtils 前必须调用 `MNUtil.init(self.path)`。

3. **版本兼容**: 使用 `MNUtil.isMN4()` 和 `MNUtil.isMN3()` 判断版本。

4. **方法重写**: xdyyutils.js 修改了部分默认行为

### 📝 xdyyutils.js 方法重写说明

xdyyutils.js 为了更好地支持学术场景，重写了 mnutils.js 中的一些默认行为：

| 被重写的方法 | 原默认值 | 新默认值 | 影响说明 |
|------------|---------|----------|---------|
| `MNUtil.getNoteById(noteId, alert)` | alert = **true** | alert = **false** | 静默模式，不显示错误弹窗 |
| `MNNote.prototype.moveComment(from, to, msg)` | msg = **true** | msg = **false** | 移动评论时不显示提示 |

**注意**: 如果你的插件依赖原有的默认行为，请显式传入参数：
```javascript
// 显式使用原默认行为
MNUtil.getNoteById(noteId, true);   // 显示错误弹窗
note.moveComment(0, 2, true);        // 显示移动提示
```

## 🎯 总结

MNUtils 框架为 MarginNote 插件开发提供了：

1. **完整的 API 封装**: 从基础到高级的全覆盖
2. **学术场景优化**: 特别针对数学和科研需求
3. **最佳实践指导**: 经过验证的开发模式
4. **强大的扩展能力**: 支持各种自定义需求

通过掌握这个框架，你可以：
- 快速开发功能强大的插件
- 提供优秀的用户体验
- 构建复杂的知识管理系统
- 为 MarginNote 生态贡献力量

记住：**MNUtils 不仅是一个插件，更是一个强大的开发平台**。