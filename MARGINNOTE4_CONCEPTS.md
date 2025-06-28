# MarginNote4 核心概念 - 插件开发者指南

> 本文档总结了 MarginNote4 的核心概念和功能，帮助插件开发者更好地理解系统架构。

## 📚 MarginNote4 基础架构

### 1. 文档系统

#### 支持的文档类型
- **PDF**: 主要文档格式，支持批注、高亮、手写
- **ePub**: 电子书格式，支持重排版
- **网页**: 通过内置浏览器导入

#### 文档标识
```javascript
// 每个文档都有唯一的 MD5 标识
doc.docMd5        // 文档唯一标识
doc.docTitle      // 文档标题
doc.pageCount     // 页数
```

### 2. 笔记系统层级结构

```
学习集 (Study Set)
  └── 笔记本 (Notebook)
      └── 笔记 (Note)
          ├── 摘录 (Excerpt)
          ├── 评论 (Comments)
          │   ├── 文本评论
          │   ├── 图片评论
          │   ├── 手写评论
          │   └── 链接评论
          ├── 标签 (Tags)
          └── 子笔记 (Child Notes)
```

### 3. 笔记类型

#### 3.1 摘录笔记
- 从文档中选择文本或图片创建
- 保留原文位置信息
- 支持多段摘录合并

#### 3.2 脑图笔记
- 独立创建的笔记
- 不依赖文档内容
- 常用于知识整理

#### 3.3 卡片笔记
- 用于记忆和复习
- 支持正反面设计
- 可加入复习计划

### 4. 学习模式

MarginNote4 提供三种主要模式：

1. **文档模式** (Document Mode)
   - 阅读和标注文档
   - 创建摘录笔记
   - 快速浏览

2. **学习模式** (Study Mode)
   - 文档 + 脑图双屏显示
   - 整理知识结构
   - 建立笔记关联

3. **复习模式** (Review Mode)
   - 间隔重复算法
   - 卡片式复习
   - 记忆强化

### 5. 脑图功能

#### 脑图视图类型
- **大纲视图**: 层级列表显示
- **脑图视图**: 思维导图显示
- **框架视图**: 表格化显示

#### 脑图操作
```javascript
// 聚焦到脑图中的笔记
MNUtil.focusNoteInMindMapById(noteId, delay)

// 获取脑图视图
MNUtil.mindmapView

// 脑图分支颜色
note.mindmapBranchColor
```

### 6. 标签系统

#### 标签类型
1. **普通标签**: 用于分类和筛选
2. **链接标签**: 建立笔记间关联
3. **系统标签**: 如 #重要 #待办

#### 标签操作
```javascript
note.tags                    // 获取标签数组
note.appendTags(["标签1"])   // 添加标签
note.removeTags(["标签2"])   // 删除标签
```

### 7. 链接系统

#### 链接类型
1. **笔记链接**: 连接相关笔记
2. **文档链接**: 跳转到文档位置
3. **外部链接**: 网页或其他应用

#### URL 格式
```
marginnote4app://note/[noteId]      // 笔记链接
marginnote4app://notebook/[id]      // 笔记本链接
```

### 8. 评论系统

#### 评论类型
```javascript
// 文本评论
note.appendTextComment("评论内容")

// Markdown 评论
note.appendMarkdownComment("**加粗**文本")

// HTML 评论（富文本）
note.appendHtmlComment(html, text, size, tag)

// 图片评论
note.appendImageComment(imageData)

// 链接评论
note.appendNoteLink(targetNote, "链接说明")
```

### 9. 颜色系统

MarginNote4 使用 16 色系统：

```javascript
// 颜色索引 0-15
0: "淡黄色"    8: "橙色"
1: "淡绿色"    9: "深绿色"
2: "淡蓝色"    10: "深蓝色"
3: "淡红色"    11: "深红色"
4: "黄色"      12: "白色"
5: "绿色"      13: "淡灰色"
6: "蓝色"      14: "深灰色"
7: "红色"      15: "紫色"
```

### 10. 数据管理

#### 存储位置
- **本地存储**: SQLite 数据库
- **iCloud 同步**: 跨设备同步
- **备份**: 支持导出为 .mnbackup

#### 数据库结构
```javascript
MNUtil.db                    // 数据库实例
MNUtil.dbFolder             // 数据库文件夹
```

### 11. 扩展系统

#### 插件位置
- iOS: `~/Library/MarginNote 4/Extensions/`
- macOS: `~/Library/Containers/MarginNote 4/Data/Library/MarginNote 4/Extensions/`

#### 插件生命周期
```javascript
// 场景连接
sceneWillConnect()

// 笔记本打开
notebookWillOpen(notebookId)

// 文档打开
documentDidOpen(docMd5)

// 场景断开
sceneDidDisconnect()
```

### 12. 手势和快捷键

#### 常用手势
- **长按**: 弹出菜单
- **双击**: 快速编辑
- **拖放**: 移动笔记

#### 弹出菜单
```javascript
// 笔记弹出菜单
onPopupMenuOnNote(info)

// 选择区域弹出菜单
onPopupMenuOnSelection(info)
```

### 13. 导入导出

#### 支持的格式
- **导入**: PDF, ePub, 网页, .mnbackup
- **导出**: 
  - 脑图: PNG, PDF, OPML, Markdown
  - 笔记: Anki, PDF, Word
  - 数据: .mnbackup

### 14. 主题系统

```javascript
MNUtil.themeColor = {
  Gray: "#414141",     // 灰色主题
  Default: "#FFFFFF",  // 默认主题
  Dark: "#000000",     // 暗色主题
  Green: "#E9FBC7",    // 绿色主题
  Sepia: "#F5EFDC"     // 棕褐色主题
}
```

## 🔧 插件开发要点

### 1. 理解数据流
- 用户操作 → 插件响应 → 修改数据 → UI 更新

### 2. 性能考虑
- 避免频繁的数据库操作
- 使用批量更新
- 合理使用缓存

### 3. 用户体验
- 遵循 MarginNote 的交互习惯
- 提供撤销功能
- 错误处理要友好

### 4. 版本兼容
- 检测 MN3/MN4 版本
- 使用条件判断处理差异
- 测试多版本兼容性

### 5. 调试技巧
- 使用 Safari Web Inspector
- 添加详细的日志
- 处理边界情况

## 📝 最佳实践

1. **遵循 MN 设计理念**
   - 以学习为中心
   - 强调知识管理
   - 注重效率

2. **插件功能定位**
   - 增强而非替代
   - 专注特定场景
   - 保持简洁

3. **数据安全**
   - 操作前备份
   - 验证用户输入
   - 处理异常情况

4. **性能优化**
   - 懒加载资源
   - 异步处理任务
   - 及时释放内存

5. **用户反馈**
   - 清晰的操作提示
   - 进度显示
   - 错误说明

## 🚀 常见插件类型

1. **笔记处理类**
   - 批量整理
   - 格式转换
   - 内容增强

2. **学习辅助类**
   - 复习计划
   - 知识测试
   - 学习统计

3. **导入导出类**
   - 第三方格式支持
   - 数据迁移
   - 备份管理

4. **界面增强类**
   - 快捷操作
   - 视图定制
   - 主题美化

5. **集成类**
   - 外部服务连接
   - API 集成
   - 云同步

## 📚 参考资源

- MarginNote 官方文档
- 插件开发 API 文档
- 社区插件示例
- 用户反馈论坛