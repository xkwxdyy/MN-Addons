/**
 * MNTask 评论修改函数完整测试套件
 * 
 * 使用说明：
 * 1. 在 MarginNote 中选中要测试的任务卡片
 * 2. 打开插件控制台
 * 3. 逐段复制粘贴代码并执行
 * 4. 观察日志输出和卡片变化
 * 5. 测试完成后执行恢复函数
 * 
 * 测试卡片结构：
 * - 索引0: "这是任务描述" (纯文本)
 * - 索引1: 信息字段 (mainField)
 * - 索引2: 所属字段 + 链接 (subField)
 * - 索引3: 启动链接 (subField) 
 * - 索引4: 进展字段 (mainField)
 * - 索引5: 进展时间戳 (HTML格式)
 * - 索引6: "这是一个进展" (纯文本)
 */

// ================================================================
// 第一步：测试环境准备
// ================================================================

MNUtil.log("🚀 开始测试 MNTask 评论修改函数");

// 获取当前聚焦的卡片（确保你已经选中了那个动作卡片）
const testNote = MNNote.getFocusNote();
if (!testNote) {
  MNUtil.showHUD("❌ 请先选中要测试的任务卡片！");
  throw new Error("无测试卡片");
}

MNUtil.log(`📋 测试卡片: ${testNote.noteTitle}`);
MNUtil.log(`📊 评论总数: ${testNote.MNComments.length}`);

// 解析卡片结构
const parsed = MNTaskManager.parseTaskComments(testNote);
MNUtil.log("📈 解析结果:");
MNUtil.log(`  - 任务字段数量: ${parsed.taskFields.length}`);
MNUtil.log(`  - 信息字段: ${parsed.info ? '有' : '无'}`);
MNUtil.log(`  - 所属字段: ${parsed.belongsTo ? '有' : '无'}`);
MNUtil.log(`  - 进展字段: ${parsed.progress ? '有' : '无'}`);
MNUtil.log(`  - 启动字段: ${parsed.launch ? '有' : '无'}`);
MNUtil.log(`  - 链接数量: ${parsed.links.length}`);
MNUtil.log(`  - 纯文本评论: ${parsed.plainTextComments.length}`);

// 保存原始状态（用于测试后恢复）
const originalComments = testNote.MNComments.map(c => ({
  text: c.text,
  type: c.type
}));
MNUtil.log("💾 已保存原始状态，共 " + originalComments.length + " 个评论");

// 显示当前评论结构
MNUtil.log("📋 当前评论结构:");
testNote.MNComments.forEach((comment, index) => {
  const preview = comment.text.substring(0, 50);
  MNUtil.log(`  ${index}: ${preview}${comment.text.length > 50 ? '...' : ''}`);
});

// ================================================================
// 第二步：单个功能测试
// ================================================================

MNUtil.log("\n🔧 开始单个功能测试");

// 测试1: 按索引修改 - 修改任务描述（索引0）
MNUtil.log("\n📝 测试1: 按索引修改任务描述");
const test1 = MNTaskManager.modifyTaskComment(testNote, 
  {index: 0}, 
  "✅ 这是修改后的任务描述 - 测试索引修改功能"
);
MNUtil.log("结果: " + (test1.success ? "✅ 成功" : "❌ 失败") + " - " + test1.message);
if (test1.success) {
  MNUtil.log(`  修改了索引 ${test1.modifiedIndex}`);
}

// 测试2: 按字段名修改 - 修改进展字段内容
MNUtil.log("\n📊 测试2: 按字段名修改进展内容");  
const test2 = MNTaskManager.modifyTaskComment(testNote,
  {fieldName: "进展"},
  "🚀 项目进展已更新 - 当前完成度90%"
);
MNUtil.log("结果: " + (test2.success ? "✅ 成功" : "❌ 失败") + " - " + test2.message);

// 测试3: 按内容匹配修改 - 找到并修改包含"进展"的纯文本评论
MNUtil.log("\n🔍 测试3: 按内容匹配修改");
const test3 = MNTaskManager.modifyTaskComment(testNote,
  {contentMatch: "这是一个进展"},
  "📈 这是通过内容匹配修改的进展记录 - 功能测试成功"
);
MNUtil.log("结果: " + (test3.success ? "✅ 成功" : "❌ 失败") + " - " + test3.message);

