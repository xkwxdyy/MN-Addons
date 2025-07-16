/**
 * 夏大鱼羊自定义按钮注册表
 * 用于解耦按钮配置，避免修改 utils.js
 */

// 创建 MNTask 专用命名空间，避免与 MNToolbar 冲突
if (typeof MNTaskGlobal === 'undefined') {
  var MNTaskGlobal = {};
}

// 初始化按钮注册表
MNTaskGlobal.customButtons = {};

/**
 * 注册自定义按钮
 * @param {string} key - 按钮键名
 * @param {Object} config - 按钮配置对象
 */
MNTaskGlobal.registerButton = function(key, config) {
  MNTaskGlobal.customButtons[key] = config;
};

/**
 * 获取按钮配置
 * @param {string} key - 按钮键名
 * @returns {Object|null} 按钮配置对象
 */
MNTaskGlobal.getButton = function(key) {
  return MNTaskGlobal.customButtons[key] || null;
};

// 不再需要全局 global 对象，避免与 MNToolbar 冲突

/**
 * 注册所有自定义按钮
 * 精简后的6个核心功能按钮
 */
function registerAllButtons() {

  // custom7: 快速启动 - 单击自动启动任务，长按显示启动选项菜单
  MNTaskGlobal.registerButton("custom7", {
    name: "快速启动",
    image: "custom7",
    templateName: "menu_quick_launch"
  });

  // custom8: 记录 - 单击添加时间戳记录，长按显示记录相关菜单
  MNTaskGlobal.registerButton("custom8", {
    name: "记录",
    image: "custom8",
    templateName: "menu_record_log"
  });

  // custom6: 字段管理 - 单击添加字段，长按显示字段操作菜单
  MNTaskGlobal.registerButton("custom6", {
    name: "字段管理",
    image: "custom6",
    templateName: "menu_field_manage"
  });

  // custom1: 任务制卡 - 单击智能制卡，长按显示任务管理菜单
  MNTaskGlobal.registerButton("custom1", {
    name: "任务制卡",
    image: "custom1",
    templateName: "menu_task_manage"
  });

  // custom2: 状态切换 - 单击向前切换状态，长按显示进度管理菜单
  MNTaskGlobal.registerButton("custom2", {
    name: "状态切换",
    image: "custom2",
    templateName: "menu_task_progress"
  });

  // custom3: 今日任务 - 单击标记今日，长按显示今日任务菜单
  MNTaskGlobal.registerButton("custom3", {
    name: "今日任务",
    image: "custom3",
    templateName: "menu_today_tasks"
  });

  // custom4: 筛选排序 - 单击快速筛选，长按显示高级筛选菜单
  MNTaskGlobal.registerButton("custom4", {
    name: "筛选排序",
    image: "custom4",
    templateName: "menu_filter_sort"
  });

  // custom5: 看板视图 - 单击聚焦今日看板，长按显示看板选项
  MNTaskGlobal.registerButton("custom5", {
    name: "看板视图",
    image: "custom5",
    templateName: "menu_board_view"
  });

}

// 扩展 taskConfig 的函数
function extendTaskConfig() {
  if (typeof taskConfig === 'undefined') {
    return false;
  }
  
  // 保存原始的 getActions 方法（如果还没保存）
  if (!taskConfig._originalGetActions) {
    taskConfig._originalGetActions = taskConfig.getActions;
  }
  
  // 重写 getActions 方法
  taskConfig.getActions = function() {
    // 获取默认按钮
    const defaultActions = taskConfig._originalGetActions ? taskConfig._originalGetActions.call(this) : {};
    
    // 如果自定义按钮为空，返回默认按钮
    if (Object.keys(MNTaskGlobal.customButtons).length === 0) {
      return defaultActions;
    }
    
    // 创建一个新对象，完全替换 custom 按钮
    const allActions = {};
    
    // 添加所有自定义按钮
    for (const key in MNTaskGlobal.customButtons) {
      const button = Object.assign({}, MNTaskGlobal.customButtons[key]);
      
      // 如果有 templateName，动态获取 description
      if (button.templateName && !button.description && this.template) {
        button.description = this.template(button.templateName);
      }
      
      // 删除 templateName 属性
      delete button.templateName;
      
      allActions[key] = button;
    }
    
    // 添加非 custom 的默认按钮
    for (const key in defaultActions) {
      if (!key.startsWith('custom') && !(key in allActions)) {
        allActions[key] = defaultActions[key];
      }
    }
    
    return allActions;
  };
  
  return true;
}

