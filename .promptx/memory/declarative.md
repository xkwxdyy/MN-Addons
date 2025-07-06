

- 2025/06/29 11:43 START
## MN-Addon 插件开发框架学习进展 (2025-06-29)

### 完成的任务

1. **分析 mntexthandler 插件框架**
   - 理解了如何在插件栏显示图标 (queryAddonCommandStatus)
   - 掌握了点击图标显示控制面板的机制 (toggleAddon)
   - 学习了 UIViewController 创建浮动面板的方法
   - 理解了拖动和调整大小的手势处理

2. **创建 mntexthandler/CLAUDE.md 文档**
   - 详细说明了插件框架的核心结构
   - 提供了精简的代码示例
   - 标注了可以用 MNUtils API 优化的部分

3. **开发 simple-panel-plugin 示例插件**
   - 创建了完整可运行的最小插件框架
   - 实现了插件栏图标、浮动面板、输入输出框、按钮和菜单
   - 支持拖动位置和调整大小
   - 集成了 MNUtils API 并提供降级方案

4. **MNUtils API 优化**
   - 深入学习了 MNButton 类：
     * 配置对象创建按钮
     * Proxy 模式的属性操作
     * 多种手势支持（点击、长按、拖动、滑动）
   - 掌握了 Menu 类的使用：
     * 自动位置调整避免超出屏幕
     * 自定义行高和字体大小
     * 批量添加菜单项
     * dismiss() 方法优雅关闭

### 关键代码模式

```javascript
// MNButton 创建模式
const button = MNButton.new({
  title: "按钮",
  font: 16,
  color: "#5982c4",
  radius: 8,
  opacity: 0.9
}, parentView);
button.addClickAction(self, "action:");

// Menu 创建模式
const menu = new Menu(sender, self, 200, 2);
menu.rowHeight = 40;
menu.addMenuItem("选项", "action:", param, checked);
menu.show();
```

### 重要文件位置
- /Users/xiakangwei/Nutstore/Github/repository/MN-addon-develop/MN-Addon/mntexthandler/CLAUDE.md
- /Users/xiakangwei/Nutstore/Github/repository/MN-addon-develop/MN-Addon/simple-panel-plugin/

### 下一步计划
- 可以基于 simple-panel-plugin 框架开发具体功能插件
- 深入学习 MNNote、MNDocument 等其他核心类
- 研究 xdyyutils.js 中的学术扩展功能 --tags MN-Addon MarginNote 插件开发 MNUtils MNButton Menu
--tags #其他 #评分:8 #有效期:长期
- END

- 2025/06/29 11:48 START
## MarginNote 插件不在插件栏显示的问题排查

### 问题现象
simple-panel-plugin 插件安装后不在插件栏显示图标。

### 问题原因
在 main.js 中使用了全局 `var self = null;` 声明，这与 MarginNote 的插件框架不兼容。

### 解决方案
1. **移除全局 self 声明**：删除文件开头的 `var self = null;`
2. **在每个方法内声明 self**：在每个实例方法开始时使用 `var self = this;`

### 正确的代码模式
```javascript
JSB.newAddon = function (mainPath) {
  var PluginClass = JSB.defineClass('PluginClass : JSExtension', {
    sceneWillConnect: function() {
      var self = this;  // 正确：在方法内声明
      // ...
    },
    
    queryAddonCommandStatus: function() {
      var self = this;  // 每个方法都需要
      // ...
    }
  });
  return PluginClass;
};
```

### 调试技巧
1. 在关键方法中添加 HUD 提示：
   ```javascript
   self.appInstance.showHUD("调试信息", self.window, 2);
   ```

2. 在 queryAddonCommandStatus 中使用 NSLog（因为这个方法被频繁调用）：
   ```javascript
   if (typeof NSLog !== "undefined") {
     NSLog("queryAddonCommandStatus called");
   }
   ```

3. 创建打包脚本自动化测试流程

### 插件显示的必要条件
1. 正确实现 `queryAddonCommandStatus` 方法
2. 返回包含 `image`、`object`、`selector` 的对象
3. 图标文件必须是 44x44 像素的 PNG
4. 只在 studyMode < 3 时显示（非复习模式）
5. 在 notebookWillOpen 时调用 refreshAddonCommands()

### 其他注意事项
- JSB.require 应该在文件末尾
- 不要在全局作用域声明实例变量
- 始终检查对象是否存在再使用 --tags MarginNote 插件开发 调试技巧 插件栏显示
--tags #流程管理 #评分:8 #有效期:长期
- END

