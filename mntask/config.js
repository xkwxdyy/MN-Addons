/**
 * MNTask 配置管理系统
 * 负责保存和加载插件配置
 */

var TaskConfig = {
  // 配置键前缀
  keyPrefix: "MNTask_",
  
  // 当前配置
  config: {},
  
  // 默认配置
  defaultConfig: {
    // 界面设置
    ui: {
      mainPanelFrame: {x: 100, y: 100, width: 450, height: 500},
      settingsPanelFrame: {x: 150, y: 150, width: 400, height: 450},
      floatPanelFrame: {x: 200, y: 200, width: 300, height: 200},
      theme: "light",  // light, dark, auto
      opacity: 0.95
    },
    
    // 功能设置
    features: {
      autoProcessNewExcerpt: false,
      showFloatButton: true,
      enableShortcuts: true,
      defaultTaskColor: 3  // 黄色
    },
    
    // 任务设置
    tasks: {
      categories: ["工作", "学习", "生活", "其他"],
      priorities: ["高", "中", "低"],
      statuses: ["待办", "进行中", "已完成", "已取消"]
    },
    
    // 用户数据
    userData: {
      taskCount: 0,
      lastUsed: null,
      favorites: []
    }
  },
  
  /**
   * 获取配置键
   */
  getConfigKey: function(suffix = "config") {
    let notebookId = "default"
    
    if (typeof MNUtil !== 'undefined' && MNUtil.currentNotebook) {
      notebookId = MNUtil.currentNotebook.noteBookId || "default"
    }
    
    return this.keyPrefix + notebookId + "_" + suffix
  },
  
  /**
   * 加载配置
   */
  load: function() {
    try {
      let key = this.getConfigKey()
      let saved = NSUserDefaults.standardUserDefaults().objectForKey(key)
      
      if (saved) {
        // 解析保存的配置
        let parsedConfig = JSON.parse(saved)
        
        // 深度合并默认配置和保存的配置
        this.config = this.deepMerge(this.defaultConfig, parsedConfig)
        
        TaskUtils.log("✅ 配置加载成功")
      } else {
        // 使用默认配置
        this.config = JSON.parse(JSON.stringify(this.defaultConfig))
        
        TaskUtils.log("📝 使用默认配置")
      }
      
    } catch (error) {
      TaskUtils.addErrorLog(error, "TaskConfig.load")
      
      // 出错时使用默认配置
      this.config = JSON.parse(JSON.stringify(this.defaultConfig))
    }
  },
  
  /**
   * 保存配置
   */
  save: function() {
    try {
      // 更新最后使用时间
      this.config.userData.lastUsed = Date.now()
      
      let key = this.getConfigKey()
      let configString = JSON.stringify(this.config)
      
      NSUserDefaults.standardUserDefaults().setObjectForKey(configString, key)
      NSUserDefaults.standardUserDefaults().synchronize()
      
      TaskUtils.log("✅ 配置保存成功")
      
    } catch (error) {
      TaskUtils.addErrorLog(error, "TaskConfig.save")
    }
  },
  
  /**
   * 获取配置值
   */
  get: function(path) {
    let keys = path.split('.')
    let value = this.config
    
    for (let key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key]
      } else {
        return undefined
      }
    }
    
    return value
  },
  
  /**
   * 设置配置值
   */
  set: function(path, value) {
    let keys = path.split('.')
    let obj = this.config
    
    for (let i = 0; i < keys.length - 1; i++) {
      let key = keys[i]
      
      if (!(key in obj) || typeof obj[key] !== 'object') {
        obj[key] = {}
      }
      
      obj = obj[key]
    }
    
    obj[keys[keys.length - 1]] = value
    
    // 自动保存
    this.save()
  },
  
  /**
   * 重置配置
   */
  reset: function() {
    this.config = JSON.parse(JSON.stringify(this.defaultConfig))
    this.save()
    
    TaskUtils.showHUD("✅ 配置已重置")
  },
  
  /**
   * 导出配置
   */
  export: function() {
    try {
      let exportData = {
        version: "1.0.0",
        exportTime: new Date().toISOString(),
        config: this.config
      }
      
      let jsonString = JSON.stringify(exportData, null, 2)
      
      TaskUtils.copy(jsonString)
      TaskUtils.showHUD("✅ 配置已复制到剪贴板")
      
      return jsonString
      
    } catch (error) {
      TaskUtils.addErrorLog(error, "TaskConfig.export")
      return null
    }
  },
  
  /**
   * 导入配置
   */
  import: function(jsonString) {
    try {
      let importData = JSON.parse(jsonString)
      
      // 验证导入数据
      if (!importData.config || !importData.version) {
        throw new Error("无效的配置格式")
      }
      
      // 合并配置
      this.config = this.deepMerge(this.defaultConfig, importData.config)
      
      // 保存
      this.save()
      
      TaskUtils.showHUD("✅ 配置导入成功")
      return true
      
    } catch (error) {
      TaskUtils.addErrorLog(error, "TaskConfig.import")
      TaskUtils.showHUD("❌ 配置导入失败")
      return false
    }
  },
  
  /**
   * 深度合并对象
   */
  deepMerge: function(target, source) {
    let output = Object.assign({}, target)
    
    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source).forEach(key => {
        if (this.isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, { [key]: source[key] })
          } else {
            output[key] = this.deepMerge(target[key], source[key])
          }
        } else {
          Object.assign(output, { [key]: source[key] })
        }
      })
    }
    
    return output
  },
  
  /**
   * 检查是否为对象
   */
  isObject: function(item) {
    return item && typeof item === 'object' && !Array.isArray(item)
  },
  
  /**
   * 保存面板位置
   */
  savePanelFrame: function(panelName, frame) {
    let path = "ui." + panelName + "Frame"
    this.set(path, frame)
  },
  
  /**
   * 获取面板位置
   */
  getPanelFrame: function(panelName) {
    let path = "ui." + panelName + "Frame"
    return this.get(path)
  },
  
  /**
   * 增加任务计数
   */
  incrementTaskCount: function() {
    let count = this.get("userData.taskCount") || 0
    this.set("userData.taskCount", count + 1)
    return count + 1
  },
  
  /**
   * 添加到收藏
   */
  addToFavorites: function(item) {
    let favorites = this.get("userData.favorites") || []
    
    if (!favorites.some(fav => fav.id === item.id)) {
      favorites.push(item)
      this.set("userData.favorites", favorites)
    }
  },
  
  /**
   * 从收藏中移除
   */
  removeFromFavorites: function(itemId) {
    let favorites = this.get("userData.favorites") || []
    favorites = favorites.filter(fav => fav.id !== itemId)
    this.set("userData.favorites", favorites)
  }
}