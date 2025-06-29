
JSB.newAddon = function (mainPath) {
// try {
  

  JSB.require('utils')
  if (!chatAIUtils.checkMNUtilsFolder(mainPath)) { return undefined }
  JSB.require('webviewController');
  JSB.require('notificationController')
  JSB.require('dynamicController')
  JSB.require('sideOutputController')
  JSB.require('jsonrepair')
  // JSB.require('parse5-browser')
  // chatAIConfig.remove("MNChatglm_builtInKeys")
// } catch (error) {
//   Application.sharedInstance().showHUD(error, Application.sharedInstance().focusWindow, 2)
//   return undefined
// }
  /** @return {MNChatglmClass} */
  const getMNChatglmClass = ()=>self  
    // NSUserDefaults.standardUserDefaults().removeObjectForKey("MNChatglm_config")
    // NSUserDefaults.standardUserDefaults().removeObjectForKey("MNChatglm_promptNames")
    // NSUserDefaults.standardUserDefaults().removeObjectForKey('MNChatglm_currentPrompt');
    // NSUserDefaults.standardUserDefaults().removeObjectForKey('MNChatglm_fileId');
    // NSUserDefaults.standardUserDefaults().removeObjectForKey('MNChatglm_usage');
    // NSUserDefaults.standardUserDefaults().removeObjectForKey('MNChatglm_dynamicPrompt');
    // NSUserDefaults.standardUserDefaults().removeObjectForKey('MNChatglm_knowledge');
    // NSUserDefaults.standardUserDefaults().removeObjectForKey('MNChatglm_builtInKeys');
    // NSUserDefaults.standardUserDefaults().removeObjectForKey('MNChatglm_prompts');

  var MNChatglmClass = JSB.defineClass(
    'MNChatglm : JSExtension',
    { /* Instance members */
      sceneWillConnect: async function () { //Window initialize
        if (!(await chatAIUtils.checkMNUtil(true))) return
      try {
        let self = getMNChatglmClass()
        self.init(mainPath)
        self.isNewWindow = false;
        self.textProcessed = false;
        self.dateGetText = Date.now();
        self.dateNow = Date.now();
        self.rect = '{{0, 0}, {10, 10}}';
        self.arrow = 1;
        self.isFirst = true;
        self.linkDetected = false
        self.addObserver('onPopupMenuOnSelection:', 'PopupMenuOnSelection')
        self.addObserver('onPopupMenuOnNote:', 'PopupMenuOnNote')
        self.addObserver('onClosePopupMenuOnNote:', 'ClosePopupMenuOnNote')
        self.addObserver('onClosePopupMenuOnSelection:', 'ClosePopupMenuOnSelection')
        self.addObserver('onProcessNewExcerpt:', 'ProcessNewExcerpt')
        self.addObserver('onChatOnNote:', 'chatOnNote')
        self.addObserver('onChatOnQuestion:', 'chatOnQuestion')
        self.addObserver('onCustomChat:', 'customChat')
        self.addObserver('onOpenFloat:', 'chatAIOpenFloat')
        self.addObserver('onInsertChatModeReference:', 'insertChatModeReference')
        self.addObserver('onDynamicModelChanged:', 'dynamicModelChanged')
        self.addObserver('onDefaultModelChanged:', 'defaultModelChanged')
        self.addObserver('onAddonBroadcast:', 'AddonBroadcast');
        self.addObserver('onCloudConfigChange:', 'NSUbiquitousKeyValueStoreDidChangeExternallyNotificationUI')
        // self.addObserver('onKeyboardWillShowNotification:', "UIResponderKeyboardWillShowNotification")
        self.addObserver('onKeyboardWillShowNotification:', "UIResponderKeyboardWillChangeFrameNotification")
        self.addObserver('onKeyboardWillShowNotification:', "keyboardWillChangeFrameNotification")
        } catch (error) {
          chatAIUtils.addErrorLog(error, "sceneWillConnect")
      }
      },

      sceneDidDisconnect: function () { // Window disconnect 在插件页面关闭插件和删除插件
        if (typeof MNUtil === 'undefined') return
        let self = getMNChatglmClass()
        let names = [
          'PopupMenuOnSelection','PopupMenuOnNote','ClosePopupMenuOnNote', 'ClosePopupMenuOnSelection','ProcessNewExcerpt','chatOnNote','chatOnQuestion','customChat','chatAIOpenFloat','NSUbiquitousKeyValueStoreDidChangeExternallyNotificationUI'
        ]
        self.removeObservers(names)
      },

      sceneWillResignActive: function () { // Window resign active
      },

      sceneDidBecomeActive: function () { // Window become active
      },

      notebookWillOpen: async function (notebookid) {
        if (!(await chatAIUtils.checkMNUtil(true,0.1))) return
      try {
        let self = getMNChatglmClass()
        self.init(mainPath)
        chatAIUtils.forceToRefresh = true
        chatAIUtils.ensureChatAIController()
        chatAIUtils.ensureNotifyController()
        MNUtil.refreshAddonCommands()
        MNUtil.delay(1).then(()=>{
          if (chatAIConfig.autoImport(true)) {
            chatAIConfig.import(false)
          }
          // //每次打开学习集都自动刷新一次模型
          let today = chatAIUtils.getToday()
          if (!chatAIConfig.modelConfig.refreshDay || today !== chatAIConfig.modelConfig.refreshDay) {
            chatAINetwork.fetchModelConfig().then((res)=>{
              res.refreshDay = today
              if (res && "Github" in res && !MNUtil.deepEqual(res,chatAIConfig.modelConfig, ["refreshDay"])) {
                chatAIConfig.modelConfig = res
                chatAIConfig.modelConfig.refreshDay = today
                chatAIConfig.save("MNChatglm_modelConfig")
                MNUtil.showHUD("模型已更新")
              }else{
                chatAIConfig.modelConfig.refreshDay = today
                chatAIConfig.save("MNChatglm_modelConfig")
              }
            })
          }
          MNUtil.studyView.becomeFirstResponder()
        })
      } catch (error) {
        chatAIUtils.addErrorLog(error, "notebookWillOpen")
      }
      },
      notebookWillClose: function (notebookid) {
        if (typeof MNUtil === 'undefined') return
        if (chatAIUtils.notifyController.connection) {
          chatAIUtils.notifyController.connection.cancel()
          delete chatAIUtils.notifyController.connection
        }



        // removeObservers(self,['PopupMenuOnSelection','ClosePopupMenuOnSelection','PopupMenuOnNote','ClosePopupMenuOnNote'])
      },

      documentDidOpen: function (docmd5) {
      },

      documentWillClose: function (docmd5) {
      },

      controllerWillLayoutSubviews: function (controller) {
        // MNUtil.showHUD("controllerWillLayoutSubviews")
        if (typeof MNUtil === 'undefined') return
        if (controller !== MNUtil.studyController) {
          return;
        };
        let studyFrame = MNUtil.studyView.bounds
        let windowFrame = MNUtil.currentWindow.bounds
        // if (MNNote.getFocusNotes().length > 1) {
        //   MNUtil.showHUD("Multiple notes selected")
        // }
        if (!chatAIUtils.chatController.view.hidden) {
          let currentFrame = chatAIUtils.chatController.currentFrame
          currentFrame.x = MNUtil.constrain(currentFrame.x, 0, studyFrame.width-currentFrame.width)
          currentFrame.y = MNUtil.constrain(currentFrame.y, 0, studyFrame.height-20)
          chatAIUtils.chatController.view.frame = currentFrame
          chatAIUtils.chatController.currentFrame = currentFrame
        }
        if (!chatAIUtils.notifyController.view.hidden && !chatAIUtils.notifyController.onAnimate) {
          let currentFrame = chatAIUtils.notifyController.currentFrame
          currentFrame.height = Math.min(currentFrame.height,windowFrame.height - currentFrame.y)
          currentFrame.y = chatAIUtils.getY()
          currentFrame.x = chatAIUtils.getX()
          chatAIUtils.notifyController.currentFrame = currentFrame
          chatAIUtils.notifyController.view.frame = currentFrame
          
        }
        if (chatAIUtils.isMN4() && MNExtensionPanel.on && chatAIUtils.sideOutputController) {
          chatAIUtils.sideOutputController.view.frame = {x:0,y:0,width:MNExtensionPanel.width,height:MNExtensionPanel.height}
          chatAIUtils.sideOutputController.chatView.frame = {x:0,y:0,width:MNExtensionPanel.width,height:MNExtensionPanel.height}
        }
        if (chatAIUtils.dynamicController && !chatAIUtils.dynamicController.view.hidden && !chatAIUtils.dynamicController.onAnimate) {
          // let lastFrame = chatAIUtils.dynamicController.lastFrame
          // lastFrame.x = MNUtil.constrain(lastFrame.x, 0, studyFrame.width-300)
          // lastFrame.y = MNUtil.constrain(lastFrame.y, 0, studyFrame.height-200)
          chatAIUtils.dynamicController.view.setNeedsLayout()

        }
      },

      queryAddonCommandStatus: function () {
        if (!chatAIUtils.checkLogo()) {return null}
        chatAIUtils.ensureChatAIController()
        chatAIUtils.ensureNotifyController()
        chatAIUtils.notifyController.checkTheme(true)
        return {
          image: 'logo.png',
          object: self,
          selector: 'toggleAddon:',
          checked: chatAIConfig.config.autoAction
        };
      },
      onPopupMenuOnSelection: async function (sender) { // Selecting text on pdf or epub
        if (typeof MNUtil === 'undefined') return
        let self = getMNChatglmClass()
        try {
          

        if (!chatAIUtils.checkSender(sender, self.window)) return; // Don't process message from other window
        chatAIUtils.currentSelection = sender.userInfo.documentController.selectionText;
        if (chatAIUtils.isMN4() && chatAIUtils.sideOutputController && chatAIUtils.sideOutputController.userInput) {
          chatAIUtils.sideOutputController.userInput.endEditing(true)
        }
        // if (chatAIUtils.dynamicController) {
        //   // chatAIUtils.dynamicController.promptInput.endEditing(true)
        //   chatAIUtils.dynamicController.promptInput.resignFirstResponder()
        // }
        self.dateGetText = Date.now();
        self.textProcessed = false
        self.onPopupMenuOnSelectionTime = Date.now()
        let studyFrame = MNUtil.studyView.frame
        let winFrame = MNUtil.parseWinRect(sender.userInfo.winRect)
        let xOffset = sender.userInfo.arrow===1 ? 20: -80
        let yOffset = sender.userInfo.arrow===1 ? -60: -30
        winFrame.x = winFrame.x+xOffset-studyFrame.x
        winFrame.y = winFrame.y+yOffset
        if (winFrame.x < 0) {
          winFrame.x = 0
        }
        if (winFrame.x > studyFrame.width-40) {
          winFrame.x = studyFrame.width-40
        }
        let dynamicFrame = MNUtil.genFrame(winFrame.x, winFrame.y, 40, 40)
        await self.checkDynamicController(dynamicFrame)
        // if (!MNUtil.isDescendantOfStudyView(chatAIUtils.dynamicController.view)) {
        //   MNUtil.studyView.addSubview(chatAIUtils.dynamicController.view)
        // }
        chatAIUtils.ensureView(chatAIUtils.dynamicController.view)
        if (chatAIConfig.config.dynamic) {
          chatAIUtils.dynamicController.view.hidden = false
        }
        chatAIUtils.notifyController.notShow = false
        chatAIUtils.currentNoteId = undefined
        if (!self.checkShouldProceed(chatAIUtils.currentSelection,-1,"onSelection")) {
          // MNUtil.showHUD("should prevent")
          return
        }
        chatAIUtils.notifyController.noteid = undefined
        chatAIUtils.chatController.askWithDelay()
        if (self.viewTimer) self.viewTimer.invalidate();
      } catch (error) {
          chatAIUtils.addErrorLog(error, "onPopupMenuOnSelection")
      }
      },
      onClosePopupMenuOnSelection: async function (sender) {
        if (typeof MNUtil === 'undefined') return
        let self = getMNChatglmClass()
        // MNUtil.showHUD("message")
        if (!MNUtil.checkSender(sender,self.window)) return;// Don't process message from other window
        chatAIUtils.onClosePopupMenuOnSelectionTime = Date.now()
        await MNUtil.delay(0.1)
        if (!chatAIUtils.dynamicController.view.hidden && (chatAIUtils.onClosePopupMenuOnSelectionTime>chatAIUtils.onPopupMenuOnSelectionTime+300) && (chatAIUtils.onClosePopupMenuOnSelectionTime>chatAIUtils.onPopupMenuOnNoteTime+300) && !chatAIUtils.dynamicController.onClick) {
          MNUtil.animate(()=>{
            chatAIUils.dynamicController.view.layer.opacity = 0
          },0.1).then(()=>{
            chatAIUtils.dynamicController.view.layer.opacity = 1
            chatAIUtils.dynamicController.view.hidden = true
          })
          // await MNUtil.delay(0.2)
          // if ((chatAIUtils.onClosePopupMenuOnSelectionTime>chatAIUtils.onPopupMenuOnSelectionTime+300) && (chatAIUtils.onClosePopupMenuOnSelectionTime>chatAIUtils.onPopupMenuOnNoteTime+300) && !chatAIUtils.dynamicController.onClick) {
          // }
          // let preOpacity = chatAIUtils.dynamicController.view.layer.opacity
          // MNUtil.animate(()=>{
          //   chatAIUtils.dynamicController.view.layer.opacity = 0
          // },0.1).then(()=>{
          //   chatAIUtils.dynamicController.view.layer.opacity = preOpacity
          //   chatAIUtils.dynamicController.view.hidden = true
          // })
          return
        }
      },
      /**
       * 
       * @param {{userInfo:{noteid:String}}} sender 
       * @returns 
       */
      onProcessNewExcerpt: async function (sender) {
        if (typeof MNUtil === 'undefined') return
        let self = getMNChatglmClass()
        if (!MNUtil.checkSender(sender)) return; // Don't process message from other window
      try {
        let note = MNNote.new(sender.userInfo.noteid)
        let currentNoteId = sender.userInfo.noteid
        self.notShow = false
        // if (note.excerptPic) {
        //   return
        // }
        // let comments = note.comments
        // copyJSON(comments)
        let text = await chatAIUtils.getTextForSearch(note)
        chatAIUtils.currentNoteId = currentNoteId
        chatAIUtils.currentSelection = text
        self.dateGetText = Date.now();
        self.textProcessed = false


        if (self.viewTimer) self.viewTimer.invalidate();
        if (!self.checkShouldProceed(chatAIUtils.currentSelection,note.colorIndex,"onNewExcerpt")) {
          return
        }
        if (chatAIConfig.getConfig("newExcerptTagDetection")) {
          // let tags = note.tags
          // MNUtil.copyJSON(tags)
          // let tags = chatAIUtils.extractTagsFromNote(note).map(tag=>tag.slice(1))
          let promptKeys = chatAIConfig.config.promptNames
          let promptNames = promptKeys.map(key=>chatAIConfig.prompts[key].title)
          let commonPrompts = chatAIUtils.findCommonElements(note.tags, promptNames)
          if (commonPrompts.length) {
            let firstPrompt = commonPrompts[0]
            note.removeCommentByIndex(0)
            let promptKey = chatAIUtils.findKeyByTitle(chatAIConfig.prompts, firstPrompt)
            chatAIUtils.notifyController.noteid = currentNoteId
            chatAIUtils.chatController.askWithDelay(promptKey)
          }
          return
        }
        chatAIUtils.notifyController.noteid = currentNoteId
        chatAIUtils.chatController.askWithDelay()
      } catch (error) {
        MNUtil.showHUD("Error in onProcessNewExcerpt:"+error)
      }
      },
      onPopupMenuOnNote: async function (sender) { // Clicking note
        if (typeof MNUtil === 'undefined') return
        let self = getMNChatglmClass()
        if (!chatAIUtils.checkSender(sender, self.window)) return; // Don't process message from other window
        let note = MNNote.new(sender.userInfo.note.noteId)
        let currentNoteId = note.noteId
        chatAIUtils.onPopupMenuOnNoteTime = Date.now()
        if (chatAIUtils.isMN4() && chatAIUtils.sideOutputController && chatAIUtils.sideOutputController.userInput) {
          chatAIUtils.sideOutputController.userInput.endEditing(true)
        }
        // if (chatAIUtils.dynamicController) {
        //   chatAIUtils.dynamicController.view.becomeFirstResponder()
        //   // chatAIUtils.dynamicController.promptInput.endEditing(true)
        //   // chatAIUtils.dynamicController.promptInput.resignFirstResponder()
        //   // MNUtil.studyView.becomeFirstResponder()
        // }
      try {
        let studyFrame = MNUtil.studyView.frame
        let winFrame = MNUtil.parseWinRect(sender.userInfo.winRect)
        let yOffset = -25
        let xOffset = winFrame.width+1
        if (winFrame.width===10) {
          //1是菜单在下方出现,2是菜单在上方出现
          xOffset = sender.userInfo.arrow===1 ? 20: -80
          yOffset = sender.userInfo.arrow===1 ? -60: -30
          // if (sender.userInfo.arrow===1) {
          //   yOffset = 60
          //   xOffset = 30
          // }else{
          //   yOffset = 15
          //   xOffset = -65
          // }
                // let xOffset = sender.userInfo.arrow===1 ? 20: -50
        // let yOffset = sender.userInfo.arrow===1 ? -50: -40
        }
        // let xOffset = winFrame.width===10?winFrame.width+20:winFrame.width
        let dynamicFrame = MNUtil.genFrame(winFrame.x+xOffset-studyFrame.x, winFrame.y+yOffset, 40, 40)
        if (dynamicFrame.y < 10) {
          dynamicFrame.y = 10
        }
        if (dynamicFrame.x > studyFrame.width-72) {
          dynamicFrame.x = studyFrame.width-72
        }
        // return
        await self.checkDynamicController(dynamicFrame)
        chatAIUtils.ensureView(chatAIUtils.dynamicController.view)
        // if (!MNUtil.isDescendantOfStudyView(chatAIUtils.dynamicController.view)) {
        //   MNUtil.studyView.addSubview(chatAIUtils.dynamicController.view)
        // }
        if (chatAIConfig.config.dynamic) {
          chatAIUtils.dynamicController.view.hidden = false
        }

        chatAIUtils.notifyController.notShow = false
        chatAIUtils.currentNoteId = currentNoteId
        // showHUD(currentNoteId)

        let text = await chatAIUtils.getTextForSearch(note)
        chatAIUtils.currentSelection = text
        if (!text) {
          return
        }
        self.dateGetText = Date.now();
        self.textProcessed = false
        if (self.viewTimer) self.viewTimer.invalidate();
        // MNUtil.showHUD("message")
        if (!self.checkShouldProceed(chatAIUtils.currentSelection,note.colorIndex+16,"onNote")) {
          return
        }
        self.currentTime = Date.now()
        chatAIUtils.notifyController.noteid = sender.userInfo.note.noteId
        let question = await chatAIUtils.chatController.getQuestion()
        let sameQuestion = false
        if (self.lastQuestion) {
          sameQuestion = (JSON.stringify(question) === JSON.stringify(self.lastQuestion))
        }
        if (!chatAIUtils.notifyController.view.hidden && sameQuestion) {
          return
        }
        self.lastQuestion = await chatAIUtils.chatController.askWithDelay()
      } catch (error) {
        MNUtil.showHUD("Error in onPopupMenuOnNote: "+error)
      }
      },
      onClosePopupMenuOnNote: async function (sender) {
        if (typeof MNUtil === 'undefined') return
        let self = getMNChatglmClass()
        if (!chatAIUtils.checkSender(sender, self.window)) return; // Don't process message from other window
        if (chatAIUtils.currentNoteId === sender.userInfo.noteid && Date.now()-self.dateGetText < 500) {
          chatAIUtils.notifyController.notShow = true
        }

        chatAIUtils.onClosePopupMenuOnNoteTime = Date.now()
        if (chatAIUtils.currentNoteId === sender.userInfo.noteid && Date.now()-chatAIUtils.onPopupMenuOnNoteTime < 500) {
          self.notShow = true
        }
        await MNUtil.delay(0.1)
        // if (chatAIUtils.currentNoteId !== MNNote.getFocusNote()?.noteId) {
        //   chatAIUtils.currentNoteId = MNNote.getFocusNote()?.noteId
        // }
        if (chatAIUtils.onClosePopupMenuOnNoteTime>chatAIUtils.onPopupMenuOnNoteTime+300 && !chatAIUtils.dynamicController.onClick) {
          MNUtil.animate(()=>{
            chatAIUtils.dynamicController.view.layer.opacity = 0
          },0.1).then(()=>{
            chatAIUtils.dynamicController.view.layer.opacity = 1
            chatAIUtils.dynamicController.view.hidden = true
          })
          return
        }
      },
      onAddonBroadcast: async function (sender) {
      try {
        let message = sender.userInfo.message
        // MNUtil.copy(message)
        if (/mnchatai\?/.test(message)) {
          let arguments = message.match(/(?<=mnchatai\?).*/)[0].split("&")
          let config = {}
          arguments.forEach((arg)=>{
            let kv = arg.split("=")
            switch (kv[0]) {
              case "user":
              case "prompt":
                config[kv[0]] = decodeURIComponent(kv[1])
                break;
              default:
                config[kv[0]] = kv[1]
                break;
            }
          })
          // MNUtil.copy(config)
          if (!("action" in config)) {
            MNUtil.showHUD("Missing argument: action")
            return
          }
          // MNUtil.copy(config)
          let currentNoteId = MNNote.getFocusNote()?.noteId
          if (config.action === "ask") {
            let dynamicFrame = MNUtil.genFrame(0, 0, 40, 40)
            // await self.checkDynamicController(dynamicFrame)
            // chatAIUtils.ensureView(chatAIUtils.dynamicController.view)
      //marginnote4app://addon/mnchatai?action=ask&user={query}
      //marginnote4app://addon/mnchatai?action=ask&user={query}&mode=vision
      //marginnote4app://addon/mnchatai?action=ask&user={query}&mode=ocr
            let user = config.user
            if ("mode" in config) {
              if (config.mode === "vision") {
                let imageDatas
                let system
                if (currentNoteId) {
                  imageDatas = chatAIUtils.getImagesFromNote(MNNote.new(currentNoteId))
                  system = chatAIConfig.dynamicPrompt.note
                }else{
                  imageDatas = [MNUtil.getDocImage(true,true)]
                  system = chatAIConfig.dynamicPrompt.text
                }
                if (system.trim()) {
                  let systemMessage = await chatAIUtils.getTextVarInfo(system,user)
                  let question = [{role:"system",content:systemMessage},chatAIUtils.genUserMessage(user, imageDatas)]
                  // MNUtil.copy(question)
                  chatAIUtils.notifyController.askByVision(question)
                  return
                }
                let question = chatAIUtils.genUserMessage(user, imageDatas)
                chatAIUtils.notifyController.askByVision(question)
                return
              }
              if (config.mode === "ocr") {
                if (MNUtil.currentSelection.onSelection || !currentNoteId) {
                  chatAIUtils.notifyController.askWithDynamicPromptOnText(user,true)
                }else{
                  chatAIUtils.notifyController.askWithDynamicPromptOnNote(currentNoteId,user,true)
                }
                return
              }
            }
            if (MNUtil.currentSelection.onSelection || !currentNoteId) {
              chatAIUtils.notifyController.askWithDynamicPromptOnText(user)
            }else{
              chatAIUtils.notifyController.askWithDynamicPromptOnNote(currentNoteId,user)
            }
            return
          }
          if(config.action === "executeprompt"){
            //marginnote4app://addon/mnchatai?action=executeprompt&prompt={query}
            //对于query，需要匹配promptNames中的promptName,首先进行全匹配,寻找Prompt名与query相同的Prompt
            //如果找到,则执行Prompt
            //如果未找到,则进行模糊匹配,寻找Prompt名与query最接近的Prompt
            //优先寻找以query开头的Prompt
            //如果仍未找到,则进行模糊匹配
            let prompt = config.prompt
            let promptKeys = chatAIConfig.config.promptNames
            let promptNames = promptKeys.map(key=>chatAIConfig.prompts[key].title)
            let similarPrompts = chatAIUtils.findSimilarPrompts(prompt, promptNames)
            if (similarPrompts.length) {
              let firstPrompt = similarPrompts[0]
              let promptKey = chatAIUtils.findKeyByTitle(chatAIConfig.prompts, firstPrompt)
              chatAIUtils.notifyController.noteid = currentNoteId
              chatAIUtils.chatController.askWithDelay(promptKey)
            }else{
              MNUtil.showHUD('No matching prompt found: '+prompt)
            }
            return
          }
          if (config.action === "opensetting") {
            //marginnote4app://addon/mnchatai?action=opensetting
            if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
            let chatController = chatAIUtils.chatController
            if (chatController.view.hidden) {
              if (chatController.isFirst) {
                // Application.sharedInstance().showHUD("first",self.window,2)
                chatController.isFirst = false;
                let width = 330
                let height = 465
                chatController.view.frame = {x:MNUtil.studyWidth*0.5-width*0.5,y:MNUtil.studyHeight*0.5-height*0.5,width:width,height:height}
                chatController.currentFrame = chatController.view.frame
              }
              chatController.show()
            } else {
              chatController.hide()
              return;
            }
            NSTimer.scheduledTimerWithTimeInterval(0.2, false, function () {
              MNUtil.studyView.becomeFirstResponder(); // For dismiss keyboard on iOS
            });
            if (!chatController.view.window) return;
            if (self.viewTimer) self.viewTimer.invalidate();
            return
          }
          if (config.action === "togglesidebar") {
            //marginnote4app://addon/mnchatai?action=togglesidebar
            if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
            if (chatAIUtils.isMN3()) {
              MNUtil.showHUD("Only available in MN4")
              return
            }
            if (!chatAIUtils.sideOutputController) {
              try {
                chatAIUtils.sideOutputController = sideOutputController.new();
                MNUtil.toggleExtensionPanel()
                MNExtensionPanel.show()
                MNExtensionPanel.addSubview("chatAISideOutputView", chatAIUtils.sideOutputController.view)
                let panelView = MNExtensionPanel.view
                chatAIUtils.sideOutputController.view.hidden = false
                chatAIUtils.sideOutputController.view.frame = {x:0,y:0,width:panelView.frame.width,height:panelView.frame.height}
                chatAIUtils.sideOutputController.currentFrame = {x:0,y:0,width:panelView.frame.width,height:panelView.frame.height}
                // MNUtil.toggleExtensionPanel()
              } catch (error) {
                chatAIUtils.addErrorLog(error, "openSideBar")
              }
            }else{
              if (MNExtensionPanel.on) {
                MNExtensionPanel.toggle()
              }else{
                MNExtensionPanel.show("chatAISideOutputView")
              }
            }
            chatAIUtils.sideOutputController.openChatView(false)
            return
          }

          MNUtil.showHUD('Unsupported action: '+config.action)
        }
      } catch (error) {
        chatAIUtils.addErrorLog(error, "onAddonBroadcast")
      }
      },
      onChatOnNote: async function (sender) { // Clicking note
        if (typeof MNUtil === 'undefined') return
        let self = getMNChatglmClass()
        if (!chatAIUtils.checkCouldAsk()) {
          return
        }
  // if (!self.response) {
  //   self.response = ""
  // }
  // self.response = self.response+"time:"+Date.now()
  // copy(self.response)
        if (self.window!==chatAIUtils.focusWindow) {
          return
        }
        if (chatAIUtils.notifyController.onChat) {
          return
        }
      try {
        chatAIUtils.notifyController.notShow = false
        chatAIUtils.notifyController.called = true
        let currentNoteId = sender.userInfo.noteid
        let note = MNNote.new(currentNoteId)
        chatAIUtils.currentNoteId = currentNoteId
        let text = await chatAIUtils.getTextForSearch(note)
        if (!text) {
          return
        }
        chatAIUtils.currentSelection = text
        self.dateGetText = Date.now();
        self.textProcessed = false
        if (self.viewTimer) self.viewTimer.invalidate();
        if (!chatAIUtils.chatController.view.window) return;
        // self.currentTime = Date.now()
        chatAIUtils.notifyController.noteid = note.noteId
        chatAIUtils.notifyController.notifyLoc = chatAIUtils.chatController.notifyLoc
        chatAIUtils.chatController.ask()
      } catch (error) {
        MNUtil.showHUD(error)
      }
      },
      onCustomChat: async function (sender) {
        if (typeof MNUtil === 'undefined') return
        if (self.window!==chatAIUtils.focusWindow) {
          return
        }
        if (!chatAIUtils.checkCouldAsk()) {
          return
        }
        // chatAIUtils.copyJSON(sender.userInfo)
        if (sender.userInfo.prompt) {
          let prompt = sender.userInfo.prompt
          let promptKeys = chatAIConfig.config.promptNames
          let promptNames = promptKeys.map(key=>chatAIConfig.prompts[key].title)
          let similarPrompts = chatAIUtils.findSimilarPrompts(prompt, promptNames)
          if (similarPrompts.length) {
            let firstPrompt = similarPrompts[0]
            let promptKey = chatAIUtils.findKeyByTitle(chatAIConfig.prompts, firstPrompt)
            chatAIUtils.notifyController.noteid = chatAIUtils.currentNoteId
            chatAIUtils.chatController.ask(promptKey)
          }
          return
        }else if(sender.userInfo.user){
          let contextMessage = await chatAIUtils.render(sender.userInfo.user,{})
          let question = [{role:"user",content:contextMessage}]
          if (sender.userInfo.system) {
            let systemMessage = await chatAIUtils.render(sender.userInfo.system,{})
            question.unshift({role:"system",content:systemMessage})
          }
          chatAIUtils.notifyController.customAsk(question)
        }else{
          chatAIUtils.notifyController.noteid = chatAIUtils.currentNoteId
          chatAIUtils.notifyController.text = chatAIUtils.currentSelection
          chatAIUtils.chatController.ask()
        }
      },
      onDefaultModelChanged: function (sender) {
        if (typeof MNUtil === 'undefined') return
        let modelConfig = sender.userInfo
        // MNUtil.showHUD("Default model changed to: "+modelConfig.source)
        let settingController = chatAIUtils.chatController
        if (settingController && !settingController.view.hidden) {
          settingController.sourceButton.setTitleForState("Source: "+modelConfig.source,0)
          // MNButton.setTitle(chatAIUtils.chatController.sourceButton, "Source: "+chatAIConfig.config.source,14,true)
          settingController.setModel(sender.userInfo.source)
          settingController.setModelButton(sender.userInfo.source)
          let allSources = chatAIConfig.allSource(true)
          let sourceIndex = allSources.indexOf(modelConfig.source)
          for (let i = 0; i < allSources.length; i++) {
            let buttonName = "scrollSourceButton"+i
            if (i === sourceIndex) {
              MNButton.setConfig(settingController[buttonName], {color:"#2c70de"})
            }else{
              MNButton.setConfig(settingController[buttonName], {color:"#9bb2d6"})
            }
            settingController[buttonName].titleLabel.font = UIFont.boldSystemFontOfSize(17)
          }
        }
      },
      onDynamicModelChanged: function (sender) {
        if (typeof MNUtil === 'undefined') return
        let dynamicController = chatAIUtils.dynamicController
        if (dynamicController && !dynamicController.view.hidden && !dynamicController.miniMode()) {
          let modelConfig = sender.userInfo
          // MNUtil.showHUD("Dynamic model changed to: "+modelConfig.source)
          if (modelConfig.source === "Built-in") {
            MNButton.setTitle(dynamicController.modelButton, "Built-in",14,true)
          }else{
            MNButton.setTitle(dynamicController.modelButton, modelConfig.model,14,true)
          }
        }
      },
      onInsertChatModeReference: function (sender) {
        if (typeof MNUtil === 'undefined') return
        if (self.window!==chatAIUtils.focusWindow) {
          return
        }
        if (chatAIUtils.isMN3()) {
          MNUtil.showHUD("Only available in MN4")
          return
        }
        if (!chatAIUtils.sideOutputController) {
          try {
            chatAIUtils.sideOutputController = sideOutputController.new();
            MNUtil.toggleExtensionPanel()
            MNExtensionPanel.show()
            MNExtensionPanel.addSubview("chatAISideOutputView", chatAIUtils.sideOutputController.view)
            let panelView = MNExtensionPanel.view
            chatAIUtils.sideOutputController.view.hidden = false
            chatAIUtils.sideOutputController.view.frame = {x:0,y:0,width:panelView.frame.width,height:panelView.frame.height}
            chatAIUtils.sideOutputController.currentFrame = {x:0,y:0,width:panelView.frame.width,height:panelView.frame.height}
            // MNUtil.toggleExtensionPanel()
          } catch (error) {
            chatAIUtils.addErrorLog(error, "onInsertChatModeReference")
          }
        }else{
          MNExtensionPanel.show("chatAISideOutputView")
        }

        let contents = sender.userInfo.contents
        let method = sender.userInfo.method ?? "append"
        if (method === "append") {
          chatAIUtils.sideOutputController.addToInput(contents[0].content)
          return
        }
        if (method === "replace") {
          chatAIUtils.sideOutputController.replaceInput(contents[0].content)
          return
        }
      },
      onChatOnQuestion: function (sender) { // Clicking note
        if (typeof MNUtil === 'undefined') return
        if (self.window!==chatAIUtils.focusWindow) {
          return
        }
      try {
        let self = getMNChatglmClass()
        chatAIUtils.notifyController.notShow = false
        chatAIUtils.notifyController.called = true
        let question = sender.userInfo.question
        chatAIUtils.currentNoteId = undefined
        chatAIUtils.currentSelection = ""
        self.dateGetText = Date.now();
        self.textProcessed = false
        // Application.sharedInstance().showHUD(sender.userInfo.note,self.window,2)
        if (self.viewTimer) self.viewTimer.invalidate();
        if (!chatAIUtils.chatController.view.window) return;
        // self.currentTime = Date.now()
        chatAIUtils.notifyController.noteid = undefined
        if (sender.userInfo.model) {
          chatAIConfig.config.currentModel = sender.userInfo.model
        }else{
          chatAIConfig.config.currentModel = chatAIConfig.config.model
        }
        if (/{{knowledge}}/.test(question)) {
          let knowledge = chatAIConfig.knowledge
          if (knowledge && knowledge.trim() != "") {
            question = question.replace('{{knowledge}}',`
以及部分参考翻译
'''
${knowledge}
'''`)
          }else{
            question = question.replace('{{knowledge}}',``)
          }
        }
        chatAIUtils.notifyController.ask(question,chatAIConfig.currentPrompt)
      } catch (error) {
        chatAIUtils.addErrorLog(error, "onChatOnQuestion")
      }
      },
      onCloudConfigChange: async function (sender) {
        let self = getMNChatglmClass()
        if (typeof MNUtil === 'undefined') return
        if (self.window !== MNUtil.currentWindow) {
          return
        }
        if (!chatAIUtils.checkSubscribe(false,false,true)) {
          return
        }
        let iCloudSync = chatAIConfig.getConfig("syncSource") === "iCloud"
        if(!iCloudSync || !chatAIConfig.autoImport(true)){
          return
        }

        // self.ensureView()
        self.checkUpdate()
      },
      onOpenFloat: async function (sender) {
        if (typeof MNUtil === 'undefined') return
        if (self.window!==chatAIUtils.focusWindow) {
          return
        }
        try {
          // MNUtil.copyJSON(sender.userInfo.beginFrame)
          let beginFrame = sender.userInfo.beginFrame
          if (!chatAIUtils.dynamicController) {
            chatAIUtils.initDynamicController()
            chatAIUtils.dynamicController.mainPath = mainPath;
            chatAIUtils.dynamicController.firstFrame = beginFrame
            chatAIUtils.dynamicController.view.hidden  = true
            chatAIUtils.dynamicController.view.layer.opacity = 0
          }
          chatAIUtils.dynamicController.lastFrame = beginFrame
          chatAIUtils.ensureView(chatAIUtils.dynamicController.view)
          chatAIUtils.refreshCurrent()
          chatAIUtils.dynamicController.openInput()
        } catch (error) {
          chatAIUtils.addErrorLog(error, "onOpenFloat")
        }
        // MNUtil.showHUD("Float Window")

      },
      
      onKeyboardWillShowNotification: async function (notification) {
        MNUtil.showHUD("KeyboardWillShowNotification")
      },
      syncConfig :async function (params) {
        if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
        chatAIConfig.sync()
      },
      openFloat: async function (beginFrame) {
        if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
        try {
        if (!chatAIUtils.dynamicController) {
          chatAIUtils.initDynamicController()
          chatAIUtils.dynamicController.mainPath = mainPath;
          chatAIUtils.dynamicController.firstFrame = beginFrame
          chatAIUtils.dynamicController.view.hidden  = true
          chatAIUtils.dynamicController.view.layer.opacity = 0
        }
        chatAIUtils.dynamicController.lastFrame = beginFrame
        chatAIUtils.ensureView(chatAIUtils.dynamicController.view)
        chatAIUtils.refreshCurrent()
        chatAIUtils.dynamicController.openInput()
        } catch (error) {
          chatAIUtils.addErrorLog(error, "openFloat")
        }
      },
      openSetting:function (params) {
        if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
        if (chatAIUtils.chatController.view.hidden) {
          if (chatAIUtils.chatController.isFirst) {
            // Application.sharedInstance().showHUD("first",self.window,2)
            let buttonFrame = chatAIUtils.addonBar.frame
            let width = 330
            if (buttonFrame.x <120) {
              chatAIUtils.chatController.view.frame = {x:buttonFrame.x+45,y:buttonFrame.y,width:width,height:465}
            }else{
              chatAIUtils.chatController.view.frame = {x:buttonFrame.x-width-5,y:buttonFrame.y,width:width,height:465}
            }
            chatAIUtils.chatController.currentFrame = chatAIUtils.chatController.view.frame
            chatAIUtils.chatController.isFirst = false;
          }
          chatAIUtils.chatController.show(chatAIUtils.addonBar.frame)
        } else {
          chatAIUtils.chatController.hide(chatAIUtils.addonBar.frame)
          return;
        }
        NSTimer.scheduledTimerWithTimeInterval(0.2, false, function () {
          MNUtil.studyView.becomeFirstResponder(); // For dismiss keyboard on iOS
        });
        if (!chatAIUtils.chatController.view.window) return;
        if (self.viewTimer) self.viewTimer.invalidate();
      },
      executePrompt: async function (promptKey) {
        if (typeof MNUtil === 'undefined') return
        if (self.window!==chatAIUtils.focusWindow) {
          return
        }
        if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
        try {
          let selection = MNUtil.currentSelection
          if (selection.onSelection) {
            chatAIUtils.notifyController.text = selection.text
            chatAIUtils.notifyController.noteid = undefined
          }else{
            chatAIUtils.notifyController.noteid = chatAIUtils.getFocusNote()?.noteId
          }

          chatAIUtils.chatController.ask(promptKey)
        } catch (error) {
          chatAIUtils.addErrorLog(error, "executePrompt")
        }
      },
      toggleTrigger: async function (params) {
        if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
        let trigger = !chatAIConfig.config.autoAction
        MNUtil.showHUD(trigger?"✅  Enable trigger":"❌  Disable trigger")
        chatAIConfig.config.autoAction = trigger
        chatAIConfig.save('MNChatglm_config')
        MNUtil.refreshAddonCommands()
      },
      openSideBar: async function (params) {
        if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
        if (chatAIUtils.isMN3()) {
          MNUtil.showHUD("Only available in MN4")
          return
        }
        if (!chatAIUtils.sideOutputController) {
          try {
            chatAIUtils.sideOutputController = sideOutputController.new();
            MNUtil.toggleExtensionPanel()
            MNExtensionPanel.show()
            MNExtensionPanel.addSubview("chatAISideOutputView", chatAIUtils.sideOutputController.view)
            let panelView = MNExtensionPanel.view
            chatAIUtils.sideOutputController.view.hidden = false
            chatAIUtils.sideOutputController.view.frame = {x:0,y:0,width:panelView.frame.width,height:panelView.frame.height}
            chatAIUtils.sideOutputController.currentFrame = {x:0,y:0,width:panelView.frame.width,height:panelView.frame.height}
            // MNUtil.toggleExtensionPanel()
          } catch (error) {
            chatAIUtils.addErrorLog(error, "openSideBar")
          }
        }else{
          MNExtensionPanel.show("chatAISideOutputView")
        }
        chatAIUtils.sideOutputController.openChatView(false)
      },
      toggleWindowLocation: function (origionalLoc) {
        if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
        try {
        if (origionalLoc === 1) {
          chatAIConfig.config.notifyLoc = 0
          if (chatAIUtils.chatController.windowLocationButton) {
            chatAIUtils.chatController.windowLocationButton.setTitleForState("Notification: Left",0)
          }
        }
        if (origionalLoc === 0) {
          chatAIConfig.config.notifyLoc = 1
          if (chatAIUtils.chatController.windowLocationButton) {
            chatAIUtils.chatController.windowLocationButton.setTitleForState("Notification: Right",0)
          }
        }
        chatAIConfig.save("MNChatglm_config")
        if (!chatAIUtils.notifyController.view.hidden) {
          chatAIUtils.notifyController.show(chatAIConfig.config.notifyLoc,false,true)
        }
        } catch (error) {
          chatAIUtils.addErrorLog(error, "toggleWindowLocation")
        }
      },
      toggleAddon: async function (button) {
        let self = getMNChatglmClass()
        // MNUtil.copy(1)
        // return
//         try {
          
//           let args = {
//   "query": "ENSO对气候影响",
//   "searchPhrases": [
//     "ENSO .AND. 气候影响",
//     "厄尔尼诺 .OR. 南方涛动 .AND. 气候",
//     "ENSO .AND. 降水 .OR. 温度",
//     "ENSO循环 .AND. 全球气候",
//     "厄尔尼诺现象 .AND. 气候变化",
//     "拉尼娜 .AND. 气候"
//   ],
//   "searchRange": "allNotebooks"
// }
// let tool = chatAITool.getToolByName("searchNotes")
// let res = await tool.execute({id:"test",function:{arguments:args}})
// // MNUtil.copy(res)


//         // let note = MNNote.getFocusNote()
//         // MNUtil.copy(note.allNoteText())
// // let tocNotes = chatAIUtils.getDocTocNotes()
// // if (tocNotes) {
  
// // let tocs = tocNotes.map(note=>{
// //   return {
// //     title:note.noteTitle,
// //     page:note.note.startPage
// //   }
// // })
// // MNUtil.copy(tocs)
// // }else{

// //     MNUtil.showHUD("No toc notes")
// // }
//         } catch (error) {
//           chatAIUtils.addErrorLog(error, "toggleAddon")
//         }
//         return
        // try {
          

        // let beginTime = Date.now()
        // let searchTexts = ["ENSO","TC"]
        // let noteInfo = await chatAIUtils.searchInAllStudySets(searchTexts)
        // // let noteInfo = await chatAIUtils.searchInCurrentStudySets(searchTexts)
        // // let noteInfo = await chatAIConfig.getCachedNotesInAllStudySets()
        // let noteStrings = noteInfo.map(note=>{
        //   let text = ""
        //   if (note.title) {
        //     text += "# "+note.title+"\n"
        //   }
        //   if (note.content) {
        //     text += chatAIUtils.replaceBase64ImagesWithTemplate(note.content)+"\n"
        //   }
        //   if (note.comments && note.comments.length > 0) {
        //     note.comments.forEach(comment=>{
        //       text += comment+"\n"
        //     })
        //   }
        //   return text
        // })
        // let query = "Relationship between ENSO and TC"
        // let res = await chatAINetwork.rerank(noteStrings,query)
        // let relativeNotes = res.map(item=>{
        //   return noteInfo[item.index]
        // })
        // MNUtil.stopHUD()
        // MNUtil.copy(relativeNotes)
        // let endTime = Date.now()
        // // MNUtil.copy("allNotes.length: "+allNotes.length)
        // // MNUtil.copy("targetNotes.length: "+targetNotes.length)
        // MNUtil.showHUD(noteInfo.length+" notes, time: "+(endTime-beginTime)/1000+"s")
        // } catch (error) {
        //   chatAIUtils.addErrorLog(error, "toggleAddon")
        // }
        // return
    
        if (!chatAIUtils.addonBar) {
          chatAIUtils.addonBar = button.superview.superview
        }
        // MNUtil.mindmapView.setZoomScaleAnimated(1.,true)
        if (!chatAIUtils.addonButton) {
          chatAIUtils.addonButton = button
        }
        let buttonFrame = chatAIUtils.addonButton.convertRectToView(chatAIUtils.addonButton.bounds,MNUtil.studyView);
        let beginFrame
        if (buttonFrame.x <120) {
          beginFrame = MNUtil.genFrame(buttonFrame.x+40, buttonFrame.y, 40, 40)
        }else{
          beginFrame = MNUtil.genFrame(buttonFrame.x-300, buttonFrame.y, 40, 40)
        }
        var commandTable = [
          {title:'⚙️   Setting',object:self,selector:'openSetting:',param:[1,2,3]},
          {title:'🤖   Float Window',object:self,selector:'openFloat:',param:beginFrame},
          {title:'💬   Chat Mode',object:self,selector:'openSideBar:',param:[1,3,2]},
          {title:'🔄   Manual Sync',object:self,selector:'syncConfig:',param:[1,2,3]},
          {title:'↔️   Location: '+(chatAIConfig.config.notifyLoc?"Right":"Left"),object:self,selector:"toggleWindowLocation:",param:chatAIConfig.config.notifyLoc}
        ];
        let trigger = chatAIConfig.getConfig("autoAction") ? "✅":"❌"
        commandTable.push({title:trigger+'   Trigger',object:self,selector:'toggleTrigger:',param:[1,2,3]})
    let promptKeys = chatAIConfig.config.promptNames
    if (promptKeys.length > 5) {
      promptKeys = promptKeys.slice(0,5)
    }
    let promptTable = promptKeys.map(key=>{
      return {title:"🚀   "+chatAIConfig.prompts[key].title,object:self,selector:'executePrompt:',param:key}
    })
    commandTable = commandTable.concat(promptTable)
    if (chatAIUtils.addonBar.frame.x < 100) {
      self.popoverController = chatAIUtils.getPopoverAndPresent(button,commandTable,200,4)
    }else{
      self.popoverController = chatAIUtils.getPopoverAndPresent(button,commandTable,200,0)
    }
    return
      },
    },
    { /* Class members */
      addonDidConnect: function () {
      },

      addonWillDisconnect: async function () {// Window disconnect 在插件页面关闭插件和删除插件
        if (typeof MNUtil === 'undefined') return
        // MNUtil.copy("addonWillDisconnect")
        // try {
        let confirm = await MNUtil.confirm("MN ChatAI\nRemove all config?", "是否删除所有配置？")
        if (confirm) {
          MNUtil.showHUD("[MN ChatAI] Remove config",5)
          chatAIConfig.remove("MNChatglm_prompts")
          chatAIConfig.remove("MNChatglm_knowledge")
          chatAIConfig.remove("MNChatglm_config")
          chatAIConfig.remove("MNChatglm_fileId")
          chatAIConfig.remove("MNChatglm_dynamicPrompt")
          chatAIConfig.remove("MNChatglm_builtInKeys")
        }
        // } catch (error) {
        //   showHUD(error)
        // }
      },

      applicationWillEnterForeground: function () {
        if (chatAIConfig.autoImport(true)) {
          chatAIConfig.import(false)
        }
        // if (chatAIUtils.chatController && !chatAIUtils.chatController.view.hidden) {
        //   let studyFrame = MNUtil.studyView.bounds
        //   let currentFrame = chatAIUtils.chatController.currentFrame
        //   if (!currentFrame) {
        //     return
        //   }
        //   if (currentFrame.x+currentFrame.width*0.5 >= studyFrame.width) {
        //     currentFrame.x = studyFrame.width-currentFrame.width*0.5              
        //   }
        //   if (currentFrame.y >= studyFrame.height) {
        //     currentFrame.y = studyFrame.height-20              
        //   }
        //   chatAIUtils.chatController.view.frame = currentFrame
        //   chatAIUtils.chatController.currentFrame = currentFrame
        // }
      },

      applicationDidEnterBackground: function () {
        // MNUtil.copy("back")
      },

      applicationDidReceiveLocalNotification: function (notify) {
      }
    }
  );
  /**
   * 
   * @param {string} selector 
   * @param {string} name 
   * @this {MNChatglmClass}
   * @returns 
   */
  MNChatglmClass.prototype.addObserver = function (selector,name) {
    NSNotificationCenter.defaultCenter().addObserverSelectorName(this, selector, name);
  }
  /**
   * 
   * @param {string[]} names
   * @this {MNChatglmClass}
   * @returns 
   */
  MNChatglmClass.prototype.removeObservers = function (names) {
    names.forEach(name=>{
      NSNotificationCenter.defaultCenter().removeObserverName(self, name);
    })
  }
  MNChatglmClass.prototype.checkShouldProceed = function (text,colorIndex = -1, param = "") {
    if (!chatAIUtils.chatController.view.window || !chatAIConfig.config.autoAction) {
      // MNUtil.showHUD("message1")
      return false;
    }
    if (param !== "" && !chatAIConfig.config[param]) {
      // MNUtil.showHUD("message2")
      return false
    }
    //聊天模式下禁用
    if (chatAIUtils.notifyController.onChat) {
      // MNUtil.showHUD("message3")
      return false
    }
    if (!chatAIUtils.chatController.view.hidden) {
      //网页模式下不会使用API模式
      // MNUtil.showHUD("message4")
      return false
    }
    //如果提供了颜色则根据颜色判断
    if (colorIndex !== -1 && !chatAIConfig.getConfig("colorConfig")[colorIndex]) {
      // showHUD("should prevent")
      // MNUtil.showHUD("message5")
      return false
    }
    if (chatAIConfig.config.ignoreShortText && chatAIUtils.countWords(text) < 10) {
      // MNUtil.showHUD("message"+chatAIUtils.countWords(text))
      // MNUtil.copy(text)
      return false
    }
    return true
  }
  /**
   * 
   * @param {*} dynamicFrame 
   * @this {MNChatglmClass}
   * @returns 
   */
  MNChatglmClass.prototype.checkDynamicController = async function (dynamicFrame,fullWindow = false,animate = true) {
    if (!chatAIUtils.dynamicController) {
      chatAIUtils.initDynamicController()
      chatAIUtils.dynamicController.mainPath = mainPath;
      chatAIUtils.dynamicController.firstFrame = dynamicFrame
      chatAIUtils.dynamicController.view.hidden  = true
    }
    if (!chatAIConfig.config.dynamic) {
      chatAIUtils.dynamicController.view.hidden = true
      return
    }

    if (chatAIUtils.dynamicController.pinned) {
      chatAIUtils.dynamicController.view.hidden = false
      return
    }
    // if (chatAIUtils.dynamicController.view.hidden) {
    //   chatAIUtils.dynamicController.view.layer.opacity = 0
    //   chatAIUtils.dynamicController.view.hidden = false
    //   chatAIUtils.dynamicController.setLayout(dynamicFrame)
    // }
    chatAIUtils.dynamicController.onClick = false
    return new Promise((resolve, reject) => {
      chatAIUtils.dynamicController.setLayout(dynamicFrame).then(()=>{
        chatAIUtils.dynamicController.view.hidden = false
        if (fullWindow) {
          chatAIUtils.dynamicController.openInput()
          chatAIUtils.dynamicController.pinned = true
        }
        resolve()
      })
    })
  }
  MNChatglmClass.prototype.init = function(mainPath){ 
  try {
    if (!this.initialized) {
      chatAIUtils.init(mainPath)
      chatAIConfig.init(mainPath)
      this.initialized = true
    }
    chatAIConfig.checkCloudStore()
  } catch (error) {
    chatAIUtils.addErrorLog(error, "init")
  }  
  }
  MNChatglmClass.prototype.checkUpdate = async function () {
    let success = chatAIConfig.readCloudConfig(false)
    if (success) {
      self.chatController.refreshLastSyncTime()
    }
  }
  return MNChatglmClass;
};