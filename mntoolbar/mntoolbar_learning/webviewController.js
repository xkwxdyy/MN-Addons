// JSB.require('utils')
// JSB.require('settingController');

/**
 * 🎯 获取工具栏控制器的单例实例（JSB 框架的特殊要求）
 * 
 * 【为什么需要这个函数？】
 * 在 JSB 框架中，this 的行为与标准 JavaScript 不同：
 * ❌ 错误做法：let self = this  // 在 JSB 中无法正确获取实例
 * ✅ 正确做法：let self = getToolbarController()  // 通过函数获取
 * 
 * 【JSB 框架背景】
 * JSB (JavaScript Bridge) 是 MarginNote 插件使用的框架，它：
 * - 桥接 JavaScript 和 Objective-C
 * - 允许 JS 调用原生 iOS/macOS API
 * - 有特殊的类定义和实例管理机制
 * 
 * 【使用场景】
 * 在 JSB.defineClass 定义的任何方法内部，都需要：
 * ```javascript
 * methodName: function() {
 *   let self = getToolbarController()  // 第一行获取实例
 *   // 后续使用 self 而不是 this
 *   self.someProperty = value
 *   self.someMethod()
 * }
 * ```
 * 
 * @return {pluginDemoController} 返回工具栏控制器的单例实例
 */
const getToolbarController = ()=>self

/**
 * 🚀 MN Toolbar 工具栏主控制器 - 插件的核心大脑
 * 
 * 【这个类是做什么的？】
 * 想象一下，这个控制器就像一个智能遥控器，控制着工具栏的一切：
 * - 🎨 界面管理：创建按钮、设置颜色、调整布局
 * - 👆 交互处理：响应点击、长按、拖动等手势
 * - 📡 通信中心：与其他插件模块交流信息
 * - 🎬 动画控制：显示/隐藏的平滑过渡效果
 * 
 * 【控制器架构图】
 * ```
 * pluginDemoController (主控制器)
 *         │
 *         ├─── 视图层 (UIView)
 *         │     ├── 工具栏按钮 (ColorButton0-29)
 *         │     ├── 屏幕切换按钮 (screenButton)
 *         │     └── 最大化按钮 (maxButton)
 *         │
 *         ├─── 手势识别层
 *         │     ├── 拖动手势 (移动工具栏)
 *         │     ├── 长按手势 (触发额外功能)
 *         │     └── 调整大小手势 (改变工具栏尺寸)
 *         │
 *         └─── 业务逻辑层
 *               ├── 动作处理 (customActionByDes)
 *               ├── 菜单管理 (popoverController)
 *               └── 状态管理 (配置保存/恢复)
 * ```
 * 
 * 【继承关系说明】
 * - UIViewController：iOS 标准视图控制器，提供生命周期管理
 * - UIImagePickerControllerDelegate：处理图片选择（OCR、图片插入等）
 * - UINavigationControllerDelegate：处理导航相关操作
 * 
 * 【核心属性预览】
 * - self.view：工具栏的主视图
 * - self.dynamicWindow：是否为动态窗口模式
 * - self.buttonNumber：当前显示的按钮数量
 * - self.ColorButton[0-29]：30个可配置的功能按钮
 */
