/**
 * MNTask 日志管理器
 * 提供统一的日志记录和管理功能
 */
const TaskLogManager = {
  // 日志存储
  logs: [],
  
  // 最大日志数量限制
  maxLogs: 1000,
  
  /**
   * 记录日志
   * @param {string} message - 日志消息
   * @param {string} level - 日志级别 (INFO/WARN/ERROR/DEBUG)
   * @param {string} source - 日志来源
   * @param {string} detail - 详细信息（可选）
   * @returns {Object} 日志对象
   */
  log(message, level = "INFO", source = "MNTask", detail = undefined) {
    const log = {
      message,
      level: level.toUpperCase(),
      source,
      timestamp: Date.now()
    };
    
    if (detail) {
      log.detail = detail;
    }
    
    // 添加到日志数组
    this.logs.push(log);
    
    // 限制日志数量
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
    
    // 如果日志视图已打开，实时追加
    try {
      const controller = getTaskSettingController && getTaskSettingController();
      if (controller && controller.logWebViewInstance && controller.currentView === 'logView') {
        controller.appendLog(log);
      }
    } catch (error) {
      // 忽略错误，避免循环日志
    }
    
    // 同时输出到 MNUtil.log（如果可用）
    if (typeof MNUtil !== 'undefined' && MNUtil.log) {
      const prefix = `[${level}] [${source}]`;
      MNUtil.log(`${prefix} ${message}`);
      if (detail) {
        MNUtil.log(`${prefix} Detail: ${detail}`);
      }
    }
    
    return log;
  },
  
  /**
   * 记录信息日志
   */
  info(message, source = "MNTask") {
    return this.log(message, "INFO", source);
  },
  
  /**
   * 记录警告日志
   */
  warn(message, source = "MNTask") {
    return this.log(message, "WARN", source);
  },
  
  /**
   * 记录错误日志
   */
  error(message, source = "MNTask", detail = undefined) {
    // 如果 detail 是 Error 对象，提取有用信息
    if (detail instanceof Error) {
      detail = `${detail.message}\n${detail.stack || ''}`;
    }
    return this.log(message, "ERROR", source, detail);
  },
  
  /**
   * 记录调试日志
   */
  debug(message, source = "MNTask", detail = undefined) {
    // 如果 detail 是对象，转换为 JSON
    if (detail && typeof detail === 'object' && !(detail instanceof Error)) {
      try {
        detail = JSON.stringify(detail, null, 2);
      } catch (e) {
        detail = String(detail);
      }
    }
    return this.log(message, "DEBUG", source, detail);
  },
  
  /**
   * 清空所有日志
   */
  clear() {
    this.logs = [];
    this.info("日志已清空", "LogManager");
  },
  
  /**
   * 获取所有日志
   */
  getLogs() {
    return this.logs;
  },
  
  /**
   * 获取按级别过滤的日志
   */
  getLogsByLevel(level) {
    return this.logs.filter(log => log.level === level.toUpperCase());
  },
  
  /**
   * 获取按来源过滤的日志
   */
  getLogsBySource(source) {
    return this.logs.filter(log => log.source === source);
  },
  
  /**
   * 导出日志为文本
   */
  exportAsText() {
    return this.logs.map(log => {
      const time = new Date(log.timestamp).toLocaleString();
      let text = `[${time}] [${log.level}] [${log.source}] ${log.message}`;
      if (log.detail) {
        text += `\n详细信息:\n${log.detail}`;
      }
      return text;
    }).join('\n\n');
  },
  
  /**
   * 导出日志为 JSON
   */
  exportAsJSON() {
    return JSON.stringify(this.logs, null, 2);
  }
};

// 初始化日志
TaskLogManager.info("MNTask 日志管理器已初始化", "LogManager");

// 导出到全局
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TaskLogManager;
}