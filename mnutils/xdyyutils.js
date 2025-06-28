/**
 * 夏大鱼羊 - Begin
 */

class MNMath {
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
   * 卡片类型与默认移动字段的映射关系
   * 
   * 定义了每种卡片类型的新内容应该移动到哪个字段下
   * 用于 mergeTemplateAndAutoMoveNoteContent 和 autoMoveNewContentByType 等函数
   */
  static typeDefaultFieldMap = {
    "定义": "相关思考",
    "命题": "证明",
    "反例": "反例",
    "例子": "证明",
    "思想方法": "原理",
    "归类": "相关思考",
    "问题": "研究脉络",
    "思路": "具体尝试",
    "作者": "个人信息",
    "文献": "文献信息",
    "论文": "文献信息",
    "书作": "文献信息",
    "研究进展": "进展详情"
  }

  /**
   * 获取卡片类型对应的默认字段
   * 
   * @param {string} noteType - 卡片类型
   * @returns {string} 默认字段名，如果类型未定义则返回空字符串
   */
  static getDefaultFieldForType(noteType) {
    return this.typeDefaultFieldMap[noteType] || "";
  }

  /**
   * 思路链接字段映射（部分卡片类型在添加思路链接时使用不同的字段）
   */
  static ideaLinkFieldMap = {
    "命题": "证明",
    "例子": "证明",
    "反例": "反例",
    "思想方法": "原理",
    "问题": "研究思路"  // 注意：这里是"研究思路"而不是默认的"研究脉络"
  }

  /**
   * 制卡（只支持非摘录版本）
   */
  static makeCard(note, addToReview = true, reviewEverytime = true) {
    this.renewNote(note) // 处理旧卡片
    this.mergeTemplateAndAutoMoveNoteContent(note) // 合并模板卡片并自动移动内容
    this.changeTitle(note) // 修改卡片标题
    this.changeNoteColor(note) // 修改卡片颜色
    this.linkParentNote(note) // 链接广义的父卡片（可能是链接归类卡片）
    // this.refreshNote(note) // 刷新卡片
    this.refreshNotes(note) // 刷新卡片
    if (addToReview) {
      this.addToReview(note, reviewEverytime) // 加入复习
    }
    MNUtil.undoGrouping(()=>{
      note.focusInMindMap()
    })
  }

  /**
   * 一键制卡（支持摘录版本）
   */
  static makeNote(note, addToReview = true, reviewEverytime = true) {
    if (note.excerptText) {
      let newnote = this.toNoExceptVersion(note)
      newnote.focusInMindMap(0.5)
      MNUtil.delay(0.5).then(()=>{
        note = MNNote.getFocusNote()
        MNUtil.delay(0.5).then(()=>{
          this.makeCard(note, addToReview, reviewEverytime) // 制卡
        })
        MNUtil.undoGrouping(()=>{
          // this.refreshNote(note)
          this.refreshNotes(note)
          // this.addToReview(note, true) // 加入复习
        })
      })
    } else {
      this.makeCard(note, addToReview, reviewEverytime) // 制卡
      this.refreshNotes(note)
    }
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
        // newNote.focusInMindMap(0.2)
        return newNote; // 返回新卡片
      } else {
        return note;
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
    
    // 处理链接相关问题
    this.convertLinksToNewVersion(note)
    this.cleanupBrokenLinks(note)
    this.fixMergeProblematicLinks(note)
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
    
    let excludingTypes = ["思路", "作者", "研究进展", "论文", "书作", "文献"];
    if (!excludingTypes.includes(noteType)) {
      switch (noteType) {
        case "归类":
          /**
           * 去掉归类卡片的标题中的“xx”：“yy” 里的 xx
           */
          if (this.hasOldClassificationTitle(note)) {
            note.title = `“${this.parseNoteTitle(note).content}”相关${this.parseNoteTitle(note).type}`;
          }
          break;
        default:
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
          break;
      }
    }

    note.title = Pangu.spacing(note.title)
  }

  /**
   * 批量重新处理归类卡片标题
   * 
   * 专门用于处理"归类"类型的卡片，将旧格式标题转换为新格式
   * 旧格式："xx"："yy"相关 zz -> 新格式："yy"相关 zz
   * 
   * @param {string} scope - 处理范围："selected" | "children" | "descendants"
   * @param {MNNote} [rootNote] - 当 scope 为 "children" 或 "descendants" 时，指定根卡片
   */
  static async batchChangeClassificationTitles(scope = "descendants", rootNote = null) {
    try {
      let targetNotes = [];
      let processedCount = 0;
      let skippedCount = 0;

      // 根据范围获取目标卡片
      switch (scope) {
        case "selected":
          let focusNote = MNNote.getFocusNote();
          if (focusNote) {
            targetNotes = [focusNote.note];
          } else {
            MNUtil.showHUD("请先选择一个卡片");
            return;
          }
          break;
        case "children":
          if (!rootNote) {
            rootNote = MNNote.getFocusNote();
          }
          if (rootNote) {
            // rootNote.childNotes 返回 MNNote 对象数组，需要转换为原生 note 对象数组
            targetNotes = (rootNote.childNotes || []).map(mnNote => mnNote.note);
            targetNotes.push(rootNote.note)
          } else {
            MNUtil.showHUD("请先选择一个根卡片");
            return;
          }
          break;
        case "descendants":
          if (!rootNote) {
            rootNote = MNNote.getFocusNote();
          }
          if (rootNote) {
            targetNotes = this.getAllDescendantNotes(rootNote);
            targetNotes.push(rootNote.note)
          } else {
            MNUtil.showHUD("请先选择一个根卡片");
            return;
          }
          break;
        default:
          MNUtil.showHUD("无效的处理范围");
          return;
      }

      // 筛选出归类卡片
      let classificationNotes = [];
      for (let noteObj of targetNotes) {
        let note = new MNNote(noteObj);
        if (this.getNoteType(note) === "归类") {
          classificationNotes.push(note);
        }
      }

      if (classificationNotes.length === 0) {
        MNUtil.showHUD("没有找到归类卡片");
        return;
      }

      // 询问用户确认
      let confirmMessage = `找到 ${classificationNotes.length} 个归类卡片，是否批量更新标题格式？`;
      let userConfirmed = await MNUtil.confirm("批量修改归类卡片标题", confirmMessage);
      if (!userConfirmed) {
        return;
      }

      // 显示进度提示
      MNUtil.showHUD(`开始处理 ${classificationNotes.length} 个归类卡片...`);

      // 使用 undoGrouping 包装批量操作
      MNUtil.undoGrouping(() => {
        for (let i = 0; i < classificationNotes.length; i++) {
          let note = classificationNotes[i];
          let originalTitle = note.title;
          
          // 使用现有的解析方法
          // let titleParts = this.parseNoteTitle(note);
          
          // 检查是否解析成功，并且是旧格式
          if (this.hasOldClassificationTitle(note)) {
            // 转换为新格式："content"相关 type
            // note.title = `“${titleParts.content}”相关${titleParts.type}`;
            this.changeTitle(note)

            processedCount++;
            MNUtil.log({
              level: "info",
              message: `归类卡片标题已更新：${originalTitle} -> ${note.title}`,
              source: "MNMath.batchChangeClassificationTitles"
            });
          } else {
            skippedCount++;
            MNUtil.log({
              level: "info",
              message: `跳过标题（已是新格式或无法解析）：${originalTitle}`,
              source: "MNMath.batchChangeClassificationTitles"
            });
          }
        }
      });

      // 显示进度更新
      for (let i = 0; i < classificationNotes.length; i++) {
        if ((i + 1) % 5 === 0) {
          MNUtil.showHUD(`处理中... ${i + 1}/${classificationNotes.length}`);
          await MNUtil.delay(0.1);
        }
      }

      // 显示处理结果
      let resultMessage = `归类卡片处理完成！\n已更新：${processedCount} 个\n跳过：${skippedCount} 个`;
      MNUtil.showHUD(resultMessage);
      
      // 记录处理结果
      MNUtil.log({
        level: "info",
        message: `批量归类卡片标题处理完成 - 范围：${scope}，处理：${processedCount}，跳过：${skippedCount}`,
        source: "MNMath.batchChangeClassificationTitles"
      });

    } catch (error) {
      MNUtil.showHUD("批量处理归类卡片标题时出错：" + error.message);
      MNUtil.log({
        level: "error",
        message: "批量处理归类卡片标题失败：" + error.message,
        source: "MNMath.batchChangeClassificationTitles"
      });
    }
  }

