/** @return {settingController} */
const getSettingController = ()=>self

/**
 * 尖括号 = "我会做这些事"

  想象你去应聘工作：

  // 普通简历
  张三 : 程序员

  // 带技能的简历  
  张三 : 程序员 <会开车, 会做饭, 会英语>

  在代码中：

  // 普通的视图控制器
  toolbarController : UIViewController

  // 带"技能"的视图控制器
  toolbarController : UIViewController <UIImagePickerControllerDelegate,
  UINavigationControllerDelegate>

    实际例子：拍照功能

  1. 声明"我会处理照片"

  // 尖括号里声明：我会处理图片选择
  toolbarController : UIViewController <UIImagePickerControllerDelegate>

  2. 因为有这个"技能"，所以能接收照片

  // 用户选好照片后，系统会调用这个方法
  imagePickerControllerDidFinishPickingMediaWithInfo: function(picker, 
  info) {
    let image = info.UIImagePickerControllerOriginalImage  // 获取照片
    MNUtil.copyImage(image.pngData())                     // 复制到剪贴板
    MNNote.new(self.currentNoteId).paste()                 // 粘贴到笔记
  }

  // 用户取消选择时
  imagePickerControllerDidCancel: function(picker) {
    // 关闭相机/相册界面
  }

  3. 使用这个"技能"

  // 打开相机
  case "camera":
    this.imagePickerController = UIImagePickerController.new()
    this.imagePickerController.delegate = this  // 
  重要！告诉相机："选好照片后通知我"
    this.imagePickerController.sourceType = 1   // 1 = 相机
    break;

  // 打开相册  
  case "photo":
    this.imagePickerController = UIImagePickerController.new()
    this.imagePickerController.delegate = this  // 
  重要！告诉相册："选好照片后通知我"
    this.imagePickerController.sourceType = 0   // 0 = 相册
    break;

  * 为什么需要"技能认证"？

  想象如果没有这个机制：

  // ❌ 错误：相机不知道该通知谁
  相机拍完照片后：
    "照片拍好了！可是...该给谁呢？"

  // ✅ 正确：有了技能认证
  相机拍完照片后：
    "照片拍好了！我要通知那个有 UIImagePickerControllerDelegate 技能的人"
    → 调用 imagePickerControllerDidFinishPickingMediaWithInfo
 */
 
  /**
   *   UIViewController <NSURLConnectionDelegate,UIImagePickerControllerDelegate,UIWebViewDelegate> 表示 toolbarController：
  1. 是一个视图控制器（基本身份）
  2. 还会处理图片选择（UIImagePickerControllerDelegate）
  3. 还会处理导航（UINavigationControllerDelegate）
   */