var pluginDemoController = JSB.defineClass('pluginDemoController : UIViewController <UIImagePickerControllerDelegate,UINavigationControllerDelegate>', {
  /**
   * 🎬 视图加载完成后的初始化方法（生命周期入口）
   * 
   * 【iOS 生命周期说明】
   * 这是 UIViewController 的标准生命周期方法，调用时机：
   * 1. 控制器被创建
   * 2. 视图（self.view）第一次被访问
   * 3. 视图加载到内存中
   * → viewDidLoad 被调用（只调用一次）
   * 
   * 【初始化流程】
   * ```
   * viewDidLoad
   *     │
   *     ├─ 1. 获取控制器实例 (getToolbarController)
   *     ├─ 2. 初始化状态属性
   *     ├─ 3. 设置界面外观
   *     ├─ 4. 创建按钮和控件
   *     ├─ 5. 添加手势识别器
   *     └─ 6. 配置初始布局
   * ```
   * 
   * 【注意事项】
   * - 这里只做初始化，不要做耗时操作
   * - 视图可能还没有正确的 frame，布局相关操作放在 viewWillLayoutSubviews
   * - 使用 try-catch 包裹，防止初始化错误导致插件崩溃
   */
  viewDidLoad: function() {
  try {
    
    // 🔑 获取控制器实例（JSB 框架要求，必须第一行执行）
    let self = getToolbarController()
    // ========== 🏗️ 初始化控制器状态属性 ==========
    
    // 📋 基础状态管理
    self.custom = false;              // 是否为自定义模式（预留功能）
    self.customMode = "None"          // 自定义模式类型（预留功能）
    self.miniMode = false;            // 是否迷你模式（精简界面）
    self.isLoading = false;           // 加载状态标记（防止重复初始化）
    
    // 📐 视图框架管理
    self.lastFrame = self.view.frame;    // 上一帧的位置和大小（用于动画过渡）
    self.currentFrame = self.view.frame  // 当前帧的位置和大小
    
    // 🔢 按钮数量配置
    self.maxButtonNumber = 30         // 最大支持 30 个按钮（硬件限制）
    self.buttonNumber = 9             // 默认显示 9 个按钮
    
    // 🖥️ 平台检测
    self.isMac = MNUtil.version.type === "macOS"  // 平台差异处理
    // macOS 特性：鼠标悬停、右键菜单、键盘快捷键
    // iOS 特性：触摸手势、屏幕旋转、3D Touch
    // ========== 🎛️ 智能按钮数量配置 ==========
    /**
     * 【窗口模式说明】
     * 动态窗口：工具栏会自动显示/隐藏，像 macOS 的 Dock
     * 固定窗口：工具栏始终显示在屏幕上
     * 
     * 【按钮布局计算】
     * 每个按钮的标准尺寸：40x40 像素
     * 按钮间距：5 像素
     * 总占用空间：40 + 5 = 45 像素/按钮
     */
    if (self.dynamicWindow) {
      // 🌟 动态窗口模式
      // 从用户配置中读取上次设置的按钮数量
      self.buttonNumber = pluginDemoConfig.getWindowState("dynamicButton");
    }else{
      // 📌 固定窗口模式
      // 根据上次窗口大小自动计算合适的按钮数量
      let lastFrame = pluginDemoConfig.getWindowState("frame")
      if (lastFrame) {
        // 智能计算：无论横向还是纵向，取最大边计算
        // 横向工具栏：width > height，按宽度计算
        // 纵向工具栏：height > width，按高度计算
        self.buttonNumber = Math.floor(Math.max(lastFrame.width,lastFrame.height)/45)
        
        // 示例：
        // 横向 450x40 → 450/45 = 10 个按钮
        // 纵向 40x450 → 450/45 = 10 个按钮
      }
    }
    // self.buttonNumber = 9  // 🔧 调试：可以强制设置按钮数量
    
    // ========== 🎮 工具栏模式和状态管理 ==========
    
    // 📊 显示模式
    self.mode = 0  // 工具栏模式（预留扩展：0=默认，1=精简，2=扩展）
    
    // 📍 位置模式
    self.sideMode = pluginDemoConfig.getWindowState("sideMode")   
    // "left"：吸附在左边缘
    // "right"：吸附在右边缘  
    // ""：自由位置
    
    // 🖼️ 分屏适配
    self.splitMode = pluginDemoConfig.getWindowState("splitMode") 
    // true：工具栏吸附在文档和脑图的分割线上
    // false：普通模式
    
    // ⏱️ 性能优化
    self.moveDate = Date.now()  // 记录上次移动时间，用于：
    // 1. 防抖处理（避免频繁更新）
    // 2. 手势冲突解决
    // 3. 动画流畅度优化
    
    // ⚙️ 功能状态
    self.settingMode = false    // 是否打开设置界面（互斥状态）
    // ========== 🎨 工具栏视觉效果设计 ==========
    
    // 🌟 阴影效果（让工具栏有悬浮感）
    self.view.layer.shadowOffset = {width: 0, height: 0};  // 四周均匀阴影
    self.view.layer.shadowRadius = 15;                     // 阴影扩散范围
    self.view.layer.shadowOpacity = 0.5;                   // 50% 阴影强度
    
    // 🎨 阴影颜色（使用按钮主题色）
    // pluginDemoConfig.buttonConfig.color: 主题色十六进制值（如 "#9bb2d6"）
    // pluginDemoConfig.buttonConfig.alpha: 透明度（0.0-1.0）
    self.view.layer.shadowColor = MNUtil.hexColorAlpha(
      pluginDemoConfig.buttonConfig.color, 
      pluginDemoConfig.buttonConfig.alpha
    )
    
    // 📐 视图基础样式
    self.view.layer.opacity = 1.0      // 整体不透明度（可通过菜单调整）
    self.view.layer.cornerRadius = 5   // 圆角效果（像素）
    
    // 🎭 背景设置
    // UIColor.whiteColor(): 白色
    // colorWithAlphaComponent(0): 完全透明
    // 结果：透明背景，只显示按钮和阴影
    self.view.backgroundColor = UIColor.whiteColor().colorWithAlphaComponent(0)
    
    // 🏷️ 视图标记
    self.view.mnpluginDemo = true  // 自定义属性，用于：
    // 1. 识别这是 MN Toolbar 的视图
    // 2. 避免与其他插件冲突
    // 3. 调试时快速定位
    // ========== 🎯 配置工具栏按钮数组 ==========
    
    /**
     * 【按钮系统说明】
     * 工具栏支持 30 个按钮位置，分为两类：
     * 1. 预定义按钮（0-26）：内置功能如复制、粘贴、颜色等
     * 2. 自定义按钮（27-35）：custom1-custom9，用户可自由配置
     * 
     * 【动态排序功能】
     * 用户可以在设置中自定义按钮顺序，实现个性化工具栏
     */
    
    // 🔄 检查是否启用动态排序
    let dynamicOrder = pluginDemoConfig.getWindowState("dynamicOrder")
    let useDynamic = dynamicOrder && self.dynamicWindow

    if (self.dynamicWindow) {
      // 🌟 动态窗口模式配置
      
      // 版本兼容性处理：
      // 旧版本：27 个预定义按钮
      // 新版本：27 个预定义 + 9 个自定义 = 36 个按钮
      if (pluginDemoConfig.dynamicAction.length == 27) {
        // 自动升级到新版本，添加 custom1-custom9
        pluginDemoConfig.dynamicAction = pluginDemoConfig.dynamicAction.concat([
          "custom1","custom2","custom3","custom4","custom5",
          "custom6","custom7","custom8","custom9"
        ])
      }
      
      // 应用按钮配置
      // useDynamic=true：使用用户自定义顺序
      // useDynamic=false：使用默认顺序
      self.setToolbarButton(useDynamic ? pluginDemoConfig.dynamicAction : pluginDemoConfig.action)
      
    }else{
      // 📌 固定窗口模式配置
      
      // 同样的版本兼容处理
      if (pluginDemoConfig.action.length == 27) {
        pluginDemoConfig.action = pluginDemoConfig.action.concat([
          "custom1","custom2","custom3","custom4","custom5",
          "custom6","custom7","custom8","custom9"
        ])
      }
      
      // 固定窗口始终使用标准配置
      self.setToolbarButton(pluginDemoConfig.action)
    }
    

    // ========== 创建最大化按钮 ==========
    // >>> max button >>>
    self.maxButton = UIButton.buttonWithType(0);  // 创建自定义类型的按钮（0 表示 custom）
    // self.setButtonLayout(self.maxButton,"maxButtonTapped:")  // 设置按钮布局（暂时注释）
    self.maxButton.setTitleForState('➕', 0);  // 设置按钮标题，0 表示 normal 状态
    self.maxButton.titleLabel.font = UIFont.systemFontOfSize(10);  // 设置字体大小
    // <<< max button <<<


    // ========== 创建控制按钮（已注释的按钮） ==========
    // <<< search button <<<
    // >>> move button >>>
    // self.moveButton = UIButton.buttonWithType(0);  // 移动按钮（已弃用）
    // self.setButtonLayout(self.moveButton)
    // <<< move button <<<
    // self.imageModeButton.setTitleForState('🔍', 0);  // 图片模式按钮（已弃用）
    // self.tabButton      = UIButton.buttonWithType(0);  // 标签按钮（已弃用）
    
    // ========== 创建屏幕切换按钮（用于改变工具栏方向） ==========
    // >>> screen button >>>
    self.screenButton = UIButton.buttonWithType(0);
    self.setButtonLayout(self.screenButton,"changeScreen:")  // 绑定点击事件到 changeScreen: 方法
    self.screenButton.layer.cornerRadius = 7;  // 设置圆角
    self.screenButton.width = 40   // 竖向模式下的宽度
    self.screenButton.height = 15  // 竖向模式下的高度
    // 键盘快捷键相关（已注释，可能用于 macOS）
    // let command = self.keyCommandWithInputModifierFlagsAction('d',1 << 0,'test:')
    // let command = UIKeyCommand.keyCommandWithInputModifierFlagsAction('d',1 << 0,'test:')
    // <<< screen button <<<
    
    // ========== 添加手势识别器 ==========
    // 拖动手势：用于移动整个工具栏
    // if (self.isMac) {  // 原本只在 Mac 上启用，现在所有平台都启用
      self.addPanGesture(self.view, "onMoveGesture:")  // 给整个视图添加拖动手势
    // }else{
      // self.addLongPressGesture(self.screenButton, "onLongPressGesture:")  // iOS 上的长按手势（已弃用）
    // }
    
    // 调整大小手势：通过拖动屏幕按钮来调整工具栏大小
    self.addPanGesture(self.screenButton, "onResizeGesture:")
    // self.addSwipeGesture(self.screenButton, "onSwipeGesture:")  // 滑动手势（已弃用）

    // self.resizeGesture.addTargetAction(self,"onResizeGesture:")  // 另一种添加手势的方式（已弃用）
    
  } catch (error) {
    // 错误处理：记录错误日志，防止插件崩溃
    pluginDemoUtils.addErrorLog(error, "viewDidLoad")
  }
  },
  /**
   * 视图即将显示时调用
   * @param {boolean} animated - 是否使用动画
   */
  viewWillAppear: function(animated) {
    // 暂时没有实现内容
  },
  
  /**
   * 视图即将消失时调用
   * @param {boolean} animated - 是否使用动画
   */
  viewWillDisappear: function(animated) {
    // 暂时没有实现内容
  },
  // ========== Apple Pencil 双击手势处理（已注释，可能用于 iPad） ==========
  // onPencilDoubleTap(){
  //   MNUtil.showHUD("message")
  // },
  // onPencilDoubleTapPerform(perform){
  //   MNUtil.showHUD("message")
  // },
  
  /**
   * 视图即将布局子视图时调用
   * 
   * 这是 iOS 布局系统的回调，当视图的 bounds 改变时会触发
   * 在这里重新计算和设置工具栏按钮的布局
   */
  viewWillLayoutSubviews: function() {
    let self = getToolbarController()
    // 如果正在执行动画，跳过布局更新（避免动画被打断）
    if (self.onAnimate) {
      return
    }
    // 更新工具栏布局
    self.setToolbarLayout()
  },
  /**
   * 滚动视图滚动时的回调
   * 目前未使用，可能预留给未来功能
   */
  scrollViewDidScroll: function() {
  },
  /**
   * 改变工具栏透明度的菜单
   * @param {UIButton} sender - 触发事件的按钮
   */
  changeOpacity: function(sender) {
    self.checkPopover()  // 检查并关闭已存在的弹出菜单
    
    // 创建菜单控制器
    var menuController = MenuController.new();
    // 定义透明度选项菜单
    menuController.commandTable = [
      {title:'100%',object:self,selector:'changeOpacityTo:',param:1.0},  // 完全不透明
      {title:'90%',object:self,selector:'changeOpacityTo:',param:0.9},
      {title:'80%',object:self,selector:'changeOpacityTo:',param:0.8},
      {title:'70%',object:self,selector:'changeOpacityTo:',param:0.7},
      {title:'60%',object:self,selector:'changeOpacityTo:',param:0.6},
      {title:'50%',object:self,selector:'changeOpacityTo:',param:0.5}   // 半透明
    ];
    menuController.rowHeight = 35;  // 每行高度
    // 设置菜单大小
    menuController.preferredContentSize = {
      width: 100,
      height: menuController.rowHeight * menuController.commandTable.length
    };
    
    // 在 studyView 中显示弹出菜单
    var studyView = MNUtil.studyView  // 获取学习视图（MarginNote 的主视图）
    self.popoverController = new UIPopoverController(menuController);
    // 将按钮坐标转换到 studyView 坐标系
    var r = sender.convertRectToView(sender.bounds,studyView);
    // presentPopoverFromRect: 显示弹出菜单，1 << 1 表示箭头向下
    self.popoverController.presentPopoverFromRect(r, studyView, 1 << 1, true);
  },
  changeOpacityTo:function (opacity) {
    self.view.layer.opacity = opacity
    // self.webAppButton.setTitleForState(`${opacity*100}%`, 0);
  },
  changeScreen: function(sender) {
    let self = getToolbarController()
    let clickDate = Date.now()
    // if (self.dynamicWindow) {
    //   return
    // }
    self.checkPopover()
    let selector = "toggleToolbarDirection:"
    // if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
    var commandTable = [
      self.tableItem('⚙️  Setting', 'setting:')
    ];
    if (self.dynamicWindow) {
      if (pluginDemoConfig.vertical(true)) {
        commandTable.unshift(self.tableItem('🌟  Direction   ↕️', selector,"dynamic"))
      }else{
        commandTable.unshift(self.tableItem('🌟  Direction   ↔️', selector,"dynamic"))
      }
    }else{
      if (pluginDemoConfig.vertical()) {
        commandTable.unshift(self.tableItem('🛠️  Direction   ↕️', selector,"fixed"))
      }else{
        commandTable.unshift(self.tableItem('🛠️  Direction   ↔️', selector,"fixed"))
      }
    }
    commandTable.push()
    self.popoverController = MNUtil.getPopoverAndPresent(sender, commandTable,200)
  },
  toggleToolbarDirection: function (source) {
    self.checkPopover()
    pluginDemoConfig.toggleToolbarDirection(source)
  },
  toggleDynamic: function () {
try {
  

    // MNUtil.showHUD("message")
    self.onClick = true
    self.checkPopover()
    // if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
    // MNUtil.postNotification('toggleDynamic', {test:123})
    if (typeof MNUtil === 'undefined') return
    pluginDemoConfig.dynamic = !pluginDemoConfig.dynamic
    if (pluginDemoConfig.dynamic) {
      MNUtil.showHUD("Dynamic ✅")
    }else{
      MNUtil.showHUD("Dynamic ❌")
      if (self.dynamicToolbar) {
        self.dynamicToolbar.view.hidden = true
      }
      // self.testController.view.hidden = true
    }
    pluginDemoConfig.save("MNToolbar_dynamic")
    // NSUserDefaults.standardUserDefaults().setObjectForKey(pluginDemoConfig.dynamic,"MNToolbar_dynamic")
    if (self.dynamicToolbar) {
      self.dynamicToolbar.dynamic = pluginDemoConfig.dynamic
    }
    MNUtil.refreshAddonCommands()
} catch (error) {
  MNUtil.showHUD(error)
}
  },
  /**
   * 
   * @param {UIButton} button 
   */
  setColor: async function (button) {
    let self = getToolbarController()
    // let tem = {
    // }
    // let note = MNNote.getFocusNote()
    // if (note) {
    //   tem.noteid = note.noteId
    //   tem.origin = note.originNoteId
    // }
    // MNUtil.copy(tem)
    // return
    let actionName = "color"+button.color
    let delay = false
    let des = pluginDemoConfig.getDescriptionByName(actionName)
    if ("doubleClick" in des) {
      delay = true
      self.onClick = true
      button.delay = true //让菜单延迟关闭,保证双击可以被执行
      self.onClick = true
      if (button.menu) {
        button.menu.stopHide = true
      }
      if (button.doubleClick) {
        button.doubleClick = false
        let doubleClick = des.doubleClick
        if (!("action" in doubleClick)) {
          doubleClick.action = des.action
        }
        self.customActionByDes(button, doubleClick)
        return
      }
    }
    des.color = button.color
    des.action = "setColor"
    MNUtil.delay(0.1).then(async ()=>{
      await self.customActionByDes(button, des, false)
    })
    if (button.menu) {
      button.menu.dismissAnimated(true)
      return
    }
    if (!self.dynamicWindow) {
      return
    }
    if (delay) {
      self.hideAfterDelay()
    }else{
      self.hide()
    }
  },
  execute: async function (button) {
    MNUtil.showHUD("Action disabled")
  },
  /**
   * @param {UIButton} button 
   * @returns 
   */
  customAction: async function (button) {
    let self = getToolbarController()
    // eval("MNUtil.showHUD('123')")
    // return
    let dynamicOrder = pluginDemoConfig.getWindowState("dynamicOrder")
    let useDynamic = dynamicOrder && self.dynamicWindow
    let actionName = button.target ?? (useDynamic?pluginDemoConfig.dynamicAction[button.index]:pluginDemoConfig.action[button.index])//这个是key
    let des = pluginDemoConfig.getDescriptionByName(actionName)
    if ("doubleClick" in des) {
      button.delay = true //让菜单延迟关闭,保证双击可以被执行
      self.onClick = true
      if (button.menu) {
        button.menu.stopHide = true
      }
      if (button.doubleClick) {
        button.doubleClick = false
        let doubleClick = des.doubleClick
        if (!("action" in doubleClick)) {
          doubleClick.action = des.action
        }
        self.customActionByDes(button, doubleClick)
        return
      }
    }
    self.customActionByDes(button,des)
  },
  customActionByMenu: async function (param) {
    let des = param.des
    if (typeof des === "string" || !("action" in des)) {
      return
    }
    let button = param.button
    if (des.action === "menu") {
      self.onClick = true
      self.checkPopover()
      if (("autoClose" in des) && des.autoClose) {
        self.hideAfterDelay(0.1)
      }
      let menuItems = des.menuItems
      let width = des.menuWidth??200
      if (menuItems.length) {
        var commandTable = menuItems.map(item=>{
          let title = (typeof item === "string")?item:(item.menuTitle ?? item.action)
          return {title:title,object:self,selector:'customActionByMenu:',param:{des:item,button:button}}
        })
        commandTable.unshift({title:pluginDemoUtils.emojiNumber(self.commandTables.length)+" 🔙",object:self,selector:'lastPopover:',param:button})
        self.commandTables.push(commandTable)
        self.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,4)
      }
      return
    }
    if (!("autoClose" in des) || des.autoClose) {
      self.checkPopover()
      self.hideAfterDelay(0.1)
    }else{
      self.checkPopover()
    }
    // MNUtil.copyJSON(des)
    // return
    self.commandTables = []
    self.customActionByDes(button,des)
  },
lastPopover: function (button) {
      self.checkPopover()
      self.commandTables.pop()
      let commandTable = self.commandTables.at(-1)
      self.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,200,4)
},
  imagePickerControllerDidFinishPickingMediaWithInfo:async function (UIImagePickerController,info) {
    try {
      
    let image = info.UIImagePickerControllerOriginalImage
    // MNUtil.copy(image.pngData().base64Encoding())
    // MNUtil.copyJSON(info)
    MNUtil.studyController.dismissViewControllerAnimatedCompletion(true,undefined)
    if (self.compression) {
      MNUtil.copyImage(image.jpegData(0.0))
    }else{
      MNUtil.copyImage(image.pngData())
    }
    await MNUtil.delay(0.1)
    MNNote.new(self.currentNoteId).paste()
    // MNNote.getFocusNote().paste()
    } catch (error) {
      MNUtil.showHUD(error)
    }
  },
  imagePickerControllerDidCancel:function (params) {
    // MNUtil.copy("text")
    MNUtil.studyController.dismissViewControllerAnimatedCompletion(true,undefined)
    
  },
  timer: function (button) {
    self.onClick = true
    let des = pluginDemoConfig.getDescriptionByName("timer")
    des.action = "setTimer"
    self.customActionByDes(button,des,false)
  },
  undo: function (button) {
    if (UndoManager.sharedInstance().canUndo()) {
      UndoManager.sharedInstance().undo()
      MNUtil.app.refreshAfterDBChanged(MNUtil.currentNotebookId)
    }else{
      MNUtil.showHUD("No Change to Undo")
    }
  },
  redo: function (button) {
    if (UndoManager.sharedInstance().canRedo()) {
      UndoManager.sharedInstance().redo()
      MNUtil.app.refreshAfterDBChanged(MNUtil.currentNotebookId)
    }else{
      MNUtil.showHUD("No Change to Redo")
    }
  },
  copy:function (button) {
    let self = getToolbarController()
    self.onClick = true
    let des = pluginDemoConfig.getDescriptionByName("copy")
    if (button.doubleClick) {
      // self.onClick = true
      button.doubleClick = false
      if (button.menu) {
        button.menu.stopHide = true
      }
      if ("doubleClick" in des) {
        let doubleClick = des.doubleClick
        doubleClick.action = "copy"
        self.customActionByDes(button, doubleClick, false)
        return
      }
      let focusNote = MNNote.getFocusNote()
      if (focusNote) {
        let text = focusNote.noteTitle
        if (text) {
          MNUtil.copy(text)
          MNUtil.showHUD('标题已复制')
        }else{
          MNUtil.showHUD('无标题')
        }
        button.doubleClick = false
      }else{
        MNUtil.showHUD('无选中卡片')
      }
      self.onClick = false
      if (button.menu) {
        button.menu.dismissAnimated(true)
      }
      self.hideAfterDelay()
      return
    }
    if (des && Object.keys(des).length) {
      des.action = "copy"
      button.delay = true
      self.customActionByDes(button, des, false)
      if (self.dynamicWindow) {
        self.hideAfterDelay()
      }
      return
    }
    pluginDemoUtils.smartCopy()
    self.hideAfterDelay()
    pluginDemoUtils.dismissPopupMenu(button.menu,self.onClick)
  },
  copyAsMarkdownLink(button) {
    MNUtil.currentWindow.becomeFirstResponder()
    self.onClick = true
try {

    const nodes = MNNote.getFocusNotes()

    let text = ""
    if (button.doubleClick) {
      button.doubleClick = false
      for (const note of nodes) {
        text = text+note.noteURL+'\n'
      }
      MNUtil.showHUD("链接已复制")

    }else{
      for (const note of nodes) {
        let noteTitle = note.noteTitle??"noTitle"
        text = text+'['+noteTitle+']('+note.noteURL+')'+'\n'
      }
      MNUtil.showHUD("Markdown链接已复制")
    }
    MNUtil.copy(text.trim())
} catch (error) {
  MNUtil.showHUD(error)
}
  if (button.menu) {
    button.menu.dismissAnimated(true)
    return
  }
    self.hideAfterDelay()
  },

  searchInEudic:async function (button) {
  try {
    self.onClick = true
    let des = pluginDemoConfig.getDescriptionByName("searchInEudic")
    des.action = "searchInDict"
    await self.customActionByDes(button, des, false)
    // let target = des.target ?? "eudic"
    // let textSelected = MNUtil.selectionText
    // if (!textSelected) {
    //   let focusNote = MNNote.getFocusNote()
    //   if (focusNote) {
    //     if (focusNote.excerptText) {
    //       textSelected = focusNote.excerptText
    //     }else if (focusNote.noteTitle) {
    //       textSelected = focusNote.noteTitle
    //     }else{
    //       let firstComment = focusNote.comments.filter(comment=>comment.type === "TextNote")[0]
    //       if (firstComment) {
    //         textSelected = firstComment.text
    //       }
    //     }
    //   }
    // }
    // if (textSelected) {
    //   if (target === "eudic") {
    //     let textEncoded = encodeURIComponent(textSelected)
    //     let url = "eudic://dict/"+textEncoded
    //     MNUtil.openURL(url)
    //   }else{
    //     let studyFrame = MNUtil.studyView.bounds
    //     let beginFrame = self.view.frame
    //     if (button.menu) {
    //       button.menu.dismissAnimated(true)
    //       let beginFrame = button.convertRectToView(button.bounds,MNUtil.studyView)
    //       let endFrame = pluginDemoFrame.gen(beginFrame.x-225, beginFrame.y-50, 500, 500)
    //       endFrame.y = MNUtil.constrain(endFrame.y, 0, studyFrame.height-500)
    //       endFrame.x = MNUtil.constrain(endFrame.x, 0, studyFrame.width-500)
    //       MNUtil.postNotification("lookupText"+target,{text:textSelected,beginFrame:beginFrame,endFrame:endFrame})
    //       return
    //     }
    //     let endFrame
    //     beginFrame.y = beginFrame.y-10
    //     if (beginFrame.x+490 > studyFrame.width) {
    //       endFrame = pluginDemoFrame.gen(beginFrame.x-450, beginFrame.y-10, 500, 500)
    //       if (beginFrame.y+490 > studyFrame.height) {
    //         endFrame.y = studyFrame.height-500
    //       }
    //       if (endFrame.x < 0) {
    //         endFrame.x = 0
    //       }
    //       if (endFrame.y < 0) {
    //         endFrame.y = 0
    //       }
    //     }else{
    //       endFrame = pluginDemoFrame.gen(beginFrame.x+40, beginFrame.y-10, 500, 500)
    //       if (beginFrame.y+490 > studyFrame.height) {
    //         endFrame.y = studyFrame.height-500
    //       }
    //       if (endFrame.x < 0) {
    //         endFrame.x = 0
    //       }
    //       if (endFrame.y < 0) {
    //         endFrame.y = 0
    //       }
    //     }
    //     MNUtil.postNotification("lookupText"+target, {text:textSelected,beginFrame:beginFrame,endFrame:endFrame})
    //   }


    //   // let des = pluginDemoConfig.getDescriptionByName("searchInEudic")
    //   // if (des && des.source) {
    //   //   // MNUtil.copyJSON(des)
    //   //   switch (des.source) {
    //   //     case "eudic":
    //   //       //donothing
    //   //       break;
    //   //     case "yddict":
    //   //       MNUtil.copy(textSelected)
    //   //       url = "yddict://"
    //   //       break;
    //   //     case "iciba":
    //   //       url = "iciba://word="+textEncoded
    //   //       break;
    //   //     case "sogodict":
    //   //       url = "bingdict://"+textEncoded
    //   //       break;
    //   //     case "bingdict":
    //   //       url = "sogodict://"+textEncoded
    //   //       break;
    //   //     default:
    //   //       MNUtil.showHUD("Invalid source")
    //   //       return
    //   //   }
    //   // }
    //   // showHUD(url)
    // }else{
    //   MNUtil.showHUD('未找到有效文字')
    // }
    // if (button.menu) {
    //   button.menu.dismissAnimated(true)
    //   return
    // }
    self.hideAfterDelay()
    
  } catch (error) {
    pluginDemoUtils.addErrorLog(error, "searchInEudic")
  }
  },
  switchTitleorExcerpt(button) {
    self.onClick = true
    pluginDemoUtils.switchTitleOrExcerpt()
    if (button.menu) {
      button.menu.dismissAnimated(true)
      return
    }
    self.hideAfterDelay()
  },
  bigbang: function (button) {
    self.onClick = true
    let focusNote = MNNote.getFocusNote()
    MNUtil.postNotification("bigbangNote",{noteid:focusNote.noteId})
    if (button.menu) {
      button.menu.dismissAnimated(true)
      return
    }
    self.hideAfterDelay()
  },
  snipaste: function (button) {
    self.onClick = true
    let selection = MNUtil.currentSelection
    if (selection.onSelection && !selection.isText) {
      let imageData = selection.image
      MNUtil.postNotification("snipasteImage", {imageData:imageData})
    }else{
      let focusNote = MNNote.getFocusNote()
      MNUtil.postNotification("snipasteNote",{noteid:focusNote.noteId})
    }
    if (button.menu) {
      button.menu.dismissAnimated(true)
      return
    }
    self.hideAfterDelay()
  },
  chatglm: function (button) {
    let des = pluginDemoConfig.getDescriptionByName("chatglm")
    if (des) {
      des.action = "chatAI"
      self.customActionByDes(button, des,false)
    }else{
      MNUtil.postNotification("customChat",{})
    }
    // pluginDemoUtils.chatAI(des)
    if (button.menu && !self.onClick) {
      button.menu.dismissAnimated(true)
      return
    }
    self.hideAfterDelay()
  },
  search: function (button) {
    let self = getToolbarController()
    let des = pluginDemoConfig.getDescriptionByName("search")
    if (des) {
      des.action = "search"
      self.customActionByDes(button, des,false)
      return
    }else{
      // MNUtil.postNotification("customChat",{})
    }
    self.onClick = true
    let selectionText = MNUtil.selectionText
    let noteId = undefined
    let foucsNote = MNNote.getFocusNote()
    if (foucsNote) {
      noteId = foucsNote.noteId
    }
    let studyFrame = MNUtil.studyView.bounds
    let beginFrame = self.view.frame
    if (button.menu) {
      button.menu.dismissAnimated(true)
      let beginFrame = button.convertRectToView(button.bounds,MNUtil.studyView)
      let endFrame = pluginDemoFrame.gen(beginFrame.x-225, beginFrame.y-50, 450, 500)
      endFrame.y = MNUtil.constrain(endFrame.y, 0, studyFrame.height-500)
      endFrame.x = MNUtil.constrain(endFrame.x, 0, studyFrame.width-500)
      if (selectionText) {
        // MNUtil.showHUD("Text:"+selectionText)
        MNUtil.postNotification("searchInBrowser",{text:selectionText,beginFrame:beginFrame,endFrame:endFrame})
      }else{
        // MNUtil.showHUD("NoteId:"+noteId)
        MNUtil.postNotification("searchInBrowser",{noteid:noteId,beginFrame:beginFrame,endFrame:endFrame})
      }
      return
    }
    let endFrame
    beginFrame.y = beginFrame.y-10
    if (beginFrame.x+490 > studyFrame.width) {
      endFrame = pluginDemoFrame.gen(beginFrame.x-450, beginFrame.y-10, 450, 500)
      if (beginFrame.y+490 > studyFrame.height) {
        endFrame.y = studyFrame.height-500
      }
    }else{
      endFrame = pluginDemoFrame.gen(beginFrame.x+40, beginFrame.y-10, 450, 500)
      if (beginFrame.y+490 > studyFrame.height) {
        endFrame.y = studyFrame.height-500
      }
    }
    if (selectionText) {
      // MNUtil.showHUD("Text:"+selectionText)
      MNUtil.postNotification("searchInBrowser",{text:selectionText,beginFrame:beginFrame,endFrame:endFrame})
    }else{
      // MNUtil.showHUD("NoteId:"+noteId)
      MNUtil.postNotification("searchInBrowser",{noteid:noteId,beginFrame:beginFrame,endFrame:endFrame})
    }
    if (button.menu) {
      button.menu.dismissAnimated(true)
      return
    }
    self.hideAfterDelay()
  },
  sidebar: async function (button) {
    if (button.menu) {
      button.menu.dismissAnimated(true)
    }
    let des = pluginDemoConfig.getDescriptionByName("sidebar")
    des.action = "toggleSidebar"
    pluginDemoUtils.toggleSidebar(des)
  },
  /**
   * 
   * @param {UIButton} button 
   * @returns 
   */
  edit: function (button) {
    let noteId = undefined
    if (self.dynamicWindow && pluginDemoUtils.currentNoteId) {
      noteId = pluginDemoUtils.currentNoteId
    }else{
      let foucsNote = MNNote.getFocusNote()
      if (foucsNote) {
        noteId = foucsNote.noteId
      }
    }
    if (!noteId && MNUtil.currentSelection.onSelection) {
      noteId = MNNote.fromSelection().realGroupNoteForTopicId().noteId
    }
    if (!noteId) {
      MNUtil.showHUD("No note")
      return
    }
    let studyFrame = MNUtil.studyView.bounds
    if (button.menu) {
      button.menu.dismissAnimated(true)
      let beginFrame = button.convertRectToView(button.bounds,MNUtil.studyView)
      let endFrame = pluginDemoFrame.gen(beginFrame.x-225, beginFrame.y-50, 450, 500)
      endFrame.y = pluginDemoUtils.constrain(endFrame.y, 0, studyFrame.height-500)
      endFrame.x = pluginDemoUtils.constrain(endFrame.x, 0, studyFrame.width-500)
      MNUtil.postNotification("openInEditor",{noteId:noteId,beginFrame:beginFrame,endFrame:endFrame})
      return
    }
    let beginFrame = self.view.frame
    beginFrame.y = beginFrame.y-10
    if (beginFrame.x+490 > studyFrame.width) {
      let endFrame = pluginDemoFrame.gen(beginFrame.x-450, beginFrame.y-10, 450, 500)
      if (beginFrame.y+490 > studyFrame.height) {
        endFrame.y = studyFrame.height-500
      }
      MNUtil.postNotification("openInEditor",{noteId:noteId,beginFrame:beginFrame,endFrame:endFrame})
    }else{
      let endFrame = pluginDemoFrame.gen(beginFrame.x+40, beginFrame.y-10, 450, 500)
      if (beginFrame.y+490 > studyFrame.height) {
        endFrame.y = studyFrame.height-500
      }
      MNUtil.postNotification("openInEditor",{noteId:noteId,beginFrame:beginFrame,endFrame:endFrame})
    }
    self.hideAfterDelay()
  },
  ocr: async function (button) {
    // if (typeof ocrUtils === 'undefined') {
    //   MNUtil.showHUD("MN Toolbar: Please install 'MN OCR' first!")
    //   return
    // }
    let des = pluginDemoConfig.getDescriptionByName("ocr")
    des.action = "ocr"

    // await pluginDemoUtils.ocr(des)
    self.customActionByDes(button, des,false)
    // if ("onFinish" in des) {
    //   let finishAction = des.onFinish
    //   await MNUtil.delay(0.5)
    // }
    if (button.menu) {
      button.menu.dismissAnimated(true)
      return
    }
    self.hideAfterDelay()
  },
  setting: function (button) {
    self.checkPopover()
    MNUtil.postNotification("openToolbarSetting", {})
    if (button.menu) {
      button.menu.dismissAnimated(true)
      return
    }
    self.hideAfterDelay()
  },
  pasteAsTitle:function (button) {
    let self = getToolbarController()
    let des = pluginDemoConfig.getDescriptionByName("pasteAsTitle")
    if (des && "doubleClick" in des) {
      self.onClick = true
    }
    if (button.doubleClick) {
      // self.onClick = true
      button.doubleClick = false
      if (button.menu) {
        button.menu.stopHide = true
      }
      if ("doubleClick" in des) {
        let doubleClick = des.doubleClick
        doubleClick.action = "paste"
        self.customActionByDes(button, doubleClick, false)
      }
      return
    }
    if (des && des.target && Object.keys(des).length) {
      des.action = "paste"
      button.delay = true
      self.customActionByDes(button, des, false)
      if (self.dynamicWindow) {
        MNUtil.showHUD("hide")
        self.hideAfterDelay()
      }
      return
    }
    let focusNote = MNNote.getFocusNote()
    let text = MNUtil.clipboardText
    MNUtil.undoGrouping(()=>{
      focusNote.noteTitle = text
    })
    self.hideAfterDelay()
    pluginDemoUtils.dismissPopupMenu(button.menu,self.onClick)
  },
  clearFormat:function (button) {
    let self = getToolbarController()
    self.onClick = true
    let focusNotes = MNNote.getFocusNotes()
    MNUtil.undoGrouping(()=>{
      focusNotes.map(note=>{
        note.clearFormat()
      })
    })
    // let focusNote = MNNote.getFocusNote()
    // MNUtil.undoGrouping(()=>{
    //   focusNote.clearFormat()
    // })
    if (button.menu) {
      button.menu.dismissAnimated(true)
      return
    }
    self.hideAfterDelay()
  },
  doubleClick:function (button) {
    button.doubleClick = true
  },
  /**
   * 👋 拖动手势处理器 - 实现工具栏的自由移动
   * 
   * 【手势状态说明】
   * iOS/macOS 手势有 6 个状态，其中主要使用：
   * - state === 1：开始 (UIGestureRecognizerStateBegan)
   * - state === 2：移动中 (UIGestureRecognizerStateChanged)
   * - state === 3：结束 (UIGestureRecognizerStateEnded)
   * 
   * 【功能特性】
   * 1. ✂️ 边缘吸附：拖动到边缘 20 像素内自动吸附
   * 2. 🗒️ 分屏适配：自动吸附到文档/脑图分割线
   * 3. 📏 位置记忆：自动保存位置，下次启动恢复
   * 4. 🚀 动态窗口：动态模式下拖动会自动隐藏
   * 
   * @param {UIPanGestureRecognizer} gesture - 拖动手势识别器
   */
  onMoveGesture:function (gesture) {
  try {
    let self = getToolbarController()
    
    // 🌟 动态窗口特殊处理
    if (self.dynamicWindow) {
      // 动态窗口移动后自动隐藏，避免遮挡内容
      self.hide()
      return
    }
    
    self.onAnimate = false  // 关闭动画标记
    self.onClick = true     // 设置点击标记（防止误触）
    
    // ========== 🎬 手势开始：记录初始位置 ==========
    if (gesture.state === 1) {
      // 记录手指按下的位置（在学习视图坐标系中）
      self.initLocation = gesture.locationInView(MNUtil.studyView)
      // 记录工具栏当前的 frame
      self.initFrame = self.view.frame
      return
    }
    
    // ========== ✅ 手势结束：保存位置 ==========
    if (gesture.state === 3) {
      // 将工具栏置于最上层（避免被其他视图遮挡）
      MNUtil.studyView.bringSubviewToFront(self.view)
      
      // 💾 保存工具栏状态
      pluginDemoConfig.windowState.open = true
      pluginDemoConfig.windowState.frame.x = self.view.frame.x
      pluginDemoConfig.windowState.frame.y = self.view.frame.y
      pluginDemoConfig.windowState.splitMode = self.splitMode
      pluginDemoConfig.windowState.sideMode = self.sideMode
      pluginDemoConfig.save("MNToolbar_windowState")
      
      // 重新布局工具栏
      self.setToolbarLayout()
      return
    }
    
    // ========== 🏃 手势移动中：计算新位置 ==========
    if (gesture.state === 2) {
      let studyFrame = MNUtil.studyView.bounds
      let locationInView = gesture.locationInView(MNUtil.studyView)
      
      // 📏 计算移动后的位置
      // 公式：新位置 = 原始位置 + (当前手指位置 - 初始手指位置)
      let y = MNUtil.constrain(
        self.initFrame.y + locationInView.y - self.initLocation.y, 
        0,                        // 最小值：顶部
        studyFrame.height - 15    // 最大值：底部留 15 像素
      )
      let x = self.initFrame.x + locationInView.x - self.initLocation.x
      
      self.sideMode = ""  // 重置侧边模式
      
      // 📐 竖向工具栏的特殊处理
      if (pluginDemoConfig.vertical()) {
        let splitLine = MNUtil.splitLine  // 获取文档/脑图分割线位置
        let docMapSplitMode = MNUtil.studyController.docMapSplitMode
        
        // ✂️ 左边缘吸附
        if (x < 20) {  // 距离左边小于 20 像素
          x = 0
          self.sideMode = "left"
          self.splitMode = false
        }
        
        // ✂️ 右边缘吸附
        if (x > studyFrame.width - 60) {  // 距离右边小于 60 像素
          x = studyFrame.width - 40
          self.sideMode = "right"
          self.splitMode = false
        }
        
        // 🗒️ 分割线吸附（只在分屏模式下生效）
        if (splitLine && docMapSplitMode === 1) {
          // 如果工具栏中心距离分割线小于 20 像素
          if (x < splitLine && x > splitLine - 40) {
            x = splitLine - 20  // 吸附到分割线上
            self.splitMode = true
            self.sideMode = ""
          } else {
            self.splitMode = false
          }
        } else {
          self.splitMode = false
        }
      } else {
        // 🔄 横向工具栏不支持分屏吸附
        self.splitMode = false
      }
      
      // 📐 更新工具栏 frame
      let height = 45 * self.buttonNumber + 15  // 计算高度
      self.setFrame(MNUtil.genFrame(
        x, y, 40, 
        pluginDemoUtils.checkHeight(height, self.maxButtonNumber)
      ))
      
      self.custom = false;
    }
  } catch (error) {
    pluginDemoUtils.addErrorLog(error, "onMoveGesture")
  }
  },
  /**
   * 👆 长按手势处理器 - 为按钮添加更多功能
   * 
   * 【长按交互设计】
   * 每个按钮都可以配置长按动作，实现：
   * - 单击：执行主要功能
   * - 长按：执行次要功能或显示更多选项
   * 
   * 【常见用法】
   * - 复制按钮：单击复制摘录，长按复制标题
   * - 颜色按钮：单击设置颜色，长按显示颜色选择器
   * - 自定义按钮：单击执行动作，长按显示菜单
   * 
   * @param {UILongPressGestureRecognizer} gesture - 长按手势识别器
   */
  onLongPressGesture:async function (gesture) {
    // 🎬 只处理手势开始状态
    if (gesture.state === 1) {  // UIGestureRecognizerStateBegan
      let button = gesture.view  // 获取被长按的按钮
      
      // 🔍 查找按钮对应的动作名称
      let actionName = button.target ?? (
        self.dynamicWindow 
          ? pluginDemoConfig.dynamicAction[button.index] 
          : pluginDemoConfig.action[button.index]
      )
      
      if (actionName) {
        // 📝 获取动作配置
        let des = pluginDemoConfig.getDescriptionByName(actionName)
        
        // ✅ 检查是否有长按配置
        if ("onLongPress" in des) {
          let onLongPress = des.onLongPress
          
          // 🔧 如果长按配置没有指定 action，使用主 action
          if (!("action" in onLongPress)) {
            onLongPress.action = des.action
          }
          
          // 🚀 执行长按动作
          await self.customActionByDes(button, onLongPress)
          return
        } else {
          // ❌ 没有配置长按动作
          MNUtil.showHUD("No long press action")
        }
      }
    }
    
    // ========== 📦 备用代码：长按移动模式 ==========
    /**
     * 【备用功能说明】
     * 这段被注释的代码实现了另一种交互方式：
     * 1. 长按屏幕按钮进入移动模式
     * 2. 在移动模式下拖动整个工具栏
     * 3. 松开退出移动模式
     * 
     * 这种设计适合：
     * - 需要区分普通拖动和精确定位的场景
     * - 避免误触移动操作
     * - 提供视觉反馈（改变按钮颜色）
     */
    // if (gesture.state === 1) {//触发
    //   self.initLocation = gesture.locationInView(MNUtil.studyView)
    //   self.initFrame = self.view.frame
    //   MNUtil.showHUD("Move mode ✅")  // 提示进入移动模式
    //   MNButton.setColor(self.screenButton, "#9898ff",1.0)  // 改变按钮颜色
    //   // self.view.layer.backgroundColor = MNUtil.hexColorAlpha("#b5b5f5",1.0)
    //   // self.view.layer.borderWidth = 2
    //   return
    // }
    // if (gesture.state === 3) {//停止
    //   MNUtil.showHUD("Move mode ❌")  // 提示退出移动模式
    //   MNButton.setColor(self.screenButton, "#9bb2d6",0.8)  // 恢复按钮颜色
    //   return
    // }
    // if (gesture.state === 2) {
    //   // 移动逻辑与 onMoveGesture 类似
    //   let studyFrame = MNUtil.studyView.bounds
    //   let locationInView = gesture.locationInView(MNUtil.studyView)
    //   let y = MNUtil.constrain(self.initFrame.y+locationInView.y - self.initLocation.y, 0, studyFrame.height-15)
    //   let x = self.initFrame.x+locationInView.x - self.initLocation.x
    //   let splitLine = MNUtil.splitLine
    //   let docMapSplitMode = MNUtil.studyController.docMapSplitMode
    //   
    //   // 边缘吸附逻辑...
    //   if (x<20) {
    //     x = 0
    //     self.sideMode = "left"
    //     self.splitMode = false
    //   }
    //   if (x>studyFrame.width-60) {
    //     x = studyFrame.width-40
    //     self.sideMode = "right"
    //     self.splitMode = false
    //   }
    //   
    //   // 分屏吸附逻辑...
    //   if (splitLine && docMapSplitMode===1) {
    //     if (x<splitLine && x>splitLine-40) {
    //       x = splitLine-20
    //       self.splitMode = true
    //       self.sideMode = ""
    //     }else{
    //       self.splitMode = false
    //     }
    //   }else{
    //     self.splitMode = false
    //   }
    //   
    //   // 更新 frame
    //   let frame = {x:x,y:y,width:self.initFrame.width,height:self.initFrame.height}
    //   pluginDemoFrame.set(self.view,frame.x,frame.y,frame.width,frame.height)
    // }
    // MNUtil.showHUD("message"+gesture.state)  // 调试：显示手势状态

  },
  /**
   * 👆 滑动手势处理器（未完全实现）
   * 
   * 【潜在用途】
   * - 快速切换工具栏方向
   * - 快速显示/隐藏工具栏
   * - 切换上一个/下一个卡片
   * 
   * @param {UISwipeGestureRecognizer} gesture - 滑动手势识别器
   */
  onSwipeGesture:function (gesture) {
    if (gesture.state === 1) {
      MNUtil.showHUD("Swipe mode ✅")  // 仅显示提示，未实现实际功能
    }
    // MNUtil.showHUD("message"+gesture.state)  // 调试代码
  },
  /**
   * 📏 调整大小手势处理器 - 动态改变工具栏尺寸
   * 
   * 【交互设计】
   * 通过拖动屏幕按钮（screenButton）来调整工具栏大小：
   * - 横向工具栏：拖动改变宽度（增减按钮数量）
   * - 纵向工具栏：拖动改变高度（增减按钮数量）
   * 
   * 【计算公式】
   * ```
   * 新大小 = 手指位置 + 按钮位置 + 按钮大小/2
   * ```
   * 这样可以确保拖动感觉自然，不会跳跃
   * 
   * @param {UIPanGestureRecognizer} gesture - 拖动手势识别器
   */
  onResizeGesture:function (gesture) {
    let self = getToolbarController()
    try {
      self.onClick = true     // 设置点击标记
      self.custom = false     // 重置自定义模式
      self.onResize = true    // 标记正在调整大小
      
      // 📐 获取基础数据
      let baseframe = gesture.view.frame           // 屏幕按钮的 frame
      let locationInView = gesture.locationInView(gesture.view)  // 手指在按钮内的位置
      let frame = self.view.frame                  // 工具栏当前 frame
      
      // 📏 计算新的大小
      // 为什么加 0.5 倍？让拖动中心在按钮中间，体验更好
      let height = locationInView.y + baseframe.y + baseframe.height * 0.5
      let width = locationInView.x + baseframe.x + baseframe.width * 0.5
      
      // 🎬 实时更新工具栏大小
      self.setFrame(MNUtil.genFrame(frame.x, frame.y, width, height))
      
      // ========== ✅ 手势结束：保存新尺寸 ==========
      if (gesture.state === 3) {  // UIGestureRecognizerStateEnded
        // 确保屏幕按钮在最上层（不被其他按钮遮挡）
        self.view.bringSubviewToFront(self.screenButton)
        
        // 💾 保存状态
        let windowState = pluginDemoConfig.windowState
        
        if (self.dynamicWindow) {
          // 🌟 动态窗口：保存按钮数量后隐藏
          windowState.dynamicButton = self.buttonNumber
          self.hide()
        } else {
          // 📌 固定窗口：保存完整 frame
          windowState.frame = self.view.frame
          windowState.open = true
        }
        
        // 持久化配置
        pluginDemoConfig.save("MNToolbar_windowState", windowState)
        self.onResize = false  // 重置调整标记
      }
    } catch (error) {
      pluginDemoUtils.addErrorLog(error, "onResizeGesture")
    }
  },
});

