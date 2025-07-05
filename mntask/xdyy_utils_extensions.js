/**
 * 夏大鱼羊的 taskUtils 扩展函数
 * 通过 prototype 方式扩展 taskUtils 类的功能
 */

/**
 * MNTaskManager - 任务管理系统核心类
 * 参考 MNMath 的设计模式，定义任务类型预设和管理 API
 */
class MNTaskManager {
  /**
   * 解析任务卡片标题
   * @param {string} title - 任务卡片标题
   * @returns {Object} 解析后的标题各部分
   */
  static parseTaskTitle(title) {
    let titleParts = {}
    // 匹配格式：【类型 >> 路径｜状态】内容 或 【类型｜状态】内容
    let match = title.match(/^【([^｜】]+)｜([^】]+)】(.*)/)
    
    if (match) {
      const typeAndPath = match[1].trim()  // "类型" 或 "类型 >> 路径"
      titleParts.status = match[2].trim()  // 状态
      titleParts.content = match[3].trim()  // 内容
      
      // 分离类型和路径
      if (typeAndPath.includes(' >> ')) {
        const parts = typeAndPath.split(' >> ')
        titleParts.type = parts[0].trim()
        titleParts.path = parts.slice(1).join(' >> ').trim()  // 处理多层路径
      } else {
        titleParts.type = typeAndPath
        titleParts.path = ""
      }
      
      titleParts.typeAndPath = typeAndPath  // 保留完整的类型和路径
    }
    
    return titleParts
  }

  /**
   * 判断是否是任务类卡片
   * @param {MNNote} note - 要判断的卡片
   * @returns {boolean} 是否是任务卡片
   */
  static isTaskCard(note) {
    const title = note.noteTitle || ""
    
    // 必须符合基本格式
    if (!title.startsWith("【") || !title.includes("｜") || !title.includes("】")) {
      return false
    }
    
    // 解析标题获取类型
    const titleParts = this.parseTaskTitle(title)
    if (!titleParts.type) {
      return false
    }
    
    // 只接受这四种任务类型
    const validTypes = ["目标", "关键结果", "项目", "动作"]
    return validTypes.includes(titleParts.type)
  }

  /**
   * 更新任务路径
   * @param {MNNote} note - 要更新的任务卡片
   */
  static updateTaskPath(note) {
    const titleParts = this.parseTaskTitle(note.noteTitle)
    const parentNote = note.parentNote
    
    if (!parentNote || !this.isTaskCard(parentNote)) {
      // 没有父任务或父级不是任务，保持原状
      return
    }
    
    // 解析父任务
    const parentParts = this.parseTaskTitle(parentNote.noteTitle)
    
    // 构建新路径：父级路径 >> 父级内容
    let newPath = ""
    if (parentParts.path) {
      newPath = `${parentParts.path} >> ${parentParts.content}`
    } else {
      newPath = parentParts.content
    }
    
    // 重构标题，正确包含新路径
    let newTitle
    if (newPath) {
      // 有路径的情况
      newTitle = `【${titleParts.type} >> ${newPath}｜${titleParts.status}】${titleParts.content}`
    } else {
      // 无路径的情况（不应该发生，但以防万一）
      newTitle = `【${titleParts.type}｜${titleParts.status}】${titleParts.content}`
    }
    
    MNUtil.undoGrouping(() => {
      note.noteTitle = newTitle
    })
  }

  /**
   * 转换为任务卡片
   * @param {MNNote} note - 要转换的卡片
   */
  static async convertToTaskCard(note) {
    // 先使用 MNMath.toNoExcerptVersion 处理摘录卡片
    let targetNote = note
    if (note.excerptText) {
      // 检查是否有 MNMath 类
      if (typeof MNMath !== 'undefined' && MNMath.toNoExcerptVersion) {
        targetNote = MNMath.toNoExcerptVersion(note)
      } else {
        // 如果没有 MNMath，尝试手动加载 mnutils
        try {
          JSB.require('mnutils')
          if (typeof MNMath !== 'undefined' && MNMath.toNoExcerptVersion) {
            targetNote = MNMath.toNoExcerptVersion(note)
          }
        } catch (e) {
          // 如果还是不行，使用简单的处理方式
        }
      }
    }
    
    // 弹窗让用户选择类型
    const taskTypes = ["目标", "关键结果", "项目", "动作"]
    const selectedIndex = await MNUtil.userSelect("选择任务类型", "", taskTypes)
    
    if (selectedIndex === 0) return // 用户取消
    
    const selectedType = taskTypes[selectedIndex - 1]
    
    MNUtil.undoGrouping(() => {
      // 构建任务路径
      const path = this.buildTaskPath(targetNote)
      
      // 构建新标题
      const content = targetNote.noteTitle || "未命名任务"
      const newTitle = path ? 
        `【${selectedType} >> ${path}｜未开始】${content}` :
        `【${selectedType}｜未开始】${content}`
      
      targetNote.noteTitle = newTitle
      
      // 设置颜色（白色=未开始）
      targetNote.colorIndex = 0
      
      // 创建空函数供后续实现
      this.addTaskFields(targetNote, selectedType)
      this.linkParentTask(targetNote)
    })
  }

  /**
   * 构建任务路径
   * @param {MNNote} note - 要构建路径的卡片
   * @returns {string} 任务路径
   */
  static buildTaskPath(note) {
    const parentNote = note.parentNote
    if (!parentNote || !this.isTaskCard(parentNote)) {
      return ""
    }
    
    const parentParts = this.parseTaskTitle(parentNote.noteTitle)
    
    if (parentParts.path) {
      return `${parentParts.path} >> ${parentParts.content}`
    } else {
      return parentParts.content
    }
  }

