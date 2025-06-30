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

### JSB 框架中的方法调用限制（极其重要！）

这是 JSB 框架最严重的限制之一，会导致各种 "is not a function" 错误。

#### 问题描述

在 `JSB.defineClass` 中定义的方法，在很多情况下无法通过 `self` 调用其他自定义方法：

```javascript
// ❌ 错误示例 1：viewDidLoad 中调用方法
var SimplePanelController = JSB.defineClass(
  'SimplePanelController : UIViewController',
  {
    viewDidLoad: function() {
      self.initConfig();  // 这可能导致整个插件无响应！
    },
    
    initConfig: function() {
      self.config = { mode: 0 };
    }
  }
);

// ❌ 错误示例 2：实例方法之间相互调用
var SimplePlugin = JSB.defineClass('SimplePlugin : JSExtension', {
  openTextProcessor: function() {
    if (!self.ensurePanelReady()) {  // self.ensurePanelReady is not a function!
      return;
    }
    self.showPanelWithAnimation();   // self.showPanelWithAnimation is not a function!
  },
  
  ensurePanelReady: function() {
    // 这个方法存在，但无法被调用
    return true;
  },
  
  showPanelWithAnimation: function() {
    // 这个方法也存在，但无法被调用
  }
});
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
| "is not a function" 错误 | 实例方法之间相互调用 | 内联所有方法逻辑 |
| 部分功能失效 | 方法定义顺序问题 | 使用内联代码替代方法调用 |
| 白屏 | MNButton color 参数格式错误 | 使用字符串格式颜色 |

#### 最佳实践

1. **viewDidLoad 中避免调用自定义方法**
2. **所有初始化代码直接内联**
3. **属性使用前必须先赋值**
4. **避免实例方法之间相互调用** - 如果需要共享逻辑，直接复制代码
5. **遇到 "is not a function" 错误时，首先考虑内联代码**
6. **遇到问题时使用增量调试法**
7. **保留每个工作版本作为回退点**

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

经过 10 个版本的迭代，我们：
- ✅ 解决了所有已知 Bug
- ✅ 积累了宝贵的 JSB 框架经验
- ✅ 形成了成熟的调试方法论
- ✅ 创建了一个稳定可靠的插件框架
- ✅ 实现了完整的数据持久化功能

这些经验对未来的 MarginNote 插件开发极其宝贵！

## 🔧 数据持久化完整方案（v0.0.9-v0.0.10）

### 问题与解决

#### 1. JSB 方法调用限制扩展

除了 `viewDidLoad`，在其他方法中也不能调用自定义方法：

```javascript
// ❌ 错误：在 processText 中调用自定义方法
processText: function() {
  // ... 处理逻辑
  self.saveHistory();  // Error: self.saveHistory is not a function
}

// ✅ 正确：直接内联保存代码
processText: function() {
  // ... 处理逻辑
  
  // 直接内联保存历史的代码
  try {
    const historyToSave = self.history.slice(-100);
    NSUserDefaults.standardUserDefaults().setObjectForKey(historyToSave, "SimplePanel_History");
    NSUserDefaults.standardUserDefaults().synchronize();
  } catch (e) {
    // 忽略错误
  }
}
```

#### 2. NSUserDefaults 正确用法

必须在设置值后调用 `synchronize()`，否则数据可能不会立即保存：

```javascript
// ❌ 不完整的保存
NSUserDefaults.standardUserDefaults().setObjectForKey(data, key);

// ✅ 完整的保存流程
NSUserDefaults.standardUserDefaults().setObjectForKey(data, key);
NSUserDefaults.standardUserDefaults().synchronize();  // 必须调用！
```

#### 3. 菜单时序问题

菜单关闭和 HUD 显示可能产生冲突，需要正确处理时序：

```javascript
// ❌ 可能导致菜单不消失
setMode: function(mode) {
  self.config.mode = mode;
  Menu.dismissCurrentMenu();
  MNUtil.showHUD("已切换");  // 可能干扰菜单关闭
}

