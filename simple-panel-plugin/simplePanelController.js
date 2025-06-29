// 修复版本 - 基于正常工作的版本
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
      
      // === 直接初始化配置，避免方法调用问题 ===
      // 从持久化存储加载配置
      const savedConfig = NSUserDefaults.standardUserDefaults().objectForKey("SimplePanel_Config");
      const defaultConfig = {
        mode: 0,  // 0:转大写 1:转小写 2:首字母大写 3:反转
        saveHistory: true,
        inputText: "在这里输入文本...",
        outputText: "处理结果..."
      };
      
      if (savedConfig) {
        // 合并保存的配置和默认配置（确保新增的配置项有默认值）
        self.config = Object.assign({}, defaultConfig, savedConfig);
      } else {
        self.config = defaultConfig;
      }
      
      // 尝试从 iCloud 同步配置（如果支持）
      if (typeof MNUtil !== "undefined" && MNUtil.readCloudKey) {
        try {
          const cloudConfig = MNUtil.readCloudKey("SimplePanel_Config");
          if (cloudConfig) {
            const parsedCloudConfig = JSON.parse(cloudConfig);
            self.config = Object.assign({}, self.config, parsedCloudConfig);
          }
        } catch (e) {
          // 忽略 iCloud 读取错误
        }
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
      self.inputField.delegate = self;  // 设置代理以捕获文本变化
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
      } else {
        // 降级方案：使用普通 UIButton
        const tools = [
          { icon: "🔄", action: "processText:" },
          { icon: "📋", action: "copyOutput:" },
          { icon: "🔧", action: "showModeMenu:" },
          { icon: "📝", action: "insertToNote:" },
          { icon: "🕐", action: "showHistory:" }
        ];
        
        self.toolButtons = [];
        tools.forEach((tool) => {
          const btn = UIButton.buttonWithType(0);
          btn.setTitleForState(tool.icon, 0);
          btn.titleLabel.font = UIFont.systemFontOfSize(22);
          btn.backgroundColor = UIColor.clearColor();
          btn.layer.cornerRadius = 18;
          btn.addTargetActionForControlEvents(self, tool.action, 1 << 6);
          self.toolbar.addSubview(btn);
          self.toolButtons.push(btn);
        });
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
      
      // 初始化状态
      self.isMinimized = false;
      
      // 加载历史记录
      self.history = [];
      try {
        const savedHistory = NSUserDefaults.standardUserDefaults().objectForKey("SimplePanel_History");
        if (savedHistory && Array.isArray(savedHistory)) {
          self.history = savedHistory;
          if (typeof MNUtil !== "undefined" && MNUtil.log) {
            MNUtil.log("📝 已加载历史记录: " + self.history.length + " 条");
          }
        }
      } catch (error) {
        if (typeof MNUtil !== "undefined" && MNUtil.log) {
          MNUtil.log("❌ 加载历史记录失败: " + error.message);
        }
      }
      
      // 根据配置恢复文本框内容
      if (self.config.inputText && self.config.inputText !== "在这里输入文本...") {
        self.inputField.text = self.config.inputText;
      }
      if (self.config.outputText && self.config.outputText !== "处理结果...") {
        self.outputField.text = self.config.outputText;
      }
      
      if (typeof MNUtil !== "undefined" && MNUtil.log) {
        MNUtil.log("📋 已恢复配置和历史记录");
      }
      
      
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
        x: 105,
        y: 0,
        width: frame.width - 210,
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
      if (!self.isMinimized) {
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
    
    // 视图将要消失时保存配置
    viewWillDisappear: function() {
      // 直接保存配置，不调用方法
      try {
        // 更新文本框内容到配置
        if (self.inputField && self.inputField.text !== "在这里输入文本...") {
          self.config.inputText = self.inputField.text;
        }
        if (self.outputField) {
          self.config.outputText = self.outputField.text;
        }
        
        NSUserDefaults.standardUserDefaults().setObjectForKey(self.config, "SimplePanel_Config");
        NSUserDefaults.standardUserDefaults().synchronize();
        
        if (typeof MNUtil !== "undefined" && MNUtil.log) {
          MNUtil.log("💾 视图关闭时保存配置");
        }
      } catch (e) {
        // 忽略错误
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
        
        const menuItems = [
          { title: "保存历史", selector: "toggleSaveHistory:", checked: self.config.saveHistory },
          { title: "────────", selector: "", param: "" },
          { title: "清空历史", selector: "clearHistory:" },
          { title: "导出配置", selector: "exportConfig:" },
          { title: "导入配置", selector: "importConfig:" }
        ];
        
        menu.addMenuItems(menuItems);
        menu.rowHeight = 40;
        menu.show();
      }
    },
    
    resetSettings: function() {
      self.config = {
        mode: 0,
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
      try {
        var text = self.inputField.text;
        var result = "";
        
        if (typeof MNUtil !== "undefined" && MNUtil.log) {
          MNUtil.log("🔄 processText - 输入文本: " + text + ", 模式: " + self.config.mode);
        }
        
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
          
          // 直接保存历史记录（避免方法调用问题）
          try {
            const historyToSave = self.history.slice(-100);
            NSUserDefaults.standardUserDefaults().setObjectForKey(historyToSave, "SimplePanel_History");
            NSUserDefaults.standardUserDefaults().synchronize();
          } catch (e) {
            // 忽略错误
          }
        }
        
        // 更新状态指示器
        if (self.statusIndicator) {
          self.statusIndicator.backgroundColor = "#4CAF50";
          NSTimer.scheduledTimerWithTimeInterval(0.5, false, () => {
            self.statusIndicator.backgroundColor = "#00000020";
          });
        }
        
        // 显示处理完成提示
        if (typeof MNUtil !== "undefined") {
          MNUtil.showHUD("处理完成");
        }
      } catch (error) {
        if (typeof MNUtil !== "undefined") {
          MNUtil.addErrorLog(error, "processText", {mode: self.config.mode});
          MNUtil.showHUD("处理失败：" + error.message);
        }
      }
    },
    
    showModeMenu: function(sender) {
      if (typeof Menu !== "undefined") {
        const menu = new Menu(sender, self, 200, 2);
        
        const modes = [
          { title: "转大写 (ABC)", selector: "setMode:", param: 0, checked: self.config.mode === 0 },
          { title: "转小写 (abc)", selector: "setMode:", param: 1, checked: self.config.mode === 1 },
          { title: "首字母大写 (Abc)", selector: "setMode:", param: 2, checked: self.config.mode === 2 },
          { title: "反转文本 (⇄)", selector: "setMode:", param: 3, checked: self.config.mode === 3 }
        ];
        
        menu.addMenuItems(modes);
        
        menu.rowHeight = 45;
        menu.fontSize = 16;
        menu.show();
      }
    },
    
    setMode: function(mode) {
      self.config.mode = mode;
      
      // 直接保存配置（避免方法调用问题）
      try {
        // 更新文本框内容到配置
        if (self.inputField && self.inputField.text !== "在这里输入文本...") {
          self.config.inputText = self.inputField.text;
        }
        if (self.outputField) {
          self.config.outputText = self.outputField.text;
        }
        
        NSUserDefaults.standardUserDefaults().setObjectForKey(self.config, "SimplePanel_Config");
        NSUserDefaults.standardUserDefaults().synchronize();
      } catch (e) {
        // 忽略错误
      }
      
      // 先关闭菜单，再显示 HUD
      if (typeof Menu !== "undefined") {
        Menu.dismissCurrentMenu();
      }
      
      // 延迟显示反馈，确保菜单先关闭
      const modeNames = ["转大写", "转小写", "首字母大写", "反转文本"];
      NSTimer.scheduledTimerWithTimeInterval(0.1, false, () => {
        if (typeof MNUtil !== "undefined") {
          MNUtil.showHUD("已切换到: " + modeNames[mode]);
        }
      });
    },
    
    copyOutput: function() {
      var text = self.outputField.text;
      
      if (typeof MNUtil !== "undefined" && MNUtil.copy) {
        MNUtil.copy(text);
        MNUtil.showHUD("已复制到剪贴板");
      } else {
        UIPasteboard.generalPasteboard().string = text;
      }
    },
    
    insertToNote: function() {
      if (typeof MNNote === "undefined") {
        if (typeof MNUtil !== "undefined") {
          MNUtil.showHUD("需要安装 MNUtils");
        }
        return;
      }
      
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
      if (typeof Menu !== "undefined") {
        const menu = new Menu(sender, self, 300, 2);
        
        if (self.history.length > 0) {
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
        } else {
          menu.addMenuItem("暂无历史记录", "", "", false);
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
        
        // 关闭菜单
        if (typeof Menu !== "undefined") {
          Menu.dismissCurrentMenu();
        }
        
        // 显示反馈
        if (typeof MNUtil !== "undefined") {
          MNUtil.showHUD("已加载历史记录");
        }
      }
    },
    
    showTooltip: function(sender) {
      if (sender.tooltipText && typeof MNUtil !== "undefined") {
        MNUtil.showHUD(sender.tooltipText);
      }
    },
    
    // === 设置相关 ===
    
    toggleSaveHistory: function() {
      self.config.saveHistory = !self.config.saveHistory;
      
      // 直接保存配置
      try {
        NSUserDefaults.standardUserDefaults().setObjectForKey(self.config, "SimplePanel_Config");
        NSUserDefaults.standardUserDefaults().synchronize();
      } catch (e) {
        // 忽略错误
      }
      
      if (typeof Menu !== "undefined") {
        Menu.dismissCurrentMenu();
      }
      
      if (typeof MNUtil !== "undefined") {
        MNUtil.showHUD("保存历史: " + (self.config.saveHistory ? "已开启" : "已关闭"));
      }
    },
    
    clearHistory: function() {
      self.history = [];
      
      // 直接保存空历史
      try {
        NSUserDefaults.standardUserDefaults().setObjectForKey([], "SimplePanel_History");
        NSUserDefaults.standardUserDefaults().synchronize();
      } catch (e) {
        // 忽略错误
      }
      
      if (typeof Menu !== "undefined") {
        Menu.dismissCurrentMenu();
      }
      
      if (typeof MNUtil !== "undefined") {
        MNUtil.showHUD("历史已清空");
      }
    },
    
    exportConfig: function() {
      const configStr = JSON.stringify(self.config, null, 2);
      
      if (typeof Menu !== "undefined") {
        Menu.dismissCurrentMenu();
      }
      
      if (typeof MNUtil !== "undefined" && MNUtil.copy) {
        MNUtil.copy(configStr);
        MNUtil.showHUD("配置已复制到剪贴板");
      } else {
        UIPasteboard.generalPasteboard().string = configStr;
      }
    },
    
    importConfig: function() {
      if (typeof Menu !== "undefined") {
        Menu.dismissCurrentMenu();
      }
      
      try {
        const configStr = (typeof MNUtil !== "undefined" && MNUtil.clipboardText) ? 
          MNUtil.clipboardText : UIPasteboard.generalPasteboard().string;
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
    },
    
    showAllHistory: function() {
      // 可以在这里实现更完整的历史记录查看界面
      if (typeof MNUtil !== "undefined") {
        MNUtil.showHUD("共有 " + self.history.length + " 条历史记录");
      }
    },
    
    // === TextView 代理方法 ===
    
    textViewShouldBeginEditing: function(textView) {
      // 清除占位文本
      if (textView === self.inputField && textView.text === "在这里输入文本...") {
        textView.text = "";
      }
      return true;
    },
    
    textViewShouldEndEditing: function(textView) {
      // 恢复占位文本
      if (textView === self.inputField && textView.text === "") {
        textView.text = "在这里输入文本...";
      }
      return true;
    },
    
    textViewDidChange: function() {
      // 文本变化时不自动保存，避免方法调用问题
      // 用户可以通过其他操作（如切换模式）来保存
    },
    
    // === 辅助方法 ===
    
    // 清理方法
    dealloc: function() {
      // 目前无需清理
    }
  }
);