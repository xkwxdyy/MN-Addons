#!/usr/bin/env node

/**
 * 自动修复所有变量重声明问题
 * 通过反复运行语法检查并修复每个错误
 */

const fs = require('fs');
const { execSync } = require('child_process');

const inputFile = process.argv[2] || 'main_final.js';
const outputFile = process.argv[3] || 'main_fixed_final.js';

if (!fs.existsSync(inputFile)) {
  console.error(`文件不存在: ${inputFile}`);
  process.exit(1);
}

console.log('🔧 自动修复所有变量重声明问题...\n');

// 复制文件
let content = fs.readFileSync(inputFile, 'utf8');
fs.writeFileSync(outputFile, content, 'utf8');

let totalFixes = 0;
let iteration = 0;
const maxIterations = 50;

// 已知的修复映射
const knownFixes = {
  'getRandomAuthorization': {
    oldParam: 't',
    newParam: 'path',
    replace: [
      { from: "let t = 'https://dav.jianguoyun.com/dav/mnaddonStore/' + t", 
        to: "let url = 'https://dav.jianguoyun.com/dav/mnaddonStore/' + path" },
      { from: 'url: t', to: 'url: url' }
    ]
  }
};

while (iteration < maxIterations) {
  iteration++;
  console.log(`迭代 ${iteration}...`);
  
  try {
    // 尝试语法检查
    execSync(`node -c ${outputFile}`, { stdio: 'pipe' });
    console.log('✅ 语法检查通过！');
    break;
  } catch (error) {
    const errorMsg = error.stderr.toString();
    
    // 解析错误
    const lineMatch = errorMsg.match(/:(\d+)/);
    const varMatch = errorMsg.match(/Identifier '(\w+)' has already been declared/);
    
    if (!lineMatch || !varMatch) {
      console.log('无法解析错误，停止修复');
      console.log(errorMsg);
      break;
    }
    
    const errorLine = parseInt(lineMatch[1]);
    const varName = varMatch[1];
    
    console.log(`  发现错误: 第 ${errorLine} 行，变量 '${varName}' 重声明`);
    
    // 读取文件
    content = fs.readFileSync(outputFile, 'utf8');
    const lines = content.split('\n');
    
    // 查找函数定义
    let functionLine = -1;
    let functionName = null;
    
    for (let i = errorLine - 1; i >= Math.max(0, errorLine - 30); i--) {
      const funcMatch = lines[i].match(/(\w+)[:\s]*(?:async\s+)?function\s*\(([^)]*)\)/);
      if (funcMatch) {
        functionName = funcMatch[1];
        const params = funcMatch[2];
        if (params.includes(varName)) {
          functionLine = i;
          console.log(`  找到函数 ${functionName} 在第 ${i + 1} 行，参数包含 ${varName}`);
          break;
        }
      }
    }
    
    // 应用修复
    let fixed = false;
    
    // 检查是否有预定义的修复
    if (functionName && knownFixes[functionName]) {
      const fix = knownFixes[functionName];
      if (fix.oldParam === varName) {
        // 重命名函数参数
        lines[functionLine] = lines[functionLine].replace(
          new RegExp(`\\b${varName}\\b`),
          fix.newParam
        );
        
        // 应用替换规则
        for (const rule of fix.replace) {
          for (let i = functionLine; i < Math.min(functionLine + 50, lines.length); i++) {
            if (lines[i].includes(rule.from)) {
              lines[i] = lines[i].replace(rule.from, rule.to);
              console.log(`  ✅ 应用预定义修复: ${rule.from.substring(0, 30)}...`);
            }
          }
        }
        fixed = true;
      }
    }
    
    // 通用修复策略
    if (!fixed) {
      const errorLineContent = lines[errorLine - 1];
      
      // 策略1: 如果是 let/const/var 声明，改为赋值
      if (errorLineContent.match(new RegExp(`\\b(let|const|var)\\s+${varName}\\s*=`))) {
        lines[errorLine - 1] = errorLineContent.replace(
          new RegExp(`\\b(let|const|var)\\s+${varName}\\s*=`),
          `${varName} =`
        );
        console.log(`  ✅ 将声明改为赋值`);
        fixed = true;
      }
      
      // 策略2: 如果是链式声明，重命名变量
      else if (errorLineContent.trim().startsWith(`${varName} =`)) {
        // 给变量一个新名字
        const newVarName = `${varName}_${iteration}`;
        
        // 替换这一行
        lines[errorLine - 1] = errorLineContent.replace(
          new RegExp(`\\b${varName}\\b`, 'g'),
          newVarName
        );
        
        // 替换后续使用（在同一函数范围内）
        for (let i = errorLine; i < Math.min(errorLine + 20, lines.length); i++) {
          if (lines[i].includes('}')) break; // 函数结束
          if (lines[i].includes(varName)) {
            lines[i] = lines[i].replace(
              new RegExp(`\\b${varName}\\b`, 'g'),
              newVarName
            );
          }
        }
        
        console.log(`  ✅ 重命名变量 ${varName} → ${newVarName}`);
        fixed = true;
      }
      
      // 策略3: 如果函数参数和内部变量冲突，重命名参数
      else if (functionLine >= 0) {
        const newParamName = `${varName}_param`;
        
        // 重命名函数参数
        lines[functionLine] = lines[functionLine].replace(
          new RegExp(`\\b${varName}\\b`),
          newParamName
        );
        
        // 在错误行之前的使用也要改
        for (let i = functionLine + 1; i < errorLine - 1; i++) {
          // 只改变参数的使用，不改变新声明之前的
          if (!lines[i].match(new RegExp(`\\b(let|const|var)\\s+${varName}\\b`))) {
            lines[i] = lines[i].replace(
              new RegExp(`\\b${varName}\\b`, 'g'),
              newParamName
            );
          }
        }
        
        console.log(`  ✅ 重命名函数参数 ${varName} → ${newParamName}`);
        fixed = true;
      }
    }
    
    if (fixed) {
      totalFixes++;
      // 保存修复
      content = lines.join('\n');
      fs.writeFileSync(outputFile, content, 'utf8');
    } else {
      console.log('  ⚠️  无法自动修复，需要手动处理');
      break;
    }
  }
}

// 最终验证
console.log('\n' + '='.repeat(60));
console.log('修复完成，最终验证...\n');

try {
  execSync(`node -c ${outputFile}`, { stdio: 'pipe' });
  console.log('✅ 所有语法错误已修复！\n');
  console.log(`📁 输出文件: ${outputFile}`);
  console.log(`🔧 总修复数: ${totalFixes}`);
  console.log(`🔄 迭代次数: ${iteration}`);
  
  const size = fs.statSync(outputFile).size;
  console.log(`📏 文件大小: ${(size / 1024).toFixed(2)} KB`);
  
  console.log('\n使用建议:');
  console.log(`  cp ${outputFile} main.js`);
  
} catch (error) {
  console.log('❌ 仍有错误:');
  console.log(error.stderr.toString());
}