// ✅ 正确的时序处理
setMode: function(mode) {
  self.config.mode = mode;
  
  // 先关闭菜单
  if (typeof Menu !== "undefined") {
    Menu.dismissCurrentMenu();
  }
  
  // 延迟显示 HUD，确保菜单已关闭
  NSTimer.scheduledTimerWithTimeInterval(0.1, false, () => {
    if (typeof MNUtil !== "undefined") {
      MNUtil.showHUD("已切换到: " + modeNames[mode]);
    }
  });
}
```

### 持久化架构设计

#### 1. 数据结构设计

```javascript
// 配置数据
const config = {
  mode: 0,              // 当前模式
  saveHistory: true,    // 是否保存历史
  inputText: "...",     // 输入框内容
  outputText: "..."     // 输出框内容
};

// 历史记录
const history = [
  {
    input: "原文本",
    output: "处理结果",
    mode: 0,
    time: "2025-06-29T10:00:00.000Z"
  }
];
```

#### 2. 加载时机

在 `viewDidLoad` 中直接内联加载代码：

```javascript
viewDidLoad: function() {
  // 加载配置
  const savedConfig = NSUserDefaults.standardUserDefaults().objectForKey("SimplePanel_Config");
  const defaultConfig = {
    mode: 0,
    saveHistory: true,
    inputText: "在这里输入文本...",
    outputText: "处理结果..."
  };
  
  self.config = savedConfig ? Object.assign({}, defaultConfig, savedConfig) : defaultConfig;
  
  // 加载历史
  self.history = [];
  try {
    const savedHistory = NSUserDefaults.standardUserDefaults().objectForKey("SimplePanel_History");
    if (savedHistory && Array.isArray(savedHistory)) {
      self.history = savedHistory;
    }
  } catch (error) {
    // 忽略错误
  }
  
  // 恢复文本框内容
  if (self.config.inputText && self.config.inputText !== "在这里输入文本...") {
    self.inputField.text = self.config.inputText;
  }
}
```

#### 3. 保存时机

- **配置改变时**：setMode, toggleSaveHistory
- **文本处理后**：processText（保存历史）
- **视图关闭时**：viewWillDisappear
- **清空历史时**：clearHistory

### 导出/导入增强（v0.0.10）

#### 完整导出格式

```javascript
exportConfig: function() {
  const exportData = {
    config: self.config,
    history: self.history,
    exportTime: new Date().toISOString(),
    version: "0.0.9"
  };
  
  const exportStr = JSON.stringify(exportData, null, 2);
  MNUtil.copy(exportStr);
  MNUtil.showHUD("配置和历史已复制到剪贴板");
}
```

#### 智能导入兼容

```javascript
importConfig: function() {
  const importData = JSON.parse(importStr);
  
  // 兼容旧格式（只有配置）
  if (!importData.config && !importData.history) {
    self.config = Object.assign(self.config, importData);
  } else {
    // 新格式（包含配置和历史）
    if (importData.config) {
      self.config = Object.assign(self.config, importData.config);
    }
    if (importData.history) {
      self.history = importData.history;
    }
  }
  
  // 立即保存
  NSUserDefaults.standardUserDefaults().setObjectForKey(self.config, "SimplePanel_Config");
  NSUserDefaults.standardUserDefaults().setObjectForKey(self.history, "SimplePanel_History");
  NSUserDefaults.standardUserDefaults().synchronize();
}
```

### 关键要点总结

1. **JSB 框架限制无处不在**：不仅 viewDidLoad，任何方法中都不能调用自定义方法
2. **持久化必须同步**：NSUserDefaults 操作后必须调用 synchronize()
3. **UI 操作需要时序控制**：菜单关闭和其他 UI 操作之间需要适当延迟
4. **数据结构要考虑扩展性**：导出格式包含版本号便于未来兼容
5. **错误处理要充分**：所有存储操作都应该用 try-catch 保护

## 🚀 高级配置管理系统（v1.0.0）

基于对 mnai 项目的学习，我们实现了一个更加成熟的配置管理系统。

### 系统架构

新的配置管理系统采用了类似 mnai 的设计理念：

```
ConfigManager（配置管理器）
├── 本地存储管理
├── iCloud 同步
├── 冲突检测与解决
├── 配置验证
└── 导入导出功能
```

### 核心特性

#### 1. 统一的配置管理接口

```javascript
// 初始化
configManager.init();

// 获取配置
const mode = configManager.get("mode", 0);

// 设置配置
configManager.set("mode", 1);

