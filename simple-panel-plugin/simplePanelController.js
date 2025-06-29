// 改进版本 - 使用高级配置管理器
// 尝试加载 MNUtils（如果可用）
try {
  JSB.require('mnutils');
} catch (e) {
  // MNUtils 不可用，使用降级方案
}

// 加载配置管理器
JSB.require('configManager');

var SimplePanelController = JSB.defineClass(
  'SimplePanelController : UIViewController',
  {
    // 视图加载完成
    viewDidLoad: function() {
      self.appInstance = Application.sharedInstance();
      
      // 初始化 MNUtil（如果可用）
      if (typeof MNUtil !== "undefined") {
        if (self.mainPath) {
          MNUtil.init(self.mainPath);
        }
        MNUtil.log("🎨 SimplePanelController: viewDidLoad - 开始创建界面");
      }
      
      // === 初始化配置管理器 ===
      configManager.init();
      
      // 从配置管理器获取配置
      self.config = configManager.config;
      
      // 模式定义
      self.modes = {
        textProcessor: {
          title: "文本处理工具",
          inputPlaceholder: "在这里输入文本...",
          outputPlaceholder: "处理结果...",
          showToolbar: true,
          showOutput: true
        },
        quickNote: {
          title: "快速笔记",
          inputPlaceholder: "在这里输入笔记内容...",
          outputPlaceholder: "笔记预览...",
          showToolbar: true,
          showOutput: false
        },
        searchReplace: {
          title: "搜索替换",
          inputPlaceholder: "搜索内容...",
          outputPlaceholder: "替换结果...",
          showToolbar: true,
          showOutput: true
        }
      };
      
      // 当前模式
      self.currentMode = "textProcessor";
      
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
      
      // 添加双击最小化手势
      self.doubleTapGesture = new UITapGestureRecognizer(self, "handleDoubleTap:");
      self.doubleTapGesture.numberOfTapsRequired = 2;
      self.titleBar.addGestureRecognizer(self.doubleTapGesture);
      
      // 标题标签
      self.titleLabel = UILabel.new();
      self.titleLabel.text = self.modes.textProcessor.title;
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
        // 暂时移除长按手势以避免干扰点击响应
        // self.settingsButton.addLongPressGesture(self, "resetSettings:", 3.0);
        
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
      self.inputField.text = configManager.get("inputText", self.modes.textProcessor.inputPlaceholder);
      self.inputField.textContainerInset = {top: 8, left: 8, bottom: 8, right: 8};
      self.inputField.delegate = self;  // 设置代理以捕获文本变化
      self.view.addSubview(self.inputField);
      
      // === 创建输出框 ===
      self.outputField = UITextView.new();
      self.outputField.font = UIFont.systemFontOfSize(16);
      self.outputField.layer.cornerRadius = 8;
      self.outputField.backgroundColor = UIColor.grayColor().colorWithAlphaComponent(0.2);
      self.outputField.text = configManager.get("outputText", self.modes.textProcessor.outputPlaceholder);
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
          { icon: "🔄", action: "processText:", tooltip: "处理/保存" },
          { icon: "📋", action: "copyOutput:", tooltip: "复制结果" },
          { icon: "🔧", action: "showModeMenu:", tooltip: "选择模式" },
          { icon: "📝", action: "insertToNote:", tooltip: "插入笔记" },
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
      // 使用配置管理器保存
      if (self.inputField && self.inputField.text !== "在这里输入文本...") {
        configManager.set("inputText", self.inputField.text, false);
      }
      if (self.outputField) {
        configManager.set("outputText", self.outputField.text, false);
      }
      
      configManager.save();
      
      if (typeof MNUtil !== "undefined" && MNUtil.log) {
        MNUtil.log("💾 视图关闭时保存配置");
      }
    },
    
    // 视图出现时
    viewWillAppear: function() {
      // 注意：动画现在在 main.js 中处理，避免冲突
      // 这里只做必要的初始化
      if (typeof MNUtil !== "undefined" && MNUtil.log) {
        MNUtil.log("📱 SimplePanelController: viewWillAppear");
      }
    },
    
    // === 显示/隐藏方法 - 参考 mnai 项目 ===
    
    show: function() {
      // 参考 mnai 的 chatglmController.show 实现
      if (typeof MNUtil !== "undefined") {
        // 确保视图在最前面
        MNUtil.studyView.bringSubviewToFront(self.view);
      }
      
      // 显示视图
      self.view.hidden = false;
      self.view.alpha = 1;
      
      // 确保 layer 正常
      self.view.layer.opacity = 1.0;
      
      if (typeof MNUtil !== "undefined" && MNUtil.log) {
        MNUtil.log("🎭 SimplePanelController: show 方法被调用");
      }
    },
    
    hide: function() {
      // 参考 mnai 的 chatglmController.hide 实现
      self.view.hidden = true;
      
      if (typeof MNUtil !== "undefined" && MNUtil.log) {
        MNUtil.log("🎭 SimplePanelController: hide 方法被调用");
      }
    },
    
    // === 事件处理 ===
    
    closePanel: function() {
      // 立即关闭，无延迟 - 参考 mnai 实现
      self.view.hidden = true;
      
      if (typeof MNUtil !== "undefined" && MNUtil.log) {
        MNUtil.log("🚪 SimplePanelController: 面板已关闭");
      }
      
      // 刷新插件命令不使用延迟
      try {
        if (self.appInstance) {
          self.appInstance.studyController(self.view.window).refreshAddonCommands();
        }
      } catch (e) {
        // 忽略错误
      }
    },
    
    showSettings: function(sender) {
      if (typeof Menu !== "undefined") {
        // 修复 convertRectToView 错误 - 使用设置按钮作为 sender
        const button = self.settingsButton || sender;
        const menu = new Menu(button, self, 250, 2);
        
        const menuItems = [
          { title: configManager.get("saveHistory") ? "✓ 保存历史" : "  保存历史", selector: "toggleSaveHistory:" },
          { title: "────────", selector: "", param: "" },
          { title: "云同步设置", selector: "showSyncSettings:" },
          { title: "清空历史", selector: "clearHistory:" },
          { title: "导出配置", selector: "exportConfig:" },
          { title: "导入配置", selector: "importConfig:" }
        ];
        
        menu.addMenuItems(menuItems);
        menu.rowHeight = 40;
        menu.show();
      }
    },
    
    showSyncSettings: function(sender) {
      if (typeof Menu !== "undefined") {
        // 确保 sender 是有效的按钮
        const button = sender || self.settingsButton;
        const menu = new Menu(button, self, 250, 2);
        
        const syncSource = configManager.get("syncSource", "none");
        const autoSync = configManager.get("autoSync", false);
        
        const menuItems = [
          { title: autoSync ? "✓ 自动同步" : "  自动同步", selector: "toggleAutoSync:" },
          { title: "────────", selector: "", param: "" },
          { title: syncSource === "none" ? "● 不同步" : "○ 不同步", selector: "setSyncSource:", param: "none" },
          { title: syncSource === "iCloud" ? "● iCloud" : "○ iCloud", selector: "setSyncSource:", param: "iCloud" },
          { title: "────────", selector: "", param: "" },
          { title: "立即同步", selector: "manualSync:" }
        ];
        
        menu.addMenuItems(menuItems);
        menu.rowHeight = 40;
        menu.show();
      }
    },
    
    toggleAutoSync: function() {
      const autoSync = !configManager.get("autoSync");
      configManager.set("autoSync", autoSync);
      
      if (typeof Menu !== "undefined") {
        Menu.dismissCurrentMenu();
      }
      
      if (typeof MNUtil !== "undefined") {
        MNUtil.showHUD("自动同步: " + (autoSync ? "已开启" : "已关闭"));
      }
    },
    
    setSyncSource: function(source) {
      configManager.set("syncSource", source);
      
      if (source === "iCloud") {
        configManager.initCloudStore();
      }
      
      if (typeof Menu !== "undefined") {
        Menu.dismissCurrentMenu();
      }
      
      if (typeof MNUtil !== "undefined") {
        MNUtil.showHUD("同步源: " + configManager.getSyncSourceName());
      }
    },
    
    manualSync: function() {
      if (typeof Menu !== "undefined") {
        Menu.dismissCurrentMenu();
      }
      
      configManager.manualSync();
    },
    
    resetSettings: function() {
      configManager.reset();
    },
    
    toggleMinimize: function() {
      self.isMinimized = !self.isMinimized;
      
      // 简化动画 - 参考 mnai 项目
      if (self.isMinimized) {
        // 最小化
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
        // 恢复
        self.view.frame = self.currentFrame;
        self.inputField.hidden = false;
        self.outputField.hidden = false;
        self.toolbar.hidden = false;
      }
      
      // 更新按钮图标
      if (self.minimizeButton) {
        self.minimizeButton.title = self.isMinimized ? "+" : "−";
      }
      
      if (typeof MNUtil !== "undefined" && MNUtil.log) {
        MNUtil.log("🔄 Simple Panel: " + (self.isMinimized ? "已最小化" : "已恢复"));
      }
    },
    
    processText: function() {
      try {
        var text = self.inputField.text;
        var result = "";
        
        if (typeof MNUtil !== "undefined" && MNUtil.log) {
          MNUtil.log("🔄 processText - 模式: " + self.currentMode);
        }
        
        // 根据当前模式处理
        switch (self.currentMode) {
          case "textProcessor":
            // 文本处理模式
            switch (configManager.get("mode")) {
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
              case 4: // 去除空格
                result = text.replace(/\s+/g, '');
                break;
              case 5: // 统计字数
                const charCount = text.replace(/\s/g, '').length;
                const wordCount = text.trim().split(/\s+/).length;
                result = "字符数：" + charCount + "\n单词数：" + wordCount;
                break;
            }
            self.outputField.text = result;
            break;
            
          case "quickNote":
            // 快速笔记模式
            self.saveQuickNote(text);
            break;
            
          case "searchReplace":
            // 搜索替换模式
            self.performSearchReplace();
            break;
        }
        
        // 保存到历史
        if (configManager.get("saveHistory") && result) {
          configManager.saveHistory({
            input: text,
            output: result,
            mode: self.currentMode,
            subMode: configManager.get("mode")
          });
        }
        
        // 更新状态指示器 - 内联逻辑，JSB框架限制
        if (self.statusIndicator) {
          var indicatorColor = "#4CAF50";
          if (typeof MNUtil !== "undefined" && MNUtil.animate) {
            MNUtil.animate(() => {
              self.statusIndicator.backgroundColor = indicatorColor;
              self.statusIndicator.transform = {a: 1.5, b: 0, c: 0, d: 1.5, tx: 0, ty: 0};
            }, 0.1).then(() => {
              MNUtil.animate(() => {
                self.statusIndicator.transform = {a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0};
              }, 0.2);
              
              NSTimer.scheduledTimerWithTimeInterval(0.5, false, () => {
                MNUtil.animate(() => {
                  self.statusIndicator.backgroundColor = "#00000020";
                }, 0.3);
              });
            });
          } else {
            self.statusIndicator.backgroundColor = indicatorColor;
            NSTimer.scheduledTimerWithTimeInterval(0.5, false, () => {
              self.statusIndicator.backgroundColor = "#00000020";
            });
          }
        }
        
        // 显示处理完成提示
        if (typeof MNUtil !== "undefined") {
          MNUtil.showHUD("处理完成");
        }
      } catch (error) {
        if (typeof MNUtil !== "undefined") {
          MNUtil.addErrorLog(error, "processText", {mode: self.currentMode});
          MNUtil.showHUD("处理失败：" + error.message);
        }
      }
    },
    
    showModeMenu: function(sender) {
      if (typeof Menu !== "undefined") {
        const menu = new Menu(sender, self, 220, 2);
        
        // 根据当前模式显示不同的选项
        if (self.currentMode === "textProcessor") {
          const currentMode = configManager.get("mode");
          const modes = [
            { title: "转大写 (ABC)", selector: "setMode:", param: 0, checked: currentMode === 0 },
            { title: "转小写 (abc)", selector: "setMode:", param: 1, checked: currentMode === 1 },
            { title: "首字母大写 (Abc)", selector: "setMode:", param: 2, checked: currentMode === 2 },
            { title: "反转文本 (⇄)", selector: "setMode:", param: 3, checked: currentMode === 3 },
            { title: "去除空格", selector: "setMode:", param: 4, checked: currentMode === 4 },
            { title: "统计字数", selector: "setMode:", param: 5, checked: currentMode === 5 }
          ];
          menu.addMenuItems(modes);
        } else if (self.currentMode === "quickNote") {
          const noteOptions = [
            { title: "保存到当前笔记", selector: "saveToCurrentNote:" },
            { title: "创建新笔记", selector: "createNewNote:" },
            { title: "Markdown 预览", selector: "previewMarkdown:" }
          ];
          menu.addMenuItems(noteOptions);
        } else if (self.currentMode === "searchReplace") {
          const searchOptions = [
            { title: "大小写敏感", selector: "toggleCaseSensitive:", checked: configManager.get("caseSensitive") },
            { title: "全词匹配", selector: "toggleWholeWord:", checked: configManager.get("wholeWord") },
            { title: "正则表达式", selector: "toggleRegex:", checked: configManager.get("useRegex") }
          ];
          menu.addMenuItems(searchOptions);
        }
        
        menu.rowHeight = 45;
        menu.fontSize = 16;
        menu.show();
      }
    },
    
    setMode: function(mode) {
      configManager.set("mode", mode);
      
      // 先关闭菜单，再显示 HUD
      if (typeof Menu !== "undefined") {
        Menu.dismissCurrentMenu();
      }
      
      // 立即显示反馈
      const modeNames = ["转大写", "转小写", "首字母大写", "反转文本", "去除空格", "统计字数"];
      if (typeof MNUtil !== "undefined") {
        MNUtil.showHUD("已切换到: " + modeNames[mode]);
      }
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
        
        const history = configManager.history;
        
        if (history.length > 0) {
          // 显示最近10条历史
          const recentHistory = history.slice(-10).reverse();
          
          recentHistory.forEach((item, index) => {
            const preview = item.output.substring(0, 30) + (item.output.length > 30 ? "..." : "");
            menu.addMenuItem(preview, "loadFromHistory:", history.length - 1 - index);
          });
          
          if (history.length > 10) {
            menu.addMenuItem("────────", "", "", false);
            menu.addMenuItem("查看全部 (" + history.length + " 条)", "showAllHistory:");
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
      const item = configManager.history[index];
      if (item) {
        self.inputField.text = item.input;
        self.outputField.text = item.output;
        configManager.set("mode", item.mode);
        
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
      const saveHistory = !configManager.get("saveHistory");
      configManager.set("saveHistory", saveHistory);
      
      if (typeof Menu !== "undefined") {
        Menu.dismissCurrentMenu();
      }
      
      if (typeof MNUtil !== "undefined") {
        MNUtil.showHUD("保存历史: " + (saveHistory ? "已开启" : "已关闭"));
      }
    },
    
    clearHistory: function() {
      configManager.clearHistory();
      
      if (typeof Menu !== "undefined") {
        Menu.dismissCurrentMenu();
      }
      
      if (typeof MNUtil !== "undefined") {
        MNUtil.showHUD("历史已清空");
      }
    },
    
    exportConfig: function() {
      if (typeof Menu !== "undefined") {
        Menu.dismissCurrentMenu();
      }
      
      configManager.exportConfig();
    },
    
    importConfig: function() {
      if (typeof Menu !== "undefined") {
        Menu.dismissCurrentMenu();
      }
      
      try {
        const importStr = (typeof MNUtil !== "undefined" && MNUtil.clipboardText) ? 
          MNUtil.clipboardText : UIPasteboard.generalPasteboard().string;
        
        configManager.importConfig(importStr);
      } catch (e) {
        if (typeof MNUtil !== "undefined") {
          MNUtil.showHUD("导入失败: " + e.message);
        }
      }
    },
    
    // === 高级手势处理（基于 mnai 最佳实践） ===
    
    onDragGesture: function(gesture) {
      var translation = gesture.translationInView(self.view.superview);
      var velocity = gesture.velocityInView(self.view.superview);
      
      switch (gesture.state) {
        case 1: // Began
          // 记录开始拖动的中心点
          self.dragStartCenter = self.view.center;
          
          // 视觉反馈：轻微放大 - 简化版
          self.view.layer.shadowRadius = 20;
          self.view.layer.shadowOpacity = 0.6;
          break;
          
        case 2: // Changed
          // 使用 center 而不是 frame，避免计算累积误差
          var newCenter = {
            x: self.dragStartCenter.x + translation.x,
            y: self.dragStartCenter.y + translation.y
          };
          
          // 边界检查
          var superBounds = self.view.superview.bounds;
          var halfWidth = self.view.frame.width / 2;
          var halfHeight = self.view.frame.height / 2;
          
          newCenter.x = typeof MNUtil !== "undefined" ? 
            MNUtil.constrain(newCenter.x, halfWidth, superBounds.width - halfWidth) :
            Math.max(halfWidth, Math.min(newCenter.x, superBounds.width - halfWidth));
          newCenter.y = typeof MNUtil !== "undefined" ?
            MNUtil.constrain(newCenter.y, halfHeight, superBounds.height - halfHeight) :
            Math.max(halfHeight, Math.min(newCenter.y, superBounds.height - halfHeight));
          
          self.view.center = newCenter;
          
          if (!self.isMinimized) {
            self.currentFrame = self.view.frame;
          }
          break;
          
        case 3: // Ended
          // 恢复正常大小 - 简化版
          self.view.layer.shadowRadius = 15;
          self.view.layer.shadowOpacity = 0.5;
          
          // 吸附到边缘效果（只有在速度非常快时才触发）
          if (Math.abs(velocity.x) > 3000) {
            var studyWidth = self.view.superview.bounds.width;
            var halfWidth = self.view.frame.width / 2;
            var targetCenterX = velocity.x > 0 ? studyWidth - halfWidth - 10 : halfWidth + 10;
            
            // 直接设置中心点
            self.view.center = {
              x: targetCenterX,
              y: self.view.center.y
            };
            self.currentFrame = self.view.frame;
            
            if (typeof MNUtil !== "undefined") {
              MNUtil.showHUD("已吸附到" + (velocity.x > 0 ? "右边" : "左边"));
            }
          }
          break;
      }
    },
    
    // 高级调整大小手势处理
    onResizeGesture: function(gesture) {
      if (self.isMinimized) return;
      
      switch (gesture.state) {
        case 1: // Began
          self.resizeStartFrame = self.view.frame;
          
          // 视觉反馈：手柄变色
          if (self.resizeHandle && typeof MNButton !== "undefined") {
            MNButton.setConfig(self.resizeHandle, {
              color: "#457bd3",
              opacity: 0.8
            });
          }
          break;
          
        case 2: // Changed
          var location = gesture.locationInView(self.view);
          
          // 智能尺寸约束
          var minWidth = 300;
          var minHeight = 250;
          var maxWidth = self.view.superview.bounds.width - self.view.frame.x - 20;
          var maxHeight = self.view.superview.bounds.height - self.view.frame.y - 20;
          
          var width = typeof MNUtil !== "undefined" ?
            MNUtil.constrain(location.x, minWidth, maxWidth) :
            Math.max(minWidth, Math.min(location.x, maxWidth));
          var height = typeof MNUtil !== "undefined" ?
            MNUtil.constrain(location.y, minHeight, maxHeight) :
            Math.max(minHeight, Math.min(location.y, maxHeight));
          
          // 按比例调整（如果按住 shift 键）
          if (gesture.modifierFlags & (1 << 17)) { // Shift key
            var aspectRatio = self.resizeStartFrame.width / self.resizeStartFrame.height;
            height = width / aspectRatio;
          }
          
          self.view.frame = {
            x: self.view.frame.x,
            y: self.view.frame.y,
            width: width,
            height: height
          };
          
          self.currentFrame = self.view.frame;
          
          // 实时更新布局
          self.viewWillLayoutSubviews();
          break;
          
        case 3: // Ended
          // 恢复手柄颜色
          if (self.resizeHandle && typeof MNButton !== "undefined") {
            MNButton.setConfig(self.resizeHandle, {
              color: "#00000020",
              opacity: 1.0
            });
          }
          
          // 保存新尺寸到配置
          configManager.update({
            panelWidth: self.view.frame.width,
            panelHeight: self.view.frame.height
          });
          
          // 显示尺寸提示
          if (typeof MNUtil !== "undefined") {
            MNUtil.showHUD(Math.round(self.view.frame.width) + " × " + Math.round(self.view.frame.height));
          }
          break;
      }
    },
    
    showAllHistory: function() {
      // 可以在这里实现更完整的历史记录查看界面
      if (typeof MNUtil !== "undefined") {
        MNUtil.showHUD("共有 " + configManager.history.length + " 条历史记录");
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
      // 文本变化时保存到配置管理器
      if (self.inputField && self.inputField.text !== "在这里输入文本...") {
        configManager.set("inputText", self.inputField.text, false);
      }
    },
    
    // === 辅助方法 ===
    
    // 清理方法
    dealloc: function() {
      // 目前无需清理
    },
    
    // === 新增功能方法 ===
    
    // 高级模式切换（基于 mnai 动画系统）
    switchToMode: function(mode) {
      if (self.currentMode === mode) return;
      
      const modeConfig = self.modes[mode];
      if (!modeConfig) return;
      
      if (typeof MNUtil !== "undefined" && MNUtil.log) {
        MNUtil.log("🔄 Simple Panel: 切换到模式 " + mode);
      }
      
      // 直接切换，不使用复杂动画 - 参考 mnai 项目
      self.currentMode = mode;
      self.titleLabel.text = modeConfig.title;
      
      // 更新占位符
      if (self.inputField.text === "" || 
          self.inputField.text === self.modes[self.lastMode]?.inputPlaceholder) {
        self.inputField.text = modeConfig.inputPlaceholder;
      }
      
      // 显示/隐藏输出框
      self.outputField.hidden = !modeConfig.showOutput;
      
      // 重新布局
      self.viewWillLayoutSubviews();
      
      self.lastMode = mode;
      
      // 更新状态指示器
      self.updateStatusIndicator(mode);
      
      // 震动反馈（iOS）
      if (typeof MNUtil !== "undefined" && MNUtil.isIOS && MNUtil.isIOS()) {
        try {
          const generator = UIImpactFeedbackGenerator.alloc().initWithStyle(0); // light
          generator.prepare();
          generator.impactOccurred();
        } catch (e) {
          // 忽略错误
        }
      }
      
      if (typeof MNUtil !== "undefined" && MNUtil.log) {
        MNUtil.log("✅ Simple Panel: 模式切换完成");
      }
    },
    
    // 更新状态指示器
    updateStatusIndicator: function(mode) {
      const modeColors = {
        textProcessor: "#5982c4",
        quickNote: "#4CAF50",
        searchReplace: "#FF9800"
      };
      
      if (self.statusIndicator) {
        const newColor = modeColors[mode] || "#5982c4";
        
        if (typeof MNButton !== "undefined") {
          // 直接设置颜色 - 参考 mnai 项目
          MNButton.setConfig(self.statusIndicator, {
            color: newColor
          });
        } else {
          self.statusIndicator.backgroundColor = UIColor.colorWithHexString(newColor);
        }
      }
    },
    
    // 保存快速笔记
    saveQuickNote: function(text) {
      if (typeof MNNote === "undefined") {
        if (typeof MNUtil !== "undefined") {
          MNUtil.showHUD("需要安装 MNUtils");
        }
        return;
      }
      
      const focusNote = MNNote.getFocusNote();
      if (focusNote) {
        MNUtil.undoGrouping(() => {
          // 检测是否是 Markdown 格式
          if (text.includes("#") || text.includes("*") || text.includes("[")) {
            focusNote.appendHtmlComment(self.markdownToHtml(text));
          } else {
            focusNote.appendTextComment(text);
          }
        });
        
        // 清空输入框
        self.inputField.text = "";
        
        if (typeof MNUtil !== "undefined") {
          MNUtil.showHUD("✅ 笔记已保存");
        }
      } else {
        if (typeof MNUtil !== "undefined") {
          MNUtil.showHUD("请先选择一个笔记");
        }
      }
    },
    
    // 执行搜索替换
    performSearchReplace: function() {
      // 这里可以实现搜索替换的逻辑
      if (typeof MNUtil !== "undefined") {
        MNUtil.showHUD("🔍 搜索替换功能开发中...");
      }
    },
    
    // 简单的 Markdown 转 HTML
    markdownToHtml: function(markdown) {
      var html = markdown;
      
      // 标题
      html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
      html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
      html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
      
      // 粗体和斜体
      html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<b><i>$1</i></b>');
      html = html.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
      html = html.replace(/\*(.+?)\*/g, '<i>$1</i>');
      
      // 列表
      html = html.replace(/^\* (.+)/gim, '<li>$1</li>');
      html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
      
      // 换行
      html = html.replace(/\n/g, '<br>');
      
      return html;
    },
    
    // 更新状态指示器
    updateStatusIndicator: function(color) {
      if (self.statusIndicator) {
        // 使用动画效果
        if (typeof MNUtil !== "undefined" && MNUtil.animate) {
          MNUtil.animate(() => {
            self.statusIndicator.backgroundColor = color;
            self.statusIndicator.transform = {a: 1.5, b: 0, c: 0, d: 1.5, tx: 0, ty: 0};
          }, 0.1).then(() => {
            MNUtil.animate(() => {
              self.statusIndicator.transform = {a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0};
            }, 0.2);
            
            NSTimer.scheduledTimerWithTimeInterval(0.5, false, () => {
              MNUtil.animate(() => {
                self.statusIndicator.backgroundColor = "#00000020";
              }, 0.3);
            });
          });
        } else {
          self.statusIndicator.backgroundColor = color;
          NSTimer.scheduledTimerWithTimeInterval(0.5, false, () => {
            self.statusIndicator.backgroundColor = "#00000020";
          });
        }
      }
    },
    
    // 新增模式相关方法
    saveToCurrentNote: function() {
      self.saveQuickNote(self.inputField.text);
      if (typeof Menu !== "undefined") {
        Menu.dismissCurrentMenu();
      }
    },
    
    createNewNote: function() {
      if (typeof MNNote === "undefined" || typeof MNUtil === "undefined") {
        MNUtil.showHUD("需要安装 MNUtils");
        return;
      }
      
      // 创建新笔记
      const newNote = MNNote.createWithTitleNotebookId("快速笔记", MNUtil.currentNotebookId);
      if (newNote) {
        newNote.appendTextComment(self.inputField.text);
        self.inputField.text = "";
        MNUtil.showHUD("✅ 新笔记已创建");
      }
      
      if (typeof Menu !== "undefined") {
        Menu.dismissCurrentMenu();
      }
    },
    
    previewMarkdown: function() {
      const html = self.markdownToHtml(self.inputField.text);
      self.outputField.text = html;
      self.outputField.hidden = false;
      self.viewWillLayoutSubviews();
      
      if (typeof Menu !== "undefined") {
        Menu.dismissCurrentMenu();
      }
    },
    
    toggleCaseSensitive: function() {
      const value = !configManager.get("caseSensitive");
      configManager.set("caseSensitive", value);
      if (typeof Menu !== "undefined") {
        Menu.dismissCurrentMenu();
      }
      if (typeof MNUtil !== "undefined") {
        MNUtil.showHUD("大小写敏感: " + (value ? "开启" : "关闭"));
      }
    },
    
    toggleWholeWord: function() {
      const value = !configManager.get("wholeWord");
      configManager.set("wholeWord", value);
      if (typeof Menu !== "undefined") {
        Menu.dismissCurrentMenu();
      }
      if (typeof MNUtil !== "undefined") {
        MNUtil.showHUD("全词匹配: " + (value ? "开启" : "关闭"));
      }
    },
    
    toggleRegex: function() {
      const value = !configManager.get("useRegex");
      configManager.set("useRegex", value);
      if (typeof Menu !== "undefined") {
        Menu.dismissCurrentMenu();
      }
      if (typeof MNUtil !== "undefined") {
        MNUtil.showHUD("正则表达式: " + (value ? "开启" : "关闭"));
      }
    }
  }
);