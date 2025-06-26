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

## 项目架构

这是一个 MarginNote4 插件项目，包含：

### 核心文件结构
```
mnutils/
├── main.js              # 插件入口文件
├── mnaddon.json         # 插件配置文件
├── mnutils.js           # 官方API基础库 (6878行)
├── xdyyutils.js         # 自定义扩展库 (6175行)
├── *.html               # UI界面文件 (6个)
├── *.css                # 样式文件 (4个)  
├── *.js                 # 脚本文件 (多个)
├── *.png                # 图标资源 (多个)
└── *.mnaddon           # 打包文件 (多个版本)
```

### 技术栈特点
- **语言**: JavaScript ES6+
- **平台**: MarginNote4 插件系统
- **UI框架**: 原生 UIKit (Objective-C桥接)
- **数据库**: 内置 CoreData 封装
- **特色**: 学术笔记管理，专为数学学科优化

## API 参考

[MNUtils](/Users/xiakangwei/Nutstore/Github/repository/MN-addon-develop/mnutils/mnutils) 里的 mnutils.js 和 xdyyutils.js 是 MarginNote4 插件开发的核心库，提供了丰富的 API 接口。

### mnutils.js - 官方 API 基础库

#### 文件信息
- **文件大小**: 6878行代码
- **性质**: MarginNote4 官方 API 封装  
- **作用**: 提供统一接口操作 MarginNote 核心功能

#### 核心类架构 (9个主要类)

##### 1. Menu 类 (第1-139行)
```javascript
class Menu {
  preferredPosition = 2  // 左0, 下1, 上2, 右4
  addMenuItem(title, selector, params = "", checked = false)
  addMenuItems(items) / insertMenuItem(index, title, selector, params, checked)
  show() / dismiss()
  static item(title, selector, params, checked)  // 静态工厂方法
}
```
**用途**: 弹出菜单组件，支持自动位置调整和批量操作

##### 2. MNUtil 类 (第140-2787行) - 核心工具类
```javascript
class MNUtil {
  // 主题颜色常量
  static themeColor = { Gray: "#414141", Default: "#FFFFFF", Dark: "#000000", Green: "#E9FBC7", Sepia: "#F5EFDC" }
  
  // 环境获取器 (重要getter方法)
  static get app() / get db() / get currentWindow()
  static get studyController() / get studyView() / get mindmapView()
  static get readerController() / get notebookController()
  
  // 核心工具方法 (304个静态方法)
  static init(mainPath)
  static addErrorLog(error, source, info) / static log(log)
  static getNoteById(noteid, alert = true)
  static get version() / get selectionText() / get isSelectionText()
  static clearLogs() / static get logs()
}
```
**特点**: 大量缓存机制、统一错误处理、懒加载模式

##### 3. MNConnection 类 (第2788-3171行) - 网络连接
```javascript
class MNConnection {
  static genURL(url) / static requestWithURL(url)
  static loadRequest(webview, url, desktop) / static loadFile(webview, file, baseURL)
  static loadHTML(webview, html, baseURL)
}
```
**用途**: WebView操作，支持桌面/移动端User-Agent切换

##### 4. MNButton 类 (第3172-3754行) - 按钮组件
```javascript
class MNButton {
  static new(config, superView)
  static setConfig(button, config)
  static highlightColor  // 高亮颜色
}
```
**用途**: 自定义按钮，支持丰富样式配置，自动主题色继承

##### 5. MNDocument 类 (第3755-3879行) / MNNotebook 类 (第3880-4172行)
```javascript
class MNNotebook {
  get notes() / get reviewNotebook() / get focusNote()
  notebooksForDoc(docMd5) / mainNoteForDoc(docMd5)
}
```
**用途**: 文档和笔记本操作，支持多文档关联、复习系统

