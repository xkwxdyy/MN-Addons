# ✅ MNUtils 项目开发指南

> 本文档专门用于 MNUtils 项目本身的开发和维护。如果你想了解如何使用 MNUtils API 开发其他插件，请查看 [MNUTILS_API_GUIDE.md](./MNUTILS_API_GUIDE.md)。

## 📌 项目概述

MNUtils 是 MarginNote 生态系统的核心基础设施，具有双重身份：

1. **插件管理系统**: 提供插件商店、订阅管理、更新管理等功能
2. **API 框架**: 为其他 MarginNote 插件提供核心 API 支持

### 项目信息
- **插件 ID**: marginnote.extension.mnutils
- **作者**: Feliks
- **版本**: 0.1.5.alpha0624
- **最低支持版本**: MarginNote 3.7.11

### 核心功能模块
1. **订阅管理系统**: APIKey 管理、额度购买、自动订阅
2. **插件商店**: 插件安装、更新、版本管理
3. **笔记本/文档共享**: 社区资源分享平台
4. **日志系统**: 错误追踪、调试支持
5. **API 框架**: mnutils.js 和 xdyyutils.js

## 🏗️ 项目结构

```
mnutils/
├── main.js               # 插件主入口，UI 和业务逻辑
├── mnutils.js            # 核心 API 框架（6,878行）
├── xdyyutils.js          # 学术扩展 API（6,175行）
├── mnaddon.json          # 插件配置清单
├── CLAUDE.md             # 本文档 - 项目开发指南
├── MNUTILS_API_GUIDE.md  # API 使用指南
├── sidebar.html          # 侧边栏 UI
├── log.html              # 日志查看器
├── usage.html            # 使用详情页
└── mcp-marginnote4/      # MCP 服务端支持
```

## 💻 开发环境设置

### 1. 必备工具
- **代码编辑器**: VS Code 或其他支持 JavaScript 的编辑器
- **MarginNote**: 3.7.11+ 版本
- **调试工具**: Safari Web Inspector (macOS) 或远程调试

### 2. 开发流程
```bash
# 1. 克隆项目
git clone [repository-url]

# 2. 进入项目目录
cd mnutils

# 3. 开发时直接编辑文件，无需编译

# 4. 打包插件
zip -r mnutils.mnaddon * -x ".*" -x "__MACOSX"

# 5. 安装到 MarginNote
# 将 .mnaddon 文件拖入 MarginNote
```

## 📦 核心组件详解

### 1. main.js - 插件主控制器

main.js 是整个插件的入口和控制中心，主要包含：

#### 1.1 MNSubscription 类（插件主类）
```javascript
JSB.defineClass("MNSubscription : JSExtension", {
  // 生命周期方法
  sceneWillConnect: function() {},        // 场景连接
  sceneDidDisconnect: function() {},      // 场景断开
  notebookWillOpen: function(id) {},      // 笔记本打开
  documentDidOpen: function(doc) {},      // 文档打开
  
  // 事件监听
  onPopupMenuOnNote: function(info) {},   // 笔记弹出菜单
  onPopupMenuOnSelection: function() {},  // 选择弹出菜单
  
  // 插件控制
  toggleAddon: function(button) {}        // 切换插件显示
});
```

#### 1.2 subscriptionController 类（UI 控制器）
```javascript
JSB.defineClass("subscriptionController : UIViewController", {
  // UI 初始化
  viewDidLoad: function() {},
  init: function() {},
  
  // 视图管理
  refresh: function(reload) {},           // 刷新视图
  changeView: function(sender) {},        // 切换视图
  setViewTo: function(viewName) {},       // 设置视图
  
  // 订阅功能
  activate: function(days) {},            // 激活订阅
  refreshUsage: function() {},            // 刷新使用量
  chooseAPIKeyForQuota: function() {},    // 购买额度
  
  // 插件商店
  refreshSidebar: function(reload) {},    // 刷新插件列表
  webViewShouldStartLoad: function() {},  // 处理网页交互
});
```

### 2. 订阅系统架构

#### 2.1 订阅配置管理
```javascript
subscriptionConfig = {
  config: {
    apikey: "",              // API 密钥
    url: "",                 // 服务器地址
    activated: false,        // 激活状态
    autoSubscription: false, // 自动订阅
    subscriptionDaysRemain: 0, // 剩余天数
    lastView: "subscriptionView" // 最后视图
  },
  
  // 核心方法
  init: function() {},       // 初始化配置
  save: function() {},       // 保存配置
  isSubscribed: function() {} // 检查订阅状态
};
```

