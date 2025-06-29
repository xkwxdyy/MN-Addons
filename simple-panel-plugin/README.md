# Simple Panel Plugin - MarginNote 插件框架示例

这是一个精简的 MarginNote 插件框架示例，展示了如何创建一个点击插件栏图标后显示控制面板的插件。已优化使用 MNUtils 的 MNButton 和 Menu 类。

## 📚 版本说明

- **simplePanelController.js**: 基础版本，展示基本功能和降级处理
- **simplePanelControllerOptimized.js**: 优化版本，展示 MNButton 和 Menu 类的高级用法

## 功能特性

- ✅ 在插件栏显示图标
- ✅ 点击图标显示/隐藏浮动控制面板
- ✅ 支持拖动面板位置
- ✅ 支持调整面板大小
- ✅ 包含输入框、输出框、按钮和菜单
- ✅ 集成 MNUtils API（使用 MNButton 和 Menu 类）
- ✅ 提供降级方案
- ✅ 长按手势支持（长按复制按钮清空内容）
- ✅ 菜单自定义（行高、字体大小）

## 快速开始

### 1. 准备图标

创建一个 44x44 像素的 PNG 图标，命名为 `logo.png`，放在插件根目录。

### 2. 修改插件信息

编辑 `mnaddon.json`，修改插件 ID、作者和标题：

```json
{
  "addonid": "marginnote.extension.your-plugin",
  "author": "Your Name",
  "title": "Your Plugin Name",
  "version": "1.0",
  "marginnote_version_min": "3.7.11",
  "cert_key": ""
}
```

### 3. 定制功能

在 `simplePanelController.js` 中修改 `executeAction` 方法来实现你的功能：

```javascript
executeAction: function() {
  var self = this;
  var text = self.inputField.text;
  
  // 在这里实现你的功能
  var result = processText(text);
  
  self.outputField.text = result;
}
```

### 4. 打包插件

使用 mnaddon4 工具打包：

```bash
# 在插件目录内执行
mnaddon4 build mnaddon
```

### 5. 安装测试

将 `.mnaddon` 文件拖入 MarginNote 安装。

## 📁 文件说明

```
simple-panel-plugin/
├── mnaddon.json       # 插件配置
├── main.js            # 插件主入口
├── simplePanelController.js          # 基础版控制面板
├── simplePanelControllerOptimized.js # 优化版控制面板
├── logo.png           # 插件图标 (44x44)
├── jsconfig.json      # JS 文件配置
├── README.md          # 说明文档
└── CLAUDE.md          # 开发文档（MNButton/Menu 最佳实践）
```

## 主要功能说明

### 文本处理选项

示例插件包含 4 种文本处理功能：
1. 转大写
2. 转小写  
3. 首字母大写
4. 反转文本

点击"选项"按钮可以切换不同的处理模式。

### UI 元素

- **输入框** - 输入要处理的文本
- **输出框** - 显示处理结果
- **执行按钮** - 执行当前选中的处理
- **选项按钮** - 显示功能菜单
- **复制按钮** - 复制输出结果

### 交互功能

- **拖动** - 拖动标题栏移动面板
- **调整大小** - 拖动右下角调整面板大小
- **自动填充** - 选中文档文本后点击插件图标自动填充

## MNUtils 集成

插件会自动检测 MNUtils 是否可用，并优先使用其高级 API。

### MNButton 类使用示例

```javascript
// 创建高级按钮
var button = MNButton.new({
  title: "按钮文字",
  font: 16,
  color: "#5982c4",     // 支持 hex 颜色
  radius: 8,            // 圆角半径
  opacity: 0.9,         // 透明度
  highlight: UIColor.redColor()  // 高亮颜色
}, parentView);

// 添加点击事件
button.addClickAction(self, "handleClick:");

// 添加手势
button.addLongPressGesture(self, "handleLongPress:", 0.5);  // 0.5秒触发
button.addPanGesture(self, "handlePan:");  // 拖动手势
button.addSwipeGesture(self, "handleSwipe:");  // 滑动手势

// 动态修改属性
button.title = "新标题";
button.color = "#ff0000";
button.hidden = false;
button.frame = {x: 10, y: 10, width: 100, height: 40};
```

