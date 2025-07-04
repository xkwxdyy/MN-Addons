/**
 * task 的 Actions 注册表
 */

// 使用 MNTask 专用命名空间，避免与 MNToolbar 冲突
if (typeof MNTaskGlobal === "undefined") {
  var MNTaskGlobal = {};
}

// 初始化 customActions 对象
MNTaskGlobal.customActions = MNTaskGlobal.customActions || {};

// 存储主插件实例的引用
MNTaskGlobal.mainPlugin = null;


/**
 * 注册自定义 action
 * @param {string} actionName - action 名称
 * @param {Function} handler - 处理函数
 */
MNTaskGlobal.registerCustomAction = function (actionName, handler) {
  MNTaskGlobal.customActions[actionName] = handler;
};

/**
 * 执行自定义 action
 * @param {string} actionName - action 名称
 * @param {Object} context - 执行上下文
 * @returns {boolean} - 是否成功执行
 */
MNTaskGlobal.executeCustomAction = async function (actionName, context) {
  if (actionName in MNTaskGlobal.customActions) {
    try {
      await MNTaskGlobal.customActions[actionName](context);
      return true;
    } catch (error) {
      MNUtil.log(`❌ 执行 ${actionName} 失败: ${error.message || error}`);
      MNUtil.showHUD(`执行失败: ${error.message || error}`);
      return false;
    }
  }
  
  MNUtil.log(`❌ 未找到自定义 action: ${actionName}`);
  return false;
};


