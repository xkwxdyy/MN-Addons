// JSB.require('utils');
// JSB.require('base64')
/** @return {settingController} */
const getSettingController = ()=>self
var settingController = JSB.defineClass('settingController : UIViewController <NSURLConnectionDelegate,UIImagePickerControllerDelegate,UIWebViewDelegate>', {
  viewDidLoad: function() {
    let self = getSettingController()
try {
    self.init()
    Frame.set(self.view,50,50,355,500)
    self.lastFrame = self.view.frame;
    self.currentFrame = self.view.frame
    self.isMainWindow = true
    self.title = "main"
    self.preAction = ""
    self.test = [0]
    self.moveDate = Date.now()
    self.color = [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true]
    self.view.layer.shadowOffset = {width: 0, height: 0};
    self.view.layer.shadowRadius = 15;
    self.view.layer.shadowOpacity = 0.5;
    self.view.layer.shadowColor = UIColor.colorWithWhiteAlpha(0.5, 1);
    self.view.layer.cornerRadius = 11
    self.view.layer.opacity = 1.0
    self.view.layer.borderColor = MNUtil.hexColorAlpha("#9bb2d6",0.8)
    self.view.layer.borderWidth = 0
    // self.view.backgroundColor = MNUtil.hexColorAlpha("#9bb2d6",0.8)
    self.config = {}
    if (!self.config.delay) {
      self.config.delay = 0
    }
    if (!self.settingView) {
      self.createSettingView()
    }
} catch (error) {
  MNUtil.showHUD(error)
}
    self.createButton("maxButton","maxButtonTapped:")
    self.maxButton.setTitleForState('➕', 0);
    self.maxButton.titleLabel.font = UIFont.systemFontOfSize(10);
    MNButton.setColor(self.maxButton, "#3a81fb",0.5)
    self.maxButton.width = 18
    self.maxButton.height = 18


    self.createButton("moveButton")
    MNButton.setColor(self.moveButton, "#3a81fb",0.5)
    self.moveButton.width = 150
    self.moveButton.height = 17
    // self.moveButton.showsTouchWhenHighlighted = true
    self.settingViewLayout()
    
    MNButton.addPanGesture(self.moveButton, self, "onMoveGesture:")
    MNButton.addPanGesture(self.resizeButton, self, "onResizeGesture:")
    MNButton.addPanGesture(self.closeButton, self, "onResizeGesture1:")

    // self.moveGesture = new UIPanGestureRecognizer(self,"onMoveGesture:")
    // self.moveButton.addGestureRecognizer(self.moveGesture)
    // self.moveGesture.view.hidden = false
    // self.moveGesture.addTargetAction(self,"onMoveGesture:")

    // self.resizeGesture = new UIPanGestureRecognizer(self,"onResizeGesture:")
    // self.resizeButton.addGestureRecognizer(self.resizeGesture)
    // self.resizeGesture.view.hidden = false
    // self.resizeGesture.addTargetAction(self,"onResizeGesture:")
    // self.settingController.view.hidden = false
    // 初始化只显示buttons标签页,不考虑dynamic
    self.selectedItem = toolbarConfig.action[0]
    let allActions = toolbarConfig.action.concat(toolbarConfig.getDefaultActionKeys().slice(toolbarConfig.action.length))

    try {
      self.setButtonText(allActions,self.selectedItem)
      MNUtil.delay(0.5).then(()=>{
        self.setTextview(self.selectedItem)
      })
      self.settingView.hidden = false
    } catch (error) {  
      toolbarUtils.addErrorLog(error, "viewDidLoad.setButtonText", info)
    }
  },
  viewWillAppear: function(animated) {
  },
  viewWillDisappear: function(animated) {
  },
viewWillLayoutSubviews: function() {
    let buttonHeight = 25
    // self.view.frame = self.currentFrame
    var viewFrame = self.view.bounds;
    var width    = viewFrame.width
    var height   = viewFrame.height

    height = height-36
    self.settingViewLayout()
    self.refreshLayout()

  },
webViewShouldStartLoadWithRequestNavigationType: function(webView,request,type){
    try {
    let self = getSettingController()
    let requestURL = request.URL().absoluteString()
    if (!requestURL) {
      MNUtil.showHUD("Empty URL")
      return false
    }
    if (/^nativecopy\:\/\//.test(requestURL)) {
      let text = decodeURIComponent(requestURL.split("content=")[1])
      MNUtil.copy(text)
      return false
    }
    return true;
    } catch (error) {
      toolbarUtils.addErrorLog(error, "webViewShouldStartLoadWithRequestNavigationType")
      return false
    }
  },
  changeOpacityTo:function (opacity) {
    self.view.layer.opacity = opacity
  },
  moveTopTapped :function () {
    let self = getSettingController()
    let isEditingDynamic = self.dynamicButton.selected
    if (isEditingDynamic && !toolbarUtils.checkSubscribe(true)) {
      self.showHUD("Please subscribe to use this feature")
      return
    }
    let allActions = toolbarConfig.getAllActions(isEditingDynamic)
    toolbarUtils.moveElement(allActions, self.selectedItem, "top")
    self.setButtonText(allActions,self.selectedItem)
    // MNUtil.postNotification("MNToolbarRefreshLayout",{})
    // NSNotificationCenter.defaultCenter().postNotificationNameObjectUserInfo("MNToolbarRefreshLayout", self.window, {})
    if (isEditingDynamic) {
      if (self.toolbarController.dynamicToolbar) {
        self.toolbarController.dynamicToolbar.setToolbarButton(allActions)
      }
      toolbarConfig.dynamicAction = allActions
      toolbarConfig.save("MNToolbar_dynamicAction")
    }else{
      self.toolbarController.setToolbarButton(allActions)
      toolbarConfig.action = allActions
      toolbarConfig.save("MNToolbar_action")
    }
  },
  moveForwardTapped :function () {
    let self = getSettingController()
    try {
    let isEditingDynamic = self.dynamicButton.selected
    if (isEditingDynamic && !toolbarUtils.checkSubscribe(true)) {
      self.showHUD("Please subscribe to use this feature")
      return
    }
    let allActions = toolbarConfig.getAllActions(isEditingDynamic)
    toolbarUtils.moveElement(allActions, self.selectedItem, "up")
    self.setButtonText(allActions,self.selectedItem)
    if (isEditingDynamic) {
      if (self.toolbarController.dynamicToolbar) {
        self.toolbarController.dynamicToolbar.setToolbarButton(allActions)
      }
      toolbarConfig.dynamicAction = allActions
      toolbarConfig.save("MNToolbar_dynamicAction")
    }else{
      self.toolbarController.setToolbarButton(allActions)
      toolbarConfig.action = allActions
      toolbarConfig.save("MNToolbar_action")
    }
    } catch (error) {
      toolbarUtils.addErrorLog(error, "moveForwardTapped")
    }
  },
  moveBackwardTapped :function () {
    let self = getSettingController()
    try {

    let isEditingDynamic = self.dynamicButton.selected
    if (isEditingDynamic && !toolbarUtils.checkSubscribe(true)) {
      self.showHUD("Please subscribe to use this feature")
      return
    }
    let allActions = toolbarConfig.getAllActions(isEditingDynamic)
    toolbarUtils.moveElement(allActions, self.selectedItem, "down")-0
    self.setButtonText(allActions,self.selectedItem)
    if (isEditingDynamic) {
      if (self.toolbarController.dynamicToolbar) {
        self.toolbarController.dynamicToolbar.setToolbarButton(allActions)
      }
      toolbarConfig.dynamicAction = allActions
      toolbarConfig.save("MNToolbar_dynamicAction")
    }else{
      self.toolbarController.setToolbarButton(allActions)
      toolbarConfig.action = allActions
      toolbarConfig.save("MNToolbar_action")
    }
    } catch (error) {
      toolbarUtils.addErrorLog(error, "moveBackwardTapped")
    }
  },
  resetButtonTapped: async function (button) {
    let isEditingDynamic = self.dynamicButton.selected
    let menu = new Menu(button,self)
    menu.width = 250
    menu.rowHeight = 35
    menu.preferredPosition = 0
    let selector = "resetConfig:"
    if (isEditingDynamic) {
      menu.addMenuItem('🔄   Reset all button configs', selector, "config")
      menu.addMenuItem('🔄   Reset button order', selector, "dynamicOrder")
      menu.addMenuItem('🔄   Reset all button images', selector, "image")
      menu.show()
    }else{
      menu.addMenuItem('🔄   Reset all button configs', selector, "config")
      menu.addMenuItem('🔄   Reset button order', selector, "order")
      menu.addMenuItem('🔄   Reset all button images', selector, "image")
      menu.show()
    }
  },
  resetConfig: async function (param) {
  try {
    let self = getSettingController()
    Menu.dismissCurrentMenu()
    let isEditingDynamic = self.dynamicButton.selected
    switch (param) {
      case "config":
        let confirm = await MNUtil.confirm("MN Toolbar: Clear all configs?", "MN Toolbar: 清除所有配置？")
        if (confirm) {
          toolbarConfig.reset("config")
          // self.toolbarController.setToolbarButton(action,toolbarConfig.actions)
          // self.toolbarController.actions = actions
          self.setButtonText()
          self.setTextview()
          MNUtil.showHUD("Reset prompts")
        }
        break;
      case "order":
        toolbarConfig.reset("order")
        if (!isEditingDynamic) {
          self.setButtonText()
          MNUtil.showHUD("Reset fixed order")
        }
        break;
      case "dynamicOrder":
        toolbarConfig.reset("dynamicOrder")
        if (isEditingDynamic) {
          self.setButtonText()
          MNUtil.showHUD("Reset dynamic order")
        }
        break;
      case "image":
        toolbarConfig.imageScale = {}
        toolbarConfig.save("MNToolbar_imageScale")
        let keys = toolbarConfig.getDefaultActionKeys()
        keys.forEach((key)=>{
          toolbarConfig.imageConfigs[key] = MNUtil.getImage(toolbarConfig.mainPath+"/"+toolbarConfig.getAction(key).image+".png")
        })
        MNUtil.postNotification("refreshToolbarButton", {})
        MNUtil.showHUD("Reset button image")
        break
      default:
        break;
    }
  } catch (error) {
    toolbarUtils.addErrorLog(error, "resetConfig")
  }
  },
  closeButtonTapped: async function() {
    self.blur()
    // self.getWebviewContent()
    if (self.addonBar) {
      self.hide(self.addonBar.frame)
    }else{
      self.hide()
    }
    self.searchedText = ""
  },
  maxButtonTapped: function() {
    if (self.customMode === "full") {
      self.customMode = "none"
      self.custom = false;
      // self.hideAllButton()
      self.onAnimate = true
      MNUtil.animate(()=>{
        self.view.frame = self.lastFrame
        self.currentFrame = self.lastFrame
        self.settingViewLayout()
      },0.3).then(()=>{
        self.onAnimate = false
        // self.showAllButton()
        self.settingViewLayout()
        self.editorAdjustSelectWidth()

      })
      return
    }
    const frame = MNUtil.studyView.bounds
    self.lastFrame = self.view.frame
    self.customMode = "full"
    self.custom = true;
    self.dynamic = false;
    self.onAnimate = true
    let targetFrame = Frame.gen(40, 0, frame.width-80, frame.height)
    if (MNUtil.isIOS) {
      targetFrame = Frame.gen(0, 0, frame.width, frame.height)
    }
    // self.hideAllButton()
    MNUtil.animate(()=>{
      self.currentFrame = targetFrame
      self.view.frame = targetFrame
      self.settingViewLayout()
    },0.3).then(()=>{
      self.onAnimate = false
      // self.showAllButton()
      self.settingViewLayout()
    })
  },
  changePopupReplace: function (button) {
    let allActions = toolbarConfig.getAllActions()
    // MNUtil.copyJSON(allActions)
    var commandTable = allActions.map(actionKey=>{
      let actionName = toolbarConfig.getAction(actionKey).name
      return {title:actionName,object:self,selector:'setPopupReplace:',param:{id:button.id,name:actionName,target:actionKey}}
    })
    if (MNUtil.appVersion().type === "macOS") {
      self.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,200,4)
    }else{
      self.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,200,1)
    }
    // MNUtil.showHUD("replacePopupEditTapped")
  },
  setPopupReplace: function (config) {
    self.checkPopoverController()
    try {
      // MNUtil.copyJSON(config)
      // MNUtil.copyJSON(toolbarConfig.popupConfig)
    let popupConfig = toolbarConfig.getPopupConfig(config.id)
    popupConfig.target = config.target
    toolbarConfig.popupConfig[config.id] = popupConfig
    // MNUtil.copyJSON(toolbarConfig.popupConfig)
    // MNUtil.showHUD("Set target: "+config.target)
    let buttonName = "replacePopupButton_"+config.id
    MNButton.setConfig(self[buttonName], {title:config.id+": "+config.name,font:17,radius:10,bold:true})
    toolbarConfig.save("MNToolbar_popupConfig")
    } catch (error) {
      toolbarUtils.addErrorLog(error, "setPopupReplace")
    }
  },
  /**
   * 
   * @param {UISwitch} button 
   */
  togglePopupReplace: function (button) {
    // MNUtil.showHUD("togglePopupReplace:"+button.id)
    let popupConfig = toolbarConfig.getPopupConfig(button.id)
    if (button.on) {
      popupConfig.enabled = true
    }else{
      popupConfig.enabled = false
    }
    toolbarConfig.popupConfig[button.id] = popupConfig
    toolbarConfig.save("MNToolbar_popupConfig")
  },
  onMoveGesture:function (gesture) {
    let self = getSettingController()
    let location = toolbarUtils.getNewLoc(gesture)
    let frame = self.view.frame
    self.view.frame = MNUtil.genFrame(location.x,location.y,frame.width,frame.height)
    self.currentFrame  = self.view.frame
    self.custom = false;
    if (gesture.state === 3) {
      MNUtil.studyView.bringSubviewToFront(self.view)
    }
    let studyFrame = MNUtil.studyView.bounds
    let y = toolbarUtils.constrain(location.y, 0, studyFrame.height-15)
    let x = toolbarUtils.constrain(location.x, -0.5*frame.width, studyFrame.width-15)
    if (self.custom) {
      // Application.sharedInstance().showHUD(self.custom, self.view.window, 2);
      self.customMode = "None"
      MNUtil.animate(()=>{
        Frame.set(self.view,x,y,self.lastFrame.width,self.lastFrame.height)
        self.currentFrame  = self.view.frame
        self.settingViewLayout()
      },0.1)
    }else{
      Frame.set(self.view,x,y)
      self.currentFrame  = self.view.frame
    }
    self.custom = false;


    // let locationToMN = gesture.locationInView(toolbarUtils.studyController().view)
    // if (!self.locationToButton || !self.miniMode && (Date.now() - self.moveDate) > 100) {
    //   let translation = gesture.translationInView(toolbarUtils.studyController().view)
    //   let locationToBrowser = gesture.locationInView(self.view)
    //   let locationToButton = gesture.locationInView(gesture.view)
    //   let newY = locationToButton.y-translation.y 
    //   let newX = locationToButton.x-translation.x
    //   if (gesture.state === 1) {
    //     self.locationToBrowser = {x:locationToBrowser.x-translation.x,y:locationToBrowser.y-translation.y}
    //     self.locationToButton = {x:newX,y:newY}
    //   }
    // }
    // self.moveDate = Date.now()
    // // let location = {x:locationToMN.x - self.locationToBrowser.x,y:locationToMN.y -self.locationToBrowser.y}
    // let location = {x:locationToMN.x - self.locationToButton.x-gesture.view.frame.x,y:locationToMN.y -self.locationToButton.y-gesture.view.frame.y}

    // let studyFrame = MNUtil.studyView.bounds
    // let y = toolbarUtils.constrain(location.y, 0, studyFrame.height-15)
    // let x = toolbarUtils.constrain(location.x, 0, studyFrame.width-15)
    
    // if (self.custom) {
    //   // Application.sharedInstance().showHUD(self.custom, self.view.window, 2);
    //   self.customMode = "None"
    //   MNUtil.animate(()=>{
    //     Frame.set(self.view,x,y,self.lastFrame.width,self.lastFrame.height)
    //     self.currentFrame  = self.view.frame
    //     self.settingViewLayout()
    //   },0.1)
    // }else{
    //   Frame.set(self.view,x,y)
    //   self.currentFrame  = self.view.frame
    // }
    // self.custom = false;
  },
  onResizeGesture:function (gesture) {
    self.custom = false;
    self.customMode = "none"
    let baseframe = gesture.view.frame
    let locationToBrowser = gesture.locationInView(self.view)
    let width = toolbarUtils.constrain(locationToBrowser.x+baseframe.width*0.3, 355, MNUtil.studyView.frame.width)
    let height = toolbarUtils.constrain(locationToBrowser.y+baseframe.height*0.3, 475, MNUtil.studyView.frame.height)
    Frame.setSize(self.view,width,height)
    self.currentFrame  = self.view.frame
  },
  onResizeGesture1:function (gesture) {
    self.custom = false;
    self.customMode = "none"
    let baseframe = gesture.view.frame
    let locationToBrowser = gesture.locationInView(self.view)
    let width = toolbarUtils.constrain(locationToBrowser.x+baseframe.width*0.8, 355, MNUtil.studyView.frame.width)
    let height = toolbarUtils.constrain(locationToBrowser.y+baseframe.height*0.8, 475, MNUtil.studyView.frame.height)
    Frame.setSize(self.view,width,height)
    self.currentFrame  = self.view.frame
  },
  advancedButtonTapped: function (params) {
    self.advanceView.hidden = false
    self.advancedButton.selected = true
    self.configView.hidden = true
    self.configButton.selected = false
    self.dynamicButton.selected = false
    self.popupEditView.hidden = true
    self.popupButton.selected = false
    MNButton.setColor(self.configButton, "#9bb2d6", 0.8)
    MNButton.setColor(self.advancedButton, "#457bd3", 0.8)
    MNButton.setColor(self.popupButton, "#9bb2d6", 0.8)
    MNButton.setColor(self.dynamicButton, "#9bb2d6", 0.8)
  },
  popupButtonTapped: function (params) {
    self.advanceView.hidden = true
    self.advancedButton.selected = false
    self.configView.hidden = true
    self.configButton.selected = false
    self.dynamicButton.selected = false
    self.popupEditView.hidden = false
    self.popupButton.selected = true
    MNButton.setColor(self.configButton, "#9bb2d6", 0.8)
    MNButton.setColor(self.advancedButton, "#9bb2d6", 0.8)
    MNButton.setColor(self.popupButton, "#457bd3", 0.8)
    MNButton.setColor(self.dynamicButton, "#9bb2d6", 0.8)
    self.settingViewLayout()
  },
  configButtonTapped: function (params) {
    self.configView.hidden = false
    self.configButton.selected = true
    self.dynamicButton.selected = false
    self.advanceView.hidden = true
    self.advancedButton.selected = false
    self.popupEditView.hidden = true
    self.popupButton.selected = false
    MNButton.setColor(self.configButton, "#457bd3", 0.8)
    MNButton.setColor(self.advancedButton, "#9bb2d6", 0.8)
    MNButton.setColor(self.dynamicButton, "#9bb2d6", 0.8)
    MNButton.setColor(self.popupButton, "#9bb2d6", 0.8)
    let action = toolbarConfig.action
    self.setButtonText(action)

  },
  dynamicButtonTapped: async function (params) {
    let self = getSettingController()
    let dynamicOrder = toolbarConfig.getWindowState("dynamicOrder")
    if (!dynamicOrder) {
      self.showHUD("Enable Dynamic Order first")
      return
    }
    let dynamicAction = toolbarConfig.dynamicAction
    if (dynamicAction.length === 0) {
      toolbarConfig.dynamicAction = toolbarConfig.action
    }
    self.configView.hidden = false
    self.configButton.selected = false
    self.dynamicButton.selected = true
    self.advanceView.hidden = true
    self.advancedButton.selected = false
    self.popupEditView.hidden = true
    self.popupButton.selected = false
    MNButton.setColor(self.configButton, "#9bb2d6", 0.8)
    MNButton.setColor(self.advancedButton, "#9bb2d6", 0.8)
    MNButton.setColor(self.dynamicButton, "#457bd3", 0.8)
    MNButton.setColor(self.popupButton, "#9bb2d6", 0.8)
    self.setButtonText(dynamicAction)
  },
  chooseTemplate: async function (button) {
    let self = getSettingController()
    let buttonX = toolbarUtils.getButtonFrame(button).x//转化成相对于studyview的
    let selected = self.selectedItem
    let templateNames = toolbarUtils.getTempelateNames(selected)
    if (!templateNames) {
      return
    }
    var templates = toolbarUtils.template
    var commandTable = templateNames.map((templateName,index)=>{
      return {
        title:templateName,
        object:self,
        selector:'setTemplate:',
        param:templates[templateName]
      }
    })
    commandTable.unshift({
      title:"⬇️ Choose a template:",
      object:self,
      selector:'hideTemplateChooser:',
      param:undefined
    })
    let width = 300
    if (MNUtil.studyView.bounds.width - buttonX < (width+40)) {
      self.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,0)
    }else{
      self.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,4)
    }
    // self.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,300,4)
  },
  setTemplate: async function (config) {
    self.checkPopoverController()
    self.updateWebviewContent(JSON.stringify(config))
  },
  configCopyTapped: async function (params) {
    // MNUtil.copy(self.selectedItem)
    let selected = self.selectedItem
    if (!toolbarConfig.checkCouldSave(selected)) {
      return
    }
    try {
    let input = await self.getWebviewContent()
    MNUtil.copy(input)
    MNUtil.showHUD("Copy config")
    } catch (error) {
      toolbarUtils.addErrorLog(error, "configCopyTapped", info)
    }
  },
  configPasteTapped: async function (params) {
    // MNUtil.copy(self.selectedItem)
    let selected = self.selectedItem
    if (!self.checkCouldSave()) {
      return
    }
    try {
    let input = MNUtil.clipboardText
    if (MNUtil.isValidJSON(input)) {
      if (toolbarConfig.builtinActionKeys.includes(self.selectedItem)) {
        let oldConfig = toolbarConfig.getDescriptionById(self.selectedItem)
        // MNUtil.copy(oldConfig)
        if (oldConfig.action !== input.action) {
          MNUtil.showHUD("Only supports acton: "+oldConfig.action)
          return
        }
      }
      if (!toolbarConfig.actions[selected]) {
        toolbarConfig.actions[selected] = toolbarConfig.getAction(selected)
      }
      toolbarConfig.actions[selected].description = input
      toolbarConfig.actions[selected].name = self.titleInput.text
      self.toolbarController.actions = toolbarConfig.actions
      if (self.toolbarController.dynamicToolbar) {
        self.toolbarController.dynamicToolbar.actions = toolbarConfig.actions
      }
      toolbarConfig.save("MNToolbar_actionConfig")
      if (!selected.includes("custom")) {
        MNUtil.showHUD("Save Action: "+self.titleInput.text)
      }else{
        MNUtil.showHUD("Save Custom Action: "+self.titleInput.text)
      }
      if (selected === "edit") {
        let config = JSON.parse(input)
        if ("showOnNoteEdit" in config) {
          toolbarConfig.showEditorOnNoteEdit = config.showOnNoteEdit
        }
      }
      self.updateWebviewContent(input)
    }else{
      MNUtil.showHUD("Invalid JSON format: "+input)
      MNUtil.copy("Invalid JSON format: "+input)
    }
    } catch (error) {
      toolbarUtils.addErrorLog(error, "configSaveTapped", info)
    }
  },
  configSaveTapped: async function (params) {
    let selected = self.selectedItem
    if (!toolbarConfig.checkCouldSave(selected)) {
      return
    }
    try {
    let actions = toolbarConfig.actions
    let input = await self.getWebviewContent()
    if (selected === "execute" || MNUtil.isValidJSON(input)) {
      if (selected.includes("custom")) {
        let action = JSON.parse(input)
        if (!("action" in action)) {
          MNUtil.confirm("MNToolbar", "❌ Action is not found!")
          return
        }
      }
      if (!actions[selected]) {
        actions[selected] = toolbarConfig.getAction(selected)
      }
      actions[selected].description = input
      actions[selected].name = self.titleInput.text
      self.toolbarController.actions = actions
      if (self.toolbarController.dynamicToolbar) {
        self.toolbarController.dynamicToolbar.actions = actions
      }
      toolbarConfig.save("MNToolbar_actionConfig")
      let prefix = selected.includes("custom") ? "Custom " : ""
      self.showHUD("Save "+prefix+"Action: "+self.titleInput.text)
      if (selected === "edit") {
        let config = JSON.parse(input)
        if ("showOnNoteEdit" in config) {
          toolbarConfig.showEditorOnNoteEdit = config.showOnNoteEdit
        }
      }
      // if (selected === "excute") {
      //   // self.setJSContent(selected)
      //   self.runJavaScript(`document.getElementById('editor').innerHTML = document.body.innerText`)
      // }
    }else{
      MNUtil.confirm("MNToolbar","Invalid JSON format!")
    }
    } catch (error) {
      toolbarUtils.addErrorLog(error, "configSaveTapped", info)
    }
  },
  configRunTapped: async function (button) {
    let self = getSettingController()
  try {
    // self.runJavaScript(`editor.setMode("code")`)
    // return
    let selected = self.selectedItem
    if (!toolbarConfig.checkCouldSave(selected)) {
      return
    }
    let input = await self.getWebviewContent()
    if (self.selectedItem === "execute" || MNUtil.isValidJSON(input)) {
      if (!toolbarConfig.actions[selected]) {
        toolbarConfig.actions[selected] = toolbarConfig.getAction(selected)
      }
      toolbarConfig.actions[selected].description = input
      toolbarConfig.actions[selected].name = self.titleInput.text
      self.toolbarController.actions = toolbarConfig.actions
      if (self.toolbarController.dynamicToolbar) {
        self.toolbarController.dynamicToolbar.actions = toolbarConfig.actions
      }
      toolbarConfig.save("MNToolbar_actionConfig")
    }else{
      MNUtil.showHUD("Invalid JSON format!")
      return
    }
    if (selected.includes("custom")) {
      let des = toolbarConfig.getDescriptionById(selected)
      // MNUtil.copyJSON(des)
      self.toolbarController.customActionByDes(button,des)
      return
    }
    if (selected.includes("color")) {
      let colorIndex = parseInt(selected.split("color")[1])
      let des = toolbarConfig.getDescriptionById(selected)
      des.action = "setColor"
      des.color = colorIndex
      toolbarUtils.setColor(des)
      return
    }
    if (selected === "ocr") {
      let des = toolbarConfig.getDescriptionById("ocr")
      des.action = "ocr"
      self.toolbarController.customActionByDes(button,des)
      // toolbarUtils.ocr()
      return
    }
    if (selected === "timer") {
      let des = toolbarConfig.getDescriptionById("timer")
      des.action = "setTimer"
      self.toolbarController.customActionByDes(button,des)
      // toolbarUtils.ocr()
      return
    }
    if (selected === "sidebar") {
      let des = toolbarConfig.getDescriptionById("sidebar")
      toolbarUtils.toggleSidebar(des)
      return
    }
    // if (selected === "execute") {
    //   // self.runJavaScript(`document.getElementById('editor').innerHTML = document.body.innerText`)
    //   let code = toolbarConfig.getExecuteCode()
    //   toolbarSandbox.execute(code)
    //   return
    // }
    if (selected === "chatglm") {
      toolbarUtils.chatAI()
      return
    }

    MNUtil.showHUD("Not supported")
  } catch (error) {
    toolbarUtils.addErrorLog(error, "configRunTapped", info)

  }
  },
  toggleSelected:function (button) {
    if (self.selectedItem === button.id) {
      let selected = self.selectedItem
      let menu = new Menu(button,self)
      menu.width = 200
      menu.rowHeight = 35
      menu.preferredPosition = 1
      // menu.addMenuItem("➕  New icon from 🖼️ Photo", 'changeIconFromPhoto:', selected)
      // menu.addMenuItem("➕  New icon from 📄 File", 'changeIconFromFile:', selected)
      // menu.addMenuItem("➕  New icon from 🌐 Appicon Forge", 'changeIconFromWeb:', "https://zhangyu1818.github.io/appicon-forge/")
      // menu.addMenuItem("➕  New icon from 🌐 Icon Font", 'changeIconFromWeb:', "https://www.iconfont.cn/")
      menu.addMenuItem("➕  New icon", 'chooseIconSource:')
      menu.addMenuItem("🔍  Change icon scale", 'changeIconScale:', selected)
      menu.addMenuItem("🔄  Reset icon", 'resetIcon:', selected)
      // var commandTable = [
      //   {title:"➕  New icon from 🖼️ Photo", object:self, selector:'changeIconFromPhoto:',param:selected},
      //   {title:"➕  New icon from 📄 File", object:self, selector:'changeIconFromFile:',param:selected},
      //   {title:"➕  New icon from 🌐 Appicon Forge", object:self, selector:'changeIconFromWeb:',param:"https://zhangyu1818.github.io/appicon-forge/"},
      //   {title:"➕  New icon from 🌐 Icon Font", object:self, selector:'changeIconFromWeb:',param:"https://www.iconfont.cn/"},
      //   {title:"🔍  Change icon scale", object:self, selector:'changeIconScale:',param:selected},
      //   {title:"🔄  Reset icon", object:self, selector:'resetIcon:',param:selected}
      // ]
      menu.addMenuItem("🔗  Copy URL", 'copyActionURL:', selected)
      menu.addMenuItem("📤  Share Config", 'shareActionURL:', selected)
      menu.show()
      // self.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,300,1)
      return
    }
    button.isSelected = !button.isSelected
    let title = button.id
    self.selectedItem = title
    self.words.forEach((entryName,index)=>{
      if (entryName !== title) {
        self["nameButton"+index].isSelected = false
        MNButton.setColor(self["nameButton"+index], "#ffffff", 0.8)
        self["nameButton"+index].layer.borderWidth = 0
      }
    })
    if (button.isSelected) {
      self.setTextview(title)
      MNButton.setColor(button, "#9bb2d6", 0.8)
      button.layer.borderWidth = 2
      button.layer.borderColor = MNUtil.hexColorAlpha("#457bd3", 0.8)
    }else{
      MNButton.setColor(button, "#ffffff", 0.8)
    }
  },
  chooseIconSource:async function (buttonName) {
    let self = getSettingController()
    Menu.dismissCurrentMenu()
    self.checkPopoverController()
    let userSelect = await MNUtil.userSelect("Choose Icon Source", "请选择图片来源", ["🖼️  Photo / 图库","📄  File / 文件","🌐  Appicon Forge","🌐  Icon Font"])
    if (userSelect === 0) {
      MNUtil.showHUD("Cancel")
      return
    }
    if (!toolbarUtils.checkSubscribe(true)) {
      return
    }
    let beginFrame = self.view.frame
    let endFrame = self.view.frame
    if (endFrame.width < 800) {
      endFrame.width = 800
    }
    if (endFrame.height < 600) {
      endFrame.height = 600
    }
    switch (userSelect) {
      case 1:
        self.imagePickerController = UIImagePickerController.new()
        self.imagePickerController.buttonName = buttonName
        self.imagePickerController.delegate = self  // 设置代理
        self.imagePickerController.sourceType = 0  // 设置图片源为相册
        // self.imagePickerController.allowsEditing = true  // 允许裁剪
        MNUtil.studyController.presentViewControllerAnimatedCompletion(self.imagePickerController,true,undefined)
        break;
      case 2:
        let UTI = ["public.image"]
        let path = await MNUtil.importFile(UTI)
        let image = MNUtil.getImage(path,1)
        toolbarConfig.setButtonImage(buttonName, image,true)
        break;
      case 3:
        MNUtil.postNotification("openInBrowser", {url:"https://zhangyu1818.github.io/appicon-forge/",beginFrame:beginFrame,endFrame:endFrame})
        break;
      case 4:
        MNUtil.postNotification("openInBrowser", {url:"https://www.iconfont.cn/",beginFrame:beginFrame,endFrame:endFrame})
        break;
      default:
        break;
    }
    // MNUtil.copy(userSelect)
  },
  copyActionURL:function (actionKey) {
    Menu.dismissCurrentMenu()
    let url = "marginnote4app://addon/mntoolbar?action="+actionKey
    MNUtil.copy(url)
    MNUtil.showHUD("✅ Action URL copied to clipboard")
  },
  shareActionURL:function (actionKey) {
    Menu.dismissCurrentMenu()
    let des = toolbarConfig.getDescriptionById(actionKey)
    // MNUtil.copy(des)
    let url = "marginnote4app://addon/mntoolbar?config="+encodeURIComponent(JSON.stringify(des))
    MNUtil.copy(url)
    MNUtil.showHUD("✅ Share URL copied to clipboard")
    // MNUtil.shareText(url, "Share "+des.name+" config")
    // let shareText = "Share "+buttonName+" config"
  },
  changeIconFromPhoto:function (buttonName) {
    self.checkPopoverController()
    if (toolbarUtils.checkSubscribe(true)) {
      self.checkPopoverController()
      self.imagePickerController = UIImagePickerController.new()
      self.imagePickerController.buttonName = buttonName
      self.imagePickerController.delegate = self  // 设置代理
      self.imagePickerController.sourceType = 0  // 设置图片源为相册
      // self.imagePickerController.allowsEditing = true  // 允许裁剪
      MNUtil.studyController.presentViewControllerAnimatedCompletion(self.imagePickerController,true,undefined)
    }
  },
  changeIconFromFile:async function (buttonName) {
    self.checkPopoverController()
    if (toolbarUtils.checkSubscribe(true)) {
      self.checkPopoverController()
      let UTI = ["public.image"]
      let path = await MNUtil.importFile(UTI)
      let image = MNUtil.getImage(path,1)
      toolbarConfig.setButtonImage(buttonName, image,true)
    }
  },
  changeIconFromWeb: function (url) {
    self.checkPopoverController()
    if (toolbarUtils.checkSubscribe(false)) {
      let beginFrame = self.view.frame
      let endFrame = self.view.frame
      if (endFrame.width < 800) {
        endFrame.width = 800
      }
      if (endFrame.height < 600) {
        endFrame.height = 600
      }
      MNUtil.postNotification("openInBrowser", {url:url,beginFrame:beginFrame,endFrame:endFrame})
    }
  }, 
  changeIconScale:async function (buttonName) {
    self.checkPopoverController()
    let res = await MNUtil.input("Custom scale","自定义图片缩放比例",["cancel","1","2","3","confirm"])
    if (res.button === 0) {
      MNUtil.showHUD("Cancel")
      return
    }
    let scale = 1
    switch (res.button) {
      case 1:
        scale = 1
        toolbarConfig.imageScale[buttonName].scale = 1
        break;
      case 2:
        scale = 2
        toolbarConfig.imageScale[buttonName].scale = 2
        break;
      case 3:
        scale = 3
        toolbarConfig.imageScale[buttonName].scale = 3
        break;
      default:
        break;
    }
    if (res.button === 4 && res.input.trim()) {
      scale = parseFloat(res.input.trim())
      toolbarConfig.imageScale[buttonName].scale = scale
    }
    let image = toolbarConfig.imageConfigs[buttonName]
    toolbarConfig.imageConfigs[buttonName] = UIImage.imageWithDataScale(image.pngData(), scale)
    MNUtil.postNotification("refreshToolbarButton", {})
  },
  resetIcon:function (buttonName) {
    try {
    Menu.dismissCurrentMenu()
    self.checkPopoverController()
      

    // let filePath = toolbarConfig.imageScale[buttonName].path
    toolbarConfig.imageScale[buttonName] = undefined
    toolbarConfig.save("MNToolbar_imageScale")
    toolbarConfig.imageConfigs[buttonName] = MNUtil.getImage(toolbarConfig.mainPath+"/"+toolbarConfig.getAction(buttonName).image+".png")
    MNUtil.postNotification("refreshToolbarButton", {})
    MNUtil.showHUD("Reset button image")
    // if (MNUtil.isfileExists(toolbarConfig.buttonImageFolder+"/"+filePath)) {
    //   NSFileManager.defaultManager().removeItemAtPath(toolbarConfig.buttonImageFolder+"/"+filePath)
    // }
    } catch (error) {
      toolbarUtils.addErrorLog(error, "resetIcon")
    }
  },
  imagePickerControllerDidFinishPickingMediaWithInfo:async function (ImagePickerController,info) {
    try {
      
    let image = info.UIImagePickerControllerOriginalImage
    MNUtil.studyController.dismissViewControllerAnimatedCompletion(true,undefined)
    toolbarConfig.setButtonImage(ImagePickerController.buttonName, image,true)
    } catch (error) {
      MNUtil.showHUD(error)
    }
  },
  imagePickerControllerDidCancel:function (params) {
    MNUtil.studyController.dismissViewControllerAnimatedCompletion(true,undefined)
    
  },
  toggleAddonLogo:function (button) {
    if (toolbarUtils.checkSubscribe(true)) {
      let addonName = button.addon
      toolbarConfig.addonLogos[addonName] = !toolbarConfig.checkLogoStatus(addonName)
      button.setTitleForState(addonName+": "+(toolbarConfig.checkLogoStatus(addonName)?"✅":"❌"),0)
      MNButton.setColor(button, toolbarConfig.checkLogoStatus(addonName)?"#457bd3":"#9bb2d6",0.8)
      toolbarConfig.save("MNToolbar_addonLogos")
      MNUtil.refreshAddonCommands()
    }
  },
  chooseOption: async function (button) {
    let self = getSettingController()
    let selected = self.selectedItem
    if (!toolbarConfig.checkCouldSave(selected)) {
      return
    }
    self.showHUD("Checking options...",0.5)
    let menu = new Menu(button,self)
    menu.width = 300
    menu.rowHeight = 35
    menu.preferredPosition = 0
    let input = await self.getWebviewContent()
    let des = JSON.parse(input)
    // let des = toolbarConfig.getDescriptionById(selected)
    let actionName = des.action
    let menuItems = toolbarUtils.getActionOptions(actionName)
    // if ("onFinish" in des) {
    //   let menuItemsForOnFinish = toolbarUtils.getActionOptions(des.onFinish.action,"onFinish.")
    //   menuItems = menuItems.concat(menuItemsForOnFinish)
    // }
    // if ("onLongPress" in des) {
    //   let menuItemsForOnLongPress = toolbarUtils.getActionOptions(des.onLongPress.action,"onLongPress.")
    //   menuItems = menuItems.concat(menuItemsForOnLongPress)
    // }
    let width = []
    if (menuItems.length > 0) {
      let currentKeys = Object.keys(des)
      menuItems = menuItems.filter(item=>!currentKeys.includes(item))
      if (menuItems.length > 0) {
        // MNUtil.copy(currentKeys)
        menuItems.forEach(item=>{
          menu.addMenuItem("🔘  "+item,"addOption:",item)
          width.push(toolbarUtils.strCode("🔘  "+item))
        })
        menu.width = Math.max(...width)*9+30
        menu.show()
        return
      }
    }
    self.showHUD("No options")
  },
  addOption:async function (item) {
    Menu.dismissCurrentMenu()
    let input = await self.getWebviewContent()
    let config = JSON.parse(input)
    switch (item) {
      case "onLongPress":
        config.onLongPress = {action:""}
        break;
      case "onFinish":
        config.onFinish = {action:""}
        break;
      case "markdown":
      case "compression":
      case "followParentColor":
      case "multi":
      case "allowDeleteNote":
      case "followAutoStyle":
      case "forceToFocus":
      case "textFirst":
      case "focusInFloatWindowForAllDocMode":
      case "mainMindMap":
      case "ocr":
      case "asTitle":
        config[item] = true
        break;
      default:
        config[item] = ""
        break;
    }
    self.updateWebviewContent(config)
  },
  saveButtonColor:function (button) {
    if (!toolbarUtils.checkSubscribe(true)) {
      return
    }
    let color = self.hexInput.text
    let varColors = ["defaultBookPageColor","defaultHighlightBlendColor","defaultDisableColor","defaultTextColor","defaultNotebookColor","defaultTintColor","defaultTintColorForSelected","defaultTintColorForDarkBackground"]
    if (varColors.includes(color) || toolbarUtils.isHexColor(color)) {
      toolbarConfig.buttonConfig.color = color
      toolbarConfig.save("MNToolbar_buttonConfig")
      self.toolbarController.setToolbarButton()
      MNUtil.showHUD("Save color: "+color)
    }else{
      MNUtil.showHUD("Invalid hex color")
    }
  },
  toggleICloudSync:async function () {
    if (!toolbarUtils.checkSubscribe(false,true,true)) {//不可以使用免费额度,且未订阅下会提醒
      return
    }
    let iCloudSync = (self.iCloudButton.currentTitle === "iCloud Sync ✅")
    if (iCloudSync) {
      toolbarConfig.syncConfig.iCloudSync = !iCloudSync
      self.iCloudButton.setTitleForState("iCloud Sync "+(toolbarConfig.syncConfig.iCloudSync? "✅":"❌"),0)
      MNButton.setColor(self.iCloudButton, toolbarConfig.syncConfig.iCloudSync?"#457bd3":"#9bb2d6",0.8)
      toolbarConfig.save("MNToolbar_syncConfig",undefined,false)
    }else{
      let direction = await MNUtil.userSelect("MN Toolbar\nChoose action / 请选择操作", "❗️Back up the configuration before proceeding.\n❗️建议在操作前先备份配置", ["📥 Import / 导入","📤 Export / 导出"])
      switch (direction) {
        case 0:
          //cancel
          return;
        case 2:
          toolbarConfig.writeCloudConfig(true,true)
          MNUtil.showHUD("Export to iCloud")
          //export
          break;
        case 1:
          toolbarConfig.readCloudConfig(true,false,true)
          MNUtil.showHUD("Import from iCloud")
          let allActions = toolbarConfig.getAllActions()
          self.setButtonText(allActions,self.selectedItem)
          if (self.toolbarController) {
            self.toolbarController.setToolbarButton(allActions)
          }else{
            MNUtil.showHUD("No toolbarController")
          }
          MNUtil.postNotification("refreshView",{})
          //import
          break;
        default:
          break;
      }
      toolbarConfig.syncConfig.iCloudSync = true
      self.iCloudButton.setTitleForState("iCloud Sync ✅",0)
      MNButton.setColor(self.iCloudButton, "#457bd3",0.8)
      toolbarConfig.save("MNToolbar_syncConfig")
    }
  },
  exportConfigTapped:function(button){
    var commandTable = [
      {title:'☁️   to iCloud', object:self, selector:'exportConfig:', param:"iCloud"},
      {title:'📋   to Clipboard', object:self, selector:'exportConfig:', param:"clipboard"},
      {title:'📝   to CurrentNote', object:self, selector:'exportConfig:', param:"currentNote"},
      {title:'📁   to File', object:self, selector:'exportConfig:', param:"file"},
    ];
    self.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,250,2)
  },
  exportConfig:function(param){
    self.checkPopoverController()
    if (!toolbarUtils.checkSubscribe(true)) {
      return
    }
    let allConfig = toolbarConfig.getAllConfig()
    switch (param) {
      case "iCloud":
        toolbarConfig.writeCloudConfig(true,true)
        break;
      case "clipborad":
        MNUtil.copyJSON(allConfig)
        break;
      case "currentNote":
        let focusNote = MNNote.getFocusNote()
        if(focusNote){
          MNUtil.undoGrouping(()=>{
            focusNote.noteTitle = "MNToolbar_Config"
            focusNote.excerptText = "```JSON\n"+JSON.stringify(allConfig,null,2)+"\n```"
            focusNote.excerptTextMarkdown = true
          })
        }else{
          MNUtil.showHUD("Invalid note")
        }
        break;
      case "file":
        MNUtil.writeJSON(toolbarConfig.mainPath+"/toolbar_config.json",allConfig)
        MNUtil.saveFile(toolbarConfig.mainPath+"/toolbar_config.json",["public.json"])
        break;
      default:
        break;
    }
  },
  importConfigTapped:function(button){
    var commandTable = [
      {title:'☁️   from iCloud',object:self,selector:'importConfig:',param:"iCloud"},
      {title:'📋   from Clipborad',object:self,selector:'importConfig:',param:"clipborad"},
      {title:'📝   from CurrentNote',object:self,selector:'importConfig:',param:"currentNote"},
      {title:'📁   from File',object:self,selector:'importConfig:',param:"file"},
    ]
    self.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,250,2)
  },
  importConfig:async function(param){
    self.checkPopoverController()
    if (!toolbarUtils.checkSubscribe(true)) {//检查订阅,可以使用免费额度
      return
    }
    // MNUtil.showHUD(param)
    let config = undefined
    switch (param) {
      case "iCloud":
        toolbarConfig.readCloudConfig(true,false,true)
        let allActions = toolbarConfig.getAllActions()
        // MNUtil.copyJSON(allActions)
        self.setButtonText(allActions,self.selectedItem)
        // self.addonController.view.hidden = true
        if (self.toolbarController) {
          self.toolbarController.setFrame(toolbarConfig.getWindowState("frame"))
          self.toolbarController.setToolbarButton(allActions)
        }else{
          MNUtil.showHUD("No addonController")
        }
        toolbarConfig.save()
        MNUtil.postNotification("refreshView",{})
        return;
      case "clipborad":
        if(MNUtil){
          config = JSON.parse(MNUtil.clipboardText)
        }
        break;
      case "currentNote":
        let focusNote = MNNote.getFocusNote()
        if(focusNote && focusNote.noteTitle == "MNToolbar_Config"){
          config = toolbarUtils.extractJSONFromMarkdown(focusNote.excerptText)
          // config = focusNote.excerptText
          // MNUtil.copy(config)
        }else{
          MNUtil.showHUD("Invalid note")
        }
        break;
      case "file":
        let path = await MNUtil.importFile(["public.json"])
        config = MNUtil.readJSON(path)
        break;
      default:
        break;
    }
    toolbarConfig.importConfig(config)
    let allActions = toolbarConfig.getAllActions()
    // MNUtil.copyJSON(allActions)
    self.setButtonText(allActions,self.selectedItem)
    // self.addonController.view.hidden = true
    if (self.toolbarController) {
      self.toolbarController.setFrame(toolbarConfig.getWindowState("frame"))
      self.toolbarController.setToolbarButton(allActions)
    }else{
      MNUtil.showHUD("No addonController")
    }
    toolbarConfig.save()
    MNUtil.postNotification("refreshView",{})
    // MNUtil.copyJSON(config)
  },
  changeToolbarDirection:async function (button) {
    let self = getSettingController()
    var commandTable = []
    let selector = "toggleToolbarDirection:"
    if (toolbarConfig.vertical()) {
      commandTable.push(self.tableItem('🛠️  Toolbar Direction: ↕️ Vertical', selector,"fixed"))
    }else{
      commandTable.push(self.tableItem('🛠️  Toolbar Direction: ↔️ Horizontal', selector,"fixed"))
    }
    if (toolbarConfig.vertical(true)) {
      commandTable.push(self.tableItem('🌟  Dynamic Direction: ↕️ Vertical', selector,"dynamic"))
    }else{
      commandTable.push(self.tableItem('🌟  Dynamic Direction: ↔️ Horizontal', selector,"dynamic"))
    }
    self.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,300,2)
  },
  toggleToolbarDirection:function (source) {
    self.checkPopoverController()
    toolbarConfig.toggleToolbarDirection(source)
  },
  toggleDynamicOrder:function (params) {
    if (!toolbarUtils.checkSubscribe(true)) {
      return
    }
    let dynamicOrder = toolbarConfig.getWindowState("dynamicOrder")
    toolbarConfig.windowState.dynamicOrder = !dynamicOrder
    MNButton.setTitle(self.dynamicOrderButton, "Enable Dynamic Order: "+(toolbarConfig.getWindowState("dynamicOrder")?"✅":"❌"),undefined,true)
    toolbarConfig.save("MNToolbar_windowState")
    MNUtil.postNotification("refreshToolbarButton",{})
  }
});
settingController.prototype.init = function () {
  this.custom = false;
  this.customMode = "None"
  this.selectedText = '';
  this.searchedText = '';
}


