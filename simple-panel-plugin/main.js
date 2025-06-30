// Simple Panel Plugin - 基于 mnai 架构的简洁实现
// 遵循 MarginNote 插件开发最佳实践

JSB.newAddon = function (mainPath) {
  // 1. 加载依赖
  JSB.require('mnutils');
  
  // 检查 MNUtils 是否可用
  if (typeof MNUtil === 'undefined') {
    return JSB.defineClass('SimplePanel : JSExtension', {
      sceneWillConnect: function() {
        Application.sharedInstance().showHUD("请先安装 MNUtils", 3);
      }
    });
  }
  
  // 2. 加载控制器
  JSB.require('simplePanelController');
  
  // 3. 获取插件实例（关键！遵循 mnai 模式）
  const getSimplePanel = () => self;
  
  // 4. 定义插件主类
  var SimplePanel = JSB.defineClass('SimplePanel : JSExtension', {
    // 初始化
    init: function(path) {
      self.mainPath = path;
      self.panelController = null;
    },
    
    // 场景连接时调用（插件启动）
    sceneWillConnect: async function() {
      try {
        // 初始化 MNUtil
        MNUtil.init(self.mainPath);
        MNUtil.log("🚀 Simple Panel: 插件启动");
        
        // 初始化插件
        self.init(mainPath);
        
      } catch (error) {
        MNUtil.addErrorLog(error, "sceneWillConnect");
      }
    },
    
    // 笔记本打开时
    notebookWillOpen: async function(notebookId) {
      try {
        let self = getSimplePanel();
        
        MNUtil.log("📖 Simple Panel: 笔记本打开");
        
        // 确保插件已初始化
        if (!self.mainPath) {
          self.init(mainPath);
        }
        
        // 创建面板控制器
        self.ensurePanelController();
        
        // 刷新插件栏
        MNUtil.refreshAddonCommands();
        
      } catch (error) {
        MNUtil.addErrorLog(error, "notebookWillOpen");
      }
    },
    
    // 确保面板控制器存在
    ensurePanelController: function() {
      let self = getSimplePanel();
      
      if (!self.panelController) {
        MNUtil.log("🔧 Simple Panel: 创建面板控制器");
        
        self.panelController = SimplePanelController.new();
        self.panelController.mainPath = self.mainPath;
        
        // 确保视图添加到 studyView
        if (self.panelController.view && MNUtil.studyView) {
          MNUtil.studyView.addSubview(self.panelController.view);
          self.panelController.view.hidden = true; // 初始隐藏
        }
      }
    },
    
    // 查询插件按钮状态
    queryAddonCommandStatus: function() {
      let self = getSimplePanel();
      
      // 只在学习模式下显示
      if (MNUtil.studyController.studyMode >= 3) {
        return null;
      }
      
      // 确保控制器存在
      self.ensurePanelController();
      
      return {
        image: 'logo.png',
        object: self,
        selector: 'togglePanel:',
        checked: false
      };
    },
    
    // 切换面板显示/隐藏
    togglePanel: function(button) {
      try {
        let self = getSimplePanel();
        
        MNUtil.log("🎯 Simple Panel: 切换面板");
        
        if (!self.panelController) {
          self.ensurePanelController();
        }
        
        if (self.panelController.view.hidden) {
          self.showPanel();
        } else {
          self.hidePanel();
        }
        
      } catch (error) {
        MNUtil.addErrorLog(error, "togglePanel");
        MNUtil.showHUD("操作失败: " + error.message);
      }
    },
    
    // 显示面板
    showPanel: function() {
      let self = getSimplePanel();
      
      if (!self.panelController) return;
      
      // 确保视图在最前面
      MNUtil.studyView.bringSubviewToFront(self.panelController.view);
      
      // 显示面板
      self.panelController.view.hidden = false;
      
      // 调用控制器的 show 方法
      if (self.panelController.show) {
        self.panelController.show();
      }
      
      MNUtil.log("✅ Simple Panel: 面板已显示");
    },
    
    // 隐藏面板
    hidePanel: function() {
      let self = getSimplePanel();
      
      if (!self.panelController) return;
      
      self.panelController.view.hidden = true;
      
      // 调用控制器的 hide 方法
      if (self.panelController.hide) {
        self.panelController.hide();
      }
      
      MNUtil.log("✅ Simple Panel: 面板已隐藏");
    },
    
    // 场景断开时清理资源
    sceneDidDisconnect: function() {
      try {
        let self = getSimplePanel();
        
        MNUtil.log("🛑 Simple Panel: 插件关闭");
        
        // 清理控制器
        if (self.panelController) {
          if (self.panelController.view) {
            self.panelController.view.removeFromSuperview();
          }
          self.panelController = null;
        }
        
      } catch (error) {
        MNUtil.log("清理错误: " + error.message);
      }
    }
  });
  
  return SimplePanel;
};