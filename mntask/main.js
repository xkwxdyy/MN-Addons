JSB.newAddon = function (mainPath) {
  JSB.require('utils')
  
  // 加载日志管理器
  try {
    JSB.require('logManager')
    if (typeof TaskLogManager !== 'undefined') {
      TaskLogManager.info("MNTask 插件启动", "Main");
    }
  } catch (error) {
    if (typeof MNUtil !== 'undefined' && MNUtil.log) {
      MNUtil.log("⚠️ logManager.js 加载失败: " + error.message)
    }
  }
  
  // 加载工具函数扩展（包含 MNTaskManager 等核心类）
  try {
    JSB.require('xdyy_utils_extensions')
    if (typeof MNUtil !== 'undefined' && MNUtil.log) {
      MNUtil.log("✅ xdyy_utils_extensions.js 加载成功")
    }
  } catch (error) {
    if (typeof MNUtil !== 'undefined' && MNUtil.addErrorLog) {
      MNUtil.addErrorLog(error, "加载 xdyy_utils_extensions.js 失败", {
        message: error.message,
        stack: error.stack
      })
    }
    // 这是核心文件，加载失败应该报告
    if (typeof MNUtil !== 'undefined' && MNUtil.showHUD) {
      MNUtil.showHUD("❌ 核心扩展加载失败: " + error.message)
    }
  }
  
  JSB.require('pinyin')
  
  if (!taskUtils.checkMNUtilsFolder(mainPath)) {return undefined}
  JSB.require('webviewController');
  JSB.require('settingController'); // 文件名保持不变，只是类名改变了
  // 加载 todayBoardController (已集成到 settingController 中，不再需要独立加载)
  // JSB.require('todayBoardController');
  
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
        // 添加笔记更新监听器（用于同步看板数据）
        MNUtil.addObserver(self, 'onNoteDidUpdate:', 'NoteDidUpdate')
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
        MNUtil.removeObserver(self,'NoteDidUpdate')
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
          taskUtils.currentNotebookId = notebookid
          taskConfig.checkCloudStore()
          // 加载笔记本特定配置
          await taskConfig.readCloudConfig(false, false, false)
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
      testBoardSync: async function (sender) {
        let self = getMNTaskClass()
        if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
        
        try {
          MNUtil.showHUD("🔄 开始测试看板同步...")
          
          // 检查看板绑定状态
          const boards = {
            target: taskConfig.getBoardNoteId('target'),
            project: taskConfig.getBoardNoteId('project'),
            action: taskConfig.getBoardNoteId('action'),
            completed: taskConfig.getBoardNoteId('completed'),
            today: taskConfig.getBoardNoteId('today')
          }
          
          let boundBoards = 0
          for (const [key, noteId] of Object.entries(boards)) {
            if (noteId) {
              boundBoards++
              MNUtil.log(`✅ ${key} 看板已绑定: ${noteId}`)
            } else {
              MNUtil.log(`❌ ${key} 看板未绑定`)
            }
          }
          
          if (boundBoards === 0) {
            MNUtil.showHUD("❌ 没有绑定任何看板")
            return
          }
          
          // 执行同步
          await self.syncTasksToWebView()
          
          MNUtil.showHUD(`✅ 同步完成 (${boundBoards} 个看板)`)
          
        } catch (error) {
          taskUtils.addErrorLog(error, "testBoardSync")
          MNUtil.showHUD("❌ 同步失败: " + error.message)
        }
      },
      /**
       * 处理笔记更新事件，用于实时同步看板数据
       * @param {Object} sender - 通知对象
       */
      onNoteDidUpdate: function(sender) {
        try {
          let self = getMNTaskClass()
          
          // 检查是否在当前窗口
          if (self.window !== MNUtil.currentWindow) {
            return
          }
          
          // 获取更新的笔记ID
          const noteId = sender.userInfo ? sender.userInfo.noteid : null
          if (!noteId) return
          
          // 检查是否是任务卡片
          const note = MNNote.new(noteId)
          if (!note) return
          
          // 检查是否是任务类型的卡片
          const typeField = TaskFieldUtils.getFieldContent(note, "类型")
          if (!typeField) return
          
          MNUtil.log(`📝 检测到任务卡片更新: ${note.noteTitle || noteId}`)
          
          // 如果今日看板正在显示，刷新数据
          if (self.addonController && 
              self.addonController.settingController && 
              self.addonController.settingController.todayBoardWebViewInitialized) {
            
            // 延迟刷新，避免频繁更新
            if (self.noteUpdateTimer) {
              clearTimeout(self.noteUpdateTimer)
            }
            
            self.noteUpdateTimer = setTimeout(() => {
              MNUtil.log("🔄 刷新今日看板数据")
              self.addonController.settingController.loadTodayBoardData()
              self.noteUpdateTimer = null
            }, 500)
          }
          
        } catch (error) {
          MNUtil.log(`❌ onNoteDidUpdate 出错: ${error.message}`)
          taskUtils.addErrorLog(error, "onNoteDidUpdate")
        }
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
      openTodayBoard:function () {
        let self = getMNTaskClass()
        self.checkPopoverController()
        self.openTodayBoard()
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
            self.tableItem('📋   今日看板', 'openTodayBoard:'),
            self.tableItem('🛠️   Task', 'toggleTask:',undefined,!self.addonController.view.hidden),
            self.tableItem('🛠️   Direction   '+(taskConfig.vertical()?'↕️':'↔️'), selector,"fixed"),
            self.tableItem('🌟   Dynamic   ', "toggleDynamic",undefined,taskConfig.dynamic),
            self.tableItem('🌟   Direction   '+(taskConfig.vertical()?'↕️':'↔️'), selector,"dynamic"),
            self.tableItem('🗂️   卡片预处理模式  ',"togglePreprocess:", undefined, taskConfig.windowState.preprocess),
            self.tableItem('📄   Document', 'openDocument:'),
            self.tableItem('🔄   Manual Sync','manualSync:'),
            self.tableItem('📊   Test Board Sync','testBoardSync:')
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
  /**
   * 打开今日看板视图
   * @this {MNTaskClass} 
   */
  MNTaskClass.prototype.openTodayBoard = function () {
    try {
      MNUtil.log("🚀 开始打开今日看板")
      
      // 🔧 验证必要组件
      if (!MNUtil.studyView) {
        MNUtil.log("❌ studyView 不存在，无法打开今日看板")
        MNUtil.showHUD("无法打开今日看板：界面未准备好")
        return
      }
      
      // 先打开设置面板
      if (!this.settingController) {
        MNUtil.log("📱 创建设置控制器")
        try {
          this.settingController = taskSettingController.new();
          this.settingController.taskController = this.addonController
          this.settingController.mainPath = taskConfig.mainPath;
          this.settingController.action = taskConfig.action
          MNUtil.studyView.addSubview(this.settingController.view)
          MNUtil.log("✅ 设置控制器创建成功")
        } catch (createError) {
          MNUtil.log("❌ 创建设置控制器失败: " + createError.message)
          MNUtil.showHUD("创建设置面板失败")
          taskUtils.addErrorLog(createError, "创建设置控制器")
          return
        }
      }
      
      // 显示设置面板
      try {
        this.settingController.show()
        MNUtil.log("✅ 设置面板显示成功")
      } catch (showError) {
        MNUtil.log("❌ 显示设置面板失败: " + showError.message)
        MNUtil.showHUD("显示设置面板失败")
        taskUtils.addErrorLog(showError, "显示设置面板")
        return
      }
      
      // 切换到今日看板视图
      if (this.settingController.viewManager) {
        MNUtil.log("🔄 切换到今日看板视图")
        try {
          this.settingController.viewManager.switchTo('todayBoard')
          MNUtil.log("✅ 今日看板视图切换成功")
        } catch (switchError) {
          MNUtil.log("❌ 切换今日看板视图失败: " + switchError.message)
          MNUtil.showHUD("切换今日看板失败")
          taskUtils.addErrorLog(switchError, "切换今日看板视图")
        }
      } else {
        MNUtil.log("⏳ viewManager 尚未初始化，延迟切换")
        // 延迟执行，等待 viewManager 初始化
        MNUtil.delay(0.1).then(() => {
          if (this.settingController && this.settingController.viewManager) {
            try {
              this.settingController.viewManager.switchTo('todayBoard')
              MNUtil.log("✅ 延迟切换今日看板视图成功")
            } catch (delaySwitchError) {
              MNUtil.log("❌ 延迟切换今日看板视图失败: " + delaySwitchError.message)
              taskUtils.addErrorLog(delaySwitchError, "延迟切换今日看板视图")
            }
          } else {
            MNUtil.log("❌ 延迟后 viewManager 仍不存在")
            MNUtil.showHUD("今日看板初始化失败，请重试")
          }
        }).catch((delayError) => {
          MNUtil.log("❌ 延迟执行失败: " + delayError.message)
          taskUtils.addErrorLog(delayError, "延迟执行")
        })
      }
    } catch (error) {
      MNUtil.log("❌ openTodayBoard 发生严重错误: " + error.message)
      MNUtil.showHUD("打开今日看板时发生错误")
      taskUtils.addErrorLog(error, "openTodayBoard")
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
  
  /**
   * 同步任务数据到 WebView
   * @this {MNTaskClass}
   */
  MNTaskClass.prototype.syncTasksToWebView = async function() {
    try {
      MNUtil.log("🔄 开始同步任务数据到 WebView")
      
      // 确保设置控制器存在
      if (!this.settingController) {
        MNUtil.log("❌ 设置控制器不存在")
        return
      }
      
      // 获取所有看板绑定
      const boards = {
        target: taskConfig.getBoardNoteId('target'),
        project: taskConfig.getBoardNoteId('project'),
        action: taskConfig.getBoardNoteId('action'),
        completed: taskConfig.getBoardNoteId('completed'),
        today: taskConfig.getBoardNoteId('today')
      }
      
      MNUtil.log(`📋 看板绑定状态: ${JSON.stringify(boards)}`)
      
      // 提取每个看板的任务数据
      const allTasks = {}
      
      for (const [boardKey, boardNoteId] of Object.entries(boards)) {
        if (boardNoteId) {
          try {
            allTasks[boardKey] = await TaskDataExtractor.extractTasksFromBoard(boardNoteId)
            MNUtil.log(`✅ ${boardKey} 看板提取了 ${allTasks[boardKey].length} 个任务`)
          } catch (error) {
            MNUtil.log(`❌ 提取 ${boardKey} 看板任务失败: ${error.message}`)
            allTasks[boardKey] = []
          }
        } else {
          allTasks[boardKey] = []
        }
      }
      
      // 传递给 WebView
      const script = `
        (function() {
          if (typeof window.TaskSync !== 'undefined' && window.TaskSync.receiveTasks) {
            window.TaskSync.receiveTasks(${JSON.stringify(allTasks)});
            return 'success';
          } else {
            return 'TaskSync not ready';
          }
        })()
      `
      
      const result = await this.settingController.runJavaScriptInWebView(script)
      MNUtil.log(`📡 数据同步结果: ${result}`)
      
    } catch (error) {
      taskUtils.addErrorLog(error, "syncTasksToWebView")
      MNUtil.log(`❌ 同步任务数据失败: ${error.message}`)
    }
  }
  
  /**
   * 处理来自 WebView 的任务更新
   * @param {Object} taskData - 任务数据
   * @this {MNTaskClass}
   */
  MNTaskClass.prototype.updateTaskFromWebView = function(taskData) {
    try {
      MNUtil.log(`📝 收到 WebView 的任务更新: ${taskData.id}`)
      
      MNUtil.undoGrouping(() => {
        const note = MNNote.new(taskData.id)
        if (!note) {
          MNUtil.log(`❌ 任务卡片不存在: ${taskData.id}`)
          return
        }
        
        // 更新标题（如果改变了）
        if (taskData.titleContent !== undefined || taskData.titlePath !== undefined || 
            taskData.status !== undefined || taskData.type !== undefined) {
          
          // 构建新标题
          const typeMap = {
            'action': '动作',
            'project': '项目',
            'target': '目标',
            'keyresult': '关键结果'
          }
          const type = typeMap[taskData.type] || taskData.type
          const newTitle = `【${type} >> ${taskData.titlePath}｜${taskData.status}】${taskData.titleContent}`
          note.noteTitle = newTitle
          MNUtil.log(`✅ 更新标题: ${newTitle}`)
        }
        
        // 更新描述字段
        if (taskData.description !== undefined) {
          // 查找并更新第一个纯文本评论
          let descriptionUpdated = false
          for (let i = 0; i < note.comments.length; i++) {
            const comment = note.comments[i]
            if (!comment.text.includes('<span') && !comment.text.includes('[') && 
                i > 0) { // 跳过标题
              note.removeCommentByIndex(i)
              note.insertCommentAtIndex(taskData.description, i)
              descriptionUpdated = true
              break
            }
          }
          
          // 如果没有找到描述评论，在标题后添加
          if (!descriptionUpdated && taskData.description) {
            note.insertCommentAtIndex(taskData.description, 1)
          }
          MNUtil.log(`✅ 更新描述: ${taskData.description}`)
        }
        
        // 添加新进展
        if (taskData.newProgress) {
          MNTaskManager.addProgress(note, taskData.newProgress)
          MNUtil.log(`✅ 添加进展: ${taskData.newProgress}`)
        }
      })
      
      MNUtil.showHUD("✅ 任务已更新")
      
    } catch (error) {
      taskUtils.addErrorLog(error, "updateTaskFromWebView")
      MNUtil.log(`❌ 更新任务失败: ${error.message}`)
      MNUtil.showHUD("❌ 更新失败")
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
  return MNTaskClass;
};