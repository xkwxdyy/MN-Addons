# MNTask 视图管理系统使用指南

## 概述

MNTask 使用统一的视图管理系统来处理设置面板中的视图切换，避免重复代码，提高维护性。

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

```javascript
myNewButtonTapped: function(params) {
  self.viewManager.switchTo('myNewView')
}
```

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