##### 6. MNNote 类 (第4173-6337行) - 笔记核心类 ⭐⭐⭐
```javascript
class MNNote {
  constructor(note)  // 支持 MbBookNote/URL/ID/配置对象
  
  // 核心属性 (149个getter/setter)
  note: MbBookNote / title / noteTitle / comments
  parentNote / childNotes / tags / isOCR / textFirst
  
  // 笔记操作方法
  open() / copy() / paste() / delete(withDescendant) / clone()
  addChild(note) / removeFromParent() / createChildNote(config) / merge(note)
  
  // 评论操作方法 (50+个方法)
  appendTextComment(comment, index) / appendMarkdownComment(comment, index)
  appendTextComments(...comments) / appendMarkdownComments(...comments)
  appendHtmlComment(html, text, size, tag, index)  // 新增HTML评论支持
  moveComment(fromIndex, toIndex, msg) / removeCommentByIndex(index)
  removeCommentsByIndices(indices) / removeCommentByCondition(condition)
  sortCommentsByNewIndices(arr)  // 评论排序功能
  
  // 内容操作方法
  appendTitles(...titles) / set titles(titles)
  appendTags(tags) / removeTags(tagsToRemove) / tidyupTags()
  appendNoteLink(note, type)
  
  // 静态方法
  static new(note, alert) / static getFocusNote() / static getSelectNotes()
  static hasImageInCurrentNote(checkTextFirst) / static getAllImagesInNote(note, checkTextFirst)
}
```
**特点**: 完整CRUD操作、强大评论系统、灵活层级关系管理

##### 7. MNComment 类 (第6338-6757行) - 评论类
```javascript
class MNComment {
  type: string  // 评论类型
  detail: object / originalNoteId: string / index: number
  
  // 支持8种评论类型
  // - textComment / markdownComment  
  // - imageComment / drawingComment / mergedImageComment / blankImageComment
  // - imageCommentWithDrawing / mergedImageCommentWithDrawing
  
  get text() / set text() / get imageData()
  get markdown() / set markdown()
}
```
**特点**: 完整类型系统、统一数据访问、图片文本混合处理

##### 8. MNExtensionPanel 类 (第6758行开始)
```javascript
class MNExtensionPanel {
  // 扩展面板管理、界面布局控制、事件处理机制
}
```

#### API设计模式特点
1. **静态工具类模式**: MNUtil 提供全局功能访问点
2. **包装器模式**: 封装原生对象，提供友好 API  
3. **工厂模式**: MNNote.new() 支持多类型输入自动识别
4. **类型系统**: 完整的评论类型判断和转换机制
5. **性能优化**: 懒加载、实例缓存、批量操作支持

### xdyyutils.js - 自定义扩展库

#### 文件信息
- **文件大小**: 6175行代码
- **性质**: 基于 mnutils.js 的学术笔记管理扩展
- **作者**: 夏大鱼羊
- **特色**: 专为数学学科设计的知识卡片系统

#### 核心模块架构

##### 1. MNMath 类 - 数学卡片管理系统 (第5-1925行) ⭐⭐⭐

###### 卡片类型定义系统 (13种类型)
```javascript
static types = {
  // 核心卡片类型 (8种)
  定义: { refName: "定义", colorIndex: 2, templateNoteId: "...", fields: ["相关思考", "相关链接"] },
  命题: { refName: "命题", colorIndex: 10, templateNoteId: "...", fields: ["证明", "相关思考", "关键词", "相关链接", "应用"] },
  例子: { refName: "例子", colorIndex: 15, templateNoteId: "...", fields: ["相关思考", "相关链接"] },
  反例: { refName: "反例", colorIndex: 3, templateNoteId: "...", fields: ["相关思考", "相关链接"] },
  归类: { refName: "归类", colorIndex: 0, templateNoteId: "...", fields: ["所属", "相关思考", "包含"] },
  思想方法: { refName: "思想方法", colorIndex: 9, templateNoteId: "...", fields: ["相关思考", "相关链接", "应用"] },
  问题: { refName: "问题", colorIndex: 1, templateNoteId: "...", fields: ["思路", "相关思考", "相关链接"] },
  思路: { refName: "思路", colorIndex: 13, templateNoteId: "...", fields: ["相关思考", "相关链接"] },
  
  // 文献管理类型 (5种)
  作者: { refName: "作者", colorIndex: 11, templateNoteId: "...", fields: ["相关思考", "相关链接"] },
  研究进展: { refName: "研究进展", colorIndex: 7, templateNoteId: "...", fields: ["相关思考", "相关链接"] },
  论文: { refName: "论文", colorIndex: 8, templateNoteId: "...", fields: ["相关思考", "相关链接"] },
  书作: { refName: "书作", colorIndex: 14, templateNoteId: "...", fields: ["相关思考", "相关链接"] },
  文献: { refName: "文献", colorIndex: 6, templateNoteId: "...", fields: ["相关思考", "相关链接"] }
}
```
**特点**: 每种类型包含 `refName`, `prefixName`, `englishName`, `templateNoteId`, `ifIndependent`, `colorIndex`, `fields`

