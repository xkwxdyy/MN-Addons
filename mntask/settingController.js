/**
 * settingController.js - MNTask 设置面板控制器
 * 
 * ⚠️ 重要开发经验与常见陷阱 ⚠️
 * 
 * 1. JSB 框架 self 引用问题（极其重要）
 *    ❌ 错误：在方法内使用 self = this 或 let self = this
 *    ✅ 正确：使用工厂函数 const getTaskSettingController = ()=>self
 *    原因：JSB 框架的 Objective-C 桥接特性导致 this 行为异常
 * 
 * 2. ScrollView 布局与关闭按钮定位
 *    问题：关闭按钮随 ScrollView 内容移动
 *    解决方案：
 *    - 将 tabView 宽度设为 width - 45，为关闭按钮预留空间
 *    - 关闭按钮放在父视图中，位置为 tabView.width + 5
 *    - 确保两者在同一父视图中以保持坐标系一致
 * 
 * 3. ScrollView 方向锁定
 *    问题：标签栏 ScrollView 可以垂直移动
 *    解决方案：
 *    - alwaysBounceVertical = false
 *    - directionalLockEnabled = true
 *    - contentSize.height = frame.height
 * 
 * 4. 颜色值设置陷阱
 *    ❌ 错误：color:"transparent"
 *    ✅ 正确：color:"#ffffff", alpha:0.0
 *    原因：iOS 不支持 "transparent" 字符串，需使用 alpha 通道
 * 
 * 5. 坐标系统理解
 *    - view (主视图)
 *      ├── moveButton (y=0)
 *      ├── maxButton (y=0)
 *      ├── tabView (y=20, 横向滚动区域)
 *      │   ├── configButton
 *      │   ├── dynamicButton
 *      │   └── ...其他标签按钮
 *      ├── closeButton (y=20, x=tabView.width+5)
 *      └── settingView (y=55, 主内容区域)
 * 
 * 6. 视图管理系统
 *    使用统一的 viewManager 管理所有视图切换
 *    ❌ 错误：在按钮点击方法中直接使用 self.viewManager.switchTo()
 *    ✅ 正确：先获取 self 引用：let self = getTaskSettingController()
 *    详见 VIEWMANAGER_GUIDE.md
 * 
 * @module settingController
 */

