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
7. [扩展开发快速入门](#7-扩展开发快速入门)
8. [扩展开发高级指南](#8-扩展开发高级指南)
9. [调试与故障排除](#9-调试与故障排除)
10. [API 快速参考](#10-api-快速参考)

---

## 1. 项目概述

### 1.1 目录结构说明

- **mntoolbar**：用户的开发项目目录，基于官方版本开发
- **mntoolbar_official**：官方插件目录，仅用于参考对比，不应修改

### 1.2 核心文件职责

| 文件名 | 职责 | 重要性 |
|--------|------|--------|
| `main.js` | 插件入口和生命周期管理 | ⭐⭐⭐⭐⭐ |
| `webviewController.js` | 工具栏 UI 管理和交互 | ⭐⭐⭐⭐⭐ |
| `settingController.js` | 设置界面管理 | ⭐⭐⭐⭐ |
| `utils.js` | 通用工具函数和配置管理 | ⭐⭐⭐⭐⭐ |

### 1.3 解耦架构文件

| 文件名 | 职责 | 说明 |
|--------|------|------|
| `xdyy_button_registry.js` | 按钮配置注册表 | 定义自定义按钮 |
| `xdyy_menu_registry.js` | 菜单模板注册表 | 定义菜单结构 |
| `xdyy_custom_actions_registry.js` | 动作处理注册表 | 实现功能逻辑 |
| `xdyy_utils_extensions.js` | 工具函数扩展 | 扩展 toolbarUtils 和 toolbarConfig |

### 1.4 命名空间约定

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

### 3.3 解耦架构数据流

```
用户点击按钮
    ↓
webviewController 解析 description
    ↓
获取 action 名称
    ↓
查找 global.customActions[action]
    ↓
执行注册的处理函数
    ↓
传递 context 对象
    ↓
返回执行结果
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

### 4.3 缩进规范

1. **自动格式化工具**：
   ```bash
   # 使用 Prettier 格式化（推荐）
   npx prettier --write filename.js --tab-width 2 --single-quote false
   
   # 格式化整个项目
   npx prettier --write "**/*.js" --tab-width 2
   ```

2. **配置文件**（.prettierrc）：
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

## 7. 扩展开发快速入门

### 7.1 架构概述

MN Toolbar 采用**注册表模式**的解耦架构：

```
主程序（不修改）          扩展模块（自定义）
├── main.js              ├── xdyy_button_registry.js     # 按钮配置
├── utils.js             ├── xdyy_menu_registry.js       # 菜单模板
├── webviewController.js ├── xdyy_custom_actions_registry.js # 动作处理
└── settingController.js └── xdyy_utils_extensions.js    # 工具扩展
```

### 7.2 模块加载顺序

```javascript
// main.js 中的加载顺序（重要！）
JSB.require('utils')                    // 1. 核心工具
JSB.require('xdyy_utils_extensions')    // 2. 扩展工具函数
JSB.require('pinyin')                   // 3. 拼音库
// ... 其他初始化 ...
JSB.require('xdyy_menu_registry')       // 4. 菜单模板
JSB.require('xdyy_button_registry')     // 5. 按钮配置
JSB.require('xdyy_custom_actions_registry') // 6. 动作处理
```

### 7.3 添加第一个按钮（三步走）

#### 步骤 1：注册按钮（xdyy_button_registry.js）

```javascript
// 在 registerAllButtons() 函数中添加
global.registerButton("custom19", {
  name: "我的功能",          // 按钮显示名称
  image: "myfunction",      // 图标文件名（不含.png）
  templateName: "menu_myfunction"  // 关联的菜单模板
});
```

#### 步骤 2：定义菜单（xdyy_menu_registry.js）

```javascript
// 简单按钮（直接执行动作）
global.registerMenuTemplate("menu_myfunction", JSON.stringify({
  action: "myAction"
}));

// 或复杂菜单
global.registerMenuTemplate("menu_myfunction", {
  action: "menu",
  menuItems: [
    {
      action: "myAction1",
      menuTitle: "功能一"
    },
    {
      action: "myAction2", 
      menuTitle: "功能二"
    }
  ]
});
```

#### 步骤 3：实现动作（xdyy_custom_actions_registry.js）

```javascript
global.registerCustomAction("myAction", async function(context) {
  const { button, des, focusNote, focusNotes, self } = context;
  
  // 使用撤销分组
  MNUtil.undoGrouping(() => {
    try {
      // 你的功能实现
      if (focusNote) {
        focusNote.noteTitle = "已处理: " + focusNote.noteTitle;
        MNUtil.showHUD("✅ 处理成功");
      } else {
        MNUtil.showHUD("❌ 请先选择卡片");
      }
    } catch (error) {
      MNUtil.showHUD(`❌ 错误: ${error.message}`);
    }
  });
});
```

### 7.4 主文件集成（仅需一次）

在 `webviewController.js` 的 `customActionByDes` 函数中添加：

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

---

## 8. 扩展开发高级指南

### 8.1 多级菜单

```javascript
global.registerMenuTemplate("menu_advanced", {
  action: "menu",
  menuWidth: 300,  // 菜单宽度
  menuItems: [
    "⬇️ 分组标题",  // 纯文本作为分组
    {
      action: "subAction1",
      menuTitle: "    子功能1"  // 缩进表示层级
    },
    {
      action: "menu",  // 嵌套菜单
      menuTitle: "➡️ 更多选项",
      menuItems: [
        {
          action: "deepAction",
          menuTitle: "深层功能"
        }
      ]
    }
  ]
});
```

### 8.2 交互模式

#### 长按和双击

```javascript
global.registerMenuTemplate("menu_interactive", {
  action: "defaultAction",           // 默认点击动作
  doubleClick: {                    // 双击动作
    action: "doubleClickAction"
  },
  onLongPress: {                    // 长按菜单
    action: "menu",
    menuItems: [
      {
        action: "longPressOption1",
        menuTitle: "长按选项1"
      }
    ]
  }
});
```

#### 用户输入

```javascript
global.registerCustomAction("userInput", async function(context) {
  UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
    "输入新标题",
    "请输入卡片的新标题",
    2,  // 输入框样式
    "取消",
    ["确定"],
    (alert, buttonIndex) => {
      if (buttonIndex === 1) {
        const inputText = alert.textFieldAtIndex(0).text;
        MNUtil.undoGrouping(() => {
          context.focusNote.noteTitle = inputText;
          MNUtil.showHUD("✅ 标题已更新");
        });
      }
    }
  );
});
```

### 8.3 常用模式

#### 批量处理

```javascript
global.registerCustomAction("batchProcess", async function(context) {
  const { button, des, focusNote, focusNotes, self } = context;
  
  MNUtil.undoGrouping(() => {
    let successCount = 0;
    
    focusNotes.forEach(note => {
      try {
        // 处理每个卡片
        note.appendTags(["已处理"]);
        successCount++;
      } catch (error) {
        // 单个失败不影响其他
      }
    });
    
    MNUtil.showHUD(`✅ 成功处理 ${successCount}/${focusNotes.length} 个卡片`);
  });
});
```

#### 异步操作

```javascript
global.registerCustomAction("asyncOperation", async function(context) {
  const { button, des, focusNote, focusNotes, self } = context;
  
  try {
    MNUtil.showHUD("⏳ 处理中...");
    
    // 模拟异步操作
    await MNUtil.delay(0.5);
    
    // 执行操作
    const result = await someAsyncFunction(focusNote);
    
    MNUtil.showHUD(`✅ 完成: ${result}`);
  } catch (error) {
    MNUtil.showHUD(`❌ 失败: ${error.message}`);
  }
});
```

### 8.4 最佳实践

1. **始终使用撤销分组**
   ```javascript
   MNUtil.undoGrouping(() => { /* 你的操作 */ });
   ```

2. **检查对象存在性**
   ```javascript
   if (focusNote && focusNote.noteTitle) {
     // 安全操作
   }
   ```

3. **提供用户反馈**
   - 操作前：`MNUtil.showHUD("⏳ 处理中...")`
   - 成功后：`MNUtil.showHUD("✅ 成功")`
   - 失败时：`MNUtil.showHUD("❌ 失败: " + error.message)`

4. **使用 context 解构**
   ```javascript
   const { button, des, focusNote, focusNotes, self } = context;
   ```

5. **错误处理模式**
   ```javascript
   try {
     // 危险操作
   } catch (error) {
     toolbarUtils.addErrorLog(error, "functionName");
     MNUtil.showHUD("操作失败");
   }
   ```

---

## 9. 调试与故障排除

### 9.1 调试工具

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

### 9.2 测试脚本

```javascript
// test_myfunction.js
function testMyFunction() {
  // 模拟点击按钮
  const context = {
    button: null,
    des: { action: "myAction" },
    focusNote: MNNote.getFocusNote(),
    focusNotes: MNNote.getFocusNotes(),
    self: null
  };
  
  if (global.executeCustomAction) {
    global.executeCustomAction("myAction", context).then(result => {
      MNUtil.log(`测试结果: ${result}`);
    });
  }
}

// 执行测试
testMyFunction();
```

### 9.3 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| "Can't find variable" | 加载顺序错误 | 调整 JSB.require 位置 |
| "undefined is not an object" | 未初始化 | 调用 ensureView() |
| "Not supported yet..." | action 未注册 | 检查注册表加载 |
| 按钮不显示 | 缓存问题 | 使用 `global.forceRefreshButtons()` |
| 缩进混乱 | 手动修改错误 | 使用 Prettier 格式化 |

### 9.4 性能优化

- 大文档测试内存使用
- 使用 `undoGrouping` 批量操作
- 避免频繁 UI 更新
- 异步操作使用 `async/await`

---

## 10. API 快速参考

### 10.1 卡片操作

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

### 10.2 工具方法

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

### 10.3 配置管理

```javascript
// 读取
let frame = toolbarConfig.getWindowState("frame")

// 保存
toolbarConfig.windowState.frame = newFrame

// 持久化
toolbarConfig.save()
```

### 10.4 UI 组件

```javascript
// 弹窗输入
UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
  title, message, style, cancelTitle, otherTitles, callback
)

// 菜单显示
MNUtil.showMenu(menuItems, menuWidth)
```