// MarginNote 插件菜单系统调试示例
// 本文件演示如何正确实现菜单点击功能，解决点击无响应问题

JSB.newAddon = function (mainPath) {
  // 1. 加载依赖
  JSB.require('mnutils')
  
  // 检查 MNUtils
  if (typeof MNUtil == 'undefined') {
    Application.sharedInstance().showHUD("请先安装 MNUtils", 2)
    return undefined
  }
  
  // 2. 定义 MenuController（如果系统没有提供）
  if (typeof MenuController === 'undefined') {
    var MenuController = JSB.defineClass(
      'MenuController : UITableViewController',
      {
        // 表格数据源方法
        tableViewNumberOfRowsInSection: function(tableView, section) {
          MNUtil.log("菜单项数量: " + (self.commandTable ? self.commandTable.length : 0))
          return self.commandTable ? self.commandTable.length : 0
        },
        
        tableViewCellForRowAtIndexPath: function(tableView, indexPath) {
          var cellIdentifier = "MenuCell"
          var cell = tableView.dequeueReusableCellWithIdentifier(cellIdentifier)
          if (!cell) {
            cell = UITableViewCell.alloc().initWithStyleReuseIdentifier(0, cellIdentifier)
          }
          
          if (self.commandTable && self.commandTable[indexPath.row]) {
            var item = self.commandTable[indexPath.row]
            cell.textLabel.text = item.title || ""
            cell.textLabel.textAlignment = 0
            MNUtil.log("创建菜单项: " + item.title)
          }
          
          return cell
        },
        
        tableViewHeightForRowAtIndexPath: function(tableView, indexPath) {
          return self.rowHeight || 44
        },
        
        // 关键方法：处理菜单项点击
        tableViewDidSelectRowAtIndexPath: function(tableView, indexPath) {
          MNUtil.log("🔍 菜单项被点击，索引: " + indexPath.row)
          tableView.deselectRowAtIndexPathAnimated(indexPath, true)
          
          if (self.commandTable && self.commandTable[indexPath.row]) {
            var item = self.commandTable[indexPath.row]
            MNUtil.log("🎯 准备执行: " + item.selector + " on " + item.object)
            
            if (item.object && item.selector && item.selector !== '') {
              try {
                // 检查方法是否存在
                var methodName = item.selector.replace(':', '')
                if (typeof item.object[methodName] === 'function') {
                  MNUtil.log("✅ 方法存在: " + methodName)
                  
                  var sel = new SEL(item.selector)
                  if (item.param !== null && item.param !== undefined) {
                    MNUtil.log("📌 带参数调用: " + JSON.stringify(item.param))
                    item.object.performSelectorWithObject(sel, item.param)
                  } else {
                    MNUtil.log("📌 无参数调用")
                    item.object.performSelector(sel)
                  }
                  
                  MNUtil.log("✅ 方法调用成功")
                } else {
                  MNUtil.showHUD("❌ 方法不存在: " + methodName)
                  MNUtil.log("❌ 方法不存在: " + methodName)
                }
              } catch (error) {
                MNUtil.showHUD("❌ 执行错误: " + error.message)
                MNUtil.log("❌ 执行错误: " + error.message)
                MNUtil.log("错误堆栈: " + error.stack)
              }
            }
          }
          
          // 延迟关闭 popover，确保方法执行完成
          NSTimer.scheduledTimerWithTimeInterval(0.1, false, function() {
            if (self.pluginInstance && self.pluginInstance.popoverController) {
              self.pluginInstance.popoverController.dismissPopoverAnimated(true)
              self.pluginInstance.popoverController = null
              MNUtil.log("🔒 Popover 已关闭")
            }
          })
        }
      }
    )
  }
  
  // 3. 定义获取实例的辅助函数
  const getMenuDebugClass = () => self
  
  // 4. 定义插件主类
  var MenuDebugClass = JSB.defineClass('MenuDebug : JSExtension', {
    // 初始化
    init: function(mainPath) {
      self.mainPath = mainPath
      MNUtil.log("🚀 MenuDebug 插件初始化")
    },
    
    // 场景连接时调用
    sceneWillConnect: function () {
      let self = getMenuDebugClass()
      self.init(mainPath)
      MNUtil.showHUD("菜单调试插件已启动")
    },
    
    // 工具栏按钮配置
    queryAddonCommandStatus: function () {
      return {
        image: 'logo.png',
        object: self,
        selector: 'toggleMenu:',  // 注意：带参数的方法必须有冒号
        checked: false
      }
    },
    
    // ========== 核心方法：显示菜单 ==========
    toggleMenu: function(button) {
      MNUtil.log("🎯 toggleMenu 被调用")
      let self = getMenuDebugClass()
      
      // 定义菜单项（注意 selector 格式）
      var commandTable = [
        // 无参数方法 - selector 可以不带冒号
        {title: '📋 方法1（无参数）', object: self, selector: 'method1', param: null},
        
        // 带参数方法 - selector 必须带冒号
        {title: '⚙️ 方法2（带参数）', object: self, selector: 'method2:', param: {key: 'value'}},
        
        // 字符串参数
        {title: '📝 方法3（字符串参数）', object: self, selector: 'method3:', param: "Hello World"},
        
        // 数组参数
        {title: '📊 方法4（数组参数）', object: self, selector: 'method4:', param: [1, 2, 3]},
        
        // 测试错误情况
        {title: '❌ 方法不存在', object: self, selector: 'nonExistentMethod:', param: null},
        {title: '❌ selector 格式错误', object: self, selector: 'methodWithWrongFormat', param: "test"}
      ]
      
      // 显示菜单
      self.popoverController = self.showPopover(button, commandTable, 250)
    },
    
    // ========== 辅助方法：显示 Popover ==========
    showPopover: function(sender, commandTable, width) {
      MNUtil.log("📌 创建 Popover，菜单项数: " + commandTable.length)
      
      // 使用 MNUtils 的 Menu 类（如果可用）
      if (typeof Menu !== 'undefined') {
        MNUtil.log("✅ 使用 MNUtils Menu 类")
        var menu = new Menu(sender, self, width)
        
        commandTable.forEach(function(item) {
          menu.addMenuItem(item.title, item.selector, item.param)
        })
        
        menu.show()
        return menu
      }
      
      // 降级方案：使用自定义 MenuController
      MNUtil.log("⚠️ 使用自定义 MenuController")
      var menuController = MenuController.new()
      menuController.commandTable = commandTable
      menuController.rowHeight = 40
      menuController.pluginInstance = self  // 保存引用，用于关闭 popover
      menuController.preferredContentSize = {
        width: width,
        height: menuController.rowHeight * commandTable.length
      }
      
      var popoverController = UIPopoverController.new(menuController)
      var rect = sender.convertRectToView(sender.bounds, MNUtil.studyView)
      
      // 显示 popover
      popoverController.presentPopoverFromRectInViewPermittedArrowDirectionsAnimated(
        rect, 
        MNUtil.studyView, 
        1 << 2,  // 向上箭头
        true
      )
      
      return popoverController
    },
    
    // ========== 测试方法 ==========
    
    // 无参数方法
    method1: function() {
      MNUtil.log("✅ method1 被调用（无参数）")
      MNUtil.showHUD("方法1执行成功！")
      
      // 示例：显示一个简单的视图
      if (!self.testView) {
        self.testView = UIView.new()
        self.testView.backgroundColor = MNUtil.hexColorAlpha("#4CAF50", 0.9)
        self.testView.layer.cornerRadius = 10
        self.testView.frame = MNUtil.genFrame(100, 100, 200, 100)
        
        var label = UILabel.new()
        label.text = "测试面板"
        label.textColor = UIColor.whiteColor()
        label.textAlignment = 1
        label.frame = MNUtil.genFrame(0, 35, 200, 30)
        self.testView.addSubview(label)
        
        var closeBtn = UIButton.buttonWithType(0)
        closeBtn.setTitleForState("关闭", 0)
        closeBtn.setTitleColorForState(UIColor.whiteColor(), 0)
        closeBtn.frame = MNUtil.genFrame(50, 65, 100, 30)
        closeBtn.addTargetActionForControlEvents(self, "closeTestView", 1 << 6)
        self.testView.addSubview(closeBtn)
      }
      
      MNUtil.studyView.addSubview(self.testView)
      self.testView.hidden = false
    },
    
    // 带对象参数的方法
    method2: function(params) {
      MNUtil.log("✅ method2 被调用，参数: " + JSON.stringify(params))
      MNUtil.showHUD("方法2: " + params.key)
    },
    
    // 带字符串参数的方法
    method3: function(text) {
      MNUtil.log("✅ method3 被调用，参数: " + text)
      MNUtil.alert("方法3", text)
    },
    
    // 带数组参数的方法
    method4: function(array) {
      MNUtil.log("✅ method4 被调用，参数: " + JSON.stringify(array))
      MNUtil.showHUD("数组长度: " + array.length)
    },
    
    // 关闭测试视图
    closeTestView: function() {
      if (self.testView) {
        self.testView.hidden = true
      }
    }
  })
  
  return MenuDebugClass
}

// ========== 调试技巧总结 ==========
/*
1. selector 格式规则：
   - 无参数方法：selector 可以不带冒号，如 'method1'
   - 带参数方法：selector 必须带冒号，如 'method2:'
   
2. 常见错误：
   - ❌ 带参数方法忘记加冒号
   - ❌ 方法名拼写错误
   - ❌ object 引用错误（应该是 self）
   
3. 调试步骤：
   - 查看日志输出，确认方法是否被调用
   - 检查 selector 格式是否正确
   - 确认方法确实存在于对象上
   - 使用 try-catch 捕获异常
   
4. 最佳实践：
   - 在每个方法开始时添加日志
   - 使用 MNUtil.showHUD 给用户反馈
   - 正确管理 popoverController 的生命周期
   - 优先使用 MNUtils 的 Menu 类
*/