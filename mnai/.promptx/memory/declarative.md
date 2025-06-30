# 陈述性记忆

## 高价值记忆（评分 ≥ 7）

- 2025/06/29 22:37 START
用户在 IDE 中打开了 simple-panel-plugin/log.txt 文件。这是 MN-Addon 项目中的一个插件日志文件，位于 simple-panel-plugin 目录下。该插件可能是一个简单的面板插件示例。 --tags MN-Addon simple-panel-plugin log
--tags #其他 #评分:8 #有效期:长期
- END



- 2025/06/29 22:45 START
simple-panel-plugin 项目遇到的4个UI交互问题及解决方案：
1. 关闭面板延迟 - 解决：直接hide或减少延迟到0.1秒
2. 面板拖动不跟鼠标 - 解决：正确计算手势偏移量，记录startOffset
3. convertRectToView错误 - 解决：使用按钮参数而非保存的sender，确保对象有效
4. 齿轮点击延迟 - 解决：直接响应点击，避免异步操作

关键技术点：
- 手势state：1=开始，3=结束
- 使用locationInView获取位置，translationInView获取偏移
- 使用MNUtil.constrain进行边界约束
- convertRectToView需要确保sender是有效UIView

参考mnai项目的utils.js getNewLoc函数和getPopoverAndPresent函数实现 --tags MN-Addon simple-panel-plugin UI交互 手势处理 菜单弹出
--tags #其他 #评分:8 #有效期:长期
- END

- 2025/06/29 23:02 START
成功完成了 MarginNote4 插件开发指南的重构和完善工作。主要改进包括：

1. 添加了开发框架选择指南，对比了 OhMyMN、MNUtils 和原生 API 三种开发方式
2. 新增了 OhMyMN 框架详解章节，详细介绍了现代化的 TypeScript 开发方式
3. 重组了 API 文档，按功能分类展示不同框架的实现方式
4. 更新了示例代码，添加了 OhMyMN TypeScript 示例和 Lite 插件示例
5. 完善了开发工具链，包括热重载、调试技巧、VSCode 配置等
6. 新增了实战开发指南，通过智能笔记处理器和笔记导出工具两个案例展示实际开发

文档现在更加现代化、实用，能够帮助开发者根据项目复杂度选择合适的开发方式。特别强调了 OhMyMN 作为推荐的现代化开发框架，同时保留了 MNUtils 和原生 API 的介绍，确保了文档的全面性。 --tags MarginNote4 插件开发 OhMyMN MNUtils 文档重构
--tags #工具使用 #评分:8 #有效期:长期
- END

- 2025/06/30 12:11 START
JSBox/JSB 框架语法支持重要发现

经过深入分析 mnutils、mntoolbar、mnai 源码，确认 JSBox/JSB 完全支持现代 ES6+ JavaScript 语法：

支持的特性：
- const/let 变量声明
- 箭头函数 () => {}
- 模板字符串 `${}`
- class 语法和 static 属性
- async/await 异步编程
- 解构赋值 {a, b} = obj
- 扩展运算符 [...array]
- 默认参数
- 现代数组方法（map、filter、find、includes等）
- 现代对象方法（Object.assign、Object.keys等）

重要教训：
1. 遇到"语法错误"时，先查看权威项目源码确认，不要盲目假设
2. JSBox 环境的问题通常不是语法兼容性，而是 API 使用问题
3. CATransaction 在 JSBox 中可能有兼容性问题，应避免使用
4. 按钮事件绑定时，在实例方法内应使用 this 而非 self --tags JSBox JavaScript ES6 语法支持 MarginNote 插件开发
--tags #其他 #评分:8 #有效期:长期
- END