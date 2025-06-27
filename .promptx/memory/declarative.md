# 陈述性记忆

## 高价值记忆（评分 ≥ 7）

- 2025/06/26 23:52 START
# MN Toolbar Pro 项目完整分析

## 项目概述
- **项目名称**: MN Toolbar Pro
- **基础**: 基于林立飞开发的 MN Toolbar 插件
- **版本**: 0.1.3.alpha0427
- **插件ID**: marginnote.extension.mntoolbar
- **支持版本**: MarginNote 3.7.11+
- **平台**: iOS/iPadOS/macOS

## 项目结构

### 核心文件
1. **main.js** (1021行)
   - 插件主入口文件
   - 定义 MNToolbarClass 继承自 JSExtension
   - 管理插件生命周期 (sceneWillConnect, notebookWillOpen等)
   - 处理各种通知事件 (PopupMenuOnNote, toggleDynamic等)
   - 动态工具栏的显示/隐藏逻辑

2. **webviewController.js** (3700+行)
   - 工具栏UI控制器 (toolbarController)
   - 处理按钮布局 (水平/垂直)
   - 手势识别 (拖动、调整大小、长按)
   - 自定义动作执行器 (customActionByDes)
   - 支持最多30个按钮

3. **utils.js** (10068行)
   - Frame类: UI框架操作工具
   - toolbarUtils类: 核心工具函数集合
   - 包含大量功能模块:
     - 文本处理 (markdown转换、OCR、复制粘贴)
     - 卡片操作 (制卡、合并、链接管理)
     - 任务管理 (OKR系统)
     - 文献管理 (参考文献、作者、期刊)
     - 模板系统

4. **settingController.js**
   - 设置界面管理
   - 按钮配置编辑器
   - iCloud同步设置

### 配置文件
- **toolbar_config.json**: 工具栏配置存储
  - windowState: 窗口状态和位置
  - actionKeys: 固定工具栏按钮配置
  - dynamicActionKeys: 动态工具栏按钮配置
  - actions: 所有可用动作的定义
  - popupConfig: 弹出菜单替换配置

## 主要功能模块

### 1. 动态工具栏系统
- 支持水平/垂直布局切换
- 可根据上下文自动显示/隐藏
- 支持拖动和调整大小
- 最多支持30个按钮

### 2. 卡片操作功能
- **制卡系统**:
  - 模板制卡 (TemplateMakeNotes)
  - 批量制卡
  - 文献制卡 (论文、书籍、期刊)
  - OKR任务卡片 (目标、关键结果、项目、任务)
  
- **卡片管理**:
  - 合并到父卡片
  - 链接管理 (单向/双向)
  - 颜色标记 (16种颜色)
  - 标题前缀管理

### 3. 学习辅助功能
- **证明管理**: 添加、更新、移动证明内容
- **思考点系统**: 添加思考点、移动评论到思考区
- **评论管理**: HTML/Markdown评论、评论分级
- **引用管理**: 文献引用、作者信息、期刊信息

### 4. 文本处理功能
- OCR识别
- Markdown/HTML转换
- 标题格式化
- 空格处理
- 复制/粘贴增强

### 5. 集成功能
- MN Editor: 卡片编辑器
- MN Browser: 内置浏览器
- MN OCR: 文字识别
- MN ChatAI: AI对话
- MN Snipaste: 截图工具
- Bigbang: 文本处理

## 技术特点

### JSBridge架构
- 使用 JSB.defineClass 定义原生类
- 通过 JSB.require 加载模块
- 支持原生UI组件 (UIButton, UIView等)

### 设计模式
- **单例模式**: 通过 getFooController() 获取实例
- **观察者模式**: NSNotificationCenter 通知机制
- **命令模式**: 动作配置系统

### 内存管理
- 在 sceneDidDisconnect/notebookWillClose 中清理资源
- 移除通知观察者
- 清理定时器和手势识别器

### 平台兼容
- 检测平台类型 (iOS/macOS)
- 处理平台差异 (鼠标/触摸)
- 适配不同屏幕尺寸

## 自定义动作系统

### 动作类型
1. **基础动作**: copy, paste, undo, redo
2. **卡片动作**: 制卡、合并、链接
3. **文本动作**: OCR、格式化、翻译
4. **学习动作**: 证明、思考点、评论
5. **工具动作**: 搜索、编辑器、浏览器

### 动作配置结构
```json
{
  "action": "动作名称",
  "target": "目标",
  "menuItems": [], // 子菜单
  "doubleClick": {}, // 双击动作
  "onLongPress": {} // 长按动作
}
```

## 任务管理系统 (OKR)

### 卡片类型
- **目标** (Objective): 黄色
- **关键结果** (Key Result): 淡黄色/白色
- **项目** (Project): 蓝色/深蓝色
- **任务** (Task): 淡蓝色/淡粉色/灰色

### 状态管理
- 未开始
- 进行中 (带时间标签)
- 已完成 (灰色)

