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
        if (!self.ensurePanelReady()) {
          if (typeof MNUtil !== "undefined") {
            MNUtil.showHUD("面板初始化失败");
          }
          return;
        }
        
        // 切换到文本处理模式
        if (self.panelController && self.panelController.switchToMode) {
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
        if (!self.ensurePanelReady()) {
          if (typeof MNUtil !== "undefined") {
            MNUtil.showHUD("面板初始化失败");
          }
          return;
        }
        
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
        if (!self.ensurePanelReady()) {
          if (typeof MNUtil !== "undefined") {
            MNUtil.showHUD("面板初始化失败");
          }
          return;
        }
        
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
        if (!self.ensurePanelReady()) {
          if (typeof MNUtil !== "undefined") {
            MNUtil.showHUD("面板初始化失败");
          }
          return;
        }
        
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
      
      // 确保面板准备就绪 - 参考 mnai 的 ensureView 实现
      ensurePanelReady: function() {
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
        
        // 使用 MNUtil 的 API 确保视图正确添加 - 参考 mnai
        if (typeof MNUtil !== "undefined") {
          // 检查视图是否已经是 studyView 的子视图
          if (!MNUtil.isDescendantOfStudyView(self.panelController.view)) {
            MNUtil.studyView.addSubview(self.panelController.view);
            if (MNUtil.log) {
              MNUtil.log("✅ Simple Panel: 面板已添加到 MNUtil.studyView");
            }
          } else {
            if (MNUtil.log) {
              MNUtil.log("✅ Simple Panel: 面板已经存在于 studyView 中");
            }
          }
        } else {
          // 降级方案：直接检查 superview
          if (!self.panelController.view.superview) {
            var studyView = self.appInstance.studyController(self.window).view;
            if (studyView) {
              studyView.addSubview(self.panelController.view);
            } else {
              return false;
            }
          }
        }
        
        return true;
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
        }
        
        // 完全参考 mnai 的 show 方法
        if (typeof MNUtil !== "undefined" && MNUtil.studyView) {
          // 确保视图在最前面 - 这是 mnai 的关键步骤！
          MNUtil.studyView.bringSubviewToFront(view);
        }
        
        // 显示视图
        view.hidden = false;
        view.alpha = 1;
        
        // 如果有 show 方法，调用它
        if (self.panelController.show) {
          self.panelController.show();
        }
        
        if (typeof MNUtil !== "undefined" && MNUtil.log) {
          MNUtil.log("✅ Simple Panel: 面板已显示");
          MNUtil.log("🔍 Simple Panel: 显示后 view.hidden = " + view.hidden);
          MNUtil.log("🔍 Simple Panel: 显示后 view.alpha = " + view.alpha);
        }
        
        if (completion) {
          // 使用定时器确保界面已更新
          NSTimer.scheduledTimerWithTimeInterval(0.1, false, function() {
            completion();
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