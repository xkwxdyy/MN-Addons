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