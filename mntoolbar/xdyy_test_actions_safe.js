/**
 * 夏大鱼羊定制 Actions - 安全测试版
 * 包含少量功能用于测试解耦方案，增强了错误处理
 */

// 获取工具栏控制器实例
const getToolbarController = () => self

/**
 * 测试用的自定义 Action 处理器
 */
const customActionHandlers = {
  "test": async function(context) {
    const { focusNote, focusNotes, button, des, self } = context;
    const name = "鱼羊";
    MNUtil.showHUD(toolbarUtils.getAbbreviationsOfName("Kangwei Xia"))
  },

  "moveProofDown": async function(context) {
    const { focusNote, focusNotes, button, des, self } = context;
    MNUtil.undoGrouping(()=>{
      try {
        focusNote.moveProofDown()
      } catch (error) {
        MNUtil.showHUD(error);
      }
    })
  },

  "MNFocusNote": async function(context) {
    const { focusNote, focusNotes, button, des, self } = context;
    MNUtil.excuteCommand("FocusNote")
  },

  "toBeIndependent": async function(context) {
    const { focusNote, focusNotes, button, des, self } = context;
    MNUtil.undoGrouping(()=>{
      try {
        focusNotes.forEach(focusNote=>{
          focusNote.toBeIndependent()
        })
      } catch (error) {
        MNUtil.showHUD(error);
      }
    })
  },

  "moveToBeClassified": async function(context) {
    const { focusNote, focusNotes, button, des, self } = context;
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
              let targetNoteId
              switch (buttonIndex) {
                case 1: // 数学基础
                  targetNoteId = "EF75F2C8-2655-4BAD-92E1-C9C11D1A37C3"
                  break;
                case 2: // 泛函分析
                  targetNoteId = "23E0024A-F2C9-4E45-9F64-86DD30C0D497"
                  break;
                case 3: // 实分析
                  targetNoteId = "97672F06-1C40-475D-8F44-16759CCADA8C"
                  break;
                case 4: // 复分析
                  targetNoteId = "16920F8B-700E-4BA6-A7EE-F887F28A502B"
                  break;
                case 5: // 数学分析
                  targetNoteId = "9AAE346D-D7ED-472E-9D30-A7E1DE843F83"
                  break;
                case 6: // 高等代数
                  targetNoteId = "B9B3FB57-AAC0-4282-9BFE-3EF008EA2085"
                  break;
              }
              MNUtil.undoGrouping(()=>{
                focusNotes.forEach(focusNote=>{
                  focusNote.moveToBeClassified(targetNoteId)
                })
              })
            }
          )
        } else {
          focusNotes.forEach(focusNote=>{
            focusNote.moveToBeClassified()
          })
        }
      } catch (error) {
        MNUtil.showHUD(error);
      }
    })
  }
}

/**
 * 初始化自定义 Actions（延迟执行版本）
 */
function initializeCustomActions() {
  // 使用 eval 检查 toolbarController 是否存在，避免直接引用导致错误
  let hasToolbarController = false;
  try {
    hasToolbarController = eval('typeof toolbarController') !== 'undefined';
  } catch (e) {
    // toolbarController 不存在
  }
  
  if (!hasToolbarController) {
    console.log("toolbarController 尚未定义，延迟初始化");
    // 延迟重试
    setTimeout(() => {
      initializeCustomActions();
    }, 100);
    return;
  }
  
  // 获取 toolbarController
  const controller = eval('toolbarController');
  if (!controller || !controller.prototype) {
    console.log("toolbarController.prototype 不可用");
    return;
  }
  
  const originalCustomActionByDes = controller.prototype.customActionByDes;
  
  controller.prototype.customActionByDes = async function(button, des, checkSubscribe = true) {
    try {
      if (des.action in customActionHandlers) {
        // 准备上下文
        let focusNote, focusNotes;
        
        // 安全获取 focusNote
        try {
          focusNote = MNNote.getFocusNote() ? MNNote.getFocusNote() : undefined;
        } catch (e) {
          focusNote = undefined;
        }
        
        // 安全获取 focusNotes
        try {
          focusNotes = MNNote.getFocusNotes() ? MNNote.getFocusNotes() : undefined;
        } catch (e) {
          focusNotes = undefined;
        }
        
        const context = {
          button,
          des,
          focusNote,
          focusNotes,
          self: this
        };
        
        await customActionHandlers[des.action].call(this, context);
        return;
      }
      
      return await originalCustomActionByDes.call(this, button, des, checkSubscribe);
    } catch (error) {
      if (toolbarUtils && toolbarUtils.addErrorLog) {
        toolbarUtils.addErrorLog(error, "customActionByDes_extended");
      } else {
        console.error("customActionByDes_extended error:", error);
      }
    }
  };
  
  // 初始化成功提示
  try {
    if (typeof MNUtil !== 'undefined' && MNUtil.showHUD) {
      MNUtil.showHUD("✅ 安全版 Actions 已加载 (" + Object.keys(customActionHandlers).length + " 个)");
    }
  } catch (e) {
    console.log("自定义 Actions 已加载");
  }
}

// 延迟初始化，确保所有依赖都已加载
setTimeout(() => {
  try {
    initializeCustomActions();
  } catch (error) {
    console.error("自定义 Actions 初始化错误:", error);
  }
}, 10);