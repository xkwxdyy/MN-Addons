#!/usr/bin/env python3
"""
自动应用 XDYYToolbar 集成代码
在更新官方版本后运行此脚本，自动重新应用集成代码
"""

import os
import re
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class IntegrationApplier:
    def __init__(self, base_dir='.'):
        self.base_dir = os.path.abspath(base_dir)
        self.mntoolbar_dir = os.path.join(self.base_dir, 'mntoolbar')
        
    def apply_main_js_integration(self):
        """应用 main.js 的集成代码"""
        main_js_path = os.path.join(self.mntoolbar_dir, 'main.js')
        
        if not os.path.exists(main_js_path):
            logger.error(f"文件不存在：{main_js_path}")
            return False
            
        with open(main_js_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        modified = False
        
        # 1. 添加 require
        requires_added = False
        
        # 添加 pinyin
        if "JSB.require('pinyin')" not in content:
            pattern = r"(JSB\.require\('utils'\))"
            replacement = r"\1\n  JSB.require('pinyin')"
            content = re.sub(pattern, replacement, content)
            requires_added = True
            logger.info("✅ 已添加 JSB.require('pinyin')")
            
        # 添加 xdyytoolbar
        if "JSB.require('xdyytoolbar')" not in content:
            pattern = r"(JSB\.require\('settingController'\);)"
            replacement = r"\1\n  JSB.require('xdyytoolbar');"
            content = re.sub(pattern, replacement, content)
            requires_added = True
            logger.info("✅ 已添加 JSB.require('xdyytoolbar')")
            
        if requires_added:
            modified = True
        
        # 2. 添加初始化代码
        if "XDYYToolbar.init" not in content:
            pattern = r"(toolbarConfig\.init\(mainPath\))"
            replacement = r"""\1
      // 初始化自定义工具栏功能
      if (typeof XDYYToolbar !== 'undefined') {
        XDYYToolbar.init(this);
      }"""
            content = re.sub(pattern, replacement, content)
            modified = True
            logger.info("✅ 已添加 XDYYToolbar.init 调用")
        
        # 3. 添加 executeCustomAction 方法
        if "executeCustomAction:" not in content:
            # 查找 openDocument 方法的位置
            pattern = r"(\s+},\n\s+openDocument:function \(button\) {)"
            replacement = r"""},
      executeCustomAction: function (params) {
        if (typeof MNUtil === 'undefined' || typeof XDYYToolbar === 'undefined') return
        let self = getMNToolbarClass()
        self.checkPopoverController()
        
        // 执行 XDYYToolbar 中的对应动作
        if (params && params.action === 'togglePreprocess') {
          XDYYToolbar.togglePreprocess();
        }
      },
      openDocument:function (button) {"""
            content = re.sub(pattern, replacement, content)
            modified = True
            logger.info("✅ 已添加 executeCustomAction 方法")
        
        # 4. 添加菜单项
        if "添加自定义菜单项" not in content:
            pattern = r"(self\.tableItem\('🔄   Manual Sync','manualSync:'\)\n\s+\];)"
            replacement = r"""\1
        
        // 添加自定义菜单项
        if (typeof XDYYToolbar !== 'undefined') {
            commandTable.push(self.tableItem('🗂️   卡片预处理模式  ', 'executeCustomAction:', 
                {action: 'togglePreprocess'}, toolbarConfig.preprocess));
        }"""
            content = re.sub(pattern, replacement, content)
            modified = True
            logger.info("✅ 已添加自定义菜单项")
        
        if modified:
            with open(main_js_path, 'w', encoding='utf-8') as f:
                f.write(content)
            logger.info("✅ main.js 集成完成")
        else:
            logger.info("ℹ️ main.js 已包含所有集成代码")
        
        return True
    
    def apply_webview_controller_integration(self):
        """应用 webviewController.js 的集成代码"""
        webview_path = os.path.join(self.mntoolbar_dir, 'webviewController.js')
        
        if not os.path.exists(webview_path):
            logger.error(f"文件不存在：{webview_path}")
            return False
            
        with open(webview_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        modified = False
        
        # 1. 在 viewDidLoad 中添加注册调用
        if "self.registerCustomActions();" not in content:
            pattern = r"(let self = getToolbarController\(\))"
            replacement = r"""\1
    
    // 注册自定义动作
    if (typeof XDYYToolbar !== 'undefined') {
      self.registerCustomActions();
    }"""
            content = re.sub(pattern, replacement, content, 1)  # 只替换第一个匹配
            modified = True
            logger.info("✅ 已添加 registerCustomActions 调用")
        
        # 2. 添加 registerCustomActions 方法
        if "registerCustomActions: function()" not in content:
            # 在类定义结束前添加方法
            pattern = r"(    } catch \(error\) {\s+toolbarUtils\.addErrorLog\(error, \"onResizeGesture\"\)\s+}\s+},\n\}\);)"
            replacement = r"""    } catch (error) {
      toolbarUtils.addErrorLog(error, "onResizeGesture")
    }
  },
  // 注册自定义动作
  registerCustomActions: function() {
    try {
      if (typeof XDYYToolbar === 'undefined') return;
      
      // 获取自定义动作列表
      const customActions = XDYYToolbar.getCustomActions();
      
      // 将自定义动作添加到 toolbarConfig 的动作系统中
      customActions.forEach((action, index) => {
        // 使用未使用的 custom 槽位
        const customSlot = `xdyy_${action.id}`;
        
        // 创建动作描述
        const description = {
          action: action.id,
          menuWidth: 330
        };
        
        if (action.callback) {
          description.callback = action.callback;
        }
        
        // 注册到 toolbarConfig 的动作系统
        if (!toolbarConfig.actions) {
          toolbarConfig.actions = {};
        }
        
        toolbarConfig.actions[customSlot] = {
          name: action.title,
          image: action.id, // 图标名称，需要对应的图片文件
          description: JSON.stringify(description)
        };
      });
      
      // 确保动作可以被使用
      toolbarConfig.save();
      
    } catch (error) {
      toolbarUtils.addErrorLog(error, "registerCustomActions");
    }
  },
});"""
            content = re.sub(pattern, replacement, content)
            modified = True
            logger.info("✅ 已添加 registerCustomActions 方法")
        
        if modified:
            with open(webview_path, 'w', encoding='utf-8') as f:
                f.write(content)
            logger.info("✅ webviewController.js 集成完成")
        else:
            logger.info("ℹ️ webviewController.js 已包含所有集成代码")
        
        return True
    
    def check_xdyytoolbar_exists(self):
        """检查 xdyytoolbar.js 是否存在"""
        xdyy_path = os.path.join(self.mntoolbar_dir, 'xdyytoolbar.js')
        if not os.path.exists(xdyy_path):
            logger.error("❌ xdyytoolbar.js 文件不存在！请确保已创建该文件。")
            return False
        logger.info("✅ xdyytoolbar.js 文件存在")
        return True
    
    def run(self):
        """执行集成"""
        logger.info("=" * 60)
        logger.info("开始应用 XDYYToolbar 集成代码")
        logger.info("=" * 60)
        
        # 检查前置条件
        if not self.check_xdyytoolbar_exists():
            return False
        
        # 应用集成
        success = True
        success &= self.apply_main_js_integration()
        success &= self.apply_webview_controller_integration()
        
        if success:
            logger.info("\n✅ 所有集成代码已成功应用！")
            logger.info("现在可以打包并测试你的自定义功能了。")
        else:
            logger.error("\n❌ 集成过程中出现错误，请检查日志。")
        
        return success

def main():
    """主函数"""
    import argparse
    
    parser = argparse.ArgumentParser(description='应用 XDYYToolbar 集成代码')
    parser.add_argument('--dir', default='.', help='工作目录（默认为当前目录）')
    
    args = parser.parse_args()
    
    applier = IntegrationApplier(base_dir=args.dir)
    applier.run()

if __name__ == '__main__':
    main()