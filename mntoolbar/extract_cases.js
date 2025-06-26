/**
 * 提取 webviewController.js 中特定范围的 case 代码
 * 用于辅助迁移到扩展文件
 */

const fs = require('fs');
const path = require('path');

// 配置
const config = {
  sourceFile: 'webviewController.js',
  startCase: 'case "test":',
  endCase: 'case "replaceFieldContentByPopup":',
  outputDir: 'extracted_cases'
};

// 主函数
function extractCases() {
  try {
    // 读取源文件
    const content = fs.readFileSync(config.sourceFile, 'utf8');
    const lines = content.split('\n');
    
    // 查找开始和结束位置
    let startLine = -1;
    let endLine = -1;
    let inCustomSection = false;
    let currentCase = null;
    let caseContent = [];
    const cases = {};
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // 检查是否到达开始位置
      if (line.includes(config.startCase)) {
        inCustomSection = true;
        startLine = i;
      }
      
      // 如果在自定义区域内
      if (inCustomSection) {
        // 检查是否是新的 case
        const caseMatch = line.match(/^\s*case\s+"([^"]+)":/);
        if (caseMatch) {
          // 保存前一个 case
          if (currentCase && caseContent.length > 0) {
            cases[currentCase] = caseContent.join('\n');
          }
          
          // 开始新的 case
          currentCase = caseMatch[1];
          caseContent = [line];
          
          // 检查是否到达结束位置
          if (line.includes(config.endCase)) {
            endLine = i;
            // 继续读取这个 case 的内容
          }
        } else if (currentCase) {
          // 添加到当前 case 的内容
          caseContent.push(line);
          
          // 检查是否遇到下一个 case 或结束
          if (line.match(/^\s*case\s+/) || line.includes('default:') || i === lines.length - 1) {
            // 结束当前 case
            if (currentCase === 'replaceFieldContentByPopup' && line.includes('break;')) {
              inCustomSection = false;
            }
          }
        }
      }
      
      // 如果已经处理完自定义部分
      if (endLine > -1 && !inCustomSection) {
        break;
      }
    }
    
    // 保存最后一个 case
    if (currentCase && caseContent.length > 0) {
      cases[currentCase] = caseContent.join('\n');
    }
    
    // 创建输出目录
    if (!fs.existsSync(config.outputDir)) {
      fs.mkdirSync(config.outputDir);
    }
    
    // 生成扩展文件内容
    generateExtensionFile(cases);
    
    // 输出统计信息
    console.log(`提取完成！`);
    console.log(`起始行: ${startLine + 1}`);
    console.log(`结束行: ${endLine + 1}`);
    console.log(`提取的 case 数量: ${Object.keys(cases).length}`);
    console.log(`\nCase 列表:`);
    Object.keys(cases).forEach(caseName => {
      console.log(`  - ${caseName}`);
    });
    
  } catch (error) {
    console.error('提取失败:', error);
  }
}

// 生成扩展文件
function generateExtensionFile(cases) {
  const template = `/**
 * 自动提取的自定义 Actions
 * 生成时间: ${new Date().toISOString()}
 */

const extractedActions = {
${Object.entries(cases).map(([name, content]) => {
  // 提取 case 内容（去除 case 行和 break）
  const lines = content.split('\n');
  const bodyLines = lines.slice(1, -1).filter(line => !line.trim().match(/^break;?$/));
  const body = bodyLines.join('\n');
  
  return `  /**
   * ${name}
   */
  "${name}": async function(context) {
    const { focusNote, focusNotes, button, des, self } = context;
    ${body}
  }`;
}).join(',\n\n')}
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = extractedActions;
}
`;

  fs.writeFileSync(path.join(config.outputDir, 'extracted_actions.js'), template);
  console.log(`\n生成文件: ${path.join(config.outputDir, 'extracted_actions.js')}`);
}

// 运行提取
extractCases();