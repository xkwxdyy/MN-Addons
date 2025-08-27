/** @return {chatglmController} */
const getChatglmController = ()=>self
var chatglmController = JSB.defineClass('chatglmController : UIViewController', {
  viewDidLoad: function() {
    try {
    let self = getChatglmController()
    self.init()
    self.view.frame = {x:50,y:50,width:chatAIUtils.getWidth(),height:450}
    self.lastFrame = self.view.frame;
    self.currentFrame = self.view.frame
    if (!self.settingView) {
      self.createSettingView()
    }
    self.settingViewLayout()
      self.setButtonText(chatAIConfig.config.promptNames,chatAIConfig.currentPrompt)
      self.setTextview(chatAIConfig.currentPrompt)
      self.settingView.hidden = false

    self.createButton("moveButton","moveButtonTapped:")
    self.moveButton.clickDate = 0
    MNButton.setColor(self.moveButton, "#3a81fb",0.5)

    self.moveGesture = new UIPanGestureRecognizer(self,"onMoveGesture:")
    self.moveButton.addGestureRecognizer(self.moveGesture)
    self.moveGesture.view.hidden = false
    // self.moveGesture.addTargetAction(self,"onMoveGesture:")

    self.resizeGesture = new UIPanGestureRecognizer(self,"onResizeGesture:")
    self.promptSaveButton.addGestureRecognizer(self.resizeGesture)
    self.resizeGesture.view.hidden = false

    self.resizeGesture0 = new UIPanGestureRecognizer(self,"onResizeGesture:")
    self.saveCustomButton.addGestureRecognizer(self.resizeGesture0)
    self.resizeGesture.view.hidden = false
    // MNButton.addPanGesture(self.saveCustomButtonConfig, self, "onResizeGesture:")
    // self.saveCustomButtonConfig.addGestureRecognizer(self.resizeGesture)
    // self.resizeGesture.addTargetAction(self,"onResizeGesture:")
    // self.chatglmController.view.hidden = false
    } catch (error) {
      chatAIUtils.addErrorLog(error, "viewDidLoad")
      // MNUtil.copy(error)

    }
  },
  viewWillAppear: function(animated) {
  },
  viewWillDisappear: function(animated) {
  },
  viewWillLayoutSubviews: function() {
  try {
    let self = getChatglmController()
    // let buttonHeight = 25
    // self.view.frame = self.currentFrame
    var viewFrame = self.view.bounds;
    var width    = viewFrame.width
    var height   = viewFrame.height
    self.moveButton.frame = {  x: width*0.5-75,  y: 0,  width: 150,  height: 16,};
    height = height-36
    self.settingViewLayout()
    self.refreshLayout()
  } catch (error) {
    chatAIUtils.addErrorLog(error, "viewWillLayoutSubviews")
  }

  },
  moveButtonTapped: async function (button) {
    if (chatAIConfig.onSync) {
      var commandTable = [
        {title:'❌ Stop Current Sync',object:self,selector:'stopSync:',param:[1,2,3]}
      ];
      self.popoverController = chatAIUtils.getPopoverAndPresent(button,commandTable,200,1)
    }
    return
  },
  stopSync:function (params) {
    self.checkPopover()
    chatAIConfig.setSyncStatus(false,false)
    MNUtil.showHUD("Stop Current Sync")
  },
  openChatView: function (params) {
    self.checkPopover()
    chatAIUtils.notifyController.preFuncResponse = ""
    chatAIUtils.notifyController.onChat = true
    chatAIUtils.notifyController.openChatView(false)
    chatAIUtils.notifyController.beginNotification("Chat")
  },
  changeSearchOrder: function(sender) {
    let searchOrder = chatAIConfig.config.searchOrder
    let orderNumber = chatAIConfig.getOrderNumber(searchOrder)
    var commandTable = [
      {title:'Title → Excerpt → Comment',object:self,selector:'setSearchOrder:',param:[1,2,3,4],checked:orderNumber =="1234"},
      {title:'Title → Comment → Excerpt',object:self,selector:'setSearchOrder:',param:[1,3,2,4],checked:orderNumber=="1324"},
      {title:'Excerpt → Title → Comment',object:self,selector:'setSearchOrder:',param:[2,1,3,4],checked:orderNumber=="2134"},
      {title:'Excerpt → Comment → Title',object:self,selector:'setSearchOrder:',param:[2,3,1,4],checked:orderNumber=="2314"},
      {title:'Comment → Title → Excerpt',object:self,selector:'setSearchOrder:',param:[3,1,2,4],checked:orderNumber=="3124"},
      {title:'Comment → Excerpt → Title',object:self,selector:'setSearchOrder:',param:[3,2,1,4],checked:orderNumber=="3214"},
      {title:'Markdown → Title → Excerpt → Comment ',object:self,selector:'setSearchOrder:',param:[4,1,2,3],checked:orderNumber=="4123"},
      {title:'Markdown → Title → Comment → Excerpt ',object:self,selector:'setSearchOrder:',param:[4,1,3,2],checked:orderNumber=="4132"},
      {title:'Markdown → Excerpt → Title → Comment ',object:self,selector:'setSearchOrder:',param:[4,2,1,3],checked:orderNumber=="4213"},
      {title:'Markdown → Excerpt → Comment → Title ',object:self,selector:'setSearchOrder:',param:[4,2,3,1],checked:orderNumber=="4231"},
      {title:'Markdown → Comment → Title → Excerpt ',object:self,selector:'setSearchOrder:',param:[4,3,1,2],checked:orderNumber=="4312"},
      {title:'Markdown → Comment → Excerpt → Title ',object:self,selector:'setSearchOrder:',param:[4,3,2,1],checked:orderNumber=="4321"}
    ];
    // self.popoverController = MNUtil.getPopoverAndPresent(sender,commandTable,250)
    self.popoverController = chatAIUtils.getPopoverAndPresent(sender,commandTable,400,1)
  },
  setSearchOrder:function (order) {
    self.checkPopover()
    chatAIConfig.config.searchOrder = order
    self.orderButton.setTitleForState(chatAIConfig.getOrderText(),0)
    chatAIConfig.save("MNChatglm_config")
  },
  changeSyncSource: function (sender) {
    let self = getChatglmController()
    let syncSource = chatAIConfig.getConfig("syncSource")
    let selector = 'setSyncSource:'
    var commandTable = [
        self.tableItem('❌  None', selector, 'None',syncSource =='None'),
        self.tableItem('☁️  iCloud', selector, 'iCloud',syncSource =='iCloud'),
        self.tableItem('☁️  MNNote', selector, 'MNNote',syncSource =='MNNote'),
        self.tableItem('☁️  Cloudflare R2', selector, 'CFR2',syncSource =='CFR2'),
        self.tableItem('☁️  InfiniCloud', selector, 'Infi',syncSource =='Infi'),
        self.tableItem('☁️  Webdav', selector, 'Webdav',syncSource =='Webdav')
    ]
    self.popover(sender, commandTable,200,1)
  },
  setSyncSource: async function (source) {
    let self = getChatglmController()
    self.checkPopover()
    let currentSource = chatAIConfig.getConfig("syncSource")
    if (currentSource === source) {
      return
    }
    chatAIConfig.setSyncStatus(false)
    // self.configNoteIdInput.hidden = (source === "iCloud")
    // self.focusConfigNoteButton.hidden = (source === "iCloud")
    // self.clearConfigNoteButton.hidden = (source === "iCloud")
    // self.pasteConfigNoteButton.hidden = (source === "iCloud")
    let file
    switch (source) {
      case "iCloud":
        // MNButton.setTitle(self.exportConfigButton, "Export to iCloud")
        // MNButton.setTitle(self.importConfigButton, "Import from iCloud")
        self.configNoteIdInput.text = file
        // self.focusConfigNoteButton.hidden = true
        break;
      case "CFR2":
        file = chatAIConfig.getConfig("r2file") ?? ""
        // MNButton.setTitle(self.exportConfigButton, "Export to R2")
        // MNButton.setTitle(self.importConfigButton, "Import from R2")
        MNButton.setTitle(self.focusConfigNoteButton, "Copy")
        self.configNoteIdInput.text = file
        // self.focusConfigNoteButton.hidden = true
        break;
      case "Infi":
        file = chatAIConfig.getConfig("InfiFile") ?? ""
        // MNButton.setTitle(self.exportConfigButton, "Export to Infini")
        // MNButton.setTitle(self.importConfigButton, "Import from Infini")
        MNButton.setTitle(self.focusConfigNoteButton, "Copy")
        self.configNoteIdInput.text = file
        // self.focusConfigNoteButton.hidden = true
        break;
      case "Webdav":
        file = chatAIConfig.getConfig("webdavFile") ?? ""
        // MNButton.setTitle(self.exportConfigButton, "Export to Webdav")
        // MNButton.setTitle(self.importConfigButton, "Import from Webdav")
        MNButton.setTitle(self.focusConfigNoteButton, "Copy")
        self.configNoteIdInput.text = file
        // self.focusConfigNoteButton.hidden = true
        break;
      case "MNNote":
        self.configNoteIdInput.text = chatAIConfig.getConfig("syncNoteId")
        self.focusConfigNoteButton.hidden = false
        // MNButton.setTitle(self.exportConfigButton, "Export to Note")
        // MNButton.setTitle(self.importConfigButton, "Import from Note")
        MNButton.setTitle(self.focusConfigNoteButton, "Focus")
        break;
      default:
        break;
    }
    chatAIConfig.config.syncSource = source
    MNButton.setTitle(self.syncSourceButton, "Sync Config: "+chatAIConfig.getSyncSourceString(),undefined,true)
    chatAIConfig.save("MNChatglm_config",true)
    self.refreshView("syncView")
  },
  changeSource: function(sender) {
    let self = getChatglmController()
    // if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
    let source = chatAIConfig.config.source
    let selector = 'setSource:'
    let menu = new Menu(sender,self)
    menu.width = 200
    menu.preferredPosition = 1
    menu.addMenuItem("💡  Built-in", selector,'Built-in',source =='Built-in')
    if (chatAIUtils.isActivated()) {
      menu.addMenuItem("💲  Subscription", selector,'Subscription',source =='Subscription')
    }
    menu.addMenuItem("💡  ChatGPT", selector,'ChatGPT',source =='ChatGPT')
    menu.addMenuItem("💡  ChatGLM", selector,'ChatGLM',source =='ChatGLM')
    menu.addMenuItem("🎶  Minimax", selector,'Minimax',source =='Minimax')
    menu.addMenuItem("🐳  Deepseek", selector,'Deepseek',source =='Deepseek')
    menu.addMenuItem("💡  SiliconFlow", selector,'SiliconFlow',source =='SiliconFlow')
    menu.addMenuItem("💡  KimiChat", selector,'KimiChat',source =='KimiChat')
    menu.addMenuItem("💡  PPIO", selector,'PPIO',source =='PPIO')
    menu.addMenuItem("🐙  Github", selector,'Github',source =='Github')
    menu.addMenuItem("💡  Qwen", selector,'Qwen',source =='Qwen')
    menu.addMenuItem("🌋  Volcengine", selector,'Volcengine',source =='Volcengine')
    menu.addMenuItem("✴️  Claude", selector,'Claude',source =='Claude')
    menu.addMenuItem("✨  Gemini", selector,'Gemini',source =='Gemini')
    menu.addMenuItem("🔍  Metaso", selector,'Metaso',source =='Metaso')
    menu.addMenuItem("🎨  Custom", selector,'Custom',source =='Custom')
    menu.show()
  },
  setSource: function(param) {
  let self = getChatglmController()
  try {
    Menu.dismissCurrentMenu()
    if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
    let source = chatAIConfig.config.source
    if (param === source) {
      return
    }
    // let viewFrame = self.view.bounds
    // let width = viewFrame.width
    chatAIConfig.config.source = param
    // self.sourceButton.setTitleForState("Source: "+chatAIConfig.config.source,0)
    // self.setModel(chatAIConfig.config.source)
    // self.setModelButton(chatAIConfig.config.source)
    chatAIConfig.setDefaultModel(param,undefined,false)
    let syncDynamicModel = chatAIConfig.getConfig("syncDynamicModel")
    if (syncDynamicModel) {
      chatAIConfig.setDynamicModel(chatAIConfig.config.source)
    }else{
      chatAIConfig.save("MNChatglm_config")
    }
    // let allSources = chatAIConfig.allSource(true)
    // let sourceIndex = allSources.indexOf(param)
    // for (let i = 0; i < allSources.length; i++) {
    //   let buttonName = "scrollSourceButton"+i
    //   if (i === sourceIndex) {
    //     MNButton.setConfig(self[buttonName], {color:"#2c70de"})
    //   }else{
    //     MNButton.setConfig(self[buttonName], {color:"#9bb2d6"})
    //   }
    //   self[buttonName].titleLabel.font = UIFont.boldSystemFontOfSize(17)
    // }
  } catch (error) {
    chatAIUtils.addErrorLog(error, "setSource")
  }
  },
  setSourceByButton: function (button) {
    let allSources = chatAIConfig.allSource(true)
    let sourceIndex = button.sourceIndex
    let buttonSource = allSources[sourceIndex]
    // MNUtil.copy(buttonSource)
    let self = getChatglmController()
    try {
      let source = chatAIConfig.config.source
      if (buttonSource === source) {
        return
      }
      // let viewFrame = self.view.bounds
      // let width = viewFrame.width
      chatAIConfig.config.source = buttonSource
      chatAIConfig.setDefaultModel(buttonSource,undefined,false)
      let syncDynamicModel = chatAIConfig.getConfig("syncDynamicModel")
      if (syncDynamicModel) {
        chatAIConfig.setDynamicModel(chatAIConfig.config.source,undefined,false)
      }
      chatAIConfig.save("MNChatglm_config")

      // MNUtil.showHUD("Source changed to: "+chatAIConfig.config.source)
      // self.sourceButton.setTitleForState("Source: "+chatAIConfig.config.source,0)
      // self.setModel(chatAIConfig.config.source)
      // self.setModelButton(chatAIConfig.config.source)
      // for (let i = 0; i < allSources.length; i++) {
      //   let buttonName = "scrollSourceButton"+i
      //   if (i === sourceIndex) {
      //     MNButton.setConfig(self[buttonName], {color:"#2c70de"})
      //   }else{
      //     MNButton.setConfig(self[buttonName], {color:"#9bb2d6"})
      //   }
      //   self[buttonName].titleLabel.font = UIFont.boldSystemFontOfSize(17)
      // }
      // chatAIConfig.save("MNChatglm_config")
    } catch (error) {
      chatAIUtils.addErrorLog(error, "setSourceByButton")
    }
  },
  changeModel: function(button) {
    let self = getChatglmController()
  try {
    let width = []
    let menu = new Menu(button,self)
    menu.width = 200
    menu.rowHeight = 35
    menu.preferredPosition = 2
    
    let source = chatAIConfig.config.source
    let selector = 'setModel:'
    let modelNames = chatAIConfig.modelNames(source)
    let modelName = chatAIConfig.getDefaultModel(source)
    switch (source) {
      case "ChatGPT":
        menu.preferredPosition = 4 
        break;
      case "Subscription":
        menu.preferredPosition = 1
        break
      default:
        break;
    }
    modelNames.map((model)=>{
      menu.addMenuItem("🤖  "+model, selector,model,modelName == model)
      width.push(chatAIUtils.strCode("🤖  "+model))
    })
    if (source === "Subscription") {
      menu.addMenuItem("➕  More Models", "showMoreModels:")
    }
    menu.width = Math.max(...width)*9+40
    // MNUtil.showHUD(menu.width)
    menu.show()
  } catch (error) {
    chatAIUtils.addErrorLog(error, "changeModel")
  }
  },
  setModel: function (model) {
    let self = getChatglmController()
    Menu.dismissCurrentMenu()
    chatAIConfig.setDefaultModel(chatAIConfig.config.source,model,false)
    let syncDynamicModel = chatAIConfig.getConfig("syncDynamicModel")
    if (syncDynamicModel) {
      chatAIConfig.setDynamicModel(chatAIConfig.config.source, model)
    }else{
      chatAIConfig.save("MNChatglm_config")
    }
    // self.setModelButton(chatAIConfig.config.source)
    // chatAIConfig.save("MNChatglm_config")
  },
  saveCustomModels: function (params) {
    chatAIConfig.config.customModel = self.customModelInput.text
    chatAIConfig.save("MNChatglm_config")
    self.showHUD("Save model")
  },
  showMoreModels: function (params) {
    let self = getChatglmController()
    Menu.dismissCurrentMenu()
    let url = subscriptionConfig.URL+"/pricing"

    // if (typeof browserUtils !== "undefined") {
    //   MNUtil.postNotification("openInBrowser", {url:url})
    // }else{
      MNUtil.openURL(url)
    // }
  },
  showNotification: async function (params) {
    if (chatAIUtils.notifyController.view.hidden) {
      chatAIUtils.notifyController.beginNotification("test")
    }
  },
  saveCustomButtonConfig: async function (params) {
    try {
      if (!chatAIUtils.checkSubscribe(false)) {
        return
      }
    let content = await self.getWebviewContent()
    let customButton = JSON.parse(content)
    chatAIConfig.config.customButton = customButton
    chatAIConfig.save("MNChatglm_config")
    self.showHUD("Save Custom Buttons")
    self.refreshCustomButton()

    } catch (error) {
      chatAIUtils.addErrorLog(error, "saveCustomButtonConfig")
    }
  },
  resetCustomButtonConfig: async function (params) {
    let self = getChatglmController()
    let confirm = await MNUtil.confirm("Reset Custom Buttons","是否重置自定义按钮配置？")
    if (!confirm) {
      return
    }
    let defaultConfig = {
      "button1":{
        "click":"bigbang",
        "longPress":"none"
      },
      "button2":{
        "click":"addComment",
        "longPress":"addBlankComment"
      },
      "button3":{
        "click":"setTitle",
        "longPress":"none"
      },
      "button4":{
        "click":"copy",
        "longPress":"none"
      },
      "button5":{
        "click":"setExcerpt",
        "longPress":"appendExcerpt"
      },
      "button6":{
        "click":"addChildNote",
        "longPress":"markdown2Mindmap"
      }
    }
    chatAIConfig.config.customButton = defaultConfig
    self.setWebviewContent(defaultConfig)
    chatAIConfig.save("MNChatglm_config")
    MNUtil.showHUD("Reset Custom Buttons")
    self.refreshCustomButton()
  },
  changeFunc: function (button) {
    let self = getChatglmController()
    try {
      let currentFunc
      let selector
      if (self.contextButton.currentTitle === "Text") {
        // MNUtil.showHUD("dynamicFunc")
        currentFunc = chatAIConfig.getConfig("dynamicFunc")
        selector = 'setDynamicFunc:'
      }else{
        currentFunc = chatAIConfig.currentFunc
        selector = 'setFunc:'
      }
    let newOrder = chatAITool.activatedToolsExceptOld
    let isAllTools = newOrder.every(toolIndex=>currentFunc.includes(toolIndex))
    let menu = new Menu(button,self)
    menu.width = 250
    menu.rowHeight = 35
    menu.preferredPosition = 0
    menu.addMenuItem("🌟   All Tools",        selector,100,isAllTools)
    let toolNames = chatAITool.toolNames
    newOrder.map((toolIndex)=>{
      let toolName = toolNames[toolIndex]
      let tool = chatAITool.getToolByName(toolName)
      menu.addMenuItem(tool.toolTitle,        selector,toolIndex,currentFunc.includes(toolIndex))
    })
    menu.addMenuItem("🗿   Old Tools (Free)", "showOldTools:",button)
    menu.addMenuItem("❌   None",             selector,-1,currentFunc.length === 0)
    menu.show()
    } catch (error) {
      chatAIUtils.addErrorLog(error, "changeFunc")
    }
  },
  showOldTools: function(button){
    let self = getChatglmController()
    Menu.dismissCurrentMenu()
    try {
    let currentFunc
    let selector
    if (self.contextButton.currentTitle === "Text") {
      // MNUtil.showHUD("dynamicFunc")
      currentFunc = chatAIConfig.getConfig("dynamicFunc")
      selector = 'setDynamicFunc:'
    }else{
      currentFunc = chatAIConfig.currentFunc
      selector = 'setFunc:'
    }
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
  setFunc(index) {
try {
    Menu.dismissCurrentMenu()
    if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
    let currentFunc = chatAITool.getChangedTools(chatAIConfig.currentFunc, index)
    // chatAIUtils.copyJSON(currentFunc)
    chatAIConfig.currentFunc = currentFunc
    chatAIConfig.prompts[chatAIConfig.currentPrompt].func = currentFunc
    chatAIConfig.save("MNChatglm_prompts")
} catch (error) {
  MNUtil.showHUD(error)
}
  },
  setDynamicFunc(index) {
    Menu.dismissCurrentMenu()
    if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
try {
    let currentFunc = chatAIConfig.config.dynamicFunc ?? []
    let targetFunc = chatAITool.getChangedTools(currentFunc, index)
    chatAIConfig.config.dynamicFunc = targetFunc
    chatAIConfig.save("MNChatglm_config")
} catch (error) {
  chatAIUtils.addErrorLog(error, "setDynamicFunc")
}

  },
  changePromptModel:function (button) {
    let self = getChatglmController()
    // if (!chatAIUtils.checkSubscribe(false)) {
    //   return
    // }
    try {
    let selector = 'setPromptModel:'
    let modelName = chatAIConfig.currentModel
    // MNUtil.copy(modelName)
    // MNUtil.showHUD(self.contextButton.currentTitle)
    if (self.contextButton.currentTitle === "Text") {
      modelName = chatAIConfig.getConfig("dynamicModel")
      selector = 'setDynamicModel:'
      let syncDynamicModel = chatAIConfig.getConfig("syncDynamicModel")
      //开启DynamicModel同步下,不允许在此切换
      self.showHUD("Not available")
      if (syncDynamicModel) {
        return
      }
    }
    let allModels = chatAIConfig.allSource(false,true)
    let menu = new Menu(button,self)
    menu.width = 220
    menu.rowHeight = 35
    menu.preferredPosition = 0

    menu.addMenuItem("Default", selector,"Default",modelName === "Default")
    menu.addMenuItem("Built-in", selector,"Built-in",modelName === "Built-in")
    // var commandTable = [
    //   self.tableItem("Default", selector,"Default",modelName === "Default"),
    //   self.tableItem("Built-in", selector,"Built-in",modelName === "Built-in")
    // ]
    let secondeSelector = 'changePromptModelFromSource:'
    allModels.map((m,index)=>{
      if (chatAIConfig.hasAPIKeyInSource(m)) {
        if (modelName.startsWith(m)) {
          menu.addMenuItem("👉  "+m, secondeSelector,{source:m,button:button,index:index},true)
          // commandTable.push(self.tableItem("👉  "+m,secondeSelector,{source:m,button:button,index:index},true))
        }else{
          menu.addMenuItem("➡️  "+m,secondeSelector,{source:m,button:button,index:index},false)
          // commandTable.push(self.tableItem("➡️  "+m,secondeSelector,{source:m,button:button,index:index},false))
        }
      }
    })
    menu.show()
    // self.popover(button, commandTable,220,0)
    } catch (error) {
      chatAIUtils.addErrorLog(error, "chatglmController.changePromptModel")
    }
  },
  changePromptModelFromSource: function (params) {
  try {
    let self = getChatglmController()
    Menu.dismissCurrentMenu()
    self.checkPopover()
    if (!chatAIUtils.checkSubscribe(false)) {
      return
    }
    let source = params.source
    let button = params.button
    let selectIndex = params.index
    // MNUtil.showHUD("message"+selectIndex)
    let selector = 'setPromptModel:'
    let modelName = chatAIConfig.currentModel
    if (self.contextButton.currentTitle === "Text") {
      modelName = chatAIConfig.getConfig("dynamicModel")
      selector = 'setDynamicModel:'
    }
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
    self.popover(button, commandTable,Math.max(...widths)*9+30,0)
    
  } catch (error) {
    chatAIUtils.addErrorLog(error, "changePromptModelFromSource")
  }
  },
  setPromptModel: function (model) {
    self.checkPopover()
    Menu.dismissCurrentMenu()
    // let config = model.split(":")
    let currentModel = chatAIConfig.currentModel
    if (currentModel === model) {
      MNUtil.showHUD("No Change")
      return
    }
    if (model !== "Default" && !chatAIUtils.checkSubscribe()) {
      return
    }
    let promptName = chatAIConfig.prompts[chatAIConfig.currentPrompt].title
    chatAIConfig.prompts[chatAIConfig.currentPrompt].model = model
    chatAIConfig.setCurrentPrompt(chatAIConfig.currentPrompt)
    chatAIConfig.save("MNChatglm_prompts")
    MNUtil.showHUD("Set model for "+promptName+": ["+model+"]")
  },
  setDynamicModel: function (model) {
    Menu.dismissCurrentMenu()
    if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
    chatAIConfig.config.dynamicModel = model
    chatAIConfig.save("MNChatglm_config")
    MNUtil.showHUD("Set model for Dynamic: ["+model+"]")
  },
  changeActions: function (button) {
    let self = getChatglmController()
    // if (!chatAIUtils.checkSubscribe(false)) {
    //   return
    // }
    let currentAction
    let selector
    if (self.contextButton.currentTitle === "Text") {
      // MNUtil.showHUD("dynamicFunc")
      currentAction = chatAIConfig.getConfig("dynamicAction")
      selector = 'setDynamicAction:'
    }else{
      currentAction = chatAIConfig.currentAction ?? []
      selector = 'setAction:'
    }
    let menu = new Menu(button,self)
    menu.preferredPosition = 0
    menu.addMenuItem("🆓 Set Title", selector,0,currentAction.includes(0))
    menu.addMenuItem("🆓 Append Comment", selector,1,currentAction.includes(1))
    menu.addMenuItem("🆓 Append Blank Comment", selector,12,currentAction.includes(12))
    menu.addMenuItem("🆓 Append Title", selector,13,currentAction.includes(13))
    menu.addMenuItem("🆓 Append Tag", selector,6,currentAction.includes(6))
    menu.addMenuItem("🆓 Append Excerpt", selector,14,currentAction.includes(14))
    menu.addMenuItem("🆓 Replace Excerpt", selector,9,currentAction.includes(9))
    menu.addMenuItem("🆓 Clear Excerpt", selector,8,currentAction.includes(8))
    menu.addMenuItem("🆓 Create Mindmap", selector,16,currentAction.includes(16))
    menu.addMenuItem("🆓 Create Child Note", selector,7,currentAction.includes(7))
    menu.addMenuItem("🆓 Create Brother Note", selector,11,currentAction.includes(11))
    menu.addMenuItem("🆓 Copy Markdown Link", selector,2,currentAction.includes(2))
    menu.addMenuItem("🆓 Copy Card URL", selector,3,currentAction.includes(3))
    menu.addMenuItem("🆓 Copy Text", selector,4,currentAction.includes(4))
    menu.addMenuItem("🆓 Snipaste HTML", selector,10,currentAction.includes(10))
    menu.addMenuItem("🆓 Snipaste Text", selector,15,currentAction.includes(15))
    menu.addMenuItem("🆓 Close", selector,5,currentAction.includes(5))
    menu.addMenuItem("❌ None", selector,-1,currentAction.length === 0)
    menu.addMenuItem("➡️ Toolbar actions:", "chooseToolbarActions:",button)

    menu.width = 250
    menu.show()
  },
  setAction(param) {
    Menu.dismissCurrentMenu()
try {
    let currentAction = chatAIConfig.currentAction
    switch (param) {
      case -1:
        currentAction = []
        break;
      case 100:
        currentAction = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]//增加函数后要在这里加一条，不然显示不出来
        break
      default:
        if (currentAction.includes(param)) {
          currentAction = currentAction.filter(func=> func!==param)
        }else{
          currentAction.push(param)
        }
        currentAction.sort(function(a, b) {
          return a - b;
        });
        break;
    }
    self.showHUD("Save actions")
    // chatAIUtils.copyJSON(currentAction)
    chatAIConfig.currentAction = currentAction
    chatAIConfig.prompts[chatAIConfig.currentPrompt].action = currentAction
    chatAIConfig.save("MNChatglm_prompts")
} catch (error) {
  chatAIUtils.addErrorLog(error, "chatglmController.setAction")
}
  },
  setDynamicAction(param) {
    Menu.dismissCurrentMenu()
try {
    let currentAction = chatAIConfig.config.dynamicAction ? chatAIConfig.config.dynamicAction : []
    switch (param) {
      case -1://None
        currentAction = []
        break;
      case 100://All
        currentAction = [0,1,2,3,4,5,6,7,8,9]//增加函数后要在这里加一条，不然显示不出来
        break
      default:
        if (currentAction.includes(param)) {
          //已经选中了则去除选中状态
          currentAction = currentAction.filter(func=> func!==param)
        }else{
          //未选中则增加
          currentAction.push(param)
        }
        //排序
        currentAction.sort(function(a, b) {
          return a - b;
        });
        break;
    }
    chatAIConfig.config.dynamicAction = currentAction
    chatAIConfig.save("MNChatglm_config")
} catch (error) {
  chatAIUtils.addErrorLog(error, "chooseAction")
}

  },
  chooseToolbarActions: function (button) {
    let self = getChatglmController()
    Menu.dismissCurrentMenu()
    let currentAction = chatAIConfig.prompts[chatAIConfig.currentPrompt].toolbarAction ?? ""
    let menu = new Menu(button,self)
    menu.preferredPosition = 0
    let actionKey = toolbarConfig.getAllActions()
    let selector = "setToolbarActions:"
    actionKey.map(key=>{
      menu.addMenuItem("🔨  "+toolbarConfig.getAction(key).name, selector,key,key == currentAction)
    })
    menu.show()
  },
  setToolbarActions: function (action) {
    Menu.dismissCurrentMenu()
    if (!chatAIUtils.checkSubscribe(true)) {
      return
    }
    let preAction = chatAIConfig.prompts[chatAIConfig.currentPrompt].toolbarAction??""
    let actionName = toolbarConfig.getAction(action).name
    let promptName = chatAIConfig.prompts[chatAIConfig.currentPrompt].title
    if (preAction === action) {
      action = ""
      MNUtil.showHUD("Cancel action for "+promptName+": ["+actionName+"]")
    }else{
      MNUtil.showHUD("Set action for "+promptName+": ["+actionName+"]")
    }
    chatAIConfig.prompts[chatAIConfig.currentPrompt].toolbarAction = action
    chatAIConfig.setCurrentPrompt(chatAIConfig.currentPrompt)
    chatAIConfig.save("MNChatglm_prompts")
  },
  changeOpacityTo:function (opacity) {
    self.view.layer.opacity = opacity
  },
  openSettingView:function () {
    let self = getChatglmController()
    if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
    // self.chatglmController.view.hidden = false
    if (!self.settingView) {
      self.createSettingView()
    }else{
    }
    self.settingViewLayout()
    
    try {
      self.setButtonText(chatAIConfig.promptNames,chatAIConfig.currentPrompt)
      self.setTextview(chatAIConfig.currentPrompt)
      self.settingView.hidden = false
    } catch (error) {
      showHUD(error)
      
    }

    // self.view.addSubview(self.tabView)
  },
  resetConfig: async function (button) {
  try {
    let confirm = await MNUtil.confirm("MN ChatAI\nReset All Prompts?", "重置所有prompt？")
    if (confirm) {
      let self = getChatglmController()
      chatAIConfig.reset()
      self.setButtonText(chatAIConfig.config.promptNames,chatAIConfig.currentPrompt)
      self.setTextview(chatAIConfig.currentPrompt)
      if (chatAIConfig.config.dynamic) {
        self.dynamicButton.backgroundColor = MNUtil.hexColorAlpha("#fd3700",0.8)
        self.dynamicButton.setTitleForState("Dynamic ✅",0)
      }else{
        self.dynamicButton.setTitleForState("Dynamic ❌",0)
        self.dynamicButton.backgroundColor = MNUtil.hexColorAlpha("#ff9375",0.8)
      }
    }
  } catch (error) {
    chatAIUtils.addErrorLog(error, "resetConfig")
  }
  },

  toggleWindowLocation: function () {
    if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
    switch (chatAIConfig.config.notifyLoc) {
      case 1:
        chatAIConfig.config.notifyLoc = 0
        self.windowLocationButton.setTitleForState("Notification: Left",0)
        // chatAIUtils.notifyController.locationButton.setTitleForState("Left",0)
        break;
      case 0:
        chatAIConfig.config.notifyLoc = 1
        self.windowLocationButton.setTitleForState("Notification: Right",0)
        // chatAIUtils.notifyController.locationButton.setTitleForState("Right",0)
        break;
      default:
        break;
    }
    // chatAIUtils.notifyController.config = chatAIConfig.config
    chatAIConfig.save("MNChatglm_config")
  },
  toggleAutoTheme: function(){
    chatAIConfig.config.autoTheme = !chatAIConfig.getConfig("autoTheme")
    MNButton.setTitle(self.autoThemeButton, "Auto Theme: "+(chatAIConfig.getConfig("autoTheme")?"✅":"❌"))
    chatAIConfig.save("MNChatglm_config")
    if (chatAIConfig.config.autoTheme) {
      chatAIUtils.notifyController.checkTheme(true)
    }
  },
  toggleAutoImage: function (params) {
    if (!chatAIUtils.checkSubscribe()) {
      return
    }
    Menu.dismissCurrentMenu()
    let autoImage = chatAIConfig.getConfig("autoImage")
    chatAIConfig.config.autoImage = !autoImage
    self.showHUD("Auto Vision: "+(chatAIConfig.config.autoImage?"✅":"❌"))
    chatAIConfig.save("MNChatglm_config")
  },
  toggleAutoOCR: function (params) {
    if (!chatAIUtils.checkSubscribe()) {
      return
    }
    Menu.dismissCurrentMenu()
    let autoOCR = chatAIConfig.getConfig("autoOCR")
    chatAIConfig.config.autoOCR = !autoOCR
    self.showHUD("Auto OCR: "+(chatAIConfig.config.autoOCR?"✅":"❌"))
    chatAIConfig.save("MNChatglm_config")
  },
  toggleAllowEdit: function (params) {
    if (!chatAIUtils.checkSubscribe()) {
      return
    }
    chatAIConfig.config.allowEdit = !chatAIConfig.getConfig("allowEdit")
    MNButton.setTitle(self.allowEditButton, "Allow Edit: "+(chatAIConfig.getConfig("allowEdit")?"✅":"❌"))
    chatAIConfig.save("MNChatglm_config")
  },
  choosePDFExtractMode: function (button) {
    let menu = new Menu(button,self)
    let mode = chatAIConfig.getConfig("PDFExtractMode")
    menu.addMenuItem("PDF.js", "setPDFExtractMode:","local",mode==="local")
    menu.addMenuItem("Moonshot", "setPDFExtractMode:","moonshot",mode==="moonshot")
    menu.width = 200
    menu.show()
  },
  setPDFExtractMode: function (mode) {
    let self = getChatglmController()
    Menu.dismissCurrentMenu()
    chatAIConfig.config.PDFExtractMode = mode
    switch (mode) {
      case "local":
        MNButton.setTitle(self.pdfExtractModeButton, "PDF Extract Mode: PDF.js")
        break;
      case "moonshot":
        MNButton.setTitle(self.pdfExtractModeButton, "PDF Extract Mode: Moonshot")
        break;
      default:
        break;
    }
    chatAIConfig.save("MNChatglm_config")
  },
  closeButtonTapped: function() {
    if (chatAIUtils.addonBar) {
      self.hide(chatAIUtils.addonBar.frame)
    }else{
      self.hide()
    }
    self.searchedText = ""
  },
  onMoveGesture:function (gesture) {
    if (gesture.state === 1) {
      self.originalLocationToMN = gesture.locationInView(MNUtil.studyView)
      self.originalFrame = self.view.frame
    }
    if (gesture.state === 2) {
      let locationToMN = gesture.locationInView(MNUtil.studyView)
      // let translation = gesture.translationInView(MNUtil.studyView)
      let locationDiff = {x:locationToMN.x - self.originalLocationToMN.x,y:locationToMN.y - self.originalLocationToMN.y}
      let frame = self.view.frame
      frame.x = self.originalFrame.x + locationDiff.x
      frame.y = self.originalFrame.y + locationDiff.y
      self.setFrame(frame)
    }
    // let location = chatAIUtils.getNewLoc(gesture)
    // let frame = self.view.frame
    // self.view.frame = MNUtil.genFrame(location.x,location.y,frame.width,frame.height)
    // self.currentFrame  = self.view.frame
    // self.custom = false;
    if (gesture.state === 3) {
      MNUtil.studyView.bringSubviewToFront(self.view)
    }
  },
  onResizeGesture:function (gesture) {
  try {
    let baseframe = gesture.view.frame
    // let locationToBrowser = gesture.locationInView(self.view)
    // let locationToButton = gesture.locationInView(gesture.view)
    let frame = self.view.frame
    let translation = chatAIUtils.getTranslation(gesture)
    let width = translation.x-frame.x+baseframe.width
    let height = translation.y-frame.y+baseframe.height+15
    if (width <= 330) {
      width = 330
    }
    if (height <= 465) {
      height = 465
    }

    // if (translation) {
    //   MNUtil.showHUD(JSON.stringify(translation))
      // let newFrame = {x:frame.x,y:frame.y,width:frame.width+translation.x,height:frame.height+translation.y}
      // self.view.frame = newFrame
      self.view.frame = {x:frame.x,y:frame.y,width:width,height:height}
      self.currentFrame  = self.view.frame
    // }
    if (gesture.state === 3) {
      MNUtil.studyView.bringSubviewToFront(self.view)
    }
  } catch (error) {
    chatAIUtils.addErrorLog(error, "onResizeGesture")
  }
  },
  onResizeGesture0:function (gesture) {
    self.custom = false;
    self.customMode = "none"
    let baseframe = gesture.view.frame
    let locationToBrowser = gesture.locationInView(self.view)
    let frame = self.view.frame
    let width = locationToBrowser.x+baseframe.width*0.5
    let height = self.view.frame.height
    if (width <= 330) {
      width = 330
    }
    //  self.view.frame = {x:frame.x,y:frame.y,width:frame.width+translationX,height:frame.height+translationY}
    self.view.frame = {x:frame.x,y:frame.y,width:width,height:height}
    self.currentFrame  = self.view.frame
    if (gesture.state === 3) {
      MNUtil.studyView.bringSubviewToFront(self.view)
    }
  },
  modelTabTapped: function (button) {
    if (button.isSelected) {
      let menu = new Menu(button,self)
      menu.width = 250
      menu.rowHeight = 35
      menu.preferredPosition = 1
      // menu.fontSize = 28
      // menu.menuItems = [
      // ]
      menu.addMenuItem('🔄  Refresh Model Config', 'refreshModel:')
      let syncDynamicModel = chatAIConfig.getConfig("syncDynamicModel")
      menu.addMenuItem((syncDynamicModel?'✅':'❌')+'  Sync Dynamic & Default', 'toggleSyncModel:')
      let imageCompression = chatAIConfig.getConfig("imageCompression")
      menu.addMenuItem((imageCompression?'✅':'❌')+'  Image compression', 'toggleImageCompressionButton:')
      menu.show()
    }else{
      self.switchView("modelView")
      if (chatAIConfig.config.source === "Built-in") {
        if (chatAIUtils.checkSubscribe(false,false,true)) {
          self.usageButton.setTitleForState("Unlimited",0)
        }else{
          let usage  = chatAIConfig.usage
          self.usageButton.setTitleForState("Usage: "+usage.usage+"/100",0)
        }
      }
    }
  },

  toggleSyncModel:function (params) {
    let self = getChatglmController()
    Menu.dismissCurrentMenu()
    chatAIConfig.config.syncDynamicModel = !chatAIConfig.getConfig("syncDynamicModel")
    self.showHUD((chatAIConfig.getConfig("syncDynamicModel")?'✅':'❌')+'  Sync Dynamic & Default')
    chatAIConfig.save("MNChatglm_config")
  },
  refreshModel: async function (param) {
    Menu.dismissCurrentMenu()
    self.waitHUD("Refresh Model...")
    let res = await chatAINetwork.fetchKeys()
    if (res && "modelConfig" in res) {
      // MNUtil.copy(res)
      self.waitHUD("✅ Refresh Success!")
      MNUtil.stopHUD(1)
    }
  },
  customButtonTabTapped: function (button) {
      self.switchView("customButtonView")
  let text  = chatAIConfig.getConfig("customButton")
  
  self.setWebviewContent(text)
      // self.customButtonView.hidden = false
  },
  triggerButtonTapped: function (button) {
    if (button.isSelected) {
      let text = "Ignore short text: "+(chatAIConfig.config.ignoreShortText?"✅":"🚫")
      let delay = "Delay: "+chatAIConfig.config.delay+"s"
      let menu = new Menu(button,self)
      menu.width = 200
      menu.rowHeight = 35
      menu.preferredPosition = 1
      menu.addMenuItem(text, "toggleIgnoreShortText:")
      menu.addMenuItem(delay, "changeDelay:",button)
      menu.show()
    }else{
      self.switchView("autoActionView")
    }
  },
  advancedButtonTapped: function (params) {
    self.switchView("advanceView")

  },
  syncConfigTapped: function (params) {
    if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
    self.switchView("syncView")
  },
  configButtonTapped: function (params) {
    self.switchView("configView")
  },
  configSystemTapped: function (button) {
    if (self.contextInput.hidden) {
      self.checkPopover()
      if (self.titleInput.editable) {
        var commandTable = [
          self.tableItem("▶️   Test", 'promptAction:', "testSystem"),
          self.tableItem("🗑️   Clear", 'promptAction:', "clearSystem"),
          self.tableItem("📋   Copy", 'promptAction:', "copySystem"),
          self.tableItem("📋   Paste", 'promptAction:', "pasteSystem"),
        ]
        self.popover(button, commandTable,120,0)
        return
      }else{
        var commandTable = [
          self.tableItem("🗑️   Clear", 'promptAction:', "clearSystem"),
          self.tableItem("📋   Copy", 'promptAction:', "copySystem"),
          self.tableItem("📋   Paste", 'promptAction:', "pasteSystem"),
        ]
        self.popover(button, commandTable,120,0)
        return
      }
    }
    self.SystemButton.backgroundColor = MNUtil.hexColorAlpha("#457bd3",0.8)
    self.contextButton.backgroundColor = MNUtil.hexColorAlpha("#9bb2d6",0.8)
    self.contextInput.hidden = true
    self.systemInput.hidden = false
  },
  configContextTapped: function (button) {
    if (self.systemInput.hidden) {
      self.checkPopover()
      if (self.titleInput.editable) {
        var commandTable = [
          self.tableItem("▶️   Test", 'promptAction:', "testUser"),
          self.tableItem("🗑️   Clear", 'promptAction:', "clearUser"),
          self.tableItem("📋   Copy", 'promptAction:', "copyUser"),
          self.tableItem("📋   Paste", 'promptAction:', "pasteUser")
        ]
        self.popover(button, commandTable,120,0)
        return
      }else{
        var commandTable = [
          self.tableItem("🗑️   Clear", 'promptAction:', "clearUser"),
          self.tableItem("📋   Copy", 'promptAction:', "copyUser"),
          self.tableItem("📋   Paste", 'promptAction:', "pasteUser")
        ]
        self.popover(button, commandTable,120,0)
        return
      }
    }
    self.SystemButton.backgroundColor = MNUtil.hexColorAlpha("#9bb2d6",0.8)
    self.contextButton.backgroundColor = MNUtil.hexColorAlpha("#457bd3",0.8)
    self.contextInput.hidden = false
    self.systemInput.hidden = true
  },
  promptSaveTapped: async function (button) {
    try {

    
    let self = getChatglmController()
    if (self.contextButton.currentTitle === "Text") {
      if (!chatAIUtils.checkTemplate(self.contextInput.text ?? "")) {
        return
      }
      if (!chatAIUtils.checkTemplate(self.systemInput.text ?? "")) {
        return
      }
      chatAIConfig.dynamicPrompt.text = self.contextInput.text
      chatAIConfig.dynamicPrompt.note = self.systemInput.text
      self.contextInput.endEditing(true)
      self.systemInput.endEditing(true)
      chatAIConfig.save("MNChatglm_dynamicPrompt")
      self.showHUD("Save Dynamic prompt")
      return
    }
    // return
    let clickDate = Date.now()
    if (button.clickDate && clickDate-button.clickDate<500) {
      if (MNUtil.studyMode === 3) {
        let focuseNote = chatAIUtils.getFocusNote()
        chatAIUtils.currentNoteId = focuseNote.noteId
      }
      chatAIUtils.notifyController.noteid = chatAIUtils.currentNoteId
      chatAIUtils.notifyController.text = chatAIUtils.currentSelection
      if (chatAIUtils.checkCouldAsk()) {
        self.ask()
      }
    }else{
      button.clickDate = Date.now()
      // chatAIConfig.export(false)
      // let noteId = chatAIConfig.config.syncNoteId
      // let focusNote = MNUtil.getNoteById(noteId)
      // MNUtil.copy(focusNote.noteId)
      // // let noteId0 = focusNote.noteId
      let oldConfig = chatAIConfig.prompts[chatAIConfig.currentPrompt]
      let oldJson = JSON.stringify(oldConfig)
      let config = oldConfig
      if (!chatAIUtils.checkTemplate(self.contextInput.text ?? "")) {
        return
      }
      if (!chatAIUtils.checkTemplate(self.systemInput.text ?? "")) {
        return
      }
      config.title = self.titleInput.text ?? ""
      config.context = self.contextInput.text ?? ""
      config.system = self.systemInput.text ?? ""
      self.contextInput.endEditing(true)
      self.systemInput.endEditing(true)
      if (oldJson === JSON.stringify(config)) {
        return
      }
      chatAIConfig.prompts[chatAIConfig.currentPrompt] = config
      self.setButtonText(chatAIConfig.config.promptNames,chatAIConfig.currentPrompt)
      MNUtil.delay(0.1).then(()=>{
        chatAIConfig.save("MNChatglm_prompts",false,false)
        self.showHUD("Save prompt: "+chatAIConfig.prompts[chatAIConfig.currentPrompt].title,2,self.view)
      })
    }
    } catch (error) {
      chatAIUtils.addErrorLog(error, "promptSaveTapped")
    }
  },
  onLongPressSavePrompt: function (gesture) {
    if (gesture.state === 1) {
      let self = getChatglmController()
      if (self.contextButton.currentTitle === "Text") {
        chatAIConfig.dynamicPrompt.text = self.contextInput.text
        chatAIConfig.dynamicPrompt.note = self.systemInput.text
        chatAIConfig.save("MNChatglm_dynamicPrompt")
        MNUtil.showHUD("Save Dynamic prompt")
        return
      }
      let config = chatAIConfig.prompts[chatAIConfig.currentPrompt]
      config.title = self.titleInput.text ?? ""
      config.context = self.contextInput.text ?? ""
      config.system = self.systemInput.text ?? ""
      chatAIConfig.prompts[chatAIConfig.currentPrompt] = config
      self.setButtonText(chatAIConfig.config.promptNames,chatAIConfig.currentPrompt)
      MNUtil.delay(0.1).then(()=>{
        self.contextInput.endEditing(true)
        self.systemInput.endEditing(true)
        chatAIConfig.save("MNChatglm_prompts",false,false)
      })
      if (MNUtil.studyMode === 3) {
        let focuseNote = chatAIUtils.getFocusNote()
        chatAIUtils.currentNoteId = focuseNote.noteId
      }
      chatAIUtils.notifyController.noteid = chatAIUtils.currentNoteId
      chatAIUtils.notifyController.text = chatAIUtils.currentSelection
      if (chatAIUtils.checkCouldAsk()) {
        self.ask()
      }
    }
  },
  saveKnowledgeButtonTapped: function (params) {
    try {
      chatAIConfig.knowledge = self.knowledgeInput.text
      chatAIConfig.save("MNChatglm_knowledge")
      MNUtil.showHUD("Save knowledge")
    } catch (error) {
      MNUtil.showHUD(error);
    }
  },
  changeTunnel: async function(sender) {
    let self = getChatglmController()
    let tunnels = await chatAIConfig.getTunnels()
    var commandTable = tunnels.map((tunnel,index)=>{
      return {title:tunnel,object:self,selector:'setTunnel:',param:index,checked:chatAIConfig.config.tunnel ==index}
    })
    self.popover(sender, commandTable,300,1)
    // self.popoverController = MNUtil.getPopoverAndPresent(sender,commandTable,150)
  },
  setTunnel: async function name(param) {
    if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
    let tunnels = await chatAIConfig.getTunnels()
    chatAIConfig.config.tunnel = param
    self.tunnelButton.setTitleForState(tunnels[param],0)
    chatAIConfig.save("MNChatglm_config")
  },
  refreshUsage: async function (button) {
    if (button.builtIn) {
      if (chatAIUtils.checkSubscribe(false,false,true)) {
        self.usageButton.setTitleForState("Unlimited",0)
      }else{
        let usage  = chatAIConfig.usage
        self.usageButton.setTitleForState("Usage: "+usage.usage+"/100",0)
      }
    }else{
      //只有OpenAI渠道支持显示余额
      let self = getChatglmController()
      MNUtil.showHUD("Fetching usage")
      let usage  = await chatAINetwork.getUsage()
      self.customUsage.setTitleForState(`Usage: ${(usage.usage/100.).toFixed(2)} / ${usage.total.toFixed(2)}`,0) 
    }
  },
  configAddTapped: function (button) {
    let self = getChatglmController()
    if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
    let menu = new Menu(button,self,200)
    menu.preferredPosition = 0
    let selector = 'improtAction:'
    menu.addMenuItem("➕   New Prompt",selector,"New")
    menu.addMenuItem("📋   From Clipboard",selector,"Paste")
    menu.addMenuItem("🌐   From Example",selector,"Example")
    menu.show()
    return
  },
  improtAction: async function (params) {
    let self = getChatglmController()
    Menu.dismissCurrentMenu()
    if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
    if (Object.keys(chatAIConfig.prompts).length >= 10 && !chatAIUtils.checkSubscribe()) {
      return
    }
    try {
    let config = {}
    let prompt = {}
    let unusedKey = chatAIConfig.getUnusedKey()
    // let i = 0
    // while (chatAIConfig.prompts["customEngine"+i]) {
    //   i = i+1
    // }
    switch (params) {
      case "New":
        let userInput = await MNUtil.input("🤖 MN ChatAI", "New prompt Name\n\n请输入新的prompt名称",["Cancel","Confirm"],{default:"new prompt"})
        if (userInput.button === 0) {
          MNUtil.showHUD("Cancel")
          return
        }
        config = {title:userInput.input,context:"input your prompt",system:""}
        self.importNewPrompt(config, unusedKey)
        return;
      case "Example":
        if (typeof browserUtils !== "undefined") {
          MNUtil.postNotification("openInBrowser", {url:"https://mnaddon.craft.me/chatai/promptExample"})
        }else{
          MNUtil.openURL("https://mnaddon.craft.me/chatai/promptExample")
        }
        return;
      case "Paste":
        let clipboardText = MNUtil.clipboardText
        if (clipboardText && MNUtil.isValidJSON(clipboardText)) {
          prompt = JSON.parse(clipboardText)
          let promptText= JSON.stringify(prompt,null,2).slice(0,1000)
          if (prompt.title) {
            let confirm = await MNUtil.confirm("MN ChatAI\nImport prompt ["+prompt.title+"]?", "是否导入 prompt ["+prompt.title+"]？\n"+promptText)
            if (!confirm) {
              self.showHUD("Cancel import")
              return
            }
          }else{
            return
          }
          self.importNewPrompt(prompt, unusedKey)
          return;
        }else{
          self.showHUD("Invalid clipboard text")
          return
        }
      default:
        break;
    }
    // let prompts = chatAIConfig.prompts
    // prompts["customEngine"+i] = config
    // chatAIConfig.prompts = prompts
    // chatAIConfig.config.promptNames = chatAIConfig.config.promptNames.concat(("customEngine"+i))
    // self.setButtonText(chatAIConfig.config.promptNames,"customEngine"+i)
    // chatAIConfig.setCurrentPrompt("customEngine"+i)
    // self.refreshLayout()
    // chatAIConfig.save("MNChatglm_prompts")
    // if (config.vision) {
    //   self.visionButton.backgroundColor = MNUtil.hexColorAlpha("#e06c75",0.8)
    // }else{
    //   self.visionButton.backgroundColor = MNUtil.hexColorAlpha("#c0bfbf",0.8)
    // }
    // self.scrollview.setContentOffsetAnimated({x:0,y:self.scrollview.contentSize.height-self.scrollview.frame.height}, true)

      
    } catch (error) {
      chatAIUtils.addErrorLog(error, "improtAction")
    }
  },
  addVariable: function (sender) {
    let vars = ['{{!}}','{{card}}','{{cardOCR}}','{{cards}}','{{cardsOCR}}','{{parentCard}}','{{parentCardOCR}}','{{notesInMindmap}}','{{context}}','{{textOCR}}','{{userInput}}','{{knowledge}}','{{noteDocInfo}}','{{currentDocInfo}}','{{noteDocAttach}}','{{currentDocAttach}}','{{noteDocName}}','{{currentDocName}}','{{selectionText}}','{{clipboardText}}']
    var commandTable = vars.map(variable=>{
      return {title:variable,object:self,selector:'insert:',param:variable}
    })
    self.popoverController = MNUtil.getPopoverAndPresent(sender,commandTable,200,4)
    // let self = getChatglmController()
    // let range = self.contextInput.selectedRange
    // let pre = self.contextInput.text.slice(0,range.location)
    // let post = self.contextInput.text.slice(range.location)
    // self.contextInput.text = pre+"{{context}}"+post
    // copyJSON(range)
  },
  insert: function (variable) {
    let self = getChatglmController()
    if (!self.contextInput.hidden) {
      let range = self.contextInput.selectedRange
      let pre = self.contextInput.text.slice(0,range.location)
      let post = self.contextInput.text.slice(range.location+range.length)
      self.contextInput.text = pre+variable+post
    }
    if (!self.systemInput.hidden) {
      let range = self.systemInput.selectedRange
      let pre = self.systemInput.text.slice(0,range.location)
      let post = self.systemInput.text.slice(range.location+range.length)
      self.systemInput.text = pre+variable+post
    }
  },
  keyOption:function (button) {
    let self = getChatglmController()
    Menu.dismissCurrentMenu()
    try {

    let menu = new Menu(button,self)
    menu.addMenuItem("📥  Paste API Key","pasteApiKey:")
    menu.addMenuItem("📋  Copy API Key","copyApiKey:")
    menu.addMenuItem("🔑  Get API Key","openAPIURL:")
    menu.preferredPosition = 0
    menu.show()
    } catch (error) {
      chatAIUtils.addErrorLog(error, "keyOption")
    }
  },
  pasteApiKey:function (params) {
    Menu.dismissCurrentMenu()
    let apikey = UIPasteboard.generalPasteboard().string.trim()
    self.apiKeyInput.text = apikey
    chatAIConfig.saveApiKey(apikey)
  },
  copyApiKey:function (params) {
    let self = getChatglmController()
    Menu.dismissCurrentMenu()
    let apikey = self.apiKeyInput.text.trim()
    MNUtil.copy(apikey)
    MNUtil.showHUD("API Key Copied")
  },
  importFromSubscription:function (params) {
    try {
    if (chatAIUtils.checkSubscribe(false)) {
      let apikey = subscriptionConfig.config.apikey
      if (!apikey.trim()) {
        MNUtil.showHUD("Empty key!")
        return
      }
      self.apiKeyInput.text = apikey
      if (subscriptionConfig.config.url) {
        self.URLInput.text = subscriptionConfig.config.url
        chatAIConfig.saveApiKey(apikey,subscriptionConfig.config.url)
      }else{
        self.URLInput.text = "https://api.feliks.top"
        chatAIConfig.saveApiKey(apikey,"https://api.feliks.top")
      }
      // MNUtil.showHUD("Import success!")
      // chatAIConfig.save('MNChatglm_config')
    }

    } catch (error) {
      chatAIUtils.addErrorLog(error, "importFromSubscription")
    }
  },
  toggleImageCompressionButton: function (params) {
    Menu.dismissCurrentMenu()
    chatAIConfig.config.imageCompression = !chatAIConfig.getConfig("imageCompression")
    MNUtil.showHUD("Image compression: "+(chatAIConfig.getConfig("imageCompression")?"✅":"❌"))
    chatAIConfig.save("MNChatglm_config")
    // MNButton.setTitle(self.imageCompressionButton, "Image Compression for vision mode: "+(chatAIConfig.getConfig("imageCompression")?"✅":"❌"))
  },
  openAPIURL:async function (params) {
    self.showHUD("Open API Platform")
    Menu.dismissCurrentMenu()
    let confirm = false
    switch (chatAIConfig.config.source) {
      case "ChatGPT":
        self.openURL("https://platform.openai.com/docs/overview")
        break;
      case "Gemini":
        self.openURL("https://aistudio.google.com/apikey")
        break;
      case "Claude":
        self.openURL("https://docs.anthropic.com/en/api/")
        break;
      case "KimiChat":
        self.openURL("https://platform.moonshot.cn/console/api-keys")
        break;
      case "Minimax":
        self.openURL("https://platform.minimaxi.com/user-center/basic-information/interface-key")
        break;
      case "Deepseek":
        self.openURL("https://platform.deepseek.com/api_keys")
        break;
      case "Github":
        self.openURL("https://github.com/settings/personal-access-tokens")
        break;
      case "Metaso":
        self.openURL("https://metaso.cn/search-api/api-keys")
        break;
      case "Qwen":
        self.openURL("https://bailian.console.aliyun.com/?tab=model#/api-key")
        break;
      case "Volcengine":
        self.openURL("https://console.volcengine.com/ark/region:ark+cn-beijing/apiKey")
        break;
      case "SiliconFlow":
        confirm = await MNUtil.confirm("MN ChatAI", "是否已注册SiliconFlow？",["未注册","已注册"])
        if (confirm) {
          self.openURL("https://cloud.siliconflow.cn/account/ak")
        }else{
          self.openURL("https://cloud.siliconflow.cn/i/Jj66Qvv1")
        }
        break;
      case "ChatGLM":
        confirm = await MNUtil.confirm("MN ChatAI", "是否已注册ChatGLM？",["未注册","已注册"])
        if (confirm) {
          self.openURL("https://open.bigmodel.cn/usercenter/proj-mgmt/apikeys")
        }else{
          self.openURL("https://www.bigmodel.cn/invite?icode=8sa1hLdemfigJAPEbzFQ233uFJ1nZ0jLLgipQkYjpcA%3D")
        }
        break;
        break;
      case "PPIO":
        confirm = await MNUtil.confirm("MN ChatAI", "是否已注册PPIO？",["未注册","已注册"])
        if (confirm) {
          self.openURL("https://ppio.com/settings/key-management")
        }else{
          self.openURL("https://ppio.com/user/register?invited_by=4QHT31")
        }
        break;
      default:
        self.showHUD("Unsupported source: "+chatAIConfig.config.source)
        return;
    }
    // MNUtil.openURL(chatAIConfig.config.url)
  },
  testAPI:async function (params) {
    let self = getChatglmController()
    self.showHUD("Testing...")
    self.testAPI()
    return
    self.showHUD("Open API Platform")
    Menu.dismissCurrentMenu()
    let confirm = false
    switch (chatAIConfig.config.source) {
      case "ChatGPT":
        self.openURL("https://platform.openai.com/docs/overview")
        break;
      case "Gemini":
        self.openURL("https://aistudio.google.com/apikey")
        break;
      case "Claude":
        self.openURL("https://docs.anthropic.com/en/api/")
        break;
      case "KimiChat":
        self.openURL("https://platform.moonshot.cn/console/api-keys")
        break;
      case "Minimax":
        self.openURL("https://platform.minimaxi.com/user-center/basic-information/interface-key")
        break;
      case "Deepseek":
        self.openURL("https://platform.deepseek.com/api_keys")
        break;
      case "Github":
        self.openURL("https://github.com/settings/personal-access-tokens")
        break;
      case "Metaso":
        self.openURL("https://metaso.cn/search-api/api-keys")
        break;
      case "Qwen":
        self.openURL("https://bailian.console.aliyun.com/?tab=model#/api-key")
        break;
      case "Volcengine":
        self.openURL("https://console.volcengine.com/ark/region:ark+cn-beijing/apiKey")
        break;
      case "SiliconFlow":
        confirm = await MNUtil.confirm("MN ChatAI", "是否已注册SiliconFlow？",["未注册","已注册"])
        if (confirm) {
          self.openURL("https://cloud.siliconflow.cn/account/ak")
        }else{
          self.openURL("https://cloud.siliconflow.cn/i/Jj66Qvv1")
        }
        break;
      case "ChatGLM":
        confirm = await MNUtil.confirm("MN ChatAI", "是否已注册ChatGLM？",["未注册","已注册"])
        if (confirm) {
          self.openURL("https://open.bigmodel.cn/usercenter/proj-mgmt/apikeys")
        }else{
          self.openURL("https://www.bigmodel.cn/invite?icode=8sa1hLdemfigJAPEbzFQ233uFJ1nZ0jLLgipQkYjpcA%3D")
        }
        break;
        break;
      case "PPIO":
        confirm = await MNUtil.confirm("MN ChatAI", "是否已注册PPIO？",["未注册","已注册"])
        if (confirm) {
          self.openURL("https://ppio.com/settings/key-management")
        }else{
          self.openURL("https://ppio.com/user/register?invited_by=4QHT31")
        }
        break;
      default:
        self.showHUD("Unsupported source: "+chatAIConfig.config.source)
        return;
    }
    // MNUtil.openURL(chatAIConfig.config.url)
  },
  urlOption:function (button) {
    let menu = new Menu(button,self)
    menu.addMenuItem("📥  Paste URL","pasteURL:")
    menu.addMenuItem("📋  Copy URL","copyURL:")
    menu.addMenuItem("🔄  Reset URL","resetURL:")
    menu.preferredPosition = 0
    menu.show()
  },
  copyURL:function (params) {
    let self = getChatglmController()
    Menu.dismissCurrentMenu()
    let url = self.URLInput.text.trim()
    MNUtil.copy(url)
    MNUtil.showHUD("URL Copied")
  },
  pasteURL:async function (params) {
    let self = getChatglmController()
    Menu.dismissCurrentMenu()
    let URL = chatAIUtils.clipboardText().trim()
    switch (chatAIConfig.config.source) {
      case "Custom":
        if (!URL.endsWith("chat/completions")) {
          MNUtil.confirm("Invalid URL", "URL must end with /chat/completions\nURL 必须以 /chat/completions 结尾")
          return
        }
        chatAIConfig.config.customUrl = URL
        break;
      case "ChatGPT":
        chatAIConfig.config.url = URL.replace("/v1/chat/completions", "")
        break;
      case "Gemini":
        if (!URL.endsWith("chat/completions")) {
          MNUtil.confirm("Invalid URL", "URL must end with /chat/completions\nURL 必须以 /chat/completions 结尾")
          return
        }
        chatAIConfig.config.geminiUrl = URL
        break;
      default:
        MNUtil.showHUD("Unsupported source: "+chatAIConfig.config.source)
        return;
    }
    self.URLInput.text = URL
    MNUtil.showHUD("Save url")
    chatAIConfig.save('MNChatglm_config')
  },
  resetURL:async function (params) {
    let self = getChatglmController()
    Menu.dismissCurrentMenu()
    switch (chatAIConfig.config.source) {
      case "ChatGPT":
        chatAIConfig.config.url = "https://api.openai.com/v1"
        self.URLInput.text = "https://api.openai.com/v1"
        break;
      case "Gemini":
        chatAIConfig.config.geminiUrl = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions"
        self.URLInput.text = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions"
        break;
      default:
        MNUtil.showHUD("Unsupported source: "+chatAIConfig.config.source)
        return;
    }
    MNUtil.showHUD("Save url")
    chatAIConfig.save('MNChatglm_config')
  },
  saveURL:function (params) {
    try {
      
    if (chatAIConfig.config.source === "Custom") {
      chatAIConfig.config.customUrl = self.URLInput.text.trim()
    }else{
      chatAIConfig.config.url = self.URLInput.text.trim()
    }
    MNUtil.showHUD("Save url")
    chatAIConfig.save('MNChatglm_config')
    } catch (error) {
      chatAIUtils.addErrorLog(error, "saveURL")
    }
  },
  saveConfig: async function (params) {
    switch (chatAIConfig.config.source) {
      case "Built-in":
        self.waitHUD("Refreshing...")
        let res = await chatAINetwork.fetchKeys()
        if (res && "shareKeys" in res) {
          self.waitHUD(res.shareKeys.message)
          self.refreshView("modelView")
          MNUtil.stopHUD(1)
          // self.refreshButton.setTitleForState(`1️⃣: ${keys.key0.keys.length}, 2️⃣: ${keys.key1.keys.length}, 3️⃣: ${keys.key2.keys.length}, 4️⃣: ${keys.key3.keys.length}`,0)
          return
        }
        return;
      case "ChatGLM":
        chatAIConfig.config.apikey = self.apiKeyInput.text.trim()
        break;
      case "Claude":
        chatAIConfig.config.claudeKey = self.apiKeyInput.text.trim()
        break;
      case "Gemini":
        chatAIConfig.config.geminiKey = self.apiKeyInput.text.trim()
        chatAIConfig.config.geminiUrl = self.URLInput.text.trim()
        break;
      case "ChatGPT":
        chatAIConfig.config.openaiKey = self.apiKeyInput.text.trim()
        chatAIConfig.config.url = self.URLInput.text.trim()
        chatAIConfig.config.customModel = self.customModelInput.text
        break;
      case "KimiChat":
        chatAIConfig.config.moonshotKey = self.apiKeyInput.text.trim()
        break;
      case "Minimax":
        chatAIConfig.config.miniMaxKey = self.apiKeyInput.text.trim()
        break
      case "Custom":
        chatAIConfig.config.customKey = self.apiKeyInput.text.trim()
        chatAIConfig.config.customUrl = self.URLInput.text.trim()
        chatAIConfig.config.customModel = self.customModelInput.text
        break
      case "SiliconFlow":
        chatAIConfig.config.siliconFlowKey = self.apiKeyInput.text.trim()
        break
      case "PPIO":
        chatAIConfig.config.ppioKey = self.apiKeyInput.text.trim()
        break
      case "Volcengine":
        chatAIConfig.config.volcengineKey = self.apiKeyInput.text.trim()
        break
      case "Deepseek":
        chatAIConfig.config.deepseekKey = self.apiKeyInput.text.trim()
        break;
      case "Github":
        chatAIConfig.config.githubKey = self.apiKeyInput.text.trim()
        break;
      case "Metaso":
        chatAIConfig.config.metasoKey = self.apiKeyInput.text.trim()
        break;
      case "Qwen":
        chatAIConfig.config.qwenKey = self.apiKeyInput.text.trim()
        break;
      case "Subscription":
        chatAIConfig.config.customModel = self.customModelInput.text
        break;
      case "Built-in":
        break;
      default:
        MNUtil.showHUD("Unspported source: "+chatAIConfig.config.source)
        return
    }
    chatAIConfig.save('MNChatglm_config')
    MNUtil.showHUD("Save Config for ["+chatAIConfig.config.source+"]")
  },
  toggleSelected: async function (button) {
  try {
    let self = getChatglmController()
    let config = chatAIConfig.prompts[button.id]
    let temperature = config.temperature ?? 0.8
    if (button.isSelected) {
      self.checkPopover()
      // MNUtil.copy(button.id)

      var commandTable = [
        self.tableItem("▶️   Excute prompt", 'promptAction:', "Excute"),
        self.tableItem("💬   Begin Chat", 'promptAction:', "Chat"),
        self.tableItem("📄   Copy prompt", 'promptAction:', "Copy"),
        self.tableItem("📤   Share prompt", 'promptAction:', "Share"),
        self.tableItem("🗑   Delete prompt", 'promptAction:', "Delete"),
        self.tableItem("🔝   Move to top", 'promptAction:', "Top"),
        self.tableItem("👇   Move to bottom", 'promptAction:', "Bottom"),
        self.tableItem("🌡️   Temperature: "+temperature, 'promptAction:', "changeTemperature")
      ]

      self.popover(button, commandTable,190,1)
      return
    }
    self.titleInput.backgroundColor = MNUtil.hexColorAlpha("#9bb2d6",0.8)
    self.titleInput.editable = true
    self.promptSaveButton.backgroundColor = MNUtil.hexColorAlpha("#e06c75",0.8)
    if (button.isSelected && chatAIConfig.currentPrompt === button.id) {
      return
    }
    let title = button.id
    chatAIConfig.setCurrentPrompt(title)
    self.words.forEach((entryName,index)=>{
      if (entryName === title) {
        self["nameButton"+index].isSelected = true
        self["nameButton"+index].backgroundColor = MNUtil.hexColorAlpha("#457bd3",0.8);
      }else{
        self["nameButton"+index].isSelected = false
        self["nameButton"+index].backgroundColor = MNUtil.hexColorAlpha("#9bb2d6",0.8);
      }
    })
    if (button.isSelected) {
      self.setTextview(title)
    }
    self.SystemButton.setTitleForState("System",0)
    self.contextButton.setTitleForState("User",0)
    self.visionButton.hidden = false
    chatAIConfig.save('MNChatglm_config')
    self.settingViewLayout()

  } catch (error) {
    chatAIUtils.addErrorLog(error, "toggleSelected")
  }
  },
  promptAction: async function (params) {
    try {
      let self = getChatglmController()
      self.checkPopover()
      let promptNames = chatAIConfig.getConfig("promptNames")
      let currentPrompt = chatAIConfig.currentPrompt
      let prompt = chatAIConfig.prompts[currentPrompt]
      let vision = prompt.vision
      let clipboardText = ""
      switch (params) {
        case "copyUser":
          MNUtil.copy(prompt.context)
          self.showHUD("Copy user message")
          break;
        case "copySystem":
          MNUtil.copy(prompt.system)
          self.showHUD("Copy system message")
          break;
        case "pasteUser":
          clipboardText = MNUtil.clipboardText
          if (clipboardText && clipboardText.trim()) {
            self.contextInput.text = clipboardText
            self.showHUD("Paste user message")
          }
          break;
        case "pasteSystem":
          clipboardText = MNUtil.clipboardText
          if (clipboardText && clipboardText.trim()) {
            self.systemInput.text = clipboardText
            self.showHUD("Paste system message")
          }
          break;
        case "Excute":
          self.showHUD("Excute prompt: "+prompt.title)
          if (chatAIUtils.currentSelection === "") {
            self.showHUD("no text/card selected")
            return
          }
          if (chatAIUtils.checkCouldAsk()) {
            self.ask()
          }
          break;
        case "Chat":
          if (chatAIUtils.isMN3()) {
            self.showHUD("Only available in MN4")
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
          chatAIUtils.sideOutputController.openChatViewFromPrompt(currentPrompt)
          break;
        case "Copy":
          MNUtil.copy(JSON.stringify(prompt,null,2))
          self.showHUD("Copy prompt ["+prompt.title+"] to clipboard")
          break;
        case "Delete":
          if (Object.keys(chatAIConfig.prompts).length === 1) {
            self.showHUD("You can not clear all prompts!")
            return
          }
          let confirm = await MNUtil.confirm("MN ChatAI\nDelete this prompt?", "删除这个prompt？")
          if (confirm) {
            let prompt = chatAIConfig.prompts[currentPrompt]
            delete chatAIConfig.prompts[currentPrompt]
            chatAIConfig.config.promptNames = promptNames.filter(item=>item !== chatAIConfig.config.currentPrompt)
            chatAIConfig.setCurrentPrompt(chatAIConfig.config.promptNames[0])
            self.setButtonText(chatAIConfig.config.promptNames,chatAIConfig.currentPrompt)
            self.refreshLayout()
            chatAIConfig.save(["MNChatglm_config","MNChatglm_prompts"])
            self.scrollview.setContentOffsetAnimated({x:0,y:0}, true)
            MNUtil.log({message:"Delete Prompt: "+prompt.title,source:"MN ChatAI",detail:prompt})
          }
          break;
        case "Share":
          let config = JSON.stringify(prompt,undefined,2)
          let url =  `[➕导入](marginnote4app://addon/mnchatai?action=importprompt&promptconfig=${encodeURIComponent(config)}) ${prompt.title}
\`\`\`json
${config}
\`\`\`
`
          MNUtil.copy(url)
          break;
        case "Top":
          chatAIUtils.moveElement(promptNames, currentPrompt, "top")
          self.setButtonText(promptNames,currentPrompt)
          chatAIConfig.save("MNChatglm_config")
          break;
        case "Bottom":
          chatAIUtils.moveElement(promptNames, currentPrompt, "bottom")
          self.setButtonText(promptNames,currentPrompt)
          chatAIConfig.save("MNChatglm_config")
          break;
        case "changeTemperature":
          let options = [
            "🌡️  1.0",
            "🌡️  0.8",
            "🌡️  0.6",
            "🌡️  0.4",
            "🌡️  0.2",
            "🌡️  0.0"
          ]
          let temperatures = [1.0,0.8,0.6,0.4,0.2,0.0]
          let res = await MNUtil.userSelect("Select temperature", "选择温度", options)
          if (res) {
            let targetTemperature = temperatures[res-1]
            chatAIConfig.prompts[currentPrompt].temperature = targetTemperature
            MNUtil.showHUD("Change temperature to "+targetTemperature)
            chatAIConfig.save("MNChatglm_prompts")
          }
          break;
        case "testSystem":
          let system = self.systemInput.text
          if (system) {
            let opt = {noteId:MNNote.getFocusNote()?.noteId,vision:!!vision}
            let systemMessage = await chatAIUtils.render(system,opt)
            // MNUtil.confirm("System Prompt", systemMessage.slice(0, 2000))
            if (systemMessage && systemMessage.trim()) {
              MNUtil.log({message:"Test Prompt: "+self.titleInput.text,source:"MN ChatAI",detail:systemMessage})
              MNUtil.copy(systemMessage)
              self.showHUD("Copy system message")
            }else{
              self.showHUD("❌ Empty system message")
            }
          }
          break;
        case "clearSystem":
          self.systemInput.text = ""
          self.showHUD("Clear system message")
          break
        case "testUser":
          let context = self.contextInput.text
          if (context) {
            let opt = {noteId:MNNote.getFocusNote()?.noteId,vision:!!vision}
            let contextMessage = await chatAIUtils.render(context,opt)
            if (contextMessage && contextMessage.trim()) {
              MNUtil.log({message:"Test Prompt: "+self.titleInput.text,source:"MN ChatAI",detail:contextMessage})
              MNUtil.copy(contextMessage)
              self.showHUD("Copy context message")
            }else{
              self.showHUD("❌ Empty context message")
            }
          }
          break;
        case "clearUser":
          self.contextInput.text = ""
          self.showHUD("Clear context message")
          break
        default:
          MNUtil.showHUD("Unknown action: "	+ params)
          break;
      }
    } catch (error) {
      chatAIUtils.addErrorLog(error, "promptAction")
    }
  },
  moveForwardTapped:function (params) {
    let promptNames = chatAIConfig.getConfig("promptNames")
    chatAIUtils.moveElement(promptNames, chatAIConfig.currentPrompt, "up")
    self.setButtonText(promptNames,chatAIConfig.currentPrompt)
    chatAIConfig.save("MNChatglm_config")
  },
  moveBackwardTapped:function (params) {
    let promptNames = chatAIConfig.getConfig("promptNames")
    chatAIUtils.moveElement(promptNames, chatAIConfig.currentPrompt, "down")
    self.setButtonText(promptNames,chatAIConfig.currentPrompt)
    chatAIConfig.save("MNChatglm_config")
  },
  toggleAutoAction:function () {
  try {
    chatAIConfig.config.autoAction = !chatAIConfig.config.autoAction
    chatAIConfig.save('MNChatglm_config')
    self.refreshView("autoActionView")
    return
    // self.autoActionButton.backgroundColor = chatAIUtils.switchColor(chatAIConfig.config.autoAction)
    // let title = chatAIConfig.config.autoAction ? "Enable trigger: ✅" : "Enable trigger: ❌"
    // self.autoActionButton.setTitleForState(title)
    // self.onSelectionButton.hidden = !chatAIConfig.config.autoAction
    // self.onNewExcerptButton.hidden = !chatAIConfig.config.autoAction
    // self.newExcerptTagDetection.hidden = !chatAIConfig.config.autoAction
    // self.onNoteButton.hidden = !chatAIConfig.config.autoAction
    // self.ignoreButton.hidden = !chatAIConfig.config.autoAction
    // self.delayButton.hidden = !chatAIConfig.config.autoAction

    // for (let index = 0; index < 32; index++) {
    //   self["ColorButton"+index].hidden = !chatAIConfig.config.autoAction
    // }
    // MNUtil.refreshAddonCommands()
      } catch (error) {
      chatAIUtils.addErrorLog(error, "toggleAutoAction")
  }
  },
  toggleOnSelection:function () {
    chatAIConfig.config.onSelection = !chatAIConfig.config.onSelection
    chatAIConfig.save('MNChatglm_config')
    self.onSelectionButton.backgroundColor = chatAIUtils.switchColor(chatAIConfig.config.onSelection)
    if (chatAIConfig.config.onSelection) {
      // self.onSelectionButton.backgroundColor = MNUtil.hexColorAlpha("#457bd3",.8)
      self.onSelectionButton.setTitleForState("On Selection: ✅")
    }else{
      // self.onSelectionButton.backgroundColor = MNUtil.hexColorAlpha("#9bb2d6",0.8)
      self.onSelectionButton.setTitleForState("On Selection: ❌")
    }
  },
  toggleOnNote:function () {
    chatAIConfig.config.onNote = !chatAIConfig.config.onNote
    chatAIConfig.save("MNChatglm_config")

    if (chatAIConfig.config.onNote) {
      self.onNoteButton.backgroundColor = MNUtil.hexColorAlpha("#457bd3",0.8)
      self.onNoteButton.setTitleForState("On Note: ✅")
    }else{
      self.onNoteButton.backgroundColor = MNUtil.hexColorAlpha("#9bb2d6",0.8)
      self.onNoteButton.setTitleForState("On Note: ❌")
    }
  },
  toggleOnNewExcerpt:function () {
    chatAIConfig.config.onNewExcerpt = !chatAIConfig.config.onNewExcerpt
    chatAIConfig.save('MNChatglm_config')
    if (chatAIConfig.config.onNewExcerpt) {
      self.onNewExcerptButton.backgroundColor = MNUtil.hexColorAlpha("#457bd3",0.8)
      self.onNewExcerptButton.setTitleForState("On New Excerpt: ✅")
    }else{
      self.onNewExcerptButton.backgroundColor = MNUtil.hexColorAlpha("#9bb2d6",0.8)
      self.onNewExcerptButton.setTitleForState("On New Excerpt: ❌")
    }
  },
  toggleNewExcerptTagDetection:function () {
    if (!chatAIConfig.getConfig("newExcerptTagDetection") && !chatAIUtils.checkSubscribe()) {
      return
    }
    chatAIConfig.config.newExcerptTagDetection = !chatAIConfig.config.newExcerptTagDetection
    chatAIConfig.save('MNChatglm_config')
    if (chatAIConfig.config.newExcerptTagDetection) {
      self.newExcerptTagDetection.backgroundColor = MNUtil.hexColorAlpha("#457bd3",0.8)
      self.newExcerptTagDetection.setTitleForState("Tag detection: ✅")
    }else{
      self.newExcerptTagDetection.backgroundColor = MNUtil.hexColorAlpha("#9bb2d6",0.8)
      self.newExcerptTagDetection.setTitleForState("Tag detection: ❌")
    }
  },
  toggleAutoSpeech:function (params) {
    chatAIConfig.config.autoSpeech = !chatAIConfig.getConfig("autoSpeech")
    MNButton.setConfig(self.autoSpeechButton, {
      opacity: 1.0,
      color:(chatAIConfig.getConfig("autoSpeech")?"#457bd3":"#9bb2d6"),
      alpha:0.8,
      title:"Auto Speech "+(chatAIConfig.getConfig("autoSpeech")?"✅":"❌")
    })
    chatAIConfig.save("MNChatglm_config")
  },
  toggleSpeech:function (params) {
    chatAIConfig.config.speech = !chatAIConfig.getConfig("speech")
    MNButton.setConfig(self.speechButton, {opacity: 1.0,color:(chatAIConfig.getConfig("speech")?"#457bd3":"#9bb2d6"),alpha:0.8,title:"Speech "+(chatAIConfig.getConfig("speech")?"✅":"❌")})
    MNButton.setConfig(self.speechVoiceButton, {opacity: 1.0,color:(chatAIConfig.getConfig("speech")?"#457bd3":"#9bb2d6"),alpha:0.8,title:"Speech Voice "+chatAIConfig.getConfig("speechVoice")})
    MNButton.setConfig(self.speechSpeedButton, {opacity: 1.0,color:(chatAIConfig.getConfig("speech")?"#457bd3":"#9bb2d6"),alpha:0.8,title:"Speech Speed: "+chatAIConfig.getConfig("speechSpeed")})
    chatAIConfig.save("MNChatglm_config")
  },
  changeSpeechVoice:function (sender) {
  try {
    let voices = ["male-qn-qingse","male-qn-jingying","male-qn-badao","male-qn-daxuesheng","female-shaonv","female-yujie","female-chengshu","female-tianmei","presenter_male","presenter_female","audiobook_male_1","audiobook_male_2","audiobook_female_1","audiobook_female_2","male-qn-qingse-jingpin","male-qn-jingying-jingpin","male-qn-badao-jingpin","male-qn-daxuesheng-jingpin","female-shaonv-jingpin","female-yujie-jingpin","female-chengshu-jingpin","female-tianmei-jingpin"]
    if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
    var commandTable = voices.map(voice=>{
      return {title:voice,object:self,selector:'changeVoiceTo:',param:voice,checked:chatAIConfig.getConfig("speechVoice") == voice}
    }) 
    self.popoverController = MNUtil.getPopoverAndPresent(sender,commandTable,200)
  } catch (error) {
    MNUtil.showHUD(error)
  }
  },
  changeVoiceTo: function (voice) {
    if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
    chatAIConfig.config.speechVoice = voice
    MNButton.setConfig(self.speechVoiceButton, {opacity: 1.0,color:(chatAIConfig.getConfig("speech")?"#457bd3":"#9bb2d6"),alpha:0.8,title:"Speech Voice: "+chatAIConfig.getConfig("speechVoice")})
    chatAIConfig.save("MNChatglm_config")
  },
  changeSpeechSpeed:function (sender) {
  try {
    let speeds = [0.5,0.75,1,1.25,1.5,1.75,2.0]
    if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
    var commandTable = speeds.map(speed=>{
      return {title:"Speed: "+speed,object:self,selector:'changeSpeedTo:',param:speed}
    }) 
    self.popoverController = MNUtil.getPopoverAndPresent(sender,commandTable,200)
  } catch (error) {
    MNUtil.showHUD(error)
  }
  },
  changeSpeedTo: function (speed) {
    if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
    chatAIConfig.config.speechSpeed = speed
    MNButton.setConfig(self.speechSpeedButton, {opacity: 1.0,color:(chatAIConfig.getConfig("speech")?"#457bd3":"#9bb2d6"),alpha:0.8,title:"Speech Speed: "+chatAIConfig.getConfig("speechSpeed")})
    chatAIConfig.save("MNChatglm_config")
  },
  changeDelay: function(sender) {
    Menu.dismissCurrentMenu()
    let menu = new Menu(sender,self,100,1)
    menu.preferredPosition = 1
    menu.width = 100
    let selector = 'changeDelayTo:'
    menu.addMenuItem("2.0s",selector,2.0)
    menu.addMenuItem("1.5s",selector,1.5)
    menu.addMenuItem("1.0s",selector,1.0)
    menu.addMenuItem("0.5s",selector,0.5)
    menu.addMenuItem("0s",selector,0)
    menu.show()
  },
  changeDelayTo: function(delay) {
    chatAIConfig.config.delay = delay
    self.delayButton.setTitleForState("Delay: "+delay+"s")
    chatAIConfig.save("MNChatglm_config")
    MNUtil.showHUD("Set delay to "+delay+"s")
  },
  toggleColorConfig: function (button) {
    if (chatAIConfig.config.colorConfig[button.index]) {
      chatAIConfig.config.colorConfig[button.index] = 0
      button.setTitleForState("✖️",0)
    }else{
      chatAIConfig.config.colorConfig[button.index] = 1
      button.setTitleForState("✓",0)
    }
    chatAIConfig.save("MNChatglm_config")

  },
  dynamicPromptTapped: function (button) {
    let self = getChatglmController()
    if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
    let autoClear = chatAIConfig.getConfig("autoClear")
    let dynamic = chatAIConfig.getConfig("dynamic")
    let temperature = chatAIConfig.getConfig("dynamicTemp")
    let autoImage = chatAIConfig.getConfig("autoImage")
    let autoOCR = chatAIConfig.getConfig("autoOCR")
    let menu = new Menu(button,self,190,1)
    menu.addMenuItem("✏️  Edit Prompt", 'editDynamicPrompt:')
    menu.addMenuItem((dynamic?"✅":"❌")+"  Dynamic", 'toggleDynamic:')
    menu.addMenuItem((autoClear?"✅":"❌")+"  Auto Clear Input", 'toggleAutoClear:')
    menu.addMenuItem((autoImage?"✅":"❌")+"  Auto Vision", 'toggleAutoImage:')
    menu.addMenuItem((autoOCR?"✅":"❌")+"  Auto OCR", 'toggleAutoOCR:')
    menu.addMenuItem("▶️  Test Prompt (Vision)", 'testDynamicPrompt:', "Vision")
    menu.addMenuItem("▶️  Test Prompt (Text)", 'testDynamicPrompt:', "Text")
    menu.addMenuItem("🌡️   Temperature: "+temperature, 'changeDynamicTemp:')
    menu.show()
    // var commandTable = [
    //     {title:"✏️  Edit Prompt",object:self,selector:'editDynamicPrompt:',param:"Excute"},
    //     {title:(dynamic?"✅":"❌")+"  Dynamic",object:self,selector:'toggleDynamic:',param:"Copy"},
    //     {title:(autoClear?"✅":"❌")+"  Auto Clear Input",object:self,selector:'toggleAutoClear:',param:"Copy"},
    //     {title:(autoImage?"✅":"❌")+"  Auto Vision",object:self,selector:'toggleAutoImage:',param:"Copy"},
    //     {title:"▶️  Test Prompt (Vision)",object:self,selector:'testDynamicPrompt:',param:"Vision"},
    //     {title:"▶️  Test Prompt (Text)",object:self,selector:'testDynamicPrompt:',param:"Text"},
    //     self.tableItem("🌡️   Temperature: "+temperature, 'changeDynamicTemp:', "")
    //   ]
    // self.popoverController = MNUtil.getPopoverAndPresent(button,commandTable,190,1)
    // return
  },
  changeDynamicTemp: async function (param) {
    let self = getChatglmController()
    if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
    let options = [
      "🌡️  1.0",
      "🌡️  0.8",
      "🌡️  0.6",
      "🌡️  0.4",
      "🌡️  0.2",
      "🌡️  0.0"
    ]
    let temperatures = [1.0,0.8,0.6,0.4,0.2,0.0]
    let res = await MNUtil.userSelect("Select temperature", "选择温度", options)
    if (res) {
      let targetTemperature = temperatures[res-1]
      chatAIConfig.config.dynamicTemp = targetTemperature
      MNUtil.showHUD("Change temperature to "+targetTemperature)
      chatAIConfig.save("MNChatglm_config")
    }
  },
  testDynamicPrompt: async function (mode) {
  try {
    let self = getChatglmController()
    if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
    Menu.dismissCurrentMenu()
    let userInput = ""
    let system
    let systemMessage
    let preVisionMode = chatAIUtils.visionMode
    if (mode=="Vision") {
      chatAIUtils.visionMode = true
    }
    if (chatAIUtils.currentNoteId) {
      system = chatAIConfig.dynamicPrompt.note
      systemMessage = await chatAIUtils.getNoteVarInfo(chatAIUtils.currentNoteId, system,userInput)
    }else{
      system = chatAIConfig.dynamicPrompt.text
      systemMessage = await chatAIUtils.getTextVarInfo(system,userInput)
    }
    if (systemMessage) {
      MNUtil.log({message:"Test Dynamic Prompt",source:"MN ChatAI",detail:systemMessage})
      MNUtil.copy(systemMessage)
      self.showHUD("Copy system message")
    }else{
      self.showHUD("Empty system message")
    }
    chatAIUtils.visionMode = preVisionMode
  } catch (error) {
    chatAIUtils.addErrorLog(error, "testDynamicPrompt")
  }
  },
  toggleDynamic:function (params) {
    let self = getChatglmController()
    if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
      if (chatAIConfig.config.dynamic) {
        chatAIConfig.config.dynamic = false
        self.dynamicButton.setTitleForState("Dynamic ❌",0)
        self.dynamicButton.backgroundColor = MNUtil.hexColorAlpha("#ff9375",0.8)
      }else{
        self.dynamicButton.backgroundColor = MNUtil.hexColorAlpha("#fd3700",0.8)
        self.dynamicButton.setTitleForState("Dynamic ✅",0)
        chatAIConfig.config.dynamic = true
      }
      chatAIConfig.save('MNChatglm_config')
  },
  toggleAutoClear:function (params) {
    let self = getChatglmController()
    if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
      let autoClear = chatAIConfig.getConfig("autoClear")
      chatAIConfig.config.autoClear = !autoClear
      chatAIConfig.save('MNChatglm_config')
      self.showHUD("Auto clear input: "+(autoClear?"❌":"✅"))
  },
  editDynamicPrompt: function (button) {
    let self = getChatglmController()
    if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
    Menu.dismissCurrentMenu()
    try {
      MNButton.setTitle(self.contextButton, "Text")
      MNButton.setTitle(self.SystemButton, "Note")
      self.titleInput.text = "Dynamic"
      self.titleInput.editable = false
      self.titleInput.backgroundColor = MNUtil.hexColorAlpha("#ff9375",0.8)
      MNButton.setColor(self.promptSaveButton, "#ff714a", 0.8)
      // copyJSON(chatAIConfig.dynamicPrompt)
      self.systemInput.text = chatAIConfig.dynamicPrompt.note
      self.contextInput.text = chatAIConfig.dynamicPrompt.text
      self.visionButton.hidden = true
      self.words.forEach((entryName,index)=>{
        self["nameButton"+index].isSelected = false
        MNButton.setColor(self["nameButton"+index], "#9bb2d6", 0.8)
      })
      self.settingViewLayout()
    } catch (error) {
      MNUtil.showHUD(error)
    }
  },
  toggleIgnoreShortText:function (button) {
    Menu.dismissCurrentMenu()
    chatAIConfig.config.ignoreShortText = !chatAIConfig.config.ignoreShortText
    MNUtil.showHUD("Ignore short text: "+(chatAIConfig.config.ignoreShortText?"✅":"🚫"))
    // if (chatAIConfig.config.ignoreShortText) {
    //   self.ignoreButton.backgroundColor = MNUtil.hexColorAlpha("#457bd3",0.8)
    // }else{
    //   self.ignoreButton.backgroundColor = MNUtil.hexColorAlpha("#9bb2d6",0.8)
    // }
    chatAIConfig.save("MNChatglm_config")

  },
  exportConfig:async function (params) {
  try {
    

    let success = await chatAIConfig.export(true,true)
    if (success) {
      // self.configNoteIdInput.text = chatAIConfig.config.syncNoteId
      chatAIConfig.save("MNChatglm_config",true)
      MNUtil.showHUD("Export Success!")
      self.refreshLastSyncTime()
    }
  } catch (error) {
    chatAIUtils.addErrorLog(error, "exportConfig")
  }
  },
  importConfig:async function (params) {
    let success = await chatAIConfig.import(true,true)
    // let iCloudSync = chatAIConfig.getConfig("syncSource") === "iCloud"
    // if(iCloudSync){
    //   success = await chatAIConfig.readCloudConfig()
    // }
    if (success) {
      chatAIConfig.save(undefined,true)
      self.refreshLastSyncTime()
      MNUtil.showHUD("Import Success!")
    }
  },
  restoreConfig:async function (params) {
    let modifiedTime = chatAIConfig.previousConfig?.config?.modifiedTime
    if (modifiedTime) {
      let dateObj = new Date(modifiedTime)
      let dateString = dateObj.toLocaleString()
      let confirm = await MNUtil.confirm("Restore Config", "恢复上次配置\n\n将会恢复到上次导入前的配置\n\n上次配置的修改时间："+dateString )
      if (confirm) {
        // MNUtil.copy(chatAIConfig.previousConfig)
        let success = chatAIConfig.importConfig(chatAIConfig.previousConfig)
        if (success) {
          chatAIConfig.save(undefined,true)
          MNUtil.showHUD("✅ Restore Success!")
          if (chatAIConfig.getConfig("autoExport")) {
            chatAIConfig.export(true,true)
          }
        }
      }
    }else{
      MNUtil.showHUD("❌ No previous config to restore!")
    }
  },
  syncConfig: async function (params) {
    chatAIConfig.sync()
  },
  toggleAutoExport: function (params) {
  try {
    if (!chatAIUtils.isSubscribed()) {
      MNUtil.showHUD("Not subscribed")
      return
    }
    chatAIConfig.config.autoExport = !chatAIConfig.getConfig("autoExport")
    MNButton.setTitle(self.autoExportButton, "Auto Export: "+(chatAIConfig.getConfig("autoExport")?"✅":"❌"))
    chatAIConfig.save("MNChatglm_config")
  } catch (error) {
    MNUtil.showHUD(error)
  }
  },
  toggleAutoImport: function (params) {
    if (!chatAIUtils.isSubscribed()) {
      MNUtil.showHUD("Not subscribed")
      return
    }
    chatAIConfig.config.autoImport = !chatAIConfig.getConfig("autoImport")
    MNButton.setTitle(self.autoImportButton, "Auto Import: "+(chatAIConfig.getConfig("autoImport")?"✅":"❌"))
    chatAIConfig.save("MNChatglm_config")
  },
  pasteConfigNoteId:async function (params) {
  try {
    let file
    let res
    let syncSource = chatAIConfig.getConfig("syncSource")
    switch (syncSource) {
      case "None":
        return;
      case "MNNote":
        let noteId = MNUtil.clipboardText
        let note = MNNote.new(noteId)//MNUtil.getNoteById(noteId)
        if (note) {
          self.configNoteIdInput.text = note.noteId
          chatAIConfig.config.syncNoteId = note.noteId
          chatAIConfig.save("MNChatglm_config")
          MNUtil.showHUD("Save Config NoteId")
        }else{
          MNUtil.showHUD("Note not exist!")
        }
        break;
      case "CFR2":
        file = MNUtil.clipboardText
        self.configNoteIdInput.text = file
        chatAIConfig.config.r2file = file
        res = await MNUtil.input("Passward for Config","输入云端配置文件加密密码",["Cancel","Confirm"])
        if (res.button) {
          chatAIConfig.config.r2password = res.input
        }
        chatAIConfig.save("MNChatglm_config")
        break;
      case "Infi":
        file = MNUtil.clipboardText
        self.configNoteIdInput.text = file
        chatAIConfig.config.InfiFile = file
        res = await MNUtil.input("Passward for Config","输入云端配置文件加密密码",["Cancel","Confirm"])
        if (res.button) {
          chatAIConfig.config.InfiPassword = res.input
        }
        chatAIConfig.save("MNChatglm_config")
        break;
      case "Webdav":
        file = MNUtil.clipboardText
        self.configNoteIdInput.text = file
        chatAIConfig.config.webdavFile = file
        chatAIConfig.checkWebdavAccount(true)
        // res = await MNUtil.input("Folder for Webdav","输入webdav文件夹",["Cancel","Confirm"])
        // if (res.button) {
        //   chatAIConfig.config.webdavFolder = res.input
        // }
        // res = await MNUtil.input("UserName for Webdav","输入webdav用户名",["Cancel","Confirm"])
        // if (!res.button) {
        //   chatAIConfig.config.webdavUser = res.input
        // }
        // res = await MNUtil.input("Passward for Webdav","输入webdav密码",["Cancel","Confirm"])
        // if (!res.button) {
        //   chatAIConfig.config.webdavPassword = res.input
        // }
        chatAIConfig.save("MNChatglm_config",true)
      default:
        break;
    }
  } catch (error) {
    chatAIUtils.addErrorLog(error, "pasteConfigNoteId")
  }
  },
  clearConfigNoteId:function (params) {
    self.configNoteIdInput.text = ""
    let syncSource = chatAIConfig.getConfig("syncSource")
    switch (syncSource) {
      case "None":
        return;
      case "MNNote":
        chatAIConfig.config.syncNoteId = ""
        chatAIConfig.save("MNChatglm_config",true)
        MNUtil.showHUD("Clear Config NoteId")
        break;
      case "CFR2":
        chatAIConfig.config.r2file = ""
        chatAIConfig.config.r2password = ""
        chatAIConfig.save("MNChatglm_config",true)
        MNUtil.showHUD("Clear Config File")
        break;
      case "Infi":
        chatAIConfig.config.InfiFile = ""
        chatAIConfig.config.InfiPassword = ""
        chatAIConfig.save("MNChatglm_config",true)
        MNUtil.showHUD("Clear Config File")
        break;
      case "Webdav":
        chatAIConfig.config.webdavFile = ""
        chatAIConfig.save("MNChatglm_config",true)
        MNUtil.showHUD("Clear Config File")
        break;
    }
  },
  toggleVisionMode: function (params) {
    if (!chatAIUtils.checkSubscribe(true)) {
      return
    }
    let prompt = chatAIConfig.currentPrompt
    let vision = chatAIConfig.prompts[prompt].vision
    if (vision) {
      chatAIConfig.prompts[prompt].vision = false
      self.visionButton.backgroundColor = MNUtil.hexColorAlpha("#c0bfbf",0.8)
    }else{
      chatAIConfig.prompts[prompt].vision = true
      self.visionButton.backgroundColor = MNUtil.hexColorAlpha("#e06c75",0.8)
    }
    chatAIConfig.save("MNChatglm_prompts")
  },
  focusConfigNoteId:function (params) {
  try {
    let syncSource = chatAIConfig.getConfig("syncSource")
    switch (syncSource) {
      case "None":
        return;
      case "MNNote":
        let noteId = chatAIConfig.config.syncNoteId
        let note = MNNote.new(noteId)
        if (note) {
          note.focusInFloatMindMap()
        }else{
          MNUtil.showHUD("Note not exist!")
        }
        break;
      case "CFR2":
        MNUtil.copy(chatAIConfig.config.r2file)
        break;
      case "Infi":
        MNUtil.copy(chatAIConfig.config.InfiFile)
        break;
      case "Webdav":
        MNUtil.copy(chatAIConfig.config.webdavFile)
        break;
      default:
        break;
    }
  } catch (error) {
    chatAIUtils.addErrorLog(error, "focusConfigNoteId")
  }
  }
});
chatglmController.prototype.init = function () {
  // /**
  //  * @type {chatglmController}
  //  */
  // let ctr = this
  this.reloadImage = MNUtil.getImage(chatAIConfig.mainPath + `/reload.png`)
  this.settingImage = MNUtil.getImage(chatAIConfig.mainPath + `/setting.png`)
  this.visionImage = MNUtil.getImage(chatAIConfig.mainPath + `/vision.png`,1.5)
  this.searchedText = '';
  this.isFirst = true
  this.view.layer.shadowOffset = {width: 0, height: 0};
  this.view.layer.shadowRadius = 15;
  this.view.layer.shadowOpacity = 0.5;
  this.view.layer.shadowColor = UIColor.colorWithWhiteAlpha(0.5, 1);
  this.view.layer.cornerRadius = 11
  this.view.layer.opacity = 1.0
  this.view.layer.borderColor = MNUtil.hexColorAlpha("#9bb2d6",0.8)
  this.view.layer.borderWidth = 0
  this.highlightColor = UIColor.blendedColor( MNUtil.hexColorAlpha("#2c4d81",0.8),
    chatAIUtils.app.defaultTextColor,
    0.8
  );
}

/**
 * @this {chatglmController}
 */
chatglmController.prototype.getQuestionWithOutRender = async function(promptKey = chatAIConfig.currentPrompt,userInput) {
try {
  let prompt = chatAIConfig.prompts[promptKey]
  let selection = MNUtil.currentSelection
  // MNUtil.copyJSON(selection)
  if (selection.onSelection) {
    // MNUtil.showHUD("getQuestionOnText")
    let question = JSON.stringify(prompt)+"\n\n"+selection.text+(userInput?userInput:"")
    return question
  }
  let focusNote = chatAIUtils.getFocusNote()
  // MNUtil.showHUD(message)
  if (focusNote) {
    let question = JSON.stringify(prompt)+"\n\n"+focusNote.noteId+(userInput?userInput:"")
    return question
  }
  let question = JSON.stringify(prompt)+"\n\n"+(userInput?userInput:"")
  return question
} catch (error) {
  chatAIUtils.addErrorLog(error, "chatglmController.getQuestion")
  throw error
}
};

/**
 * @this {chatglmController}
 */
chatglmController.prototype.getQuestion = async function(promptKey = chatAIConfig.currentPrompt,userInput) {
  // MNUtil.log("getQuestion")
try {
  let selection = MNUtil.currentSelection
  // MNUtil.copyJSON(selection)
  if (selection.onSelection) {
    // MNUtil.showHUD("getQuestionOnText")
    let question = await this.getQuestionOnText(promptKey,userInput)
    return question
  }
  let focusNote = chatAIUtils.getFocusNote()
  // MNUtil.showHUD(message)
  if (focusNote) {
    let question = await this.getQuestionOnNote(focusNote.noteId,promptKey,userInput)
    return question
  }
  let question = await this.getQuestionOnText(promptKey,userInput)
  return question
} catch (error) {
  chatAIUtils.addErrorLog(error, "chatglmController.getQuestion")
  throw error
}
};

/**
 * @this {chatglmController}
 */
chatglmController.prototype.getQuestionOnNote = async function(noteid,prompt = chatAIConfig.currentPrompt,userInput) {
  try {
  let vision = chatAIConfig.prompts[prompt].vision
  let context = chatAIConfig.prompts[prompt].context
  let system = chatAIConfig.prompts[prompt].system?.trim()
  let contextMessage
  let systemMessage
  let question
  let opt = {noteId:noteid,userInput:userInput,vision:(chatAIUtils.visionMode || !!vision)}
  // MNUtil.log("getQuestionOnNote")
  contextMessage = await chatAIUtils.render(context,opt)
  if (!contextMessage || !contextMessage.trim()) {
    MNUtil.showHUD("User message is empty")
    return undefined
  }
  if (system) {//有system指令的情况
    systemMessage = await chatAIUtils.render(system,opt)
    if (chatAIUtils.visionMode || vision) {
      let imageDatas = chatAIUtils.getImagesFromNote(MNNote.new(noteid))
      question = [{role:"system",content:systemMessage},chatAIUtils.genUserMessage(contextMessage, imageDatas)]
    }else{
      question = [{role:"system",content:systemMessage},{role: "user", content: contextMessage}]
    }
    return question
  }
  //无system指令的情况
  if (chatAIUtils.visionMode || vision) {
    // let imageData = MNNote.getImageFromNote(MNNote.new(noteid))
    let imageDatas = chatAIUtils.getImagesFromNote(MNNote.new(noteid))
    question = [chatAIUtils.genUserMessage(contextMessage, imageDatas)]
  }else{
    question = [{role: "user", content: contextMessage}]
  }

  return question
    } catch (error) {
    chatAIUtils.addErrorLog(error, "getQuestionOnNote")
  }
}

/**
 * @this {chatglmController}
 */
chatglmController.prototype.getQuestionOnText = async function(prompt = chatAIConfig.currentPrompt,userInput) {
  try {
  let vision = chatAIConfig.prompts[prompt].vision
  let context = chatAIConfig.prompts[prompt].context
  let system = chatAIConfig.prompts[prompt].system
  let opt = {userInput:userInput,vision:(chatAIUtils.visionMode || !!vision)}
  // MNUtil.log("getQuestionOnText")
  let contextMessage = await chatAIUtils.render(context,opt)
  if (!contextMessage || !contextMessage.trim()) {
    MNUtil.showHUD("User message is empty")
    return undefined
  }
  let question
  // MNUtil.copy(contextMessage)
  if (system) {
    let systemMessage = await chatAIUtils.render(system,opt)
    if (chatAIUtils.visionMode  || vision) {
      let imageData = MNUtil.getDocImage()
      question = [{role:"system",content:systemMessage},chatAIUtils.genUserMessage(contextMessage, imageData)]
    }else{
      question = [{role:"system",content:systemMessage},{role: "user", content: contextMessage}]
    }
    return question
  }
  if (chatAIUtils.visionMode || vision) {
    let imageData = MNUtil.getDocImage()
    question = [chatAIUtils.genUserMessage(contextMessage, imageData)]
  }else{
    question = [{role: "user", content: contextMessage}]
  }
  return question
    } catch (error) {
    chatAIUtils.addErrorLog(error, "chatglmController.getQuestionOnText")
    throw error;
  }

}
chatglmController.prototype.changeButtonOpacity = function(opacity) {
    this.moveButton.layer.opacity = opacity
    this.closeButton.layer.opacity = opacity
}
chatglmController.prototype.setButtonLayout = function (button,targetAction) {
    button.autoresizingMask = (1 << 0 | 1 << 3);
    button.setTitleColorForState(UIColor.whiteColor(),0);
    button.setTitleColorForState(this.highlightColor, 1);
    button.backgroundColor = MNUtil.hexColorAlpha("#9bb2d6",0.8);
    button.layer.cornerRadius = 8;
    button.layer.masksToBounds = true;
    if (targetAction) {
      button.addTargetActionForControlEvents(this, targetAction, 1 << 6);
    }
    this.view.addSubview(button);
}


chatglmController.prototype.createButton = function (buttonName,targetAction,superview) {
    this[buttonName] = UIButton.buttonWithType(0);
    this[buttonName].autoresizingMask = (1 << 0 | 1 << 3);
    this[buttonName].setTitleColorForState(UIColor.whiteColor(),0);
    this[buttonName].setTitleColorForState(this.highlightColor, 1);
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
 * @this {chatglmController}
 */
chatglmController.prototype.settingViewLayout = function (){
    let viewFrame = this.view.bounds
    let width = viewFrame.width+10
    let height = viewFrame.height
    this.settingView.frame = MNUtil.genFrame(-5, 55, width, height-65)
    this.configView.frame = MNUtil.genFrame(0,0,width,height-65)
    this.modelView.frame = MNUtil.genFrame(0,0,width,height-65)
    this.autoActionView.frame = MNUtil.genFrame(0,0,width,height-65)
    this.customButtonView.frame = MNUtil.genFrame(0,0,width,height-65)
    this.webviewInput.frame = MNUtil.genFrame(0,0,width,height-65)

    this.advanceView.frame = MNUtil.genFrame(0,0,width,height-65)
    this.syncView.frame = MNUtil.genFrame(0,0,width,height-65)
    // advanceView
    if (width<700) {
      this.orderButton.frame = MNUtil.genFrame(5,5,width-10,35)
      this.knowledgeInput.frame = {x:5,y:205,width:width-10,height:height-315}
      this.saveKnowledgeButton.frame = {x:5,y:height-105,width:width-10,height:35}
      this.speechButton.frame = MNUtil.genFrame(5,45,95,35)
      this.autoSpeechButton.frame = MNUtil.genFrame(105,45,130,35)
      this.speechSpeedButton.frame = MNUtil.genFrame(240,45,width-245,35)
      this.speechVoiceButton.frame = MNUtil.genFrame(5,85,width-10,35)
      this.allowEditButton.frame = MNUtil.genFrame(5,45,width-10,35)
      this.windowLocationButton.frame = MNUtil.genFrame(5,85,width-10,35)
      this.autoThemeButton.frame = MNUtil.genFrame(5,125,width-10,35)
      this.pdfExtractModeButton.frame = MNUtil.genFrame(5,165,width-10,35)
      // configView
      this.scrollview.frame = {x:5,y:5,width:width-10,height:150}
      // this.scrollview.contentSize = {width:width-10,height:height};

      this.contextInput.frame = {x:5,y:200,width:width-90,height:height-270}
      this.systemInput.frame = {x:5,y:200,width:width-90,height:height-270}
      if (this.titleInput.editable) {
        this.titleInput.frame = {x:5,y:160,width:width-130,height:35}
      }else{
        this.titleInput.frame = {x:5,y:160,width:width-90,height:35}
      }
      this.visionButton.frame = MNUtil.genFrame(width-120, 160, 35, 35)
      this.promptModel.frame = {x:width-80,y:160,width:75,height:35}
      this.contextButton.frame = {x:width-80,y:200,width:75,height:35}
      this.promptSaveButton.frame = {x:width-80,y:height-105,width:75,height:35}
      this.addVarButton.frame = {x:width-120,y:height-105,width:30,height:30}

      this.moveUpButton.frame = {x:width-40,y:10,width:30,height:30}
      this.moveDownButton.frame = {x:width-40,y:45,width:30,height:30}
      this.configReset.frame = {x:width-40,y:80,width:30,height:30}
      // this.deleteButton.frame = {x:width-40,y:90,width:30,height:30}
      this.newEntryButton.frame = {x:width-40,y:115,width:30,height:30}

      this.SystemButton.frame = {x:width-80,y:240,width:75,height:35}
      this.funcButton.frame = {x:width-80,y:280,width:75,height:35}
      this.actionButton.frame = {x:width-80,y:320,width:75,height:35}
    }else{
      this.orderButton.frame = MNUtil.genFrame(5,5,350,35)
      this.knowledgeInput.frame = {x:360,y:5,width:width-365,height:height-115}
      this.saveKnowledgeButton.frame = {x:360,y:height-105,width:width-365,height:35}
      this.speechButton.frame = MNUtil.genFrame(5,45,95,35)
      this.autoSpeechButton.frame = MNUtil.genFrame(105,45,130,35)
      this.speechSpeedButton.frame = MNUtil.genFrame(240,45,115,35)
      this.speechVoiceButton.frame = MNUtil.genFrame(5,85,350,35)
      this.allowEditButton.frame = MNUtil.genFrame(5,45,350,35)
      this.windowLocationButton.frame = MNUtil.genFrame(5,85,350,35)
      this.autoThemeButton.frame = MNUtil.genFrame(5,125,350,35)
      this.pdfExtractModeButton.frame = MNUtil.genFrame(5,165,350,35)
      // configView
      this.scrollview.frame = {x:5,y:5,width:350,height:height-75}
      // this.scrollview.contentSize = {width:350,height:height};
      if(this.titleInput.editable){
        this.titleInput.frame = {x:360,y:5,width:width-485,height:35}
      }else{
        this.titleInput.frame = {x:360,y:5,width:width-445,height:35}
      }
      this.visionButton.frame = MNUtil.genFrame(width-120, 5, 35, 35)
      this.contextInput.frame = {x:360,y:45,width:width-445,height:height-115}
      this.systemInput.frame = {x:360,y:45,width:width-445,height:height-115}
      this.promptModel.frame = {x:width-80,y:5,width:75,height:35}
      this.contextButton.frame = {x:width-80,y:45,width:75,height:35}
      this.SystemButton.frame = {x:width-80,y:85,width:75,height:35}
      this.promptSaveButton.frame = {x:width-80,y:height-105,width:75,height:35}
      this.addVarButton.frame = {x:width-120,y:height-105,width:30,height:30}
      this.moveUpButton.frame = {x:320,y:height-210,width:30,height:30}
      this.moveDownButton.frame = {x:320,y:height-175,width:30,height:30}
      this.configReset.frame = {x:320,y:height-140,width:30,height:30}
      // this.deleteButton.frame = {x:320,y:height-140,width:30,height:30}
      this.newEntryButton.frame = {x:320,y:height-105,width:30,height:30}
  
      this.funcButton.frame = {x:width-80,y:125,width:75,height:35}
      this.actionButton.frame = {x:width-80,y:165,width:75,height:35}
    }
    let realWidth = (width > 500)?width-150:width
    let realX = (width > 500)?155:5
    // modelView
    if (width < 500) {
      this.modelScrollview.hidden = true
    }else{
      this.modelScrollview.hidden = false
      let allSources = 11
      let initY = 5
      for (let i = 0; i < allSources; i++) {
        let buttonName = "scrollSourceButton"+i
        this[buttonName].frame = MNUtil.genFrame(5, initY, 135, 35)
        initY = initY+40
        // this.createButton(buttonName,"changeSource:","modelScrollview")
        // MNButton.setConfig(this[buttonName], {opacity:1.0,color:"#2c70de",alpha:0.8})
        // this[buttonName].titleLabel.font = UIFont.boldSystemFontOfSize(17)
      }
    }
    this.modelScrollview.frame = MNUtil.genFrame(5, 5, 145, height-75)
    this.sourceButton.frame = MNUtil.genFrame(realX,5,realWidth-100,35)
    this.saveConfigButton.frame = MNUtil.genFrame(width-90,5,85,35)
    this.saveCustomButton.frame = MNUtil.genFrame(width-65,height-100,60,30)
    this.resetCustomButton.frame = MNUtil.genFrame(width-130,height-100,60,30)
    this.showNotificationButton.frame = MNUtil.genFrame(width-195,height-100,60,30)
    this.apiKeyInput.frame = MNUtil.genFrame(realX,50,realWidth-10,75)
    this.pasteApiKeyButton.frame = MNUtil.genFrame(width-40,90,30,30)
    this.URLInput.frame = MNUtil.genFrame(realX,130,realWidth-10,40)
    this.pasteURLButton.frame = MNUtil.genFrame(width-40,135,30,30)
    this.setModel(chatAIConfig.config.source)
    this.tunnelButton.frame = MNUtil.genFrame(realX,50,(realWidth-10),40)
    this.usageButton.frame = MNUtil.genFrame(realX,95,(realWidth-10),40)

    // autoView
    this.autoActionButton.frame = MNUtil.genFrame(5,5,width-110,35)
    this.delayButton.frame = MNUtil.genFrame(width-100,5,95,35)
    this.onSelectionButton.frame = MNUtil.genFrame(5,50,width-10,35)
    this.onNewExcerptButton.frame = MNUtil.genFrame(5,95,width-170,35)
    this.newExcerptTagDetection.frame = MNUtil.genFrame(width-160,95,155,35)
    this.onNoteButton.frame = MNUtil.genFrame(5,230,(width-10),35)
    this.ignoreButton.frame = MNUtil.genFrame(5,360,(width-10),35)


    // syncView
    this.syncSourceButton.frame = MNUtil.genFrame(5, 5, width-10, 35)
    this.restoreConfigButton.frame = MNUtil.genFrame(5, height-105, width-10, 35)
    this.configNoteIdInput.frame = MNUtil.genFrame(5,50,width-10,60)
    this.syncTimeButton.frame = MNUtil.genFrame(5,115,width-10,35)
    this.exportConfigButton.frame = MNUtil.genFrame(5,155,(width-15)*0.5,35)
    this.importConfigButton.frame = MNUtil.genFrame(10+(width-15)*0.5,155,(width-15)*0.5,35)
    this.autoExportButton.frame = MNUtil.genFrame(5,195,(width-15)*0.5,35)
    this.autoImportButton.frame = MNUtil.genFrame(10+(width-15)*0.5,195,(width-15)*0.5,35)
    this.pasteConfigNoteButton.frame = MNUtil.genFrame(width-70,80,60,25)
    this.clearConfigNoteButton.frame = MNUtil.genFrame(width-135,80,60,25)
    this.focusConfigNoteButton.frame = MNUtil.genFrame(width-200,80,60,25)

    let initX = 5
    let initY = 135

    for (let index = 0; index < 32; index++) {
      if (index == 8) {
        initX = 5
        initY = 175
      }
      if (index == 16) {
        initX = 5
        initY = 270
      }
      if (index == 24) {
        initX = 5
        initY = 310
      }
      this["ColorButton"+index].frame = MNUtil.genFrame(initX,initY,37,37)
      // this["ColorButton"+index].setTitleForState(chatAIConfig.config.colorConfig[index]?"✓":"✖️",0)
      this["ColorButton"+index].setTitleForState(chatAIConfig.getConfig("colorConfig")[index]?"✓":"✖️",0)
      initX = initX+40.5
    }


    let settingFrame = this.settingView.bounds
    settingFrame.x = 0
    settingFrame.y = 20
    settingFrame.height = 30
    settingFrame.width = settingFrame.width-45
    this.tabView.frame = settingFrame

    settingFrame.height = 35
    settingFrame.y = 20
    settingFrame.width = settingFrame.width-35
    // this.segmentedController.frame = settingFrame
    settingFrame.width = this.configButton.width
    settingFrame.y = 0
    settingFrame.x = 0
    settingFrame.height = 30
    this.configButton.frame = settingFrame
    settingFrame.x = settingFrame.x + settingFrame.width + 5
    settingFrame.width = this.modelTab.width
    this.modelTab.frame = settingFrame
    settingFrame.x = settingFrame.x + settingFrame.width + 5
    settingFrame.width = this.customButtonTab.width
    this.customButtonTab.frame = settingFrame
    settingFrame.x = settingFrame.x + settingFrame.width + 5
    settingFrame.width = this.syncConfig.width
    this.syncConfig.frame = settingFrame
    settingFrame.x = settingFrame.x + settingFrame.width + 5
    settingFrame.width = this.triggerButton.width
    this.triggerButton.frame = settingFrame
    settingFrame.x = settingFrame.x + settingFrame.width + 5
    settingFrame.width = this.advancedButton.width
    // this.advancedButton.hidden = this.view.bounds.width < 360
    this.advancedButton.frame = settingFrame
    this.tabView.contentSize = {width:settingFrame.x+settingFrame.width,height:30}
    settingFrame.y = 20
    settingFrame.x = this.tabView.frame.width + 5
    settingFrame.width = 30
    this.closeButton.frame = settingFrame

}
/**
 * @this {chatglmController}
 */
chatglmController.prototype.createSettingView = function (){
try {
  
  //创建各分页
  // MNUtil.showHUD("createSettingView")
  let targetView = "settingView"
  let boldFont = UIFont.boldSystemFontOfSize(16)
  this.creatView(targetView,"view","#f1f6ff",0.9)
  this.settingView.hidden = true
  this.settingView.layer.cornerRadius = 15
  this.tabView = this.createScrollview("view","#ffffff",0)
  this.tabView.alwaysBounceHorizontal = true
  this.tabView.showsHorizontalScrollIndicator = false
  // this.creatView("tabView","view","#ffffff",0.0)
  this.creatView("configView",targetView,"#9bb2d6",0)

  this.creatView("modelView",targetView,"#9bb2d6",0)
  this.modelView.hidden = true

  this.creatView("customButtonView",targetView,"#9bb2d6",0)
  this.customButtonView.hidden = true

  this.creatView("autoActionView",targetView,"#9bb2d6",0)
  this.autoActionView.hidden = true

  this.creatView("advanceView",targetView,"#9bb2d6",0)
  this.advanceView.hidden = true

  this.creatView("syncView",targetView,"#9bb2d6",0)
  this.syncView.hidden = true

  this.createButton("closeButton","closeButtonTapped:","view")
  this.closeButton.layer.cornerRadius = 10;
  MNButton.setImage(this.closeButton, chatAIConfig.closeImage)
  MNButton.setColor(this.closeButton, "#e06c75")
  targetView = "tabView"
  //创建切换按钮
  let buttonColor = "#ffffff"
  let radius = 10
  this.createButton("configButton","configButtonTapped:",targetView)
  this.configButton.layer.cornerRadius = radius;
  MNButton.setConfig(this.configButton, 
    {color:"#457bd3",alpha:0.9,opacity:1.0,title:"Prompt",font:17,bold:true}
  )
  let size = this.configButton.sizeThatFits({width:100,height:100})
  this.configButton.width = size.width+15

  this.createButton("modelTab","modelTabTapped:",targetView)
  this.modelTab.layer.cornerRadius = radius;
  this.modelTab.isSelected = false
  MNButton.setConfig(this.modelTab, 
    {color:"#9bb2d6",alpha:0.9,opacity:1.0,title:"Model",font:17,bold:true}
  )
  size = this.modelTab.sizeThatFits({width:100,height:100})
  this.modelTab.width = size.width+15

  this.createButton("customButtonTab","customButtonTabTapped:",targetView)
  this.customButtonTab.layer.cornerRadius = radius;
  this.customButtonTab.isSelected = false
  MNButton.setConfig(this.customButtonTab, 
    {color:"#9bb2d6",alpha:0.9,opacity:1.0,title:"Button",font:17,bold:true}
  )
  size = this.customButtonTab.sizeThatFits({width:100,height:100})
  this.customButtonTab.width = size.width+15

  this.createButton("triggerButton","triggerButtonTapped:",targetView)
  this.triggerButton.layer.cornerRadius = radius;
  MNButton.setConfig(this.triggerButton, 
    {color:"#9bb2d6",alpha:0.9,opacity:1.0,title:"Trigger",font:17,bold:true}
  )
  size = this.triggerButton.sizeThatFits({width:100,height:100})
  this.triggerButton.width = size.width+15

  this.createButton("syncConfig","syncConfigTapped:",targetView)
  this.syncConfig.layer.cornerRadius = radius;
  MNButton.setConfig(this.syncConfig, 
    {color:"#9bb2d6",alpha:0.9,opacity:1.0,title:"Sync",font:17,bold:true}
  )
  size = this.syncConfig.sizeThatFits({width:100,height:100})
  this.syncConfig.width = size.width+15

  this.createButton("advancedButton","advancedButtonTapped:",targetView)
  this.advancedButton.layer.cornerRadius = radius;
  MNButton.setConfig(this.advancedButton, 
    {color:"#9bb2d6",alpha:0.9,opacity:1.0,title:"More",font:17,bold:true}
  )
  size = this.advancedButton.sizeThatFits({width:100,height:100})
  this.advancedButton.width = size.width+15

  // this.closeButton.setTitleForState('✖️', 0);
  // this.closeButton.titleLabel.font = UIFont.systemFontOfSize(10);

  // //创建分段控制器
  // this.segmentedController = UISegmentedControl.new()
  // // this.segmentedController.segmentedControlStyle = 3
  // this.view.addSubview(this.segmentedController)
  // this.segmentedController.insertSegmentWithTitleAtIndexAnimated("Prompt", 0, true)
  // this.segmentedController.insertSegmentWithTitleAtIndexAnimated("Model", 1, true)
  // this.segmentedController.insertSegmentWithTitleAtIndexAnimated("Trigger", 2, true)
  // this.segmentedController.insertSegmentWithTitleAtIndexAnimated("Sync", 3, true)
  // this.segmentedController.insertSegmentWithTitleAtIndexAnimated("More", 4, true)
  // // this.segmentedController.setTitleTextAttributesForState({font: UIFont.boldSystemFontOfSize(20)}, 1)
  // this.segmentedController.selectedSegmentIndex = 0
  // this.segmentedController.backgroundColor = MNUtil.hexColorAlpha("#3474db",1.0)
  // // this.segmentedController.setEnabledForSegmentAtIndex(true,0)
  // // this.segmentedController.setContentOffsetForSegmentAtIndex({width:0,height:10},0)
  // this.segmentedController.setWidthForSegmentAtIndex(70,0)
  // this.segmentedController.setWidthForSegmentAtIndex(60,1)
  // this.segmentedController.setWidthForSegmentAtIndex(70,2)
  // this.segmentedController.setWidthForSegmentAtIndex(50,3)
  // this.segmentedController.layer.cornerRadius = 18
  // this.segmentedController.clipsToBounds = true
  // this.segmentedController.autoresizingMask = (1 << 0 | 1 << 3);
  // this.segmentedController.layer.masksToBounds = true;
  // this.segmentedController.selectedSegmentTintColor = UIColor.blueColor()

  try {
    
  // var attributes = NSDictionary.dictionaryWithObjectsForKeys([UIFont.boldSystemFontOfSize(15)], ["NSFont"]);
  // this.segmentedController.setTitleTextAttributesForState(attributes, 0)
  this.resizeGesture0 = new UIPanGestureRecognizer(this,"onResizeGesture0:")
  this.closeButton.addGestureRecognizer(this.resizeGesture0)
  this.resizeGesture0.view.hidden = false
  } catch (error) {
    chatAIUtils.addErrorLog(error, "createSettingView")
  }
  //创建各分页下的按钮



  //advanceView
  targetView = "advanceView"
  this.createButton("windowLocationButton","toggleWindowLocation:",targetView)
  MNButton.setConfig(this.windowLocationButton, {opacity:1.0,color:"#457bd3",alpha:0.8})

  this.createButton("autoThemeButton","toggleAutoTheme:",targetView)
  MNButton.setConfig(this.autoThemeButton, {opacity:1.0,color:"#457bd3",alpha:0.8})

  this.createButton("pdfExtractModeButton","choosePDFExtractMode:",targetView)
  MNButton.setConfig(this.pdfExtractModeButton, {opacity:1.0,color:"#457bd3",alpha:0.8})

  this.createButton("allowEditButton","toggleAllowEdit:",targetView)
  MNButton.setConfig(this.allowEditButton, {opacity:1.0,color:"#457bd3",alpha:0.8})

  this.createButton("orderButton","changeSearchOrder:",targetView)
  MNButton.setConfig(this.orderButton, {opacity: 1.0,color: "#457bd3", alpha: 0.8})
  
  this.creatTextView("knowledgeInput",targetView)

  this.createButton("saveKnowledgeButton","saveKnowledgeButtonTapped:","advanceView")
  MNButton.setConfig(this.saveKnowledgeButton, {opacity: 1.0,color:"#e06c75",alpha:0.8,title:"Save Knowledge"})

  this.createButton("speechButton","toggleSpeech:","advanceView")
  MNButton.setConfig(this.speechButton, {opacity: 1.0,color:(chatAIConfig.getConfig("speech")?"#457bd3":"#9bb2d6"),alpha:0.8,title:"Speech "+(chatAIConfig.getConfig("speech")?"✅":"❌")})
  this.speechButton.hidden = true

  this.createButton("autoSpeechButton","toggleAutoSpeech:","advanceView")
  MNButton.setConfig(this.autoSpeechButton, {opacity: 1.0,color:(chatAIConfig.getConfig("autoSpeech")?"#457bd3":"#9bb2d6"),alpha:0.8,title:"Auto Speech "+(chatAIConfig.getConfig("autoSpeech")?"✅":"❌")})
  this.autoSpeechButton.hidden = true

  this.createButton("speechVoiceButton","changeSpeechVoice:","advanceView")
  MNButton.setConfig(this.speechVoiceButton, {opacity: 1.0,color:(chatAIConfig.getConfig("speech")?"#457bd3":"#9bb2d6"),alpha:0.8,title:"Speech Voice: "+chatAIConfig.getConfig("speechVoice")})
  this.speechVoiceButton.hidden = true

  this.createButton("speechSpeedButton","changeSpeechSpeed:","advanceView")
  MNButton.setConfig(this.speechSpeedButton, {opacity: 1.0,color:(chatAIConfig.getConfig("speech")?"#457bd3":"#9bb2d6"),alpha:0.8,title:"Speech Speed: "+chatAIConfig.getConfig("speechSpeed")})
  this.speechSpeedButton.hidden = true

  this.refreshView(targetView)

  //customButtonView
  targetView = "customButtonView"
  this.createWebviewInput("customButtonView")
  this.createButton("saveCustomButton","saveCustomButtonConfig:","customButtonView")
  MNButton.setConfig(this.saveCustomButton, {opacity:0.75,color:"#e06c75",title:"Save",bold:true})
  MNButton.setRadius(this.saveCustomButton,11)

  this.createButton("resetCustomButton","resetCustomButtonConfig:","customButtonView")
  MNButton.setConfig(this.resetCustomButton, {opacity:0.75,color:"#457bd3",title:"Reset",bold:true})
  MNButton.setRadius(this.resetCustomButton,11)

  this.createButton("showNotificationButton","showNotification:","customButtonView")
  MNButton.setConfig(this.showNotificationButton, {opacity:0.75,color:"#457bd3",title:"Show",bold:true})
  MNButton.setRadius(this.showNotificationButton,11)

  //autoActionView

  targetView = "autoActionView"

  this.createButton("autoActionButton","toggleAutoAction:",targetView)
  MNButton.setRadius(this.autoActionButton,11)
  // this.autoActionButton.titleLabel.font = UIFont.boldSystemFontOfSize(17)
  this.createButton("onSelectionButton","toggleOnSelection:",targetView)
  MNButton.setRadius(this.onSelectionButton,11)
  this.createButton("onNoteButton","toggleOnNote:",targetView)
  MNButton.setRadius(this.onNoteButton,11)
  this.createButton("onNewExcerptButton","toggleOnNewExcerpt:",targetView)
  MNButton.setRadius(this.onNewExcerptButton,11)
  this.createButton("newExcerptTagDetection","toggleNewExcerptTagDetection:",targetView)
  MNButton.setRadius(this.newExcerptTagDetection,11)
  this.createButton("ignoreButton","toggleIgnoreShortText:",targetView)
  MNButton.setRadius(this.ignoreButton,11)
  this.createButton("delayButton","changeDelay:",targetView)
  MNButton.setRadius(this.delayButton,11)
  let color = ["#ffffb4","#ccfdc4","#b4d1fb","#f3aebe","#ffff54","#75fb4c","#55bbf9","#ea3323","#ef8733","#377e47","#173dac","#be3223","#ffffff","#dadada","#b4b4b4","#bd9fdc"]
  for (let index = 0; index < 32; index++) {
    this["ColorButton"+index]   = UIButton.buttonWithType(0);
    this["ColorButton"+index].index = index
    this["ColorButton"+index].hidden = !chatAIConfig.getConfig("autoAction")
    if (index > 15) {
      this.setColorButtonLayout(this["ColorButton"+index],"toggleColorConfig:",color[index-16])
    }else{
      this.setColorButtonLayout(this["ColorButton"+index],"toggleColorConfig:",color[index])
    }
  }
  this.refreshView(targetView)

  this.autoActionButton.layer.opacity = 1.0

  //modelView

  targetView = "modelView"
  this.modelScrollview = this.createScrollview(targetView)
  this.modelScrollview.alwaysBounceVertical = true
  this.modelScrollview.showsVerticalScrollIndicator = false

  let allSources = chatAIConfig.allSource(true)
  let sourceIndex = allSources.indexOf(chatAIConfig.config.source)
  this.modelScrollview.contentSize = {width:145,height:11*40+5}
  for (let i = 0; i < allSources.length; i++) {
    let buttonName = "scrollSourceButton"+i
    this.createButton(buttonName,"setSourceByButton:","modelScrollview")
    this[buttonName].sourceIndex = i
    if (i === sourceIndex) {
      MNButton.setConfig(this[buttonName], {opacity:0.9,color:"#2c70de",alpha:0.8,title:allSources[i],bold:true})
    }else{
      MNButton.setConfig(this[buttonName], {opacity:0.8,color:"#9bb2d6",alpha:0.8,title:allSources[i],bold:true})
    }
    this[buttonName].titleLabel.font = UIFont.boldSystemFontOfSize(17)
  }

  this.createButton("sourceButton","changeSource:",targetView)
  MNButton.setConfig(this.sourceButton, {opacity:1.0,color:"#2c70de",alpha:0.8})
  this.sourceButton.titleLabel.font = UIFont.boldSystemFontOfSize(17)
  MNButton.setRadius(this.sourceButton,11)

  this.createButton("tunnelButton","changeTunnel:",targetView)
  MNButton.setConfig(this.tunnelButton, {opacity:1.0,color:"#457bd3",alpha:0.8})
  MNButton.setRadius(this.tunnelButton,11)

  this.createButton("usageButton","refreshUsage:",targetView)
  this.usageButton.builtIn = true
  MNButton.setConfig(this.usageButton, {opacity:1.0,color:"#457bd3",alpha:0.8})
  MNButton.setRadius(this.usageButton,11)

  
  // this.createButton("saveCustomModels","saveCustomModels:","modelView")
  // MNButton.setTitle(this.saveCustomModels, "Save")
  this.creatTextView("customModelInput","modelView")
  // MNButton.setColor(this.saveCustomModels, "#457bd3",0.8)
  
  this.createButton("modelButton","changeModel:","modelView")
  MNButton.setColor(this.modelButton, "#457bd3",0.8)
  MNButton.setRadius(this.modelButton,11)

  this.createButton("openAPIURLButton","openAPIURL:","modelView")
  MNButton.setTitle(this.openAPIURLButton, "Open API Platform")
  MNButton.setColor(this.openAPIURLButton, "#457bd3",0.8)
  MNButton.setRadius(this.openAPIURLButton,11)

  this.createButton("testAPIButton","testAPI:","modelView")
  MNButton.setTitle(this.testAPIButton, "Test API")
  MNButton.setColor(this.testAPIButton, "#457bd3",0.8)
  MNButton.setRadius(this.testAPIButton,11)

  this.createButton("customUsage","refreshUsage:","modelView")
  this.customUsage.builtIn = false
  MNButton.setConfig(this.customUsage, {title:"Usage:",color:"#457bd3",alpha:0.8})
  MNButton.setRadius(this.customUsage,11)

  this.creatTextView("apiKeyInput","modelView")
  this.apiKeyInput.bounces = true
  this.apiKeyInput.editable = true
  MNButton.setRadius(this.apiKeyInput,11)

  this.createButton("pasteApiKeyButton","keyOption:","modelView")
  MNButton.setConfig(this.pasteApiKeyButton, {opacity:0.9,color:"#9bb2d6",title:"🔑"})

  this.creatTextView("URLInput","modelView")
  MNButton.setRadius(this.URLInput,11)

  this.createButton("pasteURLButton","urlOption:","modelView")
  MNButton.setConfig(this.pasteURLButton, {opacity:0.9,color:"#9bb2d6",title:"🔗"})

  this.createButton("saveConfigButton","saveConfig:","modelView")
  MNButton.setConfig(this.saveConfigButton, {opacity:0.8,color:"#e06c75",title:"Save",bold:true})
  MNButton.setRadius(this.saveConfigButton,11)

  this.refreshView(targetView)

  //configView
  targetView = "configView"
  this.scrollview = this.createScrollview(targetView)
  this.scrollview.alwaysBounceVertical = true
  this.scrollview.layer.cornerRadius = 11
  this.scrollview.showsVerticalScrollIndicator = false
  this.scrollview.backgroundColor = MNUtil.hexColorAlpha("#b3bbc0",0.7)
  this.creatTextView("contextInput","configView")
  MNButton.setRadius(this.contextInput, 11)
  this.creatTextView("systemInput","configView")
  MNButton.setRadius(this.systemInput, 11)
  this.systemInput.hidden = true

  this.creatTextView("titleInput","configView","#9bb2d6")
  MNButton.setRadius(this.titleInput, 11)
  this.createButton("dynamicButton","dynamicPromptTapped:","scrollview")


  // let entries           = NSUserDefaults.standardUserDefaults().objectForKey('MNBrowser_entries');
  // copyJSON(chatAIConfig.prompts)
  // copy(text)
  this.titleInput.contentInset = {top: 0,left: 0,bottom: 0,right: 0}
  this.titleInput.textContainerInset = {top: 0,left: 0,bottom: 0,right: 0}

  this.createButton("visionButton","toggleVisionMode:","configView")
  this.visionButton.setImageForState(this.visionImage,0)
  this.visionButton.backgroundColor =  MNUtil.hexColorAlpha("#c0bfbf",0.8)
  MNButton.setRadius(this.visionButton, 11)

  this.createButton("funcButton","changeFunc:","configView")
  MNButton.setConfig(this.funcButton, {opacity:1.0,title:"Tools"})
  MNButton.setRadius(this.funcButton, 11)

  this.createButton("promptModel","changePromptModel:","configView")
  MNButton.setConfig(this.promptModel, {opacity:1.0,title:"Model"})
  MNButton.setRadius(this.promptModel, 11)

  this.createButton("configReset","resetConfig:","configView")
  MNButton.setConfig(this.configReset, {opacity:0.8,title:"🔄",color:"#ffffff",alpha:0.8})

  // this.createButton("deleteButton","configDeleteTapped:","configView")
  // MNButton.setConfig(this.deleteButton, {opacity:0.8,title:"🗑",color:"#9bb2d6",alpha:0.8})

  this.createButton("newEntryButton","configAddTapped:","configView")
  MNButton.setConfig(this.newEntryButton, {opacity:0.8,title:"➕",color:"#ffffff",alpha:0.8})

  this.createButton("moveUpButton","moveForwardTapped:","configView")
  MNButton.setConfig(this.moveUpButton, {opacity:0.8,title:"🔼",color:"#ffffff",alpha:0.8})

  this.createButton("moveDownButton","moveBackwardTapped:","configView")
  MNButton.setConfig(this.moveDownButton, {opacity:0.8,title:"🔽",color:"#ffffff",alpha:0.8})

  this.createButton("promptSaveButton","promptSaveTapped:","configView")
  MNButton.setConfig(this.promptSaveButton, {opacity:0.8,title:"Save",bold:true,color:"#e06c75",alpha:0.8})
  MNButton.addLongPressGesture(this.promptSaveButton, this, "onLongPressSavePrompt:")
  MNButton.setRadius(this.promptSaveButton, 11)


  this.createButton("addVarButton","addVariable:","configView")
  MNButton.setConfig(this.addVarButton, {opacity:1.0,title:"➕"})

  this.createButton("contextButton","configContextTapped:","configView")
  MNButton.setConfig(this.contextButton, {opacity:1.0,title:"User",color:"#457bd3",alpha:0.8})
  MNButton.setRadius(this.contextButton, 11)

  this.createButton("SystemButton","configSystemTapped:","configView")
  MNButton.setConfig(this.SystemButton, {opacity:1.0,title:"System",color:"#9bb2d6",alpha:0.8})
  MNButton.setRadius(this.SystemButton, 11)

  this.createButton("actionButton","changeActions:","configView")
  MNButton.setConfig(this.actionButton, {opacity:1.0,title:"Action",color:"#9bb2d6",alpha:0.8})
  MNButton.setRadius(this.actionButton, 11)
  this.refreshView(targetView)

  //syncView
  targetView = "syncView"
  this.createButton("syncSourceButton","changeSyncSource:",targetView)
  MNButton.setConfig(this.syncSourceButton, {title:"Sync Config: "+chatAIConfig.getSyncSourceString(),color:"#457bd3",font:17,alpha:0.8,bold:true,radius:11})


  this.creatTextView("configNoteIdInput",targetView)
  this.configNoteIdInput.editable = false
  this.createButton("syncTimeButton","syncConfig:",targetView)
  MNButton.setConfig(this.syncTimeButton, {color:"#457bd3",alpha:0.8})
  
  this.createButton("exportConfigButton","exportConfig:",targetView)

  this.createButton("importConfigButton","importConfig:",targetView)

  this.createButton("restoreConfigButton","restoreConfig:",targetView)
  MNButton.setConfig(this.restoreConfigButton, {title:"Restore Config",radius:11})

  this.createButton("autoExportButton","toggleAutoExport:",targetView)
  MNButton.setConfig(this.autoExportButton, {color:"#457bd3",alpha:0.8})

  this.createButton("autoImportButton","toggleAutoImport:",targetView)
  MNButton.setConfig(this.autoImportButton, {color:"#457bd3",alpha:0.8})

  this.createButton("pasteConfigNoteButton","pasteConfigNoteId:",targetView)
  MNButton.setConfig(this.pasteConfigNoteButton, {title:"Paste",color:"#9bb2d6",alpha:0.8})

  this.createButton("clearConfigNoteButton","clearConfigNoteId:",targetView)
  MNButton.setConfig(this.clearConfigNoteButton, {title:"Clear",color:"#9bb2d6",alpha:0.8})

  this.createButton("focusConfigNoteButton","focusConfigNoteId:",targetView)
  MNButton.setConfig(this.focusConfigNoteButton, {title:"Focus",color:"#9bb2d6",alpha:0.8})

  this.refreshView(targetView)  


} catch (error) {
  MNUtil.showHUD(error)

}
}

/**
 * @this {chatglmController}
 * @param {string[]} names
 */
chatglmController.prototype.setButtonText = function (names,highlight) {
try {
  
    this.words = names
    // MNUtil.showHUD("count:"+names.length)
    names.map((word,index)=>{
      if (!(word in chatAIConfig.prompts)) {
        return
      }
      let buttonName = "nameButton"+index
      if (!this[buttonName]) {
        this.createButton(buttonName,"toggleSelected:","scrollview")
        // this[buttonName].index = index
        // MNUtil.showHUD("Create "+buttonName)
        this[buttonName].titleLabel.font = UIFont.systemFontOfSize(16);
      }
      this[buttonName].hidden = false
      this[buttonName].setTitleForState(chatAIConfig.prompts[word].title,0) 
      this[buttonName].id = word

      this[buttonName].isSelected = (word === highlight)
      MNButton.setColor(this[buttonName], (word === highlight) ? "#457bd3" : "#9bb2d6",0.8)
    })
    this.refreshLayout()
} catch (error) {
  MNUtil.showHUD(error)
}
}
/**
 * @this {chatglmController}
 */
chatglmController.prototype.setTextview = function (name) {
      // let entries           =  NSUserDefaults.standardUserDefaults().objectForKey('MNBrowser_entries');
      let text  = chatAIConfig.prompts[name]
      this.titleInput.text= text.title
      this.contextInput.text = text.context?text.context:""
      if (!text.system) {
        text.system = ""
      }
      this.systemInput.text = text.system
      if (text.vision) {
        this.visionButton.backgroundColor = MNUtil.hexColorAlpha("#e06c75",0.8)
      }else{
        this.visionButton.backgroundColor = MNUtil.hexColorAlpha("#c0bfbf",0.8)
      }
}
/**
 * @this {chatglmController}
 */
chatglmController.prototype.refreshLayout = function () {
  if (!this.settingView) {return}
  this.dynamicButton.frame = MNUtil.genFrame(8,8,110,30)
  if (!this.configView.hidden) {
    var viewFrame = this.scrollview.bounds;
    var xLeft     = 0
    let initX = 126
    let initY = 8
    let initL = 0
    this.locs = [];
    // MNUtil.copyJSON(this.words)
    // MNUtil.showHUD("words count:"+this.words.length)
    this.words.map((word,index)=>{
      if (!(word in chatAIConfig.prompts)) {
        return
      }
      let title = chatAIConfig.prompts[word].title
      if (!title) {
        title = "noTitle"
      }
      let width = this["nameButton"+index].sizeThatFits({width:100,height:30}).width+15
      // let width = chatAIUtils.strCode(title.replaceAll(" ",""))*9+15
      if (xLeft+initX+width > viewFrame.width-5) {
        initX = 8
        initY = initY+38
        initL = initL+1
      }
      this["nameButton"+index].frame = {  x: xLeft+initX,  y: initY,  width: width,  height: 30,};
      this.locs.push({
        x:xLeft+initX,
        y:initY,
        l:initL,
        i:index
      })
      initX = initX+width+8
    })
    // MNUtil.copyJSON(this.locs)
    if (this.lastLength && this.lastLength>this.words.length) {
      for (let index = this.words.length; index < this.lastLength; index++) {
        // MNUtil.showHUD("Hidden:"+"nameButton"+index)
        this["nameButton"+index].hidden = true
      }
    }
    this.lastLength = this.words.length
    this.scrollview.contentSize= {width:viewFrame.width,height:initY+40}
  
  }
}

chatglmController.prototype.hideAllButton = function (frame) {
  // if (condition) {
    
  // }
  // this.moveButton.hidden = true
}
chatglmController.prototype.showAllButton = function (frame) {
  // this.moveButton.hidden = false
}
/**
 * @this {chatglmController}
 */
chatglmController.prototype.show = function (frame) {
try {
  MNUtil.studyView.bringSubviewToFront(this.view)
  MNUtil.studyView.bringSubviewToFront(chatAIUtils.addonBar)
  let preFrame = this.currentFrame
  let preOpacity = this.view.layer.opacity
  this.view.layer.opacity = 0.2
  // this.settingView.hidden = true
  // if (frame) {
  //   this.view.frame = frame
  //   this.currentFrame = frame
  // }
  this.view.hidden = false
  this.hideAllButton()

  MNUtil.animate(()=>{
    this.view.layer.opacity = preOpacity
    // this.view.frame = preFrame
    // this.currentFrame = preFrame
  }).then(()=>{
    try {
    this.view.layer.borderWidth = 0
    this.view.layer.opacity = 1.0
    // MNUtil.copy("123")
    this.showAllButton()
    this.settingView.hidden = false
    MNUtil.studyView.bringSubviewToFront(this.view)
    } catch (error) {
      chatAIUtils.addErrorLog(error, "show")
    }
    // chatAIUtils.copyJSON(this.view.frame)
  })
  if (chatAIConfig.autoImport(true)) {
    chatAIConfig.import(false)
  }

} catch (error) {
  chatAIUtils.addErrorLog(error, "show")
}
}
chatglmController.prototype.hide = function (frame) {
  MNUtil.studyView.bringSubviewToFront(chatAIUtils.addonBar)
  let preFrame = this.view.frame
  let preOpacity = this.view.layer.opacity
  let preCustom = this.custom
  this.hideAllButton()
  this.custom = false
  MNUtil.animate(()=>{
    this.view.layer.opacity = 0.2
  }).then(()=>{
    this.view.hidden = true;
    this.view.layer.opacity = preOpacity      
    this.view.frame = preFrame
    this.currentFrame = preFrame
    this.custom = preCustom
  })
}

/**
 * @this {chatglmController}
 * @param {string} superview
 * @param {string} color
 * @param {number} alpha
 * @returns {UIScrollView}
 */
chatglmController.prototype.creatView = function (viewName,superview="view",color="#9bb2d6",alpha=0.8) {
  this[viewName] = UIView.new()
  this[viewName].backgroundColor = MNUtil.hexColorAlpha(color,alpha)
  this[viewName].layer.cornerRadius = 12
  this[superview].addSubview(this[viewName])
}

/**
 * @this {chatglmController}
 * @param {string} superview
 * @param {string} color
 * @param {number} alpha
 * @returns {UIScrollView}
 */
chatglmController.prototype.createScrollview = function (superview="view",color="#c0bfbf",alpha=0.8) {
  let scrollview = UIScrollView.new()
  scrollview.hidden = false
  scrollview.delegate = this
  scrollview.bounces = true
  // scrollview.alwaysBounceVertical = true
  scrollview.layer.cornerRadius = 8
  scrollview.backgroundColor = MNUtil.hexColorAlpha(color,alpha)
  this[superview].addSubview(scrollview)
  return scrollview
}
chatglmController.prototype.creatTextView = function (viewName,superview="view",color="#b3bbc0",alpha=0.7) {
  this[viewName] = UITextView.new()
  this[viewName].font = UIFont.systemFontOfSize(15);
  this[viewName].layer.cornerRadius = 8
  this[viewName].backgroundColor = MNUtil.hexColorAlpha(color,alpha)
  this[viewName].textColor = UIColor.blackColor()
  this[viewName].delegate = this
  this[viewName].bounces = true
  this[superview].addSubview(this[viewName])
}

/**
 * 
 * @param {UIButton} button 
 * @param {*} targetAction 
 * @param {*} color 
 */
chatglmController.prototype.setColorButtonLayout = function (button,targetAction,color) {
    button.autoresizingMask = (1 << 0 | 1 << 3);
    button.setTitleColorForState(UIColor.blackColor(),0);
    button.setTitleColorForState(this.highlightColor, 1);
    button.backgroundColor = UIColor.colorWithHexString(color).colorWithAlphaComponent(0.8);
    button.layer.cornerRadius = 10;
    button.layer.masksToBounds = true;
    button.layer.borderWidth = 2
    if (targetAction) {
      button.addTargetActionForControlEvents(this, targetAction, 1 << 6);
    }
    this.autoActionView.addSubview(button);
}

/**
 * @this {chatglmController}
 */
chatglmController.prototype.fetch = async function (url,options = {}){
  return new Promise((resolve, reject) => {
    // UIApplication.sharedApplication().networkActivityIndicatorVisible = true
    const queue = NSOperationQueue.mainQueue()
    const request = chatAINetwork.initRequest(url, options)
    NSURLConnection.sendAsynchronousRequestQueueCompletionHandler(
      request,
      queue,
      (res, data, err) => {
        if (err.localizedDescription) reject(err.localizedDescription)
        if (res.statusCode() >= 400){

        }
        // if (data.length() === 0) resolve({})
        const result = NSJSONSerialization.JSONObjectWithDataOptions(
          data,
          1<<0
        )
        if (NSJSONSerialization.isValidJSONObject(result)) resolve(result)
        resolve(result)
      }
    )
  })
}

/**
 * @this {chatglmController}
 */
chatglmController.prototype.stringifyCardStructure = function(cardStructure){
  switch (typeof cardStructure) {
    case "string":
      return cardStructure
    case "object":
      if (!Object.keys(cardStructure).length) {
        MNUtil.showHUD("No text in note/card!")
        return undefined
      }
      return JSON.stringify(cardStructure,null,2)
    default:
      return undefined
  }
}

/**
 * @this {chatglmController}
 */
chatglmController.prototype.ask = async function (promptKey = chatAIConfig.currentPrompt){
    // showHUD(promptKey)
  try {
    let question = await this.getQuestion(promptKey)
    if (!question) {
      return
    }
    chatAIUtils.notifyController.ask(question,promptKey)
    return question
  } catch (error) {
    chatAIUtils.addErrorLog(error, "chatglmController.ask")
    // MNUtil.showHUD("Error in ask: "+error)
  }
}
/**
 * @this {chatglmController}
 */
chatglmController.prototype.testAPI = async function (){
    // showHUD(promptKey)
  try {
    chatAIUtils.notifyController.customAsk({
      "role":"user",
      "content":"You are only allowed to reply text below:\nTest Success ✅"
    },undefined,"Test API")
  } catch (error) {
    chatAIUtils.addErrorLog(error, "chatglmController.testAPI")
    // MNUtil.showHUD("Error in ask: "+error)
  }
}
/**
 * @this {chatglmController}
 */
chatglmController.prototype.askWithDelay = async function (promptKey = chatAIConfig.currentPrompt){
    // showHUD(promptKey)
  try {
    let question = await this.getQuestion(promptKey)
    if (!question) {
      return
    }
    let delay = chatAIConfig.config.delay
    await MNUtil.delay(delay)
    chatAIUtils.notifyController.ask(question,promptKey)
    return question
  } catch (error) {
    chatAIUtils.addErrorLog(error, "chatglmController.askWithDelay")
  }
}
/**
 * @this {chatglmController}
 */
chatglmController.prototype.setModel = function (source) {
  let modelName = chatAIConfig.getDefaultModel(source)
  // MNUtil.copy(modelName)
  switch (source) {
    case "ChatGLM":
    case "Claude":
    case "SiliconFlow":
    case "PPIO":
    case "Volcengine":
    case "Github":
    case "Metaso":
    case "Gemini":
    case "ChatGPT":
    case "Subscription":
    case "KimiChat":
    case "Minimax":
    case "Deepseek":
    case "Qwen":
      MNButton.setTitle(this.modelButton, modelName)
      break;
    case "Custom":
      if (chatAIConfig.config.customModel && chatAIConfig.config.customModel.trim() === "") {
        this.modelButton.setTitleForState("No model",0) 
      }else{
        MNButton.setTitle(this.modelButton, modelName)
      }
      break;
    case "Built-in":
      break;
    default:
      MNUtil.showHUD("Unspported source: "+source)
      return
  }
  let viewFrame = this.view.bounds
  let width = viewFrame.width+10
  let realWidth = (width > 500)?width-150:width
  let realX = (width > 500)?155:5
  this.openAPIURLButton.frame = MNUtil.genFrame(realX, viewFrame.height-105, realWidth-10, 35)
  this.testAPIButton.frame = MNUtil.genFrame(realX, viewFrame.height-145, realWidth-10, 35)
  switch (source) {
    case "ChatGLM":
    case "Claude":
    case "KimiChat":
    case "SiliconFlow":
    case "PPIO":
    case "Volcengine":
    case "Github":
    case "Metaso":
    case "Minimax":
    case "Qwen":
    case "Deepseek":
      this.modelButton.frame = MNUtil.genFrame(realX,130,realWidth-10,35)
      break;
    case "ChatGPT":
      this.customUsage.frame = MNUtil.genFrame(realX+195,175,realWidth-205,35)
      this.modelButton.frame = MNUtil.genFrame(realX,175,190,35)
      // this.saveCustomModels.frame = MNUtil.genFrame(width-80,230,70,50)
      this.customModelInput.frame = MNUtil.genFrame(realX, 215, realWidth-10, 65)
      if (chatAIConfig.config.customModel) {
        this.customModelInput.text = chatAIConfig.config.customModel
      }else{
        this.customModelInput.text = "Custom model"
      }
      break;
    case "Subscription":
      // this.customUsage.frame = MNUtil.genFrame(realX+195,50,realWidth-205,35)
      this.modelButton.frame = MNUtil.genFrame(realX,50,realWidth-10,35)
      this.customModelInput.frame = MNUtil.genFrame(realX, 90, realWidth-10, 70)
      if (chatAIConfig.config.customModel) {
        this.customModelInput.text = chatAIConfig.config.customModel
      }else{
        this.customModelInput.text = "Custom model"
      }
      break;
    case "Gemini":
      this.modelButton.frame = MNUtil.genFrame(realX,175,realWidth-10,35)
      break;
    case "Custom":
      this.modelButton.frame = MNUtil.genFrame(realX,175,realWidth-10,35)
      // this.saveCustomModels.frame = MNUtil.genFrame(width-80,230,70,50)
      this.customModelInput.frame = MNUtil.genFrame(realX, 215, realWidth-10, 70)
      if (chatAIConfig.config.customModel) {
        this.customModelInput.text = chatAIConfig.config.customModel
      }else{
        this.customModelInput.text = "Custom model"
      }
      break;
    case "Built-in":
      break;
    default:
      MNUtil.showHUD("Unspported source: "+source)
      return
  }

}

/**
 * @this {chatglmController}
 */
chatglmController.prototype.switchView = function (targetView) {
  let allViews = ["configView", "syncView", "advanceView", "modelView","customButtonView", "autoActionView"]
  let allButtons = ["configButton","syncConfig", "advancedButton", "modelTab", "customButtonTab", "triggerButton"]
  allViews.forEach((k,index) => {
    let isTargetView = k === targetView
    this[k].hidden = !isTargetView
    this[allButtons[index]].isSelected = isTargetView
    this[allButtons[index]].backgroundColor = MNUtil.hexColorAlpha(isTargetView?"#457bd3":"#9bb2d6",0.8)
  })
  this.refreshView(targetView)
}

/**
 * @this {chatglmController}
 */
chatglmController.prototype.refreshView = function (targetView) {
try {
  switch (targetView) {
    case "advanceView":
      this.knowledgeInput.text = chatAIConfig.knowledge
      let locInd = chatAIConfig.config.notifyLoc
      let locNames = ["Left","Right"]
      MNButton.setTitle(this.windowLocationButton, "Notification: "+locNames[locInd])
      MNButton.setTitle(this.autoThemeButton, "Auto Theme: "+(chatAIConfig.getConfig("autoTheme")?"✅":"❌"))
      switch (chatAIConfig.getConfig("PDFExtractMode")) {
        case "local":
          MNButton.setTitle(this.pdfExtractModeButton, "PDF Extract Mode: PDF.js")
          break;
        case "moonshot":
          MNButton.setTitle(this.pdfExtractModeButton, "PDF Extract Mode: Moonshot")
          break;
        default:
          break;
      }
      MNButton.setTitle(this.allowEditButton, "Allow Edit: "+(chatAIConfig.getConfig("allowEdit")?"✅":"❌"))
      MNButton.setTitle(this.orderButton, chatAIConfig.getOrderText())
      break;
    case "modelView":
      MNButton.setTitle(this.sourceButton, "Source: "+chatAIConfig.getConfig("source"),17,true)
      chatAIConfig.getTunnels().then((tunnels)=>{
        this.tunnelButton.setTitleForState(tunnels[chatAIConfig.getConfig("tunnel")],0)
      })
      // let tunnels = ['Tunnel1️⃣: '+chatAIConfig.keys["key0"].model,'Tunnel2️⃣: '+chatAIConfig.keys["key1"].model,'Tunnel3️⃣: '+chatAIConfig.keys["key2"].model,'Tunnel4️⃣: '+chatAIConfig.keys["key3"].model]
      if (chatAIUtils.checkSubscribe(false,false,true)) {
        this.usageButton.setTitleForState("Unlimited",0)
      }else{
        let usage  = chatAIConfig.usage
        this.usageButton.setTitleForState("Usage: "+usage.usage+"/100",0)
      }
      this.setModel(chatAIConfig.config.source)
      this.setModelButton(chatAIConfig.config.source)
      break;
    case "configView":
      if (chatAIConfig.getConfig("dynamic")) {
        MNButton.setConfig(this.dynamicButton, {opacity:1.0,color:"#fd3700",alpha:0.8,title:"Dynamic ✅",bold:true})
      }else{
        MNButton.setConfig(this.dynamicButton, {opacity:1.0,color:"#ff9375",alpha:0.8,title:"Dynamic ❌",bold:true})
      }
      if (this.titleInput.editable) {
        let text  = chatAIConfig.prompts[chatAIConfig.currentPrompt]
        if (!text) {
          chatAIConfig.setCurrentPrompt(chatAIConfig.config.promptNames[0])
          text  = chatAIConfig.prompts[chatAIConfig.currentPrompt]
        }
        this.contextInput.text = text.context?text.context:""
        this.titleInput.text = text.title
        this.setButtonText(chatAIConfig.config.promptNames,chatAIConfig.currentPrompt)
        this.setTextview(chatAIConfig.currentPrompt)
      }else{
        MNButton.setTitle(this.contextButton, "Text")
        MNButton.setTitle(this.SystemButton, "Note")
        this.titleInput.text = "Dynamic"
        this.titleInput.editable = false
        this.titleInput.backgroundColor = MNUtil.hexColorAlpha("#ff9375",0.8)
        MNButton.setColor(this.promptSaveButton, "#ff714a", 0.8)
        // copyJSON(chatAIConfig.dynamicPrompt)
        this.systemInput.text = chatAIConfig.dynamicPrompt.note
        this.contextInput.text = chatAIConfig.dynamicPrompt.text
        this.visionButton.hidden = true
        this.words.forEach((entryName,index)=>{
          this["nameButton"+index].isSelected = false
          MNButton.setColor(this["nameButton"+index], "#9bb2d6", 0.8)
        })
      }
      // MNUtil.copyJSON(chatAIConfig.config)
      break;
    case "syncView":
      let syncSource = chatAIConfig.getConfig("syncSource")
      this.configNoteIdInput.hidden = (syncSource === "iCloud" || syncSource === "None")
      this.focusConfigNoteButton.hidden = (syncSource === "iCloud" || syncSource === "None")
      this.clearConfigNoteButton.hidden = (syncSource === "iCloud" || syncSource === "None")
      this.pasteConfigNoteButton.hidden = (syncSource === "iCloud" || syncSource === "None")
      this.syncTimeButton.hidden = (syncSource === "None")
      this.autoExportButton.hidden = (syncSource === "None")
      this.autoImportButton.hidden = (syncSource === "None")
      this.exportConfigButton.hidden = (syncSource === "None")
      this.importConfigButton.hidden = (syncSource === "None")
      switch (syncSource) {
        case "None":
          break;
        case "iCloud":
          MNButton.setTitle(this.exportConfigButton, "Export to iCloud")
          MNButton.setTitle(this.importConfigButton, "Import from iCloud")
          MNButton.setTitle(this.focusConfigNoteButton, "Focus")
          // this.focusConfigNoteButton.hidden = syncSource === "iCloud"
          break;
        case "MNNote":
          MNButton.setTitle(this.focusConfigNoteButton, "Focus")
          MNButton.setTitle(this.exportConfigButton, "Export to Note")
          MNButton.setTitle(this.importConfigButton, "Import from Note")
          // this.focusConfigNoteButton.hidden = syncSource === "MNNote"
          this.configNoteIdInput.text = chatAIConfig.getConfig("syncNoteId")
          break;
        case "CFR2":
          MNButton.setTitle(this.focusConfigNoteButton, "Copy")
          MNButton.setTitle(this.exportConfigButton, "Export to R2")
          MNButton.setTitle(this.importConfigButton, "Import from R2")
          // this.focusConfigNoteButton.hidden = syncSource === "CFR2"
          this.configNoteIdInput.text = chatAIConfig.getConfig("r2file")
          break;
        case "Infi":
          MNButton.setTitle(this.focusConfigNoteButton, "Copy")
          MNButton.setTitle(this.exportConfigButton, "Export to Infi")
          MNButton.setTitle(this.importConfigButton, "Import from Infi")
          // this.focusConfigNoteButton.hidden = syncSource === "CFR2"
          this.configNoteIdInput.text = chatAIConfig.getConfig("InfiFile")
          break;
        case "Webdav":
          MNButton.setTitle(this.focusConfigNoteButton, "Copy")
          MNButton.setTitle(this.exportConfigButton, "Export to Webdav")
          MNButton.setTitle(this.importConfigButton, "Import from Webdav")
          // this.focusConfigNoteButton.hidden = syncSource === "CFR2"
          this.configNoteIdInput.text = chatAIConfig.getConfig("webdavFile")
          break;
        default:
          break;
      }
      let autoImport = chatAIConfig.autoImport(true)
      MNButton.setTitle(this.autoExportButton, "Auto Export: "+(autoImport?"✅":"❌"))
      MNButton.setTitle(this.autoImportButton, "Auto Import: "+(autoImport?"✅":"❌"))
      break;
    case "autoActionView":
      MNButton.setTitle(this.ignoreButton, "Ignore short text: "+(chatAIConfig.getConfig("ignoreShortText")?"✅":"🚫"))
      if (chatAIConfig.getConfig("ignoreShortText")) {
        MNButton.setColor(this.ignoreButton, "#457bd3", 0.8)
      }else{
        MNButton.setColor(this.ignoreButton, "#9bb2d6", 0.8)
      }
      let autoAction = chatAIConfig.getConfig("autoAction")
      MNButton.setTitle(this.delayButton, "Delay: "+chatAIConfig.config.delay+"s")
      MNButton.setColor(this.delayButton, "#457bd3",0.8)
      MNButton.setColor(this.autoActionButton, autoAction?"#457bd3":"#9bb2d6", 0.8)
      MNButton.setTitle(this.autoActionButton, autoAction?"Enable trigger: ✅":"Enable trigger: ❌",17,true)
      this.onSelectionButton.hidden = !autoAction
      this.onNewExcerptButton.hidden = !autoAction
      this.newExcerptTagDetection.hidden = !autoAction
      this.onNoteButton.hidden = !autoAction
      this.ignoreButton.hidden = !autoAction
      this.delayButton.hidden = false
      let onSelection = chatAIConfig.config.onSelection
      MNButton.setColor(this.onSelectionButton, onSelection?"#457bd3":"#9bb2d6", 0.8)
      MNButton.setTitle(this.onSelectionButton, onSelection?"On Selection: ✅":"On Selection: ❌")
      let onNote = chatAIConfig.config.onNote
      MNButton.setColor(this.onNoteButton, onNote?"#457bd3":"#9bb2d6", 0.8)
      MNButton.setTitle(this.onNoteButton, onNote?"On Note: ✅":"On Note: ❌")
      let onNewExcerpt = chatAIConfig.config.onNewExcerpt
      MNButton.setColor(this.onNewExcerptButton, onNewExcerpt?"#457bd3":"#9bb2d6", 0.8)
      MNButton.setTitle(this.onNewExcerptButton, onNewExcerpt?"On New Excerpt: ✅":"On New Excerpt: ❌")
      let newExcerptTagDetection = chatAIConfig.config.newExcerptTagDetection
      MNButton.setColor(this.newExcerptTagDetection, newExcerptTagDetection?"#457bd3":"#9bb2d6", 0.8)
      MNButton.setTitle(this.newExcerptTagDetection, newExcerptTagDetection?"Tag detection: ✅":"Tag detection: ❌")
      for (let index = 0; index < 32; index++) {
        this["ColorButton"+index].hidden = !chatAIConfig.config.autoAction
      }
      MNUtil.refreshAddonCommands()
      break;
    default:
      break;
  }
} catch (error) {
  chatAIUtils.addErrorLog(error, "chatglmController.refreshView")
}
}
/**
 * @this {chatglmController}
 */
chatglmController.prototype.setModelButton = function (source) {
  if (source == "ChatGPT") {
    this.URLInput.hidden = false
    this.pasteURLButton.hidden = false
    // this.saveURLButton.hidden = false
    // this.saveCustomModels.hidden = false
    this.customModelInput.hidden = false
    this.customUsage.hidden = false
  }else{
    this.URLInput.hidden = true
    this.pasteURLButton.hidden = true
    // this.saveURLButton.hidden = true
    // this.saveCustomModels.hidden = true
    this.customModelInput.hidden = true
    this.customUsage.hidden = true
  }
  if (source == "Built-in") {
    MNButton.setConfig(this.saveConfigButton, {title:"Refresh",bold:true})
    this.apiKeyInput.hidden = true
    this.pasteApiKeyButton.hidden = true
    this.modelButton.hidden = true
    this.tunnelButton.hidden = false
    this.usageButton.hidden = false
  }else{
    MNButton.setConfig(this.saveConfigButton, {title:"Save",bold:true})
    this.apiKeyInput.hidden = false
    this.pasteApiKeyButton.hidden = false
    this.modelButton.hidden = false
    this.tunnelButton.hidden = true
    this.usageButton.hidden = true
  }
  let config = chatAIConfig.getConfigFromSource(source)
  this.apiKeyInput.text = config.key
  switch (source) {
      case "ChatGPT":
        let URL = config.url
        if (URL === "") {
          URL = `https://api.openai.com`
        }else{
          URL = URL.replace("/v1/chat/completions","")
        }
        this.URLInput.text = URL
        break;
      case "Built-in":
        if (chatAIUtils.checkSubscribe(false,false,true)) {
          this.usageButton.setTitleForState("Unlimited",0)
        }else{
          let usage  = chatAIConfig.usage
          this.usageButton.setTitleForState("Usage: "+usage.usage+"/100",0)
        }
        break;
      case "Gemini":
        this.pasteURLButton.hidden = false
        this.URLInput.hidden = false
        if (config.url === "https://generativelanguage.googleapis.com") {
          this.URLInput.text = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions'
        }else{
          this.URLInput.text = config.url
        }
        break;
      case "Custom":
        this.URLInput.text = chatAIConfig.config.customUrl ?? ""
        this.usageButton.hidden = true
        this.pasteURLButton.hidden = false
        // this.saveURLButton.hidden = false
        this.URLInput.hidden = false
        this.customModelInput.hidden = false
        // this.saveCustomModels.hidden = false
        break;
      case "Subscription":
        this.apiKeyInput.hidden = true
        this.customUsage.hidden = true
        this.usageButton.hidden = true
        this.pasteURLButton.hidden = true
        // this.saveURLButton.hidden = false
        this.customModelInput.hidden = false
        this.pasteApiKeyButton.hidden = true
        // this.saveCustomModels.hidden = false
        break;
      default:
        break;
    }
}
/**
 * @this {chatglmController}
 * @param {*} sender 
 * @param {*} commandTable 
 * @param {*} width 
 * @param {*} direction 
 */
chatglmController.prototype.popover = function(sender,commandTable,width=200,direction=2){
  this.popoverController = MNUtil.getPopoverAndPresent(sender,commandTable,width,direction)
}
/**
 * @this {chatglmController}
 */
chatglmController.prototype.checkPopover = function(){
  if (this.popoverController) {
    this.popoverController.dismissPopoverAnimated(true)
  }
}
/**
 * @this {chatglmController}
 */
chatglmController.prototype.refreshLastSyncTime = function () {
  let dateObj = new Date(chatAIConfig.getConfig("lastSyncTime"))
  MNButton.setTitle(this.syncTimeButton, "Last Sync Time: "+dateObj.toLocaleString())
  this.lastLength = chatAIConfig.getConfig("promptNames").length
  if (this.lastLength) {
    this.refreshView("autoActionView")
    this.refreshView("syncView")
    this.refreshView("configView")
    this.refreshView("modelView")
    this.refreshView("advanceView")
  }
}
/**
 * 
 * @param {string} title 
 * @param {string} selector 
 * @param {any} param 
 * @param {boolean|undefined} checked 
 * @this {chatglmController}
 * @returns 
 */
chatglmController.prototype.tableItem = function (title,selector,param = "",checked = false) {
  return {title:title,object:this,selector:selector,param:param,checked:checked}
}

/**
 * @this {chatglmController}
 */
chatglmController.prototype.createWebviewInput = function (superView) {
  try {
  this.webviewInput = new UIWebView(this.view.bounds);
  this.webviewInput.backgroundColor = MNUtil.hexColorAlpha("#c0bfbf",0.8)
  this.webviewInput.scalesPageToFit = false;
  this.webviewInput.autoresizingMask = (1 << 1 | 1 << 4);
  this.webviewInput.delegate = this;
  // this.webviewInput.setValueForKey("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15","User-Agent")
  this.webviewInput.scrollView.delegate = this;
  this.webviewInput.layer.cornerRadius = 12;
  this.webviewInput.layer.masksToBounds = true;
  this.webviewInput.layer.borderColor = MNUtil.hexColorAlpha("#9bb2d6",0.8);
  this.webviewInput.layer.borderWidth = 0
  this.webviewInput.layer.opacity = 0.85
  this.webviewInput.loadFileURLAllowingReadAccessToURL(
    NSURL.fileURLWithPath(chatAIUtils.mainPath + '/buttonEditor.html'),
    NSURL.fileURLWithPath(chatAIUtils.mainPath + '/')
  );
    } catch (error) {
    MNUtil.showHUD(error)
  }
  if (superView) {
    this[superView].addSubview(this.webviewInput)
  }
}
/**
 * @param {object|string} content
 * @this {chatglmController}
 */
chatglmController.prototype.setWebviewContent = async function (content) {
try {

  if (typeof content === "object") {
    let button1 = content.button1
    if (!("autoClose" in button1)) {
      button1.autoClose = false
    }
    let button2 = content.button2
    if (!("autoClose" in button2)) {
      button2.autoClose = false
    }
    let button3 = content.button3
    if (!("autoClose" in button3)) {
      button3.autoClose = false
    }
    let button4 = content.button4
    if (!("autoClose" in button4)) {
      button4.autoClose = false
    }
    let button5 = content.button5
    if (!("autoClose" in button5)) {
      button5.autoClose = false
    }
    let button6 = content.button6
    if (!("autoClose" in button6)) {
      button6.autoClose = false
    }
    let button7 = content.button7 ?? {click:"reAsk",longPress:"reAskWithMenu",autoClose:false}
    let button8 = content.button8 ?? {click:"openChat",longPress:"none",autoClose:true}


    let sortedContent = {
      button1: button1,
      button2: button2,
      button3: button3,
      button4: button4,
      button5: button5,
      button6: button6,
      button7: button7,
      button8: button8
    }
    if (typeof toolbarUtils === "undefined") {
      await this.runJavaScript(`setContent("${encodeURIComponent(JSON.stringify(sortedContent))}")`)
    }else{
      let actionKey = toolbarConfig.getAllActions()
      let buttonConfigs = actionKey.map(key=>{
        return {value:"toolbar:"+key,text:"🔨  "+toolbarConfig.getAction(key).name}
      })
      // MNUtil.copy(`updateAction("${encodeURIComponent(JSON.stringify(buttonConfigs))}")`)
      await this.runJavaScript(`
      updateAction("${encodeURIComponent(JSON.stringify(buttonConfigs))}")
      setContent("${encodeURIComponent(JSON.stringify(sortedContent))}")
      `)
    }
    // MNUtil.copy(`setContent("${encodeURIComponent(JSON.stringify(sortedContent))}")`)
    // await this.runJavaScript(`setContent("${encodeURIComponent(JSON.stringify(sortedContent))}")`)
    return
  }
  if (!MNUtil.isValidJSON(content)) {
    content = "{}"
  }
  this.runJavaScript(`setContent('${encodeURIComponent(content)}')`)
  
} catch (error) {
  chatAIUtils.addErrorLog(error, "setWebviewContent")
}
}

/**
 * @this {chatglmController}
 */
chatglmController.prototype.setJSContent = function (content) {
  this.webviewInput.loadHTMLStringBaseURL(toolbarUtils.JShtml(content))
}

/**
 * @this {chatglmController}
 */
chatglmController.prototype.blur = async function () {
  this.runJavaScript(`document.activeElement.blur();`)
  this.webviewInput.endEditing(true)
}

/**
 * @this {chatglmController}
 */
chatglmController.prototype.getWebviewContent = async function () {
  // let content = await this.runJavaScript(`updateContent(); document.body.innerText`)
  await this.runJavaScript(`document.activeElement.blur();`)
  let content = await this.runJavaScript(`getContent();`)
  let tem = decodeURIComponent(content)
  this.webviewInput.endEditing(true)
  return tem
}

/** @this {chatglmController} */
chatglmController.prototype.runJavaScript = async function(script) {
  // if(!this.webviewResponse || !this.webviewResponse.window)return;
  return new Promise((resolve, reject) => {
      this.webviewInput.evaluateJavaScript(script,(result) => {resolve(result)});
  })
};
/** @this {chatglmController} */
chatglmController.prototype.editorAdjustSelectWidth = function (){
  this.webviewInput.evaluateJavaScript(`adjustSelectWidth()`)
}

/** @this {chatglmController} */
chatglmController.prototype.refreshCustomButton = function (){
  chatAIUtils.notifyController.refreshCustomButton()
}
/**
 * 
 * @param {string} title 
 * @param {number} duration 
 * @param {UIView} view 
 */
chatglmController.prototype.showHUD = function (title,duration = 1.5,view = this.view) {
  MNUtil.showHUD(title,duration,view)
}

/**
 * @this {chatglmController}
 * @param {string} url 
 * @param {string} mode 
 */
chatglmController.prototype.openURL = function (url, mode = "auto") {
  switch (mode) {
    case "auto":
      if (typeof browserUtils !== "undefined") {
        this.showHUD("Open in browser")
        MNUtil.postNotification("openInBrowser", {url:url})
      }else{
        this.showHUD("Open in external browser")
        MNUtil.openURL(url)
      }
      break;
    case "mnbrowser":
    case "mn":
      if (typeof browserUtils !== "undefined") {
        this.showHUD("Open in browser")
        MNUtil.postNotification("openInBrowser", {url:url})
      }else{
        MNUtil.showHUD("Please install MN Browser First")
      }
      break;
    case "external":
      this.showHUD("Open in external browser")
      MNUtil.openURL(url)
      break;
    default:
      break;
  }
}

/**
 * @this {chatglmController}
 */
chatglmController.prototype.setFrame = function (frame) {
  // let studyFrame = MNUtil.studyView.frame
  let lastFrame = frame
  // if (lastFrame.width !== 300) {
  //   lastFrame.width = 64
  //   lastFrame.height = 35
  // }
  // lastFrame.x = MNUtil.constrain(lastFrame.x, 0, studyFrame.width-lastFrame.width)
  // lastFrame.y = MNUtil.constrain(lastFrame.y, 0, studyFrame.height-lastFrame.height)
  // this.lastFrame = lastFrame
  this.view.frame = lastFrame
  this.currentFrame = lastFrame
}

/**
 * 
 * @param {string} title 
 * @param {number} duration 
 * @param {UIView} view 
 */
chatglmController.prototype.waitHUD = function (title,view = this.view) {
  MNUtil.waitHUD(title,view)
}

chatglmController.prototype.importNewPrompt = async function (promptConfig,key) {
    chatAIUtils.chatController.titleInput.text = promptConfig.title
    chatAIUtils.chatController.contextInput.text = promptConfig.context
    chatAIUtils.chatController.systemInput.text = promptConfig.system
    let prompts = chatAIConfig.prompts
    prompts[key] = promptConfig
    chatAIConfig.prompts = prompts
    chatAIConfig.config.promptNames = chatAIConfig.config.promptNames.concat((key))
    this.setButtonText(chatAIConfig.config.promptNames,key)
    chatAIConfig.setCurrentPrompt(key)
    this.refreshLayout()
    chatAIConfig.save("MNChatglm_prompts")
    if (config.vision) {
      this.visionButton.backgroundColor = MNUtil.hexColorAlpha("#e06c75",0.8)
    }else{
      this.visionButton.backgroundColor = MNUtil.hexColorAlpha("#c0bfbf",0.8)
    }
    this.scrollview.setContentOffsetAnimated({x:0,y:this.scrollview.contentSize.height-self.scrollview.frame.height}, true)
}
/** @type {UITextView} */
chatglmController.prototype.contextInput


