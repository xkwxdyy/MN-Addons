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
      
      // 查询插件状态（显示图标）
      queryAddonCommandStatus: function () {
        
        if (self.appInstance.studyController(self.window).studyMode < 3) {
          var result = {
            image: 'logo.png',
            object: self,
            selector: 'showMenu:',
            checked: false  // 菜单不需要checked状态
          };
          
          return result;
        }
        return null;
      },
      
      // 显示主菜单
      showMenu: function (button) {
        // 调试日志
        if (typeof MNUtil !== "undefined" && MNUtil.log) {
          MNUtil.log("📋 Simple Panel: showMenu called");
        }
        
        // 定义菜单项
        var commandTable = [
          {title: '🔧  文本处理', object: self, selector: 'openTextProcessor:', param: null},
          {title: '📝  快速笔记', object: self, selector: 'openQuickNote:', param: null},
          {title: '🔍  搜索替换', object: self, selector: 'openSearchReplace:', param: null},
          {title: '⚙️  设置', object: self, selector: 'openSettings:', param: null},
          {title: '💡  帮助', object: self, selector: 'showHelp:', param: null}
        ];
        
        // 检查 Menu 类是否存在
        if (typeof Menu !== "undefined") {
          if (typeof MNUtil !== "undefined" && MNUtil.log) {
            MNUtil.log("✅ Simple Panel: Menu 类存在，创建菜单");
          }
          
          var menu = new Menu(button, self, 200, 2);
          menu.addMenuItems(commandTable);
          menu.show();
        } else {
          // 使用原生 popover 作为降级方案
          if (typeof MNUtil !== "undefined" && MNUtil.log) {
            MNUtil.log("⚠️ Simple Panel: Menu 类不存在，使用原生 popover");
          }
          
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
          var rect = button.convertRectToView(button.bounds, button.superview.superview);
          self.popoverController.presentPopoverFromRectInViewPermittedArrowDirectionsAnimated(
            rect, 
            button.superview.superview, 
            1 << 2, // 向上箭头
            true
          );
        }
      },
      
      // 打开文本处理面板
      openTextProcessor: function() {
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
        
        // 确保面板已初始化
        self.ensurePanelReady();
        
        // 切换到文本处理模式
        if (self.panelController.switchToMode) {
          self.panelController.switchToMode("textProcessor");
        }
        
        // 显示面板
        self.showPanelWithAnimation();
        
        // 尝试获取选中文本
        var selectedText = self.getSelectedText();
        if (selectedText) {
          self.panelController.inputField.text = selectedText;
        }
      },
      
      // 打开快速笔记
      openQuickNote: function() {
        if (typeof MNUtil !== "undefined" && MNUtil.log) {
          MNUtil.log("📝 Simple Panel: 打开快速笔记");
        }
        
        // 关闭菜单
        if (typeof Menu !== "undefined") {
          Menu.dismissCurrentMenu();
        }
        if (self.popoverController) {
          self.popoverController.dismissPopoverAnimated(true);
          self.popoverController = null;
        }
        
        // 确保面板已初始化
        self.ensurePanelReady();
        
        // 切换到笔记模式
        if (self.panelController.switchToMode) {
          self.panelController.switchToMode("quickNote");
        }
        
        // 显示面板
        self.showPanelWithAnimation(function() {
          if (typeof MNUtil !== "undefined") {
            MNUtil.showHUD("📝 快速笔记模式");
          }
        });
      },
      
      // 打开搜索替换
      openSearchReplace: function() {
        if (typeof MNUtil !== "undefined" && MNUtil.log) {
          MNUtil.log("🔍 Simple Panel: 打开搜索替换");
        }
        
        // 关闭菜单
        if (typeof Menu !== "undefined") {
          Menu.dismissCurrentMenu();
        }
        if (self.popoverController) {
          self.popoverController.dismissPopoverAnimated(true);
          self.popoverController = null;
        }
        
        // 确保面板已初始化
        self.ensurePanelReady();
        
        // 切换到搜索替换模式
        if (self.panelController.switchToMode) {
          self.panelController.switchToMode("searchReplace");
        }
        
        // 显示面板
        self.showPanelWithAnimation(function() {
          if (typeof MNUtil !== "undefined") {
            MNUtil.showHUD("🔍 搜索替换模式");
          }
        });
      },
      
      // 打开设置
      openSettings: function() {
        if (typeof MNUtil !== "undefined" && MNUtil.log) {
          MNUtil.log("⚙️ Simple Panel: 打开设置");
        }
        
        // 关闭菜单
        if (typeof Menu !== "undefined") {
          Menu.dismissCurrentMenu();
        }
        if (self.popoverController) {
          self.popoverController.dismissPopoverAnimated(true);
          self.popoverController = null;
        }
        
        // 确保面板已初始化
        self.ensurePanelReady();
        
        // 显示面板
        self.showPanelWithAnimation(function() {
          // 动画完成后显示设置菜单
          NSTimer.scheduledTimerWithTimeInterval(0.1, false, function() {
            if (self.panelController && self.panelController.settingsButton && self.panelController.showSettings) {
              self.panelController.showSettings(self.panelController.settingsButton);
            }
          });
        });
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
      
      // 确保面板准备就绪
      ensurePanelReady: function() {
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
            
            if (typeof MNUtil !== "undefined" && MNUtil.log) {
              MNUtil.log("✅ Simple Panel: 面板已添加到 studyView");
            }
          } else {
            if (typeof MNUtil !== "undefined" && MNUtil.log) {
              MNUtil.log("❌ Simple Panel: studyView is null!");
            }
          }
        } else {
          if (typeof MNUtil !== "undefined" && MNUtil.log) {
            MNUtil.log("✅ Simple Panel: 面板已经存在于视图中");
          }
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
      
      // 统一的面板显示动画
      showPanelWithAnimation: function(completion) {
        if (!self.panelController || !self.panelController.view) return;
        
        var view = self.panelController.view;
        
        // 先取消隐藏
        view.hidden = false;
        
        if (typeof MNUtil !== "undefined" && MNUtil.animate) {
          // 设置初始状态 - 缩小并透明
          view.alpha = 0;
          view.transform = {a: 0.8, b: 0, c: 0, d: 0.8, tx: 0, ty: 0};
          
          // 执行弹性动画
          NSTimer.scheduledTimerWithTimeInterval(0.01, false, function() {
            // 使用更高级的弹性动画
            UIView.animateWithDurationDelayUsingSpringWithDampingInitialSpringVelocityOptionsAnimationsCompletion(
              0.4,    // 动画时长
              0,      // 延迟
              0.8,    // 阻尼系数（0.8 = 轻微弹性）
              0.5,    // 初始速度
              0,      // 选项
              function() {
                view.alpha = 1;
                view.transform = {a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0};
              },
              function() {
                // 动画完成回调
                if (completion) completion();
              }
            );
          });
        } else {
          // 降级方案：简单动画
          view.alpha = 0;
          NSTimer.scheduledTimerWithTimeInterval(0.01, false, function() {
            if (typeof MNUtil !== "undefined" && MNUtil.animate) {
              MNUtil.animate(function() {
                view.alpha = 1;
              }, 0.3).then(function() {
                if (completion) completion();
              });
            } else {
              // 没有动画支持时直接显示
              view.alpha = 1;
              if (completion) completion();
            }
          });
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