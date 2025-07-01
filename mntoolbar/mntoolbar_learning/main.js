/**
 * 🚀 插件工厂函数 - MarginNote 插件系统的入口
 * 
 * 【核心概念】
 * 这是整个插件的起点，当 MarginNote 加载插件时会调用这个函数。
 * 函数名必须是 JSB.newAddon，这是 MarginNote 插件系统的约定。
 * 
 * 【执行流程】
 * ```
 * MarginNote 启动
 *      ↓
 * 扫描插件目录
 *      ↓
 * 发现 .mnaddon 文件
 *      ↓
 * 解压并读取 main.js
 *      ↓
 * 调用 JSB.newAddon(插件路径)  ← 我们在这里
 *      ↓
 * 返回插件类
 *      ↓
 * MarginNote 管理插件生命周期
 * ```
 * 
 * 【参数说明】
 * @param {string} mainPath - 插件的安装路径
 *                           例如：/Users/xxx/Library/Containers/QReader.MarginNoteApp/Data/Library/MarginNote Extensions/MNTask
 *                           这个路径用于：
 *                           1. 加载插件资源（图片、配置文件等）
 *                           2. 存储插件数据
 *                           3. 定位插件文件
 * 
 * @returns {MNTaskClass} 返回插件主类，供 MarginNote 管理
 */
