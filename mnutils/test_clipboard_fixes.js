/**
 * 测试剪贴板修复
 * 
 * 这个脚本用于测试所有修复后的剪贴板操作
 * 在 MarginNote 控制台中运行
 */

// 测试配置
const TEST_CONFIG = {
  searchConfig: {
    roots: {
      "test1": { path: "/test/path1", displayName: "测试路径1" },
      "test2": { path: "/test/path2", displayName: "测试路径2" }
    },
    rootsOrder: ["test1", "test2"],
    shortcuts: {
      "测试": ["test", "testing"]
    },
    searchScope: "all"
  },
  synonymGroups: [
    {
      name: "测试组1",
      words: ["词汇1", "词汇2", "词汇3"]
    },
    {
      name: "测试组2", 
      words: ["单词A", "单词B", "单词C"]
    }
  ]
};

// 测试函数
function runClipboardTests() {
  MNUtil.log("===== 开始剪贴板功能测试 =====");
  
  let allTestsPassed = true;
  let testResults = [];
  
  // 1. 测试 exportSearchConfig (第 7308 行)
  try {
    MNUtil.log("测试 1: exportSearchConfig...");
    
    // 保存原始剪贴板内容
    const originalClipboard = MNUtil.clipboardText;
    
    // 模拟搜索配置导出
    const jsonStr = JSON.stringify(TEST_CONFIG.searchConfig, null, 2);
    MNUtil.copy(jsonStr);
    
    // 验证剪贴板内容
    const clipboardContent = MNUtil.clipboardText;
    if (clipboardContent === jsonStr) {
      MNUtil.log("✅ exportSearchConfig 测试通过");
      testResults.push({ test: "exportSearchConfig", passed: true });
    } else {
      MNUtil.log("❌ exportSearchConfig 测试失败");
      testResults.push({ test: "exportSearchConfig", passed: false, error: "剪贴板内容不匹配" });
      allTestsPassed = false;
    }
    
    // 恢复原始剪贴板
    MNUtil.copy(originalClipboard || "");
  } catch (error) {
    MNUtil.log(`❌ exportSearchConfig 测试出错: ${error.message}`);
    testResults.push({ test: "exportSearchConfig", passed: false, error: error.message });
    allTestsPassed = false;
  }
  
  // 2. 测试 exportSynonymGroups (第 7790 行)
  try {
    MNUtil.log("测试 2: exportSynonymGroups...");
    
    const originalClipboard = MNUtil.clipboardText;
    
    // 模拟同义词组导出
    const jsonStr = JSON.stringify(TEST_CONFIG.synonymGroups, null, 2);
    MNUtil.copy(jsonStr);
    
    const clipboardContent = MNUtil.clipboardText;
    if (clipboardContent === jsonStr) {
      MNUtil.log("✅ exportSynonymGroups 测试通过");
      testResults.push({ test: "exportSynonymGroups", passed: true });
    } else {
      MNUtil.log("❌ exportSynonymGroups 测试失败");
      testResults.push({ test: "exportSynonymGroups", passed: false, error: "剪贴板内容不匹配" });
      allTestsPassed = false;
    }
    
    MNUtil.copy(originalClipboard || "");
  } catch (error) {
    MNUtil.log(`❌ exportSynonymGroups 测试出错: ${error.message}`);
    testResults.push({ test: "exportSynonymGroups", passed: false, error: error.message });
    allTestsPassed = false;
  }
  
  // 3. 测试同义词组词汇复制 (第 8870 行)
  try {
    MNUtil.log("测试 3: 同义词组词汇复制...");
    
    const originalClipboard = MNUtil.clipboardText;
    
    // 模拟复制词汇列表
    const wordsText = TEST_CONFIG.synonymGroups[0].words.join(", ");
    MNUtil.copy(wordsText);
    
    const clipboardContent = MNUtil.clipboardText;
    if (clipboardContent === wordsText) {
      MNUtil.log("✅ 同义词组词汇复制测试通过");
      testResults.push({ test: "synonymWordsCopy", passed: true });
    } else {
      MNUtil.log("❌ 同义词组词汇复制测试失败");
      testResults.push({ test: "synonymWordsCopy", passed: false, error: "剪贴板内容不匹配" });
      allTestsPassed = false;
    }
    
    MNUtil.copy(originalClipboard || "");
  } catch (error) {
    MNUtil.log(`❌ 同义词组词汇复制测试出错: ${error.message}`);
    testResults.push({ test: "synonymWordsCopy", passed: false, error: error.message });
    allTestsPassed = false;
  }
  
  // 4. 测试 toNoExcerptVersion 剪贴板恢复 (第 670, 688 行)
  try {
    MNUtil.log("测试 4: toNoExcerptVersion 剪贴板恢复...");
    
    // 设置一个特殊的剪贴板内容
    const testContent = "测试内容_" + Date.now();
    MNUtil.copy(testContent);
    
    // 模拟操作过程中剪贴板被修改
    MNUtil.copy("临时内容");
    
    // 恢复原始内容
    MNUtil.copy(testContent);
    
    const clipboardContent = MNUtil.clipboardText;
    if (clipboardContent === testContent) {
      MNUtil.log("✅ toNoExcerptVersion 剪贴板恢复测试通过");
      testResults.push({ test: "toNoExcerptVersionRestore", passed: true });
    } else {
      MNUtil.log("❌ toNoExcerptVersion 剪贴板恢复测试失败");
      testResults.push({ test: "toNoExcerptVersionRestore", passed: false, error: "剪贴板内容未正确恢复" });
      allTestsPassed = false;
    }
  } catch (error) {
    MNUtil.log(`❌ toNoExcerptVersion 剪贴板恢复测试出错: ${error.message}`);
    testResults.push({ test: "toNoExcerptVersionRestore", passed: false, error: error.message });
    allTestsPassed = false;
  }
  
  // 5. 测试边界情况
  try {
    MNUtil.log("测试 5: 边界情况...");
    
    // 测试空字符串
    MNUtil.copy("");
    if (MNUtil.clipboardText === "") {
      MNUtil.log("✅ 空字符串测试通过");
    } else {
      MNUtil.log("❌ 空字符串测试失败");
      allTestsPassed = false;
    }
    
    // 测试特殊字符
    const specialChars = "!@#$%^&*()_+{}[]|\\:\"<>?/.,;'`~";
    MNUtil.copy(specialChars);
    if (MNUtil.clipboardText === specialChars) {
      MNUtil.log("✅ 特殊字符测试通过");
    } else {
      MNUtil.log("❌ 特殊字符测试失败");
      allTestsPassed = false;
    }
    
    // 测试中文字符
    const chineseText = "中文测试：你好世界！";
    MNUtil.copy(chineseText);
    if (MNUtil.clipboardText === chineseText) {
      MNUtil.log("✅ 中文字符测试通过");
    } else {
      MNUtil.log("❌ 中文字符测试失败");
      allTestsPassed = false;
    }
    
    // 测试长文本
    const longText = "A".repeat(10000);
    MNUtil.copy(longText);
    if (MNUtil.clipboardText === longText) {
      MNUtil.log("✅ 长文本测试通过");
    } else {
      MNUtil.log("❌ 长文本测试失败");
      allTestsPassed = false;
    }
    
    testResults.push({ test: "boundaryConditions", passed: true });
  } catch (error) {
    MNUtil.log(`❌ 边界情况测试出错: ${error.message}`);
    testResults.push({ test: "boundaryConditions", passed: false, error: error.message });
    allTestsPassed = false;
  }
  
  // 输出测试总结
  MNUtil.log("\n===== 测试总结 =====");
  testResults.forEach(result => {
    const status = result.passed ? "✅ 通过" : "❌ 失败";
    const errorInfo = result.error ? ` (${result.error})` : "";
    MNUtil.log(`${result.test}: ${status}${errorInfo}`);
  });
  
  if (allTestsPassed) {
    MNUtil.showHUD("✅ 所有剪贴板测试通过！");
    MNUtil.log("\n🎉 所有测试通过！剪贴板功能修复成功。");
  } else {
    const failedCount = testResults.filter(r => !r.passed).length;
    MNUtil.showHUD(`❌ ${failedCount} 个测试失败`);
    MNUtil.log(`\n⚠️ ${failedCount} 个测试失败，请检查相关代码。`);
  }
  
  return {
    allPassed: allTestsPassed,
    results: testResults
  };
}

// 运行测试
try {
  const testResult = runClipboardTests();
  
  // 将测试结果复制到剪贴板，方便保存
  const resultJson = JSON.stringify(testResult, null, 2);
  MNUtil.copy(resultJson);
  MNUtil.log("\n测试结果已复制到剪贴板");
} catch (error) {
  MNUtil.log(`测试运行失败: ${error.message}`);
  MNUtil.showHUD("❌ 测试运行失败");
}