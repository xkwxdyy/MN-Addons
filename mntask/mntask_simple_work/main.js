// MNTask 简单版本 - 基于稳定框架逐步添加功能
JSB.newAddon = function(mainPath) {
  // 定义插件主类
  var MNTaskSimple = JSB.defineClass('MNTaskSimple : JSExtension', {
    // 场景连接时调用
    sceneWillConnect: function() {
      self.enabled = false;  // 插件启用状态
      self.mainPath = mainPath;  // 保存路径
      
      // 简单的配置
      self.taskPrefix = "【任务】";
      self.colorIndex = 6;  // 蓝色
    },
    
    // 查询插件命令状态
    queryAddonCommandStatus: function() {
      return {
        image: 'logo.png',
        object: self,
        selector: "toggleTask:",
        checked: self.enabled
      };
    },
    
    // 点击插件图标
    toggleTask: function(sender) {
      self.enabled = !self.enabled;
      
      var app = Application.sharedInstance();
      if (self.enabled) {
        app.showHUD("✅ 任务模式已启用", app.focusWindow, 2);
      } else {
        app.showHUD("❌ 任务模式已关闭", app.focusWindow, 2);
      }
      
      // 刷新插件栏
      app.studyController(self.focusWindow).refreshAddonCommands();
    },
    
    // 笔记弹出菜单
    onPopupMenuOnNote: function(note) {
      if (!self.enabled || !note) return null;
      
      // 判断是否是任务
      var isTask = note.noteTitle && note.noteTitle.indexOf(self.taskPrefix) === 0;
      
      if (isTask) {
        // 任务菜单
        return [
          {
            title: "✅ 标记完成",
            object: self,
            selector: "markComplete:",
            param: note.noteId
          }
        ];
      } else {
        // 普通笔记菜单
        return [
          {
            title: "📋 转为任务",
            object: self,
            selector: "convertToTask:",
            param: note.noteId
          }
        ];
      }
    },
    
    // 选择文本弹出菜单
    onPopupMenuOnSelection: function(selection) {
      if (!self.enabled || !selection || !selection.text) return null;
      
      return [
        {
          title: "📋 创建任务",
          object: self,
          selector: "createTask:",
          param: selection.text
        }
      ];
    },
    
    // 创建任务
    createTask: function(text) {
      try {
        // 获取当前笔记本
        var app = Application.sharedInstance();
        var studyController = app.studyController(app.focusWindow);
        var notebookController = studyController.notebookController;
        
        if (!notebookController || !notebookController.notebookId) {
          app.showHUD("❌ 请先打开笔记本", app.focusWindow, 2);
          return;
        }
        
        // 创建任务标题
        var title = self.taskPrefix + text;
        
        // 这里只是显示提示，实际创建需要 MNUtils
        app.showHUD("📋 将创建任务: " + title, app.focusWindow, 3);
        
      } catch (error) {
        Application.sharedInstance().showHUD(
          "❌ 创建失败: " + error.message,
          Application.sharedInstance().focusWindow, 
          2
        );
      }
    },
    
    // 转为任务
    convertToTask: function(noteId) {
      try {
        var app = Application.sharedInstance();
        app.showHUD("📋 将转换为任务", app.focusWindow, 2);
        
        // 实际功能需要 MNUtils
      } catch (error) {
        Application.sharedInstance().showHUD(
          "❌ 转换失败: " + error.message,
          Application.sharedInstance().focusWindow, 
          2
        );
      }
    },
    
    // 标记完成
    markComplete: function(noteId) {
      try {
        var app = Application.sharedInstance();
        app.showHUD("✅ 任务已完成", app.focusWindow, 2);
        
        // 实际功能需要 MNUtils
      } catch (error) {
        Application.sharedInstance().showHUD(
          "❌ 操作失败: " + error.message,
          Application.sharedInstance().focusWindow, 
          2
        );
      }
    },
    
    // 场景断开
    sceneDidDisconnect: function() {
      // 清理
    }
  }, {
    // 静态方法
    addonDidConnect: function() {
      // 插件连接
    },
    
    addonWillDisconnect: function() {
      // 插件断开
    }
  });
  
  return MNTaskSimple;
};

// 暂时不加载任何依赖