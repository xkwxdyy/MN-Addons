# MarginNote 插件开发新手教程 - 从零开始到独立开发

> 本教程专为没有 JavaScript 基础的 MarginNote 用户设计，通过实际案例让你快速掌握插件开发。

## 📚 目录

1. [前言 - 为什么要学习插件开发](#前言---为什么要学习插件开发)
   - 插件能做什么 | 学习路线图
2. [JavaScript 必备基础](#javascript-必备基础)（⭐ 新手必读）
   - 变量 | 字符串 | 数组 | 对象 | 函数 | 条件判断
3. [MarginNote 插件结构](#marginnote-插件结构)
   - 插件入口 | 生命周期 | JSB 框架
4. [MNUtils API 入门](#mnutils-api-入门)（⭐ 核心内容）
   - 什么是 MNUtils | 常用 API | 实战示例
5. [开发你的第一个按钮](#开发你的第一个按钮)（🚀 快速上手）
   - 三步添加按钮 | 实战示例 | 调试技巧
6. [插件文件处理](#插件文件处理)
   - 打包方法 | 安装调试 | 常见错误
7. [进阶功能开发](#进阶功能开发)
   - 评论管理 | 链接管理 | 批量处理 | 模板系统
8. [MNTask 案例学习](#mntask-案例学习)
   - 任务卡片 | 状态管理 | 学习要点
9. [常见问题与调试](#常见问题与调试)（🔧 遇到问题看这里）
   - 常见错误 | 调试技巧 | 性能优化
10. [资源与下一步](#资源与下一步)
    - 学习路径 | 推荐资源 | 社区支持

## 前言 - 为什么要学习插件开发

MarginNote 的插件系统让你能够：
- 🚀 自定义工作流程，提高学习效率
- 🎯 实现特定需求，如批量处理、自动化操作
- 💡 整合外部工具，如 AI、网络服务等
- 🛠️ 修改现有插件，适配个人需求

### 🗺️ 学习路线图（新手必看）

```
第 1-3 天：JavaScript 基础
  ↓ 学习变量、字符串、数组（章节2）
第 4-5 天：理解插件结构
  ↓ 了解插件如何运行（章节3）
第 6-7 天：熟悉 MNUtils API
  ↓ 掌握核心 API 使用（章节4）
第 8-10 天：创建第一个按钮 ⭐
  ↓ 动手实践，建立信心（章节5）
第 11-15 天：开发实用功能
  ↓ 批量处理、模板等（章节7）
第 16-21 天：学习优秀案例
  ↓ 研究 MNTask 源码（章节8）
```

> 💡 **新手建议**：不要试图一次学完所有内容。按照路线图循序渐进，每完成一个阶段就动手实践一下。

## JavaScript 必备基础

> 💡 **为什么要学 JavaScript？**  
> 想象一下，MarginNote 就像一个功能强大的笔记本，而 JavaScript 就是让你能在这个笔记本上"施展魔法"的咒语。通过 JavaScript，你可以让 MarginNote 按照你的想法自动工作。

### 1. 从一个实际需求开始

假设你想给所有重要的笔记加上红色标记，手动操作需要：
1. 找到每个笔记
2. 点击颜色按钮
3. 选择红色
4. 重复...重复...重复...😓

用插件只需要一行"魔法咒语"：
```javascript
focusNote.colorIndex = 6;  // 瞬间变红！
```

但是等等，`focusNote` 是什么？`colorIndex` 又是什么？别急，让我们一步步来理解。

### 2. 变量 - 给东西起名字

在生活中，我们会说"把**那本书**递给我"。在 JavaScript 中，我们需要先给"那本书"起个名字：

```javascript
// 用 let 声明一个可以改变的变量（就像用铅笔写字）
let myBook = "JavaScript 入门";
myBook = "JavaScript 进阶";  // ✅ 可以改！

// 用 const 声明一个不能改变的常量（就像用钢笔写字）
const myName = "小明";
myName = "小红";  // ❌ 错误！const 声明的不能改
```

**在插件中的实际应用：**
```javascript
// 获取当前选中的笔记，存到 focusNote 变量里
const focusNote = MNNote.getFocusNote();

// 如果你想保存原始标题以便后续恢复
let originalTitle = focusNote.noteTitle;
```

> 🎯 **小贴士**：用 `const` 还是 `let`？  
> - 如果这个值后面不会变，用 `const`（比如获取的笔记对象）
> - 如果这个值可能会变，用 `let`（比如计数器、临时标题等）

### 3. 字符串 - 处理文字

字符串就是文本，用引号包起来：

```javascript
// 三种引号都可以
let text1 = "双引号";
let text2 = '单引号';
let text3 = `反引号（模板字符串）`;
```

**为什么有三种？看看实际应用：**

```javascript
// 场景1：在笔记标题前加上标记
let noteTitle = "重要会议";
let markedTitle = "【待办】" + noteTitle;  // 结果："【待办】重要会议"

// 场景2：显示处理进度（这时模板字符串就很方便）
let processed = 5;
let total = 10;
let progress = `已处理 ${processed}/${total} 个笔记`;  // "已处理 5/10 个笔记"
```

**常用的文字处理技巧：**
```javascript
let title = "  TODO: 完成作业  ";

// 去掉首尾空格
title = title.trim();  // "TODO: 完成作业"

// 检查是否包含某个词
if (title.includes("TODO")) {
  // 替换文字
  title = title.replace("TODO", "DONE");  // "DONE: 完成作业"
}

// 在插件中的实际应用
const focusNote = MNNote.getFocusNote();
if (focusNote && focusNote.noteTitle.includes("重要")) {
  focusNote.colorIndex = 6;  // 包含"重要"的笔记标记为红色
}
```

### 4. 数组 - 管理多个东西

想象数组就像一个有编号的储物柜：

```javascript
// 创建一个标签列表
let tags = ["重要", "复习", "考试"];
//  位置：    0      1      2     （位置从 0 开始数！）

// 获取第一个标签
let firstTag = tags[0];  // "重要"

// 添加新标签
tags.push("紧急");  // 在末尾添加 → ["重要", "复习", "考试", "紧急"]
```

**在插件开发中，数组最常用于处理多个笔记：**

```javascript
// 获取所有选中的笔记
const selectedNotes = MNNote.getFocusNotes();
console.log(`选中了 ${selectedNotes.length} 个笔记`);

// 场景1：给所有选中的笔记加上黄色
selectedNotes.forEach(note => {
  note.colorIndex = 3;  // 3 是黄色
});

// 场景2：找出所有包含"TODO"的笔记
const todoNotes = selectedNotes.filter(note => 
  note.noteTitle.includes("TODO")
);

// 场景3：获取所有笔记的标题
const titles = selectedNotes.map(note => note.noteTitle);
// 如果选中了3个笔记，titles 可能是：["笔记1", "笔记2", "笔记3"]
```

> 💡 **数组方法速记**：
> - `forEach` = 对每个元素做点什么（遍历）
> - `filter` = 筛选出符合条件的（过滤）
> - `map` = 把每个元素转换成别的东西（映射）
> - `find` = 找到第一个符合条件的（查找）

### 5. 对象 - 描述复杂的东西

如果说数组是"有序的列表"，那对象就是"有名字的属性集合"：

```javascript
// 描述一本书的信息
let book = {
  title: "JavaScript 入门",
  author: "张三",
  pages: 200,
  isRead: true
};

// 获取信息
console.log(book.title);        // "JavaScript 入门"
console.log(book["author"]);    // "张三"（另一种写法）

// 修改信息
book.pages = 250;               // 修改页数
book.publisher = "清华出版社";   // 添加新属性
```

**在插件中，对象无处不在：**
```javascript
// 笔记对象包含了各种属性
const focusNote = MNNote.getFocusNote();
if (focusNote) {
  console.log(focusNote.noteTitle);    // 标题
  console.log(focusNote.noteId);       // 唯一ID
  console.log(focusNote.colorIndex);   // 颜色编号
  console.log(focusNote.tags);         // 标签数组
}

// 创建菜单时，用对象描述菜单结构
const menuConfig = {
  action: "menu",
  menuItems: [
    {
      action: "copyTitle",
      menuTitle: "📋 复制标题"
    },
    {
      action: "changeColor",
      menuTitle: "🎨 改变颜色"
    }
  ]
};
```

> 🔑 **理解对象的关键**：把对象想象成一个"资料卡"，上面记录了各种相关信息。

### 6. 函数 - 可重复使用的魔法

函数就像一个"魔法配方"，定义一次，可以反复使用：

```javascript
// 定义一个"把笔记变红"的函数
function makeNoteRed(note) {
  note.colorIndex = 6;  // 6 是红色
  MNUtil.showHUD("已标记为红色！");
}

// 使用这个函数
const myNote = MNNote.getFocusNote();
if (myNote) {
  makeNoteRed(myNote);  // 调用函数
}
```

**现代 JavaScript 更喜欢用箭头函数：**
```javascript
// 传统函数写法
function addPrefix(title) {
  return "【重要】" + title;
}

// 箭头函数写法（在插件中更常见）
const addPrefix = (title) => {
  return "【重要】" + title;
};

// 如果函数体只有一行，可以更简洁
const addPrefix = title => "【重要】" + title;

// 实际应用：批量处理笔记
const markAsImportant = (notes) => {
  notes.forEach(note => {
    note.noteTitle = addPrefix(note.noteTitle);
    note.colorIndex = 6;  // 红色
  });
};
```

### 7. 条件判断 - 让插件更智能

程序需要根据不同情况做不同的事：

```javascript
// 基本的 if-else
const focusNote = MNNote.getFocusNote();

if (focusNote) {
  // 有选中笔记时
  MNUtil.showHUD(`正在处理：${focusNote.noteTitle}`);
} else {
  // 没有选中时
  MNUtil.showHUD("请先选择一个笔记！");
  return;  // 提前结束
}

// 多重条件
if (focusNote.colorIndex === 0) {
  MNUtil.showHUD("这是个无色笔记");
} else if (focusNote.colorIndex === 6) {
  MNUtil.showHUD("这是个红色笔记");
} else {
  MNUtil.showHUD("这是其他颜色的笔记");
}
```

**实用技巧 - 短路逻辑：**
```javascript
// && (AND) - 所有条件都要满足
if (focusNote && focusNote.noteTitle && focusNote.noteTitle.includes("TODO")) {
  // 安全地检查：笔记存在 且 有标题 且 标题包含TODO
}

// || (OR) - 任一条件满足即可
if (!focusNote || focusNote.colorIndex === 0) {
  MNUtil.showHUD("请选择一个有颜色的笔记");
}

// 三元运算符 - 简洁的条件判断
const message = focusNote ? "已选中笔记" : "未选中笔记";
```

### 8. 异步操作 - 等待用户输入

有些操作需要时间，比如等待用户输入：

```javascript
// async/await 让异步代码看起来像同步的
async function askUserForTitle() {
  // await 表示"等待"这个操作完成
  const newTitle = await MNUtil.input("请输入新标题", "标题", ["确定"]);
  
  if (newTitle) {
    const focusNote = MNNote.getFocusNote();
    if (focusNote) {
      focusNote.noteTitle = newTitle;
      MNUtil.showHUD("标题已更新！");
    }
  }
}

// 调用异步函数
askUserForTitle();  // 注意：不需要 await，除非在另一个 async 函数中
```

### 🎯 快速实战：你的第一个完整功能（新手信心提升）

学了这么多，让我们立即实战！下面是一个完整的小功能，你可以直接复制使用：

```javascript
// 功能：给选中的笔记添加时间戳
async function addTimestamp() {
  // 1. 获取选中的笔记
  const focusNote = MNNote.getFocusNote();
  
  // 2. 检查是否有选中
  if (!focusNote) {
    MNUtil.showHUD("❌ 请先选择一个笔记");
    return;
  }
  
  // 3. 获取当前时间
  const now = new Date();
  const timestamp = now.toLocaleString('zh-CN');
  
  // 4. 在标题前添加时间戳
  const oldTitle = focusNote.noteTitle;
  const newTitle = `[${timestamp}] ${oldTitle}`;
  
  // 5. 使用撤销分组（让用户可以一键撤销）
  MNUtil.undoGrouping(() => {
    focusNote.noteTitle = newTitle;
    focusNote.colorIndex = 3;  // 设为黄色
    focusNote.appendTextComment(`原标题：${oldTitle}`);
  });
  
  // 6. 显示成功消息
  MNUtil.showHUD("✅ 已添加时间戳");
}

// 执行函数
addTimestamp();
```

> 💡 **恭喜！** 你刚刚完成了一个包含所有基础知识的实用功能：
> - ✅ 使用了变量存储数据
> - ✅ 使用了对象属性（focusNote.noteTitle）
> - ✅ 使用了条件判断（if 语句）
> - ✅ 使用了字符串处理（模板字符串）
> - ✅ 使用了函数封装功能
> - ✅ 使用了错误处理（检查 focusNote）

### 9. 错误处理 - 让插件更稳定

即使是最好的代码也可能出错，所以要做好准备：

```javascript
// 使用 try-catch 捕获错误
async function safeProcessNote() {
  try {
    const focusNote = MNNote.getFocusNote();
    if (!focusNote) {
      throw new Error("没有选中笔记");  // 主动抛出错误
    }
    
    focusNote.noteTitle = "新标题";
    MNUtil.showHUD("✅ 处理成功");
    
  } catch (error) {
    // 错误时显示友好的提示
    MNUtil.showHUD(`❌ 操作失败：${error.message}`);
  }
}
```

**防御式编程 - 提前检查：**
```javascript
function processNotes(notes) {
  // 提前检查参数
  if (!notes || notes.length === 0) {
    MNUtil.showHUD("没有要处理的笔记");
    return;
  }
  
  // 安全地处理每个笔记
  notes.forEach(note => {
    if (note && note.noteTitle) {  // 双重检查
      note.noteTitle = `[已处理] ${note.noteTitle}`;
    }
  });
  
  MNUtil.showHUD(`✅ 成功处理 ${notes.length} 个笔记`);
}
```

### 10. 把知识串起来 - 第一个完整功能

现在让我们用学到的知识写一个实用的功能：

```javascript
// 功能：批量整理TODO笔记
async function organizeTodoNotes() {
  try {
    // 1. 获取所有选中的笔记（数组）
    const selectedNotes = MNNote.getFocusNotes();
    
    // 2. 检查是否有选中（条件判断）
    if (!selectedNotes || selectedNotes.length === 0) {
      MNUtil.showHUD("请先选择要整理的笔记");
      return;
    }
    
    // 3. 筛选出TODO笔记（数组方法）
    const todoNotes = selectedNotes.filter(note => 
      note.noteTitle.includes("TODO")
    );
    
    // 4. 询问用户操作（异步）
    const action = await MNUtil.userSelect(
      "选择操作", 
      "", 
      ["标记为完成", "设为紧急", "添加今日标签"]
    );
    
    // 5. 根据选择执行操作（条件判断）
    if (action === 0) return;  // 用户取消
    
    // 6. 批量处理（函数 + 循环）
    MNUtil.undoGrouping(() => {
      todoNotes.forEach(note => {
        switch (action) {
          case 1:  // 标记为完成
            note.noteTitle = note.noteTitle.replace("TODO", "DONE");
            note.colorIndex = 8;  // 绿色
            break;
          case 2:  // 设为紧急
            note.noteTitle = "🔥 " + note.noteTitle;
            note.colorIndex = 6;  // 红色
            break;
          case 3:  // 添加今日标签
            note.appendTags([`📅 ${new Date().toLocaleDateString()}`]);
            break;
        }
      });
    });
    
    // 7. 显示结果（字符串模板）
    MNUtil.showHUD(`✅ 成功处理 ${todoNotes.length} 个TODO笔记`);
    
  } catch (error) {
    // 8. 错误处理
    MNUtil.showHUD(`❌ 出错了：${error.message}`);
  }
}

// 运行这个函数
organizeTodoNotes();
```

> 🎉 **恭喜你！**  
> 如果你能理解上面这个函数，你已经掌握了 MarginNote 插件开发所需的 JavaScript 基础。接下来，让我们看看如何把这些知识应用到实际的插件开发中。

## MarginNote 插件结构

> 🏗️ **插件 = 配置文件 + 代码文件 + 资源文件**  
> 就像盖房子需要图纸、材料和工具，MarginNote 插件也由这三部分组成。

### 1. 插件的"身份证" - 文件结构

```
my-plugin/                  # 你的插件文件夹
├── 📄 main.js             # 插件的"大脑"（必需）
├── 📋 mnaddon.json        # 插件的"身份证"（必需）
├── 🎨 logo.png            # 插件的"头像"44×44像素（必需）
├── 🔧 utils.js            # 工具箱（可选）
└── 📁 resources/          # 资源文件夹（可选）
    ├── images/            # 图片资源
    └── html/              # 网页文件
```

### 2. mnaddon.json - 插件配置文件

这个文件告诉 MarginNote 你的插件是谁：

```json
{
  "addonid": "com.example.myplugin",     // 唯一ID，像身份证号
  "name": "我的第一个插件",                // 显示名称
  "author": "你的名字",                    // 作者
  "version": "1.0.0",                     // 版本号
  "marginnote_version_min": "3.7.0",      // 最低支持的 MN 版本
  "cert_key": ""                          // 认证密钥（留空即可）
}
```

> 💡 **版本号规则**：主版本.次版本.修订版本  
> - 1.0.0 → 1.0.1（修复bug）  
> - 1.0.0 → 1.1.0（新功能）  
> - 1.0.0 → 2.0.0（大改版）

### 3. 插件生命周期 - 从出生到消亡

根据 mntoolbar_learning 的详细注释，插件的生命周期就像人的一生：

```
🚀 插件工厂函数 JSB.newAddon(mainPath)
         │
         ├─ 📦 加载依赖模块
         │    └─ JSB.require('utils')
         │
         ├─ 🔍 检查 MNUtils（如果需要）
         │    └─ 确保必要的依赖存在
         │
         └─ 🎯 定义插件类
              │
              ├─ 🌟 sceneWillConnect (出生)
              │    ├─ 初始化插件核心
              │    ├─ 设置初始状态
              │    └─ 注册事件监听器
              │
              ├─ 📚 notebookWillOpen (开始工作)
              │    ├─ 创建用户界面
              │    ├─ 加载配置
              │    └─ 准备工具栏
              │
              ├─ 🎮 用户交互阶段
              │    ├─ onPopupMenuOnNote
              │    ├─ onPopupMenuOnSelection
              │    └─ 自定义功能执行
              │
              ├─ 📕 notebookWillClose (准备休息)
              │    ├─ 保存用户数据
              │    └─ 清理临时资源
              │
              └─ 🌅 sceneDidDisconnect (结束)
                   ├─ 移除事件监听
                   └─ 释放所有资源
```

### 4. main.js - 插件主文件详解

基于 mntoolbar_learning 的深入理解，这是一个完整的插件框架：

```javascript
/**
 * 🚀 插件工厂函数 - MarginNote 插件系统的入口
 * 
 * 当 MarginNote 加载插件时会调用这个函数
 * @param {string} mainPath - 插件的安装路径
 */
JSB.newAddon = function(mainPath) {
  // 📦 第一步：加载依赖（如果有）
  // JSB.require('utils');  // 加载工具模块
  
  // 🎯 第二步：获取插件单例的辅助函数（JSB 框架特殊要求）
  const getMyPlugin = () => self;
  
  /**
   * 📱 定义插件主类
   * 继承自 JSExtension，获得生命周期方法
   */
  var MyPlugin = JSB.defineClass('MyPlugin : JSExtension', {
    
    /**
     * 🌟 场景即将连接 - 插件生命周期的开始
     * 调用时机：打开 MarginNote、创建新窗口、从后台恢复
     */
    sceneWillConnect: function() {
      // 获取插件实例（必须第一行）
      let self = getMyPlugin();
      
      // 初始化插件状态
      self.isReady = false;
      self.selectedText = "";
      
      // 显示启动消息
      MNUtil.showHUD("🚀 插件已启动");
      
      // 注册事件监听器（观察者模式）
      // 参数：(观察者, 方法名, 通知名)
      MNUtil.addObserver(self, 'onPopupMenuOnNote:', 'PopupMenuOnNote');
      MNUtil.addObserver(self, 'onPopupMenuOnSelection:', 'PopupMenuOnSelection');
    },
    
    /**
     * 🌅 场景已断开连接 - 清理资源
     * 调用时机：关闭插件、关闭窗口
     */
    sceneDidDisconnect: function() {
      // 安全检查
      if (typeof MNUtil === 'undefined') return;
      
      let self = getMyPlugin();
      
      // 移除所有监听器（防止内存泄漏）
      MNUtil.removeObserver(self, 'PopupMenuOnNote');
      MNUtil.removeObserver(self, 'PopupMenuOnSelection');
      
      // 清理其他资源
      self.isReady = false;
    },
    
    /**
     * 📚 笔记本即将打开
     * 调用时机：用户打开笔记本、切换笔记本
     */
    notebookWillOpen: function(notebookId) {
      let self = getMyPlugin();
      
      // 记录当前笔记本
      self.currentNotebookId = notebookId;
      
      // 延迟初始化（给界面时间完全加载）
      MNUtil.delay(0.5).then(() => {
        self.isReady = true;
        MNUtil.showHUD("📚 笔记本已就绪");
      });
    },
    
    /**
     * 📝 笔记弹出菜单事件
     * 当用户点击笔记卡片弹出菜单时触发
     */
    onPopupMenuOnNote: function(sender) {
      // 参数验证（防御式编程）
      if (!sender || !sender.userInfo || !sender.userInfo.note) return;
      
      let self = getMyPlugin();
      let note = sender.userInfo.note;
      
      // 添加自定义菜单项
      sender.userInfo.menuController.commandTable.push({
        title: "🎨 改变颜色",
        object: self,
        selector: "changeNoteColor:",
        param: note.noteId
      });
      
      sender.userInfo.menuController.commandTable.push({
        title: "📋 复制标题",
        object: self,
        selector: "copyNoteTitle:",
        param: note.noteId
      });
    },
    
    /**
     * ✏️ 选中文本弹出菜单事件
     */
    onPopupMenuOnSelection: function(sender) {
      if (!sender || !sender.userInfo) return;
      
      let self = getMyPlugin();
      
      // 保存选中的文本
      self.selectedText = sender.userInfo.documentController.selectionText;
      
      // 添加菜单项
      sender.userInfo.menuController.commandTable.push({
        title: "🔍 搜索选中文本",
        object: self,
        selector: "searchSelectedText:",
        param: self.selectedText
      });
    },
    
    // ========== 自定义功能实现 ==========
    
    /**
     * 改变笔记颜色
     */
    changeNoteColor: function(noteId) {
      let self = getMyPlugin();
      const note = MNNote.new(noteId);
      
      if (!note) {
        MNUtil.showHUD("❌ 找不到笔记");
        return;
      }
      
      // 使用撤销分组（用户可以撤销）
      MNUtil.undoGrouping(() => {
        // 循环切换颜色（0-15）
        note.colorIndex = (note.colorIndex + 1) % 16;
        
        // 颜色名称映射
        const colorNames = ["无色", "淡黄", "淡蓝", "黄色", "深蓝", 
                          "橙色", "红色", "紫色", "淡绿", "深绿",
                          "灰色", "深橙", "棕色", "深红", "深紫", "深灰"];
        
        MNUtil.showHUD(`🎨 已改为${colorNames[note.colorIndex]}`);
      });
    },
    
    /**
     * 复制笔记标题
     */
    copyNoteTitle: function(noteId) {
      const note = MNNote.new(noteId);
      if (!note) return;
      
      MNUtil.copy(note.noteTitle);
      MNUtil.showHUD("📋 已复制标题");
    },
    
    /**
     * 搜索选中文本
     */
    searchSelectedText: function(text) {
      if (!text) return;
      
      // 在当前笔记本中搜索
      const notebook = MNNotebook.currentNotebook;
      if (!notebook) return;
      
      // 这里可以实现搜索逻辑
      MNUtil.showHUD(`🔍 搜索"${text}"...`);
    }
  });
  
  // 返回插件类供 MarginNote 管理
  return MyPlugin;
};
```

### 5. JSB 框架的特殊规则

#### ⚠️ self 引用陷阱（最容易犯的错误）

在标准 JavaScript 中，`this` 指向当前对象。但在 JSB 框架中，情况完全不同：

```javascript
// ❌ 永远不要在 JSB.defineClass 的方法中这样做
myMethod: function() {
  let self = this;  // 这在 JSB 中获取不到正确的实例！
  self.someProperty = "value";  // 会报错
}

// ✅ 正确的做法（来自 mntoolbar_learning）
const getMyPlugin = () => self;  // 在文件顶部定义

myMethod: function() {
  let self = getMyPlugin();  // 通过函数获取实例
  self.someProperty = "value";  // 正常工作
}
```

**为什么会这样？**
- JSB 是 JavaScript Bridge，桥接了 JS 和 Objective-C
- `this` 的行为被修改以适应原生框架
- `self` 是 JSB 提供的全局变量，指向插件实例

### 6. 事件驱动架构

MarginNote 插件采用观察者模式，通过 NSNotificationCenter 实现：

```javascript
// 注册观察者
MNUtil.addObserver(self, 'onEventName:', 'NotificationName');

// 事件触发时，会调用 onEventName: 方法
onEventName: function(sender) {
  // sender.userInfo 包含事件数据
}

// 记得在 sceneDidDisconnect 中移除
MNUtil.removeObserver(self, 'NotificationName');
```

**常用事件列表：**
- `PopupMenuOnNote` - 笔记菜单弹出
- `PopupMenuOnSelection` - 文本选择菜单弹出
- `ProcessNewExcerpt` - 新建摘录
- `ChangeExcerptRange` - 修改摘录范围
- `ClosePopupMenuOnNote` - 关闭笔记菜单

> 🎯 **最佳实践**：
> 1. 总是在 `sceneWillConnect` 中注册监听器
> 2. 总是在 `sceneDidDisconnect` 中移除监听器
> 3. 事件处理方法开头进行参数验证
> 4. 使用 try-catch 保护事件处理逻辑

## MNUtils API 入门 - 让插件"活"起来

### 🎯 学习目标

完成本章后，你将能够：
- ✅ 与用户进行各种交互（显示消息、获取输入）
- ✅ 操作笔记（获取、修改、批量处理）
- ✅ 使用高级功能（剪贴板、菜单、文件操作）

### 开始之前：安装 MNUtils

MNUtils 就像是插件开发的"瑞士军刀"，提供了 300+ 个实用工具。首先需要确保它可用：

```javascript
JSB.newAddon = function(mainPath) {
  // 加载 MNUtils
  JSB.require('mnutils');
  
  var MyPlugin = JSB.defineClass('MyPlugin : JSExtension', {
    sceneWillConnect: function() {
      // 检查 MNUtils 是否可用
      if (typeof MNUtil === 'undefined') {
        alert("请先安装 MNUtils 插件");
        return;
      }
      
      // 可以开始使用了！
      MNUtil.showHUD("插件已启动");
    }
  });
  
  return MyPlugin;
};
```

> 💡 **新手提示**：MNUtils 是一个独立的插件，需要先从插件商店安装。安装后，其他插件就可以使用它提供的功能了。

### 第一站：与用户对话（让插件有反馈）

想象一下，如果插件默默工作，用户完全不知道发生了什么，体验会很糟糕。所以第一步，我们要学会"说话"。

#### 🗨️ 最简单的开始 - showHUD

`showHUD` 就像手机上的通知提示，简单但很有用：

```javascript
// 告诉用户发生了什么
MNUtil.showHUD("✅ 操作成功！");     // 默认显示 2 秒

// 处理耗时操作时
MNUtil.showHUD("⏳ 正在处理...", 5);  // 显示 5 秒

// 遇到错误时
MNUtil.showHUD("❌ 操作失败：请先选择笔记", -1);  // 需要手动关闭
```

> 💡 **什么时候用？**
> - 操作完成时：给用户一个反馈
> - 开始处理时：让用户知道插件在工作
> - 出错时：告诉用户哪里出了问题

#### 🤔 让用户做选择 - confirm

有时候我们需要用户确认，特别是删除等危险操作：

```javascript
async function deleteNotes() {
  // 先问问用户是否确定
  const confirmed = await MNUtil.confirm(
    "确认删除？", 
    "将删除所有选中的笔记，此操作不可恢复"
  );
  
  if (confirmed) {
    // 用户点了"确定"
    MNUtil.showHUD("正在删除...");
    // 执行删除操作
  } else {
    // 用户点了"取消"
    MNUtil.showHUD("已取消");
  }
}
```

#### ✍️ 获取用户输入 - input

需要用户输入文字时：

```javascript
async function renameNote() {
  const focusNote = MNNote.getFocusNote();
  if (!focusNote) {
    MNUtil.showHUD("请先选择笔记");
    return;
  }
  
  // 获取新标题
  const newTitle = await MNUtil.input(
    "重命名笔记",
    "请输入新的标题",
    ["确定"]  // 按钮文字
  );
  
  if (newTitle) {
    // 用户输入了内容
    MNUtil.undoGrouping(() => {
      focusNote.noteTitle = newTitle;
    });
    MNUtil.showHUD("✅ 已重命名");
  }
}
```

#### 📋 多项选择 - userSelect

当有多个选项让用户选择时：

```javascript
async function changeNoteColor() {
  const colorOptions = [
    "🔴 红色 - 重要",
    "🟡 黄色 - 注意", 
    "🔵 蓝色 - 信息",
    "🟢 绿色 - 完成"
  ];
  
  const selected = await MNUtil.userSelect(
    "选择颜色",
    "给笔记设置什么颜色？",
    colorOptions
  );
  
  if (selected > 0) {  // 0 表示取消
    const colorMap = {1: 6, 2: 3, 3: 2, 4: 8};  // 选项对应的颜色索引
    const focusNote = MNNote.getFocusNote();
    
    if (focusNote) {
      MNUtil.undoGrouping(() => {
        focusNote.colorIndex = colorMap[selected];
      });
      MNUtil.showHUD(`✅ 已设置为${colorOptions[selected - 1]}`);
    }
  }
}
```

#### 🎯 新手任务：创建一个问候插件

把上面学到的组合起来，创建你的第一个交互式功能：

```javascript
async function greetUser() {
  // 1. 获取用户名字
  const name = await MNUtil.input("你好！", "请问怎么称呼你？", ["确定"]);
  
  if (!name) {
    MNUtil.showHUD("👋 下次见！");
    return;
  }
  
  // 2. 询问需求
  const needs = [
    "📝 整理笔记",
    "🎨 批量改色",
    "🏷️ 添加标签",
    "🔗 创建链接"
  ];
  
  const selected = await MNUtil.userSelect(
    `你好，${name}！`,
    "需要什么帮助？",
    needs
  );
  
  // 3. 根据选择给出反馈
  if (selected > 0) {
    MNUtil.showHUD(`✅ 明白了！让我们开始${needs[selected - 1]}`);
    // 这里可以调用相应的功能
  }
}
```

> 🎉 **恭喜！** 你已经学会了与用户交互的所有基本方法。现在你的插件可以"说话"、"提问"、"倾听"了！

### 第二站：操作笔记（你的主要工作对象）

笔记是 MarginNote 的核心，也是插件最常操作的对象。让我们像搭积木一样，一步步学会操作它们。

#### 🎯 第一步：找到要操作的笔记

在操作笔记之前，我们需要先"拿到"它。就像你要修改一份文件，得先找到这个文件。

```javascript
// 最常用：获取用户当前选中的笔记
const focusNote = MNNote.getFocusNote();

// 始终要检查是否真的拿到了
if (!focusNote) {
  MNUtil.showHUD("❌ 请先选择一个笔记");
  return;
}

// 现在可以安全地使用了
MNUtil.showHUD(`✅ 找到了：${focusNote.noteTitle}`);
```

> 💡 **为什么要检查？**  
> 用户可能没有选中任何笔记就点击了你的按钮。如果不检查就直接操作，插件会崩溃。记住：**永远不要假设笔记存在**。

#### 📚 批量获取：处理多个笔记

有时候需要同时处理多个笔记：

```javascript
// 获取所有选中的笔记
const selectedNotes = MNNote.getFocusNotes();

if (selectedNotes.length === 0) {
  MNUtil.showHUD("❌ 请至少选择一个笔记");
  return;
}

MNUtil.showHUD(`✅ 选中了 ${selectedNotes.length} 个笔记`);

// 处理每一个笔记
selectedNotes.forEach((note, index) => {
  console.log(`第 ${index + 1} 个笔记：${note.noteTitle}`);
});
```

#### 🔍 了解笔记的"身份证"

每个笔记都有很多属性，就像人有名字、年龄、身高一样：

```javascript
function inspectNote() {
  const focusNote = MNNote.getFocusNote();
  if (!focusNote) return;
  
  // 基本信息
  console.log("标题：", focusNote.noteTitle);      // 笔记标题
  console.log("摘录：", focusNote.excerptText);    // 摘录的文本
  console.log("颜色：", focusNote.colorIndex);     // 颜色编号 (0-15)
  
  // 关系信息
  console.log("有父笔记吗？", focusNote.parentNote ? "有" : "没有");
  console.log("子笔记数量：", focusNote.childNotes.length);
  
  // 内容信息
  console.log("评论数量：", focusNote.comments.length);
  console.log("标签：", focusNote.tags.join(", "));
}
```

#### 🎨 修改笔记（最重要的部分）

现在到了激动人心的时刻——修改笔记！但是记住一个黄金法则：**所有修改都要包在 `undoGrouping` 里**。

```javascript
// ❌ 错误的做法（用户无法撤销）
focusNote.noteTitle = "新标题";
focusNote.colorIndex = 6;

// ✅ 正确的做法（用户可以一键撤销）
MNUtil.undoGrouping(() => {
  focusNote.noteTitle = "新标题";
  focusNote.colorIndex = 6;
});
```

> 🔑 **黄金法则**：`undoGrouping` 就像一个"事务"，里面的所有操作要么全部成功，要么全部撤销。这给了用户"后悔药"。

#### 📝 实战示例：智能笔记处理器

让我们把学到的知识组合起来，创建一个实用的功能：

```javascript
async function smartNoteProcessor() {
  // 1. 获取选中的笔记
  const notes = MNNote.getFocusNotes();
  if (notes.length === 0) {
    MNUtil.showHUD("❌ 请选择要处理的笔记");
    return;
  }
  
  // 2. 询问用户想做什么
  const actions = [
    "🎨 统一改色",
    "🏷️ 批量加标签",
    "📝 添加前缀",
    "🧹 清理格式"
  ];
  
  const selected = await MNUtil.userSelect("选择操作", "", actions);
  if (selected === 0) return;
  
  // 3. 执行操作（使用撤销分组）
  MNUtil.showHUD("⏳ 处理中...", -1);
  
  MNUtil.undoGrouping(() => {
    let successCount = 0;
    
    notes.forEach(note => {
      switch (selected) {
        case 1: // 统一改色
          note.colorIndex = 3;  // 黄色
          break;
          
        case 2: // 批量加标签
          note.appendTags(["已整理", new Date().toLocaleDateString()]);
          break;
          
        case 3: // 添加前缀
          note.noteTitle = "📌 " + note.noteTitle;
          break;
          
        case 4: // 清理格式
          note.noteTitle = note.noteTitle.trim().replace(/\s+/g, ' ');
          break;
      }
      
      successCount++;
    });
    
    MNUtil.showHUD(`✅ 成功处理 ${successCount} 个笔记`);
  });
}
```

#### 🎨 颜色速查表

MarginNote 使用数字表示颜色，这里是完整对照表：

```javascript
const colorMap = {
  0: "⚪ 无色",     1: "🟡 淡黄",   2: "🔵 淡蓝",   3: "🟡 黄色",
  4: "🔷 深蓝",     5: "🟠 橙色",   6: "🔴 红色",   7: "🟣 紫色",
  8: "🟢 淡绿",     9: "🟢 深绿",   10: "⚫ 灰色",  11: "🟤 深橙",
  12: "🟫 棕色",    13: "🔴 深红",  14: "🟣 深紫",  15: "⚫ 深灰"
};

// 使用示例
function setNoteColorByMeaning() {
  const focusNote = MNNote.getFocusNote();
  if (!focusNote) return;
  
  const options = [
    "🔴 重要/紧急 (红色)",
    "🟡 需要注意 (黄色)",
    "🟢 已完成 (绿色)",
    "🔵 参考信息 (蓝色)"
  ];
  
  MNUtil.userSelect("选择含义", "", options).then(selected => {
    if (selected > 0) {
      const colorIndices = [6, 3, 8, 2];  // 对应的颜色索引
      MNUtil.undoGrouping(() => {
        focusNote.colorIndex = colorIndices[selected - 1];
      });
    }
  });
}
```

#### 💬 给笔记添加内容

笔记不仅有标题，还可以添加各种评论：

```javascript
function enrichNote() {
  const focusNote = MNNote.getFocusNote();
  if (!focusNote) return;
  
  MNUtil.undoGrouping(() => {
    // 添加纯文本评论
    focusNote.appendTextComment("📅 " + new Date().toLocaleString());
    
    // 添加 Markdown 格式评论
    focusNote.appendMarkdownComment("**重点：** 这是一个 *重要* 的笔记");
    
    // 添加 HTML 格式评论（更丰富的样式）
    focusNote.appendHtmlComment(
      '<span style="color: red; font-weight: bold;">⚠️ 注意事项</span>',
      "注意事项",  // 纯文本版本
      {width: 150, height: 30},  // 显示尺寸
      "myPlugin"  // 标签，用于识别是哪个插件添加的
    );
    
    // 添加标签
    focusNote.appendTags(["重要", "待复习"]);
  });
  
  MNUtil.showHUD("✅ 笔记内容已丰富");
}
```

#### 🎯 新手任务：创建一个笔记模板系统

综合运用所学知识，创建一个实用的笔记模板功能：

```javascript
async function applyNoteTemplate() {
  const focusNote = MNNote.getFocusNote();
  if (!focusNote) {
    MNUtil.showHUD("❌ 请先选择一个笔记");
    return;
  }
  
  // 定义模板
  const templates = {
    "📚 读书笔记": {
      prefix: "📚 ",
      color: 2,  // 淡蓝色
      tags: ["读书", "学习"],
      comments: [
        "📖 书名：",
        "👤 作者：",
        "📄 章节：",
        "💡 要点：",
        "💭 思考："
      ]
    },
    "🎯 任务清单": {
      prefix: "🎯 ",
      color: 3,  // 黄色
      tags: ["任务", "待办"],
      comments: [
        "📅 截止日期：",
        "🎯 目标：",
        "📝 步骤：\n- [ ] \n- [ ] \n- [ ] ",
        "✅ 完成情况："
      ]
    },
    "💡 灵感记录": {
      prefix: "💡 ",
      color: 5,  // 橙色
      tags: ["灵感", "创意"],
      comments: [
        "💡 灵感来源：",
        "🎨 具体想法：",
        "🔗 相关链接：",
        "📅 记录时间：" + new Date().toLocaleString()
      ]
    }
  };
  
  // 让用户选择模板
  const templateNames = Object.keys(templates);
  const selected = await MNUtil.userSelect("选择模板", "", templateNames);
  
  if (selected > 0) {
    const templateName = templateNames[selected - 1];
    const template = templates[templateName];
    
    // 应用模板
    MNUtil.undoGrouping(() => {
      // 修改标题
      if (!focusNote.noteTitle.startsWith(template.prefix)) {
        focusNote.noteTitle = template.prefix + focusNote.noteTitle;
      }
      
      // 设置颜色
      focusNote.colorIndex = template.color;
      
      // 添加标签
      focusNote.appendTags(template.tags);
      
      // 添加评论
      template.comments.forEach(comment => {
        focusNote.appendTextComment(comment);
      });
    });
    
    MNUtil.showHUD(`✅ 已应用模板：${templateName}`);
  }
}
```

> 🎉 **太棒了！** 你已经掌握了笔记操作的核心技能。现在你可以：
> - ✅ 安全地获取和检查笔记
> - ✅ 修改笔记的各种属性
> - ✅ 批量处理多个笔记
> - ✅ 使用撤销分组保护用户操作
> - ✅ 创建实用的笔记处理功能

### 第三站：增强功能（让插件更强大）

前两站我们学会了和用户对话、操作笔记。现在让我们解锁一些高级功能，让你的插件真正强大起来！

#### 📋 剪贴板操作 - 与外界交流的桥梁

剪贴板是插件与外部世界交流的重要途径。想象一下，用户从网页复制了一段文字，你的插件可以直接使用它！

```javascript
// 📥 读取剪贴板
function pasteAsNote() {
  // 获取剪贴板内容
  const clipboardText = MNUtil.clipboardText;
  
  if (!clipboardText) {
    MNUtil.showHUD("❌ 剪贴板是空的");
    return;
  }
  
  // 检查内容类型
  if (clipboardText.startsWith("http")) {
    MNUtil.showHUD("🔗 检测到链接，正在创建链接笔记...");
    // 创建链接笔记
  } else if (clipboardText.length > 200) {
    MNUtil.showHUD("📄 检测到长文本，正在创建摘要笔记...");
    // 创建长文本笔记
  } else {
    MNUtil.showHUD("📝 正在创建笔记...");
    // 创建普通笔记
  }
}

// 📤 复制到剪贴板
function copyNoteInfo() {
  const focusNote = MNNote.getFocusNote();
  if (!focusNote) {
    MNUtil.showHUD("❌ 请先选择笔记");
    return;
  }
  
  // 构建要复制的内容
  const info = `📌 ${focusNote.noteTitle}
📝 ${focusNote.excerptText || "无摘录"}
🏷️ ${focusNote.tags.join(", ") || "无标签"}
🔗 ${focusNote.noteURL}`;
  
  // 复制到剪贴板
  MNUtil.copy(info);
  MNUtil.showHUD("✅ 笔记信息已复制");
}
```

> 💡 **实用场景**：
> - 从网页复制内容直接创建笔记
> - 导出笔记信息到其他应用
> - 批量收集链接并创建引用

#### 🎛️ 自定义菜单 - 让插件更专业

当功能变多时，一个按钮已经不够用了。这时候就需要菜单来组织功能：

```javascript
// 创建一个功能丰富的右键菜单
async function showSmartMenu(button) {
  const focusNote = MNNote.getFocusNote();
  if (!focusNote) {
    MNUtil.showHUD("❌ 请先选择笔记");
    return;
  }
  
  // 创建菜单（按钮，控制器，宽度）
  const menu = new Menu(button, self, 280);
  
  // 添加菜单项 - 基础操作
  menu.addMenuItem("📋 复制标题", "copyTitle:", focusNote);
  menu.addMenuItem("🔗 复制链接", "copyLink:", focusNote);
  menu.addMenuItem("📝 复制摘录", "copyExcerpt:", focusNote);
  
  // 添加分隔线（用纯文本作为分组标题）
  menu.addMenuItem("─────── 高级操作 ───────");
  
  // 高级操作
  menu.addMenuItem("🎨 应用模板", "applyTemplate:", focusNote);
  menu.addMenuItem("🔄 转换格式", "convertFormat:", focusNote);
  menu.addMenuItem("📊 生成统计", "generateStats:", focusNote);
  
  // 条件菜单项（根据笔记状态显示不同选项）
  if (focusNote.childNotes.length > 0) {
    menu.addMenuItem("👶 处理子笔记", "processChildren:", focusNote);
  }
  
  if (focusNote.tags.includes("TODO")) {
    menu.addMenuItem("✅ 标记完成", "markDone:", focusNote);
  }
  
  // 显示菜单
  menu.show();
}

// 实现菜单功能（在插件类中）
copyTitle: function(note) {
  MNUtil.copy(note.noteTitle);
  MNUtil.showHUD("✅ 标题已复制");
},

copyLink: function(note) {
  MNUtil.copy(note.noteURL);
  MNUtil.showHUD("✅ 链接已复制");
},

applyTemplate: async function(note) {
  // 这里可以调用之前写的模板功能
  await applyNoteTemplate();
}
```

> 🎯 **菜单设计技巧**：
> - 最常用的功能放在最上面
> - 使用图标让菜单更直观
> - 相关功能用分隔线分组
> - 危险操作（如删除）放在最下面

#### 💾 文件操作 - 导入导出数据

有时候我们需要保存配置或导出数据：

```javascript
// 📤 导出笔记到文件
function exportNotes() {
  const notes = MNNote.getFocusNotes();
  if (notes.length === 0) {
    MNUtil.showHUD("❌ 请选择要导出的笔记");
    return;
  }
  
  // 构建导出数据
  const exportData = {
    exportDate: new Date().toISOString(),
    noteCount: notes.length,
    notes: notes.map(note => ({
      title: note.noteTitle,
      excerpt: note.excerptText,
      color: note.colorIndex,
      tags: note.tags,
      comments: note.comments.map(c => c.text)
    }))
  };
  
  // 保存到文件
  const fileName = `笔记导出_${new Date().toLocaleDateString()}.json`;
  const filePath = `${MNUtil.mainPath}/exports/${fileName}`;
  
  // 确保目录存在
  MNUtil.createFolder(`${MNUtil.mainPath}/exports`);
  
  // 写入文件
  MNUtil.writeJSON(filePath, exportData);
  
  // 复制文件路径到剪贴板
  MNUtil.copy(filePath);
  MNUtil.showHUD(`✅ 已导出 ${notes.length} 个笔记\n路径已复制到剪贴板`);
}

// 📥 从文件导入配置
function loadConfig() {
  const configPath = `${MNUtil.mainPath}/config.json`;
  
  // 检查文件是否存在
  if (!MNUtil.isfileExists(configPath)) {
    // 创建默认配置
    const defaultConfig = {
      version: "1.0.0",
      settings: {
        defaultColor: 3,
        autoTag: true,
        templateEnabled: true
      }
    };
    
    MNUtil.writeJSON(configPath, defaultConfig);
    return defaultConfig;
  }
  
  // 读取配置
  return MNUtil.readJSON(configPath);
}
```

#### 🌍 平台适配 - 让插件更友好

MarginNote 支持 Mac 和 iPad，不同平台有不同的特性：

```javascript
// 检测平台并适配
function adaptToPlatform() {
  const isMac = MNUtil.isMacOS();
  
  if (isMac) {
    // Mac 平台特有功能
    setupMacFeatures();
  } else {
    // iOS/iPadOS 特有功能
    setupIOSFeatures();
  }
}

// Mac 平台功能
function setupMacFeatures() {
  // Mac 支持更复杂的快捷键
  MNUtil.showHUD("💻 Mac 版本：支持键盘快捷键");
  
  // Mac 支持文件拖放
  // 可以实现拖入文件创建笔记等功能
}

// iOS 平台功能
function setupIOSFeatures() {
  // iOS 更注重手势操作
  MNUtil.showHUD("📱 iOS 版本：优化触摸体验");
  
  // iOS 的菜单需要考虑手指操作
  // 按钮要更大，间距要更宽
}

// 自适应界面示例
function createAdaptiveUI() {
  const isMac = MNUtil.isMacOS();
  
  // 根据平台调整按钮大小
  const buttonSize = isMac ? 30 : 44;  // iOS 需要更大的触摸目标
  const spacing = isMac ? 5 : 10;      // iOS 需要更大的间距
  
  // 创建按钮时使用这些值
  const button = MNButton.new({
    width: buttonSize,
    height: buttonSize,
    margin: spacing
  });
}
```

#### 🎯 综合实战：智能笔记助手

让我们把所有学到的增强功能组合起来，创建一个真正实用的功能：

```javascript
// 智能笔记助手 - 集成所有高级功能
async function smartNoteAssistant() {
  // 检测平台
  const isMac = MNUtil.isMacOS();
  
  // 构建功能菜单
  const features = [
    "📋 从剪贴板创建笔记",
    "📤 导出选中笔记",
    "🎨 批量应用模板",
    "🔄 智能格式转换",
    "📊 生成学习报告",
    "⚙️ 插件设置"
  ];
  
  // iOS 上添加额外选项
  if (!isMac) {
    features.push("📱 触摸优化模式");
  }
  
  const selected = await MNUtil.userSelect(
    "智能笔记助手",
    "选择要执行的功能",
    features
  );
  
  if (selected === 0) return;
  
  switch (selected) {
    case 1: // 从剪贴板创建笔记
      await createNoteFromClipboard();
      break;
      
    case 2: // 导出选中笔记
      await exportSelectedNotes();
      break;
      
    case 3: // 批量应用模板
      await batchApplyTemplate();
      break;
      
    case 4: // 智能格式转换
      await smartFormatConversion();
      break;
      
    case 5: // 生成学习报告
      await generateStudyReport();
      break;
      
    case 6: // 插件设置
      await showSettings();
      break;
      
    case 7: // iOS 触摸优化
      if (!isMac) {
        await enableTouchOptimization();
      }
      break;
  }
}

// 从剪贴板智能创建笔记
async function createNoteFromClipboard() {
  const text = MNUtil.clipboardText;
  if (!text) {
    MNUtil.showHUD("❌ 剪贴板为空");
    return;
  }
  
  // 智能识别内容类型
  let noteType = "普通笔记";
  let color = 0;
  let tags = [];
  
  if (text.startsWith("http")) {
    noteType = "链接笔记";
    color = 2;  // 蓝色
    tags = ["链接", "参考"];
  } else if (text.includes("TODO") || text.includes("待办")) {
    noteType = "任务笔记";
    color = 3;  // 黄色
    tags = ["TODO", "任务"];
  } else if (text.length > 500) {
    noteType = "长文笔记";
    color = 8;  // 绿色
    tags = ["长文", "阅读"];
  }
  
  const confirmed = await MNUtil.confirm(
    `创建${noteType}`,
    `检测到${noteType}，是否创建？\n\n${text.substring(0, 100)}...`
  );
  
  if (confirmed) {
    // 这里实际创建笔记的代码
    MNUtil.showHUD(`✅ ${noteType}创建成功`);
  }
}
```

#### 🎯 新手任务：创建你的瑞士军刀

现在轮到你了！试着创建一个集成多种功能的"瑞士军刀"插件：

```javascript
// 你的任务：完成这个多功能工具
async function mySwissKnife() {
  const focusNote = MNNote.getFocusNote();
  
  // 1. 创建一个自适应菜单
  const menu = new Menu(button, self, MNUtil.isMacOS() ? 250 : 300);
  
  // 2. 添加至少5个实用功能
  menu.addMenuItem("📋 复制为 Markdown", "copyAsMarkdown:", focusNote);
  menu.addMenuItem("🔗 生成分享链接", "generateShareLink:", focusNote);
  // ... 添加更多功能
  
  // 3. 根据不同情况显示不同选项
  if (MNUtil.clipboardText) {
    menu.addMenuItem("📥 粘贴并关联", "pasteAndLink:", focusNote);
  }
  
  menu.show();
}

// 实现其中一个功能作为示例
copyAsMarkdown: function(note) {
  if (!note) return;
  
  // 构建 Markdown 格式
  const markdown = `## ${note.noteTitle}

${note.excerptText || ""}

标签：${note.tags.map(t => `#${t}`).join(" ")}
创建时间：${new Date(note.createTime).toLocaleString()}
`;
  
  MNUtil.copy(markdown);
  MNUtil.showHUD("✅ 已复制 Markdown 格式");
}
```

> 🎉 **恭喜你完成第三站！**
> 
> 你已经掌握了：
> - ✅ 剪贴板操作 - 与外部世界交流
> - ✅ 菜单系统 - 组织复杂功能
> - ✅ 文件操作 - 导入导出数据
> - ✅ 平台适配 - 优化用户体验
> 
> 这些增强功能让你的插件从"能用"变成"好用"。记住，好的插件不仅功能强大，更要体验流畅！

## 开发你的第一个按钮

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

### 🚀 快速开始模板（新手复制即用）

想要最快速度看到效果？直接复制下面的代码到对应文件：

**第一步：在 `xdyy_button_registry.js` 中添加：**
```javascript
global.registerButton("custom19", {
  name: "时间戳",
  image: "timer",  // 使用内置图标
  templateName: "menu_timestamp"
});
```

**第二步：在 `xdyy_menu_registry.js` 中添加：**
```javascript
global.registerMenuTemplate("menu_timestamp", JSON.stringify({
  action: "addTimestamp"
}));
```

**第三步：在 `xdyy_custom_actions_registry.js` 中添加：**
```javascript
global.registerCustomAction("addTimestamp", async function(context) {
  const { button, des, focusNote, focusNotes, self } = context;
  
  if (!focusNote) {
    MNUtil.showHUD("❌ 请先选择笔记");
    return;
  }
  
  MNUtil.undoGrouping(() => {
    const time = new Date().toLocaleString('zh-CN');
    focusNote.noteTitle = `[${time}] ${focusNote.noteTitle}`;
    MNUtil.showHUD("✅ 已添加时间戳");
  });
});
```

**完成！** 重启 MarginNote，你的第一个按钮就出现在工具栏了！

---

### 2. 三步添加新按钮（详细说明）

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
  const { button, des, focusNote, focusNotes, self } = context;
  
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
  const { button, des, focusNote, focusNotes, self } = context;
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
  const { button, des, focusNote, focusNotes, self } = context;
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
  const { button, des, focusNote, focusNotes, self } = context;
  
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
  {width: 100, height: 30},  // 尺寸对象
  "myPlugin"                 // 标签
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
  const { button, des, focusNote, focusNotes, self } = context;
  
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
  const { button, des, focusNote, focusNotes, self } = context;
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
  const { button, des, focusNote, focusNotes, self } = context;
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
      {width: 100, height: 30},
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
        {width: 120, height: 30},
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
          {width: 100, height: 25},
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

### 🆘 新手自检清单（遇到问题先看这里）

遇到问题不要慌！按照这个清单逐项检查：

1. **插件是否正确安装？**
   - [ ] MNUtils 已安装并勾选启用
   - [ ] 你的插件已安装并勾选启用
   - [ ] 重启过 MarginNote（必须！）

2. **代码是否有语法错误？**
   - [ ] 检查所有的括号 `{}` `()` `[]` 是否成对
   - [ ] 检查是否有多余的逗号
   - [ ] 字符串引号是否匹配

3. **功能是否正确注册？**
   - [ ] 按钮在 `xdyy_button_registry.js` 中注册了吗？
   - [ ] 菜单在 `xdyy_menu_registry.js` 中定义了吗？
   - [ ] 动作在 `xdyy_custom_actions_registry.js` 中实现了吗？

4. **测试步骤是否正确？**
   - [ ] 选中了笔记再点击按钮？
   - [ ] 在正确的视图（文档/学习/复习）？

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

### 📋 新手毕业清单

完成以下任务，你就正式从新手毕业了：

- [ ] 成功创建了至少一个自定义按钮
- [ ] 理解了 `focusNote` 和 `focusNotes` 的区别
- [ ] 能够使用 `MNUtil.undoGrouping()` 包装操作
- [ ] 知道如何用 `MNUtil.showHUD()` 显示消息
- [ ] 学会了用 `try-catch` 处理错误
- [ ] 能够独立调试简单的问题
- [ ] 完成了一个对自己有用的小功能

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