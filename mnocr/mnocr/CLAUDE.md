# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## MN OCR 插件架构

### 插件概述
MN OCR 是 MarginNote 4 的 OCR（光学字符识别）插件，支持从图片和 PDF 文档中提取文本，包括数学公式识别。

### 核心技术栈
- **框架依赖**：MNUtils（必需，提供 MarginNote API 封装）
- **加密库**：CryptoJS.js（API 密钥加密）
- **OCR 服务**：SimpleTex、Doc2X、OpenAI Vision API
- **UI 框架**：基于 UIKit 的自定义视图控制器

## 项目结构

### 主要文件
- `main.js` - 插件生命周期管理和初始化
- `webviewController.js` - OCR 控制器 UI 和交互逻辑
- `utils.js` - 工具类和配置管理
- `mnaddon.json` - 插件配置清单

### 核心类架构

#### MNOCRClass (main.js)
- 管理插件生命周期事件
- 处理窗口、笔记本和文档的打开/关闭事件
- 控制插件在不同学习模式下的显示

#### ocrController (webviewController.js)
- 浮动 OCR 面板 UI 控制器
- 包含多种 OCR 操作按钮：
  - OCR → Comment/Option/Excerpt/ChildNote/Editor
  - PDF OCR → Buffer/Export/Clipboard/Editor
  - 翻译功能切换
  - 缓冲区清理

#### ocrUtils (utils.js)
- MarginNote API 封装
- 错误日志管理
- 剪贴板操作
- 笔记和文档操作

#### ocrConfig (utils.js)
- OCR 服务配置管理
- API 密钥存储
- 支持的 AI 模型配置（40+ 模型）
- 用户配置持久化

## 开发命令

### 打包插件
```bash
# 在 mnocr 目录下
mnaddon4 build mnocr
```

### 安装插件
将生成的 `.mnaddon` 文件拖拽到 MarginNote 4 中安装

## OCR 服务集成

### 支持的 OCR 源
1. **SimpleTex** - 数学公式识别专用
   - 支持 Turbo/General 模式
   - 自动旋转检测
   - 图像校正

2. **Doc2X** - 通用文档 OCR
   - 支持 PDF 文档识别
   - 批量处理

3. **OpenAI Vision** - 基于 AI 模型的 OCR
   - 支持 40+ AI 模型（GPT、Claude、Gemini、GLM 等）
   - 自定义提示词
   - 免费/付费模型区分

### OCR 工作流程

#### 单张图片 OCR
1. 选择笔记中的图片
2. 点击对应的 OCR 按钮（Comment/Excerpt 等）
3. 选择 OCR 源和配置
4. 处理结果自动添加到笔记

#### PDF 文档 OCR
1. 打开 PDF 文档
2. 选择 PDF OCR 功能
3. 识别结果可以：
   - 保存到缓冲区
   - 导出为文件
   - 复制到剪贴板
   - 在编辑器中打开

## UI 交互特性

### 浮动面板
- 可拖拽移动（通过手势识别）
- 自动吸附边缘
- 阴影和圆角效果
- 半透明背景

### 按钮状态管理
- 动态显示/隐藏
- 根据学习模式（文档/脑图/复习）自动调整
- 设置面板展开/折叠

## 配置存储

### NSUserDefaults 键
- `MNOCR` - 主配置对象
- `MNOCR_fileIds` - 文件 ID 缓存

### 配置项
```javascript
{
  source: "SimpleTex",          // 默认 OCR 源
  simpleTexApikey: "",          // SimpleTex API 密钥
  doc2xApikey: "",              // Doc2X API 密钥
  openaiApikey: "",             // OpenAI API 密钥
  imageCorrection: false,       // 图像校正
  pureEquation: false,          // 纯公式模式
  PDFOCR: false,               // PDF OCR 开关
  userPrompt: "...",           // AI 提示词
  action: {}                   // 动作配置
}
```

## 错误处理

### 错误日志系统
- 自动捕获异常并显示 HUD
- 错误日志复制到剪贴板
- 包含错误源、时间戳和堆栈信息

### MNUtils 依赖检查
- 启动时验证 MNUtils 是否加载
- 版本兼容性检查
- 缺失时显示提示信息

## 注意事项

### 学习模式限制
- 插件仅在文档模式（studyMode < 3）下显示
- 复习模式自动隐藏 OCR 面板

### 性能优化
- 使用 `undoGrouping` 批量修改笔记
- 延迟初始化非关键组件
- 缓存常用配置和数据

### 安全考虑
- API 密钥使用 CryptoJS 加密存储
- 敏感信息不记录到日志
- 网络请求错误处理

## 调试技巧

### 日志查看
```javascript
MNUtil.log({
  source: "MN OCR",
  message: "调试信息",
  level: "INFO",
  detail: JSON.stringify(data)
})
```

### 错误追踪
- 错误自动复制到剪贴板
- 检查 `ocrUtils.errorLog` 数组
- 使用 `MNUtil.copyJSON()` 导出对象

### UI 调试
- 使用 `MNUtil.showHUD()` 显示临时消息
- 检查视图层级：`MNUtil.isDescendantOfStudyView()`
- 帧调试：`ocrUtils.setFrame()` 和 `currentFrame` 属性