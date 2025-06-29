# Simple Panel Plugin 开发文档

本插件是一个最小化的 MarginNote 插件示例，展示了如何创建一个带控制面板的插件。

## 目录

1. [插件概述](#插件概述)
2. [核心组件](#核心组件)
3. [MNButton 类最佳实践](#mnbutton-类最佳实践)
4. [Menu 类最佳实践](#menu-类最佳实践)
5. [进阶优化](#进阶优化)
6. [调试技巧](#调试技巧)

## 插件概述

### 核心功能
1. 在插件栏显示图标
2. 点击图标显示/隐藏浮动控制面板
3. 支持拖动位置和调整大小
4. 响应选择文本事件
5. 提供基础的文本处理功能
6. 集成 MNUtils 的 MNButton 和 Menu 类

### 文件结构
```
simple-panel-plugin/
├── mnaddon.json          # 插件配置
├── main.js               # 插件主入口
├── simplePanelController.js # 控制面板 UI
├── logo.png              # 插件图标 (44x44)
├── README.md             # 说明文档
└── CLAUDE.md             # 本文档
```

## 核心组件

### main.js - 插件生命周期
处理插件的生命周期事件，管理插件栏图标的显示。

### simplePanelController.js - UI 控制器
实现控制面板的 UI 和交互逻辑。

## MNButton 类最佳实践

### 概述

MNButton 是 MNUtils 提供的增强按钮类，相比原生 UIButton 提供了更便捷的配置和操作方式。

### 核心特性

1. **便捷的配置对象创建**
2. **Proxy 模式的属性操作**
3. **内置手势支持**
4. **自动样式管理**

### 创建按钮

```javascript
// 基础创建
const button = MNButton.new({
  title: "按钮文字",
  font: 16,              // 字体大小或 UIFont 对象
  bold: true,            // 粗体
  color: "#5982c4",      // 背景色（支持 hex）
  opacity: 0.9,          // 透明度
  radius: 8,             // 圆角半径
  highlight: UIColor.redColor(), // 高亮色
}, parentView);         // 直接添加到父视图
```

### 属性操作

使用 Proxy 模式，可以像操作普通对象一样操作按钮：

```javascript
// 直接设置属性
button.title = "新标题";           // 设置标题
button.hidden = false;             // 显示/隐藏
button.frame = {x: 10, y: 10, width: 100, height: 40};
button.backgroundColor = "#ff0000"; // 支持字符串颜色
button.opacity = 0.8;              // 设置透明度

// 自定义属性也会被代理
button.customData = "some data";
```

### 事件处理

```javascript
// 点击事件
button.addClickAction(self, "handleClick:");

// 长按手势（0.5秒触发）
button.addLongPressGesture(self, "handleLongPress:", 0.5);

// 拖动手势
button.addPanGesture(self, "handlePan:");

// 轻扫手势
button.addSwipeGesture(self, "handleSwipe:", 1 << 0); // 右滑
```

### 图片按钮

```javascript
const imageButton = MNButton.new({
  image: "icon.png",     // 图标路径
  scale: 2,              // 图标缩放
  radius: 20,            // 圆形按钮
  color: "#00000000"     // 透明背景
}, parentView);

imageButton.setImage(UIImage.imageNamed("newIcon.png"));
```

### 动态样式

```javascript
// 根据状态改变样式
function updateButtonState(isActive) {
  button.backgroundColor = isActive ? "#5982c4" : "#cccccc";
  button.opacity = isActive ? 1.0 : 0.6;
  button.title = isActive ? "激活" : "未激活";
}
```

## Menu 类最佳实践

### 概述

Menu 类提供了强大的弹出菜单功能，支持自动位置调整、自定义样式等特性。

### 核心特性

1. **智能位置调整** - 自动避免超出屏幕
2. **灵活的菜单项配置**
3. **支持选中状态**
4. **自定义样式**

### 创建菜单

```javascript
// 参数：触发按钮, 代理对象, 宽度, 弹出方向
const menu = new Menu(button, self, 250, 2);
// 弹出方向：左0, 下1,3, 上2, 右4
```

### 添加菜单项

```javascript
// 单个添加
menu.addMenuItem("复制", "copyNote:", note, false);
menu.addMenuItem("制卡", "makeCard:", note, note.isCard); // 带选中状态

// 批量添加
menu.addMenuItems([
  {title: "转大写", selector: "toUpperCase:", param: 0, checked: config.mode === 0},
  {title: "转小写", selector: "toLowerCase:", param: 1, checked: config.mode === 1},
  {title: "首字母大写", selector: "capitalize:", param: 2, checked: config.mode === 2}
]);

// 插入菜单项
menu.insertMenuItem(0, "置顶选项", "topAction:");
```

### 自定义样式

```javascript
menu.rowHeight = 45;    // 行高（默认35）
menu.fontSize = 18;     // 字体大小
```

### 显示和关闭

```javascript
// 显示菜单
menu.show();

// 关闭菜单
menu.dismiss();

// 静态方法：关闭当前显示的菜单
Menu.dismissCurrentMenu();
```

### 实际应用示例

```javascript
showMenu: function(sender) {
  const menu = new Menu(sender, self, 200, 2);
  
  // 根据当前状态动态生成菜单
  if (self.config.mode === "edit") {
    menu.addMenuItem("保存", "save:");
    menu.addMenuItem("取消", "cancel:");
  } else {
    menu.addMenuItem("编辑", "edit:");
    menu.addMenuItem("删除", "delete:");
  }
  
  // 添加分隔线效果（使用不可点击的项）
  menu.addMenuItem("────────", "", "", false);
  
  // 添加子菜单效果
  menu.addMenuItem("更多选项 ▸", "showMoreOptions:");
  
  menu.show();
}
```

## 进阶优化

### 1. 智能调整大小手柄

使用 MNButton 替代普通 UIView 作为调整大小手柄：

```javascript
// 创建可视化的调整手柄
self.resizeHandle = MNButton.new({
  title: "⋮⋮",
  font: 12,
  color: "#00000030",    // 半透明
  radius: 10,
  opacity: 0.8
}, self.view);

// 添加拖动手势
self.resizeHandle.addPanGesture(self, "onResizeGesture:");

// 鼠标悬停效果（macOS）
if (MNUtil.isMacOS()) {
  self.resizeHandle.addLongPressGesture(self, "showResizeTip:", 0.1);
}
```

### 2. 状态切换按钮

```javascript
// 创建切换按钮
self.toggleButton = MNButton.new({
  title: self.isExpanded ? "收起" : "展开",
  color: "#5982c4",
  radius: 15
}, self.view);

// 点击切换状态
self.toggleButton.addClickAction(self, "toggleExpanded:");

toggleExpanded: function() {
  self.isExpanded = !self.isExpanded;
  
  // 更新按钮文字
  self.toggleButton.title = self.isExpanded ? "收起" : "展开";
  
  // 动画调整视图大小
  MNUtil.animate(() => {
    let frame = self.view.frame;
    frame.height = self.isExpanded ? 400 : 200;
    self.view.frame = frame;
  }, 0.25);
}
```

### 3. 动态菜单

```javascript
// 根据剪贴板内容动态生成菜单
showContextMenu: function(sender) {
  const menu = new Menu(sender, self, 250);
  const clipboardText = MNUtil.clipboardText;
  
  if (clipboardText) {
    menu.addMenuItem("粘贴: " + clipboardText.substring(0, 20) + "...", "paste:");
  }
  
  // 根据当前笔记状态添加选项
  const focusNote = MNNote.getFocusNote();
  if (focusNote) {
    menu.addMenuItem("处理当前笔记", "processNote:", focusNote);
    
    if (focusNote.childNotes.length > 0) {
      menu.addMenuItem(`处理 ${focusNote.childNotes.length} 个子笔记`, "processChildren:");
    }
  }
  
  // 添加最近使用的选项
  const recentActions = self.getRecentActions();
  if (recentActions.length > 0) {
    menu.addMenuItem("────────", "");
    recentActions.forEach(action => {
      menu.addMenuItem(action.title, "repeatAction:", action.id);
    });
  }
  
  menu.show();
}
```

### 4. 组合使用示例

```javascript
// 创建一个工具栏
self.toolbar = UIView.new();
self.toolbar.backgroundColor = UIColor.whiteColor();
self.view.addSubview(self.toolbar);

// 添加一组功能按钮
const actions = [
  { icon: "📝", action: "edit:" },
  { icon: "📋", action: "copy:" },
  { icon: "🗑", action: "delete:" },
  { icon: "⚙️", action: "settings:" }
];

self.toolbarButtons = actions.map((item, index) => {
  const btn = MNButton.new({
    title: item.icon,
    font: 20,
    color: "#00000000",
    radius: 20
  }, self.toolbar);
  
  btn.addClickAction(self, item.action);
  
  // 长按显示提示
  btn.addLongPressGesture(self, "showTooltip:", 0.3);
  btn.tooltipText = item.tooltip;  // 自定义属性
  
  return btn;
});
```

## 开发要点

### 1. self 变量的使用

在 JSB 框架中，`self` 是自动提供的实例引用，不要重新声明：

```javascript
// ❌ 错误
viewDidLoad: function() {
  var self = this;  // 不要这样做！
}

// ✅ 正确
viewDidLoad: function() {
  // 直接使用 self
  self.view.backgroundColor = UIColor.whiteColor();
}
```

### 2. 视图生命周期

- `loadView`: 创建主视图
- `viewDidLoad`: 初始化 UI 组件
- `viewWillLayoutSubviews`: 布局子视图

### 3. 内存管理

- 及时移除不需要的监听器
- 在控制器销毁时清理资源

## 调试技巧

### 1. 日志输出

使用 `MNUtil.log()` 输出日志：

```javascript
if (typeof MNUtil !== "undefined" && MNUtil.log) {
  MNUtil.log("🔧 调试信息");
  MNUtil.log("✅ 操作成功");
  MNUtil.log("❌ 错误: " + error.message);
}
```

### 2. 按钮状态调试

```javascript
// 调试按钮属性
if (typeof MNUtil !== "undefined" && MNUtil.log) {
  MNUtil.log("🔍 按钮状态: " + JSON.stringify({
    title: button.title,
    hidden: button.hidden,
    frame: button.frame,
    backgroundColor: button.backgroundColor
  }));
}
```

### 3. 菜单调试

```javascript
// 在菜单动作中添加日志
menuAction: function(param) {
  if (typeof MNUtil !== "undefined" && MNUtil.log) {
    MNUtil.log("📋 菜单选择: " + param);
  }
  // 处理逻辑
}
```

## 常见问题

### Q: 为什么插件图标不显示？
A: 确保：
1. logo.png 是 44x44 像素
2. `queryAddonCommandStatus` 方法正确实现
3. 只在 studyMode < 3 时返回配置

### Q: 控制面板不显示？
A: 检查：
1. view 是否正确创建
2. 没有使用 `var self = this`
3. 视图已添加到父视图

### Q: 按钮点击没反应？
A: 确认：
1. 正确使用 `addClickAction`
2. selector 方法名正确（包括冒号）
3. 方法在控制器中实现

## 调试经验与教训

### 白屏问题排查

如果插件显示白屏，没有任何按钮或内容，请检查以下几点：

#### 1. MNButton color 参数格式（最常见原因）

```javascript
// ❌ 错误：使用 UIColor 对象
const button = MNButton.new({
  color: UIColor.clearColor(),  // 这会导致白屏！
  color: UIColor.blueColor()     // 这也会导致白屏！
}, parentView);

// ✅ 正确：使用字符串格式
const button = MNButton.new({
  color: "#00000000",  // 透明背景
  color: "#5982c4"     // 蓝色背景
}, parentView);
```

#### 2. 动态设置 backgroundColor

```javascript
// ❌ 错误：动态设置时使用 UIColor
button.backgroundColor = UIColor.greenColor();

// ✅ 正确：动态设置也要用字符串
button.backgroundColor = "#4CAF50";
button.backgroundColor = "#00000020";  // 半透明
```

#### 3. 视图创建流程

```javascript
// ❌ 错误：不要添加 loadView 方法
loadView: function() {
  self.view = UIView.new();
  self.view.frame = {x: 100, y: 100, width: 400, height: 350};
}

// ✅ 正确：在 viewDidLoad 中设置 frame
viewDidLoad: function() {
  // 设置初始大小和位置
  self.view.frame = {x: 100, y: 100, width: 400, height: 350};
  // ... 其他初始化代码
}
```

### 最佳实践总结

#### 1. 颜色设置规范

- **MNButton 初始化**：color 参数必须使用字符串格式（如 `"#5982c4"`）
- **动态设置**：backgroundColor 属性也必须使用字符串格式
- **UIView 颜色**：可以使用 `UIColor.colorWithHexString("#5982c4")`

#### 2. 代码结构建议

- 保持简单：所有 UI 创建都在 `viewDidLoad` 中完成
- 不要随意覆盖视图生命周期方法（如 `loadView`）
- 视图布局代码放在 `viewWillLayoutSubviews` 中

#### 3. 调试技巧

当遇到白屏问题时：
1. 首先检查所有 MNButton 的 color 参数格式
2. 对比之前正常工作的版本（使用 git diff）
3. 逐步注释代码，定位问题代码块
4. 使用 `MNUtil.log()` 打印关键变量状态

#### 4. 版本控制的重要性

- 每次成功的修改都应该提交
- 遇到问题时可以快速回退到正常版本
- 使用有意义的 commit 信息记录改动