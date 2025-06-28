# 陈述性记忆

## 高价值记忆（评分 ≥ 7）

- 2025/06/28 20:35 START
## MarginNote 插件开发踩坑记录 (MNTask 2025-06-28)

### 1. MarginNote 完全卡死问题
- 原因：JSB.newAddon 缺少 mainPath 参数；使用 new TaskController() 而非 TaskController.new()；模块加载循环依赖
- 解决：必须接收 mainPath；使用 .new() 创建 JSB 对象；延迟加载依赖模块

### 2. 插件不在插件栏显示  
- 原因：缺少 queryAddonCommandStatus 方法；缺少静态方法对象；图标尺寸错误
- 解决：实现 queryAddonCommandStatus 返回图标配置；JSB.defineClass 需要两个参数（实例+静态）；logo.png 必须是 44x44

### 3. toggleAddon 无响应
- 原因：JavaScript 作用域问题；self 未定义
- 解决：在文件顶部定义 var self = null；在 sceneWillConnect 中设置 self = this

### 4. 其他重要经验
- UIAlertView 不可靠，使用 MNUtil.input
- 始终检查 typeof MNUtil !== "undefined"
- 使用 UIWebView 而非 WKWebView
- 每个危险操作都要 try-catch
- 参考 mntoolbar 和 mnutils 的实现模式

### 开发检查清单
✓ JSB.newAddon(mainPath)
✓ queryAddonCommandStatus 方法
✓ JSB.defineClass 两个参数
✓ sceneWillConnect 中 self = this
✓ MNUtil 存在性检查
✓ 使用 .new() 创建对象
✓ logo.png 44x44 像素 --tags marginnote plugin development mntask troubleshooting jsb
--tags #其他 #评分:8 #有效期:长期
- END



- 2025/06/28 20:59 START
## MarginNote 插件闪退问题终极解决方案 (MNTask 2025-06-28)

### 问题：安装插件后 MarginNote4 完全闪退，重启仍然闪退

### 根本原因：
1. **模块加载时机错误** - 在 JSB.newAddon 函数内部加载模块会导致闪退
2. **ES6 语法兼容性** - 虽然 MNUtils 使用了 class，但在插件初始化阶段使用可能有问题

### 解决方案：

1. **将模块加载移到文件末尾**（最关键）：
```javascript
// ❌ 错误 - 在 JSB.newAddon 内部加载
JSB.newAddon = function(mainPath) {
  JSB.require('taskModel');  // 导致闪退！
  // ...
}

// ✅ 正确 - 在文件末尾加载
JSB.newAddon = function(mainPath) {
  // 只定义类，不加载模块
  return MNTaskMain;
};

// 文件末尾
JSB.require('mnutils');
JSB.require('taskModel');
JSB.require('taskController');
```

2. **ES6 class 改为传统函数式**：
```javascript
// ❌ 可能有问题
class TaskModel { }

// ✅ 更安全
function TaskModel() { }
TaskModel.prototype.method = function() { }
```

3. **移除危险的父类调用**：
```javascript
// ❌ 错误
self.super.init();

// ✅ 直接初始化
// 不调用父类
```

### 调试技巧：
- 使用 Console.app 查看崩溃日志
- 逐步排除法：先创建最简单的插件，逐步添加功能
- 对比成功运行的插件（如 MNToolbar）的结构

### 关键经验：
- MarginNote 的 JSB 环境在不同阶段对 JS 特性的支持不同
- 模块加载顺序极其重要，必须在文件末尾加载
- 参考成功插件的模式，不要创新 --tags marginnote plugin crash mntask troubleshooting jsb module-loading
--tags #其他 #评分:8 #有效期:长期
- END

- 2025/06/28 21:06 START
## MarginNote 插件闪退问题深度分析 (2025-06-28)

### 问题类型：应用闪退 vs 应用卡死
- **闪退**：MarginNote 直接崩溃退出，重启仍然闪退（本次遇到的问题）
- **卡死**：MarginNote 无响应但不退出，需要强制退出

### 闪退根本原因：模块加载时机错误 🚨

**最关键发现**：MarginNote 的 JSB 环境对模块加载时机极其敏感！

```javascript
// ❌ 致命错误 - 在 JSB.newAddon 内部加载模块
JSB.newAddon = function(mainPath) {
  JSB.require('taskModel');     // 💥 导致闪退！
  JSB.require('taskController'); // 💥 导致闪退！
  
  var Plugin = JSB.defineClass(...);
  return Plugin;
};

// ✅ 正确做法 - 文件末尾加载
JSB.newAddon = function(mainPath) {
  var Plugin = JSB.defineClass(...);
  return Plugin;  // 只返回类定义
};

// 所有模块加载必须在文件末尾
JSB.require('mnutils');
JSB.require('taskModel');
JSB.require('taskController');
```

### 为什么会闪退？
1. JSB.newAddon 在插件初始化的早期阶段执行
2. 此时 JSB 环境可能还未完全准备好
3. 加载包含特定语法的模块会触发崩溃
4. 成功运行的插件（MNToolbar、MNUtils）都在文件末尾加载模块

### 其他导致闪退的因素
1. **ES6 语法**：虽然 MNUtils 使用 class，但在插件初始化阶段使用可能导致闪退
2. **父类调用**：错误的 super.init() 调用
3. **循环依赖**：模块间的循环引用

### 调试闪退的方法
1. 使用 Console.app 查看崩溃日志
2. 搜索 "marginnote" 相关条目
3. 逐步排除法：从最简单的插件开始，逐步添加功能
4. 对比成功插件的代码结构

### 预防闪退的最佳实践
1. **严格遵守模块加载规则**：所有 JSB.require 必须在文件末尾
2. **JSB.newAddon 保持纯净**：只定义和返回类，不执行任何其他操作
3. **避免高级语法**：在插件初始化阶段使用传统语法
4. **参考成功案例**：以 MNToolbar 为模板进行开发

### 闪退 vs 卡死的区别处理
- 闪退：检查模块加载时机、语法兼容性
- 卡死：检查死循环、无限递归、同步阻塞操作 --tags marginnote plugin crash debugging jsb module-loading best-practices
--tags #最佳实践 #评分:8 #有效期:长期
- END