- 2025/06/29 11:54 START
## MarginNote 插件开发关键教训：JSB 框架中的 self 使用

### 严重错误案例
在 JSB.defineClass 中错误地重新声明 self 会导致崩溃：

```javascript
// ❌ 错误用法 - 导致无限递归崩溃
JSB.defineClass('Plugin : JSExtension', {
  sceneWillConnect: function() {
    var self = this;  // 错误！不要重新声明
  },
  queryAddonCommandStatus: function() {
    var self = this;  // 错误！会导致循环引用
    return { object: self, ... };
  }
});
```

### 正确用法
JSB 框架自动提供 self 实例引用：

```javascript
// ✅ 正确用法 - 直接使用 self
JSB.defineClass('Plugin : JSExtension', {
  sceneWillConnect: function() {
    self.appInstance = Application.sharedInstance();  // 直接使用 self
  },
  queryAddonCommandStatus: function() {
    return { 
      object: self,  // 安全使用
      selector: 'togglePanel:'
    };
  }
});
```

### 崩溃特征
- Exception Type: EXC_BAD_ACCESS (SIGSEGV)
- 堆栈显示大量 `-[NSDictionary isEqualToDictionary:]` 递归调用
- 原因：重新声明 self 创建了不同的对象引用，导致内部比较时产生循环

### 重要提醒
1. JSB 框架不同于普通 JavaScript
2. self 是特殊的自动变量，不需要也不能重新声明
3. 这是 MarginNote 插件开发的特有陷阱 --tags MarginNote 插件开发 JSB框架 崩溃调试 self变量
--tags #其他 #评分:8 #有效期:长期
- END

- 2025/06/29 12:01 START
## MarginNote 插件界面卡死问题排查与修复

### 问题表现
- 点击插件栏图标后界面完全卡死
- 只有分割按钮能点击，其他所有控件无响应
- 插件能正常加载但无法交互

### 问题原因
1. **主线程阻塞**：在 notebookWillOpen 中立即添加视图可能导致阻塞
2. **HUD 调试日志**：频繁使用 showHUD 会阻塞主线程
3. **shadowColor 设置问题**：某些 layer 属性设置可能引起渲染问题

### 解决方案

1. **使用 MNUtil.log 代替 HUD**：
```javascript
// ❌ 错误：阻塞主线程
self.appInstance.showHUD("调试信息", self.window, 2);

// ✅ 正确：使用 MNUtil.log
if (typeof MNUtil !== "undefined" && MNUtil.log) {
  MNUtil.log("🔧 调试信息");
}
```

2. **延迟添加视图**：
```javascript
// 使用 NSTimer 延迟添加视图
NSTimer.scheduledTimerWithTimeInterval(0.1, false, function() {
  var studyView = self.appInstance.studyController(self.window).view;
  if (studyView && self.panelController && self.panelController.view) {
    studyView.addSubview(self.panelController.view);
  }
});
```

3. **延迟刷新插件栏**：
```javascript
// 避免立即刷新导致阻塞
NSTimer.scheduledTimerWithTimeInterval(0.1, false, function() {
  self.appInstance.studyController(self.window).refreshAddonCommands();
});
```

4. **安全检查**：
```javascript
// 在操作前进行安全检查
if (!self.view || !frame || frame.width <= 0) return;
```

### 查看日志方法
1. 打开 MNUtils 插件
2. 进入日志查看器
3. 可以看到所有 MNUtil.log 输出的内容

### 调试技巧
- 使用 emoji 标记不同类型的日志：🚀 启动、✅ 成功、❌ 错误、⚠️ 警告
- 在关键流程节点添加日志
- 使用 try-catch 捕获异常并记录 --tags MarginNote 插件开发 界面卡死 调试技巧 MNUtil.log
--tags #流程管理 #评分:8 #有效期:长期
- END

- 2025/06/29 12:06 START
## JSB 框架中 self 变量的正确使用 - 完整指南

### 核心原则
在 JSB.defineClass 中，`self` 是框架自动提供的实例引用，绝对不能重新声明！

### 错误示例导致的问题

1. **主类中重新声明 self 导致崩溃**：
```javascript
// ❌ 错误 - 导致无限递归崩溃
JSB.defineClass('Plugin : JSExtension', {
  sceneWillConnect: function() {
    var self = this;  // 崩溃！
  }
});
```

