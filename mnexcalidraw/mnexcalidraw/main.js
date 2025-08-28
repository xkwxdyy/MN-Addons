
JSB.newAddon = function (mainPath) {
  JSB.require('utils');
  if (!excalidrawUtils.checkMNUtilsFolder(mainPath)) {return undefined}
  JSB.require('webviewController');
  JSB.require('settingController');
  var temSender;
  
  /** @return {MNExcalidrawClass} */
  const getMNExcalidrawClass = ()=>self

  var MNExcalidrawClass = JSB.defineClass(
    'MNExcalidraw : JSExtension',
    { /* Instance members */
      sceneWillConnect: async function () { //Window initialize
        if (!(await chatAIUtils.checkMNUtil(true))) return
        let self = getMNExcalidrawClass()
        self.init(mainPath)
        self.watchMode = false;
        self.textSelected = ""
        self.textProcessed = false;
        self.dateGetText = Date.now();
        self.dateNow = Date.now();
        self.rect = '{{0, 0}, {10, 10}}';
        self.arrow = 1;
        self.isFirst = true;
        self.linkDetected = false
        // self.first = true;
        // } catch (error) {
        // Application.sharedInstance().showHUD(error,self.window,2)
        // }
        // NSNotificationCenter.defaultCenter().addObserverSelectorName(self, 'trst:', 'onReciveTrst');
        // NSNotificationCenter.defaultCenter().addObserverSelectorName(self, 'onClosePopupMenuOnSelection:', 'ClosePopupMenuOnSelection');
      },

      sceneDidDisconnect: function () { // Window disconnect

      },

      sceneWillResignActive: function () { // Window resign active
      },

      sceneDidBecomeActive: function () { // Window become active
      },

      notebookWillOpen: async function (notebookid) {
        if (!(await excalidrawUtils.checkMNUtil(false,0.1))) return
        let self =  getMNExcalidrawClass()
        self.init(mainPath)
        // MNUtil.showHUD("message"+excalidrawConfig.toolbar)

        try {
          

        // if (self.appInstance.studyController(self.window).studyMode < 3) {
        self.appInstance = Application.sharedInstance();
        // self.addonController = excalidrawController.new();
        if (!self.addonController) {
          self.addonController = excalidrawController.new();
        }
        MNUtil.studyView.addSubview(self.addonController.view)
        MNUtil.refreshAddonCommands()
        self.addonController.view.hidden = true;
        self.addonController.notebookid = notebookid
        self.addonController.webview.loadFileURLAllowingReadAccessToURL(
          NSURL.fileURLWithPath(excalidrawUtils.mainPath + '/editor.html'),
          NSURL.fileURLWithPath(excalidrawUtils.mainPath + '/')
        );
        // MNUtil.addObserver(self, 'onPasteboardChange:', 'UIPasteboardChangedNotification');
        // MNUtil.addObserver(self, 'onPasteboardChange:', 'UIPasteboardChangedTypesAddedKey');
        // MNUtil.addObserver(self, 'onPasteboardChange:', 'UIPasteboardChangedTypesRemovedKey');
        // MNUtil.addObserver(self, 'onPasteboardChange:', 'UIPasteboardRemovedNotification');
        excalidrawConfig.toolbar = true

        self.addonController.webAppButton.hidden = false
        // self.addonController.webAppEntriesButton.hidden = !toolbar
        // self.addonController.searchButton.hidden = !toolbar
        self.addonController.homeButton.hidden = false
        self.addonController.goBackButton.hidden = false
        self.addonController.goForwardButton.hidden = false
        self.addonController.refreshButton.hidden = false
        self.addonController.engineButton.hidden = false
        var viewFrame = self.addonController.view.bounds;
        if (excalidrawConfig.toolbar) {
          self.addonController.webview.frame = MNUtil.genFrame(viewFrame.x + 1, viewFrame.y + 10, viewFrame.width - 2, viewFrame.height - 40)
        } else {
          self.addonController.webview.frame = MNUtil.genFrame(viewFrame.x + 1, viewFrame.y + 10, viewFrame.width - 2, viewFrame.height)
        }
        // excalidrawConfig.toolbar = excalidrawConfig.dynamic
        // self.customLayoutAddonController();
        MNUtil.delay(0.1).then(()=>{
          MNUtil.studyView.becomeFirstResponder()
        })
        } catch (error) {
          MNUtil.showHUD("Error in notebookWillOpen: "+error)

        }
      },

      notebookWillClose: function (notebookid) {
        if (typeof MNUtil === 'undefined') {
          return
        }
        // Application.sharedInstance().showHUD("close",self.window,2)
        if (self.addonController.miniMode) {
          let preFrame = self.addonController.view.frame
          self.addonController.view.hidden = true
          self.addonController.showAllButton()
          let studyFrame = MNUtil.studyView.bounds
          if (self.addonController.view.frame.x < studyFrame.width*0.5) {
            self.addonController.lastFrame.x = 0
          }else{
            self.addonController.lastFrame.x = studyFrame.width-self.addonController.lastFrame.width
          }
          self.addonController.setFrame(self.addonController.lastFrame)
          self.addonController.show(preFrame)
        }
        self.addonController.view.removeFromSuperview()

        // self.appInstance.studyController(self.window).view.remov(self.addonController.view);
        
        self.watchMode = false;
        self.textSelected = '';
      },

      documentDidOpen: function (docmd5) {
      },

      documentWillClose: function (docmd5) {
      },

      controllerWillLayoutSubviews: function (controller) {
        if (typeof MNUtil === 'undefined') {
          return
        }
        if (controller !== self.appInstance.studyController(self.window)) {
          return;
        };
        if (!self.addonController.view.hidden) {
          let studyFrame = MNUtil.studyView.bounds
          if (self.addonController.miniMode) {
            let oldFrame = self.addonController.view.frame
            if (oldFrame.x < studyFrame.width*0.5) {
            // self.addonController.view.frame = self.addonController.currentFrame
              self.addonController.view.frame = { x: 0, y: oldFrame.y, width: 40, height: 40 }
            } else {
              self.addonController.view.frame = { x: studyFrame.width - 40, y: oldFrame.y, width: 40, height: 40 }
            }
          } else if (self.addonController.custom) {
            self.addonController.setSplitScreenFrame(self.addonController.customMode)
            self.addonController.webview.frame = self.addonController.view.bounds
          }else{
            let currentFrame = self.addonController.currentFrame
            if (currentFrame.x+currentFrame.width*0.5 >= studyFrame.width) {
              currentFrame.x = studyFrame.width-currentFrame.width*0.5              
            }
            if (currentFrame.y >= studyFrame.height) {
              currentFrame.y = studyFrame.height-20              
            }
            self.addonController.setFrame(currentFrame)
          }
        }
      },

      queryAddonCommandStatus: function () {
        if (typeof MNUtil === 'undefined') return null
        return {
          image: 'logo.png',
          object: self,
          selector: 'toggleAddon:',
          checked: self.watchMode
        };
      },
      toggleAddon: async function (sender) {
        if (typeof MNUtil === 'undefined') {
          return
        }
        try {
        if (!self.addonBar) {
          self.addonBar = sender.superview.superview
          self.addonController.addonBar = self.addonBar
        }
        // if (self.checkWatchMode()) { return }

        if (self.addonController.view.hidden) {
          if (self.isFirst) {
            // Application.sharedInstance().showHUD("first",self.window,2)

            let buttonFrame = self.addonBar.frame
            let width = MNUtil.app.osType !== 1 ? 450 : 365
            if (buttonFrame.x === 0) {
              self.addonController.setFrame(40,buttonFrame.y,width,550)
            }else{
              self.addonController.setFrame(buttonFrame.x-width,buttonFrame.y,width,550)
            }
            self.isFirst = false;
          }
        // MNUtil.showHUD("message"+excalidrawConfig.toolbar)
          MNUtil.studyView.bringSubviewToFront(self.addonBar)
          self.addonController.show(self.addonBar.frame,true)
          // self.addonController.view.hidden = false
          // self.addonController.webview.hidden = false
        } else {
          if (self.textProcessed || self.watchMode) {
            // self.addonController.view.hidden = true;
            if (self.addonController.miniMode) {
              let preFrame = self.addonController.view.frame
              self.addonController.view.hidden = true
              self.addonController.showAllButton()
              let studyFrame = MNUtil.studyView.bounds
              if (self.addonController.view.frame.x < studyFrame.width*0.5) {
                self.addonController.lastFrame.x = 0
              }else{
                self.addonController.lastFrame.x = studyFrame.width-self.addonController.lastFrame.width
              }
              self.addonController.setFrame(self.addonController.lastFrame)
              MNUtil.studyView.bringSubviewToFront(self.addonBar)
              self.addonController.show(preFrame,true)
            }else{
              self.addonController.hide(self.addonBar.frame)
            }
            self.watchMode = false;
            MNUtil.refreshAddonCommands()
            return;
          }
        }
} catch (error) {
        MNUtil.showHUD("Error in toggleAddon: "+error)
  
}
      },
    },
    { /* Class members */
      addonDidConnect: function () {
      },

      addonWillDisconnect: async function () {
      },

      applicationWillEnterForeground: function () {
      },

      applicationDidEnterBackground: function () {
      },

      applicationDidReceiveLocalNotification: function (notify) {
      }
    }
  );

  MNExcalidrawClass.prototype.layoutAddonController = function (rectStr, arrowNum) {

    this.rect = rectStr || this.rect;
    this.arrow = arrowNum || this.arrow;
    var x, y
    w = (MNUtil.app.osType !== 1) ? 419 : 365, // this.addonController.view.frame.width
      h = 500, // this.addonController.view.frame.height
      fontSize = 15,
      margin = 10,
      padding = 20,
      frame = MNUtil.studyView.bounds,
      W = frame.width,
      H = frame.height,
      rectArr = this.rect.replace(/{/g, '').replace(/}/g, '').replace(/\s/g, '').split(','),
      X = Number(rectArr[0]),
      Y = Number(rectArr[1]),
      studyMode = MNUtil.studyController.studyMode,
      contextMenuWidth = studyMode === 0 ? 225 : 435,
      contextMenuHeight = 35,
      textMenuPadding = 40;

    // this.addonController.view.frame.x
    if (w >= contextMenuWidth) {
      if (X - w / 2 - margin <= 0) {
        x = margin;
      } else if (X + w / 2 + margin >= W) {
        x = W - margin - w;
      } else {
        x = X - w / 2;
      }
    } else {
      if (X - contextMenuWidth / 2 - margin <= 0) {
        x = margin + contextMenuWidth / 2 - w / 2;
      } else if (X + contextMenuWidth / 2 + margin >= W) {
        x = W - margin - contextMenuWidth / 2 - w / 2;
      } else {
        x = X - w / 2;
      }
    }

    // this.addonController.view.frame.[y, height]
    if (this.arrow === 1) {
      let upperBlankHeight = Y - textMenuPadding - fontSize - padding,
        lowerBlankHeight = H - Y - contextMenuHeight - padding;
      if (upperBlankHeight >= lowerBlankHeight) {
        h = (upperBlankHeight >= h) ? h : upperBlankHeight;
        y = upperBlankHeight - h;
      } else {
        y = H - lowerBlankHeight;
        h = (H - y >= h) ? h : H - y;
    // this.appInstance.showHUD('x:'+x+';y:'+Y,this.window,2)
      }
    } else {
      let upperBlankHeight = Y - textMenuPadding - contextMenuHeight - padding,
        lowerBlankHeight = H - Y - fontSize - padding;
      if (upperBlankHeight >= lowerBlankHeight) {
        h = (upperBlankHeight >= h) ? h : upperBlankHeight;
        y = upperBlankHeight - h;
      } else {
        y = H - lowerBlankHeight;
        h = (H - y >= h) ? h : H - y;
      }
    }
    this.addonController.setFrame(x,y,w,h)

  };
  MNExcalidrawClass.prototype.customLayoutAddonController = function (rectStr, arrowNum, custom = false) {

    this.rect = rectStr || this.rect;
    this.arrow = arrowNum || this.arrow;
    var x, y
      w = (this.appInstance.osType !== 1) ? 419 : 365, // this.addonController.view.frame.width
      h = 450, // this.addonController.view.frame.height
      fontSize = 15,
      margin = 10,
      padding = 20,
      frame = this.appInstance.studyController(this.window).view.bounds,
      W = frame.width,
      H = frame.height,
      rectArr = this.rect.replace(/{/g, '').replace(/}/g, '').replace(/\s/g, '').split(','),
      X = Number(rectArr[0]),
      Y = Number(rectArr[1]),
      studyMode = this.appInstance.studyController(this.window).studyMode,
      contextMenuWidth = studyMode === 0 ? 225 : 435,
      contextMenuHeight = 35,
      textMenuPadding = 40;

    // this.addonController.view.frame.x
    if (w >= contextMenuWidth) {
      if (X - w / 2 - margin <= 0) {
        x = margin;
      } else if (X + w / 2 + margin >= W) {
        x = W - margin - w;
      } else {
        x = X - w / 2;
      }
    } else {
      if (X - contextMenuWidth / 2 - margin <= 0) {
        x = margin + contextMenuWidth / 2 - w / 2;
      } else if (X + contextMenuWidth / 2 + margin >= W) {
        x = W - margin - contextMenuWidth / 2 - w / 2;
      } else {
        x = X - w / 2;
      }
    }

    // this.addonController.view.frame.[y, height]
    if (this.arrow === 1) {
      let upperBlankHeight = Y - textMenuPadding - fontSize - padding,
        lowerBlankHeight = H - Y - contextMenuHeight - padding;
      if (upperBlankHeight >= lowerBlankHeight) {
        h = (upperBlankHeight >= h) ? h : upperBlankHeight;
        y = upperBlankHeight - h;
      } else {
        y = H - lowerBlankHeight;
        h = (H - y >= h) ? h : H - y;
      }
    } else {
      let upperBlankHeight = Y - textMenuPadding - contextMenuHeight - padding,
        lowerBlankHeight = H - Y - fontSize - padding;
      if (upperBlankHeight >= lowerBlankHeight) {
        h = (upperBlankHeight >= h) ? h : upperBlankHeight;
        y = upperBlankHeight - h;
      } else {
        y = H - lowerBlankHeight;
        h = (H - y >= h) ? h : H - y;
      }
    }
    this.addonController.setFrame(x,y+50,w,h)
  };
  MNExcalidrawClass.prototype.init = function(mainPath){
  try {
    if (!this.initialized) {
      excalidrawUtils.init(mainPath)
      excalidrawConfig.init()
      this.initialized = true
    }
  } catch (error) {
    chatAIUtils.addErrorLog(error, "init")
  }
  }
  return MNExcalidrawClass;
};

