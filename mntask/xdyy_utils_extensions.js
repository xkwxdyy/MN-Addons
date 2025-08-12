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
    const html = `<span ${idAttr} style="${style}">${text}</span>`
    
    // Debug logging
    MNUtil.log(`🔍 DEBUG createFieldHtml:`)
    MNUtil.log(`  - Input text: "${text}"`)
    MNUtil.log(`  - Type: ${type}`)
    MNUtil.log(`  - Generated HTML: ${html.substring(0, 100)}...`)
    
    return html
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
   * 创建日期字段
   * @param {string|boolean} date - 日期字符串(YYYY-MM-DD)或true表示今天
   * @returns {string} 格式化的日期字段 HTML
   */
  static createDateField(date = true) {
    let dateStr = date
    if (date === true) {
      const today = new Date()
      dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    }
    return this.createFieldHtml(`📅 日期: ${dateStr}`, 'subField')
  }
  
  /**
   * 创建今日字段（向后兼容）
   * @param {boolean} includeDate - 是否包含日期信息
   * @returns {string} 格式化的今日字段 HTML
   */
  static createTodayField(includeDate = true) {
    return this.createDateField(true)
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
  static extractFieldText(comment) {
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
  
  /**
   * 获取指定字段的内容
   * @param {MNNote} note - 任务卡片
   * @param {string} fieldName - 要查找的字段名
   * @returns {string|null} 字段内容，如果没找到则返回 null
   */
  static getFieldContent(note, fieldName) {
    if (!note || !note.MNComments) return null
    
    // 遍历所有评论查找匹配的字段
    for (let i = 0; i < note.MNComments.length; i++) {
      const comment = note.MNComments[i]
      if (!comment || !comment.text) continue
      
      const text = comment.text
      
      // 检查是否是任务字段
      if (this.isTaskField(text)) {
        const parsed = this.getFieldNameAndContent(text)
        
        // 检查字段名是否匹配
        if (parsed.fieldName === fieldName) {
          return parsed.content
        }
      }
    }
    
    return null
  }
  
  /**
   * 获取指定字段的索引位置
   * @param {MNNote} note - 任务卡片
   * @param {string} fieldName - 要查找的字段名
   * @returns {number} 字段索引，如果没找到则返回 -1
   */
  static getFieldIndex(note, fieldName) {
    if (!note || !note.MNComments) return -1
    
    // 遍历所有评论查找匹配的字段
    for (let i = 0; i < note.MNComments.length; i++) {
      const comment = note.MNComments[i]
      if (!comment || !comment.text) continue
      
      const text = comment.text
      
      // 检查是否是任务字段
      if (this.isTaskField(text)) {
        const parsed = this.getFieldNameAndContent(text)
        
        // 检查字段名是否匹配
        if (parsed.fieldName === fieldName) {
          return i
        }
      }
    }
    
    return -1
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
      
      // 详细日志
      MNUtil.log(`📝 parseTaskTitle 解析成功:`)
      MNUtil.log(`  - 原标题: "${title}"`)
      MNUtil.log(`  - 类型: ${titleParts.type}`)
      MNUtil.log(`  - 路径: ${titleParts.path || '(无)'}`)
      MNUtil.log(`  - 状态: ${titleParts.status}`)
      MNUtil.log(`  - 内容: ${titleParts.content}`)
    } else {
      MNUtil.log(`❌ parseTaskTitle 解析失败:`)
      MNUtil.log(`  - 原标题: "${title}"`)
      MNUtil.log(`  - 正则匹配失败`)
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
    
    // 详细日志：记录判断过程
    const logPrefix = `🔍 isTaskCard 检查 "${title.substring(0, 50)}${title.length > 50 ? '...' : ''}"`
    
    // 必须符合基本格式
    if (!title.startsWith("【")) {
      MNUtil.log(`${logPrefix} ❌ 不是以【开头`)
      return false
    }
    if (!title.includes("｜")) {
      MNUtil.log(`${logPrefix} ❌ 不包含｜分隔符`)
      return false
    }
    if (!title.includes("】")) {
      MNUtil.log(`${logPrefix} ❌ 不包含】结束符`)
      return false
    }
    
    // 解析标题获取类型
    const titleParts = this.parseTaskTitle(title)
    if (!titleParts.type) {
      MNUtil.log(`${logPrefix} ❌ 无法解析出任务类型`)
      MNUtil.log(`  解析结果: ${JSON.stringify(titleParts)}`)
      return false
    }
    
    // 只接受这四种任务类型
    const validTypes = ["目标", "关键结果", "项目", "动作"]
    const isValid = validTypes.includes(titleParts.type)
    
    if (!isValid) {
      MNUtil.log(`${logPrefix} ❌ 类型 "${titleParts.type}" 不在有效类型列表中`)
    } else {
      MNUtil.log(`${logPrefix} ✅ 是有效的任务卡片，类型: ${titleParts.type}`)
    }
    
    return isValid
  }

  /**
   * 判断卡片是否在已绑定的看板中
   * @param {MNNote} note - 要判断的卡片
   * @returns {boolean} 是否在已绑定的看板中
   */
  static isInBoundBoard(note) {
    if (!note || !note.parentNote) return false
    
    const parentId = note.parentNote.noteId
    
    // 检查是否是任何已绑定看板的根卡片
    const boardKeys = ['target', 'project', 'action', 'completed', 'today']
    for (const key of boardKeys) {
      const boardId = taskConfig.getBoardNoteId(key)
      if (boardId && boardId === parentId) {
        MNUtil.log(`✅ 卡片在已绑定的 ${key} 看板中`)
        return true
      }
    }
    
    return false
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
   * @param {string} taskType - 指定的任务类型（可选）
   */
  static async convertToTaskCard(note, taskType = null) {
    // 获取要转换的卡片
    const focusNote = note || MNNote.getFocusNote()
    if (!focusNote) {
      return {
        type: 'failed',
        noteId: null,
        title: '无选中卡片',
        error: '没有选中任何卡片'
      }
    }
    
    MNUtil.log(`\n🚀 === 开始转换任务卡片 ===`)
    MNUtil.log(`📝 卡片标题: ${focusNote.noteTitle}`)
    MNUtil.log(`🆔 卡片ID: ${focusNote.noteId}`)
    MNUtil.log(`📋 指定任务类型: ${taskType || '未指定'}`)
    
    // 检查是否是非任务看板卡片（需要创建临时任务）
    const parentNote = focusNote.parentNote
    const isParentTaskCard = parentNote ? this.isTaskCard(parentNote) : false
    const isFocusTaskCard = this.isTaskCard(focusNote)
    const isInBoundBoard = this.isInBoundBoard(focusNote)
    
    // 添加调试日志
    MNUtil.log(`📋 卡片位置检查:`)
    MNUtil.log(`  - 是否是任务卡片: ${isFocusTaskCard ? '✅ 是' : '❌ 否'}`)
    MNUtil.log(`  - 是否在已绑定看板中: ${isInBoundBoard ? '✅ 是' : '❌ 否'}`)
    if (isInBoundBoard && parentNote) {
      MNUtil.log(`  - 所在看板: ${parentNote.noteTitle}`)
    }
    MNUtil.log(`  - 父卡片是否是任务卡片: ${isParentTaskCard ? '✅ 是' : '❌ 否'}`)
    
    // 判断是否需要创建临时任务
    // 条件：1. 不是任务卡片 且 2. 不在已绑定看板中 且 3. (没有父卡片 或 父卡片不是任务卡片)
    const needCreateTemporary = !isFocusTaskCard && !isInBoundBoard && (!parentNote || !isParentTaskCard)
    
    if (needCreateTemporary) {
      MNUtil.log('🆕 检测到非任务看板卡片，触发临时任务创建流程...')
      return await this.createTemporaryTask(focusNote)
    } else if (!isFocusTaskCard && isInBoundBoard) {
      MNUtil.log('✅ 卡片在已绑定看板中，进行正常任务制卡')
    }
    
    try {
      // 原有的制卡逻辑
      let shouldTransformParentToProject = false
      
      if (parentNote) {
        MNUtil.log(`👪 检测到父卡片:`)
        MNUtil.log(`  - 标题: ${parentNote.noteTitle}`)
        MNUtil.log(`  - ID: ${parentNote.noteId}`)
        
        // 详细检查父卡片是否是任务卡片
        MNUtil.log(`👪 父卡片任务卡片检查结果: ${isParentTaskCard ? '✅ 是' : '❌ 否'}`)
        
        if (isParentTaskCard) {
          const parentParts = this.parseTaskTitle(parentNote.noteTitle)
          MNUtil.log(`  - 父任务类型: ${parentParts.type}`)
          MNUtil.log(`  - 父任务状态: ${parentParts.status}`)
          MNUtil.log(`  - 父任务内容: ${parentParts.content}`)
          
          // 检查是否需要自动推断类型
          if (!taskType && parentParts.type === '动作' && !isFocusTaskCard) {
            // 父卡片是动作类型，子卡片不是任务卡片，自动设置子卡片为动作类型
            MNUtil.log(`🎯 自动推断：父卡片是动作类型，子卡片设为动作类型，父卡片将转为项目类型`)
            taskType = '动作'
            shouldTransformParentToProject = true
          }
        }
      } else {
        MNUtil.log(`👪 没有父卡片`)
      }
      
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
      MNUtil.log(`✅ 是否已经是任务格式: ${isAlreadyTask ? '是' : '否'}`)
      
      if (isAlreadyTask) {
        // 已经是任务格式，只需要添加字段
        MNUtil.log(`📋 已是任务格式，开始添加/更新字段`)
        
        // 解析任务标题获取当前状态
        const titleParts = this.parseTaskTitle(noteToConvert.noteTitle)
        const currentStatus = titleParts.status
        MNUtil.log(`📊 当前任务状态: ${currentStatus}`)
        
        // 检查是否缺少所属字段
        const parsed = this.parseTaskComments(noteToConvert)
        MNUtil.log(`🔍 当前卡片字段情况:`)
        MNUtil.log(`  - 信息字段: ${parsed.info ? '有' : '无'}`)
        MNUtil.log(`  - 所属字段: ${parsed.belongsTo ? '有' : '无'}`)
        MNUtil.log(`  - 进展字段: ${parsed.progress ? '有' : '无'}`)
        
        // 记录是否有实际改动
        let hasChanges = false
        
        MNUtil.undoGrouping(() => {
          // 根据当前状态设置对应的颜色
          let newColorIndex = 12  // 默认白色
          switch (currentStatus) {
            case "已完成":
              newColorIndex = 1  // 绿色
              break
            case "进行中":
              newColorIndex = 3  // 粉色
              break
            case "暂停":
              newColorIndex = 8  // 蓝色
              break
            case "未开始":
              newColorIndex = 12  // 白色
              break
            case "已归档":
              newColorIndex = 13  // 灰色
              break
          }
          
          // 只有颜色不同时才更新
          if (noteToConvert.colorIndex !== newColorIndex) {
            MNUtil.log(`🎨 更新颜色: ${noteToConvert.colorIndex} → ${newColorIndex}`)
            noteToConvert.colorIndex = newColorIndex
            hasChanges = true
          }
          
          // 先清理失效链接
          MNUtil.log(`🧹 开始清理失效链接...`)
          const removedLinksCount = this.cleanupBrokenLinks(noteToConvert)
          if (removedLinksCount > 0) {
            MNUtil.log(`✅ 清理了 ${removedLinksCount} 个失效链接`)
            hasChanges = true
          } else {
            MNUtil.log(`✅ 没有发现失效链接`)
          }
          
          // 记录字段添加前的评论数量
          const beforeFieldCount = noteToConvert.MNComments.length
          
          // 添加任务字段（信息字段和状态字段）
          MNUtil.log(`📝 调用 addTaskFieldsWithStatus`)
          this.addTaskFieldsWithStatus(noteToConvert)
          
          // 检查和补充缺失的字段（如进展字段等）
          MNUtil.log(`🔄 检查是否需要升级旧任务卡片...`)
          if (this.upgradeOldTaskCard(noteToConvert)) {
            MNUtil.log(`✅ 补充了缺失的字段`)
            hasChanges = true
          }
          
          // 检查是否有新字段被添加
          if (noteToConvert.MNComments.length > beforeFieldCount) {
            MNUtil.log(`📝 添加了 ${noteToConvert.MNComments.length - beforeFieldCount} 个新字段`)
            hasChanges = true
          }
          
          // 执行链接操作（处理所属字段和父子链接）
          if (parentNote && this.isTaskCard(parentNote)) {
            MNUtil.log(`🔗 父卡片是任务卡片，执行链接操作`)
            MNUtil.log(`  - 当前是否有所属字段: ${parsed.belongsTo ? '有' : '无'}`)
            MNUtil.log(`  - 父卡片标题: ${parentNote.noteTitle}`)
            MNUtil.log(`  - 子卡片标题: ${noteToConvert.noteTitle}`)
            MNUtil.log(`  🔗 调用 linkParentTask...`)
            this.linkParentTask(noteToConvert, parentNote)
            MNUtil.log(`  ✅ linkParentTask 调用完成`)
            // linkParentTask 可能会添加所属字段或移动链接，都算是改动
            if (!parsed.belongsTo || parentNote) {
              hasChanges = true
            }
          } else {
            MNUtil.log(`⚠️ 父卡片不存在或不是任务卡片，跳过链接操作`)
            if (parentNote) {
              MNUtil.log(`  - 父卡片存在但不是任务卡片`)
              MNUtil.log(`  - 父卡片标题: ${parentNote.noteTitle}`)
            } else {
              MNUtil.log(`  - 没有父卡片`)
            }
          }
        })
        
        // 根据是否有实际改动返回不同的结果
        if (hasChanges) {
          MNUtil.log(`✅ 任务卡片有更新`)
          return {
            type: 'upgraded',
            noteId: noteToConvert.noteId,
            title: noteToConvert.noteTitle
          }
        } else {
          MNUtil.log(`⏭️ 任务卡片无需更新`)
          return {
            type: 'skipped',
            noteId: noteToConvert.noteId,
            title: noteToConvert.noteTitle,
            reason: '已是最新版本任务卡片'
          }
        }
      } else {
        // 不是任务格式，需要选择类型并转换
        let selectedType = taskType
        
        // 如果没有指定类型，则显示选择对话框
        if (!selectedType) {
          const taskTypes = ["目标", "关键结果", "项目", "动作"]
          const selectedIndex = await MNUtil.userSelect("选择任务类型", "", taskTypes)
          
          if (selectedIndex === 0) {
            return {
              type: 'skipped',
              noteId: focusNote.noteId,
              title: focusNote.noteTitle,
              reason: '用户取消'
            }
          }
          
          selectedType = taskTypes[selectedIndex - 1]
        }
        
        MNUtil.log(`📋 新建任务卡片，类型: ${selectedType}`)
        MNUtil.undoGrouping(() => {
          // 构建任务路径
          const path = this.buildTaskPath(noteToConvert)
          MNUtil.log(`📍 任务路径: ${path || '无'}`)
          
          // 构建新标题
          const content = noteToConvert.noteTitle || "未命名任务"
          const newTitle = path ? 
            safeSpacing(`【${selectedType} >> ${path}｜未开始】${content}`) :
            safeSpacing(`【${selectedType}｜未开始】${content}`)
          
          MNUtil.log(`✏️ 新标题: ${newTitle}`)
          noteToConvert.noteTitle = newTitle
          
          // 设置颜色（白色=未开始）
          noteToConvert.colorIndex = 12
          
          // 添加任务字段（信息字段和状态字段）
          MNUtil.log(`📝 调用 addTaskFieldsWithStatus`)
          this.addTaskFieldsWithStatus(noteToConvert)
        })
        
        // 如果需要将父卡片从动作转为项目，先进行转换
        if (shouldTransformParentToProject) {
          MNUtil.log(`\n🔄 === 开始转换父卡片类型 ===`)
          const transformResult = this.transformActionToProject(parentNote)
          if (transformResult) {
            MNUtil.log(`✅ 父卡片已成功从动作转换为项目类型`)
          } else {
            MNUtil.log(`❌ 父卡片转换失败`)
          }
        }
        
        MNUtil.undoGrouping(() => {
          // 执行链接操作（处理所属字段和父子链接）
          if (parentNote && this.isTaskCard(parentNote)) {
            MNUtil.log(`🔗 父卡片是任务卡片，执行链接操作`)
            MNUtil.log(`  - 父卡片标题: ${parentNote.noteTitle}`)
            MNUtil.log(`  - 子卡片标题: ${noteToConvert.noteTitle}`)
            MNUtil.log(`  🔗 调用 linkParentTask...`)
            this.linkParentTask(noteToConvert, parentNote)
            MNUtil.log(`  ✅ linkParentTask 调用完成`)
          } else {
            MNUtil.log(`⚠️ 父卡片不存在或不是任务卡片，跳过链接操作`)
            if (parentNote) {
              MNUtil.log(`  - 父卡片存在但不是任务卡片`)
              MNUtil.log(`  - 父卡片标题: ${parentNote.noteTitle}`)
            } else {
              MNUtil.log(`  - 没有父卡片`)
            }
          }
        })
        
        return {
          type: 'created',
          noteId: noteToConvert.noteId,
          title: noteToConvert.noteTitle
        }
      }
    } catch (error) {
      MNUtil.log(`❌ 转换任务卡片失败: ${error.message || error}`)
      return {
        type: 'failed',
        noteId: focusNote.noteId,
        title: focusNote.noteTitle,
        error: error.message || error
      }
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
  // addTaskFields 方法已废弃，请直接使用 addTaskFieldsWithStatus
  
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
      const newIndex = note.MNComments.length - 1
      MNUtil.log("✅ 添加信息字段，索引：" + newIndex)
      
      // Debug: Check what was actually stored
      if (note.MNComments[newIndex]) {
        const storedComment = note.MNComments[newIndex]
        MNUtil.log("🔍 DEBUG - Stored comment check:")
        MNUtil.log(`  - Comment type: ${storedComment.type}`)
        MNUtil.log(`  - Comment text: "${storedComment.text}"`)
        MNUtil.log(`  - Text length: ${storedComment.text ? storedComment.text.length : 0}`)
      }
      
      // 如果是"动作"类型，添加信息字段和默认启动字段
      if (taskType === "动作") {
        MNUtil.log("🎯 动作类型任务，添加信息字段、启动字段和进展字段")
        
        // 添加默认启动字段
        const defaultLaunchLink = "marginnote4app://uistatus/H4sIAAAAAAAAE5VSy5LbIBD8F87SFuIp%2BWbJ5VxyyCG3VCqF0LBmg4VKoM06W%2F73AHbiveY2j56mp5l3NHr%2F8zxxtEOGgNbYMNNJGGmHJWAsmRg7wRQIojpDZQtEj5ibpm0apeRI5ahBcKEx4agqZGFxNqIdzlmM%2Fjx5jXZGuQAV0mqdRv9WujmG6Q7Vzv%2BGB8zPEeYYSivNO3WB1U5JI2MDYw0b6l4OtGb7o6h72rY1wU2Hh33Ph%2BMh6YC3ND%2Bd%2FQSFwlgHNzLjvIpntdwSr7cw%2BwiFuj%2F27ND2pO4IYTXjvajbLqf4yEk74D2lXaI2m3MfV0pkn71W0foZ7d6RNyZAzNGPl%2BDnV%2BU2%2BHpZkg40fPri7RwTRzbgibWSck6YbEUjGO1khS6lzgWThLNUo7jlmF8rFLRyeZUnIiiTVGDcsK5JGHEtCgI4F9Kr375XyC%2Bw3uXgD5kfX26FLTo7P7xe1DMkf1O5tBc1gysTRUv6f960mLKOcdJgUqEVAqhVnwp6hVcLv26hfT7dnL0T32D5Iko%2F2AlGtT7a%2BUzsbHz2SvstGbNr0jZRjeFkpwnmf9B4gnM28ABGbS4bGP1i9f8cRJb59zCvfwCp6rmF9QIAAA%3D%3D";
        const launchLink = `[启动](${defaultLaunchLink})`;
        const launchFieldHtml = TaskFieldUtils.createFieldHtml(launchLink, 'subField');
        MNUtil.log("📝 启动字段HTML: " + launchFieldHtml)
        note.appendMarkdownComment(launchFieldHtml)
        MNUtil.log("✅ 添加启动字段，索引：" + (note.MNComments.length - 1))
        
        // 添加主字段"进展"
        const progressFieldHtml = TaskFieldUtils.createFieldHtml('进展', 'mainField')
        MNUtil.log("📝 进展字段HTML: " + progressFieldHtml)
        note.appendMarkdownComment(progressFieldHtml)
        MNUtil.log("✅ 添加进展字段，索引：" + (note.MNComments.length - 1))
        
        MNUtil.log("🎯 任务字段添加完成，总评论数：" + note.MNComments.length)
        return
      }
      
      // 其他类型（目标、关键结果、项目）继续添加剩余字段
      
      // 注意：所属字段由 linkParentTask 方法动态添加，不在这里创建
      // 注意：启动字段通过 addLaunchField 方法添加，不在这里创建
      
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
      
      // 添加主字段"进展"
      const progressFieldHtml = TaskFieldUtils.createFieldHtml('进展', 'mainField')
      MNUtil.log("📝 进展字段HTML: " + progressFieldHtml)
      note.appendMarkdownComment(progressFieldHtml)
      MNUtil.log("✅ 添加进展字段，索引：" + (note.MNComments.length - 1))
      
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
   * 检查任务卡片是否有"进展"字段
   * @param {MNNote} note - 要检查的任务卡片
   * @returns {boolean} 是否有进展字段
   */
  static hasProgressField(note) {
    if (!note || !note.MNComments) return false
    
    // 检查是否有"进展"主字段
    const comments = note.MNComments
    for (let comment of comments) {
      if (comment) {
        const text = comment.text || ''
        // 检查是否包含主字段"进展"
        if (TaskFieldUtils.isTaskField(text) && text.includes('id="mainField"') && text.includes('>进展</span>')) {
          return true
        }
      }
    }
    
    return false
  }

  /**
   * 升级旧任务卡片，添加缺失的"进展"字段
   * @param {MNNote} note - 要升级的任务卡片
   * @returns {boolean} 是否成功升级
   */
  static upgradeOldTaskCard(note) {
    if (!note || !note.MNComments) return false
    
    // 解析任务类型
    const titleParts = this.parseTaskTitle(note.noteTitle)
    const taskType = titleParts.type
    
    // 检查是否已有"进展"字段
    const comments = note.MNComments
    let hasProgressField = false
    let lastMainFieldIndex = -1
    let lastStateFieldIndex = -1
    
    MNUtil.log(`🔍 开始检查任务卡片是否需要升级: ${note.noteTitle}`)
    MNUtil.log(`📝 评论总数: ${comments.length}`)
    
    for (let i = 0; i < comments.length; i++) {
      const comment = comments[i]
      if (comment) {
        const text = comment.text || ''
        if (TaskFieldUtils.isTaskField(text)) {
          // 更精确的检测：必须是主字段格式且包含">进展</span>"
          if (text.includes('id="mainField"') && text.includes('>进展</span>')) {
            MNUtil.log(`✅ 检测到进展字段，位置: ${i}`)
            hasProgressField = true
            break
          }
          // 记录最后一个主字段的位置
          if (text.includes('id="mainField"')) {
            lastMainFieldIndex = i
          }
          // 记录最后一个状态字段的位置
          if (text.includes('id="stateField"')) {
            lastStateFieldIndex = i
          }
        }
      }
    }
    
    // 如果已有"进展"字段，无需升级
    if (hasProgressField) {
      // MNUtil.log("📌 卡片已有进展字段，无需升级")
      return false
    }
    
    // MNUtil.log("📊 旧卡片检测：缺少进展字段，开始升级")
    
    MNUtil.undoGrouping(() => {
      // 添加"进展"主字段
      const progressFieldHtml = TaskFieldUtils.createFieldHtml('进展', 'mainField')
      
      // 先追加到末尾
      MNUtil.log("📝 追加进展字段到末尾")
      note.appendMarkdownComment(progressFieldHtml)

      // 刷新卡片以确保界面更新
      note.refresh()
      // MNUtil.log("✅ 旧卡片升级完成，已添加进展字段")
    })
    
    return true
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
      info: null,           // 信息字段
      contains: null,       // 包含字段
      progress: null,       // 进展字段
      launch: null,         // 启动字段
      description: '',      // 描述（从纯文本评论中提取）
      otherComments: [],    // 其他评论
      plainTextComments: [], // 纯文本评论（用于提取描述）
      fields: [],           // 统一的字段数组（用于数据提取）
      
      // 扩展字段 - 日期和时间相关
      todayMarker: null,        // 📅 今日 字段
      dueDateField: null,       // 📅 截止日期 字段
      overdueMarker: null,      // ⚠️ 过期 字段
      scheduledTime: null,      // ⏰ 计划时间 字段
      
      // 扩展字段 - 优先级和状态
      priorityField: null,      // 🔥 优先级 字段
      progressField: null,      // 📊 进度 字段
      taskLogField: null,       // 📝 任务记录 字段
      
      // 扩展字段 - 任务分类
      preconditions: null,      // 前置条件 字段
      dependencies: null,       // 依赖关系 字段
      resources: null,          // 资源 字段
      notes: null,              // 备注 字段
      
      // 扩展字段 - 项目管理
      milestone: null,          // 里程碑 字段
      deliverables: null,       // 交付物 字段
      stakeholders: null,       // 利益相关者 字段
      risks: null,              // 风险 字段
      
      // 扩展字段 - 学习和知识管理
      concepts: null,           // 概念 字段
      references: null,         // 参考资料 字段
      examples: null,           // 示例 字段
      questions: null,          // 问题 字段
      
      // 扩展字段 - 自定义标签
      tags: null,               // 标签 字段
      category: null,           // 分类 字段
      
      // 扩展字段 - 特殊字段识别
      customFields: [],         // 其他自定义字段的集合
      
      // 进展记录管理
      progressRecords: []       // 进展记录列表，包含 {id, commentIndex, timestamp, content}
    }
    
    if (!note || !note.MNComments) return result
    
    let comments = []
    try {
      comments = note.MNComments || []
    } catch (e) {
      MNUtil.log("⚠️ 获取 MNComments 失败: " + e.message)
      return result
    }
    
    // 注释掉详细日志
    // MNUtil.log("📋 总评论数：" + comments.length)
    
    comments.forEach((comment, index) => {
      if (!comment) return
      
      let text = ''
      let commentType = ''
      
      try {
        text = comment.text || ''
        commentType = comment.type || ''
      } catch (e) {
        // 保留错误日志
        MNUtil.log(`⚠️ 评论 ${index} 属性访问失败: ` + e.message)
        return
      }
    
      
      // 检查是否是任务字段（MNComment 对象的 type 已经是处理后的类型）
      if ((commentType === 'textComment' || commentType === 'markdownComment') && TaskFieldUtils.isTaskField(text)) {
        const fieldType = TaskFieldUtils.getFieldType(text)
        // 注意：extractFieldText 实际上提取的是 <span> 标签内的文本，这是字段名
        const fieldName = TaskFieldUtils.extractFieldText(text)
        
        result.taskFields.push({
          index: index,
          text: text,
          fieldType: fieldType,
          content: fieldName,  // 存储字段名
          isMainField: fieldType === 'mainField',
          isStatusField: fieldType === 'stateField',
          isSubField: fieldType === 'subField',
        })
        
        // 记录特定字段
        if (fieldName === '所属') {
          result.belongsTo = {
            index: index,
            text: text,
            comment: comment
          }
        } else if (fieldName === '信息') {
          result.info = {
            index: index,
            text: text,
            comment: comment
          }
        } else if (fieldName === '包含') {
          result.contains = {
            index: index,
            text: text,
            comment: comment
          }
        } else if (fieldName === '进展') {
          result.progress = {
            index: index,
            text: text,
            comment: comment
          }
        } else if (fieldName === '启动' || fieldName.includes('[启动]')) {
          result.launch = {
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
        
        // 如果是纯文本评论，添加到 plainTextComments
        if ((commentType === 'textComment' || commentType === 'markdownComment') && text && !TaskFieldUtils.isTaskField(text)) {
          result.plainTextComments.push({
            index: index,
            text: text,
            comment: comment
          })
        }
      }
    })
    
    // 构建统一的 fields 数组，用于数据提取
    let currentFieldName = null
    let inProgressSection = false
    
    comments.forEach((comment, index) => {
      if (!comment) return
      
      const text = comment.text || ''
      const commentType = comment.type || ''
      
      // 处理任务字段
      if (TaskFieldUtils.isTaskField(text)) {
        const fieldName = TaskFieldUtils.extractFieldText(text)
        currentFieldName = fieldName
        
        // 如果是"进展"字段，标记开始进展部分
        if (fieldName === '进展') {
          inProgressSection = true
        } else {
          inProgressSection = false
        }
        
        result.fields.push({
          type: 'field',
          name: fieldName,
          value: null,
          index: index
        })
      }
      // 处理所属字段的值（紧跟在"所属"字段后的评论）
      else if (currentFieldName === '所属' && index > 0 && 
               result.fields.length > 0 && 
               result.fields[result.fields.length - 1].name === '所属') {
        // 尝试从整个评论文本中提取链接
        const linkMatch = text.match(/\[([^\]]+)\]\(([^)]+)\)/)
        if (linkMatch) {
          result.fields[result.fields.length - 1].value = linkMatch[0]
        }
      }
      // 处理启动字段的值
      else if (text.includes('[启动]')) {
        const linkMatch = text.match(/\[启动\]\(([^)]+)\)/)
        if (linkMatch) {
          // 更新启动字段或创建新的
          const launchField = result.fields.find(f => f.name === '启动')
          if (launchField) {
            launchField.value = linkMatch[0]
          } else {
            result.fields.push({
              type: 'field',
              name: '[启动]',  // 保持原始格式
              value: linkMatch[0],
              index: index
            })
          }
        }
      }
      // 处理进展部分的内容
      else if (inProgressSection && (commentType === 'textComment' || commentType === 'markdownComment')) {
        result.fields.push({
          type: 'plainText',
          text: text,
          index: index
        })
      }
      // 处理普通纯文本评论
      else if ((commentType === 'textComment' || commentType === 'markdownComment') && !TaskFieldUtils.isTaskField(text)) {
        result.fields.push({
          type: 'plainText',
          text: text,
          index: index
        })
      }
    })
    
    // 解析进展记录ID和相关信息
    comments.forEach((comment, index) => {
      if (!comment) return
      
      const text = comment.text || ''
      const commentType = comment.type || ''
      
      // 检查是否是带有 data-progress-id 的进展记录
      if ((commentType === 'textComment' || commentType === 'markdownComment')) {
        const progressIdMatch = text.match(/data-progress-id="([^"]+)"/)
        if (progressIdMatch) {
          const progressId = progressIdMatch[1]
          
          // 提取时间戳
          const timestampMatch = text.match(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/)
          const timestamp = timestampMatch ? timestampMatch[1] : null
          
          // 提取内容（去除HTML标签后的部分）
          const contentMatch = text.match(/<\/div>\s*(.+)$/s)
          const content = contentMatch ? contentMatch[1].trim() : ''
          
          result.progressRecords.push({
            id: progressId,
            commentIndex: index,
            timestamp: timestamp,
            content: content
          })
        }
        // 处理旧格式的进展记录（没有ID的），为其生成临时ID
        else if (text.match(/^\s*<div[^>]*style="[^"]*position:\s*relative[^"]*padding-left:\s*28px/)) {
          // 这是旧格式的进展记录，生成临时ID
          const timestampMatch = text.match(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/)
          if (timestampMatch) {
            const timestamp = timestampMatch[1]
            const timestampForId = timestamp.replace(/[- :]/g, '')
            const tempId = `legacy_progress_${timestampForId}_${index}`
            
            const contentMatch = text.match(/<\/div>\s*(.+)$/s)
            const content = contentMatch ? contentMatch[1].trim() : ''
            
            result.progressRecords.push({
              id: tempId,
              commentIndex: index,
              timestamp: timestamp,
              content: content,
              isLegacy: true  // 标记为旧格式记录
            })
          }
        }
      }
    })
    
    // 按时间戳排序进展记录（最新的在前）
    result.progressRecords.sort((a, b) => {
      if (!a.timestamp || !b.timestamp) return 0
      return new Date(b.timestamp) - new Date(a.timestamp)
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
      MNUtil.log(`🔍 检查字段：content="${field.content}", fieldType="${field.fieldType}", 目标="${fieldText}"`)
      if (field.content && field.content.includes(fieldText)) {
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
      const statusFields = ['未开始', '进行中', '已完成', '已归档']
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
      
      // 1. 检查父任务中是否已有指向子任务的链接
      const parentParsed = this.parseTaskComments(parent)
      let existingLinkIndex = -1
      
      for (let link of parentParsed.links) {
        if (link.linkedNoteId === note.noteId) {
          existingLinkIndex = link.index
          MNUtil.log(`📎 发现已有链接，索引：${existingLinkIndex}`)
          break
        }
      }
      
      // 2. 根据情况创建或使用现有链接
      let linkIndexInParent
      if (existingLinkIndex !== -1) {
        // 已有链接，使用现有链接索引
        linkIndexInParent = existingLinkIndex
        MNUtil.log(`📎 使用现有链接，索引：${linkIndexInParent}`)
      } else {
        // 没有链接，创建新链接
        parent.appendNoteLink(note, "To")
        linkIndexInParent = parent.MNComments.length - 1
        MNUtil.log(`📎 创建新链接，索引：${linkIndexInParent}`)
      }
      
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
        this.moveCommentToField(parent, linkIndexInParent, status, false)
      }
      
      // 5. 在子任务中更新所属字段（这已经包含了父任务的链接）
      // 构建所属字段内容
      const parentParts = this.parseTaskTitle(parent.noteTitle)
      const belongsToText = TaskFieldUtils.createBelongsToField(parentParts.content, parent.noteURL)
      
      // 检查是否已有所属字段
      const parsed = this.parseTaskComments(note)
      MNUtil.log("🔍 解析的任务字段：" + JSON.stringify(parsed.taskFields.map(f => ({content: f.content, index: f.index, fieldType: f.fieldType}))))
      MNUtil.log("🔍 是否已有所属字段：" + (parsed.belongsTo ? "是" : "否"))
      MNUtil.log("🔍 是否有信息字段：" + (parsed.info ? "是" : "否"))
      
      if (!parsed.belongsTo) {
        MNUtil.log("📝 准备创建所属字段...")
        
        // 优先使用 parsed.info
        let infoFieldIndex = -1
        if (parsed.info) {
          infoFieldIndex = parsed.info.index
          MNUtil.log("✅ 通过 parsed.info 找到信息字段，索引：" + infoFieldIndex)
        } else {
          // 备用方案：遍历查找
          for (let i = 0; i < parsed.taskFields.length; i++) {
            MNUtil.log(`🔍 检查字段 ${i}：content="${parsed.taskFields[i].content}", fieldType="${parsed.taskFields[i].fieldType}"`)
            if (parsed.taskFields[i].content === '信息') {
              infoFieldIndex = parsed.taskFields[i].index
              MNUtil.log("✅ 通过遍历找到信息字段，索引：" + infoFieldIndex)
              break
            }
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
  static async updateTaskStatus(note, newStatus, skipParentUpdate = false) {
    // 首先检查是否有绑定的任务卡片
    if (!this.isTaskCard(note)) {
      // 不是任务卡片，检查是否有绑定的任务
      const bindedResult = await this.applyStatusToBindedCard(note, newStatus)
      if (bindedResult) {
        return bindedResult
      }
      return
    }
    
    const titleParts = this.parseTaskTitle(note.noteTitle)
    const oldStatus = titleParts.status
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
      case "暂停":
        colorIndex = 8  // 蓝色
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
      
      // 自动记录进展
      if (oldStatus !== newStatus) {
        let progressContent = ''
        const taskContent = titleParts.content
        
        // 根据状态变化生成记录内容
        if (oldStatus === '未开始' && newStatus === '进行中') {
          progressContent = `开始「${taskContent}」`
        } else if (oldStatus === '进行中' && newStatus === '已完成') {
          progressContent = `完成「${taskContent}」`
        } else if (oldStatus === '已完成' && newStatus === '进行中') {
          progressContent = `重新进行「${taskContent}」`
        } else if (oldStatus === '进行中' && newStatus === '暂停') {
          progressContent = `暂停「${taskContent}」`
        } else if (oldStatus === '暂停' && newStatus === '进行中') {
          progressContent = `继续「${taskContent}」`
        } else if (newStatus === '已归档') {
          progressContent = `归档「${taskContent}」`
        } else {
          progressContent = `「${taskContent}」状态变更：${oldStatus} → ${newStatus}`
        }
        
        // 添加进展记录
        this.addProgressRecord(note, progressContent)
      }
      
      // 如果有父任务，更新父任务中链接的位置和进展记录
      const parent = note.parentNote
      if (parent && this.isTaskCard(parent)) {
        MNUtil.log(`🔄 更新父任务中的链接位置: ${parent.noteTitle}`)
        
        // 确保父任务有任务字段
        if (!this.hasTaskFields(parent)) {
          MNUtil.log("⚠️ 父任务缺少任务字段，先添加")
          this.addTaskFieldsWithStatus(parent)
        }
        
        // 向父任务添加进展记录
        if (oldStatus !== newStatus) {
          // 构建进展内容，使用「名称」格式
          const childTitle = titleParts.content
          const childLink = `「${childTitle}」`
          let parentProgressContent = ''
          
          // 根据状态变化生成进展记录
          if (oldStatus === '未开始' && newStatus === '进行中') {
            parentProgressContent = `开始${childLink}`
          } else if (oldStatus === '进行中' && newStatus === '已完成') {
            parentProgressContent = `完成${childLink}`
          } else if (oldStatus === '已完成' && newStatus === '进行中') {
            parentProgressContent = `重新进行${childLink}`
          } else if (newStatus === '已归档') {
            parentProgressContent = `归档${childLink}`
          } else {
            parentProgressContent = `${childLink}状态变更：${oldStatus} → ${newStatus}`
          }
          
          // 检查父任务是否有"进展"字段
          const hasProgressField = this.hasProgressField(parent)
          if (!hasProgressField) {
            MNUtil.log("⚠️ 父任务缺少进展字段，先添加")
            // 添加进展字段
            const progressFieldHtml = TaskFieldUtils.createFieldHtml('进展', 'mainField')
            parent.appendMarkdownComment(progressFieldHtml)
          }
          
          // 添加进展记录到父任务
          this.addProgressRecord(parent, parentProgressContent)
          MNUtil.log(`✅ 已向父任务添加进展记录: ${parentProgressContent}`)
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

    note.refresh()
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
      // "已完成"和"已归档"都视为完成状态
      if (titleParts.status !== "已完成" && titleParts.status !== "已归档") {
        MNUtil.log(`📋 发现未完成的子任务：${childTask.noteTitle}`)
        return false
      }
    }
    
    MNUtil.log("✅ 所有子任务已完成，可以自动完成父任务")
    return true
  }
  
  /**
   * 检查是否有活跃（未完成）的子任务
   * @param {MNNote} parentNote - 父任务笔记
   * @returns {boolean} 是否有活跃的子任务
   */
  static hasActiveChildTasks(parentNote) {
    if (!parentNote || !this.isTaskCard(parentNote)) return false
    
    // 获取所有子任务
    const childTasks = this.getChildTaskNotes(parentNote)
    
    // 检查是否有"未开始"或"进行中"的子任务
    for (let childTask of childTasks) {
      const titleParts = this.parseTaskTitle(childTask.noteTitle)
      if (titleParts.status === "未开始" || titleParts.status === "进行中") {
        MNUtil.log(`📋 发现活跃的子任务：${childTask.noteTitle}`)
        return true
      }
    }
    
    return false
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
    // 但需要检查是否还有其他活跃的子任务
    else if (parentTitleParts.status === "已完成" && childNewStatus !== "已完成" && childNewStatus !== "已归档") {
      // 如果子任务变为"已归档"，不需要改变父任务状态
      // 只有当子任务变为"未开始"或"进行中"时，才需要检查
      if (this.hasActiveChildTasks(parentNote)) {
        MNUtil.log(`📋 存在活跃子任务，更新父任务为进行中`)
        this.updateTaskStatus(parentNote, "进行中", true)  // 跳过父任务更新避免循环
        
        // 递归向上更新
        this.updateParentStatus(parentNote, "进行中")
      } else {
        MNUtil.log(`📋 没有活跃子任务，保持父任务为已完成`)
      }
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
   * 标记/取消标记任务日期
   * @param {MNNote} note - 要标记的任务卡片
   * @param {boolean|string} dateOrRemove - 日期字符串(YYYY-MM-DD)或false表示移除
   * @returns {boolean} 操作是否成功
   */
  static markWithDate(note, dateOrRemove = null) {
    // 保持向后兼容
    if (dateOrRemove === true) {
      const today = new Date()
      dateOrRemove = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    }
    
    const isToday = dateOrRemove !== false && dateOrRemove !== null
    if (!this.isTaskCard(note)) {
      MNUtil.showHUD("请选择一个任务卡片")
      return false
    }
    
    const parsed = this.parseTaskComments(note)
    
    // 查找是否已有日期标记
    let dateFieldIndex = -1
    // 查找是否有过期标记
    let overdueFieldIndex = -1
    
    for (let field of parsed.taskFields) {
      if (field.content.includes('📅')) {
        dateFieldIndex = field.index
      } else if (field.content.includes('⚠️ 过期')) {
        overdueFieldIndex = field.index
      }
    }
    
    MNUtil.undoGrouping(() => {
      if (isToday && dateFieldIndex === -1) {
        // 如果要添加日期标记，先移除过期标记（如果有）
        if (overdueFieldIndex >= 0) {
          note.removeCommentByIndex(overdueFieldIndex)
          MNUtil.log("✅ 移除过期标记")
          // 移除后需要重新计算索引，因为删除操作会改变后续索引
          overdueFieldIndex = -1
        }
        
        // 添加日期标记
        const dateFieldHtml = TaskFieldUtils.createFieldHtml(`📅 日期: ${dateOrRemove}`, 'subField')
        note.appendMarkdownComment(dateFieldHtml)
        // 移动到信息字段下
        this.moveCommentToField(note, note.MNComments.length - 1, '信息', false)
        MNUtil.log(`✅ 添加日期标记: ${dateOrRemove}`)
      } else if (!isToday && dateFieldIndex >= 0) {
        // 移除日期标记
        note.removeCommentByIndex(dateFieldIndex)
        MNUtil.log("✅ 移除日期标记")
      } else if (isToday && dateFieldIndex >= 0) {
        // 如果已经有日期标记，更新日期
        note.removeCommentByIndex(dateFieldIndex)
        const dateFieldHtml = TaskFieldUtils.createFieldHtml(`📅 日期: ${dateOrRemove}`, 'subField')
        note.appendMarkdownComment(dateFieldHtml)
        // 移动到信息字段下
        this.moveCommentToField(note, note.MNComments.length - 1, '信息', false)
        MNUtil.log(`✅ 更新日期标记: ${dateOrRemove}`)
      }
    })
    
    return true
  }
  
  /**
   * 标记/取消标记为今日任务（向后兼容方法）
   * @param {MNNote} note - 要标记的任务卡片
   * @param {boolean} isToday - true 标记为今日，false 取消标记
   * @returns {boolean} 操作是否成功
   */
  static markAsToday(note, isToday = true) {
    if (isToday) {
      const today = new Date()
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
      return this.markWithDate(note, todayStr)
    } else {
      return this.markWithDate(note, false)
    }
  }
  
  /**
   * 检查任务是否标记为今日
   * @param {MNNote} note - 要检查的任务卡片
   * @returns {boolean} 是否为今日任务
   */
  static isToday(note) {
    if (!this.isTaskCard(note)) return false
    
    const today = new Date()
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    
    const comments = note.MNComments || []
    for (let comment of comments) {
      if (comment && comment.text) {
        const text = comment.text
        // 检查纯文本格式
        if (text.includes('📅')) {
          // 提取日期
          const dateMatch = text.match(/(\d{4}-\d{2}-\d{2})/)
          if (dateMatch && dateMatch[1] === todayStr) {
            return true
          }
        }
        // 检查 HTML 格式（去除 HTML 标签后检查）
        const cleanText = text.replace(/<[^>]*>/g, '')
        if (cleanText.includes('📅')) {
          const dateMatch = cleanText.match(/(\d{4}-\d{2}-\d{2})/)
          if (dateMatch && dateMatch[1] === todayStr) {
            return true
          }
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
    
    // 只在非静默模式下输出日志
    if (!filterConfig.silent && typeof MNUtil !== 'undefined' && MNUtil.log) {
      MNUtil.log(`🔍 开始筛选今日任务，看板: ${filterConfig.boardKeys.join(', ')}`)
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
        // 注释掉详细日志
        // if (typeof MNUtil !== 'undefined' && MNUtil.log && isToday) {
        //   MNUtil.log("✅ 发现今日任务：" + task.noteTitle)
        // }
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
  // sortTodayTasks 方法已废弃，请直接使用 TaskFilterEngine.sort
  
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
      grouped[key] = TaskFilterEngine.sort(grouped[key], {
        strategy: 'smart',
        weights: {
          priority: 0.4,      // 优先级权重更高
          urgency: 0.3,       // 紧急度次之
          importance: 0.2,    // 重要性
          progress: 0.1       // 进度
        }
      })
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
   * 从看板中筛选任务卡片
   * @param {MNNote} boardNote - 看板笔记
   * @param {Object} options - 筛选选项
   * @param {Array<string>} options.statuses - 要筛选的状态列表
   * @returns {Array<MNNote>} 符合条件的任务卡片列表
   */
  static filterTasksFromBoard(boardNote, options = {}) {
    const { statuses = [] } = options
    
    // 获取看板中的所有任务卡片
    const allTasks = this.getAllTaskCardsFromBoard(boardNote)
    
    // 如果没有指定状态筛选，返回所有任务
    if (statuses.length === 0) {
      return allTasks
    }
    
    // 筛选符合状态的任务
    return allTasks.filter(task => {
      const titleParts = this.parseTaskTitle(task.noteTitle)
      return statuses.includes(titleParts.status)
    })
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

  /**
   * 获取任务信息（兼容旧代码）
   * @param {MNNote} task - 任务卡片
   * @returns {Object} 任务信息对象
   */
  static getTaskInfo(task) {
    if (!task) return null;
    
    // 解析任务标题
    const titleParts = this.parseTaskTitle(task.noteTitle || '');
    
    // 解析任务字段
    const parsed = MNTaskManager.parseTaskComments(task);
    
    // 构建任务信息对象
    const taskInfo = {
      // 基本信息
      content: titleParts.content || task.noteTitle || '',
      type: titleParts.type || '动作',
      status: titleParts.status || '未开始',
      path: titleParts.path || '',
      
      // 优先级
      priority: '低',
      
      // 日期信息
      scheduledDate: null,
      
      // 任务字段
      taskFields: []
    };
    
    // 解析字段信息
    if (parsed && parsed.taskFields) {
      parsed.taskFields.forEach(field => {
        // 提取优先级
        if (field.content.includes('优先级')) {
          if (field.content.includes('🔴') || field.content.includes('高')) {
            taskInfo.priority = '高';
          } else if (field.content.includes('🟡') || field.content.includes('中')) {
            taskInfo.priority = '中';
          } else if (field.content.includes('🟢') || field.content.includes('低')) {
            taskInfo.priority = '低';
          }
        }
        
        // 提取日期
        if (field.content.includes('📅') || field.content.includes('日期')) {
          const dateMatch = field.content.match(/\d{4}-\d{2}-\d{2}/);
          if (dateMatch) {
            taskInfo.scheduledDate = dateMatch[0];
          }
        }
        
        // 添加到字段列表
        taskInfo.taskFields.push({
          fieldName: field.fieldName || field.content.split(':')[0].trim(),
          content: field.content,
          index: field.index,
          isMainField: field.isMainField
        });
      });
    }
    
    // 添加评论中的其他字段
    if (task.comments) {
      task.comments.forEach((comment, index) => {
        // 跳过已经解析的任务字段
        const isTaskField = TaskFieldUtils.isTaskField(comment);
        if (!isTaskField && comment.text) {
          taskInfo.taskFields.push({
            fieldName: '评论',
            content: comment.text,
            index: index,
            isMainField: false
          });
        }
      });
    }
    
    return taskInfo;
  }
  
  /**
   * 处理已有的任务卡片
   * @param {Object} note - MN卡片对象
   * @returns {Object} 处理结果
   */
  static async processExistingTaskCards(note) {
    try {
      let hasChanges = false;
      
      // 1. 清除失效链接
      const removedLinksCount = this.cleanupBrokenLinks(note);
      if (removedLinksCount > 0) {
        hasChanges = true;
        MNUtil.log(`✅ 清除了 ${removedLinksCount} 个失效链接`);
      }
      
      // 2. 检查是否需要升级
      if (this.upgradeOldTaskCard(note)) {
        return {
          type: 'upgraded',
          noteId: note.noteId,
          title: note.noteTitle,
          removedLinks: removedLinksCount
        };
      }
      
      // 3. 如果只是清理了链接，也算是更新
      if (hasChanges) {
        return {
          type: 'upgraded',
          noteId: note.noteId,
          title: note.noteTitle,
          reason: `清理了 ${removedLinksCount} 个失效链接`
        };
      }
      
      // 卡片已是最新版本且无需清理
      return {
        type: 'skipped',
        noteId: note.noteId,
        title: note.noteTitle,
        reason: '已是最新版本任务卡片'
      };
    } catch (error) {
      MNUtil.log(`❌ 处理任务卡片失败: ${error.message || error}`);
      return {
        type: 'failed',
        noteId: note.noteId,
        title: note.noteTitle,
        error: error.message || error
      };
    }
  }
  
  /**
   * 自动检测任务类型
   * @param {string} content - 任务内容
   * @param {Array} childNotes - 子卡片数组
   * @returns {string} 任务类型
   */
  static autoDetectTaskType(content, childNotes = []) {
    // 关键词检测规则
    const keywords = {
      '目标': ['目标', 'OKR', 'objective', 'goal'],
      '关键结果': ['关键结果', 'KR', 'key result', '指标', '达成'],
      '项目': ['项目', 'project', '计划', '方案'],
      '动作': ['动作', 'action', '任务', 'task', '执行', '实施']
    };
    
    // 检测内容中的关键词
    const lowerContent = content.toLowerCase();
    for (const [type, words] of Object.entries(keywords)) {
      if (words.some(word => lowerContent.includes(word.toLowerCase()))) {
        return type;
      }
    }
    
    // 根据子卡片数量推断
    if (childNotes.length > 5) {
      return '目标';  // 多个子任务可能是目标
    } else if (childNotes.length > 0) {
      return '项目';  // 有子任务可能是项目
    }
    
    // 默认为动作
    return '动作';
  }
  
  /**
   * 批量处理卡片
   * @param {Array} notes - 要处理的卡片数组
   * @returns {Object} 处理结果汇总
   */
  static async batchProcessCards(notes) {
    const results = {
      created: [],
      upgraded: [],
      skipped: [],
      failed: [],
      cancelled: [],  // 添加 cancelled 类型
      total: notes.length
    };
    
    // 处理每个卡片
    for (const note of notes) {
      try {
        // 所有卡片都走 convertToTaskCard 路径
        // convertToTaskCard 内部会处理已是任务卡片和新卡片的不同情况
        const result = await this.convertToTaskCard(note);
        
        // 添加日志
        MNUtil.log(`📋 处理卡片: ${note.noteTitle}`);
        MNUtil.log(`  结果类型: ${result.type}`);
        if (result.error) {
          MNUtil.log(`  错误信息: ${result.error}`);
        }
        
        // 确保 result.type 是有效的键
        if (results.hasOwnProperty(result.type)) {
          results[result.type].push(result);
        } else {
          // 未知类型，当作失败处理
          MNUtil.log(`❌ 未知的结果类型: ${result.type}`);
          results.failed.push({
            ...result,
            type: 'failed',
            error: `未知的结果类型: ${result.type}`
          });
        }
      } catch (error) {
        // 捕获异常
        MNUtil.log(`❌ 处理卡片出错: ${error.message || error}`);
        MNUtil.log(`  卡片标题: ${note.noteTitle}`);
        MNUtil.log(`  错误堆栈: ${error.stack || '无堆栈信息'}`);
        
        results.failed.push({
          type: 'failed',
          noteId: note.noteId,
          title: note.noteTitle,
          error: error.message || error.toString()
        });
      }
    }
    
    // 添加汇总日志
    MNUtil.log(`\n📊 批处理结果汇总:`);
    MNUtil.log(`  总计: ${results.total} 个`);
    MNUtil.log(`  创建: ${results.created.length} 个`);
    MNUtil.log(`  升级: ${results.upgraded.length} 个`);
    MNUtil.log(`  跳过: ${results.skipped.length} 个`);
    MNUtil.log(`  取消: ${results.cancelled.length} 个`);
    MNUtil.log(`  失败: ${results.failed.length} 个`);
    
    return results;
  }
  
  /**
   * 获取要处理的笔记
   * @param {Object} focusNote - 焦点笔记
   * @param {Array} focusNotes - 选中的多个笔记
   * @returns {Array|null} 要处理的笔记数组
   */
  static getNotesToProcess(focusNote, focusNotes) {
    // 获取要处理的笔记
    const notesToProcess = focusNotes && focusNotes.length > 0 ? focusNotes : (focusNote ? [focusNote] : null);
    
    if (!notesToProcess || notesToProcess.length === 0) {
      MNUtil.showHUD("请选择要制卡的笔记");
      return null;
    }
    
    return notesToProcess;
  }
  
  /**
   * 显示处理结果
   * @param {Object} result - 处理结果
   */
  static showProcessResult(result) {
    const messages = [];
    
    if (result.created.length > 0) {
      messages.push(`✅ 创建: ${result.created.length}个`);
    }
    if (result.upgraded.length > 0) {
      messages.push(`⬆️ 升级: ${result.upgraded.length}个`);
    }
    if (result.skipped.length > 0) {
      messages.push(`⏭️ 跳过: ${result.skipped.length}个`);
    }
    if (result.cancelled && result.cancelled.length > 0) {
      messages.push(`🚫 取消: ${result.cancelled.length}个`);
    }
    if (result.failed.length > 0) {
      messages.push(`❌ 失败: ${result.failed.length}个`);
    }
    
    const summary = messages.join(', ');
    MNUtil.showHUD(`任务制卡完成\n${summary}`);
    
    // 记录详细日志
    if (result.failed.length > 0) {
      MNUtil.log(`\n❌ 失败详情:`);
      result.failed.forEach(item => {
        MNUtil.log(`  [${item.title}]: ${item.error}`);
      });
    }
    if (result.cancelled && result.cancelled.length > 0) {
      MNUtil.log(`\n🚫 取消详情:`);
      result.cancelled.forEach(item => {
        MNUtil.log(`  [${item.title || '未知'}]: ${item.reason || '用户取消'}`);
      });
    }
  }

    /**
   * 向前切换任务状态
   * @param {Object} note - 任务卡片
   * @returns {Promise<boolean>} 是否成功
   */
  static async toggleStatusForward(note) {
    if (!note) {
      MNUtil.showHUD("请先选择一个任务");
      return false;
    }
    
    // 检查是否是任务卡片，如果不是，尝试处理绑定的任务
    if (!this.isTaskCard(note)) {
      const bindedTasks = this.getBindedTaskCards(note);
      
      if (bindedTasks.length === 0) {
        MNUtil.showHUD("请选择一个任务卡片");
        return false;
      }
      
      // 有绑定的任务，获取下一个状态
      let nextStatus = "进行中";  // 默认
      
      if (bindedTasks.length === 1) {
        // 只有一个绑定任务，根据其当前状态决定下一个状态
        const currentStatus = bindedTasks[0].status;
        switch (currentStatus) {
          case "未开始":
            nextStatus = "进行中";
            break;
          case "暂停":
            nextStatus = "进行中";
            break;
          case "进行中":
            nextStatus = "已完成";
            break;
          case "已完成":
            nextStatus = "已归档";
            break;
          default:
            nextStatus = "进行中";
        }
      }
      
      // 应用状态到绑定的任务
      const result = await this.applyStatusToBindedCard(note, nextStatus);
      return result && result.type === 'applied';
    }
    
    const titleParts = this.parseTaskTitle(note.noteTitle);
    const currentStatus = titleParts.status;
    
    let newStatus = currentStatus;
    switch (currentStatus) {
      case "未开始":
        newStatus = "进行中";
        break;
      case "暂停":
        newStatus = "进行中";
        break;
      case "进行中":
        newStatus = "已完成";
        break;
      case "已完成":
        // 询问是否归档任务
        try {
          const buttonIndex = await MNUtil.confirm("任务归档", "是否将任务归档并移动到归档区？");
          
          if (buttonIndex !== 1) {
            return false;
          }
          
          newStatus = "已归档";
          
          // 执行归档移动
          const completedBoardId = taskConfig.getBoardNoteId('completed');
          
          if (!completedBoardId) {
            MNUtil.showHUD("请先在设置中配置已完成归档区");
            return false;
          }
          
          const completedBoardNote = MNNote.new(completedBoardId);
          if (!completedBoardNote) {
            MNUtil.showHUD("无法找到已完成归档区");
            return false;
          }
          
          // 更新状态并移动到归档区
          MNUtil.undoGrouping(() => {
            this.updateTaskStatus(note, newStatus);
            note.refresh();
            
            if (note.parentNote && this.isTaskCard(note.parentNote)) {
              note.parentNote.refresh();
            }
            
            const success = this.moveTo(note, completedBoardNote);
            if (success) {
              MNUtil.showHUD("✅ 任务已归档并移动到归档区");
            } else {
              MNUtil.showHUD("❌ 移动失败，但状态已更新为已归档");
            }
          });
          return true;
        } catch (error) {
          MNUtil.showHUD(`归档失败: ${error.message || error}`);
          return false;
        }
      case "已归档":
        MNUtil.showHUD("任务已归档");
        return false;
      default:
        MNUtil.showHUD("未知的任务状态");
        return false;
    }
    
    // 更新状态
    MNUtil.undoGrouping(() => {
      this.updateTaskStatus(note, newStatus);
      note.refresh();
      
      if (note.parentNote && this.isTaskCard(note.parentNote)) {
        note.parentNote.refresh();
      }
    });
    
    MNUtil.showHUD(`✅ 状态已更新：${currentStatus} → ${newStatus}`);
    return true;
  }

  /**
   * 向后切换任务状态（退回上一个状态）
   * @param {Object} note - 任务卡片
   * @returns {boolean} 是否成功
   */
  static toggleStatusBackward(note) {
    if (!note) {
      MNUtil.showHUD("请先选择一个任务");
      return false;
    }
    
    if (!this.isTaskCard(note)) {
      MNUtil.showHUD("请选择一个任务卡片");
      return false;
    }
    
    const titleParts = this.parseTaskTitle(note.noteTitle);
    const currentStatus = titleParts.status;
    
    let newStatus = currentStatus;
    switch (currentStatus) {
      case "未开始":
        MNUtil.showHUD("任务尚未开始");
        return false;
      case "进行中":
        newStatus = "未开始";
        break;
      case "已完成":
        newStatus = "进行中";
        break;
      case "已归档":
        newStatus = "已完成";
        break;
      default:
        MNUtil.showHUD("未知的任务状态");
        return false;
    }
    
    MNUtil.undoGrouping(() => {
      this.updateTaskStatus(note, newStatus);
    });
    
    MNUtil.showHUD(`↩️ 状态已退回：${currentStatus} → ${newStatus}`);
    return true;
  }
  
  /**
   * 暂停任务
   * @param {MNNote} note - 要暂停的任务卡片
   * @returns {boolean} 是否成功暂停
   */
  static async pauseTask(note) {
    if (!note || !this.isTaskCard(note)) {
      MNUtil.showHUD("请先选择一个任务卡片");
      return false;
    }
    
    const titleParts = this.parseTaskTitle(note.noteTitle);
    const currentStatus = titleParts.status;
    
    // 只有进行中的任务可以暂停
    if (currentStatus !== "进行中") {
      MNUtil.showHUD("只有进行中的任务可以暂停");
      return false;
    }
    
    MNUtil.undoGrouping(() => {
      this.updateTaskStatus(note, "暂停");
      note.refresh();
      if (note.parentNote && this.isTaskCard(note.parentNote)) {
        note.parentNote.refresh();
      }
    });
    
    MNUtil.showHUD(`⏸️ 任务已暂停`);
    return true;
  }

  /**
   * 修改任务卡片类型
   * @param {Array} notes - 要修改的卡片数组
   * @returns {Promise<boolean>} 是否成功
   */
  static async changeTaskType(notes) {
    if (!notes || notes.length === 0) {
      MNUtil.showHUD("请先选择一个或多个卡片");
      return false;
    }
    
    // 筛选出任务卡片
    const taskNotes = notes.filter(note => this.isTaskCard(note));
    
    if (taskNotes.length === 0) {
      MNUtil.showHUD("请选择任务卡片");
      return false;
    }
    
    // 显示类型选择弹窗
    const taskTypes = ["目标", "关键结果", "项目", "动作"];
    
    return new Promise((resolve) => {
      UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
        "修改卡片类型",
        `选择新的卡片类型\n当前选中 ${taskNotes.length} 个卡片`,
        0,
        "取消",
        taskTypes,
        (alert, buttonIndex) => {
          if (buttonIndex === 0) {
            resolve(false);
            return;
          }
          
          const newType = taskTypes[buttonIndex - 1];
          
          MNUtil.undoGrouping(() => {
            let successCount = 0;
            
            taskNotes.forEach(note => {
              try {
                const titleParts = this.parseTaskTitle(note.noteTitle);
                const oldType = titleParts.type;
                
                // 构建新标题
                let newTitle;
                if (titleParts.path) {
                  newTitle = `【${newType} >> ${titleParts.path}｜${titleParts.status}】${titleParts.content}`;
                } else {
                  newTitle = `【${newType}｜${titleParts.status}】${titleParts.content}`;
                }
                
                note.noteTitle = newTitle;
                
                // 处理字段变更
                if (oldType !== newType) {
                  const parsed = this.parseTaskComments(note);
                  
                  // 如果从其他类型转换为动作类型，需要删除"包含"和状态字段
                  if (newType === "动作") {
                    MNUtil.log(`🔄 从${oldType}转换为动作，需要删除"包含"和状态字段`);
                    
                    // 收集要删除的字段索引
                    const indicesToRemove = [];
                    
                    // 查找"包含"字段
                    const containsField = parsed.taskFields.find(f => f.content === '包含');
                    if (containsField) {
                      indicesToRemove.push(containsField.index);
                      MNUtil.log(`📍 找到"包含"字段，索引：${containsField.index}`);
                    }
                    
                    // 查找状态字段
                    const statusFields = ['未开始', '进行中', '已完成', '已归档'];
                    statusFields.forEach(status => {
                      const statusField = parsed.taskFields.find(f => 
                        f.content === status && f.fieldType === 'stateField'
                      );
                      if (statusField) {
                        indicesToRemove.push(statusField.index);
                        MNUtil.log(`📍 找到"${status}"字段，索引：${statusField.index}`);
                      }
                    });
                    
                    // 从大到小排序，避免删除时索引变化的问题
                    indicesToRemove.sort((a, b) => b - a);
                    
                    // 删除字段
                    indicesToRemove.forEach(index => {
                      note.removeCommentByIndex(index);
                      MNUtil.log(`🗑️ 删除索引 ${index} 的字段`);
                    });
                  } 
                  // 如果从动作类型转换为其他类型，需要添加"包含"和状态字段
                  else if (oldType === "动作") {
                    const hasContainsField = parsed.taskFields.some(f => f.content === '包含');
                    if (!hasContainsField) {
                      // 查找"启动"字段，"包含"应该添加在它之后
                      const launchField = parsed.taskFields.find(f => 
                        f.content && f.content.includes('[启动]')
                      );
                      
                      // 如果没有启动字段，则查找"信息"字段
                      const referenceField = launchField || parsed.taskFields.find(f => f.content === '信息');
                      
                      if (referenceField) {
                        MNUtil.log(`🔄 从动作转换为${newType}，需要添加"包含"和状态字段`);
                        MNUtil.log(`📍 参考字段"${launchField ? '启动' : '信息'}"位置：${referenceField.index}`);
                        
                        // 首先添加"包含"字段
                        const containsFieldHtml = TaskFieldUtils.createFieldHtml('包含', 'mainField');
                        note.appendMarkdownComment(containsFieldHtml);
                        const containsIndex = note.MNComments.length - 1;
                        MNUtil.log(`📝 添加"包含"字段到索引 ${containsIndex}`);
                        
                        // 移动"包含"字段到参考字段后面
                        note.moveComment(containsIndex, referenceField.index + 1, false);
                        MNUtil.log(`🔄 移动"包含"字段到位置 ${referenceField.index + 1}`);
                        
                        // 重新解析以获取更新后的字段位置
                        const updatedParsed = this.parseTaskComments(note);
                        const updatedContainsField = updatedParsed.taskFields.find(f => f.content === '包含');
                        
                        if (updatedContainsField) {
                          // 添加状态字段到"包含"字段后面
                          const statuses = ['未开始', '进行中', '已完成', '已归档'];
                          let targetPosition = updatedContainsField.index + 1;
                          
                          statuses.forEach((status, idx) => {
                            const statusHtml = TaskFieldUtils.createStatusField(status);
                            note.appendMarkdownComment(statusHtml);
                            const statusIndex = note.MNComments.length - 1;
                            MNUtil.log(`📝 添加"${status}"字段到索引 ${statusIndex}`);
                            
                            // 调试：打印当前评论数量
                            MNUtil.log(`   当前评论总数：${note.MNComments.length}`);
                            
                            // 移动到正确位置
                            note.moveComment(statusIndex, targetPosition, false);
                            MNUtil.log(`🔄 移动"${status}"字段到位置 ${targetPosition}`);
                            
                            // 由于刚移动了一个元素到 targetPosition，下一个应该在其后面
                            targetPosition++;
                            MNUtil.log(`   下一个字段目标位置：${targetPosition}`);
                          });
                        } else {
                          MNUtil.log(`❌ 无法找到更新后的"包含"字段位置`);
                        }
                      }
                    }
                  }
                  
                  // 调试：打印最终的字段顺序
                  if (oldType === "动作" && newType !== "动作") {
                    MNUtil.log(`🔍 字段转换完成，最终字段顺序：`);
                    const finalParsed = this.parseTaskComments(note);
                    finalParsed.taskFields.forEach((field, idx) => {
                      MNUtil.log(`   ${idx + 1}. ${field.content} (索引: ${field.index})`);
                    });
                  }
                }
                
                note.refresh();
                successCount++;
              } catch (error) {
                MNUtil.log(`修改卡片类型失败: ${error.message}`);
              }
            });
            
            // 刷新父卡片
            taskNotes.forEach(note => {
              if (note.parentNote && this.isTaskCard(note.parentNote)) {
                note.parentNote.refresh();
              }
            });
            
            MNUtil.showHUD(`✅ 成功修改 ${successCount}/${taskNotes.length} 个卡片类型为：${newType}`);
          });
          
          resolve(true);
        }
      );
    });
  }

  /**
   * 将动作类型的卡片转换为项目类型
   * @param {MNNote} note - 要转换的动作卡片
   * @returns {boolean} 是否成功转换
   */
  static transformActionToProject(note) {
    if (!note || !this.isTaskCard(note)) {
      MNUtil.log(`❌ 卡片无效或不是任务卡片`)
      return false
    }
    
    const titleParts = this.parseTaskTitle(note.noteTitle)
    if (titleParts.type !== '动作') {
      MNUtil.log(`❌ 卡片不是动作类型，无需转换`)
      return false
    }
    
    MNUtil.log(`🔄 开始将动作卡片转换为项目类型`)
    MNUtil.log(`📝 原标题: ${note.noteTitle}`)
    
    try {
      MNUtil.undoGrouping(() => {
        // 1. 修改标题中的类型
        let newTitle
        if (titleParts.path) {
          newTitle = `【项目 >> ${titleParts.path}｜${titleParts.status}】${titleParts.content}`
        } else {
          newTitle = `【项目｜${titleParts.status}】${titleParts.content}`
        }
        note.noteTitle = newTitle
        MNUtil.log(`✅ 标题已更新: ${newTitle}`)
        
        // 2. 解析当前字段
        const parsed = this.parseTaskComments(note)
        
        // 3. 查找参考位置（启动字段或信息字段）
        const launchField = parsed.taskFields.find(f => 
          f.content && f.content.includes('[启动]')
        )
        const referenceField = launchField || parsed.taskFields.find(f => f.content === '信息')
        
        if (!referenceField) {
          MNUtil.log(`❌ 找不到参考字段位置`)
          return
        }
        
        MNUtil.log(`📍 参考字段"${launchField ? '启动' : '信息'}"位置：${referenceField.index}`)
        
        // 4. 添加"包含"字段
        const containsFieldHtml = TaskFieldUtils.createFieldHtml('包含', 'mainField')
        note.appendMarkdownComment(containsFieldHtml)
        const containsIndex = note.MNComments.length - 1
        MNUtil.log(`📝 添加"包含"字段到索引 ${containsIndex}`)
        
        // 移动到参考字段后面
        note.moveComment(containsIndex, referenceField.index + 1, false)
        MNUtil.log(`🔄 移动"包含"字段到位置 ${referenceField.index + 1}`)
        
        // 5. 重新解析以获取更新后的位置
        const updatedParsed = this.parseTaskComments(note)
        const updatedContainsField = updatedParsed.taskFields.find(f => f.content === '包含')
        
        if (updatedContainsField) {
          // 6. 添加状态字段
          const statuses = ['未开始', '进行中', '已完成', '已归档']
          let targetPosition = updatedContainsField.index + 1
          
          statuses.forEach((status, idx) => {
            const statusHtml = TaskFieldUtils.createStatusField(status)
            note.appendMarkdownComment(statusHtml)
            const statusIndex = note.MNComments.length - 1
            MNUtil.log(`📝 添加"${status}"字段到索引 ${statusIndex}`)
            
            // 移动到正确位置
            note.moveComment(statusIndex, targetPosition, false)
            MNUtil.log(`🔄 移动"${status}"字段到位置 ${targetPosition}`)
            
            targetPosition++
          })
          
          // 7. 处理已有的子卡片链接位置
          MNUtil.log(`\n📎 开始调整子卡片链接位置...`)
          const finalParsed = this.parseTaskComments(note)
          
          // 找到所有在"信息"字段下的链接
          const infoField = finalParsed.taskFields.find(f => f.content === '信息')
          if (infoField) {
            // 找到信息字段的结束位置（下一个主字段的位置）
            let infoEndIndex = note.MNComments.length
            for (let field of finalParsed.taskFields) {
              if (field.isMainField && field.index > infoField.index) {
                infoEndIndex = field.index
                break
              }
            }
            
            const linksToMove = []
            
            for (let link of finalParsed.links) {
              if (link.index > infoField.index && link.index < infoEndIndex) {
                // 获取子卡片信息
                const childNote = MNNote.new(link.linkedNoteId)
                if (childNote && this.isTaskCard(childNote)) {
                  const childParts = this.parseTaskTitle(childNote.noteTitle)
                  const childStatus = childParts.status || '未开始'
                  linksToMove.push({
                    index: link.index,
                    status: childStatus,
                    childTitle: childNote.noteTitle
                  })
                }
              }
            }
            
            // 从后往前移动，避免索引变化问题
            linksToMove.sort((a, b) => b.index - a.index)
            
            linksToMove.forEach(linkInfo => {
              MNUtil.log(`📍 移动链接到"${linkInfo.status}"字段下: ${linkInfo.childTitle}`)
              this.moveCommentToField(note, linkInfo.index, linkInfo.status, false)
            })
            
            if (linksToMove.length > 0) {
              MNUtil.log(`✅ 已调整 ${linksToMove.length} 个子卡片链接位置`)
            } else {
              MNUtil.log(`ℹ️ 没有需要调整的子卡片链接`)
            }
          }
          
          MNUtil.log(`✅ 成功将动作卡片转换为项目类型`)
        } else {
          MNUtil.log(`❌ 无法找到更新后的"包含"字段位置`)
        }
      })
      
      return true
    } catch (error) {
      MNUtil.log(`❌ 转换失败: ${error.message || error}`)
      return false
    }
  }

  /**
   * 根据层级批量制卡
   * @param {Object} rootNote - 根卡片
   * @returns {Promise<boolean>} 是否成功
   */
  static async batchCreateByHierarchy(rootNote) {
    if (!rootNote) {
      MNUtil.showHUD("请先选择根卡片");
      return false;
    }
    
    MNUtil.log("🏗️ 开始根据层级批量制卡");
    MNUtil.log("📌 根卡片：" + rootNote.noteTitle);
    
    // 首先让用户选择根卡片的类型
    const taskTypes = ["目标", "关键结果", "项目", "动作"];
    const selectedIndex = await MNUtil.userSelect("选择根卡片类型", "请选择根卡片的任务类型", taskTypes);
    
    if (selectedIndex === 0) return false;
    
    const rootType = taskTypes[selectedIndex - 1];
    MNUtil.log(`📋 用户选择的根卡片类型：${rootType}`);
    
    // 获取所有后代节点和层级信息
    let allDescendants, treeIndex;
    try {
      const nodesData = rootNote.descendantNodes;
      if (!nodesData || typeof nodesData.descendant === 'undefined' || typeof nodesData.treeIndex === 'undefined') {
        throw new Error("无法获取后代节点信息");
      }
      allDescendants = nodesData.descendant;
      treeIndex = nodesData.treeIndex;
    } catch (e) {
      MNUtil.log("❌ 无法获取后代节点：" + e.message);
      MNUtil.showHUD("无法获取卡片层级信息");
      return false;
    }
    
    // 计算最大层级深度
    let maxLevel = 0;
    const nodesWithInfo = [];
    
    // 首先添加根节点
    nodesWithInfo.push({
      node: rootNote,
      level: 0,
      treeIndex: []
    });
    
    // 添加所有后代节点
    if (allDescendants && allDescendants.length > 0) {
      allDescendants.forEach((node, i) => {
        const level = treeIndex[i].length;
        nodesWithInfo.push({
          node: node,
          level: level,
          treeIndex: treeIndex[i]
        });
        maxLevel = Math.max(maxLevel, level);
      });
    }
    
    MNUtil.log(`📊 节点总数：${nodesWithInfo.length}，最大层级：${maxLevel}`);
    
    // 根据新规则确定任务类型分配策略
    function getTaskTypeByLevel(node, parentNode, level, maxLevel) {
      // 1. 如果节点已经是任务卡片，保持原有类型
      if (MNTaskManager.isTaskCard(node)) {
        const titleParts = MNTaskManager.parseTaskTitle(node.noteTitle);
        MNUtil.log(`📌 保持原有类型：${titleParts.type}`);
        return titleParts.type;
      }
      
      // 2. 根节点使用用户选择的类型
      if (level === 0) {
        return rootType;
      }
      
      // 3. 根据父节点类型决定子节点类型
      if (parentNode) {
        let parentType;
        if (MNTaskManager.isTaskCard(parentNode)) {
          const parentTitleParts = MNTaskManager.parseTaskTitle(parentNode.noteTitle);
          parentType = parentTitleParts.type;
        } else if (level === 1) {
          parentType = rootType;
        }
        
        switch(parentType) {
          case "目标":
            return "关键结果";
          case "关键结果":
            return "项目";
          case "项目":
            return (level === maxLevel) ? "动作" : "项目";
          case "动作":
            return "动作";
          default:
            return "动作";
        }
      }
      
      return "动作";
    }
    
    // 构建节点父子关系
    const nodeParentMap = new Map();
    nodesWithInfo.forEach((nodeInfo, index) => {
      if (index === 0) return;
      
      const parentIndex = treeIndex[index - 1];
      let parentNode = rootNote;
      
      if (parentIndex.length > 0) {
        for (let i = 0; i < nodesWithInfo.length; i++) {
          if (JSON.stringify(nodesWithInfo[i].treeIndex) === JSON.stringify(parentIndex.slice(0, nodeInfo.treeIndex.length - 1))) {
            parentNode = nodesWithInfo[i].node;
            break;
          }
        }
      }
      
      nodeParentMap.set(nodeInfo.node, parentNode);
    });
    
    // 批量制卡
    MNUtil.undoGrouping(async () => {
      const processedNodes = [];
      
      for (let index = 0; index < nodesWithInfo.length; index++) {
        const nodeInfo = nodesWithInfo[index];
        const node = nodeInfo.node;
        const level = nodeInfo.level;
        const parentNode = index === 0 ? null : nodeParentMap.get(node);
        
        // 确定任务类型
        const taskType = getTaskTypeByLevel(node, parentNode, level, maxLevel);
        
        MNUtil.log(`📝 层级 ${level} - 节点 ${index}：${node.noteTitle} → ${taskType}`);
        
        // 检查是否已经是任务卡片
        let isAlreadyTaskCard = this.isTaskCard(node);
        if (!isAlreadyTaskCard) {
          // 构建任务路径
          const path = this.buildTaskPath(node);
          // 创建任务卡片标题（包含路径）
          const content = node.noteTitle || "未命名任务";
          const taskTitle = path ? 
            `【${taskType} >> ${path}｜未开始】${content}` :
            `【${taskType}｜未开始】${content}`;
          node.noteTitle = taskTitle;
        }
        
        // 转换为任务卡片，传递 taskType 作为字符串
        const result = await this.convertToTaskCard(node, taskType);
        
        if (result && (result.type === 'created' || result.type === 'upgraded')) {
          processedNodes.push({
            node: node,
            level: level,
            type: taskType
          });
        }
      }
      
      MNUtil.showHUD(`✅ 批量制卡完成：成功处理 ${processedNodes.length}/${nodesWithInfo.length} 个节点`);
    });
    
    return true;
  }

  /**
   * 归档已完成的任务
   * @param {Array} notes - 要归档的任务数组（可选）
   * @returns {Promise<boolean>} 是否成功
   */
  static async archiveCompletedTasks(notes) {
    // 如果没有传入笔记，获取已完成的任务
    if (!notes || notes.length === 0) {
      notes = TaskFilterEngine.filter({
        boardKeys: ['target', 'project', 'action', 'inbox'],
        customFilter: (task) => {
          const taskInfo = this.getTaskInfo(task);
          return taskInfo.status === '已完成';
        }
      });
    }
    
    // 筛选出已完成的任务卡片
    const completedTasks = notes.filter(note => {
      if (!this.isTaskCard(note)) return false;
      const titleParts = this.parseTaskTitle(note.noteTitle);
      return titleParts.status === '已完成';
    });
    
    if (completedTasks.length === 0) {
      MNUtil.showHUD("没有需要归档的已完成任务");
      return false;
    }
    
    // 确认归档
    const confirmText = `确认归档 ${completedTasks.length} 个已完成任务？\n归档后任务将移动到归档区`;
    const buttonIndex = await MNUtil.confirm("归档已完成任务", confirmText);
    
    if (buttonIndex !== 1) return false;
    
    // 获取归档区
    const completedBoardId = taskConfig.getBoardNoteId('completed');
    if (!completedBoardId) {
      MNUtil.showHUD("请先在设置中配置已完成归档区");
      return false;
    }
    
    const completedBoardNote = MNNote.new(completedBoardId);
    if (!completedBoardNote) {
      MNUtil.showHUD("无法找到已完成归档区");
      return false;
    }
    
    // 执行归档
    let successCount = 0;
    
    MNUtil.undoGrouping(() => {
      completedTasks.forEach(task => {
        try {
          // 更新状态为已归档
          this.updateTaskStatus(task, "已归档");
          
          // 移动到归档区
          if (this.moveTo(task, completedBoardNote)) {
            successCount++;
          }
        } catch (error) {
          MNUtil.log(`归档任务失败: ${error.message}`);
        }
      });
    });
    
    MNUtil.showHUD(`✅ 成功归档 ${successCount}/${completedTasks.length} 个任务`);
    return true;
  }

  /**
   * 更新卡片（路径/链接/字段）
   * @param {Array} notes - 要更新的卡片数组
   * @returns {boolean} 是否成功
   */
  static renewCards(notes) {
    if (!notes || notes.length === 0) {
      MNUtil.showHUD("请选择要更新的卡片");
      return false;
    }
    
    // 筛选出任务卡片
    const taskNotes = notes.filter(note => this.isTaskCard(note));
    
    if (taskNotes.length === 0) {
      MNUtil.showHUD("请选择任务卡片");
      return false;
    }
    
    let updatedCount = 0;
    
    MNUtil.undoGrouping(() => {
      taskNotes.forEach(note => {
        try {
          // 1. 更新路径
          this.updateTaskPath(note);
          
          // 2. 清理失效链接
          this.cleanupBrokenLinks(note);
          
          // 3. 更新字段格式
          const parsed = this.parseTaskComments(note);
          
          // 确保所有主字段都有正确的样式
          parsed.taskFields.forEach(field => {
            if (field.fieldType === 'mainField' || field.fieldType === 'subField' || field.fieldType === 'stateField') {
              const currentHtml = note.MNComments[field.index].text;
              const expectedHtml = TaskFieldUtils.createFieldHtml(field.content, field.fieldType);
              
              if (currentHtml !== expectedHtml) {
                note.replaceWithMarkdownComment(expectedHtml, field.index);
              }
            }
          });
          
          // 4. 刷新卡片
          note.refresh();
          updatedCount++;
        } catch (error) {
          MNUtil.log(`更新卡片失败: ${error.message}`);
        }
      });
      
      // 刷新父卡片
      taskNotes.forEach(note => {
        if (note.parentNote && this.isTaskCard(note.parentNote)) {
          note.parentNote.refresh();
        }
      });
    });
    
    MNUtil.showHUD(`✅ 成功更新 ${updatedCount}/${taskNotes.length} 个卡片`);
    return true;
  }

  /**
   * 编辑自定义字段
   * @param {Object} note - 任务卡片
   * @returns {Promise<boolean>} 是否成功
   */
  static async editCustomField(note) {
    if (!note) {
      MNUtil.showHUD("请先选择一个卡片");
      return false;
    }
    
    if (!this.isTaskCard(note)) {
      MNUtil.showHUD("请选择任务卡片");
      return false;
    }
    
    // 获取当前所有字段
    const parsed = this.parseTaskComments(note);
    const customFields = parsed.taskFields.filter(f => 
      f.fieldType === 'subField' && 
      !['所属', '📅 今日', '🔥 优先级', '⏰ 计划时间'].includes(f.content) &&
      !f.content.includes('未开始') && 
      !f.content.includes('进行中') && 
      !f.content.includes('已完成') && 
      !f.content.includes('已归档')
    );
    
    if (customFields.length === 0) {
      MNUtil.showHUD("没有可编辑的自定义字段");
      return false;
    }
    
    // 构建选项列表
    const options = customFields.map(f => f.content);
    
    // 让用户选择要编辑的字段
    const selectedIndex = await MNUtil.userSelect("选择要编辑的字段", "", options);
    
    if (selectedIndex === 0) return false;
    
    const selectedField = customFields[selectedIndex - 1];
    
    // 让用户输入新值
    const newValue = await MNUtil.input("编辑字段", `当前值：${selectedField.content}`, selectedField.content);
    
    if (!newValue || newValue === selectedField.content) return false;
    
    // 更新字段
    MNUtil.undoGrouping(() => {
      const newFieldHtml = TaskFieldUtils.createFieldHtml(newValue, 'subField');
      note.replaceWithMarkdownComment(newFieldHtml, selectedField.index);
      note.refresh();
    });
    
    MNUtil.showHUD(`✅ 字段已更新：${selectedField.content} → ${newValue}`);
    return true;
  }



  /**
   * 启动任务
   */
  static get isTaskLaunched() {
    const state = taskConfig.getLaunchedTaskState()
    return state?.isTaskLaunched || false
  }
  
  static set isTaskLaunched(value) {
    const state = taskConfig.getLaunchedTaskState()
    state.isTaskLaunched = value
    taskConfig.saveLaunchedTaskState(state)
  }
  
  static get currentLaunchedTaskId() {
    const state = taskConfig.getLaunchedTaskState()
    return state?.currentLaunchedTaskId || null
  }
  
  static set currentLaunchedTaskId(value) {
    const state = taskConfig.getLaunchedTaskState()
    state.currentLaunchedTaskId = value
    taskConfig.saveLaunchedTaskState(state)
  }
  
  static launchTask(focusNote) {
    try {
      // 获取当前选中的卡片
      if (!focusNote) {
        focusNote = MNNote.getFocusNote()
      }
      
      // 如果选中了任务类型的卡片
      if (focusNote && this.isTaskCard(focusNote)) {
        const launchLink = this.getLaunchLink(focusNote)
        
        if (launchLink) {
          const linkType = this.getLaunchLinkType(launchLink)
          
          switch (linkType) {
            case 'uistatus':
              // 暂时不处理 uistate 类型
              MNUtil.showHUD("暂不支持 UI 状态链接")
              break
              
            case 'note':
              // 在主视图定位卡片
              const noteId = launchLink.match(/marginnote4app:\/\/note\/([A-Za-z0-9-]+)/)?.[1]
              if (noteId) {
                const targetNote = MNNote.new(noteId)
                if (targetNote) {
                  targetNote.focusInMindMap(0.5)
                  // 更新启动状态
                  this.isTaskLaunched = true
                  this.currentLaunchedTaskId = focusNote.noteId
                  MNUtil.showHUD("任务已启动")
                } else {
                  MNUtil.showHUD("无法找到目标卡片")
                }
              }
              break
              
            default:
              MNUtil.showHUD("不支持的链接类型")
          }
        } else {
          MNUtil.showHUD("未找到启动链接")
        }
      } 
      // 没有选中或选中的不是任务卡片
      else {
        // 检查是否有已启动的任务
        if (this.isTaskLaunched && this.currentLaunchedTaskId) {
          const launchedTask = MNNote.new(this.currentLaunchedTaskId)
          if (launchedTask) {
            // 在主视图定位当前启动的任务
            launchedTask.focusInMindMap(0.5)
            // 重置启动状态
            this.isTaskLaunched = false
            MNUtil.showHUD("返回任务规划")
          } else {
            // 如果找不到任务，清空状态
            this.isTaskLaunched = false
            this.currentLaunchedTaskId = null
            MNUtil.showHUD("无法找到已启动的任务")
          }
        } else {
          MNUtil.showHUD("请选中一个任务卡片")
        }
      }
    } catch (error) {
      MNUtil.showHUD("启动任务失败: " + error.message)
      if (typeof MNUtil !== 'undefined' && MNUtil.log) {
        MNUtil.log("🔴 launchTask error: " + error.message)
      }
    }
  }
  
  /**
   * 在浮窗中定位当前启动的任务
   */
  static locateCurrentTaskInFloat() {
    try {
      if (!this.currentLaunchedTaskId) {
        MNUtil.showHUD("当前没有启动的任务")
        return
      }
      
      const launchedTask = MNNote.new(this.currentLaunchedTaskId)
      if (launchedTask) {
        // 在浮窗中定位，不改变 isTaskLaunched 状态
        launchedTask.focusInFloatMindMap(0.5)
        MNUtil.showHUD("已定位当前任务")
      } else {
        // 如果找不到任务，清空状态
        this.isTaskLaunched = false
        this.currentLaunchedTaskId = null
        MNUtil.showHUD("无法找到已启动的任务")
      }
    } catch (error) {
      MNUtil.showHUD("定位任务失败: " + error.message)
      if (typeof MNUtil !== 'undefined' && MNUtil.log) {
        MNUtil.log("🔴 locateCurrentTaskInFloat error: " + error.message)
      }
    }
  }
  
  /**
   * 添加进展记录
   * @param {MNNote} note - 任务卡片
   * @param {string} content - 记录内容
   */
  static addProgressRecord(note, content) {
    try {
      if (!note || !content) return
      
      // 获取当前时间并格式化
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const timestamp = `${year}-${month}-${day} ${hours}:${minutes}`
      
      // 构建带样式的时间戳HTML
      const timestampHtml = `<div style="position:relative; padding-left:28px; margin:14px 0; color:#1E40AF; font-weight:500; font-size:0.92em">
  <div style="position:absolute; left:0; top:50%; transform:translateY(-50%); 
              width:18px; height:18px; background:conic-gradient(#3B82F6 0%, #60A5FA 50%, #3B82F6 100%); 
              border-radius:50%; display:flex; align-items:center; justify-content:center">
    <div style="width:8px; height:8px; background:white; border-radius:50%"></div>
  </div>
  ${timestamp}
</div>
${content.trim()}`
      
      // 添加到卡片最后
      note.appendMarkdownComment(timestampHtml)
      
      // 刷新卡片显示
      note.refresh()
      
      if (typeof MNUtil !== 'undefined' && MNUtil.log) {
        MNUtil.log(`✅ 已添加进展记录: ${content}`)
      }
    } catch (error) {
      if (typeof MNUtil !== 'undefined' && MNUtil.log) {
        MNUtil.log("🔴 addProgressRecord error: " + error.message)
      }
    }
  }

  /**
   * 判断链接类型
   * @param {string} url - 要判断的URL
   * @returns {string} - 'note' | 'uistatus' | 'other'
   */
  static getLaunchLinkType(url) {
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
   * 获取启动链接
   * @param {MNNote} note - 任务卡片
   * @returns {string|null} 链接 URL
   */
  static getLaunchLink(note) {
    // 查找包含 "[启动]" 的评论
    const launchIndex = note.getIncludingCommentIndex("[启动]");
    if (launchIndex === -1) return null;
    
    const comment = note.MNComments[launchIndex];
    if (!comment || !comment.text) return null;
    
    // 从评论文本中提取链接
    const linkMatch = comment.text.match(/\[启动\]\(([^)]+)\)/);
    if (linkMatch) {
      return linkMatch[1];  // 返回 URL 部分
    }
    return null;
  }

  /**
   * 修改任务评论内容 - 基于 parseTaskComments 解析结果的通用评论修改函数
   * @param {MNNote} note - 任务卡片
   * @param {Object} selector - 评论选择器
   * @param {number} selector.index - 按索引定位（优先级最高）
   * @param {string} selector.fieldName - 按字段名定位（如"进展"、"信息"等）
   * @param {string} selector.contentMatch - 按内容关键词匹配定位
   * @param {string} selector.type - 按评论类型定位（需配合 fieldContext）
   * @param {string} selector.fieldContext - 类型定位时的字段上下文
   * @param {string} newContent - 新的评论内容
   * @param {Object} options - 配置选项
   * @param {boolean} options.forceMarkdown - 强制使用 Markdown 格式（默认根据原内容判断）
   * @param {boolean} options.preserveFieldFormat - 保持字段格式不变（默认 true）
   * @param {boolean} options.logDetails - 记录详细日志（默认 true）
   * @returns {Object} 修改结果 {success: boolean, message: string, modifiedIndex?: number}
   */
  static modifyTaskComment(note, selector, newContent, options = {}) {
    // 参数验证
    if (!note || !note.MNComments) {
      return { success: false, message: "无效的笔记对象或无评论" };
    }
    
    if (!selector || typeof selector !== 'object') {
      return { success: false, message: "无效的选择器参数" };
    }
    
    if (typeof newContent !== 'string') {
      return { success: false, message: "新内容必须为字符串" };
    }

    // 默认选项
    const opts = {
      forceMarkdown: false,
      preserveFieldFormat: true,
      logDetails: true,
      ...options
    };

    const logPrefix = opts.logDetails ? "🔧 modifyTaskComment" : null;
    
    if (logPrefix) {
      MNUtil.log(`${logPrefix} 开始修改评论`);
      MNUtil.log(`  - 笔记标题: ${note.noteTitle}`);
      MNUtil.log(`  - 选择器: ${JSON.stringify(selector)}`);
      MNUtil.log(`  - 新内容: ${newContent.substring(0, 50)}${newContent.length > 50 ? '...' : ''}`);
    }

    try {
      // 解析任务评论结构
      const parsed = this.parseTaskComments(note);
      
      // 获取 MNComment 对象数组
      const mnComments = MNComment.from(note);
      if (!mnComments || mnComments.length === 0) {
        return { success: false, message: "无法获取评论对象" };
      }

      // 根据不同选择器定位目标评论
      let targetIndex = -1;
      let targetComment = null;

      // 策略1: 按索引定位（优先级最高）
      if (typeof selector.index === 'number') {
        if (selector.index >= 0 && selector.index < mnComments.length) {
          targetIndex = selector.index;
          targetComment = mnComments[targetIndex];
          if (logPrefix) {
            MNUtil.log(`${logPrefix} 按索引定位: ${targetIndex}`);
          }
        } else {
          return { success: false, message: `索引 ${selector.index} 超出范围 (0-${mnComments.length-1})` };
        }
      }
      
      // 策略2: 按字段名定位
      else if (selector.fieldName) {
        const fieldName = selector.fieldName;
        let foundField = null;
        
        // 查找特定字段
        if (fieldName === '所属' && parsed.belongsTo) {
          foundField = parsed.belongsTo;
        } else if (fieldName === '信息' && parsed.info) {
          foundField = parsed.info;
        } else if (fieldName === '包含' && parsed.contains) {
          foundField = parsed.contains;
        } else if (fieldName === '进展' && parsed.progress) {
          foundField = parsed.progress;
        } else if ((fieldName === '启动' || fieldName === '[启动]' || fieldName.includes('启动')) && parsed.launch) {
          foundField = parsed.launch;
        } else {
          // 在任务字段中查找
          foundField = parsed.taskFields.find(field => 
            field.content === fieldName || 
            (fieldName.includes('启动') && field.content && field.content.includes('[启动]'))
          );
        }

        if (foundField) {
          targetIndex = foundField.index;
          targetComment = mnComments[targetIndex];
          if (logPrefix) {
            MNUtil.log(`${logPrefix} 按字段名定位: ${fieldName} -> 索引 ${targetIndex}`);
          }
        } else {
          return { success: false, message: `未找到字段: ${fieldName}` };
        }
      }
      
      // 策略3: 按内容匹配定位
      else if (selector.contentMatch) {
        const keyword = selector.contentMatch;
        for (let i = 0; i < mnComments.length; i++) {
          const comment = mnComments[i];
          if (comment.text && comment.text.includes(keyword)) {
            targetIndex = i;
            targetComment = comment;
            if (logPrefix) {
              MNUtil.log(`${logPrefix} 按内容匹配定位: "${keyword}" -> 索引 ${targetIndex}`);
            }
            break;
          }
        }
        
        if (targetIndex === -1) {
          return { success: false, message: `未找到包含内容 "${keyword}" 的评论` };
        }
      }
      
      // 策略4: 按类型和字段上下文定位
      else if (selector.type && selector.fieldContext) {
        // 先找到字段上下文
        const fieldContext = selector.fieldContext;
        let fieldStartIndex = -1;
        
        // 在 parsed.fields 中查找字段
        for (let field of parsed.fields) {
          if (field.type === 'field' && field.name === fieldContext) {
            fieldStartIndex = field.index;
            break;
          }
        }
        
        if (fieldStartIndex === -1) {
          return { success: false, message: `未找到字段上下文: ${fieldContext}` };
        }
        
        // 在字段之后查找指定类型的评论
        for (let i = fieldStartIndex + 1; i < parsed.fields.length; i++) {
          const field = parsed.fields[i];
          if (field.type === 'field') break; // 遇到下一个字段则停止
          if (field.type === selector.type) {
            targetIndex = field.index;
            targetComment = mnComments[targetIndex];
            if (logPrefix) {
              MNUtil.log(`${logPrefix} 按类型和上下文定位: ${selector.type} in ${fieldContext} -> 索引 ${targetIndex}`);
            }
            break;
          }
        }
        
        if (targetIndex === -1) {
          return { success: false, message: `在字段 "${fieldContext}" 中未找到类型 "${selector.type}" 的评论` };
        }
      }
      
      // 策略5: 按进展记录ID定位
      else if (selector.progressId) {
        const progressId = selector.progressId;
        
        // 处理特殊关键字
        if (progressId === 'latest') {
          // 获取最新的进展记录（时间戳最大的）
          if (parsed.progressRecords.length > 0) {
            const latestRecord = parsed.progressRecords[0]; // 已按时间戳排序，最新的在前
            targetIndex = latestRecord.commentIndex;
            targetComment = mnComments[targetIndex];
            if (logPrefix) {
              MNUtil.log(`${logPrefix} 按最新进展定位: ${latestRecord.id} -> 索引 ${targetIndex}`);
            }
          } else {
            return { success: false, message: "未找到任何进展记录" };
          }
        } else if (progressId === 'oldest') {
          // 获取最早的进展记录（时间戳最小的）
          if (parsed.progressRecords.length > 0) {
            const oldestRecord = parsed.progressRecords[parsed.progressRecords.length - 1]; // 最早的在最后
            targetIndex = oldestRecord.commentIndex;
            targetComment = mnComments[targetIndex];
            if (logPrefix) {
              MNUtil.log(`${logPrefix} 按最早进展定位: ${oldestRecord.id} -> 索引 ${targetIndex}`);
            }
          } else {
            return { success: false, message: "未找到任何进展记录" };
          }
        } else {
          // 按具体的进展ID查找
          const progressRecord = parsed.progressRecords.find(record => record.id === progressId);
          if (progressRecord) {
            targetIndex = progressRecord.commentIndex;
            targetComment = mnComments[targetIndex];
            if (logPrefix) {
              MNUtil.log(`${logPrefix} 按进展ID定位: ${progressId} -> 索引 ${targetIndex}`);
            }
          } else {
            return { success: false, message: `未找到进展记录ID: ${progressId}` };
          }
        }
      }
      
      // 策略6: 按进展记录索引定位
      else if (typeof selector.progressIndex === 'number') {
        const progressIndex = selector.progressIndex;
        if (progressIndex >= 0 && progressIndex < parsed.progressRecords.length) {
          const progressRecord = parsed.progressRecords[progressIndex];
          targetIndex = progressRecord.commentIndex;
          targetComment = mnComments[targetIndex];
          if (logPrefix) {
            MNUtil.log(`${logPrefix} 按进展索引定位: ${progressIndex} (${progressRecord.id}) -> 索引 ${targetIndex}`);
          }
        } else {
          return { success: false, message: `进展索引 ${progressIndex} 超出范围 (0-${parsed.progressRecords.length-1})` };
        }
      }
      
      else {
        return { success: false, message: "无效的选择器：必须提供 index、fieldName、contentMatch、type+fieldContext、progressId 或 progressIndex" };
      }

      // 执行修改
      if (targetComment) {
        const originalText = targetComment.text || '';
        
        // 判断是否为字段评论，需要保持格式
        const isFieldComment = TaskFieldUtils.isTaskField(originalText);
        let finalContent = newContent;
        
        if (isFieldComment && opts.preserveFieldFormat) {
          // 保持字段格式，只替换字段内容
          const fieldMatch = originalText.match(/<span[^>]*>(.*?)<\/span>(.*)/);
          if (fieldMatch) {
            const fieldTag = fieldMatch[0].replace(fieldMatch[2], ''); // 保留span标签部分
            finalContent = fieldTag + newContent;
            if (logPrefix) {
              MNUtil.log(`${logPrefix} 保持字段格式: ${fieldTag}`);
            }
          }
        }
        
        // 使用 MNComment 的 text setter 进行修改
        targetComment.text = finalContent;
        
        if (logPrefix) {
          MNUtil.log(`${logPrefix} 修改完成`);
          MNUtil.log(`  - 原内容: ${originalText.substring(0, 50)}${originalText.length > 50 ? '...' : ''}`);
          MNUtil.log(`  - 新内容: ${finalContent.substring(0, 50)}${finalContent.length > 50 ? '...' : ''}`);
        }
        
        return { 
          success: true, 
          message: "评论修改成功", 
          modifiedIndex: targetIndex,
          originalContent: originalText,
          newContent: finalContent
        };
      }
      
      return { success: false, message: "未找到目标评论" };
      
    } catch (error) {
      const errorMsg = `修改评论时发生错误: ${error.message}`;
      if (logPrefix) {
        MNUtil.log(`${logPrefix} 错误: ${errorMsg}`);
      }
      
      // 记录错误到系统日志
      if (typeof MNUtil !== 'undefined' && MNUtil.addErrorLog) {
        MNUtil.addErrorLog(error, "modifyTaskComment", {
          selector: selector,
          newContent: newContent.substring(0, 100),
          noteTitle: note.noteTitle
        });
      }
      
      return { success: false, message: errorMsg };
    }
  }

  /**
   * 批量修改任务评论内容 - 支持一次修改多个评论
   * @param {MNNote} note - 任务卡片
   * @param {Array} modifications - 修改操作数组
   * @param {Object} modifications[].selector - 评论选择器（同 modifyTaskComment）
   * @param {string} modifications[].newContent - 新内容
   * @param {Object} modifications[].options - 选项（可选）
   * @param {Object} globalOptions - 全局配置选项
   * @param {boolean} globalOptions.useUndoGrouping - 使用撤销分组（默认 true）
   * @param {boolean} globalOptions.stopOnError - 遇到错误时停止（默认 false）
   * @param {boolean} globalOptions.logDetails - 记录详细日志（默认 true）
   * @returns {Object} 批量修改结果 {success: boolean, message: string, results: Array, successCount: number, errorCount: number}
   */
  static modifyTaskComments(note, modifications, globalOptions = {}) {
    // 参数验证
    if (!note || !note.MNComments) {
      return { 
        success: false, 
        message: "无效的笔记对象或无评论",
        results: [],
        successCount: 0,
        errorCount: 0
      };
    }
    
    if (!Array.isArray(modifications) || modifications.length === 0) {
      return { 
        success: false, 
        message: "无效的修改操作数组",
        results: [],
        successCount: 0,
        errorCount: 0
      };
    }

    // 默认全局选项
    const opts = {
      useUndoGrouping: true,
      stopOnError: false,
      logDetails: true,
      ...globalOptions
    };

    const logPrefix = opts.logDetails ? "🔧 modifyTaskComments" : null;
    
    if (logPrefix) {
      MNUtil.log(`${logPrefix} 开始批量修改评论`);
      MNUtil.log(`  - 笔记标题: ${note.noteTitle}`);
      MNUtil.log(`  - 修改操作数量: ${modifications.length}`);
      MNUtil.log(`  - 使用撤销分组: ${opts.useUndoGrouping}`);
    }

    const results = [];
    let successCount = 0;
    let errorCount = 0;

    // 执行批量修改的核心函数
    const executeBatchModifications = () => {
      for (let i = 0; i < modifications.length; i++) {
        const modification = modifications[i];
        
        // 验证每个修改操作的格式
        if (!modification || !modification.selector || typeof modification.newContent !== 'string') {
          const errorResult = {
            index: i,
            success: false,
            message: `修改操作 ${i} 格式无效：必须包含 selector 和 newContent`,
            selector: modification?.selector,
            newContent: modification?.newContent
          };
          results.push(errorResult);
          errorCount++;
          
          if (opts.stopOnError) {
            if (logPrefix) {
              MNUtil.log(`${logPrefix} 遇到错误停止执行: ${errorResult.message}`);
            }
            break;
          }
          continue;
        }

        // 合并选项（局部选项覆盖全局选项）
        const modificationOptions = {
          logDetails: opts.logDetails,
          ...modification.options
        };

        try {
          // 调用单个修改函数
          const result = this.modifyTaskComment(
            note, 
            modification.selector, 
            modification.newContent, 
            modificationOptions
          );
          
          // 记录结果
          const operationResult = {
            index: i,
            success: result.success,
            message: result.message,
            selector: modification.selector,
            newContent: modification.newContent,
            modifiedIndex: result.modifiedIndex,
            originalContent: result.originalContent
          };
          
          results.push(operationResult);
          
          if (result.success) {
            successCount++;
            if (logPrefix) {
              MNUtil.log(`${logPrefix} 操作 ${i} 成功: 索引 ${result.modifiedIndex}`);
            }
          } else {
            errorCount++;
            if (logPrefix) {
              MNUtil.log(`${logPrefix} 操作 ${i} 失败: ${result.message}`);
            }
            
            if (opts.stopOnError) {
              if (logPrefix) {
                MNUtil.log(`${logPrefix} 遇到错误停止执行`);
              }
              break;
            }
          }
          
        } catch (error) {
          const errorResult = {
            index: i,
            success: false,
            message: `修改操作 ${i} 执行异常: ${error.message}`,
            selector: modification.selector,
            newContent: modification.newContent,
            error: error.message
          };
          results.push(errorResult);
          errorCount++;
          
          if (logPrefix) {
            MNUtil.log(`${logPrefix} 操作 ${i} 异常: ${error.message}`);
          }
          
          // 记录错误到系统日志
          if (typeof MNUtil !== 'undefined' && MNUtil.addErrorLog) {
            MNUtil.addErrorLog(error, "modifyTaskComments", {
              operationIndex: i,
              selector: modification.selector,
              newContent: modification.newContent.substring(0, 100),
              noteTitle: note.noteTitle
            });
          }
          
          if (opts.stopOnError) {
            break;
          }
        }
      }
    };

    // 根据是否使用撤销分组来执行
    try {
      if (opts.useUndoGrouping) {
        MNUtil.undoGrouping(() => {
          executeBatchModifications();
        });
      } else {
        executeBatchModifications();
      }
      
      const overallSuccess = errorCount === 0;
      const message = overallSuccess 
        ? `批量修改完成：成功 ${successCount} 个操作`
        : `批量修改完成：成功 ${successCount} 个，失败 ${errorCount} 个操作`;
      
      if (logPrefix) {
        MNUtil.log(`${logPrefix} ${message}`);
      }
      
      return {
        success: overallSuccess,
        message: message,
        results: results,
        successCount: successCount,
        errorCount: errorCount
      };
      
    } catch (error) {
      const errorMsg = `批量修改过程中发生错误: ${error.message}`;
      
      if (logPrefix) {
        MNUtil.log(`${logPrefix} 错误: ${errorMsg}`);
      }
      
      // 记录错误到系统日志
      if (typeof MNUtil !== 'undefined' && MNUtil.addErrorLog) {
        MNUtil.addErrorLog(error, "modifyTaskComments", {
          modificationsCount: modifications.length,
          noteTitle: note.noteTitle,
          completedOperations: results.length
        });
      }
      
      return {
        success: false,
        message: errorMsg,
        results: results,
        successCount: successCount,
        errorCount: errorCount + 1
      };
    }
  }

  /**
   * 获取任务卡片的所有进展记录
   * @param {MNNote} note - 任务卡片笔记
   * @returns {Array} 进展记录数组，格式：[{id, commentIndex, timestamp, content, isLegacy?}]
   */
  static getProgressRecords(note) {
    if (!note || !note.MNComments) {
      return [];
    }
    
    const parsed = this.parseTaskComments(note);
    return parsed.progressRecords || [];
  }

  /**
   * 修改特定的进展记录
   * @param {MNNote} note - 任务卡片笔记
   * @param {string} progressId - 进展记录ID，支持具体ID、'latest'、'oldest'
   * @param {string} newContent - 新的进展内容
   * @param {Object} options - 修改选项
   * @returns {Object} 修改结果 {success: boolean, message: string, modifiedIndex?: number}
   */
  static modifyProgressRecord(note, progressId, newContent, options = {}) {
    if (!note || !note.MNComments) {
      return { success: false, message: "无效的笔记对象或无评论" };
    }
    
    if (!progressId || typeof progressId !== 'string') {
      return { success: false, message: "无效的进展记录ID" };
    }
    
    if (typeof newContent !== 'string') {
      return { success: false, message: "新内容必须为字符串" };
    }

    // 使用现有的 modifyTaskComment 方法，通过 progressId 选择器
    const selector = { progressId: progressId };
    
    // 构造完整的进展记录HTML（保持原有格式，只修改内容部分）
    const parsed = this.parseTaskComments(note);
    let targetRecord = null;
    
    if (progressId === 'latest' && parsed.progressRecords.length > 0) {
      targetRecord = parsed.progressRecords[0];
    } else if (progressId === 'oldest' && parsed.progressRecords.length > 0) {
      targetRecord = parsed.progressRecords[parsed.progressRecords.length - 1];
    } else {
      targetRecord = parsed.progressRecords.find(record => record.id === progressId);
    }
    
    if (!targetRecord) {
      return { success: false, message: `未找到进展记录: ${progressId}` };
    }

    // 构建新的完整HTML内容（保持时间戳和样式，只修改文本内容）
    const originalComment = note.MNComments[targetRecord.commentIndex];
    const originalText = originalComment.text || '';
    
    // 提取HTML部分和内容部分
    const htmlMatch = originalText.match(/^(<div[^>]*>.*?<\/div>)\s*(.*)$/s);
    if (htmlMatch) {
      const htmlPart = htmlMatch[1];  // HTML时间戳部分
      const newFullContent = htmlPart + '\n' + newContent.trim();
      
      // 使用 modifyTaskComment 进行实际修改
      return this.modifyTaskComment(note, selector, newFullContent, {
        ...options,
        preserveFieldFormat: false  // 不保持字段格式，因为这是完整内容替换
      });
    } else {
      return { success: false, message: "无法解析进展记录格式" };
    }
  }

  /**
   * 删除特定的进展记录
   * @param {MNNote} note - 任务卡片笔记  
   * @param {string} progressId - 进展记录ID，支持具体ID、'latest'、'oldest'
   * @returns {Object} 删除结果 {success: boolean, message: string, deletedIndex?: number}
   */
  static deleteProgressRecord(note, progressId) {
    if (!note || !note.MNComments) {
      return { success: false, message: "无效的笔记对象或无评论" };
    }
    
    if (!progressId || typeof progressId !== 'string') {
      return { success: false, message: "无效的进展记录ID" };
    }

    const parsed = this.parseTaskComments(note);
    let targetRecord = null;
    
    if (progressId === 'latest' && parsed.progressRecords.length > 0) {
      targetRecord = parsed.progressRecords[0];
    } else if (progressId === 'oldest' && parsed.progressRecords.length > 0) {
      targetRecord = parsed.progressRecords[parsed.progressRecords.length - 1];
    } else {
      targetRecord = parsed.progressRecords.find(record => record.id === progressId);
    }
    
    if (!targetRecord) {
      return { success: false, message: `未找到进展记录: ${progressId}` };
    }

    try {
      const targetIndex = targetRecord.commentIndex;
      const mnComments = MNComment.from(note);
      
      if (!mnComments || targetIndex >= mnComments.length) {
        return { success: false, message: "无法获取评论对象或索引超出范围" };
      }

      // 删除评论
      mnComments[targetIndex].remove();
      
      MNUtil.log(`✅ 删除进展记录成功: ${progressId} (索引 ${targetIndex})`);
      
      return {
        success: true,
        message: "进展记录删除成功",
        deletedIndex: targetIndex,
        deletedRecord: targetRecord
      };
      
    } catch (error) {
      MNUtil.log(`❌ 删除进展记录失败: ${error.message}`);
      return { success: false, message: `删除失败: ${error.message}` };
    }
  }

  /**
   * 在特定位置插入新的进展记录
   * @param {MNNote} note - 任务卡片笔记
   * @param {string} content - 进展内容
   * @param {string} afterProgressId - 在指定进展记录后插入，可选参数
   * @returns {Object} 插入结果 {success: boolean, message: string, insertedIndex?: number, progressId?: string}
   */
  static insertProgressRecord(note, content, afterProgressId = null) {
    if (!note || !note.MNComments) {
      return { success: false, message: "无效的笔记对象或无评论" };
    }
    
    if (typeof content !== 'string' || !content.trim()) {
      return { success: false, message: "进展内容不能为空" };
    }

    try {
      // 生成新的进展记录
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const timestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      
      // 生成唯一ID
      const timestampForId = timestamp.replace(/[- :]/g, '');
      const randomSuffix = Math.random().toString(36).substr(2, 6);
      const progressId = `progress_${timestampForId}_${randomSuffix}`;
      
      // 构建HTML内容
      const timestampHtml = `<div data-progress-id="${progressId}" style="position:relative; padding-left:28px; margin:14px 0; color:#1E40AF; font-weight:500; font-size:0.92em">
  <div style="position:absolute; left:0; top:50%; transform:translateY(-50%); 
              width:18px; height:18px; background:conic-gradient(#3B82F6 0%, #60A5FA 50%, #3B82F6 100%); 
              border-radius:50%; display:flex; align-items:center; justify-content:center">
    <div style="width:8px; height:8px; background:white; border-radius:50%"></div>
  </div>
  ${timestamp}
</div>
${content.trim()}`;

      let insertIndex = -1;
      
      if (afterProgressId) {
        // 在指定进展记录后插入
        const parsed = this.parseTaskComments(note);
        const afterRecord = parsed.progressRecords.find(record => record.id === afterProgressId);
        
        if (afterRecord) {
          insertIndex = afterRecord.commentIndex + 1;
        } else {
          return { success: false, message: `未找到指定的进展记录: ${afterProgressId}` };
        }
      }
      
      if (insertIndex === -1) {
        // 添加到卡片末尾
        note.appendMarkdownComment(timestampHtml);
        insertIndex = note.MNComments.length - 1;
      } else {
        // 在指定位置插入
        note.insertMarkdownComment(timestampHtml, insertIndex);
      }
      
      // 刷新卡片显示
      note.refresh();
      
      MNUtil.log(`✅ 插入进展记录成功: ${progressId} (索引 ${insertIndex})`);
      
      return {
        success: true,
        message: "进展记录插入成功", 
        insertedIndex: insertIndex,
        progressId: progressId
      };
      
    } catch (error) {
      MNUtil.log(`❌ 插入进展记录失败: ${error.message}`);
      return { success: false, message: `插入失败: ${error.message}` };
    }
  }

  // ============================================================================
  // 使用示例和最佳实践
  // ============================================================================
  
  /**
   * 使用示例：演示如何使用 modifyTaskComment 和 modifyTaskComments
   * 
   * // === 单个评论修改示例 ===
   * 
   * // 示例1: 按索引修改评论
   * const result1 = MNTaskManager.modifyTaskComment(note, {index: 2}, "新的进展内容");
   * if (result1.success) {
   *   MNUtil.log(`修改成功：索引 ${result1.modifiedIndex}`);
   * }
   * 
   * // 示例2: 按字段名修改（推荐）
   * const result2 = MNTaskManager.modifyTaskComment(note, {fieldName: "进展"}, "更新的进展信息");
   * 
   * // 示例3: 按内容匹配修改
   * const result3 = MNTaskManager.modifyTaskComment(note, {contentMatch: "旧的关键词"}, "新的内容");
   * 
   * // 示例4: 按类型和字段上下文修改
   * const result4 = MNTaskManager.modifyTaskComment(note, {
   *   type: "plainText", 
   *   fieldContext: "进展"
   * }, "在进展字段中的新文本");
   * 
   * // 示例5: 带选项的修改
   * const result5 = MNTaskManager.modifyTaskComment(note, 
   *   {fieldName: "信息"}, 
   *   "新的信息内容", 
   *   {
   *     preserveFieldFormat: true,  // 保持字段格式
   *     logDetails: false          // 不记录详细日志
   *   }
   * );
   * 
   * // === 批量修改示例 ===
   * 
   * // 示例6: 批量修改多个字段
   * const batchResult = MNTaskManager.modifyTaskComments(note, [
   *   {selector: {fieldName: "进展"}, newContent: "新的进展"},
   *   {selector: {fieldName: "信息"}, newContent: "更新的信息"},
   *   {selector: {index: 5}, newContent: "修改索引5的评论"}
   * ]);
   * 
   * MNUtil.log(`批量修改结果：成功 ${batchResult.successCount}，失败 ${batchResult.errorCount}`);
   * 
   * // 示例7: 带撤销分组的批量修改
   * const batchResult2 = MNTaskManager.modifyTaskComments(note, 
   *   [
   *     {selector: {contentMatch: "待办"}, newContent: "已完成"},
   *     {selector: {fieldName: "进展"}, newContent: "100%完成"}
   *   ],
   *   {
   *     useUndoGrouping: true,  // 支持一次撤销所有修改
   *     stopOnError: true,      // 遇到错误时停止
   *     logDetails: true        // 记录详细日志
   *   }
   * );
   * 
   * // 示例8: 遍历批量结果
   * batchResult2.results.forEach((result, index) => {
   *   if (result.success) {
   *     MNUtil.log(`操作 ${index} 成功: 修改了索引 ${result.modifiedIndex}`);
   *   } else {
   *     MNUtil.log(`操作 ${index} 失败: ${result.message}`);
   *   }
   * });
   * 
   * // === 错误处理示例 ===
   * 
   * // 示例9: 完整的错误处理
   * try {
   *   const result = MNTaskManager.modifyTaskComment(note, {fieldName: "不存在的字段"}, "内容");
   *   if (!result.success) {
   *     MNUtil.showHUD(`修改失败: ${result.message}`);
   *   }
   * } catch (error) {
   *   MNUtil.showHUD(`修改异常: ${error.message}`);
   * }
   * 
   * // === 与现有代码集成示例 ===
   * 
   * // 示例10: 在任务状态更新中使用
   * static updateTaskStatus(note, newStatus) {
   *   // 先解析当前状态
   *   const parsed = this.parseTaskComments(note);
   *   if (!parsed.progress) {
   *     MNUtil.showHUD("该卡片没有进展字段");
   *     return false;
   *   }
   *   
   *   // 修改状态字段
   *   const result = this.modifyTaskComment(note, 
   *     {fieldName: "进展"}, 
   *     `状态已更新为：${newStatus}`
   *   );
   *   
   *   return result.success;
   * }
   */

  /**
   * 测试函数：验证 modifyTaskComment 和 modifyTaskComments 的功能
   * 注意：这是一个内部测试函数，仅用于开发验证，正式使用时可以删除
   * @param {MNNote} note - 测试用的任务卡片
   * @returns {Object} 测试结果统计
   */
  static testModifyTaskCommentFunctions(note) {
    if (!note || !note.MNComments) {
      return { success: false, message: "需要一个有效的任务卡片进行测试" };
    }

    const testResults = [];
    let passCount = 0;
    let failCount = 0;

    const addTestResult = (testName, success, message, details = null) => {
      testResults.push({ testName, success, message, details });
      if (success) {
        passCount++;
        MNUtil.log(`✅ ${testName}: ${message}`);
      } else {
        failCount++;
        MNUtil.log(`❌ ${testName}: ${message}`);
      }
    };

    MNUtil.log("🧪 开始测试 modifyTaskComment 系列函数");
    MNUtil.log(`📋 测试卡片: ${note.noteTitle}`);

    try {
      // 先解析当前结构
      const parsed = this.parseTaskComments(note);
      MNUtil.log(`📊 卡片结构: ${parsed.taskFields.length} 个字段, ${note.MNComments.length} 个评论`);

      // 测试1: 参数验证
      const test1 = this.modifyTaskComment(null, {index: 0}, "测试");
      addTestResult("参数验证测试", !test1.success && test1.message.includes("无效的笔记对象"), "正确拒绝了无效参数");

      // 测试2: 无效选择器
      const test2 = this.modifyTaskComment(note, {}, "测试");
      addTestResult("无效选择器测试", !test2.success && test2.message.includes("无效的选择器"), "正确拒绝了无效选择器");

      // 测试3: 超出范围的索引
      const test3 = this.modifyTaskComment(note, {index: 999}, "测试");
      addTestResult("索引超出范围测试", !test3.success && test3.message.includes("超出范围"), "正确处理了超出范围的索引");

      // 测试4: 不存在的字段名
      const test4 = this.modifyTaskComment(note, {fieldName: "不存在的字段"}, "测试");
      addTestResult("不存在字段测试", !test4.success && test4.message.includes("未找到字段"), "正确处理了不存在的字段");

      // 测试5: 按索引修改（如果有评论的话）
      if (note.MNComments.length > 0) {
        const originalText = note.MNComments[0].text;
        const testContent = `测试内容_${Date.now()}`;
        const test5 = this.modifyTaskComment(note, {index: 0}, testContent);
        
        if (test5.success) {
          // 验证是否真的修改了
          const newText = note.MNComments[0].text;
          if (newText.includes(testContent)) {
            addTestResult("按索引修改测试", true, `成功修改索引0的评论`, {originalText, newText});
            
            // 恢复原始内容
            this.modifyTaskComment(note, {index: 0}, originalText);
          } else {
            addTestResult("按索引修改测试", false, "修改后内容不匹配");
          }
        } else {
          addTestResult("按索引修改测试", false, test5.message);
        }
      }

      // 测试6: 按字段修改（如果有进展字段）
      if (parsed.progress) {
        const originalText = parsed.progress.comment.text;
        const testContent = `进展测试_${Date.now()}`;
        const test6 = this.modifyTaskComment(note, {fieldName: "进展"}, testContent);
        
        if (test6.success) {
          addTestResult("按字段修改测试", true, "成功修改进展字段", {originalText});
          
          // 恢复原始内容
          this.modifyTaskComment(note, {fieldName: "进展"}, originalText);
        } else {
          addTestResult("按字段修改测试", false, test6.message);
        }
      }

      // 测试7: 批量修改空数组
      const test7 = this.modifyTaskComments(note, []);
      addTestResult("批量修改空数组测试", !test7.success && test7.message.includes("无效的修改操作数组"), "正确处理了空数组");

      // 测试8: 批量修改格式错误
      const test8 = this.modifyTaskComments(note, [{selector: null}]);
      addTestResult("批量修改格式错误测试", test8.errorCount > 0, "正确处理了格式错误的批量操作");

      // 测试9: 批量修改成功案例（如果有足够的评论）
      if (note.MNComments.length >= 2) {
        const modifications = [
          {selector: {index: 0}, newContent: `批量测试1_${Date.now()}`},
          {selector: {index: 1}, newContent: `批量测试2_${Date.now()}`}
        ];
        
        const test9 = this.modifyTaskComments(note, modifications, {useUndoGrouping: false});
        if (test9.successCount === 2) {
          addTestResult("批量修改成功测试", true, `成功批量修改了 ${test9.successCount} 个评论`);
        } else {
          addTestResult("批量修改成功测试", false, `批量修改结果异常: 成功${test9.successCount}, 失败${test9.errorCount}`);
        }
      }

      // 测试10: MNComment 集成测试
      try {
        const mnComments = MNComment.from(note);
        if (mnComments && mnComments.length > 0) {
          addTestResult("MNComment集成测试", true, `成功获取 ${mnComments.length} 个 MNComment 对象`);
        } else {
          addTestResult("MNComment集成测试", false, "无法获取 MNComment 对象");
        }
      } catch (error) {
        addTestResult("MNComment集成测试", false, `MNComment 集成失败: ${error.message}`);
      }

    } catch (error) {
      addTestResult("总体测试异常", false, `测试过程中发生异常: ${error.message}`);
      
      // 记录测试异常
      if (typeof MNUtil !== 'undefined' && MNUtil.addErrorLog) {
        MNUtil.addErrorLog(error, "testModifyTaskCommentFunctions", {
          noteTitle: note.noteTitle,
          completedTests: testResults.length
        });
      }
    }

    const summary = {
      success: failCount === 0,
      totalTests: testResults.length,
      passCount: passCount,
      failCount: failCount,
      testResults: testResults
    };

    MNUtil.log(`🏁 测试完成: 总计 ${summary.totalTests} 项，通过 ${passCount} 项，失败 ${failCount} 项`);
    
    if (summary.success) {
      MNUtil.log("🎉 所有测试通过！modifyTaskComment 系列函数工作正常");
    } else {
      MNUtil.log("⚠️ 部分测试失败，请检查实现");
    }

    return summary;
  }

  /**
   * 获取所有进行中的任务
   * @param {Object} options - 选项
   * @returns {Array<MNNote>} 进行中的任务列表
   */
  static getInProgressTasks(options = {}) {
    const {
      boardKeys = ['project', 'action'],  // 默认只搜索项目和动作看板
      includeCompleted = false
    } = options
    
    MNUtil.log('🔍 开始搜索进行中的任务...')
    const results = []
    
    for (const boardKey of boardKeys) {
      const boardNoteId = taskConfig.getBoardNoteId(boardKey)
      if (!boardNoteId) continue
      
      const boardNote = MNNote.new(boardNoteId)
      if (!boardNote) continue
      
      const tasks = MNTaskManager.filterTasksFromBoard(boardNote, {
        statuses: includeCompleted ? ['进行中', '已完成'] : ['进行中']
      })
      
      results.push(...tasks)
    }
    
    MNUtil.log(`✅ 找到 ${results.length} 个进行中的任务`)
    return results
  }
  
  /**
   * 获取底层任务（没有子项目的项目或动作）
   * @param {Object} options - 选项
   * @returns {Array<MNNote>} 底层任务列表
   */
  static getBottomLevelTasks(options = {}) {
    const {
      boardKeys = ['project', 'action'],
      statuses = ['进行中']
    } = options
    
    MNUtil.log('🔍 开始搜索底层任务...')
    const results = []
    
    for (const boardKey of boardKeys) {
      const boardNoteId = taskConfig.getBoardNoteId(boardKey)
      if (!boardNoteId) continue
      
      const boardNote = MNNote.new(boardNoteId)
      if (!boardNote) continue
      
      const tasks = MNTaskManager.filterTasksFromBoard(boardNote, { statuses })
      
      // 筛选底层任务
      for (const task of tasks) {
        const titleParts = MNTaskManager.parseTaskTitle(task.noteTitle)
        
        // 动作类型的任务都是底层任务
        if (titleParts.type === '动作') {
          results.push(task)
          continue
        }
        
        // 项目类型的任务，检查是否有子项目
        if (titleParts.type === '项目') {
          let hasSubProject = false
          
          if (task.childNotes && task.childNotes.length > 0) {
            for (const child of task.childNotes) {
              if (MNTaskManager.isTaskCard(child)) {
                const childParts = MNTaskManager.parseTaskTitle(child.noteTitle)
                if (childParts.type === '项目') {
                  hasSubProject = true
                  break
                }
              }
            }
          }
          
          // 没有子项目的项目是底层任务
          if (!hasSubProject) {
            results.push(task)
          }
        }
      }
    }
    
    MNUtil.log(`✅ 找到 ${results.length} 个底层任务`)
    return results
  }
  
  /**
   * 智能查找合适的父任务
   * @param {MNNote} currentNote - 当前卡片
   * @returns {Array<Object>} 父任务候选列表 [{note, reason, priority}]
   */
  static findSuitableParentTasks(currentNote) {
    MNUtil.log('🎯 开始智能查找合适的父任务...')
    const candidates = []
    
    // 1. 检查当前启动的任务
    const launchedState = taskConfig.getLaunchedTaskState()
    if (launchedState.isTaskLaunched && launchedState.currentLaunchedTaskId) {
      const launchedTask = MNNote.new(launchedState.currentLaunchedTaskId)
      if (launchedTask && MNTaskManager.isTaskCard(launchedTask)) {
        const titleParts = MNTaskManager.parseTaskTitle(launchedTask.noteTitle)
        
        // 如果启动的是动作，获取其父任务和兄弟任务
        if (titleParts.type === '动作') {
          // 添加其父任务
          if (launchedTask.parentNote && MNTaskManager.isTaskCard(launchedTask.parentNote)) {
            candidates.push({
              note: launchedTask.parentNote,
              reason: '当前启动任务的父项目',
              priority: 100
            })
          }
          
          // 添加启动任务本身（会转为项目）
          candidates.push({
            note: launchedTask,
            reason: '当前启动的任务',
            priority: 95
          })
          
          // 添加兄弟任务中的进行中任务
          if (launchedTask.parentNote) {
            const siblings = launchedTask.parentNote.childNotes || []
            for (const sibling of siblings) {
              if (sibling.noteId === launchedTask.noteId) continue
              if (MNTaskManager.isTaskCard(sibling)) {
                const siblingParts = MNTaskManager.parseTaskTitle(sibling.noteTitle)
                if (siblingParts.status === '进行中') {
                  candidates.push({
                    note: sibling,
                    reason: '当前启动任务的兄弟任务',
                    priority: 85
                  })
                }
              }
            }
          }
        } else {
          // 启动的是项目或其他类型，直接添加
          candidates.push({
            note: launchedTask,
            reason: '当前启动的项目',
            priority: 100
          })
          
          // 添加其子任务（进行中的）
          const children = launchedTask.childNotes || []
          for (const child of children) {
            if (MNTaskManager.isTaskCard(child)) {
              const childParts = MNTaskManager.parseTaskTitle(child.noteTitle)
              if (childParts.status === '进行中') {
                candidates.push({
                  note: child,
                  reason: '启动项目的子任务',
                  priority: 90
                })
              }
            }
          }
        }
      }
    }
    
    // 2. 获取所有底层任务
    const bottomTasks = MNTaskManager.getBottomLevelTasks({
      statuses: ['进行中', '未开始']
    })
    
    // 过滤掉已经在候选列表中的任务
    const existingIds = new Set(candidates.map(c => c.note.noteId))
    
    for (const task of bottomTasks) {
      if (existingIds.has(task.noteId)) continue
      
      const titleParts = MNTaskManager.parseTaskTitle(task.noteTitle)
      const priority = titleParts.status === '进行中' ? 70 : 60
      
      candidates.push({
        note: task,
        reason: titleParts.status === '进行中' ? '进行中的任务' : '未开始的任务',
        priority: priority
      })
    }
    
    // 按优先级排序
    candidates.sort((a, b) => b.priority - a.priority)
    
    MNUtil.log(`✅ 找到 ${candidates.length} 个候选父任务`)
    return candidates
  }
  
  /**
   * 创建临时任务
   * @param {MNNote} sourceNote - 源卡片（非任务卡片）
   * @returns {Object} 创建结果
   */
  static async createTemporaryTask(sourceNote) {
    MNUtil.log('\n🚀 === 开始创建临时任务 ===')
    MNUtil.log(`📝 源卡片: ${sourceNote.noteTitle}`)
    
    try {
      // 1. 查找合适的父任务
      const candidates = MNTaskManager.findSuitableParentTasks(sourceNote)
      
      if (candidates.length === 0) {
        MNUtil.showHUD('❌ 没有找到合适的父任务，请先创建项目或动作')
        return {
          type: 'failed',
          error: '没有合适的父任务'
        }
      }
      
      // 2. 构建选择列表
      const selectOptions = candidates.map(c => {
        const titleParts = MNTaskManager.parseTaskTitle(c.note.noteTitle)
        return `【${titleParts.type}】${titleParts.content} (${c.reason})`
      })
      
      // 3. 让用户选择父任务
      const selectedIndex = await MNUtil.userSelect(
        '选择父任务',
        '将新任务添加到哪个任务下？',
        selectOptions
      )
      
      if (selectedIndex === 0) {
        return {
          type: 'cancelled',
          reason: '用户取消选择'
        }
      }
      
      const selectedCandidate = candidates[selectedIndex - 1]
      const parentTask = selectedCandidate.note
      
      MNUtil.log(`✅ 选择的父任务: ${parentTask.noteTitle}`)
      
      // 4. 输入新任务标题
      const newTaskTitle = await MNUtil.userInputSingleLine(
        '新任务标题',
        '请输入新任务的标题',
        sourceNote.noteTitle || '新任务'
      )
      
      if (!newTaskTitle) {
        return {
          type: 'cancelled',
          reason: '用户取消输入'
        }
      }
      
      // 5. 创建新任务卡片
      let newTaskNote
      
      MNUtil.undoGrouping(() => {
        // 创建子卡片
        newTaskNote = MNNote.createChildNote(
          parentTask,
          safeSpacing(`【动作｜进行中】${newTaskTitle}`)
        )
        
        // 设置颜色（粉色=进行中）
        newTaskNote.colorIndex = 3
        
        // 添加任务字段
        MNTaskManager.addTaskFieldsWithStatus(newTaskNote)
        
        // 创建双向链接
        sourceNote.appendNoteLink(newTaskNote, "To")
        newTaskNote.appendNoteLink(sourceNote, "From")
        
        // 如果源卡片是知识点卡片，移动链接
        try {
          if (typeof MNMath !== 'undefined' && MNMath.isKnowledgeCard) {
            if (MNMath.isKnowledgeCard(sourceNote)) {
              MNUtil.log('📚 检测到知识点卡片，移动任务链接...')
              if (MNMath.moveTaskCardLink) {
                MNMath.moveTaskCardLink(sourceNote, newTaskNote)
              }
            }
          }
        } catch (e) {
          MNUtil.log(`⚠️ 处理知识点卡片链接时出错: ${e.message}`)
        }
      })
      
      // 6. 检查是否需要转换父任务类型
      const parentParts = MNTaskManager.parseTaskTitle(parentTask.noteTitle)
      if (parentParts.type === '动作') {
        MNUtil.log('🔄 父任务是动作类型，需要转换为项目...')
        const transformResult = MNTaskManager.transformActionToProject(parentTask)
        if (transformResult) {
          MNUtil.log('✅ 父任务已成功转换为项目类型')
        }
      }
      
      // 7. 显示创建结果
      MNUtil.showHUD(`✅ 临时任务创建成功`)
      
      // 8. 打开新任务卡片
      MNUtil.openNote(newTaskNote)
      
      return {
        type: 'created',
        noteId: newTaskNote.noteId,
        title: newTaskNote.noteTitle,
        parentId: parentTask.noteId,
        parentTitle: parentTask.noteTitle
      }
      
    } catch (error) {
      MNUtil.log(`❌ 创建临时任务失败: ${error.message}`)
      return {
        type: 'failed',
        error: error.message
      }
    }
  }
  
  /**
   * 获取卡片中绑定的任务卡片
   * @param {MNNote} note - 要检查的卡片
   * @returns {Array<Object>} 任务卡片信息数组 [{noteId, note, status}]
   */
  static getBindedTaskCards(note) {
    const bindedTasks = []
    
    if (!note || !note.MNComments) return bindedTasks
    
    // 遍历所有评论，查找任务卡片链接
    for (const comment of note.MNComments) {
      if (!comment || !comment.text) continue
      
      // 匹配任务卡片链接格式：【类型｜状态】标题
      const linkMatch = comment.text.match(/\[【(目标|关键结果|项目|动作)[^】]*｜([^】]+)】[^\]]*\]\(marginnote4app:\/\/note\/([^)]+)\)/)
      if (linkMatch) {
        const [, type, status, noteId] = linkMatch
        
        try {
          const linkedNote = MNNote.new(noteId)
          if (linkedNote && MNTaskManager.isTaskCard(linkedNote)) {
            bindedTasks.push({
              noteId: noteId,
              note: linkedNote,
              status: status,
              type: type
            })
          }
        } catch (e) {
          MNUtil.log(`⚠️ 无法获取链接的任务卡片: ${noteId}`)
        }
      }
    }
    
    return bindedTasks
  }
  
  /**
   * 应用状态到绑定的任务卡片
   * @param {MNNote} note - 源卡片
   * @param {string} newStatus - 新状态
   * @returns {Object} 应用结果
   */
  static async applyStatusToBindedCard(note, newStatus) {
    const bindedTasks = MNTaskManager.getBindedTaskCards(note)
    
    if (bindedTasks.length === 0) {
      // 没有绑定的任务，按原流程处理
      return null
    }
    
    if (bindedTasks.length === 1) {
      // 只有一个绑定任务，直接应用
      const task = bindedTasks[0]
      MNTaskManager.updateTaskStatus(task.note, newStatus)
      MNUtil.showHUD(`✅ 已更新绑定任务状态: ${newStatus}`)
      return {
        type: 'applied',
        taskId: task.noteId,
        newStatus: newStatus
      }
    }
    
    // 多个绑定任务，优先处理非完成/归档状态的
    const activeTasks = bindedTasks.filter(t => 
      t.status !== '已完成' && t.status !== '已归档'
    )
    
    if (activeTasks.length === 1) {
      // 只有一个活跃任务，直接应用
      const task = activeTasks[0]
      MNTaskManager.updateTaskStatus(task.note, newStatus)
      MNUtil.showHUD(`✅ 已更新绑定任务状态: ${newStatus}`)
      return {
        type: 'applied',
        taskId: task.noteId,
        newStatus: newStatus
      }
    }
    
    if (activeTasks.length > 1) {
      // 多个活跃任务，让用户选择
      const options = activeTasks.map(t => {
        const titleParts = MNTaskManager.parseTaskTitle(t.note.noteTitle)
        return `【${titleParts.type}｜${titleParts.status}】${titleParts.content}`
      })
      
      const selectedIndex = await MNUtil.userSelect(
        '选择要更新的任务',
        `发现 ${activeTasks.length} 个绑定的任务`,
        options
      )
      
      if (selectedIndex === 0) {
        return {
          type: 'cancelled',
          reason: '用户取消选择'
        }
      }
      
      const selectedTask = activeTasks[selectedIndex - 1]
      MNTaskManager.updateTaskStatus(selectedTask.note, newStatus)
      MNUtil.showHUD(`✅ 已更新任务状态: ${newStatus}`)
      return {
        type: 'applied',
        taskId: selectedTask.noteId,
        newStatus: newStatus
      }
    }
    
    // 没有活跃任务，都是已完成/归档的
    MNUtil.showHUD('⚠️ 所有绑定的任务都已完成或归档')
    return {
      type: 'skipped',
      reason: '所有任务都已完成或归档'
    }
  }
}

/**
 * MNTaskManager 类结束
 */

/**
 * TaskFilterEngine 类 - 任务筛选引擎
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
      
      // 注释掉详细日志
      // if (typeof MNUtil !== 'undefined' && MNUtil.log) {
      //   MNUtil.log(`🔍 开始从看板 ${boardKey} 收集任务`)
      // }
      
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
          
          // 注释掉详细日志，减少日志输出
          // if (typeof MNUtil !== 'undefined' && MNUtil.log) {
          //   MNUtil.log(`🔍 找到任务卡片：${childNote.noteTitle.substring(0, 50)}...`)
          // }
          
          // 应用筛选条件
          if (this.matchesCriteria(childNote, criteria)) {
            results.push(childNote)
            // 注释掉详细日志
            // if (typeof MNUtil !== 'undefined' && MNUtil.log) {
            //   MNUtil.log(`✅ 任务符合筛选条件`)
            // }
          } else {
            // 注释掉详细日志
            // if (typeof MNUtil !== 'undefined' && MNUtil.log) {
            //   MNUtil.log(`❌ 任务不符合筛选条件`)
            // }
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

  /**
   * 获取常用应用列表
   * @returns {Array} 应用列表
   */
  static getCommonApps() {
    return [
      { name: "Things 3", scheme: "things:" },
      { name: "OmniFocus", scheme: "omnifocus:" },
      { name: "Todoist", scheme: "todoist:" },
      { name: "Reminders", scheme: "x-apple-reminderkit:" },
      { name: "Calendar", scheme: "calshow:" },
      { name: "Safari", scheme: "http://" },
      { name: "Mail", scheme: "mailto:" },
      { name: "Notes", scheme: "mobilenotes:" },
      { name: "Shortcuts", scheme: "shortcuts:" },
      { name: "Files", scheme: "shareddocuments:" }
    ];
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

/**
 * TaskDataExtractor - 任务数据提取和转换类
 * 用于从看板卡片中提取任务数据并转换为元数据格式
 */
class TaskDataExtractor {
  // ========== 性能优化：调试模式控制 ==========
  static debugMode = false  // 默认关闭详细日志
  
  /**
   * 切换调试模式
   * @param {boolean} enable - 是否启用调试模式
   */
  static setDebugMode(enable) {
    this.debugMode = enable
    MNUtil.log(`⚙️ TaskDataExtractor 调试模式: ${enable ? '开启' : '关闭'}`)
  }
  
  /**
   * 从看板卡片中提取所有任务卡片
   * @param {string} boardNoteId - 看板卡片的 ID
   * @returns {Array} 任务元数据数组
   */
  static async extractTasksFromBoard(boardNoteId) {
    if (this.debugMode) {
      MNUtil.log(`🔍 开始从看板提取任务: ${boardNoteId}`)
    }
    
    if (!boardNoteId) {
      MNUtil.log("❌ 看板 ID 为空")
      return []
    }
    
    try {
      const boardNote = MNNote.new(boardNoteId)
      if (!boardNote) {
        MNUtil.log(`❌ 看板卡片不存在: ${boardNoteId}`)
        return []
      }
      
      // 获取看板卡片的所有子卡片
      const childNotes = boardNote.childNotes || []
      
      const allTasks = []
      const errors = []
      let processedCards = 0  // 统计处理的卡片数
      
      // 递归函数：遍历卡片树，提取所有任务卡片
      const collectAllTasksRecursively = async (note, depth = 0) => {
        processedCards++
        try {
          // 判断是否是任务卡片
          if (MNTaskManager.isTaskCard(note)) {
            if (this.debugMode) {
              const indent = '  '.repeat(depth)
              MNUtil.log(`${indent}📋 处理任务: ${note.noteTitle}`)
            }
            
            // 转换当前任务并清除 including 字段（因为我们已经递归收集所有任务）
            const taskData = await this.convertTaskToMetadata(note)
            if (taskData) {
              // 清除 including 字段，避免重复（所有任务都会被递归收集）
              taskData.including = []
              allTasks.push(taskData)
            }
          }
          
          // 递归处理所有子卡片（不管当前卡片是否是任务卡片）
          const childNotes = note.childNotes || []
          if (childNotes.length > 0) {
            for (let i = 0; i < childNotes.length; i++) {
              await collectAllTasksRecursively(childNotes[i], depth + 1)
            }
          }
        } catch (error) {
          errors.push(`处理卡片时出错 (层级 ${depth}): ${error.message}`)
          if (this.debugMode) {
            MNUtil.log(`⚠️ 处理卡片时出错 (层级 ${depth}): ${error.message}`)
          }
        }
      }
      
      // 遍历所有直接子卡片，递归收集所有任务
      for (let i = 0; i < childNotes.length; i++) {
        const childNote = childNotes[i]
        await collectAllTasksRecursively(childNote, 0)
      }
      
      // ========== 性能优化：仅输出摘要信息 ==========
      MNUtil.log(`✅ 提取完成: ${allTasks.length} 个任务 / ${processedCards} 张卡片${errors.length > 0 ? ` (⚠️ ${errors.length} 个错误)` : ''}`)
      
      if (this.debugMode && errors.length > 0) {
        errors.forEach(err => MNUtil.log(`  - ${err}`))
      }
      
      return allTasks
      
    } catch (error) {
      MNUtil.log(`❌ 提取任务失败: ${error.message}`)
      if (typeof MNUtil !== 'undefined' && MNUtil.addErrorLog) {
        MNUtil.addErrorLog(error, "TaskDataExtractor.extractTasksFromBoard", {
          boardNoteId,
          message: error.message
        })
      }
      return []
    }
  }
  
  /**
   * 将任务卡片转换为元数据格式
   * @param {MNNote} note - 任务卡片对象
   * @returns {Object|null} 任务元数据对象
   */
  static async convertTaskToMetadata(note) {
    if (!note || !note.noteTitle) {
      return null
    }
    
    try {
      // 解析任务标题
      const titleInfo = MNTaskManager.parseTaskTitle(note.noteTitle)
      
      // 解析任务评论获取字段信息
      const parsedData = MNTaskManager.parseTaskComments(note)
      
      // 如果标题解析失败，尝试从评论中识别任务类型
      let taskType = titleInfo?.type
      let taskStatus = titleInfo?.status || '未开始'
      let taskContent = titleInfo?.content || note.noteTitle
      let taskPath = titleInfo?.path || ''
      
      if (!taskType) {
        // 检查是否有任务字段（信息、包含等）来判断是否是任务卡片
        if (parsedData.info || parsedData.contains || parsedData.taskFields.length > 0) {
          // 尝试从评论中识别任务类型
          if (parsedData.contains) {
            taskType = '项目'  // 有"包含"字段的通常是项目
          } else if (note.childNotes && note.childNotes.length > 0) {
            taskType = '目标'  // 有子卡片的可能是目标
          } else {
            taskType = '动作'  // 默认为动作
          }
          MNUtil.log(`⚠️ 从字段推断任务类型: ${taskType}`)
        } else {
          // 不是任务卡片
          return null
        }
      }
      
      MNUtil.log(`📝 转换任务: ${note.noteTitle}`)
      
      // 构建任务元数据（与 testData.js 格式保持一致）
      const metadata = {
        id: note.noteId,
        url: `marginnote4app://note/${note.noteId}`,
        type: taskType,  // 保持中文类型，不进行转换
        title: taskContent,  // 使用 title 而非 titleContent
        path: taskPath,  // 使用 path 而非 titlePath
        status: taskStatus,
        priority: '低',  // 默认优先级为低
        description: '',
        launchLink: '',
        parentTitle: '',
        parentURL: '',
        progresses: [],
        including: [],
        // 为了兼容性，同时保留原始字段名
        titleContent: taskContent,
        titlePath: taskPath,
        // 添加 fields 对象以支持 HTML 端的筛选功能
        fields: {
          priority: '低',  // 默认优先级
          tags: [],  // 标签数组
          project: '',  // 项目名称
          progressLog: [],  // 进展日志
          plannedDate: null,
          today: false,
          startTime: null,
          endTime: null
        }
      }
      
      // 提取任务描述（信息字段后的第一个纯文本评论）
      if (parsedData.info && parsedData.plainTextComments && parsedData.plainTextComments.length > 0) {
        // 查找信息字段后的第一个纯文本评论
        const infoIndex = parsedData.info.index
        for (const textComment of parsedData.plainTextComments) {
          if (textComment.index > infoIndex) {
            metadata.description = textComment.text
            break
          }
        }
      }
      
      // 使用 getLaunchLink 方法提取启动链接
      const launchLink = MNTaskManager.getLaunchLink(note)
      if (launchLink) {
        metadata.launchLink = launchLink
        MNUtil.log(`  - 启动链接: ${launchLink}`)
      }
      
      // 提取所属信息（使用 getIncludingCommentIndex 查找）
      const belongsIndex = note.getIncludingCommentIndex("所属")
      if (belongsIndex !== -1 && belongsIndex + 1 < note.MNComments.length) {
        // 所属字段的下一个评论通常包含父任务链接
        const nextComment = note.MNComments[belongsIndex + 1]
        if (nextComment && nextComment.text) {
          const match = nextComment.text.match(/\[([^\]]+)\]\(([^)]+)\)/)
          if (match) {
            metadata.parentTitle = match[1]
            metadata.parentURL = match[2]
            MNUtil.log(`  - 所属: ${metadata.parentTitle}`)
            
            // 如果父任务是项目类型，设置 project 字段
            const parentTitleInfo = MNTaskManager.parseTaskTitle(metadata.parentTitle)
            if (parentTitleInfo && parentTitleInfo.type === '项目') {
              metadata.fields.project = parentTitleInfo.content
              MNUtil.log(`  - 项目: ${metadata.fields.project}`)
            }
          }
        }
      }
      
      // 提取进展信息
      if (parsedData.progress) {
        const progressIndex = parsedData.progress.index
        const progresses = []
        
        // 收集进展字段后的所有文本评论，直到遇到下一个字段
        for (let i = progressIndex + 1; i < note.MNComments.length; i++) {
          const comment = note.MNComments[i]
          if (!comment) continue
          
          const text = comment.text || ''
          // 如果遇到新的字段，停止收集
          if (TaskFieldUtils.isTaskField(text)) break
          
          // 只收集纯文本评论
          if (comment.type === 'textComment' || comment.type === 'markdownComment') {
            if (text && !TaskFieldUtils.isTaskField(text)) {
              progresses.push(text)
            }
          }
        }
        
        metadata.progresses = progresses
        // 同时更新 fields.progressLog 以支持 HTML 端
        metadata.fields.progressLog = progresses.map(text => ({
          date: new Date().toLocaleString('zh-CN'),
          note: text
}))
      }
      
      // 提取优先级信息
      const priority = TaskFieldUtils.getFieldContent(note, '优先级')
      if (priority) {
        metadata.priority = priority
        metadata.fields.priority = priority
      }
      
      // 提取标签信息
      const tags = TaskFieldUtils.getFieldContent(note, '标签')
      if (tags) {
        // 标签可能是逗号、空格或其他分隔符分隔的字符串
        metadata.fields.tags = tags.split(/[,，\s]+/).filter(tag => tag.trim().length > 0)
        MNUtil.log(`  - 标签: ${metadata.fields.tags.join(', ')}`)
      }
      
      // 如果是项目或目标类型，递归提取子任务
      if (taskType === '项目' || taskType === '目标') {
        const childNotes = note.childNotes || []
        for (let i = 0; i < childNotes.length; i++) {
          try {
            const childNote = childNotes[i]
            const childData = await this.convertTaskToMetadata(childNote)
            if (childData) {
              metadata.including.push(childData)
            }
          } catch (error) {
            MNUtil.log(`⚠️ 处理子任务 ${i} 时出错: ${error.message}`)
          }
        }
      }
      
      // 数据验证日志
      MNUtil.log(`✅ 任务元数据构建完成:`)
      MNUtil.log(`  - ID: ${metadata.id}`)
      MNUtil.log(`  - 类型: ${metadata.type}`)
      MNUtil.log(`  - 标题: ${metadata.title}`)
      MNUtil.log(`  - 状态: ${metadata.status}`)
      MNUtil.log(`  - 优先级: ${metadata.priority}`)
      MNUtil.log(`  - 路径: ${metadata.path || '(无)'}`)
      MNUtil.log(`  - 子任务数: ${metadata.including.length}`)
      
      // 验证必要字段
      if (!metadata.id || !metadata.type || !metadata.title) {
        MNUtil.log(`⚠️ 任务数据缺少必要字段:`)
        MNUtil.log(`  - ID: ${metadata.id ? '✓' : '✗'}`)
        MNUtil.log(`  - 类型: ${metadata.type ? '✓' : '✗'}`)
        MNUtil.log(`  - 标题: ${metadata.title ? '✓' : '✗'}`)
      }
      
      return metadata
      
    } catch (error) {
      MNUtil.log(`❌ 转换任务元数据失败: ${error.message}`)
      MNUtil.log(`任务标题: ${note.noteTitle}`)
      if (typeof MNUtil !== 'undefined' && MNUtil.addErrorLog) {
        MNUtil.addErrorLog(error, "TaskDataExtractor.convertTaskToMetadata", {
          noteId: note.noteId,
          noteTitle: note.noteTitle,
          message: error.message
        })
      }
      return null
    }
  }
  
  /**
   * 标准化任务类型
   * @param {string} type - 原始类型
   * @returns {string} 标准化后的类型 (action/project/target/keyresult)
   */
  static normalizeTaskType(type) {
    const typeMap = {
      '动作': 'action',
      '项目': 'project',
      '目标': 'target',
      '关键结果': 'keyresult'
    }
    return typeMap[type] || type.toLowerCase()
  }
  
  /**
   * 从字段中提取启动链接
   * @param {Array} fields - 字段数组
   * @returns {string|null} 启动链接
   */
  static extractLaunchLink(fields) {
    for (const field of fields) {
      if (field.type === 'field' && field.name && field.name.includes('[启动]')) {
        // 从 Markdown 链接格式中提取 URL
        const match = field.name.match(/\[启动\]\(([^)]+)\)/)
        if (match) {
          return match[1]
        }
      }
    }
    return null
  }
  
  /**
   * 从字段中提取所属信息
   * @param {Array} fields - 字段数组
   * @returns {Object|null} 包含 title 和 url 的对象
   */
  static extractBelongsTo(fields) {
    for (const field of fields) {
      if (field.type === 'field' && field.name === '所属' && field.value) {
        // 解析 Markdown 链接格式 [标题](URL)
        const match = field.value.match(/\[([^\]]+)\]\(([^)]+)\)/)
        if (match) {
          return {
            title: match[1],
            url: match[2]
          }
        }
      }
    }
    return null
  }
  
  /**
   * 从字段中提取进展信息
   * @param {Array} fields - 字段数组
   * @returns {Array} 进展数组
   */
  static extractProgresses(fields) {
    const progresses = []
    let inProgressSection = false
    
    for (const field of fields) {
      if (field.type === 'field' && field.name === '进展') {
        inProgressSection = true
        continue
      }
      
      if (inProgressSection && field.type === 'plainText') {
        // 解析进展格式：时间戳 + 内容
        const timeMatch = field.text.match(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2})/)
        if (timeMatch) {
          const time = timeMatch[1]
          const content = field.text.substring(timeMatch.index + timeMatch[0].length).trim()
          progresses.push({ time, content })
        }
      }
      
      // 遇到下一个主字段时结束进展提取
      if (inProgressSection && field.type === 'field' && field.name !== '进展') {
        break
      }
    }
    
    return progresses
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