# 🚀 快速开始 - 自定义 Actions 注册表

## 立即使用

当前已配置为使用**完整版**（198 个自定义 actions）。重启插件即可使用！

## 版本说明

- **当前使用**: `xdyy_custom_actions_registry_full.js`（完整版）
- **可选版本**:
  - `xdyy_custom_actions_registry.js` - 基础版（5个测试actions）
  - `xdyy_custom_actions_registry_complete.js` - 精选版（30个常用actions）

## 常见操作

### 查看已注册的 Actions
打开插件后会显示：`✅ 注册表已加载 (198 个 actions)`

### 测试功能
1. 在工具栏中找到 "test" 菜单项
2. 点击应该显示：`✅ test action (来自注册表)！结果: KX`

### 添加新的自定义 Action
编辑 `xdyy_custom_actions_registry_full.js`，在 `registerAllCustomActions` 函数中添加：

```javascript
// 你的新功能
global.registerCustomAction("yourActionName", async function(context) {
  const { focusNote, focusNotes } = context;
  MNUtil.undoGrouping(()=>{
    try {
      // 你的代码逻辑
      MNUtil.showHUD("执行成功！");
    } catch (error) {
      MNUtil.showHUD(error);
    }
  });
});
```

### 切换版本
编辑 `main.js` 第 13 行：
```javascript
JSB.require('xdyy_custom_actions_registry_full')  // 改为其他版本文件名
```

## 故障排除

### 如果出现错误
1. 检查 Console 中的错误信息
2. 确认文件路径正确
3. 验证 JSB.require 在 webviewController 之后

### 回滚到原始版本
```bash
mv webviewController.js.backup webviewController.js
# 然后注释掉 main.js 中的 JSB.require 行
```

## 📞 需要帮助？

- 查看 `MIGRATION_COMPLETE_REPORT.md` 了解详细信息
- 查看 `DECOUPLING_SUCCESS_GUIDE.md` 了解架构设计
- 原始代码在 `webviewController.js.backup` 中保留

---
祝使用愉快！🎉