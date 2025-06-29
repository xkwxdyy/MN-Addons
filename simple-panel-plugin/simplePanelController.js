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
      // 直接使用 self，不要声明 var self = this
      
      self.appInstance = Application.sharedInstance();
      
      // 初始化 MNUtil（如果可用）
      if (typeof MNUtil !== "undefined") {
        if (self.mainPath) {
          MNUtil.init(self.mainPath);
        }
        MNUtil.log("🎭 SimplePanelController: viewDidLoad - view frame = " + JSON.stringify(self.view.frame));
      }
      
      // === 设置面板样式 ===
      self.view.layer.shadowOffset = {width: 0, height: 0};
      self.view.layer.shadowRadius = 15;
      self.view.layer.shadowOpacity = 0.5;
      // 注释掉可能有问题的 shadowColor 设置
      // self.view.layer.shadowColor = UIColor.colorWithWhiteAlpha(0.5, 1);
      self.view.layer.cornerRadius = 11;
      self.view.backgroundColor = UIColor.whiteColor().colorWithAlphaComponent(0.9);
      
      // === 创建标题栏 ===
      try {
        self.titleBar = UIView.new();
        self.titleBar.backgroundColor = UIColor.colorWithHexString("#5982c4");
        self.view.addSubview(self.titleBar);
      } catch (e) {
        if (typeof MNUtil !== "undefined" && MNUtil.log) {
          MNUtil.log("❌ SimplePanelController: 创建标题栏失败 - " + e.message);
        }
        return;
      }
      
      // === 创建标题标签 ===
      self.titleLabel = UILabel.new();
      self.titleLabel.text = "Simple Panel";
      self.titleLabel.textColor = UIColor.whiteColor();
      self.titleLabel.font = UIFont.boldSystemFontOfSize(16);
      self.titleLabel.textAlignment = 1; // Center
      self.titleBar.addSubview(self.titleLabel);
      
      // === 创建关闭按钮（使用 MNButton 如果可用）===
      if (typeof MNButton !== "undefined") {
        self.closeButton = MNButton.new({
          title: "✕",
          font: 20,
          color: "#00000000", // 透明背景
          radius: 0,
          highlight: UIColor.redColor()
        }, self.titleBar);
        self.closeButton.addClickAction(self, "closePanel:");
      } else {
        self.closeButton = UIButton.buttonWithType(0);
        self.setButtonLayout(self.closeButton, "closePanel:");
        self.closeButton.setTitleForState("✕", 0);
        self.closeButton.titleLabel.font = UIFont.systemFontOfSize(20);
        self.closeButton.backgroundColor = UIColor.clearColor();
        self.titleBar.addSubview(self.closeButton);
      }
      
      // === 创建输入框 ===
      self.inputField = UITextView.new();
      self.inputField.font = UIFont.systemFontOfSize(16);
      self.inputField.layer.cornerRadius = 8;
      self.inputField.backgroundColor = UIColor.grayColor().colorWithAlphaComponent(0.2);
      self.inputField.text = "在这里输入文本...";
      self.inputField.textContainerInset = {top: 8, left: 8, bottom: 8, right: 8};
      self.view.addSubview(self.inputField);
      
      // === 创建输出框 ===
      self.outputField = UITextView.new();
      self.outputField.font = UIFont.systemFontOfSize(16);
      self.outputField.layer.cornerRadius = 8;
      self.outputField.backgroundColor = UIColor.grayColor().colorWithAlphaComponent(0.2);
      self.outputField.text = "输出结果...";
      self.outputField.textContainerInset = {top: 8, left: 8, bottom: 8, right: 8};
      self.outputField.editable = false;
      self.view.addSubview(self.outputField);
      
      // === 创建按钮容器 ===
      self.buttonContainer = UIView.new();
      self.view.addSubview(self.buttonContainer);
      
      // === 创建按钮（使用 MNButton 如果可用）===
      if (typeof MNButton !== "undefined") {
        // 执行按钮
        self.executeButton = MNButton.new({
          title: "执行",
          font: 16,
          color: "#5982c4",
          radius: 8
        }, self.buttonContainer);
        self.executeButton.addClickAction(self, "executeAction:");
        
        // 菜单按钮
        self.menuButton = MNButton.new({
          title: "选项",
          font: 16,
          color: "#5982c4",
          radius: 8
        }, self.buttonContainer);
        self.menuButton.addClickAction(self, "showMenu:");
        
        // 复制按钮（带长按功能）
        self.copyButton = MNButton.new({
          title: "复制",
          font: 16,
          color: "#5982c4",
          radius: 8
        }, self.buttonContainer);
        self.copyButton.addClickAction(self, "copyOutput:");
        // 添加长按手势：清空输出
        self.copyButton.addLongPressGesture(self, "clearOutput:", 0.5);
      } else {
        // 降级方案：使用原生按钮
        self.executeButton = UIButton.buttonWithType(0);
        self.setButtonLayout(self.executeButton, "executeAction:");
        self.executeButton.setTitleForState("执行", 0);
        self.executeButton.titleLabel.font = UIFont.systemFontOfSize(16);
        self.buttonContainer.addSubview(self.executeButton);
        
        self.menuButton = UIButton.buttonWithType(0);
        self.setButtonLayout(self.menuButton, "showMenu:");
        self.menuButton.setTitleForState("选项", 0);
        self.menuButton.titleLabel.font = UIFont.systemFontOfSize(16);
        self.buttonContainer.addSubview(self.menuButton);
        
        self.copyButton = UIButton.buttonWithType(0);
        self.setButtonLayout(self.copyButton, "copyOutput:");
        self.copyButton.setTitleForState("复制", 0);
        self.copyButton.titleLabel.font = UIFont.systemFontOfSize(16);
        self.buttonContainer.addSubview(self.copyButton);
      }
      
      // === 添加拖动手势到标题栏 ===
      self.dragGesture = new UIPanGestureRecognizer(self, "onDragGesture:");
      self.titleBar.addGestureRecognizer(self.dragGesture);
      
      // === 添加调整大小手势到右下角 ===
      self.resizeHandle = UIView.new();
      self.resizeHandle.backgroundColor = UIColor.grayColor().colorWithAlphaComponent(0.3);
      self.resizeHandle.layer.cornerRadius = 10;
      self.view.addSubview(self.resizeHandle);
      
      self.resizeGesture = new UIPanGestureRecognizer(self, "onResizeGesture:");
      self.resizeHandle.addGestureRecognizer(self.resizeGesture);
      
      // 设置初始大小和位置
      self.view.frame = {x: 100, y: 100, width: 400, height: 300};
      self.currentFrame = self.view.frame;
      
      // 调试日志
      if (typeof MNUtil !== "undefined" && MNUtil.log) {
        MNUtil.log("✅ SimplePanelController: viewDidLoad 完成");
      }
      
      // 保存配置
      self.config = {
        selectedOption: 0
      };
    },
    
    // 布局子视图
    viewWillLayoutSubviews: function() {
      // 直接使用 self
      
      // 安全检查
      if (!self.view) return;
      
      var frame = self.view.bounds;
      if (!frame || frame.width <= 0 || frame.height <= 0) return;
      
      // 标题栏
      self.titleBar.frame = {
        x: 0,
        y: 0,
        width: frame.width,
        height: 40
      };
      
      // 标题标签
      self.titleLabel.frame = {
        x: 50,
        y: 0,
        width: frame.width - 100,
        height: 40
      };
      
      // 关闭按钮 - 右上角
      self.closeButton.frame = {
        x: frame.width - 40,
        y: 0,
        width: 40,
        height: 40
      };
      
      // 内容区域
      var contentTop = 50;
      var contentHeight = (frame.height - contentTop - 50) / 2 - 10;
      
      // 输入框
      self.inputField.frame = {
        x: 10,
        y: contentTop,
        width: frame.width - 20,
        height: contentHeight
      };
      
      // 输出框
      self.outputField.frame = {
        x: 10,
        y: contentTop + contentHeight + 10,
        width: frame.width - 20,
        height: contentHeight
      };
      
      // 按钮容器
      self.buttonContainer.frame = {
        x: 10,
        y: frame.height - 45,
        width: frame.width - 20,
        height: 40
      };
      
      // 按钮布局
      var buttonWidth = (self.buttonContainer.frame.width - 20) / 3;
      self.executeButton.frame = {
        x: 0,
        y: 0,
        width: buttonWidth,
        height: 35
      };
      
      self.menuButton.frame = {
        x: buttonWidth + 10,
        y: 0,
        width: buttonWidth,
        height: 35
      };
      
      self.copyButton.frame = {
        x: (buttonWidth + 10) * 2,
        y: 0,
        width: buttonWidth,
        height: 35
      };
      
      // 调整大小手柄
      self.resizeHandle.frame = {
        x: frame.width - 20,
        y: frame.height - 20,
        width: 20,
        height: 20
      };
    },
    
    // === 事件处理 ===
    
    closePanel: function() {
      self.view.hidden = true;
      // 刷新插件栏图标状态
      self.appInstance.studyController(self.view.window).refreshAddonCommands();
    },
    
    executeAction: function() {
      var text = self.inputField.text;
      
      // 示例功能：转换为大写
      var result = text.toUpperCase();
      self.outputField.text = result;
      
      if (typeof MNUtil !== "undefined") {
        // 使用 MNUtils API
        MNUtil.showHUD("已执行转换");
        
        // 示例：如果有选中的笔记，添加评论
        var focusNote = MNNote.getFocusNote();
        if (focusNote) {
          MNUtil.undoGrouping(function() {
            focusNote.appendTextComment("处理结果: " + result);
          });
        }
      } else {
        // 降级方案
        self.showHUD("已执行转换");
      }
    },
    
    showMenu: function(sender) {
      
      if (typeof Menu !== "undefined") {
        // 使用 MNUtils 的 Menu 类
        var menu = new Menu(sender, self, 200, 2);
        menu.addMenuItem("转大写", "menuAction:", 0, self.config.selectedOption === 0);
        menu.addMenuItem("转小写", "menuAction:", 1, self.config.selectedOption === 1);
        menu.addMenuItem("首字母大写", "menuAction:", 2, self.config.selectedOption === 2);
        menu.addMenuItem("反转文本", "menuAction:", 3, self.config.selectedOption === 3);
        
        // Menu 类的高级功能
        menu.rowHeight = 40;  // 自定义行高
        menu.fontSize = 16;   // 自定义字体大小
        
        menu.show();
        
        // 保存菜单引用以便后续关闭
        self.currentMenu = menu;
      } else {
        // 降级方案：使用原生 MenuController
        var menuController = MenuController.new();
        menuController.commandTable = [
          {title: '转大写', object: self, selector: 'menuAction:', param: 0, checked: self.config.selectedOption === 0},
          {title: '转小写', object: self, selector: 'menuAction:', param: 1, checked: self.config.selectedOption === 1},
          {title: '首字母大写', object: self, selector: 'menuAction:', param: 2, checked: self.config.selectedOption === 2},
          {title: '反转文本', object: self, selector: 'menuAction:', param: 3, checked: self.config.selectedOption === 3}
        ];
        menuController.rowHeight = 35;
        menuController.preferredContentSize = {
          width: 200,
          height: menuController.rowHeight * 4
        };
        
        self.popoverController = new UIPopoverController(menuController);
        var studyController = self.appInstance.studyController(self.view.window);
        var rect = sender.convertRectToView(sender.bounds, studyController.view);
        self.popoverController.presentPopoverFromRect(rect, studyController.view, 1 << 1, true);
      }
    },
    
    menuAction: function(option) {
      self.config.selectedOption = option;
      
      // 根据选项处理文本
      var text = self.inputField.text;
      var result = "";
      
      switch (option) {
        case 0: // 转大写
          result = text.toUpperCase();
          break;
        case 1: // 转小写
          result = text.toLowerCase();
          break;
        case 2: // 首字母大写
          result = text.replace(/\b\w/g, function(l) { return l.toUpperCase(); });
          break;
        case 3: // 反转文本
          result = text.split('').reverse().join('');
          break;
      }
      
      self.outputField.text = result;
      
      // 关闭菜单
      if (typeof Menu !== "undefined" && self.currentMenu) {
        self.currentMenu.dismiss();
        self.currentMenu = null;
      } else if (self.popoverController) {
        self.popoverController.dismissPopoverAnimated(true);
      }
      
      if (typeof MNUtil !== "undefined") {
        MNUtil.showHUD("已选择: " + ["转大写", "转小写", "首字母大写", "反转文本"][option]);
      } else {
        self.showHUD("已选择: " + ["转大写", "转小写", "首字母大写", "反转文本"][option]);
      }
    },
    
    copyOutput: function() {
      var text = self.outputField.text;
      
      UIPasteboard.generalPasteboard().string = text;
      
      if (typeof MNUtil !== "undefined") {
        MNUtil.showHUD("已复制到剪贴板");
      } else {
        self.showHUD("已复制到剪贴板");
      }
    },
    
    // 清空输出（长按复制按钮触发）
    clearOutput: function() {
      self.outputField.text = "";
      self.inputField.text = "";
      
      if (typeof MNUtil !== "undefined") {
        MNUtil.showHUD("已清空内容");
      } else {
        self.showHUD("已清空内容");
      }
    },
    
    // === 手势处理 ===
    
    onDragGesture: function(gesture) {
      
      if (gesture.state === 1) { // Began
        self.dragOffset = gesture.locationInView(self.view);
      } else if (gesture.state === 2) { // Changed
        var location = gesture.locationInView(self.view.superview);
        var newX = location.x - self.dragOffset.x;
        var newY = location.y - self.dragOffset.y;
        
        // 限制在屏幕范围内
        var superBounds = self.view.superview.bounds;
        newX = Math.max(0, Math.min(newX, superBounds.width - self.view.frame.width));
        newY = Math.max(0, Math.min(newY, superBounds.height - self.view.frame.height));
        
        self.view.frame = {
          x: newX,
          y: newY,
          width: self.view.frame.width,
          height: self.view.frame.height
        };
        
        self.currentFrame = self.view.frame;
      }
    },
    
    onResizeGesture: function(gesture) {
      var location = gesture.locationInView(self.view);
      var width = Math.max(300, location.x);
      var height = Math.max(200, location.y);
      
      self.view.frame = {
        x: self.view.frame.x,
        y: self.view.frame.y,
        width: width,
        height: height
      };
      
      self.currentFrame = self.view.frame;
    },
    
    // === 辅助方法 ===
    
    showHUD: function(message) {
      self.appInstance.showHUD(message, self.view.window, 2);
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
};