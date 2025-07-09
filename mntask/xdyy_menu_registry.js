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
  // menu_task_manage - 任务管理菜单（精简版）
  MNTaskGlobal.registerMenuTemplate("menu_task_manage", {
    action: "taskCardMake",  // 单击直接触发智能任务制卡
    onLongPress: {           // 长按显示完整菜单
      action: "menu",
      menuWidth: 300,
      menuItems: [
        {
          action: "taskCardMake",
          menuTitle: "📝 智能任务制卡"
        },
        {
          action: "changeTaskType",
          menuTitle: "🔄 修改卡片类型（支持多选）"
        },
        {
          action: "batchTaskCardMakeByHierarchy",
          menuTitle: "🏗️ 根据层级批量制卡"
        },
        {
          action: "updateChildrenPaths",
          menuTitle: "🔄 更新子卡片路径"
        },
        {
          action: "renewCards",
          menuTitle: "🔄 更新卡片（路径/链接/字段）"
        }
      ]
    }
  });

  // menu_task_progress - 进度管理菜单（精简版）
  MNTaskGlobal.registerMenuTemplate("menu_task_progress", {
    action: "toggleTaskStatusForward",  // 单击切换任务状态（向前）
    onLongPress: {                      // 长按显示完整菜单
      action: "menu",
      menuWidth: 280,
      menuItems: [
        {
          action: "toggleTaskStatusForward",
          menuTitle: "➡️ 推进状态"
        },
        {
          action: "toggleTaskStatusBackward",
          menuTitle: "↩️ 退回状态"
        }
      ]
    }
  });

  // menu_today_tasks - 今日任务菜单（精简版）
  MNTaskGlobal.registerMenuTemplate("menu_today_tasks", {
    action: "toggleTodayMark",     // 单击切换今日标记
    onLongPress: {                 // 长按显示完整菜单
      action: "menu",
      menuWidth: 280,
      menuItems: [
        {
          action: "toggleTodayMark",
          menuTitle: "📅 标记/取消今日任务"
        },
        {
          action: "setTaskPriority",
          menuTitle: "🔥 设置任务优先级"
        },
        {
          action: "focusTodayTasks",
          menuTitle: "🎯 聚焦今日看板"
        },
        {
          action: "refreshTodayBoard",
          menuTitle: "🔄 刷新今日看板"
        },
        {
          action: "handleOverdueTasks",
          menuTitle: "⚠️ 处理过期任务"
        }
      ]
    }
  });


  // menu_filter_sort - 筛选排序菜单（精简版）
  MNTaskGlobal.registerMenuTemplate("menu_filter_sort", {
    action: "filterTasks",  // 单击直接进入筛选
    onLongPress: {
      action: "menu",
      menuWidth: 300,
      menuItems: [
        {
          action: "filterTasks",
          menuTitle: "🔍 任务筛选器"
        },
        {
          action: "sortTasks",
          menuTitle: "📊 任务排序"
        },
        {
          action: "batchTaskOperation",
          menuTitle: "⚡ 批量任务操作"
        },
        {
          action: "filterThisWeek",
          menuTitle: "📊 本周任务"
        },
        {
          action: "filterOverdue",
          menuTitle: "⚠️ 已逾期任务"
        },
        {
          action: "filterByTaskStatus",
          menuTitle: "📈 按状态筛选"
        }
      ]
    }
  });

  // menu_board_view - 看板视图菜单（精简版）
  MNTaskGlobal.registerMenuTemplate("menu_board_view", {
    action: "focusTodayTasks",  // 单击聚焦今日看板
    onLongPress: {
      action: "menu",
      menuWidth: 300,
      menuItems: [
        {
          action: "focusTodayTasks",
          menuTitle: "🎯 聚焦今日看板"
        },
        {
          action: "openTasksFloatMindMap",
          menuTitle: "📊 打开任务管理脑图"
        },
        {
          action: "getOKRNotesOnToday",
          menuTitle: "📊 获取今日OKR任务"
        },
        "──────────",
        {
          action: "achieveCards",
          menuTitle: "📦 归档已完成任务"
        },
        {
          action: "viewTaskStatistics",
          menuTitle: "📊 查看任务统计"
        },
        "──────────",
        {
          action: "exportTasksToJSON",
          menuTitle: "💾 导出任务数据 (JSON)"
        },
        {
          action: "exportTasksToMarkdown",
          menuTitle: "📝 导出任务报告 (Markdown)"
        }
      ]
    }
  });

  // menu_field_manage - 字段管理菜单（新增）
  MNTaskGlobal.registerMenuTemplate("menu_field_manage", {
    action: "addCustomField",  // 单击添加字段
    onLongPress: {
      action: "menu",
      menuWidth: 300,
      menuItems: [
        {
          action: "addCustomField",
          menuTitle: "📝 快速添加字段"
        },
        {
          action: "editCustomField",
          menuTitle: "✏️ 快速编辑字段"
        },
        {
          action: "manageCustomFields",
          menuTitle: "📋 字段管理（完整功能）"
        },
        "──────────",
        {
          action: "addTaskLogEntry",
          menuTitle: "📝 添加任务记录"
        },
        {
          action: "viewTaskLogs",
          menuTitle: "📊 查看任务记录"
        },
        {
          action: "updateTaskProgress",
          menuTitle: "📈 更新任务进度"
        },
        "──────────",
        {
          action: "addOrUpdateLaunchLink",
          menuTitle: "📱 添加/更新启动链接"
        }
      ]
    }
  });

  // menu_quick_launch - 快速启动菜单（新增）
  MNTaskGlobal.registerMenuTemplate("menu_quick_launch", {
    action: "quickLaunchTask",  // 单击自动启动第一个进行中任务
    onLongPress: {
      action: "menu",
      menuWidth: 300,
      menuItems: [
        {
          action: "quickLaunchTask",
          menuTitle: "🚀 快速启动任务"
        },
        {
          action: "selectAndLaunchTask",
          menuTitle: "🎯 选择并启动任务"
        },
        {
          action: "updateLaunchLink",
          menuTitle: "🔗 更新启动链接"
        },
        {
          action: "reorderTodayTasks",
          menuTitle: "📊 调整任务顺序"
        }
      ]
    }
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