settingController.prototype.changeButtonOpacity = function(opacity) {
    this.moveButton.layer.opacity = opacity
    this.maxButton.layer.opacity = opacity
    // this.closeButton.layer.opacity = opacity
}
settingController.prototype.setButtonLayout = function (button,targetAction) {
    button.autoresizingMask = (1 << 0 | 1 << 3);
    button.setTitleColorForState(UIColor.whiteColor(),0);
    button.setTitleColorForState(toolbarConfig.highlightColor, 1);
    MNButton.setColor(button, "#9bb2d6", 0.8)
    button.layer.cornerRadius = 8;
    button.layer.masksToBounds = true;
    if (targetAction) {
      button.addTargetActionForControlEvents(this, targetAction, 1 << 6);
    }
    this.view.addSubview(button);
}


settingController.prototype.createButton = function (buttonName,targetAction,superview) {
    this[buttonName] = UIButton.buttonWithType(0);
    this[buttonName].autoresizingMask = (1 << 0 | 1 << 3);
    this[buttonName].setTitleColorForState(UIColor.whiteColor(),0);
    this[buttonName].setTitleColorForState(toolbarConfig.highlightColor, 1);
    MNButton.setColor(this[buttonName], "#9bb2d6", 0.8)
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

settingController.prototype.createSwitch = function (switchName,targetAction,superview) {
    this[switchName] = UISwitch.new()
    this.popupEditView.addSubview(this[switchName])
    this[switchName].on = false
    this[switchName].hidden = false
    if (targetAction) {
      this[switchName].addTargetActionForControlEvents(this, targetAction, 1 << 12);
    }
    if (superview) {
      this[superview].addSubview(this[switchName])
    }else{
      this.view.addSubview(this[switchName]);
    }
}

settingController.prototype.createScrollView = function (scrollName,superview) {
  this[scrollName] = UIScrollView.new()
  this[scrollName].hidden = false
  this[scrollName].autoresizingMask = (1 << 1 | 1 << 4);
  this[scrollName].delegate = this
  this[scrollName].bounces = true
  this[scrollName].alwaysBounceVertical = true
  this[scrollName].layer.cornerRadius = 8
  this[scrollName].backgroundColor = MNUtil.hexColorAlpha("#c0bfbf",0.8)
  if (superview) {
    this[superview].addSubview(this[scrollName])
  }else{
    this.view.addSubview(this[scrollName]);
  }
}

settingController.prototype.settingViewLayout = function (){
    let viewFrame = this.view.bounds
    let width = viewFrame.width
    let height = viewFrame.height
    Frame.set(this.maxButton,width*0.5+80,0)
    Frame.set(this.moveButton,width*0.5-75, 0)
    Frame.set(this.settingView,0,55,width,height-55)
    Frame.set(this.configView,0,0,width-2,height-60)
    Frame.set(this.advanceView,0,0,width-2,height-60)
    Frame.set(this.popupEditView,0,0,width-2,height-60)
    Frame.set(this.resizeButton,width-25,height-80)
    if (width < 650) {
      Frame.set(this.webviewInput, 5, 195, width-10, height-255)
      Frame.set(this.titleInput,5,155,width-122,35)
      Frame.set(this.saveButton,width-112,155)
      Frame.set(this.templateButton,width-188,199.5)
      Frame.set(this.runButton,width-42,155)
      Frame.set(this.addOptionButton,width-35,199.5)
      Frame.set(this.copyButton,width-158,199.5)
      Frame.set(this.pasteButton,width-99,199.5)
      Frame.set(this.scrollview,5,5,width-48,145)
      // this.scrollview.contentSize = {width:width-20,height:height};
      Frame.set(this.moveTopButton, width-38, 5)
      Frame.set(this.moveUpButton, width-38, 43)
      Frame.set(this.moveDownButton, width-38, 80)
      Frame.set(this.configReset, width-38, 117)
    }else{
      Frame.set(this.webviewInput,305,45,width-310,height-105)
      Frame.set(this.titleInput,305,5,width-422,35)
      Frame.set(this.saveButton,width-112,5)
      Frame.set(this.templateButton,width-188,49.5)
      Frame.set(this.runButton,width-42,5)
      Frame.set(this.addOptionButton,width-35,49.5)
      Frame.set(this.copyButton,width-158,49.5)
      Frame.set(this.pasteButton,width-99,49.5)
      Frame.set(this.scrollview,5,5,295,height-65)
      // this.scrollview.contentSize = {width:295,height:height};
      Frame.set(this.moveTopButton, 261, 14)
      Frame.set(this.moveUpButton, 261, 51)
      Frame.set(this.moveDownButton, 261, 88)
      Frame.set(this.configReset, 261, 125)
    }


    let settingFrame = this.settingView.bounds
    settingFrame.x = 0
    settingFrame.y = 15
    settingFrame.height = 40
    settingFrame.width = settingFrame.width
    this.tabView.frame = settingFrame
    Frame.set(this.configButton, 5, 5)
    Frame.set(this.dynamicButton, this.configButton.frame.x + this.configButton.frame.width+5, 5)
    Frame.set(this.popupButton, this.dynamicButton.frame.x + this.dynamicButton.frame.width+5, 5)
    Frame.set(this.advancedButton, this.popupButton.frame.x + this.popupButton.frame.width+5, 5)
    Frame.set(this.closeButton, width-35, 5)
    let scrollHeight = 5
    if (MNUtil.appVersion().type === "macOS") {
      for (let i = 0; i < toolbarConfig.allPopupButtons.length; i++) {
        let replaceButtonName = "replacePopupButton_"+toolbarConfig.allPopupButtons[i]
        let replaceSwtichName = "replacePopupSwtich_"+toolbarConfig.allPopupButtons[i]
        Frame.set(this[replaceButtonName], 5, 5+i*40, width-10)
        Frame.set(this[replaceSwtichName], width-33, 5+i*40)
        scrollHeight = (i+1)*40+5
      }
    }else{
      for (let i = 0; i < toolbarConfig.allPopupButtons.length; i++) {
        let replaceButtonName = "replacePopupButton_"+toolbarConfig.allPopupButtons[i]
        let replaceSwtichName = "replacePopupSwtich_"+toolbarConfig.allPopupButtons[i]
        Frame.set(this[replaceButtonName], 5, 5+i*40, width-65)
        Frame.set(this[replaceSwtichName], width-55, 6.5+i*40)
        scrollHeight = (i+1)*40+5
      }
    }
    Frame.set(this.popupScroll, 0, 0, width, height-55)
    this.popupScroll.contentSize = {width:width,height:scrollHeight}
    Frame.set(this.editorButton, 5, 5, (width-15)/2,35)
    Frame.set(this.chatAIButton, 10+(width-15)/2, 5, (width-15)/2,35)
    Frame.set(this.snipasteButton, 5, 45, (width-15)/2,35)
    Frame.set(this.autoStyleButton, 10+(width-15)/2, 45, (width-15)/2,35)
    Frame.set(this.browserButton, 5, 85, (width-15)/2,35)
    Frame.set(this.OCRButton, 10+(width-15)/2, 85, (width-15)/2,35)
    Frame.set(this.timerButton, 5, 125, (width-15)/2,35)
    Frame.set(this.hexInput, 5, 165, width-135,35)
    Frame.set(this.hexButton, width-125, 165, 120,35)
    Frame.set(this.iCloudButton, 5, 205, 160,35)
    Frame.set(this.directionButton, 5, 245, width-10,35)
    Frame.set(this.dynamicOrderButton, 5, 285, width-10,35)
    Frame.set(this.exportButton, 170, 205, (width-180)/2,35)
    Frame.set(this.importButton, 175+(width-180)/2, 205, (width-180)/2,35)
}


/**
 * @this {settingController}
 */
settingController.prototype.createSettingView = function (){
try {
  

  this.creatView("settingView","view","#ffffff",0.8)
  this.settingView.hidden = true
  // this.settingView.layer.opacity = 0.8
  this.creatView("tabView","view","#9bb2d6",0.0)
  this.creatView("configView","settingView","#9bb2d6",0.0)

  this.creatView("popupEditView","settingView","#9bb2d6",0.0)
  this.popupEditView.hidden = true
  this.createScrollView("popupScroll", "popupEditView")
  this.popupScroll.layer.backgroundColor = MNUtil.hexColorAlpha("#c0bfbf",0.0)

  this.creatView("advanceView","settingView","#9bb2d6",0.0)
  this.advanceView.hidden = true


  this.createButton("configButton","configButtonTapped:","tabView")
  MNButton.setConfig(this.configButton, {color:"#457bd3",alpha:0.9,opacity:1.0,title:"Buttons",font:17,radius:10,bold:true})
  this.configButton.width = this.configButton.sizeThatFits({width:150,height:30}).width+15
  this.configButton.height = 30
  this.configButton.selected = true

  this.createButton("dynamicButton","dynamicButtonTapped:","tabView")
  MNButton.setConfig(this.dynamicButton, {alpha:0.9,opacity:1.0,title:"Dynamic",font:17,radius:10,bold:true})
  this.dynamicButton.width = this.dynamicButton.sizeThatFits({width:150,height:30}).width+15
  this.dynamicButton.height = 30
  this.dynamicButton.selected = false

  this.createButton("popupButton","popupButtonTapped:","tabView")
  MNButton.setConfig(this.popupButton, {alpha:0.9,opacity:1.0,title:"Popup",font:17,radius:10,bold:true})
  this.popupButton.width = this.popupButton.sizeThatFits({width:150,height:30}).width+15
  this.popupButton.height = 30
  this.popupButton.selected = false

  this.createButton("advancedButton","advancedButtonTapped:","tabView")
  MNButton.setConfig(this.advancedButton, {alpha:0.9,opacity:1.0,title:"More",font:17,radius:10,bold:true})
  this.advancedButton.width = this.advancedButton.sizeThatFits({width:150,height:30}).width+15
  this.advancedButton.height = 30
  this.advancedButton.selected = false

  this.createButton("closeButton","closeButtonTapped:","tabView")
  MNButton.setConfig(this.closeButton, {color:"#e06c75",alpha:0.9,opacity:1.0,radius:10,bold:true})
  MNButton.setImage(this.closeButton, MNUtil.getImage(toolbarConfig.mainPath+"/stop.png"))
  this.closeButton.width = 30
  this.closeButton.height = 30

  // this.createButton("editorButton","toggleAddonLogo:","advanceView")
  try {
    toolbarConfig.allPopupButtons.forEach(buttonName=>{
      let replaceButtonName = "replacePopupButton_"+buttonName
      let replaceSwtichName = "replacePopupSwtich_"+buttonName
      this.createButton(replaceButtonName,"changePopupReplace:","popupScroll")
      let replaceButton = this[replaceButtonName]
      replaceButton.height = 35
      replaceButton.id = buttonName
      let target = toolbarConfig.getPopupConfig(buttonName).target
      if (target) {
        let actionName = toolbarConfig.getAction(toolbarConfig.getPopupConfig(buttonName).target).name
        MNButton.setConfig(replaceButton, {color:"#558fed",alpha:0.9,opacity:1.0,title:buttonName+": "+actionName,font:17,radius:10,bold:true})
      }else{
        MNButton.setConfig(replaceButton, {color:"#558fed",alpha:0.9,opacity:1.0,title:buttonName+": ",font:17,radius:10,bold:true})
      }
      this.createSwitch(replaceSwtichName, "togglePopupReplace:", "popupScroll")
      let replaceSwtich = this[replaceSwtichName]
      replaceSwtich.id = buttonName
      replaceSwtich.on = toolbarConfig.getPopupConfig(buttonName).enabled
      replaceSwtich.hidden = false
      replaceSwtich.width = 20
      replaceSwtich.height = 35
    })
  } catch (error) {
    // toolbarUtils.addErrorLog(error, "replacePopupEditSwtich")
  }

  this.createButton("editorButton","toggleAddonLogo:","advanceView")
  this.editorButton.layer.opacity = 1.0
  this.editorButton.addon = "MNEditor"
  this.editorButton.setTitleForState("MNEditor: "+(toolbarConfig.checkLogoStatus("MNEditor")?"✅":"❌"),0)
  this.editorButton.titleLabel.font = UIFont.boldSystemFontOfSize(16)
  MNButton.setColor(this.editorButton, toolbarConfig.checkLogoStatus("MNEditor")?"#457bd3":"#9bb2d6",0.8)

  this.createButton("chatAIButton","toggleAddonLogo:","advanceView")
  this.chatAIButton.layer.opacity = 1.0
  this.chatAIButton.addon = "MNChatAI"
  this.chatAIButton.setTitleForState("MNChatAI: "+(toolbarConfig.checkLogoStatus("MNChatAI")?"✅":"❌"),0)
  this.chatAIButton.titleLabel.font = UIFont.boldSystemFontOfSize(16)
  MNButton.setColor(this.chatAIButton, toolbarConfig.checkLogoStatus("MNChatAI")?"#457bd3":"#9bb2d6",0.8)

  this.createButton("snipasteButton","toggleAddonLogo:","advanceView")
  this.snipasteButton.layer.opacity = 1.0
  this.snipasteButton.addon = "MNSnipaste"
  this.snipasteButton.setTitleForState("MNSnipaste: "+(toolbarConfig.checkLogoStatus("MNSnipaste")?"✅":"❌"),0)
  this.snipasteButton.titleLabel.font = UIFont.boldSystemFontOfSize(16)
  MNButton.setColor(this.snipasteButton, toolbarConfig.checkLogoStatus("MNSnipaste")?"#457bd3":"#9bb2d6",0.8)

  this.createButton("autoStyleButton","toggleAddonLogo:","advanceView")
  this.autoStyleButton.layer.opacity = 1.0
  this.autoStyleButton.addon = "MNAutoStyle"
  this.autoStyleButton.setTitleForState("MNAutoStyle: "+(toolbarConfig.checkLogoStatus("MNAutoStyle")?"✅":"❌"),0)
  this.autoStyleButton.titleLabel.font = UIFont.boldSystemFontOfSize(16)
  MNButton.setColor(this.autoStyleButton, toolbarConfig.checkLogoStatus("MNAutoStyle")?"#457bd3":"#9bb2d6",0.8)
  
  this.createButton("browserButton","toggleAddonLogo:","advanceView")
  this.browserButton.layer.opacity = 1.0
  this.browserButton.addon = "MNBrowser"
  this.browserButton.setTitleForState("MNBrowser: "+(toolbarConfig.checkLogoStatus("MNBrowser")?"✅":"❌"),0)
  this.browserButton.titleLabel.font = UIFont.boldSystemFontOfSize(16)
  MNButton.setColor(this.browserButton, toolbarConfig.checkLogoStatus("MNBrowser")?"#457bd3":"#9bb2d6",0.8)

  this.createButton("OCRButton","toggleAddonLogo:","advanceView")
  this.OCRButton.layer.opacity = 1.0
  this.OCRButton.addon = "MNOCR"
  this.OCRButton.setTitleForState("MNOCR: "+(toolbarConfig.checkLogoStatus("MNOCR")?"✅":"❌"),0)
  this.OCRButton.titleLabel.font = UIFont.boldSystemFontOfSize(16)
  MNButton.setColor(this.OCRButton, toolbarConfig.checkLogoStatus("MNOCR")?"#457bd3":"#9bb2d6",0.8)

  this.createButton("timerButton","toggleAddonLogo:","advanceView")
  this.timerButton.layer.opacity = 1.0
  this.timerButton.addon = "MNTimer"
  this.timerButton.setTitleForState("MNTimer: "+(toolbarConfig.checkLogoStatus("MNTimer")?"✅":"❌"),0)
  this.timerButton.titleLabel.font = UIFont.boldSystemFontOfSize(16)
  MNButton.setColor(this.timerButton, toolbarConfig.checkLogoStatus("MNTimer")?"#457bd3":"#9bb2d6",0.8)

  this.creatTextView("hexInput","advanceView","#9bb2d6")
  this.createButton("hexButton","saveButtonColor:","advanceView")
  this.hexButton.layer.opacity = 1.0
  this.hexButton.addon = "MNOCR"
  this.hexButton.setTitleForState("Save Color",0)
  this.hexButton.titleLabel.font = UIFont.boldSystemFontOfSize(16)
  this.hexInput.text = toolbarConfig.buttonConfig.color
  MNButton.setColor(this.hexButton, toolbarConfig.checkLogoStatus("MNOCR")?"#457bd3":"#9bb2d6",0.8)

  this.createButton("iCloudButton","toggleICloudSync:","advanceView")
  let iCloudSync = toolbarConfig.iCloudSync
  
  MNButton.setColor(this.iCloudButton, iCloudSync?"#457bd3":"#9bb2d6",0.8)
  MNButton.setTitle(this.iCloudButton, "iCloud Sync "+(iCloudSync? "✅":"❌"),undefined, true)

  this.createButton("exportButton","exportConfigTapped:","advanceView")
  MNButton.setTitle(this.exportButton, "Export",undefined, true)
  MNButton.setColor(this.exportButton, "#457bd3",0.8)

  this.createButton("importButton","importConfigTapped:","advanceView")
  MNButton.setColor(this.importButton, "#457bd3",0.8)
  MNButton.setTitle(this.importButton, "Import",undefined, true)

  this.createButton("directionButton","changeToolbarDirection:","advanceView")
  MNButton.setColor(this.directionButton, "#457bd3",0.8)
  MNButton.setTitle(this.directionButton, "Toolbar Direction",undefined, true)

  this.createButton("dynamicOrderButton","toggleDynamicOrder:","advanceView")
  MNButton.setColor(this.dynamicOrderButton, "#457bd3",0.8)
  MNButton.setTitle(this.dynamicOrderButton, "Enable Dynamic Order: "+(toolbarConfig.getWindowState("dynamicOrder")?"✅":"❌"),undefined,true)

  this.createScrollView("scrollview", "configView")
  // this.scrollview = UIScrollView.new()
  // this.configView.addSubview(this.scrollview)
  // this.scrollview.hidden = false
  // this.scrollview.delegate = this
  // this.scrollview.bounces = true
  // this.scrollview.alwaysBounceVertical = true
  // this.scrollview.layer.cornerRadius = 8
  // this.scrollview.backgroundColor = MNUtil.hexColorAlpha("#c0bfbf",0.8)

  this.createWebviewInput("configView")
  this.creatTextView("systemInput","configView")
  this.systemInput.hidden = true

  this.creatTextView("titleInput","configView","#9bb2d6")

  let text  = "{}"
  this.setWebviewContent(text)

  this.titleInput.text = text.title
  // this.titleInput.textColor = MNUtil.hexColorAlpha("#444444", 1.0)
  this.titleInput.textColor = MNUtil.hexColorAlpha("#ffffff", 1.0)
  this.titleInput.font = UIFont.boldSystemFontOfSize(16);
  this.titleInput.contentInset = {top: 0,left: 0,bottom: 0,right: 0}
  this.titleInput.textContainerInset = {top: 0,left: 0,bottom: 0,right: 0}
  this.titleInput.layer.backgroundColor = MNUtil.hexColorAlpha("#457bd3", 0.8)

  this.createButton("configReset","resetButtonTapped:","configView")
  this.configReset.layer.opacity = 1.0
  MNButton.setTitle(this.configReset, "🔄",20)
  this.configReset.width = 33
  this.configReset.height = 33

  this.createButton("moveUpButton","moveForwardTapped:","configView")
  this.moveUpButton.layer.opacity = 1.0
  MNButton.setTitle(this.moveUpButton, "🔼",20)

  this.moveUpButton.width = 33
  this.moveUpButton.height = 33

  this.createButton("moveDownButton","moveBackwardTapped:","configView")
  this.moveDownButton.layer.opacity = 1.0
  MNButton.setTitle(this.moveDownButton, "🔽",20)
  this.moveDownButton.width = 33
  this.moveDownButton.height = 33

  this.createButton("moveTopButton","moveTopTapped:","configView")
  this.moveTopButton.layer.opacity = 1.0
  MNButton.setTitle(this.moveTopButton, "🔝",20)
  this.moveTopButton.width = 33 //写入属性而不是写入frame中,作为固定参数使用,配合Frame.setLoc可以方便锁死按钮大小
  this.moveTopButton.height = 33

  this.createButton("templateButton","chooseTemplate:","configView")
  MNButton.setConfig(this.templateButton, {opacity:0.8,color:"#457bd3"})
  this.templateButton.layer.cornerRadius = 6
  this.templateButton.setImageForState(toolbarConfig.templateImage,0)
  this.templateButton.width = 26
  this.templateButton.height = 26



  this.createButton("copyButton","configCopyTapped:","configView")
  MNButton.setConfig(this.copyButton, {opacity:0.8,color:"#457bd3",title:"Copy",bold:true})
  this.copyButton.layer.cornerRadius = 6
  this.copyButton.width = 55
  this.copyButton.height = 26
  // this.copyButton.layer.opacity = 1.0
  // this.copyButton.setTitleForState("Copy",0)

  this.createButton("pasteButton","configPasteTapped:","configView")
  MNButton.setConfig(this.pasteButton, {opacity:0.8,color:"#457bd3",title:"Paste",bold:true})
  this.pasteButton.layer.cornerRadius = 6
  this.pasteButton.width = 60
  this.pasteButton.height = 26
  // this.pasteButton.layer.opacity = 1.0
  // this.pasteButton.setTitleForState("Paste",0)

  this.createButton("saveButton","configSaveTapped:","configView")
  // this.saveButton.layer.opacity = 1.0
  // this.saveButton.setTitleForState("Save",0)
  MNButton.setConfig(this.saveButton, {opacity:0.8,color:"#e06c75",title:"Save","font":18,bold:true})
  this.saveButton.width = 65
  this.saveButton.height = 35

  this.createButton("resizeButton",undefined,"settingView")
  this.resizeButton.setImageForState(toolbarConfig.curveImage,0)
  MNButton.setConfig(this.resizeButton, {cornerRadius:20,color:"#ffffff",alpha:0.})
  this.resizeButton.width = 25
  this.resizeButton.height = 25

  this.createButton("addOptionButton","chooseOption:","configView")
  MNButton.setConfig(this.addOptionButton, {opacity:0.8,color:"#457bd3",title:"➕"})
  this.addOptionButton.layer.cornerRadius = 6
  this.addOptionButton.width = 26
  this.addOptionButton.height = 26

  this.createButton("runButton","configRunTapped:","configView")
  MNButton.setConfig(this.runButton, {opacity:0.8,color:"#e06c75"})
  // this.runButton.layer.cornerRadius = 6
  // MNButton.setConfig(this.runButton, {opacity:1.0,title:"▶️",font:25,color:"#ffffff",alpha:0.})
  this.runButton.setImageForState(toolbarConfig.runImage,0)
  this.runButton.width = 35
  this.runButton.height = 35

  let color = ["#ffffb4","#ccfdc4","#b4d1fb","#f3aebe","#ffff54","#75fb4c","#55bbf9","#ea3323","#ef8733","#377e47","#173dac","#be3223","#ffffff","#dadada","#b4b4b4","#bd9fdc"]
} catch (error) {
  toolbarUtils.addErrorLog(error, "createSettingView")
}
}
/**
 * @this {settingController}
 */
settingController.prototype.setButtonText = function (names=toolbarConfig.getAllActions(),highlight=this.selectedItem) {
    this.words = names
    this.selectedItem = highlight
    names.map((word,index)=>{
      let isHighlight = (word === this.selectedItem)
      let buttonName = "nameButton"+index
      if (!this[buttonName]) {
        this.createButton(buttonName,"toggleSelected:","scrollview")
        // this[buttonName].index = index
        this[buttonName].titleLabel.font = UIFont.systemFontOfSize(16);
      }
      this[buttonName].hidden = false
      this[buttonName].id = word
      this[buttonName].isSelected =isHighlight
      MNButton.setColor(this[buttonName],isHighlight?"#9bb2d6":"#ffffff", 0.8)
      if (isHighlight) {
        this[buttonName].layer.borderWidth = 2
        this[buttonName].layer.borderColor = MNUtil.hexColorAlpha("#457bd3", 0.8)
      }else{
        this[buttonName].layer.borderWidth = 0
      }
      MNButton.setImage(this[buttonName], toolbarConfig.imageConfigs[word])
    })
    this.refreshLayout()
}

/**
 * @this {settingController}
 */
settingController.prototype.setTextview = function (actionKey = this.selectedItem) {
  try {
      // let entries           =  NSUserDefaults.standardUserDefaults().objectForKey('MNBrowser_entries');
      // let actions = toolbarConfig.actions
      // let defaultActions = toolbarConfig.getActions()
      let action = toolbarConfig.getAction(actionKey)
      // let action = (name in actions)?actions[name]:defaultActions[name]
      let text  = action.name//每个动作的title
      this.titleInput.text= text
      let des = toolbarConfig.getDescriptionById(actionKey)
      if (des) {
        this.setWebviewContent(des)
      }else{
        MNUtil.copy(action)
        MNUtil.showHUD("Invalid description")
        des = {}
        this.setWebviewContent(des)
      }
  } catch (error) {
    toolbarUtils.addErrorLog(error, "setTextview")
  }
}
/**
 * @this {settingController}
 */
settingController.prototype.refreshLayout = function () {
  if (!this.settingView) {return}
  if (!this.configView.hidden) {
    var viewFrame = this.scrollview.bounds;
    var xLeft     = 0
    let initX = 9
    let initY = 9
    let initL = 0
    let buttonWidth = 40
    let buttonHeight = 40
    this.locs = [];
    this.words.map((word,index)=>{
      // let title = word
      if (xLeft+initX+buttonWidth > viewFrame.width) {
        initX = 9
        initY = initY+50
        initL = initL+1
      }
      this["nameButton"+index].frame = {  x: xLeft+initX,  y: initY,  width: buttonWidth,  height: buttonHeight,};
      this.locs.push({
        x:xLeft+initX,
        y:initY,
        l:initL,
        i:index
      })
      initX = initX+buttonWidth+10
    })
    if (this.lastLength && this.lastLength>this.words.length) {
      for (let index = this.words.length; index < this.lastLength; index++) {
        this["nameButton"+index].hidden = true
      }
    }
    this.lastLength = this.words.length
    this.scrollview.contentSize= {width:viewFrame.width,height:initY+50}
  
  }
}

settingController.prototype.refreshView = function (name) {
  switch (name) {
    case "advanceView":
        this.editorButton.setTitleForState("MNEditor: "+(toolbarConfig.checkLogoStatus("MNEditor")?"✅":"❌"),0)
        MNButton.setColor(this.editorButton, toolbarConfig.checkLogoStatus("MNEditor")?"#457bd3":"#9bb2d6",0.8)

        this.chatAIButton.setTitleForState("MNChatAI: "+(toolbarConfig.checkLogoStatus("MNChatAI")?"✅":"❌"),0)
        MNButton.setColor(this.chatAIButton, toolbarConfig.checkLogoStatus("MNChatAI")?"#457bd3":"#9bb2d6",0.8)

        this.snipasteButton.setTitleForState("MNSnipaste: "+(toolbarConfig.checkLogoStatus("MNSnipaste")?"✅":"❌"),0)
        MNButton.setColor(this.snipasteButton, toolbarConfig.checkLogoStatus("MNSnipaste")?"#457bd3":"#9bb2d6",0.8)

        this.autoStyleButton.setTitleForState("MNAutoStyle: "+(toolbarConfig.checkLogoStatus("MNAutoStyle")?"✅":"❌"),0)
        MNButton.setColor(this.autoStyleButton, toolbarConfig.checkLogoStatus("MNAutoStyle")?"#457bd3":"#9bb2d6",0.8)

        this.browserButton.setTitleForState("MNBrowser: "+(toolbarConfig.checkLogoStatus("MNBrowser")?"✅":"❌"),0)
        MNButton.setColor(this.browserButton, toolbarConfig.checkLogoStatus("MNBrowser")?"#457bd3":"#9bb2d6",0.8)

        this.OCRButton.setTitleForState("MNOCR: "+(toolbarConfig.checkLogoStatus("MNOCR")?"✅":"❌"),0)
        MNButton.setColor(this.OCRButton, toolbarConfig.checkLogoStatus("MNOCR")?"#457bd3":"#9bb2d6",0.8)

        this.timerButton.setTitleForState("MNTimer: "+(toolbarConfig.checkLogoStatus("MNTimer")?"✅":"❌"),0)
        MNButton.setColor(this.timerButton, toolbarConfig.checkLogoStatus("MNTimer")?"#457bd3":"#9bb2d6",0.8)

        this.hexInput.text = toolbarConfig.buttonConfig.color
        MNButton.setColor(this.hexButton, "#457bd3",0.8)

        let iCloudSync = toolbarConfig.iCloudSync

        MNButton.setColor(this.iCloudButton, iCloudSync?"#457bd3":"#9bb2d6",0.8)
        MNButton.setTitle(this.iCloudButton, "iCloud Sync "+(iCloudSync? "✅":"❌"),undefined, true)
      break;
    case "popupEditView":
      toolbarConfig.allPopupButtons.forEach(buttonName=>{
        let replaceButtonName = "replacePopupButton_"+buttonName
        let replaceSwtichName = "replacePopupSwtich_"+buttonName
        let replaceButton = this[replaceButtonName]
        replaceButton.id = buttonName
        let target = toolbarConfig.getPopupConfig(buttonName).target
        if (target) {
          let actionName = toolbarConfig.getAction(toolbarConfig.getPopupConfig(buttonName).target).name
          MNButton.setConfig(replaceButton, {color:"#558fed",alpha:0.9,opacity:1.0,title:buttonName+": "+actionName,font:17,radius:10,bold:true})
        }else{
          MNButton.setConfig(replaceButton, {color:"#558fed",alpha:0.9,opacity:1.0,title:buttonName+": ",font:17,radius:10,bold:true})
        }
        let replaceSwtich = this[replaceSwtichName]
        replaceSwtich.id = buttonName
        replaceSwtich.on = toolbarConfig.getPopupConfig(buttonName).enabled
      })
    default:
      break;
  }
}

settingController.prototype.hideAllButton = function (frame) {
  this.moveButton.hidden = true
  // this.closeButton.hidden = true
  this.maxButton.hidden = true
}
settingController.prototype.showAllButton = function (frame) {
  this.moveButton.hidden = false
  // this.closeButton.hidden = false
  this.maxButton.hidden = false
}
/**
 * @this {settingController}
 */
settingController.prototype.show = function (frame) {
    try {
  MNUtil.studyView.bringSubviewToFront(this.view)
  MNUtil.studyView.bringSubviewToFront(this.addonBar)
  // let preFrame = this.currentFrame
  // let preOpacity = this.view.layer.opacity
  this.view.layer.opacity = 0.2
  this.view.hidden = false
  this.miniMode = false
  // MNUtil.showHUD("message")
  // let isEditingDynamic = self.dynamicButton?.selected ?? false
  // let allActions = toolbarConfig.getAllActions(isEditingDynamic)
  // let allActions = toolbarConfig.getAllActions()// toolbarConfig.action.concat(toolbarConfig.getDefaultActionKeys().slice(toolbarConfig.action.length))
  // this.setButtonText(allActions,this.selectedItem)
  this.toolbarController.setToolbarButton(toolbarConfig.action)
  this.hideAllButton()
  MNUtil.animate(()=>{
    this.view.layer.opacity = 1.0
  },0.2).then(()=>{
      this.view.layer.borderWidth = 0
      this.view.layer.opacity = 1.0
      this.showAllButton()
      this.settingView.hidden = false
      toolbarUtils.settingViewOpened = true
  })
    } catch (error) {
      MNUtil.showHUD(error)
    }
  // UIView.animateWithDurationAnimationsCompletion(0.2,()=>{
  //   this.view.layer.opacity = 1.0
  //   // this.view.frame = preFrame
  //   // this.currentFrame = preFrame
  // },
  // ()=>{
  //   this.view.layer.borderWidth = 0
  //   this.showAllButton()
  //   try {
      
  //   this.settingView.hidden = false
  //   } catch (error) {
  //     MNUtil.showHUD(error)
  //   }
  // })
}
settingController.prototype.hide = function (frame) {
  toolbarUtils.studyController().view.bringSubviewToFront(this.addonBar)
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
    toolbarUtils.settingViewOpened = false
  
  })
}

