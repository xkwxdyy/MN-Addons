/**
 * Simple Panel Plugin 配置管理系统
 * 基于 mnai 项目的设计理念，提供更高级的配置管理功能
 */

class ConfigManager {
  constructor() {
    this.configKey = "SimplePanel_Config";
    this.historyKey = "SimplePanel_History";
    this.cloudKey = "SimplePanel_CloudConfig";
    
    // 默认配置
    this.defaultConfig = {
      mode: 0,  // 0:转大写 1:转小写 2:首字母大写 3:反转
      saveHistory: true,
      inputText: "在这里输入文本...",
      outputText: "处理结果...",
      maxHistoryCount: 100,
      autoSync: false,
      syncSource: "none", // none, iCloud, webdav
      lastSyncTime: 0,
      modifiedTime: 0,
      version: "1.0.0"
    };
    
    // 初始化配置
    this.config = {};
    this.history = [];
    this.cloudStore = null;
    this.syncInProgress = false;
  }
  
  /**
   * 初始化配置管理器
   */
  init() {
    // 加载本地配置
    this.loadConfig();
    
    // 初始化 iCloud 存储
    if (this.config.syncSource === "iCloud") {
      this.initCloudStore();
    }
    
    // 检查自动同步
    if (this.config.autoSync) {
      this.checkAutoSync();
    }
  }
  
  /**
   * 加载配置
   */
  loadConfig() {
    try {
      // 从本地存储加载
      const savedConfig = NSUserDefaults.standardUserDefaults().objectForKey(this.configKey);
      
      if (savedConfig) {
        // 合并默认配置和保存的配置
        this.config = Object.assign({}, this.defaultConfig, savedConfig);
      } else {
        this.config = Object.assign({}, this.defaultConfig);
      }
      
      // 加载历史记录
      const savedHistory = NSUserDefaults.standardUserDefaults().objectForKey(this.historyKey);
      if (savedHistory && Array.isArray(savedHistory)) {
        this.history = savedHistory;
      }
      
      this.log("📋 配置加载完成");
    } catch (error) {
      this.log("❌ 加载配置失败: " + error.message);
      this.config = Object.assign({}, this.defaultConfig);
    }
  }
  
  /**
   * 保存配置
   * @param {boolean} syncToCloud - 是否同步到云端
   */
  save(syncToCloud = true) {
    try {
      // 更新修改时间
      this.config.modifiedTime = Date.now();
      
      // 保存到本地
      NSUserDefaults.standardUserDefaults().setObjectForKey(this.config, this.configKey);
      NSUserDefaults.standardUserDefaults().synchronize();
      
      // 自动同步到云端
      if (syncToCloud && this.config.autoSync && !this.syncInProgress) {
        this.syncToCloud();
      }
      
      this.log("💾 配置已保存");
      return true;
    } catch (error) {
      this.log("❌ 保存配置失败: " + error.message);
      return false;
    }
  }
  
  /**
   * 保存历史记录
   * @param {Object} historyItem - 历史记录项
   */
  saveHistory(historyItem) {
    if (!this.config.saveHistory) return;
    
    try {
      // 添加时间戳
      historyItem.timestamp = new Date().toISOString();
      
      // 添加到历史记录
      this.history.push(historyItem);
      
      // 限制历史记录数量
      if (this.history.length > this.config.maxHistoryCount) {
        this.history = this.history.slice(-this.config.maxHistoryCount);
      }
      
      // 保存到本地
      NSUserDefaults.standardUserDefaults().setObjectForKey(this.history, this.historyKey);
      NSUserDefaults.standardUserDefaults().synchronize();
      
      this.log("📝 历史记录已保存");
    } catch (error) {
      this.log("❌ 保存历史记录失败: " + error.message);
    }
  }
  
  /**
   * 获取配置值
   * @param {string} key - 配置键名
   * @param {any} defaultValue - 默认值
   */
  get(key, defaultValue = undefined) {
    return key in this.config ? this.config[key] : defaultValue;
  }
  
  /**
   * 设置配置值
   * @param {string} key - 配置键名
   * @param {any} value - 配置值
   * @param {boolean} autoSave - 是否自动保存
   */
  set(key, value, autoSave = true) {
    this.config[key] = value;
    if (autoSave) {
      this.save();
    }
  }
  
  /**
   * 批量更新配置
   * @param {Object} updates - 要更新的配置对象
   */
  update(updates) {
    Object.assign(this.config, updates);
    this.save();
  }
  
