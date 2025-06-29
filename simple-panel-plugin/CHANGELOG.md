# Simple Panel Plugin 更新日志

## 版本历史

### v0.0.10 (2025-06-29) - 完整导出功能版
**新功能**
- 导出配置时包含历史记录
- 导出数据包含版本号和时间戳
- 支持导入带历史记录的完整数据

**改进**
- 导入功能兼容新旧格式
- 导入时显示历史记录数量
- 改进错误提示信息

**导出格式**
```json
{
  "config": {
    "mode": 0,
    "saveHistory": true,
    "inputText": "...",
    "outputText": "..."
  },
  "history": [...],
  "exportTime": "2025-06-29T10:20:00.000Z",
  "version": "0.0.9"
}
```

### v0.0.9 (2025-06-29) - 数据持久化修复版
**修复的严重问题**
- 修复了转换功能失效（`self.saveHistory is not a function` 错误）
- 修复了菜单点击后不消失的问题
- 修复了 JSB 框架中方法调用限制导致的问题

**实现的持久化功能**
- ✅ 保存历史记录的信息
- ✅ "保存历史"设置的状态
- ✅ 两个文本框的内容
- ✅ 工具的默认选择（mode）

**技术改进**
- 移除了所有自定义方法（saveConfig, saveHistory, loadHistory）
- 将所有保存逻辑内联到需要的地方
- 在 NSUserDefaults 操作后正确调用 synchronize()
- 在 setMode 中使用延迟显示 HUD，确保菜单先关闭
- 添加了 viewWillDisappear 在视图关闭时保存配置

**关键代码改动**
1. 在 processText 中直接内联保存历史逻辑
2. 在 setMode/toggleSaveHistory 中直接内联保存配置逻辑
3. 在 viewDidLoad 中直接内联加载逻辑
4. 移除了 textViewDidChange 的自动保存（避免方法调用）

**测试结果**
- ✅ 转换功能正常工作
- ✅ 菜单正常关闭
- ✅ 配置和历史记录成功持久化
- ✅ 重启 MarginNote 后数据正确恢复

### v0.0.8 (2025-06-29) - 最终稳定版
**主要修改**
- 移除了所有自动处理功能相关代码
- 删除了左上角的"自动处理:关"指示器
- 简化了配置结构，移除 autoProcess 配置项

**Bug 修复**
- 修复了菜单点击后延迟重新显示的问题
- 改进了历史记录菜单，即使没有历史也会显示菜单
- 修复了 TypeScript 警告（未使用的参数）

**优化改进**
- 添加了详细的调试日志到 processText 方法
- 简化了 textViewDidChange 方法
- 清理了不需要的代码和变量

**测试结果**
- ✅ 所有功能正常工作
- ✅ 没有出现 [Image #1] 问题
- ✅ 菜单正常显示和关闭
- ✅ 历史记录功能正常

### v0.0.7_safe (2025-06-29) - 修复版
**修复**
- 修复了 MNUtil.readJSON 崩溃问题
- 添加了文件存在性检查和错误处理
- 实现了历史记录的安全加载

**改进**
- 添加了 `loadHistorySafely` 方法
- 使用按需加载替代预加载
- 完善了错误处理

**根本原因**
- 发现 MNUtil.readJSON 没有内置错误处理
- 文件不存在时 NSData.dataWithContentsOfFile 返回 null
- null 传给 NSJSONSerialization 导致崩溃

### v0.0.6_fix (2025-06-29) - 延迟加载修复
**修复**
- 使用 NSTimer 延迟 0.5 秒加载历史
- 添加了 try-catch 保护
- 避免在 viewDidLoad 中直接读取文件

**问题**
- 延迟加载虽然避免了崩溃，但不是根本解决方案
- 没有解决文件不存在的情况

### v0.0.6 (2025-06-29) - 历史记录崩溃
**新功能**
- 添加了历史记录持久化功能
- 使用 MNUtil.readJSON/writeJSON 保存历史
- 历史记录包含时间戳
- 限制历史记录数量为 50 条

**问题**
- 在 viewDidLoad 中直接读取 JSON 文件导致崩溃
- 崩溃原因：NSJSONSerialization JSONObjectWithData 异常

### v0.0.5 (2025-06-29) - iCloud 配置
**新功能**
- 添加了 iCloud 配置同步
- 使用 MNUtil.readCloudKey/setCloudKey
- 配置可跨设备共享

**改进**
- 配置持久化到云端
- 支持配置导入导出

### v0.0.4_safe (2025-06-29) - 深层问题修复
**问题发现**
- 确认了 JSB 框架在 viewDidLoad 中不能调用自定义方法
- 插件完全无响应
- 找到了根本原因并创建安全版本

### v0.0.3 (2025-06-29) - 属性初始化问题
**问题**
- 将 initConfig() 内联到 viewDidLoad 中
- 但自动处理指示器仍然有问题
- 发现 JSB 框架限制比预期更严格

### v0.0.2 (2025-06-29) - 方法调用问题
**改进**
- 添加了 initConfig 方法
- 在 viewDidLoad 开始时调用 initConfig()
- 解决了配置初始化问题

**问题**
- 自动处理指示器使用了未初始化的 self.config
- 导致按钮创建时出错

### v0.0.1 (2025-06-29) - 初始版本
**功能**
- 创建基础 simplePanelController.js
- 实现文本处理功能
- 插件不在插件栏显示

## 经验教训

### 1. JSB 框架限制
- **不能在 viewDidLoad 中调用自定义方法**
- 插件会无响应或功能失效
- 所有初始化代码必须内联

### 2. MNUtil API 使用注意
- **readJSON 没有错误处理**
- 必须先使用 isfileExists 检查文件存在性
- 始终使用 try-catch 保护

### 3. 调试技巧
- 使用增量版本快速定位问题
- 保留每个版本便于回退
- 充分利用日志
- 在 MNUtils 中查看日志

## 版本命名规则

### 正式版本
- 标准版本：0.0.x
- 修复版本：0.0.x_fix 或 0.0.x_safe
- 每个版本都要打包测试

## 总结

经过 9 个版本的迭代，我们终于得到了一个功能完整且稳定的插件：
1. JSB 框架有许多隐藏的限制（不能调用自定义方法）
2. MNButton 参数格式要求严格（必须用字符串颜色）
3. 文件 I/O 需要完善的错误处理
4. NSUserDefaults 操作后必须调用 synchronize()
5. 菜单操作需要考虑时序问题

v0.0.9 是目前最完整的版本，实现了完整的数据持久化功能！

## 重要经验

### JSB 框架方法调用限制
```javascript
// ❌ 错误：会导致 "is not a function" 错误
viewDidLoad: function() {
  self.initConfig();  // 不能调用
}

processText: function() {
  self.saveHistory(); // 不能调用
}

// ✅ 正确：直接内联代码
viewDidLoad: function() {
  // 直接写初始化代码
  self.config = { mode: 0 };
}

processText: function() {
  // 直接写保存代码
  NSUserDefaults.standardUserDefaults().setObjectForKey(data, key);
  NSUserDefaults.standardUserDefaults().synchronize();
}
```