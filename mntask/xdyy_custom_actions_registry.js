/**
 * task 的 Actions 注册表
 */

// 使用 MNTask 专用命名空间，避免与 MNToolbar 冲突
if (typeof MNTaskGlobal === "undefined") {
  var MNTaskGlobal = {};
}

// 初始化 customActions 对象
MNTaskGlobal.customActions = MNTaskGlobal.customActions || {};


/**
 * 注册自定义 action
 * @param {string} actionName - action 名称
 * @param {Function} handler - 处理函数
 */
MNTaskGlobal.registerCustomAction = function (actionName, handler) {
  MNTaskGlobal.customActions[actionName] = handler;
};

/**
 * 执行自定义 action
 * @param {string} actionName - action 名称
 * @param {Object} context - 执行上下文
 * @returns {boolean} - 是否成功执行
 */
MNTaskGlobal.executeCustomAction = async function (actionName, context) {
  if (actionName in MNTaskGlobal.customActions) {
    try {
      await MNTaskGlobal.customActions[actionName](context);
      return true;
    } catch (error) {
      MNUtil.showHUD(`执行失败: ${error.message || error}`);
      return false;
    }
  }
  return false;
};

// 不再需要全局 global 对象

// 注册所有自定义 actions
function registerAllCustomActions() {
  // updateTodayTimeTag
  MNTaskGlobal.registerCustomAction("updateTodayTimeTag", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((focusNote) => {
        taskUtils.updateTodayTimeTag(focusNote);
      });
    });
  });

  // addTodayTimeTag
  MNTaskGlobal.registerCustomAction("addTodayTimeTag", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((focusNote) => {
        taskUtils.addTodayTimeTag(focusNote);
      });
    });
  });

  // updateTimeTag
  MNTaskGlobal.registerCustomAction("updateTimeTag", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((focusNote) => {
        taskUtils.updateTimeTag(focusNote);
      });
    });
  });

  // openTasksFloatMindMap
  MNTaskGlobal.registerCustomAction("openTasksFloatMindMap", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    let OKRNote = MNNote.new("690ABF82-339C-4AE1-8BDB-FA6796204B27");
    OKRNote.focusInFloatMindMap();
  });

  // openPinnedNote-1
  MNTaskGlobal.registerCustomAction("openPinnedNote-1", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    pinnedNote = MNNote.new("1346BDF1-7F58-430F-874E-B814E7162BDF"); // Hᵖ(D)
    pinnedNote.focusInFloatMindMap();
  });

  // openPinnedNote-2
  MNTaskGlobal.registerCustomAction("openPinnedNote-2", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    pinnedNote = MNNote.new("89042A37-CC80-4FFC-B24F-F8E86CB764DC"); // Lᵖ(T)
    pinnedNote.focusInFloatMindMap();
  });

  // openPinnedNote-3
  MNTaskGlobal.registerCustomAction("openPinnedNote-3", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    pinnedNote = MNNote.new("D7DEDE97-1B87-4BB6-B607-4FB987F230E4"); // Hᵖ(T)
    pinnedNote.focusInFloatMindMap();
  });

  // renewExcerptInParentNoteByFocusNote
  MNTaskGlobal.registerCustomAction("renewExcerptInParentNoteByFocusNote", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        taskUtils.renewExcerptInParentNoteByFocusNote(focusNote);
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // removeTitlePrefix
  MNTaskGlobal.registerCustomAction("removeTitlePrefix", async function (context) {
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
  MNTaskGlobal.registerCustomAction("addNewIdeaNote", async function (context) {
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
  MNTaskGlobal.registerCustomAction("makeCard", async function (context) {
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
  MNTaskGlobal.registerCustomAction("makeNote", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        if (taskConfig.windowState.preprocess) {
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
  MNTaskGlobal.registerCustomAction("doubleClickMakeNote", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      MNMath.makeNote(focusNote, false);
    });
  });

  // replaceFieldContentByPopup
  MNTaskGlobal.registerCustomAction("replaceFieldContentByPopup", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        MNMath.replaceFieldContentByPopup(focusNote);
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // hideAddonBar - 隐藏插件栏
  MNTaskGlobal.registerCustomAction("hideAddonBar", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    // 发送通知来切换插件栏的显示/隐藏
    MNUtil.postNotification("toggleMindmapTask", { 
      target: "addonBar" 
    });
  });

  MNTaskGlobal.registerCustomAction("makeCardWithoutFocus", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        MNMath.makeCard(focusNote, true, true, false);
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  })

  MNTaskGlobal.registerCustomAction("retainFieldContentOnly", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        MNMath.retainFieldContentOnly(focusNote);
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  })

  // OKRNoteMake - OKR 制卡流
  MNTaskGlobal.registerCustomAction("OKRNoteMake", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((focusNote) => {
        taskUtils.OKRNoteMake(focusNote);
      });
    });
  });

  // undoOKRNoteMake - 回退任务状态
  MNTaskGlobal.registerCustomAction("undoOKRNoteMake", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((focusNote) => {
        taskUtils.OKRNoteMake(focusNote, true);  // undoStatus = true
      });
    });
  });

  // moveToInbox - 加入 Inbox
  MNTaskGlobal.registerCustomAction("moveToInbox", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.showHUD("功能开发中：加入 Inbox");
  });

  // openFloatWindowByInboxNote - 浮窗定位今日 Inbox
  MNTaskGlobal.registerCustomAction("openFloatWindowByInboxNote", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.showHUD("功能开发中：浮窗定位今日 Inbox");
  });

  // openFloatWindowByInboxNoteOnDate - 浮窗定位指定日期 Inbox
  MNTaskGlobal.registerCustomAction("openFloatWindowByInboxNoteOnDate", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.showHUD("功能开发中：浮窗定位指定日期 Inbox");
  });

  // achieveCards - 归档卡片
  MNTaskGlobal.registerCustomAction("achieveCards", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.showHUD("功能开发中：归档卡片");
  });

  // renewCards - 更新卡片
  MNTaskGlobal.registerCustomAction("renewCards", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.showHUD("功能开发中：更新卡片");
  });

  // getOKRNotesOnToday - 获取今日 OKR 任务
  MNTaskGlobal.registerCustomAction("getOKRNotesOnToday", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.showHUD("功能开发中：获取今日 OKR 任务");
  });

}

// 立即注册
try {
  registerAllCustomActions();
} catch (error) {
  // 静默处理错误，避免影响主功能
}
