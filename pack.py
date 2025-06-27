#!/usr/bin/env python3
"""
MN Toolbar Pro 打包脚本
功能：
1. 将 mntoolbar 目录打包成 .mnaddon 文件
2. 自动处理版本号
3. 生成发布说明
"""

import os
import re
import subprocess
import shutil
import datetime
import json

class MNToolbarPacker:
    def __init__(self):
        self.current_dir = os.getcwd()
        self.mntoolbar_dir = os.path.join(self.current_dir, 'mntoolbar')
        self.manifest_path = os.path.join(self.mntoolbar_dir, 'manifest.json')
        
    def read_manifest(self):
        """读取 manifest.json 获取版本信息"""
        try:
            with open(self.manifest_path, 'r', encoding='utf-8') as f:
                manifest = json.load(f)
                
            version = manifest.get('version', '0.0.0')
            title = manifest.get('title', 'MN Toolbar Pro')
            
            # 解析版本号
            match = re.match(r'(\d+)\.(\d+)\.(\d+)', version)
            if match:
                return {
                    'version': version,
                    'major': int(match.group(1)),
                    'minor': int(match.group(2)),
                    'patch': int(match.group(3)),
                    'title': title
                }
            else:
                print("⚠️  版本号格式不正确，使用默认版本")
                return {
                    'version': '0.0.0',
                    'major': 0,
                    'minor': 0,
                    'patch': 0,
                    'title': title
                }
                
        except Exception as e:
            print(f"❌ 读取 manifest.json 失败：{e}")
            return None
            
    def update_version(self, version_info, increment='patch'):
        """更新版本号"""
        if increment == 'major':
            version_info['major'] += 1
            version_info['minor'] = 0
            version_info['patch'] = 0
        elif increment == 'minor':
            version_info['minor'] += 1
            version_info['patch'] = 0
        elif increment == 'patch':
            version_info['patch'] += 1
            
        new_version = f"{version_info['major']}.{version_info['minor']}.{version_info['patch']}"
        version_info['version'] = new_version
        
        return new_version
        
    def write_manifest(self, version_info):
        """更新 manifest.json 中的版本号"""
        try:
            with open(self.manifest_path, 'r', encoding='utf-8') as f:
                manifest = json.load(f)
                
            manifest['version'] = version_info['version']
            
            with open(self.manifest_path, 'w', encoding='utf-8') as f:
                json.dump(manifest, f, indent=2, ensure_ascii=False)
                
            print(f"✅ 已更新版本号到：{version_info['version']}")
            return True
            
        except Exception as e:
            print(f"❌ 更新 manifest.json 失败：{e}")
            return False
            
    def create_release_notes(self, version, is_custom=False):
        """创建发布说明"""
        notes_path = os.path.join(self.current_dir, f'release_notes_v{version}.md')
        
        with open(notes_path, 'w', encoding='utf-8') as f:
            f.write(f"# MN Toolbar Pro v{version} 发布说明\n\n")
            f.write(f"发布时间：{datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            
            if is_custom:
                f.write("## 🎨 夏大鱼羊定制版\n\n")
                f.write("### 包含的自定义功能\n\n")
                f.write("1. **注册表模式**\n")
                f.write("   - 支持 198 个自定义 actions\n")
                f.write("   - 可动态加载和管理\n")
                f.write("   - 错误隔离，不影响主功能\n\n")
                
                f.write("2. **工具函数扩展**\n")
                f.write("   - xdyy_utils_extensions.js\n")
                f.write("   - 增强的工具函数库\n\n")
                
                f.write("3. **代码优化**\n")
                f.write("   - 修复了 foucsNote 拼写错误\n")
                f.write("   - 优化了代码缩进格式\n\n")
                
            f.write("## 更新内容\n\n")
            f.write("- [ ] 请在此处填写本次更新的具体内容\n")
            f.write("- [ ] \n")
            f.write("- [ ] \n\n")
            
            f.write("## 注意事项\n\n")
            f.write("- 更新前请备份您的自定义配置\n")
            f.write("- 如遇问题，可使用 update.py 脚本回滚\n")
            
        print(f"📄 发布说明已创建：{notes_path}")
        
        # 自动打开编辑（macOS）
        if os.name == 'posix':
            subprocess.run(f"open {notes_path}", shell=True)
            
        return notes_path
        
    def pack_addon(self, output_name):
        """打包 mnaddon 文件"""
        try:
            print(f"📦 正在打包：{output_name}")
            
            # 切换到插件目录
            original_dir = os.getcwd()
            os.chdir(self.mntoolbar_dir)
            
            # 执行打包命令
            result = subprocess.run(
                "mnaddon pack", 
                shell=True, 
                capture_output=True, 
                text=True
            )
            
            # 切回原目录
            os.chdir(original_dir)
            
            if result.returncode != 0:
                print(f"❌ 打包失败：{result.stderr}")
                return False
                
            # 移动并重命名文件
            packed_file = os.path.join(self.mntoolbar_dir, 'mntoolbar.mnaddon')
            if os.path.exists(packed_file):
                final_path = os.path.join(self.current_dir, output_name)
                shutil.move(packed_file, final_path)
                print(f"✅ 打包成功：{output_name}")
                return True
            else:
                print("❌ 未找到打包后的文件")
                return False
                
        except Exception as e:
            print(f"❌ 打包出错：{e}")
            return False
            
    def run(self):
        """执行打包流程"""
        print("🚀 MN Toolbar Pro 打包脚本启动\n")
        
        # 1. 读取当前版本
        version_info = self.read_manifest()
        if not version_info:
            return
            
        print(f"📌 当前版本：{version_info['version']}")
        
        # 2. 询问版本更新方式
        print("\n请选择版本更新方式：")
        print("1. 补丁版本 (patch) - 例：1.0.0 → 1.0.1")
        print("2. 次要版本 (minor) - 例：1.0.0 → 1.1.0")
        print("3. 主要版本 (major) - 例：1.0.0 → 2.0.0")
        print("4. 自定义版本 (custom)")
        print("5. 不更新版本")
        
        choice = input("\n请输入选择 (1-5): ").strip()
        
        if choice == '1':
            new_version = self.update_version(version_info, 'patch')
        elif choice == '2':
            new_version = self.update_version(version_info, 'minor')
        elif choice == '3':
            new_version = self.update_version(version_info, 'major')
        elif choice == '4':
            custom_version = input("请输入自定义版本号 (如 1.2.3): ").strip()
            if re.match(r'^\d+\.\d+\.\d+$', custom_version):
                version_info['version'] = custom_version
                new_version = custom_version
            else:
                print("❌ 版本号格式不正确")
                return
        elif choice == '5':
            new_version = version_info['version']
        else:
            print("❌ 无效的选择")
            return
            
        # 3. 更新 manifest.json
        if choice != '5':
            if not self.write_manifest(version_info):
                return
                
        # 4. 询问是否为定制版
        is_custom = input("\n是否为夏大鱼羊定制版？(y/n): ").strip().lower() == 'y'
        
        # 5. 生成输出文件名
        version_parts = new_version.split('.')
        base_name = f"mntoolbar_v{version_parts[0]}_{version_parts[1]}_{version_parts[2]}"
        
        if is_custom:
            # 定制版添加日期后缀
            date_suffix = datetime.datetime.now().strftime('%m%d')
            output_name = f"{base_name}_xdyy{date_suffix}.mnaddon"
        else:
            # 询问是否为 alpha 版本
            is_alpha = input("是否为 alpha 版本？(y/n): ").strip().lower() == 'y'
            if is_alpha:
                alpha_num = input("请输入 alpha 版本号 (如 0427): ").strip()
                output_name = f"{base_name}_alpha{alpha_num}.mnaddon"
            else:
                output_name = f"{base_name}.mnaddon"
                
        # 6. 创建发布说明
        self.create_release_notes(new_version, is_custom)
        
        # 7. 等待用户编辑发布说明
        input("\n请编辑发布说明后按回车继续...")
        
        # 8. 执行打包
        if self.pack_addon(output_name):
            print(f"\n✅ 打包完成！")
            print(f"📦 输出文件：{output_name}")
            print(f"📋 版本号：{new_version}")
            
            # 显示文件大小
            file_size = os.path.getsize(os.path.join(self.current_dir, output_name))
            print(f"📊 文件大小：{file_size / 1024 / 1024:.2f} MB")
        else:
            print("\n❌ 打包失败！")

if __name__ == "__main__":
    packer = MNToolbarPacker()
    packer.run()