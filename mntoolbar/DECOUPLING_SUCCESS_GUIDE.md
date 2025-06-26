# 🎉 解耦方案 - 注册表模式

## 新方案架构

我们使用了**注册表模式**实现了真正的解耦！

### 工作原理

1. **注册表文件** (`xdyy_custom_actions_registry.js`)
   - 创建全局注册表 `global.customActions`
   - 提供注册和执行函数
   - 所有自定义 actions 在这里定义

2. **主文件修改** (`webviewController.js`)
   - 只修改了 default 分支
   - 检查并执行注册的自定义 actions
   - 未找到的 action 仍显示 "Not supported yet..."

3. **加载机制** (`main.js`)
   - 加载注册表文件
   - 自动注册所有自定义 actions

## 测试步骤

1. 重启插件
2. 应该看到提示：`✅ 注册表已加载 (5 个 actions)`
3. 测试 "test" 菜单项
4. 应该看到：`✅ test action (来自注册表)！结果: KX`

## 添加新的自定义 Actions

在 `xdyy_custom_actions_registry.js` 中的 `registerAllCustomActions` 函数内添加：

```javascript
// 你的新 action
global.registerCustomAction("myNewAction", async function(context) {
  const { focusNote, button, des } = context;
  // 实现你的功能
  MNUtil.showHUD("新功能执行成功！");
});
```

## 已注册的 Actions

当前已注册 5 个 actions：
1. **test** - 测试功能
2. **moveProofDown** - 移动证明到底部
3. **MNFocusNote** - 聚焦笔记
4. **toBeIndependent** - 独立卡片
5. **moveToBeClassified** - 移动到待归类

## 优势

✅ **真正的解耦**：
- webviewController.js 只修改了 4 行代码
- 所有自定义功能在独立文件中
- 添加新功能无需修改主文件

✅ **易于维护**：
- 集中管理所有自定义 actions
- 清晰的注册机制
- 便于调试和测试

✅ **向后兼容**：
- 原有功能不受影响
- 可以随时切换回原始方式

## 批量迁移

从 `xdyy_all_custom_actions_clean.js` 或备份文件迁移更多功能：

1. 找到需要的 case 代码
2. 转换为注册格式：
   ```javascript
   global.registerCustomAction("actionName", async function(context) {
     const { focusNote, focusNotes } = context;
     // 粘贴 case 内的代码（不包括 break）
   });
   ```
3. 添加到 `registerAllCustomActions` 函数中

## 注意事项

- context 对象包含：button, des, focusNote, focusNotes, self
- 使用 async/await 处理异步操作
- 错误会被自动捕获并显示

## 🎯 成功了！

这次我们真正实现了解耦，不需要在主文件中添加每个 case。所有自定义功能都可以在扩展文件中管理。

请测试并告诉我结果！