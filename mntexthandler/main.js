JSB.newAddon = function (mainPath) {
  // 加载 webviewController.js
  // TODO：require 相当于 LaTeX 的 \input 吗？
  // 只是加载里面的代码还是有额外的处理？
  JSB.require('webviewController');
  // 定义一个类，这个类是插件主体
  var MNTextHandlerClass = JSB.defineClass(
    'mnTextHandler : JSExtension',
    {
      // 定义插件的生命周期的一些行为
      /* Instance members */

      // 用于 MarginNote 开启一个窗口后执行代码
      sceneWillConnect: function () { //Window initialize
        // 调用 Application 中的 sharedInstance() 方法，该方法会返回一个类的实例，
        // 换而言之，使用上述代码等同于使用new来创建一个实例。
        // 来自：https://is.gd/RTn3DE
        self.appInstance = Application.sharedInstance();
        self.addonController = mnTextHandlerController.new();  // mnTextHandlerController 在 webviewController.js 中定义
        self.addonController.mainPath = mainPath;
        self.rect = '{{0, 0}, {10, 10}}';
        self.arrow = 1;
      },

      // 用于MarginNote关闭一个窗口后执行代码
      sceneDidDisconnect: function () { // Window disconnect

      },

      // 用于MarginNote重新激活一个窗口后执行代码
      sceneWillResignActive: function () { // Window resign active
      },

      // 用于MarginNote激活一个窗口后执行代码
      sceneDidBecomeActive: function () { // Window become active
      },

      // 用于MarginNote打开一个笔记本后执行代码
      notebookWillOpen: function (notebookid) {
        if (self.appInstance.studyController(self.window).studyMode < 3) {
          self.appInstance.studyController(self.window).refreshAddonCommands();
          self.appInstance.studyController(self.window).view.addSubview(self.addonController.view);
          self.addonController.view.hidden = true;
          NSNotificationCenter.defaultCenter().addObserverSelectorName(self, 'onPopupMenuOnSelection:', 'PopupMenuOnSelection');
          // NSNotificationCenter.defaultCenter().addObserverSelectorName(self, 'onClosePopupMenuOnSelection:', 'ClosePopupMenuOnSelection');
          // NSNotificationCenter.defaultCenter().addObserverSelectorName(self, 'onPopupMenuOnNote:', 'PopupMenuOnNote');
          // NSNotificationCenter.defaultCenter().addObserverSelectorName(self, 'onClosePopupMenuOnNote:', 'ClosePopupMenuOnNote');
          // NSNotificationCenter.defaultCenter().addObserverSelectorName(self, 'onProcessNewExcerpt:', 'ProcessNewExcerpt');

            self.addonController.transformButton.hidden = false
            self.addonController.pasteButton.hidden = false
            self.addonController.view.frame = { x: 100, y: 0, width: 500, height: 150 }
            self.addonController.currentFrame = { x: 100, y: 0, width: 500, height: 150 }
          }
          NSTimer.scheduledTimerWithTimeInterval(0.2, false, function () {
            self.appInstance.studyController(self.window).becomeFirstResponder(); //For dismiss keyboard on iOS
          });
      },

      notebookWillClose: function (notebookid) {
      },

      documentDidOpen: function (docmd5) {
      },

      documentWillClose: function (docmd5) {
      },

      controllerWillLayoutSubviews: function (controller) {
        if (controller !== self.appInstance.studyController(self.window)) {
          return;
        };
        if (!self.addonController.view.hidden) {
          let studyFrame = Application.sharedInstance().studyController(this.window).view.bounds
            let currentFrame = self.addonController.currentFrame
            if (currentFrame.x+currentFrame.width*0.5 >= studyFrame.width) {
              currentFrame.x = studyFrame.width-currentFrame.width*0.5              
            }
            if (currentFrame.y >= studyFrame.height) {
              currentFrame.y = studyFrame.height-20              
            }
            self.addonController.view.frame = currentFrame
            self.addonController.currentFrame = currentFrame
        }
      },
      
      // 查询插件命令状态
      queryAddonCommandStatus: function () {
        if (self.appInstance.studyController(self.window).studyMode < 3) {
          return {
            image: 'logo.png',
            object: self,
            selector: 'toggleAddon:',
            checked: self.watchMode
          };
        } else {
          return null;
        }
      },

      onPopupMenuOnSelection: function (sender) { // Selecting text on pdf or epub
        if (self.addonController.view.hidden) {
          return
        }
        // 用户从文档中选择的文本自动填充到输入框中
        let textSelected  = sender.userInfo.documentController.selectionText
        if (textSelected) {
          self.addonController.textviewInput.text = textSelected
        }
      },
      onProcessNewExcerpt:function (sender) {
      },
      onPopupMenuOnNote: function (sender) { // Clicking note

      },
      toggleAddon:function (sender) {
      let textSelected = self.appInstance.studyController(self.window).readerController.currentDocumentController.selectionText
      if (textSelected) {
        self.addonController.textviewInput.text = textSelected
        self.addonController.view.hidden = false
      }else{
        self.addonController.view.hidden = !self.addonController.view.hidden
      }

      }
    },
    { /* Class members */
      addonDidConnect: function () {
      },

      addonWillDisconnect: function () {
        // NSUserDefaults.standardUserDefaults().removeObjectForKey("MNAutoStyle")
      },

      applicationWillEnterForeground: function () {
      },

      applicationDidEnterBackground: function () {
      },

      applicationDidReceiveLocalNotification: function (notify) {
      }
    }
  );
  return MNTextHandlerClass;
};