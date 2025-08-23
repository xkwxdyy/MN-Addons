#!/bin/bash

# Alfred Workflow Script for MNTaskBoard
# 用于 Alfred 快速启动任务看板

BOARD_DIR="/Users/xiakangwei/Nutstore/Github/repository/MN-Addon/MNAddon-develop/mntask/MNTaskBoard"
PORT=3000

# 获取查询参数
query="$1"

# 进入项目目录
cd "$BOARD_DIR"

# 检查是否已经在运行
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
    case "$query" in
        "focus")
            open "http://localhost:$PORT?view=focus"
            echo "🎯 已打开焦点视图"
            ;;
        "kanban")
            open "http://localhost:$PORT?view=kanban"
            echo "📋 已打开看板视图"
            ;;
        "perspective")
            open "http://localhost:$PORT?view=perspective"
            echo "👁️ 已打开透视视图"
            ;;
        *)
            open "http://localhost:$PORT"
            echo "📍 MNTaskBoard 已经在运行，已打开浏览器"
            ;;
    esac
    exit 0
fi

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖..."
    pnpm install > /dev/null 2>&1
fi

# 启动服务器
echo "🚀 正在启动 MNTaskBoard..."
pnpm dev > /dev/null 2>&1 &

# 等待服务器启动
sleep 3

# 根据参数打开对应页面
case "$query" in
    "focus")
        open "http://localhost:$PORT?view=focus"
        echo "🎯 已启动并打开焦点视图"
        ;;
    "kanban")
        open "http://localhost:$PORT?view=kanban"
        echo "📋 已启动并打开看板视图"
        ;;
    "perspective")
        open "http://localhost:$PORT?view=perspective"
        echo "👁️ 已启动并打开透视视图"
        ;;
    *)
        open "http://localhost:$PORT"
        echo "✅ MNTaskBoard 已启动并打开"
        ;;
esac