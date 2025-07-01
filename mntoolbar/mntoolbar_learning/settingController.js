/**
 * 获取 settingController 实例的工具函数
 * 这是 JSB 框架中获取单例的标准模式
 * 
 * 为什么需要这个函数？
 * - JSB 框架中，this 的行为与标准 JavaScript 不同
 * - 在方法内部不能使用 var self = this 或 let self = this
 * - 必须使用这种函数方式来获取正确的实例引用
 * 
 * @return {settingController} 返回 settingController 的单例实例
 */
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
/**
 * settingController 类定义
 * 这是 MN Toolbar 的设置界面控制器，负责管理所有设置相关的 UI 和逻辑
 * 
 * 继承关系：
 * - UIViewController: iOS 的视图控制器基类，负责管理一个屏幕的内容
 * 
 * 实现的协议（尖括号内的内容）：
 * - NSURLConnectionDelegate: 处理网络连接（虽然这里未使用）
 * - UIImagePickerControllerDelegate: 处理图片选择（用于自定义按钮图标）
 * - UIWebViewDelegate: 处理 WebView 交互（用于显示和编辑 JSON 配置）
 * 
 * 主要功能：
 * 1. 管理工具栏按钮的配置（顺序、显示/隐藏）
 * 2. 提供 JSON 编辑器来配置按钮功能
 * 3. 管理插件间的协作（如 MNEditor、MNChatAI 等）
 * 4. 处理配置的导入/导出
 * 5. 管理动态工具栏和弹出菜单设置
 */
