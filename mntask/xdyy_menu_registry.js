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
          action: "changeTaskType",
          menuTitle: "🔄 修改卡片类型（支持多选）"
        },
        {
          action: "batchTaskCardMakeByHierarchy",
          menuTitle: "🏗️ 根据层级批量制卡"
        },
        {
          action: "updateChildrenPaths",
          menuTitle: "🔄 更新子卡片标题前缀的路径"
        },
        {
          action: "renewCards",
          menuTitle: "🔄 更新卡片（路径/链接/字段）"
        },
        {
          action: "testParentChildRelation",
          menuTitle: "🧪 测试制卡功能"
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
          action: "pauseTask",
          menuTitle: "⏸️ 暂停任务"
        },
        {
          action: "toggleTaskStatusBackward",
          menuTitle: "↩️ 退回状态"
        },
        {
          action: "achieveCards",
          menuTitle: "📦 归档已完成任务"
        },
      ]
    }
  });

  // menu_today_tasks - 今日任务菜单（精简版）
  MNTaskGlobal.registerMenuTemplate("menu_today_tasks", {
    action: "addTimestampRecord",     // 单击添加时间戳记录
    onLongPress: {                    // 长按显示完整菜单
      action: "menu",
      menuWidth: 280,
      menuItems: [
        {
          action: "addTimestampRecord",
          menuTitle: "⏱️ 添加时间戳记录"
        }
      ]
    }
  });


  // menu_filter_sort - 筛选排序菜单（精简版）
  MNTaskGlobal.registerMenuTemplate("menu_filter_sort", {
    action: "addTimestampRecord",  // 单击添加时间戳记录
    onLongPress: {
      action: "menu",
      menuWidth: 300,
      menuItems: [
        {
          action: "addTimestampRecord",
          menuTitle: "⏱️ 添加时间戳记录"
        }
      ]
    }
  });

  // menu_board_view - 看板视图菜单（精简版）
  MNTaskGlobal.registerMenuTemplate("menu_board_view", {
    action: "achieveCards",  // 单击归档任务
    onLongPress: {
      action: "menu",
      menuWidth: 300,
      menuItems: [
        {
          action: "achieveCards",
          menuTitle: "📦 归档已完成任务"
        },
        {
          action: "renewCards",
          menuTitle: "🔄 更新卡片"
        }
      ]
    }
  });

  // menu_field_manage - 字段管理菜单（新增）
  MNTaskGlobal.registerMenuTemplate("menu_field_manage", {
    action: "editCustomField",  // 单击编辑字段
    onLongPress: {
      action: "menu",
      menuWidth: 300,
      menuItems: [
        {
          action: "editCustomField",
          menuTitle: "✏️ 快速编辑字段"
        },
        {
          action: "addOrUpdateLaunchLink",
          menuTitle: "📱 添加/更新启动链接"
        }
      ]
    }
  });

  // menu_quick_launch - 快速启动菜单（新增）
  MNTaskGlobal.registerMenuTemplate("menu_quick_launch", {
    action: "launchTask",  // 单击启动任务
    onLongPress: {
      action: "menu",
      menuWidth: 300,
      menuItems: [
        {
          action: "locateCurrentTaskInFloat",
          menuTitle: "📍 在浮窗中定位当前任务"
        },
        {
          action: "addOrUpdateLaunchLink",
          menuTitle: "📱 添加/更新启动链接"
        },
        {
          action: "copyCurrentPageLink",
          menuTitle: "📋 复制当前页面链接"
        }
      ]
    }
  });

  // menu_record_log - 记录菜单（新增）
  MNTaskGlobal.registerMenuTemplate("menu_record_log", {
    action: "addTimestampRecord"  // 单击添加时间戳记录
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