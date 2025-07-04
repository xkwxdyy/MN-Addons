# MNTask 视图管理系统使用指南

## 概述

MNTask 使用统一的视图管理系统来处理设置面板中的视图切换，避免重复代码，提高维护性。

## ⚠️ 极其重要的 JSB 框架陷阱

### 1. self 引用问题
**JSB 框架 self 引用问题**：在所有方法中使用 `self` 之前，必须先通过 `let self = getTaskSettingController()` 获取正确的引用。直接使用 `self` 会导致功能失效！

### 2. 类定义 vs 实例属性陷阱（极其重要）

**问题描述**：在 JSB.defineClass 中直接定义对象属性会导致该属性成为"类属性"而非"实例属性"，导致实例无法访问。

#### ❌ 错误示例（导致 viewManager 为 undefined）
```javascript
var taskSettingController = JSB.defineClass('taskSettingController', {
  viewDidLoad: function() {
    // ...
  },
  
  // ❌ 错误：这会成为类属性，不是实例属性！
  viewManager: {
    views: { /* ... */ },
    switchTo: function() { /* ... */ }
  },
  
  configButtonTapped: function() {
    let self = getTaskSettingController()
    self.viewManager.switchTo('config')  // ❌ self.viewManager 是 undefined！
  }
})
```

#### ✅ 正确做法（在实例初始化时创建）
```javascript
// 在 prototype 上定义初始化方法
taskSettingController.prototype.initViewManager = function() {
  // 创建实例属性
  this.viewManager = {
    views: { /* ... */ },
    switchTo: function() { /* ... */ }
  }
}

// 在 init 方法中调用
taskSettingController.prototype.init = function() {
  this.initViewManager()  // 初始化实例属性
}
```

#### 🏠 通俗解释
- **类定义** = 房子的设计图纸
- **实例** = 根据图纸建造的实际房子
- **错误做法**：把家具画在图纸上（类定义中），实际房子里没有家具
- **正确做法**：房子建好后（实例化），再搬入真实的家具（创建实例属性）

#### 📝 记住这个规则
**在 JSB.defineClass 中，只能定义方法（函数），不能定义对象属性！所有对象属性必须在实例初始化时创建。**

## 实现原理

### viewManager 的正确初始化流程

1. **viewDidLoad** 被调用（插件加载时）
2. **init()** 方法执行
3. **initViewManager()** 创建实例的 viewManager 属性
4. 现在每个按钮点击都能正确访问 `self.viewManager`

### 关键代码结构

```javascript
// 1. 获取实例的工厂函数（文件顶部）
const getTaskSettingController = () => self

// 2. 类定义（只包含方法）
var taskSettingController = JSB.defineClass('taskSettingController', {
  viewDidLoad: function() {
    let self = getTaskSettingController()
    self.init()  // 调用初始化
  },
  
  // 按钮点击方法
  configButtonTapped: function() {
    let self = getTaskSettingController()
    self.viewManager.switchTo('config')  // 现在能正常工作
  }
})

// 3. 在 prototype 上定义初始化方法
taskSettingController.prototype.init = function() {
  this.initViewManager()  // 创建实例属性
}

taskSettingController.prototype.initViewManager = function() {
  this.viewManager = {  // 创建实例属性
    views: { /* ... */ },
    switchTo: function() { /* ... */ }
  }
}
```

## 添加新视图的步骤

### 1. 在 viewManager.views 中添加配置

```javascript
viewManager: {
  views: {
    // ... 现有视图配置
    
    // 添加新视图
    myNewView: {
      view: 'myNewView',           // 视图属性名
      button: 'myNewButton',       // 按钮属性名
      selectedColor: '#457bd3',    // 选中时的颜色
      normalColor: '#9bb2d6',      // 正常状态颜色
      onShow: function(self) {     // 可选：显示前的回调
        // 执行初始化逻辑
        // 返回 false 可阻止切换
      }
    }
  }
}
```

### 2. 创建视图和按钮

在 `init` 或适当的初始化方法中：

```javascript
// 创建视图
this.createView("myNewView", "settingView")
this.myNewView.hidden = true

// 创建按钮
this.createButton("myNewButton", "myNewButtonTapped:", "tabView")
MNButton.setConfig(this.myNewButton, {
  title: "新视图",
  font: 15,
  color: "#9bb2d6",
  alpha: 0.8
})
```

