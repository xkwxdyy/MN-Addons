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
      sceneWillConnect: async function () { //Window initialize
      },
      sceneDidDisconnect: function () { // Window disconnect 在插件页面关闭插件（不是删除）
      },
      sceneWillResignActive: function () { // Window resign active
      },
      sceneDidBecomeActive: function () { // Window become active
      },
      notebookWillOpen: async function (notebookid) {
      },
      notebookWillClose: function (notebookid) {
      },
      onProcessNewExcerpt:function (sender) {
      },
      onPopupMenuOnSelection: async function (sender) { // Clicking note
      },
      onClosePopupMenuOnSelection: async function (sender) {
      },
      onPopupMenuOnNote: async function (sender) { // Clicking note
      },
      onClosePopupMenuOnNote: async function (sender) {
      },
      documentDidOpen: function (docmd5) {
      },
      documentWillClose: function (docmd5) {
      },
      controllerWillLayoutSubviews: function (controller) {
      },
      queryAddonCommandStatus: function () {
      },
      onNewIconImage: function (sender) {
      },
      onOpenToolbarSetting:function (params) {
      },
      onToggleDynamic:function (sender) {
      },
      onToggleMindmapToolbar:function (sender) {
      },
      onRefreshView: function (sender) {
      },
      onCloudConfigChange: async function (sender) {
      },
      manualSync: async function (sender) {
      },
      onTextDidBeginEditing:function (param) {
      },
      onTextDidEndEditing: function (param) {
      },
      onRefreshToolbarButton: function (sender) {
      },
      openSetting:function () {
      },
      toggleToolbar:function () {
      },
      toggleDynamic:function () {
      },
      openDocument:function (button) {
      },
      toggleToolbarDirection: function (source) {
      },
      toggleAddon:function (button) {
      }
    },
    { /* Class members */
      addonDidConnect: function () {
      },
      addonWillDisconnect: async function () {
      },
      applicationWillEnterForeground: function () {
      },
      applicationDidEnterBackground: function () {
      },
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
  return MNPluginDemoClass;
};