// 批量更新
configManager.update({
  mode: 2,
  saveHistory: true
});
```

#### 2. 智能同步机制

```javascript
// 时间戳管理
config: {
  modifiedTime: 1234567890,  // 最后修改时间
  lastSyncTime: 1234567890   // 最后同步时间
}

// 自动冲突检测
if (cloudConfig.modifiedTime > localConfig.modifiedTime) {
  // 云端更新，提示导入
} else if (localConfig.modifiedTime > cloudConfig.modifiedTime) {
  // 本地更新，自动上传
} else {
  // 冲突，让用户选择
}
```

#### 3. 多同步源支持（可扩展）

```javascript
syncSource: "none",    // none, iCloud, webdav, r2, etc.
autoSync: false,       // 自动同步开关
```

### 使用新系统

#### 1. 引入改进版控制器

```javascript
// 在 main.js 中
// JSB.require('simplePanelController');
JSB.require('simplePanelController_improved');
```

#### 2. 配置同步设置

在设置菜单中新增了云同步选项：
- 自动同步开关
- 同步源选择（目前支持 iCloud）
- 手动同步按钮

#### 3. 配置导入导出

支持完整的配置导入导出，包括：
- 配置数据
- 历史记录
- 版本信息
- 时间戳

### 与 mnai 项目的对比

| 特性 | simple-panel（旧版） | simple-panel（新版） | mnai |
|------|---------------------|---------------------|------|
| 配置管理 | 直接操作 NSUserDefaults | ConfigManager 封装 | chatAIConfig 类 |
| iCloud 同步 | 简单读写 | 智能冲突检测 | 完整冲突解决方案 |
| 时间戳管理 | 无 | modifiedTime + lastSyncTime | 相同机制 |
| 同步源 | 仅 iCloud | 可扩展架构 | 多种同步方式 |
| 配置验证 | 无 | 有 | 有 |
| 错误处理 | 基础 | 完善 | 完善 |

### 最佳实践

1. **使用配置管理器而非直接操作**
   ```javascript
   // ❌ 避免
   NSUserDefaults.standardUserDefaults().setObjectForKey(value, key);
   
   // ✅ 推荐
   configManager.set(key, value);
   ```

2. **处理同步冲突**
   ```javascript
   // 手动同步会自动处理冲突
   configManager.manualSync();
   ```

3. **批量更新配置**
   ```javascript
   // 一次更新多个配置项，只触发一次保存
   configManager.update({
     mode: 1,
     saveHistory: true,
     maxHistoryCount: 200
   });
   ```

### 详细文档

查看 [CONFIG_SYSTEM_UPGRADE.md](./CONFIG_SYSTEM_UPGRADE.md) 了解：
- 完整的系统设计
- 迁移指南
- 扩展开发指南
- API 参考

这个新的配置管理系统提供了更专业、更可靠的配置管理方案，适合插件的长期发展。

## 🎯 UI 响应性优化与层级菜单系统（v1.1.0）

本节记录了在优化 UI 响应性和实现层级菜单系统过程中遇到的问题及解决方案。

### 按钮响应延迟问题

#### 问题描述
使用 MNButton 创建的关闭和最小化按钮存在明显的响应延迟（约 0.5-1 秒），严重影响用户体验。

#### 原因分析
1. **MNButton 内置延迟**：MNButton 的 `addClickAction` 方法可能为了防止误触而有内置延迟
2. **事件传递链过长**：从按钮点击到实际执行经过多层传递
3. **UI 动画干扰**：隐式动画可能导致视觉上的延迟

#### 解决方案：使用原生 UIButton + TouchDown 事件

```javascript
// ❌ 有延迟的 MNButton 实现
self.closeButton = MNButton.new({
  title: "✕",
  font: 20,
  color: "#00000000",
  radius: 15
}, self.titleBar);
self.closeButton.addClickAction(self, "closePanel:");

// ✅ 即时响应的原生 UIButton 实现
self.closeButton = UIButton.buttonWithType(0);
self.closeButton.frame = {x: self.titleBar.frame.width - 35, y: 5, width: 30, height: 30};
self.closeButton.setTitleForState("✕", 0);
self.closeButton.setTitleColorForState(UIColor.blackColor(), 0);
self.closeButton.titleLabel.font = UIFont.systemFontOfSize(20);
self.closeButton.layer.cornerRadius = 15;
self.closeButton.backgroundColor = UIColor.clearColor();