###### 制卡系统 (第222-306行)
```javascript
// 核心制卡方法
static makeCard(note, addToReview = true, reviewEverytime = true)  // 仅非摘录版本
static makeNote(note, addToReview = true, reviewEverytime = true)  // 支持摘录版本，一键制卡
static toNoExceptVersion(note)  // 转为非摘录版本

// 工作流程 (8个步骤)
// 1. renewNote -> 2. mergeTemplateAndAutoMoveNoteContent -> 3. changeTitle 
// 4. changeNoteColor -> 5. linkParentNote -> 6. refreshNotes -> 7. addToReview
```

###### 智能链接系统 (第313-503行)
```javascript
static linkParentNote(note)  // 处理父子卡片链接关系
static cleanupOldParentLinks(note, currentParentNote)  // 自动清理旧链接

// 链接规则
// 归类卡片: parentNoteInNoteTargetField = "所属", noteInParentNoteTargetField = "包含"
// 其他卡片: parentNoteInNoteTargetField = "相关链接", noteInParentNoteTargetField = "包含"
```

###### 标题管理系统 (第569-919行)
```javascript
// 智能标题生成: 【类型 >> 内容】格式
// 批量标题修改: 支持选定范围、子卡片、后代卡片
// 归类卡片特殊处理: 旧格式 "xx":"yy"相关zz -> 新格式 "yy"相关zz
```

###### 内容移动系统 (第1440-1500行)
```javascript
static moveCommentsArrToField(note, indexArr, field, toBottom = true)
static moveCommentsByPopup(note)  // 弹窗式交互

// 支持索引格式: "1,2,3", "1-4", "X,Y,Z"(倒数), "1,3-5,Y,Z"(组合)
```

##### 2. HtmlMarkdownUtils 类 - HTML样式工具 (第1931-2733行)

###### 图标和样式系统 (第1932-1996行)
```javascript
static icons = {
  level1: '🚩', level2: '▸', level3: '▪', level4: '•', level5: '·',
  key: '🔑', alert: '⚠️', danger: '❗❗❗', remark: '📝',
  goal: '🎯', question: '❓', idea: '💡', method: '✨'
}

static styles = {
  danger: '红色警告样式，倾斜变形效果',
  level1: '蓝色渐变，圆角边框，阴影效果',
  method: '深蓝色渐变背景，白色文字',
  // ... 每种类型都有精心设计的CSS样式
}
```

###### HTML处理方法 (第1997-2200行)
```javascript
static createHtmlMarkdownText(text, type = 'none')  // 创建带样式HTML文本
static getSpanContent(comment) / getSpanTextContent(comment) / getSpanType(comment)
static isHtmlMDComment(comment)  // 判断是否为HTML Markdown评论

// 层级管理: level1 → level2 → level3 → level4 → level5
// 升降级操作: 支持HTML评论类型的上下级转换
```

##### 3. Pangu 类 - 中文排版优化 (第2735-2841行)

###### 正则表达式系统 (约30个正则表达式)
```javascript
class Pangu {
  static spacing(text)  // 智能间距添加，包含数学符号特殊处理
  static toFullwidth(text)  // 标点符号全角化处理
  
  // 特殊数学处理
  // C[a,b] 单独字母紧跟括号处理
  // ∞ 符号特殊处理  
  // ∑ 大求和符号改成小求和符号 Σ
}
```

