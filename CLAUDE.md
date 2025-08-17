# MN-Addon 开发经验与常见问题

## note.MNComments 与 note.comments 的关键区别（2025-01-12）

### 问题背景
在优化 MNMath.makeNote 手写评论处理时，发现了一个容易混淆的 API 使用问题，导致类型判断失效。

### 核心区别

#### 1. `note.comments` - 原始评论数组
- 包含底层的 `NoteComment` 对象
- `comment.type` 只有 5 种基础类型值：
  - `"TextNote"` - 文本评论
  - `"HtmlNote"` - HTML 评论
  - `"LinkNote"` - 合并摘录评论
  - `"PaintNote"` - 绘图评论（包括图片和手写）
  - `"AudioNote"` - 音频评论

#### 2. `note.MNComments` - 处理后的评论数组  
- 通过 `MNComment.from(note)` 生成的 `MNComment` 实例数组
- 构造时自动调用 `MNComment.getCommentType(comment)` 设置 type
- `MNComment` 的 `type` 属性是细分后的 15+ 种类型：
  - 文本类：`"textComment"`, `"markdownComment"`, `"tagComment"`
  - 链接类：`"linkComment"`, `"summaryComment"`
  - HTML类：`"HtmlComment"`
  - 合并类：`"mergedTextComment"`, `"mergedImageComment"`, `"mergedImageCommentWithDrawing"`
  - 图片类：`"imageComment"`, `"imageCommentWithDrawing"`
  - 手写类：`"drawingComment"`
  - 其他：`"audioComment"`, `"blankTextComment"`, `"blankImageComment"`

### 常见错误与正确用法

```javascript
// ❌ 错误1：对 MNComments 元素再次调用 getCommentType
let commentType = MNComment.getCommentType(note.MNComments[0]);

// ✅ 正确：直接使用 type 属性（已经是细分类型）
let commentType = note.MNComments[0].type;

// ❌ 错误2：对原始 comments 使用细分类型判断
if (note.comments[0].type === "drawingComment") { } // 永远为 false

// ✅ 正确：对原始 comments 使用基础类型
if (note.comments[0].type === "PaintNote") { }
```

### 实际案例：判断手写评论

```javascript
// 推荐方法：使用 MNComments
function isHandwritingComment(note, index) {
  let commentType = note.MNComments[index].type;
  return commentType === "drawingComment" || 
         commentType === "imageCommentWithDrawing" || 
         commentType === "mergedImageCommentWithDrawing";
}

// 备选方法：使用原始 comments（更复杂）
function isHandwritingCommentAlt(note, index) {
  let comment = note.comments[index];
  if (comment.type === "PaintNote" || comment.type === "LinkNote") {
    let commentType = MNComment.getCommentType(comment);
    return commentType === "drawingComment" || 
           commentType === "imageCommentWithDrawing" || 
           commentType === "mergedImageCommentWithDrawing";
  }
  return false;
}
```

### 最佳实践
1. **优先使用 `note.MNComments`**：类型已细分，使用更方便
2. **避免重复调用 `getCommentType`**：MNComments 已经处理过了
3. **理解类型层次**：基础类型（5种） → 细分类型（15+种）
4. **调试技巧**：`MNUtil.log(note.MNComments[0])` 查看实际 type 值

### 影响范围
- xdyyutils.js 中的 MNMath 类方法
- 所有涉及评论类型判断的功能
- 特别是手写、图片、合并内容的识别

## GitHub Issue 工作流规范（2025-01-17）

### 概述
标准化的 GitHub 问题管理流程，确保问题追踪的专业性和可追溯性。

### 1. 问题发现与记录
当开发过程中发现问题时：
- 创建临时记录文件（如 `fix_summary.md`）
- 详细记录：
  - 问题现象
  - 复现步骤
  - 原因分析
  - 解决方案

### 2. 代码修复流程
- 在本地分支进行修复
- 确保修复经过充分测试
- 保持代码改动的原子性（一个提交解决一个问题）
- 避免在一个提交中混杂多个不相关的修改

### 3. 提交规范
```bash
# 1. 添加修改的文件
git add [修改的文件]

# 2. 创建语义化提交
git commit -m "fix: 简要描述修复内容

- 详细说明修复的问题 (#issue-number)
- 列出主要改动点
- 说明影响范围"

# 3. 推送到远程仓库
git push [remote-name] [branch-name]
```

### 4. 创建 Issue
**重要原则**：必须在代码提交并推送后才创建 issue

```bash
gh issue create \
  --title "[插件名] 问题简要描述" \
  --body "## 问题描述
详细描述问题现象...

## 复现步骤
1. 步骤一
2. 步骤二
3. ...

## 原因分析
说明问题的根本原因...

## 解决方案
描述采用的解决方案...

## 相关代码
- 修复位置：[GitHub 代码永久链接]
- Commit: [commit hash]

## 修复状态
✅ 已在 [branch] 分支修复" \
  --label "插件名" \
  --label "bug/feature/enhancement"
```

### 5. Issue 更新最佳实践

#### 使用代码永久链接
```
https://github.com/[用户名]/[仓库名]/blob/[commit-hash]/[文件路径]#L[行号]
```
示例：
```
https://github.com/xkwxdyy/MN-Addons/blob/0a16a5805278ffa676a7365c22361e94d16d1876/mntask/xdyy_utils_extensions.js#L538-L546
```

