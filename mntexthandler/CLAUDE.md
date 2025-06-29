# MNTextHandler 插件框架指南

> 本文档提供了一个精简的 MarginNote 插件开发框架，展示如何创建一个点击插件栏图标后显示控制面板的插件。

## 目录

1. [插件框架概述](#插件框架概述)
2. [核心架构分析](#核心架构分析)
3. [精简框架示例](#精简框架示例)
4. [MNUtils API 优化建议](#mnutils-api-优化建议)
5. [开发要点总结](#开发要点总结)

## 插件框架概述

MNTextHandler 是一个典型的带控制面板的 MarginNote 插件，其核心特性：

- ✅ 在插件栏显示图标
- ✅ 点击图标弹出浮动控制面板
- ✅ 支持拖动和调整大小
- ✅ 包含输入框、按钮、菜单等 UI 元素
- ✅ 响应文档选择事件

## 核心架构分析

### 文件结构
```
mntexthandler/
├── mnaddon.json         # 插件配置
├── main.js              # 主入口，处理生命周期
├── webviewController.js # 控制面板 UI 和逻辑
├── utils.js             # 工具函数（大部分可用 MNUtils 替代）
└── logo.png             # 插件图标 (44x44)
```

### 关键实现步骤

#### 1. 在插件栏显示 (main.js)
```javascript
queryAddonCommandStatus: function () {
  if (self.appInstance.studyController(self.window).studyMode < 3) {
    return {
      image: 'logo.png',      // 插件图标
      object: self,           // 回调对象
      selector: 'toggleAddon:', // 点击时调用的方法
      checked: false          // 是否选中状态
    };
  }
  return null;
}
```

#### 2. 响应点击事件 (main.js)
```javascript
toggleAddon: function (sender) {
  // 切换控制面板的显示/隐藏
  self.addonController.view.hidden = !self.addonController.view.hidden
  
  // 可选：获取选中文本并填充到输入框
  let textSelected = self.appInstance.studyController(self.window)
    .readerController.currentDocumentController.selectionText
  if (textSelected) {
    self.addonController.textviewInput.text = textSelected
  }
}
```

#### 3. 创建控制面板 (webviewController.js)
```javascript
viewDidLoad: function() {
  // 设置面板样式
  self.view.layer.shadowRadius = 15;
  self.view.layer.shadowOpacity = 0.5;
  self.view.layer.cornerRadius = 11;
  self.view.backgroundColor = UIColor.whiteColor().colorWithAlphaComponent(0.8);
  
  // 创建 UI 元素
  self.textviewInput = UITextView.new();
  self.textviewInput.font = UIFont.systemFontOfSize(16);
  self.textviewInput.layer.cornerRadius = 8;
  self.view.addSubview(self.textviewInput);
  
  // 添加手势识别器
  self.moveGesture = new UIPanGestureRecognizer(self, "onMoveGesture:");
  self.moveButton.addGestureRecognizer(self.moveGesture);
}
```

## 精简框架示例

### 最小可运行插件框架

#### mnaddon.json
```json
{
  "addonid": "marginnote.extension.simple-panel",
  "author": "Your Name",
  "title": "Simple Panel Plugin",
  "version": "1.0",
  "marginnote_version_min": "3.7.11",
  "cert_key": ""
}
```

#### main.js
```javascript
JSB.newAddon = function (mainPath) {
  // 定义插件主类
  var SimplePlugin = JSB.defineClass(
    'SimplePlugin : JSExtension',
    {
      // === 实例方法 ===
      
      // 场景连接时初始化
      sceneWillConnect: function () {
        self.appInstance = Application.sharedInstance();
        
        // 创建控制面板控制器
        self.panelController = SimplePanelController.new();
        self.panelController.mainPath = mainPath;
      },
      
      // 笔记本打开时
      notebookWillOpen: function (notebookid) {
        // 只在文档/学习模式下显示
        if (self.appInstance.studyController(self.window).studyMode < 3) {
          // 刷新插件栏图标
          self.appInstance.studyController(self.window).refreshAddonCommands();
          
          // 添加控制面板到视图
          self.appInstance.studyController(self.window).view
            .addSubview(self.panelController.view);
          self.panelController.view.hidden = true;
          
          // 监听选择事件（可选）
          NSNotificationCenter.defaultCenter()
            .addObserverSelectorName(self, 'onSelectionChanged:', 'PopupMenuOnSelection');
        }
      },
      
      // 查询插件状态（显示图标）
      queryAddonCommandStatus: function () {
        if (self.appInstance.studyController(self.window).studyMode < 3) {
          return {
            image: 'logo.png',
            object: self,
            selector: 'togglePanel:',
            checked: !self.panelController.view.hidden
          };
        }
        return null;
      },
      
      // 切换面板显示
      togglePanel: function (sender) {
        if (typeof MNUtil !== "undefined") {
          // 使用 MNUtils API 获取选中文本
          const selectedText = MNUtil.getSelectedText();
          if (selectedText) {
            self.panelController.inputField.text = selectedText;
            self.panelController.view.hidden = false;
          } else {
            self.panelController.view.hidden = !self.panelController.view.hidden;
          }
        } else {
          // 降级方案
          self.panelController.view.hidden = !self.panelController.view.hidden;
        }
      },
      
      // 选择变化时（可选）
      onSelectionChanged: function (sender) {
        if (!self.panelController.view.hidden) {
          let text = sender.userInfo.documentController.selectionText;
          if (text) {
            self.panelController.inputField.text = text;
          }
        }
      }
    },
    {
      // === 静态方法 ===
    }
  );
  
  return SimplePlugin;
};

// 在文件末尾加载依赖
JSB.require('simplePanelController');
```

#### simplePanelController.js
```javascript
// 尝试加载 MNUtils（如果可用）
try {
  JSB.require('mnutils');
} catch (e) {
  // MNUtils 不可用，使用降级方案
}

var SimplePanelController = JSB.defineClass(
  'SimplePanelController : UIViewController',
  {
    // 视图加载完成
    viewDidLoad: function() {
      self.appInstance = Application.sharedInstance();
      
      // === 设置面板样式 ===
      self.view.layer.shadowOffset = {width: 0, height: 0};
      self.view.layer.shadowRadius = 15;
      self.view.layer.shadowOpacity = 0.5;
      self.view.layer.cornerRadius = 11;
      self.view.backgroundColor = UIColor.whiteColor().colorWithAlphaComponent(0.9);
      
      // === 创建关闭按钮 ===
      self.closeButton = UIButton.buttonWithType(0);
      self.setButtonLayout(self.closeButton, "closePanel:");
      self.closeButton.setTitleForState("✕", 0);
      self.closeButton.titleLabel.font = UIFont.systemFontOfSize(20);
      
      // === 创建输入框 ===
      self.inputField = UITextView.new();
      self.inputField.font = UIFont.systemFontOfSize(16);
      self.inputField.layer.cornerRadius = 8;
      self.inputField.backgroundColor = UIColor.grayColor().colorWithAlphaComponent(0.2);
      self.inputField.text = "在这里输入...";
      self.view.addSubview(self.inputField);
      
      // === 创建执行按钮 ===
      self.executeButton = UIButton.buttonWithType(0);
      self.setButtonLayout(self.executeButton, "executeAction:");
      self.executeButton.setTitleForState("执行", 0);
      self.executeButton.titleLabel.font = UIFont.systemFontOfSize(16);
      
      // === 创建菜单按钮 ===
      self.menuButton = UIButton.buttonWithType(0);
      self.setButtonLayout(self.menuButton, "showMenu:");
      self.menuButton.setTitleForState("选项", 0);
      self.menuButton.titleLabel.font = UIFont.systemFontOfSize(16);
      
      // === 添加拖动手势 ===
      self.dragGesture = new UIPanGestureRecognizer(self, "onDragGesture:");
      self.view.addGestureRecognizer(self.dragGesture);
      
      // === 添加调整大小手势 ===
      self.resizeGesture = new UIPanGestureRecognizer(self, "onResizeGesture:");
      self.closeButton.addGestureRecognizer(self.resizeGesture);
      
      // 设置初始大小和位置
      self.view.frame = {x: 100, y: 100, width: 400, height: 200};
      self.currentFrame = self.view.frame;
    },
    
    // 布局子视图
    viewWillLayoutSubviews: function() {
      var frame = self.view.bounds;
      
      // 关闭按钮 - 右上角
      self.closeButton.frame = {
        x: frame.width - 35,
        y: 5,
        width: 30,
        height: 30
      };
      
      // 输入框 - 顶部
      self.inputField.frame = {
        x: 10,
        y: 40,
        width: frame.width - 20,
        height: 80
      };
      
      // 按钮 - 底部
      var buttonWidth = (frame.width - 30) / 2;
      self.executeButton.frame = {
        x: 10,
        y: frame.height - 40,
        width: buttonWidth,
        height: 35
      };
      
      self.menuButton.frame = {
        x: 20 + buttonWidth,
        y: frame.height - 40,
        width: buttonWidth,
        height: 35
      };
    },
    
    // === 事件处理 ===
    
    closePanel: function() {
      self.view.hidden = true;
    },
    
    executeAction: function() {
      var text = self.inputField.text;
      
      if (typeof MNUtil !== "undefined") {
        // 使用 MNUtils API
        const focusNote = MNNote.getFocusNote();
        if (focusNote) {
          MNUtil.undoGrouping(() => {
            focusNote.appendTextComment(text);
          });
          MNUtil.showHUD("已添加评论");
        }
      } else {
        // 降级方案
        Application.sharedInstance().showHUD(
          "已复制: " + text,
          self.view.window,
          2
        );
        UIPasteboard.generalPasteboard().string = text;
      }
    },
    
    showMenu: function(sender) {
      if (typeof Menu !== "undefined") {
        // 使用 MNUtils 的 Menu 类
        const menu = new Menu(sender, self, 200);
        menu.addMenuItem("选项 1", "menuAction:", "option1");
        menu.addMenuItem("选项 2", "menuAction:", "option2");
        menu.addMenuItem("选项 3", "menuAction:", "option3");
        menu.show();
      } else {
        // 降级方案：使用原生 MenuController
        var menuController = MenuController.new();
        menuController.commandTable = [
          {title: '选项 1', object: self, selector: 'menuAction:', param: 'option1'},
          {title: '选项 2', object: self, selector: 'menuAction:', param: 'option2'},
          {title: '选项 3', object: self, selector: 'menuAction:', param: 'option3'}
        ];
        menuController.rowHeight = 35;
        menuController.preferredContentSize = {
          width: 200,
          height: menuController.rowHeight * 3
        };
        
        var popoverController = new UIPopoverController(menuController);
        var studyController = Application.sharedInstance().studyController(self.view.window);
        var rect = sender.convertRectToView(sender.bounds, studyController.view);
        popoverController.presentPopoverFromRect(rect, studyController.view, 1 << 0, true);
      }
    },
    
    menuAction: function(option) {
      if (typeof MNUtil !== "undefined") {
        MNUtil.showHUD("选择了: " + option);
      } else {
        Application.sharedInstance().showHUD(
          "选择了: " + option,
          self.view.window,
          2
        );
      }
    },
    
    // === 手势处理 ===
    
    onDragGesture: function(gesture) {
      if (gesture.state === 1) { // Began
        self.dragOffset = gesture.locationInView(self.view);
      } else if (gesture.state === 2) { // Changed
        var location = gesture.locationInView(self.view.superview);
        self.view.frame = {
          x: location.x - self.dragOffset.x,
          y: location.y - self.dragOffset.y,
          width: self.view.frame.width,
          height: self.view.frame.height
        };
      }
    },
    
    onResizeGesture: function(gesture) {
      var location = gesture.locationInView(self.view);
      var width = Math.max(300, location.x);
      var height = Math.max(150, location.y + 35);
      
      self.view.frame = {
        x: self.view.frame.x,
        y: self.view.frame.y,
        width: width,
        height: height
      };
    }
  }
);

// 辅助方法：设置按钮布局
SimplePanelController.prototype.setButtonLayout = function(button, action) {
  button.autoresizingMask = (1 << 0 | 1 << 3);
  button.setTitleColorForState(UIColor.whiteColor(), 0);
  button.backgroundColor = UIColor.colorWithHexString("#5982c4");
  button.layer.cornerRadius = 8;
  button.layer.masksToBounds = true;
  if (action) {
    button.addTargetActionForControlEvents(this, action, 1 << 6);
  }
  this.view.addSubview(button);
};
```

## MNUtils API 优化建议

### 可以优化的部分

#### 1. 笔记操作
```javascript
// 原始代码（utils.js）
function getFocusNotes() {
  let focusWindow = Application.sharedInstance().focusWindow
  let notebookController = Application.sharedInstance().studyController(focusWindow).notebookController
  let selViewLst = notebookController.mindmapView.selViewLst
  return selViewLst.map(tem => tem.note.note)
}

// 使用 MNUtils
const focusNotes = MNNote.getFocusNotes();
```

#### 2. HUD 显示
```javascript
// 原始代码
Application.sharedInstance().showHUD(message, focusWindow, 2)

// 使用 MNUtils
MNUtil.showHUD(message);
```

#### 3. 撤销分组
```javascript
// 原始代码
UndoManager.sharedInstance().undoGrouping(
  String(Date.now()),
  notebookId,
  () => { /* 操作 */ }
);

// 使用 MNUtils
MNUtil.undoGrouping(() => {
  /* 操作 */
});
```

#### 4. 菜单创建 ⭐⭐⭐
```javascript
// Menu 类的完整功能
const menu = new Menu(button, self, 250, 2); // sender, delegate, width, position
// position: 左0, 下1,3, 上2, 右4

// 添加菜单项
menu.addMenuItem("复制", "copyNote:", note, false);         // 普通项
menu.addMenuItem("制卡", "makeCard:", note, note.isCard);   // 带选中状态

// 批量添加
menu.addMenuItems([
  {title: "选项1", selector: "action:", param: 1, checked: true},
  {title: "选项2", selector: "action:", param: 2}
]);

// 自定义样式
menu.rowHeight = 40;   // 默认35
menu.fontSize = 16;    // 字体大小

// 显示和关闭
menu.show();
menu.dismiss();

// 静态方法
Menu.dismissCurrentMenu(); // 关闭当前显示的菜单
```

#### 5. MNButton 高级按钮 ⭐⭐⭐⭐
```javascript
// MNButton 类的完整功能
const button = MNButton.new({
  title: "按钮文字",
  font: 16,              // 字体大小或 UIFont 对象
  bold: true,            // 粗体
  color: "#5982c4",      // 背景色（支持 hex）
  opacity: 0.9,          // 透明度
  radius: 8,             // 圆角半径
  alpha: 1.0,            // 颜色透明度
  highlight: UIColor.redColor(), // 高亮色
  image: "icon.png",     // 图标路径
  scale: 2               // 图标缩放
}, parentView);

// 属性操作（使用 Proxy 实现）
button.title = "新标题";
button.hidden = false;
button.frame = {x: 10, y: 10, width: 100, height: 40};
button.backgroundColor = "#ff0000";  // 或 UIColor 对象
button.opacity = 0.8;

// 事件处理
button.addClickAction(self, "handleClick:");
button.addLongPressGesture(self, "handleLongPress:", 0.5);
button.addPanGesture(self, "handlePan:");
button.addSwipeGesture(self, "handleSwipe:");

// 手动设置方法
button.setFrame(x, y, width, height);
button.setColor("#hexcolor", alpha);
button.setTitleForState("文字", 0);
button.setImageForState(image, 0);

// 视图操作
button.addSubview(view);
button.removeFromSuperview();
button.bringSubviewToFront(view);

// 静态方法（直接操作 UIButton）
MNButton.setConfig(uiButton, config);
MNButton.addClickAction(uiButton, target, "selector:");
```

#### 6. 笔记创建和修改
```javascript
// 使用 MNUtils
const note = MNNote.getFocusNote();
note.appendTextComment("评论");
note.appendHtmlComment("<b>HTML</b>");
```

### 完整的 MNUtils 集成示例
```javascript
// 在文件开头尝试加载 MNUtils
try {
  JSB.require('mnutils');
  MNUtil.init(self.mainPath); // 初始化（如果需要）
} catch (e) {
  // MNUtils 不可用，使用降级方案
}

// 条件使用 API
if (typeof MNUtil !== "undefined") {
  // 使用 MNUtils API
  const note = MNNote.getFocusNote();
  if (note) {
    MNUtil.undoGrouping(() => {
      note.noteTitle = "新标题";
      note.colorIndex = 2;
    });
    MNUtil.showHUD("操作完成");
  }
} else {
  // 降级方案
  // 使用原生 API
}
```

## 开发要点总结

### 核心要点

1. **插件栏显示**
   - 必须实现 `queryAddonCommandStatus` 方法
   - 返回包含 `image`、`object`、`selector` 的对象
   - 图标尺寸必须是 44x44 像素

2. **控制面板**
   - 使用 `UIViewController` 创建控制器
   - 在 `notebookWillOpen` 时添加到主视图
   - 初始设置为隐藏状态

3. **UI 布局**
   - 使用 `viewWillLayoutSubviews` 进行动态布局
   - 设置 `autoresizingMask` 实现自适应
   - 使用圆角和阴影增强视觉效果

4. **手势处理**
   - 使用 `UIPanGestureRecognizer` 实现拖动
   - 通过手势状态判断操作阶段
   - 保存当前位置以便下次恢复

5. **MNUtils 集成**
   - 始终进行存在性检查
   - 提供降级方案
   - 优先使用封装好的 API

### 最佳实践

1. **代码组织**
   - main.js 只处理生命周期
   - UI 逻辑放在单独的控制器文件
   - 工具函数优先使用 MNUtils

2. **错误处理**
   ```javascript
   try {
     // 危险操作
   } catch (error) {
     if (typeof MNUtil !== "undefined") {
       MNUtil.showHUD("错误: " + error.message);
     }
   }
   ```

3. **性能优化**
   - 避免频繁的 DOM 操作
   - 使用防抖处理手势事件
   - 及时释放不需要的资源

4. **用户体验**
   - 提供清晰的视觉反馈
   - 保存用户配置
   - 支持快捷键操作

## 快速开始模板

如果你想快速开始开发一个带控制面板的插件，可以：

1. 复制上面的精简框架示例代码
2. 修改 `mnaddon.json` 中的插件信息
3. 在 `simplePanelController.js` 中添加你的功能
4. 确保有 44x44 的 logo.png 图标
5. 打包成 .mnaddon 文件进行测试

记住：**始终检查 MNUtils 是否可用，并提供降级方案！**