// 注册所有自定义 actions
function registerAllCustomActions() {
  // taskCardMake - 智能任务制卡
  MNTaskGlobal.registerCustomAction("taskCardMake", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    if (!focusNote) {
      MNUtil.showHUD("请先选择一个笔记");
      return;
    }
    
    // 判断是否已经是任务卡片
    if (MNTaskManager.isTaskCard(focusNote)) {
      // 已经是任务卡片，只更新路径
      MNUtil.undoGrouping(() => {
        MNTaskManager.updateTaskPath(focusNote);
      });
      MNUtil.showHUD("✅ 任务路径已更新");
    } else {
      // 不是任务卡片，需要转换
      await MNTaskManager.convertToTaskCard(focusNote);
      MNUtil.showHUD("✅ 已转换为任务卡片");
    }
  });
  
  // toggleTaskStatusForward - 向前切换任务状态（单击）
  MNTaskGlobal.registerCustomAction("toggleTaskStatusForward", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    if (!focusNote) {
      MNUtil.showHUD("请先选择一个任务");
      return;
    }
    
    // 判断是否是任务卡片
    if (!MNTaskManager.isTaskCard(focusNote)) {
      MNUtil.showHUD("请选择一个任务卡片");
      return;
    }
    
    // 解析当前状态
    const titleParts = MNTaskManager.parseTaskTitle(focusNote.noteTitle);
    const currentStatus = titleParts.status;
    
    // 确定新状态
    let newStatus = currentStatus;
    switch (currentStatus) {
      case "未开始":
        newStatus = "进行中";
        break;
      case "进行中":
        newStatus = "已完成";
        break;
      case "已完成":
        // 询问是否归档
        try {
          const buttonIndex = await MNUtil.confirm("任务归档", "是否将已完成的任务归档？");
          
          if (buttonIndex !== 1) {
            // 用户点击取消（buttonIndex === 0）
            return;
          }
          
          // 用户点击确认（buttonIndex === 1），执行归档
          const completedBoardId = taskConfig.getBoardNoteId('completed');
          
          if (!completedBoardId) {
            MNUtil.showHUD("请先在设置中配置已完成归档区");
            return;
          }
          
          // 获取归档区笔记
          const completedBoardNote = MNNote.new(completedBoardId);
          if (!completedBoardNote) {
            MNUtil.showHUD("无法找到已完成归档区");
            return;
          }
          
          // 移动到归档区
          MNUtil.undoGrouping(() => {
            const success = MNTaskManager.moveTo(focusNote, completedBoardNote);
            if (success) {
              MNUtil.showHUD("✅ 任务已归档");
            } else {
              MNUtil.showHUD("❌ 归档失败");
            }
          });
        } catch (error) {
          MNUtil.showHUD(`归档失败: ${error.message || error}`);
        }
        return;
      default:
        MNUtil.showHUD("未知的任务状态");
        return;
    }
    
    // 更新状态
    MNUtil.undoGrouping(() => {
      MNTaskManager.updateTaskStatus(focusNote, newStatus);
    });
    
    MNUtil.showHUD(`✅ 状态已更新：${currentStatus} → ${newStatus}`);
  });
  
  // toggleTaskStatusBackward - 退回上一个状态（长按菜单）
  MNTaskGlobal.registerCustomAction("toggleTaskStatusBackward", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    if (!focusNote) {
      MNUtil.showHUD("请先选择一个任务");
      return;
    }
    
    // 判断是否是任务卡片
    if (!MNTaskManager.isTaskCard(focusNote)) {
      MNUtil.showHUD("请选择一个任务卡片");
      return;
    }
    
    // 解析当前状态
    const titleParts = MNTaskManager.parseTaskTitle(focusNote.noteTitle);
    const currentStatus = titleParts.status;
    
    // 确定新状态
    let newStatus = currentStatus;
    switch (currentStatus) {
      case "未开始":
        // 保持不变
        MNUtil.showHUD("任务尚未开始");
        return;
      case "进行中":
        newStatus = "未开始";
        break;
      case "已完成":
        newStatus = "进行中";
        break;
      default:
        MNUtil.showHUD("未知的任务状态");
        return;
    }
    
    // 更新状态
    MNUtil.undoGrouping(() => {
      MNTaskManager.updateTaskStatus(focusNote, newStatus);
    });
    
    MNUtil.showHUD(`↩️ 状态已退回：${currentStatus} → ${newStatus}`);
  });
  
  // updateTodayTimeTag
  MNTaskGlobal.registerCustomAction("updateTodayTimeTag", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((focusNote) => {
        taskUtils.updateTodayTimeTag(focusNote);
      });
    });
  });

  // addTodayTimeTag
  MNTaskGlobal.registerCustomAction("addTodayTimeTag", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((focusNote) => {
        taskUtils.addTodayTimeTag(focusNote);
      });
    });
  });

  // updateTimeTag
  MNTaskGlobal.registerCustomAction("updateTimeTag", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((focusNote) => {
        taskUtils.updateTimeTag(focusNote);
      });
    });
  });

  // openTasksFloatMindMap - 打开任务管理脑图
  MNTaskGlobal.registerCustomAction("openTasksFloatMindMap", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    // 获取保存的根目录 ID
    const savedRootNoteId = taskConfig.getRootNoteId();
    
    if (savedRootNoteId) {
      // 验证卡片是否存在
      const rootNote = MNNote.new(savedRootNoteId);
      if (rootNote) {
        // 设置任务管理看板样式
        MNUtil.undoGrouping(() => {
          rootNote.noteTitle = rootNote.noteTitle || "📊 任务管理看板";
          rootNote.colorIndex = 11;  // 深紫色
          if (!rootNote.tags || !rootNote.tags.includes("任务管理")) {
            rootNote.appendTags(["任务管理", "看板"]);
          }
        });
        rootNote.focusInFloatMindMap(0.5);
      } else {
        taskConfig.clearRootNoteId();
        MNUtil.showHUD("❌ 根目录卡片不存在，请在设置中重新配置");
      }
    } else {
      MNUtil.showHUD("请先在设置中配置任务管理根目录\n设置 → Task Board → Paste");
    }
  });

  // OKRNoteMake - OKR 制卡流
  MNTaskGlobal.registerCustomAction("OKRNoteMake", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    try {
      if (!focusNotes || focusNotes.length === 0) {
        MNUtil.showHUD("请先选择一个笔记");
        return;
      }
      
      MNUtil.undoGrouping(() => {
        focusNotes.forEach((focusNote) => {
          try {
            taskUtils.OKRNoteMake(focusNote);
          } catch (error) {
            MNUtil.showHUD(`制卡失败: ${error.message}`);
          }
        });
      });
    } catch (error) {
      MNUtil.addErrorLog(error, "OKRNoteMake", context);
      MNUtil.showHUD(`执行失败: ${error.message}`);
    }
  });

  // undoOKRNoteMake - 回退任务状态
  MNTaskGlobal.registerCustomAction("undoOKRNoteMake", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    try {
      
      if (!focusNotes || focusNotes.length === 0) {
        MNUtil.showHUD("请先选择一个笔记");
        return;
      }
      
      MNUtil.undoGrouping(() => {
        focusNotes.forEach((focusNote) => {
          try {
            taskUtils.OKRNoteMake(focusNote, true);  // undoStatus = true
          } catch (error) {
            MNUtil.showHUD(`回退失败: ${error.message}`);
          }
        });
      });
    } catch (error) {
      MNUtil.addErrorLog(error, "undoOKRNoteMake", context);
      MNUtil.showHUD(`回退失败: ${error.message}`);
    }
  });

  // moveToInbox - 加入 Inbox
  MNTaskGlobal.registerCustomAction("moveToInbox", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    if (!focusNote) {
      MNUtil.showHUD("请先选择要移动的任务");
      return;
    }
    
    // 获取根目录 ID
    const savedRootNoteId = taskConfig.getRootNoteId();
    if (!savedRootNoteId) {
      MNUtil.showHUD("请先在设置中配置任务管理根目录");
      return;
    }
    
    // 获取根目录卡片
    const rootNote = MNNote.new(savedRootNoteId);
    if (!rootNote) {
      taskConfig.clearRootNoteId();
      MNUtil.showHUD("根目录卡片不存在，请重新配置");
      return;
    }
    
    // 查找 Inbox 分区
    const inbox = rootNote.childNotes.find(child =>
      child.tags && child.tags.includes("Inbox")
    );
    
    if (!inbox) {
      // 如果没有 Inbox，创建一个
      MNUtil.undoGrouping(() => {
        const newInbox = rootNote.createChildNote({
          title: "📌 今日聚焦 / Inbox",
          colorIndex: 7  // 橙色
        });
        newInbox.appendTags(["今日聚焦", "Inbox"]);
        newInbox.appendTextComment("待处理任务和今日必做事项");
        
        // 移动任务到新创建的 Inbox
        focusNotes.forEach(note => {
          note.removeFromParent();
          newInbox.addChild(note);
          note.appendTags(["今日"]);
        });
      });
      MNUtil.showHUD("✅ 已创建 Inbox 并添加任务");
    } else {
      // 移动到现有的 Inbox
      MNUtil.undoGrouping(() => {
        focusNotes.forEach(note => {
          note.removeFromParent();
          inbox.addChild(note);
          note.appendTags(["今日"]);
        });
      });
      MNUtil.showHUD("✅ 已加入今日聚焦");
    }
  });

  // openFloatWindowByInboxNote - 浮窗定位今日 Inbox
  MNTaskGlobal.registerCustomAction("openFloatWindowByInboxNote", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    // 获取根目录 ID
    const savedRootNoteId = taskConfig.getRootNoteId();
    if (!savedRootNoteId) {
      MNUtil.showHUD("请先在设置中配置任务管理根目录");
      return;
    }
    
    // 获取根目录卡片
    const rootNote = MNNote.new(savedRootNoteId);
    if (!rootNote) {
      taskConfig.clearRootNoteId();
      MNUtil.showHUD("根目录卡片不存在，请重新配置");
      return;
    }
    
    // 查找 Inbox 分区
    const inbox = rootNote.childNotes.find(child =>
      child.tags && child.tags.includes("Inbox")
    );
    
    if (inbox) {
      inbox.focusInFloatMindMap(0.5);
    } else {
      MNUtil.showHUD("找不到 Inbox 分区，请先使用「加入 Inbox」功能创建");
    }
  });

  // openFloatWindowByInboxNoteOnDate - 浮窗定位指定日期 Inbox
  MNTaskGlobal.registerCustomAction("openFloatWindowByInboxNoteOnDate", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.showHUD("功能开发中：浮窗定位指定日期 Inbox");
  });

  // achieveCards - 归档卡片
  MNTaskGlobal.registerCustomAction("achieveCards", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.showHUD("功能开发中：归档卡片");
  });

  // renewCards - 更新卡片
  MNTaskGlobal.registerCustomAction("renewCards", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.showHUD("功能开发中：更新卡片");
  });

  // getOKRNotesOnToday - 获取今日 OKR 任务
  MNTaskGlobal.registerCustomAction("getOKRNotesOnToday", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.showHUD("功能开发中：获取今日 OKR 任务");
  });

  // ==================== 任务创建相关 ====================
  
  // createOKRTaskFromNote - 从当前卡片创建 OKR 任务
  MNTaskGlobal.registerCustomAction("createOKRTaskFromNote", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    if (!focusNote) {
      MNUtil.showHUD("请先选择一个笔记");
      return;
    }
    
    MNUtil.undoGrouping(() => {
      try {
        // 获取当前笔记的标题作为任务内容
        const taskContent = focusNote.noteTitle || "新任务";
        
        // 使用 MNTaskManager 创建任务
        const taskNote = MNTaskManager.createTask(focusNote, 'task', taskContent, {
          tags: ["今日"]
        });
        
        // 添加今日时间标签
        MNTaskManager.addTimeTag(taskNote, new Date(), true);
        
        // 刷新显示并聚焦
        taskNote.focusInMindMap(0.2);
        
        MNUtil.showHUD("✅ 已创建任务");
      } catch (error) {
        MNUtil.showHUD("创建任务失败：" + error.message);
      }
    });
  });

  // createSubTask - 创建子任务
  MNTaskGlobal.registerCustomAction("createSubTask", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    if (!focusNote) {
      MNUtil.showHUD("请先选择一个任务笔记");
      return;
    }
    
    // 弹窗输入子任务名称
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "创建子任务",
      "请输入子任务名称",
      2,  // 输入框样式
      "取消",
      ["确定"],
      (alert, buttonIndex) => {
        if (buttonIndex === 1) {
          const subtaskName = alert.textFieldAtIndex(0).text;
          if (!subtaskName || subtaskName.trim() === "") {
            MNUtil.showHUD("子任务名称不能为空");
            return;
          }
          
          MNUtil.undoGrouping(() => {
            try {
              // 获取父任务的类型
              const parentType = MNTaskManager.getTaskType(focusNote);
              const taskType = parentType ? parentType.key : 'task';
              
              // 使用 MNTaskManager 创建子任务
              const subtask = MNTaskManager.createTask(focusNote, taskType, subtaskName, {
                tags: ["子任务"]
              });
              
              // 继承父任务的时间标签
              const parentTags = focusNote.tags || [];
              const timeTags = parentTags.filter(tag => 
                tag.match(/^\d{4}\/\d{2}\/\d{2}$/) || tag === "今日"
              );
              if (timeTags.length > 0) {
                subtask.appendTags(timeTags);
              }
              
              // 创建任务链接关系
              MNTaskManager.linkTasks(subtask, focusNote);
              
              // 刷新显示
              focusNote.refresh();
              
              MNUtil.showHUD("✅ 已创建子任务");
            } catch (error) {
              MNUtil.showHUD("创建子任务失败：" + error.message);
            }
          });
        }
      }
    );
  });

  // ==================== 任务状态管理相关 ====================
  
  // setTaskNotStarted - 设置为未开始
  MNTaskGlobal.registerCustomAction("setTaskNotStarted", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((note) => {
        MNTaskManager.updateTaskStatus(note, 'notStarted');
      });
      
      MNUtil.showHUD("✅ 已设置为未开始");
    });
  });

  // setTaskInProgress - 设置为进行中
  MNTaskGlobal.registerCustomAction("setTaskInProgress", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((note) => {
        MNTaskManager.updateTaskStatus(note, 'inProgress');
      });
      
      MNUtil.showHUD("✅ 已设置为进行中");
    });
  });

  // setTaskCompleted - 设置为已完成
  MNTaskGlobal.registerCustomAction("setTaskCompleted", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((note) => {
        MNTaskManager.updateTaskStatus(note, 'completed');
      });
      
      MNUtil.showHUD("✅ 已设置为已完成");
    });
  });

  // ==================== 任务类型设置相关 ====================
  
  // setAsObjective - 设置为目标
  MNTaskGlobal.registerCustomAction("setAsObjective", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((note) => {
        try {
          MNTaskManager.changeTaskType(note, 'objective');
        } catch (error) {
          MNUtil.log("设置任务类型失败：" + error);
        }
      });
      
      MNUtil.showHUD("✅ 已设置为目标(Objective)");
    });
  });

  // setAsKeyResult - 设置为关键结果
  MNTaskGlobal.registerCustomAction("setAsKeyResult", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((note) => {
        try {
          MNTaskManager.changeTaskType(note, 'keyResult');
        } catch (error) {
          MNUtil.log("设置任务类型失败：" + error);
        }
      });
      
      MNUtil.showHUD("✅ 已设置为关键结果(Key Result)");
    });
  });

  // setAsProject - 设置为项目
  MNTaskGlobal.registerCustomAction("setAsProject", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((note) => {
        try {
          MNTaskManager.changeTaskType(note, 'project');
        } catch (error) {
          MNUtil.log("设置任务类型失败：" + error);
        }
      });
      
      MNUtil.showHUD("✅ 已设置为项目(Project)");
    });
  });

  // setAsTask - 设置为任务
  MNTaskGlobal.registerCustomAction("setAsTask", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((note) => {
        try {
          MNTaskManager.changeTaskType(note, 'task');
        } catch (error) {
          MNUtil.log("设置任务类型失败：" + error);
        }
      });
      
      MNUtil.showHUD("✅ 已设置为任务(Task)");
    });
  });

  // ==================== 任务关联相关 ====================
  
  // linkToParentTask - 链接到父任务
  MNTaskGlobal.registerCustomAction("linkToParentTask", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    if (!focusNote) {
      MNUtil.showHUD("请先选择一个任务");
      return;
    }
    
    // 获取当前笔记本中的所有任务
    const notebook = MNNotebook.currentNotebook;
    if (!notebook) {
      MNUtil.showHUD("无法获取当前笔记本");
      return;
    }
    
    // 筛选出可以作为父任务的笔记（OKR类型的任务）
    const allNotes = notebook.notes;
    const potentialParents = allNotes.filter(note => {
      const type = MNTaskManager.getTaskType(note);
      return type && note.noteId !== focusNote.noteId;
    });
    
    if (potentialParents.length === 0) {
      MNUtil.showHUD("没有找到可用的父任务");
      return;
    }
    
    // 创建选择菜单
    const options = potentialParents.map(note => {
      const type = MNTaskManager.getTaskType(note);
      return `[${type.zhName}] ${note.noteTitle}`;
    });
    
    const selectedIndex = await MNUtil.userSelect("选择父任务", "", options);
    if (selectedIndex > 0) { // 0 是取消按钮
      const parentNote = potentialParents[selectedIndex - 1];
      
      MNUtil.undoGrouping(() => {
        MNTaskManager.linkTasks(focusNote, parentNote);
        MNUtil.showHUD("✅ 已链接到父任务");
      });
    }
  });

  // focusParentTask - 定位到父任务
  MNTaskGlobal.registerCustomAction("focusParentTask", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    if (!focusNote) {
      MNUtil.showHUD("请先选择一个任务");
      return;
    }
    
    // 查找父任务链接
    const comments = focusNote.comments;
    let parentTaskId = null;
    
    // 查找父任务信息评论
    const parentCommentIndex = focusNote.getTextCommentIndex("父任务：");
    if (parentCommentIndex !== -1) {
      // 查找链接类型的评论
      for (let i = 0; i < comments.length; i++) {
        const comment = comments[i];
        if (MNComment.getCommentType(comment) === 'linkComment') {
          const linkURL = comment.text;
          if (linkURL && linkURL.includes('marginnote')) {
            parentTaskId = MNUtil.getNoteIdByURL(linkURL);
            break;
          }
        }
      }
    }
    
    // 如果没找到，尝试从父笔记关系查找
    if (!parentTaskId && focusNote.parentNote) {
      const parentType = MNTaskManager.getTaskType(focusNote.parentNote);
      if (parentType) {
        parentTaskId = focusNote.parentNote.noteId;
      }
    }
    
    if (parentTaskId) {
      const parentNote = MNNote.new(parentTaskId);
      if (parentNote) {
        parentNote.focusInMindMap(0.2);
        MNUtil.showHUD("✅ 已定位到父任务");
      } else {
        MNUtil.showHUD("无法找到父任务");
      }
    } else {
      MNUtil.showHUD("当前任务没有父任务");
    }
  });

  // viewTaskPath - 查看任务路径
  MNTaskGlobal.registerCustomAction("viewTaskPath", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    if (!focusNote) {
      MNUtil.showHUD("请先选择一个任务");
      return;
    }
    
    // 获取任务路径
    const path = [];
    let currentNote = focusNote;
    
    while (currentNote) {
      const type = MNTaskManager.getTaskType(currentNote);
      if (type) {
        path.unshift(`[${type.zhName}] ${currentNote.noteTitle}`);
      } else {
        path.unshift(currentNote.noteTitle);
      }
      
      // 查找父任务
      if (currentNote.parentNote) {
        const parentType = MNTaskManager.getTaskType(currentNote.parentNote);
        if (parentType) {
          currentNote = currentNote.parentNote;
        } else {
          break;
        }
      } else {
        break;
      }
    }
    
    // 显示路径
    if (path.length > 0) {
      const pathText = path.join("\n→ ");
      MNUtil.confirm("任务路径", pathText, ["确定"]);
    } else {
      MNUtil.showHUD("无法获取任务路径");
    }
  });

  // ==================== 进度追踪相关 ====================
  
  // updateTaskProgress - 更新任务进度百分比
  MNTaskGlobal.registerCustomAction("updateTaskProgress", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    if (!focusNote) {
      MNUtil.showHUD("请先选择一个任务");
      return;
    }
    
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "更新任务进度",
      "请输入进度百分比 (0-100)",
      2,  // 输入框样式
      "取消",
      ["确定"],
      (alert, buttonIndex) => {
        if (buttonIndex === 1) {
          const progressText = alert.textFieldAtIndex(0).text;
          const percentage = parseInt(progressText);
          
          if (isNaN(percentage)) {
            MNUtil.showHUD("请输入有效的数字");
            return;
          }
          
          MNUtil.undoGrouping(() => {
            try {
              MNTaskManager.updateProgress(focusNote, percentage);
              MNUtil.showHUD(`✅ 进度已更新为 ${percentage}%`);
            } catch (error) {
              MNUtil.showHUD("更新进度失败：" + error.message);
            }
          });
        }
      }
    );
  });

  // viewTaskProgress - 查看当前进度
  MNTaskGlobal.registerCustomAction("viewTaskProgress", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    if (!focusNote) {
      MNUtil.showHUD("请先选择一个任务");
      return;
    }
    
    // 查找进度标签
    const progressTags = focusNote.tags.filter(tag => tag.includes("%进度"));
    let currentProgress = 0;
    
    if (progressTags.length > 0) {
      const match = progressTags[0].match(/(\d+)%进度/);
      if (match) {
        currentProgress = parseInt(match[1]);
      }
    }
    
    // 获取状态信息
    const statusCommentIndex = focusNote.getTextCommentIndex("状态：");
    let status = "未知";
    if (statusCommentIndex !== -1) {
      const statusComment = focusNote.comments[statusCommentIndex];
      const statusMatch = statusComment.text.match(/状态：(.+)/);
      if (statusMatch) {
        status = statusMatch[1];
      }
    }
    
    // 获取任务类型
    const taskType = MNTaskManager.getTaskType(focusNote);
    const typeText = taskType ? taskType.zhName : "任务";
    
    // 创建进度报告
    const report = [
      `任务类型：${typeText}`,
      `当前状态：${status}`,
      `完成进度：${currentProgress}%`,
      "",
      `任务名称：${focusNote.noteTitle}`
    ].join("\n");
    
    MNUtil.confirm("任务进度", report, ["确定"]);
  });

  // updateReadingProgress - 更新阅读进度
  MNTaskGlobal.registerCustomAction("updateReadingProgress", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    if (!focusNote) {
      MNUtil.showHUD("请先选择一个任务");
      return;
    }
    
    // 检查是否是页码任务
    const title = focusNote.noteTitle;
    if (!title.match(/第\d+(-\d+)?页/)) {
      MNUtil.showHUD("请选择一个页码任务");
      return;
    }
    
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "更新阅读进度",
      "请输入当前阅读到的页码",
      2,  // 输入框样式
      "取消",
      ["确定"],
      (alert, buttonIndex) => {
        if (buttonIndex === 1) {
          const pageText = alert.textFieldAtIndex(0).text;
          const currentPage = parseInt(pageText);
          
          if (isNaN(currentPage)) {
            MNUtil.showHUD("请输入有效的页码");
            return;
          }
          
          MNUtil.undoGrouping(() => {
            try {
              MNTaskManager.updatePageProgress(focusNote, currentPage);
              MNUtil.showHUD(`✅ 已更新到第${currentPage}页`);
            } catch (error) {
              MNUtil.showHUD("更新进度失败：" + error.message);
            }
          });
        }
      }
    );
  });

  // addProgressNote - 添加进度备注
  MNTaskGlobal.registerCustomAction("addProgressNote", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    if (!focusNote) {
      MNUtil.showHUD("请先选择一个任务");
      return;
    }
    
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "添加进度备注",
      "请输入进度备注内容",
      2,  // 输入框样式
      "取消",
      ["确定"],
      (alert, buttonIndex) => {
        if (buttonIndex === 1) {
          const note = alert.textFieldAtIndex(0).text;
          
          if (!note || note.trim() === "") {
            MNUtil.showHUD("请输入备注内容");
            return;
          }
          
          MNUtil.undoGrouping(() => {
            try {
              const timestamp = new Date().toLocaleString();
              focusNote.appendTextComment(`进度备注 [${timestamp}]：${note}`);
              MNUtil.showHUD("✅ 进度备注已添加");
            } catch (error) {
              MNUtil.showHUD("添加备注失败：" + error.message);
            }
          });
        }
      }
    );
  });

  // recordTimeSpent - 记录花费时间
  MNTaskGlobal.registerCustomAction("recordTimeSpent", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    if (!focusNote) {
      MNUtil.showHUD("请先选择一个任务");
      return;
    }
    
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "记录花费时间",
      "请输入花费的小时数",
      2,  // 输入框样式
      "取消",
      ["确定"],
      (alert, buttonIndex) => {
        if (buttonIndex === 1) {
          const hoursText = alert.textFieldAtIndex(0).text;
          const hours = parseFloat(hoursText);
          
          if (isNaN(hours) || hours < 0) {
            MNUtil.showHUD("请输入有效的小时数");
            return;
          }
          
          MNUtil.undoGrouping(() => {
            try {
              const now = new Date();
              focusNote.appendTextComment(`工作时间记录：${hours}小时 (${now.toLocaleString()})`);
              
              // 更新累计时间标签
              const timeTags = focusNote.tags.filter(tag => tag.includes("小时"));
              let totalHours = hours;
              
              if (timeTags.length > 0) {
                const match = timeTags[0].match(/([\d.]+)小时/);
                if (match) {
                  totalHours += parseFloat(match[1]);
                }
                focusNote.removeTags(timeTags);
              }
              
              focusNote.appendTags([`${totalHours}小时`]);
              focusNote.refresh();
              
              MNUtil.showHUD(`✅ 已记录 ${hours} 小时，累计 ${totalHours} 小时`);
            } catch (error) {
              MNUtil.showHUD("记录时间失败：" + error.message);
            }
          });
        }
      }
    );
  });

  // ==================== 今日任务管理相关 ====================
  
  // clearTimeTag - 清除所有时间标签
  MNTaskGlobal.registerCustomAction("clearTimeTag", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((note) => {
        try {
          // 移除所有日期格式的标签和今日标签
          const timeTags = note.tags.filter(tag => 
            tag.match(/^\d{4}\/\d{2}\/\d{2}$/) || tag === "今日" || tag === "明日" || tag === "本周"
          );
          
          if (timeTags.length > 0) {
            note.removeTags(timeTags);
            note.refresh();
          }
        } catch (error) {
          MNUtil.log("清除时间标签失败：" + error);
        }
      });
      
      MNUtil.showHUD("✅ 已清除时间标签");
    });
  });

  // filterByTimeTag - 按时间标签筛选
  MNTaskGlobal.registerCustomAction("filterByTimeTag", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    const options = ["今日", "昨日", "本周", "本月", "自定义日期"];
    MNUtil.userSelect("选择筛选条件", "", options).then(selectedIndex => {
      if (selectedIndex === 0) return; // 0 是取消按钮
      
      let targetTag;
      const today = new Date();
      
      switch(selectedIndex) {
        case 1: // 今日
          targetTag = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
          break;
        case 2: // 昨日
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          targetTag = `${yesterday.getFullYear()}/${String(yesterday.getMonth() + 1).padStart(2, '0')}/${String(yesterday.getDate()).padStart(2, '0')}`;
          break;
        case 3: // 本周
          targetTag = "本周";
          break;
        case 4: // 本月
          targetTag = "本月";
          break;
        case 5: // 自定义
          UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
            "输入日期",
            "格式：YYYY/MM/DD",
            2,
            "取消",
            ["确定"],
            (alert, buttonIndex) => {
              if (buttonIndex === 1) {
                const dateText = alert.textFieldAtIndex(0).text;
                if (dateText.match(/^\d{4}\/\d{2}\/\d{2}$/)) {
                  targetTag = `${dateText}`;
                  performFilter(targetTag);
                } else {
                  MNUtil.showHUD("日期格式错误");
                }
              }
            }
          );
          return;
      }
      
      performFilter(targetTag);
    });
    
    function performFilter(tag) {
      const notebook = MNNotebook.currentNotebook;
      if (!notebook) {
        MNUtil.showHUD("无法获取当前笔记本");
        return;
      }
      
      const filteredNotes = notebook.notes.filter(note => {
        return note.tags && note.tags.includes(tag);
      });
      
      // 使用分区管理系统处理筛选结果
      MNTaskManager.executeFilterWithPartition(`${tag} 任务`, filteredNotes, context);
    }
  });

  // postponeToTomorrow - 推迟到明天
  MNTaskGlobal.registerCustomAction("postponeToTomorrow", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    MNUtil.undoGrouping(() => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const todayTag = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
      const tomorrowTag = `${tomorrow.getFullYear()}/${String(tomorrow.getMonth() + 1).padStart(2, '0')}/${String(tomorrow.getDate()).padStart(2, '0')}`;
      
      focusNotes.forEach((note) => {
        try {
          // 移除今日相关标签
          note.removeTags([todayTag, "今日"]);
          
          // 添加明天的标签
          note.appendTags([tomorrowTag, "明日"]);
          
          // 添加推迟记录
          note.appendTextComment(`推迟记录：从 ${today.toLocaleDateString()} 推迟到 ${tomorrow.toLocaleDateString()}`);
          
          note.refresh();
        } catch (error) {
          MNUtil.log("推迟任务失败：" + error);
        }
      });
      
      MNUtil.showHUD("✅ 已推迟到明天");
    });
  });

  // ==================== 任务拆分相关 ====================
  
  // splitTaskByChapters - 按章节拆分（阅读任务）
  MNTaskGlobal.registerCustomAction("splitTaskByChapters", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    if (!focusNote) {
      MNUtil.showHUD("请先选择一个任务");
      return;
    }
    
    // 创建输入弹窗
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "按章节拆分任务",
      "请输入章节范围（例如：1-10）",
      2,  // 输入框样式
      "取消",
      ["确定"],
      (alert, buttonIndex) => {
        if (buttonIndex === 1) {
          const rangeText = alert.textFieldAtIndex(0).text;
          const match = rangeText.match(/^(\d+)-(\d+)$/);
          
          if (!match) {
            MNUtil.showHUD("格式错误，请输入如 1-10 的格式");
            return;
          }
          
          const startChapter = parseInt(match[1]);
          const endChapter = parseInt(match[2]);
          
          if (startChapter > endChapter) {
            MNUtil.showHUD("起始章节不能大于结束章节");
            return;
          }
          
          MNUtil.undoGrouping(() => {
            try {
              const subtasks = MNTaskManager.splitTaskByChapters(focusNote, startChapter, endChapter);
              MNUtil.showHUD(`✅ 已创建 ${subtasks.length} 个章节任务`);
              
              // 刷新显示
              focusNote.refresh();
            } catch (error) {
              MNUtil.showHUD("拆分任务失败：" + error.message);
            }
          });
        }
      }
    );
  });

  // splitTaskByPages - 按页数拆分
  MNTaskGlobal.registerCustomAction("splitTaskByPages", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    if (!focusNote) {
      MNUtil.showHUD("请先选择一个任务");
      return;
    }
    
    // 两步输入：先输入页码范围，再输入每个任务的页数
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "按页数拆分任务",
      "请输入页码范围（例如：51-100）",
      2,
      "取消",
      ["下一步"],
      (alert, buttonIndex) => {
        if (buttonIndex === 1) {
          const rangeText = alert.textFieldAtIndex(0).text;
          const match = rangeText.match(/^(\d+)\s*-\s*(\d+)$/);
          
          if (!match) {
            MNUtil.showHUD("格式错误，请输入如 51-100 的格式");
            return;
          }
          
          const startPage = parseInt(match[1]);
          const endPage = parseInt(match[2]);
          
          if (startPage <= 0 || endPage <= 0 || startPage > endPage) {
            MNUtil.showHUD("页码范围无效");
            return;
          }
          
          const totalPages = endPage - startPage + 1;
          
          // 第二步：输入每个任务的页数
          UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
            "设置任务页数",
            `页码范围：${startPage}-${endPage}（共${totalPages}页）\n每个任务包含多少页？`,
            2,
            "取消",
            ["确定"],
            (alert2, buttonIndex2) => {
              if (buttonIndex2 === 1) {
                const pagesPerTask = parseInt(alert2.textFieldAtIndex(0).text);
                
                if (isNaN(pagesPerTask) || pagesPerTask <= 0) {
                  MNUtil.showHUD("请输入有效的页数");
                  return;
                }
                
                MNUtil.undoGrouping(() => {
                  try {
                    const subtasks = MNTaskManager.splitTaskByPages(focusNote, startPage, endPage, pagesPerTask);
                    MNUtil.showHUD(`✅ 已创建 ${subtasks.length} 个页数任务`);
                    focusNote.refresh();
                  } catch (error) {
                    MNUtil.showHUD("拆分任务失败：" + error.message);
                  }
                });
              }
            }
          );
        }
      }
    );
  });

  // splitTaskByTimeBlocks - 按时间块拆分（番茄钟）
  MNTaskGlobal.registerCustomAction("splitTaskByTimeBlocks", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    if (!focusNote) {
      MNUtil.showHUD("请先选择一个任务");
      return;
    }
    
    // 输入总时间
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "按时间块拆分任务",
      "预计总时间（小时）",
      2,
      "取消",
      ["下一步"],
      (alert, buttonIndex) => {
        if (buttonIndex === 1) {
          const totalHours = parseFloat(alert.textFieldAtIndex(0).text);
          
          if (isNaN(totalHours) || totalHours <= 0) {
            MNUtil.showHUD("请输入有效的时间");
            return;
          }
          
          // 选择时间块大小
          const options = ["25分钟（番茄钟）", "30分钟", "45分钟", "1小时", "自定义"];
          MNUtil.userSelect("选择时间块大小", "", options).then(selectedIndex => {
            if (selectedIndex === 0) return; // 0 是取消按钮
            
            let hoursPerBlock;
            switch(selectedIndex) {
              case 1:
                hoursPerBlock = 25 / 60;
                break;
              case 2:
                hoursPerBlock = 0.5;
                break;
              case 3:
                hoursPerBlock = 0.75;
                break;
              case 4:
                hoursPerBlock = 1;
                break;
              case 5:
                // 自定义
                UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
                  "自定义时间块",
                  "每个时间块的分钟数",
                  2,
                  "取消",
                  ["确定"],
                  (alert2, buttonIndex2) => {
                    if (buttonIndex2 === 1) {
                      const minutes = parseInt(alert2.textFieldAtIndex(0).text);
                      if (isNaN(minutes) || minutes <= 0) {
                        MNUtil.showHUD("请输入有效的分钟数");
                        return;
                      }
                      
                      hoursPerBlock = minutes / 60;
                      performSplit();
                    }
                  }
                );
                return;
            }
            
            performSplit();
            
            function performSplit() {
              MNUtil.undoGrouping(() => {
                try {
                  const subtasks = MNTaskManager.splitTaskByTimeBlocks(focusNote, totalHours, hoursPerBlock);
                  MNUtil.showHUD(`✅ 已创建 ${subtasks.length} 个时间块任务`);
                  focusNote.refresh();
                } catch (error) {
                  MNUtil.showHUD("拆分任务失败：" + error.message);
                }
              });
            }
          });
        }
      }
    );
  });

  // createKeyResultsFromObjective - 为目标创建关键结果
  MNTaskGlobal.registerCustomAction("createKeyResultsFromObjective", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    if (!focusNote) {
      MNUtil.showHUD("请先选择一个目标");
      return;
    }
    
    // 检查是否是目标类型
    const type = MNTaskManager.getTaskType(focusNote);
    if (!type || type.key !== 'objective') {
      MNUtil.showHUD("请选择一个目标类型的任务");
      return;
    }
    
    // 输入关键结果数量
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "创建关键结果",
      "需要创建几个关键结果？(建议3-5个)",
      2,
      "取消",
      ["下一步"],
      (alert, buttonIndex) => {
        if (buttonIndex === 1) {
          const count = parseInt(alert.textFieldAtIndex(0).text);
          
          if (isNaN(count) || count <= 0 || count > 10) {
            MNUtil.showHUD("请输入1-10之间的数字");
            return;
          }
          
          // 收集关键结果信息
          const keyResults = [];
          let currentIndex = 0;
          
          function collectKeyResult() {
            if (currentIndex >= count) {
              // 所有关键结果收集完毕，开始创建
              MNUtil.undoGrouping(() => {
                try {
                  const krNotes = MNTaskManager.createKeyResultsFromObjective(focusNote, keyResults);
                  MNUtil.showHUD(`✅ 已创建 ${krNotes.length} 个关键结果`);
                  focusNote.refresh();
                } catch (error) {
                  MNUtil.showHUD("创建关键结果失败：" + error.message);
                }
              });
              return;
            }
            
            UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
              `关键结果 ${currentIndex + 1}/${count}`,
              "请输入关键结果名称",
              2,
              "取消",
              ["下一个"],
              (alertKR, buttonIndexKR) => {
                if (buttonIndexKR === 1) {
                  const krName = alertKR.textFieldAtIndex(0).text;
                  if (!krName || krName.trim() === "") {
                    MNUtil.showHUD("关键结果名称不能为空");
                    collectKeyResult(); // 重新收集当前项
                    return;
                  }
                  
                  keyResults.push({
                    name: krName,
                    metric: "", // 可以扩展为收集更多信息
                    deadline: ""
                  });
                  
                  currentIndex++;
                  collectKeyResult(); // 收集下一个
                }
              }
            );
          }
          
          collectKeyResult();
        }
      }
    );
  });

  // batchCreateSubtasks - 批量创建子任务
  MNTaskGlobal.registerCustomAction("batchCreateSubtasks", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    if (!focusNote) {
      MNUtil.showHUD("请先选择一个任务");
      return;
    }
    
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "批量创建子任务",
      "请输入子任务名称，每行一个",
      2,
      "取消",
      ["确定"],
      (alert, buttonIndex) => {
        if (buttonIndex === 1) {
          const input = alert.textFieldAtIndex(0).text;
          if (!input || input.trim() === "") {
            MNUtil.showHUD("请输入子任务名称");
            return;
          }
          
          // 按行分割
          const subtaskNames = input.split('\n')
            .map(name => name.trim())
            .filter(name => name.length > 0);
          
          if (subtaskNames.length === 0) {
            MNUtil.showHUD("没有有效的子任务名称");
            return;
          }
          
          MNUtil.undoGrouping(() => {
            try {
              const subtasks = MNTaskManager.batchCreateSubtasks(focusNote, subtaskNames);
              MNUtil.showHUD(`✅ 已创建 ${subtasks.length} 个子任务`);
              focusNote.refresh();
            } catch (error) {
              MNUtil.showHUD("创建子任务失败：" + error.message);
            }
          });
        }
      }
    );
  });

  // ==================== 任务看板和统计相关 ====================
  
  // viewTaskStatistics - 查看任务统计
  MNTaskGlobal.registerCustomAction("viewTaskStatistics", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    // 检查是否已初始化看板控制器
    if (!self.taskDashboardController || !self.taskDashboardController.rootNote) {
      // 如果没有初始化看板，则统计当前笔记本的所有任务
      const notebook = MNNotebook.currentNotebook;
      if (!notebook) {
        MNUtil.showHUD("无法获取当前笔记本");
        return;
      }
      
      // 获取所有任务
      const allTasks = notebook.notes.filter(note => {
        return MNTaskManager.getTaskType(note) !== null;
      });
      
      if (allTasks.length === 0) {
        MNUtil.showHUD("当前笔记本没有任务");
        return;
      }
      
      // 生成统计报告
      const stats = MNTaskManager.generateTaskStatistics(allTasks);
      
      const report = [
        `📊 任务统计报告（整个笔记本）`,
        ``,
        `总任务数：${stats.total}`,
        ``,
        `按状态统计：`,
        `  • 未开始：${stats.byStatus.notStarted}`,
        `  • 进行中：${stats.byStatus.inProgress}`,
        `  • 已完成：${stats.byStatus.completed}`,
        `  • 已阻塞：${stats.byStatus.blocked}`,
        `  • 已取消：${stats.byStatus.cancelled}`,
        ``,
        `按类型统计：`,
        `  • 目标：${stats.byType.objective}`,
        `  • 关键结果：${stats.byType.keyResult}`,
        `  • 项目：${stats.byType.project}`,
        `  • 任务：${stats.byType.task}`,
        ``,
        `其他统计：`,
        `  • 总工作时间：${stats.totalHours} 小时`,
        `  • 平均进度：${stats.averageProgress}%`,
        `  • 完成率：${Math.round(stats.byStatus.completed / stats.total * 100)}%`
      ].join("\n");
      
      await MNUtil.confirm("任务统计", report, ["确定"]);
    } else {
      // 使用看板控制器更新统计
      self.taskDashboardController.updateDashboardStatistics();
      MNUtil.showHUD("✅ 统计信息已更新到进度看板");
    }
  });

  // viewChildTasksProgress - 查看子任务进度
  MNTaskGlobal.registerCustomAction("viewChildTasksProgress", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    if (!focusNote) {
      MNUtil.showHUD("请先选择一个任务");
      return;
    }
    
    if (!focusNote.childNotes || focusNote.childNotes.length === 0) {
      MNUtil.showHUD("当前任务没有子任务");
      return;
    }
    
    // 收集子任务信息
    const subtaskInfo = [];
    focusNote.childNotes.forEach(child => {
      const type = MNTaskManager.getTaskType(child);
      if (type) {
        // 获取进度
        const progressTags = child.tags.filter(tag => tag.includes("%进度"));
        let progress = 0;
        
        if (progressTags.length > 0) {
          const match = progressTags[0].match(/(\d+)%进度/);
          if (match) {
            progress = parseInt(match[1]);
          }
        } else if (child.colorIndex === 5) {
          progress = 100;
        }
        
        // 获取状态
        let status = "未知";
        switch(child.colorIndex) {
          case 0: status = "未开始"; break;
          case 6: status = "进行中"; break;
          case 5: status = "已完成"; break;
          case 3: status = "已阻塞"; break;
          case 14: status = "已取消"; break;
        }
        
        subtaskInfo.push({
          title: child.noteTitle,
          status: status,
          progress: progress
        });
      }
    });
    
    if (subtaskInfo.length === 0) {
      MNUtil.showHUD("没有找到有效的子任务");
      return;
    }
    
    // 计算总体进度
    const overallProgress = MNTaskManager.calculateOverallProgress(focusNote);
    
    // 生成报告
    let report = [
      `📊 子任务进度报告`,
      ``,
      `父任务：${focusNote.noteTitle}`,
      `子任务数量：${subtaskInfo.length}`,
      `总体进度：${overallProgress}%`,
      ``,
      `子任务详情：`
    ];
    
    subtaskInfo.forEach((task, index) => {
      const progressBar = '█'.repeat(Math.floor(task.progress / 10)) + '░'.repeat(10 - Math.floor(task.progress / 10));
      report.push(`${index + 1}. ${task.title}`);
      report.push(`   状态：${task.status} | 进度：${task.progress}% ${progressBar}`);
    });
    
    MNUtil.confirm("子任务进度", report.join("\n"), ["确定"]);
  });

  // exportTasksToJSON - 导出任务数据 (JSON)
  MNTaskGlobal.registerCustomAction("exportTasksToJSON", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    const notebook = MNNotebook.currentNotebook;
    if (!notebook) {
      MNUtil.showHUD("无法获取当前笔记本");
      return;
    }
    
    // 获取所有任务
    const allTasks = notebook.notes.filter(note => {
      return MNTaskManager.getTaskType(note) !== null;
    });
    
    if (allTasks.length === 0) {
      MNUtil.showHUD("当前笔记本没有任务");
      return;
    }
    
    try {
      // 生成 JSON 数据
      const jsonData = MNTaskManager.exportTasksToJSON(allTasks);
      
      // 保存到文件
      const fileName = `tasks_export_${new Date().getTime()}.json`;
      const filePath = MNUtil.documentFolder + "/" + fileName;
      
      MNUtil.writeJSON(filePath, jsonData);
      
      // 复制到剪贴板
      MNUtil.copyJSON(jsonData);
      
      MNUtil.showHUD(`✅ 已导出 ${allTasks.length} 个任务\n文件：${fileName}\n(已复制到剪贴板)`);
    } catch (error) {
      MNUtil.showHUD("导出失败：" + error.message);
    }
  });

  // ==================== 快速筛选相关 ====================
  
  // filterByTaskType - 按任务类型筛选
  MNTaskGlobal.registerCustomAction("filterByTaskType", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    const options = ["目标 (Objective)", "关键结果 (Key Result)", "项目 (Project)", "任务 (Task)", "全部类型"];
    const selectedIndex = await MNUtil.userSelect("选择任务类型", "", options);
      if (selectedIndex === 0) return; // 0 是取消按钮
      
      let targetType = null;
      switch(selectedIndex) {
        case 1: targetType = 'objective'; break;
        case 2: targetType = 'keyResult'; break;
        case 3: targetType = 'project'; break;
        case 4: targetType = 'task'; break;
        case 5: targetType = null; break; // 全部
      }
      
      const notebook = MNNotebook.currentNotebook;
      if (!notebook) {
        MNUtil.showHUD("无法获取当前笔记本");
        return;
      }
      
      const filteredNotes = notebook.notes.filter(note => {
        const type = MNTaskManager.getTaskType(note);
        return type && (targetType === null || type.key === targetType);
      });
      
      // 使用分区管理系统处理筛选结果
      const typeName = targetType ? MNTaskManager.taskTypes[targetType].zhName : "所有类型";
      MNTaskManager.executeFilterWithPartition(typeName + "任务", filteredNotes, context);
  });

  // filterByTaskStatus - 按任务状态筛选
  MNTaskGlobal.registerCustomAction("filterByTaskStatus", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    const options = ["⬜ 未开始", "🔵 进行中", "✅ 已完成", "🔴 已阻塞", "❌ 已取消", "全部状态"];
    const selectedIndex = await MNUtil.userSelect("选择任务状态", "", options);
    if (selectedIndex === 0) return; // 0 是取消按钮
    
    let targetStatus = null;
    switch(selectedIndex) {
      case 1: targetStatus = 'notStarted'; break;
      case 2: targetStatus = 'inProgress'; break;
      case 3: targetStatus = 'completed'; break;
      case 4: targetStatus = 'blocked'; break;
      case 5: targetStatus = 'cancelled'; break;
      case 6: targetStatus = null; break; // 全部
    }
    
    const notebook = MNNotebook.currentNotebook;
    if (!notebook) {
      MNUtil.showHUD("无法获取当前笔记本");
      return;
    }
    
    const filteredNotes = notebook.notes.filter(note => {
      const type = MNTaskManager.getTaskType(note);
      if (!type) return false;
      
      const status = MNTaskManager.getNoteStatus(note);
      return targetStatus === null || status === targetStatus;
    });
    
    // 使用分区管理系统处理筛选结果
    const statusName = options[selectedIndex - 1];
    MNTaskManager.executeFilterWithPartition(statusName + "任务", filteredNotes, context);
  });

  // filterByProgress - 按进度筛选
  MNTaskGlobal.registerCustomAction("filterByProgress", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    const options = ["0% (未开始)", "1-25% (刚开始)", "26-50% (进行中)", "51-75% (过半)", "76-99% (即将完成)", "100% (已完成)"];
    const selectedIndex = await MNUtil.userSelect("选择进度范围", "", options);
    if (selectedIndex === 0) return; // 0 是取消按钮
    
    let minProgress, maxProgress;
    switch(selectedIndex) {
      case 1: minProgress = 0; maxProgress = 0; break;
      case 2: minProgress = 1; maxProgress = 25; break;
      case 3: minProgress = 26; maxProgress = 50; break;
      case 4: minProgress = 51; maxProgress = 75; break;
      case 5: minProgress = 76; maxProgress = 99; break;
      case 6: minProgress = 100; maxProgress = 100; break;
    }
    
    const notebook = MNNotebook.currentNotebook;
    if (!notebook) {
      MNUtil.showHUD("无法获取当前笔记本");
      return;
    }
    
    const filteredNotes = notebook.notes.filter(note => {
      const type = MNTaskManager.getTaskType(note);
      if (!type) return false;
      
      // 获取进度
      let progress = 0;
      const progressTags = note.tags.filter(tag => tag.includes("%进度"));
      if (progressTags.length > 0) {
        const match = progressTags[0].match(/(\d+)%进度/);
        if (match) {
          progress = parseInt(match[1]);
        }
      } else if (note.colorIndex === 5) {
        // 已完成状态默认100%
        progress = 100;
      }
      
      return progress >= minProgress && progress <= maxProgress;
    });
    
    // 按进度排序
    filteredNotes.sort((a, b) => {
      const getProgress = (note) => {
        const tags = note.tags.filter(tag => tag.includes("%进度"));
        if (tags.length > 0) {
          const match = tags[0].match(/(\d+)%进度/);
          return match ? parseInt(match[1]) : 0;
        }
        return note.colorIndex === 5 ? 100 : 0;
      };
      return getProgress(b) - getProgress(a);
    });
    
    // 使用分区管理系统处理筛选结果
    const progressName = `进度${options[selectedIndex - 1]}`;
    MNTaskManager.executeFilterWithPartition(progressName, filteredNotes, context);
  });

  // filterByTag - 按标签筛选
  MNTaskGlobal.registerCustomAction("filterByTag", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    const notebook = MNNotebook.currentNotebook;
    if (!notebook) {
      MNUtil.showHUD("无法获取当前笔记本");
      return;
    }
    
    // 收集所有标签
    const tagSet = new Set();
    notebook.notes.forEach(note => {
      const type = MNTaskManager.getTaskType(note);
      if (type && note.tags) {
        note.tags.forEach(tag => {
          // 排除日期标签和进度标签
          if (!tag.match(/^\d{4}\/\d{2}\/\d{2}$/) && !tag.includes("%进度") && !tag.includes("小时")) {
            tagSet.add(tag);
          }
        });
      }
    });
    
    if (tagSet.size === 0) {
      MNUtil.showHUD("没有找到可用的标签");
      return;
    }
    
    const tags = Array.from(tagSet).sort();
    const selectedIndex = await MNUtil.userSelect("选择标签", "只能选择单个标签进行筛选", tags);
    if (selectedIndex === 0) return; // 0 是取消按钮
    
    const selectedTags = [tags[selectedIndex - 1]]; // 转换为数组以保持后续代码兼容
    
    const filteredNotes = notebook.notes.filter(note => {
      const type = MNTaskManager.getTaskType(note);
      if (!type || !note.tags) return false;
      
      // 检查是否包含所有选中的标签
      return selectedTags.every(tag => note.tags.includes(tag));
    });
    
    // 使用分区管理系统处理筛选结果
    const tagText = selectedTags.join(", ");
    MNTaskManager.executeFilterWithPartition(`标签[${tagText}]`, filteredNotes, context);
  });

  // filterOverdueTasks - 筛选逾期任务
  MNTaskGlobal.registerCustomAction("filterOverdueTasks", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    const notebook = MNNotebook.currentNotebook;
    if (!notebook) {
      MNUtil.showHUD("无法获取当前笔记本");
      return;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const filteredNotes = notebook.notes.filter(note => {
      const type = MNTaskManager.getTaskType(note);
      if (!type) return false;
      
      // 检查是否已完成
      const status = MNTaskManager.getNoteStatus(note);
      if (status === 'completed') return false;
      
      // 检查日期标签
      if (!note.tags) return false;
      
      const dateTags = note.tags.filter(tag => tag.match(/^\d{4}\/\d{2}\/\d{2}$/));
      if (dateTags.length === 0) return false;
      
      // 解析日期
      const dateStr = dateTags[0];
      const [year, month, day] = dateStr.split('/').map(n => parseInt(n));
      const taskDate = new Date(year, month - 1, day);
      
      return taskDate < today;
    });
    
    // 按逾期天数排序
    filteredNotes.sort((a, b) => {
      const getDate = (note) => {
        const tag = note.tags.find(t => t.match(/^\d{4}\/\d{2}\/\d{2}$/));
        const [y, m, d] = tag.split('/').map(n => parseInt(n));
        return new Date(y, m - 1, d);
      };
      return getDate(a) - getDate(b);
    });
    
    // 使用分区管理系统处理筛选结果
    MNTaskManager.executeFilterWithPartition("逾期任务", filteredNotes, context);
  });

  // quickFilter - 快速组合筛选
  MNTaskGlobal.registerCustomAction("quickFilter", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    const presets = [
      "今日未完成的任务",
      "本周进行中的任务",
      "高优先级未开始任务",
      "即将完成的任务(75%+)",
      "已阻塞的任务",
      "自定义筛选..."
    ];
    
    const selectedIndex = await MNUtil.userSelect("选择筛选预设", "", presets);
    if (selectedIndex === 0) return; // 0 是取消按钮
    
    const notebook = MNNotebook.currentNotebook;
    if (!notebook) {
      MNUtil.showHUD("无法获取当前笔记本");
      return;
    }
    
    let filteredNotes = [];
    let title = "";
    
    switch(selectedIndex) {
        case 1: // 今日未完成
          const today = new Date();
          const todayTag = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
          
          filteredNotes = notebook.notes.filter(note => {
            const type = MNTaskManager.getTaskType(note);
            if (!type) return false;
            
            const hasToday = note.tags && (note.tags.includes(todayTag) || note.tags.includes("今日"));
            const status = MNTaskManager.getNoteStatus(note);
            
            return hasToday && status !== 'completed';
          });
          title = "📅 今日未完成的任务";
          break;
          
        case 2: // 本周进行中
          filteredNotes = notebook.notes.filter(note => {
            const type = MNTaskManager.getTaskType(note);
            if (!type) return false;
            
            const status = MNTaskManager.getNoteStatus(note);
            const hasWeek = note.tags && note.tags.includes("本周");
            
            return status === 'inProgress' || hasWeek;
          });
          title = "📅 本周进行中的任务";
          break;
          
        case 3: // 高优先级未开始
          filteredNotes = notebook.notes.filter(note => {
            const type = MNTaskManager.getTaskType(note);
            if (!type) return false;
            
            const status = MNTaskManager.getNoteStatus(note);
            const isHighPriority = note.tags && (note.tags.includes("重要") || note.tags.includes("紧急") || note.tags.includes("高优先级"));
            
            return status === 'notStarted' && isHighPriority;
          });
          title = "🚨 高优先级未开始任务";
          break;
          
        case 4: // 即将完成 75%+
          filteredNotes = notebook.notes.filter(note => {
            const type = MNTaskManager.getTaskType(note);
            if (!type) return false;
            
            const progressTags = note.tags ? note.tags.filter(tag => tag.includes("%进度")) : [];
            if (progressTags.length > 0) {
              const match = progressTags[0].match(/(\d+)%进度/);
              if (match) {
                const progress = parseInt(match[1]);
                return progress >= 75 && progress < 100;
              }
            }
            return false;
          });
          title = "🎯 即将完成的任务(75%+)";
          break;
          
        case 5: // 已阻塞
          filteredNotes = notebook.notes.filter(note => {
            const type = MNTaskManager.getTaskType(note);
            if (!type) return false;
            
            const status = MNTaskManager.getNoteStatus(note);
            return status === 'blocked';
          });
          title = "🚫 已阻塞的任务";
          break;
          
        case 6: // 自定义
          MNUtil.showHUD("请使用其他筛选功能组合");
          return;
    }
    
    // 使用分区管理系统处理筛选结果
    MNTaskManager.executeFilterWithPartition(title, filteredNotes, context);
  });

  // exportTasksToMarkdown - 导出任务报告 (Markdown)
  MNTaskGlobal.registerCustomAction("exportTasksToMarkdown", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    const notebook = MNNotebook.currentNotebook;
    if (!notebook) {
      MNUtil.showHUD("无法获取当前笔记本");
      return;
    }
    
    // 获取所有任务，按类型分组
    const tasksByType = {
      objective: [],
      keyResult: [],
      project: [],
      task: []
    };
    
    notebook.notes.forEach(note => {
      const type = MNTaskManager.getTaskType(note);
      if (type && tasksByType[type.key]) {
        tasksByType[type.key].push(note);
      }
    });
    
    // 生成 Markdown 报告
    const today = new Date().toLocaleDateString();
    let markdown = [
      `# 任务报告`,
      ``,
      `生成日期：${today}`,
      `笔记本：${notebook.title}`,
      ``,
      `## 统计概览`,
      ``
    ];
    
    // 添加统计信息
    const allTasks = Object.values(tasksByType).flat();
    if (allTasks.length > 0) {
      const stats = MNTaskManager.generateTaskStatistics(allTasks);
      markdown.push(`- 总任务数：${stats.total}`);
      markdown.push(`- 已完成：${stats.byStatus.completed}`);
      markdown.push(`- 进行中：${stats.byStatus.inProgress}`);
      markdown.push(`- 完成率：${Math.round(stats.byStatus.completed / stats.total * 100)}%`);
      markdown.push(`- 总工作时间：${stats.totalHours} 小时`);
      markdown.push(``);
    }
    
    // 按类型生成任务列表
    const typeNames = {
      objective: "目标 (Objectives)",
      keyResult: "关键结果 (Key Results)",
      project: "项目 (Projects)",
      task: "任务 (Tasks)"
    };
    
    Object.entries(tasksByType).forEach(([typeKey, tasks]) => {
      if (tasks.length === 0) return;
      
      markdown.push(`## ${typeNames[typeKey]}`);
      markdown.push(``);
      
      tasks.forEach(note => {
        const status = MNTaskManager.getNoteStatus(note);
        const statusEmoji = {
          notStarted: '⬜',
          inProgress: '🔵',
          completed: '✅',
          blocked: '🔴',
          cancelled: '❌'
        }[status] || '❓';
        
        // 获取进度
        const progressTags = note.tags.filter(tag => tag.includes("%进度"));
        let progressText = "";
        if (progressTags.length > 0) {
          const match = progressTags[0].match(/(\d+)%进度/);
          if (match) {
            progressText = ` (${match[1]}%)`;
          }
        }
        
        markdown.push(`- ${statusEmoji} ${note.noteTitle}${progressText}`);
        
        // 添加子任务
        if (note.childNotes && note.childNotes.length > 0) {
          note.childNotes.forEach(child => {
            const childType = MNTaskManager.getTaskType(child);
            if (childType) {
              const childStatus = MNTaskManager.getNoteStatus(child);
              const childEmoji = {
                notStarted: '⬜',
                inProgress: '🔵',
                completed: '✅',
                blocked: '🔴',
                cancelled: '❌'
              }[childStatus] || '❓';
              
              markdown.push(`  - ${childEmoji} ${child.noteTitle}`);
            }
          });
        }
      });
      
      markdown.push(``);
    });
    
    // 保存文件
    try {
      const fileName = `tasks_report_${new Date().getTime()}.md`;
      const filePath = MNUtil.documentFolder + "/" + fileName;
      
      MNUtil.writeText(filePath, markdown.join("\n"));
      
      // 复制到剪贴板
      MNUtil.copy(markdown.join("\n"));
      
      MNUtil.showHUD(`✅ 已导出任务报告\n文件：${fileName}\n(已复制到剪贴板)`);
    } catch (error) {
      MNUtil.showHUD("导出失败：" + error.message);
    }
  });

  // ==================== 项目看板相关 ====================
  
  // openProjectBoard - 打开项目看板
  MNTaskGlobal.registerCustomAction("openProjectBoard", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    const projectBoardId = taskConfig.getBoardNoteId('project');
    if (!projectBoardId) {
      MNUtil.showHUD("请先在设置中配置项目看板\n设置 → Task Board → 项目看板 → Paste");
      return;
    }
    
    const projectBoard = MNNote.new(projectBoardId);
    if (projectBoard) {
      // 设置项目看板样式
      MNUtil.undoGrouping(() => {
        projectBoard.noteTitle = projectBoard.noteTitle || "📁 项目看板";
        projectBoard.colorIndex = 15;  // 紫色
        if (!projectBoard.tags || !projectBoard.tags.includes("项目")) {
          projectBoard.appendTags(["项目", "看板"]);
        }
      });
      projectBoard.focusInFloatMindMap(0.5);
    } else {
      taskConfig.clearBoardNoteId('project');
      MNUtil.showHUD("❌ 项目看板卡片不存在，请重新配置");
    }
  });

  // createProjectFromNote - 从当前卡片创建项目
  MNTaskGlobal.registerCustomAction("createProjectFromNote", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    if (!focusNote) {
      MNUtil.showHUD("请先选择一个笔记");
      return;
    }
    
    MNUtil.undoGrouping(() => {
      try {
        const projectContent = focusNote.noteTitle || "新项目";
        const projectNote = MNTaskManager.createTask(focusNote, 'project', projectContent, {
          tags: ["项目", "进行中"],
          addFields: true
        });
        
        // 添加项目起始时间
        projectNote.appendTextComment(`起始时间：${new Date().toLocaleString()}`);
        
        projectNote.focusInMindMap(0.2);
        MNUtil.showHUD("✅ 已创建项目");
      } catch (error) {
        MNUtil.showHUD("创建项目失败：" + error.message);
      }
    });
  });

  // createMilestone - 创建里程碑
  MNTaskGlobal.registerCustomAction("createMilestone", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    if (!focusNote) {
      MNUtil.showHUD("请先选择一个项目");
      return;
    }
    
    const type = MNTaskManager.getTaskType(focusNote);
    if (!type || type.key !== 'project') {
      MNUtil.showHUD("请选择一个项目类型的任务");
      return;
    }
    
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "创建里程碑",
      "请输入里程碑名称",
      2,
      "取消",
      ["确定"],
      (alert, buttonIndex) => {
        if (buttonIndex === 1) {
          const milestoneName = alert.textFieldAtIndex(0).text;
          if (!milestoneName || milestoneName.trim() === "") {
            MNUtil.showHUD("里程碑名称不能为空");
            return;
          }
          
          MNUtil.undoGrouping(() => {
            const milestone = focusNote.createChildNote({
              title: `🏁 ${milestoneName}`,
              colorIndex: 7  // 橙色
            });
            milestone.appendTags(["里程碑", "未完成"]);
            milestone.appendTextComment("截止日期：待定");
            milestone.appendTextComment("负责人：待定");
            
            focusNote.refresh();
            MNUtil.showHUD("✅ 已创建里程碑");
          });
        }
      }
    );
  });

  // ==================== 动作看板相关 ====================
  
  // openActionBoard - 打开动作看板
  MNTaskGlobal.registerCustomAction("openActionBoard", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    const actionBoardId = taskConfig.getBoardNoteId('action');
    if (!actionBoardId) {
      MNUtil.showHUD("请先在设置中配置动作看板\n设置 → Task Board → 动作看板 → Paste");
      return;
    }
    
    const actionBoard = MNNote.new(actionBoardId);
    if (actionBoard) {
      // 设置动作看板样式
      MNUtil.undoGrouping(() => {
        actionBoard.noteTitle = actionBoard.noteTitle || "✨ 动作看板";
        actionBoard.colorIndex = 6;  // 蓝色
        if (!actionBoard.tags || !actionBoard.tags.includes("动作")) {
          actionBoard.appendTags(["动作", "看板", "GTD"]);
        }
      });
      actionBoard.focusInFloatMindMap(0.5);
    } else {
      taskConfig.clearBoardNoteId('action');
      MNUtil.showHUD("❌ 动作看板卡片不存在，请重新配置");
    }
  });

  // createActionItem - 创建行动项
  MNTaskGlobal.registerCustomAction("createActionItem", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "创建行动项",
      "下一步要做什么？",
      2,
      "取消",
      ["确定"],
      (alert, buttonIndex) => {
        if (buttonIndex === 1) {
          const actionName = alert.textFieldAtIndex(0).text;
          if (!actionName || actionName.trim() === "") {
            MNUtil.showHUD("行动项不能为空");
            return;
          }
          
          MNUtil.undoGrouping(() => {
            try {
              // 获取动作看板
              const actionBoardId = taskConfig.getBoardNoteId('action');
              let parentNote = focusNote;
              
              if (actionBoardId) {
                const actionBoard = MNNote.new(actionBoardId);
                if (actionBoard) {
                  parentNote = actionBoard;
                }
              }
              
              const actionNote = parentNote.createChildNote({
                title: `✨ ${actionName}`,
                colorIndex: 0  // 淡黄色（待处理）
              });
              
              actionNote.appendTags(["行动项", "待处理"]);
              actionNote.appendTextComment("场景：未设置");
              actionNote.appendTextComment("预计时间：未设置");
              actionNote.appendTextComment(`创建时间：${new Date().toLocaleString()}`);
              
              parentNote.refresh();
              MNUtil.showHUD("✅ 已创建行动项");
            } catch (error) {
              MNUtil.showHUD("创建行动项失败：" + error.message);
            }
          });
        }
      }
    );
  });

  // setActionContext - 设置执行场景
  MNTaskGlobal.registerCustomAction("setActionContext", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    if (!focusNote) {
      MNUtil.showHUD("请先选择一个行动项");
      return;
    }
    
    const contexts = ["🏠 在家", "🏢 办公室", "🚗 路上", "💻 电脑前", "📱 手机", "👥 会议", "🛒 外出", "📚 图书馆"];
    const selectedIndex = await MNUtil.userSelect("选择执行场景", "", contexts);
    
    if (selectedIndex > 0) { // 0 是取消按钮
      const selectedContext = contexts[selectedIndex - 1];
      
      MNUtil.undoGrouping(() => {
        // 查找并更新场景评论
        const contextIndex = focusNote.getIncludingCommentIndex("场景：");
        if (contextIndex !== -1) {
          focusNote.removeCommentByIndex(contextIndex);
        }
        focusNote.appendTextComment(`场景：${selectedContext}`);
        
        // 添加场景标签
        const contextTag = selectedContext.split(' ')[1];
        focusNote.appendTags([contextTag]);
        
        focusNote.refresh();
        MNUtil.showHUD(`✅ 已设置场景：${selectedContext}`);
      });
    }
  });

  // processInbox - 处理收件箱
  MNTaskGlobal.registerCustomAction("processInbox", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    // 获取动作看板
    const actionBoardId = taskConfig.getBoardNoteId('action');
    if (!actionBoardId) {
      MNUtil.showHUD("请先配置动作看板");
      return;
    }
    
    const actionBoard = MNNote.new(actionBoardId);
    if (!actionBoard) {
      MNUtil.showHUD("动作看板不存在");
      return;
    }
    
    // 查找待处理的行动项
    const pendingActions = actionBoard.childNotes.filter(note => 
      note.tags && note.tags.includes("待处理")
    );
    
    if (pendingActions.length === 0) {
      MNUtil.showHUD("收件箱为空");
      return;
    }
    
    // 聚焦到第一个待处理项
    pendingActions[0].focusInMindMap(0.3);
    MNUtil.showHUD(`收件箱中有 ${pendingActions.length} 个待处理项`);
  });

}

// 立即注册
try {
  registerAllCustomActions();
} catch (error) {
  // 静默处理错误，避免影响主功能
  MNUtil.log(`❌ 注册自定义 actions 时出错: ${error.message || error}`);
}