  /**
   * 添加任务字段（HtmlComment）
   * @param {MNNote} note - 要添加字段的卡片
   * @param {string} taskType - 任务类型
   */
  static addTaskFields(note, taskType) {
    // TODO: 根据任务类型添加相应的字段
  }

  /**
   * 链接父任务
   * @param {MNNote} note - 要链接的卡片
   */
  static linkParentTask(note) {
    // TODO: 创建与父任务的链接关系
  }

  /**
   * 获取任务类型定义
   * @param {string} type - 任务类型
   * @returns {Object} 类型定义
   */
  static getTaskType(type) {
    const types = {
      "目标": {
        prefix: "目标",
        key: "objective",
        fields: ["关键结果", "进度", "截止日期", "负责人"]
      },
      "关键结果": {
        prefix: "关键结果",
        key: "keyResult",
        fields: ["完成标准", "进度", "相关项目"]
      },
      "项目": {
        prefix: "项目",
        key: "project",
        fields: ["项目描述", "里程碑", "资源", "风险"]
      },
      "动作": {
        prefix: "动作",
        key: "action",
        fields: ["执行细节", "预计时间", "执行场景", "前置条件"]
      }
    }
    return types[type]
  }

  /**
   * 更新任务状态
   * @param {MNNote} note - 要更新的任务卡片
   * @param {string} newStatus - 新状态
   */
  static updateTaskStatus(note, newStatus) {
    if (!this.isTaskCard(note)) return
    
    const titleParts = this.parseTaskTitle(note.noteTitle)
    const typeWithPath = titleParts.path ? 
      `${titleParts.type} >> ${titleParts.path}` : 
      titleParts.type
    
    const newTitle = `【${typeWithPath}｜${newStatus}】${titleParts.content}`
    
    // 设置对应的颜色
    let colorIndex = 0  // 默认白色
    switch (newStatus) {
      case "已完成":
        colorIndex = 1  // 绿色
        break
      case "进行中":
        colorIndex = 3  // 粉色
        break
      case "未开始":
        colorIndex = 0  // 白色
        break
    }
    
    MNUtil.undoGrouping(() => {
      note.noteTitle = newTitle
      note.colorIndex = colorIndex
    })
  }

  /**
   * 移动卡片到指定父卡片下
   * @param {MNNote} sourceNote - 要移动的卡片
   * @param {MNNote} targetNote - 目标父卡片
   */
  static moveTo(sourceNote, targetNote) {
    if (!sourceNote || !targetNote) {
      return false
    }
    
    try {
      MNUtil.undoGrouping(() => {
        // 将源卡片添加为目标卡片的子卡片
        targetNote.addChild(sourceNote)
        
        // 如果是任务卡片，更新路径
        if (this.isTaskCard(sourceNote)) {
          this.updateTaskPath(sourceNote)
        }
      })
      
      return true
    } catch (error) {
      return false
    }
  }
}


/**
 * 初始化扩展
 * 需要在 taskUtils 定义后调用
 */
function initXDYYExtensions() {
  // 扩展 defaultWindowState 配置
  if (taskUtils.defaultWindowState) {
    taskUtils.defaultWindowState.preprocess = false;
  }

}

/**
 * 扩展 taskConfig init 方法
 * 在 taskConfig.init() 调用后调用
 */
function extendTaskConfigInit() {
  // 保存原始的 init 方法
  const originalInit = taskConfig.init
  
  // 重写 init 方法
  taskConfig.init = function(mainPath) {
    // 调用原始的 init 方法（taskConfig.init 是静态方法，应该使用 taskConfig 作为上下文）
    originalInit.call(taskConfig, mainPath)
    
    // 添加扩展的初始化逻辑
    // 用来存参考文献的数据
    taskConfig.referenceIds = taskConfig.getByDefault("MNTask_referenceIds", {})
  }
  
  // 添加 togglePreprocess 静态方法
  // 夏大鱼羊
  taskConfig.togglePreprocess = function() {
    MNUtil.showHUD("调试：togglePreprocess 函数开始执行")
    if (!taskUtils.checkSubscribe(true)) {
      MNUtil.showHUD("调试：订阅检查失败")
      return
    }
    MNUtil.showHUD("调试：订阅检查通过")
    if (taskConfig.getWindowState("preprocess") === false) {
      taskConfig.windowState.preprocess = true
      taskConfig.save("MNTask_windowState")
      MNUtil.showHUD("卡片预处理模式：✅ 开启")
    } else {
      taskConfig.windowState.preprocess = false
      taskConfig.save("MNTask_windowState")
      MNUtil.showHUD("卡片预处理模式：❌ 关闭")
    }
    MNUtil.postNotification("refreshTaskButton", {})
  }
  
  // 扩展 defaultWindowState
  // 夏大鱼羊
  if (taskConfig.defaultWindowState) {
    taskConfig.defaultWindowState.preprocess = false
  }
}

// 导出初始化函数
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initXDYYExtensions,
    extendTaskConfigInit
  }
}

// 立即执行初始化
try {
  if (typeof taskUtils !== 'undefined') {
    initXDYYExtensions();
  }
  
  if (typeof taskConfig !== 'undefined') {
    extendTaskConfigInit();
  }
} catch (error) {
  // 静默处理错误
}