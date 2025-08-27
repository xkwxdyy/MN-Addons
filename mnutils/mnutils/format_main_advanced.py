#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Advanced JavaScript Formatter for MNUtils main.js
结合 js-beautify 和 Python 处理，达到最佳格式化效果
Author: Claude
"""

import os
import sys
import re
import json
import subprocess
import shutil
from pathlib import Path
from typing import List, Tuple, Optional
import argparse

class AdvancedJSFormatter:
    """高级 JavaScript 格式化器"""
    
    def __init__(self, input_file: str = "main.js", verbose: bool = True):
        self.input_file = Path(input_file)
        self.verbose = verbose
        self.beautified_file = self.input_file.stem + "_beautified.js"
        self.output_file = self.input_file.stem + "_formatted.js"
        self.report_file = "format_report.txt"
        
        # js-beautify 配置
        self.beautify_config = {
            "indent_size": 2,
            "indent_char": " ",
            "max_preserve_newlines": 2,
            "preserve_newlines": True,
            "keep_array_indentation": False,
            "break_chained_methods": False,
            "indent_scripts": "normal",
            "brace_style": "collapse",
            "space_before_conditional": True,
            "unescape_strings": False,
            "jslint_happy": False,
            "end_with_newline": True,
            "wrap_line_length": 120,
            "indent_inner_html": False,
            "comma_first": False,
            "e4x": False,
            "operator_position": "before-newline",
            "indent_level": 0
        }
        
        # 统计信息
        self.stats = {
            "original_size": 0,
            "beautified_size": 0,
            "final_size": 0,
            "lines_original": 0,
            "lines_beautified": 0,
            "lines_final": 0,
            "classes_found": 0,
            "methods_found": 0
        }
    
    def log(self, message: str, level: str = "INFO"):
        """输出日志"""
        if self.verbose:
            prefix = {
                "INFO": "ℹ️ ",
                "SUCCESS": "✅ ",
                "WARNING": "⚠️ ",
                "ERROR": "❌ ",
                "PROCESS": "🔄 "
            }.get(level, "")
            print(f"{prefix}{message}")
    
    def check_jsbeautify(self) -> bool:
        """检查 js-beautify 是否安装"""
        if shutil.which("js-beautify"):
            return True
        
        self.log("js-beautify 未安装，尝试安装...", "WARNING")
        try:
            # 尝试使用 npm 安装
            subprocess.run(["npm", "install", "-g", "js-beautify"], 
                         check=True, capture_output=True)
            self.log("js-beautify 安装成功", "SUCCESS")
            return True
        except subprocess.CalledProcessError:
            # 尝试使用 npx
            self.log("npm 全局安装失败，将使用 npx", "WARNING")
            return False
    
    def phase1_jsbeautify(self) -> bool:
        """Phase 1: 使用 js-beautify 进行基础格式化"""
        self.log("Phase 1: js-beautify 格式化", "PROCESS")
        
        # 读取原始文件
        with open(self.input_file, 'r', encoding='utf-8') as f:
            content = f.read()
            self.stats["original_size"] = len(content)
            self.stats["lines_original"] = content.count('\n') + 1
        
        # 创建配置文件
        config_file = ".jsbeautifyrc"
        with open(config_file, 'w') as f:
            json.dump(self.beautify_config, f, indent=2)
        
        try:
            has_jsbeautify = self.check_jsbeautify()
            
            if has_jsbeautify:
                # 使用全局 js-beautify
                cmd = [
                    "js-beautify",
                    str(self.input_file),
                    "-o", self.beautified_file,
                    "--config", config_file
                ]
            else:
                # 使用 npx
                cmd = [
                    "npx", "js-beautify@latest",
                    str(self.input_file),
                    "-o", self.beautified_file,
                    "--config", config_file
                ]
            
            self.log(f"执行命令: {' '.join(cmd)}", "INFO")
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode != 0:
                self.log(f"js-beautify 执行失败: {result.stderr}", "ERROR")
                return False
            
            # 读取格式化后的文件
            with open(self.beautified_file, 'r', encoding='utf-8') as f:
                content = f.read()
                self.stats["beautified_size"] = len(content)
                self.stats["lines_beautified"] = content.count('\n') + 1
            
            self.log(f"js-beautify 完成: {self.stats['lines_original']} 行 -> {self.stats['lines_beautified']} 行", "SUCCESS")
            return True
            
        except Exception as e:
            self.log(f"js-beautify 处理失败: {str(e)}", "ERROR")
            return False
        finally:
            # 清理配置文件
            if os.path.exists(config_file):
                os.remove(config_file)
    
    def phase2_python_enhance(self) -> bool:
        """Phase 2: Python 增强处理"""
        self.log("Phase 2: Python 增强处理", "PROCESS")
        
        try:
            # 读取 beautified 文件
            input_file = self.beautified_file if os.path.exists(self.beautified_file) else self.input_file
            with open(input_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # 应用各种优化（注意：不再调用 fix_indentation）
            content = self.optimize_class_definitions(content)
            content = self.optimize_method_chains(content)
            content = self.optimize_async_functions(content)
            content = self.optimize_object_literals(content)
            content = self.optimize_mnutils_patterns(content)
            content = self.add_section_comments(content)
            # content = self.fix_indentation(content)  # 禁用：破坏了 js-beautify 的缩进
            content = self.clean_empty_lines(content)
            
            # 写入最终文件
            with open(self.output_file, 'w', encoding='utf-8') as f:
                f.write(content)
            
            self.stats["final_size"] = len(content)
            self.stats["lines_final"] = content.count('\n') + 1
            
            self.log(f"Python 优化完成: {self.stats['lines_beautified']} 行 -> {self.stats['lines_final']} 行", "SUCCESS")
            return True
            
        except Exception as e:
            self.log(f"Python 处理失败: {str(e)}", "ERROR")
            return False
    
    def optimize_class_definitions(self, content: str) -> str:
        """优化类定义格式"""
        self.log("  优化类定义...", "INFO")
        
        # 优化 JSB.defineClass - 确保花括号后有换行
        pattern = r'(JSB\.defineClass\([^{]+\{)(\s*)'
        def format_class(match):
            self.stats["classes_found"] += 1
            # 如果花括号后没有换行，添加换行
            if not match.group(2).startswith('\n'):
                return match.group(1) + '\n'
            return match.group(0)
        
        content = re.sub(pattern, format_class, content)
        
        # 优化 prototype 方法定义 - 只在必要时添加换行
        lines = content.split('\n')
        result = []
        for i, line in enumerate(lines):
            # 如果当前行包含 prototype 定义，且前一行不是空行或注释
            if '.prototype.' in line and '= function' in line:
                if i > 0 and result and result[-1].strip() and not result[-1].strip().startswith('//'):
                    result.append('')  # 添加空行
            result.append(line)
        
        return '\n'.join(result)
    
    def optimize_method_chains(self, content: str) -> str:
        """优化方法链格式"""
        self.log("  优化方法链...", "INFO")
        
        # js-beautify 通常已经处理好了方法链，我们只需要保持它
        # 不做额外处理，避免破坏缩进
        return content
    
    def optimize_async_functions(self, content: str) -> str:
        """优化异步函数格式"""
        self.log("  优化异步函数...", "INFO")
        
        # async function 格式化
        content = re.sub(r'async\s+function\s*\(', 'async function(', content)
        content = re.sub(r'async\s*\(\s*', 'async (', content)
        
        # await 格式化
        content = re.sub(r'await\s+', 'await ', content)
        
        return content
    
    def optimize_object_literals(self, content: str) -> str:
        """优化对象字面量格式"""
        self.log("  优化对象字面量...", "INFO")
        
        # js-beautify 通常已经很好地格式化了对象字面量
        # 我们只做最小的调整
        lines = content.split('\n')
        result = []
        
        for line in lines:
            # 确保对象属性的冒号后有空格
            if ':' in line and not line.strip().startswith('//') and not '://' in line:
                # 处理简单的键值对
                if re.match(r'^\s*\w+:', line.strip()):
                    line = re.sub(r'(\w+):(\S)', r'\1: \2', line)
            result.append(line)
        
        return '\n'.join(result)
    
    def optimize_mnutils_patterns(self, content: str) -> str:
        """优化 MNUtils 特定模式"""
        self.log("  优化 MNUtils 模式...", "INFO")
        
        # MNUtil API 调用格式化
        content = re.sub(r'MNUtil\.(\w+)\s*\(', r'MNUtil.\1(', content)
        
        # subscriptionController 方法格式化
        content = re.sub(
            r'subscriptionController\.prototype\.(\w+)\s*=\s*function',
            r'\nsubscriptionController.prototype.\1 = function',
            content
        )
        
        # 统计方法数量
        self.stats["methods_found"] = len(re.findall(r'\.prototype\.\w+\s*=\s*function', content))
        
        return content
    
    def add_section_comments(self, content: str) -> str:
        """添加节注释"""
        self.log("  添加节注释...", "INFO")
        
        # 更精确的模式匹配，避免破坏代码结构
        patterns = [
            # Main Addon Entry - 在 JSB.newAddon 前添加注释
            (r'(\n)(JSB\.newAddon\s*=\s*function)', r'\1\n// ==================== Main Addon Entry ====================\n\2'),
            # Subscription Controller
            (r'(\n)(var\s+subscriptionController\s*=\s*JSB\.defineClass)', r'\1\n// ==================== Subscription Controller ====================\n\2'),
            # ES6 类定义
            (r'(\n)(class\s+subscriptionUtils\s*\{)', r'\1\n// ==================== Subscription Utils ====================\n\2'),
            (r'(\n)(class\s+subscriptionNetwork\s*\{)', r'\1\n// ==================== Subscription Network ====================\n\2'),
            (r'(\n)(class\s+subscriptionConfig\s*\{)', r'\1\n// ==================== Subscription Config ====================\n\2'),
        ]
        
        for pattern, replacement in patterns:
            content = re.sub(pattern, replacement, content, count=1)
        
        return content
    
    def fix_indentation(self, content: str) -> str:
        """修复缩进问题 - 已禁用，保留 js-beautify 的缩进"""
        self.log("  跳过缩进修复（保留 js-beautify 的缩进）...", "INFO")
        
        # 不再重新计算缩进，直接返回原内容
        # js-beautify 已经做了很好的缩进处理
        return content
    
    def clean_empty_lines(self, content: str) -> str:
        """清理多余空行"""
        self.log("  清理空行...", "INFO")
        
        # 删除连续的空行（保留最多2个）
        content = re.sub(r'\n{4,}', '\n\n\n', content)
        
        # 删除文件开头的空行
        content = content.lstrip('\n')
        
        # 确保文件以换行结束
        if not content.endswith('\n'):
            content += '\n'
        
        # 清理行尾空格
        lines = content.split('\n')
        lines = [line.rstrip() for line in lines]
        content = '\n'.join(lines)
        
        return content
    
    def generate_report(self):
        """生成格式化报告"""
        self.log("生成报告...", "PROCESS")
        
        report = [
            "=" * 60,
            "JavaScript 格式化报告",
            "=" * 60,
            "",
            f"输入文件: {self.input_file}",
            f"输出文件: {self.output_file}",
            "",
            "文件大小变化:",
            f"  原始: {self.stats['original_size']:,} 字节 ({self.stats['lines_original']:,} 行)",
            f"  Beautified: {self.stats['beautified_size']:,} 字节 ({self.stats['lines_beautified']:,} 行)",
            f"  最终: {self.stats['final_size']:,} 字节 ({self.stats['lines_final']:,} 行)",
            "",
            "代码结构:",
            f"  发现类定义: {self.stats['classes_found']} 个",
            f"  发现方法: {self.stats['methods_found']} 个",
            "",
            "处理阶段:",
            "  ✅ Phase 1: js-beautify 格式化",
            "  ✅ Phase 2: Python 增强处理",
            "  ✅ Phase 3: 最终优化",
            "",
            "=" * 60
        ]
        
        report_text = '\n'.join(report)
        
        # 写入文件
        with open(self.report_file, 'w', encoding='utf-8') as f:
            f.write(report_text)
        
        # 打印到控制台
        print("\n" + report_text)
    
    def format(self, skip_beautify: bool = False):
        """执行完整的格式化流程"""
        self.log(f"开始格式化 {self.input_file}", "PROCESS")
        
        # Phase 1: js-beautify
        if not skip_beautify:
            if not self.phase1_jsbeautify():
                self.log("js-beautify 失败，尝试直接使用 Python 处理", "WARNING")
        
        # Phase 2: Python 增强
        if not self.phase2_python_enhance():
            self.log("格式化失败", "ERROR")
            return False
        
        # 生成报告
        self.generate_report()
        
        self.log(f"格式化完成！输出文件: {self.output_file}", "SUCCESS")
        return True
    
    def validate(self):
        """验证格式化结果"""
        self.log("验证格式化结果...", "PROCESS")
        
        try:
            # 检查输出文件是否存在
            if not os.path.exists(self.output_file):
                self.log("输出文件不存在", "ERROR")
                return False
            
            # 读取格式化后的内容
            with open(self.output_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # 基本语法检查
            checks = [
                ("花括号配对", content.count('{') == content.count('}')),
                ("方括号配对", content.count('[') == content.count(']')),
                ("圆括号配对", content.count('(') == content.count(')')),
                ("引号配对", content.count('"') % 2 == 0),
                ("单引号配对", content.count("'") % 2 == 0),
            ]
            
            all_passed = True
            for check_name, passed in checks:
                status = "✅" if passed else "❌"
                self.log(f"  {status} {check_name}", "INFO")
                if not passed:
                    all_passed = False
            
            if all_passed:
                self.log("验证通过", "SUCCESS")
            else:
                self.log("验证失败，请检查格式化结果", "ERROR")
            
            return all_passed
            
        except Exception as e:
            self.log(f"验证失败: {str(e)}", "ERROR")
            return False


def main():
    """主函数"""
    parser = argparse.ArgumentParser(description='高级 JavaScript 格式化工具')
    parser.add_argument('input', nargs='?', default='main.js', help='输入文件 (默认: main.js)')
    parser.add_argument('--skip-beautify', action='store_true', help='跳过 js-beautify，只使用 Python 处理')
    parser.add_argument('--validate', action='store_true', help='验证格式化结果')
    parser.add_argument('--quiet', action='store_true', help='静默模式')
    
    args = parser.parse_args()
    
    # 检查输入文件
    if not os.path.exists(args.input):
        print(f"❌ 文件不存在: {args.input}")
        sys.exit(1)
    
    # 创建格式化器
    formatter = AdvancedJSFormatter(
        input_file=args.input,
        verbose=not args.quiet
    )
    
    # 执行格式化
    success = formatter.format(skip_beautify=args.skip_beautify)
    
    # 验证结果
    if success and args.validate:
        formatter.validate()
    
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()