// ==================== 🔧 工具方法扩展 ====================

/**
 * 🎨 设置按钮基础布局 - 统一按钮外观
 * 
 * 【作用】
 * 为所有系统按钮（屏幕按钮、最大化按钮等）设置统一的外观样式
 * 
 * 【样式特点】
 * - 背景色：#9bb2d6（淡蓝色），80% 透明度
 * - 文字颜色：白色（正常），高亮色（按下）
 * - 圆角：5 像素
 * - 自动布局：随父视图调整
 * 
 * @param {UIButton} button - 要设置样式的按钮
 * @param {string} targetAction - 点击事件的方法名（如 "changeScreen:"）
 */
pluginDemoController.prototype.setButtonLayout = function (button, targetAction) {
    // 📦 自动布局遮罩
    // 1 << 0: UIViewAutoresizingFlexibleWidth (宽度自适应)
    // 1 << 3: UIViewAutoresizingFlexibleHeight (高度自适应)
    button.autoresizingMask = (1 << 0 | 1 << 3);
    
    // 🎨 设置文字颜色
    button.setTitleColorForState(UIColor.whiteColor(), 0);              // 正常状态：白色
    button.setTitleColorForState(pluginDemoConfig.highlightColor, 1);   // 高亮状态：主题色
    
    // 🎭 设置背景样式
    button.backgroundColor = UIColor.colorWithHexString("#9bb2d6").colorWithAlphaComponent(0.8);
    button.layer.cornerRadius = 5;          // 圆角半径
    button.layer.masksToBounds = true;      // 裁剪超出圆角的内容
    
    // 👆 绑定点击事件
    if (targetAction) {
      // 1 << 6: UIControlEventTouchUpInside (手指抬起时触发)
      button.addTargetActionForControlEvents(this, targetAction, 1 << 6);
    }
    
    // ➕ 添加到工具栏视图
    this.view.addSubview(button);
}

