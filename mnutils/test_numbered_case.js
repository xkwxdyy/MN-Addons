// 测试带序号的 Case 类型功能
// 在 MarginNote 中执行此代码来测试功能

// 测试函数
function testNumberedCase() {
  try {
    // 获取当前聚焦的笔记
    const note = MNNote.getFocusNote();
    if (!note) {
      MNUtil.showHUD("请先选择一个笔记卡片");
      return;
    }
    
    // 测试1: 自动序号 - 添加第一个 Case
    MNUtil.log("测试1: 添加第一个 Case");
    const case1Num = MNMath.addCaseComment(note, "这是第一个案例测试");
    MNUtil.log(`添加了 Case ${case1Num}`);
    
    // 测试2: 自动序号 - 添加第二个 Case
    MNUtil.log("测试2: 添加第二个 Case");
    const case2Num = MNMath.addCaseComment(note, "这是第二个案例测试");
    MNUtil.log(`添加了 Case ${case2Num}`);
    
    // 测试3: 手动指定序号
    MNUtil.log("测试3: 手动指定序号 10");
    const case10Num = MNMath.addCaseComment(note, "这是手动指定序号的案例", 10);
    MNUtil.log(`添加了 Case ${case10Num}`);
    
    // 测试4: 再次自动序号（应该是 11）
    MNUtil.log("测试4: 再次自动序号");
    const case11Num = MNMath.addCaseComment(note, "这应该是 Case 11");
    MNUtil.log(`添加了 Case ${case11Num}`);
    
    // 测试5: 添加 Step 类型
    MNUtil.log("测试5: 添加 Step 类型");
    const step1Num = MNMath.addStepComment(note, "第一步：准备工作");
    MNUtil.log(`添加了 Step ${step1Num}`);
    
    const step2Num = MNMath.addStepComment(note, "第二步：执行操作");
    MNUtil.log(`添加了 Step ${step2Num}`);
    
    // 测试6: 通用方法
    MNUtil.log("测试6: 使用通用方法添加 example");
    const exampleNum = MNMath.addNumberedComment(note, "示例内容", "example");
    MNUtil.log(`添加了 Example ${exampleNum}`);
    
    // 刷新笔记显示
    MNUtil.refreshNotebookView();
    
    MNUtil.showHUD("✅ 测试完成！请查看笔记中的新评论");
    
  } catch (error) {
    MNUtil.showHUD("❌ 测试失败：" + error.toString());
    MNUtil.log("测试错误详情：" + error.stack);
  }
}

// 执行测试
testNumberedCase();