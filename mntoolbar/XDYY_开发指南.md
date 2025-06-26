# XDYYToolbar 开发指南

## 目录
1. [添加新功能的步骤](#添加新功能的步骤)
2. [代码结构说明](#代码结构说明)
3. [示例：添加一个新功能](#示例添加一个新功能)
4. [调试技巧](#调试技巧)
5. [常见问题](#常见问题)

## 添加新功能的步骤

### 1. 在 xdyytoolbar.js 中添加动作定义

在 `registerCustomActions()` 方法的 `customActions` 数组中添加新动作：

```javascript
{
  id: 'myNewFunction',           // 唯一标识符
  title: '🆕 我的新功能',         // 显示名称（支持 emoji）
  group: 'customCardOperations',  // 分组（用于组织功能）
  callback: () => this.myNewFunction()  // 回调函数
}
```

### 2. 实现功能方法

在 `xdyytoolbar.js` 中添加对应的方法：

```javascript
// 我的新功能实现
myNewFunction() {
  try {
    // 获取当前选中的卡片
    const focusNote = MNNote.getFocusNote();
    if (!focusNote) {
      MNUtil.showHUD('❌ 请先选择一个卡片');
      return;
    }
    
    // 实现你的功能逻辑
    // ...
    
    // 显示成功消息
    MNUtil.showHUD('✅ 功能执行成功');
  } catch (error) {
    MNUtil.showHUD('❌ 执行失败：' + error.message);
  }
}
```

### 3. 添加到菜单（可选）

如果想在主菜单中显示，修改 `registerMenuExtensions()` 方法：

```javascript
this.menuItems = [
  {
    title: '🗂️ 卡片预处理模式',
    object: this.toolbar.addon,
    selector: 'executeCustomAction:',
    param: { action: 'togglePreprocess' }
  },
  // 添加新的菜单项
  {
    title: '🆕 我的新功能',
    object: this.toolbar.addon,
    selector: 'executeCustomAction:',
    param: { action: 'myNewFunction' }
  }
];
```

### 4. 添加工具函数（如需要）

如果需要添加通用工具函数，在 `registerUtilityFunctions()` 中注册：

```javascript
MNUtil.myUtilityFunction = this.myUtilityFunction.bind(this);
```

然后实现该函数：

```javascript
myUtilityFunction(param) {
  // 工具函数实现
  return result;
}
```

## 代码结构说明

### xdyytoolbar.js 结构

```javascript
const XDYYToolbar = {
  // 初始化函数
  init(toolbar) { ... },
  
  // 注册自定义动作
  registerCustomActions() { ... },
  
  // 注册工具函数
  registerUtilityFunctions() { ... },
  
  // 注册菜单扩展
  registerMenuExtensions() { ... },
  
  // 配置定义
  htmlSettings: { ... },
  mathCategories: [ ... ],
  
  // ===== 功能实现部分 =====
  // 你的所有功能方法
  togglePreprocess() { ... },
  myNewFunction() { ... },
  
  // ===== 工具函数实现 =====
  // 通用工具函数
  getAbbreviationsOfName(name) { ... },
  
  // 获取器方法
  getCustomActions() { ... },
  getMenuItems() { ... }
};
```

### 常用 API 参考

#### 1. 卡片操作
```javascript
// 获取当前选中的卡片
const focusNote = MNNote.getFocusNote();

// 获取多选的卡片
const focusNotes = MNNote.getFocusNotes();

// 更新卡片
MNNote.updateNoteId({
  noteid: focusNote.noteId,
  title: '新标题',
  content: '新内容',
  tags: ['tag1', 'tag2']
});

// 删除卡片
MNNote.deleteNoteId(noteId);

// 移动卡片
MNNote.moveNote({
  noteId: sourceId,
  targetNoteId: targetId
});
```

#### 2. 获取笔记本中的所有卡片
```javascript
const currentDocmd5 = MNNote.currentDocmd5;
const allNotes = MNUtil.getNotes(currentDocmd5);
```

#### 3. 显示消息
```javascript
MNUtil.showHUD('消息内容');
```

#### 4. 选择菜单
```javascript
const options = [
  { title: '选项1', value: 'value1' },
  { title: '选项2', value: 'value2' }
];

MNUtil.select(options, (selected) => {
  if (selected) {
    // 处理选择
  }
});
```

## 示例：添加一个新功能

### 需求：添加一个"合并卡片"功能

1. **在 customActions 中添加动作**：
```javascript
{
  id: 'mergeNotes',
  title: '🔗 合并卡片',
  group: 'customCardOperations',
  callback: () => this.mergeNotes()
}
```

2. **实现功能**：
```javascript
mergeNotes() {
  try {
    const focusNotes = MNNote.getFocusNotes();
    if (!focusNotes || focusNotes.length < 2) {
      MNUtil.showHUD('❌ 请选择至少两张卡片');
      return;
    }
    
    // 选择合并方式
    const options = [
      { title: '合并到第一张卡片', value: 'first' },
      { title: '合并到最后一张卡片', value: 'last' },
      { title: '创建新卡片', value: 'new' }
    ];
    
    MNUtil.select(options, (mergeType) => {
      if (!mergeType) return;
      
      let mergedContent = '';
      let mergedTitle = '';
      
      // 收集所有内容
      focusNotes.forEach((note, index) => {
        if (index === 0) {
          mergedTitle = note.noteTitle || '合并的卡片';
        }
        mergedContent += (note.noteText || '') + '\n\n';
      });
      
      // 根据选择执行合并
      switch (mergeType) {
        case 'first':
          MNNote.updateNoteId({
            noteid: focusNotes[0].noteId,
            content: mergedContent.trim()
          });
          // 删除其他卡片
          for (let i = 1; i < focusNotes.length; i++) {
            MNNote.deleteNoteId(focusNotes[i].noteId);
          }
          break;
          
        case 'last':
          MNNote.updateNoteId({
            noteid: focusNotes[focusNotes.length - 1].noteId,
            title: mergedTitle,
            content: mergedContent.trim()
          });
          // 删除其他卡片
          for (let i = 0; i < focusNotes.length - 1; i++) {
            MNNote.deleteNoteId(focusNotes[i].noteId);
          }
          break;
          
        case 'new':
          // 创建新卡片的逻辑
          // 注意：MN 的 API 可能需要特定方法创建新卡片
          MNUtil.showHUD('🚧 创建新卡片功能待实现');
          break;
      }
      
      MNUtil.showHUD(`✅ 已合并 ${focusNotes.length} 张卡片`);
    });
    
  } catch (error) {
    MNUtil.showHUD('❌ 合并失败：' + error.message);
  }
}
```

## 调试技巧

### 1. 使用日志输出
```javascript
// 在开发时可以使用
console.log('调试信息', data);

// 或者使用 MNUtil.showHUD 显示调试信息
MNUtil.showHUD('当前卡片ID: ' + focusNote.noteId);
```

### 2. 错误处理
始终使用 try-catch 包裹你的代码：
```javascript
myFunction() {
  try {
    // 你的代码
  } catch (error) {
    MNUtil.showHUD('❌ 错误：' + error.message);
    // 可选：记录错误日志
    toolbarUtils.addErrorLog(error, "myFunction");
  }
}
```

### 3. 检查对象存在性
```javascript
// 检查 API 是否可用
if (typeof MNUtil === 'undefined') return;
if (typeof XDYYToolbar === 'undefined') return;

// 检查对象属性
if (focusNote && focusNote.noteId) {
  // 安全使用
}
```

## 常见问题

### Q1: 如何获取卡片的所有属性？
```javascript
const focusNote = MNNote.getFocusNote();
console.log('卡片属性:', {
  noteId: focusNote.noteId,
  title: focusNote.noteTitle,
  content: focusNote.noteText,
  excerptText: focusNote.excerptText,
  comments: focusNote.comments,
  tags: focusNote.noteTags,
  color: focusNote.colorIndex,
  createDate: focusNote.createDate,
  modifyDate: focusNote.modifyDate
});
```

### Q2: 如何处理异步操作？
```javascript
async myAsyncFunction() {
  try {
    // 使用 await 等待异步操作
    await MNUtil.delay(0.5);
    
    // 执行后续操作
    const result = await someAsyncOperation();
    
  } catch (error) {
    MNUtil.showHUD('❌ 异步操作失败');
  }
}
```

### Q3: 如何添加键盘快捷键？
目前需要在主系统中注册快捷键，暂不支持在 xdyytoolbar.js 中直接添加。

### Q4: 如何保存自定义配置？
```javascript
// 保存配置
toolbarConfig.myCustomConfig = {
  option1: true,
  option2: 'value'
};
toolbarConfig.save();

// 读取配置
const myConfig = toolbarConfig.myCustomConfig || {};
```

## 最佳实践

1. **命名规范**
   - 函数名使用 camelCase：`myNewFunction`
   - 动作 ID 使用小写：`myNewAction`
   - 显示名称可以使用中文和 emoji

2. **错误处理**
   - 始终检查对象是否存在
   - 使用 try-catch 捕获错误
   - 给用户友好的错误提示

3. **性能考虑**
   - 避免在循环中进行大量 DOM 操作
   - 批量处理卡片时考虑性能影响
   - 使用异步操作避免阻塞 UI

4. **用户体验**
   - 操作前检查前置条件
   - 操作后给出明确反馈
   - 危险操作前进行确认

## 版本更新注意事项

当官方版本更新时：
1. 备份你的 `xdyytoolbar.js`
2. 更新官方文件
3. 重新应用集成代码（见 XDYY_README.md）
4. 测试所有自定义功能