/**
 * 🎨 设置颜色按钮/功能按钮的布局 - 定制按钮外观
 * 
 * 【与 setButtonLayout 的区别】
 * - setButtonLayout：用于系统按钮，淡蓝色背景，白色文字
 * - setColorButtonLayout：用于功能按钮，可自定义背景色，黑色图标
 * 
 * 【特殊功能】
 * 1. 支持双击检测（UIControlEventTouchDownRepeat）
 * 2. 圆角更大（10 像素），更加圆润
 * 3. 同一个 targetAction 会先移除再添加，避免重复绑定
 * 
 * 【事件触发时机】
 * ```
 * 用户按下 → 用户抬起 → 触发 targetAction
 *    ↓
 * 如果快速点击两次 → 触发 doubleClick:
 * ```
 * 
 * @param {UIButton} button - 要设置样式的按钮
 * @param {string} targetAction - 主要动作的方法名（如 "customAction:"）
 * @param {UIColor} color - 按钮背景色（通常根据按钮功能设置）
 */
pluginDemoController.prototype.setColorButtonLayout = function (button, targetAction, color) {
    // 📦 自动布局（与 setButtonLayout 相同）
    button.autoresizingMask = (1 << 0 | 1 << 3);
    
    // 🎨 文字/图标颜色
    button.setTitleColorForState(UIColor.blackColor(), 0);              // 正常状态：黑色
    button.setTitleColorForState(pluginDemoConfig.highlightColor, 1);   // 高亮状态：主题色
    
    // 🎭 背景样式
    button.backgroundColor = color          // 使用传入的颜色
    button.layer.cornerRadius = 10;         // 更大的圆角（更圆润）
    button.layer.masksToBounds = true;      // 裁剪超出部分
    
    // 👆 事件绑定
    if (targetAction) {
      // 事件类型说明：
      // 1：UIControlEventTouchDown (按下立即触发)
      // 3：UIControlEventTouchDownRepeat (双击)
      // 4：UIControlEventTouchDragInside (按下后拖动)
      // 64：UIControlEventTouchUpInside (按下后抬起)
      
      let number = 64  // 使用最常见的“抬起触发”模式
      
      // 先移除旧的事件处理器（避免重复绑定）
      button.removeTargetActionForControlEvents(this, targetAction, number)
      // 添加新的事件处理器
      button.addTargetActionForControlEvents(this, targetAction, number);
      
      // 👆👆 添加双击检测
      // 1 << 1: UIControlEventTouchDownRepeat
      button.addTargetActionForControlEvents(this, "doubleClick:", 1 << 1);
    }
    
    // ➕ 添加到工具栏视图
    this.view.addSubview(button);
}

/**
 * 🎬 显示工具栏动画 - 优雅地展示工具栏
 * 
 * 【动画流程】
 * ```
 * 隐藏状态             半透明状态           完全显示
 *    │                    │                  │
 *    └──── opacity 0 ────┴── opacity 0.2 ───┴── opacity 1.0
 *                        启动动画            动画完成
 * ```
 * 
 * 【特性】
 * 1. 🌐 智能边界检测：确保工具栏不会超出屏幕
 * 2. 🎭 平滑动画：使用 MNUtil.animate 提供流畅体验
 * 3. 🔄 动态刷新：重新加载按钮配置
 * 4. 🚫 防抖处理：通过 onAnimate 标记避免重复动画
 * 
 * @param {CGRect} frame - 可选，指定初始位置（通常用于动态窗口）
 * @this {pluginDemoController}
 */
