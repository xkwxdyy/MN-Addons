/**
 * 夏大鱼羊定制 Actions - 调试版
 * 包含调试日志，用于诊断问题
 */

// 获取工具栏控制器实例
const getToolbarController = () => self

/**
 * 测试用的自定义 Action 处理器
 */
const customActionHandlers = {
  "test": async function(context) {
    MNUtil.showHUD("✅ test action 被执行了！")
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
 * 初始化自定义 Actions（调试版本）
 */
function initializeCustomActions() {
  console.log("🔧 开始初始化自定义 Actions...");
  
  // 使用 eval 检查 toolbarController 是否存在
  let hasToolbarController = false;
  try {
    hasToolbarController = eval('typeof toolbarController') !== 'undefined';
  } catch (e) {
    console.log("❌ 检查 toolbarController 时出错:", e);
  }
  
  if (!hasToolbarController) {
    console.log("⏳ toolbarController 尚未定义，延迟初始化");
    setTimeout(() => {
      initializeCustomActions();
    }, 100);
    return;
  }
  
  // 获取 toolbarController
  const controller = eval('toolbarController');
  if (!controller || !controller.prototype) {
    console.log("❌ toolbarController.prototype 不可用");
    return;
  }
  
  console.log("✅ 找到 toolbarController，开始重写 customActionByDes");
  
  // 保存原始方法
  const originalCustomActionByDes = controller.prototype.customActionByDes;
  if (!originalCustomActionByDes) {
    console.log("❌ 原始 customActionByDes 方法不存在！");
    return;
  }
  
  // 计数器，用于调试
  let callCount = 0;
  
  // 重写方法
  controller.prototype.customActionByDes = async function(button, des, checkSubscribe = true) {
    callCount++;
    console.log(`🔍 customActionByDes 被调用 (第 ${callCount} 次), action: ${des.action}`);
    
    try {
      // 检查是否是自定义 action
      if (des.action in customActionHandlers) {
        console.log(`✅ 找到自定义 action: ${des.action}`);
        MNUtil.showHUD(`🔧 执行自定义 action: ${des.action}`);
        
        // 准备上下文
        let focusNote, focusNotes;
        
        try {
          focusNote = MNNote.getFocusNote() ? MNNote.getFocusNote() : undefined;
        } catch (e) {
          focusNote = undefined;
        }
        
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
        
        // 执行自定义处理器
        await customActionHandlers[des.action].call(this, context);
        console.log(`✅ 自定义 action ${des.action} 执行完成`);
        return;
      }
      
      // 不是自定义 action，调用原始方法
      console.log(`⚡ 调用原始方法处理 action: ${des.action}`);
      return await originalCustomActionByDes.call(this, button, des, checkSubscribe);
      
    } catch (error) {
      console.error(`❌ customActionByDes 出错:`, error);
      MNUtil.showHUD(`❌ 执行出错: ${error}`);
      
      // 错误时也要调用原始方法，避免功能中断
      try {
        return await originalCustomActionByDes.call(this, button, des, checkSubscribe);
      } catch (e) {
        console.error("❌ 调用原始方法也失败:", e);
      }
    }
  };
  
  console.log("✅ customActionByDes 重写完成");
  
  // 初始化成功提示
  try {
    if (typeof MNUtil !== 'undefined' && MNUtil.showHUD) {
      MNUtil.showHUD("✅ 调试版 Actions 已加载 (" + Object.keys(customActionHandlers).length + " 个)");
    }
  } catch (e) {
    console.log("✅ 自定义 Actions 已加载（无法显示 HUD）");
  }
}

// 立即尝试初始化
console.log("📦 xdyy_test_actions_debug.js 已加载");
setTimeout(() => {
  try {
    initializeCustomActions();
  } catch (error) {
    console.error("❌ 自定义 Actions 初始化失败:", error);
  }
}, 10);