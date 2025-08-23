#!/bin/bash

# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title 打开焦点视图
# @raycast.mode compact
# @raycast.icon 🎯
# @raycast.description 打开 MN 任务看板的焦点视图
# @raycast.author MN-Addon Team
# @raycast.authorURL https://github.com/xkwxdyy/MN-Addons
# @raycast.packageName MNTaskBoard

BOARD_DIR="/Users/xiakangwei/Nutstore/Github/repository/MN-Addon/MNAddon-develop/mntask/MNTaskBoard"
PORT=3000

# 进入项目目录
cd "$BOARD_DIR" || exit 1

# 检查是否已经在运行
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "🎯 正在打开焦点视图..."
    open "http://localhost:$PORT?view=focus"
    exit 0
fi

# 服务器未运行，先启动
echo "🚀 服务器未运行，正在启动..."

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖..."
    pnpm install > /dev/null 2>&1
fi

# 启动开发服务器
pnpm dev > /dev/null 2>&1 &

# 等待服务器启动
sleep 3

# 打开焦点视图
echo "🎯 已启动，正在打开焦点视图..."
open "http://localhost:$PORT?view=focus"