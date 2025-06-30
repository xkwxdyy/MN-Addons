# MarginNote4 插件开发总纲

> 本文档是 MN-Addon 项目的核心开发指南，涵盖 MarginNote4 的核心概念、技术架构、开发规范和最佳实践，为所有 MarginNote 插件开发者提供全面的技术参考。

## 🎯 开发框架选择指南

在开始 MarginNote 插件开发之前，您需要根据项目需求选择合适的开发框架。目前有三种主要的开发方式：

### 1. MNUtils API 框架（推荐）

**适用场景**：
- 快速开发各种规模的插件
- 希望直接使用 JavaScript
- 需要丰富的 API 封装
- 与其他 MNUtils 插件生态协作

**优势**：
- ✅ 成熟稳定，经过大量项目验证
- ✅ API 设计直观，易于上手
- ✅ 无需复杂配置，开箱即用
- ✅ 海量现成的示例代码和插件参考
- ✅ 完善的文档和社区支持
- ✅ 轻量级，性能优秀

**劣势**：
- ❌ 需要用户安装 MNUtils 插件
- ❌ 纯 JavaScript，缺少类型检查
- ❌ 调试依赖日志输出

### 2. 原生 API 开发

**适用场景**：
- 开发极简插件
- 不想依赖 MNUtils
- 需要最大程度的控制
- 学习 MarginNote 底层机制

**优势**：
- ✅ 无任何依赖
- ✅ 最小的插件体积
- ✅ 直接访问所有底层 API
- ✅ 完全控制

**劣势**：
- ❌ 开发难度大
- ❌ 需要深入理解 Objective-C 概念
- ❌ 大量重复代码
- ❌ 容易出错，调试困难

### 3. OhMyMN 框架（未来选择）

**适用场景**：
- 需要 TypeScript 类型支持
- 计划开发大型复杂插件
- 希望使用现代化工具链
- 追求最新技术栈

**优势**：
- ✅ 完整的 TypeScript 支持
- ✅ 现代化的 API 设计
- ✅ 支持热重载开发
- ✅ 模块化架构

**劣势**：
- ❌ 学习曲线较高
- ❌ 需要 Node.js 环境
- ❌ 社区相对较新
- ❌ 打包体积较大

### 框架对比表

| 特性 | MNUtils | 原生 API | OhMyMN |
|------|----------|----------|---------|
| 开发难度 | 简单 | 困难 | 中等 |
| TypeScript | ❌ | ❌ | ✅ |
| 热重载 | ❌ | ❌ | ✅ |
| 类型安全 | ❌ | ❌ | ✅ |
| 社区支持 | 优秀 | 有限 | 良好 |
| 插件体积 | 中等 | 最小 | 较大 |
| 依赖要求 | MNUtils插件 | 无 | Node.js |
| API 丰富度 | 丰富 | 基础 | 最丰富 |
| 学习资源 | 最丰富 | 较少 | 增长中 |
| 成熟度 | 非常成熟 | 最成熟 | 较新 |

### 选择建议

- **大部分开发者**：推荐使用 MNUtils，成熟稳定，资源丰富
- **新手开发者**：强烈建议从 MNUtils 开始，学习曲线平缓
- **极简插件**：可以考虑原生 API，无需依赖
- **未来项目**：如需 TypeScript 支持，可以考虑 OhMyMN

## 🌟 MNUtils - 核心 API 框架（主流选择）

### 重要说明

**MNUtils 是 MarginNote 插件开发生态中最基础、最重要的 API 项目**。它为所有 MarginNote 插件提供了统一、便捷的 API 接口，极大地简化了插件开发的复杂度。

### MNUtils 的核心价值

1. **API 封装**：将复杂的 Objective-C API 封装成简单易用的 JavaScript 接口
2. **跨平台兼容**：处理 iOS 和 macOS 的平台差异
3. **功能增强**：提供原生 API 没有的高级功能
4. **开发效率**：让开发者专注于业务逻辑而非底层实现

### 如何使用 MNUtils

#### 1. 检查 MNUtils 是否可用
```javascript
// 在插件初始化时检查
if (typeof MNUtil === "undefined") {
  console.error("MNUtils not installed");
  // 提示用户安装 MNUtils
  return;
}

// 初始化 MNUtils
MNUtil.init(self.path);
```

#### 2. 常用 API 示例
```javascript
// UI 交互
MNUtil.showHUD("操作成功");

// 笔记操作
const focusNote = MNNote.getFocusNote();
MNUtil.undoGrouping(() => {
  focusNote.noteTitle = "新标题";
});

// 事件管理
MNUtil.addObserver(self, "onPopupMenuOnNote:", "PopupMenuOnNote");

// 数据存储
NSUserDefaults.standardUserDefaults().setObjectForKey(data, key);
```

### MNUtils 核心组件

| 类名 | 功能 | 主要用途 |
|------|------|----------|
| **MNUtil** | 核心工具类 | 系统功能、UI交互、文件操作 |
| **MNNote** | 笔记操作类 | 笔记的创建、修改、查询 |
| **MNNotebook** | 笔记本管理 | 学习集和笔记本操作 |
| **MNDocument** | 文档操作 | PDF/ePub文档管理 |
| **MNComment** | 评论管理 | 各类评论的添加和管理 |
| **Menu** | 菜单组件 | 创建自定义弹出菜单 |
| **MNButton** | 按钮组件 | 创建自定义UI按钮 |
| **MNConnection** | 网络请求 | HTTP请求、WebDAV |
| **MNExtensionPanel** | 插件面板 | 控制插件UI面板 |

### 完整 API 文档

**详细的 API 使用说明请参考：[MNutils_API_Guide.md](./MNutils_API_Guide.md)**

该文档包含：
- 所有类和方法的详细说明
- 参数类型和返回值
- 使用示例和最佳实践
- 常见问题解答

### 为什么必须使用 MNUtils

1. **降低开发难度**
   - 无需理解复杂的 Objective-C API
   - 提供直观的 JavaScript 接口
   - 自动处理类型转换

2. **提高开发效率**
   - 常用功能封装成一行代码
   - 批量操作支持
   - 错误处理机制

3. **保证兼容性**
   - 处理不同版本的 API 差异
   - 兼容 iOS 和 macOS 平台
   - 向后兼容保证

4. **社区标准**
   - 几乎所有优秀插件都基于 MNUtils
   - 丰富的示例代码
   - 活跃的社区支持

### 安装 MNUtils

用户需要先安装 MNUtils 插件，你的插件才能使用其 API：
1. 从 MarginNote 插件商店下载 MNUtils
2. 安装并启用 MNUtils 插件
3. 重启 MarginNote

### 开发建议

- **始终检查 MNUtils 可用性**：在使用任何 API 前进行检查
- **参考 API 文档**：充分利用 MNutils_API_Guide.md
- **学习示例代码**：参考其他基于 MNUtils 的插件
- **优雅降级**：为没有安装 MNUtils 的用户提供提示

---

## 📖 目录

