# 菜单点击问题完整解决方案

基于对 MN ChatAI 项目的深入分析，我发现了您的问题根源，并提供完整的解决方案。

## 🎯 问题诊断

从您的 simple-panel-plugin 代码修改来看，问题出在 **JSB 框架的方法调用限制**。您正在将方法内联，这表明 `performSelector` 在调用自定义方法时遇到了问题。

## ✅ 核心解决方案

### 1. 修正 Selector 格式（最重要！）

```javascript
// 检查您的菜单配置
var commandTable = [
  // ❌ 错误：带参数的方法缺少冒号
  {title: "📝 文本处理", object: self, selector: "openTextProcessor", param: null},
  
  // ✅ 正确：带参数的方法必须有冒号
  {title: "📝 文本处理", object: self, selector: "openTextProcessor:", param: null},
  
  // 如果方法真的不需要参数，去掉冒号
  {title: "ℹ️ 关于", object: self, selector: "showAbout", param: null}
];
```

### 2. 确保方法签名匹配

```javascript
// 如果 selector 是 "openTextProcessor:"（有冒号）
// 方法必须接受参数：
openTextProcessor: function(param) {  // 必须有参数
  // 您的代码
}

// 如果 selector 是 "showAbout"（无冒号）
// 方法不能有参数：
showAbout: function() {  // 不能有参数
  // 您的代码
}
```

### 3. 处理 JSB 框架限制

如果 performSelector 无法调用自定义方法，使用以下替代方案：

```javascript
// 方案 A：使用直接调用替代 performSelector
tableViewDidSelectRowAtIndexPath: function(tableView, indexPath) {
  tableView.deselectRowAtIndexPathAnimated(indexPath, true);
  
  if (self.commandTable && self.commandTable[indexPath.row]) {
    var item = self.commandTable[indexPath.row];
    
    // 直接调用而不使用 performSelector
    if (item.object && item.selector) {
      var methodName = item.selector.replace(':', '');
      var method = item.object[methodName];
      
      if (typeof method === 'function') {
        if (item.param !== null && item.param !== undefined) {
          method.call(item.object, item.param);
        } else {
          method.call(item.object);
        }
      }
    }
  }
  
  // 关闭 popover
  if (self.pluginInstance && self.pluginInstance.popoverController) {
    self.pluginInstance.popoverController.dismissPopoverAnimated(true);
  }
}
```

### 4. 完整的工作示例

```javascript
// 在您的 SimplePanel 类中
showMenu: function(button) {
  if (typeof MNUtil !== "undefined" && MNUtil.log) {
    MNUtil.log("🎯 Simple Panel: showMenu 被调用");
  }
  
  // 关闭之前的菜单
  if (self.popoverController) {
    self.popoverController.dismissPopoverAnimated(false);
    self.popoverController = null;
  }
  
  // 菜单配置 - 注意 selector 格式！
  var commandTable = [
    {
      title: "📝 文本处理",
      object: self,
      selector: "openTextProcessor:",  // 有冒号
      param: null
    },
    {
      title: "📓 快速笔记",
      object: self,
      selector: "openQuickNote:",     // 有冒号
      param: null
    },
    {
      title: "🔍 搜索替换",
      object: self,
      selector: "openSearchReplace:",  // 有冒号
      param: null
    },
    {
      title: "ℹ️ 关于",
      object: self,
      selector: "showAbout",          // 无参数，无冒号
      param: null
    }
  ];
  
  // 创建并显示菜单
  if (typeof Menu !== "undefined") {
    // 使用 MNUtils Menu
    var menu = new Menu(button, self, 200);
    commandTable.forEach(function(item) {
      menu.addMenuItem(item.title, item.selector, item.param);
    });
    menu.show();
  } else {
    // 使用自定义 MenuController
    var menuController = MenuController.new();
    menuController.commandTable = commandTable;
    menuController.pluginInstance = self;
    menuController.rowHeight = 44;
    menuController.preferredContentSize = {
      width: 200,
      height: menuController.rowHeight * commandTable.length
    };
    
    self.popoverController = UIPopoverController.new(menuController);
    var rect = button.convertRectToView(button.bounds, MNUtil.studyView);
    self.popoverController.presentPopoverFromRectInViewPermittedArrowDirectionsAnimated(
      rect, MNUtil.studyView, 1 << 2, true
    );
  }
},

// 确保方法签名正确
openTextProcessor: function(param) {  // 接受参数
  if (typeof MNUtil !== "undefined" && MNUtil.log) {
    MNUtil.log("✅ openTextProcessor 被调用");
  }
  // 您的实现代码
},

openQuickNote: function(param) {      // 接受参数
  if (typeof MNUtil !== "undefined" && MNUtil.log) {
    MNUtil.log("✅ openQuickNote 被调用");
  }
  // 您的实现代码
},

openSearchReplace: function(param) {   // 接受参数
  if (typeof MNUtil !== "undefined" && MNUtil.log) {
    MNUtil.log("✅ openSearchReplace 被调用");
  }
  // 您的实现代码
},

showAbout: function() {               // 不接受参数
  if (typeof MNUtil !== "undefined" && MNUtil.log) {
    MNUtil.log("✅ showAbout 被调用");
  }
  MNUtil.alert("关于", "Simple Panel v1.0");
}
```

## 🔧 针对您当前代码的具体修改建议

1. **检查所有菜单项的 selector**
   - 找到所有 `selector:` 定义
   - 确保带参数的方法有冒号
   - 确保方法签名匹配

2. **添加调试日志**
   ```javascript
   // 在 MenuController 的 tableViewDidSelectRowAtIndexPath 中
   MNUtil.log("菜单项: " + item.title);
   MNUtil.log("Selector: " + item.selector);
   MNUtil.log("方法存在: " + (typeof item.object[item.selector.replace(':', '')] === 'function'));
   ```

3. **使用 try-catch 包装所有菜单方法**
   ```javascript
   openTextProcessor: function(param) {
     try {
       // 您的代码
     } catch (error) {
       MNUtil.showHUD("错误: " + error.message);
       MNUtil.log("错误详情: " + error.stack);
     }
   }
   ```

## 📋 快速检查清单

- [ ] 所有带参数的方法 selector 都有冒号
- [ ] 所有方法签名与 selector 匹配
- [ ] MenuController 正确定义
- [ ] 使用了 try-catch 错误处理
- [ ] 添加了调试日志

## 💡 最终建议

如果按照以上方案仍有问题，可能是 JSB 框架版本差异导致的。此时建议：

1. 使用 MNUtils 的 Menu 类（最稳定）
2. 或使用直接方法调用替代 performSelector
3. 参考 MN ChatAI 的实现方式

记住：**90% 的菜单问题都是 selector 格式错误造成的！**