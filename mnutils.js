/**
 * 夏大鱼羊 - Begin
 */

class MNMath {
  /** 
   * TODO：
   * - 增加模板功能复制的内容的正则表达式要改
   * - 制卡时的识别归类卡片的标题的正则表达式要改
   * - 原来的归类卡片的标题要改成心得格式
   *   - 要能批量修改
   * 
   */



  /**
   * 卡片类型
   * 
   * refName: “xxx”：“yyy”相关 zz 里的 zz
   * prefixName: 【xxx：yyyy】zzz 里的 xxx
   * englishName: 对应的英文翻译
   * templateNoteId: 对应模板卡片的 ID
   * ifIndependent: 是否是独立卡片，决定了卡片的标题处理是按照归类卡片还是上一级卡片的标题进行处理
   * colorIndex: 对应的卡片颜色索引
   * fields: 字段
   */
  static types = {
    定义: {
      refName: '定义',
      prefixName: '定义',
      englishName: 'definition',
      templateNoteId: '78D28C80-C4AC-48D1-A8E0-BF01908F6B60',
      ifIndependent: false,
      colorIndex: 2,  // 淡蓝色
      fields: [
        "相关思考",
        "相关链接"
      ]
    },
    命题: {
      refName: '命题',
      prefixName: '命题',
      englishName: 'proposition',
      templateNoteId: 'DDF06F4F-1371-42B2-94C4-111AE7F56CAB',
      ifIndependent: false,
      colorIndex: 10, // 深蓝色
      fields: [
        "证明",
        "相关思考",
        "关键词： ",
        "相关链接",
        "应用",
      ]
    },
    例子: {
      refName: '例子',
      prefixName: '例子',
      englishName: 'example',
      templateNoteId: 'DDF06F4F-1371-42B2-94C4-111AE7F56CAB',
      ifIndependent: false,
      colorIndex: 15,  // 紫色
      fields: [
        "证明",
        "相关思考",
        "关键词： ",
        "相关链接",
        "应用",
      ]
    },
    反例: {
      refName: '反例',
      prefixName: '反例',
      englishName: 'counterexample',
      templateNoteId: '4F85B579-FC0E-4657-B0DE-9557EDEB162A',
      ifIndependent: false,
      colorIndex: 3,  // 粉色
      fields: [
        "反例",
        "相关思考",
        "关键词： ",
        "相关链接",
        "应用",
      ]
    },
    归类: {
      refName: '归类',
      prefixName: '归类',
      englishName: 'classification',
      templateNoteId: '68CFDCBF-5748-448C-91D0-7CE0D98BFE2C',
      ifIndependent: false,
      colorIndex: 0,  // 淡黄色
      fields: [
        "所属",
        "相关思考",
        "包含"
      ]
    },
    思想方法: {
      refName: '思想方法',
      prefixName: '思想方法',
      englishName: 'thoughtMethod',
      templateNoteId: '38B7FA59-8A23-498D-9954-A389169E5A64',
      ifIndependent: false,
      colorIndex: 9,  // 深绿色
      fields: [
        "原理",
        "相关思考",
        "关键词： ",
        "相关链接",
        "应用",
      ]
    },
    问题: {
      refName: '问题',
      prefixName: '问题',
      englishName: 'question',
      templateNoteId: 'BED89238-9D63-4150-8EB3-4AAF9179D338',
      ifIndependent: false,
      colorIndex: 1,  // 淡绿色
      fields: [
        "问题详情",
        "研究脉络",
        "研究思路",
        "研究结论",
        "相关思考",
        "相关链接",  // 相关链接放在最后是为了能够自动识别最新的内容，方便后续移动，否则如果是相关思考放在最后的话，就会被“误触”
      ]
    },
    思路: {
      refName: '思路',
      prefixName: '思路',
      englishName: 'idea',
      templateNoteId: '6FF1D6DB-3349-4617-9972-FC55BFDCB675',
      ifIndependent: true,
      colorIndex: 13,  // 淡灰色
      fields: [
        "思路详情",
        "具体尝试",
        "结论",
        "相关思考",
        "相关链接", // 相关链接放在最后是为了能够自动识别最新的内容，方便后续移动，否则如果是相关思考放在最后的话，就会被“误触”
      ]
    },
    作者: {
      refName: '作者',
      prefixName: '作者',
      englishName: 'author',
      templateNoteId: '143B444E-9E4F-4373-B635-EF909248D8BF',
      ifIndependent: false,
      colorIndex: 2,  // 淡蓝色
      fields: [
        "个人信息",
        "研究进展",
        "文献",
      ]
    },
    研究进展: {
      refName: '研究进展',
      prefixName: '研究进展',
      englishName: 'researchProgress',
      templateNoteId: 'C59D8428-68EA-4161-82BE-EA4314C3B5E9',
      ifIndependent: true,
      colorIndex: 6,  // 蓝色
      fields: [
        "进展详情",
        "相关思考",
        "相关作者",
        "被引用情况",
      ]
    },
    论文: {
      refName: '论文',
      prefixName: '论文',
      englishName: 'paper',
      templateNoteId: '032FC61B-37BD-4A90-AE9D-5A946842F49B',
      ifIndependent: false,
      colorIndex: 15,  // 紫色
      fields: [
        "文献信息",
        "相关思考",
        "符号与约定",
        "参考文献",
        "被引用情况",
      ]
    },
    书作: {
      refName: '书作',
      prefixName: '书作',
      englishName: 'book',
      templateNoteId: '032FC61B-37BD-4A90-AE9D-5A946842F49B',
      ifIndependent: false,
      colorIndex: 15,  // 紫色
      fields: [
        "文献信息",
        "相关思考",
        "符号与约定",
        "参考文献",
        "被引用情况",
      ]
    },
    文献: {
      refName: '文献',
      prefixName: '文献',
      englishName: 'literature',
      templateNoteId: '032FC61B-37BD-4A90-AE9D-5A946842F49B',
      ifIndependent: false,
      colorIndex: 15,  // 紫色
      fields: [
        "文献信息",
        "相关思考",
        "符号与约定",
        "参考文献",
        "被引用情况",
      ]
    },
  }

  /**
   * 制卡（只支持非摘录版本）
   */
  static makeCard(note, reviewEverytime = true) {
    this.renewNote(note) // 处理旧卡片
    this.mergeTemplateAndAutoMoveNoteContent(note) // 合并模板卡片并自动移动内容
    this.changeTitle(note) // 修改卡片标题
    this.changeNoteColor(note) // 修改卡片颜色
    this.linkParentNote(note) // 链接广义的父卡片（可能是链接归类卡片）
    // this.refreshNote(note) // 刷新卡片
    this.refreshNotes(note) // 刷新卡片
    this.addToReview(note, reviewEverytime) // 加入复习
    MNUtil.undoGrouping(()=>{
      note.focusInMindMap(0.3)
    })
  }

  /**
   * 一键制卡（支持摘录版本）
   */
  static makeNote(note) {
    this.toNoExceptVersion(note)
    // note.focusInMindMap(0.3)  // iPad 上会失去焦点      
    MNUtil.delay(0.3).then(()=>{
      note = MNNote.getFocusNote()
      MNUtil.delay(0.3).then(()=>{
        this.makeCard(note)
      })
      MNUtil.undoGrouping(()=>{
        // this.refreshNote(note)
        this.refreshNotes(note)
        // this.addToReview(note, true) // 加入复习
      })
    })
  }

  /**
   * 加入复习
   */
  static addToReview(note, reviewEverytime = true) {
    let includingTypes = ["定义", "命题", "例子", "反例", "思想方法", "问题", "思路"];
    if (this.getNoteType(note) && includingTypes.includes(this.getNoteType(note))) {
      if (reviewEverytime) {
        // 执行一次加入到复习一次
        MNUtil.excuteCommand("AddToReview")
      } else {
        // 执行的时候如果已经加入到复习了，就不加入
        if (!MNUtil.isNoteInReview(note.noteId)) {  // 2024-09-26 新增的 API
          MNUtil.excuteCommand("AddToReview")
        }
      }
    }
  }

  /**
   * 转化为非摘录版本
   */
  static toNoExceptVersion(note){
    if (note.parentNote) {
      if (note.excerptText) { // 把摘录内容的检测放到 toNoExceptVersion 的内部
        let parentNote = note.parentNote
        let config = {
          title: note.noteTitle,
          content: "",
          markdown: true,
          color: note.colorIndex
        }
        // 创建新兄弟卡片，标题为旧卡片的标题
        let newNote = parentNote.createChildNote(config)
        note.noteTitle = ""
        // 将旧卡片合并到新卡片中
        note.mergeInto(newNote)
        newNote.focusInMindMap(0.2)
      }
    } else {
      MNUtil.showHUD("没有父卡片，无法进行非摘录版本的转换！")
    }
  }

  /**
   * 链接广义的父卡片（可能是链接归类卡片）
   * 
   * 支持清理旧链接：当卡片移动位置导致父卡片改变时，会自动删除与旧父卡片的链接
   */
  static linkParentNote(note) {
    /**
     * 不处理的类型
     */
    let excludingTypes = ["思路"];
    if (excludingTypes.includes(this.getNoteType(note))) {
      return; // 不处理
    }

    let parentNote = note.parentNote
    if (parentNote) {
      // 获取卡片类型，确定链接移动的目标字段
      let parentNoteInNoteTargetField  // 父卡片在 note 中的链接最终要到的字段
      let ifParentNoteInNoteTargetFieldToBottom = false // 父卡片在 note 中的链接最终要到的是否是字段的底部
      let noteInParentNoteTargetField // note 在父卡片中的链接最终要到的字段
      let ifNoteInParentNoteTargetFieldToBottom = false // note 在父卡片中的链接最终要到的是否是字段的底部
      
      // 用于实际链接操作的父卡片变量
      let actualParentNote = parentNote
      
      switch (this.getNoteType(note)) {
        case "归类":
          if (this.getNoteType(parentNote) !== "归类") {
            switch (this.getNoteType(parentNote)) {
              case "定义":
                parentNoteInNoteTargetField = "所属"
                ifParentNoteInNoteTargetFieldToBottom = false
                noteInParentNoteTargetField = "相关链接"
                ifNoteInParentNoteTargetFieldToBottom = true
                break;
              default:
                parentNoteInNoteTargetField = "所属"
                ifParentNoteInNoteTargetFieldToBottom = false
                noteInParentNoteTargetField = "相关链接"
                ifNoteInParentNoteTargetFieldToBottom = true
                break;
            }
          } else {
            // 父卡片为归类卡片
            parentNoteInNoteTargetField = "所属"
            ifParentNoteInNoteTargetFieldToBottom = false
            noteInParentNoteTargetField = "包含"
            ifNoteInParentNoteTargetFieldToBottom = true 
          }
          break;
        default:
          // 对于非归类卡片，使用第一个归类父卡片
          let classificationParentNote = this.getFirstClassificationParentNote(note);
          if (classificationParentNote) {
            actualParentNote = classificationParentNote
            parentNoteInNoteTargetField = "相关链接"
            ifParentNoteInNoteTargetFieldToBottom = false
            noteInParentNoteTargetField = "包含"
            ifNoteInParentNoteTargetFieldToBottom = true 
          } else {
            // 如果没有找到归类父卡片，直接返回，不处理
            return
          }
          break;
      }

      /**
       * 清理旧链接：删除与其他父卡片的链接
       */
      this.cleanupOldParentLinks(note, actualParentNote)

      /**
       * 先保证有链接（在确定目标字段后再添加链接）
       */
      let parentNoteInNoteIndex = this.getNoteIndexInAnotherNote(actualParentNote, note)
      let noteInParentNoteIndex = this.getNoteIndexInAnotherNote(note, actualParentNote)
      
      // 如果没有链接，先添加链接
      if (parentNoteInNoteIndex == -1) {
        note.appendNoteLink(actualParentNote, "To")
        // 重新获取索引（因为添加了链接）
        parentNoteInNoteIndex = this.getNoteIndexInAnotherNote(actualParentNote, note)
      }
      if (noteInParentNoteIndex == -1) {
        actualParentNote.appendNoteLink(note, "To")
        // 重新获取索引（因为添加了链接）
        noteInParentNoteIndex = this.getNoteIndexInAnotherNote(note, actualParentNote)
      }

      // 最后进行移动（确保索引是最新的）
      if (parentNoteInNoteIndex !== -1 && parentNoteInNoteTargetField) {
        this.moveCommentsArrToField(note, [parentNoteInNoteIndex], parentNoteInNoteTargetField, ifParentNoteInNoteTargetFieldToBottom)
      }
      if (noteInParentNoteIndex !== -1 && noteInParentNoteTargetField) {
        this.moveCommentsArrToField(actualParentNote, [noteInParentNoteIndex], noteInParentNoteTargetField, ifNoteInParentNoteTargetFieldToBottom)
      }
    }
  }

  /**
   * 清理旧的父卡片链接
   * 
   * 删除当前卡片和其他父卡片之间的相互链接（保留与当前父卡片的链接）
   * 
   * @param {MNNote} note - 当前卡片
   * @param {MNNote} currentParentNote - 当前的父卡片，不会被删除
   */
  static cleanupOldParentLinks(note, currentParentNote) {
    // 获取当前卡片中的所有链接
    let noteCommentsObj = this.parseNoteComments(note)
    let linksInNote = noteCommentsObj.linksObjArr
    
    // 收集需要删除的旧父卡片链接（先收集，后删除，避免索引混乱）
    let oldParentNotesToCleanup = []
    
    linksInNote.forEach(linkObj => {
      try {
        // 从链接 URL 中提取 noteId
        let targetNoteId = linkObj.link.match(/marginnote[34]app:\/\/note\/([^\/]+)/)?.[1]
        if (targetNoteId && targetNoteId !== currentParentNote.noteId) {
          // 检查这个链接是否指向一个可能的父卡片
          let targetNote = MNNote.new(targetNoteId, false) // 不弹出警告
          if (targetNote && this.isPotentialParentNote(targetNote, note)) {
            oldParentNotesToCleanup.push({
              targetNote: targetNote,
              linkText: linkObj.link
            })
          }
        }
      } catch (error) {
        // 忽略解析错误，继续处理其他链接
        console.log("清理旧链接时出错:", error)
      }
    })
    
    // 执行清理：删除双向链接
    oldParentNotesToCleanup.forEach(cleanup => {
      try {
        // 删除当前卡片中指向旧父卡片的链接（按文本删除，避免索引问题）
        note.removeCommentsByText(cleanup.linkText)
        
        // 删除旧父卡片中指向当前卡片的链接
        cleanup.targetNote.removeCommentsByText(note.noteURL)
      } catch (error) {
        console.log("执行清理时出错:", error)
      }
    })
  }

  /**
   * 判断一个卡片是否可能是另一个卡片的父卡片
   * 
   * @param {MNNote} potentialParent - 可能的父卡片
   * @param {MNNote} childNote - 子卡片
   * @returns {boolean} - 是否是潜在的父卡片
   */
  static isPotentialParentNote(potentialParent, childNote) {
    if (!potentialParent || !childNote) return false
    
    // 首先检查是否真的在祖先链中（实际的父子关系）
    let current = childNote.parentNote
    while (current) {
      if (current.noteId === potentialParent.noteId) {
        return true // 找到了真实的父卡片关系
      }
      current = current.parentNote
    }
    
    // 检查是否是子卡片（如果potentialParent是childNote的子卡片，则绝对不是父卡片）
    let currentChild = potentialParent.parentNote
    while (currentChild) {
      if (currentChild.noteId === childNote.noteId) {
        return false // potentialParent是childNote的后代，不可能是父卡片
      }
      currentChild = currentChild.parentNote
    }
    
    let potentialParentType = this.getNoteType(potentialParent)
    let childType = this.getNoteType(childNote)
    
    // 只有在不是实际父子关系的情况下，才根据类型来判断逻辑父子关系
    // 归类卡片可能是其他卡片的逻辑父卡片（但不能是其子卡片的父卡片）
    if (potentialParentType === "归类" && childType !== "归类") {
      return true
    }
    
    // 定义卡片可能是归类卡片的逻辑父卡片
    if (potentialParentType === "定义" && childType === "归类") {
      return true
    }
    
    // 其他可能的父子关系可以在这里添加
    // 比如：问题 -> 思路，命题 -> 例子 等
    
    return false
  }

  /**
   * 获取一个卡片在另一个卡片中的 index
   */
  static getNoteIndexInAnotherNote(note, anotherNote) {
    return anotherNote.MNComments.findIndex(comment => comment.type === "linkComment" && comment.text === note.noteURL);
  }

  /**
   * 刷新卡片
   */
  static refreshNote(note) {
    note.note.appendMarkdownComment("")
    note.note.removeCommentByIndex(note.note.comments.length-1)
  }
  static refreshNotes(note) {
    // if (note.descendantNodes.descendant.length > 0) {
    //   note.descendantNodes.descendant.forEach(descendantNote => {
    //     this.refreshNote(descendantNote)
    //   })
    // }
    // if (note.ancestorNodes.length > 0) {
    //   note.ancestorNodes.forEach(ancestorNote => {
    //     this.refreshNote(ancestorNote)
    //   })
    // }
    if (note.parentNote) {
      this.refreshNote(note.parentNote)
    }

    this.refreshNote(note) // 刷新当前卡片

    // 刷新所有子卡片，不需要孙卡片
    if (note.childNotes.length > 0) {
      note.childNotes.forEach(childNote => {
        this.refreshNote(childNote)
      })
    }
  }

  /**
   * 处理旧卡片
   */
  static renewNote(note) {
    this.toNoExceptVersion(note)
    switch (this.getNoteType(note)) {
      case "归类":
        /**
         * 去掉归类卡片的标题中的“xx”：“yy” 里的 xx
         */
        let titleParts = this.parseNoteTitle(note);
        if (/^“[^”]*”：“[^”]*”\s*相关[^“]*$/.test(note.title)) {
          note.title = `“${titleParts.content}”相关${titleParts.type}`;
        }
        break;
    }
  }

  /**
   * 修改归类卡片的标题
   * 
   * @param {MNNote} note - 归类卡片
   * @param {string} content - 归类卡片的标题内容
   * @param {string} type - 归类卡片的类型
   */

  static changeClassificationTitle(note, content, type) {

  }

  /**
   * 修改标题
   * 
   * TODO:
   * []强制修改前缀
   * []如果有补充内容，则不修改前缀，防止条件内容被清除
   */
  static changeTitle(note) {
    /**
     * 不在制卡时修改卡片标题的类型
     * 
     * 归类：因为取消了以前的“xx”：“yy” 里的 xx，只用链接来考虑所属，所以不需要涉及改变标题
     */
    let noteType = this.getNoteType(note)
    
    let excludingTypes = ["归类","思路", "作者", "研究进展", "论文", "书作", "文献"];
    if (!excludingTypes.includes(noteType)) {
      // 获取归类卡片
      let classificationNote = this.getFirstClassificationParentNote(note);
      if (classificationNote) {
        let classificationNoteTitleParts = this.parseNoteTitle(classificationNote);
        let prefix = this.createTitlePrefix(classificationNoteTitleParts.type, this.createChildNoteTitlePrefixContent(classificationNote));
        let noteTitleParts = this.parseNoteTitle(note);
        // 
        // 定义类 noteTitleParts.content 前要加 `; `
        if (noteType === "定义") {
          note.title = prefix + '; ' + noteTitleParts.content
        } else {
          note.title = `${prefix}${noteTitleParts.content}`;
        }
      }
    }
  }

  /**
   * 获取第一个归类卡片的父爷卡片
   */
  static getFirstClassificationParentNote(note) {
    let parentNote = note.parentNote;
    while (parentNote) {
      if (this.getNoteType(parentNote) === "归类") {
        return parentNote;
      }
      parentNote = parentNote.parentNote;
    }
  }

  /**
   * 【非摘录版本】初始状态合并模板卡片后自动移动卡片的内容
   */
  static mergeTemplateAndAutoMoveNoteContent(note) {
    let moveIndexArr = this.autoGetMoveIndexArr(note);
    this.mergeTemplate(note)

    let field 
    switch (this.getNoteType(note)) {
      case "定义":
        field = "相关思考"
        break;
      case "命题":
        field = "证明"
        break;
      case "反例":
        field = "反例"
        break;
      case "例子":
        field = "证明"
        break;
      case "思想方法":
        field = "原理"
        break;
      case "归类":
        field = "相关思考"
        break;
      case "问题":
        field = "研究脉络"
        break;
      case "思路":
        field = "具体尝试"
        break;
      case "作者":
        field = "个人信息"
        break;
      case "文献":
        field = "文献信息"
        break;
      case "研究进展":
        field = "进展详情"
        break;
      // case "出版社":
      //   field = ""
      //   break;
      // case "期刊":
      //   field = ""
      //   break;
      // case "":
      //   field = ""
      //   break;
    }

    this.moveCommentsArrToField(note, moveIndexArr, field)
  }

  /**
   * 合并模板卡片
   */
  static mergeTemplate(note) {
    // 防止重复制卡：如果里面有 HtmlComment 则不制卡
    if (!note.MNComments.some(comment => comment.type === "HtmlComment")) {
      this.cloneAndMergeById(note, this.types[this.getNoteType(note)].templateNoteId);
    }
  }

  /**
   * 修改卡片颜色
   */
  static changeNoteColor(note) {
    note.colorIndex = this.types[this.getNoteType(note)].colorIndex;
  }

  /**
   * 克隆并合并
   */
  static cloneAndMergeById(note, id){
    let clonedNote = MNNote.clone(id)
    note.merge(clonedNote.note)
  }

  /**
   * 自动获取并返回当前卡片的待移动内容的 indexArr
   * 
   * 
   * @param {MNNote} note - 当前卡片
   */
  static autoGetMoveIndexArr(note) {
    let moveIndexArr = []
    let lastHtmlCommentText = this.parseNoteComments(note).htmlCommentsTextArr.slice(-1)[0] || "";
    
    if (lastHtmlCommentText) {
      // 如果有HTML评论，移动HTML评论中的非链接内容
      moveIndexArr = this.getHtmlBlockNonLinkContentIndexArr(note, lastHtmlCommentText);
    } else {
      // 如果没有HTML评论，跳过开头连续的合并图片评论，从第一个非合并图片评论开始移动
      let firstNonMergedImageIndex = -1;
      
      // 从所有评论的开头开始查找第一个非合并图片评论
      for (let i = 0; i < note.MNComments.length; i++) {
        let comment = note.MNComments[i];
        // 检查是否为合并的图片评论类型（包括带绘制和不带绘制的）
        if (comment.type !== "mergedImageComment" && comment.type !== "mergedImageCommentWithDrawing") {
          firstNonMergedImageIndex = i;
          break;
        }
      }
      
      if (firstNonMergedImageIndex !== -1) {
        // 从第一个非合并图片评论到所有评论的结尾作为新内容
        moveIndexArr = Array.from({length: note.MNComments.length - firstNonMergedImageIndex}, (_, i) => i + firstNonMergedImageIndex);
      } else {
        // 如果所有评论都是合并图片评论，则新内容为空
        moveIndexArr = [];
      }
    }

    return moveIndexArr;
  }


  /**
   * 增加思路卡片
   * 
   * @param {MNNote} note - 当前卡片
   * @param {string} title - 思路卡片的标题
   */
  static addNewIdeaNote(note, title) {
    // 生成卡片
    let ideaNote = MNNote.clone(this.types.思路.templateNoteId)
    note.addChild(ideaNote)
    // 处理标题
    ideaNote.title = this.createTitlePrefix(this.types.思路.prefixName, this.createChildNoteTitlePrefixContent(note)) + title
    // 处理链接
    note.appendMarkdownComment(HtmlMarkdownUtils.createHtmlMarkdownText(title,"idea"))  // 加入思路 htmlMD
    note.appendNoteLink(ideaNote,"Both")  // 双向链接
    this.moveCommentsArrToField(note, "Y, Z", this.getIdeaLinkMoveToField(note))  // 移动 note 的两个评论
  }

  /**
   * 根据卡片类型确定思路链接内容要移动到哪个字段下
   */
  static getIdeaLinkMoveToField(note) {
    switch (this.getNoteType(note)) {
      case "命题":
      case "例子":
        return "证明"
      case "反例":
        return "反例"
      case "思想方法":
        return "原理"
      case "问题":
        return "研究思路"
      default:
        break;
    }
  }

  /**
   * 生成标题前缀
   */
  static createTitlePrefix(prefixName, content) {
    return `【${prefixName} >> ${content}】`;
  }

  /**
   * 获取卡片类型
   * 
   * 目前是靠卡片标题来判断
   */
  static getNoteType(note) {
    let noteType
    let title = note.title || "";
    /**
     * 如果是
     * “xxx”：“yyy”相关 zz
     * 或者是
     * “yyy”相关 zz
     * 则是归类卡片
     */
    if (/^“[^”]*”：“[^”]*”\s*相关[^“]*$/.test(title) || /^“[^”]+”\s*相关[^“]*$/.test(title)) {
      noteType = "归类"
    } else {
      /**
       * 如果是
       * 【xx：yy】zz
       * 则根据 xx 作为 prefixName 在 types 搜索类型
       */
      let match = title.match(/^【(.{2,4})\s*(?:>>|：)\s*.*】(.*)/)
      let matchResult
      if (match) {
        matchResult = match[1].trim();
      } else {
        match = title.match(/^【(.*)】(.*)/)
        if (match) {
          matchResult = match[1].trim();
        } else {
          // 从标题判断不了的话，就从卡片的归类卡片来判断
          let classificationNote = this.getFirstClassificationParentNote(note);
          if (classificationNote) {
            let classificationNoteTitleParts = this.parseNoteTitle(classificationNote);
            matchResult = classificationNoteTitleParts.type;
          }
        }
      }
      for (let typeKey in this.types) {
        let type = this.types[typeKey];
        if (type.prefixName === matchResult) {
          noteType = String(typeKey);
          break;
        }
      }
    }

    return noteType || undefined;
  }

  /**
   * 基于卡片标题生成子卡片前缀内容
   */
  static createChildNoteTitlePrefixContent(note) {
    let titleParts = this.parseNoteTitle(note);
    switch (this.getNoteType(note)) {
      case '归类':
        return titleParts.content
      default:
        return titleParts.prefixContent + "｜" + titleParts.content;
    }
  }

  /**
   * 解析卡片标题，拆成几个部分，返回一个对象
   */
  static parseNoteTitle(note) {
    let title = note.title || "";
    let titleParts = {}
    let match
    switch (this.getNoteType(note)) {
      case "归类":
        match = title.match(/^“[^”]+”：“([^”]+)”\s*相关\s*(.*)$/);
        if (match) {
          titleParts.content = match[1].trim();
          titleParts.type = match[2].trim();
        } else {
          match = title.match(/^“([^”]+)”\s*相关\s*(.*)$/);
          if (match) {
            titleParts.content = match[1].trim();
            titleParts.type = match[2].trim();
          }
        }
        break;
      default:
        match = title.match(/^【(.{2,4})\s*(?:>>|：)\s*(.*)】(.*)/)
        if (match) {
          titleParts.type = match[1].trim();
          titleParts.prefixContent = match[2].trim();
          titleParts.content = match[3].trim();
          // 如果 content 以 `; ` 开头，则去掉
          if (titleParts.content.startsWith("; ")) {
            titleParts.content = titleParts.content.slice(2).trim();
          }
          titleParts.titleLinkWordsArr = titleParts.content.split(/; /).map(word => word.trim()).filter(word => word.length > 0);
        } else {
          match = title.match(/^【(.*)】(.*)/)
          if (match) {
            titleParts.type = match[1].trim();
            titleParts.prefixContent = ""
            titleParts.content = match[2].trim();
            // 如果 content 以 `; ` 开头，则去掉
            if (titleParts.content.startsWith("; ")) {
              titleParts.content = titleParts.content.slice(2).trim();
            }
            titleParts.titleLinkWordsArr = titleParts.content.split(/; /).map(word => word.trim()).filter(word => word.length > 0);
          } else {
            titleParts.content = title.trim();
          }
        }
        break;
    }

    return titleParts
  }

  /**
   * 解析卡片评论
   * 
   * 返回一个对象数组 commentsObj，包含：
   * htmlComment(作为评论字段分隔) 的详细信息 : htmlCommentsObjArr
   * htmlComment(作为评论字段分隔) 的文本信息 : htmlCommentsTextArr
   * 
   */
  static parseNoteComments(note) {
    let commentsObj = {
      htmlCommentsObjArr: [],
      htmlCommentsTextArr: [],
      htmlMarkdownCommentsObjArr: [],
      htmlMarkdownCommentsTextArr: [],
      linksObjArr: [],
      linksURLArr: [],
    }
    let comments = note.MNComments

    /**
     * 处理 htmlCommentsObjArr
     */
    // let includingFieldBlockIndexArr = []
    // let excludingFieldBlockIndexArr = []
    comments.forEach((comment, index) => {
      if (comment.type == "HtmlComment") {
        commentsObj.htmlCommentsObjArr.push(
          {
            index: index, // HtmlComment 所在卡片的评论中的 index
            text: comment.text, // HtmlComment 的内容
            includingFieldBlockIndexArr: [], // 包含这个字段本身的下方 Block 的 Index 数组
            excludingFieldBlockIndexArr: [], // 不包含这个字段本身的下方 Block 的 Index 数组
          }
        );
      }
    })

    // 因为上面的循环还在遍历所有的 HtmlComments，所以不能获取到下一个，所以要等到先遍历完再处理 Block 
    switch (commentsObj.htmlCommentsObjArr.length) {
      case 0:
        break;
      case 1:
        commentsObj.htmlCommentsObjArr[0].includingFieldBlockIndexArr = comments.map((comment, index) => index).filter(index => index >= commentsObj.htmlCommentsObjArr[0].index);
        commentsObj.htmlCommentsObjArr[0].excludingFieldBlockIndexArr = comments.map((comment, index) => index).filter(index => index > commentsObj.htmlCommentsObjArr[0].index);
        break;
      default:
        for (let i = 0; i < commentsObj.htmlCommentsObjArr.length; i++) {
          let currentHtmlComment = commentsObj.htmlCommentsObjArr[i];
          if (i === commentsObj.htmlCommentsObjArr.length - 1) {
            currentHtmlComment.includingFieldBlockIndexArr = comments.map((comment, index) => index).filter(index => index >= currentHtmlComment.index);
            currentHtmlComment.excludingFieldBlockIndexArr = comments.map((comment, index) => index).filter(index => index > currentHtmlComment.index);
          } else {
            let nextHtmlComment = commentsObj.htmlCommentsObjArr[i + 1];
            currentHtmlComment.includingFieldBlockIndexArr = comments.map((comment, index) => index).filter(index => index < nextHtmlComment.index && index >= currentHtmlComment.index);
            currentHtmlComment.excludingFieldBlockIndexArr = comments.map((comment, index) => index).filter(index => index < nextHtmlComment.index && index > currentHtmlComment.index);
          
          }
        }
        break
    }

    /**
     * 处理 htmlCommentsTextArr
     */
    if (commentsObj.htmlCommentsObjArr.length > 0) {
      // commentsObj.htmlCommentsTextArr
      commentsObj.htmlCommentsObjArr.forEach(htmlComment => {
        commentsObj.htmlCommentsTextArr.push(htmlComment.text)
      })
    }

    /**
     * 处理 htmlMarkdownCommentsObjArr
     */
    comments.forEach((comment, index) => {
      let text = comment.text || ""
      let isHtmlMD = false
      let hasLeadingDash = false
      let cleanText = text
      
      // 检查是否有前导 "- "
      if (text.startsWith("- ")) {
        hasLeadingDash = true
        cleanText = text.substring(2) // 去掉 "- "
      }
      
      // 检查是否是 HtmlMarkdown 评论
      if (HtmlMarkdownUtils.isHtmlMDComment(cleanText)) {
        isHtmlMD = true
      }
      
      if (isHtmlMD) {
        let type = HtmlMarkdownUtils.getSpanType(cleanText)
        let content = HtmlMarkdownUtils.getSpanTextContent(cleanText)
        
        commentsObj.htmlMarkdownCommentsObjArr.push({
          index: index, // HtmlMarkdown 评论所在卡片的评论中的 index
          text: text, // 原始评论文本（包含可能的 "- " 前缀）
          cleanText: cleanText, // 去掉 "- " 前缀的文本
          type: type, // 评论的类型（如 'goal', 'level1' 等）
          content: content, // 评论的纯文本内容（去掉 HTML 标签和图标）
          hasLeadingDash: hasLeadingDash // 是否有前导 "- "
        })
      }
    })

    /**
     * 处理 htmlMarkdownCommentsTextArr
     */
    if (commentsObj.htmlMarkdownCommentsObjArr.length > 0) {
      commentsObj.htmlMarkdownCommentsObjArr.forEach(htmlMDComment => {
        // 创建用于显示的文本，格式：[类型] 内容
        let displayText = `[${htmlMDComment.type}] ${htmlMDComment.content}`
        if (htmlMDComment.hasLeadingDash) {
          displayText = "- " + displayText
        }
        commentsObj.htmlMarkdownCommentsTextArr.push(displayText)
      })
    }


    /**
     * 所有的链接（不包含概要）
     */

    comments.forEach((comment, index) => {
      if (comment.type === "linkComment") {
        commentsObj.linksObjArr.push({
          index: index, // linkComment 所在卡片的评论中的 index
          link: comment.text, // 具体的 link
        })
      }
    })

    commentsObj.linksObjArr.forEach(linkObj => {
      commentsObj.linksURLArr.push(linkObj.link)
    })

    return commentsObj
  }

  /**
   * 通过弹窗来精准修改单个 HtmlMarkdown 评论的类型
   */
  static changeHtmlMarkdownCommentTypeByPopup(note) {
    let htmlMarkdownCommentsTextArr = this.parseNoteComments(note).htmlMarkdownCommentsTextArr;
    let htmlMarkdownCommentsObjArr = this.parseNoteComments(note).htmlMarkdownCommentsObjArr;
    
    if (htmlMarkdownCommentsTextArr.length === 0) {
      MNUtil.showHUD("当前笔记没有 HtmlMarkdown 评论");
      return;
    }

    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "选择要修改类型的 HtmlMarkdown 评论",
      "请选择要修改的评论",
      0,
      "取消",
      htmlMarkdownCommentsTextArr,
      (alert, buttonIndex) => {
        if (buttonIndex === 0) {
          return; // 取消
        }
        
        let selectedCommentObj = htmlMarkdownCommentsObjArr[buttonIndex - 1];
        let currentType = selectedCommentObj.type;
        
        // 获取所有可用的类型选项
        let availableTypes = Object.keys(HtmlMarkdownUtils.icons);
        let typeDisplayTexts = availableTypes.map(type => `${HtmlMarkdownUtils.icons[type]} ${type}`);
        
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "选择目标类型",
          `当前类型：${HtmlMarkdownUtils.icons[currentType]} ${currentType}\n\n请选择要转换成的类型：`,
          0,
          "取消",
          typeDisplayTexts,
          (alert, typeButtonIndex) => {
            if (typeButtonIndex === 0) {
              return; // 取消
            }
            
            let targetType = availableTypes[typeButtonIndex - 1];
            
            if (targetType === currentType) {
              MNUtil.showHUD("目标类型与当前类型相同，无需修改");
              return;
            }
            
            MNUtil.undoGrouping(() => {
              try {
                let comments = note.MNComments;
                let targetComment = comments[selectedCommentObj.index];
                let content = selectedCommentObj.content;
                let hasLeadingDash = selectedCommentObj.hasLeadingDash;
                
                // 生成新的 HtmlMarkdown 文本
                let newHtmlMarkdownText = HtmlMarkdownUtils.createHtmlMarkdownText(content, targetType);
                
                // 如果原来有前导破折号，保持前导破折号
                if (hasLeadingDash) {
                  newHtmlMarkdownText = "- " + newHtmlMarkdownText;
                }
                
                // 更新评论文本
                targetComment.text = newHtmlMarkdownText;
                
                // MNUtil.showHUD(`已将类型从 ${currentType} 改为 ${targetType}`);
                
              } catch (error) {
                MNUtil.showHUD("修改失败：" + error.toString());
              }
            });
          }
        );
      }
    );
  }

  /**
   * 通过弹窗来选择移动的评论以及移动的位置
   */
  static moveCommentsByPopup(note) {
    let htmlCommentsTextArr = this.parseNoteComments(note).htmlCommentsTextArr;
    // htmlCommentsTextArr 的开头加上 "确定手动输入"
    htmlCommentsTextArr.unshift("确定手动输入");
    let moveCommentIndexArr

    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "输入要移动的评论 Index 数组或选择区域",
      "⚠️不输入的话就自动获取\n❗️从 1 开始\n支持:\n- 单个序号: 1,2,3\n- 范围: 1-4 \n- 特殊字符: X(倒数第3条), Y(倒数第2条), Z(最后一条)\n- 组合使用: 1,3-5,Y,Z\n\n用中文或英文逗号、分号分隔",
      2,
      "取消",
      htmlCommentsTextArr,
      (alert, buttonIndex) => {
        let userInput = alert.textFieldAtIndex(0).text;
        moveCommentIndexArr = userInput ? userInput.parseCommentIndices(note.comments.length) : this.autoGetMoveIndexArr(note);
        switch (buttonIndex) {
          case 0:
            return; // 取消
          case 1:
            break;
          default:
            moveCommentIndexArr = this.getHtmlCommentExcludingFieldBlockIndexArr(note, htmlCommentsTextArr[buttonIndex-1])
            break;
        }
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "选择移动的位置",
          "如果是选择 xx 区，则默认移动到最底下",
          0,
          "不移动",
          this.getHtmlCommentsTextArrForPopup(note),
          (alert, buttonIndexII) => {
            MNUtil.undoGrouping(()=>{
              try {
                if (buttonIndexII !== 0) {
                  note.moveCommentsByIndexArr(moveCommentIndexArr, this.getCommentsIndexArrToMoveForPopup(note)[buttonIndexII-1])
                }
              } catch (error) {
                MNUtil.showHUD(error);
              }
            })
            
          }
        )

        MNUtil.undoGrouping(()=>{
          note.refresh()
        })

      }
    )
  }

  /**
   * 获得一个基于 htmlCommentsTextArr 的数组专门用于移动评论
   * 
   * 摘录区也是放在这个地方处理
   */
  static getHtmlCommentsTextArrForPopup(note) {
    // let htmlCommentsObjArr = this.parseNoteComments(note).htmlCommentsObjArr;
    let htmlCommentsTextArr = this.parseNoteComments(note).htmlCommentsTextArr;
    let htmlCommentsTextArrForMove = [
      "🔝🔝🔝🔝卡片最顶端🔝🔝🔝🔝",
      "----------【摘录区】----------",
    ]
    // if (htmlCommentsTextArr.length > 1) {
    //   htmlCommentsTextArr.forEach(text => {
    //     htmlCommentsTextArrForMove.push(
    //       "----------【"+ text.trim() +"区】----------",
    //     )
    //     htmlCommentsTextArrForMove.push("🔝 Top 🔝")
    //     htmlCommentsTextArrForMove.push("⬇️ Bottom ⬇️")
    //   })
    // }
    for (let i = 0; i < htmlCommentsTextArr.length -1; i++) {
      let text = htmlCommentsTextArr[i].trim();
      htmlCommentsTextArrForMove.push(
        "----------【"+ text +"区】----------",
      )
      htmlCommentsTextArrForMove.push("🔝 Top 🔝")
      htmlCommentsTextArrForMove.push("⬇️ Bottom ⬇️")
    }

    htmlCommentsTextArrForMove.push("⬇️⬇️⬇️⬇️ 卡片最底端 ⬇️⬇️⬇️⬇️")

    return htmlCommentsTextArrForMove;
  }
  /**
   * 获取 getHtmlCommentsTextArrForMove 获得的数组所对应要移动的 Index 构成的数组
   * 
   * 比如 htmlCommentsTextArrForMove[0] 的 🔝🔝🔝🔝卡片最顶端🔝🔝🔝🔝 对应的 commentsIndexArrToMove[0] 就是 0，因为是移动到卡片最顶端
   * 
   * Bug: 往上正常，往下有偏移
   */
  static getCommentsIndexArrToMoveForPopup(note) {
    let htmlCommentsObjArr = this.parseNoteComments(note).htmlCommentsObjArr;
    let commentsIndexArrToMove = [
      0,  // 对应："🔝🔝🔝🔝卡片最顶端 🔝🔝🔝🔝"
    ]
    let excerptBlockIndexArr = this.getExcerptBlockIndexArr(note);
    if (excerptBlockIndexArr.length == 0) {
      commentsIndexArrToMove.push(0) // 对应："----------【摘录区】----------"
    } else {
      commentsIndexArrToMove.push(excerptBlockIndexArr[excerptBlockIndexArr.length - 1]+1) // 对应："----------【摘录区】----------"
    }
    
    switch (htmlCommentsObjArr.length) {
      case 0:
        break;
      case 1:
        commentsIndexArrToMove.push(note.comments.length-1) // 对应："----------【xxx区】----------"
        commentsIndexArrToMove.push(htmlCommentsObjArr[0].index + 1) // 对应："🔝 Top 🔝"
        commentsIndexArrToMove.push(note.comments.length-1) // 对应："⬇️ Bottom ⬇️"
        break;
      default:
        for (let i = 0; i < htmlCommentsObjArr.length - 1; i++) {  // 不考虑最后一个 htmlComment 区的移动
          commentsIndexArrToMove.push(htmlCommentsObjArr[i+1].index) // 对应："----------【xxx区】----------"
          commentsIndexArrToMove.push(htmlCommentsObjArr[i].index + 1) // 对应："🔝 Top 🔝"
          commentsIndexArrToMove.push(htmlCommentsObjArr[i+1].index) // 对应："⬇️ Bottom ⬇️"
        }
        break;
    }

    commentsIndexArrToMove.push(note.comments.length) // 对应："⬇️⬇️⬇️⬇️ 卡片最底端 ⬇️⬇️⬇️⬇️"

    return commentsIndexArrToMove
  }

  /**
   * 移动评论到指定字段
   */
  static moveCommentsArrToField(note, indexArr, field, toBottom = true) {
    let getHtmlCommentsTextArrForPopup = this.getHtmlCommentsTextArrForPopup(note);
    let commentsIndexArrToMove = this.getCommentsIndexArrToMoveForPopup(note);

    let targetIndex = -1
    getHtmlCommentsTextArrForPopup.forEach((text, index) => {
      if (text.includes(field)) {
        if (toBottom) {
          targetIndex = commentsIndexArrToMove[index]
        } else {
          targetIndex = commentsIndexArrToMove[index+1]  // 注意这里的 Arr 是因为 commentsIndexArrToMove 里的内容是 xx 区+top+bottom 组合
        }
      }
    })

    if (targetIndex === -1) {
      // 此时要判断是否是最后一个字段，因为最后一个字段没有弄到弹窗里，所以上面的处理排除了最后一个字段
      let htmlCommentsTextArr = this.parseNoteComments(note).htmlCommentsTextArr;
      if (htmlCommentsTextArr.length>0) {
        if (htmlCommentsTextArr[htmlCommentsTextArr.length - 1].includes(field)) {
          if (toBottom) {
            targetIndex = note.comments.length; // 移动到卡片最底端
          } else {
            // 获取最后一个字段的 index
            let htmlCommentsObjArr = this.parseNoteComments(note).htmlCommentsObjArr;
            targetIndex = htmlCommentsObjArr[htmlCommentsObjArr.length - 1].index + 1; // 移动到最后一个字段的下方
          }
        }
      }
    }
    let arr = []
    if (targetIndex !== -1) {
      // 如果是字符串就处理为数组
      if (typeof indexArr === "string") {
        arr = indexArr.parseCommentIndices(note.comments.length);
      } else {
        arr = indexArr;
      }
      note.moveCommentsByIndexArr(arr, targetIndex)
    }
  }
  /**
   * 获取 Note 的摘录区的 indexArr
   */
  static getExcerptBlockIndexArr(note) {
    let indexArr = []
    let endIndex = this.parseNoteComments(note).htmlCommentsObjArr[0]?.index? this.parseNoteComments(note).htmlCommentsObjArr[0].index : -1;
    switch (endIndex) {
      case 0:
        break;
      case -1: // 此时没有 html 评论
        for (let i = 0; i < note.comments.length-1; i++) {
          let comment = note.MNComments[i]
          if (i == 0) {
            if (comment.type == "mergedImageComment") {
              indexArr.push(i)
            } else {
              return []
            }
          } else {
            // 要保持连续
            if (comment.type == "mergedImageComment" && note.MNComments[i-1].type == "mergedImageComment") {
              indexArr.push(i)
            }
          }
        }
        break;
      default:
        for (let i = 0; i < endIndex; i++) {
          let comment = note.MNComments[i]
          if (comment.type == "mergedImageComment") {
            indexArr.push(i)
          }
        }
        break;
    }

    return indexArr
  }
  /**
   * 获取包含某段文本的 HtmlComment 的 Block
   */
  static getHtmlCommentIncludingFieldBlockIndexArr(note, text) {
    let commentsObj = this.parseNoteComments(note);
    let indexArr = []
    commentsObj.htmlCommentsObjArr.forEach(htmlComment => {
      if (htmlComment.text.includes(text)) {
        indexArr = htmlComment.includingFieldBlockIndexArr;
      }
    })
    return indexArr
  }
  static getHtmlCommentExcludingFieldBlockIndexArr(note, text) {
    let commentsObj = this.parseNoteComments(note);
    let indexArr = []
    commentsObj.htmlCommentsObjArr.forEach(htmlComment => {
      if (htmlComment.text.includes(text)) {
        indexArr = htmlComment.excludingFieldBlockIndexArr;
      }
    })
    return indexArr
  }

  /**
   * 获得 Block 下方的第一个非链接到结尾的 IndexArr
   */
  static getHtmlBlockNonLinkContentIndexArr (note, text) {
    let indexArr = this.getHtmlCommentExcludingFieldBlockIndexArr(note, text)  // 这里不能用 including，否则字段的 htmlComment 本身就不是链接，就会被识别到
    let findNonLink = false
    if (indexArr.length !== 0) {
      // 从头开始遍历，检测是否是链接，直到找到第一个非链接就停止
      for (let i = 0; i < indexArr.length; i++) {
        let index = indexArr[i]
        let comment = note.MNComments[index]
        if (
          comment.type !== "linkComment"
        ) {
          // 不处理 # 开头的文本，因为这种文本一般是用作标题链接，不能被识别为新内容
          if (comment.text && comment.text.startsWith("#")) {
            continue
          }
          indexArr = indexArr.slice(i)
          findNonLink = true
          break
        }
      }
      if (!findNonLink) {
        // 只有链接时，仍然返回数组
        return []
      }
    }
    return indexArr
  }


  static addTemplate(note) {
    let templateNote
    let type
    let contentInTitle
    let titleParts = this.parseNoteTitle(note)
    switch (this.getNoteType(note)) {
      case "归类":
        contentInTitle = titleParts.content
        break;
      default:
        contentInTitle = titleParts.prefixContent + "｜" + titleParts.content;
        break;
    }
    MNUtil.copy(contentInTitle)
    try {
      UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
        "增加模板",
        // "请输入标题并选择类型\n注意向上下层添加模板时\n标题是「增量」输入",
        "请输入标题并选择类型",
        2,
        "取消",
        // ["向下层增加模板", "增加概念衍生层级","增加兄弟层级模板","向上层增加模板", "最顶层（淡绿色）", "专题"],
        [
          "连续向下「顺序」增加模板",  // 1
          "连续向下「倒序」增加模板",  // 2
          "增加兄弟层级模板",  // 3
          "向上层增加模板",  // 4
        ],
        (alert, buttonIndex) => {
          let userInputTitle = alert.textFieldAtIndex(0).text;
          switch (buttonIndex) {
            case 4:
              try {
                /* 向上增加模板 */
                
                // 获取当前卡片类型和父卡片
                let noteType = this.parseNoteTitle(note).type
                let parentNote = note.parentNote
                
                if (!noteType) {
                  MNUtil.showHUD("无法识别当前卡片类型");
                  return;
                }
                
                // 获取对应类型的模板ID
                let templateNoteId = this.types["归类"].templateNoteId;
                
                MNUtil.undoGrouping(() => {
                  // 1. 创建新的归类卡片
                  let newClassificationNote = MNNote.clone(templateNoteId);
                  newClassificationNote.note.noteTitle = `“${userInputTitle}”相关${noteType}`;
                  
                  // 3. 建立层级关系：新卡片作为父卡片的子卡片
                  parentNote.addChild(newClassificationNote.note);
                  
                  // 4. 移动选中卡片：从原位置移动到新卡片下
                  newClassificationNote.addChild(note.note);
                  
                  // 5. 使用 this API 处理链接关系
                  this.linkParentNote(newClassificationNote);
                  this.linkParentNote(note);
                  
                  // 6. 聚焦到新创建的卡片
                  MNUtil.delay(0.8).then(() => {
                    newClassificationNote.focusInMindMap();
                  });
                });
                
              } catch (error) {
                MNUtil.showHUD(`向上增加模板失败: ${error.message || error}`);
              }
              break;
            case 3:
              // 增加兄弟层级模板
              type = this.parseNoteTitle(note).type
              if (type) {
                templateNote = MNNote.clone(this.types["归类"].templateNoteId)
                templateNote.noteTitle = "“" +  userInputTitle + "”相关" + type
                MNUtil.undoGrouping(()=>{
                  note.parentNote.addChild(templateNote.note)
                  this.linkParentNote(templateNote);
                })
                templateNote.focusInMindMap(0.5)
              }
              break
            case 2: // 连续向下「倒序」增加模板
              /**
               * 通过//来分割标题，增加一连串的归类卡片
               * 比如：赋范空间上的//有界//线性//算子
               * 依次增加：赋范空间上的算子、赋范空间上的线性算子、赋范空间上的有界线性算子
               */
              try {
                let titlePartArray = userInputTitle.split("//")
                let titlePartArrayLength = titlePartArray.length
                let type
                let lastNote
                
                // 使用 this API 获取卡片类型 
                let parsedTitle = this.parseNoteTitle(note)
                if (parsedTitle && parsedTitle.type) { 
                  type = parsedTitle.type
                  switch (titlePartArrayLength) {
                    case 1:  // 没有输入 //，正常向下添加
                      // 创建新的归类卡片
                      let newNote = MNNote.clone(this.types["归类"].templateNoteId)
                      newNote.note.noteTitle = `"${userInputTitle}"相关${type}`
                      MNUtil.undoGrouping(() => {
                        note.addChild(newNote.note)
                        this.linkParentNote(newNote)
                      })
                      let classificationNote = newNote
                      classificationNote.focusInMindMap(0.3)
                      break;
                    case 2:  // 只有1个//，分割为两个卡片
                      let lastNote
                      titlePartArray.forEach(title => {
                        let newClassificationNote = MNNote.clone(this.types["归类"].templateNoteId)
                        newClassificationNote.note.noteTitle = `“${title}”相关${type}`
                        MNUtil.undoGrouping(() => {
                          note.addChild(newClassificationNote.note)
                          this.linkParentNote(newClassificationNote)
                        })
                        note = newClassificationNote
                        lastNote = newClassificationNote
                      })
                      classificationNote = lastNote
                      classificationNote.focusInMindMap(0.3)
                      break;
                    default: // 大于等于三个部分才需要处理
                      // 把 item1+itemn, item1+itemn-1+itemn, item1+itemn-2+itemn-1+itemn, ... , item1+item2+item3+...+itemn 依次加入数组
                      // 比如 “赋范空间上的//有界//线性//算子” 得到的 titlePartArray 是
                      // ["赋范空间上的", "有界", "线性", "算子"]
                      // 则 titleArray = ["赋范空间上的算子", "赋范空间上的线性算子", "赋范空间上的有界线性算子"]
                      let titleArray = []
                      const prefix = titlePartArray[0];
                      let changedTitlePart = titlePartArray[titlePartArray.length-1]
                      for (let i = titlePartArray.length-1 ; i >= 1 ; i--) {
                        if  (i < titlePartArray.length-1) {
                          changedTitlePart = titlePartArray[i] + changedTitlePart
                        }
                        titleArray.push(prefix + changedTitlePart)
                      }
                      
                      // 依次创建归类卡片
                      let currentParent = note
                      let lastCreatedNote
                      titleArray.forEach(title => {
                        let newClassificationNote = MNNote.clone(this.types["归类"].templateNoteId)
                        newClassificationNote.note.noteTitle = `“${title}”相关${type}`
                        MNUtil.undoGrouping(() => {
                          currentParent.addChild(newClassificationNote.note)
                          this.linkParentNote(newClassificationNote)
                        })
                        currentParent = newClassificationNote
                        lastCreatedNote = newClassificationNote
                      })
                      lastNote = lastCreatedNote
                      lastNote.focusInMindMap(0.3)
                      break;
                  }
                } else {
                  // 如果不是归类卡片，弹出选择框让用户选择类型
                  //TODO:这里应该可以用 Promise，或者 delay 来
                  UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
                    "增加归类卡片",
                    "选择类型",
                    0,
                    "取消",
                    ["定义","命题","例子","反例","思想方法","问题"],
                    (alert, buttonIndex) => {
                      if (buttonIndex == 0) { return }
                      const typeMap = {1: "定义", 2: "命题", 3: "例子", 4: "反例", 5: "思想方法", 6: "问题"}
                      type = typeMap[buttonIndex]
                      switch (titlePartArrayLength) {
                        case 1:  
                        case 2:  
                          // 创建新的归类卡片
                          let newNote = MNNote.clone(this.types["归类"].templateNoteId)
                          newNote.note.noteTitle = `“${userInputTitle}”相关${type}`
                          MNUtil.undoGrouping(() => {
                            note.addChild(newNote.note)
                            this.linkParentNote(newNote)
                          })
                          lastNote = newNote
                          lastNote.focusInMindMap(0.3)
                          break;
                        default: // 大于等于三个部分才需要处理
                          // 把 item1+itemn, item1+itemn-1+itemn, item1+itemn-2+itemn-1+itemn, ... , item1+item2+item3+...+itemn 依次加入数组
                          // 比如 “赋范空间上的//有界//线性//算子” 得到的 titlePartArray 是
                          // ["赋范空间上的", "有界", "线性", "算子"]
                          // 则 titleArray = ["赋范空间上的算子", "赋范空间上的线性算子", "赋范空间上的有界线性算子"]
                          let titleArray = []
                          const prefix = titlePartArray[0];
                          let changedTitlePart = titlePartArray[titlePartArray.length-1]
                          for (let i = titlePartArray.length-1 ; i >= 1 ; i--) {
                            if  (i < titlePartArray.length-1) {
                              changedTitlePart = titlePartArray[i] + changedTitlePart
                            }
                            titleArray.push(prefix + changedTitlePart)
                          }
                          
                          let currentParent = note
                          let lastCreatedNote
                          titleArray.forEach(title => {
                            let newClassificationNote = MNNote.clone(this.types["归类"].templateNoteId)
                            newClassificationNote.note.noteTitle = `“${title}”相关${type}`
                            MNUtil.undoGrouping(() => {
                              currentParent.addChild(newClassificationNote.note)
                              this.linkParentNote(newClassificationNote)
                            })
                            currentParent = newClassificationNote
                            lastCreatedNote = newClassificationNote
                          })
                          lastNote = lastCreatedNote
                          lastNote.focusInMindMap(0.3)
                          break;
                      }
                    })
                }
              } catch (error) {
                MNUtil.showHUD(`连续向下倒序增加模板失败: ${error.message || error}`);
              }
              break;
            case 1: // 连续向下「顺序」增加模板
              /**
               * 通过//来分割标题，增加一连串的归类卡片（顺序，与case2倒序不同）
               * 比如：赋范空间上的有界线性算子//的判定//：充分条件
               * -> 赋范空间上的有界线性算子、赋范空间上的有界线性算子的判定、赋范空间上的有界线性算子的判定：充分条件
               */
              try {
                let titlePartArray = userInputTitle.split("//")
                let titlePartArrayLength = titlePartArray.length
                let type
                let classificationNote
                
                if (note.title.isClassificationNoteTitle()) { // 如果选中的是归类卡片
                  // 获取要增加的归类卡片的类型
                  type = note.title.toClassificationNoteTitle()
                  switch (titlePartArrayLength) {
                    case 1:  // 没有输入 //，正常向下添加
                      // 创建新的归类卡片
                      let newNote = MNNote.clone(this.types["归类"].templateNoteId)
                      newNote.note.noteTitle = `“${userInputTitle}”相关${type}`
                      MNUtil.undoGrouping(() => {
                        note.addChild(newNote.note)
                        this.linkParentNote(newNote)
                      })
                      classificationNote = newNote
                      classificationNote.focusInMindMap(0.3)
                      break;
                    case 2:  // 只有1个//，分割为两个卡片
                      let lastNote
                      titlePartArray.forEach(title => {
                        let newClassificationNote = MNNote.clone(this.types["归类"].templateNoteId)
                        newClassificationNote.note.noteTitle = `“${title}”相关${type}`
                        MNUtil.undoGrouping(() => {
                          note.addChild(newClassificationNote.note)
                          this.linkParentNote(newClassificationNote)
                        })
                        note = newClassificationNote
                        lastNote = newClassificationNote
                      })
                      classificationNote = lastNote
                      classificationNote.focusInMindMap(0.3)
                      break;
                    default: // 大于等于两个部分才需要处理
                      // 顺序组合：第一个，第一+二个，第一+二+三个...
                      // 比如 "赋范空间上的有界线性算子//的判定//：充分条件" 得到的 titlePartArray 是
                      // ["赋范空间上的有界线性算子", "的判定", "：充分条件"]
                      // 则 titleArray = ["赋范空间上的有界线性算子", "赋范空间上的有界线性算子的判定", "赋范空间上的有界线性算子的判定：充分条件"]
                      let titleArray = []
                      let changedTitlePart = titlePartArray[0];
                      titleArray.push(changedTitlePart) // 添加第一个部分
                      
                      // 生成顺序组合
                      for (let i = 1; i < titlePartArray.length; i++) {
                        changedTitlePart = changedTitlePart + titlePartArray[i]
                        titleArray.push(changedTitlePart)
                      }
                      
                      // 依次创建归类卡片
                      let currentParent = note
                      let lastCreatedNote
                      titleArray.forEach(title => {
                        let newClassificationNote = MNNote.clone(this.types["归类"].templateNoteId)
                        newClassificationNote.note.noteTitle = `“${title}”相关${type}`
                        MNUtil.undoGrouping(() => {
                          currentParent.addChild(newClassificationNote.note)
                          this.linkParentNote(newClassificationNote)
                        })
                        currentParent = newClassificationNote
                        lastCreatedNote = newClassificationNote
                      })
                      lastNote = lastCreatedNote
                      lastNote.focusInMindMap(0.3)
                      break;
                  }
                } else {
                  // 如果不是归类卡片，弹出选择框让用户选择类型
                  UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
                    "增加归类卡片",
                    "选择类型",
                    0,
                    "取消",
                    ["定义","命题","例子","反例","思想方法","问题"],
                    (alert, buttonIndex) => {
                      if (buttonIndex == 0) { return }
                      const typeMap = {1: "定义", 2: "命题", 3: "例子", 4: "反例", 5: "思想方法", 6: "问题"}
                      type = typeMap[buttonIndex]
                      switch (titlePartArrayLength) {
                        case 1:
                          // 创建新的归类卡片
                          let newNote = MNNote.clone(this.types["归类"].templateNoteId)
                          newNote.note.noteTitle = `“${userInputTitle}”相关${type}`
                          MNUtil.undoGrouping(() => {
                            note.addChild(newNote.note)
                            this.linkParentNote(newNote)
                          })
                          classificationNote = newNote
                          classificationNote.focusInMindMap(0.3)
                          break;
                        case 2:
                          // 分割为两个卡片
                          currentParent = note
                          let lastNote
                          titlePartArray.forEach(title => {
                            let newClassificationNote = MNNote.clone(this.types["归类"].templateNoteId)
                            newClassificationNote.note.noteTitle = `“${title}”相关${type}`
                            MNUtil.undoGrouping(() => {
                              currentParent.addChild(newClassificationNote.note)
                              this.linkParentNote(newClassificationNote)
                            })
                            currentParent = newClassificationNote
                            lastNote = newClassificationNote
                          })
                          classificationNote = lastNote
                          classificationNote.focusInMindMap(0.3)
                          break;
                        default: // 大于等于三个部分才需要处理
                          // 顺序组合逻辑与上面相同
                          let titleArray = []
                          let changedTitlePart = titlePartArray[0];
                          titleArray.push(changedTitlePart)
                          
                          for (let i = 1; i < titlePartArray.length; i++) {
                            changedTitlePart = changedTitlePart + titlePartArray[i]
                            titleArray.push(changedTitlePart)
                          }
                          
                          let currentParent = note
                          let lastCreatedNote
                          titleArray.forEach(title => {
                            let newClassificationNote = MNNote.clone(this.types["归类"].templateNoteId)
                            newClassificationNote.note.noteTitle = `“${title}”相关${type}`
                            MNUtil.undoGrouping(() => {
                              currentParent.addChild(newClassificationNote.note)
                              this.linkParentNote(newClassificationNote)
                            })
                            currentParent = newClassificationNote
                            lastCreatedNote = newClassificationNote
                          })
                          classificationNote = lastCreatedNote
                          classificationNote.focusInMindMap(0.3)
                          break;
                      }
                    })
                }
              } catch (error) {
                MNUtil.showHUD(`连续向下顺序增加模板失败: ${error.message || error}`);
              }
              break;
          }
        }
      )
    } catch (error) {
      MNUtil.showHUD(error);
    }
  }
}

/**
 * 文献管理与文献阅读
 */
class MNLiterature {

}

class HtmlMarkdownUtils {
  static icons = {
    // step: '🚩',
    // point: '▸',
    // subpoint: '▪',
    // subsubpoint: '•',
    level1: '🚩',
    level2: '▸',
    level3: '▪',
    level4: '•',
    level5: '·',
    key: '🔑',
    alert: '⚠️',
    danger: '❗❗❗',
    remark: '📝',
    goal: '🎯',
    question: '❓',
    idea: '💡',
    method: '✨'
  };
  static prefix = {
    danger: '',
    alert: '注意：',
    key: '',
    // step: '',
    // point: '',
    // subpoint: '',
    // subsubpoint: '',
    level1: '',
    level2: '',
    level3: '',
    level4: '',
    level5: '',
    remark: '',
    goal: '',
    question: '',
    idea: '思路：',
    method: '方法：'
  };
  static styles = {
    // 格外注意
    danger: 'font-weight:700;color:#6A0C0C;background:#FFC9C9;border-left:6px solid #A93226;font-size:1em;padding:8px 15px;display:inline-block;transform:skew(-3deg);box-shadow:2px 2px 5px rgba(0,0,0,0.1);',
    // 注意
    alert: 'background:#FFF;color:#FF8C5A;border:2px solid currentColor;border-radius:3px;padding:6px 12px;font-weight:600;box-shadow:0 1px 3px rgba(255,140,90,0.2);display:inline-block;',
    // 关键
    key: 'color: #B33F00;background: #FFF1E6;border-left: 6px solid #FF6B35;padding:16px 12px 1px;line-height:2;position:relative;top:6px;display:inline-block;font-family:monospace;margin-top:-2px;',
    // 步骤
    // step: "font-weight:700;color:#2A3B4D;background:linear-gradient(90deg,#E8F0FE 80%,#C2DBFE);font-size:1.3em;padding:8px 15px;border-left:6px solid #4F79A3;display:inline-block;transform:skew(-3deg);box-shadow:2px 2px 5px rgba(0,0,0,0.08);",
    // point: "font-weight:600;color:#4F79A3; background:linear-gradient(90deg,#F3E5F5 50%,#ede0f7);font-size:1.1em;padding:6px 12px;border-left:4px solid #7A9DB7;transform:skew(-1.5deg);box-shadow:1px 1px 3px rgba(0,0,0,0.05);margin-left:40px;position:relative;",
    // subpoint: "font-weight:500;color:#7A9DB7;background:#E8F0FE;padding:4px 10px;border-radius:12px;border:1px solid #B3D4FF;font-size:0.95em;margin-left:80px;position:relative;",
    // subsubpoint: "font-weight:400;color:#9DB7CA;background:#F8FBFF;padding:3px 8px;border-left:2px dashed #B3D4FF;font-size:0.9em;margin-left:120px;position:relative;",
    level1: "font-weight:600;color:#1E40AF;background:linear-gradient(15deg,#EFF6FF 30%,#DBEAFE);border:2px solid #3B82F6;border-radius:12px;padding:10px 18px;display:inline-block;box-shadow:2px 2px 0px #BFDBFE,4px 4px 8px rgba(59,130,246,0.12);position:relative;margin:4px 8px;",
    level2: "font-weight:600;color:#4F79A3; background:linear-gradient(90deg,#F3E5F5 50%,#ede0f7);font-size:1.1em;padding:6px 12px;border-left:4px solid #7A9DB7;transform:skew(-1.5deg);box-shadow:1px 1px 3px rgba(0,0,0,0.05);margin-left:40px;position:relative;",
    level3: "font-weight:500;color:#7A9DB7;background:#E8F0FE;padding:4px 10px;border-radius:12px;border:1px solid #B3D4FF;font-size:0.95em;margin-left:80px;position:relative;",
    level4: "font-weight:400;color:#9DB7CA;background:#F8FBFF;padding:3px 8px;border-left:2px dashed #B3D4FF;font-size:0.9em;margin-left:120px;position:relative;",
    level5: "font-weight:300;color:#B3D4FF;background:#FFFFFF;padding:2px 6px;border-radius:8px;border:1px dashed #B3D4FF;font-size:0.85em;margin-left:160px;position:relative;",
    remark: 'background:#F5E6C9;color:#6d4c41;display:inline-block;border-left:5px solid #D4AF37;padding:2px 8px 3px 12px;border-radius:0 4px 4px 0;box-shadow:1px 1px 3px rgba(0,0,0,0.08);margin:0 2px;line-height:1.3;vertical-align:baseline;position:relative;',
    // 目标
    goal: 'font-weight:900;font-size:0.7em;color:#F8FDFF;background:#00BFA5 radial-gradient(circle at 100% 0%,#64FFDA 0%,#009688 00%);padding:12px 24px;border-radius:50px;display:inline-block;position:relative;box-shadow:0 4px 8px rgba(0, 191, 166, 0.26);text-shadow:0 1px 3px rgba(0,0,0,0.35);border:2px solid rgba(255,255,255,0.3)',
    // 问题
    question: 'font-weight:700;color:#3D1A67;background:linear-gradient(15deg,#F8F4FF 30%,#F1E8FF);border:3px double #8B5CF6;border-radius:16px 4px 16px 4px;padding:14px 22px;display:inline-block;box-shadow:4px 4px 0px #DDD6FE,8px 8px 12px rgba(99,102,241,0.12);position:relative;margin:4px 8px;',
    // 思路
    idea: 'font-weight:600;color:#4A4EB2;background:linear-gradient(15deg,#F0F4FF 30%,#E6EDFF);border:2px dashed #7B7FD1;border-radius:12px;padding:10px 18px;display:inline-block;box-shadow:0 0 0 2px rgba(123,127,209,0.2),inset 0 0 10px rgba(123,127,209,0.1);position:relative;margin:4px 8px;',
    // 方法
    method: 'display:block;font-weight:700;color:#FFFFFF;background:linear-gradient(135deg,#0D47A1 0%,#082C61 100%);font-size:1.3em;padding:12px 20px 12px 24px;border-left:10px solid #041E42;margin:0 0 12px 0;border-radius:0 6px 6px 0;box-shadow:0 4px 10px rgba(0,0,0,0.25),inset 0 0 10px rgba(255,255,255,0.1);text-shadow:1px 1px 2px rgba(0,0,0,0.35);position:relative;'
  };
  static createHtmlMarkdownText(text, type = 'none') {
    let handledText = Pangu.spacing(text)
    if (type === 'none') {
      return text.trim();
    } else {
      return `<span id="${type}" style="${this.styles[type]} ">${this.icons[type]} ${this.prefix[type]}${handledText}</span>`;
    }
  }

  /**
   * 正则匹配获取 span 标签的内容
   */
  static getSpanContent(comment) {
    let text
    switch (MNUtil.typeOf(comment)) {
      case "string":
        text = comment
        break;
      case "MNComment":
        text = comment.text?comment.text:""
        break;
    }
    const regex = /<span[^>]*>(.*?)<\/span>/;
    const match = text.match(regex);
    if (match && match[1]) {
      return match[1].trim();
    } else {
      return text;
    }
  }

  /**
   * 正则匹配获取 span 标签的文本内容（不含 emoji 和前缀）
   */
  static getSpanTextContent(comment) {
    let text
    switch (MNUtil.typeOf(comment)) {
      case "string":
        text = comment
        break;
      case "MNComment":
        text = comment.text?comment.text:""
        break;
    }
    const regex = /<span[^>]*>(.*?)<\/span>/;
    const match = text.match(regex);
    if (match && match[1]) {
      text = match[1].trim();
      // 去掉图标
      Object.values(this.icons).forEach(icon => {
        text = text.replace(icon, '').trim();
      });
      // 去掉前缀文本
      Object.values(this.prefix).forEach(prefix => {
        if (prefix && text.startsWith(prefix)) {
          text = text.substring(prefix.length).trim();
        }
      });
      return text
    } else {
      return text;
    }
  }

  /**
   * 正则匹配获取 span 的 id（类型）
   */
  static getSpanType(comment) {
    let span
    switch (MNUtil.typeOf(comment)) {
      case "string":
        span = comment
        break;
      case "MNComment":
        span = comment.text?comment.text:""
        break;
    }
    const regex = /<span\s+id="([^"]*)"/;
    const match = span.match(regex);
    if (match && match[1]) {
      return match[1].trim();
    } else {
      return span;
    }
  }

  /**
   * 获取 id（类型） 往下一级的类型
   */
  static getSpanNextLevelType(type) {
    const levelMap = {
      goal: 'step',
      // step: 'point',
      // point: 'subpoint',
      // subpoint: 'subsubpoint',
      // subsubpoint: 'subsubpoint'
      level1: 'level2',
      level2: 'level3',
      level3: 'level4',
      level4: 'level5',
      level5: 'level5',
    };
    return levelMap[type] || undefined;
  }

  /**
   * 获取 id（类型） 往上一级的类型
   */
  static getSpanLastLevelType(type) {
    const levelMap = {
      // point: 'step',
      // subpoint: 'point',
      // subsubpoint: 'subpoint',
      // step: 'goal',
      goal: 'goal',
      level1: 'goal',
      level2: 'level1',
      level3: 'level2',
      level4: 'level3',
      level5: 'level4',
    };
    return levelMap[type] || undefined;
  }

  /**
   * 是否属于可升降级类型
   * 
   * 防止对 remark 等类型进行处理
   */
  static isLevelType(type) {
    // const levelTypes = ['goal', 'step', 'point', 'subpoint', 'subsubpoint'];
    const levelTypes = ['goal', 'level1', 'level2', 'level3', 'level4', 'level5',];
    return levelTypes.includes(type);
  }

  /**
   * 获取 note 的 HtmlMD 评论的 index 和类型
   */
  static getHtmlMDCommentIndexAndTypeObjArr(note) {
    let comments = note.MNComments
    let htmlMDCommentsObjArr = []
    comments.forEach(
      (comment, index) => {
        if (this.isHtmlMDComment(comment)) {
          htmlMDCommentsObjArr.push(
            {
              index: index,
              type: this.getSpanType(comment.text)
            }
          )
        }
      }
    )
    return htmlMDCommentsObjArr
  }

  /**
   * 判定评论是否是 HtmlMD 评论
   */
  static isHtmlMDComment(comment) {
    let text
    switch (MNUtil.typeOf(comment)) {
      case "string":
        text = comment
        break;
      case "MNComment":
        text = comment.text?comment.text:""
        break;
    }
    if (text == undefined) {
      return false
    } else {
      return !!text.startsWith("<span")
    }
  }

  /**
   * 将 HtmlMD 评论类型变成下一级
   */
  static changeHtmlMDCommentTypeToNextLevel(comment) {
    if (MNUtil.typeOf(comment) === "MNComment") {
      let content = this.getSpanTextContent(comment)
      let type = this.getSpanType(comment)
      if (this.isHtmlMDComment(comment) && this.isLevelType(type)) {
        let nextLevelType = this.getSpanNextLevelType(type)
        comment.text = this.createHtmlMarkdownText(content, nextLevelType)
      }
    }
  }

  /**
   * 将 HtmlMD 评论类型变成上一级
   */
  static changeHtmlMDCommentTypeToLastLevel(comment) {
    if (MNUtil.typeOf(comment) === "MNComment") {
      let content = this.getSpanTextContent(comment)
      let type = this.getSpanType(comment)
      if (this.isHtmlMDComment(comment) && this.isLevelType(type)) {
        let lastLevelType = this.getSpanLastLevelType(type)
        comment.text = this.createHtmlMarkdownText(content, lastLevelType)
      }
    }
  }


  /**
   * 获取评论中最后一个 HtmlMD 评论
   */
  static getLastHtmlMDComment(note) {
    let comments = note.MNComments
    let lastHtmlMDComment = undefined
    if (comments.length === 2 && comments[0] == undefined && comments[1] == undefined) {
      return false
    }
    comments.forEach(
      comment => {
        if (this.isHtmlMDComment(comment)) {
          lastHtmlMDComment = comment
        }
      }
    )
    return lastHtmlMDComment
  }

  /**
   * 判断是否有 HtmlMD 评论
   */
  static hasHtmlMDComment(note) {
    return !!this.getLastHtmlMDComment(note)
  }

  /**
   * 增加同级评论
   */
  static addSameLevelHtmlMDComment(note, text, type) {
    note.appendMarkdownComment(
      this.createHtmlMarkdownText(text, type),
    )
  }

  /**
   * 增加下一级评论
   */
  static addNextLevelHtmlMDComment(note, text, type) {
    let nextLevelType = this.getSpanNextLevelType(type)
    if (nextLevelType) {
      note.appendMarkdownComment(
        this.createHtmlMarkdownText(text, nextLevelType)
      )
    } else {
      note.appendMarkdownComment(
        this.createHtmlMarkdownText(text, type)
      )
    }
  }

  /**
   * 增加上一级评论
   */
  static addLastLevelHtmlMDComment(note, text, type) {
    let lastLevelType = this.getSpanLastLevelType(type)
    if (lastLevelType) {
      note.appendMarkdownComment(
        this.createHtmlMarkdownText(text, lastLevelType)
      )
    } else {
      note.appendMarkdownComment(
        this.createHtmlMarkdownText(text, type)
      )
    }
  }

  /**
   * 自动根据最后一个 HtmlMD 评论的类型增加 Level 类型评论
   */
  static autoAddLevelHtmlMDComment(note, text, goalLevel = "same") {
    let lastHtmlMDComment = this.getLastHtmlMDComment(note)
    if (lastHtmlMDComment) {
      let lastHtmlMDCommentType = this.getSpanType(lastHtmlMDComment.text)
      switch (goalLevel) {
        case "same":
          this.addSameLevelHtmlMDComment(note, text, lastHtmlMDCommentType)
          break;
        case "next":
          this.addNextLevelHtmlMDComment(note, text, lastHtmlMDCommentType)
          break;
        case "last":
          this.addLastLevelHtmlMDComment(note, text, lastHtmlMDCommentType)
          break
        default: 
          MNUtil.showHUD("No goalLevel: " + goalLevel)
          break;
      }
    } else {
      // 如果没有 HtmlMD 评论，就添加一个一级
      note.appendMarkdownComment(
        this.createHtmlMarkdownText(text, 'goal')
      )
    }
  }

  // 解析开头的连字符数量
  static parseLeadingDashes(str) {
    let count = 0;
    let index = 0;
    const maxDashes = 5;
    
    while (count < maxDashes && index < str.trim().length) {
      if (str[index] === '-') {
        count++;
        index++;
        // 跳过后续空格
        while (index < str.length && (str[index] === ' ' || str[index] === '\t')) {
          index++;
        }
      } else {
        break;
      }
    }
    
    return {
      count: count > 0 ? Math.min(count, maxDashes) : 0,
      remaining: str.slice(index).trim()
    };
  }

  /**
   * 执行向上合并操作，将被聚焦笔记的后代笔记合并到其自身。
   * 子笔记的标题会作为带样式的、独立的评论添加到它们各自的直接父笔记中，
   * 然后子笔记（清空标题后）的结构内容再合并到父笔记。
   *
   * @param {MNNote} rootFocusNote 要处理的主笔记，其后代笔记将被向上合并到此笔记中。
   * @param {string} firstLevelType rootFocusNote 直接子笔记的 HtmlMarkdownUtils 类型 (例如：'goal', 'step')。
   */
  static upwardMergeWithStyledComments(rootFocusNote, firstLevelType) {
      // 确保 MNUtil 和 HtmlMarkdownUtils 在当前作用域中可用
      if (typeof MNUtil === 'undefined' || typeof HtmlMarkdownUtils === 'undefined') {
          console.error("MNUtil 或 HtmlMarkdownUtils 未定义。");
          if (typeof MNUtil !== 'undefined' && typeof MNUtil.showHUD === 'function') {
              MNUtil.showHUD("错误：找不到必要的工具库。", 2);
          }
          return;
      }

      // 1. API 名称更正：使用属性访问 rootFocusNote.descendantNodes
      let allDescendants, treeIndex;
      try {
          // 假设 descendantNodes 是一个直接返回所需对象的属性
          const nodesData = rootFocusNote.descendantNodes;
          if (!nodesData || typeof nodesData.descendant === 'undefined' || typeof nodesData.treeIndex === 'undefined') {
              throw new Error("descendantNodes 属性未返回预期的 {descendant, treeIndex} 对象结构。");
          }
          allDescendants = nodesData.descendant;
          treeIndex = nodesData.treeIndex;
      } catch (e) {
          console.error("无法获取后代笔记。请确保 rootFocusNote.descendantNodes 属性存在且能正确返回数据。", e);
          MNUtil.showHUD("错误：无法获取后代笔记数据。", 2);
          return;
      }

      if (!allDescendants || allDescendants.length === 0) {
          MNUtil.showHUD("没有可合并的后代笔记。", 2);
          return;
      }

      const nodesWithInfo = allDescendants.map((node, i) => ({
          node: node,
          level: treeIndex[i].length // 相对于 rootFocusNote 子笔记的深度 (1 代表直接子笔记)
      }));

      let maxLevel = 0;
      if (nodesWithInfo.length > 0) {
          maxLevel = Math.max(...nodesWithInfo.map(item => item.level));
      }

      // (移除 aggregatedRawTextFromChildren Map，因为不再需要向上聚合标题文本)

      /**
       * 根据笔记在 treeIndex 中的层级（相对于 rootFocusNote 子笔记的深度）
       * 和第一层子笔记的初始类型，来确定该笔记的 HtmlMarkdownUtils 类型。
       * @param {number} level - 笔记的层级 (1 代表 rootFocusNote 的直接子笔记)
       * @param {string} initialTypeForLevel1 - 第一层子笔记的初始类型
       * @returns {string} - 计算得到的 HtmlMarkdownUtils 类型
       */
      function getNodeTypeForTreeIndexLevel(level, initialTypeForLevel1) {
          let currentType = initialTypeForLevel1;
          if (!HtmlMarkdownUtils.isLevelType(initialTypeForLevel1)) {
              console.warn(`初始类型 "${initialTypeForLevel1}" 不是一个可识别的层级类型。将为第一层级默认使用 'goal'。`);
              currentType = 'goal';
          }
          if (level === 1) {
              return currentType;
          }
          for (let i = 1; i < level; i++) {
              const nextType = HtmlMarkdownUtils.getSpanNextLevelType(currentType);
              if (!nextType || nextType === currentType) {
                  return currentType;
              }
              currentType = nextType;
          }
          return currentType;
      }

      // 从最深层级开始，逐层向上处理
      for (let currentTreeIndexLevel = maxLevel; currentTreeIndexLevel >= 1; currentTreeIndexLevel--) {
          const nodesAtThisLevel = nodesWithInfo.filter(item => item.level === currentTreeIndexLevel);

          for (const item of nodesAtThisLevel) {
              const currentNode = item.node;
              const parentNode = currentNode.parentNote;

              if (!parentNode) {
                  console.error(`层级 ${currentTreeIndexLevel} 的笔记 ${currentNode.id || '(无ID)'} 没有父笔记。已跳过。`);
                  continue;
              }
              if (parentNode.id !== rootFocusNote.id && !allDescendants.some(d => d.id === parentNode.id)) {
                  console.warn(`笔记 ${currentNode.id} 的父笔记 ${parentNode.id} 不在 rootFocusNote 后代笔记的合并范围内。已跳过此笔记的合并。`);
                  continue;
              }

              // 1. 确定 currentNode 的标题在添加到 parentNode 的评论中时应采用的 'type'。
              //    这个 type 是基于 currentNode 相对于 rootFocusNote 的深度来决定的。
              const typeForCurrentNodeTitleInParentComment = getNodeTypeForTreeIndexLevel(currentTreeIndexLevel, firstLevelType);

              // 2. 准备来自 currentNode 标题的原始文本内容。
              let rawTextFromTitle;
              if (typeof currentNode.title === 'string') {
                  if (typeof currentNode.title.toNoBracketPrefixContent === 'function') { // 您提到的特定方法
                      rawTextFromTitle = currentNode.title.toNoBracketPrefixContent();
                  } else if (HtmlMarkdownUtils.isHtmlMDComment(currentNode.title)) {
                      rawTextFromTitle = HtmlMarkdownUtils.getSpanTextContent(currentNode.title);
                  } else {
                      rawTextFromTitle = currentNode.title;
                  }
              } else {
                  rawTextFromTitle = "";
              }
              rawTextFromTitle = rawTextFromTitle.trim();

              // 3. 将 currentNode 的 rawTextFromTitle (原始标题文本) 作为一个新的带样式的评论添加到 parentNode。
              //    评论的类型由 currentNode 自身的层级决定。
              if (rawTextFromTitle) { // 仅当标题有内容时才添加评论
                  // HtmlMarkdownUtils.addSameLevelHtmlMDComment(parentNode, rawTextFromTitle, typeForCurrentNodeTitleInParentComment);
                  // 或者，如果更倾向于直接使用 appendMarkdownComment:
                  if (typeof parentNode.appendMarkdownComment === 'function') {
                      parentNode.appendMarkdownComment(
                          HtmlMarkdownUtils.createHtmlMarkdownText(rawTextFromTitle, typeForCurrentNodeTitleInParentComment)
                      );
                  } else {
                      console.warn(`parentNode ${parentNode.id} 上未找到 appendMarkdownComment 方法。`);
                  }
              }

              // 4. 清空 currentNode 的标题。
              if (typeof currentNode.setTitle === 'function') {
                  currentNode.setTitle("");
              } else {
                  currentNode.title = "";
              }

              // 5. 执行 currentNode（现在已无标题，但包含其原有评论、子节点等）到 parentNode 的结构性合并。
              if (typeof currentNode.mergeInto === 'function') {
                  currentNode.mergeInto(parentNode);
              } else {
                  console.warn(`笔记 ${currentNode.id || '(无ID)'} 上未找到 mergeInto 方法。结构性合并已跳过。`);
              }
          }
      }
      MNUtil.showHUD("向上合并完成！", 2);
  }


    /**
   * 添加问答类型的 HTML Markdown 评论
   * 包含问题、答案和详细解释三个部分
   * @param {MNNote} note - 要添加评论的笔记
   * @param {string} placeholder - 占位符，默认为 "[待填写]"
   */
  static async addQuestionHtmlMDComment(note, questionPlaceholder = "❓ ",answerPlaceholder = "💡 ", explanationPlaceholder = "✍︎ ") {
    try {
      // 收集问题
      let questionResult = await MNUtil.input(
        "输入问题", 
        "请输入您的问题（留空则使用占位符）", 
        ["确定", "取消"]
      )
      
      if (questionResult.button === 1) {
        MNUtil.showHUD("已取消")
        return
      }
      
      let question = questionResult.input.trim() || questionPlaceholder
      
      // 收集答案
      let answerResult = await MNUtil.input(
        "输入答案",
        "请输入问题的答案（留空则使用占位符）",
        ["确定", "取消"]
      )
      
      if (answerResult.button === 1) {
        MNUtil.showHUD("已取消")
        return
      }
      
      let answer = answerResult.input.trim() || answerPlaceholder
      
      // 收集详细解释
      let explanationResult = await MNUtil.input(
        "输入详细解释",
        "请输入详细解释（留空则使用占位符）",
        ["确定", "跳过"]
      )
      
      let explanation = explanationResult.input.trim() || explanationPlaceholder
      
      // 生成问答HTML
      let questionHtml = this.createQuestionHtml(question, answer, explanation)
      
      // 添加到笔记
      MNUtil.undoGrouping(()=>{
        note.appendMarkdownComment(questionHtml)
      })
      // MNUtil.showHUD("问答已添加")
      
    } catch (error) {
      MNUtil.showHUD("添加失败：" + error.toString())
    }
  }

  /**
   * 创建问答类型的HTML
   * @param {string} question - 问题
   * @param {string} answer - 答案
   * @param {string} explanation - 详细解释
   * @returns {string} HTML格式的问答内容
   */
  static createQuestionHtml(question, answer, explanation) {
    // 对内容进行处理，添加中文排版优化
    question = Pangu.spacing(question)
    answer = Pangu.spacing(answer)
    explanation = Pangu.spacing(explanation)
    
    return `<div style="background:linear-gradient(15deg,#6366F1,#8B5CF6);color:white;padding:24px;margin:24px 0;border-radius:12px;box-shadow:0 4px 12px rgba(99,102,241,0.3);"><div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;"><div style="width:40px;height:40px;background:rgba(255,255,255,0.2);border-radius:50%;display:flex;align-items:center;justify-content:center;">✨</div><div><div style="font-size:1.1em;font-weight:600;">${question}</div><div style="font-size:0.9em;opacity:0.9;">${answer}</div></div></div><div style="line-height:1.7;">${explanation}</div></div>`
  }

  /**
   * 更新现有问答评论的某个部分
   * @param {MNComment} comment - 要更新的评论
   * @param {string} part - 要更新的部分 ('question' | 'answer' | 'explanation')
   * @param {string} newContent - 新内容
   */
  static updateQuestionPart(comment, part, newContent) {
    if (!comment || !comment.text) return
    
    // 解析现有的问答内容
    let parsed = this.parseQuestionHtml(comment.text)
    if (!parsed) {
      MNUtil.showHUD("这不是一个有效的问答评论")
      return
    }
    
    // 更新对应部分
    switch(part) {
      case 'question':
        parsed.question = Pangu.spacing(newContent)
        break
      case 'answer':
        parsed.answer = Pangu.spacing(newContent)
        break
      case 'explanation':
        parsed.explanation = Pangu.spacing(newContent)
        break
      default:
        MNUtil.showHUD("无效的部分：" + part)
        return
    }
    
    // 重新生成HTML并更新评论
    comment.text = this.createQuestionHtml(parsed.question, parsed.answer, parsed.explanation)
  }

  /**
   * 解析问答HTML内容
   * @param {string} html - HTML内容
   * @returns {object|null} 包含 question, answer, explanation 的对象，或 null
   */
  static parseQuestionHtml(html) {
    try {
      // 检查是否是问答格式
      if (!html.includes('background:linear-gradient(15deg,#6366F1,#8B5CF6)')) {
        return null
      }
      
      // 使用正则表达式提取内容
      const questionMatch = html.match(/font-weight:600;">([^<]+)<\/div>/)
      const answerMatch = html.match(/opacity:0.9;">([^<]+)<\/div>/)
      const explanationMatch = html.match(/line-height:1.7;">([^<]+)<\/div>/)
      
      if (questionMatch && answerMatch && explanationMatch) {
        return {
          question: questionMatch[1],
          answer: answerMatch[1],
          explanation: explanationMatch[1]
        }
      }
      
      return null
    } catch (error) {
      return null
    }
  }

  /**
   * 检查评论是否是问答类型
   * @param {MNComment|string} comment - 评论对象或评论文本
   * @returns {boolean}
   */
  static isQuestionComment(comment) {
    let text
    switch (MNUtil.typeOf(comment)) {
      case "string":
        text = comment
        break
      case "MNComment":
        text = comment.text ? comment.text : ""
        break
      default:
        return false
    }
    
    return text.includes('background:linear-gradient(15deg,#6366F1,#8B5CF6)')
  }
}
// 夏大鱼羊 - end
    
/**
 * 夏大鱼羊 - 字符串函数 - begin
 */
// https://github.com/vinta/pangu.js
// CJK is short for Chinese, Japanese, and Korean.
//
// CJK includes following Unicode blocks:
// \u2e80-\u2eff CJK Radicals Supplement
// \u2f00-\u2fdf Kangxi Radicals
// \u3040-\u309f Hiragana
// \u30a0-\u30ff Katakana
// \u3100-\u312f Bopomofo
// \u3200-\u32ff Enclosed CJK Letters and Months
// \u3400-\u4dbf CJK Unified Ideographs Extension A
// \u4e00-\u9fff CJK Unified Ideographs
// \uf900-\ufaff CJK Compatibility Ideographs
//
// For more information about Unicode blocks, see
// http://unicode-table.com/en/
// https://github.com/vinta/pangu
//
// all J below does not include \u30fb
const CJK =
  "\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30fa\u30fc-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff"
// ANS is short for Alphabets, Numbers, and Symbols.
//
// A includes A-Za-z\u0370-\u03ff
// N includes 0-9
// S includes `~!@#$%^&*()-_=+[]{}\|;:'",<.>/?
//
// some S below does not include all symbols
// the symbol part only includes ~ ! ; : , . ? but . only matches one character
const CONVERT_TO_FULLWIDTH_CJK_SYMBOLS_CJK = new RegExp(
  `([${CJK}])[ ]*([\\:]+|\\.)[ ]*([${CJK}])`,
  "g"
)
const CONVERT_TO_FULLWIDTH_CJK_SYMBOLS = new RegExp(
  `([${CJK}])[ ]*([~\\!;,\\?]+)[ ]*`,
  "g"
)
const DOTS_CJK = new RegExp(`([\\.]{2,}|\u2026)([${CJK}])`, "g")
const FIX_CJK_COLON_ANS = new RegExp(`([${CJK}])\\:([A-Z0-9\\(\\)])`, "g")
// the symbol part does not include '
const CJK_QUOTE = new RegExp(`([${CJK}])([\`"\u05f4])`, "g")
const QUOTE_CJK = new RegExp(`([\`"\u05f4])([${CJK}])`, "g")
const FIX_QUOTE_ANY_QUOTE = /([`"\u05f4]+)[ ]*(.+?)[ ]*([`"\u05f4]+)/g
const CJK_SINGLE_QUOTE_BUT_POSSESSIVE = new RegExp(`([${CJK}])('[^s])`, "g")
const SINGLE_QUOTE_CJK = new RegExp(`(')([${CJK}])`, "g")
const FIX_POSSESSIVE_SINGLE_QUOTE = new RegExp(
  `([A-Za-z0-9${CJK}])( )('s)`,
  "g"
)
const HASH_ANS_CJK_HASH = new RegExp(
  `([${CJK}])(#)([${CJK}]+)(#)([${CJK}])`,
  "g"
)
const CJK_HASH = new RegExp(`([${CJK}])(#([^ ]))`, "g")
const HASH_CJK = new RegExp(`(([^ ])#)([${CJK}])`, "g")
// the symbol part only includes + - * / = & | < >
const CJK_OPERATOR_ANS = new RegExp(
  `([${CJK}])([\\+\\-\\*\\/=&\\|<>])([A-Za-z0-9])`,
  "g"
)
const ANS_OPERATOR_CJK = new RegExp(
  `([A-Za-z0-9])([\\+\\-\\*\\/=&\\|<>])([${CJK}])`,
  "g"
)
const FIX_SLASH_AS = /([/]) ([a-z\-_\./]+)/g
const FIX_SLASH_AS_SLASH = /([/\.])([A-Za-z\-_\./]+) ([/])/g
// the bracket part only includes ( ) [ ] { } < > “ ”
const CJK_LEFT_BRACKET = new RegExp(`([${CJK}])([\\(\\[\\{<>\u201c])`, "g")
const RIGHT_BRACKET_CJK = new RegExp(`([\\)\\]\\}<>\u201d])([${CJK}])`, "g")
const FIX_LEFT_BRACKET_ANY_RIGHT_BRACKET =
  /([\(\[\{<\u201c]+)[ ]*(.+?)[ ]*([\)\]\}>\u201d]+)/
const ANS_CJK_LEFT_BRACKET_ANY_RIGHT_BRACKET = new RegExp(
  `([A-Za-z0-9${CJK}])[ ]*([\u201c])([A-Za-z0-9${CJK}\\-_ ]+)([\u201d])`,
  "g"
)
const LEFT_BRACKET_ANY_RIGHT_BRACKET_ANS_CJK = new RegExp(
  `([\u201c])([A-Za-z0-9${CJK}\\-_ ]+)([\u201d])[ ]*([A-Za-z0-9${CJK}])`,
  "g"
)
const AN_LEFT_BRACKET = /([A-Za-z0-9])([\(\[\{])/g
const RIGHT_BRACKET_AN = /([\)\]\}])([A-Za-z0-9])/g
const CJK_ANS = new RegExp(
  `([${CJK}])([A-Za-z\u0370-\u03ff0-9@\\$%\\^&\\*\\-\\+\\\\=\\|/\u00a1-\u00ff\u2150-\u218f\u2700—\u27bf])`,
  "g"
)
const ANS_CJK = new RegExp(
  `([A-Za-z\u0370-\u03ff0-9~\\$%\\^&\\*\\-\\+\\\\=\\|/!;:,\\.\\?\u00a1-\u00ff\u2150-\u218f\u2700—\u27bf])([${CJK}])`,
  "g"
)
const S_A = /(%)([A-Za-z])/g
const MIDDLE_DOT = /([ ]*)([\u00b7\u2022\u2027])([ ]*)/g
const BACKSAPCE_CJK = new RegExp(`([${CJK}]) ([${CJK}])`, "g")
const SUBSCRIPT_CJK = /([\u2080-\u2099])(?=[\u4e00-\u9fa5])/g
// 上标 https://rupertshepherd.info/resource_pages/superscript-letters-in-unicode
const SUPERSCRIPT_CJK = /([\u2070-\u209F\u1D56\u1D50\u207F\u1D4F\u1D57])(?=[\u4e00-\u9fa5])/g
// 特殊字符
// \u221E: ∞
const SPECIAL = /([\u221E])(?!\s|[\(\[])/g  // (?!\s) 是为了当后面没有空格才加空格，防止出现多个空格
class Pangu {
  version
  static convertToFullwidth(symbols) {
    return symbols
      .replace(/~/g, "～")
      .replace(/!/g, "！")
      .replace(/;/g, "；")
      .replace(/:/g, "：")
      .replace(/,/g, "，")
      .replace(/\./g, "。")
      .replace(/\?/g, "？")
  }
  static toFullwidth(text) {
    let newText = text
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this
    newText = newText.replace(
      CONVERT_TO_FULLWIDTH_CJK_SYMBOLS_CJK,
      (match, leftCjk, symbols, rightCjk) => {
        const fullwidthSymbols = that.convertToFullwidth(symbols)
        return `${leftCjk}${fullwidthSymbols}${rightCjk}`
      }
    )
    newText = newText.replace(
      CONVERT_TO_FULLWIDTH_CJK_SYMBOLS,
      (match, cjk, symbols) => {
        const fullwidthSymbols = that.convertToFullwidth(symbols)
        return `${cjk}${fullwidthSymbols}`
      }
    )
    return newText
  }
  static spacing(text) {
    let newText = text
    // https://stackoverflow.com/questions/4285472/multiple-regex-replace
    newText = newText.replace(DOTS_CJK, "$1 $2")
    newText = newText.replace(FIX_CJK_COLON_ANS, "$1：$2")
    newText = newText.replace(CJK_QUOTE, "$1 $2")
    newText = newText.replace(QUOTE_CJK, "$1 $2")
    newText = newText.replace(FIX_QUOTE_ANY_QUOTE, "$1$2$3")
    newText = newText.replace(CJK_SINGLE_QUOTE_BUT_POSSESSIVE, "$1 $2")
    newText = newText.replace(SINGLE_QUOTE_CJK, "$1 $2")
    newText = newText.replace(FIX_POSSESSIVE_SINGLE_QUOTE, "$1's") // eslint-disable-line quotes
    newText = newText.replace(HASH_ANS_CJK_HASH, "$1 $2$3$4 $5")
    newText = newText.replace(CJK_HASH, "$1 $2")
    newText = newText.replace(HASH_CJK, "$1 $3")
    newText = newText.replace(CJK_OPERATOR_ANS, "$1 $2 $3")
    newText = newText.replace(ANS_OPERATOR_CJK, "$1 $2 $3")
    newText = newText.replace(FIX_SLASH_AS, "$1$2")
    newText = newText.replace(FIX_SLASH_AS_SLASH, "$1$2$3")
    newText = newText.replace(CJK_LEFT_BRACKET, "$1 $2")
    newText = newText.replace(RIGHT_BRACKET_CJK, "$1 $2")
    newText = newText.replace(FIX_LEFT_BRACKET_ANY_RIGHT_BRACKET, "$1$2$3")
    newText = newText.replace(
      ANS_CJK_LEFT_BRACKET_ANY_RIGHT_BRACKET,
      "$1 $2$3$4"
    )
    newText = newText.replace(
      LEFT_BRACKET_ANY_RIGHT_BRACKET_ANS_CJK,
      "$1$2$3 $4"
    )
    newText = newText.replace(AN_LEFT_BRACKET, "$1 $2")
    newText = newText.replace(RIGHT_BRACKET_AN, "$1 $2")
    newText = newText.replace(CJK_ANS, "$1 $2")
    newText = newText.replace(ANS_CJK, "$1 $2")
    newText = newText.replace(S_A, "$1 $2")
    // newText = newText.replace(MIDDLE_DOT, "・")
    // 去中文间的空格
    newText = newText.replace(BACKSAPCE_CJK, "$1$2")
    // 去掉下标和中文之间的空格
    newText = newText.replace(SUBSCRIPT_CJK, "$1 ")
    newText = newText.replace(SUPERSCRIPT_CJK, "$1 ")
    /* 特殊处理 */
    // 特殊字符
    newText = newText.replace(SPECIAL, "$1 ")
    // 处理 C[a,b] 这种单独字母紧跟括号的情形，不加空格
    newText = newText.replace(/([A-Za-z])\s([\(\[\{])/g, "$1$2")
    newText = newText.replace(/([\)\]\}])\s([A-Za-z])/g, "$1$2")
    // ”后面不加空格
    newText = newText.replace(/”\s/g, "”")
    // · 左右的空格去掉
    newText = newText.replace(/\s*·\s*/g, "·")
    // - 左右的空格去掉
    newText = newText.replace(/\s*-\s*/g, "-")
    // ∞ 后面的只保留一个空格，而不是直接去掉
    newText = newText.replace(/∞\s+/g, "∞ ")
    newText = newText.replace(/∞\s*}/g, "∞}")
    newText = newText.replace(/∞\s*\)/g, "∞)")
    newText = newText.replace(/∞\s*\]/g, "∞]")
    newText = newText.replace(/∞\s*】/g, "∞】")
    newText = newText.replace(/∞\s*）/g, "∞）")
    newText = newText.replace(/∞\s*”/g, "∞”")
    newText = newText.replace(/∞\s*_/g, "∞_")
    // 大求和符号改成小求和符号
    newText = newText.replace(/∑/g, "Σ")
    // 处理一下 弱* w* 这种空格
    newText = newText.replace(/([弱A-Za-z])\s*\*/g, "$1*")
    newText = newText.replace(/\*\s*\*/g, "**")
    // 把 等价刻画/充要条件 中间的 / 两边的空格去掉
    newText = newText.replace(/\s*\/\s*/g, '/')
    // 处理括号后面的空格
    newText = newText.replace(/\]\s*([A-Za-z])/g, "] $1")
    // 去掉 ∈ 前面的空格
    newText = newText.replace(/\s*∈/g, "∈")
    return newText
  }
}
/**
 * 判断是否是正整数
 */
String.prototype.isPositiveInteger = function() {
  const regex = /^[1-9]\d*$/;
  return regex.test(this);
}
/**
 * 判断是否是知识点卡片的标题
 */
String.prototype.ifKnowledgeNoteTitle = function () {
  return /^【.{2,4}：.*】/.test(this)
}
String.prototype.isKnowledgeNoteTitle = function () {
  return this.ifKnowledgeNoteTitle()
}
/**
 * 获取知识点卡片的前缀
 */
String.prototype.toKnowledgeNotePrefix = function () {
  let match = this.match(/^【.{2,4}：(.*)】/)
  return match ? match[1] : this  // 如果匹配不到，返回原字符串
}
/**
 * 获取知识点卡片的标题
 */
String.prototype.toKnowledgeNoteTitle = function () {
  let match = this.match(/^【.{2,4}：.*】(.*)/)
  return match ? match[1] : this  // 如果匹配不到，返回原字符串
}
/**
 * 获取参考文献的标题
 */
String.prototype.toReferenceNoteTitle = function () {
  let match = this.match(/^【.*】(.*)/)
  return match ? match[1] : this  // 如果匹配不到，返回原字符串
}
/**
 * 判断是否是文献卡片的标题
 */
String.prototype.ifReferenceNoteTitle = function () {
  return /^【文献：(论文|书作|作者)：?.*】/.test(this)
}
/**
 * 获取文献卡片标题的前缀内容
 */
String.prototype.toReferenceNoteTitlePrefixContent = function () {
  let match = this.match(/^【(文献：(论文|书作)：?.*)】/)
  return match ? match[1] : this  // 如果匹配不到，返回原字符串
}
/**
 * 判断是否有前缀部分
 */
String.prototype.ifWithBracketPrefix = function () {
  let match = (/^【.*】(.*)/).test(this)
  return match
}
/**
 * 获取无前缀的部分
 * 并且把开头的分号去掉
 */
// String.prototype.toNoBracketPrefixContent = function () {
//   let match = this.match(/^【.*】(.*)/)
//   return match ? match[1] : this  // 如果匹配不到，返回原字符串
// }
String.prototype.toNoBracketPrefixContent = function () {
  return this.replace(
    /^【.*?】(\s*;\s*)?(.*)/, 
    (_, __, content) => content || ''
  ).replace(/^\s*/, '') || this;
};
String.prototype.toNoBracketPrefixContentFirstTitleLinkWord = function () {
  let regex = /【.*】(.*?);?\s*([^;]*?)(?:;|$)/;
  let matches = this.match(regex);

  if (matches) {
    const firstPart = matches[1].trim(); // 提取分号前的内容
    const secondPart = matches[2].trim(); // 提取第一个分号后的内容

    // 根据第一部分是否为空选择返回内容
    return firstPart === '' ? secondPart : firstPart;
  } else {
    // 如果没有前缀，就获取第一个 ; 前的内容
    let title = this.toNoBracketPrefixContent()
    regex = /^(.*?);/;
    matches = title.match(regex);
  
    if (matches) {
      return matches[1].trim().toString()
    } else {
      return title.toString()
    }
  }
}
/**
 * 获取前缀的内容
 */
String.prototype.toBracketPrefixContent = function () {
  let match = this.match(/^【(.*)】.*/)
  return match ? match[1] : this  // 如果匹配不到，返回原字符串
}
/**
 * 【xxx】yyy 变成 【xxx→yyy】
 */
String.prototype.toBracketPrefixContentArrowSuffix = function () {
  if (this.ifWithBracketPrefix()) {
    // 有前缀就开始处理
    return "【" + this.toBracketPrefixContent() + " → " + this.toNoBracketPrefixContentFirstTitleLinkWord() + "】"
  } else {
    // 如果没有前缀，就直接输出 【this】
    return "【" + this.toNoBracketPrefixContentFirstTitleLinkWord() + "】"
  }
}
/**
 * 判断是否是绿色归类卡片的标题
 * @returns {boolean}
 */
String.prototype.ifGreenClassificationNoteTitle = function () {
  return /^“[^”]+”\s*相关[^“]*$/.test(this)
}
String.prototype.isGreenClassificationNoteTitle = function () {
  return this.ifGreenClassificationNoteTitle()
}
/**
 * 获取绿色归类卡片的标题
 */
String.prototype.toGreenClassificationNoteTitle = function () {
  let match = this.match(/^“([^”]+)”\s*相关[^“]*$/)
  return match ? match[1] : this  // 如果匹配不到，返回原字符串
}
String.prototype.toGreenClassificationNoteTitleType = function () {
  let match = this.match(/^“[^”]+”\s*(相关[^“]*)$/)
  return match ? match[1] : this  // 如果匹配不到，返回原字符串
}
/**
 * 判断是否是黄色归类卡片的标题
 * @returns {boolean}
 */
String.prototype.ifYellowClassificationNoteTitle = function () {
  return /^“[^”]*”：“[^”]*”\s*相关[^“]*$/.test(this)
}
String.prototype.isYellowClassificationNoteTitle = function () {
  return this.ifYellowClassificationNoteTitle()
}
String.prototype.isClassificationNoteTitle = function () {
  return this.ifYellowClassificationNoteTitle() || this.ifGreenClassificationNoteTitle()
}
/**
 * 获取黄色归类卡片的标题
 */
String.prototype.toYellowClassificationNoteTitle = function () {
  let match = this.match(/^“[^”]*”：“([^”]*)”\s*相关[^“]*$/)
  return match ? match[1] : this  // 如果匹配不到，返回原字符串
}
String.prototype.toYellowClassificationNoteTitleType = function () {
  let match = this.match(/^“[^”]*”：“[^”]*”\s*(相关[^“]*)$/)
  return match ? match[1] : this  // 如果匹配不到，返回原字符串
}
/**
 * 获取绿色或者黄色归类卡片的标题
 */
String.prototype.toClassificationNoteTitle = function () {
  if (this.ifGreenClassificationNoteTitle()) {
    return this.toGreenClassificationNoteTitle()
  }
  if (this.ifYellowClassificationNoteTitle()) {
    return this.toYellowClassificationNoteTitle()
  }
  return ""
}
/**
 * 获取绿色或黄色归类卡片引号后的内容
 */
String.prototype.toClassificationNoteTitleType = function () {
  if (this.ifGreenClassificationNoteTitle()) {
    return this.toGreenClassificationNoteTitleType()
  }
  if (this.ifYellowClassificationNoteTitle()) {
    return this.toYellowClassificationNoteTitleType()
  }
  return ""
}
/**
 * 判断输入的字符串是否是卡片 URL 或者卡片 ID
 */
String.prototype.ifNoteIdorURL = function () {
  return (
    this.ifValidNoteURL() ||
    this.ifValidNoteId()
  )
}
String.prototype.isNoteIdorURL = function () {
  return this.ifNoteIdorURL()
}
String.prototype.ifNoteURLorId = function () {
  return this.ifNoteIdorURL()
}
String.prototype.isNoteURLorId = function () {
  return this.ifNoteIdorURL()
}
String.prototype.ifNoteURLorID = function () {
  return this.ifNoteIdorURL()
}
String.prototype.isNoteURLorID = function () {
  return this.ifNoteIdorURL()
}
String.prototype.ifNoteIDorURL = function () {
  return this.ifNoteIdorURL()
}
String.prototype.isNoteIDorURL = function () {
  return this.ifNoteIdorURL()
}

/**
 * 判断是否是有效的卡片 ID
 */
String.prototype.ifValidNoteId = function() {
  const regex = /^[0-9A-Z]{8}-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{12}$/;
  return regex.test(this);
}
String.prototype.isValidNoteId = function() {
  return this.ifValidNoteId()
}
String.prototype.ifNoteId = function() {
  return this.ifValidNoteId()
}
String.prototype.isNoteId = function() {
  return this.ifValidNoteId()
}

/**
 * 判断是否是有效的卡片 URL
 */
String.prototype.ifValidNoteURL = function() {
  return /^marginnote\dapp:\/\/note\//.test(this)
}
String.prototype.isValidNoteURL = function() {
  return this.ifValidNoteURL()
}
String.prototype.isLink = function() {
  return this.ifValidNoteURL()
}
String.prototype.ifLink = function() {
  return this.ifValidNoteURL()
}
/**
 * 把 ID 或 URL 统一转化为 URL
 */
String.prototype.toNoteURL = function() {
  if (this.ifNoteIdorURL()) {
    let noteId = this.trim()
    let noteURL
    if (/^marginnote\dapp:\/\/note\//.test(noteId)) {
      noteURL = noteId
    } else {
      noteURL = "marginnote4app://note/" + noteId
    }
    return noteURL
  }
}


String.prototype.ifNoteBookId = function() {
  return /^marginnote\dapp:\/\/notebook\//.test(this)
}
/**
 * 把 ID 或 URL 统一转化为 NoteBookId
 */
String.prototype.toNoteBookId = function() {
  if (this.ifNoteBookId() || this.ifNoteId()) {
    let noteId = this.trim()
    let noteURL
    if (/^marginnote\dapp:\/\/notebook\//.test(noteId)) {
      noteURL = noteId
    } else {
      noteURL = "marginnote4app://notebook/" + noteId
    }
    return noteURL
  }
}

/**
 * 字符串改成“- xxx”的形式
 * 
 * xxx => - xxx
 * -xxx => - xxx
 * - xxx => - xxx
 */
String.prototype.toDotPrefix = function() {
  let str = this.trim().removeDotPrefix()
  return "- " + str
}
/**
 * 去掉字符串的 - 前缀
 * 
 * 如果没有这个前缀，就原样返回
 */
String.prototype.removeDotPrefix = function() {
  let str = this.trim()
  if (str.startsWith("-")) {
    return str.slice(1).trim()
  } else {
    return str
  }
}

/**
 * 把 ID 或 URL 统一转化为 ID
 */
String.prototype.toNoteId = function() {
  if (this.ifNoteIdorURL()) {
    let noteURL = this.trim()
    let noteId
    if (/^marginnote\dapp:\/\/note\//.test(noteURL)) {
      noteId = noteURL.slice(22)
    } else {
      noteId = noteURL
    }
    return noteId
  }
}
String.prototype.toNoteID = function() {
  return this.toNoteId()
}
/**
 * 将字符串用四种分割符之一进行分割
 * @returns {string[]}
 */
String.prototype.splitStringByFourSeparators = function() {
  // 正则表达式匹配中文逗号、中文分号和西文分号
  const separatorRegex = /,\s*|，\s*|；\s*|;\s*/g;
  
  // 使用split方法按分隔符分割字符串
  const arr = this.split(separatorRegex);
  
  // 去除可能的空字符串元素（如果输入字符串的前后或连续分隔符间有空白）
  return arr.filter(Boolean);
}

/**
 * 解析评论索引字符串，支持：
 * - 范围输入（如 "1-4" 表示第1到第4条）
 * - 特殊字符 X、Y、Z（不区分大小写，分别表示倒数第3、2、1条）
 * - 1-based 索引（用户输入 1 表示第一条，内部转换为 0）
 * @param {number} totalComments - 评论总数
 * @returns {number[]} 0-based 索引数组
 */
String.prototype.parseCommentIndices = function(totalComments) {
  // 先使用四种分隔符分割
  const parts = this.splitStringByFourSeparators();
  const indices = [];
  
  for (let part of parts) {
    part = part.trim();
    if (!part) continue;
    
    // 检查是否为范围表达式（如 "1-4" 或 "2-Y"）
    const rangeMatch = part.match(/^([1-9]\d*|[xyzXYZ])\s*[-－]\s*([1-9]\d*|[xyzXYZ])$/);
    if (rangeMatch) {
      const startStr = rangeMatch[1];
      const endStr = rangeMatch[2];
      
      // 解析起始索引
      let startIndex;
      if (/^[xyzXYZ]$/i.test(startStr)) {
        // 特殊字符
        const char = startStr.toUpperCase();
        if (char === 'X') startIndex = totalComments - 3;
        else if (char === 'Y') startIndex = totalComments - 2;
        else if (char === 'Z') startIndex = totalComments - 1;
      } else {
        // 数字，转换为 0-based
        startIndex = parseInt(startStr) - 1;
      }
      
      // 解析结束索引
      let endIndex;
      if (/^[xyzXYZ]$/i.test(endStr)) {
        // 特殊字符
        const char = endStr.toUpperCase();
        if (char === 'X') endIndex = totalComments - 3;
        else if (char === 'Y') endIndex = totalComments - 2;
        else if (char === 'Z') endIndex = totalComments - 1;
      } else {
        // 数字，转换为 0-based
        endIndex = parseInt(endStr) - 1;
      }
      
      // 确保索引有效
      startIndex = Math.max(0, Math.min(startIndex, totalComments - 1));
      endIndex = Math.max(0, Math.min(endIndex, totalComments - 1));
      
      // 添加范围内的所有索引
      if (startIndex <= endIndex) {
        for (let i = startIndex; i <= endIndex; i++) {
          indices.push(i);
        }
      }
    } else {
      // 单个索引
      if (/^[xyzXYZ]$/i.test(part)) {
        // 特殊字符
        const char = part.toUpperCase();
        let index;
        if (char === 'X') index = totalComments - 3;
        else if (char === 'Y') index = totalComments - 2;
        else if (char === 'Z') index = totalComments - 1;
        
        if (index >= 0 && index < totalComments) {
          indices.push(index);
        }
      } else if (/^[1-9]\d*$/.test(part)) {
        // 数字，转换为 0-based
        const index = parseInt(part) - 1;
        if (index >= 0 && index < totalComments) {
          indices.push(index);
        }
      }
    }
  }
  
  // 去重并排序
  return [...new Set(indices)].sort((a, b) => a - b);
}

String.prototype.toTitleCasePro = function () {
  'use strict'
  let smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|v.?|vs.?|via)$/i;
  let alphanumericPattern = /([A-Za-z0-9\u00C0-\u00FF])/;
  /* note there is a capturing group, so the separators will also be included in the returned list */
  let wordSeparators = /([ :–—-])/;
  let lowerBar = /_/g;
  /* regular expression: remove the space character, punctuation (.,;:!?), 
     dash and lower bar at both ends of the string */
  let trimBeginEndPattern = /^[\s.,;:!?_\-]*([a-zA-Z0-9].*[a-zA-Z0-9])[\s.,;:!?_\-]*$/g;
  let romanNumberPattern = /^(I|II|III|IV|V|VI|VII|VIII|IX|X)$/i;

  let title = this.toLowerCase().replace(trimBeginEndPattern,"$1")
    .replace(lowerBar, " ")
    .split(wordSeparators)
    .map(function (current, index, array) {
      if (
        /* Check for small words */
        current.search(smallWords) > -1 &&
        /* Skip first and last word */
        index !== 0 &&
        index !== array.length - 1 &&
        /* cope with the situation such as: 1. the conjugation operator */
        array.slice(0,index-1).join('').search(/[a-zA-Z]/) > -1 &&
        /* Ignore title end and subtitle start */
        array[index - 3] !== ':' &&
        array[index + 1] !== ':' &&
        /* Ignore small words that start a hyphenated phrase */
        (array[index + 1] !== '-' ||
          (array[index - 1] === '-' && array[index + 1] === '-'))
      ) {
        return current.toLowerCase()
      }
      
      /* Uppercase roman numbers */
      if (current.search(romanNumberPattern) > -1) {
        return current.toUpperCase();
      }

      /* Ignore intentional capitalization */
      if (current.substring(1).search(/[A-Z]|\../) > -1) {
        return current;
      }

      /* Ignore URLs */
      if (array[index + 1] === ':' && array[index + 2] !== '') {
        return current;
      }

      /* Capitalize the first letter */
      return current.replace(alphanumericPattern, function (match) {
        return match.toUpperCase();
      })
    })
    .join('') // convert the list into a string

  if (title.startsWith('&')) {
    title = title.replace('&', '§');
  }
  title = title.replace(/\s+/g, ' ');
  
  let chapterRegex = /^(?:\d+\s*\.\s*)+\d+\s*\.?\s*/;
  if (chapterRegex.test(title)) {
    // 提取章节编号部分
    let chapterMatch = title.match(chapterRegex)[0];
    // 去掉章节编号中的多余空格
    let normalizedChapter = chapterMatch.replace(/\s+/g, '');
    normalizedChapter += " "
    // 替换原字符串中的章节编号部分
    title = title.replace(chapterMatch, normalizedChapter);
  }
  return title;
}

/**
 * 夏大鱼羊 - 字符串函数 - end
 */

class Menu{
  /**
   * 左 0, 下 1，3, 上 2, 右 4
   * @type {number}
   */
  preferredPosition = 2
  /**
   * @type {string[]}
   */
  titles = []
  constructor(sender,delegate,width = 200,preferredPosition = 2){
    this.menuController = MenuController.new()
    this.delegate = delegate
    this.sender = sender
    this.commandTable = []
    this.width = width
    this.menuController.rowHeight = 35
    this.preferredPosition = preferredPosition
  }
  /**
   * @param {object[]} items
   */
  set menuItems(items){
    this.commandTable = items
  }
  get menuItems(){
    return this.commandTable
  }
  /**
   * @param {number} height
   */
  set rowHeight(height){
    this.menuController.rowHeight = height
  }
  get rowHeight(){
    return this.menuController.rowHeight
  }
  /**
   * @param {number} size
   */
  set fontSize(size){
    this.menuController.fontSize = size
  }
  get fontSize(){
    return this.menuController.fontSize
  }
  addMenuItem(title,selector,params = "",checked=false){
    this.commandTable.push({title:title,object:this.delegate,selector:selector,param:params,checked:checked})
  }
  addMenuItems(items){
    let fullItems = items.map(item=>{
      if ("object" in item) {
        return item
      }else{
        item.object = this.delegate
        return item
      }
    })
    this.commandTable.push(...fullItems)
  }
  insertMenuItem(index,title,selector,params = "",checked=false){
    this.commandTable.splice(index,0,{title:title,object:this.delegate,selector:selector,param:params,checked:checked})
  }
  insertMenuItems(index,items){
    let fullItems = items.map(item=>{
      if ("object" in item) {
        return item
      }else{
        item.object = this.delegate
        return item
      }
    })
    this.commandTable.splice(index,0,...fullItems)
  }
  show(){
  try {

    let position = this.preferredPosition
    this.menuController.commandTable = this.commandTable
    this.menuController.preferredContentSize = {
      width: this.width,
      height: this.menuController.rowHeight * this.menuController.commandTable.length
    };
    // this.menuController.secHeight = 200
    // this.menuController.sections = [{title:"123",length:10,size:10,row:this.commandTable,rows:this.commandTable,cell:this.commandTable}]
    // this.menuController.delegate = this.delegate

    var popoverController = new UIPopoverController(this.menuController);
    let targetView = MNUtil.studyView
    var r = this.sender.convertRectToView(this.sender.bounds,targetView);
    switch (position) {
      case 0:
        if (r.x < 50) {
          position = 4
        }
        break;
      case 1:
      case 3:
        if (r.y+r.height > targetView.frame.height - 50) {
          position = 2
        }
        break;
      case 2:
        if (r.y < 50) {
          position = 3
        }
        break;
      case 4:
        if (r.x+r.width > targetView.frame.width - 50) {
          position = 0
        }
        break;
      default:
        break;
    }
    popoverController.presentPopoverFromRect(r, targetView, position, true);
    popoverController.delegate = this.delegate
    // this.menuController.menuTableView.dataSource = this.delegate
    Menu.popover = popoverController
  } catch (error) {
    MNUtil.showHUD(error)
  }
  }
  dismiss(){
    if (Menu.popover) {
      Menu.popover.dismissPopoverAnimated(true)
      Menu.popover = undefined
    }
  }
  static item(title,selector,params = "",checked=false){
    return {title:title,selector:selector,param:params,checked:checked}
  }
  static popover = undefined
  static dismissCurrentMenu(){
    if (this.popover) {
      this.popover.dismissPopoverAnimated(true)
    }
  }
}
class MNUtil {
  static themeColor = {
    Gray: UIColor.colorWithHexString("#414141"),
    Default: UIColor.colorWithHexString("#FFFFFF"),
    Dark: UIColor.colorWithHexString("#000000"),
    Green: UIColor.colorWithHexString("#E9FBC7"),
    Sepia: UIColor.colorWithHexString("#F5EFDC")
  }
  static popUpNoteInfo = undefined;
  static popUpSelectionInfo = undefined;
  static mainPath
  static init(mainPath){
    this.mainPath = mainPath
    // MNUtil.copy("text")
    // if (!this.mainPath) {
    //   this.mainPath = mainPath
    //   this.MNUtilVersion = this.getMNUtilVersion()
    //   const renderer = new marked.Renderer();
    //   renderer.code = (code, language) => {
    //     const validLang = hljs.getLanguage(language) ? language : 'plaintext';
    //     const uuid = NSUUID.UUID().UUIDString()
    //     if (validLang === 'plaintext') {
    //       return `<pre><div class="code-header" contenteditable="false"><span>${validLang}</span><button onclick="copyToClipboard('${uuid}')">复制</button></div><code class="hljs ${validLang}"  id="${uuid}">${code}</code></pre>`;
    //     }
    //     const highlightedCode = hljs.highlight(code, { language: validLang }).value;
    //     return `<pre><div class="code-header" contenteditable="false"><span>${validLang}</span><button onclick="copyToClipboard('${uuid}')">复制</button></div><code class="hljs ${validLang}" id="${uuid}">${highlightedCode}</code></pre>`;
    //   };
    //   // renderer.em = function(text) {
    //   //   return text;
    //   // };
    //   // marked.use({ renderer });
    //   marked.setOptions({ renderer });
    // }
  }
  static errorLog = []
  static logs = []
  static addErrorLog(error,source,info){
    MNUtil.showHUD("MN Utils Error ("+source+"): "+error)
    let tem = {source:source,time:(new Date(Date.now())).toString()}
    if (error.detail) {
      tem.error = {message:error.message,detail:error.detail}
    }else{
      tem.error = error.message
    }
    if (info) {
      tem.info = info
    }
    this.errorLog.push(tem)
    this.copyJSON(this.errorLog)
    this.log({
      message:source,
      level:"ERROR",
      source:"MN Utils",
      timestamp:Date.now(),
      detail:tem
    })
  }
  static log(log){
    if (typeof log == "string") {
      log = {
        message:log,
        level:"INFO",
        source:"Default",
        timestamp:Date.now()
      }
      this.logs.push(log)
      // MNUtil.copy(this.logs)
      if (subscriptionUtils.subscriptionController) {
        subscriptionUtils.subscriptionController.appendLog(log)
      }
      return
    }
    if ("level" in log) {
      log.level = log.level.toUpperCase();
    }else{
      log.level = "INFO";
    }
    if (!("source" in log)) {
      log.source = "Default";
    }
    if (!("timestamp" in log)) {
      log.timestamp = Date.now();
    }
    if ("detail" in log && typeof log.detail == "object") {
      log.detail = JSON.stringify(log.detail,null,2)
    }
    this.logs.push(log)
    subscriptionUtils.subscriptionController.appendLog(log)
  }
  static clearLogs(){
    this.logs = []
    subscriptionUtils.subscriptionController.clearLogs()
  }
  /**
   * Retrieves the version of the application.
   * 
   * This method checks if the application version has already been set. If not,
   * it sets the version using the `appVersion` method. The version is then
   * returned.
   * 
   * @returns {{version: string,type: string;}} The version of the application.
   */
  static get version(){
    if (!this.mnVersion) {
      this.mnVersion = this.appVersion()
    }
    return this.mnVersion
  }
  static _isTagComment_(comment){
    if (comment.type === "TextNote") {
      if (/^#\S/.test(comment.text)) {
        return true
      }else{
        return false
      }
    }
    return false
  }
  static get app(){
    // this.appInstance = Application.sharedInstance()
    // return this.appInstance
    if (!this.appInstance) {
      this.appInstance = Application.sharedInstance()
    }
    return this.appInstance
  }
  static get db(){
    if (!this.data) {
      this.data = Database.sharedInstance()
    }
    return this.data
  }
  static get currentWindow(){
    //关闭mn4后再打开，得到的focusWindow会变，所以不能只在init做一遍初始化
    return this.app.focusWindow
  }
  static get studyController(){
    return this.app.studyController(this.currentWindow)
  }
  static get studyView() {
    return this.app.studyController(this.currentWindow).view
  }
  static get studyWidth(){
    return this.studyView.frame.width
  }
  static get studyHeight(){
    return this.studyView.frame.height
  }
  /**
   * @returns {{view:UIView}}
   **/
  static get extensionPanelController(){
    return this.studyController.extensionPanelController
  }
  /**
   * @returns {UIView}
   */
  static get extensionPanelView(){
    return this.studyController.extensionPanelController.view
  }
  static get extensionPanelOn(){
    if (this.extensionPanelController && this.extensionPanelController.view.window) {
      return true
    }
    return false
  }
  static get mainPath(){
    return this.mainPath
  }
  /**doc:0,1;study:2;review:3 */
  static get studyMode(){
    return this.studyController.studyMode
  }
  static get readerController() {
    return this.studyController.readerController
  }
  static get notebookController(){
    return this.studyController.notebookController
  }
  static get docControllers() {
    return this.studyController.readerController.documentControllers
  }
  static get currentDocController() {
    return this.studyController.readerController.currentDocumentController
  }
  static get mindmapView(){
    return this.studyController.notebookController.mindmapView
  }
  static get selectionText(){
    let selectionText = this.currentDocController.selectionText
    if (selectionText) {
      return selectionText
    }
    if (this.studyController.docMapSplitMode) {//不为0则表示documentControllers存在
      let docControllers = this.docControllers
      let docNumber = docControllers.length
      for (let i = 0; i < docNumber; i++) {
        const docController = docControllers[i];
        selectionText = docController.selectionText
        if (selectionText) {
          return selectionText
        }
      }
    }
    if (this.popUpSelectionInfo) {
      let docController = this.popUpSelectionInfo.docController
      if (docController.selectionText) {
        return docController.selectionText
      }
    }
    return undefined
  }
  static get isSelectionText(){
    let image = this.currentDocController.imageFromSelection()
    if (image) {
      return this.currentDocController.isSelectionText
    }
    if (this.studyController.docMapSplitMode) {//不为0则表示documentControllers存在
      let docControllers = this.docControllers
      let docNumber = docControllers.length
      for (let i = 0; i < docNumber; i++) {
        const docController = docControllers[i];
        image = docController.imageFromSelection()
        if (image) {
          return docController.isSelectionText
        }
      }
    }
    if (this.popUpSelectionInfo) {
      let docController = this.popUpSelectionInfo.docController
      image = docController.imageFromSelection()
      if (image) {
        return docController.isSelectionText
      }
    }
    return false
  }
  /**
   * 当前激活的文本视图
   * @type {UITextView|undefined}
   */
  static activeTextView = undefined
  /**
   * 返回选中的内容，如果没有选中，则onSelection属性为false
   * 如果有选中内容，则同时包括text和image，并通过isText属性表明当时是选中的文字还是图片
   * Retrieves the current selection details.
   * 
   * This method checks for the current document controller's selection. If an image is found,
   * it generates the selection details using the `genSelection` method. If no image is found
   * in the current document controller, it iterates through all document controllers if the
   * study controller's document map split mode is enabled. If a selection is found in the
   * pop-up selection info, it also generates the selection details. If no selection is found,
   * it returns an object indicating no selection.
   * 
   * @returns {{onSelection: boolean, image: null|undefined|NSData, text: null|undefined|string, isText: null|undefined|boolean,docMd5:string|undefined,pageIndex:number|undefined}} The current selection details.
   */
  static get currentSelection(){
    if (this.activeTextView && this.activeTextView.selectedRange.length>0) {
      let range = this.activeTextView.selectedRange
      return {onSelection:true,image:undefined,text:this.activeTextView.text.slice(range.location,range.location+range.length),isText:true,docMd5:undefined,pageIndex:undefined,source:"textview"}
    }
    if (this.studyController.readerController.view.hidden) {
      return {onSelection:false}
    }
    let image = this.currentDocController.imageFromSelection()
    if (image) {
      return this.genSelection(this.currentDocController)
    }
    if (this.studyController.docMapSplitMode) {//不为0则表示documentControllers存在
      let docControllers = this.docControllers
      let docNumber = docControllers.length
      for (let i = 0; i < docNumber; i++) {
        const docController = docControllers[i];
        if (docController.imageFromSelection()) {
          return this.genSelection(docController)
        }
      }
    }
    if (this.popUpSelectionInfo && this.popUpSelectionInfo.docController) {
      let docController = this.popUpSelectionInfo.docController
      if (docController.imageFromSelection()) {
        return this.genSelection(docController)
      }
    }
    return {onSelection:false}
  }
  static get currentNotebookId() {
    return this.studyController.notebookController.notebookId
  }
  static get currentNotebook() {
    return this.getNoteBookById(this.currentNotebookId)
  }
  static get currentDoc() {
    return this.currentDocController.document
  }
  static get currentDocmd5(){
    try {
      const { docMd5 } = this.currentDocController
      if (docMd5 && docMd5.length === 32) return "00000000"
      else return docMd5
    } catch {
      return undefined
    }
  }
  static get isZH(){
    return NSLocale.preferredLanguages()[0].startsWith("zh")
  }

  static get currentThemeColor(){
    return this.themeColor[this.app.currentTheme]
  }
  static get clipboardText() {
    return UIPasteboard.generalPasteboard().string
  }
  static get clipboardImage() {
    return UIPasteboard.generalPasteboard().image
  }
  static get clipboardImageData() {
    let image = this.clipboardImage
    if (image) {
      return image.pngData()
    }
    return undefined
  }
  static get dbFolder(){
    //结尾不带斜杠
    return this.app.dbPath
  }
  static get cacheFolder(){
    //结尾不带斜杠
    return this.app.cachePath
  }
  static get documentFolder() {
    //结尾不带斜杠
    return this.app.documentPath
  }
  static get tempFolder() {
    //结尾不带斜杠
    return this.app.tempPath
  }
  static get splitLine() {
    let study = this.studyController
    let studyFrame = study.view.bounds
    let readerFrame = study.readerController.view.frame
    let hidden = study.readerController.view.hidden//true代表脑图全屏
    let rightMode = study.rightMapMode
    let fullWindow = readerFrame.width == studyFrame.width
    if (hidden || fullWindow) {
      return undefined
    }
    if (rightMode) {
      let splitLine = readerFrame.x+readerFrame.width
      return splitLine
    }else{
      let splitLine = readerFrame.x
      return splitLine
    }
  }
    /**
   * 夏大鱼羊 - MNUtil - begin
   */
  /**
   * 根据 md5 获取学习规划学习集对应的卡片 ID
   */
  static getNoteIdByMd5InPlanNotebook(md5){
    let md5IdPair = {
      // 刘培德《泛函分析基础》
      "fccc394d73fd738b364d33e1373a4a7493fafea8c024f3712f63db882e79a1cd":"35B90CB6-5BCC-4AA4-AE24-C6B4CBCB9666",
      // Jan van Neerven《Functional analysis》
      "3e68d9f7755163f5aacd5d337bdd7a0b6bd70d0727f721778d24d114010e6d7a":"96F569A4-2B2E-4B8D-B789-56ACE09AA2F1",
      // Conway《A course in Functional Analysis》
      "88603c9aa7b3c7605d84c08e0e17527f8ae7de0a323c666a0331cc8e7b616eab":"0B8E664B-BB42-431A-8516-C4CA4CF36F94",
      // 王凯 《泛函分析》
      "cb15d5b4e55227a3373bde1dd6f1295b21b561dbec231c91edad50186991fd7d":"C0ED1035-ED3E-4051-A1F6-EDE95CE35370",
      // Rudin 泛函分析
      "34c59a3b8af79bb95139756fb2d7c9c115fe8a7c79d4939100558b8bc7420e53":"8F938A8F-58DA-452D-9DE9-905DC77ABF04",
      // Folland 实分析
      "5bb47aff3b50e7ec12b0ffc3de8e13a7acb4aa11caffa52c29f9f8a5c9b970d5":"02E775DE-1CA6-4D72-A42C-45ED03FD1251",
      // Rudin - 实分析与复分析
      "f45e28950cadc7d1b9d29cd2763b9b6a969c8f38b45efb8cc2ee302115c5e8b4":"9CB204AD-C640-4F97-B62F-E47E2D659C25",
      // 赵焕光 - 现代分析入门
      "34f67c3a452118b6f274b8c063b85b0544a5d272081c7fdc1be27b9575b8a6f1":"C877F723-7FA3-4D95-9C87-9C036687782A",
      // 陆善镇 王昆扬 - 实分析
      "0bb3627b57dc95b4f4d682c71df34b3df01676b9a6819a1c5928c5ce7cb6cb25":"B73922E2-7036-40FE-BC5D-8F4713616C62",
      // 楼红卫《数学分析》
      "320ec3909f6cbd91445a7e76c98a105f50998370f5856be716f704328c11263f":"AA1B5A69-B17E-4B5C-9702-06F3C647C40E",
      // 李工宝《A first course in real analysis》
      "d2ec247e78e7517a2fb158e074a90e0bc53c84a57f2777eaa490af57fafd9438":"2D247A3C-559A-473A-83FE-C2A9BD09A74F",
      // MIRA
      "7c8f458cf3064fa1daa215ded76980c9aea8624097dbdcf90cca5bb893627621":"198E8FF1-4AAE-42CE-9C0A-1B6A6395804A",
      // 朱克和 《Operator Theory in Function Spaces》
      "6a248b6b116e03153af7204b612f93c12a4700ff3de3b3903bb0bcd84e2f6b09":"B32D4EFD-AAF9-44C7-8FDB-E92560F1171F",
      // 郭坤宇《算子理论基础》
      "659a6778d0732985b91d72961591a62c21d2d1bfcbd8e78464cc9a9aa6434cf1":"C04668B1-D77A-4495-8972-F028D9F90BFC",
      // 蹇人宜 安恒斌 《解析函数空间上的算子理论导引》
      "495ff8e34c20c10fe1244a7b36272e1b8ef8b6c0b92e01793ef2e377bfb90d72":"D35871E8-9F3B-4B95-AD73-48A6DDF27DC4",
      // The Theory of H(b) Spaces
      "d86e2e385d353492d9796caacac6353d75351c76968e613539efcaab3f58c8c1":"60F4D62D-D958-4CC7-BD59-511EE1E4312B",
      // Hoffman - Banach Spaces of Analytic Functions
      "f2ecc0f4f97eb3907e00746b964ae62a9f378e2cb05f1811aa7b37bce656c025":"CF750547-4BE6-4ABF-BB16-EE6D9321F73F",
      // Garnett - 有界解析函数
      "3ec7c103d58eb81e3c4d46022b5736c34d137c905b31053f69fe14ecf8da3606":"15E27BF9-EE52-4C2D-A5FE-0F16C9BC9148",
      // GTM249
      "cda554d017af672e87d4261c0463e41893bcb0cf50cb3f2042afaef749297482":"04E7DD41-1DE4-485E-9791-15F7DC067A46",
      // Stein - Harmonic Analysis: Real-Variable Methods, Orthogonality, and Oscillatory Integrals
      "4dc6b7188781ebad8c25ad5e9d7635c040ae4a08ddcd196fe2e6e716704851c2":"2E550C5B-88DD-408E-B246-39B293A5910F",
      // 郝成春 - 调和分析讲义
      "3805c33987e654ff07ca9ce68cdddeaff965ad544625faaf14c3799e13996ade":"1F47692A-81D2-4890-9E56-0C084D2B622D",
      // 谢启鸿《高等代数》
      "32dc18e2e7696064b8da9b14af56dfb54e41b8f08044f2ef00aa21f94885fc08":"8CAA1FAE-2A69-4CBE-A1F0-A02FB1C95C3C",
      // Krantz - 复变
      "74f3f034fe67fd4573b33f7c978bb06c2642b892c4b237f2efe9256359935e6e":"1B38D33E-77B7-4391-88F2-2FE3126D6FC4",
      "06c41fa919b0ec928c31f53e2301f4c9cc9ce1d820dcd5a1750db7144fb8caae":"1B38D33E-77B7-4391-88F2-2FE3126D6FC4",
      // A first course in complex analysis with applications
      "4f1fd75b664e8f7c8ee171ba2db11532fd34a3b010edad93fb5b0518243c164a":"7066180E-2430-4A3E-9241-135538474D86",
      // 邱维元 - 复分析讲义
      "886469e3d70342159bb554cdaee604fa5a6018e84b6ff04bbb35f69ea764a757":"1BD3CD6C-BDEE-4078-9DF3-BB5C45351356",
      // 方企勤 - 复变函数
      "e107e1772dbb53288a9d1c38781d3c77043ee40b68818a16f64c0e8480ed7c7e":"2FDA8616-2BE5-4253-BEE5-FA795AD37999"
    }

    return md5IdPair[md5]
  }
  /**
   * 根据名称获取 notebookid
   */
  static getNoteBookIdByName(name){
    let notebookId
    switch (name) {
      case "数学":
      case "数学基础":
        notebookId = "D03C8B94-77CF-46E6-8AAB-CB129EDBCFBC"
        break;
      case "数学分析":
      case "数分":
        notebookId = "922D2CDF-07CF-4A88-99BA-7AAC60E3C517"
        break;
      case "高等代数":
      case "高代":
        notebookId = "6E84B815-7BB6-42B0-AE2B-4057279EA163"
        break;
      case "实分析":
      case "实变函数":
      case "调和分析":
      case "实变":
      case "调和":
      case "实分析与调和分析":
      case "调和分析与实分析":
        notebookId = "B051BAC2-576D-4C18-B89E-B65C0E576C7F"
        break;
      case "复分析":
      case "复变函数":
      case "复变":
        notebookId = "EAB02DA9-D467-4D7D-B6BA-9244FC326299"
        break;
      case "泛函分析":
      case "泛函":
      case "泛函分析与算子理论":
      case "算子理论":
        notebookId = "98F4FA11-39D3-41A8-845A-F74E2197E111"
        break;
      case "学习规划":
      case "学习安排":
      case "Inbox":
      case "学习汇总":
      case "学习集结":
      case "规划":
      case "安排":
      case "inbox":
      case "汇总":
      case "集结":
        notebookId = "A07420C1-661A-4C7D-BA06-C7035C18DA74"
        break;
    }

    return notebookId.toNoteBookId()
  }

  /**
   * 获取学习集里的 inbox 部分的三个顶层的卡片 id
   */
  static getWorkFlowObjByNoteBookId(notebookId){
    let workflow = {}
    switch (notebookId.toNoteBookId()) {
      case "marginnote4app://notebook/A07420C1-661A-4C7D-BA06-C7035C18DA74":  // 学习规划 
        workflow.inputNoteId = "DED2745C-6564-4EFA-86E2-42DAAED3281A"
        workflow.internalizationNoteId = "796ACA3D-9A28-4DC7-89B4-EA5CC3928AFE"
        workflow.toClassifyNoteId = "3572E6DC-887A-4376-B715-04B6D8F0C58B"
        break;
      case "marginnote4app://notebook/98F4FA11-39D3-41A8-845A-F74E2197E111": // 泛函分析
        workflow.inputNoteId = "C1E43C94-287A-4324-9480-771815F82803"
        workflow.internalizationNoteId = "FE4B1142-CE83-4BA7-B0CF-453E07663059"
        workflow.toClassifyNoteId = "E1EACEC5-3ACD-424B-BD46-797CD8A56629"
        workflow.preparationNoteId = "339DC957-70B5-4350-9093-36706CEC8CD6"
        break;
      case "marginnote4app://notebook/EAB02DA9-D467-4D7D-B6BA-9244FC326299": // 复分析
        workflow.inputNoteId = "26316838-475B-49D9-9C7C-75AB01D80EDE"
        workflow.internalizationNoteId = "6FB0CEB6-DC7B-4EE6-AD73-4AA459EBE8D8"
        workflow.toClassifyNoteId = "B27D8A02-BDC4-4D3F-908B-61AA19CBB861"
        break;
      case "marginnote4app://notebook/6E84B815-7BB6-42B0-AE2B-4057279EA163": // 高等代数
        workflow.inputNoteId = "49E66E70-7249-47C6-869E-5A40448B9B0E"
        workflow.internalizationNoteId = "FDB5289B-3186-4D93-ADFF-B72B4356CBCD"
        workflow.toClassifyNoteId = "0164496D-FA35-421A-8A22-649831C83E63"
        break;
      case "marginnote4app://notebook/B051BAC2-576D-4C18-B89E-B65C0E576C7F": // 实分析
        workflow.inputNoteId = "E7538B60-D8E2-4A41-B620-37D1AD48464C"
        workflow.internalizationNoteId = "C5D44533-6D18-45F6-A010-9F83821F627F"
        workflow.toClassifyNoteId = "13623BE8-8D26-4FEE-95D8-B704C34E92EC"
        workflow.preparationNoteId = "832AC695-6014-4936-8CDE-3B2CE3C9BA96"
        break;
      case "marginnote4app://notebook/922D2CDF-07CF-4A88-99BA-7AAC60E3C517": // 数学分析
        workflow.inputNoteId = "E22C7404-A6DE-4DB3-B749-BDF8C742F955"
        workflow.internalizationNoteId = "BBD9C2C0-CDB5-485E-A338-2C75F1ABE59F"
        workflow.toClassifyNoteId = "C7768D8F-3BD3-4D9F-BC82-C3F12701E7BF"
        break;
      case "marginnote4app://notebook/D03C8B94-77CF-46E6-8AAB-CB129EDBCFBC": // 数学基础 
        workflow.inputNoteId = "E69B712B-E42C-47F3-ADA4-1CB41A3336BD"
        workflow.internalizationNoteId = "6F5D6E1D-58C7-4E51-87CA-198607640FBE"
        workflow.toClassifyNoteId = "F6CE6E2C-4126-4945-BB98-F2437F73C806"
        break;
      case "marginnote4app://notebook/0F74EF05-FAA1-493E-9D78-CC84C4C045A6": // 文献库
        workflow.inputNoteId = ""
        workflow.internalizationNoteId = ""
        workflow.toClassifyNoteId = ""
        break;
    }
    return workflow
  }

  /**
   * 生成标题链接
   */
  static generateCustomTitleLink(keyword, titlelinkWord) {
    return `[${keyword}](marginnote4app://titlelink/custom/${titlelinkWord})`
  }
  /**
   * 【数学】根据中文类型获取对应的英文
   */
  static getEnNoteTypeByZhVersion(type){
    let typeMap = {
      "定义": "definition",
      "命题": "theorem",
      "反例": "antiexample",
      "例子": "example",
      "思想方法": "method",
      "问题": "question",
      "应用": "application",
      "归类": "classification",
      "": "temporary",
      "文献": "reference"
    }
    return typeMap[type]
  }
  /**
   * 【数学】根据中文类型获取对应的卡片颜色 index
   */
  static getNoteColorIndexByZhType(type, preprocess=false){
    let typeMap
    if (preprocess) {
      typeMap = {  // ? 自己也看不懂了
        "定义": 2,
        "命题": 6,
        "反例": 6,
        "例子": 6,
        "思想方法": 9,
        "问题": 13,
        "应用": 6
      }
    } else {
      typeMap = {
        "定义": 2,
        "命题": 10,
        "反例": 3,
        "例子": 15,
        "思想方法": 9,
        "问题": 13,
        "应用": 6
      }
    }
    return typeMap[type]
  }
  /**
   * 【数学】根据颜色 Index 来判断卡片类型
   */
  static getNoteZhTypeByNoteColorIndex(index){
    let typeMap = {
      2: "定义",
      10: "命题",
      3: "反例",
      15: "例子",
      9: "思想方法",
      13: "问题",
      6: "应用",
      0: "归类",
      1: "顶层",
      4: "归类"
    }
    return typeMap[index]
  }
  static getNoteEnTypeByNoteColorIndex(index){
    let typeMap = {
      2: "definition",
      10: "theorem",
      3: "antiexample",
      15: "example",
      9: "method",
      13: "question",
      6: "application",
      0: "classification",
      1: "classification",
      4: "classification"
    }
    return typeMap[index]
  }
  /**
   * 【数学】根据卡片类型获取对应的模板卡片的 ID
   */
  static getTemplateNoteIdByZhType(type){
    let typeMap = {
      "定义": "C1052FDA-3343-45C6-93F6-61DCECF31A6D",
      "命题": "C4B464CD-B8C6-42DE-B459-55B48EB31AD8",
      "反例": "E64BDC36-DD8D-416D-88F5-0B3FCBE5D151",
      "例子": "C4B464CD-B8C6-42DE-B459-55B48EB31AD8",
      "思想方法": "EC68EDFE-580E-4E53-BA1B-875F3BEEFE62",
      "问题": "C4B464CD-B8C6-42DE-B459-55B48EB31AD8",
      "应用": "C4B464CD-B8C6-42DE-B459-55B48EB31AD8",
      "归类": "8853B79F-8579-46C6-8ABD-E7DE6F775B8B",
      "顶层": "8853B79F-8579-46C6-8ABD-E7DE6F775B8B",
      "文献": "F09C0EEB-4FB5-476C-8329-8CC5AEFECC43",
      "文献作者":"782A91F4-421E-456B-80E6-2B34D402911A"
    }
    return typeMap[type]
  }
  /**
   * 判断是否是普通对象
   * @param {Object} obj 
   * @returns {Boolean}
   */
  static isObj(obj) {
    return typeof obj === "object" && obj !== null && !Array.isArray(obj)
  }

  static ifObj(obj) {
    return this.isObj(obj)
  }

  /**
   * 判断评论是否是链接
   */
  static isCommentLink(comment){
    if (this.isObj(comment)) {
      if (comment.type == "TextNote") {
        return comment.text.isLink()
      }
    } else if (typeof comment == "string") {
      return comment.isLink()
    }
  }
  static isLink(comment){
    return this.isCommentLink(comment)
  }
  static ifLink(comment){
    return this.isCommentLink(comment)
  }
  static ifCommentLink(comment){
    return this.isCommentLink(comment)
  }

  /**
   * 获取到链接的文本
   */
  static getLinkText(link){
    if (this.isObj(link) && this.isCommentLink(link)) {
      return link.text
    }
    return link
  }
  /**
   * 夏大鱼羊 - MNUtil - end
   */
  /**
   * Retrieves the version and type of the application.
   * 
   * This method determines the version of the application by parsing the appVersion property.
   * It categorizes the version as either "marginnote4" or "marginnote3" based on the parsed version number.
   * Additionally, it identifies the operating system type (iPadOS, iPhoneOS, or macOS) based on the osType property.
   *  
   * @returns {{version: "marginnote4" | "marginnote3", type: "iPadOS" | "iPhoneOS" | "macOS"}} An object containing the application version and operating system type.
   */
  static appVersion() {
    try {
      

    let info = {}
    let version = parseFloat(this.app.appVersion)
    if (version >= 4) {
      info.version = "marginnote4"
      info.versionNumber = version
    }else{
      info.version = "marginnote3"
      info.versionNumber = version
    }
    switch (this.app.osType) {
      case 0:
        info.type = "iPadOS"
        break;
      case 1:
        info.type = "iPhoneOS"
        break;
      case 2:
        info.type = "macOS"
        break;
      default:
        break;
    }
    return info
    } catch (error) {
      this.addErrorLog(error, "appVersion")
      return undefined
    }
  }
  static isIOS(){
    return this.appVersion().type == "iPhoneOS"
  }
  static isMacOS(){
    return this.appVersion().type == "macOS"
  }
  static isIPadOS(){
    return this.appVersion().type == "iPadOS"
  }
  static isMN4(){
    return this.appVersion().version == "marginnote4"
  }
  static isMN3(){
    return this.appVersion().version == "marginnote3"
  }
  static getMNUtilVersion(){
    let res = this.readJSON(this.mainPath+"/mnaddon.json")
    return res.version
    // this.copyJSON(res)
  }
  static countWords(str) {
    const chinese = Array.from(str)
      .filter(ch => /[\u4e00-\u9fa5]/.test(ch))
      .length
    const english = Array.from(str)
      .map(ch => /[a-zA-Z0-9\s]/.test(ch) ? ch : ' ')
      .join('').split(/\s+/).filter(s => s)
      .length

    return chinese + english
  }
  /**
   * 
   * @param {string} path 
   * @param {boolean} merge 
   * @returns {MbTopic|undefined}
   */
  static importNotebook(path,merge){
    let res = this.db.importNotebookFromStorePathMerge(path,merge)
    let notebook = res[0]
    return notebook
  }
  static subpathsOfDirectory(path){
    return NSFileManager.defaultManager().subpathsOfDirectoryAtPath(path)
  }
  static contentsOfDirectory(path){
    return NSFileManager.defaultManager().contentsOfDirectoryAtPath(path)
  }
  static allNotebooks(){
    return this.db.allNotebooks()
  }
  static allNotebookIds(){
    return this.db.allNotebooks().map(notebook=>notebook.topicId)
  }
  static allDocuments(){
    return this.db.allDocuments()
  }
  static allDocumentIds(){
    return this.db.allDocuments().map(document=>document.docMd5)
  }
  static getNoteFileById(noteId) {
    let note = this.getNoteById(noteId)
    let docFile = this.getDocById(note.docMd5)
    if (!docFile) {
      this.showHUD("No file")
      return undefined
    }
    let fullPath
    if (docFile.fullPathFileName) {
      fullPath = docFile.fullPathFileName
    }else{
      let folder = this.documentFolder
      let fullPath = folder+"/"+docFile.pathFile
      if (docFile.pathFile.startsWith("$$$MNDOCLINK$$$")) {
        let fileName = this.getFileName(docFile.pathFile)
        fullPath = Application.sharedInstance().tempPath + fileName
        // fullPath = docFile.pathFile.replace("$$$MNDOCLINK$$$", "/Users/linlifei/")
      }
    }
    if (!this.isfileExists(fullPath)) {
      this.showHUD("Invalid file: "+docFile.pathFile)
      return undefined
    }
    // copy(fullPath)
    let fileName = this.getFileName(fullPath)
    return{
      name:fileName,
      path:fullPath,
      md5:docFile.docMd5
    }
  }
  static isNSNull(obj){
    return (obj === NSNull.new())
  }
  static createFolder(path){
    if (!this.isfileExists(path)) {
      NSFileManager.defaultManager().createDirectoryAtPathAttributes(path, undefined)
    }
  }
  static createFolderDev(path){
    if (!this.isfileExists(path)) {
      NSFileManager.defaultManager().createDirectoryAtPathWithIntermediateDirectoriesAttributes(path, true, undefined)
    }
  }
  /**
   * 
   * @param {string} path 
   * @returns 
   */
  static getFileFold(path){
    return path.split("/").slice(0, -1).join("/")
  }
  /**
   * 
   * @param {string} sourcePath 
   * @param {string} targetPath 
   * @returns {boolean}
   */
  static copyFile(sourcePath, targetPath){
    try {
      if (!this.isfileExists(targetPath)) {
        let folder = this.getFileFold(targetPath)
        if (!this.isfileExists(folder)) {
          this.createFolderDev(folder)
        }
        let success = NSFileManager.defaultManager().copyItemAtPathToPath(sourcePath, targetPath)
        return success
      }
    } catch (error) {
      this.addErrorLog(error, "copyFile")
      return false
    }
  }
  /**
   * 
   * @param {UIWebView} webview 
   * @param {string} script 
   * @returns 
   */
  static async runJavaScript(webview,script) {
  // if(!this.webviewResponse || !this.webviewResponse.window)return;
  return new Promise((resolve, reject) => {
    try {
      if (webview) {
        // MNUtil.copy(webview)
        webview.evaluateJavaScript(script,(result) => {
          if (this.isNSNull(result)) {
            resolve(undefined)
          }
          resolve(result)
        });
      }else{
        resolve(undefined)
      }
    } catch (error) {
      chatAIUtils.addErrorLog(error, "runJavaScript")
      resolve(undefined)
    }
  })
};
  static getRandomElement(arr) {
    if (arr.length === 1) {
      return arr[0]
    }
    if (arr && arr.length) {
      const randomIndex = Math.floor(Math.random() * arr.length);
      return arr[randomIndex];
    }
    return ""; // 或者抛出一个错误，如果数组为空或者未定义
  }
  /**
   * Displays a Heads-Up Display (HUD) message on the specified window for a given duration.
   * 
   * This method shows a HUD message on the specified window for the specified duration.
   * If no window is provided, it defaults to the current window. The duration is set to 2 seconds by default.
   * 
   * @param {string} message - The message to display in the HUD.
   * @param {number} [duration=2] - The duration in seconds for which the HUD should be displayed.
   * @param {UIWindow} [window=this.currentWindow] - The window on which the HUD should be displayed.
   */
  static showHUD(message, duration = 2, view = this.currentWindow) {
    if (this.onWaitHUD) {
      this.stopHUD(view)
    }
    this.app.showHUD(message, view, duration);
  }
  static waitHUD(message, view = this.currentWindow) {
    // if (this.onWaitHUD) {
    //   return
    // }
    this.app.waitHUDOnView(message, view);
    this.onWaitHUD = true
  }
  static async stopHUD(delay = 0, view = this.currentWindow) {
    if (typeof delay === "number") {
      await MNUtil.delay(delay)
    }
    this.app.stopWaitHUDOnView(view);
    this.onWaitHUD = false
  }
  /**
   * Displays a confirmation dialog with a main title and a subtitle.
   * 
   * This method shows a confirmation dialog with the specified main title and subtitle.
   * It returns a promise that resolves with the button index of the button clicked by the user.
   * 
   * @param {string} mainTitle - The main title of the confirmation dialog.
   * @param {string} subTitle - The subtitle of the confirmation dialog.
   * @returns {Promise<number>} A promise that resolves with the button index of the button clicked by the user.
   */
  static async confirm(mainTitle,subTitle){
    return new Promise((resolve, reject) => {
      UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
        mainTitle,subTitle,0,"Cancel",["Confirm"],
        (alert, buttonIndex) => {
          // MNUtil.copyJSON({alert:alert,buttonIndex:buttonIndex})
          resolve(buttonIndex)
        }
      )
    })
  }
  /**
   * 0代表用户取消,其他数字代表用户选择的按钮索引
   * @param {string} mainTitle - The main title of the confirmation dialog.
   * @param {string} subTitle - The subtitle of the confirmation dialog.
   * @param {string[]} items - The items to display in the dialog.
   * @returns {Promise<number>} A promise that resolves with the button index of the button clicked by the user.
   */
  static async userSelect(mainTitle,subTitle,items){
    return new Promise((resolve, reject) => {
      UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
        mainTitle,subTitle,0,"Cancel",items,
        (alert, buttonIndex) => {
          // MNUtil.copyJSON({alert:alert,buttonIndex:buttonIndex})
          resolve(buttonIndex)
        }
      )
    })
  }
  /**
   * 自动检测类型并复制
   * @param {string|object|NSData|UIImage} object 
   */
  static copy(object) {
    switch (typeof object) {
      case "string":
        UIPasteboard.generalPasteboard().string = object
        break;
      case "object":
        if (object instanceof NSData) {//假设为图片的data
          this.copyImage(object)
          break;
        }
        if (object instanceof UIImage) {
          this.copyImage(object.pngData())
          break;
        }
        if (object instanceof MNNote) {
          this.copy(object.noteId)
          break;
        }
        if (object instanceof Error) {
          this.copy(object.toString())
          break
        }
        UIPasteboard.generalPasteboard().string = JSON.stringify(object,null,2)
        break;
      default:
        this.showHUD("Unsupported type: "+typeof object)
        break;
    }
  }
  /**
   * Copies a JSON object to the clipboard as a formatted string.
   * 
   * This method converts the provided JSON object into a formatted string using `JSON.stringify`
   * with indentation for readability, and then sets this string to the clipboard.
   * 
   * @param {Object} object - The JSON object to be copied to the clipboard.
   */
  static copyJSON(object) {
    UIPasteboard.generalPasteboard().string = JSON.stringify(object,null,2)
  }
  /**
   * Copies an image to the clipboard.
   * 
   * This method sets the provided image data to the clipboard with the specified pasteboard type.
   * 
   * @param {NSData} imageData - The image data to be copied to the clipboard.
   */
  static copyImage(imageData) {
    UIPasteboard.generalPasteboard().setDataForPasteboardType(imageData,"public.png")
  }
  /**
   *
   * @param {string} url
   */
  static openURL(url){
    this.app.openURL(NSURL.URLWithString(url));
  }
  static async openNotebook(notebook, needConfirm = false){
    if (!notebook) {
      this.showHUD("No notebook")
      return
    }
    if (notebook.topicId == this.currentNotebookId) {
      MNUtil.refreshAfterDBChanged()
      // this.showHUD("Already in current notebook")
      return
    }
    if (needConfirm) {
      let confirm = await MNUtil.confirm("是否打开学习集？", notebook.title)
      MNUtil.refreshAfterDBChanged()
      if (confirm) {
        MNUtil.openURL("marginnote4app://notebook/"+notebook.topicId)
      }
    }else{
      MNUtil.openURL("marginnote4app://notebook/"+notebook.topicId)
    }
  }
  /**
   * 
   * @param {string} noteId 
   * @returns {boolean}
   */
  static isNoteInReview(noteId){
    return this.studyController.isNoteInReview(noteId)
  }
  static noteExists(noteId){
    let note = this.db.getNoteById(noteId)
    if (note) {
      return true
    }
    return false
  }
  /**
   * 
   * @param {string} noteid 
   * @returns 
   */
  static getNoteById(noteid,alert = false) {
    let note = this.db.getNoteById(noteid)
    if (note) {
      return note
    }else{
      if (alert){
        this.copy(noteid)
        // this.showHUD("Note not exist!")
      }
      return undefined
    }
  }
  static getNoteBookById(notebookId) {
    let notebook = this.db.getNotebookById(notebookId)
    return notebook
  }
  static getDocById(md5) {
    let doc = this.db.getDocumentById(md5)
    return doc
  }
  /**
   *
   * @param {String} url
   * @returns {String}
   */
  static getNoteIdByURL(url) {
    let targetNoteId = url.trim()
    if (/^marginnote\dapp:\/\/note\//.test(targetNoteId)) {
      targetNoteId = targetNoteId.slice(22)
    }
    return targetNoteId
  }
  /**
   * 
   * @param {string}filePath The file path of the document to import
   * @returns {string} The imported document md5
   */
  static importDocument(filePath) {
    return MNUtil.app.importDocument(filePath)
  }
  /**
   * 该方法会弹出文件选择窗口以选择要导入的文档
   * @returns {string} 返回文件md5
   */
  static async importPDFFromFile(){
    let docPath = await MNUtil.importFile("com.adobe.pdf")
    return this.importDocument(docPath)
  }
  /**
   * 该方法会弹出文件选择窗口以选择要导入的文档,并直接在指定学习集中打开
   * @returns {string} 返回文件md5
   */
  static async importPDFFromFileAndOpen(notebookId){
    let docPath = await MNUtil.importFile("com.adobe.pdf")
    let md5 = this.importDocument(docPath)
    MNUtil.openDoc(md5,notebookId)
    return md5
  }
  static toggleExtensionPanel(){
    this.studyController.toggleExtensionPanel()
  }
  static isfileExists(path) {
    return NSFileManager.defaultManager().fileExistsAtPath(path)
  }
  /**
   * Generates a frame object with the specified x, y, width, and height values.
   * 
   * This method creates a frame object with the provided x, y, width, and height values.
   * If any of these values are undefined, it displays a HUD message indicating the invalid parameter
   * and sets the value to 10 as a default.
   * 
   * @param {number} x - The x-coordinate of the frame.
   * @param {number} y - The y-coordinate of the frame.
   * @param {number} width - The width of the frame.
   * @param {number} height - The height of the frame.
   * @returns {{x: number, y: number, width: number, height: number}} The frame object with the specified dimensions.
   */
  static genFrame(x, y, width, height) {
    if (x === undefined) {
        this.showHUD("无效的参数: x");
        x = 10;
    }
    if (y === undefined) {
        this.showHUD("无效的参数: y");
        y = 10;
    }
    if (width === undefined) {
        this.showHUD("无效的参数: width");
        // this.copyJSON({x:x,y:y,width:width,height:height})
        width = 10;
    }
    if (height === undefined) {
        this.showHUD("无效的参数: height");
        height = 10;
    }
    return { x: x, y: y, width: width, height: height };
  }
  static setFrame(view,x,y,width,height){
    view.frame = {x:x,y:y,width:width,height:height}
  }
  /**
   *
   * @param {DocumentController} docController
   * @returns
   */
  static genSelection(docController){
    let selection = {onSelection:true,docController:docController}
    //无论是选中文字还是框选图片，都可以拿到图片。而文字则不一定
    let image = docController.imageFromSelection()
    if (image) {
      selection.image = image
      selection.isText = docController.isSelectionText
      if (docController.selectionText) {
        selection.text = docController.selectionText
      }
      selection.docMd5 = docController.docMd5
      selection.pageIndex = docController.currPageIndex
      return selection
    }
    return {onSelection:false}

  }
  static parseWinRect(winRect) {
    let rectArr = winRect.replace(/{/g, '').replace(/}/g, '').replace(/\s/g, '').split(',')
    let X = Number(rectArr[0])
    let Y = Number(rectArr[1])
    let H = Number(rectArr[3])
    let W = Number(rectArr[2])
    return this.genFrame(X, Y, W, H)
  }
  static async animate(func,time = 0.2) {
    return new Promise((resolve, reject) => {
      UIView.animateWithDurationAnimationsCompletion(time,func,()=>(resolve()))
    })

  }
  static checkSender(sender,window = this.currentWindow){
    return this.app.checkNotifySenderInWindow(sender, window)
  }
  static async delay (seconds) {
    return new Promise((resolve, reject) => {
      NSTimer.scheduledTimerWithTimeInterval(seconds, false, function () {
        resolve()
      })
    })
  }
  static crash(){
    this.studyView.frame = {x:undefined}
  }
  /**
   *
   * @param {UIView} view
   */
  static isDescendantOfStudyView(view){
    return view.isDescendantOfView(this.studyView)
  }
  /**
   *
   * @param {UIView} view
   */
  static isDescendantOfCurrentWindow(view){
    return view.isDescendantOfView(this.currentWindow)
  }
  static addObserver(observer,selector,name){
    NSNotificationCenter.defaultCenter().addObserverSelectorName(observer, selector, name);
  }
  
  static addObserverForPopupMenuOnNote(observer,selector){
    NSNotificationCenter.defaultCenter().addObserverSelectorName(observer, selector, "PopupMenuOnNote");
  }
  static addObserverForClosePopupMenuOnNote(observer,selector){
    NSNotificationCenter.defaultCenter().addObserverSelectorName(observer, selector, "ClosePopupMenuOnNote");
  }
  static addObserverForPopupMenuOnSelection(observer,selector){
    NSNotificationCenter.defaultCenter().addObserverSelectorName(observer, selector, "PopupMenuOnSelection");
  }
  static addObserverForClosePopupMenuOnSelection(observer,selector){
    NSNotificationCenter.defaultCenter().addObserverSelectorName(observer, selector, "ClosePopupMenuOnSelection");
  }
  static addObserverForUITextViewTextDidBeginEditing(observer,selector){
    NSNotificationCenter.defaultCenter().addObserverSelectorName(observer, selector, "UITextViewTextDidBeginEditingNotification");
  }
  static addObserverForUITextViewTextDidEndEditing(observer,selector){
    NSNotificationCenter.defaultCenter().addObserverSelectorName(observer, selector, "UITextViewTextDidEndEditingNotification");
  }
  static addObserverForCloudKeyValueStoreDidChange(observer,selector){
    NSNotificationCenter.defaultCenter().addObserverSelectorName(observer, selector, "NSUbiquitousKeyValueStoreDidChangeExternallyNotificationUI");
  }
  static addObserverForProcessNewExcerpt(observer,selector){
    NSNotificationCenter.defaultCenter().addObserverSelectorName(observer, selector, "ProcessNewExcerpt");
  }
  static addObserverForAddonBroadcast(observer,selector){
    NSNotificationCenter.defaultCenter().addObserverSelectorName(observer, selector, "AddonBroadcast");
  }
  static addObserverForUIPasteboardChanged(observer,selector){
    NSNotificationCenter.defaultCenter().addObserverSelectorName(observer, selector, "UIPasteboardChangedNotification");
  }

  static removeObserver(observer,name){
    NSNotificationCenter.defaultCenter().removeObserverName(observer, name);
  }
  static removeObservers(observer,notifications) {
    notifications.forEach(notification=>{
      NSNotificationCenter.defaultCenter().removeObserverName(observer, notification);
    })
  }
  static removeObserverForPopupMenuOnNote(observer,selector){
    NSNotificationCenter.defaultCenter().removeObserverName(observer, selector, "PopupMenuOnNote");
  }
  static removeObserverForClosePopupMenuOnNote(observer,selector){
    NSNotificationCenter.defaultCenter().removeObserverName(observer, selector, "ClosePopupMenuOnNote");
  }
  static removeObserverForPopupMenuOnSelection(observer,selector){
    NSNotificationCenter.defaultCenter().removeObserverName(observer, selector, "PopupMenuOnSelection");
  }
  static removeObserverForClosePopupMenuOnSelection(observer,selector){
    NSNotificationCenter.defaultCenter().removeObserverName(observer, selector, "ClosePopupMenuOnSelection");
  }
  static removeObserverForUITextViewTextDidBeginEditing(observer,selector){
    NSNotificationCenter.defaultCenter().removeObserverName(observer, selector, "UITextViewTextDidBeginEditingNotification");
  }
  static removeObserverForUITextViewTextDidEndEditing(observer,selector){
    NSNotificationCenter.defaultCenter().removeObserverName(observer, selector, "UITextViewTextDidEndEditingNotification");
  }
  static removeObserverForCloudKeyValueStoreDidChange(observer,selector){
    NSNotificationCenter.defaultCenter().removeObserverName(observer, selector, "NSUbiquitousKeyValueStoreDidChangeExternallyNotificationUI");
  }
  static removeObserverForProcessNewExcerpt(observer,selector){
    NSNotificationCenter.defaultCenter().removeObserverName(observer, selector, "ProcessNewExcerpt");
  }
  static removeObserverForAddonBroadcast(observer,selector){
    NSNotificationCenter.defaultCenter().removeObserverName(observer, selector, "AddonBroadcast");
  }
  static removeObserverForUIPasteboardChanged(observer,selector){
    NSNotificationCenter.defaultCenter().removeObserverName(observer, selector, "UIPasteboardChangedNotification");
  }
  static refreshAddonCommands(){
    this.studyController.refreshAddonCommands()
  }
  static refreshAfterDBChanged(notebookId = this.currentNotebookId){
    this.app.refreshAfterDBChanged(notebookId)
  }
  /**
   * Focuses a note in the mind map by its ID with an optional delay.
   * 
   * This method attempts to focus a note in the mind map by its ID. If the note is not in the current notebook,
   * it displays a HUD message indicating that the note is not in the current notebook. If a delay is specified,
   * it waits for the specified delay before focusing the note.
   * 
   * @param {string} noteId - The ID of the note to focus.
   * @param {number} [delay=0] - The delay in seconds before focusing the note.
   */
  static focusNoteInMindMapById(noteId,delay=0){
  try {
    let note = this.getNoteById(noteId)
    if (note.notebookId && note.notebookId !== this.currentNotebookId) {
      this.showHUD("Note not in current notebook")
      return
    }
    if (delay) {
      this.delay(delay).then(()=>{
        this.studyController.focusNoteInMindMapById(noteId)
      })
    }else{
      this.studyController.focusNoteInMindMapById(noteId)
    }

  } catch (error) {
    MNUtil.showHUD(error)
  }
  }
  static focusNoteInFloatMindMapById(noteId,delay = 0){
    if (delay) {
      this.delay(delay).then(()=>{
        this.studyController.focusNoteInFloatMindMapById(noteId)
      })
    }else{
      this.studyController.focusNoteInFloatMindMapById(noteId)
    }
  }
  static focusNoteInDocumentById(noteId,delay = 0){
    if (delay) {
      this.delay(delay).then(()=>{
        this.studyController.focusNoteInDocumentById(noteId)
      })
    }else{
      this.studyController.focusNoteInDocumentById(noteId)
    }
  }
  /**
   * 
   * @param {string} jsonString 
   * @returns {boolean}
   */
  static isValidJSON(jsonString){
    // return NSJSONSerialization.isValidJSONObject(result)
     try{
         var json = JSON.parse(jsonString);
         if (json && typeof json === "object") {
             return true;
         }
     }catch(e){
         return false;
     }
     return false;
  }
  /**
   * 
   * @param {string} text 
   * @returns {object|undefined}
   */
  static getValidJSON(text) {
    try {
    if (text.endsWith(':')) {
      text = text+'""}'
    }
    if (this.isValidJSON(text)) {
      return JSON.parse(text)
    }else if (this.isValidJSON(text+"\"}")){
      return JSON.parse(text+"\"}")
    }else if (this.isValidJSON(text+"}")){
      return JSON.parse(text+"}")
    }else if (!text.startsWith('{') && text.endsWith('}')){
      return JSON.parse("{"+text)
    }else{
      // this.showHUD("no valid json")
      // this.copy(original)
      return undefined
    }
    } catch (error) {
      this.showHUD("Error in getValidJSON: "+error)
      this.copy(text)
      return undefined
    }
  }
  /**
   * Merges multiple consecutive whitespace characters into a single space, except for newlines.
   * 
   * This method processes the input string to replace multiple consecutive whitespace characters
   * (excluding newlines) with a single space. It also ensures that multiple consecutive newlines
   * are reduced to a single newline. The resulting string is then trimmed of any leading or trailing
   * whitespace.
   * 
   * @param {string} str - The input string to be processed.
   * @returns {string} The processed string with merged whitespace.
   */
  static mergeWhitespace(str) {
      if (!str) {
        return "";
      }
      // 先将多个连续的换行符替换为单个换行符
      var tempStr = str.replace(/\n+/g, '\n');
      // 再将其它的空白符（除了换行符）替换为单个空格
      return tempStr.replace(/[\r\t\f\v ]+/g, ' ').trim();
  }
  static undo(notebookId = this.currentNotebookId){
    UndoManager.sharedInstance().undo()
    this.app.refreshAfterDBChanged(notebookId)

  }
  static redo(notebookId = this.currentNotebookId){
    UndoManager.sharedInstance().redo()
    this.app.refreshAfterDBChanged(notebookId)
  }
  /**
   * Groups the specified function within an undo operation for the given notebook.
   * 
   * This method wraps the provided function within an undo operation for the specified notebook.
   * It ensures that the function's changes can be undone as a single group. After the function is executed,
   * it refreshes the application to reflect the changes.
   * 
   * @param {Function} f - The function to be executed within the undo group.
   * @param {string} [notebookId=this.currentNotebookId] - The ID of the notebook for which the undo group is created.
   */
  static undoGrouping(f,notebookId = this.currentNotebookId){
    UndoManager.sharedInstance().undoGrouping(
      String(Date.now()),
      notebookId,
      f
    )
    this.app.refreshAfterDBChanged(notebookId)
  }
  static getImage(path,scale=2) {
    return UIImage.imageWithDataScale(NSData.dataWithContentsOfFile(path), scale)
  }
  static getFile(path) {
    return NSData.dataWithContentsOfFile(path)
  }
  /**
   * Extracts the file name from a full file path.
   * 
   * This method takes a full file path as input and extracts the file name by finding the last occurrence
   * of the '/' character and then taking the substring from that position to the end of the string.
   * 
   * @param {string} fullPath - The full path of the file.
   * @returns {string} The extracted file name.
   */
  static getFileName(fullPath) {
      // 找到最后一个'/'的位置
      let lastSlashIndex = fullPath.lastIndexOf('/');

      // 从最后一个'/'之后截取字符串，得到文件名
      let fileName = fullPath.substring(lastSlashIndex + 1);

      return fileName;
  }
  static getMediaByHash(hash) {
    let image = this.db.getMediaByHash(hash)
    return image
  }
  /**
   * 左 0, 下 1，3, 上 2, 右 4
   * @param {*} sender
   * @param {object[]} commandTable
   * @param {number} width
   * @param {number} preferredPosition
   * @returns
   */
  static getPopoverAndPresent(sender,commandTable,width=100,preferredPosition=2) {
    let position = preferredPosition
    var menuController = MenuController.new();
    menuController.commandTable = commandTable
    // menuController.sections = [commandTable,commandTable]
    menuController.rowHeight = 35;
    menuController.preferredContentSize = {
      width: width,
      height: menuController.rowHeight * menuController.commandTable.length
    };
    //左 0
    //下 1，3
    //上 2
    //右 4

    var popoverController = new UIPopoverController(menuController);
    let targetView = this.studyView
    var r = sender.convertRectToView(sender.bounds,targetView);
    // MNUtil.showHUD("message"+preferredPosition)
    switch (preferredPosition) {
      case 0:
        if (r.x < 50) {
          position = 4
        }
        break;
      case 1:
      case 3:
        if (r.y+r.height > targetView.frame.height - 50) {
          position = 2
        }
        break;
      case 2:
        if (r.y < 50) {
          position = 3
        }
        break;
      case 4:
        if (r.x+r.width > targetView.frame.width - 50) {
          position = 0
        }
        break;
      default:
        break;
    }
    popoverController.presentPopoverFromRect(r, targetView, position, true);
    return popoverController
  }
  /**
   *
   * @param {string} name
   * @param {*} userInfo
   */
  static postNotification(name,userInfo) {
    NSNotificationCenter.defaultCenter().postNotificationNameObjectUserInfo(name, this.currentWindow, userInfo)
  }
  /**
   * Parses a 6/8-digit hexadecimal color string into a color object.
   * 
   * @param {string} hex - The 6/8-digit hexadecimal color string to parse.
   * @returns {object} An object with the following properties: `color` (the parsed color string), and `opacity` (the opacity of the color).
   */
  static parseHexColor(hex) {
    // 检查输入是否是有效的6位16进制颜色字符串
    if (typeof hex === 'string' && hex.length === 8) {
          return {
              color: hex,
              opacity: 1
          };
    }
    // 检查输入是否是有效的8位16进制颜色字符串
    if (typeof hex !== 'string' || !/^#([0-9A-Fa-f]{8})$/.test(hex)) {
        throw new Error('Invalid 8-digit hexadecimal color');
    }

    // 提取红色、绿色、蓝色和不透明度的16进制部分
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const a = parseInt(hex.slice(7, 9), 16) / 255; // 转换为0到1的不透明度

    // 将RGB值转换为6位16进制颜色字符串
    const rgbHex = `#${hex.slice(1, 7)}`;

    return {
        color: rgbHex,
        opacity: parseFloat(a.toFixed(2)) // 保留2位小数
    };
  }
  static hexColorAlpha(hex,alpha=1.0) {
    let color = UIColor.colorWithHexString(hex)
    return alpha!==undefined?color.colorWithAlphaComponent(alpha):color
  }
  /**
   * 
   * @param {string} hex 
   * @returns {UIColor}
   */
  static hexColor(hex) {
    let colorObj = this.parseHexColor(hex)
    return MNUtil.hexColorAlpha(colorObj.color,colorObj.opacity)
  }
  static genNSURL(url) {
    return NSURL.URLWithString(url)
  }
  /**
   * 默认在当前学习集打开
   * @param {string} md5 
   * @param {string} notebookId
   */
  static openDoc(md5,notebookId=MNUtil.currentNotebookId){
    MNUtil.studyController.openNotebookAndDocument(notebookId, md5)
  }
  /**
   * Converts NSData to a string.
   * 
   * This method checks if the provided data object has a base64 encoding method. If it does,
   * it decodes the base64 data and converts it to a UTF-8 string. If the data object does not
   * have a base64 encoding method, it returns the data object itself.
   * 
   * @param {NSData} data - The data object to be converted to a string.
   * @returns {string} The converted string.
   */
  static data2string(data){
    if (data.base64Encoding) {
      let test = CryptoJS.enc.Base64.parse(data.base64Encoding())
      let textString = CryptoJS.enc.Utf8.stringify(test);
      return textString
    }else{
      return data
    }
  }
  static readJSON(path){
    let data = NSData.dataWithContentsOfFile(path)
    const res = NSJSONSerialization.JSONObjectWithDataOptions(
      data,
      1<<0
    )
    return res
  }
  static writeJSON(path,object){
    NSData.dataWithStringEncoding(
      JSON.stringify(object, undefined, 2),
      4
    ).writeToFileAtomically(path, false)
  }
  static readText(path){
    let data = NSData.dataWithContentsOfFile(path)
    let test = CryptoJS.enc.Base64.parse(data.base64Encoding())
    let content = CryptoJS.enc.Utf8.stringify(test);
    return content
  }
  static writeText(path,string){
    NSData.dataWithStringEncoding(
      string,
      4
    ).writeToFileAtomically(path, false)
  }
  static readTextFromUrlSync(url){
    let textData = NSData.dataWithContentsOfURL(this.genNSURL(url))
    let text = this.data2string(textData)
    return text
  }
  static async readTextFromUrlAsync(url,option={}){
    // MNUtil.copy("readTextFromUrlAsync")
    let res = await MNConnection.fetch(url,option)
    if (!res.base64Encoding && "timeout" in res && res.timeout) {
      return undefined
    }
    let text = this.data2string(res)
    return text
  }
  /**
   * Encrypts or decrypts a string using XOR encryption with a given key.
   * 
   * This method performs XOR encryption or decryption on the input string using the provided key.
   * Each character in the input string is XORed with the corresponding character in the key,
   * repeating the key if it is shorter than the input string. The result is a new string
   * where each character is the XOR result of the original character and the key character.
   * 
   * @param {string} input - The input string to be encrypted or decrypted.
   * @param {string} key - The key used for XOR encryption or decryption.
   * @returns {string} The encrypted or decrypted string.
   */
  static xorEncryptDecrypt(input, key) {
    let output = [];
    for (let i = 0; i < input.length; i++) {
        // Perform XOR between the input character and the key character
        output.push(input.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return String.fromCharCode.apply(null, output);
  }
  // static encrypt(text,key){
  //   var encrypted = CryptoJS.AES.encrypt(text, key).toString();
  //   return encrypted
  // }
  // static decrypt(text,key){
  //   var decrypted = CryptoJS.AES.decrypt(text, key).toString();
  //   var originalText = decrypted.toString(CryptoJS.enc.Utf8);
  //   return originalText
  // }
  static MD5(data){
    let md5 = CryptoJS.MD5(data).toString();
    return md5
  }

  static replaceMNImagesWithBase64(markdown) {
  // if (/!\[.*?\]\((marginnote4app\:\/\/markdownimg\/png\/.*?)(\))/) {

  //   // ![image.png](marginnote4app://markdownimg/png/eebc45f6b237d8abf279d785e5dcda20)
  // }
try {
    // let shouldOverWritten = false
    // 匹配 base64 图片链接的正则表达式
    const MNImagePattern = /!\[.*?\]\((marginnote4app\:\/\/markdownimg\/png\/.*?)(\))/g;
    let images = []
    // 处理 Markdown 字符串，替换每个 base64 图片链接
    const result = markdown.replace(MNImagePattern, (match, MNImageURL,p2) => {
      // 你可以在这里对 base64Str 进行替换或处理
      // shouldOverWritten = true
      let hash = MNImageURL.split("markdownimg/png/")[1]
      let imageData = MNUtil.getMediaByHash(hash)
      let imageBase64 = imageData.base64Encoding()
      // if (!imageData) {
      //   return match.replace(MNImageURL, hash+".png");
      // }
      // imageData.writeToFileAtomically(editorUtils.bufferFolder+hash+".png", false)
      return match.replace(MNImageURL, "data:image/png;base64,"+imageBase64);
    });
  return result;
} catch (error) {
  return undefined
}
}

  static md2html(md){
    let tem = this.replaceMNImagesWithBase64(md)
    return marked.parse(tem.replace(/_{/g,'\\_\{').replace(/_\\/g,'\\_\\'))
  }
  /**
   * Escapes special characters in a string to ensure it can be safely used in JavaScript code.
   * 
   * This method escapes backslashes, backticks, template literal placeholders, carriage returns,
   * newlines, single quotes, and double quotes in the input string. The resulting string can be
   * safely used in JavaScript code without causing syntax errors.
   * 
   * @param {string} str - The input string to be escaped.
   * @returns {string} The escaped string.
   */
  static escapeString(str) {
    return str.replace(/\\/g, '\\\\') // Escape backslashes
              .replace(/\`/g, '\\`') // Escape backticks
              .replace(/\$\{/g, '\\${') // Escape template literal placeholders
              .replace(/\r/g, '\\r') // Escape carriage returns
              .replace(/\n/g, '\\n') // Escape newlines
              .replace(/'/g, "\\'")   // Escape single quotes
              .replace(/"/g, '\\"');  // Escape double quotes
  }
  static getLocalDataByKey(key) {
    return NSUserDefaults.standardUserDefaults().objectForKey(key)
  }
  static setLocalDataByKey(data, key) {
    NSUserDefaults.standardUserDefaults().setObjectForKey(data, key)
  }
  static getCloudDataByKey(key) {
    return NSUbiquitousKeyValueStore.defaultStore().objectForKey(key)
  }
  static setCloudDataByKey(data, key) {
    NSUbiquitousKeyValueStore.defaultStore().setObjectForKey(data, key)
  }

  /**
   *
   * @param {string | string[]} UTI
   * @returns
   */
  static async importFile(UTI){
    if (Array.isArray(UTI)) {
      return new Promise((resolve, reject) => {
        this.app.openFileWithUTIs(UTI,this.studyController,(path)=>{
          resolve(path)
        })
      })
    }else{
      return new Promise((resolve, reject) => {
        this.app.openFileWithUTIs([UTI],this.studyController,(path)=>{
          resolve(path)
        })
      })
    }
  }
  /**
   * 弹出文件选择窗口,选中json后直接返回对应的json对象
   * @returns {Object}
   */
  static async importJSONFromFile(){
    let path = await MNUtil.importFile("public.json")
    return this.readJSON(path)
  }
  static saveFile(filePath, UTI) {
    this.app.saveFileWithUti(filePath, UTI)
  }
  /**
   * 去重
   * @param {T[]} arr
   * @param {boolean} noEmpty
   * @returns {T[]}
   */
 static unique (arr, noEmpty = false){
  let ret = []
  if (arr.length <= 1) ret = arr
  else ret = Array.from(new Set(arr))
  if (noEmpty) ret = ret.filter(k => k)
  return ret
}
  /**
   * 
   * @param {undefined|string|MNNote|MbBookNote|NSData|UIImage} object 
   * @returns 
   */
  static typeOf(object){
    if (typeof object === "undefined") {
      return "undefined"
    }
    if (typeof object === "string") {
      if (/^marginnote\dapp:\/\/note\//.test(object.trim())) {
        return "NoteURL"
      }
      if (/^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/.test(object.trim())) {
        return "NoteId"
      }
      return "string"
    }
    if (object instanceof MNNote) {
      return "MNNote"
    }
    if (object instanceof NSData) {
      return "NSData"
    }
    if (object instanceof UIImage) {
      return "UIImage"
    }
    if (object instanceof MNComment) {
      return "MNComment"
    }
    if (object.noteId) {
      return "MbBookNote"
    }
    if ("title" in object || "content" in object || "excerptText" in object) {
      return "NoteConfig"
    }

    return typeof object

  }
  static getNoteId(note){
    let noteId
    switch (this.typeOf(note)) {
      case "MbBookNote":
        noteId = note.noteId
        break;
      case "NoteURL":
        noteId = this.getNoteIdByURL(note)
        break;
      case "NoteId":
      case 'string':
        noteId = note
        break;
      default:
        this.showHUD("MNUtil.getNoteId: Invalid param")
        return undefined
    }
    return noteId
  }
  /**
   * allMap = 0,
   * half = 1,
   * allDoc = 2
   */
  static get docMapSplitMode(){
    return this.studyController.docMapSplitMode
  }
  /**
   * Retrieves the image data from the current document controller or other document controllers if the document map split mode is enabled.
   * 
   * This method checks for image data in the current document controller's selection. If no image is found, it checks the focused note within the current document controller.
   * If the document map split mode is enabled, it iterates through all document controllers to find the image data. If a pop-up selection info is available, it also checks the associated document controller.
   * 
   * @param {boolean} [checkImageFromNote=false] - Whether to check the focused note for image data.
   * @param {boolean} [checkDocMapSplitMode=false] - Whether to check other document controllers if the document map split mode is enabled.
   * @returns {NSData|undefined} The image data if found, otherwise undefined.
   */
  static getDocImage(checkImageFromNote=false,checkDocMapSplitMode=false){
  try {

    let docMapSplitMode = this.studyController.docMapSplitMode
    if (checkDocMapSplitMode && !docMapSplitMode) {
      return undefined
    }
    let imageData = this.currentDocController.imageFromSelection()
    if (imageData) {
      return imageData
    }
    if (checkImageFromNote) {
      imageData = this.currentDocController.imageFromFocusNote()
    }
    if (imageData) {
      return imageData
    }
    // MNUtil.showHUD("message"+this.docControllers.length)
    if (docMapSplitMode) {//不为0则表示documentControllers存在
      let imageData
      let docNumber = this.docControllers.length
      for (let i = 0; i < docNumber; i++) {
        const docController = this.docControllers[i];
        imageData = docController.imageFromSelection()
        if (!imageData && checkImageFromNote) {
          imageData = docController.imageFromFocusNote()
        }
        if (imageData) {
          return imageData
        }
      }
    }
    if (this.popUpSelectionInfo) {
      let docController = this.popUpSelectionInfo.docController
      let imageData = docController.imageFromSelection()
      if (imageData) {
        return imageData
      }
      if (checkImageFromNote) {
        imageData = docController.imageFromFocusNote()
      }
      if (imageData) {
        return imageData
      }
    }
    return undefined
  } catch (error) {
    MNUtil.showHUD(error)
    return undefined
  }
  }
  static excuteCommand(command){
    let urlPre = "marginnote4app://command/"
    if (command) {
      let url = urlPre+command
      this.openURL(url)
      return
    }
  }
  /**
   *
   * @param {number[]} arr
   * @param {string} type
   */
  static sort(arr,type="increment"){
    let arrToSort = arr
    switch (type) {
      case "decrement":
        arrToSort.sort((a, b) => b - a);
        break;
      case "increment":
        arrToSort.sort((a, b) => a - b);
        break;
      default:
        break;
    }
    return [...new Set(arrToSort)]
  }
  /**
   * Displays an input dialog with a title, subtitle, and a list of items.
   * 
   * This method shows an input dialog with the specified title and subtitle. It allows the user to input text and select from a list of items.
   * The method returns a promise that resolves with an object containing the input text and the index of the button clicked by the user.
   * 
   * @param {string} title - The main title of the input dialog.
   * @param {string} subTitle - The subtitle of the input dialog.
   * @param {string[]} items - The list of items to display in the dialog.
   * @returns {Promise<{input:string,button:number}>} A promise that resolves with an object containing the input text and the button index.
   */
  static async input(title,subTitle,items) {
    return new Promise((resolve, reject) => {
      UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
        title,subTitle,2,items[0],items.slice(1),
        (alert, buttonIndex) => {
          let res = {input:alert.textFieldAtIndex(0).text,button:buttonIndex}
          resolve(res)
        }
      )
    })
  }
  /**
   * 注意这里的code需要是字符串
   * @param {string} code
   * @returns {string}
   */
  static getStatusCodeDescription(code){
  try {
    let des = {
    "400": "Bad Request",
    "401": "Unauthorized",
    "402": "Payment Required",
    "403": "Forbidden",
    "404": "Not Found",
    "405": "Method Not Allowed",
    "406": "Not Acceptable",
    "407": "Proxy Authentication Required",
    "408": "Request Timeout",
    "409": "Conflict",
    "410": "Gone",
    "411": "Length Required",
    "412": "Precondition Failed",
    "413": "Payload Too Large",
    "414": "URI Too Long",
    "415": "Unsupported Media Type",
    "416": "Range Not Satisfiable",
    "417": "Expectation Failed",
    "418": "I'm a teapot",
    "421": "Misdirected Request",
    "422": "Unprocessable Entity",
    "423": "Locked",
    "424": "Failed Dependency",
    "425": "Too Early",
    "426": "Upgrade Required",
    "428": "Precondition Required",
    "429": "Too Many Requests",
    "431": "Request Header Fields Too Large",
    "451": "Unavailable For Legal Reasons",
    "500": "Internal Server Error",
    "501": "Not Implemented",
    "502": "Bad Gateway",
    "503": "Service Unavailable",
    "504": "Gateway Timeout",
    "505": "HTTP Version Not Supported",
    "506": "Variant Also Negotiates",
    "507": "Insufficient Storage",
    "508": "Loop Detected",
    "510": "Not Extended",
    "511": "Network Authentication Required"
  }
  if (code in des) {
    return (code+": "+des[code])
  }
  return undefined
  } catch (error) {
    MNUtil.copy(error.toString())
  }
  }
  /**
   * 
   * @param {string} template 
   * @param {object} config 
   * @returns {string}
   */
  static render(template,config){
    let output = mustache.render(template,config)
    return output
  }
  /**
   * 
   * @param {number} value 
   * @param {number} min 
   * @param {number} max 
   * @returns {number}
   */
  static constrain(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
  /**
   * max为10
   * @param {number} index 
   * @returns 
   */
  static emojiNumber(index){
    let emojiIndices = ["0️⃣","1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"]
    return emojiIndices[index]
  }
  static tableItem(title,object,selector,params,checked=false) {
    return {title:title,object:object,selector:selector,param:params,checked:checked}
  }
  static createJsonEditor(htmlPath){
    let jsonEditor = new UIWebView(MNUtil.genFrame(0, 0, 100, 100));
    try {
    
    jsonEditor.loadFileURLAllowingReadAccessToURL(
      NSURL.fileURLWithPath(this.mainPath + '/jsoneditor.html'),
      NSURL.fileURLWithPath(this.mainPath + '/')
    );
    } catch (error) {
      MNUtil.showHUD(error)
    }
    return jsonEditor
  }
  static deepEqual(obj1, obj2,keysToIgnore) {
    if (obj1 === obj2) return true;

    if (typeof obj1 !== 'object' || obj1 === null ||
        typeof obj2 !== 'object' || obj2 === null) {
        return false;
    }

    let keys1 = Object.keys(obj1);
    let keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (let key of keys1) {
        if (!keys2.includes(key)) {
            return false;
        }
        if (keysToIgnore && keysToIgnore.length && keysToIgnore.includes(key)) {
          continue
        }
        if (!this.deepEqual(obj1[key], obj2[key])) {
          return false;
        }
    }
    return true;
  }
  static readCloudKey(key){
    let cloudStore = NSUbiquitousKeyValueStore.defaultStore()
    if (cloudStore) {
      return cloudStore.objectForKey(key)
    }else{
      return undefined
    }
  }
  static setCloudKey(key,value){
    let cloudStore = NSUbiquitousKeyValueStore.defaultStore()
    if (cloudStore) {
      cloudStore.setObjectForKey(value,key)
    }
  }
  /**
   * 
   * @param {string[]} arr 
   * @param {string} element 
   * @param {string} direction 
   * @returns {string[]}
   */
  static moveElement(arr, element, direction) {
      // 获取元素的索引
      var index = arr.indexOf(element);
      if (index === -1) {
          this.showHUD('Element not found in array');
          return;
      }
      switch (direction) {
          case 'up':
              if (index === 0) {
                  this.showHUD('Element is already at the top');
                  return;
              }
              // 交换元素位置
              [arr[index], arr[index - 1]] = [arr[index - 1], arr[index]];
              break;
          case 'down':
              if (index === arr.length - 1) {
                  this.showHUD('Element is already at the bottom');
                  return;
              }
              // 交换元素位置
              [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
              break;
          case 'top':
              // 移除元素
              arr.splice(index, 1);
              // 添加到顶部
              arr.unshift(element);
              break;
          case 'bottom':
              // 移除元素
              arr.splice(index, 1);
              // 添加到底部
              arr.push(element);
              break;
          default:
              this.showHUD('Invalid direction');
              break;
      }
      return arr
  }
  /**
   * 
   * @returns {string}
   */
  static UUID() {
    return NSUUID.UUID().UUIDString()
  }
  static isPureMNImages(markdown) {
    try {
      // 匹配 base64 图片链接的正则表达式
      const MNImagePattern = /!\[.*?\]\((marginnote4app\:\/\/markdownimg\/png\/.*?)(\))/g;
      let res = markdown.match(MNImagePattern)
      if (res) {
        return markdown === res[0]
      }else{
        return false
      }
    } catch (error) {
      MNUtil.showHUD(error)
      return false
    }
  }
  static hasMNImages(markdown) {
    try {
      // 匹配 base64 图片链接的正则表达式
      const MNImagePattern = /!\[.*?\]\((marginnote4app\:\/\/markdownimg\/png\/.*?)(\))/g;
      let link = markdown.match(MNImagePattern)[0]
      // MNUtil.copyJSON({"a":link,"b":markdown})
      return markdown.match(MNImagePattern)?true:false
    } catch (error) {
      MNUtil.showHUD(error)
      return false
    }
  }
  /**
   * 只返回第一个图片
   * @param {string} markdown 
   * @returns {NSData}
   */
  static getMNImageFromMarkdown(markdown) {
    try {
      const MNImagePattern = /!\[.*?\]\((marginnote4app\:\/\/markdownimg\/png\/.*?)(\))/g;
      let link = markdown.match(MNImagePattern)[0]
      // MNUtil.copyJSON(link)
      let hash = link.split("markdownimg/png/")[1].slice(0,-1)
      let imageData = MNUtil.getMediaByHash(hash)
      return imageData
    } catch (error) {
      MNUtil.showHUD(error)
      return undefined
    }
  }
  /**
   * 
   * @param {MNNote} note 
   */
  static getNoteObject(note,opt={first:true}) {
    try {
    if (!note) {
      return undefined
    }
      
    let noteConfig = config
    noteConfig.id = note.noteId
    if (opt.first) {
      noteConfig.notebook = {
        id:note.notebookId,
        name:this.getNoteBookById(note.notebookId).title,
      }
    }
    noteConfig.title = note.noteTitle
    noteConfig.url = note.noteURL
    noteConfig.excerptText = note.excerptText
    noteConfig.isMarkdownExcerpt = note.excerptTextMarkdown
    noteConfig.isImageExcerpt = !!note.excerptPic
    noteConfig.date = {
      create:note.createDate.toLocaleString(),
      modify:note.modifiedDate.toLocaleString(),
    }
    noteConfig.allText = note.allNoteText()
    noteConfig.tags = note.tags
    noteConfig.hashTags = note.tags.map(tag=> ("#"+tag)).join(" ")
    noteConfig.hasTag = note.tags.length > 0
    noteConfig.hasComment = note.comments.length > 0
    noteConfig.hasChild = note.childNotes.length > 0
    if (note.colorIndex !== undefined) {
      noteConfig.color = {}
      noteConfig.color.lightYellow = note.colorIndex === 0
      noteConfig.color.lightGreen = note.colorIndex === 1
      noteConfig.color.lightBlue = note.colorIndex === 2
      noteConfig.color.lightRed = note.colorIndex === 3
      noteConfig.color.yellow = note.colorIndex === 4
      noteConfig.color.green = note.colorIndex === 5
      noteConfig.color.blue = note.colorIndex === 6
      noteConfig.color.red = note.colorIndex === 7
      noteConfig.color.orange = note.colorIndex === 8
      noteConfig.color.darkGreen = note.colorIndex === 9
      noteConfig.color.darkBlue = note.colorIndex === 10
      noteConfig.color.deepRed = note.colorIndex === 11
      noteConfig.color.white = note.colorIndex === 12
      noteConfig.color.lightGray = note.colorIndex === 13
      noteConfig.color.darkGray = note.colorIndex === 14
      noteConfig.color.purple = note.colorIndex === 15
    }
    if (note.docMd5 && this.getDocById(note.docMd5)) {
      noteConfig.docName = this.getFileName(this.getDocById(note.docMd5).pathFile) 
    }
    noteConfig.hasDoc = !!noteConfig.docName
    if (note.childMindMap) {
      noteConfig.childMindMap = this.getNoteObject(note.childMindMap,{first:false})
    }
    noteConfig.inMainMindMap = !noteConfig.childMindMap
    noteConfig.inChildMindMap = !!noteConfig.childMindMap
    if ("parent" in opt && opt.parent && note.parentNote) {
      if (opt.parentLevel && opt.parentLevel > 0) {
        noteConfig.parent = this.getNoteObject(note.parentNote,{parentLevel:opt.parentLevel-1,parent:true,first:false})
      }else{
        noteConfig.parent = this.getNoteObject(note.parentNote,{first:false})
      }
    }
    noteConfig.hasParent = "parent" in noteConfig
    if ("child" in opt && opt.child && note.childNotes) {
      noteConfig.child = note.childNotes.map(note=>this.getNoteObject(note,{first:false}))
    }
    return noteConfig
    } catch (error) {
      this.showHUD(error)
      return undefined
    }
  }
  static getDateObject(){
    let dateObject = {
      now:new Date(Date.now()).toLocaleString(),
      tomorrow:new Date(Date.now()+86400000).toLocaleString(),
      yesterday:new Date(Date.now()-86400000).toLocaleString(),
      year:new Date().getFullYear(),
      month:new Date().getMonth()+1,
      day:new Date().getDate(),
      hour:new Date().getHours(),
      minute:new Date().getMinutes(),
      second:new Date().getSeconds()
    }
    return dateObject
  }
  /**
   * 递归解析列表项及其子列表
   * @param {object[]} items 
   * @returns 
   */
  static processList(items) {
  return items.map(item => {
    // 提取当前列表项文本（忽略内部格式如粗体、斜体）
    const text = item.text.trim();
    const node = { name: text, children: [] ,type:item.type};

    // 检查列表项内部是否包含子列表（嵌套结构）
    const subLists = item.tokens.filter(t => t.type === 'list');
    if (subLists.length) {
      node.hasList = true
      node.listText = subLists[0].raw
      node.listStart = subLists[0].start
      node.listOrdered = subLists[0].ordered
      node.name = item.tokens[0].text
    }
    subLists.forEach(subList => {
      // 递归处理子列表的 items
      node.children.push(...this.processList(subList.items));
    });

    return node;
  });
}
static getUnformattedText(token) {
  if ("tokens" in token && token.tokens.length === 1) {
    return this.getUnformattedText(token.tokens[0])
  }else{
    return token.text
  }
}
/**
 * 构建树结构（整合标题和列表解析）
 * @param {object[]} tokens 
 * @returns 
 */
  static buildTree(tokens) {
  const root = { name: '中心主题', children: [] };
  const stack = [{ node: root, depth: 0 }]; // 用栈跟踪层级
  let filteredTokens = tokens.filter(token => token.type !== 'space' && token.type !== 'hr')

  filteredTokens.forEach((token,index) => {
    let current = stack[stack.length - 1];

    if (token.type === 'heading') {
      // 标题层级比栈顶浅，则回退栈到对应层级
      while (stack.length > 1 && token.depth <= current.depth) {
        stack.pop();
        current = stack[stack.length - 1]
      }
      const newNode = { name: this.getUnformattedText(token), children: [] ,type:'heading'};
      current.node.children.push(newNode);
      stack.push({ node: newNode, depth: token.depth });
    } else if (token.type === 'list') {
      // 处理列表（可能包含多级嵌套）
      const listNodes = this.processList(token.items);
      if(index && filteredTokens[index-1].type === 'paragraph'){
        if (current.node.type === 'paragraph') {
          stack.pop();
        }
        stack.push({ node: current.node.children.at(-1), depth: 100 });
        current = stack[stack.length - 1];
        // current.node.children.at(-1).hasList = true;
        // current.node.children.at(-1).listText = token.raw;
        // current.node.children.at(-1).listStart = token.start;
        // current.node.children.at(-1).ordered = token.ordered;
        // current.node.children.at(-1).children.push(...listNodes)
      }
      current.node.hasList = true;
      current.node.listText = token.raw;
      current.node.listStart = token.start;
      current.node.ordered = token.ordered;
      current.node.children.push(...listNodes);
      
    } else {
      if (token.type === 'paragraph' && current.node.type === 'paragraph') {
        stack.pop();
        current = stack[stack.length - 1];
      }
      current.node.children.push({ name: token.raw, raw: token.raw, children: [] ,type:token.type});
    }
  });
  return root;
}
  static markdown2AST(markdown){
    let tokens = marked.lexer(markdown)
    // MNUtil.copy(tokens)
    return this.buildTree(tokens)
  }
static  containsMathFormula(markdownText) {
    // 正则表达式匹配单美元符号包裹的公式
    const inlineMathRegex = /\$[^$]+\$/;
    // 正则表达式匹配双美元符号包裹的公式
    const blockMathRegex = /\$\$[^$]+\$\$/;
    // 检查是否包含单美元或双美元符号包裹的公式
    return inlineMathRegex.test(markdownText) || blockMathRegex.test(markdownText);
}
static  containsUrl(markdownText) {
    // 正则表达式匹配常见的网址格式
    const urlPattern = /https?:\/\/[^\s]+|www\.[^\s]+/i;
    
    // 使用正则表达式测试文本
    return urlPattern.test(markdownText);
}

static removeMarkdownFormat(markdownStr) {
  return markdownStr
    // 移除加粗 ** ** 和 __ __
    .replace(/\*\*(\S(.*?\S)?)\*\*/g, '$1')
    .replace(/__(\S(.*?\S)?)__/g, '$1')
    // 移除斜体 * * 和 _ _
    .replace(/\*(\S(.*?\S)?)\*/g, '$1')
    .replace(/_(\S(.*?\S)?)_/g, '$1')
    // 移除删除线 ~~ ~~
    .replace(/~~(\S(.*?\S)?)~~/g, '$1')
    // 移除内联代码 ` `
    .replace(/`([^`]+)`/g, '$1')
    // 移除链接 [text](url)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // 移除图片 ![alt](url)
    .replace(/!\[([^\]]+)\]\([^)]+\)/g, '$1')
    // 移除标题 # 和 ##
    .replace(/^#{1,6}\s+/gm, '')
    // 移除部分列表符号（*、-、+.）
    .replace(/^[\s\t]*([-*+]\.)\s+/gm, '')
    // 移除块引用 >
    .replace(/^>\s+/gm, '')
    // 移除水平线 ---
    .replace(/^[-*]{3,}/gm, '')
    // 移除HTML标签（简单处理）
    .replace(/<[^>]+>/g, '')
    // 合并多个空行
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
static getConfig(text){
  let hasMathFormula = this.containsMathFormula(text)
  if (hasMathFormula) {//存在公式内容
    if (/\:/.test(text)) {
      let splitedText = text.split(":")
      //冒号前有公式,则直接不设置标题,只设置excerpt且开启markdown
      if (this.containsMathFormula(splitedText[0])) {
        let config = {excerptText:text,excerptTextMarkdown:true}
        return config
      }
      //冒号前无公式,冒号后有公式
      if (this.containsMathFormula(splitedText[1])) {
        let config = {title:splitedText[0],excerptText:splitedText[1],excerptTextMarkdown:true}
        return config
      }
      let config = {title:splitedText[0],excerptText:splitedText[1]}
      return config
    }
    if (/\：/.test(text)) {
      let splitedText = text.split("：")
      //冒号前有公式,则直接不设置标题,只设置excerpt且开启markdown
      if (this.containsMathFormula(splitedText[0])) {
        let config = {excerptText:text,excerptTextMarkdown:true}
        return config
      }
      //冒号前无公式,冒号后有公式
      if (this.containsMathFormula(splitedText[1])) {
        let config = {title:splitedText[0],excerptText:splitedText[1],excerptTextMarkdown:true}
        return config
      }
      let config = {title:splitedText[0],excerptText:splitedText[1]}
      return config
    }
    
    let config = {excerptText:text,excerptTextMarkdown:true}
    return config
  }
  if (this.containsUrl(text)) {
    let config = {excerptText:text,excerptTextMarkdown:true}
    return config
  }
    if (/\:/.test(text)) {
      let splitedText = text.split(":")
      if (splitedText[0].length > 50) {
        let config = {excerptText:text}
        return config
      }
      let config = {title:splitedText[0],excerptText:splitedText[1]}
      return config
    }
    if (/\：/.test(text)) {
      let splitedText = text.split("：")
      if (splitedText[0].length > 50) {
        let config = {excerptText:text}
        return config
      }
      let config = {title:splitedText[0],excerptText:splitedText[1]}
      return config
    }
  if (text.length > 50) {
    return {excerptText:text}
  }
  return {title:text}
}
/**
 * 
 * @param {MNNote} note 
 * @param {Object} ast 
 */
static AST2Mindmap(note,ast,level = "all") {
try {
  if (ast.children && ast.children.length) {
    let hasList = ast.hasList
    let listOrdered = ast.listOrdered || ast.ordered
    ast.children.forEach((c,index)=>{
      if (c.type === 'hr') {
        return
      }
      let text = this.removeMarkdownFormat(c.name)
      // let text = c.name
      if (text.endsWith(":") || text.endsWith("：")) {
        text = text.slice(0,-1)
      }
      let config = this.getConfig(text)
      if ((text.startsWith('$') && text.endsWith('$')) || /\:/.test(text) || /：/.test(text)) {

      }else{
        if (c.children.length === 1 && !(/\:/.test(c.children[0].name) || /：/.test(c.children[0].name))) {
          if (text.endsWith(":") || text.endsWith("：")) {
            config = {excerptText:text+"\n"+c.children[0].name}
          }else{
            config = {title:text,excerptText:c.children[0].name}
          }
          let childNote = note.createChildNote(config)
          if (c.children[0].children.length) {
            this.AST2Mindmap(childNote,c.children[0])
          }
          return
        }
        if (c.children.length > 1 && c.children[0].type === 'paragraph' && c.children[1].type === 'heading') {
          if (text.endsWith(":") || text.endsWith("：")) {
            config = {excerptText:text+"\n"+c.children[0].name}
          }else{
            config = {title:text,excerptText:c.children[0].name}
          }
          c.children.shift()
        }
      }
      if (hasList && listOrdered) {
        if (ast.listStart == 0) {
          ast.listStart = 1
        }
        if (config.title) {
          config.title = (ast.listStart+index)+". "+config.title
        }else{
          config.excerptText = (ast.listStart+index)+". "+config.excerptText
        }
      }
      // MNUtil.showHUD("message")
      //继续创建子节点
      let childNote = note.createChildNote(config)
      this.AST2Mindmap(childNote,c)
    })
  }else{
    // MNUtil.showHUD("No children found")
  }
  } catch (error) {
  this.addErrorLog(error, "AST2Mindmap")
}
}
static hasBackLink(from,to){
  let fromNote = MNNote.new(from)
  let targetNote = MNNote.new(to)//链接到的卡片
  if (targetNote.linkedNotes && targetNote.linkedNotes.length > 0) {
    if (targetNote.linkedNotes.some(n=>n.noteid === fromNote.noteId)) {
      return true
    }
  }
  return false
}
static extractMarginNoteLinks(text) {
    // 正则表达式匹配 marginnote4app://note/ 后面跟着的 UUID 格式的链接
    const regex = /marginnote4app:\/\/note\/[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}/gi;
    
    // 使用 match 方法提取所有符合正则表达式的链接
    const links = text.match(regex);
    
    // 如果找到匹配的链接，返回它们；否则返回空数组
    return links || [];
}

/**
 * 
 * @param {string|number} color 
 * @returns {number}
 */
static getColorIndex(color){
    if (typeof color === 'string') {
      let colorMap = {
        "LIGHTYELLOW":0,
        "LIGHTGREEN":1,
        "LIGHTBLUE":2,
        "LIGHTRED":3,
        "YELLOW":4,
        "GREEN":5,
        "BLUE":6,
        "RED":7,
        "ORANGE":8,
        "LIGHTORANGE":8,
        "DARKGREEN":9,
        "DARKBLUE":10,
        "DARKRED":11,
        "DEEPRED":11,
        "WHITE":12,
        "LIGHTGRAY":13,
        "DARKGRAY":14,
        "PURPLE":15,
        "LIGHTPURPLE":15,
      }
      // let colors  = ["LightYellow", "LightGreen", "LightBlue", "LightRed","Yellow", "Green", "Blue", "Red", "Orange", "DarkGreen","DarkBlue", "DeepRed", "White", "LightGray","DarkGray", "Purple"]
      let index = colorMap[color.toUpperCase()]
      if (index !== -1) {
        return index
      }
      return -1
    } else {
      return color
    }

  }
  /**
 * NSValue can't be read by JavaScriptCore, so we need to convert it to string.
 */
static NSValue2String(v) {
  return Database.transArrayToJSCompatible([v])[0]
}
  /**
   * 
   * @param {string} str 
   * @returns {CGRect}
   */
  static CGRectString2CGRect(str) {
  const arr = str.match(/\d+\.?\d+/g).map(k => Number(k))
  return {
    x: arr[0],
    y: arr[1],
    height: arr[2],
    width: arr[3]
  }
}
  /**
   * 
   * @param {number} pageNo 
   * @returns {string}
   */
  static getPageContent(pageNo) {
  const { document } = this.currentDocController
  if (!document) return ""
  const data = document.textContentsForPageNo(pageNo)
  if (!data?.length) return ""
  return data
    .reduce((acc, cur) => {
      const line = cur.reduce((a, c) => {
        a += String.fromCharCode(Number(c.char))
        return a
      }, "")
      if (line) {
        const { y } = this.CGRectString2CGRect(this.NSValue2String(cur[0].rect))
        acc.push({
          y,
          line
        })
      }
      return acc
    }, [])
    .sort((a, b) => b.y - a.y)
    .map(k => k.line)
    .join(" ")
    .trim()
}
}

class MNConnection{
  static genURL(url) {
    return NSURL.URLWithString(url)
  }
  // static requestWithURL(url){
  //   return NSURLRequest.requestWithURL(NSURL.URLWithString(url))
  // }
  static requestWithURL(url){
    return NSMutableURLRequest.requestWithURL(NSURL.URLWithString(url))
  }
  /**
   * Loads a URL request into a web view.
   * 
   * This method loads the specified URL into the provided web view. It creates an NSURLRequest object
   * from the given URL and then instructs the web view to load this request.
   * 
   * @param {UIWebView} webview - The web view into which the URL should be loaded.
   * @param {string} url - The URL to be loaded into the web view.
   */
  static loadRequest(webview,url,desktop){
    if (desktop !== undefined) {
      if (desktop) {
        webview.customUserAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15'
      }else{
        webview.customUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
      }
    }
    webview.loadRequest(NSURLRequest.requestWithURL(NSURL.URLWithString(url)));
  }
  /**
   * 
   * @param {UIWebView} webview 
   * @param {string} fileURL
   * @param {string} baseURL 
   */
  static loadFile(webview,file,baseURL){
    webview.loadFileURLAllowingReadAccessToURL(
      NSURL.fileURLWithPath(file),
      NSURL.fileURLWithPath(baseURL)
    )
  }
  /**
   * 
   * @param {UIWebView} webview 
   * @param {string} html
   * @param {string} baseURL 
   */
  static loadHTML(webview,html,baseURL){
    webview.loadHTMLStringBaseURL(
      html,
      NSURL.fileURLWithPath(baseURL)
    )
  }
  /**
   * Initializes an HTTP request with the specified URL and options.
   * 
   * This method creates an NSMutableURLRequest object with the given URL and sets the HTTP method, timeout interval, and headers.
   * It also handles query parameters, request body, form data, and JSON payloads based on the provided options.
   * 
   * @param {string} url - The URL for the HTTP request.
   * @param {Object} options - The options for the HTTP request.
   * @param {string} [options.method="GET"] - The HTTP method (e.g., "GET", "POST").
   * @param {number} [options.timeout=10] - The timeout interval for the request in seconds.
   * @param {Object} [options.headers] - Additional headers to include in the request.
   * @param {Object} [options.search] - Query parameters to append to the URL.
   * @param {string} [options.body] - The request body as a string.
   * @param {Object} [options.form] - Form data to include in the request body.
   * @param {Object} [options.json] - JSON data to include in the request body.
   * @returns {NSMutableURLRequest} The initialized NSMutableURLRequest object.
   */
  static initRequest(url,options) {
    const request = this.requestWithURL(url)
    request.setHTTPMethod(options.method ?? "GET")
    request.setTimeoutInterval(options.timeout ?? 10)
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15",
      "Content-Type": "application/json",
      Accept: "application/json"
    }
    request.setAllHTTPHeaderFields({
      ...headers,
      ...(options.headers ?? {})
    })
    if (options.search) {
      request.setURL(
        this.genNSURL(
          `${url.trim()}?${Object.entries(options.search).reduce((acc, cur) => {
            const [key, value] = cur
            return `${acc ? acc + "&" : ""}${key}=${encodeURIComponent(value)}`
          }, "")}`
        )
      )
    } else if (options.body) {
      request.setHTTPBody(NSData.dataWithStringEncoding(options.body, 4))
    } else if (options.form) {
      request.setHTTPBody(
        NSData.dataWithStringEncoding(
          Object.entries(options.form).reduce((acc, cur) => {
            const [key, value] = cur
            return `${acc ? acc + "&" : ""}${key}=${encodeURIComponent(value)}`
          }, ""),
          4
        )
      )
    } else if (options.json) {
      request.setHTTPBody(
        NSJSONSerialization.dataWithJSONObjectOptions(
          options.json,
          1
        )
      )
    }
    return request
  }
  /**
   * Sends an HTTP request asynchronously and returns the response data.
   * 
   * This method sends the specified HTTP request asynchronously using NSURLConnection. It returns a promise that resolves with the response data if the request is successful,
   * or with an error object if the request fails. The error object includes details such as the status code and error message.
   * 
   * @param {NSMutableURLRequest} request - The HTTP request to be sent.
   * @returns {Promise<Object>} A promise that resolves with the response data or an error object.
   */
  static async sendRequest(request){
    // MNUtil.copy("sendRequest")
    const queue = NSOperationQueue.mainQueue()
    return new Promise((resolve, reject) => {
      NSURLConnection.sendAsynchronousRequestQueueCompletionHandler(
        request,
        queue,
        (res, data, err) => {
          const result = NSJSONSerialization.JSONObjectWithDataOptions(
            data,
            1<<0
          )
          const validJson = NSJSONSerialization.isValidJSONObject(result)
          if (err.localizedDescription){
            MNUtil.showHUD(err.localizedDescription)
            let error = {error:err.localizedDescription}
            if (validJson) {
              error.data = result
            }
            resolve(error)
          }
          if (res.statusCode() === 200) {
            // MNUtil.showHUD("OCR success")
          }else{
            let error = {statusCode:res.statusCode()}
            if (validJson) {
              error.data = result
            }
            resolve(error)
            // MNUtil.showHUD("Error in OCR")
          }
          if (validJson){
            resolve(result)
          }else{
            resolve(data)
          }
        }
      )
  })
  }
  /**
   * Fetches data from a specified URL with optional request options.
   * 
   * This method initializes a request with the provided URL and options, then sends the request asynchronously.
   * It returns a promise that resolves with the response data or an error object if the request fails.
   * 
   * @param {string} url - The URL to fetch data from.
   * @param {Object} [options={}] - Optional request options.
   * @param {string} [options.method="GET"] - The HTTP method to use for the request.
   * @param {number} [options.timeout=10] - The timeout interval for the request in seconds.
   * @param {Object} [options.headers={}] - Additional headers to include in the request.
   * @param {Object} [options.search] - Query parameters to append to the URL.
   * @param {string} [options.body] - The body of the request for POST, PUT, etc.
   * @param {Object} [options.form] - Form data to include in the request body.
   * @param {Object} [options.json] - JSON data to include in the request body.
   * @returns {Promise<Object|Error>} A promise that resolves with the response data or an error object.
   */
  static async fetch (url,options = {}){
    const request = this.initRequest(url, options)
    // MNUtil.copy(typeof request)
    const res = await this.sendRequest(request)
    return res
  }
  /**
   * Encodes a string to Base64.
   * 
   * This method encodes the provided string to a Base64 representation using the CryptoJS library.
   * It first parses the string into a WordArray and then converts this WordArray to a Base64 string.
   * 
   * @param {string} str - The string to be encoded to Base64.
   * @returns {string} The Base64 encoded string.
   */
  static btoa(str) {
      // Encode the string to a WordArray
      const wordArray = CryptoJS.enc.Utf8.parse(str);
      // Convert the WordArray to Base64
      const base64 = CryptoJS.enc.Base64.stringify(wordArray);
      return base64;
  }
  /**
   * Reads a file from a WebDAV server using the provided URL, username, and password.
   * 
   * This method sends a GET request to the specified WebDAV URL with the provided username and password for authentication.
   * It returns a promise that resolves with the response data if the request is successful, or with an error object if the request fails.
   * 
   * @param {string} url - The URL of the file on the WebDAV server.
   * @param {string} username - The username for authentication.
   * @param {string} password - The password for authentication.
   * @returns {Promise<Object>} A promise that resolves with the response data or an error object.
   */
static async readWebDAVFile(url, username, password) {
    const headers = {
      Authorization:'Basic ' + this.btoa(username + ':' + password),
      "Cache-Control": "no-cache"
      };
        const response = await this.fetch(url, {
            method: 'GET',
            headers: headers
        });
    return response
}

  /**
   * Reads a file from a WebDAV server using the provided URL, username, and password.
   * 
   * This method sends a GET request to the specified WebDAV URL with the provided username and password for authentication.
   * It returns a promise that resolves with the response data if the request is successful, or with an error object if the request fails.
   * 
   * @param {string} url - The URL of the file on the WebDAV server.
   * @param {string} username - The username for authentication.
   * @param {string} password - The password for authentication.
   * @returns {NSURLConnection} A promise that resolves with the response data or an error object.
   */
static readWebDAVFileWithDelegate(url, username, password) {
    const headers = {
      Authorization:'Basic ' + this.btoa(username + ':' + password),
      "Cache-Control": "no-cache"
      };
      const request = this.initRequest(url, {
            method: 'GET',
            headers: headers
        })
    return request
}
/**
 * Uploads a file to a WebDAV server using the provided URL, username, password, and file content.
 * 
 * This method sends a PUT request to the specified WebDAV URL with the provided username and password for authentication.
 * The file content is included in the request body. It returns a promise that resolves with the response data if the request is successful,
 * or with an error object if the request fails.
 * 
 * @param {string} url - The URL of the file on the WebDAV server.
 * @param {string} username - The username for authentication.
 * @param {string} password - The password for authentication.
 * @param {string} fileContent - The content of the file to be uploaded.
 * @returns {Promise<Object>} A promise that resolves with the response data or an error object.
 */
static async uploadWebDAVFile(url, username, password, fileContent) {
    const headers = {
      Authorization:'Basic ' + this.btoa(username + ':' + password),
      "Content-Type":'application/octet-stream'
    };
    const response = await this.fetch(url, {
        method: 'PUT',
        headers: headers,
        body: fileContent
    });
    return response
}
  static getOnlineImage(url,scale=3){
    MNUtil.showHUD("Downloading image")
    let imageData = NSData.dataWithContentsOfURL(MNUtil.genNSURL(url))
    if (imageData) {
      MNUtil.showHUD("Download success")
      return UIImage.imageWithDataScale(imageData,scale)
    }
    MNUtil.showHUD("Download failed")
    return undefined
  }
/**
 * Initializes a request for ChatGPT using the provided configuration.
 * 
 * @param {Array} history - An array of messages to be included in the request.
 * @param {string} apikey - The API key for authentication.
 * @param {string} url - The URL endpoint for the API request.
 * @param {string} model - The model to be used for the request.
 * @param {number} temperature - The temperature parameter for the request.
 * @param {Array<number>} funcIndices - An array of function indices to be included in the request.
 * @throws {Error} If the API key is empty or if there is an error during the request initialization.
 */
static initRequestForChatGPT (history,apikey,url,model,temperature,funcIndices=[]) {
  if (apikey.trim() === "") {
    MNUtil.showHUD(model+": No apikey!")
    return
  }
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer "+apikey,
    Accept: "text/event-stream"
  }
    // copyJSON(headers)
  let body = {
    "model":model,
    "messages":history,
    "stream":true
  }
  // if (model !== "deepseek-reasoner") {
    body.temperature = temperature
    // if (url === "https://api.minimax.chat/v1/text/chatcompletion_v2") {
    //   let tools = chatAITool.getToolsByIndex(funcIndices,true)
    //   if (tools.length) {
    //     body.tools = tools
    //   }
    //   body.max_tokens = 8000
    // }else{
    //   let tools = chatAITool.getToolsByIndex(funcIndices,false)
    //   if (tools.length) {
    //     body.tools = tools
    //     body.tool_choice = "auto"
    //   }
    // }
  const request = MNConnection.initRequest(url, {
      method: "POST",
      headers: headers,
      timeout: 60,
      json: body
    })
  return request
}
/**
 * Initializes a request for ChatGPT using the provided configuration.
 * 
 * @param {Array} history - An array of messages to be included in the request.
 * @param {string} apikey - The API key for authentication.
 * @param {string} url - The URL endpoint for the API request.
 * @param {string} model - The model to be used for the request.
 * @param {number} temperature - The temperature parameter for the request.
 * @param {Array<number>} funcIndices - An array of function indices to be included in the request.
 * @throws {Error} If the API key is empty or if there is an error during the request initialization.
 */
static initRequestForChatGPTWithoutStream (history,apikey,url,model,temperature,funcIndices=[]) {
  if (apikey.trim() === "") {
    MNUtil.showHUD(model+": No apikey!")
    return
  }
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer "+apikey,
    Accept: "text/event-stream"
  }
    // copyJSON(headers)
  let body = {
    "model":model,
    "messages":history
  }
  // if (model !== "deepseek-reasoner") {
    body.temperature = temperature
    // if (url === "https://api.minimax.chat/v1/text/chatcompletion_v2") {
    //   let tools = chatAITool.getToolsByIndex(funcIndices,true)
    //   if (tools.length) {
    //     body.tools = tools
    //   }
    //   body.max_tokens = 8000
    // }else{
    //   let tools = chatAITool.getToolsByIndex(funcIndices,false)
    //   if (tools.length) {
    //     body.tools = tools
    //     body.tool_choice = "auto"
    //   }
    // }
  const request = MNConnection.initRequest(url, {
      method: "POST",
      headers: headers,
      timeout: 60,
      json: body
    })
  return request
}

}
class MNButton{
  static get highlightColor(){
    return UIColor.blendedColor(
      UIColor.colorWithHexString("#2c4d81").colorWithAlphaComponent(0.8),
      MNUtil.app.defaultTextColor,
      0.8
    );
  }
  /**
   *
   * @param {{color:string,title:string,bold:boolean,font:number,opacity:number,radius:number}} config
   * @param {UIView} superView
   */
  static new(config = {},superView){
    return new MNButton(config,superView)
    // let newButton = UIButton.buttonWithType(0);
    // newButton.autoresizingMask = (1 << 0 | 1 << 3);
    // newButton.layer.masksToBounds = true;
    // newButton.setTitleColorForState(UIColor.whiteColor(),0);
    // newButton.setTitleColorForState(this.highlightColor, 1);
    // let radius = ("radius" in config) ? config.radius : 8
    // newButton.layer.cornerRadius = radius;
    // this.setConfig(newButton, config)
    // if (superView) {
    //   superView.addSubview(newButton)
    // }
    // return newButton
  }
  static builtInProperty = [
    "superview",
    "frame",
    "bounds",
    "center",
    "window",
    "gestureRecognizers",
    "backgroundColor",
    "color",
    "hidden",
    "autoresizingMask",
    "currentTitle",
    "currentTitleColor",
    "currentImage",
    "subviews",
    "masksToBounds",
    "title",
    "alpha",
    "font",
    "opacity",
    "radius",
    "cornerRadius",
    "highlight"
  ]
  constructor(config = {},superView){
    this.button = UIButton.buttonWithType(0);
    this.button.autoresizingMask = (1 << 0 | 1 << 3);
    this.button.layer.masksToBounds = true;
    this.button.setTitleColorForState(UIColor.whiteColor(),0);
    this.button.setTitleColorForState(this.highlightColor, 1);
    let radius = ("radius" in config) ? config.radius : 8
    this.button.layer.cornerRadius = radius;
    MNButton.setConfig(this.button, config)
    this.titleLabel = this.button.titleLabel
    if (superView) {
      superView.addSubview(this.button)
    }
    let keys = Object.keys(config)
    for (let i = 0; i < keys.length; i++) {
      if (!MNButton.builtInProperty.includes(keys[i])) {
        this.button[keys[i]] = config[keys[i]]
        this[keys[i]] = config[keys[i]]
      }
    }
    return new Proxy(this, {
      set(target, property, value) {
        target[property] = value;
        if (!MNButton.builtInProperty.includes(property)) {
          target.button[property] = value
        }
        return true;
      }
    });
  }
  /**
   * @param {UIView} view
   */
  set superview(view){
    view.addSubview(this.button)
  }
  get superview(){
    return this.button.superview
  }
  /**
   * @param {CGRect} targetFrame
   */
  set frame(targetFrame){
    this.button.frame = targetFrame
  }
  get frame(){
    return this.button.frame
  }
  set bounds(targetFrame){
    this.button.bounds = targetFrame
  }
  get bounds(){
    return this.button.bounds
  }
  set center(targetFrame){
    this.button.center = targetFrame
  }
  get center(){
    return this.button.center
  }
  get window(){
    return this.button.window
  }
  get gestureRecognizers(){
    return this.button.gestureRecognizers
  }
  /**
   * 
   * @param {UIColor|string} color 
   */
  set backgroundColor(color){
    if (typeof color === "string") {
      if(color.length > 7){
        this.button.backgroundColor = MNButton.hexColor(color)
      }else{
        this.button.backgroundColor = MNButton.hexColorAlpha(color, 1.0)
      }
    }else{
      this.button.backgroundColor = color
    }
  }
  get backgroundColor(){
    return this.button.backgroundColor
  }
  /**
   * 
   * @param {UIColor|string} color 
   */
  set color(color){
    if (typeof color === "string") {
      if(color.length > 7){
        this.button.backgroundColor = MNButton.hexColor(color)
      }else{
        this.button.backgroundColor = MNButton.hexColorAlpha(color, 1.0)
      }
    }else{
      this.button.backgroundColor = color
    }
  }
  get color(){
    return this.button.backgroundColor
  }
  /**
   * 
   * @param {boolean} hidden 
   */
  set hidden(hidden){
    this.button.hidden = hidden
  }
  get hidden(){
    return this.button.hidden
  }
  /**
   * 
   * @param {number} mask 
   */
  set autoresizingMask(mask){
    this.button.autoresizingMask = mask
  }
  /**
   * 
   * @returns {number} 
   */
  get autoresizingMask(){
    return this.button.autoresizingMask
  }
  /**
   * 
   * @param {number} opacity 
   */
  set opacity(opacity){
    this.button.layer.opacity = opacity
  }
  get opacity(){
    return this.button.layer.opacity
  }
  /**
   * 
   * @param {number} radius 
   */
  set radius(radius){
    this.button.layer.cornerRadius = radius
  }
  /**
   * @returns {number}
   */
  get radius(){
    return this.button.layer.cornerRadius
  }
  /**
   * 
   * @param {number} radius 
   */
  set cornerRadius(radius){
    this.button.layer.cornerRadius = radius
  }
  get cornerRadius(){
    return this.button.layer.cornerRadius
  }
  /**
   * 
   * @param {string} title 
   */
  set currentTitle(title){
    this.button.setTitleForState(title,0)
  }
  get currentTitle(){
    return this.button.currentTitle
  }
  /**
   * 
   * @param {string} title 
   */
  set title(title){
    this.button.setTitleForState(title,0)
  }
  get title(){
    return this.button.currentTitle
  }
  /**
   * 
   * @param {string|UIColor} color 
   */
  set currentTitleColor(color){
    if (typeof color === "string") {
      if(color.length > 7){
        this.button.setTitleColorForState(MNButton.hexColor(color),0)
      }else{
        this.button.setTitleColorForState(MNButton.hexColorAlpha(color, 1.0),0)
      }
    }else{
      this.button.setTitleColorForState(color,0)
    }
  }
  get currentTitleColor(){
    return this.button.currentTitleColor
  }
  /**
   * 
   * @param {UIImage} image 
   */
  set currentImage(image){
    this.button.setImageForState(image,0)
  }
  get currentImage(){
    return this.button.currentImage
  }
  get subviews(){
    return this.button.subviews
  }
  /**
   * 
   * @param {UIFont} font 
   */
  set font(font){
    this.button.titleLabel.font = font
  }
  get font(){
    return this.button.titleLabel.font
  }
  /**
   * 
   * @param {boolean} masksToBounds 
   */
  set masksToBounds(masksToBounds){
    this.button.layer.masksToBounds = masksToBounds
  }
  /**
   * 
   * @returns {boolean}
   */
  get masksToBounds(){
    return this.button.layer.masksToBounds
  }
  /**
   * 
   * @param {number} x 
   * @param {number} y 
   * @param {number} width 
   * @param {number} height 
   */
  setFrame(x,y,width,height){
    let frame = this.button.frame
    if (x !== undefined) {
      frame.x = x
    }else if (this.button.x !== undefined) {
      frame.x = this.button.x
    }
    if (y !== undefined) {
      frame.y = y
    }else if (this.button.y !== undefined) {
      frame.y = this.button.y
    }
    if (width !== undefined) {
      frame.width = width
    }else if (this.button.width !== undefined) {
      frame.width = this.button.width
    }
    if (height !== undefined) {
      frame.height = height
    }else if (this.button.height !== undefined) {
      frame.height = this.button.height
    }
    this.button.frame = frame
  }
  /**
   * 
   * @param {string} hexColor 
   * @param {number} [alpha=1.0] 
   */
  setColor(hexColor,alpha = 1.0){
    if(hexColor.length > 7){
      this.button.backgroundColor = MNButton.hexColor(hexColor)
    }else{
      this.button.backgroundColor = MNButton.hexColorAlpha(hexColor, alpha)
    }
  }
  setImageForState(image,state = 0){
    this.button.setImageForState(image,state)
  }
  setImage(image,state = 0){
    this.button.setImageForState(image,state)
  }
  setTitleColorForState(color,state = 0){
    this.button.setTitleColorForState(color,state)
  }
  setTitleColor(color,state = 0){
    this.button.setTitleColorForState(color,state)
  }
  setTitleForState(title,state = 0){
    this.button.setTitleForState(title,state)
  }
  setTitle(title,state = 0){
    this.button.setTitleForState(title,state)
  }
  addSubview(view){
    this.button.addSubview(view)
  }
  removeFromSuperview(){this.button.removeFromSuperview()}
  bringSubviewToFront(view){this.button.bringSubviewToFront(view)}
  sendSubviewToBack(view){this.button.sendSubviewToBack(view)}
  isDescendantOfView(view){return this.button.isDescendantOfView(view)}
  isDescendantOfStudyView(){return this.button.isDescendantOfView(MNUtil.studyView)}
  isDescendantOfCurrentWindow(){return this.button.isDescendantOfView(MNUtil.currentWindow)}
  setNeedsLayout(){this.button.setNeedsLayout()}
  layoutIfNeeded(){this.button.layoutIfNeeded()}
  layoutSubviews(){this.button.layoutSubviews()}
  setNeedsDisplay(){this.button.setNeedsDisplay()}
  sizeThatFits(size){
    return this.button.sizeThatFits(size)
  }

  /**
   * 
   * @param {any} target 
   * @param {UIControlEvents} controlEvent 
   * @param {string} action 
   */
  addTargetActionForControlEvents(target,action,controlEvent = 1 << 6){
    this.button.addTargetActionForControlEvents(target, action, controlEvent);
  }
  /**
   * 
   * @param {any} target 
   * @param {UIControlEvents} controlEvent 
   * @param {string} action 
   */
  removeTargetActionForControlEvents(target,action,controlEvent = 1 << 6){
    this.button.removeTargetActionForControlEvents(target, action, controlEvent);
  }
  /**
   * 
   * @param {any} target 
   * @param {string} selector 
   */
  addClickAction (target,selector) {
    this.button.addTargetActionForControlEvents(target, selector, 1 << 6);
  }
  /**
   * 
   * @param {UIGestureRecognizer} gestureRecognizer 
   */
  addGestureRecognizer(gestureRecognizer){
    this.button.addGestureRecognizer(gestureRecognizer)
  }
  /**
   * 
   * @param {UIGestureRecognizer} gestureRecognizer 
   */
  removeGestureRecognizer(gestureRecognizer){
    this.button.removeGestureRecognizer(gestureRecognizer)
  }
  /**
   * 
   * @param {any} target 
   * @param {string} selector 
   */
  addPanGesture (target,selector) {
    let gestureRecognizer = new UIPanGestureRecognizer(target,selector)
    this.button.addGestureRecognizer(gestureRecognizer)
  }

  /**
   * 
   * @param {any} target 
   * @param {string} selector 
   */
  addLongPressGesture (target,selector,duration = 0.3) {
    let gestureRecognizer = new UILongPressGestureRecognizer(target,selector)
    gestureRecognizer.minimumPressDuration = duration
    this.button.addGestureRecognizer(gestureRecognizer)
  }
  /**
   * 
   * @param {any} target 
   * @param {string} selector 
   */
  addSwipeGesture (target,selector) {
    let gestureRecognizer = new UISwipeGestureRecognizer(target,selector)
    this.button.addGestureRecognizer(gestureRecognizer)
  }
//   static createButton(superview,config) {
//     let button = UIButton.buttonWithType(0);
//     button.autoresizingMask = (1 << 0 | 1 << 3);
//     button.setTitleColorForState(UIColor.whiteColor(),0);
//     button.setTitleColorForState(this.highlightColor, 1);
//     button.backgroundColor = this.hexColorAlpha("#9bb2d6",0.8)
//     button.layer.cornerRadius = 8;
//     button.layer.masksToBounds = true;
//     button.titleLabel.font = UIFont.systemFontOfSize(16);
//     if (superview) {
//       superview.addSubview(button)
//     }
//     this.setConfig(button, config)
//     return button
// }
  /**
   * Creates a color from a hex string with an optional alpha value.
   * 
   * This method takes a hex color string and an optional alpha value, and returns a UIColor object.
   * If the alpha value is not provided, the color is returned without modifying its alpha component.
   * 
   * @param {string} hex - The hex color string (e.g., "#RRGGBB").
   * @param {number} [alpha=1.0] - The alpha value (opacity) of the color, ranging from 0.0 to 1.0.
   * @returns {UIColor} The UIColor object representing the specified color with the given alpha value.
   */
  static hexColorAlpha(hex,alpha) {
    let color = UIColor.colorWithHexString(hex)
    return alpha!==undefined?color.colorWithAlphaComponent(alpha):color
  }
  /**
   * function to create a color from a hex string
   * @param {string} hex 
   * @returns {UIColor}
   */
  static hexColor(hex) {
    let colorObj = MNUtil.parseHexColor(hex)
    return this.hexColorAlpha(colorObj.color,colorObj.opacity)
  }
  /**
   * 
   * @param {UIButton} button 
   * @param {string} hexColor 
   * @param {number} [alpha=1.0] 
   */
  static setColor(button,hexColor,alpha = 1.0){
    if(hexColor.length > 7){
      button.backgroundColor = this.hexColor(hexColor)
    }else{
      button.backgroundColor = this.hexColorAlpha(hexColor, alpha)
    }
  }
  static setTitle(button,title,font = 16,bold= false){
    button.setTitleForState(title,0)
    if (bold) {
      button.titleLabel.font = UIFont.boldSystemFontOfSize(font)
    }else{
      button.titleLabel.font = UIFont.systemFontOfSize(font)
    }
  }
  /**
   *
   * @param {UIButton} button
   * @param {string|NSData} path
   */
  static setImage(button,path,scale){
    if (typeof path === "string") {
      button.setImageForState(MNUtil.getImage(path,scale),0)
    }else{
      button.setImageForState(path, 0)
    }
  }
  static setOpacity(button,opacity){
    button.layer.opacity = opacity


  }
  static setRadius(button,radius = 8){
    button.layer.cornerRadius = radius;
  }
/**
   * 设置按钮的配置
   *
   * @param {UIButton} button - 要设置配置的按钮对象
   * @param {{color: string, title: string, bold: boolean, font: number, opacity: number, radius: number, image?: string, scale?: number}} config - 配置对象
   */
  static setConfig(button, config) {
    if ("color" in config) {
      this.setColor(button, config.color, config.alpha);
    }
    if ("title" in config) {
      this.setTitle(button, config.title, config.font, config.bold);
    }
    if ("opacity" in config) {
      this.setOpacity(button, config.opacity);
    }
    if ("radius" in config) {
      this.setRadius(button, config.radius);
    }
    if ("image" in config) {
      this.setImage(button, config.image, config.scale);
    }
    if ("highlight" in config) {
      button.setTitleColorForState(config.highlight, 1)
    }
  }
  /**
   * 
   * @param {UIView} button 
   * @param {any} target 
   * @param {string} selector 
   */
  static addClickAction (button,target,selector) {
    button.addTargetActionForControlEvents(target, selector, 1 << 6);
    
  }
  /**
   * 
   * @param {UIView} button 
   * @param {any} target 
   * @param {string} selector 
   */
  static addPanGesture (button,target,selector) {
    let gestureRecognizer = new UIPanGestureRecognizer(target,selector)
    button.addGestureRecognizer(gestureRecognizer)
  }

  /**
   * 
   * @param {UIView} button 
   * @param {any} target 
   * @param {string} selector 
   */
  static addLongPressGesture (button,target,selector,duration = 0.3) {
    let gestureRecognizer = new UILongPressGestureRecognizer(target,selector)
    gestureRecognizer.minimumPressDuration = duration
    button.addGestureRecognizer(gestureRecognizer)
  }
  /**
   * 
   * @param {UIView} button 
   * @param {any} target 
   * @param {string} selector 
   */
  static addSwipeGesture (button,target,selector) {
    let gestureRecognizer = new UISwipeGestureRecognizer(target,selector)
    button.addGestureRecognizer(gestureRecognizer)
  }

}

class MNNote{
  /** @type {MbBookNote} */
  note
  /**
   * Initializes a new MNNote instance.
   * 
   * This constructor initializes a new MNNote instance based on the provided note object. The note object can be of various types:
   * - An MbBookNote instance.
   * - A string representing a note URL.
   * - A string representing a note ID.
   * - A configuration object for creating a new note.
   * 
   * If the note object is a string representing a note URL, the constructor will attempt to retrieve the corresponding note from the URL.
   * If the note object is a string representing a note ID, the constructor will attempt to retrieve the corresponding note from the database.
   * If the note object is a configuration object, the constructor will create a new note with the specified properties.
   * 
   * @param {MbBookNote|string|object} note - The note object to initialize the MNNote instance with.
   */
  constructor(note) {
    switch (MNUtil.typeOf(note)) {
      case 'MbBookNote':
        this.note = note
        break;
      case 'NoteURL':
        let NoteFromURL = MNUtil.getNoteBookById(MNUtil.getNoteIdByURL(note))
        if (NoteFromURL) {
          this.note = NoteFromURL
        }
      case 'string':
        let targetNoteId = note.trim()
        let targetNote = MNUtil.getNoteById(targetNoteId)
        if (targetNote) {
          this.note = targetNote
        }
        // MNUtil.showHUD(this.note.noteId)
        break;
        // MNUtil.copyJSON(targetNoteId+":"+this.note.noteId)
      case "NoteConfig":
        let config = note
        let notebook = MNUtil.currentNotebook
        let title = config.title ?? ""
        let content = config.excerptText ?? config.content ?? ""
        let markdown = config.excerptTextMarkdown ?? config.markdown ?? false
        // MNUtil.showHUD("new note")
        // MNUtil.copyJSON(note)
        this.note = Note.createWithTitleNotebookDocument(title, notebook, MNUtil.currentDocController.document)
        if (content.trim()) {//excerptText参数优先级高于content
          this.note.excerptText = content.trim()
          if (markdown) {
            this.note.excerptTextMarkdown = true
            if (/!\[.*?\]\((data:image\/.*;base64,.*?)(\))/.test(config.excerptText)) {
              this.note.processMarkdownBase64Images()
            }
          }
        }
        if (config.inCurrentChildMap) {
          if (this.currentChildMap) {
            let child = MNNote.currentChildMap.createChildNote(config)
            return child
          }
        }
        if (config.color !== undefined) {
          this.note.colorIndex = MNUtil.getColorIndex(config.color)
        }
        if (config.colorIndex !== undefined) {
          this.note.colorIndex = config.colorIndex
        }
        if ("tags" in config && config.tags.length) {
          this.note.appendTextComment(config.tags.map(k => '#'+k.replace(/\s+/g, "_")).join(" "))
        }
        break;
      default:
        break;
    }
  }
  /**
   * Creates a new MNNote instance based on the provided note object.
   * 
   * This static method initializes a new MNNote instance based on the provided note object. The note object can be of various types:
   * - An MbBookNote instance.
   * - A string representing a note URL.
   * - A string representing a note ID.
   * - A configuration object for creating a new note.
   * 
   * If the note object is a string representing a note URL, the method will attempt to retrieve the corresponding note from the URL.
   * If the note object is a string representing a note ID, the method will attempt to retrieve the corresponding note from the database.
   * If the note object is a configuration object, the method will create a new note with the specified properties.
   * 
   * @param {MbBookNote|string|object} note - The note object to initialize the MNNote instance with.
   * @returns {MNNote|undefined} The initialized MNNote instance or undefined if the note object is invalid.
   */
  static new(note,alert = true){
    if (note === undefined) {
      return undefined
    }
    // MNUtil.showHUD(note)
    // let paramType = MNUtil.typeOf(note)
    // MNUtil.showHUD(paramType)
    switch (MNUtil.typeOf(note)) {
      case "MNNote":
        return note;//原地返回
      case 'MbBookNote':
        return new MNNote(note)
      case 'NoteURL':
        let NoteFromURL = MNUtil.getNoteById(MNUtil.getNoteIdByURL(note),alert)
        if (NoteFromURL) {
          return new MNNote(NoteFromURL)
        }
        return undefined
      case "NoteId":
        let NoteFromId = MNUtil.getNoteById(note,alert)
        if (NoteFromId) {
          return new MNNote(NoteFromId)
        }
        return undefined
      case 'string':
        let targetNoteId = note.trim()
        let targetNote = MNUtil.getNoteById(targetNoteId,alert)
        if (targetNote) {
          return new MNNote(targetNote)
        }
        return undefined
      case "NoteConfig":
        let config = note
        if (!MNUtil.currentDocController.document) {
          MNUtil.confirm("No document in studyset!", "学习集中没有文档！")
          return undefined
        }
        let newNote = new MNNote(config)
        return newNote
      default:
        return undefined
    }
  }

  get noteId() {
    return this.note.noteId
  }
  get id(){
    return this.note.noteId
  }
  get notebookId() {
    return this.note.notebookId
  }
  /**
   * 文档摘录和它在脑图对应的卡片具有不同的id,通过originNoteId可以获得文档摘录的id
   * 
   * @returns {string} The original note ID of the merged note.
   */
  get originNoteId(){
    return this.note.originNoteId
  }
  /**
   * 文档摘录和它在脑图对应的卡片具有不同的id,通过originNoteId可以获得文档摘录的id
   * 
   * @returns {MNNote} The original note ID of the merged note.
   */
  get originNote(){
    return MNNote.new(this.note.originNoteId)
  }
  /**
   * Retrieves the note ID of the main note in a group of merged notes.
   * 
   * This method returns the note ID of the main note in a group of merged notes. This is useful for identifying the primary note in a set of combined notes.
   * 
   * @returns {string} The note ID of the main note in the group of merged notes.
   */
  get groupNoteId(){
    return this.note.groupNoteId
  }
  get groupMode(){
    return this.note.groupMode
  }
  /**
   * Retrieves the child notes of the current note.
   * 
   * This method returns an array of MNNote instances representing the child notes of the current note. If the current note has no child notes, it returns an empty array.
   * 
   * @returns {MNNote[]} An array of MNNote instances representing the child notes.
   */
  get childNotes() {
    return this.note.childNotes?.map(k => new MNNote(k)) ?? []
  }
  /**
   * Retrieves the parent note of the current note.
   * 
   * This method returns an MNNote instance representing the parent note of the current note. If the current note has no parent note, it returns undefined.
   * 
   * @returns {MNNote|undefined} The parent note of the current note, or undefined if there is no parent note.
   */
  get parentNote() {
    return this.note.parentNote && new MNNote(this.note.parentNote)
  }
  get parentNoteId(){
    return this.note.parentNote?.noteId
  }
  /**
   * 
   * @param {MNNote|string|MbBookNote} note 
   */
  set parentNote(note){
    let parentNote = MNNote.new(note)
    parentNote.addAsChildNote(this)
  }
  /**
   * Retrieves the URL of the current note.
   * 
   * This method generates and returns the URL of the current note, which can be used to reference or share the note.
   * 
   * @returns {string} The URL of the current note.
   */
  get noteURL(){
    return MNUtil.version.version+'app://note/'+this.note.noteId
  }
  /**
   * Retrieves the child mind map note of the current note.
   * 
   * This method returns an MNNote instance representing the child mind map note of the current note. If the current note has no child mind map note, it returns undefined.
   * 
   * @returns {MNNote|undefined} The child mind map note of the current note, or undefined if there is no child mind map note.
   */
  get childMindMap(){
    if (this.note.childMindMap) {
      return MNNote.new(this.note.childMindMap)
    }
    return undefined
  }
  /**
   *
   * @returns {{descendant:MNNote[],treeIndex:number[][]}}
   */
  get descendantNodes() {
    const { childNotes } = this
    if (!childNotes.length) {
      return {
        descendant: [],
        treeIndex: []
      }
    } else {
      /**
       *
       * @param {MNNote[]} nodes
       * @param {number} level
       * @param {number[]} lastIndex
       * @param {{descendant:MNNote[],treeIndex:number[][]}} ret
       * @returns
       */
      function down(
        nodes,
        level = 0,
        lastIndex = [],
        ret = {
          descendant: [],
          treeIndex: []
        }
      ) {
        level++
        nodes.forEach((node, index) => {
          ret.descendant.push(node)
          lastIndex = lastIndex.slice(0, level - 1)
          lastIndex.push(index)
          ret.treeIndex.push(lastIndex)
          if (node.childNotes?.length) {
            down(node.childNotes, level, lastIndex, ret)
          }
        })
        return ret
      }
      return down(childNotes)
    }
  }
  get ancestorNodes() {
    /**
     *
     * @param {MNNote} node
     * @param {MNNote[]} ancestorNodes
     * @returns
     */
    function up(node, ancestorNodes) {
      if (node.note.parentNote) {
        const parentNode = new MNNote(node.note.parentNote)
        ancestorNodes = up(parentNode, [...ancestorNodes, parentNode])
      }
      return ancestorNodes
    }
    return up(this, [])
  }
  /**
   * Retrieves the notes associated with the current note.
   * 
   * This method returns an array of notes that are linked to the current note. It includes the current note itself and any notes that are linked through the comments.
   * 
   * @returns {MNNote[]} An array of MNNote instances representing the notes associated with the current note.
   */
  get notes() {
    return this.note.comments.reduce(
      (acc, cur) => {
        cur.type == "LinkNote" && acc.push(MNNote.new(cur.noteid))
        return acc
      },
      [this]
    )
  }
  /**
   * Retrieves the titles associated with the current note.
   * 
   * This method splits the note title by semicolons and returns an array of unique titles. If the note title is not defined, it returns an empty array.
   * 
   * @returns {string[]} An array of unique titles associated with the current note.
   */
  get titles() {
    return MNUtil.unique(this.note.noteTitle?.split(/\s*[;；]\s*/) ?? [], true)
  }
  /**
   * Sets the titles associated with the current note.
   * 
   * This method sets the titles associated with the current note by joining the provided array of titles with semicolons. If the excerpt text of the note is the same as the note title, it updates both the note title and the excerpt text.
   * 
   * @param {string[]} titles - The array of titles to set for the current note.
   */
  set titles(titles) {
    const newTitle = MNUtil.unique(titles, true).join("; ")
    if (this.note.excerptText === this.note.noteTitle) {
      this.note.noteTitle = newTitle
      this.note.excerptText = newTitle
    } else {
      this.note.noteTitle = newTitle
    }
  }
  get isOCR() {
    if (this.note.excerptPic?.paint) {
      return this.note.textFirst
    }
    return false
  }
  get textFirst() {
    return this.note.textFirst
  }
  get title() {
    return this.note.noteTitle ?? ""
  }
  get noteTitle() {
    return this.note.noteTitle ?? ""
  }
  /**
   *
   * @param {string} title
   * @returns
   */
  set title(title) {
    this.note.noteTitle = title
  }
  /**
   * set textFirst
   * @param {boolean} on
   * @returns
   */
  set textFirst(on){
    this.note.textFirst = on
  }
  /**
   *
   * @param {string} title
   * @returns
   */
  set noteTitle(title) {
    this.note.noteTitle = title
  }
  get excerptText(){
    return this.note.excerptText
  }
  get excerptTextMarkdown(){
    return this.note.excerptTextMarkdown;
  }
  set excerptTextMarkdown(status){
    this.note.excerptTextMarkdown = status
  }
  set excerptText(text){
    this.note.excerptText = text
    if (this.excerptPic && !this.textFirst) {
      this.textFirst = true
    }
  }
  get mainExcerptText() {
    return this.note.excerptText ?? ""
  }
  /**
   *
   * @param {string} text
   * @returns
   */
  set mainExcerptText(text) {
    this.note.excerptText = text
  }
  get excerptPic(){
    return this.note.excerptPic
  }
  get excerptPicData(){
    let imageData = MNUtil.getMediaByHash(this.note.excerptPic.paint)
    return imageData
  }
  get colorIndex(){
    return this.note.colorIndex
  }
  set colorIndex(index){
    this.note.colorIndex = index
  }
  /**
   * @param {string} color
   */
  set color(color){
    let colors  = ["LightYellow", "LightGreen", "LightBlue", "LightRed","Yellow", "Green", "Blue", "Red", "Orange", "DarkGreen","DarkBlue", "DeepRed", "White", "LightGray","DarkGray", "Purple"]
    let index = colors.indexOf(color)
    if (index === -1) {
      return
    }
    this.note.colorIndex = index
    return
  }
  get color(){
    let index = this.colorIndex
    let colors  = ["LightYellow", "LightGreen", "LightBlue", "LightRed","Yellow", "Green", "Blue", "Red", "Orange", "DarkGreen","DarkBlue", "DeepRed", "White", "LightGray","DarkGray", "Purple"]
    if (index === -1) {
      return ""
    }
    return colors[index]
  }
  get fillIndex(){
    return this.note.fillIndex
  }
  set fillIndex(index){
    this.note.fillIndex = index
  }
  get createDate(){
    return this.note.createDate
  }
  get modifiedDate(){
    return this.note.modifiedDate
  }
  get linkedNotes(){
    return this.note.linkedNotes
  }
  get summaryLinks(){
    return this.note.summaryLinks
  }
  get mediaList(){
    return this.note.mediaList
  }
  get image(){//第一个图片
    let imageData = MNNote.getImageFromNote(this,true)
    let image = imageData?UIImage.imageWithData(imageData):undefined
    return image
  }
  get imageData(){
    return MNNote.getImageFromNote(this,true)
  }
  get images(){//所有图片
    let imageDatas = MNNote.getImagesFromNote(this)
    let images = imageDatas?imageDatas.map(imageData=>UIImage.imageWithData(imageData)):undefined
    return images
  }
  get imageDatas(){//所有图片
    return MNNote.getImagesFromNote(this)
  }

  /**
   *
   * @returns {NoteComment[]}
   */
  get comments(){
    return this.note.comments
  }
  /**
   *
   * @returns {MNComment[]}
   */
  get MNComments(){
    return MNComment.from(this)
  }
  /**
   * get all tags, without '#'
   * @returns {string[]}
   */
  get tags() {
    try {
    // MNUtil.showHUD("length: "+this.note.comments.length)
    const tags = this.note.comments.reduce((acc, cur) => {
      // MNUtil.showHUD("cur.type")
      if (cur.type == "TextNote" && MNUtil._isTagComment_(cur)) {
        acc.push(...cur.text.split(/\s+/).filter(k => k.startsWith("#")))
      }
      return acc
    }, [])
    return tags.map(k => k.slice(1))
    } catch (error) {
      MNUtil.showHUD(error)
      return []
    }
  }
  /**
   * set tags, will remove all old tags
   *
   * @param {string[]} tags
   * @returns
   */
  set tags(tags) {
    this.tidyupTags()
    tags = MNUtil.unique(tags, true)
    const lastComment = this.note.comments[this.note.comments.length - 1]
    if (lastComment?.type == "TextNote" && lastComment.text.startsWith("#")) {
      this.note.removeCommentByIndex(this.note.comments.length - 1)
    }
    this.appendTextComments(tags.map(k => '#'+k).join(" "))
  }
  /**
   * @returns {{ocr:string[],html:string[],md:string[]}}
   */
  get excerptsTextPic() {
    return this.notes.reduce(
      (acc, cur) => {
        Object.entries(MNNote.getNoteExcerptTextPic(cur)).forEach(([k, v]) => {
          if (k in acc) acc[k].push(...v)
        })
        return acc
      },
      {
        ocr: [],
        html: [],
        md: []
      }
    )
  }
  /**
   * @returns {{html:string[],md:string[]}}
   */
  get commentsTextPic() {
    return this.note.comments.reduce(
      (acc, cur) => {
        if (cur.type === "PaintNote") {
          const imgs = MNNote.exportPic(cur)
          if (imgs)
            Object.entries(imgs).forEach(([k, v]) => {
              if (k in acc) acc[k].push(v)
            })
        } else if (cur.type == "TextNote" || cur.type == "HtmlNote") {
          const text = cur.text.trim()
          if (text && !text.includes("marginnote3app") && !text.startsWith("#"))
            Object.values(acc).map(k => k.push(text))
        }
        return acc
      },
      {
        html: [],
        md: []
      }
    )
  }
  /** @returns {string[]} */
 get excerptsText() {
    return this.notes.reduce((acc, note) => {
      const text = note.excerptText?.trim()
      if (text) {
        if (!note.excerptPic?.paint || this.isOCR) {
          acc.push(text)
        }
      }
      return acc
    }, [])
  }
  /**
   * get all comment text
   * @returns {string[]}
   */
  get commentsText() {
    return this.note.comments.reduce((acc, cur) => {
      if (cur.type == "TextNote" || cur.type == "HtmlNote") {
        const text = cur.text.trim()
        if (text && !text.includes("marginnote3app") && !text.startsWith("#"))
          acc.push(text)
      }
      return acc
    }, [])
  }
  /**
   * get all text and pic note will be OCR or be transformed to base64
   */
  get allTextPic() {
    const retVal = MNNote.getNoteExcerptTextPic(this.note)
    this.note.comments.forEach(k => {
      if (k.type === "PaintNote") {
        const imgs = MNNote.exportPic(k)
        if (imgs)
          Object.entries(imgs).forEach(([k, v]) => {
            if (k in retVal) retVal[k].push(v)
          })
      } else if (k.type == "TextNote" || k.type == "HtmlNote") {
        const text = k.text.trim()
        if (text) Object.values(retVal).map(k => k.push(text))
      } else if (k.type == "LinkNote") {
        const note = MNUtil.db.getNoteById(k.noteid)
        if (note)
          Object.entries(MNNote.getNoteExcerptTextPic(note)).forEach(([k, v]) => {
            if (k in retVal) retVal[k].push(...v)
          })
      }
    })
    return {
      html: retVal.html.join("\n\n"),
      ocr: retVal.ocr.join("\n\n"),
      md: retVal.md.join("\n\n")
    }
  }
  /**
   * Get all text
   */
  get allText() {

    const { mainExcerptText } = this
    const retVal =
      mainExcerptText && (!this.note.excerptPic?.paint || this.isOCR)
        ? [mainExcerptText]
        : []
    this.note.comments.forEach(k => {
      if (k.type == "TextNote" || k.type == "HtmlNote") {
        const text = k.text.trim()
        if (text) retVal.push(text)
      } else if (k.type == "LinkNote") {
        const note = MNUtil.db.getNoteById(k.noteid)
        const text = note?.excerptText?.trim()
        if (text && (!note?.excerptPic?.paint || this.isOCR)) retVal.push(text)
      }
    })
    return retVal.join("\n\n")
  }
  /**
   * Get all text.
   */
  get excerptsCommentsText() {
    const { mainExcerptText } = this
    const retVal =
      mainExcerptText && (!this.note.excerptPic?.paint || this.isOCR)
        ? [mainExcerptText]
        : []
    this.note.comments.forEach(k => {
      if (k.type == "TextNote" || k.type == "HtmlNote") {
        const text = k.text.trim()
        if (text && !text.includes("marginnote3app") && !text.includes("marginnote4app") && !text.startsWith("#"))
          retVal.push(text)
      } else if (k.type == "LinkNote") {
        const note = MNUtil.db.getNoteById(k.noteid)
        const text = note?.excerptText?.trim()
        if (text && (!note?.excerptPic?.paint || this.isOCR)) retVal.push(text)
      }
    })
    return retVal
  }
  get docMd5(){
    if (this.note.docMd5) {
      return this.note.docMd5
    }
    return undefined
  }
  config(opt={first:true}){
    return MNUtil.getNoteObject(this,opt)
  }
  /**
   * 当前卡片可能只是文档上的摘录，通过这个方法获取它在指定学习集下的卡片noteId
   * 与底层API不同的是，这里如果不提供nodebookid参数，则默认为当前学习集的nodebookid
   * @param {string} nodebookid
   * @returns {string}
   */
  realGroupNoteIdForTopicId(nodebookid = MNUtil.currentNotebookId){
    return this.note.realGroupNoteIdForTopicId(nodebookid)
  };
  /**
   * 当前卡片可能只是文档上的摘录，通过这个方法获取它在指定学习集下的卡片noteId
   * 与底层API不同的是，这里如果不提供nodebookid参数，则默认为当前学习集的nodebookid
   * @param {string} nodebookid
   * @returns {MNNote}
   */
  realGroupNoteForTopicId(nodebookid = MNUtil.currentNotebookId){
    let noteId = this.note.realGroupNoteIdForTopicId(nodebookid)
    if (!noteId) {
      return this.note
    }
    return MNNote.new(noteId)
  };
  processMarkdownBase64Images(){
    this.note.processMarkdownBase64Images();
  }
  allNoteText(){
    return this.note.allNoteText()
  }

  async getMDContent(withBase64 = false){
    let note = this.realGroupNoteForTopicId()
try {
  let title = (note.noteTitle && note.noteTitle.trim()) ? "# "+note.noteTitle.trim() : ""
  if (title.trim()) {
    title = title.split(";").filter(t=>{
      if (/{{.*}}/.test(t)) {
        return false
      }
      return true
    }).join(";")
  }
  let textFirst = note.textFirst
  let excerptText
  if (note.excerptPic && !textFirst) {
    if (withBase64) {
      excerptText = `[image](${MNUtil.getMediaByHash(note.excerptPic.paint).base64Encoding()})`
    }else{
      excerptText = ""
    }
  }else{
    excerptText = note.excerptText ?? ""
  }
  if (note.comments.length) {
    let comments = note.comments
    for (let i = 0; i < comments.length; i++) {
      const comment = comments[i];
      switch (comment.type) {
        case "TextNote":
          if (/^marginnote\dapp\:\/\//.test(comment.text)) {
            //do nothing
          }else{
            excerptText = excerptText+"\n"+comment.text
          }
          break;
        case "HtmlNote":
          excerptText = excerptText+"\n"+comment.text
          break
        case "LinkNote":
          if (withBase64 && comment.q_hpic  && comment.q_hpic.paint && !textFirst) {
            let imageData = MNUtil.getMediaByHash(comment.q_hpic.paint)
            let imageSize = UIImage.imageWithData(imageData).size
            if (imageSize.width === 1 && imageSize.height === 1) {
              if (comment.q_htext) {
                excerptText = excerptText+"\n"+comment.q_htext
              }
            }else{
              excerptText = excerptText+`\n[image](${imageData.base64Encoding()})`
            }
          }else{
            excerptText = excerptText+"\n"+comment.q_htext
          }
          break
        case "PaintNote":
          if (withBase64 && comment.paint){
            excerptText = excerptText+`\n[image](${MNUtil.getMediaByHash(comment.paint).base64Encoding()})`
          }
          break
        default:
          break;
      }
    }
  }
  // excerptText = (excerptText && excerptText.trim()) ? this.highlightEqualsContentReverse(excerptText) : ""
  let content = title+"\n"+excerptText
  return content
}catch(error){
  MNUtil.showHUD("Error in (getMDContent): "+error.toString())
  return ""
}
  }
  /**
   * 
   * @returns {MNNote}
   */
  paste(){
    this.note.paste()
    return this
  }

  /**
   * Merges the current note with another note.
   * 
   * This method merges the current note with another note. The note to be merged can be specified in various ways:
   * - An MbBookNote instance.
   * - An MNNote instance.
   * - A string representing a note URL.
   * - A string representing a note ID.
   * 
   * If the note to be merged is a string representing a note URL, the method will attempt to retrieve the corresponding note from the URL.
   * If the note to be merged is a string representing a note ID, the method will attempt to retrieve the corresponding note from the database.
   * 
   * @param {MbBookNote|MNNote|string} note - The note to be merged with the current note.
   * @returns {MNNote}
   */
  merge(note){
    switch (MNUtil.typeOf(note)) {
      case "MbBookNote":
        this.note.merge(note)
        break;
      case "MNNote":
        this.note.merge(note.note)
        break;
      case "NoteURL":
        let noteFromURL = MNUtil.getNoteById(MNUtil.getNoteIdByURL(note))
        if (noteFromURL) {
          this.note.merge(noteFromURL)
        }else{
          MNUtil.copy(note)
          MNUtil.showHUD("Note not exist!")
        }
      case "NoteId":
      case "string":
        let targetNote = MNUtil.getNoteById(note)
        if (targetNote) {
          this.note.merge(targetNote)
        }else{
          MNUtil.copy(note)
          MNUtil.showHUD("Note not exist!")
        }
        break
      default:
        break;
    }
    return this
  }
  /**
   * Remove from parent
   * 去除当前note的父关系(没用过不确定具体效果)
   * @returns {MNNote}
   */
  removeFromParent(){
    this.note.removeFromParent()
    return this
  }
  /**
   * 
   * @returns {MNNote}
   */
  insertChildBefore(){
    this.note.insertChildBefore()
    return this
  }
  /**
   * Deletes the current note, optionally including its descendant notes.
   * 
   * This method deletes the current note from the database. If the `withDescendant` parameter is set to `true`, it will also delete all descendant notes of the current note.
   * The deletion can be grouped within an undo operation if the `undoGrouping` parameter is set to `true`.
   * 
   * @param {boolean} [withDescendant=false] - Whether to delete the descendant notes along with the current note.
   * @param {boolean} [undoGrouping=false] - Whether to group the deletion within an undo operation.
   */
  delete(withDescendant = false){
    if (withDescendant) {
      MNUtil.db.deleteBookNoteTree(this.note.noteId)
    }else{
      MNUtil.db.deleteBookNote(this.note.noteId)
    }
  }
  /**
   * Adds a child note to the current note.
   * 
   * This method adds a child note to the current note. The child note can be specified as an MbBookNote instance, an MNNote instance, a note URL, or a note ID.
   * If the child note is specified as a note URL or a note ID, the method will attempt to retrieve the corresponding note from the database.
   * If the child note is specified as an MNNote instance, the method will add the underlying MbBookNote instance as a child.
   * 
   * @param {MbBookNote|MNNote|string} note - The child note to add to the current note.
   * @returns {MNNote} The current note.
   */
  addChild(note){
    try {

    // MNUtil.showHUD(MNUtil.typeOf(note))
    switch (MNUtil.typeOf(note)) {
      case "NoteURL":
        let noteFromURL = MNUtil.getNoteById(MNUtil.getNoteIdByURL(note))
        if (noteFromURL) {
          this.note.addChild(noteFromURL)
        }else{
          MNUtil.copy(note)
          MNUtil.showHUD("Note not exist!")
        }
        break;
      case "NoteId":
      case "string":
        let targetNote = MNUtil.getNoteById(note)
        if (targetNote) {
          this.note.addChild(targetNote)
        }else{
          MNUtil.copy(note)
          MNUtil.showHUD("Note not exist!")
        }
        break;
      case "MNNote":
        this.note.addChild(note.note)
        break;
      case "MbBookNote":
        this.note.addChild(note)
        break;
      default:
        MNUtil.showHUD("UNKNOWN Note")
        break;
    }
    return this
    } catch (error) {
      MNNote.addErrorLog(error, "addChild")
      return this
    }
  }
  /**
   * Adds a target note as a child note to the current note.
   * 
   * This method adds the specified target note as a child note to the current note. If the `colorInheritance` parameter is set to true, the target note will inherit the color of the current note.
   * The operation is wrapped within an undo grouping to allow for easy undo operations.
   * 
   * @param {MbBookNote|MNNote} targetNote - The note to be added as a child note.
   * @param {boolean} [colorInheritance=false] - Whether the target note should inherit the color of the current note.
   * @returns {MNNote} The current note.
   */
  addAsChildNote(targetNote,colorInheritance=false) {
    if (colorInheritance) {
      targetNote.colorIndex = this.note.colorIndex
    }
    this.addChild(targetNote)
    return this
  }
  /**
   * Adds the specified note as a sibling note to the current note.
   * 
   * This method adds the specified note as a sibling note to the current note. If the current note has no parent note, it displays a HUD message indicating that there is no parent note.
   * If the `colorInheritance` parameter is set to true, the color index of the target note is set to the color index of the current note.
   * 
   * @param {MbBookNote|MNNote} targetNote - The note to be added as a sibling.
   * @param {boolean} [colorInheritance=false] - Whether to inherit the color index from the current note.
   * @returns {MNNote} The current note.
   */
  addAsBrotherNote(targetNote,colorInheritance=false) {
    if (!this.note.parentNote) {
      MNUtil.showHUD("No parent note!")
      return
    }
    let parent = this.parentNote
    if (colorInheritance) {
      targetNote.colorIndex = this.note.colorIndex
    }
    parent.addChild(targetNote)
    return this
  }
  /**
   * Creates a child note for the current note based on the provided configuration.
   * 
   * This method creates a new child note for the current note using the specified configuration. If the current note is a document excerpt and not a mind map note,
   * it will create the child note under the corresponding mind map note in the current notebook. The method can optionally group the operation within an undo group.
   * 
   * @param {{title:String,excerptText:string,excerptTextMarkdown:boolean,content:string,markdown:boolean,color:number}} config - The configuration for the new child note.
   * @param {boolean} [undoGrouping=true] - Whether to group the operation within an undo group.
   * @returns {MNNote} The newly created child note.
   */
  createChildNote(config,undoGrouping=true) {
    let child
    let note = this
    let noteIdInMindmap = this.note.realGroupNoteIdForTopicId(MNUtil.currentNotebookId)
    if (noteIdInMindmap && this.noteId !== noteIdInMindmap) {
      //对文档摘录添加子节点是无效的，需要对其脑图中的节点执行添加子节点
      note = MNNote.new(noteIdInMindmap)
    }
    if (undoGrouping) {
      MNUtil.undoGrouping(()=>{
        try {
          child = MNNote.new(config)
          if (!child) {
            return
          }
          this.addChild(child)
        } catch (error) {
          MNUtil.showHUD("Error in createChildNote:"+error)
        }
      })
    }else{
      try {
        child = MNNote.new(config)
        if (!child) {
          return undefined
        }
        this.addChild(child)
      } catch (error) {
        MNUtil.showHUD("Error in createChildNote:"+error)
      }
    }
    return child
  }
  /**
   *
   * @param {{title:String,content:String,markdown:Boolean,color:Number}} config
   * @returns {MNNote}
   */
  createBrotherNote(config,undoGrouping=true) {
    let note = this
    let noteIdInMindmap = this.note.realGroupNoteIdForTopicId(MNUtil.currentNotebookId)
    if (noteIdInMindmap && this.noteId !== noteIdInMindmap) {
      //对文档摘录添加子节点是无效的，需要对其脑图中的节点执行添加子节点
      note = MNNote.new(noteIdInMindmap)
    }
    if (!note.parentNote) {
      MNUtil.showHUD("No parent note!")
      return
    }
    let child
    let parent = note.parentNote
    if (undoGrouping) {
      MNUtil.undoGrouping(()=>{
        child = MNNote.new(config)
        parent.addChild(child)
      })
    }else{
      child = MNNote.new(config)
      parent.addChild(child)
    }
    return child
  }
  /**
   * 支持检测摘录图片,markdown摘录中的MN图片,图片评论,合并的图片摘录
   * @returns {boolean}
   */
  hasImage(){
    let note = this
    if (note.excerptPic) {
      if (checkTextFirst && note.textFirst) {
        //检查发现图片已经转为文本，因此略过
      }else{
        return true
      }
    }else{
      let text = note.excerptText
      if (note.excerptTextMarkdown) {
        if (MNUtil.hasMNImages(text.trim())) {
          return true
        }
      }
    }
    if (note.comments.length) {
      let imageData = undefined
      for (let i = 0; i < note.comments.length; i++) {
        const comment = note.comments[i];
        if (comment.type === 'PaintNote' && comment.paint) {
          imageData = MNUtil.getMediaByHash(comment.paint)
          break
        }
        if (comment.type === "LinkNote" && comment.q_hpic && comment.q_hpic.paint) {
          imageData = MNUtil.getMediaByHash(comment.q_hpic.paint)
          break
        }

      }
      if (imageData) {
        return true
      }
    }
    return false
  }
  /**
   * Append text comments as much as you want.
   * @param {string[]} comments
   * @example
   * @returns {MNNote}
   * node.appendTextComments("a", "b", "c")
   */
  appendTextComments(...comments) {
    comments = MNUtil.unique(comments, true)
    const existComments = this.note.comments.filter(k => k.type === "TextNote")
    comments.forEach(comment => {
      if (
        comment &&
        existComments.every(k => k.type === "TextNote" && k.text !== comment)
      ) {
        this.note.appendTextComment(comment)
      }
    })
    return this
  }
  /**
   *
   * @param  {string} comment
   * @param  {number} index
   * @returns {MNNote}
   */
  appendMarkdownComment(comment,index=undefined){
    let validComment = comment && comment.trim()
    if (!validComment) {
      return this
    }
    try {
      this.note.appendMarkdownComment(comment)
    } catch (error) {
      this.note.appendTextComment(comment)
    }
    if (index !== undefined) {
      this.moveComment(this.note.comments.length-1, index,false)
    }
    return this
  }
  /**
   *
   * @param  {string} comment
   * @param  {number} index
   * @returns {MNNote}
   */
  replaceWithMarkdownComment(comment,index=undefined){
    if (index !== undefined) {
      this.removeCommentByIndex(index)
    }
    let validComment = comment && comment.trim()
    if (!validComment) {
      return this
    }
    try {
      this.note.appendMarkdownComment(comment)
    } catch (error) {
      this.note.appendTextComment(comment)
    }
    if (index !== undefined) {
      this.moveComment(this.note.comments.length-1, index,false)
    }
    return this
  }
  /**
   *
   * @param  {string} comment
   * @param  {number} index
   * @returns {MNNote}
   */
  appendTextComment(comment,index=undefined){
    let validComment = comment && comment.trim()
    if (!validComment) {
      return this
    }
    this.note.appendTextComment(comment)
    if (index !== undefined) {
      this.moveComment(this.note.comments.length-1, index,false)
    }
    return this
  }
  /**
   *
   * @param  {string} comment
   * @param  {number} index
   * @returns {MNNote}
   */
  replaceWithTextComment(comment,index=undefined){
    if (index !== undefined) {
      this.removeCommentByIndex(index)
    }
    let validComment = comment && comment.trim()
    if (!validComment) {
      return this
    }
    this.note.appendTextComment(comment)
    if (index !== undefined) {
      this.moveComment(this.note.comments.length-1, index,false)
    }
    return this
  }
  /**
   *
   * @param {string} html
   * @param {string} text
   * @param {CGSize} size
   * @param {string} tag
   * @param  {number} index
   * @returns {MNNote}
   */
  appendHtmlComment(html, text, size, tag, index = undefined){
    this.note.appendHtmlComment(html, text, size, tag)
    if (index !== undefined) {
      this.moveComment(this.note.comments.length-1, index)
    }
    return this
  }
  /**
   *
   * @param  {string[]} comments
   * @returns {MNNote}
   */
  appendMarkdownComments(...comments) {
    comments = unique(comments, true)
    const existComments = this.note.comments.filter(k => k.type === "TextNote")
    comments.forEach(comment => {
      if (
        comment &&
        existComments.every(k => k.type === "TextNote" && k.text !== comment)
      ) {
        if (this.note.appendMarkdownComment)
          this.note.appendMarkdownComment(comment)
        else this.note.appendTextComment(comment)
      }
    })
    return this
  }
  /**
   * 
   * @param {number[]} arr 
   * @returns {MNNote}
   */
  sortCommentsByNewIndices(arr){
    this.note.sortCommentsByNewIndices(arr)
    return this
  }
  /**
   * Moves a comment from one index to another within the note's comments array.
   * 
   * This method reorders the comments array by moving a comment from the specified `fromIndex` to the `toIndex`.
   * If the `fromIndex` or `toIndex` is out of bounds, it adjusts them to the nearest valid index.
   * If the `fromIndex` is the same as the `toIndex`, it does nothing and displays a message indicating no change.
   * 
   * @param {number} fromIndex - The current index of the comment to be moved.
   * @param {number} toIndex - The target index where the comment should be moved.
   * @returns {MNNote}
   */
  moveComment(fromIndex, toIndex,msg = false) {
  try {

    let length = this.comments.length;
    let arr = Array.from({ length: length }, (_, i) => i);
    let from = fromIndex
    let to = toIndex
    if (fromIndex < 0) {
      from = 0
    }
    if (fromIndex > (arr.length-1)) {
      from = arr.length-1
    }
    if (toIndex < 0) {
      to = 0
    }
    if (toIndex > (arr.length-1)) {
      to = arr.length-1
    }
    if (from == to) {
      if (msg) {
        MNUtil.showHUD("No change")
      }
      return
    }
    // 取出要移动的元素
    const element = arr.splice(to, 1)[0];
    // 将元素插入到目标位置
    arr.splice(from, 0, element);
    let targetArr = arr
    this.sortCommentsByNewIndices(targetArr)
    return this
    } catch (error) {
      MNNote.addErrorLog(error, "moveComment")
      return this
  }
  }
  /**
   * Moves a comment to a new position based on the specified action.
   * 
   * This method moves a comment from its current position to a new position based on the specified action.
   * The available actions are:
   * - "top": Moves the comment to the top of the list.
   * - "bottom": Moves the comment to the bottom of the list.
   * - "up": Moves the comment one position up in the list.
   * - "down": Moves the comment one position down in the list.
   * 
   * @param {number} fromIndex - The current index of the comment to be moved.
   * @param {string} action - The action to perform (top, bottom, up, down).
   * @returns {MNNote}
   */
  moveCommentByAction(fromIndex, action) {
    let targetIndex
    switch (action) {
      case "top":
        targetIndex = 0
        break;
      case "bottom":
        targetIndex = 100
        break;
      case "up":
        targetIndex = fromIndex-1
        break;
      case "down":
        targetIndex = fromIndex+1
        break;
      default:
        MNUtil.copy(action)
        MNUtil.showHUD("Invalid action!")
        return
    }
    this.moveComment(fromIndex, targetIndex)
    return this
  }
  /**
   * Retrieves the indices of comments that match the specified condition.
   * 
   * This method iterates through the comments of the current note and returns the indices of the comments that satisfy the given condition.
   * The condition can include filtering by comment type, inclusion or exclusion of specific text, or matching a regular expression.
   * 
   * @param {Object} condition - The condition to filter the comments.
   * @param {string[]} [condition.type] - The types of comments to include (e.g., "TextNote", "HtmlNote").
   * @param {string} [condition.include] - The text that must be included in the comment.
   * @param {string} [condition.exclude] - The text that must not be included in the comment.
   * @param {string} [condition.reg] - The regular expression that the comment must match.
   * @returns {number[]} An array of indices of the comments that match the condition.
   */
  getCommentIndicesByCondition(condition){
    let indices = []
    let types = []
    if ("type" in condition) {
      types = Array.isArray(condition.type) ? condition.type : [condition.type]
    }
    if ("types" in condition) {
      types = Array.isArray(condition.types) ? condition.types : [condition.types]
    }
    let excludeNoneTextComment = false
    if (condition.exclude || condition.include || condition.reg) {
      //提供特定参数时,不对非文字评论进行筛选
      excludeNoneTextComment = true
    }
    let noneTextCommentTypes = ["PaintNote","blankImageComment","mergedImageCommentWithDrawing","mergedImageComment"]
    this.note.comments.map((comment,commentIndex)=>{
      if (types.length && !MNComment.commentBelongsToType(comment, types)) {
        return
      }
      let newComment = MNComment.new(comment, commentIndex, this.note)
      if (excludeNoneTextComment && newComment.belongsToType(noneTextCommentTypes)) {
        //不对非文字评论进行筛选
        return
      }
      if (condition.include && !newComment.text.includes(condition.include)) {//指文字必须包含特定内容
        return
      }
      if (condition.exclude &&newComment.text.includes(condition.include)) {
        return
      }
      if (condition.reg) {
        let ptt = new RegExp(condition.reg,"g")
        if (!(ptt.test(comment.text))) {
          return
        }
      }
      indices.push(commentIndex)
    })
    return indices
  }
  /**
   * 夏大鱼羊定制 - MNNote - begin
   */

  /**
   * 判断卡片是否是文献卡片：论文和书作
   * 
   * 依据：是否有“文献信息：”的评论问
   * 注意：标题里带有“文献”二字的不一定，因为【文献：作者】暂时不需要判断为文献卡片
   */
  ifReferenceNote() {
    // return this.getHtmlCommentIndex("文献信息：") !== -1
    return this.title.startsWith("【文献") || this.title.startsWith("【参考文献")
  }
  
  /**
   * 判断是否是旧的文献卡片
   */
  ifOldReferenceNote() {
    return this.getHtmlCommentIndex("主要内容、摘要：") !== -1 || this.getHtmlCommentIndex("主要内容/摘要：") !== -1
  }

  /**
   * 卡片变成归类卡片信息汇总卡片
   */
  toBeClassificationInfoNote() {
    let classificationIdsArr = [
      {
        id: "3572E6DC-887A-4376-B715-04B6D8F0C58B",
        name: "学习规划"
      },
      {
        id: "E1EACEC5-3ACD-424B-BD46-797CD8A56629",
        name: "泛函分析与算子理论"
      },
      {
        id: "B27D8A02-BDC4-4D3F-908B-61AA19CBB861",
        name: "复分析"
      },
      {
        id: "13623BE8-8D26-4FEE-95D8-B704C34E92EC",
        name: "实分析与调和分析"
      },
      {
        id: "F6CE6E2C-4126-4945-BB98-F2437F73C806",
        name: "数学基础"
      },
      {
        id: "0164496D-FA35-421A-8A22-649831C83E63",
        name: "高等代数"
      },
      {
        id: "C7768D8F-3BD3-4D9F-BC82-C3F12701E7BF",
        name: "数学分析"
      }
    ]

    this.clearAllComments()
    this.colorIndex = 0
    classificationIdsArr.forEach(
      info => {
        let classificationNote = MNNote.new(info.id)
        if (classificationNote) {
          let childNotesNum = classificationNote.descendantNodes.descendant.length - 1  // 去掉归类卡片自己
          if (info.name == "学习规划") {
            if (childNotesNum > 6) {
              // 因为学习规划有六张本来就有的
              this.appendMarkdownComment("「" + info.name + "」还剩 " + childNotesNum + " 张卡片未归类")
              this.appendNoteLink(classificationNote, "To")
              this.colorIndex = 3
            }
          } else {
            if (childNotesNum > 0) {
              this.appendMarkdownComment("「" + info.name + "」还剩 " + childNotesNum + " 张卡片未归类")
              this.appendNoteLink(classificationNote, "To")
              this.colorIndex = 3
            }
          }
        }
      }
    )
  }
  /**
   * 卡片去掉所有评论
   */
  clearAllComments(){
    for (let i = this.comments.length -1; i >= 0; i--) {
      this.removeCommentByIndex(i)
    }
  }
  /**
   * 【数学】把证明的内容移到最下方
   * 
   * 一般用于重新写证明
   */
  moveProofDown() {
    let proofIndexArr = this.getHtmlBlockContentIndexArr("证明：")
    if (proofIndexArr.length > 0) {
      this.moveCommentsByIndexArrTo(proofIndexArr, "bottom")
    }
  }
  /**
   * 更新卡片学习状态
   */
  /**
   * 让卡片成为进度卡片
   * - 在学习规划学习集中，某些卡片起了大头钉的作用，下次能知道从哪里开始看
   * 
   * 1. 卡片变成灰色
   * 2. 找到摘录对应的 md5
   * 3. 找到学习规划学习集中对应的卡片
   * 4. 将卡片移动到学习规划学习集中对应的卡片下成为子卡片
   */
  toBeProgressNote(){
    let docMd5 = MNUtil.currentDocmd5
    let targetNote = MNNote.new(MNUtil.getNoteIdByMd5InPlanNotebook(docMd5))
    if (targetNote) {
      targetNote.addChild(this)
      this.colorIndex = 13 // 灰色
      // bug 添加到卡片的兄弟卡片了而不是变成子卡片
    }
  }
  /**
   * 让卡片独立出来
   */
  toBeIndependent(){
    let parentNote = this.getClassificationParentNote()
    parentNote.addChild(this)
    this.focusInMindMap(0.5)
  }
  /**
   * 将卡片转移到“输入”区
   */
  moveToInput(){
    let notebookId = MNUtil.currentNotebookId
    let workflowObj = MNUtil.getWorkFlowObjByNoteBookId(notebookId)
    if (workflowObj.inputNoteId) {
      let inputNoteId = workflowObj.inputNoteId
      let inputNote = MNNote.new(inputNoteId)
      inputNote.addChild(this)
      // this.focusInMindMap(0.8)
    }
  }
  /**
   * 将卡片转移到“备考”区
   */
  moveToPreparationForExam(){
    let notebookId = MNUtil.currentNotebookId
    let workflowObj = MNUtil.getWorkFlowObjByNoteBookId(notebookId)
    if (workflowObj.preparationNoteId) {
      let preparationNoteId = workflowObj.preparationNoteId
      let preparationNote = MNNote.new(preparationNoteId)
      preparationNote.addChild(this)
      // this.focusInMindMap(0.8)
    }
  }
  /**
   * 将卡片转移到“内化”区
   */
  moveToInternalize(){
    let notebookId = MNUtil.currentNotebookId
    let workflowObj = MNUtil.getWorkFlowObjByNoteBookId(notebookId)
    if (workflowObj.internalizationNoteId) {
      let internalizationNoteId = workflowObj.internalizationNoteId
      let internalizationNote = MNNote.new(internalizationNoteId)
      internalizationNote.addChild(this)
      if (this.title.includes("输入")) {
        this.changeTitle()
        this.linkParentNote()
      }
      this.focusInMindMap(1)
    }
  }
  /**
   * 将卡片转移到“待归类”区
   */
  moveToBeClassified(targetNoteId){
    let notebookId = MNUtil.currentNotebookId
    let workflowObj = MNUtil.getWorkFlowObjByNoteBookId(notebookId)
    let toClassifyNoteId = (targetNoteId == undefined)?workflowObj.toClassifyNoteId:targetNoteId
    let toClassifyNote = MNNote.new(toClassifyNoteId)
    if (toClassifyNote) {
      toClassifyNote.addChild(this)
      this.changeTitle()
      this.linkParentNote()
      this.addToReview()
    }
  }
  /**
   * 【数学】加入复习
   */
  addToReview() {
    if (this.getNoteTypeZh() !== "顶层" && this.getNoteTypeZh() !== "归类") {
      if (!MNUtil.isNoteInReview(this.noteId)) {  // 2024-09-26 新增的 API
        MNUtil.excuteCommand("AddToReview")
      }
    }
  }
  /**
   * 根据 indexarr 和弹窗按钮确定移动的位置
   */
  moveCommentsByIndexArrAndButtonTo(indexArr, popUpTitle = "移动评论到", popUpSubTitle = "") {
    MNUtil.undoGrouping(()=>{
      try {
        if (this.ifReferenceNote()) {
          // 此时为文献类卡片，弹窗更新
          UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
            popUpTitle,
            popUpSubTitle,
            0,
            "取消",
            [
              "🔝🔝🔝🔝卡片最顶端🔝🔝🔝🔝",
              "----------【摘录区】----------",
              "🔝Top🔝",
              "⬇️ Bottom ⬇️",
              "----------【文献信息区】----------",
              "🔝Top🔝",
              "⬇️ Bottom ⬇️",
              "----------【相关思考区】----------",
              "🔝Top🔝",
              "⬇️ Bottom ⬇️",
              "----------【参考文献区】----------",
              "🔝Top🔝",
              "⬇️ Bottom ⬇️",
            ],
            (alert, buttonIndex) => {
              switch (buttonIndex) {
                case 1:  // 卡片最顶端
                  this.moveCommentsByIndexArrTo(indexArr, "top")
                  break;
                case 3:  // 摘录区最顶端
                  this.moveCommentsByIndexArrTo(indexArr, "excerpt", false)
                  break;
                case 2:
                case 4:  // 摘录区最底部
                  this.moveCommentsByIndexArrTo(indexArr, "excerpt")
                  break;
                case 6:  // 文献信息最顶端
                  this.moveCommentsByIndexArrTo(indexArr, "literature", false)
                  break;
                case 5:
                case 7:  // 文献信息最底部
                  this.moveCommentsByIndexArrTo(indexArr, "literature")
                  break;
                case 9:  // 相关思考区最顶端
                  this.moveCommentsByIndexArrTo(indexArr, "think", false)
                  break;
                case 8:
                case 10:  // 相关思考区最底部
                  this.moveCommentsByIndexArrTo(indexArr, "think")
                  break;
                case 11:
                case 13:  // 参考文献区底部
                  this.moveCommentsByIndexArrTo(indexArr, "ref")
                  break;
                case 12:  // 参考文献区顶部
                  this.moveCommentsByIndexArrTo(indexArr, "ref", false)
                  break;
              }
      
              MNUtil.undoGrouping(()=>{
                this.refresh()
              })
            }
          )
        } else {
          UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
            popUpTitle,
            popUpSubTitle,
            0,
            "取消",
            [
              "🔝🔝🔝🔝卡片最顶端🔝🔝🔝🔝",
              "----------【摘录区】----------",
              "🔝Top🔝",
              "⬇️ Bottom ⬇️",
              "----------【证明区】----------",
              "🔝Top🔝",
              "⬇️ Bottom ⬇️",
              "----------【相关思考区】----------",
              "🔝Top🔝",
              "⬇️ Bottom ⬇️",
              "----------【所属区】----------",
              "🔝Top🔝",
              "⬇️ Bottom ⬇️",
              "----------【相关链接区】----------",
              "🔝Top🔝",
              "⬇️ Bottom ⬇️",
            ],
            (alert, buttonIndex) => {
              switch (buttonIndex) {
                case 1:  // 卡片最顶端
                  this.moveCommentsByIndexArrTo(indexArr, "top")
                  break;
                case 3:  // 摘录区最顶端
                  this.moveCommentsByIndexArrTo(indexArr, "excerpt", false)
                  break;
                case 2:
                case 4:  // 摘录区最底部
                  this.moveCommentsByIndexArrTo(indexArr, "excerpt")
                  break;
                case 6:  // 证明区最顶端
                  this.moveCommentsByIndexArrTo(indexArr, "proof", false)
                  break;
                case 5:
                case 7:  // 证明区最底部
                  this.moveCommentsByIndexArrTo(indexArr, "proof")
                  break;
                case 9:  // 相关思考区最顶端
                  this.moveCommentsByIndexArrTo(indexArr, "think", false)
                  break;
                case 8:
                case 10:  // 相关思考区最底部
                  this.moveCommentsByIndexArrTo(indexArr, "think")
                  break;
                case 11:
                case 13:  // 所属区底部
                  this.moveCommentsByIndexArrTo(indexArr, "belong")
                  break;
                case 12:  // 所属区顶部
                  this.moveCommentsByIndexArrTo(indexArr, "belong", false)
                  break;
                case 14:  // 相关链接区底部
                case 16:
                  this.moveCommentsByIndexArrTo(indexArr, "link")
                  break;
                case 15:  // 相关链接区顶部
                  this.moveCommentsByIndexArrTo(indexArr, "link", false)
                  break;
              }
      
              MNUtil.undoGrouping(()=>{
                this.refresh()
              })
            }
          )
        }
      } catch (error) {
        MNUtil.showHUD(error);
      }
    })
  }
  /**
   * 删除评论
   * 
   * 提供一些预设项，并且用户可以自行输入要删除的评论 Index
   */
  deleteCommentsByPopup(){
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "删除评论",
      "支持:\n- 单个序号: 1,2,3\n- 范围: 1-4 (删除第1到第4条)\n- 特殊字符: X(倒数第3条), Y(倒数第2条), Z(最后一条)\n- 组合使用: 1,3-5,Y,Z\n\n用中文或英文逗号、分号分隔",
      2,
      "取消",
      [
        "第1️⃣条评论",
        "最后一条评论",
        "确定删除输入的评论"
      ],
      (alert, buttonIndex) => {
        let userInput = alert.textFieldAtIndex(0).text;
        let deleteCommentIndexArr = userInput ? userInput.parseCommentIndices(this.comments.length) : []
        switch (buttonIndex) {
          case 1:  // 删除第一条评论
            this.removeCommentByIndex(0)
            break;
          case 2:  // 删除最后一条评论
            this.removeCommentByIndex(this.comments.length-1)
            break;
          case 3:  // 确定删除输入的评论
            if (deleteCommentIndexArr.length > 0) {
              this.removeCommentsByIndices(deleteCommentIndexArr)
            }
            break;
        }

        MNUtil.undoGrouping(()=>{
          this.refresh()
        })
      }
    )
  }
  /**
   * 先删除评论再移动新内容
   * 
   * 两个参数和 moveNewContentTo 函数的参数相同
   * @param {String} target 新内容移动的位置
   * @param {boolean} [toBottom=true] 默认移动到底部
   */
  deleteCommentsByPopupAndMoveNewContentTo(target, toBottom= true){
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "先删除评论",
      "支持:\n- 单个序号: 1,2,3\n- 范围: 1-4 (删除第1到第4条)\n- 特殊字符: X(倒数第3条), Y(倒数第2条), Z(最后一条)\n- 组合使用: 1,3-5,Y,Z\n\n用中文或英文逗号、分号分隔",
      2,
      "取消",
      [
        "第1️⃣条评论",
        "最后一条评论",
        "确定删除输入的评论"
      ],
      (alert, buttonIndex) => {
        let userInput = alert.textFieldAtIndex(0).text;
        let deleteCommentIndexArr = userInput ? userInput.parseCommentIndices(this.comments.length) : []
        switch (buttonIndex) {
          case 1:  // 删除第一条评论
            this.removeCommentByIndex(0)
            break;
          case 2:  // 删除最后一条评论
            this.removeCommentByIndex(this.comments.length-1)
            break;
          case 3:  // 确定删除输入的评论
            if (deleteCommentIndexArr.length > 0) {
              this.removeCommentsByIndices(deleteCommentIndexArr)
            }
            break;
        }

        this.moveNewContentTo(target, toBottom)

        MNUtil.undoGrouping(()=>{
          this.refresh()
        })
      }
    )
  }
  /**
   * 将 IdArr 里的 ID 对应的卡片剪切到 this 作为子卡片
   */
  pasteChildNotesByIdArr(arr) {
    arr.forEach((id) => {
      if (id.isNoteIdorURL()) {
        this.pasteChildNoteById(id.toNoteId())
      }
    })
  }

  pasteChildNoteById(id) {
    if (typeof id == "string" && id.isNoteIdorURL()) {
      let targetNote = MNNote.new(id.toNoteId())
      if (targetNote) {
        let config = {
          title: targetNote.noteTitle,
          content: "",
          markdown: true,
          color: targetNote.colorIndex
        }
        // 创建新兄弟卡片，标题为旧卡片的标题
        let newNote = this.createChildNote(config)
        targetNote.noteTitle = ""
        // 将旧卡片合并到新卡片中
        targetNote.mergeInto(newNote)
      }
    }
  }
  /**
   * 获取第一个标题链接词并生成标题链接
   */
  generateCustomTitleLinkFromFirstTitlelinkWord(keyword) {
    let title = this.title
    if (title.isKnowledgeNoteTitle()) {
      let firstTitleLinkWord = this.getFirstTitleLinkWord()
      return MNUtil.generateCustomTitleLink(keyword, firstTitleLinkWord)
    } else {
      return MNUtil.generateCustomTitleLink(keyword, title)
    }
  }
  /**
   * 获取标题的所有标题链接词
   */
  getTitleLinkWordsArr(){
    let title = this.noteTitle
    let titleLinkWordsArr = []
    if (title.isKnowledgeNoteTitle()) {
      let titlePart = title.toKnowledgeNoteTitle()
      // titlePart 用 ; 分割，然后以此加入到 titleLinkWordsArr 中
      titlePart.split(";").forEach((part) => {
        if (part.trim() !== "") {
          titleLinkWordsArr.push(part.trim())
        }
      })
    } else {
      titleLinkWordsArr.push(title)
    }
    return titleLinkWordsArr
  }
  /**
   * 获取标题中的第一个标题链接词
   */
  getFirstTitleLinkWord(){
    let title = this.noteTitle
    let regex = /【.*】(.*?);?\s*([^;]*?)(?:;|$)/;
    let matches = title.match(regex);
  
    if (matches) {
      const firstPart = matches[1].trim(); // 提取分号前的内容
      const secondPart = matches[2].trim(); // 提取第一个分号后的内容
  
      // 根据第一部分是否为空选择返回内容
      return firstPart === '' ? secondPart : firstPart;
    } else {
      // 如果没有前缀，就获取第一个 ; 前的内容
      title = title.toNoBracketPrefixContent()
      regex = /^(.*?);/;
      matches = title.match(regex);
    
      if (matches) {
        return matches[1].trim().toString()
      } else {
        return title.toString()
      }
    }
  }

  /**
   * 判断卡片的前缀是否包含
   * - 输入
   * - 内化
   * - 待归类
   */
  ifNoteTemporary(){
    return ["输入","内化","待归类"].some(keyword => this.title.includes(keyword))
  }
  
  /**
   * 【数学】修改和处理卡片标题
   * - 知识类卡片增加标题前缀
   * - 黄色归类卡片：“”：“”相关 xx
   * - 绿色归类卡片：“”相关 xx
   * - 处理卡片标题空格
   * 
   * @param {string} type - 针对归类卡片的类型
   */
  changeTitle(type) {
    let noteType = this.getNoteTypeZh()
    // let topestClassificationNote = this.getTopestClassificationNote()
    let classificationNoteType
    let title = this.noteTitle
    let parentNoteType = this.parentNote.getNoteTypeZh()
    let parentNoteTitle
    switch (noteType) {
      case "顶层":
        classificationNoteType = this.getTopWhiteNoteType()
        if (!title.isGreenClassificationNoteTitle()) {
          this.title = "“" + title + "”" + "相关" + classificationNoteType
        }
        break;
      case "归类":
        if (!title.isYellowClassificationNoteTitle()) {
          // 此时不是黄色卡片标题结构
          if (
            !this.isIndependentNote() ||
            (
              /**
               * 此时为 Inbox 的特殊情况
               */
              this.getNoteTypeObjByClassificationParentNoteTitle().en == "temporary"
            )
          ) {
            // 有归类父卡片
            if (["定义","命题","例子","反例","思想方法"].includes(parentNoteType)) {
              // 也就是此时卡片的父卡片是一张定义类卡片
              // 此时为基于定义类卡片生成归类卡片
              classificationNoteType = type?type:this.getNoteTypeObjByClassificationParentNoteTitle().zh
              parentNoteTitle = this.parentNote.getFirstTitleLinkWord()
            } else {
              // 其余情况为正常归类
              classificationNoteType = this.getNoteTypeObjByClassificationParentNoteTitle().zh
              parentNoteTitle = this.parentNote.noteTitle.toClassificationNoteTitle()
            }
            // 修改标题
            this.title = "“" + title + "”" + "相关" + classificationNoteType
          }
        } else {
          /**
           * 如果已经是黄色归类卡片的标题结构，此时需要
           * - 获取第一个括号的内容
           */
          if (
            !this.isIndependentNote() ||
            (
              /**
               * 此时为 Inbox 的特殊情况
               */
              this.getNoteTypeObjByClassificationParentNoteTitle().en == "temporary"
            )
          ) {
            // 有归类父卡片
            let classificationNoteTitleType = this.title.toClassificationNoteTitleType()  // 获取“相关xx”的部分
            // if (parentNoteType == "定义") {
            if (["定义","命题","例子","反例","思想方法"].includes(parentNoteType)) {
              // 也就是此时卡片的父卡片是一张定义类卡片
              // 此时为基于定义类卡片生成归类卡片
              parentNoteTitle = this.parentNote.getFirstTitleLinkWord()
            } else {
              // 其余情况为正常归类
              // classificationNoteType = this.getNoteTypeObjByClassificationParentNoteTitle().zh
              parentNoteTitle = this.parentNote.noteTitle.toClassificationNoteTitle()
            }
            // MNUtil.showHUD(parentNoteType + "+" + parentNoteTitle)
            // 修改标题
            this.title = "“" + title.toClassificationNoteTitle() + "”" + classificationNoteTitleType
          }
        }
        break;
      case "文献":
        if (!title.ifReferenceNoteTitle()) {
          // // 弹窗确认文献类型
          // let referenceType
          // UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherggButtonTitlesTapBlock(
          //   "选择文献类型",
          //   "",
          //   0,
          //   "取消",
          //   ["论文", "书作"],
          //   (alert, buttonIndex) => {
          //     switch (buttonIndex) {
          //       case 1:
          //         referenceType = "论文"
          //         break;
          //       case 2:
          //         referenceType = "书作"
          //         break;
          //     }
          //   }
          // )
          // this.title = "【文献："+ referenceType + "】; " + title.toNoBracketPrefixContent()
          if (type) {
            this.title = "【文献："+ type + "】; " + title.toNoBracketPrefixContent()
          } else {
            this.title = "【文献】; " + title.toNoBracketPrefixContent()
          }
        }
        break;
      default:
        // 特殊情形
        if (
          this.getClassificationParentNote().noteTitle.toClassificationNoteTitle() == "备考" &&
          noteType !== "定义" &&
          this.title == ""
        ) {
          this.title = ""
          break;
        }
        if (
          !this.isIndependentNote()
        ) {
          /**
           * 知识点卡片
           */
          noteType = this.getNoteTypeZh()
          parentNoteTitle = this.getClassificationParentNote().noteTitle.toClassificationNoteTitle()
          if (title.ifKnowledgeNoteTitle()) {
            /**
             * 已经有前缀了，先获取不带前缀的部分作为 title
             */
            let prefix = title.toKnowledgeNotePrefix() // 要放在下面的 title 处理之前，因为 title 处理之后会改变 title 的值
            title = title.toKnowledgeNoteTitle()

            /**
             * 需要检测前缀的结尾是否在「上一个」 parentNoteTitle 的基础上增加了“：xxx”的结构
             * 此时的场景一般是：移动知识点卡片，导致归类卡片不同，但是可以增加了原来的前缀的，比如一些参数的范围，如 Lp 的 p 的范围，就会加在前缀中，比如【命题：xxx：p>1】
             */

            // 先获取到旧的 parentNoteTitle。虽然可能出现“相关链接：”下方没有链接的情况，但是考虑到此时已经有前缀了，所以这个情况基本不会出现，除非是原归类卡片被删除的情况，所以就看能不能找到原归类卡片，找得到的话就增加判断是否多了结构，找不到的话直接按照现归类卡片的标题来处理即可。
            if (this.getHtmlCommentIndex("相关链接：")!== -1 && this.getHtmlCommentIndex("相关链接：") < this.comments.length-1) {
              let oldClassificationNoteId = this.comments[this.getHtmlCommentIndex("相关链接：")+1]
              if (oldClassificationNoteId.text && oldClassificationNoteId.text.isLink()) {
                /**
                 * 是链接的话基本就是对应原归类卡片
                 */
                let oldClassificationNote = MNNote.new(oldClassificationNoteId.text.toNoteId())
                let oldClassificationNoteTitle = oldClassificationNote.noteTitle.toClassificationNoteTitle()
                if (prefix === oldClassificationNoteTitle) {
                  /**
                   * 此时说明没有修改旧前缀
                   * 那就直接按照新归类卡片来
                   */
                  if (noteType == "定义") {
                    this.title = "【" + noteType + "：" + parentNoteTitle + "】; " + title
                  } else {
                    this.title = "【" + noteType + "：" + parentNoteTitle + "】" + title
                  }
                } else if (prefix.startsWith(oldClassificationNoteTitle)) {
                  /**
                   * 此时说明修改了旧前缀，此时需要获取到修改的部分
                   */
                  let newContent = prefix.slice(oldClassificationNoteTitle.length)
                  if (noteType == "定义") {
                    this.title = "【" + noteType + "：" + parentNoteTitle + newContent + "】; " + title
                  } else {
                    this.title = "【" + noteType + "：" + parentNoteTitle + newContent + "】" + title
                  }
                } else {
                  if (noteType == "定义") {
                    this.title = "【" + noteType + "：" + parentNoteTitle + "】; " + title
                  } else {
                    this.title = "【" + noteType + "：" + parentNoteTitle + "】" + title
                  }
                }
              } else {
                /**
                 * 否则说明原归类卡片不存在了
                 * 那就直接按照新归类卡片来
                 */
                if (noteType == "定义") {
                  this.title = "【" + noteType + "：" + parentNoteTitle + "】; " + title
                } else {
                  this.title = "【" + noteType + "：" + parentNoteTitle + "】" + title
                }
              }
            } else {
              // 其余情况，直接修改前缀
              if (noteType == "定义") {
                this.title = "【" + noteType + "：" + parentNoteTitle + "】; " + title
              } else {
                this.title = "【" + noteType + "：" + parentNoteTitle + "】" + title
              }
            }
          } else {
            /**
             * 没有前缀，但需要检测是否有旧卡片本来带的【】开头的内容，去掉后加前缀
             */
            // MNUtil.showHUD("hahaha ")
            this.title = this.title.replace(/^【[^】]*】/, "");
            if (noteType == "定义") {
              this.title = "【" + noteType + "：" + parentNoteTitle + "】; " + title
            } else {
              this.title = "【" + noteType + "：" + parentNoteTitle + "】" + title
            }
          }
        }
        break;
    }
    // 最后处理一下标题的空格
    this.title = Pangu.spacing(this.title)
    // 把标题前面的 Summary 去掉
    this.title = this.title.replace(/Summary\s;/, "");
  }

  /**
   * 【数学】移动卡片到某些特定的子卡片后
   * 
   * 目前只移动文献
   * 
   * 1. 先判断是否需要移动文献
   * 2. 如果要的话再移动到论文或者书作文献区
   */
  move() {
    let noteType = this.getNoteTypeZh()
    let targetNoteId
    if (noteType == "文献") {
      if (this.ifReferenceNoteToMove()) {
        // 此时文献卡片不在“论文”或“书作”文献区
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "选择文献类型",
          "",
          0,
          "取消",
          ["论文", "书作"],
          (alert, buttonIndex) => {
            switch (buttonIndex) {
              case 1:
                noteType = "论文"
                targetNoteId = "785225AC-5A2A-41BA-8760-3FEF10CF4AE0"
                break;
              case 2:
                noteType = "书作"
                targetNoteId = "49102A3D-7C64-42AD-864D-55EDA5EC3097"
                break;
            }
            // 把修改前缀放在这里
            this.changeTitle(noteType)
            let targetNote = MNNote.new(targetNoteId)
            targetNote.addChild(this)
          }
        )
      } else {
        // 如果在的话就 change 一下 Title
        let parentNote = this.parentNote
        if (parentNote.noteId == "785225AC-5A2A-41BA-8760-3FEF10CF4AE0") {
          this.changeTitle("论文")
        } else {
          this.changeTitle("书作")
        }
      }
    }
  }
  /**
   * 【数学】与父卡片进行链接
   * 1. 先识别是否已经进行了链接，如果有的话就删掉 this 的相关链接的第一条和对应归类卡片里的 this 链接
   * 2. 没有的话就进行双向链接，并且将链接移动到“相关链接：”下方
   * 
   * 【TODO】如果是输入、内化、待归类卡片，则不需要进行链接
   */
  linkParentNote(){
    if (
      !this.ifIndependentNote() ||
      this.getNoteTypeObjByClassificationParentNoteTitle().en == "temporary"
    ) {
      // 有归类的卡片，此时才进行链接
      let noteType = this.getNoteTypeZh()
      let belongHtmlBlockContentIndexArr
      switch (noteType) {
        case "顶层":
          // 绿色的顶层卡片
          belongHtmlBlockContentIndexArr = this.getHtmlBlockContentIndexArr("所属")
          if (belongHtmlBlockContentIndexArr.length !== 0) {
            // 此时说明有链接，需要先删除
            let oldBelongIndex = belongHtmlBlockContentIndexArr[0]
            let oldLink = this.comments[oldBelongIndex].text
            let oldLinkedNote = MNNote.new(oldLink.toNoteId())
            let indexInOldLinkedNote = oldLinkedNote.getCommentIndex(this.noteURL)
            if (indexInOldLinkedNote !== -1) {
              oldLinkedNote.removeCommentByIndex(indexInOldLinkedNote)
            }
            this.removeCommentByIndex(oldBelongIndex)
    
            // 重新链接
            let topestClassificationNote = this.getTopestClassificationNote()
            if (topestClassificationNote) {
              let indexInTopestClassificationNote = topestClassificationNote.getCommentIndex(this.noteURL)
              if (indexInTopestClassificationNote == -1) {
                topestClassificationNote.appendNoteLink(this, "To")
              }
              this.appendNoteLink(topestClassificationNote, "To")
              this.moveComment(this.comments.length-1, oldBelongIndex)
            }
          } else {
            // 此时说明原来没有链接，所以直接链接就行
            let topestClassificationNote = this.getTopestClassificationNote()
            let indexInTopestClassificationNote = topestClassificationNote.getCommentIndex(this.noteURL)
            let topestClassificationNoteIndexInThis = this.getCommentIndex(topestClassificationNote.noteURL)
            if (topestClassificationNote) {
              // 链接到父卡片
              if (indexInTopestClassificationNote == -1) {
                topestClassificationNote.appendNoteLink(this, "To")
              }
              // 父卡片链接过来
              if (topestClassificationNoteIndexInThis == -1) {
                this.appendNoteLink(topestClassificationNote, "To")
                this.moveComment(this.comments.length-1, this.getHtmlCommentIndex("所属")+1)
              } else {
                this.moveComment(topestClassificationNoteIndexInThis, this.getHtmlCommentIndex("所属")+1)
              }
            }
          }
          break;
        case "归类":
          /**
           * 需要判断父卡片是不是定义类卡片，因为与定义类卡片的归类不删除
           * 然后后续即使已经和定义类卡片链接了，和其他归类卡片链接时，要把链接移动到第一个
           * 这样的话后续更改父卡片时可以进行链接的修改
           */
          belongHtmlBlockContentIndexArr = this.getHtmlBlockContentIndexArr("所属")
          if (belongHtmlBlockContentIndexArr.length !== 0) {
            // 此时说明有链接，需要先删除
            let oldBelongIndex = belongHtmlBlockContentIndexArr[0]
            let oldLink = this.comments[oldBelongIndex].text
            let oldLinkedNote = MNNote.new(oldLink.toNoteId())
            // if (oldLinkedNote.colorIndex !== 2) { // 如果是定义类卡片（此时对应的是从概念出发生成的归类），那么就不删除
            if (!["定义","命题","例子","反例"].includes(oldLinkedNote.getNoteTypeZh())) { // 如果是定义类卡片（此时对应的是从概念出发生成的归类），那么就不删除
              let indexInOldLinkedNote = oldLinkedNote.getCommentIndex(this.noteURL)
              if (indexInOldLinkedNote !== -1) {
                oldLinkedNote.removeCommentByIndex(indexInOldLinkedNote)
              }
              this.removeCommentByIndex(oldBelongIndex)
            } 
    
            // 重新链接
            if (this.parentNote) {
              let indexInParentNote = this.parentNote.getCommentIndex(this.noteURL)
              if (indexInParentNote == -1) {
                this.parentNote.appendNoteLink(this, "To")
              }
              let parentNoteIndexInThis = this.getCommentIndex(this.parentNote.noteURL)
              if (parentNoteIndexInThis == -1) {
                this.appendNoteLink(this.parentNote, "To")
                this.moveComment(this.comments.length-1, oldBelongIndex)
              }
            }
          } else {
            let parentNote = this.parentNote
            let indexInParentNote = parentNote.getCommentIndex(this.noteURL)
            let parentNoteIndexInThis = this.getCommentIndex(parentNote.noteURL)
            if (parentNote) {
              // 链接到父卡片
              if (indexInParentNote == -1) {
                parentNote.appendNoteLink(this, "To")
              }
              // 父卡片链接过来
              if (parentNoteIndexInThis == -1) {
                this.appendNoteLink(parentNote, "To")
                this.moveComment(this.comments.length-1, this.getHtmlCommentIndex("所属")+1)
              } else {
                this.moveComment(parentNoteIndexInThis, this.getHtmlCommentIndex("所属")+1)
              }
            }
          }
          break;
        case "文献":
          break;
        default:
          if (this.getClassificationParentNote().noteTitle.toClassificationNoteTitle() == "备考") { break }
          // 知识点卡片
          let linksHtmlBlockContentIndexArr = this.getHtmlBlockContentIndexArr("相关链接：")
          if (linksHtmlBlockContentIndexArr.length !== 0){
            // 此时说明有链接，需要先删除
            let oldLinkIndex = linksHtmlBlockContentIndexArr[0]
            let oldLink = this.comments[oldLinkIndex].text
            let oldClassificationNote = MNNote.new(oldLink.toNoteId())
            let indexInOldClassificationNote = oldClassificationNote.getCommentIndex(this.noteURL)
            if (indexInOldClassificationNote !== -1) {
              oldClassificationNote.removeCommentByIndex(indexInOldClassificationNote)
            }
            this.removeCommentByIndex(oldLinkIndex)
    
            // 重新链接
            let parentNote = this.getClassificationParentNote()
            let indexInParentNote = parentNote.getCommentIndex(this.noteURL)
            if (parentNote) {
              // 链接到父卡片
              if (indexInParentNote == -1) {
                parentNote.appendNoteLink(this, "To")
              }
              // 父卡片链接过来
              this.appendNoteLink(parentNote, "To")
              this.moveComment(this.comments.length-1, oldLinkIndex)
            }
          } else {
            // 此时没有旧链接，直接链接即可
            let parentNote = this.getClassificationParentNote()
            let indexInParentNote = parentNote.getCommentIndex(this.noteURL)
            let parentNoteIndexInThis = this.getCommentIndex(parentNote.noteURL)
            let targetIndex = this.getHtmlCommentIndex("相关链接：") == this.comments.length-1 ? this.comments.length : this.getHtmlCommentIndex("相关链接：")+1
            if (parentNote) {
              // 链接到父卡片
              if (indexInParentNote == -1) {
                parentNote.appendNoteLink(this, "To")
              }
              // 父卡片链接过来
              if (parentNoteIndexInThis == -1) {
                this.appendNoteLink(parentNote, "To")
                this.moveComment(this.comments.length-1, targetIndex)
              } else {
                this.moveComment(parentNoteIndexInThis, targetIndex)
              }
            }
          }
          break;
      }
    }
  }
  /**
   * 【数学】获取到归类卡片、知识卡片最顶的第一个白色卡片
   */
  getTopWhiteNote(){
    let whiteNote
    // 先选到第一个白色的父卡片
    if (this.note.colorIndex == 12) {
      // 如果选中的就是白色的（比如刚建立专题的时候）
      whiteNote = this
    } else {
      whiteNote = this.parentNote
      while (whiteNote.colorIndex !== 12) {
        whiteNote = whiteNote.parentNote
      }
    }

    return whiteNote
  }
  /**
   * 【数学】获得到归类卡片、知识卡片最顶的第一个白色卡片的类型
   */
  getTopWhiteNoteType(){
    let whiteNote = this.getTopWhiteNote()
    let type
    const typeRegex = /^(.*)（/; // 匹配以字母或数字开头的字符直到左括号 '('
    
    const match = whiteNote.noteTitle.match(typeRegex);
    if (match) {
      type = match[1]; // 提取第一个捕获组的内容
    }

    return type
  }
  /**
   * 【数学】获得最顶层的归类卡片：绿色的上层的上层
   */
  getTopestClassificationNote(){
    let whiteNote = this.getTopWhiteNote()

    return whiteNote.parentNote
  }
  /**
   * 【数学】根据卡片类型自动修改颜色
   */
  changeColorByType(preprocess = false){
    if (!this.isIndependentNote()) {
      // 有归类的卡片。此时才需要根据父卡片的标题来判断卡片类型来改变卡片颜色
      let noteType = this.getNoteTypeZh()
      this.fillIndex = 2
      switch (noteType) {
        case "顶层":
          this.note.colorIndex = 1
          break;
        case "归类":
          if (this.parentNote.getNoteTypeZh() == "顶层") {
            this.note.colorIndex = 4
          } else {
            this.note.colorIndex = 0
          }
          break;
        case "文献":
          if (this.title.includes("作者")) {
            this.note.colorIndex = 2
          } else {
            this.note.colorIndex = 15
          }
          break;
        default:
          let noteType = this.getNoteTypeObjByClassificationParentNoteTitle()
          if (noteType) {
            let colorIndex = MNUtil.getNoteColorIndexByZhType(noteType.zh, preprocess)
            this.note.colorIndex = colorIndex
          }
          break;
      }
    }
  }
  /**
   * 【数学】合并模板卡片
   * 1. 识别父卡片的标题，来判断卡片是什么类型
   * 2. 根据卡片类型，合并不同的模板卡片
   * 3. 识别是否有摘录外的内容
   *   - 有的话就移动到
   *     - “证明：”下方（非概念类型卡片）
   *     - “相关思考下方”（概念卡片）
   *   - 没有的话就直接合并模板
   */
  mergeTemplate(){
    let noteType = this.getNoteTypeZh()
    // 要在合并模板之前获取，否则会把 Html 评论移动
    let contentIndexArr = this.getContentWithoutLinkNoteTypeIndexArr()

    if (this.ifIndependentNote()) {  
      if (this.getHtmlCommentIndex("相关思考：") == -1) {
        this.mergeTemplateByNoteType(noteType)

        /**
           * 把除了摘录外的其他内容移动到对应的位置
           * 定义的默认到“相关思考：”下方
           * 其他的默认到“证明：”下方
           * 
           * TODO: summary 的链接要移动到相关概念，或者不移动
           */
        if (contentIndexArr.length !== 0) {
          switch (noteType.zh) {
            case "定义":
              let thoughtHtmlCommentIndex = this.getHtmlCommentIndex("相关思考：")
              this.moveComment(thoughtHtmlCommentIndex, contentIndexArr[0])
              // 注意相关概念的 index 要放在移动后取，否则移动后 index 会发生变化
              let conceptHtmlCommentIndex = this.getHtmlCommentIndex("相关概念：")
              this.moveComment(conceptHtmlCommentIndex, contentIndexArr[0])
              break;
            default:
              let proofHtmlCommentIndex = this.getProofHtmlCommentIndexByNoteType(noteType)
              if (this.ifCommentsAllLinksByIndexArr(contentIndexArr)) {
                // 如果全是链接，就放在应用下方，其实刚合并的话就是放在最下方
                this.moveCommentsByIndexArrTo(contentIndexArr, "applications", false)
              } else {
                // 如果有非链接，就放到证明下方
                this.moveComment(proofHtmlCommentIndex, contentIndexArr[0])
              }
              break;
          }
        }
      }
    } else {
      switch (noteType) {
        case "归类":
        case "顶层":
          /**
           * 归类卡片
           */
          // 和原本的处理不同，这里也采用合并模板的方式
          if (this.getHtmlCommentIndex("包含：") == -1) {
            this.mergeTemplateByNoteType(noteType)
          }
          break;
        case "文献":
          if (this.getHtmlCommentIndex("文献信息：") == -1 && !this.title.includes("作者")) {
            this.mergeTemplateByNoteType("文献")
          }
          break;
        default:
          /**
           * 知识点卡片
           */
          if (this.getHtmlCommentIndex("相关思考：") == -1) {
            // 合并模板
            noteType = this.getNoteTypeObjByClassificationParentNoteTitle()
            this.mergeTemplateByNoteType(noteType)
      
            /**
             * 把除了摘录外的其他内容移动到对应的位置
             * 定义的默认到“相关思考：”下方
             * TODO: summary 的链接要移动到相关概念，或者不移动
             * 
             * 其他的默认到“证明：”下方
             */
            if (contentIndexArr.length !== 0) {
              switch (noteType.zh) {
                case "定义":
                  let thoughtHtmlCommentIndex = this.getHtmlCommentIndex("相关思考：")
                  this.moveComment(thoughtHtmlCommentIndex, contentIndexArr[0])
                  // 注意相关概念的 index 要放在移动后取，否则移动后 index 会发生变化
                  let conceptHtmlCommentIndex = this.getHtmlCommentIndex("相关概念：")
                  this.moveComment(conceptHtmlCommentIndex, contentIndexArr[0])
                  break;
                default:
                  let proofHtmlCommentIndex = this.getProofHtmlCommentIndexByNoteType(noteType)
                  if (this.ifCommentsAllLinksByIndexArr(contentIndexArr)) {
                    // 如果全是链接，就放在应用下方，其实刚合并的话就是放在最下方
                    this.moveCommentsByIndexArrTo(contentIndexArr, "applications", false)
                  } else {
                    // 如果有非链接，就放到证明下方
                    this.moveComment(proofHtmlCommentIndex, contentIndexArr[0])
                  }
                  break;
              }
            }
          }
          break;
      }
    }
  }
  /**
   * 判断卡片是否已经合并了模板
   */
  ifMergedTemplate(){
    return this.getHtmlCommentIndex("相关思考：") !== -1 && this.getHtmlCommentIndex("相关链接：") !== -1
  }
  /**
   * 检测 indexArr 对应的评论是否全是链接
   */
  ifCommentsAllLinksByIndexArr(indexArr){
    let flag = true
    indexArr.forEach((index) => {
      if (
        this.comments[index].type !== "TextNote" ||
        !this.comments[index].text.isLink()
      ) {
        flag = false
      }
    })

    return flag
  }
  /**
   * 【数学】获取“证明”系列的 Html 的 index
   *  因为命题、反例、思想方法的“证明：”叫法不同
   */
  getProofHtmlCommentIndexByNoteType(type){
    if (MNUtil.isObj(type)) {
      type = type.zh
    } 
    let proofHtmlCommentIndex
    switch (type) {
      case "反例":
        proofHtmlCommentIndex = this.getHtmlCommentIndex("反例及证明：")
        break;
      case "思想方法":
        proofHtmlCommentIndex = this.getHtmlCommentIndex("原理：")
        break;
      default:
        proofHtmlCommentIndex = this.getHtmlCommentIndex("证明：")
        break;
    }

    return proofHtmlCommentIndex
  }

  getProofNameByType(type){
    if (MNUtil.isObj(type)) {
      type = type.zh
    } 
    let proofName
    switch (type) {
      case "反例":
        proofName = "反例及证明："
        break;
      case "思想方法":
        proofName = "原理："
        break;
      default:
        proofName = "证明："
        break;
    }

    return proofName
  }

  /**
   * 【数学】更新证明的 Html 的 index
   */
  getRenewProofHtmlCommentByNoteType(type){
    if (MNUtil.isObj(type)) {
      type = type.zh
    } 
    switch (type) {
      case "反例":
        if (this.getHtmlCommentIndex("证明：") !== -1) {
          this.removeCommentByIndex(this.getHtmlCommentIndex("证明："))
          this.mergeClonedNoteById("6ED0D29A-F57F-4B89-BFDA-58D5DFEB1F19")
          this.moveComment(this.comments.length-1, this.getHtmlCommentIndex("证明："))
        } else if (this.getHtmlCommentIndex("原理：") !== -1) {
          this.removeCommentByIndex(this.getHtmlCommentIndex("原理："))
          this.mergeClonedNoteById("6ED0D29A-F57F-4B89-BFDA-58D5DFEB1F19")
          this.moveComment(this.comments.length-1, this.getHtmlCommentIndex("原理："))
        }
        break;
      case "思想方法":
        if (this.getHtmlCommentIndex("证明：") !== -1) {
          this.removeCommentByIndex(this.getHtmlCommentIndex("证明："))
          this.mergeClonedNoteById("85F0FDF5-E1C7-4B38-80CA-7A3F3266B6A3")
          this.moveComment(this.comments.length-1, this.getHtmlCommentIndex("证明："))
        } else if (this.getHtmlCommentIndex("反例及证明：") !== -1) {
          this.removeCommentByIndex(this.getHtmlCommentIndex("反例及证明："))
          this.mergeClonedNoteById("85F0FDF5-E1C7-4B38-80CA-7A3F3266B6A3")
          this.moveComment(this.comments.length-1, this.getHtmlCommentIndex("反例及证明："))
        }
        break;
      default:
        if (this.getHtmlCommentIndex("反例及证明：") !== -1) {
          this.removeCommentByIndex(this.getHtmlCommentIndex("反例及证明："))
          this.mergeClonedNoteById("21D808AE-33D9-494A-9D99-04FFA5D9E455")
          this.moveComment(this.comments.length-1, this.getHtmlCommentIndex("反例及证明："))
        } else if (this.getHtmlCommentIndex("原理：") !== -1) {
          this.removeCommentByIndex(this.getHtmlCommentIndex("原理："))
          this.mergeClonedNoteById("21D808AE-33D9-494A-9D99-04FFA5D9E455")
          this.moveComment(this.comments.length-1, this.getHtmlCommentIndex("原理："))
        }
    }
  }
  /**
   * 获取除了 LinkNote 以外的 indexArr
   * 
   * 注意定义类卡片单独处理
   * 因为手写不需要移动，一般定义类的手写都是作为定义的摘录的地位
   */
  getContentWithoutLinkNoteTypeIndexArr(){
    let indexArr = []
    let type = this.getNoteTypeZh()
    if (type == "定义") {
      for (let i = 0; i < this.comments.length; i++) {
        let comment = this.comments[i]
        if (comment.type !== "LinkNote" && comment.type !== "PaintNote") {
          indexArr.push(i)
        }
      }
    } else {
      for (let i = 0; i < this.comments.length; i++) {
        let comment = this.comments[i]
        if (comment.type !== "LinkNote") {
          indexArr.push(i)
        }
      }
    }
    return indexArr
  }
  autoMoveNewContent() {
    switch (this.getNoteTypeZh()) {
      case "定义":
        /**
         * 到“相关概念：”下方（定义类卡片）
         */
        // this.moveNewContentTo("def")
        let newContentsIndexArr,targetNoteNewContentsIndexArr
        let newContentsFirstComment  // 新内容的第一条评论
        let focusNoteLastComment = MNComment.new(this.comments[this.comments.length - 1], this.comments.length - 1, this.note)
    
        if (!(focusNoteLastComment.type == "linkComment")) {
          // 如果最后一条评论不是链接，那么就直接移动最新的内容到概念区
          newContentsIndexArr = this.getNewContentIndexArr()
          if (newContentsIndexArr.length > 0) {
            newContentsFirstComment = MNComment.new(this.comments[newContentsIndexArr[0]], newContentsIndexArr[0], this.note)
            if (newContentsFirstComment.type == "markdownComment") {
              newContentsFirstComment.text = newContentsFirstComment.text.toDotPrefix()
            }
            this.moveCommentsByIndexArrTo(newContentsIndexArr, "def")
          }
        } else {
          // 如果最后一条是链接，就开始检测
          let targetNote = MNNote.new(focusNoteLastComment.text)
          let targetNoteLastComment = MNComment.new(targetNote.comments[targetNote.comments.length - 1], targetNote.comments.length - 1, targetNote.note)
    
          if (
            targetNoteLastComment.type == "linkComment" &&
            targetNoteLastComment.text == this.noteURL &&
            targetNote.getNoteTypeZh() == "定义"
          ) {
            // 最后一条评论对应的卡片的最后一条评论也是链接，且就是 focusNote 的链接时，此时进行双向移动处理
    
            newContentsIndexArr = this.getNewContentIndexArr()
            if (newContentsIndexArr.length == 0) {
              // 没有新内容，说明此时是直接链接
              // 此时手动加一个 - 然后移动最后一条链接
              this.addMarkdownTextCommentTo("- ", "def")
              this.moveCommentsByIndexArrTo([this.comments.length-1], "def")
            } else {
              // 有新内容，此时说明已经手动输入了文本了，把第一条内容自动加上 “- ”
              // this.moveCommentsByIndexArrTo(newContentsIndexArr, "def")
              newContentsIndexArr = this.getNewContentIndexArr()
              if (newContentsIndexArr.length > 0) {
                newContentsFirstComment = MNComment.new(this.comments[newContentsIndexArr[0]], newContentsIndexArr[0], this.note)
                if (newContentsFirstComment.type == "markdownComment") {
                  newContentsFirstComment.text = newContentsFirstComment.text.toDotPrefix()
                }
                this.moveCommentsByIndexArrTo(newContentsIndexArr, "def")
              }
            }
            
    
            // 对 targetNote 一样处理
            targetNoteNewContentsIndexArr = targetNote.getNewContentIndexArr()
            if (targetNoteNewContentsIndexArr.length == 0) {
              // 没有新内容，说明此时是直接链接
              // 此时手动加一个 - 然后移动最后一条链接
              targetNote.addMarkdownTextCommentTo("- ", "def")
              targetNote.moveCommentsByIndexArrTo([targetNote.comments.length-1], "def")
            } else {
              // 有新内容，此时说明已经手动输入了文本了，新内容的第一条文本评论自动加上“- ”
              // targetNote.moveCommentsByIndexArrTo(newContentsIndexArr, "def")
              targetNoteNewContentsIndexArr = targetNote.getNewContentIndexArr()
              if (targetNoteNewContentsIndexArr.length > 0) {
                newContentsFirstComment = MNComment.new(targetNote.comments[targetNoteNewContentsIndexArr[0]], targetNoteNewContentsIndexArr[0], targetNote.note)
                if (newContentsFirstComment.type == "markdownComment") {
                  newContentsFirstComment.text = newContentsFirstComment.text.toDotPrefix()
                }
                targetNote.moveCommentsByIndexArrTo(targetNoteNewContentsIndexArr, "def")
              }
            }
          } else {
            // 最后一条评论对应的卡片的最后一条评论也是链接，但对应的不是 focusNote 的链接时，就只处理 focusNote
            // newContentsIndexArr = this.getNewContentIndexArr()
            // this.moveCommentsByIndexArrTo(newContentsIndexArr, "def")
            newContentsIndexArr = this.getNewContentIndexArr()
            if (newContentsIndexArr.length > 0) {
              newContentsFirstComment = MNComment.new(this.comments[newContentsIndexArr[0]], newContentsIndexArr[0], this.note)
              if (newContentsFirstComment.type == "markdownComment") {
                newContentsFirstComment.text = newContentsFirstComment.text.toDotPrefix()
              }
              this.moveCommentsByIndexArrTo(newContentsIndexArr, "def")
            }
          }
        }
    
        // 最后刷新一下
        MNUtil.undoGrouping(()=>{
          MNUtil.delay(0.2).then(()=>{
            this.refresh()
            if (targetNote) { targetNote.refresh() }
          })
        })
        break;
      case "归类":
      case "顶层":
        /**
         * 到“相关思考：”下方
         */
        this.moveNewContentTo("thinking")
        break;
      case "文献":
        /**
         * 作者类型的卡片就把新内容移动到个人信息
         */
        if (this.title.includes("作者")) {
          this.moveNewContentTo("info")
        }
        break;
      default:
        /**
         * 移动新内容到“证明”下方（非定义类卡片）
         */
        this.moveNewContentTo("proof")
        break;
    }
  }
  /**
   * 移动新内容到对应的内容的某个地方
   * @param {String} target
   */
  moveNewContentTo(target, toBottom = true) {
    let newContentIndexArr = this.getNewContentIndexArr()
    let targetIndex
    switch (target) {
      /**
       * 证明
       */
      case "proof":
      case "Proof":
        if (toBottom) {
          targetIndex = this.getHtmlCommentIndex("相关思考：")
        } else {
          targetIndex = this.getProofHtmlCommentIndexByNoteType(this.getNoteTypeZh()) + 1
        }
        this.moveCommentsByIndexArr(newContentIndexArr, targetIndex)
        break;

      /**
       * 相关思考
       */
      case "thought":
      case "thoughts":
      case "think":
      case "thinks":
      case "thinking":
      case "idea":
      case "ideas":
        if (toBottom) {
          switch (this.getNoteTypeZh()) {
            case "定义":
              targetIndex = this.getHtmlCommentIndex("相关链接：")
              break;
            case "归类":
            case "顶层":
              targetIndex = this.getHtmlCommentIndex("包含：")
              break;
            default:
              targetIndex = this.getIncludingHtmlCommentIndex("关键词：")
              break;
          }
        } else {
          targetIndex = this.getHtmlCommentIndex("相关思考：") + 1
        }
        this.moveCommentsByIndexArr(newContentIndexArr, targetIndex)
        break;

      
      /**
       * 相关概念
       */
      case "def":
      case "definition":
      case "concept":
      case "concepts":
        if (this.getNoteTypeZh() == "定义") {
          if (toBottom) {
            targetIndex = this.getHtmlCommentIndex("相关思考：")
          } else {
            targetIndex = this.getHtmlCommentIndex("相关概念：") + 1
          }
          this.moveCommentsByIndexArr(newContentIndexArr, targetIndex)
        }
        break;

      /**
       * 相关链接
       */
      case "link":
      case "links":
      case "Link":
      case "Links":
        if (toBottom) {
          if (this.getNoteTypeZh() == "定义") {
            targetIndex = this.comments.length - 1
          } else {
            targetIndex = this.getHtmlCommentIndex("应用：")
          }
        } else {
          targetIndex = this.getHtmlCommentIndex("相关链接：") + 1
        }
        this.moveCommentsByIndexArr(newContentIndexArr, targetIndex)
        break;


      /**
       * 摘录区
       */
      case "excerpt":
      case "excerption":
        if (toBottom) {
          switch (this.getNoteTypeZh()) {
            case "定义":
              targetIndex = this.getHtmlCommentIndex("相关概念：")
              break;
            case "文献":
              targetIndex = this.getHtmlCommentIndex("文献信息：")
              break;
            default:
              targetIndex = this.getProofHtmlCommentIndexByNoteType(this.getNoteTypeZh())
              break;
          }
        } else {
          // top 的话要看摘录区有没有摘录内容
          // - 如果有的话，就放在第一个摘录的前面
          // - 如果没有的话，就和摘录的 bottom 是一样的
          let excerptPartIndexArr = this.getExcerptPartIndexArr()
          if (excerptPartIndexArr.length == 0) {
            switch (this.getNoteTypeZh()) {
              case "定义":
                targetIndex = this.getHtmlCommentIndex("相关概念：")
                break;
              case "文献":
                targetIndex = this.getHtmlCommentIndex("文献信息：")
                break;
              default:
                targetIndex = this.getProofHtmlCommentIndexByNoteType(this.getNoteTypeZh())
                break;
            }
          } else {
            targetIndex = excerptPartIndexArr[0]
          }
        }
        this.moveCommentsByIndexArr(newContentIndexArr, targetIndex)
        break;


      /**
       * 【文献作者卡片】个人信息区
       */
      case "info":
      case "infos":
      case "information":
      case "informations":
        if (toBottom) {
          targetIndex = this.getHtmlCommentIndex("文献：")
        } else {
          targetIndex = this.getHtmlCommentIndex("个人信息：") + 1
        }
        this.moveCommentsByIndexArr(newContentIndexArr, targetIndex)
        break;
    }
  }
  /**
   * 移动指定 index Arr 到对应的内容的某个地方
   */
  moveCommentsByIndexArrTo(indexArr, target, toBottom = true) {
    let targetIndex
    switch (target) {
      /**
       * 置顶
       */
      case "top":
        targetIndex = 0
        this.moveCommentsByIndexArr(indexArr, targetIndex)
        break;
      /**
       * 移动到最底下
       */
      case "bottom":
        targetIndex = this.comments.length - 1
        this.moveCommentsByIndexArr(indexArr, targetIndex)
        break;
      /**
       * 摘录区
       */
      case "excerpt":
      case "excerption":
        if (toBottom) {
          switch (this.getNoteTypeZh()) {
            case "顶层":
            case "归类":
              targetIndex = this.getHtmlCommentIndex("所属")
              break;
            case "定义":
              targetIndex = this.getHtmlCommentIndex("相关概念：")
              break;
            case "文献":
              targetIndex = this.getHtmlCommentIndex("文献信息：")
              break;
            default:
              targetIndex = this.getProofHtmlCommentIndexByNoteType(this.getNoteTypeZh())
              break;
          }
        } else {
          // top 的话要看摘录区有没有摘录内容
          // - 如果有的话，就放在第一个摘录的前面
          // - 如果没有的话，就和摘录的 bottom 是一样的
          let excerptPartIndexArr = this.getExcerptPartIndexArr()
          if (excerptPartIndexArr.length == 0) {
            switch (this.getNoteTypeZh()) {
              case "顶层":
              case "归类":
                targetIndex = this.getHtmlCommentIndex("所属")
                break;
              case "定义":
                targetIndex = this.getHtmlCommentIndex("相关概念：")
                break;
              case "文献":
                targetIndex = this.getHtmlCommentIndex("文献信息：")
                break;
              default:
                targetIndex = this.getProofHtmlCommentIndexByNoteType(this.getNoteTypeZh())
                break;
            }
          } else {
            targetIndex = excerptPartIndexArr[0]
          }
        }
        this.moveCommentsByIndexArr(indexArr, targetIndex)
        break;
      /**
       * 证明
       */
      case "proof":
      case "Proof":
        if (toBottom) {
          targetIndex = this.getHtmlCommentIndex("相关思考：")
        } else {
          targetIndex = this.getProofHtmlCommentIndexByNoteType(this.getNoteTypeZh()) + 1
        }
        this.moveCommentsByIndexArr(indexArr, targetIndex)
        break;

      /**
       * 相关思考
       */
      case "thought":
      case "thoughts":
      case "think":
      case "thinks":
      case "thinking":
      case "idea":
      case "ideas":
        if (toBottom) {
          switch (this.getNoteTypeZh()) {
            case "定义":
              targetIndex = this.getHtmlCommentIndex("相关链接：")
              break;
            case "顶层":
            case "归类":
              targetIndex = this.getHtmlCommentIndex("包含：")
              break;
            case "文献":
              targetIndex = this.getHtmlCommentIndex("参考文献：")
              break;
            default:
              targetIndex = this.getIncludingHtmlCommentIndex("关键词：")
              break;
          }
        } else {
          targetIndex = this.getHtmlCommentIndex("相关思考：") + 1
        }
        this.moveCommentsByIndexArr(indexArr, targetIndex)
        break;

      
      /**
       * 相关概念
       */
      case "def":
      case "definition":
      case "concept":
      case "concepts":
        if (this.getNoteTypeZh() == "定义") {
          if (toBottom) {
            targetIndex = this.getHtmlCommentIndex("相关思考：")
          } else {
            targetIndex = this.getHtmlCommentIndex("相关概念：") + 1
          }
          this.moveCommentsByIndexArr(indexArr, targetIndex)
        }
        break;

      /**
       * 相关链接
       */
      case "link":
      case "links":
      case "Link":
      case "Links":
        if (toBottom) {
          if (this.getNoteTypeZh() == "定义") {
            targetIndex = this.comments.length - 1
          } else {
            targetIndex = this.getHtmlCommentIndex("应用：")
          }
        } else {
          targetIndex = this.getHtmlCommentIndex("相关链接：") + 1
        }
        this.moveCommentsByIndexArr(indexArr, targetIndex)
        break;


      /**
       * 应用
       */
      case "application":
      case "applications":
        if (!["定义", "归类", "顶层"].includes(this.getNoteTypeZh())) {
          if (toBottom) {
            targetIndex = this.comments.length - 1
          } else {
            targetIndex = this.getHtmlCommentIndex("应用：") + 1
          }
          this.moveCommentsByIndexArr(indexArr, targetIndex)
        }
        break;

      
      /**
       * 所属
       */
      case "belong":
      case "belongs":
      case "belongto":
      case "belongsto":
      case "belonging":
        switch (this.getNoteTypeZh()) {
          case "顶层":
            if (toBottom) {
              targetIndex = this.getHtmlCommentIndex("包含：")
            } else {
              targetIndex = this.getHtmlCommentIndex("所属") + 1
            }
            this.moveCommentsByIndexArr(indexArr, targetIndex)
            break;
          case "归类":
            if (toBottom) {
              targetIndex = this.getHtmlCommentIndex("相关思考：")
            } else {
              targetIndex = this.getHtmlCommentIndex("所属") + 1
            }
            this.moveCommentsByIndexArr(indexArr, targetIndex)
            break;
          default:
        }
        break;

      /**
       * 参考文献
       */
      case "ref":
      case "refs":
      case "Ref":
      case "Refs":
      case "reference":
      case "references":
      case "Reference":
      case "References":
        if (toBottom) {
          targetIndex = this.getHtmlCommentIndex("被引用情况：")
        } else {
          targetIndex = this.getHtmlCommentIndex("参考文献：") + 1
        }
        this.moveCommentsByIndexArr(indexArr, targetIndex)
        break;

      /**
       * 文献信息
       */
      case "literature":
        if (toBottom) {
          targetIndex = this.getHtmlCommentIndex("相关思考：")
        } else {
          targetIndex = this.getHtmlCommentIndex("文献信息：") + 1
        }
        this.moveCommentsByIndexArr(indexArr, targetIndex)
        break;

      /**
       * 相关链接
       */
      case "link":
      case "links":
      case "relatedlink":
      case "relatedlinks":
        if (this.getNoteTypeZh() !== "定义") {
          if (toBottom) {
            targetIndex = this.getHtmlCommentIndex("应用：")
          } else {
            targetIndex = this.getHtmlCommentIndex("相关链接：") + 1
          }
          this.moveCommentsByIndexArr(indexArr, targetIndex)
        }
        break;
    }
  }
  /**
   * 【数学】添加文本到对应的内容的某个地方
   */
  addMarkdownTextCommentTo(text, target, toBottom = true) {
    let targetIndex
    switch (target) {
      /**
       * 置顶
       */
      case "top":
        targetIndex = 0
        this.appendMarkdownComment(text, targetIndex)
        break;
      /**
       * 移动到最底下
       */
      case "bottom":
        targetIndex = this.comments.length - 1
        this.appendMarkdownComment(text, targetIndex)
        break;
      /**
       * 摘录区
       */
      case "excerpt":
      case "excerption":
        if (toBottom) {
          switch (this.getNoteTypeZh()) {
            case "定义":
              targetIndex = this.getHtmlCommentIndex("相关概念：")
              break;
            case "文献":
              targetIndex = this.getHtmlCommentIndex("文献信息：")
              break;
            default:
              targetIndex = this.getProofHtmlCommentIndexByNoteType(this.getNoteTypeZh())
              break;
          }
        } else {
          // top 的话要看摘录区有没有摘录内容
          // - 如果有的话，就放在第一个摘录的前面
          // - 如果没有的话，就和摘录的 bottom 是一样的
          let excerptPartIndexArr = this.getExcerptPartIndexArr()
          if (excerptPartIndexArr.length == 0) {
            switch (this.getNoteTypeZh()) {
              case "定义":
                targetIndex = this.getHtmlCommentIndex("相关概念：")
                break;
              case "文献":
                targetIndex = this.getHtmlCommentIndex("文献信息：")
                break;
              default:
                targetIndex = this.getProofHtmlCommentIndexByNoteType(this.getNoteTypeZh())
                break;
            }
          } else {
            targetIndex = excerptPartIndexArr[0]
          }
        }
        this.appendMarkdownComment(text, targetIndex)
        break;
      /**
       * 证明
       */
      case "proof":
      case "Proof":
        if (toBottom) {
          targetIndex = this.getHtmlCommentIndex("相关思考：")
        } else {
          targetIndex = this.getProofHtmlCommentIndexByNoteType(this.getNoteTypeZh()) + 1
        }
        this.appendMarkdownComment(text, targetIndex)
        break;
  
      /**
       * 相关思考
       */
      case "thought":
      case "thoughts":
      case "think":
      case "thinks":
      case "thinking":
      case "idea":
      case "ideas":
        if (toBottom) {
          switch (this.getNoteTypeZh()) {
            case "定义":
              targetIndex = this.getHtmlCommentIndex("相关链接：")
              break;
            case "归类":
              targetIndex = this.getHtmlCommentIndex("包含：")
              break;
            case "文献":
              targetIndex = this.getHtmlCommentIndex("参考文献：")
              break;
            default:
              targetIndex = this.getIncludingHtmlCommentIndex("关键词：")
              break;
          }
        } else {
          targetIndex = this.getHtmlCommentIndex("相关思考：") + 1
        }
        this.appendMarkdownComment(text, targetIndex)
        break;
  
      
      /**
       * 相关概念
       */
      case "def":
      case "definition":
      case "concept":
      case "concepts":
        if (this.getNoteTypeZh() == "定义") {
          if (toBottom) {
            targetIndex = this.getHtmlCommentIndex("相关思考：")
          } else {
            targetIndex = this.getHtmlCommentIndex("相关概念：") + 1
          }
          this.appendMarkdownComment(text, targetIndex)
        }
        break;
  
      /**
       * 相关链接
       */
      case "link":
      case "links":
      case "Link":
      case "Links":
        if (toBottom) {
          if (this.getNoteTypeZh() == "定义") {
            targetIndex = this.comments.length - 1
          } else {
            targetIndex = this.getHtmlCommentIndex("应用：")
          }
        } else {
          targetIndex = this.getHtmlCommentIndex("相关链接：") + 1
        }
        this.appendMarkdownComment(text, targetIndex)
        break;
  
  
      /**
       * 应用
       */
      case "application":
      case "applications":
        if (!["定义", "归类", "顶层"].includes(this.getNoteTypeZh())) {
          if (toBottom) {
            targetIndex = this.comments.length - 1
          } else {
            targetIndex = this.getHtmlCommentIndex("应用：") + 1
          }
          this.appendMarkdownComment(text, targetIndex)
        }
        break;

      /**
       * 参考文献
       */
      case "ref":
      case "refs":
      case "Ref":
      case "Refs":
      case "reference":
      case "references":
      case "Reference":
      case "References":
        if (toBottom) {
          targetIndex = this.getHtmlCommentIndex("被引用情况：")
        } else {
          targetIndex = this.getHtmlCommentIndex("参考文献：") + 1
        }
        this.appendMarkdownComment(text, targetIndex)
        break;

      /**
       * 文献信息
       */
      case "literature":
        if (toBottom) {
          targetIndex = this.getHtmlCommentIndex("相关思考：")
        } else {
          targetIndex = this.getHtmlCommentIndex("文献信息：") + 1
        }
        this.appendMarkdownComment(text, targetIndex)
        break;

      /**
       * 【文献作者卡片】个人信息区
       */
      case "info":
      case "infos":
      case "information":
      case "informations":
        if (toBottom) {
          targetIndex = this.getHtmlCommentIndex("文献：")
        } else {
          targetIndex = this.getHtmlCommentIndex("个人信息：") + 1
        }
        this.appendMarkdownComment(text, targetIndex)
        break;
    }
  }
  /**
   * 获取摘录区的 indexarr （制卡后）
   * 
   * 原理：
   * 判断卡片类型
   * - 定义：“相关概念：”前进行 LinkNote 评论的判断
   * - 文献：“文献信息：”前
   * - 其他：“证明：”（注意反例、思想方法的“证明：”叫法不同）前进行 LinkNote 评论的判断
   */
  getExcerptPartIndexArr() {
    let type = this.getNoteTypeZh()
    let indexArr = []
    let endIndex
    switch (type) {
      case "顶层":
      case "归类":
        endIndex = this.getHtmlCommentIndex("所属")
        break;
      case "定义":
        endIndex = this.getHtmlCommentIndex("相关概念：")
        break;
      case "文献":
        endIndex = this.getHtmlCommentIndex("文献信息：")
        break;
      default:
        endIndex = this.getProofHtmlCommentIndexByNoteType(type)
        break;
    }
    for (let i = 0; i < endIndex; i++) {
      let comment = this.comments[i]
      if (comment.type == "LinkNote") {
        indexArr.push(i)
      }
    }

    return indexArr
  }
  /**
   * 【数学】获取知识类卡片的新加内容的 Index
   * 原理是从应用部分的最后一条链接开始
   */
  getNewContentIndexArr() {
    let indexArr = []
    switch (this.getNoteTypeZh()) {
      case "定义":
        // 定义类卡片获取“相关链接：”下方的第一个非链接开始之后
        indexArr = this.getHtmlBlockNonLinkContentIndexArr("相关链接：")
        break;
      case "归类":
      case "顶层":
        // 归类类卡片获取“包含：”下方的第一个非链接开始之后
        indexArr = this.getHtmlBlockNonLinkContentIndexArr("包含：")
        break;
      case "文献":
        if (this.title.includes("作者")) {
          // 作者卡片，比较特殊，因为要获取“文献：”下方“论文：”后的第一个非链接

          // 这里和 Html 的有点不一样，因为 Markdown Block 是以 Markdown comment 为分界点的，所以这里直接获取 block 的 contents 的 index，最后一个的下一个就是我们要的 indexArr 的开始
          let indexArrAux = this.getMarkdownBlockContentIndexArr("📄 **论文**")
          if (indexArrAux) {
            if (indexArrAux[indexArrAux.length -1] !== this.comments.length-1) {
              // 此时表示下方有新的内容，则从 indexArrAux[indexArrAux.length -1] 开始到末尾作为 indexArr
              indexArr = Array.from({ length: this.comments.length }, (_, index) => index).slice(indexArrAux[indexArrAux.length - 1] + 1)
            }
          } else {
            // 此时说明“论文”下方没有连接
            indexArr = Array.from({ length: this.comments.length }, (_, index) => index).slice(this.getMarkdownCommentIndex("📄 **论文**") + 1)
          }
        } else {
          // 论文书作卡片
          indexArr = this.getHtmlBlockNonLinkContentIndexArr("被引用情况：")
        }
        break;
      default:
        // 非定义类卡片获取“应用”下方的第一个非链接开始之后
        indexArr = this.getHtmlBlockNonLinkContentIndexArr("应用：")
        // 应用部分有点特殊，需要防止“xxx 的应用：”这种文本也被识别，所以需要额外处理
        if (indexArr.length !== 0) {
          for (let i = 0; i < indexArr.length; i++) {
            let index = indexArr[i]
            let comment = this.comments[index]
            if (
              !MNUtil.isCommentLink(comment)
            ) {
              if (
                comment.text && 
                comment.text.includes("的应用")
              ) {
                continue
              } else {
                indexArr = indexArr.slice(i)
                break
              }
            }
          }
        }
        break;
    }
    return indexArr
  }
  /**
   * 获取某个 Html Block 中第一个非链接到最后的 Index Arr
   * 函数名中的 NonLink 不是指内容都是非链接
   * 而是指第一条是非链接，然后从这个开始到后面的都保留
   */
  getHtmlBlockNonLinkContentIndexArr (htmltext) {
    let indexArr = this.getHtmlBlockContentIndexArr(htmltext)
    let findNonLink = false
    if (indexArr.length !== 0) {
      // 从头开始遍历，检测是否是链接，直到找到第一个非链接就停止
      // bug：如果下方是链接，也会被识别
      for (let i = 0; i < indexArr.length; i++) {
        let index = indexArr[i]
        let comment = this.comments[index]
        if (
          !MNUtil.isCommentLink(comment)
        ) {
          // 不处理 # 开头的文本，因为这种文本是用作标题链接，不能被识别为新内容
          if (comment.type == "TextNote" && comment.text.startsWith("#")) {
            continue
          }
          indexArr = indexArr.slice(i)
          findNonLink = true
          break
        }
      }
      if (!findNonLink) {
        // 只有链接时，仍然返回数组
        return []
      }
    }
    return indexArr
  }
  /**
   * 获取某个 Html Block 从最后一个开始检测，是摘录就往前，直到不是摘录
   */
  getHtmlBlockContinuousExcerptToEndContentIndexArr (htmltext) {
    let indexArr = this.getHtmlBlockContentIndexArr(htmltext)
    let continuousExcerptCommentsToEnd = true
    let breakIndex = indexArr.length-1
    if (indexArr.length !== 0) {
      for (let i = indexArr.length-1; i >= 0 ; i--) {
        let index = indexArr[i]
        let comment = this.comments[index]
        if (
          comment.type == "LinkNote" && continuousExcerptCommentsToEnd
        ) {
          continue
        } else {
          continuousExcerptCommentsToEnd = false
          breakIndex = i + 1 // 此时说明前一个（也就是下一条评论是最后连续的摘录）
          break
        }
      }
      if (this.comments[indexArr[indexArr.length-1]].type == "LinkNote") {
        // 只有最后一个评论是摘录，才处理
        return indexArr.slice(breakIndex)
      } else {
        return []
      }
    }
  }
  /**
   * 类似于 getHtmlBlockIndexArr 获取 markdownComment Block 的 IndexArr
   */
  getMarkdownBlockIndexArr (markdowntext) {
    let markdownCommentIndex = this.getMarkdownCommentIndex(markdowntext)
    let indexArr = []
    if (markdownCommentIndex !== -1) {
      // 获取下一个 markdown 评论的 index
      let nextMarkdownCommentIndex = this.getNextMarkdownCommentIndex(markdowntext)
      if (nextMarkdownCommentIndex == -1) {
        // 如果没有下一个 markdown 评论，则以 markdownCommentIndex 到最后一个评论作为 block
        for (let i = markdownCommentIndex; i <= this.comments.length-1; i++) {
          indexArr.push(i)
        }
      } else {
        // 有下一个 markdown 评论，则以 markdownCommentIndex 到 nextMarkdownCommentIndex 之间的评论作为 block
        for (let i = markdownCommentIndex; i < nextMarkdownCommentIndex; i++) {
          indexArr.push(i)
        }
      }
    }
    return indexArr
  }
  /**
   * 获取第一个出现的 markdowncomment 的 index
   */
  getMarkdownCommentIndex (markdowncomment) {
    const comments = this.note.comments
    for (let i = 0; i < comments.length; i++) {
      // const _comment = comments[i]
      const _comment = MNComment.new(comments[i], i, this.note)
      if (
        _comment.type == "markdownComment" &&
        _comment.text == markdowncomment
      ) {
        return i
      }
    }
    return -1
  }
  getNextMarkdownCommentIndex (markdowncomment) {
    let indexArr = this.getMarkdownCommentsIndexArr()
    let markdownCommentIndex = this.getMarkdownCommentIndex(markdowncomment)
    let nextMarkdownCommentIndex = -1
    if (markdownCommentIndex !== -1) {
      let nextIndex = indexArr.indexOf(markdownCommentIndex) + 1
      if (nextIndex < indexArr.length) {
        nextMarkdownCommentIndex = indexArr[nextIndex]
      }
    }
    return nextMarkdownCommentIndex
  }
  getMarkdownCommentsIndexArr () {
    let indexArr = []
    for (let i = 0; i < this.comments.length; i++) {
      let comment = MNComment.new(this.comments[i], i, this.note)
      if (comment.type == "markdownComment") {
        indexArr.push(i)
      }
    }

    return indexArr
  }
  /**
   * 类似于 getMarkdownBlockContentIndexArr，获取 markdownComment Block 的「内容」的 IndexArr
   */
  getMarkdownBlockContentIndexArr (markdowntext) {
    let arr = this.getMarkdownBlockIndexArr(markdowntext)
    if (arr.length > 0) {
      arr.shift()  // 去掉 html 评论的 index
    }
    return arr
  }
  /**
   * 类似于 getHtmlBlockNonLinkContentIndexArr，要获取 markdownComment Block 的非链接到最后的 IndexArr
   * 
   * 和 Html 有点不同，如果直接仿照 Html 处理的话，新的 markdownComment 会被识别为下一个 Block，
   */
  getMarkdownBlockNonLinkContentIndexArr (markdowntext) {
    let indexArr = this.getMarkdownBlockContentIndexArr(markdowntext)
    let findNonLink = false
    if (indexArr.length !== 0) {
      // 从头开始遍历，检测是否是链接，直到找到第一个非链接就停止
      // bug：如果下方是链接，也会被识别
      for (let i = 0; i < indexArr.length; i++) {
        let index = indexArr[i]
        let comment = this.comments[index]
        if (
          !MNUtil.isCommentLink(comment)
        ) {
          // 不处理 # 开头的文本，因为这种文本是用作标题链接，不能被识别为新内容
          if (comment.type == "TextNote" && comment.text.startsWith("#")) {
            continue
          }
          indexArr = indexArr.slice(i)
          findNonLink = true
          break
        }
      }
      if (!findNonLink) {
        // 只有链接时，仍然返回数组
        return []
      }
    }
    return indexArr
  }
  /**
   * 【数学】获取 this 的 noteType
   * 可能返回字符串，也可能返回对象
   */
  getNoteType() {
    let noteType
    if (this.ifIndependentNote()) {
      // 独立卡片根据颜色判断
      noteType = MNUtil.getNoteZhTypeByNoteColorIndex(this.note.colorIndex)
    } else {
      // 有归类父卡片则根据父卡片的标题判断
      noteType = this.getNoteTypeObjByClassificationParentNoteTitle()
    }
    return noteType
  }
  /**
   * 返回中文的 noteType
   */
  getNoteTypeZh() {
    let noteType
    let noteColorIndex = this.note.colorIndex
    if (this.ifReferenceNote()) {
      return "文献"
    } else {
      if (this.ifIndependentNote()) {
        // 独立卡片根据颜色判断
        noteType = MNUtil.getNoteZhTypeByNoteColorIndex(this.note.colorIndex)
        return noteType
      } else {
        // 有归类父卡片则根据父卡片的标题判断
        if (noteColorIndex == 0 || noteColorIndex == 4) {
          /**
           * 黄色归类卡片
           */
          return "归类"
        } else if (noteColorIndex == 1) {
          /**
           * 绿色归类卡片
           */
          return "顶层"
        } else {
          noteType = this.getNoteTypeObjByClassificationParentNoteTitle()
          if (noteType) {
            return noteType.zh
          } else {
            return "独立"
          }
        }
      }
    }
  }
  /**
   * 【数学】是否是独立卡片，即没有归类父卡片的卡片
   */
  ifIndependentNote(){
    if (this.note.colorIndex == 1) {
      // 绿色卡片单独处理，始终作为非独立卡片
      return false
    } else {
      if (this.ifReferenceNote()) {
        return false
      } else {
        let parentNote = this.getClassificationParentNote()
        if (parentNote === undefined) {
          if (!(/【定义|【命题|【例子|【反例|【思想方法/.test(this.parentNote.title))) {
            return true 
          } else {
            let parentNoteTitle = this.parentNote.noteTitle
            let match = parentNoteTitle.match(/“.*”相关(.*)/)
            // 如果归类卡片的“相关 xx”的 xx 是空的，此时作为 Inbox 专用归类，此时视为下面的知识类卡片为独立的
            if (match) {
              return match[1] == ""
            } else {
              // return true
              return !(/定义|命题|例子|反例|思想方法/.test(this.parentNote.title))
            }
          }
        }
      }
    }
  }
  isIndependentNote(){
    return this.ifIndependentNote()
  }
  /**
   * 【数学】获得最新的一个“应用”的 Index
   * 除了 HtmlNote，后面可能出现“xxx 的应用：”，这些要避免被识别为新内容
   */
  /**
   * 【数学】根据归类的父卡片标题获取 note 的类型
   * @returns {Object} zh 和 en 分别是类型的中英文版本
   */
  getNoteTypeObjByClassificationParentNoteTitle(){
    let parentNote = this.getClassificationParentNote()
    let parentNoteTitle = parentNote.noteTitle
    let match = parentNoteTitle.match(/“.*”相关(.*)/)
    let noteType = {}
    if (match) {
      noteType.zh = match[1]
      noteType.en = MNUtil.getEnNoteTypeByZhVersion(noteType.zh)

      return noteType
    }
    return undefined
  }
  /**
   * 【数学】获取到第一次出现的黄色或绿色的父卡片
   * 检测父卡片是否是淡黄色、淡绿色或黄色的，不是的话获取父卡片的父卡片，直到是为止，获取第一次出现特定颜色的父卡片作为 parentNote
   */
  getClassificationParentNote(){
    let ifParentNoteChosen = false 
    let parentNote = this.parentNote
    if (parentNote) {
      while (parentNote) {
        if (
          // (parentNote.colorIndex == 0 || parentNote.colorIndex == 1 || parentNote.colorIndex == 4) && parentNote.title
          (parentNote.colorIndex == 0 || parentNote.colorIndex == 1 || parentNote.colorIndex == 4) && (/相关/.test(parentNote.title))
        ) {
          ifParentNoteChosen = true
          break
        }
        parentNote = parentNote.parentNote
      }
      if (!ifParentNoteChosen) {
        parentNote =  undefined
      }
      return parentNote
    } else {
      return undefined
    }
  }
  /**
   * 根据卡片类型合并不同的卡片
   */
  mergeTemplateByNoteType(type){
    let templateNoteId
    if (MNUtil.isObj(type)) {
      templateNoteId = MNUtil.getTemplateNoteIdByZhType(type.zh)
    } else if (typeof type == "string") {
      templateNoteId = MNUtil.getTemplateNoteIdByZhType(type)
    }
    this.mergeClonedNoteFromId(templateNoteId)
  }
  /**
   * 判断卡片是不是旧模板制作的
   */
  ifTemplateOldVersion(){
    // let remarkHtmlCommentIndex = this.getHtmlCommentIndex("Remark：")
    return this.getHtmlCommentIndex("Remark：") !== -1 || (this.getHtmlCommentIndex("所属") !== -1 && this.getNoteTypeZh()!== "归类" && this.getNoteTypeZh()!== "顶层")
  }
  ifMadeByOldTemplate(){
    return this.ifTemplateOldVersion()
  }
  /**
   * 根据类型去掉评论
   */
  removeCommentsByTypes(types){
    if (typeof types == "string") {
      // 兼容 types 本身是字符串的情形
      this.removeCommentsByOneType(types)
    } else {
      if (Array.isArray(types)) {
        types.forEach(type => {
          this.removeCommentsByOneType(type)
        });
      }
    }
  }
  removeCommentsByType(type){
    this.removeCommentsByTypes(type)
  }
  /**
   * @param {String} type
   */
  removeCommentsByOneType(type){
    if (typeof type == "string") {
      switch (type) {
        /**
         * 链接
         */
        case "link":
        case "links":
        case "Link":
        case "Links":
        case "alllink":
        case "alllinks":
        case "allLink":
        case "allLinks":
          for (let i = this.comments.length-1; i >= 0; i--) {
            let comment = this.comments[i]
            if (
              comment.type == "TextNote" &&
              (
                comment.text.includes("marginnote3") ||
                comment.text.includes("marginnote4")
              )
            ) {
              this.removeCommentByIndex(i)
            }
          }
          break;
        
        /**
         * 手写
         */
        case "paint":
        case "painting":
        case "Paint":
        case "Painting":
        case "Handwriting":
        case "HandWriting":
        case "handwriting":
          for (let i = this.comments.length-1; i >= 0; i--) {
            let comment = this.comments[i]
            if (
              comment.type == "PaintNote"
            ) {
              this.removeCommentByIndex(i)
            }
          }
          break;

        /**
         * 所有文本（不包括链接）
         */
        case "text":
        case "Text":
        case "alltext":
        case "allText":
          for (let i = this.comments.length-1; i >= 0; i--) {
            let comment = this.comments[i]
            if (
              comment.type == "HtmlNote" ||
              (
                comment.type == "TextNote" &&
                !(
                  comment.text.includes("marginnote3") ||
                  comment.text.includes("marginnote4")
                )
              )
            ) {
              this.removeCommentByIndex(i)
            }
          }
          break;

        /**
         * Markdown 文本
         */
        case "markdown":
        case "Markdown":
        case "md":
        case "MD":
        case "MarkdownText":
        case "mdtext":
        case "MdText":
        case "mdText":
        case "Mdtext":
        case "Markdowntext":
          for (let i = this.comments.length-1; i >= 0; i--) {
            let comment = this.comments[i]
            if (
              comment.type == "TextNote" &&
              !(
                comment.text.includes("marginnote3") ||
                comment.text.includes("marginnote4")
              )
            ) {
              this.removeCommentByIndex(i)
            }
          }
          break;

        /**
         * Html 文本
         */
        case "html":
        case "Html":
        case "HTML":
        case "HtmlText":
        case "htmltext":
        case "Htmltext":
        case "htmlText":
          for (let i = this.comments.length-1; i >= 0; i--) {
            let comment = this.comments[i]
            if (
              comment.type == "HtmlNote"
            ) {
              this.removeCommentByIndex(i)
            }
          }
          break;

        /**
         * 摘录
         */
        case "excerpt":
        case "excerpts":
        case "Excerpt":
        case "Excerpts":
        case "LinkNote":
        case "LinkNotes":
        case "linknote":
        case "linknotes":
          for (let i = this.comments.length-1; i >= 0; i--) {
            let comment = this.comments[i]
            if (
              comment.type == "LinkNote"
            ) {
              this.removeCommentByIndex(i)
            }
          }
          break;

        default:
          MNUtil.showHUD('No "' + type + '" type!')
          break;
      }
    }
  }

  /**
   * 将卡片转化为非摘录版本
   */
  toNoExceptVersion(){
    if (this.parentNote) {
      if (this.excerptText) { // 把摘录内容的检测放到 toNoExceptVersion 的内部
        let parentNote = this.parentNote
        let config = {
          title: this.noteTitle,
          content: "",
          markdown: true,
          color: this.colorIndex
        }
        // 创建新兄弟卡片，标题为旧卡片的标题
        let newNote = parentNote.createChildNote(config)
        this.noteTitle = ""
        // 将旧卡片合并到新卡片中
        this.mergeInto(newNote)
        newNote.focusInMindMap(0.2)
      }
    } else {
      MNUtil.showHUD("没有父卡片，无法进行非摘录版本的转换！")
    }
  }

  toNoExceptType(){
    this.toNoExceptVersion()
  }

  toNonExceptVersion(){
    this.toNoExceptVersion()
  }

  toNonExceptType(){
    this.toNoExceptVersion()
  }

  /**
   * 合并到目标卡片并更新链接
   * 1. 更新新卡片里的链接（否则会丢失蓝色箭头）
   * 2. 双向链接对应的卡片里的链接要更新，否则合并后会消失
   * 
   * 不足
   * - this 出发的单向链接无法处理
   * 
   * 注意：和 MN 自己的合并不同，this 的标题会处理为评论，而不是添加到 targetNote 的标题
   */
  mergeInto(targetNote, htmlType = "none"){
    // 合并之前先更新链接
    this.renewLinks()

    let oldComments = this.MNComments
    oldComments.forEach((comment, index) => {
      // if (comment.type == "linkComment" && comment.linkDirection == "both") {
      if (comment.type == "linkComment" && this.LinkIfDouble(comment.text)) {
        let linkedNote = MNNote.new(comment.text.toNoteId())
        let linkedNoteComments = linkedNote.MNComments
        let indexArrInLinkedNote = linkedNote.getLinkCommentsIndexArr(this.noteId.toNoteURL())
        // 把 this 的链接更新为 targetNote 的链接
        indexArrInLinkedNote.forEach(index => {
          // linkedNoteComments[index].text = targetNote.noteURL
          // linkedNoteComments[index].detail.text = targetNote.noteURL
          // linkedNote.replaceWithMarkdownComment(targetNote.noteURL,linkedNoteComments[index].index)
          linkedNote.replaceWithMarkdownComment(targetNote.noteURL, index)
        })
      }
    })

    if (this.title) {
      targetNote.appendMarkdownComment(
        HtmlMarkdownUtils.createHtmlMarkdownText(this.title.toNoBracketPrefixContent(), htmlType)
      )
      this.title = ""
    }

    // 检测 this 的第一条评论对应是否是 targetNote 是的话就去掉
    if (this.comments[0] && this.comments[0].text && (this.comments[0].text == targetNote.noteURL)) {
      this.removeCommentByIndex(0)
    }


    // 合并到目标卡片
    targetNote.merge(this)

    // 最后更新一下合并后的链接
    let targetNoteComments = targetNote.MNComments
    for (let i = 0; i < targetNoteComments.length; i++) {
      let targetNotecomment = targetNoteComments[i]
      if (targetNotecomment.type == "linkComment") {
        targetNotecomment.text = targetNotecomment.text
      }
    }
  }

  /**
   * 把 this 合并到 targetNote, 然后移动到 targetIndex 位置
   * 和默认合并不同的是：this 的标题不会合并为标题，而是变成评论
   * 
   * @param {MNNote} targetNote 
   * @param {Number} targetIndex 
   */
  mergeIntoAndMove(targetNote, targetIndex, htmlType = "none"){
    // let commentsLength = this.comments.length
    // if (this.title) {
    //   commentsLength += 1  // 如果有标题的话，合并后会处理为评论，所以要加 1
    // }
    // if (this.excerptText) {
    //   commentsLength += 1  // 如果有摘录的话，合并后也会变成评论，所以要加 1
    // }

    // 要把 targetNote 的这一条链接去掉，否则会多移动一条评论
    let commentsLength = this.comments.length + !!this.title + !!this.excerptText - (this.comments && this.comments[0].text && this.comments[0].text == targetNote.noteURL)

    this.mergeInto(targetNote, htmlType)

    // 生成从 targetNote.comments.length - commentsLength 到 targetNote.comments.length - 1 的数组
    let targetNoteCommentsToMoveArr = [...Array(commentsLength)].map((_, i) => targetNote.comments.length - commentsLength + i)

    targetNote.moveCommentsByIndexArr(targetNoteCommentsToMoveArr, targetIndex)
  }

  /**
   * 更新占位符的内容
   */
  mergIntoAndRenewReplaceholder(targetNote, htmlType = "none"){
    let targetIndex = targetNote.getCommentIndex(this.noteURL)
    if (targetIndex !== -1) {
      // if (this.comments[0].text && this.comments[0].text == targetNote.noteURL) {
      //   // 此时表示的情景：从某个命题双向链接到空白处，生成的占位符
      //   // 所以合并前把第一条评论删掉

      //   // bug: 删掉的话，下一步就无法根据这条评论来改变 point 和 subpoint 了
      //   /  fix: 把这个删除放到 mergeInto 里
      //   this.removeCommentByIndex(0)
      // }
      if (this.title.startsWith("【占位】")){
        this.title = ""
      }
      this.mergeIntoAndMove(targetNote, targetIndex +1, htmlType)
      targetNote.removeCommentByIndex(targetIndex) // 删除占位符
    }
  }


  /**
   * 判断卡片中是否有某个链接
   */
  hasLink(link){
    if (link.ifNoteIdorURL()) {
      let URL = link.toNoteURL()
      return this.getCommentIndex(URL) !== -1
    }
  }

  /**
   * 判断链接的类型：是单向链接还是双向链接
   * @param {string} link
   * @returns {String} "Double"|"Single"
   */
  LinkGetType(link){
    // 兼容一下 link 是卡片 comment 的情形
    if (MNUtil.isObj(link) && link.type == "TextNote") {
      link = link.text
    }
    if (link.ifNoteIdorURL()) {
      // 先确保参数是链接的 ID 或者 URL
      let linkedNoteId = link.toNoteID()
      let linkedNoteURL = link.toNoteURL()
      if (this.hasLink(linkedNoteURL)) {
        let linkedNote = MNNote.new(linkedNoteId)
        return linkedNote.hasLink(this.noteURL) ? "Double" : "Single"
      } else {
        MNUtil.showHUD("卡片中没有此链接！")
        return "NoLink"
      }
    } else {
      MNUtil.showHUD("参数不是合法的链接 ID 或 URL！")
    }
  }

  /**
   * 是否是单向链接
   * @param {string} link
   * @returns {Boolean}
   */
  LinkIfSingle(link){
    return this.LinkGetType(link) === "Single"
  }

  /**
   * 是否是双向链接
   * @param {string} link
   * @returns {Boolean}
   */
  LinkIfDouble(link){
    return this.LinkGetType(link) === "Double"
  }

  renew(){
    let noteType = this.getNoteTypeZh()
    /**
     * 更新链接
     */
    this.renewLinks()

    /**
     * 转换为非摘录版本
     */
    if (this.excerptText) {
      this.toNoExceptVersion()
    }

    if (noteType == "文献") {
      if (this.ifOldReferenceNote()) {
        /**
         * 重新处理旧文献卡片
         * 
         * 只保留
         * 1. 标题（去掉前面的【】）
         * 2. 摘录
         * 
         * 也就是去掉所有文本
         */

        // 处理标题
        // 此处不处理标题，否则后续
        // this.title = this.title.toReferenceNoteTitle()

        // 去掉文本
        this.removeCommentsByTypes(["text","link"])
      }
    } else {
      /**
       * 检测是否是旧模板制作的卡片
       */
      if (this.ifTemplateOldVersion()) {
        /**
         * 旧模板卡片则只保留
         * 1. 标题
         * 2. 摘录
         * 3. 手写
         * 4. 图片
         * 也就是要去掉
         * 1. 文本
         * 2. 链接
         * i.e. 去掉所有的 TextNote
         * 但是保留原本的部分的链接
         *   - 原本的证明中相关知识的部分
         *   - 原本的证明中体现的思想方法的部分
         * 
         * 检测标题是否是知识类卡片的标题，如果是的话要把前缀去掉，否则会影响后续的添加到复习
         */
        if (this.noteTitle.ifKnowledgeNoteTitle()) {
          this.noteTitle = this.noteTitle.toKnowledgeNoteTitle()
        }

        // // 获取“证明过程相关知识：”的 block 内容
        // let proofKnowledgeBlockTextContentArr = this.getHtmlBlockTextContentArr("证明过程相关知识：")
        
        // // 获取“证明体现的思想方法：”的 block 内容
        // let proofMethodBlockTextContentArr = this.getHtmlBlockTextContentArr("证明体现的思想方法：")

        // // 获取“应用：”的 block 内容
        // let applicationBlockTextContentArr = this.getHtmlBlockTextContentArr("应用：")

        // 去掉所有的文本评论和链接
        this.removeCommentsByTypes(["text","link"])

        // // 重新添加两个 block 的内容
        // proofKnowledgeBlockTextContentArr.forEach(text => {
        //   this.appendMarkdownComment(text)
        // })

        // proofMethodBlockTextContentArr.forEach(text => {
        //   this.appendMarkdownComment(text)
        // })

        // applicationBlockTextContentArr.forEach(text => {
        //   this.appendMarkdownComment(text)
        // })
      } else {
        /**
         * 其它类型的旧卡片
         */

        if (
          this.noteTitle.ifKnowledgeNoteTitle() &&
          (
            this.getCommentIndex("由来/背景：") !== -1 ||
            this.getCommentIndex("- ") !== -1 ||
            this.getCommentIndex("-") !== -1 ||
            this.getHtmlCommentIndex("所属") !== -1
          )
        ) {
          this.noteTitle = this.noteTitle.toKnowledgeNoteTitle()
        }

        /**
         * 删除一些特定的文本
         */
        if (noteType!== "归类" && noteType!== "顶层") {
          this.removeCommentsByText(
            [
              "零层",
              "一层",
              "两层",
              "三层",
              "四层",
              "五层",
              "由来/背景：",
              "- 所属",
              "所属"
            ]
          )
        } else {
          this.removeCommentsByText(
            [
              "零层",
              "一层",
              "两层",
              "三层",
              "四层",
              "五层",
              "由来/背景：",
              "- 所属",
            ]
          )
        }

        this.removeCommentsByTrimText(
          "-"
        )

        /**
         * 更新 Html 评论
         */
        this.renewHtmlCommentFromId("关键词：", "13D040DD-A662-4EFF-A751-217EE9AB7D2E")
        this.renewHtmlCommentFromId("相关定义：", "341A7B56-8B5F-42C8-AE50-61F7A1276FA1")

        /**
         * 根据父卡片或者是卡片颜色（取决于有没有归类的父卡片）来修改 Html 版本
         */
        if (noteType !== "归类" && noteType !== "顶层") {
          // 修改对应 “证明：”的版本
          let proofHtmlCommentIndex = this.getProofHtmlCommentIndexByNoteType(noteType)
          if (proofHtmlCommentIndex == -1) {
            // 此时要先找到不正确的 proofHtmlComment 的 Index，然后删除掉
            this.getRenewProofHtmlCommentByNoteType(noteType)
          }
        } else {
          // 去掉“相关xx：” 改成“相关思考：”
          let oldRelatedHtmlCommentIndex = this.getIncludingHtmlCommentIndex("相关")
          let includeHtmlCommentIndex = this.getHtmlCommentIndex("包含：")
          if (includeHtmlCommentIndex !== -1) { // 原本合并过模板的才需要处理
            if (oldRelatedHtmlCommentIndex == -1) {
              this.mergeClonedNoteById("B3CAC635-F507-4BCF-943C-B3F9D4BF6D1D")
              this.moveComment(this.comments.length-1, includeHtmlCommentIndex)
            } else {
              this.removeCommentByIndex(oldRelatedHtmlCommentIndex)
              this.mergeClonedNoteById("B3CAC635-F507-4BCF-943C-B3F9D4BF6D1D")
              this.moveComment(this.comments.length-1, oldRelatedHtmlCommentIndex)
            }
          }
        }

        /**
         * 调整 Html Block 的结构
         */
        if (this.getNoteTypeZh() == "定义") {
          /**
           * 定义类卡片，按照
           * - 相关概念：
           * - 相关思考：
           * - 相关链接：
           * 的顺序
           */
          this.moveHtmlBlockToBottom("相关概念：")
          this.moveHtmlBlockToBottom("相关思考：")
          this.moveHtmlBlockToBottom("相关链接：")
        } else {
          // 非定义类卡片
          /**
           * 将“应用：”及下方的内容移动到最下方
           */
          if (this.getNoteTypeZh()!== "归类" && this.getNoteTypeZh() !== "顶层"){
            this.moveHtmlBlockToBottom("相关思考：")
          }
          // this.moveHtmlBlockToBottom("关键词：")
          let keywordHtmlCommentIndex = this.getIncludingHtmlCommentIndex("关键词：")
          if (keywordHtmlCommentIndex !== -1) {
            this.moveComment(keywordHtmlCommentIndex, this.comments.length-1)
          }
          this.moveHtmlBlockToBottom("相关链接：")
          this.moveHtmlBlockToBottom("应用：")
        }

        /**
         * 刷新卡片
         */
        this.refresh()
      }
    }

  }

  renewNote(){
    this.renew()
  }

  renewCard(){
    this.renew()
  }

  getIncludingHtmlCommentIndex(htmlComment){
    const comments = this.note.comments
    for (let i = 0; i < comments.length; i++) {
      const _comment = comments[i]
      if (
        typeof htmlComment == "string" &&
        _comment.type == "HtmlNote" &&
        _comment.text.includes(htmlComment)
      ) {
        return i
      }
    }
    return -1
  }

  renewHtmlCommentFromId(comment, id) {
    if (typeof comment == "string") {
      let index = this.getHtmlCommentIndex(comment)
      if (index !== -1){
        this.removeCommentByIndex(index)
        this.mergeClonedNoteFromId(id)
        this.moveComment(this.comments.length-1, index)
      }
    } else {
      MNUtil.showHUD("只能更新文本类型的评论！")
    }
  }

  renewHtmlCommentById(comment, id) {
    this.renewHtmlCommentFromId(comment, id)
  }

  mergeClonedNoteFromId(id){
    let note = MNNote.clone(id)
    this.merge(note.note)
  }

  mergeClonedNoteById(id){
    this.mergeClonedNoteFromId(id)
  }

  /**
   * 根据内容删除文本评论
   */
  removeCommentsByContent(content){
    this.removeCommentsByText(content)
  }

  removeCommentsByTrimContent(content){
    this.removeCommentsByText(content)
  }

  removeCommentsByText(text){
    if (typeof text == "string") {
      this.removeCommentsByOneText(text)
    } else {
      if (Array.isArray(text)) {
        text.forEach(t => {
          this.removeCommentsByOneText(t)
        })
      }
    }
  }

  removeCommentsByTrimText(text){
    if (typeof text == "string") {
      this.removeCommentsByOneTrimText(text)
    } else {
      if (Array.isArray(text)) {
        text.forEach(t => {
          this.removeCommentsByOneTrimText(t)
        })
      }
    }
  }

  // aux function
  removeCommentsByOneText(text){
    if (typeof text == "string") {
      for (let i = this.comments.length-1; i >= 0; i--) {
        let comment = this.comments[i]
        if (
          (
            comment.type == "TextNote" ||
            comment.type == "HtmlNote"
          )
          &&
          comment.text == text
        ) {
          this.removeCommentByIndex(i)
        }
      }
    }
  }

  removeCommentsByOneTrimText(text){
    if (typeof text == "string") {
      for (let i = this.comments.length-1; i >= 0; i--) {
        let comment = this.comments[i]
        if (
          (
            comment.type == "TextNote" ||
            comment.type == "HtmlNote"
          )
          &&
          comment.text.trim() == text
        ) {
          this.removeCommentByIndex(i)
        }
      }
    }
  }

  /**
   * 刷新卡片
   */
  // refresh(){
  //   this.note.appendMarkdownComment("")
  //   this.note.removeCommentByIndex(this.note.comments.length-1)
  // }

  async refresh(delay = 0){
    if (delay) {
      await MNUtil.delay(delay)
    }
    this.note.appendMarkdownComment("")
    this.note.removeCommentByIndex(this.note.comments.length-1)
  }

  /**
   * 更新卡片里的链接
   * 1. 将 MN3 链接转化为 MN4 链接
   * 2. 去掉所有失效链接
   * 3. 修复合并造成的链接失效问题
   * 4. “应用”下方去重
   */
  LinkRenew(){
    this.convertLinksToNewVersion()
    this.clearFailedLinks()
    this.fixProblemLinks()

    // 应用去重
    let applicationHtmlCommentIndex = Math.max(
      this.getIncludingHtmlCommentIndex("应用："),
      this.getIncludingCommentIndex("的应用")
    )
    if (applicationHtmlCommentIndex !== -1) {
      this.linkRemoveDuplicatesAfterIndex(applicationHtmlCommentIndex)
    }
  }

  renewLink(){
    this.LinkRenew()
  }

  renewLinks(){
    this.LinkRenew()
  }

  LinksRenew(){
    this.LinkRenew()
  }

  clearFailedLinks(){
    for (let i = this.comments.length-1; i >= 0; i--) {
      let comment = this.comments[i]
      if  (
        comment.type == "TextNote" &&
        (
          comment.text.startsWith("marginnote3app://note/") ||
          comment.text.startsWith("marginnote4app://note/") 
        )
      ) {
        let targetNoteId = comment.text.match(/marginnote[34]app:\/\/note\/(.*)/)[1]
        if (!targetNoteId.includes("/summary/")) {  // 防止把概要的链接删掉了
          let targetNote = MNNote.new(targetNoteId)
          if (!targetNote) {
            this.removeCommentByIndex(i)
          }
        }
      }
    }
  }


  // 修复合并造成的链接问题
  fixProblemLinks(){
    let comments = this.MNComments
    comments.forEach((comment) => {
      if (comment.type = "linkComment") {
        let targetNote = MNNote.new(comment.text)
        if (targetNote && targetNote.groupNoteId) {
          if (
            targetNote.groupNoteId !== comment.text
          ) {
            comment.text = targetNote.groupNoteId.toNoteURL()
          }
        }
      }
    })
  }

  linkRemoveDuplicatesAfterIndex(startIndex){
    let links = new Set()
    if (startIndex < this.comments.length-1) {
      // 下面先有内容才处理
      for (let i = this.comments.length-1; i > startIndex; i--){
        let comment = this.comments[i]
        if (
          comment.type = "TextNote" && comment.text &&
          comment.text.includes("marginnote4app://note/")
        ) {
          if (links.has(comment.text)) {
            this.removeCommentByIndex(i)
          } else {
            links.add(comment.text)
          }
        }
      }
    }
  }

  LinkClearFailedLinks(){
    this.clearFailedLinks()
  }

  LinksConvertToMN4Version(){
    for (let i = this.comments.length-1; i >= 0; i--) {
      let comment = this.comments[i]
      if (
        comment.type == "TextNote" &&
        comment.text.startsWith("marginnote3app://note/")
      ) {
        let targetNoteId = comment.text.match(/marginnote3app:\/\/note\/(.*)/)[1]
        let targetNote = MNNote.new(targetNoteId)
        if (targetNote) {
          this.removeCommentByIndex(i)
          this.appendNoteLink(targetNote, "To")
          this.moveComment(this.comments.length-1, i)
        } else {
          this.removeCommentByIndex(i)
        }
      }
    }
  }

  convertLinksToMN4Version(){
    this.LinksConvertToMN4Version()
  }

  LinksConvertToNewVersion(){
    this.LinksConvertToMN4Version()
  }

  convertLinksToNewVersion(){
    this.LinksConvertToMN4Version()
  }


  /**
   * 将某一个 Html 评论到下一个 Html 评论之前的内容（不包含下一个 Html 评论）进行移动
   * 将 Html 评论和下方的内容看成一整个块，进行移动
   * 注意此函数会将 Html 评论和下方的内容一起移动，而不只是下方内容
   * @param {String} htmltext Html 评论，定位的锚点
   * @param {Number} toIndex 目标 index
   */
  moveHtmlBlock(htmltext, toIndex) {
    if (this.getHtmlCommentIndex(htmltext) !== -1) {
      let htmlBlockIndexArr = this.getHtmlBlockIndexArr(htmltext)
      this.moveCommentsByIndexArr(htmlBlockIndexArr, toIndex)
    }
  }

  /**
   * 移动 HtmlBlock 到最下方
   * @param {String} htmltext Html 评论，定位的锚点
   */
  moveHtmlBlockToBottom(htmltext){
    this.moveHtmlBlock(htmltext, this.comments.length-1)
  }

  /**
   * 移动 HtmlBlock 到最上方
   * @param {String} htmltext Html 评论，定位的锚点
   */
  moveHtmlBlockToTop(htmltext){
    this.moveHtmlBlock(htmltext, 0)
  }
  
  /**
   * 获取 Html Block 的索引数组
   */
  getHtmlBlockIndexArr(htmltext){
    let htmlCommentIndex = this.getHtmlCommentIndex(htmltext)
    let indexArr = []
    if (htmlCommentIndex !== -1) {
      // 获取下一个 html 评论的 index
      let nextHtmlCommentIndex = this.getNextHtmlCommentIndex(htmltext)
      if (nextHtmlCommentIndex == -1) {
        // 如果没有下一个 html 评论，则以 htmlCommentIndex 到最后一个评论作为 block
        for (let i = htmlCommentIndex; i <= this.comments.length-1; i++) {
          indexArr.push(i)
        }
      } else {
        // 有下一个 html 评论，则以 htmlCommentIndex 到 nextHtmlCommentIndex 之间的评论作为 block
        for (let i = htmlCommentIndex; i < nextHtmlCommentIndex; i++) {
          indexArr.push(i)
        }
      }
    }
    return indexArr
  }

  /**
   * 获取某个 html 评论的下一个 html 评论的索引
   * 若没有下一个 html 评论，则返回 -1
   * 思路：
   *  1. 先获取所有 html 评论的索引 arr
   *  2. 然后看 htmltext 在 arr 里的 index
   *  3. 如果 arr 没有 index+1 索引，则返回 -1；否则返回 arr[index+1]
   * @param {String} htmltext
   */
  getNextHtmlCommentIndex(htmltext){
    let indexArr = this.getHtmlCommentsIndexArr()
    let htmlCommentIndex = this.getHtmlCommentIndex(htmltext)
    let nextHtmlCommentIndex = -1
    if (htmlCommentIndex !== -1) {
      let nextIndex = indexArr.indexOf(htmlCommentIndex) + 1
      if (nextIndex < indexArr.length) {
        nextHtmlCommentIndex = indexArr[nextIndex]
      }
    }
    return nextHtmlCommentIndex
  }

  /**
   * 获得所有 html 评论的索引列表
   * @returns {Array}
   */
  getHtmlCommentsIndexArr(){
    let indexArr = []
    for (let i = 0; i < this.comments.length; i++) {
      let comment = this.comments[i]
      if (comment.type == "HtmlNote") {
        indexArr.push(i)
      }
    }

    return indexArr
  }

  /**
   * 获得某个文本评论的索引列表
   * @param {String} text 
   */
  getTextCommentsIndexArr(text){
    let arr = []
    this.comments.forEach((comment, index) => {
      if (comment.type == "TextNote" && comment.text == text) {
        arr.push(index)
      }
    })
    return arr
  }

  /**
   * 获得某个链接评论的索引列表
   * @param {Object|String} link
   */
  getLinkCommentsIndexArr(link){
    return this.getTextCommentsIndexArr(MNUtil.getLinkText(link))
  }

  /**
   * 获取某个 html Block 的下方内容的 index arr
   * 不包含 html 本身
   */
  getHtmlBlockContentIndexArr(htmltext){
    let arr = this.getHtmlBlockIndexArr(htmltext)
    if (arr.length > 0) {
      arr.shift()  // 去掉 html 评论的 index
    }
    return arr
  }

  /**
   * 获取 html block 下方的内容 arr
   * 不包含 html 本身
   * 但只能获取 TextNote，比如文字和链接
   */
  getHtmlBlockTextContentArr(htmltext){
    let indexArr = this.getHtmlBlockContentIndexArr(htmltext)
    let textArr = []
    indexArr.forEach(index => {
      let comment = this.comments[index]
      if (comment.type == "TextNote") {
        textArr.push(comment.text)
      }
    })
    return textArr
  }

  /**
   * 移动某个数组的评论到某个 index
   * 注意往上移动和往下移动情况不太一样
   */
  moveCommentsByIndexArr(indexArr, toIndex){
    if (indexArr.length !== 0) {
      let max = Math.max(...indexArr)
      let min = Math.min(...indexArr)
      if (toIndex < min) {
        // 此时是往上移动
        for (let i = 0; i < indexArr.length; i++) {
          this.moveComment(indexArr[i], toIndex+i)
        }
      } else if (toIndex > max) {
        // 此时是往下移动
        for (let i = indexArr.length-1; i >= 0; i--) {
          this.moveComment(indexArr[i], toIndex-(indexArr.length-i))
        }
      }
    }
  }

  /**
   * 获取 Html 评论的索引
   * @param {String} htmlcomment 
   */
  getHtmlCommentIndex(htmlcomment) {
    const comments = this.note.comments
    for (let i = 0; i < comments.length; i++) {
      const _comment = comments[i]
      if (
        typeof htmlcomment == "string" &&
        _comment.type == "HtmlNote" &&
        _comment.text == htmlcomment
      ) {
        return i
      }
    }
    return -1
  }
  /**
   * 刷新卡片及其父子卡片
   */
  async refreshAll(delay = 0){
    if (delay) {
      await MNUtil.delay(delay)
    }
    if (this.descendantNodes.descendant.length > 0) {
      this.descendantNodes.descendant.forEach(descendantNote => {
        descendantNote.refresh()
      })
    }
    if (this.ancestorNodes.length > 0) {
      this.ancestorNodes.forEach(ancestorNote => {
        ancestorNote.refresh()
      })
    }
  }
  getIncludingCommentIndex(comment,includeHtmlComment = false) {
    const comments = this.note.comments
    for (let i = 0; i < comments.length; i++) {
      const _comment = comments[i]
      if (typeof comment == "string") {
        if (includeHtmlComment) {
          if ((_comment.type == "TextNote" || _comment.type == "HtmlNote" )&& _comment.text.includes(comment)) return i
        }else{
          if (_comment.type == "TextNote" && _comment.text.includes(comment)) return i
        }
      } else if (
        _comment.type == "LinkNote" &&
        _comment.noteid == comment.noteId
      )
        return i
    }
    return -1
  }

  /**
   * 【数学】定义类卡片的增加模板
   * @param {string} type 需要生成的归类卡片的类型
   */
  addClassificationNoteByType(type, title=""){
    /**
     * 生成归类卡片
     */
    let classificationNote = this.addClassificationNote(title)

    /**
     * 修改标题
     */
    classificationNote.changeTitle(type)

    /**
     * [Done：主要的处理]与定义类卡片进行链接，并防止后续归类后重新链接时导致归类卡片中定义卡片的链接被删除
     * 主要要修改 linkParentNote
     */
    classificationNote.linkParentNote()

    classificationNote.focusInMindMap(0.2)

    return classificationNote
  }

  /**
   * 
   * @returns {MNNote} 生成的归类卡片
   */
  addClassificationNote (title="") {
    // let classificationNote = this.createEmptyChildNote(0,title)
    // classificationNote.mergeClonedNoteFromId("8853B79F-8579-46C6-8ABD-E7DE6F775B8B")
    let classificationNote = MNNote.clone("68CFDCBF-5748-448C-91D0-7CE0D98BFE2C")
    classificationNote.title = title
    MNUtil.undoGrouping(()=>{
      this.addChild(classificationNote)
    })
    return classificationNote
  }


  /**
   * 
   * 复制当前卡片
   * @param {String} title 
   * @param {Number} colorIndex 
   * @returns duplicatedNote
   * 
   * 但是目前只能复制一般文本、markdown 文本内容
   */
  createDuplicatedNote(title = this.title, colorIndex = this.colorIndex){
    let config = {
      title: title,
      // content: content,
      markdown: true,
      color: colorIndex
    }

    let duplicatedNote = this.parentNote.createChildNote(config)

    let oldComments = MNComment.from(this)

    oldComments.forEach(oldComment => {
      switch (oldComment.type) {
        case "linkComment":
        case "markdownComment":
          duplicatedNote.appendMarkdownComment(oldComment.text)
          break;
        case "textComment":
          duplicatedNote.appendTextComment(oldComment.text)
          break;
      }
    })

    return duplicatedNote
  }

  /**
   * 复制卡片后删除原卡片
   * @param {String} title 
   * @param {Number} colorIndex 
   * @returns duplicatedNote
   */
  createDuplicatedNoteAndDelete(title = this.title, colorIndex = this.colorIndex) {
    let duplicatedNote = this.createDuplicatedNote(title, colorIndex)
    this.delete()

    return duplicatedNote
  }

  /**
   * 判断文献卡片是否需要移动位置
   */
  ifReferenceNoteToMove(){
    let parentNote = this.parentNote
    return !["785225AC-5A2A-41BA-8760-3FEF10CF4AE0","49102A3D-7C64-42AD-864D-55EDA5EC3097"].includes(parentNote.noteId)
  }

  /**
   * 最后两个评论的内容类型
   * 
   * 1. 文本 + 链接 => "text-link"
   * 2. 链接 + 链接 => "link-link"
   */
  lastTwoCommentsType(){
    let comments = this.comments
    if (comments.length < 2) {
      return undefined
    } else {
      let lastComment = comments[comments.length-1]
      let secondLastComment = comments[comments.length-2]
      if (
        secondLastComment.type == "TextNote" &&
        !secondLastComment.text.ifLink() &&
        lastComment.text.ifLink()
      ) {
        return "text-link"
      } else if (
        lastComment.text.ifLink()
      ) {
        return "other-link"
      } else {
        return undefined
      }
    }
  }

  getProofContentIndexArr() {
    let proofName = this.getProofNameByType(this.getNoteTypeZh())
    let proofHtmlCommentIndex = this.getProofHtmlCommentIndexByNoteType(this.getNoteTypeZh())
    if (proofHtmlCommentIndex !== -1) {
      return this.getHtmlBlockContentIndexArr(proofName)
    }

    return []
  }

  renewProofContentPointsToHtmlType(htmlType = "point") {
    if (htmlType == undefined) { htmlType = "point" }
    let proofContentIndexArr = this.getProofContentIndexArr()
    if (proofContentIndexArr.length > 0) {
      let comments = this.MNComments
      proofContentIndexArr.forEach(index => {
        let comment = comments[index]
        if (comment.type == "markdownComment" && comment.text.startsWith("- ") && !(comment.text.startsWith("- -"))) {
          comment.text = HtmlMarkdownUtils.createHtmlMarkdownText(comment.text.slice(2).trim(), htmlType)
        }
      })
    }
  }

  renewContentPointsToHtmlType(htmlType = "none") {
    if (htmlType == undefined) { htmlType = "none" }
    let comments = this.MNComments
    for (let i = this.comments.length-1; i >= 0; i--) {
      let comment = comments[i]
      // if (comment.type == "markdownComment" && comment.text.startsWith("- ") && !(comment.text.startsWith("- -"))) {
      //   comment.text = HtmlMarkdownUtils.createHtmlMarkdownText(comment.text.slice(2).trim(), htmlType)
      // }
      if (comment.type === "markdownComment") {
        const { count, remaining } = HtmlMarkdownUtils.parseLeadingDashes(comment.text);
        if (count >= 1 && count <= 5) {
          let adjustedType = htmlType;
          for (let i = 1; i < count; i++) {
            adjustedType = HtmlMarkdownUtils.getSpanNextLevelType(adjustedType);
          }
          comment.text = HtmlMarkdownUtils.createHtmlMarkdownText(remaining, adjustedType);
        }
      }
    }
  }

  clearAllCommentsButMergedImageComment() {
    let comments = this.MNComments
    for (let i = comments.length-1; i >= 0; i--) {
      let comment = comments[i]
      if (!(comment.type == "mergedImageComment")) {
        this.removeCommentByIndex(i)
      }
    }
  }

  /**
   * 夏大鱼羊定制 - MNNote - end
   */
  /**
   *
   * @param {number} index
   * @returns {MNNote}
   */
  removeCommentByIndex(index){
    let length = this.note.comments.length
    if(index >= length){
      index = length-1
    }
    this.note.removeCommentByIndex(index)
    return this
  }
  /**
   *
   * @returns {MNNote}
   */
  removeAllComments(){
    let commentLength = this.comments.length
    for (let i = commentLength-1; i >= 0; i--) {
        this.removeCommentByIndex(i)
    }
    return this
  }
  /**
   *
   * @param {number[]} indices
   * @returns {MNNote}
   */
  removeCommentsByIndices(indices){
    let commentsLength = this.note.comments.length
    let newIndices = indices.map(index=>{
      if (index > commentsLength-1) {
        return commentsLength-1
      }
      if (index < 0) {
        return 0
      }
      return index
    })
    let sortedIndices = MNUtil.sort(newIndices,"decrement")
    sortedIndices.map(index=>{
      this.note.removeCommentByIndex(index)
    })
    return this
  }
  /**
   *
   * @param {{type:string,include:string,exclude:string,reg:string}} condition
   * @returns {MNNote}
   */
  removeCommentByCondition(condition){
    let indices = this.getCommentIndicesByCondition(condition)
    this.removeCommentsByIndices(indices)
    return this
  }
  /**
   * Remove all comment but tag, link and also the filterd. And tags and links will be sat at the end。
   * @param filter not deleted
   * @param f call a function after deleted, before set tag and link
   */
  async removeCommentButLinkTag(
    // 不删除
    filter,
    f
  ) {
    const { removedIndex, linkTags } = this.note.comments.reduce(
      (acc, comment, i) => {
        if (
          comment.type == "TextNote" &&
          (comment.text.includes("marginnote3app://note/") || comment.text.includes("marginnote4app://note/")||
            comment.text.startsWith("#"))
        ) {
          acc.linkTags.push(comment.text)
          acc.removedIndex.unshift(i)
        } else if (!filter(comment)) acc.removedIndex.unshift(i)
        return acc
      },
      {
        removedIndex: [],
        linkTags: []
      }
    )
    removedIndex.forEach(k => {
      this.note.removeCommentByIndex(k)
    })
    f && (await f(this))
    this.appendTextComments(...linkTags)
    return this
  }

  /**
   * @param {string[]} titles
   * append titles as much as you want
   */
  appendTitles(...titles) {
    const newTitle = MNUtil.unique([...this.titles, ...titles], true).join("; ")
    if (this.note.excerptText === this.note.noteTitle) {
      this.note.noteTitle = newTitle
      this.note.excerptText = newTitle
    } else {
      this.note.noteTitle = newTitle
    }
    return this
  }
  /**
   * @param {string[]} tags
   * @returns {MNNote}
   * append tags as much as you want
   */
  appendTags(tags) {
  try {
    this.tidyupTags()
    // tags = this.tags.concat(tags)//MNUtil.unique(this.tags.concat(tags), true)
    tags = MNUtil.unique(this.tags.concat(tags), true)
    const lastComment = this.note.comments[this.note.comments.length - 1]
    if (lastComment?.type == "TextNote" && lastComment.text.startsWith("#")) {
      if (lastComment.text === tags.map(k => '#'+k).join(" ")) {
        return this
      }
      this.note.removeCommentByIndex(this.note.comments.length - 1)
    }
    this.appendTextComments(tags.map(k => '#'+k).join(" "))
    return this
  } catch (error) {
    MNNote.addErrorLog(error, "appendTags")
    return this
  }
  }
  /**
   * @param {string[]} tags
   * @returns {MNNote}
   * append tags as much as you want
   */
  removeTags(tagsToRemove) {
  try {
    this.tidyupTags()
    // tags = this.tags.concat(tags)//MNUtil.unique(this.tags.concat(tags), true)
    let tags = this.tags.filter(tag=>!tagsToRemove.includes(tag))
    // MNUtil.showHUD(tags)
    const lastComment = this.note.comments[this.note.comments.length - 1]
    if (lastComment?.type == "TextNote" && lastComment.text.startsWith("#")) {
      if (lastComment.text === tags.map(k => '#'+k).join(" ")) {
        return this
      }
      this.note.removeCommentByIndex(this.note.comments.length - 1)
    }
    this.appendTextComments(tags.map(k => '#'+k).join(" "))
    return this
  } catch (error) {
    MNNote.addErrorLog(error, "removeTags")
    return this
  }
  }
  /**
   * make sure tags are in the last comment
   */
  tidyupTags() {
    const existingTags= []
    const tagCommentIndex = []
    this.note.comments.forEach((comment, index) => {
      if (comment.type == "TextNote" && MNUtil._isTagComment_(comment)) {
        const tags = comment.text.split(" ").filter(k => k.startsWith("#"))
        existingTags.push(...tags.map(tag => tag.slice(1)))
        tagCommentIndex.unshift(index)
      }
    })

    tagCommentIndex.forEach(index => {
      this.note.removeCommentByIndex(index)
    })

    this.appendTextComments(
      MNUtil.unique(existingTags)
        .map(k => '#'+k)
        .join(" ")
    )
    return this
  }
  /**
   * @param {MbBookNote | string} comment
   * get comment index by comment
   */
  getCommentIndex(comment,includeHtmlComment = false) {
    const comments = this.note.comments
    for (let i = 0; i < comments.length; i++) {
      const _comment = comments[i]
      if (typeof comment == "string") {
        if (includeHtmlComment) {
          if ((_comment.type == "TextNote" || _comment.type == "HtmlNote" )&& _comment.text == comment) return i
        }else{
          if (_comment.type == "TextNote" && _comment.text == comment) return i
        }
      } else if (
        _comment.type == "LinkNote" &&
        _comment.noteid == comment.noteId
      )
        return i
    }
    return -1
  }
  /**
   * Clear the format of the current note.
   * @returns {MNNote}
   */
  clearFormat(){
    this.note.clearFormat()
    return this
  }
  /**
   * Appends a note link to the current note.
   * 
   * This method appends a note link to the current note based on the specified type. The type can be "Both", "To", or "From".
   * If the type is "Both", the note link is added to both the current note and the target note.
   * If the type is "To", the note link is added only to the current note.
   * If the type is "From", the note link is added only to the target note.
   * 
   * @param {MNNote|MbBookNote} note - The note to which the link should be added.
   * @param {string} type - The type of link to add ("Both", "To", or "From").
   * @returns {MNNote}
   */
  appendNoteLink(note,type="To"){
  try {
    

    switch (MNUtil.typeOf(note)) {
      case "MNNote":
        switch (type) {
          case "Both":
            this.note.appendNoteLink(note.note)
            note.note.appendNoteLink(this.note)
            break;
          case "To":
            this.note.appendNoteLink(note.note)
            break;
          case "From":
            note.note.appendNoteLink(this.note)
          default:
            break;
        }
        break;
      case "NoteURL":
      case "NoteId":
        let targetNote = MNNote.new(note)
        switch (type) {
          case "Both":
            this.note.appendNoteLink(targetNote.note)
            targetNote.note.appendNoteLink(this.note)
            break;
          case "To":
            this.note.appendNoteLink(targetNote.note)
            break;
          case "From":
            targetNote.note.appendNoteLink(this.note)
            break;
          default:
            break;
        }
        break;
      case "MbBookNote":
        switch (type) {
          case "Both":
            this.note.appendNoteLink(note)
            note.appendNoteLink(this.note)
            break;
          case "To":
            this.note.appendNoteLink(note)
            break;
          case "From":
            note.appendNoteLink(this.note)
          default:
            break;
        }
        break;
      default:
        break;
    }
    return this
  } catch (error) {
    MNUtil.showHUD(error)
    return this
  }
  }
  /**
   *
   * @returns {MNNote}
   */
  clone() {
    let notebookId = MNUtil.currentNotebookId
    let noteIds = MNUtil.db.cloneNotesToTopic([this.note], notebookId)
    return MNNote.new(noteIds[0])
  }
  /**
   *
   * @param {number} [delay=0]
   * @returns {MNNote}
   */
  async focusInMindMap(delay = 0){
    if (this.notebookId && this.notebookId !== MNUtil.currentNotebookId) {
      MNUtil.showHUD("Note not in current notebook")
      return this
    }
    if (delay) {
      await MNUtil.delay(delay)
    }
    MNUtil.studyController.focusNoteInMindMapById(this.noteId)
    return this
  }
  /**
   *
   * @param {number} [delay=0]
   * @returns {MNNote}
   */
  async focusInDocument(delay = 0){
    if (delay) {
      await MNUtil.delay(delay)
    }
    MNUtil.studyController.focusNoteInDocumentById(this.noteId)
    return this
  }
  /**
   *
   * @param {number} [delay=0]
   * @returns {MNNote}
   */
  async focusInFloatMindMap(delay = 0){
    if (delay) {
      await MNUtil.delay(delay)
    }
    MNUtil.studyController.focusNoteInFloatMindMapById(this.noteId)
    return this
  }
  copyURL(){
    MNUtil.copy(this.noteURL)
  }
  static errorLog = []
  static addErrorLog(error,source,info){
    MNUtil.showHUD("MNNote Error ("+source+"): "+error)
    let log = {
      error:error.toString(),
      source:source,
      time:(new Date(Date.now())).toString()
    }
    if (info) {
      log.info = info
    }
    this.errorLog.push(log)
    MNUtil.copyJSON(this.errorLog)
  }
  /**
   *
   * 
   * This method checks if the note has an excerpt picture. If it does, it retrieves the image data and the excerpt text.
   * If the note does not have an excerpt picture, it only retrieves the excerpt text. The method returns an object containing
   * arrays of OCR text, HTML text, and Markdown text.
   * 
   * @param {MbBookNote} note - The note from which to retrieve the excerpt text and image data.
   * @returns {{ocr: string[], html: string[], md: string[]}} An object containing arrays of OCR text, HTML text, and Markdown text.
   */
  static getNoteExcerptTextPic(note) {
    const acc = {
      ocr: [],
      html: [],
      md: []
    }
    const text = note.excerptText?.trim()
    if (note.excerptPic) {
      const imgs = MNNote.exportPic(note.excerptPic)
      if (imgs)
        Object.entries(imgs).forEach(([k, v]) => {
          if (k in acc) acc[k].push(v)
        })
      if (text) {
        acc.ocr.push(text)
      }
    } else {
      if (text) {
        Object.values(acc).forEach(k => k.push(text))
      }
    }
    return acc
  }
  /**
   * Get picture base64 code wrapped in html and markdown
   * @param {MNPic} pic
   * @returns
   * - html: '<img class="MNPic" src="data:image/jpeg;base64,${base64}"/>'
   * - md: '![MNPic](data:image/jpeg;base64,${base64})'
   */
  static exportPic(pic) {
    const base64 = MNUtil.db.getMediaByHash(pic.paint)?.base64Encoding()
    if (base64)
      return {
        html: `<img class="MNPic" src="data:image/jpeg;base64,${base64}"/>`,
        md: `![MNPic](data:image/jpeg;base64,${base64})`
      }
  }
  static focusInMindMapById(noteId,delay = 0){
    MNUtil.focusNoteInMindMapById(noteId,delay)
  }
  static focusInDocumentById(noteId,delay = 0){
    MNUtil.focusNoteInDocumentById(noteId,delay = 0)
  }
  static focusInFloatMindMapById(noteId,delay = 0){
    MNUtil.focusNoteInFloatMindMapById(noteId,delay = 0)
  }
  /**
   *
   * @param {MbBookNote|string} note
   */
  static focusInMindMap(note,delay=0){
    let noteId = MNUtil.getNoteId(note);
    if (noteId) {
      MNUtil.focusNoteInMindMapById(noteId,delay)
    }
  }
  /**
   *
   * @param {MbBookNote|string} note
   */
  static focusInDocument(note,delay){
    let noteId = MNUtil.getNoteId(note);
    if (noteId) {
      MNUtil.focusNoteInDocumentById(noteId,delay)
    }
  }
  static focusInFloatMindMap(note,delay){
    let noteId = MNUtil.getNoteId(note);
    if (noteId) {
      MNUtil.focusNoteInFloatMindMapById(noteId,delay)
    }
  }
  static get currentChildMap(){
    if (MNUtil.mindmapView && MNUtil.mindmapView.mindmapNodes[0].note?.childMindMap) {
      return this.new(MNUtil.mindmapView.mindmapNodes[0].note.childMindMap.noteId)
    }else{
      return undefined
    }
  }
  /**
   * Retrieves the currently focused note in the mind map or document.
   * 
   * This method checks for the focused note in the following order:
   * 1. If the notebook controller is visible and has a focused note, it returns that note.
   * 2. If the document map split mode is enabled, it checks the current document controller and all document controllers for a focused note.
   * 3. If a pop-up note info is available, it returns the note from the pop-up note info.
   * 
   * @returns {MNNote|undefined} The currently focused note, or undefined if no note is focused.
   */
  static get focusNote(){
    return this.getFocusNote()
  }
  /**
   * Retrieves the currently focused note in the mind map or document.
   * 
   * This method checks for the focused note in the following order:
   * 1. If the notebook controller is visible and has a focused note, it returns that note.
   * 2. If the document map split mode is enabled, it checks the current document controller and all document controllers for a focused note.
   * 3. If a pop-up note info is available, it returns the note from the pop-up note info.
   * 
   * @returns {MNNote|undefined} The currently focused note, or undefined if no note is focused.
   */
  static getFocusNote() {
    let notebookController = MNUtil.notebookController
    if (!notebookController.view.hidden && notebookController.mindmapView && notebookController.focusNote) {
      return MNNote.new(notebookController.focusNote)
    }
    if (MNUtil.studyController.docMapSplitMode) {//不为0则表示documentControllers存在
      let note = MNUtil.currentDocController.focusNote
      if (note) {
        return MNNote.new(note)
      }
      let focusNote
      let docNumber = MNUtil.docControllers.length
      for (let i = 0; i < docNumber; i++) {
        const docController = MNUtil.docControllers[i];
        focusNote = docController.focusNote
        if (focusNote) {
          return MNNote.new(focusNote)
        }
      }
      if (MNUtil.popUpNoteInfo) {
        return MNNote.new(MNUtil.popUpNoteInfo.noteId)
      }
    }
    return undefined
  }

    /**
   * 
   * @param {MbBookNote|MNNote} note 
   */
  static hasImageInNote(note){
    if (note.excerptPic && !note.textFirst) {
      return true
    }
    if (note.comments && note.comments.length) {
      let comment = note.comments.find(c=>c.type==="PaintNote")
      if (comment) {
        return true
      }
    }
    return false
  }
  static fromSelection(docController = MNUtil.currentDocController){
    let selection = MNUtil.currentSelection
    if (!selection.onSelection) {
      return undefined
    }
    return MNNote.new(docController.highlightFromSelection())
  }
  /**
   * Retrieves the focus notes in the current context.
   * 
   * This method checks for focus notes in various contexts such as the mind map, document controllers, and pop-up note info.
   * It returns an array of MNNote instances representing the focus notes. If no focus notes are found, it returns an empty array.
   * 
   * @returns {MNNote[]} An array of MNNote instances representing the focus notes.
   */
  static get focusNotes(){
    return this.getFocusNotes()
  }
  /**
   * Retrieves the focus notes in the current context.
   * 
   * This method checks for focus notes in various contexts such as the mind map, document controllers, and pop-up note info.
   * It returns an array of MNNote instances representing the focus notes. If no focus notes are found, it returns an empty array.
   * 
   * @returns {MNNote[]} An array of MNNote instances representing the focus notes.
   */
  static getFocusNotes() {
    let notebookController = MNUtil.notebookController
    if (!notebookController.view.hidden && notebookController.mindmapView && notebookController.mindmapView.selViewLst && notebookController.mindmapView.selViewLst.length) {
      let selViewLst = notebookController.mindmapView.selViewLst
      return selViewLst.map(tem=>{
        return this.new(tem.note.note)
      })
    }
    if (MNUtil.studyController.docMapSplitMode) {//不为0则表示documentControllers存在
      let note = MNUtil.currentDocController.focusNote
      if (note) {
        return [this.new(note)]
      }
      let focusNote
      let docNumber = MNUtil.docControllers.length
      for (let i = 0; i < docNumber; i++) {
        const docController = MNUtil.docControllers[i];
        focusNote = docController.focusNote
        if (focusNote) {
          return [this.new(focusNote)]
        }
      }
    }
    if (MNUtil.popUpNoteInfo) {
        return [this.new(MNUtil.popUpNoteInfo.noteId)]
    }
    //如果两个上面两个都没有，那就可能是小窗里打开的
    if (notebookController.focusNote) {
      return [this.new(notebookController.focusNote)]
    }
    return []
  }
  static getSelectedNotes(){
    return this.getFocusNotes()
  }
  /**
   * 还需要改进逻辑
   * @param {*} range 
   * @returns {MNNote[]}
   */
  static getNotesByRange(range){
    if (range === undefined) {
      return [this.getFocusNote()]
    }
    switch (range) {
      case "currentNotes":
        return this.getFocusNotes()
      case "childNotes":
        let childNotes = []
        this.getFocusNotes().map(note=>{
          childNotes = childNotes.concat(note.childNotes)
        })
        return childNotes
      case "descendants":
        let descendantNotes = []
        this.getFocusNotes().map(note=>{
          descendantNotes = descendantNotes.concat(note.descendantNodes.descendant)
        })
        return descendantNotes
      default:
        return [this.getFocusNote()]
    }
  }
  /**
   * Clones a note to the specified notebook.
   * 
   * This method clones the provided note to the specified notebook. The note object can be of various types:
   * - An MbBookNote instance.
   * - A string representing a note URL.
   * - A string representing a note ID.
   * - A configuration object for creating a new note.
   * 
   * If the note object is a string representing a note URL, the method will attempt to retrieve the corresponding note from the URL.
   * If the note object is a string representing a note ID, the method will attempt to retrieve the corresponding note from the database.
   * If the note object is a configuration object, the method will create a new note with the specified properties.
   * 
   * @param {MbBookNote|string|MNNote} note - The note object to clone.
   * @param {string} [notebookId=MNUtil.currentNotebookId] - The ID of the notebook to clone the note to.
   * @returns {MNNote|undefined} The cloned MNNote instance or undefined if the note object is invalid.
   */
  static clone(note, notebookId = MNUtil.currentNotebookId) {
    let noteIds = []
    // let notebookId = MNUtil.currentNotebookId
    switch (MNUtil.typeOf(note)) {
      case "NoteURL":
        let noteFromURL = MNUtil.getNoteById(MNUtil.getNoteIdByURL(note))
        if (!noteFromURL) {
          MNUtil.copy(note)
          MNUtil.showHUD("Note not exists!")
          return undefined
        }
        noteIds = MNUtil.db.cloneNotesToTopic([noteFromURL], notebookId)
        return MNNote.new(noteIds[0])
      case "NoteId":
      case "string":
        let targetNote = MNUtil.getNoteById(note)
        if (!targetNote) {
          MNUtil.copy(note)
          MNUtil.showHUD("Note not exists!")
          return undefined
        }
        noteIds = MNUtil.db.cloneNotesToTopic([targetNote], notebookId)
        return MNNote.new(noteIds[0])
      case "MbBookNote":
        noteIds = MNUtil.db.cloneNotesToTopic([note], notebookId)
        return MNNote.new(noteIds[0])
      case "MNNote":
        noteIds = MNUtil.db.cloneNotesToTopic([note.note], notebookId)
        return MNNote.new(noteIds[0])
      default:
        break;
    }
  }
  /**
   * Retrieves the image data from the current document controller or other document controllers if the document map split mode is enabled.
   * 
   * This method checks for image data in the current document controller's selection. If no image is found, it checks the focused note within the current document controller.
   * If the document map split mode is enabled, it iterates through all document controllers to find the image data. If a pop-up selection info is available, it also checks the associated document controller.
   * 
   * @param {boolean} [checkImageFromNote=false] - Whether to check the focused note for image data.
   * @param {boolean} [checkDocMapSplitMode=false] - Whether to check other document controllers if the document map split mode is enabled.
   * @returns {NSData|undefined} The image data if found, otherwise undefined.
   */
  static getImageFromNote(note,checkTextFirst = false) {
    if (note.excerptPic) {
      if (checkTextFirst && note.textFirst) {
        //检查发现图片已经转为文本，因此略过
      }else{
        return MNUtil.getMediaByHash(note.excerptPic.paint)
      }
    }else{
      let text = note.excerptText
      if (note.excerptTextMarkdown) {
        if (MNUtil.hasMNImages(text.trim())) {
          return MNUtil.getMNImageFromMarkdown(text)
        }
      }
    }
    if (note.comments.length) {
      let imageData = undefined
      for (let i = 0; i < note.comments.length; i++) {
        const comment = note.comments[i];
        if (comment.type === 'PaintNote' && comment.paint) {
          imageData = MNUtil.getMediaByHash(comment.paint)
          break
        }
        if (comment.type === "LinkNote" && comment.q_hpic && comment.q_hpic.paint) {
          imageData = MNUtil.getMediaByHash(comment.q_hpic.paint)
          break
        }

      }
      if (imageData) {
        return imageData
      }
    }
    return undefined
  }
  /**
   * Retrieves the image data from the current document controller or other document controllers if the document map split mode is enabled.
   * 
   * This method checks for image data in the current document controller's selection. If no image is found, it checks the focused note within the current document controller.
   * If the document map split mode is enabled, it iterates through all document controllers to find the image data. If a pop-up selection info is available, it also checks the associated document controller.
   * 
   * @param {boolean} [checkImageFromNote=false] - Whether to check the focused note for image data.
   * @param {boolean} [checkDocMapSplitMode=false] - Whether to check other document controllers if the document map split mode is enabled.
   * @returns {{data:NSData,source:string,index:number}} The image data if found, otherwise undefined.
   */
  static getImageInfoFromNote(note,checkTextFirst = false) {
    let imageInfo = {}
    if (note.excerptPic) {
      if (checkTextFirst && note.textFirst) {
        //检查发现图片已经转为文本，因此略过
      }else{
        imageInfo.data = MNUtil.getMediaByHash(note.excerptPic.paint)
        imageInfo.source = "excerptPic"
        // return MNUtil.getMediaByHash(note.excerptPic.paint)
      }
    }else{
      let text = note.excerptText
      if (note.excerptTextMarkdown) {
        if (MNUtil.hasMNImages(text.trim())) {
          imageInfo.data = MNUtil.getMNImageFromMarkdown(text)
          imageInfo.source = "excerptTextMarkdown"
        }
      }
    }
    if (note.comments.length) {
      for (let i = 0; i < note.comments.length; i++) {
        const comment = note.comments[i];
        if (comment.type === 'PaintNote' && comment.paint) {
          imageInfo.data = MNUtil.getMediaByHash(comment.paint)
          imageInfo.source = "PaintNote"
          imageInfo.index = i
          break
        }
        if (comment.type === "LinkNote" && comment.q_hpic && comment.q_hpic.paint) {
          imageInfo.data = MNUtil.getMediaByHash(comment.q_hpic.paint)
          imageInfo.source = "LinkNote"
          imageInfo.index = i
          break
        }
      }
    }
    return imageInfo
  }
  /**
   * Retrieves the image data from the current document controller or other document controllers if the document map split mode is enabled.
   * 
   * This method checks for image data in the current document controller's selection. If no image is found, it checks the focused note within the current document controller.
   * If the document map split mode is enabled, it iterates through all document controllers to find the image data. If a pop-up selection info is available, it also checks the associated document controller.
   * 
   * @param {boolean} [checkImageFromNote=false] - Whether to check the focused note for image data.
   * @param {boolean} [checkDocMapSplitMode=false] - Whether to check other document controllers if the document map split mode is enabled.
   * @returns {NSData[]|undefined} The image data if found, otherwise undefined.
   */
  static getImagesFromNote(note,checkTextFirst = false) {
    let imageDatas = []
    if (note.excerptPic) {
      if (checkTextFirst && note.textFirst) {
        //检查发现图片已经转为文本，因此略过
      }else{
        imageDatas.push(MNUtil.getMediaByHash(note.excerptPic.paint))
      }
    }else{
      let text = note.excerptText
      if (note.excerptTextMarkdown) {
        if (MNUtil.hasMNImages(text.trim())) {
          imageDatas.push(MNUtil.getMNImageFromMarkdown(text))
        }
      }
    }
    if (note.comments.length) {
      for (let i = 0; i < note.comments.length; i++) {
        const comment = note.comments[i];
        if (comment.type === 'PaintNote' && comment.paint) {
          imageDatas.push(MNUtil.getMediaByHash(comment.paint))
        }else if (comment.type === "LinkNote" && comment.q_hpic && comment.q_hpic.paint) {
          imageDatas.push(MNUtil.getMediaByHash(comment.q_hpic.paint))
        }
      }
    }
    return imageDatas
  }
  /**
   * 
   * @param {string} noteId 
   * @returns {boolean}
   */
  static exist(noteId){
    if (MNUtil.db.getNoteById(noteId)) {
      return true
    }
    return false
  }
}

class MNComment {
  /** @type {string} */
  type;
  /** @type {string|undefined} */
  originalNoteId;
  /** @type {number|undefined} */
  index;
  /**
   * 
   * @param {NoteComment} comment 
   */
  constructor(comment) {
    this.type = MNComment.getCommentType(comment)
    this.detail = comment
  }
  get imageData() {
    switch (this.type) {
      case "blankImageComment":
      case "mergedImageCommentWithDrawing":
      case "mergedImageComment":
        return MNUtil.getMediaByHash(this.detail.q_hpic.paint)
      case "drawingComment":
      case "imageCommentWithDrawing":
      case "imageComment":
        return MNUtil.getMediaByHash(this.detail.paint)
      default:
        MNUtil.showHUD("Invalid type: "+this.type)
        return undefined
    }
  }

  get text(){
    if (this.detail.text) {
      return this.detail.text
    }
    if (this.detail.q_htext) {
      return this.detail.q_htext
    }
    // 夏大鱼羊 - 修改
    // MNUtil.showHUD("No available text")
    return undefined
  }
  get markdown(){
    return this.type === "markdownComment"
  }
  /**
   * 
   * @param {Boolean} markdown 
   */
  set markdown(markdown){
    switch (this.type) {
        case "blankTextComment":
        case "mergedImageComment":
        case "mergedTextComment":
        case "blankImageComment":
        case "mergedImageCommentWithDrawing":
        case "mergedImageComment":
        case "mergedTextComment":
        case "drawingComment":
        case "imageCommentWithDrawing":
        case "imageComment":
        case "markdownComment":
        return
      default:
        break;
    }
    if (markdown) {
      if (this.type === "markdownComment") {
        return
      }
      if (this.originalNoteId) {
        let note = MNNote.new(this.originalNoteId)
        note.replaceWithMarkdownComment(this.detail.text,this.index)
      }
    }else{
      if (this.type === "markdownComment" && this.originalNoteId) {
        let note = MNNote.new(this.originalNoteId)
        note.replaceWithTextComment(this.detail.text,this.index)
      }
    }
  }
  set text(text){
    if (this.originalNoteId) {
      let note = MNNote.new(this.originalNoteId)
      switch (this.type) {
        // 夏大鱼羊 - 修改 - begin
        case "linkComment":
        case "markdownComment":
          this.detail.text = text
          note.replaceWithMarkdownComment(text,this.index)
          break;
        case "textComment":
          this.detail.text = text
          note.replaceWithTextComment(text,this.index)
          break;
        // 夏大鱼羊 - 修改 - end
        case "blankTextComment":
        case "mergedImageComment":
        case "mergedTextComment":
          this.detail.q_htext = text
          let mergedNote = this.note
          mergedNote.excerptText = text
          break;
        default:
          MNUtil.showHUD("Unsupported comment type: " + this.type)
          break;
      }
    }else{
      MNUtil.showHUD("No originalNoteId")
    }
  }
  get tags(){
    if (this.type === "tagComment") {
      return this.detail.text.split(/\s+/).filter(k => k.startsWith("#"))
    }
    return undefined
  }
  get direction(){
    if (this.type === "linkComment") {
      return this.linkDirection
    }
    return undefined
  }
  set direction(direction){
    if (this.type === "linkComment") {
      switch (direction) {
        case "one-way":
          this.removeBackLink()
          break;
        case "both":
          this.addBackLink()
          break;
        default:
          MNUtil.showHUD("Invalid direction: "+direction)
          break;
      }
    }
  }
  get note(){
    switch (this.type) {
      case "linkComment":
        return MNNote.new(this.detail.text)
      case "blankTextComment":
      case "blankImageComment":
      case "mergedImageCommentWithDrawing":
      case "mergedImageComment":
      case "mergedTextComment":
        return MNNote.new(this.detail.noteid)
      default:
        MNUtil.showHUD("No available note")
        return undefined
    }
  }
  refresh(){
    if (this.originalNoteId && this.index !== undefined) {
      let note = MNNote.new(this.originalNoteId)
      let comment = note.comments[this.index]
      this.type = MNComment.getCommentType(comment)
      this.detail = comment
    }
  }
  copyImage(){
    MNUtil.copyImage(this.imageData)
  }
  copyText(){
    MNUtil.copy(this.detail.text)
  }
  copy(){
    switch (this.type) {
      case "blankImageComment":
      case "mergedImageCommentWithDrawing":
      case "mergedImageComment":
        MNUtil.copyImage(MNUtil.getMediaByHash(this.detail.q_hpic.paint))
        break;
      case "drawingComment":
      case "imageCommentWithDrawing":
      case "imageComment":
        MNUtil.copyImage(MNUtil.getMediaByHash(this.detail.paint))
        break;
      case "blankTextComment":
      case "mergedTextComment":
        MNUtil.copy(this.detail.q_htext)
        break;
      default:
        MNUtil.copy(this.detail.text)
        break;
    }
  }
  remove(){
    if (this.originalNoteId) {
      let note = MNNote.new(this.originalNoteId)
      note.removeCommentByIndex(this.index)
    }else{
      MNUtil.showHUD("No originalNoteId")
    }
  }
  replaceLink(note){
    try {
    if (this.type === "linkComment" && note){
      let targetNote = MNNote.new(note)
      let currentNote = MNNote.new(this.originalNoteId)
      if (this.linkDirection === "both") {
        this.removeBackLink()//先去除原反链
        this.detail.text = targetNote.noteURL
        currentNote.replaceWithTextComment(this.detail.text,this.index)
        this.addBackLink(true)
      }else{
        this.detail.text = targetNote.noteURL
        currentNote.replaceWithTextComment(this.detail.text,this.index)
      }
    }
      } catch (error) {
      MNUtil.addErrorLog(error, "replaceLink")
    }
  }
  hasBackLink(){
    if (this.type === "linkComment"){
      let fromNote = MNNote.new(this.originalNoteId)
      let toNote = this.note
      if (toNote.linkedNotes && toNote.linkedNotes.length > 0) {
        if (toNote.linkedNotes.some(n=>n.noteid === fromNote.noteId)) {
          return true
        }
      }
      return false
    }
    return false
  }
  removeBackLink(){
    if (this.type === "linkComment" && this.linkDirection === "both") {
      let targetNote = this.note//链接到的卡片
      if (this.hasBackLink()) {
        MNComment.from(targetNote).forEach(comment => {
          if (comment.type === "linkComment" && comment.note.noteId === this.originalNoteId) {
            comment.remove()
            this.linkDirection = "one-way"
          }
        })
      }
    }
  }
  addBackLink(force = false){
  try {
    if (this.type === "linkComment" && (this.linkDirection === "one-way" || force)) {
      let targetNote = this.note//链接到的卡片
      if (!this.hasBackLink()) {
        targetNote.appendNoteLink(this.originalNoteId,"To")
        this.linkDirection = "both"
      }
    }
  } catch (error) {
    MNUtil.showHUD(error)
  }
  }
  /**
   * 
   * @param {string[]} types 
   * @returns {boolean}
   */
  belongsToType(types){
    if (types.includes(this.detail.type)) {
      return true
    }
    if (types.includes(this.type)) {
      return true
    }
    return false
  }
  /**
   * 
   * @param {NoteComment} comment 
   * @param {string[]} types 
   * @returns {boolean}
   */
  static commentBelongsToType(comment,types){
    if (types.length === 0) {
      return false
    }
    if (types.includes(comment.type)) {
      return true
    }
    let newType = MNComment.getCommentType(comment)
    if (types.includes(newType)) {
      return true
    }
    return false
  }
  /**
   * 
   * @param {NoteComment} comment 
   * @returns {string}
   */
  static getCommentType(comment){
    switch (comment.type) {
      case "TextNote":
        if (/^#\S/.test(comment.text)) {
          return "tagComment"
        }
        if (/^marginnote\dapp:\/\/note\//.test(comment.text)) {
          //概要卡片的评论链接格式:marginnote4app://note/898B40FE-C388-4F3E-B267-C6606C37046C/summary/0
          if (/summary/.test(comment.text)) {
            return "summaryComment"
          }
          return "linkComment"
        }
        if (/^marginnote\dapp:\/\/note\//.test(comment.text)) {
          return "linkComment"
        }
        if (comment.markdown) {
          return "markdownComment"
        }
        return "textComment"
      case "HtmlNote":
        return "HtmlComment"
      case "LinkNote":
        if (comment.q_hblank) {
          let imageData = MNUtil.getMediaByHash(comment.q_hpic.paint)
          let imageSize = UIImage.imageWithData(imageData).size
          if (imageSize.width === 1 && imageSize.height === 1) {
            return "blankTextComment"
          }else{
            return "blankImageComment"
          }
        }
        if (comment.q_hpic) {
          if (comment.q_hpic.drawing) {
            return "mergedImageCommentWithDrawing"
          }
          return "mergedImageComment"
        }else{
          return "mergedTextComment"
        }
      case "PaintNote":
        if (comment.drawing) {
          if (comment.paint) {
            return "imageCommentWithDrawing"
          }else{
            return "drawingComment"
          }
        }else{
          return "imageComment"
        }
      default:
        return undefined
    }
  }
  /**
   * 
   * @param {MNNote|MbBookNote} note
   * @returns {MNComment[]}
   */
  static from(note){
    if (!note) {
      MNUtil.showHUD("❌ No note found")
      return undefined
    }
    try {
      let newComments = note.comments.map((c,ind)=>MNComment.new(c,ind,note))
      return newComments
    } catch (error) {
      MNUtil.showHUD(error)
      return undefined
    }
  }
  /**
   * 
   * @param {NoteComment} comment 
   * @param {number|undefined} index 
   * @param {MbBookNote|undefined} note
   * @returns {MNComment}
   */
  static new(comment,index,note){
    try {
      
      let newComment = new MNComment(comment)
      if (note) {
        newComment.originalNoteId = note.noteId
      }
      if (index !== undefined) {
        newComment.index = index
      }
      if (newComment.type === 'linkComment') {
        if (newComment.hasBackLink()) {
          newComment.linkDirection = "both"
        }else{
          newComment.linkDirection = "one-way"
        }
      }
      if (newComment.type === 'summaryComment') {
        newComment.fromNoteId = MNUtil.extractMarginNoteLinks(newComment.detail.text)[0].replace("marginnote4app://note/","")
      }
        

      return newComment
    } catch (error) {
      MNUtil.showHUD(error)
      return undefined
    }
  }
  
}

class MNExtensionPanel {
  static subviews = {}
  static get currentWindow(){
    //关闭mn4后再打开，得到的focusWindow会变，所以不能只在init做一遍初始化
    return this.app.focusWindow
  }
  static get subviewNames(){
    return Object.keys(this.subviews)
  }
  static get app(){
    // this.appInstance = Application.sharedInstance()
    // return this.appInstance
    if (!this.appInstance) {
      this.appInstance = Application.sharedInstance()
    }
    return this.appInstance
  }
  static get studyController(){
    return this.app.studyController(this.currentWindow)
  }
  /**
   * @returns {{view:UIView}}
   **/
  static get controller(){
    return this.studyController.extensionPanelController
  }
  /**
   * @returns {UIView}
   */
  static get view(){
    return this.studyController.extensionPanelController.view
  }
  static get frame(){
    return this.view.frame
  }
  static get width(){
    return this.view.frame.width
  }
  static get height(){
    return this.view.frame.height
  }
  static get on(){
    if (this.controller && this.view.window) {
      return true
    }
    return false
  }
  /**
   * 用于关闭其他窗口的扩展面板
   * @param {UIWindow} window 
   */
  static hideExtentionPanel(window){
    let originalStudyController = this.app.studyController(window)
    if (originalStudyController.extensionPanelController.view.window) {
      originalStudyController.toggleExtensionPanel()
    }
  }
  static toggle(){
    this.studyController.toggleExtensionPanel()
  }
  static show(name = undefined){
    if (!this.on) {
      this.toggle()
      MNUtil.delay(0.1).then(()=>{
        if (!this.on) {
          this.toggle()
        }
      })
    }
    if (name && name in this.subviews) {
      let allNames = Object.keys(this.subviews)
      allNames.forEach(n=>{
        let view = this.subviews[n]
        if (n == name){
          if (!view.isDescendantOfView(this.view)) {
            this.hideExtentionPanel(view.window)
            view.removeFromSuperview()
            this.view.addSubview(view)
          }
          view.hidden = false
        }else{
          view.hidden = true
        }
      })
    }
  }
  /**
   * 
   * @param {string} name 
   * @returns {UIView}
   */
  static subview(name){
    return this.subviews[name]
  }
  /**
   * 需要提供一个视图名,方便索引和管理
   * @param {string} name 
   * @param {UIView} view 
   */
  static addSubview(name,view){
    if (this.controller) {
      this.subviews[name] = view
      this.view.addSubview(view)
      let allNames = Object.keys(this.subviews)
      allNames.forEach(n=>{
        if (n == name){
          this.subviews[n].hidden = false
        }else{
          this.subviews[n].hidden = true
        }
      })
    }else{
      MNUtil.showHUD("Show Extension Panel First!")
    }
  }
  static removeSubview(name){
    if (name in this.subviews) {
      this.subviews[name].removeFromSuperview()
      delete this.subviews[name]
    }
  }
}