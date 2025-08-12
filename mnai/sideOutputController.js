/** @return {sideOutputController} */
const getSideOutputController = ()=>self
var sideOutputController = JSB.defineClass('sideOutputController : UIViewController <NSURLConnectionDelegate,UIWebViewDelegate>', {
  viewDidLoad: function() {
try {
    let self = getSideOutputController()
    self.init()
    self.custom = false;
    self.size = []
    self.onreceive = false
    self.refreshIdx = -1
    self.funcResponse = ""
    self.response = ''
    self.dynamic = true;
    self.shouldCopy = false
    self.shouldComment = false
    self.selectedText = '';
    self.searchedText = '';
    self.isLoading = false;
    self.toolbarOn = true;
    self.panelWidth = 100
    // self.view.frame = {x:chatAIUtils.getX(),y:chatAIUtils.getY(),width:MNExtensionPanel.width,height:120}
    self.view.frame = MNUtil.genFrame(chatAIUtils.getX(), chatAIUtils.getY(), MNExtensionPanel.width, 120)
    self.lastFrame = self.view.frame;
    // self.currentFrame = self.view.frame
    self.history = []
    self.title = "main"
    self.moveDate = Date.now()
    self.color = [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true]
    // self.view.layer.shadowOffset = {width: 0, height: 0};
    // self.view.layer.shadowRadius = 15;
    // self.view.layer.shadowOpacity = 0.4;
    // self.view.layer.shadowColor = MNUtil.hexColorAlpha("#838383",0.4);
    self.view.layer.cornerRadius = 8
    self.view.layer.opacity = 1.0
    self.view.layer.borderColor = MNUtil.hexColorAlpha("#9bb2d6",0.8)
    self.view.layer.borderWidth = 0
    self.view.backgroundColor = MNUtil.hexColorAlpha("#ffffff",0)
    self.view.autoresizingMask = (1 << 0 | 1 << 3);

    self.createButton("aiButton")
    self.aiButton.backgroundColor = MNUtil.hexColorAlpha("#ffffff",0.8)



    // self.createButton("aiModelButton")
    // MNButton.setTitle(self.aiModelButton, "model",17)
    // self.aiModelButton.setTitleColorForState(MNUtil.hexColorAlpha("#000000",0.8),0)
    // self.aiModelButton.backgroundColor = MNUtil.hexColorAlpha("#ffffff",0.8)

    let currentFrame = self.view.frame
    currentFrame.width = MNExtensionPanel.width
    self.currentFrame = currentFrame
    self.view.frame = currentFrame
    // self.setLayout()
    // MNUtil.copyJSON(self.currentFrame)
    if (self.view.hidden) {
      self.show()
    }
    let config = chatAIConfig.getConfigFromSource()
    self.currentModel = chatAIConfig.config.chatModel
    // MNUtil.copyJSON(config)
    // MNUtil.copy(self.currentModel)
    self.config = config
    // self.openChatView()
} catch (error) {
    chatAIUtils.addErrorLog(error, "viewDidLoad")
}
  },
  viewWillAppear: function(animated) {
  },
  viewWillDisappear: function(animated) {
  },
  viewWillLayoutSubviews: function() {
  let self = getSideOutputController()
    if (self.onAnimate) {
      // MNUtil.showHUD("message")
      return
    }
    self.setChatLayout()

  },
  closeButtonTapped:async function (params) {
  try {
    

    let self = getSideOutputController()
    if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
    if (self.connection) {
      self.connection.cancel()
      MNUtil.stopHUD()
      delete self.connection
    }
    MNUtil.toggleExtensionPanel()
  } catch (error) {
      chatAIUtils.addErrorLog(error, "closeButtonTapped")
  }
  },
  newChatTapped:async function (button) {
  try {
    

    let self = getSideOutputController()
    var commandTable = chatAIConfig.getConfig("promptNames").map((promptName)=>{
      return MNUtil.tableItem("💬    "+chatAIConfig.prompts[promptName].title.trim(), self, 'newChatFromPrompt:',promptName)
    })
    self.popover(button, commandTable,200,4)
  } catch (error) {
      chatAIUtils.addErrorLog(error, "newChatTapped")
    
  }
  },
  newChatFromPrompt: function (promptName) {
  try {
    let self = getSideOutputController()
    self.checkPopover()
    let prompt = chatAIConfig.prompts[promptName]
    MNUtil.showHUD("New Chat From: "+prompt.title)
    if (!("model" in prompt)) {
      prompt.model = "Default"
    }
    self.setCurrentModel(prompt.model)

    let newHistory = []
    if ("system" in prompt) {
      newHistory.push({role:"system",content:prompt.system})
    }
    self.history = newHistory
    self.userInput.text = prompt.context
    let newData = {data:newHistory,name:prompt.title,model:prompt.model}
    if ("func" in prompt) {
      self.funcIndices = prompt.func
      newData.funcIdxs = prompt.func
    }else{
      self.funcIndices = []
      newData.funcIdxs = []
    }
    if ("temperature" in prompt) {
      self.temperature = prompt.temperature
      newData.temperature = prompt.temperature
    }
    self.importData(newData)
  } catch (error) {
    chatAIUtils.addErrorLog(error, "newChatFromPrompt")
  }
    // newHistory.push({role:"user",content:prompt.context})
  },
  moreButtonTapped:async function (button) {
    let self = getSideOutputController()
    try {
    var commandTable = [
      MNUtil.tableItem('📤  Export history', self, 'exportHistory:'),
      MNUtil.tableItem('📥  Import history', self, 'importHistory:'),
      MNUtil.tableItem('🔄  Reload history', self, 'reloadHistory:')
    ];
    self.popover(button, commandTable,150,4)
      
    } catch (error) {
      
      chatAIUtils.addErrorLog(error, "moreButtonTapped")
    }
  },
  toggleNavEv: function () {
    let self = getSideOutputController()
    self.toggleNavEv()
  },
  exportHistory: function (params) {
    let self = getSideOutputController()
    self.checkPopover()
    let dataPath = subscriptionUtils.extensionPath+"/data/chatData.json"
    // let data = chatAIConfig.getChatData()
    MNUtil.saveFile(dataPath, ["public.json"])
    // MNUtil.copyJSON(data)
  },
  importHistory: async function (params) {
    let self = getSideOutputController()
    self.checkPopover()
    let dataPath = await MNUtil.importFile(["public.json"])
    MNUtil.showHUD("📥 Import history")
    let data= MNUtil.readJSON(dataPath)
    if ("chats" in data && "chatIdxs" in data && "folder" in data && "activeChatIdx" in data) {
      chatAIConfig.exportChatData(data)
      self.importData()
    }else{
      MNUtil.showHUD("Invalid history file!")
    }
  },
  reloadHistory: async function (params) {
    let self = getSideOutputController()
    self.checkPopover()
    let data = chatAIConfig.getChatData()
    if ("chats" in data && "chatIdxs" in data && "folder" in data && "activeChatIdx" in data) {
      MNUtil.showHUD("🔄 Reload history")
      self.importData()
    }else{
      MNUtil.showHUD("Invalid history file!")
    }
  },
  bigbang:async function () {
    let self = getSideOutputController()
    // let text = await self.getWebviewContent()
    let text = await self.getTextForAction()
    if (!self.noteid) {
      MNUtil.postNotification("bigbangText",{text:text})
    }else{
      MNUtil.postNotification("bigbangText",{text:text,noteid:self.noteid,url:chatAIUtils.getUrlByNoteId(self.noteid)})
    }
  },
  addChildNote: async function (button) {
  try {
    let self = getSideOutputController()
    let text = await self.getTextForAction(button.round)
    let noteid = chatAIUtils.getFocusNote().noteId ?? self.noteid
    if (!noteid) {
      MNUtil.showHUD("Unavailable")
      return;
    }
    let config = {excerptText:text,excerptTextMarkdown:true}
    let focusNote = MNNote.new(noteid)
    focusNote = focusNote.realGroupNoteForTopicId()
    let childNote = focusNote.createChildNote(config)
    // let childNote = chatAIUtils.createChildNote(noteid, config)
    // MNUtil.showHUD("Add child note")
    await MNUtil.delay(0.5)
    childNote.focusInMindMap()
    // chatAIUtils.focusNoteInMindMapById(childNote.noteId)
  } catch (error) {
      chatAIUtils.addErrorLog(error, "addChildNote")
  }
  },
  addQuoteToInput: async function (button) {
    let self = getSideOutputController()
    let text = await self.getTextForAction(button.round)
    self.addToInput(text)
  },
  copy: async function (button) {
  // MNUtil.showHUD("copy")
  // self.runJavaScript(`editor.setTheme("dark","dark");`)
  try {
    let self = getSideOutputController()
    let text = await self.getTextForAction(button.round)
    // let text = await self.getWebviewContent()
    MNUtil.copy(text)
    MNUtil.showHUD("Copy text")
  } catch (error) {
      chatAIUtils.addErrorLog(error, "copy")
  }
  },

  reAsk:async function (button) {
    let self = getSideOutputController()
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
    if (self.history.length === 0) {
      MNUtil.showHUD("No context!")
      return
    }
      try {
      self.notShow = false
      self.called = true
      self.response = ""
      self.preFuncResponse = ''
      let last = self.history.pop()
      let question = undefined
      while (last.role !== "user") {
        last = self.history.pop()
      }
      // MNUtil.copyJSON(self.history)
      question = last.content
      // if (last.role === "user") {
      //   question = last.content
      //   // MNUtil.showHUD(question)
      // }else{
      //   last = self.history.pop()
      //   // question = self.history.pop().content
      // }
      // let md2html = MNUtil.md2html("I'm thinking...")
      // self["assistant"+self.round].loadHTMLStringBaseURL(chatAIUtils.html(md2html,false,false))
      self["assistant"+self.round].loadFileURLAllowingReadAccessToURL(
        NSURL.fileURLWithPath(chatAIConfig.mainPath + `/veditor_${self.theme}.html`),
        NSURL.fileURLWithPath(chatAIConfig.mainPath + '/')
      );
      self["assistant"+self.round].sizeHeight = 50
      self.setChatLayout()
      // self["assistant"+self.round].frame = MNUtil.genFrame(5,5, self.view.frame.width-10, 50)
      self.continueAsk(question)
      } catch (error) {
        chatAIUtils.addErrorLog(error, "reAsk")
      }

  },
  setNoteTitle: async function(button) {
    let self = getSideOutputController()
    let noteid = chatAIUtils.getFocusNote().noteId ?? self.noteid
    if (!noteid) {
      MNUtil.showHUD("Unavailable")
      return;
    }
    let note = MNUtil.getNoteById(noteid)
    let text = await self.getTextForAction(button.round)
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
  },
  setExcerpt: async function (button) {
    let text = await self.getTextForAction(button.round)
    // let text = await self.getWebviewContent()

  try {
    let noteid = chatAIUtils.getFocusNote().noteId ?? self.noteid
    if (!noteid) {
      MNUtil.showHUD("Unavailable")
      return
    }
    let note = MNNote.new(noteid)
    MNUtil.undoGrouping(()=>{
      note.excerptText = text.trim()
    })
  } catch (error) {
      chatAIUtils.addErrorLog(error, "setExcerpt")
  }
  },
  setComment: async function (button) {
    let text = await self.getTextForAction(button.round)
    // let text = await self.getWebviewContent()

  try {
    let noteid = chatAIUtils.getFocusNote().noteId ?? self.noteid
    if (!noteid) {
      MNUtil.showHUD("Unavailable")
      return
    }
    let note = MNUtil.getNoteById(noteid)
    MNUtil.undoGrouping(()=>{
      try {
        note.appendMarkdownComment(text.trim())
      } catch (error) {
        note.appendTextComment(text.trim())
      }
    })
  } catch (error) {
      chatAIUtils.addErrorLog(error, "setComment")
  }
  },
  showAILink: async function () {
    if (!self.noteid) {
      MNUtil.showHUD("Unavailable")
    }
    let text = await self.getTextForAction()
    // let text = await self.getWebviewContent()
    MNUtil.postNotification("aiLinkOnText",{text:text,noteid:self.noteid})
  },
  changeFunc: function (button) {
  try {
    let self = getSideOutputController()
    let currentFunc = self.funcIndices
    let selector = 'setFunc:'
    let newOrder = chatAITool.activatedToolsExceptOld
    let isAllTools = newOrder.every(toolIndex=>currentFunc.includes(toolIndex))
    let menu = new Menu(button,self)
    menu.width = 250
    menu.rowHeight = 35
    menu.preferredPosition = 0
    menu.addMenuItem("🌟 All Tools",        selector,100,isAllTools)
    let toolNames = chatAITool.toolNames
    newOrder.map((toolIndex)=>{
      let toolName = toolNames[toolIndex]
      let tool = chatAITool.getToolByName(toolName)
      menu.addMenuItem(tool.toolTitle,        selector,toolIndex,currentFunc.includes(toolIndex))
    })
    menu.addMenuItem("🗿 Old Tools (Free)", "showOldTools:",button)
    menu.addMenuItem("❌ None",             selector,-1,currentFunc.length === 0)
    menu.show()
    } catch (error) {
      chatAIUtils.addErrorLog(error, "sideOutputController.changeFunc")
    }
  },
  showOldTools: function(button){
  try {
    let self = getChatglmController()
    Menu.dismissCurrentMenu()
    let currentFunc = self.funcIndices
    let selector = 'setFunc:'
    let newOrder = chatAITool.oldTools
    let menu = new Menu(button,self)
    menu.width = 250
    menu.rowHeight = 35
    menu.preferredPosition = 0
    let toolNames = chatAITool.toolNames
    newOrder.map((toolIndex)=>{
      let toolName = toolNames[toolIndex]
      let tool = chatAITool.getToolByName(toolName)
      menu.addMenuItem(tool.toolTitle,        selector,toolIndex,currentFunc.includes(toolIndex))
    })
    menu.show()
  } catch (error) {
    chatAIUtils.addErrorLog(error, "changeFunc")
  }
  },
  setFunc: function (index) {
    let self = getSideOutputController()
    Menu.dismissCurrentMenu()
    if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
try {
    let currentFunc = chatAITool.getChangedTools(self.funcIndices, index)
    self.funcIndices = currentFunc
    self.setCurrentFuncIdxs(currentFunc)
    chatAIConfig.config.chatFuncIndices = currentFunc
    chatAIConfig.save("MNChatglm_config")
} catch (error) {
  MNUtil.showHUD(error)
}
  },
  changeChatModel:function (button) {
    let self = getSideOutputController()
    if (!chatAIUtils.checkSubscribe(false)) {
      return
    }
    try {
    let selector = 'setChatModel:'
    let modelName = self.currentModel
    let allModels = chatAIConfig.allSource(false,true)
    var commandTable = [
      self.tableItem("Default", selector,"Default",modelName === "Default"),
      self.tableItem("Built-in", selector,"Built-in",modelName === "Built-in")
    ]
    let secondSelector = 'changePromptModelFromSource:'
    // allModels.map(m=>{
    //   if (chatAIConfig.hasAPIKeyInSource(m)) {
    //     commandTable.push(self.tableItem("➡️  "+m,secondSelector,{source:m,button:button},modelName.startsWith(m)))
    //   }
    // })
    allModels.map((m,index)=>{
      if (chatAIConfig.hasAPIKeyInSource(m)) {
        if (modelName.startsWith(m)) {
          commandTable.push(self.tableItem("👉  "+m,secondSelector,{source:m,button:button,index:index},true))
        }else{
          commandTable.push(self.tableItem("➡️  "+m,secondSelector,{source:m,button:button,index:index},false))
        }
      }
    })
    // var commandTable = [...new Set(allModels)].map(model=>{
    //   let title = model.replace("Subscription: ","💲  ")
    //   return MNUtil.tableItem(title, self, selector, model,modelName === model)
    // })
    self.popover(button, commandTable,220,1)
    // self.popoverController = MNUtil.getPopoverAndPresent(button,commandTable,350,1)
    // self.popoverController = MNUtil.getPopoverAndPresent(button,commandTable,250)
    } catch (error) {
      chatAIUtils.addErrorLog(error, "changeChatModel")
    }
  },
  changePromptModelFromSource: function (params) {
 try {
    let self = getChatglmController()
    let source = params.source
    let button = params.button
    let selectIndex = params.index
    self.checkPopover()
    let modelName = self.currentModel
    let selector = 'setChatModel:'

    let allModels = chatAIConfig.allSource(false,true)
    var commandTable = [
      self.tableItem("Default", selector,"Default",modelName === "Default"),
      self.tableItem("Built-in", selector,"Built-in",modelName === "Built-in")
    ]
    let secondSelector = 'changePromptModelFromSource:'
    let sourceModels = chatAIConfig.getAvailableModels(source)
    let widths = []
    allModels.map((m,index)=>{
      if (chatAIConfig.hasAPIKeyInSource(m)) {
        if (index === selectIndex) {
          commandTable.push(self.tableItem("👇  "+m,"",{source:m,button:button},false))
        }else if (modelName.startsWith(m)) {
          commandTable.push(self.tableItem("👉  "+m,secondSelector,{source:m,button:button,index:index},true))
        }else{
          commandTable.push(self.tableItem("➡️  "+m,secondSelector,{source:m,button:button,index:index},false))
        }
      }
    })
    let tablesToInsert = sourceModels.map(model=>{
      let m = "       🤖  "+model.split(": ")[1].trim()
      widths.push(chatAIUtils.strCode(m))
      return self.tableItem(m, selector,model,modelName === model)
    })
    commandTable.splice(selectIndex+3,0,...tablesToInsert)
    self.popover(button, commandTable,Math.max(...widths)*9+30,1)
    
  } catch (error) {
    chatAIUtils.addErrorLog(error, "changePromptModelFromSource")
  }
  },
  setChatModel:function (chatModel) {
    let self = getSideOutputController()
    if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
    if (chatModel !== "Default" && !chatAIUtils.checkSubscribe(true)) {
      return
    }
      MNUtil.showHUD("Change model to: "+chatModel)
      self.setCurrentModel(chatModel)
      chatAIConfig.config.chatModel = chatModel
      chatAIConfig.save("MNChatglm_config")
  },
  setChatModelAndReAsk:function (chatModel) {
    if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
    if (chatModel !== "Default" && !chatAIUtils.checkSubscribe(true)) {
      return
    }
    MNUtil.showHUD("ReAsk with model: "+chatModel)
    self.currentModel = chatModel
    let config = chatAIConfig.parseModelConfig(chatModel)
    // let modelConfig = chatModel.split(":").map(model=>model.trim())
    // if (modelConfig[0] !== "Default") {
    //   let source = modelConfig[0]
    //   config = chatAIConfig.getConfigFromSource(source)
    //   if (modelConfig.length === 2) {
    //     config.model = modelConfig[1]
    //   }
    // }else{
    //   config = chatAIConfig.getConfigFromSource()
    // }
    self.config = config
try {
      self.notShow = false
      self.called = true
      self.response = ""
      self.preFuncResponse = ''
      let last = self.history.pop()
      let question = undefined
      while (last.role !== "user") {
        last = self.history.pop()
      }
      question = last.content
      self["assistant"+self.round].loadFileURLAllowingReadAccessToURL(
        NSURL.fileURLWithPath(chatAIConfig.mainPath + `/veditor_${self.theme}.html`),
        NSURL.fileURLWithPath(chatAIConfig.mainPath + '/')
      );
      self["assistant"+self.round].sizeHeight = 50
      self.setChatLayout()
      self.continueAsk(question)
      } catch (error) {
        chatAIUtils.addErrorLog(error, "reAsk")
      }
  },
  askWithPrompt: async function (prompt) {
    let self = getSideOutputController()
    if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
    self.askWithPrompt(prompt)
  },
  clearHistory:async function (params) {
    let self = getSideOutputController()
    if (self.connection) {
      MNUtil.showHUD("Wait...")
      return
    }
    let confirm = await MNUtil.confirm("MN Chat AI\nClear history?", "清除当前对话历史？")
    if (confirm) {
      self.clearHistory()
    }
  },
  sendButtonTapped: async function (params) {
    try {
    let self = getSideOutputController()
    if (self.connection) {
      MNUtil.showHUD("Wait...")
      return
    }
    
    let text = self.getInputext()
    if (!text) {
      return
    }
    // MNUtil.copy(text)
    self.preFuncResponse = ""
    await self.continueAsk(text)
    self.chatSendMessage(self.history.at(-1))
    self.userReference.text = ""
    self.userReference.hidden = true
    self.resizeButton.hidden = false
    self.resizeButton.backgroundColor = MNUtil.hexColorAlpha("#afafaf",1)
    } catch (error) {
      chatAIUtils.addErrorLog(error, "sendButtonTapped")
    }
  },
  onLongPressSend: async function (gesture) {
    if (gesture.state === 1) {
      self.userInput.text = ""
      MNUtil.showHUD("Clear input")
    }
  },
  onLongPressReference: async function (gesture) {
    if (gesture.state === 1) {
      self.userReference.hidden = !self.userReference.hidden
      if (self.userReference.hidden) {
        MNUtil.showHUD("Hide Reference",0.5,self.chatToolbar)
        // self.showHUD("Hide Reference")
      }else{
        MNUtil.showHUD("Show Reference",0.5,self.chatToolbar)
        // self.showHUD("Show Reference")
      }
    }
  },
  onMoveGesture: async function (gesture) {
    let referenceView = MNExtensionPanel.view
    let location = chatAIUtils.getNewLoc(gesture,referenceView)
    let frame = self.chatToolbar.frame
    if (MNExtensionPanel.width < 350) {
      location.x = 0
    }else{
      location.x = MNUtil.constrain(location.x, 0,MNExtensionPanel.width - 200)
    }
    location.y = MNUtil.constrain(location.y, 0, MNExtensionPanel.height-80)
    self.chatToolbar.frame = MNUtil.genFrame(location.x,location.y,frame.width,frame.height)
    // self.custom = false;
    // if (gesture.state === 3) {
    //   MNUtil.studyView.bringSubviewToFront(self.view)
    // }
  },
  /**
   * 
   * @param {UIButton} button 
   */
  openImage: function (button) {
    let imageBase64 = button.currentImage.pngData().base64Encoding()
    let url = "data:image/png;base64," + imageBase64
    MNUtil.postNotification("openInBrowser", {url:url})

    // MNUtil.copyImage(imageData)
  },
  /**
   * 
   * @param {UIButton} button 
   */
  imageButtonTapped: function (button) {
    var commandTable = [
      {title:"📄   From File",object:self,selector:"importImage:",param:"file"},
      {title:"🖼️   From Photo",object:self,selector:"importImage:",param:"photo"},
      {title:"📷   From Camera",object:self,selector:"importImage:",param:"camera"},
      {title:"📋   From Clipboard",object:self,selector:"importImage:",param:"clipboard"},
      {title:"ℹ️   From Selection",object:self,selector:"importImage:",param:"selection"},
      {title:"📝   From CurrentNote",object:self,selector:"importImage:",param:"note"},
      {title:"❌   Cancel image",object:self,selector:"importImage:",param:"cancel"},
    ]
    self.popoverController = MNUtil.getPopoverAndPresent(button,commandTable,250,0)
  },
  importImage: async function (param) {
    // MNUtil.showHUD("12"+param)
    let self = getSideOutputController()
    if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
    let imageData
    switch (param) {
      case "cancel":
        self.resetImageInChat()
        return
      case "file":
        let imagePath = await MNUtil.importFile(["public.png"])
        imageData = NSData.dataWithContentsOfFile(imagePath)
        break;
      case "photo":
        self.imagePickerController = UIImagePickerController.new()
        self.imagePickerController.delegate = self  // 设置代理
        self.imagePickerController.sourceType = 0  // 设置图片源为相册
        // self.imagePickerController.allowsEditing = true  // 设置图片源为相册
        MNUtil.studyController.presentViewControllerAnimatedCompletion(self.imagePickerController,true,undefined)
        return;
      case "camera":
        self.imagePickerController = UIImagePickerController.new()
        self.imagePickerController.delegate = self  // 设置代理
        self.imagePickerController.sourceType = 1  // 设置图片源为相机
        // self.imagePickerController.allowsEditing = true  // 设置图片源为相册
        MNUtil.studyController.presentViewControllerAnimatedCompletion(self.imagePickerController,true,undefined)
        return;
      case "clipboard":
        let image = UIPasteboard.generalPasteboard().image
        if (image) {
          imageData = image.pngData()
        }else{
          MNUtil.showHUD("No image in clipboard");
          return;
        }
        break;
      case "selection":
        imageData = MNUtil.getDocImage(true)
        if (!imageData) {
          MNUtil.showHUD("No image found");
          return;
        }
        break;
      case "note":
        let focusNote = chatAIUtils.getFocusNote()
        if (!focusNote) {
          MNUtil.showHUD("No note selected")
          return
        }
        let images = chatAIUtils.getImagesFromNote(focusNote)
        // imageData = MNNote.getImageFromNote(focusNote)
        if (images.length) {
          imageData = images[0]
        }
        if (!imageData) {
          MNUtil.showHUD("No image found")
          return
        }
        break;
      default:
        break;
    }
    if (imageData) {
      // MNUtil.copyImage(imageData)
      self.addImageInChat(imageData)
    }
    return
    MNUtil.showHUD("Not Implemented")
  
  },
  imagePickerControllerDidFinishPickingMediaWithInfo:async function (UIImagePickerController,info) {
    try {
      
    let image = info.UIImagePickerControllerOriginalImage
    // MNUtil.copy(image.pngData().base64Encoding())
    // MNUtil.copyJSON(info)
    MNUtil.studyController.dismissViewControllerAnimatedCompletion(true,undefined)
    let imageData = image.jpegData(0.0)
    self.addImageInChat(imageData)
    } catch (error) {
      MNUtil.showHUD(error)
    }
  },
  imagePickerControllerDidCancel:function (params) {
    // MNUtil.copy("text")
    MNUtil.studyController.dismissViewControllerAnimatedCompletion(true,undefined)
    
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
   * @param {UITextView} textview 
   */
  textViewDidChange:function (textview) {
    if (textview !== self.userInput) {
      if (textview === self.userReference) {
        if (!textview.text.trim()) {
          self.resizeButton.backgroundColor = MNUtil.hexColorAlpha("#afafaf",1)
        }else{
          self.resizeButton.backgroundColor = MNUtil.hexColorAlpha("#e06c75",1)
        }
      }
      return
    }
    let frame = self.view.frame
    let inputFrame = self.userInput.frame
    let size = textview.sizeThatFits({width:inputFrame.width,height:1000})
    if (size.height < 80) {
      size.height = 80
    }
    self.userInput.custom = true
    // inputFrame.custom = true
    // if (size.height > 85) {
    inputFrame.y = 35
      // size.height = 85
    // }
    inputFrame.height = size.height
    self.userInput.frame = inputFrame
    let chatToolbarFrame = self.chatToolbar.frame
    chatToolbarFrame.height = inputFrame.y+inputFrame.height
    self.chatToolbar.frame = chatToolbarFrame
    // self.userInput.frame = MNUtil.genFrame(0,frame.height-85, frame.width-50, size.height)
    if (/\n\n$/.test(textview.text) && textview.text.trim()) {
      if (self.connection) {
        MNUtil.showHUD("Wait...")
        return
      }
      try {
        let text = self.getInputext()
        if (!text) {
          return
        }
        self.continueAsk(text)
        self.chatSendMessage(self.history.at(-1))
      } catch (error) {
        chatAIUtils.addErrorLog(error, "textViewDidChange")
      }
    }
    
  },
  resizeButtonTapped:async function (button) {
    if (self.userReference.text) {
      var commandTable = [
        {title:"❌   Clear Reference",object:self,selector:"referenceAction:",param:"clearReference"}
      ]
      if(self.userReference.hidden){
        commandTable.push({title:"   Show Reference",object:self,selector:"referenceAction:",param:"showReference"})
      }else{
        commandTable.push({title:"   Show User Input",object:self,selector:"referenceAction:",param:"hideReference"})
      }
      self.popoverController = MNUtil.getPopoverAndPresent(button,commandTable,200,0)
    }else{
      let selection = await self.runJavaScript(`window.getSelection().toString();`,"chatWebview")
      if (selection.trim()) {
        self.userReference.text = selection
        self.userReference.hidden = false
        self.resizeButton.backgroundColor = MNUtil.hexColorAlpha("#e06c75",1)
        return
      }
      var commandTable = [
        {title:"   From Note",object:self,selector:"referenceAction:",param:"importFromNote"},
        {title:"   From Clipboard",object:self,selector:"referenceAction:",param:"importFromClipboard"},
        {title:"   From Selection on Doc",object:self,selector:"referenceAction:",param:"importFromDocSelection"},
        {title:"   From Selection on Chat",object:self,selector:"referenceAction:",param:"importFromChatSelection"},
        {title:"   From Selection on Note",object:self,selector:"referenceAction:",param:"importFromNoteSelection"},
      ]
      self.popoverController = MNUtil.getPopoverAndPresent(button,commandTable,200,0)
    }
  },
  referenceAction: async function (action) {
    if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
    switch (action) {
      case "clearReference":
        self.userReference.text = ""
        self.userReference.hidden = true
        self.resizeButton.hidden = false
        self.resizeButton.backgroundColor = MNUtil.hexColorAlpha("#afafaf",1)
        break;
      case "showReference":
        self.userReference.hidden = false
        break;
      case "hideReference":
        self.userReference.hidden = true
        break;
      case "importFromClipboard":
        self.userReference.text = MNUtil.clipboardText
        self.userReference.hidden = false
        self.resizeButton.backgroundColor = MNUtil.hexColorAlpha("#e06c75",1)
        break
      case "importFromDocSelection":
        if (MNUtil.currentSelection && MNUtil.currentSelection.onSelection) {
          self.userReference.text = MNUtil.currentSelection.text
          self.userReference.hidden = false
          self.resizeButton.backgroundColor = MNUtil.hexColorAlpha("#e06c75",1)
        }else{
          MNUtil.showHUD("No selection")
        }
        break;
      case "importFromChatSelection":
        let selection = await self.runJavaScript(`window.getSelection().toString();`,"chatWebview")
        if (selection) {
          self.userReference.text = selection
          self.userReference.hidden = false
          self.resizeButton.backgroundColor = MNUtil.hexColorAlpha("#e06c75",1)
        }else{
          MNUtil.showHUD("No selection")
        }
        break;
      case "importFromNoteSelection":
        if (MNUtil.activeTextView) {
          let selectedRange = MNUtil.activeTextView.selectedRange
          if (selectedRange.length > 0) {
            self.userReference.text = MNUtil.activeTextView.text.slice(selectedRange.location,selectedRange.location+selectedRange.length)
          }else{
            self.userReference.text = MNUtil.activeTextView.text
          }
          self.userReference.hidden = false
          self.resizeButton.backgroundColor = MNUtil.hexColorAlpha("#e06c75",1)
        }else{
          MNUtil.showHUD("No selection")
        }
        break;
      case "importFromNote":
        if (chatAIUtils.currentNoteId) {
          // let note = MNNote.new(chatAIUtils.currentNoteId)
          self.userReference.text = `{{note:${chatAIUtils.currentNoteId}}}`
          self.userReference.hidden = false
          self.resizeButton.backgroundColor = MNUtil.hexColorAlpha("#e06c75",1)
          // let hasImage = chatAIUtils.hasImageInNote(note)
          // if (hasImage && chatAIConfig.getConfig("autoImage")) {
          //   let imageData = MNNote.getImageFromNote(note)
          //   chatAIUtils.sideOutputController.addToInput(userInput,imageData)
          // }else{
          //   chatAIUtils.sideOutputController.addToInput(userInput)
          // }
          return
        }else{
          MNUtil.showHUD("No note selected")
          return
        }
        break;
      default:
        MNUtil.showHUD("Unspported action")
        break;
    }
  },
  clearReference:function (params) {
    if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
    self.userReference.text = ""
    self.userReference.hidden = true
    self.resizeButton.hidden = false
    this.resizeButton.backgroundColor = MNUtil.hexColorAlpha("#afafaf",1)
  },
  onResizeGesture:function (gesture) {
    // MNUtil.showHUD("message")
    // return
    let self = getSideOutputController()
    self.custom = false;
    // self.dynamic = false;
    let baseframe = gesture.view.frame
    let locationToBrowser = gesture.locationInView(self.chatToolbar)
    let height = locationToBrowser.y+baseframe.height*0.3
    height = height - self.userReference.frame.y
    height = chatAIUtils.constrain(height, 32, MNExtensionPanel.height)

    let viewFrame = self.chatToolbar.frame
    viewFrame.width = MNExtensionPanel.width
    viewFrame.height = MNExtensionPanel.height
    // let inputFrame = self.userInput.frame
    // self.userInput.frame = MNUtil.genFrame(4,inputFrame.y, viewFrame.width-63, inputFrame.height)
    self.userReference.frame = MNUtil.genFrame(4,4, viewFrame.width-8, height)
    self.resizeButton.frame = MNUtil.genFrame(viewFrame.width-25,height-17, 20, 20)
  },
    /**
   * 
   * @param {UIWebView} webView 
   */
  webViewDidFinishLoad: async function(webView) {
    if (webView === self.chatWebview) {
      if (self.history && self.history.length) {
        let newData = {data:self.history}
        if (self.funcIndices && self.funcIndices.length) {
          newData.funcIdxs = self.funcIndices
        }
        if (self.currentPrompt && self.currentPrompt !== "Dynamic") {
          newData.name = chatAIConfig.prompts[self.currentPrompt].title
        }else{
          let firstUser = self.history.find(item=>item.role === "user")
          if (typeof firstUser.content === "string") {
            newData.name = firstUser.content.slice(0,10)
          }else{
            newData.name = firstUser.content.find(item=>item.type = "text").text.slice(0,10)
          }
        }
        if (self.temperature !== undefined) {
          newData.temperature = self.temperature
        }
        if (self.currentModel) {
          newData.model = self.currentModel
        }
        self.importData(newData)
      }else{
        self.importData()
      }
      if (self.preFilledUserInput) {
        self.userInput.text = self.preFilledUserInput
        self.preFilledUserInput = undefined
      }
    }
  },
  webViewShouldStartLoadWithRequestNavigationType: function(webView,request,type){
    let requestURL = request.URL().absoluteString()
    // MNUtil.copy(requestURL)
    if (/^nativecopy\:\/\//.test(requestURL)) {
      let text = decodeURIComponent(requestURL.split("content=")[1])
      MNUtil.copy(text)
      return false
    }
    if (/^editorselect\:\/\//.test(requestURL)) {
      let text = decodeURIComponent(requestURL.split("content=")[1])
      MNUtil.copy(text)
      return false
    }
    if (/^editorheight\:\/\//.test(requestURL)) {
      let height = decodeURIComponent(requestURL.split("content=")[1])
      // MNUtil.showHUD("height: "+height)
      return false
    }
    if (/^chataction\:\/\/stopLoading/.test(requestURL)) {
      self.connection.cancel()
      delete self.connection
      // MNUtil.showHUD("stopLoading")
      self.setButtonOpacity(1.0)
      MNUtil.stopHUD()
      return false
    }
    if (/^chataction\:\/\/activeChat/.test(requestURL)) {
      // MNUtil.showHUD("activeChat")
      let content = decodeURIComponent(requestURL.split("activeChat=")[1])
      let chatsData = JSON.parse(content)
      self.history = chatsData.data
      if ("funcIdxs" in chatsData) {
        self.funcIndices = chatsData.funcIdxs
      }else{
        self.funcIndices = []
      }
      if ("model" in chatsData) {
        self.setCurrentModel(chatsData.model)
      }
      if ("temperature" in chatsData) {
        self.temperature = chatsData.temperature
      }
      // MNUtil.copyJSON(self.history)
      return false
    }
    if (/^chataction\:\/\/refreshChat/.test(requestURL)) {
      let content = decodeURIComponent(requestURL.split("refreshChat=")[1])
      let config = JSON.parse(content)
      // MNUtil.copy(config)
      self.history = config.history
      self.afterHistory = config.afterHistory
      let last = self.history.pop()
      let question = undefined
      while (last.role !== "user") {
        last = self.history.pop()
      }
      // MNUtil.copyJSON(self.history)
      question = last.content
      self.continueAsk(question)
      // let chatsData = JSON.parse(content)
      return false
    }
    if (/^chataction\:\/\/updateChat/.test(requestURL)) {
      try {
      // MNUtil.showHUD("updateChat")
      let tem = decodeURIComponent(requestURL.split("updateChat=")[1])
      let allData = JSON.parse(tem)
      let chatsData = allData.chats
      let activeChatIdx = allData.activeChatIdx
      let currentChat = chatsData[activeChatIdx]
      self.history = currentChat.data
      if ("funcIdxs" in currentChat) {
        self.funcIndices = currentChat.funcIdxs
      }else{
        self.funcIndices = []
      }
      if ("model" in chatsData) {
        self.setCurrentModel(chatsData.model)
      }
      if ("temperature" in chatsData) {
        self.temperature = chatsData.temperature
      }
      // MNUtil.copyJSON(self.history)
      chatAIConfig.exportChatData(allData)
      } catch (error) {
        chatAIUtils.addErrorLog(error, "updateChat")
      }
      return false
    }
    if (/^chataction\:\/\/showError/.test(requestURL)) {
      let error = decodeURIComponent(requestURL.split("showError=")[1])
      MNUtil.showHUD(error)
      return false
    }
    if (/^chataction\:\/\//.test(requestURL)) {
      let content = decodeURIComponent(requestURL.split("content=")[1])
      MNUtil.showHUD(content)
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
      let endFrame = beginFrame
      let studyFrame = MNUtil.studyView.bounds
      if ((beginFrame.x+beginFrame.width*2) < studyFrame.width) {
        endFrame.x = beginFrame.x+beginFrame.width
        MNUtil.postNotification("openInBrowser", {url:requestURL,beginFrame:beginFrame,endFrame:endFrame})
        return false
      }
      if ((beginFrame.x-beginFrame.width) > 0) {
        endFrame.x = beginFrame.x-beginFrame.width
        MNUtil.postNotification("openInBrowser", {url:requestURL,beginFrame:beginFrame,endFrame:endFrame})
        return false
      }
      MNUtil.postNotification("openInBrowser", {url:requestURL})
      return false
    }
    return true;
  },
  connectionDidReceiveResponse: async function (connection,response) {
    let self = getSideOutputController()
    self.setButtonOpacity(0.5)
    // self.response = ""
    self.reasoningResponse = ""
    self.funcResponse = ""
    self.originalText = ""
    self.notShow = false
    self.size = []
    self.func = undefined
    self.tool = {}
    self.preHeight = 0
    self.autoHide = true
    self.scrollToBottom = false
    self.first = true
    self.onFinish = false
    // chatAIUtils.copyJSON(self.token)
    self.statusCode = response.statusCode()
    if (self.statusCode >= 400) {
      MNUtil.stopHUD()
      MNUtil.showHUD("❗"+MNUtil.getStatusCodeDescription(""+self.statusCode))
      self.errorMessage = {
        message:"❗"+MNUtil.getStatusCodeDescription(""+self.statusCode),
        statusCode: self.statusCode,
        info: self.config
      }
      MNUtil.stopHUD()
      self.setButtonOpacity(1.0)
      delete self.connection
      // return
    }
    self.currentData = NSMutableData.new()
    // chatAIUtils.showStatusCodeDescription(self.statusCode.toString())
    // MNUtil.copy("code:"+self.statusCode)
    self.setChatLayout()
    MNUtil.stopHUD()
  },

  connectionDidReceiveData: async function (connection,data) {
    let self = getSideOutputController()
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
        MNUtil.confirm(res.message, JSON.stringify(res,undefined,2))
      }
      MNUtil.showHUD(contentToShow)
      self.stopLoading(false)
      self.setButtonOpacity(1.0)
      // await MNUtil.delay(0.1)
      // self.setWebviewContentDev({response:`\`\`\` json\n${JSON.stringify(self.errorMessage,undefined,2)}\n\`\`\``})
      // self.runJavaScript(`openEdit();`)
      connection.cancel()
      delete self.connection
      return
    }
    self.hasDone = /^data:\s?\[DONE\]/.test(textString)
    if (self.hasDone) {
      self.textString = textString
    }else{
      if (/^data\:\s{"base_resp"\:{"status_code"\:\d\d+/.test(textString)) {
        chatAIUtils.addErrorLog(textString, "connectionDidReceiveData")
        return
      }
    }
    // self.originalText = self.originalText+textString
    self.originalText = MNUtil.data2string(self.currentData)

    self.getResponse().then(()=>{
    // await self.setResponseText(self.preFuncResponse+self.funcResponse)
    if (self.hasDone) {
      if (!self.onFinish && self.connection && (self.connection === connection)) {
        self.onFinish = true
        // self.beginTime = Date.now()
        self.prepareFinish()
        // MNUtil.showHUD("finish")
        // MNUtil.copy(self.textString)
      }
    }else{
      self.setChatLayout()
    }
    return
    })
  },
  connectionDidFinishLoading: function (connection) {
  // let self = getSideOutputController()
  if (!self.onFinish && self.connection && (self.connection === connection)) {
    self.onFinish = true
    self.prepareFinish()
    // MNUtil.showHUD("finish")
    // MNUtil.copy(self.textString)
  }

    MNUtil.stopHUD()
  },
  connectionDidFailWithError: function (connection,error) {
    MNUtil.copyJSON(error.userInfo)
    MNUtil.showHUD("Network error")
    MNUtil.stopHUD()
    self.stopLoading(false)
    self.setButtonOpacity(1.0)
    delete self.connection
  }
});

sideOutputController.prototype.preCheck = function () {
  if (this.connection) {
    MNUtil.showHUD("on output")
    return false
  }
  if (this.notShow && !this.called) {
    // MNUtil.showHUD("not show")
    return false
  }
  if (chatAIUtils.checkSubscribe(false,false,true)) {
    chatAIUtils.chatController.usageButton.setTitleForState("Unlimited",0)
    return true
  }
  if (chatAIConfig.config.source === "Built-in") {
    let usage = chatAIConfig.getUsage()
    if (usage.usage >= usage.limit) {
        MNUtil.confirm("Access limited", "You have reached the usage limit for today. Please subscribe to continue or use other AI providers.\n\n 当天免费额度已用完，请订阅或使用其他AI提供商。")
      return false
    }else{
      usage.usage = usage.usage+1
    }
    if (chatAIUtils.chatController.usageButton) {
      chatAIUtils.chatController.usageButton.setTitleForState("Usage: "+usage.usage+"/100",0)
    }
    chatAIConfig.save("MNChatglm_usage")
  }
  return true
}

/**
 * Base method to initiate an AI request.
 * 
 * This method prepares the AI request by setting up the necessary configurations and initializing the request based on the source model.
 * 
 * @this {sideOutputController} 
 * @param {string} question - The question or prompt to be sent to the AI.
 * @param {{key:String,url:String,model:String}} [config=chatAIConfig.getConfigFromSource()] - Configuration object containing API key, URL, and model information.
 * @param {number} [temperature=0.8] - The temperature parameter for the AI model, controlling the randomness of the output.
 * @throws {Error} - Throws an error if there is an issue during the request initialization.
 */
sideOutputController.prototype.baseAsk = async function(
  question,
  config = chatAIConfig.getConfigFromSource(),  
  temperature=undefined
) {
try {
  // chatAIUtils.copyJSON(config)
  this.question = question
  this.history = [].concat(question)
  this.config = config
  this.temperature = temperature
  if (!this.funcIndices.length) {
    this.funcIndices = config.func ?? []
  }
  this.actions = config.action ?? []
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
    case "Volcengine":
    case "Github":
    case "Qwen":
    case "ChatGPT":
    case "Subscription":
    case "Custom":
    case "Gemini":
      request =chatAINetwork.initRequestForChatGPT(this.history,config.key,config.url,config.model,this.temperature,this.funcIndices)
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
      MNUtil.showHUD("Unsupported source: "+this.source)
      return
  }
  this.sendStreamRequest(request)
  chatAIUtils.lastTime = Date.now()
} catch (error) {
  chatAIUtils.addErrorLog(error, "baseAsk")
}
}

