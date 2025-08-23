#!/bin/bash

# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title 启动 MN任务看板
# @raycast.mode compact
# @raycast.icon 📋
# @raycast.description 快速启动 MN 任务看板应用
# @raycast.author MN-Addon Team
# @raycast.authorURL https://github.com/xkwxdyy/MN-Addons
# @raycast.packageName MNTaskBoard

BOARD_DIR="/Users/xiakangwei/Nutstore/Github/repository/MN-Addon/MNAddon-develop/mntask/MNTaskBoard"
PORT=3000

# 进入项目目录
cd "$BOARD_DIR" || exit 1

# 检查是否已经在运行
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "🎯 MNTaskBoard 已在运行，正在打开浏览器..."
    open "http://localhost:$PORT"
    exit 0
fi

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖..."
    pnpm install > /dev/null 2>&1
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败，请检查 pnpm 是否已安装"
        exit 1
    fi
fi

# 启动开发服务器
echo "🚀 正在启动 MNTaskBoard..."
pnpm dev > /dev/null 2>&1 &

# 等待服务器启动
sleep 3

# 检查服务器是否成功启动
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "✅ MNTaskBoard 已启动，正在打开浏览器..."
    open "http://localhost:$PORT"
else
    echo "❌ 启动失败，请手动检查"
    exit 1
fi