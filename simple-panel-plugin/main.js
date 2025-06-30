// 在文件开头尝试加载 MNUtils
if (typeof JSB !== 'undefined' && typeof JSB.require === 'function') {
  try {
    JSB.require('mnutils');
  } catch (e) {
    // MNUtils 不可用
  }
}

JSB.newAddon = function (mainPath) {
  // 获取插件实例的辅助函数
  const getSimplePluginInstance = () => self;
  
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
          // 延迟添加控制面板到视图，避免阻塞主线程
          NSTimer.scheduledTimerWithTimeInterval(0.1, false, function() {
            // 刷新插件栏图标
            if (typeof MNUtil !== "undefined" && MNUtil.refreshAddonCommands) {
              MNUtil.refreshAddonCommands();
            } else {
              self.appInstance.studyController(self.window).refreshAddonCommands();
            }
            
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
        }
      },
      
      // 笔记本关闭时
      notebookWillClose: function (/* notebookid */) {
        // 清理资源
      },
      
      // 查询插件状态（显示图标） - 参考 mnai 实现
      queryAddonCommandStatus: function () {
        try {
          if (self.appInstance.studyController(self.window).studyMode < 3) {
            // 关键：确保控制器存在 - 这是 mnai 的核心做法！
            if (!self.panelController) {
              if (typeof MNUtil !== "undefined" && MNUtil.log) {
                MNUtil.log("🔧 Simple Panel: 在 queryAddonCommandStatus 中创建 panelController");
              }
              self.panelController = SimplePanelController.new();
              self.panelController.mainPath = self.mainPath;
            }
            
            // 确保视图已经添加到 studyView
            if (self.panelController && self.panelController.view) {
              var studyView = self.appInstance.studyController(self.window).view;
              if (studyView && !self.panelController.view.superview) {
                studyView.addSubview(self.panelController.view);
                self.panelController.view.hidden = true;
                
                if (typeof MNUtil !== "undefined" && MNUtil.log) {
                  MNUtil.log("✅ Simple Panel: 在 queryAddonCommandStatus 中将面板添加到视图");
                }
              }
            }
            
            var result = {
              image: 'logo.png',
              object: self,
              selector: 'showMenu:',
              checked: false  // 菜单不需要checked状态
            };
            
            return result;
          }
          return null;
        } catch (error) {
          if (typeof MNUtil !== "undefined" && MNUtil.log) {
            MNUtil.log("❌ Simple Panel: queryAddonCommandStatus 出错: " + error.message);
          }
          return null;
        }
      },
      
      // 显示主菜单
      showMenu: function (button) {
        // 确保 self 引用正确
        var self = getSimplePluginInstance();
        
        // 调试日志
        if (typeof MNUtil !== "undefined" && MNUtil.log) {
          MNUtil.log("📋 Simple Panel: showMenu called");
        }
        
        // 保存按钮引用，供后续使用
        if (button && typeof button.convertRectToView === 'function') {
          self.addonButton = button;
        }
        
        // 保存工具栏引用
        if (button && button.superview && button.superview.superview) {
          self.addonBar = button.superview.superview;
        }
        
        // 使用 Menu 类（参考 mnai 的实现）
        if (typeof Menu !== "undefined") {
          var commandTable = [
            {title: '🔧  文本处理', object: self, selector: 'openTextProcessor', param: ""},
            {title: '📝  快速笔记', object: self, selector: 'openQuickNote', param: ""},
            {title: '🔍  搜索替换', object: self, selector: 'openSearchReplace', param: ""},
            {title: '——————', object: self, selector: 'doNothing', param: ""},
            {title: '⚙️  设置 ▸', object: self, selector: 'showSubmenu_settings:', param: button},
            {title: '💡  帮助', object: self, selector: 'showHelp', param: ""}
          ];
          
          var menu = new Menu(button, self, 250, 2);
          menu.addMenuItems(commandTable);
          menu.show();
        } else {
          // 使用原生 popover 作为降级方案
          if (typeof MNUtil !== "undefined" && MNUtil.log) {
            MNUtil.log("⚠️ Simple Panel: Menu 类不存在，使用原生 popover");
          }
          
          // 定义菜单项作为降级方案
          var commandTable = [
            {title: '🔧  文本处理', object: self, selector: 'openTextProcessor', param: ""},
            {title: '📝  快速笔记', object: self, selector: 'openQuickNote', param: ""},
            {title: '🔍  搜索替换', object: self, selector: 'openSearchReplace', param: ""},
            {title: '——————', object: self, selector: 'doNothing', param: ""},
            {title: '⚙️  设置', object: self, selector: 'showSettingsMenu', param: button},
            {title: '💡  帮助', object: self, selector: 'showHelp', param: ""}
          ];
          
          // 创建菜单控制器
          var menuController = MenuController.new();
          menuController.commandTable = commandTable;
          menuController.rowHeight = 40;
          menuController.preferredContentSize = {
            width: 200,
            height: menuController.rowHeight * commandTable.length
          };
          menuController.pluginInstance = self; // 保存插件实例引用
          
          // 创建弹出控制器
          self.popoverController = UIPopoverController.new();
          self.popoverController.initWithContentViewController(menuController);
          
          // 计算位置并显示
          // 处理 MNButton 代理对象 - 获取实际的 UIButton
          var actualButton = button;
          if (button && button.button && typeof button.button.convertRectToView === 'function') {
            actualButton = button.button;
          }
          
          // 确保按钮有效
          if (!actualButton || typeof actualButton.convertRectToView !== 'function') {
            MNUtil.showHUD("按钮对象无效");
            return;
          }
          
          var targetView = actualButton.superview.superview;
          var rect = actualButton.convertRectToView(actualButton.bounds, targetView);
          self.popoverController.presentPopoverFromRectInViewPermittedArrowDirectionsAnimated(
            rect, 
            targetView, 
            1 << 2, // 向上箭头
            true
          );
        }
      },
      
      // 打开文本处理面板 - 添加完善的错误处理
      openTextProcessor: function() {
        try {
          if (typeof MNUtil !== "undefined" && MNUtil.log) {
            MNUtil.log("🔧 Simple Panel: 打开文本处理面板");
          }
          
          // 关闭菜单
          if (typeof Menu !== "undefined") {
            Menu.dismissCurrentMenu();
          }
          if (self.popoverController) {
            self.popoverController.dismissPopoverAnimated(true);
            self.popoverController = null;
          }
          
          // 内联 ensurePanelReady 逻辑 - JSB 框架限制，不能调用自定义方法
          var panelReady = false;
          try {
            if (!self.panelController) {
              if (typeof MNUtil !== "undefined" && MNUtil.log) {
                MNUtil.log("❌ Simple Panel: panelController is null!");
              }
            } else if (!self.panelController.view) {
              if (typeof MNUtil !== "undefined" && MNUtil.log) {
                MNUtil.log("❌ Simple Panel: panelController.view is null!");
              }
            } else {
              var view = self.panelController.view;
              if (!view.superview) {
                var studyView = null;
                if (typeof MNUtil !== "undefined" && MNUtil.studyView) {
                  studyView = MNUtil.studyView;
                } else {
                  studyView = self.appInstance.studyController(self.window).view;
                }
                
                if (studyView) {
                  studyView.addSubview(view);
                  if (typeof MNUtil !== "undefined" && MNUtil.log) {
                    MNUtil.log("✅ Simple Panel: 面板已添加到 studyView");
                  }
                  panelReady = true;
                }
              } else {
                panelReady = true;
              }
            }
          } catch (e) {
            if (typeof MNUtil !== "undefined" && MNUtil.log) {
              MNUtil.log("❌ Simple Panel: 确保面板就绪出错: " + e.message);
            }
          }
          
          if (!panelReady) {
            if (typeof MNUtil !== "undefined") {
              MNUtil.showHUD("面板初始化失败");
            }
            return;
          }
          
          // 切换到文本处理模式
          if (self.panelController && self.panelController.switchToMode) {
            self.panelController.switchToMode("textProcessor");
          }
          
          // 内联 showPanelWithAnimation 逻辑 - JSB 框架限制
          try {
            if (self.panelController && self.panelController.view) {
              var view = self.panelController.view;
              
              // 确保视图在最前面
              if (typeof MNUtil !== "undefined" && MNUtil.studyView) {
                MNUtil.studyView.bringSubviewToFront(view);
              } else if (view.superview) {
                view.superview.bringSubviewToFront(view);
              }
              
              // 显示视图
              view.hidden = false;
              view.alpha = 1;
              view.layer.opacity = 1.0;
              
              // 如果有 show 方法，调用它
              if (self.panelController.show) {
                self.panelController.show();
              }
              
              if (typeof MNUtil !== "undefined" && MNUtil.log) {
                MNUtil.log("✅ Simple Panel: 面板已显示");
              }
            }
          } catch (e) {
            if (typeof MNUtil !== "undefined" && MNUtil.log) {
              MNUtil.log("❌ Simple Panel: 显示面板出错: " + e.message);
            }
          }
          
          // 内联 getSelectedText 逻辑 - JSB 框架限制
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
          
          if (selectedText && self.panelController && self.panelController.inputField) {
            self.panelController.inputField.text = selectedText;
            if (typeof MNUtil !== "undefined" && MNUtil.log) {
              MNUtil.log("✅ Simple Panel: 已填充选中文本");
            }
          }
        } catch (error) {
          if (typeof MNUtil !== "undefined") {
            if (MNUtil.log) {
              MNUtil.log("❌ Simple Panel: openTextProcessor 出错: " + error.message);
              MNUtil.log("❌ Simple Panel: 错误堆栈: " + error.stack);
            }
            MNUtil.showHUD("打开面板失败: " + error.message);
          }
        }
      },
      
      // 打开快速笔记 - 添加完整的错误处理
      openQuickNote: function() {
        try {
          if (typeof MNUtil !== "undefined" && MNUtil.log) {
            MNUtil.log("📝 Simple Panel: 打开快速笔记");
          }
          
          // 关闭菜单 - 添加错误保护
          try {
            if (typeof Menu !== "undefined" && Menu.dismissCurrentMenu) {
              MNUtil.log("📝 Simple Panel: 尝试关闭 Menu");
              Menu.dismissCurrentMenu();
            }
          } catch (menuError) {
            if (typeof MNUtil !== "undefined" && MNUtil.log) {
              MNUtil.log("⚠️ Simple Panel: 关闭 Menu 失败: " + menuError.message);
            }
          }
          
          // 关闭 popover
          try {
            if (self.popoverController) {
              MNUtil.log("📝 Simple Panel: 尝试关闭 popover");
              self.popoverController.dismissPopoverAnimated(true);
              self.popoverController = null;
            }
          } catch (popoverError) {
            if (typeof MNUtil !== "undefined" && MNUtil.log) {
              MNUtil.log("⚠️ Simple Panel: 关闭 popover 失败: " + popoverError.message);
            }
          }
          
          if (typeof MNUtil !== "undefined" && MNUtil.log) {
            MNUtil.log("📝 Simple Panel: 准备确保面板就绪");
          }
          
          // 内联 ensurePanelReady 逻辑 - JSB 框架限制
          var panelReady = false;
          try {
            if (!self.panelController) {
              if (typeof MNUtil !== "undefined" && MNUtil.log) {
                MNUtil.log("❌ Simple Panel: panelController is null!");
              }
            } else if (!self.panelController.view) {
              if (typeof MNUtil !== "undefined" && MNUtil.log) {
                MNUtil.log("❌ Simple Panel: panelController.view is null!");
              }
            } else {
              var view = self.panelController.view;
              if (!view.superview) {
                var studyView = null;
                if (typeof MNUtil !== "undefined" && MNUtil.studyView) {
                  studyView = MNUtil.studyView;
                } else {
                  studyView = self.appInstance.studyController(self.window).view;
                }
                
                if (studyView) {
                  studyView.addSubview(view);
                  if (typeof MNUtil !== "undefined" && MNUtil.log) {
                    MNUtil.log("✅ Simple Panel: 面板已添加到 studyView");
                  }
                  panelReady = true;
                }
              } else {
                panelReady = true;
              }
            }
          } catch (e) {
            if (typeof MNUtil !== "undefined" && MNUtil.log) {
              MNUtil.log("❌ Simple Panel: 确保面板就绪出错: " + e.message);
            }
          }
          
          if (!panelReady) {
            if (typeof MNUtil !== "undefined") {
              MNUtil.showHUD("面板初始化失败");
            }
            return;
          }
          
          // 切换到笔记模式
          if (self.panelController && self.panelController.switchToMode) {
            self.panelController.switchToMode("quickNote");
          }
          
          // 内联 showPanelWithAnimation 逻辑
          try {
            if (self.panelController && self.panelController.view) {
              var view = self.panelController.view;
              
              // 确保视图在最前面
              if (typeof MNUtil !== "undefined" && MNUtil.studyView) {
                MNUtil.studyView.bringSubviewToFront(view);
              } else if (view.superview) {
                view.superview.bringSubviewToFront(view);
              }
              
              // 显示视图
              view.hidden = false;
              view.alpha = 1;
              view.layer.opacity = 1.0;
              
              // 如果有 show 方法，调用它
              if (self.panelController.show) {
                self.panelController.show();
              }
              
              if (typeof MNUtil !== "undefined" && MNUtil.log) {
                MNUtil.log("✅ Simple Panel: 面板已显示");
              }
              
              // 执行回调
              if (typeof MNUtil !== "undefined") {
                MNUtil.showHUD("📝 快速笔记模式");
              }
            }
          } catch (e) {
            if (typeof MNUtil !== "undefined" && MNUtil.log) {
              MNUtil.log("❌ Simple Panel: 显示面板出错: " + e.message);
            }
          }
        } catch (error) {
          if (typeof MNUtil !== "undefined") {
            if (MNUtil.log) {
              MNUtil.log("❌ Simple Panel: openQuickNote 出错: " + error.message);
              MNUtil.log("❌ Simple Panel: 错误堆栈: " + error.stack);
            }
            MNUtil.showHUD("打开面板失败: " + error.message);
          }
        }
      },
      
      // 打开搜索替换 - 添加完整的错误处理
      openSearchReplace: function() {
        try {
          if (typeof MNUtil !== "undefined" && MNUtil.log) {
            MNUtil.log("🔍 Simple Panel: 打开搜索替换");
          }
          
          // 关闭菜单 - 添加错误保护
          try {
            if (typeof Menu !== "undefined" && Menu.dismissCurrentMenu) {
              MNUtil.log("🔍 Simple Panel: 尝试关闭 Menu");
              Menu.dismissCurrentMenu();
            }
          } catch (menuError) {
            if (typeof MNUtil !== "undefined" && MNUtil.log) {
              MNUtil.log("⚠️ Simple Panel: 关闭 Menu 失败: " + menuError.message);
            }
          }
          
          // 关闭 popover
          try {
            if (self.popoverController) {
              MNUtil.log("🔍 Simple Panel: 尝试关闭 popover");
              self.popoverController.dismissPopoverAnimated(true);
              self.popoverController = null;
            }
          } catch (popoverError) {
            if (typeof MNUtil !== "undefined" && MNUtil.log) {
              MNUtil.log("⚠️ Simple Panel: 关闭 popover 失败: " + popoverError.message);
            }
          }
          
          if (typeof MNUtil !== "undefined" && MNUtil.log) {
            MNUtil.log("🔍 Simple Panel: 准备调用 ensurePanelReady");
          }
          
          // 内联 ensurePanelReady 逻辑 - JSB 框架限制
          var panelReady = false;
          try {
            if (!self.panelController) {
              if (typeof MNUtil !== "undefined" && MNUtil.log) {
                MNUtil.log("❌ Simple Panel: panelController is null!");
              }
            } else if (!self.panelController.view) {
              if (typeof MNUtil !== "undefined" && MNUtil.log) {
                MNUtil.log("❌ Simple Panel: panelController.view is null!");
              }
            } else {
              var view = self.panelController.view;
              if (!view.superview) {
                var studyView = null;
                if (typeof MNUtil !== "undefined" && MNUtil.studyView) {
                  studyView = MNUtil.studyView;
                } else {
                  studyView = self.appInstance.studyController(self.window).view;
                }
                
                if (studyView) {
                  studyView.addSubview(view);
                  if (typeof MNUtil !== "undefined" && MNUtil.log) {
                    MNUtil.log("✅ Simple Panel: 面板已添加到 studyView");
                  }
                  panelReady = true;
                }
              } else {
                panelReady = true;
              }
            }
          } catch (e) {
            if (typeof MNUtil !== "undefined" && MNUtil.log) {
              MNUtil.log("❌ Simple Panel: 确保面板就绪出错: " + e.message);
            }
          }
          
          if (!panelReady) {
            if (typeof MNUtil !== "undefined") {
              MNUtil.showHUD("面板初始化失败");
            }
            return;
          }
          
          // 切换到搜索替换模式
          if (self.panelController && self.panelController.switchToMode) {
            self.panelController.switchToMode("searchReplace");
          }
          
          // 内联 showPanelWithAnimation 逻辑
          try {
            if (self.panelController && self.panelController.view) {
              var view = self.panelController.view;
              
              // 确保视图在最前面
              if (typeof MNUtil !== "undefined" && MNUtil.studyView) {
                MNUtil.studyView.bringSubviewToFront(view);
              } else if (view.superview) {
                view.superview.bringSubviewToFront(view);
              }
              
              // 显示视图
              view.hidden = false;
              view.alpha = 1;
              view.layer.opacity = 1.0;
              
              // 如果有 show 方法，调用它
              if (self.panelController.show) {
                self.panelController.show();
              }
              
              if (typeof MNUtil !== "undefined" && MNUtil.log) {
                MNUtil.log("✅ Simple Panel: 面板已显示");
              }
              
              // 执行回调
              if (typeof MNUtil !== "undefined") {
                MNUtil.showHUD("🔍 搜索替换模式");
              }
            }
          } catch (e) {
            if (typeof MNUtil !== "undefined" && MNUtil.log) {
              MNUtil.log("❌ Simple Panel: 显示面板出错: " + e.message);
            }
          }
        } catch (error) {
          if (typeof MNUtil !== "undefined") {
            if (MNUtil.log) {
              MNUtil.log("❌ Simple Panel: openSearchReplace 出错: " + error.message);
              MNUtil.log("❌ Simple Panel: 错误堆栈: " + error.stack);
            }
            MNUtil.showHUD("打开面板失败: " + error.message);
          }
        }
      },
      
      // 显示设置子菜单
      showSubmenu_settings: function(sender) {
        var self = getSimplePluginInstance();
        
        if (typeof MNUtil !== "undefined" && MNUtil.log) {
          MNUtil.log("🔸 显示设置子菜单");
        }
        
        // 关闭当前菜单
        if (typeof Menu !== "undefined" && Menu.dismissCurrentMenu) {
          Menu.dismissCurrentMenu();
        }
        
        // 延迟显示子菜单
        NSTimer.scheduledTimerWithTimeInterval(0.1, false, function() {
          var saveHistory = false;
          if (self.panelController && self.panelController.config) {
            saveHistory = self.panelController.config.saveHistory || false;
          }
          
          var settingsTable = [
            {title: saveHistory ? "✓ 保存历史" : "  保存历史", object: self, selector: "toggleSaveHistory", param: ""},
            {title: "——————", object: self, selector: "doNothing", param: ""},
            {title: "🔄  云同步设置 ▸", object: self, selector: "showSubmenu_syncSettings:", param: sender},
            {title: "🗑  清空历史", object: self, selector: "clearHistory", param: ""},
            {title: "——————", object: self, selector: "doNothing", param: ""},
            {title: "📤  导出配置", object: self, selector: "exportConfig", param: ""},
            {title: "📥  导入配置", object: self, selector: "importConfig", param: ""},
            {title: "——————", object: self, selector: "doNothing", param: ""},
            {title: "🔄  重置设置", object: self, selector: "resetSettings", param: ""}
          ];
          
          // 获取有效的按钮
          var button = sender;
          if (!button || typeof button.convertRectToView !== 'function') {
            button = self.addonButton;
          }
          
          var menu = new Menu(button, self, 250, 2);
          menu.addMenuItems(settingsTable);
          menu.show();
        });
      },
      
      // 显示同步设置子菜单
      showSubmenu_syncSettings: function(sender) {
        var self = getSimplePluginInstance();
        
        if (typeof MNUtil !== "undefined" && MNUtil.log) {
          MNUtil.log("🔸 显示同步设置子菜单");
        }
        
        // 关闭当前菜单
        if (typeof Menu !== "undefined" && Menu.dismissCurrentMenu) {
          Menu.dismissCurrentMenu();
        }
        
        // 延迟显示子菜单
        NSTimer.scheduledTimerWithTimeInterval(0.1, false, function() {
          var syncSource = "none";
          var autoSync = false;
          
          if (self.panelController) {
            if (self.panelController.configManager) {
              syncSource = self.panelController.configManager.get("syncSource", "none");
              autoSync = self.panelController.configManager.get("autoSync", false);
            } else if (self.panelController.config) {
              syncSource = self.panelController.config.syncSource || "none";
              autoSync = self.panelController.config.autoSync || false;
            }
          }
          
          var syncTable = [
            {title: autoSync ? "✓ 自动同步" : "  自动同步", object: self, selector: "toggleAutoSync", param: ""},
            {title: "——————", object: self, selector: "doNothing", param: ""},
            {title: syncSource === "none" ? "● 不同步" : "○ 不同步", object: self, selector: "setSyncSource:", param: "none"},
            {title: syncSource === "iCloud" ? "● iCloud" : "○ iCloud", object: self, selector: "setSyncSource:", param: "iCloud"},
            {title: "——————", object: self, selector: "doNothing", param: ""},
            {title: "🔄  立即同步", object: self, selector: "manualSync", param: ""}
          ];
          
          // 获取有效的按钮
          var button = sender;
          if (!button || typeof button.convertRectToView !== 'function') {
            button = self.addonButton;
          }
          
          var menu = new Menu(button, self, 250, 2);
          menu.addMenuItems(syncTable);
          menu.show();
        });
      },
      
      
      // 空方法，用于分隔线
      doNothing: function() {
        // 不做任何事情，只是为了避免崩溃
        if (typeof MNUtil !== "undefined" && MNUtil.log) {
          MNUtil.log("🔸 Simple Panel: 分隔线被点击");
        }
      },
      
      // 设置相关操作
      toggleSaveHistory: function() {
        if (self.panelController && self.panelController.config) {
          self.panelController.config.saveHistory = !self.panelController.config.saveHistory;
          
          // 保存配置
          if (self.panelController.configManager) {
            self.panelController.configManager.set("saveHistory", self.panelController.config.saveHistory);
          }
          
          if (typeof MNUtil !== "undefined") {
            MNUtil.showHUD("保存历史: " + (self.panelController.config.saveHistory ? "已开启" : "已关闭"));
          }
        }
      },
      
      toggleAutoSync: function() {
        if (self.panelController && self.panelController.configManager) {
          self.panelController.configManager.update({
            autoSync: !self.panelController.configManager.get("autoSync")
          });
          
          if (typeof MNUtil !== "undefined") {
            MNUtil.showHUD("自动同步: " + (self.panelController.configManager.get("autoSync") ? "已开启" : "已关闭"));
          }
        }
      },
      
      setSyncSource: function(source) {
        if (self.panelController && self.panelController.configManager) {
          self.panelController.configManager.set("syncSource", source);
          
          if (source === "iCloud") {
            self.panelController.configManager.initCloudStore();
          }
          
          if (typeof MNUtil !== "undefined") {
            MNUtil.showHUD("同步源: " + (source === "iCloud" ? "iCloud" : "本地"));
          }
        }
      },
      
      manualSync: function() {
        if (self.panelController && self.panelController.configManager) {
          self.panelController.configManager.manualSync();
        }
      },
      
      clearHistory: function() {
        if (typeof MNUtil !== "undefined") {
          MNUtil.confirm("清空历史", "确定要清空所有历史记录吗？", ["取消", "确定"]).then(function(index) {
            if (index === 1 && self.panelController) {
              self.panelController.history = [];
              if (self.panelController.configManager) {
                self.panelController.configManager.saveHistory();
              }
              MNUtil.showHUD("历史记录已清空");
            }
          });
        }
      },
      
      exportConfig: function() {
        if (self.panelController && self.panelController.configManager) {
          self.panelController.configManager.exportConfig();
        }
      },
      
      importConfig: function() {
        if (self.panelController && self.panelController.configManager) {
          self.panelController.configManager.importConfig();
        }
      },
      
      resetSettings: function() {
        if (typeof MNUtil !== "undefined") {
          MNUtil.confirm("重置设置", "确定要恢复所有设置到默认值吗？", ["取消", "确定"]).then(function(index) {
            if (index === 1 && self.panelController && self.panelController.configManager) {
              self.panelController.configManager.reset();
              MNUtil.showHUD("设置已重置");
            }
          });
        }
      },
      
      // 原来的 openSettings - 现在不再使用
      openSettings_deprecated: function() {
        try {
          if (typeof MNUtil !== "undefined" && MNUtil.log) {
            MNUtil.log("⚙️ Simple Panel: 打开设置");
          }
          
          // 关闭菜单 - 添加错误保护
          try {
            if (typeof Menu !== "undefined" && Menu.dismissCurrentMenu) {
              MNUtil.log("⚙️ Simple Panel: 尝试关闭 Menu");
              Menu.dismissCurrentMenu();
            }
          } catch (menuError) {
            if (typeof MNUtil !== "undefined" && MNUtil.log) {
              MNUtil.log("⚠️ Simple Panel: 关闭 Menu 失败: " + menuError.message);
            }
          }
          
          // 关闭 popover
          try {
            if (self.popoverController) {
              MNUtil.log("⚙️ Simple Panel: 尝试关闭 popover");
              self.popoverController.dismissPopoverAnimated(true);
              self.popoverController = null;
            }
          } catch (popoverError) {
            if (typeof MNUtil !== "undefined" && MNUtil.log) {
              MNUtil.log("⚠️ Simple Panel: 关闭 popover 失败: " + popoverError.message);
            }
          }
          
          if (typeof MNUtil !== "undefined" && MNUtil.log) {
            MNUtil.log("⚙️ Simple Panel: 准备确保面板就绪");
          }
          
          // 内联 ensurePanelReady 逻辑 - JSB 框架限制
          var panelReady = false;
          try {
            if (!self.panelController) {
              if (typeof MNUtil !== "undefined" && MNUtil.log) {
                MNUtil.log("❌ Simple Panel: panelController is null!");
              }
            } else if (!self.panelController.view) {
              if (typeof MNUtil !== "undefined" && MNUtil.log) {
                MNUtil.log("❌ Simple Panel: panelController.view is null!");
              }
            } else {
              var view = self.panelController.view;
              if (!view.superview) {
                var studyView = null;
                if (typeof MNUtil !== "undefined" && MNUtil.studyView) {
                  studyView = MNUtil.studyView;
                } else {
                  studyView = self.appInstance.studyController(self.window).view;
                }
                
                if (studyView) {
                  studyView.addSubview(view);
                  if (typeof MNUtil !== "undefined" && MNUtil.log) {
                    MNUtil.log("✅ Simple Panel: 面板已添加到 studyView");
                  }
                  panelReady = true;
                }
              } else {
                panelReady = true;
              }
            }
          } catch (e) {
            if (typeof MNUtil !== "undefined" && MNUtil.log) {
              MNUtil.log("❌ Simple Panel: 确保面板就绪出错: " + e.message);
            }
          }
          
          if (!panelReady) {
            if (typeof MNUtil !== "undefined") {
              MNUtil.showHUD("面板初始化失败");
            }
            return;
          }
          
          // 内联 showPanelWithAnimation 逻辑
          try {
            if (self.panelController && self.panelController.view) {
              var view = self.panelController.view;
              
              // 确保视图在最前面
              if (typeof MNUtil !== "undefined" && MNUtil.studyView) {
                MNUtil.studyView.bringSubviewToFront(view);
              } else if (view.superview) {
                view.superview.bringSubviewToFront(view);
              }
              
              // 显示视图
              view.hidden = false;
              view.alpha = 1;
              view.layer.opacity = 1.0;
              
              // 如果有 show 方法，调用它
              if (self.panelController.show) {
                self.panelController.show();
              }
              
              if (typeof MNUtil !== "undefined" && MNUtil.log) {
                MNUtil.log("✅ Simple Panel: 面板已显示");
              }
              
              // 立即显示设置菜单
              try {
                if (typeof MNUtil !== "undefined" && MNUtil.log) {
                  MNUtil.log("⚙️ Simple Panel: 准备显示设置菜单");
                }
                
                if (self.panelController && self.panelController.settingsButton) {
                  // 使用微小延迟确保 UI 就绪
                  NSTimer.scheduledTimerWithTimeInterval(0.01, false, function() {
                    if (typeof Menu !== "undefined") {
                      // 使用 panelController 的 getActualButton 方法
                      var actualButton = null;
                      if (self.panelController.getActualButton) {
                        actualButton = self.panelController.getActualButton(self.panelController.settingsButton);
                      } else {
                        // 备用方案
                        var button = self.panelController.settingsButton;
                        if (button && button.button && typeof button.button.convertRectToView === 'function') {
                          actualButton = button.button;
                        } else if (button && typeof button.convertRectToView === 'function') {
                          actualButton = button;
                        }
                      }
                      
                      if (!actualButton) {
                        if (typeof MNUtil !== "undefined") {
                          MNUtil.showHUD("按钮引用无效");
                          MNUtil.log("❌ Simple Panel: 无法获取有效按钮");
                        }
                        return;
                      }
                      
                      var menu = new Menu(actualButton, self.panelController, 250, 2);
                      
                      // 直接使用 self.panelController.config
                      var saveHistory = false;
                      if (self.panelController && self.panelController.config) {
                        saveHistory = self.panelController.config.saveHistory || false;
                      }
                      
                      var menuItems = [
                        { title: saveHistory ? "✓ 保存历史" : "  保存历史", object: self.panelController, selector: "toggleSaveHistory", param: null },
                        { title: "────────", object: null, selector: "", param: null },
                        { title: "云同步设置", object: self.panelController, selector: "showSyncSettings:", param: self.panelController.settingsButton },
                        { title: "清空历史", object: self.panelController, selector: "clearHistory", param: null },
                        { title: "导出配置", object: self.panelController, selector: "exportConfig", param: null },
                        { title: "导入配置", object: self.panelController, selector: "importConfig", param: null }
                      ];
                      
                      menu.addMenuItems(menuItems);
                      menu.rowHeight = 40;
                      menu.show();
                      
                      if (typeof MNUtil !== "undefined" && MNUtil.log) {
                        MNUtil.log("✅ Simple Panel: 设置菜单已显示");
                      }
                    } else {
                      if (typeof MNUtil !== "undefined" && MNUtil.log) {
                        MNUtil.log("❌ Simple Panel: Menu 类不存在");
                      }
                    }
                  });
                  } else {
                    if (typeof MNUtil !== "undefined" && MNUtil.log) {
                      MNUtil.log("❌ Simple Panel: settingsButton 不存在");
                    }
                }
              } catch (e) {
                if (typeof MNUtil !== "undefined" && MNUtil.log) {
                  MNUtil.log("❌ Simple Panel: 显示设置菜单出错: " + e.message);
                }
              }
            }
          } catch (e) {
            if (typeof MNUtil !== "undefined" && MNUtil.log) {
              MNUtil.log("❌ Simple Panel: 显示面板出错: " + e.message);
            }
          }
        } catch (error) {
          if (typeof MNUtil !== "undefined") {
            if (MNUtil.log) {
              MNUtil.log("❌ Simple Panel: openSettings 出错: " + error.message);
              MNUtil.log("❌ Simple Panel: 错误堆栈: " + error.stack);
            }
            MNUtil.showHUD("打开面板失败: " + error.message);
          }
        }
      },
      
      // 显示帮助
      showHelp: function() {
        if (typeof MNUtil !== "undefined" && MNUtil.log) {
          MNUtil.log("💡 Simple Panel: 显示帮助");
        }
        
        // 关闭菜单
        if (typeof Menu !== "undefined") {
          Menu.dismissCurrentMenu();
        }
        
        var helpText = "Simple Panel 插件使用帮助\n\n" +
                      "1. 文本处理：支持大小写转换、首字母大写等\n" +
                      "2. 快速笔记：快速创建和编辑笔记\n" +
                      "3. 搜索替换：批量搜索和替换文本\n" +
                      "4. 设置：配置插件选项和同步设置\n\n" +
                      "提示：长按设置按钮可重置所有设置";
        
        if (typeof MNUtil !== "undefined" && MNUtil.alert) {
          MNUtil.alert("帮助", helpText);
        } else if (typeof MNUtil !== "undefined") {
          MNUtil.showHUD("查看控制台获取帮助信息");
          MNUtil.log(helpText);
        }
      },
      
      // 确保面板准备就绪 - 简化实现，添加错误处理
      ensurePanelReady: function() {
        try {
          if (typeof MNUtil !== "undefined" && MNUtil.log) {
            MNUtil.log("🔍 Simple Panel: ensurePanelReady 开始执行");
          }
          
          if (!self.panelController) {
            if (typeof MNUtil !== "undefined" && MNUtil.log) {
              MNUtil.log("❌ Simple Panel: panelController is null!");
            }
            return false;
          }
          
          if (!self.panelController.view) {
            if (typeof MNUtil !== "undefined" && MNUtil.log) {
              MNUtil.log("❌ Simple Panel: panelController.view is null!");
            }
            return false;
          }
          
          // 简化逻辑：直接检查和添加视图
          var view = self.panelController.view;
          if (!view.superview) {
            var studyView = null;
            
            // 优先使用 MNUtil.studyView
            if (typeof MNUtil !== "undefined" && MNUtil.studyView) {
              studyView = MNUtil.studyView;
              if (MNUtil.log) {
                MNUtil.log("🎯 Simple Panel: 使用 MNUtil.studyView");
              }
            } else {
              // 降级方案
              studyView = self.appInstance.studyController(self.window).view;
              if (typeof MNUtil !== "undefined" && MNUtil.log) {
                MNUtil.log("🎯 Simple Panel: 使用降级方案获取 studyView");
              }
            }
            
            if (studyView) {
              studyView.addSubview(view);
              if (typeof MNUtil !== "undefined" && MNUtil.log) {
                MNUtil.log("✅ Simple Panel: 面板已添加到 studyView");
              }
            } else {
              if (typeof MNUtil !== "undefined" && MNUtil.log) {
                MNUtil.log("❌ Simple Panel: studyView is null!");
              }
              return false;
            }
          } else {
            if (typeof MNUtil !== "undefined" && MNUtil.log) {
              MNUtil.log("✅ Simple Panel: 面板已经存在于视图中");
            }
          }
          
          return true;
        } catch (error) {
          if (typeof MNUtil !== "undefined" && MNUtil.log) {
            MNUtil.log("❌ Simple Panel: ensurePanelReady 出错: " + error.message);
            MNUtil.log("❌ Simple Panel: 错误堆栈: " + error.stack);
          }
          return false;
        }
      },
      
      // 获取选中文本
      getSelectedText: function() {
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
        return selectedText;
      },
      
      // === 动画和UI辅助方法 ===
      
      // 统一的面板显示方法 - 完全参考 mnai chatController.show 实现
      showPanelWithAnimation: function(completion) {
        try {
          if (!self.panelController || !self.panelController.view) {
            if (typeof MNUtil !== "undefined" && MNUtil.log) {
              MNUtil.log("❌ Simple Panel: panelController 或 view 为空");
            }
            return;
          }
          
          var view = self.panelController.view;
          
          if (typeof MNUtil !== "undefined" && MNUtil.log) {
            MNUtil.log("🎯 Simple Panel: 准备显示面板");
            MNUtil.log("🔍 Simple Panel: view.hidden = " + view.hidden);
            MNUtil.log("🔍 Simple Panel: view.alpha = " + view.alpha);
            MNUtil.log("🔍 Simple Panel: view.frame = " + JSON.stringify(view.frame));
            MNUtil.log("🔍 Simple Panel: view.superview = " + (view.superview ? "exists" : "null"));
          }
          
          // 确保视图在最前面 - 这是 mnai 的关键步骤！
          if (typeof MNUtil !== "undefined" && MNUtil.studyView) {
            MNUtil.studyView.bringSubviewToFront(view);
            if (MNUtil.log) {
              MNUtil.log("✅ Simple Panel: 已调用 bringSubviewToFront");
            }
          } else if (view.superview) {
            // 降级方案
            view.superview.bringSubviewToFront(view);
            if (typeof MNUtil !== "undefined" && MNUtil.log) {
              MNUtil.log("✅ Simple Panel: 使用降级方案 bringSubviewToFront");
            }
          }
          
          // 显示视图
          view.hidden = false;
          view.alpha = 1;
          view.layer.opacity = 1.0;  // 确保 layer 也是可见的
          
          // 如果有 show 方法，调用它
          if (self.panelController.show) {
            if (typeof MNUtil !== "undefined" && MNUtil.log) {
              MNUtil.log("🎭 Simple Panel: 调用 panelController.show()");
            }
            self.panelController.show();
          }
          
          if (typeof MNUtil !== "undefined" && MNUtil.log) {
            MNUtil.log("✅ Simple Panel: 面板已显示");
            MNUtil.log("🔍 Simple Panel: 显示后 view.hidden = " + view.hidden);
            MNUtil.log("🔍 Simple Panel: 显示后 view.alpha = " + view.alpha);
            MNUtil.log("🔍 Simple Panel: 显示后 view.layer.opacity = " + view.layer.opacity);
          }
          
          if (completion) {
            // 使用定时器确保界面已更新
            NSTimer.scheduledTimerWithTimeInterval(0.1, false, function() {
              completion();
            });
          }
        } catch (error) {
          if (typeof MNUtil !== "undefined") {
            if (MNUtil.log) {
              MNUtil.log("❌ Simple Panel: showPanelWithAnimation 出错: " + error.message);
              MNUtil.log("❌ Simple Panel: 错误堆栈: " + error.stack);
            }
            MNUtil.showHUD("显示面板失败: " + error.message);
          }
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
  
  // 定义 MenuController 类（降级方案）
  if (typeof MenuController === 'undefined') {
    var MenuController = JSB.defineClass(
      'MenuController : UITableViewController',
      {
        // 表格行数
        tableViewNumberOfRowsInSection: function(tableView, section) {
          return self.commandTable ? self.commandTable.length : 0;
        },
        
        // 表格单元格
        tableViewCellForRowAtIndexPath: function(tableView, indexPath) {
          var cell = UITableViewCell.new();
          cell.initWithStyleReuseIdentifier(0, "MenuCell");
          
          if (self.commandTable && self.commandTable[indexPath.row]) {
            cell.textLabel.text = self.commandTable[indexPath.row].title;
            cell.textLabel.font = UIFont.systemFontOfSize(16);
          }
          
          return cell;
        },
        
        // 行高
        tableViewHeightForRowAtIndexPath: function(tableView, indexPath) {
          return self.rowHeight || 40;
        },
        
        // 选中行
        tableViewDidSelectRowAtIndexPath: function(tableView, indexPath) {
          tableView.deselectRowAtIndexPathAnimated(indexPath, true);
          
          if (self.commandTable && self.commandTable[indexPath.row]) {
            var item = self.commandTable[indexPath.row];
            if (item.object && item.selector && item.selector !== '') {
              var sel = new SEL(item.selector);
              if (item.param !== null && item.param !== undefined) {
                item.object.performSelectorWithObject(sel, item.param);
              } else {
                item.object.performSelector(sel);
              }
            }
          }
          
          // 使用保存的插件实例引用关闭 popover
          if (self.pluginInstance && self.pluginInstance.popoverController) {
            self.pluginInstance.popoverController.dismissPopoverAnimated(true);
            self.pluginInstance.popoverController = null;
          }
        }
      }
    );
  }
  
  return SimplePlugin;
};

// 在文件末尾加载依赖
JSB.require('simplePanelController');