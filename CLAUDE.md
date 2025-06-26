你现在是一位 MarginNote4 插件开发专家。

# ✅ MarginNote4 插件开发框架 - MNUtils API 参考指南

> **重要**: MNUtils 不仅是一个插件，更是 MarginNote4 插件开发的核心 API 框架。本指南详细记录了所有 API 接口、设计模式和最佳实践，为插件开发者提供完整的技术参考。

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

### 基础集成
```javascript
// 1. 在 mnaddon.json 中声明依赖
{
  "dependencies": {
    "mnutils": "latest",
    "xdyyutils": "latest"  // 可选：学术场景扩展
  }
}

// 2. 在 main.js 中初始化
JSB.require('mnutils');
JSB.require('xdyyutils');  // 如需学术功能
MNUtil.init(self.path);

// 3. 开始使用 API
let focusNote = MNNote.getFocusNote();
MNUtil.showHUD("Hello MarginNote!");
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

### 🔧 类架构总览

| 类名 | 代码行数 | 主要功能 | 使用频率 |
|------|----------|----------|----------|
| **Menu** | 1-139 | 弹出菜单 UI | ⭐⭐⭐ |
| **MNUtil** | 140-2787 | 核心工具类，304+ 静态方法 | ⭐⭐⭐⭐⭐ |
| **MNConnection** | 2788-3171 | 网络请求与 WebView | ⭐⭐ |
| **MNButton** | 3172-3754 | 自定义按钮组件 | ⭐⭐⭐ |
| **MNDocument** | 3755-3879 | 文档操作 | ⭐⭐⭐ |
| **MNNotebook** | 3880-4172 | 笔记本管理 | ⭐⭐⭐⭐ |
| **MNNote** | 4173-6337 | 笔记核心类，149+ 属性方法 | ⭐⭐⭐⭐⭐ |
| **MNComment** | 6338-6757 | 评论系统，支持 8 种类型 | ⭐⭐⭐⭐ |
| **MNExtensionPanel** | 6758+ | 扩展面板管理 | ⭐⭐ |

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
  show()                       // 显示菜单（自动调整位置避免超出屏幕）
  dismiss()                    // 关闭菜单
  
  // 静态方法
  static item(title, selector, params, checked)  // 快速创建菜单项
  static dismissCurrentMenu()  // 关闭当前显示的菜单
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

#### 2. MNUtil 类 - 核心工具类 ⭐⭐⭐⭐⭐

MNUtil 是整个框架的核心，提供了 304+ 个静态方法，涵盖了插件开发的方方面面。

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
}
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

#### 3. MNNote 类 - 笔记核心类 ⭐⭐⭐⭐⭐

MNNote 是最重要的类之一，提供了完整的笔记操作功能。

```javascript
class MNNote {
  // === 构造函数（支持多种输入） ===
  constructor(note)  // 支持: MbBookNote对象 / URL字符串 / ID字符串 / 配置对象
  
  // === 静态工厂方法 ===
  static new(note, alert = true)    // 智能创建笔记对象
  static getFocusNote()             // 获取当前焦点笔记
  static getSelectNotes()           // 获取选中的笔记数组
  
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
  moveComment(fromIndex, toIndex, msg = true)      // 移动评论
  removeCommentByIndex(index)            // 删除指定评论
  removeCommentsByIndices(indices)       // 批量删除评论
  sortCommentsByNewIndices(arr)          // 重新排序评论
  
