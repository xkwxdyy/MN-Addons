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

/**
 * MNTask 设置控制器 - 采用 JSB 框架的事件驱动架构
 * 
 * ## 架构说明
 * 
 * ### 方法定义规则
 * 1. **事件处理方法** - 在 JSB.defineClass 中定义
 *    - 响应 UI 事件（按钮点击、手势等）
 *    - 必须通过 `let self = getTaskSettingController()` 获取实例
 *    - 示例：`focusTargetBoard`, `clearTargetBoard` 等
 * 
 * 2. **通用/可复用方法** - 在 prototype 上定义
 *    - 业务逻辑和工具函数
 *    - 可以被事件处理方法调用
 *    - 示例：`focusBoard`, `clearBoard`, `createBoardBinding` 等
 * 
 * ### 多看板管理架构
 * - 使用 `createBoardBinding` 创建统一的看板 UI
 * - 每个看板需要三个事件处理方法：focus、clear、paste
 * - 通用操作逻辑抽象到 prototype 方法中
 * 
 * @example
 * // 添加新看板
 * // 1. 在 createSettingView 中创建 UI
 * this.createBoardBinding({key: 'newBoard', title: '新看板:', parent: 'taskBoardView'})
 * 
 * // 2. 在 JSB.defineClass 中添加事件处理
 * focusNewBoardBoard: function() {
 *   let self = getTaskSettingController()
 *   self.focusBoard('newBoard')
 * }
 */

