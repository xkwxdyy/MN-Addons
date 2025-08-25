# MNSnipaste 插件 PDF 页面定位原理分析

## 概述
MNSnipaste 插件通过点击 loc.png 图标按钮可以精确定位到 PDF 的某个具体页面。本文档详细分析其实现原理，以便在其他地方实现类似功能。

## 定位功能的核心实现

### 1. 数据存储机制

插件在创建贴图或处理笔记时会保存以下关键信息：

- **`docMd5`**: 文档的唯一标识符（MD5哈希值）
- **`pageIndex`**: 页面索引（从0开始）  
- **`focusNoteId`**: 相关联笔记的ID（如果有）

这些信息保存在 `snipasteController` 实例中，作为后续定位的依据。

### 2. 定位按钮事件处理

定位功能的入口在 `webviewController.js` 中：

```javascript
// 第71-73行：创建定位按钮
self.locButton = UIButton.buttonWithType(0);
self.setButtonLayout(self.locButton,"locButtonTapped:")
self.locButton.setImageForState(self.locImage,0)
```

### 3. 定位逻辑实现 (webviewController.js:999-1054)

当用户点击 loc.png 图标按钮时，会触发 `locButtonTapped` 方法：

```javascript
locButtonTapped: async function() {
    let self = getSnipasteController()
    
    // 场景1：如果有关联的笔记
    if (self.focusNoteId) {
        if (!MNUtil.currentNotebookId) {
            MNUtil.showHUD("Not in notebook")
            return
        }
        
        let docMapSplitMode = MNUtil.studyController.docMapSplitMode
        let focusNote = MNNote.new(self.focusNoteId)
        
        if (focusNote.notebookId === MNUtil.currentNotebookId) {
            // 根据文档/脑图分割模式决定如何定位
            switch (docMapSplitMode) {
                case 0:  // 仅脑图模式
                    focusNote.focusInMindMap()
                    break;
                case 1:  // 分割模式
                    focusNote.focusInMindMap()
                    focusNote.focusInDocument()
                    break;
                case 2:  // 仅文档模式
                    focusNote.focusInDocument()
                    break;
            }
        } else {
            // 不在当前笔记本中，在浮动窗口打开
            focusNote.focusInFloatMindMap()
        }
    }
    
    // 场景2：如果有文档信息
    if (self.docMd5) {
        // 如果不是当前文档，先打开目标文档
        if (self.docMd5 !== MNUtil.currentDocMd5) {
            MNUtil.openDoc(self.docMd5)
            // 如果当前是脑图模式，切换到分割模式以显示文档
            if (MNUtil.docMapSplitMode === 0) {
                MNUtil.studyController.docMapSplitMode = 1
            }
            await MNUtil.delay(0.01)
        }
        
        // 跳转到指定页面
        let docController = MNUtil.currentDocController
        if (docController.currPageIndex !== self.pageIndex) {
            docController.setPageAtIndex(self.pageIndex)
        }
    }
}
```

## 核心 API 分析

### MarginNote 内部 API

1. **文档操作**
   - `MNUtil.openDoc(docMd5)` - 根据文档MD5打开文档
   - `MNUtil.currentDocMd5` - 获取当前文档的MD5
   - `MNUtil.getDocById(md5)` - 根据MD5获取文档对象

2. **页面控制**
   - `docController.currPageIndex` - 当前页面索引
   - `docController.setPageAtIndex(pageIndex)` - 跳转到指定页面索引
   - `docController.pageNoFromIndex(index)` - 索引转页码
   - `docController.indexFromPageNo(pageNo)` - 页码转索引

3. **笔记定位**
   - `focusNote.focusInDocument()` - 在文档中定位笔记
   - `focusNote.focusInMindMap()` - 在脑图中定位笔记
   - `focusNote.focusInFloatMindMap()` - 在浮动脑图中定位

4. **视图模式**
   - `MNUtil.docMapSplitMode` - 获取当前视图模式
     - 0: 仅脑图
     - 1: 分割视图
     - 2: 仅文档
   - `MNUtil.studyController.docMapSplitMode = mode` - 设置视图模式

## 在其他插件中实现类似功能

### 步骤1：保存定位信息

```javascript
// 保存当前位置信息
function saveCurrentLocation() {
    return {
        docMd5: MNUtil.currentDocMd5,
        pageIndex: MNUtil.currentDocController.currPageIndex,
        noteId: MNNote.getFocusNote()?.noteId
    };
}
```

### 步骤2：恢复定位

```javascript
// 恢复到保存的位置
async function restoreLocation(location) {
    // 1. 检查并打开文档
    if (location.docMd5 && location.docMd5 !== MNUtil.currentDocMd5) {
        MNUtil.openDoc(location.docMd5);
        
        // 确保文档可见
        if (MNUtil.docMapSplitMode === 0) {
            MNUtil.studyController.docMapSplitMode = 1;
        }
        
        // 等待文档加载
        await MNUtil.delay(0.1);
    }
    
    // 2. 跳转到指定页面
    if (location.pageIndex !== undefined) {
        let docController = MNUtil.currentDocController;
        if (docController && docController.currPageIndex !== location.pageIndex) {
            docController.setPageAtIndex(location.pageIndex);
        }
    }
    
    // 3. 定位笔记（如果有）
    if (location.noteId) {
        let note = MNNote.new(location.noteId);
        if (note) {
            // 根据当前视图模式定位
            let mode = MNUtil.docMapSplitMode;
            if (mode === 0 || mode === 1) {
                note.focusInMindMap();
            }
            if (mode === 1 || mode === 2) {
                note.focusInDocument();
            }
        }
    }
}
```

### 步骤3：创建定位按钮

```javascript
// 在插件界面添加定位按钮
function createLocationButton() {
    let button = UIButton.buttonWithType(0);
    button.setTitleForState("📍", 0);
    button.addTargetActionForControlEvents(self, "onLocationButtonTap:", 1 << 6);
    // 设置按钮位置和样式...
    return button;
}

// 按钮点击处理
function onLocationButtonTap() {
    if (this.savedLocation) {
        restoreLocation(this.savedLocation);
    } else {
        MNUtil.showHUD("No saved location");
    }
}
```

## 实现要点

1. **页面索引 vs 页码**
   - `pageIndex`: 从0开始的索引
   - `pageNo`: 实际的页码（通常从1开始）
   - 某些PDF可能有复杂的页码系统，需要通过 `docController` 的方法转换

2. **异步处理**
   - 打开文档是异步操作，需要适当的延迟等待
   - 使用 `await MNUtil.delay(0.1)` 确保操作完成

3. **视图模式兼容**
   - 定位前检查当前视图模式
   - 必要时自动切换到合适的视图模式

4. **错误处理**
   - 检查文档是否存在
   - 验证页面索引的有效性
   - 处理笔记不在当前笔记本的情况

## 总结

MNSnipaste 插件的页面定位功能通过以下核心机制实现：

1. **数据持久化**：保存文档标识(MD5)和页面索引
2. **API调用**：利用 MNUtil 和 docController 的内部API
3. **智能视图切换**：根据场景自动调整文档/脑图视图模式
4. **异步控制**：处理文档加载的异步特性

这种实现方式充分利用了 MarginNote 的插件系统能力，通过简单的数据保存和API调用，实现了精确的页面定位功能。开发者可以参考这个实现，在自己的插件中添加类似的定位功能。