  static hasOldClassificationTitle(note) {
    // 检查标题是否符合旧格式："xx"："yy"相关 zz
    return /^“[^”]*”：“[^”]*”\s*相关[^“]*$/.test(note.title);
  }

  /**
   * 批量重新处理卡片标题
   * 
   * 可以选择处理当前文档的所有卡片或指定范围的卡片
   * 
   * @param {string} scope - 处理范围："all" | "selected" | "children" | "descendants"
   * @param {MNNote} [rootNote] - 当 scope 为 "children" 或 "descendants" 时，指定根卡片
   */
  static async batchChangeTitles(scope = "all", rootNote = null) {
    try {
      let targetNotes = [];
      let processedCount = 0;
      let skippedCount = 0;

      // 根据范围获取目标卡片
      switch (scope) {
        case "all":
          // 获取当前笔记本的所有卡片
          let currentNotebook = MNUtil.currentNotebook;
          if (currentNotebook) {
            targetNotes = currentNotebook.notes || [];
          } else {
            MNUtil.showHUD("请先打开一个笔记本");
            return;
          }
          break;
          
        case "selected":
          // 获取当前选中的卡片
          let focusNote = MNNote.getFocusNote();
          if (focusNote) {
            targetNotes = [focusNote.note];
          } else {
            MNUtil.showHUD("请先选择一个卡片");
            return;
          }
          break;
          
        case "children":
          // 获取指定卡片的直接子卡片
          if (!rootNote) {
            rootNote = MNNote.getFocusNote();
          }
          if (rootNote) {
            // rootNote.childNotes 返回 MNNote 对象数组，需要转换为原生 note 对象数组
            targetNotes = (rootNote.childNotes || []).map(mnNote => mnNote.note);
          } else {
            MNUtil.showHUD("请先选择一个根卡片");
            return;
          }
          break;
          
        case "descendants":
          // 获取指定卡片的所有后代卡片
          if (!rootNote) {
            rootNote = MNNote.getFocusNote();
          }
          if (rootNote) {
            targetNotes = this.getAllDescendantNotes(rootNote);
          } else {
            MNUtil.showHUD("请先选择一个根卡片");
            return;
          }
          break;
          
        default:
          MNUtil.showHUD("无效的处理范围");
          return;
      }

      if (targetNotes.length === 0) {
        MNUtil.showHUD("没有找到需要处理的卡片");
        return;
      }

      // 询问用户确认
      let confirmMessage = `即将批量处理 ${targetNotes.length} 个卡片的标题，是否继续？`;
      let userConfirmed = await MNUtil.confirm("批量修改标题", confirmMessage);
      if (!userConfirmed) {
        return;
      }

      // 显示进度提示
      MNUtil.showHUD(`开始处理 ${targetNotes.length} 个卡片...`);

      // 使用 undoGrouping 包装批量操作
      MNUtil.undoGrouping(() => {
        for (let i = 0; i < targetNotes.length; i++) {
          let note = new MNNote(targetNotes[i]);
          
          // 记录处理前的标题
          let originalTitle = note.title;
          
          // 调用 changeTitle 方法
          this.changeTitle(note);
          
          // 检查标题是否发生变化
          if (note.title !== originalTitle) {
            processedCount++;
            MNUtil.log({
              level: "info",
              message: `标题已更新：${originalTitle} -> ${note.title}`,
              source: "MNMath.batchChangeTitles"
            });
          } else {
            skippedCount++;
          }
        }
      });

      // 显示进度更新
      for (let i = 0; i < targetNotes.length; i++) {
        if ((i + 1) % 10 === 0) {
          MNUtil.showHUD(`处理中... ${i + 1}/${targetNotes.length}`);
          await MNUtil.delay(0.1);
        }
      }

      // 显示处理结果
      let resultMessage = `处理完成！\n已更新：${processedCount} 个\n跳过：${skippedCount} 个`;
      MNUtil.showHUD(resultMessage);
      
      // 记录处理结果
      MNUtil.log({
        level: "info",
        message: `批量标题处理完成 - 范围：${scope}，处理：${processedCount}，跳过：${skippedCount}`,
        source: "MNMath.batchChangeTitles"
      });

    } catch (error) {
      MNUtil.showHUD("批量处理标题时出错：" + error.message);
      MNUtil.log({
        level: "error",
        message: "批量处理标题失败：" + error.message,
        source: "MNMath.batchChangeTitles"
      });
    }
  }

