/**
 * MN Task - MarginNote 插件框架示例
 * 本插件展示了 MarginNote 插件开发的核心架构
 * 包括多面板切换、菜单系统、配置管理等功能
 */

JSB.newAddon = function (mainPath) {
  // 加载必要的模块
  JSB.require('utils')
  JSB.require('config')
  JSB.require('panelController')
  JSB.require('settingsController')
  JSB.require('floatController')
  
  // 检查 MNUtils 依赖
  if (!TaskUtils.checkMNUtils(mainPath)) { 
    return undefined 
  }
  
  // 获取实例函数（重要模式！避免 this 引用问题）
  const getMNTaskInstance = () => self
  
  // 定义插件主类
  var MNTaskClass = JSB.defineClass(
    'MNTask : JSExtension',
    {
      // ========== 生命周期方法 ==========
      
      /**
       * 场景连接时调用（插件启动）
       */
      sceneWillConnect: async function () {
        try {
          let self = getMNTaskInstance()
          
          // 基础初始化
          self.init(mainPath)
          
          // 初始化状态
          self.isNewWindow = false
          self.currentPanel = null
          
          // 注册观察者
          self.addObserver('onPopupMenuOnSelection:', 'PopupMenuOnSelection')
          self.addObserver('onPopupMenuOnNote:', 'PopupMenuOnNote')
          self.addObserver('onProcessNewExcerpt:', 'ProcessNewExcerpt')
          self.addObserver('onAddonBroadcast:', 'AddonBroadcast')
          
          TaskUtils.log("✅ MNTask 插件已启动")
          
        } catch (error) {
          TaskUtils.addErrorLog(error, "sceneWillConnect")
        }
      },
      
      /**
       * 场景断开时调用（插件关闭）
       */
      sceneDidDisconnect: function () {
        if (typeof MNUtil === 'undefined') return
        
        let self = getMNTaskInstance()
        
        // 移除观察者
        let names = [
          'PopupMenuOnSelection',
          'PopupMenuOnNote', 
          'ProcessNewExcerpt',
          'AddonBroadcast'
        ]
        self.removeObservers(names)
        
        // 清理资源
        self.cleanup()
        
        TaskUtils.log("👋 MNTask 插件已关闭")
      },
      
      /**
       * 笔记本打开时调用
       */
      notebookWillOpen: async function (notebookid) {
        try {
          let self = getMNTaskInstance()
          
          // 确保初始化
          if (!self.mainPath) {
            self.init(mainPath)
          }
          
          // 确保控制器存在
          self.ensurePanelController()
          self.ensureSettingsController()
          self.ensureFloatController()
          
          // 加载配置
          TaskConfig.load()
          
          // 刷新插件命令
          MNUtil.refreshAddonCommands()
          
          // 延迟初始化（等待界面准备完成）
          MNUtil.delay(1).then(() => {
            self.setupUI()
          })
          
        } catch (error) {
          TaskUtils.addErrorLog(error, "notebookWillOpen")
        }
      },
      
      /**
       * 文档打开时调用
       */
      documentDidOpen: function (docMd5) {
        TaskUtils.log("📄 文档已打开: " + docMd5)
      },
      
      // ========== 初始化方法 ==========
      
      /**
       * 插件初始化
       */
      init: function(path) {
        let self = getMNTaskInstance()
        
        self.mainPath = path
        self.panelController = null
        self.settingsController = null
        self.floatController = null
        self.isInitialized = true
        
        // 初始化工具类
        TaskUtils.init(path)
        
        TaskUtils.log("🚀 MNTask 初始化完成")
      },
      
      /**
       * 设置UI
       */
      setupUI: function() {
        let self = getMNTaskInstance()
        
        // 添加工具栏按钮（如果支持）
        if (MNUtil.studyController && MNUtil.studyController.studyBar) {
          self.addToolbarButton()
        }
      },
      
      /**
       * 添加工具栏按钮
       */
      addToolbarButton: function() {
        let self = getMNTaskInstance()
        
        // 这里可以添加工具栏按钮逻辑
        // 由于 MarginNote 的限制，通常通过菜单系统访问插件
      },
      
      // ========== 面板管理 ==========
      
      /**
       * 确保主面板控制器存在
       */
      ensurePanelController: function() {
        let self = getMNTaskInstance()
        
        if (!self.panelController) {
          self.panelController = panelController.new()
          self.panelController.mainPath = self.mainPath
          self.panelController.parent = self
        }
        
        // 确保视图在正确的父视图中
        TaskUtils.ensureViewInStudyView(self.panelController.view)
      },
      
      /**
       * 确保设置控制器存在
       */
      ensureSettingsController: function() {
        let self = getMNTaskInstance()
        
        if (!self.settingsController) {
          self.settingsController = settingsController.new()
          self.settingsController.mainPath = self.mainPath
          self.settingsController.parent = self
        }
        
        TaskUtils.ensureViewInStudyView(self.settingsController.view)
      },
      
      /**
       * 确保浮动控制器存在
       */
      ensureFloatController: function() {
        let self = getMNTaskInstance()
        
        if (!self.floatController) {
          self.floatController = floatController.new()
          self.floatController.mainPath = self.mainPath
          self.floatController.parent = self
        }
        
        TaskUtils.ensureViewInStudyView(self.floatController.view)
      },
      
      // ========== 面板操作 ==========
      
      /**
       * 打开主面板
       */
      openMainPanel: function() {
        let self = getMNTaskInstance()
        
        self.ensurePanelController()
        self.hideAllPanels()
        
        self.panelController.show()
        self.currentPanel = 'main'
        
        MNUtil.showHUD("📋 主面板已打开")
      },
      
      /**
       * 打开设置面板
       */
      openSettingsPanel: function() {
        let self = getMNTaskInstance()
        
        self.ensureSettingsController()
        self.hideAllPanels()
        
        self.settingsController.show()
        self.currentPanel = 'settings'
        
        MNUtil.showHUD("⚙️ 设置面板已打开")
      },
      
      /**
       * 打开浮动面板
       */
      openFloatPanel: function() {
        let self = getMNTaskInstance()
        
        self.ensureFloatController()
        self.hideAllPanels()
        
        self.floatController.show()
        self.currentPanel = 'float'
        
        MNUtil.showHUD("🎈 浮动面板已打开")
      },
      
      /**
       * 隐藏所有面板
       */
      hideAllPanels: function() {
        let self = getMNTaskInstance()
        
        if (self.panelController) {
          self.panelController.hide()
        }
        if (self.settingsController) {
          self.settingsController.hide()
        }
        if (self.floatController) {
          self.floatController.hide()
        }
        
        self.currentPanel = null
      },
      
      // ========== 事件处理 ==========
      
      /**
       * 选中文本时的弹出菜单
       */
      onPopupMenuOnSelection: async function (sender) {
        try {
          let self = getMNTaskInstance()
          
          // 获取选中文本
          let selectedText = sender.userInfo.documentController.selectionText
          TaskUtils.currentSelection = selectedText
          
          // 添加菜单项
          sender.userInfo.menuController.commandTable.push({
            title: "🚀 MN Task - 处理选中文本",
            object: self,
            selector: 'processSelection:',
            param: {
              text: selectedText,
              rect: sender.userInfo.winRect
            }
          })
          
        } catch (error) {
          TaskUtils.addErrorLog(error, "onPopupMenuOnSelection")
        }
      },
      
      /**
       * 笔记菜单
       */
      onPopupMenuOnNote: async function (sender) {
        try {
          let self = getMNTaskInstance()
          
          let note = MNNote.new(sender.userInfo.note.noteId)
          
          // 添加菜单组
          sender.userInfo.menuController.commandTable.push({
            title: "🎯 MN Task 功能",
            object: self,
            selector: 'showTaskMenu:',
            param: {
              noteId: note.noteId
            }
          })
          
        } catch (error) {
          TaskUtils.addErrorLog(error, "onPopupMenuOnNote")
        }
      },
      
      /**
       * 处理新摘录
       */
      onProcessNewExcerpt: async function (sender) {
        try {
          let note = MNNote.new(sender.userInfo.noteid)
          
          // 这里可以添加自动处理新摘录的逻辑
          TaskUtils.log("📝 新摘录创建: " + note.noteTitle)
          
        } catch (error) {
          TaskUtils.addErrorLog(error, "onProcessNewExcerpt")
        }
      },
      
      /**
       * 插件广播（URL Scheme 支持）
       */
      onAddonBroadcast: async function (sender) {
        try {
          let message = sender.userInfo.message
          
          // 处理 URL Scheme: marginnote4app://addon/mntask?action=xxx
          if (/mntask\?/.test(message)) {
            let params = TaskUtils.parseURLParams(message)
            
            switch (params.action) {
              case "open":
                self.openMainPanel()
                break
              case "settings":
                self.openSettingsPanel()
                break
              case "float":
                self.openFloatPanel()
                break
              default:
                MNUtil.showHUD("未知操作: " + params.action)
            }
          }
          
        } catch (error) {
          TaskUtils.addErrorLog(error, "onAddonBroadcast")
        }
      },
      
      // ========== 菜单处理 ==========
      
      /**
       * 显示任务菜单
       */
      showTaskMenu: function(params) {
        let self = getMNTaskInstance()
        
        let noteId = params.noteId
        let button = MNUtil.getPopoverButton()
        
        var commandTable = [
          {title: '📋 打开主面板', object: self, selector: 'openMainPanel:', param: null},
          {title: '⚙️ 打开设置', object: self, selector: 'openSettingsPanel:', param: null},
          {title: '🎈 浮动窗口', object: self, selector: 'openFloatPanel:', param: null},
          {title: '➕ 添加任务', object: self, selector: 'addTask:', param: noteId},
          {title: '🏷️ 设置标签', object: self, selector: 'setTags:', param: noteId},
          {title: '🎨 更改颜色', object: self, selector: 'changeColor:', param: noteId}
        ]
        
        self.popoverController = TaskUtils.getPopoverAndPresent(
          button, 
          commandTable, 
          200,
          2
        )
      },
      
      /**
       * 处理选中文本
       */
      processSelection: function(params) {
        let text = params.text
        
        MNUtil.showHUD("处理文本: " + text.substring(0, 20) + "...", 2)
        
        // 这里可以添加处理逻辑
        // 例如：创建笔记、搜索、翻译等
      },
      
      /**
       * 添加任务
       */
      addTask: function(noteId) {
        let note = MNNote.new(noteId)
        
        MNUtil.undoGrouping(() => {
          // 添加任务标签
          note.appendTags(["📌 任务"])
          
          // 设置颜色
          note.colorIndex = 3 // 黄色
          
          // 添加评论
          note.appendTextComment("任务创建时间: " + new Date().toLocaleString())
        })
        
        MNUtil.showHUD("✅ 任务已创建")
      },
      
      /**
       * 设置标签
       */
      setTags: async function(noteId) {
        let note = MNNote.new(noteId)
        
        let result = await MNUtil.input(
          "设置标签",
          "请输入标签（用空格分隔）：",
          note.tags.join(" ")
        )
        
        if (result) {
          let tags = result.split(" ").filter(t => t.length > 0)
          
          MNUtil.undoGrouping(() => {
            note.tags = tags
          })
          
          MNUtil.showHUD("✅ 标签已更新")
        }
      },
      
      /**
       * 更改颜色
       */
      changeColor: function(noteId) {
        let self = getMNTaskInstance()
        let note = MNNote.new(noteId)
        let button = MNUtil.getPopoverButton()
        
        let colors = [
          {title: '⬜ 无颜色', color: -1},
          {title: '🟨 黄色', color: 0},
          {title: '🟧 橙色', color: 1},
          {title: '🟦 蓝色', color: 2},
          {title: '🟩 绿色', color: 3},
          {title: '🟥 红色', color: 4},
          {title: '🟪 紫色', color: 5}
        ]
        
        var commandTable = colors.map(item => ({
          title: item.title,
          object: self,
          selector: 'applyColor:',
          param: {noteId: noteId, color: item.color},
          checked: note.colorIndex === item.color
        }))
        
        self.colorPopover = TaskUtils.getPopoverAndPresent(
          button,
          commandTable,
          150,
          2
        )
      },
      
      /**
       * 应用颜色
       */
      applyColor: function(params) {
        let note = MNNote.new(params.noteId)
        
        MNUtil.undoGrouping(() => {
          note.colorIndex = params.color
        })
        
        if (self.colorPopover) {
          self.colorPopover.dismissPopoverAnimated(true)
        }
        
        MNUtil.showHUD("✅ 颜色已更改")
      },
      
      // ========== 清理方法 ==========
      
      /**
       * 清理资源
       */
      cleanup: function() {
        let self = getMNTaskInstance()
        
        // 移除视图
        if (self.panelController && self.panelController.view) {
          self.panelController.view.removeFromSuperview()
        }
        if (self.settingsController && self.settingsController.view) {
          self.settingsController.view.removeFromSuperview()
        }
        if (self.floatController && self.floatController.view) {
          self.floatController.view.removeFromSuperview()
        }
        
        // 清空引用
        self.panelController = null
        self.settingsController = null
        self.floatController = null
        
        // 保存配置
        TaskConfig.save()
      }
    }
  )
  
  // ========== 原型扩展 ==========
  
  /**
   * 添加观察者
   */
  MNTaskClass.prototype.addObserver = function(selector, name) {
    NSNotificationCenter.defaultCenter().addObserverSelectorName(this, selector, name)
  }
  
  /**
   * 移除观察者
   */
  MNTaskClass.prototype.removeObservers = function(names) {
    let self = this
    names.forEach(name => {
      NSNotificationCenter.defaultCenter().removeObserverName(self, name)
    })
  }
  
  return MNTaskClass
}