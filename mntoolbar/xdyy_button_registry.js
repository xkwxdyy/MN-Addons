/**
 * 夏大鱼羊自定义按钮注册表
 * 用于解耦按钮配置，避免修改 utils.js
 */

// 创建全局注册表
if (typeof global === 'undefined') {
  var global = {};
}

// 初始化按钮注册表
global.customButtons = {};

/**
 * 注册自定义按钮
 * @param {string} key - 按钮键名
 * @param {Object} config - 按钮配置对象
 */
global.registerButton = function(key, config) {
  global.customButtons[key] = config;
  if (typeof MNUtil !== "undefined" && MNUtil.log) {
    MNUtil.log(`📦 已注册按钮: ${key}`);
  }
};

/**
 * 获取按钮配置
 * @param {string} key - 按钮键名
 * @returns {Object|null} 按钮配置对象
 */
global.getButton = function(key) {
  return global.customButtons[key] || null;
};

/**
 * 注册所有自定义按钮
 * 严格按照原始 getActions() 的内容
 */
function registerAllButtons() {
  // 制卡相关按钮
  global.registerButton("custom15", {
    name: "制卡",
    image: "makeCards",
    templateName: "menu_makeCards"  // 延迟获取template
  });
  
  global.registerButton("custom1", {
    name: "制卡",
    image: "makeCards",
    templateName: "TemplateMakeNotes"
  });
  
  // 评论相关按钮
  global.registerButton("custom20", {
    name: "htmlMarkdown 评论",
    image: "htmlmdcomment",
    templateName: "menu_htmlmdcomment"
  });
  
  global.registerButton("custom9", {
    name: "思考",
    image: "think",
    templateName: "menu_think"
  });
  
  global.registerButton("custom10", {
    name: "评论",
    image: "comment",
    templateName: "menu_comment"
  });
  
  // 学习和模板
  global.registerButton("custom2", {
    name: "学习",
    image: "study",
    templateName: "menu_study"
  });
  
  global.registerButton("custom3", {
    name: "增加模板",
    image: "addTemplate",
    templateName: "addTemplate"
  });
  
  // 卡片操作
  global.registerButton("custom5", {
    name: "卡片",
    image: "card",
    templateName: "menu_card"
  });
  
  global.registerButton("custom4", {
    name: "文献",
    image: "reference",
    templateName: "menu_reference"
  });
  
  global.registerButton("custom6", {
    name: "文本",
    image: "text",
    templateName: "menu_text"
  });
  
  global.registerButton("custom17", {
    name: "卡片储存",
    image: "pin_white",
    templateName: "menu_card_pin"
  });
  
  // 其他功能
  global.registerButton("snipaste", {
    name: "Snipaste",
    image: "snipaste",
    description: "Snipaste"
  });
  
  global.registerButton("custom7", {
    name: "隐藏插件栏",
    image: "hideAddonBar",
    templateName: "hideAddonBar"
  });
  
  global.registerButton("custom11", {
    name: "工作流",
    image: "workflow",
    templateName: "menu_card_workflow"
  });
  
  global.registerButton("execute", {
    name: "execute",
    image: "execute",
    description: "let focusNote = MNNote.getFocusNote()\nMNUtil.showHUD(focusNote.noteTitle)"
  });
  
  global.registerButton("ocr", {
    name: "ocr",
    image: "ocr",
    description: JSON.stringify({target:"comment",source:"default"})
  });
  
  global.registerButton("edit", {
    name: "edit",
    image: "edit",
    description: JSON.stringify({showOnNoteEdit:false})
  });
  
  global.registerButton("copyAsMarkdownLink", {
    name: "Copy md link",
    image: "copyAsMarkdownLink",
    description: "Copy md link"
  });
  
  global.registerButton("search", {
    name: "Search",
    image: "search",
    description: "Search"
  });
  
  global.registerButton("bigbang", {
    name: "Bigbang",
    image: "bigbang",
    description: "Bigbang"
  });
  
  global.registerButton("chatglm", {
    name: "ChatAI",
    image: "ai",
    description: "ChatAI"
  });
  
  // 专门用于替换原有按钮
  global.registerButton("custom16", {
    name: "[手型工具弹窗替换]文本",
    image: "text_white",
    templateName: "menu_handtool_text"
  });
  
  // "custom15":{name:"[卡片弹窗替换]SOP",image:"sop_white",description: this.template("menu_sop")},
  
  global.registerButton("custom12", {
    name: "[卡片弹窗替换]工作流",
    image: "workflow_white",
    templateName: "menu_card_workflow"
  });
  
  global.registerButton("custom13", {
    name: "[卡片弹窗替换]摘录",
    image: "excerpt_white",
    templateName: "menu_card_excerpt"
  });
  
  global.registerButton("custom14", {
    name: "MN",
    image: "MN_white",
    templateName: "menu_MN"
  });
  
  if (typeof MNUtil !== "undefined" && MNUtil.log) {
    MNUtil.log(`🚀 已注册 ${Object.keys(global.customButtons).length} 个自定义按钮`);
  }
}

// 扩展 toolbarConfig.getActions 方法
if (typeof toolbarConfig !== 'undefined') {
  // 保存原始的 getActions 方法
  const originalGetActions = toolbarConfig.getActions;
  
  // 重写 getActions 方法
  toolbarConfig.getActions = function() {
    // 获取默认按钮
    const defaultActions = originalGetActions ? originalGetActions.call(this) : {};
    
    // 合并自定义按钮
    const allActions = Object.assign({}, defaultActions);
    
    // 覆盖自定义按钮
    for (const key in global.customButtons) {
      const button = Object.assign({}, global.customButtons[key]);
      
      // 如果有 templateName，动态获取 description
      if (button.templateName && !button.description) {
        button.description = this.template(button.templateName);
      }
      
      // 删除 templateName 属性
      delete button.templateName;
      
      allActions[key] = button;
    }
    
    return allActions;
  };
  
  if (typeof MNUtil !== "undefined" && MNUtil.log) {
    MNUtil.log("✅ toolbarConfig.getActions 方法已扩展，支持自定义按钮");
  }
}

// 立即注册所有按钮（不需要延迟，因为我们使用 templateName）
try {
  registerAllButtons();
} catch (error) {
  if (typeof MNUtil !== "undefined" && MNUtil.log) {
    MNUtil.log(`❌ 注册按钮时出错: ${error.message}`);
  }
}

// 导出注册函数供外部使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    registerButton: global.registerButton,
    getButton: global.getButton,
    registerAllButtons: registerAllButtons
  };
}