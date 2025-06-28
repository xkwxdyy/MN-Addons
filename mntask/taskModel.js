/**
 * 任务数据模型
 * 负责任务的创建、读取、更新、删除等核心操作
 */

class TaskModel {
  constructor(config) {
    this.config = config || {
      taskPrefix: "【任务】",
      subTaskPrefix: "【子任务】",
      todayTag: "#今日任务",
      colorMapping: {
        pending: 13,      // 灰色 - 待办
        inProgress: 6,    // 蓝色 - 进行中
        completed: 5,     // 绿色 - 已完成
        overdue: 7        // 红色 - 已过期
      }
    };
  }
  
  /**
   * 创建新任务
   * @param {Object} taskData - 任务数据
   * @returns {MNNote} 创建的任务卡片
   */
  createTask(taskData) {
    if (typeof MNUtil === "undefined" || typeof MNNote === "undefined") {
      throw new Error("MNUtils 未加载");
    }
    
    const {
      title,
      description = "",
      dueDate = null,
      priority = "normal",
      parentTaskId = null,
      bindingNoteId = null
    } = taskData;
    
    let taskNote = null;
    
    MNUtil.undoGrouping(() => {
      try {
        // 获取当前笔记本
        const currentNotebook = MNUtil.currentNotebook;
        if (!currentNotebook) {
          throw new Error("请先打开笔记本");
        }
        
        // 创建任务卡片
        const prefix = parentTaskId ? this.config.subTaskPrefix : this.config.taskPrefix;
        taskNote = MNNote.createWithTitleNotebook(
          prefix + title,
          currentNotebook
        );
        
        if (taskNote) {
          // 设置初始颜色
          taskNote.colorIndex = this.config.colorMapping.pending;
          
          // 添加任务元数据
          this.updateTaskMetadata(taskNote, {
            progress: 0,
            status: "pending",
            startDate: new Date().toISOString(),
            dueDate: dueDate,
            priority: priority,
            bindingNoteId: bindingNoteId
          });
          
          // 如果有描述，添加为评论
          if (description) {
            taskNote.appendTextComment("[描述] " + description);
          }
          
          // 如果是子任务，添加到父任务下
          if (parentTaskId) {
            const parentTask = MNNote.new(parentTaskId);
            if (parentTask) {
              parentTask.addChild(taskNote);
            }
          }
          
          // 根据优先级添加标签
          if (priority === "high") {
            taskNote.appendTags(["#高优先级"]);
          } else if (priority === "urgent") {
            taskNote.appendTags(["#紧急"]);
          }
        }
      } catch (error) {
        MNUtil.showHUD("❌ 创建任务失败: " + error.message);
        throw error;
      }
    });
    
    return taskNote;
  }
  
  /**
   * 获取所有任务
   * @param {String} filter - 筛选条件: all, today, pending, completed
   * @returns {Array} 任务列表
   */
  getAllTasks(filter = "all") {
    if (typeof MNUtil === "undefined" || typeof MNNote === "undefined") {
      return [];
    }
    
    const tasks = [];
    const notebook = MNUtil.currentNotebook;
    if (!notebook) return tasks;
    
    // 遍历笔记本中的所有卡片
    const allNotes = notebook.notes;
    if (!allNotes) return tasks;
    
    allNotes.forEach(note => {
      if (this.isTask(note)) {
        const taskData = this.parseTaskData(note);
        
        // 根据筛选条件过滤
        switch (filter) {
          case "today":
            if (note.tags && note.tags.includes(this.config.todayTag)) {
              tasks.push(taskData);
            }
            break;
          case "pending":
            if (taskData.status === "pending" || taskData.status === "inProgress") {
              tasks.push(taskData);
            }
            break;
          case "completed":
            if (taskData.status === "completed") {
              tasks.push(taskData);
            }
            break;
          case "overdue":
            if (this.isOverdue(taskData)) {
              tasks.push(taskData);
            }
            break;
          default:
            tasks.push(taskData);
        }
      }
    });
    
    // 排序：优先级高的、今日任务、截止日期近的排在前面
    tasks.sort((a, b) => {
      // 今日任务优先
      if (a.isToday && !b.isToday) return -1;
      if (!a.isToday && b.isToday) return 1;
      
      // 紧急程度
      const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
      const aPriority = priorityOrder[a.priority] || 2;
      const bPriority = priorityOrder[b.priority] || 2;
      if (aPriority !== bPriority) return aPriority - bPriority;
      
      // 截止日期
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      
      return 0;
    });
    
    return tasks;
  }
  