#### 2.2 网络请求模块
```javascript
subscriptionNetwork = {
  // 订阅相关
  subscribe: async function(days) {},
  getUsage: async function() {},
  
  // 文件下载
  downloadFromConfig: function(config, controller) {},
  readFileFromWebdav: async function(filename) {},
  
  // 插件安装
  installAddon: function(addonInfo) {}
};
```

### 3. UI 视图系统

#### 3.1 视图切换机制
```javascript
// 支持的视图类型
const views = {
  "subscriptionView": "订阅管理",
  "webview": "更新管理器",
  "webviewAlpha": "更新管理器(α)",
  "shareNotebooks": "共享笔记本",
  "shareDocuments": "共享文档",
  "log": "日志查看器"
};
```

#### 3.2 迷你模式
```javascript
// 迷你模式切换
toMinimode: function(animate) {
  // 缩小到 40x40 的浮动按钮
  // 支持拖动和位置记忆
}
```

### 4. 插件商店功能

#### 4.1 插件信息结构
```javascript
{
  id: "addon.id",
  name: "插件名称",
  version: "1.0.0",
  description: "插件描述",
  action: "install/update/reinstall",
  url: "下载地址",
  history: [...]  // 历史版本
}
```

#### 4.2 版本管理
```javascript
// 版本比较逻辑
compareVersions: function(v1, v2) {
  // 返回: 1(需更新), 0(相同), -1(本地更新)
}
```

## 🔧 关键功能实现

### 1. APIKey 管理系统

```javascript
// APIKey 输入和验证
pasteApiKey: function() {
  let key = MNUtil.clipboardText.trim();
  if (key.startsWith("sk-")) {
    // 保存并激活
  }
}

// 额度购买流程
chooseAPIKeyForQuota: function() {
  // 1. 选择购买类型（新Key/充值）
  // 2. 选择额度（5/10/20/50 Points）
  // 3. 跳转支付页面
}
```

### 2. 自动订阅机制

```javascript
autoSubscribe: function() {
  if (config.autoSubscription && !isSubscribed()) {
    // 检查剩余天数
    // 自动扣除并激活
  }
}
```

### 3. 插件安装流程

```javascript
// 1. 下载 .mnaddon 文件
// 2. 解压到临时目录
// 3. 读取 mnaddon.json 获取 addonid
// 4. 复制到扩展目录
// 5. 提示重启 MarginNote
```

### 4. 日志系统集成

```javascript
// 错误捕获
subscriptionUtils.addErrorLog = function(error, source, info) {
  MNUtil.addErrorLog(error, source, info);
  // 同步到日志视图
  if (currentView === "log") {
    controller.appendLog(errorLog);
  }
};
```

## 📚 核心 API 框架详解

### mnutils.js - 核心框架（6,878行）

mnutils.js 是 MNUtils 框架的核心，提供了 9 个主要类和超过 300 个 API 方法。

#### 核心类概览

| 类名 | 代码行数 | 主要功能 | API 数量 |
|------|----------|----------|----------|
| **Menu** | 1-139 | 弹出菜单 UI 组件 | 12 |
| **MNUtil** | 140-2787 | 核心工具类，系统级功能 | 304+ |
| **MNConnection** | 2788-3171 | 网络请求、WebView、WebDAV | 14 |
| **MNButton** | 3172-3754 | 自定义按钮 UI 组件 | 27 |
| **MNDocument** | 3755-3879 | PDF 文档操作接口 | 14 |
| **MNNotebook** | 3880-4172 | 笔记本/学习集管理 | 35 |
| **MNNote** | 4173-6337 | 笔记核心类 | 149+ |
| **MNComment** | 6338-6757 | 评论/内容管理 | 20+ |
| **MNExtensionPanel** | 6758-6841 | 插件面板控制 | 11 |

#### 1. Menu 类 - 弹出菜单组件

```javascript
// 核心功能
- 自动调整位置避免超出屏幕
- 支持多种弹出方向（上下左右）
- 可自定义行高、字体大小
- 支持菜单项选中状态

// 常用方法
new Menu(sender, delegate, width, preferredPosition)
addMenuItem(title, selector, params, checked)
addMenuItems(items)
show()
dismiss()

// 使用示例
let menu = new Menu(button, self, 250);
menu.addMenuItem("复制", "copyNote:", note);
menu.addMenuItem("制卡", "makeCard:", note, note.isCard);
menu.show();
```

