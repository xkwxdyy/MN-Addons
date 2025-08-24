/** @return {notificationController} */
const getNotificationController = ()=>self
var notificationController = JSB.defineClass('notificationController : UIViewController <NSURLConnectionDelegate,UIWebViewDelegate>', {
  viewDidLoad: function() {
try {
    let self = getNotificationController()
    self.init()
    self.custom = false;
    self.size = []
    self.onreceive = false
    self.funcResponse = ""
    self.response = ''
    self.dynamic = true;
    self.shouldCopy = false
    self.shouldComment = false
    self.selectedText = '';
    self.searchedText = '';
    self.isLoading = false;
    self.toolbarOn = true;
    self.view.frame = {x:chatAIUtils.getX(),y:chatAIUtils.getY(),width:chatAIUtils.getWidth(),height:120}
    self.lastFrame = self.view.frame;
    // self.currentFrame = self.view.frame
    self.history = []
    self.hasRenderSearchResults = false
    self.selection = {
      text:"",
      time:0
    }
    self.tem = []
    self.title = "main"
    self.preResponse = ""
    self.moveDate = Date.now()
    self.notifyLoc = chatAIConfig.config.notifyLoc
    self.color = [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true]
    self.view.layer.shadowOffset = {width: 0, height: 0};
    self.view.layer.shadowRadius = 15;
    self.view.layer.shadowOpacity = 0.5;
    self.view.layer.shadowColor = UIColor.colorWithWhiteAlpha(0.5, 1);
    self.view.layer.cornerRadius = 11
    self.view.layer.opacity = 1.0
    self.view.layer.borderColor = MNUtil.hexColorAlpha("#9bb2d6",0.8)
    self.view.layer.borderWidth = 0
    self.view.backgroundColor = MNUtil.hexColorAlpha("#ffffff",0.)
    self.view.autoresizingMask = (1 << 0 | 1 << 3);

    self.createButton("toolbar",undefined,"view")
    self.toolbar.backgroundColor = MNUtil.hexColorAlpha("#727f94",0.0)

    // self.createButton("screenButton","changeScreen:","toolbar")
    self.createButton("screenButton","closeButtonTapped:","toolbar")
    self.screenButton.setImageForState(chatAIConfig.closeImage,0)
    self.screenButton.backgroundColor = MNUtil.hexColorAlpha("#e06c75",0.8)
    // MNUtil.copy(actionImages)
    self.createButton("bigbangButton","executeCustomButton:","toolbar")
    self.bigbangButton.action = "button1"
    MNButton.addLongPressGesture(self.bigbangButton, self,"onLongPress:")

    self.createButton("commentButton","executeCustomButton:","toolbar")
    self.commentButton.action = "button2"
    MNButton.addLongPressGesture(self.commentButton, self,"onLongPress:")

    self.createButton("titleButton","executeCustomButton:","toolbar")
    self.titleButton.action = "button3"
    MNButton.addLongPressGesture(self.titleButton, self,"onLongPress:")

    self.createButton("copyButton","executeCustomButton:","toolbar")
    self.copyButton.action = "button4"
    MNButton.addLongPressGesture(self.copyButton, self,"onLongPress:")

    self.createButton("excerptButton","executeCustomButton:","toolbar")
    self.excerptButton.action = "button5"
    MNButton.addLongPressGesture(self.excerptButton, self,"onLongPress:")

    self.createButton("childButton","executeCustomButton:","toolbar")
    self.childButton.action = "button6"
    MNButton.addLongPressGesture(self.childButton, self,"onLongPress:")


    self.createButton("promptButton","changePrompts:","toolbar")
    self.promptButton.setTitleForState("关键词",0)
    self.promptButton.titleLabel.font = UIFont.boldSystemFontOfSize(16);

    // self.createButton("locationButton","toggleLocation:","toolbar")
    // self.locationButton.setTitleForState(chatAIConfig.config.notifyLoc?' R ':' L ',0)
    // // self.locationButton.setTitleForState(" R ")
    // self.locationButton.titleLabel.font = UIFont.boldSystemFontOfSize(20);


    // self.createButton("aiLinkButton","showAILink:","toolbar")
    // self.aiLinkButton.setImageForState(self.aiLinkImage,0)



    self.createButton("reloadButton","executeCustomButton:","toolbar")
    self.reloadButton.action = "button7"
    MNButton.addLongPressGesture(self.reloadButton, self,"onLongPress:")
    // self.reloadButton.setImageForState(self.reloadImage,0)

    self.createButton("chatButton","executeCustomButton:","toolbar")
    self.chatButton.action = "button8"
    MNButton.addLongPressGesture(self.chatButton, self,"onLongPress:")
    // self.chatButton.setImageForState(self.chatImage,0)

    self.refreshCustomButton()

    self.createButton("aiButton")
    self.aiButton.setImageForState(self.aiImage,0)
    self.aiButton.backgroundColor = MNUtil.hexColorAlpha("#ffffff",0.8)

    self.resizeGesture = new UIPanGestureRecognizer(self,"onResizeGesture:")
    self.screenButton.addGestureRecognizer(self.resizeGesture)
    self.resizeGesture.view.hidden = false
    self.resizeGesture.addTargetAction(self,"onResizeGesture:")
    self.setNewResponse()
} catch (error) {
    chatAIUtils.addErrorLog(error, "viewDidLoad")
}
  },
  viewWillAppear: function(animated) {
  },
  viewWillDisappear: function(animated) {
  },
  viewWillLayoutSubviews: function() {
  let self = getNotificationController()
    if (self.onAnimate) {
      // MNUtil.showHUD("message")
      return
    }
    let buttonHeight = 30
    // self.view.frame = self.currentFrame
    var viewFrame = self.view.bounds;
    var currentFrame = self.currentFrame
    var height   = viewFrame.height
    self.notifyLoc = chatAIUtils.isIOS()?0:chatAIConfig.config.notifyLoc
    currentFrame.width = chatAIUtils.getWidth()
    currentFrame.x = chatAIUtils.getX()
    currentFrame.y = chatAIUtils.getY()
    // self.view.frame = currentFrame
    self.currentFrame = currentFrame

    if (self.onChat) {
      self.setChatLayout()
    }else{
      viewFrame.width = chatAIUtils.getWidth()
      viewFrame.height = height-35
      self.webviewResponse.frame = viewFrame
      // self.toolbar.frame = MNUtil.genFrame(0, height-30, chatAIUtils.getWidth(),buttonHeight)
      self.setLayout()
    }

  },
  closeButtonTapped:async function (params) {
  try {
    

    let self = getNotificationController()
    if (self.connection) {
      self.connection.cancel()
      delete self.connection
      if (self.func && self.func.length) {
        self.func.map(func=>{
          let funcName = func.function.name
          chatAITool.getToolByName(funcName).clearPreContent()
        })
      }
    }
    await self.hide()
    self.onChat = false
    chatAIConfig.setSyncStatus(false)
    if (self.chatView) {
      self.chatView.hidden = true
    }
    self.webviewResponse.frame = MNUtil.genFrame(0, 0, chatAIUtils.getWidth(), 85)
    self.setNewResponse()
    // chatAIUtils.clearCurrent()
  } catch (error) {
      chatAIUtils.addErrorLog(error, "closeButtonTapped")
  }
  },
  executeCustomButton: async function (button) {
    let self = getNotificationController()
    let config = chatAIConfig.getConfig("customButton")
    if (typeof button === "string") {
      self.executeActionFromButton(button)
    }else{
      if(config[button.action]){
        let action = config[button.action].click
        self.executeActionFromButton(action,button)
        self.checkAutoClose(config[button.action].autoClose)
      }else{
        let defaultConfig = chatAIConfig.defaultConfig.customButton
        let action = defaultConfig[button.action].click
        self.executeActionFromButton(action,button)
        self.checkAutoClose(defaultConfig[button.action].autoClose)
      }
    }

  },
  bigbang:async function () {
    let self = getNotificationController()
    // let text = await self.getWebviewContent()
    let text = await self.getTextForAction()
    if (!self.noteid) {
      MNUtil.postNotification("bigbangText",{text:text})
    }else{
      MNUtil.postNotification("bigbangText",{text:text,noteid:self.noteid,url:chatAIUtils.getUrlByNoteId(self.noteid)})
    }
    self.checkAutoClose()

  },
  addChildNote: async function (button) {
  try {
    let self = getNotificationController()
    let text = await self.getTextForAction()
    let note
    if (self.onChat) {
      note = chatAIUtils.getFocusNote() ?? MNNote.new(self.noteid)
    }else{
      note = MNNote.new(self.noteid) ?? chatAIUtils.getFocusNote()
    }
    if (!note) {
      self.showHUD("Note unavailable")
      return
    }
    let config = {excerptText:text,excerptTextMarkdown:true}
    let focusNote = note.realGroupNoteForTopicId()
    let childNote = focusNote.createChildNote(config)
    // let childNote = chatAIUtils.createChildNote(noteid, config)
    // MNUtil.showHUD("Add child note")
    await MNUtil.delay(0.5)
    childNote.focusInMindMap()
    self.checkAutoClose()
    // chatAIUtils.focusNoteInMindMapById(childNote.noteId)
  } catch (error) {
      chatAIUtils.addErrorLog(error, "addChildNote")
  }
  },
  copy: async function (button) {
  // MNUtil.showHUD("copy")
  // self.runJavaScript(`openEdit();`)
  // return
  try {
    let self = getNotificationController()
    let text = await self.getTextForAction()
    if (!text || !text.trim()) {
      self.showHUD("No text to copy")
    }else{
      MNUtil.copy(text)
      self.showHUD("Copy text")
    }
    self.checkAutoClose()
  } catch (error) {
      chatAIUtils.addErrorLog(error, "copy")
  }
  },

  reAsk:async function (button) {
    let self = getNotificationController()
    // MNUtil.copyJSON(self.config)
    if (self.connection) {
      let confirm = await MNUtil.confirm("On output. Re-ask?", "当前正在输出，是否重新请求？")
      if (confirm) {
        self.connection.cancel()
        delete self.connection
        MNUtil.stopHUD()
      }else{
        return
      }
    }
    if (chatAIUtils.checkSubscribe(false,false)) {
      try {
      let selector = 'setChatModelAndReAsk:'
      let modelName = self.currentModel
      let allModels = chatAIConfig.getAvailableModels()
      let widths = []
      var commandTable = allModels.map(model=>{
        widths.push(chatAIUtils.strCode(model))
        return self.tableItem(model, selector,model,modelName === model)
        // return {title:model,object:self,selector:selector,param:model,checked:modelName === model}
      })
      let position = self.notifyLoc ? 0 : 4
      self.popover(button, commandTable, Math.max(...widths)*9+30,position)
      // self.popoverController = chatAIUtils.getPopoverAndPresent(button,commandTable,Math.max(...widths)*9+30,position)
      // self.popoverController = MNUtil.getPopoverAndPresent(button,commandTable,250)
      } catch (error) {
        chatAIUtils.addErrorLog(error, "changeChatModel")
      }
    }else{
      try {
      self.notShow = false
      self.called = true
      self.response = ""
      self.preFuncResponse = ''
      if (self.currentPrompt === "Dynamic" || self.currentPrompt === "Vision") {
        self.reAskByDynamic(1.0)
      }else{
        self.reAsk(1.0)
      }
      } catch (error) {
        chatAIUtils.addErrorLog(error, "reAsk")
      }
    }

  },
  setNoteTitle: async function(button) {
    let self = getNotificationController()
    let note
    if (self.onChat) {
      note = chatAIUtils.getFocusNote() ?? MNNote.new(self.noteid)
    }else{
      note = MNNote.new(self.noteid) ?? chatAIUtils.getFocusNote()
    }
    if (!note) {
      note = MNNote.fromSelection()
    }
    if (!note) {
      self.showHUD("Note unavailable")
      return
    }
    let text = await self.getTextForAction()
    // let text = await self.getWebviewContent()
    if (button.clickDate && Date.now()-button.clickDate < 500) {
      if (/^".*"$/.test(text)) {
        let length = text.length
        MNUtil.undoGrouping(()=>{
          note.noteTitle = text.slice(1,length-1)
        })
      }
    }else{
      button.clickDate = Date.now()
      MNUtil.undoGrouping(()=>{
        note.noteTitle = text
      })
    }
    self.checkAutoClose()
  },
  setExcerpt: async function (button) {
    let text = await self.getTextForAction()
    // let text = await self.getWebviewContent()
  try {
    let note
    if (self.onChat) {
      note = chatAIUtils.getFocusNote() ?? MNNote.new(self.noteid)
    }else{
      note = MNNote.new(self.noteid) ?? chatAIUtils.getFocusNote()
    }
    if (!note) {
      note = MNNote.fromSelection()
    }
    if (!note) {
      self.showHUD("Note unavailable")
      return
    }
    MNUtil.undoGrouping(()=>{
      note.excerptText = text.trim()
      note.excerptTextMarkdown = true
    })
    self.checkAutoClose()
  } catch (error) {
    chatAIUtils.addErrorLog(error, "setExcerpt")
  }
  },
  onLongPress: async function (gesture) {
    if(gesture.state === 1) {
    try {
      let button = gesture.view
      let config = chatAIConfig.getConfig("customButton")
      if(config[button.action]){
        let action = config[button.action].longPress
        self.executeActionFromButton(action,button)
        self.checkAutoClose(config[button.action].autoClose)
      }else{
        let defaultConfig = chatAIConfig.defaultConfig.customButton
        let action = defaultConfig[button.action].longPress
        self.executeActionFromButton(action,button)
        self.checkAutoClose(defaultConfig[button.action].autoClose)
      }
    } catch (error) {
      chatAIUtils.addErrorLog(error, "onLongPress",button.action)
    }

    }
  },
  setComment: async function (button) {
  // MNUtil.showHUD("message"+MNUtil.studyController.docMapSplitMode)
  let text = await self.getTextForAction()
  let focusNote = chatAIUtils.getFocusNote() ?? MNNote.new(self.noteid)
    // let text = await self.getWebviewContent()

  try {
    if (!focusNote) {
      focusNote = MNNote.fromSelection()
    }
    if (!focusNote) {
      self.showHUD("Note unavailable")
      return
    }
    MNUtil.undoGrouping(()=>{
      focusNote.appendMarkdownComment(text.trim())
    })
    self.checkAutoClose()
  } catch (error) {
      chatAIUtils.addErrorLog(error, "setComment")
  }
  },
  showAILink: async function () {
    if (!self.noteid) {
      self.showHUD("Note unavailable")
    }
    let text = await self.getTextForAction()
    // let text = await self.getWebviewContent()
    MNUtil.postNotification("aiLinkOnText",{text:text,noteid:self.noteid})
    self.checkAutoClose()
  },
  changePrompts: function(sender) {
    let self = getNotificationController();
    // MNUtil.copy(self.originalText)
    self.promptButton.setTitleForState(chatAIConfig.prompts[chatAIConfig.currentPrompt].title ,0)
    var commandTable = chatAIConfig.config.promptNames.map(promptName => {
      return {title:"🚀 "+chatAIConfig.prompts[promptName].title,object:self,selector:'askWithPrompt:',param:promptName,checked:chatAIConfig.currentPrompt===promptName}
    })

    // switch (chatAIConfig.getConfig("notifyLoc")) {
    switch (self.notifyLoc) {
      case 0:
        self.popoverController = MNUtil.getPopoverAndPresent(sender,commandTable,200,4)
        break;
      case 1:
        self.popoverController = MNUtil.getPopoverAndPresent(sender,commandTable,200,0)
        break;
      default:
        break;
    }
  },
  setChatModelAndReAsk:function (chatModel) {
    let self = getNotificationController()
    if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
    if (!chatAIUtils.checkSubscribe(true)) {
      return
    }
    MNUtil.showHUD("ReAsk with model: "+chatModel)
    self.currentModel = chatModel
    let config = chatAIConfig.parseModelConfig(chatModel)
    if (self.config.title) {
      config.title = self.config.title
    }
    if (self.config.func) {
      config.func = self.config.func
    }
    self.config = config
try {
      self.notShow = false
      self.called = true
      self.response = ""
      self.preFuncResponse = ''
      if (self.currentPrompt === "Dynamic" || self.currentPrompt === "Vision") {
        self.reAskByDynamic(1.0)
      }else{
        self.reAsk(1.0)
      }
      } catch (error) {
        chatAIUtils.addErrorLog(error, "reAsk")
      }
  },
  askWithPrompt: async function (prompt) {
    let self = getNotificationController()
    if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
    self.askWithPrompt(prompt)
  },
  onResizeGesture:function (gesture) {
    // MNUtil.showHUD("message")
    // let windowFrameHeight = MNUtil.currentWindow.frame.height
    let maxHeight = chatAIUtils.getHeight()
    self.custom = false;
    // self.dynamic = false;
    let baseframe = gesture.view.frame
    let locationToBrowser = gesture.locationInView(self.view)
    let frame = self.view.frame
    let temX
    let height = locationToBrowser.y+baseframe.height*0.5
    height = MNUtil.constrain(height, 120, maxHeight)
    if (self.notifyLoc === 0) {
      //  Application.sharedInstance().MNUtil.showHUD(`{x:${translation.x},y:${translation.y}}`, self.view.window, 2);
      //  self.view.frame = {x:frame.x,y:frame.y,width:frame.width+translationX,height:frame.height+translationY}
      self.view.frame = {x:chatAIUtils.getX(),y:chatAIUtils.getY(),width:chatAIUtils.getWidth(),height:height}
      self.currentFrame  = self.view.frame
      temX = locationToBrowser.x-frame.width+gesture.view.frame.width*0.5
    }else{
      self.view.frame = {x:MNUtil.currentWindow.frame.width-450,y:chatAIUtils.getY(),width:chatAIUtils.getWidth(),height:height}
      self.currentFrame  = self.view.frame
      temX = locationToBrowser.x-gesture.view.frame.width*0.5
    }
    if (gesture.state === 3 && !chatAIUtils.isIOS()) {
      if (self.notifyLoc === 1 && temX < -200) {
        chatAIConfig.config.notifyLoc = 0
        chatAIConfig.save("MNChatglm_config")
        self.show(chatAIConfig.config.notifyLoc,false,true)
        if (chatAIUtils.chatController.windowLocationButton) {
          chatAIUtils.chatController.windowLocationButton.setTitleForState("Notification: Left",0)
        }
      }
      if (self.notifyLoc === 0 && temX > 200) {
        chatAIConfig.config.notifyLoc = 1
        self.show(chatAIConfig.config.notifyLoc,false,true)
        chatAIConfig.save("MNChatglm_config")
        if (chatAIUtils.chatController.windowLocationButton) {
          chatAIUtils.chatController.windowLocationButton.setTitleForState("Notification: Right",0)
        }
      }
    }
    if (self.onChat) {
      self.chatView.frame = {x:0,y:0,width:chatAIUtils.getWidth(),height:height}
      self.setChatLayout()
    }
  },
  toggleLocation: async function (params) {
    let self = getNotificationController()
    try {
    switch (chatAIConfig.config.notifyLoc) {
      case 1:
        chatAIConfig.config.notifyLoc = 0
        if (self.onChat) {
          self.chatLocation.setTitleForState("Left",0)
          await self.setChatLayout()
        }else{
          // self.locationButton.setTitleForState(" L ",0)
        }
        if (chatAIUtils.chatController.windowLocationButton) {
          chatAIUtils.chatController.windowLocationButton.setTitleForState("Notification: Left",0)
        }
        break;
      case 0:
        chatAIConfig.config.notifyLoc = 1
        if (self.onChat) {
          self.chatLocation.setTitleForState("Right",0)
          await self.setChatLayout()
        }else{
          // self.locationButton.setTitleForState(" R ",0)
        }
        if (chatAIUtils.chatController.windowLocationButton) {
          chatAIUtils.chatController.windowLocationButton.setTitleForState("Notification: Right",0)
        }
        // self.locationButton.setTitleForState(" R ",0)
        break;
      default:
        break;
    }
    self.show(chatAIConfig.config.notifyLoc)
    chatAIConfig.save('MNChatglm_config')
    } catch (error) {
      chatAIUtils.addErrorLog(error, "toggleLocation")
    }
  },
  openChatView: async function (params) {

    let self = getNotificationController()
    if (chatAIUtils.isMN3()) {
      MNUtil.showHUD("Only available in MN4")
      return
    }
    let config = {
      token:self.token,
      history:self.history,
      config:self.config,
      currentModel:self.currentModel,
      preFuncResponse:self.preFuncResponse,
      lastResponse:self.lastResponse,
      funcIndices:self.funcIndices,
      prompt:self.currentPrompt,
      reasoningResponse:self.reasoningResponse
    }
    // MNUtil.copyJSON(config)
    if (!chatAIUtils.sideOutputController) {
      // MNUtil.toggleExtensionPanel()
      MNExtensionPanel.show()
      chatAIUtils.sideOutputController = sideOutputController.new();
      // let panelView = MNExtensionPanel.view
      MNExtensionPanel.addSubview("chatAISideOutputView", chatAIUtils.sideOutputController.view)
      // MNUtil.extensionPanelView.backgroundColor = UIColor.whiteColor()
      chatAIUtils.sideOutputController.view.hidden = false
      chatAIUtils.sideOutputController.view.frame = {x:0,y:0,width:MNExtensionPanel.width,height:MNExtensionPanel.height}
      chatAIUtils.sideOutputController.currentFrame = {x:0,y:0,width:MNExtensionPanel.width,height:MNExtensionPanel.height}
    }else{
      MNExtensionPanel.show("chatAISideOutputView")
    }
    chatAIUtils.sideOutputController.openChatView(config)
    self.hide()
    // return
  },
  /**
   * 
   * @param {UITextView} textview 
   */
  textViewDidBeginEditing:function (textview) {
    // MNUtil.showHUD("begin")
    // self.notifyTimer.invalidate()
  },
  /**
   * 
   * @param {UIWebView} webView 
   */
  webViewDidFinishLoad: function(webView) {
  },
  webViewShouldStartLoadWithRequestNavigationType: function(webView,request,type){
    let requestURL = request.URL().absoluteString()
    // MNUtil.copy(requestURL)
    let config = MNUtil.parseURL(requestURL)
    if (config.scheme === "userselect") {
      switch (config.host) {
        case "choice":
          if ("content" in config.params) {
            let content = config.params.content
            self.waitHUD("💬 Reply: "+content)
            self.continueAsk(content)
          }else if ("linkText" in config.params) {
            let linkText = config.params.linkText
            // let content = config.params.content
            self.waitHUD("💬 Reply: "+linkText)
            self.continueAsk(linkText)
          }else{
            MNUtil.copy(config)
          }
          break;
        case "addnote":
          if ("content" in config.params) {
            let content = config.params.content
            self.userSelectAddNote(content,config.params.format)
            return false
          }else {
            MNUtil.copy(config)
          }
          break;
        case "addcomment":
          if ("content" in config.params) {
            let content = config.params.content.replace(/\\n/g,"\n")
            self.showHUD("➕ Add comment: "+content)
            let note = MNNote.new(self.noteid)??chatAIUtils.getFocusNote()
            MNUtil.undoGrouping(()=>{
              note.appendMarkdownComment(content)
            })
          }else {
            MNUtil.copy(config)
          }
          break;
        case "changeURL":
          self.changeURL()
          return false
        default:
          break;
      }

      return false
    }
    if (/^nativecopy\:\/\//.test(requestURL)) {
      let text = decodeURIComponent(requestURL.split("content=")[1])
      MNUtil.copy(text)
      return false
    }
    if (/^nativehud\:\/\//.test(requestURL)) {
      let text = decodeURIComponent(requestURL.split("content=")[1])
      MNUtil.showHUD(text)
      return false
    }
    if (/^editorselect\:\/\//.test(requestURL)) {
      let text = decodeURIComponent(requestURL.split("content=")[1])
      MNUtil.copy(text)
      return false
    }
    if (/^editorheight\:\/\//.test(requestURL)) {
      
      // MNUtil.log("editorheight")
      let height = decodeURIComponent(requestURL.split("content=")[1])
      // MNUtil.waitHUD("editorheight"+height)  
      // try {
      // MNUtil.log(`${height}:${self.webviewResponse.scrollView.contentSize.height}`)
        
      // } catch (error) {
      //   MNUtil.log(error.message)
      // }
      if ((parseInt(height)+5) === self.sizeHeight) {
        self.onResponse = false
        return false
      }
      self.sizeHeight = parseInt(height)+5
      self.setNotiLayout()
      self.onResponse = false
      // MNUtil.waitHUD("message"+height)  
      // MNUtil.showHUD("height: "+height)
      return false
    }
    if (/^chataction\:\/\/selectText/.test(requestURL)) {
      self.getWebviewSelection().then((res)=>{
        self.selection = {
          text:res,
          time:Date.now()
        }
      })
      return false
    }
    if (/^chataction\:\/\/copyimage/.test(requestURL)) {
      let url = decodeURIComponent(requestURL.split("copyimage=")[1])
      MNUtil.waitHUD("Download image...")
      let data = NSData.dataWithContentsOfURL(NSURL.URLWithString(url))
      // MNUtil.copy(url)
      MNUtil.copyImage(data)
      MNUtil.waitHUD("✅ Image Copied")
      MNUtil.stopHUD(1)
      MNUtil.postNotification("snipasteImage", {imageData:data})
      return false
    }
    if (/^chataction\:\/\/runhtml/.test(requestURL)) {
      let html = decodeURIComponent(requestURL.split("runhtml=")[1])
      MNUtil.postNotification("snipasteHtml", {html:html})
      MNUtil.showHUD("Preview HTML...")
      return false
    }
    if (/^(marginnote\dapp)/.test(requestURL)) {
      let targetNote = MNNote.new(requestURL)
      targetNote.focusInFloatMindMap()
      // MNUtil.openURL(requestURL)
      // Application.sharedInstance().openURL(NSURL.URLWithString(requestURL));
      return false
    }
    if (/^http/.test(requestURL) || /^data\:image\//.test(requestURL)) {
      let beginFrame = self.view.frame
      beginFrame.y = beginFrame.y-39
      beginFrame.height = beginFrame.height+7
      beginFrame.width = beginFrame.width+100
      let endFrame = beginFrame
      let studyFrame = MNUtil.studyView.bounds
      if ((beginFrame.x+beginFrame.width*2-95) < studyFrame.width) {
        endFrame.x = beginFrame.x+beginFrame.width-95
        MNUtil.postNotification("openInBrowser", {url:requestURL,beginFrame:beginFrame,endFrame:endFrame})
        return false
      }
      if ((beginFrame.x-beginFrame.width-5) > 0) {
        endFrame.x = beginFrame.x-beginFrame.width-5
        MNUtil.postNotification("openInBrowser", {url:requestURL,beginFrame:beginFrame,endFrame:endFrame})
        return false
      }
      MNUtil.postNotification("openInBrowser", {url:requestURL})
      return false
    }
    return true;
  },
  /**
   * 
   * @param {NSURLConnection} connection 
   * @param {NSURLResponse} response 
   * @returns 
   */
  connectionDidReceiveResponse: async function (connection,response) {
    let self = getNotificationController()
    self.setButtonOpacity(0.5)
    // self.response = ""
    self.funcResponse = ""
    self.reasoningResponse = ""
    self.originalText = ""
    self.notShow = false
    self.size = []
    // self.token = []
    self.func = undefined
    self.tool = {}
    self.preHeight = 0
    self.autoHide = true
    self.errorLogged = false
    if (!self.onChat) {
      self.sizeHeight = 0
    }
    self.scrollToBottom = false
    self.first = true
    self.onFinish = false
    self.lastRenderTime = []
    self.errorMessage = undefined
    // chatAIUtils.copyJSON(self.token)
    self.statusCode = response.statusCode()
    self.currentData = NSMutableData.new()
    self.hasRenderSearchResults = false
    if (self.statusCode >= 400) {
      MNUtil.stopHUD()
      MNUtil.showHUD("❗"+MNUtil.getStatusCodeDescription(""+self.statusCode))
      MNUtil.log("❗"+MNUtil.getStatusCodeDescription(""+self.statusCode))

      self.errorMessage = {
        message:"❗"+MNUtil.getStatusCodeDescription(""+self.statusCode),
        statusCode: self.statusCode,
        info: self.config
      }
      // MNUtil.stopHUD()
      await MNUtil.delay(0.1)
      MNUtil.copy(self.errorMessage)
      self.showErrorMessage(self.errorMessage)
      // self.setWebviewContentDev({response:`\`\`\`json\n${JSON.stringify(self.errorMessage,null,2)}\n\`\`\``})
      self.response = JSON.stringify(self.errorMessage,undefined,2)
      self.setButtonOpacity(1.0)
      await MNUtil.delay(0.1)
      if (!self.errorLogged) {
        MNUtil.log({
          level:"error",
          source:"MN ChatAI",
          message:"❗"+MNUtil.getStatusCodeDescription(""+self.statusCode),
          detail:self.errorMessage
        })
        self.errorLogged = true
      }

      delete self.connection
      // return
    }
    self.sizeHeight = await self.getWebviewHeight()
    self.setNotiLayout()
    MNUtil.stopHUD()
  },

  connectionDidReceiveData: async function (connection,data) {
    let self = getNotificationController()
    try {
    self.onreceive = true
    self.currentData.appendData(data)
    // self.size.push(self.textString)
    let textString = MNUtil.data2string(data)
    if (self.statusCode >= 400) {
      let contentToShow = "❗["+MNUtil.getStatusCodeDescription(""+self.statusCode)+"]"
      if (MNUtil.isValidJSON(textString)) {
        let res = JSON.parse(textString)
        res.info = self.config
        res.statusCode = self.statusCode
        res.message = contentToShow
        self.errorMessage = res
        MNUtil.copyJSON(res)
        if ("error" in res && "message" in res.error) {
          contentToShow = contentToShow+" "+res.error.message
        }else if ("message" in res) {
          contentToShow = contentToShow+" "+res.message
        }
      }
      MNUtil.showHUD(contentToShow)
      await MNUtil.delay(0.1)
      self.showErrorMessage(self.errorMessage)
      self.response = JSON.stringify(self.errorMessage,undefined,2)
      self.errorLogged = true
      MNUtil.log({
        level:"error",
        source:"MN ChatAI",
        message:contentToShow,
        detail:self.errorMessage
      })
      // self.runJavaScript(`openEdit();`)
      connection.cancel()
      delete self.connection
      return
    }else{
      if (MNUtil.isValidJSON(textString)) {
        let res = JSON.parse(textString)
        if ("base_resp" in res && "status_code" in res.base_resp) {
          MNUtil.copy(res)
          self.errorMessage = res
          await MNUtil.delay(0.1)
          self.showErrorMessage(self.errorMessage)
          // self.setWebviewContentDev({response:`\`\`\` json\n${JSON.stringify(self.errorMessage,undefined,2)}\n\`\`\``})
          // self.runJavaScript(`openEdit();`)
          connection.cancel()
          delete self.connection
          return
        }
      }
    }
    self.hasDone = /^data:\s?\[DONE\]/.test(textString)
    if (!self.hasDone) {
      self.textString = textString
    }else{
      if (/^data\:\s{"base_resp"\:{"status_code"\:\d\d+/.test(textString)) {
        chatAIUtils.addErrorLog(textString, "connectionDidReceiveData")
        return
      }
    }
    self.originalText = MNUtil.data2string(self.currentData)
    } catch (error) {
      if (error.toString() !== "Error: Malformed UTF-8 data") {
        chatAIUtils.addErrorLog(error, "connectionDidReceiveData",self.originalText)
      }
    }
    if (self.onResponse) {
      if (self.hasDone) {
        if (!self.onFinish && self.connection && (self.connection === connection)) {
          self.onFinish = true
          // self.beginTime = Date.now()
          self.prepareFinish()
        }
      }
      // MNUtil.showHUD("reject")
      return
    }
    self.getResponse()
      try {
      if (self.hasDone) {
        if (!self.onFinish && self.connection && (self.connection === connection)) {
          self.onFinish = true
          // self.beginTime = Date.now()
          self.prepareFinish()
        }
      }else{
        // self.setNotiLayout()
      }
      } catch (error) {
        chatAIUtils.addErrorLog(error, "connectionDidReceiveData")
      }
      return
  },
  connectionDidFinishLoading: function (connection) {
    let self = getNotificationController()
    if (!self.onFinish && self.connection && (self.connection === connection)) {
      self.onFinish = true
      self.prepareFinish()
      // MNUtil.showHUD("finish")
      // MNUtil.copy(self.textString)
    }
    MNUtil.stopHUD()
  },
  connectionDidFailWithError: async function (connection,error) {
  try {

    let self = getNotificationController()
    let message = "Network error"
    if (error.localizedDescription) {
      message = error.localizedDescription
    }
    MNUtil.showHUD(message)

    MNUtil.stopHUD()
    self.setButtonOpacity(1.0)
    delete self.connection
    self.errorMessage = {
      message:message,
      info: self.config
    }
    // MNUtil.stopHUD()
    await MNUtil.delay(0.5)
    self.showErrorMessage(self.errorMessage)
    
  } catch (error) {
    chatAIUtils.addErrorLog(error, "connectionDidFailWithError")
  }
  }
});


/**
 * @this {notificationController}
 * @returns 
 */
notificationController.prototype.preCheck = function () {
  if (this.connection) {
    this.showHUD("on output")
    return false
  }
  if (this.notShow && !this.called) {
    MNUtil.copy({notShow:this.notShow,called:this.called})
    // MNUtil.showHUD("not show")
    return false
  }
  // MNUtil.showHUD("preCheck")
  return chatAIUtils.preCheck()
}

/**
 * Base method to initiate an AI request.
 * 
 * This method prepares the AI request by setting up the necessary configurations and initializing the request based on the source model.
 * 
 * @this {notificationController} 
 * @param {string|undefined} question - The question or prompt to be sent to the AI.
 * @param {{key:String,url:String,model:String}} [config=chatAIConfig.getConfigFromSource()] - Configuration object containing API key, URL, and model information.
 * @param {number} [temperature=0.8] - The temperature parameter for the AI model, controlling the randomness of the output.
 * @throws {Error} - Throws an error if there is an issue during the request initialization.
 */
notificationController.prototype.baseAsk = async function(
  question,
  config = chatAIConfig.getConfigFromSource(),  
  temperature=undefined
) {
try {
  // chatAIUtils.copyJSON(config)
  if (question) {
    this.question = question
    this.history = [].concat(question)
  }

  this.config = config
  this.temperature = temperature
  this.funcIndices = config.func ?? []
  this.actions = config.action ?? []
  this.toolbarAction = config.toolbarAction ?? ""
  if (temperature !== undefined) {//优先从函数的参数中获取温度
    this.temperature = temperature
  }else{
    this.temperature = config.temperature ?? 0.8
  }
  this.source = config.source
  let request
  switch (config.source) {
    case "ChatGLM":
    case "KimiChat":
    case "Minimax":
    case "Deepseek":
    case "SiliconFlow":
    case "PPIO":
    case "Github":
    case "Metaso":
    case "Qwen":
    case "ChatGPT":
    case "Subscription":
    case "Custom":
    case "Volcengine":
      request =chatAINetwork.initRequestForChatGPT(this.history,config.key,config.url,config.model,this.temperature,this.funcIndices)
      break;
    case "Gemini":
      request =chatAINetwork.initRequestForGemini(this.history,config.key,config.url,config.model,this.temperature,this.funcIndices)
      break;
    case "Claude":
      request = chatAINetwork.initRequestForClaude(this.history,config.key,config.url,config.model, this.temperature)
      break;
    case "Built-in":
      //对内置模型而言，只能使用选择好的渠道，不能指定模型
      let keyInfo = chatAIConfig.keys["key"+chatAIConfig.getConfig("tunnel")]
      if (!keyInfo || !keyInfo.keys) {
        MNUtil.showHUD("No apikey for built-in mode!")
        return
      }
      // MNUtil.copyJSON(keyInfo)
      let key = chatAIUtils.getRandomElement(keyInfo.keys)
      if (key === "") {
        MNUtil.showHUD("No apikey for built-in mode!")
        return
      }
      if (keyInfo.useSubscriptionURL) {
        let url = subscriptionConfig.getConfig("url")+ "/v1/chat/completions"
        request =chatAINetwork.initRequestForChatGPT(this.history,key, url,keyInfo.model,this.temperature,this.funcIndices)
      }else{
        request =chatAINetwork.initRequestForChatGPT(this.history,key, keyInfo.url,keyInfo.model,this.temperature,this.funcIndices)
      }
      break;
    default:
      MNUtil.showHUD("Unspported source: "+config.source)
      return
  }
  this.sendStreamRequest(request)
  chatAIUtils.lastTime = Date.now()
} catch (error) {
  chatAIUtils.addErrorLog(error, "baseAsk")
}
}

/**
 * @this {notificationController}
 */
notificationController.prototype.askWithDynamicPromptOnText = async function (userInput,ocr) {
  try {
  let dynamicPrompt = chatAIConfig.dynamicPrompt
  let system = dynamicPrompt.text
  let systemMessage = await chatAIUtils.getTextVarInfo(system,userInput,undefined,ocr)
  let question = [{role:"system",content:systemMessage},{role: "user", content: userInput}]
  chatAIUtils.notifyController.askByDynamic(question)
  chatAIUtils.notifyController.currentPrompt = "Dynamic"
  chatAIUtils.notifyController.noteid = undefined
    } catch (error) {
    chatAIUtils.addErrorLog(error, "notificationController.askWithDynamicPromptOnText")
  }
}

/**
 * @this {notificationController}
 */
notificationController.prototype.askWithDynamicPromptOnNote = async function (noteid,userInput,ocr) {
  try {
  let system = chatAIConfig.dynamicPrompt.note
  let systemMessage = await chatAIUtils.getNoteVarInfo(noteid, system,userInput,undefined,ocr)
  // MNUtil.copy(systemMessage)
  if (systemMessage === undefined) {
    return
  }
  let question = [{role:"system",content:systemMessage},{role: "user", content: userInput}]
  this.askByDynamic(question)
  this.currentPrompt = "Dynamic"
  this.noteid = chatAIUtils.currentNoteId
    } catch (error) {
    chatAIUtils.addErrorLog(error, "askWithPromptOnNote")
  }
}

/** 
 * 通知窗口切换prompt时使用
 * @this {notificationController} 
 * @param {String} prompt
 */
notificationController.prototype.askWithPrompt = async function (prompt) {
  try {
    let config = chatAIConfig.getConfigFromPrompt(prompt)
    let question = await chatAIUtils.chatController.getQuestion(prompt)
    if (!question) {
      return
    }
    // copyJSON(config)
    this.baseAsk(question,config)
    this.beginNotification(config.title)
  } catch (error) {
    chatAIUtils.addErrorLog(error, "askWithPrompt")
    throw error;
    
  }
}
/**
 * 
 * @param {string} question 
 * @param {string} promptKey 
 * @param {number} temperature 
 * @this {notificationController}
 */
notificationController.prototype.ask = async function(question,promptKey=this.currentPrompt,temperature=undefined) {
try {
  this.dynamic = false
  this.token = []
  this.func = []
  this.preFuncResponse = ""
  if (MNNote.getFocusNote()) {
    this.noteid = MNNote.getFocusNote().noteId
  }
  // chatAIUtils.cu
  if (!this.preCheck()) {
    // MNUtil.showHUD("message")
    return
  }

  let promptConfig = chatAIConfig.prompts[promptKey]
  if (promptKey) {
    this.currentPrompt = promptKey
    this.currentTitle = promptConfig.title
  }
  await this.beginNotification()
  if ("model" in promptConfig) {
    this.currentModel = promptConfig.model
  }else{
    this.currentModel = "Default"
  }
  let config = chatAIConfig.getConfigFromPrompt(promptKey)
  // MNUtil.copyJSON(config)
  this.baseAsk(question,config,temperature)

} catch (error) {
  chatAIUtils.addErrorLog(error, "ask")
}
  // })
  
};

/**
 * 
 * @param {string} question 
 * @param {string} promptKey 
 * @param {number} temperature 
 * @this {notificationController}
 */
notificationController.prototype.reAsk = async function(temperature=undefined) {
try {
  this.dynamic = false
  this.token = []
  this.func = []
  this.preFuncResponse = ""
  if (!this.preCheck()) {
    return
  }
  let last = this.history.pop()
  while (last.role !== "user") {
    last = this.history.pop()
  }
  await this.beginNotification()
  this.baseAsk(this.question,this.config,temperature)

} catch (error) {
  chatAIUtils.addErrorLog(error, "ask")
}
  // })
  
};

/**
 * 
 * @param {*} question 
 * @param {*} temperature 
 * @param {*} reask 
 * @this {notificationController}
 */
notificationController.prototype.customAsk = async function(question,noteId = undefined) {
try {
  this.noteid = noteId
  this.token = []
  this.func = []
  this.preFuncResponse = ""
  // this.targetTextview = "textviewResponse"
  if (!this.preCheck()) {
    return
  }
  let currentFrame = this.view.frame
  currentFrame.height = 120
  this.view.frame = currentFrame
  this.currentFrame = currentFrame
  await this.beginNotification("Toolbar")
  this.question = question
  this.baseAsk(question)
} catch (error) {
  chatAIUtils.addErrorLog(error, "customAsk")
}
};

/**
 * 
 * @param {*} question 
 * @param {*} temperature 
 * @param {*} reask 
 * @this {notificationController}
 */
notificationController.prototype.askByDynamic = async function(question,temperature=0.8,reask=false) {
try {
  let config = chatAIConfig.getDynmaicConfig()
  let promptModel = chatAIConfig.getConfig("dynamicModel")
  if (promptModel) {
    this.currentModel = promptModel
  }else{
    this.currentModel = "Default"
  }
  // chatAIUtils.copyJSON(question)
  this.dynamic = true
  this.history = []
  this.token = []
  this.preFuncResponse = ""
  this.actions = config.action
  this.toolbarAction = config.toolbarAction ?? ""
  // this.targetTextview = "textviewResponse"
  if (!this.preCheck()) {
    return
  }
  // MNUtil.showHUD("askByDynamic")
  let currentFrame = this.view.frame
  currentFrame.height = 120
  this.view.frame = currentFrame
  this.currentFrame = currentFrame
  this.config = config
  await this.beginNotification("Dynamic")
  // MNUtil.copyJSON(config)
  this.baseAsk(question,config,config.temperature)
} catch (error) {
  chatAIUtils.addErrorLog(error, "askByDynamic")
}
};
/**
 * 
 * @param {*} question 
 * @param {*} temperature 
 * @param {*} reask 
 * @this {notificationController}
 */
notificationController.prototype.reAskByDynamic = async function(temperature=undefined) {
try {
  this.dynamic = true
  this.token = []
  this.preFuncResponse = ""

  // this.targetTextview = "textviewResponse"
  if (!this.preCheck()) {
    return
  }
  let last = this.history.pop()
  while (last.role !== "user") {
    last = this.history.pop()
  }
  let currentFrame = this.view.frame
  currentFrame.height = 120
  this.view.frame = currentFrame
  this.currentFrame = currentFrame
  await this.beginNotification("Dynamic")
  this.baseAsk(this.question,this.config,temperature)
} catch (error) {
  chatAIUtils.addErrorLog(error, "askByDynamic")
}
};
/**
 * 
 * @param {*} question 
 * @param {*} temperature 
 * @param {*} reask 
 * @this {notificationController}
 */
notificationController.prototype.askByVision = async function(question,temperature=0.8,reask=false) {
try {
  let config = chatAIConfig.getDynmaicConfig()
  // chatAIUtils.copyJSON(question)
  this.dynamic = true
  this.history = []
  this.token = []
  this.actions = config.action
  this.toolbarAction = config.toolbarAction ?? ""
  this.preFuncResponse = ""
  // this.targetTextview = "textviewResponse"
  if (!this.preCheck()) {
    return
  }
  let currentFrame = this.view.frame
  currentFrame.height = 120
  this.view.frame = currentFrame
  this.currentFrame = currentFrame
  await this.beginNotification("Vision")
  this.baseAsk(question,config,config.temperature)
} catch (error) {
  chatAIUtils.addErrorLog(error, "askByVision")
}
};
/**
 * 专指聊天模式下
 * @param {array} question 
 * @param {number} temperature 
 * @this {notificationController}
 */
notificationController.prototype.continueAsk = async function(question) {
try {
  this.setNewResponse()
  let config = chatAIConfig.config
  if (this.notShow && !this.called) {
    // MNUtil.showHUD("not show")
    return
  }
  if (this.connection) {
    MNUtil.showHUD("on output")
    return
  }
  let funcIndices
  if (this.dynamic) {
    funcIndices =  chatAIConfig.config.dynamicFunc
  }else{
    funcIndices =  chatAIConfig.prompts[this.currentPrompt].func ? chatAIConfig.prompts[this.currentPrompt].func : []
  }
  this.question = question
  this.apikey = config.apikey
  this.func = []
  if (/{{note:.*}}/.test(question)) {
    let noteId = question.match(/{{note:(.*)}}/)[1]
    // MNUtil.copy(noteId)
    let note = MNNote.new(noteId)
    let stringified = await chatAIUtils.getMDFromNote(note)
    // let cardStructure = {id:noteId,content:chatAIUtils.getMDFromNote(note)}
    // let cardStructure = await chatAIUtils.genCardStructure(noteId)
    // let stringified = chatAIUtils.stringifyCardStructure(cardStructure)
    question = question.replace("{{note:"+noteId+"}}",stringified)
  }
  // if (question.includes("{{card}}")) {
  //   let cardStructure = await chatAIUtils.genCardStructure(chatAIUtils.currentNoteId)
  //   let stringified = chatAIUtils.stringifyCardStructure(cardStructure)
  //   question = question.replace("{{card}}",stringified)
  // }
  // this.history = this.history.concat(question)
  this.history.push({role: "user", content: question})
  // MNUtil.copyJSON(this.history)
  // MNUtil.copyJSON(this.config)
  this.baseAsk(this.history,this.config)
} catch (error) {
  chatAIUtils.addErrorLog(error, "continueAsk")
}
};

/**
 * 
 * @param {*} question 
 * @param {*} temperature 
 * @param {*} reask 
 * @this {notificationController}
 */
notificationController.prototype.continueAfterToolCall = function(temperature=undefined) {
  try {
  let config = this.config
  // let config = chatAIConfig.config
  if (this.notShow && !this.called) {
    // MNUtil.showHUD("not show")
    return
  }
  if (this.connection) {
    MNUtil.showHUD("on output")
    return
  }
  // let funcIndices
  // // config = chatAIConfig.getConfigFromPrompt(this.currentPrompt)
  // if (this.dynamic) {
  //   funcIndices =  chatAIConfig.config.dynamicFunc
  // }else{
  //   funcIndices =  chatAIConfig.prompts[this.currentPrompt].func ? chatAIConfig.prompts[this.currentPrompt].func : []
  // }
  // this.apikey = config.apikey
  // this.func = []
  
  this.baseAsk(undefined,config,temperature)
  } catch (error) {
    chatAIUtils.addErrorLog(error, "continueAfterToolCall")
  }
};
/**
 * @this {notificationController}
 */
notificationController.prototype.prepareFinish = async function () {
  try {
  delete this.connection
  // this.size.push(Date.now())
  this.onFinish = true
  this.scrollToBottom = false
  if (this.statusCode >= 400) {
    // let codeDes = chatAIUtils.getStatusCodeDescription(this.statusCode.toString())
    // if (chatAIUtils.isValidJSON(this.textString)) {
    //   MNUtil.showHUD(codeDes+" | "+this.textString)
    //   MNUtil.copy(codeDes+"\n"+JSON.stringify(JSON.parse(this.textString),null,2)+"\n"+JSON.stringify(this.config))
    // }else{
    //   MNUtil.showHUD(codeDes+" | "+this.textString)
    //   MNUtil.copy(codeDes+"\n"+this.textString+"\n"+JSON.stringify(this.config))
    // }
    this.setNotiLayout()
    this.setButtonOpacity(1.0)
    return
  }else{
    this.getResponse()
  }
  // MNUtil.copy(this.tem)
    if (!this.token.length) {
      this.token = [0]
    }
    if (!this.func || !this.func.length) {
      this.setButtonOpacity(1.0)
    }
    this.finish()
  } catch (error) {
    chatAIUtils.addErrorLog(error, "prepareFinish")
  }
}
/**
 * @this {notificationController}
 */
notificationController.prototype.finish = async function() {
  // this.connection.cancel()
  // MNUtil.copyJSON(this.size)
  let heightOffset = 0
try {
  this.tool = []
  if (this.func && this.func.length && !this.view.hidden) {
    //把得到的func执行一遍并将响应添加到this.tool中
    // MNUtil.copy(this.func)
    // await MNUtil.delay(0.5)
    this.funcResponses = await Promise.all(this.func.map(func=> this.executeFunctionByAI(func)))
    this.funcResponse = this.funcResponses.join("")
    // MNUtil.showHUD("123")
    // this.history.push(chatAIUtils.genAssistantMessage(undefined,this.func))
    if (this.response?.trim()) {
      this.history.push({role:"assistant",content:this.response.trim()})
    }
    this.history.push({role:"assistant",tool_calls:this.func})
    this.tool.map(tool=>{this.history.push(tool)})
    // chatAIUtils.copyJSON(this.history)
    this.preFuncResponse = this.preFuncResponse+this.funcResponse
    this.preResponse = this.response.trim()
    // copy(this.preFuncResponse)
    if (this.func.map(func=>func.function.name).includes("close")) {
      // await this.delay(0.5)
      // MNUtil.showHUD("close")
      await this.hide()
      this.onChat = false
      if (this.chatView) {
        this.chatView.hidden = true
      }
      this.webviewResponse.frame = MNUtil.genFrame(0, 0, chatAIUtils.getWidth(), 85)
    }else{
      // MNUtil.showHUD(this.response)
      this.continueAfterToolCall(this.temperature)
    }
  }else{
    if (this.reasoningResponse && this.reasoningResponse.trim()) {
      this.history.push({role:"assistant",content:this.response,reasoningContent:this.reasoningResponse})
    }else{
      this.history.push({role:"assistant",content:this.response})
    }
    if (!this.response.trim() && !this.tool.length && !this.preFuncResponse && this.statusCode < 400) {
      if (this.history.at(-2).role !== "tool") {
        MNUtil.showHUD("Empty response"+this.history.length)
      }
    }
    // MNUtil.copyJSON(this.history)
    this.funcResponse = ""
    this.lastResponse = this.response.trim()

    MNUtil.log({
      message:this.currentTitle??"notification.aiResponse",
      source:"MN ChatAI",
      detail:this.response
    })
    this.response = ""
    this.preResponse = ""
    this.preFuncResponse = ""
    if (this.actions.length && !this.onChat) {
      await this.executeFinishAction(this.actions,this.lastResponse)
    }
    // MNUtil.log(this.toolbarAction)
    if (this.toolbarAction && this.toolbarAction.trim()) {

      this.executeToolbarAction(this.toolbarAction, this.view)
      // MNUtil.log("Should execute toolbar action: "+this.toolbarAction)
    }
    if (chatAIUtils.dynamicController) {
      MNUtil.studyView.bringSubviewToFront(chatAIUtils.dynamicController.view)
    }
    this.clearCache()
    // chatAIUtils.cache = {}
    // MNUtil.showHUD("message"+MNUtil.isDescendantOfStudyView(this.view))
  }
  this.sizeHeight = await this.getWebviewHeight(true)+heightOffset
  this.setNotiLayout()
  if (this.scrollToBottom) {
    this.scrollBottom()
  }
  this.called = false
  this.onFinish = false
} catch (error) {
  chatAIUtils.addErrorLog(error, "finish",this.textString)
  // MNUtil.copy(this.textString)
}
}

notificationController.prototype.init = function () {
  // /**
  //  * @type {chatglmController}
  //  */
  // let ctr = this
  // MNUtil.showHUD("message")
  this.reloadImage = MNUtil.getImage(chatAIConfig.mainPath + `/reload.png`)
  this.bigbangImage = MNUtil.getImage(chatAIConfig.mainPath + `/bigbang.png`)
  this.copyImage = MNUtil.getImage(chatAIConfig.mainPath + `/copy.png`)
  this.titleImage = MNUtil.getImage(chatAIConfig.mainPath + `/title.png`)
  this.tagImage = MNUtil.getImage(chatAIConfig.mainPath + `/tag.png`)
  this.commentImage = MNUtil.getImage(chatAIConfig.mainPath + `/comment.png`)
  this.aiImage = MNUtil.getImage(chatAIConfig.mainPath + `/ai.png`, 3)
  this.aiLinkImage = MNUtil.getImage(chatAIConfig.mainPath + `/aiLink.png`)
  this.chatImage = MNUtil.getImage(chatAIConfig.mainPath + `/chat.png`)
  this.sendImage = MNUtil.getImage(chatAIConfig.mainPath + `/send.png`)
  this.lockImage = MNUtil.getImage(chatAIConfig.mainPath + `/lock.png`)
  this.unlockImage = MNUtil.getImage(chatAIConfig.mainPath + `/unlock.png`)
  this.excerptImage = MNUtil.getImage(chatAIConfig.mainPath + `/excerpt.png`,2.3)
  this.childImage = MNUtil.getImage(chatAIConfig.mainPath + `/childNote.png`)
  this.brotherImage = MNUtil.getImage(chatAIConfig.mainPath + `/brotherNote.png`)
  this.quoteImage = MNUtil.getImage(chatAIConfig.mainPath + `/quote.png`)
  this.clearImage = MNUtil.getImage(chatAIConfig.mainPath + `/eraser.png`)
  this.mindmapImage = MNUtil.getImage(chatAIConfig.mainPath + `/mindmap.png`)
  this.editorImage = MNUtil.getImage(chatAIConfig.mainPath + `/edit.png`,2.2)
  this.actionImage = MNUtil.getImage(chatAIConfig.mainPath + `/action.png`)
  this.snipasteImage = MNUtil.getImage(chatAIConfig.mainPath + `/snipaste.png`)
  this.menuImage = MNUtil.getImage(chatAIConfig.mainPath + `/menu.png`)
  this.searchImage = MNUtil.getImage(chatAIConfig.mainPath + `/search.png`)

}

/**
 * @this {notificationController}
 */
notificationController.prototype.setNotiLayout = function (forceHeight) {
  let sizeHeight = this.sizeHeight
  if (forceHeight) {
    sizeHeight = forceHeight - 35
  }else{
    if (!sizeHeight) {
      return
    }
    if (MNUtil.appVersion().type == "iPhoneOS") {
      sizeHeight = sizeHeight+40
    }
    sizeHeight = Math.max(sizeHeight,this.webviewResponse.frame.height)
  }

  let currentFrame = this.currentFrame
  let windowHeight = MNUtil.currentWindow.frame.height
  let webviewFrame
  if (sizeHeight+35<120) {
    currentFrame.height = 120
  }else{
    //超出页面大小，需滚动
    if ((currentFrame.y+sizeHeight+30)>windowHeight) {
      this.scrollToBottom = true
      if (MNUtil.appVersion().type == "macOS") {
        currentFrame.height = windowHeight-currentFrame.y-5
      }else{
        currentFrame.height = windowHeight-currentFrame.y-35
      }
      this.autoHide = false
      webviewFrame = MNUtil.genFrame(0, 0, chatAIUtils.getWidth(), currentFrame.height-35)
    }else{
      if (sizeHeight+35 > currentFrame.height) {
        currentFrame.height = sizeHeight+35
      }
      // MNUtil.showHUD('message1')
      // this.size.push({message:'message1',current:currentFrame.height,size:sizeHeight,study:studyHeight})
      webviewFrame = MNUtil.genFrame(0, 0, chatAIUtils.getWidth(), sizeHeight)
    }
  }
  // this.webviewResponse.frame = webviewFrame
  this.onAnimate = true
  currentFrame.x = chatAIUtils.getX()
  currentFrame.y = chatAIUtils.getY()
  if (forceHeight) {
    currentFrame.height = forceHeight
  }
  MNUtil.animate(()=>{
    this.view.frame = currentFrame
    this.currentFrame = currentFrame
    this.webviewResponse.frame = webviewFrame
    this.setLayout()
  },0.1).then(()=>{
    this.onAnimate = false
  })
}
notificationController.prototype.createButton = function (buttonName,targetAction,superview) {
    this[buttonName] = UIButton.buttonWithType(0);
    this[buttonName].autoresizingMask = (1 << 0 | 1 << 3);
    this[buttonName].setTitleColorForState(UIColor.whiteColor(),0);
    this[buttonName].setTitleColorForState(chatAIConfig.highlightColor, 1);
    this[buttonName].backgroundColor = MNUtil.hexColorAlpha("#9bb2d6",0.8)
    this[buttonName].layer.cornerRadius = 8;
    this[buttonName].layer.masksToBounds = true;
    this[buttonName].titleLabel.font = UIFont.systemFontOfSize(16);

    if (targetAction) {
      this[buttonName].addTargetActionForControlEvents(this, targetAction, 1 << 6);
    }
    if (superview) {
      this[superview].addSubview(this[buttonName])
    }else{
      this.view.addSubview(this[buttonName]);
    }
}
/**
 * @this {notificationController}
 * @param {string} viewName 
 * @param {string} superview 
 * @param {string} color 
 * @param {number} alpha
 */
notificationController.prototype.creatTextView = function (viewName,superview="view",color="#ffffff",alpha=0.8) {
  this[viewName] = UITextView.new()
  this[viewName].font = UIFont.systemFontOfSize(17);
  this[viewName].layer.cornerRadius = 8
  this[viewName].backgroundColor = MNUtil.hexColorAlpha(color,alpha)
  this[viewName].textColor = UIColor.blackColor()
  this[viewName].delegate = this
  this[viewName].editable = true
  this[viewName].scrollEnabled = false
  this[viewName].bounces = false
  this[viewName].layer.borderWidth = 4

  this[superview].addSubview(this[viewName])
}

notificationController.prototype.hideAllButton = function (frame) {
  this.toolbar.hidden = true
}
notificationController.prototype.showAllButton = function (frame) {
  this.toolbar.hidden = false
}
/**
 * @this {notificationController}
 * @param {*} notifyLoc 
 * @param {*} fromOutside 
 */
notificationController.prototype.show = function (notifyLoc,fromOutside = true, maintainHeight=false) {
try {
  // this.setNotiLayout()
  let studyFrame = MNUtil.studyView.frame
  let windowFrame = MNUtil.currentWindow.frame
  this.onAnimate = true
  let targetHeight = 120
  if (maintainHeight) {
    targetHeight = this.currentFrame.height
  }
  this.currentFrame.height = targetHeight
  this.view.frame = this.currentFrame
  this.webviewResponse.frame = MNUtil.genFrame(0, 0, this.currentFrame.width, this.currentFrame.height-35)
  let height = this.onChat?(chatAIUtils.getHeight()):this.currentFrame.height
  if (fromOutside) {
    height = 120
  }
  this.notifyLoc = chatAIUtils.isIOS()?-1:notifyLoc
  switch (this.notifyLoc) {
    case 0:
      this.currentFrame.x = chatAIUtils.getX()
      if (fromOutside) {
        this.view.frame = {x:-300,y:chatAIUtils.getY(),width:chatAIUtils.getWidth(),height:targetHeight}
      }
      break;
    case 1:
      this.currentFrame.x = windowFrame.width-450
      // MNUtil.showHUD("message"+this.currentFrame.x)
      if (fromOutside) {
        this.view.frame = {x:windowFrame.width,y:chatAIUtils.getY(),width:chatAIUtils.getWidth(),height:targetHeight}
      }
      break;
    case -1:
      this.currentFrame.x = chatAIUtils.getX()
      if (fromOutside) {
        this.view.frame = {x:0,y:chatAIUtils.getY()-120,width:chatAIUtils.getWidth(),height:targetHeight}
      }
      break;
    default:
      break;
  }
  this.currentFrame.y = chatAIUtils.getY()
  let preFrame = this.currentFrame
  preFrame.width = chatAIUtils.getWidth()
  preFrame.height = height
  // MNUtil.showHUD("message"+height)
  let preOpacity = this.view.layer.opacity
  this.view.layer.opacity = chatAIUtils.isIOS()?1:0.2
  // if (frame) {
  //   this.view.frame = fra  me
  //   this.currentFrame = frame
  // }
  // MNUtil.copyJSON(this.currentFrame)
  this.view.hidden = false
  this.setLayout()

  if (chatAIUtils.isIOS()) {
    this.showAllButton()
  }else{
    this.hideAllButton()
  }
  let animateTime = chatAIUtils.isIOS()?0.4:0.2
  MNUtil.animate(()=>{
    this.view.layer.opacity = preOpacity
    this.view.frame = preFrame
    // this.currentFrame = preFrame
    this.setLayout()
  },animateTime).then(()=>{
    this.view.layer.borderWidth = 0
    if (this.onChat) {
      this.setChatLayout()
    }else{
      this.showAllButton()
    }
    this.onAnimate = false
  })
} catch (error) {
  chatAIUtils.addErrorLog(error, "show")
}
}
/**
 * @this {notificationController}
 */
notificationController.prototype.hide = async function () {
  let windowFrame = MNUtil.currentWindow.bounds
  this.onAnimate = true
  this.onChat = false
  if (this.connection) {
    this.connection.cancel()
    delete this.connection
  }
  let targetFrame
  this.notifyLoc = chatAIUtils.isIOS()?-1:this.notifyLoc
  switch (this.notifyLoc) {
    case 0:
      targetFrame = {x:-300,y:chatAIUtils.getY(),width:chatAIUtils.getWidth(),height:this.currentFrame.height}
      this.currentFrame = {x:-300,y:chatAIUtils.getY(),width:chatAIUtils.getWidth(),height:120}
      break;
    case 1:
      targetFrame = {x:windowFrame.width,y:chatAIUtils.getY(),width:chatAIUtils.getWidth(),height:this.currentFrame.height}
      this.currentFrame = {x:windowFrame.width,y:chatAIUtils.getY(),width:chatAIUtils.getWidth(),height:120}
      break;
    case -1:
      targetFrame = {x:0,y:chatAIUtils.getY()-this.view.frame.height,width:chatAIUtils.getWidth(),height:this.currentFrame.height}
      this.currentFrame = {x:0,y:chatAIUtils.getY()-120,width:chatAIUtils.getWidth(),height:120}
      break;
    default:
      break;
  }
  // MNUtil.copyJSON(targetFrame)
  let preOpacity = this.view.layer.opacity
  let preCustom = this.custom
  if (chatAIUtils.isIOS()) {
    this.showAllButton()
  }else{
    this.hideAllButton()
  }
  // this.hideAllButton()
  this.custom = false
  let animateTime = chatAIUtils.isIOS()?0.3:0.2
  await MNUtil.animate(()=>{
    this.view.layer.opacity = chatAIUtils.isIOS()?1:0.2
    this.view.frame = targetFrame
    },animateTime
  )
  this.view.hidden = true;
  this.view.layer.opacity = preOpacity      
  this.currentFrame.height = 120
  this.view.frame = this.currentFrame
  this.webviewResponse.frame = MNUtil.genFrame(0, 0, this.currentFrame.width, this.currentFrame.height-35)
  this.onAnimate = false
  // this.currentFrame = preFrame
  this.custom = preCustom
  this.response = ''
  this.preResponse = ""
  this.preFuncResponse = ''
  this.funcResponse = ''
  this.setNewResponse()
  return
}

/**
 * @this {notificationController}
 */
notificationController.prototype.setLayout = function () {
try {

  var viewFrame = this.toolbar.bounds;
  var width    = viewFrame.width
  var height   = viewFrame.height
  viewFrame.height = viewFrame.height-30
  this.toolbar.frame = MNUtil.genFrame(0, this.view.frame.height-30, chatAIUtils.getWidth(),30)
  let notifyLoc = chatAIUtils.isIOS()?0:chatAIConfig.config.notifyLoc
  switch (notifyLoc) {
    case 0:
      this.aiButton.frame = MNUtil.genFrame(-45,0,40,40)
      this.screenButton.frame = MNUtil.genFrame(width-30,0,30,30)
      this.bigbangButton.frame = MNUtil.genFrame(width-65,0,30,30)
      this.commentButton.frame = MNUtil.genFrame(width-100,0,30,30)
      this.titleButton.frame = MNUtil.genFrame(width-135,0,30,30)
      this.copyButton.frame = MNUtil.genFrame(width-170,0,30,30)
      this.excerptButton.frame = MNUtil.genFrame(width-205,0,30,30)
      this.childButton.frame = MNUtil.genFrame(width-240,0,30,30) 
      this.reloadButton.frame = MNUtil.genFrame(width-275,0,30,30)
      this.chatButton.frame = MNUtil.genFrame(width-310,0,30,30) 
      this.promptButton.frame = MNUtil.genFrame(0,0,width-315,30)
      break;
    case 1:
      this.aiButton.frame = MNUtil.genFrame(width+5,0,40,40)
      this.screenButton.frame = MNUtil.genFrame(0,0,30,30)
      this.bigbangButton.frame = MNUtil.genFrame(35,0,30,30)
      this.commentButton.frame = MNUtil.genFrame(70,0,30,30)
      this.titleButton.frame = MNUtil.genFrame(105,0,30,30)
      this.copyButton.frame = MNUtil.genFrame(140,0,30,30)
      this.excerptButton.frame = MNUtil.genFrame(175,0,30,30)
      this.reloadButton.frame = MNUtil.genFrame(245,0,30,30)
      this.chatButton.frame = MNUtil.genFrame(viewFrame.width-120,0,30,30) 
      this.childButton.frame = MNUtil.genFrame(210,0,30,30) 
      this.promptButton.frame = MNUtil.genFrame(viewFrame.width-85,0,90,30)
      break;
    default:
      break;
  }
} catch (error) {
  chatAIUtils.addErrorLog(error, "setLayout")
}
}

/** 
* @this {notificationController}
* @param {string} promptName - The name of the prompt to begin the notification with.
*/
notificationController.prototype.beginNotification = async function (promptName) {
    // chatAIUtils.ensureView(this.view)
    chatAIUtils.ensureViewInCurrentWindow(this.view)
    // if (chatAIUtils.forceToRefresh) {
      
    //   chatAIUtils.forceToRefresh = false
    // }
    await MNUtil.delay(0.01)
    this.checkTheme()
    this.setNewResponse()
    MNUtil.delay(0.1).then(()=>{
      this.changeTheme(this.theme)
    })
    await MNUtil.delay(0.01)
    if (!this.view.hidden) {
      this.setNotiLayout(120)
    }
    this.webviewResponse.hidden = false
    try {
    if (promptName) {
      this.promptButton.setTitleForState(promptName ,0)
    }else{
      this.promptButton.setTitleForState(this.currentTitle ,0)
    }
    } catch (error) {
      chatAIUtils.addErrorLog(error, "beginNotification")
    }
    if (this.view.hidden || (!chatAIUtils.isIOS() && this.notifyLoc !== chatAIConfig.config.notifyLoc)) {
      this.show(chatAIConfig.config.notifyLoc)
    }

  }

/** 
  * @this {notificationController} 
  * @param {string} content - The content to be displayed in the notification.
*/
notificationController.prototype.getTextForAction = async function () {
    let webviewContent = await this.getWebviewContent()
    if (webviewContent) {
      return chatAIUtils.fixMarkdownLatexSpaces(webviewContent)
    }else{
      return chatAIUtils.fixMarkdownLatexSpaces(this.response)
    }
}

/** 
 * @this {notificationController}
 */
notificationController.prototype.getResponse = async function (force = false) {
  // if (this.onResponse && !force) {
  //   MNUtil.showHUD("getResponse.reject")
  //   return false
  // }
    switch (this.source) {
    case "Claude":
      this.getResponseForClaude()
      break;
    case "Gemini":
      // this.getResponseForGemini()
      this.getResponseForChatGPT()
      break;
    default:
      this.getResponseForChatGPT()
      break;
    }
    return await this.setResponseText(this.preFuncResponse+this.funcResponse,force)
}
/** 
 * @param {string} response 
 * @this {notificationController}
 */
notificationController.prototype.getResponseForChatGPT = function (checkToolCalls = true) {
  try {
    let test = chatAIUtils.parseResponse(this.originalText, checkToolCalls)
    // MNUtil.copy(test)
    if (!test) {
      // MNUtil.showHUD("Empty")
      return
    }
    if (test.usage) {
      if (test.usage.total_tokens) {
        this.setToken(test.usage.total_tokens)
      }
    }
    this.response = this.preResponse+"\n"+test.response ?? ""
    this.reasoningResponse = test.reasoningResponse ?? ""
    this.func = test.funcList ?? []
    this.funcResponse = test.funcResponse ?? ""
    if (this.config.source === "Metaso" && test.citations) {
      this.renderSearchResults(test.citations,true)
    }
    return
  } catch (error) {
    chatAIUtils.addErrorLog(error, "getResponseForChatGPT",this.resList)
    return
  }
}

/** 
 * @this {notificationController}
 */
notificationController.prototype.getResponseForGemini = function () {
  try {
    if (!MNUtil.isValidJSON(this.originalText) && !MNUtil.isValidJSON(this.originalText+"]")) {
      return
    }
    try {
      this.resList = JSON.parse(this.originalText).map(res=>{
        return res.candidates[0].content.parts[0].text
      })
    } catch (error) {
      this.resList = JSON.parse(this.originalText+"]").map(res=>{
        return res.candidates[0].content.parts[0].text
      })
    }
    this.response = this.resList.join("")
    return
  } catch (error) {
    chatAIUtils.addErrorLog(error, "getResponseForGemini",this.originalText)
    return
  }
}

/** 
 * @this {notificationController}
 */
notificationController.prototype.getResponseForClaude = function () {
  try {
    // let res = this.originalText.split("data:")
    // res.shift()
    // res.pop()

    this.resList = chatAIUtils.parseEvents(this.originalText)
    let response = ""

    this.resList.map(res=>{
      if (res.event === "content_block_start") {
        response = res.data.content_block.text
      }
      if (res.event === "content_block_delta") {
        response = response+res.data.delta.text
      }
    })
    // copy(response)
    this.response = response
    return
  } catch (error) {
    chatAIUtils.addErrorLog(error, "getResponseForClaude",this.originalText)
    return
  }
}
/** 
 * @this {notificationController}
 * 用来格式化调用的函数内容的
 */
notificationController.prototype.codifyToolCall = function (funcName,arguments) {
  switch (funcName) {
    case "multi_tool_use.parallel":
      let preFix = `multi_tool_use(\n`
      let tool_uses = arguments.tool_uses
      let toolMessages = []
      tool_uses.map((tool_use,index)=>{
        switch (tool_use.recipient_name) {
          case "functions.setTitle":
            toolMessages.push("\t"+this.codifyToolCall("setTitle", {title:tool_use.parameters.title.trim()}))
            break;
          case "functions.addComment":
            toolMessages.push("\t"+this.codifyToolCall("addComment", {comment:tool_use.parameters.comment.trim()}))
            break;
          case "functions.addTag":
            toolMessages.push("\t"+this.codifyToolCall("addTag", {tag:tool_use.parameters.tag.trim()}))
            break;
          case "functions.copyMarkdownLink":
            toolMessages.push("\t"+this.codifyToolCall("copyMarkdownLink", {title:tool_use.parameters.title.trim()}))
            break;
          case "functions.copyCardURL":
            toolMessages.push("\t"+this.codifyToolCall("copyCardURL", {}))
            break;
          case "functions.copyText":
            toolMessages.push("\t"+this.codifyToolCall("copyText", {text:tool_use.parameters.text.trim()}))
            break;
          case "functions.addChildNote":
            toolMessages.push("\t"+this.codifyToolCall("addChildNote", {title:tool_use.parameters.title.trim(),content:tool_use.parameters.content.trim()}))
            break;
          case "functions.clearExcerpt":
            toolMessages.push("\t"+this.codifyToolCall("clearExcerpt", {}))
            break;
          case "functions.close":
            toolMessages.push("\t"+this.codifyToolCall("close", {}))
            break;
          case "functions.setExcerpt":
            toolMessages.push("\t"+this.codifyToolCall("setExcerpt", {excerpt:tool_use.parameters.excerpt.trim()}))
            break
          default:
            break;
        }
      })
      return preFix+toolMessages.join("")+")\n"
    default:
      return chatAITool.getToolByName(funcName).codifyToolCall(arguments)
  }
  return "Error"
}
notificationController.prototype.delay = async function (seconds) {
  return new Promise((resolve, reject) => {
    NSTimer.scheduledTimerWithTimeInterval(seconds, false, function () {
      resolve()
    })
  })
}
notificationController.prototype.createTextviewResponse  = function () {
  this.textviewResponse = UITextView.new()
  this.textviewResponse.font = UIFont.systemFontOfSize(16);
  this.textviewResponse.layer.cornerRadius = 8
  this.textviewResponse.backgroundColor = MNUtil.hexColorAlpha("#ffffff",0.8)
  this.textviewResponse.textColor = UIColor.blackColor()
  this.textviewResponse.delegate = this
  this.textviewResponse.contentSize = {width:chatAIUtils.getWidth(),height:120}
  this.textviewResponse.scrollEnabled = false
  this.textviewResponse.text = `Loading...`
}
notificationController.prototype.createWebviewResponse = function () {
  try {
  // MNUtil.showHUD("createWebviewResponse")
  this.webviewResponse = new UIWebView(this.view.bounds);
  this.webviewResponse.backgroundColor = UIColor.whiteColor();
  this.webviewResponse.scalesPageToFit = false;
  this.webviewResponse.autoresizingMask = (1 << 1 | 1 << 4);
  this.webviewResponse.delegate = this;
  // this.webviewResponse.setValueForKey("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15","User-Agent")
  this.webviewResponse.scrollView.delegate = this;
  this.webviewResponse.layer.cornerRadius = 8;
  this.webviewResponse.layer.masksToBounds = true;
  this.webviewResponse.layer.borderColor = MNUtil.hexColorAlpha("#9bb2d6",0.8);
  this.webviewResponse.layer.borderWidth = 0
  this.webviewResponse.layer.opacity = 0.9
  this.webviewResponse.scrollView.bounces = false
  // this.webviewResponse.loadFileURLAllowingReadAccessToURL(
  //   NSURL.fileURLWithPath(chatAIConfig.mainPath + `/veditor.html`),
  //   NSURL.fileURLWithPath(chatAIConfig.mainPath + '/')
  // );
  this.webviewResponse.loadFileURLAllowingReadAccessToURL(
    NSURL.fileURLWithPath(chatAIConfig.mainPath + `/veditor_${this.theme}.html`),
    NSURL.fileURLWithPath(chatAIConfig.mainPath + '/')
  );
  this.view.addSubview(this.webviewResponse)
    } catch (error) {
    chatAIUtils.addErrorLog(error, "createWebviewResponse")
  }
}
// /** @this {notificationController} */
// notificationController.prototype.runJavaScript = async function(script,webview) {
//   // if(!this.webviewResponse || !this.webviewResponse.window)return;
//         MNUtil.showHUD("message")
  
//   return new Promise((resolve, reject) => {
//     try {
//         MNUtil.showHUD("message")
      
//     if (webview) {
//       // MNUtil.copy(webview)
//       this[webview].evaluateJavaScript(script,(result) => {
//         MNUtil.showHUD("message1")
//         resolve(result)
//       });
//     }else{
//       this.webviewResponse.evaluateJavaScript(script,(result) => {
//         MNUtil.showHUD("message2")
//         resolve(result)
//       });
//     }
//     } catch (error) {
//       chatAIUtils.addErrorLog(error, "runJavaScript")
//       resolve(0)
//     }
//   })
// };

/** @this {notificationController} */
notificationController.prototype.runJavaScript = async function(script,webview) {
  return new Promise((resolve, reject) => {
    try {
    if (webview) {
      // MNUtil.copy(webview)
      this[webview].evaluateJavaScript(script,(result) => {
        if (MNUtil.isNSNull(result)) {
          resolve(undefined)
        }else{
          resolve(result)
        }
      });
    }else{
      this.webviewResponse.evaluateJavaScript(script,(result) => {
        if (MNUtil.isNSNull(result)) {
          resolve(undefined)
        }else{
          resolve(result)
        }
      });
    }
    } catch (error) {
      chatAIUtils.addErrorLog(error, "runJavaScript")
      resolve(undefined)
    }
  })
};
/** @this {notificationController} */
notificationController.prototype.getFileContent = async function (fileObject) {
  let res = await this.runJavaScript(`getPdfContent()`)
  let pageContents = JSON.parse(res)
  // let fileContent = await this.runJavaScript(`getProcessPercent()`)
  return pageContents
}

/** @this {notificationController} */
notificationController.prototype.getFileParsingProcess = async function (fileObject) {
  let encodeRes = await this.runJavaScript(`getProgress()`)
  if (!encodeRes) {
    return {
      onProcess: false,
      processPercent: 0
    }
  }
  // MNUtil.log({source:"MN ChatAI",message:"getFileParsingProcess",detail:decodeURIComponent(encodeRes)})
  let res = JSON.parse(decodeURIComponent(encodeRes))
  return res
}


/** @this {notificationController} */
notificationController.prototype.getWebviewHeight = async function (finish = false) {
  if (finish) {
    // MNUtil.copy(this.response)
    // MNUtil.log("getWebviewHeight",chatAIConfig.getConfig("allowEdit"))
    await this.runJavaScript(`openEdit(${chatAIConfig.getConfig("allowEdit")});`)
  }
  let sizeHeight = parseInt(await this.runJavaScript(`document.body.scrollHeight`))
  return sizeHeight
}

/** @this {notificationController} */
notificationController.prototype.getWebviewSelection = async function (webview){
  try {
  let  selection = await this.runJavaScript(`editor.getSelection()`,webview)
  // let selection = await this.runJavaScript(`getCurrentSelect()`,webview)
  // MNUtil.delay(0.1).then(async ()=>{
  //   await this.runJavaScript(`editor.blur();`,webview)
  //   if (webview) {
  //     this[webview].endEditing(true)
  //   }else{
  //     this.webviewResponse.endEditing(true)
  //   }
  // })
  // MNUtil.copy(selection)
  if (!selection || !selection.trim()) {
    return undefined
  }else{
    return selection
  }
  
  } catch (error) {
    chatAIUtils.addErrorLog(error, "getWebviewSelection")
    return undefined
  }

}

/** @this {notificationController} */
notificationController.prototype.getWebviewContent = async function (webview){
  try {
  let  selection = await this.runJavaScript(`editor.getSelection()`,webview)
  // let selection = await this.runJavaScript(`getCurrentSelect()`,webview)
  MNUtil.delay(0.1).then(async ()=>{
    await this.runJavaScript(`editor.blur();`,webview)
    if (webview) {
      this[webview].endEditing(true)
    }else{
      this.webviewResponse.endEditing(true)
    }
  })
  // MNUtil.copy(selection)
  if (!selection || !selection.trim()) {
    // let text = this.lastResponse
    let text = await this.runJavaScript(`editor.getValue();`,webview)
    return text
  }else{
    return selection
  }
  } catch (error) {
    chatAIUtils.addErrorLog(error, "getWebviewContent")
    return undefined
  }

}

/** @this {notificationController} */
notificationController.prototype.scrollBottom = async function () {
  this.runJavaScript(`scrollToBottom()`)
}
/** @this {notificationController} */
notificationController.prototype.setWebviewContentDev = async function (response) {
  // this.tem.push(response)
  // MNUtil.copy(`setResponse(\`${encodeURIComponent(JSON.stringify(response))}\`)`)
  // if (Date.now() - this.lastRenderTime > 100) {
  try {
    // if(response.response){
    //   this.runJavaScript(`setRealResponse(\`${encodeURIComponent( response.response)}\`)`)
    // }else{
      // MNUtil.copy(`setResponse(\`${encodeURIComponent(JSON.stringify(response))}\`)`)
      this.runJavaScript(`setResponse(\`${encodeURIComponent(JSON.stringify(response))}\`)`)
    // }
  } catch (error) {
    chatAIUtils.addErrorLog(error, "setWebviewContentDev")
    return undefined
  }
  // }else{
  //   return undefined
  // }
}

/** 
  *@this {notificationController} 
  *重新加载一遍veditor
  */
notificationController.prototype.setNewResponse = function (webview) {
  if (webview) {
    this[webview].loadFileURLAllowingReadAccessToURL(
      NSURL.fileURLWithPath(chatAIConfig.mainPath + `/veditor_${this.theme}.html`),
      NSURL.fileURLWithPath(chatAIConfig.mainPath + '/')
    );
    // this[webview].loadFileURLAllowingReadAccessToURL(
    //   NSURL.fileURLWithPath(chatAIConfig.mainPath + `/veditor.html`),
    //   NSURL.fileURLWithPath(chatAIConfig.mainPath + '/')
    // );
  }else{
    if (chatAIUtils.forceToRefresh) {
      // MNUtil.showHUD("Force to reload webview")
      if (this.webviewResponse) {
        this.webviewResponse.hidden = true
        this.webviewResponse.removeFromSuperview()
      }
      // delete this.webviewResponse
      this.createWebviewResponse()
      this.setNotiLayout()
      chatAIUtils.forceToRefresh = false
    }else{
      this.webviewResponse.loadFileURLAllowingReadAccessToURL(
        NSURL.fileURLWithPath(chatAIConfig.mainPath + `/veditor_${this.theme}.html`),
        NSURL.fileURLWithPath(chatAIConfig.mainPath + '/')
      );
      // this.webviewResponse.loadFileURLAllowingReadAccessToURL(
      //   NSURL.fileURLWithPath(chatAIConfig.mainPath + `/veditor.html`),
      //   NSURL.fileURLWithPath(chatAIConfig.mainPath + '/')
      // );
    }
  }
}

/** @this {notificationController} */
notificationController.prototype.setResponseText = async function (funcResponse = "",force = false) {
  // if (this.onResponse && !force) {
  //   MNUtil.showHUD("setResponseText.reject")
  //   return false
  // }
  try {
    // MNUtil.copy(funcResponse)
    let funcHtml = ""
    if (funcResponse.trim()) {
      funcHtml = `<pre><code>${funcResponse.trim()}</code></pre>`
    }
    // this.tem.push(funcResponse)
    // MNUtil.copy(this.tem)
    this.onResponse = true
    this.onreceive = false
    // MNUtil.copy(this.response.trim())
    // let beginTime = Date.now()
    // let response = chatAIUtils.fixMarkdownLinks(this.response.trim())
    // response = chatAIUtils.replaceButtonCodeBlocks(response)
    // let endTime = Date.now()
    // MNUtil.log("setResponseText:"+(endTime-beginTime)+"ms")
    let option = {
      scrollToBottom: this.scrollToBottom,
      funcResponse: funcHtml,
      response: this.response,
      reasoningResponse: this.reasoningResponse,
    }
    if (!this.onFinish) {
      if (option.response.length) {
        option.response = option.response +"..."
      }else if (option.reasoningResponse.length) {
        option.reasoningResponse = option.reasoningResponse.trim() +"..."
      }
    }
    this.setWebviewContentDev(option)
    // if (sizeHeight !== undefined) {
    //   this.sizeHeight = sizeHeight
    // }
    // this.onResponse = false
    return true
    } catch (error) {
      chatAIUtils.addErrorLog(error, "setResponseText")
      return false
    }
}

/**
 * addToolMessage是要给ai看的，codifyToolCall是要给用户看的
 * @param {{index:number,id:string,type:string,function:{name:string,arguments:string}}} func 
 * @returns {Promise<string>}
 * @this {notificationController}
 */
notificationController.prototype.executeFunctionByAI = async function (func) {
try {
  // MNUtil.copy(func)
  let note,title,comment
  let funcName = func.function.name
  let noteid = this.noteid ?? chatAIUtils.getFocusNoteId(false)
  switch (funcName) {
    case "multi_tool_use.parallel":
      this.func = []
      let arguments = chatAIUtils.getValidJSON(func.function.arguments)
      let tool_uses = arguments.tool_uses
      let toolMessages = []
      tool_uses.map((tool_use,index)=>{
        switch (tool_use.recipient_name) {
          case "functions.setTitle":
            if (!noteid) {
              this.showHUD("Note unavailable")
              break
              // this.addToolMessage("Execution failed! There is no card selected",func.id)
              // return "Error in setTitle(): There is no card selected\n"
            }
            let title = tool_use.parameters.title.trim()
            if (!title) {
              MNUtil.showHUD("Empty title")
              break
              // copyJSON(this.func)
              // this.addToolMessage("Execution failed! The title provided is empty!",func.id)
              // return "Error in setTitle(): The title provided is empty!\n"
            }
            this.func.push({type:"function",function:{name:"setTitle",arguments:JSON.stringify({title:title})},id:func.id,index:index})
            note = MNUtil.getNoteById(noteid)
            MNUtil.undoGrouping(()=>{
              note.noteTitle = MNUtil.mergeWhitespace(title.trim())
            })
            toolMessages.push("Title is set")
            // this.addToolMessage("Title is set",func.id)
            break;
          case "functions.addComment":
            if (!noteid) {
              this.showHUD("Note unavailable")
              break
              // this.addToolMessage("Execution failed! There is no card selected",func.id)
              // return "Error in addComment(): There is no card selected\n"
            }
            let comment = tool_use.parameters.comment.trim()
            if (!comment) {
              MNUtil.showHUD("Empty comment")
              break
              // copyJSON(this.func)
              // this.addToolMessage("Execution failed! The comment provided is empty!",func.id)
              // return "Error in addComment(): The comment provided is empty!\n"
            }
            // this.addToolMessage("Comment is added",func.id)
            this.func.push({type:"function",function:{name:"addComment",arguments:JSON.stringify({comment:comment})},id:func.id,index:index})
            note = MNNote.new(noteid)
            MNUtil.undoGrouping(()=>{
              try {
                note.appendMarkdownComment(comment.tirm())
              } catch (error) {
                note.appendTextComment(comment.tirm())
              }
            })
            toolMessages.push("Comment is added")
            // this.addToolMessage("Comment is added",func.id)
            break;
          default:
            break;
        }
      
      })
      // MNUtil.copyJSON(tool_uses)
      this.addToolMessage(toolMessages.join("\n"),func.id)
      return this.codifyToolCall(funcName,arguments)
    default:
      chatAITool.executeView = this.view
      let res = await chatAITool.executeTool(funcName, func, noteid)
      this.tool.push(res.toolMessages)
      if ("renderSearchResults" in res) {
        this.renderSearchResults(res.renderSearchResults)
        // this.runJavaScript(`renderSearchResults(\`${encodeURIComponent(res.renderSearchResults)}\`);`)
      }
      return res.description
  }

} catch (error) {
  chatAIUtils.addErrorLog(error, "executeFunctionByAI",func)
  return undefined
}
}

notificationController.prototype.setButtonOpacity = function (opacity) {
  if (this.onChat) {
    this.chatToolbar.layer.opacity = opacity
  }else{
    this.toolbar.layer.opacity = opacity
    // this.bigbangButton.layer.opacity = opacity
    // this.commentButton.layer.opacity = opacity
    // this.copyButton.layer.opacity = opacity
    // this.titleButton.layer.opacity = opacity
    // this.locationButton.layer.opacity = opacity
    // this.promptButton.layer.opacity = opacity
    // this.chatButton.layer.opacity = opacity
    // this.reloadButton.layer.opacity = opacity
    // this.aiLinkButton.layer.opacity = opacity
  }
}
/**
 * 
 * @param {string} content 
 */
notificationController.prototype.addToolMessage = function (content,funcId) {
  this.tool.push({"role":"tool","content":content,"tool_call_id":funcId})
}
/** @this {notificationController} */
notificationController.prototype.setToken = function (token) {
  try {
    if (this.onFinish) {
      this.token.push(token)
      this.promptButton.setTitleForState(""+chatAIUtils.sum(this.token),0)
    }else{
      this.promptButton.setTitleForState(""+chatAIUtils.sum(this.token.concat(token)),0)
    }
    // this.promptButton.setTitleForState(token,0)
    // this.token = [token]
  } catch (error) {
    chatAIUtils.addErrorLog(error, "setToken")
  }
}
/** @this {notificationController} */
notificationController.prototype.speech = async function(text,webview){
  return
  let encodedText = encodeURIComponent(text)
  let voice = chatAIConfig.getConfig("speechVoice")
  let speed = chatAIConfig.getConfig("speechSpeed")
  let key = chatAIConfig.getConfig("speechKey")
  let group = chatAIConfig.getConfig("miniMaxGroup")
  if (chatAIConfig.getConfig("autoSpeech")) {
    await this.runJavaScript(`speech(\`${encodedText}\`,\`${voice}\`,\`${key}\`,\`${group}\`,${speed},true);`,webview)
  }else{
    await this.runJavaScript(`speech(\`${encodedText}\`,\`${voice}\`,\`${key}\`,\`${group}\`,${speed},false);`,webview)
  }
}
/**
 * @this {notificationController}
 * @param {number[]} actionIndices 
 * @param {string} text 
 */
notificationController.prototype.executeFinishAction = async function (actionIndices,text) {
  try {
    

  let shouldClose = false
  // let noteid = this.noteid
  // let note = undefined
  // if (noteid) {
  //   note = MNNote.new(noteid)
  // }else{
  //   note = chatAIUtils.getFocusNote()
  // }
  var actions = ["setTitle","addComment","copyMarkdownLink","copyCardURL","copyText","close","addTag","addChildNote","clearExcerpt","setExcerpt","snipasteHTML","addBrotherNote","appendBlankComment","appendTitle","appendExcerpt","snipasteText","markdown2Mindmap"];
  MNUtil.undoGrouping(()=>{
    actionIndices.forEach(async (index)=>{
      let action = actions[index]
      if (action === "close") {
        shouldClose = true
      }else{
        await this.executeAction(action, text,false)
      }
    })
  
  })
  await MNUtil.delay(0.5)
  if (shouldClose) {
    this.hide()
  }
  return
  } catch (error) {
    chatAIUtils.addErrorLog(error, "notificationController.executeFinishAction")
  }
}
/**
 * @this {notificationController}
 */
notificationController.prototype.checkTheme = function(refresh = false){
  if (!chatAIConfig.getConfig("autoTheme")) {
    this.theme = "light"
    return
  }
  if (MNUtil.app.currentTheme === "Dark") {
    if (refresh && this.theme !== "dark") {
      this.refreshTheme("dark")
    }
    this.theme = "dark"
  }else{
    if (refresh && this.theme === "dark") {
      this.refreshTheme("light")
    }
    this.theme = "light"
  }
}
/**
 * @this {notificationController}
 */
notificationController.prototype.refreshTheme = function (theme) {
  if (this.webviewResponse) {
    // MNUtil.showHUD(theme)
    this.changeTheme(theme)
  }
  if (this.onChat) {
    this.webviewResponse.hidden = true
    if (theme === "dark") {
      this.scrollView.backgroundColor = MNUtil.hexColorAlpha("#333b41",0.8)
    }else{
      this.scrollView.backgroundColor = MNUtil.hexColorAlpha("#ffffff",0.8)
    }
  }
  let round = 0
  while (this["assistant"+round]) {
    this.changeTheme(theme,"assistant"+round)
    round = round+1
  }
  return
}
/**
 * @this {notificationController}
 */
notificationController.prototype.changeTheme = function (theme,webview) {
  if (!chatAIConfig.getConfig("autoTheme")) {
    return
  }
  if (webview) {
    switch (theme) {
      case "dark":
        this.runJavaScript(`editor.setTheme("dark","dark");document.body.style.backgroundColor = "#24292E";`,webview)
        // this.theme = "dark"
        break;
      case "light":
        this.runJavaScript(`editor.setTheme("light","light");document.body.style.backgroundColor = "#ffffff";`,webview)
        // this.theme = "light"
        break;
      default:
        break;
    }
  }else{
    switch (theme) {
      case "dark":
        this.runJavaScript(`editor.setTheme("dark","dark");document.body.style.backgroundColor = "#24292E";`)
        // this.theme = "dark"
        break;
      case "light":
        this.runJavaScript(`editor.setTheme("light","light");document.body.style.backgroundColor = "#ffffff";`)
        // this.theme = "light"
        break;
      default:
        break;
    }
  }
  }
/**
 * @this {notificationController}
 */
notificationController.prototype.addToInput = function (text) {
  let textView = this.userInput
  let userInput = `${textView.text}\n> ${text}`
  textView.text = userInput.trim()+"\n \n"
  textView.custom = true
  let frame = this.view.frame
  let inputFrame = textView.frame
  let size = textView.sizeThatFits({width:inputFrame.width,height:1000})
  if (size.height < 55) {
    size.height = 55
  }
  inputFrame.custom = true
  // if (size.height > 85) {
  inputFrame.y = frame.height-size.height-5
    // size.height = 85
  // }
  inputFrame.height = size.height
  textView.frame = inputFrame
  textView.becomeFirstResponder()
}
/**
 * @this {notificationController}
 * @param {NSURLRequest} request 
 */
notificationController.prototype.sendStreamRequest = function (request) {
  this.currentTime = Date.now()
  this.connection = NSURLConnection.connectionWithRequestDelegate(request,this)
}
notificationController.prototype.checkAutoClose = async function (autoClose,delay = 0.3) {
  if (autoClose) {
    await MNUtil.delay(delay)
    this.hide()
  }
}

/**
 * 
 * @param {string} title 
 * @param {string} selector 
 * @param {any} param 
 * @param {boolean|undefined} checked 
 * @this {notificationController}
 * @returns 
 */
notificationController.prototype.tableItem = function (title,selector,param = "",checked = false) {
  return {title:title,object:this,selector:selector,param:param,checked:checked}
}

/**
 * @this {notificationController}
 * @param {*} sender 
 * @param {*} commandTable 
 * @param {*} width 
 * @param {*} direction 
 */
notificationController.prototype.popover = function(sender,commandTable,width=200,direction=2){
  this.popoverController = MNUtil.getPopoverAndPresent(sender,commandTable,width,direction)
}

/**
 * 
 * @param {string} title 
 * @param {number} duration 
 * @param {UIView} view 
 */
notificationController.prototype.showHUD = function (title,duration = 1.5,view = this.view) {
  MNUtil.showHUD(title,duration,view)
}
/**
 * 
 * @param {string} title 
 * @param {number} duration 
 * @param {UIView} view 
 */
notificationController.prototype.waitHUD = function (title,view = this.view) {
  MNUtil.waitHUD(title,view)
}

/**
 * 不包括带有按钮的动作,不带undoGrouping
 * @this {notificationController}
 * @param {MNNote} note 
 * @param {string} action 
 * @param {string} text 
 */
notificationController.prototype.executeActionOnNote = async function (note,action,text){
try {
    // let note = note ?? await this.currentNote(true)
    if (!note) {
      this.showHUD("Note unavailable")
      return
    }
    switch (action) {
      case "copyCardURL":
        MNUtil.copy(note.noteURL)
        this.showHUD("Link is copied")
        break;
      case "copyMarkdownLink":
        MNUtil.copy(`[${text}](${note.noteURL})`)
        this.showHUD("Markdown Link is copied")
        break;
      case "addComment":
        if (text.trim()) {
          note.appendMarkdownComment(text.trim())
          MNUtil.showHUD("Comment is added")
        }else{
          MNUtil.showHUD("Empty content!")
        }
        break;
      case "addBlankComment":
      case "appendBlankComment":
        await chatAIUtils.insertBlank(note, text)
        break;
      case "addChildNote":
        MNUtil.showHUD("Creating childNote...")
        // note.focusInFloatMindMap(0.5)
        let childNote = note.createChildNote({excerptText:text,excerptTextMarkdown:true})
        childNote.focusInMindMap(0.5)
        break;
      case "addBrotherNote":
        MNUtil.showHUD("Creating brotherNote...")
        let parentNote = note.parentNote
        let brotherNote = parentNote.createChildNote({excerptText:text,excerptTextMarkdown:true})
        brotherNote.focusInMindMap(0.5)
        break;
      case "setTitle":
        note.noteTitle = text
        MNUtil.showHUD("Title is set")
        break;
      case "addTitle":
      case "appendTitle":
        if (note.noteTitle) {
          note.noteTitle = note.noteTitle+"; "+text
        }else{
          note.noteTitle = text
        }
        MNUtil.showHUD("Title is added")
        break;
      case "addTag":
        note.appendTextComment("#"+MNUtil.mergeWhitespace(text))
        MNUtil.showHUD("Tag is added")
        break;
      case "clearExcerpt":
        note.excerptText = ""
        MNUtil.showHUD("Excerpt is cleared")
        break;
      case "setExcerpt":
        MNUtil.showHUD("Replacing excerpt...")
        note.excerptText = text.trim()
        note.excerptTextMarkdown = true
        break;
      case "appendExcerpt":
        MNUtil.showHUD("Appending excerpt...")
        note.excerptText = note.excerptText+"\n"+text.trim()
        break;
      case "markdown2Mindmap":
      case "markdown2mindmap":
        MNUtil.waitHUD("Create Mindmap...")
        await MNUtil.delay(0.1)
        let ast = chatAIUtils.markdown2AST(text)
        chatAIUtils.AST2Mindmap(note,ast)
        MNUtil.stopHUD()
        break;
      default:
        break;
    }
} catch (error) {
  chatAIUtils.addErrorLog(error, "notificationController.executeActionOnNote", action)
}
}

notificationController.prototype.stopOutput = async function () {
  if (this.connection) {
    this.connection.cancel()
    delete this.connection
    this.showHUD("Stop output")
  }else{
    this.showHUD("Not on output")
  }
  this.setButtonOpacity(1.0)
  return;
}
/**
 * 不包括带有按钮的动作
 * @this {notificationController}
 * @param {string} action 
 * @param {string} text 
 * @param {boolean} undoGrouping 
 */
notificationController.prototype.executeAction = async function (action,text,undoGrouping=true){
try {

    let note = await this.currentNote(false)
    switch (action) {
      case "editMode":
        this.showHUD("Edit mode")
        this.runJavaScript(`openEdit(true)`)
        return
      case "stopOutput":
        if (this.connection) {
          this.connection.cancel()
          delete this.connection
          this.showHUD("Stop output")
        }else{
          this.showHUD("Not on output")
        }
        this.setButtonOpacity(1.0)
        return;
      case "reply":
        // this.runJavaScript(`editor.disabled()`)
        // return
        let userInputRes = await MNUtil.userInput("MN ChatAI", "Reply to the last message\n\n请输入回复内容", ["Cancel","Yes/是","No/不是","Continue/继续","Exit/退出","Confirm"])
        switch (userInputRes.button) {
          case 0:
            MNUtil.showHUD("Cancel")
            return
          case 1:
            this.showHUD("💬 Reply: Yes")
            this.continueAsk("Yes")
            return
          case 2:
            this.showHUD("💬 Reply: No")
            this.continueAsk("No")
            return
          case 3:
            this.showHUD("💬 Reply: Continue")
            this.continueAsk("Continue")
            return
          case 4:
            this.showHUD("💬 Reply: Exit")
            this.continueAsk("Exit")
            return
          case 5:
            let text = userInputRes.input
            if (text.trim()) {
              this.showHUD("💬 Reply: "+text)
              this.continueAsk(text)
            }else{
              MNUtil.showHUD("内容为空")
            }
            break;
          default:
            break;
        }
        return;
      case "switchLocation":
        if (this.notifyLoc === 1) {
          chatAIConfig.config.notifyLoc = 0
          chatAIConfig.save("MNChatglm_config")
          this.show(chatAIConfig.config.notifyLoc,false,true)
          if (chatAIUtils.chatController.windowLocationButton) {
            chatAIUtils.chatController.windowLocationButton.setTitleForState("Notification: Left",0)
          }
          return
        }
        if (this.notifyLoc === 0) {
          chatAIConfig.config.notifyLoc = 1
          this.show(chatAIConfig.config.notifyLoc,false,true)
          chatAIConfig.save("MNChatglm_config")
          if (chatAIUtils.chatController.windowLocationButton) {
            chatAIUtils.chatController.windowLocationButton.setTitleForState("Notification: Right",0)
          }
          return
        }
        return
      case "none":
        this.showHUD("No action")
        return;
      case "reAsk":
        if (this.connection) {
          let confirm = await MNUtil.confirm("On output. Re-ask?", "当前正在输出，是否重新请求？")
          if (confirm) {
            this.connection.cancel()
            delete this.connection
            MNUtil.stopHUD()
          }else{
            return
          }
        }
        this.notShow = false
        this.called = true
        this.response = ""
        this.preFuncResponse = ''
        if (this.currentPrompt === "Dynamic" || this.currentPrompt === "Vision") {
          this.reAskByDynamic(1.0)
        }else{
          this.reAsk(1.0)
        }
        return;
      case "openChat":
        if (chatAIUtils.isMN3()) {
          MNUtil.showHUD("Only available in MN4")
          return
        }
        let config = {
          token:this.token,
          history:this.history,
          config:this.config,
          currentModel:this.currentModel,
          preFuncResponse:this.preFuncResponse,
          lastResponse:this.lastResponse,
          funcIndices:this.funcIndices,
          prompt:this.currentPrompt,
          reasoningResponse:this.reasoningResponse
        }
        // MNUtil.copyJSON(config)
        if (!chatAIUtils.sideOutputController) {
          // MNUtil.toggleExtensionPanel()
          MNExtensionPanel.show()
          chatAIUtils.sideOutputController = sideOutputController.new();
          // let panelView = MNExtensionPanel.view
          MNExtensionPanel.addSubview("chatAISideOutputView", chatAIUtils.sideOutputController.view)
          // MNUtil.extensionPanelView.backgroundColor = UIColor.whiteColor()
          chatAIUtils.sideOutputController.view.hidden = false
          chatAIUtils.sideOutputController.view.frame = {x:0,y:0,width:MNExtensionPanel.width,height:MNExtensionPanel.height}
          chatAIUtils.sideOutputController.currentFrame = {x:0,y:0,width:MNExtensionPanel.width,height:MNExtensionPanel.height}
        }else{
          MNExtensionPanel.show("chatAISideOutputView")
        }
        chatAIUtils.sideOutputController.openChatView(config)
        return;
      case "bigbang":
        if (note) {
          MNUtil.postNotification("bigbangText",{text:text,noteid:note.noteId,url:note.noteURL})
        }else{
          MNUtil.postNotification("bigbangText",{text:text})
        }
        return;
      case "snipaste":
      case "snipasteText":
        let html = `
  <html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://vip.123pan.cn/1836303614/dl/cdn/mermaid.js" defer></script>
  </head>

  <body>
${MNUtil.md2html(text)}
  <script>
      MathJax = {
          tex: {
              inlineMath: [ ['$','$'], ["\\(","\\)"] ]
          }
      };
/**
 * 根据指定的 scheme、host、path、query 和 fragment 生成一个完整的 URL Scheme 字符串。
 * URL Scheme 完整格式：scheme://host/path?query#fragment
 *
 * @param {string} scheme - URL scheme，例如 'myapp'。必须提供。
 * @param {string|undefined} [host] - host 部分，例如 'user_profile'。
 * @param {string|string[]|undefined} [path] - path 部分，例如 'view/123'。
 * @param {Object<string, string|number|boolean|object>|undefined} [query] - 查询参数对象。
 * @param {string|undefined} [fragment] - fragment 标识符，即 URL 中 # 后面的部分。
 * @returns {string} - 生成的完整 URL 字符串。
 */
function generateUrlScheme(scheme, host, path, query, fragment) {
  // 1. 处理必须的 scheme
  if (!scheme) {
    console.error("Scheme is a required parameter.");
    return '';
  }
  // 2. 构建基础部分：scheme 和 host
  //    即使 host 为空，也会生成 'scheme://'，这对于 'file:///' 这类 scheme 是正确的
  let url = \`\${scheme}://\${host || ''}\`;

  // 3. 添加 path
  if (path) {
    if (Array.isArray(path)) {
      let pathStr = path.join('/')
      url += \`/\${pathStr.replace(/^\\\/+/, '')}\`;
    }else{
      // 确保 host 和 path 之间只有一个斜杠，并处理 path 开头可能存在的斜杠
      url += \`/\${path.replace(/^\\\/+/, '')}\`;
    }
  }

  // 4. 添加 query 参数
  if (query && Object.keys(query).length > 0) {
    const queryParts = [];
    for (const key in query) {
      // 确保我们只处理对象自身的属性
      if (Object.prototype.hasOwnProperty.call(query, key)) {
        const value = query[key];
        const encodedKey = encodeURIComponent(key);
        // 对值进行编码，如果是对象，则先序列化为 JSON 字符串
        const encodedValue = encodeURIComponent(
          typeof value === "object" && value !== null ? JSON.stringify(value) : value
        );
        queryParts.push(\`\${encodedKey}=\${encodedValue}\`);
      }
    }
    if (queryParts.length > 0) {
      url += \`?\${queryParts.join('&')}\`;
    }
  }

  // 5. 添加 fragment
  if (fragment) {
    // Fragment 部分不应该被编码
    url += \`#\${fragment}\`;
  }

  return url;
}

    /**
     *
     * @param {string} scheme - URL scheme, 例如 'myapp'。
     * @param {string} [host] - 可选的路径或操作名。
     * @param {Object<string, string|number|boolean>} [params] - 查询参数对象。
     */
    function postMessageToAddon(scheme, host, path, params,fragment) {
      let url = generateUrlScheme(scheme,host,path, params,fragment)
      window.location.href = url
    }
    function replaceLtInLatexBlocks(markdown) {
        return markdown.replace(/\\$\\$(.*?)\\$\\$/gs, (match, latexContent) => {
            return '$$' + latexContent.replace(/</g, '\\\\lt') + '$$';
        });
    }
     async function validateMermaid(content,i=0){
      try {
        let res = await mermaid.render('mermaid-graph'+i, content)
        return {valid:true,svg:res.svg}
      } catch (error) {

        // notyf.error(error.message)
        return {valid:false,error:error.message}
      }
    }
    async function renderMermaindOneChart(container,i) {
      container.id = "mermaid-container-"+i
      let content = replaceLtInLatexBlocks(container.textContent)
          // content = content.replace(/</g, "\\lt")
          let res = await validateMermaid(content,i)
          if (!res.valid) {
            if(res.error.includes("KaTeX parse error")) {
              console.log(res.error)
            }
            // document.getElementById('mermaid-container').innerHTML = res.error.message
            // postMessageToAddon("snipaste", "mermaid",undefined, {action: "endRendering",content:content})
            return
          }
          
          
            container.innerHTML = res.svg;
    }
      async function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
        
      }
        async function renderMermaid(){
        try {
          const containers = document.getElementsByClassName("language-mermaid");
          for (let i = 0; i < containers.length; i++) {
            await renderMermaindOneChart(containers[i],i)
          }
        } catch (error) {
          console.log(error);
          
            // postMessageToAddon("snipaste", "mermaid",undefined, {action: "endRendering",content:content})
        }
        }
      // 监听 DOMContentLoaded 事件
      document.addEventListener('DOMContentLoaded', async function () {
        // notyf = new Notyf({position: {x: 'center', y: 'top'}, duration: 1000,ripple:false});
        mermaid.initialize({
            startOnLoad: false,
            securityLevel: 'strict'
        });
        renderMermaid()

      })
  </script>
  <script id="MathJax-script" async src="https://vip.123pan.cn/1836303614/dl/cdn/es5/tex-svg-full.js"></script>
  </body>
  </html>`
        MNUtil.postNotification("snipasteHtml",{html:html})
        return;
      case "openInEditor":
        if (text.trim()) {
          let studyFrame = MNUtil.studyView.bounds
          let beginFrame = this.view.frame
          beginFrame.y = beginFrame.y-10
          if (beginFrame.x+490 > studyFrame.width) {
            let endFrame = Frame.gen(beginFrame.x-450, beginFrame.y-10, 450, 500)
            if (beginFrame.y+490 > studyFrame.height) {
              endFrame.y = studyFrame.height-500
            }
            MNUtil.postNotification("openInEditor",{content:text,beginFrame:beginFrame,endFrame:endFrame})
          }else{
            let endFrame = Frame.gen(beginFrame.x+40, beginFrame.y-10, 450, 500)
            if (beginFrame.y+490 > studyFrame.height) {
              endFrame.y = studyFrame.height-500
            }
            MNUtil.postNotification("openInEditor",{content:text,beginFrame:beginFrame,endFrame:endFrame})
          }
        }
        return;
      case "searchInBrowser":
        if (text.trim()) {
          let studyFrame = MNUtil.studyView.bounds
          let beginFrame = this.view.frame
          beginFrame.y = beginFrame.y-10
          if (beginFrame.x+490 > studyFrame.width) {
            let endFrame = Frame.gen(beginFrame.x-450, beginFrame.y-10, 450, 500)
            if (beginFrame.y+490 > studyFrame.height) {
              endFrame.y = studyFrame.height-500
            }
            MNUtil.postNotification("searchInBrowser",{text:text,beginFrame:beginFrame,endFrame:endFrame})
          }else{
            let endFrame = Frame.gen(beginFrame.x+40, beginFrame.y-10, 450, 500)
            if (beginFrame.y+490 > studyFrame.height) {
              endFrame.y = studyFrame.height-500
            }
            MNUtil.postNotification("searchInBrowser",{text:text,beginFrame:beginFrame,endFrame:endFrame})
          }
        }
        return;
      case "copy":
      case "copyText":
        MNUtil.copy(text)
        this.showHUD("Copy text")
        return;
      case "snipasteHTML":
        let htmlBlock = chatAIUtils.extractHtmlCodeBlocks(text)
        if (htmlBlock.length) {
          MNUtil.showHUD("Preview...")
          MNUtil.postNotification("snipasteHtml", {html:htmlBlock[0].code})
        }
        return;
      default:
        break;
    }

    if (undoGrouping) {
      MNUtil.undoGrouping(()=>{
        if (!note && MNUtil.currentSelection.onSelection) {
          note = MNNote.fromSelection()
          note = note.realGroupNoteForTopicId()
        }
        if (!note) {
          this.showHUD("Note unavailable")
          return
        }
        this.executeActionOnNote(note,action,text)
      })
    }else{
      if (!note && MNUtil.currentSelection.onSelection) {
        note = MNNote.fromSelection()
        note = note.realGroupNoteForTopicId()
      }
      if (!note) {
        this.showHUD("Note unavailable")
        return
      }
      this.executeActionOnNote(note,action,text)
    }
} catch (error) {
  chatAIUtils.addErrorLog(error, "notificationController.executeAction", action)
}
}

/**
 * @this {notificationController}
 * @param {string} action 
 * @param {UIButton} button 
 */
notificationController.prototype.executeToolbarAction = async function (actionKey,button){
  if (typeof toolbarUtils === "undefined") {
    this.showHUD("Please install MN Utils First!")
    return
  }
  if (!chatAIUtils.checkSubscribe(true)) {
    return
  }
  let actionDes = toolbarConfig.getDescriptionById(actionKey)
  if (!("action" in actionDes)) {
    self.showHUD("Missing action")
    return
  }
  MNUtil.log({message:"executeToolbarAction",source:"MN ChatAI",detail:actionDes})
  await toolbarUtils.customActionByDes(actionDes,button,undefined,false)
  while ("onFinish" in actionDes) {
    let delay = actionDes.delay ?? 0.5
    actionDes = actionDes.onFinish
    await MNUtil.delay(delay)
    await toolbarUtils.customActionByDes(actionDes,button,undefined,false)
  }

}
/**
 * @this {notificationController}
 * @param {string} action 
 * @param {UIButton} button 
 */
notificationController.prototype.executeActionFromButton = async function (action,button){
    Menu.dismissCurrentMenu()
try {
    if (action.startsWith("toolbar:")) {
      let toolbarAction = action.split(":")[1]
      this.executeToolbarAction(toolbarAction, button)
      return
    }

    if (action === "menu") {
      if (!button) {
        return
      }
      let menu = new Menu(button,this)
      let selector = 'executeCustomButton:'
      menu.addMenuItem("添加子卡片/节点",selector,"addChildNote")
      menu.addMenuItem("添加兄弟卡片/节点",selector,"addBrotherNote")
      menu.addMenuItem("添加评论",selector,"addComment")
      menu.addMenuItem("添加文字留白",selector,"addBlankComment")
      menu.addMenuItem("设置标题",selector,"setTitle")
      menu.addMenuItem("追加标题",selector,"addTitle")
      menu.addMenuItem("复制内容",selector,"copy")
      menu.addMenuItem("设置为摘录",selector,"setExcerpt")
      menu.addMenuItem("追加到摘录",selector,"appendExcerpt")
      menu.addMenuItem("Markdown转脑图",selector,"markdown2Mindmap")
      menu.addMenuItem("调用 MN Editor",selector,"openInEditor")
      menu.addMenuItem("调用 MN Bigbang",selector,"bigbang")
      menu.addMenuItem("调用 MN Snipaste",selector,"snipasteText")
      menu.addMenuItem("调用 MN Snipaste 预览 HTML",selector,"snipasteHTML")
      menu.addMenuItem("调用 MN Browser 搜索",selector,"searchInBrowser")
      menu.addMenuItem("重新生成",selector,"reAsk")
      menu.addMenuItem("打开聊天模式",selector,"openChat")
      menu.addMenuItem("停止输出",selector,"stopOutput")
      menu.addMenuItem("切换窗口位置",selector,"switchLocation")
      menu.width = 250
      menu.preferredPosition = 0
      menu.show()
      return
    }
    if (action === "reAskWithMenu") {
      if (!button) {
        return
      }
      let selector = 'setChatModelAndReAsk:'
      let modelName = this.currentModel
      let allModels = chatAIConfig.getAvailableModels()
      let widths = []
      var commandTable = allModels.map(model=>{
        widths.push(chatAIUtils.strCode(model))
        return this.tableItem(model, selector,model,modelName === model)
        // return {title:model,object:self,selector:selector,param:model,checked:modelName === model}
      })
      let position = this.notifyLoc ? 0 : 4
      this.popover(button, commandTable, Math.max(...widths)*9+30,position)
      return
    }
    let text = await this.getTextForAction()
    this.executeAction(action, text)
//     let note = await this.currentNote(false)
//     switch (action) {
//       case "none":
//         this.showHUD("No action")
//         return;
//       case "reAsk":
//         if (this.connection) {
//           let confirm = await MNUtil.confirm("On output. Re-ask?", "当前正在输出，是否重新请求？")
//           if (confirm) {
//             this.connection.cancel()
//             delete this.connection
//             MNUtil.stopHUD()
//           }else{
//             return
//           }
//         }
//         this.notShow = false
//         this.called = true
//         this.response = ""
//         this.preFuncResponse = ''
//         if (this.currentPrompt === "Dynamic" || this.currentPrompt === "Vision") {
//           this.reAskByDynamic(1.0)
//         }else{
//           this.reAsk(1.0)
//         }
//         return;
//       case "reAskWithMenu":
//         if (!button) {
//           return
//         }
//         let selector = 'setChatModelAndReAsk:'
//         let modelName = this.currentModel
//         let allModels = chatAIConfig.getAvailableModels()
//         let widths = []
//         var commandTable = allModels.map(model=>{
//           widths.push(chatAIUtils.strCode(model))
//           return this.tableItem(model, selector,model,modelName === model)
//           // return {title:model,object:self,selector:selector,param:model,checked:modelName === model}
//         })
//         let position = this.notifyLoc ? 0 : 4
//         this.popover(button, commandTable, Math.max(...widths)*9+30,position)
//         return;
//       case "openChat":
//         if (chatAIUtils.isMN3()) {
//           MNUtil.showHUD("Only available in MN4")
//           return
//         }
//         let config = {
//           token:this.token,
//           history:this.history,
//           config:this.config,
//           currentModel:this.currentModel,
//           preFuncResponse:this.preFuncResponse,
//           lastResponse:this.lastResponse,
//           funcIndices:this.funcIndices,
//           prompt:this.currentPrompt,
//           reasoningResponse:this.reasoningResponse
//         }
//         // MNUtil.copyJSON(config)
//         if (!chatAIUtils.sideOutputController) {
//           // MNUtil.toggleExtensionPanel()
//           MNExtensionPanel.show()
//           chatAIUtils.sideOutputController = sideOutputController.new();
//           // let panelView = MNExtensionPanel.view
//           MNExtensionPanel.addSubview("chatAISideOutputView", chatAIUtils.sideOutputController.view)
//           // MNUtil.extensionPanelView.backgroundColor = UIColor.whiteColor()
//           chatAIUtils.sideOutputController.view.hidden = false
//           chatAIUtils.sideOutputController.view.frame = {x:0,y:0,width:MNExtensionPanel.width,height:MNExtensionPanel.height}
//           chatAIUtils.sideOutputController.currentFrame = {x:0,y:0,width:MNExtensionPanel.width,height:MNExtensionPanel.height}
//         }else{
//           MNExtensionPanel.show("chatAISideOutputView")
//         }
//         chatAIUtils.sideOutputController.openChatView(config)
//         return;
//       case "bigbang":
//         if (note) {
//           MNUtil.postNotification("bigbangText",{text:text,noteid:note.noteId,url:note.noteURL})
//         }else{
//           MNUtil.postNotification("bigbangText",{text:text})
//         }
//         return;

//       case "snipaste":
//         let html = `
//   <html lang="en">

//   <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Document</title>
//   </head>

//   <body>
// ${MNUtil.md2html(text)}
//   <script>
//       MathJax = {
//           tex: {
//               inlineMath: [ ['$','$'], ["\\(","\\)"] ]
//           }
//       };
//   </script>
//   <script id="MathJax-script" async src="https://vip.123pan.cn/1836303614/dl/cdn/es5/tex-svg-full.js"></script>
//   </body>
//   </html>`
//         MNUtil.postNotification("snipasteHtml",{html:html})
//         return;
//       case "openInEditor":
//         if (text.trim()) {
//           let studyFrame = MNUtil.studyView.bounds
//           let beginFrame = this.view.frame
//           beginFrame.y = beginFrame.y-10
//           if (beginFrame.x+490 > studyFrame.width) {
//             let endFrame = Frame.gen(beginFrame.x-450, beginFrame.y-10, 450, 500)
//             if (beginFrame.y+490 > studyFrame.height) {
//               endFrame.y = studyFrame.height-500
//             }
//             MNUtil.postNotification("openInEditor",{content:text,beginFrame:beginFrame,endFrame:endFrame})
//           }else{
//             let endFrame = Frame.gen(beginFrame.x+40, beginFrame.y-10, 450, 500)
//             if (beginFrame.y+490 > studyFrame.height) {
//               endFrame.y = studyFrame.height-500
//             }
//             MNUtil.postNotification("openInEditor",{content:text,beginFrame:beginFrame,endFrame:endFrame})
//           }
//         }
//         return;
//       case "searchInBrowser":
//         if (text.trim()) {
//           let studyFrame = MNUtil.studyView.bounds
//           let beginFrame = this.view.frame
//           beginFrame.y = beginFrame.y-10
//           if (beginFrame.x+490 > studyFrame.width) {
//             let endFrame = Frame.gen(beginFrame.x-450, beginFrame.y-10, 450, 500)
//             if (beginFrame.y+490 > studyFrame.height) {
//               endFrame.y = studyFrame.height-500
//             }
//             MNUtil.postNotification("searchInBrowser",{text:text,beginFrame:beginFrame,endFrame:endFrame})
//           }else{
//             let endFrame = Frame.gen(beginFrame.x+40, beginFrame.y-10, 450, 500)
//             if (beginFrame.y+490 > studyFrame.height) {
//               endFrame.y = studyFrame.height-500
//             }
//             MNUtil.postNotification("searchInBrowser",{text:text,beginFrame:beginFrame,endFrame:endFrame})
//           }
//         }
//         return;
//       case "copy":
//         MNUtil.copy(text)
//         this.showHUD("Copy text")
//         return;
//       default:
//         break;
//     }
//     if (!note) {
//       note = MNNote.fromSelection()
//     }
//     if (!note) {
//       this.showHUD("Unavailable")
//       return
//     }
//     switch (action) {
//       case "addComment":
//         MNUtil.undoGrouping(()=>{
//           note.appendMarkdownComment(text.trim())
//         })
//         break;
//       case "addBlankComment":
//         await chatAIUtils.insertBlank(note, text)
//         break;
//       case "addChildNote":
//         let childNote = note.createChildNote({excerptText:text,excerptTextMarkdown:true})
//         childNote.focusInMindMap(0.5)
//         break;
//       case "addBrotherNote":
//         let parentNote = note.parentNote
//         let brotherNote = parentNote.createChildNote({excerptText:text,excerptTextMarkdown:true})
//         brotherNote.focusInMindMap(0.5)
//         break;
//       case "setTitle":
//         MNUtil.undoGrouping(()=>{
//           note.noteTitle = text
//         })
//         break;
//       case "addTitle":
//         MNUtil.undoGrouping(()=>{
//           if (note.noteTitle) {
//             note.noteTitle = note.noteTitle+"; "+text
//           }else{
//             note.noteTitle = text
//           }
//         })
//         break;
//       case "setExcerpt":
//         MNUtil.undoGrouping(()=>{
//           note.excerptText = text.trim()
//           note.excerptTextMarkdown = true
//         })
//         break;
//       case "appendExcerpt":
//         MNUtil.undoGrouping(()=>{
//           note.excerptText = note.excerptText+"\n"+text.trim()
//         })
//         break;
//       case "markdown2Mindmap":
//         MNUtil.waitHUD("Create Mindmap...")
//         await MNUtil.delay(0.1)
//         let ast = chatAIUtils.markdown2AST(text)
//         MNUtil.copy(ast)
//         MNUtil.undoGrouping(()=>{
//           chatAIUtils.AST2Mindmap(note,ast)
//           MNUtil.stopHUD()
//         })
//         break;
//       default:
//         break;
//     }
} catch (error) {
  chatAIUtils.addErrorLog(error, "notificationController.prototype.executeAction", action)
}
}

/** @this {notificationController} */
notificationController.prototype.refreshCustomButton = function (){
  let actionImages = chatAIConfig.getActionImages()
  if (!actionImages) {
    MNUtil.log("No aciton images")
    return
  }
  // MNUtil.log({message:"refreshCustomButton",source:"MN ChatAI",detail:actionImages})

  this.bigbangButton.setImageForState(actionImages[0],0)
  this.commentButton.setImageForState(actionImages[1],0)
  this.titleButton.setImageForState(actionImages[2],0)
  this.copyButton.setImageForState(actionImages[3],0)
  this.excerptButton.setImageForState(actionImages[4],0)
  this.childButton.setImageForState(actionImages[5],0)
  this.reloadButton.setImageForState(actionImages[6],0)
  this.chatButton.setImageForState(actionImages[7],0)
}

/**
 * 
 * @param {string} path 
 * @returns {Promise<string[]>}
 * @this {notificationController}
 */
notificationController.prototype.getLocalFileContent = async function (path) {
    if (this.view.hidden) {
      // this.beginNotification("PDF")
      this.setNewResponse()
      await MNUtil.delay(0.1)
    }
    let pdfData = MNUtil.getFile(path)
    if (!pdfData) {
      return []
    }
    MNUtil.waitHUD("Progress: 0%")
    let loaded = await this.runJavaScript(`getProgress()`)
    // MNUtil.log({source:"MN ChatAI",message:"getLocalFileContent",detail:loaded})
    while (true){
      if (loaded) {
        break
      }
      await MNUtil.delay(0.1)
      loaded = await this.runJavaScript(`getProgress()`)
    }
    // MNUtil.copy(`getDocumentContent("${pdfData.base64Encoding()}")`)
    await this.runJavaScript(`getDocumentContent("${pdfData.base64Encoding()}")`)
    // this.runJavaScript(`getDocumentContent()`)
    let processPercent = 0
    await MNUtil.delay(0.1)
    let res = await this.getFileParsingProcess()
    processPercent = res.processPercent
    MNUtil.waitHUD("Progress: "+processPercent.toFixed(0)+"%")
    await MNUtil.delay(0.1)
    while (true){
      if (!res.onProcess && res.processPercent >= 100) {
        break
      }else{
        await MNUtil.delay(0.1)
      }
      res = await this.getFileParsingProcess()
      if (res.processPercent > processPercent) {
        processPercent = res.processPercent
        MNUtil.waitHUD("Progress: "+processPercent.toFixed(0)+"%")
      }
    }
    MNUtil.stopHUD()
    let pageContents = await this.getFileContent()
    return pageContents
}
/** @this {notificationController} */
notificationController.prototype.currentNote = async function (allowSelection = false) {
    let note = MNNote.new(this.noteid) ?? chatAIUtils.getFocusNote(allowSelection)
    note = note?.realGroupNoteForTopicId()
    return note
}
/** @this {notificationController} */
notificationController.prototype.userSelectAddNote = async function (content,format) {
    content = content.replace(/\\n/g,"\n")
    let selectingText = await this.getWebviewSelection()
    if (!selectingText && (Date.now()-this.selection.time < 5000)) {
      selectingText = this.selection.text
    }
    // let selectingText = await this.getWebviewContent()
    this.showHUD("➕ Add note: "+content)
    let note = MNNote.new(this.noteid)??chatAIUtils.getFocusNote()
    if (selectingText) {
      content = content+"\n\n"+selectingText
    }
    if (format === "markdown" && /^#/.test(content.trim())) {
        let contents = content.split("\n")
        let newTitle = contents[0].replace(/^#\s?/g,"")
        let contentRemain = contents.slice(1).join("\n").trim()
        let childNote = note.createChildNote({title:newTitle,excerptText:contentRemain,excerptTextMarkdown:true})
        childNote.focusInMindMap(0.5)
        return
    }
    let childNote = note.createChildNote({excerptText:content,excerptTextMarkdown:true})
    childNote.focusInMindMap(0.5)
}
notificationController.prototype.showErrorMessage = function (errorMessage) {
    if (errorMessage.info.source === "Subscription") {
      this.setWebviewContentDev({response:`<div><a href="userselect://changeURL" style="
    display: block;
    padding: 10px 12px;
    margin-top: 10px;
    background:rgb(252, 227, 227);
    color:rgb(150, 7, 7);
    border-radius: 8px;
    text-decoration: none;
    border: 2px solid transparent;
    border-color:rgb(249, 144, 144);
    font-size: 16px;
    cursor: pointer;
    box-sizing: border-box;
"
>
切换URL / Switch URL
</a></div>

\`\`\`json\n${JSON.stringify(errorMessage,null,2)}\n\`\`\``})
    }else{
      this.setWebviewContentDev({response:`\`\`\`json\n${JSON.stringify(errorMessage,null,2)}\n\`\`\``})
    }
}
notificationController.prototype.changeURL = async function () {
try {

  let currentURL = subscriptionConfig.URL
  let choices = subscriptionUtils.URLs.map((url,index)=>{
    if (url === currentURL) {
      return ("👉 URL"+(index+1)+" (Current)")
    }
    return "URL"+(index+1)
  })
  let res = await MNUtil.userSelect("MN ChatAI", "Select a URL\n\n请选择一个URL", choices)
  if (res !== 0) {
    subscriptionConfig.config.url = subscriptionUtils.URLs[res-1]
    subscriptionConfig.save()
    MNUtil.showHUD("✅ Change URL to: URL"+(res))
  }
  
} catch (error) {
  chatAIUtils.addErrorLog(error, "notificationController.changeURL")
}
}
notificationController.prototype.renderSearchResults = function (results,metaso = false) {
  if (this.hasRenderSearchResults) {
    return
  }
  this.hasRenderSearchResults = true
  if (metaso) {
    MNUtil.log({message:"renderSearchResultsForMetaso",detail:results})
    if (typeof results === "string") {
      this.runJavaScript(`renderSearchResultsForMetaso(\`${encodeURIComponent(results)}\`);`)
    }else{
      this.runJavaScript(`renderSearchResultsForMetaso(\`${encodeURIComponent(JSON.stringify(results))}\`);`)
    }
    return
  }
  if (typeof results === "string") {
    this.runJavaScript(`renderSearchResults(\`${encodeURIComponent(results)}\`);`)
  }else{
    this.runJavaScript(`renderSearchResults(\`${encodeURIComponent(JSON.stringify(results))}\`);`)
  }

}
notificationController.prototype.clearCache = function () {
  this.runJavaScript(`clearCache()`)
}
/**
 * @type {UIView}
 */
notificationController.prototype.view
/**
 * @type {notificationController}
 */
notificationController.prototype.addonController

