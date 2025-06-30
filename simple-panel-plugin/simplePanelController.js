// SimplePanelController - 基于 mnai webviewController 的简洁实现
// 移除所有复杂动画，确保稳定显示

// 获取控制器实例（关键！必须遵循这个模式）
const getSimplePanelController = () => self;

var SimplePanelController = JSB.defineClass('SimplePanelController : UIViewController', {
  // 初始化
  init: function() {
    self = super.init();
    return self;
  },
  
  // 视图加载
  viewDidLoad: function() {
    try {
      let self = getSimplePanelController();
      
      MNUtil.log("🎨 SimplePanelController: viewDidLoad 开始");
      
      // 设置基础 frame（参考 mnai）
      self.view.frame = {x: 50, y: 50, width: 400, height: 300};
      self.currentFrame = self.view.frame;
      
      // 设置视图属性
      self.setupView();
      
      // 创建 UI 组件
      self.createTitleBar();
      self.createContentArea();
      self.createButtons();
      
      // 添加手势
      self.setupGestures();
      
      MNUtil.log("✅ SimplePanelController: viewDidLoad 完成");
      
    } catch (error) {
      MNUtil.addErrorLog(error, "viewDidLoad");
    }
  },
  
  // 设置视图基础属性
  setupView: function() {
    let self = getSimplePanelController();
    
    // 基础样式
    self.view.backgroundColor = UIColor.whiteColor();
    self.view.layer.cornerRadius = 10;
    self.view.layer.shadowOffset = {width: 0, height: 2};
    self.view.layer.shadowRadius = 10;
    self.view.layer.shadowOpacity = 0.3;
    self.view.layer.shadowColor = UIColor.blackColor();
    
    // 启用用户交互
    self.view.userInteractionEnabled = true;
  },
  
  // 创建标题栏
  createTitleBar: function() {
    let self = getSimplePanelController();
    
    // 标题栏
    self.titleBar = UIView.new();
    self.titleBar.backgroundColor = UIColor.colorWithHexString("#5982c4");
    self.titleBar.userInteractionEnabled = true;
    self.view.addSubview(self.titleBar);
    
    // 标题文本
    self.titleLabel = UILabel.new();
    self.titleLabel.text = "Simple Panel";
    self.titleLabel.textColor = UIColor.whiteColor();
    self.titleLabel.font = UIFont.boldSystemFontOfSize(16);
    self.titleLabel.textAlignment = 1; // 居中
    self.titleBar.addSubview(self.titleLabel);
    
    // 关闭按钮
    self.closeButton = UIButton.buttonWithType(0);
    self.closeButton.setTitleForState("✕", 0);
    self.closeButton.setTitleColorForState(UIColor.whiteColor(), 0);
    self.closeButton.titleLabel.font = UIFont.systemFontOfSize(20);
    self.closeButton.addTargetActionForControlEvents(self, "close:", 1 << 6);
    self.titleBar.addSubview(self.closeButton);
    
    // 移动按钮（用于拖动）
    self.moveButton = UIButton.buttonWithType(0);
    self.moveButton.backgroundColor = UIColor.whiteColor().colorWithAlphaComponent(0.3);
    self.moveButton.layer.cornerRadius = 15;
    self.titleBar.addSubview(self.moveButton);
  },
  
  // 创建内容区域
  createContentArea: function() {
    let self = getSimplePanelController();
    
    // 内容容器
    self.contentView = UIView.new();
    self.contentView.backgroundColor = UIColor.colorWithHexString("#f5f5f5");
    self.view.addSubview(self.contentView);
    
    // 输入框
    self.inputField = UITextView.new();
    self.inputField.font = UIFont.systemFontOfSize(16);
    self.inputField.layer.cornerRadius = 8;
    self.inputField.backgroundColor = UIColor.whiteColor();
    self.inputField.text = "在这里输入文本...";
    self.inputField.textContainerInset = {top: 8, left: 8, bottom: 8, right: 8};
    self.contentView.addSubview(self.inputField);
    
    // 输出框
    self.outputField = UITextView.new();
    self.outputField.font = UIFont.systemFontOfSize(16);
    self.outputField.layer.cornerRadius = 8;
    self.outputField.backgroundColor = UIColor.whiteColor();
    self.outputField.text = "处理结果...";
    self.outputField.textContainerInset = {top: 8, left: 8, bottom: 8, right: 8};
    self.outputField.editable = false;
    self.contentView.addSubview(self.outputField);
  },
  
  // 创建功能按钮
  createButtons: function() {
    let self = getSimplePanelController();
    
    // 按钮容器
    self.buttonContainer = UIView.new();
    self.view.addSubview(self.buttonContainer);
    
    // 处理按钮
    if (typeof MNButton !== "undefined") {
      self.processButton = MNButton.new({
        title: "处理文本",
        font: 16,
        color: "#007AFF",
        radius: 8
      }, self.buttonContainer);
      
      self.processButton.addClickAction(self, "processText:");
    } else {
      // 降级方案：使用原生按钮
      self.processButton = UIButton.buttonWithType(0);
      self.processButton.setTitleForState("处理文本", 0);
      self.processButton.setTitleColorForState(UIColor.whiteColor(), 0);
      self.processButton.backgroundColor = UIColor.colorWithHexString("#007AFF");
      self.processButton.layer.cornerRadius = 8;
      self.processButton.titleLabel.font = UIFont.systemFontOfSize(16);
      self.processButton.addTargetActionForControlEvents(self, "processText:", 1 << 6);
      self.buttonContainer.addSubview(self.processButton);
    }
  },
  
  // 设置手势
  setupGestures: function() {
    let self = getSimplePanelController();
    
    // 拖动手势
    self.moveGesture = new UIPanGestureRecognizer(self, "onMoveGesture:");
    self.moveButton.addGestureRecognizer(self.moveGesture);
    
    // 双击最小化手势
    self.doubleTapGesture = new UITapGestureRecognizer(self, "onDoubleTap:");
    self.doubleTapGesture.numberOfTapsRequired = 2;
    self.titleBar.addGestureRecognizer(self.doubleTapGesture);
  },
  
  // 视图布局
  viewWillLayoutSubviews: function() {
    try {
      let self = getSimplePanelController();
      
      let bounds = self.view.bounds;
      let width = bounds.width;
      let height = bounds.height;
      
      // 标题栏
      self.titleBar.frame = {x: 0, y: 0, width: width, height: 44};
      self.titleLabel.frame = {x: 50, y: 0, width: width - 100, height: 44};
      self.closeButton.frame = {x: width - 40, y: 7, width: 30, height: 30};
      self.moveButton.frame = {x: 10, y: 7, width: 30, height: 30};
      
      // 内容区域
      self.contentView.frame = {x: 0, y: 44, width: width, height: height - 44 - 50};
      
      // 输入输出框（垂直平分）
      let contentHeight = self.contentView.bounds.height;
      let fieldHeight = (contentHeight - 30) / 2;
      
      self.inputField.frame = {x: 10, y: 10, width: width - 20, height: fieldHeight};
      self.outputField.frame = {x: 10, y: fieldHeight + 20, width: width - 20, height: fieldHeight};
      
      // 按钮容器
      self.buttonContainer.frame = {x: 0, y: height - 50, width: width, height: 50};
      
      // 处理按钮
      self.processButton.frame = {x: 10, y: 5, width: width - 20, height: 40};
      
    } catch (error) {
      MNUtil.addErrorLog(error, "viewWillLayoutSubviews");
    }
  },
  
  // === 事件处理 ===
  
  // 关闭面板
  close: function(sender) {
    let self = getSimplePanelController();
    self.view.hidden = true;
    MNUtil.log("🚪 SimplePanelController: 面板已关闭");
  },
  
  // 处理文本
  processText: function(sender) {
    let self = getSimplePanelController();
    
    try {
      let inputText = self.inputField.text;
      
      if (!inputText || inputText === "在这里输入文本...") {
        MNUtil.showHUD("请输入文本");
        return;
      }
      
      // 简单的文本处理示例
      let processed = inputText.toUpperCase();
      self.outputField.text = processed;
      
      MNUtil.showHUD("处理完成");
      
    } catch (error) {
      MNUtil.addErrorLog(error, "processText");
      MNUtil.showHUD("处理失败");
    }
  },
  
  // 拖动手势处理
  onMoveGesture: function(gesture) {
    let self = getSimplePanelController();
    
    let translation = gesture.translationInView(MNUtil.studyView);
    
    if (gesture.state === 1) { // Began
      self.dragStartFrame = self.view.frame;
    } else if (gesture.state === 2) { // Changed
      let newFrame = {
        x: self.dragStartFrame.x + translation.x,
        y: self.dragStartFrame.y + translation.y,
        width: self.dragStartFrame.width,
        height: self.dragStartFrame.height
      };
      
      // 边界检查
      let studyBounds = MNUtil.studyView.bounds;
      newFrame.x = Math.max(0, Math.min(newFrame.x, studyBounds.width - newFrame.width));
      newFrame.y = Math.max(0, Math.min(newFrame.y, studyBounds.height - newFrame.height));
      
      self.view.frame = newFrame;
    } else if (gesture.state === 3) { // Ended
      self.currentFrame = self.view.frame;
      MNUtil.studyView.bringSubviewToFront(self.view);
    }
  },
  
  // 双击处理
  onDoubleTap: function(gesture) {
    let self = getSimplePanelController();
    
    MNUtil.animate(() => {
      self.view.frame = {x: 50, y: 50, width: 400, height: 300};
      self.currentFrame = self.view.frame;
    }, 0.3);
  },
  
  // === 公共方法 ===
  
  // 显示面板
  show: function() {
    let self = getSimplePanelController();
    MNUtil.log("👀 SimplePanelController: show 被调用");
    
    // 获取选中文本
    try {
      let selectedText = MNUtil.currentDocumentController.selectionText;
      if (selectedText && selectedText.length > 0) {
        self.inputField.text = selectedText;
      }
    } catch (e) {
      // 忽略获取选中文本的错误
    }
  },
  
  // 隐藏面板
  hide: function() {
    let self = getSimplePanelController();
    MNUtil.log("👋 SimplePanelController: hide 被调用");
  }
}, {
  // 类方法
  new: function() {
    return SimplePanelController.alloc().init();
  }
});