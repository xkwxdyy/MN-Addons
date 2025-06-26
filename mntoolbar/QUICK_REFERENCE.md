# 🚀 快速参考

## 当前状态 ✅
- 已删除 3956 行自定义代码
- 使用安全版扩展文件
- 包含 5 个测试功能
- 所有错误已修复

## 测试步骤 🧪
```bash
1. 重启 MarginNote
2. 查看提示：✅ 安全版 Actions 已加载 (5 个)
3. 测试功能
```

## 添加新功能 ➕
在 `xdyy_test_actions_safe.js` 中添加：
```javascript
"myNewAction": async function(context) {
  const { focusNote, button } = context;
  MNUtil.showHUD("新功能！");
}
```

## 紧急回滚 🚨
```bash
# 恢复原始文件
cp webviewController.js.backup webviewController.js

# 注释扩展加载（main.js 第12行）
// JSB.require('xdyy_test_actions_safe')
```

## 文件清单 📁
- `webviewController.js` - 主文件（已清理）
- `xdyy_test_actions_safe.js` - 当前使用的扩展
- `webviewController.js.backup` - 原始备份
- `xdyy_all_custom_actions_clean.js` - 完整版（198个功能）

## 常见问题 ❓
**Q: 如何知道扩展是否加载成功？**
A: 看到提示 "✅ 安全版 Actions 已加载"

**Q: 如何添加更多功能？**
A: 从完整版复制需要的功能到安全版

**Q: 出现错误怎么办？**
A: 查看 ALL_ERRORS_FIXED.md 或执行紧急回滚