### 3. 实现按钮点击事件

⚠️ **重要：JSB 框架 self 引用规范**

```javascript
myNewButtonTapped: function(params) {
  let self = getTaskSettingController()  // 必须先获取 self 引用！
  self.viewManager.switchTo('myNewView')
}
```

**千万不要忘记获取 self 引用！** 直接使用 `self` 会导致按钮点击无反应。

## 高级用法

### 视图显示前的验证

```javascript
onShow: function(self) {
  // 检查前置条件
  if (!someCondition) {
    self.showHUD("请先满足某个条件")
    return false  // 阻止切换
  }
  
  // 初始化数据
  self.loadMyViewData()
  return true  // 或省略，默认允许切换
}
```

### 动态注册/注销视图

```javascript
// 动态添加视图
self.viewManager.registerView('tempView', {
  view: 'tempView',
  button: 'tempButton',
  selectedColor: '#457bd3',
  normalColor: '#9bb2d6'
})

// 移除视图
self.viewManager.unregisterView('tempView')
```

### 共享视图

多个按钮可以共享同一个视图，如 dynamic 和 config：

```javascript
dynamic: {
  view: 'configView',  // 复用 configView
  button: 'dynamicButton',
  // ... 其他配置
}
```

## 最佳实践

1. **保持配置简洁**：onShow 回调应该只处理必要的初始化
2. **统一颜色方案**：使用一致的 selectedColor 和 normalColor
3. **避免副作用**：视图切换应该是可预测的
4. **适当的错误处理**：在 onShow 中处理可能的错误情况

## 注意事项

- 确保视图和按钮在调用 switchTo 之前已经创建
- onShow 返回 false 会阻止视图切换，但按钮状态不会改变
- 视图管理器不处理视图的布局，需要在适当的地方调用 `settingViewLayout()`

## 常见错误排查

### 问题：点击按钮没有反应

1. **检查 self 引用**
   ```javascript
   // ❌ 错误
   buttonTapped: function() {
     self.viewManager.switchTo('view')  // self 未定义
   }
   
   // ✅ 正确
   buttonTapped: function() {
     let self = getTaskSettingController()
     self.viewManager.switchTo('view')
   }
   ```

2. **检查 viewManager 是否存在**
   - 添加日志：`MNUtil.log("viewManager:", self.viewManager)`
   - 如果是 undefined，检查 initViewManager 是否被调用

3. **检查视图配置**
   - 确认视图名称拼写正确
   - 确认视图和按钮都已创建

### 问题：viewManager 为 undefined

**原因**：viewManager 被错误地定义在 JSB.defineClass 中

**解决**：
1. 将 viewManager 从类定义中移除
2. 创建 initViewManager 方法
3. 在 init 中调用 initViewManager

### 调试技巧

```javascript
// 在关键位置添加日志
MNUtil.log("🔍 viewDidLoad called")
MNUtil.log("🔍 self.viewManager = ", self.viewManager)
MNUtil.log("🔍 Calling switchTo:", viewName)
```

## 多看板管理架构

### 概述

MNTask 支持多个看板（如根目录看板、目标看板等）的统一管理，通过组合 JSB.defineClass 和 prototype 方法实现代码复用。

### 架构设计

#### 方法分层
1. **事件处理层**（JSB.defineClass）：响应按钮点击
2. **通用逻辑层**（prototype）：可复用的业务逻辑
3. **UI 创建层**（prototype）：统一的组件创建函数

### 实现步骤

#### 1. 创建通用的看板 UI 组件

```javascript
/**
 * 创建统一的看板绑定组件
 * @param {Object} config - 看板配置
 * @param {string} config.key - 看板唯一标识 (如 'root', 'target')
 * @param {string} config.title - 显示标题 (如 '根目录看板:', '目标看板:')
 * @param {string} config.parent - 父视图名称
 */
taskSettingController.prototype.createBoardBinding = function(config) {
  const {key, title, parent} = config
  const keyCapitalized = key.charAt(0).toUpperCase() + key.slice(1)
  
  // 创建标签
  const labelName = `${key}BoardLabel`
  this.createButton(labelName, "", parent)
  MNButton.setConfig(this[labelName], {
    title: title,
    color: "#457bd3",
    alpha: 0.3,
    font: 16,
    bold: true
  })
  this[labelName].userInteractionEnabled = false
  
  // 创建三个操作按钮
  this.createButton(`focus${keyCapitalized}BoardButton`, `focus${keyCapitalized}Board:`, parent)
  this.createButton(`clear${keyCapitalized}BoardButton`, `clear${keyCapitalized}Board:`, parent)
  this.createButton(`paste${keyCapitalized}BoardButton`, `paste${keyCapitalized}Board:`, parent)
  
  // 更新标签显示
  this.updateBoardLabel(key)
}
```

