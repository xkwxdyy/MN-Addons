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

### 12. JSB 文件加载与代码解耦规范

1. **文件加载时机**：
   - JSB.require 必须在被依赖的类定义之后调用
   - ❌ 错误：在文件开头调用 `JSB.require('extension')`，此时类还未定义
   - ✅ 正确：在文件末尾、所有类定义完成后调用

2. **文件路径规范**：
   ```javascript
   // ✅ 正确
   JSB.require('xdyy_utils_extensions')
   // ❌ 错误（不需要 .js 后缀）
   JSB.require('xdyy_utils_extensions.js')
   ```

3. **核心功能不宜解耦**：
   - toolbarConfig 的核心方法（如 togglePreprocess）应保留在 utils.js 中
   - 配置项（defaultWindowState、referenceIds）应在原始位置初始化
   - 原因：JSB 架构对作用域和初始化顺序有严格要求

4. **静态方法 vs 实例方法**：
   ```javascript
   // ✅ 原始代码使用静态方法
   static togglePreprocess() { ... }
   
   // ❌ 错误地改为实例方法
   toolbarConfig.togglePreprocess = function() { ... }
   ```

5. **扩展策略**：
   - 工具函数可以通过 prototype 扩展（如 toolbarUtils）
   - 配置类的核心方法不建议通过外部文件扩展
   - 使用初始化函数模式时，注意调用时机和参数传递

6. **调试建议**：
   - 测试扩展函数是否可访问：`toolbarUtils.yourFunction()`
   - 验证文件是否加载：在扩展文件中添加 `MNUtil.showHUD("文件已加载")`
   - 检查方法类型：静态方法直接通过类名调用，实例方法需要实例

### 13. 自定义 Actions 解耦经验教训（2025.6.27）

1. **加载顺序问题**：
   - 问题：扩展文件试图访问 `toolbarController` 时报错 "ReferenceError: Can't find variable"
   - 原因：扩展文件在 `toolbarController` 定义之前就被加载和执行
   - 解决方案：
     - 使用延迟初始化（setTimeout）
     - 使用 eval 检查变量是否存在，避免直接引用导致错误
     - 扩展文件必须在 `webviewController.js` 加载之后加载

2. **初始化检查**：
   - 问题：`self.addonController.popupReplace()` 报错 "undefined is not an object"
   - 原因：`addonController` 可能还未初始化就被调用
   - 解决方案：在使用前调用 `self.ensureView()` 确保初始化
   
3. **方法重写的错误处理**：
   - 问题：扩展的 `customActionByDes` 中如果出错，功能会中断
   - 解决方案：
     ```javascript
     try {
       // 自定义处理逻辑
     } catch (error) {
       // 错误时也要调用原始方法，避免功能中断
       return await originalCustomActionByDes.call(this, button, des, checkSubscribe);
     }
     ```

4. **调试技巧**：
   - 在扩展文件中添加详细的日志输出
   - 使用计数器跟踪方法调用次数
   - 在关键位置使用 `MNUtil.showHUD()` 显示调试信息
   - 检查 action 是否进入 switch 的 default 分支（显示 "Not supported yet..."）
   
   **调试步骤**：
   - 启动时检查加载提示（如 "✅ 注册表已加载"）
   - 查看控制台日志确认初始化流程
   - 测试时观察是否有错误信息
   - 必要时增加延迟时间（setTimeout）

5. **扩展架构最佳实践**：
   ```javascript
   // 安全的初始化模式
   function initializeCustomActions() {
     // 使用 eval 避免直接引用错误
     let hasController = false;
     try {
       hasController = eval('typeof toolbarController') !== 'undefined';
     } catch (e) {}
     
     if (!hasController) {
       // 延迟重试
       setTimeout(initializeCustomActions, 100);
       return;
     }
     
     // 执行初始化
   }
   ```

6. **错误隔离原则**：
   - 扩展文件的错误不应影响主插件功能
   - 所有扩展操作都应该有 try-catch 包装
   - 加载失败时使用 console.error 而不是抛出异常

### 14. JSB 方法覆盖限制与注册表模式（2025.6.27 更新）

1. **Prototype 覆盖的失败教训**：
   - 问题：尝试通过 `toolbarController.prototype.customActionByDes = function()` 覆盖方法失败
   - 原因：JSB 框架的限制，prototype 修改可能不生效
   - 表现：自定义 actions 仍然进入 default 分支显示 "Not supported yet..."
   
   **JSB 框架深入分析**：
   - JSB 的类定义和方法重写机制与标准 JavaScript 不同
   - 方法调用可能不通过标准原型链查找
   - 实例化时机和方法绑定时机难以控制
   - 框架可能缓存了方法引用，导致运行时修改无效
   