// TODO 测试4: 按类型和上下文修改 - 在进展字段下找纯文本
MNUtil.log("\n🎯 测试4: 按类型和上下文修改");
const test4 = MNTaskManager.modifyTaskComment(testNote,
  {type: "plainText", fieldContext: "进展"},
  "🎊 通过类型和上下文定位的修改 - 高级功能测试"
);
MNUtil.log("结果: " + (test4.success ? "✅ 成功" : "❌ 失败") + " - " + test4.message);

// TODO 测试4.5: 启动字段专项测试 - 这是新增的重要测试
MNUtil.log("\n🚀 测试4.5: 启动字段专项测试");
// 先检查是否检测到了启动字段
if (parsed.launch) {
  MNUtil.log("✅ 启动字段已正确检测到");
  
  // 测试多种字段名格式
  const launchTests = [
    {name: "启动", desc: "使用字段名'启动'"},
    {name: "[启动]", desc: "使用字段名'[启动]'"},
    {name: "启动字段", desc: "使用包含'启动'的字段名"}
  ];
  
  for (let i = 0; i < launchTests.length; i++) {
    const testCase = launchTests[i];
    const testResult = MNTaskManager.modifyTaskComment(testNote,
      {fieldName: testCase.name},
      `🚀 启动字段修改测试 - ${testCase.desc} - ${new Date().toLocaleString()}`,
      {logDetails: false}
    );
    MNUtil.log(`  ${testCase.desc}: ${testResult.success ? '✅ 成功' : '❌ 失败'} - ${testResult.message}`);
    
    // 如果成功了，立即恢复以便下一个测试
    if (testResult.success && parsed.launch.comment.text) {
      MNTaskManager.modifyTaskComment(testNote, 
        {fieldName: testCase.name}, 
        parsed.launch.comment.text,
        {logDetails: false}
      );
    }
  }
} else {
  MNUtil.log("❌ 启动字段未被检测到 - 这表明存在问题");
  MNUtil.log("  请检查卡片是否包含启动字段，格式应为：<span...>[启动](url)</span>");
}

// 查看当前修改结果
MNUtil.log("\n📋 当前卡片状态（修改后）:");
testNote.MNComments.forEach((comment, index) => {
  const preview = comment.text.substring(0, 50);
  MNUtil.log(`  ${index}: ${preview}${comment.text.length > 50 ? '...' : ''}`);
});

// ================================================================
// 第三步：批量修改测试
// ================================================================

MNUtil.log("\n🚀 开始批量修改测试");

// 测试5: 批量修改多个字段
MNUtil.log("\n📦 测试5: 批量修改多个内容");
const batchModifications = [
  {
    selector: {index: 0}, 
    newContent: "🔥 批量修改 - 任务描述已更新"
  },
  {
    selector: {fieldName: "信息"}, 
    newContent: "📢 批量更新的信息字段内容"
  },
  {
    selector: {contentMatch: "进展"}, 
    newContent: "⚡ 批量修改的进展记录 - 效率提升"
  }
];

// 如果检测到启动字段，则添加启动字段的批量修改测试
if (parsed.launch) {
  batchModifications.push({
    selector: {fieldName: "启动"},
    newContent: `<span id="subField" style="background:#FFF;color:#FF8C5A;border:2px solid currentColor;border-radius:3px;padding:6px 12px;font-size:0.9em;font-weight:600;box-shadow:0 1px 3px rgba(255,140,90,0.2);display:inline-block;">[启动测试](marginnote4app://note/TEST-BATCH-MODIFY)</span>`
  });
  MNUtil.log("✅ 已添加启动字段到批量修改测试中");
} else {
  MNUtil.log("⚠️ 未检测到启动字段，跳过启动字段的批量修改测试");
}

const batchResult = MNTaskManager.modifyTaskComments(testNote, batchModifications, {
  useUndoGrouping: true,
  stopOnError: false,
  logDetails: true
});

