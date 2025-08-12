/**
 * 测试增强功能
 * 用于验证任务卡片制卡功能的优化
 */

// 模拟测试数据
const testCases = {
  // 测试 1: 查找合适的父任务（包含已绑定任务）
  testFindSuitableParentTasks: function() {
    MNUtil.log("\n=== 测试 findSuitableParentTasks ===")
    
    // 获取焦点卡片
    const focusNote = MNNote.getFocusNote()
    if (!focusNote) {
      MNUtil.log("❌ 请先选择一个卡片")
      return
    }
    
    // 调用方法
    const candidates = MNTaskManager.findSuitableParentTasks(focusNote)
    
    // 输出结果
    MNUtil.log(`✅ 找到 ${candidates.length} 个候选父任务:`)
    candidates.forEach((c, index) => {
      const titleParts = MNTaskManager.parseTaskTitle(c.note.noteTitle)
      MNUtil.log(`  ${index + 1}. 【${titleParts.type}】${titleParts.content}`)
      MNUtil.log(`     理由: ${c.reason}, 优先级: ${c.priority}`)
    })
    
    // 检查是否包含已绑定任务
    const bindedCount = candidates.filter(c => c.reason === '已绑定的任务').length
    if (bindedCount > 0) {
      MNUtil.log(`✅ 包含 ${bindedCount} 个已绑定的任务`)
    }
  },
  
  // 测试 2: 任务搜索功能
  testSearchTasks: async function() {
    MNUtil.log("\n=== 测试任务搜索功能 ===")
    
    // 搜索关键词
    const keyword = "测试"
    MNUtil.log(`🔍 搜索关键词: "${keyword}"`)
    
    // 测试不忽略前缀
    let results = MNTaskManager.searchTasksInBoards(keyword, {
      ignorePrefix: false,
      boardKeys: ['goal', 'project', 'action']
    })
    MNUtil.log(`✅ 包含前缀搜索: 找到 ${results.length} 个任务`)
    
    // 测试忽略前缀
    results = MNTaskManager.searchTasksInBoards(keyword, {
      ignorePrefix: true,
      boardKeys: ['goal', 'project', 'action']
    })
    MNUtil.log(`✅ 忽略前缀搜索: 找到 ${results.length} 个任务`)
    
    // 显示前3个结果
    results.slice(0, 3).forEach((task, index) => {
      MNUtil.log(`  ${index + 1}. ${task.noteTitle}`)
    })
  },
  
  // 测试 3: 获取绑定的任务卡片
  testGetBindedTaskCards: function() {
    MNUtil.log("\n=== 测试 getBindedTaskCards ===")
    
    const focusNote = MNNote.getFocusNote()
    if (!focusNote) {
      MNUtil.log("❌ 请先选择一个卡片")
      return
    }
    
    const bindedTasks = MNTaskManager.getBindedTaskCards(focusNote)
    
    if (bindedTasks.length === 0) {
      MNUtil.log("ℹ️ 当前卡片没有绑定的任务")
    } else {
      MNUtil.log(`✅ 找到 ${bindedTasks.length} 个绑定的任务:`)
      bindedTasks.forEach((task, index) => {
        MNUtil.log(`  ${index + 1}. ${task.type} - ${task.status}`)
        MNUtil.log(`     ID: ${task.noteId}`)
      })
    }
  },
  
  // 测试 4: 验证搜索对话框（需要用户交互）
  testSearchDialog: async function() {
    MNUtil.log("\n=== 测试搜索对话框 ===")
    MNUtil.log("提示: 这个测试需要用户输入")
    
    const results = await MNTaskManager.searchTasksDialog()
    
    if (!results) {
      MNUtil.log("ℹ️ 用户取消了搜索")
    } else if (results.length === 0) {
      MNUtil.log("ℹ️ 没有找到匹配的任务")
    } else {
      MNUtil.log(`✅ 搜索成功，找到 ${results.length} 个任务`)
      results.slice(0, 5).forEach((task, index) => {
        const titleParts = MNTaskManager.parseTaskTitle(task.noteTitle)
        MNUtil.log(`  ${index + 1}. 【${titleParts.type}】${titleParts.content}`)
      })
    }
  }
}

// 运行测试
async function runTests() {
  MNUtil.log("🚀 开始测试任务卡片制卡增强功能")
  MNUtil.log("=" .repeat(50))
  
  try {
    // 运行各项测试
    testCases.testFindSuitableParentTasks()
    testCases.testGetBindedTaskCards()
    await testCases.testSearchTasks()
    
    // 询问是否运行交互式测试
    const runInteractive = await MNUtil.userConfirm(
      "交互式测试",
      "是否运行搜索对话框测试？（需要用户输入）"
    )
    
    if (runInteractive) {
      await testCases.testSearchDialog()
    }
    
    MNUtil.log("\n" + "=" .repeat(50))
    MNUtil.log("✅ 测试完成！")
    MNUtil.showHUD("✅ 功能测试完成")
    
  } catch (error) {
    MNUtil.log(`❌ 测试出错: ${error.message}`)
    MNUtil.showHUD("❌ 测试失败: " + error.message)
  }
}

// 执行测试
runTests()