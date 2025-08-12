# 等价证明功能测试

## 功能概述
实现了数学等价命题证明的自动格式化功能，支持生成结构化的双向证明内容。

## 实现内容

### 1. HtmlMarkdownUtils 类扩展
- 新增 `equivalence` 样式：蓝色渐变背景，用于显示等价关系
- 新增 `implication` 样式：黄色背景，用于显示蕴含关系
- 新增 `smartSpacing` 方法：智能处理中英文混排的空格
- 新增 `createEquivalenceProof` 方法：生成等价证明的结构化内容
- 新增 `insertEquivalenceProofByPopup` 方法：通过弹窗交互创建等价证明

### 2. MNMath 类扩展
- 新增 `addEquivalenceProof` 方法：作为调用入口

### 3. Action 注册
- 在 `xdyy_custom_actions_registry.js` 中注册了 `addEquivalenceProof` action

### 4. 菜单集成
- 在 `menu_htmlmdcomment` 菜单中添加了"⇔ 添加等价证明"选项

## 测试步骤

1. 在 MarginNote 中选择一个笔记卡片
2. 点击 HtmlMarkdown 评论按钮（长按）
3. 选择"⇔ 添加等价证明"
4. 在第一个弹窗中输入命题 A（例如："A是B的子集"）
5. 在第二个弹窗中输入命题 B（例如："B包含A"）
6. 确认后，卡片中会自动添加：
   - 等价关系的声明（A ⇔ B）
   - 正向证明模板（若 A 成立，则 B 成立）
   - 反向证明模板（若 B 成立，则 A 成立）

## 特性

1. **智能空格处理**：自动在中文和英文/数字之间添加空格
2. **结构化输出**：生成格式化的 HTML 评论，视觉效果清晰
3. **双向证明**：同时生成两个方向的证明模板
4. **撤销支持**：所有操作都在 undoGrouping 中执行

## 代码位置

- `/mnutils/xdyyutils.js`：第 11070-11073 行（样式定义）
- `/mnutils/xdyyutils.js`：第 12336-12478 行（核心方法）
- `/mnutils/xdyyutils.js`：第 2384-2400 行（MNMath 入口）
- `/mntoolbar/mntoolbar/xdyy_custom_actions_registry.js`：第 2996-3011 行（action 注册）
- `/mntoolbar/mntoolbar/xdyy_menu_registry.js`：第 554-558 行（菜单项）