/**
 * GoToPage 插件 - 增强版本
 * 
 * 功能增强：
 * 1. 修复原版问题（全局变量、输入验证等）
 * 2. 集成 MNUtils 框架，提供更好的用户体验
 * 3. 添加历史记录功能
 * 4. 支持更多输入格式和错误处理
 * 5. 优化多窗口支持
 * 
 * 版本：2.0.0
 * 基于原版 1.1.1 改进
 */

// 假设 MNUtils 已经被加载（在实际使用中，需要确保 MNUtils 先于插件加载）
// 如果 MNUtils 不存在，提供基础的兼容层
if (typeof MNUtil === 'undefined') {
  // 基础兼容层，提供最小功能支持
  var MNUtil = {
    init: function() {},
    showHUD: function(message, duration) {
      JSB.log('HUD: ' + message);
    },
    log: function(message) {
      JSB.log(message);
    },
    delay: function(seconds) {
      return new Promise(resolve => {
        NSTimer.scheduledTimerWithTimeInterval(seconds, false, function() {
          resolve();
        });
      });
    },
    confirm: function(title, message, buttons) {
      return new Promise(resolve => {
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          title, message, 0, buttons[0], buttons.slice(1), 
          function(alert) {
            resolve(alert.buttonIndex);
          }
        );
      });
    }
  };
}

