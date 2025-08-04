# MN-Addon 项目 AI 助手导航

> **最后更新**: 2025-01-28  
> **项目状态**: 活跃开发中  
> **Claude Code 智能导航入口** - AI每次对话请先读取此文件

---

## 🚨 **当前状态快照 (必读)**

**正在进行**: 增加对 mntask 任务卡片的评论的修改功能。
```
基于我对 addTimestampRecord
  函数的分析，你的想法非常棒！添加唯一ID确实能完美解决进展记录的精准定位问题。


  ⎿  User rejected Claude's plan:
     ╭──────────────────────────────────────────────────────────────────────────────────────╮
     │ 进展记录唯一ID系统优化方案                                                           │
     │                                                                                      │
     │ 🎯 优化目标                                                                          │
     │                                                                                      │
     │ 为每个进展记录添加唯一ID，实现精准定位和修改特定进展记录的能力。                     │
     │                                                                                      │
     │ 📊 当前状况分析                                                                      │
     │                                                                                      │
     │ addTimestampRecord 函数当前实现                                                      │
     │                                                                                      │
     │ - 位置：xdyy_custom_actions_registry.js 第555-627行                                  │
     │ - 生成格式：时间戳HTML + 用户文本内容                                                │
     │ - 问题：没有唯一标识符，无法精准定位特定记录                                         │
     │                                                                                      │
     │ 当前HTML结构                                                                         │
     │                                                                                      │
     │ <div style="position:relative; padding-left:28px; margin:14px 0; color:#1E40AF;      │
     │ font-weight:500; font-size:0.92em">                                                  │
     │   <div style="...圆点样式..."></div>                                                 │
     │   2025-01-23 14:30:45                                                                │
     │ </div>                                                                               │
     │ 用户输入的进展内容                                                                   │
     │                                                                                      │
     │ 🔧 优化方案                                                                          │
     │                                                                                      │
     │ 1. 增强 addTimestampRecord 函数                                                      │
     │                                                                                      │
     │ - 为每个进展记录生成唯一ID                                                           │
     │ - 在HTML结构中添加 data-progress-id 属性                                             │
     │ - ID格式：progress_${timestamp}_${randomSuffix}                                      │
     │                                                                                      │
     │ 2. 新的HTML结构设计                                                                  │
     │                                                                                      │
     │ <div data-progress-id="progress_20250123143045_abc123" style="position:relative;     │
     │ padding-left:28px; margin:14px 0; color:#1E40AF; font-weight:500; font-size:0.92em"> │
     │   <div style="...圆点样式..."></div>                                                 │
     │   2025-01-23 14:30:45                                                                │
     │ </div>                                                                               │
     │ 用户输入的进展内容                                                                   │
     │                                                                                      │
     │ 3. 增强 parseTaskComments 函数                                                       │
     │                                                                                      │
     │ - 解析进展记录中的 data-progress-id                                                  │
     │ - 在返回结果中包含进展记录列表和ID映射                                               │
     │ - 结构：progressRecords: [{id, timestamp, content, htmlIndex, textIndex}]            │
     │                                                                                      │
     │ 4. 扩展 modifyTaskComment 选择器                                                     │
     │                                                                                      │
     │ - 新增选择器：{progressId: "progress_20250123143045_abc123"}                         │
     │ - 支持：{progressId: "latest"} - 最新进展                                            │
     │ - 支持：{progressId: "oldest"} - 最早进展                                            │
     │ - 支持：{progressIndex: 0} - 按索引选择进展                                          │
     │                                                                                      │
     │ 5. 新增进展管理工具函数                                                              │
     │                                                                                      │
     │ // 获取所有进展记录                                                                  │
     │ MNTaskManager.getProgressRecords(note)                                               │
     │                                                                                      │
     │ // 修改特定进展记录                                                                  │
     │ MNTaskManager.modifyProgressRecord(note, progressId, newContent)                     │
     │                                                                                      │
     │ // 删除特定进展记录                                                                  │
     │ MNTaskManager.deleteProgressRecord(note, progressId)                                 │
     │                                                                                      │
     │ // 在特定位置插入进展记录                                                            │
     │ MNTaskManager.insertProgressRecord(note, content, afterProgressId)                   │
     │                                                                                      │
     │ 📝 具体实现步骤                                                                      │
     │                                                                                      │
     │ 第一步：优化 addTimestampRecord 函数                                                 │
     │                                                                                      │
     │ 1. 生成唯一ID：progress_${timestamp}_${randomString}                                 │
     │ 2. 修改时间戳HTML，添加 data-progress-id 属性                                        │
     │ 3. 保持向后兼容，不影响现有记录                                                      │
     │                                                                                      │
     │ 第二步：增强解析能力                                                                 │
     │                                                                                      │
     │ 1. 修改 parseTaskComments 函数识别进展记录ID                                         │
     │ 2. 建立进展记录索引和映射关系                                                        │
     │ 3. 处理无ID的旧记录（生成临时ID）                                                    │
     │                                                                                      │
     │ 第三步：扩展修改功能                                                                 │
     │                                                                                      │
     │ 1. 在 modifyTaskComment 中新增 progressId 选择器                                     │
     │ 2. 支持按进展ID精准定位                                                              │
     │ 3. 提供便捷的进展记录管理接口                                                        │
     │                                                                                      │
     │ 第四步：测试和文档                                                                   │
     │                                                                                      │
     │ 1. 创建进展记录专项测试用例                                                          │
     │ 2. 验证ID生成、解析、修改的完整流程                                                  │
     │ 3. 更新使用文档和示例                                                                │
     │                                                                                      │
     │ 🎁 预期效果                                                                          │
     │                                                                                      │
     │ 使用示例                                                                             │
     │                                                                                      │
     │ // 添加新进展（自动生成ID）                                                          │
     │ // 通过现有菜单触发，内部自动添加ID                                                  │
     │                                                                                      │
     │ // 修改特定进展记录                                                                  │
     │ MNTaskManager.modifyTaskComment(note,                                                │
     │   {progressId: "progress_20250123143045_abc123"},                                    │
     │   "更新后的进展内容"                                                                 │
     │ );                                                                                   │
     │                                                                                      │
     │ // 修改最新进展                                                                      │
     │ MNTaskManager.modifyTaskComment(note,                                                │
     │   {progressId: "latest"},                                                            │
     │   "修改最新的进展记录"                                                               │
     │ );                                                                                   │
     │                                                                                      │
     │ // 获取所有进展记录                                                                  │
     │ const records = MNTaskManager.getProgressRecords(note);                              │
     │ // 返回：[{id, timestamp, content, htmlIndex, textIndex}, ...]                       │
     │                                                                                      │
     │ 业务价值                                                                             │
     │                                                                                      │
     │ - ✅ 精准定位：每个进展记录都有唯一标识                                               │
     │ - ✅ 可靠修改：不依赖内容匹配，避免误修改                                             │
     │ - ✅ 灵活管理：支持增删改查完整操作                                                   │
     │ - ✅ 向后兼容：不影响现有记录和功能                                                   │
     │ - ✅ 扩展性强：为未来的进展记录功能奠定基础                                           │
     ╰──────────────────────────────────────────────────────────────────────────────────────╯


> 有个小问题: htmlIndex, textIndex 不需要吧,因为每个进展是一条评论,只需要记录这个评论整体在 
  卡片的评论里的 index 就行了吧 ultrathink
```

