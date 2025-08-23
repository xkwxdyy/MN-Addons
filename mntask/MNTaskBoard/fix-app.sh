#!/bin/bash

# 修复 MNTaskBoard.app 的脚本

echo "🔧 开始修复 MNTaskBoard.app..."

# 1. 强制删除旧应用
if [ -d "/Users/xiakangwei/Desktop/MNTaskBoard.app" ]; then
    echo "🗑️  删除旧应用..."
    sudo rm -rf /Users/xiakangwei/Desktop/MNTaskBoard.app
fi

# 2. 清理图标缓存
echo "🧹 清理系统缓存..."
sudo rm -rf /Library/Caches/com.apple.iconservices.store 2>/dev/null
sudo find /private/var/folders/ -name com.apple.dock.iconcache -exec rm -rf {} \; 2>/dev/null
sudo find /private/var/folders/ -name com.apple.iconservices -exec rm -rf {} \; 2>/dev/null

# 3. 重启系统服务
echo "🔄 重启系统服务..."
killall Dock
killall Finder

# 4. 等待服务重启
sleep 2

# 5. 重新创建应用
echo "🚀 重新创建应用..."
./create-automator-app.sh

echo ""
echo "✅ 修复完成！"
echo ""
echo "📌 如果问题仍然存在："
echo "1. 重启 Mac"
echo "2. 或在安全模式下删除（重启时按住 Shift）"
echo "3. 或使用终端: sudo rm -rf /Users/xiakangwei/Desktop/MNTaskBoard.app"