2. **成功的注册表模式**：
   - 最小化主文件修改（仅修改 default 分支）
   - 使用全局对象存储自定义 actions
   - 实现代码：
   ```javascript
   // 注册表文件
   if (typeof global === 'undefined') {
     var global = {};
   }
   global.customActions = {};
   global.registerCustomAction = function(name, handler) {
     global.customActions[name] = handler;
   };
   
   // 主文件的 default 分支
   default:
     if (typeof global !== 'undefined' && global.executeCustomAction) {
       const context = { button, des, focusNote, focusNotes, self: this };
       const handled = await global.executeCustomAction(des.action, context);
       if (handled) break;
     }
     MNUtil.showHUD("Not supported yet...")
     break;
   ```

3. **Switch 语句中的 break 限制**：
   - 问题：提取的 case 代码包含 break 语句，在函数中执行会报 "Illegal break statement"
   - 解决：使用正则表达式移除所有 break 语句
   - 注意：某些复杂的 switch 语句需要特殊处理或简化

4. **复杂 Actions 的处理**：
   - 问题：某些 actions（如 TemplateMakeNotes）包含 150+ 行代码和嵌套 switch
   - 解决：为这些 actions 创建简化版本，保留核心功能
   - 示例：
   ```javascript
   // 简化复杂的 switch 语句
   if (case_name === 'TemplateMakeNotes') {
     return """简化的实现，避免语法错误"""
   }
   ```

5. **批量迁移的工具化**：
   - 使用 Python 脚本自动提取和转换 cases
   - 自动分组（reference、move、proof 等）
   - 自动修复语法问题（break 语句、不完整的 switch 等）

6. **文件组织最佳实践**：
   - 基础版：5 个 actions 用于测试
   - 精选版：30 个常用 actions
   - 完整版：所有 198 个 actions
   - 便于渐进式测试和部署

7. **注册表模式的优势**：
   - 真正的解耦：主文件修改最小（仅 4 行）
   - 易于维护：所有自定义代码集中管理
   - 向后兼容：未注册的 actions 保持原有行为
   - 动态加载：可以在运行时添加新 actions
   - 错误隔离：单个 action 错误不影响其他功能

8. **调试和测试建议**：
   - 使用 Node.js 的语法检查：`node -c filename.js`
   - 创建测试脚本验证所有文件语法
   - 分阶段测试：先测试基础版，再测试完整版
   - 保留原始备份文件便于对比和回滚

### 15. 注册表模式详解与开发指南（2025.6.27）

#### 1. 注册表模式通俗解释

**原理对比**：
- **原始方式**：像一个巨大的电话总机，所有线路都直接连在主机上
- **注册表模式**：像一个电话号码簿，主程序只需查号码簿找到对应功能

```javascript
// 注册表 = 电话号码簿
global.customActions = {
  "test": 处理test的函数,
  "moveProofDown": 处理moveProofDown的函数,
  // 所有功能都登记在这里
}
```

#### 2. Context 参数机制

**为什么需要 context**：
- 原始代码中，case 可以直接访问函数作用域内的变量
- 迁移后的函数独立存在，无法访问原函数的变量
- 需要把所有必要的变量"打包"传递

```javascript
// 主文件打包数据
const context = {
  button: button,          // 按钮对象
  des: des,               // 动作描述
  focusNote: focusNote,   // 当前笔记
  focusNotes: focusNotes, // 选中的笔记数组
  self: this              // 控制器实例
};

// 注册的函数"拆包"使用
global.registerCustomAction("test", async function(context) {
  const { focusNote, focusNotes } = context;  // 解构获取需要的变量
  // 每个函数都有自己独立的作用域，不会相互影响
});
```

#### 3. 特殊变量处理方法

**原则**：特殊变量应在函数内部、try 块外部定义

```javascript
// ✅ 正确做法
global.registerCustomAction("myAction", async function(context) {
  const { focusNote } = context;
  
  // 特殊变量定义在函数顶部
  let targetNotes = [];
  let success = true;
  
  MNUtil.undoGrouping(() => {
    try {
      targetNotes.push(someNote);
      if (!success) return;
    } catch (error) {
      MNUtil.showHUD(error);
    }
  });
});

// 共享变量的处理
function registerAllCustomActions() {
  // 多个 actions 共享的常量
  const htmlSetting = [
    { title: "方法: ✔", type: "method" },
    { title: "思路: 💡", type: "idea" }
  ];
  
  // 注册使用这些常量的 actions
  global.registerCustomAction("addHtmlComment", async function(context) {
    // 可以访问上面定义的 htmlSetting
    UIAlertView.show("选择类型", htmlSetting, ...);
  });
}
```

#### 4. 常用 MarginNote API 参考

