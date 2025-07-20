
JSB.newAddon = function (mainPath) {
  JSB.require('utils');
  if (!browserUtils.checkMNUtilsFolder(mainPath)) {return undefined}
  JSB.require('webviewController');
  JSB.require('settingController');
    // NSUserDefaults.standardUserDefaults().removeObjectForKey("MNBrowser_entrieNames")
    // NSUserDefaults.standardUserDefaults().removeObjectForKey("MNBrowser_entries")
    // NSUserDefaults.standardUserDefaults().removeObjectForKey('MNBrowser_engine');
    // NSUserDefaults.standardUserDefaults().removeObjectForKey("MNBrowser_webAppEntrieNames")
    // NSUserDefaults.standardUserDefaults().removeObjectForKey("MNBrowser_webAppEntries")
    // NSUserDefaults.standardUserDefaults().removeObjectForKey('MNBrowser_webApp');
    // NSUserDefaults.standardUserDefaults().removeObjectForKey('MNBrowser_toolbar');
    // NSUserDefaults.standardUserDefaults().removeObjectForKey('MNBrowser_onNewExcerpt');
    // NSUserDefaults.standardUserDefaults().removeObjectForKey('MNBrowser_dynamic');
  var temSender;
  
  /** @return {MNBrowserClass} */
  const getMNBrowserClass = ()=>self
  var MNBrowserClass = JSB.defineClass(
    'MNBrowser : JSExtension',
    { /* Instance members */
      sceneWillConnect: async function () { //Window initialize
        if (!(await browserUtils.checkMNUtil(true))) return
        let self = getMNBrowserClass()
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
        self.addObserver( 'onPopupMenuOnSelection:', 'PopupMenuOnSelection')
        self.addObserver( 'onPopupMenuOnNote:', 'PopupMenuOnNote');
        self.addObserver( 'onCloseView:', 'close');
        self.addObserver( 'receivedSearchInBrowser:', 'searchInBrowser');
        self.addObserver( 'receivedOpenInBrowser:', 'openInBrowser');
        self.addObserver( 'onNewWindow:', 'newWindow');
        self.addObserver( 'onSetVideo:', 'browserVideo');
        self.addObserver( 'onAddonBroadcast:', 'AddonBroadcast');
        self.addObserver( 'onCloudConfigChange:', 'NSUbiquitousKeyValueStoreDidChangeExternallyNotificationUI')
      },

      sceneDidDisconnect: function () { // Window disconnect
        // MNUtil.copy("sceneDidDisconnect")
        if (typeof MNUtil === 'undefined') return
        let self = getMNBrowserClass()
        self.addonController.homePage()
        let names = [
          'PopupMenuOnSelection','PopupMenuOnNote','close', 'searchInBrowser','openInBrowser','newWindow','browserVideo','AddonBroadcast','NSUbiquitousKeyValueStoreDidChangeExternallyNotificationUI'
        ]
        self.removeObservers(names)
      },

      sceneWillResignActive: function () { // Window resign active
        // MNUtil.copy("sceneWillResignActive")
      },

      sceneDidBecomeActive: function () { // Window become active
        // MNUtil.copy("sceneDidBecomeActive")
      },

      notebookWillOpen: async function (notebookid) {
        if (!(await browserUtils.checkMNUtil(true,0.1))) return
      try {
        let self = getMNBrowserClass()
        self.init(mainPath)
        self.ensureView()
        // if (self.appInstance.studyController(self.window).studyMode < 3) {
        self.appInstance = Application.sharedInstance();
        // self.addonController = browserController.new();
        MNUtil.studyView.addSubview(self.addonController.view)
        MNUtil.refreshAddonCommands()
        self.addonController.view.hidden = true;
        self.addonController.notebookid = notebookid

        if (browserConfig.dynamic) {
          browserConfig.toolbar = false
        }
        self.addonController.buttonScrollview.hidden = !browserConfig.toolbar
        var viewFrame = self.addonController.view.bounds;
        if (browserConfig.toolbar) {
          self.addonController.webview.frame = MNUtil.genFrame(viewFrame.x + 1, viewFrame.y + 10, viewFrame.width - 2, viewFrame.height - 40)
        } else {
          self.addonController.webview.frame = MNUtil.genFrame(viewFrame.x + 1, viewFrame.y + 10, viewFrame.width - 2, viewFrame.height)
        }
        MNUtil.delay(0.1).then(()=>{
          MNUtil.studyView.becomeFirstResponder()
        })
        } catch (error) {
          browserUtils.addErrorLog(error, "notebookWillOpen")
        }
      },

      notebookWillClose: function (notebookid) {
        if (typeof MNUtil === 'undefined') {
          return
        }
        // MNUtil.copy("notebookWillClose")

        // Application.sharedInstance().showHUD("close",self.window,2)
        if (self.addonController.miniMode) {
          self.addonController.homePage()
          let preFrame = self.addonController.view.frame
          self.addonController.view.hidden = true
          self.addonController.showAllButton()
          let studyFrame = Application.sharedInstance().studyController(self.window).view.bounds
          if (self.addonController.view.frame.x < studyFrame.width*0.5) {
            self.addonController.lastFrame.x = 0
          }else{
            self.addonController.lastFrame.x = studyFrame.width-self.addonController.lastFrame.width
          }
          self.addonController.setFrame(self.addonController.lastFrame)
          self.addonController.show(preFrame)
        }
        self.addonController.view.removeFromSuperview()
        self.newWindowController.view.removeFromSuperview()

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
        // MNUtil.mindmapView.superview.subviews.at(-4).hidden = true
        
        // MNUtil.mindmapView.superview.subviews.at(-6).hidden = true
        // MNUtil.mindmapView.superview.subviews.at(-7).hidden = true
        // MNUtil.mindmapView.superview.subviews.at(-8).hidden = true
        // let tem = MNUtil.mindmapView.superview.subviews.at(-1)
        // tem.hidden = tem.subviews.length === 9
        // MNUtil.mindmapView.superview.subviews.at(-1).subviews[3].hidden = true
        // MNUtil.mindmapView.superview.subviews.at(-1).subviews[4].hidden = true
        // MNUtil.mindmapView.superview.subviews.at(-1).subviews[5].hidden = true

        if (controller !== MNUtil.studyController) {
          return;
        };
        // MNUtil.showHUD("message"+self.addonController.currentFrame.width)

        if (!self.addonController.view.hidden && !self.addonController.onAnimate) {
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
        if (!self.newWindowController || self.newWindowController.view.hidden) {return}
        let studyFrame = MNUtil.studyView.bounds
        if (self.newWindowController.miniMode) {
          let oldFrame = self.newWindowController.view.frame
          if (oldFrame.x < studyFrame.width*0.5) {
            self.newWindowController.view.frame = { x: 0, y: oldFrame.y, width: 40, height: oldFrame.height }
          } else {
            self.newWindowController.view.frame = { x: studyFrame.width - 40, y: oldFrame.y, width: 40, height: oldFrame.height }
          }
        } else if (self.newWindowController.custom) {
          self.addonController.setSplitScreenFrame(self.addonController.customMode)
          self.newWindowController.webview.frame = self.newWindowController.view.bounds
        }else{
          let currentFrame = self.newWindowController.currentFrame
          if (currentFrame.x+currentFrame.width*0.5 >= studyFrame.width) {
            currentFrame.x = studyFrame.width-currentFrame.width*0.5              
          }
          if (currentFrame.y >= studyFrame.height) {
            currentFrame.y = studyFrame.height-20              
          }
          self.newWindowController.setFrame(currentFrame)
        }
      },

      queryAddonCommandStatus: function () {
        if (!browserUtils.checkLogo()) {
          return null
        }
        self.ensureView(false)
        if (self.linkDetected) {
          return {
            image: 'link.png',
            object: self,
            selector: 'toggleAddon:',
            checked: true
          };
        }else{
          return {
            image: 'logo.png',
            object: self,
            selector: 'toggleAddon:',
            checked: self.watchMode
          };
        }
      },
      onCloudConfigChange: async function (sender) {
        let self = getMNBrowserClass()
        if (typeof MNUtil === 'undefined') return
        if (self.window !== MNUtil.currentWindow) {
          return
        }
        if (!browserUtils.checkSubscribe(false,false,true)) {
          return
        }
        let iCloudSync = browserConfig.getConfig("syncSource") === "iCloud"
        if(!iCloudSync || !browserConfig.autoImport(true)){
          return
        }
        // MNUtil.showHUD("MNBrowser\nConfig Changed")

        self.checkUpdate()
      },
      onPopupMenuOnSelection: function (sender) { // Selecting text on pdf or epub
        if (typeof MNUtil === 'undefined') {
          return
        }

          //  Application.sharedInstance().showHUD(sender.userInfo.winRect, self.window, 2);

        if (!self.appInstance.checkNotifySenderInWindow(sender, self.window)) return; // Don't process message from other window
        isOnSelection = true
        let textSelected = sender.userInfo.documentController.selectionText
        self.textSelected = encodeURIComponent(sender.userInfo.documentController.selectionText.replaceAll('/', '\\/'));
        let addonController = self.addonController
        addonController.selectedText = self.textSelected
        if (addonController && !addonController.view.hidden) {
          addonController.blur(0.01)
        }
        if (self.newWindowController) {
          self.newWindowController.selectedText = self.textSelected
          if (!self.newWindowController.view.hidden) {
            self.newWindowController.blur(0.01)
          }
        }
        self.dateGetText = Date.now();
        self.textProcessed = false
        temSender = sender
        if (!addonController.view.window) return;
        if (self.viewTimer) self.viewTimer.invalidate();
        if (self.linkDetected) { 
            // self.appInstance.showHUD("link", self.window, 2);

          self.linkDetected = /^https?:\/\/\w+/.test(textSelected.trim())
          if (self.linkDetected) {
            self.linkTimer.invalidate();
          }else{
            MNUtil.refreshAddonCommands()
          }
        }else{
          self.linkDetected = /^https?:\/\/\w+/.test(textSelected.trim())
            // self.appInstance.showHUD("link", self.window, 2);
          if (self.linkDetected) {
            self.link = textSelected.trim()
            MNUtil.refreshAddonCommands()
            self.linkTimer = NSTimer.scheduledTimerWithTimeInterval(2.5, false, function () {
              self.linkTimer.invalidate()
              self.linkDetected = false
              MNUtil.refreshAddonCommands()
            });
          }
        }
        if (!self.watchMode) {
          if (!addonController.view.hidden) {
            MNButton.setColor(addonController.engineButton, "#5483cd",0.8)
          }
          if (self.newWindowController) {
            MNButton.setColor(self.newWindowController.engineButton, "#5483cd",0.8)
          }

          self.viewTimer = NSTimer.scheduledTimerWithTimeInterval(5, false, function () {
            if (addonController.desktop) { 
              MNButton.setColor(addonController.engineButton, "#b5b5f5",0.8)
            }else{
              MNButton.setColor(addonController.engineButton, "#9bb2d6",0.8)
            }
            addonController.selectedText = ""
            if (self.newWindowController) {
              if (self.newWindowController.desktop) {
                MNButton.setColor(self.newWindowController.engineButton, "#b5b5f5",0.8)
              }else{
                MNButton.setColor(self.newWindowController.engineButton, "#9bb2d6",0.8)
              }
            }
            self.viewTimer.invalidate()
          });
          return
        }
        //watch mode

        // var text = sender.userInfo.documentController.selectionText;
        if (self.textSelected && self.textSelected.length) {
          self.addonController.search(self.textSelected);
          if (browserConfig.dynamic) {
            // MNUtil.animate(()=>{
            //   self.layoutAddonController(sender.userInfo.winRect, sender.userInfo.arrow);
            // })
            let popupFrame = MNUtil.parseWinRect(sender.userInfo.winRect)
            let targetFrame = browserUtils.getTargetFrame(popupFrame, sender.userInfo.arrow)
            self.addonController.animateTo(targetFrame)
            self.addonController.view.hidden = false;
            if (self.addonController.miniMode) {
              self.addonController.moveButton.setImageForState(undefined,0)
              self.addonController.view.backgroundColor = MNUtil.hexColorAlpha("#9bb2d6",0.0)
              self.addonController.miniMode = false
              self.addonController.showAllButton()
              self.addonController.webview.hidden = false;
              self.addonController.webview.layer.borderWidth = 0
              self.addonController.view.layer.borderWidth = 0
            }
            return
          }
          if (self.addonController.miniMode) {
            let preFrame = self.addonController.view.frame
            self.addonController.view.hidden = true
            self.addonController.showAllButton()
            let studyFrame = MNUtil.studyView.bounds
            let lastFrame = self.addonController.lastFrame
            lastFrame.x = MNUtil.constrain(lastFrame.x, 0, studyFrame.width-lastFrame.width)
            self.addonController.setFrame(lastFrame)
            MNUtil.studyView.bringSubviewToFront(self.addonBar)
            self.addonController.show(preFrame)
          }
          self.addonController.view.hidden = false;
        }
      },
      onPopupMenuOnNote: function (sender) { // Clicking note
        if (typeof MNUtil === 'undefined') {
          return
        }
        if (!self.appInstance.checkNotifySenderInWindow(sender, self.window)) return; // Don't process message from other window
        try {
        if (browserConfig.getConfig("autoOpenVideoExcerpt")) {
          let focusNote = MNNote.new(sender.userInfo.note.noteId)
          let allText = focusNote.allText
          let result = browserUtils.extractBilibiliLinks(allText)
          if (result && result.length) {
            // MNUtil.copy(result)
            if (self.addonController.view.hidden) {
              self.addonController.show()
            }
            // if (arguments.length > 2) {
            //   let p = arguments[2].match(/(?<=p\=).*/)[0]
            //   self.addonController.openOrJump(id,time,parseInt(p))
            // }else{
            //   self.addonController.openOrJump(id,time,0)
            // }
            if ("p" in result[0]) {
              self.addonController.openOrJump(result[0].videoId,result[0].t,result[0].p)
            }else{
              self.addonController.openOrJump(result[0].videoId,result[0].t,0)
            }
            MNUtil.studyView.bringSubviewToFront(self.addonController.view)
          }
        }
        let currentNoteId = sender.userInfo.note.noteId
        let note = sender.userInfo.note
        // UIPasteboard.generalPasteboard().string = note.notesText
        let text = self.getTextForSearch(note)
        // Application.sharedInstance().showHUD(text,self.window,2)

        self.textSelected = encodeURIComponent(text.replaceAll('/', '\\/'))
        // self.textSelected = encodeURIComponent(note.excerptText ?? note.noteTitle.replaceAll('/', '\\/'))

        self.addonController.selectedText = self.textSelected
        self.addonController.currentNoteId = currentNoteId
        if (self.addonController && !self.addonController.view.hidden) {
          self.addonController.blur(0.01)
        }
        if (self.newWindowController) {
          self.newWindowController.selectedText = self.textSelected
          if (!self.newWindowController.view.hidden) {
            self.newWindowController.blur(0.01)
          }
        }
        self.dateGetText = Date.now();
        self.textProcessed = false
        temSender = sender
        // Application.sharedInstance().showHUD(sender.userInfo.note,self.window,2)
        if (!self.addonController.view.window) return;

        if (self.viewTimer) self.viewTimer.invalidate();
        if (self.linkDetected) {

          let allNotes = self.getNoteList(note)
          self.linkDetected = allNotes.some(note=>/^https:\/\//.test(note.trim()))
          if (self.linkDetected) {
            self.linkTimer.invalidate();
          }else{
            MNUtil.refreshAddonCommands()
          }
        }else{
          let allNotes = self.getNoteList(note)
          self.linkDetected = allNotes.some(note=>/^https:\/\//.test(note.trim()))
          if (self.linkDetected) {
            self.link = allNotes.filter(note=>/^https:\/\//.test(note.trim()))[0].trim()
            MNUtil.refreshAddonCommands()
            self.linkTimer = NSTimer.scheduledTimerWithTimeInterval(2.5, false, function () {
              self.linkTimer.invalidate()
              self.linkDetected = false
              MNUtil.refreshAddonCommands()
            });
          }
        }
        if (!self.watchMode) {
          if (!self.addonController.view.hidden) {
            self.addonController.engineButton.backgroundColor = MNUtil.hexColorAlpha("#5483cd", 0.8)
          }
          if (self.newWindowController) {
            self.newWindowController.engineButton.backgroundColor = MNUtil.hexColorAlpha("#5483cd", 0.8)
          }
          self.viewTimer = NSTimer.scheduledTimerWithTimeInterval(5, false, function () {
            self.addonController.engineButton.backgroundColor = MNUtil.hexColorAlpha("#9bb2d6", 0.8)
            // self.addonController.webAppButton.backgroundColor = UIColor.colorWithHexString("#9bb2d6").colorWithAlphaComponent(0.8);
            self.addonController.selectedText = ""
            if (self.newWindowController) {
              self.newWindowController.engineButton.backgroundColor = MNUtil.hexColorAlpha("#9bb2d6", 0.8)
            }
            self.viewTimer.invalidate()
          });
          return
        }
        if (self.textSelected && self.textSelected.length) {
          self.addonController.search(self.textSelected);
          if (browserConfig.dynamic) {
            let popupFrame = MNUtil.parseWinRect(sender.userInfo.winRect)
            let targetFrame = browserUtils.getTargetFrame(popupFrame, sender.userInfo.arrow)
            self.addonController.animateTo(targetFrame)
            // MNUtil.copyJSON(targetFrame)
            // browserUtils.animateToFrame(self.addonController.view, targetFrame)
            // MNUtil.animate(()=>{
            //   self.addonController.view.frame = targetFrame
            //   self.addonController.currentFrame = targetFrame
            // })
            self.addonController.view.hidden = false;
            if (self.addonController.miniMode) {
              self.addonController.view.backgroundColor = MNUtil.hexColorAlpha("#9bb2d6",0.0)
              self.addonController.moveButton.setImageForState(undefined,0)
              self.addonController.miniMode = false
              self.addonController.showAllButton()
              self.addonController.webview.hidden = false;
              self.addonController.webview.layer.borderWidth = 0
              self.addonController.view.layer.borderWidth = 0
            }
            return
          }
          if (self.addonController.miniMode) {
            let preFrame = self.addonController.view.frame
            self.addonController.view.hidden = true
            let studyFrame = MNUtil.studyView.bounds
            let lastFrame = self.addonController.lastFrame
            lastFrame.x = MNUtil.constrain(lastFrame.x, 0, studyFrame.width-lastFrame.width)
            self.addonController.setFrame(lastFrame)
            MNUtil.studyView.bringSubviewToFront(self.addonBar)
            self.addonController.show(preFrame)
          }

          self.addonController.view.hidden = false;
        }
        } catch (error) {
            browserUtils.addErrorLog(error, "onPopupMenuOnNote")
        }
        // self.addonController.view.frame = {x:0,y:0,width:100,height:100}
      },
      onCloseView: function (params) {
        if (typeof MNUtil === 'undefined') {
          return
        }
        // Application.sharedInstance().showHUD("trst",self.window,2)
        if (self.window !== MNUtil.currentWindow) return; // Don't process message from other window
        self.watchMode = false;
        MNUtil.refreshAddonCommands()
        // self.homePage()
        // self.addonController.blur()
      },
      onNewWindow: function (sender) {
        if (typeof MNUtil === 'undefined') {
          return
        }
        if (self.window !== MNUtil.currentWindow) {
          MNUtil.showHUD("reject")
          return
        }
        if (!self.newWindowController) {
          self.newWindowController = browserController.new();
          self.newWindowController.addonBar = self.addonController.addonBar
          self.newWindowController.view.hidden = true
          MNUtil.studyView.addSubview(self.newWindowController.view);
          self.newWindowController.setFrame(50,100,417,450)
        }
        if (!MNUtil.isDescendantOfStudyView(self.newWindowController.view)) {
          MNUtil.studyView.addSubview(self.newWindowController.view)
        }
        if (self.newWindowController.view.hidden) {
          self.newWindowController.show(self.newWindowController.addonBar.frame)
        }
        try {
        self.newWindowController.setWebMode(sender.userInfo.desktop)
        let toolbar = browserConfig.toolbar
        self.newWindowController.buttonScrollview.hidden = !toolbar
        var viewFrame = self.newWindowController.view.bounds;
        if (browserConfig.toolbar) {
          self.newWindowController.webview.frame = { x: viewFrame.x + 1, y: viewFrame.y + 10, width: viewFrame.width - 2, height: viewFrame.height - 40 }
        } else {
          self.newWindowController.webview.frame = { x: viewFrame.x + 1, y: viewFrame.y + 10, width: viewFrame.width - 2, height: viewFrame.height }
        }
        self.newWindowController.isMainWindow = false
        self.newWindowController.webview.hidden = false;
        if (sender.userInfo.agent) {
          self.newWindowController.webview.customUserAgent = sender.userInfo.agent
        }
        // Application.sharedInstance().showHUD(userInfo.url, self.window, 5);
        MNConnection.loadRequest(self.newWindowController.webview, sender.userInfo.url)
        // self.newWindowController.webview.loadRequest(MNUtil.requestWithURL(sender.userInfo.url));
        } catch (error) {
          browserUtils.addErrorLog(error, "onNewWindow")
        }
      },
      onPasteboardChange: function () {
        if (typeof MNUtil === 'undefined') {
          return
        }
        MNUtil.showHUD("check:")

      },
      onAddonBroadcast: function (sender) {
        if (self.window!==MNUtil.currentWindow) {
          return
        }
        try {
          
        let message = sender.userInfo.message
        if (/BilibiliExcerpt\?/.test(message)) {
          let arguments = message.match(/(?<=BilibiliExcerpt\?).*/)[0].split("&")
          let id = arguments[0].match(/(?<=videoId\=)\w+/)[0]
          let time = arguments[1].match(/(?<=t\=).*/)[0]
          if (self.addonController.view.hidden) {
            // MNUtil.showHUD("message")
            self.addonController.show()
          }
          if (arguments.length > 2) {
            let p = arguments[2].match(/(?<=p\=).*/)[0]
            self.addonController.openOrJump(id,time,parseInt(p))
          }else{
            self.addonController.openOrJump(id,time,0)
          }
          MNUtil.studyView.bringSubviewToFront(self.addonController.view)
        }
        if (/YoutubeExcerpt\?/.test(message)) {
          let arguments = message.match(/(?<=YoutubeExcerpt\?).*/)[0].split("&")
          let id = arguments[0].match(/(?<=videoId\=)\w+/)[0]
          let time = arguments[1].match(/(?<=t\=).*/)[0]
          if (self.addonController.view.hidden) {
            // MNUtil.showHUD("message")
            self.addonController.show()
          }
          self.addonController.openOrJumpForYT(id,time)
          MNUtil.studyView.bringSubviewToFront(self.addonController.view)
        }
        } catch (error) {
          browserUtils.addErrorLog(error, "onAddonBroadcast")
        }
      },
      receivedSearchInBrowser: function (sender) {
        if (typeof MNUtil === 'undefined') {
          return
        }
        // Application.sharedInstance().showHUD("check:",self.appInstance.focusWindow,2)
        if (self.window!==self.appInstance.focusWindow) {
          return
        }
        let info = sender.userInfo
        // MNUtil.copyJSON(sender.userInfo)
        if (info.noteid) {
          let note = MNUtil.getNoteById(info.noteid)
          let text = encodeURIComponent(self.getTextForSearch(note))
          self.addonController.selectedText = text
          if ("engine" in info) {
            let engine = Object.keys(browserConfig.entries).find(key=>browserConfig.entries[key].engine===info.engine)
            self.addonController.search(text,engine)
          }else{
            self.addonController.search(text)
          }
        }else if(info.text){
          self.textSelected = encodeURIComponent(info.text.replaceAll('/', '\\/'));
          self.addonController.selectedText = self.textSelected
          if ("engine" in info) {
            let engine = Object.keys(browserConfig.entries).find(key=>browserConfig.entries[key].engine===info.engine)
            self.addonController.search(self.textSelected,info.engine)
          }else{
            self.addonController.search(self.textSelected)
          }
        }

        if (!self.addonController.view.hidden) {
          if (browserConfig.dynamic) {
            self.addonController.show(self.addonController.view.frame,info.endFrame)
          }
          return
        }
        if (info.beginFrame && info.endFrame) {
          self.addonController.show(info.beginFrame,info.endFrame)
          MNUtil.studyView.bringSubviewToFront(self.addonController.view)
          return
        }
        self.addonController.show()
        MNUtil.studyView.bringSubviewToFront(self.addonController.view)
      },
      receivedOpenInBrowser: function (sender) {
        if (typeof MNUtil === 'undefined') {
          return
        }
        if (self.window!==self.appInstance.focusWindow) {
          return
        }
        // MNUtil.showHUD("receivedOpenInBrowser")
        MNConnection.loadRequest(self.addonController.webview, sender.userInfo.url)
        // self.addonController.webview.loadRequest(
        //     NSURLRequest.requestWithURL(NSURL.URLWithString(sender.userInfo.url))
        //   );
        if (!self.addonController.view.hidden) {
          return
        }
        if (sender.userInfo.beginFrame && sender.userInfo.endFrame) {
          self.addonController.show(sender.userInfo.beginFrame,sender.userInfo.endFrame)
          return
        }
        self.addonController.show()
      },
      onSetVideo: function (sender) {
        if (typeof MNUtil === 'undefined') {
          return
        }
        if (self.window!==self.appInstance.focusWindow) {
          return
        }
        // MNUtil.copyJSON(sender.userInfo)
        self.addonController.runJavaScript(`document.getElementsByTagName('video')[0].currentTime = `+sender.userInfo.time)
      },
      toggleAddon: async function (sender) {
        // MNUtil.mindmapView.hidden = true
        // MNUtil.mindmapView.superview.subviews.at(-4).hidden = true

        // let tem = MNUtil.mindmapView.superview.subviews.at(-1)
        // MNUtil.showHUD("message"+tem.subviews.length)
        // MNUtil.openURL("file://"+browserUtils.mainPath+"/test.pdf")
        if (typeof MNUtil === 'undefined') {
          return
        }
        try {

          
        self.ensureView()
        if (!self.addonBar) {
          self.addonBar = sender.superview.superview
          self.addonController.addonBar = self.addonBar
        }
        if (self.checkWatchMode()) { return }
        if (self.addonController.currentNoteId) {
          let note = MNNote.new(self.addonController.currentNoteId)
          if (note) {
            let config = await browserUtils.parseNoteInfo(note)
            MNUtil.copy(config)
          }
        }

        if (self.addonController.view.hidden) {
          if (self.isFirst) {
            // Application.sharedInstance().showHUD("first",self.window,2)
            let buttonFrame = self.addonBar.frame
            let width = MNUtil.app.osType !== 1 ? 419 : 365
            if (buttonFrame.x === 0) {
              self.addonController.setFrame(40,buttonFrame.y,width,450)
            }else{
              self.addonController.setFrame(buttonFrame.x-width,buttonFrame.y,width,450)
            }
            self.isFirst = false;
          }
        // MNUtil.showHUD("message"+browserConfig.toolbar)
          MNUtil.studyView.bringSubviewToFront(self.addonBar)
          self.addonController.show(self.addonBar.frame)
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
              self.addonController.show(preFrame)
            }else{
              self.addonController.hide(self.addonBar.frame)
            }
            self.watchMode = false;
            MNUtil.refreshAddonCommands()
            return;
          }
        }
        MNUtil.delay(0.2).then(()=>{
          MNUtil.studyView.becomeFirstResponder()
        })
        if (!self.addonController.view.window) return;
        if (self.viewTimer) self.viewTimer.invalidate();

        // Application.sharedInstance().showHUD("process:1",self.window,2)
        var text = self.textSelected;
        //五秒内点击了logo
        if (text && text.length  && (Date.now() - self.dateGetText < 5000)) {
        // Application.sharedInstance().showHUD("process:2",self.window,2)

          // self.addonController.view.frame = {x:0,y:0,width:100,height:100}
          self.addonController.search(text);
          // self.addonController.homePage(text);
          if (browserConfig.dynamic && temSender) {
            let popupFrame = MNUtil.parseWinRect(temSender.userInfo.winRect)
            let targetFrame = browserUtils.getTargetFrame(popupFrame, temSender.userInfo.arrow)
            self.addonController.animateTo(targetFrame)
            // self.layoutAddonController(temSender.userInfo.winRect, temSender.userInfo.arrow);
          }
          // self.addonController.view.hidden = false;
          self.addonController.miniMode = false
          // self.addonController.searchButton.hidden = false

          if (browserConfig.dynamic) {
            browserConfig.toolbar = false
            self.addonController.custom = false;
            self.addonController.customMode = "None"
            self.addonController.buttonScrollview.hidden = true
            // self.addonController.webAppEntriesButton.hidden = true
            // MNUtil.showHUD("message0")
            var viewFrame = self.addonController.view.bounds;
            // MNUtil.animate(()=>{
              self.addonController.webview.frame = {x:viewFrame.x+1,y:viewFrame.y+10,width:viewFrame.width-2,height:viewFrame.height}
            // })
          }
          self.textProcessed = true
        } else {
        // Application.sharedInstance().showHUD("process:3",self.window,2)

          self.textProcessed = true
          // self.addonController.homePage(text);
          if (browserConfig.dynamic && temSender) {
        // Application.sharedInstance().showHUD("process:3",self.window,2)
            self.layoutAddonController(temSender.userInfo.winRect, temSender.userInfo.arrow);
          }
        }
  
} catch (error) {
    browserUtils.addErrorLog(error, "toggleAddon")
}
      },
    },
    { /* Class members */
      addonDidConnect: function () {
      },

      addonWillDisconnect: async function () {
        let confirm = await MNUtil.confirm("MN Browser: Remove all config?\n删除所有配置？", "")
        if (!confirm) {
          return
        }
        browserConfig.entries = browserConfig.defaultEntries
        browserConfig.entrieNames = Object.keys(browserConfig.entries)
        browserConfig.engine = browserConfig.entrieNames[0]
        browserConfig.webAppEntries = browserConfig.defaultWebAppEntries
        browserConfig.webAppEntrieNames = Object.keys(browserConfig.webAppEntries)
        browserConfig.toolbar = true
        browserConfig.engine = "Bing"
        browserConfig.dynamic = false
        browserConfig.remove("MNBrowser_entrieNames")
        browserConfig.remove("MNBrowser_entries")
        browserConfig.remove('MNBrowser_engine');
        browserConfig.remove("MNBrowser_webAppEntrieNames")
        browserConfig.remove("MNBrowser_webAppEntries")
        browserConfig.remove('MNBrowser_webApp');
        browserConfig.remove('MNBrowser_toolbar');
        browserConfig.remove('MNBrowser_onNewExcerpt');
        browserConfig.remove('MNBrowser_dynamic');
      },

      applicationWillEnterForeground: function () {
        // MNUtil.copy("applicationWillEnterForeground")

      },

      applicationDidEnterBackground: function () {
        // MNUtil.copy("applicationDidEnterBackground")
      },

      applicationDidReceiveLocalNotification: function (notify) {
      }
    }
  );

  MNBrowserClass.prototype.layoutAddonController = function (rectStr, arrowNum) {
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
    MNUtil.animate(()=>{
      this.addonController.setFrame(x,y,w,h)
    })
  };
  MNBrowserClass.prototype.checkWatchMode = function () {
    if (Date.now() - this.dateNow < 500) {
      this.watchMode = true;
      MNUtil.showHUD("Watch mode")
      MNUtil.refreshAddonCommands()
      this.addonController.webview.hidden = false
      this.addonController.view.hidden = false
      this.addonController.showAllButton()

      // if (this.addonController.view.hidden) {
      //   this.addonController.show(this.addonBar.frame)
      // }
      return true;
    }else{
      this.dateNow = Date.now()
      return false
    }
  };
  MNBrowserClass.prototype.checkLink = function () {
     if (this.linkDetected) {
      MNConnection.loadRequest(this.addonController.webview, this.link)
      if (this.addonController.view.hidden) {
        this.addonController.show(this.addonBar.frame)
      }
      return true
    }
    return false
  }
  MNBrowserClass.prototype.getNoteList = function (note) {
    let noteList = []
    if (note.noteTitle) {
      noteList.push(note.noteTitle)
    }
    if (note.excerptText && !note.excerptPic) {
      noteList.push(note.excerptText)
    }
    return noteList.concat(note.comments.filter(comment=>comment.type==="TextNote").map(comment=>comment.text))
  };
  MNBrowserClass.prototype.getTextForSearch = function (note) {
    let order = browserConfig.searchOrder
    if (!order) {
      order = [2,1,3]
    }
    let text
    for (let index = 0; index < order.length; index++) {
      const element = order[index];
      switch (element) {
        case 1:
          if (note.noteTitle && note.noteTitle !== "") {
            text = note.noteTitle
          }
          break;
        case 2:
          if (note.excerptText && note.excerptText !== "" && (!note.excerptPic || note.textFirst)) {
            text = note.excerptText
          }
          break;
        case 3:
          let noteText  = note.comments.filter(comment=>comment.type === "TextNote" && !/^marginnote3app:\/\//.test(comment.text))
          if (noteText.length) {
            text =  noteText[0].text
          }
          break;
        default:
          break;
      }
      if (text) {
        return text
      }
    }
  return ""
  }
  MNBrowserClass.prototype.init = function(mainPath){ 
  try {
    if (!this.initialized) {
      browserUtils.init(mainPath)
      browserConfig.init()
      this.initialized = true
    }
    if (!this.addonController) {
      this.addonController = browserController.new();
    }
  } catch (error) {
    browserUtils.addErrorLog(error, "init")
  }
  }
  /**
   * 
   * @param {string} selector 
   * @param {string} name 
   * @this {MNBrowserClass}
   * @returns 
   */
  MNBrowserClass.prototype.addObserver = function (selector,name) {
    NSNotificationCenter.defaultCenter().addObserverSelectorName(this, selector, name);
  }
  /**
   * 
   * @param {string[]} names
   * @this {MNBrowserClass}
   * @returns 
   */
  MNBrowserClass.prototype.removeObservers = function (names) {
    names.forEach(name=>{
      NSNotificationCenter.defaultCenter().removeObserverName(self, name);
    })
  }
  /**
   * 
   * @param {boolean} refresh 
   * @this {MNBrowserClass}
   * @returns 
   */
  MNBrowserClass.prototype.ensureView = function (refresh = true) {
  try {
    if (!MNUtil.isDescendantOfStudyView(this.addonController.view)) {
      MNUtil.studyView.addSubview(this.addonController.view)
      this.addonController.view.hidden = true
      if (refresh) {
        MNUtil.refreshAddonCommands()
      }
      if (!this.addonController.inHomePage) {
        this.addonController.homePage()
      }
    }
      } catch (error) {
    browserUtils.showHUD(error,5)
  }
  }
  MNBrowserClass.prototype.checkUpdate = async function () {
    // browserUtils.addErrorLog("not implemented", "checkUpdate")
    let success = await browserConfig.readCloudConfig(false)
    if (success) {
      self.addonController.refreshLastSyncTime()
    }
  }
  return MNBrowserClass;
};

