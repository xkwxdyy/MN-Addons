# 🚀 快速测试指南

## ✅ 当前状态

1. **已删除**：webviewController.js 中的 3956 行自定义代码
2. **已创建**：xdyy_all_custom_actions_clean.js（包含所有 198 个 actions）
3. **已配置**：main.js 自动加载扩展文件

## 🧪 测试步骤

### 1. 验证基本功能
重启插件，测试原有功能是否正常：
- copy/paste
- undo/redo  
- chatAI
- search

### 2. 验证自定义功能加载
查看是否有加载提示：
```
✅ 夏大鱼羊定制 Actions 已加载 (198 个)
```

### 3. 测试特定功能
测试 "test" action：
- 应该显示 "KX"

## 🚨 如果出现问题

### 语法错误修复
如果看到语法错误提示，可能需要手动修复 switch 语句。主要问题出现在 moveToBeClassified action 中的嵌套 switch。

### 临时解决方案
1. 在 main.js 中注释掉扩展加载：
```javascript
// JSB.require('xdyy_all_custom_actions_clean')
```

2. 恢复原始文件：
```bash
cp webviewController.js.backup webviewController.js
```

## 💡 建议

1. **先测试核心功能**：确保插件基本功能正常
2. **逐个测试自定义功能**：从最常用的开始
3. **记录问题**：如果某个功能不工作，记下 action 名称

## 📝 备注

- 原始文件备份：webviewController.js.backup
- 自定义 actions 清单：custom_actions_list_detailed.md
- 如需重新提取，原始代码在备份文件的 1849-5802 行