2. **UIViewController 中重新声明 self 导致 view 为 null**：
```javascript
// ❌ 错误 - 导致 view 无法创建
JSB.defineClass('Controller : UIViewController', {
  viewDidLoad: function() {
    var self = this;  // view 会是 null！
    self.view.backgroundColor = ...  // 失败
  }
});
```

### 正确用法
```javascript
// ✅ 正确 - 直接使用 self
JSB.defineClass('Plugin : JSExtension', {
  sceneWillConnect: function() {
    self.appInstance = Application.sharedInstance();
  }
});

JSB.defineClass('Controller : UIViewController', {
  viewDidLoad: function() {
    // 直接使用 self，不要声明
    self.view.backgroundColor = UIColor.whiteColor();
    self.view.layer.cornerRadius = 11;
  }
});
```

### 症状对照表
| 症状 | 原因 | 解决方案 |
|------|------|----------|
| 崩溃，无限递归 | 主类中 var self = this | 移除声明 |
| UIViewController.view 为 null | 控制器中 var self = this | 移除声明 |
| 界面不显示 | view 创建失败 | 检查所有 self 使用 |

### 调试方法
```javascript
// 检查 view 是否存在
if (self.view) {
  MNUtil.log("✅ view 存在: " + JSON.stringify(self.view.frame));
} else {
  MNUtil.log("❌ view 是 null!");
}
```

### 重要提醒
- JSB 不是标准 JavaScript，有自己的规则
- self 是特殊变量，类似于 Python 的 self
- 这是 MarginNote 插件开发最容易犯的错误之一 --tags MarginNote JSB框架 self变量 UIViewController 调试
--tags #最佳实践 #评分:8 #有效期:长期
- END

- 2025/06/29 12:13 START
## MNUtils 核心 UI 组件 - MNButton 和 Menu 类完整指南

### MNButton 类 - 增强按钮组件

#### 概述
MNButton 是 MNUtils 提供的增强按钮类，通过 Proxy 模式封装了 UIButton，提供更便捷的配置和操作方式。

#### 核心特性
1. **配置对象创建** - 一次性配置所有属性
2. **Proxy 模式** - 直接操作属性，自动同步到 UIButton
3. **内置手势支持** - 点击、长按、拖动、轻扫
4. **自动样式管理** - 颜色、圆角、透明度等

#### 创建方式
```javascript
// 完整配置示例
const button = MNButton.new({
  title: "按钮文字",
  font: 16,                      // 数字或 UIFont 对象
  bold: true,                    // 粗体
  color: "#5982c4",             // 背景色（支持 hex）
  opacity: 0.9,                 // 透明度 (0-1)
  radius: 8,                    // 圆角半径
  alpha: 1.0,                   // 颜色透明度
  highlight: UIColor.redColor(), // 高亮色
  image: "icon.png",            // 图标路径
  scale: 2                      // 图标缩放
}, parentView);                 // 直接添加到父视图
```

#### 属性操作（Proxy 特性）
```javascript
// 所有属性都可以直接赋值
button.title = "新标题";
button.hidden = false;
button.frame = {x: 10, y: 10, width: 100, height: 40};
button.backgroundColor = "#ff0000";  // 或 UIColor 对象
button.opacity = 0.8;
button.currentTitleColor = "#ffffff";
button.font = UIFont.boldSystemFontOfSize(18);

// 自定义属性也会被代理到内部 UIButton
button.customData = "any value";
button.tooltipText = "提示文字";
```

#### 事件处理
```javascript
// 点击事件
button.addClickAction(self, "handleClick:");

// 长按手势
button.addLongPressGesture(self, "handleLongPress:", 0.5); // 0.5秒触发

// 拖动手势
button.addPanGesture(self, "handlePan:");

// 轻扫手势
button.addSwipeGesture(self, "handleSwipe:", 1 << 0); // 方向：右

// 移除事件
button.removeTargetActionForControlEvents(self, "handleClick:", 1 << 6);
```

#### 常用方法
```javascript
// 设置图片
button.setImage(UIImage.imageNamed("icon.png"));
button.setImageForState(image, 0);  // 0 = normal state

// 设置标题
button.setTitle("标题");
button.setTitleForState("按下时", 1);  // 1 = highlighted

// 设置颜色
button.setColor("#hexcolor", 0.8);  // hex 颜色 + alpha

// 设置 frame
button.setFrame(x, y, width, height);

// 视图操作
button.addSubview(view);
button.removeFromSuperview();
button.bringSubviewToFront(view);
```

