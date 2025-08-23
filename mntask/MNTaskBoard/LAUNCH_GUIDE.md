# MNTaskBoard 快速启动指南

本文档介绍了多种快速启动 MN 任务看板的方法，让你能够一键启动，无需记住复杂的命令。

## 🚀 方案概览

| 方案 | 适用场景 | 启动方式 | URL 支持 |
|------|----------|----------|----------|
| 基础脚本 | 命令行用户 | 终端命令 | ❌ |
| PM2 后台运行 | 常驻服务 | 进程管理 | ✅ |
| macOS 应用 | 双击启动 | 桌面图标 | ✅ |
| Alfred Workflow | Alfred 用户 | 关键词触发 | ❌ |
| LaunchBar Action | LaunchBar 用户 | 快捷键触发 | ❌ |
| Raycast 脚本 | Raycast 用户 | 命令面板 | ❌ |

## 📋 方案 1：基础启动脚本

### 文件说明
- `start-taskboard.sh` - 命令行启动脚本
- `start-taskboard.command` - 可双击的 macOS 脚本

### 使用方法
```bash
# 方法 1：命令行运行
./start-taskboard.sh

# 方法 2：双击 start-taskboard.command 文件
```

### 特点
- ✅ 智能检测服务器是否已运行
- ✅ 自动安装缺失的依赖
- ✅ 等待服务器启动后自动打开浏览器
- ✅ 提供详细的启动信息和错误提示

## 🔧 方案 2：PM2 进程管理器（推荐）

### 首次设置
```bash
# 安装 PM2 并设置自启动
./pm2-start.sh setup
```

### 日常使用
```bash
# 启动应用
./pm2-start.sh start

# 停止应用  
./pm2-start.sh stop

# 重启应用
./pm2-start.sh restart

# 查看状态
./pm2-start.sh status

# 查看日志
./pm2-start.sh logs

# 直接打开浏览器
./pm2-start.sh open
```

### 特点
- ✅ 后台常驻运行，系统重启后自动启动
- ✅ 支持日志记录和状态监控
- ✅ 崩溃自动重启
- ✅ 固定的访问地址：http://localhost:3000
- ✅ 支持多种管理命令

### URL 访问
配置完成后，你可以在任何任务管理软件中使用：
```
http://localhost:3000
```
这个 URL 将始终有效，无需每次启动。

## 🖱️ 方案 3：macOS 应用 + URL Scheme

### 创建应用
```bash
# 运行脚本创建 MNTaskBoard.app
./create-automator-app.sh
```

### 使用方法
1. **双击启动**：双击桌面上的 `MNTaskBoard.app`
2. **URL Scheme**：
   - `mntaskboard://open` - 启动应用
   - `mntaskboard://focus` - 打开焦点视图
   - `mntaskboard://kanban` - 打开看板视图

### 在任务管理软件中使用
你可以在 OmniFocus、Things、Todoist 等软件中创建链接：
```
启动任务看板: mntaskboard://open
打开焦点视图: mntaskboard://focus
打开看板视图: mntaskboard://kanban
```

### 特点
- ✅ 支持自定义 URL Scheme
- ✅ 可添加到 Dock 或 Launchpad
- ✅ 系统通知提示
- ✅ 多种视图模式快速访问

## 🔍 方案 4：Alfred Workflow

### 安装方法
1. 双击 `MNTaskBoard.alfredworkflow` 文件
2. Alfred 会自动导入工作流

### 使用方法
在 Alfred 中输入：
- `task` - 启动默认视图
- `task focus` - 启动焦点视图
- `task kanban` - 启动看板视图
- `task perspective` - 启动透视视图

### 特点
- ✅ 快速关键词触发
- ✅ 支持多种视图参数
- ✅ 智能服务器状态检测
- ✅ 自动依赖安装

## 🚀 方案 5：LaunchBar Action

### 安装方法
1. 打开 LaunchBar
2. 按 `Cmd+L` 打开 LaunchBar 目录
3. 将 `launchbar-action/MNTaskBoard.lbaction` 拖入 Actions 文件夹
4. 或双击 `MNTaskBoard.lbaction` 自动安装

