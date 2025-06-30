/**
 * MNTask 工具函数集合
 * 提供常用的辅助功能
 */

var TaskUtils = {
  // 当前选中的文本
  currentSelection: "",
  
  // 当前笔记ID
  currentNoteId: null,
  
  /**
   * 初始化工具类
   */
  init: function(mainPath) {
    this.mainPath = mainPath
  },
  
  /**
   * 检查 MNUtils 是否安装
   */
  checkMNUtils: function(mainPath) {
    JSB.require('mnutils')
    
    if (typeof MNUtil === 'undefined') {
      Application.sharedInstance().showHUD(
        "❌ 请先安装 MNUtils 插件\n" +
        "MNUtils 是运行本插件的必要依赖", 
        Application.sharedInstance().focusWindow, 
        3
      )
      return false
    }
    
    // 初始化 MNUtil
    MNUtil.init(mainPath)
    
    return true
  },
  
  /**
   * 日志输出
   */
  log: function(message) {
    if (typeof MNUtil !== 'undefined' && MNUtil.log) {
      MNUtil.log(message)
    } else {
      Application.sharedInstance().showHUD(message, 1)
    }
  },
  
  /**
   * 错误日志
   */
  addErrorLog: function(error, source, info) {
    if (typeof MNUtil !== 'undefined' && MNUtil.addErrorLog) {
      MNUtil.addErrorLog(error, source, info)
    } else {
      let errorMsg = source + ": " + error.message
      Application.sharedInstance().showHUD("❌ " + errorMsg, 3)
      
      // 同时输出到控制台
      console.log("ERROR [" + source + "]:", error)
      if (info) {
        console.log("Additional info:", info)
      }
    }
  },
  
  /**
   * 显示 HUD 提示
   */
  showHUD: function(message, duration = 2) {
    if (typeof MNUtil !== 'undefined') {
      MNUtil.showHUD(message, duration)
    } else {
      Application.sharedInstance().showHUD(message, duration)
    }
  },
  
  /**
   * 确保视图在学习视图中
   */
  ensureViewInStudyView: function(view) {
    if (!view) return
    
    if (typeof MNUtil !== 'undefined' && MNUtil.isDescendantOfStudyView) {
      if (!MNUtil.isDescendantOfStudyView(view)) {
        view.hidden = true
        MNUtil.studyView.addSubview(view)
      }
    } else {
      // 降级处理
      let studyView = Application.sharedInstance().studyController(
        Application.sharedInstance().focusWindow
      ).view
      
      if (view.superview !== studyView) {
        view.hidden = true
        studyView.addSubview(view)
      }
    }
  },
  
  /**
   * 获取弹出菜单和显示
   */
  getPopoverAndPresent: function(button, commandTable, width = 200, preferredPosition = 2) {
    if (typeof MNUtil !== 'undefined' && MNUtil.getPopoverAndPresent) {
      return MNUtil.getPopoverAndPresent(button, commandTable, width, preferredPosition)
    }
    
    // 降级处理：使用基础弹出菜单
    let menuController = MenuController.new()
    menuController.commandTable = commandTable
    menuController.preferredContentSize = {
      width: width,
      height: 44 * commandTable.length
    }
    
    let popoverController = new UIPopoverController(menuController)
    let targetView = Application.sharedInstance().studyController(
      Application.sharedInstance().focusWindow
    ).view
    
    let rect = button.convertRectToView(button.bounds, targetView)
    popoverController.presentPopoverFromRect(rect, targetView, preferredPosition, true)
    
    return popoverController
  },
  
  /**
   * 获取焦点笔记
   */
  getFocusNote: function() {
    if (typeof MNNote !== 'undefined' && MNNote.getFocusNote) {
      return MNNote.getFocusNote()
    }
    return null
  },
  
  /**
   * 获取焦点笔记ID
   */
  getFocusNoteId: function() {
    let focusNote = this.getFocusNote()
    return focusNote ? focusNote.noteId : null
  },
  
  /**
   * 解析 URL 参数
   */
  parseURLParams: function(url) {
    let params = {}
    let query = url.match(/(?<=mntask\?).*/)[0]
    
    if (query) {
      query.split("&").forEach(param => {
        let [key, value] = param.split("=")
        params[key] = decodeURIComponent(value || "")
      })
    }
    
    return params
  },
  
  /**
   * 延迟执行
   */
  delay: function(seconds) {
    if (typeof MNUtil !== 'undefined' && MNUtil.delay) {
      return MNUtil.delay(seconds)
    }
    
    // 降级处理
    return new Promise((resolve) => {
      NSTimer.scheduledTimerWithTimeIntervalRepeatsBlock(seconds, false, resolve)
    })
  },
  
  /**
   * 动画执行
   */
  animate: function(animations, duration = 0.3) {
    if (typeof MNUtil !== 'undefined' && MNUtil.animate) {
      return MNUtil.animate(animations, duration)
    }
    
    // 降级处理
    return new Promise((resolve) => {
      UIView.animateWithDurationAnimationsCompletion(
        duration,
        animations,
        () => resolve()
      )
    })
  },
  
  /**
   * 撤销分组
   */
  undoGrouping: function(block) {
    if (typeof MNUtil !== 'undefined' && MNUtil.undoGrouping) {
      MNUtil.undoGrouping(block)
    } else {
      // 直接执行
      block()
    }
  },
  
  /**
   * 约束值在范围内
   */
  constrain: function(value, min, max) {
    if (typeof MNUtil !== 'undefined' && MNUtil.constrain) {
      return MNUtil.constrain(value, min, max)
    }
    
    return Math.max(min, Math.min(max, value))
  },
  
  /**
   * 复制到剪贴板
   */
  copy: function(text) {
    if (typeof MNUtil !== 'undefined' && MNUtil.copy) {
      MNUtil.copy(text)
    } else {
      UIPasteboard.generalPasteboard().string = text
      this.showHUD("已复制到剪贴板")
    }
  },
  
  /**
   * 复制 JSON 对象
   */
  copyJSON: function(obj) {
    try {
      let jsonString = JSON.stringify(obj, null, 2)
      this.copy(jsonString)
    } catch (error) {
      this.showHUD("复制失败: " + error.message)
    }
  },
  
  /**
   * 输入对话框
   */
  input: async function(title, message, defaultValue = "") {
    if (typeof MNUtil !== 'undefined' && MNUtil.input) {
      return await MNUtil.input(title, message, defaultValue)
    }
    
    // 降级处理：返回默认值
    this.showHUD("输入功能需要 MNUtils 支持")
    return defaultValue
  },
  
  /**
   * 确认对话框
   */
  confirm: async function(title, message) {
    if (typeof MNUtil !== 'undefined' && MNUtil.confirm) {
      return await MNUtil.confirm(title, message)
    }
    
    // 降级处理：总是返回 true
    this.showHUD(title + ": " + message)
    return true
  },
  
  /**
   * 获取当前时间戳
   */
  getTimestamp: function() {
    return new Date().toISOString().replace(/[:.]/g, '-')
  },
  
  /**
   * 获取安全的文件名
   */
  getSafeFileName: function(name) {
    return name.replace(/[^\w\s-]/g, '').trim()
  },
  
  /**
   * 检查是否为 MN4
   */
  isMN4: function() {
    if (typeof MNUtil !== 'undefined' && MNUtil.isOldMN3) {
      return !MNUtil.isOldMN3()
    }
    
    // 通过检查 API 是否存在来判断
    return typeof MNExtensionPanel !== 'undefined'
  },
  
  /**
   * 获取十六进制颜色
   */
  hexColorAlpha: function(hex, alpha) {
    if (typeof MNButton !== 'undefined' && MNButton.hexColorAlpha) {
      return MNButton.hexColorAlpha(hex, alpha)
    }
    
    // 降级处理
    return UIColor.colorWithHexString(hex)
  }
}