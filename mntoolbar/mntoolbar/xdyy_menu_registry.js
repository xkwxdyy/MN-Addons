/**
 * 夏大鱼羊自定义菜单注册表
 * 用于解耦菜单模板定义，避免修改 utils.js
 * 严格按照原始 template 函数的内容
 */

// 创建全局注册表
if (typeof global === "undefined") {
  var global = {};
}

// 初始化菜单注册表
global.customMenuTemplates = {};

/**
 * 注册自定义菜单模板
 * @param {string} name - 菜单名称
 * @param {Object} template - 菜单模板对象
 */
global.registerMenuTemplate = function (name, template) {
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
global.getMenuTemplate = function (name) {
  return global.customMenuTemplates[name] || null;
};

/**
 * 注册所有自定义菜单模板
 * 严格按照原始 template(action) 函数中的 case 语句内容
 */
function registerAllMenuTemplates() {
  // menu_comment
  global.registerMenuTemplate("menu_comment", {
    action: "manageCommentsByPopup",
    onLongPress: {
      action: "menu",
      menuWidth: 300,
      menuItems: [
        "🔗 链接处理",
        {
          action: "removeBidirectionalLinks",
          menuTitle: "    删除双向链接",
        },
        {
          action: "updateBidirectionalLink",
          menuTitle: "    更新链接",
        },
        {
          action: "linkRemoveDuplicatesAfterApplication",
          menuTitle: "    “应用”下方的链接去重",
        },
        {
          action: "reorderContainsFieldLinks",
          menuTitle: "  定义“相关链接”下方的链接重新排序",
        },
        "⬇️ 字段处理",
        {
          action: "replaceFieldContentByPopup",
          menuTitle: "    替换字段",
        },
        {
          action: "retainFieldContentOnly",
          menuTitle: "    保留某个字段内容",
        },
        "❌ 删除评论",
        {
          action: "clearContentKeepExcerptWithTitle",
          menuTitle: "    只保留摘录和标题",
        },
        {
          action: "clearContentKeepExcerpt",
          menuTitle: "    只保留摘录，无标题",
        },
        "⬇️ 移动最后一条评论",
        {
          action: "moveLastCommentToBelongArea",
          menuTitle: "    移动到所属区",
        },
      ],
    },
  });

  // menu_think
  global.registerMenuTemplate("menu_think", {
    action: "moveUpThoughtPointsToBottom",
    onLongPress: {
      action: "menu",
      menuWidth: 330,
      menuItems: [],
    },
  });

  // menu_study
  global.registerMenuTemplate("menu_study", {
    action: "menu",
    menuWidth: 330,
    menuItems: [
      {
        action: "autoMoveLinksBetweenCards",
        menuTitle: "自动移动卡片之间的链接",
      },
    ],
  });

  // menu_reference
  global.registerMenuTemplate("menu_reference", {
    action: "menu",
    menuItems: [
      {
        action: "menu",
        menuTitle: "➡️ 🧠文献学习",
        menuWidth: 500,
        menuItems: [
          "⬇️ ➕引用",
          {
            action: "referenceRefByRefNumAndFocusInMindMap",
            menuTitle:
              "选中「具体引用」卡片+输入文献号→ ➕引用 + 剪切归类 + 主视图定位",
          },
          {
            action: "referenceRefByRefNumAddFocusInFloatMindMap",
            menuTitle:
              "选中「具体引用」卡片+输入文献号→ ➕引用 + 剪切归类 + 浮窗定位",
          },
          "⬇️ ➕「具体引用情况」汇总卡片",
          {
            action: "referenceCreateClassificationNoteByIdAndFocusNote",
            menuTitle:
              "选中「参考文献摘录」卡片+输入文献号→ 「具体引用情况」汇总卡片 + 浮窗定位",
          },
        ],
      },
      {
        action: "menu",
        menuTitle: "➡️ 参考文献 🆔",
        menuItems: [
          {
            action: "menu",
            menuTitle: "👉 当前文档相关 🆔 录入",
            menuWidth: 350,
            menuItems: [
              {
                action: "referenceStoreIdForCurrentDocByFocusNote",
                // menuTitle: "当前文档与选中卡片的🆔绑定",
                menuTitle: "绑定「选中的卡片」➡️「当前文档」",
              },
              {
                action: "referenceStoreOneIdForCurrentDocByFocusNote",
                menuTitle: "绑定「选中的卡片」➡️ 文献号",
              },
              {
                action: "referenceTestIfIdInCurrentDoc",
                menuTitle: "检测文献号的🆔绑定",
              },
            ],
          },
          {
            action: "menu",
            menuTitle: "➡️ 导出 🆔",
            menuWidth: 250,
            menuItems: [
              {
                action: "referenceExportReferenceIdsToClipboard",
                menuTitle: "导出参考文献卡片🆔到剪切板",
              },
              {
                action: "referenceExportReferenceIdsToFile",
                menuTitle: "导出参考文献卡片🆔到文件",
              },
            ],
          },
          {
            action: "menu",
            menuTitle: "⬅️ 导入 🆔",
            menuWidth: 250,
            menuItems: [
              {
                action: "referenceInputReferenceIdsFromClipboard",
                menuTitle: "从剪切板导入参考文献卡片🆔",
              },
              {
                action: "referenceInputReferenceIdsFromFile",
                menuTitle: "从文件导入参考文献卡片🆔",
              },
            ],
          },
        ],
      },
      {
        action: "menu",
        menuTitle: "➡️ 🗂️文献卡片",
        menuItems: [
          {
            action: "referenceInfoAuthor",
            menuTitle: "👨‍🎓 作者",
          },
          {
            action: "referenceInfoYear",
            menuTitle: "⌛️ 年份",
          },
          {
            action: "referenceInfoJournal",
            menuTitle: "📄 期刊",
          },
          {
            action: "referenceInfoPublisher",
            menuTitle: "📚 出版社",
          },
          {
            action: "referenceInfoKeywords",
            menuTitle: "📌 关键词",
          },
          {
            action: "referenceInfoDoiFromClipboard",
            menuTitle: "🔢 DOI",
          },
          {
            action: "menu",
            menuTitle: "➡️ 🔗 引用样式",
            menuItems: [
              {
                action: "referenceInfoRefFromInputRefNum",
                menuTitle: "输入文献号录入引用样式",
              },
              {
                action: "referenceInfoRefFromFocusNote",
                menuTitle: "选中摘录自动录入引用样式",
              },
              {
                action: "referenceInfoInputRef",
                menuTitle: "手动输入引用样式",
              },
            ],
          },
          {
            action: "menu",
            menuTitle: "➡️ .bib 信息",
            menuItems: [
              {
                action: "referenceBibInfoPasteFromClipboard",
                menuTitle: "从剪切板粘贴 .bib 信息",
              },
              {
                action: "referenceBibInfoCopy",
                menuTitle: "复制 .bib 信息",
              },
              {
                action: "referenceBibInfoExport",
                menuTitle: "导出 .bib 信息",
              },
            ],
          },
        ],
      },
      {
        action: "menu",
        menuTitle: "➡️ 👨‍🎓作者卡片",
        menuItems: [
          {
            action: "referenceAuthorRenewAbbreviation",
            menuTitle: "更新作者缩写",
          },
          {
            action: "referenceAuthorInfoFromClipboard",
            menuTitle: "粘贴个人信息",
          },
          {
            action: "referenceAuthorNoteMake",
            menuTitle: "作者卡片制卡",
          },
        ],
      },
      {
        action: "menu",
        menuTitle: "➡️ 📄期刊卡片",
        menuItems: [],
      },
      {
        action: "menu",
        menuTitle: "➡️ 📌关键词卡片",
        menuItems: [
          {
            action: "referenceKeywordsAddRelatedKeywords",
            menuTitle: "➕相关关键词",
          },
          {
            action: "referenceGetRelatedReferencesByKeywords",
            menuTitle: "根据关键词筛选文献",
          },
        ],
      },
    ],
  });

  // menu_text
  global.registerMenuTemplate("menu_text", {
    action: "menu",
    menuItems: [
      {
        action: "menu",
        menuTitle: "→ 文档中选中的文本",
        menuItems: [
          {
            action: "selectionTextToTitleCase",
            menuTitle: "标题规范",
          },
          {
            action: "selectionTextToLowerCase",
            menuTitle: "转小写",
          },
          {
            action: "selectionTextHandleSpaces",
            menuTitle: "处理空格",
          },
        ],
      },
      {
        action: "menu",
        menuTitle: "→ 复制的文本",
        menuItems: [
          {
            action: "copiedTextToTitleCase",
            menuTitle: "标题规范",
          },
          {
            action: "copiedTextToLowerCase",
            menuTitle: "转小写",
          },
          {
            action: "copiedTextHandleSpaces",
            menuTitle: "处理空格",
          },
        ],
      },
    ],
  });

  // menu_handtool_text
  global.registerMenuTemplate("menu_handtool_text", {
    action: "selectionTextToTitleCase",
    onLongPress: {
      action: "menu",
      menuItems: [
        {
          action: "selectionTextToTitleCase",
          menuTitle: "标题规范",
        },
        {
          action: "selectionTextToLowerCase",
          menuTitle: "转小写",
        },
        {
          action: "selectionTextHandleSpaces",
          menuTitle: "处理空格",
        },
      ],
    },
  });

  // menu_card
  global.registerMenuTemplate("menu_card", {
    action: "copyMarkdownVersionFocusNoteURL",
    onLongPress: {
      action: "menu",
      menuWidth: 350,
      menuItems: [
        "⬇️ 卡片处理",
        {
          action: "toBeIndependent",
          menuTitle: "    ⇨ 独立",
        },
        {
          action: "convertNoteToNonexcerptVersion",
          menuTitle: "    转化为非摘录版本",
        },
        {
          action: "splitMarkdownTextInFocusNote",
          menuTitle: "    基于 Markdown 拆卡",
        },
        "⬇️ 合并到父卡片",
        {
          action: "mergeInParentNote",
          menuTitle: "    合并到父卡片",
        },
        {
          action: "mergeInParentNoteWithPopup",
          menuTitle: "    合并到父卡片：弹窗选择类型",
        },
        {
          action: "mergIntoParenNoteAndRenewReplaceholder",
          menuTitle: "    合并到父卡片 & 替换占位符",
        },
        {
          action: "mergIntoParenNoteAndRenewReplaceholderWithPopup",
          menuTitle: "    合并到父卡片 & 替换占位符: 弹窗选择类型",
        },
        {
          action: "renewExcerptInParentNoteByFocusNote",
          menuTitle: "    父卡片的摘录替换为选中卡片的摘录",
        },
        "🔄 处理旧卡片",
        {
          action: "batchChangeClassificationTitles",
          menuTitle: "    批量更新归类卡片标题",
        },
        {
          action: "renewKnowledgeNoteIntoParentNote",
          menuTitle: "    更新知识点卡片到父卡片中",
        },
        "⬇️ 修改标题",
        {
          action: "removeTitlePrefix",
          menuTitle: "    去掉卡片前缀",
        },
        "ℹ️ 获取卡片信息",
        {
          action: "copyFocusNotesIdArr",
          menuTitle: "    复制卡片🆔",
        },
        {
          action: "copyFocusNotesURLArr",
          menuTitle: "    复制卡片 URL",
        },
      ],
    },
  });

  // menu_excerpt
  global.registerMenuTemplate("menu_excerpt", {
    action: "moveToExcerptPartBottom",
    onLongPress: {
      action: "menu",
      menuWidth: 300,
      menuItems: [
        {
          action: "mergeToParentAndMoveCommentToExcerpt",
          menuTitle: "合并到父卡片并移动评论到摘录",
        },
        {
          action: "mergeToParentAndMoveCommentToTop",
          menuTitle: "合并到父卡片并移动到最顶端",
        },
      ],
    },
  });

  // menu_card_pin
  global.registerMenuTemplate("menu_card_pin", {
    action: "menu",
    menuItems: [
      {
        action: "openPinnedNote-1",
        menuTitle: "Hᵖ(𝔻)",
      },
      {
        action: "openPinnedNote-2",
        menuTitle: "Lᵖ(𝕋)",
      },
      {
        action: "openPinnedNote-3",
        menuTitle: "Hᵖ(𝕋)",
      },
    ],
  });

  // menu_makeCards
  global.registerMenuTemplate("menu_makeCards", {
    action: "makeNote",
    doubleClick: {
      action: "doubleClickMakeNote",
    },
    onLongPress: {
      action: "menu",
      menuWidth: 320,
      menuItems: [
        "🪄 制卡",
        {
          action: "makeCardWithoutFocus",
          menuTitle: "    不定位制卡",
        },
        {
          action: "menu",
          menuTitle: "➡️ 文献制卡",
          menuItems: [
            {
              action: "referencePaperMakeCards",
              menuTitle: "📄 论文制卡",
            },
            {
              action: "referenceBookMakeCards",
              menuTitle: "📚 书作制卡",
            },
            {
              action: "referenceSeriesBookMakeCard",
              menuTitle: "📚 系列书作制卡",
            },
            {
              action: "referenceOneVolumeJournalMakeCards",
              menuTitle: "📄 整卷期刊制卡",
            },
            {
              action: "referenceAuthorNoteMake",
              menuTitle: "作者卡片制卡",
            },
          ],
        },
        "⚙️ 处理卡片",
        {
          action: "upwardMergeWithStyledComments",
          menuTitle: "    将子卡片作为证明要点合并",
        },
        "🪄 生成卡片",
        {
          action: "addNewIdeaNote",
          menuTitle: "    生成「思路」卡片",
        },
        {
          action: "addNewSummaryNote",
          menuTitle: "    生成「总结」卡片",
        },
        {
          action: "addNewCounterexampleNote",
          menuTitle: "    生成「反例」卡片",
        },
      ],
    },
  });

  // menu_htmlmdcomment
  global.registerMenuTemplate("menu_htmlmdcomment", {
    action: "addHtmlMarkdownComment",
    onLongPress: {
      action: "menu",
      menuWidth: 300,
      menuItems: [
        "🔢 带序号的评论",
        {
          action: "addCaseComment",
          menuTitle: "    📋 添加 Case 评论（自动编号）",
        },
        {
          action: "addStepComment",
          menuTitle: "    👣 添加 Step 评论（自动编号）",
        },
        {
          action: "changeHtmlMarkdownCommentTypeByPopup",
          menuTitle: "🔄 修改某条 HtmlMD 评论的类型",
        },
        {
          action: "renewContentsToHtmlMarkdownCommentType",
          menuTitle: "🔄 更新文本内容为 HtmlMD 评论",
        },
        "📊 批量调整层级",
        {
          action: "adjustHtmlMDLevelsUp",
          menuTitle: "    ⬆️ 所有层级上移一级",
        },
        {
          action: "adjustHtmlMDLevelsDown",
          menuTitle: "    ⬇️ 所有层级下移一级",
        },
        {
          action: "adjustHtmlMDLevelsByHighest",
          menuTitle: "    🎯 指定最高级别调整层级",
        },
      ],
    },
  });

  // menu_proof
  global.registerMenuTemplate("menu_proof", {
    action: "addProofCheckComment",
    onLongPress: {
      action: "menu",
      menuWidth: 320,
      menuItems: [
        {
          action: "upwardMergeWithStyledComments",
          menuTitle: "将子卡片作为证明要点合并",
        },
        "🔍 OCR",
        {
          action: "ocrAsProofTitle",
          menuTitle: "    OCR >> 设置为标题",
        },
        {
          action: "ocrAsProofTitleWithTranslation",
          menuTitle: "    OCR >> 翻译 >> 设置为标题",
        },
        {
          action: "ocrAllUntitledDescendants",
          menuTitle: "    【批量】OCR >> 设置为标题",
        },
        {
          action: "ocrAllUntitledDescendantsWithTranslation",
          menuTitle: "    【批量】OCR >> 翻译 >> 设置为标题",
        },
        "🌐 翻译",
        {
          action: "translateAllDescendants",
          menuTitle: "    【批量】翻译标题",
        },
        {
          action: "menu",
          menuTitle: "⚙️ 设置",
          menuWidth: 200,
          menuItems: [
            {
              action: "switchOCRSource",
              menuTitle: "切换 OCR 源",
            },
            {
              action: "switchTranslateModel",
              menuTitle: "切换翻译模型",
            },
          ],
        },
      ],
    },
  });

  global.registerMenuTemplate(
    "hideAddonBar",
    JSON.stringify({
      action: "hideAddonBar",
    }),
  );

  // 搜索功能菜单
  global.registerMenuTemplate("menu_search", {
    action: "searchNotes", // 单击：搜索笔记
    onLongPress: {
      // 长按：显示菜单
      action: "menu",
      menuWidth: 350,
      menuItems: [
        "🔍 搜索功能",
        {
          action: "showSearchBoard",
          menuTitle: "    📋 打开搜索看板",
        },
        {
          action: "searchDefinition",
          menuTitle: "    📚 搜索上层定义卡片的目录",
        },
        "⚙️ 基础配置",
        {
          action: "manageSearchRoots",
          menuTitle: "    📁 管理搜索根目录",
        },
        {
          action: "showSearchSettings",
          menuTitle: "    🎯 搜索设置",
        },
        "📝 同义词管理",
        {
          action: "manageSynonymGroups",
          menuTitle: "    （包含导入导出功能）",
        },
        "📊 配置同步",
        {
          action: "exportSearchConfig",
          menuTitle: "    📤 导出搜索配置",
        },
        {
          action: "importSearchConfig",
          menuTitle: "    📥 导入搜索配置",
        },
      ],
    },
  });

  // 代码学习菜单
  global.registerMenuTemplate("menu_codeLearning", {
    action: "menu",
    menuWidth: 350,
    menuItems: [
      {
        action: "codeMergeTemplate",
        menuTitle: "📚 代码卡片合并模板"
      },
      {
        action: "codeLearning",
        menuTitle: "📚 代码卡片标题制卡"
      },
      {
        action: "codeAnalysisWithAI", 
        menuTitle: "🤖 AI 代码分析（OCR）"
      },
      {
        action: "codeAnalysisFromComment",
        menuTitle: "📝 AI 代码分析（评论）"
      },
      "⚙️ 设置",
      {
        action: "switchCodeAnalysisModel",
        menuTitle: "    ⚙️ 切换 AI 分析模型"
      },
      {
        action: "switchOCRSource",
        menuTitle: "    ⚙️ 切换 OCR 源"
      }
    ]
  });

  if (typeof MNUtil !== "undefined" && MNUtil.log) {
    MNUtil.log(
      `🚀 已注册 ${Object.keys(global.customMenuTemplates).length} 个自定义菜单模板`,
    );
  }
}

// 扩展 toolbarConfig.template 方法
if (typeof toolbarConfig !== "undefined") {
  // 保存原始的 template 方法
  const originalTemplate = toolbarConfig.template;

  // 重写 template 方法
  toolbarConfig.template = function (action) {
    // 先检查自定义菜单模板
    const customTemplate = global.getMenuTemplate(action);
    if (customTemplate) {
      // 如果是字符串，直接返回
      if (typeof customTemplate === "string") {
        return customTemplate;
      }
      // 如果是对象，转换为JSON字符串
      return JSON.stringify(customTemplate, null, 2);
    }

    // 如果不是自定义模板，调用原始方法
    if (originalTemplate && typeof originalTemplate === "function") {
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
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    registerMenuTemplate: global.registerMenuTemplate,
    getMenuTemplate: global.getMenuTemplate,
  };
}