#### 静态方法
```javascript
// 直接配置 UIButton（不创建 MNButton 实例）
MNButton.setConfig(uiButton, {
  title: "标题",
  color: "#5982c4"
});

// 添加点击事件到 UIButton
MNButton.addClickAction(uiButton, target, "selector:");
```

### Menu 类 - 弹出菜单组件

#### 概述
Menu 类提供智能的弹出菜单功能，自动调整位置避免超出屏幕，支持自定义样式和选中状态。

#### 核心特性
1. **智能位置调整** - 根据屏幕边缘自动调整弹出方向
2. **灵活配置** - 支持批量添加、插入菜单项
3. **选中状态** - 菜单项可显示勾选状态
4. **自定义样式** - 行高、字体大小可调

#### 创建方式
```javascript
// 参数：触发者, 代理对象, 宽度, 弹出方向
const menu = new Menu(button, self, 250, 2);
// 弹出方向：左0, 下1,3, 上2, 右4
```

#### 添加菜单项
```javascript
// 单个添加
menu.addMenuItem("复制", "copyNote:", note, false);
menu.addMenuItem("制卡", "makeCard:", note, note.isCard); // 带选中状态

// 批量添加
menu.addMenuItems([
  {title: "选项1", selector: "action1:", param: 1, checked: true},
  {title: "选项2", selector: "action2:", param: 2, checked: false}
]);

// 插入菜单项
menu.insertMenuItem(0, "置顶", "topAction:");
menu.insertMenuItems(2, [{title: "插入项", selector: "insert:"}]);
```

#### 样式自定义
```javascript
menu.rowHeight = 45;     // 默认 35
menu.fontSize = 18;      // 字体大小
menu.preferredPosition = 2;  // 优先弹出方向
```

#### 显示和关闭
```javascript
// 显示菜单
menu.show();

// 关闭当前菜单
menu.dismiss();

// 静态方法：关闭任何显示的菜单
Menu.dismissCurrentMenu();
```

#### 实际应用模式

##### 1. 动态菜单
```javascript
showMenu: function(sender) {
  const menu = new Menu(sender, self, 200);
  
  // 根据状态动态生成
  if (self.isEditing) {
    menu.addMenuItem("保存", "save:");
    menu.addMenuItem("取消", "cancel:");
  } else {
    menu.addMenuItem("编辑", "edit:");
    menu.addMenuItem("删除", "delete:");
  }
  
  menu.show();
}
```

##### 2. 带分隔线的菜单
```javascript
menu.addMenuItem("操作1", "action1:");
menu.addMenuItem("────────", "", "", false);  // 分隔线
menu.addMenuItem("操作2", "action2:");
```

##### 3. 级联菜单效果
```javascript
menu.addMenuItem("更多选项 ▸", "showSubMenu:");
```

### 最佳实践组合

#### 1. 工具栏按钮组
```javascript
const tools = ["📝", "📋", "🗑", "⚙️"];
self.toolButtons = tools.map(icon => {
  const btn = MNButton.new({
    title: icon,
    font: 20,
    color: "#00000000",
    radius: 20
  }, toolbar);
  
  btn.addClickAction(self, "toolAction:");
  btn.addLongPressGesture(self, "showToolTip:", 0.3);
  return btn;
});
```

#### 2. 状态切换按钮
```javascript
self.toggleBtn = MNButton.new({
  title: self.isOn ? "ON" : "OFF",
  color: self.isOn ? "#4CAF50" : "#f44336"
}, view);

toggleState: function() {
  self.isOn = !self.isOn;
  self.toggleBtn.title = self.isOn ? "ON" : "OFF";
  self.toggleBtn.backgroundColor = self.isOn ? "#4CAF50" : "#f44336";
}
```

#### 3. 可拖动的浮动按钮
```javascript
const floatBtn = MNButton.new({
  title: "📌",
  font: 24,
  radius: 25,
  color: "#5982c4",
  opacity: 0.8
}, parentView);

floatBtn.frame = {x: 300, y: 100, width: 50, height: 50};
floatBtn.addPanGesture(self, "dragFloatButton:");
```

### 重要提示
1. MNButton 和 Menu 都需要 MNUtils 插件支持
2. 始终检查 MNUtil 是否存在再使用这些类
3. 在 JSB 框架中直接使用 self，不要重新声明
4. Menu 会自动管理位置，不需要手动计算
5. MNButton 的自定义属性会被保存在按钮对象上 --tags MNUtils MNButton Menu MarginNote UI组件 最佳实践
--tags #最佳实践 #工具使用 #评分:8 #有效期:长期
- END

