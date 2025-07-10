/** @return {todayBoardController} */
const getTodayBoardController = () => self;

var todayBoardController = JSB.defineClass('todayBoardController : UIViewController <UIWebViewDelegate>', {
  // 视图加载
  viewDidLoad: function() {
    let self = getTodayBoardController();
    try {
      self.init();
      
      // 设置默认视图大小（参考 mnai 的做法）
      self.view.frame = {x: 50, y: 50, width: 800, height: 600};
      self.lastFrame = self.view.frame;
      self.currentFrame = self.view.frame;
      
      self.setupUI();
      self.loadTodayBoard();
    } catch (error) {
      if (typeof taskUtils !== 'undefined' && taskUtils.addErrorLog) {
        taskUtils.addErrorLog(error, "todayBoardController.viewDidLoad");
      }
      if (typeof MNUtil !== 'undefined' && MNUtil.showHUD) {
        MNUtil.showHUD("加载今日看板失败");
      }
    }
  },

  // WebView 代理方法 - 处理自定义 URL scheme
  webViewShouldStartLoadWithRequestNavigationType: function(webView, request, type) {
    let self = getTodayBoardController();
    try {
      let requestURL = request.URL().absoluteString();
      
      if (!requestURL) {
        return true;
      }

      // 处理自定义协议
      if (requestURL.startsWith("mntask://")) {
        self.handleCustomProtocol(requestURL);
        return false;
      }

      return true;
    } catch (error) {
      if (typeof taskUtils !== 'undefined' && taskUtils.addErrorLog) {
        taskUtils.addErrorLog(error, "webViewShouldStartLoadWithRequestNavigationType");
      }
      return false;
    }
  },

  // 关闭视图
  close: function() {
    let self = getTodayBoardController();
    
    // 清理 WebView
    if (self.webView) {
      self.webView.delegate = null;
      self.webView.stopLoading();
      self.webView.removeFromSuperview();
      self.webView = null;
    }
    
    // 清理定时器
    if (self.refreshTimer) {
      clearInterval(self.refreshTimer);
      self.refreshTimer = null;
    }
    
    self.dismissViewControllerAnimatedCompletion(true, null);
  },
  
  // 视图将要消失时清理
  viewWillDisappear: function(animated) {
    let self = getTodayBoardController();
    
    // 清理 WebView delegate
    if (self.webView) {
      self.webView.delegate = null;
    }
  },
  
  // WebView 加载完成
  webViewDidFinishLoad: function(webView) {
    // 可以在这里执行加载完成后的操作
  }
});

// ========== 原型方法扩展 ==========

// 初始化
todayBoardController.prototype.init = function() {
  // 简化主路径获取
  this.mainPath = taskUtils.mainPath || '';
  this.htmlPath = this.mainPath + '/todayboard.html';
  this.refreshTimer = null;
}

// 设置 UI
todayBoardController.prototype.setupUI = function() {
  this.createNavigationBar();
  this.createWebView();
}

// 创建导航栏
todayBoardController.prototype.createNavigationBar = function() {
  // 导航栏容器
  const navBar = UIView.new();
  navBar.backgroundColor = MNUtil.hexColor("#667eea");
  navBar.frame = {x: 0, y: 0, width: this.view.bounds.width, height: 44};
  this.view.addSubview(navBar);
  
  // 标题
  const titleLabel = UILabel.new();
  titleLabel.text = "今日任务看板";
  titleLabel.textColor = UIColor.whiteColor();
  titleLabel.font = UIFont.boldSystemFontOfSize(17);
  titleLabel.textAlignment = NSTextAlignmentCenter;
  titleLabel.frame = {x: 60, y: 0, width: this.view.bounds.width - 120, height: 44};
  navBar.addSubview(titleLabel);
  this.titleLabel = titleLabel;
  
  // 关闭按钮 - 直接创建，不使用 createButton
  const closeButton = UIButton.buttonWithType(0);
  closeButton.setTitleForState("✕", 0);
  closeButton.setTitleColorForState(UIColor.whiteColor(), 0);
  closeButton.titleLabel.font = UIFont.systemFontOfSize(20);
  closeButton.frame = {x: this.view.bounds.width - 44, y: 0, width: 44, height: 44};
  closeButton.addTargetActionForControlEvents(this, "close", 1 << 6);
  navBar.addSubview(closeButton);
  this.closeButton = closeButton;
  
  // 刷新按钮
  const refreshButton = UIButton.buttonWithType(0);
  refreshButton.setTitleForState("🔄", 0);
  refreshButton.titleLabel.font = UIFont.systemFontOfSize(20);
  refreshButton.frame = {x: 10, y: 0, width: 44, height: 44};
  refreshButton.addTargetActionForControlEvents(this, "refreshBoard:", 1 << 6);
  navBar.addSubview(refreshButton);
  this.refreshButton = refreshButton;
  
  this.navBar = navBar;
}

