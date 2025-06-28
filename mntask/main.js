JSB.newAddon = function(mainPath) {
  // 定义插件主类
  var MNTaskMain = JSB.defineClass("MNTaskMain : JSExtension", {
    // 场景连接时调用（插件启动）
    sceneWillConnect: function() {
      // 保存插件路径
      self.path = mainPath;
      self.taskController = null;
      
      if (typeof MNUtil !== "undefined" && MNUtil.log) {
        MNUtil.log("🔧 MNTask 插件启动");
      }
      
      // 初始化 MNUtils（必须在保存 path 之后）
      if (typeof MNUtil !== "undefined") {
        try {
          MNUtil.init(self.path);
        } catch (error) {
          // 忽略初始化错误
        }
      }
      
      // 延迟加载依赖，避免循环引用
      self.loadDependencies();
      
      // 初始化配置
      self.taskConfig = {
        version: "1.0.0",
        taskNotebookId: null,  // 存储任务的笔记本ID
        taskPrefix: "【任务】",
        subTaskPrefix: "【子任务】",
        todayTag: "#今日任务",
        colorMapping: {
          pending: 13,      // 灰色 - 待办
          inProgress: 6,    // 蓝色 - 进行中
          completed: 5,     // 绿色 - 已完成
          overdue: 7        // 红色 - 已过期
        }
      };
      
      // 加载用户配置
      self.loadConfig();
    },
    
    // 加载依赖模块
    loadDependencies: function() {
      try {
        JSB.require('taskModel');
        if (typeof MNUtil !== "undefined" && MNUtil.log) {
          MNUtil.log("✅ taskModel 加载成功");
        }
      } catch (error) {
        if (typeof MNUtil !== "undefined" && MNUtil.log) {
          MNUtil.log("❌ 加载 taskModel 失败: " + error.message);
        }
      }
      
      try {
        JSB.require('taskController');
        if (typeof MNUtil !== "undefined" && MNUtil.log) {
          MNUtil.log("✅ taskController 加载成功");
        }
      } catch (error) {
        if (typeof MNUtil !== "undefined" && MNUtil.log) {
          MNUtil.log("❌ 加载 taskController 失败: " + error.message);
        }
      }
    },
    
    // 场景断开时调用（插件关闭）
    sceneDidDisconnect: function() {
      if (typeof MNUtil !== "undefined" && MNUtil.log) {
        MNUtil.log("🔧 MNTask 插件关闭");
      }
      
      // 保存配置
      self.saveConfig();
      
      // 清理资源
      if (self.taskController) {
        if (self.taskController.close) {
          self.taskController.close();
        }
        self.taskController = null;
      }
    },
    
    // 笔记本打开时调用
    notebookWillOpen: function(notebookId) {
      if (typeof MNUtil !== "undefined" && MNUtil.log) {
        MNUtil.log("📚 笔记本打开: " + notebookId);
      }
      
      // 检查是否是任务笔记本
      if (self.taskConfig.taskNotebookId === notebookId) {
        // 刷新任务列表
        self.refreshTasks();
      }
    },
    
    // 笔记本关闭时调用
    notebookWillClose: function(notebookId) {
      if (typeof MNUtil !== "undefined" && MNUtil.log) {
        MNUtil.log("📚 笔记本关闭: " + notebookId);
      }
    },
    
    // 文档打开时调用
    documentDidOpen: function(docMd5) {
      if (typeof MNUtil !== "undefined" && MNUtil.log) {
        MNUtil.log("📄 文档打开: " + docMd5);
      }
    },
    
    // 文档关闭时调用
    documentWillClose: function(docMd5) {
      if (typeof MNUtil !== "undefined" && MNUtil.log) {
        MNUtil.log("📄 文档关闭: " + docMd5);
      }
    },
    
    // 控制中心打开时调用
    controllerWillLayoutSubviews: function(controller) {
      if (controller.type == 1) {
        // 在设置页面添加任务管理入口
        if (typeof MNButton !== "undefined") {
          try {
            let taskButton = MNButton.new({
              title: "任务管理",
              height: 50,
              handler: function() {
                self.showTaskManager();
              }
            });
            controller.addSubview(taskButton.button);
          } catch (error) {
            // 忽略按钮创建错误
          }
        }
      }
    },
    
    // 处理笔记的弹出菜单
    onPopupMenuOnNote: function(note) {
      if (!note || typeof MNUtil === "undefined") return null;
      
      // 判断是否是任务卡片
      const isTask = note.noteTitle && note.noteTitle.startsWith(self.taskConfig.taskPrefix);
      const isSubTask = note.noteTitle && note.noteTitle.startsWith(self.taskConfig.subTaskPrefix);
      
      if (isTask || isSubTask) {
        // 为任务卡片添加特殊菜单项
        return [
          {
            title: "📊 更新进度",
            handler: function() {
              self.updateTaskProgress(note);
            }
          },
          {
            title: "✅ 标记完成",
            handler: function() {
              self.markTaskComplete(note);
            }
          },
          {
            title: "📌 设为今日任务",
            handler: function() {
              self.markAsTodayTask(note);
            }
          }
        ];
      } else {
        // 为普通卡片添加转换为任务的选项
        return [
          {
            title: "📋 转为任务",
            handler: function() {
              self.convertToTask(note);
            }
          }
        ];
      }
    },
    
    // 处理选择区域的弹出菜单
    onPopupMenuOnSelection: function(selection) {
      if (!selection || !selection.text || typeof MNUtil === "undefined") return null;
      
      return [
        {
          title: "📋 创建任务",
          handler: function() {
            self.createTaskFromSelection(selection.text);
          }
        }
      ];
    },
    
    // === 核心功能方法 ===
    
    // 加载配置
    loadConfig: function() {
      if (typeof MNUtil === "undefined" || !self.path) return;
      
      try {
        let configPath = self.path + "/config.json";
        if (MNUtil.isfileExists && MNUtil.isfileExists(configPath)) {
          let config = MNUtil.readJSON(configPath);
          if (config) {
            Object.assign(self.taskConfig, config);
          }
        }
      } catch (error) {
        if (MNUtil.log) {
          MNUtil.log("❌ 加载配置失败: " + error.message);
        }
      }
    },
    
    // 保存配置
    saveConfig: function() {
      if (typeof MNUtil === "undefined" || !self.path) return;
      
      try {
        let configPath = self.path + "/config.json";
        if (MNUtil.writeJSON) {
          MNUtil.writeJSON(configPath, self.taskConfig);
        }
      } catch (error) {
        if (MNUtil.log) {
          MNUtil.log("❌ 保存配置失败: " + error.message);
        }
      }
    },
    
    // 显示任务管理器
    showTaskManager: function() {
      if (typeof MNUtil === "undefined") {
        return;
      }
      
      MNUtil.showHUD("⏳ 正在打开任务管理器...");
      
      // 创建或显示任务管理控制器
      if (!self.taskController) {
        self.taskController = self.createTaskController();
      }
      
      // 显示任务管理器窗口
      if (self.taskController && self.taskController.show) {
        self.taskController.show();
      }
    },
    
    // 创建任务控制器
    createTaskController: function() {
      if (typeof MNUtil === "undefined") {
        MNUtil.showHUD("❌ 缺少必要组件");
        return null;
      }
      
      try {
        // 检查 TaskController 是否存在
        if (typeof TaskController === "undefined") {
          MNUtil.showHUD("❌ TaskController 未加载");
          return null;
        }
        
        // 创建任务控制器 - 使用 JSB 的正确方式
        const controller = TaskController.new();
        if (!controller) {
          MNUtil.showHUD("❌ 无法创建控制器");
          return null;
        }
        
        // 设置路径
        controller.mainPath = self.path;
        
        // 视图会在需要时自动加载
        
        return controller;
      } catch (error) {
        MNUtil.showHUD("❌ 创建控制器失败: " + error.message);
        if (MNUtil.log) {
          MNUtil.log("❌ 创建任务控制器失败: " + error.message);
        }
        return null;
      }
    },
    
    // 从选中文本创建任务
    createTaskFromSelection: function(text) {
      if (typeof MNUtil === "undefined" || typeof MNNote === "undefined") {
        return;
      }
      
      MNUtil.undoGrouping(function() {
        try {
          // 创建任务卡片
          let currentNotebook = MNUtil.currentNotebook;
          if (!currentNotebook) {
            MNUtil.showHUD("❌ 请先打开笔记本");
            return;
          }
          
          // 创建新的任务卡片
          let taskNote = MNNote.createWithTitleNotebook(
            self.taskConfig.taskPrefix + text,
            currentNotebook
          );
          
          if (taskNote) {
            // 设置任务颜色
            taskNote.colorIndex = self.taskConfig.colorMapping.pending;
            
            // 添加初始评论
            taskNote.appendTextComment("[进度] 0%");
            taskNote.appendTextComment("[开始] " + new Date().toLocaleDateString());
            taskNote.appendTextComment("[状态] 待办");
            
            // 聚焦到新创建的任务
            if (taskNote.focusInMindMap) {
              taskNote.focusInMindMap(0.3);
            }
            
            MNUtil.showHUD("✅ 任务创建成功");
          }
        } catch (error) {
          MNUtil.showHUD("❌ 创建失败: " + error.message);
        }
      });
    },
    
    // 将普通卡片转换为任务
    convertToTask: function(note) {
      if (!note || typeof MNUtil === "undefined") return;
      
      MNUtil.undoGrouping(function() {
        try {
          // 修改标题
          if (!note.noteTitle.startsWith(self.taskConfig.taskPrefix)) {
            note.noteTitle = self.taskConfig.taskPrefix + note.noteTitle;
          }
          
          // 设置颜色
          note.colorIndex = self.taskConfig.colorMapping.pending;
          
          // 添加任务相关评论
          note.appendTextComment("[进度] 0%");
          note.appendTextComment("[开始] " + new Date().toLocaleDateString());
          note.appendTextComment("[状态] 待办");
          
          // 如果有绑定的文档或卡片，添加链接
          if (note.docMd5) {
            note.appendTextComment("[绑定] " + note.noteId);
          }
          
          MNUtil.showHUD("✅ 已转为任务");
        } catch (error) {
          MNUtil.showHUD("❌ 转换失败: " + error.message);
        }
      });
    },
    
    // 更新任务进度
    updateTaskProgress: function(note) {
      if (!note || typeof MNUtil === "undefined") return;
      
      // 使用 MNUtil 的输入对话框
      MNUtil.input("更新进度", "请输入完成百分比 (0-100)", ["0"]).then(function(inputs) {
        if (inputs && inputs[0]) {
          let progress = parseInt(inputs[0]);
          if (isNaN(progress) || progress < 0 || progress > 100) {
            MNUtil.showHUD("❌ 请输入 0-100 的数字");
            return;
          }
          
          MNUtil.undoGrouping(function() {
            // 更新进度评论
            self.updateCommentByPrefix(note, "[进度]", "[进度] " + progress + "%");
            
            // 根据进度更新状态和颜色
            if (progress === 0) {
              note.colorIndex = self.taskConfig.colorMapping.pending;
              self.updateCommentByPrefix(note, "[状态]", "[状态] 待办");
            } else if (progress === 100) {
              note.colorIndex = self.taskConfig.colorMapping.completed;
              self.updateCommentByPrefix(note, "[状态]", "[状态] 已完成");
              note.appendTextComment("[完成] " + new Date().toLocaleDateString());
            } else {
              note.colorIndex = self.taskConfig.colorMapping.inProgress;
              self.updateCommentByPrefix(note, "[状态]", "[状态] 进行中");
            }
            
            MNUtil.showHUD("✅ 进度已更新: " + progress + "%");
          });
        }
      }).catch(function(error) {
        // 用户取消了输入
      });
    },
    
    // 标记任务完成
    markTaskComplete: function(note) {
      if (!note || typeof MNUtil === "undefined") return;
      
      MNUtil.undoGrouping(function() {
        try {
          // 更新进度为 100%
          self.updateCommentByPrefix(note, "[进度]", "[进度] 100%");
          
          // 更新状态
          self.updateCommentByPrefix(note, "[状态]", "[状态] 已完成");
          
          // 添加完成时间
          note.appendTextComment("[完成] " + new Date().toLocaleDateString());
          
          // 更新颜色
          note.colorIndex = self.taskConfig.colorMapping.completed;
          
          // 移除今日任务标签
          if (note.tags && note.tags.includes(self.taskConfig.todayTag)) {
            note.removeTags([self.taskConfig.todayTag]);
          }
          
          MNUtil.showHUD("✅ 任务已完成");
        } catch (error) {
          MNUtil.showHUD("❌ 操作失败: " + error.message);
        }
      });
    },
    
    // 设为今日任务
    markAsTodayTask: function(note) {
      if (!note || typeof MNUtil === "undefined") return;
      
      MNUtil.undoGrouping(function() {
        try {
          // 添加今日任务标签
          if (!note.tags || !note.tags.includes(self.taskConfig.todayTag)) {
            note.appendTags([self.taskConfig.todayTag]);
            MNUtil.showHUD("✅ 已设为今日任务");
          } else {
            // 如果已经是今日任务，则移除标签
            note.removeTags([self.taskConfig.todayTag]);
            MNUtil.showHUD("✅ 已移出今日任务");
          }
        } catch (error) {
          MNUtil.showHUD("❌ 操作失败: " + error.message);
        }
      });
    },
    
    // 刷新任务列表
    refreshTasks: function() {
      // 后续实现：刷新任务管理器中的任务列表
      if (typeof MNUtil !== "undefined" && MNUtil.log) {
        MNUtil.log("🔄 刷新任务列表");
      }
    },
    
    // === 插件栏支持 ===
    
    // 点击插件栏图标时调用
    toggleAddon: function(sender) {
      if (typeof MNUtil === "undefined") {
        return;
      }
      
      self.showTaskManager();
    },
    
    // === 工具方法 ===
    
    // 更新特定前缀的评论
    updateCommentByPrefix: function(note, prefix, newComment) {
      if (!note || !note.comments) return;
      
      let found = false;
      for (let i = 0; i < note.comments.length; i++) {
        let comment = note.comments[i];
        if (comment.text && comment.text.startsWith(prefix)) {
          // 找到了，更新评论
          note.removeCommentByIndex(i);
          note.appendTextComment(newComment);
          found = true;
          break;
        }
      }
      
      if (!found) {
        // 没找到，直接添加
        note.appendTextComment(newComment);
      }
    },
    
    // === 插件栏支持（必需） ===
    
    // 查询插件命令状态 - 用于在插件栏显示图标
    queryAddonCommandStatus: function() {
      if (typeof MNUtil === 'undefined') return null;
      
      // 返回插件栏显示信息
      return {
        image: 'logo.png',        // 插件图标
        object: self,             // 回调对象
        selector: 'toggleAddon:', // 点击时调用的方法
        checked: false            // 是否选中状态
      };
    }
  }, { /* Class members - 静态方法 */
    // 插件连接时调用
    addonDidConnect: function() {
      if (typeof MNUtil !== 'undefined' && MNUtil.log) {
        MNUtil.log("🔌 MNTask addon connected");
      }
    },
    
    // 插件断开连接时调用
    addonWillDisconnect: function() {
      if (typeof MNUtil !== 'undefined' && MNUtil.log) {
        MNUtil.log("🔌 MNTask addon disconnected");
      }
    },
    
    // 应用进入前台时调用
    applicationWillEnterForeground: function() {
      // 可以在这里刷新任务状态
    },
    
    // 应用进入后台时调用
    applicationDidEnterBackground: function() {
      // 可以在这里保存任务状态
    },
    
    // 接收本地通知时调用
    applicationDidReceiveLocalNotification: function(notify) {
      // 处理任务提醒等通知
    }
  });
  
  return MNTaskMain;
};