##### 4. 字符串扩展系统 (第2845-3680行) - 约85个扩展方法

###### 扩展方法分类
```javascript
// 基础判断类 (10个)
String.prototype.ifKnowledgeNoteTitle()  // 是否为知识卡片标题
String.prototype.isNoteIdorURL()  // 是否为卡片ID或URL
String.prototype.isClassificationNoteTitle()  // 是否为归类卡片标题

// 内容提取类 (25个)
String.prototype.toNoBracketPrefixContent()  // 获取无前缀内容
String.prototype.toKnowledgeNoteTitle()  // 获取知识卡片标题
String.prototype.toClassificationNoteTitle()  // 获取归类卡片标题

// 格式转换类 (20个)
String.prototype.toNoteURL() / toNoteId()  // ID/URL 互转
String.prototype.toTitleCasePro()  // 智能标题格式化
String.prototype.parseCommentIndices(totalComments)  // 解析评论索引

// 索引解析支持: "1,2,3", "1-4", "X,Y,Z", "1,3-5,Y,Z"
// 归类处理类 (15个): 支持绿色和黄色归类卡片，旧格式新格式兼容
// 特殊处理类 (15个): 文献卡片特殊处理、URL和ID验证、标题链接词处理
```

##### 5. MNNote 原型扩展 (第3682-4061行)

下面的内容是以前写的，后面会陆续移植到 `MNMath` 类和 `MNLiterature` 类中。

###### 文献管理扩展 (第3691-3701行)
```javascript
MNNote.prototype.ifReferenceNote()  // 判断是否为文献卡片
MNNote.prototype.ifOldReferenceNote()  // 判断是否为旧版文献卡片
```

###### 内容操作扩展 (第3706-3863行)
```javascript
MNNote.prototype.clearAllComments()  // 清空所有评论
MNNote.prototype.deleteCommentsByPopup()  // 弹窗删除评论
MNNote.prototype.moveCommentsByIndexArr(indexArr, toIndex)  // 批量移动评论
```

###### 工作流扩展 (第3755-3823行)
```javascript
MNNote.prototype.moveToInput()  // 移动到"输入"区
MNNote.prototype.moveToPreparationForExam()  // 移动到"备考"区  
MNNote.prototype.moveToInternalize()  // 移动到"内化"区
MNNote.prototype.addToReview()  // 加入复习

// 学习工作流: 输入 → 内化 → 备考
```

###### 卡片操作扩展 (第3912-4057行)
```javascript
MNNote.prototype.pasteChildNotesByIdArr(noteIdArr)  // 批量粘贴子卡片
MNNote.prototype.generateCustomTitleLinkFromFirstTitlelinkWord()  // 生成标题链接
MNNote.prototype.getTitleLinkWordsArr()  // 获取标题链接词数组
```

##### 6. API 方法重写 (第6080-6175行)

###### 调整默认行为，提升用户体验
```javascript
// 默认不显示提示弹窗
MNUtil.getNoteById = function(noteid, alert = false) { ... }

// 关闭移动评论的提示  
MNNote.prototype.moveComment = function(fromIndex, toIndex, msg = false) { ... }

// 关闭评论文本获取失败的提示
Object.defineProperty(MNComment.prototype, 'text', {
  get: function() { /* 注释掉 "No available text" 提示 */ }
})
```

#### 设计特点总结
1. **学术导向**: 专为数学学科设计，支持定义、命题、证明的学术结构
2. **用户体验**: 减少弹窗干扰，智能默认行为，批量操作支持
3. **系统化设计**: 完整的类型系统，标准化的工作流程，智能的链接管理
4. **扩展性强**: 模块化设计，原型扩展模式，配置化的卡片类型

## 开发规范

