/**
 * MNTask 筛选功能修复补丁
 * 为主要筛选功能添加回退机制，解决看板为空时筛选失效的问题
 */

// 修复 filterTasks - 主筛选器
function patchFilterTasks() {
  const originalFilterTasks = MNTaskGlobal.customActions.filterTasks;
  
  MNTaskGlobal.registerCustomAction("filterTasks", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    // 预设筛选选项
    const filterOptions = [
      "🔥 重要且紧急",
      "📅 今日任务",
      "⏰ 即将到期（3天内）",
      "⚠️ 已逾期",
      "📌 高优先级未完成",
      "📊 本周任务",
      "🔍 停滞任务（7天未更新）",
      "✅ 待归档任务",
      "🏷️ 按标签筛选",
      "⚙️ 自定义筛选"
    ];
    
    const selectedIndex = await MNUtil.userSelect("选择筛选类型", "", filterOptions);
    if (selectedIndex === 0) return;
    
    let filteredTasks = [];
    const boardKeys = ['target', 'project', 'action'];
    
    // 先尝试从看板筛选
    switch (selectedIndex) {
      case 1: // 重要且紧急
        filteredTasks = TaskFilterEngine.filterImportantAndUrgent(boardKeys);
        break;
      case 2: // 今日任务
        filteredTasks = MNTaskManager.filterTodayTasks(boardKeys);
        break;
      // ... 其他 case
    }
    
    // 如果看板筛选无结果，尝试全笔记本搜索
    if (filteredTasks.length === 0) {
      MNUtil.log("⚠️ 看板中未找到符合条件的任务，尝试从整个笔记本搜索...");
      
      switch (selectedIndex) {
        case 2: // 今日任务
          filteredTasks = MNTaskManager.filterAllTodayTasks();
          break;
        case 4: // 已逾期
          filteredTasks = await searchOverdueTasksInNotebook();
          break;
        case 5: // 高优先级未完成
          filteredTasks = await searchHighPriorityTasksInNotebook();
          break;
      }
    }
    
    // 显示结果
    if (filteredTasks.length === 0) {
      MNUtil.showHUD("没有找到符合条件的任务");
    } else {
      await showFilterResultsMenu(filteredTasks, filterOptions[selectedIndex - 1]);
    }
  });
}

// 辅助函数：从整个笔记本搜索逾期任务
async function searchOverdueTasksInNotebook() {
  const results = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  try {
    const currentNotebookId = MNUtil.currentNotebookId;
    const allNotes = MNUtil.notesInStudySet(currentNotebookId);
    
    for (let note of allNotes) {
      const mnNote = MNNote.new(note);
      if (!mnNote || !MNTaskManager.isTaskCard(mnNote)) continue;
      
      const titleParts = MNTaskManager.parseTaskTitle(mnNote.noteTitle);
      if (titleParts.status === '已完成' || titleParts.status === '已归档') continue;
      
      // 检查日期字段
      const taskDate = TaskFilterEngine.getTaskDate(mnNote);
      if (taskDate && taskDate < today) {
        results.push(mnNote);
      }
    }
  } catch (error) {
    MNUtil.log("❌ 搜索逾期任务时出错：" + error.message);
  }
  
  return results;
}

// 辅助函数：从整个笔记本搜索高优先级任务
async function searchHighPriorityTasksInNotebook() {
  const results = [];
  
  try {
    const currentNotebookId = MNUtil.currentNotebookId;
    const allNotes = MNUtil.notesInStudySet(currentNotebookId);
    
    for (let note of allNotes) {
      const mnNote = MNNote.new(note);
      if (!mnNote || !MNTaskManager.isTaskCard(mnNote)) continue;
      
      const titleParts = MNTaskManager.parseTaskTitle(mnNote.noteTitle);
      const priority = MNTaskManager.getTaskPriority(mnNote);
      
      if (priority === '高' && 
          (titleParts.status === '未开始' || titleParts.status === '进行中')) {
        results.push(mnNote);
      }
    }
  } catch (error) {
    MNUtil.log("❌ 搜索高优先级任务时出错：" + error.message);
  }
  
  return results;
}

// 应用修复补丁
function applyFilterPatches() {
  if (typeof MNUtil !== 'undefined' && MNUtil.log) {
    MNUtil.log("🔧 正在应用筛选功能修复补丁...");
  }
  
  try {
    patchFilterTasks();
    
    if (typeof MNUtil !== 'undefined' && MNUtil.log) {
      MNUtil.log("✅ 筛选功能修复补丁已应用");
    }
  } catch (error) {
    if (typeof MNUtil !== 'undefined' && MNUtil.log) {
      MNUtil.log("❌ 应用修复补丁时出错：" + error.message);
    }
  }
}

// 导出修复函数
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    applyFilterPatches,
    searchOverdueTasksInNotebook,
    searchHighPriorityTasksInNotebook
  };
}