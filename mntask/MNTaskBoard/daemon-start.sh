#!/bin/bash

# 通用的后台守护启动脚本
# 用于各种工具调用，确保服务器在后台持续运行

BOARD_DIR="/Users/xiakangwei/Nutstore/Github/repository/MN-Addon/MNAddon-develop/mntask/MNTaskBoard"
PORT=3000
PIDFILE="/tmp/mntaskboard.pid"
LOGFILE="/tmp/mntaskboard.log"

# 颜色定义（用于调试输出）
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 进入项目目录
cd "$BOARD_DIR" || exit 1

# 检查是否已经在运行
check_running() {
    if [ -f "$PIDFILE" ]; then
        PID=$(cat "$PIDFILE")
        if ps -p "$PID" > /dev/null 2>&1; then
            return 0  # 正在运行
        else
            rm -f "$PIDFILE"  # 清理过期的 PID 文件
        fi
    fi
    
    # 再次检查端口
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        # 端口被占用，保存 PID
        PID=$(lsof -Pi :$PORT -sTCP:LISTEN -t | head -1)
        echo "$PID" > "$PIDFILE"
        return 0  # 正在运行
    fi
    
    return 1  # 未运行
}

# 启动服务器
start_server() {
    echo "$(date): Starting MNTaskBoard..." >> "$LOGFILE"
    
    # 检查依赖
    if [ ! -d "node_modules" ]; then
        echo "$(date): Installing dependencies..." >> "$LOGFILE"
        pnpm install >> "$LOGFILE" 2>&1
    fi
    
    # 使用 nohup 启动服务器，确保进程独立
    nohup pnpm dev >> "$LOGFILE" 2>&1 &
    PID=$!
    
    # 保存 PID
    echo "$PID" > "$PIDFILE"
    
    # 等待服务器启动
    echo "$(date): Waiting for server to start (PID: $PID)..." >> "$LOGFILE"
    
    for i in {1..20}; do
        if curl -s "http://localhost:$PORT" > /dev/null 2>&1; then
            echo "$(date): Server started successfully" >> "$LOGFILE"
            return 0
        fi
        sleep 0.5
    done
    
    echo "$(date): Server failed to start" >> "$LOGFILE"
    return 1
}

# 停止服务器
stop_server() {
    if [ -f "$PIDFILE" ]; then
        PID=$(cat "$PIDFILE")
        if ps -p "$PID" > /dev/null 2>&1; then
            kill "$PID"
            rm -f "$PIDFILE"
            echo "$(date): Server stopped (PID: $PID)" >> "$LOGFILE"
        fi
    fi
    
    # 确保端口释放
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        lsof -Pi :$PORT -sTCP:LISTEN -t | xargs kill 2>/dev/null
    fi
}

# 主逻辑
case "${1:-start}" in
    "start")
        if check_running; then
            echo "already_running"
            exit 0
        fi
        
        if start_server; then
            echo "started"
            exit 0
        else
            echo "failed"
            exit 1
        fi
        ;;
    
    "stop")
        stop_server
        echo "stopped"
        ;;
    
    "status")
        if check_running; then
            echo "running"
            exit 0
        else
            echo "stopped"
            exit 1
        fi
        ;;
    
    "restart")
        stop_server
        sleep 1
        if start_server; then
            echo "restarted"
            exit 0
        else
            echo "failed"
            exit 1
        fi
        ;;
    
    *)
        echo "Usage: $0 {start|stop|status|restart}"
        exit 1
        ;;
esac