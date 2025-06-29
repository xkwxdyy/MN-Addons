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

## MNUtils API 优化

本项目的 `simplePanelController.js` 已经充分利用了 MNUtils API 进行优化，主要特性包括：

### 核心优化功能

1. **配置持久化**
   - 使用 `MNUtil.readCloudKey/setCloudKey` 实现 iCloud 同步
   - 配置自动保存，跨设备共享

2. **历史记录管理**
   - 使用 `MNUtil.readJSON/writeJSON` 文件持久化
   - 自动限制存储空间
   - 支持 ISO 时间戳

3. **增强的用户交互**
   - `MNUtil.confirm()` - 危险操作确认
   - `MNUtil.input()` - 用户输入对话框
   - `MNUtil.select()` - 多选项选择器
   - `MNUtil.showHUD()` - 优雅的提示信息

4. **动画系统**
   - `MNUtil.animate()` - 平滑的过渡效果
   - 视图显示/隐藏动画
   - 缩放和透明度变换

5. **平台兼容性**
   - `MNUtil.isMacOS()` - macOS 鼠标悬停效果
   - `MNUtil.isMN4()` - MarginNote 4 特有功能
   - 自适应不同平台特性

6. **高级功能**
   - 用户自定义文本处理模式
   - 智能笔记插入（HTML/纯文本自适应）
   - 历史记录统计分析
   - 导入/导出配置

7. **错误处理与日志**
   - `MNUtil.addErrorLog()` - 统一错误记录
   - `MNUtil.log()` - 开发日志输出
   - 完善的 try-catch 保护

8. **性能优化**
   - `MNUtil.constrain()` - 数值范围约束
   - `MNUtil.undoGrouping()` - 撤销操作支持
   - 降级方案保证兼容性

### 使用示例

```javascript
// 配置持久化
const savedConfig = MNUtil.readCloudKey("SimplePanel_Config");
MNUtil.setCloudKey("SimplePanel_Config", JSON.stringify(config));

// 用户交互
MNUtil.confirm("确认", "确定执行吗？", ["取消", "确定"]).then(index => {
  if (index === 1) { /* 执行操作 */ }
});

// 动画效果
MNUtil.animate(() => {
  view.alpha = 0;
  view.transform = {a: 0.8, b: 0, c: 0, d: 0.8, tx: 0, ty: 0};
}, 0.2);

// 平台检测
if (MNUtil.isMacOS()) {
  // macOS 特有功能
}
```

详细的优化说明和对比请查看 [OPTIMIZATION_GUIDE.md](./OPTIMIZATION_GUIDE.md)。

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

### JSB 框架中的方法调用时机问题

这是一个非常隐蔽但严重的问题，可能导致插件完全无响应。

#### 问题描述

在 `JSB.defineClass` 中定义的方法，在某些情况下不能在 `viewDidLoad` 中被调用：

```javascript
// ❌ 错误：可能导致插件无响应
var SimplePanelController = JSB.defineClass(
  'SimplePanelController : UIViewController',
  {
    viewDidLoad: function() {
      // 调用自定义方法可能失败
      self.initConfig();  // 这可能导致整个插件无响应！
    },
    
    initConfig: function() {
      self.config = { mode: 0 };
    }
  }
);
```

#### 解决方案

1. **内联初始化**（推荐）：

```javascript
// ✅ 正确：直接在 viewDidLoad 中初始化
viewDidLoad: function() {
  // 直接初始化，不调用方法
  self.config = {
    mode: 0,
    autoProcess: false,
    saveHistory: true
  };
  
  // 其他初始化代码...
}
```

2. **确保属性先初始化再使用**：

```javascript
// ❌ 错误：使用未初始化的属性
viewDidLoad: function() {
  // 创建按钮时使用了 self.config.autoProcess
  self.button = MNButton.new({
    title: self.config.autoProcess ? "开" : "关"  // config 未定义！
  });
  
  self.config = { autoProcess: false };  // 太晚了
}

// ✅ 正确：先初始化再使用
viewDidLoad: function() {
  // 先初始化
  self.config = { autoProcess: false };
  
  // 然后使用
  self.button = MNButton.new({
    title: self.config.autoProcess ? "开" : "关"
  });
}
```

