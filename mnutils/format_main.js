const fs = require('fs');

// 读取文件
const content = fs.readFileSync('main.js', 'utf8');

// 使用简单的字符串替换进行基本格式化
function formatJavaScript(code) {
  let formatted = code;
  
  // 替换基本的代码结构
  formatted = formatted.split(';').join(';\n');
  formatted = formatted.split('{').join('{\n  ');
  formatted = formatted.split('}').join('\n}\n');
  formatted = formatted.split(',').join(', ');
  
  // 修复一些常见的格式问题
  formatted = formatted.replace(/\n\s*\n\s*\n/g, '\n\n');
  formatted = formatted.replace(/function\(/g, 'function (');
  formatted = formatted.replace(/if\(/g, 'if (');
  formatted = formatted.replace(/for\(/g, 'for (');
  formatted = formatted.replace(/while\(/g, 'while (');
  formatted = formatted.replace(/\)\{/g, ') {');
  
  return formatted;
}

// 格式化并保存
const formatted = formatJavaScript(content);
fs.writeFileSync('main_formatted.js', formatted);
console.log('File has been formatted and saved as main_formatted.js');
console.log('Original file size:', content.length);
console.log('Formatted file size:', formatted.length);