  /**
   * 获取指定卡片的所有后代卡片（包括子卡片和子卡片的子卡片等）
   * 
   * @param {MNNote} rootNote - 根卡片
   * @returns {object[]} 所有后代卡片的原生对象数组
   */
  static getAllDescendantNotes(rootNote) {
    let descendants = [];
    
    // 确保 rootNote 是 MNNote 对象
    if (!rootNote || !rootNote.childNotes) {
      return descendants;
    }
    
    let childNotes = rootNote.childNotes || [];  // 这里返回的是 MNNote 对象数组
    
    for (let childMNNote of childNotes) {
      // childMNNote 已经是 MNNote 对象，不需要再用 new MNNote() 包装
      descendants.push(childMNNote.note);
      
      // 递归获取子卡片的后代
      let childDescendants = this.getAllDescendantNotes(childMNNote);
      descendants.push(...childDescendants);
    }
    
    return descendants;
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
    // 白名单：这些类型的卡片即使只有图片+链接也按正常方式处理
    const typeWhitelist = []; // 暂时为空，后续可以添加需要排除的卡片类型
    
    // 获取卡片类型
    let noteType = this.getNoteType(note);
    
    // 检查是否为特殊情况：只有合并图片和链接
    let isSpecialCase = false;
    let linkIndices = [];
    
    if (!typeWhitelist.includes(noteType)) {
      // 检查所有评论是否只包含合并图片和链接
      let hasOtherContent = false;
      
      for (let i = 0; i < note.MNComments.length; i++) {
        let comment = note.MNComments[i];
        if (comment.type === "mergedImageComment" || comment.type === "mergedImageCommentWithDrawing") {
          // 是合并图片，继续
          continue;
        } else if (comment.type === "linkComment") {
          // 是链接，记录索引
          linkIndices.push(i);
        } else {
          // 有其他类型的内容
          hasOtherContent = true;
          break;
        }
      }
      
      // 如果没有其他内容且有链接，则为特殊情况
      isSpecialCase = !hasOtherContent && linkIndices.length > 0;
    }
    
    let moveIndexArr = this.autoGetNewContentToMoveIndexArr(note);
    
    let ifTemplateMerged = this.mergeTemplate(note)

    if (!ifTemplateMerged) {
      // 使用映射表获取默认字段
      let field = this.getDefaultFieldForType(noteType);
      
      // 特殊处理：将链接移动到最底下
      if (isSpecialCase) {
        note.moveCommentsByIndexArr(moveIndexArr, note.comments.length);
      } else {
        if (field && moveIndexArr.length > 0) {
          this.moveCommentsArrToField(note, moveIndexArr, field);
        }
      }
    }
  }

