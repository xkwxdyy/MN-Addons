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

## 🚨 开发踩坑记录与经验教训

### MNTask 插件开发总结 (2025-06-28)

在开发 MNTask 任务管理插件的过程中，我们遇到了多个严重问题。这些经验教训对未来的 MarginNote 插件开发极具参考价值。

### 1. MarginNote 完全卡死问题 ⚠️⚠️⚠️

**问题表现**：
- 安装插件后 MarginNote 4 完全无响应
- 重启应用也无法恢复，必须删除插件文件

**原因分析**：
1. `JSB.newAddon` 函数参数缺失
   ```javascript
   // ❌ 错误
   JSB.newAddon = function() {
   
   // ✅ 正确
   JSB.newAddon = function(mainPath) {
   ```

2. 错误的类实例化方式
   ```javascript
   // ❌ 错误 - 导致卡死
   const controller = new TaskController();
   
   // ✅ 正确 - JSB 框架要求的方式
   const controller = TaskController.new();
   ```

3. 模块加载循环依赖
   ```javascript
   // ❌ 错误 - 在文件开头立即加载
   JSB.require('taskModel');
   JSB.require('taskController');
   
   // ✅ 正确 - 延迟加载
   loadDependencies: function() {
     try {
       JSB.require('taskModel');
     } catch (error) {
       // 处理错误
     }
   }
   ```

**解决方案**：
- 始终接收并保存 `mainPath` 参数
- 使用 JSB 框架的 `.new()` 方法创建对象
- 延迟加载依赖模块，避免初始化时的循环引用

### 2. 插件不在插件栏显示 📱

**问题表现**：
- 插件安装成功但插件栏看不到图标
- 无法通过点击图标启动插件

**原因分析**：
1. 缺少必需的 `queryAddonCommandStatus` 方法
2. 缺少静态方法对象（第二个参数）
3. 图标尺寸不正确

**解决方案**：
```javascript
// 必须实现此方法才能在插件栏显示
queryAddonCommandStatus: function() {
  return {
    image: 'logo.png',        // 插件图标
    object: self,             // 回调对象
    selector: 'toggleAddon:', // 点击时调用的方法  
    checked: false            // 是否选中状态
  };
}

// JSB.defineClass 需要两个参数
JSB.defineClass("PluginName : JSExtension", 
  { /* 实例方法 */ },
  { /* 静态方法 */ 
    addonDidConnect: function() {},
    addonWillDisconnect: function() {}
  }
);
```

**图标要求**：
- 尺寸：44x44 像素（不是 200x200）
- 格式：PNG
- 路径：插件根目录

### 3. toggleAddon 方法无响应 🖱️

**问题表现**：
- 点击插件栏图标没有任何反应
- 没有错误提示，但功能不执行

**原因分析**：
- JavaScript 作用域问题
- `self` 变量未正确定义或赋值
- 方法调用时 `this` 指向不正确

**解决方案**：
```javascript
// 在文件顶部定义全局 self 变量
var self = null;

// 在 sceneWillConnect 中保存实例引用
sceneWillConnect: function() {
  self = this;  // 关键！保存当前实例
  self.path = mainPath;
}

// toggleAddon 中使用 this 或 self
toggleAddon: function(sender) {
  // 优先使用 this
  if (this.showTaskManager) {
    this.showTaskManager();
  } else if (self && self.showTaskManager) {
    // 备用方案使用 self
    self.showTaskManager();
  }
}
```

### 4. UI 组件兼容性问题 🎨

**问题**：
- `UIAlertView` 在某些情况下不可用
- `WKWebView` 初始化复杂

**解决方案**：
```javascript
// 使用 MNUtil 提供的跨平台方法
MNUtil.input("标题", "提示", ["默认值"]).then(function(inputs) {
  // 处理输入
});

// 使用 UIWebView 替代 WKWebView
const webView = UIWebView.new();
```

### 5. MNUtils 依赖问题 🔧

**问题**：
- MNUtils 未安装时插件崩溃
- MNUtil 未定义错误

**解决方案**：
```javascript
// 始终检查 MNUtil 是否存在
if (typeof MNUtil !== "undefined") {
  MNUtil.showHUD("消息");
}

// 在插件开始时尝试加载
try {
  JSB.require('mnutils');
} catch (e) {
  // MNUtils 可能未安装，优雅降级
}
```

### 6. 调试技巧总结 🐛

1. **使用 HUD 进行调试**
   ```javascript
   MNUtil.showHUD("🔍 调试: " + variable);
   ```

2. **分步测试**
   - 先创建最简单的测试版本
   - 逐步添加功能，每步都测试

3. **错误处理**
   ```javascript
   try {
     // 危险操作
   } catch (error) {
     if (typeof MNUtil !== "undefined") {
       MNUtil.showHUD("❌ " + error.message);
     }
   }
   ```