### 核心库使用规范
- **强制依赖**: 在 mnutils 项目中，必须严格使用 mnutils.js 和 xdyyutils.js 中的函数
- **加载顺序**: 必须先加载 mnutils.js，再加载 xdyyutils.js
- **API优先级**: 优先使用 xdyyutils.js 中重写的方法（如 `MNUtil.getNoteById` 默认 `alert=false`）

### 最佳实践

#### 1. 对象创建
```javascript
// ✅ 推荐使用静态工厂方法
let note = MNNote.new(noteId)  // 支持多种输入类型自动识别

// ❌ 避免直接 new
let note = new MNNote(noteId)
```

#### 2. 错误处理
```javascript
// ✅ 使用统一的错误日志系统
MNUtil.addErrorLog(error, "functionName", additionalInfo)

// ✅ 根据需要选择是否显示alert
let note = MNUtil.getNoteById(noteId, false)  // 不显示弹窗
```

#### 3. 批量操作
```javascript
// ✅ 使用批量方法提高性能
note.appendTextComments("评论1", "评论2", "评论3")
note.removeCommentsByIndices([1, 3, 5])

// ❌ 避免循环调用单个方法
```

#### 4. 卡片制作工作流
```javascript
// ✅ 标准制卡流程
MNMath.makeNote(note, true, true)  // 一键制卡，支持摘录版本

// ✅ 手动制卡流程
MNMath.toNoExceptVersion(note)     // 1. 转非摘录版本
MNMath.makeCard(note)              // 2. 执行制卡
```

#### 5. 内容移动和样式
```javascript
// ✅ 使用弹窗式移动
MNMath.moveCommentsByPopup(note)

// ✅ HTML样式文本
HtmlMarkdownUtils.createHtmlMarkdownText("重要内容", "danger")
```

### 技术规范

#### 1. 类型检查
```javascript
// ✅ 利用内置类型检查
if (note.title.ifKnowledgeNoteTitle()) {
  // 处理知识卡片
}

// ✅ 评论类型判断
if (comment.type === "textComment") {
  // 处理文本评论
}
```

#### 2. 链接管理
```javascript
// ✅ 自动链接管理
MNMath.linkParentNote(note)  // 自动处理父子链接

// ✅ 清理失效链接
note.clearFailedLinks()
```

#### 3. 索引解析
```javascript
// ✅ 灵活的索引格式支持
let indices = "1,3-5,Y,Z".parseCommentIndices(note.comments.length)
// 支持: 单个序号、范围、倒数、组合
```

## 特别注意事项

### 1. 中文标点符号
- **中文引号**: 使用 `“”` 而不是 `""`，即使用户说用中文引号，也要特别注意使用正确的符号！
- **自动排版**: 使用 `Pangu.spacing(text)` 自动处理中英文间距

### 2. 文件路径规范
```javascript
// ✅ 使用绝对路径
let imagePath = subscriptionUtils.mainPath + "/images/icon.png"

// ✅ 文件存在性检查
if (NSFileManager.defaultManager().fileExistsAtPath(filePath)) {
  // 处理文件
}
```

### 3. 性能优化
- **懒加载**: 使用 MNUtil 的 getter 方法获取系统组件
- **缓存机制**: 利用内置的实例缓存
- **批量操作**: 优先使用批量方法而非循环调用

### 4. 兼容性处理
- **版本检查**: 使用 `MNUtil.version` 检查应用版本
- **API兼容**: 注意 MN3 到 MN4 的 API 变化
- **链接转换**: 使用 `convertLinksToNewVersion()` 处理版本升级

## 开发案例：字段内容替换功能

### 功能需求
开发一个字段内容替换功能，能够：
- 删除字段A下的所有内容
- 将字段B下的内容移动到字段A下方
- 通过弹窗交互选择字段
- 操作完成后自动刷新卡片

### 开发过程中遇到的问题与解决方案

#### 1. 弹窗API调用错误
**问题**: 
```javascript
// ❌ 错误的调用方式
let buttonIndex = MNUtil.studyController().alert(...)  // TypeError: not a function
let buttonIndex = MNUtil.studyController.alert(...)   // TypeError: alert is undefined
```