pluginDemoController.prototype.show = async function (frame) {
  // 📐 获取当前 frame 并调整到合适大小
  let preFrame = this.view.frame
  
  if (pluginDemoConfig.horizontal(this.dynamicWindow)) {
    // ↔️ 横向工具栏调整
    preFrame.width = pluginDemoUtils.checkHeight(preFrame.width, this.maxButtonNumber)
    preFrame.height = 40  // 固定高度 40
    // 确保不超出屏幕底部
    preFrame.y = pluginDemoUtils.constrain(preFrame.y, 0, MNUtil.studyView.frame.height - 40)
  } else {
    // ↕️ 纵向工具栏调整
    preFrame.width = 40  // 固定宽度 40
    preFrame.height = pluginDemoUtils.checkHeight(preFrame.height, this.maxButtonNumber)
    // 确保不超出屏幕右边
    preFrame.x = pluginDemoUtils.constrain(preFrame.x, 0, MNUtil.studyView.frame.width - 40)
  }
  
  // 🎬 动画准备
  this.onAnimate = true  // 标记正在执行动画
  let yBottom = preFrame.y + preFrame.height  // 计算底部位置（未使用）
  let preOpacity = this.view.layer.opacity    // 保存原始透明度
  this.view.layer.opacity = 0.2                // 设置初始透明度（20%
  
  // 📏 如果指定了初始 frame
  if (frame) {
    frame.width = 40
    frame.height = pluginDemoUtils.checkHeight(frame.height, this.maxButtonNumber)
    this.view.frame = frame
    this.currentFrame = frame
  }
  
  // 👁️ 显示视图但隐藏控制按钮
  this.view.hidden = false
  // this.moveButton.hidden = true  // 移动按钮（已弃用）
  this.screenButton.hidden = true   // 暂时隐藏屏幕按钮
  
  // 🔄 刷新按钮配置
  let useDynamic = pluginDemoConfig.getWindowState("dynamicOrder") && this.dynamicWindow
  this.setToolbarButton(useDynamic ? pluginDemoConfig.dynamicAction : pluginDemoConfig.action)
  
  // ========== 🎯 执行动画 ==========
  MNUtil.animate(() => {
    // 动画中：恢复透明度和 frame
    this.view.layer.opacity = preOpacity
    this.view.frame = preFrame
    this.currentFrame = preFrame
  }).then(() => {
    // 动画完成后的处理
    try {
      this.view.layer.borderWidth = 0      // 清除边框
      // this.moveButton.hidden = false    // 显示移动按钮（已弃用）
      this.screenButton.hidden = false     // 显示屏幕按钮
      
      // 🔢 计算显示的按钮数量
      let number = preFrame.height / 40
      if (number > 9) {
        number = 9  // 限制最多 9 个
      }
      
      this.onAnimate = false  // 动画结束
      this.setToolbarLayout() // 更新布局
    } catch (error) {
      MNUtil.showHUD("Error in show: " + error)
    }
  })
  
  // ========== 📦 备用代码：原生 UIView 动画 ==========
  // 这是使用 iOS 原生动画 API 的实现，功能相同
  // UIView.animateWithDurationAnimationsCompletion(0.2,()=>{
  //   this.view.layer.opacity = preOpacity
  //   this.view.frame = preFrame
  //   this.currentFrame = preFrame
  // },
  // ()=>{
  // try {
  //   this.view.layer.borderWidth = 0
  //   this.moveButton.hidden = false
  //   this.screenButton.hidden = false
  //   let number = preFrame.height/40
  //   if (number > 9) {
  //     number = 9
  //   }
  //   for (let index = 0; index < number-1; index++) {
  //     this["ColorButton"+index].hidden = false
  //   }
  //   this.onAnimate = false
  //   this.setToolbarLayout()
  // } catch (error) {
  //   MNUtil.showHUD(error)
  // }
  // })
}
/**
 * 🎭 隐藏工具栏动画 - 优雅地隐藏工具栏
 * 
 * 【动画流程】
 * ```
 * 完全显示             半透明状态           完全隐藏
 *    │                    │                  │
 *    └── opacity 1.0 ────┴── opacity 0.2 ───┴── hidden=true
 *                        启动动画            动画完成
 * ```
 * 
 * 【特殊机制】
 * - notHide 标记：如果设置为 true，动画后不会真正隐藏，而是恢复透明度
 * - 这个机制用于处理用户快速操作的情况，避免频繁显示/隐藏
 * 
 * @param {CGRect} frame - 可选，指定隐藏时的目标位置
 * @this {pluginDemoController}
 */
pluginDemoController.prototype.hide = function (frame) {
  // 💾 保存当前状态
  let preFrame = this.currentFrame
  this.onAnimate = true  // 标记正在执行动画
  this.view.frame = this.currentFrame  // 确保 frame 是最新的
  
  let preOpacity = 1.0  // 保存原始透明度（通常是 1.0）
  
  // 👁️ 立即隐藏控制按钮
  // 这样用户看到的是按钮先消失，然后整个工具栏淡出
  this.screenButton.hidden = true
  
  // ========== 🌐 旧代码：逐个隐藏按钮 ==========
  // 这种方式效率较低，已被优化
  // for (let index = 0; index < this.buttonNumber; index++) {
  //   this["ColorButton"+index].hidden = true
  // }
  // this.moveButton.hidden = true
  
  // ========== 🎯 执行隐藏动画 ==========
  MNUtil.animate(() => {
    // 动画中：降低透明度到 20%
    this.view.layer.opacity = 0.2
    
    // 如果指定了目标 frame，同时移动到该位置
    if (frame) {
      this.view.frame = frame
      this.currentFrame = frame
    }
  }, 0.2).then(() => {  // 0.2 秒动画时长
    
    // ========== 🎀 特殊处理：notHide 机制 ==========
    if (this.notHide) {
      // 用户可能在隐藏过程中又触发了显示
      // 这种情况下，恢复透明度而不隐藏
      MNUtil.animate(() => {
        this.view.layer.opacity = preOpacity
      })
      this.view.hidden = false
      this.onAnimate = false
      this.notHide = undefined  // 重置标记
    } else {
      // 正常隐藏流程
      this.view.hidden = true               // 完全隐藏视图
      this.view.layer.opacity = preOpacity  // 恢复透明度（为下次显示做准备）
    }
    
    // 🔄 恢复 frame 和状态
    this.view.frame = preFrame
    this.currentFrame = preFrame
    this.onAnimate = false  // 动画结束
  })
}

/**
 * ⏱️ 延迟隐藏工具栏 - 动态窗口的自动隐藏机制
 * 
 * 【使用场景】
 * 在动态窗口模式下，用户操作完成后自动隐藏工具栏：
 * - 点击按钮后
 * - 拖动工具栏后
 * - 执行完动作后
 * 
 * 【机制说明】
 * ```
 * 用户操作 → 等待 delay 秒 → 自动隐藏
 *    ↓
 * 如果设置 notHide=true → 取消隐藏
 * ```
 * 
 * @param {number} delay - 延迟时间（秒），默认 0.5 秒
 * @this {pluginDemoController}
 */
pluginDemoController.prototype.hideAfterDelay = function (delay = 0.5) {
  // ⁉️ 如果已经隐藏，直接返回
  if (this.view.hidden) {
    return
  }
  
  // 🌟 只在动态窗口模式下生效
  if (this.dynamicWindow) {
    this.onAnimate = true  // 预先设置动画标记
    
    // 🚫 检查 notHide 标记
    // 这个机制允许其他代码取消自动隐藏
    if (this.notHide) {
      this.onAnimate = false
      return
    }
    
    // ⏳ 延迟执行隐藏
    MNUtil.delay(delay).then(() => {
      this.hide()
    })
  }
  // 📌 固定窗口模式不会自动隐藏
}

/**
 * @this {pluginDemoController}
 */
pluginDemoController.prototype.setToolbarButton = function (actionNames = pluginDemoConfig.action,newActions=undefined) {
try {
  // MNUtil.showHUD("setToolbarButton")
  let buttonColor = pluginDemoUtils.getButtonColor()
  let dynamicOrder = pluginDemoConfig.getWindowState("dynamicOrder")
  let useDynamic = dynamicOrder && this.dynamicWindow
  this.view.layer.shadowColor = buttonColor
  
  let actions
  if (newActions) {
    pluginDemoConfig.actions = newActions
  }
  actions = pluginDemoConfig.actions
  let defaultActionNames = pluginDemoConfig.getDefaultActionKeys()
  if (!actionNames) {
    actionNames = defaultActionNames
    if (useDynamic) {
      pluginDemoConfig.dynamicAction = actionNames
    }else{
      pluginDemoConfig.action = actionNames
    }
  }else{
    if (useDynamic) {
      pluginDemoConfig.dynamicAction = actionNames
    }else{
      pluginDemoConfig.action = actionNames
    }
  }

  // MNUtil.copyJSON(actionNames)
  // let activeActionNumbers = actionNames.length
  for (let index = 0; index < this.maxButtonNumber; index++) {
    let actionName = actionNames[index]
    let colorButton
    if (this["ColorButton"+index]) {
      colorButton = this["ColorButton"+index]
      colorButton.index = index
    }else{
      this["ColorButton"+index] = UIButton.buttonWithType(0);
      colorButton = this["ColorButton"+index]
      colorButton.height = 40
      colorButton.width = 40
      colorButton.index = index
      // if (this.isMac) {
        this.addPanGesture(colorButton, "onMoveGesture:")  
      // }else{
        this.addLongPressGesture(colorButton, "onLongPressGesture:")
        // this.addSwipeGesture(colorButton, "onSwipeGesture:")
      // }

      // this["moveGesture"+index] = new UIPanGestureRecognizer(this,"onMoveGesture:")
      // colorButton.addGestureRecognizer(this["moveGesture"+index])
      // this["moveGesture"+index].view.hidden = false
    }
    if (actionName.includes("color")) {
      colorButton.color = parseInt(actionName.slice(5))
      this.setColorButtonLayout(colorButton,"setColor:",buttonColor)
    }else if(actionName.includes("custom")){
      this.setColorButtonLayout(colorButton,"customAction:",buttonColor)
    }else{
      this.setColorButtonLayout(colorButton,actionName+":",buttonColor)
    }
    // MNButton.setImage(colorButton, pluginDemoConfig.imageConfigs[actionName])
    // let image = (actionName in actions)?actions[actionName].image+".png":defaultActions[actionName].image+".png"
    // colorButton.setImageForState(MNUtil.getImage(pluginDemoConfig.mainPath + `/`+image),0)
    colorButton.setImageForState(pluginDemoConfig.imageConfigs[actionName],0)
    // self["ColorButton"+index].setTitleForState("",0) 
    // self["ColorButton"+index].contentHorizontalAlignment = 1
  }
  if (this.dynamicToolbar) {
    if (dynamicOrder) {
      // MNUtil.showHUD("useDynamic: "+useDynamic)
      this.dynamicToolbar.setToolbarButton(pluginDemoConfig.dynamicAction,newActions)
    }else{
      // MNUtil.showHUD("useDynamic: "+useDynamic)
      this.dynamicToolbar.setToolbarButton(pluginDemoConfig.action,newActions)
    }
  }
  this.refresh()
} catch (error) {
  MNUtil.showHUD("Error in setToolbarButton: "+error)
}
}
/**
 * 
 * @param {*} frame 
 * @this {pluginDemoController}
 */
pluginDemoController.prototype.refresh = function (frame) {
  if (!frame) {
    frame = this.view.frame
  }
  this.setFrame(frame,true)
  this.setToolbarLayout()
}

pluginDemoController.prototype.setToolbarLayout = function () {
  if (this.onAnimate) {
    return
  }
  // MNUtil.copyJSON(this.view.frame)
  if (pluginDemoConfig.horizontal(this.dynamicWindow)) {
    var viewFrame = this.view.bounds;
    var xLeft     = viewFrame.x
    var xRight    = xLeft + viewFrame.width
    var yTop      = viewFrame.y
    var yBottom   = yTop + 40
    // this.moveButton.frame = {x: 0 ,y: 0,width: 40,height: 15};
    if (this.screenButton) {
      pluginDemoFrame.set(this.screenButton, xRight-15, 0,this.screenButton.height,this.screenButton.width)
      this.view.bringSubviewToFront(this.screenButton)
    }
    let initX = 0
    let initY = 0
    for (let index = 0; index < this.maxButtonNumber; index++) {
      initY = 0
      pluginDemoFrame.set(this["ColorButton"+index], xLeft+initX, initY)
      initX = initX+45
      this["ColorButton"+index].hidden = (initX > xRight+5)
    }
  }else{
    var viewFrame = this.view.bounds;
    var xLeft     = viewFrame.x
    var xRight    = xLeft + 40
    var yTop      = viewFrame.y
    var yBottom   = yTop + viewFrame.height
    // this.moveButton.frame = {x: 0 ,y: 0,width: 40,height: 15};
    if (this.screenButton) {
      pluginDemoFrame.set(this.screenButton, 0, yBottom-15,this.screenButton.width,this.screenButton.height)
      this.view.bringSubviewToFront(this.screenButton)
    }
    let initX = 0
    let initY = 0
    for (let index = 0; index < this.maxButtonNumber; index++) {
      initX = 0
      pluginDemoFrame.set(this["ColorButton"+index], xLeft+initX, initY)
      initY = initY+45
      this["ColorButton"+index].hidden = (initY > yBottom+5)
    }
  }

}
pluginDemoController.prototype.checkPopover = function () {
  if (this.popoverController) {this.popoverController.dismissPopoverAnimated(true);}
}
/**
 * @this {pluginDemoController}
 * @param {UIButton} button 
 * @param {object} des 
 * @returns 
 */
