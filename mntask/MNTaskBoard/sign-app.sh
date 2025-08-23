#!/bin/bash

# 签名 MNTaskBoard.app 的脚本

APP_PATH="/Users/xiakangwei/Desktop/MNTaskBoard.app"

if [ ! -d "$APP_PATH" ]; then
    echo "❌ 未找到应用: $APP_PATH"
    exit 1
fi

echo "📝 正在签名 MNTaskBoard.app..."

# 1. 签名所有可执行文件
echo "🔐 签名可执行文件..."
codesign --force --sign - "$APP_PATH/Contents/MacOS/url-handler.sh" 2>/dev/null
codesign --force --sign - "$APP_PATH/Contents/MacOS/MNTaskBoard" 2>/dev/null

# 2. 签名整个应用包
echo "🔐 签名应用包..."
codesign --force --sign - "$APP_PATH"

# 3. 验证签名
echo "✅ 验证签名..."
if codesign -dv "$APP_PATH" 2>/dev/null; then
    echo "✅ 应用签名成功！"
else
    echo "❌ 应用签名失败"
    exit 1
fi

# 4. 清除 Gatekeeper 记录
echo "🧹 清除 Gatekeeper 缓存..."
sudo spctl --add "$APP_PATH" 2>/dev/null
sudo xattr -dr com.apple.quarantine "$APP_PATH" 2>/dev/null

# 5. 刷新系统服务
echo "🔄 刷新系统服务..."
/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister -f "$APP_PATH"
killall Finder 2>/dev/null

echo ""
echo "🎉 签名完成！现在尝试移动到 Applications 文件夹。"
echo ""
echo "💡 如果还是无法移动，请尝试："
echo "1. 重启 Finder: killall Finder"
echo "2. 注销并重新登录"
echo "3. 重启 Mac"