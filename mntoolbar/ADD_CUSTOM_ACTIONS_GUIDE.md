# 添加自定义 Actions 快速指南

## 当前状态

- ✅ `test` action 已添加并可正常工作
- ✅ 位置：webviewController.js 第 1959-1962 行

## 如何添加更多自定义 Actions

### 1. 在 switch 语句中添加新 case

在 `webviewController.js` 中，找到第 1962 行（test case 的 break 之后），添加新的 case：

```javascript
case "test":
  const name = "鱼羊";
  MNUtil.showHUD("✅ test action 已执行！结果: " + toolbarUtils.getAbbreviationsOfName("Kangwei Xia"))
  break;
/* 在这里添加新的 case */
case "moveProofDown":
  MNUtil.undoGrouping(()=>{
    try {
      focusNote.moveProofDown()
    } catch (error) {
      MNUtil.showHUD(error);
    }
  })
  break;
case "toBeIndependent":
  MNUtil.undoGrouping(()=>{
    try {
      focusNotes.forEach(focusNote=>{
        focusNote.toBeIndependent()
      })
    } catch (error) {
      MNUtil.showHUD(error);
    }
  })
  break;
default:
  MNUtil.showHUD("Not supported yet...")
  break;
```

### 2. 在菜单配置中使用

在 `utils.js` 或你的配置中：

```javascript
case "menu_card":
  config.action = "menu"
  config.menuWidth = 250
  config.menuItems = [
    {
      "action": "test",
      "menuTitle": "测试",
    },
    {
      "action": "moveProofDown",
      "menuTitle": "移动证明到底部",
    },
    {
      "action": "toBeIndependent", 
      "menuTitle": "独立卡片",
    }
  ]
```

## 从备份文件恢复自定义 Actions

你的所有自定义 actions 都在备份文件中。要恢复特定功能：

1. 打开 `webviewController.js.backup`
2. 搜索你需要的 case（如 `case "moveToBeClassified":`）
3. 复制整个 case 块（包括 break）
4. 粘贴到当前文件的 switch 语句中

## 快速恢复常用 Actions

这里是一些你可能想要恢复的常用 actions：

```javascript
// 1. 聚焦笔记
case "MNFocusNote":
  MNUtil.excuteCommand("FocusNote")
  break;

// 2. 删除笔记（带确认）
case "MNEditDeleteNote":
  let confirm = await MNUtil.confirm("删除卡片", "确定要删除这张卡片吗？")
  if (confirm) {
    MNUtil.excuteCommand("EditDeleteNote")
  }
  break;

// 3. 移动到摘录顶部
case "moveToExcerptPartTop":
  MNUtil.undoGrouping(()=>{
    try {
      let newContentsIndexArr = focusNote.getNewContentIndexArr()
      focusNote.moveCommentsByIndexArrTo(newContentsIndexArr, "excerpt", false)
    } catch (error) {
      MNUtil.showHUD(error);
    }
  })
  break;

// 4. 更新归类信息
case "getNewClassificationInformation":
  MNUtil.undoGrouping(()=>{
    try {
      focusNote.toBeClassificationInfoNote()
    } catch (error) {
      MNUtil.showHUD(error);
    }
  })
  break;
```

## 批量恢复

如果你想恢复大量 actions，可以：

1. 从 `xdyy_all_custom_actions_clean.js` 复制需要的功能
2. 将函数体内容直接粘贴到 case 中
3. 移除 `const { focusNote, focusNotes, button, des, self } = context;` 这行

## 注意事项

1. 每个 case 必须有 `break;`
2. 使用 `MNUtil.undoGrouping()` 包装修改操作
3. 使用 try-catch 处理可能的错误
4. 测试每个新添加的功能

## 未来优化

虽然扩展方案暂时失败，但这种直接添加的方式：
- ✅ 简单可靠
- ✅ 易于调试
- ✅ 性能最佳
- ❌ 代码集中（但已经比原来好很多）

保持这种方式，直到找到更好的解耦方案。