// 关键：使用 TouchDown 事件而不是 TouchUpInside
self.closeButton.addTargetActionForControlEvents(self, "instantClose:", 1 << 0);
self.titleBar.addSubview(self.closeButton);

// 即时关闭函数
instantClose: function() {
  self.view.hidden = true;
  
  // 异步处理非关键操作
  if (self.appInstance) {
    dispatch_after(0.1, function() {
      try {
        self.appInstance.studyController(self.view.window).refreshAddonCommands();
      } catch (e) {}
    });
  }
}
```

#### 关键技术点
1. **TouchDown vs TouchUpInside**：
   - `1 << 0` = TouchDown：手指触摸时立即触发
   - `1 << 6` = TouchUpInside：手指抬起时触发（默认）
   
2. **异步处理非关键操作**：使用 `dispatch_after` 延迟执行刷新操作，不影响关闭速度

3. **禁用隐式动画**（可选）：
   ```javascript
   CATransaction.begin();
   CATransaction.setDisableActions(true);
   // UI 操作
   CATransaction.commit();
   ```

### Menu 类 convertRectToView 错误

#### 问题描述
点击设置菜单时报错：`TypeError: undefined is not an object (evaluating 'this.sender.convertRectToView')`

#### 原因分析
1. **参数传递问题**：菜单项配置中的 `param` 可能是 undefined
2. **按钮对象失效**：在菜单显示时原始按钮可能已经不可用
3. **MNButton 代理问题**：MNButton 是 Proxy 对象，不直接支持 `convertRectToView`

#### 解决方案：按钮验证与备用方案

```javascript
// 在 showMenu 中保存按钮引用
showMenu: function (button) {
  // 保存按钮引用，供后续使用
  if (button && typeof button.convertRectToView === 'function') {
    self.addonButton = button;
  }
  
  // 保存工具栏引用
  if (button && button.superview && button.superview.superview) {
    self.addonBar = button.superview.superview;
  }
  // ...
}

// 在子菜单方法中验证按钮
showSettingsMenu: function(button) {
  NSTimer.scheduledTimerWithTimeInterval(0.1, false, function() {
    // 获取有效的按钮对象
    var validButton = button;
    
    // 如果没有有效按钮，尝试使用工具栏按钮
    if (!validButton || typeof validButton.convertRectToView !== 'function') {
      if (self.addonButton && typeof self.addonButton.convertRectToView === 'function') {
        validButton = self.addonButton;
      } else if (self.addonBar) {
        // 尝试找到工具栏中的第一个按钮
        var buttons = self.addonBar.subviews.filter(function(v) {
          return v && typeof v.convertRectToView === 'function';
        });
        if (buttons.length > 0) {
          validButton = buttons[0];
        }
      }
    }
    
    // 如果还是没有有效按钮，显示错误
    if (!validButton || typeof validButton.convertRectToView !== 'function') {
      if (typeof MNUtil !== "undefined") {
        MNUtil.showHUD("无法显示设置菜单");
      }
      return;
    }
    
    // 使用验证后的按钮创建菜单
    var menu = new Menu(validButton, self, 250, 2);
    // ...
  });
}
```

### 菜单分隔线点击导致闪退

#### 问题描述
点击菜单中的分隔线（"——————"）导致应用闪退。

#### 崩溃原因
```
-[NSNull (dynamic selector)]: unrecognized selector sent to instance 0x2019b4d18
```

在菜单配置中，分隔线的 `object` 设置为 `null`：
```javascript
{title: "——————", object: null, selector: "", param: null}
```

在 Objective-C 桥接中，JavaScript 的 `null` 会被转换为 `NSNull`，而 `NSNull` 不能响应任何选择器。

#### 解决方案：替换所有 null 值

```javascript
// ❌ 导致崩溃的配置
var commandTable = [
  {title: '⚙️  设置', object: self, selector: 'showSettingsMenu', param: button},
  {title: "——————", object: null, selector: "", param: null},  // 危险！
  {title: '💡  帮助', object: self, selector: 'showHelp', param: null}
];

// ✅ 安全的配置
var commandTable = [
  {title: '⚙️  设置', object: self, selector: 'showSettingsMenu', param: button},
  {title: "——————", object: self, selector: "doNothing", param: ""},  // 安全
  {title: '💡  帮助', object: self, selector: 'showHelp', param: ""}
];