// JSB.require('utils');
// JSB.require('base64')
/** @return {taskSettingController} */
const getTaskSettingController = ()=>self
var taskSettingController = JSB.defineClass('taskSettingController : UIViewController <NSURLConnectionDelegate,UIImagePickerControllerDelegate,UIWebViewDelegate>', {
  viewDidLoad: function() {
    let self = getTaskSettingController()
    MNUtil.log("🔍 viewDidLoad called")
try {
    self.init()
    MNUtil.log("🔍 After init, self.viewManager = ", self.viewManager)
    taskFrame.set(self.view,50,50,355,500)
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
    self.selectedItem = taskConfig.action[0]
    let allActions = taskConfig.action.concat(taskConfig.getDefaultActionKeys().slice(taskConfig.action.length))

    try {
      self.setButtonText(allActions,self.selectedItem)
      MNUtil.delay(0.5).then(()=>{
        self.setTextview(self.selectedItem)
      })
      self.settingView.hidden = false
    } catch (error) {  
      taskUtils.addErrorLog(error, "viewDidLoad.setButtonText", info)
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
    let self = getTaskSettingController()
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
      taskUtils.addErrorLog(error, "webViewShouldStartLoadWithRequestNavigationType")
      return false
    }
  },
  changeOpacityTo:function (opacity) {
    self.view.layer.opacity = opacity
  },
  moveTopTapped :function () {
    let self = getTaskSettingController()
    let isEditingDynamic = self.dynamicButton.selected
    if (isEditingDynamic && !taskUtils.checkSubscribe(true)) {
      self.showHUD("Please subscribe to use this feature")
      return
    }
    let allActions = taskConfig.getAllActions(isEditingDynamic)
    taskUtils.moveElement(allActions, self.selectedItem, "top")
    self.setButtonText(allActions,self.selectedItem)
    // MNUtil.postNotification("MNTaskRefreshLayout",{})
    // NSNotificationCenter.defaultCenter().postNotificationNameObjectUserInfo("MNTaskRefreshLayout", self.window, {})
    if (isEditingDynamic) {
      if (self.taskController.dynamicTask) {
        self.taskController.dynamicTask.setTaskButton(allActions)
      }
      taskConfig.dynamicAction = allActions
      taskConfig.save("MNTask_dynamicAction")
    }else{
      self.taskController.setTaskButton(allActions)
      taskConfig.action = allActions
      taskConfig.save("MNTask_action")
    }
  },
  moveForwardTapped :function () {
    let self = getTaskSettingController()
    try {
    let isEditingDynamic = self.dynamicButton.selected
    if (isEditingDynamic && !taskUtils.checkSubscribe(true)) {
      self.showHUD("Please subscribe to use this feature")
      return
    }
    let allActions = taskConfig.getAllActions(isEditingDynamic)
    taskUtils.moveElement(allActions, self.selectedItem, "up")
    self.setButtonText(allActions,self.selectedItem)
    if (isEditingDynamic) {
      if (self.taskController.dynamicTask) {
        self.taskController.dynamicTask.setTaskButton(allActions)
      }
      taskConfig.dynamicAction = allActions
      taskConfig.save("MNTask_dynamicAction")
    }else{
      self.taskController.setTaskButton(allActions)
      taskConfig.action = allActions
      taskConfig.save("MNTask_action")
    }
    } catch (error) {
      taskUtils.addErrorLog(error, "moveForwardTapped")
    }
  },
  moveBackwardTapped :function () {
    let self = getTaskSettingController()
    try {

    let isEditingDynamic = self.dynamicButton.selected
    if (isEditingDynamic && !taskUtils.checkSubscribe(true)) {
      self.showHUD("Please subscribe to use this feature")
      return
    }
    let allActions = taskConfig.getAllActions(isEditingDynamic)
    taskUtils.moveElement(allActions, self.selectedItem, "down")-0
    self.setButtonText(allActions,self.selectedItem)
    if (isEditingDynamic) {
      if (self.taskController.dynamicTask) {
        self.taskController.dynamicTask.setTaskButton(allActions)
      }
      taskConfig.dynamicAction = allActions
      taskConfig.save("MNTask_dynamicAction")
    }else{
      self.taskController.setTaskButton(allActions)
      taskConfig.action = allActions
      taskConfig.save("MNTask_action")
    }
    } catch (error) {
      taskUtils.addErrorLog(error, "moveBackwardTapped")
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
    let self = getTaskSettingController()
    self.checkPopoverController()
    let isEditingDynamic = self.dynamicButton.selected
    switch (param) {
      case "config":
        let confirm = await MNUtil.confirm("MN Task: Clear all configs?", "MN Task: 清除所有配置？")
        if (confirm) {
          taskConfig.reset("config")
          // self.taskController.setTaskButton(action,taskConfig.actions)
          // self.taskController.actions = actions
          self.setButtonText()
          self.setTextview()
          MNUtil.showHUD("Reset prompts")
        }
        break;
      case "order":
        taskConfig.reset("order")
        if (!isEditingDynamic) {
          self.setButtonText()
        }
        MNUtil.showHUD("Reset fixed order")
        break;
      case "dynamicOrder":
        taskConfig.reset("dynamicOrder")
        if (isEditingDynamic) {
          self.setButtonText()
        }
        MNUtil.showHUD("Reset dynamic order")
        break;
      case "image":
        taskConfig.imageScale = {}
        taskConfig.save("MNTask_imageScale")
        let keys = taskConfig.getDefaultActionKeys()
        keys.forEach((key)=>{
          taskConfig.imageConfigs[key] = MNUtil.getImage(taskConfig.mainPath+"/"+taskConfig.getAction(key).image+".png")
        })
        MNUtil.postNotification("refreshTaskButton", {})
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
    let self = getTaskSettingController()
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
    let targetFrame = taskFrame.gen(40, 0, frame.width-80, frame.height)
    if (MNUtil.isIOS) {
      targetFrame = taskFrame.gen(0, 0, frame.width, frame.height)
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
    let allActions = taskConfig.getAllActions()
    // MNUtil.copyJSON(allActions)
    var commandTable = allActions.map(actionKey=>{
      let actionName = taskConfig.getAction(actionKey).name
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
      // MNUtil.copyJSON(taskConfig.popupConfig)
    let popupConfig = taskConfig.getPopupConfig(config.id)
    popupConfig.target = config.target
    taskConfig.popupConfig[config.id] = popupConfig
    // MNUtil.copyJSON(taskConfig.popupConfig)
    // MNUtil.showHUD("Set target: "+config.target)
    let buttonName = "replacePopupButton_"+config.id
    MNButton.setConfig(self[buttonName], {title:config.id+": "+config.name,font:17,radius:10,bold:true})
    taskConfig.save("MNTask_popupConfig")
    } catch (error) {
      taskUtils.addErrorLog(error, "setPopupReplace")
    }
  },
  /**
   * 
   * @param {UISwitch} button 
   */
  togglePopupReplace: function (button) {
    // MNUtil.showHUD("togglePopupReplace:"+button.id)
    let popupConfig = taskConfig.getPopupConfig(button.id)
    if (button.on) {
      popupConfig.enabled = true
    }else{
      popupConfig.enabled = false
    }
    taskConfig.popupConfig[button.id] = popupConfig
    taskConfig.save("MNTask_popupConfig")
  },
  onMoveGesture:function (gesture) {
    let locationToMN = gesture.locationInView(taskUtils.studyController().view)
    if (!self.locationToButton || !self.miniMode && (Date.now() - self.moveDate) > 100) {
      let translation = gesture.translationInView(taskUtils.studyController().view)
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
    let y = taskUtils.constrain(location.y, 0, studyFrame.height-15)
    let x = taskUtils.constrain(location.x, 0, studyFrame.width-15)
    
    if (self.custom) {
      // Application.sharedInstance().showHUD(self.custom, self.view.window, 2);
      self.customMode = "None"
      MNUtil.animate(()=>{
        taskFrame.set(self.view,x,y,self.lastFrame.width,self.lastFrame.height)
        self.currentFrame  = self.view.frame
        self.settingViewLayout()
      },0.1)
    }else{
      taskFrame.set(self.view,x,y)
      self.currentFrame  = self.view.frame
    }
    self.custom = false;
  },
  onResizeGesture:function (gesture) {
    self.custom = false;
    self.customMode = "none"
    let baseframe = gesture.view.frame
    let locationToBrowser = gesture.locationInView(self.view)
    let width = taskUtils.constrain(locationToBrowser.x+baseframe.width*0.3, 355, MNUtil.studyView.frame.width)
    let height = taskUtils.constrain(locationToBrowser.y+baseframe.height*0.3, 475, MNUtil.studyView.frame.height)
    taskFrame.setSize(self.view,width,height)
    self.currentFrame  = self.view.frame
  },
  advancedButtonTapped: function (params) {
    let self = getTaskSettingController()
    self.viewManager.switchTo('advanced')
  },
  taskBoardButtonTapped: function (params) {
    let self = getTaskSettingController()
    self.viewManager.switchTo('taskBoard')
  },
  popupButtonTapped: function (params) {
    let self = getTaskSettingController()
    self.viewManager.switchTo('popup')
  },
  configButtonTapped: function (params) {
    MNUtil.log("🔍 configButtonTapped called")
    let self = getTaskSettingController()
    MNUtil.log("🔍 self = ", self)
    MNUtil.log("🔍 self.viewManager = ", self.viewManager)
    if (self.viewManager) {
      MNUtil.log("🔍 Calling viewManager.switchTo('config')")
      self.viewManager.switchTo('config')
    } else {
      MNUtil.log("❌ viewManager is undefined!")
    }
  },
  dynamicButtonTapped: async function (params) {
    let self = getTaskSettingController()
    self.viewManager.switchTo('dynamic')
  },
  chooseTemplate: async function (button) {
    let self = getTaskSettingController()
    let buttonX = taskUtils.getButtonFrame(button).x//转化成相对于studyview的
    let selected = self.selectedItem
    let templateNames = taskUtils.getTempelateNames(selected)
    if (!templateNames) {
      return
    }
    var templates = taskUtils.template
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
    if (!taskConfig.checkCouldSave(selected)) {
      return
    }
    try {
    let input = await self.getWebviewContent()
    MNUtil.copy(input)
    MNUtil.showHUD("Copy config")
    } catch (error) {
      taskUtils.addErrorLog(error, "configCopyTapped", info)
    }
  },
  configPasteTapped: async function (params) {
    // MNUtil.copy(self.selectedItem)
    let selected = self.selectedItem
    if (!taskConfig.checkCouldSave(selected)) {
      return
    }
    try {
    let input = MNUtil.clipboardText
    if (selected === "execute" || MNUtil.isValidJSON(input)) {
      if (!taskConfig.actions[selected]) {
        taskConfig.actions[selected] = taskConfig.getAction(selected)
      }
      taskConfig.actions[selected].description = input
      taskConfig.actions[selected].name = self.titleInput.text
      self.taskController.actions = taskConfig.actions
      if (self.taskController.dynamicTask) {
        self.taskController.dynamicTask.actions = taskConfig.actions
      }
      taskConfig.save("MNTask_actionConfig")
      if (!selected.includes("custom")) {
        MNUtil.showHUD("Save Action: "+self.titleInput.text)
      }else{
        MNUtil.showHUD("Save Custom Action: "+self.titleInput.text)
      }
      if (selected === "edit") {
        let config = JSON.parse(input)
        if ("showOnNoteEdit" in config) {
          taskConfig.showEditorOnNoteEdit = config.showOnNoteEdit
        }
      }
      self.setWebviewContent(input)
    }else{
      MNUtil.showHUD("Invalid JSON format: "+input)
      MNUtil.copy("Invalid JSON format: "+input)
    }
    } catch (error) {
      taskUtils.addErrorLog(error, "configSaveTapped", info)
    }
  },
  configSaveTapped: async function (params) {
    let selected = self.selectedItem
    if (!taskConfig.checkCouldSave(selected)) {
      return
    }
    try {
    let actions = taskConfig.actions
    let input = await self.getWebviewContent()
    if (selected === "execute" || MNUtil.isValidJSON(input)) {
      if (!actions[selected]) {
        actions[selected] = taskConfig.getAction(selected)
      }
      actions[selected].description = input
      actions[selected].name = self.titleInput.text
      self.taskController.actions = actions
      if (self.taskController.dynamicTask) {
        self.taskController.dynamicTask.actions = actions
      }
      taskConfig.save("MNTask_actionConfig")
      if (!selected.includes("custom")) {
        MNUtil.showHUD("Save Action: "+self.titleInput.text)
      }else{
        MNUtil.showHUD("Save Custom Action: "+self.titleInput.text)
      }
      if (selected === "edit") {
        let config = JSON.parse(input)
        if ("showOnNoteEdit" in config) {
          taskConfig.showEditorOnNoteEdit = config.showOnNoteEdit
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
      taskUtils.addErrorLog(error, "configSaveTapped", info)
    }
  },
  configRunTapped: async function (button) {
    let self = getTaskSettingController()
  try {
    // self.runJavaScript(`editor.setMode("code")`)
    // return
    let selected = self.selectedItem
    if (!taskConfig.checkCouldSave(selected)) {
      return
    }
    let input = await self.getWebviewContent()
    if (self.selectedItem === "execute" || MNUtil.isValidJSON(input)) {
      if (!taskConfig.actions[selected]) {
        taskConfig.actions[selected] = taskConfig.getAction(selected)
      }
      taskConfig.actions[selected].description = input
      taskConfig.actions[selected].name = self.titleInput.text
      self.taskController.actions = taskConfig.actions
      if (self.taskController.dynamicTask) {
        self.taskController.dynamicTask.actions = taskConfig.actions
      }
      taskConfig.save("MNTask_actionConfig")
    }else{
      MNUtil.showHUD("Invalid JSON format!")
      return
    }
    if (selected.includes("custom")) {
      let des = taskConfig.getDescriptionByName(selected)
      // MNUtil.copyJSON(des)
      self.taskController.customActionByDes(button,des)
      return
    }
    if (selected.includes("color")) {
      let colorIndex = parseInt(selected.split("color")[1])
      taskUtils.setColor(colorIndex)
      return
    }
    if (selected === "ocr") {
      let des = taskConfig.getDescriptionByName("ocr")
      des.action = "ocr"
      self.taskController.customActionByDes(button,des)
      // taskUtils.ocr()
      return
    }
    if (selected === "timer") {
      let des = taskConfig.getDescriptionByName("timer")
      des.action = "setTimer"
      self.taskController.customActionByDes(button,des)
      // taskUtils.ocr()
      return
    }
    if (selected === "sidebar") {
      let des = taskConfig.getDescriptionByName("sidebar")
      taskUtils.toggleSidebar(des)
      return
    }
    // if (selected === "execute") {
    //   // self.runJavaScript(`document.getElementById('editor').innerHTML = document.body.innerText`)
    //   let code = taskConfig.getExecuteCode()
    //   taskSandbox.execute(code)
    //   return
    // }
    if (selected === "chatglm") {
      taskUtils.chatAI()
      return
    }

    MNUtil.showHUD("Not supported")
  } catch (error) {
    taskUtils.addErrorLog(error, "configRunTapped", info)

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
    if (taskUtils.checkSubscribe(true)) {
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
    if (taskUtils.checkSubscribe(true)) {
      self.checkPopoverController()
      let UTI = ["public.image"]
      let path = await MNUtil.importFile(UTI)
      let image = MNUtil.getImage(path,1)
      taskConfig.setButtonImage(buttonName, image,true)
    }
  },
  changeIconFromWeb: function (url) {
    self.checkPopoverController()
    if (taskUtils.checkSubscribe(false)) {
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
        taskConfig.imageScale[buttonName].scale = 1
        break;
      case 2:
        scale = 2
        taskConfig.imageScale[buttonName].scale = 2
        break;
      case 3:
        scale = 3
        taskConfig.imageScale[buttonName].scale = 3
        break;
      default:
        break;
    }
    if (res.button === 4 && res.input.trim()) {
      scale = parseFloat(res.input.trim())
      taskConfig.imageScale[buttonName].scale = scale
    }
    let image = taskConfig.imageConfigs[buttonName]
    taskConfig.imageConfigs[buttonName] = UIImage.imageWithDataScale(image.pngData(), scale)
    MNUtil.postNotification("refreshTaskButton", {})
  },
  resetIcon:function (buttonName) {
    try {
    self.checkPopoverController()
      

    // let filePath = taskConfig.imageScale[buttonName].path
    taskConfig.imageScale[buttonName] = undefined
    taskConfig.save("MNTask_imageScale")
    taskConfig.imageConfigs[buttonName] = MNUtil.getImage(taskConfig.mainPath+"/"+taskConfig.getAction(buttonName).image+".png")
    MNUtil.postNotification("refreshTaskButton", {})
    MNUtil.showHUD("Reset button image")
    // if (MNUtil.isfileExists(taskConfig.buttonImageFolder+"/"+filePath)) {
    //   NSFileManager.defaultManager().removeItemAtPath(taskConfig.buttonImageFolder+"/"+filePath)
    // }
    } catch (error) {
      taskUtils.addErrorLog(error, "resetIcon")
    }
  },
  imagePickerControllerDidFinishPickingMediaWithInfo:async function (ImagePickerController,info) {
    try {
      
    let image = info.UIImagePickerControllerOriginalImage
    MNUtil.studyController.dismissViewControllerAnimatedCompletion(true,undefined)
    taskConfig.setButtonImage(ImagePickerController.buttonName, image,true)
    } catch (error) {
      MNUtil.showHUD(error)
    }
  },
  imagePickerControllerDidCancel:function (params) {
    MNUtil.studyController.dismissViewControllerAnimatedCompletion(true,undefined)
    
  },
  toggleAddonLogo:function (button) {
    if (taskUtils.checkSubscribe(true)) {
      let addonName = button.addon
      taskConfig.addonLogos[addonName] = !taskConfig.checkLogoStatus(addonName)
      button.setTitleForState(addonName+": "+(taskConfig.checkLogoStatus(addonName)?"✅":"❌"),0)
      MNButton.setColor(button, taskConfig.checkLogoStatus(addonName)?"#457bd3":"#9bb2d6",0.8)
      taskConfig.save("MNTask_addonLogos")
      MNUtil.refreshAddonCommands()
    }
  },
  saveButtonColor:function (button) {
    if (!taskUtils.checkSubscribe(true)) {
      return
    }
    let color = self.hexInput.text
    let varColors = ["defaultBookPageColor","defaultHighlightBlendColor","defaultDisableColor","defaultTextColor","defaultNotebookColor","defaultTintColor","defaultTintColorForSelected","defaultTintColorForDarkBackground"]
    if (varColors.includes(color) || taskUtils.isHexColor(color)) {
      taskConfig.buttonConfig.color = color
      taskConfig.save("MNTask_buttonConfig")
      self.taskController.setTaskButton()
      MNUtil.showHUD("Save color: "+color)
    }else{
      MNUtil.showHUD("Invalid hex color")
    }
  },
  toggleICloudSync:async function () {
    if (!taskUtils.checkSubscribe(false,true,true)) {//不可以使用免费额度,且未订阅下会提醒
      return
    }
    let iCloudSync = (self.iCloudButton.currentTitle === "iCloud Sync ✅")
    if (iCloudSync) {
      taskConfig.syncConfig.iCloudSync = !iCloudSync
      self.iCloudButton.setTitleForState("iCloud Sync "+(taskConfig.syncConfig.iCloudSync? "✅":"❌"),0)
      MNButton.setColor(self.iCloudButton, taskConfig.syncConfig.iCloudSync?"#457bd3":"#9bb2d6",0.8)
      taskConfig.save("MNTask_syncConfig",undefined,false)
    }else{
      let direction = await MNUtil.userSelect("MN Task\nChoose action / 请选择操作", "❗️Back up the configuration before proceeding.\n❗️建议在操作前先备份配置", ["📥 Import / 导入","📤 Export / 导出"])
      switch (direction) {
        case 0:
          //cancel
          return;
        case 2:
          taskConfig.writeCloudConfig(true,true)
          MNUtil.showHUD("Export to iCloud")
          //export
          break;
        case 1:
          taskConfig.readCloudConfig(true,false,true)
          MNUtil.showHUD("Import from iCloud")
          let allActions = taskConfig.getAllActions()
          self.setButtonText(allActions,self.selectedItem)
          if (self.taskController) {
            self.taskController.setTaskButton(allActions)
          }else{
            MNUtil.showHUD("No taskController")
          }
          MNUtil.postNotification("refreshView",{})
          //import
          break;
        default:
          break;
      }
      taskConfig.syncConfig.iCloudSync = true
      self.iCloudButton.setTitleForState("iCloud Sync ✅",0)
      MNButton.setColor(self.iCloudButton, "#457bd3",0.8)
      taskConfig.save("MNTask_syncConfig")
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
    if (!taskUtils.checkSubscribe(true)) {
      return
    }
    let allConfig = taskConfig.getAllConfig()
    switch (param) {
      case "iCloud":
        taskConfig.writeCloudConfig(true,true)
        break;
      case "clipborad":
        MNUtil.copyJSON(allConfig)
        break;
      case "currentNote":
        let focusNote = MNNote.getFocusNote()
        if(focusNote){
          MNUtil.undoGrouping(()=>{
            focusNote.noteTitle = "MNTask_Config"
            focusNote.excerptText = "```JSON\n"+JSON.stringify(allConfig,null,2)+"\n```"
            focusNote.excerptTextMarkdown = true
          })
        }else{
          MNUtil.showHUD("Invalid note")
        }
        break;
      case "file":
        MNUtil.writeJSON(taskConfig.mainPath+"/task_config.json",allConfig)
        MNUtil.saveFile(taskConfig.mainPath+"/task_config.json",["public.json"])
        break;
      default:
        break;
    }
  },
  pasteRootNoteId: async function () {
    let self = getTaskSettingController()
    let noteId = MNUtil.clipboardText
    if (!noteId) {
      self.showHUD("剪贴板为空")
      return
    }
    
    // 验证卡片是否存在
    let note = MNNote.new(noteId)
    if (!note) {
      self.showHUD("❌ 卡片不存在")
      return
    }
    
    // 如果已经有绑定，显示确认对话框
    if (taskConfig.getRootNoteId()) {
      const result = await MNUtil.confirm(
        "确认替换",
        "已经设置了根目录卡片，是否要替换为新的卡片？",
        ["取消", "替换"]
      )
      
      if (result !== 1) {  // 用户取消了
        return
      }
    }
    
    // 保存新的根目录卡片
    taskConfig.saveRootNoteId(note.noteId)
    self.updateRootNoteLabel()
    self.showHUD("✅ 已保存根目录卡片")
  },
  clearRootNoteId: async function () {
    let self = getTaskSettingController()
    
    // 如果没有设置根目录，直接返回
    if (!taskConfig.getRootNoteId()) {
      self.showHUD("❌ 未设置根目录卡片")
      return
    }
    
    // 显示确认对话框
    const result = await MNUtil.confirm(
      "确认清除",
      "确定要清除 Task Board 根目录卡片吗？",
      ["取消", "清除"]
    )
    
    if (result === 1) {  // 用户点击了"清除"
      taskConfig.clearRootNoteId()
      self.updateRootNoteLabel()
      self.showHUD("✅ 已清除根目录卡片")
    }
  },
  focusRootNoteId: function () {
    let self = getTaskSettingController()
    let noteId = taskConfig.getRootNoteId()
    if (!noteId) {
      self.showHUD("❌ 未设置根目录卡片")
      return
    }
    
    let note = MNNote.new(noteId)
    if (note) {
      note.focusInFloatMindMap()
    } else {
      self.showHUD("❌ 卡片不存在")
      // 清除无效的 ID
      taskConfig.clearRootNoteId()
      self.updateRootNoteLabel()
    }
  },
  
  // 通用看板处理方法
  focusTargetBoard: function() {
    this.focusBoard('target')
  },
  
  clearTargetBoard: async function() {
    await this.clearBoard('target')
  },
  
  pasteTargetBoard: async function() {
    await this.pasteBoard('target')
  },
  
  // 通用看板操作方法
  focusBoard: function(boardKey) {
    let self = getTaskSettingController()
    let noteId = taskConfig.getBoardNoteId(boardKey)
    if (!noteId) {
      self.showHUD(`❌ 未设置${this.getBoardDisplayName(boardKey)}`)
      return
    }
    
    let note = MNNote.new(noteId)
    if (note) {
      note.focusInFloatMindMap()
    } else {
      self.showHUD("❌ 卡片不存在")
      // 清除无效的 ID
      taskConfig.clearBoardNoteId(boardKey)
      self.updateBoardLabel(boardKey)
    }
  },
  
  clearBoard: async function(boardKey) {
    let self = getTaskSettingController()
    
    // 如果没有设置看板，直接返回
    if (!taskConfig.getBoardNoteId(boardKey)) {
      self.showHUD(`❌ 未设置${this.getBoardDisplayName(boardKey)}`)
      return
    }
    
    // 显示确认对话框
    const result = await MNUtil.confirm(
      "确认清除",
      `确定要清除${this.getBoardDisplayName(boardKey)}吗？`,
      ["取消", "清除"]
    )
    
    if (result === 1) {  // 用户点击了"清除"
      taskConfig.clearBoardNoteId(boardKey)
      self.updateBoardLabel(boardKey)
      self.showHUD(`✅ 已清除${this.getBoardDisplayName(boardKey)}`)
    }
  },
  
  pasteBoard: async function(boardKey) {
    let self = getTaskSettingController()
    let noteId = MNUtil.clipboardText
    if (!noteId) {
      self.showHUD("剪贴板为空")
      return
    }
    
    // 验证卡片是否存在
    let note = MNNote.new(noteId)
    if (!note) {
      self.showHUD("❌ 卡片不存在")
      return
    }
    
    // 如果已经有绑定，显示确认对话框
    if (taskConfig.getBoardNoteId(boardKey)) {
      const result = await MNUtil.confirm(
        "确认替换",
        `已经设置了${this.getBoardDisplayName(boardKey)}，是否要替换为新的卡片？`,
        ["取消", "替换"]
      )
      
      if (result !== 1) {  // 用户取消了
        return
      }
    }
    
    // 保存新的看板卡片
    taskConfig.saveBoardNoteId(boardKey, note.noteId)
    self.updateBoardLabel(boardKey)
    self.showHUD(`✅ 已保存${this.getBoardDisplayName(boardKey)}`)
  },
  
  getBoardDisplayName: function(boardKey) {
    const boardNames = {
      'root': '根目录卡片',
      'target': '目标看板'
    }
    return boardNames[boardKey] || `${boardKey}看板`
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
    if (!taskUtils.checkSubscribe(true)) {//检查订阅,可以使用免费额度
      return
    }
    // MNUtil.showHUD(param)
    let config = undefined
    switch (param) {
      case "iCloud":
        taskConfig.readCloudConfig(true,false,true)
        let allActions = taskConfig.getAllActions()
        // MNUtil.copyJSON(allActions)
        self.setButtonText(allActions,self.selectedItem)
        // self.addonController.view.hidden = true
        if (self.taskController) {
          self.taskController.setFrame(taskConfig.getWindowState("frame"))
          self.taskController.setTaskButton(allActions)
        }else{
          MNUtil.showHUD("No addonController")
        }
        taskConfig.save()
        MNUtil.postNotification("refreshView",{})
        return;
      case "clipborad":
        if(MNUtil){
          config = JSON.parse(MNUtil.clipboardText)
        }
        break;
      case "currentNote":
        let focusNote = MNNote.getFocusNote()
        if(focusNote && focusNote.noteTitle == "MNTask_Config"){
          config = taskUtils.extractJSONFromMarkdown(focusNote.excerptText)
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
    taskConfig.importConfig(config)
    let allActions = taskConfig.getAllActions()
    // MNUtil.copyJSON(allActions)
    self.setButtonText(allActions,self.selectedItem)
    // self.addonController.view.hidden = true
    if (self.taskController) {
      self.taskController.setFrame(taskConfig.getWindowState("frame"))
      self.taskController.setTaskButton(allActions)
    }else{
      MNUtil.showHUD("No addonController")
    }
    taskConfig.save()
    MNUtil.postNotification("refreshView",{})
    // MNUtil.copyJSON(config)
  },
  changeTaskDirection:async function (button) {
    let self = getTaskSettingController()
    var commandTable = []
    let selector = "toggleTaskDirection:"
    if (taskConfig.vertical()) {
      commandTable.push(self.tableItem('🛠️  Task Direction: ↕️ Vertical', selector,"fixed"))
    }else{
      commandTable.push(self.tableItem('🛠️  Task Direction: ↔️ Horizontal', selector,"fixed"))
    }
    if (taskConfig.vertical(true)) {
      commandTable.push(self.tableItem('🌟  Dynamic Direction: ↕️ Vertical', selector,"dynamic"))
    }else{
      commandTable.push(self.tableItem('🌟  Dynamic Direction: ↔️ Horizontal', selector,"dynamic"))
    }
    self.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,300,2)
  },
  toggleTaskDirection:function (source) {
    self.checkPopoverController()
    taskConfig.toggleTaskDirection(source)
  },
  toggleDynamicOrder:function (params) {
    if (!taskUtils.checkSubscribe(true)) {
      return
    }
    let dynamicOrder = taskConfig.getWindowState("dynamicOrder")
    taskConfig.windowState.dynamicOrder = !dynamicOrder
    MNButton.setTitle(self.dynamicOrderButton, "Enable Dynamic Order: "+(taskConfig.getWindowState("dynamicOrder")?"✅":"❌"),undefined,true)
    taskConfig.save("MNTask_windowState")
    MNUtil.postNotification("refreshTaskButton",{})
  }
});
taskSettingController.prototype.init = function () {
  this.custom = false;
  this.customMode = "None"
  this.selectedText = '';
  this.searchedText = '';
  
  // 初始化 viewManager
  MNUtil.log("🔍 Initializing viewManager...")
  this.initViewManager();
}


/**
 * 初始化视图管理器
 * @this {taskSettingController}
 */
taskSettingController.prototype.initViewManager = function() {
  MNUtil.log("🔍 Creating viewManager on instance...")
  const self = this;
  
  this.viewManager = {
    // 所有视图配置
    views: {
      config: {
        view: 'configView',
        button: 'configButton',
        selectedColor: '#457bd3',
        normalColor: '#9bb2d6',
        onShow: function(self) {
          let action = taskConfig.action
          self.setButtonText(action)
        }
      },
      advanced: {
        view: 'advanceView',
        button: 'advancedButton',
        selectedColor: '#457bd3',
        normalColor: '#9bb2d6'
      },
      popup: {
        view: 'popupEditView',
        button: 'popupButton',
        selectedColor: '#457bd3',
        normalColor: '#9bb2d6',
        onShow: function(self) {
          self.settingViewLayout()
        }
      },
      dynamic: {
        view: 'configView',  // 复用configView
        button: 'dynamicButton',
        selectedColor: '#457bd3',
        normalColor: '#9bb2d6',
        onShow: function(self) {
          let dynamicOrder = taskConfig.getWindowState("dynamicOrder")
          if (!dynamicOrder) {
            self.showHUD("Enable Dynamic Order first")
            return false
          }
          let dynamicAction = taskConfig.dynamicAction
          if (dynamicAction.length === 0) {
            taskConfig.dynamicAction = taskConfig.action
            dynamicAction = taskConfig.action
          }
          self.setButtonText(dynamicAction)
        }
      },
      taskBoard: {
        view: 'taskBoardView',
        button: 'taskBoardButton',
        selectedColor: '#457bd3',
        normalColor: '#9bb2d6',
        onShow: function(self) {
          self.updateRootNoteLabel()
          self.updateBoardLabel('target')
          self.settingViewLayout()
        }
      }
    },
    
    // 切换到指定视图
    switchTo: function(viewName) {
      MNUtil.log("🔍 viewManager.switchTo called with: " + viewName)
      const viewConfig = self.viewManager.views[viewName]
      
      if (!viewConfig) {
        MNUtil.log("❌ Unknown view: " + viewName)
        return
      }
      MNUtil.log("🔍 Found viewConfig for " + viewName + ": ", viewConfig)
      
      // 如果有前置检查，执行并判断是否继续
      if (viewConfig.onShow) {
        const shouldContinue = viewConfig.onShow(self)
        if (shouldContinue === false) return
      }
      
      // 隐藏所有视图并重置按钮状态
      Object.keys(self.viewManager.views).forEach(key => {
        const config = self.viewManager.views[key]
        if (self[config.view]) {
          self[config.view].hidden = true
        }
        if (self[config.button]) {
          self[config.button].selected = false
          MNButton.setColor(self[config.button], config.normalColor, 0.8)
        }
      })
      
      // 显示当前视图
      if (self[viewConfig.view]) {
        self[viewConfig.view].hidden = false
      }
      if (self[viewConfig.button]) {
        self[viewConfig.button].selected = true
        MNButton.setColor(self[viewConfig.button], viewConfig.selectedColor, 0.8)
      }
    },
    
    // 注册新视图（为将来扩展预留）
    registerView: function(name, config) {
      self.viewManager.views[name] = config
    },
    
    // 移除视图
    unregisterView: function(name) {
      delete self.viewManager.views[name]
    }
  }
  
  MNUtil.log("🔍 viewManager created successfully: ", this.viewManager)
}

taskSettingController.prototype.changeButtonOpacity = function(opacity) {
    this.moveButton.layer.opacity = opacity
    this.maxButton.layer.opacity = opacity
    // this.closeButton.layer.opacity = opacity
}
taskSettingController.prototype.setButtonLayout = function (button,targetAction) {
    button.autoresizingMask = (1 << 0 | 1 << 3);
    button.setTitleColorForState(UIColor.whiteColor(),0);
    button.setTitleColorForState(taskConfig.highlightColor, 1);
    MNButton.setColor(button, "#9bb2d6", 0.8)
    button.layer.cornerRadius = 8;
    button.layer.masksToBounds = true;
    if (targetAction) {
      button.addTargetActionForControlEvents(this, targetAction, 1 << 6);
    }
    this.view.addSubview(button);
}


taskSettingController.prototype.createButton = function (buttonName,targetAction,superview) {
    this[buttonName] = UIButton.buttonWithType(0);
    this[buttonName].autoresizingMask = (1 << 0 | 1 << 3);
    this[buttonName].setTitleColorForState(UIColor.whiteColor(),0);
    this[buttonName].setTitleColorForState(taskConfig.highlightColor, 1);
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

taskSettingController.prototype.createSwitch = function (switchName,targetAction,superview) {
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

taskSettingController.prototype.createScrollView = function (scrollName,superview) {
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

taskSettingController.prototype.settingViewLayout = function (){
    let viewFrame = this.view.bounds
    let width = viewFrame.width
    let height = viewFrame.height
    taskFrame.set(this.maxButton,width*0.5+80,0)
    taskFrame.set(this.moveButton,width*0.5-75, 0)
    taskFrame.set(this.settingView,0,55,width,height-55)
    taskFrame.set(this.configView,0,0,width-2,height-60)
    taskFrame.set(this.advanceView,0,0,width-2,height-60)
    taskFrame.set(this.popupEditView,0,0,width-2,height-60)
    taskFrame.set(this.taskBoardView,0,0,width-2,height-60)
    taskFrame.set(this.resizeButton,width-25,height-80)
    if (width < 650) {
      taskFrame.set(this.webviewInput, 5, 195, width-10, height-255)
      taskFrame.set(this.titleInput,5,155,width-80,35)
      taskFrame.set(this.saveButton,width-70,155)
      taskFrame.set(this.templateButton,width-188,199.5)
      taskFrame.set(this.runButton,width-35,199.5)
      taskFrame.set(this.copyButton,width-158,199.5)
      taskFrame.set(this.pasteButton,width-99,199.5)
      taskFrame.set(this.scrollview,5,5,width-10,145)
      // this.scrollview.contentSize = {width:width-20,height:height};
      taskFrame.set(this.moveTopButton, width-40, 10)
      taskFrame.set(this.moveUpButton, width-40, 45)
      taskFrame.set(this.moveDownButton, width-40, 80)
      taskFrame.set(this.configReset, width-40, 115)
    }else{
      taskFrame.set(this.webviewInput,305,45,width-310,height-105)
      taskFrame.set(this.titleInput,305,5,width-380,35)
      taskFrame.set(this.saveButton,width-70,5)
      taskFrame.set(this.templateButton,width-188,49.5)
      taskFrame.set(this.runButton,width-35,49.5)
      taskFrame.set(this.copyButton,width-158,49.5)
      taskFrame.set(this.pasteButton,width-99,49.5)
      taskFrame.set(this.scrollview,5,5,295,height-65)
      // this.scrollview.contentSize = {width:295,height:height};
      taskFrame.set(this.moveTopButton, 263, 15)
      taskFrame.set(this.moveUpButton, 263, 50)
      taskFrame.set(this.moveDownButton, 263, 85)
      taskFrame.set(this.configReset, 263, 120)
    }


    // tabView 在顶部工具栏区域
    let tabViewFrame = {
      x: 0,
      y: 20,  // 在 moveButton 下方
      width: width - 45,  // 为关闭按钮预留45像素空间
      height: 30
    }
    this.tabView.frame = tabViewFrame
    
    // 设置 tabView 内部的按钮
    taskFrame.set(this.configButton, 5, 0)
    taskFrame.set(this.dynamicButton, this.configButton.frame.x + this.configButton.frame.width+5, 0)
    taskFrame.set(this.popupButton, this.dynamicButton.frame.x + this.dynamicButton.frame.width+5, 0)
    taskFrame.set(this.advancedButton, this.popupButton.frame.x + this.popupButton.frame.width+5, 0)
    taskFrame.set(this.taskBoardButton, this.advancedButton.frame.x + this.advancedButton.frame.width+5, 0)
    
    // 关闭按钮与 tabView 对齐
    taskFrame.set(this.closeButton, tabViewFrame.width + 5, tabViewFrame.y)
    
    // 设置 tabView 的 contentSize，使按钮可以横向滚动
    const tabContentWidth = this.taskBoardButton.frame.x + this.taskBoardButton.frame.width + 10;
    this.tabView.contentSize = {width: tabContentWidth, height: 30}
    let scrollHeight = 5
    if (MNUtil.appVersion().type === "macOS") {
      for (let i = 0; i < taskConfig.allPopupButtons.length; i++) {
        let replaceButtonName = "replacePopupButton_"+taskConfig.allPopupButtons[i]
        let replaceSwtichName = "replacePopupSwtich_"+taskConfig.allPopupButtons[i]
        taskFrame.set(this[replaceButtonName], 5, 5+i*40, width-10)
        taskFrame.set(this[replaceSwtichName], width-33, 5+i*40)
        scrollHeight = (i+1)*40+5
      }
    }else{
      for (let i = 0; i < taskConfig.allPopupButtons.length; i++) {
        let replaceButtonName = "replacePopupButton_"+taskConfig.allPopupButtons[i]
        let replaceSwtichName = "replacePopupSwtich_"+taskConfig.allPopupButtons[i]
        taskFrame.set(this[replaceButtonName], 5, 5+i*40, width-65)
        taskFrame.set(this[replaceSwtichName], width-55, 6.5+i*40)
        scrollHeight = (i+1)*40+5
      }
    }
    taskFrame.set(this.popupScroll, 0, 0, width, height-55)
    this.popupScroll.contentSize = {width:width,height:scrollHeight}
    taskFrame.set(this.editorButton, 5, 5, (width-15)/2,35)
    taskFrame.set(this.chatAIButton, 10+(width-15)/2, 5, (width-15)/2,35)
    taskFrame.set(this.snipasteButton, 5, 45, (width-15)/2,35)
    taskFrame.set(this.autoStyleButton, 10+(width-15)/2, 45, (width-15)/2,35)
    taskFrame.set(this.browserButton, 5, 85, (width-15)/2,35)
    taskFrame.set(this.OCRButton, 10+(width-15)/2, 85, (width-15)/2,35)
    taskFrame.set(this.timerButton, 5, 125, (width-15)/2,35)
    taskFrame.set(this.hexInput, 5, 165, width-135,35)
    taskFrame.set(this.hexButton, width-125, 165, 120,35)
    taskFrame.set(this.iCloudButton, 5, 205, 160,35)
    taskFrame.set(this.directionButton, 5, 245, width-10,35)
    taskFrame.set(this.dynamicOrderButton, 5, 285, width-10,35)
    taskFrame.set(this.exportButton, 170, 205, (width-180)/2,35)
    taskFrame.set(this.importButton, 175+(width-180)/2, 205, (width-180)/2,35)
    
    // Task Board View 布局
    // 根目录看板
    taskFrame.set(this.rootNoteLabel, 10, 10, width-20, 35)
    taskFrame.set(this.focusRootNoteButton, 10, 55, (width-30)/3, 35)
    taskFrame.set(this.clearRootNoteButton, 15+(width-30)/3, 55, (width-30)/3, 35)
    taskFrame.set(this.pasteRootNoteButton, 20+2*(width-30)/3, 55, (width-30)/3, 35)
    
    // 目标看板
    taskFrame.set(this.targetBoardLabel, 10, 110, width-20, 35)
    taskFrame.set(this.focusTargetBoardButton, 10, 155, (width-30)/3, 35)
    taskFrame.set(this.clearTargetBoardButton, 15+(width-30)/3, 155, (width-30)/3, 35)
    taskFrame.set(this.pasteTargetBoardButton, 20+2*(width-30)/3, 155, (width-30)/3, 35)
    
    // 设置 ScrollView 的 contentSize，为多个看板预留空间
    this.taskBoardView.contentSize = {width: width-2, height: 500}
}


/**
 * @this {settingController}
 */
taskSettingController.prototype.createSettingView = function (){
try {
  

  this.creatView("settingView","view","#ffffff",0.8)
  this.settingView.hidden = true
  // this.settingView.layer.opacity = 0.8
  this.createScrollView("tabView","view")
  this.tabView.layer.backgroundColor = MNUtil.hexColorAlpha("#9bb2d6",0.0)
  this.tabView.alwaysBounceHorizontal = true
  this.tabView.alwaysBounceVertical = false  // 禁用垂直滚动
  this.tabView.bounces = true  // 保持弹性效果
  this.tabView.scrollEnabled = true  // 启用滚动
  this.tabView.directionalLockEnabled = true  // 锁定滚动方向
  this.tabView.showsHorizontalScrollIndicator = false
  this.tabView.showsVerticalScrollIndicator = false
  this.creatView("configView","settingView","#9bb2d6",0.0)

  this.creatView("popupEditView","settingView","#9bb2d6",0.0)
  this.popupEditView.hidden = true
  this.createScrollView("popupScroll", "popupEditView")
  this.popupScroll.layer.backgroundColor = MNUtil.hexColorAlpha("#c0bfbf",0.0)

  this.creatView("advanceView","settingView","#9bb2d6",0.0)
  this.advanceView.hidden = true

  this.createScrollView("taskBoardView","settingView")
  this.taskBoardView.hidden = true
  this.taskBoardView.backgroundColor = MNUtil.hexColorAlpha("#9bb2d6",0.0)


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

  this.createButton("taskBoardButton","taskBoardButtonTapped:","tabView")
  MNButton.setConfig(this.taskBoardButton, {alpha:0.9,opacity:1.0,title:"Task Board",font:17,radius:10,bold:true})
  this.taskBoardButton.width = this.taskBoardButton.sizeThatFits({width:150,height:30}).width+15
  this.taskBoardButton.height = 30
  this.taskBoardButton.selected = false

  this.createButton("closeButton","closeButtonTapped:","view")
  MNButton.setConfig(this.closeButton, {color:"#e06c75",alpha:0.9,opacity:1.0,radius:10,bold:true})
  MNButton.setImage(this.closeButton, MNUtil.getImage(taskConfig.mainPath+"/stop.png"))
  this.closeButton.width = 30
  this.closeButton.height = 30

  // this.createButton("editorButton","toggleAddonLogo:","advanceView")
  try {
    taskConfig.allPopupButtons.forEach(buttonName=>{
      let replaceButtonName = "replacePopupButton_"+buttonName
      let replaceSwtichName = "replacePopupSwtich_"+buttonName
      this.createButton(replaceButtonName,"changePopupReplace:","popupScroll")
      let replaceButton = this[replaceButtonName]
      replaceButton.height = 35
      replaceButton.id = buttonName
      let target = taskConfig.getPopupConfig(buttonName).target
      if (target) {
        let actionName = taskConfig.getAction(taskConfig.getPopupConfig(buttonName).target).name
        MNButton.setConfig(replaceButton, {color:"#558fed",alpha:0.9,opacity:1.0,title:buttonName+": "+actionName,font:17,radius:10,bold:true})
      }else{
        MNButton.setConfig(replaceButton, {color:"#558fed",alpha:0.9,opacity:1.0,title:buttonName+": ",font:17,radius:10,bold:true})
      }
      this.createSwitch(replaceSwtichName, "togglePopupReplace:", "popupScroll")
      let replaceSwtich = this[replaceSwtichName]
      replaceSwtich.id = buttonName
      replaceSwtich.on = taskConfig.getPopupConfig(buttonName).enabled
      replaceSwtich.hidden = false
      replaceSwtich.width = 20
      replaceSwtich.height = 35
    })
  } catch (error) {
    // taskUtils.addErrorLog(error, "replacePopupEditSwtich")
  }

  this.createButton("editorButton","toggleAddonLogo:","advanceView")
  this.editorButton.layer.opacity = 1.0
  this.editorButton.addon = "MNEditor"
  this.editorButton.setTitleForState("MNEditor: "+(taskConfig.checkLogoStatus("MNEditor")?"✅":"❌"),0)
  this.editorButton.titleLabel.font = UIFont.boldSystemFontOfSize(16)
  MNButton.setColor(this.editorButton, taskConfig.checkLogoStatus("MNEditor")?"#457bd3":"#9bb2d6",0.8)

  this.createButton("chatAIButton","toggleAddonLogo:","advanceView")
  this.chatAIButton.layer.opacity = 1.0
  this.chatAIButton.addon = "MNChatAI"
  this.chatAIButton.setTitleForState("MNChatAI: "+(taskConfig.checkLogoStatus("MNChatAI")?"✅":"❌"),0)
  this.chatAIButton.titleLabel.font = UIFont.boldSystemFontOfSize(16)
  MNButton.setColor(this.chatAIButton, taskConfig.checkLogoStatus("MNChatAI")?"#457bd3":"#9bb2d6",0.8)

  this.createButton("snipasteButton","toggleAddonLogo:","advanceView")
  this.snipasteButton.layer.opacity = 1.0
  this.snipasteButton.addon = "MNSnipaste"
  this.snipasteButton.setTitleForState("MNSnipaste: "+(taskConfig.checkLogoStatus("MNSnipaste")?"✅":"❌"),0)
  this.snipasteButton.titleLabel.font = UIFont.boldSystemFontOfSize(16)
  MNButton.setColor(this.snipasteButton, taskConfig.checkLogoStatus("MNSnipaste")?"#457bd3":"#9bb2d6",0.8)

  this.createButton("autoStyleButton","toggleAddonLogo:","advanceView")
  this.autoStyleButton.layer.opacity = 1.0
  this.autoStyleButton.addon = "MNAutoStyle"
  this.autoStyleButton.setTitleForState("MNAutoStyle: "+(taskConfig.checkLogoStatus("MNAutoStyle")?"✅":"❌"),0)
  this.autoStyleButton.titleLabel.font = UIFont.boldSystemFontOfSize(16)
  MNButton.setColor(this.autoStyleButton, taskConfig.checkLogoStatus("MNAutoStyle")?"#457bd3":"#9bb2d6",0.8)
  
  this.createButton("browserButton","toggleAddonLogo:","advanceView")
  this.browserButton.layer.opacity = 1.0
  this.browserButton.addon = "MNBrowser"
  this.browserButton.setTitleForState("MNBrowser: "+(taskConfig.checkLogoStatus("MNBrowser")?"✅":"❌"),0)
  this.browserButton.titleLabel.font = UIFont.boldSystemFontOfSize(16)
  MNButton.setColor(this.browserButton, taskConfig.checkLogoStatus("MNBrowser")?"#457bd3":"#9bb2d6",0.8)

  this.createButton("OCRButton","toggleAddonLogo:","advanceView")
  this.OCRButton.layer.opacity = 1.0
  this.OCRButton.addon = "MNOCR"
  this.OCRButton.setTitleForState("MNOCR: "+(taskConfig.checkLogoStatus("MNOCR")?"✅":"❌"),0)
  this.OCRButton.titleLabel.font = UIFont.boldSystemFontOfSize(16)
  MNButton.setColor(this.OCRButton, taskConfig.checkLogoStatus("MNOCR")?"#457bd3":"#9bb2d6",0.8)

  this.createButton("timerButton","toggleAddonLogo:","advanceView")
  this.timerButton.layer.opacity = 1.0
  this.timerButton.addon = "MNTimer"
  this.timerButton.setTitleForState("MNTimer: "+(taskConfig.checkLogoStatus("MNTimer")?"✅":"❌"),0)
  this.timerButton.titleLabel.font = UIFont.boldSystemFontOfSize(16)
  MNButton.setColor(this.timerButton, taskConfig.checkLogoStatus("MNTimer")?"#457bd3":"#9bb2d6",0.8)

  this.creatTextView("hexInput","advanceView","#9bb2d6")
  this.createButton("hexButton","saveButtonColor:","advanceView")
  this.hexButton.layer.opacity = 1.0
  this.hexButton.addon = "MNOCR"
  this.hexButton.setTitleForState("Save Color",0)
  this.hexButton.titleLabel.font = UIFont.boldSystemFontOfSize(16)
  this.hexInput.text = taskConfig.buttonConfig.color
  MNButton.setColor(this.hexButton, taskConfig.checkLogoStatus("MNOCR")?"#457bd3":"#9bb2d6",0.8)

  this.createButton("iCloudButton","toggleICloudSync:","advanceView")
  let iCloudSync = taskConfig.iCloudSync
  
  MNButton.setColor(this.iCloudButton, iCloudSync?"#457bd3":"#9bb2d6",0.8)
  MNButton.setTitle(this.iCloudButton, "iCloud Sync "+(iCloudSync? "✅":"❌"),undefined, true)

  this.createButton("exportButton","exportConfigTapped:","advanceView")
  MNButton.setTitle(this.exportButton, "Export",undefined, true)
  MNButton.setColor(this.exportButton, "#457bd3",0.8)

  this.createButton("importButton","importConfigTapped:","advanceView")
  MNButton.setColor(this.importButton, "#457bd3",0.8)
  MNButton.setTitle(this.importButton, "Import",undefined, true)

  this.createButton("directionButton","changeTaskDirection:","advanceView")
  MNButton.setColor(this.directionButton, "#457bd3",0.8)
  MNButton.setTitle(this.directionButton, "Task Direction",undefined, true)

  this.createButton("dynamicOrderButton","toggleDynamicOrder:","advanceView")
  MNButton.setColor(this.dynamicOrderButton, "#457bd3",0.8)
  MNButton.setTitle(this.dynamicOrderButton, "Enable Dynamic Order: "+(taskConfig.getWindowState("dynamicOrder")?"✅":"❌"),undefined,true)

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
  this.templateButton.setImageForState(taskConfig.templateImage,0)
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
  this.resizeButton.setImageForState(taskConfig.curveImage,0)
  MNButton.setConfig(this.resizeButton, {cornerRadius:20,color:"#ffffff",alpha:0.})
  this.resizeButton.width = 25
  this.resizeButton.height = 25


  this.createButton("runButton","configRunTapped:","configView")
  MNButton.setConfig(this.runButton, {opacity:0.8,color:"#e06c75"})
  this.runButton.layer.cornerRadius = 6
  // MNButton.setConfig(this.runButton, {opacity:1.0,title:"▶️",font:25,color:"#ffffff",alpha:0.})
  this.runButton.setImageForState(taskConfig.runImage,0)
  this.runButton.width = 26
  this.runButton.height = 26

  let color = ["#ffffb4","#ccfdc4","#b4d1fb","#f3aebe","#ffff54","#75fb4c","#55bbf9","#ea3323","#ef8733","#377e47","#173dac","#be3223","#ffffff","#dadada","#b4b4b4","#bd9fdc"]

  // Task Board 视图内容
  this.createButton("focusRootNoteButton","focusRootNoteId:","taskBoardView")
  MNButton.setConfig(this.focusRootNoteButton, {title:"Focus",color:"#457bd3",alpha:0.8})
  
  this.createButton("clearRootNoteButton","clearRootNoteId:","taskBoardView")
  MNButton.setConfig(this.clearRootNoteButton, {title:"Clear",color:"#9bb2d6",alpha:0.8})
  
  this.createButton("pasteRootNoteButton","pasteRootNoteId:","taskBoardView")
  MNButton.setConfig(this.pasteRootNoteButton, {title:"Paste",color:"#9bb2d6",alpha:0.8})

  // 添加说明文本
  this.createButton("rootNoteLabel","","taskBoardView")
  MNButton.setConfig(this.rootNoteLabel, {
    title:"Task Board Root Note:",
    color:"#457bd3",
    alpha:0.3,
    font:16,
    bold:true
  })
  this.rootNoteLabel.userInteractionEnabled = false
  
  // 更新标签显示
  this.updateRootNoteLabel()
  
  // 创建目标看板
  this.createBoardBinding({
    key: 'target',
    title: '目标看板:',
    parent: 'taskBoardView'
  })
  
} catch (error) {
  taskUtils.addErrorLog(error, "createSettingView")
}
}

/**
 * 更新根目录标签显示
 * @this {settingController}
 */
taskSettingController.prototype.updateRootNoteLabel = function() {
  let rootNoteId = taskConfig.getRootNoteId()
  let title = rootNoteId ? "Task Board Root Note: ✅" : "Task Board Root Note: ❌"
  MNButton.setConfig(this.rootNoteLabel, {
    title: title
  })
}

/**
 * 创建通用的看板绑定组件
 * @this {settingController}
 * @param {Object} config - 看板配置
 * @param {string} config.key - 看板唯一标识 (如 'root', 'target')
 * @param {string} config.title - 看板标题 (如 '根目录看板', '目标看板')
 * @param {string} config.parent - 父视图名称
 */
taskSettingController.prototype.createBoardBinding = function(config) {
  const {key, title, parent} = config
  const keyCapitalized = key.charAt(0).toUpperCase() + key.slice(1)
  
  // 创建标签
  const labelName = `${key}BoardLabel`
  this.createButton(labelName, "", parent)
  MNButton.setConfig(this[labelName], {
    title: title,
    color: "#457bd3",
    alpha: 0.3,
    font: 16,
    bold: true
  })
  this[labelName].userInteractionEnabled = false
  
  // 创建 Focus 按钮
  const focusButtonName = `focus${keyCapitalized}BoardButton`
  this.createButton(focusButtonName, `focus${keyCapitalized}Board:`, parent)
  MNButton.setConfig(this[focusButtonName], {
    title: "Focus",
    color: "#457bd3",
    alpha: 0.8
  })
  
  // 创建 Clear 按钮
  const clearButtonName = `clear${keyCapitalized}BoardButton`
  this.createButton(clearButtonName, `clear${keyCapitalized}Board:`, parent)
  MNButton.setConfig(this[clearButtonName], {
    title: "Clear",
    color: "#9bb2d6",
    alpha: 0.8
  })
  
  // 创建 Paste 按钮
  const pasteButtonName = `paste${keyCapitalized}BoardButton`
  this.createButton(pasteButtonName, `paste${keyCapitalized}Board:`, parent)
  MNButton.setConfig(this[pasteButtonName], {
    title: "Paste",
    color: "#9bb2d6",
    alpha: 0.8
  })
  
  // 更新标签显示
  this.updateBoardLabel(key)
}

/**
 * 更新看板标签显示
 * @this {settingController}
 * @param {string} key - 看板唯一标识
 */
taskSettingController.prototype.updateBoardLabel = function(key) {
  const labelName = `${key}BoardLabel`
  const noteId = taskConfig.getBoardNoteId ? taskConfig.getBoardNoteId(key) : 
                 (key === 'root' ? taskConfig.getRootNoteId() : null)
  
  // 获取标签的基础标题
  let baseTitle = ""
  if (key === 'root') {
    baseTitle = "Task Board Root Note:"
  } else if (key === 'target') {
    baseTitle = "目标看板:"
  } else {
    baseTitle = `${key} 看板:`
  }
  
  const title = noteId ? `${baseTitle} ✅` : `${baseTitle} ❌`
  if (this[labelName]) {
    MNButton.setConfig(this[labelName], {
      title: title
    })
  }
}

/**
 * @this {settingController}
 */
taskSettingController.prototype.setButtonText = function (names=taskConfig.getAllActions(),highlight=this.selectedItem) {
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
      MNButton.setImage(this[buttonName], taskConfig.imageConfigs[word])
    })
    this.refreshLayout()
}

/**
 * @this {settingController}
 */
taskSettingController.prototype.setTextview = function (name = this.selectedItem) {
  try {
      // let entries           =  NSUserDefaults.standardUserDefaults().objectForKey('MNBrowser_entries');
      // let actions = taskConfig.actions
      // let defaultActions = taskConfig.getActions()
      let action = taskConfig.getAction(name)
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
      //   actions = taskConfig.getActions()
      //   description = action.description
      //   this.preAction = name
      //   this.setWebviewContent(description)
      // }
  } catch (error) {
    taskUtils.addErrorLog(error, "setTextview")
  }
}
/**
 * @this {settingController}
 */
taskSettingController.prototype.refreshLayout = function () {
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

taskSettingController.prototype.refreshView = function (name) {
  switch (name) {
    case "advanceView":
        this.editorButton.setTitleForState("MNEditor: "+(taskConfig.checkLogoStatus("MNEditor")?"✅":"❌"),0)
        MNButton.setColor(this.editorButton, taskConfig.checkLogoStatus("MNEditor")?"#457bd3":"#9bb2d6",0.8)

        this.chatAIButton.setTitleForState("MNChatAI: "+(taskConfig.checkLogoStatus("MNChatAI")?"✅":"❌"),0)
        MNButton.setColor(this.chatAIButton, taskConfig.checkLogoStatus("MNChatAI")?"#457bd3":"#9bb2d6",0.8)

        this.snipasteButton.setTitleForState("MNSnipaste: "+(taskConfig.checkLogoStatus("MNSnipaste")?"✅":"❌"),0)
        MNButton.setColor(this.snipasteButton, taskConfig.checkLogoStatus("MNSnipaste")?"#457bd3":"#9bb2d6",0.8)

        this.autoStyleButton.setTitleForState("MNAutoStyle: "+(taskConfig.checkLogoStatus("MNAutoStyle")?"✅":"❌"),0)
        MNButton.setColor(this.autoStyleButton, taskConfig.checkLogoStatus("MNAutoStyle")?"#457bd3":"#9bb2d6",0.8)

        this.browserButton.setTitleForState("MNBrowser: "+(taskConfig.checkLogoStatus("MNBrowser")?"✅":"❌"),0)
        MNButton.setColor(this.browserButton, taskConfig.checkLogoStatus("MNBrowser")?"#457bd3":"#9bb2d6",0.8)

        this.OCRButton.setTitleForState("MNOCR: "+(taskConfig.checkLogoStatus("MNOCR")?"✅":"❌"),0)
        MNButton.setColor(this.OCRButton, taskConfig.checkLogoStatus("MNOCR")?"#457bd3":"#9bb2d6",0.8)

        this.timerButton.setTitleForState("MNTimer: "+(taskConfig.checkLogoStatus("MNTimer")?"✅":"❌"),0)
        MNButton.setColor(this.timerButton, taskConfig.checkLogoStatus("MNTimer")?"#457bd3":"#9bb2d6",0.8)

        this.hexInput.text = taskConfig.buttonConfig.color
        MNButton.setColor(this.hexButton, "#457bd3",0.8)

        let iCloudSync = taskConfig.iCloudSync

        MNButton.setColor(this.iCloudButton, iCloudSync?"#457bd3":"#9bb2d6",0.8)
        MNButton.setTitle(this.iCloudButton, "iCloud Sync "+(iCloudSync? "✅":"❌"),undefined, true)
      break;
    case "popupEditView":
      taskConfig.allPopupButtons.forEach(buttonName=>{
        let replaceButtonName = "replacePopupButton_"+buttonName
        let replaceSwtichName = "replacePopupSwtich_"+buttonName
        let replaceButton = this[replaceButtonName]
        replaceButton.id = buttonName
        let target = taskConfig.getPopupConfig(buttonName).target
        if (target) {
          let actionName = taskConfig.getAction(taskConfig.getPopupConfig(buttonName).target).name
          MNButton.setConfig(replaceButton, {color:"#558fed",alpha:0.9,opacity:1.0,title:buttonName+": "+actionName,font:17,radius:10,bold:true})
        }else{
          MNButton.setConfig(replaceButton, {color:"#558fed",alpha:0.9,opacity:1.0,title:buttonName+": ",font:17,radius:10,bold:true})
        }
        let replaceSwtich = this[replaceSwtichName]
        replaceSwtich.id = buttonName
        replaceSwtich.on = taskConfig.getPopupConfig(buttonName).enabled
      })
    default:
      break;
  }
}

taskSettingController.prototype.hideAllButton = function (frame) {
  this.moveButton.hidden = true
  // this.closeButton.hidden = true
  this.maxButton.hidden = true
}
taskSettingController.prototype.showAllButton = function (frame) {
  this.moveButton.hidden = false
  // this.closeButton.hidden = false
  this.maxButton.hidden = false
}
/**
 * @this {settingController}
 */
taskSettingController.prototype.show = function (frame) {
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
  // let allActions = taskConfig.getAllActions(isEditingDynamic)
  // let allActions = taskConfig.getAllActions()// taskConfig.action.concat(taskConfig.getDefaultActionKeys().slice(taskConfig.action.length))
  // this.setButtonText(allActions,this.selectedItem)
  this.taskController.setTaskButton(taskConfig.action)
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
taskSettingController.prototype.hide = function (frame) {
  taskUtils.studyController().view.bringSubviewToFront(this.addonBar)
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

taskSettingController.prototype.creatView = function (viewName,superview="view",color="#9bb2d6",alpha=0.8) {
  this[viewName] = UIView.new()
  MNButton.setColor(this[viewName], color, alpha)
  this[viewName].layer.cornerRadius = 12
  this[superview].addSubview(this[viewName])
}

taskSettingController.prototype.creatTextView = function (viewName,superview="view",color="#c0bfbf",alpha=0.8) {
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
taskSettingController.prototype.fetch = async function (url,options = {}){
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

taskSettingController.prototype.initRequest = function (url,options) {
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
taskSettingController.prototype.createWebviewInput = function (superView) {
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
taskSettingController.prototype.loadWebviewContent = function () {
  this.webviewInput.loadFileURLAllowingReadAccessToURL(
    NSURL.fileURLWithPath(this.mainPath + '/jsoneditor.html'),
    NSURL.fileURLWithPath(this.mainPath + '/')
  );
}
/**
 * @this {settingController}
 */
taskSettingController.prototype.updateWebviewContent = function (content) {
  if (!MNUtil.isValidJSON(content)) {
    content = "{}"
  }
  this.runJavaScript(`updateContent('${encodeURIComponent(content)}')`)
}
/**
 * @this {settingController}
 */
taskSettingController.prototype.setWebviewContent = function (content) {
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
taskSettingController.prototype.setJSContent = function (content) {
  this.webviewInput.loadHTMLStringBaseURL(taskUtils.JShtml(content))
}

/**
 * @this {settingController}
 */
taskSettingController.prototype.blur = async function () {
  this.runJavaScript(`removeFocus()`)
  this.webviewInput.endEditing(true)
}

/**
 * @this {settingController}
 */
taskSettingController.prototype.getWebviewContent = async function () {
  // let content = await this.runJavaScript(`updateContent(); document.body.innerText`)
  let content = await this.runJavaScript(`getContent()`)
  let tem = decodeURIComponent(content)
  this.webviewInput.endEditing(true)
  return tem
}

/** @this {settingController} */
taskSettingController.prototype.runJavaScript = async function(script) {
  // if(!this.webviewResponse || !this.webviewResponse.window)return;
  return new Promise((resolve, reject) => {
      this.webviewInput.evaluateJavaScript(script,(result) => {resolve(result)});
  })
};
/** @this {settingController} */
taskSettingController.prototype.editorAdjustSelectWidth = function (){
  this.webviewInput.evaluateJavaScript(`adjustSelectWidth()`)
}
taskSettingController.prototype.checkPopoverController = function () {
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
taskSettingController.prototype.tableItem = function (title,selector,param = "",checked = false) {
  return {title:title,object:this,selector:selector,param:param,checked:checked}
}
/**
 * 
 * @param {string} title 
 * @param {number} duration 
 * @param {UIView} view 
 */
taskSettingController.prototype.showHUD = function (title,duration = 1.5,view = this.view) {
  MNUtil.showHUD(title,duration,view)
}
/**
 * 
 * @type {taskController}
 */
taskSettingController.prototype.taskController