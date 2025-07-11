/**
 * 夏大鱼羊的 taskUtils 扩展函数
 * 通过 prototype 方式扩展 taskUtils 类的功能
 */

// 文件加载日志
if (typeof MNUtil !== 'undefined' && MNUtil.log) {
  MNUtil.log("🔧 开始加载 xdyy_utils_extensions.js")
}

/**
 * 安全的文本格式化函数
 * 如果 Pangu 存在则使用 Pangu.spacing，否则返回原文本
 * @param {string} text - 要格式化的文本
 * @returns {string} 格式化后的文本
 */
function safeSpacing(text) {
  if (typeof Pangu !== 'undefined' && Pangu.spacing) {
    return Pangu.spacing(text)
  }
  return text
}

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
    // 子字段样式（所属等）
    subField: 'background:#FFF;color:#FF8C5A;border:2px solid currentColor;border-radius:3px;padding:6px 12px;font-size:0.9em;font-weight:600;box-shadow:0 1px 3px rgba(255,140,90,0.2);display:inline-block;',
    // 状态字段样式（未开始/进行中/已完成）
    stateField: 'background:#FFF;color:#FF8C5A;border:2px solid currentColor;border-radius:3px;padding:6px 12px;font-size:0.7em;font-weight:600;box-shadow:0 1px 3px rgba(255,140,90,0.2);display:inline-block;'
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
   * @param {string} status - 状态文本（未开始/进行中/已完成/已归档）
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
      case '已归档':
        emoji = '📦 '
        break
    }
    return this.createFieldHtml(`${emoji}${status}`, 'stateField')
  }
  
  /**
   * 创建所属字段
   * @param {string} parentTitle - 父任务标题
   * @param {string} parentURL - 父任务链接
   * @returns {string} 格式化的所属字段 HTML
   */
  static createBelongsToField(parentTitle, parentURL) {
    const belongsHtml = this.createFieldHtml('所属', 'subField')
    return safeSpacing(`${belongsHtml} [${parentTitle}](${parentURL})`)
  }
  
  /**
   * 创建今日字段
   * @param {boolean} includeDate - 是否包含日期信息
   * @returns {string} 格式化的今日字段 HTML
   */
  static createTodayField(includeDate = true) {
    const today = new Date()
    const dateStr = includeDate ? ` (${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')})` : ''
    return this.createFieldHtml(`📅 今日${dateStr}`, 'subField')
  }
  
  /**
   * 创建过期字段
   * @param {Date} originalDate - 原始标记日期
   * @param {number} overdueDays - 过期天数
   * @returns {string} 格式化的过期字段 HTML
   */
  static createOverdueField(originalDate, overdueDays) {
    const dateStr = `${originalDate.getFullYear()}-${String(originalDate.getMonth() + 1).padStart(2, '0')}-${String(originalDate.getDate()).padStart(2, '0')}`
    const daysText = overdueDays === 1 ? '1天' : `${overdueDays}天`
    return this.createFieldHtml(`⚠️ 过期${daysText} (${dateStr})`, 'subField')
  }
  
  /**
   * 创建优先级字段
   * @param {string} priority - 优先级（高/中/低）
   * @returns {string} 格式化的优先级字段 HTML
   */
  static createPriorityField(priority) {
    let emoji = ''
    switch (priority) {
      case '高':
        emoji = '🔴 '
        break
      case '中':
        emoji = '🟡 '
        break
      case '低':
        emoji = '🟢 '
        break
      default:
        emoji = '⚪ '
    }
    return this.createFieldHtml(`🔥 优先级: ${emoji}${priority}`, 'subField')
  }
  
  /**
   * 创建计划时间字段
   * @param {string} time - 计划时间（如 "09:00"）
   * @returns {string} 格式化的计划时间字段 HTML
   */
  static createTimeField(time) {
    return this.createFieldHtml(`⏰ 计划时间: ${time}`, 'subField')
  }
  
  /**
   * 创建任务记录字段
   * @returns {string} 格式化的任务记录字段 HTML
   */
  static createTaskLogField() {
    return this.createFieldHtml('📝 任务记录', 'mainField')
  }
  
  /**
   * 创建单条任务记录
   * @param {string} content - 记录内容
   * @param {number} progress - 进度百分比（0-100）
   * @param {Date} timestamp - 时间戳（默认当前时间）
   * @returns {string} 格式化的记录条目
   */
  static createTaskLogEntry(content, progress, timestamp = new Date()) {
    const timeStr = this.formatTimestamp(timestamp)
    const progressText = progress !== undefined ? ` | 进度: ${progress}%` : ''
    return `- ${timeStr} | ${content}${progressText}`
  }
  
  /**
   * 格式化时间戳
   * @param {Date} date - 日期对象
   * @returns {string} 格式化的时间字符串
   */
  static formatTimestamp(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}`
  }
  
  /**
   * 解析任务记录条目
   * @param {string} entry - 记录条目文本
   * @returns {Object|null} 解析后的记录对象 {timestamp, content, progress}
   */
  static parseTaskLogEntry(entry) {
    // 匹配格式：- YYYY-MM-DD HH:MM | 内容 | 进度: XX%
    const match = entry.match(/^-\s*(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2})\s*\|\s*(.+?)(?:\s*\|\s*进度:\s*(\d+)%)?$/)
    if (!match) return null
    
    return {
      timestamp: match[1],
      content: match[2].trim(),
      progress: match[3] ? parseInt(match[3]) : null
    }
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
      text.includes('id="stateField"')
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
  
  /**
   * 分离字段名和内容
   * @param {string|MNComment} comment - 评论内容或评论对象
   * @returns {{fieldName: string, content: string}} 字段名和内容
   */
  static getFieldNameAndContent(comment) {
    let text = ''
    if (typeof comment === 'string') {
      text = comment
    } else if (comment && comment.text) {
      text = comment.text
    }
    
    // 先提取字段名（span 标签内的内容）
    const spanRegex = /<span[^>]*>(.*?)<\/span>/
    const spanMatch = text.match(spanRegex)
    const fieldName = spanMatch ? spanMatch[1].trim() : ''
    
    // 提取字段后面的内容（去掉 span 标签后的剩余部分）
    const remainingText = text.replace(spanRegex, '').trim()
    
    return {
      fieldName: fieldName,
      content: remainingText
    }
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
      newPath = safeSpacing(`${parentParts.path} >> ${parentParts.content}`)
    } else {
      newPath = parentParts.content
    }
    
    // 重构标题，正确包含新路径
    let newTitle
    if (newPath) {
      // 有路径的情况
      newTitle = safeSpacing(`【${titleParts.type} >> ${newPath}｜${titleParts.status}】${titleParts.content}`)
    } else {
      // 无路径的情况（不应该发生，但以防万一）
      newTitle = safeSpacing(`【${titleParts.type}｜${titleParts.status}】${titleParts.content}`)
    }
    
    MNUtil.undoGrouping(() => {
      note.noteTitle = newTitle
      note.refreshAll()
    })
  }

  /**
   * 转换为任务卡片
   * @param {MNNote} note - 要转换的卡片（如果为空则使用焦点卡片）
   */
  static async convertToTaskCard(note) {
    // 获取要转换的卡片
    const focusNote = note || MNNote.getFocusNote()
    if (!focusNote) return
    
    // 获取父卡片
    const parentNote = focusNote.parentNote
    
    // 先使用 taskUtils.toNoExcerptVersion 处理摘录卡片
    let noteToConvert = focusNote
    if (focusNote.excerptText) {
      const converted = taskUtils.toNoExcerptVersion(focusNote)
      if (converted) {
        noteToConvert = converted
      }
    }
    
    // 检查是否已经是任务格式
    const isAlreadyTask = this.isTaskCard(noteToConvert)
    
    if (isAlreadyTask) {
      // 已经是任务格式，只需要添加字段
      MNUtil.undoGrouping(() => {
        // 添加任务字段（信息字段和状态字段）
        this.addTaskFieldsWithStatus(noteToConvert)
        
        // 直接执行链接操作
        this.linkParentTask(noteToConvert, parentNote)
      })
    } else {
      // 不是任务格式，需要选择类型并转换
      const taskTypes = ["目标", "关键结果", "项目", "动作"]
      const selectedIndex = await MNUtil.userSelect("选择任务类型", "", taskTypes)
      
      if (selectedIndex === 0) return // 用户取消
      
      const selectedType = taskTypes[selectedIndex - 1]
      
      MNUtil.undoGrouping(() => {
        // 构建任务路径
        const path = this.buildTaskPath(noteToConvert)
        
        // 构建新标题
        const content = noteToConvert.noteTitle || "未命名任务"
        const newTitle = path ? 
          safeSpacing(`【${selectedType} >> ${path}｜未开始】${content}`) :
          safeSpacing(`【${selectedType}｜未开始】${content}`)
        
        noteToConvert.noteTitle = newTitle
        
        // 设置颜色（白色=未开始）
        noteToConvert.colorIndex = 12
        
        // 添加任务字段（信息字段和状态字段）
        this.addTaskFieldsWithStatus(noteToConvert)
        
        // 直接执行链接操作
        this.linkParentTask(noteToConvert, parentNote)
      })
    }
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
      return safeSpacing(`${parentParts.path} >> ${parentParts.content}`)
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
      MNUtil.log("⏭️ 跳过添加字段，已存在")
      return // 已经有字段了，不重复添加
    }
    
    MNUtil.log("🎯 开始添加任务字段")
    
    // 解析任务类型
    const titleParts = this.parseTaskTitle(note.noteTitle)
    const taskType = titleParts.type
    
    MNUtil.log(`📋 任务类型：${taskType}`)
    
    MNUtil.undoGrouping(() => {
      // 添加主字段"信息"
      const infoFieldHtml = TaskFieldUtils.createFieldHtml('信息', 'mainField')
      MNUtil.log("📝 信息字段HTML: " + infoFieldHtml)
      note.appendMarkdownComment(infoFieldHtml)
      MNUtil.log("✅ 添加信息字段，索引：" + (note.MNComments.length - 1))
      
      // 如果是"动作"类型，只添加信息字段，跳过其他字段
      if (taskType === "动作") {
        MNUtil.log("🎯 动作类型任务，只添加信息字段")
        MNUtil.log("🎯 任务字段添加完成，总评论数：" + note.MNComments.length)
        return
      }
      
      // 其他类型（目标、关键结果、项目）继续添加剩余字段
      
      // 添加主字段"包含"
      const containsFieldHtml = TaskFieldUtils.createFieldHtml('包含', 'mainField')
      MNUtil.log("📝 包含字段HTML: " + containsFieldHtml)
      note.appendMarkdownComment(containsFieldHtml)
      MNUtil.log("✅ 添加包含字段，索引：" + (note.MNComments.length - 1))
      
      // 添加四个状态子字段（移除"已阻塞"和"已取消"）
      const statuses = ['未开始', '进行中', '已完成', '已归档']
      statuses.forEach(status => {
        const statusHtml = TaskFieldUtils.createStatusField(status)
        MNUtil.log(`📝 ${status}字段HTML: ` + statusHtml)
        note.appendMarkdownComment(statusHtml)
        MNUtil.log(`✅ 添加${status}字段，索引：` + (note.MNComments.length - 1))
      })
      
      MNUtil.log("🎯 任务字段添加完成，总评论数：" + note.MNComments.length)
    })
  }

  /**
   * 检查任务卡片是否已添加字段
   * @param {MNNote} note - 要检查的卡片
   * @returns {boolean} 是否已添加任务字段
   */
  static hasTaskFields(note) {
    if (!note || !note.MNComments) return false
    
    // 检查是否有"信息"主字段
    const comments = note.MNComments
    for (let comment of comments) {
      if (comment) {
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
    
    if (!note || !note.MNComments) return result
    
    let comments = []
    try {
      comments = note.MNComments || []
    } catch (e) {
      MNUtil.log("⚠️ 获取 MNComments 失败: " + e.message)
      return result
    }
    
    MNUtil.log("📋 总评论数：" + comments.length)
    
    comments.forEach((comment, index) => {
      if (!comment) return
      
      let text = ''
      let commentType = ''
      
      try {
        text = comment.text || ''
        commentType = comment.type || ''
      } catch (e) {
        MNUtil.log(`⚠️ 评论 ${index} 属性访问失败: ` + e.message)
        return
      }
      
      MNUtil.log(`🔍 评论 ${index}: type=${commentType}, text=${text.substring(0, 50) + (text.length > 50 ? '...' : '')}, isTaskField=${TaskFieldUtils.isTaskField(text)}`)
      
      // 检查是否是任务字段（MNComment 对象的 type 已经是处理后的类型）
      if ((commentType === 'textComment' || commentType === 'markdownComment') && TaskFieldUtils.isTaskField(text)) {
        const fieldType = TaskFieldUtils.getFieldType(text)
        const content = TaskFieldUtils.getFieldContent(text)
        
        MNUtil.log(`✅ 识别为任务字段: fieldType=${fieldType}, content=${content}`)
        
        result.taskFields.push({
          index: index,
          text: text,
          fieldType: fieldType,
          content: content,
          isMainField: fieldType === 'mainField',
          isStatusField: fieldType === 'stateField'
        })
        
        // 如果是"所属"字段，也记录到 belongsTo
        if (content === '所属') {
          result.belongsTo = {
            index: index,
            text: text,
            comment: comment
          }
        }
      }
      // 检查是否是链接
      else if (commentType === 'linkComment') {
        // 获取链接的目标笔记 ID
        let linkedNoteId = null
        try {
          if (comment.note && comment.note.noteId) {
            linkedNoteId = comment.note.noteId
          } else if (comment.detail && comment.detail.text) {
            // 从 URL 中提取 noteId
            const match = comment.detail.text.match(/marginnote\dapp:\/\/note\/([A-Z0-9-]+)/)
            if (match) {
              linkedNoteId = match[1]
            }
          }
        } catch (e) {
          MNUtil.log("⚠️ 获取链接目标失败: " + e.message)
        }
        
        if (linkedNoteId) {
          result.links.push({
            index: index,
            linkedNoteId: linkedNoteId,
            comment: comment
          })
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
    if (!note || !note.MNComments) return
    
    MNUtil.log("🚚 moveCommentToField 开始 fieldText=" + fieldText + ", toBottom=" + toBottom + ", commentIndices=" + JSON.stringify(commentIndices))
    MNUtil.log("📋 卡片标题：" + note.noteTitle)
    MNUtil.log("📋 总评论数：" + note.MNComments.length)
    
    const parsed = this.parseTaskComments(note)
    MNUtil.log("📋 解析到的任务字段：" + JSON.stringify(parsed.taskFields.map(f => ({content: f.content, index: f.index, type: f.fieldType}))))
    
    let targetIndex = -1
    
    // 查找目标字段
    for (let field of parsed.taskFields) {
      MNUtil.log("🔍 检查字段：" + field.content + " 是否包含 " + fieldText)
      if (field.content.includes(fieldText)) {
        MNUtil.log("✅ 找到匹配字段！")
        if (toBottom) {
          // 移动到该字段的最底部
          const currentFieldIndex = field.index
          let nextFieldIndex = note.MNComments.length
          
          // 如果当前字段是主字段，找下一个主字段
          if (field.isMainField) {
            // 查找下一个主字段
            for (let nextField of parsed.taskFields) {
              if (nextField.isMainField && nextField.index > currentFieldIndex) {
                nextFieldIndex = nextField.index
                MNUtil.log("🔍 找到下一个主字段：" + nextField.content + " at index " + nextFieldIndex)
                break
              }
            }
          } else {
            // 子字段：查找下一个任意字段
            for (let nextField of parsed.taskFields) {
              if (nextField.index > currentFieldIndex) {
                nextFieldIndex = nextField.index
                break
              }
            }
          }
          
          // 目标位置就是下一个字段的位置
          targetIndex = nextFieldIndex
          MNUtil.log("📍 目标索引（底部）：" + targetIndex)
        } else {
          // 移动到字段的紧下方
          targetIndex = field.index + 1
          MNUtil.log("📍 目标索引（紧下方）：" + targetIndex)
        }
        break
      }
    }
    
    if (targetIndex === -1) {
      MNUtil.log("❌ 未找到目标字段: " + fieldText)
      MNUtil.log("🔍 可用的字段有：" + parsed.taskFields.map(f => `"${f.content}"`).join(", "))
      
      // 特殊处理：如果找不到状态字段，可能是因为卡片结构有问题
      // 检查是否是状态字段
      const statusFields = ['未开始', '进行中', '已完成']
      if (statusFields.includes(fieldText)) {
        MNUtil.log("⚠️ 这是一个状态字段，但未找到。检查卡片是否已正确初始化任务字段")
        // 尝试添加任务字段
        if (!this.hasTaskFields(note)) {
          MNUtil.log("🔧 卡片缺少任务字段，尝试添加")
          this.addTaskFieldsWithStatus(note)
          // 重新解析
          const newParsed = this.parseTaskComments(note)
          for (let field of newParsed.taskFields) {
            if (field.content.trim() === fieldText.trim()) {
              targetIndex = toBottom ? field.index + 1 : field.index + 1  // 暂时都紧贴字段
              MNUtil.log(`✅ 添加字段后找到目标字段："${field.content}" at index ${field.index}`)
              break
            }
          }
        }
      }
      
      // 如果还是找不到，返回
      if (targetIndex === -1) {
        return
      }
    }
    
    // 转换为数组
    const indices = Array.isArray(commentIndices) ? commentIndices : [commentIndices]
    MNUtil.log("📝 要移动的索引：" + JSON.stringify(indices))
    
    // 使用 moveComment 方法移动评论
    // 参考 MNMath 的实现，需要考虑移动方向
    indices.forEach(index => {
      MNUtil.log(`📍 准备移动评论: index=${index}, targetIndex=${targetIndex}, 评论总数=${note.MNComments.length}`)
      
      // 获取要移动的评论内容（用于调试）
      try {
        const commentToMove = note.MNComments[index]
        if (commentToMove) {
          MNUtil.log(`📋 要移动的评论类型: ${commentToMove.type}`)
          if (commentToMove.type === 'linkComment' && commentToMove.note) {
            MNUtil.log(`🔗 这是一个链接评论，指向: ${commentToMove.note.noteTitle || commentToMove.note.noteId}`)
          }
        }
      } catch (e) {
        MNUtil.log(`⚠️ 无法读取评论内容: ${e.message}`)
      }
      
      // 判断移动方向
      if (index < targetIndex) {
        // 向下移动，目标位置需要减 1
        // 但如果目标位置是最后一个位置，则不需要减 1
        const actualTarget = targetIndex === note.MNComments.length ? targetIndex - 1 : targetIndex - 1
        MNUtil.log(`🔄 向下移动评论从索引 ${index} 到 ${actualTarget} (原目标 ${targetIndex})`)
        try {
          note.moveComment(index, actualTarget, false)
          MNUtil.log(`✅ 移动成功`)
        } catch (e) {
          MNUtil.log(`❌ 移动失败: ${e.message}`)
        }
      } else if (index > targetIndex) {
        // 向上移动，直接使用目标位置
        MNUtil.log(`🔄 向上移动评论从索引 ${index} 到 ${targetIndex}`)
        try {
          note.moveComment(index, targetIndex, false)
          MNUtil.log(`✅ 移动成功`)
        } catch (e) {
          MNUtil.log(`❌ 移动失败: ${e.message}`)
        }
      } else {
        MNUtil.log(`⚠️ 评论已在目标位置，无需移动`)
      }
    })
    
    MNUtil.log("✅ moveCommentToField 完成")
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
    const belongsToText = TaskFieldUtils.createBelongsToField(parentParts.content, parentNote.noteURL)
    
    // 检查是否已有所属字段
    if (parsed.belongsTo) {
      // 更新现有字段
      const index = parsed.belongsTo.index
      MNUtil.undoGrouping(() => {
        note.replaceWithMarkdownComment(belongsToText, index)
      })
    } else {
      // 创建新的所属字段
      // 先添加所属字段
      note.appendMarkdownComment(belongsToText)
      
      // 获取刚添加的评论索引
      const lastIndex = note.MNComments.length - 1
      
      // 移动到"信息"字段下方（toBottom = false 表示紧贴字段下方）
      this.moveCommentToField(note, lastIndex, '信息', false)
    }
  }

  /**
   * 检查是否有启动字段
   * @param {MNNote} note - 要检查的笔记
   * @returns {boolean} 是否有启动字段
   */
  static hasLaunchField(note) {
    if (!note || !note.MNComments) return false
    
    for (let comment of note.MNComments) {
      if (comment && comment.text) {
        // 检查是否包含 [启动] 的 Markdown 链接格式
        if (comment.text.includes('[启动](')) {
          return true
        }
      }
    }
    return false
  }

  /**
   * 添加默认启动字段
   * @param {MNNote} note - 要添加启动字段的笔记
   */
  static addDefaultLaunchField(note) {
    if (!note) return
    
    const defaultLaunchLink = "marginnote4app://uistatus/H4sIAAAAAAAAE5VSy5LbIBD8F87SFuIp%2BWbJ5VxyyCG3VCqF0LBmg4VKoM06W%2F73AHbiveY2j56mp5l3NHr%2F8zxxtEOGgNbYMNNJGGmHJWAsmRg7wRQIojpDZQtEj5ibpm0apeRI5ahBcKEx4agqZGFxNqIdzlmM%2Fjx5jXZGuQAV0mqdRv9WujmG6Q7Vzv%2BGB8zPEeYYSivNO3WB1U5JI2MDYw0b6l4OtGb7o6h72rY1wU2Hh33Ph%2BMh6YC3ND%2Bd%2FQSFwlgHNzLjvIpntdwSr7cw%2BwiFuj%2F27ND2pO4IYTXjvajbLqf4yEk74D2lXaI2m3MfV0pkn71W0foZ7d6RNyZAzNGPl%2BDnV%2BU2%2BHpZkg40fPri7RwTRzbgibWSck6YbEUjGO1khS6lzgWThLNUo7jlmF8rFLRyeZUnIiiTVGDcsK5JGHEtCgI4F9Kr375XyC%2Bw3uXgD5kfX26FLTo7P7xe1DMkf1O5tBc1gysTRUv6f960mLKOcdJgUqEVAqhVnwp6hVcLv26hfT7dnL0T32D5Iko%2F2AlGtT7a%2BUzsbHz2SvstGbNr0jZRjeFkpwnmf9B4gnM28ABGbS4bGP1i9f8cRJb59zCvfwCp6rmF9QIAAA%3D%3D"
    
    const launchLink = `[启动](${defaultLaunchLink})`
    const fieldHtml = TaskFieldUtils.createFieldHtml(launchLink, 'subField')
    
    MNUtil.undoGrouping(() => {
      // 添加到末尾
      note.appendMarkdownComment(fieldHtml)
      const lastIndex = note.MNComments.length - 1
      
      // 移动到"信息"字段下（在"所属"字段后面，toBottom = true 表示放在字段最底部）
      this.moveCommentToField(note, lastIndex, '信息', true)
    })
  }

  /**
   * 添加启动字段
   * @param {MNNote} note - 要添加启动字段的笔记
   * @param {string} linkURL - 链接URL
   * @param {string} linkText - 链接文本
   */
  static addLaunchField(note, linkURL, linkText = "启动") {
    if (!note || !linkURL) return
    
    const launchLink = `[${linkText}](${linkURL})`
    const fieldHtml = TaskFieldUtils.createFieldHtml(launchLink, 'subField')
    
    MNUtil.undoGrouping(() => {
      // 添加到末尾
      note.appendMarkdownComment(fieldHtml)
      const lastIndex = note.MNComments.length - 1
      
      // 移动到"信息"字段下
      this.moveCommentToField(note, lastIndex, '信息', true)
    })
  }

  /**
   * 判断链接类型
   * @param {string} url - 要判断的URL
   * @returns {string} - 'note' | 'uistatus' | 'other'
   */
  static getLinkType(url) {
    if (!url) return 'other'
    
    if (url.includes('marginnote4app://note/')) {
      return 'note'
    } else if (url.includes('marginnote4app://uistatus/')) {
      return 'uistatus'
    } else {
      return 'other'
    }
  }

  /**
   * 添加或更新启动链接（带用户选择）
   * @param {MNNote} note - 要更新的笔记
   */
  static async addOrUpdateLaunchLink(note) {
    if (!note) return
    
    const apps = [
      { name: "Obsidian", scheme: "obsidian://open" },
      { name: "Notion", scheme: "notion://" },
      { name: "Things", scheme: "things:///" },
      { name: "OmniFocus", scheme: "omnifocus:///" },
      { name: "Bear", scheme: "bear://x-callback-url/open-note" },
      { name: "Craft", scheme: "craftdocs://" },
      { name: "Logseq", scheme: "logseq://" },
      { name: "RemNote", scheme: "remnote://" },
      { name: "Roam", scheme: "roam://" },
      { name: "默认启动", scheme: "marginnote4app://uistatus/H4sIAAAAAAAAE5VSy5LbIBD8F87SFuIp%2BWbJ5VxyyCG3VCqF0LBmg4VKoM06W%2F73AHbiveY2j56mp5l3NHr%2F8zxxtEOGgNbYMNNJGGmHJWAsmRg7wRQIojpDZQtEj5ibpm0apeRI5ahBcKEx4agqZGFxNqIdzlmM%2Fjx5jXZGuQAV0mqdRv9WujmG6Q7Vzv%2BGB8zPEeYYSivNO3WB1U5JI2MDYw0b6l4OtGb7o6h72rY1wU2Hh33Ph%2BMh6YC3ND%2Bd%2FQSFwlgHNzLjvIpntdwSr7cw%2BwiFuj%2F27ND2pO4IYTXjvajbLqf4yEk74D2lXaI2m3MfV0pkn71W0foZ7d6RNyZAzNGPl%2BDnV%2BU2%2BHpZkg40fPri7RwTRzbgibWSck6YbEUjGO1khS6lzgWThLNUo7jlmF8rFLRyeZUnIiiTVGDcsK5JGHEtCgI4F9Kr375XyC%2Bw3uXgD5kfX26FLTo7P7xe1DMkf1O5tBc1gysTRUv6f960mLKOcdJgUqEVAqhVnwp6hVcLv26hfT7dnL0T32D5Iko%2F2AlGtT7a%2BUzsbHz2SvstGbNr0jZRjeFkpwnmf9B4gnM28ABGbS4bGP1i9f8cRJb59zCvfwCp6rmF9QIAAA%3D%3D" }
    ]
    
    const selectedIndex = await MNUtil.userSelect("选择要启动的应用", "", apps.map(a => a.name))
    if (selectedIndex === 0) return // 用户取消
    
    const app = apps[selectedIndex - 1]
    const launchLink = `[${app.name}](${app.scheme})`
    const fieldHtml = TaskFieldUtils.createFieldHtml(launchLink, 'subField')
    
    MNUtil.undoGrouping(() => {
      // 检查是否已有"启动"字段
      const existingIndex = note.getIncludingCommentIndex("[启动]")
      
      if (existingIndex !== -1) {
        // 更新现有字段
        note.replaceWithMarkdownComment(fieldHtml, existingIndex)
        MNUtil.showHUD("✅ 已更新启动链接")
      } else {
        // 添加新字段
        note.appendMarkdownComment(fieldHtml)
        const lastIndex = note.MNComments.length - 1
        this.moveCommentToField(note, lastIndex, '信息', true)
        MNUtil.showHUD("✅ 已添加启动链接")
      }
    })
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
    
    MNUtil.log(`🔗 开始链接父任务：${parent.noteTitle}`)
    
    MNUtil.undoGrouping(() => {
      // 确保父任务有任务字段
      if (!this.hasTaskFields(parent)) {
        MNUtil.log("⚠️ 父任务缺少任务字段，先添加")
        this.addTaskFieldsWithStatus(parent)
      }
      
      // 1. 在父任务中创建到子任务的链接
      parent.appendNoteLink(note, "To")
      
      // 2. 获取父任务中刚创建的链接索引
      const linkIndexInParent = parent.MNComments.length - 1
      MNUtil.log(`📎 创建链接，索引：${linkIndexInParent}`)
      
      // 3. 获取子任务的状态
      const titleParts = this.parseTaskTitle(note.noteTitle)
      const status = titleParts.status || '未开始'
      MNUtil.log(`📊 子任务状态：${status}`)
      
      // 4. 将父任务中的链接移动到对应位置
      // 检查父任务类型，如果是"动作"类型，移动到"信息"字段下；否则移动到状态字段下
      const parentTitleParts = this.parseTaskTitle(parent.noteTitle)
      if (parentTitleParts.type === "动作") {
        MNUtil.log(`📋 父任务是动作类型，将链接移动到"信息"字段下`)
        this.moveCommentToField(parent, linkIndexInParent, "信息", true)
      } else {
        MNUtil.log(`📋 父任务是${parentTitleParts.type}类型，将链接移动到"${status}"字段下`)
        this.moveCommentToField(parent, linkIndexInParent, status, true)
      }
      
      // 5. 在子任务中更新所属字段（这已经包含了父任务的链接）
      // 构建所属字段内容
      const parentParts = this.parseTaskTitle(parent.noteTitle)
      const belongsToText = TaskFieldUtils.createBelongsToField(parentParts.content, parent.noteURL)
      
      // 检查是否已有所属字段
      const parsed = this.parseTaskComments(note)
      MNUtil.log("🔍 解析的任务字段：" + JSON.stringify(parsed.taskFields.map(f => ({content: f.content, index: f.index}))))
      MNUtil.log("🔍 是否已有所属字段：" + (parsed.belongsTo ? "是" : "否"))
      
      if (!parsed.belongsTo) {
        // 找到"信息"字段的位置
        let infoFieldIndex = -1
        for (let i = 0; i < parsed.taskFields.length; i++) {
          MNUtil.log(`🔍 检查字段 ${i}：` + parsed.taskFields[i].content)
          if (parsed.taskFields[i].content === '信息') {
            infoFieldIndex = parsed.taskFields[i].index
            MNUtil.log("✅ 找到信息字段，索引：" + infoFieldIndex)
            break
          }
        }
        
        MNUtil.log("📍 信息字段索引：" + infoFieldIndex)
        MNUtil.log("📝 评论总数（添加前）：" + note.MNComments.length)
        
        if (infoFieldIndex !== -1) {
          // 在"信息"字段后面插入所属字段
          MNUtil.log("➕ 尝试在索引 " + (infoFieldIndex + 1) + " 处插入所属字段")
          // 先添加到末尾
          note.appendMarkdownComment(belongsToText)
          // 获取刚添加的评论索引
          const lastIndex = note.MNComments.length - 1
          MNUtil.log("📝 评论总数（添加后）：" + note.MNComments.length)
          MNUtil.log("🔄 手动移动评论从 " + lastIndex + " 到 " + (infoFieldIndex + 1))
          // 手动移动到正确位置
          note.moveComment(lastIndex, infoFieldIndex + 1, false)
        } else {
          // 如果找不到信息字段，就添加到末尾
          MNUtil.log("⚠️ 未找到信息字段，添加到末尾")
          note.appendMarkdownComment(belongsToText)
        }
      } else {
        // 更新现有字段
        MNUtil.log("🔄 更新现有所属字段，索引：" + parsed.belongsTo.index)
        note.replaceWithMarkdownComment(belongsToText, parsed.belongsTo.index)
      }
      
      // 如果是动作类型，还需要检查并添加启动字段
      const childTitleParts = this.parseTaskTitle(note.noteTitle)
      if (childTitleParts.type === "动作" && !this.hasLaunchField(note)) {
        MNUtil.log("➕ 为动作类型添加默认启动字段")
        this.addDefaultLaunchField(note)
      }
      
      // 状态同步：建立关系后检查是否需要更新父任务状态
      const childStatus = childTitleParts.status || '未开始'
      
      // 如果子任务是"进行中"，父任务应该也是"进行中"（如果当前是"未开始"）
      if (childStatus === "进行中" && parentParts.status === "未开始") {
        MNUtil.log("🔄 子任务进行中，更新父任务状态")
        this.updateTaskStatus(parent, "进行中", true)  // 跳过父任务更新避免循环
        // 继续向上联动
        this.updateParentStatus(parent, "进行中")
      }
      // 如果父任务是"已完成"但新增了未完成的子任务，父任务应该变回"进行中"
      else if (parentParts.status === "已完成" && childStatus !== "已完成") {
        MNUtil.log("🔄 父任务已完成但新增未完成子任务，更新为进行中")
        this.updateTaskStatus(parent, "进行中", true)  // 跳过父任务更新避免循环
        // 继续向上联动
        this.updateParentStatus(parent, "进行中")
      }
      
      // 刷新父卡片以确保界面更新
      parent.refresh()
      MNUtil.log("✅ 父任务链接完成")
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
   * @param {boolean} skipParentUpdate - 是否跳过父任务更新（内部使用，避免循环）
   */
  static updateTaskStatus(note, newStatus, skipParentUpdate = false) {
    if (!this.isTaskCard(note)) return
    
    const titleParts = this.parseTaskTitle(note.noteTitle)
    const typeWithPath = titleParts.path ? 
      `${titleParts.type} >> ${titleParts.path}` : 
      titleParts.type
    
    const newTitle = `【${typeWithPath}｜${newStatus}】${titleParts.content}`
    
    // 设置对应的颜色
    let colorIndex = 12  // 默认白色
    switch (newStatus) {
      case "已完成":
        colorIndex = 1  // 绿色
        break
      case "进行中":
        colorIndex = 3  // 粉色
        break
      case "未开始":
        colorIndex = 12  // 白色
        break
      case "已归档":
        colorIndex = 13  // 灰色
        break
    }
    
    MNUtil.undoGrouping(() => {
      note.noteTitle = newTitle
      note.colorIndex = colorIndex
      
      // 如果有父任务，更新父任务中链接的位置
      const parent = note.parentNote
      if (parent && this.isTaskCard(parent)) {
        MNUtil.log(`🔄 更新父任务中的链接位置: ${parent.noteTitle}`)
        
        // 确保父任务有任务字段
        if (!this.hasTaskFields(parent)) {
          MNUtil.log("⚠️ 父任务缺少任务字段，先添加")
          this.addTaskFieldsWithStatus(parent)
        }
        
        // 解析父任务的评论，找到指向当前任务的链接
        const parsed = this.parseTaskComments(parent)
        
        // 查找指向当前任务的链接
        try {
          let linkFound = false
          for (let link of parsed.links) {
            if (link.linkedNoteId === note.noteId) {
              // 找到了链接，根据父任务类型决定移动位置
              const parentTitleParts = this.parseTaskTitle(parent.noteTitle)
              if (parentTitleParts.type === "动作") {
                MNUtil.log(`🔄 找到链接 at index ${link.index}，父任务是动作类型，保持在"信息"字段下`)
                // 动作类型不需要移动链接位置，因为它们都在"信息"字段下
              } else {
                MNUtil.log(`🔄 找到链接 at index ${link.index}，准备移动到 ${newStatus} 字段`)
                this.moveCommentToField(parent, link.index, newStatus, true)
              }
              linkFound = true
              break
            }
          }
          
          if (!linkFound) {
            MNUtil.log("⚠️ 未在父任务中找到指向当前任务的链接")
          }
          
          // 刷新父卡片
          parent.refresh()
        } catch (e) {
          MNUtil.log("❌ 更新父任务链接位置时出错: " + e.message)
          MNUtil.addErrorLog(e, "updateTaskStatus", {noteId: note.noteId, newStatus: newStatus})
        }
      }
      
      // 状态联动：更新父任务的状态（仅在非内部调用时执行）
      if (!skipParentUpdate) {
        this.updateParentStatus(note, newStatus)
      }
      
      // 检查是否有今日标签，如果有则同步更新今日看板
      if (note.tags && note.tags.includes("今日")) {
        MNUtil.log("🔄 检测到任务有今日标签，准备同步更新今日看板")
        
        // 延迟执行刷新，确保当前状态更新完成
        MNUtil.delay(0.5).then(() => {
          MNUtil.log("🔄 调用 refreshTodayBoard 方法刷新今日看板")
          MNTaskManager.refreshTodayBoard()
        })
      }
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

  /**
   * 更新任务卡片的链接关系
   * 当卡片从一个父卡片移动到另一个父卡片时，更新所有相关的链接
   * @param {MNNote} childNote - 已移动的子卡片
   */
  static updateTaskLinkRelationship(childNote) {
    if (!childNote || !this.isTaskCard(childNote)) return
    
    // 获取当前父卡片
    const currentParent = childNote.parentNote
    if (!currentParent || !this.isTaskCard(currentParent)) return
    
    // 解析子卡片的评论，查找"所属"字段
    const parsed = this.parseTaskComments(childNote)
    
    if (parsed.belongsTo) {
      try {
        // 从"所属"字段中提取旧父卡片的链接
        const belongsToText = parsed.belongsTo.text
        const linkMatch = belongsToText.match(/\[(.*?)\]\(marginnote[34]app:\/\/note\/([A-Z0-9-]+)\)/)
        
        if (linkMatch) {
          const oldParentId = linkMatch[2]
          
          // 如果旧父卡片ID与当前父卡片ID不同，说明已经移动
          if (oldParentId !== currentParent.noteId) {
            MNUtil.log(`🔄 检测到卡片移动：从 ${oldParentId} 到 ${currentParent.noteId}`)
            
            // 1. 删除旧父卡片中的链接
            const oldParent = MNNote.new(oldParentId, false)
            if (oldParent && this.isTaskCard(oldParent)) {
              const oldParentParsed = this.parseTaskComments(oldParent)
              
              // 查找并删除指向当前子卡片的链接
              for (let link of oldParentParsed.links) {
                if (link.linkedNoteId === childNote.noteId) {
                  MNUtil.log(`🗑️ 删除旧父卡片中的链接，索引：${link.index}`)
                  oldParent.removeCommentByIndex(link.index)
                  break
                }
              }
            }
            
            // 2. 在新父卡片中添加链接
            const childTitleParts = this.parseTaskTitle(childNote.noteTitle)
            const childStatus = childTitleParts.status || '未开始'
            
            // 检查新父卡片中是否已有链接
            const currentParentParsed = this.parseTaskComments(currentParent)
            let hasLink = false
            for (let link of currentParentParsed.links) {
              if (link.linkedNoteId === childNote.noteId) {
                hasLink = true
                break
              }
            }
            
            if (!hasLink) {
              MNUtil.log(`➕ 在新父卡片中添加链接`)
              currentParent.appendNoteLink(childNote, "To")
              const newLinkIndex = currentParent.MNComments.length - 1
              
              // 根据父任务类型决定移动位置
              const currentParentTitleParts = this.parseTaskTitle(currentParent.noteTitle)
              if (currentParentTitleParts.type === "动作") {
                MNUtil.log(`📋 新父任务是动作类型，将链接移动到"信息"字段下`)
                this.moveCommentToField(currentParent, newLinkIndex, "信息", true)
              } else {
                MNUtil.log(`📋 新父任务是${currentParentTitleParts.type}类型，将链接移动到"${childStatus}"字段下`)
                this.moveCommentToField(currentParent, newLinkIndex, childStatus, true)
              }
            }
            
            // 3. 更新子卡片的"所属"字段
            MNUtil.log(`🔄 更新子卡片的所属字段`)
            const belongsToComment = childNote.MNComments[parsed.belongsTo.index]
            const currentParentParts = this.parseTaskTitle(currentParent.noteTitle)
            const newBelongsToText = TaskFieldUtils.createBelongsToField(currentParentParts.content, currentParent.noteURL)
            
            // 使用 MNComment 的 text 属性直接修改
            belongsToComment.text = newBelongsToText
            MNUtil.log(`✅ 所属字段已更新`)
          } else {
            MNUtil.log(`ℹ️ 卡片未移动，无需更新链接关系`)
          }
        }
      } catch (e) {
        MNUtil.log(`❌ 更新链接关系时出错：${e.message}`)
        MNUtil.addErrorLog(e, "updateTaskLinkRelationship", {noteId: childNote.noteId})
      }
    } else if (currentParent && this.isTaskCard(currentParent)) {
      // 如果没有"所属"字段，说明是第一次建立链接关系
      MNUtil.log(`➕ 首次建立链接关系`)
      this.linkParentTask(childNote, currentParent)
    }
  }

  /**
   * 强制刷新卡片及其父卡片
   * @param {MNNote} note - 要刷新的卡片
   * @param {boolean} refreshParent - 是否刷新父卡片
   */
  static forceRefreshNote(note, refreshParent = false) {
    if (!note) return
    
    MNUtil.log("🔄 开始强制刷新卡片: " + note.noteId)
    
    try {
      // 方法1：直接调用 refresh
      note.refresh()
      
      // 方法2：通过修改一个临时属性触发刷新
      MNUtil.delay(0.1).then(() => {
        MNUtil.undoGrouping(() => {
          // 临时修改和恢复，触发界面更新
          const oldTitle = note.noteTitle
          note.noteTitle = oldTitle + " "
          note.noteTitle = oldTitle
        })
      })
      
      // 刷新父卡片
      if (refreshParent && note.parentNote && this.isTaskCard(note.parentNote)) {
        MNUtil.log("🔄 刷新父卡片: " + note.parentNote.noteId)
        const parent = note.parentNote
        
        // 延迟刷新父卡片
        MNUtil.delay(0.2).then(() => {
          parent.refresh()
          
          // 同样的触发机制
          MNUtil.delay(0.1).then(() => {
            MNUtil.undoGrouping(() => {
              const oldParentTitle = parent.noteTitle
              parent.noteTitle = oldParentTitle + " "
              parent.noteTitle = oldParentTitle
            })
          })
        })
      }
    } catch (e) {
      MNUtil.log("❌ 刷新卡片失败: " + e.message)
    }
  }

  /**
   * 清除失效的链接（目标卡片不存在的链接）
   * 参考 MNMath.cleanupBrokenLinks 的实现
   * 
   * @param {MNNote} note - 要清理的卡片
   * @returns {number} 清除的失效链接数量
   */
  static cleanupBrokenLinks(note) {
    if (!note || !note.comments) return 0
    
    let removedCount = 0
    const comments = note.comments
    
    MNUtil.log(`🔍 开始清理失效链接，总评论数: ${comments.length}`)
    
    // 从后往前遍历，避免删除时索引变化
    for (let i = comments.length - 1; i >= 0; i--) {
      const comment = comments[i]
      if (!comment) continue
      
      // 检查是否是纯文本形式的链接（MarginNote 中链接通常是 TextNote 类型）
      if (
        comment.type === "TextNote" &&
        comment.text && 
        (comment.text.startsWith('marginnote3app://note/') || 
         comment.text.startsWith('marginnote4app://note/'))
      ) {
        try {
          // 从文本中提取 noteId
          const match = comment.text.match(/marginnote[34]app:\/\/note\/([A-Z0-9-]+)/)
          if (match) {
            const targetNoteId = match[1]
            
            // 跳过概要链接
            if (targetNoteId.includes('/summary/')) {
              MNUtil.log(`⏭️ 跳过概要链接: ${targetNoteId}`)
              continue
            }
            
            // 检查目标笔记是否存在，不弹出警告
            const targetNote = MNNote.new(targetNoteId, false)
            if (!targetNote) {
              // 目标不存在，删除此链接
              note.removeCommentByIndex(i)
              removedCount++
              MNUtil.log(`🗑️ 删除失效链接: ${targetNoteId}`)
            } else {
              MNUtil.log(`✅ 链接有效: ${targetNoteId}`)
            }
          }
        } catch (e) {
          MNUtil.log(`⚠️ 处理链接 ${i} 时出错: ${e.message}`)
        }
      }
      // 检查 Markdown 格式的链接
      else if (
        comment.type === "TextNote" &&
        comment.text && 
        (comment.text.includes('](marginnote3app://note/') ||
         comment.text.includes('](marginnote4app://note/'))
      ) {
        try {
          // 匹配 Markdown 格式的链接
          const linkRegex = /\]\(marginnote[34]app:\/\/note\/([A-Z0-9-]+)\)/g
          let hasInvalidLink = false
          let invalidNoteId = null
          let match
          
          while ((match = linkRegex.exec(comment.text)) !== null) {
            const targetNoteId = match[1]
            
            // 跳过概要链接
            if (targetNoteId.includes('/summary/')) {
              continue
            }
            
            // 检查目标笔记是否存在
            const targetNote = MNNote.new(targetNoteId, false)
            if (!targetNote) {
              hasInvalidLink = true
              invalidNoteId = targetNoteId
              break
            }
          }
          
          // 如果发现失效链接，删除整个评论
          if (hasInvalidLink) {
            note.removeCommentByIndex(i)
            removedCount++
            MNUtil.log(`🗑️ 删除包含失效链接的 Markdown 文本: ${invalidNoteId}`)
          }
        } catch (e) {
          MNUtil.log(`⚠️ 处理 Markdown 链接 ${i} 时出错: ${e.message}`)
        }
      }
    }
    
    if (removedCount > 0) {
      MNUtil.showHUD(`✅ 已清除 ${removedCount} 个失效链接`)
    }
    
    MNUtil.log(`✅ 清理完成，共删除 ${removedCount} 个失效链接`)
    return removedCount
  }
  
  /**
   * 获取"信息"字段下的所有子字段
   * @param {MNNote} note - 要分析的卡片
   * @returns {Array<{index: number, fieldName: string, content: string, comment: MNComment}>} 子字段数组
   */
  static getSubFieldsUnderInfo(note) {
    if (!note || !note.MNComments) return []
    
    const parsed = this.parseTaskComments(note)
    const subFields = []
    
    // 找到"信息"主字段
    let infoFieldIndex = -1
    for (let field of parsed.taskFields) {
      if (field.isMainField && field.content === '信息') {
        infoFieldIndex = field.index
        break
      }
    }
    
    if (infoFieldIndex === -1) {
      MNUtil.log("❌ 未找到信息字段")
      return []
    }
    
    // 找到下一个主字段（"包含"）的位置
    let nextMainFieldIndex = note.MNComments.length
    for (let field of parsed.taskFields) {
      if (field.isMainField && field.index > infoFieldIndex) {
        nextMainFieldIndex = field.index
        break
      }
    }
    
    // 收集信息字段和下一个主字段之间的所有子字段
    for (let i = infoFieldIndex + 1; i < nextMainFieldIndex; i++) {
      const comment = note.MNComments[i]
      if (!comment) continue
      
      const text = comment.text || ''
      
      // 检查是否是任务字段（但不是主字段）
      if (TaskFieldUtils.isTaskField(text) && !text.includes('id="mainField"')) {
        const parsed = TaskFieldUtils.getFieldNameAndContent(text)
        
        // 记录日志便于调试
        MNUtil.log(`📋 找到子字段：${parsed.fieldName} at index ${i}`)
        
        subFields.push({
          index: i,
          fieldName: parsed.fieldName,
          content: parsed.content,
          comment: comment
        })
      }
    }
    
    return subFields
  }

  /**
   * 获取所有主字段及其位置信息
   * @param {MNNote} note - 要分析的卡片
   * @returns {Array<{index: number, fieldName: string, comment: MNComment}>} 主字段数组
   */
  static getMainFields(note) {
    if (!note || !note.MNComments) return []
    
    const parsed = this.parseTaskComments(note)
    const mainFields = []
    
    for (let field of parsed.taskFields) {
      if (field.isMainField) {
        mainFields.push({
          index: field.index,
          fieldName: field.content,
          comment: note.MNComments[field.index]
        })
      }
    }
    
    return mainFields
  }

  /**
   * 获取字段结构用于多选对话框
   * @param {MNNote} note - 要分析的卡片
   * @returns {Array<{display: string, index: number, type: string, fieldName: string}>} 可选项数组
   */
  static getFieldStructureForSelection(note) {
    if (!note || !note.MNComments) return []
    
    const parsed = this.parseTaskComments(note)
    const options = []
    
    // 找到信息字段的位置
    let infoFieldIndex = -1
    let nextMainFieldIndex = note.MNComments.length
    
    for (let field of parsed.taskFields) {
      if (field.isMainField && field.content === '信息') {
        infoFieldIndex = field.index
        // 找下一个主字段
        for (let nextField of parsed.taskFields) {
          if (nextField.isMainField && nextField.index > infoFieldIndex) {
            nextMainFieldIndex = nextField.index
            break
          }
        }
        break
      }
    }
    
    // 遍历所有评论，只显示信息字段下的内容
    note.MNComments.forEach((comment, index) => {
      if (!comment || index <= infoFieldIndex || index >= nextMainFieldIndex) return
      
      const text = comment.text || ''
      let display = ''
      
      // 检查是否是子字段
      if (TaskFieldUtils.isTaskField(text) && !text.includes('id="mainField"')) {
        const parsed = TaskFieldUtils.getFieldNameAndContent(text)
        display = `${parsed.fieldName}: ${parsed.content || '(空)'}`
        
        options.push({
          display: display,
          index: index,
          type: 'subField',
          fieldName: parsed.fieldName
        })
      } else {
        // 其他类型的评论
        if (comment.type === 'TextNote') {
          display = text ? text.substring(0, 50) : '(空文本)'
        } else if (comment.type === 'LinkNote') {
          display = '🔗 链接'
        } else if (comment.type === 'ImageNote') {
          display = '🖼️ 图片'
        } else if (comment.type === 'PaintNote') {
          display = '✏️ 手写'
        } else {
          display = comment.type
        }
        
        options.push({
          display: display,
          index: index,
          type: 'comment',
          fieldName: null
        })
      }
    })
    
    return options
  }

  /**
   * 显示字段内容多选对话框
   * @param {MNNote} note - 目标笔记
   * @param {Array} options - 可选项数组
   * @param {Set} selectedIndices - 已选中的索引集合
   * @param {Function} finalCallback - 最终回调函数
   */
  static showFieldContentMultiSelectDialog(note, options, selectedIndices, finalCallback) {
    // 构建显示选项
    const displayOptions = options.map(opt => {
      const isSelected = selectedIndices.has(opt.index)
      const prefix = isSelected ? '✅ ' : '⬜ '
      return prefix + opt.display
    })
    
    // 添加操作按钮
    const selectedCount = selectedIndices.size
    const actionButtons = [
      `✅ 全选 (共 ${options.length} 项)`,
      `❌ 取消全选`,
      selectedCount > 0 ? `➡️ 确定选择 (已选 ${selectedCount} 项)` : '➡️ 确定选择'
    ]
    
    const allOptions = [...displayOptions, '━━━━━━━━━━', ...actionButtons]
    
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "选择要管理的内容",
      "点击项目进行选择/取消选择",
      0,
      "取消",
      allOptions,
      (alert, buttonIndex) => {
        if (buttonIndex === 0) {
          finalCallback(null)
          return
        }
        
        const selectedIndex = buttonIndex - 1
        
        // 处理分隔线之后的操作按钮
        const separatorIndex = displayOptions.length
        if (selectedIndex === separatorIndex) {
          // 点击了分隔线，重新显示
          this.showFieldContentMultiSelectDialog(note, options, selectedIndices, finalCallback)
          return
        }
        
        if (selectedIndex > separatorIndex) {
          // 操作按钮
          const actionIndex = selectedIndex - separatorIndex - 1
          
          if (actionIndex === 0) {
            // 全选
            options.forEach(opt => {
              selectedIndices.add(opt.index)
            })
            this.showFieldContentMultiSelectDialog(note, options, selectedIndices, finalCallback)
          } else if (actionIndex === 1) {
            // 取消全选
            selectedIndices.clear()
            this.showFieldContentMultiSelectDialog(note, options, selectedIndices, finalCallback)
          } else if (actionIndex === 2) {
            // 确定选择
            if (selectedIndices.size === 0) {
              MNUtil.showHUD("请至少选择一项内容")
              this.showFieldContentMultiSelectDialog(note, options, selectedIndices, finalCallback)
            } else {
              finalCallback(Array.from(selectedIndices))
            }
          }
          return
        }
        
        // 处理内容选择
        const selectedOption = options[selectedIndex]
        // 切换选中状态
        if (selectedIndices.has(selectedOption.index)) {
          selectedIndices.delete(selectedOption.index)
        } else {
          selectedIndices.add(selectedOption.index)
        }
        // 递归调用以更新显示
        this.showFieldContentMultiSelectDialog(note, options, selectedIndices, finalCallback)
      }
    )
  }

  /**
   * 管理字段内容（移动/删除）
   * @param {MNNote} note - 目标笔记
   */
  static manageFieldContents(note) {
    if (!note) {
      MNUtil.showHUD("请先选择一个任务")
      return
    }
    
    // 获取字段结构
    const options = this.getFieldStructureForSelection(note)
    if (options.length === 0) {
      MNUtil.showHUD("当前笔记没有可管理的内容")
      return
    }
    
    // 初始化选中集合
    const selectedIndices = new Set()
    
    // 显示多选对话框
    this.showFieldContentMultiSelectDialog(note, options, selectedIndices, (indices) => {
      if (!indices || indices.length === 0) return
      
      // 显示操作选择对话框
      const actionOptions = [
        "➡️ 移动到其他位置",
        "🗑️ 删除选中内容"
      ]
      
      UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
        "选择操作类型",
        `已选择 ${indices.length} 项内容`,
        0,
        "取消",
        actionOptions,
        (alert, buttonIndex) => {
          if (buttonIndex === 0) return
          
          if (buttonIndex === 1) {
            // 移动操作
            this.showMoveTargetDialog(note, indices)
          } else if (buttonIndex === 2) {
            // 删除操作
            this.confirmAndDeleteComments(note, indices)
          }
        }
      )
    })
  }

  /**
   * 显示移动目标选择对话框
   * @param {MNNote} note - 目标笔记
   * @param {Array<number>} moveIndices - 要移动的索引数组
   */
  static showMoveTargetDialog(note, moveIndices) {
    // 获取信息字段下的所有内容作为移动目标
    const options = this.getFieldStructureForSelection(note)
    if (options.length === 0) {
      MNUtil.showHUD("没有找到可移动的位置")
      return
    }
    
    // 构建目标选项
    const targetOptions = ["信息字段最上方（紧挨着信息字段）"]
    
    // 添加字段选项
    options.forEach(opt => {
      if (opt.type === 'subField') {
        targetOptions.push(`在【${opt.fieldName}】前面`)
        targetOptions.push(`在【${opt.fieldName}】后面`)
      } else {
        targetOptions.push(`在【${opt.display}】前面`)
        targetOptions.push(`在【${opt.display}】后面`)
      }
    })
    
    targetOptions.push("信息字段最下方")
    
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "选择移动到的位置",
      `将移动 ${moveIndices.length} 项内容`,
      0,
      "取消",
      targetOptions,
      (alert, buttonIndex) => {
        if (buttonIndex === 0) return
        
        const selectedIndex = buttonIndex - 1
        
        MNUtil.undoGrouping(() => {
          try {
            // 排序索引（从大到小），避免移动时索引变化
            const sortedIndices = [...moveIndices].sort((a, b) => b - a)
            
            if (selectedIndex === 0) {
              // 移动到信息字段最上方
              sortedIndices.forEach(index => {
                this.moveCommentToField(note, index, '信息', false)
              })
            } else if (selectedIndex === targetOptions.length - 1) {
              // 移动到信息字段最下方
              sortedIndices.forEach(index => {
                this.moveCommentToField(note, index, '信息', true)
              })
            } else {
              // 移动到特定位置
              const optionIndex = Math.floor((selectedIndex - 1) / 2)
              const isAfter = (selectedIndex - 1) % 2 === 1
              const targetOption = options[optionIndex]
              
              if (targetOption) {
                // 计算目标位置
                let targetPosition = targetOption.index
                if (isAfter) {
                  targetPosition = targetOption.index + 1
                }
                
                sortedIndices.forEach(index => {
                  note.moveComment(index, targetPosition)
                  // 更新目标位置，因为每次移动后索引会变化
                  if (index < targetPosition) {
                    targetPosition--
                  }
                })
              }
            }
            
            MNUtil.showHUD(`✅ 成功移动 ${moveIndices.length} 项内容`)
          } catch (error) {
            MNUtil.showHUD("移动失败: " + error.message)
            MNUtil.addErrorLog(error, "showMoveTargetDialog")
          }
        })
      }
    )
  }

  /**
   * 确认并删除评论
   * @param {MNNote} note - 目标笔记
   * @param {Array<number>} deleteIndices - 要删除的索引数组
   */
  static confirmAndDeleteComments(note, deleteIndices) {
    const message = `确定要删除选中的 ${deleteIndices.length} 项内容吗？\n此操作不可恢复。`
    
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "确认删除",
      message,
      0,
      "取消",
      ["🗑️ 确认删除"],
      (alert, buttonIndex) => {
        if (buttonIndex === 1) {
          MNUtil.undoGrouping(() => {
            try {
              // 从大到小排序，避免删除时索引变化
              const sortedIndices = [...deleteIndices].sort((a, b) => b - a)
              
              sortedIndices.forEach(index => {
                note.removeCommentByIndex(index)
              })
              
              MNUtil.showHUD(`✅ 成功删除 ${deleteIndices.length} 项内容`)
            } catch (error) {
              MNUtil.showHUD("删除失败: " + error.message)
              MNUtil.addErrorLog(error, "confirmAndDeleteComments")
            }
          })
        }
      }
    )
  }
  
  /**
   * 获取所有子任务笔记
   * @param {MNNote} parentNote - 父任务笔记
   * @returns {Array<MNNote>} 子任务数组
   */
  static getChildTaskNotes(parentNote) {
    if (!parentNote || !parentNote.childNotes) return []
    
    const childTaskNotes = []
    
    // 遍历所有子笔记
    for (let childNote of parentNote.childNotes) {
      if (this.isTaskCard(childNote)) {
        childTaskNotes.push(childNote)
      }
    }
    
    MNUtil.log(`📋 获取到 ${childTaskNotes.length} 个子任务`)
    return childTaskNotes
  }
  
  /**
   * 判断父任务是否应该自动完成
   * @param {MNNote} parentNote - 父任务笔记
   * @returns {boolean} 是否应该自动完成
   */
  static shouldAutoComplete(parentNote) {
    if (!parentNote || !this.isTaskCard(parentNote)) return false
    
    // 获取所有子任务
    const childTasks = this.getChildTaskNotes(parentNote)
    
    // 如果没有子任务，不自动完成
    if (childTasks.length === 0) {
      MNUtil.log("📋 没有子任务，不自动完成")
      return false
    }
    
    // 检查所有子任务的状态
    for (let childTask of childTasks) {
      const titleParts = this.parseTaskTitle(childTask.noteTitle)
      if (titleParts.status !== "已完成") {
        MNUtil.log(`📋 发现未完成的子任务：${childTask.noteTitle}`)
        return false
      }
    }
    
    MNUtil.log("✅ 所有子任务已完成，可以自动完成父任务")
    return true
  }
  
  /**
   * 更新父任务状态（向上联动）
   * @param {MNNote} childNote - 子任务笔记
   * @param {string} childNewStatus - 子任务的新状态
   */
  static updateParentStatus(childNote, childNewStatus) {
    if (!childNote) return
    
    const parentNote = childNote.parentNote
    if (!parentNote || !this.isTaskCard(parentNote)) return
    
    const parentTitleParts = this.parseTaskTitle(parentNote.noteTitle)
    MNUtil.log(`🔄 检查是否需要更新父任务状态：${parentNote.noteTitle}`)
    
    // 规则1：如果子任务变为"进行中"，父任务也应该是"进行中"（除非已完成）
    if (childNewStatus === "进行中" && parentTitleParts.status === "未开始") {
      MNUtil.log(`📋 子任务进行中，更新父任务为进行中`)
      this.updateTaskStatus(parentNote, "进行中", true)  // 跳过父任务更新避免循环
      
      // 递归向上更新
      this.updateParentStatus(parentNote, "进行中")
    }
    // 规则2：如果子任务变为"已完成"，检查是否所有子任务都完成
    else if (childNewStatus === "已完成") {
      if (this.shouldAutoComplete(parentNote)) {
        MNUtil.log(`📋 所有子任务已完成，更新父任务为已完成`)
        this.updateTaskStatus(parentNote, "已完成", true)  // 跳过父任务更新避免循环
        
        // 递归向上检查
        this.updateParentStatus(parentNote, "已完成")
      }
    }
    // 规则3：如果子任务从"已完成"变为其他状态，父任务如果是"已完成"应该变回"进行中"
    else if (parentTitleParts.status === "已完成" && childNewStatus !== "已完成") {
      MNUtil.log(`📋 子任务未完成，更新父任务为进行中`)
      this.updateTaskStatus(parentNote, "进行中", true)  // 跳过父任务更新避免循环
      
      // 递归向上更新
      this.updateParentStatus(parentNote, "进行中")
    }
  }
  
  /**
   * 递归更新所有子孙卡片的路径和所属信息
   * @param {MNNote} parentNote - 父任务笔记
   * @param {Array<string>} processedIds - 已处理的笔记ID（避免循环）
   * @returns {number} 更新的卡片数量
   */
  static updateChildrenPathsRecursively(parentNote, processedIds = []) {
    if (!parentNote || !this.isTaskCard(parentNote)) {
      return 0
    }
    
    // 避免循环处理
    if (processedIds.includes(parentNote.noteId)) {
      MNUtil.log("⚠️ 检测到循环引用，跳过：" + parentNote.noteTitle)
      return 0
    }
    processedIds.push(parentNote.noteId)
    
    let updatedCount = 0
    const childNotes = parentNote.childNotes || []
    
    MNUtil.log(`🔄 开始更新 "${parentNote.noteTitle}" 的 ${childNotes.length} 个子卡片`)
    
    for (let childNote of childNotes) {
      try {
        // 只处理任务卡片
        if (!this.isTaskCard(childNote)) {
          MNUtil.log(`⏭️ 跳过非任务卡片：${childNote.noteTitle}`)
          continue
        }
        
        MNUtil.log(`📝 更新子卡片：${childNote.noteTitle}`)
        
        // 1. 更新路径信息
        this.updateTaskPath(childNote)
        
        // 2. 更新所属字段
        this.updateBelongsToField(childNote, parentNote)
        
        // 3. 如果是动作类型，检查并添加启动字段
        const childTitleParts = this.parseTaskTitle(childNote.noteTitle)
        if (childTitleParts.type === "动作" && !this.hasLaunchField(childNote)) {
          MNUtil.log("➕ 为动作类型添加默认启动字段")
          this.addDefaultLaunchField(childNote)
        }
        
        updatedCount++
        
        // 4. 递归更新子卡片的子卡片
        const subCount = this.updateChildrenPathsRecursively(childNote, processedIds)
        updatedCount += subCount
        
      } catch (error) {
        MNUtil.log(`❌ 更新子卡片失败：${error.message}`)
        MNUtil.addErrorLog(error, "updateChildrenPathsRecursively", {
          parentId: parentNote.noteId,
          childId: childNote?.noteId
        })
      }
    }
    
    return updatedCount
  }
  
  /**
   * 批量更新选中卡片及其子孙卡片的路径
   * @param {Array<MNNote>} selectedNotes - 选中的卡片数组
   */
  static batchUpdateChildrenPaths(selectedNotes) {
    if (!selectedNotes || selectedNotes.length === 0) {
      MNUtil.showHUD("请先选择要更新的任务卡片", 2)
      return
    }
    
    // 筛选出任务卡片
    const taskNotes = selectedNotes.filter(note => this.isTaskCard(note))
    if (taskNotes.length === 0) {
      MNUtil.showHUD("请选择任务卡片", 2)
      return
    }
    
    MNUtil.showHUD(`🔄 开始更新 ${taskNotes.length} 个任务的子卡片路径...`, 2)
    
    MNUtil.undoGrouping(() => {
      let totalUpdated = 0
      const processedIds = []
      
      for (let taskNote of taskNotes) {
        try {
          MNUtil.log(`\n🎯 处理任务：${taskNote.noteTitle}`)
          const count = this.updateChildrenPathsRecursively(taskNote, processedIds)
          totalUpdated += count
          MNUtil.log(`✅ 完成，更新了 ${count} 个子卡片`)
        } catch (error) {
          MNUtil.log(`❌ 处理任务失败：${error.message}`)
        }
      }
      
      if (totalUpdated > 0) {
        MNUtil.showHUD(`✅ 成功更新了 ${totalUpdated} 个子卡片的路径`, 3)
      } else {
        MNUtil.showHUD("没有需要更新的子卡片", 2)
      }
    })
  }
  
  /**
   * 标记/取消标记为今日任务
   * @param {MNNote} note - 要标记的任务卡片
   * @param {boolean} isToday - true 标记为今日，false 取消标记
   * @returns {boolean} 操作是否成功
   */
  static markAsToday(note, isToday = true) {
    if (!this.isTaskCard(note)) {
      MNUtil.showHUD("请选择一个任务卡片")
      return false
    }
    
    const parsed = this.parseTaskComments(note)
    
    // 查找是否已有今日标记
    let todayFieldIndex = -1
    // 查找是否有过期标记
    let overdueFieldIndex = -1
    
    for (let field of parsed.taskFields) {
      if (field.content.includes('📅 今日')) {
        todayFieldIndex = field.index
      } else if (field.content.includes('⚠️ 过期')) {
        overdueFieldIndex = field.index
      }
    }
    
    MNUtil.undoGrouping(() => {
      if (isToday && todayFieldIndex === -1) {
        // 如果要添加今日标记，先移除过期标记（如果有）
        if (overdueFieldIndex >= 0) {
          note.removeCommentByIndex(overdueFieldIndex)
          MNUtil.log("✅ 移除过期标记")
          // 移除后需要重新计算索引，因为删除操作会改变后续索引
          overdueFieldIndex = -1
        }
        
        // 添加今日标记（包含日期信息）
        const todayFieldHtml = TaskFieldUtils.createTodayField(true)
        note.appendMarkdownComment(todayFieldHtml)
        // 移动到信息字段下
        this.moveCommentToField(note, note.MNComments.length - 1, '信息', false)
        MNUtil.log("✅ 添加今日标记（含日期）")
      } else if (!isToday && todayFieldIndex >= 0) {
        // 移除今日标记
        note.removeCommentByIndex(todayFieldIndex)
        MNUtil.log("✅ 移除今日标记")
      } else if (isToday && todayFieldIndex >= 0) {
        // 如果已经有今日标记，检查是否需要更新日期
        const field = parsed.taskFields.find(f => f.index === todayFieldIndex)
        if (field) {
          const existingContent = field.content
          const dateMatch = existingContent.match(/\((\d{4}-\d{2}-\d{2})\)/)
          
          if (!dateMatch) {
            // 旧版标记没有日期，更新为新格式
            note.removeCommentByIndex(todayFieldIndex)
            const todayFieldHtml = TaskFieldUtils.createTodayField(true)
            note.appendMarkdownComment(todayFieldHtml)
            // 移动到信息字段下
            this.moveCommentToField(note, note.MNComments.length - 1, '信息', false)
            MNUtil.log("✅ 已更新今日标记格式（添加日期）")
          }
        }
      }
    })
    
    return true
  }
  
  /**
   * 检查任务是否标记为今日
   * @param {MNNote} note - 要检查的任务卡片
   * @returns {boolean} 是否为今日任务
   */
  static isToday(note) {
    if (!this.isTaskCard(note)) return false
    
    const comments = note.MNComments || []
    for (let comment of comments) {
      if (comment && comment.text) {
        const text = comment.text
        // 检查纯文本格式
        if (text.includes('📅 今日')) {
          return true
        }
        // 检查 HTML 格式（去除 HTML 标签后检查）
        const cleanText = text.replace(/<[^>]*>/g, '')
        if (cleanText.includes('📅 今日')) {
          return true
        }
      }
    }
    
    return false
  }
  
  /**
   * 获取今日任务的标记日期
   * @param {MNNote} note - 要检查的任务卡片
   * @returns {Date|null} 标记日期，如果没有找到则返回 null
   */
  static getTodayMarkDate(note) {
    if (!this.isTaskCard(note)) return null
    
    const comments = note.MNComments || []
    for (let comment of comments) {
      if (comment && comment.text) {
        const text = comment.text
        // 先去除 HTML 标签
        const cleanText = text.replace(/<[^>]*>/g, '')
        
        if (cleanText.includes('📅 今日')) {
          // 尝试提取日期信息 (YYYY-MM-DD)
          const dateMatch = cleanText.match(/\((\d{4})-(\d{2})-(\d{2})\)/)
          if (dateMatch) {
            const year = parseInt(dateMatch[1])
            const month = parseInt(dateMatch[2]) - 1 // JavaScript 月份从 0 开始
            const day = parseInt(dateMatch[3])
            return new Date(year, month, day)
          }
          // 如果没有日期信息，说明是旧版本的今日标记
          return null
        }
      }
    }
    
    return null
  }
  
  /**
   * 设置任务优先级
   * @param {MNNote} note - 要设置的任务卡片
   * @param {string} priority - 优先级（高/中/低）
   */
  static setTaskPriority(note, priority) {
    if (!this.isTaskCard(note)) {
      MNUtil.showHUD("请选择一个任务卡片")
      return
    }
    
    // 验证 priority 参数
    const validPriorities = ['高', '中', '低']
    if (!priority || !validPriorities.includes(priority)) {
      MNUtil.showHUD(`❌ 无效的优先级值: ${priority || 'undefined'}`)
      MNUtil.log(`❌ setTaskPriority 收到无效参数: ${priority}`)
      return
    }
    
    const parsed = this.parseTaskComments(note)
    
    // 查找现有的优先级字段
    let priorityFieldIndex = -1
    for (let field of parsed.taskFields) {
      if (field.content.includes('🔥 优先级:')) {
        priorityFieldIndex = field.index
        break
      }
    }
    
    MNUtil.undoGrouping(() => {
      // 移除旧的优先级字段
      if (priorityFieldIndex >= 0) {
        note.removeCommentByIndex(priorityFieldIndex)
      }
      
      // 添加新的优先级字段
      const priorityFieldHtml = TaskFieldUtils.createPriorityField(priority)
      note.appendMarkdownComment(priorityFieldHtml)
      // 移动到信息字段下
      this.moveCommentToField(note, note.MNComments.length - 1, '信息', false)
      MNUtil.log(`✅ 设置优先级为：${priority}`)
    })
  }
  
  /**
   * 设置任务计划时间
   * @param {MNNote} note - 要设置的任务卡片
   * @param {string} time - 计划时间（如 "09:00"）
   */
  static setTaskTime(note, time) {
    if (!this.isTaskCard(note)) {
      MNUtil.showHUD("请选择一个任务卡片")
      return
    }
    
    const parsed = this.parseTaskComments(note)
    
    // 查找现有的时间字段
    let timeFieldIndex = -1
    for (let field of parsed.taskFields) {
      if (field.content.includes('⏰ 计划时间:')) {
        timeFieldIndex = field.index
        break
      }
    }
    
    MNUtil.undoGrouping(() => {
      // 移除旧的时间字段
      if (timeFieldIndex >= 0) {
        note.removeCommentByIndex(timeFieldIndex)
      }
      
      // 添加新的时间字段
      const timeFieldHtml = TaskFieldUtils.createTimeField(time)
      note.appendMarkdownComment(timeFieldHtml)
      // 移动到信息字段下
      this.moveCommentToField(note, note.MNComments.length - 1, '信息', false)
      MNUtil.log(`✅ 设置计划时间为：${time}`)
    })
  }
  
  /**
   * 获取任务的优先级
   * @param {MNNote} note - 任务卡片
   * @returns {string|null} 优先级（高/中/低）或 null
   */
  static getTaskPriority(note) {
    if (!this.isTaskCard(note)) return null
    
    const comments = note.MNComments || []
    for (let comment of comments) {
      if (comment && comment.text && comment.text.includes('🔥 优先级:')) {
        if (comment.text.includes('🔴') || comment.text.includes('高')) return '高'
        if (comment.text.includes('🟡') || comment.text.includes('中')) return '中'
        if (comment.text.includes('🟢') || comment.text.includes('低')) return '低'
      }
    }
    
    return null
  }
  
  /**
   * 获取任务的计划时间
   * @param {MNNote} note - 任务卡片
   * @returns {string|null} 计划时间或 null
   */
  static getTaskTime(note) {
    if (!this.isTaskCard(note)) return null
    
    const comments = note.MNComments || []
    for (let comment of comments) {
      if (comment && comment.text && comment.text.includes('⏰ 计划时间:')) {
        const match = comment.text.match(/计划时间:\s*(\d{1,2}:\d{2})/)
        if (match) return match[1]
      }
    }
    
    return null
  }
  
  /**
   * 从整个笔记本中筛选今日任务（不限于看板）
   * @returns {MNNote[]} 今日任务列表
   */
  static filterAllTodayTasks() {
    if (typeof MNUtil !== 'undefined' && MNUtil.log) {
      MNUtil.log("🔍 从整个笔记本中搜索今日任务")
    }
    
    const results = []
    const processedIds = new Set()
    
    // 获取当前笔记本
    const currentNotebook = MNUtil.currentNotebook
    const currentNotebookId = MNUtil.currentNotebookId
    
    if (!currentNotebook || !currentNotebookId) {
      if (typeof MNUtil !== 'undefined' && MNUtil.log) {
        MNUtil.log("⚠️ 无法获取当前笔记本")
      }
      return results
    }
    
    // 递归搜索所有笔记
    const searchTasks = (notes) => {
      if (!notes || notes.length === 0) return
      
      for (let note of notes) {
        if (!note || processedIds.has(note.noteId)) continue
        processedIds.add(note.noteId)
        
        // 检查是否是今日任务
        if (MNTaskManager.isTaskCard(note) && this.isToday(note)) {
          const titleParts = MNTaskManager.parseTaskTitle(note.noteTitle)
          // 只添加未完成和进行中的任务
          if (titleParts.status === '未开始' || titleParts.status === '进行中') {
            results.push(note)
            if (typeof MNUtil !== 'undefined' && MNUtil.log) {
              MNUtil.log(`✅ 找到今日任务：${note.noteTitle}`)
            }
          }
        }
        
        // 递归搜索子笔记
        if (note.childNotes && note.childNotes.length > 0) {
          searchTasks(note.childNotes)
        }
      }
    }
    
    // 从笔记本的所有根笔记开始搜索
    // 使用 MNUtil.notesInStudySet 获取笔记本中的所有笔记
    try {
      const allNotes = MNUtil.notesInStudySet(currentNotebookId)
      if (typeof MNUtil !== 'undefined' && MNUtil.log) {
        MNUtil.log(`📊 笔记本中共有 ${allNotes.length} 个笔记`)
      }
      
      // 遍历所有笔记（因为 notesInStudySet 返回的是扁平化的数组）
      for (let note of allNotes) {
        if (!note || processedIds.has(note.noteId)) continue
        processedIds.add(note.noteId)
        
        // 将每个笔记转换为 MNNote 对象
        const mnNote = MNNote.new(note)
        if (!mnNote) continue
        
        // 检查是否是今日任务
        if (MNTaskManager.isTaskCard(mnNote) && this.isToday(mnNote)) {
          const titleParts = MNTaskManager.parseTaskTitle(mnNote.noteTitle)
          // 只添加未完成和进行中的任务
          if (titleParts.status === '未开始' || titleParts.status === '进行中') {
            results.push(mnNote)
            if (typeof MNUtil !== 'undefined' && MNUtil.log) {
              MNUtil.log(`✅ 找到今日任务：${mnNote.noteTitle}`)
            }
          }
        }
      }
    } catch (error) {
      if (typeof MNUtil !== 'undefined' && MNUtil.log) {
        MNUtil.log("❌ 搜索笔记时出错：" + error.message)
      }
    }
    
    if (typeof MNUtil !== 'undefined' && MNUtil.log) {
      MNUtil.log(`📊 共找到 ${results.length} 个今日任务`)
    }
    
    // 使用智能排序
    return TaskFilterEngine.sort(results, {
      strategy: 'smart',
      weights: {
        priority: 0.4,
        urgency: 0.3,
        importance: 0.2,
        progress: 0.1
      }
    })
  }
  
  /**
   * 从整个笔记本中按状态筛选任务
   * @param {string} status - 要筛选的状态
   * @returns {MNNote[]} 符合条件的任务列表
   */
  static filterAllTasksByStatus(status) {
    if (typeof MNUtil !== 'undefined' && MNUtil.log) {
      MNUtil.log(`🔍 从整个笔记本中搜索状态为"${status}"的任务`)
    }
    
    const results = []
    const processedIds = new Set()
    
    // 获取当前笔记本
    const currentNotebook = MNUtil.currentNotebook
    const currentNotebookId = MNUtil.currentNotebookId
    
    if (!currentNotebook || !currentNotebookId) {
      if (typeof MNUtil !== 'undefined' && MNUtil.log) {
        MNUtil.log("⚠️ 无法获取当前笔记本")
      }
      return results
    }
    
    try {
      const allNotes = MNUtil.notesInStudySet(currentNotebookId)
      if (typeof MNUtil !== 'undefined' && MNUtil.log) {
        MNUtil.log(`📊 笔记本中共有 ${allNotes.length} 个笔记`)
      }
      
      // 遍历所有笔记
      for (let note of allNotes) {
        if (!note || processedIds.has(note.noteId)) continue
        processedIds.add(note.noteId)
        
        // 将每个笔记转换为 MNNote 对象
        const mnNote = MNNote.new(note)
        if (!mnNote) continue
        
        // 检查是否是任务卡片且状态匹配
        if (MNTaskManager.isTaskCard(mnNote)) {
          const titleParts = MNTaskManager.parseTaskTitle(mnNote.noteTitle)
          if (titleParts.status === status) {
            results.push(mnNote)
            if (typeof MNUtil !== 'undefined' && MNUtil.log) {
              MNUtil.log(`✅ 找到${status}任务：${mnNote.noteTitle}`)
            }
          }
        }
      }
    } catch (error) {
      if (typeof MNUtil !== 'undefined' && MNUtil.log) {
        MNUtil.log("❌ 搜索笔记时出错：" + error.message)
      }
    }
    
    if (typeof MNUtil !== 'undefined' && MNUtil.log) {
      MNUtil.log(`📊 共找到 ${results.length} 个${status}任务`)
    }
    
    // 返回排序后的结果
    return TaskFilterEngine.sort(results, {
      strategy: 'smart',
      weights: {
        priority: 0.4,
        urgency: 0.3,
        importance: 0.2,
        progress: 0.1
      }
    })
  }
  
  /**
   * 筛选今日任务
   * @param {string[]|Object} boardKeys - 要筛选的看板或筛选配置
   * @returns {MNNote[]} 排序后的今日任务列表
   */
  static filterTodayTasks(boardKeys = ['target', 'project', 'action']) {
    // 支持传入配置对象
    let filterConfig = {}
    if (Array.isArray(boardKeys)) {
      filterConfig = {
        boardKeys: boardKeys,
        statuses: ['未开始', '进行中']
      }
    } else if (typeof boardKeys === 'object') {
      filterConfig = boardKeys
      // 设置默认值
      if (!filterConfig.boardKeys) {
        filterConfig.boardKeys = ['target', 'project', 'action']
      }
      if (!filterConfig.statuses) {
        filterConfig.statuses = ['未开始', '进行中']
      }
    }
    
    if (typeof MNUtil !== 'undefined' && MNUtil.log) {
      MNUtil.log("🔍 开始筛选今日任务，配置：" + JSON.stringify(filterConfig))
    }
    
    // 如果配置中包含 includeAll 参数，使用全局搜索
    if (filterConfig.includeAll) {
      return this.filterAllTodayTasks()
    }
    
    // 使用 TaskFilterEngine 筛选今日任务
    const todayTasks = TaskFilterEngine.filter({
      boardKeys: filterConfig.boardKeys,
      statuses: filterConfig.statuses,
      customFilter: (task) => {
        const isToday = this.isToday(task)
        if (typeof MNUtil !== 'undefined' && MNUtil.log && isToday) {
          MNUtil.log("✅ 发现今日任务：" + task.noteTitle)
        }
        return isToday
      }
    })
    
    // 使用智能排序
    return TaskFilterEngine.sort(todayTasks, {
      strategy: 'smart',
      weights: filterConfig.weights || {
        priority: 0.4,      // 优先级权重更高
        urgency: 0.3,       // 紧急度次之
        importance: 0.2,    // 重要性
        progress: 0.1       // 进度
      }
    })
  }
  
  /**
   * 排序今日任务
   * @param {MNNote[]} tasks - 今日任务列表
   * @returns {MNNote[]} 排序后的任务列表
   */
  static sortTodayTasks(tasks) {
    // 直接使用 TaskFilterEngine 的智能排序
    return TaskFilterEngine.sort(tasks, {
      strategy: 'smart',
      weights: {
        priority: 0.4,      // 优先级权重更高
        urgency: 0.3,       // 紧急度次之
        importance: 0.2,    // 重要性
        progress: 0.1       // 进度
      }
    })
  }
  
  /**
   * 移动任务到今日看板
   * @param {MNNote} note - 要移动的任务
   * @returns {boolean} 是否成功
   */
  static moveToTodayBoard(note) {
    if (!this.isTaskCard(note)) {
      MNUtil.showHUD("请选择一个任务卡片")
      return false
    }
    
    const todayBoardId = taskConfig.getBoardNoteId('today')
    if (!todayBoardId) {
      MNUtil.showHUD("请先配置今日看板")
      return false
    }
    
    const todayBoard = MNNote.new(todayBoardId)
    if (!todayBoard) {
      MNUtil.showHUD("无法找到今日看板")
      return false
    }
    
    // 先标记为今日任务
    this.markAsToday(note, true)
    
    // 移动到今日看板
    return this.moveTo(note, todayBoard)
  }
  
  /**
   * 检测并获取所有过期的今日任务
   * @param {string[]} boardKeys - 要检查的看板
   * @returns {Array<{task: MNNote, markDate: Date, overdueDays: number}>} 过期任务列表
   */
  static handleOverdueTodayTasks(boardKeys = ['target', 'project', 'action']) {
    // 获取所有今日任务
    const todayTasks = this.filterTodayTasks(boardKeys)
    const overdueTasks = []
    const today = new Date()
    today.setHours(0, 0, 0, 0) // 设置为今天的开始时间
    
    for (let task of todayTasks) {
      const markDate = this.getTodayMarkDate(task)
      if (markDate) {
        markDate.setHours(0, 0, 0, 0) // 设置为标记日期的开始时间
        
        // 计算过期天数
        const timeDiff = today - markDate
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
        
        if (daysDiff > 0) {
          overdueTasks.push({
            task: task,
            markDate: markDate,
            overdueDays: daysDiff
          })
        }
      } else {
        // 没有日期信息的旧版今日标记，也算作过期（假设为1天）
        overdueTasks.push({
          task: task,
          markDate: null,
          overdueDays: 1
        })
      }
    }
    
    return overdueTasks
  }
  
  /**
   * 修复旧版今日标记（添加日期信息）
   * @param {string[]} boardKeys - 要检查的看板
   * @returns {number} 修复的任务数量
   */
  static fixLegacyTodayMarks(boardKeys = ['target', 'project', 'action']) {
    const todayTasks = this.filterTodayTasks(boardKeys)
    let fixedCount = 0
    
    MNUtil.undoGrouping(() => {
      for (let task of todayTasks) {
        const markDate = this.getTodayMarkDate(task)
        if (!markDate) {
          // 旧版标记没有日期，重新标记
          this.markAsToday(task, false)  // 先移除
          this.markAsToday(task, true)   // 再添加（会自动加上日期）
          fixedCount++
          MNUtil.log(`✅ 修复旧版今日标记：${task.noteTitle}`)
        }
      }
    })
    
    if (fixedCount > 0) {
      MNUtil.showHUD(`✅ 已修复 ${fixedCount} 个旧版今日标记`)
    }
    
    return fixedCount
  }
  
  /**
   * 更新单个过期任务
   * @param {MNNote} task - 过期的任务
   * @param {string} action - 处理方式：'keep'(保持), 'overdue'(标记过期), 'remove'(移除), 'tomorrow'(推迟到明天)
   * @param {Date} markDate - 原始标记日期
   * @param {number} overdueDays - 过期天数
   */
  static updateOverdueTask(task, action, markDate, overdueDays) {
    if (!this.isTaskCard(task)) return
    
    const parsed = this.parseTaskComments(task)
    
    // 查找今日标记的索引
    let todayFieldIndex = -1
    for (let field of parsed.taskFields) {
      if (field.content.includes('📅 今日')) {
        todayFieldIndex = field.index
        break
      }
    }
    
    if (todayFieldIndex === -1) return
    
    MNUtil.undoGrouping(() => {
      switch (action) {
        case 'keep':
          // 保持不变，什么都不做
          MNUtil.log("保持今日标记不变")
          break
          
        case 'overdue':
          // 替换为过期标记
          task.removeCommentByIndex(todayFieldIndex)
          const overdueFieldHtml = TaskFieldUtils.createOverdueField(markDate || new Date(), overdueDays)
          task.appendMarkdownComment(overdueFieldHtml)
          this.moveCommentToField(task, task.MNComments.length - 1, '信息', false)
          MNUtil.log(`✅ 标记为过期 ${overdueDays} 天`)
          break
          
        case 'remove':
          // 移除今日标记
          task.removeCommentByIndex(todayFieldIndex)
          MNUtil.log("✅ 移除今日标记")
          break
          
        case 'tomorrow':
          // 更新为新的今日标记（明天就是新的今日）
          task.removeCommentByIndex(todayFieldIndex)
          const newTodayFieldHtml = TaskFieldUtils.createTodayField(true)
          task.appendMarkdownComment(newTodayFieldHtml)
          this.moveCommentToField(task, task.MNComments.length - 1, '信息', false)
          MNUtil.log("✅ 推迟到今天（更新日期）")
          break
      }
    })
  }
  
  /**
   * 添加任务记录
   * @param {MNNote} note - 任务卡片
   * @param {string} content - 记录内容
   * @param {number} progress - 进度百分比（可选）
   * @returns {boolean} 是否成功
   */
  static addTaskLog(note, content, progress) {
    if (!this.isTaskCard(note)) {
      MNUtil.showHUD("请选择一个任务卡片")
      return false
    }
    
    try {
      const parsed = this.parseTaskComments(note)
      
      // 查找任务记录字段
      let logFieldIndex = -1
      for (let field of parsed.taskFields) {
        if (field.content.includes('📝 任务记录')) {
          logFieldIndex = field.index
          break
        }
      }
      
      MNUtil.undoGrouping(() => {
        // 如果没有任务记录字段，先创建
        if (logFieldIndex === -1) {
          MNUtil.log("📝 创建任务记录字段")
          const logFieldHtml = TaskFieldUtils.createTaskLogField()
          note.appendMarkdownComment(logFieldHtml)
          // 移动到信息字段下方
          this.moveCommentToField(note, note.MNComments.length - 1, '信息', true)
        }
        
        // 添加新的记录条目
        MNUtil.log("📝 添加任务记录条目: " + content)
        const logEntry = TaskFieldUtils.createTaskLogEntry(content, progress)
        note.appendMarkdownComment(logEntry)
        
        // 将记录移动到任务记录字段下方
        this.moveCommentToField(note, note.MNComments.length - 1, '📝 任务记录', true)
        
        // 如果指定了进度，更新任务的总体进度
        if (progress !== undefined) {
          MNUtil.log("📊 更新任务进度: " + progress + "%")
          this.updateTaskProgress(note, progress)
        }
      })
      
      return true
    } catch (error) {
      MNUtil.log("❌ 添加任务记录失败: " + error.message)
      MNUtil.showHUD("添加任务记录失败：" + error.message)
      return false
    }
  }
  
  /**
   * 获取任务的所有记录
   * @param {MNNote} note - 任务卡片
   * @returns {Array<Object>} 任务记录数组
   */
  static getTaskLogs(note) {
    if (!this.isTaskCard(note)) return []
    
    const logs = []
    const comments = note.MNComments || []
    let inLogSection = false
    
    for (let i = 0; i < comments.length; i++) {
      const comment = comments[i]
      if (!comment) continue
      
      const text = comment.text || ''
      
      // 检查是否是任务记录字段
      if (TaskFieldUtils.isTaskField(text) && text.includes('📝 任务记录')) {
        inLogSection = true
        continue
      }
      
      // 检查是否遇到了其他主字段，结束记录收集
      if (inLogSection && TaskFieldUtils.isTaskField(text)) {
        break
      }
      
      // 如果在记录区域内，尝试解析记录
      if (inLogSection && text.startsWith('-')) {
        const logEntry = TaskFieldUtils.parseTaskLogEntry(text)
        if (logEntry) {
          logs.push({
            ...logEntry,
            index: i,
            comment: comment
          })
        }
      }
    }
    
    return logs
  }
  
  /**
   * 更新任务进度
   * @param {MNNote} note - 任务卡片
   * @param {number} progress - 进度百分比（0-100）
   */
  static updateTaskProgress(note, progress) {
    if (!this.isTaskCard(note) || progress < 0 || progress > 100) return
    
    const parsed = this.parseTaskComments(note)
    
    // 查找现有的进度字段
    let progressFieldIndex = -1
    for (let field of parsed.taskFields) {
      if (field.content.includes('📊 进度:')) {
        progressFieldIndex = field.index
        break
      }
    }
    
    MNUtil.undoGrouping(() => {
      // 移除旧的进度字段
      if (progressFieldIndex >= 0) {
        note.removeCommentByIndex(progressFieldIndex)
      }
      
      // 添加新的进度字段
      const progressFieldHtml = TaskFieldUtils.createFieldHtml(`📊 进度: ${progress}%`, 'subField')
      note.appendMarkdownComment(progressFieldHtml)
      // 移动到信息字段下
      this.moveCommentToField(note, note.MNComments.length - 1, '信息', false)
      
      // 如果进度达到100%，可以考虑自动更新状态
      if (progress === 100 && this.parseTaskTitle(note.noteTitle).status !== '已完成') {
        // 可选：自动将任务标记为已完成
        // this.updateTaskStatus(note, '已完成')
      }
    })
  }
  
  /**
   * 获取任务的最新进度
   * @param {MNNote} note - 任务卡片
   * @returns {number|null} 最新进度百分比，如果没有则返回 null
   */
  static getLatestProgress(note) {
    if (!this.isTaskCard(note)) return null
    
    // 首先检查进度字段
    const comments = note.MNComments || []
    for (let comment of comments) {
      if (comment && comment.text && comment.text.includes('📊 进度:')) {
        const match = comment.text.match(/进度:\s*(\d+)%/)
        if (match) return parseInt(match[1])
      }
    }
    
    // 如果没有进度字段，检查最新的任务记录
    const logs = this.getTaskLogs(note)
    if (logs.length > 0) {
      // 返回最后一条有进度的记录
      for (let i = logs.length - 1; i >= 0; i--) {
        if (logs[i].progress !== null) {
          return logs[i].progress
        }
      }
    }
    
    return null
  }
  
  /**
   * 批量操作基础方法
   * @param {MNNote[]} notes - 要操作的笔记列表
   * @param {Function} operation - 对每个任务执行的操作
   * @param {string} operationName - 操作名称（用于显示）
   * @param {boolean} requireConfirm - 是否需要确认
   * @returns {Object} 操作结果
   */
  static async batchOperation(notes, operation, operationName, requireConfirm = false) {
    if (!notes || notes.length === 0) {
      MNUtil.showHUD("请先选择要操作的笔记")
      return { success: 0, failed: 0, errors: [] }
    }
    
    // 筛选有效的任务卡片
    const taskNotes = notes.filter(note => this.isTaskCard(note))
    if (taskNotes.length === 0) {
      MNUtil.showHUD("未找到有效的任务卡片")
      return { success: 0, failed: 0, errors: [] }
    }
    
    // 确认操作
    if (requireConfirm) {
      const confirm = await MNUtil.userConfirm(
        `确认${operationName}`,
        `即将对 ${taskNotes.length} 个任务执行${operationName}操作，是否继续？`
      )
      if (!confirm) {
        MNUtil.showHUD("操作已取消")
        return { success: 0, failed: 0, errors: [] }
      }
    }
    
    // 执行批量操作
    const results = { success: 0, failed: 0, errors: [] }
    
    MNUtil.undoGrouping(() => {
      for (let task of taskNotes) {
        try {
          operation(task)
          results.success++
        } catch (error) {
          results.failed++
          results.errors.push({
            task: task.noteTitle,
            error: error.message
          })
        }
      }
    })
    
    // 显示结果
    const message = `${operationName}完成：成功 ${results.success} 个${results.failed > 0 ? `，失败 ${results.failed} 个` : ''}`
    MNUtil.showHUD(message)
    
    return results
  }
  
  /**
   * 批量更新任务状态
   * @param {MNNote[]} notes - 要更新的任务列表
   * @param {string} newStatus - 新状态
   * @returns {Object} 操作结果
   */
  static async batchUpdateStatus(notes, newStatus) {
    return this.batchOperation(
      notes,
      (task) => this.updateTaskStatus(task, newStatus),
      `更新状态为"${newStatus}"`,
      true
    )
  }
  
  /**
   * 批量设置优先级
   * @param {MNNote[]} notes - 要设置的任务列表
   * @param {string} priority - 优先级（高/中/低）
   * @returns {Object} 操作结果
   */
  static async batchSetPriority(notes, priority) {
    return this.batchOperation(
      notes,
      (task) => this.setTaskPriority(task, priority),
      `设置优先级为"${priority}"`,
      false
    )
  }
  
  /**
   * 批量标记为今日任务
   * @param {MNNote[]} notes - 要标记的任务列表
   */
  static batchMarkAsToday(notes) {
    if (!notes || notes.length === 0) {
      MNUtil.showHUD("请先选择要标记的任务")
      return
    }
    
    const taskNotes = notes.filter(note => this.isTaskCard(note))
    if (taskNotes.length === 0) {
      MNUtil.showHUD("请选择任务卡片")
      return
    }
    
    MNUtil.undoGrouping(() => {
      let count = 0
      for (let note of taskNotes) {
        if (this.markAsToday(note, true)) {
          count++
        }
      }
      MNUtil.showHUD(`✅ 已将 ${count} 个任务标记为今日任务`)
    })
  }
  
  /**
   * 批量移动到指定看板
   * @param {MNNote[]} notes - 要移动的任务列表
   * @param {string} boardKey - 目标看板键名
   * @returns {Object} 操作结果
   */
  static async batchMoveToBoard(notes, boardKey) {
    const boardNoteId = taskConfig.getBoardNoteId(boardKey)
    if (!boardNoteId) {
      MNUtil.showHUD(`请先配置${boardKey}看板`)
      return { success: 0, failed: 0, errors: [] }
    }
    
    const boardNote = MNNote.new(boardNoteId)
    if (!boardNote) {
      MNUtil.showHUD(`无法找到${boardKey}看板`)
      return { success: 0, failed: 0, errors: [] }
    }
    
    return this.batchOperation(
      notes,
      (task) => this.moveTo(task, boardNote),
      `移动到${boardKey}看板`,
      true
    )
  }
  
  /**
   * 批量添加标签
   * @param {MNNote[]} notes - 要添加标签的任务列表
   * @param {string} tag - 标签名称
   * @returns {Object} 操作结果
   */
  static async batchAddTag(notes, tag) {
    return this.batchOperation(
      notes,
      (task) => {
        if (!task.tags) task.tags = []
        if (!task.tags.includes(tag)) {
          task.tags.push(tag)
        }
      },
      `添加标签"${tag}"`,
      false
    )
  }
  
  /**
   * 批量设置截止日期
   * @param {MNNote[]} notes - 要设置的任务列表
   * @param {Date} date - 截止日期
   * @returns {Object} 操作结果
   */
  static async batchSetDueDate(notes, date) {
    const dateStr = date.toISOString().split('T')[0]  // YYYY-MM-DD 格式
    
    return this.batchOperation(
      notes,
      (task) => {
        const parsed = this.parseTaskComments(task)
        const dueDateText = `📅 截止日期: ${dateStr}`
        
        // 检查是否已有截止日期字段
        let hasDueDate = false
        if (parsed.comments) {
          for (let i = 0; i < parsed.comments.length; i++) {
            if (parsed.comments[i].text && parsed.comments[i].text.includes('📅 截止日期:')) {
              task.replaceWithMarkdownComment(dueDateText, i)
              hasDueDate = true
              break
            }
          }
        }
        
        // 如果没有，添加到信息字段下
        if (!hasDueDate) {
          if (parsed.fields['信息']) {
            const infoIndex = parsed.fields['信息'].index
            task.insertCommentAtIndex(dueDateText, infoIndex + 1)
          } else {
            task.appendMarkdownComment(dueDateText)
          }
        }
      },
      `设置截止日期为 ${dateStr}`,
      false
    )
  }
  
  /**
   * 批量归档已完成任务
   * @param {MNNote[]} notes - 要归档的任务列表
   * @returns {Object} 操作结果
   */
  static async batchArchiveCompleted(notes) {
    // 筛选已完成的任务
    const completedTasks = notes.filter(note => {
      if (!this.isTaskCard(note)) return false
      const titleParts = this.parseTaskTitle(note.noteTitle)
      return titleParts.status === '已完成'
    })
    
    if (completedTasks.length === 0) {
      MNUtil.showHUD("没有找到已完成的任务")
      return { success: 0, failed: 0, errors: [] }
    }
    
    return this.batchOperation(
      completedTasks,
      (task) => this.updateTaskStatus(task, '已归档'),
      `归档已完成任务`,
      true
    )
  }
  
  /**
   * 批量删除任务链接关系
   * @param {MNNote[]} notes - 要删除链接的任务列表
   * @returns {Object} 操作结果
   */
  static async batchUnlinkFromParent(notes) {
    return this.batchOperation(
      notes,
      (task) => {
        const parsed = this.parseTaskComments(task)
        if (parsed.belongsTo) {
          task.removeCommentByIndex(parsed.belongsTo.index)
        }
      },
      `解除父任务链接`,
      true
    )
  }
  
  /**
   * 批量执行自定义操作
   * @param {MNNote[]} notes - 要操作的任务列表
   * @param {Object} options - 操作选项
   * @returns {Object} 操作结果
   */
  static async batchCustomOperation(notes, options) {
    const {
      name = "自定义操作",
      operation,
      requireConfirm = false,
      validate = () => true
    } = options
    
    // 验证操作
    if (!operation || typeof operation !== 'function') {
      MNUtil.showHUD("无效的操作函数")
      return { success: 0, failed: 0, errors: [] }
    }
    
    // 筛选符合条件的任务
    const validTasks = notes.filter(note => {
      return this.isTaskCard(note) && validate(note)
    })
    
    if (validTasks.length === 0) {
      MNUtil.showHUD("没有符合条件的任务")
      return { success: 0, failed: 0, errors: [] }
    }
    
    return this.batchOperation(validTasks, operation, name, requireConfirm)
  }
  
  /**
   * 清理看板中的任务链接
   * @param {MNNote} boardNote - 看板卡片
   */
  static clearTaskLinksFromBoard(boardNote) {
    if (!boardNote || !boardNote.MNComments) return
    
    const comments = boardNote.MNComments || []
    // 从后往前删除，避免索引变化
    for (let i = comments.length - 1; i >= 0; i--) {
      const comment = comments[i]
      if (!comment || !comment.text) continue
      
      const text = comment.text
      
      // 识别需要清理的内容
      const shouldRemove = (
        // 任务链接（包含任务类型标记）
        text.includes('【目标') || 
        text.includes('【关键结果') ||
        text.includes('【项目') || 
        text.includes('【动作') ||
        // 分组标题
        text.includes('## 🔴') ||
        text.includes('## 🔥') ||
        text.includes('## 😴') ||
        text.includes('## ✅') ||
        text.includes('## 💡') ||
        // 过期任务提醒相关
        text.includes('## ⚠️ 过期任务提醒') ||
        text.includes('个过期任务：') ||
        text.includes('- ⚠️ **过期') ||
        text.includes('💡 点击「今日任务」→「处理过期任务」') ||
        // 统计信息条目
        text.startsWith('- 总任务数：') ||
        text.startsWith('- 进行中：') ||
        text.startsWith('- 未开始：') ||
        text.startsWith('- 已完成：') ||
        text.startsWith('- 高优先级：') ||
        text.startsWith('- 完成进度：') ||
        // 提示信息
        text.startsWith('- 使用「今日任务」') ||
        text.startsWith('- 或从任务菜单') ||
        // 任务链接列表项（包含优先级图标和链接）
        (text.startsWith('- ') && (
          text.includes('](marginnote4app://note/') ||
          text.includes('🔴') ||
          text.includes('🟡') ||
          text.includes('🟢') ||
          text.includes('✓')
        ))
      )
      
      if (shouldRemove) {
        boardNote.removeCommentByIndex(i)
      }
    }
  }
  
  /**
   * 分组今日任务
   * @param {MNNote[]} tasks - 今日任务列表
   * @param {Array} overdueTasks - 过期任务数组（包含task和overdueDays信息）
   * @returns {Object} 分组后的任务
   */
  static groupTodayTasks(tasks, overdueTasks = []) {
    const grouped = {
      overdue: [],      // 新增过期任务分组
      highPriority: [],
      inProgress: [],
      notStarted: [],
      completed: []
    }
    
    // 先处理过期任务
    if (overdueTasks.length > 0) {
      overdueTasks.forEach(({ task, overdueDays }) => {
        // 为过期任务添加过期天数信息
        task._overdueDays = overdueDays
        grouped.overdue.push(task)
      })
    }
    
    tasks.forEach(task => {
      // 如果任务已经在过期组中，跳过
      if (grouped.overdue.some(t => t.noteId === task.noteId)) {
        return
      }
      
      const parts = this.parseTaskTitle(task.noteTitle)
      const priority = this.getTaskPriority(task)
      
      // 按状态分组
      switch (parts.status) {
        case '进行中':
          grouped.inProgress.push(task)
          break
        case '未开始':
          // 高优先级未开始的单独分组
          if (priority === '高') {
            grouped.highPriority.push(task)
          } else {
            grouped.notStarted.push(task)
          }
          break
        case '已完成':
          grouped.completed.push(task)
          break
      }
    })
    
    // 对每组按优先级和时间排序
    Object.keys(grouped).forEach(key => {
      grouped[key] = this.sortTodayTasks(grouped[key])
    })
    
    return grouped
  }
  
  /**
   * 添加任务链接到看板
   * @param {MNNote} boardNote - 看板卡片
   * @param {Object} grouped - 分组后的任务
   */
  static addTaskLinksToBoard(boardNote, grouped) {
    // 高优先级任务
    if (grouped.highPriority.length > 0) {
      boardNote.appendMarkdownComment("## 🔴 高优先级")
      grouped.highPriority.forEach(task => {
        const link = this.createTaskLink(task)
        boardNote.appendMarkdownComment(link)
      })
    }
    
    // 进行中任务
    if (grouped.inProgress.length > 0) {
      boardNote.appendMarkdownComment("## 🔥 进行中")
      grouped.inProgress.forEach(task => {
        const link = this.createTaskLink(task)
        boardNote.appendMarkdownComment(link)
      })
    }
    
    // 未开始任务
    if (grouped.notStarted.length > 0) {
      boardNote.appendMarkdownComment("## 😴 未开始")
      grouped.notStarted.forEach(task => {
        const link = this.createTaskLink(task)
        boardNote.appendMarkdownComment(link)
      })
    }
    
    // 已完成任务（可选显示）
    if (grouped.completed.length > 0) {
      boardNote.appendMarkdownComment("## ✅ 已完成")
      grouped.completed.forEach(task => {
        const link = this.createTaskLink(task)
        boardNote.appendMarkdownComment(link)
      })
    }
  }
  
  /**
   * 创建任务链接
   * @param {MNNote} task - 任务卡片
   * @returns {string} Markdown 格式的任务链接
   */
  static createTaskLink(task) {
    const parts = this.parseTaskTitle(task.noteTitle)
    const priority = this.getTaskPriority(task)
    const time = this.getTaskTime(task)
    
    // 构建显示文本
    let displayText = parts.content
    
    // 添加时间前缀
    if (time) {
      displayText = `${time} ${displayText}`
    }
    
    // 检查是否是过期任务并添加过期天数
    if (task._overdueDays) {
      const daysText = task._overdueDays === 1 ? "1天" : `${task._overdueDays}天`
      displayText = `${displayText} (过期${daysText})`
    }
    
    // 添加任务类型图标
    let typeIcon = ''
    switch (parts.type) {
      case '目标':
        typeIcon = '🎯 '
        break
      case '关键结果':
        typeIcon = '📊 '
        break
      case '项目':
        typeIcon = '📁 '
        break
      case '动作':
        typeIcon = '▶️ '
        break
    }
    
    // 添加优先级标记（过期任务使用特殊标记）
    let priorityIcon = ''
    if (task._overdueDays) {
      priorityIcon = '⚠️ '  // 过期任务统一使用警告图标
    } else if (priority === '高') {
      priorityIcon = '🔴 '
    } else if (priority === '中') {
      priorityIcon = '🟡 '
    } else if (priority === '低') {
      priorityIcon = '🟢 '
    }
    
    // 添加状态标记（如果是已完成）
    let statusIcon = ''
    if (parts.status === '已完成') statusIcon = '✓ '
    
    // 创建 Markdown 链接（任务类型在最前面，便于识别）
    const url = `marginnote4app://note/${task.noteId}`
    return `- ${typeIcon}${priorityIcon}${statusIcon}[${displayText}](${url})`
  }
  
  /**
   * 刷新今日看板
   * @returns {boolean} 是否刷新成功
   */
  static refreshTodayBoard() {
    MNUtil.log("🔄 MNTaskManager.refreshTodayBoard() 被调用")
    
    const todayBoardId = taskConfig.getBoardNoteId('today')
    
    if (!todayBoardId) {
      MNUtil.showHUD("❌ 请先在设置中绑定今日看板\n设置 → Task Boards → 今日看板")
      return false
    }
    
    const todayBoard = MNNote.new(todayBoardId)
    
    if (!todayBoard) {
      MNUtil.showHUD("❌ 无法找到今日看板卡片\n请重新设置或检查卡片是否存在")
      return false
    }
    
    MNUtil.showHUD("🔄 正在刷新今日看板...")
    
    let success = false
    MNUtil.undoGrouping(() => {
      try {
        // 获取今日任务
        let todayTasks = this.filterTodayTasks()
        
        // 如果从看板中没有找到，尝试从整个笔记本搜索
        if (todayTasks.length === 0) {
          todayTasks = this.filterAllTodayTasks()
        }
        
        // 清理现有的任务链接（保留其他内容）
        this.clearTaskLinksFromBoard(todayBoard)
        
        // 更新看板标题
        const now = new Date()
        const dateStr = `${now.getMonth() + 1}月${now.getDate()}日`
        todayBoard.noteTitle = `📅 今日看板 - ${dateStr}`
        
        // 如果没有今日任务，添加提示
        if (todayTasks.length === 0) {
          todayBoard.appendMarkdownComment("## 💡 暂无今日任务")
          todayBoard.appendMarkdownComment("- 使用「今日任务」按钮标记任务")
          todayBoard.appendMarkdownComment("- 或从任务菜单中选择「标记为今日」")
          MNUtil.showHUD("📅 暂无今日任务")
          success = true
          return
        }
        
        // 按优先级和状态分组
        const grouped = this.groupTodayTasks(todayTasks)
        
        // 添加任务链接到看板
        this.addTaskLinksToBoard(todayBoard, grouped)
        
        // 刷新看板显示
        todayBoard.refresh()
        
        // 显示完成提示
        const inProgressCount = grouped.inProgress.length
        const highPriorityCount = grouped.highPriority.length
        let hudMessage = `✅ 刷新完成\n📋 今日任务：${todayTasks.length} 个`
        if (inProgressCount > 0) {
          hudMessage += `\n🔥 进行中：${inProgressCount} 个`
        }
        if (highPriorityCount > 0) {
          hudMessage += `\n🔴 高优先级：${highPriorityCount} 个`
        }
        MNUtil.showHUD(hudMessage)
        success = true
      } catch (error) {
        MNUtil.log(`❌ refreshTodayBoard 出错: ${error.message || error}`)
        MNUtil.showHUD("❌ 刷新失败：" + error.message)
      }
    })
    
    return success
  }
  
  /**
   * 更新看板统计信息
   * @param {MNNote} boardNote - 看板卡片
   * @param {MNNote[]} tasks - 任务列表
   */
  static updateBoardStatistics(boardNote, tasks) {
    // 统计各状态任务数
    const stats = {
      total: tasks.length,
      notStarted: 0,
      inProgress: 0,
      completed: 0,
      highPriority: 0
    }
    
    tasks.forEach(task => {
      const parts = this.parseTaskTitle(task.noteTitle)
      const priority = this.getTaskPriority(task)
      
      switch (parts.status) {
        case '未开始':
          stats.notStarted++
          break
        case '进行中':
          stats.inProgress++
          break
        case '已完成':
          stats.completed++
          break
      }
      
      if (priority === '高') {
        stats.highPriority++
      }
    })
    
    // 添加统计信息
    boardNote.appendMarkdownComment("## 📊 统计信息")
    boardNote.appendMarkdownComment(`- 总任务数：${stats.total}`)
    boardNote.appendMarkdownComment(`- 进行中：${stats.inProgress}`)
    boardNote.appendMarkdownComment(`- 未开始：${stats.notStarted}`)
    boardNote.appendMarkdownComment(`- 已完成：${stats.completed}`)
    if (stats.highPriority > 0) {
      boardNote.appendMarkdownComment(`- 高优先级：${stats.highPriority}`)
    }
    
    // 添加进度条
    const progressPercent = stats.total > 0 
      ? Math.round(stats.completed / stats.total * 100) 
      : 0
    boardNote.appendMarkdownComment(`- 完成进度：${progressPercent}%`)
  }

  /**
   * 获取看板中的所有任务卡片
   * @param {MNNote} boardNote - 看板笔记
   * @returns {MNNote[]} 任务卡片数组
   */
  static getAllTaskCardsFromBoard(boardNote) {
    if (!boardNote) return []
    
    const results = []
    const processedIds = new Set()
    
    // 递归收集所有任务卡片
    const collectTasks = (parentNote) => {
      if (!parentNote || !parentNote.childNotes) return
      
      for (let childNote of parentNote.childNotes) {
        // 避免重复处理
        if (processedIds.has(childNote.noteId)) continue
        processedIds.add(childNote.noteId)
        
        // 只收集任务卡片
        if (this.isTaskCard(childNote)) {
          results.push(childNote)
        }
        
        // 递归处理子卡片
        collectTasks(childNote)
      }
    }
    
    collectTasks(boardNote)
    return results
  }

  /**
   * 获取笔记的状态
   * @param {MNNote} note - 笔记对象
   * @returns {string} 状态字符串（'未开始'/'进行中'/'已完成'/'已归档'）
   */
  static getNoteStatus(note) {
    if (!this.isTaskCard(note)) return null
    
    const titleParts = this.parseTaskTitle(note.noteTitle)
    return titleParts.status || '未开始'
  }

  /**
   * 获取今日看板
   * @returns {MNNote|null} 今日看板笔记对象
   */
  static getTodayBoard() {
    const todayBoardId = taskConfig.getBoardNoteId('today')
    if (!todayBoardId) {
      MNUtil.log('❌ 未配置今日看板')
      return null
    }
    
    const todayBoard = MNNote.new(todayBoardId)
    if (!todayBoard) {
      MNUtil.log('❌ 无法找到今日看板')
      return null
    }
    
    return todayBoard
  }

  /**
   * 获取链接类型
   * @param {string} url - 链接URL
   * @returns {string} 链接类型（'note'/'uistatus'/'other'）
   */
  static getLinkType(url) {
    if (!url) return 'other'
    
    if (url.includes('marginnote4app://note/')) {
      return 'note'
    } else if (url.includes('marginnote4app://uistatus/')) {
      return 'uistatus'
    } else {
      return 'other'
    }
  }
  
  /**
   * 检查任务是否过期
   * @param {string} todayFieldContent - 今日字段内容
   * @returns {Object} {isOverdue: boolean, days: number}
   */
  static checkIfOverdue(todayFieldContent) {
    if (!todayFieldContent) {
      return { isOverdue: false, days: 0 };
    }
    
    // 提取日期（格式：📅 今日 (2025-01-08)）
    const dateMatch = todayFieldContent.match(/\((\d{4}-\d{2}-\d{2})\)/);
    if (!dateMatch) {
      // 如果没有日期信息（旧版今日标记），认为是过期的
      // 假设已过期1天，以便提示用户更新
      if (todayFieldContent.includes('📅 今日')) {
        return { isOverdue: true, days: 1 };
      }
      return { isOverdue: false, days: 0 };
    }
    
    const taskDate = new Date(dateMatch[1]);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    taskDate.setHours(0, 0, 0, 0);
    
    const diffTime = today - taskDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return {
      isOverdue: diffDays > 0,
      days: diffDays
    };
  }
  
  /**
   * 获取任务的计划时间
   * @param {MNNote} note - 任务卡片
   * @returns {string|null} 计划时间
   */
  static getPlannedTime(note) {
    const timeField = TaskFieldUtils.getFieldContent(note, "⏰");
    if (!timeField) return null;
    
    // 提取时间（格式：⏰ 09:00）
    const timeMatch = timeField.match(/(\d{1,2}:\d{2})/);
    return timeMatch ? timeMatch[1] : null;
  }
  
  /**
   * 获取任务进度
   * @param {MNNote} note - 任务卡片
   * @returns {number|null} 进度百分比
   */
  static getTaskProgress(note) {
    const progressField = TaskFieldUtils.getFieldContent(note, "进度");
    if (!progressField) return null;
    
    const match = progressField.match(/(\d+)%/);
    return match ? parseInt(match[1]) : null;
  }
  
  /**
   * 获取启动链接
   * @param {MNNote} note - 任务卡片
   * @returns {Object|null} 链接对象 {text, url, noteId}
   */
  static getLaunchLink(note) {
    const launchField = TaskFieldUtils.getFieldContent(note, "启动");
    if (!launchField) return null;
    
    // 解析 Markdown 链接格式 [text](url)
    const linkMatch = launchField.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      return {
        text: linkMatch[1],
        url: linkMatch[2],
        noteId: this.extractNoteIdFromUrl(linkMatch[2])
      };
    }
    
    return null;
  }
  
  /**
   * 从 URL 提取笔记 ID
   * @param {string} url - MarginNote URL
   * @returns {string|null} 笔记 ID
   */
  static extractNoteIdFromUrl(url) {
    if (!url) return null;
    
    // MarginNote URL 格式：marginnote4app://note/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
    const match = url.match(/marginnote\d*app:\/\/note\/([A-F0-9-]+)/i);
    return match ? match[1] : null;
  }
  
  /**
   * 生成今日任务报告
   * @param {Array<MNNote>} todayTasks - 今日任务列表
   * @returns {string} 报告文本
   */
  static generateTodayReport(todayTasks) {
    const now = new Date();
    const dateStr = now.toLocaleDateString('zh-CN');
    const timeStr = now.toLocaleTimeString('zh-CN');
    
    let report = `📊 今日任务报告\n`;
    report += `📅 日期：${dateStr}\n`;
    report += `⏰ 时间：${timeStr}\n`;
    report += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    // 统计信息
    const stats = {
      total: todayTasks.length,
      notStarted: 0,
      inProgress: 0,
      completed: 0,
      overdue: 0
    };
    
    // 分类任务
    const tasksByStatus = {
      '未开始': [],
      '进行中': [],
      '已完成': [],
      '过期': []
    };
    
    todayTasks.forEach(task => {
      const taskInfo = this.parseTaskTitle(task.noteTitle);
      const todayField = TaskFieldUtils.getFieldContent(task, "今日");
      const overdueInfo = this.checkIfOverdue(todayField);
      
      if (overdueInfo.isOverdue) {
        stats.overdue++;
        tasksByStatus['过期'].push({task, taskInfo, overdueInfo});
      } else {
        switch (taskInfo.status) {
          case '未开始':
            stats.notStarted++;
            tasksByStatus['未开始'].push({task, taskInfo});
            break;
          case '进行中':
            stats.inProgress++;
            tasksByStatus['进行中'].push({task, taskInfo});
            break;
          case '已完成':
            stats.completed++;
            tasksByStatus['已完成'].push({task, taskInfo});
            break;
        }
      }
    });
    
    // 完成率
    const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
    
    // 统计摘要
    report += `📈 统计摘要\n`;
    report += `• 任务总数：${stats.total}\n`;
    report += `• 未开始：${stats.notStarted}\n`;
    report += `• 进行中：${stats.inProgress}\n`;
    report += `• 已完成：${stats.completed}\n`;
    report += `• 过期任务：${stats.overdue}\n`;
    report += `• 完成率：${completionRate}%\n\n`;
    
    // 详细列表
    Object.entries(tasksByStatus).forEach(([status, tasks]) => {
      if (tasks.length === 0) return;
      
      report += `${this.getStatusIcon(status)} ${status}（${tasks.length}）\n`;
      report += `────────────────\n`;
      
      tasks.forEach(({task, taskInfo, overdueInfo}) => {
        const priority = this.getTaskPriority(task) || '低';
        const priorityIcon = this.getPriorityIcon(priority);
        const typeIcon = this.getTaskTypeIcon(taskInfo.type);
        
        report += `${typeIcon}${priorityIcon} ${taskInfo.content}\n`;
        
        if (overdueInfo && overdueInfo.isOverdue) {
          report += `   ⚠️ 过期 ${overdueInfo.days} 天\n`;
        }
        
        const plannedTime = this.getPlannedTime(task);
        if (plannedTime) {
          report += `   ⏰ ${plannedTime}\n`;
        }
        
        const progress = this.getTaskProgress(task);
        if (progress) {
          report += `   📊 进度：${progress}%\n`;
        }
        
        report += '\n';
      });
      
      report += '\n';
    });
    
    return report;
  }
  
  /**
   * 获取状态图标
   * @param {string} status - 状态名称
   * @returns {string} 图标
   */
  static getStatusIcon(status) {
    const icons = {
      '未开始': '😴',
      '进行中': '🔥',
      '已完成': '✅',
      '过期': '⚠️'
    };
    return icons[status] || '❓';
  }
  
  /**
   * 获取任务类型图标
   * @param {string} type - 任务类型
   * @returns {string} 图标
   */
  static getTaskTypeIcon(type) {
    const icons = {
      '目标': '🎯',
      '关键结果': '📊',
      '项目': '📁',
      '动作': '▶️'
    };
    return icons[type] || '📋';
  }
  
  /**
   * 获取优先级图标
   * @param {string} priority - 优先级
   * @returns {string} 图标
   */
  static getPriorityIcon(priority) {
    const icons = {
      '高': '🔴',
      '中': '🟡',
      '低': '🟢'
    };
    return icons[priority] || '⚪';
  }
}

