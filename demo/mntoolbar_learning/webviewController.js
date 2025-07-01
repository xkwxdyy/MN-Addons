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
   * 📱 视图即将显示时调用 - iOS 生命周期方法
   * 
   * 【生命周期位置】
   * ```
   * viewDidLoad → viewWillAppear → viewDidAppear
   *     ↓              ↓                ↓
   * 视图加载完成    即将显示          已经显示
   * ```
   * 
   * 【调用时机】
   * 1. 🔄 工具栏第一次显示时
   * 2. 🔀 从其他视图返回时
   * 3. 📱 应用从后台回到前台时
   * 
   * 【典型用途】
   * - 🔄 刷新界面数据
   * - 🎬 启动动画
   * - 📡 注册通知观察者
   * - 🔧 更新UI状态
   * 
   * 【注意事项】
   * - 此时视图还未显示在屏幕上
   * - 不要在这里做耗时操作
   * - 可能会被多次调用
   * 
   * @param {boolean} animated - 是否使用动画显示视图
   * @this {pluginDemoController}
   */
  viewWillAppear: function(animated) {
    // 🔧 预留接口：未来可能需要在显示前更新状态
    // 例如：刷新按钮配置、检查订阅状态、同步设置等
  },
  
  /**
   * 📱 视图即将消失时调用 - iOS 生命周期方法
   * 
   * 【生命周期位置】
   * ```
   * viewWillDisappear → viewDidDisappear → (可能) dealloc
   *        ↓                    ↓                   ↓
   *    即将消失            已经消失            释放内存
   * ```
   * 
   * 【调用时机】
   * 1. 🔄 切换到其他视图时
   * 2. 📱 应用进入后台时
   * 3. ❌ 工具栏被关闭时
   * 
   * 【典型用途】
   * - 💾 保存当前状态
   * - 🛑 停止动画或定时器
   * - 📡 移除通知观察者
   * - 🧹 清理临时资源
   * 
   * 【重要提醒】
   * - 此时视图还在屏幕上
   * - 不要在这里释放重要资源
   * - 视图可能会再次显示
   * 
   * @param {boolean} animated - 是否使用动画隐藏视图
   * @this {pluginDemoController}
   */
  viewWillDisappear: function(animated) {
    // 🔧 预留接口：未来可能需要在消失前保存状态
    // 例如：保存工具栏位置、记录使用习惯、同步配置等
  },
  // ========== Apple Pencil 双击手势处理（已注释，可能用于 iPad） ==========
  // onPencilDoubleTap(){
  //   MNUtil.showHUD("message")
  // },
  // onPencilDoubleTapPerform(perform){
  //   MNUtil.showHUD("message")
  // },
  
  /**
   * 📐 视图即将布局子视图时调用 - 响应布局变化
   * 
   * 【核心作用】
   * 这是 iOS 自动布局系统的关键回调，负责在视图尺寸变化时重新排列所有子视图。
   * 对于工具栏来说，这意味着需要重新计算和调整所有按钮的位置。
   * 
   * 【调用时机】
   * 1. 📱 设备旋转（横屏 ↔ 竖屏）
   * 2. 🖼️ 分屏模式改变（iPad）
   * 3. 📏 工具栏大小调整
   * 4. 🔄 父视图布局更新
   * 5. 🎬 动画过程中的每一帧
   * 
   * 【布局流程】
   * ```
   * 触发条件（旋转/调整大小）
   *         ↓
   * setNeedsLayout() 标记需要布局
   *         ↓
   * layoutIfNeeded() 触发布局
   *         ↓
   * viewWillLayoutSubviews() ← 我们在这里
   *         ↓
   * layoutSubviews() 执行布局
   *         ↓
   * viewDidLayoutSubviews() 布局完成
   * ```
   * 
   * 【性能优化】
   * - 🚫 动画期间跳过布局：避免破坏动画流畅性
   * - 🔄 批量更新：一次性调整所有按钮位置
   * - 📏 智能计算：只在必要时重新计算
   * 
   * 【注意事项】
   * - ⚠️ 不要在这里修改 bounds 或 frame，会导致无限循环
   * - 🎯 只做布局相关的操作
   * - 🚀 保持代码高效，此方法可能频繁调用
   * 
   * @this {pluginDemoController}
   */
  viewWillLayoutSubviews: function() {
    let self = getToolbarController()
    
    // 🚫 动画保护：如果正在执行动画，跳过布局更新
    // 原因：动画过程中会不断触发此方法，如果每次都重新布局会导致：
    // 1. 动画卡顿或跳动
    // 2. 布局计算浪费性能
    // 3. 可能破坏动画的连续性
    if (self.onAnimate) {
      return
    }
    
    // 📐 执行布局更新
    // setToolbarLayout 会根据当前方向（横向/纵向）和尺寸
    // 重新计算每个按钮的位置，确保它们正确排列
    self.setToolbarLayout()
  },
  
  /**
   * 📜 滚动视图滚动时的回调 - UIScrollViewDelegate 方法
   * 
   * 【方法来源】
   * 这是 UIScrollViewDelegate 协议的方法，通常用于监听滚动事件。
   * 虽然工具栏本身不是滚动视图，但可能包含滚动元素。
   * 
   * 【可能的用途】
   * 1. 📜 未来功能：可滚动的按钮列表（当按钮超过屏幕时）
   * 2. 🎯 滚动联动：根据文档滚动自动显示/隐藏工具栏
   * 3. 📊 滚动统计：记录用户滚动行为
   * 4. 🎨 视差效果：创建滚动相关的视觉效果
   * 
   * 【典型实现示例】
   * ```javascript
   * scrollViewDidScroll: function(scrollView) {
   *   let offset = scrollView.contentOffset.y
   *   if (offset > 100) {
   *     // 滚动超过 100 像素，隐藏工具栏
   *     this.hide()
   *   } else {
   *     // 显示工具栏
   *     this.show()
   *   }
   * }
   * ```
   * 
   * 【性能考虑】
   * - ⚡ 此方法在滚动时频繁调用（每秒可能 60 次）
   * - 🚫 避免在此方法中做复杂计算
   * - 🎯 使用节流（throttle）技术限制执行频率
   * 
   * @param {UIScrollView} scrollView - 正在滚动的滚动视图（如果实现）
   * @this {pluginDemoController}
   */
  scrollViewDidScroll: function() {
    // 🔧 预留接口：当前未实现
    // 未来可能用于实现滚动相关的交互功能
  },
  /**
   * 🎨 改变工具栏透明度 - 让工具栏半透明以减少视觉干扰
   * 
   * 【功能说明】
   * 允许用户调整工具栏的透明度，从 50% 到 100%：
   * - 100%：完全不透明，适合需要清晰看到按钮时
   * - 50%：半透明，减少对文档内容的遮挡
   * 
   * 【使用场景】
   * - 📖 阅读模式：降低透明度，专注于文档内容
   * - ✏️ 编辑模式：提高透明度，方便操作按钮
   * - 🎬 演示模式：调整到合适的透明度，不影响展示
   * 
   * 【实现原理】
   * ```
   * 用户点击 → 弹出菜单 → 选择透明度
   *    ↓
   * changeOpacityTo: → view.layer.opacity = 新值
   * ```
   * 
   * @param {UIButton} sender - 触发透明度调整的按钮
   * @example
   * // 用户点击设置按钮后，选择透明度
   * // 菜单显示：100% / 90% / 80% / 70% / 60% / 50%
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
  /**
   * 🔧 设置具体的透明度值
   * 
   * @param {number} opacity - 透明度值 (0.0-1.0)
   *                          0.0 = 完全透明
   *                          1.0 = 完全不透明
   */
  changeOpacityTo:function (opacity) {
    self.view.layer.opacity = opacity
    // self.webAppButton.setTitleForState(`${opacity*100}%`, 0);  // 可选：在按钮上显示当前透明度
  },
  /**
   * 🔄 屏幕方向切换菜单 - 改变工具栏的排列方向
   * 
   * 【功能说明】
   * 点击屏幕按钮后弹出的菜单，包含两个选项：
   * 1. 🔄 Direction：切换工具栏方向（横向 ↔️ / 纵向 ↕️）
   * 2. ⚙️ Setting：打开设置界面
   * 
   * 【方向切换逻辑】
   * ```
   * 横向工具栏 (↔️)           纵向工具栏 (↕️)
   * ┌─┬─┬─┬─┬─┬─┐            ┌─┐
   * │1│2│3│4│5│➕│            │1│
   * └─┴─┴─┴─┴─┴─┘            ├─┤
   *                           │2│
   *                           ├─┤
   *                           │3│
   *                           ├─┤
   *                           │➕│
   *                           └─┘
   * ```
   * 
   * 【图标说明】
   * - 🌟 动态窗口：工具栏会自动隐藏
   * - 🛠️ 固定窗口：工具栏始终显示
   * 
   * @param {UIButton} sender - 屏幕切换按钮
   */
  changeScreen: function(sender) {
    let self = getToolbarController()
    let clickDate = Date.now()  // 记录点击时间（可用于防抖）
    // if (self.dynamicWindow) {
    //   return  // 动态窗口模式下禁用（已注释）
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
  /**
   * 🔄 执行工具栏方向切换
   * 
   * @param {string} source - 来源标识（"dynamic" 或 "fixed"）
   *                         用于区分是从动态窗口还是固定窗口触发
   */
  toggleToolbarDirection: function (source) {
    self.checkPopover()  // 关闭菜单
    pluginDemoConfig.toggleToolbarDirection(source)  // 调用配置管理器执行切换
  },
  /**
   * 🌟 切换动态/固定模式 - 改变工具栏的显示行为
   * 
   * 【模式说明】
   * 1. 🌟 动态模式 (Dynamic)：
   *    - 工具栏像 macOS 的 Dock 一样自动显示/隐藏
   *    - 操作完成后自动消失
   *    - 适合专注阅读，减少干扰
   * 
   * 2. 🛠️ 固定模式 (Fixed)：
   *    - 工具栏始终显示在屏幕上
   *    - 可以自由拖动位置
   *    - 适合频繁操作，方便随时使用
   * 
   * 【操作流程】
   * ```
   * 切换模式 → 更新配置 → 保存状态 → 显示提示
   *     ↓                              ↓
   * 通知所有插件            “Dynamic ✅” 或 “Dynamic ❌”
   * ```
   */
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
   * 🎨 设置卡片颜色 - 为选中的卡片应用指定颜色
   * 
   * 【颜色索引说明】
   * MarginNote 提供 16 种预设颜色（0-15）：
   * 0 = 🟡 淡黄色  1 = 🟢 淡绿色  2 = 🔵 淡蓝色  3 = 🔴 淡红色
   * 4 = 🟣 淡紫色  5 = 🟠 橙色    6 = ⚪ 灰色    7 = 🟤 深蓝色
   * 8 = 🟨 黄色    9 = 🟩 绿色    10 = 🔶 蓝色   11 = 🔴 红色
   * 12 = 🟣 紫色   13 = 🟤 棕色   14 = ⚫ 黑色   15 = ⭕ 粉色
   * 
   * 【交互设计】
   * - 单击：设置选中卡片为该颜色
   * - 双击：执行自定义的双击动作（如筛选该颜色的卡片）
   * 
   * 【延迟机制】
   * 使用 0.1 秒延迟来区分单击和双击：
   * ```
   * 第一次点击 → 等待 0.1秒 → 没有第二次点击 → 执行单击
   *      ↓
   * 第二次点击 → 取消单击 → 执行双击
   * ```
   * 
   * @param {UIButton} button - 颜色按钮，包含 color 属性（0-15）
   * @example
   * // 按钮的 color 属性由 actionName 解析得来
   * // "color5" → button.color = 5
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
  /**
   * ⛔ 禁用的执行方法 - 占位函数
   * 
   * 【说明】
   * 这个方法可能用于：
   * - 临时禁用某些功能
   * - 作为开发中的占位符
   * - 处理未实现的按钮动作
   * 
   * @param {UIButton} button - 触发执行的按钮
   */
  execute: async function (button) {
    MNUtil.showHUD("Action disabled")  // 显示“动作已禁用”提示
  },
  /**
   * 🚀 自定义动作处理器 - 工具栏核心业务逻辑入口
   * 
   * 【核心功能】
   * 这是所有按钮点击事件的统一入口，负责：
   * 1. 🔍 查找按钮对应的动作名称
   * 2. 📝 获取动作的详细配置
   * 3. 👆👆 处理双击事件
   * 4. 🎯 执行对应的动作
   * 
   * 【按钮索引系统】
   * ```
   * button.index → actionNames[index] → actionName
   *                        ↓
   *               pluginDemoConfig.descriptions
   *                        ↓
   *                   动作配置 (des)
   * ```
   * 
   * 【双击处理机制】
   * 如果动作配置中包含 doubleClick：
   * 1. 设置 button.delay = true （延迟关闭菜单）
   * 2. 第一次点击：等待双击
   * 3. 第二次点击：执行 doubleClick 动作
   * 
   * @param {UIButton} button - 被点击的按钮对象
   *                           button.index - 按钮在工具栏中的索引
   *                           button.target - 可选，直接指定的动作名
   *                           button.doubleClick - 标记是否为双击
   * @returns {void}
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
  /**
   * 🗋️ 菜单项点击处理器 - 处理弹出菜单中的选项点击
   * 
   * 【调用时机】
   * 当用户点击弹出菜单中的某个选项时调用
   * 
   * 【参数结构】
   * ```javascript
   * param = {
   *   des: {           // 菜单项配置
   *     action: "...", // 动作名称
   *     menuTitle: "...",  // 菜单显示文本
   *     menuItems: [...], // 子菜单项
   *     autoClose: true   // 是否自动关闭
   *   },
   *   button: UIButton // 触发菜单的原始按钮
   * }
   * ```
   * 
   * 【特殊处理】
   * 1. 🗋️ 嵌套菜单：如果 action="menu"，则显示子菜单
   * 2. 🔙 返回按钮：第一个菜单项显示返回上级
   * 3. 🚀 自动关闭：根据 autoClose 决定是否自动隐藏工具栏
   * 
   * @param {Object} param - 包含菜单项配置和按钮的参数对象
   */
  customActionByMenu: async function (param) {
    let des = param.des
    if (typeof des === "string" || !("action" in des)) {
      return  // 纯文本项或无动作项，不处理
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
  /**
   * 🔙 返回上一级菜单 - 实现多级菜单的回退功能
   * 
   * 【栈结构管理】
   * ```
   * commandTables = [
   *   [一级菜单],  ← 最底层
   *   [二级菜单],
   *   [三级菜单]   ← 当前显示
   * ]
   * 
   * pop() 后：
   * commandTables = [
   *   [一级菜单],
   *   [二级菜单]   ← 回到这一级
   * ]
   * ```
   * 
   * @param {UIButton} button - 用于定位新菜单显示位置的按钮
   */
  lastPopover: function (button) {
      self.checkPopover()                // 关闭当前菜单
      self.commandTables.pop()           // 移除最后一级菜单
      let commandTable = self.commandTables.at(-1)  // 获取上一级菜单
      self.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,200,4)  // 显示上一级
},
  /**
   * 🖼️ 图片选择器完成回调 - 处理用户选择的图片
   * 
   * 【功能说明】
   * 用户从系统相册选择图片后，自动：
   * 1. 📎 复制图片到剪贴板
   * 2. 📋 粘贴到当前卡片
   * 
   * 【图片格式处理】
   * - self.compression = true：使用 JPEG 压缩（节省空间）
   * - self.compression = false：使用 PNG 无损（保持质量）
   * 
   * 【代码流程】
   * ```
   * 获取图片 → 关闭选择器 → 复制到剪贴板 → 延迟 0.1秒 → 粘贴到卡片
   * ```
   * 
   * @param {UIImagePickerController} UIImagePickerController - 图片选择器控制器
   * @param {Object} info - 图片信息字典
   *                       info.UIImagePickerControllerOriginalImage - 原始图片
   * 
   * 【iOS 委托方法】
   * 这是 UIImagePickerControllerDelegate 的标准回调方法
   */
  imagePickerControllerDidFinishPickingMediaWithInfo:async function (UIImagePickerController,info) {
    try {
      
    let image = info.UIImagePickerControllerOriginalImage  // 获取原始图片
    // MNUtil.copy(image.pngData().base64Encoding())  // 调试：base64 编码
    // MNUtil.copyJSON(info)                          // 调试：查看完整信息
    MNUtil.studyController.dismissViewControllerAnimatedCompletion(true,undefined)  // 关闭选择器
    
    // 🖼️ 根据压缩设置选择格式
    if (self.compression) {
      MNUtil.copyImage(image.jpegData(0.0))  // JPEG 压缩（参数 0.0 代表最高压缩）
    }else{
      MNUtil.copyImage(image.pngData())      // PNG 无损
    }
    
    await MNUtil.delay(0.1)  // 等待剪贴板就绪
    MNNote.new(self.currentNoteId).paste()  // 粘贴到指定卡片
    // MNNote.getFocusNote().paste()  // 备选：粘贴到当前焦点卡片
    
    } catch (error) {
      MNUtil.showHUD(error)
    }
  },
  /**
   * 🙅 图片选择器取消回调 - 用户取消选择图片
   * 
   * @param {Object} params - 取消参数（通常不使用）
   */
  imagePickerControllerDidCancel:function (params) {
    // MNUtil.copy("text")  // 调试代码
    MNUtil.studyController.dismissViewControllerAnimatedCompletion(true,undefined)  // 关闭选择器
    
  },
  /**
   * ⏱️ 计时器功能 - 设置专注时间或番茄钟
   * 
   * 【使用场景】
   * - 🍅 番茄工作法：25分钟工作 + 5分钟休息
   * - 🎯 专注模式：设定时间段专注学习
   * - ⏰ 提醒功能：定时提醒休息或切换任务
   * 
   * @param {UIButton} button - 计时器按钮
   */
  timer: function (button) {
    self.onClick = true
    let des = pluginDemoConfig.getDescriptionByName("timer")  // 获取计时器配置
    des.action = "setTimer"  // 设置动作为计时器
    self.customActionByDes(button,des,false)  // 执行计时器设置
  },
  /**
   * ↩️ 撤销操作 - 撤销上一步对卡片的修改
   * 
   * 【功能说明】
   * 使用 MarginNote 的全局撤销管理器，支持撤销：
   * - ✏️ 文本编辑
   * - 🎨 颜色修改
   * - 🔗 链接操作
   * - 📋 笔记复制/粘贴
   * - 📝 评论添加/删除
   * 
   * 【实现原理】
   * ```
   * UndoManager 记录所有操作
   *     ↓
   * canUndo() 检查是否有可撤销的操作
   *     ↓
   * undo() 执行撤销
   *     ↓
   * refreshAfterDBChanged() 刷新界面
   * ```
   * 
   * @param {UIButton} button - 撤销按钮
   */
  undo: function (button) {
    if (UndoManager.sharedInstance().canUndo()) {  // 检查是否有可撤销的操作
      UndoManager.sharedInstance().undo()          // 执行撤销
      MNUtil.app.refreshAfterDBChanged(MNUtil.currentNotebookId)  // 刷新笔记本显示
    }else{
      MNUtil.showHUD("No Change to Undo")         // 无可撤销操作
    }
  },
  /**
   * ↪️ 重做操作 - 恢复被撤销的操作
   * 
   * 【功能说明】
   * 与撤销(Undo)相对，重新执行之前被撤销的操作
   * 
   * 【使用场景】
   * ```
   * 操作 A → 操作 B → 撤销 B → 重做 B
   *                       ↑        ↑
   *                     回到 A    恢复到 B
   * ```
   * 
   * 【注意事项】
   * - 只有在执行过撤销后才能重做
   * - 新的操作会清空重做历史
   * 
   * @param {UIButton} button - 重做按钮
   */
  redo: function (button) {
    if (UndoManager.sharedInstance().canRedo()) {  // 检查是否有可重做的操作
      UndoManager.sharedInstance().redo()          // 执行重做
      MNUtil.app.refreshAfterDBChanged(MNUtil.currentNotebookId)  // 刷新界面
    }else{
      MNUtil.showHUD("No Change to Redo")         // 无可重做操作
    }
  },
  /**
   * 📋 复制功能 - 智能复制卡片内容或选中文本
   * 
   * 【复制策略】
   * 1. 📑 双击复制：仅复制卡片标题
   * 2. 📝 单击复制：智能选择复制内容
   *    - 有选中文本 → 复制选中文本
   *    - 有聚焦卡片 → 复制卡片内容
   *    - 都没有 → 提示用户
   * 
   * 【配置选项】
   * 可以在设置中配置复制的具体行为：
   * - 复制格式：Markdown、纯文本、HTML
   * - 复制内容：摘录、标题、评论、组合
   * - 分隔符：换行、空格、自定义
   * 
   * 【代码流程】
   * ```
   * 按钮点击
   *     ↓
   * 检查配置 (des)
   *     ↓
   * 判断是否双击
   *  │     │
   *  是     否
   *  ↓     ↓
   * 复制标题  智能复制
   * ```
   * 
   * @param {UIButton} button - 复制按钮
   *                           button.doubleClick - 标记是否为双击
   *                           button.menu - 关联的弹出菜单
   */
  copy:function (button) {
    let self = getToolbarController()
    self.onClick = true
    let des = pluginDemoConfig.getDescriptionByName("copy")  // 获取复制配置
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
  /**
   * 🔗 复制为 Markdown 链接 - 将卡片转换为可点击的链接格式
   * 
   * 【功能说明】
   * 将选中的卡片转换为 Markdown 链接格式，方便在其他应用中使用
   * 
   * 【输出格式】
   * - 单击：`[卡片标题](marginnote4app://note/卡片ID)`
   * - 双击：`marginnote4app://note/卡片ID`
   * 
   * 【使用场景】
   * - 📝 在 Obsidian/Notion 中引用 MarginNote 卡片
   * - 📱 在其他应用中快速跳转到指定卡片
   * - 🔗 创建卡片间的外部链接
   * 
   * 【批量处理】
   * 支持同时选中多个卡片，每个卡片一行
   * 
   * @param {UIButton} button - 复制链接按钮
   *                           button.doubleClick - 双击时仅复制 URL
   */
  copyAsMarkdownLink(button) {
    MNUtil.currentWindow.becomeFirstResponder()  // 确保窗口获得焦点
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

  /**
   * 🔍 在欧路词典中查课 - 快速查询单词或文本
   * 
   * 【支持的词典】
   * - 📘 欧路词典 (Eudic) - 默认
   * - 📕 有道词典 (YoudaoDict)
   * - 📗 金山词霸 (iCIBA)
   * - 📙 搜狗词典 (SogouDict)
   * - 📓 必应词典 (BingDict)
   * 
   * 【智能选择文本】
   * 按以下优先级自动选择要查询的内容：
   * 1. 🔖 当前选中的文本
   * 2. 📑 焦点卡片的摘录文本
   * 3. 🏷️ 焦点卡片的标题
   * 4. 📝 焦点卡片的第一个文本评论
   * 
   * 【打开方式】
   * - 外部应用：通过 URL Scheme 跳转到词典 App
   * - 内置浮窗：在 MarginNote 内显示查询结果（部分词典）
   * 
   * @param {UIButton} button - 查词按钮
   */
  searchInEudic:async function (button) {
  try {
    self.onClick = true
    let des = pluginDemoConfig.getDescriptionByName("searchInEudic")  // 获取词典配置
    des.action = "searchInDict"  // 设置动作为查词
    await self.customActionByDes(button, des, false)  // 执行查词动作
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
  /**
   * 🔄 标题/摘录互换 - 快速交换卡片的标题和摘录内容
   * 
   * 【功能说明】
   * 将当前卡片的标题和摘录内容互换位置
   * 
   * 【使用场景】
   * - 📝 摘录内容更适合做标题时
   * - 🏷️ 需要将简短标题放到摘录中
   * - 🔄 调整卡片的展示方式
   * 
   * 【操作效果】
   * ```
   * 操作前：
   * 标题："短标题"
   * 摘录："这是一段很长的摘录内容..."
   * 
   * 操作后：
   * 标题："这是一段很长的摘录内容..."
   * 摘录："短标题"
   * ```
   * 
   * @param {UIButton} button - 交换按钮
   */
  switchTitleorExcerpt(button) {
    self.onClick = true
    pluginDemoUtils.switchTitleOrExcerpt()  // 调用工具方法执行交换
    if (button.menu) {
      button.menu.dismissAnimated(true)     // 关闭菜单
      return
    }
    self.hideAfterDelay()                   // 动态窗口自动隐藏
  },
  /**
   * 💥 BigBang 文本分词功能
   * 
   * 【功能说明】
   * BigBang 是一种创新的文本处理方式，灵感来自锤子手机的 BigBang 功能。
   * 它可以将一段文本"炸开"成独立的词汇单元，方便用户进行选择、编辑和操作。
   * 
   * 【使用场景】
   * 1. 📝 长文本编辑：快速选择和编辑长段落中的特定词汇
   * 2. 🔍 关键词提取：从笔记中提取重要关键词
   * 3. 🌐 多语言处理：支持中英文混合文本的智能分词
   * 4. 📋 快速复制：选择性复制文本片段
   * 
   * 【工作原理】
   * 1. 获取当前焦点笔记
   * 2. 发送通知给 BigBang 插件
   * 3. BigBang 插件接收通知后显示分词界面
   * 4. 用户可以点选需要的词汇进行操作
   * 
   * 【插件协作】
   * 这个功能需要配合 "MN BigBang" 插件使用：
   * - 本插件负责：触发 BigBang 功能
   * - BigBang 插件负责：显示分词界面和处理用户操作
   * 
   * @param {UIButton} button - 触发按钮
   */
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
  /**
   * ✂️ Snipaste 截图贴图功能
   * 
   * 【功能说明】
   * Snipaste 是一个强大的截图和贴图工具，这个功能集成了 Snipaste 到 MarginNote 中。
   * 可以快速截取屏幕内容或将笔记内容发送到 Snipaste 进行悬浮显示。
   * 
   * 【使用场景】
   * 1. 📸 快速截图：截取文档、网页、视频等内容到笔记
   * 2. 🖼️ 悬浮参考：将重要内容悬浮在屏幕上作为参考
   * 3. 🎨 图片标注：截图后可以进行标注和编辑
   * 4. 📚 对比学习：将多个内容并排显示对比
   * 
   * 【工作模式】
   * 1. **选中图片模式**：
   *    - 检测到选中图片时，将图片发送到 Snipaste
   *    - 适用于：保存文档中的图表、公式等
   * 
   * 2. **笔记模式**：
   *    - 没有选中内容时，将整个笔记发送到 Snipaste
   *    - 适用于：悬浮显示重要笔记内容
   * 
   * 【插件协作】
   * 需要配合 "MN Snipaste" 插件使用：
   * - 本插件负责：检测内容类型并发送通知
   * - Snipaste 插件负责：接收内容并调用 Snipaste 应用
   * 
   * 【技术细节】
   * - selection.onSelection：判断是否有选中内容
   * - selection.isText：判断选中的是文本还是图片
   * - selection.image：获取选中的图片数据
   * 
   * @param {UIButton} button - 触发按钮
   */
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
  /**
   * 🤖 ChatGLM AI 对话功能
   * 
   * 【功能说明】
   * ChatGLM 是清华大学开发的中文对话大模型，这个功能将 AI 对话能力集成到 MarginNote 中。
   * 可以对笔记内容进行智能分析、总结、翻译、问答等操作。
   * 
   * 【使用场景】
   * 1. 📖 内容总结：让 AI 总结长篇文档或复杂笔记
   * 2. 🌍 智能翻译：支持多语言互译，保持学术准确性
   * 3. 💡 概念解释：解释专业术语和复杂概念
   * 4. 🎯 问题解答：基于笔记内容回答问题
   * 5. ✍️ 写作辅助：续写、改写、润色文本
   * 
   * 【工作流程】
   * 1. 检查是否有自定义配置（des）
   * 2. 如果有配置：
   *    - 设置 action 为 "chatAI"
   *    - 调用 customActionByDes 执行配置的 AI 动作
   * 3. 如果没有配置：
   *    - 发送通知给 ChatAI 插件，使用默认设置
   * 
   * 【配置说明】
   * 可以在设置中自定义 ChatGLM 按钮的行为：
   * - prompt：自定义提示词
   * - target：输出目标（新评论、替换等）
   * - model：选择不同的 AI 模型
   * 
   * 【插件协作】
   * 需要配合 "MN ChatAI" 插件使用：
   * - 本插件负责：触发 AI 对话功能
   * - ChatAI 插件负责：管理 AI 连接和对话界面
   * 
   * @param {UIButton} button - 触发按钮
   */
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
  /**
   * 🔍 搜索功能 - 在浏览器中搜索选中文本或笔记内容
   * 
   * 【功能说明】
   * 这是一个智能搜索功能，可以将选中的文本或当前笔记内容发送到内置浏览器进行搜索。
   * 支持自定义搜索引擎和智能窗口定位。
   * 
   * 【使用场景】
   * 1. 📚 学术搜索：搜索论文、定义、相关资料
   * 2. 🌐 网络查询：快速查询不熟悉的概念
   * 3. 🔗 延伸阅读：查找相关内容深入学习
   * 4. 🎯 事实核查：验证笔记中的信息
   * 
   * 【搜索优先级】
   * 1. 自定义配置：如果用户配置了搜索行为，优先使用
   * 2. 选中文本：如果有选中文本，搜索该文本
   * 3. 焦点笔记：如果没有选中文本，搜索当前笔记内容
   * 
   * 【窗口定位算法】
   * 搜索窗口会智能定位，避免遮挡内容：
   * ```
   * 触发位置判断：
   * ├─ 从菜单触发：
   * │  └─ 搜索窗口显示在按钮附近
   * └─ 从工具栏触发：
   *    ├─ 右侧空间充足：显示在工具栏右侧
   *    └─ 右侧空间不足：显示在工具栏左侧
   * ```
   * 
   * 【坐标计算说明】
   * - beginFrame：起始位置（动画起点）
   * - endFrame：目标位置（搜索窗口最终位置）
   * - studyFrame：学习视图边界（用于限制窗口位置）
   * - MNUtil.constrain：确保窗口不超出屏幕边界
   * 
   * 【插件协作】
   * 需要配合搜索插件使用：
   * - 本插件负责：确定搜索内容和窗口位置
   * - 搜索插件负责：显示浏览器界面并执行搜索
   * 
   * @param {UIButton} button - 触发按钮
   */
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
  /**
   * 📱 侧边栏切换功能
   * 
   * 【功能说明】
   * 控制 MarginNote 侧边栏的显示和隐藏。侧边栏通常包含文档目录、笔记本列表、
   * 搜索功能等重要工具，这个功能可以快速切换侧边栏状态。
   * 
   * 【使用场景】
   * 1. 📖 专注阅读：隐藏侧边栏获得更大阅读空间
   * 2. 🗂️ 快速导航：显示侧边栏查看文档结构
   * 3. 🔍 内容搜索：打开侧边栏使用搜索功能
   * 4. 📚 切换文档：通过侧边栏快速切换不同文档
   * 
   * 【技术实现】
   * 1. 获取侧边栏的配置描述（des）
   * 2. 设置动作类型为 "toggleSidebar"
   * 3. 调用工具函数执行切换操作
   * 
   * 【配置扩展】
   * 用户可以在设置中配置侧边栏按钮的额外行为：
   * - 目标侧边栏：左侧栏、右侧栏
   * - 切换模式：显示/隐藏/自动
   * - 动画效果：滑动、淡入淡出
   * 
   * 【与其他功能的配合】
   * - 与全屏模式配合：全屏时自动隐藏侧边栏
   * - 与分屏模式配合：调整侧边栏宽度适应分屏
   * - 与 ChatAI 配合：AI 对话窗口可能显示在侧边栏
   * 
   * @param {UIButton} button - 触发按钮
   */
  sidebar: async function (button) {
    if (button.menu) {
      button.menu.dismissAnimated(true)
    }
    let des = pluginDemoConfig.getDescriptionByName("sidebar")
    des.action = "toggleSidebar"
    pluginDemoUtils.toggleSidebar(des)
  },
  /**
   * ✏️ 编辑功能 - 在 MN Editor 中打开笔记
   * 
   * 【功能说明】
   * 这个功能集成了 MN Editor 插件，提供更强大的笔记编辑能力。
   * 可以在专门的编辑器窗口中编辑笔记，支持 Markdown、代码高亮等高级功能。
   * 
   * 【使用场景】
   * 1. 📝 长文编辑：编辑大段文字内容
   * 2. 💻 代码笔记：编写带语法高亮的代码片段
   * 3. 📊 表格编辑：创建和编辑复杂表格
   * 4. 🎨 格式调整：使用富文本编辑功能
   * 
   * 【获取笔记的优先级】
   * 1. 动态窗口模式：使用缓存的当前笔记 ID
   * 2. 焦点笔记：获取当前选中的笔记
   * 3. 选区笔记：如果有选中内容，获取对应的笔记
   * 
   * 【窗口定位策略】
   * 编辑器窗口会根据触发位置智能定位：
   * - 从菜单触发：编辑器显示在按钮附近
   * - 从工具栏触发：根据屏幕空间自动选择左侧或右侧
   * - 自动避免超出屏幕边界
   * 
   * 【插件协作】
   * 需要配合 "MN Editor" 插件使用：
   * - 本插件负责：确定要编辑的笔记和窗口位置
   * - Editor 插件负责：提供编辑界面和保存功能
   * 
   * @param {UIButton} button - 触发按钮
   * @returns {void} 如果没有找到笔记则提前返回
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
  /**
   * 👁️ OCR 文字识别功能
   * 
   * 【功能说明】
   * OCR (Optical Character Recognition) 光学字符识别功能，可以将图片中的文字提取出来。
   * 支持多种 OCR 引擎和识别场景，特别优化了学术内容的识别。
   * 
   * 【使用场景】
   * 1. 📷 扫描文档：将纸质文档拍照后提取文字
   * 2. 📐 公式识别：识别数学公式并转换为 LaTeX
   * 3. 📊 表格提取：从图片中提取表格数据
   * 4. 🌍 多语言识别：支持中英日韩等多种语言
   * 5. 📜 古籍识别：识别繁体字和古文
   * 
   * 【OCR 引擎选择】
   * - SimpleTex：专门识别数学公式
   * - GPT-4V：智能识别，理解上下文
   * - 通用 OCR：快速识别普通文本
   * 
   * 【工作流程】
   * 1. 获取 OCR 按钮的配置
   * 2. 设置 action 为 "ocr"
   * 3. 调用 customActionByDes 执行 OCR
   * 4. 根据配置将结果输出到指定位置
   * 
   * 【配置选项】
   * - source：OCR 引擎选择
   * - target：输出目标（评论、摘录、剪贴板等）
   * - method：处理方式（替换、追加）
   * 
   * 【历史兼容】
   * 注释掉的代码显示之前需要检查 ocrUtils，
   * 现在已经集成到核心功能中，不再需要单独的 OCR 插件。
   * 
   * @param {UIButton} button - 触发按钮
   */
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
  /**
   * ⚙️ 设置功能 - 打开工具栏设置界面
   * 
   * 【功能说明】
   * 打开 MN Toolbar 的设置界面，允许用户自定义工具栏的各种配置。
   * 这是工具栏的控制中心，可以管理按钮、配置功能、调整外观等。
   * 
   * 【设置内容】
   * 1. 🎨 按钮管理：调整按钮顺序、显示/隐藏
   * 2. 🛠️ 功能配置：自定义每个按钮的具体行为
   * 3. 🎭 外观设置：颜色、透明度、大小等
   * 4. 🔗 插件协作：配置与其他插件的联动
   * 5. 💾 配置管理：导入/导出配置文件
   * 
   * 【技术实现】
   * 1. 检查并关闭当前的弹出窗口（避免界面重叠）
   * 2. 发送通知打开设置界面
   * 3. 设置界面由 settingController 管理
   * 
   * 【用户体验优化】
   * - 设置界面会记住上次的位置
   * - 支持实时预览更改效果
   * - 提供重置默认设置选项
   * 
   * @param {UIButton} button - 触发按钮
   */
  setting: function (button) {
    self.checkPopover()
    MNUtil.postNotification("openToolbarSetting", {})
    if (button.menu) {
      button.menu.dismissAnimated(true)
      return
    }
    self.hideAfterDelay()
  },
  /**
   * 📋 粘贴为标题功能
   * 
   * 【功能说明】
   * 将剪贴板中的文本粘贴为笔记的标题。这是一个常用的快速编辑功能，
   * 支持单击和双击两种操作模式，可以配置不同的粘贴行为。
   * 
   * 【使用场景】
   * 1. 📝 快速命名：从其他地方复制标题快速设置
   * 2. 🔄 标题更新：替换现有笔记的标题
   * 3. 📚 批量整理：配合其他功能批量设置标题
   * 4. 🎯 精确粘贴：根据配置粘贴到不同位置
   * 
   * 【功能特性】
   * 1. **双击支持**：
   *    - 可以配置双击时的特殊行为
   *    - 双击可能粘贴到不同位置（如评论）
   * 
   * 2. **配置模式**：
   *    - 如果有配置，使用配置的粘贴行为
   *    - 支持粘贴到标题、摘录、评论等位置
   * 
   * 3. **默认模式**：
   *    - 没有配置时，直接粘贴为标题
   *    - 使用撤销分组确保可以撤销
   * 
   * 【技术细节】
   * - button.doubleClick：检测是否为双击操作
   * - button.menu.stopHide：阻止菜单自动关闭
   * - MNUtil.undoGrouping：确保操作可撤销
   * - des.target：配置的粘贴目标位置
   * 
   * 【动态窗口特殊处理】
   * 在动态窗口模式下，粘贴后会自动隐藏工具栏，
   * 避免遮挡编辑后的内容。
   * 
   * @param {UIButton} button - 触发按钮
   */
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
  /**
   * 🧹 清除格式功能
   * 
   * 【功能说明】
   * 清除笔记中的所有格式化样式，将内容恢复为纯文本状态。
   * 这个功能可以批量处理多个选中的笔记，去除所有富文本格式。
   * 
   * 【使用场景】
   * 1. 📝 格式混乱：从网页复制的内容带有杂乱格式
   * 2. 🎨 样式重置：清除之前应用的颜色、字体等样式
   * 3. 📊 统一格式：批量处理笔记使格式一致
   * 4. 🔄 重新排版：清除后重新应用统一的格式
   * 
   * 【清除内容】
   * - 字体样式（粗体、斜体、下划线等）
   * - 字体大小和颜色
   * - 段落格式（缩进、对齐等）
   * - 超链接样式
   * - 其他富文本格式
   * 
   * 【技术实现】
   * 1. 获取所有选中的笔记（支持多选）
   * 2. 使用撤销分组包裹操作
   * 3. 对每个笔记调用 clearFormat() 方法
   * 4. 使用 map 函数批量处理
   * 
   * 【代码演进】
   * 注释掉的代码显示了功能的演进：
   * - 旧版本：只处理单个焦点笔记
   * - 新版本：支持批量处理多个笔记
   * 
   * 【注意事项】
   * - 清除格式是不可逆的（但可以撤销）
   * - 不会影响笔记的内容，只影响格式
   * - 批量操作时注意性能影响
   * 
   * @param {UIButton} button - 触发按钮
   */
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
  /**
   * 👆👆 双击标记功能
   * 
   * 【功能说明】
   * 这是一个辅助函数，用于标记按钮被双击。
   * 当检测到双击事件时，会设置按钮的 doubleClick 属性为 true。
   * 
   * 【使用场景】
   * 这个函数通常不直接使用，而是作为双击检测机制的一部分：
   * 1. 🎯 双击检测：识别用户的双击操作
   * 2. 🔄 状态标记：为后续处理提供双击状态
   * 3. ⚡ 快捷操作：某些按钮支持双击触发不同功能
   * 
   * 【工作原理】
   * 1. 用户快速点击两次按钮
   * 2. 系统检测到双击事件
   * 3. 调用此函数设置标记
   * 4. 其他函数（如 pasteAsTitle）检查这个标记
   * 5. 根据标记执行不同的操作
   * 
   * 【配合使用】
   * 许多按钮函数会检查 button.doubleClick：
   * ```javascript
   * if (button.doubleClick) {
   *   // 执行双击特定的操作
   *   button.doubleClick = false  // 重置标记
   * }
   * ```
   * 
   * 【设计模式】
   * 这是一个简单的标记模式（Flag Pattern），
   * 通过设置对象属性来传递状态信息。
   * 
   * @param {UIButton} button - 被双击的按钮
   */
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
 * 🎮 设置工具栏按钮 - 初始化或更新工具栏上的所有按钮
 * 
 * 【核心功能】
 * 这是工具栏按钮系统的核心方法，负责：
 * 1. 🎨 创建或更新按钮的外观（颜色、图标）
 * 2. 🔗 绑定按钮的点击事件和手势
 * 3. 🔢 管理按钮的顺序和索引
 * 4. 🔄 同步动态/固定窗口的按钮配置
 * 
 * 【按钮类型识别】
 * ```javascript
 * actionName = "color5"   → 颜色按钮，设置颜色为 5
 * actionName = "custom1"  → 自定义按钮 1
 * actionName = "copy"     → 系统功能按钮
 * ```
 * 
 * 【动态顺序机制】
 * - dynamicOrder = true：使用用户自定义的按钮顺序
 * - dynamicOrder = false：使用默认顺序
 * 
 * 【性能优化】
 * - 按钮对象复用：如果按钮已存在，只更新属性而不重新创建
 * - 手势绑定一次：避免重复添加手势识别器
 * 
 * @param {Array<string>} actionNames - 按钮动作名称数组，如 ["copy", "paste", "color1", ...]
 * @param {Object} newActions - 可选，新的动作配置对象
 * @this {pluginDemoController}
 * 
 * @example
 * // 使用默认配置
 * setToolbarButton()
 * 
 * // 使用自定义顺序
 * setToolbarButton(["copy", "paste", "undo", "redo"])
 * 
 * // 更新动作配置
 * setToolbarButton(undefined, newActionsConfig)
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
/**
 * 🔄 刷新工具栏 - 重新计算并更新工具栏布局
 * 
 * 【使用场景】
 * - 🔄 按钮配置变更后
 * - 📱 屏幕方向改变后
 * - 🔧 工具栏大小调整后
 * 
 * @param {CGRect} frame - 可选，新的 frame，不传则使用当前 frame
 * @this {pluginDemoController}
 */
/**
 * 🔄 刷新工具栏 - 更新位置和布局
 * 
 * 【功能说明】
 * 刷新工具栏的显示状态，包括更新位置和重新布局所有按钮。
 * 这是一个常用的维护方法，确保工具栏正确显示。
 * 
 * 【使用场景】
 * 1. 📱 屏幕旋转后重新定位
 * 2. 🖼️ 分屏模式变化后调整
 * 3. 🔧 配置更改后更新显示
 * 4. 🐛 修复显示异常
 * 
 * 【刷新内容】
 * - 工具栏位置（frame）
 * - 按钮布局（横向/纵向）
 * - 显示状态同步
 * 
 * 【参数说明】
 * - 如果提供了 frame，使用新位置
 * - 如果没有提供，使用当前位置
 * 
 * @param {CGRect} frame - 可选，新的位置和大小
 * @this {pluginDemoController}
 */
pluginDemoController.prototype.refresh = function (frame) {
  if (!frame) {
    frame = this.view.frame  // 使用当前 frame
  }
  this.setFrame(frame,true)   // 更新 frame
  this.setToolbarLayout()      // 重新布局按钮
}

/**
 * 🖼️ 设置工具栏布局 - 根据方向排列按钮
 * 
 * 【布局策略】
 * 1. ↔️ 横向布局：按钮从左到右排列
 *    ```
 *    [按钮1][按钮2][按钮3]...[屏幕按钮]
 *    ```
 * 
 * 2. ↕️ 纵向布局：按钮从上到下排列
 *    ```
 *    [按钮1]
 *    [按钮2]
 *    [按钮3]
 *       ...
 *    [屏幕按钮]
 *    ```
 * 
 * 【布局计算】
 * - 按钮大小：40x40 像素
 * - 按钮间距：5 像素
 * - 总占用：45 像素/按钮
 * - 超出范围的按钮会被隐藏
 * 
 * 【特殊处理】
 * - 屏幕按钮始终保持在最上层
 * - 动画过程中不更新布局（避免抖动）
 * 
 * @this {pluginDemoController}
 */
pluginDemoController.prototype.setToolbarLayout = function () {
  if (this.onAnimate) {
    return  // 动画过程中，跳过布局更新
  }
  // MNUtil.copyJSON(this.view.frame)  // 调试：输出 frame 信息
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
/**
 * ❌ 检查并关闭弹出菜单 - 确保只有一个菜单显示
 * 
 * 【使用时机】
 * 在显示新菜单之前调用，避免多个菜单重叠
 * 
 * @this {pluginDemoController}
 */
pluginDemoController.prototype.checkPopover = function () {
  if (this.popoverController) {this.popoverController.dismissPopoverAnimated(true);}
}
/**
 * 🎯 执行自定义动作 - 根据动作描述执行相应操作
 * 
 * 【核心业务逻辑】
 * 这是工具栏所有功能的最终执行器，负责：
 * 1. 🔐 订阅验证：检查用户是否有权限使用该功能
 * 2. 🗋️ 菜单处理：如果是菜单动作，显示弹出菜单
 * 3. 🎯 动作分发：根据 action 类型执行对应的功能
 * 4. 📝 笔记获取：获取当前焦点卡片供动作使用
 * 
 * 【动作类型分发】
 * ```javascript
 * switch(des.action) {
 *   case "setColor":     // 设置卡片颜色
 *   case "copy":         // 复制操作
 *   case "paste":        // 粘贴操作
 *   case "menu":         // 显示子菜单
 *   case "custom":       // 自定义动作
 *   // ... 更多动作类型
 * }
 * ```
 * 
 * 【参数说明】
 * @param {UIButton} button - 触发动作的按钮
 * @param {Object} des - 动作描述对象
 *   des.action - 动作类型
 *   des.target - 目标参数
 *   des.option - 额外选项
 *   des.menuItems - 菜单项（当 action="menu" 时）
 * @param {boolean} checkSubscribe - 是否检查订阅状态，默认 true
 * @returns {void}
 * 
 * @this {pluginDemoController}
 * 
 * @example
 * // 执行复制动作
 * customActionByDes(button, {
 *   action: "copy",
 *   target: "title",
 *   option: "markdown"
 * })
 * 
 * // 显示菜单
 * customActionByDes(button, {
 *   action: "menu",
 *   menuItems: [{
 *     menuTitle: "选项 1",
 *     action: "option1"
 *   }]
 * })
 */
pluginDemoController.prototype.customActionByDes = async function (button,des,checkSubscribe = true) {
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
    // MNUtil.showHUD("message"+(focusNote instanceof MNNote))  // 调试：检查焦点卡片类型
    let notebookid = focusNote ? focusNote.notebookId : undefined
    let title,content,color,config  // 声明常用变量
    let targetNoteId
    
    // ========== 🎯 核心动作分发器 ==========
    /**
     * 这是工具栏的核心业务逻辑，根据 des.action 执行对应的功能
     * 每个 case 对应一种具体的操作
     */
    switch (des.action) {
      // ========== ↩️ 撤销/重做操作 ==========
      case "undo":
        UndoManager.sharedInstance().undo()  // 执行撤销
        MNUtil.app.refreshAfterDBChanged(MNUtil.currentNotebookId)  // 刷新界面
        await MNUtil.delay(0.1)  // 短暂延迟确保UI更新
        break;
        
      case "redo":
        UndoManager.sharedInstance().redo()  // 执行重做
        MNUtil.app.refreshAfterDBChanged(MNUtil.currentNotebookId)  // 刷新界面
        await MNUtil.delay(0.1)
        break;
      // ========== 📋 复制/粘贴操作 ==========
      case "copy":
        if (des.target || des.content) {
          // 有指定复制目标或内容
          success = await pluginDemoUtils.copy(des)
        }else{
          // 智能复制：自动判断复制什么内容
          success = pluginDemoUtils.smartCopy()
        }
        break;
        
      case "paste":
        pluginDemoUtils.paste(des)  // 执行粘贴操作
        await MNUtil.delay(0.1)     // 等待粘贴完成
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
      // ========== 📝 添加子卡片 ==========
      case "addChildNote":  // 注意：不支持多选
        if (!des.hideMessage) {
          MNUtil.showHUD("addChildNote")  // 显示操作提示
        }
        config = {}  // 配置对象
        // 📝 设置标题
        if (des.title) {
          config.title = pluginDemoUtils.detectAndReplace(des.title)  // 支持变量替换
        }
        // 📄 设置内容
        if (des.content) {
          config.content = pluginDemoUtils.detectAndReplace(des.content)
        }
        // 🎯 Markdown 支持
        if (des.markdown) {
          config.markdown = des.content  // 将内容作为 Markdown 处理
        }
        // 🎨 设置颜色
        color = undefined
        if (des.color) {
          switch (des.color) {
            case "{{parent}}":  // 使用父卡片颜色
            case "parent":
              color = focusNote.colorIndex
              break;
            default:
              // 解析颜色值（支持数字或字符串）
              if (typeof des.color === "number") {
                color = des.color
              }else{
                color = parseInt(des.color.trim())
              }
              break;
          }
          config.color = color
        }
        // 🎯 创建子卡片并聚焦
        let childNote = focusNote.createChildNote(config)  // 创建子卡片
        await childNote.focusInMindMap(0.5)                // 0.5秒后在脑图中聚焦
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
 * 🔘 通过按钮名称触发动作 - 实现按钮间的联动
 * 
 * 【功能说明】
 * 允许一个按钮触发另一个按钮的动作，实现：
 * - 🔗 按钮联动：一个按钮可以触发多个按钮的动作
 * - 🎯 工作流：组合多个按钮动作形成工作流
 * - 🔄 动态调用：根据条件触发不同的按钮
 * 
 * 【应用场景】
 * ```javascript
 * // 在动作配置中：
 * {
 *   action: "triggerButton",
 *   buttonName: "copy"  // 触发复制按钮
 * }
 * ```
 * 
 * @param {UIButton} button - 当前触发的按钮
 * @param {string} targetButtonName - 目标按钮名称（如 "copy", "paste", "color1" 等）
 * @param {boolean} checkSubscribe - 是否检查订阅状态，默认 true
 * @returns {Promise<boolean>} 返回是否成功执行
 * @this {pluginDemoController}
 */
pluginDemoController.prototype.customActionByButton = async function (button,targetButtonName,checkSubscribe = true) {
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
 * 🔄 替换按钮的目标动作 - 动态修改按钮功能
 * 
 * 【功能说明】
 * 将按钮的点击动作替换为新的目标动作，常用于：
 * - 🎯 弹出菜单替换：将系统菜单按钮替换为自定义功能
 * - 🔄 动态按钮：根据上下文改变按钮功能
 * - 🎮 模式切换：同一个按钮在不同模式下有不同功能
 * 
 * 【实现步骤】
 * 1. 🔓 移除所有旧的点击事件
 * 2. 🗋️ 清空按钮文本（使用图标代替）
 * 3. 🎯 添加新的点击事件
 * 4. 👆 重新添加长按手势
 * 
 * @param {UIButton} button - 要替换动作的按钮
 * @param {string} target - 新的目标动作名称（如 "copy:", "setColor:" 等）
 * @this {pluginDemoController}
 */
pluginDemoController.prototype.replaceButtonTo = async function (button,target) {
  button.removeTargetActionForControlEvents(undefined, undefined, 1 << 6);
  button.setTitleForState("", 0)
  button.setTitleForState("", 1)
  button.addTargetActionForControlEvents(this, target, 1 << 6);
  this.addLongPressGesture(button, "onLongPressGesture:")

}
/**
 * 🔄 弹出菜单替换 - 自定义系统弹出菜单中的按钮
 * 
 * 【核心功能】
 * 这是 MN Toolbar 的一个强大特性，允许替换 MarginNote 系统弹出菜单中的按钮：
 * - 🎯 替换图标：使用自定义图标替换系统图标
 * - 🔗 替换动作：将系统动作替换为自定义功能
 * - 🔍 保留原功能：可以选择性地替换部分按钮
 * 
 * 【实现流程】
 * ```
 * 获取当前弹出菜单
 *     ↓
 * 遍历菜单中的所有按钮
 *     ↓
 * 根据配置决定是否替换
 *     ↓
 * 替换图标和动作
 *     ↓
 * 验证替换结果
 * ```
 * 
 * 【配置示例】
 * ```javascript
 * // 在 pluginDemoConfig 中配置：
 * {
 *   "makeLink": {           // 系统按钮 ID
 *     enabled: true,        // 是否启用替换
 *     target: "customLink" // 替换为的动作
 *   }
 * }
 * ```
 * 
 * 【注意事项】
 * - 需要延迟 0.01 秒才能获取到弹出菜单
 * - 会分三个阶段执行：图标替换 → 动作替换 → 结果验证
 * - 如果替换失败会显示警告
 * 
 * @param {UIButton} button - 触发弹出菜单的按钮
 * @returns {PopupMenu|undefined} 返回弹出菜单对象，或 undefined
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
 * 🗋️ 处理自定义菜单动作 - 检测并显示弹出菜单
 * 
 * 【核心功能】
 * 这是菜单系统的入口，负责：
 * 1. 🔍 检测动作是否需要显示菜单
 * 2. 🎭 构建菜单项列表
 * 3. 📍 决定菜单显示位置（左侧/右侧）
 * 4. 🎯 处理特殊类型的菜单
 * 
 * 【菜单类型】
 * 1. 🗋️ 通用菜单：action="menu"，显示自定义菜单项
 * 2. 🚀 AI 菜单：action="chatAI" + target="menu"
 * 3. 📋 粘贴菜单：action="paste" + target="menu"
 * 4. 🔍 OCR 菜单：action="ocr" + target="menu"
 * 5. ⏱️ 计时器菜单：action="setTimer" + target="menu"
 * 
 * 【菜单配置示例】
 * ```javascript
 * {
 *   action: "menu",
 *   menuWidth: 250,        // 菜单宽度
 *   autoClose: false,      // 是否自动关闭工具栏
 *   menuItems: [
 *     {
 *       menuTitle: "选项 1",
 *       action: "option1"
 *     },
 *     "分隔线文本"        // 纯文本作为分组标题
 *   ]
 * }
 * ```
 * 
 * 【位置算法】
 * - 如果按钮靠近屏幕右边缘：菜单显示在左侧
 * - 否则：菜单显示在右侧
 * 
 * @param {UIButton} button - 触发菜单的按钮
 * @param {Object} des - 动作描述对象
 * @returns {boolean} true 表示已处理菜单，false 表示不是菜单动作
 * @this {pluginDemoController}
 */
pluginDemoController.prototype.customActionMenu =  function (button,des) {
  let buttonX = pluginDemoUtils.getButtonFrame(button).x//转化成相对于studyview的
  try {
    let selector = "customActionByMenu:"
    let object = this
    /**
     * 📋 创建菜单项对象 - 内部辅助函数
     * 
     * 【功能说明】
     * 这是一个工厂函数，用于创建符合 iOS 菜单系统要求的菜单项对象。
     * 每个菜单项包含了显示文本、回调对象、选择器和参数等必要信息。
     * 
     * 【使用场景】
     * 在 customActionMenu 方法内部使用，用于：
     * 1. 📱 创建弹出菜单的选项
     * 2. 🎯 将用户配置转换为 iOS 菜单格式
     * 3. ✅ 支持带选中状态的菜单项
     * 
     * 【iOS 菜单项结构】
     * iOS 的菜单系统需要特定格式的对象：
     * - title: 菜单项显示的文本
     * - object: 处理菜单点击的对象（通常是控制器）
     * - selector: 要调用的方法名（Objective-C 选择器）
     * - param: 传递给方法的参数
     * - checked: 是否显示选中标记
     * 
     * 【参数封装】
     * 将原始参数和按钮引用封装在一起：
     * - des: 包含原始参数和按钮引用
     * - des.des: 菜单项的配置参数
     * - des.button: 触发菜单的按钮
     * 
     * @param {string} title - 菜单项显示的标题文本
     * @param {Object} params - 菜单项的配置参数，包含 action、menuTitle 等
     * @param {boolean} [checked=false] - 是否在菜单项前显示选中标记（✓）
     * @returns {{title: string, object: Object, selector: string, param: Object, checked: boolean}} 
     *          返回符合 iOS 菜单系统要求的菜单项对象
     * 
     * @example
     * // 创建一个普通菜单项
     * let item1 = tableItem("复制", {action: "copy"})
     * 
     * @example
     * // 创建一个带选中标记的菜单项
     * let item2 = tableItem("自动保存", {action: "toggleAutoSave"}, true)
     */
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
 * 👋 添加拖动手势 - 让界面元素可以自由拖动
 * 
 * 【功能说明】
 * 为指定的视图添加拖动（Pan）手势识别器，使其可以响应用户的拖动操作。
 * 这是实现工具栏拖动、按钮拖拽排序等功能的基础方法。
 * 
 * 【手势工作流程】
 * ```
 * 用户按下并拖动
 *      ↓
 * UIPanGestureRecognizer 识别手势
 *      ↓
 * 调用 selector 指定的处理方法
 *      ↓
 * 在处理方法中：
 *   - gesture.state === 1：开始拖动
 *   - gesture.state === 2：拖动中（持续触发）
 *   - gesture.state === 3：结束拖动
 * ```
 * 
 * 【使用场景】
 * 1. 📱 工具栏移动：拖动整个工具栏到新位置
 * 2. 🔄 按钮重排：拖动按钮改变顺序
 * 3. 📏 调整大小：拖动边缘调整视图大小
 * 4. 🎯 手势导航：通过拖动切换页面
 * 
 * 【技术细节】
 * - UIPanGestureRecognizer：iOS 原生拖动手势类
 * - selector：处理方法必须接收一个参数（手势对象）
 * - this：作为 target，指定处理方法所在的对象
 * 
 * 【常见 selector 方法】
 * - "onMoveGesture:"：处理视图移动
 * - "onResizeGesture:"：处理大小调整
 * - "onDragGesture:"：处理拖拽操作
 * 
 * @param {UIView} view - 要添加手势的视图对象
 * @param {string} selector - 手势触发时调用的方法名（必须包含冒号）
 * @this {pluginDemoController}
 * 
 * @example
 * // 为工具栏添加拖动功能
 * this.addPanGesture(this.view, "onMoveGesture:")
 * 
 * // 为按钮添加拖动重排功能
 * this.addPanGesture(button, "onButtonDrag:")
 */
pluginDemoController.prototype.addPanGesture = function (view,selector) {
  let gestureRecognizer = new UIPanGestureRecognizer(this,selector)
  view.addGestureRecognizer(gestureRecognizer)
}

/**
 * 👆⏳ 添加长按手势 - 实现长按触发的交互功能
 * 
 * 【功能说明】
 * 为视图添加长按手势识别器，允许用户通过长按触发特定操作。
 * 这是实现上下文菜单、快捷操作、预览功能等的基础方法。
 * 
 * 【手势时序】
 * ```
 * 用户按下 → 等待 0.3 秒 → 触发长按
 *    ↓         ↓               ↓
 * state=0   计时中         state=1 (开始)
 *                             ↓
 *                          执行操作
 *                             ↓
 *                          state=3 (结束)
 * ```
 * 
 * 【使用场景】
 * 1. 🗋️ 弹出菜单：长按按钮显示更多选项
 * 2. 🔍 预览功能：长按预览内容
 * 3. 🔄 模式切换：长按进入编辑模式
 * 4. 🎯 快捷操作：长按触发特定功能
 * 
 * 【参数说明】
 * - minimumPressDuration = 0.3：最小按压时间（秒）
 *   - 0.3 秒是经过优化的时长，既不会误触，又不会太久
 *   - 可以根据需要调整（0.5 秒更保守，0.2 秒更灵敏）
 * 
 * 【扩展属性】（已注释）
 * 注释的代码显示了如何为手势添加自定义属性：
 * - target：存储关联的目标对象
 * - index：存储按钮索引或其他标识
 * 这些属性可以在手势处理方法中通过 gesture.target 访问
 * 
 * 【与其他手势的配合】
 * - 可以与点击手势共存：短按执行主功能，长按显示菜单
 * - 与拖动手势互斥：需要设置手势代理来处理冲突
 * 
 * @param {UIView} view - 要添加长按手势的视图
 * @param {string} selector - 长按触发时调用的方法名
 * @this {pluginDemoController}
 * 
 * @example
 * // 为按钮添加长按菜单
 * this.addLongPressGesture(button, "onLongPressGesture:")
 * 
 * // 处理方法示例
 * onLongPressGesture: function(gesture) {
 *   if (gesture.state === 1) {  // 长按开始
 *     this.showContextMenu(gesture.view)
 *   }
 * }
 */
pluginDemoController.prototype.addLongPressGesture = function (view,selector) {
  let gestureRecognizer = new UILongPressGestureRecognizer(this,selector)
  gestureRecognizer.minimumPressDuration = 0.3  // 设置最小按压时间为 0.3 秒
  
  // 💡 扩展属性示例（当前已注释）
  // 这些代码展示了如何为手势添加自定义数据
  // 在手势处理方法中可以通过 gesture.target 或 gesture.index 访问
  // if (view.target !== undefined) {
  //   gestureRecognizer.target = view.target
  // }
  // if (view.index !== undefined) {
  //   gestureRecognizer.index = view.index
  // }
  
  view.addGestureRecognizer(gestureRecognizer)
}

/**
 * 👆➡️ 添加滑动手势 - 实现快速滑动交互
 * 
 * 【功能说明】
 * 为视图添加滑动（Swipe）手势识别器，检测用户的快速滑动动作。
 * 与拖动手势不同，滑动手势关注的是快速、直线的移动。
 * 
 * 【手势特征】
 * ```
 * 拖动手势 vs 滑动手势：
 * 
 * 拖动（Pan）：慢速 ～～～～> 持续跟踪
 * 滑动（Swipe）：快速 ———→ 一次性触发
 * ```
 * 
 * 【滑动方向】
 * 默认可以识别四个方向：
 * - ⬆️ 向上滑动（UISwipeGestureRecognizerDirectionUp）
 * - ⬇️ 向下滑动（UISwipeGestureRecognizerDirectionDown）
 * - ⬅️ 向左滑动（UISwipeGestureRecognizerDirectionLeft）
 * - ➡️ 向右滑动（UISwipeGestureRecognizerDirectionRight）
 * 
 * 【使用场景】
 * 1. 🔄 切换功能：左右滑动切换工具栏页面
 * 2. ❌ 快速关闭：向上滑动隐藏工具栏
 * 3. 📱 手势导航：滑动返回上一级
 * 4. 🎯 快捷操作：不同方向触发不同功能
 * 
 * 【配置扩展】
 * 虽然这里使用默认配置，但可以扩展：
 * ```javascript
 * gestureRecognizer.direction = 1 << 0  // 只识别向右滑动
 * gestureRecognizer.numberOfTouchesRequired = 2  // 需要两指滑动
 * ```
 * 
 * 【与其他手势的区别】
 * - Pan（拖动）：持续跟踪手指位置，适合精确控制
 * - Swipe（滑动）：只检测快速移动，适合触发动作
 * - Tap（点击）：检测轻触，不关心移动
 * 
 * 【注意事项】
 * - 滑动手势要求一定的速度和直线性
 * - 太慢或路径弯曲会识别失败
 * - 可能与拖动手势冲突，需要合理设计交互
 * 
 * @param {UIView} view - 要添加滑动手势的视图
 * @param {string} selector - 滑动触发时调用的方法名
 * @this {pluginDemoController}
 * 
 * @example
 * // 为工具栏添加滑动隐藏功能
 * this.addSwipeGesture(this.view, "onSwipeGesture:")
 * 
 * // 处理方法示例
 * onSwipeGesture: function(gesture) {
 *   if (gesture.direction === 1 << 2) {  // 向上滑动
 *     this.hide()
 *   }
 * }
 */
pluginDemoController.prototype.addSwipeGesture = function (view,selector) {
  let gestureRecognizer = new UISwipeGestureRecognizer(this,selector)
  view.addGestureRecognizer(gestureRecognizer)
}

/**
 * 📋 创建菜单项 - 快速构建符合 iOS 规范的菜单项对象
 * 
 * 【功能说明】
 * 这是一个便捷的工厂方法，用于创建符合 iOS UITableView 菜单系统要求的菜单项对象。
 * 主要用在弹出菜单、设置列表等需要显示选项列表的场景。
 * 
 * 【iOS 菜单系统背景】
 * 在 iOS 中，菜单通常使用 UITableView 实现，每个菜单项需要包含：
 * - 显示文本（title）
 * - 响应对象（object）  
 * - 响应方法（selector）
 * - 传递参数（param）
 * - 选中状态（checked）
 * 
 * 【使用场景】
 * 1. 🗋️ 右键菜单：创建弹出式选项菜单
 * 2. ⚙️ 设置界面：构建设置选项列表
 * 3. 🎯 动作选择：提供多个操作选项
 * 4. ✅ 状态切换：带选中标记的选项
 * 
 * 【参数说明】
 * @param {string} title - 菜单项显示的文本
 *                        例如："复制"、"粘贴"、"设置颜色"
 * @param {string} selector - 点击菜单项时调用的方法名（Objective-C 选择器）
 *                           必须包含冒号，如 "copyAction:"、"pasteAction:"
 * @param {any} param - 传递给 selector 方法的参数，可以是任意类型
 *                     默认为空字符串，可以传递对象、数字、字符串等
 * @param {boolean} checked - 是否在菜单项前显示选中标记（✓）
 *                           默认 false，true 时显示勾选状态
 * 
 * @returns {{title: string, object: Object, selector: string, param: any, checked: boolean}} 
 *          返回标准的 iOS 菜单项对象
 * 
 * @this {pluginDemoController} - 绑定到当前控制器实例
 * 
 * @example
 * // 创建简单菜单项
 * let copyItem = this.tableItem("复制", "copyAction:")
 * 
 * @example
 * // 创建带参数的菜单项
 * let colorItem = this.tableItem("设置为红色", "setColor:", {color: 11})
 * 
 * @example
 * // 创建带选中状态的菜单项
 * let autoSaveItem = this.tableItem("自动保存", "toggleAutoSave:", "", true)
 * 
 * @example
 * // 在菜单中使用
 * let menuItems = [
 *   this.tableItem("复制", "copy:"),
 *   this.tableItem("粘贴", "paste:"),
 *   this.tableItem("删除", "delete:", noteId)
 * ]
 * MNUtil.getPopoverAndPresent(button, menuItems, 200)
 */
pluginDemoController.prototype.tableItem = function (title,selector,param = "",checked = false) {
  return {title:title,object:this,selector:selector,param:param,checked:checked}
}
/**
 * 📐 设置工具栏框架 - 智能调整工具栏的位置和大小
 * 
 * 【核心功能】
 * 这是工具栏布局系统的核心方法，负责：
 * 1. 🔄 方向适配：根据横向/纵向模式调整尺寸
 * 2. 📏 智能计算：自动计算按钮数量和工具栏大小
 * 3. 🛡️ 边界保护：确保工具栏不超出屏幕范围
 * 4. 💎 订阅限制：未订阅用户的高度限制（420像素）
 * 
 * 【布局计算原理】
 * ```
 * 横向工具栏 (↔️)：
 * [按钮1][按钮2][按钮3]...[按钮N][屏幕按钮]
 * 宽度 = 按钮数量 × 45 + 15
 * 高度 = 40（固定）
 * 
 * 纵向工具栏 (↕️)：
 * [按钮1]
 * [按钮2]
 * [按钮3]
 *   ...
 * [按钮N]
 * [屏幕按钮]
 * 宽度 = 40（固定）
 * 高度 = 按钮数量 × 45 + 15
 * ```
 * 
 * 【参数说明】
 * @param {CGRect} frame - 目标框架位置和大小
 *                        frame.x, frame.y - 位置坐标
 *                        frame.width, frame.height - 尺寸（会被重新计算）
 * @param {boolean} maximize - 是否最大化显示
 *                            true: 根据当前按钮数量计算最大尺寸
 *                            false: 根据传入的尺寸计算按钮数量
 * 
 * 【智能调整策略】
 * 1. **尺寸计算**：
 *    - maximize=true：使用 this.buttonNumber 计算尺寸
 *    - maximize=false：从 frame 尺寸反推按钮数量
 * 
 * 2. **边界检测**：
 *    - 右边界/底边界：自动缩小尺寸避免超出
 *    - 左边界/顶边界：限制最小位置为 0
 * 
 * 3. **订阅限制**：
 *    - 未订阅用户纵向高度限制为 420 像素（约 9 个按钮）
 *    - 横向模式无限制
 * 
 * 【使用场景】
 * 1. 🔄 窗口调整：响应屏幕旋转或分屏变化
 * 2. 📏 手动调整：用户拖动调整工具栏大小
 * 3. 🎯 初始化：设置工具栏初始位置和大小
 * 4. 🔧 刷新布局：更新按钮后重新计算
 * 
 * @this {pluginDemoController}
 * 
 * @example
 * // 设置到指定位置并自动计算大小
 * this.setFrame({x: 100, y: 200, width: 200, height: 200})
 * 
 * @example
 * // 最大化显示当前按钮数量
 * this.setFrame(this.view.frame, true)
 * 
 * 【实现细节】
 * - 按钮尺寸：40×40 像素
 * - 按钮间距：5 像素
 * - 总占用：45 像素/按钮
 * - 屏幕按钮额外空间：15 像素
 */
pluginDemoController.prototype.setFrame = function (frame,maximize = false) {
  let targetFrame = {x:frame.x,y:frame.y}
  if(pluginDemoConfig.horizontal(this.dynamicWindow)){
    // ========== ↔️ 横向工具栏布局 ==========
    let width = Math.max(frame.width,frame.height)  // 取较大值作为宽度
    if (maximize) {
      // 🔢 最大化模式：根据按钮数量计算宽度
      width = 45*this.buttonNumber+15
    }else{
      // 📏 自适应模式：根据宽度计算按钮数量
      this.buttonNumber = Math.floor(width/45)
    }
    // 🛡️ 右边界保护：防止超出屏幕
    if (frame.x + width > MNUtil.studyView.bounds.width) {
      width = MNUtil.studyView.bounds.width - frame.x
    }
    // 🔧 检查最大按钮数量限制
    width = pluginDemoUtils.checkHeight(width,this.maxButtonNumber)
    targetFrame.width = width
    targetFrame.height = 40  // 横向固定高度
    // 📍 位置约束：确保完全在屏幕内
    targetFrame.x = pluginDemoUtils.constrain(targetFrame.x, 0, MNUtil.studyView.bounds.width-width)
    targetFrame.y = pluginDemoUtils.constrain(targetFrame.y, 0, MNUtil.studyView.bounds.height-40)
  }else{
    // ========== ↕️ 纵向工具栏布局 ==========
    targetFrame.width = 40  // 纵向固定宽度
    let height = Math.max(frame.width,frame.height)  // 取较大值作为高度
    if (maximize) {
      // 🔢 最大化模式：根据按钮数量计算高度
      height = 45*this.buttonNumber+15
    }else{
      // 📏 自适应模式：根据高度计算按钮数量
      this.buttonNumber = Math.floor(height/45)
    }
    // 💎 订阅限制：未订阅用户最多 420 像素高度
    if (height > 420 && !pluginDemoUtils.isSubscribed(false)) {
      height = 420
    }
    // 🛡️ 底边界保护：防止超出屏幕
    if (frame.y + height > MNUtil.studyView.bounds.height) {
      height = MNUtil.studyView.bounds.height - frame.y
    }
    // 🔧 检查最大按钮数量限制
    height = pluginDemoUtils.checkHeight(height,this.maxButtonNumber)
    targetFrame.height = height
  }
  // 📐 应用新的框架
  this.view.frame = targetFrame
  this.currentFrame = targetFrame  // 保存当前框架，用于动画等场景
}