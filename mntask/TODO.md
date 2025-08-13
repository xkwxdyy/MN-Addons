MNTask Focus 看板功能实施计划

  背景分析

  现有看板结构

  MNTask 插件目前已实现 5 个看板功能：
  1. 目标看板 (target) - 管理长期目标
  2. 项目看板 (project) - 管理项目级任务
  3. 动作看板 (action) - 管理具体执行动作
  4. 已完成存档区 (completed) - 存放已完成任务
  5. 今日看板 (today) - 显示今日任务（使用 WebView 实现）

  代码架构分析

  1. 看板创建机制

  - 使用 createBoardBinding 方法统一创建看板 UI 组件
  - 每个看板包含：
    - 标题标签（Label）
    - Focus 按钮（聚焦到看板卡片）
    - Clear 按钮（清除看板绑定）
    - Paste 按钮（从剪贴板粘贴卡片 ID）

  2. 事件处理架构

  - JSB 框架的事件驱动模式
  - 每个看板需要三个事件处理方法：
    - focus[BoardName]Board - 聚焦看板
    - clear[BoardName]Board - 清除看板
    - paste[BoardName]Board - 粘贴看板
  - 事件方法调用通用的 prototype 方法：focusBoard、clearBoard、pasteBoard

  3. 布局规律

  - 每个看板占用垂直空间：100px
    - 标签：35px 高度
    - 间距：10px
    - 按钮行：35px 高度
    - 底部间距：20px
  - 按钮横向三等分布局

  4. 存储机制

  - 看板 ID 通过 taskConfig.getBoardNoteId(boardKey) 获取
  - 通过 taskConfig.setBoardNoteId(boardKey, noteId) 保存

  实施步骤

  步骤 1：添加 Focus 看板 UI 创建

  文件：settingController.js
  位置：第 2303-2309 行之后（今日看板创建之后）

  // 创建 Focus 看板
  this.createBoardBinding({
    key: 'focus',
    title: 'Focus 看板:',
    parent: 'taskBoardView'
  })

  步骤 2：添加事件处理方法

  文件：settingController.js
  位置：第 1320 行附近（在已完成看板处理方法之后）

  // Focus 看板处理方法
  focusFocusBoard: function() {
    let self = getTaskSettingController()
    self.focusBoard('focus')
  },

  clearFocusBoard: async function() {
    let self = getTaskSettingController()
    await self.clearBoard('focus')
  },

  pasteFocusBoard: async function() {
    let self = getTaskSettingController()
    await self.pasteBoard('focus')
  },

  步骤 3：更新布局设置

  文件：settingController.js
  位置：第 1905 行之后（已完成存档区布局之后）

  // Focus 看板（在已完成存档区之后）
  taskFrame.set(this.focusBoardLabel, 10, 510, width-20, 35)
  taskFrame.set(this.focusFocusBoardButton, 10, 555, (width-30)/3, 35)
  taskFrame.set(this.clearFocusBoardButton, 15+(width-30)/3, 555, (width-30)/3, 35)
  taskFrame.set(this.pasteFocusBoardButton, 20+2*(width-30)/3, 555, (width-30)/3, 35)

  步骤 4：更新 ScrollView contentSize

  文件：settingController.js
  位置：第 1908 行

  // 原代码
  this.taskBoardView.contentSize = {width: width-2, height: 455 + 35 + 20}

  // 修改为
  this.taskBoardView.contentSize = {width: width-2, height: 555 + 35 + 20}

  步骤 5：验证 getBoardDisplayName 方法

  确认 getBoardDisplayName 方法中包含 focus 看板的显示名称。如果没有，需要添加：

  case 'focus':
    return 'Focus 看板'

  测试要点

  功能测试

  1. UI 显示
    - Focus 看板标签正确显示
    - 三个按钮（Focus、Clear、Paste）正确显示
    - 布局对齐，无重叠
  2. Focus 功能
    - 点击 Focus 按钮能正确聚焦到绑定的卡片
    - 未绑定时显示提示信息
  3. Clear 功能
    - 显示确认对话框
    - 确认后清除绑定
    - 取消后保持原状
  4. Paste 功能
    - 从剪贴板读取卡片 ID
    - 验证卡片存在性
    - 成功保存绑定

  兼容性测试

  1. 与其他看板功能不冲突
  2. ScrollView 能正确滚动到 Focus 看板区域
  3. 设置保存和恢复正常

  代码修改清单

  - 在 createSettingView 方法中添加 Focus 看板创建代码
  - 在 JSB.defineClass 中添加三个事件处理方法
  - 在 setFrames 方法中添加 Focus 看板布局
  - 更新 taskBoardView 的 contentSize
  - 验证并更新 getBoardDisplayName 方法（如需要）
  - 测试所有功能
  - 提交代码

  注意事项

  1. JSB 框架限制
    - 事件处理方法必须在 JSB.defineClass 中定义
    - 必须使用 getTaskSettingController() 获取 self 引用
  2. 命名规范
    - 保持与现有看板一致的命名模式
    - Focus 看板的 key 为 'focus'
    - 按钮选择器格式：focus[BoardName]Board:
  3. 错误处理
    - 所有异步操作需要 try-catch
    - 使用 TaskLogManager 记录日志（如果可用）

  完成标准

  - Focus 看板在设置面板中正确显示
  - 所有按钮功能正常工作
  - 看板绑定能够持久化保存
  - 与现有功能完全兼容
  - 代码风格与项目保持一致