#### 2. 在 JSB.defineClass 中添加事件处理方法

```javascript
// 每个看板都需要三个事件处理方法
JSB.defineClass('taskSettingController', {
  // ... 其他方法
  
  // 目标看板的事件处理
  focusTargetBoard: function() {
    let self = getTaskSettingController()  // 必须获取实例！
    self.focusBoard('target')
  },
  
  clearTargetBoard: async function() {
    let self = getTaskSettingController()
    await self.clearBoard('target')
  },
  
  pasteTargetBoard: async function() {
    let self = getTaskSettingController()
    await self.pasteBoard('target')
  }
})
```

#### 3. 在 prototype 上实现通用逻辑

```javascript
// 通用的 Focus 操作
taskSettingController.prototype.focusBoard = function(boardKey) {
  let noteId = taskConfig.getBoardNoteId(boardKey)
  if (!noteId) {
    this.showHUD(`❌ 未设置${this.getBoardDisplayName(boardKey)}`)
    return
  }
  
  let note = MNNote.new(noteId)
  if (note) {
    note.focusInFloatMindMap()
  } else {
    this.showHUD("❌ 卡片不存在")
    taskConfig.clearBoardNoteId(boardKey)
    this.updateBoardLabel(boardKey)
  }
}

// 通用的 Clear 操作
taskSettingController.prototype.clearBoard = async function(boardKey) {
  // 确认对话框和清除逻辑
}

// 通用的 Paste 操作
taskSettingController.prototype.pasteBoard = async function(boardKey) {
  // 粘贴和验证逻辑
}
```

### 添加新看板的完整流程

1. **在 createSettingView 中创建 UI**
   ```javascript
   this.createBoardBinding({
     key: 'weekly',
     title: '周计划看板:',
     parent: 'taskBoardView'
   })
   ```

2. **在 JSB.defineClass 中添加事件处理**
   ```javascript
   focusWeeklyBoard: function() {
     let self = getTaskSettingController()
     self.focusBoard('weekly')
   },
   clearWeeklyBoard: async function() {
     let self = getTaskSettingController()
     await self.clearBoard('weekly')
   },
   pasteWeeklyBoard: async function() {
     let self = getTaskSettingController()
     await self.pasteBoard('weekly')
   }
   ```

3. **更新布局**
   ```javascript
   // 在 settingViewLayout 中添加
   taskFrame.set(this.weeklyBoardLabel, 10, 210, width-20, 35)
   taskFrame.set(this.focusWeeklyBoardButton, 10, 255, (width-30)/3, 35)
   taskFrame.set(this.clearWeeklyBoardButton, 15+(width-30)/3, 255, (width-30)/3, 35)
   taskFrame.set(this.pasteWeeklyBoardButton, 20+2*(width-30)/3, 255, (width-30)/3, 35)
   ```

4. **更新显示名称映射**
   ```javascript
   // 在 getBoardDisplayName 中添加
   const boardNames = {
     'root': '根目录卡片',
     'target': '目标看板',
     'weekly': '周计划看板'  // 新增
   }
   ```

### 常见问题

#### 按钮点击无响应
- 确保事件处理方法定义在 JSB.defineClass 中
- 确保使用 `let self = getTaskSettingController()` 获取实例
- 检查方法名是否与按钮 action 匹配（如 `focusTargetBoard:` 对应 `focusTargetBoard` 方法）

#### 方法调用错误
- JSB.defineClass 中的方法不能直接调用同级别的其他方法
- 必须通过 `self.methodName()` 调用 prototype 上的方法

### 最佳实践

1. **保持命名一致性**：使用 `${key}Board` 的命名模式
2. **代码复用最大化**：将所有通用逻辑抽取到 prototype 方法
3. **错误处理统一**：在通用方法中统一处理错误和用户反馈
4. **配置集中管理**：看板信息通过 taskConfig 统一存储