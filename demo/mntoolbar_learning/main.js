JSB.newAddon = function (mainPath) {
  JSB.require('utils')
  if (!pluginDemoUtils.checkMNUtilsFolder(mainPath)) {return undefined}
  /**
   *   用餐厅来理解多个类

    想象你要开一家餐厅，你不会让一个人做所有事情，而是会分工：

    餐厅系统 {
      总经理    // 负责整体运营
      前台经理  // 负责接待客人
      厨房经理  // 负责做菜
      收银经理  // 负责结账
    }

    * MNToolbar 的三个类

    在 MNToolbar 项目中，也是这样分工的：

    1. MNToolbar（总经理）- main.js

    var MNToolbarClass = JSB.defineClass('MNToolbar : JSExtension', {
      // 我是总经理，负责：
      // - 插件的启动和关闭
      // - 协调各个部门
      // - 处理 MarginNote 的通知
    })

    2. toolbarController（前台经理）- webviewController.js

    var toolbarController = JSB.defineClass('toolbarController : 
    UIViewController', {
      // 我是前台经理，负责：
      // - 管理工具栏界面
      // - 处理按钮点击
      // - 显示和隐藏工具栏
    })

    3. settingController（设置经理）- settingController.js

    var settingController = JSB.defineClass('settingController : 
    UIViewController', {
      // 我是设置经理，负责：
      // - 管理设置界面
      // - 保存用户配置
      // - 处理设置选项
    })

    为什么要分开？

    1. 各司其职

    // ❌ 如果所有代码都放在一个类里
    MNToolbar {
      处理插件启动()
      管理工具栏()
      处理按钮点击()
      管理设置界面()
      保存配置()
      // ... 1000行代码，太乱了！
    }

    // ✅ 分开后，每个类职责清晰
    MNToolbar {
      处理插件启动()
    }

    toolbarController {
      管理工具栏()
      处理按钮点击()
    }

    settingController {
      管理设置界面()
      保存配置()
    }

    2. 更容易维护

    // 需要修改工具栏？只需要看 webviewController.js
    // 需要修改设置？只需要看 settingController.js
    // 不用在一个巨大的文件里找来找去

    它们如何协作？

    // 1. 主类创建其他类的实例
    MNToolbar {
      notebookWillOpen: function() {
        // 创建工具栏
        self.addonController = toolbarController.new()

        // 需要设置时，创建设置界面
        self.settingController = settingController.new()
      }
    }

    // 2. 它们之间可以互相调用
    toolbarController {
      openSettings: function() {
        // 工具栏可以打开设置
        self.settingController.show()
      }
    }

    * 用建房子来理解

    想象你要建一栋房子：

    // 总承包商（MNToolbar - main.js）
    总承包商 {
      开工: function() {
        // 我需要各种专业团队
        this.装修队 = 装修团队.new()     // toolbarController
        this.水电工 = 水电团队.new()     // settingController
      }
    }

    // 装修团队（toolbarController）
    装修团队 {
      刷墙: function() { }
      铺地板: function() { }
    }

    // 水电团队（settingController）
    水电团队 {
      装电线: function() { }
      装水管: function() { }
    }
   */
  JSB.require('webviewController');
  JSB.require('settingController');
  /** @return {MNPluginDemoClass} */
  /**
   * self 其实充当了 this 的角色
   * 
   * 
   * 为什么都叫 self？

  这是 JSB 框架的约定：
  - 每个类被实例化时，JSB 都会在该文件的作用域内创建一个 self 变量
  - 这个 self 指向当前文件定义的类的实例

  就像每个班级都有"班长"，但每个班的班长是不同的人：
  - 一班的班长 = 张三
  - 二班的班长 = 李四
  - 虽然都叫"班长"，但指的不是同一个人


  * 为什么要替代 this？

  正常 JavaScript 中

  class Person {
    constructor(name) {
      this.name = name;  // this 指向实例
    }

    sayHello() {
      console.log(`我是${this.name}`);  // this 正常工作
    }
  }

  const 小明 = new Person("小明");
  小明.sayHello();  // "我是小明" ✅

  JSB 框架中的问题

  var MNToolbarClass = JSB.defineClass("MNToolbar", {
    sceneWillConnect: function() {
      // ❌ 这里的 this 可能不是你想的那个对象！
      // JSB 框架调用这个方法时，this 的指向可能被改变
      this.someProperty = "value";  // 可能出错！
    }
  })

  self 就是"正确的 this"

  // JSB 框架的解决方案
  const getMNToolbarClass = ()=>self  // self 是"正确的 this"

  sceneWillConnect: function() {
    let self = getMNToolbarClass()  // 获取"正确的 this"
    self.someProperty = "value"      // 相当于正常情况下的 
  this.someProperty
  }


  对比理解

  标准 JavaScript

  class MyClass {
    method() {
      this.property = "value"      // 直接用 this
      this.doSomething()          // 直接用 this
    }
  }

  JSB 框架

  var MyClass = JSB.defineClass("MyClass", {
    method: function() {
      let self = getMyClass()      // 先获取"正确的 this"
      self.property = "value"      // 用 self 代替 this
      self.doSomething()          // 用 self 代替 this
    }
  })

  为什么 JSB 中 this 不可靠？

  JSB 是 JavaScript 和 Objective-C 的桥接框架，当 Objective-C 调用
  JavaScript 方法时：

  // Objective-C 调用时可能是这样的：
  [某个对象 performSelector:@selector(sceneWillConnect)]

  // 这时 JavaScript 中的 this 可能指向：
  // - 桥接对象
  // - 全局对象
  // - undefined
  // 总之不是你的实例！

  * 用演员和角色来理解

  // 正常情况（标准 JavaScript）
  演员 {
    台词: function() {
      console.log(`我是${this.名字}`)  // "我"就是这个演员
    }
  }

  // JSB 框架的情况
  演员 {
    台词: function() {
      // 导演："这里的'我'可能指向摄像机、灯光师或其他人..."
      // 演员："那我怎么说台词？"
      // 导演："用这个办法..."

      let self = 找到真正的我()  // 确保 self 是这个演员
      console.log(`我是${self.名字}`)  // 现在肯定是对的
    }
  }


   *   self vs this

  | 特性   | this         | self (通过函数获取) |
  |------|--------------|---------------|
  | 含义   | "谁在调用我"      | "插件实例"        |
  | 可靠性  | 在 JSB 中不可靠 ❌ | 始终可靠 ✅        |
  | 使用方式 | 直接使用         | 通过函数获取        |

    记忆口诀

    this 会变，不可靠
    self 全局，要函数找
    getMNToolbarClass 是电话
    打通就能找到真身了

    标准流程

    每当你在 JSB 的方法中需要访问实例时：

    // 1. 不要用 this
    // 2. 调用对应的 get 函数
    let self = getXXXController()
    // 3. 现在可以安全使用 self 了
    self.属性 = 值
    self.方法()

    这就像是：
    - this = "看谁在叫我"（会变）
    - self = "我的身份证"（不变）
    - getXXX() = "身份证查询系统"（可靠）


   * 为什么不直接用 self？

  你可能会问：为什么不直接写 self.init() 呢？

  // ❌ 可能出问题
  sceneWillConnect: function() {
    self.init()  // 如果有多个插件，self 可能被覆盖！
  }

  // ✅ 更安全
  sceneWillConnect: function() {
    let self = getMNToolbarClass()  // 确保获取的是这个插件的实例
    self.init()
  }


  * 总结 * 

  // self 的角色
  self = 稳定可靠的 this
  this = 不稳定不可靠的指向

  // 使用规则
  在 JSB 框架中：
  - 永远不要用 this
  - 永远用 self 来代替 this
  - self 就是"正确的 this"

  简单记忆：
  - 标准 JS：用 this
  - JSB 框架：用 self（通过 getXXX 函数获取）
  - self = "可靠的 this"
   */
  const getPluginDemoClass = ()=>self  
  /**
   * JSB.defineClass 接受三个参数：
    1. 类名
    2. Instance members（实例成员）
    3. Class members（类成员）
     
    * 用班级来理解

      想象一个学校班级：

      Instance members = 每个学生自己的东西

      // 每个学生都有自己的：
      - 姓名（张三、李四、王五...）
      - 座位（第1排、第2排...）
      - 书包（自己的书包）
      - 作业（自己写的作业）

      Class members = 整个班级共享的东西

      // 整个班级共同拥有的：
      - 教室（只有一间）
      - 黑板（大家共用）
      - 班规（统一的规定）
      - 班主任电话（都是同一个）

      在代码中的体现

      var MNToolbarClass = JSB.defineClass(
        'MNToolbar : JSExtension',

        { //Instance members - 每个插件实例自己的方法
          sceneWillConnect: function() {
            // 这个插件窗口连接时
          },
          notebookWillOpen: function(notebookid) {
            // 这个插件打开笔记本时
          },
          toggleDynamic: function() {
            // 这个插件切换动态模式
          }
        },

        { //Class members - 所有插件共享的方法
          addonDidConnect: function() {
            // 插件类被加载时（只执行一次）
          },
          addonWillDisconnect: function() {
            // 插件类被卸载时（只执行一次）
          }
        }
      );

      * 具体例子

      Instance members（每个窗口都有自己的）

      // 假设你打开了3个 MarginNote 窗口
      窗口1：self.notebookid = "笔记本A"
      窗口2：self.notebookid = "笔记本B"
      窗口3：self.notebookid = "笔记本C"

      // 每个窗口的 toggleDynamic 只影响自己
      窗口1.toggleDynamic() // 只影响窗口1
      窗口2.toggleDynamic() // 只影响窗口2

      Class members（所有窗口共享）

      // addonWillDisconnect 删除配置时
      // 会影响所有窗口，因为配置是共享的
      addonWillDisconnect: function() {
        // 删除的配置对所有窗口都生效
        toolbarConfig.remove("MNToolbar_dynamic")
      }

      * 手机 APP 的例子

      // Instance members = 每个微信窗口
      - 你可以同时打开多个聊天窗口
      - 每个窗口显示不同的聊天内容
      - 关闭一个窗口不影响其他窗口

      // Class members = 微信 APP 本身
      - 卸载微信 APP 会删除所有数据
      - 微信的版本号是统一的
      - 退出登录影响所有窗口
   */
  var MNPluginDemoClass = JSB.defineClass(
    'PluginDemo : JSExtension', // 继承插件基类，能接收 MarginNote 事件,   - JSExtension：像是"插件许可证"，有了它才能作为 MarginNote 插件
    { 
      /* Instance members */
      /**
       *   JSB.defineClass 可以定义的方法类型
       * 实际上，JSB.defineClass 内部可以定义三种类型的方法：
      1. MarginNote 生命周期方法（插件框架调用）

      // 这些是 MarginNote 插件框架定义的标准方法
      sceneWillConnect: function() { },
      notebookWillOpen: function(notebookid) { },
      notebookWillClose: function(notebookid) { },

        什么是生命周期？

        想象一个学生的一天：

        起床 → 吃早餐 → 上学 → 放学 → 做作业 → 睡觉

        这就是一个"生命周期"！每个阶段都会发生特定的事情。

        插件的生命周期就像这样：

        // 插件的"一天"
        sceneWillConnect()      // "起床" - 插件被打开
        notebookWillOpen()      // "上学" - 笔记本被打开
        notebookWillClose()     // "放学" - 笔记本被关闭  
        sceneDidDisconnect()    // "睡觉" - 插件被关闭

      2. 通知回调方法（通过观察者模式调用）

      // 这些是用来响应通知的方法
      onPopupMenuOnNote: function(sender) { },
      onToggleDynamic: function() { },
      onRefreshView: function(sender) { },

      * 什么是观察者模式？

      想象你订阅了外卖平台的通知：

      外卖平台："你的外卖到了！" → 你收到通知 → 下楼取外卖
      外卖平台："有优惠券！" → 你收到通知 → 打开看看

      这就是观察者模式！你"观察"（订阅）了外卖平台，当有事情发生时，它会通知你
      。

      在代码中：

      // 订阅通知（就像订阅外卖通知）
      MNUtil.addObserver(self, 'onPopupMenuOnNote:', 'PopupMenuOnNote')

      // 当用户点击笔记时，MarginNote 会"通知"你
      onPopupMenuOnNote: function(sender) {
        // 收到通知后要做的事（就像收到外卖通知后下楼）
        MNUtil.showHUD("有人点击了笔记！")
      }


      * 回调函数 = "做完了通知我"的函数

      - 你先告诉系统："发生这件事的时候，调用这个函数"
      - 然后你就可以去做别的事了
      - 当那件事真的发生时，系统会自动调用你的函数

      就像：
      - 设置闹钟 = 设置回调
      - 闹钟响了 = 执行回调
      - 你起床 = 回调函数里的代码

      3. 命令方法（通过命令系统调用）

      // 这些是注册到命令系统的方法
      toggleDynamic: function() { },
      openDocument: function(button) { },
      toggleToolbarDirection: function(source) { },

      * 什么是命令方法？

      想象电视遥控器：

      按"开机"键 → 电视执行"开机"命令
      按"换台"键 → 电视执行"换台"命令
      按"音量+"键 → 电视执行"增加音量"命令

      命令方法就像遥控器按键，用户点击界面上的按钮时，会执行对应的命令。

      // 这些都是"遥控器按键"（命令）
      toggleDynamic: function() {    // "切换动态模式"按键
        // 执行切换操作
      },
      openDocument: function() {     // "打开文档"按键
        // 执行打开操作
      }

      * 为什么 toggleDynamic 可以放在里面？

      看第 32 行的代码：
      MNUtil.addObserver(self, 'onToggleDynamic:', 'toggleDynamic')

      这行代码的含义是：
      - 监听名为 'toggleDynamic' 的通知
      - 当收到通知时，调用 self 的 onToggleDynamic: 方法

      但实际上，因为 JSB 框架的特殊性，当你在 JSB.defineClass 中定义了 toggleDynamic
      方法，系统会自动为它生成一个选择器（selector）。这个选择器可以被：
      1. 命令系统调用（通过 queryAddonCommandStatus 和 handleAddonCommand）
      2. 通知系统调用（通过 MNUtil.addObserver）
      3. 直接调用（self.toggleDynamic()）

      那么如何判断哪些方法可以放在 JSB.defineClass 内部呢？

      ✅ 可以放在内部的：

      1. 生命周期方法：MarginNote 定义的标准接口
      2. 命令方法：会被 handleAddonCommand 调用的
      3. 通知回调方法：通过 MNUtil.addObserver 注册的
      4. 被框架直接调用的方法：如 queryAddonCommandStatus

      ❌ 必须通过 prototype 添加的：

      1. 纯业务逻辑方法：如 ensureView、checkUpdate
      2. 工具方法：如 getImage、parseFrame
      3. 不被框架调用的辅助方法

      实际例子对比

      var MNToolbarClass = JSB.defineClass("MNToolbar: JSExtension", {
        // ✅ 可以放在内部：生命周期方法
        sceneWillConnect: function() { },

        // ✅ 可以放在内部：命令方法（被 handleAddonCommand 调用）
        toggleDynamic: function() { },

        // ✅ 可以放在内部：通知回调
        onPopupMenuOnNote: function(sender) { }
        });

        // ❌ 必须用 prototype：纯业务逻辑
        MNToolbarClass.prototype.ensureView = function() { }

        // ❌ 必须用 prototype：工具方法
        MNToolbarClass.prototype.getImage = function() { }

        总结

        JSB.defineClass 不仅仅能定义生命周期方法，还能定义：
        - 会被 MarginNote 框架调用的方法（通过命令系统）
        - 会被通知系统调用的方法
        - 任何需要与 Objective-C 运行时交互的方法

        而必须使用 prototype 的是那些纯 JavaScript 的业务逻辑方法，这些方法不需要与原生框架交互。
       */
      /**
       * 🚀 插件场景连接时调用 - 插件生命周期的开始
       * 
       * 【生命周期位置】
       * 这是插件生命周期的第一个方法，在以下时机被调用：
       * 1. 用户首次启用插件
       * 2. MarginNote 启动时自动加载已启用的插件
       * 3. 用户在设置中重新启用插件
       * 
       * 【主要职责】
       * 1. 🏗️ 初始化插件基础设施
       * 2. 📦 加载必要的依赖模块
       * 3. 🔧 设置全局配置
       * 4. 🎨 准备 UI 资源
       * 
       * 【典型初始化内容】
       * ```javascript
       * sceneWillConnect: async function() {
       *   // 1. 初始化工具函数
       *   MNUtil.init(self.path)
       *   
       *   // 2. 加载配置
       *   await toolbarConfig.loadConfig()
       *   
       *   // 3. 创建控制器
       *   self.webviewController = new WebViewController()
       *   
       *   // 4. 注册通知监听
       *   self.registerNotifications()
       * }
       * ```
       * 
       * 【注意事项】
       * - ⚡ 使用 async 支持异步操作（如加载配置文件）
       * - 🚫 避免在此处创建 UI，应等到 notebookWillOpen
       * - ⏱️ 保持快速执行，避免阻塞插件加载
       * - 🛡️ 使用 try-catch 处理初始化错误
       * 
       * @async
       * @returns {Promise<void>}
       */
      sceneWillConnect: async function () { //Window initialize
      },
      /**
       * 👋 插件场景断开连接时调用 - 插件生命周期的结束
       * 
       * 【调用时机】
       * 1. 🔌 用户在插件管理页面关闭插件（取消勾选）
       * 2. 🔄 MarginNote 准备重新加载插件
       * 3. 🚪 应用退出前的清理阶段
       * 
       * 【重要说明】
       * 这是关闭插件，而不是删除插件。插件的文件和配置都会保留。
       * 
       * 【主要职责】
       * 1. 💾 保存用户数据和状态
       * 2. 🧹 清理资源（定时器、监听器等）
       * 3. 🔓 释放内存占用
       * 4. 📤 同步未保存的更改
       * 
       * 【典型清理操作】
       * ```javascript
       * sceneDidDisconnect: function() {
       *   // 1. 保存配置
       *   toolbarConfig.save()
       *   
       *   // 2. 清理定时器
       *   if (self.autoSaveTimer) {
       *     clearInterval(self.autoSaveTimer)
       *   }
       *   
       *   // 3. 移除通知监听
       *   NSNotificationCenter.defaultCenter.removeObserver(self)
       *   
       *   // 4. 清理 UI 资源
       *   if (self.webviewController) {
       *     self.webviewController.cleanup()
       *   }
       * }
       * ```
       * 
       * 【最佳实践】
       * - ✅ 确保所有异步操作已完成
       * - ✅ 保存用户的工作状态
       * - ✅ 清理所有创建的对象引用
       * - ❌ 不要在此处显示 UI 提示（用户可能看不到）
       * 
       * @returns {void}
       */
      sceneDidDisconnect: function () { // Window disconnect 在插件页面关闭插件（不是删除）
      },
      /**
       * 😴 窗口即将失去活跃状态时调用
       * 
       * 【调用时机】
       * 1. 🔄 用户切换到其他应用
       * 2. 📱 设备进入后台（iOS）
       * 3. 🖥️ 窗口最小化（macOS）
       * 4. 🔒 设备即将锁屏
       * 
       * 【使用场景】
       * 1. ⏸️ 暂停正在进行的动画或计时器
       * 2. 💾 保存临时状态（轻量级保存）
       * 3. 🔇 暂停音频/视频播放
       * 4. 📊 记录用户活动统计
       * 
       * 【与 sceneDidDisconnect 的区别】
       * - sceneWillResignActive：临时失去焦点，插件仍在运行
       * - sceneDidDisconnect：插件完全关闭
       * 
       * 【注意事项】
       * - ⚡ 快速执行，系统可能会强制终止耗时操作
       * - 🔄 准备好在 sceneDidBecomeActive 中恢复状态
       * - 💾 只做必要的保存，避免大量 I/O 操作
       * 
       * @returns {void}
       */
      sceneWillResignActive: function () { // Window resign active
      },
      /**
       * 🌟 窗口变为活跃状态时调用
       * 
       * 【调用时机】
       * 1. 🔄 用户切换回 MarginNote
       * 2. 📱 应用从后台返回前台（iOS）
       * 3. 🖥️ 窗口从最小化恢复（macOS）
       * 4. 🔓 设备解锁后
       * 
       * 【使用场景】
       * 1. ▶️ 恢复暂停的动画或计时器
       * 2. 🔄 刷新可能过期的数据
       * 3. 📡 检查网络状态变化
       * 4. 🎨 更新 UI 显示状态
       * 
       * 【典型恢复操作】
       * ```javascript
       * sceneDidBecomeActive: function() {
       *   // 1. 恢复动画
       *   if (self.animationPaused) {
       *     self.resumeAnimations()
       *   }
       *   
       *   // 2. 刷新数据
       *   self.checkForUpdates()
       *   
       *   // 3. 更新 UI
       *   self.updateToolbarDisplay()
       * }
       * ```
       * 
       * 【最佳实践】
       * - ✅ 检查并恢复在 sceneWillResignActive 中暂停的操作
       * - ✅ 刷新可能已经改变的外部数据
       * - ❌ 避免重复初始化已存在的资源
       * 
       * @returns {void}
       */
      sceneDidBecomeActive: function () { // Window become active
      },
      /**
       * 📖 笔记本即将打开时调用 - 插件的主要工作开始
       * 
       * 【调用时机】
       * 1. 📚 用户打开一个笔记本
       * 2. 🔄 切换到另一个笔记本
       * 3. 🌟 MarginNote 启动后恢复上次打开的笔记本
       * 
       * 【重要性】
       * 这是插件最重要的生命周期方法之一！大部分插件功能都在这里初始化。
       * 
       * 【主要职责】
       * 1. 🎨 创建和显示 UI 界面（工具栏、按钮等）
       * 2. 📡 注册事件监听器和通知
       * 3. 📋 加载笔记本特定的配置
       * 4. 🔗 建立与其他插件的连接
       * 
       * 【典型初始化流程】
       * ```javascript
       * notebookWillOpen: async function(notebookid) {
       *   // 1. 保存笔记本 ID
       *   self.notebookId = notebookid
       *   
       *   // 2. 加载笔记本配置
       *   await self.loadNotebookConfig(notebookid)
       *   
       *   // 3. 创建工具栏 UI
       *   self.createToolbar()
       *   
       *   // 4. 注册监听器
       *   self.registerNotebookListeners()
       *   
       *   // 5. 显示欢迎提示
       *   MNUtil.showHUD("工具栏已加载")
       * }
       * ```
       * 
       * 【参数说明】
       * @param {string} notebookid - 笔记本的唯一标识符
       *                              可以用来：
       *                              - 加载笔记本特定配置
       *                              - 获取笔记本信息
       *                              - 保存笔记本相关数据
       * 
       * 【注意事项】
       * - ⚡ 使用 async 支持异步加载
       * - 🛡️ 处理好笔记本不存在或损坏的情况
       * - 🔄 如果切换笔记本，要先调用 notebookWillClose
       * - 🎨 UI 创建应在此处进行，而不是 sceneWillConnect
       * 
       * @async
       * @returns {Promise<void>}
       */
      notebookWillOpen: async function (notebookid) {
      },
      /**
       * 📕 笔记本即将关闭时调用 - 清理和保存
       * 
       * 【调用时机】
       * 1. 🔄 用户切换到其他笔记本
       * 2. 📴 用户关闭当前笔记本
       * 3. 🚪 MarginNote 准备退出
       * 
       * 【主要职责】
       * 1. 💾 保存笔记本特定的状态和配置
       * 2. 🧹 清理笔记本相关的资源
       * 3. 📡 移除笔记本级别的监听器
       * 4. 🎨 隐藏或销毁 UI 元素
       * 
       * 【清理流程示例】
       * ```javascript
       * notebookWillClose: function(notebookid) {
       *   // 1. 保存状态
       *   self.saveToolbarState(notebookid)
       *   
       *   // 2. 保存用户偏好
       *   self.saveUserPreferences(notebookid)
       *   
       *   // 3. 清理 UI
       *   if (self.toolbar) {
       *     self.toolbar.hide()
       *   }
       *   
       *   // 4. 移除监听器
       *   self.removeNotebookListeners()
       *   
       *   // 5. 释放内存
       *   self.notebookData = null
       * }
       * ```
       * 
       * 【与 notebookWillOpen 的关系】
       * - 切换笔记本时：先调用旧笔记本的 close，再调用新笔记本的 open
       * - 在 close 中保存的数据，可以在下次 open 时恢复
       * 
       * 【注意事项】
       * - ✅ 确保保存所有重要数据
       * - ✅ 清理特定于该笔记本的资源
       * - ❌ 不要清理全局资源（可能即将打开新笔记本）
       * - 🛡️ 处理好异步保存失败的情况
       * 
       * @param {string} notebookid - 即将关闭的笔记本 ID
       * @returns {void}
       */
      notebookWillClose: function (notebookid) {
      },
      /**
       * ✏️ 处理新摘录时调用 - 自动处理刚创建的摘录
       * 
       * 【调用时机】
       * 当用户创建新摘录后立即触发：
       * 1. 📝 选中文本或图片创建摘录
       * 2. 📸 截图创建摘录
       * 3. 🎨 手写创建摘录
       * 
       * 【使用场景】
       * 1. 🏷️ 自动添加标签或分类
       * 2. 🎨 根据内容自动设置颜色
       * 3. 🔗 自动关联相关笔记
       * 4. 🤖 AI 分析和增强
       * 
       * 【sender 参数结构】
       * ```javascript
       * sender = {
       *   userInfo: {
       *     noteid: "xxx",      // 新创建的摘录 ID
       *     note: MNNote,        // 摘录对象
       *     excerptText: "...",  // 摘录文本
       *     documentPath: "..."  // 源文档路径
       *   }
       * }
       * ```
       * 
       * 【典型处理示例】
       * ```javascript
       * onProcessNewExcerpt: function(sender) {
       *   let noteId = sender.userInfo.noteid
       *   let note = MNNote.new(noteId)
       *   
       *   // 1. 根据内容自动分类
       *   if (note.excerptText.includes("定义")) {
       *     note.appendTags(["概念"])
       *     note.colorIndex = 2  // 蓝色
       *   }
       *   
       *   // 2. 自动添加时间戳
       *   note.appendTextComment(new Date().toLocaleDateString())
       * }
       * ```
       * 
       * 【最佳实践】
       * - ✅ 使用 MNUtil.undoGrouping 保证操作可撤销
       * - ✅ 快速处理，避免阻塞用户操作
       * - ✅ 提供用户设置选项来开启/关闭此功能
       * - ❌ 避免复杂耗时的操作
       * 
       * @param {Object} sender - 事件发送者，包含摘录信息
       * @returns {void}
       */
      onProcessNewExcerpt:function (sender) {
      },
      /**
       * 📝 选中区域弹出菜单时调用 - 扩展选中文本的操作菜单
       * 
       * 【调用时机】
       * 用户在文档中选中文本或图片后：
       * 1. 🖱️ iOS: 长按弹出菜单
       * 2. 🖱️ macOS: 右键点击弹出菜单
       * 3. 📱 触控栏上的菜单按钮
       * 
       * 【使用场景】
       * 1. 🏠 添加自定义菜单项（快速翻译、搜索等）
       * 2. 🤖 AI 处理选中内容（总结、解释等）
       * 3. 🔗 创建特殊类型的摘录
       * 4. 🎨 自定义文本处理
       * 
       * 【sender 参数结构】
       * ```javascript
       * sender = {
       *   userInfo: {
       *     documentController: controller,  // 文档控制器
       *     selection: {                    // 选中信息
       *       text: "选中的文本",
       *       range: NSRange,
       *       rects: [CGRect],             // 选中区域矩形
       *       image: UIImage               // 如果选中的是图片
       *     },
       *     menuController: controller      // 菜单控制器
       *   }
       * }
       * ```
       * 
       * 【添加菜单项示例】
       * ```javascript
       * onPopupMenuOnSelection: async function(sender) {
       *   if (!sender.userInfo.menuController) return
       *   
       *   let menuController = sender.userInfo.menuController
       *   let selectedText = sender.userInfo.selection.text
       *   
       *   // 添加翻译菜单
       *   menuController.commandTable.push({
       *     title: "🌍 翻译",
       *     object: self,
       *     selector: "translateSelection:",
       *     param: {text: selectedText}
       *   })
       *   
       *   // 添加搜索菜单
       *   menuController.commandTable.push({
       *     title: "🔍 搜索",
       *     object: self,
       *     selector: "searchSelection:",
       *     param: {text: selectedText}
       *   })
       * }
       * ```
       * 
       * 【注意事项】
       * - ✅ 检查 menuController 是否存在
       * - ✅ 使用 async 支持异步操作
       * - ✅ 保持菜单项简洁明了
       * - ❌ 不要添加太多菜单项（影响用户体验）
       * 
       * @async
       * @param {Object} sender - 事件发送者，包含选中信息和菜单控制器
       * @returns {Promise<void>}
       */
      onPopupMenuOnSelection: async function (sender) { // Clicking note
      },
      /**
       * 🚪 选中区域弹出菜单关闭时调用
       * 
       * 【调用时机】
       * 1. ✅ 用户选择了菜单项
       * 2. ❌ 用户取消了菜单
       * 3. 🔄 用户点击了菜单外的区域
       * 
       * 【使用场景】
       * 1. 🧹 清理临时资源
       * 2. 📋 记录用户操作统计
       * 3. 🔄 恢复 UI 状态
       * 4. 💾 保存用户选择
       * 
       * 【与 onPopupMenuOnSelection 的关系】
       * - onPopupMenuOnSelection: 菜单显示前，用于添加菜单项
       * - onClosePopupMenuOnSelection: 菜单关闭后，用于清理
       * 
       * 【注意事项】
       * - 🔄 此方法总是会被调用，无论用户是否选择了菜单项
       * - ⚡ 避免执行耗时操作
       * - 🧠 可以通过全局变量跟踪用户选择了什么
       * 
       * @async
       * @param {Object} sender - 事件发送者
       * @returns {Promise<void>}
       */
      onClosePopupMenuOnSelection: async function (sender) {
      },
      /**
       * 📄 笔记弹出菜单时调用 - 扩展笔记操作菜单
       * 
       * 【调用时机】
       * 用户在笔记上操作时：
       * 1. 🖱️ iOS: 长按笔记卡片
       * 2. 🖱️ macOS: 右键点击笔记
       * 3. 📂 在脑图或大纲视图中操作笔记
       * 
       * 【使用场景】
       * 1. 🎨 添加笔记处理功能（制卡、分类等）
       * 2. 🔗 创建笔记关联操作
       * 3. 📊 笔记统计和分析
       * 4. 🎯 批量处理操作
       * 
       * 【sender 参数结构】
       * ```javascript
       * sender = {
       *   userInfo: {
       *     note: MNNote,                  // 当前操作的笔记
       *     notes: [MNNote],               // 选中的所有笔记（多选）
       *     menuController: controller,    // 菜单控制器
       *     documentController: controller // 文档控制器
       *   }
       * }
       * ```
       * 
       * 【添加菜单项示例】
       * ```javascript
       * onPopupMenuOnNote: async function(sender) {
       *   if (!sender.userInfo.menuController) return
       *   
       *   let menuController = sender.userInfo.menuController
       *   let note = sender.userInfo.note
       *   let notes = sender.userInfo.notes || [note]
       *   
       *   // 添加制卡功能
       *   menuController.commandTable.push({
       *     title: "🃏 制作卡片",
       *     object: self,
       *     selector: "makeFlashcard:",
       *     param: {notes: notes}
       *   })
       *   
       *   // 添加 AI 总结
       *   menuController.commandTable.push({
       *     title: "🤖 AI 总结",
       *     object: self,
       *     selector: "aiSummarize:",
       *     param: {note: note}
       *   })
       *   
       *   // 如果是多选，添加批量操作
       *   if (notes.length > 1) {
       *     menuController.commandTable.push({
       *       title: `📦 批量处理 (${notes.length})个`,
       *       object: self,
       *       selector: "batchProcess:",
       *       param: {notes: notes}
       *     })
       *   }
       * }
       * ```
       * 
       * 【高级技巧】
       * 1. 🎯 根据笔记类型添加不同菜单
       * 2. 🔢 支持多选操作
       * 3. 🎭 根据用户权限显示不同菜单
       * 4. 📈 添加菜单项排序
       * 
       * @async
       * @param {Object} sender - 事件发送者，包含笔记信息和菜单控制器
       * @returns {Promise<void>}
       */
      onPopupMenuOnNote: async function (sender) { // Clicking note
      },
      /**
       * 🚪 笔记弹出菜单关闭时调用
       * 
       * 【调用时机】
       * 与 onClosePopupMenuOnSelection 类似，在笔记菜单关闭时触发：
       * 1. ✅ 用户选择了菜单项
       * 2. ❌ 用户取消了菜单
       * 3. 🔄 用户点击了菜单外的区域
       * 
       * 【使用场景】
       * 1. 🧹 清理笔记操作的临时数据
       * 2. 📊 记录用户对笔记的操作统计
       * 3. 🔄 恢复笔记显示状态
       * 4. 🛡️ 取消未完成的操作
       * 
       * 【与 onPopupMenuOnNote 的配合】
       * ```javascript
       * // 在 onPopupMenuOnNote 中设置临时状态
       * self.tempNoteData = {noteId: note.noteId, action: "pending"}
       * 
       * // 在 onClosePopupMenuOnNote 中清理
       * if (self.tempNoteData && self.tempNoteData.action === "pending") {
       *   // 用户没有选择任何操作
       *   self.tempNoteData = null
       * }
       * ```
       * 
       * 【注意事项】
       * - 🔄 此方法总是会被调用
       * - ⚡ 保持快速执行
       * - 🧠 可以用于跟踪用户行为
       * 
       * @async
       * @param {Object} sender - 事件发送者
       * @returns {Promise<void>}
       */
      onClosePopupMenuOnNote: async function (sender) {
      },
      /**
       * 📄 文档打开时调用 - 处理文档级别的初始化
       * 
       * 【调用时机】
       * 1. 📚 用户打开 PDF/ePub 文档
       * 2. 🔄 在笔记本中切换文档
       * 3. 📥 从外部打开文档链接
       * 
       * 【使用场景】
       * 1. 📑 加载文档特定的设置
       * 2. 📢 显示文档信息提示
       * 3. 📋 恢复上次的阅读位置
       * 4. 🔍 预加载文档关联数据
       * 
       * 【docmd5 参数说明】
       * docmd5 是文档的唯一标识符，可以用来：
       * ```javascript
       * // 获取文档信息
       * let doc = MNUtil.getDocById(docmd5)
       * let docPath = doc.fullPathFileName
       * let docTitle = doc.docTitle
       * 
       * // 保存文档特定设置
       * self.docSettings[docmd5] = {
       *   lastPage: 1,
       *   zoom: 1.0
       * }
       * ```
       * 
       * 【与 notebookWillOpen 的区别】
       * - notebookWillOpen: 整个笔记本级别
       * - documentDidOpen: 单个文档级别
       * - 一个笔记本可以包含多个文档
       * 
       * 【注意事项】
       * - 💾 文档可能很大，避免加载过多数据
       * - 🔄 同一文档可能被多次打开
       * - 🧠 使用 docmd5 作为缓存键值
       * 
       * @param {string} docmd5 - 文档的 MD5 标识符
       * @returns {void}
       */
      documentDidOpen: function (docmd5) {
      },
      /**
       * 🔓 文档即将关闭时调用 - 保存文档状态
       * 
       * 【调用时机】
       * 1. 🔄 用户切换到其他文档
       * 2. 📕 用户关闭当前文档
       * 3. 📋 笔记本关闭时所有文档都会关闭
       * 
       * 【主要职责】
       * 1. 💾 保存阅读进度和位置
       * 2. 📋 保存文档特定设置
       * 3. 🧹 清理文档相关缓存
       * 4. 📈 记录阅读统计
       * 
       * 【保存状态示例】
       * ```javascript
       * documentWillClose: function(docmd5) {
       *   // 1. 保存阅读位置
       *   let currentPage = MNUtil.currentDocumentPage
       *   self.saveReadingProgress(docmd5, currentPage)
       *   
       *   // 2. 保存视图设置
       *   let zoom = MNUtil.currentZoomLevel
       *   self.saveViewSettings(docmd5, {zoom: zoom})
       *   
       *   // 3. 清理缓存
       *   delete self.documentCache[docmd5]
       * }
       * ```
       * 
       * 【与 documentDidOpen 的配合】
       * - 在 close 中保存的数据
       * - 可以在下次 open 时恢复
       * 
       * @param {string} docmd5 - 即将关闭的文档 MD5 标识符
       * @returns {void}
       */
      documentWillClose: function (docmd5) {
      },
      /**
       * 📜 视图将要重新布局时调用 - 响应界面变化
       * 
       * 【调用时机】
       * 1. 📱 设备旋转（横竖屏切换）
       * 2. 🗔️ 分屏模式改变
       * 3. 🖼️ 窗口大小调整
       * 4. 📏 隐藏/显示工具栏
       * 
       * 【使用场景】
       * 1. 📀 调整工具栏位置和大小
       * 2. 🎨 更新按钮布局
       * 3. 🔄 重新计算元素位置
       * 4. 📰 适配不同屏幕尺寸
       * 
       * 【布局处理示例】
       * ```javascript
       * controllerWillLayoutSubviews: function(controller) {
       *   // 1. 获取新的屏幕尺寸
       *   let bounds = controller.view.bounds
       *   let isLandscape = bounds.width > bounds.height
       *   
       *   // 2. 调整工具栏位置
       *   if (self.toolbar) {
       *     if (isLandscape) {
       *       // 横屏布局
       *       self.toolbar.frame = {x: bounds.width - 60, y: 50, width: 50, height: 400}
       *     } else {
       *       // 竖屏布局
       *       self.toolbar.frame = {x: 10, y: bounds.height - 60, width: 300, height: 50}
       *     }
       *   }
       * }
       * ```
       * 
       * 【注意事项】
       * - 🔄 可能被频繁调用，要注意性能
       * - 🛡️ 避免在此处做复杂计算
       * - 🎨 只调整必要的元素
       * - 📏 使用缓存避免重复计算
       * 
       * @param {UIViewController} controller - 触发布局的控制器
       * @returns {void}
       */
      controllerWillLayoutSubviews: function (controller) {
      },
      /**
       * 🎯 查询插件命令状态 - 动态管理插件功能
       * 
       * 【调用时机】
       * MarginNote 需要更新插件菜单或工具栏状态时：
       * 1. 🔄 用户点击插件菜单
       * 2. 📋 上下文环境改变
       * 3. ⏰ 定期状态检查
       * 
       * 【返回值结构】
       * ```javascript
       * return {
       *   // 命令状态字典
       *   commands: {
       *     "openToolbar": {
       *       enabled: true,      // 是否启用
       *       checked: false,     // 是否选中
       *       hidden: false       // 是否隐藏
       *     },
       *     "toggleDynamic": {
       *       enabled: true,
       *       checked: self.dynamicMode,  // 根据当前状态
       *       hidden: false
       *     }
       *   }
       * }
       * ```
       * 
       * 【使用场景】
       * 1. ✅/❌ 启用/禁用特定功能
       * 2. ☑️ 显示功能开关状态
       * 3. 👁️ 隐藏不适用的功能
       * 4. 🎯 根据权限控制功能
       * 
       * 【实际应用示例】
       * ```javascript
       * queryAddonCommandStatus: function() {
       *   let hasNotebook = MNUtil.currentNotebookId !== null
       *   let hasSelection = MNUtil.currentSelection.onSelection
       *   
       *   return {
       *     "openToolbar": {
       *       enabled: hasNotebook,  // 有笔记本才能打开
       *       checked: self.toolbarVisible
       *     },
       *     "processSelection": {
       *       enabled: hasSelection,  // 有选中才能处理
       *       hidden: !hasNotebook
       *     }
       *   }
       * }
       * ```
       * 
       * @returns {{commands: Object.<string, {enabled: boolean, checked: boolean, hidden: boolean}>}} 
       *          返回命令状态字典
       */
      queryAddonCommandStatus: function () {
      },
      /**
       * 🎨 新图标图片事件 - 处理自定义图标
       * 
       * 【调用时机】
       * 1. 🖼️ 用户上传自定义按钮图标
       * 2. 🔄 动态更换按钮图标
       * 3. 🎨 主题切换时更新图标
       * 
       * 【sender 参数结构】
       * ```javascript
       * sender = {
       *   userInfo: {
       *     iconName: "custom_icon",    // 图标名称
       *     imageData: NSData,           // 图片数据
       *     buttonId: "button_12",       // 目标按钮 ID
       *     source: "user_upload"        // 图标来源
       *   }
       * }
       * ```
       * 
       * 【处理流程示例】
       * ```javascript
       * onNewIconImage: function(sender) {
       *   let info = sender.userInfo
       *   
       *   // 1. 保存图标数据
       *   self.saveIconData(info.iconName, info.imageData)
       *   
       *   // 2. 更新按钮图标
       *   if (info.buttonId) {
       *     let button = self.getButtonById(info.buttonId)
       *     button.setImage(UIImage.imageWithData(info.imageData))
       *   }
       *   
       *   // 3. 刷新工具栏
       *   self.refreshToolbar()
       * }
       * ```
       * 
       * 【使用场景】
       * 1. 🎨 用户自定义按钮外观
       * 2. 🎭 不同主题的图标切换
       * 3. 📂 按钮状态的视觉反馈
       * 4. 🏅 VIP 用户专属图标
       * 
       * @param {Object} sender - 事件发送者，包含图标信息
       * @returns {void}
       */
      onNewIconImage: function (sender) {
      },
      /**
       * ⚙️ 打开工具栏设置 - 响应设置请求
       * 
       * 【调用时机】
       * 1. 🔘 用户点击设置按钮
       * 2. 📡 其他插件发送设置请求
       * 3. ⌨️ 快捷键触发
       * 4. 📱 从通知中心打开
       * 
       * 【params 参数结构】
       * ```javascript
       * params = {
       *   section: "buttons",     // 指定打开的设置页面
       *   buttonId: "custom_1",   // 特定按钮设置
       *   animated: true          // 是否动画显示
       * }
       * ```
       * 
       * 【实现示例】
       * ```javascript
       * onOpenToolbarSetting: function(params) {
       *   // 1. 创建或获取设置控制器
       *   if (!self.settingController) {
       *     self.settingController = new SettingController()
       *   }
       *   
       *   // 2. 配置初始页面
       *   if (params && params.section) {
       *     self.settingController.initialSection = params.section
       *   }
       *   
       *   // 3. 显示设置界面
       *   self.settingController.show(params.animated)
       * }
       * ```
       * 
       * 【设置页面类型】
       * - "general": 常规设置
       * - "buttons": 按钮管理
       * - "appearance": 外观设置
       * - "advanced": 高级设置
       * 
       * @param {Object} params - 设置参数，指定打开的页面或配置
       * @returns {void}
       */
      onOpenToolbarSetting:function (params) {
      },
      /**
       * 🔀 切换动态模式 - 控制工具栏显示行为
       * 
       * 【动态模式说明】
       * - 启用：工具栏仅在需要时显示，操作后自动隐藏
       * - 禁用：工具栏始终显示
       * 
       * 【调用时机】
       * 1. 🔘 用户点击动态模式开关
       * 2. 📡 通过通知切换
       * 3. ⌨️ 快捷键触发
       * 4. 📱 手势操作
       * 
       * 【实现流程】
       * ```javascript
       * onToggleDynamic: function(sender) {
       *   // 1. 切换状态
       *   self.dynamicMode = !self.dynamicMode
       *   
       *   // 2. 更新 UI
       *   if (self.dynamicMode) {
       *     // 动态模式：设置自动隐藏
       *     self.toolbar.alpha = 0.8
       *     self.setupAutoHide()
       *   } else {
       *     // 普通模式：显示并停止自动隐藏
       *     self.toolbar.alpha = 1.0
       *     self.cancelAutoHide()
       *   }
       *   
       *   // 3. 保存状态
       *   toolbarConfig.dynamicMode = self.dynamicMode
       *   toolbarConfig.save()
       *   
       *   // 4. 显示提示
       *   let message = self.dynamicMode ? "动态模式已启用" : "动态模式已关闭"
       *   MNUtil.showHUD(message)
       * }
       * ```
       * 
       * 【动态模式特性】
       * 1. 👁️ 智能隐藏：操作后 3 秒自动隐藏
       * 2. 🔍 悬停显示：鼠标悬停时显示（macOS）
       * 3. 👆 触摸唤醒：点击特定区域显示（iOS）
       * 4. 🎨 半透明效果：减少视觉干扰
       * 
       * @param {Object} sender - 事件发送者
       * @returns {void}
       */
      onToggleDynamic:function (sender) {
      },
      /**
       * 🧠 切换脑图工具栏 - 控制脑图模式下的工具栏
       * 
       * 【功能说明】
       * 在脑图视图和文档视图中，工具栏可能有不同的显示需求：
       * - 文档视图：需要摘录、标注等工具
       * - 脑图视图：需要节点编辑、关联等工具
       * 
       * 【sender 参数结构】
       * ```javascript
       * sender = {
       *   userInfo: {
       *     target: "mindmap",      // 目标视图
       *     visible: true,          // 是否显示
       *     position: "right"       // 工具栏位置
       *   }
       * }
       * ```
       * 
       * 【实现流程】
       * ```javascript
       * onToggleMindmapToolbar: function(sender) {
       *   let info = sender.userInfo
       *   
       *   // 1. 判断当前视图
       *   let isMindmapView = (info.target === "mindmap")
       *   
       *   // 2. 切换工具栏状态
       *   if (isMindmapView) {
       *     // 显示脑图专用工具
       *     self.switchToMindmapTools()
       *   } else {
       *     // 显示文档专用工具
       *     self.switchToDocumentTools()
       *   }
       *   
       *   // 3. 调整位置
       *   if (info.position) {
       *     self.moveToolbarTo(info.position)
       *   }
       * }
       * ```
       * 
       * 【工具栏差异】
       * - 📑 文档模式：高亮、摘录、搜索
       * - 🧠 脑图模式：节点、连线、层级
       * - 🔄 混合模式：同时显示两种工具
       * 
       * @param {Object} sender - 事件发送者，包含视图切换信息
       * @returns {void}
       */
      onToggleMindmapToolbar:function (sender) {
      },
      /**
       * 🔄 刷新视图 - 更新插件界面
       * 
       * 【调用时机】
       * 1. 📡 其他插件请求刷新
       * 2. 🔄 数据更新后需要刷新 UI
       * 3. 🎭 主题或样式改变
       * 4. ⏰ 定时刷新
       * 
       * 【刷新内容】
       * 1. 🎨 重绘按钮和控件
       * 2. 📋 更新数据显示
       * 3. 🔄 重新加载配置
       * 4. 📀 调整布局
       * 
       * 【实现示例】
       * ```javascript
       * onRefreshView: function(sender) {
       *   // 1. 刷新工具栏
       *   if (self.toolbar) {
       *     self.toolbar.refreshButtons()
       *     self.toolbar.updateLayout()
       *   }
       *   
       *   // 2. 刷新设置界面
       *   if (self.settingController && self.settingController.isVisible) {
       *     self.settingController.refreshContent()
       *   }
       *   
       *   // 3. 发送完成通知
       *   MNUtil.postNotification("refreshCompleted", {})
       * }
       * ```
       * 
       * 【性能优化】
       * - 🔄 避免不必要的全局刷新
       * - 🎯 只刷新变化的部分
       * - ⚡ 使用增量更新
       * 
       * @param {Object} sender - 事件发送者
       * @returns {void}
       */
      onRefreshView: function (sender) {
      },
      /**
       * ☁️ 云配置变化时调用 - 同步设置更新
       * 
       * 【调用时机】
       * 1. 📤 云端配置更新
       * 2. 📱 其他设备修改了配置
       * 3. 🔄 用户手动同步
       * 4. 🌐 网络恢复后自动同步
       * 
       * 【云配置内容】
       * - 🎨 工具栏外观设置
       * - 🔘 按钮配置和顺序
       * - ⚙️ 用户偏好设置
       * - 🔑 授权和订阅信息
       * 
       * 【sender 参数结构】
       * ```javascript
       * sender = {
       *   userInfo: {
       *     configKey: "toolbar_settings",  // 配置键
       *     oldValue: {...},                 // 旧值
       *     newValue: {...},                 // 新值
       *     source: "cloud",                 // 来源
       *     timestamp: 1234567890            // 时间戳
       *   }
       * }
       * ```
       * 
       * 【处理流程】
       * ```javascript
       * onCloudConfigChange: async function(sender) {
       *   let info = sender.userInfo
       *   
       *   // 1. 验证配置有效性
       *   if (!self.validateConfig(info.newValue)) {
       *     return
       *   }
       *   
       *   // 2. 备份当前配置
       *   self.backupCurrentConfig()
       *   
       *   // 3. 应用新配置
       *   await self.applyConfig(info.newValue)
       *   
       *   // 4. 刷新 UI
       *   self.refreshAllViews()
       *   
       *   // 5. 显示同步提示
       *   MNUtil.showHUD("☁️ 配置已同步")
       * }
       * ```
       * 
       * 【冲突处理】
       * - 🔄 检测本地修改与云端冲突
       * - 🤝 提供合并选项
       * - 💾 保留冲突备份
       * 
       * @async
       * @param {Object} sender - 事件发送者，包含配置变化信息
       * @returns {Promise<void>}
       */
      onCloudConfigChange: async function (sender) {
      },
      /**
       * 🔄 手动同步 - 用户主动触发的同步操作
       * 
       * 【调用时机】
       * 1. 🔘 用户点击同步按钮
       * 2. 📡 外部通知触发
       * 3. ⌨️ 快捷键同步
       * 4. 📱 下拉刷新手势
       * 
       * 【同步内容】
       * 1. ⚙️ 用户设置和偏好
       * 2. 🎨 工具栏配置
       * 3. 🔘 按钮布局
       * 4. 📋 使用统计数据
       * 
       * 【同步流程】
       * ```javascript
       * manualSync: async function(sender) {
       *   try {
       *     // 1. 显示同步进度
       *     MNUtil.showHUD("同步中...")
       *     
       *     // 2. 保存本地更改
       *     await self.saveLocalChanges()
       *     
       *     // 3. 上传本地配置
       *     let uploadResult = await self.uploadConfig()
       *     
       *     // 4. 下载云端配置
       *     let cloudConfig = await self.downloadConfig()
       *     
       *     // 5. 合并配置
       *     let mergedConfig = await self.mergeConfigs(uploadResult, cloudConfig)
       *     
       *     // 6. 应用合并后的配置
       *     await self.applyConfig(mergedConfig)
       *     
       *     // 7. 显示成功提示
       *     MNUtil.showHUD("✅ 同步成功")
       *     
       *   } catch (error) {
       *     MNUtil.showHUD(`❌ 同步失败: ${error.message}`)
       *   }
       * }
       * ```
       * 
       * 【错误处理】
       * - 🌐 网络连接失败
       * - 🔒 认证过期
       * - 📦 存储空间不足
       * - 🔄 版本冲突
       * 
       * 【性能优化】
       * - 📤 增量同步
       * - 🗜️ 压缩数据
       * - 🕰️ 避免频繁同步
       * 
       * @async
       * @param {Object} sender - 事件发送者
       * @returns {Promise<void>}
       */
      manualSync: async function (sender) {
      },
      /**
       * ✏️ 文本开始编辑时调用 - 管理编辑状态
       * 
       * 【调用时机】
       * 1. 🖊️ 用户开始编辑笔记标题
       * 2. 📝 用户开始编辑评论
       * 3. 📋 用户开始编辑摘录
       * 4. 🏷️ 用户开始编辑标签
       * 
       * 【作用】
       * 1. 👁️ 隐藏可能遮挡键盘的 UI
       * 2. 🔒 禁用某些手势和快捷键
       * 3. 💾 保存编辑前的状态
       * 4. 🎨 调整界面布局
       * 
       * 【param 参数结构】
       * ```javascript
       * param = {
       *   textField: UITextField,      // 正在编辑的文本字段
       *   type: "title",               // 编辑类型
       *   noteId: "xxx",               // 相关笔记 ID
       *   originalText: "..."          // 原始文本
       * }
       * ```
       * 
       * 【实现示例】
       * ```javascript
       * onTextDidBeginEditing: function(param) {
       *   // 1. 保存编辑状态
       *   self.isEditing = true
       *   self.editingField = param.textField
       *   self.originalText = param.originalText
       *   
       *   // 2. 调整 UI
       *   if (self.toolbar) {
       *     // 移动工具栏避免遮挡键盘
       *     let keyboardHeight = 300  // 预估键盘高度
       *     self.toolbar.moveUp(keyboardHeight)
       *   }
       *   
       *   // 3. 暂停手势识别
       *   self.pauseGestureRecognizers()
       * }
       * ```
       * 
       * 【最佳实践】
       * - ✅ 保存原始文本以便取消编辑
       * - ✅ 灵活调整 UI 布局
       * - ❌ 不要在此时修改文本内容
       * 
       * @param {Object} param - 编辑参数，包含文本字段和相关信息
       * @returns {void}
       */
      onTextDidBeginEditing:function (param) {
      },
      /**
       * ✅ 文本结束编辑时调用 - 保存和恢复
       * 
       * 【调用时机】
       * 1. ✅ 用户完成编辑点击完成
       * 2. ❌ 用户取消编辑
       * 3. 🔄 用户切换到其他输入框
       * 4. 👁️ 键盘收起
       * 
       * 【主要任务】
       * 1. 💾 保存编辑后的内容
       * 2. 🔄 恢复 UI 布局
       * 3. ✅ 重新启用手势
       * 4. 📊 记录编辑统计
       * 
       * 【param 参数结构】
       * ```javascript
       * param = {
       *   textField: UITextField,      // 结束编辑的文本字段
       *   type: "title",               // 编辑类型
       *   noteId: "xxx",               // 相关笔记 ID
       *   newText: "...",              // 新文本
       *   originalText: "...",         // 原始文本
       *   cancelled: false             // 是否取消
       * }
       * ```
       * 
       * 【实现示例】
       * ```javascript
       * onTextDidEndEditing: function(param) {
       *   // 1. 重置编辑状态
       *   self.isEditing = false
       *   self.editingField = null
       *   
       *   // 2. 保存更改（如果未取消）
       *   if (!param.cancelled && param.newText !== param.originalText) {
       *     MNUtil.undoGrouping(() => {
       *       let note = MNNote.new(param.noteId)
       *       if (param.type === "title") {
       *         note.noteTitle = param.newText
       *       }
       *     })
       *   }
       *   
       *   // 3. 恢复 UI
       *   if (self.toolbar) {
       *     self.toolbar.restorePosition()
       *   }
       *   
       *   // 4. 恢复手势
       *   self.resumeGestureRecognizers()
       * }
       * ```
       * 
       * 【编辑验证】
       * - 🔍 检查文本有效性
       * - 🚫 过滤敏感词
       * - 📏 限制文本长度
       * 
       * @param {Object} param - 编辑结束参数，包含新旧文本等信息
       * @returns {void}
       */
      onTextDidEndEditing: function (param) {
      },
      /**
       * 🔄 刷新工具栏按钮 - 更新按钮状态和外观
       * 
       * 【调用时机】
       * 1. 🎨 按钮配置更改
       * 2. 🎭 主题切换
       * 3. 🔄 状态更新（启用/禁用）
       * 4. 🖼️ 图标更换
       * 
       * 【刷新内容】
       * 1. 🖼️ 按钮图标和标签
       * 2. 🎨 颜色和样式
       * 3. ✅/❌ 启用和禁用状态
       * 4. 📦 按钮布局和顺序
       * 
       * 【sender 参数结构】
       * ```javascript
       * sender = {
       *   userInfo: {
       *     buttonIds: ["btn1", "btn2"],    // 要刷新的按钮 ID
       *     refreshAll: false,               // 是否刷新全部
       *     animated: true,                  // 是否动画
       *     reason: "config_change"          // 刷新原因
       *   }
       * }
       * ```
       * 
       * 【实现流程】
       * ```javascript
       * onRefreshToolbarButton: function(sender) {
       *   let info = sender.userInfo || {}
       *   
       *   // 1. 确定刷新范围
       *   let buttonsToRefresh = info.refreshAll ? 
       *     self.getAllButtons() : 
       *     self.getButtonsByIds(info.buttonIds)
       *   
       *   // 2. 刷新每个按钮
       *   buttonsToRefresh.forEach(button => {
       *     // 更新图标
       *     button.updateImage()
       *     
       *     // 更新状态
       *     button.updateEnabledState()
       *     
       *     // 更新样式
       *     button.updateAppearance()
       *   })
       *   
       *   // 3. 重新布局（如果需要）
       *   if (info.reason === "layout_change") {
       *     self.toolbar.updateButtonLayout()
       *   }
       * }
       * ```
       * 
       * 【性能优化】
       * - 🎯 只刷新必要的按钮
       * - 🕰️ 使用节流避免频繁刷新
       * - 🎨 批量处理 UI 更新
       * 
       * @param {Object} sender - 事件发送者，包含刷新信息
       * @returns {void}
       */
      onRefreshToolbarButton: function (sender) {
      },
      /**
       * ⚙️ 打开设置界面 - 便捷方法
       * 
       * 【功能说明】
       * 这是一个便捷方法，直接打开插件的设置界面。
       * 通常绑定到快捷键或菜单项上。
       * 
       * 【使用场景】
       * 1. 🔘 从插件菜单打开设置
       * 2. ⌨️ 从快捷键打开设置
       * 3. 📱 从手势打开设置
       * 
       * @returns {void}
       */
      openSetting:function () {
      },
      /**
       * 🔄 切换工具栏显示/隐藏 - 便捷开关
       * 
       * 【功能说明】
       * 快速切换工具栏的显示状态，不影响其他设置。
       * 
       * 【使用场景】
       * 1. 👁️ 临时隐藏工具栏以获得更大阅读空间
       * 2. 🔄 快速显示/隐藏工具栏
       * 3. ⌨️ 通过快捷键切换
       * 
       * @returns {void}
       */
      toggleToolbar:function () {
      },
      /**
       * 🔀 切换动态模式 - 便捷开关
       * 
       * 【功能说明】
       * 这是 onToggleDynamic 的便捷版本，直接切换动态模式。
       * 
       * @returns {void}
       */
      toggleDynamic:function () {
      },
      /**
       * 📄 打开文档 - 快速访问文档
       * 
       * 【功能说明】
       * 打开指定的文档或最近使用的文档。
       * 
       * 【使用场景】
       * 1. 📖 快速打开常用文档
       * 2. 🔄 切换文档
       * 3. 📁 打开文档列表
       * 
       * @param {UIButton} button - 触发按钮
       * @returns {void}
       */
      openDocument:function (button) {
      },
      /**
       * 🔄 切换工具栏方向 - 横竖布局切换
       * 
       * 【功能说明】
       * 在横向和纵向布局之间切换工具栏。
       * 
       * 【布局选项】
       * 1. ↔️ 横向：适合屏幕较宽的情况
       * 2. ↕️ 纵向：适合屏幕较窄的情况
       * 
       * @param {string} source - 触发来源
       * @returns {void}
       */
      toggleToolbarDirection: function (source) {
      },
      /**
       * 🔌 切换插件状态 - 启用/禁用插件
       * 
       * 【功能说明】
       * 动态启用或禁用其他插件，实现插件间的协作。
       * 
       * 【使用场景】
       * 1. 🤝 插件互斥管理
       * 2. 🔄 按需加载插件
       * 3. 📋 批量管理插件
       * 
       * @param {UIButton} button - 触发按钮
       * @returns {void}
       */
      toggleAddon:function (button) {
      }
    },
    { /* Class members */
      /**
       * 🔌 插件连接完成 - 类级别初始化
       * 
       * 【调用时机】
       * 插件类被加载到内存并完成初始化后调用。
       * 这是最早的生命周期方法，优先于 sceneWillConnect。
       * 
       * 【主要用途】
       * 1. 🏆 注册插件信息
       * 2. 🔧 设置全局变量
       * 3. 📦 加载必要资源
       * 4. 📋 初始化配置
       * 
       * 【注意事项】
       * - ✨ 这是类方法，不是实例方法
       * - 🚫 此时还没有视图和笔记本
       * - 💾 只做轻量级初始化
       * 
       * @returns {void}
       */
      addonDidConnect: function () {
      },
      /**
       * 👋 插件将要断开连接 - 类级别清理
       * 
       * 【调用时机】
       * 插件被完全卸载前调用，这是最后的清理机会。
       * 
       * 【主要任务】
       * 1. 💾 保存全局状态
       * 2. 🧹 清理全局资源
       * 3. 📡 取消所有通知
       * 4. 🔓 释放内存占用
       * 
       * 【与 sceneDidDisconnect 的区别】
       * - sceneDidDisconnect: 关闭插件窗口
       * - addonWillDisconnect: 卸载插件类
       * 
       * @async
       * @returns {Promise<void>}
       */
      addonWillDisconnect: async function () {
      },
      /**
       * 🌅 应用将要进入前台 - iOS 生命周期
       * 
       * 【调用时机】
       * 1. 📱 用户从后台切换回应用
       * 2. 🔓 设备解锁后返回应用
       * 3. 📨 从通知中心打开应用
       * 
       * 【典型操作】
       * 1. 🔄 刷新数据
       * 2. ▶️ 恢复动画
       * 3. 🌐 检查网络状态
       * 4. 📋 更新状态显示
       * 
       * 【注意事项】
       * - 📱 主要用于 iOS 平台
       * - ⚡ 快速执行，避免阻塞 UI
       * 
       * @returns {void}
       */
      applicationWillEnterForeground: function () {
      },
      /**
       * 🌃 应用已进入后台 - iOS 生命周期
       * 
       * 【调用时机】
       * 1. 🏠 用户按 Home 键
       * 2. 🔄 切换到其他应用
       * 3. 🔒 设备锁屏
       * 
       * 【主要任务】
       * 1. 💾 保存重要数据
       * 2. ⏸️ 暂停动画和定时器
       * 3. 📋 记录用户位置
       * 4. 🔇 停止音频播放
       * 
       * 【背景运行限制】
       * iOS 在后台有严格限制：
       * - ⛱️ 有限的执行时间
       * - 🚫 禁止 UI 更新
       * - 🔋 限制网络请求
       * 
       * @returns {void}
       */
      applicationDidEnterBackground: function () {
      },
      /**
       * 🔔 接收本地通知 - 处理应用内通知
       * 
       * 【调用时机】
       * 1. 📨 应用在前台时收到本地通知
       * 2. 🔔 用户点击通知进入应用
       * 3. ⏰ 定时通知触发
       * 
       * 【notify 参数结构】
       * ```javascript
       * notify = {
       *   alertBody: "通知内容",
       *   alertTitle: "通知标题",
       *   userInfo: {
       *     type: "reminder",      // 通知类型
       *     noteId: "xxx",         // 相关数据
       *     action: "review"       // 要执行的动作
       *   },
       *   fireDate: Date,          // 触发时间
       *   soundName: "default"     // 声音
       * }
       * ```
       * 
       * 【处理流程】
       * ```javascript
       * applicationDidReceiveLocalNotification: function(notify) {
       *   let info = notify.userInfo
       *   
       *   switch(info.type) {
       *     case "reminder":
       *       // 处理提醒
       *       self.handleReminder(info)
       *       break
       *       
       *     case "sync":
       *       // 处理同步
       *       self.handleSync(info)
       *       break
       *       
       *     default:
       *       // 默认处理
       *       MNUtil.showHUD(notify.alertBody)
       *   }
       * }
       * ```
       * 
       * 【常见通知类型】
       * 1. 📝 复习提醒
       * 2. 🔄 同步完成
       * 3. 🎁 新功能提示
       * 4. ⚠️ 重要更新
       * 
       * @param {Object} notify - 本地通知对象
       * @returns {void}
       */
      applicationDidReceiveLocalNotification: function (notify) {
      }
    }
  );

  /**
   * 
    什么是 prototype？

    prototype 是 JavaScript 中实现面向对象编程的核心机制。每个函数都有一个 prototype
    属性，当这个函数作为构造函数使用时，由它创建的所有实例都会共享这个 prototype 上的方法和属性。

    为什么要使用 prototype？

    让我用一个简单的例子来说明：

    方式一：直接在构造函数中定义（不推荐）

    function Person(name) {
      this.name = name;

      // 每次创建实例都会创建新的函数
      this.sayHello = function() {
        console.log("Hello, I'm " + this.name);
      }
    }

    const person1 = new Person("小明");
    const person2 = new Person("小红");

    // 问题：person1.sayHello !== person2.sayHello
    // 每个实例都有自己的 sayHello 函数副本，浪费内存

    方式二：使用 prototype（推荐）

    function Person(name) {
      this.name = name;
    }

    // 所有实例共享同一个函数
    Person.prototype.sayHello = function() {
      console.log("Hello, I'm " + this.name);
    }

    const person1 = new Person("小明");
    const person2 = new Person("小红");

    // person1.sayHello === person2.sayHello
    // 所有实例共享同一个函数，节省内存

    在 MNToolbar 项目中的应用

    在 MNToolbar 中，JSB.defineClass 创建类时，只能定义部分方法：

    var MNToolbarClass = JSB.defineClass("MNToolbar: JSExtension", {
      // 这里只能定义 MarginNote 生命周期方法
      sceneWillConnect: function() { },
      notebookWillOpen: function(notebookid) { },
      // ...
    });

    // 其他自定义方法必须通过 prototype 添加
    MNToolbarClass.prototype.ensureView = function() {
      // 确保视图已创建
    }

    MNToolbarClass.prototype.showToolbar = function() {
      // 显示工具栏
    }

    使用 prototype 的好处

    1. 内存效率：所有实例共享同一个方法，而不是每个实例都复制一份
    2. 性能优化：函数只定义一次，创建实例时不需要重复创建函数
    3. 灵活扩展：可以在任何时候给已存在的类添加新方法
    // 后续可以随时添加新方法
    MNToolbarClass.prototype.newMethod = function() {
      // 新功能
    }
    4. 继承支持：JavaScript 的原型链机制支持继承


    * 用一个餐厅来比喻：

    var 餐厅 = JSB.defineClass("Restaurant", {
      // 这些是"对外服务窗口"
      开门营业: function() { },      // 生命周期
      接待客人: function() { },      // 通知回调
      接受点餐: function() { },      // 命令方法

      // 这些也是"对外服务"
      外卖订单: function() { },      // 虽然不是生命周期，但对外
      团购活动: function() { }       // 虽然不是生命周期，但对外
    })

    // 这些是"内部运作"
    餐厅.prototype.切菜 = function() { }
    餐厅.prototype.炒菜 = function() { }
    餐厅.prototype.算账 = function() { }

    记住：
    - JSB.defineClass 内 = 对外的窗口（MarginNote会调用）
    - prototype = 内部的功能（自己使用）
   */
  MNPluginDemoClass.prototype.foo = function(bar){ 
  }

  /**
   *   MarginNote 的加载流程

  // 1. MarginNote 调用 JSB.newAddon
  let 插件类 = JSB.newAddon(插件路径)  // 需要返回值！

  // 2. 使用返回的类创建插件实例
  let 插件实例 = 插件类.new()

  // 3. 调用生命周期方法
  插件实例.sceneWillConnect()

  具体的区别

  main.js（特殊的入口文件）

  // 整个文件是一个函数
  JSB.newAddon = function (mainPath) {
    // 1. 加载依赖
    JSB.require('webviewController')
    JSB.require('settingController')

    // 2. 定义主类
    var MNToolbarClass = JSB.defineClass(...)

    // 3. 必须返回主类！
    return MNToolbarClass;  // MarginNote 需要这个返回值
  }
   */
  return MNPluginDemoClass;
};