### Menu 类使用示例

```javascript
// 创建高级菜单
var menu = new Menu(button, self, 250, 2);  // sender, delegate, width, position

// 添加菜单项
menu.addMenuItem("选项1", "action1:", param1, true);  // 最后一个参数是 checked
menu.addMenuItem("选项2", "action2:", param2, false);

// 自定义样式
menu.rowHeight = 40;    // 行高
menu.fontSize = 16;     // 字体大小

// 显示菜单
menu.show();

// 手动关闭菜单
menu.dismiss();

// 批量添加菜单项
menu.addMenuItems([
  {title: "批量1", selector: "batchAction:", param: 1},
  {title: "批量2", selector: "batchAction:", param: 2}
]);
```

### 降级方案

当 MNUtils 不可用时，插件会自动降级到原生 API：

```javascript
if (typeof MNButton !== "undefined") {
  // 使用 MNButton
  self.button = MNButton.new({...}, view);
} else {
  // 使用原生 UIButton
  self.button = UIButton.buttonWithType(0);
  // 手动设置样式...
}
```

## 开发建议

1. **保持简洁** - main.js 只处理生命周期，功能逻辑放在控制器中
2. **错误处理** - 使用 try-catch 包裹可能出错的代码
3. **用户体验** - 提供视觉反馈，保存用户配置
4. **性能优化** - 避免频繁的 UI 更新，及时释放资源

## 扩展方向

基于这个框架，你可以：

- 添加更多 UI 元素（开关、滑块、选择器等）
- 集成外部 API（翻译、搜索等）
- 处理笔记和文档（创建、修改、链接等）
- 实现数据持久化（保存配置和历史）
- 添加快捷键支持

## 注意事项

- 图标必须是 44x44 像素
- 只在文档/学习模式下显示，不在复习模式显示
- 始终检查 MNUtils 是否可用
- 在 `sceneDidDisconnect` 中清理资源

## 🆕 使用优化版本

优化版本展示了更多 MNButton 和 Menu 的高级特性：

### 优化版新增功能

1. **工具栏按钮组**
   - 使用 MNButton 创建的 emoji 按钮
   - 支持长按显示提示
   - 悬停高亮效果

2. **多种菜单示例**
   - 设置菜单：带选中状态的选项
   - 模式菜单：动态生成菜单项
   - 历史菜单：显示最近记录

3. **高级功能**
   - 状态指示器：显示操作状态
   - 最小化功能：收起/展开面板
   - 历史记录：保存处理历史
   - 配置管理：导入/导出配置
   - 可视化调整手柄

### 如何切换到优化版

```bash
# 1. 备份原文件
cp simplePanelController.js simplePanelController.bak.js

# 2. 使用优化版
cp simplePanelControllerOptimized.js simplePanelController.js

# 3. 重新打包
mnaddon4 build mnaddon
```

### 优化版代码亮点

1. **Emoji 工具栏**
```javascript
const tools = [
  { icon: "🔄", action: "processText:", tooltip: "处理文本" },
  { icon: "📋", action: "copyOutput:", tooltip: "复制结果" },
  { icon: "🔧", action: "showModeMenu:", tooltip: "选择模式" }
];
```

2. **动态状态更新**
```javascript
self.statusIndicator.backgroundColor = "#4CAF50";
NSTimer.scheduledTimerWithTimeInterval(0.5, false, () => {
  self.statusIndicator.backgroundColor = "#00000020";
});
```

3. **完整的配置管理**
```javascript
exportConfig: function() {
  const configStr = JSON.stringify(self.config, null, 2);
  UIPasteboard.generalPasteboard().string = configStr;
  MNUtil.showHUD("配置已复制到剪贴板");
}
```

## 📄 相关资源

- [MN-Addon 项目文档](../CLAUDE.md)
- [MNUtils API 指南](../MNUTILS_API_GUIDE.md)
- [Simple Panel 开发文档](./CLAUDE.md) - 包含 MNButton 和 Menu 的详细最佳实践
- [MarginNote 官网](https://www.marginnote.com/)