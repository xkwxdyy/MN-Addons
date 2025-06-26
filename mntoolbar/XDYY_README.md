# XDYYToolbar 自定义功能说明

## 概述

我已经将你的自定义功能从官方版本中解耦，放到了独立的 `xdyytoolbar.js` 文件中。这样可以方便后续更新官方版本，同时保留你的自定义功能。

## 主要改动

### 1. 新增文件
- **xdyytoolbar.js** - 包含所有你的自定义功能

### 2. 修改的文件
- **main.js**
  - 添加了 `JSB.require('xdyytoolbar')` 加载自定义模块
  - 在 init 函数中初始化 XDYYToolbar
  - 移除了 togglePreprocess 方法（已移到 xdyytoolbar.js）
  - 添加了 executeCustomAction 方法来执行自定义动作
  - 修改了菜单创建逻辑，集成自定义菜单项

- **webviewController.js**
  - 在 viewDidLoad 中添加了 registerCustomActions 调用
  - 添加了 registerCustomActions 方法来注册自定义动作

## 自定义功能列表

### 卡片操作
- 🗂️ 卡片预处理模式
- ☀️ 焦点
- ❌ 删除卡片  
- ⬇️ 证明移到最下
- ⬆️ 移动到摘录部分顶部
- ⬇️ 移动到摘录部分底部
- 📊 转为进度卡片
- 🔓 卡片独立

### 区域移动
- 📥 移动到输入区
- 📚 移动到备考区
- 🧠 移动到内化区
- 📁 移动到待分类（支持多种数学分类）
- 🔄 添加到复习

### 评论操作
- 💬3️⃣ 移动最后三个评论
- 💬2️⃣ 移动最后两个评论
- 💬1️⃣ 移动最后一个评论
- 📝 移动新内容

### 工具功能
- 🔄 更新归类卡片情况
- 名字缩写处理（支持中英文）
- 文献 bib 提取
- 数组元素移动工具

## 如何添加新功能

1. 在 `xdyytoolbar.js` 的 `registerCustomActions` 方法中添加新动作：
```javascript
{
  id: 'yourNewAction',
  title: '🆕 新功能',
  group: 'customGroup',
  callback: () => this.yourNewFunction()
}
```

2. 在 `xdyytoolbar.js` 中实现对应的功能方法

3. 如果需要新的工具函数，可以在 `registerUtilityFunctions` 中注册

## 更新官方版本

当需要更新官方版本时：
1. 备份当前的 `xdyytoolbar.js` 和修改的文件
2. 更新官方版本文件
3. 重新应用上述修改（主要是 main.js 和 webviewController.js 的集成代码）
4. 测试功能是否正常

## 注意事项

1. 自定义动作的图标需要对应的图片文件，暂时使用动作 ID 作为图标名称
2. 某些功能依赖 pinyin.js 库，请确保该文件存在
3. 卡片移动功能需要对应的区域卡片（如"输入区"、"备考区"等）已存在

## 测试建议

1. 测试卡片预处理模式的开关功能
2. 测试各种卡片操作功能
3. 测试区域移动功能（需要先创建对应的区域卡片）
4. 测试名字缩写功能（中英文）
5. 测试菜单集成是否正常