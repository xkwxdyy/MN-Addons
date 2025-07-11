/**
 * 测试今日看板修复效果的临时代码
 * 可以添加到 xdyy_custom_actions_registry.js 中测试
 */

// 测试函数：验证不同的评论添加方法
MNTaskGlobal.registerCustomAction("testTodayBoardFix", async function(context) {
  const { button, des, focusNote, focusNotes, self } = context;
  
  const todayBoardId = taskConfig.getBoardNoteId('today');
  if (!todayBoardId) {
    MNUtil.showHUD("请先配置今日看板");
    return;
  }
  
  const todayBoard = MNNote.new(todayBoardId);
  if (!todayBoard) {
    MNUtil.showHUD("今日看板不存在");
    return;
  }
  
  MNUtil.showHUD("🧪 开始测试评论添加功能...");
  
  // 测试结果收集
  const results = [];
  
  // 测试1：appendMarkdownComment
  try {
    todayBoard.appendMarkdownComment("## 测试1：Markdown 评论");
    results.push("✅ appendMarkdownComment 成功");
  } catch (e) {
    results.push(`❌ appendMarkdownComment 失败: ${e.message}`);
  }
  
  // 测试2：appendTextComment
  try {
    todayBoard.appendTextComment("测试2：文本评论");
    results.push("✅ appendTextComment 成功");
  } catch (e) {
    results.push(`❌ appendTextComment 失败: ${e.message}`);
  }
  
  // 测试3：appendHtmlComment
  try {
    todayBoard.appendHtmlComment("<h3>测试3：HTML 评论</h3>");
    results.push("✅ appendHtmlComment 成功");
  } catch (e) {
    results.push(`❌ appendHtmlComment 失败: ${e.message}`);
  }
  
  // 测试4：在 undoGrouping 中使用
  try {
    MNUtil.undoGrouping(() => {
      todayBoard.appendMarkdownComment("## 测试4：undoGrouping 中的 Markdown");
    });
    results.push("✅ undoGrouping + appendMarkdownComment 成功");
  } catch (e) {
    results.push(`❌ undoGrouping + appendMarkdownComment 失败: ${e.message}`);
  }
  
  // 测试5：延迟后在 undoGrouping 中使用
  MNUtil.delay(0.1).then(() => {
    try {
      MNUtil.undoGrouping(() => {
        todayBoard.appendMarkdownComment("## 测试5：延迟后的 Markdown");
      });
      results.push("✅ delay + undoGrouping + appendMarkdownComment 成功");
    } catch (e) {
      results.push(`❌ delay + undoGrouping + appendMarkdownComment 失败: ${e.message}`);
    }
    
    // 显示测试结果
    MNUtil.delay(0.5).then(() => {
      const report = results.join("\n");
      MNUtil.log("📊 测试结果：\n" + report);
      
      // 尝试使用工作的方法添加报告
      try {
        todayBoard.appendTextComment("=== 测试报告 ===");
        results.forEach(result => {
          todayBoard.appendTextComment(result);
        });
        todayBoard.appendTextComment("=== 测试完成 ===");
      } catch (e) {
        MNUtil.log("无法添加测试报告到看板");
      }
      
      MNUtil.showHUD("测试完成，请查看日志和看板内容");
    });
  });
});

// 快速修复函数：强制使用 appendTextComment
MNTaskGlobal.registerCustomAction("quickFixTodayBoard", async function(context) {
  const { button, des, focusNote, focusNotes, self } = context;
  
  const todayBoardId = taskConfig.getBoardNoteId('today');
  if (!todayBoardId) {
    MNUtil.showHUD("请先配置今日看板");
    return;
  }
  
  const todayBoard = MNNote.new(todayBoardId);
  if (!todayBoard) {
    MNUtil.showHUD("今日看板不存在");
    return;
  }
  
  MNUtil.showHUD("🔧 正在使用快速修复...");
  
  // 获取今日任务
  let todayTasks = MNTaskManager.filterTodayTasks();
  if (todayTasks.length === 0) {
    todayTasks = MNTaskManager.filterAllTodayTasks();
  }
  
  // 清理并重建
  MNUtil.undoGrouping(() => {
    MNTaskManager.clearTaskLinksFromBoard(todayBoard);
    const now = new Date();
    const dateStr = `${now.getMonth() + 1}月${now.getDate()}日`;
    todayBoard.noteTitle = `📅 今日看板 - ${dateStr}`;
  });
  
  // 使用 appendTextComment 添加内容
  MNUtil.delay(0.1).then(() => {
    if (todayTasks.length === 0) {
      todayBoard.appendTextComment("💡 暂无今日任务");
      MNUtil.showHUD("暂无今日任务");
      return;
    }
    
    const grouped = MNTaskManager.groupTodayTasks(todayTasks);
    
    // 手动添加内容（绕过可能有问题的方法）
    try {
      // 高优先级
      if (grouped.highPriority.length > 0) {
        todayBoard.appendTextComment("🔴 高优先级");
        grouped.highPriority.forEach(task => {
          const parts = MNTaskManager.parseTaskTitle(task.noteTitle);
          todayBoard.appendTextComment(`  • ${parts.content}`);
        });
      }
      
      // 进行中
      if (grouped.inProgress.length > 0) {
        todayBoard.appendTextComment("🔥 进行中");
        grouped.inProgress.forEach(task => {
          const parts = MNTaskManager.parseTaskTitle(task.noteTitle);
          todayBoard.appendTextComment(`  • ${parts.content}`);
        });
      }
      
      // 未开始
      if (grouped.notStarted.length > 0) {
        todayBoard.appendTextComment("😴 未开始");
        grouped.notStarted.forEach(task => {
          const parts = MNTaskManager.parseTaskTitle(task.noteTitle);
          todayBoard.appendTextComment(`  • ${parts.content}`);
        });
      }
      
      // 统计
      todayBoard.appendTextComment("✅ 统计信息");
      todayBoard.appendTextComment(`  总任务数：${todayTasks.length}`);
      
      MNUtil.showHUD(`✅ 快速修复完成\n共 ${todayTasks.length} 个任务`);
    } catch (e) {
      MNUtil.showHUD(`❌ 快速修复失败: ${e.message}`);
    }
  });
});