/**
 * 任务数据模型
 * 负责任务的创建、读取、更新、删除等核心操作
 */

// 使用传统函数方式创建 TaskModel，而不是 ES6 class
function TaskModel(config) {
  var self = this;
  
  self.config = config || {
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
TaskModel.prototype.createTask = function(taskData) {
  var self = this;
  
  if (typeof MNUtil === "undefined" || typeof MNNote === "undefined") {
    throw new Error("MNUtils 未加载");
  }
  
  var title = taskData.title;
  var description = taskData.description || "";
  var dueDate = taskData.dueDate || null;
  var priority = taskData.priority || "normal";
  var parentTaskId = taskData.parentTaskId || null;
  var bindingNoteId = taskData.bindingNoteId || null;
  
  var taskNote = null;
  
  MNUtil.undoGrouping(function() {
    try {
      // 获取当前笔记本
      var currentNotebook = MNUtil.currentNotebook;
      if (!currentNotebook) {
        throw new Error("请先打开笔记本");
      }
      
      // 创建任务卡片
      var prefix = parentTaskId ? self.config.subTaskPrefix : self.config.taskPrefix;
      taskNote = MNNote.createWithTitleNotebook(
        prefix + title,
        currentNotebook
      );
      
      if (taskNote) {
        // 设置初始颜色
        taskNote.colorIndex = self.config.colorMapping.pending;
        
        // 添加任务元数据
        self.updateTaskMetadata(taskNote, {
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
          var parentTask = MNNote.new(parentTaskId);
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
};

/**
 * 获取所有任务
 * @param {String} filter - 筛选条件: all, today, pending, completed
 * @returns {Array} 任务列表
 */
TaskModel.prototype.getAllTasks = function(filter) {
  var self = this;
  filter = filter || "all";
  
  if (typeof MNUtil === "undefined" || typeof MNNote === "undefined") {
    return [];
  }
  
  var tasks = [];
  var notebook = MNUtil.currentNotebook;
  if (!notebook) return tasks;
  
  // 遍历笔记本中的所有卡片
  var allNotes = notebook.notes;
  if (!allNotes) return tasks;
  
  for (var i = 0; i < allNotes.length; i++) {
    var note = allNotes[i];
    if (self.isTask(note)) {
      var taskData = self.parseTaskData(note);
      
      // 根据筛选条件过滤
      switch (filter) {
        case "today":
          if (note.tags && note.tags.includes(self.config.todayTag)) {
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
          if (self.isOverdue(taskData)) {
            tasks.push(taskData);
          }
          break;
        default:
          tasks.push(taskData);
      }
    }
  }
  
  // 排序：优先级高的、今日任务、截止日期近的排在前面
  tasks.sort(function(a, b) {
    // 今日任务优先
    if (a.isToday && !b.isToday) return -1;
    if (!a.isToday && b.isToday) return 1;
    
    // 紧急程度
    var priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
    var aPriority = priorityOrder[a.priority] || 2;
    var bPriority = priorityOrder[b.priority] || 2;
    if (aPriority !== bPriority) return aPriority - bPriority;
    
    // 截止日期
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    
    return 0;
  });
  
  return tasks;
};

/**
 * 更新任务
 * @param {String} taskId - 任务ID
 * @param {Object} updates - 更新的数据
 */
TaskModel.prototype.updateTask = function(taskId, updates) {
  var self = this;
  
  if (typeof MNUtil === "undefined" || typeof MNNote === "undefined") {
    throw new Error("MNUtils 未加载");
  }
  
  var taskNote = MNNote.new(taskId);
  if (!taskNote) {
    throw new Error("任务不存在");
  }
  
  MNUtil.undoGrouping(function() {
    // 更新进度
    if ('progress' in updates) {
      self.updateTaskProgress(taskNote, updates.progress);
    }
    
    // 更新状态
    if ('status' in updates) {
      self.updateTaskStatus(taskNote, updates.status);
    }
    
    // 更新截止日期
    if ('dueDate' in updates) {
      self.updateCommentByPrefix(taskNote, "[截止]", "[截止] " + updates.dueDate);
    }
    
    // 更新优先级
    if ('priority' in updates) {
      self.updateTaskPriority(taskNote, updates.priority);
    }
    
    // 更新标题
    if ('title' in updates) {
      var prefix = taskNote.noteTitle.startsWith(self.config.subTaskPrefix) 
        ? self.config.subTaskPrefix 
        : self.config.taskPrefix;
      taskNote.noteTitle = prefix + updates.title;
    }
  });
};

/**
 * 删除任务
 * @param {String} taskId - 任务ID
 * @param {Boolean} includeSubTasks - 是否同时删除子任务
 */
TaskModel.prototype.deleteTask = function(taskId, includeSubTasks) {
  var self = this;
  includeSubTasks = includeSubTasks || false;
  
  if (typeof MNUtil === "undefined" || typeof MNNote === "undefined") {
    throw new Error("MNUtils 未加载");
  }
  
  var taskNote = MNNote.new(taskId);
  if (!taskNote) {
    throw new Error("任务不存在");
  }
  
  MNUtil.undoGrouping(function() {
    if (includeSubTasks && taskNote.childNotes) {
      // 递归删除所有子任务
      for (var i = 0; i < taskNote.childNotes.length; i++) {
        var child = taskNote.childNotes[i];
        if (self.isTask(child)) {
          self.deleteTask(child.noteId, true);
        }
      }
    }
    
    // 删除任务本身
    taskNote.delete();
  });
};

/**
 * 获取任务的子任务
 * @param {String} taskId - 父任务ID
 * @returns {Array} 子任务列表
 */
TaskModel.prototype.getSubTasks = function(taskId) {
  var self = this;
  var taskNote = MNNote.new(taskId);
  if (!taskNote || !taskNote.childNotes) return [];
  
  var subTasks = [];
  for (var i = 0; i < taskNote.childNotes.length; i++) {
    var child = taskNote.childNotes[i];
    if (self.isTask(child)) {
      subTasks.push(self.parseTaskData(child));
    }
  }
  
  return subTasks;
};

/**
 * 更新任务进度
 * @param {MNNote} taskNote - 任务卡片
 * @param {Number} progress - 进度百分比
 */
TaskModel.prototype.updateTaskProgress = function(taskNote, progress) {
  var self = this;
  
  // 更新进度评论
  self.updateCommentByPrefix(taskNote, "[进度]", "[进度] " + progress + "%");
  
  // 根据进度自动更新状态
  if (progress === 0) {
    self.updateTaskStatus(taskNote, "pending");
  } else if (progress === 100) {
    self.updateTaskStatus(taskNote, "completed");
  } else {
    self.updateTaskStatus(taskNote, "inProgress");
  }
  
  // 如果有子任务，计算总进度
  if (taskNote.childNotes && taskNote.childNotes.length > 0) {
    self.updateParentProgress(taskNote);
  }
};

/**
 * 更新任务状态
 * @param {MNNote} taskNote - 任务卡片
 * @param {String} status - 状态: pending, inProgress, completed
 */
TaskModel.prototype.updateTaskStatus = function(taskNote, status) {
  var self = this;
  
  var statusText = {
    pending: "待办",
    inProgress: "进行中",
    completed: "已完成",
    overdue: "已过期"
  };
  
  // 更新状态评论
  self.updateCommentByPrefix(taskNote, "[状态]", "[状态] " + statusText[status]);
  
  // 更新颜色
  taskNote.colorIndex = self.config.colorMapping[status];
  
  // 如果完成，添加完成时间
  if (status === "completed") {
    var existingComplete = self.findCommentByPrefix(taskNote, "[完成]");
    if (!existingComplete) {
      taskNote.appendTextComment("[完成] " + new Date().toLocaleDateString());
    }
  }
};

/**
 * 更新任务优先级
 * @param {MNNote} taskNote - 任务卡片
 * @param {String} priority - 优先级: urgent, high, normal, low
 */
TaskModel.prototype.updateTaskPriority = function(taskNote, priority) {
  var self = this;
  
  // 移除所有优先级标签
  var priorityTags = ["#紧急", "#高优先级", "#低优先级"];
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
  self.updateCommentByPrefix(taskNote, "[优先级]", "[优先级] " + priority);
};

/**
 * 计算并更新父任务的进度
 * @param {MNNote} parentTask - 父任务卡片
 */
TaskModel.prototype.updateParentProgress = function(parentTask) {
  var self = this;
  var subTasks = self.getSubTasks(parentTask.noteId);
  if (subTasks.length === 0) return;
  
  var totalProgress = 0;
  for (var i = 0; i < subTasks.length; i++) {
    totalProgress += subTasks[i].progress || 0;
  }
  
  var averageProgress = Math.round(totalProgress / subTasks.length);
  self.updateTaskProgress(parentTask, averageProgress);
};

/**
 * 更新任务元数据
 * @param {MNNote} taskNote - 任务卡片
 * @param {Object} metadata - 元数据
 */
TaskModel.prototype.updateTaskMetadata = function(taskNote, metadata) {
  var self = this;
  
  if (metadata.progress !== undefined) {
    self.updateCommentByPrefix(taskNote, "[进度]", "[进度] " + metadata.progress + "%");
  }
  
  if (metadata.status) {
    var statusText = {
      pending: "待办",
      inProgress: "进行中",
      completed: "已完成",
      overdue: "已过期"
    };
    self.updateCommentByPrefix(taskNote, "[状态]", "[状态] " + statusText[metadata.status]);
  }
  
  if (metadata.startDate) {
    self.updateCommentByPrefix(taskNote, "[开始]", "[开始] " + new Date(metadata.startDate).toLocaleDateString());
  }
  
  if (metadata.dueDate) {
    self.updateCommentByPrefix(taskNote, "[截止]", "[截止] " + new Date(metadata.dueDate).toLocaleDateString());
  }
  
  if (metadata.priority) {
    self.updateCommentByPrefix(taskNote, "[优先级]", "[优先级] " + metadata.priority);
  }
  
  if (metadata.bindingNoteId) {
    self.updateCommentByPrefix(taskNote, "[绑定]", "[绑定] marginnote4app://note/" + metadata.bindingNoteId);
  }
};

// === 工具方法 ===

/**
 * 判断卡片是否是任务
 * @param {MNNote} note - 卡片
 * @returns {Boolean}
 */
TaskModel.prototype.isTask = function(note) {
  var self = this;
  if (!note || !note.noteTitle) return false;
  return note.noteTitle.startsWith(self.config.taskPrefix) || 
         note.noteTitle.startsWith(self.config.subTaskPrefix);
};

/**
 * 判断任务是否过期
 * @param {Object} taskData - 任务数据
 * @returns {Boolean}
 */
TaskModel.prototype.isOverdue = function(taskData) {
  if (!taskData.dueDate || taskData.status === "completed") return false;
  return new Date(taskData.dueDate) < new Date();
};

/**
 * 解析任务数据
 * @param {MNNote} taskNote - 任务卡片
 * @returns {Object} 任务数据对象
 */
TaskModel.prototype.parseTaskData = function(taskNote) {
  var self = this;
  
  var taskData = {
    id: taskNote.noteId,
    title: taskNote.noteTitle.replace(self.config.taskPrefix, "").replace(self.config.subTaskPrefix, ""),
    isSubTask: taskNote.noteTitle.startsWith(self.config.subTaskPrefix),
    colorIndex: taskNote.colorIndex,
    tags: taskNote.tags || [],
    isToday: taskNote.tags && taskNote.tags.includes(self.config.todayTag),
    childCount: 0,
    parentId: taskNote.parentNote ? taskNote.parentNote.noteId : null
  };
  
  // 统计子任务数量
  if (taskNote.childNotes) {
    for (var i = 0; i < taskNote.childNotes.length; i++) {
      if (self.isTask(taskNote.childNotes[i])) {
        taskData.childCount++;
      }
    }
  }
  
  // 解析评论中的元数据
  if (taskNote.comments) {
    for (var j = 0; j < taskNote.comments.length; j++) {
      var comment = taskNote.comments[j];
      if (comment.text) {
        if (comment.text.startsWith("[进度]")) {
          var match = comment.text.match(/\d+/);
          taskData.progress = match ? parseInt(match[0]) : 0;
        } else if (comment.text.startsWith("[状态]")) {
          var status = comment.text.replace("[状态] ", "");
          taskData.status = self.parseStatus(status);
        } else if (comment.text.startsWith("[开始]")) {
          taskData.startDate = comment.text.replace("[开始] ", "");
        } else if (comment.text.startsWith("[截止]")) {
          taskData.dueDate = comment.text.replace("[截止] ", "");
        } else if (comment.text.startsWith("[完成]")) {
          taskData.completedDate = comment.text.replace("[完成] ", "");
        } else if (comment.text.startsWith("[优先级]")) {
          taskData.priority = comment.text.replace("[优先级] ", "");
        } else if (comment.text.startsWith("[绑定]")) {
          var bindingUrl = comment.text.replace("[绑定] ", "");
          var bindingMatch = bindingUrl.match(/note\/([A-F0-9-]+)/);
          taskData.bindingNoteId = bindingMatch ? bindingMatch[1] : null;
        } else if (comment.text.startsWith("[描述]")) {
          taskData.description = comment.text.replace("[描述] ", "");
        }
      }
    }
  }
  
  // 设置默认值
  taskData.progress = taskData.progress || 0;
  taskData.status = taskData.status || "pending";
  taskData.priority = taskData.priority || "normal";
  
  // 检查是否过期
  if (self.isOverdue(taskData)) {
    taskData.isOverdue = true;
  }
  
  return taskData;
};

/**
 * 解析状态文本
 * @param {String} statusText - 状态文本
 * @returns {String} 状态代码
 */
TaskModel.prototype.parseStatus = function(statusText) {
  var statusMap = {
    "待办": "pending",
    "进行中": "inProgress",
    "已完成": "completed",
    "已过期": "overdue"
  };
  return statusMap[statusText] || "pending";
};

/**
 * 更新特定前缀的评论
 * @param {MNNote} note - 卡片
 * @param {String} prefix - 评论前缀
 * @param {String} newComment - 新评论内容
 */
TaskModel.prototype.updateCommentByPrefix = function(note, prefix, newComment) {
  var self = this;
  if (!note || !note.comments) return;
  
  var found = false;
  for (var i = 0; i < note.comments.length; i++) {
    var comment = note.comments[i];
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
};

/**
 * 查找特定前缀的评论
 * @param {MNNote} note - 卡片
 * @param {String} prefix - 评论前缀
 * @returns {String|null} 评论内容
 */
TaskModel.prototype.findCommentByPrefix = function(note, prefix) {
  if (!note || !note.comments) return null;
  
  for (var i = 0; i < note.comments.length; i++) {
    var comment = note.comments[i];
    if (comment.text && comment.text.startsWith(prefix)) {
      return comment.text;
    }
  }
  
  return null;
};

// 在 MarginNote 环境中注册到全局
// 确保全局可访问