**解决方案**:
```javascript
// ✅ 正确的弹窗调用方式
UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
  title,           // 弹窗标题
  message,         // 弹窗消息
  0,              // style: 0=普通弹窗, 1=安全输入, 2=普通输入
  "取消",          // cancelButtonTitle
  fieldOptions,    // otherButtonTitles: 选项数组
  (_, buttonIndex) => {  // 回调函数，使用 _ 忽略未使用的 alert 参数
    if (buttonIndex === 0) return; // 取消
    // buttonIndex >= 1 对应 fieldOptions[buttonIndex-1]
  }
)
```

**关键要点**:
- `MNUtil.studyController` 是 getter 属性，不是函数
- `studyController` 对象没有 `alert` 方法
- 必须使用 `UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock`
- 按钮索引从1开始，0表示取消

#### 2. 字段索引自动计算
**问题**: 最初设计需要手动传入字段索引，容易出错且不便使用

**解决方案**:
```javascript
// ❌ 手动传入索引，容易出错
static replaceFieldContent(note, fieldA, fieldB, fieldAIndex, fieldBIndex)

// ✅ 自动计算索引，更安全
static replaceFieldContent(note, fieldA, fieldB) {
  let htmlCommentsObjArr = this.parseNoteComments(note).htmlCommentsObjArr;
  
  // 通过字段名称自动查找对应的字段对象
  let fieldAObj = htmlCommentsObjArr.find(obj => obj.text.includes(fieldA));
  let fieldBObj = htmlCommentsObjArr.find(obj => obj.text.includes(fieldB));
}
```

#### 3. 索引变化的处理
**问题**: 删除字段A内容后，评论索引发生变化，导致后续操作索引错误

**解决方案**:
```javascript
// 删除字段A内容后，重新解析评论结构
if (fieldAContentIndices.length > 0) {
  // 从后往前删除，避免索引变化影响
  let sortedFieldAIndices = fieldAContentIndices.sort((a, b) => b - a);
  sortedFieldAIndices.forEach(index => {
    note.removeCommentByIndex(index);
  });
}

// 重新解析评论结构（因为删除操作改变了索引）
commentsObj = this.parseNoteComments(note);
htmlCommentsObjArr = commentsObj.htmlCommentsObjArr;

// 重新获取字段B的内容（索引可能已经改变）
fieldBObj = htmlCommentsObjArr.find(obj => obj.text.includes(fieldB));
```

#### 4. TypeScript 未使用变量警告
**问题**: 
```javascript
(alert, buttonIndex) => { ... }  // ★ 已声明"alert"，但从未读取其值
```

**解决方案**:
```javascript
// ✅ 使用下划线表示故意忽略的参数
(_, buttonIndex) => { ... }
```

#### 5. 用户体验优化
**问题**: 
- 弹窗文案包含技术术语"字段A"、"字段B"
- 操作完成后界面没有刷新

**解决方案**:
```javascript
// ✅ 简化弹窗文案
"选择目标字段" // 而不是"选择目标字段（字段A）"
"选择源字段"   // 而不是"选择源字段（字段B）"

// ✅ 操作完成后自动刷新
this.moveCommentsArrToField(note, fieldBContentIndices, fieldA, true);
note.refresh(); // 刷新卡片显示
MNUtil.showHUD("操作完成提示");
```

### 最终实现
```javascript
/**
 * 通过弹窗选择并替换字段内容
 * 删除目标字段下的内容，并将源字段下的内容移动过来
 */
static replaceFieldContentByPopup(note) {
  let htmlCommentsTextArr = this.parseNoteComments(note).htmlCommentsTextArr;
  
  if (htmlCommentsTextArr.length < 2) {
    MNUtil.showHUD("需要至少两个字段才能执行替换操作");
    return;
  }

  let fieldOptions = htmlCommentsTextArr.map(text => text.trim());
  
  // 嵌套弹窗选择字段
  UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
    "选择目标字段", "选择要被替换内容的字段", 0, "取消", fieldOptions,
    (_, buttonIndex) => {
      if (buttonIndex === 0) return;
      
      let fieldA = fieldOptions[buttonIndex - 1];
      let fieldBOptions = fieldOptions.filter((_, index) => index !== buttonIndex - 1);
      
      UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
        "选择源字段", `选择要移动到"${fieldA}"字段下的内容源字段`, 0, "取消", fieldBOptions,
        (_, buttonIndexB) => {
          if (buttonIndexB === 0) return;
          
          let fieldB = fieldBOptions[buttonIndexB - 1];
          this.replaceFieldContent(note, fieldA, fieldB);
        }
      );
    }
  );
}
```

