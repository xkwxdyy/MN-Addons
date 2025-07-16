# 修复 setTextview 中 action.name undefined 错误

## 问题描述

在使用 MN Toolbar 插件时，打开设置界面会出现以下错误：

```
[13:39:40] [ERROR] [MN Toolbar] setTextview
{
  "source": "setTextview",
  "time": "Wed Jul 16 2025 13:39:40 GMT+0800 (中国标准时间)",
  "error": "undefined is not an object (evaluating 'action.name')"
}
```

## 根本原因

1. 官方版本更新后，`toolbarConfig.getAction()` 方法的行为发生了变化
2. 在 `xdyy_button_registry.js` 中重写的 `getAction` 方法在某些情况下返回 `undefined`
3. `settingController.js` 的 `setTextview` 函数没有处理 action 为 undefined 的情况

## 解决方案

### 1. 改进 getAction 方法 (xdyy_button_registry.js)

```javascript
toolbarConfig.getAction = function(actionKey) {
  // 先检查自定义按钮
  if (global.customButtons[actionKey]) {
    const button = Object.assign({}, global.customButtons[actionKey]);
    
    // 如果有 templateName，动态获取 description
    if (button.templateName && !button.description && this.template) {
      button.description = this.template(button.templateName);
    }
    
    delete button.templateName;
    return button;
  }
  
  // 如果不是自定义按钮，调用原始方法
  if (toolbarConfig._originalGetAction) {
    const result = toolbarConfig._originalGetAction.call(this, actionKey);
    if (result) {
      return result;
    }
  }
  
  // 如果都找不到，尝试从 getActions() 中获取
  const allActions = this.getActions();
  if (allActions && allActions[actionKey]) {
    return allActions[actionKey];
  }
  
  // 最后返回一个默认的空按钮配置，避免 undefined 错误
  if (typeof MNUtil !== "undefined" && MNUtil.log) {
    MNUtil.log(`⚠️ 找不到按钮配置: ${actionKey}，返回默认配置`);
  }
  return {
    name: actionKey,
    image: "default",
    description: "{}"
  };
};
```

### 2. 添加防御性检查 (settingController.js)

```javascript
let action = toolbarConfig.getAction(actionKey)
// 添加防御性检查
if (!action) {
  if (typeof MNUtil !== "undefined" && MNUtil.log) {
    MNUtil.log(`⚠️ setTextview: 获取按钮配置失败 - ${actionKey}`);
  }
  action = { name: actionKey, description: "{}" };
}
```

## 影响范围

- 修复后设置界面可以正常打开，不会再出现崩溃
- 即使按钮配置不存在，也会返回默认配置
- 增加了日志记录，便于调试

## 测试建议

1. 打开 MN Toolbar 设置界面
2. 切换不同的按钮配置
3. 确认没有报错信息

## 相关文件

- `xdyy_button_registry.js`：自定义按钮注册表
- `settingController.js`：设置界面控制器
- `utils.js`：工具配置类

## 标签

- bug
- 兼容性
- 错误处理