  /**
   * 初始化 iCloud 存储
   */
  initCloudStore() {
    if (typeof MNUtil !== "undefined" && MNUtil.isMN4) {
      // MN4 使用 NSUbiquitousKeyValueStore
      this.cloudStore = NSUbiquitousKeyValueStore.defaultStore();
      this.log("☁️ iCloud 存储已初始化");
    } else if (typeof MNUtil !== "undefined") {
      // MN3 使用 MNUtil 的 API
      this.cloudStore = {
        objectForKey: (key) => {
          const value = MNUtil.readCloudKey(key);
          return value ? JSON.parse(value) : null;
        },
        setObjectForKey: (value, key) => {
          MNUtil.setCloudKey(key, JSON.stringify(value));
        }
      };
      this.log("☁️ iCloud 存储已初始化 (MN3)");
    }
  }
  
  /**
   * 检查自动同步
   */
  async checkAutoSync() {
    if (!this.config.autoSync || this.syncInProgress) return;
    
    try {
      // 从云端读取配置
      const cloudConfig = await this.readFromCloud();
      
      if (!cloudConfig) {
        // 云端没有配置，上传本地配置
        await this.syncToCloud();
      } else if (this.shouldImportFromCloud(cloudConfig)) {
        // 云端配置更新，导入
        await this.importFromCloud(cloudConfig);
      } else if (this.shouldExportToCloud(cloudConfig)) {
        // 本地配置更新，导出
        await this.syncToCloud();
      }
    } catch (error) {
      this.log("❌ 自动同步失败: " + error.message);
    }
  }
  
  /**
   * 判断是否应该从云端导入
   */
  shouldImportFromCloud(cloudConfig) {
    // 如果云端配置更新时间晚于本地，则导入
    return cloudConfig.modifiedTime > this.config.modifiedTime &&
           cloudConfig.lastSyncTime > this.config.lastSyncTime;
  }
  
  /**
   * 判断是否应该导出到云端
   */
  shouldExportToCloud(cloudConfig) {
    // 如果本地配置更新时间晚于云端，则导出
    return this.config.modifiedTime > cloudConfig.modifiedTime &&
           this.config.modifiedTime > this.config.lastSyncTime;
  }
  
  /**
   * 同步到云端
   */
  async syncToCloud() {
    if (!this.cloudStore || this.syncInProgress) return;
    
    this.syncInProgress = true;
    
    try {
      // 准备同步数据
      const syncData = {
        config: this.config,
        history: this.history,
        syncTime: Date.now(),
        version: this.config.version
      };
      
      // 更新同步时间
      this.config.lastSyncTime = syncData.syncTime;
      
      // 保存到云端
      this.cloudStore.setObjectForKey(syncData, this.cloudKey);
      
      // 保存本地配置
      this.save(false);
      
      this.log("☁️ 已同步到云端");
      
      if (typeof MNUtil !== "undefined") {
        MNUtil.showHUD("已同步到 " + this.getSyncSourceName());
      }
    } catch (error) {
      this.log("❌ 云端同步失败: " + error.message);
    } finally {
      this.syncInProgress = false;
    }
  }
  
  /**
   * 从云端读取配置
   */
  async readFromCloud() {
    if (!this.cloudStore) return null;
    
    try {
      const syncData = this.cloudStore.objectForKey(this.cloudKey);
      return syncData ? syncData.config : null;
    } catch (error) {
      this.log("❌ 读取云端配置失败: " + error.message);
      return null;
    }
  }
  
  /**
   * 从云端导入配置
   */
  async importFromCloud(cloudConfig) {
    if (this.syncInProgress) return;
    
    this.syncInProgress = true;
    
    try {
      // 备份当前配置
      this.backupConfig = Object.assign({}, this.config);
      
      // 导入云端配置
      const syncData = this.cloudStore.objectForKey(this.cloudKey);
      
      if (syncData && this.validateSyncData(syncData)) {
        // 保留本地的同步设置
        const localSyncSettings = {
          autoSync: this.config.autoSync,
          syncSource: this.config.syncSource
        };
        
        // 更新配置
        this.config = Object.assign({}, syncData.config, localSyncSettings);
        this.history = syncData.history || [];
        
        // 保存到本地
        this.save(false);
        
        this.log("☁️ 已从云端导入配置");
        
        if (typeof MNUtil !== "undefined") {
          MNUtil.showHUD("已从 " + this.getSyncSourceName() + " 导入");
        }
      }
    } catch (error) {
      // 恢复备份
      if (this.backupConfig) {
        this.config = this.backupConfig;
      }
      this.log("❌ 导入云端配置失败: " + error.message);
    } finally {
      this.syncInProgress = false;
    }
  }
  
  /**
   * 验证同步数据
   */
  validateSyncData(syncData) {
    return syncData && 
           typeof syncData.config === 'object' &&
           Array.isArray(syncData.history) &&
           syncData.version;
  }
  