- 2025/06/29 12:24 START
MN-Addon 项目打包命令：使用 `mnaddon4 build <name>` 进行插件打包，不要使用 package.sh 脚本。例如：mnaddon4 build simple-panel-plugin --tags MN-Addon 打包 mnaddon4 build
--tags #工具使用 #评分:8 #有效期:长期
- END

- 2025/06/29 12:38 START
MN-Addon 插件开发白屏问题调试经验：

1. **MNButton color 参数格式问题（最常见原因）**
   - ❌ 错误：使用 UIColor 对象，如 color: UIColor.clearColor()
   - ✅ 正确：使用字符串格式，如 color: "#00000000"
   - 动态设置 backgroundColor 也必须用字符串格式

2. **视图创建流程**
   - 不要添加 loadView 方法覆盖默认行为
   - 在 viewDidLoad 中设置 view.frame
   - 保持代码结构简单，所有 UI 创建都在 viewDidLoad 中完成

3. **调试技巧**
   - 首先检查所有 MNButton 的 color 参数格式
   - 使用 git diff 对比正常工作版本
   - 逐步注释代码定位问题
   - 使用 MNUtil.log() 打印关键状态

4. **最佳实践**
   - MNButton 初始化的 color 必须用字符串格式
   - UIView 颜色可以用 UIColor.colorWithHexString()
   - 视图布局代码放在 viewWillLayoutSubviews 中
   - 每次成功修改都要及时提交 --tags MN-Addon 白屏 MNButton 调试 color参数
--tags #最佳实践 #流程管理 #评分:8 #有效期:长期
- END

- 2025/06/29 12:47 START
MN-Addon 插件使用 MNUtils API 优化经验：

1. **动画系统优化**
   - 使用 MNUtil.animate() 替代直接属性设置
   - 动画时长：快速反馈 0.1-0.2s，常规过渡 0.25-0.3s，复杂动画 0.4-0.5s

2. **配置持久化**
   - 使用 MNUtil.readCloudKey/setCloudKey 保存配置
   - 支持 iCloud 同步，跨设备共享配置

3. **错误处理集成**
   - try-catch 中使用 MNUtil.addErrorLog(error, source, context)
   - 自动记录到日志系统，便于调试

4. **平台兼容处理**
   - MNUtil.isMacOS() - macOS 平台检测
   - MNUtil.isIOS() - iOS 平台检测  
   - MNUtil.isMN4() - MarginNote 4 版本检测

5. **MNButton 高级用法**
   - addLongPressGesture() - 长按手势
   - addSwipeGesture() - 滑动手势
   - addPanGesture() - 拖动手势
   - 支持自定义属性通过 Proxy 模式

6. **Menu 批量操作**
   - Menu.item() 快速创建菜单项
   - menu.menuItems = items 批量设置
   - Menu.dismissCurrentMenu() 关闭当前菜单

7. **笔记操作优化**
   - MNNote.getFocusNote() 获取焦点笔记
   - MNNote.getSelectedNotes() 获取选中笔记
   - MNUtil.undoGrouping() 包装可撤销操作

8. **其他实用 API**
   - MNUtil.countWords() - 中英文字数统计
   - MNUtil.constrain() - 数值范围限制
   - MNUtil.showHUD() - 显示提示信息
   - MNUtil.confirm() - 确认对话框 --tags MNUtils API 优化 动画 配置持久化 错误处理
--tags #其他 #评分:8 #有效期:长期
- END

- 2025/06/29 15:58 START
MarginNote 插件调试经验 - Simple Panel Plugin 优化过程

## 问题总结
1. 尝试优化 simplePanelController.js 后，插件面板变成全白
2. 通过创建增量版本（0.0.1 到 0.0.7_safe）逐步定位问题
3. 最终成功添加了 iCloud 配置同步和历史记录持久化功能

## 关键发现

### JSB 框架限制
- **严重问题**：不能在 viewDidLoad 中调用自定义方法
- 症状：插件点击无反应或功能失效
- 解决方案：所有初始化代码必须内联在 viewDidLoad 中

### MNButton 颜色参数
- 必须使用字符串格式（如 "#5982c4"）
- 不能使用 UIColor 对象，否则导致白屏

