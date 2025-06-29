# MarginNote4 插件开发总纲

> 本文档是 MN-Addon 项目的核心开发指南，涵盖 MarginNote4 的核心概念、技术架构、开发规范和最佳实践，为所有 MarginNote 插件开发者提供全面的技术参考。

## 🌟 MNUtils - 核心 API 项目

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

1. [🌟 MNUtils - 核心 API 项目](#🌟-mnutils---核心-api-项目)
2. [📚 MarginNote4 基础架构](#📚-marginnote4-基础架构)
3. [🛠️ 技术架构与限制](#🛠️-技术架构与限制)
4. [⚠️ 开发陷阱与解决方案](#⚠️-开发陷阱与解决方案)
5. [🔧 插件开发要点](#🔧-插件开发要点)
6. [🔄 插件生命周期详解](#🔄-插件生命周期详解)
7. [📡 事件系统完整指南](#📡-事件系统完整指南)
8. [📝 最佳实践](#📝-最佳实践)
9. [🚀 常见插件类型](#🚀-常见插件类型)
10. [💡 开发规范与标准](#💡-开发规范与标准)
11. [🚀 开发流程指南](#🚀-开发流程指南)
12. [🔒 安全与隐私](#🔒-安全与隐私)
13. [📊 测试策略](#📊-测试策略)
14. [🎯 发布与维护](#🎯-发布与维护)
15. [📚 参考资源](#📚-参考资源)

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

### 1. 环境准备

#### 必需工具
- **Mac 电脑**：开发和调试必需
- **MarginNote 4**：Mac 版本用于测试
- **代码编辑器**：推荐 VSCode
- **打包工具**：mnaddon CLI 工具

#### 推荐配置
```bash
# 安装 Node.js (v18+)
brew install node

# 安装 pnpm
npm install -g pnpm

# 安装 mnaddon 工具
npm install -g mnaddon

# 创建插件项目
mkdir my-plugin
cd my-plugin
npm init -y
```

### 2. 开发流程

#### Step 1: 创建基础文件
```bash
# 创建必需文件
touch main.js
touch mnaddon.json
# 添加 44x44 的 logo.png
```

#### Step 2: 编写插件代码
```javascript
// main.js 基础模板
var self;

JSB.newAddon = function(mainPath) {
  var MyPlugin = JSB.defineClass("MyPlugin : JSExtension", {
    // 实例方法
    sceneWillConnect: function() {
      self = this;
      self.path = mainPath;
      // 初始化代码
    }
  }, {
    // 静态方法
    addonDidConnect: function() {}
  });
  
  return MyPlugin;
};
```

#### Step 3: 测试调试
```bash
# 打包插件
mnaddon pack .

# 复制到 MarginNote 插件目录
cp my-plugin.mnaddon ~/Library/Containers/QReader.MarginNoteMac/Data/Library/MarginNote\ 4/Extensions/

# 重启 MarginNote 进行测试
```

#### Step 4: 发布准备
1. 完善文档
2. 添加更新日志
3. 创建演示视频
4. 申请官方认证（可选）

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
- [MarginNote 论坛](https://bbs.marginnote.cn/)
- 官方 API 文档（联系官方获取）

### 社区资源
- [OhMyMN 项目](https://github.com/ourongxing/ohmymn)
- [Awesome MarginNote](https://github.com/topics/marginnote)
- 插件开发交流群

### 学习资源
- JavaScript 基础教程
- Objective-C 入门指南
- JSBridge 原理解析
- Safari WebView 开发

### 开源插件示例
- **OhMyMN**: 功能最全面的插件框架
- **MNUtils**: 核心 API 封装库
- **MNToolbar**: 工具栏增强插件
- 更多开源插件...