# MarginNote 插件菜单点击问题排查指南

## 问题描述
菜单项点击后没有任何反应，预期的面板或功能没有触发。

## 快速诊断流程

### 1. 检查 selector 格式
这是最常见的问题原因！

```javascript
// ✅ 正确格式
{title: '设置', object: self, selector: 'openSetting:', param: {}}     // 带参数
{title: '关于', object: self, selector: 'showAbout', param: null}      // 无参数

// ❌ 错误格式
{title: '设置', object: self, selector: 'openSetting', param: {}}      // 缺少冒号！
{title: '关于', object: self, selector: 'showAbout:', param: null}    // 不需要冒号！
```

**规则**：
- **有参数**的方法：selector 必须以冒号结尾
- **无参数**的方法：selector 不需要冒号

### 2. 检查方法是否存在

在插件类中添加日志来验证：

```javascript
// 在菜单点击处理中添加检查
var methodName = item.selector.replace(':', '')
if (typeof item.object[methodName] === 'function') {
  MNUtil.log("✅ 方法存在: " + methodName)
} else {
  MNUtil.log("❌ 方法不存在: " + methodName)
  // 列出所有可用方法
  for (var key in item.object) {
    if (typeof item.object[key] === 'function') {
      MNUtil.log("可用方法: " + key)
    }
  }
}
```

### 3. 检查 object 引用

确保 `object` 指向正确的实例：

```javascript
// ✅ 正确
{title: '设置', object: self, selector: 'openSetting:', param: null}

// ❌ 错误
{title: '设置', object: this, selector: 'openSetting:', param: null}  // this 可能不对
{title: '设置', object: null, selector: 'openSetting:', param: null}  // object 为空
```

## 详细排查步骤

### 步骤 1：启用详细日志

在 main.js 中添加调试版本的 MenuController：

```javascript
tableViewDidSelectRowAtIndexPath: function(tableView, indexPath) {
  // 添加详细日志
  MNUtil.log("========== 菜单调试信息 ==========")
  MNUtil.log("1. 点击索引: " + indexPath.row)
  
  if (self.commandTable && self.commandTable[indexPath.row]) {
    var item = self.commandTable[indexPath.row]
    MNUtil.log("2. 菜单项: " + JSON.stringify(item))
    MNUtil.log("3. Object 类型: " + typeof item.object)
    MNUtil.log("4. Selector: " + item.selector)
    MNUtil.log("5. 参数: " + JSON.stringify(item.param))
    
    // 检查方法
    var methodName = item.selector.replace(':', '')
    MNUtil.log("6. 方法名: " + methodName)
    MNUtil.log("7. 方法存在: " + (typeof item.object[methodName] === 'function'))
    
    try {
      var sel = new SEL(item.selector)
      if (item.param !== null && item.param !== undefined) {
        item.object.performSelectorWithObject(sel, item.param)
      } else {
        item.object.performSelector(sel)
      }
      MNUtil.log("8. ✅ 执行成功")
    } catch (error) {
      MNUtil.log("8. ❌ 执行失败: " + error.message)
      MNUtil.log("   堆栈: " + error.stack)
    }
  }
  MNUtil.log("====================================")
}
```

### 步骤 2：验证 performSelector

创建测试方法验证 performSelector 是否工作：

```javascript
// 添加到插件类中
testPerformSelector: function() {
  try {
    // 测试无参数调用
    var sel1 = new SEL("testMethod")
    self.performSelector(sel1)
    
    // 测试带参数调用
    var sel2 = new SEL("testMethodWithParam:")
    self.performSelectorWithObject(sel2, "test")
    
    MNUtil.showHUD("performSelector 正常工作")
  } catch (error) {
    MNUtil.showHUD("performSelector 错误: " + error.message)
  }
},

testMethod: function() {
  MNUtil.log("testMethod 被调用")
},

testMethodWithParam: function(param) {
  MNUtil.log("testMethodWithParam 被调用，参数: " + param)
}
```

### 步骤 3：检查 Popover 生命周期

```javascript
showPopover: function(sender, commandTable, width) {
  MNUtil.log("创建 Popover 开始")
  
  // 先关闭之前的 popover
  if (self.popoverController) {
    MNUtil.log("关闭旧的 Popover")
    self.popoverController.dismissPopoverAnimated(false)
    self.popoverController = null
  }
  
  // 创建新的 popover...
  
  MNUtil.log("Popover 创建完成")
  return popoverController
}
```

### 步骤 4：使用 MNUtils Menu 类（推荐）

如果可能，使用 MNUtils 提供的 Menu 类：

