# MarginNote 插件框架开发指南

> 从零开始，打造你的第一个专业 MarginNote 插件！

## 目录

1. [前言](#前言)
2. [基础知识](#基础知识)
3. [环境准备](#环境准备)
4. [插件基础结构](#插件基础结构)
5. [UI 系统详解](#ui-系统详解)
   - [创建弹出菜单](#创建弹出菜单)
   - [构建控制面板](#构建控制面板)
   - [实现多页面切换](#实现多页面切换)
6. [实战：开发你的第一个插件](#实战开发你的第一个插件)
7. [进阶技巧](#进阶技巧)
8. [常见问题](#常见问题)

## 前言

恭喜你！你已经体验到了 MN ChatAI 插件的强大功能。那些优雅的菜单、漂亮的控制面板、流畅的页面切换，都是通过 MarginNote 的原生 UI 系统实现的。本指南将手把手教你如何实现这些功能。

## 基础知识

### 什么是 MarginNote 插件？

MarginNote 插件是基于 JSBox（JavaScript Bridge）框架开发的扩展程序，可以：
- 访问和操作笔记、文档
- 创建自定义 UI 界面
- 响应用户操作事件
- 与 iOS/macOS 原生 API 交互

### 核心概念

1. **JSB（JavaScript Bridge）**：连接 JavaScript 和 Objective-C 的桥梁
2. **MNUtils**：MarginNote 提供的核心 API 框架
3. **控制器（Controller）**：管理视图和逻辑的组件
4. **视图（View）**：用户界面元素

## 环境准备

### 1. 安装 MNUtils

MNUtils 是开发 MarginNote 插件的必备框架：

```bash
# 在 MarginNote 的插件目录下
# macOS: ~/Library/Containers/QReader.MarginNoteMac/Data/Library/MarginNote Extensions/
# iOS: 通过文件 App 访问 MarginNote 的插件目录
```

### 2. 创建插件目录结构

```
my-first-addon/
├── mnaddon.json      # 插件配置文件
├── main.js           # 插件入口文件
├── logo.png          # 插件图标（建议 100x100）
└── utils.js          # 工具函数（可选）
```

### 3. 配置 mnaddon.json

```json
{
  "addonid": "myfirstaddon",
  "name": "My First Addon",
  "author": "Your Name",
  "version": "1.0.0",
  "marginnote_version_min": "4.0.0",
  "cert_key": ""
}
```

## 插件基础结构

### main.js 基本框架

```javascript
JSB.newAddon = function (mainPath) {
  // 1. 检查 MNUtils
  JSB.require('mnutils')
  if (typeof MNUtil == 'undefined') {
    return undefined
  }
  
  // 2. 定义插件主类
  var MyAddonClass = JSB.defineClass('MyAddon : JSExtension', {
    // 场景连接时调用（插件启动）
    sceneWillConnect: function () {
      MNUtil.log("🚀 插件启动了！")
      self.mainPath = mainPath
    },
    
    // 笔记本打开时调用
    notebookWillOpen: function (notebookid) {
      MNUtil.log("📚 笔记本打开了：" + notebookid)
    },
    
    // 弹出菜单响应
    onPopupMenuOnNote: function (sender) {
      MNUtil.log("📝 点击了笔记菜单")
    }
  })
  
  return MyAddonClass
}
```

## UI 系统详解

### 创建弹出菜单

弹出菜单是插件最常用的交互方式。让我们实现一个像 ChatAI 那样的菜单：

```javascript
// 1. 添加工具栏按钮
queryAddonCommandStatus: function () {
  return {
    image: "logo.png",
    object: self,
    selector: "toggleMenu:",
    checked: false
  }
},

// 2. 实现菜单弹出方法
toggleMenu: function (button) {
  // 构建菜单项数组
  var menuItems = [
    {
      title: "⚙️  设置",
      object: self,
      selector: "openSettings:",
      param: null
    },
    {
      title: "📊  统计",
      object: self,
      selector: "showStats:",
      param: null
    },
    {
      title: "❓  帮助",
      object: self,
      selector: "showHelp:",
      param: null
    }
  ]
  
  // 使用 MNUtils 弹出菜单
  self.popover = this.showPopover(button, menuItems, 200)
},

// 3. 辅助方法：显示弹出菜单
showPopover: function (button, items, width) {
  // 创建菜单控制器
  var menuController = MenuController.new()
  menuController.commandTable = items
  menuController.rowHeight = 40
  menuController.preferredContentSize = {
    width: width,
    height: menuController.rowHeight * items.length
  }
  
  // 创建弹出控制器
  var popover = UIPopoverController.new(menuController)
  
  // 计算位置并显示
  var rect = button.convertRectToView(button.bounds, MNUtil.studyView)
  popover.presentPopoverFromRectInViewPermittedArrowDirectionsAnimated(
    rect, 
    MNUtil.studyView, 
    1 << 2, // 向上箭头
    true
  )
  
  return popover
}
```

### 构建控制面板

控制面板是插件的核心界面，让我们创建一个多页面的设置面板：

```javascript
// 1. 创建设置视图
openSettings: function () {
  if (!self.settingController) {
    self.settingController = SettingController.new()
    self.settingController.mainPath = self.mainPath
  }
  
  self.settingController.show()
}

// 2. 定义设置控制器
var SettingController = JSB.defineClass('SettingController : UIViewController', {
  viewDidLoad: function () {
    // 创建主视图
    this.view.backgroundColor = MNUtil.hexColorAlpha("#f1f6ff", 0.95)
    this.view.layer.cornerRadius = 15
    this.view.frame = MNUtil.genFrame(100, 100, 400, 500)
    
    // 添加标题栏
    this.createTitleBar()
    
    // 添加标签页按钮
    this.createTabs()
    
    // 创建内容页面
    this.createPages()
    
    // 默认显示第一页
    this.switchToPage(0)
  },
  
  // 创建标题栏
  createTitleBar: function () {
    // 标题标签
    var titleLabel = UILabel.new()
    titleLabel.text = "插件设置"
    titleLabel.font = UIFont.boldSystemFontOfSize(18)
    titleLabel.textAlignment = 1 // 居中
    titleLabel.frame = MNUtil.genFrame(0, 10, 400, 30)
    this.view.addSubview(titleLabel)
    
    // 关闭按钮
    var closeButton = MNButton.new()
    closeButton.setTitleForState("✕", 0)
    closeButton.frame = MNUtil.genFrame(360, 10, 30, 30)
    closeButton.addTargetActionForControlEvents(this, "close", 1 << 6)
    this.view.addSubview(closeButton)
  },
  
  // 创建标签页按钮
  createTabs: function () {
    var tabs = ["常规", "高级", "关于"]
    this.tabButtons = []
    
    tabs.forEach((title, index) => {
      var button = MNButton.new()
      MNButton.setConfig(button, {
        title: title,
        font: 16,
        color: index === 0 ? "#457bd3" : "#9bb2d6",
        bold: index === 0
      })
      button.frame = MNUtil.genFrame(20 + index * 120, 50, 100, 35)
      button.tag = index
      button.addTargetActionForControlEvents(this, "tabTapped:", 1 << 6)
      
      this.view.addSubview(button)
      this.tabButtons.push(button)
    })
  },
  
  // 创建页面容器
  createPages: function () {
    this.pages = []
    
    // 常规设置页
    var generalPage = this.createGeneralPage()
    this.pages.push(generalPage)
    
    // 高级设置页
    var advancedPage = this.createAdvancedPage()
    this.pages.push(advancedPage)
    
    // 关于页面
    var aboutPage = this.createAboutPage()
    this.pages.push(aboutPage)
  },
  
  // 创建常规设置页
  createGeneralPage: function () {
    var page = UIView.new()
    page.frame = MNUtil.genFrame(20, 100, 360, 380)
    page.backgroundColor = UIColor.whiteColor()
    page.layer.cornerRadius = 10
    
    // 添加设置项
    var y = 20
    
    // 开关设置
    this.addSwitch(page, "启用自动同步", y, "autoSync")
    y += 50
    
    this.addSwitch(page, "显示调试信息", y, "debugMode")
    y += 50
    
    // 选择器设置
    this.addSelector(page, "主题颜色", y, ["蓝色", "绿色", "紫色"], "themeColor")
    
    this.view.addSubview(page)
    return page
  },
  
  // 添加开关控件
  addSwitch: function (parent, title, y, key) {
    // 标签
    var label = UILabel.new()
    label.text = title
    label.frame = MNUtil.genFrame(20, y, 200, 30)
    parent.addSubview(label)
    
    // 开关
    var switchControl = UISwitch.new()
    switchControl.frame = MNUtil.genFrame(280, y, 60, 30)
    switchControl.on = this.getConfig(key, false)
    switchControl.addTargetActionForControlEvents(this, "switchChanged:", 1 << 12)
    switchControl.tag = key
    parent.addSubview(switchControl)
  },
  
  // 标签页切换
  tabTapped: function (button) {
    this.switchToPage(button.tag)
  },
  
  // 切换页面
  switchToPage: function (index) {
    // 更新按钮状态
    this.tabButtons.forEach((btn, i) => {
      var isSelected = i === index
      MNButton.setConfig(btn, {
        color: isSelected ? "#457bd3" : "#9bb2d6",
        bold: isSelected
      })
    })
    
    // 显示/隐藏页面
    this.pages.forEach((page, i) => {
      page.hidden = i !== index
    })
  },
  
  // 显示控制器
  show: function () {
    this.view.hidden = false
    MNUtil.studyView.addSubview(this.view)
    
    // 添加拖动手势
    this.addDragGesture()
  },
  
  // 添加拖动手势
  addDragGesture: function () {
    var pan = UIPanGestureRecognizer.alloc().initWithTargetAction(this, "handlePan:")
    this.view.addGestureRecognizer(pan)
  },
  
  // 处理拖动
  handlePan: function (gesture) {
    var translation = gesture.translationInView(this.view)
    var center = this.view.center
    
    center.x += translation.x
    center.y += translation.y
    
    this.view.center = center
    gesture.setTranslationInView({x: 0, y: 0}, this.view)
  }
})
```

### 实现多页面切换

多页面切换的核心是管理多个视图的显示/隐藏状态：

```javascript
// 页面管理器
var PageManager = {
  pages: [],
  currentIndex: 0,
  
  // 添加页面
  addPage: function (view, button) {
    this.pages.push({
      view: view,
      button: button
    })
  },
  
  // 切换到指定页面
  switchTo: function (index) {
    if (index < 0 || index >= this.pages.length) return
    
    this.pages.forEach((page, i) => {
      var isActive = i === index
      
      // 更新视图显示
      page.view.hidden = !isActive
      
      // 更新按钮样式
      MNButton.setConfig(page.button, {
        color: isActive ? "#457bd3" : "#9bb2d6",
        bold: isActive,
        alpha: isActive ? 1.0 : 0.7
      })
    })
    
    this.currentIndex = index
  }
}
```

## 实战：开发你的第一个插件

让我们创建一个简单但完整的笔记统计插件：

```javascript
// main.js
JSB.newAddon = function (mainPath) {
  JSB.require('mnutils')
  if (typeof MNUtil == 'undefined') return undefined
  
  var NoteStatsClass = JSB.defineClass('NoteStats : JSExtension', {
    // 初始化
    sceneWillConnect: function () {
      self.mainPath = mainPath
      self.stats = {
        noteCount: 0,
        tagCount: 0,
        colorUsage: {}
      }
    },
    
    // 工具栏按钮
    queryAddonCommandStatus: function () {
      return {
        image: "logo.png",
        object: self,
        selector: "showMenu:",
        checked: false
      }
    },
    
    // 显示菜单
    showMenu: function (button) {
      var items = [
        {title: "📊  查看统计", object: self, selector: "showStats:"},
        {title: "🔄  刷新数据", object: self, selector: "refreshStats:"},
        {title: "📤  导出报告", object: self, selector: "exportReport:"}
      ]
      
      this.showPopover(button, items, 180)
    },
    
    // 显示统计
    showStats: function () {
      this.refreshStatsData()
      
      if (!self.statsView) {
        self.statsView = this.createStatsView()
      }
      
      self.statsView.hidden = false
      this.updateStatsDisplay()
    },
    
    // 创建统计视图
    createStatsView: function () {
      var view = UIView.new()
      view.backgroundColor = MNUtil.hexColorAlpha("#ffffff", 0.95)
      view.layer.cornerRadius = 15
      view.frame = MNUtil.genFrame(200, 100, 300, 400)
      
      // 标题
      var title = UILabel.new()
      title.text = "笔记统计"
      title.font = UIFont.boldSystemFontOfSize(20)
      title.textAlignment = 1
      title.frame = MNUtil.genFrame(0, 20, 300, 30)
      view.addSubview(title)
      
      // 统计内容
      self.statsLabel = UILabel.new()
      self.statsLabel.numberOfLines = 0
      self.statsLabel.frame = MNUtil.genFrame(20, 70, 260, 300)
      view.addSubview(self.statsLabel)
      
      // 关闭按钮
      var closeBtn = MNButton.new()
      MNButton.setConfig(closeBtn, {
        title: "关闭",
        color: "#ff4444",
        font: 16
      })
      closeBtn.frame = MNUtil.genFrame(100, 350, 100, 35)
      closeBtn.addTargetActionForControlEvents(self, "closeStats", 1 << 6)
      view.addSubview(closeBtn)
      
      MNUtil.studyView.addSubview(view)
      return view
    },
    
    // 刷新统计数据
    refreshStatsData: function () {
      var notebook = MNUtil.currentNotebook
      if (!notebook) return
      
      var allNotes = notebook.notes
      self.stats.noteCount = allNotes.length
      self.stats.tagCount = 0
      self.stats.colorUsage = {}
      
      var allTags = new Set()
      
      allNotes.forEach(note => {
        // 统计标签
        note.tags.forEach(tag => allTags.add(tag))
        
        // 统计颜色
        var color = note.colorIndex
        if (!self.stats.colorUsage[color]) {
          self.stats.colorUsage[color] = 0
        }
        self.stats.colorUsage[color]++
      })
      
      self.stats.tagCount = allTags.size
    },
    
    // 更新显示
    updateStatsDisplay: function () {
      var text = `总笔记数：${self.stats.noteCount}\n\n`
      text += `标签总数：${self.stats.tagCount}\n\n`
      text += "颜色使用统计：\n"
      
      Object.keys(self.stats.colorUsage).forEach(color => {
        text += `  颜色 ${color}：${self.stats.colorUsage[color]} 个\n`
      })
      
      self.statsLabel.text = text
    }
  })
  
  return NoteStatsClass
}
```

## 进阶技巧

### 1. 动画效果

使用 MNUtil.animate 创建流畅动画：

```javascript
// 淡入效果
MNUtil.animate(function() {
  view.alpha = 1.0
}, 0.3)

// 位置动画
MNUtil.animate(function() {
  view.frame = MNUtil.genFrame(100, 100, 300, 400)
}, 0.5)
```

### 2. 手势识别

添加各种手势支持：

```javascript
// 拖动手势
var pan = UIPanGestureRecognizer.alloc().initWithTargetAction(self, "handlePan:")
view.addGestureRecognizer(pan)

// 点击手势
var tap = UITapGestureRecognizer.alloc().initWithTargetAction(self, "handleTap:")
view.addGestureRecognizer(tap)

// 长按手势
var longPress = UILongPressGestureRecognizer.alloc().initWithTargetAction(self, "handleLongPress:")
view.addGestureRecognizer(longPress)
```

### 3. 数据持久化

使用 NSUserDefaults 保存配置：

```javascript
// 保存数据
NSUserDefaults.standardUserDefaults().setObjectForKey(data, "myAddonConfig")

// 读取数据
var data = NSUserDefaults.standardUserDefaults().objectForKey("myAddonConfig")
```

### 4. WebView 集成

创建 WebView 显示富文本内容：

```javascript
var webView = UIWebView.new()
webView.frame = MNUtil.genFrame(0, 0, 400, 300)
webView.loadHTMLStringBaseURL("<h1>Hello World</h1>", null)
view.addSubview(webView)
```

### 5. 自定义绘制

使用 Core Graphics 绘制自定义图形：

```javascript
// 创建自定义视图
var customView = UIView.new()
customView.drawRect = function(rect) {
  var ctx = UIGraphicsGetCurrentContext()
  
  // 绘制圆形
  CGContextSetFillColorWithColor(ctx, UIColor.redColor().CGColor())
  CGContextFillEllipseInRect(ctx, MNUtil.genFrame(10, 10, 50, 50))
  
  // 绘制文字
  var str = "Hello"
  str.drawInRectWithAttributes(MNUtil.genFrame(70, 20, 100, 30), {
    NSFontAttributeName: UIFont.systemFontOfSize(16),
    NSForegroundColorAttributeName: UIColor.blackColor()
  })
}
```

## 常见问题

### Q1: 插件不显示在工具栏？

确保实现了 `queryAddonCommandStatus` 方法并返回正确的配置。

### Q2: 视图位置错乱？

使用 `MNUtil.studyView` 作为父视图，并在 `controllerWillLayoutSubviews` 中更新布局。

### Q3: 手势冲突？

设置手势识别器的代理，实现 `gestureRecognizerShouldBegin` 方法。

### Q4: 内存泄漏？

在 `sceneDidDisconnect` 中清理所有资源和监听器。

## 总结

恭喜！你已经掌握了 MarginNote 插件开发的核心技能：

✅ 创建弹出菜单
✅ 构建多页面控制面板  
✅ 实现视图切换和动画
✅ 处理用户交互事件
✅ 数据持久化

现在，你可以开始开发自己的 MarginNote 插件了！记住：

1. **从简单开始**：先实现基本功能，再逐步完善
2. **参考优秀插件**：学习 MN ChatAI 等插件的实现
3. **注重用户体验**：流畅的动画、清晰的界面、及时的反馈
4. **持续迭代**：根据用户反馈不断改进

祝你开发愉快！🚀

## 相关资源

- [MNUtils API 文档](../MNUTILS_API_GUIDE.md)
- [MarginNote 4 核心概念](../MARGINNOTE4_CONCEPTS.md)
- [MN ChatAI 源码分析](./CLAUDE.md)

---

> 💡 **提示**：本指南基于 MN ChatAI 插件的实现分析，如有疑问，可参考其源码学习更多细节。