  /**
   * 更新任务
   * @param {String} taskId - 任务ID
   * @param {Object} updates - 更新的数据
   */
  updateTask(taskId, updates) {
    if (typeof MNUtil === "undefined" || typeof MNNote === "undefined") {
      throw new Error("MNUtils 未加载");
    }
    
    const taskNote = MNNote.new(taskId);
    if (!taskNote) {
      throw new Error("任务不存在");
    }
    
    MNUtil.undoGrouping(() => {
      // 更新进度
      if ('progress' in updates) {
        this.updateTaskProgress(taskNote, updates.progress);
      }
      
      // 更新状态
      if ('status' in updates) {
        this.updateTaskStatus(taskNote, updates.status);
      }
      
      // 更新截止日期
      if ('dueDate' in updates) {
        this.updateCommentByPrefix(taskNote, "[截止]", "[截止] " + updates.dueDate);
      }
      
      // 更新优先级
      if ('priority' in updates) {
        this.updateTaskPriority(taskNote, updates.priority);
      }
      
      // 更新标题
      if ('title' in updates) {
        const prefix = taskNote.noteTitle.startsWith(this.config.subTaskPrefix) 
          ? this.config.subTaskPrefix 
          : this.config.taskPrefix;
        taskNote.noteTitle = prefix + updates.title;
      }
    });
  }
  
  /**
   * 删除任务
   * @param {String} taskId - 任务ID
   * @param {Boolean} includeSubTasks - 是否同时删除子任务
   */
  deleteTask(taskId, includeSubTasks = false) {
    if (typeof MNUtil === "undefined" || typeof MNNote === "undefined") {
      throw new Error("MNUtils 未加载");
    }
    
    const taskNote = MNNote.new(taskId);
    if (!taskNote) {
      throw new Error("任务不存在");
    }
    
    MNUtil.undoGrouping(() => {
      if (includeSubTasks) {
        // 递归删除所有子任务
        taskNote.childNotes.forEach(child => {
          if (this.isTask(child)) {
            this.deleteTask(child.noteId, true);
          }
        });
      }
      
      // 删除任务本身
      taskNote.delete();
    });
  }
  
  /**
   * 获取任务的子任务
   * @param {String} taskId - 父任务ID
   * @returns {Array} 子任务列表
   */
  getSubTasks(taskId) {
    const taskNote = MNNote.new(taskId);
    if (!taskNote || !taskNote.childNotes) return [];
    
    const subTasks = [];
    taskNote.childNotes.forEach(child => {
      if (this.isTask(child)) {
        subTasks.push(this.parseTaskData(child));
      }
    });
    
    return subTasks;
  }
  
  /**
   * 更新任务进度
   * @param {MNNote} taskNote - 任务卡片
   * @param {Number} progress - 进度百分比
   */
  updateTaskProgress(taskNote, progress) {
    // 更新进度评论
    this.updateCommentByPrefix(taskNote, "[进度]", "[进度] " + progress + "%");
    
    // 根据进度自动更新状态
    if (progress === 0) {
      this.updateTaskStatus(taskNote, "pending");
    } else if (progress === 100) {
      this.updateTaskStatus(taskNote, "completed");
    } else {
      this.updateTaskStatus(taskNote, "inProgress");
    }
    
    // 如果有子任务，计算总进度
    if (taskNote.childNotes && taskNote.childNotes.length > 0) {
      this.updateParentProgress(taskNote);
    }
  }
  
