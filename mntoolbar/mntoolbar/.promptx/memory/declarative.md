# 陈述性记忆

## 高价值记忆（评分 ≥ 7）

- 2025/07/06 13:33 START
## focusInMindMap 定位失效问题解决方案

### 问题描述
在 MarginNote 插件开发中，创建新卡片后使用 focusInMindMap 方法无法正确定位到新卡片，焦点仍停留在原卡片上。

### 根本原因
MNUtil.undoGrouping() 与后续的评论移动操作（moveCommentsArrToField）存在冲突，移动操作会改变焦点，导致 focusInMindMap 的定位效果被覆盖。

### 解决方案
使用 MNUtil.delay().then() 代替 MNUtil.undoGrouping()，确保所有操作完成后再执行定位：

```javascript
// 先执行所有可能改变焦点的操作
note.appendMarkdownComment(...);
note.appendNoteLink(...);
this.moveCommentsArrToField(...);

// 延迟执行定位
MNUtil.delay(0.5).then(() => {
  if (MNUtil.mindmapView) {
    newNote.focusInMindMap(0.3)
  }
})
```

### 关键点
1. 执行顺序：所有UI操作完成后再定位
2. 使用 Promise 延迟而非 undoGrouping
3. 检查是否在脑图视图中
4. 避免焦点竞争 --tags MarginNote focusInMindMap 焦点管理 异步执行
--tags #其他 #评分:8 #有效期:长期
- END