// 创建 WebView
todayBoardController.prototype.createWebView = function() {
  // 使用成熟插件的模式创建 WebView
  this.webView = new UIWebView(this.view.bounds);
  this.webView.backgroundColor = UIColor.whiteColor();
  this.webView.scalesPageToFit = false;
  this.webView.autoresizingMask = (1 << 1 | 1 << 4); // 宽度和高度自适应
  this.webView.delegate = this;
  this.webView.layer.cornerRadius = 10;
  this.webView.layer.masksToBounds = true;
  
  // 调整 frame 以留出导航栏空间
  const webViewFrame = {
    x: 0,
    y: 44,
    width: this.view.bounds.width,
    height: this.view.bounds.height - 44
  };
  this.webView.frame = webViewFrame;
  
  this.view.addSubview(this.webView);
}

// 加载今日看板
todayBoardController.prototype.loadTodayBoard = function() {
  try {
    // 使用正确的方法加载 HTML 文件
    this.webView.loadFileURLAllowingReadAccessToURL(
      NSURL.fileURLWithPath(this.htmlPath),
      NSURL.fileURLWithPath(this.mainPath + '/')
    );
    
    // 延迟加载数据，确保 WebView 已准备好
    if (typeof MNUtil !== 'undefined' && MNUtil.delay) {
      MNUtil.delay(0.5).then(() => {
        this.loadTaskData();
      });
    }
  } catch (error) {
    if (typeof taskUtils !== 'undefined' && taskUtils.addErrorLog) {
      taskUtils.addErrorLog(error, "loadTodayBoard");
    }
    if (typeof MNUtil !== 'undefined' && MNUtil.showHUD) {
      MNUtil.showHUD("加载看板失败");
    }
  }
}

// 加载任务数据
todayBoardController.prototype.loadTaskData = function() {
  try {
    if (typeof MNTaskManager === 'undefined') {
      return;
    }
    
    // 获取今日任务
    const todayTasks = MNTaskManager.filterTodayTasks();
    
    // 转换为适合显示的格式
    const displayTasks = todayTasks.map(task => {
      const taskInfo = MNTaskManager.parseTaskTitle(task.noteTitle);
      const priorityInfo = MNTaskManager.getTaskPriority(task);
      const timeInfo = MNTaskManager.getPlannedTime(task);
      const progressInfo = MNTaskManager.getTaskProgress(task);
      
      // 检查是否过期
      const todayField = TaskFieldUtils.getFieldContent(task, "今日");
      const overdueInfo = MNTaskManager.checkIfOverdue(todayField);
      
      return {
        id: task.noteId,
        title: taskInfo.content,
        type: taskInfo.type,
        status: taskInfo.status,
        priority: priorityInfo || '低',
        plannedTime: timeInfo,
        progress: progressInfo,
        isOverdue: overdueInfo.isOverdue,
        overdueDays: overdueInfo.days,
        launchUrl: MNTaskManager.getLaunchLink(task),
        path: taskInfo.path || ''
      };
    });
    
    // 传递数据到 WebView
    const encodedTasks = encodeURIComponent(JSON.stringify(displayTasks));
    const script = `loadTasksFromPlugin('${encodedTasks}')`;
    this.webView.stringByEvaluatingJavaScriptFromString(script);
    
  } catch (error) {
    if (typeof taskUtils !== 'undefined' && taskUtils.addErrorLog) {
      taskUtils.addErrorLog(error, "loadTaskData");
    }
    if (typeof MNUtil !== 'undefined' && MNUtil.showHUD) {
      MNUtil.showHUD("加载任务数据失败");
    }
  }
}

