/**
 * GoToPage 插件 - 详细注释版本
 * 
 * 功能：为 MarginNote 的 PDF 文档添加页码偏移功能，解决 PDF 显示页码与实际页码不匹配的问题
 * 作者：BigGrayVVolf (原始版本)
 * 
 * 使用示例：
 * - 输入 "10" - 跳转到第 10 页
 * - 输入 "2@10" - 设置偏移量为 2，并跳转到第 10 页（实际跳转到 PDF 的第 12 页）
 * - 输入 "2@" - 仅设置偏移量为 2
 */

/**
 * JSB.newAddon 是 MarginNote 插件的标准入口函数
 * 当 MarginNote 加载插件时会调用这个函数
 * 
 * @param {string} mainPath - 插件的安装路径（通常不使用）
 * @returns {Class} 返回插件类的定义
 */
JSB.newAddon = function(mainPath) {
  // ==================== 插件级别的变量定义 ====================
  
  /**
   * KEY: NSUserDefaults 中存储偏移量数据的键名
   * NSUserDefaults 是 iOS/macOS 的原生持久化存储系统
   * 类似于浏览器的 localStorage，但是原生应用级别的
   */
  const KEY = 'GoToPage.Offsets';

  /**
   * pageNoOffsets: 存储每个文档的页码偏移量
   * 数据结构：{ 
   *   "文档MD5哈希值1": 偏移量1,
   *   "文档MD5哈希值2": 偏移量2,
   *   ...
   * }
   * 
   * 设计思路：
   * - 使用文档的 MD5 作为唯一标识符，即使文件名改变也能识别
   * - 每个文档可以有独立的偏移量设置
   * - 对象形式便于快速查找和更新
   */
  let pageNoOffsets = {};
  
  /**
   * currentDocmd5: 当前打开文档的 MD5 标识符
   * 用于快速访问当前文档的偏移量设置
   * 在 documentDidOpen 时设置，在 documentWillClose 时清空
   */
  let currentDocmd5;

  // ==================== 插件类定义 ====================
  
  /**
   * JSB.defineClass 是 MarginNote 提供的类定义方法
   * 参数1: 类名和父类（GoToPage 继承自 JSExtension）
   * 参数2: 实例方法对象
   * 参数3: 类方法对象
   */
  var newAddonClass = JSB.defineClass('GoToPage : JSExtension', {
    
    // ==================== 窗口生命周期方法 ====================
    // MarginNote 支持多窗口，每个窗口都有独立的插件实例
    
    /**
     * sceneWillConnect: 窗口即将连接时调用
     * 这是窗口级别的初始化函数，相当于 viewDidLoad
     * 
     * 主要任务：
     * 1. 从持久化存储中恢复页码偏移量数据
     * 2. 初始化插件的 UI 状态
     */
    sceneWillConnect: function() {
      // 从 NSUserDefaults 加载之前保存的偏移量数据
      // NSUserDefaults 是 iOS/macOS 的标准用户偏好设置存储系统
      if (NSUserDefaults.standardUserDefaults().objectForKey(KEY)) {
        pageNoOffsets = NSUserDefaults.standardUserDefaults().objectForKey(KEY);
      }
      
      // 初始化插件按钮的选中状态
      // self 指向当前插件实例，checked 控制工具栏按钮的高亮状态
      self.checked = false
      
      // 调试日志（已注释）- 打印当前所有文档的偏移量键
      // JSB.log 是 MarginNote 提供的日志方法，支持格式化字符串
      // %@ 是 Objective-C 风格的占位符，表示对象
      // JSB.log('🌈🌈🌈 MNLOG pageNoOffsets keys: %@', Object.keys(pageNoOffsets).toString());
    },
    
    /**
     * sceneDidDisconnect: 窗口断开连接时调用
     * 可以在这里进行清理工作，但当前为空实现
     * 注意：数据已经在设置时实时保存，所以这里不需要保存
     */
    sceneDidDisconnect: function() {
    },
    
    /**
     * sceneWillResignActive: 窗口即将失去焦点
     * sceneDidBecomeActive: 窗口获得焦点
     * 这些方法可用于暂停/恢复某些操作，当前为空实现
     */
    sceneWillResignActive: function() {
    },
    sceneDidBecomeActive: function() {
    },
    
    // ==================== 笔记本生命周期方法 ====================
    
    /**
     * notebookWillOpen/notebookWillClose: 笔记本打开/关闭
     * @param {string} notebookid - 笔记本的唯一标识符
     * 
     * 可以在这里处理笔记本相关的初始化/清理工作
     * 当前插件不需要处理笔记本事件，所以为空实现
     */
    notebookWillOpen: function(notebookid) {
    },
    notebookWillClose: function(notebookid) {
    },
    
    // ==================== 文档生命周期方法 ====================
    
    /**
     * documentDidOpen: 文档打开时调用
     * @param {string} docmd5 - 文档的 MD5 哈希值
     * 
     * 重要：这里记录当前文档的标识符，用于后续访问该文档的偏移量
     * MD5 是文档内容的哈希值，即使文件名改变也不会变化
     */
    documentDidOpen: function(docmd5) {
      currentDocmd5 = docmd5
    },
    
    /**
     * documentWillClose: 文档即将关闭
     * @param {string} docmd5 - 文档的 MD5 哈希值
     * 
     * 注意：原代码中有拼写错误 "docmentWillClose"（缺少 u）
     * 这里已修正为 documentWillClose
     * 清空当前文档标识符，避免访问已关闭文档的数据
     */
    documentWillClose: function(docmd5) {
      currentDocmd5 = ''
    },
    
    /**
     * controllerWillLayoutSubviews: 控制器即将布局子视图
     * 可以在这里调整 UI 布局，当前为空实现
     */
    controllerWillLayoutSubviews: function(controller) {
    },
    
    // ==================== 插件命令系统 ====================
    
    /**
     * queryAddonCommandStatus: 查询插件命令状态
     * MarginNote 定期调用此方法来更新插件按钮的显示状态
     * 
     * 返回对象包含：
     * - image: 按钮图标文件名
     * - object: 处理点击事件的对象（通常是 self）
     * - selector: 点击时调用的方法名（Objective-C 风格）
     * - checked: 按钮是否高亮（选中状态）
     */
    queryAddonCommandStatus: function() {
      return {
        image: 'GoToPage.png',        // 插件图标（需要在插件包中提供）
        object: self,                  // 事件处理对象
        selector: "toggleGoToPage:",   // 点击时调用的方法（注意冒号表示有参数）
        checked: self.checked          // 控制按钮高亮状态
      };
    },
    
    // ==================== 核心功能实现 ====================
    
    /**
     * toggleGoToPage: 插件主功能 - 处理页面跳转
     * @param {object} sender - 触发事件的对象（通常是按钮）
     * 
     * 这是插件的核心方法，处理整个页面跳转流程：
     * 1. 显示输入对话框
     * 2. 解析用户输入
     * 3. 更新偏移量设置
     * 4. 调用系统跳转功能
     */
    toggleGoToPage: function(sender) {
      // 调试日志：方法被调用
      JSB.log('🌈🌈🌈 MNLOG toggleGoToPage');
      
      // ========== 步骤1：获取应用实例和更新 UI 状态 ==========
      
      /**
       * Application.sharedInstance() 获取 MarginNote 应用的单例实例
       * 这是访问应用级功能的入口点
       */
      let app = Application.sharedInstance();
      
      // 立即将按钮设置为选中状态，给用户视觉反馈
      self.checked = true;
      
      /**
       * studyController 是 MarginNote 的学习控制器，管理文档阅读界面
       * refreshAddonCommands 刷新插件工具栏，更新按钮显示状态
       */
      app.studyController(self.window).refreshAddonCommands();
      
      // ========== 步骤2：检查系统命令可用性 ==========
      
      /**
       * 检查原生的 "Go To Page" 命令是否可用
       * 参数说明：
       * - "p": 快捷键（对应 Cmd+P）
       * - 0x100000: NSEventModifierFlagCommand（Cmd 键的标志位）
       * - self.window: 当前窗口
       * 
       * 如果命令被禁用（比如在非 PDF 文档中），直接返回
       */
      if (app.queryCommandWithKeyFlagsInWindow("p", 0x100000, self.window).disabled) {
        return;
      }
      
      // ========== 步骤3：准备并显示输入对话框 ==========
      
      // 构建对话框标题，显示当前文档的偏移量设置
      var title = "Page Offset nil!";  // 默认标题（无偏移量）
      if (pageNoOffsets[currentDocmd5]) {
        // 如果当前文档有偏移量设置，显示在标题中
        title = 'Page Offset: ' + pageNoOffsets[currentDocmd5];
      }
      
      JSB.log('🌈🌈🌈 MNLOG title: %@', title);
      
      // 对话框的提示信息，解释输入格式
      let message = 'Ex: Set Offset(2) and Page(10): "2@10"\nSet Page(10): "10"\nSet Offset(2): "2@"';
      
      /**
       * UIAlertView 是 iOS 的原生对话框组件
       * showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock 参数说明：
       * - title: 对话框标题
       * - message: 提示信息
       * - 2: alertViewStyle（2 表示带文本输入框的样式）
       * - "Go": 确认按钮文字
       * - []: 其他按钮（这里没有）
       * - function(alert): 用户点击按钮后的回调函数
       */
      UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
        title, message, 2, "Go", [], 
        function(alert) {
          // ========== 步骤4：处理用户输入（回调函数） ==========
          
          JSB.log('🌈🌈🌈 MNLOG tapBlock: arg1: %@', alert);
          
          // 获取用户在文本框中输入的内容
          // textFieldAtIndex(0) 获取第一个（也是唯一的）文本输入框
          let text = alert.textFieldAtIndex(0).text;
          
          JSB.log('🌈🌈🌈 MNLOG settingAlert text: %@', text);
          
          // ========== 步骤5：解析输入格式 ==========
          
          /**
           * 输入格式解析逻辑：
           * - "10" -> 直接跳转到第 10 页
           * - "2@10" -> 设置偏移量为 2，跳转到第 10 页
           * - "2@" -> 仅设置偏移量为 2
           * 
           * 使用 @ 作为分隔符是一个巧妙的设计：
           * - 不会与数字冲突
           * - 语义清晰："偏移@页码"
           * - 容易输入
           */
          let texts = text.split('@');
        
          var realPageNo;  // 要跳转的实际页码
          
          if (texts.length == 2) {
            // 格式：偏移量@页码 或 偏移量@
            
            // 处理偏移量部分（@ 前面的数字）
            if (!isNaN(parseInt(texts[0]))) {
              // parseInt 将字符串转换为整数
              // isNaN 检查是否为有效数字（Not a Number）
              pageNoOffsets[currentDocmd5] = parseInt(texts[0]);
              
              JSB.log('🌈🌈🌈 MNLOG pageNoOffsets keys: %@', Object.keys(pageNoOffsets).toString());
              
              // 立即保存到 NSUserDefaults，确保数据持久化
              // 这是实时保存策略，避免数据丢失
              NSUserDefaults.standardUserDefaults().setObjectForKey(pageNoOffsets, KEY);
            }
            
            // 处理页码部分（@ 后面的数字）
            if (!isNaN(parseInt(texts[1]))) {
              realPageNo = parseInt(texts[1]);
            }
            
          } else if (texts.length == 1) {
            // 格式：纯页码（没有 @）
            if (!isNaN(parseInt(texts[0]))) {
              realPageNo = parseInt(texts[0]);
            }
          }
        
          // ========== 步骤6：执行页面跳转 ==========
          
          // 获取学习控制器实例（studyController）
          // 这是 MarginNote 中管理文档阅读的核心控制器
          let fsbc = app.studyController(self.window);
          
          // 只有输入了有效的页码才执行跳转
          if (!isNaN(realPageNo)) {
            /**
             * 这里是插件的精髓所在：
             * 不是重新实现页面跳转功能，而是调用系统原生的跳转对话框
             * 并预填充计算后的页码
             * 
             * makeWithTitleMessageDelegateCancelButtonTitleOtherButtonTitles 参数：
             * - "Go To Page": 对话框标题（系统标准标题）
             * - "": 空消息
             * - fsbc: delegate（委托对象），系统会调用它的相关方法
             * - "Real Go": 取消按钮文字（这里有些奇怪，通常应该是 "Cancel"）
             * - []: 其他按钮
             */
            let gotoAlert = UIAlertView.makeWithTitleMessageDelegateCancelButtonTitleOtherButtonTitles(
              "Go To Page", "", fsbc, "Real Go", []
            );
            
            // alertViewStyle = 2 设置对话框样式为文本输入
            gotoAlert.alertViewStyle = 2;
            
            // 显示对话框
            gotoAlert.show();
            
            // 获取对话框的文本输入框
            let tf = gotoAlert.textFieldAtIndex(0);
            
            // ========== 关键：计算并填充实际页码 ==========
            
            /**
             * 核心算法：实际页码 = 用户输入页码 + 偏移量
             * 
             * 例如：
             * - PDF 第 1 页实际是书的第 3 页
             * - 用户设置偏移量为 2
             * - 用户想跳转到书的第 10 页
             * - 实际需要跳转到 PDF 的第 12 页（10 + 2）
             */
            let offset = !isNaN(pageNoOffsets[currentDocmd5]) ? pageNoOffsets[currentDocmd5] : 0;
            tf.text = (realPageNo + offset).toString();

            // ========== 步骤7：异步状态管理 ==========
            
            /**
             * 问题：如何知道用户何时关闭了跳转对话框？
             * 解决方案：使用定时器定期检查
             * 
             * 注意：timeoutCount 是隐式全局变量（缺少 let/var 声明）
             * 这是一个潜在的问题，可能导致多窗口环境下的冲突
             */
            timeoutCount = 20;  // 20 * 0.5秒 = 10秒超时
            
            /**
             * NSTimer.scheduledTimerWithTimeInterval 创建定时器
             * 参数：
             * - 0.5: 间隔时间（秒）
             * - true: 是否重复
             * - function(timer): 定时器回调函数
             */
            NSTimer.scheduledTimerWithTimeInterval(0.5, true, function(timer) {
              timeoutCount -= 1;
              
              /**
               * 检查是否应该停止定时器的条件：
               * 1. app.osType === 2: 可能是 iPad OS 的标识（需要进一步确认）
               * 2. app.focusWindow.subviews.length === 1: 对话框已关闭（只剩主视图）
               * 3. timeoutCount <= 0: 超时保护，避免定时器永远运行
               */
              if (app.osType === 2 || app.focusWindow.subviews.length === 1 || timeoutCount <= 0) {
                // 重置插件按钮状态
                self.checked = false;
                
                // 刷新工具栏显示
                fsbc.refreshAddonCommands();
                
                // 停止定时器，释放资源
                timer.invalidate();
                
                JSB.log('🌈🌈🌈 MNLOG timer invalidate, timeoutCount: %@', timeoutCount);
                return;
              }
            });
            
          } else {
            // 用户没有输入有效的页码，直接重置状态
            self.checked = false;
            fsbc.refreshAddonCommands();
          }
        }
      );
    },
    
  }, /*Class members*/ {
    // ==================== 类方法定义 ====================
    // 这些是静态方法，属于类而不是实例
    
    /**
     * addonDidConnect: 插件连接到应用时调用
     * 这是插件级别的初始化，只在插件加载时调用一次
     * 可以在这里进行全局初始化
     */
    addonDidConnect: function() {
    },
    
    /**
     * addonWillDisconnect: 插件即将断开连接
     * 可以在这里进行全局清理工作
     */
    addonWillDisconnect: function() {
    },
    
    /**
     * applicationWillEnterForeground: 应用进入前台
     * applicationDidEnterBackground: 应用进入后台
     * 这些方法用于处理应用的前后台切换
     * 可以在这里暂停/恢复某些操作
     */
    applicationWillEnterForeground: function() {
    },
    applicationDidEnterBackground: function() {
    },
    
    /**
     * applicationDidReceiveLocalNotification: 收到本地通知
     * @param {object} notify - 通知对象
     * 可以处理来自系统或其他插件的通知
     */
    applicationDidReceiveLocalNotification: function(notify) {
    },
  });
  
  // 返回插件类定义
  // MarginNote 会使用这个类创建插件实例
  return newAddonClass;
};

/**
 * ==================== 总结与学习要点 ====================
 * 
 * 1. 插件架构：
 *    - 使用 JSBridge 连接 JavaScript 和 Objective-C
 *    - 生命周期驱动的设计模式
 *    - 多窗口支持（每个窗口独立实例）
 * 
 * 2. 数据管理：
 *    - NSUserDefaults 持久化存储
 *    - 文档 MD5 作为唯一标识
 *    - 实时保存策略
 * 
 * 3. UI 交互：
 *    - 原生 UIAlertView 对话框
 *    - 工具栏按钮集成
 *    - 异步状态管理
 * 
 * 4. 巧妙设计：
 *    - 复用系统功能而非重新实现
 *    - 简单的输入格式设计
 *    - 偏移量计算的透明处理
 * 
 * 5. 潜在问题：
 *    - timeoutCount 全局变量
 *    - 缺少输入验证
 *    - 定时器轮询效率
 *    - 错误处理不完善
 * 
 * 6. 改进方向：
 *    - 集成 MNUtils 框架
 *    - 添加输入验证和错误提示
 *    - 优化异步状态管理
 *    - 支持更多功能（历史记录、批量设置等）
 */