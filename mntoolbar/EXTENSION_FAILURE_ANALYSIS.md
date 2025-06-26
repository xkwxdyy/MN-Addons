# 扩展方案失败分析

## 问题总结

尝试通过扩展文件重写 `customActionByDes` 方法来实现自定义 actions 的解耦，但最终失败。

## 失败原因分析

### 1. JSB 架构限制
JSB 的类定义和方法重写机制可能与标准 JavaScript 有所不同，导致 prototype 方法重写不生效。

### 2. 加载时机问题
虽然使用了延迟初始化，但可能存在其他时机问题：
- toolbarController 实例化时机
- 方法绑定时机
- 原型链设置时机

### 3. 方法调用机制
可能 JSB 在调用方法时不是通过标准的原型链查找，而是使用了其他机制。

## 临时解决方案

直接在 `webviewController.js` 的 switch 语句中添加自定义 case：

```javascript
case "test":
  const name = "鱼羊";
  MNUtil.showHUD("✅ test action 已执行！结果: " + toolbarUtils.getAbbreviationsOfName("Kangwei Xia"))
  break;
```

## 建议的长期方案

### 方案1：部分解耦
将自定义 actions 的具体实现放在单独的文件中，但 case 语句仍保留在主文件：

```javascript
// xdyy_custom_actions_impl.js
const customActionsImpl = {
  test: function() {
    // 实现
  },
  moveProofDown: function(focusNote) {
    // 实现
  }
}

// webviewController.js
case "test":
  customActionsImpl.test()
  break;
```

### 方案2：配置化
通过配置文件注册自定义 actions：

```javascript
// 在 utils.js 中
toolbarConfig.registerCustomAction("test", function() {
  // 实现
})

// 在 webviewController.js 中
default:
  if (toolbarConfig.hasCustomAction(des.action)) {
    toolbarConfig.executeCustomAction(des.action, context)
  } else {
    MNUtil.showHUD("Not supported yet...")
  }
  break;
```

### 方案3：保持现状
既然已经删除了 3956 行代码，主要目标已经达成。可以：
1. 将其他自定义 actions 逐个添加回 switch 语句
2. 保持代码集中管理
3. 通过注释标记自定义部分

## 教训总结

1. **框架限制**：在特定框架（如 JSB）中工作时，标准 JavaScript 模式可能不适用
2. **渐进式改进**：先确保功能工作，再考虑优化架构
3. **实用主义**：有时候"不够优雅"的解决方案反而是最实用的

## 下一步

1. 询问用户需要哪些自定义 actions
2. 直接在 switch 中添加这些 actions
3. 保持代码清晰，便于未来维护