# 🔍 调试指南 - 自定义 Actions 诊断

## 当前问题

你通过菜单调用 `test` action 时显示 "Not supported yet..."，说明自定义 action 没有被识别。

## 诊断步骤

### 1. 检查加载提示
重启插件后，你应该看到以下提示之一：
- ✅ `调试版 Actions 已加载 (5 个)` - 扩展文件加载成功
- ❌ 没有看到提示 - 扩展文件可能没有加载

### 2. 查看控制台日志
在 MarginNote 的控制台中，你应该看到：
```
📦 xdyy_test_actions_debug.js 已加载
🔧 开始初始化自定义 Actions...
✅ 找到 toolbarController，开始重写 customActionByDes
✅ customActionByDes 重写完成
```

### 3. 测试时的日志
当你点击 "测试" 菜单项时，应该看到：
```
🔍 customActionByDes 被调用 (第 X 次), action: test
✅ 找到自定义 action: test
🔧 执行自定义 action: test
```

如果看到的是：
```
🔍 customActionByDes 被调用 (第 X 次), action: test
⚡ 调用原始方法处理 action: test
```
说明 `test` 没有被识别为自定义 action。

## 可能的原因

### 1. 扩展文件没有正确加载
- 检查 main.js 第 12 行是否是：`JSB.require('xdyy_test_actions_debug')`
- 确认文件存在：`xdyy_test_actions_debug.js`

### 2. 初始化时机问题
- toolbarController 可能在扩展初始化后才被创建
- 解决：多次点击测试，看是否在后续调用中生效

### 3. 方法重写没有生效
- 可能有其他代码也重写了 customActionByDes
- 解决：检查是否有其他扩展文件

## 临时解决方案

在 `xdyy_test_actions_debug.js` 中修改延迟时间：
```javascript
// 将第 215 行的延迟从 10ms 改为 1000ms
setTimeout(() => {
  try {
    initializeCustomActions();
  } catch (error) {
    console.error("❌ 自定义 Actions 初始化失败:", error);
  }
}, 1000); // 增加延迟时间
```

## 最终解决方案

如果调试版仍然不工作，可以尝试：

1. **直接修改原始方法**（不推荐，但可以验证功能）
   在 webviewController.js 的 switch 语句中添加：
   ```javascript
   case "test":
     MNUtil.showHUD("✅ test action 直接执行！");
     break;
   ```

2. **使用生产版本**
   切换到安全版：
   ```javascript
   // main.js 第 12 行改为：
   JSB.require('xdyy_test_actions_safe')
   ```

## 日志收集

请在测试后提供：
1. 启动时的所有提示信息
2. 点击菜单时的控制台输出
3. 是否有任何错误信息

这将帮助我们进一步诊断问题。