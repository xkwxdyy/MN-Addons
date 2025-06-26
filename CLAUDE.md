# ✅ 开发与协作规范（学习与编程行为指南）

> 本规范适用于你参与的全部开发任务，条款为强制性，除非用户显式豁免，任何条目都不得忽视或删减。
>
> - 每次输出前必须深度理解项目背景、用户意图和技术栈特征；
> - 当回答依赖外部知识或信息不确定时，先查询至少一份权威资料（官方文档、标准或源码）再作结论；
> - 引用外部资料须在回复中注明来源；可使用链接或版本号，保证可追溯；
> - 若用户需求含糊，先用一句话复述已知信息，并列出关键澄清问题，待用户确认后再继续；
> - 同一次回复中的术语、变量名、逻辑描述保持一致；发现冲突必须立即修正；
> - 仅回答与问题直接相关内容，避免冗余、无关扩展或教程式铺陈；
> - 面对复杂需求，先拆分为若干可管理子任务，在输出中按子任务顺序呈现，便于用户跟进；
>
> 所有技术输出必须建立在准确、思考过的基础之上，拒绝机械生成与无脑填充。
> 如果你已经了解所有的规范，你需要在用户第一次进行对话时先说明 "我已充分了解开发与写作规范。"，随后再执行用户需求。

## MN Toolbar Pro 项目专属规范

### 1. JSB 架构最佳实践

1. **单例模式获取**：
   - ✅ 使用 `const getFooController = ()=>self` 模式定义获取器
   - ✅ 在方法内部通过 `let self = getFooController()` 获取实例
   - ❌ 避免直接使用 `this` 或全局 `self`

2. **类定义规范**：
   ```javascript
   // ✅ 正确示例
   var FooController = JSB.defineClass('FooController : UIViewController', {
     viewDidLoad: function() {
       let self = getFooController()
       // 初始化逻辑
     }
   })
   ```

3. **观察者模式**：
   - 在 `sceneWillConnect` 或 `notebookWillOpen` 中添加观察者
   - 在 `sceneDidDisconnect` 或 `notebookWillClose` 中必须移除观察者
   - 使用 `MNUtil.addObserver/removeObserver` 统一管理

### 2. UI 开发规范

1. **Frame 操作**：
   - 优先使用 `Frame` 工具类而非直接操作 frame
   - ✅ `Frame.set(view, x, y, width, height)`
   - ❌ `view.frame = {x: 10, y: 10, width: 100, height: 50}`

2. **手势处理**：
   ```javascript
   // ✅ 正确的手势添加方式
   self.addPanGesture(self.view, "onMoveGesture:")
   self.addLongPressGesture(button, "onLongPressGesture:")
   ```

3. **颜色与样式**：
   - 使用 `MNUtil.hexColorAlpha()` 处理颜色
   - shadow、corner radius 等样式集中在 `viewDidLoad` 中设置
   - 保持 iOS/macOS 平台一致的视觉体验

### 3. 内存与生命周期管理

1. **必须清理的资源**：
   - NSNotificationCenter 观察者
   - 定时器（NSTimer）
   - 手势识别器引用
   - 控制器强引用

2. **生命周期方法**：
   ```javascript
   notebookWillOpen: async function(notebookid) {
     // 初始化资源
     if (!(await toolbarUtils.checkMNUtil(true))) return
     // 设置状态
   },
   
   notebookWillClose: function(notebookid) {
     // 保存状态
     toolbarConfig.windowState.frame = self.view.frame
     // 清理资源
   }
   ```

### 4. 错误处理规范

1. **try-catch 包装**：
   - 所有主要方法必须使用 try-catch
   - 错误日志使用 `toolbarUtils.addErrorLog(error, methodName, info)`
   
2. **边界检查**：
   ```javascript
   // ✅ 安全检查
   if (typeof MNUtil === 'undefined') return
   if (!(await toolbarUtils.checkMNUtil(true))) return
   ```

### 5. 配置管理

1. **配置持久化**：
   - 窗口状态使用 `toolbarConfig.getWindowState/setWindowState`
   - 用户配置保存在 `toolbar_config.json`
   - 配置变更需要云同步考虑

2. **动态配置**：
   ```javascript
   // 读取配置
   let lastFrame = toolbarConfig.getWindowState("frame")
   // 保存配置
   toolbarConfig.windowState.frame = self.view.frame
   ```

### 6. 平台兼容性

1. **平台检测**：
   ```javascript
   self.isMac = MNUtil.version.type === "macOS"
   if (self.isMac) {
     // macOS 特定逻辑
   } else {
     // iOS 特定逻辑
   }
   ```

2. **交互差异**：
   - macOS：考虑鼠标悬停、右键菜单
   - iOS：考虑触摸手势、屏幕旋转

### 7. 工具栏动作系统

1. **动作定义**：
   - 在 `availableActionOptions` 中集中定义
   - 每个动作必须有 `id`、`title`、`group`
   - 复杂动作提供 `callback` 函数

2. **按钮创建**：
   ```javascript
   self.createButton("buttonName", "selectorName:")
   self.setButtonLayout(button, "actionSelector:")
   ```

### 8. 调试与日志

1. **调试输出**：
   - 用户可见：`MNUtil.showHUD("message")`
   - 控制台：`console.log()` (仅开发模式)
   - 错误日志：`toolbarUtils.addErrorLog()`

2. **性能监控**：
   - 大文档测试内存使用
   - 动画流畅度检查
   - 响应时间优化

### 9. 集成规范

1. **插件通信**：
   ```javascript
   // 获取其他插件实例
   const otherAddon = Application.sharedInstance().addon.otherAddon
   // 检查可用性
   if (otherAddon && otherAddon.alive) {
     // 安全调用
   }
   ```

2. **通知中心**：
   - 使用 MarginNote 定义的通知名称
   - 跨插件通信遵循既定协议

### 10. 代码组织

1. **文件职责**：
   - `main.js`: 插件入口和生命周期
   - `webviewController.js`: 工具栏 UI 管理
   - `settingController.js`: 设置界面
   - `utils.js`: 通用工具函数

2. **命名空间**：
   - 工具函数使用 `MNUtil.` 前缀
   - 配置相关使用 `toolbarConfig.`
   - 框架操作使用 `Frame.`

### 11. 源码阅读规范

1. **完整阅读原则**：
   - 【极其重要】必须完整阅读整个文件，不能只读取前面一部分，避免断章取义
   - 理解上下文依赖和完整的业务逻辑
   - 注意文件间的引用关系和依赖链

2. **大文件处理策略**：
   - 超过 500 行的文件应分段阅读
   - 每段控制在 100-200 行，保持逻辑完整性
   - 记录段间的关联关系和数据流向

3. **阅读顺序**：
   - 先读入口文件 `main.js` 理解整体架构
   - 再读工具类 `utils.js` 了解基础设施
   - 最后读具体功能模块，理解业务实现

4. **关注要点**：
   - 类的继承关系和协议实现
   - 生命周期方法的调用时机
   - 事件监听器的注册与清理
   - 单例模式的实现细节
   - 异步操作的处理方式