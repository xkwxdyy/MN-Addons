# ✅ MN-Addon 项目开发规范

> 本规范适用于 MN-Addon 项目的全部开发任务，条款为强制性，除非用户显式豁免。
> 如果你已经了解所有的规范，你需要在用户第一次进行对话时先说明 "我已充分了解 MN-Addon 项目的开发与协作规范。"，随后再执行用户需求。

## 目录

1. [项目概述](#📌-项目概述)
2. [开发原则](#🎯-开发原则)
3. [MarginNote4 核心概念](#📚-marginnote4-核心概念)
4. [技术栈](#🔧-技术栈)
5. [子项目规范](#📋-子项目规范)
6. [快速开始](#🚀-快速开始)
7. [代码规范](#📝-代码规范)
8. [调试技巧](#🔍-调试技巧)
9. [贡献指南](#🤝-贡献指南)
10. [插件生命周期](#🔄-插件生命周期)
11. [相关资源](#📚-相关资源)

## 📌 项目概述

MN-Addon 是 MarginNote 插件开发的综合项目，包含两个核心子项目：

1. **MNToolbar** - 增强版工具栏插件，提供丰富的自定义按钮和快捷操作
2. **MNUtils** - 核心 API 框架和插件管理系统，是整个 MarginNote 插件生态的基础设施

### 项目结构
```
MN-Addon/
├── CLAUDE.md                    # 本文档 - 项目总体开发规范
├── MARGINNOTE4_CONCEPTS.md      # MarginNote 4 核心概念
├── MNUTILS_API_GUIDE.md         # MNUtils API 使用指南
├── mntoolbar/                   # 工具栏插件项目
│   ├── CLAUDE.md                # MNToolbar 专用开发规范
│   ├── mntoolbar/               # 用户开发版本
│   └── mntoolbar_official/      # 官方参考版本
└── mnutils/                     # 核心框架项目
    ├── CLAUDE.md                # MNUtils 专用开发指南
    ├── mnutils.js               # 核心 API (6,878行)
    └── xdyyutils.js             # 学术扩展 API (6,175行)
```

## 🎯 开发原则

### 核心原则

1. **深度理解**：每次输出前必须深度理解项目背景、用户意图和技术栈特征
2. **权威参考**：当信息不确定时，先查询权威资料（官方文档、标准或源码）
3. **精确回答**：仅回答与问题直接相关内容，避免冗余和教程式铺陈
4. **任务分解**：面对复杂需求，拆分为可管理的子任务

### ⚠️ 严禁擅自修改用户内容（极其重要）

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

### ⚠️ JSB 框架 self 引用规范（极其重要）

**绝对禁止在方法内部使用 `var self = this` 或 `let self = this`！**

在 JSB 框架中，`this` 的行为与标准 JavaScript 不同，必须使用以下模式：

1. **正确做法**：
   ```javascript
   // 文件顶部定义获取实例函数
   const getControllerName = () => self
   
   // 在方法内部使用
   viewDidLoad: function() {
     let self = getControllerName()  // ✅ 正确
     // ... 使用 self
   }
   ```

2. **错误做法**：
   ```javascript
   viewDidLoad: function() {
     var self = this  // ❌ 错误！在 JSB 框架中不起作用
     let self = this  // ❌ 错误！同样不起作用
   }
   ```

3. **参考示例**（来自 mnai）：
   - webviewController.js: `const getChatglmController = ()=>self`
   - 所有方法内部都使用：`let self = getChatglmController()`

**记住**：这个错误已经被重复犯了多次，必须彻底避免！每次在 JSB.defineClass 的方法中需要引用实例时，都必须使用获取实例函数的方式。

## 📚 MarginNote4 核心概念

### 文档与笔记系统

#### 系统层级结构
```
学习集 (Study Set)
  └── 笔记本 (Notebook)
      └── 笔记 (Note)
          ├── 摘录 (Excerpt)
          ├── 评论 (Comments)
          │   ├── 文本评论
          │   ├── 图片评论
          │   ├── 手写评论
          │   └── 链接评论
          ├── 标签 (Tags)
          └── 子笔记 (Child Notes)
```

#### 笔记类型
1. **摘录笔记**：从文档中选择文本或图片创建，保留原文位置
2. **脑图笔记**：独立创建，用于知识整理
3. **卡片笔记**：用于记忆和复习，支持正反面设计

#### 学习模式
1. **文档模式**：阅读和标注文档
2. **学习模式**：文档 + 脑图双屏显示
3. **复习模式**：间隔重复算法，卡片式复习

### 颜色系统
MarginNote4 使用 16 色索引系统（0-15），从淡黄色到紫色的完整色谱。

## 🔧 技术栈

### JSB 框架
- MarginNote 基于 JSBox 的 JavaScript 运行时
- 支持原生 iOS/macOS API 调用
- 特殊的类定义语法：`JSB.defineClass`

### 核心技术
- JavaScript (ES6+)
- Objective-C Bridge
- UIKit/AppKit
- WebView (HTML/CSS)

### API 使用注意事项

#### ⚠️ API 使用以源码为准（极其重要）

**虽然 `mnutils/MNUTILS_API_GUIDE.md` 文档很有参考价值，但一切以实际源码 `mnutils.js` 和 `xdyyutils.js` 为准！**

文档可能存在以下情况：
- 遗漏某些方法（如 `getIncludingCommentIndex`）
- 方法名称或参数有误
- 版本更新后文档未及时同步

正确的 API 使用流程：
1. 先查阅文档了解大概
2. **在源码中搜索确认方法是否存在**
3. 查看方法的实际实现和参数

示例：查找包含特定文本的评论
```javascript
// 文档中可能没有提到，但 xdyyutils.js 中存在
const index = note.getIncludingCommentIndex("状态：");  // ✅ 正确

// 其他可用的方法（在 xdyyutils.js 中）
note.getIncludingHtmlCommentIndex("字段名")  // 查找包含文本的 HTML 评论
note.getTextCommentsIndexArr("完整文本")     // 获取所有匹配的文本评论索引数组
```

**记住**：源码是最终的真相！遇到问题时直接在 `mnutils.js` 和 `xdyyutils.js` 中搜索。

### JavaScript 语法支持

基于对 mnutils、mntoolbar 和 mnai 源码的深入分析，JSBox/JSB 框架完全支持现代 ES6+ 语法特性：

#### 支持的语法特性

**变量声明**
```javascript
const note = MNNote.getFocusNote()  // 常量声明
let cache = {}                       // 可变变量
```

**箭头函数**
```javascript
// 单行箭头函数
const doubled = arr.map(x => x * 2)

// 多行箭头函数
const processNote = (note) => {
  note.colorIndex = 2
  return note
}
```

**模板字符串**
```javascript
MNUtil.log(`笔记标题: ${note.noteTitle}`)
const message = `处理了 ${count} 个笔记`
```

**类语法**
```javascript
class MNMath {
  static types = {
    定义: { colorIndex: 2 }
  }
  
  constructor() {
    this.name = "MNMath"
  }
}
```

**异步编程**
```javascript
// async/await
notebookWillOpen: async function(notebookId) {
  await chatAIUtils.checkMNUtil(true)
  const result = await fetchData()
}

// Promise
MNUtil.delay(1).then(() => {
  // 延迟执行
})
```

**解构赋值**
```javascript
const {title, content} = note
const [first, second] = array
```

**扩展运算符**
```javascript
const newArray = [...oldArray]
const merged = {...obj1, ...obj2}
const unique = [...new Set(array)]
```

**默认参数**
```javascript
function createNote(title = "未命名", color = 0) {
  // 函数体
}
```

**现代数组方法**
```javascript
notes.filter(n => n.colorIndex === 2)
     .map(n => n.noteTitle)
     .forEach(title => console.log(title))

const found = notes.find(n => n.noteId === id)
const hasNote = notes.includes(targetNote)
```

**现代对象方法**
```javascript
Object.keys(obj).forEach(key => {})
Object.values(obj)
Object.entries(obj)
Object.assign(target, source)
```

#### 注意事项

1. **不要因为语法报错而盲目修改**：如果遇到看似"语法错误"，先检查是否是 API 使用问题
2. **优先使用现代语法**：既然支持 ES6+，应该充分利用这些特性来编写更简洁的代码
3. **与原生 API 结合**：虽然支持现代 JS，但仍需要通过 JSB 桥接调用原生 API

## 📋 子项目规范

### MNToolbar 项目

MNToolbar 是一个高度可定制的工具栏插件，采用解耦架构设计：

**核心特性**：
- 自定义按钮和菜单系统
- 注册表模式的解耦架构
- 支持 macOS 和 iOS 双平台
- 丰富的快捷操作集合

**开发要点**：
- 查看 `mntoolbar/CLAUDE.md` 获取详细开发规范
- 使用 `xdyy_` 前缀的文件进行功能扩展
- 不要修改核心文件（main.js, utils.js 等）

### MNUtils 项目

MNUtils 是整个 MarginNote 插件生态的基础设施：

**双重身份**：
1. **插件管理系统**：订阅管理、插件商店、更新管理
2. **API 框架**：为其他插件提供 300+ 核心 API

**核心组件**：
- `mnutils.js`：9 个核心类，304+ API 方法
- `xdyyutils.js`：学术扩展，MNMath 数学卡片系统
- 订阅和网络管理系统

#### MNUtils 核心类概览

| 类名 | 功能描述 | 主要用途 |
|------|----------|----------|
| **Menu** | 弹出菜单组件 | 创建自定义右键菜单 |
| **MNUtil** | 核心工具类 | 系统功能、UI交互、文件操作等 |
| **MNConnection** | 网络请求 | HTTP请求、WebDAV、WebView控制 |
| **MNButton** | 按钮组件 | 创建自定义UI按钮 |
| **MNDocument** | 文档操作 | PDF/ePub文档管理 |
| **MNNotebook** | 笔记本管理 | 学习集和笔记本操作 |
| **MNNote** | 笔记核心类 | 笔记的创建、修改、查询等 |
| **MNComment** | 评论管理 | 各类评论的添加和管理 |
| **MNExtensionPanel** | 插件面板 | 控制插件UI面板 |

#### 学术扩展 - MNMath
提供13种知识卡片类型，专为数学和学术研究设计：
- 定义、命题、例子、反例（知识结构类）
- 作者、论文、研究进展（文献管理类）
- 智能制卡、批量处理、模板管理

**开发要点**：
- 查看 `mnutils/CLAUDE.md` 获取详细开发指南
- API 开发遵循向后兼容原则
- 新功能优先考虑扩展而非修改

## 🚀 快速开始

### 1. 理解项目架构
```bash
# 先阅读项目文档
1. 阅读本文档（CLAUDE.md）
2. 阅读 MARGINNOTE4_CONCEPTS.md 理解核心概念
3. 根据需求阅读对应子项目的 CLAUDE.md
```

### 2. 选择开发方向

#### 开发工具栏功能
```javascript
// 在 mntoolbar 项目中
// 1. 在 xdyy_button_registry.js 注册按钮
// 2. 在 xdyy_menu_registry.js 定义菜单
// 3. 在 xdyy_custom_actions_registry.js 实现功能
```

#### 使用 MNUtils API
```javascript
// 在任何 MarginNote 插件中
JSB.require('mnutils')

// 初始化（必须）
MNUtil.init(self.path)

// 获取焦点笔记
const note = MNNote.getFocusNote()
if (note) {
  // 修改笔记
  MNUtil.undoGrouping(() => {
    note.noteTitle = "新标题"
    note.appendTextComment("添加评论")
    note.colorIndex = 2  // 设置为淡蓝色
  })
}

// UI 交互
MNUtil.showHUD("操作完成！")

// 弹出选择菜单
const menu = new Menu(button, self, 250)
menu.addMenuItem("复制", "copyNote:", note)
menu.addMenuItem("制卡", "makeCard:", note)
menu.show()
```

### 3. 调试和测试
- 使用 `MNUtil.log()` 进行日志输出
- 使用 Safari Web Inspector 调试 WebView
- 在 MN3 和 MN4 中都要测试

### 4. 插件文件结构
```
your-plugin/
├── mnaddon.json          # 插件配置清单（必需）
├── main.js               # 插件入口文件（必需）
├── logo.png              # 插件图标
├── utils.js              # 工具函数
├── resources/            # 资源文件夹
│   ├── images/           # 图片资源
│   └── html/             # HTML 文件
└── lib/                  # 第三方库
```

### 5. 插件打包（极其重要）

#### ⚠️ 错误的打包方式（会导致插件无法加载甚至闪退）
```bash
# ❌ 错误：从外部目录压缩，会包含文件夹路径
zip ../plugin.mnaddon ../plugin-folder/*

# ❌ 错误：压缩整个文件夹
zip -r plugin.mnaddon plugin-folder/

# ❌ 错误：使用相对路径
zip plugin.mnaddon ../plugin/main.js ../plugin/mnaddon.json
```

这些错误方式会导致压缩包内的文件带有路径前缀（如 `../plugin/main.js`），MarginNote 无法正确解析，可能导致：
- 插件无法加载
- 插件列表中显示但无法勾选
- 严重时导致 MarginNote 闪退

#### ✅ 正确的打包方式
```bash
# 方法一：使用 mnaddon4 工具（推荐）
cd your-plugin-folder
mnaddon4 build plugin-name

# 方法二：在插件目录内直接压缩
cd your-plugin-folder
zip plugin-name.mnaddon main.js mnaddon.json logo.png utils.js
```

#### 验证打包结果
```bash
# 使用 unzip -l 检查文件结构
unzip -l plugin-name.mnaddon

# 正确的输出应该是：
Archive:  plugin-name.mnaddon
  Length      Date    Time    Name
---------  ---------- -----   ----
     1234  06-30-2025 18:00   main.js
      567  06-30-2025 18:00   mnaddon.json
     1803  06-30-2025 18:00   logo.png
---------                     -------
     3604                     3 files

# 注意：文件名前面不应该有任何路径前缀！
```

## 📝 代码规范

### 命名规范
```javascript
// ✅ 正确
const error = new Error()
const focusNote = MNNote.getFocusNote()
let cache, redisCache

// ❌ 错误
const e = new Error()
const data = getSomething()
let cache, cache2
```

### 文件加载顺序
```javascript
// ❌ 错误：在文件开头加载扩展
JSB.require('extension')
var MyClass = JSB.defineClass(...)

// ✅ 正确：在文件末尾加载扩展
var MyClass = JSB.defineClass(...)
JSB.require('extension')
```

### 错误处理
```javascript
try {
  // 边界检查
  if (typeof MNUtil === 'undefined') return
  
  // 业务逻辑
  MNUtil.undoGrouping(() => {
    // 操作
  })
} catch (error) {
  MNUtil.addErrorLog(error, "functionName", context)
  MNUtil.showHUD("操作失败：" + error.message)
}
```

### 平台兼容
```javascript
const isMac = MNUtil.isMacOS()
if (isMac) {
  // macOS 特定逻辑
} else {
  // iOS 特定逻辑
}
```

## 🔍 调试技巧

### 日志系统
```javascript
// 必须使用 MNUtil.log() 而不是 console.log()
if (typeof MNUtil !== "undefined" && MNUtil.log) {
  MNUtil.log("🔧 初始化完成")
  MNUtil.log("✅ 操作成功")
  MNUtil.log("❌ 错误：" + error.message)
}
```

### 常见问题排查

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| "Can't find variable" | 加载顺序错误 | 调整 JSB.require 位置 |
| "undefined is not an object" | 对象未初始化 | 添加存在性检查 |
| 按钮不显示 | 注册表未加载 | 检查文件加载顺序 |
| API 调用失败 | MNUtils 未安装 | 提示用户安装 MNUtils |

## 🤝 贡献指南

1. **Fork 项目**
2. **创建功能分支**：`git checkout -b feature/amazing-feature`
3. **提交更改**：`git commit -m 'Add amazing feature'`
4. **推送分支**：`git push origin feature/amazing-feature`
5. **提交 PR**：详细描述你的更改

## 📚 相关资源

### 项目文档
- [MNToolbar 开发规范](./mntoolbar/CLAUDE.md)
- [MNUtils 开发指南](./mnutils/CLAUDE.md)
- [MNUtils API 指南](./MNUTILS_API_GUIDE.md)
- [MarginNote 4 概念](./MARGINNOTE4_CONCEPTS.md)

### 外部资源
- [MarginNote 官网](https://www.marginnote.com/)
- [JSBox 文档](https://docs.xteko.com/)

## 🔄 插件生命周期

理解 MarginNote 插件的生命周期对开发至关重要：

### 生命周期方法
```javascript
JSB.defineClass("YourPlugin : JSExtension", {
  // 1. 场景连接时调用（插件启动）
  sceneWillConnect: function() {
    // 初始化插件
  },
  
  // 2. 笔记本打开时调用
  notebookWillOpen: function(notebookId) {
    // 笔记本相关初始化
  },
  
  // 3. 文档打开时调用
  documentDidOpen: function(docMd5) {
    // 文档相关处理
  },
  
  // 4. 笔记弹出菜单
  onPopupMenuOnNote: function(info) {
    // 添加自定义菜单项
  },
  
  // 5. 选择区域弹出菜单
  onPopupMenuOnSelection: function(info) {
    // 处理选择区域
  },
  
  // 6. 场景断开时调用（插件关闭）
  sceneDidDisconnect: function() {
    // 清理资源
  }
})
```

### 资源管理
- 在 `sceneDidDisconnect` 中释放所有资源
- 及时清理定时器、监听器和大对象
- 保存用户配置和状态

## 🐛 常见问题与解决方案

### 插件无法正常加载（插件列表中未勾选）

当插件出现在列表中但未自动勾选时，通常是因为以下原因：

0. **插件打包错误（最常见）**
   - 问题：使用错误的方式打包导致文件路径不正确
   - 症状：插件出现在列表但无法勾选，严重时导致 MarginNote 闪退
   - 解决：参见上面的"插件打包"章节，使用正确的打包方式

1. **MNUtils 检查失败**
   - 错误做法：在插件开始就直接 `JSB.require('mnutils')` 或进行文件系统检查
   - 正确做法：让 MarginNote 自动加载 MNUtils，在生命周期方法中进行运行时检查

2. **self 引用错误**
   - 错误做法：在方法内使用 `let self = this` 或 `var self = this`
   - 正确做法：定义 `const getInstanceName = () => self`，然后使用 `let self = getInstanceName()`

3. **类定义 vs 实例属性陷阱（极其重要）**
   - 问题：在 JSB.defineClass 中直接定义对象属性导致该属性成为"类属性"而非"实例属性"
   - 症状：属性显示为 undefined，特别是大型对象如 viewManager
   - 解决：必须在 prototype 上定义初始化方法，在实例化后创建对象属性

4. **作用域问题**
   - 错误：在工具类中直接引用其他控制器类（如 `panelController.new()`）
   - 正确：将控制器管理方法放在插件主类中，或确保引用时类已加载

5. **生命周期方法错误**
   - 错误：在 `JSB.defineClass` 内部定义 `init` 方法
   - 正确：使用 `prototype.init` 扩展原型方法

6. **菜单处理错误**
   - 始终检查 `sender.userInfo.menuController` 是否存在
   - 对所有外部输入进行防御性编程

### 调试技巧

1. **查看日志**
   - 使用 `MNUtil.log()` 输出调试信息
   - 检查 MNUtils 的错误日志

2. **错误处理**
   - 在所有生命周期方法中使用 try-catch
   - 使用 `MNUtil.addErrorLog()` 记录错误

3. **版本管理**
   - 每次修改都更新 `mnaddon.json` 中的版本号
   - 便于识别加载的是哪个版本

### JSB 框架类定义陷阱（极其重要）

在 JSB.defineClass 中直接定义对象属性会导致意外的问题。

#### ❌ 错误示例（导致属性 undefined）
```javascript
var MyController = JSB.defineClass('MyController', {
  viewDidLoad: function() {
    let self = getInstance()
    self.manager.doSomething()  // ❌ self.manager 是 undefined！
  },
  
  // ❌ 错误：这会成为类属性，不是实例属性
  manager: {
    doSomething: function() { /* ... */ }
  }
})
```

#### ✅ 正确做法
```javascript
// 1. 在 prototype 上定义初始化方法
MyController.prototype.init = function() {
  this.initManager()  // 初始化实例属性
}

MyController.prototype.initManager = function() {
  this.manager = {  // 创建实例属性
    doSomething: function() { /* ... */ }
  }
}

// 2. 在 viewDidLoad 中调用 init
var MyController = JSB.defineClass('MyController', {
  viewDidLoad: function() {
    let self = getInstance()
    self.init()  // 初始化
    self.manager.doSomething()  // ✅ 现在可以正常工作
  }
})
```

#### 💡 重要规则
**在 JSB.defineClass 中，只能定义方法（函数），不能定义对象属性！所有对象属性必须在实例初始化时创建。**

#### 常见应用场景
- viewManager（视图管理器）
- dataManager（数据管理器）
- eventHandlers（事件处理器集合）
- config（配置对象）

### 注释中的语法陷阱（极其重要）

在 JSDoc 或多行注释中包含示例代码时，**绝对不能在字符串字面量中包含 `*/`**，这会导致注释提前结束，引发大量语法错误。

#### ❌ 错误示例（会导致语法错误）
```javascript
/**
 * @example
 * let template = "/**\n * {{cursor}}\n */\nfunction name() {\n\n}"
 */
```

#### ✅ 正确做法（转义注释结束符）
```javascript
/**
 * @example
 * let template = "/**\\n * {{cursor}}\\n *\\/\\nfunction name() {\\n\\n}"
 */
```

#### 症状识别
- 编辑器突然报告大量语法错误（如 270 个错误）
- 错误集中在某个注释块之后
- 代码高亮显示异常

#### 解决方法
1. 在注释中的示例代码里，将 `*/` 替换为 `*\/`
2. 或者避免在注释示例中使用包含注释符号的字符串
3. 使用 `node -c filename.js` 验证语法正确性

### MNMath 类开发陷阱（卡片类型转换）

在实现卡片类型转换时的字段替换功能时，要特别注意以下问题：

#### 场景说明
当卡片通过移动到不同归类卡片下方来改变类型时（如从"例子"转换为"反例"），需要替换第一个 HtmlComment 字段以匹配新类型。

#### 常见错误

1. **错误理解类型转换机制**
   - ❌ 错误：认为是通过修改标题来转换类型
   - ✅ 正确：通过移动卡片到不同归类卡片下方，`getNoteType` 会根据归类卡片返回新类型

2. **错误使用 API**
   - ❌ 错误：`note.note.insertCommentToIndex(comment, index)` - 此方法不存在
   - ✅ 正确：使用 `cloneAndMergeById` + `moveComment` 的组合

3. **错误访问属性**
   - ❌ 错误：`firstFieldObj.fieldIndex`、`firstFieldObj.field` - 这些属性不存在
   - ✅ 正确：使用 `firstFieldObj.index` 和 `firstFieldObj.text`

#### 正确实现方式
```javascript
// 1. 删除原字段
note.removeCommentByIndex(firstFieldIndex);

// 2. 克隆并合并新字段模板
this.cloneAndMergeById(note, templateNoteId);

// 3. 将新字段移动到原位置
let newFieldIndex = note.comments.length - 1;
note.moveComment(newFieldIndex, firstFieldIndex);
```

#### 调试建议
- 使用 `MNUtil.log()` 输出关键信息，便于追踪执行流程
- 检查 `parseNoteComments` 返回的数据结构，了解可用属性
- 参考现有的类似实现（如 `mergeTemplate` 方法）

### 数组索引管理陷阱（评论移动操作）

在处理 MNNote 评论数组的移动操作时，要特别注意索引变化带来的问题：

#### 场景说明
实现智能链接排列功能（`smartLinkArrangement`）时，需要在评论数组中添加新元素并移动到指定位置。

#### 错误的复杂方案
```javascript
// ❌ 过度复杂：试图管理所有索引变化
// 1. 记录原始链接索引
let linkIndex = comments.length - 1;
// 2. 添加新元素
note.appendMarkdownComment("- ");
// 3. 计算新索引（容易出错）
let dashIndex = note.MNComments.length - 1;
// 4. 移动操作（索引可能已经变化）
this.moveCommentsArrToField(note, [dashIndex], "相关思考", true);
this.moveCommentsArrToField(note, [linkIndex], "相关思考", true);
```

#### 正确的简洁方案
```javascript
// ✅ 简洁优雅：利用数组动态变化
// 1. 添加新元素
note.appendMarkdownComment("- ");
// 2. 连续两次移动最后一个元素
this.moveCommentsArrToField(note, [note.MNComments.length - 1], "相关思考");  // 移动 "- "
this.moveCommentsArrToField(note, [note.MNComments.length - 1], "相关思考");  // 移动链接
```

#### 关键洞察
- **避免预先计算索引**：数组操作会改变后续元素的位置
- **利用动态特性**：每次操作后重新获取"最后一个元素"
- **保持代码简洁**：越简单的方案越不容易出错

#### 经验总结
1. **动态获取索引**：使用 `array.length - 1` 而不是预存索引值
2. **顺序操作**：利用元素移走后数组自动调整的特性
3. **避免过度设计**：简单问题用简单方法解决

### MNUtil.select() 方法不存在陷阱（API 文档错误）

在开发过程中发现文档中记载的 `MNUtil.select()` 方法实际上不存在，这是一个典型的文档与源码不同步的问题。

#### 问题描述
当使用文档中提到的 `MNUtil.select()` 方法时，会遇到 "Not supported yet" 或方法未定义的错误。

#### 错误示例
```javascript
// ❌ 错误：MNUtil.select() 不存在
const selectedIndex = await MNUtil.select("选择任务类型", options, false);
if (selectedIndex === null) return;

// ❌ 错误：MNUtil.selectIndex() 也不存在
const index = await MNUtil.selectIndex("选择", ["选项1", "选项2"]);
```

#### 正确的 API
通过查看 `mnutils.js` 源码（第 921 行），正确的方法是 `MNUtil.userSelect()`：

```javascript
// ✅ 正确：使用 MNUtil.userSelect()
const selectedIndex = await MNUtil.userSelect("选择任务类型", "", options);
if (selectedIndex === 0) return; // 0 是取消按钮

// API 签名
static async userSelect(mainTitle, subTitle, items) {
  // 返回 Promise<number>
  // 0: 取消按钮
  // 1+: 实际选项（从 1 开始）
}
```

#### 按钮索引差异
1. **取消按钮**：
   - 文档描述：返回 `null`
   - 实际情况：返回 `0`

2. **选项索引**：
   - 文档描述：从 `0` 开始
   - 实际情况：从 `1` 开始

#### 正确的使用方式
```javascript
// 同步方式（使用 async/await）
const options = ["选项1", "选项2", "选项3"];
const selectedIndex = await MNUtil.userSelect("请选择", "", options);

switch(selectedIndex) {
  case 0:  // 用户点击取消
    return;
  case 1:  // 用户选择了"选项1"
    handleOption1();
    break;
  case 2:  // 用户选择了"选项2"
    handleOption2();
    break;
  // ...
}

// 异步方式（使用 .then()）
MNUtil.userSelect("请选择", "", options).then(selectedIndex => {
  if (selectedIndex === 0) return; // 取消
  // 处理选择...
});
```

#### 经验教训
1. **始终以源码为准**：当文档中的 API 不工作时，直接在源码中搜索
2. **使用 grep 工具验证**：`grep -n "methodName" mnutils.js`
3. **注意参数差异**：`userSelect` 需要三个参数（mainTitle, subTitle, items）
4. **测试边界情况**：特别是取消按钮的处理

### UI 布局陷阱（ScrollView 与固定元素）

在开发设置面板等复杂 UI 时，经常需要处理可滚动区域与固定元素的布局关系。

#### 场景说明
实现类似 mnai 的标签栏布局，需要横向滚动的标签按钮和固定的关闭按钮。

#### 常见错误

1. **关闭按钮随内容滚动**
   ```javascript
   // ❌ 错误：将关闭按钮放在 ScrollView 内
   this.createButton("closeButton","closeButtonTapped:","tabView")
   ```

2. **坐标系混乱**
   ```javascript
   // ❌ 错误：不同父视图导致坐标系不一致
   this.createScrollView("tabView","view")
   this.createButton("closeButton","closeButtonTapped:","settingView")
   // tabView 在 view 中，closeButton 在 settingView 中，坐标系不同
   ```

#### 正确实现
```javascript
// ✅ 正确：缩短 ScrollView 宽度，为固定元素预留空间
// 1. 创建 ScrollView 和关闭按钮在同一父视图中
this.createScrollView("tabView","view")
this.createButton("closeButton","closeButtonTapped:","view")

// 2. 布局时为关闭按钮预留空间
let tabViewFrame = {
  x: 0,
  y: 20,
  width: width - 45,  // 预留 45 像素给关闭按钮
  height: 30
}
this.tabView.frame = tabViewFrame

// 3. 关闭按钮定位在 ScrollView 右侧
taskFrame.set(this.closeButton, tabViewFrame.width + 5, tabViewFrame.y)
```

### ScrollView 方向锁定

#### 问题描述
横向滚动的 ScrollView 也能垂直移动，影响用户体验。

#### 解决方案
```javascript
// 创建只能横向滚动的 ScrollView
this.tabView.alwaysBounceHorizontal = true
this.tabView.alwaysBounceVertical = false    // 禁用垂直弹性
this.tabView.directionalLockEnabled = true   // 锁定滚动方向
this.tabView.showsHorizontalScrollIndicator = false
this.tabView.showsVerticalScrollIndicator = false

// 确保 contentSize 高度与 frame 高度相同
this.tabView.contentSize = {width: contentWidth, height: 30}
this.tabView.frame = {x: 0, y: 20, width: width - 45, height: 30}
```

### iOS 颜色值设置陷阱

#### 错误用法
```javascript
// ❌ 错误：iOS 不支持 "transparent" 字符串
MNButton.setConfig(button, {color:"transparent"})
```

#### 正确用法
```javascript
// ✅ 正确：使用 alpha 通道实现透明
MNButton.setConfig(button, {color:"#ffffff", alpha:0.0})

// 或者使用 MNUtil 的颜色方法
button.backgroundColor = MNUtil.hexColorAlpha("#ffffff", 0.0)
```

### 视图层级与坐标系统

理解视图层级对于正确布局至关重要。每个视图都有自己的坐标系统，子视图的坐标是相对于父视图的。

#### 典型的设置面板层级结构
```
view (主视图, 坐标系原点)
├── moveButton (y=0, 顶部移动手柄)
├── maxButton (y=0, 最大化按钮)
├── tabView (y=20, ScrollView 容器)
│   ├── configButton (y=0, 相对于 tabView)
│   ├── dynamicButton (y=0)
│   └── ...其他标签按钮
├── closeButton (y=20, 与 tabView 同级同高度)
└── settingView (y=55, 主内容区域)
    ├── configView (y=0, 相对于 settingView)
    ├── advanceView (y=0)
    └── ...其他内容视图
```

#### 坐标计算要点
1. **相对坐标**：子视图的坐标是相对于直接父视图的
2. **同级对齐**：要对齐的元素应该在同一父视图中
3. **预留空间**：固定元素需要在布局时预留空间

> 💡 **提示**：开发前请先仔细阅读对应子项目的 CLAUDE.md 文件，它们包含了更详细的技术实现和规范要求。

### JSB 框架中的方法定义陷阱（事件处理 vs 原型方法）

在开发多看板绑定功能时发现的重要问题：JSB.defineClass 中定义的方法和 prototype 上定义的方法有本质区别。

#### 问题描述
使用通用函数创建的目标看板按钮点击无响应，而根目录看板的按钮正常工作。

#### 错误示例
```javascript
// ❌ 错误：在 JSB.defineClass 中定义的对象内部调用其他方法
JSB.defineClass('SettingController : UIViewController', {
  // 事件处理方法
  focusTargetBoard: function() {
    this.focusBoard('target')  // ❌ this.focusBoard is not a function
  },
  
  // 试图在同一个对象中定义通用方法
  focusBoard: function(boardKey) {
    // 通用逻辑
  }
})
```

#### 正确实现
```javascript
// ✅ 正确：分离事件处理和通用逻辑
JSB.defineClass('SettingController : UIViewController', {
  // 事件处理方法（响应按钮点击）
  focusTargetBoard: function() {
    let self = getSettingController()
    self.focusBoard('target')  // 调用原型方法
  },
  
  clearTargetBoard: async function() {
    let self = getSettingController()
    await self.clearBoard('target')
  }
})

// 通用方法定义在原型上
SettingController.prototype.focusBoard = function(boardKey) {
  // 通用逻辑
  let noteId = taskConfig.getBoardNoteId(boardKey)
  // ...
}

SettingController.prototype.clearBoard = async function(boardKey) {
  // 通用逻辑
  // ...
}
```

#### 关键原则
1. **事件处理方法**：必须在 JSB.defineClass 中定义，用于响应 UI 事件
2. **通用/可复用方法**：应该定义在 prototype 上，便于内部调用
3. **方法调用**：在 JSB.defineClass 内部调用原型方法时，需要先获取实例（`let self = getInstance()`）

#### 最佳实践：多看板管理架构

当需要管理多个相似的 UI 组件（如多个看板）时，推荐以下架构：

```javascript
// 1. 通用组件创建函数（prototype）
SettingController.prototype.createBoardBinding = function(config) {
  const {key, title, parent} = config
  // 创建标签、按钮等 UI 元素
  // 按钮的 action 指向 JSB.defineClass 中的方法
  this.createButton(buttonName, `focus${Key}Board:`, parent)
}

// 2. 事件处理方法（JSB.defineClass）
// 每个看板都需要对应的三个方法
focusRootBoard: function() { /* ... */ },
clearRootBoard: function() { /* ... */ },
pasteRootBoard: function() { /* ... */ },

focusTargetBoard: function() { /* ... */ },
clearTargetBoard: function() { /* ... */ },
pasteTargetBoard: function() { /* ... */ },

// 3. 通用操作逻辑（prototype）
SettingController.prototype.focusBoard = function(boardKey) { /* ... */ }
SettingController.prototype.clearBoard = function(boardKey) { /* ... */ }
SettingController.prototype.pasteBoard = function(boardKey) { /* ... */ }
```

这种架构确保了代码的可维护性和扩展性，同时符合 JSB 框架的要求。

### 变量重复声明导致的静默加载失败陷阱（极其重要）

在开发过程中可能遇到文件无法加载但没有任何错误提示的情况，这通常是由于 JavaScript 语法错误被静默处理了。

#### 问题描述
插件突然无法找到某个类（如 `MNTaskManager`），但之前的版本运行正常，没有任何错误提示。

#### 典型症状
- 插件无法加载某个类，提示 "Can't find variable: ClassName"
- 没有任何语法错误提示
- 文件似乎没有被成功加载

#### 根本原因
JavaScript 文件中存在语法错误（如重复声明变量），但被 try-catch 静默处理了。

#### 真实案例
```javascript
// ❌ 错误：在同一作用域内重复声明 const 变量
linkParentTask: function(note, parentNote) {
  // ... 代码 ...
  
  // 第786行：首次声明
  const parentParts = this.parseTaskTitle(parent.noteTitle)
  const belongsToText = TaskFieldUtils.createBelongsToField(parentParts.content, parent.noteURL)
  
  // ... 更多代码 ...
  
  // 第836行：重复声明（导致语法错误）
  const parentParts = this.parseTaskTitle(parent.noteTitle)
  if (childStatus === "进行中" && parentParts.status === "未开始") {
    // ...
  }
}
```

#### 为什么难以发现
文件末尾的初始化代码静默处理了所有错误：
```javascript
// 立即执行初始化
try {
  if (typeof taskUtils !== 'undefined') {
    initXDYYExtensions();
  }
  
  if (typeof taskConfig !== 'undefined') {
    extendTaskConfigInit();
  }
} catch (error) {
  // 静默处理错误 - 这导致问题难以发现！
}
```

#### 诊断方法
1. **使用 node 检查语法**：
   ```bash
   node -c filename.js
   ```
   这会立即报告语法错误：
   ```
   SyntaxError: Identifier 'parentParts' has already been declared
   ```

2. **查看 git diff**：
   重点检查新增或修改的变量声明

3. **搜索重复声明**：
   在编辑器中搜索变量名，检查是否在同一作用域内重复声明

#### 解决方案
1. **修复语法错误**：删除重复的声明或重命名变量
2. **改进错误处理**：在 catch 块中添加日志
   ```javascript
   } catch (error) {
     if (typeof MNUtil !== 'undefined' && MNUtil.addErrorLog) {
       MNUtil.addErrorLog(error, "文件初始化失败", {filename: "xdyy_utils_extensions.js"})
     }
     // 至少在控制台输出
     console.error("初始化失败:", error)
   }
   ```

#### 预防措施
1. **开发时启用语法检查**：配置编辑器实时检查语法错误
2. **提交前验证**：使用 `node -c` 检查所有修改的 JS 文件
3. **避免静默错误处理**：所有 catch 块都应该记录错误信息
4. **使用 ESLint**：配置 no-redeclare 规则

#### 经验总结
- 当类突然"消失"时，首先怀疑文件加载失败
- 文件加载失败通常是因为语法错误
- 静默的 try-catch 是调试的大敌
- 始终使用工具验证语法正确性

### focusInMindMap 定位失效问题（异步执行与焦点管理）

在开发新卡片生成功能（如思路卡片、总结卡片）时，发现 `focusInMindMap` 方法不能正确定位到新创建的卡片。

#### 问题现象
- 创建新卡片后，焦点仍然停留在原卡片上
- 即使增加延迟参数（如 0.3、0.5 秒）也无效
- 在脑图视图中也无法正常定位

#### 根本原因
`MNUtil.undoGrouping()` 与后续的评论移动操作之间存在冲突：
1. 评论移动操作（`moveCommentsArrToField`）会改变焦点
2. 这些操作可能在 `focusInMindMap` 执行时仍在进行
3. 导致焦点被"抢走"

#### 错误示例
```javascript
// ❌ 错误：在 undoGrouping 中执行，焦点会被后续操作抢走
MNUtil.undoGrouping(() => {
  if (MNUtil.mindmapView) {
    summaryNote.focusInMindMap(0.5)
  }
})
```

#### 正确解决方案
```javascript
// ✅ 正确：使用 delay 确保所有操作完成后再定位
// 处理链接和评论
note.appendMarkdownComment(HtmlMarkdownUtils.createHtmlMarkdownText(title, "remark"));
note.appendNoteLink(summaryNote, "Both");
this.moveCommentsArrToField(note, "Y, Z", targetField);
this.moveCommentsArrToField(summaryNote, "Z", "相关链接");

// 延迟聚焦，确保所有操作完成后再定位
MNUtil.delay(0.5).then(() => {
  if (MNUtil.mindmapView) {
    summaryNote.focusInMindMap(0.3)
  }
})
```

#### 关键要点
1. **执行顺序很重要**：确保所有可能改变焦点的操作都完成后再调用 `focusInMindMap`
2. **使用 Promise 延迟**：`MNUtil.delay().then()` 而不是 `MNUtil.undoGrouping()`
3. **检查视图模式**：确保在脑图视图中才执行定位（`MNUtil.mindmapView`）
4. **避免焦点竞争**：评论移动、链接创建等操作都可能改变焦点

#### 适用场景
- 创建新卡片并需要自动定位
- 批量操作后需要定位到特定卡片
- 任何涉及多个 UI 操作后的焦点管理

### 多层级评论选择对话框开发陷阱（moveCommentsByPopup）

在开发 `moveCommentsByPopup` 功能增强时，遇到了一系列关于多层级文件夹式导航结构的设计和实现问题。

#### 需求背景
原始的 `moveCommentsByPopup` 只支持 HtmlComment 类型的字段，需要扩展为：
1. 支持解析所有评论类型（文本、图片、链接、手写等）
2. 实现真正的多层级文件夹式选择结构
3. HtmlMarkdown 评论作为"文件夹"，可以包含其他内容

#### 设计的四层结构
- **第一层**：选择要移动的评论（支持多选）
- **第二层**：选择目标字段（只显示字段，不显示 HtmlMarkdown）
- **第三层**：选择字段内的位置（显示独立评论和 HtmlMarkdown "文件夹"）
- **第四层**：选择 HtmlMarkdown 内部的具体位置

#### 遇到的问题和解决方案

##### 1. HtmlMarkdown 在第二层错误显示
**问题**：第二层应该只显示字段选择，但 HtmlMarkdown 评论也出现了。

**解决**：修改 `getHtmlCommentsTextArrForPopup` 方法，过滤掉 HtmlMarkdown 类型：
```javascript
// 检查是否为 HtmlMarkdown 评论
let cleanText = comment.text || "";
if (cleanText.startsWith("- ")) {
  cleanText = cleanText.substring(2);
}
if (HtmlMarkdownUtils.isHtmlMDComment(cleanText)) {
  continue;  // 跳过 HtmlMarkdown 评论
}
```

##### 2. 第三层内容归属逻辑错误
**问题**：HtmlMarkdown 后面的内容被错误地显示为独立评论，而不是隐藏在 HtmlMarkdown "文件夹"内。

**错误的逻辑**：
- 遍历时只处理 HtmlMarkdown 之前的内容为独立评论
- 没有正确处理 HtmlMarkdown 之间的内容归属

**正确的实现**（`parseFieldTopLevelStructure` 方法）：
```javascript
// 三步清晰逻辑
// 1. 找出所有 HtmlMarkdown 的位置
// 2. 只有第一个 HtmlMarkdown 之前的内容是独立的
// 3. 设置每个 HtmlMarkdown 的范围（从自身到下一个 HtmlMarkdown 或字段末尾）
```

##### 3. 第四层内容范围超出字段边界
**问题**：点击最后一个 HtmlMarkdown 时，显示的内容包含了后续其他字段的内容。

**原因**：`showHtmlMarkdownInternalPositionDialog` 方法没有限制在当前字段范围内。

**解决**：
1. 添加 `fieldObj` 参数传递字段边界信息
2. 使用 `fieldObj.excludingFieldBlockIndexArr` 限制遍历范围
3. 只处理属于当前字段的评论

#### 关键设计原则

##### 内容归属规则
- HtmlMarkdown 之前的内容是独立的
- HtmlMarkdown 之后的所有内容都属于该 HtmlMarkdown，直到遇到下一个 HtmlMarkdown
- 两个 HtmlMarkdown 之间的内容属于前一个 HtmlMarkdown

##### 文件夹式隐藏机制
- 第三层只显示"文件夹"标题，不暴露内部内容
- 用户必须点击进入第四层才能看到 HtmlMarkdown 内部的具体内容
- 提供 Top/Bottom 快速定位选项

#### 实现要点
1. **正确解析评论类型**：使用 `parseFieldInternalComments` 方法支持所有评论类型
2. **多选支持**：实现 `showCommentMultiSelectDialog` 方法，支持递归选择
3. **层级导航**：每层都有明确的职责，避免信息混杂
4. **边界控制**：始终在字段范围内操作，避免越界

#### 经验总结
- 复杂的多层级 UI 需要清晰的数据结构设计
- 内容归属逻辑必须在早期就明确定义
- 边界检查在每个层级都很重要
- 用户体验优先：隐藏复杂性，提供直观的导航