// 处理自定义协议
todayBoardController.prototype.handleCustomProtocol = function(url) {
  try {
    const urlParts = url.split("://")[1].split("?");
    const action = urlParts[0];
    const params = this.parseQueryString(urlParts[1] || '');
    
    switch (action) {
      case 'updateStatus':
        this.updateTaskStatus(params.id);
        break;
      case 'launch':
        this.launchTask(params.id);
        break;
      case 'viewDetail':
        this.viewTaskDetail(params.id);
        break;
      case 'refresh':
        this.refreshBoard();
        break;
      case 'export':
        this.exportData();
        break;
      case 'quickStart':
        this.quickStart();
        break;
      case 'showHUD':
        if (typeof MNUtil !== 'undefined' && MNUtil.showHUD) {
          MNUtil.showHUD(decodeURIComponent(params.message || ''));
        }
        break;
      default:
        // Unknown action
    }
  } catch (error) {
    if (typeof taskUtils !== 'undefined' && taskUtils.addErrorLog) {
      taskUtils.addErrorLog(error, "handleCustomProtocol");
    }
  }
}

// 解析查询字符串
todayBoardController.prototype.parseQueryString = function(queryString) {
  const params = {};
  if (!queryString) return params;
  
  queryString.split('&').forEach(param => {
    const [key, value] = param.split('=');
    params[key] = value;
  });
  
  return params;
}

// 更新任务状态
todayBoardController.prototype.updateTaskStatus = function(taskId) {
  try {
    if (typeof MNNote === 'undefined' || typeof MNUtil === 'undefined' || typeof MNTaskManager === 'undefined') {
      return;
    }
    
    const task = MNNote.new(taskId);
    if (!task) {
      MNUtil.showHUD("任务不存在");
      return;
    }
    
    // 使用现有的状态切换功能
    MNUtil.undoGrouping(() => {
      MNTaskManager.toggleTaskStatus(task, true); // forward = true
    });
    
    // 刷新数据
    MNUtil.delay(0.3).then(() => {
      this.loadTaskData();
    });
    
    MNUtil.showHUD("状态已更新");
  } catch (error) {
    if (typeof taskUtils !== 'undefined' && taskUtils.addErrorLog) {
      taskUtils.addErrorLog(error, "updateTaskStatus");
    }
    if (typeof MNUtil !== 'undefined' && MNUtil.showHUD) {
      MNUtil.showHUD("更新状态失败");
    }
  }
}

// 启动任务
todayBoardController.prototype.launchTask = function(taskId) {
  try {
    if (typeof MNNote === 'undefined' || typeof MNUtil === 'undefined' || typeof MNTaskManager === 'undefined') {
      return;
    }
    
    const task = MNNote.new(taskId);
    if (!task) {
      MNUtil.showHUD("任务不存在");
      return;
    }
    
    const launchLink = MNTaskManager.getLaunchLink(task);
    if (!launchLink) {
      MNUtil.showHUD("此任务没有启动链接");
      return;
    }
    
    // 判断链接类型并执行
    const linkType = MNTaskManager.getLinkType(launchLink);
    
    switch (linkType) {
      case 'cardLink':
        // 卡片链接 - 直接定位
        const targetNote = MNNote.new(launchLink.noteId);
        if (targetNote) {
          targetNote.focusInFloatMindMap(0.5);
          this.close(); // 关闭看板
        }
        break;
        
      case 'uiState':
        // UI 状态链接 - 在浮窗显示
        task.focusInFloatMindMap(0.5);
        this.close(); // 关闭看板
        break;
        
      case 'external':
        // 外部链接 - 打开应用
        MNUtil.openURL(launchLink.url);
        break;
        
      default:
        MNUtil.showHUD("未知的链接类型");
    }
  } catch (error) {
    if (typeof taskUtils !== 'undefined' && taskUtils.addErrorLog) {
      taskUtils.addErrorLog(error, "launchTask");
    }
    if (typeof MNUtil !== 'undefined' && MNUtil.showHUD) {
      MNUtil.showHUD("启动任务失败");
    }
  }
}