#### 2. MNUtil 类 - 核心工具类 ⭐⭐⭐⭐⭐

MNUtil 是整个框架的核心，提供了 304+ 个静态方法。

**主要功能模块**：

```javascript
// 1. 环境访问器（懒加载）
MNUtil.app               // Application 实例
MNUtil.db                // Database 实例
MNUtil.studyController   // 学习控制器
MNUtil.studyView         // 学习视图
MNUtil.mindmapView       // 脑图视图

// 2. 选择与剪贴板
MNUtil.selectionText     // 获取选中文本
MNUtil.clipboardText     // 剪贴板文本
MNUtil.copy(object)      // 复制到剪贴板

// 3. 笔记操作
MNUtil.getNoteById(noteid, alert)
MNUtil.noteExists(noteId)
MNUtil.focusNoteInMindMapById(noteId, delay)

// 4. UI 交互
MNUtil.showHUD(message, duration)
MNUtil.confirm(title, message, buttons)
MNUtil.input(title, subTitle, items)
MNUtil.userSelect(title, options, allowMulti)

// 5. 错误处理与日志
MNUtil.addErrorLog(error, source, info)
MNUtil.log(log)

// 6. 文件操作
MNUtil.readJSON(path)
MNUtil.writeJSON(path, object)
MNUtil.isfileExists(path)
MNUtil.createFolder(path)

// 7. 版本与平台检测
MNUtil.isMN4()
MNUtil.isMacOS()
MNUtil.version
```

#### 3. MNNote 类 - 笔记核心类 ⭐⭐⭐⭐⭐

最重要的类之一，提供了 149+ 个属性和方法。

**核心功能**：

```javascript
// 1. 构造与获取
MNNote.new(note, alert)         // 智能创建笔记对象
MNNote.getFocusNote()           // 获取当前焦点笔记
MNNote.getSelectedNotes()       // 获取选中的笔记数组

// 2. 核心属性
note.noteId                     // 笔记 ID
note.title                      // 笔记标题
note.excerptText                // 摘录文本
note.comments                   // 评论数组
note.colorIndex                 // 颜色索引 (0-15)
note.parentNote                 // 父笔记
note.childNotes                 // 子笔记数组

// 3. 内容操作
note.appendTextComment(comment)
note.appendMarkdownComment(comment)
note.appendHtmlComment(html, text, size, tag)
note.moveComment(fromIndex, toIndex)
note.removeCommentByIndex(index)

// 4. 层级管理
note.addChild(childNote)
note.removeFromParent()
note.createChildNote(config)

// 5. 其他操作
note.open()                     // 打开笔记
note.copy()                     // 复制笔记
note.delete(withDescendant)     // 删除笔记
note.merge(anotherNote)         // 合并笔记
```

#### 4. MNComment 类 - 评论系统

管理笔记中的各种内容类型。

**支持的评论类型**：
- textComment: 纯文本评论
- markdownComment: Markdown 格式评论
- imageComment: 图片评论
- htmlComment: HTML 评论
- linkComment: 链接评论
- tagComment: 标签评论

#### 5. MNConnection 类 - 网络请求

```javascript
// HTTP 请求
MNConnection.fetch(url, options)

// WebDAV 支持
MNConnection.readWebDAVFile(url, username, password)
MNConnection.uploadWebDAVFile(url, username, password, content)

// WebView 控制
MNConnection.loadRequest(webview, url, desktop)
MNConnection.loadHTML(webview, html, baseURL)
```

#### 6. MNDocument 类 - 文档操作

```javascript
// 核心属性
doc.docMd5              // 文档 MD5
doc.docTitle            // 文档标题
doc.pageCount           // 页数

// 操作方法
doc.open(notebookId)    // 在指定笔记本中打开
doc.textContentsForPageNo(pageNo)  // 获取页面文本
```

#### 7. MNNotebook 类 - 笔记本管理

```javascript
// 获取笔记本
MNNotebook.currentNotebook       // 当前笔记本
MNNotebook.allNotebooks()        // 所有笔记本
MNNotebook.allStudySets()        // 所有学习集

// 笔记本操作
notebook.open()                  // 打开笔记本
notebook.openDoc(docMd5)         // 在笔记本中打开文档
```

### xdyyutils.js - 学术扩展（6,175行）

xdyyutils.js 是针对学术场景的深度优化扩展，特别是数学学科。

#### MNMath 类 - 数学卡片管理系统 ⭐⭐⭐⭐⭐

**13 种知识卡片类型**：

