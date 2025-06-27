#!/usr/bin/env python3
"""
MN Toolbar Pro 更新脚本
功能：
1. 自动查找最新版本的 .mnaddon 文件
2. 解包并更新到 mntoolbar 和 mntoolbar_official 目录
3. 保留用户的自定义修改
4. 智能处理版本冲突
"""

import os
import re
import subprocess
import shutil
import filecmp
import datetime

class MNToolbarUpdater:
    def __init__(self):
        self.current_dir = os.getcwd()
        self.mntoolbar_dir = os.path.join(self.current_dir, 'mntoolbar')
        self.official_dir = os.path.join(self.current_dir, 'mntoolbar_official')
        self.update_report = []
        self.conflicts = []
        
        # 用户自定义文件列表
        self.user_custom_files = {
            'xdyy_utils_extensions.js',
            'xdyy_custom_actions_registry.js'
        }
        
        # 需要保留用户修改的文件及其修改点
        self.user_modifications = {
            'main.js': [
                {
                    'type': 'insert_after',
                    'marker': 'JSB.require(\'utils\')',
                    'content': '  JSB.require(\'xdyy_utils_extensions\')  // 加载工具函数扩展\n  JSB.require(\'pinyin\')'
                },
                {
                    'type': 'insert_after',
                    'marker': '// JSB.require(\'UIPencilInteraction\');',
                    'content': '''  
  // 加载自定义 actions 扩展（必须在 webviewController 之后）
  try {
    // 使用注册表方式，真正实现解耦
    JSB.require('xdyy_custom_actions_registry')
  } catch (error) {
    // 加载错误不应该影响插件主功能
    if (typeof MNUtil !== 'undefined' && MNUtil.addErrorLog) {
      MNUtil.addErrorLog(error, "加载自定义 Actions")
    }
  }'''
                },
                {
                    'type': 'insert_before',
                    'marker': '        self.addonController.popupReplace()',
                    'content': '        self.ensureView() // 确保 addonController 已初始化',
                    'unique_context': 'onClosePopupMenuOnNote'
                },
                {
                    'type': 'insert_before',
                    'marker': '          self.addonController.popupReplace()',
                    'content': '          self.ensureView() // 确保 addonController 已初始化',
                    'unique_context': 'onPopupMenuOnNote'
                },
                {
                    'type': 'insert_before',
                    'marker': '      openDocument:function (button) {',
                    'content': '''      // 夏大鱼羊增加：卡片的预处理
      togglePreprocess: function () {
        let self = getMNToolbarClass()
        self.checkPopoverController()
        toolbarConfig.togglePreprocess()
      },
      // 夏大鱼羊结束
'''
                },
                {
                    'type': 'insert_before',
                    'marker': '            self.tableItem(\'📄   Document\', \'openDocument:\'),',
                    'content': '            self.tableItem(\'🗂️   卡片预处理模式  \',"togglePreprocess:", undefined, toolbarConfig.windowState.preprocess),'
                }
            ],
            'webviewController.js': [
                {
                    'type': 'replace_section',
                    'start_marker': '    if (self.dynamicWindow) {',
                    'end_marker': '    }',
                    'old_content': '''    if (self.dynamicWindow) {
      if (toolbarConfig.vertical(true)) {
        commandTable.unshift(self.tableItem('🌟  Direction   ↕️', selector,"dynamic"))
      }else{
        commandTable.unshift(self.tableItem('🌟  Direction   ↔️', selector,"dynamic"))
      }
    }else{
      if (toolbarConfig.vertical()) {
        commandTable.unshift(self.tableItem('🛠️  Direction   ↕️', selector,"fixed"))
      }else{
        commandTable.unshift(self.tableItem('🛠️  Direction   ↔️', selector,"fixed"))
      }
    }''',
                    'new_content': '''    if (self.dynamicWindow) {
      if (toolbarConfig.vertical(true)) {
        commandTable.unshift(self.tableItem('🌟  Direction   ↕️', selector,"dynamic"))
      }else{
        commandTable.unshift(self.tableItem('🌟  Direction   ↔️', selector,"dynamic"))
      }
      // 夏大鱼羊 - begin
      commandTable.unshift(self.tableItem('🗂️   卡片预处理模式',"togglePreprocess:", toolbarConfig.windowState.preprocess))
      // 夏大鱼羊 - end
    }else{
      if (toolbarConfig.vertical()) {
        commandTable.unshift(self.tableItem('🛠️  Direction   ↕️', selector,"fixed"))
      }else{
        commandTable.unshift(self.tableItem('🛠️  Direction   ↔️', selector,"fixed"))
      }
      // 夏大鱼羊 - begin
      commandTable.unshift(self.tableItem('🗂️   卡片预处理模式',"togglePreprocess:", toolbarConfig.windowState.preprocess))
      // 夏大鱼羊 - end
    }'''
                },
                {
                    'type': 'insert_after',
                    'marker': '  },',
                    'context': 'self.popoverController = MNUtil.getPopoverAndPresent(sender, commandTable,200)',
                    'content': '''  // 夏大鱼羊 - begin
  // dynamic 这里还需要再写一次下面的 togglePreprocess 函数
  togglePreprocess: function () {
    self.checkPopover()
    toolbarConfig.togglePreprocess()
  },
  // 夏大鱼羊 - end'''
                },
                {
                    'type': 'wrap_code',
                    'start_marker': '    if (actionName.includes("color")) {',
                    'end_marker': '    // self["ColorButton"+index].contentHorizontalAlignment = 1',
                    'wrapper_start': '    if (actionName){',
                    'wrapper_end': '    }'
                },
                {
                    'type': 'insert_after',
                    'marker': '    let focusNote = undefined',
                    'content': '    let focusNotes = []',
                    'context': 'customActionByDes'
                },
                {
                    'type': 'replace',
                    'old': '''    try {
      focusNote = MNNote.getFocusNote()
    } catch (error) {
    }''',
                    'new': '''    try {
      focusNote = MNNote.getFocusNote()
      focusNotes = MNNote.getFocusNotes()
    } catch (error) {
    }''',
                    'context': 'customActionByDes'
                },
                {
                    'type': 'replace',
                    'old': '''      default:
        MNUtil.showHUD("Not supported yet...")
        break;''',
                    'new': '''      default:
        // 检查是否是自定义 action
        if (typeof global !== 'undefined' && global.executeCustomAction) {
          const context = {
            button: button,
            des: des,
            focusNote: focusNote,
            focusNotes: focusNotes,
            self: this
          };
          const handled = await global.executeCustomAction(des.action, context);
          if (handled) {
            // 自定义 action 已处理
            break;
          }
        }
        MNUtil.showHUD("Not supported yet...")
        break;'''
                }
            ],
            'jsconfig.json': [
                {
                    'type': 'replace_whole_file',
                    'content': '''{
  "compilerOptions": {
    "target": "ES2015",
    "module": "commonjs",
    "lib": ["ES2015", "ES2017", "ES2019", "ES2020"],
    "checkJs": false,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true
  },
  "include": [
    "main.js",
    "webviewController.js",
    "settingController.js",
    "utils.js",
    "xdyy_utils_extensions.js",
    "xdyy_custom_actions_registry.js"
  ],
  "exclude": [
    "/Users/linlifei/extension/FeliksPro/.out/index.d.ts"
  ]
}'''
                }
            ]
        }
        
    def find_latest_addon(self):
        """查找最新版本的 .mnaddon 文件"""
        addon_files = [f for f in os.listdir('.') if f.endswith('.mnaddon')]
        
        if not addon_files:
            print("❌ 未找到任何 .mnaddon 文件")
            return None
            
        # 版本号正则：mntoolbar_v{x}_{y}_{z}[_alpha{n}].mnaddon
        pattern = r"mntoolbar_v(\d+)_(\d+)_(\d+)(?:_alpha(\d+))?\.mnaddon"
        
        versions = []
        for addon_file in addon_files:
            match = re.match(pattern, addon_file)
            if match:
                x, y, z = int(match.group(1)), int(match.group(2)), int(match.group(3))
                alpha = int(match.group(4)) if match.group(4) else float('inf')  # 正式版优先
                versions.append((x, y, z, alpha, addon_file))
        
        if not versions:
            print("❌ 未找到符合命名规范的插件文件")
            return None
            
        # 按版本号排序，取最新版本
        versions.sort(reverse=True)
        latest = versions[0]
        
        version_str = f"v{latest[0]}.{latest[1]}.{latest[2]}"
        if latest[3] != float('inf'):
            version_str += f" alpha{latest[3]}"
            
        print(f"✅ 找到最新版本：{latest[4]} ({version_str})")
        return os.path.join(self.current_dir, latest[4])
        
    def unpack_addon(self, addon_path, target_dir):
        """解包 .mnaddon 文件"""
        # 如果目标目录存在，先删除
        if os.path.exists(target_dir):
            shutil.rmtree(target_dir)
            
        try:
            print(f"📦 正在解包：{os.path.basename(addon_path)}")
            result = subprocess.run(
                f"mnaddon unpack {addon_path}", 
                shell=True, 
                capture_output=True, 
                text=True
            )
            
            if result.returncode != 0:
                print(f"❌ 解包失败：{result.stderr}")
                return False
                
            print("✅ 解包成功")
            return True
            
        except Exception as e:
            print(f"❌ 解包出错：{e}")
            return False
            
    def backup_user_files(self):
        """备份用户自定义文件"""
        backup_dir = os.path.join(self.current_dir, f'backup_{datetime.datetime.now().strftime("%Y%m%d_%H%M%S")}')
        os.makedirs(backup_dir, exist_ok=True)
        
        backed_up = []
        
        # 备份自定义文件
        for custom_file in self.user_custom_files:
            src = os.path.join(self.mntoolbar_dir, custom_file)
            if os.path.exists(src):
                dst = os.path.join(backup_dir, custom_file)
                shutil.copy2(src, dst)
                backed_up.append(custom_file)
                
        # 备份修改过的文件
        for modified_file in self.user_modifications:
            src = os.path.join(self.mntoolbar_dir, modified_file)
            if os.path.exists(src):
                dst = os.path.join(backup_dir, modified_file)
                shutil.copy2(src, dst)
                backed_up.append(modified_file)
                
        if backed_up:
            print(f"📋 已备份 {len(backed_up)} 个用户文件到：{backup_dir}")
            self.update_report.append(f"备份目录：{backup_dir}")
            self.update_report.append(f"备份文件：{', '.join(backed_up)}")
            
        return backup_dir
        
    def apply_user_modifications(self, file_path):
        """应用用户的修改到文件"""
        filename = os.path.basename(file_path)
        if filename not in self.user_modifications:
            return False
            
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        original_content = content
        modifications = self.user_modifications[filename]
        applied = []
        
        for mod in modifications:
            try:
                if mod['type'] == 'insert_after':
                    # 检查是否需要根据上下文来确定插入位置
                    if 'context' in mod:
                        # 使用上下文查找正确的位置
                        pattern = re.escape(mod['marker'])
                        context_pattern = re.escape(mod['context'])
                        # 查找包含上下文的区域
                        full_pattern = f"({pattern}.*?{context_pattern})"
                        match = re.search(full_pattern, content, re.DOTALL)
                        if match:
                            # 在这个区域内找到具体的插入点
                            region = match.group(0)
                            if mod['marker'] in region:
                                # 在区域内替换
                                new_region = region.replace(mod['marker'], mod['marker'] + '\n' + mod['content'])
                                content = content.replace(region, new_region)
                                applied.append(f"根据上下文插入代码到 {mod['marker']} 后")
                    else:
                        # 简单插入
                        if mod['marker'] in content and mod['content'] not in content:
                            content = content.replace(mod['marker'], mod['marker'] + '\n' + mod['content'])
                            applied.append(f"插入代码到 {mod['marker'][:30]}... 后")
                            
                elif mod['type'] == 'insert_before':
                    if 'unique_context' in mod:
                        # 使用唯一上下文来确定位置
                        context = mod['unique_context']
                        pattern = f"({context}.*?{re.escape(mod['marker'])})"
                        match = re.search(pattern, content, re.DOTALL)
                        if match and mod['content'] not in content:
                            old_text = match.group(0)
                            new_text = old_text.replace(mod['marker'], mod['content'] + '\n' + mod['marker'])
                            content = content.replace(old_text, new_text)
                            applied.append(f"根据上下文 {context} 插入代码到 {mod['marker'][:30]}... 前")
                    else:
                        if mod['marker'] in content and mod['content'] not in content:
                            content = content.replace(mod['marker'], mod['content'] + '\n' + mod['marker'])
                            applied.append(f"插入代码到 {mod['marker'][:30]}... 前")
                        
                elif mod['type'] == 'wrap_code':
                    # 查找需要包装的代码块
                    start_pattern = re.escape(mod['start_marker'])
                    end_pattern = re.escape(mod['end_marker'])
                    pattern = f"({start_pattern}.*?{end_pattern})"
                    
                    match = re.search(pattern, content, re.DOTALL)
                    if match and mod['wrapper_start'] not in content:
                        wrapped_code = match.group(1)
                        new_code = mod['wrapper_start'] + '\n' + wrapped_code + '\n' + mod['wrapper_end']
                        content = content.replace(wrapped_code, new_code)
                        applied.append(f"包装代码块 {mod['start_marker'][:30]}...")
                        
                elif mod['type'] == 'replace':
                    if mod['old'] in content:
                        content = content.replace(mod['old'], mod['new'])
                        applied.append(f"替换代码块")
                        
                elif mod['type'] == 'replace_section':
                    # 替换整个代码段
                    if mod['old_content'] in content:
                        content = content.replace(mod['old_content'], mod['new_content'])
                        applied.append(f"替换代码段 {mod['start_marker'][:30]}...")
                        
                elif mod['type'] == 'replace_whole_file':
                    # 替换整个文件内容
                    content = mod['content']
                    applied.append(f"替换整个文件内容")
                        
            except Exception as e:
                self.conflicts.append(f"{filename}: {mod.get('marker', 'unknown')} - {str(e)}")
                
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
                
            if applied:
                self.update_report.append(f"\n✏️ 已应用 {len(applied)} 个修改到 {filename}：")
                for item in applied:
                    self.update_report.append(f"  - {item}")
                    
            return True
            
        return False
        
    def update_directory(self, new_version_path, target_dir, is_dev=True):
        """更新目标目录"""
        print(f"\n{'='*50}")
        print(f"📁 更新目录：{os.path.basename(target_dir)}")
        print(f"{'='*50}\n")
        
        if not os.path.exists(target_dir):
            os.makedirs(target_dir)
            
        updated_files = []
        skipped_files = []
        new_files = []
        
        # 获取所有需要更新的文件
        for file in os.listdir(new_version_path):
            if file.endswith(('.js', '.html', '.json', '.css', '.svg')):
                new_file = os.path.join(new_version_path, file)
                old_file = os.path.join(target_dir, file)
                
                # 开发目录跳过用户自定义文件
                if is_dev and file in self.user_custom_files:
                    print(f"⏭️  跳过用户文件：{file}")
                    skipped_files.append(file)
                    continue
                    
                # 检查文件是否存在
                if os.path.exists(old_file):
                    # 比较文件是否相同
                    if filecmp.cmp(new_file, old_file):
                        print(f"✔️  未变化：{file}")
                        skipped_files.append(file)
                        continue
                        
                    print(f"📝 更新文件：{file}")
                    updated_files.append(file)
                else:
                    print(f"➕ 新增文件：{file}")
                    new_files.append(file)
                    
                # 复制文件
                shutil.copy2(new_file, old_file)
                
        # 应用用户修改（仅在开发目录）
        if is_dev:
            print("\n🔧 应用用户修改...")
            for modified_file in self.user_modifications:
                file_path = os.path.join(target_dir, modified_file)
                if os.path.exists(file_path):
                    if self.apply_user_modifications(file_path):
                        print(f"✅ 已应用修改到：{modified_file}")
                    
        # 应用文本替换（仅在开发目录）
        if is_dev:
            self.apply_text_replacements(target_dir)
            
        # 更新报告
        self.update_report.append(f"\n{os.path.basename(target_dir)} 目录更新统计：")
        self.update_report.append(f"  - 更新文件：{len(updated_files)} 个")
        self.update_report.append(f"  - 跳过文件：{len(skipped_files)} 个")
        self.update_report.append(f"  - 新增文件：{len(new_files)} 个")
        
        if updated_files:
            self.update_report.append(f"  - 更新列表：{', '.join(updated_files)}")
        if new_files:
            self.update_report.append(f"  - 新增列表：{', '.join(new_files)}")
            
    def apply_text_replacements(self, target_dir):
        """应用文本替换"""
        replacements = {
            'foucsNote': 'focusNote',  # 修复拼写错误
        }
        
        replaced_files = []
        
        for file in os.listdir(target_dir):
            if file.endswith('.js'):
                file_path = os.path.join(target_dir, file)
                
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                new_content = content
                for old_text, new_text in replacements.items():
                    new_content = new_content.replace(old_text, new_text)
                    
                if new_content != content:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    replaced_files.append(file)
                    
        if replaced_files:
            print(f"🔧 已修复拼写错误：{len(replaced_files)} 个文件")
            
    def check_new_files(self, new_version_path):
        """检查新版本中的新增文件"""
        old_files = set(os.listdir(self.mntoolbar_dir))
        new_files = set(os.listdir(new_version_path))
        
        extra_files = new_files - old_files
        
        # 排除自定义图标文件
        pattern = re.compile(r'custom\d+\.png')
        
        important_files = []
        for file in extra_files:
            if not pattern.match(file) and file not in self.user_custom_files:
                important_files.append(file)
                
        if important_files:
            self.update_report.append(f"\n⚠️  新版本包含以下新文件：")
            for file in important_files:
                self.update_report.append(f"  - {file}")
                
    def write_update_report(self):
        """生成更新报告"""
        report_path = os.path.join(self.current_dir, f'update_report_{datetime.datetime.now().strftime("%Y%m%d_%H%M%S")}.md')
        
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write("# MN Toolbar Pro 更新报告\n\n")
            f.write(f"更新时间：{datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            
            for line in self.update_report:
                f.write(line + '\n')
                
            if self.conflicts:
                f.write("\n## ⚠️ 需要手动处理的冲突\n\n")
                for conflict in self.conflicts:
                    f.write(f"- {conflict}\n")
                    
            f.write("\n## 建议后续操作\n\n")
            f.write("1. 检查更新后的功能是否正常\n")
            f.write("2. 测试自定义 actions 是否仍然有效\n")
            f.write("3. 测试卡片预处理模式是否正常\n")
            f.write("4. 如有问题，可从备份目录恢复文件\n")
            
        print(f"\n📄 更新报告已生成：{report_path}")
        
        # 自动打开报告（macOS）
        if os.name == 'posix':
            subprocess.run(f"open {report_path}", shell=True)
            
    def run(self):
        """执行更新流程"""
        print("🚀 MN Toolbar Pro 更新脚本启动\n")
        
        # 1. 查找最新版本
        addon_path = self.find_latest_addon()
        if not addon_path:
            return
            
        # 2. 备份用户文件
        backup_dir = self.backup_user_files()
        
        # 3. 解包新版本
        new_version_path = addon_path.replace('.mnaddon', '')
        if not self.unpack_addon(addon_path, new_version_path):
            return
            
        # 4. 检查新文件
        self.check_new_files(new_version_path)
        
        # 5. 更新官方备份目录
        self.update_directory(new_version_path, self.official_dir, is_dev=False)
        
        # 6. 再次解包（因为更新过程可能修改了文件）
        shutil.rmtree(new_version_path)
        if not self.unpack_addon(addon_path, new_version_path):
            return
            
        # 7. 更新开发目录
        self.update_directory(new_version_path, self.mntoolbar_dir, is_dev=True)
        
        # 8. 清理临时文件
        if os.path.exists(new_version_path):
            shutil.rmtree(new_version_path)
            
        # 9. 生成更新报告
        self.write_update_report()
        
        print("\n✅ 更新完成！")
        print("📋 请查看更新报告了解详细信息")

if __name__ == "__main__":
    updater = MNToolbarUpdater()
    updater.run()