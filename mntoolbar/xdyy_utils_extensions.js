/**
 * 夏大鱼羊的 toolbarUtils 扩展函数
 * 通过 prototype 方式扩展 toolbarUtils 类的功能
 */

/**
 * 初始化扩展
 * 需要在 toolbarUtils 定义后调用
 */
function initXDYYExtensions() {
  // 扩展 defaultWindowState 配置
  if (toolbarUtils.defaultWindowState) {
    toolbarUtils.defaultWindowState.preprocess = false;
  }
  
  // OKR 任务管理相关函数
  
  /**
   * 获取卡片的标题
   * 如果没有【】前缀，就是原标题
   * 如果有【】前缀，则获取去掉【】前缀后的内容
   */
  toolbarUtils.getOKRNoteTitle = function(note) {
    let title = note.noteTitle
    const regex = /^\【.*?\】(.*)$/; // 匹配前面的【...】内容
    const match = title.match(regex); // 进行正则匹配

    if (match) {
      return match[1].trim(); // 返回去掉前面内容后的字符串
    } else {
      return title; // 如果没有前面的【...】内容，返回原内容
    }
  }

  /**
   * 根据是否有前缀来判断是否制卡
   */
  toolbarUtils.ifOCRNoteHandled = function(note) {
    let title = note.noteTitle
    const regex = /^\【.*?\】.*$/; // 匹配前面的【...】内容
    const match = title.match(regex); // 进行正则匹配

    return match ? true : false;
  }

  /**
   * 获取任务卡片的类型
   * 
   * - 目标
   * - 关键结果
   * - 项目
   * - 任务
   */
  toolbarUtils.getOKRNoteTypeObj = function(note) {
    let noteType = {}
    switch (note.colorIndex) {
      case 1:
        noteType.zh = "目标"
        noteType.en = "objective"
        break;
      case 2:
      case 3:
      case 12:
        noteType.zh = "任务"
        noteType.en = "task"
        break;
      case 0:
      case 11:
        noteType.zh = "关键结果"
        noteType.en = "keyresult"
        break;
      case 6:
      case 7:
        noteType.zh = "项目"
        noteType.en = "project"
        break;
      case 13:
        // 如果是灰色，就需要看标题的前缀
        noteType.zh = this.getOKRNoteZhTypeByTitlePrefix(note)
        break;
    }
    return noteType
  }

  toolbarUtils.getOKRNoteZhTypeByTitlePrefix = function(note) {
    let type
    if (this.ifOCRNoteHandled(note)) {
      let title = note.noteTitle
      const regex = /^\【(.*?)\】.*$/; // 匹配前面的【...】内容
      const match = title.match(regex); // 进行正则匹配

      if (match) {
        // 匹配到 xxx：yyy｜zzz 的 xxx
        type = match[1].match(/^(.*?)：/)?.[1]
      } else {
        type = this.getOKRNoteTypeObj(note).zh
      }
    } else {
      type = this.getOKRNoteTypeObj(note).zh
    }
    return type
  }

  /**
   * 获取关键结果卡片
   * 
   * 主要因为项目的父卡片仍然可能是项目，所以需要递归获取
   */
  toolbarUtils.getKeyResultNote = function(note) {
    let keyResultNote = note.parentNote
    while (keyResultNote && this.getOKRNoteTypeObj(keyResultNote).zh !== "关键结果") {
      keyResultNote = keyResultNote.parentNote
    }
    return keyResultNote
  }

  /**
   * 获取目标卡片
   * 
   * 主要因为项目的父卡片仍然可能是项目，所以需要递归获取
   */
  toolbarUtils.getGoalNote = function(note) {
    let goalNote = note.parentNote
    while (goalNote && this.getOKRNoteTypeObj(goalNote).zh !== "目标") {
      goalNote = goalNote.parentNote
    }
    return goalNote
  }

  /**
   * 获取所有的父辈项目卡片 Arr
   * 
   * 只考虑一条线，即 parentNote,  parentNote.parentNote, ...
   */
  toolbarUtils.getParentProjectNotesArr = function(note) {
    let parentProjectNotes = []
    let parentNote = note.parentNote
    while (parentNote && this.getOKRNoteTypeObj(parentNote).zh == "项目") {
      parentProjectNotes.push(parentNote)
      parentNote = parentNote.parentNote
    }
    return parentProjectNotes
  }

  /**
   * 获取前缀对象
   */
  toolbarUtils.getPrefixObj = function(note) {
    let zhType = this.getOKRNoteTypeObj(note).zh
    let prefix = {}
    let goalNote, keyResultNote, parentProjectNotesArr
    switch (zhType) {
      case "目标":
        prefix.type = "目标"
        // prefix.path = ""
        break;
      case "关键结果":
        prefix.type = "关键结果"
        goalNote = this.getGoalNote(note)
        prefix.path = this.getOKRNoteTitle(goalNote)
        break;
      case "项目":
        // 注意：可能存在项目下方还是项目
        prefix.type = "项目"
        goalNote = this.getGoalNote(note)
        keyResultNote = this.getKeyResultNote(note)
        prefix.path = this.getOKRNoteTitle(goalNote) + "→" + this.getOKRNoteTitle(keyResultNote)
        parentProjectNotesArr = this.getParentProjectNotesArr(note)
        if (parentProjectNotesArr.length > 0) {
          parentProjectNotesArr.forEach(parentProjectNote => {
            prefix.path += "→" + this.getOKRNoteTitle(parentProjectNote)
          })
        }
        break;
      case "任务":
        prefix.type = "任务"
        prefix.path = this.getPrefixObj(note.parentNote).path + "→" + this.getOKRNoteTitle(note.parentNote)
        break;
    }
    return prefix
  }

  /**
   * 获取任务状态
   * 
   * - 没有前缀：未开始
   * - 有前缀：获取前缀
   */
  toolbarUtils.getOCRNoteStatus = function(note) {
    let status
    let title = note.noteTitle
    const regex = /【.*?：([^｜】]+)(?:｜.*)?】/; // 匹配前面的【...】内容
    const match = title.match(regex); // 进行正则匹配

    if (match) {
      status = match[1].trim()
    } else {
      status = undefined
    }

    return status
  }

  /**
   * 更新卡片状态
   * 
   * 未开始 -> 进行中 -> 已完成
   * 
   * 如果 status 是 undefined，则返回"未开始"
   * 如果 status 是"未开始"，则返回"进行中"
   * 如果 status 是"进行中"，则返回"已完成"
   * 如果 status 是"已完成"，则返回"已完成"
   */
  toolbarUtils.updateOCRNoteStatus = function(status) {
    let newStatus
    switch (status) {
      case undefined:
        newStatus = "未开始"
        break;
      case "未开始":
        newStatus = "进行中"
        break;
      case "进行中":
      case "已完成":
        newStatus = "已完成"
        break;
    }
    return newStatus
  }

  toolbarUtils.undoOCRNoteStatus = function(status) {
    let newStatus
    switch (status) {
      case "未开始":
      case "进行中":
        newStatus = "未开始"
        break;
      case "已完成":
        newStatus = "进行中"
        break;
    }
    return newStatus
  }

  /**
   * 清除时间类标签
   */
  toolbarUtils.clearTimeTag = function(note) {
    for (let i = note.comments.length - 1; i >= 0; i--) {
      let comment = note.comments[i]
      if (comment.type == "TextNote" && comment.text.startsWith("#时间")) {
        note.removeCommentByIndex(i)
      }
    }
  }

  /**
   * 增加当天的时间 tag
   */
  toolbarUtils.addTodayTimeTag = function(note) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');  // 月份从0开始，需+1
    const date = String(today.getDate()).padStart(2, '0');  // 确保日期为两位数
    const formattedDate = `#时间/${year}/${month}/${date}`;
    if (!this.hasTodayTimeTag(note)) {
      note.appendMarkdownComment(formattedDate)
    }
  }

  /**
   * 更新时间标签
   * 
   * - 先将时间标签分割
   * - 删除今日前的时间标签
   * - 增加当天的时间标签
   */
  toolbarUtils.updateTimeTag = function(note) {
    this.splitTimeTag(note)
    this.clearBeforeTodayTimeTag(note)
    this.addTodayTimeTag(note)
  }

  /**
   * 更新当天的标签
   */
  toolbarUtils.updateTodayTimeTag = function(note) {
    this.clearTimeTag(note)
    this.addTodayTimeTag(note)
  }

  /**
   * 删除今日前的时间标签
   */
  toolbarUtils.clearBeforeTodayTimeTag = function(note) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');  // 月份从0开始，需+1
    const date = String(today.getDate()).padStart(2, '0');  // 确保日期为两位数
    for (let i = note.comments.length - 1; i >= 0; i--) {
      let comment = note.comments[i]
      if (comment.type == "TextNote" && comment.text.startsWith("#时间")) {
        let oldTimeArr = comment.text.split("/")
        let oldYear = parseInt(oldTimeArr[1])
        let oldMonth = parseInt(oldTimeArr[2])
        let oldDate = parseInt(oldTimeArr[3])

        if (oldYear < year) {
          note.removeCommentByIndex(i)
          continue
        } else {
          if (oldMonth < month) {
            note.removeCommentByIndex(i)
            continue
          } else {
            if (oldDate < date) {
              note.removeCommentByIndex(i)
            }
            continue
          }
        }
      }
    }
  }

  /**
   * 把 MN 生成的连续型的 tag 分成多条 tag
   * 
   * MN 自带的添加为"#时间/2024/12/09 #时间/2024/12/10"
   * 需要将这个分成多条，然后依次添加为评论
   * 
   * 1. 找到所有的时间 tag，存起来
   * 2. 删除所有的时间 tag
   * 3. 依次添加为评论
   * 
   * [TODO] 目前有个问题是此时 tag 不能包含时间外的，否则也会被清除
   * [TODO] 增加一个排序功能
   */
  toolbarUtils.splitTimeTag = function(note) {
    let timeTags = []
    for (let i = note.comments.length - 1; i >= 0; i--) {
      let comment = note.comments[i]
      if (comment.type == "TextNote" && comment.text.includes("#时间")) {
        let timeTagArr = comment.text.split(" ")
        timeTagArr.forEach(timeTag => {
          timeTags.push(timeTag.trim())
        })
        note.removeCommentByIndex(i)
      }
    }
    timeTags.forEach(timeTag => {
      note.appendMarkdownComment(timeTag)
    })
  }

  /**
   * 判断是否有当天日期的 tag 了
   */
  toolbarUtils.hasTodayTimeTag = function(note) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');  // 月份从0开始，需+1
    const date = String(today.getDate()).padStart(2, '0');  // 确保日期为两位数
    const formattedDate = `#时间/${year}/${month}/${date}`;
    let hasTimeTag = false
    for (let i = 0; i < note.comments.length; i++) {
      let comment = note.comments[i]
      if (comment.type == "TextNote" && comment.text.includes(formattedDate)) {
        hasTimeTag = true
        break
      }
    }
    return hasTimeTag
  }

  /**
   * 任务管理卡片制卡
   */
  toolbarUtils.OKRNoteMake = function(note, undoStatus = false) {
    /**
     * 更新链接
     */
    note.renewLinks()

    /**
     * 转换为非摘录版本
     */
    if (note.excerptText) {
      note.toNoExceptVersion()
    }
    /**
     * 获取 note 的信息
     */
    let status = this.getOCRNoteStatus(note)// 任务状态
    let noteInformation = {
      title: this.getOKRNoteTitle(note),
      zhType: status == "已完成" ? this.getOKRNoteZhTypeByTitlePrefix(note) : this.getOKRNoteTypeObj(note).zh,
      prefix: this.getPrefixObj(note),
    }
    if (undoStatus) {
      status = this.undoOCRNoteStatus(status) // 更新任务状态
    } else {
      status = this.updateOCRNoteStatus(status) // 更新任务状态
    }

    // 分割时间标签
    this.splitTimeTag(note)

    switch (status) {
      case "进行中":
        if (noteInformation.zhType == "任务") {
          // 任务只需要保留当天的时间标签
          this.updateTodayTimeTag(note)
        } else {
          // 其余的需要加上当天的时间标签
          this.updateTimeTag(note)
        }
        break;
      case "已完成":
        this.clearTimeTag(note)
        break;
    }

    switch (noteInformation.zhType) {
      case "任务":
        switch (status) {
          case "未开始":
            note.colorIndex = 12
            break;
          case "进行中":
            note.colorIndex = 3
            break;
          case "已完成":
            note.colorIndex = 13
            break;
        }
        break;
      case "关键结果":
        switch (status) {
          case "未开始":
            note.colorIndex = 0
            break;
          case "进行中":
            note.colorIndex = 11
            break;
          case "已完成":
            note.colorIndex = 13
            break;
        }
        break;
      case "项目":
        switch (status) {
          case "未开始":
            note.colorIndex = 6
            break;
          case "进行中":
            note.colorIndex = 7
            break;
          case "已完成":
            note.colorIndex = 13
            break;
        }
        break;
    }
    /**
     * 修改标题前缀
     */
    let prefixString
    prefixString = noteInformation.prefix.path == undefined ?
      "【" + noteInformation.prefix.type + "：" + status + "】" :
      "【" + noteInformation.prefix.type + "：" + status + "｜" + noteInformation.prefix.path + "】"

    note.noteTitle = prefixString + noteInformation.title

    /**
     * 链接到父卡片
     */
    let parentNote = note.parentNote
    let noteIdInParentNote = parentNote.getCommentIndex(note.noteURL)
    if (status == "已完成") {
      // 如果已完成，就把父卡片中的链接去掉
      if (noteIdInParentNote !== -1) {
        parentNote.removeCommentByIndex(noteIdInParentNote)
      }
    } else {
      if (noteIdInParentNote == -1) {
        parentNote.appendNoteLink(note, "To")
      } else {
        parentNote.moveComment(noteIdInParentNote, parentNote.comments.length - 1)
      }
    }

    note.refreshAll()
  }

  /**
   * 批量获取卡片 ID 存到 Arr 里
   */
  toolbarUtils.getNoteIdArr = function(notes) {
    let idsArr = []
    notes.forEach(note => {
      idsArr.push(note.noteId)
    })
    return idsArr
  }

  /**
   * 批量获取卡片 URL 存到 Arr 里
   */
  toolbarUtils.getNoteURLArr = function(notes) {
    let idsArr = []
    notes.forEach(note => {
      idsArr.push(note.noteURL)
    })
    return idsArr
  }

  toolbarUtils.TemplateMakeNote = function(note) {
    /**
     * 场景：
     * 1. Inbox 阶段
     *   - 没有父卡片也能制卡
     *   - 根据颜色制卡
     *   - 归类卡片支持单独制卡
     * 2. 归类卡片阶段
     *   - 移动知识点卡片归类制卡完成链接操作
     *   - 移动归类卡片也可完成归类操作
     */
    if (note.ifIndependentNote()) {
      // 如果是独立卡片（比如非知识库里的卡片），只进行转化为非摘录版本
      note.title = Pangu.spacing(note.title)
      note.toNoExceptVersion()
    } else {
      /** 
       * 【Done】处理旧卡片
       */
      note.renew()

      if (!note.excerptText) {
        /**
         * 【Done】处理标题
         * - 知识类卡片增加标题前缀
         * - 黄色归类卡片：""：""相关 xx
         * - 绿色归类卡片：""相关 xx
         * - 处理卡片标题空格
         * 
         * 需要放在修改链接前，因为可能需要获取到旧归类卡片的标题来对标题修改进行处理
         */

        note.changeTitle()

        /**
         * 【Done】合并模板卡片
         */
        note.mergeTemplate()

        /**
         * 【Done】根据卡片类型修改卡片颜色
         */
        note.changeColorByType()

        /**
         * 【Done】自动移动新内容（到固定位置）
         * 
         * 放在 linkParentNote 后面，否则会干扰自动链接移动
         */
        note.autoMoveNewContent()

        /**
         * 【Done】与父卡片进行链接
         */
        note.linkParentNote()

        /**
         * 【Done】加入复习
         * 
         * 什么时候需要加入复习
         * - 制卡的那次需要加入
         * - 后续点击制卡都不需要加入
         */
        // note.addToReview()
        // if (!note.ifReferenceNote()) {
        //   note.addToReview()
        // }

        // 移动文献卡片
        // note.move()
      }
    }
    /**
     * 【Done】聚焦
     */
    note.focusInMindMap(0.2)

    /**
     * 刷新
     */
    note.refresh()
    note.refreshAll()
  }

  toolbarUtils.isValidNoteId = function(noteId) {
    const regex = /^[0-9A-Z]{8}-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{12}$/;
    return regex.test(noteId);
  }

  toolbarUtils.getNoteIdFromClipboard = function() {
    let noteId = MNUtil.clipboardText
    if (/^marginnote\dapp:\/\/note\//.test(noteId)) {
      noteId = noteId.slice(22)
      return noteId
    } else if (
      this.isValidNoteId(noteId)
    ) {
      return noteId
    } else {
      MNUtil.showHUD("剪切板中不是有效的卡片 ID 或 URL")
      return null
    }
  }

  /**
   * 切换卡片预处理模式的开关功能
   */
  toolbarUtils.togglePreprocess = function() {
    if (!toolbarUtils.checkSubscribe(true)) {
      return
    }
    if (toolbarConfig.getWindowState("preprocess") === false) {
      toolbarConfig.windowState.preprocess = true
      toolbarConfig.save("MNToolbar_windowState")
      MNUtil.showHUD("卡片预处理模式：✅ 开启")
    } else {
      toolbarConfig.windowState.preprocess = false
      toolbarConfig.save("MNToolbar_windowState")
      MNUtil.showHUD("卡片预处理模式：❌ 关闭")
    }
    MNUtil.postNotification("refreshToolbarButton", {})
  }
}

/**
 * 扩展 toolbarConfig init 方法
 * 在 toolbarConfig.init() 调用后调用
 */
function extendToolbarConfigInit() {
  // 保存原始的 init 方法
  const originalInit = toolbarConfig.init
  
  // 重写 init 方法
  toolbarConfig.init = function() {
    // 调用原始的 init 方法
    originalInit.call(this)
    
    // 添加扩展的初始化逻辑
    // 用来存参考文献的数据
    toolbarConfig.referenceIds = this.getByDefault("MNToolbar_referenceIds", {})
  }
}

// 导出初始化函数
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initXDYYExtensions,
    extendToolbarConfigInit
  }
}