settingController.prototype.creatView = function (viewName,superview="view",color="#9bb2d6",alpha=0.8) {
  this[viewName] = UIView.new()
  MNButton.setColor(this[viewName], color, alpha)
  this[viewName].layer.cornerRadius = 12
  this[superview].addSubview(this[viewName])
}

settingController.prototype.creatTextView = function (viewName,superview="view",color="#c0bfbf",alpha=0.8) {
  this[viewName] = UITextView.new()
  this[viewName].font = UIFont.systemFontOfSize(15);
  this[viewName].layer.cornerRadius = 8
  MNButton.setColor(this[viewName], color, alpha)
  this[viewName].textColor = UIColor.blackColor()
  this[viewName].delegate = this
  this[viewName].bounces = true
  // this[viewName].smartQuotesType = 2
  this[superview].addSubview(this[viewName])
}

/**
 * @this {settingController}
 */
settingController.prototype.fetch = async function (url,options = {}){
  return new Promise((resolve, reject) => {
    // UIApplication.sharedApplication().networkActivityIndicatorVisible = true
    const queue = NSOperationQueue.mainQueue()
    const request = this.initRequest(url, options)
    NSURLConnection.sendAsynchronousRequestQueueCompletionHandler(
      request,
      queue,
      (res, data, err) => {
        if (err.localizedDescription) reject(err.localizedDescription)
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

settingController.prototype.initRequest = function (url,options) {
  const request = NSMutableURLRequest.requestWithURL(genNSURL(url))
  request.setHTTPMethod(options.method ?? "GET")
  request.setTimeoutInterval(options.timeout ?? 10)
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15",
    "Content-Type": "application/json",
    Accept: "application/json"
  }
  request.setAllHTTPHeaderFields({
    ...headers,
    ...(options.headers ?? {})
  })
  if (options.search) {
    request.setURL(
      genNSURL(
        `${url.trim()}?${Object.entries(options.search).reduce((acc, cur) => {
          const [key, value] = cur
          return `${acc ? acc + "&" : ""}${key}=${encodeURIComponent(value)}`
        }, "")}`
      )
    )
  } else if (options.body) {
    request.setHTTPBody(NSData.dataWithStringEncoding(options.body, 4))
  } else if (options.form) {
    request.setHTTPBody(
      NSData.dataWithStringEncoding(
        Object.entries(options.form).reduce((acc, cur) => {
          const [key, value] = cur
          return `${acc ? acc + "&" : ""}${key}=${encodeURIComponent(value)}`
        }, ""),
        4
      )
    )
  } else if (options.json) {
    request.setHTTPBody(
      NSJSONSerialization.dataWithJSONObjectOptions(
        options.json,
        1
      )
    )
  }
  return request
}
/**
 * @this {settingController}
 */
settingController.prototype.createWebviewInput = function (superView) {
  try {
  // this.webviewInput = MNUtil.createJsonEditor(this.mainPath + '/jsoneditor.html')
  this.webviewInput = new UIWebView(this.view.bounds);
  this.webviewInput.backgroundColor = MNUtil.hexColorAlpha("#c0bfbf",0.8)
  this.webviewInput.scalesPageToFit = false;
  this.webviewInput.autoresizingMask = (1 << 1 | 1 << 4);
  this.webviewInput.delegate = this;
  // this.webviewInput.setValueForKey("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15","User-Agent")
  this.webviewInput.scrollView.delegate = this;
  this.webviewInput.layer.cornerRadius = 8;
  this.webviewInput.layer.masksToBounds = true;
  this.webviewInput.layer.borderColor = MNUtil.hexColorAlpha("#9bb2d6",0.8);
  this.webviewInput.layer.borderWidth = 0
  this.webviewInput.layer.opacity = 0.85
  this.webviewInput.scrollEnabled = false
  this.webviewInput.scrollView.scrollEnabled = false
  this.webviewInput.loadFileURLAllowingReadAccessToURL(
    NSURL.fileURLWithPath(this.mainPath + '/jsoneditor.html'),
    NSURL.fileURLWithPath(this.mainPath + '/')
  );
  // this.webviewInput.loadFileURLAllowingReadAccessToURL(
  //   NSURL.fileURLWithPath(this.mainPath + '/jsoneditor.html'),
  //   NSURL.fileURLWithPath(MNUtil.mainPath + '/')
  // );
    } catch (error) {
    MNUtil.showHUD(error)
  }
  if (superView) {
    this[superView].addSubview(this.webviewInput)
  }
}
/**
 * @this {settingController}
 */
settingController.prototype.loadWebviewContent = function () {
  this.webviewInput.loadFileURLAllowingReadAccessToURL(
    NSURL.fileURLWithPath(this.mainPath + '/jsoneditor.html'),
    NSURL.fileURLWithPath(this.mainPath + '/')
  );
}
/**
 * @this {settingController}
 */
settingController.prototype.setWebviewContent = function (content) {
  if (typeof content === "object") {
    // MNUtil.copy(`setContent('${encodeURIComponent(JSON.stringify(content))}')`)
    this.runJavaScript(`setContent('${encodeURIComponent(JSON.stringify(content))}')`)
    return
  }
  if (!MNUtil.isValidJSON(content)) {
    content = "{}"
  }
  // MNUtil.copy(`setContent('${encodeURIComponent(content)}')`)
  this.runJavaScript(`setContent('${encodeURIComponent(content)}')`)
}
/**
 * @this {settingController}
 */
settingController.prototype.updateWebviewContent = function (content) {
  if (typeof content === "object") {
    this.runJavaScript(`updateContent('${encodeURIComponent(JSON.stringify(content))}')`)
    return
  }
  if (!MNUtil.isValidJSON(content)) {
    content = "{}"
  }
  this.runJavaScript(`updateContent('${encodeURIComponent(content)}')`)
}
/**
 * @this {settingController}
 */
settingController.prototype.setJSContent = function (content) {
  this.webviewInput.loadHTMLStringBaseURL(toolbarUtils.JShtml(content))
}

/**
 * @this {settingController}
 */
settingController.prototype.blur = async function () {
  this.runJavaScript(`removeFocus()`)
  this.webviewInput.endEditing(true)
}

/**
 * @this {settingController}
 */
settingController.prototype.getWebviewContent = async function () {
  // let content = await this.runJavaScript(`updateContent(); document.body.innerText`)
  let content = await this.runJavaScript(`getContent()`)
  let tem = decodeURIComponent(content)
  this.webviewInput.endEditing(true)
  return tem
}

/** @this {settingController} */
settingController.prototype.runJavaScript = async function(script) {
  // if(!this.webviewResponse || !this.webviewResponse.window)return;
  return new Promise((resolve, reject) => {
      this.webviewInput.evaluateJavaScript(script,(result) => {resolve(result)});
  })
};
/** @this {settingController} */
settingController.prototype.editorAdjustSelectWidth = function (){
  this.webviewInput.evaluateJavaScript(`adjustSelectWidth()`)
}
settingController.prototype.checkPopoverController = function () {
  if (this.popoverController) {this.popoverController.dismissPopoverAnimated(true);}
}
/**
 * 
 * @param {string} title 
 * @param {string} selector 
 * @param {any} param 
 * @param {boolean|undefined} checked 
 * @this {settingController}
 * @returns 
 */
settingController.prototype.tableItem = function (title,selector,param = "",checked = false) {
  return {title:title,object:this,selector:selector,param:param,checked:checked}
}
/**
 * 
 * @param {string} title 
 * @param {number} duration 
 * @param {UIView} view 
 */
settingController.prototype.showHUD = function (title,duration = 1.5,view = this.view) {
  MNUtil.showHUD(title,duration,view)
}
settingController.prototype.checkCouldSave = function () {
  let selected = this.selectedItem
  let res = toolbarConfig.checkCouldSave(selected)
  return res
}
/**
 * @this {settingController}
 * @param {object} config 
 */
settingController.prototype.importFromShareURL = async function (config) {
  if (!this.checkCouldSave()) {
    return
  }
  if (toolbarConfig.builtinActionKeys.includes(this.selectedItem)) {
    let oldConfig = toolbarConfig.getDescriptionById(this.selectedItem)
    // MNUtil.copy(oldConfig)
    if (oldConfig.action !== config.action) {
      MNUtil.showHUD("Only supports acton: "+oldConfig.action)
      return
    }
  }

  let confirm = await MNUtil.confirm("MN Toolbar", "Replace current config with below config\n\n将替换当前配置为下面的配置\n\n"+JSON.stringify(config,null,2))
  if (confirm) {
    this.updateWebviewContent(config)
    MNUtil.showHUD("✅ Replaced current config")
    return
  }
}
/**
 * 
 * @type {toolbarController}
 */
settingController.prototype.toolbarController