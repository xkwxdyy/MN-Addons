/**
 * MNTask 标签触发系统
 * 基于 MN ChatAI 的实现思路，为 MNTask 提供灵活的标签自动化功能
 */

// 初始化标签触发系统命名空间
if (typeof MNTaskTagTrigger === 'undefined') {
  var MNTaskTagTrigger = {
    // 触发器注册表
    triggers: {},
    
    // 配置选项
    config: {
      enabled: true,
      ignoreShortText: true,
      minTextLength: 10,
      debugMode: false
    }
  };
}

/**
 * 注册标签触发器
 * @param {string} tag - 标签名称
 * @param {Object} options - 触发器选项
 * @param {Function} options.handler - 处理函数
 * @param {string} options.description - 描述
 * @param {boolean} options.autoRemoveTag - 是否自动移除标签
 * @param {Array<string>} options.requiredFields - 必需的字段
 */
MNTaskTagTrigger.register = function(tag, options) {
  this.triggers[tag] = {
    handler: options.handler,
    description: options.description || '',
    autoRemoveTag: options.autoRemoveTag !== false, // 默认自动移除
    requiredFields: options.requiredFields || [],
    priority: options.priority || 0
  };
  
  if (this.config.debugMode) {
    MNUtil.log(`✅ 注册标签触发器: ${tag} - ${options.description}`);
  }
};

/**
 * 处理笔记的标签
 * @param {MNNote} note - 要处理的笔记
 */
MNTaskTagTrigger.processTags = async function(note) {
  if (!this.config.enabled) return;
  
  // 获取笔记标签
  const tags = note.tags || [];
  if (tags.length === 0) return;
  
  // 检查文本长度（如果启用）
  if (this.config.ignoreShortText) {
    const text = await this.getNoteText(note);
    if (text.length < this.config.minTextLength) {
      if (this.config.debugMode) {
        MNUtil.log(`跳过短文本笔记: ${text.length} 字符`);
      }
      return;
    }
  }
  
  // 查找匹配的触发器
  const matchedTriggers = [];
  for (const tag of tags) {
    if (this.triggers[tag]) {
      matchedTriggers.push({
        tag: tag,
        trigger: this.triggers[tag]
      });
    }
  }
  
  if (matchedTriggers.length === 0) return;
  
  // 按优先级排序
  matchedTriggers.sort((a, b) => b.trigger.priority - a.trigger.priority);
  
  // 执行触发器
  for (const match of matchedTriggers) {
    try {
      // 检查必需字段
      if (!this.checkRequiredFields(note, match.trigger.requiredFields)) {
        if (this.config.debugMode) {
          MNUtil.log(`跳过触发器 ${match.tag}: 缺少必需字段`);
        }
        continue;
      }
      
      // 执行处理函数
      const context = {
        note: note,
        tag: match.tag,
        tags: tags,
        trigger: match.trigger
      };
      
      await match.trigger.handler(context);
      
      // 自动移除标签
      if (match.trigger.autoRemoveTag) {
        this.removeTag(note, match.tag);
      }
      
      MNUtil.log(`✅ 执行标签触发器: ${match.tag}`);
      
      // 可选：只执行第一个匹配的触发器
      // break;
      
    } catch (error) {
      MNUtil.addErrorLog(error, `标签触发器: ${match.tag}`);
      MNUtil.showHUD(`❌ ${match.tag} 触发失败: ${error.message}`);
    }
  }
};

/**
 * 获取笔记文本内容
 */
MNTaskTagTrigger.getNoteText = async function(note) {
  // 使用 taskUtils 中的方法获取文本
  if (typeof taskUtils !== 'undefined' && taskUtils.getTextForSearch) {
    return await taskUtils.getTextForSearch(note);
  }
  
  // 备用方法
  return note.noteTitle || note.excerptText || '';
};

/**
 * 检查必需字段
 */
MNTaskTagTrigger.checkRequiredFields = function(note, requiredFields) {
  if (!requiredFields || requiredFields.length === 0) return true;
  
  for (const field of requiredFields) {
    if (!TaskFieldUtils.getFieldContent(note, field)) {
      return false;
    }
  }
  return true;
};

/**
 * 移除标签
 */
MNTaskTagTrigger.removeTag = function(note, tagToRemove) {
  const tags = note.tags || [];
  const newTags = tags.filter(tag => tag !== tagToRemove);
  
  if (newTags.length !== tags.length) {
    note.tags = newTags;
    if (this.config.debugMode) {
      MNUtil.log(`移除标签: ${tagToRemove}`);
    }
  }
};

// 注册简单的示例触发器
MNTaskTagTrigger.registerBuiltinTriggers = function() {
  
  // 简单的测试触发器
  this.register('测试', {
    description: '测试标签触发系统',
    handler: async function(context) {
      MNUtil.showHUD('✅ Trigger 成功');
      
      // 演示如何访问上下文信息
      const { note, tag, tags } = context;
      MNUtil.log(`触发器被激活 - 标签: ${tag}, 所有标签: ${tags.join(', ')}`);
      
      // 演示如何操作笔记
      // TaskFieldUtils.addOrUpdateField(note, '触发时间', new Date().toLocaleString('zh-CN'));
    }
  });
  
  // 这里可以添加更多触发器...
};

// 初始化内置触发器
if (typeof MNUtil !== 'undefined') {
  MNUtil.delay(0.1).then(() => {
    MNTaskTagTrigger.registerBuiltinTriggers();
    MNUtil.log('✅ MNTask 标签触发系统已初始化');
  });
}

// ========== 如何添加更多触发器 ==========
//
// 1. 在任何地方（比如在这个文件末尾）添加：
//
// MNTaskTagTrigger.register('今日', {
//   description: '添加到今日任务',
//   handler: async function(context) {
//     const { note } = context;
//     TaskFieldUtils.addOrUpdateField(note, '计划日期', new Date().toLocaleDateString('zh-CN'));
//     TaskFieldUtils.addOrUpdateField(note, '优先级', '高');
//     MNUtil.showHUD('📅 已添加到今日任务');
//   }
// });
//
// 2. 或者带有更多选项：
//
// MNTaskTagTrigger.register('批量处理', {
//   description: '对子卡片执行批量操作',
//   autoRemoveTag: false,  // 不自动移除标签
//   requiredFields: ['操作类型'],  // 需要有"操作类型"字段
//   priority: 10,  // 优先级更高
//   handler: async function(context) {
//     const { note } = context;
//     const operation = TaskFieldUtils.getFieldContent(note, '操作类型');
//     // 处理逻辑...
//   }
// });
//
// ========================================