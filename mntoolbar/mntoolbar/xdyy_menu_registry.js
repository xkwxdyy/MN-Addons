/**
 * 夏大鱼羊自定义菜单注册表
 * 用于解耦菜单模板定义，避免修改 utils.js
 * 严格按照原始 template 函数的内容
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
 * 严格按照原始 template(action) 函数中的 case 语句内容
 */
function registerAllMenuTemplates() {
  // menu_comment
  global.registerMenuTemplate("menu_comment", {
    action: "manageCommentsByPopup",
    // doubleClick: "moveOldContentsByPopupTo",  // TODO: 把上面的内容移动下来，类似于移动上去
    onLongPress: {
      action: "menu",
      menuWidth: 300,
      menuItems: [
        {
          action: "replaceFieldContentByPopup",
          menuTitle: "替换字段",
        },
        {
          action: "removeBidirectionalLinks",
          menuTitle: "删除字段中的双向链接",
        },
        {
          action: "updateBidirectionalLink",
          menuTitle: "更新链接",
        },
      ]
    }
  });
  
  // menu_think
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
        // {
        //   action: "addThoughtPoint",  
        //   menuTitle: "➕思考点"
        // },
        // {
        //   action: "addThoughtPointAndMoveLastCommentToThought",
        //   menuTitle: "➕思考点 & 最后1️⃣💬⬆️思考",
        // },
        // {
        //   action: "addThoughtPointAndMoveNewCommentsToThought",
        //   menuTitle: "➕思考点 & 新💬⬆️思考",
        // },
        // {
        //   action: "moveLastCommentToThought",
        //   menuTitle: "最后1️⃣💬⬆️思考"
        // },
        // {
        //   action: "moveLastTwoCommentsToThought",
        //   menuTitle: "最后2️⃣💬⬆️思考"
        // }
      ]
    }
  });

  // menu_study
  global.registerMenuTemplate("menu_study", {
    action: "menu",
    menuWidth: 330,
    menuItems: [
      // "⬇️ 更新证明",
      // {
      //   action: "renewProofContentPoints",
      //   menuTitle: '    🔄更新证明"-": 弹窗选择 ',
      // },
      // {
      //   action: "renewProofContentPointsToSubpointType",
      //   menuTitle: '    🔄更新证明"- "为"subpoint ▪"',
      // },
      {
        action: "autoMoveLinksBetweenCards",
        menuTitle: "自动移动卡片之间的链接"
      },
      {
        action: "menu",
        menuTitle: "➡️ 注释",
        menuWidth: 260,
        menuItems: [
          {
            action: "getAbbreviationsOfNote",
            menuTitle: "获取选中卡片的名词缩写",
          },
          {
            action: "comment_copy_URL_version",
            menuTitle: "注释：复制含 URL 类型",
          },
          {
            action: "addCommentOnFocusCard",
            menuTitle: "Anki_复习🏷️"
          },
          {
            action: "renewChildNotes2LinksForKnowledge",
            menuTitle: "更新概念卡片的子孙卡片为「证明卡片」",
          },
          {
            action: "renewLinkNotes",
            menuTitle: "更新「链接卡片」",
          },
          {
            action: "toBeIndependent",
            menuTitle: "⇨ 独立",
          },
          // {
          //   action: "OCR_selection_text",
          //   menuTitle: "OCR & 合并多张选中的图片",
          // },
          {
            action: "text2Speech",
            menuTitle: "朗读卡片(按住停止)"
          },
          {
            action: "getCreationTime",
            menuTitle: "创建时间",
          },
          {
            action: "getModifiedTime",
            menuTitle: "修改时间",
          },
          {
            action: "getCitationCout",
            menuTitle: "引用数",
          },
          {
            action: "copyIdToClipboard",
            menuTitle: "noteId ⇨ 剪贴板",
          }
        ]
      }
    ]
  });

  // menu_reference
  global.registerMenuTemplate("menu_reference", {
    action: "menu",
    menuItems: [
      // {
      //   action: "renewBookSeriesNotes",
      //   menuTitle: "书作系列卡片更新",
      // },
      // {
      //   action: "renewBookNotes",
      //   menuTitle: "书作卡片更新",
      // },
      {
        action: "menu",
        menuTitle: "➡️ 🧠文献学习",
        menuWidth: 500,
        menuItems: [
          "⬇️ ➕引用",
          // {
          //   action: "referenceRefByRefNum",
          //   menuTitle: "选中「具体引用」卡片+输入文献号→ ➕引用"
          // },
          {
            action: "referenceRefByRefNumAndFocusInMindMap",
            menuTitle: "选中「具体引用」卡片+输入文献号→ ➕引用 + 剪切归类 + 主视图定位"
          },
          {
            action: "referenceRefByRefNumAddFocusInFloatMindMap",
            menuTitle: "选中「具体引用」卡片+输入文献号→ ➕引用 + 剪切归类 + 浮窗定位"
          },
          "⬇️ ➕「具体引用情况」汇总卡片",
          {
            action: "referenceCreateClassificationNoteByIdAndFocusNote",
            menuTitle: "选中「参考文献摘录」卡片+输入文献号→ 「具体引用情况」汇总卡片 + 浮窗定位",
          },
          // {
          //   action: "referenceCreateClassificationNoteById",
          //   menuTitle: "输入文献号→ ➕引用归类卡片 + 浮窗定位",
          // }
        ]
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
                menuTitle: "绑定「选中的卡片」➡️ 文献号"
              },
              // {
              //   action: "referenceStoreOneIdForCurrentDoc",
              //   menuTitle: "当前文档：手动录入 1 条参考文献卡片🆔"
              // },
              // {
              //   action: "referenceStoreIdsForCurrentDoc",
              //   menuTitle: "「手动录入」参考文献卡片🆔"
              // },
              // {
              //   action: "referenceStoreIdsForCurrentDocFromClipboard",
              //   menuTitle: "从剪切板录入当前文档的参考文献卡片🆔"
              // },
              // {
              //   action: "referenceClearIdsForCurrentDoc",
              //   menuTitle: "清空「当前文档」卡片🆔",
              // },
              {
                action: "referenceTestIfIdInCurrentDoc",
                menuTitle: "检测文献号的🆔绑定",
              },
            ]
          },
          {
            action: "menu",
            menuTitle: "➡️ 导出 🆔",
            menuWidth: 250,
            menuItems: [
              {
                action: "referenceExportReferenceIdsToClipboard",
                menuTitle: "导出参考文献卡片🆔到剪切板"
              },
              {
                action: "referenceExportReferenceIdsToFile",
                menuTitle: "导出参考文献卡片🆔到文件"
              },
            ]
          },
          {
            action: "menu",
            menuTitle: "⬅️ 导入 🆔",
            menuWidth: 250,
            menuItems: [
              {
                action: "referenceInputReferenceIdsFromClipboard",
                menuTitle: "从剪切板导入参考文献卡片🆔"
              },
              {
                action: "referenceInputReferenceIdsFromFile",
                menuTitle: "从文件导入参考文献卡片🆔"
              },
            ]
          }
        ]
      },
      {
        action: "menu",
        menuTitle: "➡️ 🗂️文献卡片",
        menuItems: [
          {
            action: "referenceInfoAuthor",
            menuTitle: "👨‍🎓 作者"
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
                menuTitle: "输入文献号录入引用样式"
              },
              {
                action: "referenceInfoRefFromFocusNote",
                menuTitle: "选中摘录自动录入引用样式"
              },
              {
                action: "referenceInfoInputRef",
                menuTitle: "手动输入引用样式"
              }
            ]
          },
          {
            action: "menu",
            menuTitle: "➡️ .bib 信息",
            menuItems: [
              {
                action: "referenceBibInfoPasteFromClipboard",
                menuTitle: "从剪切板粘贴 .bib 信息"
              },
              {
                action: "referenceBibInfoCopy",
                menuTitle: "复制 .bib 信息"
              },
              {
                action: "referenceBibInfoExport",
                menuTitle: "导出 .bib 信息",
              }
            ]
          }
        ]
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
            menuTitle: "粘贴个人信息"
          },
          {
            action: "referenceAuthorNoteMake",
            menuTitle: "作者卡片制卡"
          }
        ]
      },
      {
        action: "menu",
        menuTitle: "➡️ 📄期刊卡片",
        menuItems: [
          // {
          //   menuTitle: "🔽 "
          // },
          // {
          //   action: "",
          //   menuTitle: "➕出版社"
          // },
          // {
          //   action: "",
          //   menuTitle: "修改整卷期刊前缀"
          // }
        ]
      },
      {
        action: "menu",
        menuTitle: "➡️ 📌关键词卡片",
        menuItems: [
          {
            action: "referenceKeywordsAddRelatedKeywords",
            menuTitle: "➕相关关键词"
          },
          {
            action: "referenceGetRelatedReferencesByKeywords",
            menuTitle: "根据关键词筛选文献"
          }
        ]
      },
    ]
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
            menuTitle: "标题规范"
          },
          {
            action: "selectionTextToLowerCase",
            menuTitle: "转小写"
          },
          {
            action: "selectionTextHandleSpaces",
            menuTitle: "处理空格"
          }
        ]
      },
      {
        action: "menu",
        menuTitle: "→ 复制的文本",
        menuItems: [
          {
            action: "copiedTextToTitleCase",
            menuTitle: "标题规范"
          },
          {
            action: "copiedTextToLowerCase",
            menuTitle: "转小写"
          },
          {
            action: "copiedTextHandleSpaces",
            menuTitle: "处理空格"
          }
        ]
      },
    ]
  });

  // menu_handtool_text
  global.registerMenuTemplate("menu_handtool_text", {
    action: "selectionTextToTitleCase",
    onLongPress: {
      action: "menu",
      menuItems: [
        {
          action: "selectionTextToTitleCase",
          menuTitle: "标题规范"
        },
        {
          action: "selectionTextToLowerCase",
          menuTitle: "转小写"
        },
        {
          action: "selectionTextHandleSpaces",
          menuTitle: "处理空格"
        }
      ]
    }
  });

  // menu_card
  global.registerMenuTemplate("menu_card", {
    action: "copyMarkdownVersionFocusNoteURL",
    onLongPress: {
      action: "menu",
      menuWidth: 250,
      menuItems: [
        // {
        //   action: "copyMarkdownVersionFocusNoteURL",
        //   menuTitle: "复制 Markdown 类型的卡片 URL",
        // },
        {
          action: "toBeIndependent",
          menuTitle: "⇨ 独立",
        },
        {
          action: "copyFocusNotesIdArr",
          menuTitle: "复制卡片🆔",
        },
        {
          action: "copyFocusNotesURLArr",
          menuTitle: "复制卡片 URL",
        },
        // {
        //   action: "pasteAsChildNotesByIdArrFromClipboard",
        //   menuTitle: "复制卡片🆔后，剪切到选中卡片",
        // },
        {
          action: "getNewClassificationInformation",
          menuTitle: "更新卡片归类情况到选中的卡片中",
        },
        {
          action: "menu",
          menuTitle: "➡️ 处理旧卡片",
          menuWidth: 250,
          menuItems: [
            {
              action: "renewCards",
              menuTitle: "🔄 更新旧卡片"
            },
            {
              action: "reappendAllLinksInNote",
              menuTitle: "🔄 卡片的所有链接重新链接",
            },
            // {
            //   action: "linksConvertToMN4Type",
            //   menuTitle: "mn3 链接 → mn4 链接",
            // },
            {
              action: "clearAllFailedLinks",
              menuTitle: "清空失效链接",
            }
          ]
        },
        {
          action: "menu",
          menuTitle: "➡️ 清空评论",
          menuWidth: 260,
          menuItems: [
            {
              action: "clearContentKeepExcerptWithTitle",
              menuTitle: "✅ 摘录 ✅ 标题",
            },
            {
              action: "clearContentKeepExcerpt",
              menuTitle: "✅ 摘录 ❌ 标题",
            },
            {
              action: "clearContentKeepExcerptAndImage",
              menuTitle: "✅ 摘录 ✅ 图片 ❌ 标题",
            },
            {
              action: "clearContentKeepText",
              menuTitle: "❌ 摘录 ✅ 文字 ❌ 标题",
            }
          ]
        },
        {
          action: "menu",
          menuTitle: "➡️ 剪切、合并",
          menuWidth: 260,
          menuItems: [
            {
              action: "cutNote",
              menuTitle: "剪切选中的卡片",
            },
            {
              action: "cutoutSelctionCards",
              menuTitle: "剪切选中的卡片以及子卡片",
            },
            {
              action: "mergeIntoOneNoteByPopup",
              menuTitle: "合并到第一张卡片：弹窗选择类型",
            },
          ]
        },
        {
          action: "openAsFloatWindow",
          menuTitle: "作为浮窗打开",
        },
        {
          action: "copyAsReference",
          menuTitle: "复制含标题的 URL",
        }
      ]
    }
  });

  // menu_card_workflow
  global.registerMenuTemplate("menu_card_workflow", {
    action: "menu",
    menuWidth: 300,
    menuItems: [
      "⬇️ 临时",
      {
        action: "moveToInbox",
        menuTitle: "    加入 Inbox",
      },
      {
        action: "",
        menuTitle: "     剪切 + 「浮窗」定位今日 Inbox",
      },
      // {
      //   action: "openTasksFloatMindMap" ,
      //   menuTitle: "打开任务管理脑图",
      // },
      // {
      //   action: "updateTimeTag",
      //   menuTitle: "更新卡片时间标签并添加「今日」",
      // },
      {
        action: "openFloatWindowByInboxNote",
        menuTitle: "    「浮窗」定位今日 Inbox",
      },
      {
        action: "openFloatWindowByInboxNoteOnDate",
        menuTitle: "    「浮窗」定位指定日期 Inbox",
      },
      // {
      //   action: "getOKRNotesOnToday",
      //   menuTitle: "获取今日 OKR 任务",
      // },
      "⬇️ 前缀状态机",
      {
        action: "OKRNoteMake",
        menuTitle: "    OKR 制卡流",
      },
      // {
      //   action: "undoOKRNoteMake",
      //   menuTitle: "撤销 OKR 任务卡片制卡流",
      // },
      {
        action: "achieveCards",
        menuTitle: "    归档卡片",
      },
      {
        action: "renewCards",
        menuTitle: "    更新卡片",
      }
    ]
  });

  // menu_excerpt
  global.registerMenuTemplate("menu_excerpt", {
    action: "moveToExcerptPartBottom",
  });

  // menu_MN
  global.registerMenuTemplate("menu_MN", {
    action: "menu",
    menuItems: [
      {
        action: "showDocumentController",
        menuTitle: "📖文档列表"
      },
      {
        action: "showStudyController",
        menuTitle: "📚笔记本列表"
      },
      {
        action: "showCardListController",
        menuTitle: "🗂️卡片列表"
      },
      {
        action: "showMindmapController",
        menuTitle: "🎯脑图"
      },
      {
        action: "showOutlineController",
        menuTitle: "🌲大纲"
      },
      {
        action: "showDocumentController",
        menuTitle: "📄文档"
      },
      {
        action: "showReviewController",
        menuTitle: "♻️复习"
      },
      {
        action: "showSearchController",
        menuTitle: "🔍搜索"
      }
    ]
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
    ]
  });

  // menu_makeCards
  global.registerMenuTemplate("menu_makeCards", {
    action: "makeNote",
    doubleClick: {
      action: "doubleClickMakeNote"
    },
    onLongPress: {
      action: "menu",
      menuWidth: 320,
      menuItems: [
        "🪄 制卡",
        {
          action: "makeCardWithoutFocus",
          menuTitle: "    不定位制卡"
        },
        "⚙️ 处理卡片",
        {
          action: "upwardMergeWithStyledComments",
          menuTitle: "    将子卡片作为证明要点合并",
        },
        "🪄 生成卡片",
        {
          action: "addNewIdeaNote",
          menuTitle: "    生成「思路」卡片"
        },
        {
          action: "addNewSummaryNote",
          menuTitle: "    生成「总结」卡片"
        },
        "🔄 处理旧卡片",
        {
          action: "retainFieldContentOnly",
          menuTitle: "    保留某个字段内容",
        },
        {
          action: "batchChangeClassificationTitles",
          menuTitle: "    批量更新归类卡片标题"
        },
        {
          action: "renewKnowledgeNoteIntoParentNote",
          menuTitle: "    更新知识点卡片到父卡片中"
        }
      ]
    }
  });

  // TemplateMakeNotes
  global.registerMenuTemplate("TemplateMakeNotes", {
    action: "menu",
    menuWidth: 320,
    menuItems: [
      "⬇️ 合并",
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
      "⬇️ 制卡",
      {
        action: "multiTemplateMakeNotes",
        menuTitle: "    批量制卡",
      },
      {
        action: "TemplateMakeChildNotes",
        menuTitle: "    批量进行子卡片制卡"
      },
      {
        action: "TemplateMakeDescendantNotes",
        menuTitle: "    批量进行子孙卡片制卡"
      },
      {
        action: "menu",
        menuTitle: "️️    ➡️ 文献制卡",
        menuItems: [
          // {
          //   menuTitle: "🔽 "
          // },
          {
            action: "referencePaperMakeCards",
            menuTitle: "📄 论文制卡"
          },
          {
            action: "referenceBookMakeCards",
            menuTitle: "📚 书作制卡"
          },
          {
            action: "referenceSeriesBookMakeCard",
            menuTitle: "📚 系列书作制卡"
          },
          {
            action: "referenceOneVolumeJournalMakeCards",
            menuTitle: "📄 整卷期刊制卡"
          },
          {
            action: "referenceAuthorNoteMake",
            menuTitle: "作者卡片制卡"
          },
        ]
      },
      // {
      //   action: "undoOKRNoteMake",
      //   menuTitle: "回退任务卡片状态"
      // },
      "⬇️ 修改标题",
      {
        action: "removeTitlePrefix",
        menuTitle: "    去掉卡片前缀"
      },
      {
        action: "changeTitlePrefix",
        menuTitle: "    强制修改卡片前缀"
      },
      {
        action: "changeChildNotesTitles",
        menuTitle: "    批量修改子卡片标题"
      },
      {
        action: "changeDescendantNotesTitles",
        menuTitle: "    批量修改子孙卡片标题"
      },
      "⬇️ 清空评论",
      {
        action: "clearContentKeepExcerptWithTitle",
        menuTitle: "    清空评论 + ✅ 摘录 ✅ 标题",
      },
      {
        action: "clearContentKeepExcerpt",
        menuTitle: "    清空评论 + ✅ 摘录 ❌ 标题",
      },
      "⬇️ 杂项",
      {
        action: "renewExcerptInParentNoteByFocusNote",
        menuTitle: "    父卡片的摘录替换为选中卡片的摘录",
      },
      {
        action: "convertNoteToNonexcerptVersion",
        menuTitle: "    转化为非摘录版本",
      },
      {
        action: "linkRemoveDuplicatesAfterApplication",
        menuTitle: "    \"应用\"下方的链接去重"
      },
      {
        action: "splitMarkdownTextInFocusNote",
        menuTitle: "    基于 Markdown 拆卡",
      }
    ]
    // }
  });

  // menu_htmlmdcomment
  global.registerMenuTemplate("menu_htmlmdcomment", {
    action: "addHtmlMarkdownComment",
    onLongPress: {
      action: "menu",
      menuWidth: 300,
      menuItems: [
        {
          action: "changeHtmlMarkdownCommentTypeByPopup",
          menuTitle: "🔄 修改某条 HtmlMD 评论的类型",
        },
        {
          action: "renewContentsToHtmlMarkdownCommentType",
          menuTitle: '🔄 更新文本内容为 HtmlMD 评论',
        },
        {
          action: "htmlMDCommentsToNextLevelType",
          menuTitle: "⬇️ HtmlMD 评论降级",
        },
        {
          action: "htmlMDCommentsToLastLevelType",
          menuTitle: "⬆️ HtmlMD 评论升级",
        },
      ]
    }
  });

  global.registerMenuTemplate("hideAddonBar", JSON.stringify({
    action: "hideAddonBar"
  }));
  
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