// 添加空方法处理分隔线点击
doNothing: function() {
  // 不做任何事情，只是为了避免崩溃
}
```

#### 重要原则
1. **永远不要在菜单配置中使用 `null`**
2. **使用空字符串 `""` 代替 `null`**
3. **为分隔线提供一个空方法**

### 层级菜单系统实现

#### 需求背景
原始菜单系统是"替换式"的——点击子菜单会替换当前菜单。用户希望实现真正的层级菜单，子菜单在父菜单旁边弹出。

#### 实现方案：HierarchicalMenuManager

```javascript
var HierarchicalMenuManager = {
  activeMenus: [], // 存储当前活动的菜单
  menuData: {},    // 存储菜单数据结构
  
  // 初始化菜单数据
  init: function() {
    this.menuData = {
      main: [
        {
          title: '🔧  文本处理',
          action: { object: 'self', selector: 'openTextProcessor', param: "" }
        },
        {
          title: '⚙️  设置',
          submenu: 'settings'  // 有子菜单
        }
      ],
      settings: [
        {
          title: function() {  // 动态标题
            var saveHistory = self.panelController.config.saveHistory;
            return saveHistory ? "✓ 保存历史" : "  保存历史";
          },
          action: { object: 'self', selector: 'toggleSaveHistory', param: "" }
        },
        {
          title: '🔄  云同步设置',
          submenu: 'syncSettings'  // 第三级菜单
        }
      ]
    };
  },
  
  // 显示菜单
  showMenu: function(menuId, button, parentMenu) {
    var menuItems = this.menuData[menuId];
    if (!menuItems) return;
    
    // 计算菜单方向
    var direction = 2; // 默认向下
    if (parentMenu) {
      direction = 4; // 子菜单向右
    }
    
    // 创建新菜单
    var menu = new Menu(button, self, 250, direction);
    var that = this;
    
    // 保存菜单管理器引用
    self._currentMenuManager = that;
    self._currentMenu = menu;
    
    // 添加菜单项
    menuItems.forEach(function(item, index) {
      if (item.type === 'separator') {
        menu.addMenuItem("——————", "doNothing", "");
      } else {
        var title = typeof item.title === 'function' ? item.title() : item.title;
        
        if (item.submenu) {
          // 为子菜单创建动态方法
          var methodName = "showSubmenu_" + item.submenu;
          
          self[methodName] = function(sender) {
            NSTimer.scheduledTimerWithTimeInterval(0.01, false, function() {
              self._currentMenuManager.showMenu(item.submenu, sender, self._currentMenu);
            });
          };
          
          menu.addMenuItem(title + " ▸", methodName + ":", button);
        } else if (item.action) {
          menu.addMenuItem(title, item.action.selector, item.action.param);
        }
      }
    });
    
    menu.show();
    this.activeMenus.push(menu);
  }
};
```

#### 关键技术点

1. **菜单方向控制**：
   - 主菜单：`direction = 2`（向下）
   - 子菜单：`direction = 4`（向右）

2. **动态方法创建**：
   由于 Menu 类只能调用已存在的方法，需要动态创建方法处理子菜单：
   ```javascript
   self[methodName] = function(sender) {
     // 显示子菜单
   };
   ```

3. **菜单层级管理**：
   - 维护 `activeMenus` 数组跟踪所有打开的菜单
   - 智能关闭不需要的菜单（同级或子级）

4. **动态标题支持**：
   ```javascript
   title: function() {
     return condition ? "✓ 选项" : "  选项";
   }
   ```

### 最佳实践总结

1. **UI 响应性优先**：
   - 关键操作使用原生 UIButton + TouchDown
   - 非关键操作使用 MNButton（功能更丰富）
   - 异步处理非必要的刷新操作

2. **防御性编程**：
   - 始终验证按钮对象的有效性
   - 提供备用方案（如工具栏按钮）
   - 避免使用 `null`，使用空字符串代替

3. **菜单系统设计**：
   - 使用数据驱动的菜单结构
   - 支持动态标题和多级嵌套
   - 智能的菜单生命周期管理

4. **调试技巧**：
   - 使用详细的日志追踪菜单操作
   - 检查崩溃日志中的 NSNull 相关错误
   - 测试所有菜单项，包括分隔线

这些优化显著提升了插件的用户体验，使界面响应更加迅速，菜单系统更加专业。