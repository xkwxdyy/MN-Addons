# 自定义 Actions 解耦迁移指南

## 概述

本指南说明如何将你在 `webviewController.js` 中添加的自定义 case 迁移到独立的扩展文件中，实现代码解耦。

## 解耦方案架构

### 1. 文件结构
```
mntoolbar/
├── main.js                    # 主入口文件（已添加扩展加载）
├── webviewController.js       # 原始控制器文件（保持不变）
├── xdyy_custom_actions.js     # 自定义 actions 扩展文件（新增）
└── ...
```

### 2. 工作原理

- 扩展文件通过重写 `customActionByDes` 方法来拦截自定义 actions
- 如果是自定义 action，则调用对应的处理器
- 如果不是，则调用原始方法处理

## 迁移步骤

### 步骤 1：识别需要迁移的 case

你的自定义 case 从 `case "test":` 开始，到 `case "replaceFieldContentByPopup":` 结束。

### 步骤 2：将 case 迁移到扩展文件

在 `xdyy_custom_actions.js` 的 `customActionHandlers` 对象中，每个 case 变成一个函数：

```javascript
const customActionHandlers = {
  // 原来的 case "yourAction":
  "yourAction": async function(context) {
    const { focusNote, focusNotes, button, des } = context
    // 你的代码逻辑
  },
  
  // 更多 actions...
}
```

### 步骤 3：处理共享变量

原来在 `customActionByDes` 中定义的变量，现在通过 context 传递：

```javascript
// 原来：
let focusNote = MNNote.getFocusNote()
let htmlSetting = [...]

// 现在：
const { focusNote, htmlSetting } = context
```

### 步骤 4：添加新的自定义 action

只需在 `customActionHandlers` 对象中添加新的函数即可：

```javascript
"myNewAction": async function(context) {
  const { focusNote } = context
  // 实现你的功能
}
```

## 使用示例

### 示例 1：简单的 action

```javascript
"showMessage": async function(context) {
  MNUtil.showHUD("Hello from custom action!")
}
```

### 示例 2：处理卡片的 action

```javascript
"processNote": async function(context) {
  const { focusNote, focusNotes } = context
  
  MNUtil.undoGrouping(() => {
    try {
      if (focusNote) {
        focusNote.noteTitle = "已处理: " + focusNote.noteTitle
      }
    } catch (error) {
      MNUtil.showHUD(error)
    }
  })
}
```

### 示例 3：带弹窗的 action

```javascript
"selectOption": async function(context) {
  const { focusNote } = context
  
  UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
    "选择操作",
    "请选择要执行的操作",
    0,
    "取消",
    ["选项1", "选项2", "选项3"],
    (alert, buttonIndex) => {
      if (buttonIndex > 0) {
        MNUtil.showHUD("你选择了选项 " + buttonIndex)
      }
    }
  )
}
```

## 注意事项

1. **异步处理**：所有 action 处理器都应该是 async 函数
2. **错误处理**：使用 try-catch 包装可能出错的代码
3. **撤销支持**：使用 `MNUtil.undoGrouping()` 包装修改操作
4. **性能考虑**：避免在 action 中执行耗时操作

## 调试技巧

1. 在扩展文件加载时会显示提示：`✅ 自定义 Actions 已加载`
2. 可以在每个 action 开始时添加日志：
   ```javascript
   "myAction": async function(context) {
     MNUtil.showHUD("执行 myAction")
     // 你的代码
   }
   ```

## 完整迁移清单

以下是你需要迁移的所有 actions：

- [x] test
- [x] getNewClassificationInformation  
- [x] moveProofDown
- [x] MNFocusNote
- [x] MNEditDeleteNote
- [x] moveToExcerptPartTop
- [x] moveToExcerptPartBottom
- [x] toBeProgressNote
- [x] toBeIndependent
- [x] moveToInput
- [x] moveToPreparationForExam
- [x] moveToInternalize
- [x] moveToBeClassified
- [x] replaceFieldContentByPopup
- [ ] （继续添加其他 actions...）

## 保持原有代码的方案

如果你暂时不想删除原有代码，可以：

1. 保持 `webviewController.js` 中的代码不变
2. 在扩展文件中只添加新功能
3. 通过配置控制使用哪种方式

## 优势

1. **模块化**：自定义功能独立管理
2. **可维护**：升级插件时不会丢失自定义代码  
3. **易扩展**：添加新功能更简单
4. **版本控制友好**：减少合并冲突

## 后续步骤

1. 完成所有 actions 的迁移
2. 测试每个功能是否正常工作
3. 根据需要调整和优化代码结构
4. 考虑将相关功能分组到不同的扩展文件中