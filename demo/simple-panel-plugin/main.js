// 在文件开头尝试加载 MNUtils
if (typeof JSB !== 'undefined' && typeof JSB.require === 'function') {
  try {
    JSB.require('mnutils');
  } catch (e) {
    // MNUtils 不可用
  }
}

JSB.newAddon = function (mainPath) {
  // 定义插件主类
  var SimplePlugin = JSB.defineClass(
    'SimplePlugin : JSExtension',
    {
      // === 实例方法 ===
      
      // 场景连接时初始化
      sceneWillConnect: function () {
        self.mainPath = mainPath;
        self.appInstance = Application.sharedInstance();
        
        // 调试日志
        if (typeof MNUtil !== "undefined" && MNUtil.log) {
          MNUtil.log("🚀 Simple Panel: sceneWillConnect");
        }
        
        // 创建控制面板控制器
        self.panelController = SimplePanelController.new();
        self.panelController.mainPath = mainPath;
        
        // 确保视图被加载
        if (self.panelController.view) {
          if (typeof MNUtil !== "undefined" && MNUtil.log) {
            MNUtil.log("✅ Simple Panel: panelController.view 存在");
          }
        } else {
          if (typeof MNUtil !== "undefined" && MNUtil.log) {
            MNUtil.log("❌ Simple Panel: panelController.view 是 null");
          }
        }
      },
      
      // 场景断开连接
      sceneDidDisconnect: function () {
        // 清理资源
      },
      
      // 笔记本打开时
      notebookWillOpen: function (/* notebookid */) {
        
        // 调试日志
        var studyMode = self.appInstance.studyController(self.window).studyMode;
        if (typeof MNUtil !== "undefined" && MNUtil.log) {
          MNUtil.log("📖 Simple Panel: notebookWillOpen, studyMode=" + studyMode);
        }
        
        // 只在文档/学习模式下显示（不在复习模式）
        if (studyMode < 3) {
          // 刷新插件栏图标
          self.appInstance.studyController(self.window).refreshAddonCommands();
          
          // 延迟添加控制面板到视图，避免阻塞主线程
          NSTimer.scheduledTimerWithTimeInterval(0.1, false, function() {
            var studyView = self.appInstance.studyController(self.window).view;
            if (studyView && self.panelController && self.panelController.view) {
              // 先设置 frame，确保面板不会铺满整个屏幕
              self.panelController.view.frame = {x: 100, y: 100, width: 400, height: 350};
              
              studyView.addSubview(self.panelController.view);
              self.panelController.view.hidden = true;
              
              if (typeof MNUtil !== "undefined" && MNUtil.log) {
                MNUtil.log("✅ Simple Panel: 控制面板已添加到视图");
              }
            }
          });
          
          // 监听选择事件（可选）
          NSNotificationCenter.defaultCenter()
            .addObserverSelectorName(self, 'onSelectionChanged:', 'PopupMenuOnSelection');
        }
      },
      
      // 笔记本关闭时
      notebookWillClose: function (/* notebookid */) {
        // 移除观察者
        NSNotificationCenter.defaultCenter().removeObserver(self);
      },
      
      // 查询插件状态（显示图标）
      queryAddonCommandStatus: function () {
        
        if (self.appInstance.studyController(self.window).studyMode < 3) {
          var result = {
            image: 'logo.png',
            object: self,
            selector: 'togglePanel:',
            checked: self.panelController && !self.panelController.view.hidden
          };
          
          return result;
        }
        return null;
      },
      
      // 切换面板显示
      togglePanel: function (/* sender */) {
        
        // 调试日志
        if (typeof MNUtil !== "undefined" && MNUtil.log) {
          MNUtil.log("🔄 Simple Panel: togglePanel called");
        }
        
        if (!self.panelController) {
          if (typeof MNUtil !== "undefined" && MNUtil.log) {
            MNUtil.log("❌ Simple Panel: panelController is null!");
          }
          return;
        }
        
        // 确保视图已经正确添加
        if (!self.panelController.view.superview) {
          var studyView = self.appInstance.studyController(self.window).view;
          if (studyView) {
            // 设置正确的 frame 再添加
            self.panelController.view.frame = {x: 100, y: 100, width: 400, height: 350};
            studyView.addSubview(self.panelController.view);
          }
        }
        
        // 尝试获取选中文本
        var selectedText = null;
        try {
          var readerController = self.appInstance.studyController(self.window).readerController;
          if (readerController && readerController.currentDocumentController) {
            selectedText = readerController.currentDocumentController.selectionText;
          }
        } catch (e) {
          if (typeof MNUtil !== "undefined" && MNUtil.log) {
            MNUtil.log("⚠️ Simple Panel: 获取选中文本失败");
          }
        }
        
        // 切换显示状态
        if (selectedText) {
          self.panelController.inputField.text = selectedText;
          self.panelController.view.hidden = false;
        } else {
          self.panelController.view.hidden = !self.panelController.view.hidden;
        }
        
        if (typeof MNUtil !== "undefined" && MNUtil.log) {
          MNUtil.log("🔄 Simple Panel: 面板状态 = " + (self.panelController.view.hidden ? "隐藏" : "显示"));
        }
        
        // 延迟刷新插件栏图标状态，避免阻塞
        NSTimer.scheduledTimerWithTimeInterval(0.1, false, function() {
          self.appInstance.studyController(self.window).refreshAddonCommands();
        });
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