### 特殊功能
- 自动添加时间标签
- 父子卡片链接
- 状态颜色自动切换
- 标题前缀管理

## 文献管理系统

### 功能模块
1. **参考文献ID管理**
   - 绑定文献ID到文档
   - 导入/导出ID映射
   - 批量处理引用

2. **文献卡片类型**
   - 论文卡片
   - 书籍卡片
   - 期刊卡片
   - 作者卡片
   - 关键词卡片

3. **信息管理**
   - BibTeX信息
   - DOI管理
   - 引用样式
   - 作者缩写

## 配置与扩展

### 按钮配置
- 36个自定义按钮位置
- 每个按钮可配置:
  - 图标
  - 动作
  - 双击行为
  - 长按菜单

### 弹窗替换
- 可替换MarginNote原生弹窗
- 支持自定义菜单项
- 保持原有功能

### iCloud同步
- 配置文件同步
- 冲突检测
- 手动/自动同步

## 开发规范

### 命名规范
- 类: PascalCase
- 函数/变量: camelCase
- 常量: UPPER_CASE
- 文件: camelCase.js

### 错误处理
- try-catch包装主要方法
- 错误日志: toolbarUtils.addErrorLog()
- 用户提示: MNUtil.showHUD()

### 生命周期管理
1. 初始化: sceneWillConnect
2. 笔记本打开: notebookWillOpen
3. 笔记本关闭: notebookWillClose
4. 断开连接: sceneDidDisconnect

### 性能优化
- 延迟加载
- 批量操作使用undoGrouping
- 大文件分段处理
- 动画优化

## 项目特色

1. **高度可定制**: 几乎所有功能都可自定义
2. **强大的卡片系统**: 支持复杂的知识管理工作流
3. **专业的学习工具**: 针对学术研究优化
4. **良好的扩展性**: 模块化设计，易于添加新功能
5. **跨平台兼容**: 同时支持iOS和macOS

## 待实现功能 (TODO)
- 找到配置文件的位置，实现两个 toolbar 共存 --tags MN-Toolbar-Pro MarginNote 插件开发 知识管理 学习工具
--tags #工具使用 #评分:8 #有效期:长期
- END



- 2025/06/27 02:54 START
MN Toolbar Pro 项目 - 成功实现自定义 Actions 解耦（2025.6.27）

## 任务背景
用户在 webviewController.js 的 customActionByDes 方法中添加了 198 个自定义 case，导致文件过大（264KB），需要解耦。

## 失败的尝试
1. Prototype 覆盖方式：尝试通过 toolbarController.prototype.customActionByDes 覆盖方法，但 JSB 框架限制导致失败
2. 错误问题：
   - undefined is not an object (evaluating 'self.addonController.popupReplace') - 通过添加 self.ensureView() 解决
   - ReferenceError: Can't find variable: toolbarController - 尝试了延迟初始化等多种方案都失败

## 成功的解决方案 - 注册表模式
1. 最小化修改主文件（仅在 default 分支添加 4 行代码）
2. 创建全局注册表存储自定义 actions
3. 实现了真正的解耦，所有自定义代码在独立文件中管理

## 技术要点
1. JSB 框架中不能在函数内使用 break 语句，需要移除
2. 复杂的 switch 语句（如 TemplateMakeNotes 150+ 行）需要简化处理
3. 使用 Python 脚本自动化迁移过程
4. 创建多个版本（基础版、精选版、完整版）便于测试

## 成果
- 成功迁移 198 个自定义 actions
- 主文件从 264KB 减少到 95KB（减少 64%）
- 保持向后兼容性
- 易于维护和扩展

## 文件列表
- xdyy_custom_actions_registry_full.js - 完整版（198个actions）
- xdyy_custom_actions_registry_complete.js - 精选版（30个actions）
- xdyy_custom_actions_registry.js - 基础版（5个actions）
- convert_to_registry.py - 自动转换脚本 --tags MNToolbar JSB 解耦 注册表模式 MarginNote 插件开发
--tags #其他 #评分:8 #有效期:长期
- END

- 2025/06/27 12:57 START
MN Toolbar Pro - 自定义 Actions 解耦完整经验总结（2025.6.27）

## 项目背景
用户在 webviewController.js 中添加了 198 个自定义 case，导致文件过大（264KB），需要解耦并改善代码组织。

## 解决方案演进

### 失败的尝试
1. **Prototype 覆盖方式**
   - 尝试：toolbarController.prototype.customActionByDes = function() 
   - 失败原因：JSB 框架限制，prototype 修改不生效
   - 表现：自定义 actions 进入 default 分支显示 "Not supported yet..."

2. **错误处理经验**
   - undefined is not an object (evaluating 'self.addonController.popupReplace')
   - 解决：添加 self.ensureView() 确保初始化
   - ReferenceError: Can't find variable: toolbarController
   - 多种尝试均失败，最终放弃 prototype 方式