MNUtil.log(`批量修改结果: 成功${batchResult.successCount}个，失败${batchResult.errorCount}个`);
batchResult.results.forEach((result, i) => {
  MNUtil.log(`  操作${i}: ${result.success ? '✅' : '❌'} ${result.message}`);
  if (result.success && result.modifiedIndex !== undefined) {
    MNUtil.log(`    修改了索引 ${result.modifiedIndex}`);
  }
});

// 测试6: 错误处理测试
MNUtil.log("\n⚠️ 测试6: 错误处理能力");
const errorTests = [
  {selector: {fieldName: "不存在的字段"}, newContent: "测试内容"},
  {selector: {index: 999}, newContent: "测试内容"},
  {selector: {contentMatch: "不存在的内容"}, newContent: "测试内容"}
];

const errorResult = MNTaskManager.modifyTaskComments(testNote, errorTests, {
  useUndoGrouping: false,
  stopOnError: false,
  logDetails: true
});

MNUtil.log(`错误处理测试: 预期全部失败，实际失败${errorResult.errorCount}个`);
errorResult.results.forEach((result, i) => {
  MNUtil.log(`  错误测试${i}: ${result.success ? '⚠️ 意外成功' : '✅ 正确失败'} - ${result.message}`);
});

// ================================================================
// 第四步：实际应用场景测试
// ================================================================

MNUtil.log("\n💼 实际应用场景测试");

// 场景1: 任务状态更新工作流
MNUtil.log("\n📋 场景1: 模拟任务状态更新");
const updateTaskStatus = (note, newStatus, progressDetails) => {
  return MNTaskManager.modifyTaskComments(note, [
    {
      selector: {fieldName: "进展"},
      newContent: `状态更新: ${newStatus}`
    },
    {
      selector: {type: "plainText", fieldContext: "进展"},
      newContent: `📅 ${new Date().toLocaleString()}\n${progressDetails}`
    }
  ], {useUndoGrouping: true});
};

const statusUpdate = updateTaskStatus(testNote, "进行中", "✨ 功能开发完成，正在进行测试验证");
MNUtil.log("状态更新结果: " + (statusUpdate.success ? "✅ 成功" : "❌ 失败"));
MNUtil.log(`  成功操作: ${statusUpdate.successCount}, 失败操作: ${statusUpdate.errorCount}`);

// 场景2: 智能内容更新
MNUtil.log("\n🤖 场景2: 智能内容处理");
const smartUpdate = MNTaskManager.modifyTaskComments(testNote, [
  {
    selector: {index: 0},
    newContent: "🎯 [已完成] 测试用例执行完毕 - 功能验证成功",
    options: {preserveFieldFormat: true}
  },
  {
    selector: {fieldName: "进展"},
    newContent: "🏆 测试阶段完成，准备发布",
    options: {logDetails: false}
  }
], {
  useUndoGrouping: true,
  stopOnError: false
});

MNUtil.log("智能更新结果: " + (smartUpdate.success ? "✅ 成功" : "❌ 失败"));
MNUtil.log(`  详细结果: 成功${smartUpdate.successCount}，失败${smartUpdate.errorCount}`);

// 场景3: 链接和特殊内容处理
MNUtil.log("\n🔗 场景3: 处理包含链接的字段");
if (parsed.belongsTo) {
  const linkTest = MNTaskManager.modifyTaskComment(testNote,
    {fieldName: "所属"},
    `<span id="subField" style="background:#FFF;color:#FF8C5A;border:2px solid currentColor;border-radius:3px;padding:6px 12px;font-size:0.9em;font-weight:600;box-shadow:0 1px 3px rgba(255,140,90,0.2);display:inline-block;"> 所属 </span> [测试修改链接](marginnote4app://note/TEST-LINK-ID)`,
    {preserveFieldFormat: false}
  );
  MNUtil.log("所属字段修改结果: " + (linkTest.success ? "✅ 成功" : "❌ 失败") + " - " + linkTest.message);
}

