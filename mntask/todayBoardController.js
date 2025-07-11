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
      
      // 设置视图属性（参考 mnai 和 mnbrowser）
      self.view.backgroundColor = UIColor.whiteColor(); // 设置白色背景，避免透明
      self.view.layer.shadowOffset = {width: 0, height: 0};
      self.view.layer.shadowRadius = 15;
      self.view.layer.shadowOpacity = 0.5;
      self.view.layer.shadowColor = UIColor.colorWithWhiteAlpha(0.5, 1);
      self.view.layer.cornerRadius = 11;
      self.view.layer.opacity = 1.0;
      self.view.layer.borderColor = MNUtil.hexColorAlpha("#9bb2d6", 0.8);
      self.view.layer.borderWidth = 0;
      self.view.autoresizingMask = (1 << 0 | 1 << 3); // 自动调整位置
      
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
    
    // 使用 hide 方法隐藏视图（不再使用模态关闭）
    self.hide();
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
    let self = getTodayBoardController();
    
    // 标记 WebView 已加载完成
    self.webViewLoaded = true;
    
    // 延迟一点执行，确保 HTML 中的 JavaScript 已初始化
    if (typeof MNUtil !== 'undefined' && MNUtil.delay) {
      MNUtil.delay(0.2).then(() => {
        self.loadTaskData();
      });
    }
  }
});

// ========== 原型方法扩展 ==========

// 初始化
todayBoardController.prototype.init = function() {
  // 简化主路径获取
  this.mainPath = taskUtils.mainPath || '';
  this.htmlPath = this.mainPath + '/todayboard.html';
  this.refreshTimer = null;
  this.webViewLoaded = false;  // 标记 WebView 是否已加载
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
    // 使用正确的方法加载 HTML 文件（参考 mneditor 的做法）
    this.webView.loadFileURLAllowingReadAccessToURL(
      NSURL.fileURLWithPath(this.htmlPath),
      NSURL.fileURLWithPath(this.mainPath)  // 移除末尾的斜杠
    );
    
    // 数据加载现在在 webViewDidFinishLoad 中处理
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
    // 检查 WebView 状态
    if (!this.webView) {
      MNUtil.log("❌ WebView 未创建");
      return;
    }
    
    if (!this.webViewLoaded) {
      MNUtil.log("❌ WebView 未加载完成");
      return;
    }
    
    if (typeof MNTaskManager === 'undefined') {
      MNUtil.log("❌ MNTaskManager 未定义");
      MNUtil.showHUD("任务管理器未初始化");
      return;
    }
    
    // 获取今日任务（尝试从更多地方搜索）
    let todayTasks = MNTaskManager.filterTodayTasks();
    
    // 如果默认搜索没有结果，尝试全局搜索
    if (todayTasks.length === 0) {
      MNUtil.log("⚠️ 默认看板无今日任务，尝试全局搜索");
      todayTasks = MNTaskManager.filterTodayTasks({
        includeAll: true,
        statuses: ['未开始', '进行中', '已完成']  // 包含已完成的任务
      });
    }
    
    MNUtil.log(`📊 找到 ${todayTasks.length} 个今日任务`);
    
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
    MNUtil.log(`📊 准备传递 ${displayTasks.length} 个任务到 WebView`);
    
    // 先检查函数是否存在
    const checkScript = "typeof loadTasksFromPlugin !== 'undefined'";
    const funcExists = this.webView.stringByEvaluatingJavaScriptFromString(checkScript);
    MNUtil.log(`🔍 loadTasksFromPlugin 函数存在: ${funcExists}`);
    
    const encodedTasks = encodeURIComponent(JSON.stringify(displayTasks));
    const script = `loadTasksFromPlugin('${encodedTasks}')`;
    const result = this.webView.stringByEvaluatingJavaScriptFromString(script);
    
    if (result) {
      MNUtil.log(`✅ JavaScript 执行结果: ${result}`);
    } else {
      MNUtil.log("✅ 任务数据已传递到 WebView");
    }
    
  } catch (error) {
    if (typeof taskUtils !== 'undefined' && taskUtils.addErrorLog) {
      taskUtils.addErrorLog(error, "loadTaskData");
    }
    
    // 输出详细错误信息
    if (typeof MNUtil !== 'undefined' && MNUtil.log) {
      MNUtil.log(`❌ loadTaskData 错误: ${error.message || error}`);
      MNUtil.log(`❌ 错误堆栈: ${error.stack || '无'}`);
    }
    
    if (typeof MNUtil !== 'undefined' && MNUtil.showHUD) {
      MNUtil.showHUD(`加载任务数据失败: ${error.message || '未知错误'}`);
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
  
  // 自动修复旧版今日标记
  if (typeof MNTaskManager !== 'undefined' && MNTaskManager.fixLegacyTodayMarks) {
    const fixedCount = MNTaskManager.fixLegacyTodayMarks();
    if (fixedCount > 0) {
      // 延迟一下再加载数据，确保修复完成
      MNUtil.delay(0.5).then(() => {
        this.loadTaskData();
      });
      return;
    }
  }
  
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

// 显示看板（参考 mnai 的实现）
todayBoardController.prototype.show = function() {
  try {
    // 将视图置于最前
    MNUtil.studyView.bringSubviewToFront(this.view);
    
    // 保存当前透明度
    const preOpacity = this.view.layer.opacity;
    this.view.layer.opacity = 0.2;
    
    // 显示视图
    this.view.hidden = false;
    
    // 动画显示
    if (typeof MNUtil !== 'undefined' && MNUtil.animate) {
      MNUtil.animate(() => {
        this.view.layer.opacity = preOpacity;
      }).then(() => {
        this.view.layer.borderWidth = 0;
        this.view.layer.opacity = 1.0;
        MNUtil.studyView.bringSubviewToFront(this.view);
      });
    } else {
      // 没有动画时直接显示
      this.view.layer.opacity = 1.0;
    }
    
    // 数据加载已在 loadTodayBoard 中处理，避免重复调用
    
  } catch (error) {
    if (typeof taskUtils !== 'undefined' && taskUtils.addErrorLog) {
      taskUtils.addErrorLog(error, "todayBoardController.show");
    }
  }
}

// 隐藏看板（参考 mnai 的实现）
todayBoardController.prototype.hide = function() {
  try {
    const preOpacity = this.view.layer.opacity;
    
    // 动画隐藏
    if (typeof MNUtil !== 'undefined' && MNUtil.animate) {
      MNUtil.animate(() => {
        this.view.layer.opacity = 0.2;
      }).then(() => {
        this.view.hidden = true;
        this.view.layer.opacity = preOpacity;
      });
    } else {
      // 没有动画时直接隐藏
      this.view.hidden = true;
    }
    
  } catch (error) {
    if (typeof taskUtils !== 'undefined' && taskUtils.addErrorLog) {
      taskUtils.addErrorLog(error, "todayBoardController.hide");
    }
  }
}