  /**
   * 更新任务状态
   * @param {MNNote} taskNote - 任务卡片
   * @param {String} status - 状态: pending, inProgress, completed
   */
  updateTaskStatus(taskNote, status) {
    const statusText = {
      pending: "待办",
      inProgress: "进行中",
      completed: "已完成",
      overdue: "已过期"
    };
    
    // 更新状态评论
    this.updateCommentByPrefix(taskNote, "[状态]", "[状态] " + statusText[status]);
    
    // 更新颜色
    taskNote.colorIndex = this.config.colorMapping[status];
    
    // 如果完成，添加完成时间
    if (status === "completed") {
      const existingComplete = this.findCommentByPrefix(taskNote, "[完成]");
      if (!existingComplete) {
        taskNote.appendTextComment("[完成] " + new Date().toLocaleDateString());
      }
    }
  }
  
  /**
   * 更新任务优先级
   * @param {MNNote} taskNote - 任务卡片
   * @param {String} priority - 优先级: urgent, high, normal, low
   */
  updateTaskPriority(taskNote, priority) {
    // 移除所有优先级标签
    const priorityTags = ["#紧急", "#高优先级", "#低优先级"];
    taskNote.removeTags(priorityTags);
    
    // 添加新的优先级标签
    switch (priority) {
      case "urgent":
        taskNote.appendTags(["#紧急"]);
        break;
      case "high":
        taskNote.appendTags(["#高优先级"]);
        break;
      case "low":
        taskNote.appendTags(["#低优先级"]);
        break;
    }
    
    // 更新评论
    this.updateCommentByPrefix(taskNote, "[优先级]", "[优先级] " + priority);
  }
  
  /**
   * 计算并更新父任务的进度
   * @param {MNNote} parentTask - 父任务卡片
   */
  updateParentProgress(parentTask) {
    const subTasks = this.getSubTasks(parentTask.noteId);
    if (subTasks.length === 0) return;
    
    let totalProgress = 0;
    subTasks.forEach(subTask => {
      totalProgress += subTask.progress || 0;
    });
    
    const averageProgress = Math.round(totalProgress / subTasks.length);
    this.updateTaskProgress(parentTask, averageProgress);
  }
  
  /**
   * 更新任务元数据
   * @param {MNNote} taskNote - 任务卡片
   * @param {Object} metadata - 元数据
   */
  updateTaskMetadata(taskNote, metadata) {
    if (metadata.progress !== undefined) {
      this.updateCommentByPrefix(taskNote, "[进度]", "[进度] " + metadata.progress + "%");
    }
    
    if (metadata.status) {
      const statusText = {
        pending: "待办",
        inProgress: "进行中",
        completed: "已完成",
        overdue: "已过期"
      };
      this.updateCommentByPrefix(taskNote, "[状态]", "[状态] " + statusText[metadata.status]);
    }
    
    if (metadata.startDate) {
      this.updateCommentByPrefix(taskNote, "[开始]", "[开始] " + new Date(metadata.startDate).toLocaleDateString());
    }
    
    if (metadata.dueDate) {
      this.updateCommentByPrefix(taskNote, "[截止]", "[截止] " + new Date(metadata.dueDate).toLocaleDateString());
    }
    
    if (metadata.priority) {
      this.updateCommentByPrefix(taskNote, "[优先级]", "[优先级] " + metadata.priority);
    }
    
    if (metadata.bindingNoteId) {
      this.updateCommentByPrefix(taskNote, "[绑定]", "[绑定] marginnote4app://note/" + metadata.bindingNoteId);
    }
  }
  
  // === 工具方法 ===
  
  /**
   * 判断卡片是否是任务
   * @param {MNNote} note - 卡片
   * @returns {Boolean}
   */
  isTask(note) {
    if (!note || !note.noteTitle) return false;
    return note.noteTitle.startsWith(this.config.taskPrefix) || 
           note.noteTitle.startsWith(this.config.subTaskPrefix);
  }
  
  /**
   * 判断任务是否过期
   * @param {Object} taskData - 任务数据
   * @returns {Boolean}
   */
  isOverdue(taskData) {
    if (!taskData.dueDate || taskData.status === "completed") return false;
    return new Date(taskData.dueDate) < new Date();
  }
  