// 场景4: 启动字段特殊处理测试
MNUtil.log("\n🚀 场景4: 启动字段特殊处理");
if (parsed.launch) {
  // 保存原始启动链接以便恢复
  const originalLaunchText = parsed.launch.comment.text;
  
  // 测试修改启动链接
  const launchModifyTest = MNTaskManager.modifyTaskComment(testNote,
    {fieldName: "启动"},
    `<span id="subField" style="background:#FFF;color:#FF8C5A;border:2px solid currentColor;border-radius:3px;padding:6px 12px;font-size:0.9em;font-weight:600;box-shadow:0 1px 3px rgba(255,140,90,0.2);display:inline-block;">[测试启动](marginnote4app://note/TEST-LAUNCH-LINK)</span>`,
    {preserveFieldFormat: false, logDetails: true}
  );
  MNUtil.log("启动字段修改结果: " + (launchModifyTest.success ? "✅ 成功" : "❌ 失败") + " - " + launchModifyTest.message);
  
  if (launchModifyTest.success) {
    MNUtil.log("  修改后的启动字段内容预览: " + testNote.MNComments[launchModifyTest.modifiedIndex].text.substring(0, 80) + "...");
    
    // 恢复原始内容
    setTimeout(() => {
      MNTaskManager.modifyTaskComment(testNote,
        {fieldName: "启动"},
        originalLaunchText,
        {logDetails: false}
      );
      MNUtil.log("  ✅ 启动字段已恢复原始内容");
    }, 1000);
  }
} else {
  MNUtil.log("⚠️ 未检测到启动字段，跳过启动字段特殊处理测试");
}

// ================================================================
// 第五步：综合测试和验证
// ================================================================

MNUtil.log("\n🎪 综合功能测试");

// 运行内置测试函数
MNUtil.log("\n🧪 运行内置测试套件");
const comprehensiveTest = MNTaskManager.testModifyTaskCommentFunctions(testNote);
MNUtil.log(`内置测试结果: ${comprehensiveTest.passCount}/${comprehensiveTest.totalTests} 通过`);

if (comprehensiveTest.failCount > 0) {
  MNUtil.log("❌ 失败的测试项:");
  comprehensiveTest.testResults.forEach(result => {
    if (!result.success) {
      MNUtil.log(`  - ${result.testName}: ${result.message}`);
    }
  });
}

// 验证当前状态
MNUtil.log("\n📊 最终卡片状态:");
testNote.MNComments.forEach((comment, index) => {
  const preview = comment.text.substring(0, 60);
  MNUtil.log(`  ${index}: ${preview}${comment.text.length > 60 ? '...' : ''}`);
});

// ================================================================
// 第六步：恢复功能
// ================================================================

// 创建恢复函数（全局可用）
window.restoreOriginalContent = () => {
  MNUtil.log("\n🔄 开始恢复原始内容");
  let restoredCount = 0;
  let failedCount = 0;
  
  try {
    // 使用撤销分组确保可以一次性撤销
    MNUtil.undoGrouping(() => {
      originalComments.forEach((original, index) => {
        if (index < testNote.MNComments.length) {
          const result = MNTaskManager.modifyTaskComment(testNote, 
            {index: index}, 
            original.text,
            {logDetails: false}
          );
          
          if (result.success) {
            restoredCount++;
          } else {
            failedCount++;
            MNUtil.log(`❌ 恢复索引 ${index} 失败: ${result.message}`);
          }
        }
      });
    });
    
    MNUtil.log(`✅ 恢复完成: 成功${restoredCount}个，失败${failedCount}个`);
    if (failedCount === 0) {
      MNUtil.showHUD("✅ 所有内容已恢复到原始状态！");
    } else {
      MNUtil.showHUD(`⚠️ 部分恢复失败，请检查日志`);
    }
  } catch (error) {
    MNUtil.log("❌ 恢复过程异常: " + error.message);
    MNUtil.showHUD("❌ 恢复失败，请手动撤销");
  }
};

// 创建清理函数
window.clearTestGlobals = () => {
  delete window.restoreOriginalContent;
  delete window.clearTestGlobals;
  MNUtil.log("🧹 已清理测试全局函数");
};

// ================================================================
// 测试总结
// ================================================================