#### 调试方法：逐步构建版本

当遇到难以定位的问题时，使用增量式调试：

1. **创建多个版本文件**：
   ```
   simplePanelController_v0.0.1.js  // 基础版本
   simplePanelController_v0.0.2.js  // 添加功能A
   simplePanelController_v0.0.3.js  // 添加功能B
   ```

2. **修改 main.js 指向不同版本**：
   ```javascript
   JSB.require('simplePanelController_v0.0.1');
   ```

3. **构建并测试每个版本**：
   ```bash
   mnaddon4 build 0.0.1
   mnaddon4 build 0.0.2
   mnaddon4 build 0.0.3
   ```

4. **快速定位问题版本**：
   - 0.0.1 正常 → 0.0.2 异常 → 问题在 0.0.2 的改动中
   - 比较两个版本的差异即可快速定位

#### 症状与原因对照表

| 症状 | 可能原因 | 解决方案 |
|------|----------|----------|
| 插件点击无响应 | viewDidLoad 中调用了自定义方法 | 内联初始化代码 |
| 菜单无法弹出 | 使用了未初始化的属性 | 确保先初始化再使用 |
| 部分功能失效 | 方法定义顺序问题 | 使用内联代码替代方法调用 |
| 白屏 | MNButton color 参数格式错误 | 使用字符串格式颜色 |

#### 最佳实践

1. **viewDidLoad 中避免调用自定义方法**
2. **所有初始化代码直接内联**
3. **属性使用前必须先赋值**
4. **遇到问题时使用增量调试法**
5. **保留每个工作版本作为回退点**

### JSON 解析崩溃问题

在 viewDidLoad 中直接使用 MNUtil.readJSON 可能导致应用崩溃。

#### 崩溃原因
```javascript
// ❌ 错误：在 viewDidLoad 中直接读取 JSON 文件
viewDidLoad: function() {
  const history = MNUtil.readJSON(historyPath);  // 可能崩溃！
}
```

崩溃日志特征：
```
Exception Type:        EXC_CRASH (SIGABRT)
Exception Codes:       0x0000000000000000, 0x0000000000000000
...
12  Foundation            +[NSJSONSerialization JSONObjectWithData:options:error:] + 184
```

#### 解决方案

1. **延迟加载**（推荐）：
```javascript
// ✅ 正确：延迟加载 JSON 文件
viewDidLoad: function() {
  self.history = [];  // 先初始化为空数组
  
  // 延迟加载
  NSTimer.scheduledTimerWithTimeInterval(0.5, false, () => {
    try {
      const history = MNUtil.readJSON(historyPath);
      if (history && Array.isArray(history)) {
        self.history = history;
      }
    } catch (e) {
      MNUtil.log("加载失败：" + e.message);
    }
  });
}
```

2. **添加错误处理**：
```javascript
// ✅ 保存时也要保护
saveHistory: function() {
  try {
    MNUtil.writeJSON(historyPath, self.history);
  } catch (e) {
    MNUtil.log("保存失败：" + e.message);
  }
}
```

#### 根本原因分析
- MNUtil.readJSON 在文件不存在时可能返回 null 或抛出异常
- viewDidLoad 执行时机较早，文件系统可能未就绪
- JSON 解析失败会直接导致应用崩溃

#### 预防措施
1. 对所有文件 I/O 操作使用 try-catch
2. 延迟非关键的文件加载操作
3. 始终验证加载的数据类型
4. 提供合理的默认值

### MNUtil.readJSON 的安全使用

经过深入调查，发现 `MNUtil.readJSON` 的实现存在安全隐患：

```javascript
// MNUtil.readJSON 的实现
static readJSON(path){
  let data = NSData.dataWithContentsOfFile(path)
  const res = NSJSONSerialization.JSONObjectWithDataOptions(
    data,
    1<<0
  )
  return res
}
```

#### 问题分析
- 如果文件不存在，`NSData.dataWithContentsOfFile` 返回 null
- 将 null 传给 `NSJSONSerialization.JSONObjectWithDataOptions` 导致崩溃
- MNUtil 没有内置的错误处理

#### 正确的使用方式