pluginDemoController.prototype.customActionByDes = async function (button,des,checkSubscribe = true) {//这里actionName指的是key
  try {
    if (checkSubscribe && !pluginDemoUtils.checkSubscribe(true)) {
      return
    }
    // MNUtil.copyJSON(des)
    if (this.customActionMenu(button,des)) {
      // MNUtil.showHUD("reject")
      //如果返回true则表示菜单弹出已执行，则不再执行下面的代码
      return
    }
    let focusNote = undefined
    let targetNotes = []
    let success = true
    try {
      focusNote = MNNote.getFocusNote()
    } catch (error) {
    }
    // MNUtil.showHUD("message"+(focusNote instanceof MNNote))
    let notebookid = focusNote ? focusNote.notebookId : undefined
    let title,content,color,config
    let targetNoteId
    switch (des.action) {
      case "undo":
        UndoManager.sharedInstance().undo()
        MNUtil.app.refreshAfterDBChanged(MNUtil.currentNotebookId)
        await MNUtil.delay(0.1)
        break;
      case "redo":
        UndoManager.sharedInstance().redo()
        MNUtil.app.refreshAfterDBChanged(MNUtil.currentNotebookId)
        await MNUtil.delay(0.1)
        break;
      case "copy":
        if (des.target || des.content) {
          success = await pluginDemoUtils.copy(des)
        }else{
          success = pluginDemoUtils.smartCopy()
        }
        break;
      case "paste":
        pluginDemoUtils.paste(des)
        await MNUtil.delay(0.1)
        break;
      case "markdown2Mindmap":
        pluginDemoUtils.markdown2Mindmap(des)
        break;
      case "webSearch":
        await pluginDemoUtils.webSearch(des)
        break;
      case "setTimer":
        pluginDemoUtils.setTimer(des)
        break;
      case "switchTitleOrExcerpt":
        pluginDemoUtils.switchTitleOrExcerpt()
        await MNUtil.delay(0.1)
        break;
      case "cloneAndMerge":
      try {
        if (!des.hideMessage) {
          MNUtil.showHUD("cloneAndMerge")
        }
        targetNoteId= MNUtil.getNoteIdByURL(des.target)
        MNUtil.undoGrouping(()=>{
          try {
          MNNote.getFocusNotes().forEach(focusNote=>{
            pluginDemoUtils.cloneAndMerge(focusNote.note, targetNoteId)
          })
          } catch (error) {
            MNUtil.showHUD(error)
          }
        })
        await MNUtil.delay(0.1)
      } catch (error) {
        MNUtil.showHUD(error)
      }
        break;
      case "cloneAsChildNote":
        if (!des.hideMessage) {
          MNUtil.showHUD("cloneAsChildNote")
        }
        targetNoteId= MNUtil.getNoteIdByURL(des.target)
        MNUtil.undoGrouping(()=>{
          MNNote.getFocusNotes().forEach(focusNote=>{
            pluginDemoUtils.cloneAsChildNote(focusNote, targetNoteId)
          })
        })
        await MNUtil.delay(0.1)
        break;
      case "addTags":
        pluginDemoUtils.addTags(des)
        break;
      case "removeTags":
        pluginDemoUtils.removeTags(des)
        break;
      case "ocr":
        await pluginDemoUtils.ocr(des,button)
        break;
      case "searchInDict":
        // MNUtil.showHUD("searchInDict")
        pluginDemoUtils.searchInDict(des,button)
        break;
      case "insertSnippet":
        success = pluginDemoUtils.insertSnippet(des)
        break;
      case "importDoc":
        let docPath = await MNUtil.importFile(["com.adobe.pdf","public.text"])
        if (docPath.endsWith(".pdf")) {
          let docMd5 = MNUtil.importDocument(docPath)
          MNUtil.openDoc(docMd5)
        }else{
          let fileName = MNUtil.getFileName(docPath).split(".")[0]
          let content = MNUtil.readText(docPath)
          if (focusNote) {
            let child = focusNote.createChildNote({title:fileName,excerptText:content,excerptTextMarkdown:true})
            await child.focusInMindMap(0.5)
          }else{
            let newNote = pluginDemoUtils.newNoteInCurrentChildMap({title:fileName,excerptText:content,excerptTextMarkdown:true})
            await newNote.focusInMindMap(0.5)
          }
        }
        break;
      case "noteHighlight":
        let newNote = await pluginDemoUtils.noteHighlight(des)
        if (newNote && newNote.notebookId === MNUtil.currentNotebookId) {
          let focusInFloatWindowForAllDocMode = des.focusInFloatWindowForAllDocMode ?? false
          let delay = des.focusAfterDelay ?? 0.5
          if (MNUtil.studyController.docMapSplitMode === 2) {
            if (focusInFloatWindowForAllDocMode) {
              await newNote.focusInFloatMindMap(delay)
            }
          }
        }
        // if ("parentNote" in des) {
        //   await MNUtil.delay(5)
        //   let parentNote = MNNote.new(des.parentNote)
        //   parentNote.focusInMindMap()
        //   MNUtil.showHUD("as childNote of "+parentNote.noteId)
        //   MNUtil.undoGrouping(()=>{
        //     parentNote.addChild(newNote)
        //   })
        // }

        break;
      case "moveNote":
        pluginDemoUtils.moveNote(des)
        await MNUtil.delay(0.1)
        break;
      case "addChildNote"://不支持多选
        if (!des.hideMessage) {
          MNUtil.showHUD("addChildNote")
        }
        config = {}
        if (des.title) {
          config.title = pluginDemoUtils.detectAndReplace(des.title)
        }
        if (des.content) {
          config.content = pluginDemoUtils.detectAndReplace(des.content)
        }
        if (des.markdown) {
          config.markdown = des.content
        }
        color = undefined
        if (des.color) {
          switch (des.color) {
            case "{{parent}}":
            case "parent":
              color = focusNote.colorIndex
              break;
            default:
              if (typeof des.color === "number") {
                color = des.color
              }else{
                color = parseInt(des.color.trim())
              }
              break;
          }
          config.color = color
        }
        let childNote = focusNote.createChildNote(config)
        await childNote.focusInMindMap(0.5)
        break;
      case "file2base64":
        let file = await MNUtil.importFile(["public.data"])
        let data = NSData.dataWithContentsOfFile(file)
        MNUtil.copy(data.base64Encoding())
        break;
      case "addBrotherNote":
        if (!des.hideMessage) {
          MNUtil.showHUD("addBrotherNote")
        }
        config = {}
        if (des.title) {
          config.title = pluginDemoUtils.detectAndReplace(des.title)
        }
        if (des.content) {
          config.content = pluginDemoUtils.detectAndReplace(des.content)
        }
        if (des.markdown) {
          config.markdown = des.markdown
        }
        color = undefined
        if (des.color) {
          switch (des.color) {
            case "{{parent}}":
            case "parent":
              color = focusNote.parentNote.colorIndex
              break;
            case "{{current}}":
            case "current":
              color = focusNote.colorIndex
              break;
            default:
              if (typeof des.color === "number") {
                color = des.color
              }else{
                color = parseInt(des.color.trim())
              }
              break;
          }
          config.color = color
        }
        let brotherNote = focusNote.createBrotherNote(config)
        await brotherNote.focusInMindMap(0.5)
        break;

      case "crash":
        if (!des.hideMessage) {
          MNUtil.showHUD("crash")
        }
        MNUtil.studyView.frame = {x:undefined}
        await MNUtil.delay(0.1)
        break;
      case "addComment":
        if (!des.hideMessage) {
          MNUtil.showHUD("addComment")
        }
        let comment = des.content?.trim()
        if (comment) {
          let focusNotes = MNNote.getFocusNotes()
          let markdown = des.markdown ?? true
          let commentIndex = des.index ?? 999
          // MNUtil.copy("text"+focusNotes.length)
          MNUtil.undoGrouping(()=>{
            if (markdown) {
              focusNotes.forEach(note => {
                let replacedText = pluginDemoUtils.detectAndReplace(comment,undefined,note)
                if (replacedText.trim()) {
                  note.appendMarkdownComment(replacedText,commentIndex)
                }
              })
            }else{
              focusNotes.forEach(note => {
                let replacedText = pluginDemoUtils.detectAndReplace(comment,undefined,note)
                if (replacedText.trim()) {
                  note.appendTextComment(replacedText,commentIndex)
                }
              })
            }
          })
        }
        await MNUtil.delay(0.1)
        break;
      case "addMarkdownLink":
        if (!des.hideMessage) {
          MNUtil.showHUD("addMarkdownLink")
        }
        let title = des.title
        let link = des.link
        if (title && link) {
          let replacedTitle = pluginDemoUtils.detectAndReplace(title)
          let replacedLink = pluginDemoUtils.detectAndReplace(link)
          // MNUtil.copy("text"+focusNotes.length)
          MNUtil.undoGrouping(()=>{
            focusNote.appendMarkdownComment(`[${replacedTitle}](${replacedLink})`)
          })
        }
        await MNUtil.delay(0.1)
        break;
      case "removeComment":
        if (!des.hideMessage) {
          MNUtil.showHUD("removeComment")
        }
        pluginDemoUtils.removeComment(des)
        await MNUtil.delay(0.1)
        break;
      case "moveComment":
        if (!des.hideMessage) {
          MNUtil.showHUD("moveComment")
        }
        pluginDemoUtils.moveComment(des)
        await MNUtil.delay(0.1)
        break;
      case "link":
        let linkType = des.linkType ?? "Both"
        let targetUrl = des.target
        if (targetUrl === "{{clipboardText}}") {
          targetUrl = MNUtil.clipboardText
        }
        // MNUtil.showHUD(targetUrl)
        let targetNote = MNNote.new(targetUrl)
        MNUtil.undoGrouping(()=>{
          if (targetNote) {
            MNNote.getFocusNotes().forEach(note=>{
              note.appendNoteLink(targetNote,linkType)
            })
          }else{
            MNUtil.showHUD("Invalid target note!")
          }
        })
        await MNUtil.delay(0.1)
        break;
      case "clearContent":
        pluginDemoUtils.clearContent(des)
        break;
      case "setContent":
          pluginDemoUtils.setContent(des)
        break;
      case "showInFloatWindow":
        pluginDemoUtils.showInFloatWindow(des)
        // MNUtil.copy(focusNote.noteId)
        await MNUtil.delay(0.1)
        break;
      case "openURL":
        if (des.url) {
          let url = pluginDemoUtils.detectAndReplace(des.url)
          MNUtil.openURL(url)
          break;
          // MNUtil.showHUD("message")
        }
        MNUtil.showHUD("No valid argument!")
        break;
      case "command":
        let urlPre = "marginnote4app://command/"
        let delay = des.commandDelay ?? 0.1
        if (des.commands) {
          for (let i = 0; i < des.commands.length; i++) {
            const command = des.commands[i];
            let url = urlPre+command
            MNUtil.openURL(url)
            await MNUtil.delay(delay)
          }
          break
        }
        if (des.command) {
          let url = urlPre+des.command
          MNUtil.openURL(url)
          break
        }
        MNUtil.showHUD("No valid argument!")
        break
      case "shortcut":
        let shortcutName = des.name
        let url = "shortcuts://run-shortcut?name="+encodeURIComponent(shortcutName)
        if (des.input) {
          url = url+"&input="+encodeURIComponent(des.input)
        }
        if (des.text) {
          let text = pluginDemoUtils.detectAndReplace(des.text)
          url = url+"&text="+encodeURIComponent(text)
        }
        MNUtil.openURL(url)
        break
      case "toggleTextFirst":
        if (!des.hideMessage) {
          MNUtil.showHUD("toggleTextFirst")
        }
        targetNotes = pluginDemoUtils.getNotesByRange(des.range ?? "currentNotes")
        MNUtil.undoGrouping(()=>{
          targetNotes.forEach(note=>{
            note.textFirst = !note.textFirst
          })
        })
        await MNUtil.delay(0.1)
        break
      case "toggleMarkdown":
        if (!des.hideMessage) {
          MNUtil.showHUD("toggleMarkdown")
        }
        targetNotes = pluginDemoUtils.getNotesByRange(des.range ?? "currentNotes")
        MNUtil.undoGrouping(()=>{
          targetNotes.forEach(note=>{
            note.excerptTextMarkdown = !note.excerptTextMarkdown
          })
        })
        await MNUtil.delay(0.1)
        break
      case "toggleSidebar":
        pluginDemoUtils.toggleSidebar(des)
        break;
      case "replace":
        pluginDemoUtils.replaceAction(des)
        break;
      case "mergeText":
        let noteRange = des.range ?? "currentNotes"
        targetNotes = pluginDemoUtils.getNotesByRange(noteRange)
        MNUtil.undoGrouping(()=>{
          targetNotes.forEach((note,index)=>{
            let mergedText = pluginDemoUtils.getMergedText(note, des, index)
            if (mergedText === undefined) {
              return new Promise((resolve, reject) => {
                resolve()
              })
            }
            switch (des.target) {
              case "excerptText":
                note.excerptText = mergedText
                if ("markdown" in des) {
                  note.excerptTextMarkdown = des.markdown
                }
                break;
              case "title":
                note.noteTitle = mergedText
                break;
              case "newComment":
                if ("markdown" in des && des.markdown) {
                  note.appendMarkdownComment(mergedText)
                }else{
                  note.appendTextComment(mergedText)
                }
                break;
              case "clipboard":
                MNUtil.copy(mergedText)
                break;
              default:
                break;
            }
          })
        })
        if (pluginDemoUtils.sourceToRemove.length) {
          MNUtil.undoGrouping(()=>{
            // MNUtil.showHUD("remove")
            pluginDemoUtils.sourceToRemove.forEach(note=>{
              note.excerptText = ""
            })
            MNUtil.delay(1).then(()=>{
              pluginDemoUtils.sourceToRemove = []
            })
          })
        }
        if (Object.keys(pluginDemoUtils.commentToRemove).length) {
          MNUtil.undoGrouping(()=>{
            let commentInfos = Object.keys(pluginDemoUtils.commentToRemove)
            commentInfos.forEach(noteId => {
              let note = MNNote.new(noteId)
              let sortedIndex = MNUtil.sort(pluginDemoUtils.commentToRemove[noteId],"decrement")
              sortedIndex.forEach(commentIndex=>{
                if (commentIndex < 0) {
                  note.noteTitle = ""
                }else{
                  note.removeCommentByIndex(commentIndex)
                }
              })
            })
            MNUtil.delay(1).then(()=>{
              pluginDemoUtils.commentToRemove = {}
            })
          })
        }
        await MNUtil.delay(0.1)
        break;
      case "chatAI":
        pluginDemoUtils.chatAI(des,button)
        break
      case "search":
        pluginDemoUtils.search(des,button)
        break;
      case "openWebURL":
        pluginDemoUtils.openWebURL(des)
        break;
      case "addImageComment":
        let source = des.source ?? "photo"
        this.compression = des.compression ?? true
        this.currentNoteId = focusNote.noteId
        switch (source) {
          case "camera":
            this.imagePickerController = UIImagePickerController.new()
            this.imagePickerController.delegate = this  // 设置代理
            this.imagePickerController.sourceType = 1  // 设置图片源为相机
            // this.imagePickerController.allowsEditing = true  // 设置图片源为相册
            MNUtil.studyController.presentViewControllerAnimatedCompletion(this.imagePickerController,true,undefined)
            break;
          case "photo":
            this.imagePickerController = UIImagePickerController.new()
            this.imagePickerController.delegate = this  // 设置代理
            this.imagePickerController.sourceType = 0  // 设置图片源为相册
            // this.imagePickerController.allowsEditing = true  // 设置图片源为相册
            MNUtil.studyController.presentViewControllerAnimatedCompletion(this.imagePickerController,true,undefined)
            break;
          case "file":
            let UTI = ["public.image"]
            let path = await MNUtil.importFile(UTI)
            let imageData = MNUtil.getFile(path)
            MNUtil.showHUD("Import: "+MNUtil.getFileName(path))
            MNUtil.copyImage(imageData)
            focusNote.paste()
            break;
          default:
            MNUtil.showHUD("unknown source")
            break;
        }
        // this.presentViewControllerAnimatedCompletion(this.imagePickerController,true,undefined)
        // 展示图片选择器
        // present(imagePickerController, animated: true, completion: nil)
        break;
      case "focus":
        await pluginDemoUtils.focus(des)
        break 
      case "showMessage":
        pluginDemoUtils.showMessage(des)
        break
      case "confirm":
        let targetDes = await pluginDemoUtils.userConfirm(des)
        if (targetDes) {
          success = await this.customActionByDes(button, targetDes) 
        }else{
          success = false
          MNUtil.showHUD("No valid argument!")
        }
        break
      case "userSelect":
        let selectDes = await pluginDemoUtils.userSelect(des)
        if (selectDes) {
          success = await this.customActionByDes(button, selectDes) 
        }else{
          success = false
          MNUtil.showHUD("No valid argument!")
        }
        break
      case "toggleView":
        if ("targets" in des) {
          des.targets.map(target=>{
            MNUtil.postNotification("toggleMindmapToolbar", {target:target})
          })
        }else{
          MNUtil.postNotification("toggleMindmapToolbar", {target:des.target})
        }
        break
      case "export":
        pluginDemoUtils.export(des)
        // let exportTarget = des.target ?? "auto"
        // let docPath = MNUtil.getDocById(focusNote.note.docMd5).fullPathFileName
        // MNUtil.saveFile(docPath, ["public.pdf"])
        break;
      case "setButtonImage":
        if (!des.hideMessage) {
          MNUtil.showHUD("setButtonImage...")
        }
        await MNUtil.delay(0.01)
        if ("imageConfig" in des) {
          let config = des.imageConfig
          let keys = Object.keys(config)
          for (let i = 0; i < keys.length; i++) {
            let url = config[keys[i]].url
            let scale = config[keys[i]].scale??3
            MNUtil.showHUD("setButtonImage: "+keys[i])
            pluginDemoConfig.setImageByURL(keys[i], url,false,scale)
          }
          // await Promise.all(asyncActions)
          MNUtil.postNotification("refreshToolbarButton", {})
        }else{
          MNUtil.showHUD("Missing imageConfig")
        }
        break;
      case "setColor":
        await pluginDemoUtils.setColor(des)
        break;
      case "triggerButton":
        let targetButtonName = des.buttonName
        success = await this.customActionByButton(button, targetButtonName)
        break;
      default:
        MNUtil.showHUD("Not supported yet...")
        break;
    }
    if (button.delay) {
      this.hideAfterDelay()
      pluginDemoUtils.dismissPopupMenu(button.menu,true)
    }else{
      pluginDemoUtils.dismissPopupMenu(button.menu)
    }
    let delay = des.delay ?? 0.5
    if (success && "onSuccess" in des) {
      let finishAction = des.onSuccess
      await MNUtil.delay(delay)
      await this.customActionByDes(button, finishAction)
      return new Promise((resolve, reject) => {
        resolve()
      })
    } 
    if (!success && "onFailed" in des) {
      let finishAction = des.onFailed
      await MNUtil.delay(delay)
      await this.customActionByDes(button, finishAction)
      return new Promise((resolve, reject) => {
        resolve()
      })
    }
    if ("onFinish" in des) {
      let finishAction = des.onFinish
      await MNUtil.delay(delay)
      await this.customActionByDes(button, finishAction)
      return new Promise((resolve, reject) => {
        resolve()
      })
    }
    return new Promise((resolve, reject) => {
      resolve()
    })
    // if (this.dynamicWindow) {
    //   this.hideAfterDelay()
    // }
    // copyJSON(des)
  } catch (error) {
    pluginDemoUtils.addErrorLog(error, "customActionByDes")
    // MNUtil.showHUD(error)
  }
}

