# 陈述性记忆

## 高价值记忆（评分 ≥ 7）

- 2025/07/06 00:31 START
MN-Addon 开发陷阱：变量重复声明导致的静默加载失败

问题描述：
- 插件突然无法找到某个类（如 MNTaskManager），报错 "Can't find variable: ClassName"
- 没有任何语法错误提示，文件似乎没有被成功加载

根本原因：
JavaScript 文件中存在语法错误（如在同一作用域内重复声明 const 变量），但被文件末尾的 try-catch 静默处理了。

真实案例：
在 xdyy_utils_extensions.js 的 linkParentTask 方法中，第786行和第836行重复声明了 const parentParts 变量，导致语法错误。

为什么难以发现：
文件末尾的初始化代码静默处理了所有错误：
```javascript
} catch (error) {
  // 静默处理错误 - 这导致问题难以发现！
}
```

诊断方法：
1. 使用 node -c filename.js 检查语法错误
2. 查看 git diff 重点检查变量声明
3. 搜索变量名检查是否重复声明

解决方案：
1. 修复语法错误（删除重复声明或重命名）
2. 改进错误处理，在 catch 块中添加日志
3. 开发时启用语法检查，提交前验证
4. 使用 ESLint 配置 no-redeclare 规则

经验总结：
- 当类突然"消失"时，首先怀疑文件加载失败
- 文件加载失败通常是因为语法错误
- 静默的 try-catch 是调试的大敌
- 始终使用工具验证语法正确性 --tags MN-Addon JavaScript 语法错误 调试技巧 MarginNote插件
--tags #最佳实践 #工具使用 #评分:8 #有效期:长期
- END