1. **必须先检查文件是否存在**：
```javascript
// ✅ 安全的方式
if (MNUtil.isfileExists(path)) {
  const data = MNUtil.readJSON(path);
  // 处理数据
}
```

2. **完整的安全加载函数**：
```javascript
loadHistorySafely: function() {
  if (typeof MNUtil !== "undefined" && MNUtil.isfileExists && MNUtil.readJSON) {
    try {
      const historyPath = self.getHistoryPath();
      // 先检查文件是否存在
      if (MNUtil.isfileExists(historyPath)) {
        const history = MNUtil.readJSON(historyPath);
        if (history && Array.isArray(history)) {
          self.history = history;
          MNUtil.log("📚 加载了 " + self.history.length + " 条历史记录");
        }
      } else {
        MNUtil.log("📄 历史记录文件不存在，使用空历史");
      }
    } catch (e) {
      MNUtil.log("⚠️ 加载历史记录失败：" + e.message);
    }
  }
}
```

3. **按需加载而非预加载**：
```javascript
// ✅ 在需要时才加载
showHistory: function(sender) {
  // 在显示历史记录前先尝试加载
  self.loadHistorySafely();
  
  if (self.history.length > 0) {
    // 显示历史记录菜单
  }
}
```

#### 重要提醒
- **永远不要**在 viewDidLoad 中直接使用 MNUtil.readJSON
- **永远要**先用 MNUtil.isfileExists 检查文件存在性
- **永远要**用 try-catch 包装文件操作
- **优先考虑**按需加载而非预加载

## 🎯 版本迭代经验总结（v0.0.1 - v0.0.8）

经过 8 个版本的迭代，我们遇到并解决了许多关键问题。以下是每个版本的问题和解决方案总结：

### 版本历史与关键教训

#### v0.0.1 - 初始版本
**问题**：插件不在插件栏显示
**原因**：全局声明 `var self = null`
**教训**：JSB 框架中 self 是自动提供的，绝不要重新声明

#### v0.0.2 - 方法调用问题
**问题**：插件点击无响应
**原因**：在 viewDidLoad 中调用自定义方法 `initConfig()`
**教训**：JSB 框架限制，viewDidLoad 中不能调用自定义方法，必须内联代码

#### v0.0.3 - 属性初始化顺序
**问题**：功能失效
**原因**：使用了未初始化的属性
**教训**：确保属性在使用前已经初始化

#### v0.0.4_safe - 深层问题
**问题**：整个插件无响应
**原因**：JSB 框架中方法调用时机问题
**教训**：viewDidLoad 中的所有初始化必须内联

#### v0.0.5 - iCloud 配置
**问题**：配置不能持久化
**解决**：使用 MNUtil.readCloudKey/setCloudKey
**成果**：实现了跨设备配置同步

#### v0.0.6 - JSON 解析崩溃
**问题**：应用启动时崩溃
**原因**：MNUtil.readJSON 没有错误处理，文件不存在时崩溃
**教训**：必须先用 isfileExists 检查，使用 try-catch 保护

#### v0.0.7_safe - 白屏问题
**问题**：插件显示白屏
**原因**：MNButton color 参数使用了 UIColor 对象
**教训**：MNButton 的 color 必须使用字符串格式（如 "#5982c4"）

#### v0.0.8 - 最终稳定版
**改进**：
- 移除了问题较多的自动处理功能
- 修复了菜单不消失的问题
- 改进了历史记录菜单显示
- 添加了详细的调试日志

### 🔥 核心开发陷阱（必读！）

#### 1. JSB 框架的 self 变量陷阱

```javascript
// ❌❌❌ 绝对禁止 - 导致崩溃或插件不显示
JSB.defineClass('Plugin : JSExtension', {
  sceneWillConnect: function() {
    var self = this;  // 永远不要这样做！
  }
});

// ✅✅✅ 正确做法 - 直接使用 self
JSB.defineClass('Plugin : JSExtension', {
  sceneWillConnect: function() {
    self.appInstance = Application.sharedInstance();
  }
});
```

#### 2. viewDidLoad 方法调用陷阱