1. **知识结构类（8种）**：
   - 定义（definition）- 淡蓝色
   - 命题（proposition）- 深蓝色
   - 例子（example）- 紫色
   - 反例（counterexample）- 粉色
   - 归类（classification）- 淡黄色
   - 思想方法（thoughtMethod）- 深绿色
   - 问题（question）- 淡绿色
   - 思路（idea）- 淡灰色

2. **文献管理类（5种）**：
   - 作者（author）- 淡蓝色
   - 研究进展（researchProgress）- 蓝色
   - 论文（paper）- 紫色
   - 书作（book）- 紫色
   - 文献（literature）- 紫色

**核心功能**：

```javascript
// 1. 一键制卡（推荐）
MNMath.makeNote(note, addToReview, reviewEverytime)

// 2. 智能链接管理
MNMath.linkParentNote(note)
MNMath.cleanupOldParentLinks(note, currentParentNote)

// 3. 标题管理
MNMath.changeTitle(note)  // 自动格式化为【类型 >> 内容】
MNMath.parseNoteTitle(note)  // 解析标题结构

// 4. 内容智能整理
MNMath.replaceFieldContentByPopup(note)
MNMath.moveCommentsArrToField(note, indexArr, field, toBottom)

// 5. 批量处理
MNMath.batchChangeTitles(scope, rootNote)
MNMath.batchChangeClassificationTitles(scope, rootNote)

// 6. 模板管理
MNMath.addTemplate(note)
MNMath.mergeTemplate(note)
```

**制卡工作流（8个步骤）**：
1. renewNote - 处理旧版卡片
2. mergeTemplateAndAutoMoveNoteContent - 合并模板并自动移动内容
3. changeTitle - 修改标题格式
4. changeNoteColor - 设置卡片颜色
5. linkParentNote - 建立智能链接
6. refreshNotes - 刷新显示
7. addToReview - 加入复习
8. focusInMindMap - 聚焦卡片

#### HtmlMarkdownUtils 类 - HTML 样式工具

提供丰富的 HTML 样式和图标，支持 5 级层次结构。

```javascript
// 预定义图标
static icons = {
  level1: '🚩', level2: '▸', level3: '▪', 
  level4: '•', level5: '·',
  key: '🔑', alert: '⚠️', danger: '❗❗❗', 
  remark: '📝', goal: '🎯', question: '❓', 
  idea: '💡', method: '✨'
}

// 创建带样式的 HTML 文本
HtmlMarkdownUtils.createHtmlMarkdownText(text, type)
```

#### Pangu 类 - 中文排版优化

自动优化中英文混排，基于 pangu.js 规则。

```javascript
// 自动在中英文之间添加空格
Pangu.spacing(text)
// "MarginNote4插件" → "MarginNote 4 插件"
```

#### String/MNNote 原型扩展

- **String.prototype**: 85+ 方法扩展
- **MNNote.prototype**: 30+ 方法扩展，提供更流畅的链式调用

## 🎨 UI/UX 设计规范

### 1. 颜色主题
```javascript
const colors = {
  primary: "#457bd3",      // 主色调（蓝色）
  success: "#75fb4c",      // 成功（绿色）
  danger: "#e06c75",       // 危险（红色）
  inactive: "#677180",     // 未激活（灰色）
  highlight: "#2c4d81"     // 高亮色
};
```

### 2. 按钮样式
```javascript
MNButton.new({
  title: "按钮文字",
  bold: true,
  font: 14,
  radius: 10,
  color: "#457bd3",
  opacity: 0.8
});
```

### 3. 动画效果
```javascript
MNUtil.animate(() => {
  // 动画内容
}, 0.25); // 动画时长
```

## 🐛 调试技巧

### 1. 日志输出
```javascript
// 添加日志
MNUtil.log({
  level: "info/warn/error",
  message: "日志内容",
  detail: {...}
});

// 查看日志
// 切换到 Log Viewer 视图
```

### 2. 错误处理
```javascript
try {
  // 业务逻辑
} catch (error) {
  subscriptionUtils.addErrorLog(error, "functionName", {
    // 上下文信息
  });
}
```



## 📝 开发规范

### 1. 基本开发原则

#### 1.1 核心原则
- **深度理解**：每次输出前必须深度理解项目背景、用户意图和技术栈特征
- **权威参考**：当信息不确定时，先查询权威资料（官方文档、标准或源码）
- **精确回答**：仅回答与问题直接相关内容，避免冗余和教程式铺陈
- **任务分解**：面对复杂需求，拆分为可管理的子任务

