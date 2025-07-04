/**
 * task 的 Actions 注册表
 */

// 使用 MNTask 专用命名空间，避免与 MNToolbar 冲突
if (typeof MNTaskGlobal === "undefined") {
  var MNTaskGlobal = {};
}

// 初始化 customActions 对象
MNTaskGlobal.customActions = MNTaskGlobal.customActions || {};


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
      MNUtil.showHUD(`执行失败: ${error.message || error}`);
      return false;
    }
  }
  return false;
};

// 不再需要全局 global 对象

// 注册所有自定义 actions
function registerAllCustomActions() {
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

  // openTasksFloatMindMap
  MNTaskGlobal.registerCustomAction("openTasksFloatMindMap", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    let OKRNote = MNNote.new("690ABF82-339C-4AE1-8BDB-FA6796204B27");
    OKRNote.focusInFloatMindMap();
  });

  // openPinnedNote-1
  MNTaskGlobal.registerCustomAction("openPinnedNote-1", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    pinnedNote = MNNote.new("1346BDF1-7F58-430F-874E-B814E7162BDF"); // Hᵖ(D)
    pinnedNote.focusInFloatMindMap();
  });

  // openPinnedNote-2
  MNTaskGlobal.registerCustomAction("openPinnedNote-2", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    pinnedNote = MNNote.new("89042A37-CC80-4FFC-B24F-F8E86CB764DC"); // Lᵖ(T)
    pinnedNote.focusInFloatMindMap();
  });

  // openPinnedNote-3
  MNTaskGlobal.registerCustomAction("openPinnedNote-3", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    pinnedNote = MNNote.new("D7DEDE97-1B87-4BB6-B607-4FB987F230E4"); // Hᵖ(T)
    pinnedNote.focusInFloatMindMap();
  });

  // renewExcerptInParentNoteByFocusNote
  MNTaskGlobal.registerCustomAction("renewExcerptInParentNoteByFocusNote", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        taskUtils.renewExcerptInParentNoteByFocusNote(focusNote);
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // removeTitlePrefix
  MNTaskGlobal.registerCustomAction("removeTitlePrefix", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        focusNotes.forEach((focusNote) => {
          focusNote.title = focusNote.title.toNoBracketPrefixContent();
          focusNote.refreshAll();
        });
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // addNewIdeaNote
  MNTaskGlobal.registerCustomAction("addNewIdeaNote", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "输入思路标题",
          "",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            let userInput = alert.textFieldAtIndex(0).text;
            if (buttonIndex == 1 && userInput) {
              MNUtil.undoGrouping(() => {
                MNMath.addNewIdeaNote(focusNote, userInput);
              });
            }
          },
        );
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // makeCard
  MNTaskGlobal.registerCustomAction("makeCard", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        MNMath.makeCard(focusNote);
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // makeNote
  MNTaskGlobal.registerCustomAction("makeNote", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        if (taskConfig.windowState.preprocess) {
          let newnote = MNMath.toNoExceptVersion(focusNote);
          MNMath.changeTitle(newnote);
          newnote.focusInMindMap(0.2);
        } else {
          MNMath.makeNote(focusNote);
        }
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // doubleClickMakeNote
  MNTaskGlobal.registerCustomAction("doubleClickMakeNote", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      MNMath.makeNote(focusNote, false);
    });
  });

  // replaceFieldContentByPopup
  MNTaskGlobal.registerCustomAction("replaceFieldContentByPopup", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        MNMath.replaceFieldContentByPopup(focusNote);
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  });

  // hideAddonBar - 隐藏插件栏
  MNTaskGlobal.registerCustomAction("hideAddonBar", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    // 发送通知来切换插件栏的显示/隐藏
    MNUtil.postNotification("toggleMindmapTask", { 
      target: "addonBar" 
    });
  });

  MNTaskGlobal.registerCustomAction("makeCardWithoutFocus", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        MNMath.makeCard(focusNote, true, true, false);
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  })

  MNTaskGlobal.registerCustomAction("retainFieldContentOnly", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      try {
        MNMath.retainFieldContentOnly(focusNote);
      } catch (error) {
        MNUtil.showHUD(error);
      }
    });
  })

  // OKRNoteMake - OKR 制卡流
  MNTaskGlobal.registerCustomAction("OKRNoteMake", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((focusNote) => {
        taskUtils.OKRNoteMake(focusNote);
      });
    });
  });

  // undoOKRNoteMake - 回退任务状态
  MNTaskGlobal.registerCustomAction("undoOKRNoteMake", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((focusNote) => {
        taskUtils.OKRNoteMake(focusNote, true);  // undoStatus = true
      });
    });
  });

  // moveToInbox - 加入 Inbox
  MNTaskGlobal.registerCustomAction("moveToInbox", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.showHUD("功能开发中：加入 Inbox");
  });

  // openFloatWindowByInboxNote - 浮窗定位今日 Inbox
  MNTaskGlobal.registerCustomAction("openFloatWindowByInboxNote", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.showHUD("功能开发中：浮窗定位今日 Inbox");
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
          tags: ["#今日"]
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
                tags: ["#子任务"]
              });
              
              // 继承父任务的时间标签
              const parentTags = focusNote.tags || [];
              const timeTags = parentTags.filter(tag => 
                tag.match(/^#\d{4}\/\d{2}\/\d{2}$/) || tag === "#今日"
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
  
  // toggleTaskStatus - 切换任务状态
  MNTaskGlobal.registerCustomAction("toggleTaskStatus", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((note) => {
        try {
          MNTaskManager.toggleTaskStatus(note);
        } catch (error) {
          MNUtil.log("切换状态失败：" + error);
        }
      });
      
      MNUtil.showHUD("✅ 状态已更新");
    });
  });

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
    
    MNUtil.select("选择父任务", options, false).then(selectedIndex => {
      if (selectedIndex !== null && selectedIndex >= 0) {
        const parentNote = potentialParents[selectedIndex];
        
        MNUtil.undoGrouping(() => {
          MNTaskManager.linkTasks(focusNote, parentNote);
          MNUtil.showHUD("✅ 已链接到父任务");
        });
      }
    });
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
            tag.match(/^#\d{4}\/\d{2}\/\d{2}$/) || tag === "#今日" || tag === "#明日" || tag === "#本周"
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
    MNUtil.select("选择筛选条件", options, false).then(selectedIndex => {
      if (selectedIndex === null) return;
      
      let targetTag;
      const today = new Date();
      
      switch(selectedIndex) {
        case 0: // 今日
          targetTag = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
          break;
        case 1: // 昨日
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          targetTag = `${yesterday.getFullYear()}/${String(yesterday.getMonth() + 1).padStart(2, '0')}/${String(yesterday.getDate()).padStart(2, '0')}`;
          break;
        case 2: // 本周
          targetTag = "本周";
          break;
        case 3: // 本月
          targetTag = "本月";
          break;
        case 4: // 自定义
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
        return note.tags && note.tags.includes(`#${tag}`);
      });
      
      if (filteredNotes.length > 0) {
        // 创建汇总笔记
        const summaryNote = MNNote.new({
          title: `#${tag} 任务汇总 (${filteredNotes.length}个)`,
          colorIndex: 13
        });
        
        filteredNotes.forEach(note => {
          summaryNote.appendNoteLink(note, "task");
        });
        
        summaryNote.focusInFloatMindMap();
        MNUtil.showHUD(`找到 ${filteredNotes.length} 个任务`);
      } else {
        MNUtil.showHUD("没有找到匹配的任务");
      }
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
          MNUtil.select("选择时间块大小", options, false).then(selectedIndex => {
            if (selectedIndex === null) return;
            
            let hoursPerBlock;
            switch(selectedIndex) {
              case 0:
                hoursPerBlock = 25 / 60;
                break;
              case 1:
                hoursPerBlock = 0.5;
                break;
              case 2:
                hoursPerBlock = 0.75;
                break;
              case 3:
                hoursPerBlock = 1;
                break;
              case 4:
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
      `📊 任务统计报告`,
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
    
    MNUtil.confirm("任务统计", report, ["确定"]);
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

}

// 立即注册
try {
  registerAllCustomActions();
} catch (error) {
  // 静默处理错误，避免影响主功能
}
