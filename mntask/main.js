
JSB.newAddon = function (mainPath) {
  JSB.require('utils')
  JSB.require('xdyy_utils_extensions')  // 加载工具函数扩展
  JSB.require('pinyin')
  
  if (!taskUtils.checkMNUtilsFolder(mainPath)) {return undefined}
  JSB.require('webviewController');
  JSB.require('settingController'); // 文件名保持不变，只是类名改变了
  
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
  /** @return {MNTaskClass} */
  const getMNTaskClass = ()=>self
  
  // 全局访问点
  var MNTaskInstance = null;
  
  var MNTaskClass = JSB.defineClass(
    'MNTask : JSExtension',
    { /* Instance members */
      sceneWillConnect: async function () { //Window initialize
        if (!(await taskUtils.checkMNUtil(true))) return
        let self = getMNTaskClass()
        self.init(mainPath)
        // MNUtil.showHUD("mntask")
        self.appInstance = Application.sharedInstance();
        
        // 保存主插件实例到多个全局可访问的位置
        MNTaskInstance = self;
        if (typeof MNTaskGlobal !== 'undefined') {
          MNTaskGlobal.mainPlugin = self;
        }
        // self.popUpNote
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
        MNUtil.addObserver(self, 'onToggleMindmapTask:', 'toggleMindmapTask')
        MNUtil.addObserver(self, 'onRefreshTaskButton:', 'refreshTaskButton')
        MNUtil.addObserver(self, 'onOpenTaskSetting:', 'openTaskSetting')
        MNUtil.addObserver(self, 'onNewIconImage:', 'newIconImage')
        MNUtil.addObserver(self, 'onTextDidBeginEditing:', 'UITextViewTextDidBeginEditingNotification')
        MNUtil.addObserver(self, 'onTextDidEndEditing:', 'UITextViewTextDidEndEditingNotification')
        MNUtil.addObserver(self, 'onCloudConfigChange:', 'NSUbiquitousKeyValueStoreDidChangeExternallyNotificationUI')
      },

      sceneDidDisconnect: function () { // Window disconnect 在插件页面关闭插件（不是删除）
        if (typeof MNUtil === 'undefined') return
        // MNUtil.removeObserver(self, 'ProcessNewExcerpt')
        MNUtil.removeObserver(self,'PopupMenuOnNote')
        MNUtil.removeObserver(self,'toggleDynamic')
        MNUtil.removeObserver(self,'ClosePopupMenuOnNote')
        // MNUtil.removeObserver(self,'removeMNTask')
        MNUtil.removeObserver(self,'UITextViewTextDidBeginEditingNotification')
        MNUtil.removeObserver(self,'UITextViewTextDidEndEditingNotification')
        MNUtil.removeObserver(self,'refreshTaskButton')
        MNUtil.removeObserver(self,'openTaskSetting')
        MNUtil.removeObserver(self,'NSUbiquitousKeyValueStoreDidChangeExternallyNotificationUI')
        MNUtil.removeObserver(self,'ClosePopupMenuOnSelection')
        // MNUtil.delay(2).then(()=>{
        //   MNUtil.copy("object")
        //   self.addonController.view.frame = {x:undefined}
        // })
        // MNUtil.showHUD("remove")
      },

      sceneWillResignActive: function () { // Window resign active
      },

      sceneDidBecomeActive: function () { // Window become active
      },

      notebookWillOpen: async function (notebookid) {
        if (!(await taskUtils.checkMNUtil(true,0.1))) return
        if (MNUtil.studyMode < 3) {
          let self = getMNTaskClass()
          self.init(mainPath)
          await MNUtil.delay(0.5)
          self.ensureView(true)
          MNUtil.refreshAddonCommands();
          self.addonController.dynamic = taskConfig.dynamic
          self.addonController.notebookid = notebookid
          self.notebookid = notebookid
          taskUtils.notebookId = notebookid
          taskConfig.checkCloudStore()
        }
        MNUtil.delay(0.2).then(()=>{
          MNUtil.studyView.becomeFirstResponder(); //For dismiss keyboard on iOS
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
        taskConfig.windowState.open  = !self.addonController.view.hidden
        taskConfig.windowState.frame = self.addonController.view.frame
        taskConfig.save("MNTask_windowState")
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
      //     taskUtils.previousNoteId = sender.userInfo.noteid
      //   })
      // },
      onPopupMenuOnSelection: async function (sender) { // Clicking note
        if (typeof MNUtil === 'undefined') return
        let self = getMNTaskClass()
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

        if (!taskConfig.dynamic) {
          return
        }
        try {
          

        let lastFrame 
        if (!self.testController) {
          self.testController = taskController.new();
          self.testController.dynamicWindow = true
          self.testController.mainPath = mainPath;
          self.testController.dynamic = taskConfig.dynamic
          self.testController.view.hidden = true
          self.testController.addonController = self.addonController
          // self.testController.action = self.addonController.action
          // showHUD(self.testController.action)
          self.addonController.dynamicTask = self.testController
          MNUtil.studyView.addSubview(self.testController.view);
          lastFrame = self.addonController.view.frame
        }else{
          self.testController.refresh()
          lastFrame = self.testController.view.frame
        }
        if (taskConfig.vertical(true)){
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
            MNUtil.showHUD("Direction: "+menu.arrowDirection)
            break;
        }
        lastFrame.y = menuFrame.y-yOffset
        lastFrame.x = menuFrame.x
        let testController = self.testController
        // let delay = testController.view.hidden?0.5:0
        // await MNUtil.delay(delay)
        if (self.notShow && Date.now()-self.onClosePopupMenuOnNoteTime > 0 && Date.now()-self.onClosePopupMenuOnNoteTime < 500) {
          // MNUtil.showHUD("not show")
          return
        }
        // MNUtil.showHUD("message")
        if (testController.view.hidden) {
          MNUtil.studyView.bringSubviewToFront(testController.view)
          testController.refresh(lastFrame)
          testController.view.layer.opacity = 0
          testController.view.hidden = false
          testController.screenButton.hidden = false
          await MNUtil.animate(()=>{
            testController.view.layer.opacity = 1.0
          })
          // testController.moveButton.hidden = false
          testController.setTaskLayout()
        }else{
          self.onAnimate = true
          MNUtil.studyView.bringSubviewToFront(testController.view)
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
          taskUtils.addErrorLog(error, "onPopupMenuOnSelection")
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
            MNUtil.showHUD("message")
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
          taskUtils.addErrorLog(error, "onClosePopupMenuOnSelection")
        }
      },
      onPopupMenuOnNote: async function (sender) { // Clicking note
        if (typeof MNUtil === 'undefined') return
        let self = getMNTaskClass()
        if (self.window !== MNUtil.currentWindow) {
          return
        }
        try {
          self.ensureView() // 确保 addonController 已初始化
          self.addonController.popupReplace()
          if (self.settingController) {
            MNUtil.delay(0.01).then(()=>{
              self.settingController.blur()
              // self.settingController.webviewInput.resignFirstResponder()
              // MNUtil.studyView.becomeFirstResponder()
              // MNUtil.currentWindow.becomeFirstResponder()
              // MNUtil.mindmapView.becomeFirstResponder()
            })
          }

        if (!taskConfig.dynamic) {
          return
        }
        self.onPopupMenuOnNoteTime = Date.now()
        let lastFrame 
       if (!self.testController) {
          self.testController = taskController.new();
          self.testController.dynamicWindow = true
          self.testController.mainPath = mainPath;
          self.testController.dynamic = taskConfig.dynamic
          self.testController.view.hidden = true
          self.testController.addonController = self.addonController
          // self.testController.action = self.addonController.action
          // showHUD(self.testController.action)
          self.addonController.dynamicTask = self.testController
          MNUtil.studyView.addSubview(self.testController.view);
          lastFrame = self.addonController.view.frame
        }else{
          lastFrame = self.testController.view.frame
        }
        // if (!self.appInstance.checkNotifySenderInWindow(sender, self.window) || !taskConfig.dynamic) return; // Don't process message from other window
        self.noteid = sender.userInfo.note.noteId
        taskUtils.currentNoteId = sender.userInfo.note.noteId
        self.notShow = false
        let winRect = MNUtil.parseWinRect(sender.userInfo.winRect)
        let docMapSplitMode = MNUtil.studyController.docMapSplitMode
        //仅当竖向工具栏时,才考虑文档下不显示的问题
        if (taskConfig.vertical(true) && winRect.height <=11 && winRect.width <=11) {
          switch (docMapSplitMode) {
            case 1:
              let splitLine = MNUtil.splitLine
              if (MNUtil.studyController.rightMapMode) {
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
        let studyFrame = MNUtil.studyView.frame
        let studyFrameX = studyFrame.x
        let studyHeight = studyFrame.height
        
        self.testController.onClick = false
        if (taskConfig.horizontal(true)) {
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
              yOffset = -50
              break;
            case 2:
              yOffset = 45
              break;
            default:
              break;
          }
          lastFrame.y = menuFrame.y-yOffset
          lastFrame.x = menuFrame.x
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

        let testController = self.testController
        // let delay = testController.view.hidden?0.5:0
        // await MNUtil.delay(delay)
        if (self.notShow) {
          // MNUtil.showHUD("not show")
          return
        }

        if (testController.view.hidden) {
          // MNUtil.showHUD("show1")
          if (testController.onAnimate) {
            testController.notHide = true
          }
          self.onAnimate = true
          MNUtil.studyView.bringSubviewToFront(testController.view)
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
          testController.setTaskLayout()
        }else{
          // MNUtil.showHUD("show2")
          MNUtil.studyView.bringSubviewToFront(testController.view)
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
          taskUtils.addErrorLog(error, "onPopupMenuOnNote")
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
          // MNUtil.showHUD("close")
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
      // onMNTaskRefreshLayout: function (params) {
      //   Application.sharedInstance().showHUD("message", self.window, 2)
      //   // MNUtil.showHUD("message",2,self.window)
      // },
      documentDidOpen: function (docmd5) {
      },

      documentWillClose: function (docmd5) {
      },

      controllerWillLayoutSubviews: function (controller) {
        if (typeof MNUtil === 'undefined') return
        if (controller !== MNUtil.studyController) {
          // MNUtil.showHUD("return")
          return;
        };
        if (!self.addonController.view.hidden) {
          if (self.addonController.onAnimate || self.addonController.onResize) {
            // showHUD("reject")
          }else{
            if (taskConfig.horizontal()) {
              let currentFrame = self.addonController.currentFrame
              self.addonController.setFrame(MNUtil.genFrame(currentFrame.x, currentFrame.y, 40, taskUtils.checkHeight(currentFrame.width,self.addonController.maxButtonNumber)),true)
            } else {
              let splitLine = MNUtil.splitLine
              // MNUtil.showHUD("splitline:"+splitLine)
              let studyFrame = MNUtil.studyView.bounds
              let currentFrame = self.addonController.currentFrame
              // showHUD(JSON.stringify(currentFrame))
              if (currentFrame.x+currentFrame.width*0.5 >= studyFrame.width) {
                currentFrame.x = studyFrame.width-currentFrame.width*0.5              
              }
              if (currentFrame.y >= studyFrame.height) {
                currentFrame.y = studyFrame.height-20              
              }
              if (self.addonController.splitMode) {
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
              if (self.addonController.sideMode) {
                switch (self.addonController.sideMode) {
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
              self.addonController.setFrame(MNUtil.genFrame(currentFrame.x, currentFrame.y, taskUtils.checkHeight(currentFrame.height,self.addonController.maxButtonNumber),40),true)
              // self.addonController.view.frame = currentFrame
              // self.addonController.currentFrame = currentFrame
            }
          }
        }
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
            let currentFrame = self.testController.currentFrame
            let buttonNumber = taskConfig.getWindowState("dynamicButton");
            currentFrame.height = taskUtils.checkHeight(currentFrame.height,buttonNumber)
            self.testController.view.frame = currentFrame
            self.testController.currentFrame = currentFrame
          }
        }
        if (self.settingController && !self.settingController.onAnimate) {
          let currentFrame = self.settingController.currentFrame
          // currentFrame.height = taskUtils.checkHeight(currentFrame.height)
          self.settingController.view.frame = currentFrame
          self.settingController.currentFrame = currentFrame
        }
      },

      queryAddonCommandStatus: function () {
        // MNUtil.showHUD("queryAddonCommandStatus")
        if (typeof MNUtil === 'undefined') return null
          self.ensureView(false)
          if (self.addonController) {
            self.addonController.setTaskButton()
          }
          if (self.settingController) {
              let iCloudSync = taskConfig.iCloudSync
              MNButton.setColor(self.settingController.iCloudButton, iCloudSync?"#457bd3":"#9bb2d6",0.8)
              MNButton.setTitle(self.settingController.iCloudButton, "iCloud Sync "+(iCloudSync? "✅":"❌"),undefined, true)
          }
          // taskUtils.refreshSubscriptionStatus()
          return {
            image: 'logo.png',
            object: self,
            selector: 'toggleAddon:',
            checked: taskConfig.dynamic
          };
      },
      onNewIconImage: function (sender) {
        if (typeof MNUtil === 'undefined') return
        if (self.window !== MNUtil.currentWindow) {
          return
        }
        // MNUtil.showHUD("replace icon")
        if (sender.userInfo.imageBase64) {
          let imageData = NSData.dataWithContentsOfURL(MNUtil.genNSURL(sender.userInfo.imageBase64))
          // MNUtil.copyImage(imageData)
          let image = UIImage.imageWithData(imageData)
          let selected = self.settingController.selectedItem

          taskConfig.setButtonImage(selected, image,true)
        }
      },
      onOpenTaskSetting:function (params) {
        if (typeof MNUtil === 'undefined') return
        if (self.window !== MNUtil.currentWindow) {
          return
        }
        self.openSetting()
      },
      onToggleDynamic:function (sender) {
        
        if (typeof MNUtil === 'undefined') return
        taskConfig.dynamic = !taskConfig.dynamic
        self.addonController.dynamic = taskConfig.dynamic
        if (taskConfig.dynamic) {
          MNUtil.showHUD("Dynamic ✅")
        }else{
          self.testController.view.hidden = true
        }
        taskConfig.save("MNTask_dynamic")
        // NSUserDefaults.standardUserDefaults().setObjectForKey(taskConfig.dynamic,"MNTask_dynamic")
        self.testController.dynamic = taskConfig.dynamic
      },
      onToggleMindmapTask:function (sender) {
        if ("target" in sender.userInfo) {
          switch (sender.userInfo.target) {
            case "addonBar":
              if (!self.addonBar) {
                self.addonBar = MNUtil.studyView.subviews.find(subview=>{
                  let frame = subview.frame
                  if (!subview.hidden && frame.y > 100 && frame.width === 40 && (frame.x < 100 || frame.x > MNUtil.studyView.bounds.width-150)) {
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
                MNUtil.studyView.addSubview(self.addonBar)
                self.isAddonBarRemoved = false
              }else{
                self.addonBar.removeFromSuperview()
                self.isAddonBarRemoved = true
              }
              break;
            case "mindmapTask":
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
        let self = getMNTaskClass()
        if (typeof MNUtil === 'undefined') return 
        if (self.window !== MNUtil.currentWindow) {
          return
        } 
        self.settingController.refreshView("popupEditView")
        self.settingController.refreshView("advanceView")
      },
      onCloudConfigChange: async function (sender) {
        let self = getMNTaskClass()
        if (typeof MNUtil === 'undefined') return
        if (self.window !== MNUtil.currentWindow) {
          return
        }
        if (!taskConfig.iCloudSync) {
          return
        }
        self.ensureView()
        self.checkUpdate()
      },
      manualSync: async function (sender) {
        let self = getMNTaskClass()
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
        taskUtils.textView = textView
        // MNUtil.showHUD("message")
        if (!taskConfig.showEditorOnNoteEdit) {
          return
        }
        let mindmapView = taskUtils.getMindmapview(textView)
        if (taskUtils.checkExtendView(textView)) {
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
          // MNUtil.showHUD("message")
          return
        }
        if (mindmapView) {
          let noteView = mindmapView.selViewLst[0].view
          // let focusNote = MNNote.getFocusNote()
          let focusNote = MNNote.new(mindmapView.selViewLst[0].note.note)
          let beginFrame = noteView.convertRectToView(noteView.bounds, MNUtil.studyView)
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
            let studyFrame = MNUtil.studyView.bounds
            if (beginFrame.x+450 > studyFrame.width) {
              let endFrame = taskFrame.gen(studyFrame.width-450, beginFrame.y-10, 450, 500)
              if (beginFrame.y+490 > studyFrame.height) {
                endFrame.y = studyFrame.height-500
              }
              MNUtil.postNotification("openInEditor",{noteId:noteId,beginFrame:beginFrame,endFrame:endFrame})
            }else{
              let endFrame = taskFrame.gen(beginFrame.x, beginFrame.y-10, 450, 500)
              if (beginFrame.y+490 > studyFrame.height) {
                endFrame.y = studyFrame.height-500
              }
              MNUtil.postNotification("openInEditor",{noteId:noteId,beginFrame:beginFrame,endFrame:endFrame})
            }
          }
        }
        // MNUtil.showHUD(param.object.text)
        // MNUtil.copyJSON(params.userInfo)

} catch (error) {
  taskUtils.addErrorLog(error, "onTextDidBeginEditing")
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
        if (textView === taskUtils.textView) {
          // MNUtil.showHUD("onTextDidEndEditing")
          taskUtils.textView = undefined
        }
      },
      onRefreshTaskButton: function (sender) {
        try {
        self.addonController.setTaskButton()
        if (self.settingController) {
          self.settingController.setButtonText()
        }
        } catch (error) {
          taskUtils.addErrorLog(error, "onRefreshTaskButton")
        }
      },
      openSetting:function () {
        let self = getMNTaskClass()
        self.checkPopoverController()
        self.openSetting()
      },
      toggleTask:function () {
        let self = getMNTaskClass()
        self.checkPopoverController()
        self.init(mainPath)
        self.ensureView(true)
        if (taskConfig.isFirst) {
          let buttonFrame = self.addonBar.frame
          // self.addonController.moveButton.hidden = true
          if (buttonFrame.x === 0) {
            taskFrame.set(self.addonController.view,40,buttonFrame.y,40,290)
          }else{
            taskFrame.set(self.addonController.view,buttonFrame.x-40,buttonFrame.y,40,290)
          }
          self.addonController.currentFrame = self.addonController.view.frame
          taskConfig.isFirst = false;
        }
        if (self.addonController.view.hidden) {
          taskConfig.windowState.open = true
          taskConfig.windowState.frame = self.addonController.view.frame
          // showHUD(JSON.stringify(self.addonBar.frame))
          self.addonController.show()
          taskConfig.save("MNTask_windowState")
        }else{
          taskConfig.windowState.open = false
          taskConfig.windowState.frame = self.addonController.view.frame
          self.addonController.hide()
          taskConfig.save("MNTask_windowState")
        }
      },
      toggleDynamic:function () {
        let self = getMNTaskClass()
        self.checkPopoverController()
        if (typeof MNUtil === 'undefined') return
        taskConfig.dynamic = !taskConfig.dynamic
        if (taskConfig.dynamic) {
          MNUtil.showHUD("Dynamic ✅")
        }else{
          MNUtil.showHUD("Dynamic ❌")
          if (self.testController) {
            self.testController.view.hidden = true
          }
          // self.testController.view.hidden = true
        }
        taskConfig.save("MNTask_dynamic")
        // NSUserDefaults.standardUserDefaults().setObjectForKey(taskConfig.dynamic,"MNTask_dynamic")
        if (self.testController) {
          self.testController.dynamic = taskConfig.dynamic
        }
        MNUtil.refreshAddonCommands()
      },
      // 夏大鱼羊增加：卡片的预处理
      togglePreprocess: function () {
        let self = getMNTaskClass()
        self.checkPopoverController()
        taskConfig.togglePreprocess()
      },
      // 夏大鱼羊结束

      openDocument:function (button) {
        if (typeof MNUtil === 'undefined') return
        let self = getMNTaskClass()
        self.checkPopoverController()
        MNUtil.postNotification("openInBrowser", {url:"https://mnaddon.craft.me/task"})
      },
      toggleTaskDirection: function (source) {
        let self = getMNTaskClass()
        self.checkPopoverController()
        taskConfig.toggleTaskDirection(source)
      },
        // if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
      toggleAddon:function (button) {
      try {
        if (typeof MNUtil === 'undefined') return
        let self = getMNTaskClass()
// let res = taskUtils.markdown2AST(markdown)
// // let res = marked.lexer(markdown)
// MNUtil.copy(res)
// let focusNote = MNNote.getFocusNote()
// MNUtil.undoGrouping(()=>{
//   taskUtils.AST2Mindmap(focusNote,res)
// })
// return
        if (!self.addonBar) {
          self.addonBar = button.superview.superview
          self.addonController.addonBar = self.addonBar
        }
        let selector = "toggleTaskDirection:"
        var commandTable = [
            self.tableItem('⚙️   Setting', 'openSetting:'),
            self.tableItem('🛠️   Task', 'toggleTask:',undefined,!self.addonController.view.hidden),
            self.tableItem('🛠️   Direction   '+(taskConfig.vertical()?'↕️':'↔️'), selector,"fixed"),
            self.tableItem('🌟   Dynamic   ', "toggleDynamic",undefined,taskConfig.dynamic),
            self.tableItem('🌟   Direction   '+(taskConfig.vertical()?'↕️':'↔️'), selector,"dynamic"),
            self.tableItem('🗂️   卡片预处理模式  ',"togglePreprocess:", undefined, taskConfig.windowState.preprocess),
            self.tableItem('📄   Document', 'openDocument:'),
            self.tableItem('🔄   Manual Sync','manualSync:')
        ];
        if (self.addonBar.frame.x < 100) {
          self.popoverController = MNUtil.getPopoverAndPresent(button,commandTable,200,4)
        }else{
          self.popoverController = MNUtil.getPopoverAndPresent(button,commandTable,200,0)
        }
      } catch (error) {
        taskUtils.addErrorLog(error, "toggleAddon")
      }
        return
        
      // self.addonController.view.hidden = !self.addonController.view.hidden
      }
    },
    { /* Class members */
      addonDidConnect: function () {
      },

      addonWillDisconnect: async function () {
        let confirm = await MNUtil.confirm("MN Task: Remove all config?", "MN Task: 删除所有配置？")
        if (confirm) {
          taskConfig.remove("MNTask_dynamic")
          taskConfig.remove("MNTask_windowState")
          taskConfig.remove("MNTask_action")
          taskConfig.remove("MNTask_actionConfig")
        }
        // MNUtil.postNotification("removeMNTask", {})
      },

      applicationWillEnterForeground: function () {
        if (typeof MNUtil === 'undefined') return
        MNUtil.postNotification("NSUbiquitousKeyValueStoreDidChangeExternallyNotificationUI", {})
        // taskUtils.addErrorLog("error", "applicationWillEnterForeground")
      },

      applicationDidEnterBackground: function () {
      },

      applicationDidReceiveLocalNotification: function (notify) {
      }
    }
  );
  MNTaskClass.prototype.init = function(mainPath){ 
  try {

    if (!this.initialized) {
      taskUtils.init(mainPath)
      taskConfig.init(mainPath)
      this.initialized = true
    }
  } catch (error) {
    taskUtils.addErrorLog(error, "init")
  }
  }
  MNTaskClass.prototype.ensureView = function (refresh = true) {
  try {
    if (!this.addonController) {
      this.addonController = taskController.new();
      this.addonController.view.hidden = true;
      MNUtil.studyView.addSubview(this.addonController.view);
    }
    if (taskUtils.isDescendantOfCurrentWindow(this.addonController.view) && !MNUtil.isDescendantOfStudyView(this.addonController.view)) {
      MNUtil.studyView.addSubview(this.addonController.view)
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
    if (taskConfig.windowState.frame) {
      this.addonController.setFrame(taskConfig.windowState.frame)
      // this.addonController.view.hidden = !taskConfig.windowState.open;
      this.addonController.view.hidden = !taskConfig.getWindowState("open");
      taskConfig.isFirst = false
    }else{
      taskConfig.windowState={}
    }
      } catch (error) {
      taskUtils.showHUD(error,5)
  }
  }
  /**
   * 
   * @this {MNTaskClass} 
   */
  MNTaskClass.prototype.openSetting = function () {
    try {
    if (!this.settingController) {
      this.settingController = taskSettingController.new();
      this.settingController.taskController = this.addonController
      this.settingController.mainPath = taskConfig.mainPath;
      this.settingController.action = taskConfig.action
      // this.settingController.dynamicTask = this.dynamicTask
      MNUtil.studyView.addSubview(this.settingController.view)
      // taskUtils.studyController().view.addSubview(this.settingController.view)
    }
    this.settingController.show()
    } catch (error) {
      taskUtils.addErrorLog(error, "openSetting")
    }
}
  MNTaskClass.prototype.checkUpdate = async function () {
    try {
      let shouldUpdate = await taskConfig.readCloudConfig(false)
      if (shouldUpdate) {
        let allActions = taskConfig.getAllActions()
        // MNUtil.copyJSON(allActions)
        if (this.settingController) {
          this.settingController.setButtonText(allActions,this.settingController.selectedItem)
        }
        // this.addonController.view.hidden = true
        if (this.addonController) {
          this.addonController.setFrame(taskConfig.getWindowState("frame"))
          this.addonController.setTaskButton(allActions)
        }else{
          MNUtil.showHUD("No addonController")
        }
        MNUtil.postNotification("refreshView",{})
      }
    } catch (error) {
      taskUtils.addErrorLog(error, "checkUpdate")
    }
  }
  MNTaskClass.prototype.checkPopoverController = function () {
    if (this.popoverController) {this.popoverController.dismissPopoverAnimated(true);}
  }
/**
 * 
 * @param {string} title 
 * @param {string} selector 
 * @param {any} param 
 * @param {boolean|undefined} checked 
 * @this {MNTaskClass}
 * @returns 
 */
MNTaskClass.prototype.tableItem = function (title,selector,param = "",checked = false) {
  return {title:title,object:this,selector:selector,param:param,checked:checked}
}

  // ========== TodayBoardController 定义 ==========
  /** @return {TodayBoardController} */
  const getTodayBoardController = () => self;
  
  MNUtil.log("📝 开始定义 TodayBoardController");
  
  var TodayBoardController = JSB.defineClass('TodayBoardController : UIViewController <UIWebViewDelegate>', {
  // 视图加载
  viewDidLoad: function() {
    let self = getTodayBoardController();
    MNUtil.log("🚀 TodayBoardController viewDidLoad 开始");
    try {
      self.init();
      MNUtil.log("✅ init 完成");
      
      // 设置默认视图大小（参考 mnai 的做法）
      self.view.frame = {x: 50, y: 50, width: 800, height: 600};
      self.lastFrame = self.view.frame;
      self.currentFrame = self.view.frame;
      MNUtil.log("✅ 视图大小设置完成");
      
      self.setupUI();
      MNUtil.log("✅ setupUI 完成");
      
      self.loadTodayBoard();
      MNUtil.log("✅ loadTodayBoard 完成");
      
      MNUtil.log("🎉 TodayBoardController viewDidLoad 成功完成");
    } catch (error) {
      MNUtil.log(`❌ viewDidLoad 错误: ${error.message || error}`);
      taskUtils.addErrorLog(error, "TodayBoardController.viewDidLoad");
      MNUtil.showHUD("加载今日看板失败");
    }
  },

  // WebView 代理方法 - 处理自定义 URL scheme
  webViewShouldStartLoadWithRequestNavigationType: function(webView, request, type) {
    try {
      let self = getTodayBoardController();
      let requestURL = request.URL().absoluteString();
      
      if (!requestURL) {
        return true;
      }

      // 处理自定义协议
      if (requestURL.startsWith("mntask://")) {
        self.handleCustomProtocol(requestURL);
        return false;
      }

      return true;
    } catch (error) {
      taskUtils.addErrorLog(error, "webViewShouldStartLoadWithRequestNavigationType");
      return false;
    }
  },

  // 关闭视图
  close: function() {
    let self = getTodayBoardController();
    MNUtil.log("🔒 关闭 HTML 今日看板");
    
    // 清理 WebView
    if (self.webView) {
      self.webView.delegate = null;
      self.webView.stopLoading();
      self.webView.removeFromSuperview();
      self.webView = null;
    }
    
    // 清理定时器
    if (self.refreshTimer) {
      clearInterval(self.refreshTimer);
      self.refreshTimer = null;
    }
    
    self.dismissViewControllerAnimatedCompletion(true, null);
  },
  
  // 视图将要消失时清理
  viewWillDisappear: function(animated) {
    let self = getTodayBoardController();
    MNUtil.log("👋 TodayBoardController viewWillDisappear");
    
    // 清理 WebView delegate
    if (self.webView) {
      self.webView.delegate = null;
    }
  }
});

// 扩展原型方法
TodayBoardController.prototype.init = function() {
  this.mainPath = MNUtil.mainPath;
  this.htmlPath = this.mainPath + '/todayboard.html';
  this.refreshTimer = null;
}

// 设置 UI
TodayBoardController.prototype.setupUI = function() {
  // 设置视图背景
  this.view.backgroundColor = MNUtil.hexColor("#ffffff");
  
  // 创建导航栏
  this.createNavigationBar();
  
  // 创建 WebView
  this.createWebView();
}

// 创建导航栏
TodayBoardController.prototype.createNavigationBar = function() {
  // 导航栏容器
  const navBar = UIView.new();
  navBar.backgroundColor = MNUtil.hexColor("#667eea");
  navBar.frame = {x: 0, y: 0, width: this.view.bounds.width, height: 44};
  this.view.addSubview(navBar);
  
  // 标题
  const titleLabel = UILabel.new();
  titleLabel.text = "今日任务看板";
  titleLabel.textColor = UIColor.whiteColor();
  titleLabel.font = UIFont.boldSystemFontOfSize(17);
  titleLabel.textAlignment = NSTextAlignmentCenter;
  titleLabel.frame = {x: 0, y: 0, width: this.view.bounds.width, height: 44};
  navBar.addSubview(titleLabel);
  
  // 关闭按钮
  const closeButton = UIButton.buttonWithType(0);
  closeButton.setTitleForState("关闭", 0);
  closeButton.setTitleColorForState(UIColor.whiteColor(), 0);
  closeButton.titleLabel.font = UIFont.systemFontOfSize(16);
  closeButton.frame = {x: this.view.bounds.width - 60, y: 0, width: 60, height: 44};
  closeButton.addTargetActionForControlEvents(this, "close", 1 << 6);
  navBar.addSubview(closeButton);
  
  // 刷新按钮
  const refreshButton = UIButton.buttonWithType(0);
  refreshButton.setTitleForState("🔄", 0);
  refreshButton.titleLabel.font = UIFont.systemFontOfSize(20);
  refreshButton.frame = {x: 10, y: 0, width: 44, height: 44};
  refreshButton.addTargetActionForControlEvents(this, "refreshBoard:", 1 << 6);
  navBar.addSubview(refreshButton);
  
  this.navBar = navBar;
}

// 创建 WebView
TodayBoardController.prototype.createWebView = function() {
  MNUtil.log("📱 开始创建 WebView");
  
  const webViewFrame = {
    x: 0,
    y: 44,
    width: this.view.bounds.width,
    height: this.view.bounds.height - 44
  };
  
  MNUtil.log(`📐 WebView frame: ${JSON.stringify(webViewFrame)}`);
  
  this.webView = new UIWebView(webViewFrame);
  this.webView.backgroundColor = MNUtil.hexColor("#ffffff");
  this.webView.scalesPageToFit = false;
  this.webView.autoresizingMask = (1 << 1 | 1 << 4); // 宽度和高度自适应
  this.webView.delegate = this;
  
  this.view.addSubview(this.webView);
  MNUtil.log("✅ WebView 创建成功并添加到视图");
}

// 加载今日看板
TodayBoardController.prototype.loadTodayBoard = function() {
  try {
    // 加载 HTML 文件
    MNUtil.loadFile(this.webView, this.htmlPath, this.mainPath);
    
    // 延迟加载数据，确保 WebView 已准备好
    MNUtil.delay(0.5).then(() => {
      this.loadTaskData();
    });
  } catch (error) {
    taskUtils.addErrorLog(error, "loadTodayBoard");
    MNUtil.showHUD("加载看板失败");
  }
}

// 加载任务数据
TodayBoardController.prototype.loadTaskData = function() {
  try {
    // 获取今日任务
    const todayTasks = MNTaskManager.filterTodayTasks();
    
    // 转换为适合显示的格式
    const displayTasks = todayTasks.map(task => {
      const taskInfo = MNTaskManager.parseTaskTitle(task.noteTitle);
      const priorityInfo = MNTaskManager.getTaskPriority(task);
      const timeInfo = MNTaskManager.getPlannedTime(task);
      const progressInfo = MNTaskManager.getTaskProgress(task);
      
      // 检查是否过期
      const todayField = TaskFieldUtils.getFieldContent(task, "今日");
      const overdueInfo = MNTaskManager.checkIfOverdue(todayField);
      
      return {
        id: task.noteId,
        title: taskInfo.content,
        type: taskInfo.type,
        status: taskInfo.status,
        priority: priorityInfo || '低',
        plannedTime: timeInfo,
        progress: progressInfo,
        isOverdue: overdueInfo.isOverdue,
        overdueDays: overdueInfo.days,
        launchUrl: MNTaskManager.getLaunchLink(task),
        path: taskInfo.path || ''
      };
    });
    
    // 传递数据到 WebView
    const encodedTasks = encodeURIComponent(JSON.stringify(displayTasks));
    MNUtil.runJavaScript(this.webView, `loadTasksFromPlugin('${encodedTasks}')`);
    
  } catch (error) {
    taskUtils.addErrorLog(error, "loadTaskData");
    MNUtil.showHUD("加载任务数据失败");
  }
}

// 处理自定义协议
TodayBoardController.prototype.handleCustomProtocol = function(url) {
  try {
    const urlParts = url.split("://")[1].split("?");
    const action = urlParts[0];
    const params = this.parseQueryString(urlParts[1] || '');
    
    switch (action) {
      case 'updateStatus':
        this.updateTaskStatus(params.id);
        break;
      case 'launch':
        this.launchTask(params.id);
        break;
      case 'viewDetail':
        this.viewTaskDetail(params.id);
        break;
      case 'refresh':
        this.refreshBoard();
        break;
      case 'export':
        this.exportData();
        break;
      case 'quickStart':
        this.quickStart();
        break;
      case 'showHUD':
        MNUtil.showHUD(decodeURIComponent(params.message || ''));
        break;
      default:
        MNUtil.log(`Unknown action: ${action}`);
    }
  } catch (error) {
    taskUtils.addErrorLog(error, "handleCustomProtocol");
  }
}

// 解析查询字符串
TodayBoardController.prototype.parseQueryString = function(queryString) {
  const params = {};
  if (!queryString) return params;
  
  queryString.split('&').forEach(param => {
    const [key, value] = param.split('=');
    params[key] = value;
  });
  
  return params;
}

// 更新任务状态
TodayBoardController.prototype.updateTaskStatus = function(taskId) {
  try {
    const task = MNNote.new(taskId);
    if (!task) {
      MNUtil.showHUD("任务不存在");
      return;
    }
    
    // 使用现有的状态切换功能
    MNUtil.undoGrouping(() => {
      MNTaskManager.toggleTaskStatus(task, true); // forward = true
    });
    
    // 刷新数据
    MNUtil.delay(0.3).then(() => {
      this.loadTaskData();
    });
    
    MNUtil.showHUD("状态已更新");
  } catch (error) {
    taskUtils.addErrorLog(error, "updateTaskStatus");
    MNUtil.showHUD("更新状态失败");
  }
}

// 启动任务
TodayBoardController.prototype.launchTask = function(taskId) {
  try {
    const task = MNNote.new(taskId);
    if (!task) {
      MNUtil.showHUD("任务不存在");
      return;
    }
    
    const launchLink = MNTaskManager.getLaunchLink(task);
    if (!launchLink) {
      MNUtil.showHUD("此任务没有启动链接");
      return;
    }
    
    // 判断链接类型并执行
    const linkType = MNTaskManager.getLinkType(launchLink);
    
    switch (linkType) {
      case 'cardLink':
        // 卡片链接 - 直接定位
        const targetNote = MNNote.new(launchLink.noteId);
        if (targetNote) {
          targetNote.focusInFloatMindMap(0.5);
          this.close(); // 关闭看板
        }
        break;
        
      case 'uiState':
        // UI 状态链接 - 在浮窗显示
        task.focusInFloatMindMap(0.5);
        this.close(); // 关闭看板
        break;
        
      case 'external':
        // 外部链接 - 打开应用
        MNUtil.openURL(launchLink.url);
        break;
        
      default:
        MNUtil.showHUD("未知的链接类型");
    }
  } catch (error) {
    taskUtils.addErrorLog(error, "launchTask");
    MNUtil.showHUD("启动任务失败");
  }
}

// 查看任务详情
TodayBoardController.prototype.viewTaskDetail = function(taskId) {
  try {
    const task = MNNote.new(taskId);
    if (!task) {
      MNUtil.showHUD("任务不存在");
      return;
    }
    
    // 在浮窗中显示任务详情
    task.focusInFloatMindMap(0.5);
    this.close(); // 关闭看板
  } catch (error) {
    taskUtils.addErrorLog(error, "viewTaskDetail");
    MNUtil.showHUD("查看详情失败");
  }
}

// 刷新看板
TodayBoardController.prototype.refreshBoard = function(button) {
  MNUtil.showHUD("🔄 正在刷新...");
  this.loadTaskData();
}

// 导出数据
TodayBoardController.prototype.exportData = function() {
  try {
    const todayTasks = MNTaskManager.filterTodayTasks();
    const report = MNTaskManager.generateTodayReport(todayTasks);
    
    MNUtil.copy(report);
    MNUtil.showHUD("📋 今日任务报告已复制到剪贴板");
  } catch (error) {
    taskUtils.addErrorLog(error, "exportData");
    MNUtil.showHUD("导出失败");
  }
}

// 快速启动
TodayBoardController.prototype.quickStart = function() {
  try {
    // 获取第一个进行中的任务
    const todayTasks = MNTaskManager.filterTodayTasks();
    const inProgressTasks = todayTasks.filter(task => {
      const taskInfo = MNTaskManager.parseTaskTitle(task.noteTitle);
      return taskInfo.status === '进行中';
    });
    
    if (inProgressTasks.length === 0) {
      MNUtil.showHUD("没有进行中的任务");
      return;
    }
    
    // 启动第一个任务
    this.launchTask(inProgressTasks[0].noteId);
  } catch (error) {
    taskUtils.addErrorLog(error, "quickStart");
    MNUtil.showHUD("快速启动失败");
  }
}
  
  MNUtil.log("✅ TodayBoardController 定义完成");
  // ========== TodayBoardController 定义结束 ==========
  
  return MNTaskClass;
};