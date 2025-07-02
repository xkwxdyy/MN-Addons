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
  taskController : UIViewController

  // 带"技能"的视图控制器
  taskController : UIViewController <UIImagePickerControllerDelegate,
  UINavigationControllerDelegate>

    实际例子：拍照功能

  1. 声明"我会处理照片"

  // 尖括号里声明：我会处理图片选择
  taskController : UIViewController <UIImagePickerControllerDelegate>

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
   *   UIViewController <NSURLConnectionDelegate,UIImagePickerControllerDelegate,UIWebViewDelegate> 表示 taskController：
  1. 是一个视图控制器（基本身份）
  2. 还会处理图片选择（UIImagePickerControllerDelegate）
  3. 还会处理导航（UINavigationControllerDelegate）
   */
/**
 * settingController 类定义
 * 这是 MN Task 的设置界面控制器，负责管理所有设置相关的 UI 和逻辑
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
        // taskFrame 是一个工具类，用于设置视图的位置和大小
        // 参数：(视图, x坐标, y坐标, 宽度, 高度)
        taskFrame.set(self.view,50,50,355,500)
        
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
    // taskConfig.action 是当前配置的按钮列表
    self.selectedItem = taskConfig.action[0]
    
    // 获取所有可用的动作（按钮）
    // 将用户配置的按钮和默认按钮合并
    let allActions = taskConfig.action.concat(taskConfig.getDefaultActionKeys().slice(taskConfig.action.length))

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
      // taskUtils.addErrorLog 会将错误保存到文件中，方便调试
      taskUtils.addErrorLog(error, "viewDidLoad.setButtonText", info)
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
      taskUtils.addErrorLog(error, "webViewShouldStartLoadWithRequestNavigationType")
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
    if (isEditingDynamic && !taskUtils.checkSubscribe(true)) {
      self.showHUD("Please subscribe to use this feature")
      return
    }
    
    // 获取所有按钮（根据是否编辑动态工具栏）
    let allActions = taskConfig.getAllActions(isEditingDynamic)
    
    // 将选中的按钮移动到顶部
    taskUtils.moveElement(allActions, self.selectedItem, "top")
    
    // 更新显示
    self.setButtonText(allActions,self.selectedItem)
    
    // 保存配置并更新工具栏
    if (isEditingDynamic) {
      // 更新动态工具栏
      if (self.taskController.dynamicTask) {
        self.taskController.dynamicTask.setTaskButton(allActions)
      }
      taskConfig.dynamicAction = allActions
      taskConfig.save("MNTask_dynamicAction")
    }else{
      // 更新固定工具栏
      self.taskController.setTaskButton(allActions)
      taskConfig.action = allActions
      taskConfig.save("MNTask_action")
    }
  },
  /**
   * 🔼 将选中的按钮向上移动一个位置
   * 
   * 【功能说明】
   * 这个方法用于调整工具栏按钮的顺序，将选中的按钮向前（左）移动一个位置。
   * 
   * 【按钮顺序示意图】
   * 移动前: [A] [B] [C*] [D] [E]  （* 表示选中）
   * 移动后: [A] [C*] [B] [D] [E]
   * 
   * 【使用场景】
   * - 用户想要调整工具栏按钮的显示顺序
   * - 将常用按钮移动到更方便的位置
   * - 根据使用频率优化按钮布局
   * 
   * 【订阅限制】
   * - 固定工具栏：免费使用
   * - 动态工具栏：需要订阅
   */
  moveForwardTapped :function () {
    let self = getSettingController()
    try {
    // 检查是否在编辑动态工具栏
    let isEditingDynamic = self.dynamicButton.selected
    
    // 动态工具栏功能需要订阅
    if (isEditingDynamic && !taskUtils.checkSubscribe(true)) {
      self.showHUD("Please subscribe to use this feature")
      return
    }
    
    // 获取当前所有按钮列表
    let allActions = taskConfig.getAllActions(isEditingDynamic)
    
    // 执行移动操作：将选中项向上（向前）移动一位
    taskUtils.moveElement(allActions, self.selectedItem, "up")
    
    // 更新界面显示
    self.setButtonText(allActions,self.selectedItem)
    
    // 根据编辑模式保存配置
    if (isEditingDynamic) {
      // 更新动态工具栏
      if (self.taskController.dynamicTask) {
        self.taskController.dynamicTask.setTaskButton(allActions)
      }
      taskConfig.dynamicAction = allActions
      taskConfig.save("MNTask_dynamicAction")
    }else{
      // 更新固定工具栏
      self.taskController.setTaskButton(allActions)
      taskConfig.action = allActions
      taskConfig.save("MNTask_action")
    }
    } catch (error) {
      taskUtils.addErrorLog(error, "moveForwardTapped")
    }
  },
  /**
   * 🔽 将选中的按钮向下移动一个位置
   * 
   * 【功能说明】
   * 这个方法用于调整工具栏按钮的顺序，将选中的按钮向后（右）移动一个位置。
   * 
   * 【按钮顺序示意图】
   * 移动前: [A] [B] [C*] [D] [E]  （* 表示选中）
   * 移动后: [A] [B] [D] [C*] [E]
   * 
   * 【使用场景】
   * - 用户想要将不常用的按钮移到后面
   * - 调整按钮顺序以符合工作流程
   * - 根据个人偏好自定义布局
   * 
   * 【实现细节】
   * - 使用 moveElement 工具函数进行数组元素交换
   * - 移动后立即更新 UI 和保存配置
   * - 支持固定工具栏和动态工具栏两种模式
   */
  moveBackwardTapped :function () {
    let self = getSettingController()
    try {

    let isEditingDynamic = self.dynamicButton.selected
    if (isEditingDynamic && !taskUtils.checkSubscribe(true)) {
      self.showHUD("Please subscribe to use this feature")
      return
    }
    
    let allActions = taskConfig.getAllActions(isEditingDynamic)
    
    // 执行移动操作：将选中项向下（向后）移动一位
    // 注意：这里有个 -0，可能是之前的代码遗留，实际没有作用
    taskUtils.moveElement(allActions, self.selectedItem, "down")-0
    
    self.setButtonText(allActions,self.selectedItem)
    
    // 同步更新工具栏显示
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
  /**
   * 🔄 重置按钮配置菜单
   * 
   * 【功能说明】
   * 显示一个弹出菜单，让用户选择要重置的配置项。
   * 这是一个危险操作，会清除用户的自定义设置。
   * 
   * 【重置选项说明】
   * 1. Reset all button configs - 重置所有按钮的自定义配置（名称、功能等）
   * 2. Reset fixed button order - 重置固定工具栏的按钮顺序
   * 3. Reset dynamic button order - 重置动态工具栏的按钮顺序
   * 4. Reset all button images - 重置所有自定义按钮图标
   * 
   * 【使用场景】
   * - 配置混乱时恢复默认设置
   * - 想要重新开始自定义
   * - 排除配置问题
   * 
   * @param {UIButton} button - 触发菜单的按钮，用于定位弹出菜单
   */
  resetButtonTapped: async function (button) {
    // 构建菜单项数组
    var commandTable = [
      {title:'🔄   Reset all button configs',object:self,selector:'resetConfig:',param:"config"},
      {title:'🔄   Reset fixed button order',object:self,selector:'resetConfig:',param:"order"},
      {title:'🔄   Reset dynamic button order',object:self,selector:'resetConfig:',param:"dynamicOrder"},
      {title:'🔄   Reset all button images',object:self,selector:'resetConfig:',param:"image"},
    ]
    
    // 显示弹出菜单
    // 参数：触发按钮，菜单项，宽度，方向（0=自动）
    self.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,250,0)
  },
  /**
   * 🔧 执行具体的重置操作
   * 
   * 【功能说明】
   * 根据用户选择的重置类型，执行相应的重置操作。
   * 每种重置都有不同的影响范围和恢复方式。
   * 
   * 【重置类型详解】
   * 
   * 1️⃣ "config" - 重置所有配置
   *    - 清除所有自定义按钮配置
   *    - 恢复按钮默认名称和功能
   *    - 需要用户二次确认（因为影响最大）
   * 
   * 2️⃣ "order" - 重置固定工具栏顺序
   *    - 恢复默认按钮排列顺序
   *    - 只影响固定工具栏
   *    - 自定义配置保留
   * 
   * 3️⃣ "dynamicOrder" - 重置动态工具栏顺序
   *    - 恢复动态工具栏默认顺序
   *    - 只影响动态工具栏
   *    - 需要订阅才能使用动态工具栏
   * 
   * 4️⃣ "image" - 重置按钮图标
   *    - 删除所有自定义图标
   *    - 恢复默认图标
   *    - 清除图标缩放设置
   * 
   * @param {string} param - 重置类型参数
   */
  resetConfig: async function (param) {
    try {
      let self = getSettingController()
      self.checkPopoverController()  // 关闭弹出菜单
      let isEditingDynamic = self.dynamicButton.selected
      
      switch (param) {
        case "config":
          // 最危险的操作，需要用户确认
          let confirm = await MNUtil.confirm("MN Task: Clear all configs?", "MN Task: 清除所有配置？")
          if (confirm) {
            taskConfig.reset("config")
            self.setButtonText()  // 刷新按钮列表
            self.setTextview()    // 刷新配置显示
            MNUtil.showHUD("Reset prompts")
          }
          break;
          
        case "order":
          // 重置固定工具栏的按钮顺序
          taskConfig.reset("order")
          if (!isEditingDynamic) {
            self.setButtonText()  // 只在查看固定工具栏时刷新
          }
          MNUtil.showHUD("Reset fixed order")
          break;
          
        case "dynamicOrder":
          // 重置动态工具栏的按钮顺序
          taskConfig.reset("dynamicOrder")
          if (isEditingDynamic) {
            self.setButtonText()  // 只在查看动态工具栏时刷新
          }
          MNUtil.showHUD("Reset dynamic order")
          break;
          
        case "image":
          // 重置所有按钮图标
          taskConfig.imageScale = {}  // 清除缩放设置
          taskConfig.save("MNTask_imageScale")
          
          // 重新加载所有默认图标
          let keys = taskConfig.getDefaultActionKeys()
          keys.forEach((key)=>{
            // 从插件目录加载默认图标
            taskConfig.imageConfigs[key] = MNUtil.getImage(taskConfig.mainPath+"/"+taskConfig.getAction(key).image+".png")
          })
          
          // 通知工具栏刷新显示
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
  /**
   * ❌ 关闭按钮点击事件
   * 
   * 【功能说明】
   * 关闭设置窗口，保存当前状态并清理临时数据。
   * 
   * 【执行步骤】
   * 1. 移除焦点（blur）- 确保输入框等失去焦点
   * 2. 隐藏窗口 - 支持两种隐藏方式
   * 3. 清理搜索文本 - 重置临时状态
   * 
   * 【隐藏方式说明】
   * - 如果有 addonBar：隐藏到指定位置（可能是缩小到工具栏）
   * - 如果没有 addonBar：直接隐藏窗口
   */
  closeButtonTapped: async function() {
    self.blur()  // 移除键盘焦点
    
    // 根据是否有 addonBar 选择不同的隐藏方式
    if (self.addonBar) {
      self.hide(self.addonBar.frame)  // 隐藏到工具栏位置
    }else{
      self.hide()  // 直接隐藏
    }
    
    // 清理临时状态
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
    let targetFrame = taskFrame.gen(40, 0, frame.width-80, frame.height)
    if (MNUtil.isIOS) {
      targetFrame = taskFrame.gen(0, 0, frame.width, frame.height)
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
  /**
   * 🔄 更改弹出菜单的替换目标
   * 
   * 【功能说明】
   * 当用户点击弹出菜单配置按钮时，显示一个包含所有可用动作的菜单，
   * 让用户选择这个弹出菜单应该触发哪个动作。
   * 
   * 【弹出菜单替换机制】
   * MarginNote 在某些情况下会显示系统弹出菜单（如选中文本时）。
   * 这个功能允许用户将弹出菜单中的默认按钮替换为自己想要的动作。
   * 
   * 例如：
   * - 原本：选中文本 → 弹出菜单显示"复制"按钮
   * - 配置后：选中文本 → 弹出菜单显示"制卡"按钮
   * 
   * 【平台差异】
   * - macOS：弹出方向为 4（右侧）
   * - iOS：弹出方向为 1（上方）
   * 
   * @param {UIButton} button - 被点击的配置按钮，其 id 属性包含要配置的弹出按钮名
   */
  changePopupReplace: function (button) {
    // 获取所有可用的动作列表
    let allActions = taskConfig.getAllActions()
    
    // 将每个动作转换为菜单项
    var commandTable = allActions.map(actionKey=>{
      let actionName = taskConfig.getAction(actionKey).name
      return {
        title:actionName,                    // 菜单项显示的文字
        object:self,                         // 回调对象
        selector:'setPopupReplace:',         // 回调方法
        param:{                              // 传递的参数
          id:button.id,                      // 要配置的弹出按钮 ID
          name:actionName,                   // 动作显示名称
          target:actionKey                   // 目标动作键名
        }
      }
    })
    
    // 根据平台显示不同方向的弹出菜单
    if (MNUtil.appVersion().type === "macOS") {
      self.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,200,4)  // 右侧弹出
    }else{
      self.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,200,1)  // 上方弹出
    }
  },
  /**
   * 🎯 设置弹出菜单的替换目标
   * 
   * 【功能说明】
   * 当用户从菜单中选择一个动作后，此方法会：
   * 1. 更新弹出菜单配置
   * 2. 更新 UI 显示
   * 3. 保存配置到本地
   * 
   * 【数据结构】
   * config = {
   *   id: "card",           // 弹出按钮 ID
   *   name: "制作卡片",    // 动作显示名称
   *   target: "makeCard"    // 目标动作键名
   * }
   * 
   * @param {Object} config - 配置对象，包含 id、name 和 target
   */
  setPopupReplace: function (config) {
    self.checkPopoverController()  // 关闭弹出菜单
    
    try {
      // 获取当前弹出按钮的配置
      let popupConfig = taskConfig.getPopupConfig(config.id)
      
      // 更新目标动作
      popupConfig.target = config.target
      
      // 保存到配置对象
      taskConfig.popupConfig[config.id] = popupConfig
      
      // 更新 UI 显示
      let buttonName = "replacePopupButton_"+config.id
      MNButton.setConfig(self[buttonName], {
        title:config.id+": "+config.name,  // 显示格式："card: 制作卡片"
        font:17,
        radius:10,
        bold:true
      })
      
      // 保存配置到本地存储
      taskConfig.save("MNTask_popupConfig")
    } catch (error) {
      taskUtils.addErrorLog(error, "setPopupReplace")
    }
  },
  /**
   * 🔄 切换弹出菜单替换功能的启用状态
   * 
   * 【功能说明】
   * 通过开关控制某个弹出菜单替换配置是否生效。
   * 关闭后，该弹出按钮会恢复默认行为。
   * 
   * 【使用场景】
   * - 临时禁用某个替换配置
   * - 测试原生功能 vs 自定义功能
   * - 根据不同工作流程切换配置
   * 
   * @param {UISwitch} button - 开关控件，其 id 属性包含弹出按钮名
   */
  togglePopupReplace: function (button) {
    // 获取当前弹出按钮的配置
    let popupConfig = taskConfig.getPopupConfig(button.id)
    
    // 根据开关状态更新启用状态
    if (button.on) {
      popupConfig.enabled = true   // 开启替换
    }else{
      popupConfig.enabled = false  // 关闭替换，恢复默认
    }
    
    // 保存配置
    taskConfig.popupConfig[button.id] = popupConfig
    taskConfig.save("MNTask_popupConfig")
  },
  /**
   * 处理拖动手势，实现窗口移动
   * 这是一个复杂的方法，需要处理坐标转换和边界限制
   * 
   * @param {UIPanGestureRecognizer} gesture - 拖动手势识别器
   */
  onMoveGesture:function (gesture) {
    // 获取手指在学习视图中的位置
    let locationToMN = gesture.locationInView(taskUtils.studyController().view)
    
    // 防抖处理：避免过于频繁的更新
    if (!self.locationToButton || !self.miniMode && (Date.now() - self.moveDate) > 100) {
      // 获取手势的移动量
      let translation = gesture.translationInView(taskUtils.studyController().view)
      
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
    let y = taskUtils.constrain(location.y, 0, studyFrame.height-15)
    let x = taskUtils.constrain(location.x, 0, studyFrame.width-15)
    
    // 如果之前是全屏模式，拖动时还原到原来大小
    if (self.custom) {
      self.customMode = "None"
      MNUtil.animate(()=>{
        taskFrame.set(self.view,x,y,self.lastFrame.width,self.lastFrame.height)
        self.currentFrame  = self.view.frame
        self.settingViewLayout()
      },0.1)  // 0.1秒的快速动画
    }else{
      // 正常拖动，直接设置位置
      taskFrame.set(self.view,x,y)
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
    let width = taskUtils.constrain(locationToBrowser.x+baseframe.width*0.3, 
                                          355,  // 最小宽度
                                          MNUtil.studyView.frame.width)  // 最大宽度
    let height = taskUtils.constrain(locationToBrowser.y+baseframe.height*0.3, 
                                           475,  // 最小高度
                                           MNUtil.studyView.frame.height) // 最大高度
    
    // 设置新的窗口大小
    taskFrame.setSize(self.view,width,height)
    self.currentFrame  = self.view.frame
  },
  /**
   * 🔧 “More”标签页点击事件
   * 
   * 【功能说明】
   * 切换到高级设置页面，这里包含一些高级功能和插件协作设置。
   * 
   * 【高级设置内容】
   * - 插件协作开关（MNEditor、MNChatAI 等）
   * - 按钮颜色自定义
   * - iCloud 同步设置
   * - 工具栏方向切换
   * - 动态顺序启用
   * - 配置导入/导出
   * 
   * 【UI 状态管理】
   * - 显示高级设置视图
   * - 高亮“More”按钮
   * - 隐藏其他所有页面
   * - 重置其他标签按钮颜色
   * 
   * @param {*} params - 未使用的参数
   */
  advancedButtonTapped: function (params) {
    // 显示高级设置视图
    self.advanceView.hidden = false
    self.advancedButton.selected = true
    
    // 隐藏其他视图
    self.configView.hidden = true
    self.configButton.selected = false
    self.dynamicButton.selected = false
    self.popupEditView.hidden = true
    self.popupButton.selected = false
    
    // 更新标签按钮颜色
    MNButton.setColor(self.configButton, "#9bb2d6", 0.8)    // 正常颜色
    MNButton.setColor(self.advancedButton, "#457bd3", 0.8)  // 选中颜色
    MNButton.setColor(self.popupButton, "#9bb2d6", 0.8)     // 正常颜色
    MNButton.setColor(self.dynamicButton, "#9bb2d6", 0.8)   // 正常颜色
  },
  /**
   * 🎯 "Popup"标签页点击事件
   * 
   * 【功能说明】
   * 切换到弹出菜单配置页面，用于管理系统弹出菜单的按钮替换。
   * 
   * 【弹出菜单说明】
   * MarginNote 在以下情况会显示弹出菜单：
   * - 选中文本时
   * - 点击卡片时
   * - 点击链接时
   * 
   * 这个页面允许用户：
   * - 替换弹出菜单中的默认按钮为自定义动作
   * - 启用/禁用替换配置
   * 
   * 【UI 状态管理】
   * - 显示弹出菜单编辑视图
   * - 高亮 "Popup" 按钮
   * - 隐藏其他所有页面
   * - 重新布局以适应内容
   * 
   * @param {*} params - 未使用的参数
   */
  popupButtonTapped: function (params) {
    // 隐藏其他视图
    self.advanceView.hidden = true
    self.advancedButton.selected = false
    self.configView.hidden = true
    self.configButton.selected = false
    self.dynamicButton.selected = false
    
    // 显示弹出菜单编辑视图
    self.popupEditView.hidden = false
    self.popupButton.selected = true
    
    // 更新标签按钮颜色
    MNButton.setColor(self.configButton, "#9bb2d6", 0.8)    // 正常颜色
    MNButton.setColor(self.advancedButton, "#9bb2d6", 0.8)  // 正常颜色
    MNButton.setColor(self.popupButton, "#457bd3", 0.8)     // 选中颜色
    MNButton.setColor(self.dynamicButton, "#9bb2d6", 0.8)   // 正常颜色
    
    // 重新布局以显示弹出菜单配置列表
    self.settingViewLayout()
  },
  /**
   * 🏛️ "Buttons"标签页点击事件
   * 
   * 【功能说明】
   * 切换到主按钮配置页面，这是设置窗口的默认页面。
   * 
   * 【按钮配置页面功能】
   * - 查看和编辑工具栏按钮
   * - 调整按钮顺序
   * - 修改按钮名称和功能
   * - 自定义按钮图标
   * - 测试按钮功能
   * 
   * 【UI 状态管理】
   * - 显示按钮配置视图
   * - 高亮 "Buttons" 按钮
   * - 隐藏其他所有页面
   * - 加载当前固定工具栏的按钮列表
   * 
   * @param {*} params - 未使用的参数
   */
  configButtonTapped: function (params) {
    // 显示按钮配置视图
    self.configView.hidden = false
    self.configButton.selected = true
    
    // 隐藏其他视图
    self.dynamicButton.selected = false
    self.advanceView.hidden = true
    self.advancedButton.selected = false
    self.popupEditView.hidden = true
    self.popupButton.selected = false
    
    // 更新标签按钮颜色
    MNButton.setColor(self.configButton, "#457bd3", 0.8)    // 选中颜色
    MNButton.setColor(self.advancedButton, "#9bb2d6", 0.8)  // 正常颜色
    MNButton.setColor(self.dynamicButton, "#9bb2d6", 0.8)   // 正常颜色
    MNButton.setColor(self.popupButton, "#9bb2d6", 0.8)     // 正常颜色
    
    // 加载并显示固定工具栏的按钮列表
    let action = taskConfig.action
    self.setButtonText(action)
  },
  /**
   * 🌟 "Dynamic"标签页点击事件
   * 
   * 【功能说明】
   * 切换到动态工具栏配置页面。动态工具栏是一个高级功能，
   * 允许用户根据不同的场景使用不同的按钮组合。
   * 
   * 【动态工具栏特点】
   * - 可以有与固定工具栏不同的按钮顺序
   * - 支持快速切换不同的工作模式
   * - 需要订阅才能使用
   * 
   * 【前置条件】
   * - 必须先启用 "Enable Dynamic Order"
   * - 如果没有配置过，会复制固定工具栏的配置作为初始值
   * 
   * 【UI 状态管理】
   * - 显示按钮配置视图（复用 configView）
   * - 高亮 "Dynamic" 按钮
   * - 加载动态工具栏的按钮列表
   * 
   * @param {*} params - 未使用的参数
   */
  dynamicButtonTapped: async function (params) {
    let self = getSettingController()
    
    // 检查是否启用了动态顺序功能
    let dynamicOrder = taskConfig.getWindowState("dynamicOrder")
    if (!dynamicOrder) {
      self.showHUD("Enable Dynamic Order first")  // 提示用户先启用
      return
    }
    
    // 获取动态工具栏配置
    let dynamicAction = taskConfig.dynamicAction
    if (dynamicAction.length === 0) {
      // 如果还没有配置过，复制固定工具栏的配置
      taskConfig.dynamicAction = taskConfig.action
    }
    
    // 显示配置视图
    self.configView.hidden = false
    self.configButton.selected = false
    self.dynamicButton.selected = true
    
    // 隐藏其他视图
    self.advanceView.hidden = true
    self.advancedButton.selected = false
    self.popupEditView.hidden = true
    self.popupButton.selected = false
    
    // 更新标签按钮颜色
    MNButton.setColor(self.configButton, "#9bb2d6", 0.8)    // 正常颜色
    MNButton.setColor(self.advancedButton, "#9bb2d6", 0.8)  // 正常颜色
    MNButton.setColor(self.dynamicButton, "#457bd3", 0.8)   // 选中颜色
    MNButton.setColor(self.popupButton, "#9bb2d6", 0.8)     // 正常颜色
    
    // 加载动态工具栏的按钮列表
    self.setButtonText(dynamicAction)
  },
  /**
   * 📃 选择模板菜单
   * 
   * 【功能说明】
   * 显示一个模板选择菜单，让用户可以快速应用预定义的配置模板。
   * 模板是一些常用的按钮配置，可以帮助用户快速设置复杂的功能。
   * 
   * 【模板类型】
   * - 多级菜单模板
   * - 快捷操作模板
   * - 自定义动作模板
   * 
   * 【智能定位】
   * 根据按钮位置和屏幕剩余空间，自动决定菜单弹出方向：
   * - 空间不足：向左弹出（方向 0）
   * - 空间充足：向右弹出（方向 4）
   * 
   * @param {UIButton} button - 触发菜单的模板按钮
   */
  chooseTemplate: async function (button) {
    let self = getSettingController()
    
    // 获取按钮的 X 坐标（相对于 studyView）
    let buttonX = taskUtils.getButtonFrame(button).x
    
    // 获取当前选中的按钮
    let selected = self.selectedItem
    
    // 获取该按钮可用的模板列表
    let templateNames = taskUtils.getTempelateNames(selected)
    if (!templateNames) {
      return  // 没有可用模板
    }
    
    // 构建菜单项
    var templates = taskUtils.template
    var commandTable = templateNames.map((templateName,index)=>{
      return {
        title:templateName,              // 模板名称
        object:self,                     // 回调对象
        selector:'setTemplate:',         // 回调方法
        param:templates[templateName]    // 模板内容
      }
    })
    
    // 添加标题项
    commandTable.unshift({
      title:"⬇️ Choose a template:",
      object:self,
      selector:'hideTemplateChooser:',
      param:undefined
    })
    
    // 智能决定弹出方向
    let width = 300
    if (MNUtil.studyView.bounds.width - buttonX < (width+40)) {
      // 右侧空间不足，向左弹出
      self.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,0)
    }else{
      // 右侧空间充足，向右弹出
      self.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,4)
    }
  },
  /**
   * 📄 应用选中的模板
   * 
   * 【功能说明】
   * 将选中的模板配置应用到当前按钮上。
   * 模板包含预定义的 JSON 配置，可以快速设置复杂的功能。
   * 
   * @param {Object} config - 模板配置对象
   */
  setTemplate: async function (config) {
    self.checkPopoverController()  // 关闭弹出菜单
    
    // 将模板配置更新到 WebView 编辑器中
    self.updateWebviewContent(JSON.stringify(config))
  },
  /**
   * 📋 复制按钮配置
   * 
   * 【功能说明】
   * 将当前按钮的 JSON 配置复制到剪贴板。
   * 这个功能方便用户：
   * - 备份配置
   * - 分享配置给他人
   * - 在不同按钮间复制配置
   * 
   * 【工作流程】
   * 1. 检查按钮是否可编辑
   * 2. 从 WebView 获取当前配置
   * 3. 复制到剪贴板
   * 4. 显示成功提示
   * 
   * @param {*} params - 未使用的参数
   */
  configCopyTapped: async function (params) {
    let selected = self.selectedItem
    
    // 检查是否可以编辑这个按钮
    if (!taskConfig.checkCouldSave(selected)) {
      return
    }
    
    try {
      // 从 WebView 编辑器获取当前配置
      let input = await self.getWebviewContent()
      
      // 复制到剪贴板
      MNUtil.copy(input)
      
      // 显示成功提示
      MNUtil.showHUD("Copy config")
    } catch (error) {
      taskUtils.addErrorLog(error, "configCopyTapped", info)
    }
  },
  /**
   * 📋 粘贴按钮配置
   * 
   * 【功能说明】
   * 从剪贴板粘贴 JSON 配置到当前按钮。
   * 这个功能可以用于：
   * - 恢复备份的配置
   * - 应用他人分享的配置
   * - 在不同按钮间复制配置
   * 
   * 【工作流程】
   * 1. 检查按钮是否可编辑
   * 2. 从剪贴板获取内容
   * 3. 验证 JSON 格式
   * 4. 保存配置
   * 5. 更新 UI 显示
   * 
   * 【特殊处理】
   * - execute 类型可以粘贴非 JSON 内容
   * - edit 类型可以设置 showOnNoteEdit 属性
   * 
   * @param {*} params - 未使用的参数
   */
  configPasteTapped: async function (params) {
    let selected = self.selectedItem
    
    // 检查是否可以编辑
    if (!taskConfig.checkCouldSave(selected)) {
      return
    }
    
    try {
      // 从剪贴板获取内容
      let input = MNUtil.clipboardText
      
      // 验证格式：execute 类型或有效的 JSON
      if (selected === "execute" || MNUtil.isValidJSON(input)) {
        // 初始化配置对象（如果不存在）
        if (!taskConfig.actions[selected]) {
          taskConfig.actions[selected] = taskConfig.getAction(selected)
        }
        
        // 更新配置
        taskConfig.actions[selected].description = input
        taskConfig.actions[selected].name = self.titleInput.text
        
        // 同步到工具栏
        self.taskController.actions = taskConfig.actions
        if (self.taskController.dynamicTask) {
          self.taskController.dynamicTask.actions = taskConfig.actions
        }
        
        // 保存到本地
        taskConfig.save("MNTask_actionConfig")
        
        // 显示不同的提示
        if (!selected.includes("custom")) {
          MNUtil.showHUD("Save Action: "+self.titleInput.text)
        }else{
          MNUtil.showHUD("Save Custom Action: "+self.titleInput.text)
        }
        
        // edit 类型的特殊处理
        if (selected === "edit") {
          let config = JSON.parse(input)
          if ("showOnNoteEdit" in config) {
            taskConfig.showEditorOnNoteEdit = config.showOnNoteEdit
          }
        }
        
        // 更新 WebView 显示
        self.setWebviewContent(input)
      }else{
        // 无效格式，复制错误信息方便调试
        MNUtil.showHUD("Invalid JSON format: "+input)
        MNUtil.copy("Invalid JSON format: "+input)
      }
    } catch (error) {
      taskUtils.addErrorLog(error, "configSaveTapped", info)
    }
  },
  /**
   * 💾 保存按钮配置
   * 
   * 【功能说明】
   * 保存用户对按钮的自定义配置，包括：
   * - 按钮名称（显示文字）
   * - 按钮功能（JSON 配置）
   * 
   * 【配置格式】
   * 每个按钮的功能由 JSON 格式定义，例如：
   * ```json
   * {
   *   "action": "menu",        // 动作类型
   *   "menuItems": [...]       // 菜单项
   * }
   * ```
   * 
   * 【特殊处理】
   * - execute 类型：可以保存纯文本代码
   * - edit 类型：可设置 showOnNoteEdit 属性
   * - custom 类型：自定义按钮，会有不同的提示
   * 
   * 【数据流】
   * 1. 从 WebView 获取 JSON 配置
   * 2. 验证 JSON 格式
   * 3. 更新内存中的配置
   * 4. 同步到工具栏显示
   * 5. 持久化到本地存储
   * 
   * @param {*} params - 未使用的参数
   */
  configSaveTapped: async function (params) {
    let selected = self.selectedItem
    
    // 检查是否可以保存（某些系统按钮可能不允许修改）
    if (!taskConfig.checkCouldSave(selected)) {
      return
    }
    
    try {
    let actions = taskConfig.actions
    
    // 从 WebView 获取用户编辑的 JSON 配置
    let input = await self.getWebviewContent()
    
    // 验证格式：execute 类型可以不是 JSON，其他必须是有效 JSON
    if (selected === "execute" || MNUtil.isValidJSON(input)) {
      // 如果是新配置，先获取默认配置
      if (!actions[selected]) {
        actions[selected] = taskConfig.getAction(selected)
      }
      
      // 更新配置
      actions[selected].description = input                     // 功能配置
      actions[selected].name = self.titleInput.text            // 显示名称
      
      // 同步更新到工具栏
      self.taskController.actions = actions
      if (self.taskController.dynamicTask) {
        self.taskController.dynamicTask.actions = actions
      }
      
      // 保存到本地
      taskConfig.save("MNTask_actionConfig")
      
      // 显示不同的提示信息
      if (!selected.includes("custom")) {
        MNUtil.showHUD("Save Action: "+self.titleInput.text)
      }else{
        MNUtil.showHUD("Save Custom Action: "+self.titleInput.text)
      }
      
      // 特殊处理：edit 类型可以设置是否在编辑笔记时显示
      if (selected === "edit") {
        let config = JSON.parse(input)
        if ("showOnNoteEdit" in config) {
          taskConfig.showEditorOnNoteEdit = config.showOnNoteEdit
        }
      }
    }else{
      MNUtil.showHUD("Invalid JSON format!")
    }
    } catch (error) {
      taskUtils.addErrorLog(error, "configSaveTapped", info)
    }
  },
  /**
   * ▶️ 运行/测试按钮配置
   * 
   * 【功能说明】
   * 这是一个“试运行”功能，让用户在保存前测试配置是否正确。
   * 点击后会：
   * 1. 临时保存当前配置
   * 2. 立即执行该按钮的功能
   * 3. 让用户看到效果
   * 
   * 【支持的按钮类型】
   * 
   * 1️⃣ custom 系列 - 自定义按钮
   *    直接调用 customActionByDes 执行
   * 
   * 2️⃣ color 系列 - 颜色按钮
   *    解析按钮名中的颜色索引，设置卡片颜色
   * 
   * 3️⃣ 特殊按钮：
   *    - ocr: OCR 识别功能
   *    - timer: 计时器功能
   *    - sidebar: 侧边栏切换
   *    - chatglm: AI 对话功能
   * 
   * 【执行流程】
   * 1. 验证配置格式
   * 2. 临时保存配置
   * 3. 根据按钮类型调用不同的处理逻辑
   * 4. 如果不支持，显示提示
   * 
   * @param {UIButton} button - 触发运行的按钮
   */
  configRunTapped: async function (button) {
    let self = getSettingController()
  try {
    let selected = self.selectedItem
    
    // 检查是否可以保存
    if (!taskConfig.checkCouldSave(selected)) {
      return
    }
    
    // 获取并验证配置
    let input = await self.getWebviewContent()
    if (self.selectedItem === "execute" || MNUtil.isValidJSON(input)) {
      // 临时保存配置（同 configSaveTapped 的逻辑）
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
    
    // 根据按钮类型执行不同的操作
    
    // 自定义按钮
    if (selected.includes("custom")) {
      let des = taskConfig.getDescriptionByName(selected)
      self.taskController.customActionByDes(button,des)
      return
    }
    
    // 颜色按钮
    if (selected.includes("color")) {
      let colorIndex = parseInt(selected.split("color")[1])  // 提取颜色索引
      taskUtils.setColor(colorIndex)
      return
    }
    
    // OCR 功能
    if (selected === "ocr") {
      let des = taskConfig.getDescriptionByName("ocr")
      des.action = "ocr"
      self.taskController.customActionByDes(button,des)
      return
    }
    
    // 计时器功能
    if (selected === "timer") {
      let des = taskConfig.getDescriptionByName("timer")
      des.action = "setTimer"
      self.taskController.customActionByDes(button,des)
      return
    }
    
    // 侧边栏切换
    if (selected === "sidebar") {
      let des = taskConfig.getDescriptionByName("sidebar")
      taskUtils.toggleSidebar(des)
      return
    }
    
    // AI 对话
    if (selected === "chatglm") {
      taskUtils.chatAI()
      return
    }

    // 如果不是以上任何类型，显示不支持
    MNUtil.showHUD("Not supported")
  } catch (error) {
    taskUtils.addErrorLog(error, "configRunTapped", info)
  }
  },
  /**
   * 🎯 按钮选中/图标管理事件
   * 
   * 【功能说明】
   * 这个方法处理两种情况：
   * 1. 选中新按钮：切换到该按钮的配置
   * 2. 再次点击已选中按钮：显示图标管理菜单
   * 
   * 【图标管理菜单】
   * - 从照片库选择新图标
   * - 从文件导入新图标
   * - 从网站下载图标（Appicon Forge、Icon Font）
   * - 调整图标缩放比例
   * - 重置为默认图标
   * 
   * 【视觉反馈】
   * - 选中的按钮：蓝色背景 + 蓝色边框
   * - 未选中的按钮：白色背景 + 无边框
   * 
   * @param {UIButton} button - 被点击的按钮
   */
  toggleSelected:function (button) {
    // 如果点击的是已选中的按钮，显示图标管理菜单
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
    
    // 如果是新选择的按钮，处理选中状态
    button.isSelected = !button.isSelected
    let title = button.id
    self.selectedItem = title
    
    // 重置所有其他按钮的选中状态
    self.words.forEach((entryName,index)=>{
      if (entryName !== title) {
        self["nameButton"+index].isSelected = false
        MNButton.setColor(self["nameButton"+index], "#ffffff", 0.8)  // 白色背景
        self["nameButton"+index].layer.borderWidth = 0               // 无边框
      }
    })
    
    // 设置当前按钮的选中状态
    if (button.isSelected) {
      self.setTextview(title)  // 显示该按钮的配置
      MNButton.setColor(button, "#9bb2d6", 0.8)  // 蓝色背景
      button.layer.borderWidth = 2                // 2像素边框
      button.layer.borderColor = MNUtil.hexColorAlpha("#457bd3", 0.8)  // 深蓝色边框
    }else{
      MNButton.setColor(button, "#ffffff", 0.8)  // 白色背景
    }
  },
  /**
   * 🖼️ 从照片库选择新图标
   * 
   * 【功能说明】
   * 打开系统照片库，让用户选择一张图片作为按钮的新图标。
   * 这是自定义按钮图标的主要方式之一。
   * 
   * 【工作流程】
   * 1. 检查订阅状态（这是高级功能）
   * 2. 创建图片选择器
   * 3. 显示照片库
   * 4. 用户选择后会调用 imagePickerControllerDidFinishPickingMediaWithInfo
   * 
   * 【技术细节】
   * - sourceType = 0：照片库
   * - sourceType = 1：相机
   * - sourceType = 2：相册
   * 
   * @param {string} buttonName - 要更换图标的按钮名称
   */
  changeIconFromPhoto:function (buttonName) {
    self.checkPopoverController()  // 关闭弹出菜单
    
    // 检查订阅状态
    if (taskUtils.checkSubscribe(true)) {
      self.checkPopoverController()
      
      // 创建图片选择器
      self.imagePickerController = UIImagePickerController.new()
      self.imagePickerController.buttonName = buttonName  // 保存按钮名，方便回调时使用
      self.imagePickerController.delegate = self          // 设置代理，接收选择结果
      self.imagePickerController.sourceType = 0           // 0 = 照片库
      // self.imagePickerController.allowsEditing = true  // 允许裁剪（已禁用）
      
      // 以模态方式显示图片选择器
      MNUtil.studyController.presentViewControllerAnimatedCompletion(
        self.imagePickerController,
        true,      // 动画
        undefined  // 完成回调
      )
    }
  },
  /**
   * 📄 从文件选择新图标
   * 
   * 【功能说明】
   * 打开系统文件选择器，让用户从 iCloud Drive、本地文件等位置
   * 选择一个图片文件作为按钮的新图标。
   * 
   * 【支持的文件类型】
   * - PNG、JPG、JPEG、GIF 等所有系统支持的图片格式
   * - 通过 UTI (Uniform Type Identifier) "public.image" 指定
   * 
   * 【工作流程】
   * 1. 检查订阅状态（高级功能）
   * 2. 显示文件选择器
   * 3. 用户选择图片文件
   * 4. 读取图片并设置为按钮图标
   * 
   * 【与照片库选择的区别】
   * - 照片库：只能选择相册中的图片
   * - 文件选择：可以选择任何位置的图片文件，包括 iCloud、其他应用共享的文件等
   * 
   * @param {string} buttonName - 要更换图标的按钮名称
   */
  changeIconFromFile:async function (buttonName) {
    self.checkPopoverController()  // 关闭弹出菜单
    
    if (taskUtils.checkSubscribe(true)) {
      self.checkPopoverController()
      
      // 设置允许选择的文件类型（所有图片格式）
      let UTI = ["public.image"]
      
      // 显示文件选择器并等待用户选择
      let path = await MNUtil.importFile(UTI)
      
      // 从文件路径读取图片（scale = 1）
      let image = MNUtil.getImage(path,1)
      
      // 设置为按钮图标（true 表示是自定义图标）
      taskConfig.setButtonImage(buttonName, image,true)
    }
  },
  /**
   * 🌐 从网站下载新图标
   * 
   * 【功能说明】
   * 打开内置浏览器访问图标网站，让用户下载并选择新图标。
   * 支持的网站包括：
   * - Appicon Forge：应用图标生成器
   * - Icon Font：阿里巴巴图标库
   * 
   * 【使用场景】
   * - 需要专业的图标设计
   * - 想要统一的图标风格
   * - 寻找特定主题的图标
   * 
   * 【窗口大小调整】
   * 如果设置窗口太小，会自动放大到合适的浏览尺寸：
   * - 最小宽度：800 像素
   * - 最小高度：600 像素
   * 
   * 【工作流程】
   * 1. 关闭当前弹出菜单
   * 2. 检查订阅状态
   * 3. 计算合适的窗口大小
   * 4. 通过通知系统打开内置浏览器
   * 5. 用户在网站下载图标后，通过其他方式导入
   * 
   * @param {string} url - 要访问的图标网站 URL
   */
  changeIconFromWeb: function (url) {
    self.checkPopoverController()  // 关闭弹出菜单
    
    if (taskUtils.checkSubscribe(false)) {
      // 记录当前窗口大小，用于动画过渡
      let beginFrame = self.view.frame
      let endFrame = self.view.frame
      
      // 确保浏览器窗口足够大
      if (endFrame.width < 800) {
        endFrame.width = 800
      }
      if (endFrame.height < 600) {
        endFrame.height = 600
      }
      
      // 通知系统打开内置浏览器
      MNUtil.postNotification("openInBrowser", {
        url: url,
        beginFrame: beginFrame,  // 动画起始位置
        endFrame: endFrame       // 动画结束位置
      })
    }
  }, 
  /**
   * 🔍 调整图标缩放比例
   * 
   * 【功能说明】
   * 允许用户调整按钮图标的显示大小。有些图标可能太大或太小，
   * 通过调整缩放比例可以让图标在按钮中显示得更合适。
   * 
   * 【缩放选项】
   * - 1：原始大小（1x）
   * - 2：放大两倍（2x）
   * - 3：放大三倍（3x）
   * - 自定义：输入任意数值（如 0.5、1.5、2.5 等）
   * 
   * 【使用场景】
   * - 图标太小看不清：增大缩放比例
   * - 图标太大超出按钮：减小缩放比例
   * - 不同来源的图标需要统一大小
   * 
   * 【注意事项】
   * - 缩放比例过大可能导致图标模糊
   * - 缩放比例过小可能导致图标难以识别
   * - 建议在 0.5-3 之间调整
   * 
   * @param {string} buttonName - 要调整图标的按钮名称
   */
  changeIconScale:async function (buttonName) {
    self.checkPopoverController()  // 关闭弹出菜单
    
    // 显示选择对话框
    let res = await MNUtil.input(
      "Custom scale",
      "自定义图片缩放比例",
      ["cancel","1","2","3","confirm"]
    )
    
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
  /**
   * 🔄 重置按钮图标
   * 
   * 【功能说明】
   * 将按钮图标恢复为默认图标。当用户对自定义图标不满意时，
   * 可以使用此功能恢复到插件自带的原始图标。
   * 
   * 【工作流程】
   * 1. 清除图标缩放比例设置
   * 2. 从插件目录加载默认图标
   * 3. 通知工具栏刷新按钮显示
   * 4. 显示重置成功提示
   * 
   * 【注意事项】
   * - 重置后无法恢复之前的自定义图标
   * - 重置不会影响按钮的功能配置
   * - 只是恢复视觉显示
   * 
   * 【被注释的代码】
   * 原本还会删除本地保存的自定义图标文件，
   * 但目前这部分功能被暂时禁用了。
   * 
   * @param {string} buttonName - 要重置图标的按钮名称
   */
  resetIcon:function (buttonName) {
    try {
      self.checkPopoverController()  // 关闭弹出菜单
      
      // 清除图标缩放比例配置
      taskConfig.imageScale[buttonName] = undefined
      taskConfig.save("MNTask_imageScale")
      
      // 加载默认图标
      let defaultImage = taskConfig.getAction(buttonName).image
      let imagePath = taskConfig.mainPath + "/" + defaultImage + ".png"
      taskConfig.imageConfigs[buttonName] = MNUtil.getImage(imagePath)
      
      // 通知工具栏刷新按钮
      MNUtil.postNotification("refreshTaskButton", {})
      MNUtil.showHUD("Reset button image")
      
      // 曾经的功能：删除本地保存的自定义图标文件
      // let filePath = taskConfig.imageScale[buttonName].path
      // if (MNUtil.isfileExists(taskConfig.buttonImageFolder+"/"+filePath)) {
      //   NSFileManager.defaultManager().removeItemAtPath(taskConfig.buttonImageFolder+"/"+filePath)
      // }
    } catch (error) {
      taskUtils.addErrorLog(error, "resetIcon")
    }
  },
  /**
   * 🖼️ 图片选择器完成回调
   * 
   * 【功能说明】
   * 这是 UIImagePickerControllerDelegate 协议的回调方法。
   * 当用户在照片库中选择完图片后，系统会调用此方法。
   * 
   * 【回调时机】
   * - 用户在照片库中选择了一张图片
   * - 用户拍摄了一张新照片（如果是从相机启动）
   * - 用户编辑完成（如果启用了编辑功能）
   * 
   * 【info 字典内容】
   * - UIImagePickerControllerOriginalImage: 原始图片
   * - UIImagePickerControllerEditedImage: 编辑后的图片（如果启用编辑）
   * - UIImagePickerControllerMediaType: 媒体类型
   * - UIImagePickerControllerCropRect: 裁剪区域
   * 
   * 【工作流程】
   * 1. 从 info 字典获取用户选择的原始图片
   * 2. 关闭图片选择器界面
   * 3. 将图片设置为按钮图标
   * 
   * @param {UIImagePickerController} ImagePickerController - 图片选择器实例
   * @param {NSDictionary} info - 包含选择结果的信息字典
   */
  imagePickerControllerDidFinishPickingMediaWithInfo:async function (ImagePickerController,info) {
    try {
      // 获取用户选择的原始图片
      let image = info.UIImagePickerControllerOriginalImage
      
      // 关闭图片选择器（动画显示）
      MNUtil.studyController.dismissViewControllerAnimatedCompletion(true,undefined)
      
      // 设置为按钮图标
      // buttonName 之前在 changeIconFromPhoto 中保存到 ImagePickerController 上
      taskConfig.setButtonImage(ImagePickerController.buttonName, image,true)
    } catch (error) {
      MNUtil.showHUD(error)
    }
  },
  /**
   * ❌ 图片选择器取消回调
   * 
   * 【功能说明】
   * 当用户在图片选择器中点击“取消”按钮时，
   * 系统会调用此方法。只需要关闭选择器界面即可。
   * 
   * @param {*} params - 参数（未使用）
   */
  imagePickerControllerDidCancel:function (params) {
    // 关闭图片选择器，返回到设置界面
    MNUtil.studyController.dismissViewControllerAnimatedCompletion(true,undefined)
  },
  /**
   * 🤝 切换插件协作状态
   * 
   * 【功能说明】
   * 控制是否在工具栏中显示其他插件的快捷按钮。
   * MN Task 可以与其他插件协作，显示它们的功能按钮。
   * 
   * 【支持的插件】
   * - MNEditor：文本编辑器
   * - MNChatAI：AI 对话助手
   * - 其他支持协作的插件
   * 
   * 【工作原理】
   * 1. 每个插件可以注册自己的快捷操作到 MN Task
   * 2. 用户可以选择启用/禁用某个插件的按钮
   * 3. 启用后，该插件的按钮会出现在工具栏中
   * 
   * 【UI 更新】
   * - 启用：按钮变蓝色，显示 ✅
   * - 禁用：按钮变灰色，显示 ❌
   * 
   * @param {UIButton} button - 触发的按钮，其 addon 属性包含插件名
   */
  toggleAddonLogo:function (button) {
    if (taskUtils.checkSubscribe(true)) {
      let addonName = button.addon
      
      // 切换状态
      taskConfig.addonLogos[addonName] = !taskConfig.checkLogoStatus(addonName)
      
      // 更新按钮显示
      let isEnabled = taskConfig.checkLogoStatus(addonName)
      button.setTitleForState(
        addonName + ": " + (isEnabled ? "✅" : "❌"),
        0
      )
      
      // 更新按钮颜色
      MNButton.setColor(
        button, 
        isEnabled ? "#457bd3" : "#9bb2d6",  // 启用时蓝色，禁用时灰色
        0.8
      )
      
      // 保存配置
      taskConfig.save("MNTask_addonLogos")
      
      // 刷新插件命令，重新加载按钮
      MNUtil.refreshAddonCommands()
    }
  },
  /**
   * 🎨 保存按钮颜色
   * 
   * 【功能说明】
   * 保存用户自定义的按钮颜色。支持两种格式：
   * 1. 十六进制颜色值（如 #FF5733）
   * 2. 系统预定义变量（如 defaultTintColor）
   * 
   * 【支持的系统变量】
   * - defaultBookPageColor: 书页颜色
   * - defaultHighlightBlendColor: 高亮混合颜色
   * - defaultDisableColor: 禁用颜色
   * - defaultTextColor: 文本颜色
   * - defaultNotebookColor: 笔记本颜色
   * - defaultTintColor: 主题色
   * - defaultTintColorForSelected: 选中状态主题色
   * - defaultTintColorForDarkBackground: 深色背景主题色
   * 
   * 【颜色格式验证】
   * - 十六进制：#RRGGBB 或 #RGB
   * - 必须是有效的颜色值
   * - 大小写不敏感
   * 
   * 【工作流程】
   * 1. 检查订阅状态
   * 2. 获取输入的颜色值
   * 3. 验证颜色格式
   * 4. 保存配置
   * 5. 刷新工具栏按钮
   * 
   * @param {UIButton} button - 触发保存的按钮
   */
  saveButtonColor:function (button) {
    if (!taskUtils.checkSubscribe(true)) {
      return
    }
    
    let color = self.hexInput.text
    
    // 系统预定义颜色变量列表
    let varColors = [
      "defaultBookPageColor",
      "defaultHighlightBlendColor",
      "defaultDisableColor",
      "defaultTextColor",
      "defaultNotebookColor",
      "defaultTintColor",
      "defaultTintColorForSelected",
      "defaultTintColorForDarkBackground"
    ]
    
    // 验证颜色格式
    if (varColors.includes(color) || taskUtils.isHexColor(color)) {
      // 保存颜色配置
      taskConfig.buttonConfig.color = color
      taskConfig.save("MNTask_buttonConfig")
      
      // 立即应用新颜色
      self.taskController.setTaskButton()
      
      MNUtil.showHUD("Save color: " + color)
    } else {
      MNUtil.showHUD("Invalid hex color")
    }
  },
  /**
   * ☁️ 切换 iCloud 同步
   * 
   * 【功能说明】
   * 管理配置的 iCloud 同步功能。可以：
   * - 开启/关闭自动同步
   * - 手动导入/导出配置到 iCloud
   * - 在多设备间同步插件配置
   * 
   * 【工作模式】
   * 1. 已开启同步时：点击会关闭同步
   * 2. 未开启同步时：弹出菜单选择导入或导出
   * 
   * 【同步内容】
   * - 按钮配置
   * - 动作配置
   * - 窗口位置和大小
   * - 自定义图标
   * - 所有个性化设置
   * 
   * 【使用场景】
   * - 在 iPad 和 Mac 之间同步配置
   * - 备份配置到云端
   * - 恢复之前的配置
   * - 分享配置给他人
   * 
   * 【注意事项】
   * - 需要订阅才能使用（不支持免费额度）
   * - 导入会覆盖当前配置
   * - 建议在操作前先备份
   * 
   * 【UI 状态】
   * - 开启：按钮显示 ✅，蓝色背景
   * - 关闭：按钮显示 ❌，灰色背景
   */
  toggleICloudSync:async function () {
    // 检查订阅（不允许免费额度，未订阅会提醒）
    if (!taskUtils.checkSubscribe(false,true,true)) {
      return
    }
    
    // 检查当前同步状态
    let iCloudSync = (self.iCloudButton.currentTitle === "iCloud Sync ✅")
    
    if (iCloudSync) {
      // 如果已开启，则关闭同步
      taskConfig.syncConfig.iCloudSync = !iCloudSync
      self.iCloudButton.setTitleForState("iCloud Sync "+(taskConfig.syncConfig.iCloudSync? "✅":"❌"),0)
      MNButton.setColor(self.iCloudButton, taskConfig.syncConfig.iCloudSync?"#457bd3":"#9bb2d6",0.8)
      taskConfig.save("MNTask_syncConfig",undefined,false)
    } else {
      // 如果未开启，显示导入/导出选项
      let direction = await MNUtil.userSelect(
        "MN Task\nChoose action / 请选择操作", 
        "❗️Back up the configuration before proceeding.\n❗️建议在操作前先备份配置", 
        ["📥 Import / 导入","📤 Export / 导出"]
      )
      
      switch (direction) {
        case 0:
          // 用户取消
          return;
          
        case 2:
          // 导出到 iCloud
          taskConfig.writeCloudConfig(true,true)
          MNUtil.showHUD("Export to iCloud")
          break;
          
        case 1:
          // 从 iCloud 导入
          taskConfig.readCloudConfig(true,false,true)
          MNUtil.showHUD("Import from iCloud")
          
          // 更新 UI
          let allActions = taskConfig.getAllActions()
          self.setButtonText(allActions,self.selectedItem)
          
          // 更新工具栏
          if (self.taskController) {
            self.taskController.setTaskButton(allActions)
          }else{
            MNUtil.showHUD("No taskController")
          }
          
          // 通知其他组件刷新
          MNUtil.postNotification("refreshView",{})
          break;
          
        default:
          break;
      }
      
      // 操作完成后开启同步
      taskConfig.syncConfig.iCloudSync = true
      self.iCloudButton.setTitleForState("iCloud Sync ✅",0)
      MNButton.setColor(self.iCloudButton, "#457bd3",0.8)
      taskConfig.save("MNTask_syncConfig")
    }
  },
  /**
   * 📤 导出配置菜单
   * 
   * 【功能说明】
   * 显示配置导出选项菜单，让用户选择导出目标。
   * 
   * 【导出选项】
   * - ☁️ to iCloud：导出到 iCloud 云端
   * - 📋 to Clipboard：复制到剪贴板
   * - 📝 to CurrentNote：保存到当前笔记
   * - 📁 to File：导出为文件
   * 
   * @param {UIButton} button - 触发菜单的按钮
   */
  exportConfigTapped:function(button){
    var commandTable = [
      {title:'☁️   to iCloud', object:self, selector:'exportConfig:', param:"iCloud"},
      {title:'📋   to Clipboard', object:self, selector:'exportConfig:', param:"clipboard"},
      {title:'📝   to CurrentNote', object:self, selector:'exportConfig:', param:"currentNote"},
      {title:'📁   to File', object:self, selector:'exportConfig:', param:"file"},
    ];
    
    // 显示弹出菜单（向上弹出）
    self.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,250,2)
  },
  /**
   * 💾 执行配置导出
   * 
   * 【功能说明】
   * 根据用户选择的导出方式，将所有配置导出到指定位置。
   * 导出的配置包含所有按钮、动作、窗口状态等信息。
   * 
   * 【导出格式】
   * JSON 格式，包含以下内容：
   * - actions: 所有按钮的功能配置
   * - windowState: 窗口位置和大小
   * - buttonConfig: 按钮颜色等设置
   * - addonLogos: 插件协作设置
   * - popupConfig: 弹出菜单替换配置
   * 
   * 【导出方式详解】
   * 
   * 1️⃣ iCloud
   *    - 保存到 iCloud Drive
   *    - 可在其他设备上导入
   *    - 自动同步
   * 
   * 2️⃣ Clipboard
   *    - 复制 JSON 到剪贴板
   *    - 方便分享给他人
   *    - 可以粘贴到文本编辑器查看
   * 
   * 3️⃣ CurrentNote
   *    - 将配置保存到当前选中的笔记
   *    - 标题设为 "MNTask_Config"
   *    - 内容为格式化的 JSON 代码块
   *    - 支持 Markdown 渲染
   * 
   * 4️⃣ File
   *    - 导出为 .json 文件
   *    - 保存到用户选择的位置
   *    - 文件名：task_config.json
   * 
   * @param {string} param - 导出方式（"iCloud", "clipboard", "currentNote", "file"）
   */
  exportConfig:function(param){
    self.checkPopoverController()  // 关闭弹出菜单
    
    // 检查订阅状态
    if (!taskUtils.checkSubscribe(true)) {
      return
    }
    
    // 获取所有配置
    let allConfig = taskConfig.getAllConfig()
    
    switch (param) {
      case "iCloud":
        // 写入 iCloud
        taskConfig.writeCloudConfig(true,true)
        break;
        
      case "clipborad":  // 注意：这里有拼写错误，但保持原样以兼容
        // 复制到剪贴板
        MNUtil.copyJSON(allConfig)
        break;
        
      case "currentNote":
        // 保存到当前笔记
        let focusNote = MNNote.getFocusNote()
        if(focusNote){
          MNUtil.undoGrouping(()=>{
            focusNote.noteTitle = "MNTask_Config"
            // 使用 Markdown 代码块格式，便于阅读
            focusNote.excerptText = "```JSON\n"+JSON.stringify(allConfig,null,2)+"\n```"
            focusNote.excerptTextMarkdown = true  // 启用 Markdown 渲染
          })
        }else{
          MNUtil.showHUD("Invalid note")
        }
        break;
        
      case "file":
        // 导出为文件
        let filePath = taskConfig.mainPath+"/task_config.json"
        MNUtil.writeJSON(filePath,allConfig)
        // 让用户选择保存位置
        MNUtil.saveFile(filePath,["public.json"])
        break;
        
      default:
        break;
    }
  },
  /**
   * 📥 导入配置菜单
   * 
   * 【功能说明】
   * 显示配置导入选项菜单，让用户选择导入来源。
   * 
   * 【导入选项】
   * - ☁️ from iCloud：从 iCloud 云端导入
   * - 📋 from Clipboard：从剪贴板粘贴
   * - 📝 from CurrentNote：从当前笔记读取
   * - 📁 from File：从文件导入
   * 
   * @param {UIButton} button - 触发菜单的按钮
   */
  importConfigTapped:function(button){
    var commandTable = [
      {title:'☁️   from iCloud',object:self,selector:'importConfig:',param:"iCloud"},
      {title:'📋   from Clipborad',object:self,selector:'importConfig:',param:"clipborad"},  // 注意拼写错误
      {title:'📝   from CurrentNote',object:self,selector:'importConfig:',param:"currentNote"},
      {title:'📁   from File',object:self,selector:'importConfig:',param:"file"},
    ]
    
    // 显示弹出菜单（向上弹出）
    self.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,250,2)
  },
  /**
   * 📲 执行配置导入
   * 
   * 【功能说明】
   * 根据用户选择的导入方式，从指定位置读取配置并应用。
   * 导入会覆盖当前所有配置，建议先备份。
   * 
   * 【导入流程】
   * 1. 从指定来源读取配置
   * 2. 验证配置格式
   * 3. 应用配置到系统
   * 4. 更新 UI 显示
   * 5. 刷新工具栏
   * 6. 保存到本地
   * 
   * 【导入方式详解】
   * 
   * 1️⃣ iCloud
   *    - 从 iCloud Drive 读取
   *    - 自动应用所有配置
   *    - 特殊处理：直接调用专用方法
   * 
   * 2️⃣ Clipboard
   *    - 从剪贴板读取 JSON
   *    - 需要是有效的 JSON 格式
   *    - 适合接收他人分享的配置
   * 
   * 3️⃣ CurrentNote
   *    - 从当前笔记读取
   *    - 笔记标题必须是 "MNTask_Config"
   *    - 支持从 Markdown 代码块提取 JSON
   * 
   * 4️⃣ File
   *    - 选择 .json 文件导入
   *    - 支持从任何位置选择文件
   *    - 自动解析 JSON 内容
   * 
   * 【错误处理】
   * - 无效的 JSON 格式会提示错误
   * - 笔记标题不匹配会提示 "Invalid note"
   * - 文件读取失败会自动处理
   * 
   * @param {string} param - 导入方式（"iCloud", "clipborad", "currentNote", "file"）
   */
  importConfig:async function(param){
    self.checkPopoverController()  // 关闭弹出菜单
    
    // 检查订阅（可以使用免费额度）
    if (!taskUtils.checkSubscribe(true)) {
      return
    }
    
    let config = undefined
    
    switch (param) {
      case "iCloud":
        // iCloud 导入有特殊处理流程
        taskConfig.readCloudConfig(true,false,true)
        let allActions = taskConfig.getAllActions()
        self.setButtonText(allActions,self.selectedItem)
        
        // 更新工具栏
        if (self.taskController) {
          self.taskController.setFrame(taskConfig.getWindowState("frame"))
          self.taskController.setTaskButton(allActions)
        }else{
          MNUtil.showHUD("No addonController")
        }
        
        taskConfig.save()
        MNUtil.postNotification("refreshView",{})
        return;  // iCloud 处理完成，直接返回
        
      case "clipborad":  // 注意拼写错误
        // 从剪贴板读取
        if(MNUtil){
          config = JSON.parse(MNUtil.clipboardText)
        }
        break;
        
      case "currentNote":
        // 从当前笔记读取
        let focusNote = MNNote.getFocusNote()
        if(focusNote && focusNote.noteTitle == "MNTask_Config"){
          // 从 Markdown 代码块中提取 JSON
          config = taskUtils.extractJSONFromMarkdown(focusNote.excerptText)
        }else{
          MNUtil.showHUD("Invalid note")
        }
        break;
        
      case "file":
        // 从文件导入
        let path = await MNUtil.importFile(["public.json"])
        config = MNUtil.readJSON(path)
        break;
        
      default:
        break;
    }
    
    // 应用导入的配置
    taskConfig.importConfig(config)
    
    // 更新 UI
    let allActions = taskConfig.getAllActions()
    self.setButtonText(allActions,self.selectedItem)
    
    // 更新工具栏
    if (self.taskController) {
      self.taskController.setFrame(taskConfig.getWindowState("frame"))
      self.taskController.setTaskButton(allActions)
    }else{
      MNUtil.showHUD("No addonController")
    }
    
    // 保存配置并通知刷新
    taskConfig.save()
    MNUtil.postNotification("refreshView",{})
  },
  /**
   * 🔄 工具栏方向菜单
   * 
   * 【功能说明】
   * 显示工具栏方向设置菜单，可以切换固定工具栏和动态工具栏的方向。
   * 
   * 【方向选项】
   * - ↕️ Vertical：垂直方向（从上到下排列按钮）
   * - ↔️ Horizontal：水平方向（从左到右排列按钮）
   * 
   * 【工具栏类型】
   * - 🛠️ Task Direction：固定工具栏的方向
   * - 🌟 Dynamic Direction：动态工具栏的方向
   * 
   * 【使用场景】
   * - 竖屏时使用垂直布局
   * - 横屏时使用水平布局
   * - 根据个人习惯选择
   * 
   * @param {UIButton} button - 触发菜单的按钮
   */
  changeTaskDirection:async function (button) {
    let self = getSettingController()
    var commandTable = []
    let selector = "toggleTaskDirection:"
    
    // 添加固定工具栏方向选项
    if (taskConfig.vertical()) {
      commandTable.push(self.tableItem('🛠️  Task Direction: ↕️ Vertical', selector,"fixed"))
    }else{
      commandTable.push(self.tableItem('🛠️  Task Direction: ↔️ Horizontal', selector,"fixed"))
    }
    
    // 添加动态工具栏方向选项
    if (taskConfig.vertical(true)) {
      commandTable.push(self.tableItem('🌟  Dynamic Direction: ↕️ Vertical', selector,"dynamic"))
    }else{
      commandTable.push(self.tableItem('🌟  Dynamic Direction: ↔️ Horizontal', selector,"dynamic"))
    }
    
    // 显示弹出菜单
    self.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,300,2)
  },
  /**
   * 🔀 切换工具栏方向
   * 
   * 【功能说明】
   * 切换指定工具栏的方向（垂直/水平）。
   * 
   * @param {string} source - 工具栏类型（"fixed" 或 "dynamic"）
   */
  toggleTaskDirection:function (source) {
    self.checkPopoverController()  // 关闭弹出菜单
    taskConfig.toggleTaskDirection(source)  // 执行方向切换
  },
  /**
   * 🌟 切换动态顺序
   * 
   * 【功能说明】
   * 启用或禁用动态工具栏功能。动态工具栏允许用户：
   * - 拥有与固定工具栏不同的按钮顺序
   * - 快速切换不同的工作模式
   * - 根据场景使用不同的按钮组合
   * 
   * 【使用场景】
   * - 阅读模式：显示标注相关按钮
   * - 整理模式：显示卡片操作按钮
   * - 复习模式：显示记忆相关按钮
   * 
   * 【UI 状态】
   * - 启用：显示 ✅
   * - 禁用：显示 ❌
   * 
   * 【注意事项】
   * - 需要订阅才能使用
   * - 启用后才能编辑动态工具栏
   * 
   * @param {*} params - 未使用的参数
   */
  toggleDynamicOrder:function (params) {
    // 检查订阅状态
    if (!taskUtils.checkSubscribe(true)) {
      return
    }
    
    // 切换状态
    let dynamicOrder = taskConfig.getWindowState("dynamicOrder")
    taskConfig.windowState.dynamicOrder = !dynamicOrder
    
    // 更新按钮显示
    MNButton.setTitle(
      self.dynamicOrderButton, 
      "Enable Dynamic Order: "+(taskConfig.getWindowState("dynamicOrder")?"✅":"❌"),
      undefined,
      true  // 立即更新
    )
    
    // 保存配置
    taskConfig.save("MNTask_windowState")
    
    // 通知工具栏刷新
    MNUtil.postNotification("refreshTaskButton",{})
  }
});


/**
 * 初始化方法
 * 设置一些基本属性的初始值
 * 
 * 注意：这里使用 prototype 来扩展类
 * 这是因为 JSB.defineClass 中不能直接定义 init 方法
 */

/**
 * 🚀 初始化设置控制器的状态
 * 
 * 【功能说明】
 * 这个方法初始化设置控制器的基本状态属性。
 * 在视图加载时调用，确保所有状态变量都有初始值。
 * 
 * 【初始化内容】
 * 1. **自定义模式状态**：
 *    - custom：是否处于自定义按钮配置模式
 *    - customMode：自定义模式的类型
 * 
 * 2. **文本状态**：
 *    - selectedText：当前选中的按钮文本（用于编辑）
 *    - searchedText：搜索框中的文本（用于过滤按钮）
 * 
 * 【自定义模式说明】
 * - "None"：正常模式，显示所有设置选项
 * - "full"：全屏自定义模式，专注于按钮配置
 * - custom = true：正在编辑某个特定按钮
 * 
 * 【使用时机】
 * 在 viewDidLoad 中调用，确保状态初始化完成。
 * 也可以在需要重置状态时调用。
 */
settingController.prototype.init = function () {
  this.custom = false;          // 是否处于自定义模式
  this.customMode = "None"      // 自定义模式类型（"full" = 全屏，"None" = 正常）
  this.selectedText = '';       // 当前选中的文本
  this.searchedText = '';       // 搜索的文本
}

/**
 * 🎨 修改窗口控制按钮的透明度
 * 
 * 【功能说明】
 * 统一设置窗口控制按钮（移动按钮、最大化按钮）的透明度。
 * 通常用于鼠标悬停效果或窗口状态变化时的视觉反馈。
 * 
 * 【使用场景】
 * - 鼠标悬停时增强按钮可见性
 * - 窗口失去焦点时降低按钮透明度
 * - 进入特殊模式时调整按钮显示
 * 
 * @param {number} opacity - 透明度值（0.0 完全透明 - 1.0 完全不透明）
 */
settingController.prototype.changeButtonOpacity = function(opacity) {
  this.moveButton.layer.opacity = opacity
  this.maxButton.layer.opacity = opacity
  // this.closeButton.layer.opacity = opacity
}
/**
 * 🎨 设置按钮的标准布局和样式
 * 
 * 【功能说明】
 * 为按钮应用统一的视觉样式和布局设置。
 * 这确保了设置界面中所有按钮具有一致的外观和行为。
 * 
 * 【样式内容】
 * 1. **自动布局**：设置自适应边距
 * 2. **颜色方案**：
 *    - 正常状态：白色文字
 *    - 高亮状态：使用配置的高亮色
 *    - 背景色：淡蓝色 (#9bb2d6)
 * 3. **外观效果**：
 *    - 圆角：8 像素
 *    - 裁剪超出部分
 * 4. **交互行为**：可选的点击事件
 * 
 * 【自动布局说明】
 * - 1 << 0：UIViewAutoresizingFlexibleLeftMargin（左边距灵活）
 * - 1 << 3：UIViewAutoresizingFlexibleBottomMargin（下边距灵活）
 * 
 * @param {UIButton} button - 要设置样式的按钮
 * @param {string} targetAction - 点击事件的回调方法名（可选）
 */
settingController.prototype.setButtonLayout = function (button,targetAction) {
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
  this[buttonName].setTitleColorForState(taskConfig.highlightColor, 1);  // 高亮状态
  
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

/**
 * 🔄 通用的开关创建方法
 * 
 * 【功能说明】
 * 创建一个 iOS 标准的开关控件（UISwitch）。
 * 开关用于启用/禁用某些功能，提供二元选择。
 * 
 * 【使用场景】
 * - 启用/禁用弹出菜单替换
 * - 开启/关闭插件协作
 * - 切换功能状态
 * 
 * @param {string} switchName - 开关的属性名，会作为 this[switchName] 保存
 * @param {string} targetAction - 状态改变时的回调方法名
 * @param {string} superview - 父视图名称，如果不提供则添加到 self.view
 */
settingController.prototype.createSwitch = function (switchName,targetAction,superview) {
  // 创建开关控件
  this[switchName] = UISwitch.new()
  
  // 注意：这里默认添加到 popupEditView，可能是个 bug
  this.popupEditView.addSubview(this[switchName])
  
  // 设置初始状态
  this[switchName].on = false      // 默认关闭
  this[switchName].hidden = false  // 默认显示
  
  // 添加事件监听
  if (targetAction) {
    // 1 << 12 = UIControlEventValueChanged (值改变事件)
    this[switchName].addTargetActionForControlEvents(this, targetAction, 1 << 12);
  }
  
  // 添加到指定的父视图（会覆盖上面的默认添加）
  if (superview) {
    this[superview].addSubview(this[switchName])
  }else{
    this.view.addSubview(this[switchName]);
  }
}

/**
 * 📜 通用的滚动视图创建方法
 * 
 * 【功能说明】
 * 创建一个可滚动的容器视图（UIScrollView）。
 * 当内容超出可视区域时，用户可以通过滚动查看全部内容。
 * 
 * 【应用场景】
 * - 按钮列表（可能有很多按钮）
 * - 弹出菜单配置列表
 * - 任何需要滚动的内容
 * 
 * @param {string} scrollName - 滚动视图的属性名
 * @param {string} superview - 父视图名称
 */
settingController.prototype.createScrollView = function (scrollName,superview) {
  // 创建滚动视图
  this[scrollName] = UIScrollView.new()
  this[scrollName].hidden = false
  
  // 设置自动布局遮罩
  // 1 << 1 = UIViewAutoresizingFlexibleWidth (宽度灵活)
  // 1 << 4 = UIViewAutoresizingFlexibleHeight (高度灵活)
  this[scrollName].autoresizingMask = (1 << 1 | 1 << 4);
  
  // 设置代理，以便接收滚动事件
  this[scrollName].delegate = this
  
  // 滚动行为设置
  this[scrollName].bounces = true              // 开启弹性效果
  this[scrollName].alwaysBounceVertical = true // 始终允许垂直弹性
  
  // 外观设置
  this[scrollName].layer.cornerRadius = 8  // 圆角
  this[scrollName].backgroundColor = MNUtil.hexColorAlpha("#c0bfbf",0.8)  // 灰色背景
  
  // 添加到父视图
  if (superview) {
    this[superview].addSubview(this[scrollName])
  }else{
    this.view.addSubview(this[scrollName]);
  }
}

/**
 * 🖼️ 布局设置视图中的所有元素
 * 
 * 【功能说明】
 * 这是设置界面的核心布局方法，负责根据窗口大小动态调整所有子视图的位置和大小。
 * 实现了响应式布局，在不同屏幕尺寸下提供最佳的用户体验。
 * 
 * 【布局策略】
 * 1. **紧凑布局**（宽度 < 650px）：
 *    - 垂直排列元素
 *    - 按钮列表在顶部
 *    - JSON 编辑器在底部
 *    - 适合竖屏或小窗口
 * 
 * 2. **标准布局**（宽度 ≥ 650px）：
 *    - 左右分栏布局
 *    - 左侧：按钮列表
 *    - 右侧：JSON 编辑器和工具按钮
 *    - 适合横屏或大窗口
 * 
 * 【布局元素】
 * - maxButton：最大化按钮（右上角）
 * - moveButton：移动按钮（左上角）
 * - settingView：主设置视图容器
 * - scrollview：按钮列表滚动视图
 * - webviewInput：JSON 编辑器
 * - 各种操作按钮：保存、运行、复制、粘贴等
 * 
 * 【响应式设计要点】
 * - 使用相对定位确保元素正确对齐
 * - 动态计算宽度和高度
 * - 保持最小可用空间
 * - 优化触摸目标大小
 * 
 * 【调用时机】
 * - viewWillLayoutSubviews：视图布局更新时
 * - 窗口大小改变时
 * - 设备旋转时
 */
settingController.prototype.settingViewLayout = function (){
  // 获取当前视图的大小
  let viewFrame = this.view.bounds
  let width = viewFrame.width
  let height = viewFrame.height
  taskFrame.set(this.maxButton,width*0.5+80,0)
  taskFrame.set(this.moveButton,width*0.5-75, 0)
  taskFrame.set(this.settingView,0,55,width,height-55)
  taskFrame.set(this.configView,0,0,width-2,height-60)
  taskFrame.set(this.advanceView,0,0,width-2,height-60)
  taskFrame.set(this.popupEditView,0,0,width-2,height-60)
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


  let settingFrame = this.settingView.bounds
  settingFrame.x = 0
  settingFrame.y = 15
  settingFrame.height = 40
  settingFrame.width = settingFrame.width
  this.tabView.frame = settingFrame
  taskFrame.set(this.configButton, 5, 5)
  taskFrame.set(this.dynamicButton, this.configButton.frame.x + this.configButton.frame.width+5, 5)
  taskFrame.set(this.popupButton, this.dynamicButton.frame.x + this.dynamicButton.frame.width+5, 5)
  taskFrame.set(this.advancedButton, this.popupButton.frame.x + this.popupButton.frame.width+5, 5)
  taskFrame.set(this.closeButton, width-35, 5)
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
    MNButton.setImage(this.closeButton, MNUtil.getImage(taskConfig.mainPath+"/stop.png"))
    this.closeButton.width = 30
    this.closeButton.height = 30

    // 为每个弹出菜单按钮创建配置项
    // 这里遍历所有可用的弹出菜单按钮，为每个创建一个配置行
    try {
      taskConfig.allPopupButtons.forEach(buttonName=>{
        // 为每个弹出菜单创建一个按钮和一个开关
        let replaceButtonName = "replacePopupButton_"+buttonName  // 如：replacePopupButton_card
        let replaceSwtichName = "replacePopupSwtich_"+buttonName  // 如：replacePopupSwtich_card
        
        // 创建按钮（点击可以选择替换的目标动作）
        this.createButton(replaceButtonName,"changePopupReplace:","popupScroll")
        let replaceButton = this[replaceButtonName]
        replaceButton.height = 35
        replaceButton.id = buttonName  // 保存按钮名称作为 ID
        
        // 获取当前配置的目标动作
        let target = taskConfig.getPopupConfig(buttonName).target
        if (target) {
          // 如果已配置目标，显示目标名称
          let actionName = taskConfig.getAction(taskConfig.getPopupConfig(buttonName).target).name
          MNButton.setConfig(replaceButton, {color:"#558fed",alpha:0.9,opacity:1.0,title:buttonName+": "+actionName,font:17,radius:10,bold:true})
        }else{
          // 未配置目标，只显示按钮名
          MNButton.setConfig(replaceButton, {color:"#558fed",alpha:0.9,opacity:1.0,title:buttonName+": ",font:17,radius:10,bold:true})
        }
        
        // 创建开关（启用/禁用该弹出菜单）
        this.createSwitch(replaceSwtichName, "togglePopupReplace:", "popupScroll")
        let replaceSwtich = this[replaceSwtichName]
        replaceSwtich.id = buttonName
        replaceSwtich.on = taskConfig.getPopupConfig(buttonName).enabled  // 设置开关状态
        replaceSwtich.hidden = false
        replaceSwtich.width = 20
        replaceSwtich.height = 35
      })
    } catch (error) {
      // 错误不影响整体初始化
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
  } catch (error) {
    taskUtils.addErrorLog(error, "createSettingView")
  }
}
/**
 * 🎞️ 设置按钮列表的显示
 * 
 * 【功能说明】
 * 这个方法负责在左侧滚动视图中显示所有可用的工具栏按钮。
 * 每个按钮显示为一个带图标的小方块，点击可以查看/编辑其配置。
 * 
 * 【视觉设计】
 * ```
 * ┌─────────────────┐
 * │  ┌───┐ ┌───┐  │
 * │  │ 🔍 │ │ 📋 │  │  按钮列表
 * │  └───┘ └───┘  │
 * │  ┌───┐ ┌───┐  │
 * │  │ 🎨 │ │ 📑 │  │  选中的有蓝色边框
 * │  └───┘ └───┘  │
 * └─────────────────┘
 * ```
 * 
 * 【动态创建机制】
 * - 按需创建：只有当需要显示时才创建按钮对象
 * - 重用机制：已创建的按钮会被重用，只更新属性
 * - 索引命名：nameButton0, nameButton1... 方便管理
 * 
 * 【交互逻辑】
 * - 单击：选中该按钮，显示其配置
 * - 再次单击：显示图标管理菜单
 * 
 * @param {Array<string>} names - 按钮名称数组，默认为所有可用按钮
 * @param {string} highlight - 要高亮显示的按钮名，默认为当前选中项
 * @this {settingController}
 */
settingController.prototype.setButtonText = function (names=taskConfig.getAllActions(),highlight=this.selectedItem) {
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
      MNButton.setImage(this[buttonName], taskConfig.imageConfigs[word])
    })
    
    // 刷新布局
    this.refreshLayout()
}