// 查看任务详情
todayBoardController.prototype.viewTaskDetail = function(taskId) {
  try {
    if (typeof MNNote === 'undefined' || typeof MNUtil === 'undefined') {
      return;
    }
    
    const task = MNNote.new(taskId);
    if (!task) {
      MNUtil.showHUD("任务不存在");
      return;
    }
    
    // 在浮窗中显示任务详情
    task.focusInFloatMindMap(0.5);
    this.close(); // 关闭看板
  } catch (error) {
    if (typeof taskUtils !== 'undefined' && taskUtils.addErrorLog) {
      taskUtils.addErrorLog(error, "viewTaskDetail");
    }
    if (typeof MNUtil !== 'undefined' && MNUtil.showHUD) {
      MNUtil.showHUD("查看详情失败");
    }
  }
}

// 刷新看板
todayBoardController.prototype.refreshBoard = function(button) {
  MNUtil.showHUD("🔄 正在刷新...");
  this.loadTaskData();
}

// 导出数据
todayBoardController.prototype.exportData = function() {
  try {
    if (typeof MNTaskManager === 'undefined' || typeof MNUtil === 'undefined') {
      return;
    }
    
    const todayTasks = MNTaskManager.filterTodayTasks();
    const report = MNTaskManager.generateTodayReport(todayTasks);
    
    MNUtil.copy(report);
    MNUtil.showHUD("📋 今日任务报告已复制到剪贴板");
  } catch (error) {
    if (typeof taskUtils !== 'undefined' && taskUtils.addErrorLog) {
      taskUtils.addErrorLog(error, "exportData");
    }
    if (typeof MNUtil !== 'undefined' && MNUtil.showHUD) {
      MNUtil.showHUD("导出失败");
    }
  }
}

// 快速启动
todayBoardController.prototype.quickStart = function() {
  try {
    if (typeof MNTaskManager === 'undefined' || typeof MNUtil === 'undefined') {
      return;
    }
    
    // 获取第一个进行中的任务
    const todayTasks = MNTaskManager.filterTodayTasks();
    const inProgressTasks = todayTasks.filter(task => {
      const taskInfo = MNTaskManager.parseTaskTitle(task.noteTitle);
      return taskInfo.status === '进行中';
    });
    
    if (inProgressTasks.length === 0) {
      MNUtil.showHUD("没有进行中的任务");
      return;
    }
    
    // 启动第一个任务
    this.launchTask(inProgressTasks[0].noteId);
  } catch (error) {
    if (typeof taskUtils !== 'undefined' && taskUtils.addErrorLog) {
      taskUtils.addErrorLog(error, "quickStart");
    }
    if (typeof MNUtil !== 'undefined' && MNUtil.showHUD) {
      MNUtil.showHUD("快速启动失败");
    }
  }
}

// 创建按钮的通用方法
todayBoardController.prototype.createButton = function(buttonName, targetAction, superview) {
  this[buttonName] = UIButton.buttonWithType(0);
  this[buttonName].autoresizingMask = (1 << 0 | 1 << 3);
  this[buttonName].setTitleColorForState(UIColor.whiteColor(), 0);
  this[buttonName].backgroundColor = MNUtil.hexColorAlpha("#9bb2d6", 0.8);
  this[buttonName].layer.cornerRadius = 8;
  this[buttonName].layer.masksToBounds = true;
  this[buttonName].titleLabel.font = UIFont.systemFontOfSize(16);
  
  if (targetAction) {
    this[buttonName].addTargetActionForControlEvents(this, targetAction, 1 << 6);
  }
  if (superview) {
    this[superview].addSubview(this[buttonName]);
  } else {
    this.view.addSubview(this[buttonName]);
  }
}