### MNUtil.readJSON 安全隐患
- 没有内置错误处理
- 文件不存在时会导致应用崩溃
- 必须先用 MNUtil.isfileExists 检查文件存在性
- 使用按需加载策略，避免在 viewDidLoad 中读取文件

## 调试方法
1. 创建增量版本进行二分查找
2. 每个版本只改动一个功能点
3. 保留所有版本便于回退
4. 详细记录每个版本的问题和症状

## 最佳实践
- viewDidLoad 中避免方法调用，使用内联初始化
- 文件操作必须有完整的错误处理链
- 按需加载优于预加载
- 始终提供合理的默认值 --tags MarginNote MNUtils JSB 调试 插件开发
--tags #最佳实践 #评分:8 #有效期:长期
- END

- 2025/06/29 16:20 START
## Simple Panel Plugin v0.0.8 更新记录 (2025-06-29)

### 主要修改
1. **移除自动处理功能**
   - 删除了所有自动处理相关代码
   - 移除了左上角的"自动处理:关"指示器
   - 简化了配置结构

2. **修复已知问题**
   - 修复菜单点击后重新显示的问题
   - 改进历史记录菜单，即使没有历史也会显示菜单
   - 添加了调试日志帮助排查问题

3. **代码优化**
   - 移除了未使用的代码和变量
   - 改进了错误处理
   - 简化了 textViewDidChange 方法

### 注意事项
- "[Image #1]"问题可能是 MarginNote 的显示问题，已添加日志帮助调试
- 建议在 MNUtils 中查看日志了解详细运行情况 --tags MN-Addon simple-panel-plugin v0.0.8 更新记录
--tags #其他 #评分:8 #有效期:长期
- END

- 2025/06/29 17:52 START
## MarginNote 插件开发核心陷阱与解决方案 (Simple Panel Plugin v0.0.1-v0.0.8)

### 🔥 8个版本迭代的血泪教训

经过8个版本的痛苦迭代，终于总结出 MarginNote 插件开发的核心陷阱：

#### 1. JSB 框架 self 变量陷阱（最严重）
```javascript
// ❌ 绝对禁止 - 导致崩溃或插件不显示
JSB.defineClass('Plugin : JSExtension', {
  sceneWillConnect: function() {
    var self = this;  // 永远不要这样做！
  }
});

// ✅ 正确做法 - 直接使用 self
JSB.defineClass('Plugin : JSExtension', {
  sceneWillConnect: function() {
    self.appInstance = Application.sharedInstance();
  }
});
```

#### 2. viewDidLoad 方法调用陷阱
```javascript
// ❌ 会导致插件无响应
viewDidLoad: function() {
  self.initConfig();  // 不能调用自定义方法！
}

// ✅ 必须内联所有代码
viewDidLoad: function() {
  // 直接在这里写所有初始化代码
  self.config = { mode: 0, saveHistory: true };
  // ... 其他代码
}
```

#### 3. MNButton color 参数陷阱（导致白屏）
```javascript
// ❌ 导致白屏
MNButton.new({ color: UIColor.clearColor() });

// ✅ 必须使用字符串
MNButton.new({ color: "#00000000" });
button.backgroundColor = "#4CAF50";  // 动态设置也必须是字符串
```

#### 4. MNUtil.readJSON 崩溃陷阱
```javascript
// ❌ 文件不存在时崩溃
const data = MNUtil.readJSON(path);

// ✅ 安全的方式
if (MNUtil.isfileExists(path)) {
  try {
    const data = MNUtil.readJSON(path);
  } catch (e) {
    MNUtil.log("读取失败：" + e.message);
  }
}
```

### 调试方法论

1. **增量版本调试法**：每个小改动创建一个版本，快速定位问题
2. **症状诊断表**：
   - 插件不显示 → self 重新声明
   - 插件无响应 → viewDidLoad 调用方法
   - 白屏 → MNButton color 格式错误
   - 崩溃 → readJSON 文件不存在

3. **日志调试技巧**：
   ```javascript
   MNUtil.log("🚀 启动");
   MNUtil.log("✅ 成功: " + JSON.stringify(data));
   MNUtil.log("❌ 错误: " + error.message);
   ```

### 为什么会有这么多版本？

1. **JSB 框架的特殊性**：不是标准 JavaScript，有许多隐藏限制
2. **文档缺失**：MarginNote 插件开发文档有限，陷阱只能试错发现
3. **复杂依赖**：MNUtils API 使用有特定要求，参数格式严格

### 核心原则

