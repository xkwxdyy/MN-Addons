/**
 * 夏大鱼羊定制 Actions 注册表
 * 使用注册机制实现解耦
 */

// 创建全局注册表
if (typeof global === 'undefined') {
  var global = {};
}

// 初始化 customActions 对象
global.customActions = global.customActions || {};

/**
 * 注册自定义 action
 * @param {string} actionName - action 名称
 * @param {Function} handler - 处理函数
 */
global.registerCustomAction = function(actionName, handler) {
  global.customActions[actionName] = handler;
  console.log(`✅ 注册自定义 action: ${actionName}`);
};

/**
 * 执行自定义 action
 * @param {string} actionName - action 名称
 * @param {Object} context - 执行上下文
 * @returns {boolean} - 是否成功执行
 */
global.executeCustomAction = async function(actionName, context) {
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
  // test action
  global.registerCustomAction("test", async function(context) {
    const { button, des, focusNote } = context;
    const name = "鱼羊";
    MNUtil.showHUD("✅ test action (来自注册表)！结果: " + toolbarUtils.getAbbreviationsOfName("Kangwei Xia"));
    MNUtil.copy("✅ test action (来自注册表)！结果: " + Object.keys(toolbarUtils.getAbbreviationsOfName("Kangwei Xia")));
  });

  // moveProofDown
  global.registerCustomAction("moveProofDown", async function(context) {
    const { focusNote } = context;
    MNUtil.undoGrouping(()=>{
      try {
        focusNote.moveProofDown();
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // MNFocusNote
  global.registerCustomAction("MNFocusNote", async function(context) {
    MNUtil.excuteCommand("FocusNote");
  });

  // toBeIndependent
  global.registerCustomAction("toBeIndependent", async function(context) {
    const { focusNotes } = context;
    MNUtil.undoGrouping(()=>{
      try {
        focusNotes.forEach(focusNote=>{
          focusNote.toBeIndependent();
        });
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // moveToBeClassified
  global.registerCustomAction("moveToBeClassified", async function(context) {
    const { focusNotes } = context;
    MNUtil.undoGrouping(()=>{
      try {
        if (MNUtil.currentNotebookId == "A07420C1-661A-4C7D-BA06-C7035C18DA74") {
          UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
            "移动到「待归类」区",
            "请选择科目",
            0,
            "取消",
            [
              "数学基础",
              "泛函分析",
              "实分析",
              "复分析",
              "数学分析",
              "高等代数"
            ],
            (alert, buttonIndex) => {
              let targetNoteId;
              switch (buttonIndex) {
                case 1: // 数学基础
                  targetNoteId = "EF75F2C8-2655-4BAD-92E1-C9C11D1A37C3";
                  break;
                case 2: // 泛函分析
                  targetNoteId = "23E0024A-F2C9-4E45-9F64-86DD30C0D497";
                  break;
                case 3: // 实分析
                  targetNoteId = "97672F06-1C40-475D-8F44-16759CCADA8C";
                  break;
                case 4: // 复分析
                  targetNoteId = "16920F8B-700E-4BA6-A7EE-F887F28A502B";
                  break;
                case 5: // 数学分析
                  targetNoteId = "9AAE346D-D7ED-472E-9D30-A7E1DE843F83";
                  break;
                case 6: // 高等代数
                  targetNoteId = "B9B3FB57-AAC0-4282-9BFE-3EF008EA2085";
                  break;
              }
              MNUtil.undoGrouping(()=>{
                focusNotes.forEach(focusNote=>{
                  focusNote.moveToBeClassified(targetNoteId);
                });
              });
            }
          );
        } else {
          focusNotes.forEach(focusNote=>{
            focusNote.moveToBeClassified();
          });
        }
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // 继续添加更多 actions...
  
  console.log(`✅ 已注册 ${Object.keys(global.customActions).length} 个自定义 actions`);
}

// 立即注册
try {
  registerAllCustomActions();
  if (typeof MNUtil !== 'undefined' && MNUtil.showHUD) {
    MNUtil.showHUD(`✅ 注册表已加载 (${Object.keys(global.customActions).length} 个 actions)`);
  }
} catch (error) {
  console.error("注册自定义 actions 失败:", error);
}