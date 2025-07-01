/**
 * 任务设置控制器
 * 管理任务管理器的配置选项
 */

const getTaskSettingsController = () => self

var TaskSettingsController = JSB.defineClass("TaskSettingsController : UITableViewController", {
  // 初始化
  viewDidLoad: function() {
    let self = getTaskSettingsController()
    
    self.navigationItem.title = "任务设置"
    
    // 关闭按钮
    const closeButton = UIBarButtonItem.alloc().initWithTitleStyleTargetAction(
      "完成",
      0,
      self,
      "close"
    )
    self.navigationItem.rightBarButtonItem = closeButton
    
    // 设置表格样式
    self.tableView.backgroundColor = UIColor.systemGroupedBackgroundColor()
    
    // 定义设置项
    self.sections = [
      {
        title: "显示选项",
        rows: [
          {
            title: "显示已完成任务",
            type: "switch",
            key: "showCompleted",
            value: taskConfig.showCompleted
          },
          {
            title: "显示已取消任务",
            type: "switch",
            key: "showCancelled",
            value: taskConfig.showCancelled
          }
        ]
      },
      {
        title: "排序方式",
        rows: [
          {
            title: "优先级",
            type: "checkmark",
            key: "priority",
            selected: taskConfig.sortBy === "priority"
          },
          {
            title: "截止日期",
            type: "checkmark",
            key: "dueDate",
            selected: taskConfig.sortBy === "dueDate"
          },
          {
            title: "创建时间",
            type: "checkmark",
            key: "createDate",
            selected: taskConfig.sortBy === "createDate"
          },
          {
            title: "任务状态",
            type: "checkmark",
            key: "status",
            selected: taskConfig.sortBy === "status"
          }
        ]
      },
      {
        title: "界面设置",
        rows: [
          {
            title: "显示进度条",
            type: "switch",
            key: "showProgress",
            value: taskConfig.showProgress
          },
          {
            title: "显示截止日期",
            type: "switch",
            key: "showDueDate",
            value: taskConfig.showDueDate
          }
        ]
      },
      {
        title: "任务管理",
        rows: [
          {
            title: "清空已完成任务",
            type: "button",
            action: "clearCompletedTasks",
            destructive: true
          },
          {
            title: "导出任务报告",
            type: "button",
            action: "exportReport"
          }
        ]
      }
    ]
    
    if (typeof MNUtil !== "undefined" && MNUtil.log) {
      MNUtil.log("🔧 TaskSettingsController initialized")
    }
  },
  
  // UITableView 数据源方法
  numberOfSectionsInTableView: function(tableView) {
    let self = getTaskSettingsController()
    return self.sections.length
  },
  
  tableViewNumberOfRowsInSection: function(tableView, section) {
    let self = getTaskSettingsController()
    return self.sections[section].rows.length
  },
  
  tableViewTitleForHeaderInSection: function(tableView, section) {
    let self = getTaskSettingsController()
    return self.sections[section].title
  },
  
  tableViewCellForRowAtIndexPath: function(tableView, indexPath) {
    let self = getTaskSettingsController()
    
    const section = self.sections[indexPath.section]
    const row = section.rows[indexPath.row]
    
    let cell = tableView.dequeueReusableCellWithIdentifier("Cell")
    if (!cell) {
      cell = UITableViewCell.alloc().initWithStyleReuseIdentifier(0, "Cell")
    }
    
    cell.textLabel.text = row.title
    cell.selectionStyle = 0 // 无选中效果
    
    // 根据类型配置单元格
    switch (row.type) {
      case "switch":
        // 创建开关
        const switchView = UISwitch.new()
        switchView.on = row.value
        switchView.tag = indexPath.section * 100 + indexPath.row
        switchView.addTargetActionForControlEvents(self, "switchChanged:", 1 << 12)
        cell.accessoryView = switchView
        break
        
      case "checkmark":
        // 显示勾选标记
        cell.accessoryType = row.selected ? 3 : 0
        cell.selectionStyle = 3 // 默认选中样式
        break
        
      case "button":
        // 按钮样式
        cell.textLabel.textColor = row.destructive ? 
          UIColor.systemRedColor() : UIColor.systemBlueColor()
        cell.textLabel.textAlignment = 1 // 居中
        cell.selectionStyle = 3
        break
    }
    
    return cell
  },
  
  // UITableView 委托方法
  tableViewDidSelectRowAtIndexPath: function(tableView, indexPath) {
    let self = getTaskSettingsController()
    
    const section = self.sections[indexPath.section]
    const row = section.rows[indexPath.row]
    
    tableView.deselectRowAtIndexPathAnimated(indexPath, true)
    
    switch (row.type) {
      case "checkmark":
        // 处理排序方式选择
        self.handleSortSelection(indexPath)
        break
        
      case "button":
        // 处理按钮点击
        if (row.action === "clearCompletedTasks") {
          self.clearCompletedTasks()
        } else if (row.action === "exportReport") {
          self.exportReport()
        }
        break
    }
  },
  
  // 开关状态改变
  switchChanged: function(sender) {
    let self = getTaskSettingsController()
    
    const section = Math.floor(sender.tag / 100)
    const row = sender.tag % 100
    const setting = self.sections[section].rows[row]
    
    // 更新配置
    taskConfig[setting.key] = sender.on
    taskConfig.save()
    
    // 通知任务管理器刷新
    if (self.delegate && self.delegate.refreshTaskList) {
      self.delegate.refreshTaskList()
    }
    
    MNUtil.showHUD("✅ 设置已保存")
  },
  
  // 处理排序选择
  handleSortSelection: function(indexPath) {
    let self = getTaskSettingsController()
    
    const sortSection = 1 // 排序方式在第二个分组
    if (indexPath.section !== sortSection) return
    
    // 取消其他选中
    for (let i = 0; i < self.sections[sortSection].rows.length; i++) {
      self.sections[sortSection].rows[i].selected = false
    }
    
    // 选中当前项
    const selectedRow = self.sections[sortSection].rows[indexPath.row]
    selectedRow.selected = true
    
    // 更新配置
    taskConfig.sortBy = selectedRow.key
    taskConfig.save()
    
    // 刷新表格
    self.tableView.reloadData()
    
    // 通知任务管理器刷新
    if (self.delegate && self.delegate.refreshTaskList) {
      self.delegate.refreshTaskList()
    }
    
    MNUtil.showHUD("✅ 排序方式已更新")
  },
  
  // 清空已完成任务
  clearCompletedTasks: function() {
    let self = getTaskSettingsController()
    
    MNUtil.confirm(
      "清空已完成任务",
      "确定要删除所有已完成的任务吗？此操作不可撤销。",
      ["取消", "清空"]
    ).then(result => {
      if (result === 1) {
        MNUtil.undoGrouping(() => {
          try {
            const completedTasks = TaskUtils.getTasksByStatus(
              MNUtil.currentNotebookId,
              TaskUtils.TaskStatus.COMPLETED
            )
            
            let deletedCount = 0
            completedTasks.forEach(task => {
              try {
                task.delete(true)
                deletedCount++
              } catch (error) {
                // 忽略单个删除错误
              }
            })
            
            MNUtil.showHUD(`✅ 已删除 ${deletedCount} 个已完成任务`)
            
            // 刷新任务列表
            if (self.delegate && self.delegate.refreshTaskList) {
              self.delegate.refreshTaskList()
            }
            
          } catch (error) {
            MNUtil.addErrorLog(error, "clearCompletedTasks")
            MNUtil.showHUD("❌ 清空失败")
          }
        })
      }
    })
  },
  
  // 导出报告
  exportReport: function() {
    let self = getTaskSettingsController()
    
    // 获取任务管理器实例
    const mainClass = Application.sharedInstance().delegate
    if (mainClass && mainClass.taskManager) {
      mainClass.taskManager.exportTaskReport()
    } else {
      MNUtil.showHUD("❌ 无法获取任务管理器")
    }
  },
  
  // 关闭设置
  close: function() {
    let self = getTaskSettingsController()
    self.dismissViewControllerAnimatedCompletion(true, null)
  }
})

// 静态方法：显示设置界面
TaskSettingsController.showSettings = function(parentController) {
  const settingsController = TaskSettingsController.new()
  settingsController.delegate = parentController
  
  const nav = UINavigationController.alloc().initWithRootViewController(settingsController)
  nav.modalPresentationStyle = 2 // UIModalPresentationFormSheet
  
  parentController.presentViewControllerAnimatedCompletion(nav, true, null)
}