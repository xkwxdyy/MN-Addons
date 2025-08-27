# 陈述性记忆

## 高价值记忆（评分 ≥ 7）

- 2025/06/29 22:37 START
用户在 IDE 中打开了 simple-panel-plugin/log.txt 文件。这是 MN-Addon 项目中的一个插件日志文件，位于 simple-panel-plugin 目录下。该插件可能是一个简单的面板插件示例。 --tags MN-Addon simple-panel-plugin log
--tags #其他 #评分:8 #有效期:长期
- END



- 2025/06/29 22:45 START
simple-panel-plugin 项目遇到的4个UI交互问题及解决方案：
1. 关闭面板延迟 - 解决：直接hide或减少延迟到0.1秒
2. 面板拖动不跟鼠标 - 解决：正确计算手势偏移量，记录startOffset
3. convertRectToView错误 - 解决：使用按钮参数而非保存的sender，确保对象有效
4. 齿轮点击延迟 - 解决：直接响应点击，避免异步操作

关键技术点：
- 手势state：1=开始，3=结束
- 使用locationInView获取位置，translationInView获取偏移
- 使用MNUtil.constrain进行边界约束
- convertRectToView需要确保sender是有效UIView

参考mnai项目的utils.js getNewLoc函数和getPopoverAndPresent函数实现 --tags MN-Addon simple-panel-plugin UI交互 手势处理 菜单弹出
--tags #其他 #评分:8 #有效期:长期
- END

- 2025/06/29 23:02 START
成功完成了 MarginNote4 插件开发指南的重构和完善工作。主要改进包括：

1. 添加了开发框架选择指南，对比了 OhMyMN、MNUtils 和原生 API 三种开发方式
2. 新增了 OhMyMN 框架详解章节，详细介绍了现代化的 TypeScript 开发方式
3. 重组了 API 文档，按功能分类展示不同框架的实现方式
4. 更新了示例代码，添加了 OhMyMN TypeScript 示例和 Lite 插件示例
5. 完善了开发工具链，包括热重载、调试技巧、VSCode 配置等
6. 新增了实战开发指南，通过智能笔记处理器和笔记导出工具两个案例展示实际开发

文档现在更加现代化、实用，能够帮助开发者根据项目复杂度选择合适的开发方式。特别强调了 OhMyMN 作为推荐的现代化开发框架，同时保留了 MNUtils 和原生 API 的介绍，确保了文档的全面性。 --tags MarginNote4 插件开发 OhMyMN MNUtils 文档重构
--tags #工具使用 #评分:8 #有效期:长期
- END

- 2025/06/30 12:11 START
JSBox/JSB 框架语法支持重要发现

经过深入分析 mnutils、mntoolbar、mnai 源码，确认 JSBox/JSB 完全支持现代 ES6+ JavaScript 语法：

支持的特性：
- const/let 变量声明
- 箭头函数 () => {}
- 模板字符串 `${}`
- class 语法和 static 属性
- async/await 异步编程
- 解构赋值 {a, b} = obj
- 扩展运算符 [...array]
- 默认参数
- 现代数组方法（map、filter、find、includes等）
- 现代对象方法（Object.assign、Object.keys等）

重要教训：
1. 遇到"语法错误"时，先查看权威项目源码确认，不要盲目假设
2. JSBox 环境的问题通常不是语法兼容性，而是 API 使用问题
3. CATransaction 在 JSBox 中可能有兼容性问题，应避免使用
4. 按钮事件绑定时，在实例方法内应使用 this 而非 self --tags JSBox JavaScript ES6 语法支持 MarginNote 插件开发
--tags #其他 #评分:8 #有效期:长期
- END

- 2025/06/30 18:09 START
MarginNote 插件打包关键经验：

1. **错误的打包方式会导致插件无法加载甚至闪退**
   - ❌ 错误：`zip ../plugin.mnaddon ../plugin/*` 
   - ❌ 错误：`zip -r plugin.mnaddon plugin-folder/`
   - 这些方式会在压缩包内包含文件夹路径（如 `../plugin/main.js`），MarginNote 无法正确解析

2. **正确的打包方式**
   - ✅ 使用 mnaddon4 工具：`cd plugin-folder && mnaddon4 build plugin-name`
   - ✅ 在插件目录内直接压缩：`cd plugin-folder && zip plugin.mnaddon main.js mnaddon.json logo.png`

3. **验证打包结果**
   - 使用 `unzip -l plugin.mnaddon` 检查
   - 确保文件名前面没有任何路径前缀
   - 正确的结构应该是文件直接在根目录，如：`main.js`、`mnaddon.json`、`logo.png`