#### 1.2 ⚠️ 严禁擅自修改用户内容（极其重要）

**绝对禁止擅自生成内容替换用户的原始内容！**

在进行任何代码解耦、重构、迁移或整理工作时：

1. **必须严格复制原始内容**：
   - 从 git 历史、现有文件或用户提供的内容中逐字复制
   - 保持所有注释、空行、格式完全一致
   - 即使是被注释掉的代码也必须保留

2. **禁止自创或简化**：
   - 不得简化菜单结构或删减菜单项
   - 不得改变函数参数或默认值
   - 不得"优化"代码或改进命名
   - 不得删除看似"无用"的代码

3. **保持完整性**：
   - 每个菜单项、每个按钮配置、每个参数都必须完整保留
   - 保持原有的层级结构和顺序
   - 保持原有的中英文内容、emoji 等

4. **遇到不确定立即询问**：
   - 如果某个部分不清楚或缺失，必须询问用户
   - 不得自行推测或填充内容
   - 不得基于"常见做法"来补充

**违反此原则会导致功能丢失、用户工作被破坏，是绝对不可接受的错误。**

#### 1.3 源码阅读规范

1. **完整阅读原则**：
   - 必须完整阅读整个文件，避免断章取义
   - 理解上下文依赖和完整的业务逻辑
   - 注意文件间的引用关系

2. **大文件处理**：
   - 超过 500 行的文件应分段阅读
   - 每段控制在 100-200 行
   - 记录段间的关联关系

### 2. 代码风格
- 使用 2 空格缩进
- 函数名使用 camelCase
- 常量使用 UPPER_CASE
- 注释使用中文，便于理解

### 3. 错误处理
- 所有异步操作必须有错误处理
- 用户操作失败时显示友好提示
- 错误日志要包含足够的上下文

### 4. 性能优化
- 避免频繁的 UI 刷新
- 大文件操作使用异步
- 及时释放不用的资源

### 5. 版本管理
- 遵循语义化版本规范
- 更新 mnaddon.json 中的版本号
- 记录更新日志

## 🚀 发布流程

1. **更新版本号**
   - 修改 mnaddon.json 中的 version

2. **测试**
   - 在 MN3 和 MN4 中测试
   - 测试订阅功能
   - 测试插件安装

3. **打包**
   ```bash
   # 使用日期命名
   zip -r mnutils_0628.mnaddon * -x ".*" -x "__MACOSX"
   ```

4. **发布**
   - 上传到 WebDAV 服务器
   - 更新 mnaddon.json 配置
   - 通知用户更新

## 🔄 长期开发计划

### 代码迁移与重构
MNMath 和 HtmlMarkdownUtils 类是新架构的核心，其他代码（特别是 MNNote.prototype 扩展）需要逐步迁移到这两个类中：

1. **迁移原则**：
   - 优先将常用功能迁移到 MNMath 类
   - 保持 API 设计的一致性和合理性
   - 函数名以合适合理为主，不必与原始完全一致
   - 充分利用已有的工具方法，避免重复实现

2. **待迁移功能清单**：
   - ✅ clearFailedLinks - 清理失效链接（已迁移为 cleanupBrokenLinks）
   - ✅ convertLinksToNewVersion - 转换链接到新版本（已迁移）
   - ✅ fixProblemLinks - 修复合并造成的链接问题（已迁移为 fixMergeProblematicLinks）
   - ⏳ linkRemoveDuplicatesAfterIndex - 删除重复链接
   - ⏳ 其他 MNNote.prototype 扩展方法

3. **迁移时注意事项**：
   - 使用 MNMath 已有的工具方法（如 parseNoteComments）
   - 保持错误处理的健壮性
   - 添加必要的 JSDoc 注释

## 🔒 安全考虑

1. **APIKey 安全**
   - 不在日志中记录完整 APIKey
   - 使用 iCloud 同步存储
   - 支持隐藏/显示切换

2. **网络安全**
   - HTTPS 通信
   - 请求超时处理
   - 错误重试机制

3. **数据安全**
   - 配置文件加密存储
   - 敏感信息脱敏处理

## 📚 相关文档

- [MNUTILS_API_GUIDE.md](./MNUTILS_API_GUIDE.md) - 使用 MNUtils API 开发插件的完整指南
- [MarginNote 官方文档](https://www.marginnote.com/)
- [JSBox 文档](https://docs.xteko.com/) - 了解 JSB 框架

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交代码
4. 发起 Pull Request

## 📄 许可证

本项目采用 MIT 许可证。