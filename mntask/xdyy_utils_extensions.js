/**
 * 夏大鱼羊的 taskUtils 扩展函数
 * 通过 prototype 方式扩展 taskUtils 类的功能
 */

/**
 * TaskFieldUtils - 任务字段工具类
 * 参考 HtmlMarkdownUtils 的设计，处理任务卡片的字段系统
 */
class TaskFieldUtils {
  /**
   * 字段样式定义
   */
  static styles = {
    // 主字段样式（信息、包含等）
    mainField: 'font-weight:600;color:#1E40AF;background:linear-gradient(15deg,#EFF6FF 30%,#DBEAFE);border:2px solid #3B82F6;border-radius:12px;padding:10px 18px;display:inline-block;box-shadow:2px 2px 0px #BFDBFE,4px 4px 8px rgba(59,130,246,0.12);position:relative;margin:4px 8px;',
    // 子字段样式（状态等）
    subField: 'background:#FFF;color:#FF8C5A;border:2px solid currentColor;border-radius:3px;padding:6px 12px;font-size:0.7em;font-weight:600;box-shadow:0 1px 3px rgba(255,140,90,0.2);display:inline-block;'
  }
  
  /**
   * 创建带样式的字段 HTML
   * @param {string} text - 字段文本
   * @param {string} type - 字段类型 (mainField/subField)
   * @param {string} id - 字段 ID
   * @returns {string} 格式化的 HTML 字符串
   */
  static createFieldHtml(text, type = 'mainField', id = '') {
    const style = this.styles[type] || this.styles.mainField
    const idAttr = id ? `id="${id}"` : `id="${type}"`
    return `<span ${idAttr} style="${style}">${text}</span>`
  }
  
  /**
   * 创建状态字段
   * @param {string} status - 状态文本（未开始/进行中/已完成）
   * @returns {string} 格式化的状态字段 HTML
   */
  static createStatusField(status) {
    let emoji = ''
    switch (status) {
      case '未开始':
        emoji = '😴 '
        break
      case '进行中':
        emoji = '🔥 '
        break
      case '已完成':
        emoji = '✅ '
        break
    }
    return this.createFieldHtml(`${emoji}${status}`, 'subField', `status-${status}`)
  }
  
  /**
   * 检查是否是任务字段评论
   * @param {string|MNComment} comment - 评论内容或评论对象
   * @returns {boolean} 是否是任务字段
   */
  static isTaskField(comment) {
    let text = ''
    if (typeof comment === 'string') {
      text = comment
    } else if (comment && comment.text) {
      text = comment.text
    }
    
    // 检查是否包含任务字段特征
    return text.includes('<span') && (
      text.includes('id="mainField"') || 
      text.includes('id="subField"') ||
      text.includes('id="status-')
    )
  }
  