1. **保持简单**：viewDidLoad 中直接写代码，不调用方法
2. **防御性编程**：所有文件操作加 try-catch
3. **渐进式开发**：每次只改一个功能，频繁测试
4. **充分利用日志**：在 MNUtils 中查看日志

最终 v0.0.8 版本稳定运行，所有问题得到解决！ --tags MarginNote 插件开发 JSB框架 MNUtils 调试 陷阱 simple-panel-plugin
--tags #其他 #评分:8 #有效期:长期
- END

- 2025/06/29 18:37 START
## MarginNote 插件开发 - 数据持久化完整解决方案

### 问题汇总（simple-panel-plugin v0.0.9-v0.0.10）

1. **JSB 框架方法调用限制扩展**
   - 不仅在 viewDidLoad 中不能调用自定义方法
   - 在 processText、setMode 等任何方法中都不能调用自定义方法
   - 错误：`self.saveHistory is not a function`
   - 解决：必须将所有代码内联，不能抽取为方法

2. **NSUserDefaults 持久化要求**
   - 必须在 setObjectForKey 后调用 synchronize()
   - 否则数据可能不会立即保存
   - 正确流程：`setObjectForKey → synchronize`

3. **菜单不消失问题**
   - Menu.dismissCurrentMenu() 和 MNUtil.showHUD() 可能冲突
   - 解决：使用 NSTimer.scheduledTimerWithTimeInterval 延迟 0.1 秒显示 HUD

4. **数据结构设计**
   - config: {mode, saveHistory, inputText, outputText}
   - history: [{input, output, mode, time}]
   - 导出格式包含：config + history + exportTime + version

5. **关键实现要点**
   - 加载时机：viewDidLoad 中直接内联
   - 保存时机：配置改变、文本处理后、视图关闭、清空历史
   - 历史限制：最近 100 条
   - 错误处理：所有存储操作用 try-catch 保护

### 最佳实践
- 永远不要在 JSB.defineClass 中定义并调用自定义方法
- 所有逻辑必须内联在生命周期方法中
- UI 操作要考虑时序，适当使用延迟
- 导出格式要包含版本号便于未来兼容 --tags MarginNote JSB框架 数据持久化 NSUserDefaults 插件开发 simple-panel-plugin
--tags #最佳实践 #流程管理 #评分:8 #有效期:长期

- END
  
## 高价值记忆（评分 ≥ 7）

- 2025/06/29 22:37 START
用户在 IDE 中打开了 simple-panel-plugin/log.txt 文件。这是 MN-Addon 项目中的一个插件日志文件，位于 simple-panel-plugin 目录下。该插件可能是一个简单的面板插件示例。 --tags MN-Addon simple-panel-plugin log
--tags #其他 #评分:8 #有效期:长期
- END



- 2025/06/29 22:45 START
simple-panel-plugin 项目遇到的4个UI交互问题及解决方案：
1. 关闭面板延迟 - 解决：直接hide或减少延迟到0.1秒
2. 面板拖动不跟鼠标 - 解决：正确计算手势偏移量，记录startOffset
3. convertRectToView错误 - 解决：使用按钮参数而非保存的sender，确保对象有效
4. 齿轮点击延迟 - 解决：直接响应点击，避免异步操作

关键技术点：
- 手势state：1=开始，3=结束
- 使用locationInView获取位置，translationInView获取偏移
- 使用MNUtil.constrain进行边界约束
- convertRectToView需要确保sender是有效UIView

参考mnai项目的utils.js getNewLoc函数和getPopoverAndPresent函数实现 --tags MN-Addon simple-panel-plugin UI交互 手势处理 菜单弹出
--tags #其他 #评分:8 #有效期:长期
- END

- 2025/06/29 23:02 START
成功完成了 MarginNote4 插件开发指南的重构和完善工作。主要改进包括：

1. 添加了开发框架选择指南，对比了 OhMyMN、MNUtils 和原生 API 三种开发方式
2. 新增了 OhMyMN 框架详解章节，详细介绍了现代化的 TypeScript 开发方式
3. 重组了 API 文档，按功能分类展示不同框架的实现方式
4. 更新了示例代码，添加了 OhMyMN TypeScript 示例和 Lite 插件示例
5. 完善了开发工具链，包括热重载、调试技巧、VSCode 配置等
6. 新增了实战开发指南，通过智能笔记处理器和笔记导出工具两个案例展示实际开发

