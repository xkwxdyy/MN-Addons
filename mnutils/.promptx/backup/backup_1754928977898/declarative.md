# 陈述性记忆

## 高价值记忆（评分 ≥ 7）

- 2025/07/04 16:41 START
MNUtil.select() 方法不存在陷阱：在 MN-Addon 开发中，文档记载的 MNUtil.select() 方法实际不存在。正确的方法是 MNUtil.userSelect(mainTitle, subTitle, items)，返回 Promise<number>。注意：0 是取消按钮，实际选项从 1 开始（而不是文档中说的从 0 开始）。已修复 mntask 项目中 9 个使用错误 API 的筛选函数。教训：始终以源码为准，使用 grep 验证方法是否存在。 --tags MN-Addon MNUtils API错误 文档问题
--tags #其他 #评分:8 #有效期:长期
- END

