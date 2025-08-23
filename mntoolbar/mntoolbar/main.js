if (typeof MNOnAlert === 'undefined') {
  var MNOnAlert = false
}
JSB.newAddon = function (mainPath) {
  JSB.require('utils')
  JSB.require('xdyy_utils_extensions')  // 加载工具函数扩展
  JSB.require('pinyin')
  if (!toolbarUtils.checkMNUtilsFolder(mainPath)) {return undefined}
  JSB.require('webviewController');
  JSB.require('settingController');
  
  // 加载自定义菜单注册表（必须在 utils 之后）
  try {
    JSB.require('xdyy_menu_registry')
  } catch (error) {
    // 加载错误不应该影响插件主功能
    if (typeof MNUtil !== 'undefined' && MNUtil.addErrorLog) {
      MNUtil.addErrorLog(error, "加载自定义菜单模板")
    }
  }
  // 加载按钮注册表（必须在 utils 之后）
  try {
    JSB.require('xdyy_button_registry')
  } catch (error) {
    // 加载错误不应该影响插件主功能
    if (typeof MNUtil !== 'undefined' && MNUtil.addErrorLog) {
      MNUtil.addErrorLog(error, "加载按钮注册表")
    }
  }
  // JSB.require('UIPencilInteraction');
  
  // 加载自定义 actions 扩展（必须在 webviewController 之后）
  try {
    // 使用注册表方式，真正实现解耦
    JSB.require('xdyy_custom_actions_registry')
  } catch (error) {
    // 加载错误不应该影响插件主功能
    if (typeof MNUtil !== 'undefined' && MNUtil.addErrorLog) {
      MNUtil.addErrorLog(error, "加载自定义 Actions")
    }
  }
  /** @return {MNToolbarClass} */
  // const getMNToolbarClass = ()=>self  
  var MNToolbarClass = JSB.defineClass(
    'MNToolbar : JSExtension',
    { /* Instance members */
      sceneWillConnect: async function () { //Window initialize
        if (!(await toolbarUtils.checkMNUtil(true))) return
        // let self = getMNToolbarClass()//可能要删除这个
        self.init(mainPath)

        self.isNewWindow = false;
        self.watchMode = false;
        self.textSelected = ""
        self.textProcessed = false;
        self.dateGetText = Date.now();
        self.dateNow = Date.now();
        self.rect = '{{0, 0}, {10, 10}}';
        self.arrow = 1;
        MNUtil.addObserver(self, 'onPopupMenuOnNote:', 'PopupMenuOnNote')
        MNUtil.addObserver(self, 'onPopupMenuOnSelection:', 'PopupMenuOnSelection')
        MNUtil.addObserver(self, 'onClosePopupMenuOnSelection:', 'ClosePopupMenuOnSelection')
        // MNUtil.addObserver(self, 'onProcessNewExcerpt:', 'ProcessNewExcerpt')
        MNUtil.addObserver(self, 'onToggleDynamic:', 'toggleDynamic')
        MNUtil.addObserver(self, 'onClosePopupMenuOnNote:', 'ClosePopupMenuOnNote')
        MNUtil.addObserver(self, 'onRefreshView:', 'refreshView')
        MNUtil.addObserver(self, 'onToggleMindmapToolbar:', 'toggleMindmapToolbar')
        MNUtil.addObserver(self, 'onRefreshToolbarButton:', 'refreshToolbarButton')
        MNUtil.addObserver(self, 'onOpenToolbarSetting:', 'openToolbarSetting')
        MNUtil.addObserver(self, 'onNewIconImage:', 'newIconImage')
        MNUtil.addObserver(self, 'onTextDidBeginEditing:', 'UITextViewTextDidBeginEditingNotification')
        MNUtil.addObserver(self, 'onTextDidEndEditing:', 'UITextViewTextDidEndEditingNotification')
        MNUtil.addObserver(self, 'onCloudConfigChange:', 'NSUbiquitousKeyValueStoreDidChangeExternallyNotificationUI')
        MNUtil.addObserver(self, 'onAddonBroadcast:', 'AddonBroadcast');
        
        // 夏大鱼羊 - begin: 延迟刷新按钮配置，确保自定义扩展完全加载
        setTimeout(function() {
          if (typeof global !== 'undefined' && global.forceRefreshButtons) {
            if (typeof MNUtil !== 'undefined' && MNUtil.log) {
              MNUtil.log("🔄 延迟刷新按钮配置，确保自定义按钮生效");
            }
            global.forceRefreshButtons();
          }
        }, 1000);
        // 夏大鱼羊 - end
      },

      sceneDidDisconnect: function () { // Window disconnect 在插件页面关闭插件（不是删除）
        if (typeof MNUtil === 'undefined') return
        // MNUtil.removeObserver(self, 'ProcessNewExcerpt')
        MNUtil.removeObserver(self,'PopupMenuOnNote')
        MNUtil.removeObserver(self,'toggleDynamic')
        MNUtil.removeObserver(self,'ClosePopupMenuOnNote')
        // MNUtil.removeObserver(self,'removeMNToolbar')
        MNUtil.removeObserver(self,'UITextViewTextDidBeginEditingNotification')
        MNUtil.removeObserver(self,'UITextViewTextDidEndEditingNotification')
        MNUtil.removeObserver(self,'refreshToolbarButton')
        MNUtil.removeObserver(self,'openToolbarSetting')
        MNUtil.removeObserver(self,'NSUbiquitousKeyValueStoreDidChangeExternallyNotificationUI')
        MNUtil.removeObserver(self,'ClosePopupMenuOnSelection')
        MNUtil.removeObserver(self,'AddonBroadcast');
        NSUserDefaults.standardUserDefaults().synchronize()

      },

      sceneWillResignActive: function () { // Window resign active
        NSUserDefaults.standardUserDefaults().synchronize()
      },

      sceneDidBecomeActive: function () { // Window become active
      },

      notebookWillOpen: async function (notebookid) {
        if (!(await toolbarUtils.checkMNUtil(true,0.1))) return
        if (MNUtil.studyMode < 3) {
          // let self = getMNToolbarClass()
          self.init(mainPath)
          await MNUtil.delay(0.5)
          self.ensureView(true)
          MNUtil.refreshAddonCommands();
          self.addonController.dynamic = toolbarConfig.dynamic
          self.addonController.notebookid = notebookid
          self.notebookid = notebookid
          toolbarUtils.notebookId = notebookid
          toolbarConfig.checkCloudStore()
        }
        MNUtil.delay(0.2).then(()=>{
          self.studyView.becomeFirstResponder(); //For dismiss keyboard on iOS
          // toolbarUtils.refreshColorImage()
          MNUtil.postNotification("refreshToolbarButton", {})
        })
          
      },

      notebookWillClose: function (notebookid) {
        if (typeof MNUtil === 'undefined') return
        self.lastFrame = self.addonController.view.frame
        if (self.testController) {
          self.testController.view.hidden = true
        }
        if (self.addonController.settingController) {
          self.addonController.settingController.hide()
        }
        toolbarConfig.windowState.open  = !self.addonController.view.hidden
        toolbarConfig.windowState.frame = self.addonController.view.frame
        toolbarConfig.save("MNToolbar_windowState")
        NSUserDefaults.standardUserDefaults().synchronize()
      },
      // /**
      //  * 
      //  * @param {{userInfo:{noteid:String}}} sender 
      //  * @returns 
      //  */
      // onProcessNewExcerpt:function (sender) {
      //   if (typeof MNUtil === 'undefined') return
      //   if (self.window !== MNUtil.currentWindow) return; // Don't process message from other window

      //   MNUtil.delay(1).then(()=>{
      //     toolbarUtils.previousNoteId = sender.userInfo.noteid
      //   })
      // },
      onPopupMenuOnSelection: async function (sender) { // Clicking note
        if (typeof MNUtil === 'undefined') return
        // let self = getMNToolbarClass()
        if (self.window !== MNUtil.currentWindow) {
          return
        }
        if (self.settingController) {
            MNUtil.delay(0.01).then(()=>{
              self.settingController.blur()
            })
        }
        self.ensureView() // 确保 addonController 已初始化
        self.addonController.popupReplace()

        if (!toolbarConfig.dynamic) {
          return
        }
        try {
          

        let lastFrame 
        if (!self.testController) {
          self.testController = toolbarController.new();
          self.testController.dynamicWindow = true
          self.testController.addonController = self.addonController
          self.testController.studyController = self.studyController
          self.testController.studyView = self.studyView
          self.testController.mainPath = mainPath;
          self.testController.dynamic = toolbarConfig.dynamic
          self.testController.view.hidden = true

          // self.testController.action = self.addonController.action
          // showHUD(self.testController.action)
          self.addonController.dynamicToolbar = self.testController
          self.studyController.view.addSubview(self.testController.view);
          lastFrame = self.addonController.view.frame
        }else{
          self.testController.refresh()
          lastFrame = self.testController.view.frame
        }
        if (toolbarConfig.vertical(true)){
          self.testController.view.hidden = true
          return
        }
        self.testController.onClick = false
        self.onPopupMenuOnNoteTime = Date.now()
        let yOffset = 0
        await MNUtil.delay(0.01)
        let menu = PopupMenu.currentMenu()
        let menuFrame = menu.frame
        switch (menu.arrowDirection) {
          case 0:
            yOffset = 45
            break;
          case 1:
            yOffset = -50
            break;
          case 2:
            yOffset = 45
            break;
          default:
            self.showHUD("Direction: "+menu.arrowDirection)
            break;
        }
        lastFrame.y = menuFrame.y-yOffset
        lastFrame.x = menuFrame.x
        lastFrame.height = 40
        let testController = self.testController
        // let delay = testController.view.hidden?0.5:0
        // await MNUtil.delay(delay)
        if (self.notShow && Date.now()-self.onClosePopupMenuOnNoteTime > 0 && Date.now()-self.onClosePopupMenuOnNoteTime < 500) {
          return
        }
        if (testController.view.hidden) {
          self.studyView.bringSubviewToFront(testController.view)
          testController.refresh(lastFrame)
          testController.view.layer.opacity = 0
          testController.view.hidden = false
          testController.screenButton.hidden = false
          await MNUtil.animate(()=>{
            testController.view.layer.opacity = 1.0
          })
          // testController.moveButton.hidden = false
          testController.setToolbarLayout()
        }else{
          self.onAnimate = true
          self.studyView.bringSubviewToFront(testController.view)
          MNUtil.animate(()=>{
            testController.refresh(lastFrame)
            testController.view.hidden = false
            // testController.moveButton.hidden = false
            testController.screenButton.hidden = false
          }).then(()=>{
            testController.view.hidden = false
            self.onAnimate = false
          })
        }
        } catch (error) {
          toolbarUtils.addErrorLog(error, "onPopupMenuOnSelection")
        }
      },
      onClosePopupMenuOnSelection: async function (sender) {
        if (typeof MNUtil === 'undefined') return
        // await MNUtil.delay(0.1)
        try {
          

        self.onClosePopupMenuOnNoteTime = Date.now()
        if (self.noteid === sender.userInfo.noteid && Date.now()-self.onPopupMenuOnNoteTime < 500) {
          // showHUD("not show")
          self.notShow = true
        }
        if (self.onClosePopupMenuOnNoteTime>self.onPopupMenuOnNoteTime+250 && !self.testController.onClick) {
          let preOpacity = self.testController.view.layer.opacity
          if (self.onAnimate) {
            return
          }
          MNUtil.animate(()=>{
            self.testController.view.layer.opacity = 0
          },0.1).then(()=>{
            self.testController.view.layer.opacity = preOpacity
            self.testController.view.hidden = true
          })
          return
        }
        } catch (error) {
          toolbarUtils.addErrorLog(error, "onClosePopupMenuOnSelection")
        }
      },
      onPopupMenuOnNote: async function (sender) { // Clicking note
        if (typeof MNUtil === 'undefined') return
        // let self = getMNToolbarClass()
        if (self.window !== MNUtil.currentWindow) {
          return
        }
        try {
          self.ensureView() // 确保 addonController 已初始化
          self.addonController.popupReplace()
          if (self.settingController) {
            MNUtil.delay(0.01).then(()=>{
              self.settingController.blur()
            })
          }

        if (!toolbarConfig.dynamic) {
          return
        }
        self.onPopupMenuOnNoteTime = Date.now()
        let lastFrame 
       if (!self.testController) {
          self.testController = toolbarController.new();
          self.testController.addonController = self.addonController
          self.testController.studyController = self.studyController
          self.testController.studyView = self.studyView
          self.testController.dynamicWindow = true
          self.testController.mainPath = mainPath;
          self.testController.dynamic = toolbarConfig.dynamic
          self.testController.view.hidden = true
          // self.testController.action = self.addonController.action
          // showHUD(self.testController.action)
          self.addonController.dynamicToolbar = self.testController
          self.studyController.view.addSubview(self.testController.view);
          lastFrame = self.addonController.view.frame
        }else{
          lastFrame = self.testController.view.frame
        }
        // if (!self.appInstance.checkNotifySenderInWindow(sender, self.window) || !toolbarConfig.dynamic) return; // Don't process message from other window
        self.noteid = sender.userInfo.note.noteId
        toolbarUtils.currentNoteId = sender.userInfo.note.noteId
        self.notShow = false
        let winRect = MNUtil.parseWinRect(sender.userInfo.winRect)
        let docMapSplitMode = self.studyController.docMapSplitMode
        //仅当竖向工具栏时,才考虑文档下不显示的问题
        if (toolbarConfig.vertical(true) && winRect.height <=11 && winRect.width <=11) {
          switch (docMapSplitMode) {
            case 1:
              let splitLine = toolbarUtils.getSplitLine(self.studyController)
              if (self.studyController.rightMapMode) {
                if (winRect.x < splitLine) {
                  self.testController.view.hidden = true
                  return
                }
              }else{
                if (winRect.x > splitLine) {
                  self.testController.view.hidden = true
                  return
                }
              }
              break;
            case 2:
            self.testController.view.hidden = true
            return
            default:
              break;
          }
        }
        let studyFrame = self.studyView.frame
        let studyFrameX = studyFrame.x
        let studyHeight = studyFrame.height
        
        self.testController.onClick = false
        let testController = self.testController
        if (toolbarConfig.horizontal(true)) {
          let yOffset
          await MNUtil.delay(0.01)
          let menu = PopupMenu.currentMenu()
          if (!menu) {
            return
          }
          let menuFrame = menu.frame
          switch (menu.arrowDirection) {
            case 0:
              yOffset = 45
              break;
            case 1:
              yOffset = -80
              break;
            case 2:
              yOffset = 45
              break;
            default:
              break;
          }
          lastFrame.y = menuFrame.y-yOffset
          if (lastFrame.y < 0) {
            testController.view.hidden = true
            return
          }
          // MNUtil.log(lastFrame.y)
          lastFrame.x = menuFrame.x
          lastFrame.height = 40
        }else{
          if (winRect.x-43<0) {
            lastFrame.x = winRect.x+winRect.width-studyFrameX
          }else{
            lastFrame.x = winRect.x-43-studyFrameX
          }
          if (winRect.y-15<0) {
            lastFrame.y = 0
          }else{
            lastFrame.y = winRect.y-25
          }
          if (winRect.y+lastFrame.height>studyHeight) {
            lastFrame.y = studyHeight-lastFrame.height
          }
        }

        // let delay = testController.view.hidden?0.5:0
        // await MNUtil.delay(delay)
        if (self.notShow) {
          return
        }

        if (testController.view.hidden) {
          if (testController.onAnimate) {
            testController.notHide = true
          }
          self.onAnimate = true
          self.studyView.bringSubviewToFront(testController.view)
          testController.refresh(lastFrame)
          testController.view.layer.opacity = 0
          testController.view.hidden = false
          testController.screenButton.hidden = false
          await MNUtil.animate(()=>{
            testController.view.layer.opacity = 1.0
          })
          testController.view.hidden = false
          self.onAnimate = false
          // testController.moveButton.hidden = false
          testController.setToolbarLayout()
        }else{
          self.studyView.bringSubviewToFront(testController.view)
          MNUtil.animate(()=>{
            testController.refresh(lastFrame)
            testController.view.hidden = false
            // testController.moveButton.hidden = false
            testController.screenButton.hidden = false
          }).then(()=>{
            testController.view.hidden = false
          })
        }
        } catch (error) {
          toolbarUtils.addErrorLog(error, "onPopupMenuOnNote")
        }
      },
      onClosePopupMenuOnNote: async function (sender) {
        if (typeof MNUtil === 'undefined') return
        // if (!self.appInstance.checkNotifySenderInWindow(sender, self.window)) {
        //   return; // Don't process message from other window
        // }
        // await MNUtil.delay(0.1)
        self.onClosePopupMenuOnNoteTime = Date.now()
        if (self.noteid === sender.userInfo.noteid && Date.now()-self.onPopupMenuOnNoteTime < 500) {
          // showHUD("not show")
          self.notShow = true
        }
        if (self.onClosePopupMenuOnNoteTime>self.onPopupMenuOnNoteTime+250 && !self.testController.onClick) {
          let preOpacity = self.testController.view.layer.opacity
          if (self.onAnimate) {
            return
          }
          self.onAnimate = true
          MNUtil.animate(()=>{
            self.testController.view.layer.opacity = 0
          },0.1).then(()=>{
              self.testController.view.layer.opacity = preOpacity
              self.onAnimate = false
              self.testController.view.hidden = true
          })
          return
        }
      },
      onAddonBroadcast: async function (sender) {
      try {

        let message = "marginnote4app://addon/"+sender.userInfo.message
        let config = MNUtil.parseURL(message)
        let addon = config.pathComponents[0]
        if (addon === "mntoolbar") {
          if ("action" in config.params) {
            let actionKey = config.params.action
            let actionDes = toolbarConfig.getDescriptionById(actionKey)
            if (!("action" in actionDes)) {
              self.showHUD("Missing action")
              return
            }
            await toolbarUtils.customActionByDes(actionDes)
            while ("onFinish" in actionDes) {
              let delay = actionDes.delay ?? 0.5
              actionDes = actionDes.onFinish
              await MNUtil.delay(delay)
              await toolbarUtils.customActionByDes(actionDes)
            }
            return
          }
          if ("config" in config.params) {
            if (self.settingController && !self.settingController.view.hidden) {
              self.settingController.importFromShareURL(config.params.config)
              return
            }else{
              let confirm = await MNUtil.confirm("MN Toolbar", "Open Setting first\n\n请先打开设置并选中要替换的动作")
              if (confirm) {
                self.openSetting()
              }
            }
            // self.openSetting()
          }
          // MNUtil.copy(actionDes)
        }
        
      } catch (error) {
        toolbarUtils.addErrorLog(error, "onAddonBroadcast",sender.userInfo.message)
      }
      },
      documentDidOpen: function (docmd5) {
      },

      documentWillClose: function (docmd5) {
      },

      controllerWillLayoutSubviews: function (controller) {
        if (typeof MNUtil === 'undefined') return
        try {

        // if (controller !== self.studyController) {
        //   self.showHUD("return")
        //   return;
        // };
        // self.showHUD("controllerWillLayoutSubviews")
        self.checkToolbar()
        if (self.testController && !self.testController.view.hidden) {
          if (self.testController.onAnimate || self.testController.onResize) {
          }else{
            if ((self.onClosePopupMenuOnNoteTime>(self.onPopupMenuOnNoteTime+100) && Date.now()-self.onClosePopupMenuOnNoteTime>1000)) {
              let preOpacity = self.testController.view.layer.opacity
              MNUtil.animate(()=>{
                self.testController.view.layer.opacity = 0
              }).then(()=>{
                self.testController.view.layer.opacity = preOpacity
                self.testController.view.hidden = true
              })
            }
            if (!toolbarConfig.horizontal(true)) {
              let currentFrame = self.testController.currentFrame
              let buttonNumber = toolbarConfig.getWindowState("dynamicButton");
              currentFrame.height = toolbarUtils.checkHeight(currentFrame.height,buttonNumber)
              self.testController.view.frame = currentFrame
              self.testController.currentFrame = currentFrame
            }
          }
        }
        if (self.settingController && !self.settingController.onAnimate) {
          let currentFrame = self.settingController.currentFrame
          // currentFrame.height = toolbarUtils.checkHeight(currentFrame.height)
          self.settingController.view.frame = currentFrame
          self.settingController.currentFrame = currentFrame
        }
          
        } catch (error) {
          toolbarUtils.addErrorLog(error, "controllerWillLayoutSubviews")
        }
      },

      queryAddonCommandStatus: function () {
        if (typeof MNUtil === 'undefined') return null
          self.ensureView(false)
          if (self.addonController) {
            self.addonController.setToolbarButton()
          }
          if (self.settingController) {
              let iCloudSync = toolbarConfig.iCloudSync
              MNButton.setColor(self.settingController.iCloudButton, iCloudSync?"#457bd3":"#9bb2d6",0.8)
              MNButton.setTitle(self.settingController.iCloudButton, "iCloud Sync "+(iCloudSync? "✅":"❌"),undefined, true)
          }
          // toolbarUtils.refreshSubscriptionStatus()
          return {
            image: 'logo.png',
            object: self,
            selector: 'toggleAddon:',
            checked: toolbarConfig.dynamic
          };
      },
      onNewIconImage: function (sender) {
        if (typeof MNUtil === 'undefined') return
        if (self.window !== MNUtil.currentWindow) {
          return
        }
        if (sender.userInfo.imageBase64) {
          let imageData = NSData.dataWithContentsOfURL(MNUtil.genNSURL(sender.userInfo.imageBase64))
          let image = UIImage.imageWithData(imageData)
          let selected = self.settingController.selectedItem

          toolbarConfig.setButtonImage(selected, image,true)
        }
      },
      onOpenToolbarSetting:function (params) {
        if (typeof MNUtil === 'undefined') return
        if (self.window !== MNUtil.currentWindow) {
          return
        }
        self.openSetting()
      },
      onToggleDynamic:function (sender) {
        
        if (typeof MNUtil === 'undefined') return
        toolbarConfig.dynamic = !toolbarConfig.dynamic
        self.addonController.dynamic = toolbarConfig.dynamic
        if (toolbarConfig.dynamic) {
          self.showHUD("Dynamic ✅")
        }else{
          self.testController.view.hidden = true
        }
        toolbarConfig.save("MNToolbar_dynamic")
        // NSUserDefaults.standardUserDefaults().setObjectForKey(toolbarConfig.dynamic,"MNToolbar_dynamic")
        self.testController.dynamic = toolbarConfig.dynamic
      },
      onToggleMindmapToolbar:function (sender) {
        if ("target" in sender.userInfo) {
          switch (sender.userInfo.target) {
            case "addonBar":
              if (!self.addonBar) {
                self.addonBar = self.studyView.subviews.find(subview=>{
                  let frame = subview.frame
                  if (!subview.hidden && frame.y > 100 && frame.width === 40 && (frame.x < 100 || frame.x > self.studyView.bounds.width-150)) {
                    if (self.addonController.view && subview === self.addonController.view) {
                      return false
                    }
                    return true
                  }
                  return false
                
                })
                // self.addonBar = MNUtil.studyView.subviews[37]
              }
              // MNUtil.copyJSON(self.addonBar.frame)
              if (self.isAddonBarRemoved) {
                self.studyController.view.addSubview(self.addonBar)
                self.isAddonBarRemoved = false
              }else{
                self.addonBar.removeFromSuperview()
                self.isAddonBarRemoved = true
              }
              break;
            case "mindmapToolbar":
              if (!self.view0) {
                self.isRemoved = false
                self.view0 = MNUtil.mindmapView.superview.subviews.at(-4)
                self.view1 = MNUtil.mindmapView.superview.subviews.at(-6)
                self.view2 = MNUtil.mindmapView.superview.subviews.at(-1)
                // MNUtil.copy(self.view2.frame.width)
              }
              if (!self.isRemoved) {
                self.isRemoved = true
                // if (self.view2.subviews.length === 9) {
                  self.view0.removeFromSuperview()
                  self.view1.removeFromSuperview()
                  self.view2.removeFromSuperview()
                // }
                // let frame = self.view0.frame
                // frame
              }else{
                self.isRemoved = false
                MNUtil.mindmapView.superview.addSubview(self.view1)
                MNUtil.mindmapView.superview.addSubview(self.view0)
                MNUtil.mindmapView.superview.addSubview(self.view2)
              }
              break;
            default:
              break;
          }


        }

      },
      onRefreshView: function (sender) {
        // let self = getMNToolbarClass()
        if (typeof MNUtil === 'undefined') return 
        if (self.window !== MNUtil.currentWindow) {
          return
        } 
        self.settingController.refreshView("popupEditView")
        self.settingController.refreshView("advanceView")
      },
      onCloudConfigChange: async function (sender) {
        // let self = getMNToolbarClass()
        if (typeof MNUtil === 'undefined') return
        if (self.window !== MNUtil.currentWindow) {
          return
        }
        if (!toolbarConfig.iCloudSync) {
          return
        }
        self.ensureView()
        self.checkUpdate()
      },
      manualSync: async function (sender) {
        // let self = getMNToolbarClass()
        if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
        if (typeof MNUtil === 'undefined') return
        if (self.window !== MNUtil.currentWindow) {
          return
        }
        self.checkUpdate()
      },
      /**
       * 
       * @param {{object:UITextView}} param 
       */
      onTextDidBeginEditing:function (param) {
try {
        if (self.window !== MNUtil.currentWindow) {
          return
        }
        if (MNUtil.studyMode === 3) {
          return
        }
        if (self.testController && !self.testController.view.hidden) {
          let preOpacity = self.testController.view.layer.opacity
          MNUtil.animate(()=>{
            self.testController.view.layer.opacity = 0
          }).then(()=>{
            self.testController.view.layer.opacity = preOpacity
            self.testController.view.hidden = true
          })
          // UIView.animateWithDurationAnimationsCompletion(0.1,()=>{
          //   self.testController.view.layer.opacity = 0
          // },()=>{
          //   self.testController.view.layer.opacity = preOpacity
          //   self.testController.view.hidden = true
          // })
        }
        let textView = param.object
        toolbarUtils.textView = textView
        if (!toolbarConfig.showEditorOnNoteEdit) {
          return
        }
        let mindmapView = toolbarUtils.getMindmapview(textView)
        if (toolbarUtils.checkExtendView(textView)) {
          if (textView.text && textView.text.trim()) {
           //do nothing 
          }else{
            textView.text = "placeholder"
            textView.endEditing(true)
          }
          let focusNote = MNNote.getFocusNote()
          if (focusNote) {
            MNUtil.postNotification("openInEditor",{noteId:focusNote.noteId})
          }
          return
        }
        if (mindmapView) {
          let noteView = mindmapView.selViewLst[0].view
          // let focusNote = MNNote.getFocusNote()
          let focusNote = MNNote.new(mindmapView.selViewLst[0].note.note)
          let beginFrame = noteView.convertRectToView(noteView.bounds, self.studyView)
          if (!focusNote.noteTitle && !focusNote.excerptText && !focusNote.comments.length) {
            // MNUtil.copyJSON(param.object)
            param.object.text = "placeholder"
            // focusNote.noteTitle = "Title"
            // focusNote.excerptText = "Excerpt"
          }
          // MNUtil.beginTime = Date.now()
          // return
          if (focusNote) {
            let noteId = focusNote.noteId
            let studyFrame = self.studyView.bounds
            if (beginFrame.x+450 > studyFrame.width) {
              let endFrame = Frame.gen(studyFrame.width-450, beginFrame.y-10, 450, 500)
              if (beginFrame.y+490 > studyFrame.height) {
                endFrame.y = studyFrame.height-500
              }
              MNUtil.postNotification("openInEditor",{noteId:noteId,beginFrame:beginFrame,endFrame:endFrame})
            }else{
              let endFrame = Frame.gen(beginFrame.x, beginFrame.y-10, 450, 500)
              if (beginFrame.y+490 > studyFrame.height) {
                endFrame.y = studyFrame.height-500
              }
              MNUtil.postNotification("openInEditor",{noteId:noteId,beginFrame:beginFrame,endFrame:endFrame})
            }
          }
        }

} catch (error) {
  toolbarUtils.addErrorLog(error, "onTextDidBeginEditing")
}
      },
      /**
       * 
       * @param {{object:UITextView}} param 
       */
      onTextDidEndEditing: function (param) {
        if (self.window !== MNUtil.currentWindow) {
          return
        }
        if (MNUtil.studyMode === 3) {
          return
        }
        let textView = param.object
        if (textView === toolbarUtils.textView) {
          toolbarUtils.textView = undefined
        }
      },
      onRefreshToolbarButton: function (sender) {
        try {
        toolbarConfig.refreshColorImage()
        self.addonController.setToolbarButton()
        if (self.settingController) {
          self.settingController.setButtonText()
        }
        } catch (error) {
          toolbarUtils.addErrorLog(error, "onRefreshToolbarButton")
        }
      },
      openSetting:function () {
        // let self = getMNToolbarClass()
        self.checkPopoverController()
        self.openSetting()
      },
      toggleToolbar:function () {
        // let self = getMNToolbarClass()
        self.checkPopoverController()
        self.init(mainPath)
        self.ensureView(true)
        if (toolbarConfig.isFirst) {
          let buttonFrame = self.addonBar.frame
          // self.addonController.moveButton.hidden = true
          if (buttonFrame.x === 0) {
            Frame.set(self.addonController.view,40,buttonFrame.y,40,290)
          }else{
            Frame.set(self.addonController.view,buttonFrame.x-40,buttonFrame.y,40,290)
          }
          self.addonController.currentFrame = self.addonController.view.frame
          toolbarConfig.isFirst = false;
        }
        if (self.addonController.view.hidden) {
          toolbarConfig.windowState.open = true
          toolbarConfig.windowState.frame = self.addonController.view.frame
          // showHUD(JSON.stringify(self.addonBar.frame))
          self.addonController.show()
          toolbarConfig.save("MNToolbar_windowState")
        }else{
          toolbarConfig.windowState.open = false
          toolbarConfig.windowState.frame = self.addonController.view.frame
          self.addonController.hide()
          toolbarConfig.save("MNToolbar_windowState")
        }
      },
      toggleDynamic:function () {
        // let self = getMNToolbarClass()
        self.checkPopoverController()
        if (typeof MNUtil === 'undefined') return
        toolbarConfig.dynamic = !toolbarConfig.dynamic
        if (toolbarConfig.dynamic) {
          self.showHUD("Dynamic ✅")
        }else{
          self.showHUD("Dynamic ❌")
          if (self.testController) {
            self.testController.view.hidden = true
          }
          // self.testController.view.hidden = true
        }
        toolbarConfig.save("MNToolbar_dynamic")
        // NSUserDefaults.standardUserDefaults().setObjectForKey(toolbarConfig.dynamic,"MNToolbar_dynamic")
        if (self.testController) {
          self.testController.dynamic = toolbarConfig.dynamic
        }
        MNUtil.refreshAddonCommands()
      },
      // 夏大鱼羊增加：卡片的预处理
      togglePreprocess: function () {
        self.checkPopoverController()
        toolbarConfig.togglePreprocess()
      },
      // 夏大鱼羊结束

      // 夏大鱼羊增加：粗读模式
      toggleRoughReading: function () {
        self.checkPopoverController()
        toolbarConfig.toggleRoughReading()
      },
      // 夏大鱼羊结束

      openDocument:function (button) {
        if (typeof MNUtil === 'undefined') return
        // let self = getMNToolbarClass()
        self.checkPopoverController()
        MNUtil.postNotification("openInBrowser", {url:"https://mnaddon.craft.me/toolbar"})
      },
      toggleToolbarDirection: function (source) {
        // let self = getMNToolbarClass()
        self.checkPopoverController()
        toolbarConfig.toggleToolbarDirection(source)
      },
      refreshColor:function () {
        self.checkPopoverController()
        // toolbarUtils.refreshColorImage()
        MNUtil.postNotification("refreshToolbarButton", {})
      },
        // if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
      toggleAddon:async function (button) {
      try {
        if (typeof MNUtil === 'undefined') return
        // let imageData = MNUtil.getFile(toolbarUtils.mainPath+"/dot.png")
        // let beginTime = Date.now()
        // let newImageBase64 = toolbarUtils.changePngColor(imageData.base64Encoding(), "#FF5733")
        // let newImageData = MNUtil.dataFromBase64(newImageBase64,"png")
        // let endTime = Date.now()
        // MNUtil.log("changePngColor time:"+(endTime-beginTime))
        // // MNUtil.copy(newImageBase64)
        // MNUtil.copy(newImageData)
        // return
      // let options = {
      //     method: "GET",
      //     headers: {
      //       "Content-Type": "application/json",
      //       "Authorization": "NIS In6pkz+lFXoc3QVBSODM09hT5ZLir3gWqznXzhYdVyBabPvA23fO+A=="
      //     }}
      //   let res = await MNConnection.fetch("https://api.frdic.com/api/open/v1/studylist/category?language=en",options)
      //   MNUtil.copy(res)
      //   return
        // let self = getMNToolbarClass()
// let res = toolbarUtils.markdown2AST(markdown)
// // let res = marked.lexer(markdown)
// MNUtil.copy(res)
// let focusNote = MNNote.getFocusNote()
// MNUtil.undoGrouping(()=>{
//   toolbarUtils.AST2Mindmap(focusNote,res)
// })
// return
        if (!self.addonBar) {
          self.addonBar = button.superview.superview
          self.addonController.addonBar = self.addonBar
        }
        let selector = "toggleToolbarDirection:"
        var commandTable = [
            self.tableItem('⚙️   Setting', 'openSetting:'),
            self.tableItem('🛠️   Toolbar', 'toggleToolbar:',undefined,!self.addonController.view.hidden),
            self.tableItem('🛠️   Direction   '+(toolbarConfig.vertical()?'↕️':'↔️'), selector,"fixed"),
            self.tableItem('🌟   Dynamic   ', "toggleDynamic",undefined,toolbarConfig.dynamic),
            self.tableItem('🌟   Direction   '+(toolbarConfig.vertical(true)?'↕️':'↔️'), selector,"dynamic"),
            self.tableItem('🗂️   卡片预处理模式  ',"togglePreprocess", undefined, toolbarConfig.windowState.preprocess),
            self.tableItem('📖   粗读模式  ',"toggleRoughReading", undefined, toolbarConfig.windowState.roughReading),
            self.tableItem('📄   Document', 'openDocument:'),
            self.tableItem('🔄   Manual Sync','manualSync:'),
            self.tableItem('🎨   Refresh Color','refreshColor:')
        ];
        if (self.addonBar.frame.x < 100) {
          self.popoverController = MNUtil.getPopoverAndPresent(button,commandTable,200,4)
        }else{
          self.popoverController = MNUtil.getPopoverAndPresent(button,commandTable,200,0)
        }
      } catch (error) {
        toolbarUtils.addErrorLog(error, "toggleAddon")
      }
        return
        
      // self.addonController.view.hidden = !self.addonController.view.hidden
      }
    },
    { /* Class members */
      addonDidConnect: function () {
      },

      addonWillDisconnect: async function () {
        let confirm = await MNUtil.confirm("MN Toolbar: Remove all config?", "MN Toolbar: 删除所有配置？")
        if (confirm) {
          toolbarConfig.remove("MNToolbar_dynamic")
          toolbarConfig.remove("MNToolbar_windowState")
          toolbarConfig.remove("MNToolbar_action")
          toolbarConfig.remove("MNToolbar_actionConfig")
        }
        // MNUtil.postNotification("removeMNToolbar", {})
      },

      applicationWillEnterForeground: function () {
        if (typeof MNUtil === 'undefined') return
        MNUtil.postNotification("NSUbiquitousKeyValueStoreDidChangeExternallyNotificationUI", {})
        // toolbarUtils.addErrorLog("error", "applicationWillEnterForeground")
      },

      applicationDidEnterBackground: function () {
      },

      applicationDidReceiveLocalNotification: function (notify) {
      }
    }
  );
  MNToolbarClass.prototype.init = function(mainPath){ 
  try {

    if (!this.initialized) {
      toolbarUtils.init(mainPath)
      toolbarConfig.init(mainPath)
      this.appInstance = Application.sharedInstance();
      this.studyController = this.appInstance.studyController(this.window)
      this.studyView = this.studyController.view
      this.initialized = true
    }
  } catch (error) {
    toolbarUtils.addErrorLog(error, "init")
  }
  }
  MNToolbarClass.prototype.isDescendantOfWindow = function (view) {
    return view.isDescendantOfView(this.window)
  }
  MNToolbarClass.prototype.isDescendantOfStudyView = function (view) {
    return view.isDescendantOfView(this.studyController.view)
  }
  MNToolbarClass.prototype.ensureView = function (refresh = true) {
  try {
    if (!this.addonController) {
      this.addonController = toolbarController.new();
      this.addonController.studyController = this.studyController
      this.addonController.studyView = this.studyView
      this.addonController.view.hidden = true;
      this.studyController.view.addSubview(this.addonController.view);
    }
    // MNUtil.studyController
    if (this.isDescendantOfWindow(this.addonController.view) && !this.isDescendantOfStudyView(this.addonController.view)) {
      this.studyController.view.addSubview(this.addonController.view)
      this.addonController.view.hidden = true
      if (refresh) {
        MNUtil.refreshAddonCommands()
      }
    }
    let targetFrame
    if (this.lastFrame) {
      this.addonController.setFrame(this.lastFrame)
    }else{
      this.addonController.setFrame(MNUtil.genFrame(10, 10, 40, 200))
    }
    if (toolbarConfig.windowState.frame) {
      this.addonController.setFrame(toolbarConfig.windowState.frame)
      // this.addonController.view.hidden = !toolbarConfig.windowState.open;
      this.addonController.view.hidden = !toolbarConfig.getWindowState("open");
      toolbarConfig.isFirst = false
    }else{
      toolbarConfig.windowState={}
    }
      } catch (error) {
      toolbarUtils.addErrorLog(error, "ensureView")
  }
  }
  /**
   * 
   * @this {MNToolbarClass} 
   */
  MNToolbarClass.prototype.openSetting = function () {
    try {
    if (!this.settingController) {
      this.settingController = settingController.new();
      this.settingController.toolbarController = this.addonController
      this.settingController.mainPath = toolbarConfig.mainPath;
      this.settingController.action = toolbarConfig.action
      // this.settingController.dynamicToolbar = this.dynamicToolbar
      this.studyController.view.addSubview(this.settingController.view)
      // toolbarUtils.studyController().view.addSubview(this.settingController.view)
    }
    if (toolbarUtils.settingViewOpened) {
      MNUtil.showHUD("Setting view is already opened")
      return
    }
    this.settingController.show()
    } catch (error) {
      toolbarUtils.addErrorLog(error, "openSetting")
    }
}
  MNToolbarClass.prototype.checkUpdate = async function () {
    try {
      let shouldUpdate = await toolbarConfig.readCloudConfig(false)
      if (shouldUpdate) {
        let allActions = toolbarConfig.getAllActions()
        // MNUtil.copyJSON(allActions)
        if (this.settingController) {
          this.settingController.setButtonText(allActions,this.settingController.selectedItem)
        }
        // this.addonController.view.hidden = true
        if (this.addonController) {
          this.addonController.setFrame(toolbarConfig.getWindowState("frame"))
          this.addonController.setToolbarButton(allActions)
        }else{
          self.showHUD("No addonController")
        }
        MNUtil.postNotification("refreshView",{})
      }
    } catch (error) {
      toolbarUtils.addErrorLog(error, "checkUpdate")
    }
  }
  MNToolbarClass.prototype.checkPopoverController = function () {
    if (this.popoverController) {this.popoverController.dismissPopoverAnimated(true);}
  }
  MNToolbarClass.prototype.showHUD = function (message,duration = 2) {
    MNUtil.showHUD(message,duration,this.window)
  }
  MNToolbarClass.prototype.checkToolbar = function () {
    try {
      let toolbar = this.addonController
      if (!toolbar || toolbar.view.hidden) {
        return
      }
      if (toolbar.onAnimate || toolbar.onResize) {
        return
      }
          if (toolbarConfig.horizontal()) {
            let currentFrame = toolbar.currentFrame
            // let maxWidth = toolbarUtils.checkHeight(this.studyView.bounds.width-currentFrame.x-15,toolbar.maxButtonNumber)
            let studyFrame = this.studyView.bounds
            let width = 45*toolbar.buttonNumber+15
            // MNUtil.copy({currentFrame:currentFrame,width:width,studyFrame:this.studyView.bounds})
            if ((currentFrame.width+currentFrame.x) > (this.studyView.bounds.width)) {//工具栏超过边界,需要约束
              let maxWidth = toolbarUtils.checkHeight(this.studyView.bounds.width-currentFrame.x-15,toolbar.maxButtonNumber)
              // MNUtil.showHUD("message"+maxWidth)
              let buttonNumber = Math.floor((maxWidth)/45)
              width = 45*buttonNumber+15
              currentFrame.width = width
              toolbar.view.frame = currentFrame
              return
            }
            //检测是否需要恢复工具栏长度
            if (currentFrame.width < width) {
              width = Math.min(width,this.studyView.bounds.width-currentFrame.x-15)
              let maxWidth = toolbarUtils.checkHeight(width,toolbar.maxButtonNumber)
              // MNUtil.showHUD("message"+maxWidth)
              let buttonNumber = Math.floor((maxWidth)/45)
              width = 45*buttonNumber+15
              if (width > currentFrame.width) {
                currentFrame.width = width
                toolbar.view.frame = currentFrame
                return
              }
            }
            if (toolbar.sideMode) {
              switch (toolbar.sideMode) {
                case "top":
                  currentFrame.y = 0
                  break;
                case "bottom":
                  currentFrame.y = studyFrame.height-toolbarUtils.bottomOffset-40
                  break;
                default:
                  break;
              }
            }
            toolbar.view.frame = currentFrame
            // this.showHUD("currentFrameX:"+currentFrame.x)
            // toolbar.setFrame(currentFrame)
          } else {
            let splitLine = toolbarUtils.getSplitLine(this.studyController)
            let studyFrame = this.studyView.bounds
            let currentFrame = toolbar.currentFrame
            if (currentFrame.x+currentFrame.width*0.5 >= studyFrame.width) {
              currentFrame.x = studyFrame.width-currentFrame.width*0.5              
            }
            if (currentFrame.y >= studyFrame.height) {
              currentFrame.y = studyFrame.height-20              
            }
            if (toolbar.splitMode) {
              if (splitLine) {
                currentFrame.x = splitLine-20
              }else{
                if (currentFrame.x < studyFrame.width*0.5) {
                  currentFrame.x = 0
                }else{
                  currentFrame.x = studyFrame.width-40
                }
              }
            }
            if (toolbar.sideMode) {
              switch (toolbar.sideMode) {
                case "left":
                  currentFrame.x = 0
                  break;
                case "right":
                  currentFrame.x = studyFrame.width-40
                  break;
                default:
                  break;
              }
            }
            if (currentFrame.x > (studyFrame.width-40)) {
              currentFrame.x = studyFrame.width-40
            }
            toolbar.setFrame(MNUtil.genFrame(currentFrame.x, currentFrame.y, toolbarUtils.checkHeight(currentFrame.height,toolbar.maxButtonNumber),40),true)
            // toolbar.view.frame = currentFrame
            // toolbar.currentFrame = currentFrame
          }
      
    } catch (error) {
      toolbarUtils.addErrorLog(error, "checkToolbar")
    }
  }
/**
 * 
 * @param {string} title 
 * @param {string} selector 
 * @param {any} param 
 * @param {boolean|undefined} checked 
 * @this {MNToolbarClass}
 * @returns 
 */
MNToolbarClass.prototype.tableItem = function (title,selector,param = "",checked = false) {
  return {title:title,object:this,selector:selector,param:param,checked:checked}
}
  return MNToolbarClass;
};