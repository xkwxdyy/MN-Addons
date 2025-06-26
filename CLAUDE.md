# CLAUDE.md

此文件为 Claude Code (claude.ai/code) 提供在本仓库中工作的指导。

## 项目概览

MN Toolbar Pro 是一个 MarginNote 4 扩展，提供增强的可自定义工具栏，用于文档批注和笔记管理。它使用 JSB（JavaScript Bridge）与原生 MarginNote 应用程序在 iOS/macOS 上进行交互。

## 开发命令

### 构建和打包
```bash
# 解包 .mnaddon 文件以进行开发
mnaddon4 unpack mntoolbar_v0_1_3_alpha0427.mnaddon

# 将当前目录打包成 .mnaddon 格式
mnaddon4 build

# 更新版本并部署（需要配置）
python update.py
```

### 测试
- 在 MarginNote 4 应用程序中加载插件进行测试
- 使用 `MNUtil.showHUD()` 显示调试消息
- 在 MarginNote 开发者模式下查看控制台输出

## 架构

### 核心组件

1. **main.js** - 入口点，包含：
   - `JSB.newAddon()` - 主插件注册
   - 生命周期方法（`willOpenNotebook`、`willCloseNotebook`）
   - 单例实例管理（`getMNToolbarClass()`）
   - MarginNote 事件的事件观察器

2. **webviewController.js** - UI 管理：
   - `ToolbarController` 类处理工具栏显示
   - 按钮配置和动作处理
   - 窗口状态持久化
   - 与其他 MN 插件的集成

3. **settingController.js** - 设置界面：
   - `SettingController` 类用于偏好设置
   - 基于 TableView 的设置 UI
   - 配置导出/导入

4. **utils.js** - 工具函数：
   - `MNUtil` 命名空间，包含框架和颜色工具
   - `FrameClass` 用于 UI 定位计算
   - 常用辅助函数

### 配置结构

插件使用 `toolbar_config.json` 存储：
- 用户偏好设置
- 窗口状态
- 自定义工具栏动作
- 按钮配置

### 关键模式

1. **单例访问**：
   ```javascript
   const toolbar = Application.sharedInstance().addon.toolbar
   const controller = getToolbarController()
   ```

2. **事件处理**：
   ```javascript
   NSNotificationCenter.defaultCenter().addObserverSelectorName(
     observer, 
     handler, 
     notificationName
   )
   ```

3. **动作系统**：
   - 动作定义在 webviewController.js 的 `availableActionOptions` 中
   - 每个动作有 `id`、`title`、`group` 和可选的 `callback`
   - 基于配置的动态动作加载

## 重要约束

1. **JSB 限制**：
   - 不能使用 Node.js API 或 npm 包
   - 仅限于 JSB 提供的 API 和 MarginNote 框架
   - UI 必须通过 JavaScript 桥接使用 UIKit 组件

2. **内存管理**：
   - 在 `dealloc()` 方法中手动清理
   - 关闭笔记本时移除观察器
   - 正确的单例生命周期管理

3. **平台兼容性**：
   - 必须同时在 iOS 和 macOS 上工作
   - 考虑 UI 布局的屏幕尺寸差异
   - 触摸与鼠标交互模式

## 开发技巧

1. **调试**：
   - 使用 `MNUtil.showHUD()` 显示用户可见的调试消息
   - 控制台日志显示在 MarginNote 开发者控制台中
   - 在 iPad 和 Mac 上测试兼容性

2. **UI 开发**：
   - 使用 `FrameClass` 工具进行定位
   - 在配置中持久化窗口状态
   - 遵循 MarginNote 的 UI 约定

3. **集成点**：
   - 通过 `Application.sharedInstance().addon` 访问其他插件
   - 使用通知中心进行跨插件通信
   - 集成前检查插件可用性

## 常见任务

### 添加新的工具栏动作
1. 在 webviewController.js 的 `availableActionOptions` 中添加动作定义
2. 如需要，实现回调函数
3. 添加到适当的动作组
4. 必要时更新配置 UI

### 修改设置
1. 为新设置更新 `settingController.js`
2. 在 `toolbar_config.json` 中添加相应条目
3. 处理现有配置的迁移

### 调试崩溃
1. 检查对原生对象的 null/undefined 访问
2. 验证 dealloc 中的观察器清理
3. 使用大文档测试内存使用
4. 确保回调中有正确的错误处理

## 代码约定

- 代码使用英文，用户界面字符串使用中文
- 遵循现有的 JSDoc 文档模式
- 控制器保持单例模式
- 工具函数保存在 `utils.js` 中
- 工具命名空间使用 `MNUtil.` 前缀