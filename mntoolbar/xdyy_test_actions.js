/**
 * 夏大鱼羊定制 Actions - 测试版
 * 包含少量功能用于测试解耦方案
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
 * 初始化自定义 Actions
 */
function initializeCustomActions() {
  if (typeof toolbarController !== 'undefined' && toolbarController.prototype) {
    const originalCustomActionByDes = toolbarController.prototype.customActionByDes
    
    toolbarController.prototype.customActionByDes = async function(button, des, checkSubscribe = true) {
      try {
        if (des.action in customActionHandlers) {
          // 准备上下文
          const focusNote = MNNote.getFocusNote() ? MNNote.getFocusNote() : undefined
          const focusNotes = MNNote.getFocusNotes() ? MNNote.getFocusNotes() : undefined
          
          const context = {
            button,
            des,
            focusNote,
            focusNotes,
            self: this
          }
          
          await customActionHandlers[des.action].call(this, context)
          return
        }
        
        return await originalCustomActionByDes.call(this, button, des, checkSubscribe)
      } catch (error) {
        toolbarUtils.addErrorLog(error, "customActionByDes_extended")
      }
    }
  }
}

// 自动初始化
try {
  // 检查必要的依赖
  if (typeof toolbarController === 'undefined') {
    console.log("⚠️ toolbarController 未定义，跳过自定义 Actions 加载")
  } else {
    initializeCustomActions()
    // 仅在 MNUtil 可用时显示提示
    if (typeof MNUtil !== 'undefined' && MNUtil.showHUD) {
      MNUtil.showHUD("✅ 测试版 Actions 已加载 (" + Object.keys(customActionHandlers).length + " 个)")
    }
  }
} catch (error) {
  console.error("自定义 Actions 加载错误:", error)
  if (typeof MNUtil !== 'undefined' && MNUtil.showHUD) {
    MNUtil.showHUD("❌ 测试版 Actions 加载失败: " + error)
  }
}