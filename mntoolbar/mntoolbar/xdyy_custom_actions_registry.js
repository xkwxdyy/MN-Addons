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
      await global.customActions[actionName](context);
      return true;
    } catch (error) {
      MNUtil.showHUD(`执行失败: ${error.message || error}`);
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
    { title: "CHECK: 🔍", type: "check" },
    { title: "方法: ✔", type: "method" },
    { title: "目标: 🎯", type: "goal" },
    { title: "level1: 🚩", type: "level1" },
    { title: "level2: ▸", type: "level2" },
    { title: "level3: ▪", type: "level3" },
    { title: "level4: •", type: "level4" },
    { title: "level5: ·", type: "level5" },
    { title: "关键: 🔑", type: "key" },
    { title: "问题: ❓", type: "question" },
    { title: "注: 📝", type: "remark" },
    { title: "注意: ⚠️", type: "alert" },
    { title: "特别注意: ❗❗❗", type: "danger" }
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
  // referenceStoreIdsForCurrentDoc
  // referenceStoreIdsForCurrentDocFromClipboard
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
  // referenceMoveLastTwoCommentsToThought
  // referenceAddThoughtPointAndMoveLastCommentToThought
  // referenceAddThoughtPoint
  // referenceMoveUpThoughtPoints
  // ========== PROOF 相关 (20 个) ==========

  // moveProofDown
  // moveLastCommentToProofStart
  // moveProofToStart
  // renewProofContentPoints
  // renewProofContentPointsToSubpointType
  // htmlCommentToProofTop
  // htmlCommentToProofFromClipboard
  // htmlCommentToProofBottom
  // addProofToStartFromClipboard
  // addProofFromClipboard
  // proofAddMethodComment
  // proofAddNewAntiexampleWithComment
  // proofAddNewMethodWithComment
  // proofAddNewAntiexample
  // proofAddNewMethod
  // moveLastLinkToProof
  // moveLastCommentToProof
  // moveLastTwoCommentsToProof
  // renewProof
  // moveProofToMethod
  // ========== TEMPLATE 相关 (6 个) ==========

  // addTemplate
  // mergeTemplateNotes
  // multiTemplateMakeNotes
  // TemplateMakeNotes
  // TemplateMakeChildNotes
  // TemplateMakeDescendantNotes
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
            // 按钮索引从1开始（0是取消按钮）
            const selectedIndex = buttonIndex - 1;
            if (selectedIndex >= 0 && selectedIndex < htmlSetting.length) {
              focusNote.appendMarkdownComment(HtmlMarkdownUtils.createHtmlMarkdownText(inputCommentText, htmlSetting[selectedIndex].type));
            }
          } catch (error) {
            MNUtil.showHUD(error);
          }
        });
      },
    );
  });

  // addProofCheckComment
  global.registerCustomAction("addProofCheckComment", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
      try {
        MNUtil.undoGrouping(() => {
        // 直接调用原生 API，绕过 MNNote 的空值检查
        const htmlContent = HtmlMarkdownUtils.createHtmlMarkdownText(undefined, "check");
        if (htmlContent) {
          focusNote.note.appendMarkdownComment(htmlContent);
        }  
        MNUtil.log(htmlContent)
      });
      } catch (error) {
        MNUtil.showHUD("添加CHECK评论失败: " + error);
      }
    });

  // ocrAsProofTitle - OCR 识别设置为标题
  global.registerCustomAction("ocrAsProofTitle", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    try {
      // 检查是否有 focusNote
      if (!focusNote) {
        MNUtil.showHUD("请先选择一个笔记");
        return;
      }
      
      // 获取图片数据
      let imageData = MNUtil.getDocImage(true, true);
      if (!imageData && focusNote) {
        imageData = MNNote.getImageFromNote(focusNote);
      }
      if (!imageData) {
        MNUtil.showHUD("未找到可识别的图片");
        return;
      }
      
      // OCR 源选项配置
      const ocrSources = [
        { name: "Doc2X - 专业文档识别", source: "Doc2X" },
        { name: "SimpleTex - 数学公式", source: "SimpleTex" },
        { name: "GPT-4o - OpenAI 视觉", source: "GPT-4o" },
        { name: "GPT-4o mini", source: "GPT-4o-mini" },
        { name: "glm-4v-plus - 智谱AI Plus", source: "glm-4v-plus" },
        { name: "glm-4v-flash - 智谱AI Flash", source: "glm-4v-flash" },
        { name: "Claude 3.5 Sonnet", source: "claude-3-5-sonnet-20241022" },
        { name: "Claude 3.7 Sonnet", source: "claude-3-7-sonnet" },
        { name: "Gemini 2.0 Flash - Google", source: "gemini-2.0-flash" },
        { name: "Moonshot-v1", source: "Moonshot-v1" },
        { name: "默认配置", source: "default" }
      ];
      
      // 显示 OCR 源选择对话框
      const sourceNames = ocrSources.map(s => s.name);
      const selectedIndex = await MNUtil.userSelect(
        "选择 OCR 源",
        "请选择要使用的识别引擎",
        sourceNames
      );
      
      // 处理用户取消
      if (selectedIndex === 0) {
        return;
      }
      
      const selectedOCR = ocrSources[selectedIndex - 1];
      MNUtil.showHUD(`正在使用 ${selectedOCR.name} 识别...`);
      
      // 执行 OCR
      let ocrResult;
      if (typeof ocrNetwork !== 'undefined') {
        // 使用 MNOCR 插件
        ocrResult = await ocrNetwork.OCR(imageData, selectedOCR.source, true);
      } else if (typeof toolbarUtils !== 'undefined') {
        // 使用免费 OCR（ChatGPT Vision - glm-4v-flash 模型）
        ocrResult = await toolbarUtils.freeOCR(imageData);
      } else {
        MNUtil.showHUD("请先安装 MN OCR 插件");
        return;
      }
      
      if (ocrResult) {
        MNUtil.undoGrouping(() => {
          // 将 OCR 结果设置为笔记标题
          focusNote.noteTitle = ocrResult.trim();
          MNUtil.showHUD("✅ 已设置为标题");
        });
        
        // 发送 OCR 完成通知（可选，用于其他插件集成）
        MNUtil.postNotification("OCRFinished", {
          action: "toTitle",
          noteId: focusNote.noteId,
          result: ocrResult
        });
      } else {
        MNUtil.showHUD("OCR 识别失败");
      }
      
    } catch (error) {
      MNUtil.showHUD("OCR 识别失败: " + error.message);
      if (typeof toolbarUtils !== 'undefined') {
        toolbarUtils.addErrorLog(error, "ocrAsProofTitle");
      }
    }
  });

  // ocrAsProofTitleWithTranslation - OCR 识别并翻译后设置为标题
  global.registerCustomAction("ocrAsProofTitleWithTranslation", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    try {
      // 检查是否有 focusNote
      if (!focusNote) {
        MNUtil.showHUD("请先选择一个笔记");
        return;
      }
      
      // 获取图片数据
      let imageData = MNUtil.getDocImage(true, true);
      if (!imageData && focusNote) {
        imageData = MNNote.getImageFromNote(focusNote);
      }
      if (!imageData) {
        MNUtil.showHUD("未找到可识别的图片");
        return;
      }
      
      // 使用配置的 OCR 源，默认为 Doc2X
      const ocrSource = toolbarConfig.ocrSource || toolbarConfig.defaultOCRSource || "Doc2X";
      
      // OCR 源名称映射
      const ocrSourceNames = {
        "Doc2X": "Doc2X - 专业文档识别",
        "SimpleTex": "SimpleTex - 数学公式",
        "GPT-4o": "GPT-4o - OpenAI 视觉",
        "GPT-4o-mini": "GPT-4o mini",
        "glm-4v-plus": "glm-4v-plus - 智谱AI Plus",
        "glm-4v-flash": "glm-4v-flash - 智谱AI Flash",
        "claude-3-5-sonnet-20241022": "Claude 3.5 Sonnet",
        "claude-3-7-sonnet": "Claude 3.7 Sonnet",
        "gemini-2.0-flash": "Gemini 2.0 Flash - Google",
        "Moonshot-v1": "Moonshot-v1"
      };
      
      const sourceName = ocrSourceNames[ocrSource] || ocrSource;
      MNUtil.showHUD(`正在使用 ${sourceName} 识别...`);
      
      // 执行 OCR
      let ocrResult;
      if (typeof ocrNetwork !== 'undefined') {
        // 使用 MNOCR 插件
        ocrResult = await ocrNetwork.OCR(imageData, ocrSource, true);
      } else if (typeof toolbarUtils !== 'undefined') {
        // 使用免费 OCR（ChatGPT Vision - glm-4v-flash 模型）
        ocrResult = await toolbarUtils.freeOCR(imageData);
      } else {
        MNUtil.showHUD("请先安装 MN OCR 插件");
        return;
      }
      
      if (ocrResult) {
        // 询问是否翻译
        const confirmTranslate = await MNUtil.confirm(
          "是否翻译为中文？",
          "OCR 识别完成:\n\n" + ocrResult.substring(0, 100) + (ocrResult.length > 100 ? "..." : "") + "\n\n是否将结果翻译为中文？"
        );
        
        if (confirmTranslate) {
          // 先设置 OCR 结果为标题
          MNUtil.undoGrouping(() => {
            focusNote.noteTitle = ocrResult.trim();
            MNUtil.showHUD("✅ 已设置 OCR 结果为标题，正在翻译...");
          });
          
          // 异步执行翻译
          (async () => {
            try {
              // 直接使用配置的默认翻译模型
              const selectedModel = toolbarConfig.translateModel || "gpt-4o-mini";
              
              MNUtil.showHUD(`正在使用 ${selectedModel} 翻译...`);
              
              // 执行翻译
              const translatedText = await toolbarUtils.ocrWithTranslation(ocrResult, selectedModel);
              
              MNUtil.undoGrouping(() => {
                // 将翻译结果更新到笔记标题
                focusNote.noteTitle = translatedText.trim();
                MNUtil.showHUD("✅ 翻译完成并更新标题");
              });
              
              // 发送 OCR 完成通知（可选，用于其他插件集成）
              MNUtil.postNotification("OCRFinished", {
                action: "toTitleWithTranslation",
                noteId: focusNote.noteId,
                originalResult: ocrResult,
                translatedResult: translatedText
              });
            } catch (translationError) {
              MNUtil.showHUD("翻译失败: " + translationError.message);
              if (typeof toolbarUtils !== 'undefined') {
                toolbarUtils.addErrorLog(translationError, "ocrAsProofTitleWithTranslation - translation");
              }
            }
          })();
        } else {
          // 用户选择不翻译，直接使用 OCR 结果
          MNUtil.undoGrouping(() => {
            focusNote.noteTitle = ocrResult.trim();
            MNUtil.showHUD("✅ 已设置为标题（未翻译）");
          });
        }
      } else {
        MNUtil.showHUD("OCR 识别失败");
      }
      
    } catch (error) {
      MNUtil.showHUD("OCR 翻译失败: " + error.message);
      if (typeof toolbarUtils !== 'undefined') {
        toolbarUtils.addErrorLog(error, "ocrAsProofTitleWithTranslation");
      }
    }
  });


  // ocrAllUntitledDescendants - 批量 OCR 无标题子孙卡片
  global.registerCustomAction("ocrAllUntitledDescendants", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    try {
      // 检查是否有 focusNote
      if (!focusNote) {
        MNUtil.showHUD("请先选择一个笔记");
        return;
      }
      
      // 获取所有子孙卡片
      const descendantData = focusNote.descendantNodes;
      const descendants = descendantData ? descendantData.descendant : [];
      
      // 创建包含选中卡片和所有子孙卡片的数组
      const allNotes = [focusNote, ...descendants];
      
      // 筛选无标题且有图片的卡片
      const untitledNotes = allNotes.filter(note => {
        // 检查是否无标题
        if (note.noteTitle && note.noteTitle.trim()) {
          return false;
        }
        // 检查是否有图片
        const imageData = MNNote.getImageFromNote(note);
        return imageData !== null && imageData !== undefined;
      });
      
      if (untitledNotes.length === 0) {
        MNUtil.showHUD("没有找到无标题且包含图片的子孙卡片");
        return;
      }
      
      // 确认操作
      const confirmed = await MNUtil.confirm(
        "批量 OCR 确认",
        `找到 ${untitledNotes.length} 个无标题卡片，是否进行 OCR 识别？`
      );
      
      if (!confirmed) {
        return;
      }
      
      // OCR 源选项配置（与单个 OCR 保持一致）
      const ocrSources = [
        { name: "Doc2X - 专业文档识别", source: "Doc2X" },
        { name: "SimpleTex - 数学公式", source: "SimpleTex" },
        { name: "GPT-4o - OpenAI 视觉", source: "GPT-4o" },
        { name: "GPT-4o mini", source: "GPT-4o-mini" },
        { name: "glm-4v-plus - 智谱AI Plus", source: "glm-4v-plus" },
        { name: "glm-4v-flash - 智谱AI Flash", source: "glm-4v-flash" },
        { name: "Claude 3.5 Sonnet", source: "claude-3-5-sonnet-20241022" },
        { name: "Claude 3.7 Sonnet", source: "claude-3-7-sonnet" },
        { name: "Gemini 2.0 Flash - Google", source: "gemini-2.0-flash" },
        { name: "Moonshot-v1", source: "Moonshot-v1" },
        { name: "默认配置", source: "default" }
      ];
      
      // 显示 OCR 源选择对话框
      const sourceNames = ocrSources.map(s => s.name);
      const selectedIndex = await MNUtil.userSelect(
        "选择 OCR 源",
        "请选择要使用的识别引擎（将应用到所有卡片）",
        sourceNames
      );
      
      // 处理用户取消
      if (selectedIndex === 0) {
        return;
      }
      
      const selectedOCR = ocrSources[selectedIndex - 1];
      MNUtil.showHUD(`开始批量识别（${selectedOCR.name}）...`);
      
      // 批量处理
      let successCount = 0;
      let failCount = 0;
      
      for (let i = 0; i < untitledNotes.length; i++) {
        const note = untitledNotes[i];
        
        try {
          // 获取图片数据
          const imageData = MNNote.getImageFromNote(note);
          if (!imageData) {
            failCount++;
            continue;
          }
          
          // 执行 OCR
          let ocrResult;
          if (typeof ocrNetwork !== 'undefined') {
            ocrResult = await ocrNetwork.OCR(imageData, selectedOCR.source, true);
          } else if (typeof toolbarUtils !== 'undefined') {
            // 降级到免费 OCR
            ocrResult = await toolbarUtils.freeOCR(imageData);
          } else {
            MNUtil.showHUD("请先安装 MN OCR 插件");
            return;
          }
          
          // 设置标题
          if (ocrResult && ocrResult.trim()) {
            MNUtil.undoGrouping(() => {
              note.noteTitle = ocrResult.trim();
            });
            successCount++;
          } else {
            failCount++;
          }
          
        } catch (error) {
          failCount++;
          if (typeof toolbarUtils !== 'undefined') {
            toolbarUtils.addErrorLog(error, "ocrAllUntitledDescendants", {noteId: note.noteId});
          }
        }
        
        // 更新进度（每处理3个或最后一个时更新）
        if ((i + 1) % 3 === 0 || i === untitledNotes.length - 1) {
          MNUtil.showHUD(`处理进度: ${i + 1}/${untitledNotes.length}`);
          await MNUtil.delay(0.1);  // 短暂延迟让 UI 更新
        }
      }
      
      // 显示完成信息
      let resultMessage = `处理完成！成功: ${successCount}`;
      if (failCount > 0) {
        resultMessage += `，失败: ${failCount}`;
      }
      MNUtil.showHUD(resultMessage);
      
      // 发送批量完成通知（可选，用于其他插件集成）
      MNUtil.postNotification("BatchOCRFinished", {
        action: "batchTitleOCR",
        parentNoteId: focusNote.noteId,
        totalCount: untitledNotes.length,
        successCount: successCount,
        failCount: failCount
      });
      
    } catch (error) {
      MNUtil.showHUD("批量 OCR 失败: " + error.message);
      if (typeof toolbarUtils !== 'undefined') {
        toolbarUtils.addErrorLog(error, "ocrAllUntitledDescendants");
      }
    }
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
                  : MNMath.getFirstTitleLinkWord(focusNote);
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
  global.registerCustomAction("renewContentsToHtmlMarkdownCommentType", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        HtmlMarkdownUtils.convertFieldContentToHtmlMDByPopup(focusNote);
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // htmlMDCommentsToNextLevelType
  // htmlMDCommentsToLastLevelType
  // htmlCommentToBottom
  // convetHtmlToMarkdown
  // clearContentKeepMarkdownText

  // clearContentKeepHtmlText
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
  // moveToExcerptPartBottom
  global.registerCustomAction("moveToExcerptPartBottom", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        MNMath.autoMoveNewContentToField(focusNote,"摘录")
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // moveToInput
  // moveToPreparationForExam
  // moveToInternalize
  // moveToBeClassified
  // moveLastThreeCommentByPopupTo
  // moveLastTwoCommentByPopupTo
  // moveLastOneCommentByPopupTo
  // manageCommentsByPopup
  global.registerCustomAction("manageCommentsByPopup", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        MNMath.manageCommentsByPopup(focusNote);
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // moveOneCommentToLinkNote
  // moveLastCommentToThought
  // moveLastTwoCommentsToThought
  // moveLastTwoCommentsInBiLinkNotesToThought
  // moveLastTwoCommentsInBiLinkNotesToDefinition
  // moveUpThoughtPointsToBottom
  global.registerCustomAction("moveUpThoughtPointsToBottom", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        focusNotes.forEach((focusNote) => {
          // 先检查是否需要进行智能链接排列
          let comments = focusNote.MNComments;
          if (comments.length > 0) {
            let lastComment = comments[comments.length - 1];
            if (lastComment.type === "linkComment") {
              // 尝试进行智能链接排列
              let success = MNMath.smartLinkArrangement(focusNote);
              if (success) {
                return; // 如果成功处理了链接，跳过自动移动内容
              }
            }
          }
          
          // 如果不是链接或处理失败，执行原有的自动移动内容功能
          MNMath.autoMoveNewContentToField(focusNote, "相关思考");
        });
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // moveUpThoughtPointsToTop
  // moveUpLinkNotes
  // moveToInbox
  // ========== CLEAR 相关 (8 个) ==========

  // clearAllLinks
  // clearAllFailedMN3Links
  // clearAllFailedLinks
  // clearContentKeepExcerptAndHandwritingAndImage
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
  // clearContentKeepText
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
        let result;
        if (focusNotes.length === 1) {
          // 单张卡片时返回字符串
          result = focusNotes[0].noteURL;
        } else {
          // 多张卡片时返回数组
          result = toolbarUtils.getNoteURLArr(focusNotes);
        }
        MNUtil.copy(result);
        MNUtil.showHUD(result);
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // cardCopyNoteId
  // copyWholeTitle
  // copyTitleSecondPart
  // copyTitleFirstKeyword
  // copyTitleFirstQuoteContent
  // copyTitleSecondQuoteContent
  // ========== CHANGE 相关 (5 个) ==========

  // changeChildNotesPrefix
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
  // changeDescendantNotesTitles
  // changeTitlePrefix
  // ========== OTHER 相关 (77 个) ==========


  // getNewClassificationInformation
  // MNFocusNote
  // MNEditDeleteNote
  // toBeProgressNote
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
  // deleteCommentsByPopup
  // deleteCommentsByPopupAndMoveNewContentToExcerptAreaBottom
  // deleteCommentsByPopupAndMoveNewContentToExcerptAreaTop
  // sameLevel
  // nextLevel
  // lastLevel
  // topestLevel
  // generateCustomTitleLink
  // generateCustomTitleLinkFromFocusNote
  // pasteNoteAsChildNote
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
  // focusInMindMap
  // focusInFloatMindMap
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
  global.registerCustomAction("autoMoveLinksBetweenCards", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    try {
      MNMath.smartLinkArrangement(focusNote);
    } catch (error) {
      MNUtil.showHUD(error);
    }
  });

  // refreshNotes
  // refreshCardsAndAncestorsAndDescendants
  // renewAuthorNotes
  // renewJournalNotes
  // renewPublisherNotes
  // renewBookSeriesNotes
  // renewBookNotes
  // findDuplicateTitles
  // addThoughtPointAndMoveLastCommentToThought
  // addThoughtPointAndMoveNewCommentsToThought
  // pasteInTitle
  // pasteAfterTitle
  // extractTitle
  // convertNoteToNonexcerptVersion
  global.registerCustomAction("convertNoteToNonexcerptVersion", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    // MNUtil.showHUD("卡片转化为非摘录版本")
    try {
      MNUtil.undoGrouping(() => {
        focusNotes.forEach((focusNote) => {
          if (focusNote.excerptText) {
            MNMath.toNoExcerptVersion(focusNote);
          }
        });
      });
    } catch (error) {
      MNUtil.showHUD(error);
    }
  });

  // ifExceptVersion
  // showColorIndex
  // showCommentType
  // linksConvertToMN4Type
  // addThought
  // addThoughtPoint
  // reappendAllLinksInNote
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
                  focusNote.mergeInto(focusNote.parentNote, htmlSetting[selectedIndex].type)
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
  // achieveCards
  // renewCards
  // renewChildNotesPrefix
  // hideAddonBar
  global.registerCustomAction("hideAddonBar", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.postNotification("toggleMindmapToolbar", { target: "addonBar" });
  });

  // 9BA894B4-3509-4894-A05C-1B4BA0A9A4AE
  // 014E76CA-94D6-48D5-82D2-F98A2F017219
  // undoOKRNoteMake
  // updateTodayTimeTag

  // updateTimeTag
  // openTasksFloatMindMap
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

  // addNewSummaryNote
  global.registerCustomAction("addNewSummaryNote", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "输入总结标题",
          "",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            let userInput = alert.textFieldAtIndex(0).text;
            if (buttonIndex == 1 && userInput) {
              MNUtil.undoGrouping(() => {
                MNMath.addNewSummaryNote(focusNote, userInput);
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
  // makeNote
  global.registerCustomAction("makeNote", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        if (toolbarConfig.windowState.roughReading) {
          // 粗读模式：使用颜色判断类型，不加入复习，自动移动到根目录
          toolbarUtils.roughReadingMakeNote(focusNote);
        } else if (toolbarConfig.windowState.preprocess) {
          // 预处理模式：简化处理
          let newnote = MNMath.toNoExcerptVersion(focusNote);
          MNMath.changeTitle(newnote);
          newnote.focusInMindMap(0.2);
        } else {
          // 正常模式：完整制卡流程
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



  // hideAddonBar - 隐藏插件栏
  global.registerCustomAction("hideAddonBar", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    // 发送通知来切换插件栏的显示/隐藏
    MNUtil.postNotification("toggleMindmapToolbar", { 
      target: "addonBar" 
    });
  });

  global.registerCustomAction("makeCardWithoutFocus", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        MNMath.makeCard(focusNote, true, true, false);
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  })

  global.registerCustomAction("retainFieldContentOnly", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        MNMath.retainFieldContentOnly(focusNote);
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  })

  global.registerCustomAction("renewKnowledgeNoteIntoParentNote", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        MNMath.renewKnowledgeNotes(focusNote.parentNote, focusNote);
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  global.registerCustomAction("removeBidirectionalLinks", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
         MNMath.removeBidirectionalLinks(focusNote)
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  })

  // updateBidirectionalLink
  global.registerCustomAction("updateBidirectionalLink", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    if (typeof MNMath !== 'undefined' && MNMath.updateBidirectionalLink) {
      await MNMath.updateBidirectionalLink(focusNote);
    } else {
      MNUtil.showHUD("需要安装最新版本的 MNUtils");
    }
  })

  // switchOCRSource - 切换 OCR 源
  global.registerCustomAction("switchOCRSource", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    // OCR 源选项 - 与 ocrAsProofTitleWithTranslation 保持一致
    const ocrSources = [
      { value: "Doc2X", name: "Doc2X - 专业文档识别" },
      { value: "SimpleTex", name: "SimpleTex - 数学公式" },
      { value: "GPT-4o", name: "GPT-4o" },
      { value: "GPT-4o-mini", name: "GPT-4o-mini" },
      { value: "glm-4v-plus", name: "glm-4v-plus" },
      { value: "glm-4v-flash", name: "glm-4v-flash" },
      { value: "claude-3-5-sonnet-20241022", name: "claude-3-5-sonnet-20241022" },
      { value: "claude-3-7-sonnet", name: "claude-3-7-sonnet" },
      { value: "gemini-2.0-flash", name: "gemini-2.0-flash" },
      { value: "Moonshot-v1", name: "Moonshot-v1" }
    ];
    
    const currentSource = toolbarConfig.ocrSource || "Doc2X";
    const currentSourceName = ocrSources.find(s => s.value === currentSource)?.name || currentSource;
    
    // 显示选择对话框
    const selectedIndex = await MNUtil.userSelect(
      "选择 OCR 源",
      `当前: ${currentSourceName}`,
      ocrSources.map(s => s.name)
    );
    
    if (selectedIndex === 0) {
      // 用户取消
      return;
    }
    
    // 保存选择（selectedIndex 从 1 开始）
    const selectedSource = ocrSources[selectedIndex - 1];
    toolbarConfig.ocrSource = selectedSource.value;
    toolbarConfig.save();
    
    MNUtil.showHUD(`✅ OCR 源已切换为: ${selectedSource.name}`);
  });

  // switchTranslateModel - 切换翻译模型
  global.registerCustomAction("switchTranslateModel", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    // 翻译模型选项
    const translateModels = [
      "gpt-4o-mini",
      "gpt-4o",
      "gpt-4.1",
      "gpt-4.1-mini",
      "gpt-4.1-nano",
      "claude-3-5-sonnet",
      "claude-3-7-sonnet",
      "glm-4-plus",
      "glm-z1-airx",
      "deepseek-chat",
      "deepseek-reasoner",
      "glm-4-flashx（内置智谱AI）"
    ];
    const currentModel = toolbarConfig.translateModel || "gpt-4o-mini";
    
    // 显示选择对话框
    const selectedIndex = await MNUtil.userSelect(
      "选择翻译模型", 
      `当前: ${currentModel}`,
      translateModels
    );
    
    if (selectedIndex === 0) {
      // 用户取消
      return;
    }
    
    // 保存选择（selectedIndex 从 1 开始）
    const selectedModel = translateModels[selectedIndex - 1];
    toolbarConfig.translateModel = selectedModel;
    toolbarConfig.save();
    
    MNUtil.showHUD(`✅ 翻译模型已切换为: ${selectedModel}`);
  });
  
  // ocrAllUntitledDescendantsWithTranslation - 批量 OCR 并翻译无标题子孙卡片
  global.registerCustomAction("ocrAllUntitledDescendantsWithTranslation", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    try {
      // 检查是否有 focusNote
      if (!focusNote) {
        MNUtil.showHUD("请先选择一个笔记");
        return;
      }
      
      // 获取所有子孙卡片
      const descendantData = focusNote.descendantNodes;
      const descendants = descendantData ? descendantData.descendant : [];
      
      // 创建包含选中卡片和所有子孙卡片的数组
      const allNotes = [focusNote, ...descendants];
      
      // 筛选无标题且有图片的卡片
      const untitledNotes = allNotes.filter(note => {
        // 检查是否无标题
        if (note.noteTitle && note.noteTitle.trim()) {
          return false;
        }
        // 检查是否有图片
        const imageData = MNNote.getImageFromNote(note);
        return imageData !== null && imageData !== undefined;
      });
      
      if (untitledNotes.length === 0) {
        MNUtil.showHUD("没有找到无标题且包含图片的子孙卡片");
        return;
      }
      
      // 确认操作
      const confirmed = await MNUtil.confirm(
        "批量 OCR + 翻译确认",
        `找到 ${untitledNotes.length} 个无标题卡片，将进行 OCR 识别并翻译为中文。`
      );
      
      if (!confirmed) {
        return;
      }
      
      // 使用配置的 OCR 源和翻译模型
      const ocrSource = toolbarConfig.ocrSource || toolbarConfig.defaultOCRSource || "Doc2X";
      const translateModel = toolbarConfig.translateModel || toolbarConfig.defaultTranslateModel || "gpt-4o-mini";
      
      MNUtil.showHUD(`开始批量处理（OCR: ${ocrSource}, 翻译: ${translateModel}）...`);
      
      // 批量处理
      let successCount = 0;
      let failCount = 0;
      
      for (let i = 0; i < untitledNotes.length; i++) {
        const note = untitledNotes[i];
        
        try {
          // 获取图片数据
          const imageData = MNNote.getImageFromNote(note);
          if (!imageData) {
            failCount++;
            continue;
          }
          
          // 执行 OCR
          let ocrResult;
          if (typeof ocrNetwork !== 'undefined') {
            // 使用 MNOCR 插件
            ocrResult = await ocrNetwork.OCR(imageData, ocrSource, true);
          } else if (typeof toolbarUtils !== 'undefined') {
            // 降级到免费 OCR
            ocrResult = await toolbarUtils.freeOCR(imageData);
          } else {
            MNUtil.showHUD("请先安装 MN OCR 插件");
            return;
          }
          
          if (ocrResult && ocrResult.trim()) {
            // 执行翻译
            try {
              const translatedText = await toolbarUtils.ocrWithTranslation(ocrResult, translateModel);
              
              // 设置翻译后的标题
              MNUtil.undoGrouping(() => {
                note.noteTitle = translatedText.trim();
              });
              
              successCount++;
            } catch (translationError) {
              // 翻译失败，使用原始 OCR 结果
              MNUtil.undoGrouping(() => {
                note.noteTitle = ocrResult.trim();
              });
              
              successCount++;
              
              if (typeof MNUtil !== "undefined" && MNUtil.log) {
                MNUtil.log(`⚠️ [批量OCR翻译] 翻译失败，使用原始文本: ${translationError.message}`);
              }
            }
          } else {
            failCount++;
          }
          
        } catch (error) {
          failCount++;
          if (typeof toolbarUtils !== 'undefined') {
            toolbarUtils.addErrorLog(error, "ocrAllUntitledDescendantsWithTranslation", {noteId: note.noteId});
          }
        }
        
        // 更新进度（每处理3个或最后一个时更新）
        if ((i + 1) % 3 === 0 || i === untitledNotes.length - 1) {
          MNUtil.showHUD(`处理进度: ${i + 1}/${untitledNotes.length}`);
          await MNUtil.delay(0.1);  // 短暂延迟让 UI 更新
        }
      }
      
      // 显示完成信息
      let resultMessage = `✅ 处理完成！成功: ${successCount}`;
      if (failCount > 0) {
        resultMessage += `，失败: ${failCount}`;
      }
      MNUtil.showHUD(resultMessage);
      
      // 发送批量完成通知（可选，用于其他插件集成）
      MNUtil.postNotification("BatchOCRTranslationFinished", {
        action: "batchOCRWithTranslation",
        noteId: focusNote.noteId,
        successCount: successCount,
        failCount: failCount,
        totalCount: untitledNotes.length
      });
      
    } catch (error) {
      MNUtil.showHUD("批量 OCR 翻译失败: " + error.message);
      if (typeof toolbarUtils !== 'undefined') {
        toolbarUtils.addErrorLog(error, "ocrAllUntitledDescendantsWithTranslation");
      }
    }
  });
  
  // translateAllDescendants - 批量翻译子孙卡片
  global.registerCustomAction("translateAllDescendants", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    try {
      // 检查是否有 focusNote
      if (!focusNote) {
        MNUtil.showHUD("请先选择一个卡片");
        return;
      }
      
      // 获取所有子孙卡片
      const descendantData = focusNote.descendantNodes;
      const descendants = descendantData ? descendantData.descendant : [];
      
      // 创建包含选中卡片和所有子孙卡片的数组
      const allNotes = [focusNote, ...descendants];
      
      // 筛选有标题或摘录的卡片
      const notesToTranslate = allNotes.filter(note => {
        // 检查是否有标题或摘录内容
        return (note.noteTitle && note.noteTitle.trim()) || 
               (note.excerptText && note.excerptText.trim());
      });
      
      if (notesToTranslate.length === 0) {
        MNUtil.showHUD("没有找到可翻译的卡片");
        return;
      }
      
      // 显示翻译选项对话框
      const translateOptions = [
        "仅翻译标题",
        "仅翻译摘录",
        "翻译标题和摘录",
        "添加翻译到评论"
      ];
      
      const optionIndex = await MNUtil.userSelect(
        "选择翻译方式",
        `找到 ${notesToTranslate.length} 个卡片可翻译`,
        translateOptions
      );
      
      if (optionIndex === 0) {
        return; // 用户取消
      }
      
      // 选择翻译模型
      const translateModels = toolbarUtils.getAvailableAIModels ? 
        toolbarUtils.getAvailableAIModels() : 
        ["gpt-4o-mini", "gpt-4o", "claude-3-5-sonnet"];
        
      const currentModel = toolbarConfig.translateModel || "gpt-4o-mini";
      
      const modelIndex = await MNUtil.userSelect(
        "选择翻译模型",
        `当前: ${currentModel}`,
        translateModels
      );
      
      if (modelIndex === 0) {
        return; // 用户取消
      }
      
      const selectedModel = translateModels[modelIndex - 1];
      const translateMode = optionIndex; // 1-4
      
      // 开始批量翻译
      MNUtil.showHUD(`开始批量翻译（共 ${notesToTranslate.length} 个卡片）...`);
      
      let successCount = 0;
      let failCount = 0;
      
      // 使用撤销分组
      MNUtil.undoGrouping(async () => {
        for (let i = 0; i < notesToTranslate.length; i++) {
          const note = notesToTranslate[i];
          
          try {
            // 显示进度
            if (i % 5 === 0) {
              MNUtil.showHUD(`正在翻译... (${i + 1}/${notesToTranslate.length})`);
            }
            
            let hasChanges = false;
            
            // 根据选择的模式执行翻译
            if (translateMode === 1 || translateMode === 3) {
              // 翻译标题
              if (note.noteTitle && note.noteTitle.trim()) {
                const translatedTitle = await toolbarUtils.translateNoteContent(
                  note.noteTitle, 
                  'academic', 
                  '中文', 
                  selectedModel
                );
                
                if (translatedTitle && translatedTitle !== note.noteTitle) {
                  if (translateMode === 1) {
                    note.noteTitle = translatedTitle;
                  } else {
                    // 保留原标题，在后面添加翻译
                    note.noteTitle = `${note.noteTitle} | ${translatedTitle}`;
                  }
                  hasChanges = true;
                }
              }
            }
            
            if (translateMode === 2 || translateMode === 3) {
              // 翻译摘录
              if (note.excerptText && note.excerptText.trim()) {
                const translatedExcerpt = await toolbarUtils.translateNoteContent(
                  note.excerptText, 
                  'academic', 
                  '中文', 
                  selectedModel
                );
                
                if (translatedExcerpt && translatedExcerpt !== note.excerptText) {
                  if (translateMode === 2) {
                    note.excerptText = translatedExcerpt;
                  } else {
                    // 保留原摘录，在后面添加翻译
                    note.excerptText = `${note.excerptText}\n\n翻译：${translatedExcerpt}`;
                  }
                  hasChanges = true;
                }
              }
            }
            
            if (translateMode === 4) {
              // 添加翻译到评论
              let textToTranslate = "";
              
              if (note.noteTitle && note.noteTitle.trim()) {
                textToTranslate = note.noteTitle;
              } else if (note.excerptText && note.excerptText.trim()) {
                textToTranslate = note.excerptText;
              }
              
              if (textToTranslate) {
                const translation = await toolbarUtils.translateNoteContent(
                  textToTranslate, 
                  'academic', 
                  '中文', 
                  selectedModel
                );
                
                if (translation) {
                  // 添加翻译作为评论
                  note.appendTextComment(`翻译：${translation}`);
                  hasChanges = true;
                }
              }
            }
            
            if (hasChanges) {
              successCount++;
            }
            
          } catch (error) {
            failCount++;
            if (typeof MNUtil !== "undefined" && MNUtil.log) {
              MNUtil.log(`❌ [批量翻译] 卡片翻译失败: ${error.message}`);
            }
          }
        }
        
        // 显示完成信息
        const message = failCount > 0 ? 
          `✅ 翻译完成：成功 ${successCount} 个，失败 ${failCount} 个` :
          `✅ 翻译完成：成功翻译 ${successCount} 个卡片`;
          
        MNUtil.showHUD(message);
      });
      
    } catch (error) {
      MNUtil.showHUD("批量翻译失败: " + error.message);
      if (typeof toolbarUtils !== 'undefined') {
        toolbarUtils.addErrorLog(error, "translateAllDescendants");
      }
    }
  });

}

// 立即注册
try {
  registerAllCustomActions();
} catch (error) {
  // 静默处理错误，避免影响主功能
}
