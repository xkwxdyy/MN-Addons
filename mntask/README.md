# MN Task - MarginNote 插件开发框架

## 简介

MN Task 是一个精简但功能完整的 MarginNote 插件开发框架，基于 MN ChatAI 项目的架构设计，保留了最核心的面板和菜单系统。本框架旨在帮助开发者快速理解和掌握 MarginNote 插件开发。

## 主要特性

- 🎯 **多面板架构**：主面板、设置面板、浮动面板，支持灵活切换
- 📋 **菜单系统**：完整的右键菜单和弹出菜单实现
- 💾 **配置管理**：自动保存和加载配置，支持导入导出
- 🎨 **现代UI设计**：支持拖动、调整大小、动画效果
- 🛡️ **错误处理**：完善的错误边界和日志系统
- 📱 **跨平台**：同时支持 iOS 和 macOS

## 项目结构

```
mntask/
├── mnaddon.json          # 插件配置文件
├── main.js               # 插件入口，生命周期管理
├── panelController.js    # 主面板控制器，多标签页示例
├── settingsController.js # 设置面板控制器
├── floatController.js    # 浮动面板控制器
├── utils.js              # 工具函数集合
├── config.js             # 配置管理系统
└── README.md             # 本文档
```

## 快速开始

### 1. 安装依赖

本插件依赖 MNUtils，请确保已安装：
- 在 MarginNote 中安装 MNUtils 插件

### 2. 安装插件

1. 将 mntask 文件夹复制到 MarginNote 的插件目录
2. 重启 MarginNote
3. 在插件管理中启用 MN Task

### 3. 使用插件

- 选中文本后右键，选择"🚀 MN Task - 处理选中文本"
- 在笔记上右键，选择"🎯 MN Task 功能"打开功能菜单
- 通过菜单可以打开各种面板

## 核心概念

### 1. 生命周期

```javascript
sceneWillConnect        // 插件启动
notebookWillOpen        // 笔记本打开
documentDidOpen         // 文档打开
sceneDidDisconnect      // 插件关闭
```

### 2. 获取实例模式

避免 JSB 框架中的 this 引用问题：

```javascript
const getControllerName = () => self

viewDidLoad: function() {
  let self = getControllerName()  // 正确
  // var self = this  // 错误！
}
```

### 3. 视图层级

```
MNUtil.studyView (学习视图)
  └── YourController.view (你的视图)
```

### 4. 事件系统

通过 NSNotificationCenter 监听系统事件：

```javascript
self.addObserver('onPopupMenuOnNote:', 'PopupMenuOnNote')
```

## 开发指南

### 添加新功能

1. 在对应的控制器中添加 UI 组件
2. 实现事件处理方法
3. 在配置中保存状态

### 创建新面板

1. 复制现有控制器作为模板
2. 修改类名和功能
3. 在 main.js 中注册和管理

### 自定义菜单

```javascript
var commandTable = [
  {title: '功能1', object: self, selector: 'function1:', param: data},
  {title: '功能2', object: self, selector: 'function2:', param: data}
]
```

## 最佳实践

1. **错误处理**：所有关键函数都使用 try-catch
2. **资源管理**：在 sceneDidDisconnect 中清理资源
3. **配置保存**：重要状态及时保存到配置
4. **用户反馈**：使用 MNUtil.showHUD 提供操作反馈
5. **性能优化**：避免频繁的 UI 更新，使用防抖

## 调试技巧

```javascript
// 日志输出
TaskUtils.log("调试信息")

// 错误日志
TaskUtils.addErrorLog(error, "functionName")

// 复制对象到剪贴板
TaskUtils.copyJSON(object)

// 显示 HUD
TaskUtils.showHUD("操作完成")
```

## 扩展开发

本框架提供了基础架构，您可以：

1. 添加更多面板类型
2. 集成外部 API
3. 实现复杂的数据处理
4. 开发自定义工具

## 注意事项

1. logo.png 需要您自己提供（建议 60x60 像素）
2. 部分高级功能需要 MNUtils 支持
3. 建议在 MN3 和 MN4 中都进行测试

## 致谢

本项目基于 MN ChatAI 的优秀架构设计，感谢原作者的开源贡献。

## 许可证

MIT License - 自由使用和修改

---

**提示**：这是一个学习项目，展示了 MarginNote 插件开发的核心技术。建议结合源码深入学习每个模块的实现细节。

祝您开发愉快！🚀