4. **症状识别**
   - 插件出现在列表但无法勾选
   - 双击 .mnaddon 文件后 MarginNote 闪退
   - 崩溃日志显示 NSJSONSerialization 异常

这是一个非常容易犯的错误，但影响严重。记住：永远不要压缩文件夹，而是进入文件夹后压缩文件。 --tags marginnote plugin mnaddon 打包 packaging 错误 闪退 crash
--tags #工具使用 #评分:8 #有效期:长期
- END

- 2025/07/01 11:42 START
【重要教训】JSDoc 注释中的语法陷阱

问题：在 JSDoc 或多行注释的示例代码中包含 `*/` 会导致注释提前结束，引发大量语法错误（如 270 个错误）

错误示例：
```javascript
/**
 * @example
 * let template = "/**\n * {{cursor}}\n */\nfunction name() {\n\n}"
 */
```

正确做法：
```javascript
/**
 * @example  
 * let template = "/**\\n * {{cursor}}\\n *\\/\\nfunction name() {\\n\\n}"
 */
```

解决方法：
1. 将 `*/` 替换为 `*\/` 进行转义
2. 避免在注释示例中使用包含注释符号的字符串
3. 使用 `node -c filename.js` 验证语法

症状：编辑器突然报告大量语法错误，错误集中在某个注释块之后 --tags 错误 注释 JSDoc 语法 MN-Addon utils.js
--tags #其他 #评分:8 #有效期:长期
- END

- 2025/07/04 22:08 START
## MNTask 开发经验总结 - UI 布局陷阱

### 1. ScrollView 布局与固定元素
**问题**：关闭按钮随 ScrollView 内容移动
**解决**：
- 将 ScrollView 和关闭按钮放在同一父视图中
- 缩短 ScrollView 宽度（width - 45）为关闭按钮预留空间
- 关闭按钮定位：x = tabView.width + 5

### 2. ScrollView 方向锁定
**问题**：横向滚动视图也能垂直移动
**解决**：
```javascript
tabView.alwaysBounceVertical = false
tabView.directionalLockEnabled = true
tabView.contentSize.height = tabView.frame.height
```

### 3. iOS 颜色值陷阱
**错误**：color:"transparent"
**正确**：color:"#ffffff", alpha:0.0

### 4. 视图层级与坐标系统
- 子视图坐标相对于直接父视图
- 要对齐的元素必须在同一父视图中
- 典型层级：view → [moveButton, tabView, closeButton, settingView] --tags MNTask UI布局 ScrollView iOS开发 MarginNote插件
--tags #其他 #评分:8 #有效期:长期
- END

- 2025/07/04 22:44 START
JSB 框架类定义陷阱 - MN-Addon 项目重要经验

问题：在 JSB.defineClass 中直接定义对象属性会导致该属性成为"类属性"而非"实例属性"，导致实例无法访问。

症状：
- self.viewManager 显示为 undefined
- 按钮点击没有反应
- 大型对象属性无法访问

错误示例：
```javascript
var Controller = JSB.defineClass('Controller', {
  viewManager: {  // ❌ 错误：成为类属性
    switchTo: function() {}
  }
})
```

正确做法：
```javascript
// 1. 在 prototype 上定义初始化方法
Controller.prototype.initViewManager = function() {
  this.viewManager = {  // ✅ 创建实例属性
    switchTo: function() {}
  }
}

// 2. 在 init 中调用
Controller.prototype.init = function() {
  this.initViewManager()
}
```

重要规则：在 JSB.defineClass 中，只能定义方法（函数），不能定义对象属性！所有对象属性必须在实例初始化时创建。

相关文件：
- /Users/xiakangwei/Nutstore/Github/repository/MN-addon-develop/MN-Addon/mntask/settingController.js
- /Users/xiakangwei/Nutstore/Github/repository/MN-addon-develop/MN-Addon/mntask/VIEWMANAGER_GUIDE.md
- /Users/xiakangwei/Nutstore/Github/repository/MN-addon-develop/MN-Addon/CLAUDE.md --tags JSB框架 MarginNote 类定义 实例属性 viewManager 调试经验
--tags #最佳实践 #评分:8 #有效期:长期
- END

- 2025/07/05 00:23 START
JSB 框架中的方法定义陷阱：事件处理方法必须在 JSB.defineClass 中定义，用于响应 UI 事件；通用/可复用方法应该定义在 prototype 上。在 JSB.defineClass 内部调用原型方法时，需要先获取实例（let self = getInstance()）。多看板管理架构：1. 通用组件创建函数在 prototype 上；2. 每个看板的事件处理方法在 JSB.defineClass 中；3. 通用操作逻辑在 prototype 上。 --tags JSB框架 MarginNote 事件处理 原型方法 mntask 架构设计
--tags #其他 #评分:8 #有效期:长期
- END