// 确认 MNTaskManager 类已定义
if (typeof MNUtil !== 'undefined' && MNUtil.log) {
  MNUtil.log("✅ MNTaskManager 类已成功定义")
}

/**
 * TaskFilterEngine - 任务筛选引擎
 * 提供多维度的任务筛选和排序功能
 */
class TaskFilterEngine {
  /**
   * 通用筛选方法
   * @param {Object} criteria - 筛选条件
   * @param {string[]} criteria.boardKeys - 要筛选的看板
   * @param {Object} criteria.timeRange - 时间范围
   * @param {string[]} criteria.statuses - 状态列表
   * @param {string[]} criteria.priorities - 优先级列表
   * @param {string[]} criteria.tags - 标签列表
   * @param {boolean} criteria.hasDate - 是否有日期
   * @param {string} criteria.hierarchyType - 层级类型
   * @param {Function} criteria.customFilter - 自定义筛选函数
   * @returns {MNNote[]} 筛选结果
   */
  static filter(criteria = {}) {
    const {
      boardKeys = ['target', 'project', 'action'],
      timeRange,
      statuses,
      priorities,
      tags,
      hasDate,
      hierarchyType,
      customFilter
    } = criteria
    
    const results = []
    const processedIds = new Set()
    
    // 从各个看板收集任务
    for (let boardKey of boardKeys) {
      const boardNoteId = taskConfig.getBoardNoteId(boardKey)
      if (!boardNoteId) {
        if (typeof MNUtil !== 'undefined' && MNUtil.log) {
          MNUtil.log(`⚠️ 看板 ${boardKey} 未配置`)
        }
        continue
      }
      
      const boardNote = MNNote.new(boardNoteId)
      if (!boardNote) {
        if (typeof MNUtil !== 'undefined' && MNUtil.log) {
          MNUtil.log(`⚠️ 看板 ${boardKey} 不存在，ID: ${boardNoteId}`)
        }
        continue
      }
      
      if (typeof MNUtil !== 'undefined' && MNUtil.log) {
        MNUtil.log(`🔍 开始从看板 ${boardKey} 收集任务`)
      }
      
      // 递归收集所有任务卡片
      const collectTasks = (parentNote) => {
        if (!parentNote || !parentNote.childNotes) return
        
        for (let childNote of parentNote.childNotes) {
          // 避免重复处理
          if (processedIds.has(childNote.noteId)) continue
          processedIds.add(childNote.noteId)
          
          // 只处理任务卡片
          if (!MNTaskManager.isTaskCard(childNote)) {
            collectTasks(childNote)
            continue
          }
          
          if (typeof MNUtil !== 'undefined' && MNUtil.log) {
            MNUtil.log(`🔍 找到任务卡片：${childNote.noteTitle.substring(0, 50)}...`)
          }
          
          // 应用筛选条件
          if (this.matchesCriteria(childNote, criteria)) {
            results.push(childNote)
            if (typeof MNUtil !== 'undefined' && MNUtil.log) {
              MNUtil.log(`✅ 任务符合筛选条件`)
            }
          } else {
            if (typeof MNUtil !== 'undefined' && MNUtil.log) {
              MNUtil.log(`❌ 任务不符合筛选条件`)
            }
          }
          
          // 递归处理子卡片
          collectTasks(childNote)
        }
      }
      
      collectTasks(boardNote)
    }
    
    if (typeof MNUtil !== 'undefined' && MNUtil.log) {
      MNUtil.log(`📊 共找到 ${results.length} 个符合条件的任务`)
    }
    
    return results
  }
  