**卡片操作**：
```javascript
// 获取焦点卡片
const focusNote = MNNote.getFocusNote();
const focusNotes = MNNote.getFocusNotes();  // 多选

// 卡片属性
focusNote.noteId          // ID
focusNote.noteTitle       // 标题
focusNote.excerptText     // 摘录文本
focusNote.comments        // 评论数组
focusNote.colorIndex      // 颜色索引
focusNote.parentNote      // 父卡片
focusNote.childNotes      // 子卡片数组

// 卡片方法
focusNote.toBeIndependent()     // 独立
focusNote.addChild(note)        // 添加子卡片
focusNote.moveToInput()         // 移动到输入区
focusNote.focusInMindMap(0.3)   // 在脑图中聚焦
focusNote.refresh()             // 刷新显示
```

**工具方法**：
```javascript
// 显示提示
MNUtil.showHUD("消息内容");

// 撤销分组
MNUtil.undoGrouping(() => {
  // 这里的操作可以一起撤销
});

// 延迟执行
await MNUtil.delay(0.5);  // 延迟0.5秒

// 复制到剪贴板
MNUtil.copy("文本内容");

// 获取当前笔记本
MNUtil.currentNotebookId
MNUtil.currentDocmd5
```

**弹窗交互**：
```javascript
// 简单弹窗
UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
  "标题",
  "消息",
  2,  // 输入框数量
  "取消",
  ["确定"],
  (alert, buttonIndex) => {
    if (buttonIndex == 1) {
      const input = alert.textFieldAtIndex(0).text;
      // 处理输入
    }
  }
);
```

#### 5. 调试技巧

**错误处理模式**：
```javascript
global.registerCustomAction("myAction", async function(context) {
  try {
    // 边界检查
    if (typeof MNUtil === 'undefined') return;
    if (!focusNote) {
      MNUtil.showHUD("请先选择卡片");
      return;
    }
    
    // 功能实现
    
  } catch (error) {
    // 用户友好的错误提示
    MNUtil.showHUD(`执行失败: ${error.message}`);
    // 记录详细错误
    toolbarUtils.addErrorLog(error, "myAction");
  }
});
```

**调试输出**：
```javascript
// 开发阶段使用
console.log("调试信息:", data);

// 显示给用户看（谨慎使用）
MNUtil.showHUD(`卡片ID: ${focusNote.noteId}`);

// 复制复杂对象到剪贴板查看
MNUtil.copyJSON({
  noteId: focusNote.noteId,
  title: focusNote.noteTitle,
  parentId: focusNote.parentNote?.noteId
});
```

#### 6. 添加新功能的标准流程

1. **在注册表文件中添加 action**：
```javascript
global.registerCustomAction("myNewFeature", async function(context) {
  const { focusNote, focusNotes, self } = context;
  
  MNUtil.undoGrouping(() => {
    try {
      // 实现功能
      focusNote.noteTitle = "已处理: " + focusNote.noteTitle;
      MNUtil.showHUD("✅ 处理成功");
    } catch (error) {
      MNUtil.showHUD(`❌ 失败: ${error.message}`);
    }
  });
});
```

2. **在工具栏配置中添加按钮**（如需要）：
需要修改 `availableActionOptions` 或通过设置界面添加

3. **测试流程**：
- 重启插件
- 检查是否正确加载
- 测试功能是否正常
- 测试错误处理

#### 7. 最佳实践总结

**代码组织**：
- 相关功能分组放置
- 共享常量提取到顶部
- 复杂逻辑抽取为独立函数

**性能考虑**：
- 批量操作使用 `undoGrouping`
- 大量卡片处理考虑分批
- 避免频繁的 UI 更新

**用户体验**：
- 操作前检查前置条件
- 操作后给出明确反馈
- 危险操作请求确认
- 错误信息要友好具体

**版本兼容**：
- 检查 API 可用性
- 保持向后兼容
- 记录最低版本要求

#### 8. 注册表文件管理

**切换不同版本的注册表**：
```javascript
// 在 main.js 中修改加载的文件（第12行左右）
JSB.require('xdyy_custom_actions_registry')         // 当前使用版本
// JSB.require('xdyy_custom_actions_registry_full')    // 完整版（198个）
// JSB.require('xdyy_custom_actions_registry_complete') // 精选版（30个）
```

**验证加载状态**：
- 成功加载后会显示：`✅ 注册表已加载 (X 个 actions)`
- 测试 "test" action 应显示：`✅ test action (来自注册表)！`

**回滚方案**：
```bash
# 如需回滚到原始版本
mv webviewController.js.backup webviewController.js
# 然后在 main.js 中注释掉 JSB.require 行
```

**故障排除清单**：
1. 确认文件路径正确
2. 验证 JSB.require 在 webviewController 之后
3. 检查 Console 中的错误信息
4. 确认注册表文件语法正确（使用 `node -c filename.js`）

### 16. 项目结构说明（2025.6.27）

#### 目录结构说明
- **mntoolbar**：用户的开发项目目录，基于官方版本开发
- **mntoolbar_official**：官方插件目录，仅用于参考对比和开发，不应修改