/** @return {taskSettingController} */
const getTaskSettingController = ()=>self
var taskSettingController = JSB.defineClass('taskSettingController : UIViewController <NSURLConnectionDelegate,UIImagePickerControllerDelegate,UIWebViewDelegate>', {
  viewDidLoad: function() {
    let self = getTaskSettingController()
try {
    // 记录插件初始化开始
    TaskLogManager.info("MNTask 设置面板开始初始化", "SettingController")
    
    // 添加一些测试日志
    TaskLogManager.debug("调试信息：初始化参数", "SettingController", JSON.stringify({
      viewFrame: self.view.frame,
      timestamp: Date.now()
    }))
    TaskLogManager.warn("警告：这是一条测试警告", "SettingController")
    
    self.init()
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
    
    // 记录初始化成功
    TaskLogManager.info("MNTask 设置面板初始化完成", "SettingController")
} catch (error) {
  // 记录初始化错误
  TaskLogManager.error("MNTask 设置面板初始化失败", "SettingController", error)
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
      
      // 默认显示看板视图
      self.viewManager.switchTo('todayBoard')
    } catch (error) {  
      taskUtils.addErrorLog(error, "viewDidLoad.setButtonText", info)
    }
  },
  viewWillAppear: function(animated) {
  },
  viewWillDisappear: function(animated) {
    let self = getTaskSettingController()
    // 清理任务更新定时器
    if (self.taskUpdateTimer) {
      self.taskUpdateTimer.invalidate()
      self.taskUpdateTimer = null
      MNUtil.log("🔄 任务更新监听器已停止")
    }
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
    
    // 添加调试日志
    MNUtil.log(`🔗 WebView 请求: ${requestURL}`)
    TaskLogManager.debug("WebView URL 请求", "WebView", requestURL)
    
    if (!requestURL) {
      MNUtil.showHUD("Empty URL")
      return false
    }
    
    // 更严格的判断，确保是明确的复制请求
    if (/^nativecopy\:\/\/content=/.test(requestURL)) {
      let text = decodeURIComponent(requestURL.split("content=")[1])
      MNUtil.log(`📋 准备复制内容: ${text}`)
      TaskLogManager.info(`复制到剪贴板: ${text}`, "WebView")
      MNUtil.copy(text)
      return false
    }
    
    // 处理今日看板的自定义协议
    if (requestURL.startsWith("mntask://")) {
      self.handleTodayBoardProtocol(requestURL)
      return false
    }
    
    // 处理日志查看器的自定义协议
    if (requestURL.startsWith("mnlog://")) {
      self.handleLogProtocol(requestURL)
      return false
    }
    
    return true;
    } catch (error) {
      taskUtils.addErrorLog(error, "webViewShouldStartLoadWithRequestNavigationType")
      return false
    }
  },
  webViewDidFinishLoad: function(webView) {
    let self = getTaskSettingController()
    try {
      MNUtil.log("🔔 webViewDidFinishLoad 被调用")
      MNUtil.log(`📱 WebView 实例: ${webView}`)
      MNUtil.log(`📱 今日看板 WebView 实例: ${self.todayBoardWebViewInstance}`)
      MNUtil.log(`📱 是今日看板?: ${webView === self.todayBoardWebViewInstance}`)
      
      // 检查是否是今日看板的 WebView
      if (webView === self.todayBoardWebViewInstance) {
        // 标记初始化完成
        self.todayBoardWebViewInitialized = true
        
        MNUtil.log("✅ 今日看板 WebView 加载完成，准备延迟加载数据")
        MNUtil.log(`📊 今日看板初始化状态: ${self.todayBoardWebViewInitialized}`)
        
        // 延迟加载数据，确保 JavaScript 环境完全就绪
        MNUtil.delay(0.5).then(() => {
          MNUtil.log("🚀 开始加载今日看板数据")
          self.loadTodayBoardData()
        })
      } else {
        MNUtil.log("⚠️ 未识别的 WebView 实例")
        MNUtil.log(`📱 WebView URL: ${webView.URL ? webView.URL.absoluteString() : 'undefined'}`)
        MNUtil.log(`📱 WebView 标题: ${webView.title ? webView.title : 'undefined'}`)
      }
    } catch (error) {
      MNUtil.log(`❌ webViewDidFinishLoad 出错: ${error.message}`)
      MNUtil.log(`📍 错误堆栈: ${error.stack}`)
      taskUtils.addErrorLog(error, "webViewDidFinishLoad")
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
    // 使用 TaskLogManager 记录错误
    TaskLogManager.error("重置配置失败", "SettingController", error)
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
    // 记录视图切换
    TaskLogManager.info("切换到高级设置视图", "SettingController")
    self.viewManager.switchTo('advanced')
  },
  taskBoardButtonTapped: function (params) {
    let self = getTaskSettingController()
    // 记录视图切换
    TaskLogManager.info("切换到任务看板视图", "SettingController")
    self.viewManager.switchTo('taskBoard')
  },
  todayBoardButtonTapped: function (params) {
    let self = getTaskSettingController()
    // 记录视图切换
    TaskLogManager.info("切换到今日看板视图", "SettingController")
    MNUtil.log("🎯 todayBoardButtonTapped 被调用")
    MNUtil.log(`📱 按钮信息: ${params}`)
    
    // 检查是否有剪贴板内容被意外复制
    const clipboardBefore = MNUtil.clipboardText
    MNUtil.log(`📋 切换前剪贴板: ${clipboardBefore}`)
    
    self.viewManager.switchTo('todayBoard')
    
    // 检查切换后剪贴板是否改变
    MNUtil.delay(0.1).then(() => {
      const clipboardAfter = MNUtil.clipboardText
      if (clipboardBefore !== clipboardAfter) {
        MNUtil.log(`⚠️ 剪贴板内容改变了！新内容: ${clipboardAfter}`)
      }
    })
  },
  popupButtonTapped: function (params) {
    let self = getTaskSettingController()
    // 记录视图切换
    TaskLogManager.info("切换到弹窗配置视图", "SettingController")
    self.viewManager.switchTo('popup')
  },
  configButtonTapped: function (params) {
    let self = getTaskSettingController()
    // 记录视图切换
    TaskLogManager.info("切换到配置视图", "SettingController")
    if (self.viewManager) {
      self.viewManager.switchTo('config')
    }
  },
  dynamicButtonTapped: async function (params) {
    let self = getTaskSettingController()
    // 记录视图切换
    TaskLogManager.info("切换到动态视图", "SettingController")
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
      // 使用 TaskLogManager 记录错误
      TaskLogManager.error("复制配置失败", "SettingController", error)
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
    let self = getTaskSettingController()
    self.focusBoard('target')
  },
  
  clearTargetBoard: async function() {
    let self = getTaskSettingController()
    await self.clearBoard('target')
  },
  
  pasteTargetBoard: async function() {
    let self = getTaskSettingController()
    await self.pasteBoard('target')
  },
  
  // 项目看板处理方法
  focusProjectBoard: function() {
    let self = getTaskSettingController()
    self.focusBoard('project')
  },
  
  clearProjectBoard: async function() {
    let self = getTaskSettingController()
    await self.clearBoard('project')
  },
  
  pasteProjectBoard: async function() {
    let self = getTaskSettingController()
    await self.pasteBoard('project')
  },
  
  // 动作看板处理方法
  focusActionBoard: function() {
    let self = getTaskSettingController()
    self.focusBoard('action')
  },
  
  clearActionBoard: async function() {
    let self = getTaskSettingController()
    await self.clearBoard('action')
  },
  
  pasteActionBoard: async function() {
    let self = getTaskSettingController()
    await self.pasteBoard('action')
  },
  
  // 已完成存档区看板处理方法
  focusCompletedBoard: function() {
    let self = getTaskSettingController()
    self.focusBoard('completed')
  },
  
  clearCompletedBoard: async function() {
    let self = getTaskSettingController()
    await self.clearBoard('completed')
  },
  
  pasteCompletedBoard: async function() {
    let self = getTaskSettingController()
    await self.pasteBoard('completed')
  },
  
  // 今日看板处理方法
  focusTodayBoard: function() {
    let self = getTaskSettingController()
    self.focusBoard('today')
  },
  
  clearTodayBoard: async function() {
    let self = getTaskSettingController()
    await self.clearBoard('today')
  },
  
  pasteTodayBoard: async function() {
    let self = getTaskSettingController()
    await self.pasteBoard('today')
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
  cleanEmptyConfigs: async function() {
    let self = getTaskSettingController()
    
    // 确认对话框
    const confirm = await MNUtil.confirm(
      "清理空配置", 
      "此操作将清理所有未使用的笔记本配置，释放 iCloud 存储空间。是否继续？"
    )
    
    if (!confirm) return
    
    // 显示处理中
    MNUtil.showHUD("正在清理空配置...")
    
    // 执行清理
    const result = await taskConfig.cleanEmptyNotebookConfigs()
    
    // 显示结果
    if (result.cleanedCount > 0) {
      MNUtil.showHUD(`✅ 成功清理 ${result.cleanedCount} 个空配置`)
      
      // 同步到 iCloud
      if (taskConfig.iCloudSync) {
        taskConfig.cloudStore.synchronize()
      }
    } else if (result.checkedCount > 0) {
      MNUtil.showHUD(`✅ 检查了 ${result.checkedCount} 个配置，没有需要清理的空配置`)
    } else {
      MNUtil.showHUD("❌ 清理失败，请稍后重试")
    }
  },
  resetAllConfigs: async function() {
    let self = getTaskSettingController()
    
    // 强警告对话框
    const confirm = await MNUtil.confirm(
      "⚠️ 重置所有配置", 
      "此操作将删除所有 MNTask 配置（包括本地和 iCloud），所有看板绑定将被清除。此操作不可恢复！\n\n确定要继续吗？"
    )
    
    if (!confirm) return
    
    // 二次确认
    const doubleConfirm = await MNUtil.confirm(
      "⚠️ 最终确认", 
      "真的要删除所有配置吗？所有任务看板设置都将丢失！"
    )
    
    if (!doubleConfirm) return
    
    // 显示处理中
    MNUtil.showHUD("正在重置所有配置...")
    
    try {
      // 执行重置
      await taskConfig.resetAllConfigs()
      
      MNUtil.showHUD("✅ 所有配置已重置")
      
      // 关闭设置面板
      MNUtil.delay(1).then(() => {
        self.closeButtonTapped()
        
        // 通知刷新视图
        MNUtil.postNotification("refreshView", {})
      })
      
    } catch (error) {
      MNUtil.showHUD("❌ 重置失败：" + error.message)
      MNUtil.addErrorLog(error, "resetAllConfigs")
    }
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
  this.initViewManager();
}


/**
 * 初始化视图管理器
 * @this {taskSettingController}
 */
taskSettingController.prototype.initViewManager = function() {
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
          self.updateBoardLabel('project')
          self.updateBoardLabel('action')
          self.updateBoardLabel('completed')
          self.settingViewLayout()
        }
      },
      todayBoard: {
        view: 'todayBoardWebView',
        button: 'todayBoardButton',
        selectedColor: '#457bd3',
        normalColor: '#9bb2d6',
        onShow: function(self) {
          MNUtil.log("🎯 切换到看板视图")
          // 首次显示时创建 WebView
          if (!self.todayBoardWebViewInitialized) {
            MNUtil.log("📱 首次显示，需要初始化 WebView")
            self.initTodayBoardWebView()
          } else {
            // 如果已经初始化，刷新数据
            MNUtil.log("♻️ WebView 已初始化，刷新数据")
            self.loadTodayBoardData()
          }
        }
      }
    },
    
    // 切换到指定视图
    switchTo: function(viewName) {
      const viewConfig = self.viewManager.views[viewName]
      
      if (!viewConfig) {
        return
      }
      
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
    
    // 设置 tabView 内部的按钮 - 看板按钮在最前
    taskFrame.set(this.todayBoardButton, 5, 0)
    taskFrame.set(this.configButton, this.todayBoardButton.frame.x + this.todayBoardButton.frame.width+5, 0)
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
    taskFrame.set(this.cleanConfigButton, 5, 325, width-10,35)
    taskFrame.set(this.resetAllConfigsButton, 5, 365, width-10,35)
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
    
    // 项目看板
    taskFrame.set(this.projectBoardLabel, 10, 210, width-20, 35)
    taskFrame.set(this.focusProjectBoardButton, 10, 255, (width-30)/3, 35)
    taskFrame.set(this.clearProjectBoardButton, 15+(width-30)/3, 255, (width-30)/3, 35)
    taskFrame.set(this.pasteProjectBoardButton, 20+2*(width-30)/3, 255, (width-30)/3, 35)
    
    // 动作看板
    taskFrame.set(this.actionBoardLabel, 10, 310, width-20, 35)
    taskFrame.set(this.focusActionBoardButton, 10, 355, (width-30)/3, 35)
    taskFrame.set(this.clearActionBoardButton, 15+(width-30)/3, 355, (width-30)/3, 35)
    taskFrame.set(this.pasteActionBoardButton, 20+2*(width-30)/3, 355, (width-30)/3, 35)
    
    // 已完成存档区
    taskFrame.set(this.completedBoardLabel, 10, 410, width-20, 35)
    taskFrame.set(this.focusCompletedBoardButton, 10, 455, (width-30)/3, 35)
    taskFrame.set(this.clearCompletedBoardButton, 15+(width-30)/3, 455, (width-30)/3, 35)
    taskFrame.set(this.pasteCompletedBoardButton, 20+2*(width-30)/3, 455, (width-30)/3, 35)
    
    // 今日看板 - 已移至 WebView 实现，注释掉旧的布局
    // taskFrame.set(this.todayBoardLabel, 10, 510, width-20, 35)
    // taskFrame.set(this.focusTodayBoardButton, 10, 555, (width-30)/3, 35)
    // taskFrame.set(this.clearTodayBoardButton, 15+(width-30)/3, 555, (width-30)/3, 35)
    // taskFrame.set(this.pasteTodayBoardButton, 20+2*(width-30)/3, 555, (width-30)/3, 35)
    
    // 设置 ScrollView 的 contentSize，为多个看板预留空间（已移除今日看板）
    this.taskBoardView.contentSize = {width: width-2, height: 600}
    
    // 今日看板 WebView 布局
    taskFrame.set(this.todayBoardWebView, 0, 0, width-2, height-60)
    
    // 如果 WebView 实例存在，更新其 frame
    if (this.todayBoardWebViewInstance) {
      this.todayBoardWebViewInstance.frame = {
        x: 0,
        y: 0,
        width: this.todayBoardWebView.bounds.width,
        height: this.todayBoardWebView.bounds.height
      }
    }
    
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
  
  // 创建今日看板视图（包含 WebView）
  this.creatView("todayBoardWebView","settingView","#9bb2d6",0.0)
  this.todayBoardWebView.hidden = true


  this.createButton("todayBoardButton","todayBoardButtonTapped:","tabView")
  MNButton.setConfig(this.todayBoardButton, {color:"#457bd3",alpha:0.9,opacity:1.0,title:"看板",font:17,radius:10,bold:true})
  this.todayBoardButton.width = this.todayBoardButton.sizeThatFits({width:150,height:30}).width+15
  this.todayBoardButton.height = 30
  this.todayBoardButton.selected = true
  
  this.createButton("configButton","configButtonTapped:","tabView")
  MNButton.setConfig(this.configButton, {alpha:0.9,opacity:1.0,title:"Buttons",font:17,radius:10,bold:true})
  this.configButton.width = this.configButton.sizeThatFits({width:150,height:30}).width+15
  this.configButton.height = 30
  this.configButton.selected = false

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

  this.createButton("cleanConfigButton","cleanEmptyConfigs:","advanceView")
  MNButton.setColor(this.cleanConfigButton, "#d67b5c",0.8)
  MNButton.setTitle(this.cleanConfigButton, "清理空配置 🧹",undefined,true)

  this.createButton("resetAllConfigsButton","resetAllConfigs:","advanceView")
  MNButton.setColor(this.resetAllConfigsButton, "#ff3b30",0.9)
  MNButton.setTitle(this.resetAllConfigsButton, "⚠️ 重置所有配置",undefined,true)

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
    title:"任务管理总看板:",
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
  
  // 创建项目看板
  this.createBoardBinding({
    key: 'project',
    title: '项目看板:',
    parent: 'taskBoardView'
  })
  
  // 创建动作看板
  this.createBoardBinding({
    key: 'action',
    title: '动作看板:',
    parent: 'taskBoardView'
  })
  
  // 创建已完成存档区看板
  this.createBoardBinding({
    key: 'completed',
    title: '已完成存档区:',
    parent: 'taskBoardView'
  })
  
  // 创建今日看板 - 已移至 WebView 实现，注释掉旧的实现
  // this.createBoardBinding({
  //   key: 'today',
  //   title: '今日看板:',
  //   parent: 'taskBoardView'
  // })
  
  // 创建今日看板的 WebView
  this.createTodayBoardWebView()
  
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
  let title = rootNoteId ? "任务管理总看板: ✅" : "任务管理总看板: ❌"
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
  const focusSelector = `focus${keyCapitalized}Board:`
  this.createButton(focusButtonName, focusSelector, parent)
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
  const noteId = taskConfig.getBoardNoteId(key)
  
  // 获取标签的基础标题
  let baseTitle = ""
  if (key === 'root') {
    baseTitle = "任务管理总看板:"
  } else if (key === 'target') {
    baseTitle = "目标看板:"
  } else if (key === 'project') {
    baseTitle = "项目看板:"
  } else if (key === 'action') {
    baseTitle = "动作看板:"
  } else if (key === 'completed') {
    baseTitle = "已完成存档区:"
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
 * 通用看板操作方法 - Focus
 * @this {settingController}
 * @param {string} boardKey - 看板唯一标识
 */
taskSettingController.prototype.focusBoard = function(boardKey) {
  // 记录聚焦看板操作
  TaskLogManager.info(`聚焦看板: ${boardKey}`, "SettingController")
  
  let noteId = taskConfig.getBoardNoteId(boardKey)
  if (!noteId) {
    TaskLogManager.warn(`看板未设置: ${boardKey}`, "SettingController")
    this.showHUD(`❌ 未设置${this.getBoardDisplayName(boardKey)}`)
    return
  }
  
  let note = MNNote.new(noteId)
  if (note) {
    TaskLogManager.debug(`成功聚焦看板: ${boardKey}`, "SettingController", { noteId })
    note.focusInFloatMindMap()
  } else {
    TaskLogManager.error(`看板卡片不存在: ${boardKey}`, "SettingController", { noteId })
    this.showHUD("❌ 卡片不存在")
    // 清除无效的 ID
    taskConfig.clearBoardNoteId(boardKey)
    this.updateBoardLabel(boardKey)
  }
}

/**
 * 通用看板操作方法 - Clear
 * @this {settingController}
 * @param {string} boardKey - 看板唯一标识
 */
taskSettingController.prototype.clearBoard = async function(boardKey) {
  // 记录清除看板操作
  TaskLogManager.info(`清除看板: ${boardKey}`, "SettingController")
  
  // 如果没有设置看板，直接返回
  if (!taskConfig.getBoardNoteId(boardKey)) {
    TaskLogManager.warn(`看板未设置: ${boardKey}`, "SettingController")
    this.showHUD(`❌ 未设置${this.getBoardDisplayName(boardKey)}`)
    return
  }
  
  // 显示确认对话框
  const result = await MNUtil.confirm(
    "确认清除",
    `确定要清除${this.getBoardDisplayName(boardKey)}吗？`,
    ["取消", "清除"]
  )
  
  if (result === 1) {  // 用户点击了"清除"
    TaskLogManager.info(`用户确认清除看板: ${boardKey}`, "SettingController")
    taskConfig.clearBoardNoteId(boardKey)
    this.updateBoardLabel(boardKey)
    this.showHUD(`✅ 已清除${this.getBoardDisplayName(boardKey)}`)
  }
}

/**
 * 通用看板操作方法 - Paste
 * @this {settingController}
 * @param {string} boardKey - 看板唯一标识
 */
taskSettingController.prototype.pasteBoard = async function(boardKey) {
  // 记录粘贴看板操作
  TaskLogManager.info(`粘贴看板: ${boardKey}`, "SettingController")
  
  let noteId = MNUtil.clipboardText
  if (!noteId) {
    TaskLogManager.warn("剪贴板为空", "SettingController")
    this.showHUD("剪贴板为空")
    return
  }
  
  // 验证卡片是否存在
  let note = MNNote.new(noteId)
  if (!note) {
    TaskLogManager.error(`卡片不存在: ${noteId}`, "SettingController")
    this.showHUD("❌ 卡片不存在")
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
      TaskLogManager.info(`用户取消替换看板: ${boardKey}`, "SettingController")
      return
    }
  }
  
  // 保存新的看板卡片
  const oldNoteId = taskConfig.getBoardNoteId(boardKey)
  taskConfig.saveBoardNoteId(boardKey, note.noteId)
  this.updateBoardLabel(boardKey)
  
  TaskLogManager.info(`成功粘贴看板: ${boardKey}`, "SettingController", {
    oldNoteId,
    newNoteId: note.noteId
  })
  
  this.showHUD(`✅ 已保存${this.getBoardDisplayName(boardKey)}`)
}

/**
 * 获取看板显示名称
 * @this {settingController}
 * @param {string} boardKey - 看板唯一标识
 */
taskSettingController.prototype.getBoardDisplayName = function(boardKey) {
  const boardNames = {
    'root': '根目录卡片',
    'target': '目标看板',
    'project': '项目看板',
    'action': '动作看板',
    'completed': '已完成存档区'
  }
  return boardNames[boardKey] || `${boardKey}看板`
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

// ========== 今日看板 WebView 相关方法 ==========

/**
 * 创建今日看板的 WebView
 * @this {settingController}
 */
taskSettingController.prototype.createTodayBoardWebView = function() {
  try {
    MNUtil.log("🔨 开始创建今日看板 WebView")
    
    // 延迟创建 WebView，等待视图显示时再创建
    // 这样可以确保获取正确的 frame
    this.todayBoardWebViewInstance = null
    this.todayBoardWebViewInitialized = false
    
    MNUtil.log("✅ 今日看板 WebView 准备就绪，将在显示时创建")
  } catch (error) {
    taskUtils.addErrorLog(error, "createTodayBoardWebView")
    MNUtil.log("❌ 创建 WebView 失败: " + error.message)
  }
}

/**
 * 初始化今日看板 WebView
 * @this {settingController}
 */
taskSettingController.prototype.initTodayBoardWebView = function() {
  try {
    MNUtil.log("🌟 开始初始化今日看板 WebView")
    
    // 如果 WebView 实例不存在，先创建它
    if (!this.todayBoardWebViewInstance) {
      MNUtil.log("📱 创建 WebView 实例")
      
      // 获取容器的当前边界
      const containerBounds = this.todayBoardWebView.bounds
      MNUtil.log(`📐 容器边界: ${JSON.stringify(containerBounds)}`)
      
      // 创建 WebView，填充整个容器
      const webView = new UIWebView({
        x: 0, 
        y: 0, 
        width: containerBounds.width, 
        height: containerBounds.height
      })
      webView.backgroundColor = UIColor.whiteColor()
      webView.scalesPageToFit = false
      webView.autoresizingMask = (1 << 1 | 1 << 4) // 宽高自适应
      webView.delegate = this
      webView.layer.cornerRadius = 10
      webView.layer.masksToBounds = true
      
      // 将 WebView 添加到容器视图中
      this.todayBoardWebView.addSubview(webView)
      
      // 保存 WebView 引用
      this.todayBoardWebViewInstance = webView
      
      MNUtil.log("✅ WebView 实例创建成功")
    }
    
    // 加载 HTML 文件
    const htmlPath = taskConfig.mainPath + '/sidebarContainer.html'
    MNUtil.log(`📁 HTML 文件路径: ${htmlPath}`)
    
    // 检查文件是否存在
    if (!NSFileManager.defaultManager().fileExistsAtPath(htmlPath)) {
      MNUtil.log("❌ HTML 文件不存在: " + htmlPath)
      MNUtil.showHUD("找不到侧边栏容器文件")
      return
    }
    
    this.todayBoardWebViewInstance.loadFileURLAllowingReadAccessToURL(
      NSURL.fileURLWithPath(htmlPath),
      NSURL.fileURLWithPath(taskConfig.mainPath)
    )
    
    MNUtil.log("📝 已发送 HTML 加载请求，等待 webViewDidFinishLoad")
    
    // 不在这里标记初始化完成，等待 webViewDidFinishLoad
  } catch (error) {
    taskUtils.addErrorLog(error, "initTodayBoardWebView")
    MNUtil.showHUD("加载今日看板失败")
    MNUtil.log("❌ 初始化失败: " + error.message)
  }
}

/**
 * 在 WebView 中执行 JavaScript（与 MNUtils 相同的实现模式）
 * @param {string} script - 要执行的 JavaScript 代码
 * @param {string} webViewName - WebView 的名称，默认为 'todayBoardWebViewInstance'
 * @returns {Promise} 返回执行结果的 Promise
 */
taskSettingController.prototype.runJavaScriptInWebView = async function(script, webViewName = 'todayBoardWebViewInstance') {
  return new Promise((resolve, reject) => {
    try {
      if (!this[webViewName]) {
        reject(new Error(`WebView ${webViewName} not found`))
        return
      }
      
      // 使用 evaluateJavaScript 方法（与 webviewInput 保持一致）
      this[webViewName].evaluateJavaScript(script, (result) => {
        resolve(result)
      })
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 加载今日看板数据
 * @this {settingController}
 */
taskSettingController.prototype.loadTodayBoardData = async function() {
  try {
    if (!this.todayBoardWebViewInstance) {
      MNUtil.log("❌ WebView 实例不存在")
      return
    }
    
    if (!this.todayBoardWebViewInitialized) {
      MNUtil.log("❌ WebView 未初始化完成")
      return
    }
    
    // 确保 MNTaskManager 已定义
    if (typeof MNTaskManager === 'undefined') {
      MNUtil.showHUD("任务管理器未初始化")
      return
    }
    
    // 获取今日任务（使用改进的筛选逻辑）
    let todayTasks = MNTaskManager.filterTodayTasks()
    
    // 如果默认搜索没有结果，尝试全局搜索
    if (todayTasks.length === 0) {
      MNUtil.log("⚠️ 默认看板无今日任务，尝试全局搜索")
      todayTasks = MNTaskManager.filterTodayTasks({
        includeAll: true,
        statuses: ['未开始', '进行中', '已完成']
      })
    }
    
    MNUtil.log(`📊 找到 ${todayTasks.length} 个今日任务`)
    
    // 转换为适合显示的格式
    const displayTasks = todayTasks.map(task => {
      try {
        const taskInfo = MNTaskManager.parseTaskTitle(task.noteTitle)
        const priorityInfo = MNTaskManager.getTaskPriority(task)
        const timeInfo = MNTaskManager.getPlannedTime(task)
        const progressInfo = MNTaskManager.getTaskProgress(task)
        
        // 获取任务日期
        let scheduledDate = null
        const taskComments = MNTaskManager.parseTaskComments(task)
        for (let field of taskComments.taskFields) {
          if (field.content.includes('📅')) {
            const dateMatch = field.content.match(/(\d{4}-\d{2}-\d{2})/)
            if (dateMatch) {
              scheduledDate = dateMatch[1]
            }
            break
          }
        }
        
        // 检查是否过期
        const todayField = TaskFieldUtils.getFieldContent(task, "今日")
        const overdueInfo = MNTaskManager.checkIfOverdue(todayField)
        
        // 获取启动链接
        let launchLink = null
        try {
          launchLink = MNTaskManager.getLaunchLink(task)
        } catch (e) {
          // 忽略获取链接失败的错误
        }
        
        return {
          id: task.noteId,
          title: taskInfo.content || task.noteTitle,
          type: taskInfo.type || '任务',
          status: taskInfo.status || '未开始',
          priority: priorityInfo || '低',
          plannedTime: timeInfo,
          scheduledDate: scheduledDate,
          progress: progressInfo || 0,
          isOverdue: overdueInfo.isOverdue,
          overdueDays: overdueInfo.days,
          launchUrl: launchLink,
          path: taskInfo.path || ''
        }
      } catch (error) {
        MNUtil.log(`⚠️ 处理任务失败: ${error.message}`)
        // 返回基本信息
        return {
          id: task.noteId,
          title: task.noteTitle,
          type: '任务',
          status: '未知',
          priority: '低',
          plannedTime: null,
          progress: 0,
          isOverdue: false,
          overdueDays: 0,
          launchUrl: null,
          path: ''
        }
      }
    })
    
    // 先检查 WebView 状态
    const readyStateScript = `document.readyState`
    const readyState = await this.runJavaScriptInWebView(readyStateScript)
    MNUtil.log(`📄 WebView readyState: ${readyState}`)
    
    // 检查 loadTasksFromPlugin 函数是否存在
    const checkScript = `typeof loadTasksFromPlugin !== 'undefined' ? 'true' : 'false'`
    const functionExists = await this.runJavaScriptInWebView(checkScript)
    MNUtil.log(`🔍 loadTasksFromPlugin 函数存在: ${functionExists}`)
    
    if (functionExists !== 'true') {
      MNUtil.log("⏳ 等待 JavaScript 环境就绪...")
      await MNUtil.delay(1)
      
      // 重新检查
      const recheckResult = await this.runJavaScriptInWebView(checkScript)
      if (recheckResult !== 'true') {
        MNUtil.log("❌ loadTasksFromPlugin 函数仍然不存在，可能 HTML 文件有问题")
        MNUtil.showHUD("今日看板初始化失败")
        return
      }
    }
    
    // 传递数据到 WebView
    const encodedTasks = encodeURIComponent(JSON.stringify(displayTasks))
    MNUtil.log(`📤 准备传递 ${displayTasks.length} 个任务到 WebView`)
    
    // 使用更简单的方式调用
    const script = `loadTasksFromPlugin('${encodedTasks}')`
    
    try {
      await this.runJavaScriptInWebView(script)
      MNUtil.log(`✅ 今日看板数据加载成功，共 ${displayTasks.length} 个任务`)
      
      // 注册任务更新监听器，实现卡片到HTML的实时同步
      this.registerTaskUpdateObserver()
    } catch (error) {
      MNUtil.log(`❌ 执行 JavaScript 失败: ${error.message}`)
      // 尝试使用旧的方式
      const fallbackScript = `if(typeof loadTasksFromPlugin !== 'undefined') { loadTasksFromPlugin('${encodedTasks}'); }`
      await this.runJavaScriptInWebView(fallbackScript)
    }
    
  } catch (error) {
    taskUtils.addErrorLog(error, "loadTodayBoardData")
    MNUtil.showHUD("加载任务数据失败")
  }
}

/**
 * 切换 WebView 到日志视图
 * @this {settingController}
 */

/**
 * 加载项目列表数据
 * @this {settingController}
 * @param {string|null} parentId - 父项目ID，null 表示加载顶级项目
 */
taskSettingController.prototype.loadProjectsData = async function(parentId = null) {
  try {
    MNUtil.log("📂 开始加载项目列表")
    
    if (!this.todayBoardWebViewInstance) {
      MNUtil.log("❌ WebView 实例不存在")
      return
    }
    
    // 确保 MNTaskManager 已定义
    if (typeof MNTaskManager === 'undefined') {
      MNUtil.showHUD("任务管理器未初始化")
      return
    }
    
    // 确保 TaskFilterEngine 已定义
    if (typeof TaskFilterEngine === 'undefined') {
      MNUtil.showHUD("任务筛选引擎未初始化")
      return
    }
    
    let projectTasks = []
    
    if (parentId === null) {
      // 加载顶级项目（从目标看板和项目看板）
      projectTasks = TaskFilterEngine.filter({
        boardKeys: ['target', 'project'],  // 从目标看板和项目看板获取
        customFilter: (task) => {
          const taskInfo = MNTaskManager.parseTaskTitle(task.noteTitle)
          return taskInfo.type === '项目'
        }
      })
      
      MNUtil.log(`📊 从目标和项目看板找到 ${projectTasks.length} 个顶级项目`)
    } else {
      // 加载指定项目的子项目
      const parentNote = MNNote.new(parentId)
      if (!parentNote) {
        MNUtil.showHUD("父项目不存在")
        return
      }
      
      // 递归获取所有子项目
      const getSubProjects = (note) => {
        const subProjects = []
        if (note.childNotes) {
          for (let child of note.childNotes) {
            if (MNTaskManager.isTaskCard(child)) {
              const taskInfo = MNTaskManager.parseTaskTitle(child.noteTitle)
              if (taskInfo.type === '项目') {
                subProjects.push(child)
              }
            }
          }
        }
        return subProjects
      }
      
      projectTasks = getSubProjects(parentNote)
      MNUtil.log(`📊 在项目 ${parentNote.noteTitle} 下找到 ${projectTasks.length} 个子项目`)
    }
    
    // 递归获取项目的子任务（应用默认筛选条件）
    const getProjectChildren = (projectNote) => {
      const children = []
      // 项目视图的默认筛选条件
      const defaultStatuses = new Set(['未开始', '进行中'])
      const hideCompletedActions = true
      
      if (projectNote.childNotes) {
        for (let child of projectNote.childNotes) {
          if (MNTaskManager.isTaskCard(child)) {
            const taskInfo = MNTaskManager.parseTaskTitle(child.noteTitle)
            
            // 应用默认筛选条件（与项目视图保持一致）
            // 1. 特殊规则：隐藏已完成的动作
            if (hideCompletedActions && 
                taskInfo.type === '动作' && 
                taskInfo.status === '已完成') {
              continue
            }
            
            // 2. 常规筛选：检查任务状态
            if (!defaultStatuses.has(taskInfo.status)) {
              continue
            }
            
            children.push(child)
          }
          // 递归获取子任务
          children.push(...getProjectChildren(child))
        }
      }
      return children
    }
    
    // 计算子项目数量（应用筛选条件）
    const getSubProjectsCount = (projectNote) => {
      let count = 0
      const defaultStatuses = new Set(['未开始', '进行中'])
      
      if (projectNote.childNotes) {
        for (let child of projectNote.childNotes) {
          if (MNTaskManager.isTaskCard(child)) {
            const childInfo = MNTaskManager.parseTaskTitle(child.noteTitle)
            // 只计算符合筛选条件的子项目
            if (childInfo.type === '项目' && defaultStatuses.has(childInfo.status)) {
              count++
            }
          }
        }
      }
      return count
    }
    
    // 将项目任务转换为项目列表
    const projects = projectTasks.map(task => {
      const taskInfo = MNTaskManager.parseTaskTitle(task.noteTitle)
      
      // 获取该项目下的子任务数量（应用筛选条件）
      const childTasks = getProjectChildren(task)
      
      // 检查是否有子项目
      let hasSubProjects = false
      if (task.childNotes) {
        for (let child of task.childNotes) {
          if (MNTaskManager.isTaskCard(child)) {
            const childInfo = MNTaskManager.parseTaskTitle(child.noteTitle)
            if (childInfo.type === '项目') {
              hasSubProjects = true
              break
            }
          }
        }
      }
      
      // 根据是否有子项目决定显示什么数字
      let displayCount
      let countType
      if (hasSubProjects) {
        // 有子项目时，显示子项目数量
        displayCount = getSubProjectsCount(task)
        countType = "子项目"
      } else {
        // 无子项目时，显示任务数量
        displayCount = childTasks.length
        countType = "任务"
      }
      
      MNUtil.log(`📊 项目 "${taskInfo.content}": ${displayCount} 个${countType}`)
      
      return {
        id: task.noteId,
        name: taskInfo.content || task.noteTitle,
        icon: '📁',
        taskCount: displayCount,
        status: taskInfo.status || '未开始',
        hasSubProjects: hasSubProjects
      }
    })
    
    // 按照状态排序：进行中 > 未开始 > 已完成
    const statusOrder = {'进行中': 0, '未开始': 1, '已完成': 2}
    projects.sort((a, b) => {
      const orderA = statusOrder[a.status] ?? 3
      const orderB = statusOrder[b.status] ?? 3
      return orderA - orderB
    })
    
    MNUtil.log(`📊 找到 ${projects.length} 个项目`)
    
    // 传递数据到 WebView
    const encodedProjects = encodeURIComponent(JSON.stringify(projects))
    const script = `loadProjectsFromPlugin('${encodedProjects}')`
    
    await this.runJavaScriptInWebView(script)
    MNUtil.log(`✅ 项目列表加载成功`)
    
  } catch (error) {
    taskUtils.addErrorLog(error, "loadProjectsData")
    MNUtil.showHUD("加载项目列表失败")
  }
}

/**
 * 加载特定项目的任务
 * @this {settingController}
 * @param {string} projectId - 项目ID
 * @param {Object} filters - 筛选条件
 */
taskSettingController.prototype.loadProjectTasks = async function(projectId, filters = null) {
  try {
    MNUtil.log(`📁 开始加载项目任务: ${projectId}`)
    
    if (!this.todayBoardWebViewInstance) {
      MNUtil.log("❌ WebView 实例不存在")
      return
    }
    
    if (!projectId) {
      MNUtil.showHUD("项目ID为空")
      return
    }
    
    // 获取项目笔记
    const projectNote = MNNote.new(projectId)
    if (!projectNote) {
      MNUtil.showHUD("项目不存在")
      return
    }
    
    // 递归获取项目的子任务（考虑筛选条件）
    const getProjectChildren = (parentNote) => {
      const children = []
      if (parentNote.childNotes) {
        for (let child of parentNote.childNotes) {
          if (MNTaskManager.isTaskCard(child)) {
            // 检查任务状态
            const taskInfo = MNTaskManager.parseTaskTitle(child.noteTitle)
            
            // 应用筛选条件（如果有）
            if (filters) {
              // 特殊规则：隐藏已完成的动作
              if (filters.hideCompletedActions && 
                  taskInfo.type === '动作' && 
                  taskInfo.status === '已完成') {
                continue
              }
              
              // 常规筛选
              if (filters.statuses && !filters.statuses.includes(taskInfo.status)) {
                continue
              }
              if (filters.types && !filters.types.includes(taskInfo.type)) {
                continue
              }
            }
            
            children.push(child)
          }
          // 递归获取子任务
          children.push(...getProjectChildren(child))
        }
      }
      return children
    }
    
    // 获取项目下的所有任务
    const projectTasks = getProjectChildren(projectNote)
    
    MNUtil.log(`📊 找到 ${projectTasks.length} 个任务`)
    
    // 转换为适合显示的格式（复用今日看板的格式）
    const displayTasks = projectTasks.map(task => {
      try {
        const taskInfo = MNTaskManager.parseTaskTitle(task.noteTitle)
        const priorityInfo = MNTaskManager.getTaskPriority(task)
        const timeInfo = MNTaskManager.getPlannedTime(task)
        const progressInfo = MNTaskManager.getTaskProgress(task)
        
        // 获取任务日期
        let scheduledDate = null
        const taskComments = MNTaskManager.parseTaskComments(task)
        for (let field of taskComments.taskFields) {
          if (field.content.includes('📅')) {
            const dateMatch = field.content.match(/(\d{4}-\d{2}-\d{2})/)
            if (dateMatch) {
              scheduledDate = dateMatch[1]
            }
            break
          }
        }
        
        // 检查是否过期
        const todayField = TaskFieldUtils.getFieldContent(task, "今日")
        const overdueInfo = MNTaskManager.checkIfOverdue(todayField)
        
        // 获取启动链接
        let launchLink = null
        try {
          launchLink = MNTaskManager.getLaunchLink(task)
        } catch (e) {
          // 忽略获取链接失败的错误
        }
        
        return {
          id: task.noteId,
          title: taskInfo.content || task.noteTitle,
          type: taskInfo.type || '任务',
          status: taskInfo.status || '未开始',
          priority: priorityInfo || '低',
          plannedTime: timeInfo,
          scheduledDate: scheduledDate,
          progress: progressInfo || 0,
          isOverdue: overdueInfo.isOverdue,
          overdueDays: overdueInfo.days,
          launchUrl: launchLink,
          path: taskInfo.path || ''
        }
      } catch (error) {
        MNUtil.log(`⚠️ 处理任务失败: ${error.message}`)
        // 返回基本信息
        return {
          id: task.noteId,
          title: task.noteTitle,
          type: '任务',
          status: '未知',
          priority: '低',
          plannedTime: null,
          progress: 0,
          isOverdue: false,
          overdueDays: 0,
          launchUrl: null,
          path: ''
        }
      }
    })
    
    // 传递数据到 WebView
    const encodedTasks = encodeURIComponent(JSON.stringify(displayTasks))
    const script = `loadProjectTasksFromPlugin('${encodedTasks}')`
    
    await this.runJavaScriptInWebView(script)
    MNUtil.log(`✅ 项目任务加载成功`)
    
  } catch (error) {
    taskUtils.addErrorLog(error, "loadProjectTasks")
    MNUtil.showHUD("加载项目任务失败")
  }
}

/**
 * 通用方法：切换 WebView 到指定视图
 * @this {settingController}
 * @param {string} viewName - 视图名称 (todayboard, log, taskqueue, statistics, settings)
 */
taskSettingController.prototype.switchSidebarView = function(viewName) {
  try {
    MNUtil.log(`🔄 切换到 ${viewName} 视图`)
    
    if (!this.todayBoardWebViewInstance) {
      MNUtil.log("❌ WebView 实例不存在")
      return
    }
    
    const script = `
      if (typeof switchView === 'function') {
        switchView('${viewName}');
      } else {
        window.location.href = 'mntask://showHUD?message=' + encodeURIComponent('切换失败');
      }
    `
    
    this.runJavaScriptInWebView(script)
  } catch (error) {
    taskUtils.addErrorLog(error, "switchSidebarView")
    MNUtil.showHUD(`切换到 ${viewName} 失败`)
  }
}

/**
 * 处理今日看板的自定义协议
 * @this {settingController}
 */
taskSettingController.prototype.handleTodayBoardProtocol = function(url) {
  try {
    const urlParts = url.split("://")[1].split("?")
    const action = urlParts[0]
    const params = this.parseQueryString(urlParts[1] || '')
    
    MNUtil.log(`📱 处理今日看板协议: ${action}`, params)
    
    switch (action) {
      case 'updateStatus':
        this.handleUpdateTaskStatus(params.id)
        break
        
      case 'launch':
        this.handleLaunchTask(params.id)
        break
        
      case 'viewDetail':
        this.handleViewTaskDetail(params.id)
        break
        
      case 'scheduleTask':
        this.handleScheduleTask(params.id)
        break
        
      case 'editTask':
        // 兼容两种参数名
        const taskId = params.id || params.taskId
        if (taskId) {
          this.editTask(taskId)
        } else {
          MNUtil.showHUD("❌ 缺少任务ID参数")
        }
        break
        
      case 'loadTaskDetail':
        this.handleLoadTaskDetail()
        break
        
      case 'loadTaskForEdit':
        this.handleLoadTaskForEdit(params.taskId)
        break
        
      case 'addField':
        this.handleAddField(params)
        break
        
      case 'updateField':
        this.handleUpdateField(params)
        break
        
      case 'deleteField':
        this.handleDeleteField(params)
        break
        
      case 'reorderFields':
        this.handleReorderFields(params)
        break
        
      case 'updateTaskDate':
        this.handleUpdateTaskDate(params)
        break
        
      case 'clearTaskDate':
        this.handleClearTaskDate()
        break
        
      case 'closeTaskEditor':
        this.handleCloseTaskEditor()
        break
        
      case 'saveTaskChanges':
        this.handleSaveTaskChanges()
        break
        
      case 'refresh':
        this.handleRefreshBoard()
        break
        
      case 'export':
        this.handleExportData()
        break
        
      case 'quickStart':
        this.handleQuickStart()
        break
        
      case 'showHUD':
        if (params.message) {
          MNUtil.showHUD(decodeURIComponent(params.message))
        }
        break
        
      case 'loadTodayBoardData':
        this.loadTodayBoardData()
        break
        
      case 'loadProjectsData':
        this.loadProjectsData()
        break
        
      case 'loadSubProjects':
        if (params.parentId) {
          this.loadProjectsData(decodeURIComponent(params.parentId))
        } else {
          MNUtil.showHUD("父项目ID参数缺失")
        }
        break
        
      case 'loadProjectTasks':
        if (params.projectId) {
          this.loadProjectTasks(decodeURIComponent(params.projectId))
        } else {
          MNUtil.showHUD("项目ID参数缺失")
        }
        break
        
      case 'updateTaskStatus':
        if (params.taskId) {
          this.updateTaskStatus(params.taskId)
        }
        break
        
      case 'launchTask':
        if (params.taskId) {
          this.launchTask(params.taskId)
        }
        break
        
      case 'viewTaskDetail':
        if (params.taskId) {
          this.viewTaskDetail(params.taskId)
        }
        break
        
      case 'editTask':
        if (params.taskId) {
          this.editTask(params.taskId)
        }
        break
        
      case 'loadTaskDetail':
        this.loadTaskDetailForEditor()
        break
        
      case 'closeTaskEditor':
        this.closeTaskEditor()
        break
        
      case 'loadTaskQueueData':
        this.loadTaskQueueData()
        break
        
      case 'moveToToday':
        if (params.taskId) {
          this.moveTaskToToday(params.taskId)
        }
        break
        
      case 'exportTaskQueue':
        this.exportTaskQueue()
        break
        
      case 'openTaskEditor':
        this.handleOpenTaskEditor()
        break
        
      default:
        MNUtil.log(`⚠️ 未知的协议动作: ${action}`)
    }
  } catch (error) {
    taskUtils.addErrorLog(error, "handleTodayBoardProtocol")
  }
}

/**
 * 处理更新任务状态
 * @this {settingController}
 */
taskSettingController.prototype.handleUpdateTaskStatus = function(taskId) {
  try {
    // 记录开始更新任务状态
    TaskLogManager.info("开始更新任务状态", "SettingController", { taskId })
    
    if (!taskId) {
      TaskLogManager.warn("任务ID为空", "SettingController")
      return
    }
    
    const task = MNNote.new(taskId)
    if (!task) {
      TaskLogManager.error("任务不存在", "SettingController", { taskId })
      MNUtil.showHUD("任务不存在")
      return
    }
    
    // 获取当前状态（用于日志记录）
    const currentStatus = MNTaskManager.getTaskStatus(task)
    
    // 使用 undoGrouping 确保可以撤销
    MNUtil.undoGrouping(() => {
      MNTaskManager.toggleTaskStatus(task, true)
    })
    
    // 获取新状态（用于日志记录）
    const newStatus = MNTaskManager.getTaskStatus(task)
    TaskLogManager.info("任务状态已更新", "SettingController", { 
      taskId, 
      fromStatus: currentStatus, 
      toStatus: newStatus 
    })
    
    // 延迟刷新数据，确保状态已更新
    MNUtil.delay(0.3).then(() => {
      this.refreshTodayBoardData()
    })
    
    MNUtil.showHUD("状态已更新")
  } catch (error) {
    // 使用 TaskLogManager 记录错误
    TaskLogManager.error("更新任务状态失败", "SettingController", error)
    taskUtils.addErrorLog(error, "handleUpdateTaskStatus")
    MNUtil.showHUD("更新状态失败")
  }
}

/**
 * 处理启动任务
 * @this {settingController}
 */
taskSettingController.prototype.handleLaunchTask = function(taskId) {
  try {
    if (!taskId) return
    
    const task = MNNote.new(taskId)
    if (!task) {
      MNUtil.showHUD("任务不存在")
      return
    }
    
    const launchLink = MNTaskManager.getLaunchLink(task)
    if (!launchLink) {
      MNUtil.showHUD("此任务没有启动链接")
      return
    }
    
    const linkType = MNTaskManager.getLinkType(launchLink)
    
    switch (linkType) {
      case 'cardLink':
        const targetNote = MNNote.new(launchLink.noteId)
        if (targetNote) {
          targetNote.focusInFloatMindMap(0.5)
          this.hide() // 隐藏设置面板
        }
        break
        
      case 'uiState':
        task.focusInFloatMindMap(0.5)
        this.hide()
        break
        
      case 'external':
        MNUtil.openURL(launchLink.url)
        break
        
      default:
        MNUtil.showHUD("未知的链接类型")
    }
  } catch (error) {
    taskUtils.addErrorLog(error, "handleLaunchTask")
    MNUtil.showHUD("启动任务失败")
  }
}

/**
 * 处理查看任务详情
 * @this {settingController}
 */
taskSettingController.prototype.handleViewTaskDetail = function(taskId) {
  try {
    if (!taskId) return
    
    const task = MNNote.new(taskId)
    if (!task) {
      MNUtil.showHUD("任务不存在")
      return
    }
    
    // 在浮窗中显示任务
    task.focusInFloatMindMap(0.5)
    // 隐藏设置面板
    this.hide()
  } catch (error) {
    taskUtils.addErrorLog(error, "handleViewTaskDetail")
    MNUtil.showHUD("查看详情失败")
  }
}

/**
 * 处理安排任务日期
 * @this {settingController}
 * @param {string} taskId - 任务ID
 */
taskSettingController.prototype.handleScheduleTask = async function(taskId) {
  try {
    if (!taskId) return
    
    const task = MNNote.new(taskId)
    if (!task) {
      MNUtil.showHUD("任务不存在")
      return
    }
    
    // 获取当前任务的日期信息
    const taskInfo = MNTaskManager.parseTaskComments(task)
    let currentDate = null
    
    // 查找现有的日期字段
    for (let field of taskInfo.taskFields) {
      if (field.content.includes('📅')) {
        const dateMatch = field.content.match(/(\d{4}-\d{2}-\d{2})/)
        if (dateMatch) {
          currentDate = dateMatch[1]
        }
        break
      }
    }
    
    // 弹出日期选择对话框
    const today = new Date()
    const defaultDate = currentDate || `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    
    const result = await MNUtil.prompt(
      "安排任务日期",
      "请选择或输入日期（格式：YYYY-MM-DD）",
      defaultDate
    )
    
    if (result && result.trim()) {
      // 验证日期格式
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      if (!dateRegex.test(result.trim())) {
        MNUtil.showHUD("❌ 日期格式错误，请使用 YYYY-MM-DD 格式")
        return
      }
      
      // 更新任务日期
      MNUtil.undoGrouping(() => {
        // 移除旧的日期字段
        let removed = false
        for (let field of taskInfo.taskFields) {
          if (field.content.includes('📅')) {
            task.removeCommentByIndex(field.index)
            removed = true
            break
          }
        }
        
        // 添加新的日期字段
        const dateFieldHtml = TaskFieldUtils.createFieldHtml(`📅 日期: ${result.trim()}`, 'subField')
        task.appendMarkdownComment(dateFieldHtml)
        
        // 移动到信息字段下
        MNTaskManager.moveCommentToField(task, task.MNComments.length - 1, '信息', false)
        
        MNUtil.showHUD(`✅ 已安排到 ${result.trim()}`)
      })
      
      // 刷新看板
      this.loadTodayBoardData()
    }
  } catch (error) {
    taskUtils.addErrorLog(error, "handleScheduleTask")
    MNUtil.showHUD("安排日期失败")
  }
}

/**
 * 处理编辑任务
 * @param {string} taskId - 任务ID
 * @this {settingController}
 */
taskSettingController.prototype.handleEditTask = function(taskId) {
  try {
    MNUtil.log(`📝 准备编辑任务: ${taskId}`)
    
    // 调用 WebView 中的函数显示任务编辑器
    const script = `
      if (typeof showTaskEditor === 'function') {
        showTaskEditor('${taskId}');
        'success';
      } else {
        'function_not_found';
      }
    `
    
    this.runJavaScriptInWebView(script).then(result => {
      if (result !== 'success') {
        MNUtil.showHUD("无法打开任务编辑器")
      }
    })
  } catch (error) {
    taskUtils.addErrorLog(error, "handleEditTask")
    MNUtil.showHUD("打开任务编辑器失败")
  }
}

/**
 * 处理加载任务详情（编辑器主动请求）
 * @this {settingController}
 */
taskSettingController.prototype.handleLoadTaskDetail = function() {
  try {
    MNUtil.log("📋 任务编辑器请求加载任务详情")
    
    if (!this.editingTaskId) {
      MNUtil.showHUD("没有选中的任务")
      return
    }
    
    const task = MNNote.new(this.editingTaskId)
    if (!task) {
      MNUtil.showHUD("任务不存在")
      return
    }
    
    const taskInfo = MNTaskManager.getTaskInfo(task)
    
    // 准备任务数据
    const taskData = {
      id: task.noteId,
      title: taskInfo.content,
      type: taskInfo.type,
      status: taskInfo.status,
      priority: taskInfo.priority,
      scheduledDate: taskInfo.scheduledDate,
      fields: taskInfo.taskFields.map(field => ({
        name: field.fieldName,
        content: field.content,
        index: field.index
      }))
    }
    
    // 发送数据到编辑器
    const encodedData = encodeURIComponent(JSON.stringify(taskData))
    const script = `loadTaskDetailFromPlugin('${encodedData}')`
    this.runJavaScriptInWebView(script)
  } catch (error) {
    taskUtils.addErrorLog(error, "handleLoadTaskDetail")
    MNUtil.showHUD("加载任务详情失败")
  }
}

/**
 * 处理加载任务进行编辑
 * @param {string} taskId - 任务ID
 * @this {settingController}
 */
taskSettingController.prototype.handleLoadTaskForEdit = function(taskId) {
  try {
    MNUtil.log(`📝 加载任务进行编辑: ${taskId}`)
    
    // 保存正在编辑的任务ID
    this.editingTaskId = taskId
    
    const task = MNNote.new(taskId)
    if (!task) {
      MNUtil.showHUD("任务不存在")
      return
    }
    
    const taskInfo = MNTaskManager.getTaskInfo(task)
    
    // 准备任务数据
    const taskData = {
      id: task.noteId,
      title: taskInfo.content,
      type: taskInfo.type,
      status: taskInfo.status,
      priority: taskInfo.priority,
      scheduledDate: taskInfo.scheduledDate,
      fields: taskInfo.taskFields.map(field => ({
        name: field.fieldName,
        content: field.content,
        index: field.index
      }))
    }
    
    // 发送数据到编辑器
    const encodedData = encodeURIComponent(JSON.stringify(taskData))
    const script = `loadTaskDetailFromPlugin('${encodedData}')`
    this.runJavaScriptInWebView(script)
  } catch (error) {
    taskUtils.addErrorLog(error, "handleLoadTaskForEdit")
    MNUtil.showHUD("加载任务失败")
  }
}

/**
 * 处理添加字段
 * @param {Object} params - 参数对象
 * @this {settingController}
 */
taskSettingController.prototype.handleAddField = function(params) {
  try {
    const fieldName = decodeURIComponent(params.name || '')
    const fieldContent = decodeURIComponent(params.content || '')
    
    if (!this.editingTaskId || !fieldName) {
      MNUtil.showHUD("参数错误")
      return
    }
    
    const task = MNNote.new(this.editingTaskId)
    if (!task) {
      MNUtil.showHUD("任务不存在")
      return
    }
    
    MNUtil.undoGrouping(() => {
      // 创建带样式的字段
      const fieldHtml = TaskFieldUtils.createFieldHtml(fieldName, 'subField')
      const fullContent = fieldContent ? `${fieldHtml} ${fieldContent}` : fieldHtml
      
      // 添加到笔记
      task.appendMarkdownComment(fullContent)
      
      // 获取刚添加的评论索引
      const lastIndex = task.MNComments.length - 1
      
      // 移动到"信息"字段的最上方
      MNTaskManager.moveCommentToField(task, lastIndex, '信息', false)
    })
    
    MNUtil.showHUD(`✅ 已添加字段：${fieldName}`)
  } catch (error) {
    taskUtils.addErrorLog(error, "handleAddField")
    MNUtil.showHUD("添加字段失败")
  }
}

/**
 * 处理更新字段
 * @param {Object} params - 参数对象
 * @this {settingController}
 */
taskSettingController.prototype.handleUpdateField = function(params) {
  try {
    const index = parseInt(params.index)
    const fieldName = decodeURIComponent(params.name || '')
    const fieldContent = decodeURIComponent(params.content || '')
    const oldName = decodeURIComponent(params.oldName || '')
    
    if (!this.editingTaskId || isNaN(index)) {
      MNUtil.showHUD("参数错误")
      return
    }
    
    const task = MNNote.new(this.editingTaskId)
    if (!task) {
      MNUtil.showHUD("任务不存在")
      return
    }
    
    MNUtil.undoGrouping(() => {
      const taskInfo = MNTaskManager.getTaskInfo(task)
      const targetField = taskInfo.taskFields.find(f => f.fieldName === oldName)
      
      if (targetField) {
        // 创建新的字段内容
        const fieldHtml = TaskFieldUtils.createFieldHtml(fieldName, 'subField')
        const fullContent = fieldContent ? `${fieldHtml} ${fieldContent}` : fieldHtml
        
        // 更新评论
        task.comments[targetField.index].text = fullContent
      }
    })
    
    MNUtil.showHUD(`✅ 已更新字段：${fieldName}`)
  } catch (error) {
    taskUtils.addErrorLog(error, "handleUpdateField")
    MNUtil.showHUD("更新字段失败")
  }
}

/**
 * 处理删除字段
 * @param {Object} params - 参数对象
 * @this {settingController}
 */
taskSettingController.prototype.handleDeleteField = function(params) {
  try {
    const index = parseInt(params.index)
    const fieldName = decodeURIComponent(params.name || '')
    
    if (!this.editingTaskId || isNaN(index)) {
      MNUtil.showHUD("参数错误")
      return
    }
    
    const task = MNNote.new(this.editingTaskId)
    if (!task) {
      MNUtil.showHUD("任务不存在")
      return
    }
    
    MNUtil.undoGrouping(() => {
      const taskInfo = MNTaskManager.getTaskInfo(task)
      const targetField = taskInfo.taskFields.find(f => f.fieldName === fieldName)
      
      if (targetField) {
        task.removeCommentByIndex(targetField.index)
      }
    })
    
    MNUtil.showHUD(`✅ 已删除字段：${fieldName}`)
  } catch (error) {
    taskUtils.addErrorLog(error, "handleDeleteField")
    MNUtil.showHUD("删除字段失败")
  }
}

/**
 * 处理字段重排序
 * @param {Object} params - 参数对象
 * @this {settingController}
 */
taskSettingController.prototype.handleReorderFields = function(params) {
  try {
    const oldIndex = parseInt(params.oldIndex)
    const newIndex = parseInt(params.newIndex)
    
    if (!this.editingTaskId || isNaN(oldIndex) || isNaN(newIndex)) {
      MNUtil.showHUD("参数错误")
      return
    }
    
    const task = MNNote.new(this.editingTaskId)
    if (!task) {
      MNUtil.showHUD("任务不存在")
      return
    }
    
    // TODO: 实现字段重排序逻辑
    MNUtil.showHUD("字段重排序功能开发中...")
  } catch (error) {
    taskUtils.addErrorLog(error, "handleReorderFields")
    MNUtil.showHUD("重排序失败")
  }
}

/**
 * 处理更新任务日期
 * @param {Object} params - 参数对象
 * @this {settingController}
 */
taskSettingController.prototype.handleUpdateTaskDate = function(params) {
  try {
    const date = decodeURIComponent(params.date || '')
    
    if (!this.editingTaskId || !date) {
      MNUtil.showHUD("参数错误")
      return
    }
    
    const task = MNNote.new(this.editingTaskId)
    if (!task) {
      MNUtil.showHUD("任务不存在")
      return
    }
    
    MNUtil.undoGrouping(() => {
      const taskInfo = MNTaskManager.getTaskInfo(task)
      
      // 移除旧的日期字段
      for (let field of taskInfo.taskFields) {
        if (field.content.includes('📅')) {
          task.removeCommentByIndex(field.index)
          break
        }
      }
      
      // 添加新的日期字段
      const dateFieldHtml = TaskFieldUtils.createFieldHtml(`📅 日期: ${date}`, 'subField')
      task.appendMarkdownComment(dateFieldHtml)
      
      // 移动到信息字段下
      MNTaskManager.moveCommentToField(task, task.MNComments.length - 1, '信息', false)
    })
    
    MNUtil.showHUD(`✅ 已设置日期：${date}`)
  } catch (error) {
    taskUtils.addErrorLog(error, "handleUpdateTaskDate")
    MNUtil.showHUD("更新日期失败")
  }
}

/**
 * 处理清除任务日期
 * @this {settingController}
 */
taskSettingController.prototype.handleClearTaskDate = function() {
  try {
    if (!this.editingTaskId) {
      MNUtil.showHUD("没有选中的任务")
      return
    }
    
    const task = MNNote.new(this.editingTaskId)
    if (!task) {
      MNUtil.showHUD("任务不存在")
      return
    }
    
    MNUtil.undoGrouping(() => {
      const taskInfo = MNTaskManager.getTaskInfo(task)
      
      // 移除日期字段
      for (let field of taskInfo.taskFields) {
        if (field.content.includes('📅')) {
          task.removeCommentByIndex(field.index)
          break
        }
      }
    })
    
    MNUtil.showHUD("✅ 已清除日期")
  } catch (error) {
    taskUtils.addErrorLog(error, "handleClearTaskDate")
    MNUtil.showHUD("清除日期失败")
  }
}

/**
 * 处理关闭任务编辑器
 * @this {settingController}
 */
taskSettingController.prototype.handleCloseTaskEditor = function() {
  try {
    // 切换回今日看板
    const script = `switchView('todayboard');`
    
    this.runJavaScriptInWebView(script)
    
    // 清除编辑状态
    this.editingTaskId = null
    
    // 刷新看板数据
    this.loadTodayBoardData()
  } catch (error) {
    taskUtils.addErrorLog(error, "handleCloseTaskEditor")
  }
}

/**
 * 处理保存任务更改
 * @this {settingController}
 */
taskSettingController.prototype.handleSaveTaskChanges = function() {
  try {
    // 获取当前编辑的任务ID
    if (!this.currentEditingTaskId) {
      MNUtil.showHUD("❌ 没有正在编辑的任务")
      return
    }
    
    const task = MNNote.new(this.currentEditingTaskId)
    if (!task) {
      MNUtil.showHUD("❌ 任务不存在")
      return
    }
    
    // 从 WebView 获取编辑的数据
    const script = `JSON.stringify(taskEditor.getChangedFields())`
    this.runJavaScriptInWebView(script, 'taskEditorWebView').then(result => {
      if (!result || result === 'null') {
        MNUtil.showHUD("❌ 没有需要保存的更改")
        return
      }
      
      const changes = JSON.parse(result)
      MNUtil.log(`📝 准备保存任务字段更改: ${JSON.stringify(changes)}`)
      
      // 使用 undoGrouping 确保可以撤销
      MNUtil.undoGrouping(() => {
        // 处理字段更改
        this.applyFieldChanges(task, changes)
      })
      
      MNUtil.showHUD("✅ 更改已保存")
      
      // 刷新看板数据
      this.loadTodayBoardData()
      
      // 如果有任务编辑器窗口，关闭它
      if (this.taskEditorWebView) {
        this.taskEditorWebView.hidden = true
      }
    }).catch(error => {
      taskUtils.addErrorLog(error, "handleSaveTaskChanges.runJS")
      MNUtil.showHUD("❌ 获取更改失败")
    })
  } catch (error) {
    taskUtils.addErrorLog(error, "handleSaveTaskChanges")
    MNUtil.showHUD("保存失败")
  }
}

/**
 * 应用字段更改到任务卡片
 * @this {settingController}
 * @param {MNNote} task - 任务卡片
 * @param {Object} changes - 字段更改数据
 */
taskSettingController.prototype.applyFieldChanges = function(task, changes) {
  try {
    const parsed = TaskFieldUtils.parseTaskComments(task)
    const comments = task.comments || []
    
    // 处理删除的字段
    if (changes.deletedFields && changes.deletedFields.length > 0) {
      // 从后往前删除，避免索引问题
      changes.deletedFields.sort((a, b) => b - a).forEach(index => {
        if (comments[index]) {
          comments.splice(index, 1)
        }
      })
    }
    
    // 处理更新的字段
    if (changes.updatedFields && changes.updatedFields.length > 0) {
      changes.updatedFields.forEach(field => {
        if (comments[field.index]) {
          // 保持字段的HTML格式
          const fieldHtml = TaskFieldUtils.createFieldHtml(
            field.content, 
            field.isMainField ? 'mainField' : 'subField'
          )
          comments[field.index].text = fieldHtml
          comments[field.index].type = "markdownComment"
        }
      })
    }
    
    // 处理新增的字段
    if (changes.addedFields && changes.addedFields.length > 0) {
      changes.addedFields.forEach(field => {
        // 处理特殊字段类型
        let fieldHtml = ''
        
        if (field.fieldType === 'date') {
          fieldHtml = TaskFieldUtils.createDateField(field.date || true)
        } else if (field.fieldType === 'priority') {
          fieldHtml = TaskFieldUtils.createPriorityField(field.priority || '中')
        } else if (field.fieldType === 'launch') {
          // 启动链接需要特殊处理
          // 检查是否是 MarginNote 链接
          if (this.isMarginNoteLink(field.url)) {
            // 获取笔记ID并尝试获取标题
            const noteId = MNUtil.getNoteIdByURL(field.url)
            const note = MNNote.new(noteId)
            const displayText = note ? note.noteTitle : field.text
            this.addLaunchFieldToTask(task, field.url, displayText)
          } else {
            this.addLaunchFieldToTask(task, field.url, field.text)
          }
          return
        } else {
          // 普通字段
          fieldHtml = TaskFieldUtils.createFieldHtml(
            field.content, 
            field.isMainField ? 'mainField' : 'subField'
          )
        }
        
        task.appendMarkdownComment(fieldHtml)
      })
    }
    
    // 处理字段排序
    if (changes.reorderedFields && changes.reorderedFields.length > 0) {
      // TODO: 实现字段重新排序逻辑
      MNUtil.log("⚠️ 字段排序功能尚未实现")
    }
    
  } catch (error) {
    taskUtils.addErrorLog(error, "applyFieldChanges")
    throw error
  }
}

/**
 * 检查是否是 MarginNote 链接
 * @param {string} url - 要检查的URL
 * @returns {boolean} 是否是 MarginNote 链接
 */
taskSettingController.prototype.isMarginNoteLink = function(url) {
  return /^marginnote\dapp:\/\//.test(url)
}

/**
 * 添加启动链接到任务
 * @this {settingController}
 * @param {MNNote} task - 任务卡片
 * @param {string} url - 链接URL
 * @param {string} text - 链接文本
 */
taskSettingController.prototype.addLaunchFieldToTask = function(task, url, text) {
  try {
    TaskFieldUtils.addLaunchField(task, url, text || "启动")
  } catch (error) {
    taskUtils.addErrorLog(error, "addLaunchFieldToTask")
    MNUtil.log(`❌ 添加启动链接失败: ${error.message}`)
  }
}

/**
 * 注册任务更新监听器
 * 监听任务卡片的修改，实现卡片到HTML的实时同步
 * @this {settingController}
 */
taskSettingController.prototype.registerTaskUpdateObserver = function() {
  try {
    // 存储定时器ID，避免重复注册
    if (this.taskUpdateTimer) {
      this.taskUpdateTimer.invalidate()
      this.taskUpdateTimer = null
    }
    
    // 存储任务的最后修改时间，用于检测变化
    this.taskLastModified = new Map()
    
    // 使用 NSTimer 创建定时器，每2秒检查一次任务更新
    const self = this
    this.taskUpdateTimer = NSTimer.scheduledTimerWithTimeInterval(
      2.0,  // 间隔时间（秒）
      true, // repeats = true 表示重复执行
      function() {
        if (self.todayBoardWebViewInstance && !self.todayBoardWebViewInstance.hidden) {
          self.checkTaskUpdates()
        }
      }
    )
    
    MNUtil.log("✅ 任务更新监听器已注册")
  } catch (error) {
    taskUtils.addErrorLog(error, "registerTaskUpdateObserver")
    MNUtil.log(`❌ 注册任务更新监听器失败: ${error.message}`)
  }
}

/**
 * 检查任务是否有更新
 * @this {settingController}
 */
taskSettingController.prototype.checkTaskUpdates = function() {
  try {
    // 获取当前显示的任务
    const todayTasks = MNTaskManager.filterTodayTasks()
    
    todayTasks.forEach(task => {
      const taskId = task.noteId
      const currentModified = task.modifiedDate
      const lastModified = this.taskLastModified.get(taskId)
      
      // 检查任务是否被修改
      if (lastModified && currentModified > lastModified) {
        MNUtil.log(`📝 检测到任务更新: ${task.noteTitle}`)
        this.pushTaskUpdateToHTML(task)
      }
      
      // 更新最后修改时间
      this.taskLastModified.set(taskId, currentModified)
    })
  } catch (error) {
    // 静默处理错误，避免频繁的错误提示
    MNUtil.log(`检查任务更新时出错: ${error.message}`)
  }
}

/**
 * 将任务更新推送到HTML视图
 * @this {settingController}
 * @param {MNNote} task - 更新的任务
 */
taskSettingController.prototype.pushTaskUpdateToHTML = function(task) {
  try {
    const taskInfo = MNTaskManager.getTaskInfo(task)
    const parsed = TaskFieldUtils.parseTaskComments(task)
    
    // 准备更新数据
    const updateData = {
      id: task.noteId,
      title: taskInfo.content,
      type: taskInfo.type,
      status: taskInfo.status,
      tags: taskInfo.tags || [],
      priority: parsed.priority,
      isScheduled: parsed.hasDateField,
      scheduledDate: parsed.dateField?.date,
      fields: parsed.fields || []
    }
    
    // 编码数据
    const encodedData = encodeURIComponent(JSON.stringify(updateData))
    
    // 推送更新到WebView
    const script = `
      if (typeof boardManager !== 'undefined' && boardManager.updateTask) {
        boardManager.updateTask('${encodedData}');
        'success';
      } else {
        'boardManager_not_found';
      }
    `
    
    this.runJavaScriptInWebView(script).then(result => {
      if (result === 'success') {
        MNUtil.log(`✅ 任务更新已推送到HTML: ${taskInfo.content}`)
      }
    }).catch(error => {
      MNUtil.log(`推送任务更新失败: ${error.message}`)
    })
  } catch (error) {
    taskUtils.addErrorLog(error, "pushTaskUpdateToHTML")
  }
}

/**
 * 处理刷新看板
 * @this {settingController}
 */
taskSettingController.prototype.handleRefreshBoard = function() {
  try {
    MNUtil.showHUD("🔄 正在刷新...")
    
    // 刷新数据
    this.loadTodayBoardData()
    
    // 重新注册任务更新监听器
    this.registerTaskUpdateObserver()
    
    MNUtil.showHUD("✅ 刷新完成")
  } catch (error) {
    taskUtils.addErrorLog(error, "handleRefreshBoard")
    MNUtil.showHUD("刷新失败")
  }
}

/**
 * 处理导出数据
 * @this {settingController}
 */
taskSettingController.prototype.handleExportData = function() {
  try {
    if (typeof MNTaskManager === 'undefined') {
      MNUtil.showHUD("任务管理器未初始化")
      return
    }
    
    const todayTasks = MNTaskManager.filterTodayTasks()
    const report = MNTaskManager.generateTodayReport(todayTasks)
    
    MNUtil.copy(report)
    MNUtil.showHUD("📋 今日任务报告已复制到剪贴板")
  } catch (error) {
    taskUtils.addErrorLog(error, "handleExportData")
    MNUtil.showHUD("导出失败")
  }
}

/**
 * 处理快速启动
 * @this {settingController}
 */
taskSettingController.prototype.handleQuickStart = function() {
  try {
    if (typeof MNTaskManager === 'undefined') {
      MNUtil.showHUD("任务管理器未初始化")
      return
    }
    
    // 获取第一个进行中的任务
    const todayTasks = MNTaskManager.filterTodayTasks()
    const inProgressTasks = todayTasks.filter(task => {
      const taskInfo = MNTaskManager.parseTaskTitle(task.noteTitle)
      return taskInfo.status === '进行中'
    })
    
    if (inProgressTasks.length === 0) {
      MNUtil.showHUD("没有进行中的任务")
      return
    }
    
    // 启动第一个任务
    this.handleLaunchTask(inProgressTasks[0].noteId)
  } catch (error) {
    taskUtils.addErrorLog(error, "handleQuickStart")
    MNUtil.showHUD("快速启动失败")
  }
}

// ========== 日志查看器 WebView 相关方法 ==========

/**
 * 处理日志查看器的自定义协议
 * @param {string} url - 协议 URL
 * @this {settingController}
 */
taskSettingController.prototype.handleLogProtocol = function(url) {
  try {
    const urlParts = url.split("://")[1].split("?")
    const action = urlParts[0]
    const params = this.parseQueryString(urlParts[1] || '')
    
    MNUtil.log(`📊 处理日志协议: ${action}`, params)
    
    switch (action) {
      case 'copyLog':
        if (params.content) {
          MNUtil.copy(decodeURIComponent(params.content))
          MNUtil.showHUD("日志已复制")
        }
        break
        
      case 'showHUD':
        if (params.message) {
          MNUtil.showHUD(decodeURIComponent(params.message))
        }
        break
        
      default:
        MNUtil.log(`⚠️ 未知的日志协议动作: ${action}`)
    }
  } catch (error) {
    taskUtils.addErrorLog(error, "handleLogProtocol")
  }
}





/**
 * 显示日志到日志查看器
 * @this {settingController}
 */

/**
 * 诊断 WebView 状态
 * @this {settingController}
 */
taskSettingController.prototype.diagnoseWebViewStatus = function() {
  MNUtil.log("=== WebView 状态诊断 ===")
  
  // 检查今日看板 WebView
  MNUtil.log("📅 今日看板 WebView 诊断:")
  MNUtil.log(`  - todayBoardWebView 存在: ${!!this.todayBoardWebView}`)
  MNUtil.log(`  - todayBoardWebViewInstance 存在: ${!!this.todayBoardWebViewInstance}`)
  MNUtil.log(`  - todayBoardWebViewInitialized: ${this.todayBoardWebViewInitialized}`)
  
  if (this.todayBoardWebView) {
    MNUtil.log(`  - todayBoardWebView frame: ${JSON.stringify(this.todayBoardWebView.frame)}`)
    MNUtil.log(`  - todayBoardWebView hidden: ${this.todayBoardWebView.hidden}`)
    MNUtil.log(`  - todayBoardWebView 子视图数: ${this.todayBoardWebView.subviews.length}`)
  }
  
  if (this.todayBoardWebViewInstance) {
    MNUtil.log(`  - WebView frame: ${JSON.stringify(this.todayBoardWebViewInstance.frame)}`)
    MNUtil.log(`  - WebView URL: ${this.todayBoardWebViewInstance.request?.URL?.absoluteString || 'No URL'}`)
    MNUtil.log(`  - WebView loading: ${this.todayBoardWebViewInstance.loading}`)
  }
  
  // 检查当前视图状态
  MNUtil.log("\n🎯 当前视图状态:")
  MNUtil.log(`  - currentView: ${this.currentView}`)
  MNUtil.log(`  - viewManager 存在: ${!!this.viewManager}`)
  
  MNUtil.log("=== 诊断完成 ===")
  
  // 将诊断信息也记录到 TaskLogManager
  TaskLogManager.debug("WebView 状态诊断", "Diagnostics", {
    todayBoardWebView: {
      containerExists: !!this.todayBoardWebView,
      instanceExists: !!this.todayBoardWebViewInstance,
      initialized: this.todayBoardWebViewInitialized,
      frame: this.todayBoardWebViewInstance?.frame
    },
    currentView: this.currentView
  })
}

/**
 * 刷新今日看板数据（增量更新）
 * @this {settingController}
 */
taskSettingController.prototype.refreshTodayBoardData = async function() {
  try {
    if (!this.todayBoardWebViewInstance || !this.todayBoardWebViewInitialized) {
      return
    }
    
    // 重新加载数据
    await this.loadTodayBoardData()
  } catch (error) {
    taskUtils.addErrorLog(error, "refreshTodayBoardData")
  }
}

/**
 * 更新单个任务（增量更新）
 * @param {string} taskId - 任务ID
 * @this {settingController}
 */
taskSettingController.prototype.updateSingleTask = async function(taskId) {
  try {
    if (!this.todayBoardWebViewInstance || !this.todayBoardWebViewInitialized) {
      return
    }
    
    const task = MNNote.new(taskId)
    if (!task) return
    
    // 转换任务数据
    const taskInfo = MNTaskManager.parseTaskTitle(task.noteTitle)
    const priorityInfo = MNTaskManager.getTaskPriority(task)
    const timeInfo = MNTaskManager.getPlannedTime(task)
    const progressInfo = MNTaskManager.getTaskProgress(task)
    const todayField = TaskFieldUtils.getFieldContent(task, "今日")
    const overdueInfo = MNTaskManager.checkIfOverdue(todayField)
    
    const displayTask = {
      id: task.noteId,
      title: taskInfo.content || task.noteTitle,
      type: taskInfo.type || '任务',
      status: taskInfo.status || '未开始',
      priority: priorityInfo || '低',
      plannedTime: timeInfo,
      progress: progressInfo || 0,
      isOverdue: overdueInfo.isOverdue,
      overdueDays: overdueInfo.days,
      launchUrl: MNTaskManager.getLaunchLink(task),
      path: taskInfo.path || ''
    }
    
    // 发送更新到 WebView
    const encodedTask = encodeURIComponent(JSON.stringify(displayTask))
    const script = `if(typeof updateTask !== 'undefined') { updateTask('${encodedTask}') }`
    await this.runJavaScriptInWebView(script)
    
    MNUtil.log(`✅ 更新任务: ${displayTask.title}`)
  } catch (error) {
    taskUtils.addErrorLog(error, "updateSingleTask")
  }
}

/**
 * 添加新任务到看板
 * @param {MNNote} task - 任务笔记
 * @this {settingController}
 */
taskSettingController.prototype.addTaskToBoard = async function(task) {
  try {
    if (!this.todayBoardWebViewInstance || !this.todayBoardWebViewInitialized) {
      return
    }
    
    // 转换任务数据
    const taskInfo = MNTaskManager.parseTaskTitle(task.noteTitle)
    const priorityInfo = MNTaskManager.getTaskPriority(task)
    const timeInfo = MNTaskManager.getPlannedTime(task)
    const progressInfo = MNTaskManager.getTaskProgress(task)
    const todayField = TaskFieldUtils.getFieldContent(task, "今日")
    const overdueInfo = MNTaskManager.checkIfOverdue(todayField)
    
    const displayTask = {
      id: task.noteId,
      title: taskInfo.content || task.noteTitle,
      type: taskInfo.type || '任务',
      status: taskInfo.status || '未开始',
      priority: priorityInfo || '低',
      plannedTime: timeInfo,
      progress: progressInfo || 0,
      isOverdue: overdueInfo.isOverdue,
      overdueDays: overdueInfo.days,
      launchUrl: MNTaskManager.getLaunchLink(task),
      path: taskInfo.path || ''
    }
    
    // 发送新任务到 WebView
    const encodedTask = encodeURIComponent(JSON.stringify(displayTask))
    const script = `if(typeof addTask !== 'undefined') { addTask('${encodedTask}') }`
    await this.runJavaScriptInWebView(script)
    
    MNUtil.log(`✅ 添加任务到看板: ${displayTask.title}`)
  } catch (error) {
    taskUtils.addErrorLog(error, "addTaskToBoard")
  }
}

/**
 * 从看板移除任务
 * @param {string} taskId - 任务ID
 * @this {settingController}
 */
taskSettingController.prototype.removeTaskFromBoard = async function(taskId) {
  try {
    if (!this.todayBoardWebViewInstance || !this.todayBoardWebViewInitialized) {
      return
    }
    
    // 从 WebView 移除任务
    const script = `if(typeof removeTask !== 'undefined') { removeTask('${taskId}') }`
    await this.runJavaScriptInWebView(script)
    
    MNUtil.log(`✅ 从看板移除任务: ${taskId}`)
  } catch (error) {
    taskUtils.addErrorLog(error, "removeTaskFromBoard")
  }
}

/**
 * 解析查询字符串
 */
taskSettingController.prototype.parseQueryString = function(queryString) {
  const params = {}
  if (!queryString) return params
  
  queryString.split('&').forEach(param => {
    const [key, value] = param.split('=')
    params[key] = value
  })
  
  return params
}

/**
 * 更新任务状态
 */
taskSettingController.prototype.updateTaskStatus = function(taskId) {
  try {
    const task = MNNote.new(taskId)
    if (!task) {
      MNUtil.showHUD("任务不存在")
      return
    }
    
    MNUtil.undoGrouping(() => {
      MNTaskManager.toggleTaskStatus(task, true)
    })
    
    MNUtil.delay(0.3).then(() => {
      this.loadTodayBoardData()
    })
    
    MNUtil.showHUD("状态已更新")
  } catch (error) {
    taskUtils.addErrorLog(error, "updateTaskStatus")
  }
}

/**
 * 启动任务
 */
taskSettingController.prototype.launchTask = function(taskId) {
  try {
    const task = MNNote.new(taskId)
    if (!task) {
      MNUtil.showHUD("任务不存在")
      return
    }
    
    const launchLink = MNTaskManager.getLaunchLink(task)
    if (!launchLink) {
      MNUtil.showHUD("此任务没有启动链接")
      return
    }
    
    const linkType = MNTaskManager.getLinkType(launchLink)
    
    switch (linkType) {
      case 'cardLink':
        const targetNote = MNNote.new(launchLink.noteId)
        if (targetNote) {
          targetNote.focusInFloatMindMap(0.5)
          this.hide() // 隐藏设置面板
        }
        break
        
      case 'uiState':
        task.focusInFloatMindMap(0.5)
        this.hide()
        break
        
      case 'external':
        MNUtil.openURL(launchLink.url)
        break
    }
  } catch (error) {
    taskUtils.addErrorLog(error, "launchTask")
  }
}

/**
 * 查看任务详情
 */
taskSettingController.prototype.viewTaskDetail = function(taskId) {
  try {
    const task = MNNote.new(taskId)
    if (!task) {
      MNUtil.showHUD("任务不存在")
      return
    }
    
    task.focusInFloatMindMap(0.5)
    this.hide()
  } catch (error) {
    taskUtils.addErrorLog(error, "viewTaskDetail")
  }
}

/**
 * 加载任务队列数据
 * @this {settingController}
 */
taskSettingController.prototype.loadTaskQueueData = async function() {
  try {
    MNUtil.log("📋 开始加载任务队列数据")
    
    if (!this.todayBoardWebViewInstance) {
      MNUtil.log("❌ WebView 实例不存在")
      return
    }
    
    // 确保必要的模块已定义
    if (typeof MNTaskManager === 'undefined') {
      MNUtil.showHUD("任务管理器未初始化")
      return
    }
    
    if (typeof TaskFilterEngine === 'undefined') {
      MNUtil.showHUD("任务筛选引擎未初始化")
      return
    }
    
    // 从所有看板获取未完成的任务
    const allTasks = TaskFilterEngine.filter({
      boardKeys: ['target', 'project', 'action'],  // 从三个主要看板获取
      customFilter: (task) => {
        const taskInfo = MNTaskManager.parseTaskTitle(task.noteTitle)
        // 只获取未开始和进行中的任务
        return taskInfo.status === '未开始' || taskInfo.status === '进行中'
      }
    })
    
    MNUtil.log(`📊 找到 ${allTasks.length} 个待处理任务`)
    
    // 转换为适合显示的格式
    const queueTasks = allTasks.map(task => {
      try {
        const taskInfo = MNTaskManager.parseTaskTitle(task.noteTitle)
        const priorityInfo = MNTaskManager.getTaskPriority(task)
        const timeInfo = MNTaskManager.getPlannedTime(task)
        const progressInfo = MNTaskManager.getTaskProgress(task)
        
        // 获取任务日期
        let scheduledDate = null
        const taskComments = MNTaskManager.parseTaskComments(task)
        for (let field of taskComments.taskFields) {
          if (field.content.includes('📅')) {
            const dateMatch = field.content.match(/(\d{4}-\d{2}-\d{2})/)
            if (dateMatch) {
              scheduledDate = dateMatch[1]
            }
            break
          }
        }
        
        // 检查是否过期
        const todayField = TaskFieldUtils.getFieldContent(task, "今日")
        const overdueInfo = MNTaskManager.checkIfOverdue(todayField)
        
        // 获取所属项目
        let projectName = null
        let currentNote = task.parentNote
        while (currentNote) {
          if (MNTaskManager.isTaskCard(currentNote)) {
            const parentInfo = MNTaskManager.parseTaskTitle(currentNote.noteTitle)
            if (parentInfo.type === '项目') {
              projectName = parentInfo.content || currentNote.noteTitle
              break
            }
          }
          currentNote = currentNote.parentNote
        }
        
        return {
          id: task.noteId,
          title: taskInfo.content || task.noteTitle,
          type: taskInfo.type || '任务',
          status: taskInfo.status || '未开始',
          priority: priorityInfo || '低',
          plannedTime: timeInfo,
          progress: progressInfo || 0,
          isOverdue: overdueInfo.isOverdue,
          overdueDays: overdueInfo.days,
          path: taskInfo.path || '',
          projectName: projectName
        }
      } catch (error) {
        MNUtil.log(`⚠️ 处理任务失败: ${error.message}`)
        // 返回基本信息
        return {
          id: task.noteId,
          title: task.noteTitle,
          type: '任务',
          status: '未知',
          priority: '低',
          plannedTime: null,
          progress: 0,
          isOverdue: false,
          overdueDays: 0,
          path: '',
          projectName: null
        }
      }
    })
    
    // 传递数据到 WebView
    const encodedTasks = encodeURIComponent(JSON.stringify(queueTasks))
    const script = `loadTasksFromPlugin('${encodedTasks}')`
    
    await this.runJavaScriptInWebView(script)
    MNUtil.log(`✅ 任务队列加载成功，共 ${queueTasks.length} 个任务`)
    
  } catch (error) {
    taskUtils.addErrorLog(error, "loadTaskQueueData")
    MNUtil.showHUD("加载任务队列失败")
  }
}

/**
 * 移动任务到今日
 * @this {settingController}
 * @param {string} taskId - 任务ID
 */
taskSettingController.prototype.moveTaskToToday = function(taskId) {
  try {
    const task = MNNote.new(taskId)
    if (!task) {
      MNUtil.showHUD("任务不存在")
      return
    }
    
    // 检查是否已有日期字段
    const parsed = TaskFieldUtils.parseTaskComments(task)
    let hasDateField = false
    let dateFieldIndex = -1
    
    for (let i = 0; i < parsed.comments.length; i++) {
      if (parsed.comments[i].text && parsed.comments[i].text.includes('📅 日期:')) {
        hasDateField = true
        dateFieldIndex = i
        break
      }
    }
    
    const today = new Date()
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    const dateFieldHtml = TaskFieldUtils.createFieldHtml(`📅 日期: ${dateStr}`, 'subField')
    
    if (hasDateField && dateFieldIndex >= 0) {
      // 更新现有的日期字段
      const comments = task.comments
      if (comments && comments[dateFieldIndex]) {
        comments[dateFieldIndex].text = dateFieldHtml
        comments[dateFieldIndex].type = "markdownComment"
      }
    } else {
      // 添加新的日期字段
      task.appendMarkdownComment(dateFieldHtml)
    }
    
    MNUtil.showHUD("✅ 已添加到今日任务")
    
    // 刷新任务队列
    this.loadTaskQueueData()
    
  } catch (error) {
    taskUtils.addErrorLog(error, "moveTaskToToday")
    MNUtil.showHUD("添加到今日失败")
  }
}

/**
 * 导出任务队列
 * @this {settingController}
 */
taskSettingController.prototype.exportTaskQueue = function() {
  try {
    MNUtil.showHUD("功能开发中...")
    // TODO: 实现任务队列导出功能
  } catch (error) {
    taskUtils.addErrorLog(error, "exportTaskQueue")
    MNUtil.showHUD("导出失败")
  }
}

/**
 * 编辑任务
 * @this {settingController}
 * @param {string} taskId - 任务ID
 */
taskSettingController.prototype.editTask = function(taskId) {
  try {
    if (!taskId) {
      MNUtil.showHUD("❌ 任务ID无效")
      return
    }
    
    // 验证任务是否存在
    const task = MNNote.new(taskId)
    if (!task) {
      MNUtil.showHUD("❌ 任务不存在")
      return
    }
    
    // 保存当前编辑的任务ID
    this.currentEditingTaskId = taskId
    
    // 使用 viewManager 切换到任务编辑器视图
    if (this.viewManager) {
      this.viewManager.switchTo('taskeditor')
      MNUtil.showHUD("✏️ 正在打开任务编辑器...")
    } else {
      // 如果没有 viewManager，尝试通过 WebView 切换
      const script = `
        // 确保任务编辑器导航项可见
        const editorNav = document.querySelector('[data-view="taskeditor"]');
        if (editorNav && editorNav.style.display === 'none') {
          editorNav.style.display = '';
        }
        
        // 切换到任务编辑器视图
        if (typeof switchView === 'function') {
          switchView('taskeditor');
          'success';
        } else {
          'switchView_not_found';
        }
      `
      
      this.runJavaScriptInWebView(script).then(result => {
        if (result === 'success') {
          MNUtil.showHUD("✏️ 正在打开任务编辑器...")
        } else {
          MNUtil.showHUD("❌ 无法切换到任务编辑器")
        }
      })
    }
    
  } catch (error) {
    taskUtils.addErrorLog(error, "editTask")
    MNUtil.showHUD("打开任务编辑器失败")
  }
}

/**
 * 创建任务编辑器 WebView
 * @this {settingController}
 */
taskSettingController.prototype.createTaskEditorWebView = function() {
  try {
    const frame = {
      x: 50,
      y: 50,
      width: 800,
      height: 600
    }
    
    this.taskEditorWebView = new UIWebView(frame)
    this.taskEditorWebView.delegate = this
    this.taskEditorWebView.backgroundColor = UIColor.whiteColor()
    this.taskEditorWebView.layer.cornerRadius = 10
    this.taskEditorWebView.layer.masksToBounds = true
    this.taskEditorWebView.layer.borderWidth = 1
    this.taskEditorWebView.layer.borderColor = UIColor.grayColor().CGColor
    
    // 加载任务编辑器HTML
    const htmlPath = taskConfig.mainPath + '/taskeditor.html'
    this.taskEditorWebView.loadFileURLAllowingReadAccessToURL(
      NSURL.fileURLWithPath(htmlPath),
      NSURL.fileURLWithPath(taskConfig.mainPath)
    )
    
    // 添加到视图
    MNUtil.studyView.addSubview(this.taskEditorWebView)
    
  } catch (error) {
    taskUtils.addErrorLog(error, "createTaskEditorWebView")
    MNUtil.showHUD("创建编辑器失败")
  }
}

/**
 * 处理从侧边栏打开任务编辑器
 * @this {settingController}
 */
taskSettingController.prototype.handleOpenTaskEditor = function() {
  try {
    // 获取当前选中的任务
    const focusNote = MNNote.getFocusNote()
    
    if (!focusNote) {
      MNUtil.showHUD("❌ 请先选中一个任务卡片")
      return
    }
    
    // 检查是否是任务卡片
    if (!MNTaskManager.isTaskCard(focusNote)) {
      MNUtil.showHUD("❌ 请选中一个任务卡片（格式：【类型｜状态】内容）")
      return
    }
    
    // 调用 editTask 方法
    this.editTask(focusNote.noteId)
    
  } catch (error) {
    taskUtils.addErrorLog(error, "handleOpenTaskEditor")
    MNUtil.showHUD("打开任务编辑器失败")
  }
}

/**
 * 加载任务详情到编辑器
 * @this {settingController}
 */
taskSettingController.prototype.loadTaskDetailForEditor = function() {
  try {
    if (!this.currentEditingTaskId) {
      MNUtil.showHUD("❌ 没有选中的任务")
      return
    }
    
    const task = MNNote.new(this.currentEditingTaskId)
    if (!task) {
      MNUtil.showHUD("❌ 任务不存在")
      return
    }
    
    // 解析任务信息
    const taskInfo = MNTaskManager.parseTaskTitle(task.noteTitle)
    const parsed = TaskFieldUtils.parseTaskComments(task)
    
    // 构建任务数据
    const taskData = {
      id: this.currentEditingTaskId,
      title: taskInfo.content,
      type: taskInfo.type,
      status: taskInfo.status,
      fields: [],
      scheduledDate: null
    }
    
    // 处理字段
    parsed.taskFields.forEach(field => {
      const fieldName = field.content
      let fieldContent = ''
      
      // 获取字段的具体内容
      if (field.text.includes('<span')) {
        // 从HTML中提取内容
        const match = field.text.match(/<span[^>]*>([^<]*)<\/span>/)
        if (match && match[1]) {
          fieldContent = match[1].trim()
        }
      }
      
      // 特殊处理日期字段
      if (fieldName.includes('日期:')) {
        const dateMatch = fieldName.match(/日期:\s*(.+)/)
        if (dateMatch) {
          taskData.scheduledDate = dateMatch[1]
          return // 跳过日期字段，单独处理
        }
      }
      
      taskData.fields.push({
        name: fieldName,
        content: fieldContent,
        isMainField: field.isMainField
      })
    })
    
    // 发送数据到编辑器
    const encodedData = encodeURIComponent(JSON.stringify(taskData))
    const script = `loadTaskFromPlugin('${encodedData}')`
    this.runJavaScriptInWebView(script, 'taskEditorWebView')
    
  } catch (error) {
    taskUtils.addErrorLog(error, "loadTaskDetailForEditor")
    MNUtil.showHUD("加载任务详情失败")
  }
}

/**
 * 关闭任务编辑器
 * @this {settingController}
 */
taskSettingController.prototype.closeTaskEditor = function() {
  try {
    if (this.taskEditorWebView) {
      this.taskEditorWebView.hidden = true
    }
    this.currentEditingTaskId = null
  } catch (error) {
    taskUtils.addErrorLog(error, "closeTaskEditor")
  }
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