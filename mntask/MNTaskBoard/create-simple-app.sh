#!/bin/bash

# 使用 AppleScript 创建简单的 MNTaskBoard 启动器

SCRIPT_PATH="/tmp/MNTaskBoard_Launcher.applescript"
APP_NAME="MNTaskBoard"
APPS_PATH="/Users/xiakangwei/Applications/${APP_NAME}.app"

echo "🍎 正在创建 AppleScript 启动器..."

# 创建 AppleScript 内容
cat > "$SCRIPT_PATH" << 'EOF'
-- MNTaskBoard 启动器
-- 使用 PM2 或守护脚本启动任务看板

on run
    set boardDir to "/Users/xiakangwei/Nutstore/Github/repository/MN-Addon/MNAddon-develop/mntask/MNTaskBoard"
    
    try
        -- 显示启动通知
        display notification "正在启动 MN 任务看板..." with title "MNTaskBoard"
        
        -- 切换到项目目录并启动
        set command to "cd " & quoted form of boardDir & " && ./daemon-start.sh start"
        set result to do shell script command
        
        -- 等待服务器启动
        delay 2
        
        -- 打开浏览器
        open location "http://localhost:3000"
        
        -- 显示成功通知
        if result contains "started" or result contains "already_running" then
            display notification "任务看板已启动" with title "MNTaskBoard"
        else
            display notification "启动失败，请检查日志" with title "MNTaskBoard"
        end if
        
    on error errorMsg
        display dialog "启动失败: " & errorMsg buttons {"确定"} default button "确定"
    end try
end run

-- 处理文件拖拽（可选）
on open fileList
    run
end open
EOF

echo "📱 编译 AppleScript 应用..."

# 使用 osacompile 编译为应用
osacompile -o "$APPS_PATH" "$SCRIPT_PATH"

if [ $? -eq 0 ]; then
    echo "✅ AppleScript 应用创建成功: $APPS_PATH"
    
    # 复制图标（如果存在）
    if [ -f "AppIcon.icns" ]; then
        echo "🎨 复制图标..."
        cp "AppIcon.icns" "$APPS_PATH/Contents/Resources/applet.icns"
    fi
    
    # 清除隔离属性
    echo "🛡️  清除隔离属性..."
    xattr -cr "$APPS_PATH"
    
    # 设置权限
    chmod -R 755 "$APPS_PATH"
    
    echo ""
    echo "🎯 AppleScript 启动器已创建!"
    echo "📍 位置: $APPS_PATH"
    echo "💡 这个版本应该可以正常移动到任何位置"
    
else
    echo "❌ AppleScript 编译失败"
    exit 1
fi

# 清理临时文件
rm -f "$SCRIPT_PATH"

echo ""
echo "✨ 完成！现在你有两个选项："
echo "1. 使用简单的 AppleScript 版本 (推荐)"
echo "2. 使用完整的 shell 版本"