  /**
   * 解析任务数据
   * @param {MNNote} taskNote - 任务卡片
   * @returns {Object} 任务数据对象
   */
  parseTaskData(taskNote) {
    const taskData = {
      id: taskNote.noteId,
      title: taskNote.noteTitle.replace(this.config.taskPrefix, "").replace(this.config.subTaskPrefix, ""),
      isSubTask: taskNote.noteTitle.startsWith(this.config.subTaskPrefix),
      colorIndex: taskNote.colorIndex,
      tags: taskNote.tags || [],
      isToday: taskNote.tags && taskNote.tags.includes(this.config.todayTag),
      childCount: 0,
      parentId: taskNote.parentNote ? taskNote.parentNote.noteId : null
    };
    
    // 统计子任务数量
    if (taskNote.childNotes) {
      taskNote.childNotes.forEach(child => {
        if (this.isTask(child)) {
          taskData.childCount++;
        }
      });
    }
    
    // 解析评论中的元数据
    if (taskNote.comments) {
      taskNote.comments.forEach(comment => {
        if (comment.text) {
          if (comment.text.startsWith("[进度]")) {
            const match = comment.text.match(/\d+/);
            taskData.progress = match ? parseInt(match[0]) : 0;
          } else if (comment.text.startsWith("[状态]")) {
            const status = comment.text.replace("[状态] ", "");
            taskData.status = this.parseStatus(status);
          } else if (comment.text.startsWith("[开始]")) {
            taskData.startDate = comment.text.replace("[开始] ", "");
          } else if (comment.text.startsWith("[截止]")) {
            taskData.dueDate = comment.text.replace("[截止] ", "");
          } else if (comment.text.startsWith("[完成]")) {
            taskData.completedDate = comment.text.replace("[完成] ", "");
          } else if (comment.text.startsWith("[优先级]")) {
            taskData.priority = comment.text.replace("[优先级] ", "");
          } else if (comment.text.startsWith("[绑定]")) {
            const bindingUrl = comment.text.replace("[绑定] ", "");
            const match = bindingUrl.match(/note\/([A-F0-9-]+)/);
            taskData.bindingNoteId = match ? match[1] : null;
          } else if (comment.text.startsWith("[描述]")) {
            taskData.description = comment.text.replace("[描述] ", "");
          }
        }
      });
    }
    
    // 设置默认值
    taskData.progress = taskData.progress || 0;
    taskData.status = taskData.status || "pending";
    taskData.priority = taskData.priority || "normal";
    
    // 检查是否过期
    if (this.isOverdue(taskData)) {
      taskData.isOverdue = true;
    }
    
    return taskData;
  }
  
  /**
   * 解析状态文本
   * @param {String} statusText - 状态文本
   * @returns {String} 状态代码
   */
  parseStatus(statusText) {
    const statusMap = {
      "待办": "pending",
      "进行中": "inProgress",
      "已完成": "completed",
      "已过期": "overdue"
    };
    return statusMap[statusText] || "pending";
  }
  
  /**
   * 更新特定前缀的评论
   * @param {MNNote} note - 卡片
   * @param {String} prefix - 评论前缀
   * @param {String} newComment - 新评论内容
   */
  updateCommentByPrefix(note, prefix, newComment) {
    if (!note || !note.comments) return;
    
    let found = false;
    for (let i = 0; i < note.comments.length; i++) {
      const comment = note.comments[i];
      if (comment.text && comment.text.startsWith(prefix)) {
        // 找到了，更新评论
        note.removeCommentByIndex(i);
        note.appendTextComment(newComment);
        found = true;
        break;
      }
    }
    
    if (!found) {
      // 没找到，直接添加
      note.appendTextComment(newComment);
    }
  }
  
  /**
   * 查找特定前缀的评论
   * @param {MNNote} note - 卡片
   * @param {String} prefix - 评论前缀
   * @returns {String|null} 评论内容
   */
  findCommentByPrefix(note, prefix) {
    if (!note || !note.comments) return null;
    
    for (let i = 0; i < note.comments.length; i++) {
      const comment = note.comments[i];
      if (comment.text && comment.text.startsWith(prefix)) {
        return comment.text;
      }
    }
    
    return null;
  }
}

// 在 MarginNote 环境中注册到全局
// ES6 类在文件顶部已定义，这里确保全局可访问