# ✅ MN Toolbar Pro 开发与协作规范

> 本规范适用于 MN Toolbar Pro 项目的全部开发任务，条款为强制性，除非用户显式豁免。
> 如果你已经了解所有的规范，你需要在用户第一次进行对话时先说明 "我已充分了解开发与写作规范。"，随后再执行用户需求。

## 目录

1. [项目概述](#1-项目概述)
2. [开发原则](#2-开发原则)
3. [项目架构](#3-项目架构)
4. [代码规范](#4-代码规范)
5. [JSB 框架规范](#5-jsb-框架规范)
6. [技术实践](#6-技术实践)
7. [扩展开发](#7-扩展开发)
8. [调试与故障排除](#8-调试与故障排除)
9. [API 快速参考](#9-api-快速参考)

---

## 1. 项目概述

### 1.1 目录结构说明（2025.6.27）

- **mntoolbar**：用户的开发项目目录，基于官方版本开发
- **mntoolbar_official**：官方插件目录，仅用于参考对比和开发，不应修改

### 1.2 核心文件职责

| 文件名 | 职责 | 重要性 |
|--------|------|--------|
| `main.js` | 插件入口和生命周期管理 | ⭐⭐⭐⭐⭐ |
| `webviewController.js` | 工具栏 UI 管理和交互 | ⭐⭐⭐⭐⭐ |
| `settingController.js` | 设置界面管理 | ⭐⭐⭐⭐ |
| `utils.js` | 通用工具函数和配置管理 | ⭐⭐⭐⭐⭐ |
| `xdyy_utils_extensions.js` | 工具函数扩展 | ⭐⭐⭐ |
| `xdyy_custom_actions_registry.js` | 自定义动作注册表 | ⭐⭐⭐⭐ |

### 1.3 命名空间约定

- 工具函数：`MNUtil.` 前缀
- 配置相关：`toolbarConfig.`
- 框架操作：`Frame.`
- 自定义全局：`global.`

---

## 2. 开发原则

### 2.1 基本原则

1. **深度理解**：每次输出前必须深度理解项目背景、用户意图和技术栈特征
2. **权威参考**：当信息不确定时，先查询权威资料（官方文档、标准或源码）
3. **精确回答**：仅回答与问题直接相关内容，避免冗余和教程式铺陈
4. **任务分解**：面对复杂需求，拆分为可管理的子任务

### 2.2 ⚠️ 严禁擅自修改用户内容（极其重要）

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

### 2.3 源码阅读规范

1. **完整阅读原则**：
   - 【极其重要】必须完整阅读整个文件，避免断章取义
   - 理解上下文依赖和完整的业务逻辑
   - 注意文件间的引用关系

2. **大文件处理**：
   - 超过 500 行的文件应分段阅读
   - 每段控制在 100-200 行
   - 记录段间的关联关系

3. **阅读顺序**：
   ```
   main.js → utils.js → webviewController.js → 其他模块
   ```

---

## 3. 项目架构

### 3.1 生命周期流程

```javascript
// 插件启动流程
sceneWillConnect()
  ↓
notebookWillOpen()
  ↓
创建工具栏窗口
  ↓
初始化配置和状态
  ↓
注册观察者和手势

// 插件关闭流程
notebookWillClose()
  ↓
保存状态
  ↓
清理资源
  ↓
sceneDidDisconnect()
```

### 3.2 单例模式

```javascript
// ✅ 正确的单例获取方式
const getFooController = ()=>self
var FooController = JSB.defineClass('FooController : UIViewController', {
  viewDidLoad: function() {
    let self = getFooController()
    // 使用 self 而不是 this
  }
})
```

---

## 4. 代码规范

### 4.1 命名规范

1. **变量命名**：
   - ✅ 正确：`const error = new Error()`, `const event`
   - ❌ 错误：`const e`, `const err`, `const data`

2. **重复命名**：
   - ✅ 正确：`let cache; let redisCache;`
   - ❌ 错误：`let cache; let cache2;`

### 4.2 代码风格

1. **箭头函数**：
   ```javascript
   // ✅ 简洁写法
   () => "something"
   list.forEach(console.log)
   
   // ❌ 冗余写法
   () => { return "something"; }
   (x) => { doSomething(x); }
   ```

2. **数组操作**：
   - 优先使用 `.filter()`, `.map()`, `.reduce()`
   - 避免传统 for 循环

### 4.3 缩进规范（2025.6.27 新增）

1. **自动格式化工具**：
   ```bash
   # 使用 Prettier 格式化（推荐）
   npx prettier --write filename.js --tab-width 2 --single-quote false
   
   # 格式化整个项目
   npx prettier --write "**/*.js" --tab-width 2
   ```

2. **缩进标准**：
   - 统一使用 2 个空格缩进
   - 不使用 Tab 字符
   - 保持括号对齐

3. **常见问题修复**：
   - 大文件缩进混乱：使用 Prettier 而非手动修复
   - try-catch 缩进错误：确保 catch 与 try 对齐
   - 回调函数缩进：保持层级清晰

4. **配置文件**（.prettierrc）：
   ```json
   {
     "tabWidth": 2,
     "useTabs": false,
     "semi": true,
     "singleQuote": false,
     "printWidth": 120,
     "bracketSpacing": true
   }
   ```

### 4.4 注释规范

1. **JSDoc 格式**：
   ```javascript
   /**
    * 处理工具栏动作
    * @param {Object} button - 按钮对象
    * @param {Object} des - 动作描述
    * @returns {Promise<void>}
    * @throws {Error} 当动作未定义时抛出错误
    */
   ```

2. **注释语言**：
   - 代码注释使用英文
   - 用户交流使用中文

---

## 5. JSB 框架规范

### 5.1 文件加载规范

1. **加载时机**：
   ```javascript
   // ❌ 错误：在文件开头加载
   JSB.require('extension')
   var MyClass = JSB.defineClass(...)
   
   // ✅ 正确：在文件末尾加载
   var MyClass = JSB.defineClass(...)
   JSB.require('extension')
   ```

2. **路径规范**：
   ```javascript
   // ✅ 正确
   JSB.require('xdyy_utils_extensions')
   // ❌ 错误
   JSB.require('xdyy_utils_extensions.js')
   ```

### 5.2 类定义规范

```javascript
var FooController = JSB.defineClass('FooController : UIViewController', {
  // 实例方法
  viewDidLoad: function() {
    let self = getFooController()
    // 初始化逻辑
  },
  
  // 静态方法使用 static
  static someStaticMethod: function() {
    // 静态逻辑
  }
})
```

---

## 6. 技术实践

### 6.1 UI 开发

1. **Frame 操作**：
   ```javascript
   // ✅ 使用工具类
   Frame.set(view, x, y, width, height)
   // ❌ 直接操作
   view.frame = {x: 10, y: 10, width: 100, height: 50}
   ```

2. **手势处理**：
   ```javascript
   self.addPanGesture(self.view, "onMoveGesture:")
   self.addLongPressGesture(button, "onLongPressGesture:")
   ```

### 6.2 内存管理

**必须清理的资源**：
- NSNotificationCenter 观察者
- 定时器（NSTimer）
- 手势识别器引用
- 控制器强引用

```javascript
notebookWillClose: function(notebookid) {
  // 保存状态
  toolbarConfig.windowState.frame = self.view.frame
  // 清理资源
  MNUtil.removeObserver(self.observerId)
}
```

### 6.3 错误处理

```javascript
try {
  // 边界检查
  if (typeof MNUtil === 'undefined') return
  if (!(await toolbarUtils.checkMNUtil(true))) return
  
  // 业务逻辑
} catch (error) {
  toolbarUtils.addErrorLog(error, methodName, info)
  MNUtil.showHUD("操作失败：" + error.message)
}
```

### 6.4 平台兼容

```javascript
self.isMac = MNUtil.version.type === "macOS"
if (self.isMac) {
  // macOS 特定逻辑（鼠标悬停、右键菜单）
} else {
  // iOS 特定逻辑（触摸手势、屏幕旋转）
}
```

---

## 7. 扩展开发

### 7.1 注册表模式（推荐）

**原理**：使用全局注册表管理自定义功能，避免直接修改主文件

1. **注册表文件结构**：
   ```javascript
   // 创建全局注册表
   if (typeof global === 'undefined') {
     var global = {};
   }
   
   // 注册函数
   global.registerCustomAction = function(name, handler) {
     global.customActions[name] = handler;
   };
   
   // 执行函数
   global.executeCustomAction = async function(name, context) {
     if (name in global.customActions) {
       await global.customActions[name](context);
       return true;
     }
     return false;
   };
   ```

2. **主文件集成**（仅需修改 4 行）：
   ```javascript
   default:
     if (typeof global !== 'undefined' && global.executeCustomAction) {
       const context = { button, des, focusNote, focusNotes, self: this };
       const handled = await global.executeCustomAction(des.action, context);
       if (handled) break;
     }
     MNUtil.showHUD("Not supported yet...")
     break;
   ```

3. **添加新功能**：
   ```javascript
   global.registerCustomAction("myFeature", async function(context) {
     const { focusNote, self } = context;
     
     MNUtil.undoGrouping(() => {
       try {
         // 实现功能
         focusNote.noteTitle = "已处理: " + focusNote.noteTitle;
         MNUtil.showHUD("✅ 处理成功");
       } catch (error) {
         MNUtil.showHUD(`❌ 失败: ${error.message}`);
       }
     });
   });
   ```

### 7.2 扩展加载注意事项

1. **加载顺序**：扩展文件必须在主文件之后加载
2. **错误隔离**：扩展错误不应影响主功能
3. **延迟初始化**：使用 setTimeout 确保依赖就绪

### 7.3 注册表解耦实践经验（2025.6.27）

**问题与解决方案总结**：

1. **变量未定义错误**：
   - **问题**：执行自定义 action 时报错 `Can't find variable: focusNotes`
   - **原因**：`customActionByDes` 函数中只声明了 `focusNote`，未声明 `focusNotes`
   - **解决**：在函数开头添加变量声明并获取值
   ```javascript
   let focusNote = undefined
   let focusNotes = []  // 添加这行
   try {
     focusNote = MNNote.getFocusNote()
     focusNotes = MNNote.getFocusNotes()  // 添加这行
   } catch (error) {}
   ```

2. **函数未定义错误**：
   - **问题**：`toolbarUtils.getAbbreviationsOfName is not a function`
   - **原因**：扩展文件 `xdyy_utils_extensions.js` 未被加载
   - **解决**：在 `main.js` 中添加加载语句
   ```javascript
   JSB.require('utils')
   JSB.require('xdyy_utils_extensions')  // 添加这行
   JSB.require('pinyin')
   ```

3. **扩展初始化问题**：
   - **问题**：扩展文件加载了但函数仍未定义
   - **原因**：扩展函数需要主动初始化
   - **解决**：在扩展文件末尾添加自动初始化代码
   ```javascript
   // 立即执行初始化
   try {
     if (typeof toolbarUtils !== 'undefined') {
       initXDYYExtensions();
     }
   } catch (error) {
     // 静默处理
   }
   ```

4. **调试技巧**：
   - 使用渐进式调试，先确认文件加载，再确认对象存在，最后确认功能执行
   - 在关键位置添加日志，快速定位问题
   - 调试完成后及时清理日志代码，保持代码整洁

**最佳实践**：
- 主文件修改最小化：只在必要位置添加钩子
- 依赖检查：使用 `typeof` 检查对象存在性
- 错误处理：使用 try-catch 包裹，避免影响主功能
- 上下文传递：通过 context 对象传递所有必要数据

### 7.4 update.py 配置维护经验（2025.6.27）

**问题背景**：
使用 `update.py` 脚本更新插件后，之前的解耦工作被撤销，需要正确配置脚本以维护解耦架构。

**主要问题与解决方案**：

1. **togglePreprocess 函数处理**：
   - **问题**：update.py 会删除必要的函数或添加重复的函数
   - **解决**：
     - 在 main.js 配置中添加 togglePreprocess 函数定义
     - 在 webviewController.js 使用 `insert_after_once` 类型避免重复
     - 注释掉 utils.js 中的 togglePreprocess 添加配置

2. **重复函数清理**：
   - **问题**：webviewController.js 中出现多个重复的 togglePreprocess 函数
   - **解决**：实现智能清理函数
   ```python
   def clean_duplicate_togglePreprocess(self, file_path):
       # 匹配两种模式：带/不带 "dynamic" 注释
       # 保留最后一个，删除其他的
       # 按位置排序后处理
   ```

3. **insert_after_once 类型支持**：
   - **功能**：避免重复插入相同的代码块
   - **实现**：在 apply_user_modifications 中检查关键代码是否已存在
   ```python
   if mod['type'] == 'insert_after_once':
       # 提取关键代码检查是否已存在
       if 'togglePreprocess: function' in key_content:
           continue  # 跳过插入
   ```

4. **配置示例**：
   ```python
   # 用户自定义文件列表
   self.user_custom_files = {
       'xdyy_utils_extensions.js',
       'xdyy_custom_actions_registry.js', 
       'xdyy_menu_registry.js'  # 新增菜单注册表
   }
   
   # 在 update_directory 中添加清理调用
   if modified_file == 'webviewController.js':
       self.clean_duplicate_togglePreprocess(file_path)
   ```

**关键要点**：
- 理解每个文件需要哪些函数定义
- 使用智能的重复检测和清理逻辑
- 支持条件插入避免重复修改
- 在正确的时机调用清理函数

---

## 8. 调试与故障排除

### 8.1 调试工具

1. **用户可见**：`MNUtil.showHUD("message")`
2. **开发日志**：`MNUtil.log()` （推荐，统一的日志格式）
3. **错误日志**：`toolbarUtils.addErrorLog()`
4. **对象检查**：`MNUtil.copyJSON(object)`

**日志使用规范**：
- **必须使用** `MNUtil.log()` 而不是 `console.log()`
- 日志前需要检查 MNUtil 是否存在：
  ```javascript
  if (typeof MNUtil !== "undefined" && MNUtil.log) {
    MNUtil.log("日志信息");
  }
  ```
- 使用有意义的前缀标识日志类型：
  - `🔧` 初始化/配置
  - `✅` 成功
  - `❌` 错误
  - `🔍` 调试/查找
  - `🚀` 执行动作
  - `📦` 加载模块

### 8.2 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| "Can't find variable" | 加载顺序错误 | 调整 JSB.require 位置 |
| "undefined is not an object" | 未初始化 | 调用 ensureView() |
| "Not supported yet..." | action 未注册 | 检查注册表加载 |
| 缩进混乱 | 手动修改错误 | 使用 Prettier 格式化 |

### 8.3 性能优化

- 大文档测试内存使用
- 使用 `undoGrouping` 批量操作
- 避免频繁 UI 更新
- 异步操作使用 `async/await`

---

## 9. API 快速参考

### 9.1 卡片操作

```javascript
// 获取
const focusNote = MNNote.getFocusNote()
const focusNotes = MNNote.getFocusNotes()

// 属性
focusNote.noteId         // ID
focusNote.noteTitle      // 标题
focusNote.excerptText    // 摘录
focusNote.parentNote     // 父卡片
focusNote.childNotes     // 子卡片数组

// 方法
focusNote.addChild(note)
focusNote.toBeIndependent()
focusNote.focusInMindMap(0.3)
focusNote.refresh()
```

### 9.2 工具方法

```javascript
// UI 反馈
MNUtil.showHUD("消息")

// 撤销分组
MNUtil.undoGrouping(() => { /* 操作 */ })

// 延迟
await MNUtil.delay(0.5)

// 剪贴板
MNUtil.copy("文本")
MNUtil.copyJSON(object)

// 当前环境
MNUtil.currentNotebookId
MNUtil.currentDocmd5
```

### 9.3 配置管理

```javascript
// 读取
let frame = toolbarConfig.getWindowState("frame")

// 保存
toolbarConfig.windowState.frame = newFrame

// 持久化
toolbarConfig.save()
```

---

## 附录：版本历史

- **2025.6.27**：添加 update.py 配置维护经验，解决解耦架构被撤销的问题
- **2025.6.27**：添加注册表解耦实践经验，总结常见问题和解决方案
- **2025.6.27**：添加日志使用规范，统一使用 MNUtil.log 替代 console.log
- **2025.6.27**：添加缩进规范、重构文档结构、完善注册表模式
- **2025.6.27**：添加项目结构说明、JSB 解耦经验
- **2025.6.27**：初始版本，整合开发规范