/**
 * 夏大鱼羊自定义菜单注册表
 * 用于解耦菜单模板定义，避免修改 utils.js
 * 严格按照原始 template 函数的内容
 */

// 使用 MNTask 专用命名空间，避免与 MNToolbar 冲突
if (typeof MNTaskGlobal === 'undefined') {
  var MNTaskGlobal = {};
}

// 初始化菜单注册表
MNTaskGlobal.customMenuTemplates = {};

/**
 * 注册自定义菜单模板
 * @param {string} name - 菜单名称
 * @param {Object} template - 菜单模板对象
 */
MNTaskGlobal.registerMenuTemplate = function(name, template) {
  MNTaskGlobal.customMenuTemplates[name] = template;
};

/**
 * 获取菜单模板
 * @param {string} name - 菜单名称
 * @returns {Object|null} 菜单模板对象
 */
MNTaskGlobal.getMenuTemplate = function(name) {
  return MNTaskGlobal.customMenuTemplates[name] || null;
};

// 不再需要全局 global 对象

/**
 * 注册所有自定义菜单模板
 * 严格按照原始 template(action) 函数中的 case 语句内容
 */
function registerAllMenuTemplates() {
  // menu_task_manage - 任务管理菜单
  MNTaskGlobal.registerMenuTemplate("menu_task_manage", {
    action: "taskCardMake",  // 单击直接触发智能任务制卡
    onLongPress: {           // 长按显示完整菜单
      action: "menu",
      menuWidth: 320,
      menuItems: [
        "⬇️ 任务类型",
        {
          action: "changeTaskType",
          menuTitle: "    🔄 修改卡片类型（支持多选）"
        },
        {
          action: "batchTaskCardMakeByHierarchy",
          menuTitle: "    🏗️ 根据层级批量制卡"
        },
      ]
    }
  });

  // menu_task_progress - 进度追踪菜单
  MNTaskGlobal.registerMenuTemplate("menu_task_progress", {
    action: "toggleTaskStatusForward",  // 单击切换任务状态（向前）
    onLongPress: {                      // 长按显示完整菜单
      action: "menu",
      menuWidth: 350,
      menuItems: [
        "⬇️ 状态切换",
        {
          action: "toggleTaskStatusBackward",
          menuTitle: "    ↩️ 退回上一个状态"
        },
        "⬇️ 字段处理",
        {
          action: "addCustomField",
          menuTitle: "    📝 手动添加自定义字段"
        },
        {
          action: "editCustomField",
          menuTitle: "    ✏️ 编辑自定义字段"
        },
      ]
    }
  });

  // menu_today_tasks - 今日任务菜单
  MNTaskGlobal.registerMenuTemplate("menu_today_tasks", {
    action: "menu",
    menuWidth: 320,
    menuItems: [
      {
        action: "viewTodayTasks",
        menuTitle: "📅 查看今日任务"
      },
      {
        action: "openFloatWindowByInboxNote",
        menuTitle: "📌 浮窗定位今日 Inbox"
      },
      {
        action: "openFloatWindowByInboxNoteOnDate",
        menuTitle: "📆 浮窗定位指定日期 Inbox"
      },
      "⬇️ 时间标签管理",
      {
        action: "addTodayTimeTag",
        menuTitle: "    ➕ 添加今日时间标签"
      },
      {
        action: "updateTimeTag",
        menuTitle: "    🔄 更新时间标签并添加「今日」"
      },
      {
        action: "updateTodayTimeTag",
        menuTitle: "    📅 更新为今日时间标签"
      },
      {
        action: "clearTimeTag",
        menuTitle: "    🗑️ 清除所有时间标签"
      },
      "⬇️ 任务筛选",
      {
        action: "filterByTimeTag",
        menuTitle: "    🏷️ 按时间标签筛选"
      },
      {
        action: "filterByTaskStatus",
        menuTitle: "    📊 按状态筛选（进行中/未开始）"
      },
      {
        action: "filterByTaskType",
        menuTitle: "    🎯 按类型筛选（任务/项目/关键结果）"
      },
      "⬇️ 批量操作",
      {
        action: "moveToInbox",
        menuTitle: "    📥 加入 Inbox"
      },
      {
        action: "batchUpdateTodayTasks",
        menuTitle: "    🔄 批量更新今日任务"
      },
      {
        action: "postponeToTomorrow",
        menuTitle: "    📆 推迟到明天"
      }
    ]
  });

  // menu_task_split - 任务拆分菜单
  MNTaskGlobal.registerMenuTemplate("menu_task_split", {
    action: "menu",
    menuWidth: 330,
    menuItems: [
      "⬇️ 任务拆分",
      {
        action: "splitTaskByChapters",
        menuTitle: "    📚 按章节拆分（阅读任务）"
      },
      {
        action: "splitTaskByPages",
        menuTitle: "    📄 按页数拆分"
      },
      {
        action: "splitTaskByTimeBlocks",
        menuTitle: "    ⏱️ 按时间块拆分（番茄钟）"
      },
      {
        action: "splitTaskByMilestones",
        menuTitle: "    🏁 按里程碑拆分"
      },
      {
        action: "customSplitTask",
        menuTitle: "    ✂️ 自定义拆分"
      },
      "⬇️ OKR 层级管理",
      {
        action: "convertToObjective",
        menuTitle: "    🎯 转换为目标 (Objective)"
      },
      {
        action: "convertToKeyResult",
        menuTitle: "    📊 转换为关键结果"
      },
      {
        action: "convertToProject",
        menuTitle: "    📁 转换为项目"
      },
      {
        action: "createKeyResultsFromObjective",
        menuTitle: "    📊 为目标创建关键结果"
      },
      "⬇️ 批量操作",
      {
        action: "batchCreateSubtasks",
        menuTitle: "    ➕ 批量创建子任务"
      },
      {
        action: "batchUpdateTaskTypes",
        menuTitle: "    🔄 批量更新任务类型"
      },
      {
        action: "batchLinkToParent",
        menuTitle: "    🔗 批量链接到父任务"
      }
    ]
  });

  // menu_quick_filter - 快速筛选菜单
  MNTaskGlobal.registerMenuTemplate("menu_quick_filter", {
    action: "menu",
    menuWidth: 340,
    menuItems: [
      "⬇️ 按属性筛选",
      {
        action: "filterByTaskType",
        menuTitle: "    🎯 按任务类型筛选"
      },
      {
        action: "filterByTaskStatus",
        menuTitle: "    📊 按任务状态筛选"
      },
      {
        action: "filterByProgress",
        menuTitle: "    📈 按进度筛选"
      },
      {
        action: "filterByTag",
        menuTitle: "    🏷️ 按标签筛选"
      },
      "⬇️ 按时间筛选",
      {
        action: "filterByTimeTag",
        menuTitle: "    📅 按时间标签筛选"
      },
      {
        action: "filterOverdueTasks",
        menuTitle: "    ⚠️ 筛选逾期任务"
      },
      "⬇️ 预设筛选",
      {
        action: "quickFilter",
        menuTitle: "    ⚡ 快速组合筛选"
      },
      {
        action: "menu",
        menuTitle: "    ➡️ 常用筛选",
        menuItems: [
          {
            action: "quickFilter",
            menuTitle: "📅 今日未完成的任务"
          },
          {
            action: "quickFilter",
            menuTitle: "📅 本周进行中的任务"
          },
          {
            action: "quickFilter",
            menuTitle: "🚨 高优先级未开始任务"
          },
          {
            action: "quickFilter",
            menuTitle: "🎯 即将完成的任务(75%+)"
          },
          {
            action: "quickFilter",
            menuTitle: "🚫 已阻塞的任务"
          }
        ]
      }
    ]
  });

  // menu_task_dashboard - 任务看板菜单
  MNTaskGlobal.registerMenuTemplate("menu_task_dashboard", {
    action: "menu",
    menuWidth: 340,
    menuItems: [
      "⬇️ 看板视图",
      {
        action: "openTasksFloatMindMap",
        menuTitle: "    📊 打开任务管理脑图"
      },
      {
        action: "openOKRDashboard",
        menuTitle: "    🎯 打开 OKR 看板"
      },
      {
        action: "openCalendarView",
        menuTitle: "    📅 打开日历视图"
      },
      "⬇️ 任务统计",
      {
        action: "getOKRNotesOnToday",
        menuTitle: "    📋 获取今日 OKR 任务"
      },
      {
        action: "viewTaskStatistics",
        menuTitle: "    📊 查看任务统计"
      },
      {
        action: "viewCompletionRate",
        menuTitle: "    ✅ 查看完成率"
      },
      {
        action: "viewTimeDistribution",
        menuTitle: "    ⏱️ 查看时间分布"
      },
      "⬇️ 任务整理",
      {
        action: "achieveCards",
        menuTitle: "    📦 归档已完成任务"
      },
      {
        action: "renewCards",
        menuTitle: "    🔄 更新任务卡片"
      },
      {
        action: "cleanupExpiredTasks",
        menuTitle: "    🗑️ 清理过期任务"
      },
      "⬇️ 导入导出",
      {
        action: "exportTasksToJSON",
        menuTitle: "    💾 导出任务数据 (JSON)"
      },
      {
        action: "exportTasksToMarkdown",
        menuTitle: "    📝 导出任务报告 (Markdown)"
      },
      {
        action: "importTasksFromJSON",
        menuTitle: "    📥 导入任务数据"
      }
    ]
  });

  // menu_project_board - 项目看板菜单
  MNTaskGlobal.registerMenuTemplate("menu_project_board", {
    action: "menu",
    menuWidth: 350,
    menuItems: [
      "⬇️ 项目管理",
      {
        action: "createProjectFromNote",
        menuTitle: "    📁 从当前卡片创建项目"
      },
      {
        action: "openProjectBoard",
        menuTitle: "    📊 打开项目看板"
      },
      {
        action: "viewProjectTimeline",
        menuTitle: "    📈 查看项目时间线"
      },
      "⬇️ 项目状态",
      {
        action: "updateProjectStatus",
        menuTitle: "    🔄 更新项目状态"
      },
      {
        action: "viewProjectHealth",
        menuTitle: "    💓 查看项目健康度"
      },
      {
        action: "viewProjectRisks",
        menuTitle: "    ⚠️ 查看项目风险"
      },
      "⬇️ 里程碑管理",
      {
        action: "createMilestone",
        menuTitle: "    🏁 创建里程碑"
      },
      {
        action: "updateMilestone",
        menuTitle: "    ✏️ 更新里程碑进度"
      },
      {
        action: "viewMilestones",
        menuTitle: "    📍 查看所有里程碑"
      },
      "⬇️ 资源分配",
      {
        action: "assignProjectOwner",
        menuTitle: "    👤 分配项目负责人"
      },
      {
        action: "viewProjectResources",
        menuTitle: "    👥 查看项目资源"
      },
      {
        action: "updateProjectBudget",
        menuTitle: "    💰 更新项目预算"
      },
      "⬇️ 项目分析",
      {
        action: "generateProjectReport",
        menuTitle: "    📊 生成项目报告"
      },
      {
        action: "viewProjectDependencies",
        menuTitle: "    🔗 查看项目依赖关系"
      },
      {
        action: "exportProjectGantt",
        menuTitle: "    📅 导出甘特图"
      }
    ]
  });

  // menu_action_board - 动作看板菜单
  MNTaskGlobal.registerMenuTemplate("menu_action_board", {
    action: "menu",
    menuWidth: 340,
    menuItems: [
      "⬇️ 动作管理",
      {
        action: "createActionItem",
        menuTitle: "    ✨ 创建行动项"
      },
      {
        action: "openActionBoard",
        menuTitle: "    📋 打开动作看板"
      },
      {
        action: "viewNextActions",
        menuTitle: "    ➡️ 查看下一步行动"
      },
      "⬇️ GTD 处理",
      {
        action: "processInbox",
        menuTitle: "    📥 处理收件箱"
      },
      {
        action: "clarifyAction",
        menuTitle: "    🔍 澄清行动意图"
      },
      {
        action: "organizeActions",
        menuTitle: "    📂 组织行动清单"
      },
      "⬇️ 上下文管理",
      {
        action: "setActionContext",
        menuTitle: "    🏷️ 设置执行场景"
      },
      {
        action: "filterByContext",
        menuTitle: "    🔍 按场景筛选"
      },
      {
        action: "viewContextMap",
        menuTitle: "    🗺️ 查看场景地图"
      },
      "⬇️ 优先级管理",
      {
        action: "setActionPriority",
        menuTitle: "    🎯 设置优先级"
      },
      {
        action: "sortByPriority",
        menuTitle: "    📊 按优先级排序"
      },
      {
        action: "viewEisenhowerMatrix",
        menuTitle: "    ⚡ 查看四象限矩阵"
      },
      "⬇️ 执行跟踪",
      {
        action: "startPomodoro",
        menuTitle: "    🍅 开始番茄钟"
      },
      {
        action: "logActionTime",
        menuTitle: "    ⏱️ 记录执行时间"
      },
      {
        action: "reviewDailyActions",
        menuTitle: "    📝 回顾今日行动"
      },
      "⬇️ 批量操作",
      {
        action: "batchDeferActions",
        menuTitle: "    📆 批量推迟"
      },
      {
        action: "batchDelegateActions",
        menuTitle: "    👥 批量委派"
      },
      {
        action: "archiveCompletedActions",
        menuTitle: "    📦 归档已完成"
      }
    ]
  });
}