// 强制刷新按钮配置的函数
function forceRefreshButtons() {
  if (typeof taskConfig === 'undefined' || !taskConfig.actions) {
    return false;
  }
  
  // 获取新的按钮配置
  const newActions = taskConfig.getActions();
  taskConfig.actions = newActions;
  
  // 创建自定义按钮的键名数组
  const customKeys = Object.keys(MNTaskGlobal.customButtons);
  
  // 更新 action 数组：替换所有 custom 按钮
  if (taskConfig.action && Array.isArray(taskConfig.action)) {
    // 先移除所有旧的 custom 按钮
    taskConfig.action = taskConfig.action.filter(key => !key.startsWith('custom'));
    // 添加我们的 custom 按钮
    taskConfig.action = customKeys.concat(taskConfig.action);
  }
  
  // 更新 dynamicAction 数组：替换所有 custom 按钮
  if (taskConfig.dynamicAction && Array.isArray(taskConfig.dynamicAction)) {
    // 先移除所有旧的 custom 按钮
    taskConfig.dynamicAction = taskConfig.dynamicAction.filter(key => !key.startsWith('custom'));
    // 添加我们的 custom 按钮
    taskConfig.dynamicAction = customKeys.concat(taskConfig.dynamicAction);
  }
  
  // 发送刷新通知
  if (typeof MNUtil !== "undefined" && MNUtil.postNotification) {
    MNUtil.postNotification("refreshTaskButton", {});
  }
  
  return true;
}

// 立即尝试扩展（文件加载时）
extendTaskConfig();

// 立即注册所有按钮（不需要延迟，因为我们使用 templateName）
try {
  registerAllButtons();
} catch (error) {
  // 静默处理错误
}

// 导出全局函数（使用 MNTaskGlobal）
MNTaskGlobal.forceRefreshButtons = forceRefreshButtons;
MNTaskGlobal.extendTaskConfig = extendTaskConfig;

// 导出注册函数供外部使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    registerButton: MNTaskGlobal.registerButton,
    getButton: MNTaskGlobal.getButton,
    registerAllButtons: registerAllButtons,
    forceRefreshButtons: forceRefreshButtons,
    extendTaskConfig: extendTaskConfig
  };
}

// 添加观察者，在 taskConfig 初始化后强制刷新
if (typeof MNUtil !== 'undefined' && MNUtil.addObserver) {
  // 创建一个临时对象来接收通知
  const observer = {
    onTaskConfigInit: function() {
      // 延迟一点确保初始化完成
      setTimeout(function() {
        if (extendTaskConfig()) {
          forceRefreshButtons();
        }
      }, 50);
    }
  };
  
  // 监听初始化通知
  MNUtil.addObserver(observer, 'onTaskConfigInit:', 'TaskConfigInit');
}

// 延迟执行，以防通知机制失效
if (typeof setTimeout !== 'undefined') {
  // 500ms 后尝试强制刷新
  setTimeout(function() {
    if (extendTaskConfig()) {
      forceRefreshButtons();
    }
  }, 500);
  
  // 2秒后再次尝试，确保生效
  setTimeout(function() {
    if (extendTaskConfig()) {
      forceRefreshButtons();
    }
  }, 2000);
}

// 立即强制刷新一次（解决缓存问题）
if (typeof taskConfig !== 'undefined' && taskConfig.getActions) {
  try {
    forceRefreshButtons();
  } catch (error) {
    // 静默处理
  }
}

// 提供全局访问点（用于控制台调试）
if (typeof global === 'undefined') {
  var global = {};
}
global.MNTaskForceRefresh = function() {
  forceRefreshButtons();
  MNUtil.showHUD("🔄 MNTask 按钮已刷新");
};