/**
 * @this {pluginDemoController}
 * @param {UIButton} button 
 * @param {object} des 
 * @returns {Promise<boolean>}
 */
pluginDemoController.prototype.customActionByButton = async function (button,targetButtonName,checkSubscribe = true) {//这里actionName指的是key
  try {
    

  let des = pluginDemoConfig.getDesByButtonName(targetButtonName)
  if (des) {
    await this.customActionByDes(button, des)
    return true
  }else{
    return false
  }
    } catch (error) {
    pluginDemoUtils.addErrorLog(error, "customActionByButton")
    return false
  }
}
/**
 * @this {pluginDemoController}
 * @param {UIButton} button 
 * @param {string} target 
 */
pluginDemoController.prototype.replaceButtonTo = async function (button,target) {
  button.removeTargetActionForControlEvents(undefined, undefined, 1 << 6);
  button.setTitleForState("", 0)
  button.setTitleForState("", 1)
  button.addTargetActionForControlEvents(this, target, 1 << 6);
  this.addLongPressGesture(button, "onLongPressGesture:")

}
/**
 * @this {pluginDemoController}
 */
pluginDemoController.prototype.popupReplace = async function (button) {

  let hasReplace = pluginDemoConfig.hasPopup()
  if (!hasReplace) {
    return
  }
  await MNUtil.delay(0.01)//需要延迟一下才能拿到当前的popupMenu
  try {
  // MNUtil.showHUD("message")
  let menu = PopupMenu.currentMenu()
  if (menu) {
    let ids = menu.items.map(item=>{
      if (item.actionString) {
        return item.actionString.replace(":", "")
      }
      return ""
    })
    let maxButtonNumber = (ids.length == menu.subviews.length)?ids.length:menu.subviews.length-1
    // MNUtil.showHUD("message"+ids.length+";"+menu.subviews.length)
    // MNUtil.showHUD(message)
    for (let i = 0; i < maxButtonNumber; i++) {
      if (!ids[i]) {
        continue
      }
      let popupButton = menu.subviews[i].subviews[0]
      let popupConfig = pluginDemoConfig.getPopupConfig(ids[i])
      // MNUtil.showHUD("message"+menu.subviews.length)
      if (!popupConfig) {
        // MNUtil.showHUD("Unknown popup button: "+ids[i])
        continue
      }
      // MNUtil.showHUD("popupReplace:"+ids[i]+":"+pluginDemoConfig.getPopupConfig(ids[i]).enabled)
      if (popupConfig.enabled) {
        // MNUtil.showHUD(pluginDemoConfig.getPopupConfig(ids[i]).target)
        let target = popupConfig.target
        if (target) {
        try {
          popupButton.menu = menu
          popupButton.target = target
          popupButton.setImageForState(pluginDemoConfig.imageConfigs[target],0)
          popupButton.setImageForState(pluginDemoConfig.imageConfigs[target],1)
        } catch (error) {
          pluginDemoUtils.addErrorLog(error, "popupReplaceImage", ids[i])
        }
        }else{
          // MNUtil.showHUD("message"+ids[i])
          // pluginDemoUtils.addErrorLog(error, "popupReplace", ids[i])
        }
      }
    }
    for (let i = 0; i < maxButtonNumber; i++) {
      if (!ids[i]) {
        continue
      }
      let popupButton = menu.subviews[i].subviews[0]
      let popupConfig = pluginDemoConfig.getPopupConfig(ids[i])
      // MNUtil.showHUD("message"+menu.subviews.length)

      if (!popupConfig) {
        MNUtil.showHUD("Unknown popup button: "+ids[i])
        continue
      }
      // MNUtil.showHUD("popupReplace:"+ids[i]+":"+pluginDemoConfig.getPopupConfig(ids[i]).enabled)
      if (popupConfig.enabled) {
        // MNUtil.showHUD(pluginDemoConfig.getPopupConfig(ids[i]).target)
        let target = popupConfig.target
        if (target) {
        try {
          popupButton.menu = menu
          popupButton.target = target
          if (pluginDemoConfig.builtinActionKeys.includes(target)) {
            if (target.includes("color")) {
              popupButton.color = parseInt(target.slice(5))
              this.replaceButtonTo(popupButton, "setColor:")
            }else{
              this.replaceButtonTo(popupButton, target+":")
            }
          }else{
            this.replaceButtonTo(popupButton, "customAction:")
          }
        } catch (error) {
          pluginDemoUtils.addErrorLog(error, "popupReplaceSelector", ids[i])
        }
        }else{
          MNUtil.showHUD("message"+ids[i])
          // pluginDemoUtils.addErrorLog(error, "popupReplace", ids[i])
        }
      }
    }
    await MNUtil.delay(0.01)

    // MNUtil.copy("number: "+targetsNumber)
    for (let i = 0; i < maxButtonNumber; i++) {
      if (!ids[i]) {
        continue
      }
      let popupButton = menu.subviews[i].subviews[0]
      let popupConfig = pluginDemoConfig.getPopupConfig(ids[i])
      // MNUtil.showHUD("message"+menu.subviews.length)
      if (!popupConfig) {
        MNUtil.showHUD("Unknown popup button: "+ids[i])
        continue
      }
      // MNUtil.showHUD("popupReplace:"+ids[i]+":"+pluginDemoConfig.getPopupConfig(ids[i]).enabled)
      if (popupConfig.enabled) {
          // let tem = getAllProperties(temButton)
          let targetsNumber = popupButton.allTargets().count()
          // let action = temButton.allControlEvents.length
          if (targetsNumber === 1) {
            MNUtil.showHUD("可能存在按钮替换失败: "+i)
          }else{
            // MNUtil.showHUD("Number: "+targetsNumber)
          }
      }
    }
    return menu
  }else{
    return undefined
    // MNUtil.showHUD("popupReplaceError")
  }
  } catch (error) {
    pluginDemoUtils.addErrorLog(error, "popupReplace")
  }
}
/**
 * 检测是否需要弹出菜单,如果需要弹出菜单则返回true,否则返回false
 * @this {pluginDemoController}
 * @param {UIButton} button 
 * @param {object} des 
 * @returns {boolean}
 */
