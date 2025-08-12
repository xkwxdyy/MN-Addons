/**
 * 临时任务制卡功能测试脚本
 * 用于测试新增的临时任务创建和状态绑定功能
 */

// 测试1：获取进行中的任务
function testGetInProgressTasks() {
  MNUtil.log('\n========== 测试获取进行中的任务 ==========')
  
  const tasks = MNTaskManager.getInProgressTasks()
  MNUtil.log(`找到 ${tasks.length} 个进行中的任务：`)
  
  tasks.forEach((task, index) => {
    const titleParts = MNTaskManager.parseTaskTitle(task.noteTitle)
    MNUtil.log(`  ${index + 1}. 【${titleParts.type}】${titleParts.content}`)
  })
  
  return tasks
}

// 测试2：获取底层任务
function testGetBottomLevelTasks() {
  MNUtil.log('\n========== 测试获取底层任务 ==========')
  
  const tasks = MNTaskManager.getBottomLevelTasks({
    statuses: ['进行中', '未开始']
  })
  
  MNUtil.log(`找到 ${tasks.length} 个底层任务：`)
  
  tasks.forEach((task, index) => {
    const titleParts = MNTaskManager.parseTaskTitle(task.noteTitle)
    MNUtil.log(`  ${index + 1}. 【${titleParts.type}｜${titleParts.status}】${titleParts.content}`)
  })
  
  return tasks
}

// 测试3：智能查找父任务
function testFindSuitableParentTasks() {
  MNUtil.log('\n========== 测试智能查找父任务 ==========')
  
  const focusNote = MNNote.getFocusNote()
  if (!focusNote) {
    MNUtil.log('❌ 请先选择一个卡片')
    return
  }
  
  const candidates = MNTaskManager.findSuitableParentTasks(focusNote)
  MNUtil.log(`找到 ${candidates.length} 个候选父任务：`)
  
  candidates.forEach((candidate, index) => {
    const titleParts = MNTaskManager.parseTaskTitle(candidate.note.noteTitle)
    MNUtil.log(`  ${index + 1}. 【${titleParts.type}】${titleParts.content}`)
    MNUtil.log(`      理由: ${candidate.reason}`)
    MNUtil.log(`      优先级: ${candidate.priority}`)
  })
  
  return candidates
}

// 测试4：创建临时任务（模拟流程）
async function testCreateTemporaryTask() {
  MNUtil.log('\n========== 测试创建临时任务 ==========')
  
  const focusNote = MNNote.getFocusNote()
  if (!focusNote) {
    MNUtil.log('❌ 请先选择一个非任务卡片')
    return
  }
  
  // 检查是否是任务卡片
  if (MNTaskManager.isTaskCard(focusNote)) {
    MNUtil.log('⚠️ 当前选中的是任务卡片，临时任务创建适用于非任务卡片')
    return
  }
  
  MNUtil.log(`当前选中卡片: ${focusNote.noteTitle}`)
  MNUtil.log('即将触发临时任务创建流程...')
  
  // 调用创建临时任务
  const result = await MNTaskManager.createTemporaryTask(focusNote)
  
  if (result.type === 'created') {
    MNUtil.log('✅ 临时任务创建成功！')
    MNUtil.log(`  - 任务ID: ${result.noteId}`)
    MNUtil.log(`  - 任务标题: ${result.title}`)
    MNUtil.log(`  - 父任务: ${result.parentTitle}`)
  } else if (result.type === 'cancelled') {
    MNUtil.log('⚠️ 用户取消了操作')
  } else {
    MNUtil.log(`❌ 创建失败: ${result.error}`)
  }
  
  return result
}

// 测试5：获取绑定的任务卡片
function testGetBindedTaskCards() {
  MNUtil.log('\n========== 测试获取绑定的任务卡片 ==========')
  
  const focusNote = MNNote.getFocusNote()
  if (!focusNote) {
    MNUtil.log('❌ 请先选择一个卡片')
    return
  }
  
  const bindedTasks = MNTaskManager.getBindedTaskCards(focusNote)
  MNUtil.log(`找到 ${bindedTasks.length} 个绑定的任务：`)
  
  bindedTasks.forEach((task, index) => {
    MNUtil.log(`  ${index + 1}. 【${task.type}｜${task.status}】`)
    MNUtil.log(`      ID: ${task.noteId}`)
  })
  
  return bindedTasks
}

// 测试6：应用状态到绑定的任务
async function testApplyStatusToBindedCard() {
  MNUtil.log('\n========== 测试应用状态到绑定的任务 ==========')
  
  const focusNote = MNNote.getFocusNote()
  if (!focusNote) {
    MNUtil.log('❌ 请先选择一个卡片')
    return
  }
  
  const bindedTasks = MNTaskManager.getBindedTaskCards(focusNote)
  if (bindedTasks.length === 0) {
    MNUtil.log('⚠️ 当前卡片没有绑定的任务')
    return
  }
  
  MNUtil.log(`当前卡片有 ${bindedTasks.length} 个绑定的任务`)
  MNUtil.log('尝试应用"进行中"状态...')
  
  const result = await MNTaskManager.applyStatusToBindedCard(focusNote, '进行中')
  
  if (result) {
    if (result.type === 'applied') {
      MNUtil.log('✅ 状态应用成功')
      MNUtil.log(`  - 任务ID: ${result.taskId}`)
      MNUtil.log(`  - 新状态: ${result.newStatus}`)
    } else if (result.type === 'cancelled') {
      MNUtil.log('⚠️ 用户取消了操作')
    } else if (result.type === 'skipped') {
      MNUtil.log(`⚠️ 跳过: ${result.reason}`)
    }
  } else {
    MNUtil.log('❌ 没有绑定的任务')
  }
  
  return result
}

// 主测试函数
async function runAllTests() {
  MNUtil.log('\n🚀 ========== 开始测试临时任务功能 ==========\n')
  
  // 运行各个测试
  testGetInProgressTasks()
  testGetBottomLevelTasks()
  testFindSuitableParentTasks()
  
  // 异步测试需要等待
  // await testCreateTemporaryTask()
  
  testGetBindedTaskCards()
  // await testApplyStatusToBindedCard()
  
  MNUtil.log('\n✅ ========== 测试完成 ==========\n')
}

// 执行测试
// runAllTests()

// 导出测试函数供外部调用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testGetInProgressTasks,
    testGetBottomLevelTasks,
    testFindSuitableParentTasks,
    testCreateTemporaryTask,
    testGetBindedTaskCards,
    testApplyStatusToBindedCard,
    runAllTests
  }
}

// 提供简单的测试入口
MNUtil.log(`
📋 临时任务功能测试脚本已加载

可用的测试函数：
1. testGetInProgressTasks() - 测试获取进行中的任务
2. testGetBottomLevelTasks() - 测试获取底层任务
3. testFindSuitableParentTasks() - 测试智能查找父任务
4. testCreateTemporaryTask() - 测试创建临时任务（需要await）
5. testGetBindedTaskCards() - 测试获取绑定的任务卡片
6. testApplyStatusToBindedCard() - 测试应用状态到绑定任务（需要await）
7. runAllTests() - 运行所有测试（需要await）

使用方法：
1. 选择一个非任务卡片
2. 在控制台运行: testCreateTemporaryTask()
`)