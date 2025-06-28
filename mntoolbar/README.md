# MN Toolbar Pro

<div align="center">
  <img src="mntoolbar/logo.png" alt="MN Toolbar Pro Logo" width="128" />
  
  **一个功能强大、高度可定制的 MarginNote 4 工具栏插件**
  
  基于 Feliks 开发的 [MN Toolbar 插件(https://mnaddon.craft.me/x/29BBC229-D579-44E6-AD08-6F5CCE47FF67)，采用解耦架构设计，让你轻松定制专属功能。
  
  [![MarginNote Version](https://img.shields.io/badge/MarginNote-3.7.11+-blue)](https://www.marginnote.com/)
  [![Plugin Version](https://img.shields.io/badge/version-0.1.3.alpha0427-green)](https://github.com/xkwxdyy/https://github.com/xkwxdyy/MN-Toolbar-Pro)
</div>

---

## 👨‍💻 开发指南

### 项目架构

```
mntoolbar/
├── 核心文件（不建议修改）
│   ├── main.js                    # 插件入口，生命周期管理
│   ├── webviewController.js       # 工具栏 UI 管理
│   ├── settingController.js       # 设置界面管理
│   └── utils.js                   # 通用工具函数
│
└── 扩展文件（自定义功能）
    ├── xkwxdyy_button_registry.js    # 按钮配置注册表
    ├── xkwxdyy_menu_registry.js      # 菜单模板注册表
    ├── xkwxdyy_custom_actions_registry.js # 动作处理注册表
    └── xkwxdyy_utils_extensions.js   # 工具函数扩展
```

### 添加自定义功能（三步法）

#### 第 1 步：注册按钮

在 `xkwxdyy_button_registry.js` 中：

```javascript
global.registerButton("myButton", {
  name: "我的功能",
  image: "myIcon",          // 图标文件名（不含 .png）
  templateName: "menu_myfunction"
});
```

#### 第 2 步：定义菜单

在 `xkwxdyy_menu_registry.js` 中：

```javascript
// 简单按钮
global.registerMenuTemplate("menu_myfunction", {
  action: "myAction"
});

// 或带菜单
global.registerMenuTemplate("menu_myfunction", {
  action: "menu",
  menuItems: [
    {
      action: "myAction1",
      menuTitle: "功能一"
    },
    {
      action: "myAction2",
      menuTitle: "功能二"
    }
  ]
});
```

#### 第 3 步：实现功能

在 `xkwxdyy_custom_actions_registry.js` 中：

```javascript
global.registerCustomAction("myAction", async function(context) {
  const { button, des, focusNote, focusNotes, self } = context;
  
  MNUtil.undoGrouping(() => {
    try {
      // 你的功能实现
      if (focusNote) {
        focusNote.noteTitle = "已处理: " + focusNote.noteTitle;
        MNUtil.showHUD("✅ 处理成功");
      }
    } catch (error) {
      MNUtil.showHUD(`❌ 错误: ${error.message}`);
    }
  });
});
```

### 开发规范

1. **命名规范**
   - 使用语义化命名：`getUserInfo` 而非 `getInfo`
   - 避免缩写：`error` 而非 `err`
   - 常量使用大写：`MAX_RETRY_COUNT`

2. **代码风格**
   - 使用 2 空格缩进
   - 优先使用箭头函数
   - 使用模板字符串

3. **错误处理**
   - 始终使用 `MNUtil.undoGrouping` 包裹修改操作
   - 提供清晰的错误提示
   - 记录错误日志

4. **性能优化**
   - 批量操作使用事务
   - 避免频繁 UI 更新
   - 大量数据处理使用异步

## 📚 API 参考

### MNUtil 常用方法

```javascript
// UI 反馈
MNUtil.showHUD("消息内容")

// 撤销分组
MNUtil.undoGrouping(() => {
  // 你的操作
})

// 延迟执行
await MNUtil.delay(0.5)  // 延迟 0.5 秒

// 剪贴板操作
MNUtil.copy("文本内容")
MNUtil.copyJSON(object)

// 日志记录
MNUtil.log("日志信息")
```

### 卡片操作 API

```javascript
// 获取卡片
const focusNote = MNNote.getFocusNote()      // 当前选中的卡片
const allNotes = MNNote.getFocusNotes()      // 所有选中的卡片

// 卡片属性
note.noteId          // 卡片 ID
note.noteTitle       // 标题
note.excerptText     // 摘录文本
note.parentNote      // 父卡片
note.childNotes      // 子卡片数组

// 卡片方法
note.appendNoteTitle("追加标题")
note.appendTextComment("追加评论")
note.appendTags(["标签1", "标签2"])
note.refresh()       // 刷新显示
```

### UI 组件

```javascript
// 弹窗输入
UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
  "标题",
  "提示信息",
  2,  // 输入框样式
  "取消",
  ["确定"],
  (alert, buttonIndex) => {
    if (buttonIndex === 1) {
      const input = alert.textFieldAtIndex(0).text;
      // 处理输入
    }
  }
);

// 显示菜单
MNUtil.showMenu(menuItems, menuWidth)
```

## 🔧 故障排除

### 常见问题

**Q: 插件无法加载**
- 确保 MarginNote 版本 ≥ 3.7.11
- 检查插件文件是否完整
- 尝试重启 MarginNote

**Q: 按钮不显示**
- 使用 `global.forceRefreshButtons()` 强制刷新
- 检查按钮注册代码是否正确
- 查看控制台是否有错误信息

**Q: 功能执行失败**
- 检查是否选中了卡片
- 确认动作名称拼写正确
- 查看错误日志定位问题

### 调试技巧

1. **启用日志**
   ```javascript
   MNUtil.log("🔍 调试信息")
   ```

2. **检查对象**
   ```javascript
   MNUtil.copyJSON(object)  // 复制到剪贴板查看
   ```

3. **错误追踪**
   ```javascript
   toolbarUtils.addErrorLog(error, "functionName")
   ```

### 性能优化

- 批量操作使用 `MNUtil.undoGrouping`
- 避免在循环中更新 UI
- 大文档测试内存占用
- 使用异步操作避免阻塞

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出建议！

### 如何贡献

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

### 提交规范

使用语义化提交信息：
- `feat:` 新功能
- `fix:` 修复问题
- `docs:` 文档更新
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建/工具相关

### 开发环境设置

1. 克隆仓库
   ```bash
   git clone https://github.com/xkwxdyy/https://github.com/xkwxdyy/MN-Toolbar-Pro.git
   cd mntoolbar
   ```

2. 安装依赖（如需要）
   ```bash
   npm install
   ```

3. 格式化代码
   ```bash
   npx prettier --write "**/*.js" --tab-width 2
   ```

## 📝 更新日志

### v0.1.3.alpha0427 (2024-04-27)
- ✨ 实现解耦架构设计
- 🎯 添加自定义按钮注册系统
- 🔧 优化菜单模板管理
- 🐛 修复若干已知问题

### 更早版本
请查看 [Releases](https://github.com/xkwxdyy/https://github.com/xkwxdyy/MN-Toolbar-Pro/releases) 页面

## 📄 许可证

本项目基于原版 MN Toolbar 的开源协议。建议添加适当的开源许可证文件。

## 🙏 致谢

- 感谢 Feliks 开发的原版 MN Toolbar 插件
- 感谢 MarginNote 团队提供的插件开发框架


## 📮 联系方式

- 问题反馈：[GitHub Issues](https://github.com/xkwxdyy/https://github.com/xkwxdyy/MN-Toolbar-Pro/issues)
- 功能建议：[GitHub Discussions](https://github.com/xkwxdyy/https://github.com/xkwxdyy/MN-Toolbar-Pro/discussions)

---

<div align="center">
  <b>Happy Note Taking! 📚</b>
</div>