/**
 * 📝 显示选中按钮的详细配置
 * 
 * 【功能说明】
 * 当用户选中一个按钮后，这个方法会：
 * 1. 在标题输入框显示按钮名称
 * 2. 在 WebView 编辑器中显示 JSON 配置
 * 
 * 【配置解析流程】
 * ```
 * 按钮名称
 *    ↓
 * 获取按钮配置对象
 *    ↓
 * 解析 description 字段
 *    ↓
 * 转换为 JSON 对象
 *    ↓
 * 显示在 WebView 中
 * ```
 * 
 * 【特殊处理】
 * - sidebar：添加 action: "toggleSidebar"
 * - ocr：添加 action: "ocr"
 * - pasteAsTitle：如果配置无效，提供默认配置
 * 
 * 【错误处理】
 * - 无效的 JSON：复制到剪贴板便于调试
 * - 显示提示信息
 * - 提供空配置作为备用
 * 
 * @param {string} name - 要显示的按钮名称，默认为当前选中项
 * @this {settingController}
 */
settingController.prototype.setTextview = function (name = this.selectedItem) {
  try {
      // 获取按钮配置
      let action = taskConfig.getAction(name)
      
      // 显示按钮名称
      let text  = action.name
      this.titleInput.text= text
      
      // 解析并显示 JSON 配置
      if (MNUtil.isValidJSON(action.description)) {
        let des = JSON.parse(action.description)
        
        // 特殊按钮的额外处理
        if (name === "sidebar") {
          des.action = "toggleSidebar"  // 侧边栏切换动作
        }
        if (name === "ocr") {
          des.action = "ocr"  // OCR 识别动作
        }
        
        // 在 WebView 中显示配置
        this.setWebviewContent(des)
      }else{
        // 配置无效时的处理
        MNUtil.copy(action.description)  // 复制到剪贴板便于调试
        MNUtil.showHUD("Invalid description")
        
        // 提供默认配置
        des = {}
        if (name === "pasteAsTitle") {
          // pasteAsTitle 的默认配置
          des = {
            "action": "setContent",      // 设置内容
            "target": "title",            // 目标是标题
            "content": "{{clipboardText}}" // 内容来自剪贴板
          }
        }
        this.setWebviewContent(des)
      }
  } catch (error) {
    taskUtils.addErrorLog(error, "setTextview")
  }
}
/**
 * 🔄 刷新按钮列表的布局
 * 
 * 【功能说明】
 * 这个方法负责重新计算和排列左侧按钮列表中的所有按钮。
 * 按钮以网格形式排列，从左到右、从上到下。
 * 
 * 【布局算法】
 * ```
 * 按钮排列示意（每行 6 个）：
 * +---+---+---+---+---+---+
 * | 1 | 2 | 3 | 4 | 5 | 6 |
 * +---+---+---+---+---+---+
 * | 7 | 8 | 9 |10 |11 |12 |
 * +---+---+---+---+---+---+
 * ```
 * 
 * 【自适应设计】
 * - 宽度 < 500px：每行 5 个按钮
 * - 宽度 >= 500px：每行 6 个按钮
 * 
 * 【参数说明】
 * - initX, initY: 起始位置（10,10）
 * - buttonWidth, buttonHeight: 按钮尺寸（40x40）
 * - 按钮间距：10px
 * 
 * @this {settingController}
 */
settingController.prototype.refreshLayout = function () {
  if (!this.settingView) {return}  // 如果设置视图不存在，直接返回
  
  if (!this.configView.hidden) {  // 只在配置视图显示时刷新
    var viewFrame = this.scrollview.bounds;
    var xLeft     = 0
    let initX = 10      // 左边距
    let initY = 10      // 上边距
    let initL = 0       // 当前行的按钮数
    let buttonWidth = 40   // 按钮宽度
    let buttonHeight = 40  // 按钮高度
    this.locs = [];       // 保存按钮位置（可能用于其他功能）
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
settingController.prototype.hide = function (frame) {
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
  this.webviewInput.loadHTMLStringBaseURL(taskUtils.JShtml(content))
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
 * @type {taskController}
 */
settingController.prototype.taskController