### 经验总结
1. **API 文档的重要性**: MarginNote4 插件开发需要深入理解现有代码中的API使用模式
2. **错误处理策略**: 通过现有代码搜索找到正确的调用方式，而不是假设API存在
3. **索引安全**: 删除操作要从后往前，移动操作要重新解析结构
4. **用户体验**: 简化文案，自动刷新，减少技术术语
5. **代码质量**: 使用下划线忽略未使用参数，遵循 TypeScript 最佳实践

### 调用示例
```javascript
let focusNote = MNNote.getFocusNote();
MNUtil.undoGrouping(() => {
  try {
    MNMath.replaceFieldContentByPopup(focusNote);
  } catch (error) {
    MNUtil.showHUD(error);
    MNUtil.addErrorLog(error);
  }
});
```

## 功能升级：智能内容识别与多源替换

### 升级背景
在基础字段替换功能基础上，集成了 `autoGetNewContentToMoveIndexArr` 智能内容识别算法，支持自动获取新内容和手动选择字段两种内容来源。

### 智能内容识别机制

#### 1. autoGetNewContentToMoveIndexArr 算法解析
```javascript
static autoGetNewContentToMoveIndexArr(note) {
  let moveIndexArr = []
  let lastHtmlCommentText = this.parseNoteComments(note).htmlCommentsTextArr.slice(-1)[0] || "";
  
  if (lastHtmlCommentText) {
    // 情况1：有HTML字段 - 获取最后字段的非链接内容
    moveIndexArr = this.getHtmlBlockNonLinkContentIndexArr(note, lastHtmlCommentText);
  } else {
    // 情况2：无HTML字段 - 跳过开头合并图片，获取后续内容
    let firstNonMergedImageIndex = -1;
    
    for (let i = 0; i < note.MNComments.length; i++) {
      let comment = note.MNComments[i];
      if (comment.type !== "mergedImageComment" && 
          comment.type !== "mergedImageCommentWithDrawing") {
        firstNonMergedImageIndex = i;
        break;
      }
    }
    
    if (firstNonMergedImageIndex !== -1) {
      moveIndexArr = Array.from(
        {length: note.MNComments.length - firstNonMergedImageIndex}, 
        (_, i) => i + firstNonMergedImageIndex
      );
    }
  }
  return moveIndexArr;
}
```

#### 2. 非链接内容过滤机制
```javascript
static getHtmlBlockNonLinkContentIndexArr(note, text) {
  let indexArr = this.getHtmlCommentExcludingFieldBlockIndexArr(note, text);
  
  // 从头遍历，跳过链接内容，找到第一个非链接内容
  for (let i = 0; i < indexArr.length; i++) {
    let comment = note.MNComments[indexArr[i]];
    if (comment.type !== "linkComment") {
      // 跳过 # 开头的标题链接文本
      if (comment.text && comment.text.startsWith("#")) {
        continue;
      }
      return indexArr.slice(i); // 从第一个非链接内容开始返回
    }
  }
  return []; // 全是链接时返回空数组
}
```

### 多源内容替换架构

#### 1. 升级后的弹窗交互流程
```javascript
// 第一级弹窗：选择目标字段
"选择目标字段" → fieldA

// 第二级弹窗：选择内容来源  
sourceOptions = [
  "自动获取新内容",           // 智能识别算法
  "来自字段：相关思考",       // 从其他字段获取
  "来自字段：证明",
  // ... 其他字段
]
```