var settingController = JSB.defineClass('settingController : UIViewController <NSURLConnectionDelegate,UIImagePickerControllerDelegate,UIWebViewDelegate>', {  // 继承视图控制器，能管理界面, UIViewController：像是"界面管理许可证"，有了它才能管理界面
  viewDidLoad: function() {
    let self = getSettingController()
    try {
        self.init()
        pluginDemoFrame.set(self.view,50,50,355,500)
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

    self.moveGesture = new UIPanGestureRecognizer(self,"onMoveGesture:")
    self.moveButton.addGestureRecognizer(self.moveGesture)
    self.moveGesture.view.hidden = false
    self.moveGesture.addTargetAction(self,"onMoveGesture:")

    self.resizeGesture = new UIPanGestureRecognizer(self,"onResizeGesture:")
    self.resizeButton.addGestureRecognizer(self.resizeGesture)
    self.resizeGesture.view.hidden = false
    self.resizeGesture.addTargetAction(self,"onResizeGesture:")
    // self.settingController.view.hidden = false
    // 初始化只显示buttons标签页,不考虑dynamic
    self.selectedItem = pluginDemoConfig.action[0]
    let allActions = pluginDemoConfig.action.concat(pluginDemoConfig.getDefaultActionKeys().slice(pluginDemoConfig.action.length))

    try {
      self.setButtonText(allActions,self.selectedItem)
      MNUtil.delay(0.5).then(()=>{
        self.setTextview(self.selectedItem)
      })
      self.settingView.hidden = false
    } catch (error) {  
      pluginDemoUtils.addErrorLog(error, "viewDidLoad.setButtonText", info)
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
      pluginDemoUtils.addErrorLog(error, "webViewShouldStartLoadWithRequestNavigationType")
      return false
    }
  },
  changeOpacityTo:function (opacity) {
    self.view.layer.opacity = opacity
  },
  moveTopTapped :function () {
    let self = getSettingController()
    let isEditingDynamic = self.dynamicButton.selected
    if (isEditingDynamic && !pluginDemoUtils.checkSubscribe(true)) {
      self.showHUD("Please subscribe to use this feature")
      return
    }
    let allActions = pluginDemoConfig.getAllActions(isEditingDynamic)
    pluginDemoUtils.moveElement(allActions, self.selectedItem, "top")
    self.setButtonText(allActions,self.selectedItem)
    // MNUtil.postNotification("MNToolbarRefreshLayout",{})
    // NSNotificationCenter.defaultCenter().postNotificationNameObjectUserInfo("MNToolbarRefreshLayout", self.window, {})
    if (isEditingDynamic) {
      if (self.pluginDemoController.dynamicToolbar) {
        self.pluginDemoController.dynamicToolbar.setToolbarButton(allActions)
      }
      pluginDemoConfig.dynamicAction = allActions
      pluginDemoConfig.save("MNToolbar_dynamicAction")
    }else{
      self.pluginDemoController.setToolbarButton(allActions)
      pluginDemoConfig.action = allActions
      pluginDemoConfig.save("MNToolbar_action")
    }
  },
  moveForwardTapped :function () {
    let self = getSettingController()
    try {
    let isEditingDynamic = self.dynamicButton.selected
    if (isEditingDynamic && !pluginDemoUtils.checkSubscribe(true)) {
      self.showHUD("Please subscribe to use this feature")
      return
    }
    let allActions = pluginDemoConfig.getAllActions(isEditingDynamic)
    pluginDemoUtils.moveElement(allActions, self.selectedItem, "up")
    self.setButtonText(allActions,self.selectedItem)
    if (isEditingDynamic) {
      if (self.pluginDemoController.dynamicToolbar) {
        self.pluginDemoController.dynamicToolbar.setToolbarButton(allActions)
      }
      pluginDemoConfig.dynamicAction = allActions
      pluginDemoConfig.save("MNToolbar_dynamicAction")
    }else{
      self.pluginDemoController.setToolbarButton(allActions)
      pluginDemoConfig.action = allActions
      pluginDemoConfig.save("MNToolbar_action")
    }
    } catch (error) {
      pluginDemoUtils.addErrorLog(error, "moveForwardTapped")
    }
  },
  moveBackwardTapped :function () {
    let self = getSettingController()
    try {

    let isEditingDynamic = self.dynamicButton.selected
    if (isEditingDynamic && !pluginDemoUtils.checkSubscribe(true)) {
      self.showHUD("Please subscribe to use this feature")
      return
    }
    let allActions = pluginDemoConfig.getAllActions(isEditingDynamic)
    pluginDemoUtils.moveElement(allActions, self.selectedItem, "down")-0
    self.setButtonText(allActions,self.selectedItem)
    if (isEditingDynamic) {
      if (self.pluginDemoController.dynamicToolbar) {
        self.pluginDemoController.dynamicToolbar.setToolbarButton(allActions)
      }
      pluginDemoConfig.dynamicAction = allActions
      pluginDemoConfig.save("MNToolbar_dynamicAction")
    }else{
      self.pluginDemoController.setToolbarButton(allActions)
      pluginDemoConfig.action = allActions
      pluginDemoConfig.save("MNToolbar_action")
    }
    } catch (error) {
      pluginDemoUtils.addErrorLog(error, "moveBackwardTapped")
    }
  },
  resetButtonTapped: async function (button) {
    var commandTable = [
      {title:'🔄   Reset all button configs',object:self,selector:'resetConfig:',param:"config"},
      {title:'🔄   Reset fixed button order',object:self,selector:'resetConfig:',param:"order"},
      {title:'🔄   Reset dynamic button order',object:self,selector:'resetConfig:',param:"dynamicOrder"},
      {title:'🔄   Reset all button images',object:self,selector:'resetConfig:',param:"image"},
    ]
    self.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,250,0)
  },
  resetConfig: async function (param) {
    try {
      let self = getSettingController()
      self.checkPopoverController()
      let isEditingDynamic = self.dynamicButton.selected
      switch (param) {
        case "config":
          let confirm = await MNUtil.confirm("MN Toolbar: Clear all configs?", "MN Toolbar: 清除所有配置？")
          if (confirm) {
            pluginDemoConfig.reset("config")
            // self.pluginDemoController.setToolbarButton(action,pluginDemoConfig.actions)
            // self.pluginDemoController.actions = actions
            self.setButtonText()
            self.setTextview()
            MNUtil.showHUD("Reset prompts")
          }
          break;
        case "order":
          pluginDemoConfig.reset("order")
          if (!isEditingDynamic) {
            self.setButtonText()
          }
          MNUtil.showHUD("Reset fixed order")
          break;
        case "dynamicOrder":
          pluginDemoConfig.reset("dynamicOrder")
          if (isEditingDynamic) {
            self.setButtonText()
          }
          MNUtil.showHUD("Reset dynamic order")
          break;
        case "image":
          pluginDemoConfig.imageScale = {}
          pluginDemoConfig.save("MNToolbar_imageScale")
          let keys = pluginDemoConfig.getDefaultActionKeys()
          keys.forEach((key)=>{
            pluginDemoConfig.imageConfigs[key] = MNUtil.getImage(pluginDemoConfig.mainPath+"/"+pluginDemoConfig.getAction(key).image+".png")
          })
          MNUtil.postNotification("refreshToolbarButton", {})
          MNUtil.showHUD("Reset button image")
          break
        default:
          break;
      }
    } catch (error) {
      MNUtil.showHUD("Error in resetConfig: "+error)
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
    let targetFrame = pluginDemoFrame.gen(40, 0, frame.width-80, frame.height)
    if (MNUtil.isIOS) {
      targetFrame = pluginDemoFrame.gen(0, 0, frame.width, frame.height)
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
    let allActions = pluginDemoConfig.getAllActions()
    // MNUtil.copyJSON(allActions)
    var commandTable = allActions.map(actionKey=>{
      let actionName = pluginDemoConfig.getAction(actionKey).name
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
      // MNUtil.copyJSON(pluginDemoConfig.popupConfig)
    let popupConfig = pluginDemoConfig.getPopupConfig(config.id)
    popupConfig.target = config.target
    pluginDemoConfig.popupConfig[config.id] = popupConfig
    // MNUtil.copyJSON(pluginDemoConfig.popupConfig)
    // MNUtil.showHUD("Set target: "+config.target)
    let buttonName = "replacePopupButton_"+config.id
    MNButton.setConfig(self[buttonName], {title:config.id+": "+config.name,font:17,radius:10,bold:true})
    pluginDemoConfig.save("MNToolbar_popupConfig")
    } catch (error) {
      pluginDemoUtils.addErrorLog(error, "setPopupReplace")
    }
  },
  /**
   * 
   * @param {UISwitch} button 
   */
  togglePopupReplace: function (button) {
    // MNUtil.showHUD("togglePopupReplace:"+button.id)
    let popupConfig = pluginDemoConfig.getPopupConfig(button.id)
    if (button.on) {
      popupConfig.enabled = true
    }else{
      popupConfig.enabled = false
    }
    pluginDemoConfig.popupConfig[button.id] = popupConfig
    pluginDemoConfig.save("MNToolbar_popupConfig")
  },
  onMoveGesture:function (gesture) {
    let locationToMN = gesture.locationInView(pluginDemoUtils.studyController().view)
    if (!self.locationToButton || !self.miniMode && (Date.now() - self.moveDate) > 100) {
      let translation = gesture.translationInView(pluginDemoUtils.studyController().view)
      let locationToBrowser = gesture.locationInView(self.view)
      let locationToButton = gesture.locationInView(gesture.view)
      let newY = locationToButton.y-translation.y 
      let newX = locationToButton.x-translation.x
      if (gesture.state === 1) {
        self.locationToBrowser = {x:locationToBrowser.x-translation.x,y:locationToBrowser.y-translation.y}
        self.locationToButton = {x:newX,y:newY}
      }
    }
    self.moveDate = Date.now()
    // let location = {x:locationToMN.x - self.locationToBrowser.x,y:locationToMN.y -self.locationToBrowser.y}
    let location = {x:locationToMN.x - self.locationToButton.x-gesture.view.frame.x,y:locationToMN.y -self.locationToButton.y-gesture.view.frame.y}

    let studyFrame = MNUtil.studyView.bounds
    let y = pluginDemoUtils.constrain(location.y, 0, studyFrame.height-15)
    let x = pluginDemoUtils.constrain(location.x, 0, studyFrame.width-15)
    
    if (self.custom) {
      // Application.sharedInstance().showHUD(self.custom, self.view.window, 2);
      self.customMode = "None"
      MNUtil.animate(()=>{
        pluginDemoFrame.set(self.view,x,y,self.lastFrame.width,self.lastFrame.height)
        self.currentFrame  = self.view.frame
        self.settingViewLayout()
      },0.1)
    }else{
      pluginDemoFrame.set(self.view,x,y)
      self.currentFrame  = self.view.frame
    }
    self.custom = false;
  },
  onResizeGesture:function (gesture) {
    self.custom = false;
    self.customMode = "none"
    let baseframe = gesture.view.frame
    let locationToBrowser = gesture.locationInView(self.view)
    let width = pluginDemoUtils.constrain(locationToBrowser.x+baseframe.width*0.3, 355, MNUtil.studyView.frame.width)
    let height = pluginDemoUtils.constrain(locationToBrowser.y+baseframe.height*0.3, 475, MNUtil.studyView.frame.height)
    pluginDemoFrame.setSize(self.view,width,height)
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
    let action = pluginDemoConfig.action
    self.setButtonText(action)

  },
  dynamicButtonTapped: async function (params) {
    let self = getSettingController()
    let dynamicOrder = pluginDemoConfig.getWindowState("dynamicOrder")
    if (!dynamicOrder) {
      self.showHUD("Enable Dynamic Order first")
      return
    }
    let dynamicAction = pluginDemoConfig.dynamicAction
    if (dynamicAction.length === 0) {
      pluginDemoConfig.dynamicAction = pluginDemoConfig.action
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
    let buttonX = pluginDemoUtils.getButtonFrame(button).x//转化成相对于studyview的
    let selected = self.selectedItem
    let templateNames = pluginDemoUtils.getTempelateNames(selected)
    if (!templateNames) {
      return
    }
    var templates = pluginDemoUtils.template
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
    if (!pluginDemoConfig.checkCouldSave(selected)) {
      return
    }
    try {
    let input = await self.getWebviewContent()
    MNUtil.copy(input)
    MNUtil.showHUD("Copy config")
    } catch (error) {
      pluginDemoUtils.addErrorLog(error, "configCopyTapped", info)
    }
  },
  configPasteTapped: async function (params) {
    // MNUtil.copy(self.selectedItem)
    let selected = self.selectedItem
    if (!pluginDemoConfig.checkCouldSave(selected)) {
      return
    }
    try {
    let input = MNUtil.clipboardText
    if (selected === "execute" || MNUtil.isValidJSON(input)) {
      if (!pluginDemoConfig.actions[selected]) {
        pluginDemoConfig.actions[selected] = pluginDemoConfig.getAction(selected)
      }
      pluginDemoConfig.actions[selected].description = input
      pluginDemoConfig.actions[selected].name = self.titleInput.text
      self.pluginDemoController.actions = pluginDemoConfig.actions
      if (self.pluginDemoController.dynamicToolbar) {
        self.pluginDemoController.dynamicToolbar.actions = pluginDemoConfig.actions
      }
      pluginDemoConfig.save("MNToolbar_actionConfig")
      if (!selected.includes("custom")) {
        MNUtil.showHUD("Save Action: "+self.titleInput.text)
      }else{
        MNUtil.showHUD("Save Custom Action: "+self.titleInput.text)
      }
      if (selected === "edit") {
        let config = JSON.parse(input)
        if ("showOnNoteEdit" in config) {
          pluginDemoConfig.showEditorOnNoteEdit = config.showOnNoteEdit
        }
      }
      self.setWebviewContent(input)
    }else{
      MNUtil.showHUD("Invalid JSON format: "+input)
      MNUtil.copy("Invalid JSON format: "+input)
    }
    } catch (error) {
      pluginDemoUtils.addErrorLog(error, "configSaveTapped", info)
    }
  },
  configSaveTapped: async function (params) {
    let selected = self.selectedItem
    if (!pluginDemoConfig.checkCouldSave(selected)) {
      return
    }
    try {
    let actions = pluginDemoConfig.actions
    let input = await self.getWebviewContent()
    if (selected === "execute" || MNUtil.isValidJSON(input)) {
      if (!actions[selected]) {
        actions[selected] = pluginDemoConfig.getAction(selected)
      }
      actions[selected].description = input
      actions[selected].name = self.titleInput.text
      self.pluginDemoController.actions = actions
      if (self.pluginDemoController.dynamicToolbar) {
        self.pluginDemoController.dynamicToolbar.actions = actions
      }
      pluginDemoConfig.save("MNToolbar_actionConfig")
      if (!selected.includes("custom")) {
        MNUtil.showHUD("Save Action: "+self.titleInput.text)
      }else{
        MNUtil.showHUD("Save Custom Action: "+self.titleInput.text)
      }
      if (selected === "edit") {
        let config = JSON.parse(input)
        if ("showOnNoteEdit" in config) {
          pluginDemoConfig.showEditorOnNoteEdit = config.showOnNoteEdit
        }
      }
      // if (selected === "excute") {
      //   // self.setJSContent(selected)
      //   self.runJavaScript(`document.getElementById('editor').innerHTML = document.body.innerText`)
      // }
    }else{
      MNUtil.showHUD("Invalid JSON format!")
    }
    } catch (error) {
      pluginDemoUtils.addErrorLog(error, "configSaveTapped", info)
    }
  },
  configRunTapped: async function (button) {
    let self = getSettingController()
  try {
    // self.runJavaScript(`editor.setMode("code")`)
    // return
    let selected = self.selectedItem
    if (!pluginDemoConfig.checkCouldSave(selected)) {
      return
    }
    let input = await self.getWebviewContent()
    if (self.selectedItem === "execute" || MNUtil.isValidJSON(input)) {
      if (!pluginDemoConfig.actions[selected]) {
        pluginDemoConfig.actions[selected] = pluginDemoConfig.getAction(selected)
      }
      pluginDemoConfig.actions[selected].description = input
      pluginDemoConfig.actions[selected].name = self.titleInput.text
      self.pluginDemoController.actions = pluginDemoConfig.actions
      if (self.pluginDemoController.dynamicToolbar) {
        self.pluginDemoController.dynamicToolbar.actions = pluginDemoConfig.actions
      }
      pluginDemoConfig.save("MNToolbar_actionConfig")
    }else{
      MNUtil.showHUD("Invalid JSON format!")
      return
    }
    if (selected.includes("custom")) {
      let des = pluginDemoConfig.getDescriptionByName(selected)
      // MNUtil.copyJSON(des)
      self.pluginDemoController.customActionByDes(button,des)
      return
    }
    if (selected.includes("color")) {
      let colorIndex = parseInt(selected.split("color")[1])
      pluginDemoUtils.setColor(colorIndex)
      return
    }
    if (selected === "ocr") {
      let des = pluginDemoConfig.getDescriptionByName("ocr")
      des.action = "ocr"
      self.pluginDemoController.customActionByDes(button,des)
      // pluginDemoUtils.ocr()
      return
    }
    if (selected === "timer") {
      let des = pluginDemoConfig.getDescriptionByName("timer")
      des.action = "setTimer"
      self.pluginDemoController.customActionByDes(button,des)
      // pluginDemoUtils.ocr()
      return
    }
    if (selected === "sidebar") {
      let des = pluginDemoConfig.getDescriptionByName("sidebar")
      pluginDemoUtils.toggleSidebar(des)
      return
    }
    // if (selected === "execute") {
    //   // self.runJavaScript(`document.getElementById('editor').innerHTML = document.body.innerText`)
    //   let code = pluginDemoConfig.getExecuteCode()
    //   pluginDemoSandbox.execute(code)
    //   return
    // }
    if (selected === "chatglm") {
      pluginDemoUtils.chatAI()
      return
    }

    MNUtil.showHUD("Not supported")
  } catch (error) {
    pluginDemoUtils.addErrorLog(error, "configRunTapped", info)

  }
  },
  toggleSelected:function (button) {
    if (self.selectedItem === button.id) {
      let selected = self.selectedItem
      var commandTable = [
        {title:"➕ new icon from 🖼️ Photo", object:self, selector:'changeIconFromPhoto:',param:selected},
        {title:"➕ new icon from 📄 File", object:self, selector:'changeIconFromFile:',param:selected},
        {title:"➕ new icon from 🌐 Appicon Forge", object:self, selector:'changeIconFromWeb:',param:"https://zhangyu1818.github.io/appicon-forge/"},
        {title:"➕ new icon from 🌐 Icon Font", object:self, selector:'changeIconFromWeb:',param:"https://www.iconfont.cn/"},
        {title:"🔍 change icon scale", object:self, selector:'changeIconScale:',param:selected},
        {title:"🔄 reset icon", object:self, selector:'resetIcon:',param:selected}
      ]
      self.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,300,1)
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
  changeIconFromPhoto:function (buttonName) {
    self.checkPopoverController()
    if (pluginDemoUtils.checkSubscribe(true)) {
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
    if (pluginDemoUtils.checkSubscribe(true)) {
      self.checkPopoverController()
      let UTI = ["public.image"]
      let path = await MNUtil.importFile(UTI)
      let image = MNUtil.getImage(path,1)
      pluginDemoConfig.setButtonImage(buttonName, image,true)
    }
  },
  changeIconFromWeb: function (url) {
    self.checkPopoverController()
    if (pluginDemoUtils.checkSubscribe(false)) {
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
        pluginDemoConfig.imageScale[buttonName].scale = 1
        break;
      case 2:
        scale = 2
        pluginDemoConfig.imageScale[buttonName].scale = 2
        break;
      case 3:
        scale = 3
        pluginDemoConfig.imageScale[buttonName].scale = 3
        break;
      default:
        break;
    }
    if (res.button === 4 && res.input.trim()) {
      scale = parseFloat(res.input.trim())
      pluginDemoConfig.imageScale[buttonName].scale = scale
    }
    let image = pluginDemoConfig.imageConfigs[buttonName]
    pluginDemoConfig.imageConfigs[buttonName] = UIImage.imageWithDataScale(image.pngData(), scale)
    MNUtil.postNotification("refreshToolbarButton", {})
  },
  resetIcon:function (buttonName) {
    try {
    self.checkPopoverController()
      

    // let filePath = pluginDemoConfig.imageScale[buttonName].path
    pluginDemoConfig.imageScale[buttonName] = undefined
    pluginDemoConfig.save("MNToolbar_imageScale")
    pluginDemoConfig.imageConfigs[buttonName] = MNUtil.getImage(pluginDemoConfig.mainPath+"/"+pluginDemoConfig.getAction(buttonName).image+".png")
    MNUtil.postNotification("refreshToolbarButton", {})
    MNUtil.showHUD("Reset button image")
    // if (MNUtil.isfileExists(pluginDemoConfig.buttonImageFolder+"/"+filePath)) {
    //   NSFileManager.defaultManager().removeItemAtPath(pluginDemoConfig.buttonImageFolder+"/"+filePath)
    // }
    } catch (error) {
      pluginDemoUtils.addErrorLog(error, "resetIcon")
    }
  },
  imagePickerControllerDidFinishPickingMediaWithInfo:async function (ImagePickerController,info) {
    try {
      
    let image = info.UIImagePickerControllerOriginalImage
    MNUtil.studyController.dismissViewControllerAnimatedCompletion(true,undefined)
    pluginDemoConfig.setButtonImage(ImagePickerController.buttonName, image,true)
    } catch (error) {
      MNUtil.showHUD(error)
    }
  },
  imagePickerControllerDidCancel:function (params) {
    MNUtil.studyController.dismissViewControllerAnimatedCompletion(true,undefined)
    
  },
  toggleAddonLogo:function (button) {
    if (pluginDemoUtils.checkSubscribe(true)) {
      let addonName = button.addon
      pluginDemoConfig.addonLogos[addonName] = !pluginDemoConfig.checkLogoStatus(addonName)
      button.setTitleForState(addonName+": "+(pluginDemoConfig.checkLogoStatus(addonName)?"✅":"❌"),0)
      MNButton.setColor(button, pluginDemoConfig.checkLogoStatus(addonName)?"#457bd3":"#9bb2d6",0.8)
      pluginDemoConfig.save("MNToolbar_addonLogos")
      MNUtil.refreshAddonCommands()
    }
  },
  saveButtonColor:function (button) {
    if (!pluginDemoUtils.checkSubscribe(true)) {
      return
    }
    let color = self.hexInput.text
    let varColors = ["defaultBookPageColor","defaultHighlightBlendColor","defaultDisableColor","defaultTextColor","defaultNotebookColor","defaultTintColor","defaultTintColorForSelected","defaultTintColorForDarkBackground"]
    if (varColors.includes(color) || pluginDemoUtils.isHexColor(color)) {
      pluginDemoConfig.buttonConfig.color = color
      pluginDemoConfig.save("MNToolbar_buttonConfig")
      self.pluginDemoController.setToolbarButton()
      MNUtil.showHUD("Save color: "+color)
    }else{
      MNUtil.showHUD("Invalid hex color")
    }
  },
  toggleICloudSync:async function () {
    if (!pluginDemoUtils.checkSubscribe(false,true,true)) {//不可以使用免费额度,且未订阅下会提醒
      return
    }
    let iCloudSync = (self.iCloudButton.currentTitle === "iCloud Sync ✅")
    if (iCloudSync) {
      pluginDemoConfig.syncConfig.iCloudSync = !iCloudSync
      self.iCloudButton.setTitleForState("iCloud Sync "+(pluginDemoConfig.syncConfig.iCloudSync? "✅":"❌"),0)
      MNButton.setColor(self.iCloudButton, pluginDemoConfig.syncConfig.iCloudSync?"#457bd3":"#9bb2d6",0.8)
      pluginDemoConfig.save("MNToolbar_syncConfig",undefined,false)
    }else{
      let direction = await MNUtil.userSelect("MN Toolbar\nChoose action / 请选择操作", "❗️Back up the configuration before proceeding.\n❗️建议在操作前先备份配置", ["📥 Import / 导入","📤 Export / 导出"])
      switch (direction) {
        case 0:
          //cancel
          return;
        case 2:
          pluginDemoConfig.writeCloudConfig(true,true)
          MNUtil.showHUD("Export to iCloud")
          //export
          break;
        case 1:
          pluginDemoConfig.readCloudConfig(true,false,true)
          MNUtil.showHUD("Import from iCloud")
          let allActions = pluginDemoConfig.getAllActions()
          self.setButtonText(allActions,self.selectedItem)
          if (self.pluginDemoController) {
            self.pluginDemoController.setToolbarButton(allActions)
          }else{
            MNUtil.showHUD("No pluginDemoController")
          }
          MNUtil.postNotification("refreshView",{})
          //import
          break;
        default:
          break;
      }
      pluginDemoConfig.syncConfig.iCloudSync = true
      self.iCloudButton.setTitleForState("iCloud Sync ✅",0)
      MNButton.setColor(self.iCloudButton, "#457bd3",0.8)
      pluginDemoConfig.save("MNToolbar_syncConfig")
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
    if (!pluginDemoUtils.checkSubscribe(true)) {
      return
    }
    let allConfig = pluginDemoConfig.getAllConfig()
    switch (param) {
      case "iCloud":
        pluginDemoConfig.writeCloudConfig(true,true)
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
        MNUtil.writeJSON(pluginDemoConfig.mainPath+"/pluginDemo_config.json",allConfig)
        MNUtil.saveFile(pluginDemoConfig.mainPath+"/pluginDemo_config.json",["public.json"])
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
    if (!pluginDemoUtils.checkSubscribe(true)) {//检查订阅,可以使用免费额度
      return
    }
    // MNUtil.showHUD(param)
    let config = undefined
    switch (param) {
      case "iCloud":
        pluginDemoConfig.readCloudConfig(true,false,true)
        let allActions = pluginDemoConfig.getAllActions()
        // MNUtil.copyJSON(allActions)
        self.setButtonText(allActions,self.selectedItem)
        // self.addonController.view.hidden = true
        if (self.pluginDemoController) {
          self.pluginDemoController.setFrame(pluginDemoConfig.getWindowState("frame"))
          self.pluginDemoController.setToolbarButton(allActions)
        }else{
          MNUtil.showHUD("No addonController")
        }
        pluginDemoConfig.save()
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
          config = pluginDemoUtils.extractJSONFromMarkdown(focusNote.excerptText)
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
    pluginDemoConfig.importConfig(config)
    let allActions = pluginDemoConfig.getAllActions()
    // MNUtil.copyJSON(allActions)
    self.setButtonText(allActions,self.selectedItem)
    // self.addonController.view.hidden = true
    if (self.pluginDemoController) {
      self.pluginDemoController.setFrame(pluginDemoConfig.getWindowState("frame"))
      self.pluginDemoController.setToolbarButton(allActions)
    }else{
      MNUtil.showHUD("No addonController")
    }
    pluginDemoConfig.save()
    MNUtil.postNotification("refreshView",{})
    // MNUtil.copyJSON(config)
  },
  changeToolbarDirection:async function (button) {
    let self = getSettingController()
    var commandTable = []
    let selector = "toggleToolbarDirection:"
    if (pluginDemoConfig.vertical()) {
      commandTable.push(self.tableItem('🛠️  Toolbar Direction: ↕️ Vertical', selector,"fixed"))
    }else{
      commandTable.push(self.tableItem('🛠️  Toolbar Direction: ↔️ Horizontal', selector,"fixed"))
    }
    if (pluginDemoConfig.vertical(true)) {
      commandTable.push(self.tableItem('🌟  Dynamic Direction: ↕️ Vertical', selector,"dynamic"))
    }else{
      commandTable.push(self.tableItem('🌟  Dynamic Direction: ↔️ Horizontal', selector,"dynamic"))
    }
    self.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,300,2)
  },
  toggleToolbarDirection:function (source) {
    self.checkPopoverController()
    pluginDemoConfig.toggleToolbarDirection(source)
  },
  toggleDynamicOrder:function (params) {
    if (!pluginDemoUtils.checkSubscribe(true)) {
      return
    }
    let dynamicOrder = pluginDemoConfig.getWindowState("dynamicOrder")
    pluginDemoConfig.windowState.dynamicOrder = !dynamicOrder
    MNButton.setTitle(self.dynamicOrderButton, "Enable Dynamic Order: "+(pluginDemoConfig.getWindowState("dynamicOrder")?"✅":"❌"),undefined,true)
    pluginDemoConfig.save("MNToolbar_windowState")
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
  button.setTitleColorForState(pluginDemoConfig.highlightColor, 1);
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
  this[buttonName].setTitleColorForState(pluginDemoConfig.highlightColor, 1);
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
  pluginDemoFrame.set(this.maxButton,width*0.5+80,0)
  pluginDemoFrame.set(this.moveButton,width*0.5-75, 0)
  pluginDemoFrame.set(this.settingView,0,55,width,height-55)
  pluginDemoFrame.set(this.configView,0,0,width-2,height-60)
  pluginDemoFrame.set(this.advanceView,0,0,width-2,height-60)
  pluginDemoFrame.set(this.popupEditView,0,0,width-2,height-60)
  pluginDemoFrame.set(this.resizeButton,width-25,height-80)
  if (width < 650) {
    pluginDemoFrame.set(this.webviewInput, 5, 195, width-10, height-255)
    pluginDemoFrame.set(this.titleInput,5,155,width-80,35)
    pluginDemoFrame.set(this.saveButton,width-70,155)
    pluginDemoFrame.set(this.templateButton,width-188,199.5)
    pluginDemoFrame.set(this.runButton,width-35,199.5)
    pluginDemoFrame.set(this.copyButton,width-158,199.5)
    pluginDemoFrame.set(this.pasteButton,width-99,199.5)
    pluginDemoFrame.set(this.scrollview,5,5,width-10,145)
    // this.scrollview.contentSize = {width:width-20,height:height};
    pluginDemoFrame.set(this.moveTopButton, width-40, 10)
    pluginDemoFrame.set(this.moveUpButton, width-40, 45)
    pluginDemoFrame.set(this.moveDownButton, width-40, 80)
    pluginDemoFrame.set(this.configReset, width-40, 115)
  }else{
    pluginDemoFrame.set(this.webviewInput,305,45,width-310,height-105)
    pluginDemoFrame.set(this.titleInput,305,5,width-380,35)
    pluginDemoFrame.set(this.saveButton,width-70,5)
    pluginDemoFrame.set(this.templateButton,width-188,49.5)
    pluginDemoFrame.set(this.runButton,width-35,49.5)
    pluginDemoFrame.set(this.copyButton,width-158,49.5)
    pluginDemoFrame.set(this.pasteButton,width-99,49.5)
    pluginDemoFrame.set(this.scrollview,5,5,295,height-65)
    // this.scrollview.contentSize = {width:295,height:height};
    pluginDemoFrame.set(this.moveTopButton, 263, 15)
    pluginDemoFrame.set(this.moveUpButton, 263, 50)
    pluginDemoFrame.set(this.moveDownButton, 263, 85)
    pluginDemoFrame.set(this.configReset, 263, 120)
  }


  let settingFrame = this.settingView.bounds
  settingFrame.x = 0
  settingFrame.y = 15
  settingFrame.height = 40
  settingFrame.width = settingFrame.width
  this.tabView.frame = settingFrame
  pluginDemoFrame.set(this.configButton, 5, 5)
  pluginDemoFrame.set(this.dynamicButton, this.configButton.frame.x + this.configButton.frame.width+5, 5)
  pluginDemoFrame.set(this.popupButton, this.dynamicButton.frame.x + this.dynamicButton.frame.width+5, 5)
  pluginDemoFrame.set(this.advancedButton, this.popupButton.frame.x + this.popupButton.frame.width+5, 5)
  pluginDemoFrame.set(this.closeButton, width-35, 5)
  let scrollHeight = 5
  if (MNUtil.appVersion().type === "macOS") {
    for (let i = 0; i < pluginDemoConfig.allPopupButtons.length; i++) {
      let replaceButtonName = "replacePopupButton_"+pluginDemoConfig.allPopupButtons[i]
      let replaceSwtichName = "replacePopupSwtich_"+pluginDemoConfig.allPopupButtons[i]
      pluginDemoFrame.set(this[replaceButtonName], 5, 5+i*40, width-10)
      pluginDemoFrame.set(this[replaceSwtichName], width-33, 5+i*40)
      scrollHeight = (i+1)*40+5
    }
  }else{
    for (let i = 0; i < pluginDemoConfig.allPopupButtons.length; i++) {
      let replaceButtonName = "replacePopupButton_"+pluginDemoConfig.allPopupButtons[i]
      let replaceSwtichName = "replacePopupSwtich_"+pluginDemoConfig.allPopupButtons[i]
      pluginDemoFrame.set(this[replaceButtonName], 5, 5+i*40, width-65)
      pluginDemoFrame.set(this[replaceSwtichName], width-55, 6.5+i*40)
      scrollHeight = (i+1)*40+5
    }
  }
  pluginDemoFrame.set(this.popupScroll, 0, 0, width, height-55)
  this.popupScroll.contentSize = {width:width,height:scrollHeight}
  pluginDemoFrame.set(this.editorButton, 5, 5, (width-15)/2,35)
  pluginDemoFrame.set(this.chatAIButton, 10+(width-15)/2, 5, (width-15)/2,35)
  pluginDemoFrame.set(this.snipasteButton, 5, 45, (width-15)/2,35)
  pluginDemoFrame.set(this.autoStyleButton, 10+(width-15)/2, 45, (width-15)/2,35)
  pluginDemoFrame.set(this.browserButton, 5, 85, (width-15)/2,35)
  pluginDemoFrame.set(this.OCRButton, 10+(width-15)/2, 85, (width-15)/2,35)
  pluginDemoFrame.set(this.timerButton, 5, 125, (width-15)/2,35)
  pluginDemoFrame.set(this.hexInput, 5, 165, width-135,35)
  pluginDemoFrame.set(this.hexButton, width-125, 165, 120,35)
  pluginDemoFrame.set(this.iCloudButton, 5, 205, 160,35)
  pluginDemoFrame.set(this.directionButton, 5, 245, width-10,35)
  pluginDemoFrame.set(this.dynamicOrderButton, 5, 285, width-10,35)
  pluginDemoFrame.set(this.exportButton, 170, 205, (width-180)/2,35)
  pluginDemoFrame.set(this.importButton, 175+(width-180)/2, 205, (width-180)/2,35)
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
    MNButton.setImage(this.closeButton, MNUtil.getImage(pluginDemoConfig.mainPath+"/stop.png"))
    this.closeButton.width = 30
    this.closeButton.height = 30

    // this.createButton("editorButton","toggleAddonLogo:","advanceView")
    try {
      pluginDemoConfig.allPopupButtons.forEach(buttonName=>{
        let replaceButtonName = "replacePopupButton_"+buttonName
        let replaceSwtichName = "replacePopupSwtich_"+buttonName
        this.createButton(replaceButtonName,"changePopupReplace:","popupScroll")
        let replaceButton = this[replaceButtonName]
        replaceButton.height = 35
        replaceButton.id = buttonName
        let target = pluginDemoConfig.getPopupConfig(buttonName).target
        if (target) {
          let actionName = pluginDemoConfig.getAction(pluginDemoConfig.getPopupConfig(buttonName).target).name
          MNButton.setConfig(replaceButton, {color:"#558fed",alpha:0.9,opacity:1.0,title:buttonName+": "+actionName,font:17,radius:10,bold:true})
        }else{
          MNButton.setConfig(replaceButton, {color:"#558fed",alpha:0.9,opacity:1.0,title:buttonName+": ",font:17,radius:10,bold:true})
        }
        this.createSwitch(replaceSwtichName, "togglePopupReplace:", "popupScroll")
        let replaceSwtich = this[replaceSwtichName]
        replaceSwtich.id = buttonName
        replaceSwtich.on = pluginDemoConfig.getPopupConfig(buttonName).enabled
        replaceSwtich.hidden = false
        replaceSwtich.width = 20
        replaceSwtich.height = 35
      })
    } catch (error) {
      // pluginDemoUtils.addErrorLog(error, "replacePopupEditSwtich")
    }

    this.createButton("editorButton","toggleAddonLogo:","advanceView")
    this.editorButton.layer.opacity = 1.0
    this.editorButton.addon = "MNEditor"
    this.editorButton.setTitleForState("MNEditor: "+(pluginDemoConfig.checkLogoStatus("MNEditor")?"✅":"❌"),0)
    this.editorButton.titleLabel.font = UIFont.boldSystemFontOfSize(16)
    MNButton.setColor(this.editorButton, pluginDemoConfig.checkLogoStatus("MNEditor")?"#457bd3":"#9bb2d6",0.8)

    this.createButton("chatAIButton","toggleAddonLogo:","advanceView")
    this.chatAIButton.layer.opacity = 1.0
    this.chatAIButton.addon = "MNChatAI"
    this.chatAIButton.setTitleForState("MNChatAI: "+(pluginDemoConfig.checkLogoStatus("MNChatAI")?"✅":"❌"),0)
    this.chatAIButton.titleLabel.font = UIFont.boldSystemFontOfSize(16)
    MNButton.setColor(this.chatAIButton, pluginDemoConfig.checkLogoStatus("MNChatAI")?"#457bd3":"#9bb2d6",0.8)

    this.createButton("snipasteButton","toggleAddonLogo:","advanceView")
    this.snipasteButton.layer.opacity = 1.0
    this.snipasteButton.addon = "MNSnipaste"
    this.snipasteButton.setTitleForState("MNSnipaste: "+(pluginDemoConfig.checkLogoStatus("MNSnipaste")?"✅":"❌"),0)
    this.snipasteButton.titleLabel.font = UIFont.boldSystemFontOfSize(16)
    MNButton.setColor(this.snipasteButton, pluginDemoConfig.checkLogoStatus("MNSnipaste")?"#457bd3":"#9bb2d6",0.8)

    this.createButton("autoStyleButton","toggleAddonLogo:","advanceView")
    this.autoStyleButton.layer.opacity = 1.0
    this.autoStyleButton.addon = "MNAutoStyle"
    this.autoStyleButton.setTitleForState("MNAutoStyle: "+(pluginDemoConfig.checkLogoStatus("MNAutoStyle")?"✅":"❌"),0)
    this.autoStyleButton.titleLabel.font = UIFont.boldSystemFontOfSize(16)
    MNButton.setColor(this.autoStyleButton, pluginDemoConfig.checkLogoStatus("MNAutoStyle")?"#457bd3":"#9bb2d6",0.8)
    
    this.createButton("browserButton","toggleAddonLogo:","advanceView")
    this.browserButton.layer.opacity = 1.0
    this.browserButton.addon = "MNBrowser"
    this.browserButton.setTitleForState("MNBrowser: "+(pluginDemoConfig.checkLogoStatus("MNBrowser")?"✅":"❌"),0)
    this.browserButton.titleLabel.font = UIFont.boldSystemFontOfSize(16)
    MNButton.setColor(this.browserButton, pluginDemoConfig.checkLogoStatus("MNBrowser")?"#457bd3":"#9bb2d6",0.8)

    this.createButton("OCRButton","toggleAddonLogo:","advanceView")
    this.OCRButton.layer.opacity = 1.0
    this.OCRButton.addon = "MNOCR"
    this.OCRButton.setTitleForState("MNOCR: "+(pluginDemoConfig.checkLogoStatus("MNOCR")?"✅":"❌"),0)
    this.OCRButton.titleLabel.font = UIFont.boldSystemFontOfSize(16)
    MNButton.setColor(this.OCRButton, pluginDemoConfig.checkLogoStatus("MNOCR")?"#457bd3":"#9bb2d6",0.8)

    this.createButton("timerButton","toggleAddonLogo:","advanceView")
    this.timerButton.layer.opacity = 1.0
    this.timerButton.addon = "MNTimer"
    this.timerButton.setTitleForState("MNTimer: "+(pluginDemoConfig.checkLogoStatus("MNTimer")?"✅":"❌"),0)
    this.timerButton.titleLabel.font = UIFont.boldSystemFontOfSize(16)
    MNButton.setColor(this.timerButton, pluginDemoConfig.checkLogoStatus("MNTimer")?"#457bd3":"#9bb2d6",0.8)

    this.creatTextView("hexInput","advanceView","#9bb2d6")
    this.createButton("hexButton","saveButtonColor:","advanceView")
    this.hexButton.layer.opacity = 1.0
    this.hexButton.addon = "MNOCR"
    this.hexButton.setTitleForState("Save Color",0)
    this.hexButton.titleLabel.font = UIFont.boldSystemFontOfSize(16)
    this.hexInput.text = pluginDemoConfig.buttonConfig.color
    MNButton.setColor(this.hexButton, pluginDemoConfig.checkLogoStatus("MNOCR")?"#457bd3":"#9bb2d6",0.8)

    this.createButton("iCloudButton","toggleICloudSync:","advanceView")
    let iCloudSync = pluginDemoConfig.iCloudSync
    
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
    MNButton.setTitle(this.dynamicOrderButton, "Enable Dynamic Order: "+(pluginDemoConfig.getWindowState("dynamicOrder")?"✅":"❌"),undefined,true)

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
    this.configReset.setTitleForState("🔄",0)
    this.configReset.width = 30
    this.configReset.height = 30

    this.createButton("moveUpButton","moveForwardTapped:","configView")
    this.moveUpButton.layer.opacity = 1.0
    this.moveUpButton.setTitleForState("🔼",0)
    this.moveUpButton.width = 30
    this.moveUpButton.height = 30

    this.createButton("moveDownButton","moveBackwardTapped:","configView")
    this.moveDownButton.layer.opacity = 1.0
    this.moveDownButton.setTitleForState("🔽",0)
    this.moveDownButton.width = 30
    this.moveDownButton.height = 30

    this.createButton("moveTopButton","moveTopTapped:","configView")
    this.moveTopButton.layer.opacity = 1.0
    this.moveTopButton.setTitleForState("🔝",0)
    this.moveTopButton.width = 30 //写入属性而不是写入frame中,作为固定参数使用,配合Frame.setLoc可以方便锁死按钮大小
    this.moveTopButton.height = 30

    this.createButton("templateButton","chooseTemplate:","configView")
    MNButton.setConfig(this.templateButton, {opacity:0.8,color:"#457bd3"})
    this.templateButton.layer.cornerRadius = 6
    this.templateButton.setImageForState(pluginDemoConfig.templateImage,0)
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
    this.resizeButton.setImageForState(pluginDemoConfig.curveImage,0)
    MNButton.setConfig(this.resizeButton, {cornerRadius:20,color:"#ffffff",alpha:0.})
    this.resizeButton.width = 25
    this.resizeButton.height = 25


    this.createButton("runButton","configRunTapped:","configView")
    MNButton.setConfig(this.runButton, {opacity:0.8,color:"#e06c75"})
    this.runButton.layer.cornerRadius = 6
    // MNButton.setConfig(this.runButton, {opacity:1.0,title:"▶️",font:25,color:"#ffffff",alpha:0.})
    this.runButton.setImageForState(pluginDemoConfig.runImage,0)
    this.runButton.width = 26
    this.runButton.height = 26

    let color = ["#ffffb4","#ccfdc4","#b4d1fb","#f3aebe","#ffff54","#75fb4c","#55bbf9","#ea3323","#ef8733","#377e47","#173dac","#be3223","#ffffff","#dadada","#b4b4b4","#bd9fdc"]
  } catch (error) {
    pluginDemoUtils.addErrorLog(error, "createSettingView")
  }
}
/**
 * @this {settingController}
 */
settingController.prototype.setButtonText = function (names=pluginDemoConfig.getAllActions(),highlight=this.selectedItem) {
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
      MNButton.setImage(this[buttonName], pluginDemoConfig.imageConfigs[word])
    })
    this.refreshLayout()
}

/**
 * @this {settingController}
 */
settingController.prototype.setTextview = function (name = this.selectedItem) {
  try {
      // let entries           =  NSUserDefaults.standardUserDefaults().objectForKey('MNBrowser_entries');
      // let actions = pluginDemoConfig.actions
      // let defaultActions = pluginDemoConfig.getActions()
      let action = pluginDemoConfig.getAction(name)
      // let action = (name in actions)?actions[name]:defaultActions[name]
      let text  = action.name
      this.titleInput.text= text
      if (MNUtil.isValidJSON(action.description)) {
        let des = JSON.parse(action.description)
        if (name === "sidebar") {
          des.action = "toggleSidebar"
        }
        if (name === "ocr") {
          des.action = "ocr"
        }
        // MNUtil.showHUD(typeof des)
        // MNUtil.copy(des)
        this.setWebviewContent(des)
      }else{
        MNUtil.copy(action.description)
        MNUtil.showHUD("Invalid description")
        des = {}
        if (name === "pasteAsTitle") {
          des = {
            "action": "setContent",
            "target": "title",
            "content": "{{clipboardText}}"
          }
        }
        this.setWebviewContent(des)
      }
      // let description = action.description
      // if (MNUtil.isValidJSON(description)) {
      //   this.preAction = name
      //   this.setWebviewContent(description)
      // }else{
      //   actions = pluginDemoConfig.getActions()
      //   description = action.description
      //   this.preAction = name
      //   this.setWebviewContent(description)
      // }
  } catch (error) {
    pluginDemoUtils.addErrorLog(error, "setTextview")
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
    let initX = 10
    let initY = 10
    let initL = 0
    let buttonWidth = 40
    let buttonHeight = 40
    this.locs = [];
    this.words.map((word,index)=>{
      // let title = word
      if (xLeft+initX+buttonWidth > viewFrame.width-10) {
        initX = 10
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
        this.editorButton.setTitleForState("MNEditor: "+(pluginDemoConfig.checkLogoStatus("MNEditor")?"✅":"❌"),0)
        MNButton.setColor(this.editorButton, pluginDemoConfig.checkLogoStatus("MNEditor")?"#457bd3":"#9bb2d6",0.8)

        this.chatAIButton.setTitleForState("MNChatAI: "+(pluginDemoConfig.checkLogoStatus("MNChatAI")?"✅":"❌"),0)
        MNButton.setColor(this.chatAIButton, pluginDemoConfig.checkLogoStatus("MNChatAI")?"#457bd3":"#9bb2d6",0.8)

        this.snipasteButton.setTitleForState("MNSnipaste: "+(pluginDemoConfig.checkLogoStatus("MNSnipaste")?"✅":"❌"),0)
        MNButton.setColor(this.snipasteButton, pluginDemoConfig.checkLogoStatus("MNSnipaste")?"#457bd3":"#9bb2d6",0.8)

        this.autoStyleButton.setTitleForState("MNAutoStyle: "+(pluginDemoConfig.checkLogoStatus("MNAutoStyle")?"✅":"❌"),0)
        MNButton.setColor(this.autoStyleButton, pluginDemoConfig.checkLogoStatus("MNAutoStyle")?"#457bd3":"#9bb2d6",0.8)

        this.browserButton.setTitleForState("MNBrowser: "+(pluginDemoConfig.checkLogoStatus("MNBrowser")?"✅":"❌"),0)
        MNButton.setColor(this.browserButton, pluginDemoConfig.checkLogoStatus("MNBrowser")?"#457bd3":"#9bb2d6",0.8)

        this.OCRButton.setTitleForState("MNOCR: "+(pluginDemoConfig.checkLogoStatus("MNOCR")?"✅":"❌"),0)
        MNButton.setColor(this.OCRButton, pluginDemoConfig.checkLogoStatus("MNOCR")?"#457bd3":"#9bb2d6",0.8)

        this.timerButton.setTitleForState("MNTimer: "+(pluginDemoConfig.checkLogoStatus("MNTimer")?"✅":"❌"),0)
        MNButton.setColor(this.timerButton, pluginDemoConfig.checkLogoStatus("MNTimer")?"#457bd3":"#9bb2d6",0.8)

        this.hexInput.text = pluginDemoConfig.buttonConfig.color
        MNButton.setColor(this.hexButton, "#457bd3",0.8)

        let iCloudSync = pluginDemoConfig.iCloudSync

        MNButton.setColor(this.iCloudButton, iCloudSync?"#457bd3":"#9bb2d6",0.8)
        MNButton.setTitle(this.iCloudButton, "iCloud Sync "+(iCloudSync? "✅":"❌"),undefined, true)
      break;
    case "popupEditView":
      pluginDemoConfig.allPopupButtons.forEach(buttonName=>{
        let replaceButtonName = "replacePopupButton_"+buttonName
        let replaceSwtichName = "replacePopupSwtich_"+buttonName
        let replaceButton = this[replaceButtonName]
        replaceButton.id = buttonName
        let target = pluginDemoConfig.getPopupConfig(buttonName).target
        if (target) {
          let actionName = pluginDemoConfig.getAction(pluginDemoConfig.getPopupConfig(buttonName).target).name
          MNButton.setConfig(replaceButton, {color:"#558fed",alpha:0.9,opacity:1.0,title:buttonName+": "+actionName,font:17,radius:10,bold:true})
        }else{
          MNButton.setConfig(replaceButton, {color:"#558fed",alpha:0.9,opacity:1.0,title:buttonName+": ",font:17,radius:10,bold:true})
        }
        let replaceSwtich = this[replaceSwtichName]
        replaceSwtich.id = buttonName
        replaceSwtich.on = pluginDemoConfig.getPopupConfig(buttonName).enabled
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
  // let allActions = pluginDemoConfig.getAllActions(isEditingDynamic)
  // let allActions = pluginDemoConfig.getAllActions()// pluginDemoConfig.action.concat(pluginDemoConfig.getDefaultActionKeys().slice(pluginDemoConfig.action.length))
  // this.setButtonText(allActions,this.selectedItem)
  this.pluginDemoController.setToolbarButton(pluginDemoConfig.action)
  this.hideAllButton()
  MNUtil.animate(()=>{
    this.view.layer.opacity = 1.0
  },0.2).then(()=>{
      this.view.layer.borderWidth = 0
      this.view.layer.opacity = 1.0
      this.showAllButton()
      this.settingView.hidden = false
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
  pluginDemoUtils.studyController().view.bringSubviewToFront(this.addonBar)
  let preFrame = this.view.frame
  let preOpacity = this.view.layer.opacity
  let preCustom = this.custom
  this.hideAllButton()
  this.custom = false
  UIView.animateWithDurationAnimationsCompletion(0.25,()=>{
    this.view.layer.opacity = 0.2
    // if (frame) {
    //   this.view.frame = frame
    //   this.currentFrame = frame
    // }
    // this.view.frame = {x:preFrame.x+preFrame.width*0.1,y:preFrame.y+preFrame.height*0.1,width:preFrame.width*0.8,height:preFrame.height*0.8}
    // this.currentFrame = {x:preFrame.x+preFrame.width*0.1,y:preFrame.y+preFrame.height*0.1,width:preFrame.width*0.8,height:preFrame.height*0.8}
  },
  ()=>{
    this.view.hidden = true;
    this.view.layer.opacity = preOpacity      
    this.view.frame = preFrame
    this.currentFrame = preFrame
    this.custom = preCustom
    // this.view.frame = preFrame
    // this.currentFrame = preFrame
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
settingController.prototype.updateWebviewContent = function (content) {
  if (!MNUtil.isValidJSON(content)) {
    content = "{}"
  }
  this.runJavaScript(`updateContent('${encodeURIComponent(content)}')`)
}
/**
 * @this {settingController}
 */
settingController.prototype.setWebviewContent = function (content) {
  if (typeof content === "object") {
    this.runJavaScript(`setContent('${encodeURIComponent(JSON.stringify(content))}')`)
    return
  }
  if (!MNUtil.isValidJSON(content)) {
    content = "{}"
  }
  this.runJavaScript(`setContent('${encodeURIComponent(content)}')`)
}
/**
 * @this {settingController}
 */
settingController.prototype.setJSContent = function (content) {
  this.webviewInput.loadHTMLStringBaseURL(pluginDemoUtils.JShtml(content))
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
settingController.prototype.showHUD = function (title, duration = 1.5,view = this.view) {
  MNUtil.showHUD(title,duration,view)
}
/**
 * 
 * @type {pluginDemoController}
 */
settingController.prototype.pluginDemoController