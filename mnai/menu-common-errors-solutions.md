# MarginNote 插件菜单常见错误及解决方案

## 🚨 错误速查表

| 症状 | 可能原因 | 解决方案 |
|------|----------|----------|
| 点击菜单无反应 | selector 格式错误 | 检查是否需要冒号 |
| 方法未找到错误 | 方法名拼写错误 | 检查方法名是否正确 |
| undefined is not an object | object 引用错误 | 使用 self 而非 this |
| performSelector 失败 | 参数类型不匹配 | 检查参数类型 |
| 面板闪现后消失 | popover 过早关闭 | 延迟关闭 popover |

## 📋 常见错误详解

### 错误 1：Selector 格式错误

**❌ 错误代码**
```javascript
// 带参数的方法却没有冒号
{title: '打开设置', object: self, selector: 'openSettings', param: {mode: 'basic'}}

// 不带参数的方法却有冒号
{title: '显示关于', object: self, selector: 'showAbout:', param: null}
```

**✅ 正确代码**
```javascript
// 带参数的方法必须有冒号
{title: '打开设置', object: self, selector: 'openSettings:', param: {mode: 'basic'}}

// 不带参数的方法不需要冒号
{title: '显示关于', object: self, selector: 'showAbout', param: null}
```

**记忆口诀**：有参带冒号，无参不带号

---

### 错误 2：方法不存在

**❌ 错误代码**
```javascript
// 菜单配置
{title: '设置', object: self, selector: 'openSetting:', param: null}

// 但实际方法名是
openSettings: function(param) {  // 注意是 Settings 不是 Setting
  // ...
}
```

**✅ 解决方案**
```javascript
// 添加调试代码确认方法名
for (var key in self) {
  if (typeof self[key] === 'function' && key.includes('open')) {
    MNUtil.log("发现方法: " + key)
  }
}
```

---

### 错误 3：Object 引用错误

**❌ 错误代码**
```javascript
var MyPlugin = JSB.defineClass('MyPlugin : JSExtension', {
  showMenu: function(button) {
    var items = [
      {title: '选项1', object: this, selector: 'option1:', param: null}  // this 是错误的！
    ]
  }
})
```

**✅ 正确代码**
```javascript
// 在文件顶部定义
const getMyPlugin = () => self

var MyPlugin = JSB.defineClass('MyPlugin : JSExtension', {
  showMenu: function(button) {
    let self = getMyPlugin()  // 获取正确的实例
    var items = [
      {title: '选项1', object: self, selector: 'option1:', param: null}
    ]
  }
})
```

---

### 错误 4：performSelector 调用失败

**❌ 错误代码**
```javascript
// 直接调用可能失败
item.object.performSelectorWithObject(sel, item.param)
```

**✅ 正确代码**
```javascript
// 添加错误处理
try {
  var sel = new SEL(item.selector)
  if (item.param !== null && item.param !== undefined) {
    item.object.performSelectorWithObject(sel, item.param)
  } else {
    item.object.performSelector(sel)
  }
} catch (error) {
  MNUtil.showHUD("方法调用失败: " + error.message)
  MNUtil.log("错误详情: " + error.stack)
}
```

---

### 错误 5：Popover 过早关闭

**❌ 问题代码**
```javascript
openSettings: async function() {
  // 异步操作
  await loadSettings()
  self.showSettingsPanel()  // 可能不会执行，因为 popover 已关闭
}
```

**✅ 解决方案**
```javascript
// 方案1：先关闭 popover
openSettings: function() {
  if (self.popoverController) {
    self.popoverController.dismissPopoverAnimated(true)
  }
  
  // 然后执行异步操作
  setTimeout(() => {
    self.loadAndShowSettings()
  }, 300)
}

// 方案2：延迟关闭 popover
tableViewDidSelectRowAtIndexPath: function(tableView, indexPath) {
  // ... 执行方法
  
  // 延迟关闭
  NSTimer.scheduledTimerWithTimeInterval(0.5, false, function() {
    if (self.pluginInstance && self.pluginInstance.popoverController) {
      self.pluginInstance.popoverController.dismissPopoverAnimated(true)
    }
  })
}
```

---

### 错误 6：MenuController 未定义

**❌ 错误信息**
```
Can't find variable: MenuController
```

**✅ 解决方案**
```javascript
// 在使用前检查并定义
if (typeof MenuController === 'undefined') {
  var MenuController = JSB.defineClass(
    'MenuController : UITableViewController',
    {
      // ... MenuController 实现
    }
  )
}
```

---

### 错误 7：面板不显示

**❌ 问题代码**
```javascript
showPanel: function() {
  self.panelView.hidden = false  // 视图可能未添加到父视图
}
```

