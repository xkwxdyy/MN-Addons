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
  if (typeof MNUtil !== "undefined" && MNUtil.log) {
    MNUtil.log(`📦 [MNTask] 已注册菜单模板: ${name}`);
  }
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
    action: "menu",
    menuWidth: 320,
    menuItems: [
      "⬇️ 创建任务",
      {
        action: "createOKRTaskFromNote",
        menuTitle: "    📝 从当前卡片创建 OKR 任务"
      },
      {
        action: "OKRNoteMake",
        menuTitle: "    🎯 OKR 制卡流"
      },
      {
        action: "createSubTask",
        menuTitle: "    📊 创建子任务"
      },
      "⬇️ 任务状态",
      {
        action: "toggleTaskStatus",
        menuTitle: "    ✅ 切换任务状态（未开始→进行中→已完成）"
      },
      {
        action: "undoOKRNoteMake",
        menuTitle: "    ↩️ 回退任务状态"
      },
      {
        action: "menu",
        menuTitle: "    ➡️ 设置任务状态",
        menuItems: [
          {
            action: "setTaskNotStarted",
            menuTitle: "📋 未开始"
          },
          {
            action: "setTaskInProgress",
            menuTitle: "🚀 进行中"
          },
          {
            action: "setTaskCompleted",
            menuTitle: "✅ 已完成"
          }
        ]
      },
      "⬇️ 任务类型",
      {
        action: "menu",
        menuTitle: "    ➡️ 设置任务类型",
        menuItems: [
          {
            action: "setAsObjective",
            menuTitle: "🎯 目标 (Objective)"
          },
          {
            action: "setAsKeyResult",
            menuTitle: "📊 关键结果 (Key Result)"
          },
          {
            action: "setAsProject",
            menuTitle: "📁 项目 (Project)"
          },
          {
            action: "setAsTask",
            menuTitle: "📋 任务 (Task)"
          }
        ]
      },
      "⬇️ 任务关联",
      {
        action: "linkToParentTask",
        menuTitle: "    🔗 链接到父任务"
      },
      {
        action: "focusParentTask",
        menuTitle: "    🎯 定位到父任务"
      },
      {
        action: "viewTaskPath",
        menuTitle: "    📍 查看任务路径"
      }
    ]
  });

  // menu_task_progress - 进度追踪菜单
  MNTaskGlobal.registerMenuTemplate("menu_task_progress", {
    action: "menu",
    menuWidth: 350,
    menuItems: [
      "⬇️ 进度更新",
      {
        action: "updateTaskProgress",
        menuTitle: "    📊 更新任务进度百分比"
      },
      {
        action: "updateReadingProgress",
        menuTitle: "    📖 更新阅读进度（页数/章节）"
      },
      {
        action: "addProgressNote",
        menuTitle: "    📝 添加进度备注"
      },
      {
        action: "recordTimeSpent",
        menuTitle: "    ⏱️ 记录花费时间"
      },
      "⬇️ 进度查看",
      {
        action: "viewTaskProgress",
        menuTitle: "    📈 查看当前进度"
      },
      {
        action: "viewProgressHistory",
        menuTitle: "    📜 查看进度历史"
      },
      {
        action: "viewChildTasksProgress",
        menuTitle: "    📊 查看子任务进度"
      },
      "⬇️ 统计分析",
      {
        action: "calculateCompletionRate",
        menuTitle: "    📈 计算完成率"
      },
      {
        action: "estimateCompletionTime",
        menuTitle: "    ⏰ 预估完成时间"
      },
      {
        action: "generateProgressReport",
        menuTitle: "    📊 生成进度报告"
      }
    ]
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
        action: "filterByStatus",
        menuTitle: "    📊 按状态筛选（进行中/未开始）"
      },
      {
        action: "filterByType",
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
  
  if (typeof MNUtil !== "undefined" && MNUtil.log) {
    MNUtil.log(`🚀 已注册 ${Object.keys(MNTaskGlobal.customMenuTemplates).length} 个自定义菜单模板`);
  }
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
  
  if (typeof MNUtil !== "undefined" && MNUtil.log) {
    MNUtil.log("✅ taskConfig.template 方法已扩展，支持自定义菜单模板");
  }
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