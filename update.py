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
            'xdyy_custom_actions_registry.js',
            'xdyy_menu_registry.js'
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
                    'type': 'insert_after',
                    'marker': '  JSB.require(\'settingController\');',
                    'content': '''  
  // 加载自定义菜单注册表（必须在 utils 之后）
  try {
    JSB.require('xdyy_menu_registry')
  } catch (error) {
    // 加载错误不应该影响插件主功能
    if (typeof MNUtil !== 'undefined' && MNUtil.addErrorLog) {
      MNUtil.addErrorLog(error, "加载自定义菜单模板")
    }
  }'''
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
                # 保留这个配置，webviewController 需要自己的 togglePreprocess 方法来响应菜单
                {
                    'type': 'insert_after_once',  # 只插入一次，避免重复
                    'marker': '  },',
                    'context': 'self.popoverController = MNUtil.getPopoverAndPresent(sender, commandTable,200)',
                    'content': '''  // 夏大鱼羊 - begin
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
            'utils.js': [
                {
                    'type': 'insert_after',
                    'marker': '  static defaultWindowState = {',
                    'content': '''    // 夏大鱼羊 - begin：add Preprocess
    preprocess:false,
    // 夏大鱼羊 - end'''
                },
                {
                    'type': 'insert_after',
                    'marker': '    this.addonLogos = this.getByDefault("MNToolbar_addonLogos",{})',
                    'content': '''    // 夏大鱼羊 - begin：用来存参考文献的数据
    toolbarConfig.referenceIds = this.getByDefault("MNToolbar_referenceIds", {})
    // 夏大鱼羊 - end'''
                },
                {
                    'type': 'insert_after',
                    'marker': '      addonLogos: this.addonLogos,',
                    'content': '      referenceIds:this.referenceIds,'
                },
                {
                    'type': 'insert_after',
                    'marker': '    this.addonLogos = config.addonLogos',
                    'content': '    this.referenceIds = config.referenceIds'
                },
                # togglePreprocess 已经解耦到 xdyy_utils_extensions.js，不需要再添加到 utils.js
                {
                    'type': 'insert_after',
                    'marker': '    defaults.setObjectForKey(this.addonLogos,"MNToolbar_addonLogos")',
                    'content': '    defaults.setObjectForKey(this.referenceIds,"MNToolbar_referenceIds")'
                },
                {
                    'type': 'insert_after',
                    'marker': '    switch (key) {',
                    'content': '''      case "MNToolbar_referenceIds":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.referenceIds,key)
        break;'''
                },
                {
                    'type': 'append_to_file',
                    'content': '''

// 加载夏大鱼羊的扩展文件
JSB.require('xdyy_utils_extensions')

// 初始化夏大鱼羊的扩展
if (typeof initXDYYExtensions === 'function') {
  initXDYYExtensions()
}
if (typeof extendToolbarConfigInit === 'function') {
  extendToolbarConfigInit()
}'''
                },
                {
                    'type': 'custom_menu_templates',
                    'description': '保留用户自定义菜单模板'
                },
                {
                    'type': 'custom_actions',
                    'description': '保留用户自定义动作'
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
                if mod['type'] == 'insert_after' or mod['type'] == 'insert_after_once':
                    # 对于 insert_after_once，先检查内容是否已存在
                    if mod['type'] == 'insert_after_once':
                        # 提取关键代码来检查是否已存在（去除注释行）
                        key_content = '\n'.join([line for line in mod['content'].split('\n') 
                                               if not line.strip().startswith('//') and line.strip()])
                        if 'togglePreprocess: function' in key_content and 'togglePreprocess: function' in content:
                            # togglePreprocess 函数已存在，跳过
                            applied.append(f"togglePreprocess 函数已存在，跳过插入")
                            continue
                    
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
                    
                elif mod['type'] == 'append_to_file':
                    # 添加内容到文件末尾
                    if mod['content'] not in content:
                        content = content.rstrip() + mod['content']
                        applied.append(f"添加内容到文件末尾")
                        
                elif mod['type'] == 'custom_menu_templates':
                    # 保留用户自定义菜单模板
                    menu_applied = self._apply_custom_menus(content)
                    if menu_applied:
                        content = menu_applied
                        applied.append(f"保留用户自定义菜单模板")
                        
                elif mod['type'] == 'custom_actions':
                    # 保留用户自定义动作
                    actions_applied = self._apply_custom_actions(content)
                    if actions_applied:
                        content = actions_applied
                        applied.append(f"保留用户自定义动作")
                        
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
                        
                        # 清理 webviewController.js 中的重复函数
                        if modified_file == 'webviewController.js':
                            print("🔧 检查并清理重复的 togglePreprocess 函数...")
                            self.clean_duplicate_togglePreprocess(file_path)
                    
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
            
    def _apply_custom_menus(self, content):
        """应用用户自定义菜单模板"""
        try:
            # 加载用户自定义菜单模板
            menu_file = os.path.join(self.mntoolbar_dir, 'user_menu_templates.txt')
            if not os.path.exists(menu_file):
                # 使用备份文件路径
                menu_file = os.path.join(self.current_dir, 'user_menu_templates.txt')
                
            if not os.path.exists(menu_file):
                print("⚠️ 未找到用户菜单模板文件")
                return None
                
            # 读取菜单模板内容
            with open(menu_file, 'r', encoding='utf-8') as f:
                menu_templates_content = f.read()
                
            # 查找 template 方法中的 switch 语句
            import re
            
            # 查找 switch(action) { 的位置
            switch_pattern = r'(static\s+template\s*\(\s*action\s*\)\s*\{[^}]+switch\s*\(\s*action\s*\)\s*\{)'
            switch_match = re.search(switch_pattern, content, re.DOTALL)
            
            if not switch_match:
                return None
                
            # 查找 default: 的位置
            default_pattern = r'(static\s+template\s*\(\s*action\s*\)\s*\{[^}]+switch\s*\(\s*action\s*\)\s*\{.*?)(default\s*:)'
            default_match = re.search(default_pattern, content, re.DOTALL)
            
            if not default_match:
                return None
                
            # 检查菜单模板是否已经存在
            if 'case "menu_comment"' in content and 'case "menu_think"' in content:
                print("✅ 用户菜单模板已存在")
                return None
                
            # 在 default: 之前插入自定义菜单模板
            insert_pos = default_match.end(1)
            new_content = content[:insert_pos] + '\n' + menu_templates_content + '\n    ' + content[insert_pos:]
            
            print("✅ 已插入用户自定义菜单模板")
            return new_content
                
        except Exception as e:
            print(f"⚠️ 应用自定义菜单时出错：{e}")
            
        return None
        
    def _apply_custom_actions(self, content):
        """应用用户自定义动作"""
        try:
            # 查找 getActions() 方法
            actions_pattern = r'(static\s+getActions\s*\(\s*\)\s*\{[^{]*return\s*\{)'
            actions_match = re.search(actions_pattern, content)
            
            if not actions_match:
                return None
                
            # 查找 return { 后的内容
            start_pos = actions_match.end()
            
            # 查找对应的闭合 }
            brace_count = 1
            current_pos = start_pos
            while brace_count > 0 and current_pos < len(content):
                if content[current_pos] == '{':
                    brace_count += 1
                elif content[current_pos] == '}':
                    brace_count -= 1
                current_pos += 1
                
            if brace_count != 0:
                return None
                
            end_pos = current_pos - 1
            
            # 获取当前的 actions
            current_actions = content[start_pos:end_pos]
            
            # 用户自定义动作
            custom_actions = '''    "custom15":{name:"制卡",image:"makeCards",description: this.template("menu_makeCards")},
    "custom1":{name:"制卡",image:"makeCards",description: this.template("TemplateMakeNotes")},
    "custom20":{name:"htmlMarkdown 评论",image:"htmlmdcomment",description: this.template("menu_htmlmdcomment")},
    "custom9":{name:"思考",image:"think",description: this.template("menu_think")},
    "custom10":{name:"评论",image:"comment",description: this.template("menu_comment")},
    "custom2":{name:"学习",image:"study",description: this.template("menu_study")},
    "custom3":{name:"增加模板",image:"addTemplate",description: this.template("addTemplate")},
    "custom5":{name:"卡片",image:"card",description: this.template("menu_card")},
    "custom4":{name:"文献",image:"reference",description: this.template("menu_reference")},
    "custom6":{name:"文本",image:"text",description: this.template("menu_text")},
    "custom17":{name:"卡片储存",image:"pin_white",description: this.template("menu_card_pin")},
    "snipaste":{name:"Snipaste",image:"snipaste",description:"Snipaste"},
    "custom7":{name:"隐藏插件栏",image:"hideAddonBar",description: this.template("hideAddonBar")},
    "custom11":{name:"工作流",image:"workflow",description: this.template("menu_card_workflow")},
    "execute":{name:"execute",image:"execute",description:"let focusNote = MNNote.getFocusNote()\\nMNUtil.showHUD(focusNote.noteTitle)"},
    "custom12":{name:"预处理",image:"preprocess_red",description: this.template("togglePreprocess")},
    "custom13":{name:"选中文本",image:"handtool_text",description: this.template("menu_handtool_text")},
    "custom14":{name:"MN 功能",image:"menu_MN",description: this.template("menu_MN")},
    "custom16":{name:"卡片摘录",image:"card_excerpt",description: this.template("menu_card_excerpt")},'''
            
            # 检查是否需要添加自定义动作
            for action_key in ["custom1", "custom2", "custom3", "custom4", "custom5"]:
                if f'"{action_key}"' not in current_actions:
                    # 需要添加自定义动作
                    # 找到最后一个动作的位置
                    last_action_pattern = r',([^,}]+)\s*$'
                    last_match = re.search(last_action_pattern, current_actions.rstrip())
                    
                    if last_match:
                        insert_pos = start_pos + last_match.end(1)
                        new_content = content[:insert_pos] + ',\n' + custom_actions + content[insert_pos:]
                        return new_content
                    break
                    
        except Exception as e:
            print(f"⚠️ 应用自定义动作时出错：{e}")
            
        return None
    
    def clean_duplicate_togglePreprocess(self, file_path):
        """清理 webviewController.js 中重复的 togglePreprocess 函数定义"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # 两种模式：
            # 1. 带有 "dynamic" 注释的
            pattern_with_dynamic = r'  // 夏大鱼羊 - begin\n  // dynamic 这里还需要再写一次下面的 togglePreprocess 函数\n  togglePreprocess: function \(\) \{\n    self\.checkPopover\(\)\n    toolbarConfig\.togglePreprocess\(\)\n  \},\n  // 夏大鱼羊 - end\n'
            
            # 2. 不带 "dynamic" 注释的
            pattern_without_dynamic = r'  // 夏大鱼羊 - begin\n  togglePreprocess: function \(\) \{\n    self\.checkPopover\(\)\n    toolbarConfig\.togglePreprocess\(\)\n  \},\n  // 夏大鱼羊 - end\n'
            
            # 查找所有匹配
            matches_with_dynamic = list(re.finditer(pattern_with_dynamic, content))
            matches_without_dynamic = list(re.finditer(pattern_without_dynamic, content))
            all_matches = matches_with_dynamic + matches_without_dynamic
            
            if len(all_matches) > 0:
                print(f"🔧 发现 {len(all_matches)} 个 togglePreprocess 函数定义")
                print(f"   - 带 'dynamic' 注释的: {len(matches_with_dynamic)} 个")
                print(f"   - 不带 'dynamic' 注释的: {len(matches_without_dynamic)} 个")
                
                # 保留最后一个（通常在合适的位置），删除其他的
                if len(all_matches) > 1:
                    # 按位置排序
                    all_matches.sort(key=lambda m: m.start())
                    
                    # 删除除最后一个之外的所有匹配
                    removed_count = 0
                    for match in all_matches[:-1]:
                        content = content.replace(match.group(0), '', 1)
                        removed_count += 1
                    
                    print(f"✅ 保留最后一个，删除了 {removed_count} 个重复的 togglePreprocess 函数")
                    
                    # 写回文件
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    
                    self.update_report.append(f"✅ 清理了 {removed_count} 个重复的 togglePreprocess 函数")
                    return True
                else:
                    print("ℹ️ 只有一个 togglePreprocess 函数定义，保持不变")
                    return False
            else:
                print("ℹ️ 没有发现 togglePreprocess 函数定义")
                
        except Exception as e:
            print(f"⚠️ 清理重复函数时出错：{e}")
        
        return False
            
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