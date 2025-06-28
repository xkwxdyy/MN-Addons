/**
 * 任务管理器控制器
 * 负责管理 WebView 界面和处理任务操作
 */

var TaskController = JSB.defineClass("TaskController : UIViewController", {
  // 初始化
  init: function() {
    var self = this;
    
    // 设置属性
    self.webView = null;
    self.isVisible = false;
    self.mainPath = "";  // 将由外部设置
    
    // 窗口配置
    self.windowWidth = 350;
    self.windowHeight = 600;
    
    // 任务模型 - 延迟初始化
    self.taskModel = null;
    
    return self;
  },
  
  // 视图加载
  viewDidLoad: function() {
    var self = this;
    
    try {
      // 设置视图
      self.view.backgroundColor = UIColor.whiteColor();
      self.view.layer.cornerRadius = 10;
      self.view.layer.shadowOffset = {width: 0, height: 2};
      self.view.layer.shadowRadius = 10;
      self.view.layer.shadowOpacity = 0.3;
      
      // 创建标题栏
      self.createTitleBar();
      
      // 创建 WebView
      self.createWebView();
      
      // 加载 HTML
      self.loadTaskPanel();
      
    } catch (error) {
      if (typeof MNUtil !== "undefined" && MNUtil.showHUD) {
        MNUtil.showHUD("❌ 初始化失败: " + error.message);
      }
    }
  },
  
  // 创建标题栏
  createTitleBar: function() {
    var self = this;
    
    // 标题栏容器
    var titleBar = UIView.new();
    if (typeof MNUtil !== "undefined" && MNUtil.hexColor) {
      titleBar.backgroundColor = MNUtil.hexColor("#457bd3");
    } else {
      titleBar.backgroundColor = UIColor.blueColor();
    }
    titleBar.frame = {x: 0, y: 0, width: self.windowWidth, height: 44};
    
    // 标题
    var titleLabel = UILabel.new();
    titleLabel.text = "任务管理器";
    titleLabel.textColor = UIColor.whiteColor();
    titleLabel.font = UIFont.boldSystemFontOfSize(16);
    titleLabel.textAlignment = 1; // center
    titleLabel.frame = {x: 60, y: 0, width: self.windowWidth - 120, height: 44};
    titleBar.addSubview(titleLabel);
    
    // 关闭按钮
    var closeButton = UIButton.buttonWithType(0);
    closeButton.setTitleForState("✕", 0);
    closeButton.setTitleColorForState(UIColor.whiteColor(), 0);
    closeButton.titleLabel.font = UIFont.systemFontOfSize(20);
    closeButton.frame = {x: self.windowWidth - 44, y: 0, width: 44, height: 44};
    closeButton.addTargetActionForControlEvents(self, "close", 1 << 6);
    titleBar.addSubview(closeButton);
    
    // 刷新按钮
    var refreshButton = UIButton.buttonWithType(0);
    refreshButton.setTitleForState("↻", 0);
    refreshButton.setTitleColorForState(UIColor.whiteColor(), 0);
    refreshButton.titleLabel.font = UIFont.systemFontOfSize(18);
    refreshButton.frame = {x: 0, y: 0, width: 44, height: 44};
    refreshButton.addTargetActionForControlEvents(self, "refresh", 1 << 6);
    titleBar.addSubview(refreshButton);
    
    self.view.addSubview(titleBar);
    self.titleBar = titleBar;
  },
  
  // 创建 WebView
  createWebView: function() {
    var self = this;
    
    try {
      // 创建 WebView
      var webView = UIWebView.new();
      webView.frame = {x: 0, y: 44, width: self.windowWidth, height: self.windowHeight - 44};
      webView.delegate = self;
      webView.scrollView.showsVerticalScrollIndicator = true;
      webView.scrollView.showsHorizontalScrollIndicator = false;
      
      self.view.addSubview(webView);
      self.webView = webView;
    } catch (error) {
      // 创建简单的文本视图作为后备
      var textView = UITextView.new();
      textView.frame = {x: 0, y: 44, width: self.windowWidth, height: self.windowHeight - 44};
      textView.text = "任务管理器\n\n无法加载 WebView";
      textView.editable = false;
      self.view.addSubview(textView);
    }
  },
  
  // 加载任务面板
  loadTaskPanel: function() {
    var self = this;
    
    try {
      if (!self.webView || !self.mainPath) {
        return;
      }
      
      // 获取 HTML 文件路径
      var htmlPath = self.mainPath + "/taskPanel.html";
      var htmlUrl = NSURL.fileURLWithPath(htmlPath);
      
      // 加载 HTML
      var request = NSURLRequest.requestWithURL(htmlUrl);
      self.webView.loadRequest(request);
      
    } catch (error) {
      if (typeof MNUtil !== "undefined" && MNUtil.showHUD) {
        MNUtil.showHUD("❌ 加载界面失败: " + error.message);
      }
    }
  },
  
  // UIWebViewDelegate - 网页加载完成
  webViewDidFinishLoad: function(webView) {
    var self = this;
    // 页面加载完成后刷新数据
    self.refresh();
  },
  
  // UIWebViewDelegate - 处理 JavaScript 与原生交互
  webViewShouldStartLoadWithRequestNavigationType: function(webView, request, navigationType) {
    var self = this;
    var url = request.URL().absoluteString();
    
    // 处理自定义协议
    if (url.startsWith("mntask://")) {
      var action = url.replace("mntask://", "");
      var parts = action.split("?");
      var command = parts[0];
      
      // 解析参数
      var params = {};
      if (parts[1]) {
        var pairs = parts[1].split("&");
        pairs.forEach(pair => {
          var kv = pair.split("=");
          params[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1]);
        });
      }
      
      // 处理命令
      self.handleWebCommand(command, params);
      
      return false; // 阻止加载
    }
    
    return true; // 允许加载
  },
  
  // 处理来自 WebView 的命令
  handleWebCommand: function(command, params) {
    var self = this;
    
    try {
      switch (command) {
        case "getTasks":
          self.handleGetTasks(params);
          break;
        case "createTask":
          self.handleCreateTask(params);
          break;
        case "openTask":
          self.handleOpenTask(params);
          break;
        case "showAdvancedAdd":
          self.handleShowAdvancedAdd(params);
          break;
      }
    } catch (error) {
      if (typeof MNUtil !== "undefined" && MNUtil.showHUD) {
        MNUtil.showHUD("❌ 操作失败: " + error.message);
      }
    }
  },
  
  // 处理获取任务请求
  handleGetTasks: function(params) {
    var self = this;
    var filter = params.filter || "all";
    
    // 延迟初始化任务模型
    if (!self.taskModel) {
      try {
        if (typeof TaskModel !== "undefined") {
          self.taskModel = new TaskModel();
        }
      } catch (error) {
        // 忽略错误
      }
    }
    
    if (!self.taskModel) {
      self.runJavaScript("TaskManager.renderTasks([])");
      return;
    }
    
    // 获取任务列表
    var tasks = self.taskModel.getAllTasks(filter);
    
    // 发送给 WebView
    self.runJavaScript("TaskManager.renderTasks(" + JSON.stringify(tasks) + ")");
  },
  
  // 处理创建任务请求
  handleCreateTask: function(params) {
    var self = this;
    
    if (typeof MNUtil !== "undefined" && MNUtil.undoGrouping) {
      MNUtil.undoGrouping(function() {
        try {
          if (!self.taskModel) return;
          
          // 创建任务
          var taskData = {
            title: params.title,
            priority: params.priority || "normal"
          };
          
          // 如果是今日任务，添加标签
          if (params.isToday === "true") {
            taskData.tags = ["#今日任务"];
          }
          
          var newTask = self.taskModel.createTask(taskData);
          
          if (newTask) {
            MNUtil.showHUD("✅ 任务创建成功");
            
            // 刷新列表
            self.refresh();
            
            // 聚焦到新任务
            if (newTask.focusInMindMap) {
              newTask.focusInMindMap(0.3);
            }
          }
        } catch (error) {
          MNUtil.showHUD("❌ 创建失败: " + error.message);
        }
      });
    }
  },
  
  // 处理打开任务请求
  handleOpenTask: function(params) {
    var self = this;
    var taskId = params.taskId;
    
    if (!taskId || typeof MNNote === "undefined") return;
    
    var taskNote = MNNote.new(taskId);
    if (taskNote) {
      // 聚焦到任务卡片
      if (taskNote.focusInMindMap) {
        taskNote.focusInMindMap(0.3);
      }
    }
  },
  
  // 显示高级添加界面
  handleShowAdvancedAdd: function(params) {
    var self = this;
    
    if (typeof MNUtil === "undefined") return;
    
    // 使用 MNUtil 的输入对话框
    MNUtil.input("创建任务", "请输入任务标题", ["任务标题"]).then(function(inputs) {
      if (inputs && inputs[0]) {
        var title = inputs[0].trim();
        if (title) {
          self.handleCreateTask({
            title: title,
            isToday: "false"
          });
        }
      }
    }).catch(function(error) {
      // 用户取消了输入
    });
  },
  
  // 执行 JavaScript
  runJavaScript: function(script) {
    var self = this;
    if (self.webView && self.webView.stringByEvaluatingJavaScriptFromString) {
      self.webView.stringByEvaluatingJavaScriptFromString(script);
    }
  },
  
  // 刷新任务列表
  refresh: function() {
    var self = this;
    self.runJavaScript("TaskManager.refreshTasks()");
  },
  
  // 显示窗口
  show: function() {
    var self = this;
    
    if (self.isVisible) return;
    
    // 获取主窗口
    if (typeof MNUtil === "undefined") {
      return;
    }
    
    var mainWindow = MNUtil.mainWindow || MNUtil.currentWindow;
    if (!mainWindow) return;
    
    // 计算位置（居中显示）
    var screenBounds = mainWindow.bounds || mainWindow.frame;
    var x = (screenBounds.width - self.windowWidth) / 2;
    var y = (screenBounds.height - self.windowHeight) / 2;
    
    // 设置 frame
    self.view.frame = {
      x: x,
      y: y,
      width: self.windowWidth,
      height: self.windowHeight
    };
    
    // 添加到主窗口
    mainWindow.addSubview(self.view);
    
    // 添加拖动手势
    var panGesture = UIPanGestureRecognizer.alloc().initWithTargetAction(self, "handlePan:");
    self.titleBar.addGestureRecognizer(panGesture);
    
    self.isVisible = true;
    
    // 刷新数据
    self.refresh();
  },
  
  // 关闭窗口
  close: function() {
    var self = this;
    
    if (!self.isVisible) return;
    
    // 移除视图
    self.view.removeFromSuperview();
    
    self.isVisible = false;
  },
  
  // 处理拖动
  handlePan: function(gesture) {
    var self = this;
    
    if (gesture.state === 1 || gesture.state === 2) { // Began or Changed
      var translation = gesture.translationInView(self.view.superview);
      var currentFrame = self.view.frame;
      
      self.view.frame = {
        x: currentFrame.x + translation.x,
        y: currentFrame.y + translation.y,
        width: currentFrame.width,
        height: currentFrame.height
      };
      
      gesture.setTranslationInView({x: 0, y: 0}, self.view.superview);
    }
  }
}, { /* 静态方法 */
  // JSB 框架要求定义静态方法对象，即使为空
  new: function() {
    var instance = TaskController.alloc().init();
    return instance;
  }
});

// 不需要在这里加载自己