  /**
   * 获取字段类型
   * @param {string|MNComment} comment - 评论内容或评论对象
   * @returns {string} 字段类型
   */
  static getFieldType(comment) {
    let text = ''
    if (typeof comment === 'string') {
      text = comment
    } else if (comment && comment.text) {
      text = comment.text
    }
    
    const regex = /<span\s+id="([^"]*)"/ 
    const match = text.match(regex)
    return match ? match[1] : ''
  }
  
  /**
   * 获取字段内容（不含 HTML 标签）
   * @param {string|MNComment} comment - 评论内容或评论对象
   * @returns {string} 纯文本内容
   */
  static getFieldContent(comment) {
    let text = ''
    if (typeof comment === 'string') {
      text = comment
    } else if (comment && comment.text) {
      text = comment.text
    }
    
    const regex = /<span[^>]*>(.*?)<\/span>/
    const match = text.match(regex)
    return match ? match[1].trim() : text
  }
}

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
      
      // 添加任务字段（信息字段和状态字段）
      this.addTaskFieldsWithStatus(targetNote)
      
      // 处理与父任务的链接关系
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
    // 现在改为调用新方法
    this.addTaskFieldsWithStatus(note)
  }
  
  /**
   * 添加带状态的任务字段
   * @param {MNNote} note - 要添加字段的卡片
   */
  static addTaskFieldsWithStatus(note) {
    if (!note || this.hasTaskFields(note)) {
      return // 已经有字段了，不重复添加
    }
    
    MNUtil.undoGrouping(() => {
      // 添加主字段"信息"
      const mainFieldHtml = TaskFieldUtils.createFieldHtml('信息', 'mainField')
      note.appendMarkdownComment(mainFieldHtml)
      
      // 添加三个状态子字段
      const statuses = ['未开始', '进行中', '已完成']
      statuses.forEach(status => {
        const statusHtml = TaskFieldUtils.createStatusField(status)
        note.appendMarkdownComment(statusHtml)
      })
    })
  }

  /**
   * 检查任务卡片是否已添加字段
   * @param {MNNote} note - 要检查的卡片
   * @returns {boolean} 是否已添加任务字段
   */
  static hasTaskFields(note) {
    if (!note || !note.comments) return false
    
    // 检查是否有"信息"主字段
    const comments = note.comments
    for (let comment of comments) {
      if (comment && comment.type === 'markdownComment') {
        const text = comment.text || ''
        // 检查是否包含主字段"信息"
        if (TaskFieldUtils.isTaskField(text) && text.includes('信息')) {
          return true
        }
      }
    }
    
    return false
  }

  /**
   * 解析任务卡片的评论结构
   * @param {MNNote} note - 要解析的卡片
   * @returns {Object} 解析后的评论结构
   */
  static parseTaskComments(note) {
    const result = {
      taskFields: [],       // 任务字段（主字段和子字段）
      links: [],            // 链接评论
      belongsTo: null,      // 所属字段
      otherComments: []     // 其他评论
    }
    
    if (!note || !note.comments) return result
    
    const comments = note.comments
    comments.forEach((comment, index) => {
      if (!comment) return
      
      const text = comment.text || ''
      
      // 检查是否是任务字段
      if (comment.type === 'markdownComment' && TaskFieldUtils.isTaskField(text)) {
        const fieldType = TaskFieldUtils.getFieldType(text)
        const content = TaskFieldUtils.getFieldContent(text)
        
        result.taskFields.push({
          index: index,
          text: text,
          fieldType: fieldType,
          content: content,
          isMainField: fieldType === 'mainField',
          isStatusField: fieldType.startsWith('status-')
        })
      }
      // 检查是否是链接
      else if (comment.type === 'linkedNote') {
        result.links.push({
          index: index,
          linkedNoteId: comment.linkedNoteId,
          comment: comment
        })
      }
      // 检查是否是"所属"字段
      else if (comment.type === 'markdownComment' && text.startsWith('所属:')) {
        result.belongsTo = {
          index: index,
          text: text,
          comment: comment
        }
      }
      // 其他评论
      else {
        result.otherComments.push({
          index: index,
          comment: comment
        })
      }
    })
    
    return result
  }

  /**
   * 移动评论到指定字段下方
   * @param {MNNote} note - 要操作的卡片
   * @param {number|Array} commentIndices - 要移动的评论索引（单个或数组）
   * @param {string} fieldText - 目标字段的文本内容（如"未开始"、"进行中"等）
   * @param {boolean} toBottom - 是否移动到字段的最底部（默认 true）
   */
  static moveCommentToField(note, commentIndices, fieldText, toBottom = true) {
    if (!note || !note.comments) return
    
    const parsed = this.parseTaskComments(note)
    let targetIndex = -1
    
    // 查找目标字段
    for (let field of parsed.taskFields) {
      if (field.content.includes(fieldText)) {
        if (toBottom) {
          // 移动到该字段的最底部
          // 需要找到下一个字段的位置或卡片末尾
          const currentFieldIndex = field.index
          let nextFieldIndex = note.comments.length
          
          // 查找下一个字段
          for (let nextField of parsed.taskFields) {
            if (nextField.index > currentFieldIndex) {
              nextFieldIndex = nextField.index
              break
            }
          }
          
          targetIndex = nextFieldIndex
        } else {
          // 移动到字段的紧下方
          targetIndex = field.index + 1
        }
        break
      }
    }
    
    if (targetIndex === -1) return
    
    // 转换为数组
    const indices = Array.isArray(commentIndices) ? commentIndices : [commentIndices]
    
    // 使用 moveCommentsByIndexArr 方法移动评论
    if (note.moveCommentsByIndexArr) {
      note.moveCommentsByIndexArr(indices, targetIndex)
    } else if (note.moveComment) {
      // 备用方法：逐个移动
      indices.forEach(index => {
        note.moveComment(index, targetIndex)
      })
    }
  }

  /**
   * 更新或创建"所属"字段
   * @param {MNNote} note - 要更新的卡片
   * @param {MNNote} parentNote - 父任务卡片
   */
  static updateBelongsToField(note, parentNote) {
    if (!note || !parentNote) return
    
    const parsed = this.parseTaskComments(note)
    const parentParts = this.parseTaskTitle(parentNote.noteTitle)
    
    // 构建所属字段内容
    const belongsToText = `所属: [${parentParts.content}](${parentNote.noteId})`
    
    // 检查是否已有所属字段
    if (parsed.belongsTo) {
      // 更新现有字段
      const index = parsed.belongsTo.index
      MNUtil.undoGrouping(() => {
        note.replaceWithMarkdownComment(belongsToText, index)
      })
    } else {
      // 创建新的所属字段
      MNUtil.undoGrouping(() => {
        note.appendMarkdownComment(belongsToText)
        
        // 移动到"信息"字段下方
        const lastIndex = note.comments.length - 1
        this.moveCommentToField(note, lastIndex, '信息', false)
      })
    }
  }

  /**
   * 链接父任务
   * @param {MNNote} note - 要链接的卡片
   * @param {MNNote} parentNote - 父任务卡片（可选）
   */
  static linkParentTask(note, parentNote = null) {
    if (!note) return
    
    // 如果没有提供父任务，尝试获取当前父卡片
    const parent = parentNote || note.parentNote
    
    // 检查父卡片是否是任务类型
    if (!parent || !this.isTaskCard(parent)) {
      return
    }
    
    MNUtil.undoGrouping(() => {
      // 1. 在子任务中创建到父任务的链接（B 单向链接到 A）
      note.appendNoteLink(parent, "To")
      
      // 2. 在子任务中更新所属字段
      this.updateBelongsToField(note, parent)
      
      // 3. 在父任务中创建到子任务的链接
      parent.appendNoteLink(note, "To")
      
      // 4. 获取父任务中刚添加的链接索引
      const linkIndexInParent = parent.comments.length - 1
      
      // 5. 获取子任务的状态
      const titleParts = this.parseTaskTitle(note.noteTitle)
      const status = titleParts.status || '未开始'
      
      // 6. 将父任务中的链接移动到对应状态字段下
      this.moveCommentToField(parent, linkIndexInParent, status, true)
    })
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