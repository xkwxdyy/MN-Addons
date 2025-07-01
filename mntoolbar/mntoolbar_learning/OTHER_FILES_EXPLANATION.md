# 📚 MN Toolbar 项目其他文件说明

> **说明**：本文档介绍除了核心文件（main.js、utils.js、webviewController.js、settingController.js、mnaddon.json）和 PNG 图标文件之外的其他项目文件。

## 目录
1. [学习参考文件](#1-学习参考文件)
2. [JSON 编辑器相关文件](#2-json-编辑器相关文件)
3. [开发配置文件](#3-开发配置文件)
4. [测试文件](#4-测试文件)
5. [图标资源文件](#5-图标资源文件)

---

## 1. 学习参考文件

### 📄 main_original.js
**作用**：原始的 main.js 文件副本，用于学习和参考
- 保留了官方版本的原始代码结构
- 已添加详细的中文注释，帮助理解生命周期
- 作为学习 MarginNote 插件开发的教材
- 不参与实际运行，仅供学习使用

**特点**：
- 包含完整的生命周期方法注释
- 详细解释了每个函数的内部实现
- 使用通俗易懂的语言和类比
- 添加了执行流程图帮助理解

---

## 2. JSON 编辑器相关文件

这组文件构成了一个完整的 JSON 编辑器功能，主要用于工具栏按钮的配置编辑。

### 📄 jsoneditor.html
**作用**：JSON 编辑器的主页面
- 提供了一个基于 Web 的可视化 JSON 编辑界面
- 集成了 JSONEditor 库，支持树形视图和代码视图
- 定义了工具栏支持的所有动作（action）列表
- 用于编辑按钮的配置参数，如动作类型、延迟时间、菜单宽度等

**使用场景**：
- 在设置界面中编辑按钮的 JSON 配置
- 可视化地构建复杂的菜单结构
- 验证 JSON 格式的正确性

### 📄 jsoneditor.js / jsoneditor.min.js
**作用**：JSONEditor 库的核心 JavaScript 文件
- `jsoneditor.js`：开发版本，包含完整代码和注释
- `jsoneditor.min.js`：压缩版本，用于生产环境
- 提供了 JSON 的语法高亮、错误提示、格式化等功能
- 支持树形编辑和代码编辑两种模式

### 🎨 jsoneditor.css / jsoneditor.min.css
**作用**：JSONEditor 的样式文件
- `jsoneditor.css`：开发版本，包含完整样式
- `jsoneditor.min.css`：压缩版本，减小文件体积
- 定义了编辑器的外观、颜色主题、图标样式等

### 🖼️ jsoneditor-icons.svg
**作用**：JSONEditor 使用的 SVG 图标集合
- 包含了编辑器中所有的图标（展开/折叠、添加/删除等）
- 使用 SVG 格式确保图标在各种分辨率下都清晰
- 通过 CSS 引用实现图标的显示

---

## 3. 开发配置文件

### 📄 jsconfig.json
**作用**：VS Code 的 JavaScript 项目配置文件
```json
{
  "include": ["main.js","webviewController.js","settingController.js","/Users/linlifei/extension/FeliksPro/.out/index.d.ts","utils.js"]
}
```
- 告诉 VS Code 哪些文件属于这个项目
- 引入了 TypeScript 定义文件，提供更好的代码提示
- 改善了 IDE 的智能感知和自动补全功能

### 📄 package.json
**作用**：Node.js 项目配置文件（当前为空）
- 通常用于管理项目依赖和脚本
- 在这个项目中可能是占位文件
- 未来可能用于管理开发依赖（如 Prettier、ESLint 等）

### 📄 package-lock.json
**作用**：NPM 依赖锁定文件
- 锁定具体的依赖版本
- 确保不同开发环境安装相同版本的依赖
- 与 package.json 配合使用

---

## 3. 测试文件

### 📄 test.html
**作用**：简单的 JSON 语法高亮编辑器测试页面
- 独立的轻量级 JSON 编辑器实现
- 使用 highlight.js 库实现语法高亮
- 支持实时编辑和格式化
- 可能用于测试简单的 JSON 编辑功能

**特点**：
- 支持中文输入法（compositionstart/end 事件处理）
- 自动格式化 JSON
- 保持光标位置
- 响应式设计，支持移动设备

### 📄 test.json
**作用**：测试数据文件
- 包含一个复杂的嵌套 JSON 结构
- 内容是关于信号处理的数学公式解释
- 用于测试 JSON 编辑器对复杂数据的处理能力
- 测试对 LaTeX 数学公式的支持（$...$）

---

## 4. 图标资源文件

### 🎨 图标文件分类

#### 颜色图标（color0.png - color15.png）
**作用**：MarginNote 的 16 种颜色标记
- 对应 MarginNote 的颜色索引系统（0-15）
- 用于工具栏上的颜色选择按钮
- 让用户快速为笔记设置颜色

#### 自定义按钮图标（custom1.png - custom19.png）
**作用**：可自定义功能的按钮图标
- 为扩展功能预留的图标位置
- 用户可以自定义这些按钮的功能
- 通过配置文件关联到具体的动作

#### 功能图标
每个图标对应工具栏的一个具体功能：

| 图标文件 | 功能说明 |
|---------|---------|
| ai.png | AI 相关功能 |
| bigbang.png | Big Bang 文本处理 |
| clearFormat.png | 清除格式 |
| compact.png | 紧凑视图 |
| copyAsMarkdownLink.png | 复制为 Markdown 链接 |
| copyExcerptPic.png | 复制摘录图片 |
| curve.png | 曲线/路径相关 |
| edit.png | 编辑功能 |
| execute.png | 执行/运行 |
| logo.png | 插件图标 |
| moveDown.png | 向下移动 |
| moveUp.png | 向上移动 |
| ocr.png | OCR 文字识别 |
| padding.png | 边距/间距调整 |
| pasteAsTitle.png | 粘贴为标题 |
| redo.png | 重做 |
| reload.png | 重新加载 |
| run.png | 运行 |
| search.png | 搜索 |
| searchInEudic.png | 在欧路词典中搜索 |
| setting.png | 设置 |
| sidebar.png | 侧边栏 |
| smartLocationOn.png | 智能定位 |
| snipaste.png | 截图工具 |
| stop.png | 停止 |
| switchTitleorExcerpt.png | 切换标题/摘录 |
| template.png | 模板 |
| timer.png | 定时器 |
| undo.png | 撤销 |
| LorR.png | 左右切换 |

---

## 🔧 文件之间的关系

```
工具栏功能
    │
    ├─ 按钮配置
    │   ├─ jsoneditor.html (编辑界面)
    │   ├─ jsoneditor.js (编辑逻辑)
    │   └─ jsoneditor.css (编辑器样式)
    │
    ├─ 按钮图标
    │   ├─ 颜色图标 (color*.png)
    │   ├─ 功能图标 (各种功能.png)
    │   └─ 自定义图标 (custom*.png)
    │
    └─ 开发支持
        ├─ jsconfig.json (IDE 配置)
        ├─ test.html (测试编辑器)
        └─ test.json (测试数据)
```

## 💡 开发建议

1. **添加新功能按钮时**：
   - 准备对应的 PNG 图标文件
   - 在 jsoneditor.html 的 actionNames 数组中添加新动作
   - 在按钮注册表中配置新按钮

2. **修改 JSON 编辑器时**：
   - 优先修改 jsoneditor.js（开发版）
   - 测试完成后压缩为 jsoneditor.min.js
   - 同时更新 CSS 文件

3. **测试复杂配置时**：
   - 使用 test.json 作为模板
   - 在 test.html 中进行简单测试
   - 在 jsoneditor.html 中进行完整测试

## 📝 总结

这些"其他文件"虽然不是核心功能代码，但它们共同构成了 MN Toolbar 的完整生态：
- **JSON 编辑器**提供了友好的配置界面
- **开发配置**改善了开发体验
- **测试文件**确保了功能的稳定性
- **图标资源**提供了直观的用户界面

每个文件都有其特定的作用，共同支撑着工具栏插件的正常运行和良好的用户体验。

---

## ⚠️ 文件修改指南

### ✅ 可以安全修改的文件
- **test.html / test.json**：测试文件，随意修改
- **自定义图标 (custom*.png)**：可以替换为自己的图标
- **jsconfig.json**：根据开发环境调整配置

### ⚡ 谨慎修改的文件
- **jsoneditor.html**：修改 actionNames 数组时要同步更新相关代码
- **功能图标**：替换时保持相同的尺寸和格式

### 🚫 不建议修改的文件
- **jsoneditor.min.js / jsoneditor.min.css**：压缩文件，应该通过源文件生成
- **jsoneditor-icons.svg**：编辑器的核心图标集
- **颜色图标 (color*.png)**：与 MarginNote 系统对应，不要修改