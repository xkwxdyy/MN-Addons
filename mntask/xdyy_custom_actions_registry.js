/**
 * task 的 Actions 注册表
 */

// 文件加载日志
if (typeof MNUtil !== 'undefined' && MNUtil.log) {
  MNUtil.log("🔧 开始加载 xdyy_custom_actions_registry.js")
}

// 使用 MNTask 专用命名空间，避免与 MNToolbar 冲突
if (typeof MNTaskGlobal === "undefined") {
  var MNTaskGlobal = {};
}

// 初始化 customActions 对象
MNTaskGlobal.customActions = MNTaskGlobal.customActions || {};

// 存储主插件实例的引用
MNTaskGlobal.mainPlugin = null;

// 记录已加载的控制器，防止重复加载
MNTaskGlobal.loadedControllers = MNTaskGlobal.loadedControllers || {};


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
  // 检查依赖是否存在
  if (typeof MNTaskManager === 'undefined') {
    if (typeof MNUtil !== 'undefined') {
      MNUtil.log("⚠️ MNTaskManager 未定义，跳过自定义 actions 注册")
      MNUtil.showHUD("❌ 任务管理核心组件加载失败，请重启插件")
    }
    return;
  }
  
  if (typeof MNUtil !== 'undefined' && MNUtil.log) {
    MNUtil.log("✅ MNTaskManager 已就绪，开始注册自定义 actions")
  }
  
  // taskCardMake - 智能任务制卡
  MNTaskGlobal.registerCustomAction("taskCardMake", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    try {
      // 验证输入
      const notesToProcess = MNTaskManager.getNotesToProcess(focusNote, focusNotes);
      if (!notesToProcess) return;
      
      // 批量处理
      const result = await MNTaskManager.batchProcessCards(notesToProcess);
      
      // 显示结果
      MNTaskManager.showProcessResult(result);
    } catch (error) {
      MNUtil.log(`❌ taskCardMake 执行失败: ${error.message || error}`);
      MNUtil.showHUD(`任务制卡失败: ${error.message || "未知错误"}`);
    }
  });
  
  // toggleTaskStatusForward - 向前切换任务状态（单击）
  MNTaskGlobal.registerCustomAction("toggleTaskStatusForward", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    try {
      await MNTaskManager.toggleStatusForward(focusNote);
    } catch (error) {
      MNUtil.log(`❌ toggleTaskStatusForward 执行失败: ${error.message || error}`);
      MNUtil.showHUD(`状态切换失败: ${error.message || "未知错误"}`);
    }
  });
  
  // toggleTaskStatusBackward - 退回上一个状态（长按菜单）
  MNTaskGlobal.registerCustomAction("toggleTaskStatusBackward", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    try {
      MNTaskManager.toggleStatusBackward(focusNote);
    } catch (error) {
      MNUtil.log(`❌ toggleTaskStatusBackward 执行失败: ${error.message || error}`);
      MNUtil.showHUD(`状态退回失败: ${error.message || "未知错误"}`);
    }
  });
  

  // changeTaskType - 修改卡片类型（支持多选）
  MNTaskGlobal.registerCustomAction("changeTaskType", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    try {
      const notesToProcess = focusNotes && focusNotes.length > 0 ? focusNotes : (focusNote ? [focusNote] : []);
      await MNTaskManager.changeTaskType(notesToProcess);
    } catch (error) {
      MNUtil.log(`❌ changeTaskType 执行失败: ${error.message || error}`);
      MNUtil.showHUD(`修改类型失败: ${error.message || "未知错误"}`);
    }
  });

  // updateChildrenPaths - 更新子卡片路径
  MNTaskGlobal.registerCustomAction("updateChildrenPaths", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    // 使用 focusNotes（支持多选）或单个 focusNote
    const notesToProcess = focusNotes && focusNotes.length > 0 ? focusNotes : (focusNote ? [focusNote] : []);
    
    if (notesToProcess.length === 0) {
      MNUtil.showHUD("请先选择要更新的任务卡片", 2);
      return;
    }
    
    // 调用 MNTaskManager 的批量更新方法
    MNTaskManager.batchUpdateChildrenPaths(notesToProcess);
  });

  // batchTaskCardMakeByHierarchy - 根据层级批量制卡
  MNTaskGlobal.registerCustomAction("batchTaskCardMakeByHierarchy", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    try {
      await MNTaskManager.batchCreateByHierarchy(focusNote);
    } catch (error) {
      MNUtil.log(`❌ batchTaskCardMakeByHierarchy 执行失败: ${error.message || error}`);
      MNUtil.showHUD(`批量制卡失败: ${error.message || "未知错误"}`);
    }
  });


  // achieveCards - 归档卡片
  MNTaskGlobal.registerCustomAction("achieveCards", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    try {
      // 获取要处理的卡片
      const notesToProcess = focusNotes && focusNotes.length > 0 ? focusNotes : (focusNote ? [focusNote] : []);
      
      if (notesToProcess.length === 0) {
        MNUtil.showHUD("请先选择要归档的任务卡片");
        return;
      }
      
      // 筛选出已完成的任务卡片
      const completedNotes = notesToProcess.filter(note => {
        if (!MNTaskManager.isTaskCard(note)) return false;
        const titleParts = MNTaskManager.parseTaskTitle(note.noteTitle);
        return titleParts.status === "已完成";
      });
      
      if (completedNotes.length === 0) {
        MNUtil.showHUD("没有已完成的任务可以归档");
        return;
      }
      
      // 获取已完成归档区ID
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
      
      // 显示确认对话框
      const confirmMsg = `确认归档 ${completedNotes.length} 个已完成的任务？\n\n归档后任务将移动到已完成归档区，状态更新为"已归档"。`;
      
      const buttonIndex = await MNUtil.confirm("归档任务确认", confirmMsg);
      
      if (buttonIndex !== 1) {
        // 用户点击取消
        return;
      }
      
      // 执行归档
      MNUtil.undoGrouping(() => {
        let successCount = 0;
        let failCount = 0;
        
        completedNotes.forEach(note => {
          try {
            // 更新状态为已归档
            MNTaskManager.updateTaskStatus(note, "已归档");
            
            // 移动到归档区
            const success = MNTaskManager.moveTo(note, completedBoardNote);
            
            if (success) {
              // 添加归档时间记录
              const archiveTime = new Date().toLocaleString('zh-CN');
              note.appendMarkdownComment(`📦 归档时间：${archiveTime}`);
              
              // 刷新卡片
              note.refresh();
              successCount++;
            } else {
              failCount++;
              MNUtil.log(`归档失败：${note.noteTitle}`);
            }
          } catch (error) {
            failCount++;
            MNUtil.log(`归档出错：${error.message}`);
          }
        });
        
        // 刷新归档区
        completedBoardNote.refresh();
        
        // 显示结果
        if (failCount === 0) {
          MNUtil.showHUD(`✅ 成功归档 ${successCount} 个任务`);
        } else {
          MNUtil.showHUD(`⚠️ 归档完成\n成功：${successCount} 个\n失败：${failCount} 个`);
        }
      });
      
    } catch (error) {
      MNUtil.log(`❌ achieveCards 执行失败: ${error.message || error}`);
      MNUtil.showHUD(`归档失败: ${error.message || "未知错误"}`);
    }
  });

  // renewCards - 更新卡片
  MNTaskGlobal.registerCustomAction("renewCards", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    try {
      // 获取要处理的卡片
      const notesToProcess = focusNotes && focusNotes.length > 0 ? focusNotes : (focusNote ? [focusNote] : []);
      
      if (notesToProcess.length === 0) {
        MNUtil.showHUD("请先选择要更新的任务卡片");
        return;
      }
      
      // 筛选出任务卡片
      const taskNotes = notesToProcess.filter(note => MNTaskManager.isTaskCard(note));
      
      if (taskNotes.length === 0) {
        MNUtil.showHUD("请选择任务卡片");
        return;
      }
      
      // 显示更新选项
      const updateOptions = [
        "更新任务标题前缀的路径",
        "更新链接与所属关系",
        "清理失效链接",
        "刷新任务字段",
        "全部更新"
      ];
      
      const selectedIndex = await MNUtil.userSelect("选择更新类型", `将更新 ${taskNotes.length} 个任务卡片`, updateOptions);
      
      if (selectedIndex === 0) return; // 用户取消
      
      const selectedOption = updateOptions[selectedIndex - 1];
      
      MNUtil.undoGrouping(() => {
        let successCount = 0;
        let failCount = 0;
        const errors = [];
        
        taskNotes.forEach(note => {
          try {
            let updated = false;
            
            switch (selectedOption) {
              case "更新任务路径":
                MNTaskManager.updateTaskPath(note);
                updated = true;
                break;
                
              case "更新链接关系":
                MNTaskManager.updateTaskLinkRelationship(note);
                updated = true;
                break;
                
              case "清理失效链接":
                MNTaskManager.cleanupBrokenLinks(note);
                updated = true;
                break;
                
              case "刷新任务字段":
                // 重新添加任务字段（保留现有内容）
                MNTaskManager.refreshTaskFields(note);
                updated = true;
                break;
                
              case "全部更新":
                // 执行所有更新操作
                MNTaskManager.updateTaskPath(note);
                MNTaskManager.updateTaskLinkRelationship(note);
                MNTaskManager.cleanupBrokenLinks(note);
                MNTaskManager.refreshTaskFields(note);
                updated = true;
                break;
            }
            
            if (updated) {
              // 刷新卡片显示
              note.refresh();
              successCount++;
              
              // 如果有父卡片，也刷新父卡片
              if (note.parentNote && MNTaskManager.isTaskCard(note.parentNote)) {
                note.parentNote.refresh();
              }
            }
            
          } catch (error) {
            failCount++;
            errors.push(`${note.noteTitle}: ${error.message}`);
            MNUtil.log(`更新失败：${error.message}`);
          }
        });
        
        // 递归更新子卡片（如果选择了更新路径或全部更新）
        if (selectedOption === "更新任务路径" || selectedOption === "全部更新") {
          taskNotes.forEach(note => {
            try {
              const childNotes = note.childNotes.filter(child => MNTaskManager.isTaskCard(child));
              if (childNotes.length > 0) {
                MNTaskManager.batchUpdateChildrenPaths([note]);
              }
            } catch (error) {
              MNUtil.log(`更新子卡片路径失败：${error.message}`);
            }
          });
        }
        
        // 显示结果
        if (failCount === 0) {
          MNUtil.showHUD(`✅ 成功更新 ${successCount} 个任务卡片`);
        } else {
          let errorMsg = `⚠️ 更新完成\n成功：${successCount} 个\n失败：${failCount} 个`;
          if (errors.length > 0 && errors.length <= 3) {
            errorMsg += `\n\n错误详情：\n${errors.join('\n')}`;
          }
          MNUtil.showHUD(errorMsg);
        }
      });
      
    } catch (error) {
      MNUtil.log(`❌ renewCards 执行失败: ${error.message || error}`);
      MNUtil.showHUD(`更新失败: ${error.message || "未知错误"}`);
    }
  });





  // editCustomField - 编辑自定义字段
  MNTaskGlobal.registerCustomAction("editCustomField", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    if (!focusNote) {
      MNUtil.showHUD("请先选择一个任务");
      return;
    }
    
    // 检查是否是任务卡片
    if (!MNTaskManager.isTaskCard(focusNote)) {
      MNUtil.showHUD("请先将卡片转换为任务卡片");
      return;
    }
    
    // 获取信息字段下的所有子字段
    const subFields = MNTaskManager.getSubFieldsUnderInfo(focusNote);
    
    if (subFields.length === 0) {
      MNUtil.showHUD("没有找到可编辑的字段");
      return;
    }
    
    // 准备字段名列表作为按钮（参考 MNMath 的做法）
    const fieldButtons = subFields.map(field => `${field.fieldName}: ${field.content || '(空)'}`);
    
    // 第一步：使用 UIAlertView 让用户选择字段
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "选择要编辑的字段",
      "点击下方字段进行编辑",
      0,  // 普通样式，无输入框
      "取消",
      fieldButtons,  // 字段名作为按钮数组
      (alert, buttonIndex) => {
        if (buttonIndex === 0) return; // 用户点击取消
        
        const selectedField = subFields[buttonIndex - 1];
        
        // 第二步：弹出输入框编辑内容
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          `编辑字段：${selectedField.fieldName}`,
          `当前内容：${selectedField.content || '(空)'}`,
          2,  // 输入框样式
          "取消",
          ["确定"],
          (alert2, buttonIndex2) => {
            if (buttonIndex2 === 1) {
              const newContent = alert2.textFieldAtIndex(0).text || "";
              
              MNUtil.undoGrouping(() => {
                try {
                  // 获取该字段的评论对象
                  const comment = selectedField.comment;
                  
                  // 重新构建字段内容
                  const fieldHtml = TaskFieldUtils.createFieldHtml(selectedField.fieldName, 'subField');
                  const fullContent = newContent.trim() ? `${fieldHtml} ${newContent.trim()}` : fieldHtml;
                  
                  // 直接修改评论的文本
                  comment.text = fullContent;
                  
                  // 刷新卡片
                  focusNote.refresh();
                  
                  MNUtil.showHUD(`✅ 已更新字段：${selectedField.fieldName}`);
                } catch (error) {
                  MNUtil.showHUD("更新字段失败：" + error.message);
                }
              });
            }
          }
        );
        
        // 延迟后设置输入框的默认值
        MNUtil.delay(0.1).then(() => {
          const textField = alert2.textFieldAtIndex(0);
          if (textField) {
            textField.text = selectedField.content || "";
          }
        });
      }
    );
  });


  // addOrUpdateLaunchLink - 添加或更新启动链接
  MNTaskGlobal.registerCustomAction("addOrUpdateLaunchLink", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    if (!focusNote) {
      MNUtil.showHUD("请先选择一个任务", 2);
      return;
    }
    
    // 检查是否是任务卡片
    if (!MNTaskManager.isTaskCard(focusNote)) {
      MNUtil.showHUD("请先将卡片转换为任务卡片", 2);
      return;
    }
    
    // 获取剪切板内容
    const clipboardText = MNUtil.clipboardText;
    const defaultLaunchLink = "marginnote4app://uistatus/H4sIAAAAAAAAE5VSy5LbIBD8F87SFuIp%2BWbJ5VxyyCG3VCqF0LBmg4VKoM06W%2F73AHbiveY2j56mp5l3NHr%2F8zxxtEOGgNbYMNNJGGmHJWAsmRg7wRQIojpDZQtEj5ibpm0apeRI5ahBcKEx4agqZGFxNqIdzlmM%2Fjx5jXZGuQAV0mqdRv9WujmG6Q7Vzv%2BGB8zPEeYYSivNO3WB1U5JI2MDYw0b6l4OtGb7o6h72rY1wU2Hh33Ph%2BMh6YC3ND%2Bd%2FQSFwlgHNzLjvIpntdwSr7cw%2BwiFuj%2F27ND2pO4IYTXjvajbLqf4yEk74D2lXaI2m3MfV0pkn71W0foZ7d6RNyZAzNGPl%2BDnV%2BU2%2BHpZkg40fPri7RwTRzbgibWSck6YbEUjGO1khS6lzgWThLNUo7jlmF8rFLRyeZUnIiiTVGDcsK5JGHEtCgI4F9Kr375XyC%2Bw3uXgD5kfX26FLTo7P7xe1DMkf1O5tBc1gysTRUv6f960mLKOcdJgUqEVAqhVnwp6hVcLv26hfT7dnL0T32D5Iko%2F2AlGtT7a%2BUzsbHz2SvstGbNr0jZRjeFkpwnmf9B4gnM28ABGbS4bGP1i9f8cRJb59zCvfwCp6rmF9QIAAA%3D%3D";
    
    // 检查是否是 MarginNote UI 状态链接，如果不是则使用默认链接
    let linkToUse;
    if (clipboardText && clipboardText.startsWith("marginnote4app://uistatus/")) {
      linkToUse = clipboardText;
      MNUtil.log("✅ 使用剪切板中的链接");
    } else {
      linkToUse = defaultLaunchLink;
      MNUtil.log("📋 使用默认启动链接");
    }
    
    MNUtil.undoGrouping(() => {
      try {
        // 构建特殊的字段内容：字段名即是 Markdown 链接
        const launchLink = `[启动](${linkToUse})`;
        const fieldHtml = TaskFieldUtils.createFieldHtml(launchLink, 'subField');
        
        // 检查是否已有"启动"字段
        const existingIndex = focusNote.getIncludingCommentIndex("[启动]");
        
        if (existingIndex !== -1) {
          // 更新现有字段
          focusNote.replaceWithMarkdownComment(fieldHtml, existingIndex);
          MNUtil.showHUD("✅ 已更新启动链接", 2);
        } else {
          // 添加新字段
          focusNote.appendMarkdownComment(fieldHtml);
          const lastIndex = focusNote.MNComments.length - 1;
          
          // 移动到"信息"字段下
          MNTaskManager.moveCommentToField(focusNote, lastIndex, '信息', true);
          MNUtil.showHUD("✅ 已添加启动链接", 2);
        }
        
        // 刷新卡片
        focusNote.refresh();
      } catch (error) {
        MNUtil.showHUD("操作失败：" + error.message, 2);
      }
    });
  });



  // addTimestampRecord - 添加时间戳记录
  MNTaskGlobal.registerCustomAction("addTimestampRecord", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    if (!focusNote) {
      MNUtil.showHUD("请先选择一个任务");
      return;
    }
    
    try {
      // 获取当前时间
      const now = new Date();
      const timestamp = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      
      // 添加时间戳记录
      const recordText = `⏱️ ${timestamp}`;
      
      MNUtil.undoGrouping(() => {
        // 如果是任务卡片，添加到进展字段
        if (MNTaskManager.isTaskCard(focusNote)) {
          // 检查是否已有"进展"字段
          const progressIndex = focusNote.getIncludingCommentIndex("进展");
          
          if (progressIndex !== -1) {
            // 在现有进展字段后添加时间戳
            const existingComment = focusNote.MNComments[progressIndex];
            const existingText = existingComment.text || "";
            const updatedText = existingText + `\n${recordText}`;
            existingComment.text = updatedText;
          } else {
            // 创建新的进展字段
            const progressFieldHtml = TaskFieldUtils.createFieldHtml("进展", 'mainField');
            const fullContent = `${progressFieldHtml}\n${recordText}`;
            focusNote.appendMarkdownComment(fullContent);
          }
        } else {
          // 普通卡片，直接添加评论
          focusNote.appendMarkdownComment(recordText);
        }
        
        // 刷新卡片
        focusNote.refresh();
        
        MNUtil.showHUD("✅ 已添加时间戳记录");
      });
    } catch (error) {
      MNUtil.log(`❌ addTimestampRecord 执行失败: ${error.message || error}`);
      MNUtil.showHUD(`添加时间戳记录失败: ${error.message || "未知错误"}`);
    }
  });

}

// 立即调用注册函数
registerAllCustomActions();