4. **查看其他插件源码**
   - mntoolbar 和 mnutils 是很好的参考
   - 注意它们的初始化模式和结构

### 7. 最佳实践建议 ✅

1. **插件结构**
   - main.js 保持简洁，只做初始化
   - 功能模块化，使用单独的文件
   - 避免在全局作用域执行代码

2. **初始化流程**
   ```javascript
   1. 接收 mainPath 参数
   2. 定义类和方法
   3. 在 sceneWillConnect 中初始化
   4. 延迟加载其他模块
   ```

3. **错误处理**
   - 每个关键操作都要 try-catch
   - 提供用户友好的错误提示
   - 记录错误日志

4. **版本兼容**
   - 检查 MarginNote 版本
   - 检查 MNUtils 是否可用
   - 提供降级方案

### 8. 常见错误速查表 📋

| 错误现象 | 可能原因 | 解决方案 |
|---------|---------|---------|
| MN 完全卡死 | JSB.newAddon 参数错误 | 添加 mainPath 参数 |
| 插件不显示 | 缺少 queryAddonCommandStatus | 实现该方法 |
| 点击无反应 | self 未定义 | 在 sceneWillConnect 中设置 self = this |
| undefined is not a function | 错误的实例化方式 | 使用 .new() 而非 new |
| MNUtil is undefined | MNUtils 未安装 | 添加存在性检查 |

### 9. MarginNote 闪退问题（致命）🚨🚨🚨

**问题表现**（2025-06-28 最新发现）：
- 安装插件后 MarginNote 4 直接闪退（应用崩溃）
- 重启 MarginNote 仍然闪退，必须删除插件文件才能恢复

**根本原因 - 模块加载时机错误**：

这是导致闪退的最关键因素！MarginNote 的 JSB 环境对模块加载时机极其敏感。

```javascript
// ❌❌❌ 错误 - 在 JSB.newAddon 内部加载模块会导致闪退！
JSB.newAddon = function(mainPath) {
  JSB.require('taskModel');     // 💥 导致闪退！
  JSB.require('taskController'); // 💥 导致闪退！
  
  var Plugin = JSB.defineClass(...);
  return Plugin;
};

// ✅✅✅ 正确 - 必须在文件末尾加载模块
JSB.newAddon = function(mainPath) {
  // 只定义类，不加载任何模块
  var Plugin = JSB.defineClass(...);
  return Plugin;
};

// 在文件末尾加载所有依赖
JSB.require('mnutils');
JSB.require('taskModel');
JSB.require('taskController');
```

**其他相关因素**：

1. **ES6 语法兼容性**
   ```javascript
   // ⚠️ 在插件初始化阶段可能有问题
   class TaskModel {
     constructor() { }
   }
   
   // ✅ 更安全的传统写法
   function TaskModel() { }
   TaskModel.prototype.method = function() { }
   ```

2. **父类调用问题**
   ```javascript
   // ❌ 可能导致问题
   init: function() {
     self.super.init();
   }
   
   // ✅ 直接初始化
   init: function() {
     // 不调用父类
   }
   ```

**解决步骤**：
1. 将所有 `JSB.require()` 移到文件末尾
2. 将 ES6 class 改为传统函数式写法
3. 移除不必要的父类调用
4. 确保 JSB.newAddon 只返回类定义，不执行任何加载操作

**调试方法**：
- 使用 macOS Console.app 查看崩溃日志
- 搜索 "marginnote" 相关的崩溃报告
- 查看具体的错误堆栈

**关键教训**：
- **永远不要在 JSB.newAddon 函数内部加载模块**
- 参考成功运行的插件（如 MNToolbar）的结构
- JSB 环境在不同阶段对 JavaScript 特性的支持程度不同

### 10. 开发检查清单 ✔️

开发新插件时，请确保：
- [ ] **模块加载在文件末尾**（最重要！）
- [ ] JSB.newAddon 接收 mainPath 参数
- [ ] JSB.newAddon 内部不加载任何模块
- [ ] 实现 queryAddonCommandStatus 方法
- [ ] JSB.defineClass 包含静态方法对象
- [ ] 在 sceneWillConnect 中设置 self = this
- [ ] 所有 MNUtil 调用都有存在性检查
- [ ] 使用 .new() 创建 JSB 对象
- [ ] logo.png 是 44x44 像素
- [ ] 避免在插件初始化阶段使用 ES6 class
- [ ] 错误处理和用户提示完善

## 📄 许可证

本项目采用 MIT 许可证。详见各子项目的许可文件。

---

> 💡 **提示**：开发前请先仔细阅读对应子项目的 CLAUDE.md 文件，它们包含了更详细的技术实现和规范要求。