JSB.newAddon = function(mainPath) {
  // ==================== 常量定义 ====================
  const CONSTANTS = {
    STORAGE_KEY: 'GoToPage.Offsets',
    STORAGE_KEY_HISTORY: 'GoToPage.History',
    MAX_HISTORY_SIZE: 20,
    TIMER_INTERVAL: 0.5,
    MAX_TIMEOUT_COUNT: 20,
    DEBUG_ENABLED: false,  // 生产环境设为 false
    
    // UI 常量
    ALERT_STYLE_TEXT_INPUT: 2,
    CMD_KEY_FLAG: 0x100000,  // NSEventModifierFlagCommand
    
    // 输入限制
    MAX_PAGE_NUMBER: 9999,
    MIN_PAGE_NUMBER: 1,
    MAX_OFFSET: 9999,
    MIN_OFFSET: -9999
  };
  
  // ==================== 插件状态管理 ====================
  // 使用闭包保护内部状态，避免全局变量污染
  const PluginState = {
    pageOffsets: {},
    jumpHistory: [],
    currentDocMD5: null,
    isProcessing: false,  // 防止重复触发
    
    // 窗口特定的状态（绑定到 self）
    initWindowState: function() {
      self.checked = false;
      self.timeoutTimer = null;
      self.timeoutCount = 0;
    },
    
    // 加载持久化数据
    loadPersistedData: function() {
      try {
        // 加载页码偏移数据
        const offsetData = NSUserDefaults.standardUserDefaults().objectForKey(CONSTANTS.STORAGE_KEY);
        if (offsetData) {
          this.pageOffsets = offsetData;
        }
        
        // 加载历史记录
        const historyData = NSUserDefaults.standardUserDefaults().objectForKey(CONSTANTS.STORAGE_KEY_HISTORY);
        if (historyData && Array.isArray(historyData)) {
          this.jumpHistory = historyData.slice(0, CONSTANTS.MAX_HISTORY_SIZE);
        }
      } catch (error) {
        debugLog('Error loading persisted data: ' + error);
      }
    },
    
    // 保存偏移量数据
    saveOffsets: function() {
      try {
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.pageOffsets, CONSTANTS.STORAGE_KEY);
      } catch (error) {
        debugLog('Error saving offsets: ' + error);
      }
    },
    
    // 保存历史记录
    saveHistory: function() {
      try {
        // 限制历史记录大小
        if (this.jumpHistory.length > CONSTANTS.MAX_HISTORY_SIZE) {
          this.jumpHistory = this.jumpHistory.slice(0, CONSTANTS.MAX_HISTORY_SIZE);
        }
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.jumpHistory, CONSTANTS.STORAGE_KEY_HISTORY);
      } catch (error) {
        debugLog('Error saving history: ' + error);
      }
    },
    
    // 添加历史记录
    addToHistory: function(docMD5, pageNumber, offset) {
      const historyItem = {
        docMD5: docMD5,
        pageNumber: pageNumber,
        offset: offset,
        timestamp: Date.now()
      };
      
      // 添加到历史记录开头
      this.jumpHistory.unshift(historyItem);
      
      // 移除重复项（保留最新的）
      this.jumpHistory = this.jumpHistory.filter((item, index, self) => {
        return index === self.findIndex((t) => (
          t.docMD5 === item.docMD5 && t.pageNumber === item.pageNumber
        ));
      });
      
      this.saveHistory();
    }
  };
  
  // ==================== 工具函数 ====================
  
  // 调试日志函数
  function debugLog(message) {
    if (CONSTANTS.DEBUG_ENABLED) {
      JSB.log('🔍 [GoToPage Enhanced] ' + message);
    }
  }
  
  // 输入验证函数
  function validateInput(text) {
    const errors = [];
    
    if (!text || text.trim() === '') {
      errors.push('请输入页码或设置信息');
      return { isValid: false, errors: errors };
    }
    
    const parts = text.split('@');
    
    if (parts.length > 2) {
      errors.push('输入格式错误，最多包含一个 @ 符号');
      return { isValid: false, errors: errors };
    }
    
    // 验证偏移量（如果存在）
    if (parts.length === 2 && parts[0] !== '') {
      const offset = parseInt(parts[0]);
      if (isNaN(offset)) {
        errors.push('偏移量必须是数字');
      } else if (offset < CONSTANTS.MIN_OFFSET || offset > CONSTANTS.MAX_OFFSET) {
        errors.push(`偏移量必须在 ${CONSTANTS.MIN_OFFSET} 到 ${CONSTANTS.MAX_OFFSET} 之间`);
      }
    }
    
    // 验证页码（如果存在）
    const pageStr = parts.length === 2 ? parts[1] : parts[0];
    if (pageStr !== '') {
      const pageNum = parseInt(pageStr);
      if (isNaN(pageNum)) {
        errors.push('页码必须是数字');
      } else if (pageNum < CONSTANTS.MIN_PAGE_NUMBER || pageNum > CONSTANTS.MAX_PAGE_NUMBER) {
        errors.push(`页码必须在 ${CONSTANTS.MIN_PAGE_NUMBER} 到 ${CONSTANTS.MAX_PAGE_NUMBER} 之间`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }
  
  // 解析输入文本
  function parseInput(text) {
    const parts = text.split('@');
    const result = {
      hasOffset: false,
      offset: null,
      hasPage: false,
      page: null
    };
    
    if (parts.length === 2) {
      // 格式: offset@page 或 offset@
      if (parts[0] !== '' && !isNaN(parseInt(parts[0]))) {
        result.hasOffset = true;
        result.offset = parseInt(parts[0]);
      }
      
      if (parts[1] !== '' && !isNaN(parseInt(parts[1]))) {
        result.hasPage = true;
        result.page = parseInt(parts[1]);
      }
    } else if (parts.length === 1) {
      // 格式: page
      if (parts[0] !== '' && !isNaN(parseInt(parts[0]))) {
        result.hasPage = true;
        result.page = parseInt(parts[0]);
      }
    }
    
    return result;
  }
  
  // 格式化历史记录显示
  function formatHistory(history) {
    if (!history || history.length === 0) {
      return '暂无历史记录';
    }
    
    const recentHistory = history.slice(0, 5);
    const lines = recentHistory.map(item => {
      const date = new Date(item.timestamp);
      const timeStr = date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
      return `${timeStr} - 第${item.pageNumber}页 (偏移:${item.offset || 0})`;
    });
    
    return '最近跳转:\n' + lines.join('\n');
  }
  
  // ==================== 插件类定义 ====================
  
  var newAddonClass = JSB.defineClass('GoToPageEnhanced : JSExtension', {
    
    // ========== 窗口生命周期 ==========
    
    sceneWillConnect: function() {
      debugLog('Scene will connect');
      
      // 初始化 MNUtils（如果可用）
      if (typeof MNUtil !== 'undefined' && MNUtil.init) {
        try {
          MNUtil.init(mainPath);
          debugLog('MNUtils initialized successfully');
        } catch (error) {
          debugLog('MNUtils initialization failed: ' + error);
        }
      }
      
      // 初始化窗口状态
      PluginState.initWindowState();
      
      // 加载持久化数据
      PluginState.loadPersistedData();
      
      debugLog('Loaded offsets for ' + Object.keys(PluginState.pageOffsets).length + ' documents');
      debugLog('Loaded ' + PluginState.jumpHistory.length + ' history items');
    },
    
    sceneDidDisconnect: function() {
      debugLog('Scene did disconnect');
      
      // 清理定时器
      if (self.timeoutTimer) {
        self.timeoutTimer.invalidate();
        self.timeoutTimer = null;
      }
    },
    
    sceneWillResignActive: function() {
      // 窗口失去焦点时，确保状态重置
      if (PluginState.isProcessing) {
        self.checked = false;
        const app = Application.sharedInstance();
        const fsbc = app.studyController(self.window);
        if (fsbc) {
          fsbc.refreshAddonCommands();
        }
        PluginState.isProcessing = false;
      }
    },
    
    sceneDidBecomeActive: function() {
      // 窗口获得焦点时的处理
    },
    
    // ========== 笔记本生命周期 ==========
    
    notebookWillOpen: function(notebookid) {
      debugLog('Notebook will open: ' + notebookid);
    },
    
    notebookWillClose: function(notebookid) {
      debugLog('Notebook will close: ' + notebookid);
    },
    
    // ========== 文档生命周期 ==========
    
    documentDidOpen: function(docmd5) {
      debugLog('Document did open: ' + docmd5);
      PluginState.currentDocMD5 = docmd5;
      
      // 如果是新文档且没有偏移量设置，可以提示用户
      if (!PluginState.pageOffsets[docmd5] && typeof MNUtil !== 'undefined') {
        // 延迟提示，避免干扰文档打开过程
        NSTimer.scheduledTimerWithTimeInterval(1, false, function() {
          MNUtil.showHUD('提示：可以通过 GoToPage 设置页码偏移', 2);
        });
      }
    },
    
    documentWillClose: function(docmd5) {
      debugLog('Document will close: ' + docmd5);
      
      if (PluginState.currentDocMD5 === docmd5) {
        PluginState.currentDocMD5 = null;
      }
    },
    
    controllerWillLayoutSubviews: function(controller) {
      // 布局调整时的处理
    },
    
    // ========== 插件命令状态 ==========
    
    queryAddonCommandStatus: function() {
      return {
        image: 'GoToPage.png',
        object: self,
        selector: "toggleGoToPage:",
        checked: self.checked
      };
    },
    
    // ========== 核心功能实现 ==========
    
    toggleGoToPage: async function(sender) {
      debugLog('Toggle GoToPage triggered');
      
      // 防止重复触发
      if (PluginState.isProcessing) {
        debugLog('Already processing, ignore trigger');
        return;
      }
      
      const app = Application.sharedInstance();
      const fsbc = app.studyController(self.window);
      
      // 检查前置条件
      if (!fsbc) {
        debugLog('No study controller available');
        return;
      }
      
      if (!PluginState.currentDocMD5) {
        if (typeof MNUtil !== 'undefined') {
          MNUtil.showHUD('请先打开一个文档', 2);
        }
        return;
      }
      
      // 检查系统命令可用性
      if (app.queryCommandWithKeyFlagsInWindow("p", CONSTANTS.CMD_KEY_FLAG, self.window).disabled) {
        debugLog('Go To Page command is disabled');
        if (typeof MNUtil !== 'undefined') {
          MNUtil.showHUD('当前文档不支持页面跳转', 2);
        }
        return;
      }
      
      PluginState.isProcessing = true;
      self.checked = true;
      fsbc.refreshAddonCommands();
      
      try {
        // 准备对话框内容
        const currentOffset = PluginState.pageOffsets[PluginState.currentDocMD5] || 0;
        const title = currentOffset === 0 
          ? '页码跳转（无偏移）' 
          : `页码跳转（当前偏移: ${currentOffset}）`;
        
        // 构建提示信息
        let message = '输入格式示例:\n';
        message += '• 10 - 跳转到第10页\n';
        message += '• 2@10 - 设置偏移2，跳转到第10页\n';
        message += '• -2@10 - 设置负偏移，适用于前言页码\n';
        message += '• 2@ - 仅设置偏移量\n\n';
        message += formatHistory(PluginState.jumpHistory);
        
        // 显示输入对话框
        await showInputDialog(title, message);
        
      } catch (error) {
        debugLog('Error in toggleGoToPage: ' + error);
        if (typeof MNUtil !== 'undefined') {
          MNUtil.showHUD('操作失败: ' + error, 2);
        }
      } finally {
        // 确保状态重置
        PluginState.isProcessing = false;
        self.checked = false;
        fsbc.refreshAddonCommands();
      }
    }
  }, 
  // ========== 类方法 ==========
  {
    addonDidConnect: function() {
      debugLog('Addon did connect');
    },
    
    addonWillDisconnect: function() {
      debugLog('Addon will disconnect');
      
      // 保存所有未保存的数据
      PluginState.saveOffsets();
      PluginState.saveHistory();
    },
    
    applicationWillEnterForeground: function() {
      debugLog('Application will enter foreground');
    },
    
    applicationDidEnterBackground: function() {
      debugLog('Application did enter background');
      
      // 进入后台时保存数据
      PluginState.saveOffsets();
      PluginState.saveHistory();
    },
    
    applicationDidReceiveLocalNotification: function(notify) {
      debugLog('Received local notification');
    }
  });
  
  // ==================== 辅助函数（需要访问插件上下文） ====================
  
  // 显示输入对话框
  function showInputDialog(title, message) {
    return new Promise((resolve, reject) => {
      UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
        title, 
        message, 
        CONSTANTS.ALERT_STYLE_TEXT_INPUT,
        "跳转",
        ["取消"],
        async function(alert) {
          const buttonIndex = alert.buttonIndex;
          
          // 用户点击取消
          if (buttonIndex === 1) {
            debugLog('User cancelled');
            resolve();
            return;
          }
          
          // 获取用户输入
          const inputText = alert.textFieldAtIndex(0).text;
          debugLog('User input: ' + inputText);
          
          // 验证输入
          const validation = validateInput(inputText);
          if (!validation.isValid) {
            const errorMessage = validation.errors.join('\n');
            if (typeof MNUtil !== 'undefined') {
              MNUtil.showHUD('输入错误:\n' + errorMessage, 3);
            }
            resolve();
            return;
          }
          
          // 解析输入
          const parsed = parseInput(inputText);
          
          // 处理偏移量设置
          if (parsed.hasOffset) {
            PluginState.pageOffsets[PluginState.currentDocMD5] = parsed.offset;
            PluginState.saveOffsets();
            debugLog('Set offset to: ' + parsed.offset);
            
            if (typeof MNUtil !== 'undefined') {
              MNUtil.showHUD(`已设置偏移量: ${parsed.offset}`, 1.5);
            }
          }
          
          // 处理页面跳转
          if (parsed.hasPage) {
            const currentOffset = PluginState.pageOffsets[PluginState.currentDocMD5] || 0;
            const actualPage = parsed.page + currentOffset;
            
            debugLog(`Jumping to page ${parsed.page} (actual: ${actualPage})`);
            
            // 添加到历史记录
            PluginState.addToHistory(PluginState.currentDocMD5, parsed.page, currentOffset);
            
            // 执行跳转
            performPageJump(actualPage);
          }
          
          resolve();
        }
      );
    });
  }
  
  // 执行页面跳转
  function performPageJump(pageNumber) {
    const app = Application.sharedInstance();
    const fsbc = app.studyController(self.window);
    
    if (!fsbc) {
      debugLog('No study controller for jump');
      return;
    }
    
    // 创建系统跳转对话框
    const gotoAlert = UIAlertView.makeWithTitleMessageDelegateCancelButtonTitleOtherButtonTitles(
      "Go To Page",
      "",
      fsbc,
      "Cancel",
      []
    );
    
    gotoAlert.alertViewStyle = CONSTANTS.ALERT_STYLE_TEXT_INPUT;
    gotoAlert.show();
    
    // 填充页码
    const textField = gotoAlert.textFieldAtIndex(0);
    textField.text = pageNumber.toString();
    
    // 设置清理定时器
    startCleanupTimer();
  }
  
  // 启动清理定时器
  function startCleanupTimer() {
    // 清理旧的定时器
    if (self.timeoutTimer) {
      self.timeoutTimer.invalidate();
    }
    
    self.timeoutCount = CONSTANTS.MAX_TIMEOUT_COUNT;
    
    self.timeoutTimer = NSTimer.scheduledTimerWithTimeInterval(
      CONSTANTS.TIMER_INTERVAL,
      true,
      function(timer) {
        self.timeoutCount -= 1;
        
        const app = Application.sharedInstance();
        const shouldStop = 
          app.osType === 2 ||
          !app.focusWindow ||
          app.focusWindow.subviews.length === 1 ||
          self.timeoutCount <= 0;
        
        if (shouldStop) {
          debugLog('Cleanup timer triggered');
          
          // 重置状态
          PluginState.isProcessing = false;
          self.checked = false;
          
          const fsbc = app.studyController(self.window);
          if (fsbc) {
            fsbc.refreshAddonCommands();
          }
          
          // 停止定时器
          timer.invalidate();
          self.timeoutTimer = null;
        }
      }
    );
  }
  
  return newAddonClass;
};

/**
 * ==================== 增强版本特性总结 ====================
 * 
 * 1. 问题修复：
 *    ✅ 修复 timeoutCount 全局变量问题
 *    ✅ 添加完整的输入验证
 *    ✅ 改进错误处理机制
 *    ✅ 优化多窗口支持
 * 
 * 2. 新增功能：
 *    ✅ 历史记录功能（最近20条）
 *    ✅ 支持负数偏移量（适用于前言等）
 *    ✅ 更友好的用户提示
 *    ✅ MNUtils 框架集成（可选）
 *    ✅ 调试模式开关
 * 
 * 3. 架构改进：
 *    ✅ 使用状态管理对象
 *    ✅ Promise/async 支持
 *    ✅ 常量集中管理
 *    ✅ 模块化函数设计
 *    ✅ 防止重复触发机制
 * 
 * 4. 用户体验优化：
 *    ✅ 实时反馈（HUD 提示）
 *    ✅ 历史记录显示
 *    ✅ 详细的错误提示
 *    ✅ 输入格式示例
 *    ✅ 新文档提示
 * 
 * 5. 代码质量：
 *    ✅ 完整的注释文档
 *    ✅ 统一的错误处理
 *    ✅ 调试日志系统
 *    ✅ 资源清理机制
 *    ✅ 数据持久化优化
 */