### 使用方法
在 LaunchBar 中：
1. 激活 LaunchBar（默认 `Option+Space`）
2. 输入 `task` 或 `MNTaskBoard`
3. 可选输入参数：
   - `focus` 或 `焦点` - 焦点视图
   - `kanban` 或 `看板` - 看板视图
   - `perspective` 或 `透视` - 透视视图

### 特点
- ✅ 支持中英文参数
- ✅ 实时状态检测
- ✅ 系统通知反馈
- ✅ 后台进程管理

## ⚡ 方案 6：Raycast Script Commands

### 安装方法
1. 打开 Raycast
2. 进入 Extensions 设置
3. 选择 "Add Script Directory"
4. 添加 `raycast-scripts` 文件夹
5. 或直接将脚本文件复制到 Raycast 脚本目录

### 可用命令
- **启动 MN任务看板** - 启动默认视图
- **打开焦点视图** - 直接打开焦点视图  
- **打开看板视图** - 直接打开看板视图

### 使用方法
1. 激活 Raycast（默认 `Cmd+Space`）
2. 输入命令名称的任意部分
3. 按回车执行

### 特点
- ✅ 原生 Raycast 集成
- ✅ 分离的视图命令
- ✅ 简洁的状态反馈
- ✅ 快速搜索匹配

## 📖 使用建议

### 日常开发用户
推荐使用 **PM2 方案**：
1. 一次配置，长期使用
2. 系统重启后自动启动
3. 固定 URL 地址，可在各种软件中使用

### 偶尔使用用户
推荐使用 **macOS 应用方案**：
1. 双击即可启动
2. 支持 URL Scheme，可集成到任务管理软件

### 效率工具用户
根据你使用的工具选择：
- Alfred 用户：Alfred Workflow
- LaunchBar 用户：LaunchBar Action  
- Raycast 用户：Raycast Scripts

### 任务管理软件集成

#### OmniFocus
在任务或项目中添加链接：
```
启动看板: mntaskboard://open
或固定地址: http://localhost:3000
```

#### Things 3
在任务备注中添加：
```markdown
[打开任务看板](mntaskboard://open)
[焦点视图](mntaskboard://focus)
```

#### Todoist
```markdown
[任务看板](http://localhost:3000)
```

## 🛠️ 故障排除

### 常见问题

1. **端口 3000 被占用**
   ```bash
   # 查看占用端口的进程
   lsof -i :3000
   # 终止进程
   kill -9 <PID>
   ```

2. **pnpm 命令不存在**
   ```bash
   # 安装 pnpm
   npm install -g pnpm
   ```

3. **权限问题**
   ```bash
   # 给脚本添加执行权限
   chmod +x start-taskboard.sh
   ```

4. **依赖安装失败**
   ```bash
   # 清除缓存重新安装
   rm -rf node_modules
   pnpm install
   ```

### 日志查看

- PM2 日志：`./pm2-start.sh logs`
- 开发服务器日志：直接查看终端输出
- 系统日志：Console.app 查看相关错误

## 📝 自定义配置

### 修改端口
如果需要修改默认端口 3000，需要同时修改以下文件：
- `start-taskboard.sh`
- `ecosystem.config.js`
- `create-automator-app.sh`
- 所有 Workflow/Action 文件

### 修改路径
如果项目路径发生变化，需要更新所有脚本中的 `BOARD_DIR` 变量。

## ✨ 总结

现在你有了 6 种不同的方式来快速启动 MN 任务看板：

1. **最简单**：双击 `start-taskboard.command`
2. **最稳定**：使用 PM2 后台运行
3. **最灵活**：macOS 应用 + URL Scheme
4. **最快速**：Alfred/LaunchBar/Raycast 集成

选择适合你工作流程的方案，或者同时使用多种方案。每种方案都经过测试，确保可靠性和易用性。

如有问题或建议，请访问项目仓库：https://github.com/xkwxdyy/MN-Addons