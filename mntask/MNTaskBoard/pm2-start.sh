#!/bin/bash

# PM2 快速管理脚本
# 用于启动、停止、重启 MNTaskBoard

BOARD_DIR="/Users/xiakangwei/Nutstore/Github/repository/MN-Addon/MNAddon-develop/mntask/MNTaskBoard"
APP_NAME="mntask-board"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 确保在正确目录
cd "$BOARD_DIR"

# 创建日志目录
mkdir -p logs

show_help() {
    echo -e "${BLUE}🔧 MNTaskBoard PM2 管理脚本${NC}"
    echo ""
    echo "用法: $0 [命令]"
    echo ""
    echo "命令:"
    echo "  start     启动应用"
    echo "  stop      停止应用" 
    echo "  restart   重启应用"
    echo "  status    查看状态"
    echo "  logs      查看日志"
    echo "  setup     安装 PM2 并设置自启动"
    echo "  open      打开浏览器"
    echo "  help      显示帮助"
    echo ""
}

install_pm2() {
    if ! command -v pm2 &> /dev/null; then
        echo -e "${YELLOW}📦 正在安装 PM2...${NC}"
        npm install -g pm2
    else
        echo -e "${GREEN}✅ PM2 已安装${NC}"
    fi
}

case "${1:-start}" in
    "setup")
        echo -e "${BLUE}🚀 设置 PM2 环境...${NC}"
        install_pm2
        
        # 检查依赖
        if [ ! -d "node_modules" ]; then
            echo -e "${YELLOW}📦 正在安装项目依赖...${NC}"
            pnpm install
        fi
        
        # 启动应用
        pm2 start ecosystem.config.js
        
        # 保存配置
        pm2 save
        
        # 设置开机自启动
        echo -e "${YELLOW}🔄 设置开机自启动...${NC}"
        pm2 startup
        
        echo -e "${GREEN}✅ PM2 设置完成！${NC}"
        echo -e "${BLUE}💡 现在你可以使用以下命令管理应用：${NC}"
        echo "  - pm2 start $APP_NAME    # 启动"
        echo "  - pm2 stop $APP_NAME     # 停止" 
        echo "  - pm2 restart $APP_NAME  # 重启"
        echo "  - pm2 logs $APP_NAME     # 查看日志"
        ;;
    
    "start")
        install_pm2
        
        if pm2 list | grep -q "$APP_NAME.*online"; then
            echo -e "${YELLOW}⚠️  应用已经在运行${NC}"
        else
            echo -e "${GREEN}🚀 正在启动 MNTaskBoard...${NC}"
            pm2 start ecosystem.config.js
            pm2 save
        fi
        
        sleep 2
        open "http://localhost:3000"
        echo -e "${GREEN}✅ MNTaskBoard 已启动并在浏览器中打开${NC}"
        ;;
    
    "stop")
        echo -e "${YELLOW}🛑 正在停止 MNTaskBoard...${NC}"
        pm2 stop "$APP_NAME"
        echo -e "${GREEN}✅ MNTaskBoard 已停止${NC}"
        ;;
    
    "restart")
        echo -e "${BLUE}🔄 正在重启 MNTaskBoard...${NC}"
        pm2 restart "$APP_NAME"
        sleep 2
        open "http://localhost:3000"
        echo -e "${GREEN}✅ MNTaskBoard 已重启并在浏览器中打开${NC}"
        ;;
    
    "status")
        pm2 list
        pm2 info "$APP_NAME"
        ;;
    
    "logs")
        pm2 logs "$APP_NAME"
        ;;
    
    "open")
        open "http://localhost:3000"
        echo -e "${GREEN}🌐 已在浏览器中打开 MNTaskBoard${NC}"
        ;;
    
    "help"|"-h"|"--help")
        show_help
        ;;
    
    *)
        echo -e "${RED}❌ 未知命令: $1${NC}"
        show_help
        exit 1
        ;;
esac