**✅ 正确代码**
```javascript
showPanel: function() {
  // 确保视图已添加到父视图
  if (!self.panelView.superview) {
    MNUtil.studyView.addSubview(self.panelView)
  }
  
  // 确保在最前面
  MNUtil.studyView.bringSubviewToFront(self.panelView)
  
  // 显示视图
  self.panelView.hidden = false
  self.panelView.alpha = 1.0
}
```

---

### 错误 8：参数传递错误

**❌ 错误代码**
```javascript
// 方法期望对象参数
openSettings: function(config) {
  var mode = config.mode  // 会报错如果 config 是字符串
}

// 但菜单传递字符串
{selector: 'openSettings:', param: "basic"}
```

**✅ 正确代码**
```javascript
// 确保参数类型匹配
{selector: 'openSettings:', param: {mode: "basic"}}

// 或在方法中处理多种类型
openSettings: function(param) {
  var config = typeof param === 'string' ? {mode: param} : param
  var mode = config.mode
}
```

## 🛠️ 快速修复模板

将以下代码复制到你的插件中，快速修复菜单问题：

```javascript
// 1. 安全的菜单显示函数
showMenuSafely: function(button) {
  try {
    // 关闭之前的菜单
    if (typeof Menu !== "undefined") {
      Menu.dismissCurrentMenu()
    }
    if (self.popoverController) {
      self.popoverController.dismissPopoverAnimated(false)
      self.popoverController = null
    }
    
    // 菜单项配置
    var items = [
      {title: '功能1', object: self, selector: 'function1', param: null},
      {title: '功能2', object: self, selector: 'function2:', param: "test"}
    ]
    
    // 优先使用 MNUtils Menu
    if (typeof Menu !== "undefined") {
      var menu = new Menu(button, self, 200)
      items.forEach(item => {
        menu.addMenuItem(item.title, item.selector, item.param)
      })
      menu.show()
    } else {
      // 使用自定义 MenuController
      self.popoverController = self.createPopover(button, items, 200)
    }
  } catch (error) {
    MNUtil.showHUD("菜单错误: " + error.message)
  }
},

// 2. 创建 Popover 的安全方法
createPopover: function(sender, items, width) {
  if (typeof MenuController === 'undefined') {
    MNUtil.showHUD("MenuController 未定义")
    return null
  }
  
  var menuController = MenuController.new()
  menuController.commandTable = items
  menuController.rowHeight = 40
  menuController.pluginInstance = self
  menuController.preferredContentSize = {
    width: width,
    height: menuController.rowHeight * items.length
  }
  
  var popover = UIPopoverController.new(menuController)
  var rect = sender.convertRectToView(sender.bounds, MNUtil.studyView)
  
  popover.presentPopoverFromRectInViewPermittedArrowDirectionsAnimated(
    rect, MNUtil.studyView, 1 << 2, true
  )
  
  return popover
},

// 3. 安全的方法调用包装器
safeMenuAction: function(action) {
  return function(param) {
    try {
      // 先关闭菜单
      if (self.popoverController) {
        self.popoverController.dismissPopoverAnimated(true)
        self.popoverController = null
      }
      
      // 执行实际操作
      action.call(self, param)
    } catch (error) {
      MNUtil.showHUD("操作失败: " + error.message)
      MNUtil.log("错误: " + error.stack)
    }
  }
}
```

## 🎯 调试检查列表

遇到菜单问题时，按以下顺序检查：

1. **检查 selector 格式**
   - [ ] 有参数的方法 selector 以冒号结尾
   - [ ] 无参数的方法 selector 没有冒号

2. **验证方法存在**
   - [ ] 方法名拼写正确
   - [ ] 方法在正确的对象上定义

3. **确认引用正确**
   - [ ] 使用 self 而不是 this
   - [ ] object 不是 null 或 undefined

4. **检查参数匹配**
   - [ ] 参数类型正确
   - [ ] 参数数量匹配

5. **测试基础功能**
   - [ ] MNUtil 可用
   - [ ] performSelector 可以调用简单方法
   - [ ] 日志输出正常

6. **检查生命周期**
   - [ ] popoverController 正确保存
   - [ ] 视图已添加到父视图
   - [ ] 没有过早释放资源

## 💡 最佳实践建议

1. **始终使用 try-catch** 包装菜单处理代码
2. **添加详细日志** 在开发阶段
3. **优先使用 MNUtils Menu 类**
4. **测试所有菜单项** 在发布前
5. **保持方法签名一致性**
6. **文档化所有菜单方法**

记住：90% 的菜单问题都是 **selector 格式错误** 造成的！