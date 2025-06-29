// 优化版本 - 展示 MNButton 和 Menu 的高级用法
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
        MNUtil.log("🎨 SimplePanelController: viewDidLoad - 开始创建界面");
      }
      
      // === 设置面板样式 ===
      self.view.layer.shadowOffset = {width: 0, height: 0};
      self.view.layer.shadowRadius = 15;
      self.view.layer.shadowOpacity = 0.5;
      self.view.layer.cornerRadius = 11;
      self.view.backgroundColor = UIColor.whiteColor().colorWithAlphaComponent(0.9);
      
      // 设置初始大小和位置
      self.view.frame = {x: 100, y: 100, width: 400, height: 350};
      self.currentFrame = self.view.frame;
      
      // === 创建标题栏 ===
      self.titleBar = UIView.new();
      self.titleBar.backgroundColor = UIColor.colorWithHexString("#5982c4");
      self.view.addSubview(self.titleBar);
      
      // 标题标签
      self.titleLabel = UILabel.new();
      self.titleLabel.text = "文本处理工具";
      self.titleLabel.textColor = UIColor.whiteColor();
      self.titleLabel.font = UIFont.boldSystemFontOfSize(16);
      self.titleLabel.textAlignment = 1;
      self.titleBar.addSubview(self.titleLabel);
      
      if (typeof MNButton !== "undefined") {
        // === 使用 MNButton 创建关闭按钮 ===
        self.closeButton = MNButton.new({
          title: "✕",
          font: 20,
          color: "#00000000",
          radius: 15,
          highlight: UIColor.redColor().colorWithAlphaComponent(0.3)
        }, self.titleBar);
        
        self.closeButton.addClickAction(self, "closePanel:");
        
        // === 创建设置按钮 ===
        self.settingsButton = MNButton.new({
          title: "⚙",
          font: 20,
          color: "#00000000",
          radius: 15
        }, self.titleBar);
        
        self.settingsButton.addClickAction(self, "showSettings:");
        self.settingsButton.addLongPressGesture(self, "resetSettings:", 1.0);
        
        // === 创建最小化按钮 ===
        self.minimizeButton = MNButton.new({
          title: "−",
          font: 20,
          color: "#00000000",
          radius: 15
        }, self.titleBar);
        
        self.minimizeButton.addClickAction(self, "toggleMinimize:");
      } else {
        // 降级方案
        self.closeButton = UIButton.buttonWithType(0);
        self.closeButton.setTitleForState("✕", 0);
        self.closeButton.titleLabel.font = UIFont.systemFontOfSize(20);
        self.closeButton.backgroundColor = UIColor.clearColor();
        self.closeButton.addTargetActionForControlEvents(self, "closePanel:", 1 << 6);
        self.titleBar.addSubview(self.closeButton);
      }
      
      // 添加拖动手势
      self.dragGesture = new UIPanGestureRecognizer(self, "onDragGesture:");
      self.titleBar.addGestureRecognizer(self.dragGesture);
      
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
      self.outputField.text = "处理结果...";
      self.outputField.textContainerInset = {top: 8, left: 8, bottom: 8, right: 8};
      self.outputField.editable = false;
      self.view.addSubview(self.outputField);
      
      // === 创建底部工具栏 ===
      self.toolbar = UIView.new();
      self.toolbar.backgroundColor = UIColor.colorWithHexString("#f0f0f0");
      self.toolbar.layer.cornerRadius = 8;
      self.view.addSubview(self.toolbar);
      
      if (typeof MNButton !== "undefined") {
        // === 创建工具按钮组 ===
        const tools = [
          { icon: "🔄", action: "processText:", tooltip: "处理文本" },
          { icon: "📋", action: "copyOutput:", tooltip: "复制结果" },
          { icon: "🔧", action: "showModeMenu:", tooltip: "选择模式" },
          { icon: "📝", action: "insertToNote:", tooltip: "插入到笔记" },
          { icon: "🕐", action: "showHistory:", tooltip: "历史记录" }
        ];
        
        self.toolButtons = tools.map((tool, index) => {
          const btn = MNButton.new({
            title: tool.icon,
            font: 22,
            color: "#00000000",
            radius: 18,
            opacity: 0.8
          }, self.toolbar);
          
          btn.addClickAction(self, tool.action);
          
          // 添加长按显示提示
          btn.addLongPressGesture(self, "showTooltip:", 0.3);
          btn.tooltipText = tool.tooltip;
          btn.toolIndex = index;
          
          return btn;
        });
        
        // === 创建状态指示器 ===
        self.statusIndicator = MNButton.new({
          title: "•",
          font: 16,
          color: "#4CAF50",
          radius: 8,
          opacity: 0.6
        }, self.toolbar);
      }
      
      // === 创建调整大小手柄 ===
      if (typeof MNButton !== "undefined") {
        // 使用 MNButton 创建可视化的调整手柄
        self.resizeHandle = MNButton.new({
          title: "⋮⋮",
          font: 12,
          color: "#00000020",
          radius: 10,
          opacity: 1.0
        }, self.view);
        
        self.resizeHandle.addPanGesture(self, "onResizeGesture:");
      } else {
        // 降级方案
        self.resizeHandle = UIView.new();
        self.resizeHandle.backgroundColor = UIColor.grayColor().colorWithAlphaComponent(0.3);
        self.resizeHandle.layer.cornerRadius = 10;
        self.view.addSubview(self.resizeHandle);
        
        self.resizeGesture = new UIPanGestureRecognizer(self, "onResizeGesture:");
        self.resizeHandle.addGestureRecognizer(self.resizeGesture);
      }
      
      // 初始化配置
      self.config = {
        mode: 0,  // 0:转大写 1:转小写 2:首字母大写 3:反转
        autoProcess: false,
        saveHistory: true
      };
      
      // 处理历史记录
      self.history = [];
      self.isMinimized = false;
      
      if (typeof MNUtil !== "undefined" && MNUtil.log) {
        MNUtil.log("✅ SimplePanelController: 界面创建完成");
      }
    },
    
    // === 布局 ===
    viewWillLayoutSubviews: function() {
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
      
      // 标题栏内的元素
      self.titleLabel.frame = {
        x: 50,
        y: 0,
        width: frame.width - 100,
        height: 40
      };
      
      if (self.closeButton) {
        self.closeButton.frame = {
          x: frame.width - 35,
          y: 5,
          width: 30,
          height: 30
        };
      }
      
      if (self.settingsButton) {
        self.settingsButton.frame = {
          x: frame.width - 70,
          y: 5,
          width: 30,
          height: 30
        };
      }
      
      if (self.minimizeButton) {
        self.minimizeButton.frame = {
          x: 5,
          y: 5,
          width: 30,
          height: 30
        };
      }
      
      // 内容区域
      var contentTop = 50;
      var toolbarHeight = 50;
      var contentHeight = (frame.height - contentTop - toolbarHeight - 10) / 2 - 5;
      
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
      
      // 工具栏
      self.toolbar.frame = {
        x: 10,
        y: frame.height - toolbarHeight - 5,
        width: frame.width - 20,
        height: toolbarHeight - 5
      };
      
      // 工具按钮布局
      if (self.toolButtons) {
        var buttonSize = 36;
        var spacing = 10;
        var totalWidth = self.toolButtons.length * buttonSize + (self.toolButtons.length - 1) * spacing;
        var startX = (self.toolbar.frame.width - totalWidth) / 2;
        
        self.toolButtons.forEach((btn, index) => {
          btn.frame = {
            x: startX + index * (buttonSize + spacing),
            y: 4,
            width: buttonSize,
            height: buttonSize
          };
        });
      }
      
      // 状态指示器
      if (self.statusIndicator) {
        self.statusIndicator.frame = {
          x: 10,
          y: 10,
          width: 16,
          height: 16
        };
      }
      
      // 调整大小手柄
      if (self.resizeHandle) {
        self.resizeHandle.frame = {
          x: frame.width - 25,
          y: frame.height - 25,
          width: 25,
          height: 25
        };
      }
    },
    
    // === 事件处理 ===
    
    closePanel: function() {
      self.view.hidden = true;
      self.appInstance.studyController(self.view.window).refreshAddonCommands();
    },
    
    showSettings: function(sender) {
      if (typeof Menu !== "undefined") {
        const menu = new Menu(sender, self, 250, 2);
        
        menu.addMenuItem("自动处理", "toggleAutoProcess:", "", self.config.autoProcess);
        menu.addMenuItem("保存历史", "toggleSaveHistory:", "", self.config.saveHistory);
        menu.addMenuItem("────────", "", "", false);
        menu.addMenuItem("清空历史", "clearHistory:");
        menu.addMenuItem("导出配置", "exportConfig:");
        menu.addMenuItem("导入配置", "importConfig:");
        
        menu.rowHeight = 40;
        menu.show();
      }
    },
    
    resetSettings: function() {
      self.config = {
        mode: 0,
        autoProcess: false,
        saveHistory: true
      };
      
      if (typeof MNUtil !== "undefined") {
        MNUtil.showHUD("设置已重置");
      }
    },
    
    toggleMinimize: function() {
      self.isMinimized = !self.isMinimized;
      
      if (typeof MNUtil !== "undefined" && MNUtil.animate) {
        MNUtil.animate(() => {
          if (self.isMinimized) {
            self.view.frame = {
              x: self.view.frame.x,
              y: self.view.frame.y,
              width: 200,
              height: 40
            };
            self.inputField.hidden = true;
            self.outputField.hidden = true;
            self.toolbar.hidden = true;
          } else {
            self.view.frame = self.currentFrame;
            self.inputField.hidden = false;
            self.outputField.hidden = false;
            self.toolbar.hidden = false;
          }
        }, 0.25);
      } else {
        // 降级方案
        if (self.isMinimized) {
          self.view.frame = {
            x: self.view.frame.x,
            y: self.view.frame.y,
            width: 200,
            height: 40
          };
          self.inputField.hidden = true;
          self.outputField.hidden = true;
          self.toolbar.hidden = true;
        } else {
          self.view.frame = self.currentFrame;
          self.inputField.hidden = false;
          self.outputField.hidden = false;
          self.toolbar.hidden = false;
        }
      }
    },
    
    processText: function() {
      var text = self.inputField.text;
      var result = "";
      
      switch (self.config.mode) {
        case 0: // 转大写
          result = text.toUpperCase();
          break;
        case 1: // 转小写
          result = text.toLowerCase();
          break;
        case 2: // 首字母大写
          result = text.replace(/\b\w/g, l => l.toUpperCase());
          break;
        case 3: // 反转文本
          result = text.split('').reverse().join('');
          break;
      }
      
      self.outputField.text = result;
      
      // 保存到历史
      if (self.config.saveHistory && result) {
        self.history.push({
          input: text,
          output: result,
          mode: self.config.mode,
          time: new Date()
        });
      }
      
      // 更新状态指示器
      if (self.statusIndicator) {
        self.statusIndicator.backgroundColor = "#4CAF50";
        NSTimer.scheduledTimerWithTimeInterval(0.5, false, () => {
          self.statusIndicator.backgroundColor = "#00000020";
        });
      }
      
      if (typeof MNUtil !== "undefined") {
        MNUtil.showHUD("处理完成");
      }
    },
    
    showModeMenu: function(sender) {
      if (typeof Menu !== "undefined") {
        const menu = new Menu(sender, self, 200, 2);
        
        const modes = [
          { title: "转大写 (ABC)", value: 0 },
          { title: "转小写 (abc)", value: 1 },
          { title: "首字母大写 (Abc)", value: 2 },
          { title: "反转文本 (⇄)", value: 3 }
        ];
        
        modes.forEach(mode => {
          menu.addMenuItem(mode.title, "setMode:", mode.value, self.config.mode === mode.value);
        });
        
        menu.rowHeight = 45;
        menu.fontSize = 16;
        menu.show();
      }
    },
    
    setMode: function(mode) {
      self.config.mode = mode;
      
      // 如果开启了自动处理
      if (self.config.autoProcess) {
        self.processText();
      }
    },
    
    copyOutput: function() {
      var text = self.outputField.text;
      UIPasteboard.generalPasteboard().string = text;
      
      if (typeof MNUtil !== "undefined") {
        MNUtil.showHUD("已复制到剪贴板");
      }
    },
    
    insertToNote: function() {
      if (typeof MNNote === "undefined") return;
      
      var focusNote = MNNote.getFocusNote();
      if (focusNote) {
        MNUtil.undoGrouping(() => {
          focusNote.appendTextComment(self.outputField.text);
        });
        MNUtil.showHUD("已插入到笔记");
      } else {
        MNUtil.showHUD("请先选择一个笔记");
      }
    },
    
    showHistory: function(sender) {
      if (typeof Menu !== "undefined" && self.history.length > 0) {
        const menu = new Menu(sender, self, 300, 2);
        
        // 显示最近10条历史
        const recentHistory = self.history.slice(-10).reverse();
        
        recentHistory.forEach((item, index) => {
          const preview = item.output.substring(0, 30) + (item.output.length > 30 ? "..." : "");
          menu.addMenuItem(preview, "loadFromHistory:", self.history.length - 1 - index);
        });
        
        if (self.history.length > 10) {
          menu.addMenuItem("────────", "", "", false);
          menu.addMenuItem("查看全部 (" + self.history.length + " 条)", "showAllHistory:");
        }
        
        menu.rowHeight = 35;
        menu.show();
      } else {
        if (typeof MNUtil !== "undefined") {
          MNUtil.showHUD("暂无历史记录");
        }
      }
    },
    
    loadFromHistory: function(index) {
      const item = self.history[index];
      if (item) {
        self.inputField.text = item.input;
        self.outputField.text = item.output;
        self.config.mode = item.mode;
      }
    },
    
    showTooltip: function(sender) {
      if (sender.tooltipText && typeof MNUtil !== "undefined") {
        MNUtil.showHUD(sender.tooltipText);
      }
    },
    
    // === 设置相关 ===
    
    toggleAutoProcess: function() {
      self.config.autoProcess = !self.config.autoProcess;
      Menu.dismissCurrentMenu();
      
      if (typeof MNUtil !== "undefined") {
        MNUtil.showHUD("自动处理: " + (self.config.autoProcess ? "开启" : "关闭"));
      }
    },
    
    toggleSaveHistory: function() {
      self.config.saveHistory = !self.config.saveHistory;
      Menu.dismissCurrentMenu();
      
      if (typeof MNUtil !== "undefined") {
        MNUtil.showHUD("保存历史: " + (self.config.saveHistory ? "开启" : "关闭"));
      }
    },
    
    clearHistory: function() {
      self.history = [];
      Menu.dismissCurrentMenu();
      
      if (typeof MNUtil !== "undefined") {
        MNUtil.showHUD("历史已清空");
      }
    },
    
    exportConfig: function() {
      const configStr = JSON.stringify(self.config, null, 2);
      UIPasteboard.generalPasteboard().string = configStr;
      
      if (typeof MNUtil !== "undefined") {
        MNUtil.showHUD("配置已复制到剪贴板");
      }
    },
    
    importConfig: function() {
      try {
        const configStr = UIPasteboard.generalPasteboard().string;
        const newConfig = JSON.parse(configStr);
        
        if (newConfig && typeof newConfig === "object") {
          self.config = Object.assign(self.config, newConfig);
          
          if (typeof MNUtil !== "undefined") {
            MNUtil.showHUD("配置导入成功");
          }
        }
      } catch (e) {
        if (typeof MNUtil !== "undefined") {
          MNUtil.showHUD("配置导入失败");
        }
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
        
        if (!self.isMinimized) {
          self.currentFrame = self.view.frame;
        }
      }
    },
    
    onResizeGesture: function(gesture) {
      if (self.isMinimized) return;
      
      var location = gesture.locationInView(self.view);
      var width = Math.max(300, location.x);
      var height = Math.max(250, location.y);
      
      self.view.frame = {
        x: self.view.frame.x,
        y: self.view.frame.y,
        width: width,
        height: height
      };
      
      self.currentFrame = self.view.frame;
      
      // 实时更新布局
      self.viewWillLayoutSubviews();
    }
  }
);