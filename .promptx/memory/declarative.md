

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