MNUtil.log("\n📊 === 测试总结 ===");
MNUtil.log("🎉 所有测试执行完成！");
MNUtil.log("");
MNUtil.log("📋 测试覆盖范围:");
MNUtil.log("  ✅ 4种定位策略（索引、字段、内容匹配、类型+上下文）");
MNUtil.log("  ✅ 批量修改和撤销分组");
MNUtil.log("  ✅ 错误处理机制");
MNUtil.log("  ✅ 实际应用场景");
MNUtil.log("  ✅ 内置测试套件");
MNUtil.log("  ✅ 特殊内容处理（HTML、链接等）");
MNUtil.log("  🚀 启动字段专项测试（修复了识别问题）");
MNUtil.log("");
MNUtil.log("🛠️ 测试后操作:");
MNUtil.log("  1. 按 CMD+Z 多次测试撤销功能");
MNUtil.log("  2. 或执行 restoreOriginalContent() 恢复原始内容");
MNUtil.log("  3. 执行 clearTestGlobals() 清理测试函数");
MNUtil.log("  4. 检查卡片内容是否按预期修改");
MNUtil.log("");
MNUtil.log("📈 性能统计:");
MNUtil.log(`  - 原始评论数: ${originalComments.length}`);
MNUtil.log(`  - 单个修改测试: 4项`);
MNUtil.log(`  - 批量修改测试: 2项`);
MNUtil.log(`  - 应用场景测试: 3项`);
MNUtil.log(`  - 内置测试: ${comprehensiveTest.totalTests}项`);

MNUtil.showHUD("🎊 测试完成！查看日志了解详细结果");

// ================================================================
// 快速测试函数（可选）
// ================================================================

// 创建快速测试函数
window.quickTest = () => {
  MNUtil.log("⚡ 执行快速测试");
  
  const quickTestNote = MNNote.getFocusNote();
  if (!quickTestNote) {
    MNUtil.showHUD("请先选中卡片");
    return;
  }
  
  const quickResult = MNTaskManager.modifyTaskComment(quickTestNote,
    {index: 0},
    `⚡ 快速测试 ${new Date().toLocaleString()}`
  );
  
  MNUtil.log("快速测试结果: " + (quickResult.success ? "✅ 成功" : "❌ 失败"));
  MNUtil.showHUD(quickResult.message);
};

// 创建启动字段专项测试函数
window.quickLaunchTest = () => {
  MNUtil.log("🚀 执行启动字段专项测试");
  
  const quickTestNote = MNNote.getFocusNote();
  if (!quickTestNote) {
    MNUtil.showHUD("请先选中卡片");
    return;
  }
  
  // 解析卡片检查是否有启动字段
  const quickParsed = MNTaskManager.parseTaskComments(quickTestNote);
  if (!quickParsed.launch) {
    MNUtil.log("❌ 未检测到启动字段");
    MNUtil.showHUD("该卡片没有启动字段");
    return;
  }
  
  const originalText = quickParsed.launch.comment.text;
  const quickResult = MNTaskManager.modifyTaskComment(quickTestNote,
    {fieldName: "启动"},
    `<span id="subField" style="background:#FFF;color:#FF8C5A;border:2px solid currentColor;border-radius:3px;padding:6px 12px;font-size:0.9em;font-weight:600;box-shadow:0 1px 3px rgba(255,140,90,0.2);display:inline-block;">[快速测试](marginnote4app://note/QUICK-TEST-${Date.now()})</span>`
  );
  
  MNUtil.log("启动字段快速测试结果: " + (quickResult.success ? "✅ 成功" : "❌ 失败"));
  MNUtil.showHUD(quickResult.message);
  
  // 3秒后自动恢复
  if (quickResult.success) {
    setTimeout(() => {
      MNTaskManager.modifyTaskComment(quickTestNote, {fieldName: "启动"}, originalText, {logDetails: false});
      MNUtil.log("✅ 启动字段已自动恢复");
    }, 3000);
  }
};

MNUtil.log("💡 提示: 可以随时执行以下函数进行快速验证:");
MNUtil.log("  - quickTest() - 快速功能验证");
MNUtil.log("  - quickLaunchTest() - 启动字段专项测试");
MNUtil.log("  - testProgressRecords() - 进展记录ID系统测试");

// ================================================================
// 进展记录ID系统完整测试套件
// ================================================================

