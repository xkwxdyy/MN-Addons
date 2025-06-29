// 全局变量，保存插件实例引用
var self = null;

JSB.newAddon = function (mainPath) {
  // 定义插件主类
  var SimplePlugin = JSB.defineClass(
    'SimplePlugin : JSExtension',
    {
      // === 实例方法 ===
      
      // 场景连接时初始化
      sceneWillConnect: function () {
        self = this;
        self.mainPath = mainPath;
        self.appInstance = Application.sharedInstance();
        
        // 创建控制面板控制器
        self.panelController = SimplePanelController.new();
        self.panelController.mainPath = mainPath;
      },
      
      // 场景断开连接
      sceneDidDisconnect: function () {
        // 清理资源
        self = null;
      },
      
      // 笔记本打开时
      notebookWillOpen: function (notebookid) {
        // 只在文档/学习模式下显示（不在复习模式）
        if (self.appInstance.studyController(self.window).studyMode < 3) {
          // 刷新插件栏图标
          self.appInstance.studyController(self.window).refreshAddonCommands();
          
          // 添加控制面板到视图
          var studyView = self.appInstance.studyController(self.window).view;
          studyView.addSubview(self.panelController.view);
          self.panelController.view.hidden = true;
          
          // 监听选择事件（可选）
          NSNotificationCenter.defaultCenter()
            .addObserverSelectorName(self, 'onSelectionChanged:', 'PopupMenuOnSelection');
        }
      },
      
      // 笔记本关闭时
      notebookWillClose: function (notebookid) {
        // 移除观察者
        NSNotificationCenter.defaultCenter().removeObserver(self);
      },
      
      // 查询插件状态（显示图标）
      queryAddonCommandStatus: function () {
        if (self.appInstance.studyController(self.window).studyMode < 3) {
          return {
            image: 'logo.png',
            object: self,
            selector: 'togglePanel:',
            checked: self.panelController && !self.panelController.view.hidden
          };
        }
        return null;
      },
      
      // 切换面板显示
      togglePanel: function (sender) {
        if (!self.panelController) return;
        
        // 尝试获取选中文本
        var selectedText = null;
        try {
          selectedText = self.appInstance.studyController(self.window)
            .readerController.currentDocumentController.selectionText;
        } catch (e) {
          // 忽略错误
        }
        
        if (selectedText) {
          self.panelController.inputField.text = selectedText;
          self.panelController.view.hidden = false;
        } else {
          self.panelController.view.hidden = !self.panelController.view.hidden;
        }
        
        // 刷新插件栏图标状态
        self.appInstance.studyController(self.window).refreshAddonCommands();
      },
      
      // 选择变化时（可选）
      onSelectionChanged: function (sender) {
        if (!self.panelController || self.panelController.view.hidden) return;
        
        var text = sender.userInfo.documentController.selectionText;
        if (text) {
          self.panelController.inputField.text = text;
        }
      }
    },
    {
      // === 静态方法 ===
      addonDidConnect: function () {
      },
      
      addonWillDisconnect: function () {
      }
    }
  );
  
  return SimplePlugin;
};

// 在文件末尾加载依赖
JSB.require('simplePanelController');