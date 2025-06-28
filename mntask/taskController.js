/**
 * 任务管理器控制器
 * 负责管理 WebView 界面和处理任务操作
 */

// 获取控制器实例的辅助函数
const getTaskController = () => self;

var TaskController = JSB.defineClass("TaskController : UIViewController", {
  // 初始化
  init: function() {
    self = this;
    
    // 调用父类初始化
    try {
      self.super.init();
    } catch (e) {
      // 忽略父类初始化错误
    }
    
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
    const self = getTaskController();
    
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
    const self = getTaskController();
    
    // 标题栏容器
    const titleBar = UIView.new();
    if (typeof MNUtil !== "undefined" && MNUtil.hexColor) {
      titleBar.backgroundColor = MNUtil.hexColor("#457bd3");
    } else {
      titleBar.backgroundColor = UIColor.blueColor();
    }
    titleBar.frame = {x: 0, y: 0, width: self.windowWidth, height: 44};
    
    // 标题
    const titleLabel = UILabel.new();
    titleLabel.text = "任务管理器";
    titleLabel.textColor = UIColor.whiteColor();
    titleLabel.font = UIFont.boldSystemFontOfSize(16);
    titleLabel.textAlignment = 1; // center
    titleLabel.frame = {x: 60, y: 0, width: self.windowWidth - 120, height: 44};
    titleBar.addSubview(titleLabel);
    
    // 关闭按钮
    const closeButton = UIButton.buttonWithType(0);
    closeButton.setTitleForState("✕", 0);
    closeButton.setTitleColorForState(UIColor.whiteColor(), 0);
    closeButton.titleLabel.font = UIFont.systemFontOfSize(20);
    closeButton.frame = {x: self.windowWidth - 44, y: 0, width: 44, height: 44};
    closeButton.addTargetActionForControlEvents(self, "close", 1 << 6);
    titleBar.addSubview(closeButton);
    
    // 刷新按钮
    const refreshButton = UIButton.buttonWithType(0);
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
    const self = getTaskController();
    
    try {
      // 创建 WebView
      const webView = UIWebView.new();
      webView.frame = {x: 0, y: 44, width: self.windowWidth, height: self.windowHeight - 44};
      webView.delegate = self;
      webView.scrollView.showsVerticalScrollIndicator = true;
      webView.scrollView.showsHorizontalScrollIndicator = false;
      
      self.view.addSubview(webView);
      self.webView = webView;
    } catch (error) {
      // 创建简单的文本视图作为后备
      const textView = UITextView.new();
      textView.frame = {x: 0, y: 44, width: self.windowWidth, height: self.windowHeight - 44};
      textView.text = "任务管理器\n\n无法加载 WebView";
      textView.editable = false;
      self.view.addSubview(textView);
    }
  },
  
  // 加载任务面板
  loadTaskPanel: function() {
    const self = getTaskController();
    
    try {
      if (!self.webView || !self.mainPath) {
        return;
      }
      
      // 获取 HTML 文件路径
      const htmlPath = self.mainPath + "/taskPanel.html";
      const htmlUrl = NSURL.fileURLWithPath(htmlPath);
      
      // 加载 HTML
      const request = NSURLRequest.requestWithURL(htmlUrl);
      self.webView.loadRequest(request);
      
    } catch (error) {
      if (typeof MNUtil !== "undefined" && MNUtil.showHUD) {
        MNUtil.showHUD("❌ 加载界面失败: " + error.message);
      }
    }
  },
  
  // UIWebViewDelegate - 网页加载完成
  webViewDidFinishLoad: function(webView) {
    const self = getTaskController();
    // 页面加载完成后刷新数据
    self.refresh();
  },
  
  // UIWebViewDelegate - 处理 JavaScript 与原生交互
  webViewShouldStartLoadWithRequestNavigationType: function(webView, request, navigationType) {
    const self = getTaskController();
    const url = request.URL().absoluteString();
    
    // 处理自定义协议
    if (url.startsWith("mntask://")) {
      const action = url.replace("mntask://", "");
      const parts = action.split("?");
      const command = parts[0];
      
      // 解析参数
      const params = {};
      if (parts[1]) {
        const pairs = parts[1].split("&");
        pairs.forEach(pair => {
          const kv = pair.split("=");
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
    const self = getTaskController();
    
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
    const self = getTaskController();
    const filter = params.filter || "all";
    
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
    const tasks = self.taskModel.getAllTasks(filter);
    
    // 发送给 WebView
    self.runJavaScript("TaskManager.renderTasks(" + JSON.stringify(tasks) + ")");
  },
  
  // 处理创建任务请求
  handleCreateTask: function(params) {
    const self = getTaskController();
    
    if (typeof MNUtil !== "undefined" && MNUtil.undoGrouping) {
      MNUtil.undoGrouping(function() {
        try {
          if (!self.taskModel) return;
          
          // 创建任务
          const taskData = {
            title: params.title,
            priority: params.priority || "normal"
          };
          
          // 如果是今日任务，添加标签
          if (params.isToday === "true") {
            taskData.tags = ["#今日任务"];
          }
          
          const newTask = self.taskModel.createTask(taskData);
          
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
    const self = getTaskController();
    const taskId = params.taskId;
    
    if (!taskId || typeof MNNote === "undefined") return;
    
    const taskNote = MNNote.new(taskId);
    if (taskNote) {
      // 聚焦到任务卡片
      if (taskNote.focusInMindMap) {
        taskNote.focusInMindMap(0.3);
      }
    }
  },
  
  // 显示高级添加界面
  handleShowAdvancedAdd: function(params) {
    const self = getTaskController();
    
    if (typeof MNUtil === "undefined") return;
    
    // 使用 MNUtil 的输入对话框
    MNUtil.input("创建任务", "请输入任务标题", ["任务标题"]).then(function(inputs) {
      if (inputs && inputs[0]) {
        const title = inputs[0].trim();
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
    const self = getTaskController();
    if (self.webView && self.webView.stringByEvaluatingJavaScriptFromString) {
      self.webView.stringByEvaluatingJavaScriptFromString(script);
    }
  },
  
  // 刷新任务列表
  refresh: function() {
    const self = getTaskController();
    self.runJavaScript("TaskManager.refreshTasks()");
  },
  
  // 显示窗口
  show: function() {
    const self = getTaskController();
    
    if (self.isVisible) return;
    
    // 获取主窗口
    if (typeof MNUtil === "undefined") {
      return;
    }
    
    const mainWindow = MNUtil.mainWindow || MNUtil.currentWindow;
    if (!mainWindow) return;
    
    // 计算位置（居中显示）
    const screenBounds = mainWindow.bounds || mainWindow.frame;
    const x = (screenBounds.width - self.windowWidth) / 2;
    const y = (screenBounds.height - self.windowHeight) / 2;
    
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
    const panGesture = UIPanGestureRecognizer.alloc().initWithTargetAction(self, "handlePan:");
    self.titleBar.addGestureRecognizer(panGesture);
    
    self.isVisible = true;
    
    // 刷新数据
    self.refresh();
  },
  
  // 关闭窗口
  close: function() {
    const self = getTaskController();
    
    if (!self.isVisible) return;
    
    // 移除视图
    self.view.removeFromSuperview();
    
    self.isVisible = false;
  },
  
  // 处理拖动
  handlePan: function(gesture) {
    const self = getTaskController();
    
    if (gesture.state === 1 || gesture.state === 2) { // Began or Changed
      const translation = gesture.translationInView(self.view.superview);
      const currentFrame = self.view.frame;
      
      self.view.frame = {
        x: currentFrame.x + translation.x,
        y: currentFrame.y + translation.y,
        width: currentFrame.width,
        height: currentFrame.height
      };
      
      gesture.setTranslationInView({x: 0, y: 0}, self.view.superview);
    }
  }
});

// 不需要在这里加载自己