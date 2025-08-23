#!/bin/bash

# MNTaskBoard 快速启动脚本
# 用法：直接执行 ./start-taskboard.sh

BOARD_DIR="/Users/xiakangwei/Nutstore/Github/repository/MN-Addon/MNAddon-develop/mntask/MNTaskBoard"
PORT=3000

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 正在启动 MNTaskBoard...${NC}"

# 检查目录是否存在
if [ ! -d "$BOARD_DIR" ]; then
    echo -e "${RED}❌ 错误：目录不存在 $BOARD_DIR${NC}"
    exit 1
fi

# 进入项目目录
cd "$BOARD_DIR"

# 检查是否已经在运行
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${YELLOW}⚠️  MNTaskBoard 已经在运行${NC}"
    echo -e "${GREEN}✅ 正在打开浏览器...${NC}"
    open "http://localhost:$PORT"
    exit 0
fi

# 检查 pnpm 是否安装
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ 错误：pnpm 未安装${NC}"
    echo "请先安装 pnpm: npm install -g pnpm"
    exit 1
fi

# 检查 node_modules 是否存在，不存在则安装依赖
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 正在安装依赖...${NC}"
    pnpm install
fi

# 启动开发服务器
echo -e "${GREEN}🔧 正在启动开发服务器...${NC}"
pnpm dev &

# 等待服务器启动
echo -e "${YELLOW}⏳ 等待服务器启动...${NC}"
sleep 3

# 检查服务器是否成功启动
max_attempts=10
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if curl -s "http://localhost:$PORT" > /dev/null; then
        echo -e "${GREEN}✅ 服务器启动成功！${NC}"
        break
    fi
    sleep 1
    attempt=$((attempt + 1))
done

# 打开浏览器
echo -e "${GREEN}🌐 正在打开浏览器...${NC}"
open "http://localhost:$PORT"

echo -e "${GREEN}✨ MNTaskBoard 已启动！${NC}"
echo -e "${GREEN}📍 访问地址: http://localhost:$PORT${NC}"
echo -e "${YELLOW}💡 提示: 使用 Ctrl+C 停止服务器${NC}"

# 保持脚本运行
wait