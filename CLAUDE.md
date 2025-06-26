你现在是 MarginNote4 插件开发专家。

# ✅ MarginNote4 插件开发与协作规范

> 本规范条款为强制性，除非用户显式豁豁免，任何条目都不得忽视或删减。
>
>   - 每次输出前必须深度理解项目背景、用户意图和技术栈特征（例如 Node.js, React, Vue 等）。
>   - 当回答依赖外部知识或信息不确定时，先查询至少一份权威资料（如 MDN, ECMA 标准, 官方文档或源码）再作结论。
>   - 引用外部资料须在回复中注明来源；可使用链接或版本号，保证可追溯。
>   - 若用户需求含糊，先用一句话复述已知信息，并列出关键澄清问题，待用户确认后再继续。
>   - 同一次回复中的术语、变量名、逻辑描述保持一致；发现冲突必须立即修正。
>   - 仅回答与问题直接相关内容，避免冗余、无关扩展或教程式铺陈。
>   - 面对复杂需求，先拆分为若干可管理子任务，在输出中按子任务顺序呈现，便于用户跟进。
>
> 所有技术输出必须建立在准确、思考过的基础之上，拒绝机械生成与无脑填充。


## API 参考

[MNUtils](/Users/xiakangwei/Nutstore/Github/repository/MN-addon-develop/mnutils/mnutils) 里的 mnutils.js 和 xdyyutils.js 是 MarginNote4 插件开发的核心库，提供了丰富的 API 接口。

注意：下面的行数可能因为更新不太准确，请以实际文件为准。

### mnutils.js - 官方 API 基础库

#### 文件信息
- **性质**: MarginNote4 官方 API 封装
- **作用**: 提供统一接口操作 MarginNote 核心功能

#### 核心类架构 (9个主要类)

##### 1. Menu 类 (第1行)
```javascript
class Menu {
  preferredPosition = 2  // 左0, 下1, 上2, 右4
  addMenuItem(title, selector, params = "", checked = false)
  show() / dismiss()
}
```
**用途**: 弹出菜单组件

##### 2. MNUtil 类 (第140行) - 核心工具类
```javascript
class MNUtil {
  // 主题颜色
  static themeColor = { Gray, Default, Dark, Green, Sepia }
  
  // 环境获取
  static get app() / get db() / get currentWindow()
  static get studyController() / get studyView()
  static get readerController() / get notebookController()
  
  // 工具方法
  static init(mainPath)
  static addErrorLog(error, source, info)
  static getNoteById(noteid, alert = true)
}
```

##### 3. MNNote 类 (第4152行) - 笔记核心类
```javascript
class MNNote {
  constructor(note) // 支持 MbBookNote/URL/ID/配置对象
  
  // 核心属性
  note: MbBookNote
  title / noteTitle
  comments / MNComments
  parentNote / childNotes
  
  // 主要方法
  addChild() / removeChild()
  appendMarkdownComment() / appendTextComment()
  moveComment() / removeCommentByIndex()
  merge() / delete()
}
```

##### 4. MNComment 类 (第6317行) - 评论类
```javascript
class MNComment {
  type: string  // 评论类型
  detail: object  // 原始数据
  
  // 支持的类型
  // - textComment / markdownComment
  // - imageComment / drawingComment  
  // - mergedImageComment / blankImageComment
  
  get text() / set text()
  get imageData()
  get markdown() / set markdown()
}
```

##### 5-9. 其他类
- **MNConnection** (第2767行): 网络连接
- **MNButton** (第3151行): 按钮组件
- **MNDocument** (第3734行): 文档操作
- **MNNotebook** (第3859行): 笔记本操作
- **MNExtensionPanel** (第6737行): 扩展面板

#### 设计模式特点
1. **静态工具类模式**: MNUtil 提供全局功能
2. **包装器模式**: 封装原生对象，提供友好 API
3. **类型系统**: 完整的评论类型判断机制
4. **错误处理**: 内置日志和错误处理

### xdyyutils.js - 自定义扩展库

#### 文件信息
- **行数**: 5800+ 行
- **性质**: 基于 mnutils.js 的学术笔记管理扩展
- **特色**: 专为数学学科设计的知识卡片系统

#### 核心模块架构

##### 1. MNMath 类 - 数学卡片管理系统

###### 卡片类型定义
```javascript
static types = {
  定义: { colorIndex: 2, templateNoteId: "...", fields: ["相关思考", "相关链接"] },
  命题: { colorIndex: 10, templateNoteId: "...", fields: ["证明", "相关思考", "关键词", "相关链接", "应用"] },
  例子: { colorIndex: 15, templateNoteId: "...", fields: [...] },
  反例: { colorIndex: 3, templateNoteId: "...", fields: [...] },
  归类: { colorIndex: 0, templateNoteId: "...", fields: ["所属", "相关思考", "包含"] },
  思想方法: { colorIndex: 9, templateNoteId: "...", fields: [...] },
  问题: { colorIndex: 1, templateNoteId: "...", fields: [...] },
  思路: { colorIndex: 13, templateNoteId: "...", fields: [...] },
  // ... 更多类型
}
```