  /**
   * 检查任务是否符合筛选条件
   * @param {MNNote} task - 任务卡片
   * @param {Object} criteria - 筛选条件
   * @returns {boolean} 是否符合条件
   */
  static matchesCriteria(task, criteria) {
    const titleParts = MNTaskManager.parseTaskTitle(task.noteTitle)
    
    // 状态筛选
    if (criteria.statuses && criteria.statuses.length > 0) {
      if (!criteria.statuses.includes(titleParts.status)) {
        return false
      }
    }
    
    // 优先级筛选
    if (criteria.priorities && criteria.priorities.length > 0) {
      const priority = MNTaskManager.getTaskPriority(task)
      if (!priority || !criteria.priorities.includes(priority)) {
        return false
      }
    }
    
    // 标签筛选
    if (criteria.tags && criteria.tags.length > 0) {
      if (!task.tags || !criteria.tags.some(tag => task.tags.includes(tag))) {
        return false
      }
    }
    
    // 时间范围筛选
    if (criteria.timeRange) {
      const taskDate = this.getTaskDate(task)
      if (!taskDate) return false
      
      if (criteria.timeRange.start && taskDate < criteria.timeRange.start) {
        return false
      }
      if (criteria.timeRange.end && taskDate > criteria.timeRange.end) {
        return false
      }
    }
    
    // 是否有日期筛选
    if (criteria.hasDate !== undefined) {
      const hasTaskDate = this.getTaskDate(task) !== null
      if (criteria.hasDate !== hasTaskDate) {
        return false
      }
    }
    
    // 层级类型筛选
    if (criteria.hierarchyType) {
      switch (criteria.hierarchyType) {
        case 'top':
          if (task.parentNote && MNTaskManager.isTaskCard(task.parentNote)) {
            return false
          }
          break
        case 'leaf':
          if (task.childNotes && task.childNotes.some(n => MNTaskManager.isTaskCard(n))) {
            return false
          }
          break
        case 'parent':
          if (!task.childNotes || !task.childNotes.some(n => MNTaskManager.isTaskCard(n))) {
            return false
          }
          break
        case 'isolated':
          const hasParentTask = task.parentNote && MNTaskManager.isTaskCard(task.parentNote)
          const hasChildTask = task.childNotes && task.childNotes.some(n => MNTaskManager.isTaskCard(n))
          if (hasParentTask || hasChildTask) {
            return false
          }
          break
      }
    }
    
    // 自定义筛选函数
    if (criteria.customFilter && typeof criteria.customFilter === 'function') {
      if (!criteria.customFilter(task)) {
        return false
      }
    }
    
    return true
  }
  
