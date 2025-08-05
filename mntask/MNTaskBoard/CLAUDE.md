# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 处理此代码库提供指导。

## 项目概述

MNTaskBoard 是一个基于 Next.js 15、React 19 和 TypeScript 构建的任务管理应用。它具有复杂的任务板功能，包括焦点任务、待处理任务、看板视图和透视管理。

## 开发命令

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 运行生产版本
pnpm start

# 运行代码检查
pnpm lint
```

## 架构与结构

### 核心架构
- **框架**: Next.js 15.2.4 配合 App Router
- **UI 库**: React 19 配合 TypeScript
- **组件库**: 基于 Radix UI 的自定义 shadcn/ui 组件
- **样式**: Tailwind CSS 配合自定义主题
- **状态管理**: React useState/useEffect 配合 localStorage 持久化

### 关键组件

1. **mntask-board.tsx** (2100+ 行代码)
   - 管理所有状态的主应用组件
   - 处理任务 CRUD 操作、透视过滤、视图切换
   - 管理三个视图：焦点视图、看板视图和透视视图
   - 实现任务层级关系（父子关系）

2. **任务管理系统**
   - 任务类型：动作(action)、项目(project)、关键结果(key-result)、目标(objective)
   - 状态：待开始(todo)、进行中(in-progress)、已暂停(paused)、已完成(completed)
   - 优先级：低(low)、中(medium)、高(high)
   - 支持标签、进度跟踪和任务关系

3. **视图系统**
   - **焦点视图**: 显示优先焦点任务和待处理任务
   - **看板视图**: 按类型拖放管理任务
   - **透视视图**: 带分组选项的自定义筛选视图

### 数据流
1. 所有任务数据存储在 localStorage，键名如下：
   - `mntask-tasks`: 焦点任务数组
   - `mntask-pending`: 待处理任务数组
   - `mntask-all-tasks`: 完整任务列表
   - `mntask-perspectives`: 自定义透视配置

2. 状态同步：
   - `allTasks` 维护完整的任务列表
   - `tasks` 和 `pendingTasks` 是子集
   - 更改会传播到所有三个状态

### 组件模式
- 所有组件使用 TypeScript 接口定义 props
- 组件分散在独立文件中（task-card.tsx、pending-task-card.tsx 等）
- UI 组件遵循 components/ui/ 中的 shadcn/ui 模式
- 路径别名：`@/` 映射到项目根目录

## 重要实现细节

### 任务 ID 生成
```typescript
id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
```

### 透视过滤
- 透视支持按以下条件过滤：标签、任务类型、状态、优先级、焦点状态
- 通过 `applyPerspectiveFilter()` 函数应用过滤器
- 每个视图维护自己选中的透视

### 任务层级
- 项目可以有子任务（动作）
- 通过 `parentId` 字段跟踪父子关系
- 删除父任务会使子任务成为孤儿（将 parentId 设为 undefined）

### 导入/导出
- 支持所有任务数据的 JSON 导出/导入
- 导出包含版本、日期和所有任务数组
- 导入前会验证数据结构

## TypeScript 配置

- 启用严格模式
- 路径别名 `@/*` 用于绝对导入
- 目标 ES6，使用 ESNext 库特性
- 模块解析：bundler

## 样式方案

- Tailwind CSS 配合自定义配色方案
- 深色主题，使用 slate/gray 调色板
- 渐变背景和毛玻璃效果
- 手风琴和过渡的自定义动画

## 开发提示

1. **添加新任务字段**：在所有使用它的组件中更新 Task 接口
2. **状态更新**：始终更新所有三个任务数组（tasks、pendingTasks、allTasks）
3. **localStorage**：通过 useEffect 钩子自动持久化更改
4. **组件创建**：遵循 components/ui/ 中的现有模式
5. **任务操作**：使用现有的辅助函数（updateTask、deleteTask 等）

## 常用模式

### 任务状态更新
```typescript
setTasks(tasks.map(task => 
  task.id === taskId 
    ? { ...task, status: newStatus }
    : task
))
```

### 多状态更新
更新任务时，确保更新传播到：
1. `tasks`（焦点任务）
2. `pendingTasks`（待处理任务）
3. `allTasks`（完整列表）

### 模态框管理
- 任务详情模态框由 `selectedTask` 状态管理
- 通过专用处理函数进行模态框操作
- 子任务导航保持模态框打开

## 性能考虑

- 大型任务列表可能影响渲染
- 待处理任务超过 100 项时考虑分页
- 透视过滤在每次渲染时都会执行
- localStorage 操作是同步的

## 测试方案

目前没有测试文件。建议的测试方案：
- 工具函数的单元测试
- 单个任务卡片的组件测试
- 任务操作的集成测试
- 用户工作流的端到端测试

## 构建与部署

项目生成静态构建，可以部署到任何静态托管服务。构建产物包含用于生产环境的优化包。