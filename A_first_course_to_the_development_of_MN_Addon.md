# MarginNote 插件开发新手教程 - 从零开始到独立开发

> 本教程专为没有 JavaScript 基础的 MarginNote 用户设计，通过实际案例让你快速掌握插件开发。

## 📚 目录

1. [前言 - 为什么要学习插件开发](#前言---为什么要学习插件开发)
2. [JavaScript 必备基础](#javascript-必备基础)
3. [MarginNote 插件结构](#marginnote-插件结构)
4. [MNUtils API 入门](#mnutils-api-入门)
5. [开发你的第一个按钮](#开发你的第一个按钮)
6. [插件文件处理](#插件文件处理)
7. [进阶功能开发](#进阶功能开发)
8. [MNTask 案例学习](#mntask-案例学习)
9. [常见问题与调试](#常见问题与调试)
10. [资源与下一步](#资源与下一步)

## 前言 - 为什么要学习插件开发

MarginNote 的插件系统让你能够：
- 🚀 自定义工作流程，提高学习效率
- 🎯 实现特定需求，如批量处理、自动化操作
- 💡 整合外部工具，如 AI、网络服务等
- 🛠️ 修改现有插件，适配个人需求

## JavaScript 必备基础

### 1. 变量和常量

```javascript
// 变量 - 可以修改的值
let noteTitle = "我的笔记";
noteTitle = "修改后的标题";  // ✅ 可以修改

// 常量 - 不能修改的值
const colorIndex = 2;
colorIndex = 3;  // ❌ 错误！常量不能修改

// 在 MN 插件中的实际应用
const focusNote = MNNote.getFocusNote();  // 获取当前选中的卡片
let originalTitle = focusNote.noteTitle;   // 保存原始标题
```

### 2. 字符串操作

```javascript
// 字符串拼接
let prefix = "【重要】";
let content = "这是笔记内容";
let fullTitle = prefix + content;  // "【重要】这是笔记内容"

// 模板字符串（推荐）
let noteCount = 5;
let message = `已处理 ${noteCount} 个笔记`;  // "已处理 5 个笔记"

// 常用字符串方法
let text = "  MarginNote 4  ";
text.trim()           // "MarginNote 4" (去除首尾空格)
text.includes("Note") // true (是否包含)
text.replace("4", "3") // "  MarginNote 3  " (替换)
text.split(" ")       // ["", "", "MarginNote", "4", "", ""] (分割)

// MN 插件实例
if (focusNote.noteTitle.includes("TODO")) {
  focusNote.noteTitle = focusNote.noteTitle.replace("TODO", "DONE");
}
```

### 3. 数组操作

```javascript
// 创建数组
let tags = ["重要", "复习", "考试"];

// 访问元素
let firstTag = tags[0];  // "重要"

// 添加元素
tags.push("紧急");      // 末尾添加
tags.unshift("最新");   // 开头添加

// 数组方法（插件开发常用）
let notes = MNNote.getFocusNotes();  // 获取所有选中的笔记

// filter - 筛选
let importantNotes = notes.filter(note => note.colorIndex === 2);

// map - 转换
let titles = notes.map(note => note.noteTitle);

// forEach - 遍历
notes.forEach(note => {
  note.colorIndex = 3;  // 将所有笔记设为黄色
});

// find - 查找第一个
let todoNote = notes.find(note => note.noteTitle.includes("TODO"));
```

### 4. 对象操作

```javascript
// 创建对象
let noteConfig = {
  title: "我的笔记",
  color: 2,
  tags: ["重要", "复习"]
};

// 访问属性
let title = noteConfig.title;      // 点号访问
let color = noteConfig["color"];   // 方括号访问

// 修改属性
noteConfig.title = "新标题";
noteConfig.priority = "高";  // 添加新属性

// 解构赋值（常见于插件开发）
const { button, des, focusNote } = context;  // 从 context 对象中提取属性

// MN 插件实例 - Menu 类的使用
let menuConfig = {
  action: "menu",
  menuItems: [
    {
      action: "copyTitle",
      menuTitle: "复制标题"
    },
    {
      action: "makeCard",
      menuTitle: "制作卡片"
    }
  ]
};
```

### 5. 函数基础

```javascript
// 函数声明
function processNote(note) {
  note.colorIndex = 2;
  note.appendTags(["已处理"]);
  return note;
}

// 箭头函数（插件中更常用）
const processNote = (note) => {
  note.colorIndex = 2;
  note.appendTags(["已处理"]);
  return note;
};

// 简写形式
const getTitle = note => note.noteTitle;  // 单参数可省略括号
const isImportant = note => note.colorIndex === 2;  // 单行可省略大括号

// 异步函数（处理需要等待的操作）
const askUser = async () => {
  const result = await MNUtil.input("请输入标题", "", ["确定"]);
  return result;
};
```

### 6. 条件判断

```javascript
// if-else 语句
if (focusNote) {
  // 有选中的笔记
  MNUtil.showHUD("找到笔记：" + focusNote.noteTitle);
} else {
  // 没有选中
  MNUtil.showHUD("请先选择一个笔记");
}

// 三元运算符（简洁的条件判断）
let message = focusNote ? "有选中" : "无选中";

// 逻辑运算
if (focusNote && focusNote.noteTitle) {  // 两个条件都要满足
  // 处理笔记
}

if (!focusNote || focusNote.colorIndex === 0) {  // 任一条件满足
  // 处理无效情况
}
```

### 7. 错误处理

```javascript
// try-catch 结构（插件开发必备）
try {
  // 可能出错的代码
  const focusNote = MNNote.getFocusNote();
  focusNote.noteTitle = "新标题";
} catch (error) {
  // 错误处理
  MNUtil.showHUD("操作失败：" + error.message);
}

// 安全检查模式
const focusNote = MNNote.getFocusNote();
if (focusNote) {
  // 确保 focusNote 存在再操作
  focusNote.noteTitle = "新标题";
}
```

## MarginNote 插件结构

### 1. 基本文件结构

```
my-plugin/
├── main.js         # 插件主文件（必需）
├── mnaddon.json    # 插件配置文件（必需）
├── logo.png        # 插件图标 44×44（必需）
└── utils.js        # 工具函数（可选）
```

### 2. mnaddon.json - 插件配置

```json
{
  "addonid": "com.example.myplugin",
  "name": "我的插件",
  "author": "你的名字",
  "version": "1.0.0",
  "marginnote_version_min": "3.7.0",
  "cert_key": ""  // 留空即可
}
```

### 3. main.js - 插件主文件

```javascript
// 必需的框架代码
JSB.newAddon = function(mainPath) {
  // 定义插件类
  var MyPlugin = JSB.defineClass('MyPlugin : JSExtension', {
    // ========== 生命周期方法 ==========
    
    // 场景连接时（插件启动）
    sceneWillConnect: function() {
      // 初始化代码
      MNUtil.showHUD("插件已启动");
    },
    
    // 场景断开时（插件关闭）
    sceneDidDisconnect: function() {
      // 清理代码
    },
    
    // 笔记本打开时
    notebookWillOpen: function(notebookId) {
      // 笔记本相关初始化
    },
    
    // 笔记本关闭时
    notebookWillClose: function(notebookId) {
      // 保存状态等
    },
    
    // ========== 事件响应方法 ==========
    
    // 笔记弹出菜单
    onPopupMenuOnNote: function(sender) {
      if (!sender || !sender.userInfo || !sender.userInfo.note) return;
      
      // 添加自定义菜单项
      sender.userInfo.menuController.commandTable.push({
        title: "我的功能",
        object: self,
        selector: "myFunction:",
        param: sender.userInfo.note.noteId
      });
    },
    
    // 选中文本弹出菜单
    onPopupMenuOnSelection: function(sender) {
      // 处理选中文本
    },
    
    // ========== 自定义方法 ==========
    
    // 自定义功能实现
    myFunction: function(noteId) {
      const note = MNNote.new(noteId);
      if (!note) {
        MNUtil.showHUD("未找到笔记");
        return;
      }
      
      // 使用撤销分组
      MNUtil.undoGrouping(() => {
        note.noteTitle = "已处理: " + note.noteTitle;
        note.colorIndex = 2;  // 设为淡蓝色
        MNUtil.showHUD("✅ 处理完成");
      });
    }
  });
  
  // 返回插件类
  return MyPlugin;
};
```

### 4. 生命周期详解

```
插件安装
    ↓
sceneWillConnect()      # 插件启动
    ↓
notebookWillOpen()      # 打开笔记本
    ↓
[用户使用插件功能]
    ↓
notebookWillClose()     # 关闭笔记本
    ↓
sceneDidDisconnect()    # 插件关闭
```

### 5. JSB 框架特殊规则

#### ⚠️ self 引用规则（极其重要）

```javascript
// ❌ 错误：在方法内部使用 this
JSB.defineClass('MyPlugin : JSExtension', {
  myMethod: function() {
    let self = this;  // ❌ 在 JSB 框架中不起作用！
  }
});

// ✅ 正确：使用获取实例函数
const getMyPlugin = () => self;  // 文件顶部定义

JSB.defineClass('MyPlugin : JSExtension', {
  myMethod: function() {
    let self = getMyPlugin();  // ✅ 正确获取实例
    // 使用 self
  }
});
```

## MNUtils API 入门

### 1. 什么是 MNUtils？

MNUtils 是 MarginNote 插件开发的核心框架，提供了 300+ 个封装好的 API，让你能够：
- 操作笔记和文档
- 显示界面和菜单
- 处理用户交互
- 管理文件和数据

### 2. 如何使用 MNUtils？

#### 方法一：依赖 MNUtils 插件（推荐）

1. 用户需要先安装 MNUtils 插件
2. 在你的插件中使用：

```javascript
JSB.newAddon = function(mainPath) {
  // 加载 MNUtils
  JSB.require('mnutils');
  
  var MyPlugin = JSB.defineClass('MyPlugin : JSExtension', {
    sceneWillConnect: function() {
      // 检查 MNUtils 是否可用
      if (typeof MNUtil === 'undefined') {
        MNUtil.alert("请先安装 MNUtils 插件");
        return;
      }
      
      // 正常使用 MNUtils API
      MNUtil.showHUD("插件已启动");
    }
  });
  
  return MyPlugin;
};
```

#### 方法二：内置 mnutils.js（独立运行）

将 mnutils.js 文件复制到你的插件目录，然后：

```javascript
JSB.require('mnutils');  // 加载本地的 mnutils.js
```

### 3. MNUtil 类 - 核心工具类（最常用）

#### 3.1 UI 交互

```javascript
// 显示提示信息（最常用）
MNUtil.showHUD("操作成功！");                    // 默认 2 秒
MNUtil.showHUD("正在处理...", 5);               // 显示 5 秒
MNUtil.showHUD("❌ 操作失败", -1);              // 需要手动关闭

// 确认对话框
const confirmed = await MNUtil.confirm("确认删除？", "此操作不可恢复");
if (confirmed) {
  // 用户点击确认
}

// 输入对话框
const input = await MNUtil.input("请输入标题", "新建笔记的标题", ["确定"]);
if (input) {
  // 用户输入了内容
}

// 选择对话框
const options = ["选项1", "选项2", "选项3"];
const selected = await MNUtil.userSelect("请选择", "", options);
if (selected > 0) {  // 0 是取消
  const choice = options[selected - 1];
}
```

#### 3.2 笔记操作

```javascript
// 获取笔记
const note = MNUtil.getNoteById(noteId);         // 通过 ID 获取
const exists = MNUtil.noteExists(noteId);        // 检查是否存在

// 聚焦笔记
MNUtil.focusNoteInMindMapById(noteId, 0.3);      // 在脑图中聚焦
MNUtil.focusNoteInDocumentById(noteId);          // 在文档中聚焦

// 撤销分组（重要！）
MNUtil.undoGrouping(() => {
  // 这里的所有操作会作为一个撤销单元
  note1.noteTitle = "新标题";
  note2.colorIndex = 3;
  // 用户按撤销会一次撤销所有操作
});
```

#### 3.3 剪贴板和选择

```javascript
// 剪贴板
MNUtil.copy("要复制的文本");                     // 复制文本
MNUtil.copyJSON({name: "data"});                // 复制对象为 JSON
const text = MNUtil.clipboardText;              // 读取剪贴板

// 获取选中内容
const selectedText = MNUtil.selectionText;      // 当前选中的文本
```

#### 3.4 平台和版本

```javascript
// 版本检测
if (MNUtil.isMN4()) {
  // MarginNote 4 特有功能
}

// 平台检测
if (MNUtil.isMacOS()) {
  // macOS 特有功能
} else {
  // iOS 功能
}

// 版本信息
console.log(MNUtil.version);  // {version: "4.0.0", type: "macOS"}
```

#### 3.5 文件操作

```javascript
// 读写 JSON
const data = MNUtil.readJSON("/path/to/file.json");
MNUtil.writeJSON("/path/to/file.json", {key: "value"});

// 检查文件
if (MNUtil.isfileExists("/path/to/file")) {
  // 文件存在
}

// 创建文件夹
MNUtil.createFolder("/path/to/folder");
```

### 4. MNNote 类 - 笔记核心类（最重要）

#### 4.1 获取笔记

```javascript
// 获取当前焦点笔记（最常用）
const focusNote = MNNote.getFocusNote();
if (!focusNote) {
  MNUtil.showHUD("请先选择一个笔记");
  return;
}

// 获取所有选中的笔记
const selectedNotes = MNNote.getFocusNotes();
MNUtil.showHUD(`选中了 ${selectedNotes.length} 个笔记`);

// 创建笔记对象
const note = MNNote.new(noteId);  // 从 ID 创建
```

#### 4.2 笔记属性

```javascript
// 基本属性
note.noteId          // 笔记唯一 ID
note.noteTitle       // 笔记标题
note.excerptText     // 摘录文本
note.colorIndex      // 颜色索引 (0-15)

// 颜色对照表
// 0: 无色, 1: 淡黄, 2: 淡蓝, 3: 黄色
// 4: 深蓝, 5: 橙色, 6: 红色, 7: 紫色
// 8: 淡绿, 9: 深绿, 10: 灰色, 11: 深橙
// 12: 棕色, 13: 深红, 14: 深紫, 15: 深灰

// 层级关系
note.parentNote      // 父笔记
note.childNotes      // 子笔记数组

// 其他属性
note.comments        // 评论数组
note.tags            // 标签数组
note.createDate      // 创建时间
note.modifiedDate    // 修改时间
```

#### 4.3 笔记操作

```javascript
// 修改属性
MNUtil.undoGrouping(() => {
  note.noteTitle = "新的标题";
  note.colorIndex = 2;  // 设为淡蓝色
});

// 添加评论
note.appendTextComment("这是一条文本评论");
note.appendMarkdownComment("**粗体** *斜体*");
note.appendHtmlComment("<b>HTML</b>", "显示文本", 16);

// 标签操作
note.appendTags(["重要", "复习"]);      // 添加标签
note.removeTags(["临时"]);              // 删除标签

// 链接操作
note.appendNoteLink(anotherNote, "To");  // 添加链接

// 层级操作
parentNote.addChild(childNote);          // 添加子笔记
childNote.removeFromParent();            // 移除父子关系

// 其他操作
note.focus();                            // 聚焦到这个笔记
note.openInFloatingWindow();            // 在浮窗中打开
note.delete();                          // 删除笔记
```

#### 4.4 批量操作示例

```javascript
// 批量修改选中笔记的颜色
const notes = MNNote.getFocusNotes();
if (notes.length === 0) {
  MNUtil.showHUD("请先选择笔记");
  return;
}

MNUtil.undoGrouping(() => {
  notes.forEach(note => {
    note.colorIndex = 3;  // 全部设为黄色
    note.appendTags(["已处理"]);
  });
  MNUtil.showHUD(`✅ 已处理 ${notes.length} 个笔记`);
});
```

### 5. Menu 类 - 弹出菜单

```javascript
// 创建菜单
const menu = new Menu(button, self, 250);  // 宽度 250

// 添加菜单项
menu.addMenuItem("复制标题", "copyTitle:", note);
menu.addMenuItem("设为重要", "setImportant:", note);
menu.addMenuItem("删除", "deleteNote:", note);

// 显示菜单
menu.show();

// 在插件类中实现对应方法
copyTitle: function(note) {
  MNUtil.copy(note.noteTitle);
  MNUtil.showHUD("已复制标题");
}
```

### 6. 常用操作模式

#### 6.1 安全操作模式

```javascript
// 始终检查对象是否存在
const focusNote = MNNote.getFocusNote();
if (!focusNote) {
  MNUtil.showHUD("请先选择笔记");
  return;
}

// 使用 try-catch 处理错误
try {
  MNUtil.undoGrouping(() => {
    // 你的操作
  });
} catch (error) {
  MNUtil.showHUD("操作失败: " + error.message);
}
```

#### 6.2 异步操作模式

```javascript
// 使用 async/await
processNote: async function() {
  const title = await MNUtil.input("输入新标题", "", ["确定"]);
  if (!title) return;
  
  const focusNote = MNNote.getFocusNote();
  if (!focusNote) return;
  
  MNUtil.undoGrouping(() => {
    focusNote.noteTitle = title;
  });
}
```

#### 6.3 批处理模式

```javascript
// 处理多个笔记时显示进度
const notes = MNNote.getFocusNotes();
let processed = 0;

MNUtil.showHUD("处理中...", -1);  // 显示持续的 HUD

MNUtil.undoGrouping(() => {
  notes.forEach(note => {
    // 处理每个笔记
    note.colorIndex = 2;
    processed++;
  });
});

MNUtil.showHUD(`✅ 完成！处理了 ${processed} 个笔记`);
```

## 插件文件处理

### 1. 插件打包（极其重要）

#### ⚠️ 错误的打包方式（会导致插件无法加载）

```bash
# ❌ 错误：从外部目录压缩
zip ../plugin.mnaddon ../plugin-folder/*

# ❌ 错误：压缩整个文件夹
zip -r plugin.mnaddon plugin-folder/

# ❌ 错误：使用相对路径
zip plugin.mnaddon ../plugin/main.js
```

这些错误会导致：
- 插件无法加载
- 插件列表中显示但无法勾选
- 严重时导致 MarginNote 闪退

#### ✅ 正确的打包方式

```bash
# 方法一：使用 mnaddon4 工具（推荐）
cd your-plugin-folder
mnaddon4 build plugin-name

# 方法二：在插件目录内直接压缩
cd your-plugin-folder
zip plugin-name.mnaddon main.js mnaddon.json logo.png utils.js

# 方法三：使用通配符
cd your-plugin-folder
zip plugin-name.mnaddon *.js *.json *.png
```

#### 验证打包结果

```bash
# 检查文件结构
unzip -l plugin-name.mnaddon

# 正确的输出：
Archive:  plugin-name.mnaddon
  Length      Date    Time    Name
---------  ---------- -----   ----
     1234  06-30-2025 18:00   main.js
      567  06-30-2025 18:00   mnaddon.json
     1803  06-30-2025 18:00   logo.png
---------                     -------
     3604                     3 files

# 注意：文件名前面不应该有任何路径前缀！
```

### 2. mnaddon4 工具使用

```bash
# 安装 mnaddon4 工具
npm install -g mnaddon4

# 打包插件
mnaddon4 build my-plugin

# 解包插件（查看其他插件的源码）
mnaddon4 unpack some-plugin.mnaddon

# 调整图标大小到 44×44
mnaddon4 resize logo.png
```

### 3. 插件安装和调试

#### 安装方式

1. **拖拽安装**：将 .mnaddon 文件拖入 MarginNote
2. **双击安装**：双击 .mnaddon 文件
3. **开发模式**：将插件文件夹放到扩展目录
   - macOS: `~/Library/Containers/QReader.MarginStudyMac/Data/Library/MarginNote Extensions/`
   - iOS: 通过 iTunes 文件共享

#### 重要提示

- ⚠️ 插件**无法热更新**，修改后必须重启 MarginNote
- 💡 开发时建议使用快捷键 `Cmd+Q` (macOS) 快速退出重启
- 🔧 使用 `MNUtil.showHUD()` 和 `MNUtil.log()` 进行调试

## 开发你的第一个按钮

### 1. MNToolbar 架构简介

MNToolbar 使用**注册表模式**，让你无需修改核心文件就能添加功能：

```
核心文件（不要修改）              扩展文件（你要修改的）
├── main.js                    ├── xdyy_button_registry.js      # 按钮配置
├── utils.js                   ├── xdyy_menu_registry.js        # 菜单模板  
└── webviewController.js       └── xdyy_custom_actions_registry.js # 功能实现
```

### 2. 三步添加新按钮

#### 步骤 1：注册按钮（xdyy_button_registry.js）

找到 `registerAllButtons()` 函数，添加你的按钮：

```javascript
// 在 registerAllButtons() 函数中添加
global.registerButton("custom21", {
  name: "批量改色",               // 按钮显示的名称
  image: "color_batch",          // 图标文件名（不含 .png）
  templateName: "menu_color_batch" // 关联的菜单模板名称
});
```

#### 步骤 2：定义菜单（xdyy_menu_registry.js）

##### 简单按钮（直接执行）

```javascript
global.registerMenuTemplate("menu_color_batch", JSON.stringify({
  action: "batchChangeColor"  // 对应的动作名称
}));
```

##### 带菜单的按钮

```javascript
global.registerMenuTemplate("menu_color_batch", {
  action: "menu",
  menuTitle: "批量改色",
  menuItems: [
    {
      action: "changeToRed",
      menuTitle: "🔴 改为红色"
    },
    {
      action: "changeToBlue", 
      menuTitle: "🔵 改为蓝色"
    },
    {
      action: "changeToYellow",
      menuTitle: "🟡 改为黄色"
    }
  ]
});
```

#### 步骤 3：实现功能（xdyy_custom_actions_registry.js）

```javascript
// 简单按钮的实现
global.registerCustomAction("batchChangeColor", async function(context) {
  const { button, des, focusNote, focusNotes, self } = context;
  
  // 检查是否有选中的笔记
  if (!focusNotes || focusNotes.length === 0) {
    MNUtil.showHUD("❌ 请先选择要处理的笔记");
    return;
  }
  
  // 使用撤销分组，让用户可以一键撤销
  MNUtil.undoGrouping(() => {
    try {
      // 批量修改颜色
      focusNotes.forEach(note => {
        note.colorIndex = 6;  // 设为红色
      });
      
      MNUtil.showHUD(`✅ 已将 ${focusNotes.length} 个笔记改为红色`);
    } catch (error) {
      MNUtil.showHUD(`❌ 操作失败: ${error.message}`);
    }
  });
});

// 带菜单按钮的实现
global.registerCustomAction("changeToRed", async function(context) {
  changeNotesColor(context, 6, "红色");
});

global.registerCustomAction("changeToBlue", async function(context) {
  changeNotesColor(context, 2, "蓝色");
});

global.registerCustomAction("changeToYellow", async function(context) {
  changeNotesColor(context, 3, "黄色");
});

// 通用函数
function changeNotesColor(context, colorIndex, colorName) {
  const { focusNotes } = context;
  
  if (!focusNotes || focusNotes.length === 0) {
    MNUtil.showHUD("❌ 请先选择笔记");
    return;
  }
  
  MNUtil.undoGrouping(() => {
    focusNotes.forEach(note => {
      note.colorIndex = colorIndex;
    });
    MNUtil.showHUD(`✅ 已改为${colorName}`);
  });
}
```

### 3. 实战示例：智能标题处理

让我们创建一个更实用的功能：

```javascript
// 步骤 1：注册按钮
global.registerButton("custom22", {
  name: "智能标题",
  image: "smart_title",
  templateName: "menu_smart_title"
});

// 步骤 2：定义菜单
global.registerMenuTemplate("menu_smart_title", {
  action: "menu",
  menuTitle: "智能标题处理",
  menuItems: [
    {
      action: "addPrefix",
      menuTitle: "📌 添加前缀"
    },
    {
      action: "addSuffix",
      menuTitle: "🔚 添加后缀"
    },
    {
      action: "cleanTitle",
      menuTitle: "🧹 清理标题"
    },
    {
      action: "capitalizeTitle",
      menuTitle: "🔤 首字母大写"
    }
  ]
});

// 步骤 3：实现功能
global.registerCustomAction("addPrefix", async function(context) {
  const { focusNotes } = context;
  if (!focusNotes || focusNotes.length === 0) {
    MNUtil.showHUD("❌ 请先选择笔记");
    return;
  }
  
  // 获取用户输入
  const prefix = await MNUtil.input("输入前缀", "将添加到所有选中笔记的标题前", ["确定"]);
  if (!prefix) return;
  
  MNUtil.undoGrouping(() => {
    focusNotes.forEach(note => {
      note.noteTitle = prefix + note.noteTitle;
    });
    MNUtil.showHUD(`✅ 已添加前缀到 ${focusNotes.length} 个笔记`);
  });
});

global.registerCustomAction("cleanTitle", async function(context) {
  const { focusNotes } = context;
  if (!focusNotes || focusNotes.length === 0) {
    MNUtil.showHUD("❌ 请先选择笔记");
    return;
  }
  
  MNUtil.undoGrouping(() => {
    let cleaned = 0;
    focusNotes.forEach(note => {
      // 清理常见的无用字符
      const oldTitle = note.noteTitle;
      const newTitle = oldTitle
        .trim()                           // 去除首尾空格
        .replace(/\s+/g, ' ')            // 多个空格替换为一个
        .replace(/^[\-\*\·\•]+\s*/, '') // 去除开头的符号
        .replace(/[\.,;:!?。，；：！？]+$/, ''); // 去除结尾的标点
      
      if (oldTitle !== newTitle) {
        note.noteTitle = newTitle;
        cleaned++;
      }
    });
    MNUtil.showHUD(`✅ 清理了 ${cleaned} 个标题`);
  });
});
```

### 4. 高级功能示例

#### 4.1 双击和长按

```javascript
global.registerMenuTemplate("menu_advanced", {
  action: "defaultAction",        // 单击执行
  doubleClick: {                 // 双击执行
    action: "doubleClickAction"
  },
  onLongPress: {                 // 长按显示菜单
    action: "menu",
    menuItems: [
      {
        action: "option1",
        menuTitle: "选项 1"
      }
    ]
  }
});
```

#### 4.2 条件菜单

```javascript
global.registerCustomAction("conditionalMenu", async function(context) {
  const { focusNote } = context;
  
  // 根据条件显示不同菜单
  const menuItems = [];
  
  if (focusNote) {
    if (focusNote.colorIndex === 0) {
      menuItems.push({
        title: "设置颜色",
        object: self,
        selector: "setColor:",
        param: focusNote
      });
    }
    
    if (!focusNote.parentNote) {
      menuItems.push({
        title: "设为子笔记",
        object: self,
        selector: "setAsChild:",
        param: focusNote
      });
    }
  }
  
  // 显示菜单
  const menu = new Menu(context.button, self, 250);
  menuItems.forEach(item => {
    menu.addMenuItem(item.title, item.selector, item.param);
  });
  menu.show();
});
```

### 5. 调试技巧

```javascript
// 1. 使用 HUD 显示调试信息
MNUtil.showHUD(`调试: focusNotes = ${focusNotes.length}`);

// 2. 使用日志（需要 MNUtils）
if (typeof MNUtil !== "undefined" && MNUtil.log) {
  MNUtil.log("🔍 调试信息:", {
    focusNote: focusNote?.noteTitle,
    count: focusNotes.length
  });
}

// 3. 复制对象到剪贴板查看
MNUtil.copyJSON({
  noteInfo: {
    id: focusNote.noteId,
    title: focusNote.noteTitle,
    color: focusNote.colorIndex
  }
});
MNUtil.showHUD("已复制调试信息到剪贴板");

// 4. 错误处理
try {
  // 你的代码
} catch (error) {
  MNUtil.showHUD(`❌ 错误: ${error.message}`);
  MNUtil.log("错误详情:", error);
}
```

## 进阶功能开发

### 1. 评论管理系统

```javascript
// 添加各种类型的评论
const note = MNNote.getFocusNote();

// 文本评论
note.appendTextComment("这是一条普通评论");

// Markdown 评论
note.appendMarkdownComment("**粗体** *斜体* `代码`");

// HTML 评论（带样式）
note.appendHtmlComment(
  '<span style="color: red;">红色文字</span>',
  "红色文字",  // 纯文本版本
  16           // 字体大小
);

// 移动评论位置
note.moveComment(0, 2);  // 将第一条评论移到第三个位置

// 删除评论
note.removeCommentByIndex(1);  // 删除第二条评论
```

### 2. 智能链接管理

```javascript
// 创建双向链接
const note1 = MNNote.getFocusNote();
const note2 = MNNote.getFocusNotes()[1];

if (note1 && note2) {
  // 添加双向链接
  note1.appendNoteLink(note2, "Both");
  
  // 或单向链接
  note1.appendNoteLink(note2, "To");    // note1 → note2
  note1.appendNoteLink(note2, "From");  // note1 ← note2
}

// 获取链接的笔记
const linkedNotes = note1.linkedNotes.map(link => {
  return MNNote.new(link.noteId);
});
```

### 3. 批量处理模式

```javascript
global.registerCustomAction("batchProcess", async function(context) {
  const { focusNotes } = context;
  
  if (!focusNotes || focusNotes.length === 0) {
    MNUtil.showHUD("❌ 请选择要处理的笔记");
    return;
  }
  
  // 显示处理选项
  const options = [
    "添加标签",
    "修改颜色",
    "添加到复习",
    "创建子笔记"
  ];
  
  const selected = await MNUtil.userSelect("选择批量操作", "", options);
  if (selected === 0) return;  // 取消
  
  const action = options[selected - 1];
  
  // 显示进度
  MNUtil.showHUD(`正在${action}...`, -1);
  
  MNUtil.undoGrouping(() => {
    let processed = 0;
    let failed = 0;
    
    focusNotes.forEach(note => {
      try {
        switch (action) {
          case "添加标签":
            note.appendTags(["批处理", new Date().toLocaleDateString()]);
            break;
          case "修改颜色":
            note.colorIndex = 3;  // 黄色
            break;
          case "添加到复习":
            note.addToReview();
            break;
          case "创建子笔记":
            note.createChildNote({
              title: "子笔记",
              colorIndex: note.colorIndex
            });
            break;
        }
        processed++;
      } catch (error) {
        failed++;
      }
    });
    
    MNUtil.showHUD(
      `✅ 完成！成功: ${processed}, 失败: ${failed}`
    );
  });
});
```

### 4. 模板系统

```javascript
// 定义笔记模板
const templates = {
  "会议笔记": {
    title: "会议笔记 - {date}",
    color: 3,
    tags: ["会议", "待办"],
    comments: [
      "📅 日期: {date}",
      "👥 参与人: ",
      "📋 议题: ",
      "✅ 行动项: "
    ]
  },
  "读书笔记": {
    title: "《书名》- 第X章",
    color: 2,
    tags: ["读书", "学习"],
    comments: [
      "📖 书名: ",
      "📄 章节: ",
      "💡 要点: ",
      "💭 思考: "
    ]
  }
};

// 应用模板
global.registerCustomAction("applyTemplate", async function(context) {
  // 选择模板
  const templateNames = Object.keys(templates);
  const selected = await MNUtil.userSelect("选择模板", "", templateNames);
  if (selected === 0) return;
  
  const templateName = templateNames[selected - 1];
  const template = templates[templateName];
  
  // 创建新笔记
  const parentNote = MNNote.getFocusNote();
  if (!parentNote) {
    MNUtil.showHUD("❌ 请先选择父笔记");
    return;
  }
  
  MNUtil.undoGrouping(() => {
    // 替换模板变量
    const date = new Date().toLocaleDateString();
    const title = template.title.replace("{date}", date);
    
    // 创建笔记
    const newNote = parentNote.createChildNote({
      title: title
    });
    
    // 应用模板属性
    newNote.colorIndex = template.color;
    newNote.appendTags(template.tags);
    
    // 添加评论
    template.comments.forEach(comment => {
      const text = comment.replace("{date}", date);
      newNote.appendTextComment(text);
    });
    
    // 聚焦到新笔记
    newNote.focus();
    MNUtil.showHUD(`✅ 已应用模板: ${templateName}`);
  });
});
```

### 5. 与外部工具集成

```javascript
// URL Scheme 调用
global.registerCustomAction("openInObsidian", async function(context) {
  const { focusNote } = context;
  if (!focusNote) {
    MNUtil.showHUD("❌ 请选择笔记");
    return;
  }
  
  // 构建 Obsidian URL
  const vaultName = "MyVault";
  const noteName = focusNote.noteTitle.replace(/[/\\?%*:|"<>]/g, '-');
  const content = encodeURIComponent(focusNote.excerptText || "");
  
  const url = `obsidian://new?vault=${vaultName}&name=${noteName}&content=${content}`;
  
  // 打开 URL
  MNUtil.openURL(url);
  MNUtil.showHUD("✅ 已发送到 Obsidian");
});

// 复制为特定格式
global.registerCustomAction("copyAsMarkdown", async function(context) {
  const { focusNote } = context;
  if (!focusNote) return;
  
  // 构建 Markdown 格式
  let markdown = `# ${focusNote.noteTitle}\n\n`;
  
  if (focusNote.excerptText) {
    markdown += `> ${focusNote.excerptText}\n\n`;
  }
  
  // 添加标签
  if (focusNote.tags.length > 0) {
    markdown += `标签: ${focusNote.tags.map(tag => `#${tag}`).join(' ')}\n\n`;
  }
  
  // 添加评论
  focusNote.comments.forEach(comment => {
    markdown += `- ${comment.text}\n`;
  });
  
  MNUtil.copy(markdown);
  MNUtil.showHUD("✅ 已复制 Markdown 格式");
});
```

## MNTask 案例学习

MNTask 展示了复杂插件的开发模式，让我们学习其中的关键技术：

### 1. 任务卡片系统设计

```javascript
// MNTask 的任务类型系统
const taskTypes = {
  objective: {
    name: "目标",
    color: 9,     // 深绿色
    prefix: "🎯"
  },
  keyResult: {
    name: "关键结果",
    color: 5,     // 橙色
    prefix: "📊"
  },
  project: {
    name: "项目",
    color: 2,     // 蓝色
    prefix: "📁"
  },
  action: {
    name: "动作",
    color: 3,     // 黄色
    prefix: "⚡"
  }
};

// 解析任务标题
function parseTaskTitle(title) {
  const match = title.match(/【(\w+)｜(\w+)】(.+)/);
  if (match) {
    return {
      type: match[1],
      status: match[2],
      content: match[3]
    };
  }
  return null;
}

// 创建任务卡片
function createTaskCard(type, content) {
  const focusNote = MNNote.getFocusNote();
  if (!focusNote) return;
  
  const taskType = taskTypes[type];
  const title = `【${taskType.name}｜未开始】${content}`;
  
  MNUtil.undoGrouping(() => {
    const task = focusNote.createChildNote({
      title: title
    });
    
    task.colorIndex = taskType.color;
    task.appendHtmlComment(
      "状态: 未开始",
      "状态: 未开始",
      16,
      "state"
    );
    
    task.focus();
    MNUtil.showHUD(`✅ 创建${taskType.name}: ${content}`);
  });
}
```

### 2. 状态管理系统

```javascript
// 任务状态流转
const taskStates = ["未开始", "进行中", "已完成", "已归档"];
const stateEmojis = ["😴", "🔥", "✅", "📦"];

// 切换任务状态
function toggleTaskState(note, forward = true) {
  const parsed = parseTaskTitle(note.noteTitle);
  if (!parsed) return;
  
  const currentIndex = taskStates.indexOf(parsed.status);
  if (currentIndex === -1) return;
  
  let newIndex;
  if (forward) {
    newIndex = (currentIndex + 1) % taskStates.length;
  } else {
    newIndex = currentIndex - 1;
    if (newIndex < 0) newIndex = taskStates.length - 1;
  }
  
  const newStatus = taskStates[newIndex];
  const newEmoji = stateEmojis[newIndex];
  
  MNUtil.undoGrouping(() => {
    // 更新标题
    note.noteTitle = `【${parsed.type}｜${newStatus}】${parsed.content}`;
    
    // 更新状态评论
    const stateComment = note.comments.find(c => 
      c.text && c.text.includes("状态:")
    );
    
    if (stateComment) {
      const index = note.comments.indexOf(stateComment);
      note.removeCommentByIndex(index);
      note.appendHtmlComment(
        `状态: ${newStatus} ${newEmoji}`,
        `状态: ${newStatus}`,
        16,
        "state"
      );
    }
    
    MNUtil.showHUD(`${newEmoji} ${newStatus}`);
  });
}
```

### 3. 今日任务系统

```javascript
// 标记为今日任务
function markAsToday(notes) {
  const today = new Date().toLocaleDateString();
  
  MNUtil.undoGrouping(() => {
    notes.forEach(note => {
      // 检查是否已有今日标记
      const hasTodayMark = note.comments.some(c => 
        c.text && c.text.includes("📅 今日")
      );
      
      if (!hasTodayMark) {
        note.appendHtmlComment(
          `📅 今日 (${today})`,
          `今日任务`,
          14,
          "today"
        );
        
        // 自动设为进行中
        const parsed = parseTaskTitle(note.noteTitle);
        if (parsed && parsed.status === "未开始") {
          toggleTaskState(note, true);
        }
      }
    });
    
    MNUtil.showHUD(`✅ 已标记 ${notes.length} 个今日任务`);
  });
}

// 获取今日任务
function getTodayTasks() {
  const notebook = MNNotebook.currentNotebook;
  if (!notebook) return [];
  
  const allNotes = notebook.notes;
  const today = new Date().toLocaleDateString();
  
  return allNotes.filter(note => {
    return note.comments.some(c => 
      c.text && c.text.includes(`📅 今日 (${today})`)
    );
  });
}
```

### 4. 学习要点

从 MNTask 我们可以学到：

1. **结构化数据**：使用特定格式存储信息（如 `【类型｜状态】内容`）
2. **状态管理**：通过评论系统持久化状态信息
3. **批量操作**：提供批量处理功能提高效率
4. **用户体验**：
   - 使用 emoji 增强视觉效果
   - 提供撤销功能
   - 实时反馈操作结果
5. **模块化设计**：将功能拆分为独立的函数

## 常见问题与调试

### 1. 插件无法加载（最常见）

#### 症状
- 插件出现在列表但无法勾选
- 插件安装后看不到
- MarginNote 闪退

#### 原因和解决方案

**1. 打包错误（80% 的问题）**
```bash
# ❌ 错误：会产生路径前缀
cd ..
zip -r plugin.mnaddon plugin-folder/*

# ✅ 正确：在插件目录内打包
cd plugin-folder
zip plugin.mnaddon *.js *.json *.png
```

**2. mnaddon.json 格式错误**
```json
// ❌ 错误：最后有逗号
{
  "addonid": "com.example.plugin",
  "name": "My Plugin",
  "version": "1.0.0",  // 这个逗号会导致解析失败
}

// ✅ 正确
{
  "addonid": "com.example.plugin",
  "name": "My Plugin",
  "version": "1.0.0"
}
```

**3. JavaScript 语法错误**
使用 Node.js 检查语法：
```bash
node -c main.js
```

### 2. "Can't find variable" 错误

#### 原因
- MNUtils 未安装或未加载
- 变量名拼写错误
- 加载顺序问题

#### 解决方案
```javascript
// 在使用前检查
if (typeof MNUtil === 'undefined') {
  alert("请先安装 MNUtils 插件");
  return;
}

// 检查拼写
// ❌ MNUtils.showHUD()  // 错误：应该是 MNUtil
// ✅ MNUtil.showHUD()   // 正确
```

### 3. self 引用错误（JSB 框架特有）

```javascript
// ❌ 永远不要这样做
myMethod: function() {
  let self = this;  // 在 JSB 中不起作用！
}

// ✅ 正确做法
const getMyPlugin = () => self;

myMethod: function() {
  let self = getMyPlugin();
}
```

### 4. 按钮不显示

#### 检查清单
1. 按钮是否正确注册？
2. 图标文件是否存在？
3. 菜单模板是否定义？
4. 缓存是否需要清理？

```javascript
// 强制刷新按钮
if (global.forceRefreshButtons) {
  global.forceRefreshButtons();
}
```

### 5. 调试技巧大全

#### 5.1 基础调试
```javascript
// 1. HUD 调试（用户可见）
MNUtil.showHUD(`变量值: ${myVar}`);

// 2. 日志调试（开发用）
if (typeof MNUtil !== "undefined" && MNUtil.log) {
  MNUtil.log("🔍 调试:", {
    variable: myVar,
    type: typeof myVar
  });
}

// 3. 复制到剪贴板查看
MNUtil.copyJSON({
  noteInfo: note,
  error: error.message
});
```

#### 5.2 高级调试
```javascript
// 1. 断点调试（使用 debugger 语句）
function myFunction() {
  debugger;  // 在 Safari 调试器中会暂停
  // 你的代码
}

// 2. 性能测试
const start = Date.now();
// 执行操作
const elapsed = Date.now() - start;
MNUtil.log(`操作耗时: ${elapsed}ms`);

// 3. 内存使用监控
const noteCount = MNNote.getFocusNotes().length;
if (noteCount > 1000) {
  MNUtil.showHUD("⚠️ 选中笔记过多，可能影响性能");
}
```

### 6. 常见陷阱和最佳实践

#### 6.1 异步操作陷阱
```javascript
// ❌ 错误：忘记 await
const result = MNUtil.input("输入", "", ["确定"]);
console.log(result);  // Promise 对象，不是结果！

// ✅ 正确：使用 await
const result = await MNUtil.input("输入", "", ["确定"]);
console.log(result);  // 实际的输入值
```

#### 6.2 内存泄漏
```javascript
// ❌ 错误：没有清理
sceneWillConnect: function() {
  this.timer = setInterval(() => {
    // 定时任务
  }, 1000);
}

// ✅ 正确：记得清理
sceneDidDisconnect: function() {
  if (this.timer) {
    clearInterval(this.timer);
  }
}
```

#### 6.3 错误处理
```javascript
// ❌ 错误：没有错误处理
const note = MNNote.getFocusNote();
note.noteTitle = "新标题";  // 如果 note 为 null 会崩溃

// ✅ 正确：防御性编程
const note = MNNote.getFocusNote();
if (note) {
  try {
    note.noteTitle = "新标题";
  } catch (error) {
    MNUtil.showHUD("操作失败: " + error.message);
  }
}
```

### 7. 性能优化建议

1. **批量操作使用撤销分组**
```javascript
// 一次撤销所有操作，而不是每个操作单独撤销
MNUtil.undoGrouping(() => {
  notes.forEach(note => {
    // 批量修改
  });
});
```

2. **避免频繁 UI 更新**
```javascript
// ❌ 错误：每次都更新 HUD
notes.forEach((note, index) => {
  note.colorIndex = 2;
  MNUtil.showHUD(`处理中 ${index + 1}/${notes.length}`);
});

// ✅ 正确：只在最后更新
notes.forEach(note => {
  note.colorIndex = 2;
});
MNUtil.showHUD(`✅ 处理完成 ${notes.length} 个笔记`);
```

3. **大数据集分批处理**
```javascript
async function processBatch(notes, batchSize = 50) {
  for (let i = 0; i < notes.length; i += batchSize) {
    const batch = notes.slice(i, i + batchSize);
    
    MNUtil.undoGrouping(() => {
      batch.forEach(note => {
        // 处理
      });
    });
    
    // 让 UI 有机会更新
    await MNUtil.delay(0.1);
  }
}
```

## 资源与下一步

### 1. 学习路径建议

#### 第一阶段：基础入门（1-2 周）
1. **掌握 JavaScript 基础**
   - 变量、函数、对象、数组
   - 条件判断、循环
   - 异步编程（async/await）

2. **熟悉 MNUtils API**
   - MNUtil 类的常用方法
   - MNNote 类的基本操作
   - Menu 类的使用

3. **创建第一个插件**
   - 简单的笔记处理功能
   - 基础的用户界面

#### 第二阶段：进阶开发（2-4 周）
1. **学习 MNToolbar 架构**
   - 理解注册表模式
   - 创建自定义按钮
   - 实现复杂菜单

2. **深入 MNTask 源码**
   - 学习状态管理
   - 理解数据持久化
   - 掌握批量操作

3. **开发实用功能**
   - 模板系统
   - 批处理工具
   - 与外部工具集成

#### 第三阶段：高级应用（1-2 月）
1. **研究 MN ChatAI**
   - 多控制器架构
   - WebView 集成
   - 网络请求处理

2. **性能优化**
   - 大数据处理
   - 内存管理
   - UI 响应优化

3. **创新功能**
   - AI 集成
   - 云同步
   - 团队协作

### 2. 推荐资源

#### 官方资源
- [MarginNote 官网](https://www.marginnote.com/)
- [MarginNote 论坛](https://bbs.marginnote.cn/)

#### 开源项目（学习范例）
1. **MNUtils** - 核心 API 框架
   - 路径：`mnutils/`
   - 学习重点：API 设计、框架架构

2. **MNToolbar** - 工具栏插件
   - 路径：`mntoolbar/`
   - 学习重点：UI 开发、按钮系统

3. **MNTask** - 任务管理插件
   - 路径：`mntask/`
   - 学习重点：数据管理、状态系统

4. **MN ChatAI** - AI 对话插件
   - 路径：`mnai/`
   - 学习重点：高级架构、网络集成

#### JavaScript 学习资源
- [MDN Web Docs](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript) - 权威的 JavaScript 文档
- [JavaScript.info](https://zh.javascript.info/) - 现代 JavaScript 教程
- [ES6 入门教程](https://es6.ruanyifeng.com/) - 阮一峰的 ES6 教程

#### 开发工具
1. **代码编辑器**
   - VS Code（推荐）
   - Sublime Text
   - WebStorm

2. **调试工具**
   - Safari Web Inspector (macOS)
   - Chrome DevTools

3. **辅助工具**
   - mnaddon4 - 插件打包工具
   - Prettier - 代码格式化
   - ESLint - 代码检查

### 3. 社区和支持

#### 获取帮助
1. **MarginNote 论坛**
   - 发帖提问
   - 搜索已有答案
   - 分享你的插件

2. **GitHub Issues**
   - 报告 bug
   - 请求新功能
   - 贡献代码

3. **即时通讯群**
   - QQ 群
   - Telegram 群
   - Discord 服务器

#### 贡献指南
1. Fork 项目
2. 创建功能分支
3. 提交代码
4. 发起 Pull Request

### 4. 下一步行动

#### 立即开始
1. **安装 MNUtils**
   - 这是所有插件开发的基础

2. **复制示例代码**
   - 从本教程中复制代码
   - 创建你的第一个插件

3. **修改现有插件**
   - 下载 MNToolbar
   - 添加一个自定义按钮
   - 实现一个简单功能

#### 短期目标（1 个月内）
1. 开发 3-5 个小插件
2. 为现有插件贡献代码
3. 在论坛分享你的作品

#### 长期规划
1. 开发一个完整的插件
2. 成为社区贡献者
3. 帮助其他新手入门

### 5. 常用代码片段库

保存这些代码片段，加快你的开发速度：

```javascript
// 1. 插件模板
JSB.newAddon = function(mainPath) {
  JSB.require('mnutils');
  
  var MyPlugin = JSB.defineClass('MyPlugin : JSExtension', {
    sceneWillConnect: function() {
      MNUtil.showHUD("插件已启动");
    }
  });
  
  return MyPlugin;
};

// 2. 获取焦点笔记（带检查）
const focusNote = MNNote.getFocusNote();
if (!focusNote) {
  MNUtil.showHUD("请先选择笔记");
  return;
}

// 3. 批量操作模板
const notes = MNNote.getFocusNotes();
MNUtil.undoGrouping(() => {
  notes.forEach(note => {
    // 你的操作
  });
  MNUtil.showHUD(`✅ 处理了 ${notes.length} 个笔记`);
});

// 4. 用户输入
const input = await MNUtil.input("标题", "提示", ["确定"]);
if (input) {
  // 处理输入
}

// 5. 选择菜单
const options = ["选项1", "选项2", "选项3"];
const selected = await MNUtil.userSelect("选择", "", options);
if (selected > 0) {
  const choice = options[selected - 1];
}

// 6. 错误处理
try {
  // 危险操作
} catch (error) {
  MNUtil.showHUD("错误: " + error.message);
  if (MNUtil.log) {
    MNUtil.log("错误详情:", error);
  }
}
```

## 结语

恭喜你完成了这个教程！现在你已经掌握了 MarginNote 插件开发的基础知识。记住：

1. **从简单开始** - 不要一开始就尝试复杂功能
2. **多看源码** - MNUtils、MNToolbar、MNTask 都是很好的学习材料
3. **勤于实践** - 动手写代码是最好的学习方式
4. **敢于尝试** - 不要害怕出错，每个错误都是学习机会
5. **乐于分享** - 把你的作品分享给社区

MarginNote 插件开发是一个充满创造力的领域。通过开发插件，你不仅能提升自己的学习效率，还能帮助全球的 MarginNote 用户。

祝你在插件开发的道路上越走越远！🚀

---

*本教程基于 MN-Addon 项目编写，特别感谢 MNUtils、MNToolbar、MNTask 和 MN ChatAI 的开发者们。*