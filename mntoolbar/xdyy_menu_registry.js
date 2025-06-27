/**
 * 夏大鱼羊自定义菜单注册表
 * 用于解耦菜单模板定义，避免修改 utils.js
 */

// 创建全局注册表
if (typeof global === 'undefined') {
  var global = {};
}

// 初始化菜单注册表
global.customMenuTemplates = {};

/**
 * 注册自定义菜单模板
 * @param {string} name - 菜单名称
 * @param {Object} template - 菜单模板对象
 */
global.registerMenuTemplate = function(name, template) {
  global.customMenuTemplates[name] = template;
  if (typeof MNUtil !== "undefined" && MNUtil.log) {
    MNUtil.log(`📦 已注册菜单模板: ${name}`);
  }
};

/**
 * 获取菜单模板
 * @param {string} name - 菜单名称
 * @returns {Object|null} 菜单模板对象
 */
global.getMenuTemplate = function(name) {
  return global.customMenuTemplates[name] || null;
};

/**
 * 注册所有自定义菜单模板
 */
function registerAllMenuTemplates() {
  // 评论菜单
  global.registerMenuTemplate("menu_comment", {
    action: "moveNewContentsByPopupTo",
    onLongPress: {
      action: "menu",
      menuWidth: 300,
      menuItems: [
        {
          action: "replaceFieldContentByPopup",
          menuTitle: "替换字段",
        },
        {
          action: "deleteCommentsByPopup",
          menuTitle: "删除评论",
        },
      ]
    }
  });
  
  // 思考菜单
  global.registerMenuTemplate("menu_think", {
    action: "moveUpThoughtPointsToBottom",
    onLongPress: {
      action: "menu",
      menuWidth: 330,
      menuItems: [
        {
          action: "moveUpThoughtPointsToTop",
          menuTitle: "思考点🔝思考区「上方」"
        },
        {
          action: "addThoughtPoint",  
          menuTitle: "➕思考点"
        },
        {
          action: "addThoughtPointAndMoveLastCommentToThought",
          menuTitle: "➕思考点 & 最后1️⃣💬⬆️思考",
        },
        {
          action: "addThoughtPointAndMoveNewCommentsToThought",
          menuTitle: "➕思考点 & 新💬⬆️思考",
        },
        {
          action: "moveLastCommentToThought",
          menuTitle: "最后1️⃣💬⬆️思考"
        },
        {
          action: "moveLastTwoCommentsToThought",
          menuTitle: "最后2️⃣💬⬆️思考"
        }
      ]
    }
  });

  // 学习菜单
  global.registerMenuTemplate("menu_study", {
    action: "menu",
    menuWidth: 180,
    menuItems: [
      {
        action: "openChatAI",
        menuTitle: "ChatAI"
      },
      {
        action: "readSelectedText",
        menuTitle: "朗读"
      },
      {
        action: "searchInThisBook",
        menuTitle: "搜索"
      },
      {
        action: "lookUpInDict",
        menuTitle: "查词典"
      },
      {
        action: "searchInWeb",
        menuTitle: "搜索网页"
      }
    ]
  });

  // 文献菜单
  global.registerMenuTemplate("menu_reference", {
    action: "menu",
    menuWidth: 270,
    menuItems: [
      {
        action: "getReferenceNote",
        menuTitle: "获取参考文献"
      },
      {
        action: "addReferenceIdsToAllFilesByPopup",
        menuTitle: "绑定文献ID到「所有文件」"
      },
      {
        action: "addReferenceIdsToDocByPopup",
        menuTitle: "绑定文献ID到「当前文档」"
      },
      {
        action: "saveReferenceIdsMapByPopup",
        menuTitle: "保存文献IDs映射表"
      },
      {
        action: "importReferenceIdsByPopup",
        menuTitle: "导入文献IDs映射表"
      }
    ]
  });

  // HTML/Markdown 评论菜单
  global.registerMenuTemplate("menu_htmlmdcomment", {
    action: "addHtmlMarkdownComment",
    onLongPress: {
      action: "menu",
      menuWidth: 200,
      menuItems: [
        {
          action: "addHtmlMarkdownComment",
          menuTitle: "HTML 评论"
        },
        {
          action: "mdComment",
          menuTitle: "Markdown 评论"
        }
      ]
    }
  });

  // 添加更多菜单模板...
  
  if (typeof MNUtil !== "undefined" && MNUtil.log) {
    MNUtil.log(`🚀 已注册 ${Object.keys(global.customMenuTemplates).length} 个自定义菜单模板`);
  }
}

// 扩展 toolbarConfig.template 方法
if (typeof toolbarConfig !== 'undefined') {
  // 保存原始的 template 方法
  const originalTemplate = toolbarConfig.template;
  
  // 重写 template 方法
  toolbarConfig.template = function(action) {
    // 先检查自定义菜单模板
    const customTemplate = global.getMenuTemplate(action);
    if (customTemplate) {
      return customTemplate;
    }
    
    // 如果不是自定义模板，调用原始方法
    if (originalTemplate && typeof originalTemplate === 'function') {
      return originalTemplate.call(this, action);
    }
    
    // 默认返回
    return undefined;
  };
  
  if (typeof MNUtil !== "undefined" && MNUtil.log) {
    MNUtil.log("✅ toolbarConfig.template 方法已扩展，支持自定义菜单模板");
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
    registerMenuTemplate: global.registerMenuTemplate,
    getMenuTemplate: global.getMenuTemplate
  };
}