###### 核心功能方法
```javascript
// 制卡系统
static makeCard(note, addToReview = true, reviewEverytime = true)
static makeNote(note, addToReview = true, reviewEverytime = true)  // 支持摘录版本

// 模板管理
static addTemplate(note)  // 支持连续增加、倒序等模式

// 链接管理
static linkParentNote(note)  // 处理父子卡片链接关系
static cleanupOldParentLinks(note, currentParentNote)  // 清理旧链接

// 内容移动
static moveCommentsArrToField(note, indexArr, field, toBottom = true)
static moveCommentsByPopup(note)  // 弹窗式移动界面

// 工作流管理
static toNoExceptVersion(note)  // 转为非摘录版本
static refreshNotes(note)  // 刷新相关卡片
```

##### 2. HtmlMarkdownUtils 类 - HTML 样式工具

###### 样式类型系统
```javascript
static icons = {
  level1: '🚩', level2: '▸', level3: '▪', level4: '•', level5: '·',
  key: '🔑', alert: '⚠️', danger: '❗❗❗', remark: '📝',
  goal: '🎯', question: '❓', idea: '💡', method: '✨'
}

static styles = {
  danger: 'font-weight:700;color:#6A0C0C;background:#FFC9C9;...',
  alert: 'background:#FFF;color:#FF8C5A;border:2px solid currentColor;...',
  level1: 'font-weight:600;color:#1E40AF;background:linear-gradient(15deg,#EFF6FF 30%,#DBEAFE);...',
  // ... 每种类型都有精心设计的样式
}
```

###### 核心方法
```javascript
static createHtmlMarkdownText(text, type = 'none')  // 创建带样式文本
static addQuestionHtmlMDComment(note, questionPlaceholder, answerPlaceholder, explanationPlaceholder)  // 问答式评论
static upwardMergeWithStyledComments(rootFocusNote, firstLevelType)  // 向上合并
static changeHtmlMarkdownCommentTypeByPopup(note)  // 弹窗修改类型
```

##### 3. 字符串扩展系统

###### Pangu.js 中文排版优化
```javascript
class Pangu {
  static spacing(text)  // 自动添加中英文间空格
  static toFullwidth(text)  // 转换全角标点
}
```

###### String.prototype 扩展
```javascript
// 卡片判断方法
String.prototype.ifKnowledgeNoteTitle()  // 是否为知识卡片标题
String.prototype.isNoteIdorURL()  // 是否为卡片ID或URL
String.prototype.isClassificationNoteTitle()  // 是否为归类卡片标题

// 内容提取方法  
String.prototype.toNoBracketPrefixContent()  // 获取无前缀内容
String.prototype.toKnowledgeNoteTitle()  // 获取知识卡片标题
String.prototype.toClassificationNoteTitle()  // 获取归类卡片标题

// 格式转换
String.prototype.toNoteURL() / toNoteId()  // ID/URL 互转
String.prototype.parseCommentIndices(totalComments)  // 解析评论索引
String.prototype.toTitleCasePro()  // 智能标题格式化
```


###### 文献管理
```javascript
MNNote.prototype.ifReferenceNote()  // 判断是否为文献卡片
MNNote.prototype.ifOldReferenceNote()  // 判断是否为旧版文献卡片
MNNote.prototype.ifReferenceNoteToMove()  // 判断文献是否需要移动位置
```

###### 工作流操作
```javascript
MNNote.prototype.addToReview()  // 加入复习
```

###### 内容操作
```javascript
MNNote.prototype.deleteCommentsByPopup()  // 弹窗删除评论
MNNote.prototype.moveCommentsByIndexArr(indexArr, toIndex)  // 批量移动评论
MNNote.prototype.removeCommentsByTypes(types)  // 按类型删除评论
MNNote.prototype.clearAllComments()  // 清空所有评论
```

###### 链接管理  
```javascript
MNNote.prototype.renewLinks()  // 更新所有链接
MNNote.prototype.clearFailedLinks()  // 清理失效链接
MNNote.prototype.convertLinksToNewVersion()  // MN3→MN4链接转换
MNNote.prototype.LinkIfDouble(link) / LinkIfSingle(link)  // 判断链接类型
```

###### 合并操作
```javascript
MNNote.prototype.mergeInto(targetNote, htmlType = "none")  // 合并到目标卡片
MNNote.prototype.mergeIntoAndMove(targetNote, targetIndex, htmlType = "none")  // 合并并移动
MNNote.prototype.mergIntoAndRenewReplaceholder(targetNote, htmlType = "none")  // 合并并更新占位符
```

###### HTML块操作
```javascript
MNNote.prototype.getHtmlBlockIndexArr(htmltext)  // 获取HTML块索引
MNNote.prototype.moveHtmlBlock(htmltext, toIndex)  // 移动HTML块
MNNote.prototype.moveHtmlBlockToBottom(htmltext)  // 移动HTML块到底部
MNNote.prototype.getHtmlCommentIndex(htmlcomment)  // 获取HTML评论索引
```

##### 6. API 方法重写

###### 调整默认行为
```javascript
// 关闭错误提示，默认不弹窗
MNUtil.getNoteById = function(noteid, alert = false) { /* ... */ }

// 关闭移动评论的提示
MNNote.prototype.moveComment = function(fromIndex, toIndex, msg = false) { /* ... */ }

// 关闭评论文本获取失败的提示  
Object.defineProperty(MNComment.prototype, 'text', {
  get: function() { /* 注释掉 "No available text" 提示 */ }
})
```

### 开发规范

- 在 mnutils 项目中，必须严格使用 mnutils.js 和 xdyyutils.js 中的函数。

## 一些特别注意事项
#### 中文标点符号
- 中文引号是`“”`而不是`""`，即使我说用中文引号，你也总是使用英文引号，这点要特别注意！