/** 
 * @this {sideOutputController} 
 * @param {String} prompt
 */
sideOutputController.prototype.askWithPrompt = async function (prompt) {
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
 * @this {sideOutputController}
 */
sideOutputController.prototype.ask = async function(question,promptKey=this.currentPrompt,temperature=undefined) {
try {
  this.dynamic = false
  this.token = []
  this.func = []
  this.preFuncResponse = ""
  let delay = chatAIConfig.config.delay
  if (this.called) {
    delay = 0
  }
  if (!this.preCheck()) {
    return
  }
  await this.delay(delay)
  // MNUtil.showHUD(chatAIConfig.currentTitle)
  // MNUtil.showHUD(chatAIConfig.currentTitle)

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
 * @this {sideOutputController}
 */
sideOutputController.prototype.reAsk = async function(question,promptKey=this.currentPrompt,temperature=undefined) {
try {
  this.dynamic = false
  this.token = []
  this.func = []
  this.preFuncResponse = ""
  let delay = chatAIConfig.config.delay
  if (this.called) {
    delay = 0
  }
  if (!this.preCheck()) {
    return
  }
  await this.delay(delay)
  // MNUtil.showHUD(chatAIConfig.currentTitle)
  // MNUtil.showHUD(chatAIConfig.currentTitle)

  let promptConfig = chatAIConfig.prompts[promptKey]
  if (promptKey) {
    this.currentPrompt = promptKey
    this.currentTitle = promptConfig.title
  }
  await this.beginNotification()
  this.baseAsk(question,this.config,temperature)

} catch (error) {
  chatAIUtils.addErrorLog(error, "ask")
}
  
};

/**
 * 
 * @param {string} question 
 * @param {string} promptKey 
 * @param {number} temperature 
 * @this {sideOutputController}
 */
sideOutputController.prototype.reAskByIdx = async function(question,idx = -1) {
try {
  this.dynamic = false
  this.token = []
  this.func = []
  this.preFuncResponse = ""
  let roles = this.history.map(h=>h.role)
  let chatIdxs = []
  this.history.forEach((h,i)=>{
    
  })

  this.refreshIdx = idx
  let delay = chatAIConfig.config.delay
  if (this.called) {
    delay = 0
  }
  if (!this.preCheck()) {
    return
  }
  await this.delay(delay)
  await this.beginNotification()
  this.baseAsk(question,this.config,this.temperature)

} catch (error) {
  chatAIUtils.addErrorLog(error, "ask")
}
  
};

/**
 * 
 * @param {*} question 
 * @param {*} temperature 
 * @param {*} reask 
 * @this {sideOutputController}
 */
sideOutputController.prototype.customAsk = async function(question,noteId = undefined) {
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
 * @this {sideOutputController}
 */
sideOutputController.prototype.askByDynamic = async function(question,temperature=0.8,reask=false) {
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
  // this.targetTextview = "textviewResponse"
  if (!this.preCheck()) {
    return
  }
  let currentFrame = this.view.frame
  currentFrame.height = 120
  this.view.frame = currentFrame
  this.currentFrame = currentFrame
  this.config = config
  await this.beginNotification("Dynamic")
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
 * @this {sideOutputController}
 */
sideOutputController.prototype.reAskByDynamic = async function(question,config,temperature=0.8,reask=false) {
try {
  this.dynamic = true
  this.history = []
  this.token = []
  this.preFuncResponse = ""
  this.actions = config.action
  // this.targetTextview = "textviewResponse"
  if (!this.preCheck()) {
    return
  }
  let currentFrame = this.view.frame
  currentFrame.height = 120
  this.view.frame = currentFrame
  this.currentFrame = currentFrame
  await this.beginNotification("Dynamic")
  this.baseAsk(question,this.config,undefined)
} catch (error) {
  chatAIUtils.addErrorLog(error, "askByDynamic")
}
};
/**
 * 
 * @param {*} question 
 * @param {*} temperature 
 * @param {*} reask 
 * @this {sideOutputController}
 */
sideOutputController.prototype.askByVision = async function(question,temperature=0.8,reask=false) {
try {
  let config = chatAIConfig.getDynmaicConfig()
  // chatAIUtils.copyJSON(question)
  this.dynamic = true
  this.history = []
  this.token = []
  this.actions = config.action
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
sideOutputController.prototype.getInputext = function () {
    let text = this.userInput.text.trim()
    if (this.userReference.text.trim()) {
      text = this.userReference.text.trim()+"\n\n"+text
      
    }
    if (!text) {
      MNUtil.showHUD("Empty message")
      return undefined
    }
    // MNUtil.showHUD("Sending message...")
    this.userInput.custom = false
    this.userInput.text = ""
    this.userReference.text = ""
    this.userReference.hidden = false
    this.resizeButton.hidden = false
    return text
}
/**
 * 专指聊天模式下
 * @param {*} question 
 * @param {*} temperature 
 * @param {*} reask 
 * @this {sideOutputController}
 */
sideOutputController.prototype.continueAsk = async function(question,temperature=0.8) {
try {
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
    let res = question.match(/{{note:(.*)}}/g)
    for (let i = 0; i < res.length; i++) {
      const tem = res[i];
      let noteId = tem.match(/{{note:(.*)}}/)[1]
      let note = MNNote.new(noteId)
      let stringified = (await chatAIUtils.getMDFromNote(note)).trim()
      stringified = stringified.split("\n").map((l,i)=>{
        if (i && l.trim()) {
          return `> ${l}`
        }
        return l
      }).join("\n")
      question = question.replace("{{note:"+noteId+"}}",stringified)
      MNUtil.copy(question)
    }
  }

  if (this.currentImageBase64) {
    this.history.push({
          role: "user", 
          content: [
            {
              "type": "text",
              "text": question
            },
            {
              "type": "image_url",
              "image_url": {
                "url" : "data:image/jpeg;base64,"+this.currentImageBase64//this.currentImage.jpegData(0.).base64Encoding()
              }
            }
          ]
        })
  }else{
    this.history.push(chatAIUtils.genUserMessage(question))
  }
  this.resetImageInChat()

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
 * @this {sideOutputController}
 */
sideOutputController.prototype.continueAfterToolCall = function(temperature=0.8) {
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
  
  this.baseAsk(this.history,config,temperature)
  } catch (error) {
    chatAIUtils.addErrorLog(error, "continueAfterToolCall")
  }
};
/**
 * @this {sideOutputController}
 */
sideOutputController.prototype.prepareFinish = async function () {
  try {
  delete this.connection
  // this.size.push(Date.now())
  this.onFinish = true
  this.scrollToBottom = false
  if (this.statusCode >= 400) {
    let codeDes = chatAIUtils.getStatusCodeDescription(this.statusCode.toString())
    if (chatAIUtils.isValidJSON(this.textString)) {
      MNUtil.showHUD(codeDes+" | "+this.textString)
      MNUtil.copy(codeDes+"\n"+JSON.stringify(JSON.parse(this.textString),null,2)+"\n"+JSON.stringify(this.config))
    }else{
      MNUtil.showHUD(codeDes+" | "+this.textString)
      MNUtil.copy(codeDes+"\n"+this.textString+"\n"+JSON.stringify(this.config))
    }
    // copy(this.textString)
    this.setChatLayout()
    this.setButtonOpacity(1.0)
    return
  }
  this.getResponse(true)
    if (!this.func || !this.func.length) {
      this.setButtonOpacity(1.0)
    }
    this.finish()
  } catch (error) {
    chatAIUtils.addErrorLog(error, "prepareFinish")
  }
}
/**
 * @this {sideOutputController}
 */
sideOutputController.prototype.finish = async function() {
  // this.connection.cancel()
  // MNUtil.copyJSON(this.size)
  let heightOffset = 0
try {
  this.tool = []
  // MNUtil.copyJSON(this.func)
  if (this.func && this.func.length) {
    //把得到的func执行一遍并将响应添加到this.tool中
    this.funcResponses = await Promise.all(this.func.map(func=> this.executeFunctionByAI(func)))
    this.funcResponse = this.funcResponses.join("")
    this.history.push({role:"assistant",tool_calls:this.func})
    this.tool.map(tool=>{this.history.push(tool)})
    // chatAIUtils.copyJSON(this.history)
    this.preFuncResponse = this.preFuncResponse+this.funcResponse
    // copy(this.preFuncResponse)
    if (this.func.map(func=>func.function.name).includes("close")) {
      // await this.delay(0.5)
      // MNUtil.showHUD("close")
      MNUtil.toggleExtensionPanel()
      this.stopLoading(false)
    }else{
      this.continueAfterToolCall()
    }
  }else{
    if (this.reasoningResponse && this.reasoningResponse.trim()) {
      this.history.push({role:"assistant",content:this.response,reasoningContent:this.reasoningResponse})
    }else{
      this.history.push({role:"assistant",content:this.response})
    }
    if (!this.response.trim() && !this.tool.length  && !this.preFuncResponse) {
      MNUtil.showHUD("Empty response"+this.history.length)
    }
    this.funcResponse = ""
    this.lastResponse = this.response.trim()
    // MNUtil.copy(this.lastResponse)
    this.response = ""
    this.setHistory(this.history,false)
    this.stopLoading()
    // if (chatAIConfig.getConfig("speech") && chatAIConfig.getConfig("speechKey") && this.lastResponse) {
    //   let responseLength = chatAIUtils.strCode(this.lastResponse)
    //   if (responseLength >= 500) {
    //     MNUtil.showHUD("Too long content")
    //   }else{
    //     MNUtil.showHUD("Generating Voice...")
    //     await this.speech(this.lastResponse,"assistant"+this.round)
    //     heightOffset = this["assistant"+this.round].sizeHeight*0.1
    //   }
    // }
    // MNUtil.showHUD("message"+MNUtil.isDescendantOfStudyView(this.view))
  }
  this.setChatLayout(heightOffset)
  this.called = false
  this.onFinish = false
} catch (error) {
  chatAIUtils.addErrorLog(error, "finish",this.textString)
  // MNUtil.copy(this.textString)
}
}

sideOutputController.prototype.init = function () {
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
  this.aiImage = MNUtil.getImage(chatAIConfig.mainPath + `/ai.png`, 4)
  this.aiLinkImage = MNUtil.getImage(chatAIConfig.mainPath + `/aiLink.png`)
  this.chatImage = MNUtil.getImage(chatAIConfig.mainPath + `/chat.png`)
  this.sendImage = MNUtil.getImage(chatAIConfig.mainPath + `/send.png`)
  this.lockImage = MNUtil.getImage(chatAIConfig.mainPath + `/lock.png`)
  this.unlockImage = MNUtil.getImage(chatAIConfig.mainPath + `/unlock.png`)
  this.excerptImage = MNUtil.getImage(chatAIConfig.mainPath + `/excerpt.png`,2.3)
  this.childImage = MNUtil.getImage(chatAIConfig.mainPath + `/childNote.png`)
  this.quoteImage = MNUtil.getImage(chatAIConfig.mainPath + `/quote.png`)
  this.clearImage = MNUtil.getImage(chatAIConfig.mainPath + `/eraser.png`,2.2)
  this.addImage = MNUtil.getImage(chatAIConfig.mainPath + `/addImage.png`,2.3)
  this.curveImage = MNUtil.getImage(chatAIConfig.mainPath + `/curve.png`,2.3)
  this.referenceImage = MNUtil.getImage(chatAIConfig.mainPath + `/reference.png`,2.3)
  this.moreImage = MNUtil.getImage(chatAIConfig.mainPath + `/more.png`)
  this.menuImage = MNUtil.getImage(chatAIConfig.mainPath + `/menu.png`,1.8)
  this.newChatImage = MNUtil.getImage(chatAIConfig.mainPath + `/newChat.png`)
}
/**
 * @this {sideOutputController}
 * @param {number} heightOffset
 */
sideOutputController.prototype.setChatLayout = async function (heightOffset = 0) {
  try {
  if (!this.chatToolbar) {
    return
  }
  let viewFrame = this.view.frame
  viewFrame.width = MNExtensionPanel.width
  viewFrame.height = MNExtensionPanel.height
  this.closeChatButton.frame = MNUtil.genFrame(5, viewFrame.height-40, 35, 35)
  this.chatsNavButton.frame = MNUtil.genFrame(5, viewFrame.height-80, 35, 35)
  this.newChatButton.frame = MNUtil.genFrame(5, viewFrame.height-120, 35, 35)
  this.moreButton.frame = MNUtil.genFrame(5, viewFrame.height-160, 35, 35)
  if (this.chatWebview) {
    this.chatWebview.frame = MNUtil.genFrame(0, 0, viewFrame.width, viewFrame.height)
  }
  let inputFrame = this.userInput.frame
  inputFrame.y = 40
  if (!this.userInput.custom) {
    inputFrame.height = 80
  }
  viewFrame.width = MNUtil.constrain(viewFrame.width, 0, 350)
  this.userInput.frame = MNUtil.genFrame(5,40, viewFrame.width-65, inputFrame.height)
  this.userReference.frame = MNUtil.genFrame(5,40, viewFrame.width-65, inputFrame.height)
  let toolbarFrame = this.chatToolbar.frame
  toolbarFrame.y = MNUtil.constrain(toolbarFrame.y, 5, MNExtensionPanel.height-50)
  // toolbarFrame.x = MNUtil.constrain(toolbarFrame.x, 0, max)
  toolbarFrame.width = viewFrame.width
  toolbarFrame.height = 45+inputFrame.height
  this.chatToolbar.frame = toolbarFrame

  // this.userReference.contentSize = {width:1000,height:50}
  this.sendButton.frame = MNUtil.genFrame(viewFrame.width-55,40, 50, 45)
  this.resizeButton.frame = MNUtil.genFrame(viewFrame.width-55,90, 50, 30)
  // if (!this.currentImage) {
  this.imageButton.frame = MNUtil.genFrame(viewFrame.width-55,5, 50, 30)
  // }
  this.reAskButton.frame = MNUtil.genFrame(5, 70, 30, 30)
  this.reAskButton.hidden = true
  this.chatToken.frame = MNUtil.genFrame(viewFrame.width-90, 5, 30, 30)
  this.clearButton.frame = MNUtil.genFrame(5, 5, 30, 30)
  this.chatModel.frame = MNUtil.genFrame(40, 5, viewFrame.width-135, 30)

  this.aiButton.frame = MNUtil.genFrame(5,-35,70,30)
  this.aiButton.hidden = chatAIUtils.isIOS()
  this.preRound = this.round
  this.panelWidth = MNExtensionPanel.width
  } catch (error) {
    chatAIUtils.addErrorLog(error, "setChatLayout")
  }
}

sideOutputController.prototype.createButton = function (buttonName,targetAction,superview) {
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
 * @this {sideOutputController}
 * @param {string} viewName 
 * @param {string} superview 
 * @param {string} color 
 * @param {number} alpha
 */
sideOutputController.prototype.creatTextView = function (viewName,superview="view",color="#ffffff",alpha=0.8) {
  this[viewName] = UITextView.new()
  this[viewName].font = UIFont.systemFontOfSize(17);
  this[viewName].layer.cornerRadius = 12
  this[viewName].backgroundColor = MNUtil.hexColorAlpha(color,alpha)
  this[viewName].textColor = UIColor.blackColor()
  this[viewName].delegate = this
  this[viewName].editable = true
  this[viewName].scrollEnabled = false
  this[viewName].bounces = false
  this[viewName].layer.borderWidth = 4

  this[superview].addSubview(this[viewName])
}
sideOutputController.prototype.show = function () {
try {
  this.onAnimate = true

  let height = (chatAIUtils.getHeight())
  // if (fromOutside) {
  //   height = 120
  // }
  this.currentFrame.x = 0
  this.currentFrame.y = 0
  let preFrame = this.currentFrame
  preFrame.width = MNExtensionPanel.width
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
  let animateTime = chatAIUtils.isIOS()?0.4:0.2
  MNUtil.animate(()=>{
    this.view.layer.opacity = preOpacity
    this.view.frame = preFrame
    // this.currentFrame = preFrame
    this.setLayout()
  },animateTime).then(()=>{
    this.view.layer.borderWidth = 0
    this.setChatLayout()
    this.onAnimate = false
  })
} catch (error) {
  chatAIUtils.addErrorLog(error, "show")
}
}

/**
 * @this {sideOutputController}
 */
sideOutputController.prototype.setLayout = function () {
try {

  var viewFrame = this.toolbar.bounds;
  var width    = viewFrame.width
  var height   = viewFrame.height
  viewFrame.height = viewFrame.height-30
  this.toolbar.frame = MNUtil.genFrame(5, 5, MNExtensionPanel.width-10,30)
  this.aiButton.frame = MNUtil.genFrame(5,-35,30,30)
  // this.aiModelButton.frame = MNUtil.genFrame(40,-35,100,30)
  this.screenButton.frame = MNUtil.genFrame(0,0,30,30)
  this.bigbangButton.frame = MNUtil.genFrame(35,0,30,30)
  this.commentButton.frame = MNUtil.genFrame(70,0,30,30)
  this.titleButton.frame = MNUtil.genFrame(105,0,30,30)
  this.copyButton.frame = MNUtil.genFrame(140,0,30,30)
  this.excerptButton.frame = MNUtil.genFrame(175,0,30,30)
  this.childButton.frame = MNUtil.genFrame(210,0,30,30) 
  this.reloadButton.frame = MNUtil.genFrame(245,0,30,30)
  this.chatButton.frame = MNUtil.genFrame(280,0,30,30) 
  this.promptButton.frame = MNUtil.genFrame(315,0,MNExtensionPanel.width-320,30)
} catch (error) {
  chatAIUtils.addErrorLog(error, "setLayout")
}
}

/** 
* @this {sideOutputController}
* @param {string} promptName - The name of the prompt to begin the notification with.
*/
sideOutputController.prototype.beginNotification = async function (promptName) {
    await MNUtil.delay(0.01)
    this.setNewResponse()
    await MNUtil.delay(0.01)
    let currentFrame = this.view.frame
    this.currentFrame = currentFrame
    this.view.frame = currentFrame
    try {
    if (promptName) {
      this.promptButton.setTitleForState(promptName ,0)
    }else{
      this.promptButton.setTitleForState(this.currentTitle ,0)
    }
    } catch (error) {
      chatAIUtils.addErrorLog(error, "beginNotification")
    }
    if (this.view.hidden) {
      this.show()
    }
  }

/** 
  * @this {sideOutputController} 
  * @param {string} content - The content to be displayed in the notification.
*/
sideOutputController.prototype.getTextForAction = async function (round) {
    return await this.getWebviewContent("assistant"+round)
}

/** 
 * @this {sideOutputController}
 */
sideOutputController.prototype.getResponse = async function (force = false) {
  // if (this.onResponse && !force) {
  //   return false
  // }
  try {

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
    
  } catch (error) {
    chatAIUtils.addErrorLog(error, "getResponse")
  }
}

/** 
 * @param {string} response 
 * @this {sideOutputController}
 */
sideOutputController.prototype.getResponseForChatGPT = function (checkToolCalls = true) {
  try {
    let test = chatAIUtils.parseResponse(this.originalText, checkToolCalls)
    if (!test) {
      return
    }
    if (test.usage) {
      if (test.usage.total_tokens) {
        this.setToken(test.usage.total_tokens)
      }
    }
    this.response = test.response ?? ""
    this.reasoningResponse = test.reasoningResponse ?? ""
    this.func = test.funcList ?? []
    this.funcResponse = test.funcResponse ?? ""
    return
  } catch (error) {
    chatAIUtils.addErrorLog(error, "getResponseForChatGPT",this.resList)
    return
  }
}

/** 
 * @this {sideOutputController}
 */
sideOutputController.prototype.getResponseForGemini = function () {
  try {
    // let res = this.originalText.split("data:")
    // res.shift()
    // res.pop()
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
 * @this {sideOutputController}
 */
sideOutputController.prototype.getResponseForClaude = function () {
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
 * @this {sideOutputController}
 * 用来格式化调用的函数内容的
 */
sideOutputController.prototype.codifyToolCall = function (funcName,arguments) {
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
    // case "setTitle":
    //   if (arguments.title) {
    //     return `${funcName}("${MNUtil.mergeWhitespace(arguments.title)}")\n`
    //   }
    // case "addComment":
    //   if (arguments.comment) {
    //     return `${funcName}("${arguments.comment.trim()}")\n`
    //   }
    // case "addTag":
    //   if (arguments.tag) {
    //     return `${funcName}("${MNUtil.mergeWhitespace(arguments.tag)}")\n`
    //   }
    // case "copyMarkdownLink":
    //   if (arguments.title) {
    //     return `${funcName}("${MNUtil.mergeWhitespace(arguments.title)}")\n`
    //   }
    // case "copyCardURL":
    //   return `${funcName}()\n`
    // case "copyText":
    //   if (arguments.text) {
    //     return `${funcName}("${MNUtil.mergeWhitespace(arguments.text)}")\n`
    //   }
    // case "close":
    //   return `${funcName}()\n`
    // case "clearExcerpt":
    //   return `${funcName}()\n`
    // case "setExcerpt":
    //   if (arguments.excerpt) {
    //     return `${funcName}("${arguments.excerpt.trim()}")\n`
    //   }
    // case "addChildNote":
    //   let pre = `${funcName}(\n`
    //   if (arguments.title) {
    //     pre = pre+`"${MNUtil.mergeWhitespace(arguments.title)}"`
    //     if (arguments.content) {
    //       pre = pre+",\n"
    //     }
    //   }
    //   if (arguments.content) {
    //     pre = pre+`"${arguments.content.trim()}"`
    //   }
    //   pre = pre+`\n)\n`
    //   return pre
    //   return `${funcName}(\n"${MNUtil.mergeWhitespace(arguments.title)}",\n"${MNUtil.mergeWhitespace(arguments.content)}\n")\n`
    default:
      return chatAITool.getToolByName(funcName).codifyToolCall(arguments)
      break;
  }
  // copyJSON(arguments)
  return "Error"
}
/** 
 * @this {sideOutputController}
 * 支持从通知窗口打开（hasContext为true）和直接打开（hasContext为false）
 */
sideOutputController.prototype.openChatView = async function (params=undefined) {
    if (this.connection) {
      MNUtil.showHUD("Wait...")
      return
    }
  try {
    this.panelWidth = MNExtensionPanel.width
    this.lastScrollTime = Date.now()
    if (!params) {
      this.token = [0]
      let systemPrompt = chatAIConfig.getConfig("chatSystemPrompt")
      if (systemPrompt.trim()) {
        this.history = [{role:"system",content:systemPrompt}]
      }else{
        this.history = []
      }
      this.preFuncResponse = ""
      this.reasoningResponse = ""
      this.currentModel = chatAIConfig.getConfig("chatModel")
      let config = chatAIConfig.parseModelConfig(this.currentModel)
      // let modelConfig = this.currentModel.split(":").map(model=>model.trim())
      // if (modelConfig[0] !== "Default") {
      //   let source = modelConfig[0]
      //   config = chatAIConfig.getConfigFromSource(source)
      //   if (modelConfig.length === 2) {
      //     config.model = modelConfig[1]
      //   }
      // }else{
      //   config = chatAIConfig.getConfigFromSource()
      // }
      this.config = config
      this.lastResponse = ""
      this.funcIndices = chatAIConfig.getConfig("chatFuncIndices")
    }else{
      // MNUtil.copyJSON(params)
      this.token = params.token
      this.history = params.history
      this.config = params.config
      this.currentModel = params.currentModel
      this.preFuncResponse = params.preFuncResponse
      this.reasoningResponse = params.reasoningResponse
      this.lastResponse = params.lastResponse
      this.funcIndices = params.funcIndices
      if ("userInput" in params) {
        this.preFilledUserInput = params.userInput
      }
      if ("temperature" in params) {
        this.temperature = params.temperature
      }
      if ("prompt" in params) {
        this.currentPrompt = params.prompt
      }
      if (this.chatWebview) {
        let newData = {data:this.history}
        if (this.funcIndices && this.funcIndices.length) {
          newData.funcIdxs = this.funcIndices
        }
        if (this.currentPrompt && this.currentPrompt !== "Dynamic") {
          newData.name = chatAIConfig.prompts[this.currentPrompt].title
        }else{
          let firstUser = this.history.find(item=>item.role === "user")
          if (typeof firstUser.content === "string") {
            newData.name = firstUser.content.slice(0,10)
          }else{
            newData.name = firstUser.content.find(item=>item.type = "text").text.slice(0,10)
          }
        }
        if (this.temperature !== undefined) {
          newData.temperature = this.temperature
        }
        if (this.preFilledUserInput) {
          this.userInput.text = this.preFilledUserInput
          this.preFilledUserInput = undefined
        }
        newData.model = params.currentModel
        // if (this.config) {
        //   if (this.config.model) {
        //     newData.model = this.config.model
        //   }
        //   if (this.config.source) {
        //     newData.source = this.config.source
        //   }
        // }
        this.importData(newData)
      }
    }

    // MNUtil.copyJSON(this.config)
    this.round = 0
    this.heights = {}
    if (this.notifyTimer) {
      this.notifyTimer.invalidate()
    }
    if (this.chatToolbar) {
      return
    }
    if (!this.chatWebview) {
      this.chatWebview = this.createChatWebview()
    }
    this.chatToolbar = UIView.new()
    this.chatToolbar.layer.cornerRadius = 10
    this.chatToolbar.backgroundColor = MNUtil.hexColorAlpha("#a2bdd7",0.2)
    this.view.addSubview(this.chatToolbar)
    let x = 50
    if (MNExtensionPanel.width < 350) {
      x = 0
    }
    this.chatToolbar.frame = MNUtil.genFrame(x, 300, 350, 85)
    this.createButton("closeChatButton","closeButtonTapped:")
    this.closeChatButton.setImageForState(chatAIConfig.closeImage,0)
    this.closeChatButton.backgroundColor = MNUtil.hexColorAlpha("#e06c75",0.8)

    this.createButton("chatsNavButton","toggleNavEv:")
    this.chatsNavButton.setImageForState(this.menuImage,0)

    this.createButton("moreButton","moreButtonTapped:")
    this.moreButton.setImageForState(this.moreImage,0)

    this.createButton("newChatButton","newChatTapped:")
    this.newChatButton.setImageForState(this.newChatImage,0)

    this.createButton("chatToken","changeFunc:","chatToolbar")
    this.createButton("reAskButton","reAsk:","chatToolbar")
    this.createButton("chatModel","changeChatModel:","chatToolbar")
    this.createButton("clearButton","clearHistory:","chatToolbar")

    this.reAskButton.setImageForState(this.reloadImage,0)
    this.chatToken.hidden = false
    this.chatToken.setTitleForState("🛠️")

    this.aiButton.setTitleForState(""+chatAIUtils.sum(this.token),0)
    this.aiButton.titleLabel.font = UIFont.boldSystemFontOfSize(16);
    this.aiButton.setTitleColorForState(UIColor.grayColor(),0)
    this.chatModel.hidden = false
    this.chatModel.titleLabel.font = UIFont.boldSystemFontOfSize(16);
    MNButton.addPanGesture(this.chatModel, this, "onMoveGesture:")
    if (this.config.source === "Built-in") {
      MNButton.setTitle(this.chatModel, "Built-in",15,true)
    }else{
      MNButton.setTitle(this.chatModel, this.config.model,15,true)
    }
    this.clearButton.hidden = false
    this.clearButton.setImageForState(this.clearImage,0)
    this.createButton("sendButton","sendButtonTapped:","chatToolbar")
    this.sendButton.setImageForState(this.sendImage,0)
    this.sendButton.layer.cornerRadius = 12
    this.sendButton.backgroundColor = MNUtil.hexColorAlpha("#e06c75",0.8)
    MNButton.addPanGesture(this.sendButton, this, "onMoveGesture:")
    MNButton.addLongPressGesture(this.sendButton, this, "onLongPressSend:",0.5)

    this.createButton("imageButton","imageButtonTapped:","chatToolbar")
    this.imageButton.setImageForState(this.addImage,0)
    this.imageButton.layer.cornerRadius = 8
    this.imageButton.backgroundColor = MNUtil.hexColorAlpha("#e06c75",1)
    this.imageButton.layer.opacity = 0.8

    this.creatTextView("userInput","chatToolbar")
    this.creatTextView("userReference","chatToolbar")
    this.userInput.editable = true
    this.userReference.type = "userReference"
    // this.userReference.editable = false
    this.userReference.hidden = true
    // this.userReference.translatesAutoresizingMaskIntoConstraints = false
    // this.userReference.textContainer.lineBreakMode = 3
    if (MNUtil.version.type === "macOS") {
      this.userInput.becomeFirstResponder()
    }
    this.userInput.layer.borderColor = MNUtil.hexColorAlpha("#9bb2d6",0.8)
    this.userInput.backgroundColor = MNUtil.hexColorAlpha("#e4eeff",0.8)
    this.userInput.scrollEnabled = true
    this.userInput.bounces = true
    this.userInput.custom = false
    this.userInput.layer.borderWidth = 3
    this.userInput.font = UIFont.systemFontOfSize(16);

    this.userReference.layer.borderColor = MNUtil.hexColorAlpha("#afafaf",0.8)
    this.userReference.backgroundColor = MNUtil.hexColorAlpha("#cecece",0.8)
    this.userReference.scrollEnabled = true
    this.userReference.bounces = true
    this.userReference.custom = false
    this.userReference.layer.borderWidth = 3
    this.userReference.font = UIFont.systemFontOfSize(13);
    this.userReference.layer.opacity = 1.0

    // this.resizeGesture.addTargetAction(this,"onResizeGesture:")


    this.createButton("resizeButton","resizeButtonTapped:","chatToolbar")
    this.resizeButton.setImageForState(this.referenceImage,0)
    // this.resizeButton.backgroundColor = MNUtil.hexColorAlpha("#e06c75",1)
    this.resizeButton.backgroundColor = MNUtil.hexColorAlpha("#afafaf",1)
    this.resizeButton.layer.opacity = 0.8
    this.resizeButton.hidden = false
    // MNButton.addPanGesture(this.resizeButton, this, "onResizeGesture:")
    MNButton.addLongPressGesture(this.resizeButton, this, "onLongPressReference:")
    // this.resizeGesture = new UIPanGestureRecognizer(this,"onResizeGesture:")
    // this.resizeButton.addGestureRecognizer(this.resizeGesture)
    // this.resizeGesture.view.hidden = false

    var viewFrame = this.view.frame;
    viewFrame.height = MNExtensionPanel.height
    this.view.frame = viewFrame
    this.currentFrame = viewFrame

    // await MNUtil.delay(0.1)
  } catch (error) {
    chatAIUtils.addErrorLog(error, "openChatView",params)
  }
  this.setChatLayout()
}
/** 
 * @this {sideOutputController}
 * 支持从通知窗口打开（hasContext为true）和直接打开（hasContext为false）
 */
sideOutputController.prototype.openChatViewFromPrompt = async function (promptName) {
    if (this.connection) {
      MNUtil.showHUD("Wait...")
      return
    }
  try {

    let prompt = chatAIConfig.prompts[promptName]
    MNUtil.showHUD("New Chat From: "+prompt.title)
    if (!("model" in prompt)) {
      prompt.model = "Default"
    }
    let param = {currentModel:prompt.model,token:[0],preFuncResponse:"",lastResponse:"",prompt:promptName}
    let config = chatAIConfig.parseModelConfig(prompt.model)
    // let modelConfig = prompt.model.split(":").map(m=>m.trim())
    // if (modelConfig[0] !== "Default") {
    //   let source = modelConfig[0]
    //   config = chatAIConfig.getConfigFromSource(source)
    //   if (modelConfig.length === 2) {
    //     config.model = modelConfig[1]
    //   }
    // }else{
    //   config = chatAIConfig.getConfigFromSource()
    // }

    let newHistory = []
    if ("system" in prompt) {
      newHistory.push({role:"system",content:prompt.system})
    }
    param.history = newHistory
    param.userInput = prompt.context
    if ("func" in prompt) {
      param.funcIndices = prompt.func
    }else{
      param.funcIndices = []
    }
    if ("temperature" in prompt) {
      param.temperature = prompt.temperature
    }
    param.config = config
    this.openChatView(param)

  } catch (error) {
    chatAIUtils.addErrorLog(error, "openChatViewFromPrompt")
  }
}
sideOutputController.prototype.delay = async function (seconds) {
  return new Promise((resolve, reject) => {
    NSTimer.scheduledTimerWithTimeInterval(seconds, false, function () {
      resolve()
    })
  })
}
sideOutputController.prototype.createTextviewResponse  = function () {
  this.textviewResponse = UITextView.new()
  this.textviewResponse.font = UIFont.systemFontOfSize(16);
  this.textviewResponse.layer.cornerRadius = 8
  this.textviewResponse.backgroundColor = MNUtil.hexColorAlpha("#ffffff",0.8)
  this.textviewResponse.textColor = UIColor.blackColor()
  this.textviewResponse.delegate = this
  this.textviewResponse.contentSize = {width:MNExtensionPanel.width,height:120}
  this.textviewResponse.scrollEnabled = false
  this.textviewResponse.text = `Loading...`
}
/** 
 * @this {sideOutputController}
 */
sideOutputController.prototype.createWebviewHtmlDev = function (superview) {
  try {
  let webview = new UIWebView(this.view.bounds);
  webview.backgroundColor = UIColor.whiteColor();
  webview.scalesPageToFit = false;
  webview.autoresizingMask = (1 << 1 | 1 << 4);
  webview.delegate = this;
  // webview.setValueForKey("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15","User-Agent")
  webview.scrollView.delegate = this;
  webview.layer.cornerRadius = 12;
  webview.layer.masksToBounds = true;
  webview.layer.borderColor = MNUtil.hexColorAlpha("#93bcff",0.4);
  webview.layer.borderWidth = 3
  webview.layer.opacity = 0.9
  webview.loadFileURLAllowingReadAccessToURL(
    NSURL.fileURLWithPath(chatAIConfig.mainPath + `/veditor_${this.theme}.html`),
    NSURL.fileURLWithPath(chatAIConfig.mainPath + '/')
  );
  if (superview) {
    this[superview].addSubview(webview)
  }else{
    this.view.addSubview(webview)
  }
  return webview
    } catch (error) {
      chatAIUtils.addErrorLog(error, "createWebviewHtmlDev")
  }
}

/** 
 * @this {sideOutputController}
 */
sideOutputController.prototype.createChatWebview = function (superview) {
  try {
  let webview = new UIWebView(this.view.bounds);
  webview.backgroundColor = UIColor.whiteColor();
  webview.scalesPageToFit = false;
  webview.autoresizingMask = (1 << 1 | 1 << 4);
  webview.delegate = this;
  // webview.setValueForKey("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15","User-Agent")
  webview.scrollView.delegate = this;
  webview.layer.cornerRadius = 5;
  webview.layer.masksToBounds = true;
  webview.layer.opacity = 1.0
  webview.scrollEnabled = false
  webview.scrollView.scrollEnabled = false
  webview.loadFileURLAllowingReadAccessToURL(
    NSURL.fileURLWithPath(chatAIConfig.mainPath + `/index.html`),
    NSURL.fileURLWithPath(chatAIConfig.mainPath + '/')
  );
  if (superview) {
    this[superview].addSubview(webview)
  }else{
    this.view.addSubview(webview)
  }
  return webview
    } catch (error) {
      chatAIUtils.addErrorLog(error, "createWebviewHtmlDev")
  }
}

/** @this {sideOutputController} */
sideOutputController.prototype.runJavaScript = async function(script) {
  return new Promise((resolve, reject) => {
    try {
      this.chatWebview.evaluateJavaScript(script,(result) => {
        if (MNUtil.isNSNull(result)) {
          resolve(undefined)
        }else{
          resolve(result)
        }
      });
    } catch (error) {
      chatAIUtils.addErrorLog(error, "runJavaScript")
      resolve(undefined)
    }
  })
};

/** @this {sideOutputController} */
sideOutputController.prototype.chatRunJavaScript = async function(script) {
  return new Promise((resolve, reject) => {
    try {
      this.chatWebview.evaluateJavaScript(script,(result) => {
        if (chatAIUtils.isNSNull(result)) {
          resolve(undefined)
        }else{
          resolve(result)
        }
      });
    } catch (error) {
      chatAIUtils.addErrorLog(error, "runJavaScript")
      resolve(undefined)
    }
  })
};
sideOutputController.prototype.setCurrentFuncIdxs = async function (indices) {
  // let encodedData = await this.chatRunJavaScript(`setCurrentFuncIdxs(\`${encodeURIComponent(JSON.stringify(indices))}\`)`)
  this.chatRunJavaScript(`setCurrentFuncIdxs(\`${encodeURIComponent(JSON.stringify(indices))}\`)`)

}
/**
 * 添加聊天模式下的请求框
 * @this {sideOutputController}
 * @param {string} model source:model格式
 */
sideOutputController.prototype.setCurrentModel = async function (model) {
  try {
    this.currentModel = model
    // this.config.model 
    // MNUtil.copy("Model: " + model)
    let modelConfig = chatAIConfig.parseModelConfig(model)
    if (modelConfig.source === "Built-in") {
      MNButton.setTitle(this.chatModel, "Built-in",15,true)
    }else{
      MNButton.setTitle(this.chatModel, modelConfig.model,15,true)
    }
    this.config = modelConfig
    this.chatRunJavaScript(`setCurrentModel(\`${encodeURIComponent(model)}\`)`)
  } catch (error) {
    chatAIUtils.addErrorLog(error, "setCurrentModel")
  }
}
/**
 * 添加聊天模式下的请求框
 * @this {sideOutputController}
 * @param {object} message 
 */
sideOutputController.prototype.chatSendMessage = function (message) {
  // MNUtil.copyJSON(message)
  // MNUtil.copy(`sendMessage(\`${encodeURIComponent(JSON.stringify(message))}\`,\`${this.currentModel}\`)`)
  this.chatRunJavaScript(`sendMessage(\`${encodeURIComponent(JSON.stringify(message))}\`,\`${this.currentModel}\`)`)
}
/** @this {sideOutputController} */
sideOutputController.prototype.chatSetResponse = function (response,funcResponse = "") {
  if (response.trim()) {
    if (funcResponse.trim()) {
      // MNUtil.copy(`setCurrentRes(\`${encodeURIComponent(response)}\`,\`${encodeURIComponent(funcResponse)}\`)`)
      this.chatRunJavaScript(`setCurrentRes(\`${encodeURIComponent(response)}\`,\`${encodeURIComponent(funcResponse)}\`)`)
    }else{
      // MNUtil.copy(`setCurrentRes(\`${encodeURIComponent(response)}\`)`)
      this.chatRunJavaScript(`setCurrentRes(\`${encodeURIComponent(response)}\`)`)
    }
  }else{
    if (funcResponse.trim()) {
      // MNUtil.copy(`setCurrentRes(\`\`,\`${encodeURIComponent(funcResponse+funcResponse)}\`)`)
      this.chatRunJavaScript(`setCurrentRes(\`\`,\`${encodeURIComponent(funcResponse)}\`)`)
    }
  }
}
/** @this {sideOutputController} */
sideOutputController.prototype.chatSetResponseDev = function (response) {
  // MNUtil.copyJSON(response)
  // MNUtil.copy(`setCurrentResDev(\`${encodeURIComponent(JSON.stringify(response))}\`)`)
  this.chatRunJavaScript(`setCurrentResDev(\`${encodeURIComponent(JSON.stringify(response))}\`)`)
}
/** @this {sideOutputController} */
sideOutputController.prototype.stopLoading = async function (exportData = true) {
  this.chatRunJavaScript(`finish(true)`)
  this.setButtonOpacity(1.0)
  if (exportData) {
    // let data = JSON.parse(decodeURIComponent(encoded))
    let allData = chatAIConfig.getChatData()
    let activeChatIdx = allData.activeChatIdx
    allData.chats[activeChatIdx].data = this.history
    // MNUtil.copyJSON(allData)
    chatAIConfig.exportChatData(allData)
    // chatAIConfig.exportChatData(data)
  }
}
/**
 * @this {sideOutputController}
 * @param {string} message 
 */
sideOutputController.prototype.importData = function (newChatData) {
try {
  // MNUtil.showHUD("importData")
  let data = chatAIConfig.getChatData()
  if (data) {
    if (newChatData) {
      // let newHistory = newChatData.data
      // let firstUser = newHistory.find(item=>item.role === "user")
      // MNUtil.copyJSON(firstUser)
      // let content = "新的聊天"
      // if ("name" in newChatData && newChatData.name.trim()) {
      //   content = newChatData.name
      // }else if (firstUser && firstUser.content.trim()) {
      //   content = firstUser.content
      //   if (content.length > 20) content = content.slice(0, 17) + "...";
      // }
      data.chats.push(newChatData)
      if (data.chatIdxs.length) {
        let newIdx = Math.max(...data.chatIdxs)+1
        data.chatIdxs.push(newIdx)
        data.activeChatIdx = newIdx
      }else{
        data.chatIdxs.push(0)
        data.activeChatIdx = 0
      }
      chatAIConfig.exportChatData(data)
    }else{
      let chatsData = data.chats
      let activeChatIdx = data.activeChatIdx
      let currentChat = chatsData[activeChatIdx]
      if ("funcIdxs" in currentChat) {
        this.funcIndices = currentChat.funcIdxs
      }else{
        this.funcIndices = []
      }
      this.history = currentChat.data
      if ("model" in currentChat) {
        this.setCurrentModel(currentChat.model)
      }
      if ("temperature" in currentChat) {
        this.temperature = currentChat.temperature
      }
    }
    // MNUtil.copy(`importAllData(\`${encodeURIComponent(JSON.stringify(data))}\`)`)
    this.chatRunJavaScript(`importAllData(\`${encodeURIComponent(JSON.stringify(data))}\`)`)
  }
} catch (error) {
  chatAIUtils.addErrorLog(error, "importData") 
}
}
/**
 * @this {sideOutputController}
 */
sideOutputController.prototype.toggleNavEv = function () {
  this.chatRunJavaScript(`toggleNavEv()`)
}
/**
 * @this {sideOutputController}
 */
sideOutputController.prototype.setHistory = function (history,render = true) {
  let fullHistory = history
  if (this.afterHistory) {
    fullHistory = history.concat(this.afterHistory)
    this.afterHistory = undefined
  }
  let encodedHistory = encodeURIComponent(JSON.stringify(fullHistory))
  this.chatRunJavaScript(`setHistory(\`${encodedHistory}\`,${render})`)
}
/**
 * @this {sideOutputController}
 */
sideOutputController.prototype.clearHistory = function () {
  this.token = [0]
  let systemPrompt = chatAIConfig.getConfig("chatSystemPrompt")
  if (systemPrompt.trim()) {
    this.history = [{role:"system",content:systemPrompt}]
  }else{
    this.history = []
  }
  this.setHistory(this.history)
  this.preFuncResponse = ""
  this.currentModel = chatAIConfig.getConfig("chatModel")
  let config = chatAIConfig.parseModelConfig(this.currentModel)
  // let modelConfig = this.currentModel.split(":").map(model=>model.trim())
  // if (modelConfig[0] !== "Default") {
  //   let source = modelConfig[0]
  //   config = chatAIConfig.getConfigFromSource(source)
  //   if (modelConfig.length === 2) {
  //     config.model = modelConfig[1]
  //   }
  // }else{
  //   config = chatAIConfig.getConfigFromSource()
  // }
  this.config = config
  this.lastResponse = ""
  this.funcIndices = chatAIConfig.getConfig("chatFuncIndices")
  let data = chatAIConfig.getChatData()
  data.chats[data.activeChatIdx].data = this.history
  chatAIConfig.exportChatData(data)
}
/** @this {sideOutputController} */
sideOutputController.prototype.getWebviewHeight = async function (webview,offset = 25) {
  let jsCode = `document.body.scrollHeight`
  let tem = await this.runJavaScript(jsCode, webview)
  if (tem) {
    return parseInt(tem)
  }
  MNUtil.showHUD("Loading webview...")
  await MNUtil.delay(0.5)
  tem = await this.runJavaScript(jsCode, webview)
  if (tem) {
    return parseInt(tem)
  }
  MNUtil.showHUD("Loading webview...")
  await MNUtil.delay(0.5)
  tem = await this.runJavaScript(jsCode, webview)
  return tem ? parseInt(tem) : 100
}
/** @this {sideOutputController} */
sideOutputController.prototype.setWebviewContent = async function (content,scrollToBottom = false,webview) {
  let height
  if (scrollToBottom) {
    // MNUtil.copy(content)
    // height = await this.runJavaScript(`document.body.innerHTML = "${MNUtil.escapeString(content)}"; MathJax.typesetPromise().then(() => {window.scrollTo(0,document.body.scrollHeight)});document.body.scrollHeight;`,webview)
    height = await this.runJavaScript(`document.body.innerHTML = decodeURIComponent(\`${encodeURIComponent(content)}\`); MathJax.typesetPromise().then(() => {window.scrollTo(0,document.body.scrollHeight)});document.body.scrollHeight;`,webview)
    // MNUtil.copyJSON(height)
    if (!Object.keys(height).length) {
      return await this.getWebviewHeight(webview) 
    }
    // MNUtil.copy(height)
  }else{
    // MNUtil.copy(content)
    // height = await this.runJavaScript(`document.body.innerHTML = "${MNUtil.escapeString(content)}"; MathJax.typeset();document.body.scrollHeight;`,webview)
    height = await this.runJavaScript(`document.body.innerHTML = decodeURIComponent(\`${encodeURIComponent(content)}\`); MathJax.typeset();document.body.scrollHeight;`,webview)
    // MNUtil.copyJSON(height)
    if (!Object.keys(height).length) {
      return await this.getWebviewHeight(webview) 
    }
    // MNUtil.copy(height)
  }
  return parseInt(height)+25
}
/** @this {sideOutputController} */
sideOutputController.prototype.getWebviewContent = async function (webview){
  let  selection = await this.runJavaScript(`editor.getSelection()`,webview)
  // let selection = await this.runJavaScript(`getCurrentSelect()`,webview)
  await this.runJavaScript(`editor.blur();`,webview)
  this[webview].endEditing(true)
  if (!selection || !selection.trim()) {
    let text = await this.runJavaScript(`editor.getValue();`,webview)
    return text
  }else{
  return selection
  // let converted = selection
  //                 .replace(/\*\*\\\*\\\*\*\*/g, "")
  //                 .replace(/\*\*\\\*\*\*/g, "")
  //                 .replace(/######\s######\s/g, "###### ")
  //                 .replace(/#####\s#####\s/g, "##### ")
  //                 .replace(/####\s####\s/g, "#### ")
  //                 .replace(/###\s###\s/g, "### ")
  //                 .replace(/##\s##\s/g, "## ")
  //                 .replace(/#\s#\s/g, "# ")
  //                 .replace(/\*\*\\\$\*\*`/g, "$")
  //                 .replace(/`\\\$/g, "$")
  //   // let converted = selection.replace("**\\$**`","$").replace("`\\$","$")
  //   // MNUtil.copy(selection+":"+converted)
  //   return converted
  }
  // let text = await this.runJavaScript(`getCurrentSelect() ? getCurrentSelect(): editor.getValue();`,webview)
  // // let text = await this.runJavaScript(`getCurrentSelect()`,webview)
  // return text


}
/** @this {sideOutputController} */
sideOutputController.prototype.setWebviewContentDev = async function (content,funcResponse="",scrollToBottom = false,webview) {
  let jsCode = `setValue(\`${encodeURIComponent(funcResponse)}\`,\`${encodeURIComponent(content)}\`,${scrollToBottom})`
  let tem = await this.runJavaScript(jsCode, webview)
  if (tem) {
    return parseInt(tem)+10
  }
  MNUtil.showHUD("Loading webview...")
  await MNUtil.delay(0.5)
  tem = await this.runJavaScript(jsCode, webview)
  if (tem) {
    return parseInt(tem)+10
  }
  MNUtil.showHUD("Loading webview...")
  await MNUtil.delay(0.5)
  tem = await this.runJavaScript(jsCode, webview)
  return tem ? parseInt(tem)+10 : 110
}

/** 
  *@this {sideOutputController} 
  *重新加载一遍veditor
  */
sideOutputController.prototype.setNewResponse = function (webview) {
    this[webview].loadFileURLAllowingReadAccessToURL(
      NSURL.fileURLWithPath(chatAIConfig.mainPath + `/veditor_${this.theme}.html`),
      NSURL.fileURLWithPath(chatAIConfig.mainPath + '/')
    );
}

/** @this {sideOutputController} */
sideOutputController.prototype.setResponseText = async function (funcResponse = "") {
  // if (this.onResponse) {
  //   MNUtil.showHUD("On response")
  //   return
  // }
  try {
    let funcHtml = ""
    if (funcResponse) {
      // funcHtml = `<pre>${funcResponse.trim()}</pre>`
      funcHtml = `<pre><code class="hljs">${funcResponse.trim()}</code></pre>`
    }
    // let htmlText = chatAIUtils.html(md2html,false,false)
    // htmlText = htmlText.replace(/<code>/g, "<pre><code>").replace(/<\/code>/g, "</code></pre>")
    // MNUtil.copy(md2html)
    // this["assistant"+this.round].loadHTMLStringBaseURL(htmlText)
    // await this.runJavaScript(`document.body.innerHTML = "${MNUtil.escapeString(htmlText)}"; MathJax.typeset();`,"assistant"+this.round)
    // await MNUtil.delay(0.1)
    // let sizeHeight = await this.getWebviewHeight("assistant"+this.round)
    // let sizeHeight = await this.setWebviewContent(md2html, false, "assistant"+this.round)
    // let sizeHeight = await this.setWebviewContentDev(this.response.trim(), funcHtml,this.scrollToBottom,"assistant"+this.round)
    // this.chatSetResponse(this.response.trim(), funcHtml)
    let option = {
      funcResponse: funcHtml,
      response: this.response,
      reasoningResponse: this.reasoningResponse
    }
    if (!this.onFinish) {
      if (option.response.length) {
        option.response = option.response +"..."
      }else if (option.reasoningResponse.length) {
        option.reasoningResponse = option.reasoningResponse +"..."
      }
    }
    this.chatSetResponseDev(option)
    // this["assistant"+this.round].sizeHeight = sizeHeight+40
    } catch (error) {
      MNUtil.showHUD("Error in setResponseText: "+error)

    }
}

/**
 * addToolMessage是要给ai看的，codifyToolCall是要给用户看的
 * @param {{index:number,id:string,type:string,function:{name:string,arguments:string}}} func 
 * @returns {Promise<string>}
 * @this {sideOutputController}
 */
sideOutputController.prototype.executeFunctionByAI = async function (func) {
try {
  let note,title,comment
  let funcName = func.function.name
  let noteid = this.noteid ?? chatAIUtils.getFocusNoteId()
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
              MNUtil.showHUD("Unavailable")
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
              MNUtil.showHUD("Unavailable")
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
      let res = await chatAITool.executeTool(funcName, func, noteid,true)
      this.tool.push(res.toolMessages )
      if ("renderSearchResults" in res) {
        // MNUtil.copy(`renderSearchResults(\`${encodeURIComponent(res.renderSearchResults)}\`);`)
        this.chatRunJavaScript(`renderSearchResults(\`${encodeURIComponent(res.renderSearchResults)}\`);`,"assistant"+this.round)
      }
      return res.description
  }

} catch (error) {
  chatAIUtils.addErrorLog(error, "executeFunctionByAI",func)
  return undefined
}
}

sideOutputController.prototype.setButtonOpacity = function (opacity) {
  this.chatToolbar.layer.opacity = opacity
}
/**
 * 
 * @param {string} content 
 */
sideOutputController.prototype.addToolMessage = function (content,funcId) {
  this.tool.push({"role":"tool","content":content,"tool_call_id":funcId})
}
/** @this {sideOutputController} */
sideOutputController.prototype.setToken = function (token) {
    if (this.onFinish) {
      this.token.push(token)
      this.aiButton.setTitleForState(""+chatAIUtils.sum(this.token),0)
    }else{
      this.aiButton.setTitleForState(""+chatAIUtils.sum(this.token.concat(token)),0)
    }
}
/** @this {sideOutputController} */
sideOutputController.prototype.speech = async function(text,webview){
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
 * @this {sideOutputController}
 * @param {number[]} actionIndices 
 * @param {string} text 
 */
sideOutputController.prototype.executeFinishAction = function (actionIndices,text) {
  try {
    

  let shouldClose = false
  let noteid = this.noteid ?? chatAIUtils.getFocusNote().noteId
  let note = MNNote.new(noteid)
  var actions = ["setTitle","addComment","copyMarkdownLink","copyCardURL","copyText","close","addTag","addChildNote","clearExcerpt","setExcerpt"];
  MNUtil.undoGrouping(()=>{
    actionIndices.forEach(index=>{
      switch (actions[index]) {
        case "setTitle":
          note.noteTitle = MNUtil.mergeWhitespace(text)
          MNUtil.showHUD("Title is set")
          break;
        case "addComment":
          if (text.trim()) {
            note.appendMarkdownComment(text.trim())
            MNUtil.showHUD("Comment is added")
          }else{
            MNUtil.showHUD("Empty content!")
          }
          break;
        case "addTag":
          note.appendTextComment("#"+MNUtil.mergeWhitespace(text))
          MNUtil.showHUD("Tag is added")
          break
        case "copyCardURL":
          MNUtil.copy(note.noteURL)
          MNUtil.showHUD("Link is copied")
          break;
        case "copyMarkdownLink":
          MNUtil.copy(`[${text}](${note.noteURL})`)
          MNUtil.showHUD("Markdown Link is copied")
          break;
        case "copyText":
          MNUtil.copy(text)
          MNUtil.showHUD("Content is copied")
          break;
        case "clearExcerpt":
          note.excerptText = ""
          MNUtil.showHUD("clear excerpt")
          break;
        case "close":
          shouldClose = true;
          break;
        case "setExcerpt":
          note.excerptText = text
          MNUtil.showHUD("excerpt is set")
          break;
        case "addChildNote":
          note.createChildNote({content:text,markdown:true})
          MNUtil.showHUD("child note is added")
          break;
        default:
          break;
      }
    })
  
  })
  MNUtil.delay(0.5).then(()=>{
    if (shouldClose) {
      MNUtil.toggleExtensionPanel()
    }
  })
  } catch (error) {
    chatAIUtils.addErrorLog(error, "executeFinishAction")
  }
}
/**
 * @this {sideOutputController}
 */
sideOutputController.prototype.resetImageInChat = function () {
  this.currentImage = undefined
  this.currentImageFile = undefined
  this.currentImageBase64 = undefined
  this.imageButton.setImageForState(this.addImage, 0)
  // this.imageButton.frame = MNUtil.genFrame(this.view.frame.width-60,0, 50, 30)
  // this.imageButton.layer.opacity = 0.8
}
/**
 * @this {sideOutputController}
 * @param {NSData} imageData 
 */
sideOutputController.prototype.addImageInChat = function (imageData) {
  if (imageData) {
    this.currentImage = UIImage.imageWithDataScale(imageData, 2)
    let imageSize = this.currentImage.size
    let ratio = imageSize.width/imageSize.height
    let height = 30
    let width = height*ratio
    if (width > (this.view.frame.width-10)) {
      width = this.view.frame.width-10
      height = width/ratio
    }
    if (width < 50) {
      width = 50
      height = width/ratio
    }
    let imageFrame = this.imageButton.frame
    imageFrame.width = width
    imageFrame.x = this.chatToolbar.frame.width - 55
    imageFrame.y = 5//this.view.frame.height-65-height
    imageFrame.height = height
    // MNUtil.genFrame(viewFrame.width-55,5, 50, 30)
    this.imageButton.frame = imageFrame
    this.imageButton.setImageForState(this.currentImage, 0)
    this.imageButton.layer.opacity = 0.8
    this.currentImageFile = chatAIUtils.getLocalBufferFromImageData(imageData)
    this.currentImageBase64 = this.currentImage.jpegData(0.).base64Encoding()
  }
}
/**
 * @param {string} text 
 * @param {NSData} imageData 
 */
sideOutputController.prototype.addToInput = function (text,imageData=undefined) {
  this.openChatView()
  this.addImageInChat(imageData)
  this.resizeButton.backgroundColor = MNUtil.hexColorAlpha("#e06c75",1)

  // if (imageData) {
  //   this.currentImage = UIImage.imageWithDataScale(imageData, 2)
  //   this.imageButton.setImageForState(this.currentImage, 0)
  // }
  // let textView = this.userInput
  let textView = this.userReference
  if (text && text.trim()) {
    textView.hidden = false
    this.resizeButton.hidden = false
    let userInput = `${textView.text.trim()}\n\n> ${text.trim()}`
    textView.text = userInput.trim()
    textView.frame = this.userInput.frame
    let inputFrame = textView.frame
    let size = textView.sizeThatFits({width:inputFrame.width,height:1000})
    if (size.height > inputFrame.height) {
      textView.setContentOffsetAnimated({x:0,y:size.height-inputFrame.height},true)
    }
    MNUtil.showHUD("Add reference")
  }
  this.userInput.becomeFirstResponder()
  // textView.becomeFirstResponder()
}

/**
 * @param {string} text 
 * @param {NSData} imageData 
 */
sideOutputController.prototype.replaceInput = function (text,imageData=undefined) {
  this.addImageInChat(imageData)
  // if (imageData) {
  //   this.currentImage = UIImage.imageWithDataScale(imageData, 2)
  //   this.imageButton.setImageForState(this.currentImage, 0)
  // }
  // let textView = this.userInput
  let textView = this.userReference
  if (text && text.trim()) {
    textView.hidden = false
    this.resizeButton.hidden = false
    let userInput = `> ${text.trim()}`
    textView.text = userInput.trim()
    // textView.custom = true
    // let frame = this.view.frame
    let inputFrame = textView.frame
    let size = textView.sizeThatFits({width:inputFrame.width,height:1000})
    if (size.height < inputFrame.height) {
      inputFrame.height = size.height
      textView.frame = inputFrame
    }else{
      textView.setContentOffsetAnimated({x:0,y:size.height-inputFrame.height},true)
    }
    // size.height = chatAIUtils.constrain(size.height, 51, MNExtensionPanel.height-45)
    // inputFrame.custom = true
    // // if (size.height > 85) {
    // inputFrame.y = 40
    //   // size.height = 85
    // // }
    // inputFrame.height = size.height
    // textView.frame = inputFrame
    MNUtil.showHUD("Replace reference")
  }
  this.userInput.becomeFirstResponder()
  // textView.becomeFirstResponder()
}
/**
 * @this {sideOutputController}
 * @param {NSURLRequest} request 
 */
sideOutputController.prototype.sendStreamRequest = function (request) {
  this.currentTime = Date.now()
  this.connection = NSURLConnection.connectionWithRequestDelegate(request,this)
}
/**
 * @this {sideOutputController}
 */
sideOutputController.prototype.popover = function(sender,commandTable,width=200,direction=2){
  this.popoverController = MNUtil.getPopoverAndPresent(sender,commandTable,width,direction)
}
/**
 * @this {sideOutputController}
 */
sideOutputController.prototype.checkPopover = function(){
  if (this.popoverController) {
    this.popoverController.dismissPopoverAnimated(true)
  }
}

/**
 * 
 * @param {string} title 
 * @param {string} selector 
 * @param {any} param 
 * @param {boolean|undefined} checked 
 * @this {sideOutputController}
 * @returns 
 */
sideOutputController.prototype.tableItem = function (title,selector,param = "",checked = false) {
  return {title:title,object:this,selector:selector,param:param,checked:checked}
}

/**
 * 
 * @param {string} title 
 * @param {number} duration 
 * @param {UIView} view 
 */
sideOutputController.prototype.showHUD = function (title,duration = 1.5,view = self.view) {
  MNUtil.showHUD(title,duration,view)
}

/**
 * 
 * @param {string} title 
 * @param {number} duration 
 * @param {UIView} view 
 */
sideOutputController.prototype.waitHUD = function (title,view = this.view) {
  MNUtil.waitHUD(title,view)
}

/**
 * @type {UIView}
 */
sideOutputController.prototype.view
/**
 * @type {sideOutputController}
 */
sideOutputController.prototype.addonController