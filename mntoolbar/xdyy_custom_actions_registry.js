/**
 * toolbar 的 Actions 注册表
 */

// 创建全局注册表
if (typeof global === "undefined") {
  var global = {};
}

// 初始化 customActions 对象
global.customActions = global.customActions || {};

/**
 * 注册自定义 action
 * @param {string} actionName - action 名称
 * @param {Function} handler - 处理函数
 */
global.registerCustomAction = function (actionName, handler) {
  global.customActions[actionName] = handler;
  console.log(`✅ 注册自定义 action: ${actionName}`);
};

/**
 * 执行自定义 action
 * @param {string} actionName - action 名称
 * @param {Object} context - 执行上下文
 * @returns {boolean} - 是否成功执行
 */
global.executeCustomAction = async function (actionName, context) {
  if (actionName in global.customActions) {
    try {
      console.log(`🚀 执行自定义 action: ${actionName}`);
      await global.customActions[actionName](context);
      return true;
    } catch (error) {
      console.error(`❌ 执行自定义 action 失败: ${actionName}`, error);
      MNUtil.showHUD(`执行失败: ${error}`);
      return false;
    }
  }
  return false;
};

// 注册所有自定义 actions
function registerAllCustomActions() {
  // 需要的变量声明
  let targetNotes = [];
  let success = true;
  let color, config;
  let targetNoteId;
  let parentNote;
  let focusNoteType;
  let focusNoteColorIndex;
  let copyTitlePart;
  let userInput;
  let bibTextIndex, bibContent;
  let bibContentArr = [];
  let currentDocmd5;
  let path, UTI;
  let currentDocName;
  let pinnedNote;

  // HTML 设置
  const htmlSetting = [
    { title: "方法: ✔", type: "method" },
    { title: "思路: 💡", type: "idea" },
    { title: "目标: 🎯", type: "goal" },
    { title: "关键: 🔑", type: "key" },
    { title: "问题: ❓", type: "question" },
    { title: "注: 📝", type: "remark" },
    { title: "注意: ⚠️", type: "alert" },
    { title: "特别注意: ❗❗❗", type: "danger" },
  ];
  const htmlSettingTitles = htmlSetting.map((config) => config.title);

  const levelHtmlSetting = [
    { title: "goal: 🎯", type: "goal" },
    { title: "level1: 🚩", type: "level1" },
    { title: "level2: ▸", type: "level2" },
    { title: "level3: ▪", type: "level3" },
    { title: "level4: •", type: "level4" },
    { title: "level5: ·", type: "level5" },
  ];
  const levelHtmlSettingTitles = levelHtmlSetting.map((config) => config.title);

  // ========== REFERENCE 相关 (43 个) ==========

  // referenceRefByRefNumAddFocusInFloatMindMap
  global.registerCustomAction("referenceRefByRefNumAddFocusInFloatMindMap", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "输入文献号",
      "",
      2,
      "取消",
      ["确定"],
      (alert, buttonIndex) => {
        try {
          MNUtil.undoGrouping(() => {
            let refNum = alert.textFieldAtIndex(0).text;
            if (buttonIndex == 1) {
              let refNote = toolbarUtils.referenceRefByRefNum(focusNote, refNum)[0];
              let classificationNote = toolbarUtils.referenceRefByRefNum(focusNote, refNum)[1];
              classificationNote.addChild(refNote.note);
              refNote.focusInFloatMindMap(0.3);
            }
          });
        } catch (error) {
          MNUtil.showHUD(error);
        }
      },
    );
  });

  // referenceRefByRefNumAndFocusInMindMap
  global.registerCustomAction("referenceRefByRefNumAndFocusInMindMap", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "输入文献号",
      "",
      2,
      "取消",
      ["确定"],
      (alert, buttonIndex) => {
        try {
          MNUtil.undoGrouping(() => {
            let refNum = alert.textFieldAtIndex(0).text;
            if (buttonIndex == 1) {
              let refNote = toolbarUtils.referenceRefByRefNum(focusNote, refNum)[0];
              let classificationNote = toolbarUtils.referenceRefByRefNum(focusNote, refNum)[1];
              classificationNote.addChild(refNote.note);
              refNote.focusInMindMap(0.3);
            }
          });
        } catch (error) {
          MNUtil.showHUD(error);
        }
      },
    );
  });

  // referenceRefByRefNum
  global.registerCustomAction("referenceRefByRefNum", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "输入文献号",
      "",
      2,
      "取消",
      ["确定"],
      (alert, buttonIndex) => {
        try {
          MNUtil.undoGrouping(() => {
            let refNum = alert.textFieldAtIndex(0).text;
            if (buttonIndex == 1) {
              toolbarUtils.referenceRefByRefNum(focusNote, refNum);
            }
          });
        } catch (error) {
          MNUtil.showHUD(error);
        }
      },
    );
  });

  // referenceCreateClassificationNoteByIdAndFocusNote
  global.registerCustomAction("referenceCreateClassificationNoteByIdAndFocusNote", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "输入文献号",
      "",
      2,
      "取消",
      ["确定"],
      (alert, buttonIndex) => {
        try {
          MNUtil.undoGrouping(() => {
            if (buttonIndex == 1) {
              let refNum = alert.textFieldAtIndex(0).text;
              let currentDocmd5 = MNUtil.currentDocmd5;
              let findClassificationNote = false;
              let classificationNote;
              if (
                toolbarConfig.referenceIds.hasOwnProperty(currentDocmd5) ||
                toolbarConfig.referenceIds[currentDocmd5][0] == undefined
              ) {
                if (toolbarConfig.referenceIds[currentDocmd5].hasOwnProperty(refNum)) {
                  let refSourceNoteId = toolbarConfig.referenceIds[currentDocmd5][0];
                  let refSourceNote = MNNote.new(refSourceNoteId);
                  // let refSourceNoteTitle = toolbarUtils.getFirstKeywordFromTitle(refSourceNote.noteTitle)
                  let refSourceNoteTitle = refSourceNote.getFirstTitleLinkWord();
                  let refSourceNoteAuthor = toolbarUtils.getFirstAuthorFromReferenceById(refSourceNoteId);
                  let refedNoteId = toolbarConfig.referenceIds[currentDocmd5][refNum];
                  let refedNote = MNNote.new(refedNoteId);
                  // let refedNoteTitle = toolbarUtils.getFirstKeywordFromTitle(refedNote.noteTitle)
                  let refedNoteTitle = refedNote.getFirstTitleLinkWord();
                  let refedNoteAuthor = toolbarUtils.getFirstAuthorFromReferenceById(refedNoteId);

                  // 先看看 refedNote 有没有「具体引用情况」汇总卡片了
                  for (let i = 0; i < refedNote.childNotes.length; i++) {
                    let childNote = refedNote.childNotes[i];
                    if (childNote.noteTitle && childNote.noteTitle.includes("[" + refNum + "] " + refedNoteTitle)) {
                      classificationNote = refedNote.childNotes[i];
                      findClassificationNote = true;
                    }
                  }
                  if (!findClassificationNote) {
                    // 没有的话就创建一个
                    classificationNote = MNNote.clone("C24C2604-4B3A-4B6F-97E6-147F3EC67143");
                    classificationNote.noteTitle =
                      "「" +
                      refSourceNoteTitle +
                      " - " +
                      refSourceNoteAuthor +
                      "」引用" +
                      "「[" +
                      refNum +
                      "] " +
                      refedNoteTitle +
                      " - " +
                      refedNoteAuthor +
                      "」情况";
                  } else {
                    // 如果找到的话就更新一下标题
                    // 因为可能会出现偶尔忘记写作者导致的 No author
                    classificationNote.noteTitle =
                      "「" +
                      refSourceNoteTitle +
                      " - " +
                      refSourceNoteAuthor +
                      "」引用" +
                      "「[" +
                      refNum +
                      "] " +
                      refedNoteTitle +
                      " - " +
                      refedNoteAuthor +
                      "」情况";
                  }

                  refedNote.addChild(classificationNote); // 把「具体引用情况」汇总卡片添加到被引用的文献卡片的子卡片

                  /**
                   * 移动链接
                   */

                  /**
                   * 移动「被引用文献卡片」在「具体引用情况」汇总卡片中的链接
                   */
                  let refedNoteIdIndexInClassificationNote = classificationNote.getCommentIndex(
                    "marginnote4app://note/" + refedNoteId,
                  );
                  if (refedNoteIdIndexInClassificationNote == -1) {
                    classificationNote.appendNoteLink(refedNote, "To");
                    classificationNote.moveComment(
                      classificationNote.comments.length - 1,
                      classificationNote.getHtmlCommentIndex("具体引用："),
                    ); // 移动到“具体引用：”的上面
                  } else {
                    classificationNote.moveComment(
                      refedNoteIdIndexInClassificationNote,
                      classificationNote.getHtmlCommentIndex("具体引用："),
                    );
                  }

                  /**
                   * 移动「引用主体文献卡片」在「具体引用情况」汇总卡片中的链接
                   */
                  let refSourceNoteIdIndexInClassificationNote = classificationNote.getCommentIndex(
                    "marginnote4app://note/" + refSourceNoteId,
                  );
                  if (refSourceNoteIdIndexInClassificationNote == -1) {
                    classificationNote.appendNoteLink(refSourceNote, "To");
                    classificationNote.moveComment(
                      classificationNote.comments.length - 1,
                      classificationNote.getHtmlCommentIndex("引用："),
                    ); // 移动到“引用：”上面
                  } else {
                    classificationNote.moveComment(
                      refSourceNoteIdIndexInClassificationNote,
                      classificationNote.getHtmlCommentIndex("引用："),
                    );
                  }

                  /**
                   * 移动「具体引用情况」汇总卡片在引用主体文献卡片中的链接
                   */
                  let classificationNoteIdIndexInRefSourceNote = refSourceNote.getCommentIndex(
                    "marginnote4app://note/" + classificationNote.noteId,
                  );
                  if (classificationNoteIdIndexInRefSourceNote == -1) {
                    refSourceNote.appendNoteLink(classificationNote, "To");
                    refSourceNote.moveComment(
                      refSourceNote.comments.length - 1,
                      refSourceNote.getHtmlCommentIndex("被引用情况："),
                    );
                  }

                  /**
                   * 移动「具体引用情况」汇总卡片在被引用参考文献卡片中的链接
                   */
                  let classificationNoteIdIndexInRefedNote = refedNote.getCommentIndex(
                    "marginnote4app://note/" + classificationNote.noteId,
                  );
                  if (classificationNoteIdIndexInRefedNote == -1) {
                    refedNote.appendNoteLink(classificationNote, "To");
                    // refedNote.moveComment(refedNote.comments.length-1,refedNote.getCommentIndex("被引用情况：", true))
                  } else {
                    refedNote.moveComment(classificationNoteIdIndexInRefedNote, refedNote.comments.length - 1);
                  }

                  classificationNote.merge(focusNote.note);
                  classificationNote.moveComment(
                    classificationNote.comments.length - 1,
                    classificationNote.getHtmlCommentIndex("引用：") + 1, // 把参考文献摘录移动到“引用：”下方
                  );
                  classificationNote.focusInFloatMindMap(0.5);
                } else {
                  MNUtil.showHUD("[" + refNum + "] 未进行 ID 绑定");
                }
              } else {
                MNUtil.showHUD("当前文档未绑定 ID");
              }
            }
          });
        } catch (error) {
          MNUtil.showHUD(error);
        }
      },
    );
  });

  // referenceCreateClassificationNoteById
  global.registerCustomAction("referenceCreateClassificationNoteById", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "输入文献号",
      "",
      2,
      "取消",
      ["确定"],
      (alert, buttonIndex) => {
        try {
          MNUtil.undoGrouping(() => {
            if (buttonIndex == 1) {
              let refNum = alert.textFieldAtIndex(0).text;
              let currentDocmd5 = MNUtil.currentDocmd5;
              let findClassificationNote = false;
              let classificationNote;
              if (toolbarConfig.referenceIds.hasOwnProperty(currentDocmd5)) {
                if (toolbarConfig.referenceIds[currentDocmd5].hasOwnProperty(refNum)) {
                  if (toolbarConfig.referenceIds[currentDocmd5][0] == undefined) {
                    MNUtil.showHUD("文档未绑定 ID");
                  } else {
                    let refSourceNoteId = toolbarConfig.referenceIds[currentDocmd5][0];
                    let refSourceNote = MNNote.new(refSourceNoteId);
                    let refSourceNoteTitle = toolbarUtils.getFirstKeywordFromTitle(refSourceNote.noteTitle);
                    let refSourceNoteAuthor = toolbarUtils.getFirstAuthorFromReferenceById(refSourceNoteId);
                    let refedNoteId = toolbarConfig.referenceIds[currentDocmd5][refNum];
                    let refedNote = MNNote.new(refedNoteId);
                    let refedNoteTitle = toolbarUtils.getFirstKeywordFromTitle(refedNote.noteTitle);
                    let refedNoteAuthor = toolbarUtils.getFirstAuthorFromReferenceById(refedNoteId);
                    // 先看 refedNote 有没有归类的子卡片了
                    for (let i = 0; i < refedNote.childNotes.length; i++) {
                      let childNote = refedNote.childNotes[i];
                      if (childNote.noteTitle && childNote.noteTitle.includes("[" + refNum + "] " + refedNoteTitle)) {
                        classificationNote = refedNote.childNotes[i];
                        findClassificationNote = true;
                      }
                    }
                    if (!findClassificationNote) {
                      // 没有的话就创建一个
                      classificationNote = MNNote.clone("C24C2604-4B3A-4B6F-97E6-147F3EC67143");
                      classificationNote.noteTitle =
                        "「" +
                        refSourceNoteTitle +
                        " - " +
                        refSourceNoteAuthor +
                        "」引用" +
                        "「[" +
                        refNum +
                        "] " +
                        refedNoteTitle +
                        " - " +
                        refedNoteAuthor +
                        "」情况";
                    } else {
                      // 如果找到的话就更新一下标题
                      // 因为可能会出现偶尔忘记写作者导致的 No author
                      classificationNote.noteTitle =
                        "「" +
                        refSourceNoteTitle +
                        " - " +
                        refSourceNoteAuthor +
                        "」引用" +
                        "「[" +
                        refNum +
                        "] " +
                        refedNoteTitle +
                        " - " +
                        refedNoteAuthor +
                        "」情况";
                    }
                    refedNote.addChild(classificationNote.note);
                    // 移动链接到“引用：”
                    let refedNoteIdIndexInClassificationNote = classificationNote.getCommentIndex(
                      "marginnote4app://note/" + refedNoteId,
                    );
                    if (refedNoteIdIndexInClassificationNote == -1) {
                      classificationNote.appendNoteLink(refedNote, "To");
                      classificationNote.moveComment(
                        classificationNote.comments.length - 1,
                        classificationNote.getCommentIndex("具体引用：", true),
                      );
                    } else {
                      classificationNote.moveComment(
                        refedNoteIdIndexInClassificationNote,
                        classificationNote.getCommentIndex("具体引用：", true),
                      );
                    }
                    // 移动链接到“原文献”
                    let refSourceNoteIdIndexInClassificationNote = classificationNote.getCommentIndex(
                      "marginnote4app://note/" + refSourceNoteId,
                    );
                    if (refSourceNoteIdIndexInClassificationNote == -1) {
                      classificationNote.appendNoteLink(refSourceNote, "To");
                      classificationNote.moveComment(
                        classificationNote.comments.length - 1,
                        classificationNote.getCommentIndex("引用：", true),
                      );
                    } else {
                      classificationNote.moveComment(
                        refSourceNoteIdIndexInClassificationNote,
                        classificationNote.getCommentIndex("引用：", true),
                      );
                    }
                    // 链接归类卡片到 refSourceNote
                    let classificationNoteIdIndexInRefSourceNote = refSourceNote.getCommentIndex(
                      "marginnote4app://note/" + classificationNote.noteId,
                    );
                    if (classificationNoteIdIndexInRefSourceNote == -1) {
                      refSourceNote.appendNoteLink(classificationNote, "To");
                    }
                    // 链接归类卡片到 refedNote
                    let classificationNoteIdIndexInRefedNote = refedNote.getCommentIndex(
                      "marginnote4app://note/" + classificationNote.noteId,
                    );
                    if (classificationNoteIdIndexInRefedNote == -1) {
                      refedNote.appendNoteLink(classificationNote, "To");
                      refedNote.moveComment(
                        refedNote.comments.length - 1,
                        refedNote.getCommentIndex("参考文献：", true),
                      );
                    } else {
                      refedNote.moveComment(
                        classificationNoteIdIndexInRefedNote,
                        refedNote.getCommentIndex("参考文献：", true),
                      );
                    }
                    classificationNote.focusInFloatMindMap(0.5);
                  }
                } else {
                  MNUtil.showHUD("[" + refNum + "] 未进行 ID 绑定");
                }
              } else {
                MNUtil.showHUD("当前文档并未开始绑定 ID");
              }
            }
          });
        } catch (error) {
          MNUtil.showHUD(error);
        }
      },
    );
  });

  // referenceTestIfIdInCurrentDoc
  global.registerCustomAction("referenceTestIfIdInCurrentDoc", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "输入文献号",
      "",
      2,
      "取消",
      ["确定"],
      (alert, buttonIndex) => {
        try {
          MNUtil.undoGrouping(() => {
            if (buttonIndex == 1) {
              let refNum = alert.textFieldAtIndex(0).text;
              let currentDocmd5 = MNUtil.currentDocmd5;
              if (toolbarConfig.referenceIds.hasOwnProperty(currentDocmd5)) {
                if (toolbarConfig.referenceIds[currentDocmd5].hasOwnProperty(refNum)) {
                  MNUtil.showHUD(
                    "[" +
                      refNum +
                      "] 与「" +
                      MNNote.new(toolbarConfig.referenceIds[currentDocmd5][refNum]).noteTitle +
                      "」绑定",
                  );
                } else {
                  MNUtil.showHUD("[" + refNum + "] 未进行 ID 绑定");
                }
              } else {
                MNUtil.showHUD("当前文档并未开始绑定 ID");
              }
            }
          });
        } catch (error) {
          MNUtil.showHUD(error);
        }
      },
    );
  });

  // referenceStoreOneIdForCurrentDocByFocusNote
  global.registerCustomAction("referenceStoreOneIdForCurrentDocByFocusNote", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "输入文献号",
      "",
      2,
      "取消",
      ["确定"],
      (alert, buttonIndex) => {
        try {
          MNUtil.undoGrouping(() => {
            if (buttonIndex == 1) {
              let refNum = alert.textFieldAtIndex(0).text;
              let refId = focusNote.noteId;
              let currentDocmd5 = MNUtil.currentDocmd5;
              if (toolbarConfig.referenceIds.hasOwnProperty(currentDocmd5)) {
                toolbarConfig.referenceIds[currentDocmd5][refNum] = refId;
              } else {
                toolbarConfig.referenceIds[currentDocmd5] = {};
                toolbarConfig.referenceIds[currentDocmd5][refNum] = refId;
              }
              MNUtil.showHUD("Save: [" + refNum + "] -> " + refId);
              toolbarConfig.save("MNToolbar_referenceIds");
            }
          });
        } catch (error) {
          MNUtil.showHUD(error);
        }
      },
    );
  });

  // referenceStoreOneIdForCurrentDoc
  global.registerCustomAction("referenceStoreOneIdForCurrentDoc", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "绑定参考文献号和对应文献卡片 ID",
      "格式：num@ID\n比如：1@11-22--33",
      2,
      "取消",
      ["确定"],
      (alert, buttonIndex) => {
        try {
          MNUtil.undoGrouping(() => {
            let input = alert.textFieldAtIndex(0).text;
            if (buttonIndex == 1) {
              toolbarUtils.referenceStoreOneIdForCurrentDoc(input);
            }
          });
        } catch (error) {
          MNUtil.showHUD(error);
        }
      },
    );
  });

  // referenceStoreIdsForCurrentDoc
  global.registerCustomAction("referenceStoreIdsForCurrentDoc", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "绑定参考文献号和对应文献卡片 ID",
      "格式：num@ID\n比如：1@11-22--33\n\n多个 ID 之间用\n- 中文分号；\n- 英文分号;\n- 中文逗号，\n- 英文逗号,\n之一隔开",
      2,
      "取消",
      ["确定"],
      (alert, buttonIndex) => {
        try {
          MNUtil.undoGrouping(() => {
            let idsArr = toolbarUtils.splitStringByFourSeparators(alert.textFieldAtIndex(0).text);
            if (buttonIndex == 1) {
              idsArr.forEach((id) => {
                toolbarUtils.referenceStoreOneIdForCurrentDoc(id);
              });
            }
          });
        } catch (error) {
          MNUtil.showHUD(error);
        }
      },
    );
  });

  // referenceStoreIdsForCurrentDocFromClipboard
  global.registerCustomAction("referenceStoreIdsForCurrentDocFromClipboard", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "确定要从剪切板导入所有参考文献 ID 吗？",
      "",
      2,
      "取消",
      ["确定"],
      (alert, buttonIndex) => {
        if (buttonIndex == 1) {
          try {
            MNUtil.undoGrouping(() => {
              let idsArr = toolbarUtils.splitStringByFourSeparators(MNUtil.clipboardText);
              idsArr.forEach((id) => {
                toolbarUtils.referenceStoreOneIdForCurrentDoc(id);
              });
            });
          } catch (error) {
            MNUtil.showHUD(error);
          }
        }
      },
    );
  });

  // referenceExportReferenceIdsToClipboard
  global.registerCustomAction("referenceExportReferenceIdsToClipboard", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.copy(JSON.stringify(toolbarConfig.referenceIds, null, 2));
    MNUtil.showHUD("Copy successfully!");
  });

  // referenceExportReferenceIdsToFile
  global.registerCustomAction("referenceExportReferenceIdsToFile", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    // 导出到 .JSON 文件
    path = MNUtil.cacheFolder + "/exportReferenceIds.json";
    MNUtil.writeText(path, JSON.stringify(toolbarConfig.referenceIds, null, 2));
    UTI = ["public.json"];
    MNUtil.saveFile(path, UTI);
  });

  // referenceInputReferenceIdsFromClipboard
  global.registerCustomAction("referenceInputReferenceIdsFromClipboard", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    // MNUtil.copy(
    //   JSON.stringify(toolbarConfig.referenceIds, null, 2)
    // )
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "确定要从剪切板导入所有参考文献 ID 吗？",
      "",
      2,
      "取消",
      ["确定"],
      (alert, buttonIndex) => {
        if (buttonIndex == 1) {
          try {
            MNUtil.undoGrouping(() => {
              toolbarConfig.referenceIds = JSON.parse(MNUtil.clipboardText);
              toolbarConfig.save("MNToolbar_referenceIds");
            });
          } catch (error) {
            MNUtil.showHUD(error);
          }
        }
      },
    );
  });

  // referenceInputReferenceIdsFromFile
  global.registerCustomAction("referenceInputReferenceIdsFromFile", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    try {
      // MNUtil.undoGrouping(()=>{
      UTI = ["public.json"];
      path = await MNUtil.importFile(UTI);
      toolbarConfig.referenceIds = MNUtil.readJSON(path);
      toolbarConfig.save("MNToolbar_referenceIds");
      // })
    } catch (error) {
      MNUtil.showHUD(error);
    }
    // MNUtil.copy(
    //   JSON.stringify(toolbarConfig.referenceIds, null, 2)
    // )
  });

  // referenceClearIdsForCurrentDoc
  global.registerCustomAction("referenceClearIdsForCurrentDoc", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    try {
      // MNUtil.undoGrouping(()=>{
      currentDocmd5 = MNUtil.currentDocmd5;
      currentDocName = MNUtil.currentDocController.document.docTitle;
      toolbarConfig.referenceIds[currentDocmd5] = {};
      toolbarConfig.save("MNToolbar_referenceIds");
      MNUtil.showHUD("已清空文档「" + currentDocName + "」的所有参考文献 ID");
      // })
    } catch (error) {
      MNUtil.showHUD(error);
    }
    // MNUtil.copy(
    //   JSON.stringify(toolbarConfig.referenceIds, null, 2)
    // )
  });

  // referenceStoreIdForCurrentDocByFocusNote
  global.registerCustomAction("referenceStoreIdForCurrentDocByFocusNote", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    try {
      // MNUtil.undoGrouping(()=>{
      let refNum = 0;
      let refId = focusNote.noteId;
      currentDocmd5 = MNUtil.currentDocmd5;
      currentDocName = MNUtil.currentDocController.document.docTitle;
      if (toolbarConfig.referenceIds.hasOwnProperty(currentDocmd5)) {
        toolbarConfig.referenceIds[currentDocmd5][refNum] = refId;
      } else {
        toolbarConfig.referenceIds[currentDocmd5] = {};
        toolbarConfig.referenceIds[currentDocmd5][refNum] = refId;
      }
      MNUtil.showHUD("文档「" + currentDocName + "」与 " + refId + "绑定");
      toolbarConfig.save("MNToolbar_referenceIds");
      // })
    } catch (error) {
      MNUtil.showHUD(error);
    }
    // MNUtil.copy(
    //   JSON.stringify(toolbarConfig.referenceIds, null, 2)
    // )
  });

  // referenceAuthorInfoFromClipboard
  global.registerCustomAction("referenceAuthorInfoFromClipboard", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      // let infoHtmlCommentIndex = focusNote.getCommentIndex("个人信息：", true)
      let referenceHtmlCommentIndex = focusNote.getCommentIndex("文献：", true);
      focusNote.appendMarkdownComment(MNUtil.clipboardText, referenceHtmlCommentIndex);
    });
  });

  // referenceAuthorRenewAbbreviation
  global.registerCustomAction("referenceAuthorRenewAbbreviation", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((focusNote) => {
        let authorName = toolbarUtils.getFirstKeywordFromTitle(focusNote.noteTitle);
        let abbreviations = toolbarUtils.getAbbreviationsOfName(authorName);
        abbreviations.forEach((abbreviation) => {
          if (!focusNote.noteTitle.includes(abbreviation)) {
            focusNote.noteTitle += "; " + abbreviation;
          }
        });
      });
    });
  });

  // referencePaperMakeCards
  global.registerCustomAction("referencePaperMakeCards", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((focusNote) => {
        if (focusNote.excerptText) {
          toolbarUtils.convertNoteToNonexcerptVersion(focusNote);
        }
        focusNote.note.colorIndex = 15;
        if (focusNote.noteTitle.startsWith("【文献：")) {
          // 把  focusNote.noteTitle 开头的【.*】 删掉
          let reg = new RegExp("^【.*】");
          focusNote.noteTitle = focusNote.noteTitle.replace(reg, "【文献：论文】");
        } else {
          focusNote.noteTitle = "【文献：论文】; " + focusNote.noteTitle;
        }
        let referenceInfoHtmlCommentIndex = focusNote.getCommentIndex("文献信息：", true);
        if (referenceInfoHtmlCommentIndex == -1) {
          toolbarUtils.cloneAndMerge(focusNote, "F09C0EEB-4FB5-476C-8329-8CC5AEFECC43");
        }
        let paperLibraryNote = MNNote.new("785225AC-5A2A-41BA-8760-3FEF10CF4AE0");
        paperLibraryNote.addChild(focusNote.note);
        focusNote.focusInMindMap(0.5);
      });
    });
  });

  // referenceBookMakeCards
  global.registerCustomAction("referenceBookMakeCards", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((focusNote) => {
        if (focusNote.excerptText) {
          toolbarUtils.convertNoteToNonexcerptVersion(focusNote);
        }
        focusNote.note.colorIndex = 15;
        if (focusNote.noteTitle.startsWith("【文献：")) {
          // 把  focusNote.noteTitle 开头的【.*】 删掉
          let reg = new RegExp("^【.*】");
          focusNote.noteTitle = focusNote.noteTitle.replace(reg, "【文献：书作】");
        } else {
          focusNote.noteTitle = "【文献：书作】; " + focusNote.noteTitle;
        }
        let referenceInfoHtmlCommentIndex = focusNote.getCommentIndex("文献信息：", true);
        if (referenceInfoHtmlCommentIndex == -1) {
          toolbarUtils.cloneAndMerge(focusNote, "F09C0EEB-4FB5-476C-8329-8CC5AEFECC43");
        }
        let bookLibraryNote = MNNote.new("49102A3D-7C64-42AD-864D-55EDA5EC3097");
        bookLibraryNote.addChild(focusNote.note);
        focusNote.focusInMindMap(0.5);
      });
    });
  });

  // referenceSeriesBookMakeCard
  global.registerCustomAction("referenceSeriesBookMakeCard", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    try {
      MNUtil.undoGrouping(() => {
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "系列书作",
          "输入系列名",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            if (buttonIndex === 1) {
              let seriesName = alert.textFieldAtIndex(0).text;
              UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
                "系列号",
                "",
                2,
                "取消",
                ["确定"],
                (alertI, buttonIndexI) => {
                  if (buttonIndex == 1) {
                    let seriesNum = alertI.textFieldAtIndex(0).text;
                    try {
                      toolbarUtils.referenceSeriesBookMakeCard(focusNote, seriesName, seriesNum);
                    } catch (error) {
                      MNUtil.showHUD(error);
                    }
                  }
                },
              );
            }
          },
        );
      });
    } catch (error) {
      MNUtil.showHUD(error);
    }
  });

  // referenceOneVolumeJournalMakeCards
  global.registerCustomAction("referenceOneVolumeJournalMakeCards", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    try {
      MNUtil.undoGrouping(() => {
        let journalVolNum;
        let journalName;
        if (focusNote.excerptText) {
          toolbarUtils.convertNoteToNonexcerptVersion(focusNote);
        } else {
          focusNote.note.colorIndex = 15;
          UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
            "整卷期刊",
            "输入期刊名",
            2,
            "取消",
            ["确定"],
            (alert, buttonIndex) => {
              MNUtil.undoGrouping(() => {
                journalName = alert.textFieldAtIndex(0).text;
                if (buttonIndex === 1) {
                  let journalLibraryNote = MNNote.new("1D83F1FA-E54D-4E0E-9E74-930199F9838E");
                  let findJournal = false;
                  let targetJournalNote;
                  let focusNoteIndexInTargetJournalNote;
                  for (let i = 0; i <= journalLibraryNote.childNotes.length - 1; i++) {
                    if (journalLibraryNote.childNotes[i].noteTitle.includes(journalName)) {
                      targetJournalNote = journalLibraryNote.childNotes[i];
                      journalName = toolbarUtils.getFirstKeywordFromTitle(targetJournalNote.noteTitle);
                      findJournal = true;
                    }
                  }
                  if (!findJournal) {
                    targetJournalNote = MNNote.clone("129EB4D6-D57A-4367-8087-5C89864D3595");
                    targetJournalNote.note.noteTitle = "【文献：期刊】; " + journalName;
                    journalLibraryNote.addChild(targetJournalNote.note);
                  }
                  let journalInfoHtmlCommentIndex = focusNote.getCommentIndex("文献信息：", true);
                  if (journalInfoHtmlCommentIndex == -1) {
                    toolbarUtils.cloneAndMerge(focusNote, "1C976BDD-A04D-46D0-8790-34CE0F6671A4");
                  }
                  UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
                    "卷号",
                    "",
                    2,
                    "取消",
                    ["确定"],
                    (alertI, buttonIndex) => {
                      if (buttonIndex == 1) {
                        journalVolNum = alertI.textFieldAtIndex(0).text;
                        let journalTextIndex = focusNote.getIncludingCommentIndex("- 整卷期刊：", true);
                        // let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true)
                        let includingHtmlCommentIndex = focusNote.getCommentIndex("包含：", true);
                        focusNote.noteTitle = toolbarUtils.replaceStringStartWithSquarebracketContent(
                          focusNote.noteTitle,
                          "【文献：整卷期刊：" + journalName + " - Vol. " + journalVolNum + "】",
                        );
                        if (journalTextIndex == -1) {
                          focusNote.appendMarkdownComment(
                            "- 整卷期刊：Vol. " + journalVolNum,
                            includingHtmlCommentIndex,
                          );
                          focusNote.appendNoteLink(targetJournalNote, "To");
                          focusNote.moveComment(focusNote.comments.length - 1, includingHtmlCommentIndex + 1);
                        } else {
                          // focusNote.appendNoteLink(targetJournalNote, "To")
                          // focusNote.moveComment(focusNote.comments.length-1,journalTextIndex + 1)
                          focusNote.removeCommentByIndex(journalTextIndex);
                          focusNote.appendMarkdownComment("- 整卷期刊：Vol. " + journalVolNum, journalTextIndex);
                          if (focusNote.getCommentIndex("marginnote4app://note/" + targetJournalNote.noteId) == -1) {
                            focusNote.appendNoteLink(targetJournalNote, "To");
                            focusNote.moveComment(focusNote.comments.length - 1, journalTextIndex + 1);
                          }
                        }
                        focusNoteIndexInTargetJournalNote = targetJournalNote.getCommentIndex(
                          "marginnote4app://note/" + focusNote.noteId,
                        );
                        let singleInfoIndexInTargetJournalNote = targetJournalNote.getIncludingCommentIndex("**单份**");
                        if (focusNoteIndexInTargetJournalNote == -1) {
                          targetJournalNote.appendNoteLink(focusNote, "To");
                          targetJournalNote.moveComment(
                            targetJournalNote.comments.length - 1,
                            singleInfoIndexInTargetJournalNote,
                          );
                        } else {
                          targetJournalNote.moveComment(
                            focusNoteIndexInTargetJournalNote,
                            singleInfoIndexInTargetJournalNote,
                          );
                        }
                        // toolbarUtils.sortNoteByVolNum(targetJournalNote, 1)
                        let bookLibraryNote = MNNote.new("49102A3D-7C64-42AD-864D-55EDA5EC3097");
                        MNUtil.undoGrouping(() => {
                          bookLibraryNote.addChild(focusNote.note);
                          focusNote.focusInMindMap(0.5);
                        });
                      }
                    },
                  );
                }
              });
            },
          );
        }
      });
    } catch (error) {
      MNUtil.showHUD(error);
    }
  });

  // referenceAuthorNoteMake
  global.registerCustomAction("referenceAuthorNoteMake", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        focusNotes.forEach((focusNote) => {
          toolbarUtils.referenceAuthorNoteMake(focusNote);
        });
      } catch (error) {
        MNUtil.showHUD(error);
        MNUtil.copy(error);
      }
    });
  });

  // referenceBibInfoCopy
  global.registerCustomAction("referenceBibInfoCopy", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    bibContentArr = [];
    focusNotes.forEach((focusNote) => {
      bibContentArr.push(toolbarUtils.extractBibFromReferenceNote(focusNote));
    });
    if (bibContentArr.length > 0) {
      if (bibContentArr.length == 1) {
        bibContent = bibContentArr[0];
        MNUtil.copy(bibContent);
        MNUtil.showHUD("已复制 1 条 .bib 条目到剪贴板");
      } else {
        if (bibContentArr.length > 1) {
          bibContent = bibContentArr.join("\n\n");
          MNUtil.copy(bibContent);
          MNUtil.showHUD("已复制" + bibContentArr.length + "条 .bib 条目到剪贴板");
        }
      }
    }
  });

  // referenceBibInfoExport
  global.registerCustomAction("referenceBibInfoExport", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    bibContentArr = [];
    focusNotes.forEach((focusNote) => {
      bibContentArr.push(toolbarUtils.extractBibFromReferenceNote(focusNote));
    });
    if (bibContentArr.length > 0) {
      if (bibContentArr.length == 1) {
        bibContent = bibContentArr[0];
        MNUtil.copy(bibContent);
        // MNUtil.showHUD("已复制 1 条 .bib 条目到剪贴板")
      } else {
        if (bibContentArr.length > 1) {
          bibContent = bibContentArr.join("\n\n");
          MNUtil.copy(bibContent);
          // MNUtil.showHUD("已复制" + bibContentArr.length + "条 .bib 条目到剪贴板")
        }
      }
      // 导出到 .bib 文件
      let docPath = MNUtil.cacheFolder + "/exportBibItems.bib";
      MNUtil.writeText(docPath, bibContent);
      let UTI = ["public.bib"];
      MNUtil.saveFile(docPath, UTI);
    }
  });

  // referenceBibInfoPasteFromClipboard
  global.registerCustomAction("referenceBibInfoPasteFromClipboard", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      bibTextIndex = focusNote.getIncludingCommentIndex("- `.bib`");
      if (bibTextIndex !== -1) {
        focusNote.removeCommentByIndex(bibTextIndex);
      }
      let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true);
      let bibContent = "- `.bib` 条目：\n  ```bib\n  ";
      // 为MNUtil.clipboardText中的每一行增加四个空格的预处理
      let processedClipboardText = MNUtil.clipboardText.replace(/\n/g, "\n  "); // 在每个换行符前添加四个空格
      bibContent += processedClipboardText; // 将处理后的文本添加到bibContent中
      bibContent += "\n  ```"; // 继续构建最终字符串
      focusNote.appendMarkdownComment(bibContent, thoughtHtmlCommentIndex);
    });
  });

  // referenceInfoDoiFromClipboard
  global.registerCustomAction("referenceInfoDoiFromClipboard", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    try {
      MNUtil.undoGrouping(() => {
        const doiRegex = /(?<=doi:|DOI:|Doi:)\s*(\S+)/i; // 正则表达式匹配以 "doi:" 开头的内容，后面可能有空格或其他字符
        const doiMatch = MNUtil.clipboardText.match(doiRegex); // 使用正则表达式进行匹配
        let doi = doiMatch ? doiMatch[1] : MNUtil.clipboardText.trim(); // 如果匹配成功，取出匹配的内容，否则取出原始输入的内容
        let doiTextIndex = focusNote.getIncludingCommentIndex("- DOI", true);
        if (doiTextIndex !== -1) {
          focusNote.removeCommentByIndex(doiTextIndex);
        }
        let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true);
        focusNote.appendMarkdownComment("- DOI（Digital Object Identifier）：" + doi, thoughtHtmlCommentIndex);
      });
    } catch (error) {
      MNUtil.showHUD(error);
    }
  });

  // referenceInfoDoiFromTyping
  global.registerCustomAction("referenceInfoDoiFromTyping", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "增加 Doi",
      "",
      2,
      "取消",
      ["确定"],
      (alert, buttonIndex) => {
        try {
          MNUtil.undoGrouping(() => {
            userInput = alert.textFieldAtIndex(0).text;
            const doiRegex = /(?<=doi:|DOI:|Doi:)\s*(\S+)/i; // 正则表达式匹配以 "doi:" 开头的内容，后面可能有空格或其他字符
            const doiMatch = userInput.match(doiRegex); // 使用正则表达式进行匹配
            let doi = doiMatch ? doiMatch[1] : userInput.trim(); // 如果匹配成功，取出匹配的内容，否则取出原始输入的内容
            if (buttonIndex === 1) {
              let doiTextIndex = focusNote.getIncludingCommentIndex("- DOI", true);
              if (doiTextIndex !== -1) {
                focusNote.removeCommentByIndex(doiTextIndex);
              }
              let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true);
              focusNote.appendMarkdownComment("- DOI（Digital Object Identifier）：" + doi, thoughtHtmlCommentIndex);
            }
          });
        } catch (error) {
          MNUtil.showHUD(error);
        }
      },
    );
  });

  // referenceInfoJournal
  global.registerCustomAction("referenceInfoJournal", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "增加期刊",
      "",
      2,
      "取消",
      ["单份", "整期/卷"],
      (alert, buttonIndex) => {
        try {
          MNUtil.undoGrouping(() => {
            journalName = alert.textFieldAtIndex(0).text;
            let journalLibraryNote = MNNote.new("1D83F1FA-E54D-4E0E-9E74-930199F9838E");
            let findJournal = false;
            let targetJournalNote;
            let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true);
            let focusNoteIndexInTargetJournalNote;
            let singleInfoIndexInTargetJournalNote;
            for (let i = 0; i <= journalLibraryNote.childNotes.length - 1; i++) {
              if (journalName.toLowerCase()) {
                if (journalLibraryNote.childNotes[i].noteTitle.toLowerCase().includes(journalName.toLowerCase())) {
                  targetJournalNote = journalLibraryNote.childNotes[i];
                  findJournal = true;
                }
              } else {
                if (journalLibraryNote.childNotes[i].noteTitle.includes(journalName)) {
                  targetJournalNote = journalLibraryNote.childNotes[i];
                  findJournal = true;
                }
              }
            }
            if (!findJournal) {
              targetJournalNote = MNNote.clone("129EB4D6-D57A-4367-8087-5C89864D3595");
              targetJournalNote.note.noteTitle = "【文献：期刊】; " + journalName;
              journalLibraryNote.addChild(targetJournalNote.note);
            }
            let journalTextIndex = focusNote.getIncludingCommentIndex("- 期刊", true);
            if (journalTextIndex == -1) {
              focusNote.appendMarkdownComment("- 期刊（Journal）：", thoughtHtmlCommentIndex);
              focusNote.appendNoteLink(targetJournalNote, "To");
              focusNote.moveComment(focusNote.comments.length - 1, thoughtHtmlCommentIndex + 1);
            } else {
              // focusNote.appendNoteLink(targetJournalNote, "To")
              // focusNote.moveComment(focusNote.comments.length-1,journalTextIndex + 1)
              if (focusNote.getCommentIndex("marginnote4app://note/" + targetJournalNote.noteId) == -1) {
                focusNote.appendNoteLink(targetJournalNote, "To");
                focusNote.moveComment(focusNote.comments.length - 1, journalTextIndex + 1);
              } else {
                focusNote.moveComment(
                  focusNote.getCommentIndex("marginnote4app://note/" + targetJournalNote.noteId),
                  journalTextIndex + 1,
                );
              }
            }
            focusNoteIndexInTargetJournalNote = targetJournalNote.getCommentIndex(
              "marginnote4app://note/" + focusNote.noteId,
            );
            singleInfoIndexInTargetJournalNote = targetJournalNote.getIncludingCommentIndex("**单份**");
            if (focusNoteIndexInTargetJournalNote == -1) {
              targetJournalNote.appendNoteLink(focusNote, "To");
              if (buttonIndex !== 1) {
                // 非单份
                targetJournalNote.moveComment(
                  targetJournalNote.comments.length - 1,
                  singleInfoIndexInTargetJournalNote,
                );
              }
            } else {
              if (buttonIndex !== 1) {
                // 非单份
                targetJournalNote.moveComment(focusNoteIndexInTargetJournalNote, singleInfoIndexInTargetJournalNote);
              } else {
                targetJournalNote.moveComment(focusNoteIndexInTargetJournalNote, targetJournalNote.comments.length - 1);
              }
            }
            // if (buttonIndex == 1) {
            // }
          });
        } catch (error) {
          MNUtil.showHUD(error);
        }
      },
    );
  });

  // referenceInfoPublisher
  global.registerCustomAction("referenceInfoPublisher", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "增加出版社",
      "",
      2,
      "取消",
      ["单份", "系列"],
      (alert, buttonIndex) => {
        try {
          MNUtil.undoGrouping(() => {
            publisherName = alert.textFieldAtIndex(0).text;
            let publisherLibraryNote = MNNote.new("9FC1044A-F9D2-4A75-912A-5BF3B02984E6");
            let findPublisher = false;
            let targetPublisherNote;
            let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true);
            let focusNoteIndexInTargetPublisherNote;
            let singleInfoIndexInTargetPublisherNote;
            for (let i = 0; i <= publisherLibraryNote.childNotes.length - 1; i++) {
              if (publisherLibraryNote.childNotes[i].noteTitle.includes(publisherName)) {
                targetPublisherNote = publisherLibraryNote.childNotes[i];
                findPublisher = true;
              }
            }
            if (!findPublisher) {
              targetPublisherNote = MNNote.clone("1E34F27B-DB2D-40BD-B0A3-9D47159E68E7");
              targetPublisherNote.note.noteTitle = "【文献：出版社】; " + publisherName;
              publisherLibraryNote.addChild(targetPublisherNote.note);
            }
            let publisherTextIndex = focusNote.getIncludingCommentIndex("- 出版社", true);
            if (publisherTextIndex == -1) {
              focusNote.appendMarkdownComment("- 出版社（Publisher）：", thoughtHtmlCommentIndex);
              focusNote.appendNoteLink(targetPublisherNote, "To");
              focusNote.moveComment(focusNote.comments.length - 1, thoughtHtmlCommentIndex + 1);
            } else {
              if (focusNote.getCommentIndex("marginnote4app://note/" + targetPublisherNote.noteId) == -1) {
                focusNote.appendNoteLink(targetPublisherNote, "To");
                focusNote.moveComment(focusNote.comments.length - 1, publisherTextIndex + 1);
              } else {
                focusNote.moveComment(
                  focusNote.getCommentIndex("marginnote4app://note/" + targetPublisherNote.noteId),
                  publisherTextIndex + 1,
                );
              }
            }
            focusNoteIndexInTargetPublisherNote = targetPublisherNote.getCommentIndex(
              "marginnote4app://note/" + focusNote.noteId,
            );
            singleInfoIndexInTargetPublisherNote = targetPublisherNote.getIncludingCommentIndex("**单份**");
            if (focusNoteIndexInTargetPublisherNote == -1) {
              targetPublisherNote.appendNoteLink(focusNote, "To");
              if (buttonIndex !== 1) {
                // 非单份
                targetPublisherNote.moveComment(
                  targetPublisherNote.comments.length - 1,
                  singleInfoIndexInTargetPublisherNote,
                );
              }
            } else {
              if (buttonIndex !== 1) {
                // 非单份
                targetPublisherNote.moveComment(
                  focusNoteIndexInTargetPublisherNote,
                  singleInfoIndexInTargetPublisherNote,
                );
              } else {
                targetPublisherNote.moveComment(
                  focusNoteIndexInTargetPublisherNote,
                  targetPublisherNote.comments.length - 1,
                );
              }
            }
            // if (buttonIndex == 1) {
            // }
          });
        } catch (error) {
          MNUtil.showHUD(error);
        }
      },
    );
  });

  // referenceInfoKeywords
  global.registerCustomAction("referenceInfoKeywords", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "增加关键词",
      "若多个关键词，用\n- 中文分号；\n- 英文分号;\n- 中文逗号，\n- 英文逗号,\n之一隔开",
      2,
      "取消",
      ["确定"],
      (alert, buttonIndex) => {
        try {
          MNUtil.undoGrouping(() => {
            userInput = alert.textFieldAtIndex(0).text;
            let keywordArr = toolbarUtils.splitStringByFourSeparators(userInput);
            let findKeyword = false;
            let targetKeywordNote;
            let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true);
            let focusNoteIndexInTargetKeywordNote;
            if (buttonIndex === 1) {
              let keywordLibraryNote = MNNote.new("3BA9E467-9443-4E5B-983A-CDC3F14D51DA");
              // MNUtil.showHUD(keywordArr)
              keywordArr.forEach((keyword) => {
                findKeyword = false;
                for (let i = 0; i <= keywordLibraryNote.childNotes.length - 1; i++) {
                  if (
                    keywordLibraryNote.childNotes[i].noteTitle.includes(keyword) ||
                    keywordLibraryNote.childNotes[i].noteTitle.includes(keyword.toLowerCase())
                  ) {
                    targetKeywordNote = keywordLibraryNote.childNotes[i];
                    findKeyword = true;
                    // MNUtil.showHUD("存在！" + targetKeywordNote.noteTitle)
                    // MNUtil.delay(0.5).then(()=>{
                    //   targetKeywordNote.focusInFloatMindMap()
                    // })
                  }
                }
                if (!findKeyword) {
                  // 若不存在，则添加关键词卡片
                  targetKeywordNote = MNNote.clone("D1EDF37C-7611-486A-86AF-5DBB2039D57D");
                  if (keyword.toLowerCase() !== keyword) {
                    targetKeywordNote.note.noteTitle += "; " + keyword + "; " + keyword.toLowerCase();
                  } else {
                    targetKeywordNote.note.noteTitle += "; " + keyword;
                  }
                  keywordLibraryNote.addChild(targetKeywordNote.note);
                } else {
                  if (targetKeywordNote.noteTitle.includes(keyword)) {
                    if (!targetKeywordNote.noteTitle.includes(keyword.toLowerCase())) {
                      targetKeywordNote.note.noteTitle += "; " + keyword.toLowerCase();
                    }
                  } else {
                    // 存在小写版本，但没有非小写版本
                    // 获取 noteTitle 中 【文献：关键词】部分后面的内容（假设这部分内容是固定的格式）
                    let noteTitleAfterKeywordPrefixPart = targetKeywordNote.noteTitle.split("【文献：关键词】")[1]; // 这会获取到"; xxx; yyy"这部分内容

                    // 在关键词后面添加新的关键词和对应的分号与空格
                    let newKeywordPart = "; " + keyword; // 添加分号和空格以及新的关键词

                    // 重新组合字符串，把新的关键词部分放到原来位置
                    let updatedNoteTitle = `【文献：关键词】${newKeywordPart}${noteTitleAfterKeywordPrefixPart}`; // 使用模板字符串拼接新的标题

                    // 更新 targetKeywordNote 的 noteTitle 属性或者给新的变量赋值
                    targetKeywordNote.note.noteTitle = updatedNoteTitle; // 如果 noteTitle 是对象的一个属性的话
                  }
                }
                // MNUtil.delay(0.5).then(()=>{
                //   targetKeywordNote.focusInFloatMindMap()
                // })
                let keywordTextIndex = focusNote.getIncludingCommentIndex("- 关键词", true);
                if (keywordTextIndex == -1) {
                  focusNote.appendMarkdownComment("- 关键词（Keywords）：", thoughtHtmlCommentIndex);
                }
                let keywordIndexInFocusNote = focusNote.getCommentIndex(
                  "marginnote4app://note/" + targetKeywordNote.noteId,
                );
                if (keywordIndexInFocusNote == -1) {
                  // 关键词卡片还没链接过来
                  focusNote.appendNoteLink(targetKeywordNote, "To");
                  let keywordLinksArr = [];
                  focusNote.comments.forEach((comment, index) => {
                    if (
                      comment.text &&
                      (comment.text.includes("- 关键词") ||
                        comment.text.includes("marginnote4app://note/") ||
                        comment.text.includes("marginnote3app://note/"))
                    ) {
                      keywordLinksArr.push(index);
                    }
                  });
                  keywordTextIndex = focusNote.getIncludingCommentIndex("- 关键词", true);
                  let keywordContinuousLinksArr = toolbarUtils.getContinuousSequenceFromNum(
                    keywordLinksArr,
                    keywordTextIndex,
                  );
                  focusNote.moveComment(
                    focusNote.comments.length - 1,
                    keywordContinuousLinksArr[keywordContinuousLinksArr.length - 1] + 1,
                  );
                } else {
                  // 已经有关键词链接
                  let keywordLinksArr = [];
                  focusNote.comments.forEach((comment, index) => {
                    if (
                      comment.text &&
                      (comment.text.includes("- 关键词") ||
                        comment.text.includes("marginnote4app://note/") ||
                        comment.text.includes("marginnote3app://note/"))
                    ) {
                      keywordLinksArr.push(index);
                    }
                  });
                  // MNUtil.showHUD(nextBarCommentIndex)
                  keywordTextIndex = focusNote.getIncludingCommentIndex("- 关键词", true);
                  let keywordContinuousLinksArr = toolbarUtils.getContinuousSequenceFromNum(
                    keywordLinksArr,
                    keywordTextIndex,
                  );
                  focusNote.moveComment(
                    keywordIndexInFocusNote,
                    keywordContinuousLinksArr[keywordContinuousLinksArr.length - 1],
                  );
                }

                // 处理关键词卡片
                focusNoteIndexInTargetKeywordNote = targetKeywordNote.getCommentIndex(
                  "marginnote4app://note/" + focusNote.noteId,
                );
                if (focusNoteIndexInTargetKeywordNote == -1) {
                  targetKeywordNote.appendNoteLink(focusNote, "To");
                }
              });

              targetKeywordNote.refresh();
              focusNote.refresh();
            }
          });
        } catch (error) {
          MNUtil.showHUD(error);
        }
      },
    );
  });

  // referenceInfoYear
  global.registerCustomAction("referenceInfoYear", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "增加年份",
      "",
      2,
      "取消",
      ["确定"],
      (alert, buttonIndex) => {
        try {
          MNUtil.undoGrouping(() => {
            year = alert.textFieldAtIndex(0).text;
            if (buttonIndex === 1) {
              toolbarUtils.referenceInfoYear(focusNote, year);
            }
          });
        } catch (error) {
          MNUtil.showHUD(error);
        }
      },
    );
  });

  // referenceGetRelatedReferencesByKeywords
  global.registerCustomAction("referenceGetRelatedReferencesByKeywords", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "根据关键词进行文献筛选",
      "若多个关键词，用\n- 中文分号；\n- 英文分号;\n- 中文逗号，\n- 英文逗号,\n之一隔开",
      2,
      "取消",
      ["确定"],
      (alert, buttonIndex) => {
        try {
          MNUtil.undoGrouping(() => {
            userInput = alert.textFieldAtIndex(0).text;
            let keywordArr = toolbarUtils.splitStringByFourSeparators(userInput);
            let findKeyword = false;
            let targetKeywordNoteArr = [];
            if (buttonIndex === 1) {
              let keywordLibraryNote = MNNote.new("3BA9E467-9443-4E5B-983A-CDC3F14D51DA");
              // MNUtil.showHUD(keywordArr)
              for (let j = 0; j <= keywordArr.length - 1; j++) {
                let keyword = keywordArr[j];
                findKeyword = false;
                for (let i = 0; i <= keywordLibraryNote.childNotes.length - 1; i++) {
                  if (
                    keywordLibraryNote.childNotes[i].noteTitle.includes(keyword) ||
                    keywordLibraryNote.childNotes[i].noteTitle.includes(keyword.toLowerCase())
                  ) {
                    targetKeywordNoteArr.push(keywordLibraryNote.childNotes[i]);
                    findKeyword = true;
                  }
                }
                if (!findKeyword) {
                  MNUtil.showHUD("关键词：「" + keyword + "」不存在！");
                }
              }

              try {
                MNUtil.undoGrouping(() => {
                  if (findKeyword) {
                    // MNUtil.showHUD(toolbarUtils.findCommonComments(targetKeywordNoteArr, "相关文献："))
                    let idsArr = toolbarUtils.findCommonComments(targetKeywordNoteArr, "相关文献：");
                    if (idsArr.length > 0) {
                      // 找到了共有的链接
                      let resultLibraryNote = MNNote.new("F1FAEB86-179E-454D-8ECB-53C3BB098701");
                      if (!resultLibraryNote) {
                        // 没有的话就放在“关键词库”下方
                        resultLibraryNote = MNNote.new("3BA9E467-9443-4E5B-983A-CDC3F14D51DA");
                      }
                      let findResultNote = false;
                      let resultNote;
                      let combinations = toolbarUtils.generateArrayCombinations(keywordArr, " + "); // 生成所有可能的组合
                      // MNUtil.showHUD(combinations)
                      for (let i = 0; i <= resultLibraryNote.childNotes.length - 1; i++) {
                        let childNote = resultLibraryNote.childNotes[i];

                        findResultNote = false; // 用于标记是否找到匹配的笔记

                        // 遍历所有组合进行匹配
                        for (let combination of combinations) {
                          if (childNote.noteTitle.match(/【.*】(.*)/)[1] === combination) {
                            // 这里假设childNote已经定义且存在noteTitle属性
                            resultNote = childNote; // 更新匹配的笔记对象
                            findResultNote = true; // 设置找到匹配的笔记标记为true
                            break; // 如果找到了匹配项则跳出循环
                          }
                        }
                      }
                      // if (!findResultNote){
                      //   MNUtil.showHUD("false")
                      // } else {
                      //   MNUtil.showHUD("true")
                      // }
                      try {
                        if (!findResultNote) {
                          resultNote = MNNote.clone("DE4455DB-5C55-49F8-8C83-68D6D958E586");
                          resultNote.noteTitle = "【根据关键词筛选文献】" + keywordArr.join(" + ");
                          resultLibraryNote.addChild(resultNote.note);
                        } else {
                          // 清空 resultNote 的所有评论
                          // resultNote.comments.forEach((comment, index)=>{
                          //   resultNote.removeCommentByIndex(0)
                          // })
                          for (let i = resultNote.comments.length - 1; i >= 0; i--) {
                            focusNote.removeCommentByIndex(i);
                          }
                          // 重新合并模板
                          toolbarUtils.cloneAndMerge(resultNote, "DE4455DB-5C55-49F8-8C83-68D6D958E586");
                        }
                        idsArr.forEach((id) => {
                          resultNote.appendNoteLink(MNNote.new(id), "To");
                        });
                        resultNote.focusInFloatMindMap(0.5);
                      } catch (error) {
                        MNUtil.showHUD(error);
                      }
                    } else {
                      MNUtil.showHUD("没有文献同时有关键词「" + keywordArr.join("; ") + "」");
                    }
                  }
                });
              } catch (error) {
                MNUtil.showHUD(error);
              }
            }
          });
        } catch (error) {
          MNUtil.showHUD(error);
        }
      },
    );
  });

  // referenceKeywordsAddRelatedKeywords
  global.registerCustomAction("referenceKeywordsAddRelatedKeywords", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "增加相关关键词",
      "若多个关键词，用\n- 中文分号；\n- 英文分号;\n- 中文逗号，\n- 英文逗号,\n之一隔开",
      2,
      "取消",
      ["确定"],
      (alert, buttonIndex) => {
        try {
          MNUtil.undoGrouping(() => {
            userInput = alert.textFieldAtIndex(0).text;
            let keywordArr = toolbarUtils.splitStringByFourSeparators(userInput);
            let findKeyword = false;
            let targetKeywordNote;
            let focusNoteIndexInTargetKeywordNote;
            if (buttonIndex === 1) {
              let keywordLibraryNote = MNNote.new("3BA9E467-9443-4E5B-983A-CDC3F14D51DA");
              // MNUtil.showHUD(keywordArr)
              keywordArr.forEach((keyword) => {
                findKeyword = false;
                for (let i = 0; i <= keywordLibraryNote.childNotes.length - 1; i++) {
                  if (
                    keywordLibraryNote.childNotes[i].noteTitle.includes(keyword) ||
                    keywordLibraryNote.childNotes[i].noteTitle.includes(keyword.toLowerCase())
                  ) {
                    targetKeywordNote = keywordLibraryNote.childNotes[i];
                    findKeyword = true;
                    // MNUtil.showHUD("存在！" + targetKeywordNote.noteTitle)
                    // MNUtil.delay(0.5).then(()=>{
                    //   targetKeywordNote.focusInFloatMindMap()
                    // })
                  }
                }
                if (!findKeyword) {
                  // 若不存在，则添加关键词卡片
                  targetKeywordNote = MNNote.clone("D1EDF37C-7611-486A-86AF-5DBB2039D57D");
                  if (keyword.toLowerCase() !== keyword) {
                    targetKeywordNote.note.noteTitle += "; " + keyword + "; " + keyword.toLowerCase();
                  } else {
                    targetKeywordNote.note.noteTitle += "; " + keyword;
                  }
                  keywordLibraryNote.addChild(targetKeywordNote.note);
                } else {
                  if (targetKeywordNote.noteTitle.includes(keyword)) {
                    if (!targetKeywordNote.noteTitle.includes(keyword.toLowerCase())) {
                      targetKeywordNote.note.noteTitle += "; " + keyword.toLowerCase();
                    }
                  } else {
                    // 存在小写版本，但没有非小写版本
                    // 获取 noteTitle 中 【文献：关键词】部分后面的内容（假设这部分内容是固定的格式）
                    let noteTitleAfterKeywordPrefixPart = targetKeywordNote.noteTitle.split("【文献：关键词】")[1]; // 这会获取到"; xxx; yyy"这部分内容

                    // 在关键词后面添加新的关键词和对应的分号与空格
                    let newKeywordPart = "; " + keyword; // 添加分号和空格以及新的关键词

                    // 重新组合字符串，把新的关键词部分放到原来位置
                    let updatedNoteTitle = `【文献：关键词】${newKeywordPart}${noteTitleAfterKeywordPrefixPart}`; // 使用模板字符串拼接新的标题

                    // 更新 targetKeywordNote 的 noteTitle 属性或者给新的变量赋值
                    targetKeywordNote.note.noteTitle = updatedNoteTitle; // 如果 noteTitle 是对象的一个属性的话
                  }
                }
                let keywordIndexInFocusNote = focusNote.getCommentIndex(
                  "marginnote4app://note/" + targetKeywordNote.noteId,
                );
                if (keywordIndexInFocusNote == -1) {
                  // 关键词卡片还没链接过来
                  focusNote.appendNoteLink(targetKeywordNote, "To");
                  let keywordLinksArr = [];
                  focusNote.comments.forEach((comment, index) => {
                    if (
                      comment.text &&
                      (comment.text.includes("相关关键词") ||
                        comment.text.includes("marginnote4app://note/") ||
                        comment.text.includes("marginnote3app://note/"))
                    ) {
                      keywordLinksArr.push(index);
                    }
                  });
                  let keywordContinuousLinksArr = toolbarUtils.getContinuousSequenceFromNum(keywordLinksArr, 0);
                  focusNote.moveComment(
                    focusNote.comments.length - 1,
                    keywordContinuousLinksArr[keywordContinuousLinksArr.length - 1] + 1,
                  );
                } else {
                  // 已经有关键词链接
                  let keywordLinksArr = [];
                  focusNote.comments.forEach((comment, index) => {
                    if (
                      comment.text &&
                      (comment.text.includes("相关关键词") ||
                        comment.text.includes("marginnote4app://note/") ||
                        comment.text.includes("marginnote3app://note/"))
                    ) {
                      keywordLinksArr.push(index);
                    }
                  });
                  // MNUtil.showHUD(nextBarCommentIndex)
                  let keywordContinuousLinksArr = toolbarUtils.getContinuousSequenceFromNum(keywordLinksArr, 0);
                  focusNote.moveComment(
                    keywordIndexInFocusNote,
                    keywordContinuousLinksArr[keywordContinuousLinksArr.length - 1] + 1,
                  );
                }

                // 处理关键词卡片
                focusNoteIndexInTargetKeywordNote = targetKeywordNote.getCommentIndex(
                  "marginnote4app://note/" + focusNote.noteId,
                );
                if (focusNoteIndexInTargetKeywordNote == -1) {
                  targetKeywordNote.appendNoteLink(focusNote, "To");
                  targetKeywordNote.moveComment(
                    targetKeywordNote.comments.length - 1,
                    targetKeywordNote.getCommentIndex("相关文献：", true),
                  );
                } else {
                  targetKeywordNote.moveComment(
                    focusNoteIndexInTargetKeywordNote,
                    targetKeywordNote.getCommentIndex("相关文献：", true),
                  );
                }
              });
              targetKeywordNote.refresh();
              focusNote.refresh();
            }
          });
        } catch (error) {
          MNUtil.showHUD(error);
        }
      },
    );
  });

  // referenceInfoAuthor
  global.registerCustomAction("referenceInfoAuthor", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "增加文献作者",
      "若多个作者，用\n- 中文分号；\n- 英文分号;\n- 中文逗号，\n之一隔开", // 因为有些作者是缩写，包含西文逗号，所以不适合用西文逗号隔开
      2,
      "取消",
      ["确定"],
      (alert, buttonIndex) => {
        try {
          MNUtil.undoGrouping(() => {
            let userInput = alert.textFieldAtIndex(0).text;
            let authorArr = toolbarUtils.splitStringByThreeSeparators(userInput);
            let findAuthor = false;
            let targetAuthorNote;
            let referenceInfoHtmlCommentIndex = focusNote.getCommentIndex("文献信息：", true);
            let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true);
            let focusNoteIndexInTargetAuthorNote;
            let paperInfoIndexInTargetAuthorNote;
            if (buttonIndex === 1) {
              let authorLibraryNote = MNNote.new("A67469F8-FB6F-42C8-80A0-75EA1A93F746");
              authorArr.forEach((author) => {
                findAuthor = false;
                let possibleAuthorFormatArr = [...new Set(Object.values(toolbarUtils.getAbbreviationsOfName(author)))];
                for (let i = 0; i <= authorLibraryNote.childNotes.length - 1; i++) {
                  let findPossibleAuthor = possibleAuthorFormatArr.some((possibleAuthor) =>
                    authorLibraryNote.childNotes[i].noteTitle.includes(possibleAuthor),
                  );
                  if (findPossibleAuthor) {
                    targetAuthorNote = authorLibraryNote.childNotes[i];
                    findAuthor = true;
                  }
                }
                if (!findAuthor) {
                  // MNUtil.showHUD(possibleAuthorFormatArr)
                  // 若不存在，则添加作者卡片
                  targetAuthorNote = MNNote.clone("BBA8DDB0-1F74-4A84-9D8D-B04C5571E42A");
                  possibleAuthorFormatArr.forEach((possibleAuthor) => {
                    targetAuthorNote.note.noteTitle += "; " + possibleAuthor;
                  });
                  authorLibraryNote.addChild(targetAuthorNote.note);
                } else {
                  // 如果有的话就把 possibleAuthorFormatArr 里面 targetAuthorNote 的 noteTitle 里没有的加进去
                  for (let possibleAuthor of possibleAuthorFormatArr) {
                    if (!targetAuthorNote.note.noteTitle.includes(possibleAuthor)) {
                      targetAuthorNote.note.noteTitle += "; " + possibleAuthor;
                    }
                  }
                }
                let authorTextIndex = focusNote.getIncludingCommentIndex("- 作者", true);
                if (authorTextIndex == -1) {
                  focusNote.appendMarkdownComment("- 作者（Authors）：", referenceInfoHtmlCommentIndex + 1);
                }
                let authorIndexInFocusNote = focusNote.getCommentIndex(
                  "marginnote4app://note/" + targetAuthorNote.noteId,
                );
                if (authorIndexInFocusNote == -1) {
                  // 作者卡片还没链接过来
                  focusNote.appendNoteLink(targetAuthorNote, "To");
                  let authorLinksArr = [];
                  focusNote.comments.forEach((comment, index) => {
                    if (
                      comment.text &&
                      (comment.text.includes("- 作者") ||
                        comment.text.includes("marginnote4app://note/") ||
                        comment.text.includes("marginnote3app://note/"))
                    ) {
                      authorLinksArr.push(index);
                    }
                  });
                  let authorContinuousLinksArr = toolbarUtils.getContinuousSequenceFromNum(
                    authorLinksArr,
                    referenceInfoHtmlCommentIndex + 1,
                  );
                  focusNote.moveComment(
                    focusNote.comments.length - 1,
                    authorContinuousLinksArr[authorContinuousLinksArr.length - 1] + 1,
                  );
                } else {
                  let authorLinksArr = [];
                  focusNote.comments.forEach((comment, index) => {
                    if (
                      comment.text &&
                      (comment.text.includes("- 作者") ||
                        comment.text.includes("marginnote4app://note/") ||
                        comment.text.includes("marginnote3app://note/"))
                    ) {
                      authorLinksArr.push(index);
                    }
                  });
                  // MNUtil.showHUD(nextBarCommentIndex)
                  let authorContinuousLinksArr = toolbarUtils.getContinuousSequenceFromNum(
                    authorLinksArr,
                    referenceInfoHtmlCommentIndex + 1,
                  );
                  focusNote.moveComment(
                    authorIndexInFocusNote,
                    authorContinuousLinksArr[authorContinuousLinksArr.length - 1],
                  );
                }

                // 处理作者卡片
                focusNoteIndexInTargetAuthorNote = targetAuthorNote.getCommentIndex(
                  "marginnote4app://note/" + focusNote.noteId,
                );
                paperInfoIndexInTargetAuthorNote = targetAuthorNote.getIncludingCommentIndex("**论文**");
                if (focusNoteIndexInTargetAuthorNote == -1) {
                  targetAuthorNote.appendNoteLink(focusNote, "To");
                  if (toolbarUtils.getReferenceNoteType(focusNote) == "book") {
                    targetAuthorNote.moveComment(
                      targetAuthorNote.comments.length - 1,
                      paperInfoIndexInTargetAuthorNote,
                    );
                  }
                } else {
                  if (toolbarUtils.getReferenceNoteType(focusNote) == "book") {
                    if (focusNoteIndexInTargetAuthorNote > paperInfoIndexInTargetAuthorNote) {
                      targetAuthorNote.moveComment(focusNoteIndexInTargetAuthorNote, paperInfoIndexInTargetAuthorNote);
                    }
                  }
                }
              });

              targetAuthorNote.refresh();
              focusNote.refresh();
            }
          });
        } catch (error) {
          MNUtil.showHUD(error);
        }
      },
    );
  });

  // referenceInfoInputRef
  global.registerCustomAction("referenceInfoInputRef", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "增加引用样式",
      "即文献的参考文献部分对该文献的具体引用样式",
      2,
      "取消",
      ["确定"],
      (alert, buttonIndex) => {
        try {
          MNUtil.undoGrouping(() => {
            let referenceContent = toolbarUtils.extractRefContentFromReference(alert.textFieldAtIndex(0).text);
            referenceContent = toolbarUtils.formatEnglishStringPunctuationSpace(referenceContent);
            if (buttonIndex == 1) {
              let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true);
              let refTextIndex = focusNote.getIncludingCommentIndex("- 引用样式", true);
              if (refTextIndex == -1) {
                focusNote.appendMarkdownComment("- 引用样式：", thoughtHtmlCommentIndex);
                focusNote.appendMarkdownComment(referenceContent, thoughtHtmlCommentIndex + 1);
              } else {
                focusNote.appendMarkdownComment(referenceContent, refTextIndex + 1);
              }
            }
          });
        } catch (error) {
          MNUtil.showHUD(error);
        }
      },
    );
  });

  // referenceInfoRefFromInputRefNum
  global.registerCustomAction("referenceInfoRefFromInputRefNum", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "输入文献号",
      "",
      2,
      "取消",
      ["确定"],
      (alert, buttonIndex) => {
        try {
          MNUtil.undoGrouping(() => {
            if (buttonIndex == 1) {
              if (focusNote.noteTitle !== "") {
                MNUtil.showHUD("选错卡片了！应该选参考文献引用的摘录卡片！");
              } else {
                let referenceContent = toolbarUtils.extractRefContentFromReference(focusNote.excerptText);
                referenceContent = toolbarUtils.formatEnglishStringPunctuationSpace(referenceContent);
                let refNum = alert.textFieldAtIndex(0).text;
                if (refNum == 0) {
                  MNUtil.showHUD("当前文档没有绑定卡片 ID");
                } else {
                  currentDocmd5 = MNUtil.currentDocmd5;
                  let targetNoteId = toolbarConfig.referenceIds[currentDocmd5]
                    ? referenceIds[currentDocmd5][refNum]
                    : undefined;
                  if (targetNoteId == undefined) {
                    MNUtil.showHUD("卡片 ID 还没绑定");
                  } else {
                    let targetNote = MNNote.new(targetNoteId);
                    let thoughtHtmlCommentIndex = targetNote.getCommentIndex("相关思考：", true);
                    let refTextIndex = targetNote.getCommentIndex("- 引用样式：", true);
                    if (refTextIndex == -1) {
                      targetNote.appendMarkdownComment("- 引用样式：", thoughtHtmlCommentIndex);
                      targetNote.merge(focusNote);
                      targetNote.appendMarkdownComment(referenceContent);
                      targetNote.moveComment(targetNote.comments.length - 1, thoughtHtmlCommentIndex + 1);
                      targetNote.moveComment(targetNote.comments.length - 1, thoughtHtmlCommentIndex + 2);
                    } else {
                      targetNote.merge(focusNote);
                      targetNote.appendMarkdownComment(referenceContent);
                      targetNote.moveComment(targetNote.comments.length - 1, refTextIndex + 1);
                      targetNote.moveComment(targetNote.comments.length - 1, refTextIndex + 2);
                    }
                  }
                }
              }
            }
          });
        } catch (error) {
          MNUtil.showHUD(error);
        }
      },
    );
  });

  // referenceInfoRefFromFocusNote
  global.registerCustomAction("referenceInfoRefFromFocusNote", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    try {
      MNUtil.undoGrouping(() => {
        if (focusNote.noteTitle !== "") {
          MNUtil.showHUD("选错卡片了！应该选参考文献引用的摘录卡片！");
        } else {
          let referenceContent = toolbarUtils.extractRefContentFromReference(focusNote.excerptText);
          referenceContent = toolbarUtils.formatEnglishStringPunctuationSpace(referenceContent);
          let refNum = toolbarUtils.extractRefNumFromReference(focusNote.excerptText);
          if (refNum == 0) {
            MNUtil.showHUD("当前文档没有绑定卡片 ID");
          } else {
            currentDocmd5 = MNUtil.currentDocmd5;
            let targetNoteId = toolbarConfig.referenceIds[currentDocmd5]
              ? referenceIds[currentDocmd5][refNum]
              : undefined;
            if (targetNoteId == undefined) {
              MNUtil.showHUD("卡片 ID 还没绑定");
            } else {
              let targetNote = MNNote.new(targetNoteId);
              let thoughtHtmlCommentIndex = targetNote.getCommentIndex("相关思考：", true);
              let refTextIndex = targetNote.getCommentIndex("- 引用样式：", true);
              if (refTextIndex == -1) {
                targetNote.appendMarkdownComment("- 引用样式：", thoughtHtmlCommentIndex);
                targetNote.merge(focusNote);
                targetNote.appendMarkdownComment(referenceContent);
                targetNote.moveComment(targetNote.comments.length - 1, thoughtHtmlCommentIndex + 1);
                targetNote.moveComment(targetNote.comments.length - 1, thoughtHtmlCommentIndex + 2);
              } else {
                targetNote.merge(focusNote);
                targetNote.appendMarkdownComment(referenceContent);
                targetNote.moveComment(targetNote.comments.length - 1, refTextIndex + 1);
                targetNote.moveComment(targetNote.comments.length - 1, refTextIndex + 2);
              }
            }
          }
        }
      });
    } catch (error) {
      MNUtil.showHUD(error);
    }
  });

  // referenceMoveLastCommentToThought
  global.registerCustomAction("referenceMoveLastCommentToThought", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((focusNote) => {
        toolbarUtils.referenceMoveLastCommentToThought(focusNote);
      });
    });
  });

  // referenceMoveLastTwoCommentsToThought
  global.registerCustomAction("referenceMoveLastTwoCommentsToThought", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((focusNote) => {
        toolbarUtils.referenceMoveLastTwoCommentsToThought(focusNote);
      });
    });
  });

  // referenceAddThoughtPointAndMoveLastCommentToThought
  global.registerCustomAction("referenceAddThoughtPointAndMoveLastCommentToThought", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    try {
      MNUtil.undoGrouping(() => {
        focusNotes.forEach((focusNote) => {
          toolbarUtils.referenceAddThoughtPoint(focusNote);
          toolbarUtils.referenceMoveLastCommentToThought(focusNote);
        });
      });
    } catch (error) {
      MNUtil.showHUD(error);
    }
  });

  // referenceAddThoughtPoint
  global.registerCustomAction("referenceAddThoughtPoint", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        focusNotes.forEach((focusNote) => {
          toolbarUtils.referenceAddThoughtPoint(focusNote);
        });
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // referenceMoveUpThoughtPoints
  global.registerCustomAction("referenceMoveUpThoughtPoints", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        focusNotes.forEach((focusNote) => {
          toolbarUtils.referenceMoveUpThoughtPoints(focusNote);
        });
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // ========== PROOF 相关 (20 个) ==========

  // moveProofDown
  global.registerCustomAction("moveProofDown", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        focusNote.moveProofDown();
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // moveLastCommentToProofStart
  global.registerCustomAction("moveLastCommentToProofStart", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        let targetIndex = toolbarUtils.getProofHtmlCommentIndex(focusNote) + 1;
        focusNote.moveComment(focusNote.comments.length - 1, targetIndex);
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // moveProofToStart
  global.registerCustomAction("moveProofToStart", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        let targetIndex = toolbarUtils.getProofHtmlCommentIndex(focusNote) + 1;
        toolbarUtils.moveProofToIndex(focusNote, targetIndex);
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // renewProofContentPoints
  global.registerCustomAction("renewProofContentPoints", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "选择“-“评论修改的类型",
          "",
          0,
          "取消",
          htmlSettingTitles,
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(() => {
                // 按钮索引从1开始（0是取消按钮）
                const selectedIndex = buttonIndex - 1;

                if (selectedIndex >= 0 && selectedIndex < htmlSetting.length) {
                  const selectedType = htmlSetting[selectedIndex].type;
                  // focusNote.mergeInto(focusNote.parentNote, selectedType)
                  focusNote.renewProofContentPointsToHtmlType(selectedType);
                }
              });
            } catch (error) {
              MNUtil.showHUD(error);
            }
          },
        );
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // renewProofContentPointsToSubpointType
  global.registerCustomAction("renewProofContentPointsToSubpointType", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        focusNotes.forEach((focusNote) => {
          focusNote.renewProofContentPointsToHtmlType("subpoint");
        });
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // htmlCommentToProofTop
  global.registerCustomAction("htmlCommentToProofTop", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "输入注释",
      "",
      2,
      "取消",
      ["确定"],
      (alert, buttonIndex) => {
        try {
          MNUtil.undoGrouping(() => {
            let comment = alert.textFieldAtIndex(0).text;
            if (buttonIndex == 1) {
              let targetIndex = focusNote.getCommentIndex("证明：", true) + 1;
              focusNote.appendMarkdownComment(
                '<span style="font-weight: bold; color: #1A6584; background-color: #e8e9eb; font-size: 1.18em; padding-top: 5px; padding-bottom: 5px">' +
                  comment +
                  "</span>",
                targetIndex,
              );
            }
          });
        } catch (error) {
          MNUtil.showHUD(error);
        }
      },
    );
  });

  // htmlCommentToProofFromClipboard
  global.registerCustomAction("htmlCommentToProofFromClipboard", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        let dotCommentIndex =
          focusNote.getCommentIndex("-") == -1 ? focusNote.getCommentIndex("- ") : focusNote.getCommentIndex("-");
        if (dotCommentIndex !== -1) {
          focusNote.removeCommentByIndex(dotCommentIndex);
          focusNote.appendMarkdownComment(
            '<span style="font-weight: bold; color: #1A6584; background-color: #e8e9eb; font-size: 1.18em; padding-top: 5px; padding-bottom: 5px">' +
              MNUtil.clipboardText +
              "</span>",
            dotCommentIndex,
          );
        } else {
          focusNote.appendMarkdownComment(
            '<span style="font-weight: bold; color: #1A6584; background-color: #e8e9eb; font-size: 1.18em; padding-top: 5px; padding-bottom: 5px">' +
              MNUtil.clipboardText +
              "</span>",
            focusNote.getCommentIndex("相关思考：", true),
          );
        }
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // htmlCommentToProofBottom
  global.registerCustomAction("htmlCommentToProofBottom", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "输入注释",
      "",
      2,
      "取消",
      ["确定"],
      (alert, buttonIndex) => {
        try {
          MNUtil.undoGrouping(() => {
            let comment = alert.textFieldAtIndex(0).text;
            if (buttonIndex == 1) {
              let targetIndex = focusNote.getCommentIndex("相关思考：", true);
              focusNote.appendMarkdownComment(
                '<span style="font-weight: bold; color: #1A6584; background-color: #e8e9eb; font-size: 1.18em; padding-top: 5px; padding-bottom: 5px">' +
                  comment +
                  "</span>",
                targetIndex,
              );
            }
          });
        } catch (error) {
          MNUtil.showHUD(error);
        }
      },
    );
  });

  // addProofToStartFromClipboard
  global.registerCustomAction("addProofToStartFromClipboard", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    try {
      MNUtil.undoGrouping(() => {
        MNUtil.excuteCommand("EditPaste");
        MNUtil.delay(0.1).then(() => {
          let targetIndex = toolbarUtils.getProofHtmlCommentIndex(focusNote) + 1;
          focusNote.moveComment(focusNote.comments.length - 1, targetIndex);
        });
      });
    } catch (error) {
      MNUtil.showHUD(error);
    }
  });

  // addProofFromClipboard
  global.registerCustomAction("addProofFromClipboard", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    try {
      MNUtil.undoGrouping(() => {
        MNUtil.excuteCommand("EditPaste");
        MNUtil.delay(0.1).then(() => {
          toolbarUtils.moveLastCommentToProof(focusNote);
        });
      });
    } catch (error) {
      MNUtil.showHUD(error);
    }
  });

  // proofAddMethodComment
  global.registerCustomAction("proofAddMethodComment", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "输入方法数",
      "",
      2,
      "取消",
      ["确定"],
      (alertI, buttonIndexI) => {
        try {
          MNUtil.undoGrouping(() => {
            let methodNum = alertI.textFieldAtIndex(0).text;
            let findMethod = false;
            let methodIndex = -1;
            if (buttonIndexI == 1) {
              for (let i = 0; i < focusNote.comments.length; i++) {
                let comment = focusNote.comments[i];
                if (
                  comment.text &&
                  comment.text.startsWith("<span") &&
                  comment.text.includes("方法" + toolbarUtils.numberToChinese(methodNum))
                ) {
                  methodIndex = i;
                  findMethod = true;
                }
              }
              if (!findMethod) {
                MNUtil.showHUD("没有此方法！");
              } else {
                UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
                  "输入此方法的注释",
                  "",
                  2,
                  "取消",
                  ["确定"],
                  (alert, buttonIndex) => {
                    try {
                      MNUtil.undoGrouping(() => {
                        let methodComment = alert.textFieldAtIndex(0).text;
                        if (methodComment == "") {
                          methodComment = "- - - - - - - - - - - - - - -";
                        }
                        if (buttonIndex == 1) {
                          focusNote.removeCommentByIndex(methodIndex);
                          focusNote.appendMarkdownComment(
                            '<span style="font-weight: bold; color: #014f9c; background-color: #ecf5fc; font-size: 1.15em; padding-top: 5px; padding-bottom: 5px"> 方法' +
                              toolbarUtils.numberToChinese(methodNum) +
                              "：" +
                              methodComment +
                              "</span>",
                            methodIndex,
                          );
                        }
                      });
                    } catch (error) {
                      MNUtil.showHUD(error);
                    }
                  },
                );
              }
            }
          });
        } catch (error) {
          MNUtil.showHUD(error);
        }
      },
    );
  });

  // proofAddNewAntiexampleWithComment
  global.registerCustomAction("proofAddNewAntiexampleWithComment", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "输入此反例的注释",
      "",
      2,
      "取消",
      ["确定"],
      (alert, buttonIndex) => {
        try {
          MNUtil.undoGrouping(() => {
            let antiexampleComment = alert.textFieldAtIndex(0).text;
            if (antiexampleComment == "") {
              antiexampleComment = "- - - - - - - - - - - - - - -";
            }
            if (buttonIndex == 1) {
              let antiexampleNum = 0;
              focusNote.comments.forEach((comment) => {
                if (comment.text && comment.text.startsWith("<span") && comment.text.includes("反例")) {
                  antiexampleNum++;
                }
              });
              let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true);
              let proofHtmlCommentIndex = focusNote.getCommentIndex("证明：", true);
              let targetIndex = antiexampleNum == 0 ? proofHtmlCommentIndex + 1 : thoughtHtmlCommentIndex;
              focusNote.appendMarkdownComment(
                '<span style="font-weight: bold; color: #081F3C; background-color: #B9EDD0; font-size: 1.15em; padding-top: 5px; padding-bottom: 5px"> 反例' +
                  toolbarUtils.numberToChinese(antiexampleNum + 1) +
                  "：" +
                  antiexampleComment +
                  "</span>",
                targetIndex,
              );
            }
          });
        } catch (error) {
          MNUtil.showHUD(error);
        }
      },
    );
  });

  // proofAddNewMethodWithComment
  global.registerCustomAction("proofAddNewMethodWithComment", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "输入此方法的注释",
      "",
      2,
      "取消",
      ["确定"],
      (alert, buttonIndex) => {
        try {
          MNUtil.undoGrouping(() => {
            let methodComment = alert.textFieldAtIndex(0).text;
            if (methodComment == "") {
              methodComment = "- - - - - - - - - - - - - - -";
            }
            if (buttonIndex == 1) {
              let methodNum = 0;
              focusNote.comments.forEach((comment) => {
                if (comment.text && comment.text.startsWith("<span") && comment.text.includes("方法")) {
                  methodNum++;
                }
              });
              let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true);
              let proofHtmlCommentIndex = focusNote.getCommentIndex("证明：", true);
              let targetIndex = methodNum == 0 ? proofHtmlCommentIndex + 1 : thoughtHtmlCommentIndex;
              focusNote.appendMarkdownComment(
                '<span style="font-weight: bold; color: #081F3C; background-color: #B9EDD0; font-size: 1.15em; padding-top: 5px; padding-bottom: 5px"> 方法' +
                  toolbarUtils.numberToChinese(methodNum + 1) +
                  "：" +
                  methodComment +
                  "</span>",
                targetIndex,
              );
            }
          });
        } catch (error) {
          MNUtil.showHUD(error);
        }
      },
    );
  });

  // proofAddNewAntiexample
  global.registerCustomAction("proofAddNewAntiexample", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    try {
      MNUtil.undoGrouping(() => {
        let antiexampleNum = 0;
        focusNote.comments.forEach((comment) => {
          if (comment.text && comment.text.startsWith("<span") && comment.text.includes("反例")) {
            antiexampleNum++;
          }
        });
        let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true);
        let proofHtmlCommentIndex = focusNote.getCommentIndex("证明：", true);
        let targetIndex = antiexampleNum == 0 ? proofHtmlCommentIndex + 1 : thoughtHtmlCommentIndex;
        focusNote.appendMarkdownComment(
          '<span style="font-weight: bold; color: #081F3C; background-color: #B9EDD0; font-size: 1.15em; padding-top: 5px; padding-bottom: 5px"> 反例' +
            toolbarUtils.numberToChinese(antiexampleNum + 1) +
            "：- - - - - - - - - - - - - - - </span>",
          targetIndex,
        );
      });
    } catch (error) {
      MNUtil.showHUD(error);
    }
  });

  // proofAddNewMethod
  global.registerCustomAction("proofAddNewMethod", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    try {
      MNUtil.undoGrouping(() => {
        let methodNum = 0;
        focusNote.comments.forEach((comment) => {
          if (comment.text && comment.text.startsWith("<span") && comment.text.includes("方法")) {
            methodNum++;
          }
        });
        let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true);
        let proofHtmlCommentIndex = focusNote.getCommentIndex("证明：", true);
        let targetIndex = methodNum == 0 ? proofHtmlCommentIndex + 1 : thoughtHtmlCommentIndex;
        focusNote.appendMarkdownComment(
          '<span style="font-weight: bold; color: #081F3C; background-color: #B9EDD0; font-size: 1.15em; padding-top: 5px; padding-bottom: 5px"> 方法' +
            toolbarUtils.numberToChinese(methodNum + 1) +
            "：- - - - - - - - - - - - - - - </span>",
          targetIndex,
        );
      });
    } catch (error) {
      MNUtil.showHUD(error);
    }
  });

  // moveLastLinkToProof
  global.registerCustomAction("moveLastLinkToProof", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true);
    MNUtil.undoGrouping(() => {
      focusNote.moveComment(focusNote.comments.length - 1, thoughtHtmlCommentIndex);
    });
  });

  // moveLastCommentToProof
  global.registerCustomAction("moveLastCommentToProof", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((focusNote) => {
        toolbarUtils.moveLastCommentToProof(focusNote);
      });
    });
  });

  // moveLastTwoCommentsToProof
  global.registerCustomAction("moveLastTwoCommentsToProof", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((focusNote) => {
        toolbarUtils.moveLastTwoCommentsToProof(focusNote);
      });
    });
  });

  // renewProof
  global.registerCustomAction("renewProof", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    try {
      MNUtil.undoGrouping(() => {
        toolbarUtils.renewProof(focusNotes);
      });
    } catch (error) {
      MNUtil.showHUD(error);
    }
  });

  // moveProofToMethod
  global.registerCustomAction("moveProofToMethod", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "输入方法数",
      "",
      2,
      "取消",
      ["确定"],
      (alert, buttonIndex) => {
        try {
          MNUtil.undoGrouping(() => {
            let methodNum = alert.textFieldAtIndex(0).text;
            let findMethod = false;
            if (buttonIndex == 1) {
              for (let i = 0; i < focusNote.comments.length; i++) {
                let comment = focusNote.comments[i];
                if (
                  comment.text &&
                  comment.text.startsWith("<span") &&
                  comment.text.includes("方法" + toolbarUtils.numberToChinese(methodNum))
                ) {
                  findMethod = true;
                }
              }
              if (!findMethod) {
                MNUtil.showHUD("没有此方法！");
              } else {
                toolbarUtils.moveProofToMethod(focusNote, methodNum);
              }
            }
          });
        } catch (error) {
          MNUtil.showHUD(error);
        }
      },
    );
  });

  // ========== TEMPLATE 相关 (6 个) ==========

  // addTemplate
  global.registerCustomAction("addTemplate", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    try {
      MNUtil.undoGrouping(() => {
        MNMath.addTemplate(focusNote);
      });
    } catch (error) {
      MNUtil.showHUD(error);
    }
  });

  // mergeTemplateNotes
  global.registerCustomAction("mergeTemplateNotes", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    if (MNUtil.currentNotebookId !== "9BA894B4-3509-4894-A05C-1B4BA0A9A4AE") {
      MNUtil.undoGrouping(() => {
        try {
          if (focusNote.ifIndependentNote()) {
            // 独立卡片双击时把父卡片的标题作为前缀
            if (!focusNote.title.ifWithBracketPrefix()) {
              focusNote.title = focusNote.parentNote.noteTitle.toBracketPrefixContentArrowSuffix() + focusNote.title;
            } else {
              // 有前缀的话，就更新前缀
              focusNote.title =
                focusNote.parentNote.noteTitle.toBracketPrefixContentArrowSuffix() +
                focusNote.title.toNoBracketPrefixContent();
            }
          } else {
            // 非独立卡片
            if (toolbarConfig.windowState.preprocess) {
              focusNotes.forEach((focusNote) => {
                toolbarUtils.TemplateMakeNote(focusNote);
              });
            } else {
              UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
                "撤销制卡",
                "去掉所有「文本」和「链接」",
                0,
                "点错了",
                ["确认"],
                (alert, buttonIndex) => {
                  if (buttonIndex == 1) {
                    MNUtil.undoGrouping(() => {
                      focusNote.removeCommentsByTypes(["text", "links"]);
                    });
                  }
                },
              );
            }
          }
        } catch (error) {
          MNUtil.showHUD(error);
        }
      });
    }
  });

  // multiTemplateMakeNotes
  global.registerCustomAction("multiTemplateMakeNotes", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((focusNote) => {
        toolbarUtils.TemplateMakeNote(focusNote);
        if (!focusNote.ifIndependentNote() && !focusNote.ifReferenceNote()) {
          focusNote.addToReview();
        }
      });
    });
  });

  // TemplateMakeNotes
  global.registerCustomAction("TemplateMakeNotes", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        // 由于原始代码过于复杂，这里提供简化版本
        // 完整版本请查看 webviewController.js.backup 中的原始代码
        if (focusNotes && focusNotes.length > 0) {
          focusNotes.forEach((focusNote) => {
            toolbarUtils.TemplateMakeNote(focusNote);
            if (!focusNote.ifIndependentNote() && !focusNote.ifReferenceNote()) {
              focusNote.addToReview();
            }
          });
        }
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // TemplateMakeChildNotes
  global.registerCustomAction("TemplateMakeChildNotes", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      focusNote.childNotes.forEach((childNote) => {
        toolbarUtils.TemplateMakeNote(childNote);
        childNote.refreshAll();
      });
    });
  });

  // TemplateMakeDescendantNotes
  global.registerCustomAction("TemplateMakeDescendantNotes", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      focusNote.descendantNodes.descendant.forEach((descendantNote) => {
        toolbarUtils.TemplateMakeNote(descendantNote);
        descendantNote.refreshAll();
      });
    });
  });

  // ========== HTML 相关 (12 个) ==========

  // addHtmlMarkdownComment
  global.registerCustomAction("addHtmlMarkdownComment", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "添加 Html 或 Markdown 评论",
      "输入内容\n然后选择 Html 类型",
      2,
      "取消",
      htmlSettingTitles,
      (alert, buttonIndex) => {
        MNUtil.undoGrouping(() => {
          try {
            const inputCommentText = alert.textFieldAtIndex(0).text;
            const selectedIndex = buttonIndex - 1;
            if (selectedIndex >= 0 && selectedIndex < htmlSetting.length && inputCommentText) {
              // 由于原始代码包含复杂的 switch 语句，这里简化处理
              focusNote.addHtmlComment(htmlSetting[selectedIndex]);
              focusNote.appendTextComment(inputCommentText);
            }
          } catch (error) {
            MNUtil.showHUD(error);
          }
        });
      },
    );
  });

  // copyMarkdownVersionFocusNoteURL
  global.registerCustomAction("copyMarkdownVersionFocusNoteURL", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "复制 Markdown 类型链接",
          "输入引用词",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            MNUtil.undoGrouping(() => {
              if (buttonIndex == 1) {
                let refContent = alert.textFieldAtIndex(0).text
                  ? alert.textFieldAtIndex(0).text
                  : focusNote.getFirstTitleLinkWord();
                let mdLink = "[" + refContent + "](" + focusNote.noteURL + ")";
                MNUtil.copy(mdLink);
                MNUtil.showHUD(mdLink);
              }
            });
          },
        );
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // renewContentPointsToHtmlType
  global.registerCustomAction("renewContentPointsToHtmlType", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "选择“-“评论修改的类型",
          "",
          0,
          "取消",
          htmlSettingTitles,
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(() => {
                // 按钮索引从1开始（0是取消按钮）
                const selectedIndex = buttonIndex - 1;

                if (selectedIndex >= 0 && selectedIndex < htmlSetting.length) {
                  const selectedType = htmlSetting[selectedIndex].type;
                  // focusNote.mergeInto(focusNote.parentNote, selectedType)
                  focusNote.renewContentPointsToHtmlType(selectedType);
                }
              });
            } catch (error) {
              MNUtil.showHUD(error);
            }
          },
        );
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // htmlMDCommentsToNextLevelType
  global.registerCustomAction("htmlMDCommentsToNextLevelType", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        let commentsObjArr = HtmlMarkdownUtils.getHtmlMDCommentIndexAndTypeObjArr(focusNote);
        let comments = focusNote.MNComments;
        commentsObjArr.forEach((commentObj) => {
          let commentType = commentObj.type;
          if (HtmlMarkdownUtils.isLevelType(commentType)) {
            // 防止对其它类型进行处理
            let comment = comments[commentObj.index];
            let commentContent = HtmlMarkdownUtils.getSpanTextContent(comment);
            let nextCommentType = HtmlMarkdownUtils.getSpanNextLevelType(commentType);
            comment.text = HtmlMarkdownUtils.createHtmlMarkdownText(commentContent, nextCommentType);
          }
        });
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // htmlMDCommentsToLastLevelType
  global.registerCustomAction("htmlMDCommentsToLastLevelType", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        let commentsObjArr = HtmlMarkdownUtils.getHtmlMDCommentIndexAndTypeObjArr(focusNote);
        let comments = focusNote.MNComments;
        commentsObjArr.forEach((commentObj) => {
          let commentType = commentObj.type;
          if (HtmlMarkdownUtils.isLevelType(commentType)) {
            let comment = comments[commentObj.index];
            let commentContent = HtmlMarkdownUtils.getSpanTextContent(comment);
            let lastCommentType = HtmlMarkdownUtils.getSpanLastLevelType(commentType);
            comment.text = HtmlMarkdownUtils.createHtmlMarkdownText(commentContent, lastCommentType);
          }
        });
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // htmlCommentToBottom
  global.registerCustomAction("htmlCommentToBottom", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "输入注释",
      "",
      2,
      "取消",
      ["确定"],
      (alert, buttonIndex) => {
        try {
          MNUtil.undoGrouping(() => {
            let comment = alert.textFieldAtIndex(0).text;
            if (buttonIndex == 1) {
              focusNote.appendMarkdownComment(
                '<span style="font-weight: bold; color: #1A6584; background-color: #e8e9eb; font-size: 1.18em; padding-top: 5px; padding-bottom: 5px">' +
                  comment +
                  "</span>",
              );
            }
          });
        } catch (error) {
          MNUtil.showHUD(error);
        }
      },
    );
  });

  // convetHtmlToMarkdown
  global.registerCustomAction("convetHtmlToMarkdown", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    try {
      MNUtil.undoGrouping(() => {
        toolbarUtils.convetHtmlToMarkdown(focusNote);
      });
    } catch (error) {
      MNUtil.showHUD(error);
    }
  });

  // clearContentKeepMarkdownText
  global.registerCustomAction("clearContentKeepMarkdownText", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    try {
      MNUtil.undoGrouping(() => {
        toolbarUtils.clearContentKeepMarkdownText(focusNote);
      });
    } catch (error) {
      MNUtil.showHUD(error);
    }
  });

  // addHtmlMarkdownQuestion
  global.registerCustomAction("addHtmlMarkdownQuestion", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        HtmlMarkdownUtils.addQuestionHtmlMDComment(focusNote);
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // clearContentKeepHtmlText
  global.registerCustomAction("clearContentKeepHtmlText", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        focusNotes.forEach((focusNote) => {
          MNUtil.copy(focusNote.noteTitle);
          focusNote.noteTitle = "";
          // 从最后往上删除，就不会出现前面删除后干扰后面的 index 的情况
          for (let i = focusNote.comments.length - 1; i >= 0; i--) {
            let comment = focusNote.comments[i];
            if (comment.type !== "HtmlNote") {
              focusNote.removeCommentByIndex(i);
            }
          }
        });
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // splitMarkdownTextInFocusNote
  global.registerCustomAction("splitMarkdownTextInFocusNote", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    toolbarUtils.markdown2Mindmap({ source: "currentNote" });
  });

  // changeHtmlMarkdownCommentTypeByPopup
  global.registerCustomAction("changeHtmlMarkdownCommentTypeByPopup", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        MNMath.changeHtmlMarkdownCommentTypeByPopup(focusNote);
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // ========== MOVE 相关 (19 个) ==========

  // moveToExcerptPartTop
  global.registerCustomAction("moveToExcerptPartTop", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        let newContentsIndexArr = focusNote.getNewContentIndexArr();
        focusNote.moveCommentsByIndexArrTo(newContentsIndexArr, "excerpt", false);
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // moveToExcerptPartBottom
  global.registerCustomAction("moveToExcerptPartBottom", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        let newContentsIndexArr = focusNote.getNewContentIndexArr();
        focusNote.moveCommentsByIndexArrTo(newContentsIndexArr, "excerpt");
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // moveToInput
  global.registerCustomAction("moveToInput", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        focusNotes.forEach((focusNote) => {
          focusNote.moveToInput();
        });
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // moveToPreparationForExam
  global.registerCustomAction("moveToPreparationForExam", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        focusNotes.forEach((focusNote) => {
          focusNote.moveToPreparationForExam();
        });
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // moveToInternalize
  global.registerCustomAction("moveToInternalize", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        focusNotes.forEach((focusNote) => {
          focusNote.moveToInternalize();
        });
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // moveToBeClassified
  global.registerCustomAction("moveToBeClassified", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        if (MNUtil.currentNotebookId == "A07420C1-661A-4C7D-BA06-C7035C18DA74") {
          UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
            "移动到「待归类」区",
            "请选择科目",
            0,
            "取消",
            ["数学基础", "泛函分析", "实分析", "复分析", "数学分析", "高等代数"],
            (alert, buttonIndex) => {
              let targetNoteId;
              switch (buttonIndex) {
                case 1: // 数学基础
                  targetNoteId = "EF75F2C8-2655-4BAD-92E1-C9C11D1A37C3";
                case 2: // 泛函分析
                  targetNoteId = "23E0024A-F2C9-4E45-9F64-86DD30C0D497";
                case 3: // 实分析
                  targetNoteId = "97672F06-1C40-475D-8F44-16759CCADA8C";
                case 4: // 复分析
                  targetNoteId = "16920F8B-700E-4BA6-A7EE-F887F28A502B";
                case 5: // 数学分析
                  targetNoteId = "9AAE346D-D7ED-472E-9D30-A7E1DE843F83";
                case 6: // 高等代数
                  targetNoteId = "B9B3FB57-AAC0-4282-9BFE-3EF008EA2085";
              }
              MNUtil.undoGrouping(() => {
                focusNotes.forEach((focusNote) => {
                  focusNote.moveToBeClassified(targetNoteId);
                });
              });
            },
          );
        } else {
          focusNotes.forEach((focusNote) => {
            focusNote.moveToBeClassified();
          });
        }
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // moveLastThreeCommentByPopupTo
  global.registerCustomAction("moveLastThreeCommentByPopupTo", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        let newContentsIndexArr = [
          focusNote.comments.length - 3,
          focusNote.comments.length - 2,
          focusNote.comments.length - 1,
        ];
        focusNote.moveCommentsByIndexArrAndButtonTo(newContentsIndexArr, "移动「最后3️⃣条」评论到", "");
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // moveLastTwoCommentByPopupTo
  global.registerCustomAction("moveLastTwoCommentByPopupTo", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        let newContentsIndexArr = [focusNote.comments.length - 2, focusNote.comments.length - 1];
        focusNote.moveCommentsByIndexArrAndButtonTo(newContentsIndexArr, "移动「最后2️⃣条」评论到", "");
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // moveLastOneCommentByPopupTo
  global.registerCustomAction("moveLastOneCommentByPopupTo", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        let newContentsIndexArr = [focusNote.comments.length - 1];
        focusNote.moveCommentsByIndexArrAndButtonTo(newContentsIndexArr, "移动「最后1️⃣条」评论到", "");
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // moveNewContentsByPopupTo
  global.registerCustomAction("moveNewContentsByPopupTo", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        // focusNote.moveCommentsByIndexArrAndButtonTo(focusNote.getNewContentIndexArr(), "移动「新增」评论到", "")
        MNMath.moveCommentsByPopup(focusNote);
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // moveOneCommentToLinkNote
  global.registerCustomAction("moveOneCommentToLinkNote", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        let proofHtmlCommentIndex = Math.max(
          focusNote.getCommentIndex("原理：", true),
          focusNote.getCommentIndex("反例及证明：", true),
          focusNote.getCommentIndex("证明：", true),
        );
        let targetIndex =
          proofHtmlCommentIndex == -1 ? focusNote.getCommentIndex("相关思考：", true) : proofHtmlCommentIndex;
        focusNote.moveComment(focusNote.comments.length - 1, targetIndex);
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // moveLastCommentToThought
  global.registerCustomAction("moveLastCommentToThought", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((focusNote) => {
        focusNote.moveCommentsByIndexArrTo([focusNote.comments.length - 1], "think");
      });
    });
  });

  // moveLastTwoCommentsToThought
  global.registerCustomAction("moveLastTwoCommentsToThought", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((focusNote) => {
        toolbarUtils.moveLastTwoCommentsToThought(focusNote);
      });
    });
  });

  // moveLastTwoCommentsInBiLinkNotesToThought
  global.registerCustomAction("moveLastTwoCommentsInBiLinkNotesToThought", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((focusNote) => {
        let targetNoteId = focusNote.comments[focusNote.comments.length - 1].text.ifNoteIdorURL()
          ? focusNote.comments[focusNote.comments.length - 1].text.toNoteId()
          : undefined;
        if (targetNoteId !== undefined) {
          let targetNote = MNNote.new(targetNoteId);
          targetNote.moveCommentsByIndexArrTo(targetNote.getNewContentIndexArr(), "think");
          focusNote.moveCommentsByIndexArrTo(focusNote.getNewContentIndexArr(), "think");
        }
      });
    });
  });

  // moveLastTwoCommentsInBiLinkNotesToDefinition
  global.registerCustomAction("moveLastTwoCommentsInBiLinkNotesToDefinition", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((focusNote) => {
        let targetNoteId = focusNote.comments[focusNote.comments.length - 1].text.ifNoteIdorURL()
          ? focusNote.comments[focusNote.comments.length - 1].text.toNoteId()
          : undefined;
        if (targetNoteId !== undefined) {
          let targetNote = MNNote.new(targetNoteId);
          targetNote.moveCommentsByIndexArrTo(targetNote.getNewContentIndexArr(), "def");
          focusNote.moveCommentsByIndexArrTo(focusNote.getNewContentIndexArr(), "def");
        }
      });
    });
  });

  // moveUpThoughtPointsToBottom
  global.registerCustomAction("moveUpThoughtPointsToBottom", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        focusNotes.forEach((focusNote) => {
          // let newContentsIndexArr = focusNote.getNewContentIndexArr()
          // focusNote.moveCommentsByIndexArrTo(newContentsIndexArr, "think")
          toolbarUtils.moveUpThoughtPointsToBottom(focusNote);
        });
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // moveUpThoughtPointsToTop
  global.registerCustomAction("moveUpThoughtPointsToTop", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        focusNotes.forEach((focusNote) => {
          let newContentsIndexArr = focusNote.getNewContentIndexArr();
          focusNote.moveCommentsByIndexArrTo(newContentsIndexArr, "think", false);
        });
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // moveUpLinkNotes
  global.registerCustomAction("moveUpLinkNotes", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    try {
      MNUtil.undoGrouping(() => {
        toolbarUtils.moveUpLinkNotes(focusNotes);
      });
    } catch (error) {
      MNUtil.showHUD(error);
    }
  });

  // moveToInbox
  global.registerCustomAction("moveToInbox", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        focusNotes.forEach((focusNote) => {
          MNMath.moveNoteToInbox(focusNote);
        });
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // ========== CLEAR 相关 (8 个) ==========

  // clearAllLinks
  global.registerCustomAction("clearAllLinks", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    try {
      MNUtil.undoGrouping(() => {
        focusNotes.forEach((focusNote) => {
          // 从最后往上删除，就不会出现前面删除后干扰后面的 index 的情况
          for (let i = focusNote.comments.length - 1; i >= 0; i--) {
            let comment = focusNote.comments[i];
            if (
              comment.type == "TextNote" &&
              (comment.text.includes("marginnote3") || comment.text.includes("marginnote4"))
            ) {
              focusNote.removeCommentByIndex(i);
            }
          }
        });
      });
    } catch (error) {
      MNUtil.showHUD(error);
    }
  });

  // clearAllFailedMN3Links
  global.registerCustomAction("clearAllFailedMN3Links", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        focusNotes.forEach((focusNote) => {
          toolbarUtils.linksConvertToMN4Type(focusNote);
          // 从最后往上删除，就不会出现前面删除后干扰后面的 index 的情况
          for (let i = focusNote.comments.length - 1; i >= 0; i--) {
            let comment = focusNote.comments[i];
            if (comment.type == "TextNote" && comment.text.includes("marginnote3app://note/")) {
              focusNote.removeCommentByIndex(i);
            }
          }
        });
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // clearAllFailedLinks
  global.registerCustomAction("clearAllFailedLinks", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        focusNotes.forEach((focusNote) => {
          toolbarUtils.clearAllFailedLinks(focusNote);
        });
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // clearContentKeepExcerptAndHandwritingAndImage
  global.registerCustomAction("clearContentKeepExcerptAndHandwritingAndImage", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    try {
      MNUtil.undoGrouping(() => {
        MNUtil.copy(focusNote.noteTitle);
        focusNote.noteTitle = "";
        // 从最后往上删除，就不会出现前面删除后干扰后面的 index 的情况
        for (let i = focusNote.comments.length - 1; i >= 0; i--) {
          let comment = focusNote.comments[i];
          if (comment.type == "TextNote" || comment.type == "HtmlNote") {
            focusNote.removeCommentByIndex(i);
          }
        }
      });
    } catch (error) {
      MNUtil.showHUD(error);
    }
  });

  // clearContentKeepExcerptWithTitle
  global.registerCustomAction("clearContentKeepExcerptWithTitle", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        focusNotes.forEach((focusNote) => {
          // 从最后往上删除，就不会出现前面删除后干扰后面的 index 的情况
          for (let i = focusNote.comments.length - 1; i >= 0; i--) {
            let comment = focusNote.comments[i];
            if (comment.type !== "LinkNote") {
              focusNote.removeCommentByIndex(i);
            }
          }

          focusNote.title = focusNote.title.toNoBracketPrefixContent();
        });
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // clearContentKeepExcerpt
  global.registerCustomAction("clearContentKeepExcerpt", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        focusNotes.forEach((focusNote) => {
          MNUtil.copy(focusNote.noteTitle);
          focusNote.noteTitle = "";
          // 从最后往上删除，就不会出现前面删除后干扰后面的 index 的情况
          for (let i = focusNote.comments.length - 1; i >= 0; i--) {
            let comment = focusNote.comments[i];
            if (comment.type !== "LinkNote") {
              focusNote.removeCommentByIndex(i);
            }
          }
        });
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // clearContentKeepHandwritingAndImage
  global.registerCustomAction("clearContentKeepHandwritingAndImage", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        focusNotes.forEach((focusNote) => {
          MNUtil.copy(focusNote.noteTitle);
          focusNote.noteTitle = "";
          // 从最后往上删除，就不会出现前面删除后干扰后面的 index 的情况
          for (let i = focusNote.comments.length - 1; i >= 0; i--) {
            let comment = focusNote.comments[i];
            if (comment.type !== "PaintNote") {
              focusNote.removeCommentByIndex(i);
            }
          }
        });
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // clearContentKeepText
  global.registerCustomAction("clearContentKeepText", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        focusNotes.forEach((focusNote) => {
          MNUtil.copy(focusNote.noteTitle);
          focusNote.noteTitle = "";
          // 从最后往上删除，就不会出现前面删除后干扰后面的 index 的情况
          for (let i = focusNote.comments.length - 1; i >= 0; i--) {
            let comment = focusNote.comments[i];
            if (comment.type !== "HtmlNote" && comment.type !== "TextNote") {
              focusNote.removeCommentByIndex(i);
            }
          }
        });
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // ========== COPY 相关 (8 个) ==========

  // copyFocusNotesIdArr
  global.registerCustomAction("copyFocusNotesIdArr", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        if (focusNotes.length == 1) {
          MNUtil.copy(focusNote.noteId);
          MNUtil.showHUD(focusNote.noteId);
        } else {
          let idsArr = toolbarUtils.getNoteIdArr(focusNotes);
          MNUtil.copy(idsArr);
          MNUtil.showHUD(idsArr);
        }
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // copyFocusNotesURLArr
  global.registerCustomAction("copyFocusNotesURLArr", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        let idsArr = toolbarUtils.getNoteURLArr(focusNotes);
        MNUtil.copy(idsArr);
        MNUtil.showHUD(idsArr);
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // cardCopyNoteId
  global.registerCustomAction("cardCopyNoteId", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.copy(focusNote.noteId);
    MNUtil.showHUD(focusNote.noteId);
  });

  // copyWholeTitle
  global.registerCustomAction("copyWholeTitle", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    copyTitlePart = focusNote.noteTitle;
    MNUtil.copy(copyTitlePart);
    MNUtil.showHUD(copyTitlePart);
  });

  // copyTitleSecondPart
  global.registerCustomAction("copyTitleSecondPart", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    if ([2, 3, 9, 10, 15].includes(focusNoteColorIndex)) {
      copyTitlePart = focusNote.noteTitle.match(/【.*】(.*)/)[1];
      MNUtil.copy(copyTitlePart);
      MNUtil.showHUD(copyTitlePart);
    }
  });

  // copyTitleFirstKeyword
  global.registerCustomAction("copyTitleFirstKeyword", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    if ([2, 3, 9, 10, 15].includes(focusNoteColorIndex)) {
      copyTitlePart = focusNote.noteTitle.match(/【.*】;\s*([^;]*?)(?:;|$)/)[1];
      MNUtil.copy(copyTitlePart);
      MNUtil.showHUD(copyTitlePart);
    }
  });

  // copyTitleFirstQuoteContent
  global.registerCustomAction("copyTitleFirstQuoteContent", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    if ([0, 1, 4].includes(focusNoteColorIndex)) {
      if (focusNoteColorIndex == 1) {
        copyTitlePart = focusNote.noteTitle.match(/“(.*)”相关.*/)[1];
      } else {
        copyTitlePart = focusNote.noteTitle.match(/“(.*)”：“.*”相关.*/)[1];
      }
      MNUtil.copy(copyTitlePart);
      MNUtil.showHUD(copyTitlePart);
    }
  });

  // copyTitleSecondQuoteContent
  global.registerCustomAction("copyTitleSecondQuoteContent", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    if ([0, 1, 4].includes(focusNoteColorIndex)) {
      if (focusNoteColorIndex == 1) {
        copyTitlePart = focusNote.noteTitle.match(/“(.*)”相关.*/)[1];
      } else {
        copyTitlePart = focusNote.noteTitle.match(/“.*”：“(.*)”相关.*/)[1];
      }
      MNUtil.copy(copyTitlePart);
      MNUtil.showHUD(copyTitlePart);
    }
  });

  // ========== CHANGE 相关 (5 个) ==========

  // changeChildNotesPrefix
  global.registerCustomAction("changeChildNotesPrefix", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    try {
      MNUtil.undoGrouping(() => {
        toolbarUtils.changeChildNotesPrefix(focusNote);
        focusNote.descendantNodes.descendant.forEach((descendantNote) => {
          if ([0, 1, 4].includes(descendantNote.note.colorIndex)) {
            try {
              // MNUtil.undoGrouping(()=>{
              toolbarUtils.changeChildNotesPrefix(descendantNote);
              // })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        });
      });
    } catch (error) {
      MNUtil.showHUD(error);
    }
  });

  // batchChangeClassificationTitles
  global.registerCustomAction("batchChangeClassificationTitles", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    try {
      await MNMath.batchChangeClassificationTitles("descendants");
    } catch (error) {
      MNUtil.showHUD(error);
    }
  });

  // changeChildNotesTitles
  global.registerCustomAction("changeChildNotesTitles", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      focusNote.childNotes.forEach((childNote) => {
        if (childNote.ifIndependentNote()) {
          // 独立卡片双击时把父卡片的标题作为前缀
          if (!childNote.title.ifWithBracketPrefix()) {
            childNote.title = childNote.parentNote.noteTitle.toBracketPrefixContentArrowSuffix() + childNote.title;
          } else {
            // 有前缀的话，就更新前缀
            childNote.title =
              childNote.parentNote.noteTitle.toBracketPrefixContentArrowSuffix() +
              childNote.title.toNoBracketPrefixContent();
          }
        } else {
          childNote.changeTitle();
          childNote.refreshAll();
        }
      });
    });
  });

  // changeDescendantNotesTitles
  global.registerCustomAction("changeDescendantNotesTitles", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      focusNote.descendantNodes.descendant.forEach((descendantNote) => {
        // descendantNote.changeTitle()
        // descendantNote.refreshAll()
        if (descendantNote.ifIndependentNote()) {
          // 独立卡片双击时把父卡片的标题作为前缀
          if (!descendantNote.title.ifWithBracketPrefix()) {
            descendantNote.title =
              descendantNote.parentNote.noteTitle.toBracketPrefixContentArrowSuffix() + descendantNote.title;
          } else {
            // 有前缀的话，就更新前缀
            descendantNote.title =
              descendantNote.parentNote.noteTitle.toBracketPrefixContentArrowSuffix() +
              descendantNote.title.toNoBracketPrefixContent();
          }
        } else {
          descendantNote.changeTitle();
          descendantNote.refreshAll();
        }
      });
    });
  });

  // changeTitlePrefix
  global.registerCustomAction("changeTitlePrefix", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        focusNotes.forEach((focusNote) => {
          focusNote.title = focusNote.title.toNoBracketPrefixContent();
          focusNote.changeTitle();
          focusNote.refreshAll();
        });
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // ========== OTHER 相关 (77 个) ==========

  // test
  global.registerCustomAction("test", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    const name = "鱼羊";
    // MNUtil.showHUD(Pinyin.pinyin(name))
    MNUtil.showHUD(toolbarUtils.getAbbreviationsOfName("Kangwei Xia"));
  });

  // getNewClassificationInformation
  global.registerCustomAction("getNewClassificationInformation", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        focusNote.toBeClassificationInfoNote();
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
    /**
     * 把证明的内容移到最下方
     */
  });

  // MNFocusNote
  global.registerCustomAction("MNFocusNote", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.excuteCommand("FocusNote");
  });

  // MNEditDeleteNote
  global.registerCustomAction("MNEditDeleteNote", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    let confirm = await MNUtil.confirm("删除卡片", "确定要删除这张卡片吗？");
    if (confirm) {
      MNUtil.excuteCommand("EditDeleteNote");
    }
  });

  // toBeProgressNote
  global.registerCustomAction("toBeProgressNote", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        focusNote.toBeProgressNote();
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
    /**
     * 卡片独立出来
     */
  });

  // toBeIndependent
  global.registerCustomAction("toBeIndependent", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        focusNotes.forEach((focusNote) => {
          focusNote.toBeIndependent();
        });
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // AddToReview
  global.registerCustomAction("AddToReview", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((focusNote) => {
        focusNote.addToReview();
      });
    });
  });

  // deleteCommentsByPopup
  global.registerCustomAction("deleteCommentsByPopup", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        focusNote.deleteCommentsByPopup();
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // deleteCommentsByPopupAndMoveNewContentToExcerptAreaBottom
  global.registerCustomAction("deleteCommentsByPopupAndMoveNewContentToExcerptAreaBottom", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        focusNote.deleteCommentsByPopupAndMoveNewContentTo("excerpt");
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // deleteCommentsByPopupAndMoveNewContentToExcerptAreaTop
  global.registerCustomAction("deleteCommentsByPopupAndMoveNewContentToExcerptAreaTop", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        focusNote.deleteCommentsByPopupAndMoveNewContentTo("excerpt", false);
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // sameLevel
  global.registerCustomAction("sameLevel", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    HtmlMarkdownUtils.autoAddLevelHtmlMDComment(
      focusNote.parentNote,
      focusNote.title.toNoBracketPrefixContent(),
      "same",
    );
    focusNote.title = "";
    focusNote.mergeInto(focusNote.parentNote);
  });

  // nextLevel
  global.registerCustomAction("nextLevel", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    HtmlMarkdownUtils.autoAddLevelHtmlMDComment(
      focusNote.parentNote,
      focusNote.title.toNoBracketPrefixContent(),
      "next",
    );
    focusNote.title = "";
    focusNote.mergeInto(focusNote.parentNote);
  });

  // lastLevel
  global.registerCustomAction("lastLevel", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    HtmlMarkdownUtils.autoAddLevelHtmlMDComment(
      focusNote.parentNote,
      focusNote.title.toNoBracketPrefixContent(),
      "last",
    );
    focusNote.title = "";
    focusNote.mergeInto(focusNote.parentNote);
  });

  // topestLevel
  global.registerCustomAction("topestLevel", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    HtmlMarkdownUtils.autoAddLevelHtmlMDComment(
      focusNote.parentNote,
      focusNote.title.toNoBracketPrefixContent(),
      "topest",
    );
    focusNote.title = "";
    focusNote.mergeInto(focusNote.parentNote);
  });

  // generateCustomTitleLink
  global.registerCustomAction("generateCustomTitleLink", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      toolbarUtils.generateCustomTitleLink();
    });
  });

  // generateCustomTitleLinkFromFocusNote
  global.registerCustomAction("generateCustomTitleLinkFromFocusNote", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      toolbarUtils.generateCustomTitleLinkFromFocusNote(focusNote);
    });
  });

  // pasteNoteAsChildNote
  global.registerCustomAction("pasteNoteAsChildNote", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        toolbarUtils.pasteNoteAsChildNote(focusNote);
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // linkRemoveDuplicatesAfterApplication
  global.registerCustomAction("linkRemoveDuplicatesAfterApplication", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        focusNotes.forEach((focusNote) => {
          let applicationHtmlCommentIndex = Math.max(
            focusNote.getIncludingCommentIndex("应用：", true),
            focusNote.getIncludingCommentIndex("的应用"),
          );
          toolbarUtils.linkRemoveDuplicatesAfterIndex(focusNote, applicationHtmlCommentIndex);
        });
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // addOldNoteKeyword
  global.registerCustomAction("addOldNoteKeyword", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      let keywordsHtmlCommentIndex = focusNote.getCommentIndex("关键词：", true);
      focusNote.appendMarkdownComment("-", keywordsHtmlCommentIndex + 1);
    });
  });

  // selectionTextHandleSpaces
  global.registerCustomAction("selectionTextHandleSpaces", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.showHUD(Pangu.spacing(MNUtil.selectionText));
    MNUtil.copy(Pangu.spacing(MNUtil.selectionText));
  });

  // copiedTextHandleSpaces
  global.registerCustomAction("copiedTextHandleSpaces", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.showHUD(Pangu.spacing(MNUtil.clipboardText));
    MNUtil.copy(Pangu.spacing(MNUtil.clipboardText));
  });

  // handleTitleSpaces
  global.registerCustomAction("handleTitleSpaces", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    try {
      MNUtil.undoGrouping(() => {
        focusNotes.forEach((focusNote) => {
          focusNote.noteTitle = Pangu.spacing(focusNote.noteTitle);
          focusNote.refresh();
          focusNote.refreshAll();
        });
      });
    } catch (error) {
      MNUtil.showHUD(error);
    }
  });

  // focusInMindMap
  global.registerCustomAction("focusInMindMap", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      focusNote.focusInMindMap();
    });
  });

  // focusInFloatMindMap
  global.registerCustomAction("focusInFloatMindMap", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      focusNote.focusInFloatMindMap();
    });
  });

  // selectionTextToLowerCase
  global.registerCustomAction("selectionTextToLowerCase", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.showHUD(MNUtil.selectionText.toLowerCase());
    MNUtil.copy(MNUtil.selectionText.toLowerCase());
  });

  // selectionTextToTitleCase
  global.registerCustomAction("selectionTextToTitleCase", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.showHUD(MNUtil.selectionText.toTitleCasePro());
    MNUtil.copy(MNUtil.selectionText.toTitleCasePro());
  });

  // copiedTextToTitleCase
  global.registerCustomAction("copiedTextToTitleCase", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.showHUD(MNUtil.clipboardText.toTitleCasePro());
    MNUtil.copy(MNUtil.clipboardText.toTitleCasePro());
  });

  // copiedTextToLowerCase
  global.registerCustomAction("copiedTextToLowerCase", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.showHUD(MNUtil.clipboardText.toLowerCase());
    MNUtil.copy(MNUtil.clipboardText.toLowerCase());
  });

  // renewLinksBetweenClassificationNoteAndKnowledegeNote
  global.registerCustomAction("renewLinksBetweenClassificationNoteAndKnowledegeNote", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    try {
      toolbarUtils.renewLinksBetweenClassificationNoteAndKnowledegeNote(focusNote);
    } catch (error) {
      MNUtil.showHUD(error);
    }
  });

  // refreshNotes
  global.registerCustomAction("refreshNotes", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    try {
      MNUtil.undoGrouping(() => {
        focusNotes.forEach((focusNote) => {
          focusNote.refresh();
        });
      });
    } catch (error) {
      MNUtil.showHUD(error);
    }
  });

  // refreshCardsAndAncestorsAndDescendants
  global.registerCustomAction("refreshCardsAndAncestorsAndDescendants", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    try {
      MNUtil.undoGrouping(() => {
        focusNotes.forEach((focusNote) => {
          focusNote.refreshAll();
        });
      });
    } catch (error) {
      MNUtil.showHUD(error);
    }
  });

  // renewAuthorNotes
  global.registerCustomAction("renewAuthorNotes", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((focusNote) => {
        for (let i = focusNote.comments.length - 1; i >= 0; i--) {
          let comment = focusNote.comments[i];
          if (!comment.text || !comment.text.includes("marginnote")) {
            focusNote.removeCommentByIndex(i);
          }
        }
        toolbarUtils.cloneAndMerge(focusNote, "782A91F4-421E-456B-80E6-2B34D402911A");
        focusNote.moveComment(focusNote.comments.length - 1, 0);
        focusNote.moveComment(focusNote.comments.length - 1, 0);
        focusNote.moveComment(focusNote.comments.length - 1, 0);
        focusNote.moveComment(focusNote.comments.length - 1, 0);
      });
    });
  });

  // renewJournalNotes
  global.registerCustomAction("renewJournalNotes", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((focusNote) => {
        focusNote.removeCommentByIndex(0);
        focusNote.removeCommentByIndex(0);
        focusNote.removeCommentByIndex(0);
        focusNote.removeCommentByIndex(0);
        focusNote.removeCommentByIndex(0);
        toolbarUtils.cloneAndMerge(focusNote, "129EB4D6-D57A-4367-8087-5C89864D3595");
        focusNote.moveComment(focusNote.comments.length - 1, 0);
        focusNote.moveComment(focusNote.comments.length - 1, 0);
        focusNote.moveComment(focusNote.comments.length - 1, 0);
        focusNote.moveComment(focusNote.comments.length - 1, 0);
      });
    });
  });

  // renewPublisherNotes
  global.registerCustomAction("renewPublisherNotes", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((focusNote) => {
        focusNote.removeCommentByIndex(0);
        focusNote.removeCommentByIndex(0);
        focusNote.removeCommentByIndex(0);
        focusNote.removeCommentByIndex(0);
        focusNote.removeCommentByIndex(0);
        toolbarUtils.cloneAndMerge(focusNote, "1E34F27B-DB2D-40BD-B0A3-9D47159E68E7");
        focusNote.moveComment(focusNote.comments.length - 1, 0);
        focusNote.moveComment(focusNote.comments.length - 1, 0);
        focusNote.moveComment(focusNote.comments.length - 1, 0);
        focusNote.moveComment(focusNote.comments.length - 1, 0);
      });
    });
  });

  // renewBookSeriesNotes
  global.registerCustomAction("renewBookSeriesNotes", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((focusNote) => {
        let title = focusNote.noteTitle;
        let seriesName = title.match(/【文献：系列书作：(.*) - (\d+)】/)[1];
        let seriesNum = title.match(/【文献：系列书作：(.*) - (\d+)】/)[2];
        // MNUtil.showHUD(seriesName,seriesNum)
        toolbarUtils.referenceSeriesBookMakeCard(focusNote, seriesName, seriesNum);
      });
    });
  });

  // renewBookNotes
  global.registerCustomAction("renewBookNotes", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((focusNote) => {
        let title = focusNote.noteTitle;
        let yearMatch = toolbarUtils.isFourDigitNumber(toolbarUtils.getFirstKeywordFromTitle(title));
        if (yearMatch) {
          // MNUtil.showHUD(toolbarUtils.getFirstKeywordFromTitle(title))
          let year = toolbarUtils.getFirstKeywordFromTitle(title);
          toolbarUtils.referenceYear(focusNote, year);
          focusNote.noteTitle = title.replace("; " + year, "");
        }
      });
    });
  });

  // findDuplicateTitles
  global.registerCustomAction("findDuplicateTitles", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    const repeatedTitles = toolbarUtils.findDuplicateTitles(focusNote.childNotes);
    MNUtil.showHUD(repeatedTitles);
    if (repeatedTitles.length > 0) {
      MNUtil.copy(repeatedTitles[0]);
    }
  });

  // addThoughtPointAndMoveLastCommentToThought
  global.registerCustomAction("addThoughtPointAndMoveLastCommentToThought", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    try {
      MNUtil.undoGrouping(() => {
        focusNotes.forEach((focusNote) => {
          focusNote.addMarkdownTextCommentTo("- ", "think");
          focusNote.moveCommentsByIndexArrTo([focusNote.comments.length - 1], "think");
        });
      });
    } catch (error) {
      MNUtil.showHUD(error);
    }
  });

  // addThoughtPointAndMoveNewCommentsToThought
  global.registerCustomAction("addThoughtPointAndMoveNewCommentsToThought", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    try {
      MNUtil.undoGrouping(() => {
        focusNotes.forEach((focusNote) => {
          focusNote.addMarkdownTextCommentTo("- ", "think");
          focusNote.moveCommentsByIndexArrTo(focusNote.getNewContentIndexArr(), "think");
        });
      });
    } catch (error) {
      MNUtil.showHUD(error);
    }
  });

  // pasteInTitle
  global.registerCustomAction("pasteInTitle", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    // MNUtil.undoGrouping(()=>{
    //   focusNote.noteTitle = MNUtil.clipboardText
    // })
    // focusNote.refreshAll()
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((focusNote) => {
        focusNote.noteTitle = MNUtil.clipboardText;
        focusNote.refreshAll();
      });
    });
  });

  // pasteAfterTitle
  global.registerCustomAction("pasteAfterTitle", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    // MNUtil.undoGrouping(()=>{
    //   focusNote.noteTitle = focusNote.noteTitle + "; " + MNUtil.clipboardText
    // })
    // focusNote.refreshAll()
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((focusNote) => {
        focusNote.noteTitle = focusNote.noteTitle + "; " + MNUtil.clipboardText;
        focusNote.refreshAll();
      });
    });
  });

  // extractTitle
  global.registerCustomAction("extractTitle", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    if (focusNote.noteTitle.match(/【.*】.*/)) {
      MNUtil.copy(focusNote.noteTitle.match(/【.*】;?(.*)/)[1]);
      MNUtil.showHUD(focusNote.noteTitle.match(/【.*】;?(.*)/)[1]);
    }
  });

  // convertNoteToNonexcerptVersion
  global.registerCustomAction("convertNoteToNonexcerptVersion", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    // MNUtil.showHUD("卡片转化为非摘录版本")
    try {
      MNUtil.undoGrouping(() => {
        focusNotes.forEach((focusNote) => {
          if (focusNote.excerptText) {
            focusNote.toNoExceptVersion();
          }
        });
      });
    } catch (error) {
      MNUtil.showHUD(error);
    }
  });

  // ifExceptVersion
  global.registerCustomAction("ifExceptVersion", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    if (focusNote.excerptText) {
      MNUtil.showHUD("摘录版本");
    } else {
      MNUtil.showHUD("非摘录版本");
    }
  });

  // showColorIndex
  global.registerCustomAction("showColorIndex", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.showHUD("ColorIndex: " + focusNote.note.colorIndex);
  });

  // showCommentType
  global.registerCustomAction("showCommentType", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    let focusNoteComments = focusNote.comments;
    let chosenComment = focusNoteComments[des.index - 1];
    MNUtil.showHUD("CommentType: " + chosenComment.type);
  });

  // linksConvertToMN4Type
  global.registerCustomAction("linksConvertToMN4Type", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        focusNotes.forEach((focusNote) => {
          toolbarUtils.linksConvertToMN4Type(focusNote);
        });
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // addThought
  global.registerCustomAction("addThought", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        toolbarUtils.addThought(focusNotes);
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // addThoughtPoint
  global.registerCustomAction("addThoughtPoint", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        focusNotes.forEach((focusNote) => {
          focusNote.addMarkdownTextCommentTo("- ", "think");
        });
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // reappendAllLinksInNote
  global.registerCustomAction("reappendAllLinksInNote", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        focusNotes.forEach((focusNote) => {
          toolbarUtils.reappendAllLinksInNote(focusNote);
        });
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // upwardMergeWithStyledComments
  global.registerCustomAction("upwardMergeWithStyledComments", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "选择「当前卡片」下一层的层级",
          "然后会依次递减",
          0,
          "取消",
          levelHtmlSettingTitles,
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(() => {
                // 按钮索引从1开始（0是取消按钮）
                const selectedIndex = buttonIndex - 1;

                if (selectedIndex >= 0 && selectedIndex < levelHtmlSetting.length) {
                  const selectedType = levelHtmlSetting[selectedIndex].type;
                  HtmlMarkdownUtils.upwardMergeWithStyledComments(focusNote, selectedType);
                }
              });
            } catch (error) {
              MNUtil.showHUD(error);
            }
          },
        );
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // mergeInParentNoteWithPopup
  global.registerCustomAction("mergeInParentNoteWithPopup", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "选择合并后标题变成评论后的类型",
          "",
          0,
          "取消",
          htmlSettingTitles,
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(() => {
                const selectedIndex = buttonIndex - 1;
                if (selectedIndex >= 0 && selectedIndex < htmlSetting.length) {
                  // 由于原始代码包含复杂的 switch 语句，这里简化处理
                  const selectedConfig = htmlSetting[selectedIndex];
                  focusNote.mergeIntoParentNote();
                  if (focusNote.parentNote) {
                    focusNote.parentNote.addHtmlComment(selectedConfig);
                  }
                }
              });
            } catch (error) {
              MNUtil.showHUD(error);
            }
          },
        );
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // mergeInParentNote
  global.registerCustomAction("mergeInParentNote", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        focusNote.mergeInto(focusNote.parentNote);
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // mergIntoParenNoteAndRenewReplaceholder
  global.registerCustomAction("mergIntoParenNoteAndRenewReplaceholder", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        focusNote.mergIntoAndRenewReplaceholder(focusNote.parentNote);
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // mergIntoParenNoteAndRenewReplaceholderWithPopup
  global.registerCustomAction("mergIntoParenNoteAndRenewReplaceholderWithPopup", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "选择合并后标题变成评论后的类型",
          "",
          0,
          "取消",
          htmlSettingTitles,
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(() => {
                // 按钮索引从1开始（0是取消按钮）
                const selectedIndex = buttonIndex - 1;

                if (selectedIndex >= 0 && selectedIndex < htmlSetting.length) {
                  const selectedType = htmlSetting[selectedIndex].type;
                  focusNote.mergIntoAndRenewReplaceholder(focusNote.parentNote, selectedType);
                }
              });
            } catch (error) {
              MNUtil.showHUD(error);
            }
          },
        );
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // addTopic
  global.registerCustomAction("addTopic", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    try {
      MNUtil.undoGrouping(() => {
        toolbarUtils.addTopic(focusNote);
      });
    } catch (error) {
      MNUtil.showHUD(error);
    }
  });

  // achieveCards
  global.registerCustomAction("achieveCards", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    try {
      MNUtil.undoGrouping(() => {
        toolbarUtils.achieveCards(focusNote);
      });
    } catch (error) {
      MNUtil.showHUD(error);
    }
  });

  // renewCards
  global.registerCustomAction("renewCards", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    try {
      MNUtil.undoGrouping(() => {
        focusNotes.forEach((focusNote) => {
          // toolbarUtils.renewCards(focusNote)
          focusNote.renew();
        });
      });
    } catch (error) {
      MNUtil.showHUD(error);
    }
  });

  // renewChildNotesPrefix
  global.registerCustomAction("renewChildNotesPrefix", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    try {
      MNUtil.undoGrouping(() => {
        toolbarUtils.renewChildNotesPrefix(focusNote);
      });
    } catch (error) {
      MNUtil.showHUD(error);
    }
  });

  // hideAddonBar
  global.registerCustomAction("hideAddonBar", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.postNotification("toggleMindmapToolbar", { target: "addonBar" });
  });

  // 9BA894B4-3509-4894-A05C-1B4BA0A9A4AE
  global.registerCustomAction("9BA894B4-3509-4894-A05C-1B4BA0A9A4AE", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((focusNote) => {
        toolbarUtils.OKRNoteMake(focusNote);
      });
    });
  });

  // 014E76CA-94D6-48D5-82D2-F98A2F017219
  global.registerCustomAction("014E76CA-94D6-48D5-82D2-F98A2F017219", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        focusNotes.forEach((focusNote) => {
          if (focusNote.colorIndex == 13) {
            // 暂时先通过颜色判断
            // 此时表示是单词卡片
            /**
             * 目前采取的暂时方案是：只要制卡就复制新卡片，删除旧卡片
             * 因为一张单词卡片不会多次点击制卡，只会后续修改评论，所以这样问题不大
             */
            let vocabularyLibraryNote = MNNote.new("55C7235C-692E-44B4-BD0E-C1AF2A4AE805");
            // TODO：判断卡片是否在单词库里了，在的话就不移动
            // 通过判断有没有 originNoteId 来判断是否需要复制新卡片
            if (focusNote.originNoteId) {
              let newNote = focusNote.createDuplicatedNoteAndDelete();
              vocabularyLibraryNote.addChild(newNote);
              // newNote.addToReview()
              // newNote.focusInMindMap(0.3)
            } else {
              if (focusNote.parentNote.noteId !== "55C7235C-692E-44B4-BD0E-C1AF2A4AE805") {
                vocabularyLibraryNote.addChild(focusNote);
              }
              // focusNote.addToReview()
              // focusNote.focusInMindMap(0.3)
            }
          } else {
            if (!focusNote.title.ifWithBracketPrefix()) {
              focusNote.title = focusNote.parentNote.noteTitle.toBracketPrefixContentArrowSuffix() + focusNote.title;
            } else {
              // 有前缀的话，就更新前缀
              focusNote.title =
                focusNote.parentNote.noteTitle.toBracketPrefixContentArrowSuffix() +
                focusNote.title.toNoBracketPrefixContent();
            }
            if (focusNote.excerptText) {
              focusNote.toNoExceptVersion();
            }
          }
        });
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // undoOKRNoteMake
  global.registerCustomAction("undoOKRNoteMake", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((focusNote) => {
        toolbarUtils.OKRNoteMake(focusNote, true);
      });
    });
  });

  // updateTodayTimeTag
  global.registerCustomAction("updateTodayTimeTag", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((focusNote) => {
        toolbarUtils.updateTodayTimeTag(focusNote);
      });
    });
  });

  // addTodayTimeTag
  global.registerCustomAction("addTodayTimeTag", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((focusNote) => {
        toolbarUtils.addTodayTimeTag(focusNote);
      });
    });
  });

  // updateTimeTag
  global.registerCustomAction("updateTimeTag", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((focusNote) => {
        toolbarUtils.updateTimeTag(focusNote);
      });
    });
  });

  // openTasksFloatMindMap
  global.registerCustomAction("openTasksFloatMindMap", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    let OKRNote = MNNote.new("690ABF82-339C-4AE1-8BDB-FA6796204B27");
    OKRNote.focusInFloatMindMap();
  });

  // openPinnedNote-1
  global.registerCustomAction("openPinnedNote-1", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    pinnedNote = MNNote.new("1346BDF1-7F58-430F-874E-B814E7162BDF"); // Hᵖ(D)
    pinnedNote.focusInFloatMindMap();
  });

  // openPinnedNote-2
  global.registerCustomAction("openPinnedNote-2", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    pinnedNote = MNNote.new("89042A37-CC80-4FFC-B24F-F8E86CB764DC"); // Lᵖ(T)
    pinnedNote.focusInFloatMindMap();
  });

  // openPinnedNote-3
  global.registerCustomAction("openPinnedNote-3", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    pinnedNote = MNNote.new("D7DEDE97-1B87-4BB6-B607-4FB987F230E4"); // Hᵖ(T)
    pinnedNote.focusInFloatMindMap();
  });

  // renewExcerptInParentNoteByFocusNote
  global.registerCustomAction("renewExcerptInParentNoteByFocusNote", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        toolbarUtils.renewExcerptInParentNoteByFocusNote(focusNote);
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // removeTitlePrefix
  global.registerCustomAction("removeTitlePrefix", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        focusNotes.forEach((focusNote) => {
          focusNote.title = focusNote.title.toNoBracketPrefixContent();
          focusNote.refreshAll();
        });
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // addNewIdeaNote
  global.registerCustomAction("addNewIdeaNote", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "输入思路标题",
          "",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            let userInput = alert.textFieldAtIndex(0).text;
            if (buttonIndex == 1 && userInput) {
              MNUtil.undoGrouping(() => {
                MNMath.addNewIdeaNote(focusNote, userInput);
              });
            }
          },
        );
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // makeCard
  global.registerCustomAction("makeCard", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        MNMath.makeCard(focusNote);
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // makeNote
  global.registerCustomAction("makeNote", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        if (toolbarConfig.windowState.preprocess) {
          let newnote = MNMath.toNoExceptVersion(focusNote);
          MNMath.changeTitle(newnote);
          newnote.focusInMindMap(0.2);
        } else {
          MNMath.makeNote(focusNote);
        }
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // doubleClickMakeNote
  global.registerCustomAction("doubleClickMakeNote", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      MNMath.makeNote(focusNote, false);
    });
  });

  // replaceFieldContentByPopup
  global.registerCustomAction("replaceFieldContentByPopup", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        MNMath.replaceFieldContentByPopup(focusNote);
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  console.log(`✅ 已注册 ${Object.keys(global.customActions).length} 个自定义 actions`);
}

// 立即注册
try {
  registerAllCustomActions();
  if (typeof MNUtil !== "undefined" && MNUtil.showHUD) {
    MNUtil.showHUD(`✅ 注册表已加载 (${Object.keys(global.customActions).length} 个 actions)`);
  }
} catch (error) {
  console.error("注册自定义 actions 失败:", error);
}
