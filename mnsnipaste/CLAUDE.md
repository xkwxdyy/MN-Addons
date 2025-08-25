# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## MN Snipaste 插件说明

MN Snipaste 是一个 MarginNote 插件，提供类似 Snipaste 的截图贴图功能，让用户能够快速捕获和展示内容（包括图片、PDF、笔记卡片、HTML、Mermaid 图表等）。

## 核心架构

### 技术栈
- **语言**: JavaScript (JSBridge)
- **UI 框架**: UIKit (通过 JSBridge)
- **WebView**: UIWebView 用于渲染 HTML 内容
- **依赖**: MNUtils 框架（必需）

### 主要文件结构
```
mnsnipaste/
├── main.js              # 插件主入口，生命周期管理
├── webviewController.js # WebView 控制器，UI 管理
├── utils.js             # 工具类和辅助函数
├── mnaddon.json        # 插件配置清单
└── 资源文件/
    ├── *.png           # UI 图标资源
    ├── *.html          # HTML 模板文件
    └── *.js            # 第三方库（mermaid, pdf.js等）
```

## 开发和构建命令

### 插件安装
1. 将 `.mnaddon` 文件夹复制到 MarginNote 的插件目录
2. 重启 MarginNote

### 调试
- 使用 `MNUtil.log()` 记录日志
- 使用 `MNUtil.showHUD()` 显示调试信息
- 错误日志通过 `snipasteUtils.addErrorLog()` 记录并复制到剪贴板

## 核心功能模块

### 1. 内容捕获系统
- **图片捕获**: 从选中区域、剪贴板、笔记卡片获取图片
- **PDF 捕获**: 支持当前页、首页、末页的 PDF 快照
- **笔记卡片**: 渲染完整的笔记内容（标题、摘录、评论）
- **HTML 内容**: 支持富文本和自定义 HTML 渲染
- **Mermaid 图表**: 动态渲染流程图和图表

### 2. WebView 管理
- **动态布局**: 支持拖动、缩放、最小化
- **自定义模式**: 左侧、右侧、全屏等预设布局
- **历史导航**: 前进/后退功能管理浏览历史

### 3. 通知系统
使用 NSNotificationCenter 监听各种事件：
- `snipasteNote`: 贴图笔记
- `snipasteImage`: 贴图图片
- `snipastePDF`: 贴图 PDF
- `snipasteHtml`: 贴图 HTML
- `snipasteMermaid`: 贴图 Mermaid

### 4. URL Scheme 处理
支持自定义 URL Scheme 进行插件间通信：
- `snipaste://` - 主要的插件操作
- `marginnote3app://` - MarginNote 内部导航

## 重要的实现细节

### 多窗口支持
插件需要正确处理 MarginNote 的多窗口场景：
```javascript
if (self.window !== MNUtil.currentWindow) {
    return; // 忽略非当前窗口的事件
}
```

### 图片处理
- 自动计算缩放比例以适应窗口
- 支持 PNG 转 PDF（使用 jsPDF 库）
- Base64 编码/解码处理

### 错误处理
所有关键操作都包含 try-catch：
```javascript
try {
    // 操作代码
} catch (error) {
    snipasteUtils.addErrorLog(error, "functionName", additionalInfo)
}
```

### WebView 安全
- 使用 `securityLevel: 'strict'` 渲染 Mermaid
- HTML 内容进行转义处理
- 限制跨域请求

## 性能优化要点

1. **延迟加载**: 使用 `snipasteUtils.delay()` 避免阻塞
2. **缓存管理**: 历史记录使用 `SnipasteHistoryManager` 类管理
3. **资源释放**: 窗口关闭时移除所有观察者
4. **批量操作**: 尽量减少 DOM 操作，使用文档片段

## 常见问题处理

### MNUtils 未加载
```javascript
if (!(await snipasteUtils.checkMNUtil(true))) return
```

### 图片尺寸计算
```javascript
const maxScale = calculateMaxScale(); // 避免画布超出浏览器限制
```

### WebView 内容更新
使用 `webview.loadHTMLStringBaseURL()` 或 `webview.evaluateJavaScript()` 更新内容

## 注意事项

1. **必须安装 MNUtils**: 插件依赖 MNUtils 框架的核心功能
2. **版本兼容**: 最低支持 MarginNote 3.7.11
3. **UI 响应**: 所有 UI 操作需要在主线程执行
4. **内存管理**: 大图片处理时注意内存占用
5. **错误日志**: 所有错误自动复制到剪贴板便于调试

## 扩展开发

### 添加新的贴图类型
1. 在 `utils.js` 添加处理函数
2. 在 `main.js` 注册新的通知观察者
3. 在 `webviewController.js` 添加渲染逻辑

### 自定义 HTML 模板
修改或添加新的 HTML 文件，使用 `snipasteUtils.getFullMermaindHTML()` 等工具函数生成完整 HTML

### 集成第三方库
1. 将库文件放入插件目录
2. 在 HTML 模板中通过 `<script>` 标签加载
3. 使用 `loadHtml2CanvasScript()` 等函数动态加载