  /**
   * 手动同步
   */
  async manualSync() {
    if (!this.cloudStore) {
      if (typeof MNUtil !== "undefined") {
        MNUtil.showHUD("请先配置同步源");
      }
      return;
    }
    
    try {
      const cloudConfig = await this.readFromCloud();
      
      if (!cloudConfig) {
        // 云端没有配置，直接上传
        await this.syncToCloud();
      } else {
        // 检查是否有冲突
        const hasConflict = cloudConfig.modifiedTime > this.config.lastSyncTime &&
                          this.config.modifiedTime > this.config.lastSyncTime;
        
        if (hasConflict) {
          // 让用户选择
          if (typeof MNUtil !== "undefined" && MNUtil.select) {
            const choice = await MNUtil.select(
              "配置冲突",
              "检测到云端和本地都有更新，请选择：",
              ["使用本地配置", "使用云端配置", "取消"]
            );
            
            switch (choice) {
              case 0:
                await this.syncToCloud();
                break;
              case 1:
                await this.importFromCloud(cloudConfig);
                break;
              default:
                MNUtil.showHUD("已取消同步");
            }
          }
        } else if (this.shouldImportFromCloud(cloudConfig)) {
          await this.importFromCloud(cloudConfig);
        } else if (this.shouldExportToCloud(cloudConfig)) {
          await this.syncToCloud();
        } else {
          if (typeof MNUtil !== "undefined") {
            MNUtil.showHUD("配置已是最新");
          }
        }
      }
    } catch (error) {
      this.log("❌ 手动同步失败: " + error.message);
      if (typeof MNUtil !== "undefined") {
        MNUtil.showHUD("同步失败：" + error.message);
      }
    }
  }
  
  /**
   * 导出配置
   */
  exportConfig() {
    const exportData = {
      config: this.config,
      history: this.history,
      exportTime: new Date().toISOString(),
      version: this.config.version
    };
    
    const exportStr = JSON.stringify(exportData, null, 2);
    
    if (typeof MNUtil !== "undefined" && MNUtil.copy) {
      MNUtil.copy(exportStr);
      MNUtil.showHUD("配置已复制到剪贴板");
    } else {
      UIPasteboard.generalPasteboard().string = exportStr;
    }
    
    return exportStr;
  }
  
  /**
   * 导入配置
   * @param {string} importStr - 导入的配置字符串
   */
  importConfig(importStr) {
    try {
      const importData = JSON.parse(importStr);
      
      if (this.validateImportData(importData)) {
        // 备份当前配置
        this.backupConfig = Object.assign({}, this.config);
        this.backupHistory = [...this.history];
        
        // 导入配置
        this.config = Object.assign({}, this.defaultConfig, importData.config);
        this.history = importData.history || [];
        
        // 保存
        this.save();
        
        this.log("📥 配置导入成功");
        
        if (typeof MNUtil !== "undefined") {
          MNUtil.showHUD("配置导入成功");
        }
        
        return true;
      } else {
        throw new Error("无效的配置数据");
      }
    } catch (error) {
      this.log("❌ 导入配置失败: " + error.message);
      
      // 恢复备份
      if (this.backupConfig) {
        this.config = this.backupConfig;
        this.history = this.backupHistory;
      }
      
      if (typeof MNUtil !== "undefined") {
        MNUtil.showHUD("导入失败：" + error.message);
      }
      
      return false;
    }
  }
  
  /**
   * 验证导入数据
   */
  validateImportData(importData) {
    return importData && 
           typeof importData.config === 'object' &&
           importData.version;
  }
  
  /**
   * 重置配置
   */
  reset() {
    this.config = Object.assign({}, this.defaultConfig);
    this.history = [];
    this.save();
    
    this.log("🔄 配置已重置");
    
    if (typeof MNUtil !== "undefined") {
      MNUtil.showHUD("配置已重置");
    }
  }
  
  /**
   * 清空历史记录
   */
  clearHistory() {
    this.history = [];
    NSUserDefaults.standardUserDefaults().setObjectForKey([], this.historyKey);
    NSUserDefaults.standardUserDefaults().synchronize();
    
    this.log("🗑️ 历史记录已清空");
  }
  
  /**
   * 获取同步源名称
   */
  getSyncSourceName() {
    switch (this.config.syncSource) {
      case "iCloud":
        return "iCloud";
      case "webdav":
        return "WebDAV";
      case "none":
      default:
        return "无";
    }
  }
  
  /**
   * 日志输出
   */
  log(message) {
    if (typeof MNUtil !== "undefined" && MNUtil.log) {
      MNUtil.log("ConfigManager: " + message);
    }
  }
}

// 导出单例
const configManager = new ConfigManager();