JSB.newAddon = function (mainPath) {
  // 📦 第一步：加载核心工具模块
  // utils.js 包含了工具函数、配置管理等基础功能
  JSB.require('utils')
  
  // 🔍 第二步：检查 MNUtils 插件是否已安装
  // MNUtils 是 MNTask 的依赖，提供了大量的 API
  // 如果未安装，返回 undefined，插件不会被加载
  if (!taskUtils.checkMNUtilsFolder(mainPath)) {return undefined}
  
  // 📦 第三步：加载界面控制器
  JSB.require('webviewController');  // 工具栏主界面控制器
  JSB.require('settingController');   // 设置界面控制器
  
  // 🎯 获取插件类单例的辅助函数
  // 在 JSB 框架中，self 指向类的单例实例
  // 这个函数用于在任何地方获取插件主类的实例
  /** @return {MNTaskClass} */
  const getMNTaskClass = ()=>self  
  /**
   * 📱 定义插件主类 - MNTask
   * 
   * 【类继承说明】
   * MNTask : JSExtension
   * - MNTask: 我们的插件类名
   * - JSExtension: MarginNote 插件基类，提供生命周期方法
   * 
   * 【JSB.defineClass 说明】
   * 这是 JSB 框架定义类的方式，类似于 ES6 的 class，但语法不同：
   * - 第一个参数：类名和继承关系
   * - 第二个参数：实例方法（生命周期方法、事件处理等）
   * - 第三个参数：类方法（静态方法）
   * 
   * 【生命周期概览】
   * ```
   * 插件安装 → addonDidConnect
   *    ↓
   * 打开窗口 → sceneWillConnect     ← 初始化 UI
   *    ↓
   * 打开笔记本 → notebookWillOpen   ← 准备工具栏
   *    ↓
   * 用户使用插件...
   *    ↓
   * 关闭笔记本 → notebookWillClose  ← 保存状态
   *    ↓
   * 关闭窗口 → sceneDidDisconnect   ← 清理资源
   *    ↓
   * 卸载插件 → addonWillDisconnect
   * ```
   */
  var MNTaskClass = JSB.defineClass(
    'MNTask : JSExtension',
    { /* Instance members - 实例方法 */
      /**
       * 🌟 场景即将连接 - 插件生命周期的开始
       * 
       * 【核心概念】
       * Scene（场景）是 iOS 13+ 引入的概念，代表一个应用窗口。
       * 在 MarginNote 中，每个学习窗口就是一个 Scene。
       * 
       * 【调用时机】
       * 1. 打开 MarginNote 应用时
       * 2. 创建新的学习窗口时
       * 3. 从后台恢复应用时
       * 
       * 【主要任务】
       * 1. 检查依赖（MNUtils）
       * 2. 初始化插件实例
       * 3. 设置初始状态
       * 4. 注册事件监听器
       * 
       * 【执行流程图】
       * ```
       * sceneWillConnect
       *      |
       *      ├─ 检查 MNUtils 是否可用
       *      |    └─ 不可用则退出
       *      |
       *      ├─ 初始化插件核心
       *      |    ├─ 获取插件实例 (self)
       *      |    └─ 调用 init() 初始化
       *      |
       *      ├─ 设置应用级别属性
       *      |    ├─ appInstance - 应用实例
       *      |    ├─ isNewWindow - 窗口标记
       *      |    └─ 其他状态变量
       *      |
       *      └─ 注册所有事件监听器
       *           ├─ 笔记菜单事件
       *           ├─ 选择文本事件
       *           ├─ 界面刷新事件
       *           └─ 编辑状态事件
       * ```
       * 
       * @async 异步方法，允许使用 await
       */
      sceneWillConnect: async function () { //Window initialize
        // 🔍 步骤1：检查 MNUtils 插件是否可用
        // checkMNUtil(true) 会显示提示信息告诉用户需要安装 MNUtils
        // 如果检查失败，直接返回，插件不会继续初始化
        if (!(await taskUtils.checkMNUtil(true))) return
        
        // 🎯 步骤2：获取插件类的单例实例
        // 在 JSB 框架中，self 是类的全局实例
        // getMNTaskClass() 函数返回这个实例，供后续使用
        let self = getMNTaskClass()
        
        // 🚀 步骤3：初始化插件核心功能
        // init() 方法会：
        // - 初始化工具类 (taskUtils)
        // - 初始化配置管理器 (taskConfig)
        // - 设置 initialized 标志为 true
        self.init(mainPath)
        // 🔧 步骤4：设置应用实例和初始状态变量
        
        // 获取 MarginNote 应用的共享实例
        // 这个实例用于访问应用级别的功能和状态
        self.appInstance = Application.sharedInstance();
        
        // 窗口状态标记：是否是新创建的窗口
        self.isNewWindow = false;
        
        // 监视模式标记：用于特定的监控功能
        self.watchMode = false;
        
        // 文本选择相关状态
        self.textSelected = ""      // 当前选中的文本内容
        self.textProcessed = false;  // 文本是否已处理的标记
        
        // 时间戳记录
        self.dateGetText = Date.now();  // 获取文本的时间
        self.dateNow = Date.now();      // 当前时间
        
        // 弹出菜单的位置和箭头方向
        self.rect = '{{0, 0}, {10, 10}}';  // 初始矩形区域
        self.arrow = 1;                     // 箭头方向（1=向上）

        
        // 📡 步骤5：注册事件监听器（观察者模式）
        // MNUtil.addObserver 的参数说明：
        // - self: 观察者对象（插件实例）
        // - 'onXXX:': 当事件触发时调用的方法名
        // - 'XXX': 要监听的通知名称
        
        // 📝 笔记相关事件
        // 当用户点击笔记卡片，弹出菜单时触发
        MNUtil.addObserver(self, 'onPopupMenuOnNote:', 'PopupMenuOnNote')
        
        // 当用户选择文本，弹出菜单时触发
        MNUtil.addObserver(self, 'onPopupMenuOnSelection:', 'PopupMenuOnSelection')
        
        // 当选择文本的弹出菜单关闭时触发
        MNUtil.addObserver(self, 'onClosePopupMenuOnSelection:', 'ClosePopupMenuOnSelection')
        
        // 🔄 工具栏控制事件
        // 切换动态/固定模式
        MNUtil.addObserver(self, 'onToggleDynamic:', 'toggleDynamic')
        
        // 当笔记弹出菜单关闭时触发
        MNUtil.addObserver(self, 'onClosePopupMenuOnNote:', 'ClosePopupMenuOnNote')
        
        // 🎨 界面更新事件
        // 刷新视图
        MNUtil.addObserver(self, 'onRefreshView:', 'refreshView')
        
        // 切换脑图工具栏显示/隐藏
        MNUtil.addObserver(self, 'onToggleMindmapTask:', 'toggleMindmapTask')
        
        // 刷新工具栏按钮
        MNUtil.addObserver(self, 'onRefreshTaskButton:', 'refreshTaskButton')
        
        // ⚙️ 设置相关事件
        // 打开工具栏设置界面
        MNUtil.addObserver(self, 'onOpenTaskSetting:', 'openTaskSetting')
        
        // 接收新的图标图片（用于自定义按钮图标）
        MNUtil.addObserver(self, 'onNewIconImage:', 'newIconImage')
        
        // ✏️ 文本编辑事件
        // 文本开始编辑（系统通知）
        MNUtil.addObserver(self, 'onTextDidBeginEditing:', 'UITextViewTextDidBeginEditingNotification')
        
        // 文本结束编辑（系统通知）
        MNUtil.addObserver(self, 'onTextDidEndEditing:', 'UITextViewTextDidEndEditingNotification')
        
        // ☁️ iCloud 同步事件
        // iCloud 配置发生变化时触发
        MNUtil.addObserver(self, 'onCloudConfigChange:', 'NSUbiquitousKeyValueStoreDidChangeExternallyNotificationUI')
      },

      /**
       * 🌅 场景已断开连接 - 清理资源和保存状态
       * 
       * 【调用时机】
       * 1. 用户在插件管理页面关闭插件（非删除）
       * 2. 关闭 MarginNote 窗口
       * 3. 应用进入后台时（某些情况下）
       * 
       * 【重要任务】
       * 1. 🧪 移除所有事件监听器（防止内存泄漏）
       * 2. 💾 保存当前状态（下次恢复用）
       * 3. 🗑️ 释放资源（视图、控制器等）
       * 
       * 【注意事项】
       * - 这不是卸载插件，只是暂时关闭
       * - 用户可能会重新打开插件
       * - 需要保存必要的状态以便恢复
       * 
       * 【执行流程】
       * ```
       * sceneDidDisconnect
       *      |
       *      ├─ 检查 MNUtil 是否存在
       *      |    └─ 不存在则直接返回
       *      |
       *      └─ 移除所有监听器
       *           ├─ PopupMenuOnNote
       *           ├─ toggleDynamic
       *           ├─ ClosePopupMenuOnNote
       *           ├─ UITextView 相关
       *           └─ 其他事件
       * ```
       */
      sceneDidDisconnect: function () { // Window disconnect 在插件页面关闭插件（不是删除）
        // 🔍 首先检查 MNUtil 是否存在
        // 在某些异常情况下，MNUtil 可能已经被卸载
        if (typeof MNUtil === 'undefined') return
        
        // 📡 移除所有事件监听器
        // 这是非常重要的步骤，防止内存泄漏和异常行为
        // 每个 addObserver 都应该有对应的 removeObserver
        
        // 笔记菜单相关
        MNUtil.removeObserver(self,'PopupMenuOnNote')
        MNUtil.removeObserver(self,'ClosePopupMenuOnNote')
        MNUtil.removeObserver(self,'ClosePopupMenuOnSelection')
        
        // 工具栏控制相关
        MNUtil.removeObserver(self,'toggleDynamic')
        MNUtil.removeObserver(self,'refreshTaskButton')
        MNUtil.removeObserver(self,'openTaskSetting')
        
        // 文本编辑相关
        MNUtil.removeObserver(self,'UITextViewTextDidBeginEditingNotification')
        MNUtil.removeObserver(self,'UITextViewTextDidEndEditingNotification')
        
        // iCloud 同步相关
        MNUtil.removeObserver(self,'NSUbiquitousKeyValueStoreDidChangeExternallyNotificationUI')
      },

      /**
       * 📱 场景即将失去活跃状态
       * 
       * 【调用时机】
       * - 应用进入后台
       * - 切换到其他应用
       * - 系统弹窗覆盖（如来电）
       * 
       * 【常见用途】
       * - 暂停动画或定时器
       * - 保存临时状态
       * - 释放不必要的资源
       */
      sceneWillResignActive: function () { // Window resign active
      },

      /**
       * 🌟 场景已变为活跃状态
       * 
       * 【调用时机】
       * - 应用从后台返回前台
       * - 从其他应用切换回来
       * - 系统弹窗消失后
       * 
       * 【常见用途】
       * - 恢复动画或定时器
       * - 刷新界面内容
       * - 检查并更新数据
       */
      sceneDidBecomeActive: function () { // Window become active
      },

      /**
       * 📚 笔记本即将打开 - 准备工具栏界面
       * 
       * 【核心概念】
       * 这是用户开始真正使用插件的时刻。当用户打开一个笔记本（学习集）时，
       * 插件需要创建并显示工具栏界面。
       * 
       * 【调用时机】
       * - 用户打开笔记本
       * - 切换到不同的笔记本
       * - 从文档模式切换到学习模式
       * 
       * 【主要任务】
       * 1. 再次检查 MNUtils（确保可用）
       * 2. 检查学习模式（仅在特定模式下显示）
       * 3. 创建工具栏控制器
       * 4. 初始化配置和状态
       * 5. 处理键盘相关设置
       * 
       * 【执行流程】
       * ```
       * notebookWillOpen(notebookid)
       *      |
       *      ├─ 检查 MNUtils（0.1秒延迟）
       *      |
       *      ├─ 检查学习模式
       *      │   └─ studyMode < 3 才继续
       *      |
       *      ├─ 初始化插件实例
       *      │   ├─ 获取 self 实例
       *      │   └─ 调用 init()
       *      |
       *      ├─ 创建工具栏视图
       *      │   ├─ 延迟 0.5 秒
       *      │   └─ ensureView(true)
       *      |
       *      ├─ 设置工具栏属性
       *      │   ├─ dynamic 模式
       *      │   └─ notebookid
       *      |
       *      └─ 处理键盘
       *          └─ 0.2秒后关闭键盘
       * ```
       * 
       * @param {string} notebookid - 打开的笔记本ID
       * @async
       */
      notebookWillOpen: async function (notebookid) {
        // 🔍 步骤1：检查 MNUtils 是否可用
        // 第二个参数 0.1 表示延迟 0.1 秒再检查
        // 这个延迟给系统一些时间来完成初始化
        if (!(await taskUtils.checkMNUtil(true,0.1))) return
        
        // 📖 步骤2：检查学习模式
        // MNUtil.studyMode 的值：
        // 0 = 文档模式
        // 1 = 学习模式（文档+脑图）
        // 2 = 复习模式
        // 3 = 其他模式
        // 只在模式 0、1、2 中显示工具栏
        if (MNUtil.studyMode < 3) {
          // 🎯 步骤3：获取插件实例并初始化
          let self = getMNTaskClass()
          self.init(mainPath)  // 确保插件核心已初始化
          
          // ⏱️ 步骤4：延迟创建视图
          // 延迟 0.5 秒，确保笔记本界面完全加载
          await MNUtil.delay(0.5)
          
          // 🖼️ 步骤5：确保工具栏视图存在
          // ensureView(true) 会：
          // - 创建 addonController（如果不存在）
          // - 添加视图到 studyView
          // - 刷新插件命令（true 参数）
          self.ensureView(true)
          
          // 🔄 步骤6：刷新插件命令菜单
          // 这会更新 MarginNote 的插件菜单项
          MNUtil.refreshAddonCommands();
          
          // ⚙️ 步骤7：设置工具栏控制器属性
          self.addonController.dynamic = taskConfig.dynamic      // 动态/固定模式
          self.addonController.notebookid = notebookid             // 当前笔记本ID
          
          // 💾 步骤8：保存笔记本ID到多个位置
          // 这样在不同的地方都能访问到当前笔记本ID
          self.notebookid = notebookid              // 插件实例
          taskUtils.notebookId = notebookid      // 工具类
          
          // ☁️ 步骤9：检查 iCloud 存储
          // 如果启用了 iCloud 同步，读取云端配置
          taskConfig.checkCloudStore()
        }
        
        // ⌨️ 步骤10：处理 iOS 键盘
        // 延迟 0.2 秒后让 studyView 成为第一响应者
        // 这会自动关闭任何打开的键盘
        MNUtil.delay(0.2).then(()=>{
          MNUtil.studyView.becomeFirstResponder(); //For dismiss keyboard on iOS
        })
          
      },

      /**
       * 📚 笔记本即将关闭 - 保存状态和清理资源
       * 
       * 【调用时机】
       * - 用户关闭笔记本
       * - 切换到其他笔记本
       * - 退出学习模式
       * 
       * 【主要任务】
       * 1. 💾 保存工具栏位置和状态
       * 2. 👁️ 隐藏相关视图
       * 3. 📋 记录最终状态
       * 
       * @param {string} notebookid - 关闭的笔记本ID
       */
      notebookWillClose: function (notebookid) {
        // 🔍 检查 MNUtil 是否存在
        if (typeof MNUtil === 'undefined') return
        
        // 💾 步骤1：保存工具栏当前位置
        // lastFrame 用于下次打开时恢复位置
        self.lastFrame = self.addonController.view.frame
        
        // 👁️ 步骤2：隐藏动态工具栏
        // testController 是动态模式下的浮动工具栏
        if (self.testController) {
          self.testController.view.hidden = true
        }
        
        // ⚙️ 步骤3：隐藏设置界面
        // 如果设置界面正在显示，关闭它
        if (self.addonController.settingController) {
          self.addonController.settingController.hide()
        }
        
        // 📋 步骤4：保存窗口状态到配置
        // open: 工具栏是否显示（通过 hidden 属性的反值判断）
        // frame: 工具栏的位置和大小
        taskConfig.windowState.open  = !self.addonController.view.hidden
        taskConfig.windowState.frame = self.addonController.view.frame
        
        // 💾 步骤5：持久化保存到本地
        // "MNTask_windowState" 是存储的键名
        taskConfig.save("MNTask_windowState")
      },
      /**
       * 📝 选择文本弹出菜单事件 - 处理文本选择后的工具栏显示
       * 
       * 【触发场景】
       * 用户在文档中选择文本后，MarginNote 会弹出一个浮动菜单，
       * 包含“高亮”、“下划线”、“复制”等选项。这个事件在菜单弹出时触发。
       * 
       * 【主要功能】
       * 1. 🔄 替换系统菜单按钮（根据配置）
       * 2. 🌟 在动态模式下显示浮动工具栏
       * 3. 📍 计算工具栏显示位置
       * 
       * 【执行流程】
       * ```
       * onPopupMenuOnSelection(sender)
       *      |
       *      ├─ 检查是否当前窗口
       *      |
       *      ├─ 处理设置界面焦点
       *      |
       *      ├─ 替换弹出菜单按钮
       *      |
       *      ├─ 检查动态模式
       *      │   └─ 不是动态模式则返回
       *      |
       *      ├─ 创建/更新动态工具栏
       *      |
       *      ├─ 计算显示位置
       *      │   ├─ 获取菜单位置
       *      │   └─ 根据箭头方向调整
       *      |
       *      └─ 显示工具栏动画
       * ```
       * 
       * @param {Object} sender - 事件发送者
       * @async
       */
      onPopupMenuOnSelection: async function (sender) { // Clicking note
        // 🔍 步骤1：检查 MNUtil 是否存在
        if (typeof MNUtil === 'undefined') return
        
        // 🎯 步骤2：获取插件实例
        let self = getMNTaskClass()
        
        // 🪟 步骤3：检查是否是当前窗口的事件
        // 在多窗口场景下，确保只响应当前窗口的事件
        if (self.window !== MNUtil.currentWindow) {
          return
        }
        
        // 💱 步骤4：处理设置界面的焦点
        // 如果设置界面正在显示，延迟 0.01 秒后失去焦点
        // 这样可以避免输入框和弹出菜单的冲突
        if (self.settingController) {
            MNUtil.delay(0.01).then(()=>{
              self.settingController.blur()
            })
        }
        
        // 🔄 步骤5：替换弹出菜单中的按钮
        // popupReplace() 会根据配置替换系统菜单中的某些按钮
        // 例如：把“链接”按钮替换成自定义功能
        self.addonController.popupReplace()

        // 🌟 步骤6：检查动态模式
        // 只有在动态模式下才显示浮动工具栏
        // 固定模式下工具栏始终显示，不需要额外处理
        if (!taskConfig.dynamic) {
          return
        }
        
        // 🛡️ 开始处理动态工具栏显示逻辑
        try {
          

        // 📍 步骤7：创建或更新动态工具栏
        let lastFrame 
        
        if (!self.testController) {
          // 🆕 首次创建动态工具栏
          self.testController = taskController.new();
          
          // 设置动态工具栏属性
          self.testController.dynamicWindow = true              // 标记为动态窗口
          self.testController.mainPath = mainPath;              // 插件路径
          self.testController.dynamic = taskConfig.dynamic   // 动态模式配置
          self.testController.view.hidden = true                // 初始隐藏
          
          // 设置关联关系
          self.testController.addonController = self.addonController      // 关联主控制器
          self.addonController.dynamicTask = self.testController       // 反向关联
          
          // 添加到学习视图
          MNUtil.studyView.addSubview(self.testController.view);
          
          // 使用主工具栏的位置作为初始位置
          lastFrame = self.addonController.view.frame
        }else{
          // 🔄 工具栏已存在，刷新它
          self.testController.refresh()
          
          // 使用动态工具栏自己的位置
          lastFrame = self.testController.view.frame
        }
        // 👀 步骤8：竖向工具栏的特殊处理
        // 这里有个小细节：如果工具栏是竖着的（就像手机侧边的音量键）
        // 在选择文本时就不显示动态工具栏了
        // 为啥？因为竖着的工具栏和文本选择菜单会打架！
        if (taskConfig.vertical(true)){
          self.testController.view.hidden = true
          return
        }
        // 🛠️ 步骤9：设置一些状态和变量
        self.testController.onClick = false         // 标记：用户还没点击过
        self.onPopupMenuOnNoteTime = Date.now()     // 记住现在的时间，后面要用
        let yOffset = 0                             // Y轴偏移量，用来调整位置
        
        // ⏳ 等一下！等 0.01 秒
        // 为啥要等？因为系统需要一点点时间来创建菜单
        // 就像你点外卖 APP，得等页面加载完才能看到菜单
        await MNUtil.delay(0.01)
        
        // 🍳 获取当前的弹出菜单
        let menu = PopupMenu.currentMenu()
        let menuFrame = menu.frame  // 菜单的位置和大小
        // 🎯 步骤10：根据菜单箭头方向调整位置
        // 弹出菜单有个小箭头，指向你选中的文字
        // 箭头可能在上、下、左、右，我们要根据这个来调整工具栏位置
        switch (menu.arrowDirection) {
          case 0:           // 箭头在上面 ↑
            yOffset = 45    // 工具栏要往下移 45 像素
            break;
          case 1:           // 箭头在下面 ↓
            yOffset = -50   // 工具栏要往上移 50 像素
            break;
          case 2:           // 箭头在左边 ←
            yOffset = 45    // 也往下移一点
            break;
          default:          // 其他情况（不常见）
            MNUtil.showHUD("箭头方向: "+menu.arrowDirection)
            break;
        }
        // 📍 步骤11：计算工具栏的最终位置
        lastFrame.y = menuFrame.y - yOffset   // 菜单位置 减去 偏移量 = 工具栏 Y 坐标
        lastFrame.x = menuFrame.x             // X 坐标直接用菜单的
        
        // 给工具栏起个短名，方便使用
        let testController = self.testController
        
        // 🙅 步骤12：检查是不是“不要显示”的情况
        // 有时候用户快速操作，我们要避免工具栏闪来闪去
        // 如果刚刚关闭了菜单（500毫秒内），就不显示了
        if (self.notShow && 
            Date.now()-self.onClosePopupMenuOnNoteTime > 0 && 
            Date.now()-self.onClosePopupMenuOnNoteTime < 500) {
          return  // 不显示，直接走人
        }
        // ✨ 步骤13：显示工具栏（带动画效果！）
        if (testController.view.hidden) {
          // 🎆 情况1：工具栏现在是隐藏的，要让它华丽登场！
          
          // 1. 把工具栏移到最前面（就像把卡片放到牌堆最上面）
          MNUtil.studyView.bringSubviewToFront(testController.view)
          
          // 2. 刷新位置和大小
          testController.refresh(lastFrame)
          
          // 3. 先设置透明（看不见）
          testController.view.layer.opacity = 0
          
          // 4. 取消隐藏状态
          testController.view.hidden = false
          testController.screenButton.hidden = false
          
          // 5. 来个淡入动画！从透明到不透明
          await MNUtil.animate(()=>{
            testController.view.layer.opacity = 1.0  // 慢慢变成完全不透明
          })
          
          // 6. 重新排列按钮
          testController.setTaskLayout()
          
        }else{
          // 🔄 情况2：工具栏已经显示了，只需要移动位置
          
          self.onAnimate = true  // 标记：正在播放动画
          
          // 移到最前面
          MNUtil.studyView.bringSubviewToFront(testController.view)
          
          // 平滑移动到新位置
          MNUtil.animate(()=>{
            testController.refresh(lastFrame)
            testController.view.hidden = false
            testController.screenButton.hidden = false
          }).then(()=>{
            // 动画完成后
            testController.view.hidden = false
            self.onAnimate = false  // 标记：动画结束
          })
        }
        } catch (error) {
          // 😨 如果出错了，记录下来
          // 这样我们就知道哪里出问题了
          taskUtils.addErrorLog(error, "onPopupMenuOnSelection")
        }
      },
      /**
       * 🚪 选择文本的菜单关闭了 - 决定是否隐藏工具栏
       * 
       * 【什么时候触发？】
       * 当你选中文本后弹出的菜单消失时，比如：
       * - 点击了菜单中的某个选项
       * - 点击了菜单外面的区域
       * - 按了 ESC 键
       * 
       * 【主要任务】
       * 决定动态工具栏是否该隐藏。就像你家的客人走了，
       * 你要决定是否关门一样。
       * 
       * @param {Object} sender - 事件发送者
       */
      onClosePopupMenuOnSelection: async function (sender) {
        // 🔍 还是先检查一下 MNUtil 有没有
        if (typeof MNUtil === 'undefined') return
        
        try {
          

        // ⏰ 记录关闭菜单的时间
        self.onClosePopupMenuOnNoteTime = Date.now()
        
        // 🤔 判断：是不是同一个笔记，而且时间很短？
        // 如果是同一个笔记，而且从打开到关闭不到 0.5 秒
        // 这通常意味着用户只是误点了一下，或者快速操作
        if (self.noteid === sender.userInfo.noteid && 
            Date.now()-self.onPopupMenuOnNoteTime < 500) {
          self.notShow = true  // 标记：下次不要显示工具栏
        }
        // 🎭 决定是否隐藏工具栏
        // 条件：
        // 1. 关闭时间 比 打开时间 晚 250 毫秒以上（说明不是误点）
        // 2. 用户没有点击过工具栏按钮
        if (self.onClosePopupMenuOnNoteTime > self.onPopupMenuOnNoteTime + 250 && 
            !self.testController.onClick) {
          
          // 保存当前透明度
          let preOpacity = self.testController.view.layer.opacity
          
          // 如果正在播放动画，就不要打断了
          if (self.onAnimate) {
            MNUtil.showHUD("正在播放动画")
            return
          }
          
          // 🎆 淡出动画：0.1秒内变透明
          MNUtil.animate(()=>{
            self.testController.view.layer.opacity = 0
          }, 0.1).then(()=>{
            // 动画完成后
            self.testController.view.layer.opacity = preOpacity  // 恢复透明度
            self.testController.view.hidden = true               // 真正隐藏
          })
          return
        }
        } catch (error) {
          // 😵 哎呀，出错了！
          taskUtils.addErrorLog(error, "onClosePopupMenuOnSelection")
        }
      },
      /**
       * 📄 点击笔记卡片弹出菜单 - 显示动态工具栏
       * 
       * 【什么时候触发？】
       * 当你在脑图中点击一个笔记卡片时，MarginNote 会弹出一个菜单，
       * 里面有“合并”、“删除”、“复制”等选项。这个事件在菜单弹出时触发。
       * 
       * 【核心功能】
       * 1. 🔄 替换系统菜单中的某些按钮（根据配置）
       * 2. 🌟 在动态模式下，显示浮动工具栏
       * 3. 📍 智能计算工具栏位置，避免遮挡卡片
       * 
       * 【实现思路】
       * 这个方法和 onPopupMenuOnSelection 很像，但它处理的是笔记卡片，
       * 而不是选中的文本。主要区别在于位置计算的逻辑不同。
       * 
       * @param {Object} sender - 事件发送者，包含笔记信息
       * @async
       */
      onPopupMenuOnNote: async function (sender) { // Clicking note
        // 🔍 步骤1：基本检查
        if (typeof MNUtil === 'undefined') return
        
        // 🎯 步骤2：获取插件实例
        let self = getMNTaskClass()
        
        // 🪟 步骤3：检查是否是当前窗口的事件
        if (self.window !== MNUtil.currentWindow) {
          return
        }
        
        try {
          // 🔄 步骤4：替换弹出菜单中的按钮
          // 比如把“链接”按钮换成你的自定义功能
          self.addonController.popupReplace()
          
          // 💱 步骤5：处理设置界面的焦点
          if (self.settingController) {
            MNUtil.delay(0.01).then(()=>{
              self.settingController.blur()  // 让设置界面失去焦点
              
              // 📝 下面这些被注释的代码是尝试不同的失焦方法
              // self.settingController.webviewInput.resignFirstResponder()  // 让输入框失焦
              // MNUtil.studyView.becomeFirstResponder()                     // 让学习视图获得焦点
              // MNUtil.currentWindow.becomeFirstResponder()                 // 让当前窗口获得焦点
              // MNUtil.mindmapView.becomeFirstResponder()                   // 让脑图视图获得焦点
            })
          }

        // 🌟 步骤6：检查是否开启了动态模式
        if (!taskConfig.dynamic) {
          return  // 没开动态模式就不显示浮动工具栏
        }
        
        // ⏰ 记录弹出菜单的时间（后面要用）
        self.onPopupMenuOnNoteTime = Date.now()
        
        // 📍 步骤7：创建或获取动态工具栏
        let lastFrame 
        
        if (!self.testController) {
          // 🆕 第一次创建动态工具栏
          // 就像买了一个新的遥控器，需要初始化设置
          
          self.testController = taskController.new();           // 创建新的工具栏控制器
          self.testController.dynamicWindow = true                 // 告诉它：你是动态的！
          self.testController.mainPath = mainPath;                 // 设置插件路径
          self.testController.dynamic = taskConfig.dynamic      // 同步动态模式配置
          self.testController.view.hidden = true                   // 先隐藏起来
          
          // 建立关系：主工具栏 ⇄ 动态工具栏
          self.testController.addonController = self.addonController      // 动态→主
          self.addonController.dynamicTask = self.testController       // 主→动态
          
          // 把动态工具栏添加到学习视图上
          MNUtil.studyView.addSubview(self.testController.view);
          
          // 使用主工具栏的位置作为参考
          lastFrame = self.addonController.view.frame
        }else{
          // 🔄 动态工具栏已经存在，直接用
          lastFrame = self.testController.view.frame
        }
        
        // 📝 步骤8：保存当前笔记的信息
        self.noteid = sender.userInfo.note.noteId                    // 记住哪个笔记触发的
        taskUtils.currentNoteId = sender.userInfo.note.noteId     // 全局也保存一份
        self.notShow = false                                         // 重置"不显示"标记
        
        // 📐 步骤9：获取笔记卡片的位置信息
        // winRect 是笔记卡片在屏幕上的矩形区域
        let winRect = MNUtil.parseWinRect(sender.userInfo.winRect)
        
        // 🖼️ 步骤10：检查文档/脑图的分屏模式
        // MarginNote 支持三种模式：
        // 0: 只显示脑图
        // 1: 文档和脑图并排显示
        // 2: 只显示文档
        let docMapSplitMode = MNUtil.studyController.docMapSplitMode
        
        // 🚫 步骤11：智能隐藏逻辑（仅在竖向工具栏时）
        // 为什么要这么做？
        // 当笔记卡片在文档那一侧时，显示竖向工具栏会很奇怪
        if (taskConfig.vertical(true) && winRect.height <=11 && winRect.width <=11) {
          switch (docMapSplitMode) {
            case 1:  // 📏 文档和脑图并排显示的情况
              // 获取分割线的位置（文档和脑图的分界线）
              let splitLine = MNUtil.splitLine
              
              // 检查脑图是在左边还是右边
              if (MNUtil.studyController.rightMapMode) {
                // 🎯 脑图在右边的情况
                if (winRect.x < splitLine) {
                  // 笔记在左边（文档区域），隐藏工具栏
                  self.testController.view.hidden = true
                  return
                }
              }else{
                // 🎯 脑图在左边的情况
                if (winRect.x > splitLine) {
                  // 笔记在右边（文档区域），隐藏工具栏
                  self.testController.view.hidden = true
                  return
                }
              }
              break;
            case 2:  // 📃 只显示文档，没有脑图
              // 这种情况下肯定不需要显示工具栏
              self.testController.view.hidden = true
              return
            default:  // 🗺️ 只显示脑图（case 0）
              // 继续正常显示工具栏
              break;
          }
        }
        
        // 📏 步骤12：获取学习视图的尺寸信息
        let studyFrame = MNUtil.studyView.frame          // 整个学习区域的框架
        let studyFrameX = studyFrame.x                   // 学习区域的 X 坐标
        let studyHeight = studyFrame.height              // 学习区域的高度
        
        // 🎮 步骤13：重置点击状态
        self.testController.onClick = false               // 标记还没有点击过
        
        // 🧭 步骤14：计算工具栏的位置
        if (taskConfig.horizontal(true)) {
          // 🔄 横向工具栏的位置计算
          let yOffset  // Y 轴偏移量
          
          // 稍微等一下，让弹出菜单完全显示
          await MNUtil.delay(0.01)
          
          // 获取当前的弹出菜单
          let menu = PopupMenu.currentMenu()
          if (!menu) {
            return  // 没找到菜单就算了
          }
          
          let menuFrame = menu.frame
          
          // 🎯 根据菜单箭头方向调整位置
          // 箭头方向决定了菜单相对于笔记的位置
          switch (menu.arrowDirection) {
            case 0:  // ⬆️ 箭头向上（菜单在笔记下方）
              yOffset = 45
              break;
            case 1:  // ⬇️ 箭头向下（菜单在笔记上方）
              yOffset = -50
              break;
            case 2:  // ➡️ 箭头向右（菜单在笔记左侧）
              yOffset = 45
              break;
            default:
              break;
          }
          lastFrame.y = menuFrame.y - yOffset  // 相对于菜单调整 Y 坐标
          lastFrame.x = menuFrame.x            // X 坐标跟随菜单
        }else{
          // 📍 竖向工具栏的位置计算
          // 计算逻辑更复杂，需要考虑边界情况
          
          // 📌 X 轴位置计算
          if (winRect.x - 43 < 0) {
            // 太靠左了，放在笔记右边
            lastFrame.x = winRect.x + winRect.width - studyFrameX
          }else{
            // 正常情况，放在笔记左边（留 43 像素间距）
            lastFrame.x = winRect.x - 43 - studyFrameX
          }
          
          // 📌 Y 轴位置计算
          if (winRect.y - 15 < 0) {
            // 太靠上了，贴着顶部
            lastFrame.y = 0
          }else{
            // 正常情况，比笔记高一点（上移 25 像素）
            lastFrame.y = winRect.y - 25
          }
          
          // 📌 防止工具栏超出底部
          if (winRect.y + lastFrame.height > studyHeight) {
            // 调整位置，确保完全显示
            lastFrame.y = studyHeight - lastFrame.height
          }
        }

        // 🎬 步骤15：准备显示动画
        let testController = self.testController  // 简化变量名
        
        // 🚫 检查是否需要显示
        if (self.notShow) {
          // 用户可能快速关闭了菜单，不需要显示了
          return
        }

        // 🎨 步骤16：显示工具栏（带动画效果）
        if (testController.view.hidden) {
          // 🌟 情况1：工具栏是隐藏的，需要淡入显示
          
          // 如果正在播放其他动画，标记不要隐藏
          if (testController.onAnimate) {
            testController.notHide = true
          }
          
          self.onAnimate = true  // 标记：正在播放动画
          
          // 把工具栏移到最前面（不被其他视图遮挡）
          MNUtil.studyView.bringSubviewToFront(testController.view)
          
          // 设置新位置并刷新内容
          testController.refresh(lastFrame)
          
          // 准备淡入效果：先设为完全透明
          testController.view.layer.opacity = 0
          testController.view.hidden = false
          testController.screenButton.hidden = false
          
          // 🎆 执行淡入动画（从透明到不透明）
          await MNUtil.animate(()=>{
            testController.view.layer.opacity = 1.0
          })
          
          // 动画完成后的收尾工作
          testController.view.hidden = false    // 确保真的显示了
          self.onAnimate = false                // 标记：动画结束了
          testController.setTaskLayout()     // 设置工具栏布局
        }else{
          // 🔄 情况2：工具栏已经显示，只需要调整位置
          
          // 把工具栏移到最前面
          MNUtil.studyView.bringSubviewToFront(testController.view)
          
          // 🎯 动画移动到新位置
          MNUtil.animate(()=>{
            testController.refresh(lastFrame)
            testController.view.hidden = false
            testController.screenButton.hidden = false
          }).then(()=>{
            // 确保动画后还是显示状态
            testController.view.hidden = false
          })
        }
        } catch (error) {
          // 😵 出错了！记录错误信息
          taskUtils.addErrorLog(error, "onPopupMenuOnNote")
        }
      },
      
      /**
       * 🚪 笔记菜单关闭事件 - 决定是否隐藏动态工具栏
       * 
       * 【触发时机】
       * 当点击笔记卡片弹出的菜单关闭时触发。
       * 
       * 【主要功能】
       * 和 onClosePopupMenuOnSelection 类似，根据时间判断是否要隐藏工具栏。
       * 如果用户只是快速点击（误操作），就不隐藏工具栏。
       * 
       * @param {Object} sender - 事件发送者
       * @async
       */
      onClosePopupMenuOnNote: async function (sender) {
        // 🔍 基本检查
        if (typeof MNUtil === 'undefined') return
        // await MNUtil.delay(0.1)
        // ⏰ 记录关闭菜单的时间
        self.onClosePopupMenuOnNoteTime = Date.now()
        
        // 🤔 判断：是不是同一个笔记，而且时间很短？
        // 如果是同一个笔记，而且从打开到关闭不到 0.5 秒
        // 这通常意味着用户只是误点了一下，或者快速操作
        if (self.noteid === sender.userInfo.noteid && 
            Date.now()-self.onPopupMenuOnNoteTime < 500) {
          self.notShow = true  // 标记：下次不要显示工具栏
        }
        
        // 🎭 决定是否隐藏工具栏
        // 条件：
        // 1. 关闭时间 比 打开时间 晚 250 毫秒以上（说明不是误点）
        // 2. 用户没有点击过工具栏按钮
        if (self.onClosePopupMenuOnNoteTime > self.onPopupMenuOnNoteTime + 250 && 
            !self.testController.onClick) {
          
          // 保存当前透明度
          let preOpacity = self.testController.view.layer.opacity
          
          // 如果正在播放动画，就不要打断了
          if (self.onAnimate) {
            return
          }
          
          self.onAnimate = true  // 标记：开始播放动画
          
          // 🎆 淡出动画：0.1秒内变透明
          MNUtil.animate(()=>{
            self.testController.view.layer.opacity = 0
          }, 0.1).then(()=>{
            // 动画完成后
            self.testController.view.layer.opacity = preOpacity  // 恢复透明度
            self.onAnimate = false                               // 标记：动画结束
            self.testController.view.hidden = true               // 真正隐藏
          })
          return
        }
      },
      
      /**
       * 📄 文档打开事件
       * 
       * 【触发时机】
       * 当用户在 MarginNote 中打开一个新文档（PDF/EPUB）时触发。
       * 
       * 【参数说明】
       * @param {string} docmd5 - 文档的 MD5 标识符
       * 
       * 【注意】
       * 目前这个方法是空的，但你可以在这里添加文档相关的初始化逻辑。
       */
      documentDidOpen: function (docmd5) {
        // 可以在这里添加文档打开时的处理逻辑
        // 比如：记录文档信息、调整工具栏等
      },

      /**
       * 📄 文档即将关闭事件
       * 
       * 【触发时机】
       * 当用户关闭文档时，在文档真正关闭前触发。
       * 
       * 【参数说明】
       * @param {string} docmd5 - 即将关闭的文档的 MD5 标识符
       * 
       * 【使用场景】
       * - 保存文档相关的设置
       * - 清理文档相关的缓存
       * - 提醒用户保存未完成的工作
       */
      documentWillClose: function (docmd5) {
        // 可以在这里添加文档关闭前的清理逻辑
      },

      /**
       * 🎨 控制器即将布局子视图 - 调整工具栏位置和大小
       * 
       * 【触发时机】
       * 当视图需要重新布局时触发，比如：
       * - 窗口大小改变
       * - 分屏模式切换
       * - 设备旋转（iPad）
       * 
       * 【主要功能】
       * 根据当前的布局情况，智能调整工具栏的位置和大小，
       * 确保工具栏始终在合适的位置，不遮挡重要内容。
       * 
       * @param {UIViewController} controller - 触发布局的控制器
       */
      controllerWillLayoutSubviews: function (controller) {
        // 🔍 步骤1：基本检查
        if (typeof MNUtil === 'undefined') return
        
        // 🎯 步骤2：只处理学习控制器的布局
        // 为什么要这个判断？MarginNote 中有很多控制器，
        // 我们只关心学习界面（studyController）的布局变化
        if (controller !== MNUtil.studyController) {
          return;
        };
        
        // 📏 步骤3：调整主工具栏的布局
        if (!self.addonController.view.hidden) {
          // 工具栏是显示状态，需要调整位置
          
          // 🚫 如果正在动画或调整大小中，就不要打断
          if (self.addonController.onAnimate || self.addonController.onResize) {
            // 等动画完成后再说
          }else{
            // 🔄 根据工具栏方向进行不同的调整
            if (taskConfig.horizontal()) {
              // 📐 横向工具栏的调整逻辑
              let currentFrame = self.addonController.currentFrame
              
              // 保持位置不变，只调整高度
              // 40 是固定宽度，高度根据按钮数量动态计算
              self.addonController.setFrame(
                MNUtil.genFrame(
                  currentFrame.x, 
                  currentFrame.y, 
                  40,  // 固定宽度
                  taskUtils.checkHeight(currentFrame.width, self.addonController.maxButtonNumber)  // 动态高度
                ),
                true  // 不触发动画
              )
            } else {
              // 📏 竖向工具栏的调整逻辑（更复杂）
              
              // 获取分割线位置（文档和脑图的分界）
              let splitLine = MNUtil.splitLine
              
              // 获取学习视图的边界
              let studyFrame = MNUtil.studyView.bounds
              let currentFrame = self.addonController.currentFrame
              
              // 🚫 防止工具栏跑到屏幕外面（右边界检查）
              if (currentFrame.x + currentFrame.width * 0.5 >= studyFrame.width) {
                // 太靠右了，拉回来
                currentFrame.x = studyFrame.width - currentFrame.width * 0.5              
              }
              
              // 🚫 防止工具栏跑到屏幕外面（下边界检查）
              if (currentFrame.y >= studyFrame.height) {
                // 太靠下了，往上提一点
                currentFrame.y = studyFrame.height - 20              
              }
              
              // 🎯 分屏模式下的特殊处理
              if (self.addonController.splitMode) {
                if (splitLine) {
                  // 有分割线，贴着分割线放置（左侧留20像素）
                  currentFrame.x = splitLine - 20
                }else{
                  // 没有分割线，根据当前位置决定贴哪边
                  if (currentFrame.x < studyFrame.width * 0.5) {
                    currentFrame.x = 0              // 贴左边
                  }else{
                    currentFrame.x = studyFrame.width - 40  // 贴右边（留出工具栏宽度）
                  }
                }
              }
              
              // 📌 侧边模式的处理
              // 用户可以指定工具栏贴在哪一边
              if (self.addonController.sideMode) {
                switch (self.addonController.sideMode) {
                  case "left":   // 📍 贴左边
                    currentFrame.x = 0
                    break;
                  case "right":  // 📍 贴右边
                    currentFrame.x = studyFrame.width - 40
                    break;
                  default:
                    break;
                }
              }
              
              // 🚫 最后的边界检查，确保不会超出屏幕
              if (currentFrame.x > (studyFrame.width - 40)) {
                currentFrame.x = studyFrame.width - 40
              }
              
              // 应用新的位置和大小
              // 注意：竖向工具栏的高度是根据按钮数量计算的，宽度固定为40
              self.addonController.setFrame(
                MNUtil.genFrame(
                  currentFrame.x, 
                  currentFrame.y, 
                  taskUtils.checkHeight(currentFrame.height, self.addonController.maxButtonNumber),  // 动态高度
                  40  // 固定宽度
                ),
                true  // 不触发动画
              )
            }
          }
        }
        // 📏 步骤4：调整动态工具栏（浮动工具栏）的布局
        if (self.testController && !self.testController.view.hidden) {
          // 动态工具栏是显示状态
          
          if (self.testController.onAnimate || self.testController.onResize) {
            // 正在动画中，不处理
          }else{
            // 🕐 超时自动隐藏逻辑
            // 如果菜单已经关闭超过1秒，并且关闭时间比打开时间晚100毫秒以上
            // 说明用户已经不需要工具栏了，自动隐藏它
            if ((self.onClosePopupMenuOnNoteTime > (self.onPopupMenuOnNoteTime + 100) && 
                 Date.now() - self.onClosePopupMenuOnNoteTime > 1000)) {
              
              // 保存当前透明度
              let preOpacity = self.testController.view.layer.opacity
              
              // 🎆 淡出动画
              MNUtil.animate(()=>{
                self.testController.view.layer.opacity = 0
              }).then(()=>{
                self.testController.view.layer.opacity = preOpacity  // 恢复透明度
                self.testController.view.hidden = true               // 真正隐藏
              })
            }
            
            // 📐 调整动态工具栏的大小
            let currentFrame = self.testController.currentFrame
            let buttonNumber = taskConfig.getWindowState("dynamicButton");  // 获取动态工具栏的按钮数量
            
            // 根据按钮数量调整高度
            currentFrame.height = taskUtils.checkHeight(currentFrame.height, buttonNumber)
            
            // 应用新的 frame
            self.testController.view.frame = currentFrame
            self.testController.currentFrame = currentFrame
          }
        }
        
        // 📏 步骤5：调整设置界面的布局
        if (self.settingController && !self.settingController.onAnimate) {
          // 设置界面存在且不在动画中
          
          let currentFrame = self.settingController.currentFrame
          
          // 直接应用当前的 frame（设置界面大小通常是固定的）
          self.settingController.view.frame = currentFrame
          self.settingController.currentFrame = currentFrame
        }
      },

      /**
       * 🔍 查询插件命令状态 - 更新UI状态
       * 
       * 【触发时机】
       * MarginNote 会定期调用这个方法，询问插件的当前状态。
       * 这是一个同步UI状态的好时机。
       * 
       * 【主要功能】
       * 1. 更新工具栏按钮的显示状态
       * 2. 更新设置界面的同步状态
       * 3. 返回插件的功能清单
       * 
       * @returns {Object} 插件支持的命令列表
       */
      queryAddonCommandStatus: function () {
        // 🔍 基本检查
        if (typeof MNUtil === 'undefined') return null
        
        // 确保视图已创建
        self.ensureView(false)
        
        // 🎨 更新主工具栏的按钮状态
        if (self.addonController) {
          self.addonController.setTaskButton()
        }
        
        // ☁️ 更新设置界面的 iCloud 同步按钮
        if (self.settingController) {
          let iCloudSync = taskConfig.iCloudSync  // 获取当前同步状态
          
          // 根据状态设置不同的颜色
          // 开启：蓝色 #457bd3
          // 关闭：浅蓝色 #9bb2d6
          MNButton.setColor(
            self.settingController.iCloudButton, 
            iCloudSync ? "#457bd3" : "#9bb2d6",
            0.8  // 透明度
          )
          
          // 更新按钮文字，显示当前状态
          MNButton.setTitle(
            self.settingController.iCloudButton, 
            "iCloud Sync " + (iCloudSync ? "✅" : "❌"),
            undefined, 
            true
          )
        }
        
        // 🎯 返回插件支持的命令
        // 🎯 返回插件支持的命令
        return {
            image: 'logo.png',        // 插件图标
            object: self,             // 处理命令的对象
            selector: 'toggleAddon:', // 处理命令的方法
            checked: taskConfig.dynamic  // 当前状态（用于显示勾选）
          };
      },
      
      /**
       * 🖼️ 新图标事件 - 更换按钮图标
       * 
       * 【触发时机】
       * 当用户在设置界面选择了新的图标时触发。
       * 
       * 【实现原理】
       * 1. 接收 base64 编码的图片数据
       * 2. 转换为 UIImage 对象
       * 3. 更新选中按钮的图标
       * 
       * @param {Object} sender - 包含图片数据的事件对象
       */
      onNewIconImage: function (sender) {
        // 🔍 基本检查
        if (typeof MNUtil === 'undefined') return
        
        // 🪟 只处理当前窗口的事件
        if (self.window !== MNUtil.currentWindow) {
          return
        }
        
        // 📷 处理新图标
        if (sender.userInfo.imageBase64) {
          // 从 base64 数据创建 NSData
          let imageData = NSData.dataWithContentsOfURL(MNUtil.genNSURL(sender.userInfo.imageBase64))
          
          // 转换为 UIImage
          let image = UIImage.imageWithData(imageData)
          
          // 获取当前选中的按钮
          let selected = self.settingController.selectedItem

          // 更新按钮图标
          taskConfig.setButtonImage(selected, image, true)
        }
      },
      
      /**
       * ⚙️ 打开工具栏设置
       * 
       * 【触发时机】
       * 当用户点击设置按钮或通过快捷键触发时调用。
       * 
       * @param {Object} params - 参数（当前未使用）
       */
      onOpenTaskSetting: function (params) {
        // 🔍 基本检查
        if (typeof MNUtil === 'undefined') return
        
        // 🪟 只处理当前窗口的事件
        if (self.window !== MNUtil.currentWindow) {
          return
        }
        
        // 打开设置界面
        self.openSetting()
      },
      
      /**
       * 🔄 切换动态模式 - 开启/关闭浮动工具栏
       * 
       * 【功能说明】
       * 动态模式是 MN Task 的核心功能之一：
       * - 开启时：点击笔记会显示浮动工具栏
       * - 关闭时：只有固定工具栏，没有浮动工具栏
       * 
       * @param {Object} sender - 事件发送者
       */
      onToggleDynamic: function (sender) {
        // 🔍 基本检查
        if (typeof MNUtil === 'undefined') return
        
        // 🎯 切换状态（取反）
        taskConfig.dynamic = !taskConfig.dynamic
        
        // 同步状态到控制器
        self.addonController.dynamic = taskConfig.dynamic
        
        // 🎨 根据新状态进行处理
        if (taskConfig.dynamic) {
          // ✅ 开启动态模式
          MNUtil.showHUD("Dynamic ✅")
        }else{
          // ❌ 关闭动态模式，隐藏浮动工具栏
          self.testController.view.hidden = true
        }
        
        // 💾 保存配置
        taskConfig.save("MNTask_dynamic")
        
        // 同步到动态工具栏控制器
        self.testController.dynamic = taskConfig.dynamic
      },
      /**
       * 🎨 切换脑图工具栏 - 隐藏/显示系统工具栏
       * 
       * 【功能说明】
       * 这是一个"黑科技"功能，可以隐藏 MarginNote 原生的工具栏，
       * 让界面更加简洁。支持两种目标：
       * 1. addonBar - 插件栏（通常在左侧或右侧）
       * 2. mindmapTask - 脑图工具栏（底部的工具栏）
       * 
       * 【实现原理】
       * 通过查找视图层级，找到系统工具栏，然后移除或添加它们。
       * 
       * @param {Object} sender - 包含目标信息的事件对象
       */
      onToggleMindmapTask: function (sender) {
        // 检查要操作哪个工具栏
        if ("target" in sender.userInfo) {
          switch (sender.userInfo.target) {
            case "addonBar":  // 🎯 处理插件栏
              // 第一次需要找到插件栏
              if (!self.addonBar) {
                // 🔍 在学习视图的子视图中查找插件栏
                // 判断条件：
                // - 不是隐藏的
                // - Y 坐标大于 100（不在顶部）
                // - 宽度是 40（竖向工具栏的典型宽度）
                // - X 坐标在左边或右边附近
                self.addonBar = MNUtil.studyView.subviews.find(subview => {
                  let frame = subview.frame
                  if (!subview.hidden && 
                      frame.y > 100 && 
                      frame.width === 40 && 
                      (frame.x < 100 || frame.x > MNUtil.studyView.bounds.width - 150)) {
                    
                    // 排除我们自己的工具栏
                    if (self.addonController.view && subview === self.addonController.view) {
                      return false
                    }
                    return true
                  }
                  return false
                })
              }
              
              // 🔄 切换显示/隐藏状态
              if (self.isAddonBarRemoved) {
                // 恢复显示：把视图加回去
                MNUtil.studyView.addSubview(self.addonBar)
                self.isAddonBarRemoved = false
              }else{
                // 隐藏：从父视图中移除
                self.addonBar.removeFromSuperview()
                self.isAddonBarRemoved = true
              }
              break;
              
            case "mindmapTask":  // 🎯 处理脑图工具栏
              // 第一次需要找到脑图工具栏的各个组件
              if (!self.view0) {
                self.isRemoved = false
                
                // 🔍 通过相对位置找到工具栏组件
                // at(-4) 表示倒数第4个子视图
                // 这些视图通常是：
                // view0: 工具栏主体
                // view1: 工具栏背景
                // view2: 工具栏容器
                self.view0 = MNUtil.mindmapView.superview.subviews.at(-4)
                self.view1 = MNUtil.mindmapView.superview.subviews.at(-6)
                self.view2 = MNUtil.mindmapView.superview.subviews.at(-1)
              }
              
              // 🔄 切换显示/隐藏状态
              if (!self.isRemoved) {
                // 隐藏：移除所有工具栏组件
                self.isRemoved = true
                self.view0.removeFromSuperview()
                self.view1.removeFromSuperview()
                self.view2.removeFromSuperview()
              }else{
                // 恢复显示：按顺序加回去
                self.isRemoved = false
                MNUtil.mindmapView.superview.addSubview(self.view1)
                MNUtil.mindmapView.superview.addSubview(self.view0)
                MNUtil.mindmapView.superview.addSubview(self.view2)
              }
              break;
            default:
              break;
          }
        }
      },
      
      /**
       * 🔄 刷新视图 - 更新设置界面
       * 
       * 【触发时机】
       * 当配置发生变化，需要刷新设置界面的显示时调用。
       * 
       * @param {Object} sender - 事件发送者
       */
      onRefreshView: function (sender) {
        let self = getMNTaskClass()
        
        // 🔍 基本检查
        if (typeof MNUtil === 'undefined') return 
        
        // 🪟 只处理当前窗口的事件
        if (self.window !== MNUtil.currentWindow) {
          return
        } 
        
        // 🎨 刷新设置界面的两个主要视图
        self.settingController.refreshView("popupEditView")  // 弹出编辑视图
        self.settingController.refreshView("advanceView")    // 高级设置视图
      },
      
      /**
       * ☁️ iCloud 配置变化事件
       * 
       * 【触发时机】
       * 当 iCloud 上的配置发生变化时触发，用于同步配置。
       * 
       * @param {Object} sender - 事件发送者
       * @async
       */
      onCloudConfigChange: async function (sender) {
        let self = getMNTaskClass()
        
        // 🔍 基本检查
        if (typeof MNUtil === 'undefined') return
        
        // 🪟 只处理当前窗口的事件
        if (self.window !== MNUtil.currentWindow) {
          return
        }
        
        // ☁️ 只有开启了 iCloud 同步才处理
        if (!taskConfig.iCloudSync) {
          return
        }
        
        // 确保视图已创建
        self.ensureView()
        
        // 检查更新
        self.checkUpdate()
      },
      
      /**
       * 🔄 手动同步 - 用户主动触发同步
       * 
       * 【功能说明】
       * 用户点击同步按钮时触发，立即检查并同步配置。
       * 
       * @param {Object} sender - 事件发送者
       * @async
       */
      manualSync: async function (sender) {
        let self = getMNTaskClass()
        
        // 🚪 关闭弹出窗口（如果有）
        if (self.popoverController) {
          self.popoverController.dismissPopoverAnimated(true);
        }
        
        // 🔍 基本检查
        if (typeof MNUtil === 'undefined') return
        
        // 🪟 只处理当前窗口的事件
        if (self.window !== MNUtil.currentWindow) {
          return
        }
        
        // 执行更新检查
        self.checkUpdate()
      },
      
      /**
       * ✏️ 文本开始编辑事件 - 处理笔记编辑
       * 
       * 【触发时机】
       * 当用户开始编辑笔记内容时触发。
       * 
       * 【主要功能】
       * 1. 隐藏动态工具栏（避免遮挡）
       * 2. 检测是否需要打开扩展编辑器
       * 3. 处理空笔记的占位符
       * 
       * @param {{object:UITextView}} param - 包含 UITextView 的参数对象
       */
      onTextDidBeginEditing: function (param) {
        try {
          // 🪟 只处理当前窗口的事件
          if (self.window !== MNUtil.currentWindow) {
            return
          }
          
          // 📖 如果是文档模式（studyMode === 3），不处理
          if (MNUtil.studyMode === 3) {
            return
          }
          
          // 🎯 步骤1：隐藏动态工具栏（如果正在显示）
          // 为什么要隐藏？编辑时工具栏会遮挡输入界面
          if (self.testController && !self.testController.view.hidden) {
            // 保存当前透明度
            let preOpacity = self.testController.view.layer.opacity
            
            // 🎆 淡出动画
            MNUtil.animate(()=>{
              self.testController.view.layer.opacity = 0
            }).then(()=>{
              self.testController.view.layer.opacity = preOpacity  // 恢复透明度
              self.testController.view.hidden = true               // 真正隐藏
            })
          }
          
          // 📝 步骤2：保存当前编辑的文本视图
          let textView = param.object
          taskUtils.textView = textView  // 全局保存，其他地方可能需要
          
          // 🚫 如果没有开启"编辑时显示编辑器"功能，就到此为止
          if (!taskConfig.showEditorOnNoteEdit) {
            return
          }
          
          // 🗺️ 步骤3：获取脑图视图
          let mindmapView = taskUtils.getMindmapview(textView)
          
          // 🔍 步骤4：检查是否是扩展视图（特殊的编辑器）
          if (taskUtils.checkExtendView(textView)) {
            // 处理空内容的情况
            if (textView.text && textView.text.trim()) {
              // 有内容，不做处理
            }else{
              // 没有内容，添加占位符并结束编辑
              textView.text = "placeholder"
              textView.endEditing(true)
            }
            
            // 获取焦点笔记
            let focusNote = MNNote.getFocusNote()
            if (focusNote) {
              // 📢 发送通知，在扩展编辑器中打开
              MNUtil.postNotification("openInEditor", {noteId: focusNote.noteId})
            }
            return
          }
          
          // 🎯 步骤5：处理普通的笔记编辑
          if (mindmapView) {
            // 获取笔记视图和笔记对象
            let noteView = mindmapView.selViewLst[0].view
            let foucsNote = MNNote.new(mindmapView.selViewLst[0].note.note)
            
            // 获取笔记在学习视图中的位置
            let beginFrame = noteView.convertRectToView(noteView.bounds, MNUtil.studyView)
            
            // 🆕 处理空笔记（没有标题、摘录和评论）
            if (!foucsNote.noteTitle && !foucsNote.excerptText && !foucsNote.comments.length) {
              // 添加占位符，避免空笔记
              param.object.text = "placeholder"
            }
            
            // 📐 步骤6：决定编辑器的位置
            if (foucsNote) {
              let noteId = foucsNote.noteId
              let studyFrame = MNUtil.studyView.bounds
              
              // 检查是否有足够空间在右边显示编辑器（450像素宽）
              if (beginFrame.x + 450 > studyFrame.width) {
                // 🔄 空间不够，编辑器放在左边
                let endFrame = Frame.gen(studyFrame.width - 450, beginFrame.y - 10, 450, 500)
                
                // 检查下边界
                if (beginFrame.y + 490 > studyFrame.height) {
                  endFrame.y = studyFrame.height - 500
                }
                
                // 📢 发送通知，打开编辑器
                MNUtil.postNotification("openInEditor", {
                  noteId: noteId,
                  beginFrame: beginFrame,  // 笔记原始位置
                  endFrame: endFrame       // 编辑器目标位置
                })
              }else{
                // ✅ 空间足够，编辑器放在右边
                let endFrame = Frame.gen(beginFrame.x, beginFrame.y - 10, 450, 500)
                
                // 检查下边界
                if (beginFrame.y + 490 > studyFrame.height) {
                  endFrame.y = studyFrame.height - 500
                }
                
                // 📢 发送通知，打开编辑器
                MNUtil.postNotification("openInEditor", {
                  noteId: noteId,
                  beginFrame: beginFrame,  // 笔记原始位置
                  endFrame: endFrame       // 编辑器目标位置
                })
              }
            }
          }
        } catch (error) {
          // 😵 出错了！记录错误信息
          taskUtils.addErrorLog(error, "onTextDidBeginEditing")
        }
      },
      
      /**
       * ✏️ 文本结束编辑事件
       * 
       * 【触发时机】
       * 当用户结束编辑笔记内容时触发。
       * 
       * 【主要功能】
       * 清理编辑状态，释放文本视图引用。
       * 
       * @param {{object:UITextView}} param - 包含 UITextView 的参数对象
       */
      onTextDidEndEditing: function (param) {
        // 🪟 只处理当前窗口的事件
        if (self.window !== MNUtil.currentWindow) {
          return
        }
        
        // 📖 如果是文档模式，不处理
        if (MNUtil.studyMode === 3) {
          return
        }
        
        // 🧹 清理文本视图引用
        let textView = param.object
        if (textView === taskUtils.textView) {
          // 这是我们之前保存的文本视图，现在可以清理了
          taskUtils.textView = undefined
        }
      },
      
      /**
       * 🔄 刷新工具栏按钮
       * 
       * 【触发时机】
       * 当需要更新工具栏按钮的显示状态时调用。
       * 
       * @param {Object} sender - 事件发送者
       */
      onRefreshTaskButton: function (sender) {
        try {
          // 🎨 更新主工具栏的按钮
          self.addonController.setTaskButton()
          
          // 📝 更新设置界面的按钮文字
          if (self.settingController) {
            self.settingController.setButtonText()
          }
        } catch (error) {
          // 😵 出错了！记录错误信息
          taskUtils.addErrorLog(error, "onRefreshTaskButton")
        }
      },
      /**
       * ⚙️ 打开设置界面（内部方法）
       * 
       * 【功能说明】
       * 检查弹出控制器并打开设置界面。
       */
      openSetting: function () {
        let self = getMNTaskClass()
        
        // 检查并关闭已有的弹出窗口
        self.checkPopoverController()
        
        // 打开设置界面
        self.openSetting()
      },
      
      /**
       * 🛠️ 切换工具栏显示/隐藏
       * 
       * 【功能说明】
       * 这是显示或隐藏主工具栏的方法。
       * 第一次显示时，会根据插件栏的位置智能设置工具栏位置。
       */
      toggleTask: function () {
        let self = getMNTaskClass()
        
        // 检查并关闭已有的弹出窗口
        self.checkPopoverController()
        
        // 初始化
        self.init(mainPath)
        self.ensureView(true)
        
        // 🆕 第一次显示工具栏的特殊处理
        if (taskConfig.isFirst) {
          let buttonFrame = self.addonBar.frame
          
          // 根据插件栏的位置决定工具栏位置
          if (buttonFrame.x === 0) {
            // 插件栏在左边，工具栏放在右边
            Frame.set(self.addonController.view, 40, buttonFrame.y, 40, 290)
          }else{
            // 插件栏在右边，工具栏放在左边
            Frame.set(self.addonController.view, buttonFrame.x - 40, buttonFrame.y, 40, 290)
          }
          
          // 保存当前位置
          self.addonController.currentFrame = self.addonController.view.frame
          taskConfig.isFirst = false;
        }
        
        // 🔄 切换显示/隐藏状态
        if (self.addonController.view.hidden) {
          // 显示工具栏
          taskConfig.windowState.open = true
          taskConfig.windowState.frame = self.addonController.view.frame
          self.addonController.show()
          taskConfig.save("MNTask_windowState")
        }else{
          // 隐藏工具栏
          taskConfig.windowState.open = false
          taskConfig.windowState.frame = self.addonController.view.frame
          self.addonController.hide()
          taskConfig.save("MNTask_windowState")
        }
      },
      
      /**
       * 🌟 切换动态模式（内部方法）
       * 
       * 【功能说明】
       * 开启或关闭动态工具栏功能。
       * 这个方法和 onToggleDynamic 类似，但用于内部调用。
       */
      toggleDynamic: function () {
        let self = getMNTaskClass()
        
        // 检查并关闭已有的弹出窗口
        self.checkPopoverController()
        
        // 🔍 基本检查
        if (typeof MNUtil === 'undefined') return
        
        // 🎯 切换状态
        taskConfig.dynamic = !taskConfig.dynamic
        
        // 🎨 显示状态提示
        if (taskConfig.dynamic) {
          MNUtil.showHUD("Dynamic ✅")
        }else{
          MNUtil.showHUD("Dynamic ❌")
          // 关闭时隐藏动态工具栏
          if (self.testController) {
            self.testController.view.hidden = true
          }
        }
        
        // 💾 保存配置
        taskConfig.save("MNTask_dynamic")
        
        // 同步状态
        if (self.testController) {
          self.testController.dynamic = taskConfig.dynamic
        }
        
        // 刷新命令状态
        MNUtil.refreshAddonCommands()
      },
      
      /**
       * 📄 打开文档
       * 
       * 【功能说明】
       * 在浏览器中打开 MN Task 的在线文档。
       * 
       * @param {Object} button - 触发的按钮
       */
      openDocument: function (button) {
        // 🔍 基本检查
        if (typeof MNUtil === 'undefined') return
        
        let self = getMNTaskClass()
        
        // 检查并关闭已有的弹出窗口
        self.checkPopoverController()
        
        // 📢 发送通知，在浏览器中打开文档
        MNUtil.postNotification("openInBrowser", {
          url: "https://mnaddon.craft.me/task"
        })
      },
      
      /**
       * 🔄 切换工具栏方向（内部方法）
       * 
       * @param {string} source - 来源（"fixed" 或 "dynamic"）
       */
      toggleTaskDirection: function (source) {
        let self = getMNTaskClass()
        
        // 检查并关闭已有的弹出窗口
        self.checkPopoverController()
        
        // 切换方向
        taskConfig.toggleTaskDirection(source)
      },
      
      /**
       * 🎛️ 切换插件 - 显示主菜单
       * 
       * 【触发时机】
       * 用户点击 MN Task 的插件图标时触发。
       * 
       * 【功能说明】
       * 显示一个包含所有主要功能的弹出菜单。
       * 
       * @param {UIButton} button - 插件图标按钮
       */
      toggleAddon: function (button) {
      try {
        // 🔍 基本检查
        if (typeof MNUtil === 'undefined') return
        
        let self = getMNTaskClass()
        
        // 🎯 获取插件栏的引用
        // addonBar 是 MarginNote 原生的插件栏（左侧或右侧的竖条）
        if (!self.addonBar) {
          // button 是插件图标
          // superview 是包含按钮的视图
          // superview.superview 就是插件栏本身
          self.addonBar = button.superview.superview
          self.addonController.addonBar = self.addonBar
        }
        
        // 📋 构建菜单项列表
        let selector = "toggleTaskDirection:"  // 切换方向的方法名
        
        var commandTable = [
          // ⚙️ 设置
          self.tableItem('⚙️   Setting', 'openSetting:'),
          
          // 🛠️ 主工具栏相关
          self.tableItem(
            '🛠️   Task',  // 显示文本
            'toggleTask:',  // 点击时调用的方法
            undefined,         // 参数
            !self.addonController.view.hidden  // 是否打勾（工具栏显示时打勾）
          ),
          
          // 🛠️ 主工具栏方向
          self.tableItem(
            '🛠️   Direction   ' + (taskConfig.vertical() ? '↕️' : '↔️'),  // 显示当前方向
            selector,
            "fixed"  // 参数：表示是固定工具栏
          ),
          
          // 🌟 动态工具栏开关
          self.tableItem(
            '🌟   Dynamic   ',
            "toggleDynamic",
            undefined,
            taskConfig.dynamic  // 是否打勾（动态模式开启时打勾）
          ),
          
          // 🌟 动态工具栏方向
          self.tableItem(
            '🌟   Direction   ' + (taskConfig.vertical() ? '↕️' : '↔️'),
            selector,
            "dynamic"  // 参数：表示是动态工具栏
          ),
          
          // 📄 文档
          self.tableItem('📄   Document', 'openDocument:'),
          
          // 🔄 手动同步
          self.tableItem('🔄   Manual Sync', 'manualSync:')
        ];
        
        // 🎯 显示弹出菜单
        // 根据插件栏的位置决定菜单的弹出方向
        if (self.addonBar.frame.x < 100) {
          // 插件栏在左边，菜单向右弹出（箭头方向 = 4）
          self.popoverController = MNUtil.getPopoverAndPresent(
            button,         // 触发按钮
            commandTable,   // 菜单项
            200,           // 菜单宽度
            4              // 箭头方向（向左）
          )
        }else{
          // 插件栏在右边，菜单向左弹出（箭头方向 = 0）
          self.popoverController = MNUtil.getPopoverAndPresent(
            button, 
            commandTable, 
            200, 
            0              // 箭头方向（向右）
          )
        }
      } catch (error) {
        // 😵 出错了！记录错误信息
        taskUtils.addErrorLog(error, "toggleAddon")
      }
        return
      }
    },
    { /* 静态方法 - 插件级别的生命周期方法 */
      
      /**
       * 🔌 插件已连接
       * 
       * 【触发时机】
       * 当插件被安装并成功连接到 MarginNote 时调用。
       * 这是插件的最早期生命周期方法。
       * 
       * 【注意】
       * 目前这个方法是空的，但你可以在这里添加插件安装时的初始化逻辑。
       */
      addonDidConnect: function () {
        // 可以在这里添加插件首次安装的初始化逻辑
      },

      /**
       * 🔌 插件即将断开
       * 
       * 【触发时机】
       * 当用户卸载插件时，在插件真正被移除前调用。
       * 
       * 【主要功能】
       * 询问用户是否要删除所有配置数据。
       * 
       * @async
       */
      addonWillDisconnect: async function () {
        // 🤔 询问用户是否要删除配置
        let confirm = await MNUtil.confirm(
          "MN Task: Remove all config?",    // 英文提示
          "MN Task: 删除所有配置？"           // 中文提示
        )
        
        if (confirm) {
          // 🗑️ 用户确认，删除所有配置
          taskConfig.remove("MNTask_dynamic")      // 动态模式设置
          taskConfig.remove("MNTask_windowState")  // 窗口状态
          taskConfig.remove("MNTask_action")       // 按钮动作配置
          taskConfig.remove("MNTask_actionConfig") // 动作详细配置
        }
      },

      /**
       * 📱 应用即将进入前台
       * 
       * 【触发时机】
       * 当 MarginNote 从后台切换到前台时调用。
       * 
       * 【主要功能】
       * 发送通知，触发 iCloud 同步检查。
       */
      applicationWillEnterForeground: function () {
        // 🔍 基本检查
        if (typeof MNUtil === 'undefined') return
        
        // 📢 发送 iCloud 变化通知
        // 这会触发配置同步检查
        MNUtil.postNotification("NSUbiquitousKeyValueStoreDidChangeExternallyNotificationUI", {})
      },

      /**
       * 📱 应用已进入后台
       * 
       * 【触发时机】
       * 当用户切换到其他应用，MarginNote 进入后台时调用。
       * 
       * 【注意】
       * 目前这个方法是空的，但你可以在这里添加进入后台时的清理逻辑。
       */
      applicationDidEnterBackground: function () {
        // 可以在这里添加进入后台时的清理或保存逻辑
      },

      /**
       * 📬 收到本地通知
       * 
       * 【触发时机】
       * 当应用收到本地通知时调用。
       * 
       * @param {Object} notify - 通知对象
       */
      applicationDidReceiveLocalNotification: function (notify) {
        // 可以在这里处理本地通知
      }
    }
  );
  
  /**
   * 🚀 初始化插件（原型方法）
   * 
   * 【功能说明】
   * 初始化插件的基础设施，包括工具函数和配置管理。
   * 这个方法只会执行一次（通过 initialized 标志控制）。
   * 
   * @param {string} mainPath - 插件主路径
   * @this {MNTaskClass}
   */
  MNTaskClass.prototype.init = function(mainPath){ 
    try {
      // 🔄 确保只初始化一次
      if (!this.initialized) {
        // 初始化工具函数模块
        taskUtils.init(mainPath)
        
        // 初始化配置管理模块
        taskConfig.init(mainPath)
        
        // 标记已初始化
        this.initialized = true
      }
    } catch (error) {
      // 😵 出错了！记录错误信息
      taskUtils.addErrorLog(error, "init")
    }
  }
  
  /**
   * 🎨 确保视图已创建（原型方法）
   * 
   * 【功能说明】
   * 确保主工具栏视图已经创建并添加到正确的父视图中。
   * 如果视图不存在会创建它，如果位置不对会重新添加。
   * 
   * @param {boolean} refresh - 是否刷新插件命令（默认 true）
   * @this {MNTaskClass}
   */
  MNTaskClass.prototype.ensureView = function (refresh = true) {
    try {
      // 🆕 如果控制器不存在，创建它
      if (!this.addonController) {
        this.addonController = taskController.new();
        this.addonController.view.hidden = true;  // 先隐藏
        MNUtil.studyView.addSubview(this.addonController.view);  // 添加到学习视图
      }
      
      // 🔍 检查视图是否在正确的位置
      // 必须满足两个条件：
      // 1. 在当前窗口中
      // 2. 是学习视图的子视图
      if (taskUtils.isDescendantOfCurrentWindow(this.addonController.view) && 
          !MNUtil.isDescendantOfStudyView(this.addonController.view)) {
        // 位置不对，重新添加
        MNUtil.studyView.addSubview(this.addonController.view)
        this.addonController.view.hidden = true
        
        // 刷新插件命令状态
        if (refresh) {
          MNUtil.refreshAddonCommands()
        }
      }
      
      // 📐 设置工具栏的位置和大小
      let targetFrame  // 这个变量好像没用到
      
      if (this.lastFrame) {
        // 使用上次的位置
        this.addonController.setFrame(this.lastFrame)
      }else{
        // 使用默认位置（左上角）
        this.addonController.setFrame(MNUtil.genFrame(10, 10, 40, 200))
      }
      
      // 💾 从配置中恢复窗口状态
      if (taskConfig.windowState.frame) {
        // 恢复保存的位置
        this.addonController.setFrame(taskConfig.windowState.frame)
        
        // 恢复显示/隐藏状态
        this.addonController.view.hidden = !taskConfig.getWindowState("open");
        
        // 不是第一次了
        taskConfig.isFirst = false
      }else{
        // 没有保存的状态，初始化空对象
        taskConfig.windowState = {}
      }
    } catch (error) {
      // 😵 出错了！显示错误信息
      taskUtils.showHUD(error, 5)
    }
  }
  
  /**
   * ⚙️ 打开设置界面（原型方法）
   * 
   * 【功能说明】
   * 创建或显示设置界面控制器。
   * 
   * @this {MNTaskClass} 
   */
  MNTaskClass.prototype.openSetting = function () {
    try {
      // 🆕 如果设置控制器不存在，创建它
      if (!this.settingController) {
        this.settingController = settingController.new();
        
        // 建立关联关系
        this.settingController.taskController = this.addonController
        this.settingController.mainPath = taskConfig.mainPath;
        this.settingController.action = taskConfig.action
        
        // 添加到学习视图
        MNUtil.studyView.addSubview(this.settingController.view)
      }
      
      // 🎨 显示设置界面
      this.settingController.show()
    } catch (error) {
      // 😵 出错了！记录错误信息
      taskUtils.addErrorLog(error, "openSetting")
    }
  }
  /**
   * 🔄 检查并应用配置更新（原型方法）
   * 
   * 【功能说明】
   * 这个方法会检查云端配置是否有更新，如果有就应用到插件中。
   * 想象一下，就像手机应用会自动更新一样，这个方法让插件能自动更新配置。
   * 
   * 【执行流程】
   * ```
   * 检查更新
   *     ↓
   * 读取云端配置
   *     ↓
   * 有更新吗？
   *     ├─ 是 → 获取所有按钮动作
   *     │      ↓
   *     │    更新设置界面（如果打开的话）
   *     │      ↓
   *     │    更新工具栏界面
   *     │      ↓
   *     │    发送刷新通知
   *     │
   *     └─ 否 → 什么都不做
   * ```
   * 
   * @async 异步方法，会等待云端数据
   * @this {MNTaskClass}
   */
  MNTaskClass.prototype.checkUpdate = async function () {
    try {
      // 🌐 第一步：检查云端配置是否有更新
      // 参数 false 表示不强制更新，只检查
      let shouldUpdate = await taskConfig.readCloudConfig(false)
      
      // 🔍 第二步：如果有更新，应用新配置
      if (shouldUpdate) {
        // 📋 获取所有按钮的动作配置
        let allActions = taskConfig.getAllActions()
        
        // 🎨 第三步：更新设置界面（如果它正在显示的话）
        if (this.settingController) {
          // 更新按钮列表和当前选中项
          this.settingController.setButtonText(allActions,this.settingController.selectedItem)
        }
        
        // 🎯 第四步：更新工具栏界面
        if (this.addonController) {
          // 恢复窗口位置（可能配置中改变了位置）
          this.addonController.setFrame(taskConfig.getWindowState("frame"))
          
          // 更新所有按钮（可能新增或修改了按钮）
          this.addonController.setTaskButton(allActions)
        }else{
          // 🚫 异常情况：工具栏控制器不存在
          MNUtil.showHUD("No addonController")
        }
        
        // 📢 第五步：发送刷新通知
        // 其他监听这个通知的组件也会刷新自己
        MNUtil.postNotification("refreshView",{})
      }
      // 如果没有更新，什么都不做，静悄悄的~
      
    } catch (error) {
      // 😵 出错了！记录错误信息
      taskUtils.addErrorLog(error, "checkUpdate")
    }
  }
  /**
   * 🎯 检查并关闭弹出控制器（原型方法）
   * 
   * 【功能说明】
   * 这个方法用于关闭当前显示的弹出窗口（如果有的话）。
   * 就像你点击空白处关闭右键菜单一样，这个方法确保没有残留的弹出窗口。
   * 
   * 【什么是 PopoverController？】
   * 在 iOS/macOS 中，Popover 是一种弹出式界面，通常用于：
   * - 显示更多选项菜单
   * - 显示详细信息
   * - 显示小型设置界面
   * 
   * 【使用场景】
   * - 切换工具栏状态前，先关闭可能存在的弹出菜单
   * - 隐藏工具栏前，确保相关的弹出窗口也被关闭
   * - 避免弹出窗口"漂浮"在空中的尴尬情况
   * 
   * @this {MNTaskClass}
   */
  MNTaskClass.prototype.checkPopoverController = function () {
    // 🔍 检查是否有弹出控制器存在
    if (this.popoverController) {
      // ✨ 使用动画方式优雅地关闭弹出窗口
      // 参数 true 表示带动画效果，窗口会淡出消失
      this.popoverController.dismissPopoverAnimated(true);
    }
    // 如果没有弹出窗口，什么都不做
  }
  /**
   * 📋 创建表格菜单项对象（原型方法）
   * 
   * 【功能说明】
   * 这是一个工具方法，用于创建符合 iOS 表格视图要求的菜单项对象。
   * 就像餐厅的菜单，每道菜都有名字、价格、说明一样，
   * 这个方法创建的对象包含了菜单项需要的所有信息。
   * 
   * 【返回对象结构】
   * ```javascript
   * {
   *   title: "菜单项名称",      // 显示给用户看的文字
   *   object: this,            // 谁来处理点击（通常是插件主类）
   *   selector: "方法名:",      // 点击后调用哪个方法
   *   param: "参数",           // 传给方法的参数
   *   checked: true/false      // 是否显示勾选标记
   * }
   * ```
   * 
   * 【使用场景】
   * 通常用在创建右键菜单或设置菜单时：
   * ```javascript
   * let menuItems = [
   *   this.tableItem("打开工具栏", "toggleTask:", "", this.addonController.view.hidden),
   *   this.tableItem("设置", "openSetting:", "", false),
   *   this.tableItem("检查更新", "checkUpdate:", "", false)
   * ]
   * ```
   * 
   * @param {string} title - 菜单项的显示文字（比如"复制"、"粘贴"）
   * @param {string} selector - 要调用的方法名（必须以冒号结尾，如"copy:"）
   * @param {any} param - 传递给方法的参数（默认空字符串）
   * @param {boolean|undefined} checked - 是否显示勾选标记（默认 false）
   * @this {MNTaskClass} - 插件主类实例
   * @returns {{title:string, object:MNTaskClass, selector:string, param:any, checked:boolean}} 菜单项对象
   * 
   * @example
   * // 创建一个简单菜单项
   * let copyItem = this.tableItem("复制", "copyNote:", note)
   * 
   * // 创建一个带勾选的菜单项
   * let toggleItem = this.tableItem("显示工具栏", "toggleTask:", "", true)
   */
  MNTaskClass.prototype.tableItem = function (title,selector,param = "",checked = false) {
    // 🏗️ 构建并返回菜单项对象
    // 这个对象格式是 iOS 系统要求的标准格式
    return {
      title: title,        // 菜单项显示的文字
      object: this,        // 响应者对象（谁来处理点击事件）
      selector: selector,  // 选择器（点击后调用的方法名）
      param: param,        // 参数（传给方法的数据）
      checked: checked     // 勾选状态（是否在前面显示✓）
    }
  }
  return MNTaskClass;
};