# CLAUDE.md

此文件为 Claude Code (claude.ai/code) 提供在此代码库中工作的指导。

## 项目概述

GoToPage 是一个 MarginNote 4 插件，允许用户跳转到 PDF 文档的指定页面，支持页码偏移功能。插件提供简单的界面实现：
- 跳转到指定页码
- 为文档设置页码偏移（适用于 PDF 页码与实际页码不匹配的情况）
- 使用 MD5 标识符为每个文档存储偏移量

## 核心功能

- **页码偏移管理**：在 NSUserDefaults 中维护每个文档的页码偏移
- **简单导航语法**：
  - `10` - 跳转到第 10 页
  - `2@10` - 设置偏移量为 2 并跳转到第 10 页
  - `2@` - 仅设置偏移量为 2

## 插件结构

```
GoToPage/
├── main.js         # 插件主逻辑
├── mnaddon.json    # 插件清单文件
├── GoToPage.png    # 插件图标
└── *.mnaddon       # 打包后的插件（ZIP 压缩包）
```

## 代码架构

### 主要组件

1. **JSB.newAddon**：定义插件类的入口点
2. **页码偏移存储**：使用 `NSUserDefaults`，键名为 `'GoToPage.Offsets'` 持久化偏移量
3. **文档跟踪**：使用 MD5 哈希（`currentDocmd5`）跟踪当前文档

### 关键方法

- `toggleGoToPage`：显示输入对话框并处理导航的主方法
- `sceneWillConnect`：窗口打开时加载保存的偏移量
- `documentDidOpen/docmentWillClose`：跟踪当前文档

### 重要实现细节

1. **偏移量计算**：实际页码 = 输入页码 + 存储的偏移量
2. **对话框系统**：使用 `UIAlertView` 进行用户输入（MarginNote 原生对话框）
3. **定时器清理**：使用 NSTimer 检测导航完成并重置 UI 状态

## MarginNote API 使用

本插件使用 MarginNote 的 JSBridge API：
- `Application.sharedInstance()`：访问应用实例
- `UIAlertView`：原生对话框系统
- `NSUserDefaults`：持久化存储
- `NSTimer`：定时器工具
- `JSB.log()`：日志记录（当前使用 🌈 前缀以提高可见性）

## 已知问题与注意事项

1. **基于定时器的状态管理**：使用轮询检测对话框关闭
2. **命令键检测**：显示对话框前检查 Go To Page 命令是否可用

## 调试

通过取消注释 JSB.log 语句启用日志记录。查找带有 🌈🌈🌈 MNLOG 前缀的日志。

## 版本管理

当前版本：1.1.1
- 最低 MarginNote 版本要求：3.6.7
- 包含用于插件验证的证书密钥

## 学习资源

### 代码版本说明

本目录现在包含三个版本的代码：

1. **main.js** - 原始版本（v1.1.1）
   - 最小化实现，代码简洁
   - 适合理解基本原理

2. **main_annotated.js** - 详细注释版本
   - 每行代码都有中文注释
   - 深入解释 MarginNote API 使用
   - 最适合学习插件开发

3. **main_enhanced.js** - 增强版本（v2.0.0）
   - 修复了原版的所有已知问题
   - 添加历史记录、输入验证等新功能
   - 展示最佳实践和高级技巧
   - 可选 MNUtils 框架集成

### 学习路径建议

1. **入门学习**：先阅读 `main_annotated.js`，理解每个 API 的作用
2. **理解原理**：对比 `main.js` 和注释版，体会简洁实现
3. **进阶提升**：研究 `main_enhanced.js`，学习优化技巧
4. **实践应用**：基于增强版开发自己的插件

### 增强版本主要改进

- **问题修复**：
  - ✅ 修复 timeoutCount 全局变量问题
  - ✅ 添加完整的输入验证
  - ✅ 改进错误处理机制

- **新增功能**：
  - ✅ 历史记录（最近20条）
  - ✅ 支持负数偏移量
  - ✅ MNUtils 框架集成（可选）
  - ✅ 调试模式

- **架构优化**：
  - ✅ 状态管理对象
  - ✅ Promise/async 支持
  - ✅ 模块化设计
  - ✅ 防重复触发

## 相关文档

深入了解 MarginNote 插件开发：
- 查看父目录的 `CLAUDE.md` 了解全面的 MN 插件系统文档
- 查阅 `MarginNote插件系统文档.md` 了解 API 详情
- 查看 `MNGuide_DataStructure.md` 理解数据结构