1. [🎯 开发框架选择指南](#🎯-开发框架选择指南)
2. [🌟 MNUtils - 核心 API 框架](#🌟-mnutils---核心-api-框架主流选择)
3. [📚 MarginNote4 基础架构](#📚-marginnote4-基础架构)
4. [🛠️ 技术架构与限制](#🛠️-技术架构与限制)
5. [⚠️ 开发陷阱与解决方案](#⚠️-开发陷阱与解决方案)
6. [🔧 插件开发要点](#🔧-插件开发要点)
7. [🔄 插件生命周期详解](#🔄-插件生命周期详解)
8. [📡 事件系统完整指南](#📡-事件系统完整指南)
9. [📝 最佳实践](#📝-最佳实践)
10. [🚀 常见插件类型](#🚀-常见插件类型)
11. [💡 开发规范与标准](#💡-开发规范与标准)
12. [🚀 开发流程指南](#🚀-开发流程指南)
13. [📘 实战开发指南](#📘-实战开发指南)
14. [💻 完整示例代码](#💻-完整示例代码)
15. [🎨 OhMyMN 框架参考](#🎨-ohmymn-框架参考)
16. [🔒 安全与隐私](#🔒-安全与隐私)
17. [📊 测试策略](#📊-测试策略)
18. [🎯 发布与维护](#🎯-发布与维护)
19. [📚 参考资源](#📚-参考资源)
20. [❓ FAQ - 常见问题解答](#❓-faq---常见问题解答)
21. [📤 插件商店发布流程](#📤-插件商店发布流程)

---

## 📚 MarginNote4 基础架构

### 1. 文档系统

#### 支持的文档类型
- **PDF**: 主要文档格式，支持批注、高亮、手写
- **ePub**: 电子书格式，支持重排版
- **网页**: 通过内置浏览器导入

#### 文档标识
```javascript
// 每个文档都有唯一的 MD5 标识
doc.docMd5        // 文档唯一标识
doc.docTitle      // 文档标题
doc.pageCount     // 页数
```

### 2. 笔记系统层级结构

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

### 3. 笔记类型

#### 3.1 摘录笔记
- 从文档中选择文本或图片创建
- 保留原文位置信息
- 支持多段摘录合并

#### 3.2 脑图笔记
- 独立创建的笔记
- 不依赖文档内容
- 常用于知识整理

#### 3.3 卡片笔记
- 用于记忆和复习
- 支持正反面设计
- 可加入复习计划

### 4. 学习模式

MarginNote4 提供三种主要模式：

1. **文档模式** (Document Mode)
   - 阅读和标注文档
   - 创建摘录笔记
   - 快速浏览

2. **学习模式** (Study Mode)
   - 文档 + 脑图双屏显示
   - 整理知识结构
   - 建立笔记关联

3. **复习模式** (Review Mode)
   - 间隔重复算法
   - 卡片式复习
   - 记忆强化

### 5. 脑图功能

#### 脑图视图类型
- **大纲视图**: 层级列表显示
- **脑图视图**: 思维导图显示
- **框架视图**: 表格化显示

#### 脑图操作
```javascript
// 聚焦到脑图中的笔记
MNUtil.focusNoteInMindMapById(noteId, delay)

// 获取脑图视图
MNUtil.mindmapView

// 脑图分支颜色
note.mindmapBranchColor
```

### 6. 标签系统

#### 标签类型
1. **普通标签**: 用于分类和筛选
2. **链接标签**: 建立笔记间关联
3. **系统标签**: 如 #重要 #待办

#### 标签操作
```javascript
note.tags                    // 获取标签数组
note.appendTags(["标签1"])   // 添加标签
note.removeTags(["标签2"])   // 删除标签
```

### 7. 链接系统

#### 链接类型
1. **笔记链接**: 连接相关笔记
2. **文档链接**: 跳转到文档位置
3. **外部链接**: 网页或其他应用

#### URL 格式
```
marginnote4app://note/[noteId]      // 笔记链接
marginnote4app://notebook/[id]      // 笔记本链接
```

### 8. 评论系统

#### 评论类型
```javascript
// 文本评论
note.appendTextComment("评论内容")

// Markdown 评论
note.appendMarkdownComment("**加粗**文本")

// HTML 评论（富文本）
note.appendHtmlComment(html, text, size, tag)

// 图片评论
note.appendImageComment(imageData)

// 链接评论
note.appendNoteLink(targetNote, "链接说明")
```

### 9. 颜色系统

MarginNote4 使用 16 色系统：

```javascript
// 颜色索引 0-15
0: "淡黄色"    8: "橙色"
1: "淡绿色"    9: "深绿色"
2: "淡蓝色"    10: "深蓝色"
3: "淡红色"    11: "深红色"
4: "黄色"      12: "白色"
5: "绿色"      13: "淡灰色"
6: "蓝色"      14: "深灰色"
7: "红色"      15: "紫色"
```

### 10. 数据管理

#### 存储位置
- **本地存储**: SQLite 数据库
- **iCloud 同步**: 跨设备同步
- **备份**: 支持导出为 .mnbackup

#### 数据库结构
```javascript
MNUtil.db                    // 数据库实例
MNUtil.dbFolder             // 数据库文件夹
```

### 11. 扩展系统

#### 插件位置
- iOS: `~/Library/MarginNote 4/Extensions/`
- macOS: `~/Library/Containers/MarginNote 4/Data/Library/MarginNote 4/Extensions/`

#### 插件生命周期
```javascript
// 场景连接
sceneWillConnect()

// 笔记本打开
notebookWillOpen(notebookId)

// 文档打开
documentDidOpen(docMd5)

// 场景断开
sceneDidDisconnect()
```

### 12. 手势和快捷键

#### 常用手势
- **长按**: 弹出菜单
- **双击**: 快速编辑
- **拖放**: 移动笔记

#### 弹出菜单
```javascript
// 笔记弹出菜单
onPopupMenuOnNote(info)

// 选择区域弹出菜单
onPopupMenuOnSelection(info)
```

### 13. 导入导出

#### 支持的格式
- **导入**: PDF, ePub, 网页, .mnbackup
- **导出**: 
  - 脑图: PNG, PDF, OPML, Markdown
  - 笔记: Anki, PDF, Word
  - 数据: .mnbackup

### 14. 主题系统

```javascript
MNUtil.themeColor = {
  Gray: "#414141",     // 灰色主题
  Default: "#FFFFFF",  // 默认主题
  Dark: "#000000",     // 暗色主题
  Green: "#E9FBC7",    // 绿色主题
  Sepia: "#F5EFDC"     // 棕褐色主题
}
```

## 🛠️ 技术架构与限制

### 1. 技术本质
- **基础架构**：MarginNote 插件本质上是基于 Objective-C API 的 JavaScript 扩展
- **运行环境**：在 Safari/WebKit 环境中运行，受限于 iOS/macOS 系统 API
- **通信机制**：通过 JSBridge 实现 JavaScript 与原生 API 的交互

### 2. 插件包结构
```
plugin.mnaddon (ZIP 格式)
├── mnaddon.json    # 插件清单（必需）
├── main.js         # 主程序（必需）
├── logo.png        # 44x44 图标（必需）
└── resources/      # 资源文件（可选）
    ├── *.js        # 其他脚本文件
    ├── *.html      # HTML 界面文件
    └── *.css       # 样式文件
```

### 3. 清单文件规范 (mnaddon.json)
```json
{
  "addonid": "marginnote.extension.yourplugin",
  "author": "作者名",
  "title": "插件名称",
  "version": "1.0.0",
  "marginnote_version_min": "3.7.11",
  "cert_key": ""  // 官方认证密钥（可选）
}
```

### 4. 技术限制

#### API 限制
- **无 Node.js API**：不能使用 fs、path、process 等
- **无完整网络请求**：XMLHttpRequest 受限，无 fetch API
- **无文件系统访问**：不能直接读写文件系统
- **无进程控制**：不能执行外部程序或脚本
- **内存限制**：大数据处理可能导致崩溃

#### 平台差异
| 功能 | iOS | macOS |
|------|-----|-------|
| 触摸手势 | ✅ | ❌ |
| 鼠标悬停 | ❌ | ✅ |
| 键盘快捷键 | 受限 | ✅ |
| 窗口管理 | 受限 | ✅ |
| 文件拖放 | ❌ | ✅ |

### 5. 开发门槛
- **学习曲线陡峭**：需要理解 Objective-C 概念和 JSBridge 机制
- **调试困难**：错误信息有限，需要大量日志
- **文档稀缺**：官方文档不完整，需要参考其他插件
- **兼容性挑战**：iOS 和 macOS 行为差异大

### 6. 核心框架使用

#### QuartzCore 框架
QuartzCore 是 iOS 的核心动画框架，在插件开发中主要用于：
- **视觉反馈**：创建动画效果，提升用户体验
- **界面动画**：平滑的过渡和转场效果
- **图层操作**：自定义绘制和图形变换

```javascript
// 使用 QuartzCore 创建动画效果示例
function animateView(view) {
  // 创建基础动画
  const animation = CABasicAnimation.animationWithKeyPath("opacity");
  animation.fromValue = 0.0;
  animation.toValue = 1.0;
  animation.duration = 0.3;
  
  // 应用到视图的 layer
  view.layer.addAnimation(animation, "fadeIn");
}
```

#### UIKit 框架
UIKit 是 iOS 应用的基础框架，提供了丰富的 UI 组件和功能：
- **界面构建**：创建自定义视图、按钮、菜单等
- **事件处理**：响应用户交互
- **文档管理**：处理文档和资源
- **颜色和主题**：适配 MarginNote 的主题系统

```javascript
// UIKit 使用示例
// 创建自定义按钮
const button = UIButton.buttonWithType(0); // UIButtonTypeCustom
button.frame = { x: 0, y: 0, width: 100, height: 44 };
button.setTitle("自定义按钮", 0); // UIControlStateNormal
button.setTitleColor(UIColor.systemBlueColor, 0);

// 添加点击事件
button.addTarget(self, "buttonClicked:", 1 << 6); // UIControlEventTouchUpInside

// 获取当前主题颜色
const app = Application.sharedInstance();
const tintColor = app.defaultTintColor;
const textColor = app.defaultTextColor;
```

#### 框架使用注意事项
1. **性能考虑**：动画和视觉效果要适度，避免影响性能
2. **平台差异**：某些 UIKit 功能在 macOS 上可能不可用
3. **内存管理**：及时释放不再使用的视图和资源
4. **主题适配**：使用系统提供的颜色，确保在不同主题下显示正常

## ⚠️ 开发陷阱与解决方案

### 1. 常见闪退问题

#### 问题：模块加载时机错误
```javascript
// ❌ 错误：在 JSB.newAddon 内部加载模块
JSB.newAddon = function(mainPath) {
  JSB.require('module');  // 💥 导致闪退！
  return JSB.defineClass(...);
};

// ✅ 正确：在文件末尾加载模块
JSB.newAddon = function(mainPath) {
  return JSB.defineClass(...);
};
// 文件末尾
JSB.require('module');
```

#### 问题：ES6 语法兼容性
```javascript
// ❌ 可能导致问题（特别是在初始化阶段）
class TaskModel {
  constructor() {}
}

// ✅ 更安全的传统写法
function TaskModel() {}
TaskModel.prototype.method = function() {}
```

#### 问题：错误的对象创建方式
```javascript
// ❌ 错误：使用 new 操作符
const controller = new TaskController();

// ✅ 正确：使用 JSB 的 .new() 方法
const controller = TaskController.new();
```

### 2. 插件不显示问题

#### 必需实现的方法
```javascript
// 插件在插件栏显示的必要条件
queryAddonCommandStatus: function() {
  return {
    image: "logo.png",      // 44x44 图标
    object: self,           // 回调对象
    selector: "toggleAddon:", // 点击方法
    checked: false          // 选中状态
  };
}
```

#### 静态方法要求
```javascript
// JSB.defineClass 需要两个参数
JSB.defineClass("PluginName : JSExtension", 
  { /* 实例方法 */ },
  { /* 静态方法 - 不能省略 */ 
    addonDidConnect: function() {},
    addonWillDisconnect: function() {}
  }
);
```

### 3. 作用域问题

#### self 引用丢失
```javascript
// 全局保存 self 引用
var self = null;

// 在 sceneWillConnect 中赋值
sceneWillConnect: function() {
  self = this;  // 关键！
  self.path = mainPath;
}
```

### 4. 事件清理问题
```javascript
// ❌ 错误：忘记清理事件
sceneDidDisconnect: function() {
  // 什么都不做
}

// ✅ 正确：清理所有注册的事件
sceneDidDisconnect: function() {
  if (typeof MNUtil === "undefined") return;
  MNUtil.removeObserver(self, "PopupMenuOnNote");
  MNUtil.removeObserver(self, "PopupMenuOnSelection");
  // ... 清理所有事件
}
```

## 🔧 插件开发要点

### 1. 理解数据流
- 用户操作 → 插件响应 → 修改数据 → UI 更新

### 2. 性能考虑
- 避免频繁的数据库操作
- 使用批量更新
- 合理使用缓存

### 3. 用户体验
- 遵循 MarginNote 的交互习惯
- 提供撤销功能
- 错误处理要友好

### 4. 版本兼容
- 检测 MN3/MN4 版本
- 使用条件判断处理差异
- 测试多版本兼容性

### 5. 调试技巧
- 使用 Safari Web Inspector
- 添加详细的日志
- 处理边界情况

#### 官方推荐调试方法

由于 Apple 的安全限制，传统的断点调试在 MarginNote 插件开发中受到限制。官方推荐使用以下方法进行调试：

##### 1. 使用 alert() 方法
```javascript
// 简单的调试信息输出
Application.sharedInstance().alert("调试信息: " + JSON.stringify(data));

// 检查变量值
const note = MNNote.getFocusNote();
if (note) {
  Application.sharedInstance().alert("笔记标题: " + note.noteTitle);
}
```

##### 2. 使用 showHUD() 方法（推荐）
```javascript
// 显示临时提示信息
const app = Application.sharedInstance();
app.showHUD("操作开始", self.window, 1); // 显示 1 秒

// 显示处理进度
app.showHUD("处理中... (1/10)", self.window, 0.5);

// 显示错误信息
app.showHUD("❌ 错误: " + error.message, self.window, 3);
```

##### 3. 日志输出技巧
```javascript
// 创建调试日志函数
function debugLog(message, data) {
  if (typeof MNUtil !== "undefined" && MNUtil.log) {
    MNUtil.log(`[DEBUG] ${message}: ${JSON.stringify(data)}`);
  } else {
    // 降级使用 alert
    Application.sharedInstance().alert(`[DEBUG] ${message}: ${JSON.stringify(data)}`);
  }
}

// 使用示例
debugLog("当前笔记", { id: note.noteId, title: note.noteTitle });
```

##### 4. 错误捕获和调试
```javascript
// 包装函数进行错误捕获
function safeExecute(func, funcName) {
  try {
    return func();
  } catch (error) {
    const errorInfo = {
      function: funcName,
      message: error.message,
      stack: error.stack,
      time: new Date().toISOString()
    };
    
    // 显示错误信息
    Application.sharedInstance().showHUD(
      `错误: ${funcName} - ${error.message}`, 
      self.window, 
      5
    );
    
    // 记录详细错误
    if (typeof MNUtil !== "undefined" && MNUtil.addErrorLog) {
      MNUtil.addErrorLog(error, funcName, errorInfo);
    }
    
    return null;
  }
}

// 使用示例
const result = safeExecute(() => {
  // 可能出错的代码
  return processNote(note);
}, "processNote");
```

##### 5. 性能调试
```javascript
// 测量函数执行时间
function measureTime(func, funcName) {
  const start = Date.now();
  const result = func();
  const duration = Date.now() - start;
  
  Application.sharedInstance().showHUD(
    `${funcName} 耗时: ${duration}ms`, 
    self.window, 
    2
  );
  
  return result;
}

// 使用示例
const notes = measureTime(() => {
  return notebook.notes;
}, "获取所有笔记");
```

##### 6. 调试最佳实践
1. **分阶段调试**：将复杂操作分解为多个步骤，每步都输出调试信息
2. **使用条件调试**：设置调试开关，生产环境关闭调试输出
3. **保存调试日志**：将重要的调试信息保存到文件或剪贴板
4. **可视化调试**：使用 HUD 显示关键状态变化

```javascript
// 调试开关
const DEBUG_MODE = true;

function debug(message) {
  if (DEBUG_MODE) {
    Application.sharedInstance().showHUD(`🔍 ${message}`, self.window, 1);
  }
}
```

### 6. 综合 API 参考（按功能分类）

本节按照实际开发中的功能需求组织 API，每个功能都提供了三种实现方式的对比。

#### 6.1 应用程序与系统信息

<table>
<tr>
<th>功能</th>
<th>MNUtils（推荐）</th>
<th>原生 API</th>
<th>OhMyMN</th>
</tr>
<tr>
<td>获取版本信息</td>
<td>

```javascript
const version = MNUtil.getMarginNoteVersion()
```

</td>
<td>

```javascript
const app = Application.sharedInstance()
const version = app.appVersion
const build = app.build
```

</td>
<td>

```typescript
import { MN } from "marginnote"
const version = MN.appVersion
const build = MN.build
```

</td>
</tr>
<tr>
<td>获取主题</td>
<td>

```javascript
const theme = MNUtil.currentTheme
const colors = MNUtil.themeColor
```

</td>
<td>

```javascript
const app = Application.sharedInstance()
const theme = app.currentTheme
const tintColor = app.defaultTintColor
```

</td>
<td>

```typescript
const theme = MN.currentTheme
const colors = {
  tint: MN.app.defaultTintColor,
  text: MN.app.defaultTextColor
}
```

</td>
</tr>
<tr>
<td>系统路径</td>
<td>

```javascript
const paths = {
  db: MNUtil.db,
  dbFolder: MNUtil.dbFolder,
  doc: MNUtil.docPath,
  cache: MNUtil.cachePath
}
```

</td>
<td>

```javascript
const app = Application.sharedInstance()
const dbPath = app.dbPath
const docPath = app.documentPath
const cachePath = app.cachePath
```

</td>
<td>

```typescript
const paths = {
  db: MN.app.dbPath,
  doc: MN.app.documentPath,
  cache: MN.app.cachePath,
  temp: MN.app.tempPath,
  addon: Addon.path
}
```

</td>
</tr>
</table>

#### 6.2 笔记操作

<table>
<tr>
<th>功能</th>
<th>MNUtils（推荐）</th>
<th>原生 API</th>
<th>OhMyMN</th>
</tr>
<tr>
<td>获取当前笔记</td>
<td>

```javascript
const note = MNNote.getFocusNote()
```

</td>
<td>

```javascript
const mindmapView = self.studyController
  .notebookController.mindmapView
const focusNote = mindmapView.focusNote
```

</td>
<td>

```typescript
import { MN, NodeNote } from "marginnote"
const focusNote = MN.focusNote
const node = new NodeNote(focusNote)
```

</td>
</tr>
<tr>
<td>修改笔记（支持撤销）</td>
<td>

```javascript
MNUtil.undoGrouping(() => {
  note.noteTitle = "新标题"
  note.colorIndex = 3
  note.appendTags(["标签"])
})
```

</td>
<td>

```javascript
UndoManager.sharedInstance().undoGrouping(
  "修改笔记",
  notebookId,
  function() {
    note.noteTitle = "新标题"
    note.colorIndex = 3
  }
)
```

</td>
<td>

```typescript
import { undoGroupingWithRefresh } from "marginnote"
undoGroupingWithRefresh(() => {
  node.noteTitle = "新标题"
  node.colorIndex = 3
  node.appendTags(["标签"])
})
```

</td>
</tr>
<tr>
<td>添加评论</td>
<td>

```javascript
note.appendTextComment("文本评论")
note.appendMarkdownComment("**Markdown**")
note.appendHtmlComment(html, text, size, tag)
```

</td>
<td>

```javascript
note.appendTextComment("文本评论")
note.appendHtmlComment(
  "<b>HTML</b>",
  "纯文本",
  16,
  "tag"
)
```

</td>
<td>

```typescript
node.appendTextComments("文本评论")
// NodeNote 会自动处理多种格式
```

</td>
</tr>
</table>

#### 6.3 用户界面与交互

<table>
<tr>
<th>功能</th>
<th>MNUtils（推荐）</th>
<th>原生 API</th>
<th>OhMyMN</th>
</tr>
<tr>
<td>显示提示</td>
<td>

```javascript
MNUtil.showHUD("操作成功")
```

</td>
<td>

```javascript
Application.sharedInstance().showHUD(
  "操作成功",
  self.window,
  2
)
```

</td>
<td>

```typescript
import { showHUD } from "marginnote"
showHUD("操作成功", 2)
```

</td>
</tr>
<tr>
<td>弹出菜单</td>
<td>

```javascript
const menu = new Menu(button, self, 200)
menu.addMenuItem("选项1", "action1:", param1)
menu.addMenuItem("选项2", "action2:", param2)
menu.show()
```

</td>
<td>

```javascript
// 需要手动创建 UIMenu
const menu = UIMenu.menuWithTitle(
  "",
  children: [/* menu items */]
)
```

</td>
<td>

```typescript
import { select } from "marginnote"
const result = await select(
  ["选项1", "选项2"],
  ["val1", "val2"]
)
```

</td>
</tr>
<tr>
<td>输入对话框</td>
<td>

```javascript
const input = MNUtil.getInputValue(
  "标题",
  "消息",
  "默认值"
)
```

</td>
<td>

```javascript
// 需要使用 UIAlertController
// 代码较复杂
```

</td>
<td>

```typescript
import { popup } from "marginnote"
const result = await popup({
  title: "输入",
  type: PopupType.Input,
  defaultValue: "默认"
})
```

</td>
</tr>
</table>

#### 6.4 文件操作

<table>
<tr>
<th>功能</th>
<th>OhMyMN</th>
<th>MNUtils</th>
<th>原生 API</th>
</tr>
<tr>
<td>读写 JSON</td>
<td>

```typescript
import { readJSON, writeJSON } from "marginnote"
const data = readJSON(path) || {}
data.version = "1.0"
writeJSON(path, data)
```

</td>
<td>

```javascript
// MNUtils 使用 NSUserDefaults
const data = NSUserDefaults
  .standardUserDefaults()
  .objectForKey(key)
```

</td>
<td>

```javascript
// 需要使用 NSFileManager
// 和 NSJSONSerialization
```

</td>
</tr>
<tr>
<td>本地存储</td>
<td>

```typescript
import { getLocalDataByKey, setLocalDataByKey } from "marginnote"
setLocalDataByKey(data, "key")
const saved = getLocalDataByKey("key")
```

</td>
<td>

```javascript
NSUserDefaults.standardUserDefaults()
  .setObjectForKey(data, key)
const saved = NSUserDefaults
  .standardUserDefaults()
  .objectForKey(key)
```

</td>
<td>

```javascript
// 同 MNUtils
```

</td>
</tr>
</table>

#### 6.5 网络请求

<table>
<tr>
<th>功能</th>
<th>OhMyMN</th>
<th>MNUtils</th>
<th>原生 API</th>
</tr>
<tr>
<td>HTTP 请求</td>
<td>

```typescript
import { fetch } from "marginnote"
const data = await fetch(url)
  .then(res => res.json())

// POST 请求
await fetch(url, {
  method: "POST",
  json: { key: "value" }
})
```

</td>
<td>

```javascript
const conn = new MNConnection(url)
conn.sendAsynchronousRequest((res) => {
  const data = JSON.parse(res)
})
```

</td>
<td>

```javascript
// 使用 NSURLConnection
// 或 NSURLSession
// 代码较复杂
```

</td>
</tr>
</table>

#### 6.6 事件处理

<table>
<tr>
<th>功能</th>
<th>OhMyMN</th>
<th>MNUtils</th>
<th>原生 API</th>
</tr>
<tr>
<td>注册事件</td>
<td>

```typescript
import { eventObserverController } from "marginnote"
const observer = eventObserverController([
  "PopupMenuOnNote",
  "ProcessNewExcerpt"
])
observer.add()
```

</td>
<td>

```javascript
MNUtil.addObserver(
  self,
  "onPopupMenuOnNote:",
  "PopupMenuOnNote"
)
```

</td>
<td>

```javascript
NSNotificationCenter.defaultCenter()
  .addObserverSelectorName(
    self,
    "onPopupMenuOnNote:",
    "PopupMenuOnNote"
  )
```

</td>
</tr>
</table>

#### 6.7 开发辅助

<table>
<tr>
<th>功能</th>
<th>OhMyMN</th>
<th>MNUtils</th>
<th>原生 API</th>
</tr>
<tr>
<td>日志输出</td>
<td>

```typescript
import { MN } from "marginnote"
MN.log("信息", data)
MN.error("错误", error)
```

</td>
<td>

```javascript
MNUtil.log("信息: " + JSON.stringify(data))
MNUtil.addErrorLog(error, "function", context)
```

</td>
<td>

```javascript
console.log("信息")
// 或使用 Application.alert()
```

</td>
</tr>
<tr>
<td>延时执行</td>
<td>

```typescript
import { delay } from "marginnote"
await delay(1) // 等待1秒
```

</td>
<td>

```javascript
MNUtil.delay(1).then(() => {
  // 1秒后执行
})
```

</td>
<td>

```javascript
self.performSelector(
  "method:",
  null,
  1.0
)
```

</td>
</tr>
</table>

### API 选择建议

1. **优先使用 MNUtils**：成熟稳定，拥有丰富的 API 封装和大量示例代码
2. **原生 API 适用特殊场景**：当需要最小依赖或 MNUtils 未提供的功能时使用
3. **OhMyMN 作为未来选择**：如果项目需要 TypeScript 支持和现代化开发体验

## 🔄 插件生命周期详解

### 1. 生命周期方法完整列表

#### 实例方法（每个窗口独立）
```javascript
{
  // 窗口生命周期
  sceneWillConnect: function() {
    // 新建 MN 窗口时调用
    // 初始化插件组件
  },
  
  sceneDidDisconnect: function() {
    // 关闭 MN 窗口时调用
    // 清理资源，保存状态
  },
  
  sceneWillResignActive: function() {
    // 窗口失去焦点时调用
    // 暂停活动，保存临时状态
  },
  
  sceneDidBecomeActive: function() {
    // 窗口获得焦点时调用
    // 恢复活动，刷新UI
  },
  
  // 笔记本生命周期
  notebookWillOpen: function(notebookId) {
    // 打开笔记本时调用
    // 加载笔记本相关配置
  },
  
  notebookWillClose: function(notebookId) {
    // 关闭笔记本时调用
    // 保存笔记本数据
  },
  
  // 文档生命周期
  documentDidOpen: function(docMd5) {
    // 打开文档时调用
    // 初始化文档相关功能
  },
  
  documentWillClose: function(docMd5) {
    // 关闭文档时调用
    // 清理文档资源
  }
}
```

#### 静态方法（全局唯一）
```javascript
{
  addonDidConnect: function() {
    // 插件安装/启用时调用（包括 MN 启动）
    // 全局初始化
  },
  
  addonWillDisconnect: function() {
    // 插件卸载/禁用时调用
    // 全局清理
  }
}
```

### 2. 生命周期管理最佳实践

#### 初始化策略
```javascript
sceneWillConnect: function() {
  // 1. 保存实例引用
  self = this;
  self.path = mainPath;
  
  // 2. 检查依赖
  if (typeof MNUtil === "undefined") {
    console.error("MNUtils not installed");
    return;
  }
  
  // 3. 初始化组件
  MNUtil.init(mainPath);
  self.initComponents();
  
  // 4. 注册事件
  self.registerObservers();
  
  // 5. 恢复上次状态
  self.restoreState();
}
```

#### 资源清理策略
```javascript
sceneDidDisconnect: function() {
  // 1. 保存当前状态
  self.saveState();
  
  // 2. 清理事件监听
  self.removeAllObservers();
  
  // 3. 释放大对象
  self.cleanup();
  
  // 4. 取消定时器
  if (self.timers) {
    self.timers.forEach(timer => clearTimeout(timer));
  }
}
```

## 📡 事件系统完整指南

### 1. 事件注册与管理

#### 使用 MNUtil（推荐）
```javascript
// 注册事件
MNUtil.addObserver(self, 'onPopupMenuOnNote:', 'PopupMenuOnNote');

// 移除事件
MNUtil.removeObserver(self, 'PopupMenuOnNote');
```


### 2. 完整事件列表

| 事件名 | 触发时机 | 参数 | 用途 |
|--------|----------|------|------|
| AddonBroadcast | 打开特定 URL | URL 信息 | 插件间通信 |
| ProcessNewExcerpt | 创建摘录 | 摘录信息 | 处理新摘录 |
| ChangeExcerptRange | 修改摘录范围 | 修改信息 | 同步更新 |
| PopupMenuOnNote | 点击笔记 | 笔记对象 | 添加菜单项 |
| ClosePopupMenuOnNote | 笔记菜单关闭 | - | 清理状态 |
| PopupMenuOnSelection | 选择文本 | 选区信息 | 处理选区 |
| ClosePopupMenuOnSelection | 选区菜单关闭 | - | 清理状态 |
| OCRImageBegin | OCR 开始 | 图片信息 | 准备 OCR |
| OCRImageEnd | OCR 结束 | 识别结果 | 处理结果 |

### 3. 事件处理示例

#### 处理笔记菜单
```javascript
onPopupMenuOnNote: function(sender) {
  const note = sender.userInfo.note;
  
  // 添加菜单项
  MNUtil.addMenuItem({
    title: "自定义操作",
    object: self,
    selector: "customAction:",
    param: note
  });
}
```

#### 处理新摘录
```javascript
onProcessNewExcerpt: function(sender) {
  const excerptInfo = sender.userInfo;
  
  MNUtil.undoGrouping(() => {
    // 自动处理新摘录
    const note = excerptInfo.note;
    if (note) {
      // 添加标签、修改格式等
      note.appendTags(["已处理"]);
    }
  });
}
```

## 🎨 OhMyMN 框架详解

### 框架概述

OhMyMN 是一个专为 MarginNote 插件开发设计的现代化框架，它极大地降低了插件开发的门槛，提供了：
- 完整的 TypeScript 类型定义
- 优雅的 API 设计
- 强大的工具函数库
- 模块化的开发方式
- 热重载开发体验

### 核心概念

#### 1. NodeNote vs MbBookNote

OhMyMN 提供了两个核心的笔记类：

**MbBookNote**：
- MarginNote 中所有笔记的基础类型
- 不是所有 MbBookNote 都是卡片
- 提供基础的笔记操作功能

**NodeNote**：
- MbBookNote 的增强版本
- NodeNote 一定是一张卡片
- 提供更丰富的操作方法和属性访问

```typescript
import { NodeNote, MN } from "marginnote"

// 获取当前笔记并转换为 NodeNote
const focusNote = MN.focusNote
if (focusNote) {
  const node = new NodeNote(focusNote)
  
  // NodeNote 提供的增强功能
  const allText = node.allText  // 获取所有文本
  const excerpts = node.excerptsText  // 获取摘录文本
  const comments = node.commentsText  // 获取评论文本
  
  // 层级操作
  const children = node.childNodes  // 子节点
  const parent = node.parentNode  // 父节点
  const descendants = node.descendantNodes  // 所有后代节点
}
```

### 核心 API 模块

#### 1. 应用程序接口 (Application)

```typescript
import { MN } from "marginnote"

// 应用信息
const version = MN.appVersion  // "4.0.2"
const build = MN.build  // "4.0.2(97)"
const isMac = MN.isMac  // 是否 Mac 版本

// 主题和颜色
const currentTheme = MN.currentTheme  // "Gray" | "Default" | "Dark" | "Green" | "Sepia"
const tintColor = MN.app.defaultTintColor
const textColor = MN.app.defaultTextColor

// 路径
const dbPath = MN.app.dbPath
const docPath = MN.app.documentPath
const cachePath = MN.app.cachePath

// 窗口和控制器
const focusWindow = MN.app.focusWindow
const studyController = MN.studyController
```

#### 2. 笔记操作 (Note)

```typescript
import { NodeNote, undoGroupingWithRefresh, isNoteExist } from "marginnote"

// 创建/修改笔记（支持撤销）
undoGroupingWithRefresh(() => {
  const note = new NodeNote(someNote)
  
  // 基础属性修改
  note.noteTitle = "新标题"
  note.colorIndex = 3  // 颜色索引 0-15
  
  // 内容操作
  note.appendTitles("额外标题")
  note.appendTags(["标签1", "标签2"])
  note.appendTextComments("文本评论")
  
  // 移除评论但保留链接标签
  note.removeCommentButLinkTag()
  
  // 整理标签
  note.tidyupTags()
})

// 检查笔记是否存在
if (isNoteExist(noteId)) {
  // 笔记存在
}
```

#### 3. 弹窗和用户交互 (Popup)

```typescript
import { popup, showHUD, alert, confirm, select } from "marginnote"

// 显示临时提示
showHUD("操作成功", 2)  // 显示2秒

// 简单提示
alert("这是一个提示")

// 确认对话框
const confirmed = await confirm("确定要执行此操作吗？")

// 选择列表
const selected = await select(
  ["选项1", "选项2", "选项3"],
  ["value1", "value2", "value3"],
  0  // 默认选中索引
)

// 高级弹窗
const result = await popup({
  title: "输入信息",
  message: "请输入您的名字：",
  type: PopupType.Input,
  buttons: ["确定", "取消"],
  defaultValue: "默认值"
})
```

#### 4. 网络请求 (Fetch)

```typescript
import { fetch } from "marginnote"

// GET 请求
const data = await fetch("https://api.example.com/data")
  .then(res => res.json())

// POST 请求 (JSON)
const response = await fetch("https://api.example.com/submit", {
  method: "POST",
  headers: {
    "Authorization": "Bearer token"
  },
  json: {
    name: "test",
    value: 123
  }
})

// POST 请求 (Form)
const formResponse = await fetch("https://api.example.com/form", {
  method: "POST",
  form: {
    field1: "value1",
    field2: "value2"
  }
})
```

#### 5. 文件操作 (File)

```typescript
import { 
  isfileExists, 
  copyFile, 
  writeTextFile, 
  readJSON, 
  writeJSON,
  MN
} from "marginnote"

// 文件路径
const cachePath = MN.app.cachePath
const tempPath = MN.app.tempPath
const addonPath = Addon.path

// 检查文件
if (isfileExists(filePath)) {
  // 文件存在
}

// 读写 JSON
const config = readJSON(configPath) || {}
config.version = "1.0.0"
writeJSON(configPath, config)

// 写入文本文件
writeTextFile(logPath, "日志内容")

// 复制文件
const success = copyFile(sourcePath, destPath)
```

#### 6. 延时和定时器 (Delay)

```typescript
import { delay, loopBreak, setTimeInterval } from "marginnote"

// 等待 1 秒
await delay(1)

// 条件轮询（最多尝试 10 次，每次间隔 0.5 秒）
const success = await loopBreak(10, 0.5, () => {
  return someCondition === true
})

// 定时执行
const timer = setTimeInterval(2, () => {
  console.log("每2秒执行一次")
})

// 停止定时器
timer.invalidate()
```

#### 7. 其他实用工具

```typescript
import { 
  getLocalDataByKey, 
  setLocalDataByKey,
  copy,
  openURL,
  postNotification
} from "marginnote"

// 本地数据存储
setLocalDataByKey({ name: "test" }, "config")
const config = getLocalDataByKey("config")

// 复制到剪贴板
copy("要复制的文本", true)  // 第二个参数为是否显示 HUD

// 打开 URL
openURL("https://marginnote.com")

// 发送通知（用于插件间通信）
postNotification("CustomEvent", { data: "some data" })
```

### 开发工具函数

#### 1. 生命周期辅助

```typescript
import { defineLifecycleHandlers } from "marginnote"

// 获取类型安全的生命周期方法
const handlers = defineLifecycleHandlers({
  instanceMethods: {
    sceneWillConnect() {
      // 初始化
    },
    notebookWillOpen(notebookId: string) {
      // 笔记本打开
    }
  },
  classMethods: {
    addonDidConnect() {
      // 插件安装
    }
  }
})
```

#### 2. 事件处理辅助

```typescript
import { defineEventHandlers, eventObserverController } from "marginnote"

// 定义事件处理器
const eventHandlers = defineEventHandlers({
  onProcessNewExcerpt(excerptInfo) {
    // 处理新摘录
  },
  onPopupMenuOnNote({ note }) {
    // 笔记菜单
  }
})

// 事件观察者控制器
const observer = eventObserverController([
  "ProcessNewExcerpt",
  "PopupMenuOnNote"
])

// 添加所有事件
observer.add()

// 移除所有事件
observer.remove()
```

#### 3. 国际化支持

```typescript
import { i18n } from "marginnote"

// 定义多语言文本
const lang = i18n({
  zh: {
    title: "标题",
    confirm: "确定",
    cancel: "取消"
  },
  en: {
    title: "Title", 
    confirm: "OK",
    cancel: "Cancel"
  }
})

// 自动根据系统语言选择
console.log(lang.title)  // 中文系统显示"标题"，英文系统显示"Title"
```

### OhMyMN 模块开发

OhMyMN 支持模块化开发，让你可以创建可复用的功能模块：

```typescript
// 定义模块
export default {
  name: "MyModule",
  title: "我的模块",
  settings: [
    {
      key: "enable",
      type: SettingType.Switch,
      label: "启用模块"
    }
  ],
  actions: [
    {
      title: "执行操作",
      handler: async () => {
        // 操作逻辑
      }
    }
  ],
  lifecycle: {
    onLoad() {
      // 模块加载
    },
    onUnload() {
      // 模块卸载
    }
  }
}
```

### Lite 插件开发

对于简单功能，可以使用 OhMyMN Lite 模式开发：

```typescript
// 200 行左右的简单插件
import { JSB, MN, showHUD } from "marginnote"

JSB.newAddon = () => {
  return JSB.defineClass("SimplPlugin : JSExtension", {
    sceneWillConnect() {
      // 初始化
      showHUD("插件已加载")
    },
    
    queryAddonCommandStatus() {
      return {
        image: "logo.png",
        object: this,
        selector: "toggle:",
        checked: false
      }
    },
    
    toggle() {
      showHUD("Hello from Lite Plugin!")
    }
  })
}
```

### 最佳实践

1. **类型安全**：充分利用 TypeScript 的类型系统
2. **错误处理**：使用 try-catch 包装可能出错的操作
3. **性能优化**：避免在循环中进行频繁的 API 调用
4. **模块化**：将功能拆分为独立的模块
5. **国际化**：使用 i18n 支持多语言

## 📝 最佳实践

1. **遵循 MN 设计理念**
   - 以学习为中心
   - 强调知识管理
   - 注重效率

2. **插件功能定位**
   - 增强而非替代
   - 专注特定场景
   - 保持简洁

3. **数据安全**
   - 操作前备份
   - 验证用户输入
   - 处理异常情况

4. **性能优化**
   - 懒加载资源
   - 异步处理任务
   - 及时释放内存

5. **用户反馈**
   - 清晰的操作提示
   - 进度显示
   - 错误说明

## 📖 官方 API 参考

### 核心类层次结构

```
JSExtension (插件基类)
├── Application (应用管理)
│   ├── JSBApplication
│   └── JSBDocumentController
├── Notebook (笔记本管理)
│   ├── JSBNotebookController
│   ├── JSBMindMapView
│   └── JSBOutlineView
├── Database (数据管理)
│   ├── JSBMbTopic (笔记本)
│   ├── JSBMbBookNote (笔记)
│   ├── JSBMbBook (文档)
│   └── JSBMbModelTool (工具)
└── UI Components (界面组件)
    ├── UIView
    ├── UIButton
    ├── UIColor
    └── UIImage
```

### JSBApplication API

| 属性/方法 | 类型 | 说明 |
|-----------|------|------|
| **属性** |
| currentTheme | String | 当前主题 ("Gray", "Default", "Dark", "Green", "Sepia") |
| defaultTintColor | UIColor | 默认主题色 |
| defaultTextColor | UIColor | 默认文本颜色 |
| defaultBookPageColor | UIColor | 默认书页颜色 |
| defaultNotebookColor | UIColor | 默认笔记本颜色 |
| dbPath | String | 数据库路径 |
| documentPath | String | 文档路径 |
| cachePath | String | 缓存路径 |
| osType | Integer | 系统类型 (0: iPadOS, 1: iPhoneOS, 2: macOS) |
| **方法** |
| sharedInstance() | JSBApplication | 获取应用实例 |
| showHUD(message, view, duration) | void | 显示提示信息 |
| alert(message) | void | 显示警告框 |
| openURL(url) | void | 打开 URL |
| refreshAfterDBChanged(topicId) | void | 刷新数据库 |

### JSBMbBookNote API

| 属性/方法 | 类型 | 读写 | 说明 |
|-----------|------|------|------|
| **基本属性** |
| noteId | String | 只读 | 笔记唯一标识 |
| noteTitle | String | 读写 | 笔记标题 |
| excerptText | String | 读写 | 摘录文本 |
| colorIndex | Integer | 读写 | 颜色索引 (0-15) |
| fillIndex | Integer | 读写 | 填充样式索引 |
| mindmapPosition | CGPoint | 读写 | 脑图位置 |
| **关联属性** |
| notebookId | String | 只读 | 所属笔记本 ID |
| docMd5 | String | 只读 | 所属文档 MD5 |
| startPage | Integer | 只读 | 起始页码 |
| endPage | Integer | 只读 | 结束页码 |
| **时间属性** |
| createDate | Date | 只读 | 创建时间 |
| modifiedDate | Date | 只读 | 修改时间 |
| **关系属性** |
| parentNote | MbBookNote | 只读 | 父笔记 |
| childNotes | Array | 只读 | 子笔记数组 |
| linkedNotes | Array | 只读 | 链接的笔记 |
| comments | Array | 只读 | 评论数组 |
| **方法** |
| createWithTitle(title) | MbBookNote | 创建新笔记 |
| appendTextComment(text) | void | 添加文本评论 |
| appendHtmlComment(html, text, size, tag) | void | 添加 HTML 评论 |
| appendNoteLink(note, text) | void | 添加笔记链接 |
| removeCommentByIndex(index) | void | 删除评论 |
| paste() | void | 粘贴内容 |
| clearFormat() | void | 清除格式 |
| merge(note) | void | 合并笔记 |

### JSBDocumentController API

| 属性/方法 | 类型 | 说明 |
|-----------|------|------|
| **属性** |
| document | JSBMbBook | 当前文档对象 |
| currentPage | Integer | 当前页码 |
| selectionsByIndex | Array | 选中内容数组 |
| **方法** |
| gotoPage(pageIndex) | void | 跳转到指定页 |
| search(keyword) | Array | 搜索关键词 |
| highlightSelection(selection) | void | 高亮选中内容 |

### JSBNotebookController API

| 属性/方法 | 类型 | 说明 |
|-----------|------|------|
| **属性** |
| notebook | JSBMbTopic | 当前笔记本 |
| mindmapView | JSBMindMapView | 脑图视图 |
| outlineView | JSBOutlineView | 大纲视图 |
| **方法** |
| focusNote(noteId) | void | 聚焦到指定笔记 |
| refreshView() | void | 刷新视图 |

### 事件回调 API

```javascript
// 笔记菜单事件
onPopupMenuOnNote: function(sender) {
  // sender.userInfo.note - 当前笔记对象
  // sender.userInfo.documentController - 文档控制器
}

// 选择区域菜单事件
onPopupMenuOnSelection: function(sender) {
  // sender.userInfo.documentController - 文档控制器
  // sender.userInfo.selection - 选中内容
}

// 新摘录事件
onProcessNewExcerpt: function(sender) {
  // sender.userInfo.note - 新创建的笔记
  // sender.userInfo.excerptText - 摘录文本
}

// OCR 事件
onOCRImageBegin: function(sender) {
  // sender.userInfo.imageData - 图片数据
}

onOCRImageEnd: function(sender) {
  // sender.userInfo.text - 识别结果
}
```

### 颜色索引参考

| 索引 | 颜色 | 索引 | 颜色 |
|------|------|------|------|
| 0 | 淡黄色 | 8 | 橙色 |
| 1 | 淡绿色 | 9 | 深绿色 |
| 2 | 淡蓝色 | 10 | 深蓝色 |
| 3 | 淡红色 | 11 | 深红色 |
| 4 | 黄色 | 12 | 白色 |
| 5 | 绿色 | 13 | 淡灰色 |
| 6 | 蓝色 | 14 | 深灰色 |
| 7 | 红色 | 15 | 紫色 |

## 🚀 常见插件类型

1. **笔记处理类**
   - 批量整理
   - 格式转换
   - 内容增强

2. **学习辅助类**
   - 复习计划
   - 知识测试
   - 学习统计

3. **导入导出类**
   - 第三方格式支持
   - 数据迁移
   - 备份管理

4. **界面增强类**
   - 快捷操作
   - 视图定制
   - 主题美化

5. **集成类**
   - 外部服务连接
   - API 集成
   - 云同步

## 💡 开发规范与标准

### 1. 代码组织规范

#### 文件结构
```
plugin/
├── main.js              # 主入口文件
├── mnaddon.json         # 插件配置
├── logo.png            # 44x44 图标
├── controllers/        # 控制器
│   ├── mainController.js
│   └── settingController.js
├── models/            # 数据模型
│   └── dataModel.js
├── utils/             # 工具函数
│   └── helpers.js
└── resources/         # 资源文件
    ├── html/
    ├── css/
    └── images/
```

#### 命名规范
```javascript
// 类名：PascalCase
class TaskManager {}
JSB.defineClass("TaskManager : NSObject", {})

// 方法名：camelCase
function createTask() {}
createTask: function() {}

// 常量：UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;

// 私有属性：下划线前缀
this._privateData = [];
```

### 2. 错误处理规范

#### 基础错误处理
```javascript
function safeExecute(fn, context) {
  try {
    return fn.call(context);
  } catch (error) {
    // 记录错误
    if (typeof MNUtil !== "undefined" && MNUtil.addErrorLog) {
      MNUtil.addErrorLog(error, fn.name, context);
    }
    
    // 用户提示
    if (typeof MNUtil !== "undefined" && MNUtil.showHUD) {
      MNUtil.showHUD("操作失败: " + error.message);
    }
    
    // 返回默认值
    return null;
  }
}
```

#### 异步错误处理
```javascript
async function asyncOperation() {
  try {
    // 显示进度
    MNUtil.showHUD("处理中...");
    
    // 执行操作
    const result = await someAsyncTask();
    
    // 成功提示
    MNUtil.showHUD("✅ 完成");
    return result;
  } catch (error) {
    // 错误恢复
    await this.recoverFromError(error);
    
    // 错误提示
    MNUtil.showHUD("❌ " + error.message);
    throw error;
  }
}
```

### 3. 性能优化规范

#### 防抖与节流
```javascript
// 防抖实现
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

// 使用示例
this.search = debounce(this.performSearch, 300);
```

#### 批量操作
```javascript
// 使用 undoGrouping 批量操作
MNUtil.undoGrouping(() => {
  notes.forEach(note => {
    note.noteTitle = processTitle(note.noteTitle);
    note.colorIndex = 2;
  });
});
```

#### 内存管理
```javascript
// 及时释放大对象
cleanupLargeData: function() {
  this.largeArray = null;
  this.cacheData = {};
  
  // 强制垃圾回收（如果可用）
  if (global.gc) {
    global.gc();
  }
}
```

## 🚀 开发流程指南

### 1. 开发环境搭建

#### 通用必需工具
- **Mac 电脑**：开发和调试必需
- **MarginNote 4**：Mac 版本用于测试
- **代码编辑器**：推荐 VSCode
- **Node.js**：v18+ (用于工具链)

#### OhMyMN 开发环境
```bash
# 安装 Node.js 和 pnpm
brew install node
npm install -g pnpm

# 创建 OhMyMN 项目
pnpm create ohmymn

# 选择项目类型
# ? Select a project type:
# > OhMyMN Plugin (完整插件)
# > OhMyMN Module (模块开发)
# > Lite Plugin (轻量插件)

# 安装依赖
cd my-ohmymn-plugin
pnpm install

# 启动开发服务器（支持热重载）
pnpm dev

# 构建插件
pnpm build
```

#### MNUtils/传统开发环境
```bash
# 安装 mnaddon CLI 工具
npm install -g mnaddon

# 创建插件项目
mnaddon create my-plugin
cd my-plugin

# 或手动创建
mkdir my-plugin
cd my-plugin
npm init -y

# 基础文件结构
touch main.js
touch mnaddon.json
# 添加 44x44 的 logo.png
```

### 2. VSCode 配置优化

#### 推荐扩展
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "marginnote.marginnote-api"
  ]
}
```

#### TypeScript 配置 (OhMyMN)
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "types": ["@marginnote/api"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

#### 代码片段 (Code Snippets)
```json
// .vscode/marginnote.code-snippets
{
  "OhMyMN Plugin Template": {
    "prefix": "ohmymn",
    "body": [
      "import { JSB, MN, showHUD } from 'marginnote'",
      "",
      "JSB.newAddon = () => {",
      "  return JSB.defineClass('${1:PluginName} : JSExtension', {",
      "    sceneWillConnect() {",
      "      showHUD('${1:PluginName} loaded', 2)",
      "      $0",
      "    },",
      "    ",
      "    queryAddonCommandStatus() {",
      "      return {",
      "        image: 'logo.png',",
      "        object: this,",
      "        selector: 'toggle:',",
      "        checked: false",
      "      }",
      "    },",
      "    ",
      "    toggle() {",
      "      // Your code here",
      "    }",
      "  })",
      "}"
    ]
  }
}
```

### 3. 开发工作流

#### OhMyMN 热重载开发流程

```bash
# 1. 启动开发服务器
pnpm dev

# 2. 自动监听文件变化并重新编译
# 3. 在 MarginNote 中刷新插件即可看到更新
# 4. 使用浏览器控制台查看日志
```

**热重载特性**：
- 自动编译 TypeScript
- 实时更新插件代码
- 保留插件状态
- 快速迭代开发

#### 传统开发流程

```bash
# 1. 编写代码
# 2. 打包插件
mnaddon pack .

# 3. 安装到 MarginNote
# macOS 路径
cp my-plugin.mnaddon ~/Library/Containers/QReader.MarginNoteMac/Data/Library/MarginNote\ 4/Extensions/

# 4. 重启 MarginNote 测试
```

### 4. 调试技巧进阶

#### OhMyMN 调试方法

```typescript
import { MN, showHUD, HUDController } from "marginnote"

// 1. 控制台日志（推荐）
MN.log("Debug info", { data: someData })
MN.error("Error occurred", error)

// 2. HUD 调试信息
const hud = HUDController()
hud.show("Processing...")
// 执行操作
hud.hidden("Complete!")

// 3. 条件断点
if (MN.dev) {  // 开发模式
  debugger  // 浏览器会在此暂停
}

// 4. 性能分析
console.time("operation")
// 执行操作
console.timeEnd("operation")
```

#### Safari Web Inspector 调试

1. **启用开发者模式**
   - Safari → 偏好设置 → 高级 → 勾选"在菜单栏中显示开发菜单"

2. **连接 MarginNote**
   - 打开 MarginNote 4
   - Safari → 开发 → [你的设备] → MarginNote
   - 选择对应的 WebView

3. **调试功能**
   - 设置断点
   - 查看变量
   - 执行表达式
   - 性能分析

#### 高级调试技巧

```typescript
// 1. 自定义调试类
class Debugger {
  private enabled = MN.dev
  
  log(category: string, ...args: any[]) {
    if (!this.enabled) return
    
    const timestamp = new Date().toISOString()
    const prefix = `[${category}] ${timestamp}:`
    
    console.group(prefix)
    console.log(...args)
    console.trace()
    console.groupEnd()
  }
  
  time(label: string, fn: () => any) {
    if (!this.enabled) return fn()
    
    console.time(label)
    const result = fn()
    console.timeEnd(label)
    return result
  }
  
  async timeAsync(label: string, fn: () => Promise<any>) {
    if (!this.enabled) return fn()
    
    console.time(label)
    const result = await fn()
    console.timeEnd(label)
    return result
  }
}

const debug = new Debugger()

// 使用
debug.log("NoteProcess", "Processing note", note)
const result = debug.time("Database Query", () => {
  return queryDatabase()
})
```

```typescript
// 2. 错误边界
function withErrorBoundary<T extends (...args: any[]) => any>(
  fn: T,
  errorHandler?: (error: Error) => void
): T {
  return ((...args: Parameters<T>) => {
    try {
      const result = fn(...args)
      if (result instanceof Promise) {
        return result.catch(error => {
          MN.error("Async error", error)
          errorHandler?.(error)
          showHUD(`错误: ${error.message}`, 3)
        })
      }
      return result
    } catch (error) {
      MN.error("Sync error", error)
      errorHandler?.(error)
      showHUD(`错误: ${error.message}`, 3)
    }
  }) as T
}

// 使用
const safeProcess = withErrorBoundary(processNote)
```

```typescript
// 3. 状态监控
class StateMonitor {
  private states = new Map<string, any>()
  
  track(key: string, value: any) {
    const oldValue = this.states.get(key)
    this.states.set(key, value)
    
    if (MN.dev && oldValue !== value) {
      console.log(`State Change: ${key}`, {
        old: oldValue,
        new: value,
        stack: new Error().stack
      })
    }
  }
  
  snapshot() {
    return Object.fromEntries(this.states)
  }
}
```

### 5. 最佳实践工作流

#### 项目结构（OhMyMN）
```
my-ohmymn-plugin/
├── src/
│   ├── main.ts          # 入口文件
│   ├── modules/         # 功能模块
│   ├── utils/           # 工具函数
│   └── types/           # 类型定义
├── assets/
│   └── logo.png         # 插件图标
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md
```

#### Git 工作流
```bash
# 1. 初始化仓库
git init
git add .
git commit -m "Initial commit"

# 2. 功能分支开发
git checkout -b feature/note-processing
# 开发功能
git add .
git commit -m "Add note processing feature"

# 3. 版本标签
git tag v1.0.0
git push origin v1.0.0
```

#### 持续集成配置
```yaml
# .github/workflows/build.yml
name: Build and Release

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
          
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
          
      - run: pnpm install
      - run: pnpm build
      
      - uses: softprops/action-gh-release@v1
        with:
          files: dist/*.mnaddon
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 3. 调试技巧

#### Safari 远程调试
1. 在 Mac Safari 中启用开发菜单
2. 在 iOS 设备设置中启用 Web 检查器
3. 连接设备，在 Safari 开发菜单中选择设备
4. 打开 MarginNote，选择对应的 WebView

#### 日志系统
```javascript
// 开发环境日志类
class Logger {
  constructor(prefix) {
    this.prefix = prefix;
    this.enabled = true;
  }
  
  log(...args) {
    if (!this.enabled) return;
    
    const timestamp = new Date().toISOString();
    const message = `[${this.prefix}] ${timestamp}:`;
    
    // 控制台输出
    console.log(message, ...args);
    
    // MNUtil 日志
    if (typeof MNUtil !== "undefined" && MNUtil.log) {
      MNUtil.log(`${message} ${args.join(' ')}`);
    }
  }
  
  error(error, context) {
    this.log('ERROR:', error.message, error.stack);
    
    if (typeof MNUtil !== "undefined" && MNUtil.addErrorLog) {
      MNUtil.addErrorLog(error, context.method, context.data);
    }
  }
}

// 使用示例
const logger = new Logger('MyPlugin');
logger.log('Plugin initialized');
```

## 📘 实战开发指南

本节通过实际案例展示如何开发常见的 MarginNote 插件功能。

### 案例1：智能笔记处理器

**需求**：自动处理新创建的笔记，添加标签、生成标题、分类整理。

#### OhMyMN 实现

```typescript
import { 
  JSB, MN, NodeNote, 
  undoGroupingWithRefresh, 
  eventObserverController,
  getLocalDataByKey, 
  setLocalDataByKey 
} from "marginnote"

// 配置管理
interface Config {
  autoTitle: boolean
  autoTag: boolean
  tagPrefix: string
  colorByType: boolean
}

class SmartNoteProcessor {
  private config: Config
  private observer = eventObserverController(["ProcessNewExcerpt"])
  
  constructor() {
    this.loadConfig()
  }
  
  loadConfig() {
    this.config = getLocalDataByKey("smart-processor-config") || {
      autoTitle: true,
      autoTag: true,
      tagPrefix: "auto:",
      colorByType: true
    }
  }
  
  saveConfig() {
    setLocalDataByKey(this.config, "smart-processor-config")
  }
  
  // 智能生成标题
  generateTitle(text: string): string {
    // 1. 尝试提取第一句话
    const firstSentence = text.match(/^[^。！？.!?]+[。！？.!?]/)?.[0]
    if (firstSentence && firstSentence.length <= 50) {
      return firstSentence
    }
    
    // 2. 尝试提取关键词
    const keywords = this.extractKeywords(text)
    if (keywords.length > 0) {
      return keywords.slice(0, 3).join(" - ")
    }
    
    // 3. 截取前30个字符
    return text.substring(0, 30) + "..."
  }
  
  // 提取关键词（简化版）
  extractKeywords(text: string): string[] {
    // 这里可以接入更复杂的NLP算法
    const words = text.split(/[，。！？\s]+/)
    const stopWords = ["的", "了", "和", "是", "在", "有", "个", "到", "这", "与"]
    
    return words
      .filter(word => word.length > 1 && !stopWords.includes(word))
      .slice(0, 5)
  }
  
  // 根据内容类型分配颜色
  getColorByType(text: string): number {
    if (text.includes("定义") || text.includes("概念")) return 4  // 黄色
    if (text.includes("例子") || text.includes("示例")) return 5  // 绿色
    if (text.includes("重要") || text.includes("关键")) return 7  // 红色
    if (text.includes("问题") || text.includes("疑问")) return 6  // 蓝色
    return 0  // 默认颜色
  }
  
  // 处理新笔记
  processNewNote(note: any) {
    const nodeNote = new NodeNote(note)
    
    undoGroupingWithRefresh(() => {
      // 1. 自动生成标题
      if (this.config.autoTitle && !nodeNote.noteTitle) {
        const title = this.generateTitle(nodeNote.excerptsText)
        nodeNote.noteTitle = title
      }
      
      // 2. 自动添加标签
      if (this.config.autoTag) {
        const tags = []
        
        // 添加时间标签
        const date = new Date().toISOString().split('T')[0]
        tags.push(`${this.config.tagPrefix}${date}`)
        
        // 添加关键词标签
        const keywords = this.extractKeywords(nodeNote.excerptsText)
        keywords.slice(0, 3).forEach(keyword => {
          tags.push(`${this.config.tagPrefix}${keyword}`)
        })
        
        nodeNote.appendTags(tags)
      }
      
      // 3. 根据类型设置颜色
      if (this.config.colorByType) {
        const color = this.getColorByType(nodeNote.excerptsText)
        nodeNote.colorIndex = color
      }
      
      // 4. 添加处理记录
      const timestamp = new Date().toLocaleString()
      nodeNote.appendTextComments(`[智能处理] ${timestamp}`)
    })
  }
  
  // 批量处理现有笔记
  async batchProcess() {
    const notebook = MN.currentNotebook
    if (!notebook) return
    
    const notes = notebook.notes
    let processed = 0
    
    for (const note of notes) {
      if (!note.noteTitle) {  // 只处理没有标题的笔记
        this.processNewNote(note)
        processed++
        
        // 每处理10个笔记暂停一下，避免卡顿
        if (processed % 10 === 0) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }
    }
    
    MN.showHUD(`批量处理完成：${processed} 个笔记`, 3)
  }
}

// 插件主体
JSB.newAddon = () => {
  const processor = new SmartNoteProcessor()
  
  return JSB.defineClass("SmartNoteProcessor : JSExtension", {
    sceneWillConnect() {
      processor.observer.add()
    },
    
    sceneDidDisconnect() {
      processor.observer.remove()
    },
    
    // 处理新摘录
    onProcessNewExcerpt({ userInfo }) {
      const note = userInfo.note
      if (note) {
        processor.processNewNote(note)
      }
    },
    
    // 插件按钮
    queryAddonCommandStatus() {
      return {
        image: "logo.png",
        object: this,
        selector: "showMenu:",
        checked: false
      }
    },
    
    // 显示菜单
    async showMenu() {
      const options = [
        "批量处理现有笔记",
        "配置设置",
        "关于插件"
      ]
      
      const result = await MN.select(options, null)
      
      switch (result?.index) {
        case 0:
          await processor.batchProcess()
          break
        case 1:
          await this.showConfig()
          break
        case 2:
          MN.alert("智能笔记处理器 v1.0.0\n自动处理和整理您的笔记")
          break
      }
    },
    
    // 配置界面
    async showConfig() {
      // 这里可以实现更复杂的配置界面
      const config = processor.config
      
      const autoTitle = await MN.confirm(
        "是否启用自动生成标题？\n当前：" + (config.autoTitle ? "已启用" : "已禁用")
      )
      
      if (autoTitle !== config.autoTitle) {
        config.autoTitle = autoTitle
        processor.saveConfig()
        MN.showHUD("配置已保存", 2)
      }
    }
  })
}
```

### 案例2：笔记导出工具

**需求**：将笔记导出为 Markdown、Anki 卡片等格式。

#### 混合实现（使用 MNUtils）

```javascript
// 使用 MNUtils 提供的基础功能
if (typeof MNUtil === "undefined") {
  Application.sharedInstance().alert("请先安装 MNUtils 插件")
  return
}

var self;

// Markdown 导出器
function MarkdownExporter() {
  this.exportNote = function(note) {
    var md = ""
    
    // 标题
    if (note.noteTitle) {
      md += "# " + note.noteTitle + "\n\n"
    }
    
    // 摘录
    if (note.excerptText) {
      md += "> " + note.excerptText.replace(/\n/g, "\n> ") + "\n\n"
    }
    
    // 评论
    var comments = note.comments
    if (comments && comments.length > 0) {
      md += "## 笔记\n\n"
      comments.forEach(function(comment) {
        if (comment.text) {
          md += "- " + comment.text + "\n"
        }
      })
      md += "\n"
    }
    
    // 标签
    var tags = note.tags
    if (tags && tags.length > 0) {
      md += "**标签**: " + tags.map(function(tag) {
        return "`" + tag + "`"
      }).join(" ") + "\n\n"
    }
    
    // 子笔记
    var childNotes = note.childNotes
    if (childNotes && childNotes.length > 0) {
      md += "### 子笔记\n\n"
      childNotes.forEach(function(child) {
        md += this.exportNote(child).replace(/^#/gm, "##")
      }, this)
    }
    
    return md
  }
  
  this.exportNotebook = function() {
    var notebook = MNUtil.currentNotebook
    if (!notebook) {
      MNUtil.showHUD("请先打开一个笔记本")
      return
    }
    
    var notes = notebook.notes
    var markdown = "# " + notebook.title + "\n\n"
    
    // 只导出顶层笔记（子笔记会递归导出）
    var topLevelNotes = notes.filter(function(note) {
      return !note.parentNote
    })
    
    topLevelNotes.forEach(function(note) {
      markdown += this.exportNote(note)
      markdown += "---\n\n"
    }, this)
    
    // 复制到剪贴板
    UIPasteboard.generalPasteboard().string = markdown
    MNUtil.showHUD("已导出 " + topLevelNotes.length + " 个笔记到剪贴板")
  }
}

// Anki 导出器
function AnkiExporter() {
  this.noteToAnkiCard = function(note) {
    var front = note.noteTitle || note.excerptText.substring(0, 50) + "..."
    var back = ""
    
    // 摘录作为答案
    if (note.excerptText) {
      back += note.excerptText + "\n\n"
    }
    
    // 添加评论
    var comments = note.comments
    if (comments && comments.length > 0) {
      back += comments.map(function(c) {
        return c.text
      }).filter(Boolean).join("\n")
    }
    
    // Anki 格式：用制表符分隔
    return front + "\t" + back
  }
  
  this.exportSelected = function() {
    var focusNotes = MNNote.getFocusNotes()
    if (!focusNotes || focusNotes.length === 0) {
      MNUtil.showHUD("请先选择要导出的笔记")
      return
    }
    
    var ankiData = focusNotes.map(this.noteToAnkiCard).join("\n")
    
    // 保存到文件
    var fileName = "anki_export_" + new Date().getTime() + ".txt"
    var filePath = MNUtil.cachePath + "/" + fileName
    
    // 写入文件
    NSString.stringWithString(ankiData).writeToFileAtomically(filePath, true)
    
    MNUtil.showHUD("已导出 " + focusNotes.length + " 张卡片")
    
    // 可以添加分享功能
    if (MNUtil.isMacOS()) {
      // macOS 上打开文件位置
      NSWorkspace.sharedWorkspace().selectFileInFileViewerRootedAtPath(filePath)
    }
  }
}

// 主插件
JSB.newAddon = function(mainPath) {
  self = this
  
  var markdownExporter = new MarkdownExporter()
  var ankiExporter = new AnkiExporter()
  
  return JSB.defineClass("NoteExporter : JSExtension", {
    // 初始化
    sceneWillConnect: function() {
      self.markdownExporter = markdownExporter
      self.ankiExporter = ankiExporter
    },
    
    // 插件按钮
    queryAddonCommandStatus: function() {
      return {
        image: "export.png",
        object: self,
        selector: "showExportMenu:",
        checked: false
      }
    },
    
    // 导出菜单
    showExportMenu: function(sender) {
      var menu = new Menu(sender, self, 250)
      
      menu.addMenuItem("📝 导出笔记本为 Markdown", "exportMarkdown:")
      menu.addMenuItem("🎴 导出选中笔记为 Anki", "exportAnki:")
      menu.addMenuItem("📊 导出统计信息", "exportStats:")
      
      menu.show()
    },
    
    // 导出功能
    exportMarkdown: function() {
      self.markdownExporter.exportNotebook()
    },
    
    exportAnki: function() {
      self.ankiExporter.exportSelected()
    },
    
    exportStats: function() {
      var notebook = MNUtil.currentNotebook
      if (!notebook) return
      
      var notes = notebook.notes
      var stats = {
        total: notes.length,
        withTitle: notes.filter(function(n) { return n.noteTitle }).length,
        withTags: notes.filter(function(n) { return n.tags && n.tags.length > 0 }).length,
        withComments: notes.filter(function(n) { return n.comments && n.comments.length > 0 }).length,
        byColor: {}
      }
      
      // 按颜色统计
      notes.forEach(function(note) {
        var color = note.colorIndex || 0
        stats.byColor[color] = (stats.byColor[color] || 0) + 1
      })
      
      var report = "📊 笔记本统计\n\n"
      report += "总笔记数: " + stats.total + "\n"
      report += "有标题: " + stats.withTitle + "\n"
      report += "有标签: " + stats.withTags + "\n"
      report += "有评论: " + stats.withComments + "\n\n"
      report += "颜色分布:\n"
      
      Object.keys(stats.byColor).forEach(function(color) {
        report += "颜色 " + color + ": " + stats.byColor[color] + " 个\n"
      })
      
      Application.sharedInstance().alert(report)
    }
  }, {})
}
```

### 开发最佳实践总结

1. **模块化设计**
   - 将功能拆分为独立的类或模块
   - 使用依赖注入提高可测试性
   - 避免全局变量污染

2. **错误处理**
   - 总是检查对象是否存在
   - 使用 try-catch 包装可能出错的操作
   - 提供友好的错误提示

3. **性能优化**
   - 批量操作时添加进度反馈
   - 大量数据处理时使用异步
   - 及时释放不再使用的资源

4. **用户体验**
   - 操作前确认，操作后反馈
   - 支持撤销重做
   - 保存用户配置

5. **代码质量**
   - 使用 TypeScript 获得类型安全
   - 编写单元测试
   - 保持代码简洁可读

## 💻 完整示例代码

本节提供了使用不同框架开发 MarginNote 插件的完整示例。

### OhMyMN TypeScript 示例

这是一个使用 OhMyMN 框架和 TypeScript 开发的现代化插件示例。

#### package.json
```json
{
  "name": "my-ohmymn-plugin",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "marginnote-dev",
    "build": "marginnote-build"
  },
  "devDependencies": {
    "@marginnote/api": "latest",
    "@marginnote/addon": "latest",
    "typescript": "^5.0.0"
  }
}
```

#### src/main.ts
```typescript
import { 
  JSB, 
  MN, 
  NodeNote,
  showHUD, 
  alert,
  popup,
  select,
  undoGroupingWithRefresh,
  eventObserverController,
  i18n
} from "marginnote"

// 国际化支持
const lang = i18n({
  zh: {
    title: "我的插件",
    process_note: "处理笔记",
    add_tag: "添加标签",
    change_color: "修改颜色",
    success: "操作成功",
    select_action: "选择操作"
  },
  en: {
    title: "My Plugin",
    process_note: "Process Note",
    add_tag: "Add Tag", 
    change_color: "Change Color",
    success: "Success",
    select_action: "Select Action"
  }
})

// 事件观察器
const observer = eventObserverController([
  "PopupMenuOnNote",
  "ProcessNewExcerpt"
])

JSB.newAddon = () => {
  return JSB.defineClass("MyOhMyMNPlugin : JSExtension", {
    // 窗口连接时初始化
    sceneWillConnect() {
      MN.log("Plugin connected", MN.studyController.window)
      showHUD(lang.title + " 已加载", 2)
      
      // 添加事件监听
      observer.add()
    },
    
    // 窗口断开时清理
    sceneDidDisconnect() {
      // 移除事件监听
      observer.remove()
    },
    
    // 插件按钮状态
    queryAddonCommandStatus() {
      return {
        image: "logo.png",
        object: this,
        selector: "togglePlugin:",
        checked: false
      }
    },
    
    // 插件按钮点击
    async togglePlugin() {
      const focusNote = MN.focusNote
      if (!focusNote) {
        showHUD("请先选择一个笔记", 2)
        return
      }
      
      // 使用 select 让用户选择操作
      const action = await select(
        [lang.process_note, lang.add_tag, lang.change_color],
        ["process", "tag", "color"]
      )
      
      if (action) {
        await this.performAction(focusNote, action.value)
      }
    },
    
    // 执行操作
    async performAction(note: any, action: string) {
      const nodeNote = new NodeNote(note)
      
      undoGroupingWithRefresh(() => {
        switch (action) {
          case "process":
            this.processNote(nodeNote)
            break
          case "tag":
            this.addTagToNote(nodeNote)
            break
          case "color":
            this.changeNoteColor(nodeNote)
            break
        }
      })
      
      showHUD(lang.success, 2)
    },
    
    // 处理笔记
    processNote(note: NodeNote) {
      // 获取所有文本
      const allText = note.allText
      
      // 自动生成标题（取前20个字）
      if (!note.noteTitle && allText) {
        note.noteTitle = allText.substring(0, 20) + "..."
      }
      
      // 添加处理标记
      note.appendTags(["已处理"])
      
      // 添加时间戳评论
      const timestamp = new Date().toLocaleString()
      note.appendTextComments(`处理时间：${timestamp}`)
    },
    
    // 添加标签
    async addTagToNote(note: NodeNote) {
      const result = await popup({
        title: lang.add_tag,
        type: PopupType.Input,
        message: "请输入标签（用空格分隔多个标签）",
        defaultValue: ""
      })
      
      if (result && result.inputText) {
        const tags = result.inputText.split(" ").filter(t => t.length > 0)
        note.appendTags(tags)
      }
    },
    
    // 修改颜色
    async changeNoteColor(note: NodeNote) {
      const colors = [
        "黄色", "绿色", "蓝色", "红色",
        "橙色", "深绿", "深蓝", "深红"
      ]
      
      const color = await select(colors, [4, 5, 6, 7, 8, 9, 10, 11])
      if (color) {
        note.colorIndex = color.value
      }
    },
    
    // 处理新摘录事件
    onProcessNewExcerpt({ userInfo }: any) {
      const note = userInfo.note
      if (note) {
        const nodeNote = new NodeNote(note)
        
        // 自动处理新摘录
        undoGroupingWithRefresh(() => {
          // 自动添加时间标签
          const dateTag = new Date().toISOString().split('T')[0]
          nodeNote.appendTags([dateTag])
          
          // 如果是长文本，自动生成标题
          if (nodeNote.excerptsText.length > 100) {
            nodeNote.noteTitle = nodeNote.excerptsText.substring(0, 30) + "..."
          }
        })
      }
    },
    
    // 笔记右键菜单
    onPopupMenuOnNote({ userInfo }: any) {
      if (!MN.isModeMindMap) return
      
      const note = userInfo.note
      userInfo.menuController.addMenuItem({
        title: "🎨 " + lang.change_color,
        object: this,
        selector: "menuChangeColor:",
        param: note
      })
    },
    
    // 菜单项动作
    async menuChangeColor(note: any) {
      const nodeNote = new NodeNote(note)
      await this.changeNoteColor(nodeNote)
    }
  }, {
    // 静态方法
    addonDidConnect() {
      MN.log("OhMyMN Plugin installed")
    },
    
    addonWillDisconnect() {
      MN.log("OhMyMN Plugin uninstalled")
    }
  })
}
```

### OhMyMN Lite 插件示例

适合简单功能的轻量级插件开发。

```javascript
import { JSB, MN, showHUD, popup, NodeNote } from "marginnote"

JSB.newAddon = () => {
  return JSB.defineClass("QuickNoteLite : JSExtension", {
    sceneWillConnect() {
      showHUD("QuickNote Lite 已启动", 2)
    },
    
    queryAddonCommandStatus() {
      return {
        image: "logo.png",
        object: this,
        selector: "quickAction:",
        checked: false
      }
    },
    
    async quickAction() {
      const note = MN.focusNote
      if (!note) {
        showHUD("请选择一个笔记", 2)
        return
      }
      
      const result = await popup({
        title: "快速笔记",
        message: "为这个笔记添加备注",
        type: PopupType.Input,
        buttons: ["确定", "取消"]
      })
      
      if (result && result.buttonIndex === 0 && result.inputText) {
        const nodeNote = new NodeNote(note)
        nodeNote.appendTextComments(result.inputText)
        showHUD("备注已添加", 2)
      }
    }
  })
}
```

### HelloWorld 插件示例（传统方式）

这是一个最基础的 MarginNote 插件示例，展示了插件的基本结构和生命周期。

#### mnaddon.json
```json
{
  "addonid": "marginnote.extension.helloworld",
  "author": "Your Name",
  "title": "Hello World",
  "version": "1.0.0",
  "marginnote_version_min": "3.7.11",
  "cert_key": ""
}
```

#### main.js
```javascript
var self = null;

JSB.newAddon = function(mainPath) {
  self = this;
  
  return JSB.defineClass('HelloWorld : JSExtension', {
    // 窗口生命周期
    sceneWillConnect: function() {
      self.window = Application.sharedInstance().focusWindow;
      
      // 显示欢迎信息
      Application.sharedInstance().showHUD(
        "Hello World 插件已加载！", 
        self.window, 
        3
      );
    },
    
    sceneDidDisconnect: function() {
      // 清理资源
      self = null;
    },
    
    // 笔记本生命周期
    notebookWillOpen: function(notebookId) {
      Application.sharedInstance().showHUD(
        "打开笔记本: " + notebookId, 
        self.window, 
        2
      );
    },
    
    // 插件按钮状态
    queryAddonCommandStatus: function() {
      return {
        image: 'logo.png',
        object: self,
        selector: 'togglePlugin:',
        checked: false
      };
    },
    
    // 插件按钮点击
    togglePlugin: function(sender) {
      Application.sharedInstance().alert("Hello from MarginNote!");
    },
    
    // 笔记菜单
    onPopupMenuOnNote: function(sender) {
      if (!Application.sharedInstance().isModeMindMap) {
        return;
      }
      
      const note = sender.userInfo.note;
      
      // 添加菜单项
      sender.userInfo.menuController.addMenuItem({
        title: "👋 Say Hello",
        object: self,
        selector: 'sayHello:',
        param: note
      });
    },
    
    // 菜单动作
    sayHello: function(note) {
      Application.sharedInstance().showHUD(
        "Hello! 当前笔记: " + note.noteTitle, 
        self.window, 
        3
      );
    }
  }, {
    // 静态方法
    addonDidConnect: function() {
      console.log("HelloWorld addon connected");
    },
    
    addonWillDisconnect: function() {
      console.log("HelloWorld addon disconnected");
    }
  });
};
```

### AutoTitle 插件示例

这是一个实用的插件示例，展示了如何自动为笔记生成标题。

#### main.js (核心功能)
```javascript
var self = null;

JSB.newAddon = function(mainPath) {
  self = this;
  
  return JSB.defineClass('AutoTitle : JSExtension', {
    // 初始化
    sceneWillConnect: function() {
      self.window = Application.sharedInstance().focusWindow;
      self.studyController = Application.sharedInstance().studyController(self.window);
      
      // 注册事件
      NSNotificationCenter.defaultCenter().addObserver(
        self,
        'onProcessNewExcerpt:',
        'ProcessNewExcerpt',
        null
      );
      
      Application.sharedInstance().showHUD(
        "AutoTitle 已启动", 
        self.window, 
        2
      );
    },
    
    // 清理
    sceneDidDisconnect: function() {
      NSNotificationCenter.defaultCenter().removeObserver(self);
    },
    
    // 处理新摘录
    onProcessNewExcerpt: function(sender) {
      const excerptInfo = sender.userInfo;
      const note = excerptInfo.note;
      
      if (!note || note.noteTitle) {
        return; // 已有标题，跳过
      }
      
      // 自动生成标题
      const title = this.generateTitle(note.excerptText);
      
      // 使用撤销组
      UndoManager.sharedInstance().undoGrouping(
        "自动生成标题",
        self.studyController.notebookController.notebookId,
        function() {
          note.noteTitle = title;
        }
      );
      
      Application.sharedInstance().showHUD(
        "✅ 已生成标题: " + title, 
        self.window, 
        2
      );
    },
    
    // 生成标题逻辑
    generateTitle: function(text) {
      if (!text) return "无标题";
      
      // 清理文本
      text = text.trim();
      
      // 提取第一句话
      const sentences = text.match(/[^。！？.!?]+[。！？.!?]/g);
      if (sentences && sentences.length > 0) {
        let firstSentence = sentences[0].trim();
        
        // 限制长度
        if (firstSentence.length > 30) {
          firstSentence = firstSentence.substring(0, 27) + "...";
        }
        
        return firstSentence;
      }
      
      // 如果没有句子，取前30个字符
      if (text.length > 30) {
        return text.substring(0, 27) + "...";
      }
      
      return text;
    },
    
    // 插件按钮
    queryAddonCommandStatus: function() {
      return {
        image: 'logo.png',
        object: self,
        selector: 'toggleAutoTitle:',
        checked: self.autoTitleEnabled || false
      };
    },
    
    // 切换自动标题功能
    toggleAutoTitle: function(sender) {
      self.autoTitleEnabled = !self.autoTitleEnabled;
      
      const status = self.autoTitleEnabled ? "启用" : "禁用";
      Application.sharedInstance().showHUD(
        "自动标题已" + status, 
        self.window, 
        2
      );
      
      // 刷新插件按钮状态
      Application.sharedInstance().refreshAddonCommands();
    },
    
    // 手动处理选中的笔记
    onPopupMenuOnNote: function(sender) {
      const note = sender.userInfo.note;
      
      sender.userInfo.menuController.addMenuItem({
        title: "🤖 生成标题",
        object: self,
        selector: 'generateTitleForNote:',
        param: note
      });
    },
    
    generateTitleForNote: function(note) {
      if (!note) return;
      
      const oldTitle = note.noteTitle;
      const newTitle = this.generateTitle(note.excerptText);
      
      UndoManager.sharedInstance().undoGrouping(
        "生成标题",
        self.studyController.notebookController.notebookId,
        function() {
          note.noteTitle = newTitle;
        }
      );
      
      Application.sharedInstance().showHUD(
        "✅ 标题已更新", 
        self.window, 
        2
      );
    }
  }, {
    // 静态方法
    addonDidConnect: function() {},
    addonWillDisconnect: function() {}
  });
};
```

### 开发技巧总结

1. **生命周期管理**
   - 在 `sceneWillConnect` 中初始化
   - 在 `sceneDidDisconnect` 中清理资源
   - 注意保存 self 引用

2. **事件处理**
   - 使用 NSNotificationCenter 监听系统事件
   - 记得在断开时移除监听器
   - 使用 UndoManager 支持撤销

3. **用户交互**
   - 使用 showHUD 显示临时提示
   - 使用 alert 显示重要信息
   - 添加菜单项增强功能

4. **错误处理**
   - 检查对象是否存在
   - 使用 try-catch 捕获异常
   - 提供友好的错误提示

## 🔒 安全与隐私

### 1. 数据安全
- **不收集用户隐私数据**
- **所有数据本地存储**
- **敏感操作需用户确认**
- **提供数据导出功能**

### 2. 权限控制
```javascript
// 操作前检查权限
function checkPermission(action) {
  // 检查笔记本是否只读
  if (MNUtil.currentNotebook.readOnly) {
    MNUtil.showHUD("笔记本为只读状态");
    return false;
  }
  
  // 检查是否有修改权限
  if (!self.hasModifyPermission) {
    MNUtil.showHUD("没有修改权限");
    return false;
  }
  
  return true;
}
```

### 3. 错误隔离
```javascript
// 模块错误隔离
function isolatedExecute(moduleFunc) {
  try {
    return moduleFunc();
  } catch (error) {
    // 模块错误不影响主程序
    console.error('Module error:', error);
    return null;
  }
}
```

## 📊 测试策略

### 1. 单元测试
```javascript
// 简单的测试框架
class TestRunner {
  constructor() {
    this.tests = [];
    this.results = [];
  }
  
  test(name, fn) {
    this.tests.push({ name, fn });
  }
  
  async run() {
    for (const test of this.tests) {
      try {
        await test.fn();
        this.results.push({ name: test.name, passed: true });
      } catch (error) {
        this.results.push({ 
          name: test.name, 
          passed: false, 
          error: error.message 
        });
      }
    }
    
    this.report();
  }
  
  report() {
    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.filter(r => !r.passed).length;
    
    console.log(`Tests: ${passed} passed, ${failed} failed`);
    
    this.results.filter(r => !r.passed).forEach(r => {
      console.error(`❌ ${r.name}: ${r.error}`);
    });
  }
}
```

### 2. 集成测试
- 测试插件生命周期
- 测试事件响应
- 测试数据持久化
- 测试跨平台兼容性

### 3. 性能测试
```javascript
// 性能监控
class PerformanceMonitor {
  static measure(name, fn) {
    const start = Date.now();
    const result = fn();
    const duration = Date.now() - start;
    
    if (duration > 100) {
      console.warn(`Slow operation '${name}': ${duration}ms`);
    }
    
    return result;
  }
  
  static async measureAsync(name, fn) {
    const start = Date.now();
    const result = await fn();
    const duration = Date.now() - start;
    
    if (duration > 1000) {
      console.warn(`Slow async operation '${name}': ${duration}ms`);
    }
    
    return result;
  }
}
```

## 🎯 发布与维护

### 1. 版本管理
- 使用语义化版本号 (SemVer)
- 维护详细的更新日志
- 标记破坏性更改

### 2. 用户支持
- 提供详细的使用文档
- 创建 FAQ 页面
- 建立反馈渠道

### 3. 持续改进
- 收集用户反馈
- 监控错误报告
- 定期更新优化

## 📚 参考资源

### 官方资源
- [MarginNote 官方网站](https://www.marginnote.com/)
- [MarginNote 插件开发文档](https://docs-addon.marginnote.cn/)
- [MarginNote 开发指南](https://docs-addon.marginnote.cn/guide)
- [MarginNote 高级开发](https://docs-addon.marginnote.cn/advanced/)
- [MarginNote API 仓库](https://github.com/MarginNote/Addon)
- [MarginNote 论坛](https://bbs.marginnote.cn/)
- [MarginNote 插件社区](https://bbs.marginnote.cn/c/script/Mod/55)

### 社区资源
- [OhMyMN 项目](https://github.com/ourongxing/ohmymn) - 功能最全面的插件框架
- [Awesome MarginNote](https://github.com/topics/marginnote) - 优秀插件集合
- [MarginNote API 更新仓库](https://github.com/marginnoteapp/marginnote-api) - 最新 API 参考
- 插件开发交流群
- [MN-Addon 项目](https://github.com/xkdaq/MN-Addon) - 本项目仓库

### 学习资源
- [JavaScript 基础教程](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)
- [Objective-C 入门指南](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Introduction/Introduction.html)
- [JSBridge 原理解析](https://github.com/marcuswestin/WebViewJavascriptBridge)
- [Safari WebView 开发](https://developer.apple.com/documentation/webkit)
- [JSBox 文档](https://docs.xteko.com/) - 了解 JSB 框架基础

### 开源插件示例
- **[OhMyMN](https://github.com/ourongxing/ohmymn)**: 功能最全面的插件框架，提供丰富的功能模块
- **[MNUtils](https://github.com/xkdaq/MN-Addon/tree/main/mnutils)**: 核心 API 封装库，必备基础设施
- **[MNToolbar](https://github.com/xkdaq/MN-Addon/tree/main/mntoolbar)**: 工具栏增强插件，可定制按钮和菜单
- **[Export to Anki](https://github.com/XHXIAIEIN/Export-to-Anki)**: 导出到 Anki 的插件示例
- **[Enhance MarginNote](https://github.com/JeffChen-png/EnhanceMarginNote)**: 功能增强插件
- 更多插件请在 GitHub 搜索 "marginnote addon" 或 "marginnote plugin"

### 开发工具
- **[mnaddon CLI](https://www.npmjs.com/package/mnaddon)**: 官方打包工具
- **VSCode 插件**: 搜索 "JSBox" 获得语法支持
- **Safari Developer Tools**: 用于调试 WebView

## ❓ FAQ - 常见问题解答

### 基础问题

**Q: MarginNote 3 和 MarginNote 4 的插件兼容吗？**
A: 大部分兼容，但有一些 API 差异。建议在 mnaddon.json 中指定最低版本要求，并在代码中进行版本检测。

**Q: 为什么我的插件在插件栏不显示？**
A: 检查以下几点：
1. 确保实现了 `queryAddonCommandStatus` 方法
2. 检查 logo.png 是否存在且为 44x44 像素
3. 确认 JSB.defineClass 包含了静态方法参数
4. 查看控制台是否有错误信息

**Q: 插件开发必须要 Mac 吗？**
A: 是的，调试和测试需要 Mac 版本的 MarginNote。iOS 版本无法使用 Safari 进行调试。

### 开发问题

**Q: 为什么插件加载后立即闪退？**
A: 常见原因：
1. 在 JSB.newAddon 内部调用了 JSB.require
2. 使用了不兼容的 ES6 语法
3. 初始化时访问了未定义的对象
4. 没有正确保存 self 引用

**Q: 如何调试插件代码？**
A: 由于安全限制，不能使用断点调试。推荐方法：
```javascript
// 使用 showHUD 显示调试信息
Application.sharedInstance().showHUD("Debug: " + value, self.window, 2);

// 使用 alert 暂停执行
Application.sharedInstance().alert("断点：" + JSON.stringify(data));

// 使用 MNUtil.log（如果安装了 MNUtils）
MNUtil.log("调试信息", data);
```

**Q: 为什么修改笔记后不能撤销？**
A: 需要使用 UndoManager 包装修改操作：
```javascript
UndoManager.sharedInstance().undoGrouping(
  "操作名称",
  notebookId,
  function() {
    // 你的修改代码
    note.noteTitle = "新标题";
  }
);
```

### API 问题

**Q: 如何获取当前选中的笔记？**
A: 有多种方式：
```javascript
// 使用 MNUtils（推荐）
const note = MNNote.getFocusNote();

// 原生 API
const mindmapView = self.studyController.notebookController.mindmapView;
const focusNote = mindmapView.focusNote;
```

**Q: 如何批量处理笔记？**
A: 使用 undoGrouping 包装批量操作：
```javascript
MNUtil.undoGrouping(() => {
  notebook.notes.forEach(note => {
    // 处理每个笔记
    note.colorIndex = 2;
  });
});
```

**Q: 如何监听系统事件？**
A: 使用 NSNotificationCenter：
```javascript
// 注册监听
NSNotificationCenter.defaultCenter().addObserver(
  self,
  'onEventHandler:',
  'EventName',
  null
);

// 处理事件
onEventHandler: function(sender) {
  const info = sender.userInfo;
  // 处理事件
}

// 记得在 sceneDidDisconnect 中移除
NSNotificationCenter.defaultCenter().removeObserver(self);
```

### 性能问题

**Q: 插件运行很慢怎么办？**
A: 优化建议：
1. 避免在循环中进行数据库操作
2. 使用批量更新而不是逐个更新
3. 缓存常用数据
4. 使用防抖/节流处理频繁触发的事件
5. 及时释放大对象和清理定时器

**Q: 处理大量笔记时卡顿？**
A: 使用异步处理和进度提示：
```javascript
async function processLargeNotes(notes) {
  const batchSize = 50;
  for (let i = 0; i < notes.length; i += batchSize) {
    const batch = notes.slice(i, i + batchSize);
    
    // 显示进度
    Application.sharedInstance().showHUD(
      `处理中... ${i}/${notes.length}`, 
      self.window, 
      0.5
    );
    
    // 处理批次
    await processBatch(batch);
    
    // 让出执行权
    await new Promise(resolve => setTimeout(resolve, 10));
  }
}
```

### 发布问题

**Q: 如何获得官方认证？**
A: 联系 MarginNote 官方团队，提供：
1. 插件功能说明
2. 源代码审核
3. 测试报告
4. 用户文档

**Q: 插件更新如何通知用户？**
A: 官方认证插件可以自动推送更新。非认证插件需要：
1. 在插件内实现版本检查
2. 提供更新提示和下载链接
3. 引导用户手动更新

## 📤 插件商店发布流程

### 1. 准备阶段

#### 必需材料
- ✅ 完整的插件代码
- ✅ 44x44 的 logo.png
- ✅ 详细的功能说明文档
- ✅ 使用演示视频或截图
- ✅ 版本更新日志

#### 代码要求
1. **稳定性**：充分测试，无明显 bug
2. **兼容性**：支持 MN3 和 MN4
3. **性能**：不影响应用性能
4. **安全性**：不收集用户数据

### 2. 打包插件

```bash
# 1. 确保文件结构正确
your-plugin/
├── mnaddon.json
├── main.js
├── logo.png
└── [其他资源文件]

# 2. 使用 mnaddon 工具打包
mnaddon pack .

# 3. 生成 your-plugin.mnaddon 文件
```

### 3. 提交流程

#### 方式一：论坛发布（推荐新手）
1. 访问 [MarginNote 论坛](https://bbs.marginnote.cn/c/script/Mod/55)
2. 创建新主题，包含：
   - 插件名称和版本
   - 功能介绍
   - 使用说明
   - 下载链接
   - 源码链接（如果开源）

#### 方式二：官方商店
1. 联系官方：developer@marginnote.com
2. 提供材料：
   - 插件文件
   - 功能文档
   - 测试报告
   - 开发者信息
3. 等待审核（通常 3-7 天）
4. 审核通过后上架

### 4. 更新维护

#### 版本更新
```json
// mnaddon.json
{
  "version": "1.1.0",  // 递增版本号
  "marginnote_version_min": "3.7.11",
  "update_url": "https://yoursite.com/check-update"
}
```

#### 更新通知
```javascript
// 实现版本检查
async function checkUpdate() {
  try {
    const response = await fetch(updateUrl);
    const latestVersion = await response.json();
    
    if (compareVersion(latestVersion.version, currentVersion) > 0) {
      Application.sharedInstance().alert(
        `新版本 ${latestVersion.version} 可用！\n` +
        `更新内容：${latestVersion.changelog}`
      );
    }
  } catch (error) {
    // 静默失败
  }
}
```

### 5. 用户支持

#### 建立反馈渠道
1. **GitHub Issues**：开源项目首选
2. **论坛帖子**：集中回复用户问题
3. **邮件支持**：提供开发者邮箱
4. **使用文档**：详细的 README

#### 处理用户反馈
- 及时响应用户问题
- 收集功能建议
- 修复报告的 bug
- 定期发布更新

### 6. 推广建议

1. **制作演示视频**
   - 展示核心功能
   - 实际使用场景
   - 安装使用教程

2. **撰写使用教程**
   - 图文并茂
   - 常见问题解答
   - 使用技巧分享

3. **社区互动**
   - 参与论坛讨论
   - 分享开发经验
   - 帮助其他开发者

---

> 💡 **提示**：本文档持续更新中。如有疑问或建议，欢迎提交 Issue 或 PR。祝你开发出优秀的 MarginNote 插件！