pluginDemoController.prototype.customActionMenu =  function (button,des) {
  let buttonX = pluginDemoUtils.getButtonFrame(button).x//转化成相对于studyview的
  try {
    let selector = "customActionByMenu:"
    let object = this
    function tableItem(title,params,checked=false) {
      let des = {des:params,button:button}
      return {title:title,object:object,selector:"customActionByMenu:",param:des,checked:checked}
    }
    //先处理menu这个自定义动作
    if (des.action === "menu") {
      this.onClick = true
      if ("autoClose" in des) {
        this.onClick = !des.autoClose
      }
      let menuItems = des.menuItems
      let width = des.menuWidth??200
      if (menuItems.length) {
        var commandTable = menuItems.map(item=>{
          let title = (typeof item === "string")?item:(item.menuTitle ?? item.action)
          return tableItem(title, item)
          // return {title:title,object:this,selector:'customActionByMenu:',param:{des:item,button:button}}
        })
        this.commandTables = [commandTable]
        if (MNUtil.studyView.bounds.width - buttonX < (width+40)) {
          this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,0)
        }else{
          this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,4)
        }
      }
      return true
    }


    // if (des.action === "chatAI" && des.target) {
    //   if (des.target === "menu") {
    //     this.onClick = true
    //     let promptKeys = chatAIConfig.getConfig("promptNames")
    //     let prompts = chatAIConfig.prompts
    //     var commandTable = promptKeys.map(promptKey=>{
    //       let title = prompts[promptKey].title.trim()
    //       return {title:"🚀   "+title,object:this,selector:'customActionByMenu:',param:{des:{action:"chatAI",prompt:title},button:button}}
    //     })
    //     let width = 250
    //     if (MNUtil.studyView.bounds.width - buttonX < (width+40)) {
    //       this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,0)
    //     }else{
    //       this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,4)
    //     }
    //     return true
    //   }
    // }
    if (des.target && des.target === "menu") {
      this.onClick = true
      var commandTable
      let width = 250
      let selector = "customActionByMenu:"
      switch (des.action) {
        case "chatAI":
          let promptKeys = chatAIConfig.getConfig("promptNames")
          let prompts = chatAIConfig.prompts
          var commandTable = promptKeys.map(promptKey=>{
            let title = prompts[promptKey].title.trim()
            return tableItem("🚀   "+title, {action:"chatAI",prompt:title})
          })
          break;
        case "insertSnippet":
          commandTable = des.menuItems.map(item => {
            item.action = "insertSnippet"
            return tableItem(item.menuTitle,item)
            // return this.tableItem(item.menuTitle, selector,{des:item,button:button})
            // return {title:item.menuTitle,object:this,selector:'customActionByMenu:',param:{des:item,button:button}}
          })
          break;
        case "paste":
          commandTable = [
            tableItem("default",{action:"paste",target:"default"}),
            tableItem("title",{action:"paste",target:"title"}),
            tableItem("excerpt",{action:"paste",target:"excerpt"}),
            tableItem("appendTitle",{action:"paste",target:"appendTitle"}),
            tableItem("appendExcerpt",{action:"paste",target:"appendExcerpt"}),
          ]
          break;
        case "ocr":
          commandTable = [
            tableItem("option", {action:"ocr",target:"option"}),
            tableItem("clipboard", {action:"ocr",target:"clipboard"}),
            tableItem("comment", {action:"ocr",target:"comment"}),
            tableItem("excerpt", {action:"ocr",target:"excerpt"}),
            tableItem("editor", {action:"ocr",target:"editor"}),
            tableItem("chatModeReference", {action:"ocr",target:"chatModeReference"})
          ]
          break;
        case "setTimer":
          commandTable = [
            tableItem("⏰  Clock Mode", {action:"setTimer",timerMode:"clock"}),
            tableItem("⏱️  Count Up", {action:"setTimer",timerMode:"countUp"}),
            tableItem("⏱️  Countdown: 5mins", {action:"setTimer",timerMode:"countdown",minutes:5}),
            tableItem("⏱️  Countdown: 10mins", {action:"setTimer",timerMode:"countdown",minutes:10}),
            tableItem("⏱️  Countdown: 15mins", {action:"setTimer",timerMode:"countdown",minutes:15}),
            tableItem("🍅  Countdown: 25mins", {action:"setTimer",timerMode:"countdown",minutes:25}),
            tableItem("⏱️  Countdown: 40mins", {action:"setTimer",timerMode:"countdown",minutes:40}),
            tableItem("⏱️  Countdown: 60mins", {action:"setTimer",timerMode:"countdown",minutes:60}),
          ]
          break;
        case "search":
          let names = browserConfig.entrieNames
          let entries = browserConfig.entries
          var commandTable = names.map(name=>{
            let title = entries[name].title
            let engine = entries[name].engine
            return tableItem(title, {action:"search",engine:engine})
            // return {title:title,object:this,selector:'customActionByMenu:',param:{des:{action:"search",engine:engine},button:button}}
          })
          break;
        case "copy":
          commandTable = [
            tableItem("selectionText", {action:"copy",target:"selectionText"}),
            tableItem("selectionImage", {action:"copy",target:"selectionImage"}),
            tableItem("title", {action:"copy",target:"title"}),
            tableItem("excerpt", {action:"copy",target:"excerpt"}),
            tableItem("excerpt (OCR)", {action:"copy",target:"excerptOCR"}),
            tableItem("notesText", {action:"copy",target:"notesText"}),
            tableItem("comment", {action:"copy",target:"comment"}),
            tableItem("noteId", {action:"copy",target:"noteId"}),
            tableItem("noteURL", {action:"copy",target:"noteURL"}),
            tableItem("noteMarkdown", {action:"copy",target:"noteMarkdown"}),
            tableItem("noteMarkdown (OCR)", {action:"copy",target:"noteMarkdownOCR"}),
            tableItem("noteWithDecendentsMarkdown", {action:"copy",target:"noteWithDecendentsMarkdown"}),
          ]
          break;
        case "showInFloatWindow":
          commandTable = [
            tableItem("noteInClipboard", {action:"showInFloatWindow",target:"noteInClipboard"}),
            tableItem("currentNote", {action:"showInFloatWindow",target:"currentNote"}),
            tableItem("currentChildMap", {action:"showInFloatWindow",target:"currentChildMap"}),
            tableItem("parentNote", {action:"showInFloatWindow",target:"parentNote"}),
            tableItem("currentNoteInMindMap", {action:"showInFloatWindow",target:"currentNoteInMindMap"}),
          ]
          break;
        case "addImageComment":
          commandTable = [
            tableItem("photo", {action:"addImageComment",source:"photo"}),
            tableItem("camera", {action:"addImageComment",source:"camera"}),
            tableItem("file", {action:"addImageComment",source:"file"}),
          ]
          break;
        case "removeTags":
          let focusNote = MNNote.getFocusNote()
          if (!focusNote) {
            MNUtil.showHUD("No focus note")
            return true
          }
          if (!focusNote.tags.length) {
            MNUtil.showHUD("No tags")
            return true
          }
          commandTable = focusNote.tags.map(tag=>{
            return tableItem("#"+tag, {action:"removeTags",tag:tag})
          })
          break;
        default:
          return false;
      }
      if (MNUtil.studyView.bounds.width - buttonX < (width+40)) {
        this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,0)
      }else{
        this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,4)
      }
      return true
    }
    // if (des.action === "insertSnippet" && des.target && des.target === "menu") {
    //   this.onClick = true
    //   var commandTable = des.menuItems.map(item => {
    //     item.action = "insertSnippet"
    //     return {title:item.menuTitle,object:this,selector:'customActionByMenu:',param:{des:item,button:button}}
    //   })
    //   let width = 250
    //   if (MNUtil.studyView.bounds.width - buttonX < (width+40)) {
    //     this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,0)
    //   }else{
    //     this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,4)
    //   }
    //   return true
    // }
    // if (des.action === "paste" && des.target && des.target === "menu") {
    //   this.onClick = true
    //   var commandTable = [
    //     {title:"default",object:this,selector:'customActionByMenu:',param:{des:{action:"paste",target:"default"},button:button}},
    //     {title:"title",object:this,selector:'customActionByMenu:',param:{des:{action:"paste",target:"title"},button:button}},
    //     {title:"excerpt",object:this,selector:'customActionByMenu:',param:{des:{action:"paste",target:"excerpt"},button:button}},
    //     {title:"appendTitle",object:this,selector:'customActionByMenu:',param:{des:{action:"paste",target:"appendTitle"},button:button}},
    //     {title:"appendExcerpt",object:this,selector:'customActionByMenu:',param:{des:{action:"paste",target:"appendExcerpt"},button:button}}
    //   ]
    //   let width = 250
    //   if ((MNUtil.studyView.bounds.width - buttonX) < (width+40)) {
    //     this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,0)
    //   }else{
    //     this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,4)
    //   }
    //   return true
    // }

    // if (des.action === "ocr" && des.target && des.target === "menu") {
    //   this.onClick = true
    //   var commandTable = [
    //     {title:"clipboard",object:this,selector:'customActionByMenu:',param:{des:{action:"ocr",target:"clipboard"},button:button}},
    //     {title:"comment",object:this,selector:'customActionByMenu:',param:{des:{action:"ocr",target:"comment"},button:button}},
    //     {title:"excerpt",object:this,selector:'customActionByMenu:',param:{des:{action:"ocr",target:"excerpt"},button:button}},
    //     {title:"editor",object:this,selector:'customActionByMenu:',param:{des:{action:"ocr",target:"editor"},button:button}},
    //     {title:"chatModeReference",object:this,selector:'customActionByMenu:',param:{des:{action:"ocr",target:"chatModeReference"},button:button}}
    //   ]
    //   let width = 250
    //   if (MNUtil.studyView.bounds.width - buttonX < (width+40)) {
    //     this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,0)
    //   }else{
    //     this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,4)
    //   }
    //   return true
    // }

    // if (des.action === "setTimer" && des.target && des.target === "menu") {
    //   this.onClick = true
    //   var commandTable = [
    //     // {title:'📝  Annotation',object:self,selector:'inputAnnotation:',param:'left'},
    //     // {title:'⚙️  Setting',object:self,selector:'openSetting:',param:'left'},
    //     {title:'⏰  Clock Mode',object:self,selector:'customActionByMenu:',param:{des:{action:"setTimer",timerMode:"clock"},button:button}},
    //     {title:'⏱️  Count Up',object:self,selector:'customActionByMenu:',param:{des:{action:"setTimer",timerMode:"countUp"},button:button}},
    //     {title:'⌛  Countdown: 5mins',object:self,selector:'customActionByMenu:',param:{des:{action:"setTimer",timerMode:"countdown",minutes:5},button:button}},
    //     {title:'⌛  Countdown: 10mins',object:self,selector:'customActionByMenu:',param:{des:{action:"setTimer",timerMode:"countdown",minutes:10},button:button}},
    //     {title:'⌛  Countdown: 15mins',object:self,selector:'customActionByMenu:',param:{des:{action:"setTimer",timerMode:"countdown",minutes:15},button:button}},
    //     {title:'🍅  Countdown: 25mins',object:self,selector:'customActionByMenu:',param:{des:{action:"setTimer",timerMode:"countdown",minutes:25},button:button}},
    //     {title:'⌛  Countdown: 40mins',object:self,selector:'customActionByMenu:',param:{des:{action:"setTimer",timerMode:"countdown",minutes:40},button:button}},
    //     {title:'⌛  Countdown: 60mins',object:self,selector:'customActionByMenu:',param:{des:{action:"setTimer",timerMode:"countdown",minutes:60},button:button}},
    //   ];
    //   // var commandTable = [
    //   //   {title:"clipboard",object:this,selector:'customActionByMenu:',param:{des:{action:"ocr",target:"clipboard"},button:button}},
    //   //   {title:"comment",object:this,selector:'customActionByMenu:',param:{des:{action:"ocr",target:"comment"},button:button}},
    //   //   {title:"excerpt",object:this,selector:'customActionByMenu:',param:{des:{action:"ocr",target:"excerpt"},button:button}},
    //   //   {title:"editor",object:this,selector:'customActionByMenu:',param:{des:{action:"ocr",target:"editor"},button:button}},
    //   //   {title:"chatModeReference",object:this,selector:'customActionByMenu:',param:{des:{action:"ocr",target:"chatModeReference"},button:button}}
    //   // ]
    //   let width = 250
    //   if (MNUtil.studyView.bounds.width - buttonX < (width+40)) {
    //     this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,0)
    //   }else{
    //     this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,4)
    //   }
    //   return true
    // }

    // if (des.action === "search" && des.target && des.target === "menu") {
    //   this.onClick = true
    //   let names = browserConfig.entrieNames
    //   let entries = browserConfig.entries
    //   var commandTable = names.map(name=>{
    //     let title = entries[name].title
    //     let engine = entries[name].engine
    //     return {title:title,object:this,selector:'customActionByMenu:',param:{des:{action:"search",engine:engine},button:button}}
    //   })
    //   let width = 250
    //   if (MNUtil.studyView.bounds.width - buttonX < (width+40)) {
    //     this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,0)
    //   }else{
    //     this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,4)
    //   }
    //   return true
    // }
    // if (des.action === "copy" && des.target && des.target === "menu") {
    //   this.onClick = true
    //   var commandTable = [
    //     {title:"selectionText",object:this,selector:'customActionByMenu:',param:{des:{action:"copy",target:"selectionText"},button:button}},
    //     {title:"selectionImage",object:this,selector:'customActionByMenu:',param:{des:{action:"copy",target:"selectionImage"},button:button}},
    //     {title:"title",object:this,selector:'customActionByMenu:',param:{des:{action:"copy",target:"title"},button:button}},
    //     {title:"excerpt",object:this,selector:'customActionByMenu:',param:{des:{action:"copy",target:"excerpt"},button:button}},
    //     {title:"excerpt (OCR)",object:this,selector:'customActionByMenu:',param:{des:{action:"copy",target:"excerptOCR"},button:button}},
    //     {title:"notesText",object:this,selector:'customActionByMenu:',param:{des:{action:"copy",target:"notesText"},button:button}},
    //     {title:"comment",object:this,selector:'customActionByMenu:',param:{des:{action:"copy",target:"comment"},button:button}},
    //     {title:"noteId",object:this,selector:'customActionByMenu:',param:{des:{action:"copy",target:"noteId"},button:button}},
    //     {title:"noteURL",object:this,selector:'customActionByMenu:',param:{des:{action:"copy",target:"noteURL"},button:button}},
    //     {title:"noteMarkdown",object:this,selector:'customActionByMenu:',param:{des:{action:"copy",target:"noteMarkdown"},button:button}},
    //     {title:"noteMarkdown (OCR)",object:this,selector:'customActionByMenu:',param:{des:{action:"copy",target:"noteMarkdownOCR"},button:button}},
    //     {title:"noteWithDecendentsMarkdown",object:this,selector:'customActionByMenu:',param:{des:{action:"copy",target:"noteWithDecendentsMarkdown"},button:button}},
    //   ]
    //   let width = 250
    //   if (MNUtil.studyView.bounds.width - buttonX < (width+40)) {
    //     this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,0)
    //   }else{
    //     this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,4)
    //   }
    //   return true
    // }
    // if (des.action === "showInFloatWindow" && des.target && des.target === "menu") {
    //   this.onClick = true
    //   // MNUtil.showHUD("showInFloatWindow")
    //   var commandTable = [
    //     {title:"noteInClipboard",object:this,selector:'customActionByMenu:',param:{des:{action:"showInFloatWindow",target:"noteInClipboard"},button:button}},
    //     {title:"currentNote",object:this,selector:'customActionByMenu:',param:{des:{action:"showInFloatWindow",target:"currentNote"},button:button}},
    //     {title:"currentChildMap",object:this,selector:'customActionByMenu:',param:{des:{action:"showInFloatWindow",target:"currentChildMap"},button:button}},
    //     {title:"parentNote",object:this,selector:'customActionByMenu:',param:{des:{action:"showInFloatWindow",target:"parentNote"},button:button}},
    //     {title:"currentNoteInMindMap",object:this,selector:'customActionByMenu:',param:{des:{action:"showInFloatWindow",target:"currentNoteInMindMap"},button:button}}
    //   ]
    //   let width = 250
    //   if (MNUtil.studyView.bounds.width - buttonX < (width+40)) {
    //     this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,0)
    //   }else{
    //     this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,4)
    //   }
    //   return true
    // }
    // if (des.action === "addImageComment" && des.target === "menu") {
    //   this.onClick = true
    //   var commandTable = [
    //     {title:"photo",object:this,selector:'customActionByMenu:',param:{des:{action:"addImageComment",source:"photo"},button:button}},
    //     {title:"camera",object:this,selector:'customActionByMenu:',param:{des:{action:"addImageComment",source:"camera"},button:button}},
    //     {title:"file",object:this,selector:'customActionByMenu:',param:{des:{action:"addImageComment",source:"file"},button:button}},
    //   ]
    //   let width = 250
    //   if (MNUtil.studyView.bounds.width - buttonX < (width+40)) {
    //     this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,0)
    //   }else{
    //     this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,4)
    //   }
    //   return true
    // }
    // MNUtil.showHUD("shouldShowMenu: false")
    return false
  } catch (error) {
    // pluginDemoUtils.addErrorLog(error, "customActionMenu")
    return false
  }
}

/**
 * 
 * @param {UIView} view 
 * @param {string} selector 
 * @this {pluginDemoController}
 */
pluginDemoController.prototype.addPanGesture = function (view,selector) {
  let gestureRecognizer = new UIPanGestureRecognizer(this,selector)
  view.addGestureRecognizer(gestureRecognizer)
}

/**
 * 
 * @param {UIView} view 
 * @param {string} selector 
 * @this {pluginDemoController}
 */
pluginDemoController.prototype.addLongPressGesture = function (view,selector) {
  let gestureRecognizer = new UILongPressGestureRecognizer(this,selector)
  gestureRecognizer.minimumPressDuration = 0.3
  // if (view.target !== undefined) {
  //   gestureRecognizer.target = view.target
  // }
  // if (view.index !== undefined) {
  //   gestureRecognizer.index = view.index
  // }
  view.addGestureRecognizer(gestureRecognizer)
}
/**
 * 
 * @param {UIView} view 
 * @param {string} selector 
 * @this {pluginDemoController}
 */
pluginDemoController.prototype.addSwipeGesture = function (view,selector) {
  let gestureRecognizer = new UISwipeGestureRecognizer(this,selector)
  view.addGestureRecognizer(gestureRecognizer)
}

/**
 * 
 * @param {string} title 
 * @param {string} selector 
 * @param {any} param 
 * @param {boolean|undefined} checked 
 * @this {pluginDemoController}
 * @returns 
 */
pluginDemoController.prototype.tableItem = function (title,selector,param = "",checked = false) {
  return {title:title,object:this,selector:selector,param:param,checked:checked}
}
/**
 * 根据工具栏的方向,对frame做调整
 * @this {pluginDemoController}
 * @returns 
 */
pluginDemoController.prototype.setFrame = function (frame,maximize = false) {
  let targetFrame = {x:frame.x,y:frame.y}
  if(pluginDemoConfig.horizontal(this.dynamicWindow)){
    let width = Math.max(frame.width,frame.height)
    if (maximize) {
      width = 45*this.buttonNumber+15
    }else{
      this.buttonNumber = Math.floor(width/45)
    }
    if (frame.x + width > MNUtil.studyView.bounds.width) {
      width = MNUtil.studyView.bounds.width - frame.x
    }
    width = pluginDemoUtils.checkHeight(width,this.maxButtonNumber)
    targetFrame.width = width
    targetFrame.height = 40
    targetFrame.x = pluginDemoUtils.constrain(targetFrame.x, 0, MNUtil.studyView.bounds.width-width)
    targetFrame.y = pluginDemoUtils.constrain(targetFrame.y, 0, MNUtil.studyView.bounds.height-40)
  }else{
    targetFrame.width = 40
    let height = Math.max(frame.width,frame.height)
    if (maximize) {
      height = 45*this.buttonNumber+15
    }else{
      this.buttonNumber = Math.floor(height/45)
    }
    if (height > 420 && !pluginDemoUtils.isSubscribed(false)) {
      height = 420
    }
    if (frame.y + height > MNUtil.studyView.bounds.height) {
      height = MNUtil.studyView.bounds.height - frame.y
    }
    height = pluginDemoUtils.checkHeight(height,this.maxButtonNumber)
    targetFrame.height = height
  }
  this.view.frame = targetFrame
  this.currentFrame = targetFrame
}