**最新问题**: 
**下一步重点**:   
**活跃项目**: mntask (任务管理)、mnai (AI聊天)、mnutils (工具集)、mntoolbar 

---

## 🧠 **智能索引 - 根据需求选择阅读**

### 🐛 **问题排查与调试**
- 📖 **详细技术问题** → 阅读 `CLAUDE.md` (606行，按时间倒序)
- 🔧 **具体bug修复** → 查看 `fix_*.md` 文件 (如 `fix_summary.md`)
- 📊 **运行日志分析** → 阅读 `log.md` (JSON格式运行日志)

### 💻 **开发与代码**
- 🏗️ **项目架构了解** → 查看各子项目的 `README.md`
- 📝 **API文档问题** → 阅读 `CLAUDE.md` → "API文档与源码不一致问题"
- 🔀 **Git工作流** → 阅读 `CLAUDE.md` → "Git操作重要提醒"

### 📋 **项目管理**
- 🎯 **Issue管理** → 阅读 `CLAUDE.md` → "GitHub Issue工作流规范"
- 📈 **版本发布** → 查看各子项目的 `.mnaddon` 文件 (版本历史)
- 🤝 **协作规范** → 阅读 `/Users/xiakangwei/.claude/CLAUDE.md` (全局开发规范)

---

## 📅 **最近重要更新 (时间线)**



---

## 🎯 **基于场景的阅读策略**

### 场景1: **新Bug报告/调试**
1. 先读此文件了解当前状态
2. 检查 `log.md` 查看最新运行日志  
3. 在 `CLAUDE.md` 中搜索相关问题

### 场景2: **新功能开发**
1. 先读此文件了解项目架构
2. 查看对应子项目的文件结构
3. 参考 `CLAUDE.md` 中的开发经验

### 场景3: **代码审查/重构**  
1. 先读此文件了解最新变更
2. 查看相关的 `fix_*.md` 了解历史问题
3. 检查Git提交历史

### 场景4: **版本发布准备**
1. 先读此文件确认当前状态
2. 检查 `CLAUDE.md` 中的工作流规范
3. 验证各子项目的 `.mnaddon` 版本号

---

## 📊 **项目统计信息**

**子项目数量**: 5个 (mnai, mntask, mnutils, mnbrowser, mnsnipaste)  
**主要开发语言**: JavaScript (JSB框架)  
**文档维护状态**: ✅ 活跃更新  
**最新稳定版本**: mntask v0.13.x 系列  

---

## ⚠️ **重要提醒**

1. **Git远程仓库名**: `github` (不是 `origin`)
2. **关键文档**: `CLAUDE.md` 包含所有技术问题和解决方案
3. **日志系统**: `log.md` 记录实时运行状态
4. **API问题**: 始终以源码 (`mnutils.js`, `xdyyutils.js`) 为准

---

*📝 此文件由Claude Code进展跟踪系统自动维护*