  /**
   * 获取任务的日期
   * @param {MNNote} task - 任务卡片
   * @returns {Date|null} 任务日期
   */
  static getTaskDate(task) {
    // 先尝试获取截止日期字段
    const comments = task.MNComments || []
    for (let comment of comments) {
      if (comment && comment.text) {
        // 匹配日期格式：📅 截止日期: 2024-01-15
        const dateMatch = comment.text.match(/📅\s*截止日期:\s*(\d{4}-\d{2}-\d{2})/)
        if (dateMatch) {
          return new Date(dateMatch[1])
        }
      }
    }
    
    // 如果是今日任务，返回今天的日期
    if (MNTaskManager.isToday(task)) {
      return new Date()
    }
    
    return null
  }
  
  /**
   * 获取本周开始时间
   * @returns {Date} 本周一的日期
   */
  static getStartOfWeek(date = new Date()) {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) // 调整到周一
    return new Date(d.setDate(diff))
  }
  
  /**
   * 获取本周结束时间
   * @returns {Date} 本周日的日期
   */
  static getEndOfWeek(date = new Date()) {
    const startOfWeek = this.getStartOfWeek(date)
    return new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000)
  }
  
  /**
   * 筛选本周任务
   * @param {string[]} boardKeys - 要筛选的看板
   * @returns {MNNote[]} 本周任务列表
   */
  static filterThisWeekTasks(boardKeys = ['target', 'project', 'action']) {
    const startOfWeek = this.getStartOfWeek()
    const endOfWeek = this.getEndOfWeek()
    
    return this.filter({
      boardKeys,
      timeRange: { start: startOfWeek, end: endOfWeek },
      statuses: ['未开始', '进行中']
    })
  }
  
  /**
   * 筛选逾期任务
   * @param {string[]} boardKeys - 要筛选的看板
   * @returns {MNNote[]} 逾期任务列表
   */
  static filterOverdueTasks(boardKeys = ['target', 'project', 'action']) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return this.filter({
      boardKeys,
      statuses: ['未开始', '进行中'],
      customFilter: (task) => {
        const taskDate = this.getTaskDate(task)
        return taskDate && taskDate < today
      }
    })
  }
  
  /**
   * 筛选高优先级未完成任务
   * @param {string[]} boardKeys - 要筛选的看板
   * @returns {MNNote[]} 高优先级未完成任务列表
   */
  static filterHighPriorityIncompleteTasks(boardKeys = ['target', 'project', 'action']) {
    return this.filter({
      boardKeys,
      priorities: ['高'],
      statuses: ['未开始', '进行中']
    })
  }
  
  /**
   * 筛选活跃任务（未开始 + 进行中）
   * @param {string[]} boardKeys - 要筛选的看板
   * @returns {MNNote[]} 活跃任务列表
   */
  static filterActiveTasks(boardKeys = ['target', 'project', 'action']) {
    return this.filter({
      boardKeys,
      statuses: ['未开始', '进行中']
    })
  }
  
  /**
   * 筛选待归档任务（已完成但未归档）
   * @param {string[]} boardKeys - 要筛选的看板
   * @returns {MNNote[]} 待归档任务列表
   */
  static filterPendingArchiveTasks(boardKeys = ['target', 'project', 'action']) {
    return this.filter({
      boardKeys,
      statuses: ['已完成']
    })
  }
  
  /**
   * 筛选无日期任务
   * @param {string[]} boardKeys - 要筛选的看板
   * @returns {MNNote[]} 无日期任务列表
   */
  static filterNoDateTasks(boardKeys = ['target', 'project', 'action']) {
    return this.filter({
      boardKeys,
      hasDate: false,
      statuses: ['未开始', '进行中']
    })
  }
  
  /**
   * 按标签筛选任务
   * @param {string[]} tags - 标签列表
   * @param {string[]} boardKeys - 要筛选的看板
   * @returns {MNNote[]} 符合标签的任务列表
   */
  static filterByTags(tags, boardKeys = ['target', 'project', 'action']) {
    return this.filter({
      boardKeys,
      tags
    })
  }
  
  /**
   * 按层级类型筛选任务
   * @param {string} hierarchyType - 层级类型（top/leaf/parent/isolated）
   * @param {string[]} boardKeys - 要筛选的看板
   * @returns {MNNote[]} 符合层级类型的任务列表
   */
  static filterByHierarchy(hierarchyType, boardKeys = ['target', 'project', 'action']) {
    return this.filter({
      boardKeys,
      hierarchyType
    })
  }
  
  /**
   * 智能排序系统
   * @param {MNNote[]} tasks - 任务列表
   * @param {Object} sortOptions - 排序选项
   * @param {string} sortOptions.strategy - 排序策略
   * @param {boolean} sortOptions.ascending - 是否升序
   * @param {Object} sortOptions.weights - 权重配置
   * @returns {MNNote[]} 排序后的任务列表
   */
  static sort(tasks, sortOptions = {}) {
    const {
      strategy = 'smart',  // smart, priority, date, status, hierarchy, custom
      ascending = false,
      weights = {
        priority: 0.3,
        urgency: 0.3,
        importance: 0.2,
        progress: 0.2
      },
      customComparator
    } = sortOptions
    
    // 复制数组避免修改原数组
    const sortedTasks = [...tasks]
    
    // 根据策略选择排序方法
    switch (strategy) {
      case 'smart':
        return this.smartSort(sortedTasks, weights, ascending)
      case 'priority':
        return this.sortByPriority(sortedTasks, ascending)
      case 'date':
        return this.sortByDate(sortedTasks, ascending)
      case 'status':
        return this.sortByStatus(sortedTasks, ascending)
      case 'hierarchy':
        return this.sortByHierarchy(sortedTasks, ascending)
      case 'custom':
        if (customComparator) {
          return sortedTasks.sort(customComparator)
        }
        return sortedTasks
      default:
        return sortedTasks
    }
  }
  
  /**
   * 智能排序（多维度综合评分）
   * @param {MNNote[]} tasks - 任务列表
   * @param {Object} weights - 权重配置
   * @param {boolean} ascending - 是否升序
   * @returns {MNNote[]} 排序后的任务列表
   */
  static smartSort(tasks, weights, ascending = false) {
    return tasks.sort((a, b) => {
      const scoreA = this.calculateSmartScore(a, weights)
      const scoreB = this.calculateSmartScore(b, weights)
      
      return ascending ? scoreA - scoreB : scoreB - scoreA
    })
  }
  
  /**
   * 计算任务的智能评分
   * @param {MNNote} task - 任务卡片
   * @param {Object} weights - 权重配置
   * @returns {number} 任务评分（0-100）
   */
  static calculateSmartScore(task, weights) {
    let score = 0
    
    // 1. 优先级评分 (0-100)
    const priority = MNTaskManager.getTaskPriority(task)
    const priorityScore = priority === '高' ? 100 : priority === '中' ? 50 : 0
    score += priorityScore * weights.priority
    
    // 2. 紧急度评分 (0-100)
    const urgencyScore = this.calculateUrgencyScore(task)
    score += urgencyScore * weights.urgency
    
    // 3. 重要性评分 (0-100)
    const importanceScore = this.calculateImportanceScore(task)
    score += importanceScore * weights.importance
    
    // 4. 进度评分 (0-100)
    const progressScore = this.calculateProgressScore(task)
    score += progressScore * weights.progress
    
    return score
  }
  
  /**
   * 计算紧急度评分
   * @param {MNNote} task - 任务卡片
   * @returns {number} 紧急度评分（0-100）
   */
  static calculateUrgencyScore(task) {
    const taskDate = this.getTaskDate(task)
    if (!taskDate) return 50  // 无日期的任务默认中等紧急度
    
    const now = new Date()
    const daysUntil = Math.floor((taskDate - now) / (1000 * 60 * 60 * 24))
    
    // 已逾期
    if (daysUntil < 0) return 100
    
    // 今天到期
    if (daysUntil === 0) return 95
    
    // 明天到期
    if (daysUntil === 1) return 90
    
    // 一周内
    if (daysUntil <= 7) return 70
    
    // 两周内
    if (daysUntil <= 14) return 50
    
    // 一个月内
    if (daysUntil <= 30) return 30
    
    // 超过一个月
    return 10
  }
  
  /**
   * 计算重要性评分
   * @param {MNNote} task - 任务卡片
   * @returns {number} 重要性评分（0-100）
   */
  static calculateImportanceScore(task) {
    let score = 0
    const titleParts = MNTaskManager.parseTaskTitle(task.noteTitle)
    
    // 类型权重
    const typeWeights = {
      '目标': 100,
      '关键结果': 80,
      '项目': 60,
      '动作': 40
    }
    score += typeWeights[titleParts.type] || 0
    
    // 有子任务的任务更重要
    if (task.childNotes && task.childNotes.some(n => MNTaskManager.isTaskCard(n))) {
      score = Math.min(100, score + 20)
    }
    
    // 被多个任务依赖的任务更重要
    const parsed = MNTaskManager.parseTaskComments(task)
    if (parsed.links && parsed.links.length > 2) {
      score = Math.min(100, score + 10)
    }
    
    return score
  }
  
  /**
   * 计算进度评分
   * @param {MNNote} task - 任务卡片
   * @returns {number} 进度评分（0-100）
   */
  static calculateProgressScore(task) {
    const titleParts = MNTaskManager.parseTaskTitle(task.noteTitle)
    
    // 根据状态评分
    switch (titleParts.status) {
      case '进行中':
        return 100  // 进行中的任务优先级最高
      case '未开始':
        return 50
      case '已完成':
        return 10
      case '已归档':
        return 0
      default:
        return 30
    }
  }
  
  /**
   * 按优先级排序
   * @param {MNNote[]} tasks - 任务列表
   * @param {boolean} ascending - 是否升序
   * @returns {MNNote[]} 排序后的任务列表
   */
  static sortByPriority(tasks, ascending = false) {
    const priorityOrder = { '高': 3, '中': 2, '低': 1 }
    
    return tasks.sort((a, b) => {
      const priorityA = MNTaskManager.getTaskPriority(a)
      const priorityB = MNTaskManager.getTaskPriority(b)
      
      const orderA = priorityOrder[priorityA] || 0
      const orderB = priorityOrder[priorityB] || 0
      
      const result = orderB - orderA
      return ascending ? -result : result
    })
  }
  
  /**
   * 按日期排序
   * @param {MNNote[]} tasks - 任务列表
   * @param {boolean} ascending - 是否升序（true: 最早的在前）
   * @returns {MNNote[]} 排序后的任务列表
   */
  static sortByDate(tasks, ascending = true) {
    return tasks.sort((a, b) => {
      const dateA = this.getTaskDate(a)
      const dateB = this.getTaskDate(b)
      
      // 无日期的任务放在最后
      if (!dateA && !dateB) return 0
      if (!dateA) return 1
      if (!dateB) return -1
      
      const result = dateA - dateB
      return ascending ? result : -result
    })
  }
  
  /**
   * 按状态排序
   * @param {MNNote[]} tasks - 任务列表
   * @param {boolean} ascending - 是否升序
   * @returns {MNNote[]} 排序后的任务列表
   */
  static sortByStatus(tasks, ascending = false) {
    const statusOrder = {
      '进行中': 4,
      '未开始': 3,
      '已完成': 2,
      '已归档': 1
    }
    
    return tasks.sort((a, b) => {
      const titlePartsA = MNTaskManager.parseTaskTitle(a.noteTitle)
      const titlePartsB = MNTaskManager.parseTaskTitle(b.noteTitle)
      
      const orderA = statusOrder[titlePartsA.status] || 0
      const orderB = statusOrder[titlePartsB.status] || 0
      
      const result = orderB - orderA
      return ascending ? -result : result
    })
  }
  
  /**
   * 按层级排序
   * @param {MNNote[]} tasks - 任务列表
   * @param {boolean} ascending - 是否升序（true: 顶层在前）
   * @returns {MNNote[]} 排序后的任务列表
   */
  static sortByHierarchy(tasks, ascending = true) {
    const typeOrder = {
      '目标': 4,
      '关键结果': 3,
      '项目': 2,
      '动作': 1
    }
    
    return tasks.sort((a, b) => {
      const titlePartsA = MNTaskManager.parseTaskTitle(a.noteTitle)
      const titlePartsB = MNTaskManager.parseTaskTitle(b.noteTitle)
      
      const orderA = typeOrder[titlePartsA.type] || 0
      const orderB = typeOrder[titlePartsB.type] || 0
      
      const result = orderB - orderA
      return ascending ? -result : result
    })
  }
  
  /**
   * 组合筛选和排序
   * @param {Object} options - 筛选和排序选项
   * @returns {MNNote[]} 处理后的任务列表
   */
  static filterAndSort(options = {}) {
    const {
      filterCriteria = {},
      sortOptions = {}
    } = options
    
    // 先筛选
    const filteredTasks = this.filter(filterCriteria)
    
    // 再排序
    return this.sort(filteredTasks, sortOptions)
  }
  
  /**
   * 获取任务分组
   * @param {MNNote[]} tasks - 任务列表
   * @param {string} groupBy - 分组依据（status/priority/date/type）
   * @returns {Object} 分组后的任务
   */
  static groupTasks(tasks, groupBy = 'status') {
    const groups = {}
    
    for (let task of tasks) {
      let groupKey
      
      switch (groupBy) {
        case 'status':
          const titleParts = MNTaskManager.parseTaskTitle(task.noteTitle)
          groupKey = titleParts.status || '未分类'
          break
          
        case 'priority':
          groupKey = MNTaskManager.getTaskPriority(task) || '无优先级'
          break
          
        case 'date':
          const taskDate = this.getTaskDate(task)
          if (!taskDate) {
            groupKey = '无日期'
          } else {
            const today = new Date()
            const days = Math.floor((taskDate - today) / (1000 * 60 * 60 * 24))
            if (days < 0) groupKey = '已逾期'
            else if (days === 0) groupKey = '今天'
            else if (days === 1) groupKey = '明天'
            else if (days <= 7) groupKey = '本周'
            else if (days <= 30) groupKey = '本月'
            else groupKey = '更晚'
          }
          break
          
        case 'type':
          const titleParts2 = MNTaskManager.parseTaskTitle(task.noteTitle)
          groupKey = titleParts2.type || '未分类'
          break
          
        default:
          groupKey = '未分类'
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push(task)
    }
    
    return groups
  }
  
  /**
   * 获取任务统计信息
   * @param {MNNote[]} tasks - 任务列表
   * @returns {Object} 统计信息
   */
  static getTaskStatistics(tasks) {
    const stats = {
      total: tasks.length,
      byStatus: {},
      byPriority: {},
      byType: {},
      overdue: 0,
      dueToday: 0,
      dueThisWeek: 0,
      noDueDate: 0
    }
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const weekEnd = this.getEndOfWeek()
    
    for (let task of tasks) {
      const titleParts = MNTaskManager.parseTaskTitle(task.noteTitle)
      
      // 状态统计
      const status = titleParts.status || '未分类'
      stats.byStatus[status] = (stats.byStatus[status] || 0) + 1
      
      // 优先级统计
      const priority = MNTaskManager.getTaskPriority(task) || '无优先级'
      stats.byPriority[priority] = (stats.byPriority[priority] || 0) + 1
      
      // 类型统计
      const type = titleParts.type || '未分类'
      stats.byType[type] = (stats.byType[type] || 0) + 1
      
      // 日期统计
      const taskDate = this.getTaskDate(task)
      if (!taskDate) {
        stats.noDueDate++
      } else {
        if (taskDate < today) stats.overdue++
        else if (taskDate.toDateString() === today.toDateString()) stats.dueToday++
        else if (taskDate <= weekEnd) stats.dueThisWeek++
      }
    }
    
    return stats
  }
  
  /**
   * 快速筛选预设 - 重要且紧急的任务
   * @param {string[]} boardKeys - 要筛选的看板
   * @returns {MNNote[]} 任务列表
   */
  static filterImportantAndUrgent(boardKeys = ['target', 'project', 'action']) {
    return this.filterAndSort({
      filterCriteria: {
        boardKeys,
        priorities: ['高'],
        statuses: ['未开始', '进行中'],
        customFilter: (task) => {
          const urgencyScore = this.calculateUrgencyScore(task)
          return urgencyScore >= 70  // 紧急度70分以上
        }
      },
      sortOptions: {
        strategy: 'smart',
        weights: {
          urgency: 0.5,
          priority: 0.3,
          importance: 0.1,
          progress: 0.1
        }
      }
    })
  }
  
  /**
   * 快速筛选预设 - 即将到期的任务（3天内）
   * @param {string[]} boardKeys - 要筛选的看板
   * @returns {MNNote[]} 任务列表
   */
  static filterUpcomingTasks(boardKeys = ['target', 'project', 'action']) {
    const threeDaysLater = new Date()
    threeDaysLater.setDate(threeDaysLater.getDate() + 3)
    
    return this.filterAndSort({
      filterCriteria: {
        boardKeys,
        statuses: ['未开始', '进行中'],
        timeRange: {
          start: new Date(),
          end: threeDaysLater
        }
      },
      sortOptions: {
        strategy: 'date',
        ascending: true
      }
    })
  }
  
  /**
   * 快速筛选预设 - 停滞的任务（超过7天未更新）
   * @param {string[]} boardKeys - 要筛选的看板
   * @returns {MNNote[]} 任务列表
   */
  static filterStalledTasks(boardKeys = ['target', 'project', 'action']) {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    return this.filter({
      boardKeys,
      statuses: ['进行中'],
      customFilter: (task) => {
        // 检查最后修改时间
        return task.modifiedDate && task.modifiedDate < sevenDaysAgo
      }
    })
  }
  
  /**
   * 获取任务建议（基于当前时间和任务状态）
   * @param {string[]} boardKeys - 要分析的看板
   * @returns {Object} 任务建议
   */
  static getTaskSuggestions(boardKeys = ['target', 'project', 'action']) {
    const allTasks = this.filter({ boardKeys })
    const stats = this.getTaskStatistics(allTasks)
    
    const suggestions = {
      urgentActions: [],      // 紧急需要处理的
      canStart: [],          // 可以开始的
      shouldReview: [],      // 需要回顾的
      canArchive: [],        // 可以归档的
      needsPlanning: []      // 需要规划的
    }
    
    // 分析任务并生成建议
    for (let task of allTasks) {
      const titleParts = MNTaskManager.parseTaskTitle(task.noteTitle)
      const urgencyScore = this.calculateUrgencyScore(task)
      
      // 紧急任务
      if (urgencyScore >= 90 && titleParts.status !== '已完成') {
        suggestions.urgentActions.push(task)
      }
      
      // 可以开始的任务
      if (titleParts.status === '未开始' && !this.hasBlockingDependencies(task)) {
        suggestions.canStart.push(task)
      }
      
      // 需要回顾的任务（停滞超过7天）
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      if (titleParts.status === '进行中' && task.modifiedDate < sevenDaysAgo) {
        suggestions.shouldReview.push(task)
      }
      
      // 可以归档的任务
      if (titleParts.status === '已完成') {
        suggestions.canArchive.push(task)
      }
      
      // 需要规划的任务（无日期且为高优先级）
      if (!this.getTaskDate(task) && MNTaskManager.getTaskPriority(task) === '高') {
        suggestions.needsPlanning.push(task)
      }
    }
    
    // 按重要性排序建议
    Object.keys(suggestions).forEach(key => {
      suggestions[key] = this.sort(suggestions[key], { strategy: 'smart' })
    })
    
    return {
      statistics: stats,
      suggestions,
      summary: {
        urgent: suggestions.urgentActions.length,
        canStart: suggestions.canStart.length,
        shouldReview: suggestions.shouldReview.length,
        canArchive: suggestions.canArchive.length,
        needsPlanning: suggestions.needsPlanning.length
      }
    }
  }
  
  /**
   * 检查任务是否有未完成的依赖
   * @param {MNNote} task - 任务卡片
   * @returns {boolean} 是否有阻塞依赖
   */
  static hasBlockingDependencies(task) {
    const parsed = MNTaskManager.parseTaskComments(task)
    
    // 检查"前置条件"字段中的任务链接
    if (parsed.fields && parsed.fields['前置条件']) {
      for (let link of parsed.links) {
        try {
          const linkedNote = MNNote.new(link.linkedNoteId)
          if (linkedNote && MNTaskManager.isTaskCard(linkedNote)) {
            const linkedTitleParts = MNTaskManager.parseTaskTitle(linkedNote.noteTitle)
            if (linkedTitleParts.status !== '已完成' && linkedTitleParts.status !== '已归档') {
              return true  // 有未完成的依赖
            }
          }
        } catch (e) {
          // 忽略无效链接
        }
      }
    }
    
    return false
  }
  
  /**
   * 读书任务拆分系统
   * @author 夏大鱼羊
   */
  
  /**
   * 按章节拆分任务（支持多层级）
   * @param {MNNote} parentNote - 父任务卡片
   * @param {Object} options - 拆分选项
   * @returns {Array<MNNote>} 创建的子任务数组
   */
  static splitTaskByChapters(parentNote, options = {}) {
    const {
      chapters = [],        // 章节结构数组
      startChapter = 1,     // 起始章节
      endChapter = null,    // 结束章节
      includeSubChapters = true,  // 是否包含子章节
      createNow = true      // 是否立即创建所有章节
    } = options
    
    const createdTasks = []
    const titleParts = this.parseTaskTitle(parentNote.noteTitle)
    
    MNUtil.undoGrouping(() => {
      // 如果提供了章节结构
      if (chapters && chapters.length > 0) {
        chapters.forEach((chapter, index) => {
          const chapterNum = index + 1
          if (chapterNum >= startChapter && (!endChapter || chapterNum <= endChapter)) {
            const taskTitle = `【动作】${chapter.title || `第${chapterNum}章`}`
            const childNote = MNNote.createChildNote(parentNote, taskTitle)
            
            // 添加任务字段
            this.addTaskFieldsToNote(childNote, {
              status: "未开始",
              info: `章节范围: ${chapter.pages ? `${chapter.pages.start}-${chapter.pages.end}页` : '未指定'}`
            })
            
            // 如果有子章节且需要包含
            if (includeSubChapters && chapter.subChapters) {
              chapter.subChapters.forEach((subChapter, subIndex) => {
                const subTaskTitle = `【动作】${subChapter.title || `${chapterNum}.${subIndex + 1}节`}`
                const subChildNote = MNNote.createChildNote(childNote, subTaskTitle)
                
                this.addTaskFieldsToNote(subChildNote, {
                  status: "未开始",
                  info: `小节范围: ${subChapter.pages ? `${subChapter.pages.start}-${subChapter.pages.end}页` : '未指定'}`
                })
              })
            }
            
            createdTasks.push(childNote)
          }
        })
      } else {
        // 简单的章节拆分
        const totalChapters = endChapter || 10
        for (let i = startChapter; i <= totalChapters; i++) {
          const taskTitle = `【动作】阅读第${i}章`
          const childNote = MNNote.createChildNote(parentNote, taskTitle)
          
          this.addTaskFieldsToNote(childNote, {
            status: "未开始",
            info: `章节: 第${i}章`
          })
          
          createdTasks.push(childNote)
        }
      }
      
      // 更新父任务状态
      this.updateTaskField(parentNote, '信息', `已拆分为${createdTasks.length}个章节任务`)
    })
    
    MNUtil.showHUD(`✅ 已创建 ${createdTasks.length} 个章节任务`)
    return createdTasks
  }
  
  /**
   * 按页码渐进式拆分
   * @param {MNNote} parentNote - 父任务卡片
   * @param {Object} options - 拆分选项
   * @returns {Array<MNNote>} 创建的子任务数组
   */
  static splitTaskByPages(parentNote, options = {}) {
    const {
      totalPages,           // 总页数
      currentPage = 1,      // 当前页码
      pagesPerDay = 20,     // 每日页数（初始值）
      daysToCreate = 3,     // 创建几天的任务
      adjustByProgress = true  // 是否根据进度调整
    } = options
    
    if (!totalPages) {
      MNUtil.showHUD("❌ 请先设置总页数")
      return []
    }
    
    const createdTasks = []
    const remainingPages = totalPages - currentPage + 1
    
    MNUtil.undoGrouping(() => {
      let startPage = currentPage
      let dailyPages = pagesPerDay
      
      // 获取已完成的子任务，用于进度调整
      if (adjustByProgress) {
        const completedTasks = this.getChildTaskNotes(parentNote)
          .filter(task => {
            const parts = this.parseTaskTitle(task.noteTitle)
            return parts.status === '已完成'
          })
        
        // 根据历史完成情况调整每日页数
        if (completedTasks.length > 0) {
          const avgCompletion = this.calculateAverageCompletion(completedTasks)
          dailyPages = Math.round(pagesPerDay * avgCompletion)
        }
      }
      
      // 创建指定天数的任务
      for (let day = 1; day <= daysToCreate && startPage <= totalPages; day++) {
        const endPage = Math.min(startPage + dailyPages - 1, totalPages)
        const taskTitle = `【动作】阅读 P${startPage}-${endPage}`
        
        const childNote = MNNote.createChildNote(parentNote, taskTitle)
        
        this.addTaskFieldsToNote(childNote, {
          status: "未开始",
          info: `页码范围: ${startPage}-${endPage}页，共${endPage - startPage + 1}页`,
          priority: day === 1 ? "高" : "中"
        })
        
        // 添加今日标记（第一个任务）
        if (day === 1) {
          this.markAsToday(childNote, true)
        }
        
        createdTasks.push(childNote)
        startPage = endPage + 1
      }
      
      // 记录拆分进度
      const progressInfo = {
        totalPages,
        currentPage: startPage,
        remainingPages: totalPages - startPage + 1,
        estimatedDays: Math.ceil((totalPages - startPage + 1) / dailyPages)
      }
      
      this.updateTaskField(parentNote, '信息', 
        `进度: ${startPage - 1}/${totalPages}页 (${Math.round((startPage - 1) / totalPages * 100)}%)\n` +
        `预计还需 ${progressInfo.estimatedDays} 天完成`
      )
    })
    
    MNUtil.showHUD(`✅ 已创建 ${createdTasks.length} 个阅读任务`)
    return createdTasks
  }
  
  /**
   * 动态调整阅读计划
   * @param {MNNote} parentNote - 父任务卡片
   * @returns {Object} 调整结果
   */
  static adjustReadingPlan(parentNote) {
    const childTasks = this.getChildTaskNotes(parentNote)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // 分析任务完成情况
    const analysis = {
      total: childTasks.length,
      completed: 0,
      inProgress: 0,
      notStarted: 0,
      overdue: 0,
      todayTasks: []
    }
    
    childTasks.forEach(task => {
      const parts = this.parseTaskTitle(task.noteTitle)
      const taskDate = this.getTaskDate(task)
      
      switch (parts.status) {
        case '已完成':
          analysis.completed++
          break
        case '进行中':
          analysis.inProgress++
          if (taskDate && taskDate < today) {
            analysis.overdue++
          }
          break
        case '未开始':
          analysis.notStarted++
          if (this.hasToday(task)) {
            analysis.todayTasks.push(task)
          }
          break
      }
    })
    
    // 生成调整建议
    const suggestions = []
    
    // 如果有逾期任务，建议减少每日任务量
    if (analysis.overdue > 0) {
      suggestions.push({
        type: 'reduce',
        reason: `有 ${analysis.overdue} 个逾期任务`,
        action: '建议减少每日阅读量或合并任务'
      })
    }
    
    // 如果完成率高，可以增加任务量
    const completionRate = analysis.completed / (analysis.completed + analysis.inProgress + analysis.overdue)
    if (completionRate > 0.8 && analysis.completed > 3) {
      suggestions.push({
        type: 'increase',
        reason: `完成率高达 ${Math.round(completionRate * 100)}%`,
        action: '可以适当增加每日阅读量'
      })
    }
    
    // 如果今日没有任务，自动分配
    if (analysis.todayTasks.length === 0 && analysis.notStarted > 0) {
      const nextTask = childTasks.find(task => {
        const parts = this.parseTaskTitle(task.noteTitle)
        return parts.status === '未开始'
      })
      
      if (nextTask) {
        this.markAsToday(nextTask, true)
        suggestions.push({
          type: 'auto-assign',
          reason: '今日没有阅读任务',
          action: `已自动分配: ${nextTask.noteTitle}`
        })
      }
    }
    
    return {
      analysis,
      suggestions,
      needsAdjustment: suggestions.length > 0
    }
  }
  
  /**
   * 计算平均完成率
   * @param {Array<MNNote>} completedTasks - 已完成的任务
   * @returns {number} 平均完成率（0-1）
   */
  static calculateAverageCompletion(completedTasks) {
    if (completedTasks.length === 0) return 1
    
    // 分析每个任务的实际完成时间vs计划时间
    let totalRate = 0
    let validCount = 0
    
    completedTasks.forEach(task => {
      const parsed = this.parseTaskComments(task)
      // 这里可以根据实际的时间字段计算
      // 简化处理：假设都是按时完成
      totalRate += 1
      validCount++
    })
    
    return validCount > 0 ? totalRate / validCount : 1
  }
  
  /**
   * 创建学习任务模板
   * @param {MNNote} parentNote - 父任务卡片
   * @param {string} template - 模板类型
   * @returns {Array<MNNote>} 创建的任务数组
   */
  static createLearningTemplate(parentNote, template = 'standard') {
    const templates = {
      standard: [
        { type: '动作', title: '预读：浏览目录和概要', priority: '中' },
        { type: '动作', title: '精读：深入理解核心概念', priority: '高' },
        { type: '动作', title: '总结：整理笔记和要点', priority: '高' },
        { type: '动作', title: '复习：巩固关键知识', priority: '中' },
        { type: '动作', title: '应用：完成练习或项目', priority: '高' }
      ],
      technical: [
        { type: '动作', title: '概览：了解技术背景', priority: '低' },
        { type: '动作', title: '环境：搭建开发环境', priority: '高' },
        { type: '动作', title: '示例：运行官方示例', priority: '中' },
        { type: '动作', title: '实践：编写测试代码', priority: '高' },
        { type: '动作', title: '项目：完成小型项目', priority: '高' },
        { type: '动作', title: '总结：编写学习笔记', priority: '中' }
      ],
      exam: [
        { type: '动作', title: '诊断：做诊断测试', priority: '高' },
        { type: '动作', title: '基础：复习基础知识', priority: '高' },
        { type: '动作', title: '重点：攻克重难点', priority: '高' },
        { type: '动作', title: '练习：大量刷题', priority: '高' },
        { type: '动作', title: '模拟：全真模拟考试', priority: '高' },
        { type: '动作', title: '查漏：补充薄弱环节', priority: '中' }
      ]
    }
    
    const selectedTemplate = templates[template] || templates.standard
    const createdTasks = []
    
    MNUtil.undoGrouping(() => {
      selectedTemplate.forEach((item, index) => {
        const taskTitle = `【${item.type}】${item.title}`
        const childNote = MNNote.createChildNote(parentNote, taskTitle)
        
        this.addTaskFieldsToNote(childNote, {
          status: "未开始",
          priority: item.priority,
          info: `学习阶段 ${index + 1}/${selectedTemplate.length}`
        })
        
        createdTasks.push(childNote)
      })
      
      // 更新父任务
      this.updateTaskField(parentNote, '信息', `已创建${template}学习模板，共${createdTasks.length}个阶段`)
    })
    
    return createdTasks
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

  // 将核心类暴露到全局作用域
  // JSBox 环境中，直接赋值到全局
  global.TaskFieldUtils = TaskFieldUtils;
  global.MNTaskManager = MNTaskManager;
  global.TaskFilterEngine = TaskFilterEngine;
  
  // 日志输出
  if (typeof MNUtil !== 'undefined' && MNUtil.log) {
    MNUtil.log("✅ MNTaskManager 和相关类已暴露到全局");
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
  // 报告错误而不是静默处理
  if (typeof MNUtil !== 'undefined' && MNUtil.addErrorLog) {
    MNUtil.addErrorLog(error, "xdyy_utils_extensions 初始化失败", {
      message: error.message,
      stack: error.stack
    })
  }
  // 至少在控制台输出错误
  console.error("xdyy_utils_extensions 初始化错误:", error)
}