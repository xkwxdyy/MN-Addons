#!/usr/bin/env python3
"""
MNOCR 插件更新脚本 v2.0 - 增量更新版本

功能：
1. 识别最新的 mnaddon 文件
2. 解压官方版本到 mnocr_official/
3. 增量更新到 mnocr/（保留自定义文件）
4. 自动应用 OCR → Title 功能补丁

改进：
- 采用增量更新策略，不删除 mnocr/ 目录
- 保留自定义文件（如 CLAUDE.md）
- 新增文件会自动添加
- 更新文件会被覆盖并重新应用补丁

作者：Claude Code
版本：2.0
"""

import os
import re
import subprocess
import shutil
import filecmp


class MNOCRUpdater:
    """MNOCR 插件更新管理器 - 增量更新版本"""
    
    def __init__(self):
        self.current_dir = os.getcwd()
        self.official_dir = os.path.join(self.current_dir, 'mnocr_official')
        self.custom_dir = os.path.join(self.current_dir, 'mnocr')
        self.temp_dir = os.path.join(self.current_dir, 'mnocr_temp')  # 临时解压目录
        self.target_addon = None
        
    def print_banner(self):
        """打印欢迎横幅"""
        print("=" * 60)
        print("🚀 MNOCR 插件更新脚本 v2.0 - 增量更新版")
        print("📁 工作目录:", self.current_dir)
        print("=" * 60)
    
    def find_latest_addon(self):
        """查找最新的 mnaddon 文件"""
        print("\n🔍 查找 mnaddon 文件...")
        
        addon_files = [f for f in os.listdir('.') if f.endswith('.mnaddon')]
        if not addon_files:
            print("❌ 未找到任何 .mnaddon 文件")
            return False
            
        print(f"📦 找到 {len(addon_files)} 个 mnaddon 文件:")
        for file in addon_files:
            print(f"   - {file}")
            
        # 使用修改时间来确定最新文件（简单策略）
        latest_file = max(addon_files, key=lambda f: os.path.getmtime(f))
        self.target_addon = os.path.join(self.current_dir, latest_file)
        
        print(f"✅ 选择最新文件: {latest_file}")
        return True
    
    def cleanup_temp_directories(self):
        """清理临时目录（保留 mnocr/）"""
        print("\n🧹 清理临时目录...")
        
        for dir_path in [self.official_dir, self.temp_dir]:
            if os.path.exists(dir_path):
                shutil.rmtree(dir_path)
                print(f"   删除: {os.path.basename(dir_path)}/")
    
    def unpack_addon(self, target_dir, description):
        """解压插件到指定目录"""
        print(f"\n📦 {description}...")
        
        try:
            # 使用 mnaddon4 unpack 命令解压
            cmd = f"mnaddon4 unpack {self.target_addon}"
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
            
            if result.returncode != 0:
                print(f"❌ 解压失败: {result.stderr}")
                return False
                
            # 获取解压后的目录名（去掉 .mnaddon 扩展名）
            addon_name = os.path.basename(self.target_addon).replace('.mnaddon', '')
            extracted_dir = os.path.join(self.current_dir, addon_name)
            
            if not os.path.exists(extracted_dir):
                print(f"❌ 解压目录不存在: {extracted_dir}")
                return False
                
            # 移动到目标目录
            shutil.move(extracted_dir, target_dir)
            print(f"✅ 解压完成: {os.path.basename(target_dir)}/")
            return True
            
        except Exception as e:
            print(f"❌ 解压时出错: {e}")
            return False
    
    def incremental_update(self):
        """增量更新 mnocr/ 目录"""
        print("\n📂 增量更新定制版...")
        
        # 确保 mnocr 目录存在
        if not os.path.exists(self.custom_dir):
            os.makedirs(self.custom_dir)
            print(f"   创建目录: {os.path.basename(self.custom_dir)}/")
        
        # 复制文件从临时目录到定制目录
        updated_files = []
        new_files = []
        skipped_files = []
        
        for file in os.listdir(self.temp_dir):
            # 跳过特定文件扩展名
            if file.endswith(('.js', '.html', '.json', '.css', '.png', '.svg', '.jpg', '.jpeg')):
                temp_file = os.path.join(self.temp_dir, file)
                custom_file = os.path.join(self.custom_dir, file)
                
                if os.path.exists(custom_file):
                    # 文件存在，检查是否需要更新
                    if filecmp.cmp(temp_file, custom_file):
                        skipped_files.append(file)
                        continue
                    else:
                        shutil.copy2(temp_file, custom_file)
                        updated_files.append(file)
                        print(f"   更新: {file}")
                else:
                    # 新文件，直接复制
                    shutil.copy2(temp_file, custom_file)
                    new_files.append(file)
                    print(f"   新增: {file}")
        
        # 统计信息
        if updated_files:
            print(f"📝 更新了 {len(updated_files)} 个文件")
        if new_files:
            print(f"➕ 新增了 {len(new_files)} 个文件")
        if skipped_files:
            print(f"⏭️  跳过了 {len(skipped_files)} 个未变化的文件")
        
        return True
    
    def apply_webviewcontroller_patches(self, file_path):
        """应用 webviewController.js 的补丁"""
        print("   📝 应用 webviewController.js 补丁...")
        
        if not os.path.exists(file_path):
            print(f"   ❌ 文件不存在: {file_path}")
            return False
            
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            patches_applied = 0
            
            # 补丁 1: 添加 OCRTitleButton 创建代码
            pattern1 = r'(self\.OCREditorButton = self\.createButton\("beginOCR:","ocrView"\)\s+self\.OCREditorButton\.action = "toEditor"\s+MNButton\.setTitle\(self\.OCREditorButton, "OCR → Editor",fontSize,true\)\s+MNButton\.setColor\(self\.OCREditorButton, "#457bd3",0\.8\)\s+MNButton\.setRadius\(self\.OCREditorButton, 10\))'
            replacement1 = r'''\1

    self.OCRTitleButton = self.createButton("beginOCR:","ocrView")
    self.OCRTitleButton.action = "toTitle"
    MNButton.setTitle(self.OCRTitleButton, "OCR → Title",fontSize,true)
    MNButton.setColor(self.OCRTitleButton, "#457bd3",0.8)
    MNButton.setRadius(self.OCRTitleButton, 10)'''
            
            if re.search(pattern1, content, re.DOTALL) and 'OCRTitleButton' not in content:
                content = re.sub(pattern1, replacement1, content, flags=re.DOTALL)
                patches_applied += 1
                
            # 补丁 2: 添加按钮布局设置
            pattern2 = r'(self\.OCREditorButton\.frame = \{x: xLeft\+15 ,y: 210,width: 230,height: buttonHeight\};)'
            replacement2 = r'''\1
    self.OCRTitleButton.frame = {x: xLeft+15 ,y: 250,width: 230,height: buttonHeight};'''
            
            if re.search(pattern2, content) and 'OCRTitleButton.frame' not in content:
                content = re.sub(pattern2, replacement2, content)
                patches_applied += 1
                
            # 补丁 3: 添加 case "toTitle" 处理逻辑
            pattern3 = r'(case "toExcerpt":\s+if \(foucsNote\) \{\s+ocrUtils\.undoGrouping\(\(\)=>\{\s+// foucsNote\.textFirst = true\s+foucsNote\.excerptTextMarkdown = true\s+foucsNote\.excerptText =  res\s+MNUtil\.waitHUD\("✅ Set to excerpt"\)\s+\}\)\s+MNUtil\.postNotification\("OCRFinished", \{action:"toExcerpt",noteId:foucsNote\.noteId,result:res\}\)\s+\}else\{\s+MNUtil\.copy\(res\)\s+\}\s+break;)'
            replacement3 = r'''\1
        case "toTitle":
          if (foucsNote) {
            MNUtil.undoGrouping(()=>{
              foucsNote.noteTitle = res
              MNUtil.waitHUD("✅ Set to title")
            })
            MNUtil.postNotification("OCRFinished", {action:"toTitle",noteId:foucsNote.noteId,result:res})
          }else{
            MNUtil.showHUD("Please select a note first")
          }
          break;'''
          
            if re.search(pattern3, content, re.DOTALL) and 'case "toTitle"' not in content:
                content = re.sub(pattern3, replacement3, content, flags=re.DOTALL)
                patches_applied += 1
                
            # 补丁 4-7: 在 refreshView 方法的各个模式中添加按钮显示控制
            # 这次不使用条件判断，直接针对每个模式分别处理
            patterns_and_replacements = [
                # Doc2X 模式
                (r'(this\.OCREditorButton\.hidden = false)(\s+this\.PDFOCREditorButton\.hidden = true)', 
                 r'\1\n      this.OCRTitleButton.hidden = false\2'),
                # Doc2XPDF 模式（隐藏）
                (r'(this\.OCREditorButton\.hidden = true)(\s+this\.PDFOCREditorButton\.hidden = false)', 
                 r'\1\n      this.OCRTitleButton.hidden = true\2'),
                # SimpleTex 模式
                (r'(this\.OCREditorButton\.hidden = false)(\s+this\.OCRClearButton\.hidden = false)', 
                 r'\1\n      this.OCRTitleButton.hidden = false\2'),
                # AI 模式
                (r'(this\.OCRChildButton\.hidden = false\s+this\.OCREditorButton\.hidden = false)(\s+this\.OCRTitleButton\.hidden = false)', 
                 r'\1\n      this.OCRTitleButton.hidden = false'),
            ]
            
            for pattern, replacement in patterns_and_replacements:
                if re.search(pattern, content):
                    content = re.sub(pattern, replacement, content)
                    patches_applied += 1
            
            # 保存修改后的文件
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"   ✅ 应用了 {patches_applied} 个补丁")
                return True
            else:
                print("   ⚠️  未检测到需要应用的补丁")
                return True
                
        except Exception as e:
            print(f"   ❌ 应用补丁时出错: {e}")
            return False
    
    def apply_main_patches(self, file_path):
        """应用 main.js 的补丁"""
        print("   📝 应用 main.js 补丁...")
        
        if not os.path.exists(file_path):
            print(f"   ❌ 文件不存在: {file_path}")
            return False
            
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            
            # 全面的高度替换（305 → 345）
            # 使用多种模式确保全部替换
            height_patterns = [
                # 匹配 height: 305 格式
                (r'height:\s*305', 'height: 345'),
                # 匹配 height=305 格式  
                (r'height=305', 'height=345'),
                # 匹配 height:305 格式（无空格）
                (r'height:305', 'height:345'),
                # 匹配 .height = 305
                (r'\.height\s*=\s*305', '.height = 345'),
                # 匹配对象字面量中的 height: 305（带前后文）
                (r'(width:\s*\d+,\s*height:\s*)305', r'\1345'),
                # 通用的数字305替换（在包含width和height的上下文中）
                (r'(\{[^}]*width[^}]*height[^}]*?)305([^}]*\})', r'\1345\2'),
            ]
            
            patches_applied = 0
            for pattern, replacement in height_patterns:
                if re.search(pattern, content):
                    content = re.sub(pattern, replacement, content, flags=re.DOTALL)
                    patches_applied += 1
            
            # 保存修改后的文件
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                    
                # 计算实际的替换次数
                height_305_count = len(re.findall(r'305', original_content)) - len(re.findall(r'305', content))
                print(f"   ✅ 高度调整: 305→345 ({height_305_count} 处)")
                return True
            else:
                print("   ⚠️  未发现需要修改的高度设置")
                return True
                
        except Exception as e:
            print(f"   ❌ 应用补丁时出错: {e}")
            return False
    
    def apply_patches(self):
        """应用所有补丁"""
        print("\n🔧 应用定制补丁...")
        
        webview_file = os.path.join(self.custom_dir, 'webviewController.js')
        main_file = os.path.join(self.custom_dir, 'main.js')
        
        success = True
        success &= self.apply_webviewcontroller_patches(webview_file)
        success &= self.apply_main_patches(main_file)
        
        if success:
            print("✅ 所有补丁应用完成")
        else:
            print("❌ 部分补丁应用失败")
            
        return success
    
    def verify_custom_version(self):
        """验证定制版本"""
        print("\n🔍 验证定制版本...")
        
        webview_file = os.path.join(self.custom_dir, 'webviewController.js')
        main_file = os.path.join(self.custom_dir, 'main.js')
        
        checks = []
        
        # 检查 webviewController.js
        if os.path.exists(webview_file):
            with open(webview_file, 'r', encoding='utf-8') as f:
                webview_content = f.read()
            
            checks.append(('OCR → Title 按钮创建', 'OCRTitleButton' in webview_content))
            checks.append(('按钮布局设置', 'OCRTitleButton.frame' in webview_content))  
            checks.append(('toTitle 处理逻辑', 'case "toTitle"' in webview_content))
            checks.append(('按钮显示控制', 'OCRTitleButton.hidden' in webview_content))
        
        # 检查 main.js
        if os.path.exists(main_file):
            with open(main_file, 'r', encoding='utf-8') as f:
                main_content = f.read()
                
            checks.append(('面板高度调整', 'height: 345' in main_content or 'height=345' in main_content))
        
        # 显示检查结果
        for check_name, passed in checks:
            status = "✅" if passed else "❌"
            print(f"   {status} {check_name}")
            
        passed_count = sum(1 for _, passed in checks if passed)
        total_count = len(checks)
        
        print(f"\n📊 验证结果: {passed_count}/{total_count} 项通过")
        
        return passed_count == total_count
    
    def cleanup_temp_files(self):
        """清理临时文件"""
        print("\n🗑️  清理临时文件...")
        
        if os.path.exists(self.temp_dir):
            shutil.rmtree(self.temp_dir)
            print(f"   删除: {os.path.basename(self.temp_dir)}/")
    
    def show_summary(self):
        """显示更新总结"""
        print("\n" + "=" * 60)
        print("📋 更新完成总结:")
        print(f"   📁 官方版本备份: {os.path.basename(self.official_dir)}/")
        print(f"   🔧 定制版本目录: {os.path.basename(self.custom_dir)}/")
        print(f"   🚀 新增功能: OCR → Title")
        print(f"   💾 保留自定义文件: CLAUDE.md 等")
        print("=" * 60)
    
    def run(self):
        """运行更新流程"""
        self.print_banner()
        
        # 步骤 1: 查找最新插件
        if not self.find_latest_addon():
            return False
            
        # 步骤 2: 清理临时目录（保留 mnocr/）
        self.cleanup_temp_directories()
        
        # 步骤 3: 解压官方版本到备份目录
        if not self.unpack_addon(self.official_dir, "解压官方版本到 mnocr_official"):
            return False
            
        # 步骤 4: 解压到临时目录用于增量更新
        if not self.unpack_addon(self.temp_dir, "解压临时版本到 mnocr_temp"):
            return False
            
        # 步骤 5: 增量更新到 mnocr/
        if not self.incremental_update():
            return False
            
        # 步骤 6: 应用补丁
        if not self.apply_patches():
            return False
            
        # 步骤 7: 验证结果
        if not self.verify_custom_version():
            print("⚠️  验证未完全通过，请检查定制功能")
            
        # 步骤 8: 清理临时文件
        self.cleanup_temp_files()
            
        # 步骤 9: 显示总结
        self.show_summary()
        
        return True


def main():
    """主函数"""
    updater = MNOCRUpdater()
    
    try:
        success = updater.run()
        if success:
            print("🎉 MNOCR 插件更新成功！")
        else:
            print("💥 更新过程中出现错误")
    except KeyboardInterrupt:
        print("\n⚠️  用户中断操作")
    except Exception as e:
        print(f"💥 更新失败: {e}")


if __name__ == "__main__":
    main()