#### 2. 双路径处理逻辑
```javascript
if (buttonIndexB === 1) {
  // 路径1：自动内容识别
  this.replaceFieldContentWithAutoContent(note, fieldA);
} else {
  // 路径2：字段间内容迁移  
  let fieldB = otherFields[buttonIndexB - 2];
  this.replaceFieldContent(note, fieldA, fieldB);
}
```

### 智能内容识别的应用场景

#### 场景1: 新摘录内容整理
**适用情况**: 用户刚从PDF添加了新摘录，需要快速整理到相应字段
```javascript
// 卡片状态：有旧的字段内容 + 新添加的摘录内容
// 算法会自动识别：
// - 跳过开头的合并图片评论 (mergedImageComment)
// - 获取后续的文本/图片内容作为"新内容"
MNMath.replaceFieldContentByPopup(note);
// 选择目标字段 → "自动获取新内容"
```

#### 场景2: 字段结构化内容整理
**适用情况**: 有HTML字段结构，需要移动最后字段的新增内容
```javascript
// 卡片状态：
// [相关思考] ← HTML字段
//   - 旧的思考内容...
//   - 新添加的链接: marginnote3app://note/xxx
//   - 新添加的文本内容 ← 这部分被识别为"新内容"
// [证明] ← HTML字段  
//   - ...
```

### 技术实现要点

#### 1. 评论类型识别表
```javascript
// 需要跳过的合并图片类型
mergedImageComment              // 合并的图片评论
mergedImageCommentWithDrawing   // 带绘制的合并图片评论

// 需要过滤的链接类型  
linkComment                     // 链接评论
text.startsWith("#")           // 标题链接文本
```

#### 2. 索引管理最佳实践
```javascript
// 删除操作：从后往前删除，避免索引变化
let sortedIndices = fieldAContentIndices.sort((a, b) => b - a);
sortedIndices.forEach(index => note.removeCommentByIndex(index));

// 移动操作：删除后重新解析，确保索引准确
commentsObj = this.parseNoteComments(note);
autoContentIndices = this.autoGetNewContentToMoveIndexArr(note);
```

#### 3. 错误处理与用户反馈
```javascript
// 边界条件检查
if (autoContentIndices.length === 0) {
  MNUtil.showHUD("没有检测到可移动的新内容");
  return;
}

// 操作完成提示
MNUtil.showHUD(`已将自动获取的新内容移动到"${fieldA}"字段下，并删除了原有内容`);
```

### 开发经验总结

#### 1. 算法集成模式
- **复用现有算法**: 直接调用 `autoGetNewContentToMoveIndexArr`，避免重复实现
- **保持接口一致**: 新功能与现有 `moveCommentsByPopup` 等函数的调用方式保持一致
- **渐进式增强**: 在原有字段替换基础上增加智能识别，保持向后兼容

#### 2. 用户交互设计原则
- **选项优先级**: "自动获取新内容"放在首位，符合用户常用操作习惯
- **清晰的标识**: `来自字段：[字段名]` 明确标识内容来源
- **一致的取消逻辑**: 两级弹窗都支持取消操作

#### 3. 代码组织策略
- **功能分离**: `replaceFieldContentWithAutoContent` 专门处理自动内容
- **参数简化**: 自动获取模式只需要目标字段参数
- **错误边界**: 每个关键步骤都有对应的错误检查和用户提示

### 完整调用示例
```javascript
// 基础调用保持不变
let focusNote = MNNote.getFocusNote();
MNUtil.undoGrouping(() => {
  try {
    MNMath.replaceFieldContentByPopup(focusNote);
    // 用户交互：
    // 1. 选择目标字段："相关思考"  
    // 2. 选择内容来源："自动获取新内容" 或 "来自字段：证明"
  } catch (error) {
    MNUtil.showHUD(error);
    MNUtil.addErrorLog(error);
  }
});
```

这次升级展示了如何在现有功能基础上进行智能化改进，通过算法集成和交互优化，显著提升了用户的内容管理效率。