/**
 * 进展记录ID系统完整测试
 * 测试新增的进展记录唯一ID功能
 */
const testProgressRecords = () => {
  MNUtil.log("🧪 开始进展记录ID系统测试");
  
  const progressTestNote = MNNote.getFocusNote();
  if (!progressTestNote) {
    MNUtil.showHUD("❌ 请先选中要测试的任务卡片！");
    return;
  }
  
  MNUtil.log(`📋 测试卡片: ${progressTestNote.noteTitle}`);
  
  // 保存原始状态
  const originalComments = progressTestNote.MNComments.map(c => c.text);
  
  try {
    // 测试1: 添加带ID的进展记录
    MNUtil.log("\n📝 测试1: 添加带ID的进展记录");
    const insertResult1 = MNTaskManager.insertProgressRecord(
      progressTestNote, 
      "这是第一条测试进展记录"
    );
    MNUtil.log(`结果: ${insertResult1.success ? '✅ 成功' : '❌ 失败'}`);
    MNUtil.log(`生成的ID: ${insertResult1.progressId}`);
    
    // 测试2: 再添加一条进展记录
    MNUtil.log("\n📝 测试2: 添加第二条进展记录");
    const insertResult2 = MNTaskManager.insertProgressRecord(
      progressTestNote, 
      "这是第二条测试进展记录"
    );
    MNUtil.log(`结果: ${insertResult2.success ? '✅ 成功' : '❌ 失败'}`);
    MNUtil.log(`生成的ID: ${insertResult2.progressId}`);
    
    // 等待1秒确保数据已更新
    setTimeout(() => {
      // 测试3: 获取所有进展记录
      MNUtil.log("\n📊 测试3: 获取所有进展记录");
      const progressRecords = MNTaskManager.getProgressRecords(progressTestNote);
      MNUtil.log(`找到 ${progressRecords.length} 条进展记录:`);
      progressRecords.forEach((record, index) => {
        MNUtil.log(`  ${index}: ID=${record.id}, 时间=${record.timestamp}, 内容="${record.content}"`);
      });
      
      if (progressRecords.length >= 2) {
        // 测试4: 修改最新进展记录
        MNUtil.log("\n✏️ 测试4: 修改最新进展记录");
        const modifyResult1 = MNTaskManager.modifyProgressRecord(
          progressTestNote,
          'latest',
          '修改后的最新进展记录内容'
        );
        MNUtil.log(`结果: ${modifyResult1.success ? '✅ 成功' : '❌ 失败'}`);
        
        // 测试5: 修改最早进展记录
        MNUtil.log("\n✏️ 测试5: 修改最早进展记录");
        const modifyResult2 = MNTaskManager.modifyProgressRecord(
          progressTestNote,
          'oldest',
          '修改后的最早进展记录内容'
        );
        MNUtil.log(`结果: ${modifyResult2.success ? '✅ 成功' : '❌ 失败'}`);
        
        // 测试6: 按具体ID修改进展记录
        const specificId = progressRecords[0].id;
        MNUtil.log(`\n🎯 测试6: 按具体ID修改进展记录 (${specificId})`);
        const modifyResult3 = MNTaskManager.modifyProgressRecord(
          progressTestNote,
          specificId,
          '按ID修改的进展记录内容'
        );
        MNUtil.log(`结果: ${modifyResult3.success ? '✅ 成功' : '❌ 失败'}`);
        
        setTimeout(() => {
          // 测试7: 验证 modifyTaskComment 的新选择器
          MNUtil.log("\n🔍 测试7: 验证 modifyTaskComment 的进展选择器");
          
          // 测试 progressId 选择器
          const selector1Result = MNTaskManager.modifyTaskComment(
            progressTestNote,
            { progressId: 'latest' },
            progressRecords[0].content.replace(/(<div[^>]*>.*?<\/div>)\s*(.*)$/s, '$1\n通过 progressId 选择器修改的内容')
          );
          MNUtil.log(`progressId 选择器测试: ${selector1Result.success ? '✅ 成功' : '❌ 失败'}`);
          
          // 测试 progressIndex 选择器
          const selector2Result = MNTaskManager.modifyTaskComment(
            progressTestNote,
            { progressIndex: 0 },
            progressRecords[0].content.replace(/(<div[^>]*>.*?<\/div>)\s*(.*)$/s, '$1\n通过 progressIndex 选择器修改的内容')
          );
          MNUtil.log(`progressIndex 选择器测试: ${selector2Result.success ? '✅ 成功' : '❌ 失败'}`);
          
          setTimeout(() => {
            // 测试8: 删除进展记录
            MNUtil.log("\n🗑️ 测试8: 删除最新进展记录");
            const deleteResult1 = MNTaskManager.deleteProgressRecord(progressTestNote, 'latest');
            MNUtil.log(`删除最新记录: ${deleteResult1.success ? '✅ 成功' : '❌ 失败'}`);
            
            MNUtil.log("\n🗑️ 测试9: 删除最早进展记录");
            const deleteResult2 = MNTaskManager.deleteProgressRecord(progressTestNote, 'oldest');
            MNUtil.log(`删除最早记录: ${deleteResult2.success ? '✅ 成功' : '❌ 失败'}`);
            
            // 最终验证
            setTimeout(() => {
              const finalRecords = MNTaskManager.getProgressRecords(progressTestNote);
              MNUtil.log(`\n📈 最终验证: 剩余进展记录 ${finalRecords.length} 条`);
              
              // 自动恢复原始状态
              MNUtil.log("\n🔄 正在恢复原始状态...");
              MNUtil.undoGrouping(() => {
                try {
                  // 清除所有评论
                  const mnComments = MNComment.from(progressTestNote);
                  for (let i = mnComments.length - 1; i >= 0; i--) {
                    mnComments[i].remove();
                  }
                  
                  // 恢复原始评论
                  originalComments.forEach(text => {
                    progressTestNote.appendMarkdownComment(text);
                  });
                  
                  progressTestNote.refresh();
                  MNUtil.log("✅ 原始状态已恢复");
                  MNUtil.showHUD("进展记录ID系统测试完成！");
                } catch (error) {
                  MNUtil.log(`❌ 恢复失败: ${error.message}`);
                }
              });
              
            }, 1000);
          }, 1000);
        }, 1000);
      }
    }, 1000);
    
  } catch (error) {
    MNUtil.log(`❌ 测试过程中发生错误: ${error.message}`);
    MNUtil.showHUD(`测试失败: ${error.message}`);
  }
};