// 扩展 taskConfig.template 方法
if (typeof taskConfig !== 'undefined') {
  // 保存原始的 template 方法
  const originalTemplate = taskConfig.template;
  
  // 重写 template 方法
  taskConfig.template = function(action) {
    // 先检查自定义菜单模板
    const customTemplate = MNTaskGlobal.getMenuTemplate(action);
    if (customTemplate) {
      // 如果是字符串，直接返回
      if (typeof customTemplate === 'string') {
        return customTemplate;
      }
      // 如果是对象，转换为JSON字符串
      return JSON.stringify(customTemplate, null, 2);
    }
    
    // 如果不是自定义模板，调用原始方法
    if (originalTemplate && typeof originalTemplate === 'function') {
      return originalTemplate.call(this, action);
    }
    
    // 默认返回
    return undefined;
  };
}

// 立即注册所有菜单模板
try {
  registerAllMenuTemplates();
} catch (error) {
  if (typeof MNUtil !== "undefined" && MNUtil.log) {
    MNUtil.log(`❌ 注册菜单模板时出错: ${error.message}`);
  }
}

// 导出注册函数供外部使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    registerMenuTemplate: MNTaskGlobal.registerMenuTemplate,
    getMenuTemplate: MNTaskGlobal.getMenuTemplate
  };
}