  /**
   * 合并模板卡片
   */
  static mergeTemplate(note) {
    let ifTemplateMerged = note.MNComments.some(comment => comment.type === "HtmlComment"); // 是否已合并模板卡片，要在下面的代码前获取，否则一直是已合并
    // 防止重复制卡：如果里面有 HtmlComment 则不制卡
    if (!note.MNComments.some(comment => comment.type === "HtmlComment")) {
      this.cloneAndMergeById(note, this.types[this.getNoteType(note)].templateNoteId);
    }

    // 返回是否已制卡
    return ifTemplateMerged
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
  static autoGetNewContentToMoveIndexArr(note) {
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
          // 如果 content 以 `; ` 开头，则去掉?
          // 暂时不去掉，因为制卡会把标题链接的第一个词前面的分号去掉
          // if (titleParts.content.startsWith("; ")) {
          //   titleParts.content = titleParts.content.slice(2).trim();
          // }
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
        moveCommentIndexArr = userInput ? userInput.parseCommentIndices(note.comments.length) : this.autoGetNewContentToMoveIndexArr(note);
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
   * 自动获取新内容并移动到指定字段
   * 
   * 此函数是 moveCommentsArrToField 的优化版本，自动获取要移动的内容索引
   * 并将其移动到指定字段下。适用于快速整理新添加的内容。
   * 
   * @param {MNNote} note - 要操作的笔记对象
   * @param {string} field - 目标字段名称（支持"摘录"/"摘录区"作为特殊字段）
   * @param {boolean} [toBottom=true] - 是否移动到字段底部，false 则移动到字段顶部
   * @param {boolean} [showEmptyHUD=true] - 当没有可移动内容时是否显示提示
   * @returns {Array<number>} 返回已移动的评论索引数组
   * 
   * @example
   * // 将新内容移动到"证明"字段底部
   * MNMath.autoMoveNewContentToField(note, "证明");
   * 
   * @example
   * // 将新内容移动到"相关思考"字段顶部，不显示空内容提示
   * let movedIndices = MNMath.autoMoveNewContentToField(note, "相关思考", false, false);
   * if (movedIndices.length > 0) {
   *   MNUtil.showHUD(`成功移动 ${movedIndices.length} 条内容`);
   * }
   * 
   * @example
   * // 将新内容移动到摘录区
   * MNMath.autoMoveNewContentToField(note, "摘录区");
   */
  static autoMoveNewContentToField(note, field, toBottom = true, showEmptyHUD = true) {
    // 自动获取要移动的内容索引
    let indexArr = this.autoGetNewContentToMoveIndexArr(note);
    
    // 检查是否有内容需要移动
    if (indexArr.length === 0) {
      if (showEmptyHUD) {
        MNUtil.showHUD("没有检测到可移动的新内容");
      }
      return [];
    }
    
    // 检查目标字段是否存在
    let fieldExists = false;
    
    // 特殊处理摘录区
    if (field === "摘录" || field === "摘录区") {
      fieldExists = true;  // 摘录区始终存在
    } else {
      // 检查 HTML 字段
      let htmlCommentsTextArr = this.parseNoteComments(note).htmlCommentsTextArr;
      fieldExists = htmlCommentsTextArr.some(text => text.includes(field));
    }
    
    if (!fieldExists) {
      MNUtil.showHUD(`未找到字段"${field}"，请检查字段名称`);
      return [];
    }
    
    // 执行移动操作
    this.moveCommentsArrToField(note, indexArr, field, toBottom);
    
    return indexArr;
  }

  /**
   * 根据卡片类型自动获取新内容并移动到相应字段
   * 
   * 此函数基于 autoMoveNewContentToField，会根据卡片类型自动确定目标字段。
   * 是最智能的内容整理方法，无需手动指定字段。
   * 
   * @param {MNNote} note - 要操作的笔记对象  
   * @param {boolean} [toBottom=true] - 是否移动到字段底部，false 则移动到字段顶部
   * @param {boolean} [showEmptyHUD=true] - 当没有可移动内容时是否显示提示
   * @returns {{field: string, indices: Array<number>}} 返回目标字段和已移动的评论索引数组
   * 
   * @example
   * // 自动根据卡片类型移动内容
   * let result = MNMath.autoMoveNewContentByType(note);
   * if (result.indices.length > 0) {
   *   MNUtil.showHUD(`已将 ${result.indices.length} 条内容移动到"${result.field}"字段`);
   * }
   * 
   * @example  
   * // 移动到字段顶部，不显示空内容提示
   * MNMath.autoMoveNewContentByType(note, false, false);
   */
  static autoMoveNewContentByType(note, toBottom = true, showEmptyHUD = true) {
    // 根据卡片类型确定目标字段
    let noteType = this.getNoteType(note);
    let field = this.getDefaultFieldForType(noteType);
    
    if (!field) {
      if (showEmptyHUD) {
        MNUtil.showHUD(`未识别的卡片类型：${noteType || "空"}`);
      }
      return {field: "", indices: []};
    }
    
    // 执行移动操作
    let indices = this.autoMoveNewContentToField(note, field, toBottom, showEmptyHUD);
    
    return {field: field, indices: indices};
  }

  /**
   * 移动内容到摘录区
   * 
   * 专门用于将内容移动到卡片最上方的摘录区域的便捷方法
   * 
   * @param {MNNote} note - 要操作的笔记对象
   * @param {Array|string} indexArr - 要移动的评论索引数组或字符串
   * @returns {boolean} 是否成功移动
   * 
   * @example
   * // 移动指定索引的内容到摘录区
   * MNMath.moveToExcerptArea(note, [1,2,3]);
   * 
   * @example
   * // 使用字符串格式
   * MNMath.moveToExcerptArea(note, "1-3,5");
   */
  static moveToExcerptArea(note, indexArr) {
    try {
      this.moveCommentsArrToField(note, indexArr, "摘录区", true);
      return true;
    } catch (error) {
      MNUtil.showHUD(`移动到摘录区失败: ${error.message || error}`);
      return false;
    }
  }

  /**
   * 移动评论到指定字段
   * 
   * @param {MNNote} note - 要操作的笔记对象
   * @param {Array|string} indexArr - 要移动的评论索引数组或字符串（支持 "1,3-5,Y,Z" 格式）
   * @param {string} field - 目标字段名称。特殊字段：
   *                         - "摘录" 或 "摘录区" - 移动到卡片最上方的摘录区域
   *                         - 其他字段名 - 移动到对应的 HTML 字段下
   * @param {boolean} [toBottom=true] - 是否移动到字段底部，false 则移动到字段顶部（摘录区除外）
   * 
   * @example
   * // 移动到摘录区
   * MNMath.moveCommentsArrToField(note, [1,2,3], "摘录区");
   * 
   * @example  
   * // 移动到"证明"字段顶部
   * MNMath.moveCommentsArrToField(note, "1-3", "证明", false);
   */
  static moveCommentsArrToField(note, indexArr, field, toBottom = true) {
    let getHtmlCommentsTextArrForPopup = this.getHtmlCommentsTextArrForPopup(note);
    let commentsIndexArrToMove = this.getCommentsIndexArrToMoveForPopup(note);

    let targetIndex = -1
    
    // 标准化字段名称，支持"摘录"和"摘录区"的简写
    let normalizedField = field;
    if (field === "摘录" || field === "摘录区") {
      normalizedField = "摘录区";  // 统一为"摘录区"以匹配"----------【摘录区】----------"
    }
    
    getHtmlCommentsTextArrForPopup.forEach((text, index) => {
      if (text.includes(normalizedField)) {
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
   * 通过弹窗选择并替换字段内容
   * 删除字段A下的内容，并将字段B下的内容或自动获取的新内容移动到字段A下方
   */
  static replaceFieldContentByPopup(note) {
    let htmlCommentsTextArr = this.parseNoteComments(note).htmlCommentsTextArr;
    
    if (htmlCommentsTextArr.length < 1) {
      MNUtil.showHUD("需要至少一个字段才能执行替换操作");
      return;
    }

    // 创建字段选择菜单
    let fieldOptions = htmlCommentsTextArr.map(text => text.trim());
    
    // 第一个弹窗：选择目标字段
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "选择目标字段",
      "选择要被替换内容的字段",
      0,  // 普通样式
      "取消",
      fieldOptions,
      (_, buttonIndex) => {
        if (buttonIndex === 0) return; // 用户取消
        
        let fieldA = fieldOptions[buttonIndex - 1]; // buttonIndex从1开始
        
        // 创建内容来源选择菜单
        let sourceOptions = ["自动获取新内容"];
        
        // 添加其他字段作为选项（排除已选的目标字段）
        let otherFields = fieldOptions.filter((_, index) => index !== buttonIndex - 1);
        sourceOptions = sourceOptions.concat(otherFields.map(field => `来自字段：${field}`));
        
        // 第二个弹窗：选择内容来源
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "选择内容来源",
          `选择要移动到"${fieldA}"字段下的内容来源`,
          0,  // 普通样式
          "取消",
          sourceOptions,
          (_, buttonIndexB) => {
            if (buttonIndexB === 0) return; // 用户取消
            
            if (buttonIndexB === 1) {
              // 选择了"自动获取新内容"
              this.replaceFieldContentWithAutoContent(note, fieldA);
            } else {
              // 选择了某个字段
              let fieldB = otherFields[buttonIndexB - 2]; // 减去"自动获取新内容"选项
              this.replaceFieldContent(note, fieldA, fieldB);
            }
          }
        );
      }
    );
  }

  /**
   * 使用自动获取的新内容替换字段内容
   * @param {MNNote} note - 目标笔记
   * @param {string} fieldA - 目标字段名称
   */
  static replaceFieldContentWithAutoContent(note, fieldA) {
    let commentsObj = this.parseNoteComments(note);
    let htmlCommentsObjArr = commentsObj.htmlCommentsObjArr;
    
    if (htmlCommentsObjArr.length === 0) {
      MNUtil.showHUD("未找到字段结构");
      return;
    }

    // 通过字段名称找到对应的字段对象
    let fieldAObj = htmlCommentsObjArr.find(obj => obj.text.includes(fieldA));
    
    if (!fieldAObj) {
      MNUtil.showHUD(`无法找到字段"${fieldA}"`);
      return;
    }
    
    // 获取自动识别的新内容索引
    let autoContentIndices = this.autoGetNewContentToMoveIndexArr(note);
    
    if (autoContentIndices.length === 0) {
      MNUtil.showHUD("没有检测到可移动的新内容");
      return;
    }
    
    // 获取字段A下的内容索引（不包括字段标题本身）
    let fieldAContentIndices = fieldAObj.excludingFieldBlockIndexArr;
    
    // 先删除字段A下的内容（从后往前删除，避免索引变化）
    if (fieldAContentIndices.length > 0) {
      let sortedFieldAIndices = fieldAContentIndices.sort((a, b) => b - a);
      sortedFieldAIndices.forEach(index => {
        note.removeCommentByIndex(index);
      });
    }
    
    // 重新解析评论结构（因为删除操作改变了索引）
    commentsObj = this.parseNoteComments(note);
    htmlCommentsObjArr = commentsObj.htmlCommentsObjArr;
    
    // 重新获取自动内容索引（索引可能已经改变）
    autoContentIndices = this.autoGetNewContentToMoveIndexArr(note);
    
    if (autoContentIndices.length === 0) {
      MNUtil.showHUD("删除原内容后，没有检测到可移动的新内容");
      return;
    }
    
    // 移动自动获取的内容到字段A下方
    this.moveCommentsArrToField(note, autoContentIndices, fieldA, true);
    
    // 刷新卡片显示
    note.refresh();
    
    MNUtil.showHUD(`已将自动获取的新内容移动到"${fieldA}"字段下，并删除了原有内容`);
  }

  /**
   * 替换字段内容的核心方法
   * @param {MNNote} note - 目标笔记
   * @param {string} fieldA - 目标字段名称
   * @param {string} fieldB - 源字段名称
   */
  static replaceFieldContent(note, fieldA, fieldB) {
    let commentsObj = this.parseNoteComments(note);
    let htmlCommentsObjArr = commentsObj.htmlCommentsObjArr;
    
    if (htmlCommentsObjArr.length === 0) {
      MNUtil.showHUD("未找到字段结构");
      return;
    }

    // 通过字段名称找到对应的字段对象
    let fieldAObj = htmlCommentsObjArr.find(obj => obj.text.includes(fieldA));
    let fieldBObj = htmlCommentsObjArr.find(obj => obj.text.includes(fieldB));
    
    if (!fieldAObj) {
      MNUtil.showHUD(`无法找到字段"${fieldA}"`);
      return;
    }
    
    if (!fieldBObj) {
      MNUtil.showHUD(`无法找到字段"${fieldB}"`);
      return;
    }
    
    // 获取字段A下的内容索引（不包括字段标题本身）
    let fieldAContentIndices = fieldAObj.excludingFieldBlockIndexArr;
    
    // 获取字段B下的内容索引（不包括字段标题本身）
    let fieldBContentIndices = fieldBObj.excludingFieldBlockIndexArr;
    
    if (fieldBContentIndices.length === 0) {
      MNUtil.showHUD(`字段"${fieldB}"下没有内容可移动`);
      return;
    }
    
    // 先删除字段A下的内容（从后往前删除，避免索引变化）
    if (fieldAContentIndices.length > 0) {
      let sortedFieldAIndices = fieldAContentIndices.sort((a, b) => b - a);
      sortedFieldAIndices.forEach(index => {
        note.removeCommentByIndex(index);
      });
    }
    
    // 重新解析评论结构（因为删除操作改变了索引）
    commentsObj = this.parseNoteComments(note);
    htmlCommentsObjArr = commentsObj.htmlCommentsObjArr;
    
    // 重新获取字段B的内容（索引可能已经改变）
    fieldBObj = htmlCommentsObjArr.find(obj => obj.text.includes(fieldB));
    if (!fieldBObj) {
      MNUtil.showHUD(`无法找到字段"${fieldB}"`);
      return;
    }
    
    fieldBContentIndices = fieldBObj.excludingFieldBlockIndexArr;
    
    if (fieldBContentIndices.length === 0) {
      MNUtil.showHUD(`字段"${fieldB}"下没有内容可移动`);
      return;
    }
    
    // 移动字段B的内容到字段A下方
    this.moveCommentsArrToField(note, fieldBContentIndices, fieldA, true);
    
    // 刷新卡片显示
    note.refresh();
    
    MNUtil.showHUD(`已将"${fieldB}"字段的内容移动到"${fieldA}"字段下，并删除了"${fieldA}"原有内容`);
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
        contentInTitle = titleParts.prefixContent + "｜" + titleParts.titleLinkWordsArr[0];
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
                let titlePartsArray = userInputTitle.split("//")
                let titlesArray = []
                if (titlePartsArray.length > 1) {
                  // 生成倒序组合
                  // 把 item1+itemn, item1+itemn-1+itemn, item1+itemn-2+itemn-1+itemn, ... , item1+item2+item3+...+itemn 依次加入数组
                  // 比如 “赋范空间上的//有界//线性//算子” 得到的 titlePartsArray 是
                  // ["赋范空间上的", "有界", "线性", "算子"]
                  // 则 titleArray = ["赋范空间上的算子", "赋范空间上的线性算子", "赋范空间上的有界线性算子"]
                  const prefix = titlePartsArray[0];
                  let changedTitlePart = titlePartsArray[titlePartsArray.length-1]
                  for (let i = titlePartsArray.length-1 ; i >= 1 ; i--) {
                    if  (i < titlePartsArray.length-1) {
                      changedTitlePart = titlePartsArray[i] + changedTitlePart
                    }
                    titlesArray.push(prefix + changedTitlePart)
                  }
                }
                let type
                let lastNote = note
                switch (this.getNoteType(note)) {
                  case "归类":
                    type = this.parseNoteTitle(note).type
                    MNUtil.undoGrouping(()=>{
                      titlesArray.forEach(title => {
                      let newClassificationNote = this.createClassificationNote(lastNote, title, type)
                        lastNote = newClassificationNote
                      })
                      lastNote.focusInMindMap(0.3)
                    })
                    break;
                  default:
                    let typeArr = ["定义","命题","例子","反例","思想方法","问题"]
                    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
                      "增加归类卡片",
                      "选择类型",
                      0,
                      "取消",
                      typeArr,
                      (alert, buttonIndex) => {
                        if (buttonIndex == 0) { return }
                        type = typeArr[buttonIndex-1]
                        MNUtil.undoGrouping(()=>{
                          titlesArray.forEach(title => {
                          let newClassificationNote = this.createClassificationNote(lastNote, title, type)
                            lastNote = newClassificationNote
                          })
                          lastNote.focusInMindMap(0.3)
                        })
                      })
                    break;
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
                let titlePartsArray = userInputTitle.split("//")
                let titlesArray = []
                titlesArray.push(titlePartsArray[0]) // 添加第一个部分
                if (titlePartsArray.length > 1) {
                  // 生成顺序组合
                  for (let i = 1; i < titlePartsArray.length; i++) {
                    titlesArray.push(titlesArray[i-1] + titlePartsArray[i])
                  }
                }
                let type
                let lastNote = note
                switch (this.getNoteType(note)) {
                  case "归类":
                    type = this.parseNoteTitle(note).type
                    MNUtil.undoGrouping(()=>{
                      titlesArray.forEach(title => {
                      let newClassificationNote = this.createClassificationNote(lastNote, title, type)
                        lastNote = newClassificationNote
                      })
                      lastNote.focusInMindMap(0.3)
                    })
                    break;
                  default:
                    let typeArr = ["定义","命题","例子","反例","思想方法","问题"]
                    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
                      "增加归类卡片",
                      "选择类型",
                      0,
                      "取消",
                      typeArr,
                      (alert, buttonIndex) => {
                        if (buttonIndex == 0) { return }
                        type = typeArr[buttonIndex-1]
                        MNUtil.undoGrouping(()=>{
                          titlesArray.forEach(title => {
                          let newClassificationNote = this.createClassificationNote(lastNote, title, type)
                            lastNote = newClassificationNote
                          })
                          lastNote.focusInMindMap(0.3)
                        })
                      })
                    break;
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


  static createClassificationNote(note, title, type) {
    let templateNote = MNNote.clone(this.types["归类"].templateNoteId);
    templateNote.noteTitle = `“${title}”相关${type}`;
    note.addChild(templateNote.note);
    this.linkParentNote(templateNote);
    return templateNote;
  }

  /**
   * 将旧版本的 marginnote3app:// 链接转换为 marginnote4app:// 链接
   * 
   * @param {MNNote} note - 要处理的卡片
   */
  static convertLinksToNewVersion(note) {
    for (let i = note.comments.length - 1; i >= 0; i--) {
      let comment = note.comments[i]
      if (
        comment.type === "TextNote" &&
        comment.text.startsWith("marginnote3app://note/")
      ) {
        let targetNoteId = comment.text.match(/marginnote3app:\/\/note\/(.*)/)[1]
        let targetNote = MNNote.new(targetNoteId, false) // 不弹出警告
        if (targetNote) {
          note.removeCommentByIndex(i)
          note.appendNoteLink(targetNote, "To")
          note.moveComment(note.comments.length - 1, i)
        } else {
          note.removeCommentByIndex(i)
        }
      }
    }
  }

  /**
   * 清理失效的链接（目标卡片不存在的链接）
   * 
   * @param {MNNote} note - 要清理的卡片
   */
  static cleanupBrokenLinks(note) {
    for (let i = note.comments.length - 1; i >= 0; i--) {
      let comment = note.comments[i]
      if (
        comment.type === "TextNote" &&
        (
          comment.text.startsWith("marginnote3app://note/") ||
          comment.text.startsWith("marginnote4app://note/")
        )
      ) {
        let targetNoteId = comment.text.match(/marginnote[34]app:\/\/note\/(.*)/)[1]
        if (!targetNoteId.includes("/summary/")) {  // 防止把概要的链接删掉了
          let targetNote = MNNote.new(targetNoteId, false) // 不弹出警告
          if (!targetNote) {
            note.removeCommentByIndex(i)
          }
        }
      }
    }
  }

  /**
   * 修复合并造成的链接问题
   * 当卡片被合并后，链接可能指向旧的 noteId，需要更新为 groupNoteId
   * 
   * @param {MNNote} note - 要修复的卡片
   */
  static fixMergeProblematicLinks(note) {
    let comments = note.MNComments
    comments.forEach((comment) => {
      if (comment.type === "linkComment") {
        let targetNote = MNNote.new(comment.text, false) // 不弹出警告
        if (targetNote && targetNote.groupNoteId) {
          if (targetNote.groupNoteId !== comment.text) {
            // 更新链接为正确的 groupNoteId
            comment.text = `marginnote${MNUtil.isMN4() ? '4' : '3'}app://note/${targetNote.groupNoteId}`
          }
        }
      }
    })
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

/**
 * 夏大鱼羊 - MNUtil prototype 扩展 - begin
 */


/**
 * 判断是否是普通对象
 * @param {Object} obj 
 * @returns {Boolean}
 */
MNUtil.isObj = function(obj) {
  return typeof obj === "object" && obj !== null && !Array.isArray(obj)
}

MNUtil.ifObj = function(obj) {
  return this.isObj(obj)
}

/**
 * 判断评论是否是链接
 */
MNUtil.isCommentLink = function(comment){
  if (this.isObj(comment)) {
    if (comment.type == "TextNote") {
      return comment.text.isLink()
    }
  } else if (typeof comment == "string") {
    return comment.isLink()
  }
}

MNUtil.isLink = function(comment){
  return this.isCommentLink(comment)
}

MNUtil.ifLink = function(comment){
  return this.isCommentLink(comment)
}

MNUtil.ifCommentLink = function(comment){
  return this.isCommentLink(comment)
}

/**
 * 获取到链接的文本
 */
MNUtil.getLinkText = function(link){
  if (this.isObj(link) && this.isCommentLink(link)) {
    return link.text
  }
  return link
}

/**
 * 夏大鱼羊 - MNUtil prototype 扩展 - end
 */

/**
 * 夏大鱼羊 - MNNote prototype 扩展 - begin
 */

/**
 * 判断卡片是否是文献卡片：论文和书作
 * 
 * 依据：是否有"文献信息："的评论问
 * 注意：标题里带有"文献"二字的不一定，因为【文献：作者】暂时不需要判断为文献卡片
 */
MNNote.prototype.ifReferenceNote = function() {
  // return this.getHtmlCommentIndex("文献信息：") !== -1
  return this.title.startsWith("【文献") || this.title.startsWith("【参考文献")
}

/**
 * 判断是否是旧的文献卡片
 */
MNNote.prototype.ifOldReferenceNote = function() {
  return this.getHtmlCommentIndex("主要内容、摘要：") !== -1 || this.getHtmlCommentIndex("主要内容/摘要：") !== -1
}

/**
 * 卡片去掉所有评论
 */
MNNote.prototype.clearAllComments = function(){
  for (let i = this.comments.length -1; i >= 0; i--) {
    this.removeCommentByIndex(i)
  }
}


/**
 * 让卡片成为进度卡片
 * - 在学习规划学习集中，某些卡片起了大头钉的作用，下次能知道从哪里开始看
 * 
 * 1. 卡片变成灰色
 * 2. 找到摘录对应的 md5
 * 3. 找到学习规划学习集中对应的卡片
 * 4. 将卡片移动到学习规划学习集中对应的卡片下成为子卡片
 */
MNNote.prototype.toBeProgressNote = function(){
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
MNNote.prototype.toBeIndependent = function(){
  let parentNote = this.getClassificationParentNote()
  parentNote.addChild(this)
  this.focusInMindMap(0.5)
}

/**
 * 将 IdArr 里的 ID 对应的卡片剪切到 this 作为子卡片
 */
MNNote.prototype.pasteChildNotesByIdArr = function(arr) {
  arr.forEach((id) => {
    if (id.isNoteIdorURL()) {
      this.pasteChildNoteById(id.toNoteId())
    }
  })
}

MNNote.prototype.pasteChildNoteById = function(id) {
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
 * 【数学】移动卡片到某些特定的子卡片后
 * 
 * 目前只移动文献
 * 
 * 1. 先判断是否需要移动文献
 * 2. 如果要的话再移动到论文或者书作文献区
 */
MNNote.prototype.move = function() {
  let noteType = this.getNoteTypeZh()
  let targetNoteId
  if (noteType == "文献") {
    if (this.ifReferenceNoteToMove()) {
      // 此时文献卡片不在"论文"或"书作"文献区
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
 * 夏大鱼羊 - MNNote prototype 扩展 - end
 */

/**
 * 夏大鱼羊 - MNComment prototype 扩展 - begin
 */

// 修改MNComment的text setter，添加对linkComment和markdownComment的支持
if (typeof MNComment !== 'undefined' && MNComment.prototype) {
  const originalTextSetter = Object.getOwnPropertyDescriptor(MNComment.prototype, 'text')?.set;
  
  Object.defineProperty(MNComment.prototype, 'text', {
    get: function() {
      // 保持原有的getter逻辑
      return this.detail?.text;
    },
    set: function(text) {
      if (this.originalNoteId) {
        let note = MNNote.new(this.originalNoteId)
        switch (this.type) {
          case "linkComment":
          case "markdownComment":
            this.detail.text = text
            note.replaceWithMarkdownComment(text, this.index)
            break;
          case "textComment":
            this.detail.text = text
            note.replaceWithTextComment(text, this.index)
            break;
          case "blankTextComment":
          case "mergedImageComment":
          case "mergedTextComment":
            this.detail.q_htext = text
            let mergedNote = this.note
            mergedNote.excerptText = text
            break;
          default:
            if (originalTextSetter) {
              originalTextSetter.call(this, text);
            } else {
              MNUtil.showHUD("Unsupported comment type: " + this.type)
            }
            break;
        }
      } else {
        MNUtil.showHUD("No originalNoteId")
      }
    },
    enumerable: true,
    configurable: true
  });
}

/**
 * 夏大鱼羊 - MNComment prototype 扩展 - end
 */

/**
 * 夏大鱼羊 - MNNote prototype 扩展 - 更多方法 - begin
 */


/**
 * 删除评论
 * 
 * 提供一些预设项，并且用户可以自行输入要删除的评论 Index
 */
MNNote.prototype.deleteCommentsByPopup = function(){
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
MNNote.prototype.deleteCommentsByPopupAndMoveNewContentTo = function(target, toBottom= true){
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
 * 【数学】获取"证明"系列的 Html 的 index
 *  因为命题、反例、思想方法的"证明："叫法不同
 */
MNNote.prototype.getProofHtmlCommentIndexByNoteType = function(type){
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

MNNote.prototype.getProofNameByType = function(type){
  if (MNUtil.isObj(type)) {
    type = type.zh
  } 
  let proofName
  switch (type) {
    case "反例":
      proofName = "反例"
      break;
    case "思想方法":
      proofName = "原理"
      break;
    default:
      proofName = "证明"
      break;
  }

  return proofName
}

/**
 * 【数学】更新证明的 Html 的 index
 */
MNNote.prototype.getRenewProofHtmlCommentByNoteType = function(type){
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
 * 判断卡片是不是旧模板制作的
 */
MNNote.prototype.ifTemplateOldVersion = function(){
  // let remarkHtmlCommentIndex = this.getHtmlCommentIndex("Remark：")
  return this.getHtmlCommentIndex("Remark：") !== -1 || (this.getHtmlCommentIndex("所属") !== -1 && this.getNoteTypeZh()!== "归类" && this.getNoteTypeZh()!== "顶层")
}

/**
 * 根据类型去掉评论
 */
MNNote.prototype.removeCommentsByTypes = function(types){
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

MNNote.prototype.removeCommentsByType = function(type){
  this.removeCommentsByTypes(type)
}

/**
 * @param {String} type
 */
MNNote.prototype.removeCommentsByOneType = function(type){
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
 * 合并到目标卡片并更新链接
 * 1. 更新新卡片里的链接（否则会丢失蓝色箭头）
 * 2. 双向链接对应的卡片里的链接要更新，否则合并后会消失
 * 
 * 不足
 * - this 出发的单向链接无法处理
 * 
 * 注意：和 MN 自己的合并不同，this 的标题会处理为评论，而不是添加到 targetNote 的标题
 */
MNNote.prototype.mergeInto = function(targetNote, htmlType = "none"){
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
MNNote.prototype.mergeIntoAndMove = function(targetNote, targetIndex, htmlType = "none"){
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
MNNote.prototype.mergIntoAndRenewReplaceholder = function(targetNote, htmlType = "none"){
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
MNNote.prototype.hasLink = function(link){
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
MNNote.prototype.LinkGetType = function(link){
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
MNNote.prototype.LinkIfSingle = function(link){
  return this.LinkGetType(link) === "Single"
}

/**
 * 是否是双向链接
 * @param {string} link
 * @returns {Boolean}
 */
MNNote.prototype.LinkIfDouble = function(link){
  return this.LinkGetType(link) === "Double"
}

MNNote.prototype.renew = function(){
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

      // // 获取"证明过程相关知识："的 block 内容
      // let proofKnowledgeBlockTextContentArr = this.getHtmlBlockTextContentArr("证明过程相关知识：")
      
      // // 获取"证明体现的思想方法："的 block 内容
      // let proofMethodBlockTextContentArr = this.getHtmlBlockTextContentArr("证明体现的思想方法：")

      // // 获取"应用："的 block 内容
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
        // 修改对应 "证明："的版本
        let proofHtmlCommentIndex = this.getProofHtmlCommentIndexByNoteType(noteType)
        if (proofHtmlCommentIndex == -1) {
          // 此时要先找到不正确的 proofHtmlComment 的 Index，然后删除掉
          this.getRenewProofHtmlCommentByNoteType(noteType)
        }
      } else {
        // 去掉"相关xx：" 改成"相关思考："
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
         * 将"应用："及下方的内容移动到最下方
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

MNNote.prototype.renewNote = function(){
  this.renew()
}

MNNote.prototype.renewCard = function(){
  this.renew()
}

MNNote.prototype.getIncludingHtmlCommentIndex = function(htmlComment){
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

MNNote.prototype.renewHtmlCommentFromId = function(comment, id) {
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

MNNote.prototype.renewHtmlCommentById = function(comment, id) {
  this.renewHtmlCommentFromId(comment, id)
}

MNNote.prototype.mergeClonedNoteFromId = function(id){
  let note = MNNote.clone(id)
  this.merge(note.note)
}

MNNote.prototype.mergeClonedNoteById = function(id){
  this.mergeClonedNoteFromId(id)
}

/**
 * 根据内容删除文本评论
 */
MNNote.prototype.removeCommentsByContent = function(content){
  this.removeCommentsByText(content)
}

MNNote.prototype.removeCommentsByTrimContent = function(content){
  this.removeCommentsByText(content)
}

MNNote.prototype.removeCommentsByText = function(text){
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

MNNote.prototype.removeCommentsByTrimText = function(text){
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
MNNote.prototype.removeCommentsByOneText = function(text){
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

MNNote.prototype.removeCommentsByOneTrimText = function(text){
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

MNNote.prototype.refresh = async function(delay = 0){
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
 * 4. "应用"下方去重
 */
MNNote.prototype.LinkRenew = function(){
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

MNNote.prototype.renewLink = function(){
  this.LinkRenew()
}

MNNote.prototype.renewLinks = function(){
  this.LinkRenew()
}

MNNote.prototype.LinksRenew = function(){
  this.LinkRenew()
}

MNNote.prototype.clearFailedLinks = function(){
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
MNNote.prototype.fixProblemLinks = function(){
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

MNNote.prototype.linkRemoveDuplicatesAfterIndex = function(startIndex){
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

MNNote.prototype.LinkClearFailedLinks = function(){
  this.clearFailedLinks()
}

MNNote.prototype.LinksConvertToMN4Version = function(){
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

MNNote.prototype.convertLinksToMN4Version = function(){
  this.LinksConvertToMN4Version()
}

MNNote.prototype.LinksConvertToNewVersion = function(){
  this.LinksConvertToMN4Version()
}

MNNote.prototype.convertLinksToNewVersion = function(){
  this.LinksConvertToMN4Version()
}


/**
 * 将某一个 Html 评论到下一个 Html 评论之前的内容（不包含下一个 Html 评论）进行移动
 * 将 Html 评论和下方的内容看成一整个块，进行移动
 * 注意此函数会将 Html 评论和下方的内容一起移动，而不只是下方内容
 * @param {String} htmltext Html 评论，定位的锚点
 * @param {Number} toIndex 目标 index
 */
MNNote.prototype.moveHtmlBlock = function(htmltext, toIndex) {
  if (this.getHtmlCommentIndex(htmltext) !== -1) {
    let htmlBlockIndexArr = this.getHtmlBlockIndexArr(htmltext)
    this.moveCommentsByIndexArr(htmlBlockIndexArr, toIndex)
  }
}

/**
 * 移动 HtmlBlock 到最下方
 * @param {String} htmltext Html 评论，定位的锚点
 */
MNNote.prototype.moveHtmlBlockToBottom = function(htmltext){
  this.moveHtmlBlock(htmltext, this.comments.length-1)
}

/**
 * 移动 HtmlBlock 到最上方
 * @param {String} htmltext Html 评论，定位的锚点
 */
MNNote.prototype.moveHtmlBlockToTop = function(htmltext){
  this.moveHtmlBlock(htmltext, 0)
}

/**
 * 获取 Html Block 的索引数组
 */
MNNote.prototype.getHtmlBlockIndexArr = function(htmltext){
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
MNNote.prototype.getNextHtmlCommentIndex = function(htmltext){
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
MNNote.prototype.getHtmlCommentsIndexArr = function(){
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
MNNote.prototype.getTextCommentsIndexArr = function(text){
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
MNNote.prototype.getLinkCommentsIndexArr = function(link){
  return this.getTextCommentsIndexArr(MNUtil.getLinkText(link))
}

/**
 * 获取某个 html Block 的下方内容的 index arr
 * 不包含 html 本身
 */
MNNote.prototype.getHtmlBlockContentIndexArr = function(htmltext){
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
MNNote.prototype.getHtmlBlockTextContentArr = function(htmltext){
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
MNNote.prototype.moveCommentsByIndexArr = function(indexArr, toIndex){
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
MNNote.prototype.getHtmlCommentIndex = function(htmlcomment) {
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
MNNote.prototype.refreshAll = async function(delay = 0){
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

MNNote.prototype.getIncludingCommentIndex = function(comment,includeHtmlComment = false) {
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
MNNote.prototype.addClassificationNoteByType = function(type, title=""){
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
MNNote.prototype.addClassificationNote = function(title="") {
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
MNNote.prototype.createDuplicatedNote = function(title = this.title, colorIndex = this.colorIndex){
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
MNNote.prototype.createDuplicatedNoteAndDelete = function(title = this.title, colorIndex = this.colorIndex) {
  let duplicatedNote = this.createDuplicatedNote(title, colorIndex)
  this.delete()

  return duplicatedNote
}

/**
 * 判断文献卡片是否需要移动位置
 */
MNNote.prototype.ifReferenceNoteToMove = function(){
  let parentNote = this.parentNote
  return !["785225AC-5A2A-41BA-8760-3FEF10CF4AE0","49102A3D-7C64-42AD-864D-55EDA5EC3097"].includes(parentNote.noteId)
}

/**
 * 最后两个评论的内容类型
 * 
 * 1. 文本 + 链接 => "text-link"
 * 2. 链接 + 链接 => "link-link"
 */
MNNote.prototype.lastTwoCommentsType = function(){
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

MNNote.prototype.getProofContentIndexArr = function() {
  let proofName = this.getProofNameByType(this.getNoteTypeZh())
  let proofHtmlCommentIndex = this.getProofHtmlCommentIndexByNoteType(this.getNoteTypeZh())
  if (proofHtmlCommentIndex !== -1) {
    return this.getHtmlBlockContentIndexArr(proofName)
  }

  return []
}

MNNote.prototype.renewProofContentPointsToHtmlType = function(htmlType = "point") {
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

MNNote.prototype.renewContentPointsToHtmlType = function(htmlType = "none") {
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

MNNote.prototype.clearAllCommentsButMergedImageComment = function() {
  let comments = this.MNComments
  for (let i = comments.length-1; i >= 0; i--) {
    let comment = comments[i]
    if (!(comment.type == "mergedImageComment")) {
      this.removeCommentByIndex(i)
    }
  }
}

/**
 * 夏大鱼羊 - MNNote prototype 扩展 - 更多方法 - end
 */

/**
 * 夏大鱼羊 - MNUtil 方法重写 - begin
 */

// 重写 MNUtil.getNoteById 方法：默认不显示提示，alert 默认值改为 false
MNUtil.getNoteById = function(noteid, alert = false) {
  let note = this.db.getNoteById(noteid)
  if (note) {
    return note
  } else {
    if (alert) {
      this.copy(noteid)
      // this.showHUD("Note not exist!")  // 注释掉提示
    }
    return undefined
  }
}

/**
 * 夏大鱼羊 - MNUtil 方法重写 - end
 */

/**
 * 夏大鱼羊 - MNNote 方法重写 - begin
 */

// 重写 MNNote.prototype.moveComment 方法：msg 默认值改为 false
MNNote.prototype.moveComment = function(fromIndex, toIndex, msg = false) {
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
 * 夏大鱼羊 - MNNote 方法重写 - end
 */

/**
 * 夏大鱼羊 - MNComment 方法重写 - begin
 */

// 重写 MNComment text getter：注释掉错误提示
Object.defineProperty(MNComment.prototype, 'text', {
  get: function() {
    if (this.detail.text) {
      return this.detail.text
    }
    if (this.detail.q_htext) {
      return this.detail.q_htext
    }
    // MNUtil.showHUD("No available text")  // 注释掉提示
    return undefined
  },
  configurable: true,
  enumerable: true
});

/**
 * 夏大鱼羊 - MNComment 方法重写 - end
 */


/**
 * MNUtils - 方法重写 - begin
 */
MNUtil.prototype.log = function(log, copy = false){
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
    if (copy) {
      this.copy(this.logs)
    }
  }