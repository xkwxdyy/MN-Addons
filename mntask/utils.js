/**
 * 工具函数集合
 * 提供通用的辅助功能
 */

// 全局工具对象
var TaskUtils = {
  // 初始化
  init: function() {
    // 初始化逻辑
  },
  
  // 日志输出
  log: function(message) {
    if (typeof MNUtil !== "undefined" && MNUtil.log) {
      MNUtil.log("[MNTask] " + message);
    }
  },
  
  // 错误日志
  addErrorLog: function(error, functionName, context) {
    var errorInfo = {
      error: error.toString(),
      function: functionName,
      context: context || {},
      time: new Date().toISOString()
    };
    
    this.log("❌ Error: " + JSON.stringify(errorInfo));
    
    if (typeof MNUtil !== "undefined" && MNUtil.showHUD) {
      MNUtil.showHUD("❌ " + error.message);
    }
  },
  
  // 延迟执行
  delay: function(seconds) {
    return new Promise(function(resolve) {
      setTimeout(resolve, seconds * 1000);
    });
  },
  
  // 检查 MNUtils 是否可用
  checkMNUtil: function(showAlert) {
    if (typeof MNUtil === "undefined") {
      if (showAlert) {
        // 使用原生 alert
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "需要 MNUtils",
          "此功能需要安装 MNUtils 插件",
          0,
          "确定",
          null,
          null
        );
      }
      return false;
    }
    return true;
  },
  
  // 获取当前时间字符串
  getCurrentDateString: function() {
    var date = new Date();
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString().padStart(2, '0');
    var day = date.getDate().toString().padStart(2, '0');
    return year + "-" + month + "-" + day;
  },
  
  // 安全执行函数
  safeExecute: function(func, context) {
    try {
      return func.call(context);
    } catch (error) {
      this.addErrorLog(error, func.name || "anonymous");
      return null;
    }
  }
};