var settingController = JSB.defineClass('settingController : UIViewController <NSURLConnectionDelegate,UIImagePickerControllerDelegate,UIWebViewDelegate>', {  // 继承视图控制器，能管理界面, UIViewController：像是"界面管理许可证"，有了它才能管理界面
  /**
   * 视图加载完成后调用的生命周期方法
   * 这是 iOS 开发中的重要方法，当视图控制器的视图被加载到内存后调用
   * 类似于网页的 DOMContentLoaded 事件
   */
  viewDidLoad: function() {
    // 获取当前实例（必须使用这种方式，不能用 this）
    let self = getSettingController()
    try {
        // 初始化基本属性
        self.init()
        
        // 设置窗口初始位置和大小
        // pluginDemoFrame 是一个工具类，用于设置视图的位置和大小
        // 参数：(视图, x坐标, y坐标, 宽度, 高度)
        pluginDemoFrame.set(self.view,50,50,355,500)
        
        // 保存初始尺寸，用于窗口最大化/还原功能
        self.lastFrame = self.view.frame;
        self.currentFrame = self.view.frame
        
        // 标记这是主窗口
        self.isMainWindow = true
        self.title = "main"
        self.preAction = ""  // 上一个选中的动作
        self.test = [0]      // 测试用数组
        self.moveDate = Date.now()  // 记录移动时间，用于防抖
        
        // 颜色数组，对应 MarginNote 的 16 种颜色
        // true 表示该颜色被选中/启用
        self.color = [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true]
        
        // 设置窗口阴影效果，让窗口看起来有立体感
        self.view.layer.shadowOffset = {width: 0, height: 0};  // 阴影偏移
        self.view.layer.shadowRadius = 15;     // 阴影模糊半径
        self.view.layer.shadowOpacity = 0.5;   // 阴影透明度
        // 设置窗口外观
        self.view.layer.shadowColor = UIColor.colorWithWhiteAlpha(0.5, 1);  // 阴影颜色
        self.view.layer.cornerRadius = 11      // 圆角半径，让窗口看起来更柔和
        self.view.layer.opacity = 1.0          // 窗口不透明度（1.0 = 完全不透明）
        
        // MNUtil 提供的颜色工具函数，将十六进制颜色转换为 UIColor
        // hexColorAlpha(颜色值, 透明度)
        self.view.layer.borderColor = MNUtil.hexColorAlpha("#9bb2d6",0.8)  // 边框颜色
        self.view.layer.borderWidth = 0        // 边框宽度，0 表示无边框
        // self.view.backgroundColor = MNUtil.hexColorAlpha("#9bb2d6",0.8)  // 背景色（已注释）
        
        // 初始化配置对象
        self.config = {}
        if (!self.config.delay) {
          self.config.delay = 0  // 设置默认延迟为 0
        }
        
        // 如果设置视图还没创建，则创建它
        // settingView 包含所有设置相关的 UI 元素
        if (!self.settingView) {
          self.createSettingView()
        }
    } catch (error) {
      // 如果初始化过程中出错，显示错误提示
      // MNUtil.showHUD 显示一个短暂的悬浮提示
      MNUtil.showHUD(error)
    }
    
    // 创建最大化按钮
    self.createButton("maxButton","maxButtonTapped:")
    self.maxButton.setTitleForState('➕', 0);  // 设置按钮文字为 ➕ 符号，状态 0 = 正常状态
    self.maxButton.titleLabel.font = UIFont.systemFontOfSize(10);  // 设置字体大小
    
    // MNButton 是对 UIButton 的封装，提供更简便的 API
    MNButton.setColor(self.maxButton, "#3a81fb",0.5)  // 设置按钮颜色和透明度
    self.maxButton.width = 18   // 设置按钮大小
    self.maxButton.height = 18


    // 创建移动按钮（拖动窗口的手柄）
    self.createButton("moveButton")
    MNButton.setColor(self.moveButton, "#3a81fb",0.5)
    self.moveButton.width = 150   // 移动按钮比较宽，方便拖动
    self.moveButton.height = 17
    // self.moveButton.showsTouchWhenHighlighted = true  // 触摸时高亮（已注释）
    
    // 布局设置视图中的所有元素
    self.settingViewLayout()

    // 为移动按钮添加拖动手势
    // UIPanGestureRecognizer 是 iOS 的拖动手势识别器
    self.moveGesture = new UIPanGestureRecognizer(self,"onMoveGesture:")
    self.moveButton.addGestureRecognizer(self.moveGesture)  // 将手势添加到按钮上
    self.moveGesture.view.hidden = false
    self.moveGesture.addTargetAction(self,"onMoveGesture:")  // 设置手势的回调方法

    // 为调整大小按钮添加拖动手势
    self.resizeGesture = new UIPanGestureRecognizer(self,"onResizeGesture:")
    self.resizeButton.addGestureRecognizer(self.resizeGesture)
    self.resizeGesture.view.hidden = false
    self.resizeGesture.addTargetAction(self,"onResizeGesture:")
    // self.settingController.view.hidden = false
    
    // 初始化时默认选中第一个按钮
    // pluginDemoConfig.action 是当前配置的按钮列表
    self.selectedItem = pluginDemoConfig.action[0]
    
    // 获取所有可用的动作（按钮）
    // 将用户配置的按钮和默认按钮合并
    let allActions = pluginDemoConfig.action.concat(pluginDemoConfig.getDefaultActionKeys().slice(pluginDemoConfig.action.length))

    try {
      // 设置按钮列表的显示
      self.setButtonText(allActions,self.selectedItem)
      
      // 延迟 0.5 秒后显示选中按钮的详细配置
      // MNUtil.delay 返回一个 Promise，可以用 then 链式调用
      MNUtil.delay(0.5).then(()=>{
        self.setTextview(self.selectedItem)
      })
      
      // 显示设置视图
      self.settingView.hidden = false
    } catch (error) {  
      // 记录错误日志
      // pluginDemoUtils.addErrorLog 会将错误保存到文件中，方便调试
      pluginDemoUtils.addErrorLog(error, "viewDidLoad.setButtonText", info)
    }
  },
  /**
   * 视图将要显示时调用
   * @param {boolean} animated - 是否以动画形式显示
   */
  viewWillAppear: function(animated) {
    // 可以在这里做一些显示前的准备工作
  },
  
  /**
   * 视图将要消失时调用
   * @param {boolean} animated - 是否以动画形式消失
   */
  viewWillDisappear: function(animated) {
    // 可以在这里做一些清理工作
  },
  /**
   * 视图将要重新布局子视图时调用
   * 这是处理屏幕旋转、窗口大小改变的好地方
   */
  viewWillLayoutSubviews: function() {
    let buttonHeight = 25
    // self.view.frame = self.currentFrame
    
    // 获取当前视图的边界（bounds 是相对于自身的坐标系统）
    var viewFrame = self.view.bounds;
    var width    = viewFrame.width
    var height   = viewFrame.height

    height = height-36  // 减去顶部标题栏高度
    
    // 重新布局所有子视图
    self.settingViewLayout()
    self.refreshLayout()
  },
  /**
   * WebView 即将加载请求时的委托方法
   * 这里可以拦截和处理特殊的 URL scheme
   * 
   * @param {UIWebView} webView - 发起请求的 WebView
   * @param {NSURLRequest} request - 请求对象
   * @param {number} type - 导航类型
   * @returns {boolean} - 返回 true 允许加载，返回 false 阻止加载
   */
  webViewShouldStartLoadWithRequestNavigationType: function(webView,request,type){
    try {
    let self = getSettingController()
    let requestURL = request.URL().absoluteString()  // 获取请求的 URL 字符串
    
    if (!requestURL) {
      MNUtil.showHUD("Empty URL")
      return false
    }
    
    // 处理自定义的 URL scheme
    // nativecopy:// 是一个自定义协议，用于从 WebView 复制内容到剪贴板
    if (/^nativecopy\:\/\//.test(requestURL)) {
      // 从 URL 中提取要复制的内容
      let text = decodeURIComponent(requestURL.split("content=")[1])
      MNUtil.copy(text)  // 使用 MNUtil 的复制功能
      return false  // 阻止 WebView 加载这个 URL
    }
    
    return true;  // 其他 URL 正常加载
    } catch (error) {
      pluginDemoUtils.addErrorLog(error, "webViewShouldStartLoadWithRequestNavigationType")
      return false
    }
  },
  /**
   * 改变窗口的透明度
   * @param {number} opacity - 透明度值 (0.0 完全透明 - 1.0 完全不透明)
   */
  changeOpacityTo:function (opacity) {
    self.view.layer.opacity = opacity
  },
  /**
   * 将选中的按钮移动到最顶部
   * 这是按钮排序功能的一部分
   */
  moveTopTapped :function () {
    let self = getSettingController()
    
    // 检查是否正在编辑动态工具栏
    let isEditingDynamic = self.dynamicButton.selected
    
    // 动态工具栏需要订阅才能使用
    if (isEditingDynamic && !pluginDemoUtils.checkSubscribe(true)) {
      self.showHUD("Please subscribe to use this feature")
      return
    }
    
    // 获取所有按钮（根据是否编辑动态工具栏）
    let allActions = pluginDemoConfig.getAllActions(isEditingDynamic)
    
    // 将选中的按钮移动到顶部
    pluginDemoUtils.moveElement(allActions, self.selectedItem, "top")
    
    // 更新显示
    self.setButtonText(allActions,self.selectedItem)
    
    // 保存配置并更新工具栏
    if (isEditingDynamic) {
      // 更新动态工具栏
      if (self.pluginDemoController.dynamicToolbar) {
        self.pluginDemoController.dynamicToolbar.setToolbarButton(allActions)
      }
      pluginDemoConfig.dynamicAction = allActions
      pluginDemoConfig.save("MNToolbar_dynamicAction")
    }else{
      // 更新固定工具栏
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
  /**
   * 最大化/还原按钮的点击事件
   * 切换窗口在最大化和正常大小之间
   */
  maxButtonTapped: function() {
    // 如果当前已经是全屏模式，则还原到原来的大小
    if (self.customMode === "full") {
      self.customMode = "none"
      self.custom = false;
      // self.hideAllButton()
      
      // 设置动画标记，防止动画过程中的其他操作
      self.onAnimate = true
      
      // 使用 MNUtil.animate 执行动画
      // 参数：(动画回调函数, 动画时长秒)
      MNUtil.animate(()=>{
        self.view.frame = self.lastFrame  // 还原到之前保存的尺寸
        self.currentFrame = self.lastFrame
        self.settingViewLayout()
      },0.3).then(()=>{
        // 动画完成后的回调
        self.onAnimate = false
        // self.showAllButton()
        self.settingViewLayout()
        self.editorAdjustSelectWidth()
      })
      return
    }
    
    // 如果当前不是全屏，则最大化
    const frame = MNUtil.studyView.bounds  // 获取学习视图的大小
    self.lastFrame = self.view.frame       // 保存当前尺寸
    self.customMode = "full"
    self.custom = true;
    self.dynamic = false;
    self.onAnimate = true
    
    // 计算目标尺寸
    // macOS 上留一些边距，iOS 上全屏
    let targetFrame = pluginDemoFrame.gen(40, 0, frame.width-80, frame.height)
    if (MNUtil.isIOS) {
      targetFrame = pluginDemoFrame.gen(0, 0, frame.width, frame.height)
    }
    
    // 执行最大化动画
    MNUtil.animate(()=>{
      self.currentFrame = targetFrame
      self.view.frame = targetFrame
      self.settingViewLayout()
    },0.3).then(()=>{
      self.onAnimate = false
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
  /**
   * 处理拖动手势，实现窗口移动
   * 这是一个复杂的方法，需要处理坐标转换和边界限制
   * 
   * @param {UIPanGestureRecognizer} gesture - 拖动手势识别器
   */
  onMoveGesture:function (gesture) {
    // 获取手指在学习视图中的位置
    let locationToMN = gesture.locationInView(pluginDemoUtils.studyController().view)
    
    // 防抖处理：避免过于频繁的更新
    if (!self.locationToButton || !self.miniMode && (Date.now() - self.moveDate) > 100) {
      // 获取手势的移动量
      let translation = gesture.translationInView(pluginDemoUtils.studyController().view)
      
      // 获取手指在不同坐标系中的位置
      let locationToBrowser = gesture.locationInView(self.view)  // 相对于设置窗口
      let locationToButton = gesture.locationInView(gesture.view) // 相对于按钮
      
      // 计算初始点击位置
      let newY = locationToButton.y-translation.y 
      let newX = locationToButton.x-translation.x
      
      // 手势状态 1 = UIGestureRecognizerStateBegan (开始)
      if (gesture.state === 1) {
        // 记录初始点击位置
        self.locationToBrowser = {x:locationToBrowser.x-translation.x,y:locationToBrowser.y-translation.y}
        self.locationToButton = {x:newX,y:newY}
      }
    }
    
    self.moveDate = Date.now()  // 更新移动时间
    
    // 计算窗口新位置
    let location = {x:locationToMN.x - self.locationToButton.x-gesture.view.frame.x,
                    y:locationToMN.y -self.locationToButton.y-gesture.view.frame.y}

    // 获取学习视图的边界，用于限制窗口位置
    let studyFrame = MNUtil.studyView.bounds
    
    // 使用 constrain 函数限制窗口位置，防止移出屏幕
    let y = pluginDemoUtils.constrain(location.y, 0, studyFrame.height-15)
    let x = pluginDemoUtils.constrain(location.x, 0, studyFrame.width-15)
    
    // 如果之前是全屏模式，拖动时还原到原来大小
    if (self.custom) {
      self.customMode = "None"
      MNUtil.animate(()=>{
        pluginDemoFrame.set(self.view,x,y,self.lastFrame.width,self.lastFrame.height)
        self.currentFrame  = self.view.frame
        self.settingViewLayout()
      },0.1)  // 0.1秒的快速动画
    }else{
      // 正常拖动，直接设置位置
      pluginDemoFrame.set(self.view,x,y)
      self.currentFrame  = self.view.frame
    }
    self.custom = false;
  },
  /**
   * 处理调整大小的手势
   * 通过拖动右下角的按钮来调整窗口大小
   * 
   * @param {UIPanGestureRecognizer} gesture - 拖动手势识别器
   */
  onResizeGesture:function (gesture) {
    self.custom = false;
    self.customMode = "none"
    
    // 获取调整大小按钮的位置
    let baseframe = gesture.view.frame
    
    // 获取手指在设置窗口中的位置
    let locationToBrowser = gesture.locationInView(self.view)
    
    // 计算新的宽度和高度
    // 加上 0.3 倍的按钮大小作为边距
    // constrain 函数确保尺寸在最小值和最大值之间
    let width = pluginDemoUtils.constrain(locationToBrowser.x+baseframe.width*0.3, 
                                          355,  // 最小宽度
                                          MNUtil.studyView.frame.width)  // 最大宽度
    let height = pluginDemoUtils.constrain(locationToBrowser.y+baseframe.height*0.3, 
                                           475,  // 最小高度
                                           MNUtil.studyView.frame.height) // 最大高度
    
    // 设置新的窗口大小
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


/**
 * 初始化方法
 * 设置一些基本属性的初始值
 * 
 * 注意：这里使用 prototype 来扩展类
 * 这是因为 JSB.defineClass 中不能直接定义 init 方法
 */
settingController.prototype.init = function () {
  this.custom = false;          // 是否处于自定义模式
  this.customMode = "None"      // 自定义模式类型（"full" = 全屏，"None" = 正常）
  this.selectedText = '';       // 当前选中的文本
  this.searchedText = '';       // 搜索的文本
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

/**
 * 通用的按钮创建方法
 * 这个方法封装了创建按钮的常见步骤
 * 
 * @param {string} buttonName - 按钮的属性名，会作为 this[buttonName] 保存
 * @param {string} targetAction - 点击事件的回调方法名，如 "buttonTapped:"
 * @param {string} superview - 父视图名称，如果不提供则添加到 self.view
 */
settingController.prototype.createButton = function (buttonName,targetAction,superview) {
  // 创建一个标准按钮（buttonWithType:0 = UIButtonTypeCustom）
  this[buttonName] = UIButton.buttonWithType(0);
  
  // 设置自动布局遮罩
  // 1 << 0 = UIViewAutoresizingFlexibleLeftMargin (左边距灵活)
  // 1 << 3 = UIViewAutoresizingFlexibleBottomMargin (下边距灵活)
  this[buttonName].autoresizingMask = (1 << 0 | 1 << 3);
  
  // 设置按钮文字颜色
  this[buttonName].setTitleColorForState(UIColor.whiteColor(),0);  // 正常状态为白色
  this[buttonName].setTitleColorForState(pluginDemoConfig.highlightColor, 1);  // 高亮状态
  
  // 使用 MNButton 工具类设置颜色
  MNButton.setColor(this[buttonName], "#9bb2d6", 0.8)
  
  // 设置圆角和裁剪
  this[buttonName].layer.cornerRadius = 8;
  this[buttonName].layer.masksToBounds = true;  // 裁剪超出圆角的部分
  
  // 设置默认字体
  this[buttonName].titleLabel.font = UIFont.systemFontOfSize(16);

  // 如果提供了点击事件，添加事件监听
  if (targetAction) {
    // 1 << 6 = UIControlEventTouchUpInside (手指在按钮内部抬起)
    this[buttonName].addTargetActionForControlEvents(this, targetAction, 1 << 6);
  }
  
  // 添加到指定的父视图
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

/**
 * 布局设置视图中的所有元素
 * 这个方法会根据窗口大小调整所有子视图的位置
 * 支持响应式布局，在不同尺寸下有不同的布局方式
 */
settingController.prototype.settingViewLayout = function (){
  // 获取当前视图的大小
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
 * 创建整个设置界面的 UI
 * 这是一个核心方法，创建了所有的 UI 元素
 * 
 * UI 结构：
 * - settingView：主容器
 *   - tabView：顶部标签栏（Buttons, Dynamic, Popup, More）
 *   - configView：按钮配置页面
 *   - advanceView：高级设置页面
 *   - popupEditView：弹出菜单编辑页面
 * 
 * @this {settingController}
 */
settingController.prototype.createSettingView = function (){
  try {
    // 创建主容器视图
    this.creatView("settingView","view","#ffffff",0.8)  // 白色背景，0.8 透明度
    this.settingView.hidden = true  // 初始状态隐藏
    
    // 创建顶部标签栏容器
    this.creatView("tabView","view","#9bb2d6",0.0)  // 透明背景
    
    // 创建按钮配置页面（默认显示的页面）
    this.creatView("configView","settingView","#9bb2d6",0.0)

    // 创建弹出菜单编辑页面
    this.creatView("popupEditView","settingView","#9bb2d6",0.0)
    this.popupEditView.hidden = true  // 默认隐藏
    
    // 为弹出菜单页面创建滚动视图（因为可能有很多选项）
    this.createScrollView("popupScroll", "popupEditView")
    this.popupScroll.layer.backgroundColor = MNUtil.hexColorAlpha("#c0bfbf",0.0)

    // 创建高级设置页面
    this.creatView("advanceView","settingView","#9bb2d6",0.0)
    this.advanceView.hidden = true  // 默认隐藏


    // 创建“Buttons”标签按钮
    this.createButton("configButton","configButtonTapped:","tabView")
    // MNButton.setConfig 是一个便捷方法，可以一次设置多个属性
    MNButton.setConfig(this.configButton, {
      color:"#457bd3",    // 蓝色背景
      alpha:0.9,          // 透明度
      opacity:1.0,        // 不透明度
      title:"Buttons",    // 按钮文字
      font:17,            // 字体大小
      radius:10,          // 圆角
      bold:true           // 粗体
    })
    // sizeThatFits 计算按钮需要的大小，+15 是为了留一些边距
    this.configButton.width = this.configButton.sizeThatFits({width:150,height:30}).width+15
    this.configButton.height = 30
    this.configButton.selected = true  // 默认选中

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

    // 为每个弹出菜单按钮创建配置项
    // 这里遍历所有可用的弹出菜单按钮，为每个创建一个配置行
    try {
      pluginDemoConfig.allPopupButtons.forEach(buttonName=>{
        // 为每个弹出菜单创建一个按钮和一个开关
        let replaceButtonName = "replacePopupButton_"+buttonName  // 如：replacePopupButton_card
        let replaceSwtichName = "replacePopupSwtich_"+buttonName  // 如：replacePopupSwtich_card
        
        // 创建按钮（点击可以选择替换的目标动作）
        this.createButton(replaceButtonName,"changePopupReplace:","popupScroll")
        let replaceButton = this[replaceButtonName]
        replaceButton.height = 35
        replaceButton.id = buttonName  // 保存按钮名称作为 ID
        
        // 获取当前配置的目标动作
        let target = pluginDemoConfig.getPopupConfig(buttonName).target
        if (target) {
          // 如果已配置目标，显示目标名称
          let actionName = pluginDemoConfig.getAction(pluginDemoConfig.getPopupConfig(buttonName).target).name
          MNButton.setConfig(replaceButton, {color:"#558fed",alpha:0.9,opacity:1.0,title:buttonName+": "+actionName,font:17,radius:10,bold:true})
        }else{
          // 未配置目标，只显示按钮名
          MNButton.setConfig(replaceButton, {color:"#558fed",alpha:0.9,opacity:1.0,title:buttonName+": ",font:17,radius:10,bold:true})
        }
        
        // 创建开关（启用/禁用该弹出菜单）
        this.createSwitch(replaceSwtichName, "togglePopupReplace:", "popupScroll")
        let replaceSwtich = this[replaceSwtichName]
        replaceSwtich.id = buttonName
        replaceSwtich.on = pluginDemoConfig.getPopupConfig(buttonName).enabled  // 设置开关状态
        replaceSwtich.hidden = false
        replaceSwtich.width = 20
        replaceSwtich.height = 35
      })
    } catch (error) {
      // 错误不影响整体初始化
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

    // 创建 WebView 输入区域（用于编辑 JSON 配置）
    this.createWebviewInput("configView")
    
    // 创建系统输入框（备用，默认隐藏）
    this.creatTextView("systemInput","configView")
    this.systemInput.hidden = true

    // 创建标题输入框（用于编辑按钮名称）
    this.creatTextView("titleInput","configView","#9bb2d6")

    // 初始化 WebView 内容为空 JSON
    let text  = "{}"
    this.setWebviewContent(text)

    // 设置标题输入框的样式
    this.titleInput.text = text.title
    this.titleInput.textColor = MNUtil.hexColorAlpha("#ffffff", 1.0)  // 白色文字
    this.titleInput.font = UIFont.boldSystemFontOfSize(16);          // 16号粗体
    this.titleInput.contentInset = {top: 0,left: 0,bottom: 0,right: 0}         // 内容边距
    this.titleInput.textContainerInset = {top: 0,left: 0,bottom: 0,right: 0}   // 文本容器边距
    this.titleInput.layer.backgroundColor = MNUtil.hexColorAlpha("#457bd3", 0.8) // 蓝色背景

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
 * 设置按钮列表的显示
 * 这个方法会在左侧的滚动视图中显示所有可用的按钮
 * 
 * @param {Array<string>} names - 按钮名称数组，默认为所有可用按钮
 * @param {string} highlight - 要高亮显示的按钮名，默认为当前选中项
 * @this {settingController}
 */
settingController.prototype.setButtonText = function (names=pluginDemoConfig.getAllActions(),highlight=this.selectedItem) {
    this.words = names  // 保存按钮列表
    this.selectedItem = highlight  // 保存选中项
    
    // 遍历所有按钮名称
    names.map((word,index)=>{
      let isHighlight = (word === this.selectedItem)  // 判断是否是选中项
      let buttonName = "nameButton"+index  // 按钮属性名，如 nameButton0, nameButton1...
      
      // 如果按钮不存在，创建它
      if (!this[buttonName]) {
        this.createButton(buttonName,"toggleSelected:","scrollview")
        this[buttonName].titleLabel.font = UIFont.systemFontOfSize(16);
      }
      
      // 设置按钮属性
      this[buttonName].hidden = false
      this[buttonName].id = word  // 保存按钮名称作为 ID
      this[buttonName].isSelected = isHighlight
      
      // 设置颜色：选中的为蓝色，未选中的为白色
      MNButton.setColor(this[buttonName],isHighlight?"#9bb2d6":"#ffffff", 0.8)
      
      // 选中的按钮添加边框
      if (isHighlight) {
        this[buttonName].layer.borderWidth = 2
        this[buttonName].layer.borderColor = MNUtil.hexColorAlpha("#457bd3", 0.8)
      }else{
        this[buttonName].layer.borderWidth = 0
      }
      
      // 设置按钮图标
      MNButton.setImage(this[buttonName], pluginDemoConfig.imageConfigs[word])
    })
    
    // 刷新布局
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