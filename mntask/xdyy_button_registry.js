/**
 * 夏大鱼羊自定义按钮注册表
 * 用于解耦按钮配置，避免修改 utils.js
 */

// 调试：检查加载状态
if (typeof MNUtil !== "undefined" && MNUtil.log) {
  MNUtil.log("🔧 开始加载 xdyy_button_registry.js");
  MNUtil.log(`🔍 taskConfig 是否存在: ${typeof taskConfig !== 'undefined'}`);
}

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
  if (typeof MNUtil !== "undefined" && MNUtil.log) {
    MNUtil.log(`📦 [MNTask] 已注册按钮: ${key}`);
  }
};

/**
 * 获取按钮配置
 * @param {string} key - 按钮键名
 * @returns {Object|null} 按钮配置对象
 */
MNTaskGlobal.getButton = function(key) {
  return MNTaskGlobal.customButtons[key] || null;
};

// 保持向后兼容（但带警告）
if (typeof global === 'undefined') {
  var global = MNTaskGlobal;
} else if (!global.customButtons) {
  // 如果 global 存在但没有 customButtons，说明可能是其他插件创建的
  global = MNTaskGlobal;
}

/**
 * 注册所有自定义按钮
 * 严格按照原始 getActions() 的内容
 */
function registerAllButtons() {
  // 制卡相关按钮
  MNTaskGlobal.registerButton("custom15", {
    name: "制卡",
    image: "makeCards",
    templateName: "menu_makeCards"  // 延迟获取template
  });
  
  MNTaskGlobal.registerButton("custom1", {
    name: "制卡",
    image: "makeCards",
    templateName: "TemplateMakeNotes"
  });

  MNTaskGlobal.registerButton("custom3", {
    name: "增加模板",
    image: "addTemplate",
    templateName: "addTemplate"
  });
  
  MNTaskGlobal.registerButton("custom10", {
    name: "评论",
    image: "comment",
    templateName: "menu_comment"
  });

  // 评论相关按钮
  MNTaskGlobal.registerButton("custom20", {
    name: "htmlMarkdown 评论",
    image: "htmlmdcomment",
    templateName: "menu_htmlmdcomment"
  });
  
    // 卡片操作
  MNTaskGlobal.registerButton("custom5", {
    name: "卡片",
    image: "card",
    templateName: "menu_card"
  });
  
  // 学习和模板
  MNTaskGlobal.registerButton("custom2", {
    name: "学习",
    image: "study",
    templateName: "menu_study"
  });

  MNTaskGlobal.registerButton("custom9", {
    name: "思考",
    image: "think",
    templateName: "menu_think"
  });
  
  MNTaskGlobal.registerButton("custom4", {
    name: "文献",
    image: "reference",
    templateName: "menu_reference"
  });

  MNTaskGlobal.registerButton("custom7", {
    name: "隐藏插件栏",
    image: "hideAddonBar",
    templateName: "hideAddonBar"
  });
  
  MNTaskGlobal.registerButton("custom6", {
    name: "文本",
    image: "text",
    templateName: "menu_text"
  });
  
  MNTaskGlobal.registerButton("custom17", {
    name: "卡片储存",
    image: "pin_white",
    templateName: "menu_card_pin"
  });
  
  // 其他功能
  MNTaskGlobal.registerButton("snipaste", {
    name: "Snipaste",
    image: "snipaste",
    description: "Snipaste"
  });
  
  MNTaskGlobal.registerButton("custom11", {
    name: "工作流",
    image: "workflow",
    templateName: "menu_card_workflow"
  });
  
  
  MNTaskGlobal.registerButton("edit", {
    name: "edit",
    image: "edit",
    description: JSON.stringify({showOnNoteEdit:false})
  });
  
  MNTaskGlobal.registerButton("copyAsMarkdownLink", {
    name: "Copy md link",
    image: "copyAsMarkdownLink",
    description: "Copy md link"
  });
  
  
  // 专门用于替换原有按钮
  MNTaskGlobal.registerButton("custom16", {
    name: "[手型工具弹窗替换]文本",
    image: "text_white",
    templateName: "menu_handtool_text"
  });
  
  // "custom15":{name:"[卡片弹窗替换]SOP",image:"sop_white",description: this.template("menu_sop")},
  
  MNTaskGlobal.registerButton("custom12", {
    name: "[卡片弹窗替换]工作流",
    image: "workflow_white",
    templateName: "menu_card_workflow"
  });
  
  MNTaskGlobal.registerButton("custom13", {
    name: "[卡片弹窗替换]摘录",
    image: "excerpt_white",
    templateName: "menu_excerpt"
  });
  
  MNTaskGlobal.registerButton("custom14", {
    name: "MN",
    image: "MN_white",
    templateName: "menu_MN"
  });
  
  if (typeof MNUtil !== "undefined" && MNUtil.log) {
    MNUtil.log(`🚀 已注册 ${Object.keys(global.customButtons).length} 个自定义按钮`);
  }
}

// 扩展 taskConfig 的函数
function extendTaskConfig() {
  if (typeof taskConfig === 'undefined') {
    if (typeof MNUtil !== "undefined" && MNUtil.log) {
      MNUtil.log("⚠️ taskConfig 还未定义，等待初始化");
    }
    return false;
  }
  
  if (typeof MNUtil !== "undefined" && MNUtil.log) {
    MNUtil.log("🚀 开始扩展 taskConfig.getActions 方法");
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
    if (Object.keys(global.customButtons).length === 0) {
      return defaultActions;
    }
    
    // 创建一个新对象，完全替换 custom 按钮
    const allActions = {};
    
    // 添加所有自定义按钮
    for (const key in global.customButtons) {
      const button = Object.assign({}, global.customButtons[key]);
      
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
  
  if (typeof MNUtil !== "undefined" && MNUtil.log) {
    MNUtil.log("✅ taskConfig.getActions 方法已扩展，支持自定义按钮");
  }
  
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
  const customKeys = Object.keys(global.customButtons);
  
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
  
  if (typeof MNUtil !== "undefined" && MNUtil.log) {
    MNUtil.log(`🔄 强制刷新按钮配置完成，共 ${Object.keys(newActions).length} 个按钮`);
    MNUtil.log(`📍 action 数组: ${taskConfig.action.slice(0, 10).join(', ')}...`);
    MNUtil.log(`📍 dynamicAction 数组: ${taskConfig.dynamicAction.slice(0, 10).join(', ')}...`);
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
  if (typeof MNUtil !== "undefined" && MNUtil.log) {
    MNUtil.log(`❌ 注册按钮时出错: ${error.message}`);
  }
}

// 导出全局函数
global.forceRefreshButtons = forceRefreshButtons;
global.extendTaskConfig = extendTaskConfig;

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
      if (typeof MNUtil !== "undefined" && MNUtil.log) {
        MNUtil.log("📢 收到 taskConfig 初始化通知");
      }
      
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