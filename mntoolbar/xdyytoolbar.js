/**
 * XDYYToolbar - 自定义工具栏功能扩展
 * 
 * 此模块包含所有用户自定义的功能，与官方版本解耦
 */

JSB.require('pinyin.js');

const XDYYToolbar = {
  // 初始化函数，注册所有自定义功能
  init(toolbar) {
    this.toolbar = toolbar;
    this.registerCustomActions();
    this.registerUtilityFunctions();
    this.registerMenuExtensions();
  },

  // 注册自定义动作
  registerCustomActions() {
    const customActions = [
      // 预处理模式
      {
        id: 'togglePreprocess',
        title: '🗂️ 卡片预处理模式',
        group: 'customCardOperations',
        callback: () => this.togglePreprocess()
      },
      // 焦点功能
      {
        id: 'MNFocusNote',
        title: '☀️ 焦点',
        group: 'customCardOperations',
        callback: () => this.MNFocusNote()
      },
      {
        id: 'MNEditDeleteNote',
        title: '❌ 删除卡片',
        group: 'customCardOperations',
        callback: () => this.MNEditDeleteNote()
      },
      {
        id: 'moveProofDown',
        title: '⬇️ 证明移到最下',
        group: 'customCardOperations',
        callback: () => this.moveProofDown()
      },
      {
        id: 'moveToExcerptPartTop',
        title: '⬆️ 移动到摘录部分顶部',
        group: 'customCardOperations',
        callback: () => this.moveToExcerptPartTop()
      },
      {
        id: 'moveToExcerptPartBottom',
        title: '⬇️ 移动到摘录部分底部',
        group: 'customCardOperations',
        callback: () => this.moveToExcerptPartBottom()
      },
      {
        id: 'toBeProgressNote',
        title: '📊 转为进度卡片',
        group: 'customCardOperations',
        callback: () => this.toBeProgressNote()
      },
      {
        id: 'toBeIndependent',
        title: '🔓 卡片独立',
        group: 'customCardOperations',
        callback: () => this.toBeIndependent()
      },
      // 区域移动
      {
        id: 'moveToInput',
        title: '📥 移动到输入区',
        group: 'customZoneOperations',
        callback: () => this.moveToInput()
      },
      {
        id: 'moveToPreparationForExam',
        title: '📚 移动到备考区',
        group: 'customZoneOperations',
        callback: () => this.moveToPreparationForExam()
      },
      {
        id: 'moveToInternalize',
        title: '🧠 移动到内化区',
        group: 'customZoneOperations',
        callback: () => this.moveToInternalize()
      },
      {
        id: 'moveToBeClassified',
        title: '📁 移动到待分类',
        group: 'customZoneOperations',
        callback: () => this.moveToBeClassified()
      },
      {
        id: 'AddToReview',
        title: '🔄 添加到复习',
        group: 'customZoneOperations',
        callback: () => this.AddToReview()
      },
      // 评论移动
      {
        id: 'moveLastThreeCommentByPopupTo',
        title: '💬3️⃣ 移动最后三个评论',
        group: 'customCommentOperations',
        callback: () => this.moveLastThreeCommentByPopupTo()
      },
      {
        id: 'moveLastTwoCommentByPopupTo',
        title: '💬2️⃣ 移动最后两个评论',
        group: 'customCommentOperations',
        callback: () => this.moveLastTwoCommentByPopupTo()
      },
      {
        id: 'moveLastOneCommentByPopupTo',
        title: '💬1️⃣ 移动最后一个评论',
        group: 'customCommentOperations',
        callback: () => this.moveLastOneCommentByPopupTo()
      },
      {
        id: 'moveNewContentsByPopupTo',
        title: '📝 移动新内容',
        group: 'customCommentOperations',
        callback: () => this.moveNewContentsByPopupTo()
      },
      // 更新归类
      {
        id: 'getNewClassificationInformation',
        title: '🔄 更新归类卡片情况',
        group: 'customUtilities',
        callback: () => this.getNewClassificationInformation()
      }
    ];

    // 将自定义动作注册到系统中
    this.customActions = customActions;
  },

  // 注册工具函数到 MNUtil
  registerUtilityFunctions() {
    // 名字处理相关
    MNUtil.getAbbreviationsOfName = this.getAbbreviationsOfName.bind(this);
    MNUtil.getAbbreviationsOfEnglishName = this.getAbbreviationsOfEnglishName.bind(this);
    MNUtil.getAbbreviationsOfChineseName = this.getAbbreviationsOfChineseName.bind(this);
    MNUtil.camelizeString = this.camelizeString.bind(this);
    MNUtil.languageOfString = this.languageOfString.bind(this);
    MNUtil.moveStringPropertyToSecondPosition = this.moveStringPropertyToSecondPosition.bind(this);
    
    // 文献处理
    MNUtil.extractBibFromReferenceNote = this.extractBibFromReferenceNote.bind(this);
    
    // 工具函数
    MNUtil.moveElement = this.moveElement.bind(this);
  },

  // 注册菜单扩展
  registerMenuExtensions() {
    // 在main.js的菜单初始化时调用
    this.menuItems = [
      {
        title: '🗂️ 卡片预处理模式',
        object: this.toolbar.addon,
        selector: 'togglePreprocess:',
        param: { 
          id: 'togglePreprocess',
          title: toolbarConfig.preprocess ? '✅ 卡片预处理模式' : '🗂️ 卡片预处理模式'
        }
      }
    ];
  },

  // HTML 设置定义
  htmlSettings: {
    '方法': '✔',
    '思路': '💡',
    '目标': '🎯',
    '关键': '🔑',
    '问题': '❓',
    '注': '📝',
    '注意': '⚠️',
    '特别注意': '❗❗❗',
    'level1': '1️⃣',
    'level2': '2️⃣',
    'level3': '3️⃣',
    'level4': '4️⃣',
    'level5': '5️⃣'
  },

  // 数学分类定义
  mathCategories: [
    '数学基础',
    '泛函分析',
    '实分析',
    '复分析',
    '数学分析',
    '高等代数',
    '概率论',
    '数理统计',
    '拓扑学',
    '微分几何',
    '代数几何',
    '数论',
    '组合数学',
    '数理逻辑',
    '偏微分方程',
    '常微分方程',
    '数值分析',
    '运筹学',
    '优化理论',
    '随机过程'
  ],

  // ===== 功能实现部分 =====

  // 切换预处理模式
  togglePreprocess() {
    toolbarConfig.preprocess = !toolbarConfig.preprocess;
    MNUtil.copyJSON(toolbarConfig);
    if (toolbarConfig.preprocess) {
      MNUtil.showHUD('✅ 已开启卡片预处理模式');
    } else {
      MNUtil.showHUD('❌ 已关闭卡片预处理模式');
    }
  },

  // 更新归类卡片情况
  getNewClassificationInformation() {
    try {
      const currentDocmd5 = MNNote.currentDocmd5;
      const allNotes = MNUtil.getNotes(currentDocmd5);
      let classificationInfo = {};
      
      // 遍历所有分类
      this.mathCategories.forEach(category => {
        const categoryNotes = allNotes.filter(note => {
          return note.noteTitle && note.noteTitle.includes(`【${category}】`);
        });
        if (categoryNotes.length > 0) {
          classificationInfo[category] = categoryNotes.length;
        }
      });

      // 找到"📊 归类卡片情况"卡片并更新
      const statsNote = allNotes.find(note => note.noteTitle === '📊 归类卡片情况');
      if (statsNote) {
        let content = '📊 归类卡片情况\n\n';
        Object.entries(classificationInfo).forEach(([category, count]) => {
          content += `${category}: ${count} 张\n`;
        });
        content += `\n总计: ${Object.values(classificationInfo).reduce((a, b) => a + b, 0)} 张`;
        
        MNNote.updateNoteId({
          noteid: statsNote.noteId,
          content: content
        });
        MNUtil.showHUD('✅ 已更新归类卡片情况');
      } else {
        MNUtil.showHUD('❌ 未找到"📊 归类卡片情况"卡片');
      }
    } catch (error) {
      MNUtil.showHUD('❌ 更新失败：' + error.message);
    }
  },

  // 移动证明到最下方
  moveProofDown() {
    const focusNote = MNNote.getFocusNote();
    if (!focusNote) {
      MNUtil.showHUD('❌ 请先选择一个卡片');
      return;
    }

    const comments = focusNote.comments || [];
    const proofIndex = comments.findIndex(comment => 
      comment.text && comment.text.includes('证明：')
    );

    if (proofIndex === -1) {
      MNUtil.showHUD('❌ 未找到证明内容');
      return;
    }

    if (proofIndex === comments.length - 1) {
      MNUtil.showHUD('ℹ️ 证明已在最下方');
      return;
    }

    // 移动证明到最后
    const proofComment = comments.splice(proofIndex, 1)[0];
    comments.push(proofComment);
    
    MNNote.updateNoteId({
      noteid: focusNote.noteId,
      comments: comments
    });
    
    MNUtil.showHUD('✅ 证明已移到最下方');
  },

  // 焦点功能
  MNFocusNote() {
    const focusNote = MNNote.getFocusNote();
    if (focusNote) {
      MNNote.focus(focusNote.noteId);
      MNUtil.showHUD('☀️ 已聚焦卡片');
    } else {
      MNUtil.showHUD('❌ 请先选择一个卡片');
    }
  },

  // 删除卡片
  MNEditDeleteNote() {
    const focusNotes = MNNote.getFocusNotes();
    if (focusNotes && focusNotes.length > 0) {
      MNUtil.showHUD(`🗑️ 正在删除 ${focusNotes.length} 张卡片...`);
      focusNotes.forEach(note => {
        MNNote.deleteNoteId(note.noteId);
      });
      MNUtil.showHUD(`✅ 已删除 ${focusNotes.length} 张卡片`);
    } else {
      MNUtil.showHUD('❌ 请先选择要删除的卡片');
    }
  },

  // 移动到摘录部分顶部
  moveToExcerptPartTop() {
    const focusNote = MNNote.getFocusNote();
    if (!focusNote) {
      MNUtil.showHUD('❌ 请先选择一个卡片');
      return;
    }
    
    const selectedText = focusNote.excerptText || '';
    if (selectedText) {
      const currentText = focusNote.noteText || '';
      const newText = selectedText + '\n\n' + currentText;
      MNNote.updateNoteId({
        noteid: focusNote.noteId,
        content: newText
      });
      MNUtil.showHUD('✅ 已移动到摘录部分顶部');
    } else {
      MNUtil.showHUD('❌ 该卡片没有摘录内容');
    }
  },

  // 移动到摘录部分底部
  moveToExcerptPartBottom() {
    const focusNote = MNNote.getFocusNote();
    if (!focusNote) {
      MNUtil.showHUD('❌ 请先选择一个卡片');
      return;
    }
    
    const selectedText = focusNote.excerptText || '';
    if (selectedText) {
      const currentText = focusNote.noteText || '';
      const newText = currentText + '\n\n' + selectedText;
      MNNote.updateNoteId({
        noteid: focusNote.noteId,
        content: newText
      });
      MNUtil.showHUD('✅ 已移动到摘录部分底部');
    } else {
      MNUtil.showHUD('❌ 该卡片没有摘录内容');
    }
  },

  // 转为进度卡片
  toBeProgressNote() {
    const focusNote = MNNote.getFocusNote();
    if (!focusNote) {
      MNUtil.showHUD('❌ 请先选择一个卡片');
      return;
    }

    const title = focusNote.noteTitle || '';
    const newTitle = title.startsWith('📊 ') ? title : '📊 ' + title;
    
    MNNote.updateNoteId({
      noteid: focusNote.noteId,
      title: newTitle
    });
    
    MNUtil.showHUD('✅ 已转为进度卡片');
  },

  // 卡片独立
  toBeIndependent() {
    const focusNote = MNNote.getFocusNote();
    if (!focusNote) {
      MNUtil.showHUD('❌ 请先选择一个卡片');
      return;
    }

    if (focusNote.parentNote) {
      MNNote.moveNote({
        noteId: focusNote.noteId,
        targetNoteId: null
      });
      MNUtil.showHUD('✅ 卡片已独立');
    } else {
      MNUtil.showHUD('ℹ️ 该卡片已经是独立的');
    }
  },

  // 移动到各个区域的实现
  moveToInput() {
    this.moveToZone('输入区', '📥');
  },

  moveToPreparationForExam() {
    this.moveToZone('备考区', '📚');
  },

  moveToInternalize() {
    this.moveToZone('内化区', '🧠');
  },

  moveToBeClassified() {
    const focusNote = MNNote.getFocusNote();
    if (!focusNote) {
      MNUtil.showHUD('❌ 请先选择一个卡片');
      return;
    }

    // 显示分类选择菜单
    const options = this.mathCategories.map(cat => ({
      title: cat,
      value: cat
    }));

    MNUtil.select(options, (selected) => {
      if (selected) {
        this.moveToZone(`待分类【${selected}】`, '📁');
      }
    });
  },

  // 通用移动到区域方法
  moveToZone(zoneName, emoji) {
    const focusNote = MNNote.getFocusNote();
    if (!focusNote) {
      MNUtil.showHUD('❌ 请先选择一个卡片');
      return;
    }

    const currentDocmd5 = MNNote.currentDocmd5;
    const allNotes = MNUtil.getNotes(currentDocmd5);
    const zoneNote = allNotes.find(note => note.noteTitle === zoneName);

    if (zoneNote) {
      MNNote.moveNote({
        noteId: focusNote.noteId,
        targetNoteId: zoneNote.noteId
      });
      MNUtil.showHUD(`${emoji} 已移动到${zoneName}`);
    } else {
      MNUtil.showHUD(`❌ 未找到"${zoneName}"卡片`);
    }
  },

  // 添加到复习
  AddToReview() {
    const focusNotes = MNNote.getFocusNotes();
    if (!focusNotes || focusNotes.length === 0) {
      MNUtil.showHUD('❌ 请先选择要添加的卡片');
      return;
    }

    let addedCount = 0;
    focusNotes.forEach(note => {
      // 添加到复习标记
      const tags = note.noteTags || [];
      if (!tags.includes('#review')) {
        tags.push('#review');
        MNNote.updateNoteId({
          noteid: note.noteId,
          tags: tags
        });
        addedCount++;
      }
    });

    MNUtil.showHUD(`🔄 已添加 ${addedCount} 张卡片到复习`);
  },

  // 移动评论相关功能
  moveLastThreeCommentByPopupTo() {
    this.moveCommentsByCount(3);
  },

  moveLastTwoCommentByPopupTo() {
    this.moveCommentsByCount(2);
  },

  moveLastOneCommentByPopupTo() {
    this.moveCommentsByCount(1);
  },

  moveCommentsByCount(count) {
    const focusNote = MNNote.getFocusNote();
    if (!focusNote) {
      MNUtil.showHUD('❌ 请先选择一个卡片');
      return;
    }

    const comments = focusNote.comments || [];
    if (comments.length < count) {
      MNUtil.showHUD(`❌ 评论数不足${count}个`);
      return;
    }

    // 选择目标位置
    const options = [
      { title: '移到顶部', value: 'top' },
      { title: '移到底部', value: 'bottom' }
    ];

    MNUtil.select(options, (position) => {
      if (position) {
        const movedComments = comments.splice(-count);
        if (position === 'top') {
          comments.unshift(...movedComments);
        } else {
          comments.push(...movedComments);
        }

        MNNote.updateNoteId({
          noteid: focusNote.noteId,
          comments: comments
        });

        MNUtil.showHUD(`✅ 已移动最后${count}个评论到${position === 'top' ? '顶部' : '底部'}`);
      }
    });
  },

  moveNewContentsByPopupTo() {
    const focusNote = MNNote.getFocusNote();
    if (!focusNote) {
      MNUtil.showHUD('❌ 请先选择一个卡片');
      return;
    }

    // 查找标记为新内容的评论
    const comments = focusNote.comments || [];
    const newContentComments = comments.filter(comment => 
      comment.text && comment.text.includes('[新]')
    );

    if (newContentComments.length === 0) {
      MNUtil.showHUD('❌ 未找到标记为[新]的内容');
      return;
    }

    // 实现移动逻辑
    MNUtil.showHUD(`✅ 找到 ${newContentComments.length} 个新内容`);
  },

  // ===== 工具函数实现 =====

  // 获取名字的缩写
  getAbbreviationsOfName(name) {
    if (!name) return [];
    
    const lang = this.languageOfString(name);
    if (lang === 'en') {
      return this.getAbbreviationsOfEnglishName(name);
    } else if (lang === 'zh') {
      return this.getAbbreviationsOfChineseName(name);
    }
    return [name];
  },

  // 获取英文名字的缩写
  getAbbreviationsOfEnglishName(name) {
    if (!name) return [];
    
    const abbreviations = [];
    const parts = name.trim().split(/\s+/);
    
    if (parts.length === 1) {
      abbreviations.push(name);
    } else if (parts.length === 2) {
      // First Last -> F. Last, First L., FL
      abbreviations.push(`${parts[0][0]}. ${parts[1]}`);
      abbreviations.push(`${parts[0]} ${parts[1][0]}.`);
      abbreviations.push(`${parts[0][0]}${parts[1][0]}`);
    } else if (parts.length >= 3) {
      // First Middle Last -> F. M. Last, FML, etc.
      const initials = parts.slice(0, -1).map(p => p[0] + '.').join(' ');
      abbreviations.push(`${initials} ${parts[parts.length - 1]}`);
      abbreviations.push(parts.map(p => p[0]).join(''));
    }
    
    return [...new Set(abbreviations)];
  },

  // 获取中文名字的拼音缩写
  getAbbreviationsOfChineseName(name) {
    if (!name || typeof pinyin === 'undefined') return [name];
    
    try {
      const pinyinArray = pinyin(name, {
        style: pinyin.STYLE_NORMAL,
        heteronym: false
      });
      
      const fullPinyin = pinyinArray.map(p => this.camelizeString(p[0])).join(' ');
      const abbreviations = [name, fullPinyin];
      
      // 生成各种缩写形式
      if (pinyinArray.length === 2) {
        // 姓名 -> X. Ming, Xing M.
        abbreviations.push(`${pinyinArray[0][0][0].toUpperCase()}. ${this.camelizeString(pinyinArray[1][0])}`);
        abbreviations.push(`${this.camelizeString(pinyinArray[0][0])} ${pinyinArray[1][0][0].toUpperCase()}.`);
      } else if (pinyinArray.length === 3) {
        // 三字名
        const surname = this.camelizeString(pinyinArray[0][0]);
        const givenName = pinyinArray.slice(1).map(p => this.camelizeString(p[0])).join(' ');
        abbreviations.push(`${surname} ${givenName}`);
        abbreviations.push(`${pinyinArray[0][0][0].toUpperCase()}. ${givenName}`);
      }
      
      return [...new Set(abbreviations)];
    } catch (e) {
      return [name];
    }
  },

  // 首字母大写
  camelizeString(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  // 判断字符串语言
  languageOfString(str) {
    if (!str) return 'unknown';
    if (/[\u4e00-\u9fa5]/.test(str)) return 'zh';
    if (/^[a-zA-Z\s\.\-]+$/.test(str)) return 'en';
    return 'unknown';
  },

  // 移动对象属性到第二位
  moveStringPropertyToSecondPosition(obj, propName) {
    if (!obj || !obj.hasOwnProperty(propName)) return obj;
    
    const keys = Object.keys(obj);
    const index = keys.indexOf(propName);
    
    if (index === -1 || index === 1) return obj;
    
    keys.splice(index, 1);
    keys.splice(1, 0, propName);
    
    const newObj = {};
    keys.forEach(key => {
      newObj[key] = obj[key];
    });
    
    return newObj;
  },

  // 从参考文献卡片提取bib条目
  extractBibFromReferenceNote(note) {
    if (!note || !note.noteText) return null;
    
    const text = note.noteText;
    const bibMatch = text.match(/@\w+{[^}]+}/);
    
    if (bibMatch) {
      return bibMatch[0];
    }
    
    return null;
  },

  // 移动数组元素
  moveElement(array, index, direction) {
    if (!Array.isArray(array) || index < 0 || index >= array.length) {
      return array;
    }

    const newArray = [...array];
    const element = newArray.splice(index, 1)[0];

    switch (direction) {
      case 'up':
        if (index > 0) {
          newArray.splice(index - 1, 0, element);
        } else {
          newArray.splice(index, 0, element);
        }
        break;
      case 'down':
        if (index < array.length - 1) {
          newArray.splice(index + 1, 0, element);
        } else {
          newArray.splice(index, 0, element);
        }
        break;
      case 'top':
        newArray.unshift(element);
        break;
      default:
        newArray.splice(index, 0, element);
    }

    return newArray;
  },

  // 获取所有自定义动作（供外部调用）
  getCustomActions() {
    return this.customActions || [];
  },

  // 获取菜单项（供外部调用）
  getMenuItems() {
    return this.menuItems || [];
  }
};

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = XDYYToolbar;
} else {
  // 全局变量
  JSB.global.XDYYToolbar = XDYYToolbar;
}