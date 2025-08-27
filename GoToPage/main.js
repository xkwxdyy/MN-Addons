JSB.newAddon = function(mainPath) {
  const KEY = 'GoToPage.Offsets';

  let pageNoOffsets = {};
  let currentDocmd5;

  //MARK - Addon Class definition
  var newAddonClass= JSB.defineClass('GoToPage : JSExtension', {
    //Mark: - Instance Method Definitions
    // Window initialize
    sceneWillConnect: function() {
      if (NSUserDefaults.standardUserDefaults().objectForKey(KEY)) {
        pageNoOffsets = NSUserDefaults.standardUserDefaults().objectForKey(KEY);
      }
      self.checked = false
      // JSB.log('🌈🌈🌈 MNLOG pageNoOffsets keys: %@', Object.keys(pageNoOffsets).toString());
    },
    // Window disconnect
    sceneDidDisconnect: function() {
    },
    // Window resign active
    sceneWillResignActive: function() {
    },
    // Window become active
    sceneDidBecomeActive: function() {
    },
    //MARK: MN behaviors
    notebookWillOpen: function(notebookid) {
    },
    notebookWillClose: function(notebookid) {
    },
    documentDidOpen: function(docmd5) {
      currentDocmd5 = docmd5
    },
    documentWillClose: function(docmd5) {
      currentDocmd5 = ''
    },
    controllerWillLayoutSubviews: function(controller) {
    },
    queryAddonCommandStatus: function() {
      return {
        image: 'GoToPage.png',
        object: self,
        selector: "toggleGoToPage:",
        checked: self.checked 
      };
    },
    // Add-On Switch
    // 这段代码实现了一个插件功能，用于在 MarginNote 中前往指定页面的功能
    toggleGoToPage: function(sender) {
      // 打印日志
      JSB.log('🌈🌈🌈 MNLOG toggleGoToPage');
      
      // 获取当前应用实例
      let app = Application.sharedInstance();
      
      // 将开关设置为选中状态
      self.checked = true;
      
      // 刷新插件命令以反映更新
      app.studyController(self.window).refreshAddonCommands();
      
      // 如果前往页面命令被禁用，则直接返回
      if (app.queryCommandWithKeyFlagsInWindow("p", 0x100000, self.window).disabled) {
        return;
      }
      
      // 设置标题变量
      var title = "Page Offset nil!";
      if (pageNoOffsets[currentDocmd5]) {
        title = 'Page Offset: ' + pageNoOffsets[currentDocmd5];
      }
      
      // 打印日志
      JSB.log('🌈🌈🌈 MNLOG title: %@', title);  
      
      // 设置提示信息
      let message = 'Ex: Set Offset(2) and Page(10): "2@10"\nSet Page(10): "10"\nSet Offset(2): "2@"';
      
      // 弹出对话框，等待用户输入
      UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(title, message, 2, "Go", [], function(alert) {
        // 处理用户输入的回调函数
        JSB.log('🌈🌈🌈 MNLOG tapBlock: arg1: %@', alert);
        let text = alert.textFieldAtIndex(0).text;
        
        // 打印日志
        JSB.log('🌈🌈🌈 MNLOG settingAlert text: %@', text);
        
        // 根据输入的内容处理页面偏移和实际页面号
        let texts = text.split('@');
      
        var realPageNo;
        if (texts.length == 2) {
          // 说明设置了偏移量，比如 2@10
          if (!isNaN(parseInt(texts[0]))) {
            // 偏移量是个整数
            pageNoOffsets[currentDocmd5] = parseInt(texts[0]);
            JSB.log('🌈🌈🌈 MNLOG pageNoOffsets keys: %@', Object.keys(pageNoOffsets).toString());
            NSUserDefaults.standardUserDefaults().setObjectForKey(pageNoOffsets, KEY);
          }
          if (!isNaN(parseInt(texts[1]))) {
            realPageNo = parseInt(texts[1]);
          }
        } else if (texts.length == 1) {
          if (!isNaN(parseInt(texts[0]))) {
            realPageNo = parseInt(texts[0]);
          }
        }
      
        // 获取学习控制器实例
        let fsbc = app.studyController(self.window);
        
        // 如果输入的实际页面号是有效数字
        if (!isNaN(realPageNo)) {
          // 创建前往页面的对话框
          let gotoAlert = UIAlertView.makeWithTitleMessageDelegateCancelButtonTitleOtherButtonTitles("Go To Page", "", fsbc, "Real Go", []);
          gotoAlert.alertViewStyle = 2;
          gotoAlert.show();
          let tf = gotoAlert.textFieldAtIndex(0);
          
          // 计算页码偏移
          let offset = !isNaN(pageNoOffsets[currentDocmd5]) ? pageNoOffsets[currentDocmd5] : 0;
          tf.text = (realPageNo + offset).toString();

          // 设置超时计数器
          timeoutCount = 20;
          NSTimer.scheduledTimerWithTimeInterval(0.5, true, function(timer) {
            timeoutCount -= 1;
            if (app.osType === 2 || app.focusWindow.subviews.length === 1 || timeoutCount <= 0) {
              self.checked = false;
              fsbc.refreshAddonCommands();
              timer.invalidate();
              JSB.log('🌈🌈🌈 MNLOG timer invalidate, timeoutCount: %@', timeoutCount);
              return;
            }
          });
        } else {
          // 如果输入无效，重置状态并刷新插件命令
          self.checked = false;
          fsbc.refreshAddonCommands();
        }
      });
    },
  }, /*Class members*/ {
    //MARK: - Class Method Definitions
    addonDidConnect: function() {
    },
    addonWillDisconnect: function() {
    },
    applicationWillEnterForeground: function() {
    },
    applicationDidEnterBackground: function() {
    },
    applicationDidReceiveLocalNotification: function(notify) {
    },
  });
  return newAddonClass;
};
