#!/bin/bash

# 创建 macOS Automator 应用的脚本
# 运行此脚本将创建可双击的 MNTaskBoard.app

APP_NAME="MNTaskBoard"
APP_PATH="/Users/xiakangwei/Desktop/${APP_NAME}.app"
BOARD_DIR="/Users/xiakangwei/Nutstore/Github/repository/MN-Addon/MNAddon-develop/mntask/MNTaskBoard"

echo "🔧 正在创建 ${APP_NAME}.app..."

# 创建应用包结构
mkdir -p "$APP_PATH/Contents/MacOS"
mkdir -p "$APP_PATH/Contents/Resources"

# 检查并创建图标
ICON_FILE="AppIcon.icns"
if [ ! -f "$ICON_FILE" ]; then
    echo "🎨 未找到图标文件，正在创建..."
    if [ -f "create-icon.sh" ]; then
        ./create-icon.sh
    else
        echo "⚠️  警告：未找到图标创建脚本，应用将使用默认图标"
    fi
fi

# 复制图标到应用包
if [ -f "$ICON_FILE" ]; then
    cp "$ICON_FILE" "$APP_PATH/Contents/Resources/"
    echo "✅ 图标已复制到应用包"
else
    echo "⚠️  使用默认系统图标"
fi

# 创建 Info.plist
cat > "$APP_PATH/Contents/Info.plist" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>MNTaskBoard</string>
    <key>CFBundleIdentifier</key>
    <string>com.mnaddon.mntaskboard</string>
    <key>CFBundleName</key>
    <string>MNTaskBoard</string>
    <key>CFBundleDisplayName</key>
    <string>MN任务看板</string>
    <key>CFBundleVersion</key>
    <string>1.0</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleSignature</key>
    <string>????</string>
    <key>CFBundleIconFile</key>
    <string>AppIcon</string>
    <key>LSMinimumSystemVersion</key>
    <string>10.15</string>
    <key>NSHumanReadableCopyright</key>
    <string>© 2025 MN-Addon Team</string>
    <key>CFBundleURLTypes</key>
    <array>
        <dict>
            <key>CFBundleURLName</key>
            <string>MNTaskBoard URL</string>
            <key>CFBundleURLSchemes</key>
            <array>
                <string>mntaskboard</string>
            </array>
        </dict>
    </array>
</dict>
</plist>
EOF

# 创建主执行文件
cat > "$APP_PATH/Contents/MacOS/MNTaskBoard" << EOF
#!/bin/bash

BOARD_DIR="$BOARD_DIR"
PORT=3000

# 使用守护脚本启动服务器
cd "\$BOARD_DIR"
RESULT=\$(./daemon-start.sh start)

case "\$RESULT" in
    "already_running")
        osascript -e 'display notification "任务看板已在运行" with title "MNTaskBoard"'
        ;;
    "started")
        osascript -e 'display notification "已启动任务看板" with title "MNTaskBoard"'
        # 等待服务器完全启动
        sleep 2
        ;;
    "failed")
        osascript -e 'display notification "启动失败，请查看日志" with title "MNTaskBoard"'
        exit 1
        ;;
esac

# 打开浏览器
open "http://localhost:\$PORT"
EOF

# 给执行文件添加权限
chmod +x "$APP_PATH/Contents/MacOS/MNTaskBoard"

# 创建 URL Scheme 处理器
cat > "$APP_PATH/Contents/MacOS/url-handler.sh" << 'EOF'
#!/bin/bash

# 处理 URL Scheme
URL="$1"
BOARD_DIR="/Users/xiakangwei/Nutstore/Github/repository/MN-Addon/MNAddon-develop/mntask/MNTaskBoard"

cd "$BOARD_DIR"

# 使用守护脚本确保服务器运行
./daemon-start.sh start > /dev/null

case "$URL" in
    "mntaskboard://open")
        open "http://localhost:3000"
        ;;
    "mntaskboard://focus")
        open "http://localhost:3000?view=focus"
        ;;
    "mntaskboard://kanban")
        open "http://localhost:3000?view=kanban"
        ;;
    *)
        open "http://localhost:3000"
        ;;
esac
EOF

chmod +x "$APP_PATH/Contents/MacOS/url-handler.sh"

echo "✅ ${APP_NAME}.app 已创建在桌面"
echo "📍 路径: $APP_PATH"
echo ""
echo "🎯 使用方法："
echo "1. 双击 ${APP_NAME}.app 启动"
echo "2. 或使用 URL Scheme:"
echo "   - mntaskboard://open  # 启动应用"
echo "   - mntaskboard://focus # 打开焦点视图"
echo "   - mntaskboard://kanban # 打开看板视图"
echo ""
echo "💡 提示: 可以将 ${APP_NAME}.app 拖到 Dock 或 Applications 文件夹"

# 注册 URL Scheme（需要用户确认）
echo ""
echo "🔗 正在注册 URL Scheme..."
defaults write com.apple.LaunchServices/com.apple.launchservices.secure LSHandlers -array-add '{LSHandlerContentType="mntaskboard";LSHandlerRoleAll="com.mnaddon.mntaskboard";}'

# 刷新 Launch Services 数据库
/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister -kill -r -domain local -domain system -domain user

echo "✅ URL Scheme 注册完成"

# 清除隔离属性，防止 macOS 阻止删除/移动应用
echo ""
echo "🛡️  正在清除隔离属性和修复权限..."

# 清除所有扩展属性
xattr -cr "$APP_PATH" 2>/dev/null

# 设置正确的所有权和权限
chmod -R 755 "$APP_PATH"
chown -R $(whoami):staff "$APP_PATH"

# 清除 quarantine 标志
xattr -d com.apple.quarantine "$APP_PATH" 2>/dev/null
xattr -d com.apple.FinderInfo "$APP_PATH" 2>/dev/null

# 添加代码签名，确保应用可以移动到 Applications
echo "📝 正在添加代码签名..."
codesign --force --sign - "$APP_PATH/Contents/MacOS/url-handler.sh" 2>/dev/null
codesign --force --sign - "$APP_PATH/Contents/MacOS/MNTaskBoard" 2>/dev/null
codesign --force --sign - "$APP_PATH" 2>/dev/null

if codesign -dv "$APP_PATH" 2>/dev/null; then
    echo "✅ 代码签名成功"
else
    echo "⚠️  代码签名失败，但应用仍可使用"
fi

# 触发 Launch Services 重新识别应用
/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister -f "$APP_PATH"

# 刷新 Finder
touch "$APP_PATH"

echo "✅ 隔离属性已清除，权限已修复"
echo ""
echo "💡 如果图标未显示，请："
echo "   1. 重启 Finder: killall Finder"
echo "   2. 或注销后重新登录"