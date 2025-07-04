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

3. **作用域问题**
   - 错误：在工具类中直接引用其他控制器类（如 `panelController.new()`）
   - 正确：将控制器管理方法放在插件主类中，或确保引用时类已加载

4. **生命周期方法错误**
   - 错误：在 `JSB.defineClass` 内部定义 `init` 方法
   - 正确：使用 `prototype.init` 扩展原型方法

5. **菜单处理错误**
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

> 💡 **提示**：开发前请先仔细阅读对应子项目的 CLAUDE.md 文件，它们包含了更详细的技术实现和规范要求。