#### 更新 Issue 评论
```bash
gh issue comment [issue-number] --body "已在 commit [hash] 中修复

### 相关代码链接：
- [具体修复描述]：[代码永久链接]

### 修复说明：
[详细说明修复的内容]"
```

### 6. 关闭 Issue
```bash
# 验证修复后关闭
gh issue close [issue-number] --comment "已修复并验证通过"

# 或者简单关闭
gh issue close [issue-number]
```

### 7. 完整工作流示例

以 TaskFieldUtils 方法名冲突问题为例：

1. **发现问题**：字段内容提取全部返回 null
2. **分析原因**：发现存在同名方法导致覆盖
3. **本地修复**：将方法重命名为 `extractFieldText`
4. **测试验证**：确认字段内容能正确提取
5. **提交代码**：
   ```bash
   git add xdyy_utils_extensions.js
   git commit -m "fix: 修复 TaskFieldUtils 方法名冲突导致字段提取失败 (#3)"
   git push github dev
   ```
6. **创建 Issue**：包含问题描述、原因分析、解决方案
7. **更新 Issue**：添加具体的代码链接
8. **关闭 Issue**：确认修复后关闭

### 8. 注意事项

#### 标签使用规范
- **插件标签**：必须添加（如 `mntask`、`mnai`）
- **类型标签**：
  - `bug`：错误修复
  - `feature`：新功能
  - `enhancement`：功能改进
  - `documentation`：文档更新

#### 代码链接要求
- 使用包含 commit hash 的永久链接
- 链接到具体的代码行或代码块
- 多个相关位置都要提供链接

#### Issue 描述规范
- 标题简洁明了，包含插件名
- 正文结构化，使用 Markdown 格式
- 包含足够的上下文信息
- 提供复现步骤（如适用）

#### 时机把握
- **先代码后 Issue**：确保 Issue 创建时代码已经在仓库中
- **及时更新**：重要进展及时更新到 Issue 评论中
- **及时关闭**：问题解决后及时关闭，避免积压

### 9. 批量处理技巧

当一次修复多个相关问题时：
```bash
# 1. 一次提交修复多个问题
git commit -m "fix: 修复 MNTask 制卡功能的多个问题

- 修复问题 A (#1)
- 修复问题 B (#2)
- 修复问题 C (#3)"

# 2. 分别更新各个 Issue
for issue in 1 2 3; do
  gh issue comment $issue --body "已在 commit [hash] 中修复
  相关代码：[对应的代码链接]"
done

# 3. 批量关闭
gh issue close 1 2 3
```

### 10. 文档维护

- 重要问题的解决方案应记录到 CLAUDE.md
- 通用性的解决方案可以整理成最佳实践
- 定期回顾和更新文档，保持其时效性

## Git 操作重要提醒（2025-01-17）

### 关键事项
1. **提交后必须 push**：完成 git commit 后，一定要记得执行 git push 推送到远程仓库
2. **远程仓库名称**：MN-Addon 项目的远程仓库名是 `github`，不是默认的 `origin`

### 正确的 Git 工作流
```bash
# 1. 添加文件
git add [文件名]

# 2. 提交更改
git commit -m "提交信息"

# 3. 推送到远程仓库（重要！）
git push github [分支名]  # 注意：是 github 而不是 origin
```

### 常见错误
```bash
# ❌ 错误：使用 origin
git push origin dev  # 会报错：'origin' does not appear to be a git repository

# ✅ 正确：使用 github
git push github dev
```

### 检查远程仓库配置
```bash
# 查看当前配置的远程仓库
git remote -v

# 输出示例：
# github  https://github.com/xkwxdyy/MN-Addons.git (fetch)
# github  https://github.com/xkwxdyy/MN-Addons.git (push)
```

### 重要提醒
- 在创建 GitHub Issue 之前，确保代码已经推送到远程仓库
- 使用 `git push github [分支名]` 而不是 `git push origin [分支名]`
- 如果忘记 push，Issue 中引用的代码链接将无法访问


### 问题描述
用户反复反馈时间轴任务状态更新后不刷新的严重问题：
- 点击暂停/完成按钮后显示成功通知
- 但时间轴中的任务状态和按钮没有变化
- 必须手动 cmd+R 刷新页面才能看到更新

### 根本原因
`filteredTasks` 数组包含过时的任务对象副本：
```javascript
// filteredTasks 是通过 filter 创建的副本
filteredTasks = tasks.filter(task => { ... });

// 状态更新只影响 tasks 数组中的原始对象
task.status = newStatus;  // task 是 tasks 数组中的对象

// renderTodayTimeline 使用 filteredTasks 渲染
const baseTasks = filteredTasks;  // 使用了包含旧状态的副本
```

### 解决方案
让 `renderTodayTimeline` 始终使用最新的 `tasks` 数组：
```javascript
// 修改前
const baseTasks = (filteredTasks && filteredTasks.length >= 0) ? filteredTasks : tasks;

// 修改后
const baseTasks = tasks;  // 始终使用原始数组，确保数据最新
```

### 关键要点
1. **避免使用缓存的数组副本**：在需要实时更新的场景中，应直接使用原始数据源
2. **理解 JavaScript 对象引用**：`filter()` 创建新数组但包含原对象的引用，修改对象属性会影响所有引用，但如果使用了旧的数组副本，仍会渲染旧数据
3. **调试技巧**：添加对象引用比较（`isSameObject: task === originalTask`）可以快速定位是否使用了过时的对象副本

### 相关修复
- Commit: b1a9d28
- Issue: #9