/**
 * 进展记录解析功能测试
 * 专门测试 parseTaskComments 中的 progressRecords 解析
 */
const testProgressParsing = () => {
  MNUtil.log("🔍 开始进展记录解析功能测试");
  
  const parseTestNote = MNNote.getFocusNote();
  if (!parseTestNote) {
    MNUtil.showHUD("❌ 请先选中要测试的任务卡片！");
    return;
  }
  
  // 解析当前卡片
  const parsed = MNTaskManager.parseTaskComments(parseTestNote);
  
  MNUtil.log(`📊 解析结果:`);
  MNUtil.log(`  - 总评论数: ${parseTestNote.MNComments.length}`);
  MNUtil.log(`  - 进展记录数: ${parsed.progressRecords.length}`);
  
  if (parsed.progressRecords.length > 0) {
    MNUtil.log(`📋 进展记录详情:`);
    parsed.progressRecords.forEach((record, index) => {
      MNUtil.log(`  ${index + 1}. ID: ${record.id}`);
      MNUtil.log(`     时间戳: ${record.timestamp}`);
      MNUtil.log(`     评论索引: ${record.commentIndex}`);
      MNUtil.log(`     内容: "${record.content}"`);
      MNUtil.log(`     旧格式: ${record.isLegacy ? '是' : '否'}`);
    });
  } else {
    MNUtil.log("⚠️ 当前卡片没有进展记录");
    MNUtil.log("💡 建议先使用 addTimestampRecord 添加一些进展记录再测试");
  }
  
  MNUtil.showHUD(`解析到 ${parsed.progressRecords.length} 条进展记录`);
};

// 更新提示信息
MNUtil.log("  - testProgressParsing() - 进展记录解析测试");