```javascript
// ❌❌❌ 会导致插件无响应
viewDidLoad: function() {
  self.initConfig();  // 不能调用自定义方法！
  self.createUI();    // 这也不行！
}

// ✅✅✅ 必须内联所有代码
viewDidLoad: function() {
  // 直接在这里写所有初始化代码
  self.config = {
    mode: 0,
    saveHistory: true
  };
  
  // 直接创建 UI，不要调用方法
  self.view.backgroundColor = UIColor.whiteColor();
  // ... 其他代码
}
```

#### 3. MNButton color 参数陷阱

```javascript
// ❌❌❌ 导致白屏！
MNButton.new({
  color: UIColor.clearColor(),     // 错误！
  color: UIColor.blueColor()       // 错误！
});

// ✅✅✅ 必须使用字符串
MNButton.new({
  color: "#00000000",  // 透明
  color: "#5982c4"     // 蓝色
});

// 动态设置也一样
button.backgroundColor = "#4CAF50";  // 必须是字符串！
```

#### 4. MNUtil.readJSON 崩溃陷阱

```javascript
// ❌❌❌ 文件不存在时崩溃
const data = MNUtil.readJSON(path);

// ✅✅✅ 安全的方式
if (MNUtil.isfileExists(path)) {
  try {
    const data = MNUtil.readJSON(path);
    // 处理数据
  } catch (e) {
    MNUtil.log("读取失败：" + e.message);
  }
}
```

### 🛠️ 调试方法论

#### 1. 增量版本调试法

当遇到难以定位的问题时，创建增量版本：

```bash
# 每个小改动创建一个版本
simplePanelController_v0.0.1.js  # 基础版本
simplePanelController_v0.0.2.js  # 添加功能A
simplePanelController_v0.0.3.js  # 添加功能B

# 快速定位问题
mnaddon4 build 0.0.1  # 正常
mnaddon4 build 0.0.2  # 异常 → 问题在 0.0.2 的改动中
```

#### 2. 症状诊断表

| 症状 | 可能原因 | 解决方案 |
|------|----------|----------|
| 插件不显示 | self 重新声明 | 移除 var self = this |
| 插件无响应 | viewDidLoad 调用方法 | 内联所有代码 |
| 白屏 | MNButton color 格式错误 | 使用字符串颜色 |
| 崩溃 | readJSON 文件不存在 | 先检查文件存在性 |
| 菜单不消失 | 异步重新显示 | 移除延迟显示代码 |
| 功能失效 | 属性未初始化 | 确保先初始化再使用 |

#### 3. 日志调试技巧

```javascript
// 在关键位置添加日志
if (typeof MNUtil !== "undefined" && MNUtil.log) {
  MNUtil.log("🚀 启动");
  MNUtil.log("✅ 成功: " + JSON.stringify(data));
  MNUtil.log("❌ 错误: " + error.message);
  MNUtil.log("🔧 调试: 变量值 = " + value);
}
```

### 🎓 关键经验总结

#### 为什么会有这么多版本？

1. **JSB 框架的特殊性**
   - 不是标准 JavaScript 环境
   - 有许多隐藏的限制和规则
   - 错误信息不明确，难以调试

2. **文档缺失**
   - MarginNote 插件开发文档有限
   - 很多陷阱只能通过试错发现
   - 社区经验分享不足

3. **复杂的依赖关系**
   - MNUtils API 的使用有特定要求
   - UI 组件的参数格式严格
   - 生命周期方法的限制

#### 避免问题的核心原则

1. **保持简单**
   - viewDidLoad 中直接写代码，不调用方法
   - 使用基础类型而非对象（如颜色用字符串）
   - 避免过度抽象和封装

2. **防御性编程**
   - 所有文件操作加 try-catch
   - 检查对象存在性再使用
   - 提供降级方案

3. **渐进式开发**
   - 每次只改一个功能
   - 频繁测试和提交
   - 保留所有版本便于回退

4. **充分利用日志**
   - 关键操作都要记录
   - 使用 emoji 区分日志类型
   - 在 MNUtils 中查看日志

### 🎆 最终成果

经过 8 个版本的迭代，我们：
- ✅ 解决了所有已知 Bug
- ✅ 积累了宝贵的 JSB 框架经验
- ✅ 形成了成熟的调试方法论
- ✅ 创建了一个稳定可靠的插件框架

这些经验对未来的 MarginNote 插件开发极其宝贵！