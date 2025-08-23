#!/bin/bash

# MNTaskBoard macOS 可双击执行脚本
# 双击此文件即可启动任务看板

BOARD_DIR="/Users/xiakangwei/Nutstore/Github/repository/MN-Addon/MNAddon-develop/mntask/MNTaskBoard"
PORT=3000

# 在新的 Terminal 窗口中启动
osascript -e "
tell application \"Terminal\"
    activate
    do script \"
        echo '🚀 正在启动 MNTaskBoard...';
        cd '$BOARD_DIR';
        
        if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
            echo '⚠️  MNTaskBoard 已经在运行';
            open 'http://localhost:$PORT';
            exit 0;
        fi;
        
        if [ ! -d 'node_modules' ]; then
            echo '📦 正在安装依赖...';
            pnpm install;
        fi;
        
        echo '🔧 正在启动开发服务器...';
        pnpm dev;
    \"
end tell
"

# 等待服务器启动
sleep 3

# 打开浏览器
open "http://localhost:$PORT"