```javascript
toggleMenu: function(button) {
  // 检查 Menu 类是否可用
  if (typeof Menu !== 'undefined') {
    var menu = new Menu(button, self, 200)
    menu.addMenuItem("设置", "openSetting:", null)
    menu.addMenuItem("关于", "showAbout", null)
    menu.show()
  } else {
    // 使用自定义 MenuController
    self.showCustomMenu(button)
  }
}
```

## 常见错误模式

### 错误 1：方法签名不匹配

```javascript
// 定义的方法
openSetting: function() {  // 无参数
  // ...
}

// 菜单配置
{selector: 'openSetting:', param: null}  // 错误！selector 表示有参数

// 解决方案：
// 要么修改方法签名
openSetting: function(param) {  // 添加参数
  // ...
}

// 要么修改 selector
{selector: 'openSetting', param: null}  // 去掉冒号
```

### 错误 2：self 引用问题

```javascript
// 错误示例
var MyPlugin = JSB.defineClass('MyPlugin : JSExtension', {
  showMenu: function() {
    var commandTable = [
      {object: this, selector: 'method1:', param: null}  // this 可能不对！
    ]
  }
})

// 正确做法
const getMyPlugin = () => self  // 定义获取实例的函数

var MyPlugin = JSB.defineClass('MyPlugin : JSExtension', {
  showMenu: function() {
    let self = getMyPlugin()  // 获取正确的实例
    var commandTable = [
      {object: self, selector: 'method1:', param: null}
    ]
  }
})
```

### 错误 3：异步问题

```javascript
// 问题：菜单方法中的异步操作可能被中断
openSetting: async function() {
  // Popover 可能在异步操作完成前就关闭了
  await someAsyncOperation()
  self.showSettingPanel()  // 可能不会执行
}

// 解决方案：延迟关闭 popover
tableViewDidSelectRowAtIndexPath: function(tableView, indexPath) {
  // 执行菜单方法
  // ...
  
  // 延迟关闭，给异步操作时间
  NSTimer.scheduledTimerWithTimeInterval(0.5, false, function() {
    if (self.pluginInstance && self.pluginInstance.popoverController) {
      self.pluginInstance.popoverController.dismissPopoverAnimated(true)
    }
  })
}
```

## 完整的调试模板

将以下代码添加到你的插件中进行调试：

```javascript
// 调试辅助方法
debugMenu: function(button) {
  MNUtil.log("\n========== 开始菜单调试 ==========")
  
  // 1. 检查环境
  MNUtil.log("MNUtils 可用: " + (typeof MNUtil !== 'undefined'))
  MNUtil.log("Menu 类可用: " + (typeof Menu !== 'undefined'))
  MNUtil.log("MenuController 可用: " + (typeof MenuController !== 'undefined'))
  
  // 2. 列出所有方法
  MNUtil.log("\n可用方法列表:")
  for (var key in self) {
    if (typeof self[key] === 'function') {
      MNUtil.log("  - " + key)
    }
  }
  
  // 3. 测试菜单
  var testItems = [
    {title: '测试1', object: self, selector: 'debugMethod1', param: null},
    {title: '测试2', object: self, selector: 'debugMethod2:', param: "test"},
    {title: '测试3', object: self, selector: 'nonExistent:', param: null}
  ]
  
  MNUtil.log("\n测试菜单项:")
  testItems.forEach(function(item, index) {
    var methodName = item.selector.replace(':', '')
    var exists = typeof item.object[methodName] === 'function'
    MNUtil.log(`  ${index + 1}. ${item.title} -> ${methodName} (${exists ? '✅' : '❌'})`)
  })
  
  MNUtil.log("========== 调试结束 ==========\n")
  
  // 显示测试菜单
  self.popoverController = self.showPopover(button, testItems, 200)
},

debugMethod1: function() {
  MNUtil.showHUD("方法1执行成功")
},

debugMethod2: function(param) {
  MNUtil.showHUD("方法2: " + param)
}
```

## 最终检查清单

- [ ] selector 格式正确（有参数带冒号，无参数不带）
- [ ] 方法确实存在于 object 对象上
- [ ] object 引用正确（通常是 self）
- [ ] MenuController 正确定义
- [ ] performSelector 调用在 try-catch 中
- [ ] popoverController 生命周期正确管理
- [ ] 没有 JavaScript 语法错误
- [ ] 日志输出正常

## 获取帮助

如果按照以上步骤仍无法解决问题：

1. 收集完整的日志输出
2. 记录你的插件代码片段
3. 在 MarginNote 论坛发帖求助
4. 提供 MarginNote 版本信息

记住：大多数菜单点击问题都是由于 **selector 格式错误**造成的！