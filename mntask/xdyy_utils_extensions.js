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
   * 任务类型定义
   * 
   * @property {string} prefixName - 标题前缀 【O >> 】
   * @property {string} englishName - 英文名称
   * @property {string} zhName - 中文名称
   * @property {number} colorIndex - 默认颜色索引
   * @property {number} statusColorMap - 状态对应的颜色映射
   * @property {Array} fields - 默认字段列表
   * @property {Array} tags - 默认标签
   */
  static taskTypes = {
    objective: {
      prefixName: 'O',
      englishName: 'Objective',
      zhName: '目标',
      colorIndex: 10,  // 深蓝色
      statusColorMap: {
        notStarted: 0,   // 淡黄色
        inProgress: 6,   // 蓝色
        completed: 5     // 绿色
      },
      fields: [
        "关键结果",
        "截止日期",
        "负责人",
        "进度",
        "备注"
      ],
      tags: ["目标", "OKR"]
    },
    keyResult: {
      prefixName: 'KR',
      englishName: 'Key Result',
      zhName: '关键结果',
      colorIndex: 15,  // 紫色
      statusColorMap: {
        notStarted: 0,
        inProgress: 6,
        completed: 5
      },
      fields: [
        "衡量指标",
        "当前进度",
        "目标值",
        "截止日期",
        "相关任务"
      ],
      tags: ["关键结果", "OKR"]
    },
    project: {
      prefixName: 'P',
      englishName: 'Project',
      zhName: '项目',
      colorIndex: 9,   // 深绿色
      statusColorMap: {
        notStarted: 0,
        inProgress: 6,
        completed: 5
      },
      fields: [
        "项目描述",
        "里程碑",
        "资源",
        "风险",
        "子任务"
      ],
      tags: ["项目"]
    },
    task: {
      prefixName: 'T',
      englishName: 'Task',
      zhName: '任务',
      colorIndex: 2,   // 淡蓝色
      statusColorMap: {
        notStarted: 0,
        inProgress: 6,
        completed: 5
      },
      fields: [
        "任务描述",
        "优先级",
        "预计时间",
        "实际时间",
        "阻塞因素"
      ],
      tags: ["任务"]
    }
  };

  /**
   * 任务状态定义
   */
  static taskStatus = {
    notStarted: {
      zhName: '未开始',
      colorIndex: 0,  // 淡黄色
      tag: '#未开始'
    },
    inProgress: {
      zhName: '进行中',
      colorIndex: 6,  // 蓝色
      tag: '#进行中'
    },
    completed: {
      zhName: '已完成',
      colorIndex: 5,  // 绿色
      tag: '#已完成'
    },
    blocked: {
      zhName: '已阻塞',
      colorIndex: 3,  // 粉色
      tag: '#已阻塞'
    },
    cancelled: {
      zhName: '已取消',
      colorIndex: 14, // 深灰色
      tag: '#已取消'
    }
  };

  /**
   * 创建任务笔记
   * @param {MNNote} parentNote - 父笔记
   * @param {string} taskType - 任务类型 (objective/keyResult/project/task)
   * @param {string} title - 任务标题
   * @param {Object} options - 额外选项
   * @returns {MNNote} 创建的任务笔记
   */
  static createTask(parentNote, taskType, title, options = {}) {
    const typeConfig = this.taskTypes[taskType] || this.taskTypes.task;
    
    // 创建任务笔记
    const taskNote = parentNote.createChildNote({
      title: `【${typeConfig.prefixName} >> ${title}】`,
      colorIndex: options.colorIndex || typeConfig.statusColorMap.notStarted,
      content: options.content || ""
    });

    // 添加默认标签
    const tags = [...typeConfig.tags, this.taskStatus.notStarted.tag];
    if (options.tags) {
      tags.push(...options.tags);
    }
    taskNote.appendTags(tags);

    // 添加时间信息
    const now = new Date();
    taskNote.appendTextComment(`创建时间：${now.toLocaleString()}`);
    taskNote.appendTextComment(`状态：${this.taskStatus.notStarted.zhName}`);

    // 添加默认字段（如果指定）
    if (options.addFields) {
      typeConfig.fields.forEach(field => {
        const fieldHtml = HtmlMarkdownUtils.createHtmlMarkdownText(field, "level2");
        taskNote.appendHtmlComment(fieldHtml, fieldHtml, 16, "level2");
      });
    }

    return taskNote;
  }

  /**
   * 更新任务状态
   * @param {MNNote} note - 任务笔记
   * @param {string} newStatus - 新状态 (notStarted/inProgress/completed/blocked/cancelled)
   */
  static updateTaskStatus(note, newStatus) {
    const statusConfig = this.taskStatus[newStatus];
    if (!statusConfig) {
      throw new Error(`未知的任务状态: ${newStatus}`);
    }

    // 更新颜色
    note.colorIndex = statusConfig.colorIndex;

    // 更新标签
    const statusTags = Object.values(this.taskStatus).map(s => s.tag);
    note.removeTags(statusTags);
    note.appendTags([statusConfig.tag]);

    // 更新状态评论
    const statusCommentIndex = note.getTextCommentIndex("状态：");
    if (statusCommentIndex !== -1) {
      note.removeCommentByIndex(statusCommentIndex);
    }
    note.appendTextComment(`状态：${statusConfig.zhName}`);

    // 记录状态变更时间
    const now = new Date();
    switch(newStatus) {
      case 'inProgress':
        note.appendTextComment(`开始时间：${now.toLocaleString()}`);
        break;
      case 'completed':
        note.appendTextComment(`完成时间：${now.toLocaleString()}`);
        break;
      case 'blocked':
        note.appendTextComment(`阻塞时间：${now.toLocaleString()}`);
        break;
      case 'cancelled':
        note.appendTextComment(`取消时间：${now.toLocaleString()}`);
        break;
    }

    note.refresh();
  }

  /**
   * 切换任务状态（循环切换）
   * @param {MNNote} note - 任务笔记
   */
  static toggleTaskStatus(note) {
    const currentColor = note.colorIndex;
    let newStatus;

    // 根据当前颜色判断状态并切换到下一个
    switch(currentColor) {
      case 0:  // 未开始
        newStatus = 'inProgress';
        break;
      case 6:  // 进行中
        newStatus = 'completed';
        break;
      case 5:  // 已完成
        newStatus = 'notStarted';
        break;
      case 3:  // 已阻塞
        newStatus = 'inProgress';
        break;
      default:
        newStatus = 'notStarted';
    }

    this.updateTaskStatus(note, newStatus);
  }

  /**
   * 更改任务类型
   * @param {MNNote} note - 任务笔记
   * @param {string} newType - 新类型 (objective/keyResult/project/task)
   */
  static changeTaskType(note, newType) {
    const typeConfig = this.taskTypes[newType];
    if (!typeConfig) {
      throw new Error(`未知的任务类型: ${newType}`);
    }

    // 解析当前标题内容
    let content = note.noteTitle;
    const match = content.match(/【[^】]+>>\s*(.+?)】\s*(.*)$/);
    if (match) {
      content = match[1] + (match[2] || "");
    } else {
      const altMatch = content.match(/【[^】]+>>\s*(.+)$/);
      if (altMatch) {
        content = altMatch[1];
      }
    }

    // 更新标题
    note.noteTitle = `【${typeConfig.prefixName} >> ${content}】`;
    
    // 更新颜色（如果不是特定状态）
    if (![0, 6, 5, 3, 14].includes(note.colorIndex)) {
      note.colorIndex = typeConfig.colorIndex;
    }

    // 更新标签
    const typeTags = ["#目标", "#关键结果", "#项目", "#任务", "#OKR"];
    note.removeTags(typeTags);
    note.appendTags(typeConfig.tags);

    note.refresh();
  }

  /**
   * 获取任务类型
   * @param {MNNote} note - 任务笔记
   * @returns {Object|null} 任务类型配置
   */
  static getTaskType(note) {
    const title = note.noteTitle;
    const match = title.match(/【(\w+)\s*>>/);
    
    if (match) {
      const prefix = match[1];
      for (const [key, config] of Object.entries(this.taskTypes)) {
        if (config.prefixName === prefix) {
          return { key, ...config };
        }
      }
    }
    
    return null;
  }

  /**
   * 添加进度信息
   * @param {MNNote} note - 任务笔记
   * @param {number} percentage - 进度百分比 (0-100)
   */
  static updateProgress(note, percentage) {
    // 确保百分比在有效范围内
    percentage = Math.max(0, Math.min(100, percentage));
    
    // 创建进度条可视化
    const filled = Math.floor(percentage / 10);
    const empty = 10 - filled;
    const progressBar = '█'.repeat(filled) + '░'.repeat(empty);
    
    // 创建进度 HTML 评论
    const progressHtml = HtmlMarkdownUtils.createHtmlMarkdownText(
      `进度: ${percentage}% ${progressBar}`,
      "level2"
    );
    
    // 查找并更新现有进度评论
    const progressIndex = note.getIncludingHtmlCommentIndex("进度:");
    if (progressIndex !== -1) {
      note.removeCommentByIndex(progressIndex);
    }
    
    note.appendHtmlComment(progressHtml, `进度: ${percentage}%`, 16, "level2");
    
    // 更新进度标签
    const progressTags = note.tags.filter(tag => tag.includes("%进度"));
    if (progressTags.length > 0) {
      note.removeTags(progressTags);
    }
    note.appendTags([`${percentage}%进度`]);
    
    // 如果进度达到100%，考虑自动更新状态
    if (percentage === 100 && note.colorIndex !== 5) {
      MNUtil.confirm("任务进度已达100%", "是否将任务状态设置为已完成？", ["取消", "确定"])
        .then(result => {
          if (result === 1) {
            this.updateTaskStatus(note, 'completed');
          }
        });
    }
    
    note.refresh();
  }

  /**
   * 添加时间标签
   * @param {MNNote} note - 任务笔记
   * @param {Date} date - 日期对象
   * @param {boolean} isToday - 是否添加今日标签
   */
  static addTimeTag(note, date = new Date(), isToday = false) {
    const dateTag = `#${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    note.appendTags([dateTag]);
    
    if (isToday) {
      note.appendTags(["今日"]);
    }
  }

  /**
   * 创建任务链接关系
   * @param {MNNote} childNote - 子任务
   * @param {MNNote} parentNote - 父任务
   */
  static linkTasks(childNote, parentNote) {
    // 添加双向链接
    childNote.appendNoteLink(parentNote, "parent");
    parentNote.appendNoteLink(childNote, "child");
    
    // 在子任务中记录父任务信息
    childNote.appendTextComment(`父任务：${parentNote.noteTitle}`);
  }

  /**
   * 批量创建子任务
   * @param {MNNote} parentNote - 父任务
   * @param {Array<string>} subtaskNames - 子任务名称数组
   * @param {string} taskType - 任务类型
   */
  static batchCreateSubtasks(parentNote, subtaskNames, taskType = 'task') {
    const subtasks = [];
    
    MNUtil.undoGrouping(() => {
      subtaskNames.forEach((name, index) => {
        const subtask = this.createTask(parentNote, taskType, name, {
          tags: ["子任务"]
        });
        
        // 继承父任务的时间标签
        const parentTags = parentNote.tags || [];
        const timeTags = parentTags.filter(tag => 
          tag.match(/^#\d{4}-\d{2}-\d{2}$/) || tag === "#今日"
        );
        if (timeTags.length > 0) {
          subtask.appendTags(timeTags);
        }
        
        this.linkTasks(subtask, parentNote);
        subtasks.push(subtask);
      });
    });
    
    return subtasks;
  }

  /**
   * 按章节拆分任务（适用于阅读任务）
   * @param {MNNote} parentNote - 父任务
   * @param {number} startChapter - 起始章节
   * @param {number} endChapter - 结束章节
   */
  static splitTaskByChapters(parentNote, startChapter, endChapter) {
    const subtaskNames = [];
    
    for (let i = startChapter; i <= endChapter; i++) {
      subtaskNames.push(`第${i}章`);
    }
    
    return this.batchCreateSubtasks(parentNote, subtaskNames, 'task');
  }

  /**
   * 按页数拆分任务
   * @param {MNNote} parentNote - 父任务
   * @param {number} totalPages - 总页数
   * @param {number} pagesPerTask - 每个任务的页数
   */
  static splitTaskByPages(parentNote, totalPages, pagesPerTask) {
    const subtaskNames = [];
    let currentPage = 1;
    
    while (currentPage <= totalPages) {
      const endPage = Math.min(currentPage + pagesPerTask - 1, totalPages);
      subtaskNames.push(`第${currentPage}-${endPage}页`);
      currentPage = endPage + 1;
    }
    
    return this.batchCreateSubtasks(parentNote, subtaskNames, 'task');
  }

  /**
   * 按时间块拆分任务（番茄钟）
   * @param {MNNote} parentNote - 父任务
   * @param {number} totalHours - 总小时数
   * @param {number} hoursPerBlock - 每个时间块的小时数
   */
  static splitTaskByTimeBlocks(parentNote, totalHours, hoursPerBlock = 0.5) {
    const subtaskNames = [];
    const totalBlocks = Math.ceil(totalHours / hoursPerBlock);
    
    for (let i = 1; i <= totalBlocks; i++) {
      const blockMinutes = hoursPerBlock * 60;
      subtaskNames.push(`时间块${i} (${blockMinutes}分钟)`);
    }
    
    const subtasks = this.batchCreateSubtasks(parentNote, subtaskNames, 'task');
    
    // 为每个子任务添加预计时间
    subtasks.forEach(subtask => {
      subtask.appendTextComment(`预计时间：${hoursPerBlock}小时`);
    });
    
    return subtasks;
  }

  /**
   * 为目标创建关键结果
   * @param {MNNote} objectiveNote - 目标笔记
   * @param {Array<Object>} keyResults - 关键结果配置数组
   */
  static createKeyResultsFromObjective(objectiveNote, keyResults) {
    const krNotes = [];
    
    MNUtil.undoGrouping(() => {
      keyResults.forEach((kr, index) => {
        const krNote = this.createTask(objectiveNote, 'keyResult', kr.name, {
          tags: ["OKR", "关键结果"]
        });
        
        // 添加衡量指标
        if (kr.metric) {
          const metricHtml = HtmlMarkdownUtils.createHtmlMarkdownText("衡量指标", "level2");
          krNote.appendHtmlComment(metricHtml, "衡量指标", 16, "level2");
          krNote.appendTextComment(`目标值：${kr.metric}`);
        }
        
        // 添加截止日期
        if (kr.deadline) {
          krNote.appendTextComment(`截止日期：${kr.deadline}`);
        }
        
        // 链接到目标
        this.linkTasks(krNote, objectiveNote);
        krNotes.push(krNote);
      });
    });
    
    return krNotes;
  }

  /**
   * 计算任务及其子任务的总体进度
   * @param {MNNote} note - 任务笔记
   * @returns {number} 总体进度百分比
   */
  static calculateOverallProgress(note) {
    // 获取当前任务的进度
    const progressTags = note.tags.filter(tag => tag.includes("%进度"));
    let selfProgress = 0;
    
    if (progressTags.length > 0) {
      const match = progressTags[0].match(/(\d+)%进度/);
      if (match) {
        selfProgress = parseInt(match[1]);
      }
    }
    
    // 如果没有子任务，返回自身进度
    if (!note.childNotes || note.childNotes.length === 0) {
      return selfProgress;
    }
    
    // 递归计算所有子任务的进度
    let totalProgress = 0;
    let taskCount = 0;
    
    function calculateSubtasks(parentNote) {
      parentNote.childNotes.forEach(child => {
        const childType = MNTaskManager.getTaskType(child);
        if (childType) {
          const childProgressTags = child.tags.filter(tag => tag.includes("%进度"));
          let childProgress = 0;
          
          if (childProgressTags.length > 0) {
            const match = childProgressTags[0].match(/(\d+)%进度/);
            if (match) {
              childProgress = parseInt(match[1]);
            }
          }
          
          // 检查状态
          if (child.colorIndex === 5) { // 已完成
            childProgress = 100;
          }
          
          totalProgress += childProgress;
          taskCount++;
          
          // 递归处理子任务的子任务
          if (child.childNotes && child.childNotes.length > 0) {
            calculateSubtasks(child);
          }
        }
      });
    }
    
    calculateSubtasks(note);
    
    // 计算平均进度
    if (taskCount > 0) {
      return Math.round(totalProgress / taskCount);
    }
    
    return selfProgress;
  }

  /**
   * 生成任务统计报告
   * @param {Array<MNNote>} notes - 任务笔记数组
   * @returns {Object} 统计报告
   */
  static generateTaskStatistics(notes) {
    const stats = {
      total: 0,
      byStatus: {
        notStarted: 0,
        inProgress: 0,
        completed: 0,
        blocked: 0,
        cancelled: 0
      },
      byType: {
        objective: 0,
        keyResult: 0,
        project: 0,
        task: 0
      },
      totalHours: 0,
      averageProgress: 0
    };
    
    let totalProgress = 0;
    
    notes.forEach(note => {
      const type = this.getTaskType(note);
      if (!type) return;
      
      stats.total++;
      
      // 统计类型
      stats.byType[type.key]++;
      
      // 统计状态
      switch(note.colorIndex) {
        case 0:
          stats.byStatus.notStarted++;
          break;
        case 6:
          stats.byStatus.inProgress++;
          break;
        case 5:
          stats.byStatus.completed++;
          break;
        case 3:
          stats.byStatus.blocked++;
          break;
        case 14:
          stats.byStatus.cancelled++;
          break;
      }
      
      // 统计时间
      const timeTags = note.tags.filter(tag => tag.includes("小时"));
      if (timeTags.length > 0) {
        const match = timeTags[0].match(/([\d.]+)小时/);
        if (match) {
          stats.totalHours += parseFloat(match[1]);
        }
      }
      
      // 统计进度
      const progressTags = note.tags.filter(tag => tag.includes("%进度"));
      if (progressTags.length > 0) {
        const match = progressTags[0].match(/(\d+)%进度/);
        if (match) {
          totalProgress += parseInt(match[1]);
        }
      } else if (note.colorIndex === 5) { // 已完成
        totalProgress += 100;
      }
    });
    
    // 计算平均进度
    if (stats.total > 0) {
      stats.averageProgress = Math.round(totalProgress / stats.total);
    }
    
    return stats;
  }

  /**
   * 导出任务数据为 JSON
   * @param {Array<MNNote>} notes - 要导出的任务笔记
   * @returns {Object} JSON 数据
   */
  static exportTasksToJSON(notes) {
    const tasks = [];
    
    notes.forEach(note => {
      const type = this.getTaskType(note);
      if (!type) return;
      
      const taskData = {
        id: note.noteId,
        title: note.noteTitle,
        type: type.key,
        status: this.getNoteStatus(note),
        colorIndex: note.colorIndex,
        tags: note.tags || [],
        createDate: note.createDate,
        modifiedDate: note.modifiedDate,
        progress: 0,
        timeSpent: 0,
        comments: []
      };
      
      // 获取进度
      const progressTags = note.tags.filter(tag => tag.includes("%进度"));
      if (progressTags.length > 0) {
        const match = progressTags[0].match(/(\d+)%进度/);
        if (match) {
          taskData.progress = parseInt(match[1]);
        }
      }
      
      // 获取时间
      const timeTags = note.tags.filter(tag => tag.includes("小时"));
      if (timeTags.length > 0) {
        const match = timeTags[0].match(/([\d.]+)小时/);
        if (match) {
          taskData.timeSpent = parseFloat(match[1]);
        }
      }
      
      // 获取文本评论
      note.comments.forEach(comment => {
        if (MNComment.getCommentType(comment) === 'textComment') {
          taskData.comments.push(comment.text);
        }
      });
      
      tasks.push(taskData);
    });
    
    return {
      exportDate: new Date().toISOString(),
      version: "1.0",
      tasks: tasks
    };
  }

  /**
   * 获取笔记的状态
   * @param {MNNote} note - 任务笔记
   * @returns {string} 状态标识
   */
  static getNoteStatus(note) {
    switch(note.colorIndex) {
      case 0:
        return 'notStarted';
      case 6:
        return 'inProgress';
      case 5:
        return 'completed';
      case 3:
        return 'blocked';
      case 14:
        return 'cancelled';
      default:
        return 'unknown';
    }
  }

  /**
   * 按章节拆分任务
   * @param {MNNote} parentNote - 父任务笔记
   * @param {number} startChapter - 起始章节
   * @param {number} endChapter - 结束章节
   * @returns {Array<MNNote>} 创建的子任务数组
   */
  static splitTaskByChapters(parentNote, startChapter, endChapter) {
    const subtasks = [];
    
    MNUtil.undoGrouping(() => {
      for (let i = startChapter; i <= endChapter; i++) {
        const childNote = MNNote.new({
          title: `第${i}章`,
          colorIndex: 2  // 淡蓝色，任务类型
        });
        
        // 添加任务类型前缀
        childNote.noteTitle = `【T >> 】第${i}章`;
        
        // 添加字段
        childNote.appendHtmlComment('<p style="font-size: 16px; color: #333;">📋 任务详情</p>', '任务详情', 16, '📋');
        childNote.appendHtmlComment('<p style="font-size: 14px; color: #666;">预计阅读时间：</p>', '预计阅读时间：', 14, '⏱️');
        childNote.appendHtmlComment('<p style="font-size: 14px; color: #666;">实际阅读时间：</p>', '实际阅读时间：', 14, '⏰');
        
        // 添加到父任务
        parentNote.addChild(childNote);
        
        // 链接到父任务
        this.linkTasks(childNote, parentNote);
        
        subtasks.push(childNote);
      }
      
      // 更新父任务进度字段
      parentNote.appendTextComment(`子任务数量：${subtasks.length}`);
    });
    
    return subtasks;
  }

  /**
   * 按页数拆分任务
   * @param {MNNote} parentNote - 父任务笔记
   * @param {number} totalPages - 总页数
   * @param {number} pagesPerTask - 每个任务的页数
   * @returns {Array<MNNote>} 创建的子任务数组
   */
  static splitTaskByPages(parentNote, totalPages, pagesPerTask) {
    const subtasks = [];
    const taskCount = Math.ceil(totalPages / pagesPerTask);
    
    MNUtil.undoGrouping(() => {
      for (let i = 0; i < taskCount; i++) {
        const startPage = i * pagesPerTask + 1;
        const endPage = Math.min((i + 1) * pagesPerTask, totalPages);
        
        const childNote = MNNote.new({
          title: `第${startPage}-${endPage}页`,
          colorIndex: 2  // 淡蓝色，任务类型
        });
        
        // 添加任务类型前缀
        childNote.noteTitle = `【T >> 】第${startPage}-${endPage}页`;
        
        // 添加字段
        childNote.appendHtmlComment(`<p style="font-size: 16px; color: #333;">📄 页码范围：${startPage}-${endPage}</p>`, 
          `页码范围：${startPage}-${endPage}`, 16, '📄');
        childNote.appendHtmlComment(`<p style="font-size: 14px; color: #666;">页数：${endPage - startPage + 1}页</p>`, 
          `页数：${endPage - startPage + 1}页`, 14, '📊');
        
        // 添加到父任务
        parentNote.addChild(childNote);
        
        // 链接到父任务
        this.linkTasks(childNote, parentNote);
        
        subtasks.push(childNote);
      }
      
      // 更新父任务信息
      parentNote.appendTextComment(`总页数：${totalPages}页`);
      parentNote.appendTextComment(`子任务数量：${subtasks.length}`);
    });
    
    return subtasks;
  }

  /**
   * 按时间块拆分任务
   * @param {MNNote} parentNote - 父任务笔记
   * @param {number} totalHours - 总小时数
   * @param {number} hoursPerBlock - 每个时间块的小时数
   * @returns {Array<MNNote>} 创建的子任务数组
   */
  static splitTaskByTimeBlocks(parentNote, totalHours, hoursPerBlock) {
    const subtasks = [];
    const blockCount = Math.ceil(totalHours / hoursPerBlock);
    
    MNUtil.undoGrouping(() => {
      for (let i = 0; i < blockCount; i++) {
        const blockNumber = i + 1;
        const minutes = Math.round(hoursPerBlock * 60);
        
        const childNote = MNNote.new({
          title: `时间块 #${blockNumber} (${minutes}分钟)`,
          colorIndex: 2  // 淡蓝色，任务类型
        });
        
        // 添加任务类型前缀
        childNote.noteTitle = `【T >> 】时间块 #${blockNumber}`;
        
        // 添加字段
        childNote.appendHtmlComment(`<p style="font-size: 16px; color: #333;">⏱️ 时长：${minutes}分钟</p>`, 
          `时长：${minutes}分钟`, 16, '⏱️');
        childNote.appendHtmlComment('<p style="font-size: 14px; color: #666;">开始时间：</p>', '开始时间：', 14, '🕐');
        childNote.appendHtmlComment('<p style="font-size: 14px; color: #666;">结束时间：</p>', '结束时间：', 14, '🕑');
        childNote.appendHtmlComment('<p style="font-size: 14px; color: #666;">完成情况：</p>', '完成情况：', 14, '✅');
        
        // 如果是番茄钟（25分钟），添加特殊标记
        if (minutes === 25) {
          childNote.appendTags(['番茄钟']);
        }
        
        // 添加到父任务
        parentNote.addChild(childNote);
        
        // 链接到父任务
        this.linkTasks(childNote, parentNote);
        
        subtasks.push(childNote);
      }
      
      // 更新父任务信息
      parentNote.appendTextComment(`预计总时间：${totalHours}小时`);
      parentNote.appendTextComment(`时间块数量：${subtasks.length}`);
      parentNote.appendTextComment(`每块时长：${Math.round(hoursPerBlock * 60)}分钟`);
    });
    
    return subtasks;
  }

  /**
   * 批量创建子任务
   * @param {MNNote} parentNote - 父任务笔记
   * @param {Array<string>} subtaskNames - 子任务名称数组
   * @returns {Array<MNNote>} 创建的子任务数组
   */
  static batchCreateSubtasks(parentNote, subtaskNames) {
    const subtasks = [];
    
    MNUtil.undoGrouping(() => {
      subtaskNames.forEach((name, index) => {
        const childNote = MNNote.new({
          title: name,
          colorIndex: 2  // 淡蓝色，任务类型
        });
        
        // 添加任务类型前缀
        childNote.noteTitle = `【T >> 】${name}`;
        
        // 添加基本字段
        childNote.appendHtmlComment('<p style="font-size: 16px; color: #333;">📋 任务描述</p>', '任务描述', 16, '📋');
        childNote.appendHtmlComment('<p style="font-size: 14px; color: #666;">优先级：中</p>', '优先级：中', 14, '🏷️');
        childNote.appendHtmlComment(`<p style="font-size: 14px; color: #666;">序号：${index + 1}</p>`, 
          `序号：${index + 1}`, 14, '#️⃣');
        
        // 添加到父任务
        parentNote.addChild(childNote);
        
        // 链接到父任务
        this.linkTasks(childNote, parentNote);
        
        subtasks.push(childNote);
      });
      
      // 更新父任务信息
      parentNote.appendTextComment(`子任务数量：${subtasks.length}`);
    });
    
    return subtasks;
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
  
  // OKR 任务管理相关函数
  
  /**
   * 获取卡片的标题
   * 如果没有【】前缀，就是原标题
   * 如果有【】前缀，则获取去掉【】前缀后的内容
   */
  taskUtils.getOKRNoteTitle = function(note) {
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
  taskUtils.ifOCRNoteHandled = function(note) {
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
  taskUtils.getOKRNoteTypeObj = function(note) {
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

  taskUtils.getOKRNoteZhTypeByTitlePrefix = function(note) {
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
  taskUtils.getKeyResultNote = function(note) {
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
  taskUtils.getGoalNote = function(note) {
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
  taskUtils.getParentProjectNotesArr = function(note) {
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
  taskUtils.getPrefixObj = function(note) {
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
  taskUtils.getOCRNoteStatus = function(note) {
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
  taskUtils.updateOCRNoteStatus = function(status) {
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

  taskUtils.undoOCRNoteStatus = function(status) {
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
  taskUtils.clearTimeTag = function(note) {
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
  taskUtils.addTodayTimeTag = function(note) {
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
  taskUtils.updateTimeTag = function(note) {
    this.splitTimeTag(note)
    this.clearBeforeTodayTimeTag(note)
    this.addTodayTimeTag(note)
  }

  /**
   * 更新当天的标签
   */
  taskUtils.updateTodayTimeTag = function(note) {
    this.clearTimeTag(note)
    this.addTodayTimeTag(note)
  }

  /**
   * 删除今日前的时间标签
   */
  taskUtils.clearBeforeTodayTimeTag = function(note) {
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
  taskUtils.splitTimeTag = function(note) {
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
  taskUtils.hasTodayTimeTag = function(note) {
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
  taskUtils.OKRNoteMake = function(note, undoStatus = false) {
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
  taskUtils.getNoteIdArr = function(notes) {
    let idsArr = []
    notes.forEach(note => {
      idsArr.push(note.noteId)
    })
    return idsArr
  }

  /**
   * 批量获取卡片 URL 存到 Arr 里
   */
  taskUtils.getNoteURLArr = function(notes) {
    let idsArr = []
    notes.forEach(note => {
      idsArr.push(note.noteURL)
    })
    return idsArr
  }

  taskUtils.TemplateMakeNote = function(note) {
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

  taskUtils.isValidNoteId = function(noteId) {
    const regex = /^[0-9A-Z]{8}-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{12}$/;
    return regex.test(noteId);
  }

  taskUtils.getNoteIdFromClipboard = function() {
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


  // ===== 链接相关函数 =====
  
  taskUtils.isCommentLink = function(comment) {
    return comment.type === "TextNote" && comment.text.includes("marginnote4app://note/");
  }

  taskUtils.getNoteURLById = function(noteId) {
    noteId = noteId.trim()
    let noteURL
    if (/^marginnote\dapp:\/\/note\//.test(noteId)) {
      noteURL = noteId
    } else {
      noteURL = "marginnote4app://note/" + noteId
    }
    return noteURL
  }

  taskUtils.getLinkType = function(note, link){
    link = this.getNoteURLById(link)
    let linkedNoteId = MNUtil.getNoteIdByURL(link)
    let linkedNote = MNNote.new(linkedNoteId)
    if (note.hasComment(link)) {
      if (linkedNote.getCommentIndex(note.noteURL) !== -1) {
        return "Double"
      } else {
        return "Single"
      }
    } else {
      MNUtil.showHUD("卡片「" + note.title + "」中不包含到「" + linkedNote.title + "」的链接")
    }
  }

  taskUtils.isLinkDouble = function(note, link) {
    return this.getLinkType(note, link) === "Double";
  }

  taskUtils.isLinkSingle = function(note, link) {
    return this.getLinkType(note, link) === "Single";
  }

  taskUtils.pasteNoteAsChildNote = function(targetNote){
    // 不足：跨学习集的时候必须要进入到目标学习集里面
    let cutNoteId = this.getNoteIdFromClipboard()
    let cutNoteLinksInfoArr = []
    let handledLinksSet = new Set()  // 防止 cutNote 里面有多个相同链接，造成对 linkedNote 的多次相同处理
    if (cutNoteId !== undefined){
      let cutNote = MNNote.new(cutNoteId)
      if (cutNote) {
        this.linksConvertToMN4Type(cutNote)
        cutNote.comments.forEach(
          (comment, index) => {
            if (this.isCommentLink(comment)) {
              if (this.isLinkDouble(cutNote, comment.text)) {
                // 双向链接
                cutNoteLinksInfoArr.push(
                  {
                    linkedNoteId: MNUtil.getNoteIdByURL(comment.text),
                    indexInCutNote: index,
                    indexArrInLinkedNote: MNNote.new(MNUtil.getNoteIdByURL(comment.text)).getCommentIndexArray(cutNote.noteId)
                  }
                )
              } else {
                // 单向链接
                cutNoteLinksInfoArr.push(
                  {
                    linkedNoteId: MNUtil.getNoteIdByURL(comment.text),
                    indexInCutNote: index
                  }
                )
              }
            }
          }
        )
        // 去掉被剪切卡片里的所有链接
        cutNote.clearAllLinks()
        // 在目标卡片下新建一个卡片
        let config = {
          title: cutNote.title,
          content: "",
          markdown: true,
          color: cutNote.colorIndex,
        }
        let newNote = targetNote.createChildNote(config)
        cutNote.title = ""
        // 合并之前要把双向链接的卡片里的旧链接删掉
        cutNoteLinksInfoArr.forEach(
          cutNoteLinkInfo => {
            if (!handledLinksSet.has(cutNoteLinkInfo.linkedNoteId)) {
              let linkedNote = MNNote.new(cutNoteLinkInfo.linkedNoteId)
              if (linkedNote) {
                if (cutNoteLinkInfo.indexArrInLinkedNote !== undefined) {
                  // 双向链接
                  linkedNote.removeCommentsByIndices(cutNoteLinkInfo.indexArrInLinkedNote)
                }
              }
            }
            handledLinksSet.add(cutNoteLinkInfo.linkedNoteId)
          }
        )
        // 将被剪切的卡片合并到新卡片中
        newNote.merge(cutNote)

        try {
          handledLinksSet.clear()
          // 重新链接
          cutNoteLinksInfoArr.forEach(
            cutNoteLinkInfo => {
              let linkedNote = MNNote.new(cutNoteLinkInfo.linkedNoteId)
              newNote.appendNoteLink(linkedNote, "To")
              newNote.moveComment(newNote.comments.length-1, cutNoteLinkInfo.indexInCutNote)
              if (!handledLinksSet.has(cutNoteLinkInfo.linkedNoteId)) {
                if (cutNoteLinkInfo.indexArrInLinkedNote !== undefined) {
                  // 双向链接
                  cutNoteLinkInfo.indexArrInLinkedNote.forEach(
                    index => {
                      linkedNote.appendNoteLink(newNote, "To")
                      linkedNote.moveComment(linkedNote.comments.length-1, index)
                    }
                  )
                }
              }
              handledLinksSet.add(cutNoteLinkInfo.linkedNoteId)
              this.clearAllFailedLinks(linkedNote)
            }
          )
        } catch (error) {
          MNUtil.showHUD(error);
        }
      }
    }
  }

  taskUtils.getProofHtmlCommentIndex = function(focusNote, includeMethod = false, methodNum = 0) {
    let focusNoteType = this.getKnowledgeNoteTypeByColorIndex(focusNote.colorIndex)
    let proofHtmlCommentIndex
    switch (focusNoteType) {
      case "method":
        proofHtmlCommentIndex = focusNote.getCommentIndex("原理：", true)
        break;
      case "antiexample":
        proofHtmlCommentIndex = focusNote.getCommentIndex("反例及证明：", true)
        break;
      default:
        if (includeMethod) {
          proofHtmlCommentIndex = (focusNote.getIncludingCommentIndex('方法'+ this.numberToChinese(methodNum) +'：', true) == -1)?focusNote.getCommentIndex("证明：", true):focusNote.getIncludingCommentIndex('方法'+ this.numberToChinese(methodNum) +'：', true)
        } else {
          proofHtmlCommentIndex = focusNote.getCommentIndex("证明：", true)
        }
        break;
    }
    return proofHtmlCommentIndex
  }

  // 将证明移动到某个 index
  taskUtils.moveProofToIndex = function(focusNote, targetIndex, includeMethod = false , methodNum = 0) {
    let focusNoteComments = focusNote.note.comments
    let focusNoteCommentLength = focusNoteComments.length
    let nonLinkNoteCommentsIndex = []
    let focusNoteType
    switch (focusNote.colorIndex) {
      case 0: // 淡黄色
        focusNoteType = "classification"
        break;
      case 2: // 淡蓝色：定义类
        focusNoteType = "definition"
        break;
      case 3: // 淡粉色：反例
        focusNoteType = "antiexample"
        break;
      case 4: // 黄色：归类
        focusNoteType = "classification"
        break;
      case 6: // 蓝色：应用
        focusNoteType = "application"
        break;
      case 9: // 深绿色：思想方法
        focusNoteType = "method"
        break;
      case 10: // 深蓝色：定理命题
        focusNoteType = "theorem"
        break;
      case 13: // 淡灰色：问题
        focusNoteType = "question"
        break;
      case 15: // 淡紫色：例子
        focusNoteType = "example"
        break;
    }
    let proofHtmlCommentIndex
    switch (focusNoteType) {
      case "method":
        proofHtmlCommentIndex = focusNote.getCommentIndex("原理：", true)
        break;
      case "antiexample":
        proofHtmlCommentIndex = focusNote.getCommentIndex("反例及证明：", true)
        break;
      default:
        if (includeMethod) {
          proofHtmlCommentIndex = (focusNote.getIncludingCommentIndex('方法'+ this.numberToChinese(methodNum) +'：', true) == -1)?focusNote.getCommentIndex("证明：", true):focusNote.getIncludingCommentIndex('方法'+ this.numberToChinese(methodNum) +'：', true)
        } else {
          proofHtmlCommentIndex = focusNote.getCommentIndex("证明：", true)
        }
        break;
    }
    let applicationHtmlCommentIndex = focusNote.getCommentIndex("应用：", true)
    let applicationHtmlCommentIndexArr = []
    if (applicationHtmlCommentIndex !== -1) {
      focusNote.comments.forEach((comment, index) => {
        if (
          comment.text &&
          (
            comment.text.includes("应用：") ||
            comment.text.includes("的应用")
          )
        ) {
          applicationHtmlCommentIndexArr.push(index)
        }
      })
      applicationHtmlCommentIndex = applicationHtmlCommentIndexArr[applicationHtmlCommentIndexArr.length-1]
    }
    focusNoteComments.forEach((comment, index) => {
      if (index > applicationHtmlCommentIndex) {
        if (
          comment.type == "PaintNote" || comment.type == "LinkNote" ||
          (
            comment.text &&
            !comment.text.includes("marginnote4app") && !comment.text.includes("marginnote3app") 
          )
        ) {
          nonLinkNoteCommentsIndex.push(index)
        }
      }
    })

    for (let i = focusNoteCommentLength-1; i >= nonLinkNoteCommentsIndex[0]; i--) {
      focusNote.moveComment(focusNoteCommentLength-1, targetIndex);
    }
  }

  // ===== 链接去重和清理函数 =====
  
  // 从 startIndex 下一个 comment 开始，删除重复的链接
  taskUtils.linkRemoveDuplicatesAfterIndex = function(note, startIndex){
    let links = new Set()
    if (startIndex < note.comments.length-1) {
      // 下面先有内容才处理
      for (let i = note.comments.length-1; i > startIndex; i--){
        let comment = note.comments[i]
        if (
          comment.type = "TextNote" &&
          comment.text.includes("marginnote4app://note/")
        ) {
          if (links.has(comment.text)) {
            note.removeCommentByIndex(i)
          } else {
            links.add(comment.text)
          }
        }
      }
    }
  }

  taskUtils.removeDuplicateKeywordsInTitle = function(note){
    // 获取关键词数组，如果noteTitle的格式为【xxxx】yyyyy，则默认返回一个空数组
    let keywordsArray = note.noteTitle.match(/【.*】(.*)/) && note.noteTitle.match(/【.*】(.*)/)[1].split("; ");
    if (!keywordsArray || keywordsArray.length === 0) return; // 如果无关键词或关键词数组为空，则直接返回不做处理
    
    // 将关键词数组转化为集合以去除重复项，然后转回数组
    let uniqueKeywords = Array.from(new Set(keywordsArray));
    
    // 构建新的标题字符串，保留前缀和去重后的关键词列表
    let newTitle = `【${note.noteTitle.match(/【(.*)】.*/)[1]}】${uniqueKeywords.join("; ")}`;
    
    // 更新note对象的noteTitle属性
    note.noteTitle = newTitle;
  }

  taskUtils.mergeInParentAndReappendAllLinks = function(focusNote) {
    let parentNote = focusNote.parentNote

    for (let i = focusNote.comments.length-1; i >= 0; i--) {
      let comment = focusNote.comments[i]
      if (
        comment.type == "TextNote" &&
        comment.text.includes("marginnote4app://note/")
      ) {
        let targetNoteId = comment.text.match(/marginnote4app:\/\/note\/(.*)/)[1]
        let targetNote = MNNote.new(targetNoteId)
        if (targetNote) {
          let focusNoteIndexInTargetNote = targetNote.getCommentIndex("marginnote4app://note/" + focusNote.noteId)
          if (focusNoteIndexInTargetNote !== -1) {
            // 加个判断，防止是单向链接
            targetNote.removeCommentByIndex(focusNoteIndexInTargetNote)
            targetNote.appendNoteLink(parentNote, "To")
            targetNote.moveComment(targetNote.comments.length-1, focusNoteIndexInTargetNote)
          }
        }
      }
    }
    // 合并到父卡片
    parentNote.merge(focusNote.note)

    // 最后更新父卡片（也就是合并后的卡片）里的链接
    this.reappendAllLinksInNote(parentNote)

    // 处理合并到概要卡片的情形
    if (parentNote.title.startsWith("Summary")) {
      parentNote.title = parentNote.title.replace(/(Summary; )(.*)/, "$2")
    }
  }

  taskUtils.reappendAllLinksInNote = function(focusNote) {
    this.clearAllFailedLinks(focusNote)
    for (let i = focusNote.comments.length-1; i >= 0; i--) {
      let comment = focusNote.comments[i]
      if (
        comment.type == "TextNote" &&
        comment.text.includes("marginnote4app://note/")
      ) {
        let targetNoteId = comment.text.match(/marginnote4app:\/\/note\/(.*)/)[1]
        if (!targetNoteId.includes("/summary/")) {  // 防止把概要的链接处理了
          let targetNote = MNNote.new(targetNoteId)
          focusNote.removeCommentByIndex(i)
          focusNote.appendNoteLink(targetNote, "To")
          focusNote.moveComment(focusNote.comments.length-1,i)
        }
      }
    }
  }

  taskUtils.clearAllFailedLinks = function(focusNote) {
    this.linksConvertToMN4Type(focusNote)
    // 从最后往上删除，就不会出现前面删除后干扰后面的 index 的情况
    for (let i = focusNote.comments.length-1; i >= 0; i--) {
      let comment = focusNote.comments[i]
      if (
        comment.type == "TextNote" &&
        comment.text.includes("marginnote3app://note/")
      ) {
        focusNote.removeCommentByIndex(i)
      } else if (
        comment.type == "TextNote" &&
        comment.text.includes("marginnote4app://note/")
      ) {
        let targetNoteId = comment.text.match(/marginnote4app:\/\/note\/(.*)/)[1]
        if (!targetNoteId.includes("/summary/")) {  // 防止把概要的链接处理了
          let targetNote = MNNote.new(targetNoteId)
          if (!targetNote) {
            focusNote.removeCommentByIndex(i)
          }
        }
      }
    }
  }

  taskUtils.linksConvertToMN4Type = function(focusNote) {
    for (let i = focusNote.comments.length-1; i >= 0; i--) {
      let comment = focusNote.comments[i]
      if (
        comment.type == "TextNote" &&
        comment.text.startsWith("marginnote3app://note/")
      ) {
        let targetNoteId = comment.text.match(/marginnote3app:\/\/note\/(.*)/)[1]
        let targetNote = MNNote.new(targetNoteId)
        if (targetNote) {
          focusNote.removeCommentByIndex(i)
          focusNote.appendNoteLink(targetNote, "To")
          focusNote.moveComment(focusNote.comments.length-1, i)
        } else {
          focusNote.removeCommentByIndex(i)
        }
      }
    }
  }

  taskUtils.generateArrayCombinations = function(Arr, joinLabel) {
    const combinations = [];
    const permute = (result, used) => {
      if (result.length === Arr.length) {
        combinations.push(result.join(joinLabel)); // 保存当前组合
        return;
      }
      for (let i = 0; i < Arr.length; i++) {
        if (!used[i]) { // 检查当前元素是否已使用
          used[i] = true; // 标记为已使用
          permute(result.concat(Arr[i]), used); // 递归
          used[i] = false; // 回溯，标记为未使用
        }
      }
    };
    permute([], Array(Arr.length).fill(false)); // 初始调用
    return combinations;
  }

  taskUtils.findCommonComments = function(arr, startText) {
    let result = null;

    arr.forEach((note, index) => {
      const fromIndex = note.getCommentIndex(startText, true) + 1;
      const subArray = note.comments.slice(fromIndex);
      const texts = subArray.map(comment => comment.text); // 提取 text
  
      if (result === null) {
        result = new Set(texts);
      } else {
        result = new Set([...result].filter(comment => texts.includes(comment)));
      }
  
      if (result.size === 0) return; // 提前退出
    });
  
    return result ? Array.from(result) : [];
  }

  // 检测 str 是不是一个 4 位的数字
  taskUtils.isFourDigitNumber = function(str) {
    // 使用正则表达式检查
    const regex = /^\d{4}$/;
    return regex.test(str);
  }

  taskUtils.referenceInfoYear = function(focusNote, year) {
    let findYear = false
    let targetYearNote
    let yearLibraryNote = MNNote.new("F251AFCC-AA8E-4A1C-A489-7EA4E4B58A02")
    let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true)
    for (let i = 0; i <= yearLibraryNote.childNotes.length-1; i++) {
      if (
        this.getFirstKeywordFromTitle(yearLibraryNote.childNotes[i].noteTitle) == year
      ) {
        targetYearNote = yearLibraryNote.childNotes[i]
        findYear = true
        break;
      }
    }
    if (!findYear) {
      // 若不存在，则添加年份卡片
      targetYearNote = MNNote.clone("16454AD3-C1F2-4BC4-8006-721F84999BEA")
      targetYearNote.note.noteTitle += "; " + year
      yearLibraryNote.addChild(targetYearNote.note)
    }
    let yearTextIndex = focusNote.getIncludingCommentIndex("- 年份", true)
    if (yearTextIndex == -1) {
      focusNote.appendMarkdownComment("- 年份（Year）：", thoughtHtmlCommentIndex)
      focusNote.appendNoteLink(targetYearNote, "To")
      focusNote.moveComment(focusNote.comments.length-1,thoughtHtmlCommentIndex+1)
    } else {
      if (focusNote.getCommentIndex("marginnote4app://note/" + targetYearNote.noteId) == -1) {
        focusNote.appendNoteLink(targetYearNote, "To")
        focusNote.moveComment(focusNote.comments.length-1,yearTextIndex + 1)
      } else {
        focusNote.moveComment(focusNote.getCommentIndex("marginnote4app://note/" + targetYearNote.noteId),yearTextIndex + 1)
      }
    }
  }

  // ===== 评论和内容处理函数 =====

  taskUtils.moveLastCommentAboveComment = function(note, commentText){
    let commentIndex = note.getCommentIndex(commentText, true)
    if (commentIndex != -1) {
      note.moveComment(
        note.comments.length - 1,
        commentIndex
      )
    }
    return commentIndex
  }

  taskUtils.numberToChinese = function(num) {
    const chineseNumbers = '零一二三四五六七八九';
    const units = ['', '十', '百', '千', '万', '亿'];
    
    if (num === 0) return chineseNumbers[0];

    let result = '';
    let unitIndex = 0;

    while (num > 0) {
        const digit = num % 10;
        if (digit !== 0) {
            result = chineseNumbers[digit] + units[unitIndex] + result;
        } else if (result && result[0] !== chineseNumbers[0]) {
            result = chineseNumbers[0] + result; // 在需要时添加"零"
        }
        num = Math.floor(num / 10);
        unitIndex++;
    }

    // 去除前面的零
    return result.replace(/零+/, '零').replace(/零+$/, '').trim();
  }

  // 获得淡绿色、淡黄色、黄色卡片的类型
  taskUtils.getClassificationNoteTypeByTitle = function(title) {
    let match = title.match(/.*相关(.*)/)
    if (match) {
      return match[1]
    } else {
      return ""
    }
  }

  taskUtils.referenceSeriesBookMakeCard = function(focusNote, seriesName, seriesNum) {
    if (focusNote.excerptText) {
      this.convertNoteToNonexcerptVersion(focusNote)
    } else {
      MNUtil.undoGrouping(()=>{
        let seriesLibraryNote = MNNote.new("4DBABA2A-F4EB-4B35-90AB-A192B79411FD")
        let findSeries = false
        let targetSeriesNote
        let focusNoteIndexInTargetSeriesNote
        for (let i = 0; i <= seriesLibraryNote.childNotes.length-1; i++) {
          if (seriesLibraryNote.childNotes[i].noteTitle.includes(seriesName)) {
            targetSeriesNote = seriesLibraryNote.childNotes[i]
            seriesName = taskUtils.getFirstKeywordFromTitle(targetSeriesNote.noteTitle)
            findSeries = true
            break;
          }
        }
        if (!findSeries) {
          targetSeriesNote = MNNote.clone("5CDABCEC-8824-4E9F-93E1-574EA7811FB4")
          targetSeriesNote.note.noteTitle = "【文献：书作系列】; " + seriesName
          seriesLibraryNote.addChild(targetSeriesNote.note)
        }
        let referenceInfoHtmlCommentIndex = focusNote.getCommentIndex("文献信息：", true)
        if (referenceInfoHtmlCommentIndex == -1) {
          taskUtils.cloneAndMerge(focusNote, "F09C0EEB-4FB5-476C-8329-8CC5AEFECC43")
        }
        let seriesTextIndex = focusNote.getIncludingCommentIndex("- 系列", true)
        let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true)
        MNUtil.undoGrouping(()=>{
          if (seriesNum !== "0") {
            focusNote.noteTitle = taskUtils.replaceStringStartWithSquarebracketContent(focusNote.noteTitle, "【文献：书作："+ seriesName + " - Vol. "+ seriesNum + "】; ")
          } else {
            focusNote.noteTitle = taskUtils.replaceStringStartWithSquarebracketContent(focusNote.noteTitle, "【文献：书作："+ seriesName + "】; ")
          }
        })
        if (seriesTextIndex == -1) {
          MNUtil.undoGrouping(()=>{
            if (seriesNum !== "0") {
              focusNote.appendMarkdownComment("- 系列：Vol. " + seriesNum, thoughtHtmlCommentIndex)
            } else {
              focusNote.appendMarkdownComment("- 系列：", thoughtHtmlCommentIndex)
            }
          })
          focusNote.appendNoteLink(targetSeriesNote, "To")
          focusNote.moveComment(focusNote.comments.length-1,thoughtHtmlCommentIndex+1)
        } else {
          // 删掉重新添加
          focusNote.removeCommentByIndex(seriesTextIndex)
          MNUtil.undoGrouping(()=>{
            if (seriesNum !== "0") {
              focusNote.appendMarkdownComment("- 系列：Vol. " + seriesNum, seriesTextIndex)
            } else {
              focusNote.appendMarkdownComment("- 系列：", seriesTextIndex)
            }
          })
          if (focusNote.getCommentIndex("marginnote4app://note/" + targetSeriesNote.noteId) == -1) {
            focusNote.appendNoteLink(targetSeriesNote, "To")
            focusNote.moveComment(focusNote.comments.length-1,seriesTextIndex + 1)
          } else {
            focusNote.moveComment(focusNote.getCommentIndex("marginnote4app://note/" + targetSeriesNote.noteId),seriesTextIndex + 1)
          }
        }
        focusNoteIndexInTargetSeriesNote = targetSeriesNote.getCommentIndex("marginnote4app://note/" + focusNote.noteId)
        if (focusNoteIndexInTargetSeriesNote == -1){
          targetSeriesNote.appendNoteLink(focusNote, "To")
        }
        try {
          MNUtil.undoGrouping(()=>{
            taskUtils.sortNoteByVolNum(targetSeriesNote, 1)
            let bookLibraryNote = MNNote.new("49102A3D-7C64-42AD-864D-55EDA5EC3097")
            bookLibraryNote.addChild(focusNote.note)
            // focusNote.focusInMindMap(0.5)
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
      })
      return focusNote
    }
  }

  taskUtils.replaceStringStartWithSquarebracketContent = function(string, afterContent) {
    if (string.startsWith("【")) {
      string = string.replace(/^【.*?】/, afterContent)
    } else {
      string = afterContent + string
    }
    return string
  }

  taskUtils.referenceRefByRefNum = function(focusNote, refNum) {
    if (focusNote.excerptText) {
      this.convertNoteToNonexcerptVersion(focusNote)
    } else {
      let currentDocmd5 = MNUtil.currentDocmd5
      let findClassificationNote = false
      let classificationNote
      if (taskConfig.referenceIds.hasOwnProperty(currentDocmd5)) {
        if (taskConfig.referenceIds[currentDocmd5].hasOwnProperty(refNum)) {
          if (taskConfig.referenceIds[currentDocmd5][0] == undefined) {
            MNUtil.showHUD("文档未绑定 ID")
          } else {
            let refSourceNoteId = taskConfig.referenceIds[currentDocmd5][0]
            let refSourceNote = MNNote.new(refSourceNoteId)
            let refSourceNoteTitle = taskUtils.getFirstKeywordFromTitle(refSourceNote.noteTitle)
            let refSourceNoteAuthor = taskUtils.getFirstAuthorFromReferenceById(refSourceNoteId)
            let refedNoteId = taskConfig.referenceIds[currentDocmd5][refNum]
            let refedNote = MNNote.new(refedNoteId)
            let refedNoteTitle = taskUtils.getFirstKeywordFromTitle(refedNote.noteTitle)
            let refedNoteAuthor = taskUtils.getFirstAuthorFromReferenceById(refedNoteId)
            // 先看 refedNote 有没有归类的子卡片了
            for (let i = 0; i < refedNote.childNotes.length; i++) {
              let childNote = refedNote.childNotes[i]
              if (
                childNote.noteTitle &&
                childNote.noteTitle.includes("[" + refNum + "] " + refedNoteTitle)
              ) {
                classificationNote = refedNote.childNotes[i]
                findClassificationNote = true
                break
              }
            }
            if (!findClassificationNote) {
              // 没有的话就创建一个
              classificationNote = MNNote.clone("C24C2604-4B3A-4B6F-97E6-147F3EC67143")
              classificationNote.noteTitle = 
                "「" + refSourceNoteTitle + " - " + refSourceNoteAuthor +"」引用" + "「[" + refNum + "] " + refedNoteTitle + " - " + refedNoteAuthor + "」情况"
            } else {
              // 如果找到的话就更新一下标题
              // 因为可能会出现偶尔忘记写作者导致的 No author 
              classificationNote.noteTitle = 
                "「" + refSourceNoteTitle + " - " + refSourceNoteAuthor +"」引用" + "「[" + refNum + "] " + refedNoteTitle + " - " + refedNoteAuthor + "」情况"
            }
            refedNote.addChild(classificationNote.note)
            // 移动链接到"引用："
            let refedNoteIdIndexInClassificationNote = classificationNote.getCommentIndex("marginnote4app://note/" + refedNoteId)
            if (refedNoteIdIndexInClassificationNote == -1){
              classificationNote.appendNoteLink(refedNote, "To")
              classificationNote.moveComment(classificationNote.comments.length-1,classificationNote.getCommentIndex("具体引用：", true))
            } else {
              classificationNote.moveComment(refedNoteIdIndexInClassificationNote,classificationNote.getCommentIndex("具体引用：", true) - 1)
            }
            // 移动链接到"原文献"
            let refSourceNoteIdIndexInClassificationNote = classificationNote.getCommentIndex("marginnote4app://note/" + refSourceNoteId)
            if (refSourceNoteIdIndexInClassificationNote == -1){
              classificationNote.appendNoteLink(refSourceNote, "To")
              classificationNote.moveComment(classificationNote.comments.length-1,classificationNote.getCommentIndex("引用：", true))
            } else {
              classificationNote.moveComment(refSourceNoteIdIndexInClassificationNote,classificationNote.getCommentIndex("引用：", true) - 1)
            }
            // 链接归类卡片到 refSourceNote
            let classificationNoteIdIndexInRefSourceNote = refSourceNote.getCommentIndex("marginnote4app://note/" + classificationNote.noteId)
            if (classificationNoteIdIndexInRefSourceNote == -1){
              refSourceNote.appendNoteLink(classificationNote, "To")
            }
            // 链接归类卡片到 refedNote
            let classificationNoteIdIndexInRefedNote = refedNote.getCommentIndex("marginnote4app://note/" + classificationNote.noteId)
            if (classificationNoteIdIndexInRefedNote == -1){
              refedNote.appendNoteLink(classificationNote, "To")
              // refedNote.moveComment(refedNote.comments.length-1,refedNote.getCommentIndex("参考文献：", true))
            }

            /* 处理引用内容 */

            // 标题
            // focusNote.noteTitle = "【「" + refSourceNoteTitle + " - " + refSourceNoteAuthor +"」引用" + "「[" + refNum + "] " + refedNoteTitle + " - " + refedNoteAuthor + "」情况】"
            focusNote.noteTitle = this.replaceStringStartWithSquarebracketContent(
              focusNote.noteTitle,
              "【「" + refSourceNoteTitle + " - " + refSourceNoteAuthor +"」引用" + "「[" + refNum + "] " + refedNoteTitle + " - " + refedNoteAuthor + "」情况】"
            )
            
            
            focusNote.noteTitle = focusNote.noteTitle.replace(/\s*{{refedNoteTitle}}\s*/, "「"+refedNoteTitle+"」")

            // 合并模板：
            let linkHtmlCommentIndex = focusNote.getCommentIndex("相关链接：", true)
            if (linkHtmlCommentIndex == -1) {
              this.cloneAndMerge(focusNote, "FFF70A03-D44F-4201-BD69-9B4BD3E96279")
            }

            // 链接到引用卡片
            linkHtmlCommentIndex = focusNote.getCommentIndex("相关链接：", true)
            // 先确保已经链接了
            let classificationNoteLinkIndexInFocusNote = focusNote.getCommentIndex("marginnote4app://note/" + classificationNote.noteId)
            if (classificationNoteLinkIndexInFocusNote == -1){
              focusNote.appendNoteLink(classificationNote, "To")
            }
            let refedNoteLinkIndexInFocusNote = focusNote.getCommentIndex("marginnote4app://note/" + refedNoteId)
            if (refedNoteLinkIndexInFocusNote == -1){
              focusNote.appendNoteLink(refedNote, "To")
            }
            let refSourceNoteLinkIndexInFocusNote = focusNote.getCommentIndex("marginnote4app://note/" + refSourceNoteId)
            if (refSourceNoteLinkIndexInFocusNote == -1){
              focusNote.appendNoteLink(refSourceNote, "To")
            }

            refSourceNoteLinkIndexInFocusNote = focusNote.getCommentIndex("marginnote4app://note/" + refSourceNoteId)
            focusNote.moveComment(refSourceNoteLinkIndexInFocusNote, linkHtmlCommentIndex+1)

            refedNoteLinkIndexInFocusNote = focusNote.getCommentIndex("marginnote4app://note/" + refedNoteId)
            focusNote.moveComment(refedNoteLinkIndexInFocusNote, linkHtmlCommentIndex+2)

            classificationNoteLinkIndexInFocusNote = focusNote.getCommentIndex("marginnote4app://note/" + classificationNote.noteId)
            focusNote.moveComment(classificationNoteLinkIndexInFocusNote, linkHtmlCommentIndex+3)


            // 链接到归类卡片
            let focusNoteLinkIndexInClassificationNote = classificationNote.getCommentIndex("marginnote4app://note/" + focusNote.noteId)
            if (focusNoteLinkIndexInClassificationNote == -1){
              classificationNote.appendNoteLink(focusNote, "To")
            }

            return [focusNote, classificationNote]
          }
        } else {
          MNUtil.showHUD("["+refNum+"] 未进行 ID 绑定")
        }
      } else {
        MNUtil.showHUD("当前文档并未开始绑定 ID")
      }
    }
  }

  // 获取文献卡片的第一个作者名
  taskUtils.getFirstAuthorFromReferenceById = function(id) {
    let note = MNNote.new(id)
    let authorTextIndex = note.getIncludingCommentIndex("- 作者", true)
    if (
      note.comments[authorTextIndex + 1].text &&
      note.comments[authorTextIndex + 1].text.includes("marginnote")
    ) {
      let authorId = MNUtil.getNoteIdByURL(note.comments[authorTextIndex + 1].text)
      let authorNote = MNNote.new(authorId)
      let authorTitle = authorNote.noteTitle
      return this.getFirstKeywordFromTitle(authorTitle)
    } else {
      return "No author!"
    }
  }

  // 替换英文标点
  taskUtils.formatPunctuationToEnglish = function(string) {
    // 将中文括号替换为西文括号
    string = string.replace(/–/g, '-');
    string = string.replace(/，/g, ',');
    string = string.replace(/。/g, '.');
    string = string.replace(/？/g, '?');
    string = string.replace(/（/g, '(');
    string = string.replace(/）/g, ')');
    string = string.replace(/【/g, '[');
    string = string.replace(/】/g, ']');
    string = string.replace(/「/g, '[');
    string = string.replace(/」/g, ']');
    
    return string;
  }

  // 规范化字符串中的英文标点的前后空格
  taskUtils.formatEnglishStringPunctuationSpace = function(string) {
    // 将中文括号替换为西文括号
    string = this.formatPunctuationToEnglish(string)

    // 去掉换行符
    string = string.replace(/\n/g, ' ');
    
    // 处理常见标点符号前后的空格
    string = string.replace(/ *, */g, ', ');
    string = string.replace(/ *\. */g, '. ');
    string = string.replace(/ *\? */g, '? ');
    string = string.replace(/ *\- */g, '-');
    string = string.replace(/ *\) */g, ') ');
    string = string.replace(/ *\] */g, '] ');
    
    // 如果标点符号在句末，则去掉后面的空格
    string = string.replace(/, $/g, ',');
    string = string.replace(/\. $/g, '.');
    string = string.replace(/\? $/g, '?');
    string = string.replace(/\) $/g, ')');
    string = string.replace(/\] $/g, ']');
    
    // 处理左括号类标点符号
    string = string.replace(/ *\( */g, ' (');
    string = string.replace(/ *\[ */g, ' [');

    // 处理一些特殊情况
    string = string.replace(/\. ,/g, '.,');  // 名字缩写的.和后面的,
    
    
    return string;
  }

  // [1] xx => 1
  taskUtils.extractRefNumFromReference = function(text) {
    text = this.formatPunctuationToEnglish(text)
    text = text.replace(/\n/g, ' ');
    // const regex = /^\s*\[\s*(\d{1,3})\s*\]\s*.+$/; 
    const regex = /^\s*\[\s*(.*?)\s*\]\s*.+$/; 
    const match = text.trim().match(regex); // 使用正则表达式进行匹配
    if (match) {
      return match[1].trim(); // 返回匹配到的文本，并去除前后的空格
    } else {
      return 0; // 如果没有找到匹配项，则返回原文本
    }
  }

  // [1] xxx => xxx
  taskUtils.extractRefContentFromReference = function(text) {
    text = this.formatPunctuationToEnglish(text)
    text = text.replace(/\n/g, ' ');
    const regex = /^\s*\[[^\]]*\]\s*(.+)$/;
    const match = text.trim().match(regex); // 使用正则表达式进行匹配
    if (match) {
      return match[1].trim(); // 返回匹配到的文本，并去除前后的空格
    } else {
      return text; // 如果没有找到匹配项，则返回原文本
    }
  }

  taskUtils.referenceStoreOneIdForCurrentDoc = function(input){
    let refNum = input.split('@')[0]
    let refId = input.split('@')[1]
    let currentDocmd5 = MNUtil.currentDocmd5
    if (taskConfig.referenceIds.hasOwnProperty(currentDocmd5)) {
      taskConfig.referenceIds[currentDocmd5][refNum] = refId
    } else {
      taskConfig.referenceIds[currentDocmd5] = {}
      taskConfig.referenceIds[currentDocmd5][refNum] = refId
    }
    MNUtil.showHUD("Save: [" + refNum + "] -> " + refId);
    taskConfig.save("MNTask_referenceIds")
  }

  taskUtils.getRefIdByNum = function(num) {
    let currentDocmd5 = MNUtil.currentDocmd5
    if (taskConfig.referenceIds[currentDocmd5].hasOwnProperty(num)) {
      return taskConfig.referenceIds[currentDocmd5][num]
    } else {
      MNUtil.showHUD("当前文档没有文献 [" + num + "] 的卡片 ID")
      return ""
    }
  }

  taskUtils.getVolNumFromTitle = function(title) {
    let match = title.match(/【.*?Vol.\s(\d+)】/)[1]
    return match? parseInt(match) : 0
  }

  taskUtils.getVolNumFromLink = function(link) {
    let note = MNNote.new(link)
    let title = note.noteTitle
    return this.getVolNumFromTitle(title)
  }

  // 卡片按照标题的年份进行排序
  taskUtils.sortNoteByYear = function() {
    let yearLibraryNote = MNNote.new("F251AFCC-AA8E-4A1C-A489-7EA4E4B58A02")
    let indexArr = Array.from({ length: yearLibraryNote.childNotes.length }, (_, i) => i);
    let idIndexArr = indexArr.map(index => ({
      id: yearLibraryNote.childNotes[index].noteId,
      year: parseInt(taskUtils.getFirstKeywordFromTitle(yearLibraryNote.childNotes[index].noteTitle))
    }));
    let sortedArr = idIndexArr.sort((a, b) => a.year - b.year)
    // MNUtil.showHUD(sortedArr[1].year)

    MNUtil.undoGrouping(()=>{
      sortedArr.forEach(
        (item, index) => {
          let yearNote = MNNote.new(item.id)
          yearLibraryNote.addChild(yearNote.note)
        }
      )
    })
  }

  // 链接按照 vol 的数值排序
  // startIndex 表示开始排序的评论索引
  taskUtils.sortNoteByVolNum = function(note, startIndex) {
    let commentsLength = note.comments.length;
    let initialIndexArr = Array.from({ length: commentsLength }, (_, i) => i);
    let initialSliceArr = initialIndexArr.slice(startIndex)
    let initialSliceVolnumArrAux = initialSliceArr.map(
      index => this.getVolNumFromLink(note.comments[index].text)
    )
    // MNUtil.showHUD(initialSliceVolnumArr)
    let initialSliceVolnumArr = [...initialSliceVolnumArrAux]
    let sortedVolnumArr = initialSliceVolnumArrAux.sort((a, b) => a - b)
    // MNUtil.showHUD(sortedVolnumArr)
    let targetSliceArr = []
    initialSliceVolnumArr.forEach(
      volnum => {
        targetSliceArr.push(sortedVolnumArr.indexOf(volnum) + startIndex)
      }
    )
    // MNUtil.showHUD(targetSliceArr)
    let targetArr = [
      ...initialIndexArr.slice(0, startIndex),
      ...targetSliceArr
    ]
    note.sortCommentsByNewIndices(targetArr)
    // MNUtil.showHUD(targetArr)
  }

  // 【xxx】yyy; zzz; => yyy || 【xxx】; zzz => zzz
  taskUtils.getFirstKeywordFromTitle = function(title) {
    // const regex = /【.*?】(.*?); (.*?)(;.*)?/;
    const regex = /【.*】(.*?);\s*([^;]*?)(?:;|$)/;
    const matches = title.match(regex);
  
    if (matches) {
      const firstPart = matches[1].trim(); // 提取分号前的内容
      const secondPart = matches[2].trim(); // 提取第一个分号后的内容
  
      // 根据第一部分是否为空选择返回内容
      return firstPart === '' ? secondPart : firstPart;
    }
  
    // 如果没有匹配，返回 null 或者空字符串
    return "";
  }

  taskUtils.getSecondKeywordFromTitle = function(title) {
    // const regex = /【.*?】(.*?); (.*?)(;.*)?/;
    const regex = /【.*】(.*?);\s*([^;]*?)(?:;|$)/;
    const matches = title.match(regex);
    let targetText = title
  
    if (matches) {
      const firstPart = matches[1].trim(); // 提取分号前的内容
      const secondPart = matches[2].trim(); // 提取第一个分号后的内容
  
      // 根据第一部分是否为空选择返回内容
      if (firstPart !== '') {
        targetText = targetText.replace(firstPart, "")
        return this.getFirstKeywordFromTitle(targetText)
      } else {
        targetText = targetText.replace("; " + secondPart, "")
        return this.getFirstKeywordFromTitle(targetText)
      }
    }
  
    // 如果没有匹配，返回 null 或者空字符串
    return "";
  }

  taskUtils.languageOfString = function(input) {
    const chineseRegex = /[\u4e00-\u9fa5]/; // 匹配中文字符的范围
    // const englishRegex = /^[A-Za-z0-9\s,.!?]+$/; // 匹配英文字符和常见标点
  
    if (chineseRegex.test(input)) {
      return 'Chinese';
    } else {
      return 'English';
    }
  }

  // 人名的缩写版本

  // static getPinyin(chineseString) {
  //   return pinyin(chineseString, {
  //     style: pinyin.STYLE_NORMAL, // 普通拼音
  //     heteronym: false // 不考虑多音字
  //   });
  // }

  taskUtils.camelizeString = function(string) {
    return string[0].toUpperCase() + string.slice(1)
  }

  taskUtils.moveStringPropertyToSecondPosition = function(obj, stringProp) {
    // 检查对象是否含有指定的属性
    if (!obj || !obj.hasOwnProperty(stringProp)) {
      return "对象中没有名为 '" + stringProp + "' 的属性";
    }
  
    // 获取对象的所有属性键
    const keys = Object.keys(obj);
    
    // 确保键的数量足够进行移动
    if (keys.length < 2) {
      return "对象中属性数量不足，无法进行移动操作";
    }
    
    // 先保存关联值
    const stringValue = obj[stringProp];
  
    // 创建一个新的对象来重新排序属性
    const newObj = {};
    
    // 将第一个属性放入新对象
    newObj[keys[0]] = obj[keys[0]];
    
    // 将目标属性放到第二个位置
    newObj[stringProp] = stringValue;
  
    // 将剩余的属性放入新对象
    for (let i = 1; i < keys.length; i++) {
      if (keys[i] !== stringProp) {
        newObj[keys[i]] = obj[keys[i]];
      }
    }
  
    return newObj;
  }

  // ===== 名称和文本处理函数 =====

  taskUtils.getAbbreviationsOfEnglishName = function(name) {
    let languageOfName = this.languageOfString(name)
    let Name = {}
    if (languageOfName == "English") {
      let namePartsArr = name.split(" ")
      let namePartsNum = namePartsArr.length
      let firstPart = namePartsArr[0]
      let lastPart = namePartsArr[namePartsNum - 1]
      let middlePart = namePartsArr.slice(1, namePartsNum - 1).join(" ")
      switch (namePartsNum) {
        case 1:
          // Name.language = "English"
          Name.original = name
          break;
        case 2:
          // 以 Kangwei Xia 为例
          // Name.language = "English"
          Name.original = name
          Name.reverse = lastPart + ", " + firstPart // Xia, Kangwei
          Name.abbreviateFirstpart = firstPart[0] + ". " + lastPart // K. Xia
          Name.abbreviateFirstpartAndReverseAddCommaAndDot =  lastPart + ", " + firstPart[0] + "." // Xia, K.
          Name.abbreviateFirstpartAndReverseAddDot =  lastPart + " " + firstPart[0] + "." // Xia K.
          Name.abbreviateFirstpartAndReverse =  lastPart + ", " + firstPart[0] // Xia, K
          break;
        case 3:
          // 以 Louis de Branges 为例
          // Name.language = "English"
          Name.original = name
          Name.removeFirstpart = middlePart + " " + lastPart // de Branges
          Name.removeMiddlepart = firstPart + " " + lastPart // Louis Branges
          Name.abbreviateFirstpart = firstPart[0] + ". " + middlePart + " " + lastPart // L. de Branges
          Name.abbreviateFirstpartAndReverseAddComma = middlePart + " " + lastPart + ", " + firstPart[0]// de Branges, L
          Name.abbreviateFirstpartAndReverseAddCommaAndDot = middlePart + " " + lastPart + ", " + firstPart[0] + "." // de Branges, L.
          Name.abbreviateFirstpartAndLastpartAddDots = firstPart[0] + ". " + middlePart + " " + lastPart[0] + "." // L. de B.
          Name.abbreviateFirstpartAndMiddlepartAddDots = firstPart[0] + ". " + middlePart[0] + ". " + lastPart // L. d. Branges
          Name.abbreviateFirstpartAddDotAndRemoveMiddlepart = firstPart[0] + ". " + lastPart // L. Branges
          Name.abbreviateFirstpartRemoveMiddlepartAndReverseAddCommaAndDot = lastPart + ", " + firstPart[0] + "." // Branges, L.
          Name.abbreviateFirstpartAndMiddlepartAndReverseAddDots = lastPart + " " + middlePart[0] + ". " + firstPart[0] + "." // Branges d. L.
          Name.abbreviateMiddlePartAddDot = firstPart + " " + middlePart[0] + ". " + lastPart  // Louis d. Branges
          break;
        default:
          // Name.language = "English"
          Name.original = name
          break;
      }
      return Name
    }
  }

  taskUtils.getAbbreviationsOfName = function(nameInput) {
    let languageOfName = this.languageOfString(nameInput)
    let Name = {}
    let pinyinStandard
    if (languageOfName == "Chinese") {
      let namePinyinArr = pinyin.pinyin(
        nameInput, 
        {
          style: "normal",
          mode: "surname"
        }
      )
      if (namePinyinArr) {
        let firstPart = namePinyinArr[0].toString()
        let lastPart = namePinyinArr[namePinyinArr.length - 1].toString()
        let middlePart = namePinyinArr[1].toString()
        if (namePinyinArr.length == 2) {
          // 以 lu xun 为例
  
          // Xun Lu
          pinyinStandard = this.camelizeString(lastPart) + " " + this.camelizeString(firstPart) 
          // MNUtil.showHUD(pinyinStandard)
          Name = this.getAbbreviationsOfEnglishName(pinyinStandard)
          Name.originalChineseName = nameInput
          // Name.language = "Chinese"
          // Lu Xun
          Name.pinyinStandardAndReverse =  this.camelizeString(firstPart) + " " + this.camelizeString(lastPart)
  
          Name = this.moveStringPropertyToSecondPosition(Name, "originalChineseName")
  
          
          // // Lu Xun
          // Name.pinyinStandardAndReverse = this.camelizeString(firstPart) + " " + this.camelizeString(lastPart)
          // // luxun
          // Name.pinyinNoSpace = firstPart + lastPart
          // // lu xun
          // Name.pinyinWithSpace = firstPart + " " + lastPart
          // // Lu xun
          // Name.pinyinCamelizeFirstpartWithSpace = this.camelizeString(firstPart) + " " + lastPart 
          // // Luxun
          // Name.pinyinCamelizeFirstpartNoSpace = this.camelizeString(firstPart) + lastPart 
          // // xun, Lu
          // Name.pinyinCamelizeFirstpartAndReverseWithComma = lastPart + ", " + this.camelizeString(firstPart)
          // // LuXun
          // Name.pinyinCamelizeNoSpace = this.camelizeString(firstPart) +  this.camelizeString(lastPart)
          // // xun Lu
          // Name.pinyinCamelizeFirstpartAndReverseWithSpace = lastPart + " " + this.camelizeString(firstPart)
          // // xunLu
          // Name.pinyinCamelizeFirstpartAndReverseNoSpace = lastPart  + this.camelizeString(firstPart)
          // // Xun, Lu
          // Name.pinyinStandardWithComma = this.camelizeString(lastPart) + " " + this.camelizeString(firstPart) 
        } else {
          if (namePinyinArr.length == 3) {
            // 以 xia kang wei 为例
  
            // Kangwei Xia
            pinyinStandard = this.camelizeString(middlePart) + lastPart + " " + this.camelizeString(firstPart)
            Name = this.getAbbreviationsOfEnglishName(pinyinStandard)
            Name.originalChineseName = nameInput
            // Name.language = "Chinese"
            // Xia Kangwei
            Name.pinyinStandardAndReverse =  this.camelizeString(firstPart) + " " + this.camelizeString(middlePart) + lastPart
            Name = this.moveStringPropertyToSecondPosition(Name, "originalChineseName")
          }
        }
      } else {
        MNUtil.showHUD(nameInput + "->" +namePinyinArr)
      }
      return Name
    } else {
      return this.getAbbreviationsOfEnglishName(nameInput)
    }
  }

  // 提取文献卡片中的 bib 条目

  taskUtils.extractBibFromReferenceNote = function(focusNote) {
    let findBibContent = false
    let bibContent
    for (let i = 0; i <= focusNote.comments.length-1; i++) {
      if (
        focusNote.comments[i].text &&
        focusNote.comments[i].text.includes("- `.bib`")
      ) {
        bibContent = focusNote.comments[i].text
        findBibContent = true
        break;
      }
    }
    if (findBibContent) {
      // 定义匹配bib内容的正则表达式，调整换行符处理
      const bibPattern = /```bib\s*\n([\s\S]*?)\n\s*```/;
      // 使用正则表达式提取bib内容
      let bibContentMatch = bibPattern.exec(bibContent);

      // 检查是否匹配到内容
      if (bibContentMatch) {
        // MNUtil.copy(
        return bibContentMatch[1].split('\n').map(line => line.startsWith('  ') ? line.slice(2) : line).join('\n')
        // )
      } else {
        MNUtil.showHUD("No bib content found"); // 如果未找到匹配内容，则抛出错误
      }
    } else {
      MNUtil.showHUD("No '- `bib`' found")
    }
  }

  // 将字符串分割为数组

  taskUtils.splitStringByThreeSeparators = function(string) {
    // 正则表达式匹配中文逗号、中文分号和西文分号
    const separatorRegex = /，\s*|；\s*|;\s*/g;
    
    // 使用split方法按分隔符分割字符串
    const arr = string.split(separatorRegex);
    
    // 去除可能的空字符串元素（如果输入字符串的前后或连续分隔符间有空白）
    return arr.filter(Boolean);
  }

  taskUtils.splitStringByFourSeparators = function(string) {
    // 正则表达式匹配中文逗号、中文分号和西文分号
    const separatorRegex = /，\s*|；\s*|;\s*|,\s*/g;
    
    // 使用split方法按分隔符分割字符串
    const arr = string.split(separatorRegex);
    
    // 去除可能的空字符串元素（如果输入字符串的前后或连续分隔符间有空白）
    return arr.filter(Boolean);
  }

  // 获取数组中从 startNum 作为元素开始的连续序列数组片段
  taskUtils.getContinuousSequenceFromNum = function(arr, startNum) {
    let sequence = []; // 存储连续序列的数组
    let i = arr.indexOf(startNum); // 找到startNum在数组中的索引位置

    // 检查是否找到startNum或者它是否合法
    if (i === -1 || startNum !== arr[i]) {
      return [];
    }
  
    let currentNum = startNum; // 当前处理的数字
  
    // 向后遍历数组寻找连续序列
    while (i < arr.length && arr[i] === currentNum) {
      sequence.push(arr[i]); // 将连续的数字添加到序列中
      currentNum++; // 移动到下一个数字
      i++; // 更新索引位置
    }
  
    return sequence; // 返回找到的连续序列数组
  }

  // 判断文献卡片类型
  taskUtils.getReferenceNoteType = function(note) {
    if (note.noteTitle.includes("论文")) {
      return "paper"
    } else {
      return "book"
    }
  }

  // 寻找子卡片中重复的 "; xxx" 的 xxx
  taskUtils.findDuplicateTitles = function(childNotes) {
    const seen = new Set();
    const duplicates = [];
  
    childNotes.forEach(note => {
      const parts = note.noteTitle.split(';').slice(1);
      parts.forEach(part => {
        const fragment = part.trim();
        if (seen.has(fragment)) {
          duplicates.push(fragment);
        } else {
          seen.add(fragment);
        }
      });
    });

    return duplicates;
  }

  // 将卡片变成非摘录版本
  // 需求：https://github.com/xkwxdyy/mnTextHandler/discussions/3
  /**
    * 1. 复制卡片标题到剪切板
    * 2. 去掉卡片标题
    * 3. 生成卡片的兄弟卡片，标题为复制的内容
    * 4. 将旧卡片合并到新的兄弟卡片中
    */
  /**
    *
    * @param {MbBookNote} parent
    * @param {String} title
    * @param {Number} colorIndex
    */
  taskUtils.convertNoteToNonexcerptVersion = function(note) {
    let config = {}
    let newNote
    let parent
    // let newNoteList = []
    MNUtil.undoGrouping(()=>{
      // focusNotes.forEach(
        // note=>{
          config.title = note.noteTitle
          config.content = ""
          config.markdown = true
          config.color = note.colorIndex
          // 获取旧卡片的父卡片
          parent = note.parentNote
          // 创建新兄弟卡片，标题为旧卡片的标题
          newNote = parent.createChildNote(config)
          // parent.addChild(newnote)
          // 清除旧卡片的标题
          note.noteTitle = ""
          // 将旧卡片合并到新卡片中
          newNote.merge(note)
          newNote.focusInMindMap(0.2)
          // newNoteList.push(newNote)
        // }
      // )
    })
    // return newNoteList
  }

  /* makeCards 的 aux 函数 */
  // 合并第一层模板
  taskUtils.makeCardsAuxFirstLayerTemplate = function(focusNote, focusNoteType) {
    let templateNoteId
    let testIndex = Math.max(focusNote.getCommentIndex("相关链接：", true), focusNote.getCommentIndex("所属：", true))
    // MNUtil.showHUD(testIndex)
    if (testIndex == -1) { // 每种模板卡里都有"相关链接："
      switch (focusNoteType) {
        case "definition":
          templateNoteId = "C1052FDA-3343-45C6-93F6-61DCECF31A6D"
          taskUtils.cloneAndMerge(focusNote, templateNoteId)
          break;
        case "theorem":
          templateNoteId = "C4B464CD-B8C6-42DE-B459-55B48EB31AD8"
          taskUtils.cloneAndMerge(focusNote, templateNoteId)
          break;
        case "example":
          templateNoteId = "C4B464CD-B8C6-42DE-B459-55B48EB31AD8"
          taskUtils.cloneAndMerge(focusNote, templateNoteId)
          break;
        case "antiexample":
          templateNoteId = "E64BDC36-DD8D-416D-88F5-0B3FCBE5D151"
          taskUtils.cloneAndMerge(focusNote, templateNoteId)
          break;
        case "method":
          templateNoteId = "EC68EDFE-580E-4E53-BA1B-875F3BEEFE62"
          taskUtils.cloneAndMerge(focusNote, templateNoteId)
          break;
        case "question":
          templateNoteId = "C4B464CD-B8C6-42DE-B459-55B48EB31AD8"
          taskUtils.cloneAndMerge(focusNote, templateNoteId)
          break;
        case "application":
          templateNoteId = "C4B464CD-B8C6-42DE-B459-55B48EB31AD8"
          taskUtils.cloneAndMerge(focusNote, templateNoteId)
          break;
      }
    }
  }

  taskUtils.makeCardsAuxSecondLayerTemplate = function(focusNote, focusNoteType) {
    let templateNoteId
    let focusNoteColorIndex = focusNote.note.colorIndex
    let testIndexI = focusNote.getCommentIndex("相关概念：", true)
    let testIndexII = focusNote.getCommentIndex("应用：", true)
    let testIndex = Math.max(testIndexI, testIndexII)
    if ([2, 3, 9, 10, 15].includes(focusNoteColorIndex)) {
      if (testIndex == -1){
        if (focusNoteType === "definition") {
          templateNoteId = "9129B736-DBA1-441B-A111-EC0655B6120D"
          taskUtils.cloneAndMerge(focusNote, templateNoteId)
        } else {
          templateNoteId = "3D07C54E-9DF3-4EC9-9122-871760709EB9"
          taskUtils.cloneAndMerge(focusNote, templateNoteId)
        }
      }
    }
  }

  /**
   * 消除卡片内容，保留文字评论
   * 夏大鱼羊
   */
  taskUtils.clearContentKeepMarkdownText = function(focusNote) {
    let focusNoteComments = focusNote.note.comments
    let focusNoteCommentLength = focusNoteComments.length
    let comment
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "请确认",
      "只保留 Markdown 文字吗？\n注意 Html 评论也会被清除",
      0,
      "点错了",
      ["确定"],
      (alert, buttonIndex) => {
        if (buttonIndex == 1) {
          MNUtil.undoGrouping(()=>{
            MNUtil.copy(focusNote.noteTitle)
            focusNote.noteTitle = ""
            // 从最后往上删除，就不会出现前面删除后干扰后面的 index 的情况
            for (let i = focusNoteCommentLength-1; i >= 0; i--) {
              comment = focusNoteComments[i]
              if (
                (comment.type !== "TextNote") || 
                (
                  (comment.type !== "PaintNote") && 
                  (
                    (comment.text.includes("marginnote4app")) 
                    || 
                    (comment.text.includes("marginnote3app"))
                  )
                ) 
              ) {
                focusNote.removeCommentByIndex(i)
              }
            }
          })
        }
      }
    )
  }

  /**
   * 把卡片中的 HtmlNote 的内容转化为 Markdown 语法
   * 夏大鱼羊
   */
  taskUtils.convetHtmlToMarkdown = function(focusNote){
    let focusNoteComments = focusNote.note.comments
    focusNoteComments.forEach((comment, index) => {
      if (comment.type == "HtmlNote") {
        let content = comment.text
        let markdownContent = '<span style="font-weight: bold; color: white; background-color: #0096ff; font-size: 1.15em; padding-top: 5px; padding-bottom: 5px">' + content + '</span>'
        focusNote.removeCommentByIndex(index)
        focusNote.appendMarkdownComment(markdownContent, index)
      }
    })
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
    // 调用原始的 init 方法
    originalInit.call(this, mainPath)
    
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
  if (typeof MNUtil !== "undefined" && MNUtil.log) {
    MNUtil.log("❌ 加载扩展失败: " + error);
  }
}