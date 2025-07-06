/**
 * 夏大鱼羊的 taskUtils 扩展函数
 * 通过 prototype 方式扩展 taskUtils 类的功能
 */

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
    
    // 先使用 MNMath.toNoExcerptVersion 处理摘录卡片
    let noteToConvert = focusNote
    if (focusNote.excerptText) {
      // 检查是否有 MNMath 类
      if (typeof MNMath !== 'undefined' && MNMath.toNoExcerptVersion) {
        const converted = MNMath.toNoExcerptVersion(focusNote)
        if (converted) {
          noteToConvert = converted
        }
      } else {
        // 如果没有 MNMath，尝试手动加载 mnutils
        try {
          JSB.require('mnutils')
          if (typeof MNMath !== 'undefined' && MNMath.toNoExcerptVersion) {
            const converted = MNMath.toNoExcerptVersion(focusNote)
            if (converted) {
              noteToConvert = converted
            }
          }
        } catch (e) {
          // 如果还是不行，继续使用原卡片
        }
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
      
      // 添加三个状态子字段
      const statuses = ['未开始', '进行中', '已完成']
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