文档现在更加现代化、实用，能够帮助开发者根据项目复杂度选择合适的开发方式。特别强调了 OhMyMN 作为推荐的现代化开发框架，同时保留了 MNUtils 和原生 API 的介绍，确保了文档的全面性。 --tags MarginNote4 插件开发 OhMyMN MNUtils 文档重构
--tags #工具使用 #评分:8 #有效期:长期
- END

- 2025/06/30 12:11 START
JSBox/JSB 框架语法支持重要发现

经过深入分析 mnutils、mntoolbar、mnai 源码，确认 JSBox/JSB 完全支持现代 ES6+ JavaScript 语法：

支持的特性：
- const/let 变量声明
- 箭头函数 () => {}
- 模板字符串 `${}`
- class 语法和 static 属性
- async/await 异步编程
- 解构赋值 {a, b} = obj
- 扩展运算符 [...array]
- 默认参数
- 现代数组方法（map、filter、find、includes等）
- 现代对象方法（Object.assign、Object.keys等）

重要教训：
1. 遇到"语法错误"时，先查看权威项目源码确认，不要盲目假设
2. JSBox 环境的问题通常不是语法兼容性，而是 API 使用问题
3. CATransaction 在 JSBox 中可能有兼容性问题，应避免使用
4. 按钮事件绑定时，在实例方法内应使用 this 而非 self --tags JSBox JavaScript ES6 语法支持 MarginNote 插件开发
--tags #其他 #评分:8 #有效期:长期
- END

- 2025/06/30 18:09 START
MarginNote 插件打包关键经验：

1. **错误的打包方式会导致插件无法加载甚至闪退**
   - ❌ 错误：`zip ../plugin.mnaddon ../plugin/*` 
   - ❌ 错误：`zip -r plugin.mnaddon plugin-folder/`
   - 这些方式会在压缩包内包含文件夹路径（如 `../plugin/main.js`），MarginNote 无法正确解析

2. **正确的打包方式**
   - ✅ 使用 mnaddon4 工具：`cd plugin-folder && mnaddon4 build plugin-name`
   - ✅ 在插件目录内直接压缩：`cd plugin-folder && zip plugin.mnaddon main.js mnaddon.json logo.png`

3. **验证打包结果**
   - 使用 `unzip -l plugin.mnaddon` 检查
   - 确保文件名前面没有任何路径前缀
   - 正确的结构应该是文件直接在根目录，如：`main.js`、`mnaddon.json`、`logo.png`

4. **症状识别**
   - 插件出现在列表但无法勾选
   - 双击 .mnaddon 文件后 MarginNote 闪退
   - 崩溃日志显示 NSJSONSerialization 异常

这是一个非常容易犯的错误，但影响严重。记住：永远不要压缩文件夹，而是进入文件夹后压缩文件。 --tags marginnote plugin mnaddon 打包 packaging 错误 闪退 crash
--tags #工具使用 #评分:8 #有效期:长期
- END

- 2025/07/07 01:16 START
MN-Addon 项目：多层级评论选择对话框开发经验

在开发 moveCommentsByPopup 功能增强时的关键经验：

1. 四层结构设计：
   - 第一层：选择要移动的评论（支持多选）
   - 第二层：选择目标字段（只显示字段，不显示 HtmlMarkdown）
   - 第三层：选择字段内的位置（显示独立评论和 HtmlMarkdown "文件夹"）
   - 第四层：选择 HtmlMarkdown 内部的具体位置

2. 内容归属规则：
   - HtmlMarkdown 之前的内容是独立的
   - HtmlMarkdown 之后的所有内容都属于该 HtmlMarkdown
   - 两个 HtmlMarkdown 之间的内容属于前一个 HtmlMarkdown

3. 关键实现方法：
   - parseFieldTopLevelStructure：解析字段顶层结构
   - parseFieldInternalComments：解析所有评论类型
   - showCommentMultiSelectDialog：多选对话框
   - showHtmlMarkdownInternalPositionDialog：HtmlMarkdown 内部选择

4. 常见陷阱：
   - HtmlMarkdown 在第二层显示：需要在 getHtmlCommentsTextArrForPopup 中过滤
   - 内容归属逻辑错误：使用三步清晰逻辑解决
   - 字段边界问题：传递 fieldObj 参数限制范围

5. 设计原则：
   - 文件夹式隐藏机制
   - 每层职责明确
   - 边界控制严格
   - 用户体验优先 --tags MN-Addon mnutils moveCommentsByPopup 多层级导航 HtmlMarkdown 开发经验
--tags #最佳实践 #评分:8 #有效期:长期
- END