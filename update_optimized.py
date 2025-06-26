#!/usr/bin/env python3
"""
MN Toolbar 更新脚本（优化版）
功能：
1. 自动查找最新版本的 .mnaddon 文件
2. 解压并更新到 mntoolbar 和 mntoolbar_official 目录
3. 保留自定义文件（如 xdyytoolbar.js）
4. 自动修复常见的拼写错误
"""

import os
import re
import subprocess
import shutil
import filecmp
import json
from typing import Optional, Tuple, List, Dict
import argparse
import logging
from datetime import datetime

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

class MNToolbarUpdater:
    """MN Toolbar 更新器类"""
    
    def __init__(self, work_dir: str = '.'):
        self.work_dir = os.path.abspath(work_dir)
        self.custom_files = ['xdyytoolbar.js', 'XDYY_README.md', 'XDYY_开发指南.md']
        self.file_extensions = ['.js', '.html', '.json', '.css', '.svg']
        self.text_replacements = {
            'foucsNote': 'focusNote',  # 修复拼写错误
        }
        
    def find_latest_addon(self) -> Optional[str]:
        """查找最新版本的 .mnaddon 文件"""
        addon_files = [f for f in os.listdir(self.work_dir) 
                      if f.endswith('.mnaddon') and os.path.isfile(os.path.join(self.work_dir, f))]
        
        if not addon_files:
            logger.error("未找到任何 .mnaddon 文件")
            return None
        
        # 定义版本匹配模式
        pattern = r"mntoolbar_v(\d+)_(\d+)_(\d+)(?:_alpha(\d+))?\.mnaddon"
        
        versions = []
        for addon_file in addon_files:
            match = re.match(pattern, addon_file)
            if match:
                x, y, z = int(match.group(1)), int(match.group(2)), int(match.group(3))
                alpha = int(match.group(4)) if match.group(4) else None
                versions.append(((x, y, z, alpha), addon_file))
        
        if not versions:
            logger.error("未找到符合版本格式的 .mnaddon 文件")
            return None
        
        # 排序：先比较主版本号，alpha 版本号为 None 时视为正式版（排在后面）
        versions.sort(key=lambda v: (v[0][0], v[0][1], v[0][2], v[0][3] if v[0][3] is not None else float('inf')))
        
        latest_version = versions[-1]
        logger.info(f"找到最新版本：{latest_version[1]}")
        return os.path.join(self.work_dir, latest_version[1])
    
    def backup_custom_files(self, target_dir: str) -> Dict[str, bytes]:
        """备份自定义文件"""
        backups = {}
        for custom_file in self.custom_files:
            file_path = os.path.join(target_dir, custom_file)
            if os.path.exists(file_path):
                with open(file_path, 'rb') as f:
                    backups[custom_file] = f.read()
                logger.info(f"已备份自定义文件：{custom_file}")
        return backups
    
    def restore_custom_files(self, target_dir: str, backups: Dict[str, bytes]):
        """恢复自定义文件"""
        for filename, content in backups.items():
            file_path = os.path.join(target_dir, filename)
            with open(file_path, 'wb') as f:
                f.write(content)
            logger.info(f"已恢复自定义文件：{filename}")
    
    def unpack_addon(self, addon_path: str) -> Optional[str]:
        """解压 .mnaddon 文件"""
        target_dir = addon_path.replace('.mnaddon', '')
        
        # 如果目录已存在，先删除
        if os.path.exists(target_dir):
            shutil.rmtree(target_dir)
        
        try:
            # 根据系统选择合适的命令
            commands = ['mnaddon4 unpack', 'mnaddon unpack']
            
            for cmd_prefix in commands:
                try:
                    command = f"{cmd_prefix} {addon_path}"
                    result = subprocess.run(command, shell=True, capture_output=True, text=True)
                    
                    if result.returncode == 0:
                        logger.info(f"解压成功：{addon_path}")
                        return target_dir
                except:
                    continue
            
            logger.error(f"解压失败：所有命令都无法执行")
            return None
            
        except Exception as e:
            logger.error(f"解压失败：{e}")
            return None
    
    def apply_text_replacements(self, file_path: str) -> bool:
        """应用文本替换"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            for old_text, new_text in self.text_replacements.items():
                content = content.replace(old_text, new_text)
            
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                logger.info(f"已修正文件：{os.path.basename(file_path)}")
                return True
            
        except Exception as e:
            logger.error(f"处理文件 {file_path} 时出错：{e}")
        
        return False
    
    def update_directory(self, source_dir: str, target_dir: str, preserve_custom: bool = True):
        """更新目录"""
        if not os.path.exists(target_dir):
            logger.error(f"目标目录不存在：{target_dir}")
            return
        
        # 备份自定义文件
        custom_backups = {}
        if preserve_custom:
            custom_backups = self.backup_custom_files(target_dir)
        
        updated_files = []
        skipped_files = []
        
        # 复制文件
        for file in os.listdir(source_dir):
            # 跳过自定义文件
            if preserve_custom and file in self.custom_files:
                continue
                
            # 只处理指定扩展名的文件
            if any(file.endswith(ext) for ext in self.file_extensions):
                source_file = os.path.join(source_dir, file)
                target_file = os.path.join(target_dir, file)
                
                # 比较文件是否相同
                if os.path.exists(target_file) and filecmp.cmp(source_file, target_file):
                    skipped_files.append(file)
                    continue
                
                shutil.copy2(source_file, target_file)
                updated_files.append(file)
                
                # 对 JS 文件应用文本替换
                if file.endswith('.js'):
                    self.apply_text_replacements(target_file)
        
        # 恢复自定义文件
        if preserve_custom and custom_backups:
            self.restore_custom_files(target_dir, custom_backups)
        
        # 报告更新结果
        if updated_files:
            logger.info(f"更新了 {len(updated_files)} 个文件：{', '.join(updated_files[:5])}{'...' if len(updated_files) > 5 else ''}")
        if skipped_files:
            logger.info(f"跳过了 {len(skipped_files)} 个未变化的文件")
    
    def check_integration_files(self, target_dir: str):
        """检查集成所需的修改是否仍然存在"""
        integration_checks = [
            {
                'file': 'main.js',
                'checks': [
                    "JSB.require('xdyytoolbar')",
                    'executeCustomAction:',
                    'XDYYToolbar.init'
                ]
            },
            {
                'file': 'webviewController.js',
                'checks': [
                    'registerCustomActions',
                    'XDYYToolbar !== \'undefined\''
                ]
            }
        ]
        
        logger.info("\n检查自定义功能集成状态...")
        all_good = True
        
        for check in integration_checks:
            file_path = os.path.join(target_dir, check['file'])
            if os.path.exists(file_path):
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                missing = []
                for pattern in check['checks']:
                    if pattern not in content:
                        missing.append(pattern)
                
                if missing:
                    all_good = False
                    logger.warning(f"{check['file']} 缺少集成代码：{missing}")
                else:
                    logger.info(f"✅ {check['file']} 集成正常")
            else:
                logger.error(f"文件不存在：{check['file']}")
                all_good = False
        
        if not all_good:
            logger.warning("\n⚠️ 部分集成代码缺失，请参考 XDYY_README.md 重新应用集成修改")
        else:
            logger.info("\n✅ 所有集成代码正常")
    
    def find_extra_files(self, source_dir: str, target_dir: str) -> List[str]:
        """查找源目录中存在但目标目录中不存在的文件"""
        source_files = set(os.listdir(source_dir))
        target_files = set(os.listdir(target_dir))
        
        extra_files = source_files - target_files
        
        # 过滤掉 custom*.png 文件
        pattern = re.compile(r'custom\d+\.png')
        extra_files = [f for f in extra_files if not pattern.match(f)]
        
        return extra_files
    
    def run(self, skip_official: bool = False):
        """执行更新流程"""
        logger.info("=" * 60)
        logger.info("MN Toolbar 更新脚本开始执行")
        logger.info("=" * 60)
        
        # 查找最新版本
        latest_addon = self.find_latest_addon()
        if not latest_addon:
            return
        
        # 解压文件
        unpacked_dir = self.unpack_addon(latest_addon)
        if not unpacked_dir:
            return
        
        try:
            # 更新 mntoolbar 目录
            logger.info("\n更新 mntoolbar 目录...")
            mntoolbar_dir = os.path.join(self.work_dir, 'mntoolbar')
            self.update_directory(unpacked_dir, mntoolbar_dir, preserve_custom=True)
            
            # 检查集成状态
            self.check_integration_files(mntoolbar_dir)
            
            # 查找新文件
            extra_files = self.find_extra_files(unpacked_dir, mntoolbar_dir)
            if extra_files:
                logger.info(f"\n发现新文件：{extra_files}")
            
            # 更新 mntoolbar_official 目录
            if not skip_official:
                logger.info("\n更新 mntoolbar_official 目录...")
                official_dir = os.path.join(self.work_dir, 'mntoolbar_official')
                
                # 重新解压以获得干净的文件
                shutil.rmtree(unpacked_dir)
                unpacked_dir = self.unpack_addon(latest_addon)
                
                if unpacked_dir:
                    self.update_directory(unpacked_dir, official_dir, preserve_custom=False)
            
            logger.info("\n✅ 更新完成！")
            
        finally:
            # 清理解压目录
            if os.path.exists(unpacked_dir):
                shutil.rmtree(unpacked_dir)
                logger.info("已清理临时文件")

def main():
    """主函数"""
    parser = argparse.ArgumentParser(description='MN Toolbar 更新脚本')
    parser.add_argument('--skip-official', action='store_true', 
                       help='跳过更新 mntoolbar_official 目录')
    parser.add_argument('--dir', default='.', 
                       help='工作目录（默认为当前目录）')
    
    args = parser.parse_args()
    
    updater = MNToolbarUpdater(work_dir=args.dir)
    updater.run(skip_official=args.skip_official)

if __name__ == '__main__':
    main()