  // === 内容操作 ===
  appendTitles(...titles)                // 添加标题
  appendTags(tags)                       // 添加标签
  removeTags(tagsToRemove)               // 删除标签
  appendNoteLink(note, type)             // 添加笔记链接
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

#### 4. MNComment 类 - 评论系统

支持 8 种评论类型，提供了丰富的内容管理功能。

```javascript
class MNComment {
  // === 评论类型常量 ===
  static types = {
    TEXT: "textComment",
    MARKDOWN: "markdownComment", 
    IMAGE: "imageComment",
    DRAWING: "drawingComment",
    MERGED_IMAGE: "mergedImageComment",
    BLANK_IMAGE: "blankImageComment",
    IMAGE_WITH_DRAWING: "imageCommentWithDrawing",
    HTML: "htmlComment"
  }
  
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
}
```

**评论类型说明**:
- `textComment`: 纯文本评论
- `markdownComment`: Markdown 格式评论
- `imageComment`: 图片评论
- `mergedImageComment`: 合并的图片评论（通常是摘录图片）

### 其他重要类

- **MNConnection**: 网络请求和 WebView 管理
- **MNButton**: 自定义按钮组件
- **MNDocument**: 文档操作接口
- **MNNotebook**: 笔记本管理
- **MNExtensionPanel**: 扩展面板控制

## 🎓 学术扩展 API - xdyyutils.js

> xdyyutils.js 是针对学术场景（特别是数学学科）的深度优化扩展，提供了知识卡片管理、智能链接、中文排版等高级功能。

### 核心模块概览

| 模块 | 功能 | 使用场景 |
|------|------|----------|
| **MNMath** | 数学卡片管理系统 | 知识结构化、学术笔记 |
| **HtmlMarkdownUtils** | HTML 样式工具 | 富文本展示、层级管理 |
| **Pangu** | 中文排版优化 | 中英文混排、数学符号 |
| **String.prototype** | 字符串扩展 (85+ 方法) | 文本处理、格式转换 |
| **MNNote.prototype** | 笔记扩展 (30+ 方法) | 工作流、批量操作 |

### MNMath 类 - 数学卡片管理系统 ⭐⭐⭐⭐⭐

#### 13 种知识卡片类型

```javascript
static types = {
  // === 知识结构类 (8种) ===
  定义: { 
    colorIndex: 2,    // 淡蓝色
    fields: ["相关思考", "相关链接"]
  },
  命题: { 
    colorIndex: 10,   // 深蓝色
    fields: ["证明", "相关思考", "关键词", "相关链接", "应用"]
  },
  例子: { colorIndex: 15 },  // 紫色
  反例: { colorIndex: 3 },   // 粉色
  归类: { colorIndex: 0 },   // 淡黄色 - 特殊：管理父子关系
  思想方法: { colorIndex: 9 }, // 深绿色
  问题: { colorIndex: 1 },   // 淡绿色
  思路: { colorIndex: 13 },  // 淡灰色
  
  // === 文献管理类 (5种) ===
  作者: { colorIndex: 11 },  // 橙色
  研究进展: { colorIndex: 7 }, // 青色
  论文: { colorIndex: 8 },   // 蓝色
  书作: { colorIndex: 14 },  // 深橙色
  文献: { colorIndex: 6 }    // 青绿色
}
```

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

自动优化中英文混排，处理数学符号。

```javascript
// 自动添加空格，处理标点
let formatted = Pangu.spacing("学习JavaScript很有趣！");
// 输出: "学习 JavaScript 很有趣！"

// 特殊数学符号处理
// - C[a,b] 单独字母紧跟括号
// - ∞ 无穷符号特殊处理
// - ∑ 转换为 Σ
```

### String.prototype 扩展 (85+ 方法)

```javascript
// === 智能判断 ===
"【定义 >> 函数】连续性".ifKnowledgeNoteTitle()  // true
"marginnote4app://note/xxx".isNoteIdorURL()     // true

// === 格式转换 ===
"1,3-5,Y,Z".parseCommentIndices(10)  // [1,3,4,5,9,10]
"ABCD-1234".toNoteURL()  // "marginnote4app://note/ABCD-1234"

// === 标题处理 ===
"【定义 >> 函数】连续性".toKnowledgeNoteTitle()  // "函数"
```

### MNNote.prototype 扩展 (30+ 方法)

```javascript
// === 批量操作 ===
note.pasteChildNotesByIdArr(["id1", "id2", "id3"])
note.deleteCommentsByPopup()    // 弹窗选择删除

// === 内容操作 ===
note.clearAllComments()         // 清空所有评论
note.moveCommentsByIndexArr([1,3,5], 0)  // 批量移动
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

## 🚀 完整开发示例

### 创建一个简单的插件

```javascript
// main.js
JSB.require('mnutils');
JSB.require('xdyyutils');

JSB.defineClass('MyPlugin', {
  // 插件信息
  pluginName: "我的插件",
  pluginVersion: "1.0.0",
  
  // 初始化
  init: function() {
    MNUtil.init(self.path);
    return self;
  },
  
  // 查询命令
  queryAddonCommandStatus: function() {
    let note = MNNote.getFocusNote();
    if (!note) return null;
    
    return [{
      title: "制作知识卡片",
      object: self,
      selector: "makeCard:",
      param: note.noteId
    }];
  },
  
  // 执行命令
  makeCard: function(noteId) {
    MNUtil.undoGrouping(() => {
      try {
        let note = MNNote.new(noteId);
        if (!note) {
          MNUtil.showHUD("未找到笔记");
          return;
        }
        
        // 使用学术扩展制卡
        MNMath.makeNote(note);
        MNUtil.showHUD("制卡完成");
        
      } catch (error) {
        MNUtil.addErrorLog(error, "makeCard");
      }
    });
  }
});
```

## 📚 进阶资源

- [更底层的 MarginNote API](https://ohmymn.marginnote.cn/api/)

### 学习路径
1. **入门**: 熟悉基本 API，创建简单功能
2. **进阶**: 掌握评论系统，学习批量操作
3. **高级**: 理解设计模式，优化性能
4. **专家**: 开发复杂工作流，贡献框架代码

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