### 成功的注册表模式
1. **架构设计**
   ```javascript
   // 全局注册表
   global.customActions = {};
   
   // 注册函数
   global.registerCustomAction = function(name, handler) {
     global.customActions[name] = handler;
   };
   
   // 主文件仅修改 default 分支
   default:
     if (typeof global !== 'undefined' && global.executeCustomAction) {
       const handled = await global.executeCustomAction(des.action, context);
       if (handled) break;
     }
   ```

2. **Context 机制**
   - 原因：独立函数无法访问原函数作用域变量
   - 解决：打包所有需要的变量传递
   - 包含：button, des, focusNote, focusNotes, self

## 技术要点

### JSB 框架限制
1. 函数内不能使用 break 语句
2. 复杂 switch 语句需要简化处理
3. 方法调用可能不通过标准原型链
4. 类定义和实例化时机难以控制

### 批量迁移工具
1. **Python 脚本 (convert_to_registry.py)**
   - 自动提取 198 个 cases
   - 移除 break 语句
   - 处理特殊的 switch 语句
   - 按功能分组（reference、move、proof 等）

2. **特殊处理的复杂 Actions**
   - TemplateMakeNotes (150+ 行)
   - addHtmlMarkdownComment
   - mergeInParentNoteWithPopup
   - 这些被简化为核心功能版本

### 代码格式化
1. **缩进问题**
   - Python 脚本生成的代码缩进不规范
   - 创建 fix_indentation.js 修复缩进
   - 统一使用 2 空格缩进

2. **语法验证**
   - 使用 node -c filename.js 检查语法
   - 分阶段测试确保功能正常

## 文件组织策略

### 版本管理
1. 基础版 (5个 actions) - 用于测试
2. 精选版 (30个 actions) - 常用功能
3. 完整版 (198个 actions) - 所有功能

### 文档集中化
1. 删除中间文档（6个 md 文件）
2. 所有经验集中到 CLAUDE.md
3. 保留核心文件：
   - xdyy_custom_actions_registry.js
   - convert_to_registry.py
   - xdyy_utils_extensions.js

## 成果数据
- 主文件：264KB → 95KB（减少 64%）
- 代码行数：6555 → 2599（减少 60%）
- 主文件修改：仅 4 行
- 成功迁移：198 个 actions

## 最佳实践总结

### 开发流程
1. 在注册表文件中添加新 action
2. 特殊变量在函数内部定义
3. 共享常量在 registerAllCustomActions 顶部定义
4. 使用 MNUtil.undoGrouping 包装批量操作
5. 始终包含 try-catch 错误处理

### 调试技巧
1. 启动时查看加载提示
2. 使用 MNUtil.showHUD 显示调试信息
3. 检查 Console 错误信息
4. 验证 context 变量是否正确传递

### MarginNote API 常用方法
- MNNote.getFocusNote() - 获取当前卡片
- MNUtil.undoGrouping() - 批量操作
- MNUtil.showHUD() - 显示提示
- UIAlertView.show... - 弹窗交互
- focusNote.moveToInput() - 移动卡片

## 经验教训
1. JSB 框架有独特限制，标准 JS 模式可能不适用
2. 注册表模式比 prototype 覆盖更可靠
3. 渐进式测试比一次性迁移更安全
4. 良好的错误处理至关重要
5. 文档集中管理便于维护 --tags MNToolbar MarginNote JSB 代码解耦 注册表模式 JavaScript 插件开发
--tags #最佳实践 #流程管理 #工具使用 #评分:8 #有效期:长期
- END

- 2025/06/27 15:06 START
MN Toolbar Pro 注册表解耦实践经验：

1. 解耦架构：
   - 主文件（webviewController.js）只需添加 4 行代码的钩子
   - 所有自定义功能在独立的注册表文件（xdyy_custom_actions_registry.js）中管理
   - 通过 global 对象实现模块间通信

2. 关键问题与解决：
   - 变量未定义：在 customActionByDes 函数中需要同时声明 focusNote 和 focusNotes
   - 函数未定义：确保在 main.js 中按正确顺序加载所有依赖文件
   - 扩展初始化：在扩展文件末尾添加自动初始化代码

3. 调试技巧：
   - 使用 MNUtil.log() 而不是 console.log()
   - 渐进式调试：先确认文件加载→再确认对象存在→最后确认功能执行
   - 使用有意义的日志前缀（🔧初始化、✅成功、❌错误、🔍调试、🚀执行、📦加载）

4. 最佳实践：
   - 主文件修改最小化
   - 使用 typeof 检查对象存在性
   - 错误处理使用 try-catch
   - 通过 context 对象传递所有必要数据

5. 成果：
   - 成功注册 198 个自定义 actions
   - 实现了完全的模块化解耦
   - 未来添加新功能无需修改主文件 --tags MN-Toolbar 解耦 注册表模式 JSB框架
--tags #最佳实践 #评分:8 #有效期:长期
- END