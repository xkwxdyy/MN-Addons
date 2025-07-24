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
  
  // pauseTask - 暂停任务（长按菜单）
  MNTaskGlobal.registerCustomAction("pauseTask", async function (context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    try {
      await MNTaskManager.pauseTask(focusNote);
    } catch (error) {
      MNUtil.log(`❌ pauseTask 执行失败: ${error.message || error}`);
      MNUtil.showHUD(`暂停任务失败: ${error.message || "未知错误"}`);
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

  MNTaskGlobal.registerCustomAction("launchTask", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    MNUtil.undoGrouping(()=>{
      try {
        MNTaskManager.launchTask(focusNote);
      } catch (error) {
        MNUtil.showHUD(error);
      }
    })
  })

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
    let linkToUse = defaultLaunchLink;
    if (clipboardText) {
      if (clipboardText.startsWith("marginnote4app://uistatus/")) {
        linkToUse = clipboardText;
        MNUtil.showHUD("✅ 更新 UI 状态链接");
      } else if (clipboardText.ifNoteIdorURL()) {
        linkToUse = clipboardText.toNoteURL()
        MNUtil.showHUD("✅ 更新卡片链接: " + MNNote.new(clipboardText).title);
      }
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
          // MNUtil.showHUD("✅ 已更新启动链接", 2);
        } else {
          // 添加新字段
          focusNote.appendMarkdownComment(fieldHtml);
          const lastIndex = focusNote.MNComments.length - 1;
          
          // 移动到"信息"字段下
          MNTaskManager.moveCommentToField(focusNote, lastIndex, '信息', true);
          // MNUtil.showHUD("✅ 已添加启动链接", 2);
        }
        
        // 刷新卡片
        focusNote.refresh();
      } catch (error) {
        MNUtil.showHUD("操作失败：" + error.message, 2);
      }
    });
  });

  MNTaskGlobal.registerCustomAction("addTimestampRecord", async function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    if (!focusNote) {
      MNUtil.showHUD("请先选择一个任务卡片");
      return;
    }
    
    // 检查是否是任务卡片
    if (!MNTaskManager.isTaskCard(focusNote)) {
      MNUtil.showHUD("请选择一个任务卡片");
      return;
    }
    
    try {
      // 弹出输入框让用户输入记录内容
      UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
        "添加记录",
        "请输入记录内容",
        2,  // 输入框样式
        "取消",
        ["确定"],
        (alert, buttonIndex) => {
          if (buttonIndex === 1) {
            const content = alert.textFieldAtIndex(0).text;
            
            if (!content || content.trim() === "") {
              MNUtil.showHUD("记录内容不能为空");
              return;
            }
            
            MNUtil.undoGrouping(() => {
              try {
                // 获取当前时间并格式化
                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const day = String(now.getDate()).padStart(2, '0');
                const hours = String(now.getHours()).padStart(2, '0');
                const minutes = String(now.getMinutes()).padStart(2, '0');
                const seconds = String(now.getSeconds()).padStart(2, '0');
                const timestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
                
                // 构建带样式的时间戳HTML
                const timestampHtml = `<div style="position:relative; padding-left:28px; margin:14px 0; color:#1E40AF; font-weight:500; font-size:0.92em">
  <div style="position:absolute; left:0; top:50%; transform:translateY(-50%); 
              width:18px; height:18px; background:conic-gradient(#3B82F6 0%, #60A5FA 50%, #3B82F6 100%); 
              border-radius:50%; display:flex; align-items:center; justify-content:center">
    <div style="width:8px; height:8px; background:white; border-radius:50%"></div>
  </div>
  ${timestamp}
</div>
${content.trim()}`;
                
                // 添加到卡片最后
                focusNote.appendMarkdownComment(timestampHtml);
                
                // 刷新卡片显示
                focusNote.refresh();
                
                MNUtil.showHUD("✅ 已添加时间戳记录");
              } catch (error) {
                MNUtil.showHUD("添加记录失败：" + error.message);
              }
            });
          }
        }
      );
    } catch (error) {
      MNUtil.log(`❌ addTimestampRecord 执行失败: ${error.message || error}`);
      MNUtil.showHUD(`添加记录失败: ${error.message || "未知错误"}`);
    }
  });
  
  // launchTask - 启动任务
  MNTaskGlobal.registerCustomAction("launchTask", function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    try {
      MNTaskManager.launchTask(focusNote);
    } catch (error) {
      MNUtil.log(`❌ launchTask 执行失败: ${error.message || error}`);
      MNUtil.showHUD(`启动任务失败: ${error.message || "未知错误"}`);
    }
  });
  
  // locateCurrentTaskInFloat - 在浮窗中定位当前任务
  MNTaskGlobal.registerCustomAction("locateCurrentTaskInFloat", function(context) {
    const { button, des, focusNote, focusNotes, self } = context;
    
    try {
      MNTaskManager.locateCurrentTaskInFloat();
    } catch (error) {
      MNUtil.log(`❌ locateCurrentTaskInFloat 执行失败: ${error.message || error}`);
      MNUtil.showHUD(`定位任务失败: ${error.message || "未知错误"}`);
    }
  });

  // 测试父子关系建立
  MNTaskGlobal.registerCustomAction("testParentChildRelation", async function(context) {
    const { focusNote } = context;
    if (!focusNote) {
      MNUtil.showHUD("❌ 请先选择一个卡片");
      return;
    }

    MNUtil.showHUD("🔧 开始测试父子关系建立...");
    
    try {
      MNUtil.log("\n========== 父子关系测试开始 ==========");
      MNUtil.log(`📋 当前卡片: ${focusNote.noteTitle}`);
      MNUtil.log(`🆔 卡片ID: ${focusNote.noteId}`);
      
      // 1. 检查当前卡片状态
      const isCurrentTaskCard = MNTaskManager.isTaskCard(focusNote);
      MNUtil.log(`\n✅ 当前卡片是否是任务卡片: ${isCurrentTaskCard ? '是' : '否'}`);
      
      // 2. 检查父卡片
      const parentNote = focusNote.parentNote;
      if (parentNote) {
        MNUtil.log(`\n👪 父卡片信息:`);
        MNUtil.log(`  - 标题: ${parentNote.noteTitle}`);
        MNUtil.log(`  - ID: ${parentNote.noteId}`);
        
        const isParentTaskCard = MNTaskManager.isTaskCard(parentNote);
        MNUtil.log(`  - 是否是任务卡片: ${isParentTaskCard ? '是' : '否'}`);
        
        if (isParentTaskCard) {
          const parentParts = MNTaskManager.parseTaskTitle(parentNote.noteTitle);
          MNUtil.log(`  - 类型: ${parentParts.type}`);
          MNUtil.log(`  - 状态: ${parentParts.status}`);
        }
      } else {
        MNUtil.log(`\n👪 没有父卡片`);
      }
      
      // 3. 执行制卡操作
      MNUtil.log(`\n🔧 执行制卡操作...`);
      const result = await MNTaskManager.convertToTaskCard(focusNote);
      
      MNUtil.log(`\n📊 制卡结果: ${result.type}`);
      
      if (result.type === 'created' || result.type === 'upgraded') {
        // 4. 检查字段创建情况
        const parsed = MNTaskManager.parseTaskComments(focusNote);
        MNUtil.log(`\n📋 字段检查:`);
        MNUtil.log(`  - 信息字段: ${parsed.info ? '✅ 有' : '❌ 无'}`);
        MNUtil.log(`  - 包含字段: ${parsed.contains ? '✅ 有' : '❌ 无'}`);
        MNUtil.log(`  - 所属字段: ${parsed.belongsTo ? '✅ 有' : '❌ 无'}`);
        MNUtil.log(`  - 启动字段: ${parsed.launch ? '✅ 有' : '❌ 无'}`);
        MNUtil.log(`  - 进展字段: ${parsed.progress ? '✅ 有' : '❌ 无'}`);
        
        // 重点检查所属字段
        if (parentNote && MNTaskManager.isTaskCard(parentNote)) {
          if (parsed.belongsTo) {
            MNUtil.log(`\n✅ 所属字段已创建:`);
            MNUtil.log(`  - 索引: ${parsed.belongsTo.index}`);
            MNUtil.log(`  - 内容: ${parsed.belongsTo.text}`);
          } else {
            MNUtil.log(`\n❌ 应该有所属字段但没有创建！`);
          }
        }
        
        // 5. 检查父任务中的链接
        if (parentNote && MNTaskManager.isTaskCard(parentNote)) {
          MNUtil.log(`\n📎 检查父任务中的链接:`);
          
          // 获取所有指向当前卡片的链接
          const links = [];
          parentNote.MNComments.forEach((comment, index) => {
            if (comment && comment.type === "linkComment") {
              try {
                // 检查链接是否指向当前卡片
                if (comment.noteid === focusNote.noteId || 
                    (comment.note && comment.note.noteId === focusNote.noteId)) {
                  links.push({ comment, index });
                }
              } catch (e) {
                MNUtil.log(`  - 检查链接 ${index} 时出错: ${e.message}`);
              }
            }
          });
          
          MNUtil.log(`  - 找到 ${links.length} 个指向子任务的链接`);
          
          if (links.length > 0) {
            // 获取父任务的解析信息
            const parentParsed = MNTaskManager.parseTaskComments(parentNote);
            const childStatus = MNTaskManager.parseTaskTitle(focusNote.noteTitle).status || '未开始';
            
            links.forEach((link, i) => {
              MNUtil.log(`  - 链接${i+1}:`);
              MNUtil.log(`    - 位置索引: ${link.index}`);
              
              // 检查链接是否在正确的字段下
              let expectedField = childStatus;
              if (parentParsed.type === "动作") {
                expectedField = "信息";
              }
              
              // 查找链接应该在的字段位置
              let expectedFieldIndex = -1;
              parentParsed.taskFields.forEach(field => {
                if (field.content === expectedField) {
                  expectedFieldIndex = field.index;
                }
              });
              
              if (expectedFieldIndex !== -1) {
                MNUtil.log(`    - 应该在 "${expectedField}" 字段下 (索引 ${expectedFieldIndex})`);
                if (link.index > expectedFieldIndex) {
                  MNUtil.log(`    - ✅ 位置正确`);
                } else {
                  MNUtil.log(`    - ❌ 位置错误，在字段之前`);
                }
              }
            });
          } else {
            MNUtil.log(`  - ❌ 没有找到指向子任务的链接！`);
          }
        }
        
        // 6. 测试结果总结
        MNUtil.log(`\n========== 测试总结 ==========`);
        const issues = [];
        
        if (parentNote && MNTaskManager.isTaskCard(parentNote) && !parsed.belongsTo) {
          issues.push("缺少所属字段");
        }
        
        if (parentNote && MNTaskManager.isTaskCard(parentNote)) {
          const links = parentNote.MNComments.filter(c => 
            c && c.type === "linkComment" && 
            (c.noteid === focusNote.noteId || (c.note && c.note.noteId === focusNote.noteId))
          );
          if (links.length === 0) {
            issues.push("父任务中没有子任务链接");
          }
        }
        
        if (issues.length === 0) {
          MNUtil.showHUD("✅ 父子关系建立正确！");
          MNUtil.log("✅ 所有检查通过");
        } else {
          MNUtil.showHUD(`❌ 发现问题：${issues.join(", ")}`);
          MNUtil.log(`❌ 发现以下问题：`);
          issues.forEach(issue => MNUtil.log(`  - ${issue}`));
        }
        
      } else {
        MNUtil.showHUD(`⚠️ 制卡失败: ${result.type} - ${result.reason || result.error}`);
      }
      
    } catch (error) {
      MNUtil.showHUD(`❌ 测试失败: ${error.message}`);
      MNUtil.log(`❌ 错误详情: ${error.stack}`);
    }
  });

}

// 立即调用注册函数
registerAllCustomActions();
