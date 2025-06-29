/** @return {dynamicController} */
const getDynamicController = ()=>self
var dynamicController = JSB.defineClass('dynamicController : UIViewController <NSURLConnectionDelegate>', {
  viewDidLoad: function() {
    try {
    let self = getDynamicController()
    self.init()
    self.custom = false;
    self.customMode = "None"
    self.funcResponse = ""
    self.dynamic = true;
    self.pinned = false;
    self.shouldCopy = false
    self.shouldComment = false
    self.selectedText = '';
    self.searchedText = '';
    self.isLoading = false;
    self.toolbarOn = true;
    self.history = []
    self.inputHeight = 35
    self.title = "main"
    self.moveDate = Date.now()
    self.color = [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true]
    } catch (error) {
      MNUtil.showHUD("Error in viewDidLoad: "+error)
    }
  },
  viewWillAppear: function(animated) {
  },
  viewWillDisappear: function(animated) {
  },
  viewWillLayoutSubviews: function() {
    if (self.onAnimate) {
      return
    }
    self.setFrame(self.lastFrame)
    self.aiButton.frame = MNUtil.genFrame(3, 0, 31, 35)
    self.addButton.frame = MNUtil.genFrame(32, 0, 30, 35)
    self.moreButton.frame = MNUtil.genFrame(35, 0, 30, 30)
    self.modelButton.frame = MNUtil.genFrame(75, 0, 145, 25)
    self.closeButton.frame = MNUtil.genFrame(5, 0, 30, 25)
    self.sendButton.frame = MNUtil.genFrame(260, 35, 35, 35)
    self.OCREnhanced.frame = MNUtil.genFrame(225, 0, 30, 25)
    self.visionButton.frame = MNUtil.genFrame(260, 0, 35, 25)
    self.dynamicToolButton.frame = MNUtil.genFrame(40, 0, 30, 25)
    self.settingButton.frame = MNUtil.genFrame(265, self.view.frame.height-35, 30, 30)
    // self.settingButton.frame = MNUtil.genFrame(260, 0, 35, 25)
    self.promptInput.frame = MNUtil.genFrame(5, 35, 250, self.inputHeight)
    self.scrollview.frame = MNUtil.genFrame(0, 30, 300, 185)
  },
  onMoveGesture:function (gesture) {
    self.pinned = true;
    let location = chatAIUtils.getNewLoc(gesture)
    let frame = self.view.frame
    frame.x = location.x
    frame.y = location.y
    self.setFrame(frame)
  },
  openInput:async function () {
    let self = getDynamicController()
    self.openInput()
    // self.onClick = true
    // let studyFrame = MNUtil.studyView.frame
    // if (self.lastFrame.x + 300 > studyFrame.width) {
    //   self.lastFrame.x = studyFrame.width-300
    // }
    // if (self.lastFrame.y + 200 > studyFrame.height) {
    //   self.lastFrame.y = studyFrame.width-200
    // }
    // self.lastFrame.width = 300
    // self.lastFrame.height = 200
    // self.aiButton.hidden = true
    // self.setLayout(self.lastFrame)
  },
  onLongPressAI: function (gesture) {
    if (gesture.state === 1) {
      let self = getDynamicController()
      self.openInput()
      self.pinned = true;
      MNUtil.showHUD("📌 Pinned")
    }
  },
  closeInput:async function () {
    let self = getDynamicController()
    self.onClick = true
    self.pinned = false;
    self.lastFrame.width = 64
    self.lastFrame.height = 35
    self.setLayout(self.lastFrame)
    self.view.hidden = true
    self.view.backgroundColor = MNUtil.hexColorAlpha("#e4eeff",0.55)

    // self.aiButton.hidden = chatAIUtils.notifyController.onChat
    // self.addButton.hidden = !chatAIUtils.notifyController.onChat
    // self.moreButton.hidden = !chatAIUtils.notifyController.onChat
    chatAIUtils.OCREnhancedMode = false
    chatAIUtils.visionMode = false
    let autoClear = chatAIConfig.getConfig("autoClear")
    if (autoClear) {
      self.promptInput.text = ""
    }
  },
  addContext: function (params) {
      if (chatAIUtils.isMN3()) {
        MNUtil.showHUD("Only available in MN4")
        return
      }
      chatAIUtils.openSideOutput()
      let userInput = ""
      if (chatAIUtils.currentNoteId) {
        let note = MNNote.new(chatAIUtils.currentNoteId)
        userInput = `{{note:${chatAIUtils.currentNoteId}}}`
        let hasImage = chatAIUtils.hasImageInNote(note)
        if (hasImage && chatAIConfig.getConfig("autoImage")) {
          let imageData = MNNote.getImageFromNote(note)
          chatAIUtils.sideOutputController.addToInput(userInput,imageData)
        }else{
          chatAIUtils.sideOutputController.addToInput(userInput)
        }
        return
      }else{
        let selection = MNUtil.currentSelection
        if (selection.onSelection) {
          userInput = MNUtil.selectionText
          if (selection.isText || !chatAIConfig.getConfig("autoImage")) {
            chatAIUtils.sideOutputController.addToInput(userInput)
            return
          }else{
            let imageData = selection.image
            chatAIUtils.sideOutputController.addToInput("",imageData)
            return
          }
        }else{
          let note = chatAIUtils.getFocusNote()
          userInput = `{{note:${note.noteId}}}`
          let hasImage = chatAIUtils.hasImageInNote(note)
          if (hasImage) {
            let imageData = MNNote.getImageFromNote(note)
            chatAIUtils.sideOutputController.addToInput(userInput,imageData)
          }else{
            chatAIUtils.sideOutputController.addToInput(userInput)
          }
          return
        }
      }
      chatAIUtils.sideOutputController.addToInput(userInput)
  },
  onLongPress: async function (gesture) {
    if (gesture.state === 1) {
      let self = getDynamicController()
      if (chatAIUtils.isMN3()) {
        MNUtil.showHUD("Only available in MN4")
        return
      }
      self.onClick = true
      self.view.hidden = false
      let button = gesture.view
      var commandTable = []
      if (chatAIUtils.currentNoteId) {
        commandTable = [
          {title:'📝 Title',object:self,selector:'chooseInputFromNote:',param:"Title"},
          {title:'📄 Content',object:self,selector:'chooseInputFromNote:',param:"Content"},
          {title:'🖼️ Image',object:self,selector:'chooseInputFromNote:',param:"Image"}
        ];
      }else{
        commandTable = [
          {title:'📝 Text (OCR)',object:self,selector:'chooseInputFromSelection:',param:"OCR"},
          {title:'📄 Text',object:self,selector:'chooseInputFromSelection:',param:"Text"},
          {title:'🖼️ Image',object:self,selector:'chooseInputFromSelection:',param:"Image"}
        ];
        // self.popoverController = MNUtil.getPopoverAndPresent(sender,commandTable,250)
      }
      self.popoverController = MNUtil.getPopoverAndPresent(button,commandTable,150,2)
      self.popoverController.delegate = self
    }
  },
  onLongPressSend: async function (gesture) {
    if (gesture.state === 1) {
      self.promptInput.text = ""
      MNUtil.showHUD("Clear input")
    }
  },
  popoverControllerDidDismissPopover: function(controller) {
    if (self.miniMode()) {
      self.view.hidden = true
      self.onClick = false
      self.pinned = false;
    }
    // self.popoverController = undefined
    // MNUtil.showHUD("message")
  },
  chooseInputFromSelection: async function (target) {
    if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
    if (self.miniMode()) {
      self.view.hidden = true
      self.onClick = false
      self.pinned = false;
    }
    try {
    chatAIUtils.openSideOutput()
    let selection = MNUtil.currentSelection
    let userInput = ''
    switch (target) {
      case "OCR":
        userInput = await chatAINetwork.getTextOCR(selection.image)
        chatAIUtils.sideOutputController.addToInput(userInput)
        break;
      case "Text":
        userInput = selection.text
        chatAIUtils.sideOutputController.addToInput(userInput)
        break;
      case "Image":
        if (selection.onSelection) {
          let imageData = selection.image
          chatAIUtils.sideOutputController.addToInput("",imageData)
        }
        break;
      default:
        break;
    }
    } catch (error) {
      chatAIUtils.addErrorLog(error, "chooseInputFromSelection")
    }
  },
  chooseInputFromNote: function (target) {
    if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
    if (self.miniMode()) {
      self.view.hidden = true
      self.onClick = false
      self.pinned = false;
    }
    try {
    chatAIUtils.openSideOutput()
    let note = chatAIUtils.getFocusNote()
    let userInput = ``
    switch (target) {
      case "Title":
        userInput = note.noteTitle
        chatAIUtils.sideOutputController.addToInput(userInput)
        break;
      case "Content":
        userInput = note.excerptText
        chatAIUtils.sideOutputController.addToInput(userInput)
        break;
      case "Image":
        let hasImage = chatAIUtils.hasImageInNote(note)
        if (hasImage) {
          let imageData = MNNote.getImageFromNote(note)
          chatAIUtils.sideOutputController.addToInput(userInput,imageData)
        }else{
          chatAIUtils.sideOutputController.addToInput(userInput)
        }
        break;
      default:
        break;
    }
    } catch (error) {
      chatAIUtils.addErrorLog(error, "chooseInputFromNote")
    }
  },
  toggleOCREnhanceMode:async function (params) {
    chatAIUtils.OCREnhancedMode = !chatAIUtils.OCREnhancedMode
    if (chatAIUtils.OCREnhancedMode) {
      MNUtil.showHUD("OCR Enhanced ✅")
      self.OCREnhanced.backgroundColor = MNUtil.hexColorAlpha("#e06c75",0.8)
    }else{
      MNUtil.showHUD("OCR Enhanced ❌")
      self.OCREnhanced.backgroundColor = MNUtil.hexColorAlpha("#c0bfbf",0.8)
    }
  },
  toggleVisionMode:async function (params) {
    chatAIUtils.visionMode = !chatAIUtils.visionMode
    if (chatAIUtils.visionMode) {
      MNUtil.showHUD("Vision Mode ✅")
      self.visionButton.backgroundColor = MNUtil.hexColorAlpha("#e06c75",0.8)
    }else{
      MNUtil.showHUD("Vision Mode ❌")
      self.visionButton.backgroundColor = MNUtil.hexColorAlpha("#c0bfbf",0.8)
    }
  },
  toggleNoSystemMode:async function (params) {
    chatAIUtils.noSystemMode = !chatAIUtils.noSystemMode
    if (chatAIUtils.noSystemMode) {
      MNUtil.showHUD("Clear System Message")
      MNButton.setColor(self.dynamicToolButton, "#e06c75", 0.8)
    }else{
      MNButton.setColor(self.dynamicToolButton, "#c0bfbf", 0.8)
    }
  },
  openSetting:function (params) {
      if (chatAIUtils.chatController.view.hidden) {
        if (chatAIUtils.chatController.isFirst) {
          let width = 330
          chatAIUtils.chatController.view.frame = {x:self.view.frame.x-10,y:self.view.frame.y-20,width:width,height:465}
          chatAIUtils.chatController.currentFrame = chatAIUtils.chatController.view.frame
          chatAIUtils.chatController.show(self.view.frame)
          chatAIUtils.chatController.isFirst = false;
        }else{
          chatAIUtils.chatController.show(self.view.frame)
        }
      }
  },
  changeDynamicFunc: function (button) {
    let self = getDynamicController()
    try {
      if (!chatAIUtils.checkSubscribe(false)) {
        return
      }
      let currentFunc = chatAIConfig.getConfig("dynamicFunc")
      let selector = 'setDynamicFunc:'

    let newOrder = chatAITool.activatedTools
    let menu = new Menu(button,self)
    menu.width = 250
    menu.rowHeight = 35
    menu.preferredPosition = 4
    menu.addMenuItem("🛠️ All Tools",        selector,100,currentFunc.length === newOrder.length)
    let toolNames = chatAITool.toolNames
    newOrder.map((toolIndex)=>{
      let toolName = toolNames[toolIndex]
      let tool = chatAITool.getToolByName(toolName)
      menu.addMenuItem(tool.toolTitle,        selector,toolIndex,currentFunc.includes(toolIndex))
    })
    menu.addMenuItem("❌ None",             selector,-1,currentFunc.length === 0)
    menu.show()
    } catch (error) {
      chatAIUtils.addErrorLog(error, "changeDynamicFunc")
    }
  },
  setDynamicFunc(param) {
    Menu.dismissCurrentMenu()
    if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
    if (!chatAIUtils.checkSubscribe()) {
      return
    }
try {
    let currentFunc = chatAIConfig.config.dynamicFunc ? chatAIConfig.config.dynamicFunc : []
    switch (param) {
      case -1://None
        currentFunc = []
        break;
      case 100://All
        currentFunc = chatAITool.activatedTools
        break
      default:
        if (currentFunc.includes(param)) {
          //已经选中了则去除选中状态
          currentFunc = currentFunc.filter(func=> func!==param)
        }else{
          //未选中则增加
          currentFunc.push(param)
        }
        //排序
        currentFunc.sort(function(a, b) {
          return a - b;
        });
        break;
    }
    chatAIConfig.config.dynamicFunc = currentFunc
    chatAIConfig.save("MNChatglm_config")
} catch (error) {
  chatAIUtils.addErrorLog(error, "setDynamicFunc")
}

  },
  changePromptModel: function(button) {
    let self = getDynamicController()
    if (!chatAIUtils.checkSubscribe(false)) {
      return
    }
    try {
    let selector = 'setPromptModel:'
    let modelName = chatAIConfig.getConfig("dynamicModel")
    let allModels = chatAIConfig.allSource(false,true)
    var commandTable = [
      self.tableItem("Built-in", selector,"Built-in",modelName === "Built-in")
    ]
    let syncDynamicModel = chatAIConfig.getConfig("syncDynamicModel")
    if (!syncDynamicModel) {
      commandTable.unshift(self.tableItem("Default", selector,"Default",modelName === "Default"))
    }
    let secondeSelector = 'changePromptModelFromSource:'
    allModels.map((m,index)=>{
      if (chatAIConfig.hasAPIKeyInSource(m)) {
        if (modelName.startsWith(m)) {
          commandTable.push(self.tableItem("👉  "+m,secondeSelector,{source:m,button:button,index:index},true))
        }else{
          commandTable.push(self.tableItem("➡️  "+m,secondeSelector,{source:m,button:button,index:index},false))
        }
      }
    })
    self.popover(button, commandTable,220,1)
    } catch (error) {
      chatAIUtils.addErrorLog(error, "dynamicController.changePromptModel")
    }
  },
  changePromptModelFromSource: function (params) {
  try {
    let self = getDynamicController()
    let syncDynamicModel = chatAIConfig.getConfig("syncDynamicModel")
    if (!syncDynamicModel && !chatAIUtils.checkSubscribe(false)) {
      return
    }
    let source = params.source
    let button = params.button
    let selectIndex = params.index
    // MNUtil.showHUD("message"+selectIndex)
    self.checkPopover()
    let selector = 'setPromptModel:'
    let modelName = chatAIConfig.getConfig("dynamicModel")
    let allModels = chatAIConfig.allSource(false,true)
    var commandTable = [
      self.tableItem("Default", selector,"Default",modelName === "Default"),
      self.tableItem("Built-in", selector,"Built-in",modelName === "Built-in")
    ]
    let secondeSelector = 'changePromptModelFromSource:'
    let sourceModels = chatAIConfig.getAvailableModels(source)
    let widths = []
    let indices = []
    allModels.map((m,index)=>{
      if (chatAIConfig.hasAPIKeyInSource(m)) {
        if (index === selectIndex) {
          commandTable.push(self.tableItem("👇  "+m,"",{source:m,button:button},false))
        }else if (modelName.startsWith(m)) {
          commandTable.push(self.tableItem("👉  "+m,secondeSelector,{source:m,button:button,index:index},true))
        }else{
          commandTable.push(self.tableItem("➡️  "+m,secondeSelector,{source:m,button:button,index:index},false))
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
    // MNUtil.copyJSON(indices)
    // MNUtil.showHUD(source)
    
  } catch (error) {
    chatAIUtils.addErrorLog(error, "changePromptModelFromSource")
  }
  },
  setPromptModel: function (model) {
    let self = getDynamicController()
    if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
    let syncDynamicModel = chatAIConfig.getConfig("syncDynamicModel")
    //开启DynamicModel同步下,不订阅也能继续操作
    if (!syncDynamicModel && model !== "Default" && !chatAIUtils.checkSubscribe(true)) {
      return
    }
    self.setCurrentModel(model)
  },
  sendButtonTapped: async function () {
  try {
    if (!chatAIUtils.checkCouldAsk()) {
      return
    }
    let self = getDynamicController();
    self.promptInput.endEditing(true)
    let userInput = self.promptInput.text
    let notifyController = chatAIUtils.notifyController
    let currentNoteId = chatAIUtils.currentNoteId
    notifyController.notShow = false

    if (chatAIUtils.visionMode) {
      // MNUtil.showHUD("Vision")
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
        let systemMessage = await chatAIUtils.getTextVarInfo(system,userInput)
        let question = [{role:"system",content:systemMessage},chatAIUtils.genUserMessage(userInput, imageDatas)]
        // MNUtil.copy(question)
        notifyController.askByVision(question)
        return
      }
      let question = chatAIUtils.genUserMessage(userInput, imageDatas)
      notifyController.askByVision(question)
      return
    }
    if (chatAIUtils.noSystemMode) {
      let question = [{role: "user", content: userInput}]
      notifyController.askByDynamic(question)
      notifyController.currentPrompt = "Dynamic"
      // notifyController.onChat = false
      // MNUtil.showHUD("No System Message")
      return
    }
    if (MNUtil.currentSelection.onSelection || !currentNoteId) {
      notifyController.askWithDynamicPromptOnText(userInput)
      // MNUtil.showHUD("askWithDynamicPromptOnText")
      return
    }else{
      notifyController.askWithDynamicPromptOnNote(currentNoteId,userInput)
      // MNUtil.showHUD("askWithDynamicPromptOnNote")
      return
    }
  } catch (error) {
    chatAIUtils.addErrorLog(error, "askWithPrompt")
  }
  },
  textViewDidBeginEditing:function (textview) {
    // showHUD("begin")
    self.notifyTimer.invalidate()
  },
  onPromptButton:async function (sender) {
  try {
    if (!chatAIUtils.checkCouldAsk()) {
      return
    }
    // if (chatAIUtils.visionMode) {
    //   MNUtil.showHUD("Unavailable for vision mode")
    //   return
    // }
    let self = getDynamicController()
    let userInput = self.promptInput.text
    self.promptInput.endEditing(true)
    let title = sender.id
    let selection = MNUtil.currentSelection
    if (selection.onSelection) {
      chatAIUtils.notifyController.text = selection.text
      chatAIUtils.notifyController.noteid = undefined
    }else{
      if (chatAIUtils.getFocusNote()) {
        chatAIUtils.notifyController.noteid = chatAIUtils.getFocusNote().noteId
      }else{
        chatAIUtils.notifyController.noteid = undefined
      }
    }
    chatAIUtils.notifyController.currentPrompt = title
    chatAIUtils.notifyController.notShow = false
    // MNUtil.showHUD("getQuestion")
    let question = await chatAIUtils.chatController.getQuestion(title,userInput)
    if (!question) {
      return
    }
    // MNUtil.copy(question)
    chatAIUtils.notifyController.ask(question,title)
    } catch (error) {
    chatAIUtils.addErrorLog(error, "onPromptButton")
  }
  },
  scrollViewDidScroll: function(scrollview) {
    // if (self.closeButton.hidden) {
    //   self.promptInput.hidden = true
    //   self.sendButton.hidden = true
    //   return
    // }
    if (scrollview.id && scrollview.id === "promptScrollView") {
      let offset = scrollview.contentOffset.y
      self.promptInput.hidden = offset > 30
      self.sendButton.hidden = offset > 30
    }
    // MNUtil.copyJSON(scrollview.contentOffset)
    // MNUtil.showHUD("message"+scrollview.frame.height)
  },
  /**
   * 
   * @param {UITextView} textview 
   */
  textViewDidChange:async function (textview) {
    let self = getDynamicController();
    let size = textview.sizeThatFits({width:textview.frame.width,height:1000})
    size.height = MNUtil.constrain(size.height, 35, 175)
    self.inputHeight = size.height
    self.promptInput.frame = MNUtil.genFrame(45, 5, 210, size.height)
    // MNUtil.showHUD("change:"+JSON.stringify(size))
    // MNUtil.genFrame(45, 5, 210, 35)
    if (/\n\n$/.test(textview.text) && textview.text.trim()) {
      let selectedRange = textview.selectedRange
      if (textview.text.length !== selectedRange.location) {
        return
      }

      if (chatAIUtils.notifyController.connection) {
        MNUtil.showHUD("Wait...")
        return
      }
      let text = textview.text.trim()
      self.promptInput.text = text
      let size = self.promptInput.sizeThatFits({width:210,height:1000})
      size.height = MNUtil.constrain(size.height, 35, 175)
      self.inputHeight = size.height
      self.promptInput.frame = MNUtil.genFrame(45, 5, 210, size.height)
      if (chatAIUtils.currentSelection || !chatAIUtils.currentNoteId) {
        self.askWithPromptOnText()
        return
      }else if (chatAIUtils.currentNoteId) {
        self.askWithPromptOnNote(chatAIUtils.currentNoteId)
        return
      }else{
        let userInput = text
        let question = [{role: "user", content: userInput}]
        chatAIUtils.notifyController.askByDynamic(question)
        chatAIUtils.notifyController.currentPrompt = "Dynamic"
        MNUtil.showHUD("No System Message")
        return
      }
    }
  },
});
/**
 * @this {dynamicController}
 */
dynamicController.prototype.init = function () {
  this.highlightColor = UIColor.blendedColor(MNUtil.hexColorAlpha("#2c4d81",0.8),
    chatAIUtils.app.defaultTextColor,
    0.8
  );
  if (this.firstFrame) {
    this.view.frame = this.firstFrame
  }else{
    this.view.frame = MNUtil.genFrame(50, 50, 64, 35)
  }

    this.lastFrame = this.view.frame;
    this.view.layer.shadowOffset = {width: 0, height: 0};
    this.view.layer.shadowRadius = 15;
    this.view.layer.shadowOpacity = 0.5;
    this.view.layer.shadowColor = UIColor.colorWithWhiteAlpha(0.5, 1);
    this.view.layer.cornerRadius = 10
    this.view.layer.borderColor = MNUtil.hexColorAlpha("#9bb2d6",0.8)
    this.view.layer.borderWidth = 0
    this.view.backgroundColor = MNUtil.hexColorAlpha("#e4eeff",0.55)
    this.view.autoresizingMask = (1 << 0 | 1 << 3);

    this.scrollview = UIScrollView.new()
    this.view.addSubview(this.scrollview)
    this.scrollview.hidden = true
    this.scrollview.delegate = this
    this.scrollview.bounces = true
    this.scrollview.opacity = 1.0
    this.scrollview.alwaysBounceVertical = true
    this.scrollview.layer.cornerRadius = 11
    this.scrollview.backgroundColor = MNUtil.hexColorAlpha("#b3c4dc",0.5)
    this.scrollview.autoresizingMask = (1 << 0 | 1 << 3);
    this.scrollview.id = "promptScrollView"
  this.reloadImage = MNUtil.getImage(chatAIConfig.mainPath + `/reload.png`)
  this.stopImage = MNUtil.getImage(chatAIConfig.mainPath + `/stop.png`)
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
  this.ocrImage = MNUtil.getImage(chatAIConfig.mainPath + `/ocr.png`,2.2)
  this.visionImage = MNUtil.getImage(chatAIConfig.mainPath + `/vision.png`,1.5)
  this.eraserImage = MNUtil.getImage(chatAIConfig.mainPath + `/eraser.png`,2.1)
  this.settingImage = MNUtil.getImage(chatAIConfig.mainPath + `/setting.png`)
  this.addImage = MNUtil.getImage(chatAIConfig.mainPath + `/add.png`,2.3)
  this.moreImage = MNUtil.getImage(chatAIConfig.mainPath + `/more.png`)

  this.aiButton = this.createButton("openInput:")
  this.aiButton.setImageForState(this.aiImage,0)
  this.aiButton.hidden = false
  this.aiButton.frame = MNUtil.genFrame(3, 0, 31, 35)
  this.aiButton.layer.cornerRadius = 10
  // this.aiButton.backgroundColor =  MNUtil.hexColorAlpha("#ffffff",0)
  this.aiButton.backgroundColor =  MNUtil.hexColorAlpha("#b9d3fe",0)
  // this.view.backgroundColor = MNUtil.hexColorAlpha("#e4eeff",0.55)

  MNButton.addLongPressGesture(this.aiButton, this, "onLongPressAI:")

  this.addButton = this.createButton("addContext:")
  this.addButton.setImageForState(this.addImage,0)
  this.addButton.hidden = false
  this.addButton.layer.cornerRadius = 10
  this.addButton.frame = MNUtil.genFrame(32, 0, 30, 35)
  this.addButton.backgroundColor =  MNUtil.hexColorAlpha("#b9d3fe",0)
  MNButton.addLongPressGesture(this.addButton, this, "onLongPress:")

  this.moreButton = this.createButton("moreContext:")
  this.moreButton.setImageForState(this.moreImage,0)
  this.moreButton.hidden = true
  this.moreButton.layer.cornerRadius = 11
  this.moreButton.frame = MNUtil.genFrame(35, 0, 30, 30)
  this.moreButton.backgroundColor =  MNUtil.hexColorAlpha("#b9d3fe",0.3)

  MNButton.addLongPressGesture(this.moreButton, this, "onLongPress:")

  this.modelButton = this.createButton("changePromptModel:")
  this.modelButton.hidden = false
  this.modelButton.layer.cornerRadius = 8
  this.modelButton.frame = MNUtil.genFrame(75, 5, 145, 25)
  // this.modelButton.backgroundColor =  MNUtil.hexColorAlpha("#89a6d5",0.8)
  this.modelButton.layer.opacity = 1.0
  // this.modelButton.lineBreakMode = 3
  MNButton.setColor(this.modelButton, "#5694ff",0.8)

  this.setCurrentModel()

  this.closeButton = this.createButton("closeInput:")
  this.closeButton.setImageForState(this.stopImage,0)
  this.closeButton.hidden = true
  this.closeButton.backgroundColor =  MNUtil.hexColorAlpha("#e06c75",0.8)

  this.sendButton = this.createButton("sendButtonTapped:")
  this.sendButton.setImageForState(this.sendImage,0)
  this.sendButton.hidden = true
  this.sendButton.backgroundColor =  MNUtil.hexColorAlpha("#e06c75",0.8)
  MNButton.addLongPressGesture(this.sendButton, this, "onLongPressSend:",0.5)

  this.promptInput = this.creatTextView("view","#89a6d5",0.8)
  this.promptInput.hidden = true

  this.promptInput.layer.shadowOffset = {width: 0, height: 0};
  this.promptInput.layer.shadowRadius = 15;
  this.promptInput.layer.shadowOpacity = 0.5;
  this.promptInput.layer.shadowColor = UIColor.colorWithWhiteAlpha(0.5, 1);
  this.promptInput.layer.cornerRadius = 10
  this.promptInput.layer.borderColor = MNUtil.hexColorAlpha("#9bb2d6",0.8)
  this.promptInput.layer.borderWidth = 0

  // this.promptInput.layer.borderColor = MNUtil.hexColorAlpha("#4769a0",0.3)
  // // this.promptInput.backgroundColor = MNUtil.hexColorAlpha("#e4eeff",0.8)
  // this.promptInput.scrollEnabled = true
  // this.promptInput.bounces = true
  // this.promptInput.custom = false
  // this.promptInput.layer.borderWidth = 2

  this.OCREnhanced = this.createButton("toggleOCREnhanceMode:")
  this.OCREnhanced.setImageForState(this.ocrImage,0)
  this.OCREnhanced.hidden = true
  this.OCREnhanced.backgroundColor =  MNUtil.hexColorAlpha("#c0bfbf",0.8)

  this.visionButton = this.createButton("toggleVisionMode:")
  this.visionButton.setImageForState(this.visionImage,0)
  this.visionButton.hidden = true
  this.visionButton.backgroundColor =  MNUtil.hexColorAlpha("#c0bfbf",0.8)

  this.dynamicToolButton = this.createButton("changeDynamicFunc:")
  MNButton.setTitle(this.dynamicToolButton, "🛠️",14,true)
  // this.dynamicToolButton.setImageForState(this.eraserImage,0)
  this.dynamicToolButton.hidden = true
  this.dynamicToolButton.backgroundColor =  MNUtil.hexColorAlpha("#c0bfbf",0.8)

  this.settingButton = this.createButton("openSetting:")
  this.settingButton.setImageForState(this.settingImage,0)
  this.settingButton.hidden = true
  this.settingButton.backgroundColor =  MNUtil.hexColorAlpha("#c0bfbf",0.8)

  MNButton.addPanGesture(this.closeButton, this, "onMoveGesture:")
  MNButton.addPanGesture(this.sendButton, this, "onMoveGesture:")
  MNButton.addPanGesture(this.modelButton, this, "onMoveGesture:")
  // this.moveGesture = new UIPanGestureRecognizer(this,"onMoveGesture:")
  // this.closeButton.addGestureRecognizer(this.moveGesture)
  // this.moveGesture.view.hidden = false
  // this.moveGesture.addTargetAction(this,"onMoveGesture:")
  // this.moveGesture1 = new UIPanGestureRecognizer(this,"onMoveGesture:")
  // this.sendButton.addGestureRecognizer(this.moveGesture1)
  // this.moveGesture1.view.hidden = false
  // this.moveGesture1.addTargetAction(this,"onMoveGesture:")
}

dynamicController.prototype.createButton = function (targetAction,superview,) {
  /** @type {UIButton} */
  let button = UIButton.buttonWithType(0);
  button.autoresizingMask = (1 << 0 | 1 << 3);
  button.setTitleColorForState(UIColor.whiteColor(),0);
  button.setTitleColorForState(this.highlightColor, 1);
  button.backgroundColor =  MNUtil.hexColorAlpha("#89a6d5",1.0)
  // button.backgroundColor = hexColorAlpha("#4769a0",1.0)
  button.layer.cornerRadius = 8;
  button.layer.masksToBounds = true;
  button.titleLabel.font = UIFont.systemFontOfSize(16);
  if (targetAction) {
    button.addTargetActionForControlEvents(this, targetAction, 1 << 6);
  }
  if (superview) {
    this[superview].addSubview(button)
  }else{
    this.view.addSubview(button);
  }
  return button
}

/**
 * @this {dynamicController}
 */
dynamicController.prototype.setLayout = async function (frame) {
  MNUtil.studyView.bringSubviewToFront(this.view)
  if (frame.width !== 300) {
    frame.width = 64
    frame.height = 35
    this.closeButton.hidden = true
    this.sendButton.hidden = true
    this.promptInput.hidden = true
    this.modelButton.hidden = true
    this.OCREnhanced.hidden = true
    this.visionButton.hidden = true
    this.dynamicToolButton.hidden = true
    this.settingButton.hidden = true
    this.promptInput.hidden = true
    this.scrollview.hidden = true
    this.aiButton.hidden = !this.miniMode()//!(this.lastFrame.width === 40 && !onChat)
    this.addButton.hidden = !this.miniMode()//!(this.lastFrame.width === 40 && onChat)
    this.moreButton.hidden = true//!(this.lastFrame.width === 40 && onChat)
  }
  this.lastFrame = frame
  await this.animateTo(frame)
  if (this.miniMode()) {
    this.closeButton.hidden = true
    this.sendButton.hidden = true
    this.OCREnhanced.hidden = true
    this.visionButton.hidden = true
    this.dynamicToolButton.hidden = true
    this.modelButton.hidden = true
    this.settingButton.hidden = true
    this.promptInput.hidden = true
    this.scrollview.hidden = true
    this.aiButton.hidden = false
    this.addButton.hidden = false
    this.moreButton.hidden = true
    this.view.backgroundColor = MNUtil.hexColorAlpha("#e4eeff",0.55)
  }else{
    try {
    this.closeButton.hidden = false
    this.sendButton.hidden = false
    this.OCREnhanced.hidden = false
    this.modelButton.hidden = false
    this.visionButton.hidden = false
    this.dynamicToolButton.hidden = false
    this.settingButton.hidden = false
    this.promptInput.hidden = false
    this.scrollview.hidden = false
    this.view.backgroundColor = MNUtil.hexColorAlpha("#e4eeff",0.)
    if (chatAIUtils.OCREnhancedMode) {
      this.OCREnhanced.backgroundColor = MNUtil.hexColorAlpha("#e06c75",0.8)
    }else{
      this.OCREnhanced.backgroundColor = MNUtil.hexColorAlpha("#c0bfbf",0.8)
    }
    if (chatAIUtils.visionMode) {
      this.visionButton.backgroundColor = MNUtil.hexColorAlpha("#e06c75",0.8)
    }else{
      this.visionButton.backgroundColor = MNUtil.hexColorAlpha("#c0bfbf",0.8)
    }
    if (chatAIUtils.noSystemMode) {
      this.dynamicToolButton.backgroundColor = MNUtil.hexColorAlpha("#e06c75",0.8)
    }else{
      this.dynamicToolButton.backgroundColor = MNUtil.hexColorAlpha("#c0bfbf",0.8)
    }
      this.setButtonText(chatAIConfig.config.promptNames)
    } catch (error) {
      chatAIUtils.addErrorLog(error, "setLayout")
    }
  }
  return
}
/**
 * @this {dynamicController}
 */
dynamicController.prototype.openInput = async function () {
  // MNUtil.showHUD("message")
  try {
  this.onClick = true
  let studyFrame = MNUtil.studyView.frame
  if (this.lastFrame.x + 300 > studyFrame.width) {
    this.lastFrame.x = studyFrame.width-300
  }
  if (this.lastFrame.y + 215 > studyFrame.height) {
    this.lastFrame.y = studyFrame.height-215
  }
  this.lastFrame.width = 300
  this.lastFrame.height = 215
  this.aiButton.hidden = true
  this.addButton.hidden = true
  let selection = MNUtil.currentSelection
  if (selection.onSelection) {
    if (!selection.isText && chatAIConfig.getConfig("autoImage")) {
      chatAIUtils.visionMode = true
    }
  }else{
    let focusNote = chatAIUtils.getFocusNote()
    if (chatAIUtils.hasImageInNote(focusNote) && chatAIConfig.getConfig("autoImage")) {
      chatAIUtils.visionMode = true
    }
  }
  let model = chatAIConfig.getConfig("dynamicModel")
  let modelConfig = chatAIConfig.parseModelConfig(model)
  if (modelConfig.source === "Built-in") {
    MNButton.setTitle(this.modelButton, "Built-in",14,true)
  }else{
    MNButton.setTitle(this.modelButton, modelConfig.model,14,true)
  }
  await this.setLayout(this.lastFrame)
  this.view.backgroundColor = MNUtil.hexColorAlpha("#e4eeff",0)
  this.view.hidden = false
  if (MNUtil.version.type === "macOS" && (!MNUtil.activeTextView)) {
    this.promptInput.becomeFirstResponder()
  }
  } catch (error) {
    chatAIUtils.addErrorLog(error, "dynamicController.openInput")
  }
  // if (!chatAIUtils.currentNoteId && !chatAIUtils.currentSelection) {
  //   chatAIUtils.noSystemMode = true
  //   if (chatAIUtils.noSystemMode) {
  //     this.systemButton.backgroundColor = MNUtil.hexColorAlpha("#e06c75",0.8)
  //   }else{
  //     this.systemButton.backgroundColor = MNUtil.hexColorAlpha("#c0bfbf",0.8)
  //   }
  // }
}
/**
 * @this {dynamicController}
 * @returns {UITextView}
 */
dynamicController.prototype.creatTextView = function (superview="view",color="#e4eeff",alpha=0.9) {
  /** @type {UITextView} */
  let view = UITextView.new()
  view.font = UIFont.systemFontOfSize(15);
  view.layer.cornerRadius = 8
  view.backgroundColor = MNUtil.hexColorAlpha(color,alpha)
  view.textColor = UIColor.blackColor()
  view.delegate = this
  view.bounces = true
  this[superview].addSubview(view)
  return view
}


/**
 * @this {dynamicController}
 */
dynamicController.prototype.setButtonText = function (names) {
  try {
    this.words = names
    // MNUtil.copyJSON(names)
    names.map((word,index)=>{
      if (!this["nameButton"+index]) {
        this["nameButton"+index] = this.createButton("onPromptButton:","scrollview")
        // this.createButton("nameButton"+index,"onPromptButton:","scrollview")
        this["nameButton"+index].titleLabel.font = UIFont.systemFontOfSize(16);
      }
      this["nameButton"+index].hidden = false
      this["nameButton"+index].setTitleForState(chatAIConfig.prompts[word].title,0) 
      this["nameButton"+index].id = word
      this["nameButton"+index].backgroundColor = MNUtil.hexColorAlpha("#7093cb",0.75);
      this["nameButton"+index].isSelected = false
    })
    this.refreshLayout()
  } catch (error) {
    chatAIUtils.addErrorLog(error, "dynamicController.setButtonText",{names:names,prompts:chatAIConfig.prompts})
  }
}

/**
 * @this {dynamicController}
 */
dynamicController.prototype.refreshLayout = function () {
    var viewFrame = this.scrollview.bounds;
    var xLeft     = 0
    let initX = 5
    let initY = 45
    let initL = 0
    this.locs = [];
    this.words.map((word,index)=>{
      let title = chatAIConfig.prompts[word].title
      if (!title) {
        title = "noTitle"
      }
      let width = this["nameButton"+index].sizeThatFits({width:100,height:30}).width+15
      // let width = chatAIUtils.strCode(title.replaceAll(" ",""))*9+15
      if (xLeft+initX+width > viewFrame.width) {
        initX = 5
        initY = initY+36
        initL = initL+1
      }
      this["nameButton"+index].frame = {  x: xLeft+initX,  y: initY,  width: width,  height: 30,};
      this.locs.push({
        x:xLeft+initX,
        y:initY,
        l:initL,
        i:index
      })
      initX = initX+width+6
    })
    if (this.lastLength && this.lastLength>this.words.length) {
      for (let index = this.words.length; index < this.lastLength; index++) {
        this["nameButton"+index].hidden = true
      }
    }
    this.lastLength = this.words.length
    this.scrollview.contentSize= {width:viewFrame.width,height:initY+40}
  
}

/**
 * @this {dynamicController}
 */
dynamicController.prototype.getItemFromNoteByOrder = function (note) {
    let order = chatAIConfig.getConfig("searchOrder")
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
          let commentText
          let comment = note.comments.find(comment=>{
            switch (comment.type) {
              case "TextNote":
                if (/^marginnote\dapp:\/\//.test(comment.text)) {
                  return false
                }else{
                  commentText = comment.text
                  return true
                }
              case "HtmlNote":
                commentText = comment.text
                return true
              case "LinkNote":
                if (comment.q_hpic && !note.textFirst) {
                  return false
                }else{
                  commentText = comment.q_htext
                  return true
                }
              default:
                return false
            }
          })
          if (commentText && commentText.length) {
            text = commentText
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
/**
 * @this {dynamicController}
 */
dynamicController.prototype.getImageForOCR = function (noteId,userChoice,prompt) {
  //用户没手动开启，自然为false
  if (!userChoice) {
    return undefined
  }
  // if (noteId) {
  //   let note = MNUtil.getNoteById(noteId)
  // }
  let contextHasOCR = prompt.context.includes("{{textOCR}}")
  let systemHasOCR = prompt.system && prompt.system.includes("{{textOCR}}")
  let contextHasContext = prompt.context.includes("{{context}}")
  let systemHasContext = prompt.system && prompt.system.includes("{{context}}")

  if (contextHasOCR || systemHasOCR) {
    return undefined
  }
  if (!contextHasContext && !systemHasContext) {
    return undefined
  }

  let image = MNUtil.currentDocController.imageFromSelection()
  if (!image) {
      image = MNUtil.currentDocController.imageFromFocusNote()
  }
  return image


}

/**
 * @this {dynamicController}
 */
dynamicController.prototype.askWithPromptOnText = async function (userInput,ocr) {
  try {
  if (!userInput) {
    userInput = this.promptInput.text
  }
  let dynamicPrompt = chatAIConfig.dynamicPrompt
  let system = dynamicPrompt.text
  let systemMessage = await chatAIUtils.getTextVarInfo(system,userInput,undefined,ocr)
  let question = [{role:"system",content:systemMessage},{role: "user", content: userInput}]
  chatAIUtils.notifyController.askByDynamic(question)
  chatAIUtils.notifyController.currentPrompt = "Dynamic"
  chatAIUtils.notifyController.noteid = undefined
    } catch (error) {
    MNUtil.showHUD(error)
  }
}

/**
 * @this {dynamicController}
 */
dynamicController.prototype.askWithPromptOnNote = async function (noteid,userInput,ocr) {
  try {
  if (!userInput) {
    userInput = this.promptInput.text
  }
  let system = chatAIConfig.dynamicPrompt.note
  let systemMessage = await chatAIUtils.getNoteVarInfo(noteid, system,userInput,undefined,ocr)
  // MNUtil.copy(systemMessage)
  if (systemMessage === undefined) {
    return
  }
  let question = [{role:"system",content:systemMessage},{role: "user", content: userInput}]
  chatAIUtils.notifyController.askByDynamic(question)
  chatAIUtils.notifyController.currentPrompt = "Dynamic"
  chatAIUtils.notifyController.noteid = chatAIUtils.currentNoteId
    } catch (error) {
    chatAIUtils.addErrorLog(error, "askWithPromptOnNote")
  }
}
/**
 * @this {dynamicController}
 */
dynamicController.prototype.animateTo = async function (targetFrame) {
    let studyFrame = MNUtil.studyView.frame
    if (targetFrame.x+targetFrame.width > studyFrame.width) {
      targetFrame.x = studyFrame.width-300
    }
    if (targetFrame.y+targetFrame.height > studyFrame.height) {
      targetFrame.y = studyFrame.height-215
    }
    return new Promise((resolve, reject) => {
    this.onAnimate = true
    if (this.view.hidden) {
      this.setFrame(targetFrame)
      this.view.layer.opacity = 0
      this.view.hidden = false
    }
    MNUtil.animate(()=>{
      this.setFrame(targetFrame)
      this.view.layer.opacity = 1.0
      // this.aiButton.frame = MNUtil.genFrame(0, 0, 40, 40)
      // this.addButton.frame = MNUtil.genFrame(0, 0, 30, 30)
      this.aiButton.frame = MNUtil.genFrame(3, 0, 31, 35)
      this.addButton.frame = MNUtil.genFrame(32, 0, 30, 35)
      this.moreButton.frame = MNUtil.genFrame(35, 0, 30, 30)
      this.modelButton.frame = MNUtil.genFrame(75, 0, 145, 25)
      this.closeButton.frame = MNUtil.genFrame(5, 0, 30, 25)
      this.sendButton.frame = MNUtil.genFrame(260, 35, 35, 35)
      this.OCREnhanced.frame = MNUtil.genFrame(225, 0, 30, 25)
      this.visionButton.frame = MNUtil.genFrame(260, 0, 35, 25)
      this.dynamicToolButton.frame = MNUtil.genFrame(40, 0, 30, 25)
      this.settingButton.frame = MNUtil.genFrame(265, this.view.frame.height-35, 30, 30)
      this.promptInput.frame = MNUtil.genFrame(5, 35, 250, this.inputHeight)
      this.scrollview.frame = MNUtil.genFrame(0, 30, 300, 185)
    },0.1).then(()=>{
      this.onAnimate = false
      resolve()
    })
    })
}
/**
 * 设置当前模型,只是UI上的操作
 * @param {string} model
 * @this {dynamicController}
 */
dynamicController.prototype.setCurrentModel = async function (model) {
  try {
    if (!model) {
      model = chatAIConfig.getConfig("dynamicModel")
    }
    let modelConfig = chatAIConfig.parseModelConfig(model)
    if (modelConfig.source === "Built-in") {
      MNButton.setTitle(this.modelButton, "Built-in",14,true)
    }else{
      MNButton.setTitle(this.modelButton, modelConfig.model,14,true)
    }
    if (model !== chatAIConfig.getConfig("dynamicModel")) {
      chatAIConfig.config.dynamicModel = model
      let syncDynamicModel = chatAIConfig.getConfig("syncDynamicModel")
      if (syncDynamicModel) {
        chatAIConfig.setDefaultModel(modelConfig.source, modelConfig.model)
      }else{
        chatAIConfig.save("MNChatglm_config")
      }
    }
  } catch (error) {
    chatAIUtils.addErrorLog(error, "setCurrentModel")
  }
}
/**
 * @this {dynamicController}
 */
dynamicController.prototype.setFrame = function (frame) {
  let studyFrame = MNUtil.studyView.frame
  let lastFrame = frame
  if (lastFrame.width !== 300) {
    lastFrame.width = 64
    lastFrame.height = 35
  }
  lastFrame.x = MNUtil.constrain(lastFrame.x, 0, studyFrame.width-lastFrame.width)
  lastFrame.y = MNUtil.constrain(lastFrame.y, 0, studyFrame.height-lastFrame.height)
  this.lastFrame = lastFrame
  this.view.frame = lastFrame
}
/**
 * @this {dynamicController}
 * @param {*} sender 
 * @param {*} commandTable 
 * @param {*} width 
 * @param {*} direction 
 */
dynamicController.prototype.popover = function(sender,commandTable,width=200,direction=2){
  this.popoverController = MNUtil.getPopoverAndPresent(sender,commandTable,width,direction)
}

/**
 * @this {dynamicController}
 */
dynamicController.prototype.checkPopover = function(){
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
 * @this {dynamicController}
 * @returns 
 */
dynamicController.prototype.tableItem = function (title,selector,param = "",checked = false) {
  return {title:title,object:this,selector:selector,param:param,checked:checked}
}
dynamicController.prototype.miniMode = function () {
  return this.view.frame.width === 64
}
/**
 * @type {UIView}
 */
dynamicController.prototype.view
