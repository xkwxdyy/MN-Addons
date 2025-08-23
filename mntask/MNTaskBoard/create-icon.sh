#!/bin/bash

# 创建 macOS .icns 图标文件的脚本

ICON_DIR="/tmp/MNTaskBoard.iconset"
SVG_FILE="AppIcon.svg"
ICNS_FILE="AppIcon.icns"

# 检查 SVG 文件是否存在
if [ ! -f "$SVG_FILE" ]; then
    echo "❌ 错误：找不到 $SVG_FILE 文件"
    exit 1
fi

echo "🎨 正在创建 macOS 图标..."

# 创建 iconset 目录
rm -rf "$ICON_DIR"
mkdir -p "$ICON_DIR"

# 检查是否安装了 rsvg-convert 或 inkscape
if command -v rsvg-convert &> /dev/null; then
    CONVERTER="rsvg-convert"
    echo "✅ 使用 rsvg-convert 转换 SVG"
elif command -v inkscape &> /dev/null; then
    CONVERTER="inkscape"
    echo "✅ 使用 Inkscape 转换 SVG"
else
    echo "⚠️  未找到 rsvg-convert 或 Inkscape"
    echo "🔧 正在尝试使用 qlmanage (macOS 内置)..."
    
    # 使用 macOS 内置工具的替代方案
    # 首先尝试使用 sips（macOS 内置）
    if command -v sips &> /dev/null; then
        echo "📝 创建临时 PNG 文件..."
        
        # 先转换 SVG 为高分辨率 PNG
        qlmanage -t -s 1024 "$SVG_FILE" -o /tmp/ > /dev/null 2>&1
        
        if [ -f "/tmp/${SVG_FILE}.png" ]; then
            mv "/tmp/${SVG_FILE}.png" "/tmp/temp_1024.png"
            TEMP_PNG="/tmp/temp_1024.png"
            
            # 生成各种尺寸
            sips -z 16 16 "$TEMP_PNG" --out "$ICON_DIR/icon_16x16.png" > /dev/null 2>&1
            sips -z 32 32 "$TEMP_PNG" --out "$ICON_DIR/icon_16x16@2x.png" > /dev/null 2>&1
            sips -z 32 32 "$TEMP_PNG" --out "$ICON_DIR/icon_32x32.png" > /dev/null 2>&1
            sips -z 64 64 "$TEMP_PNG" --out "$ICON_DIR/icon_32x32@2x.png" > /dev/null 2>&1
            sips -z 128 128 "$TEMP_PNG" --out "$ICON_DIR/icon_128x128.png" > /dev/null 2>&1
            sips -z 256 256 "$TEMP_PNG" --out "$ICON_DIR/icon_128x128@2x.png" > /dev/null 2>&1
            sips -z 256 256 "$TEMP_PNG" --out "$ICON_DIR/icon_256x256.png" > /dev/null 2>&1
            sips -z 512 512 "$TEMP_PNG" --out "$ICON_DIR/icon_256x256@2x.png" > /dev/null 2>&1
            sips -z 512 512 "$TEMP_PNG" --out "$ICON_DIR/icon_512x512.png" > /dev/null 2>&1
            sips -z 1024 1024 "$TEMP_PNG" --out "$ICON_DIR/icon_512x512@2x.png" > /dev/null 2>&1
            
            # 清理临时文件
            rm -f "$TEMP_PNG"
            
        else
            echo "❌ 无法使用 qlmanage 转换 SVG"
            echo "💡 请安装 rsvg-convert: brew install librsvg"
            echo "💡 或安装 Inkscape: brew install --cask inkscape"
            exit 1
        fi
    else
        echo "❌ 未找到可用的转换工具"
        exit 1
    fi
fi

# 如果有专业转换工具，使用它们
if [ "$CONVERTER" = "rsvg-convert" ]; then
    # 使用 rsvg-convert 生成不同尺寸
    rsvg-convert -w 16 -h 16 "$SVG_FILE" -o "$ICON_DIR/icon_16x16.png"
    rsvg-convert -w 32 -h 32 "$SVG_FILE" -o "$ICON_DIR/icon_16x16@2x.png"
    rsvg-convert -w 32 -h 32 "$SVG_FILE" -o "$ICON_DIR/icon_32x32.png"
    rsvg-convert -w 64 -h 64 "$SVG_FILE" -o "$ICON_DIR/icon_32x32@2x.png"
    rsvg-convert -w 128 -h 128 "$SVG_FILE" -o "$ICON_DIR/icon_128x128.png"
    rsvg-convert -w 256 -h 256 "$SVG_FILE" -o "$ICON_DIR/icon_128x128@2x.png"
    rsvg-convert -w 256 -h 256 "$SVG_FILE" -o "$ICON_DIR/icon_256x256.png"
    rsvg-convert -w 512 -h 512 "$SVG_FILE" -o "$ICON_DIR/icon_256x256@2x.png"
    rsvg-convert -w 512 -h 512 "$SVG_FILE" -o "$ICON_DIR/icon_512x512.png"
    rsvg-convert -w 1024 -h 1024 "$SVG_FILE" -o "$ICON_DIR/icon_512x512@2x.png"
    
elif [ "$CONVERTER" = "inkscape" ]; then
    # 使用 Inkscape 生成不同尺寸
    inkscape -w 16 -h 16 "$SVG_FILE" -o "$ICON_DIR/icon_16x16.png" > /dev/null 2>&1
    inkscape -w 32 -h 32 "$SVG_FILE" -o "$ICON_DIR/icon_16x16@2x.png" > /dev/null 2>&1
    inkscape -w 32 -h 32 "$SVG_FILE" -o "$ICON_DIR/icon_32x32.png" > /dev/null 2>&1
    inkscape -w 64 -h 64 "$SVG_FILE" -o "$ICON_DIR/icon_32x32@2x.png" > /dev/null 2>&1
    inkscape -w 128 -h 128 "$SVG_FILE" -o "$ICON_DIR/icon_128x128.png" > /dev/null 2>&1
    inkscape -w 256 -h 256 "$SVG_FILE" -o "$ICON_DIR/icon_128x128@2x.png" > /dev/null 2>&1
    inkscape -w 256 -h 256 "$SVG_FILE" -o "$ICON_DIR/icon_256x256.png" > /dev/null 2>&1
    inkscape -w 512 -h 512 "$SVG_FILE" -o "$ICON_DIR/icon_256x256@2x.png" > /dev/null 2>&1
    inkscape -w 512 -h 512 "$SVG_FILE" -o "$ICON_DIR/icon_512x512.png" > /dev/null 2>&1
    inkscape -w 1024 -h 1024 "$SVG_FILE" -o "$ICON_DIR/icon_512x512@2x.png" > /dev/null 2>&1
fi

# 检查是否成功生成了 PNG 文件
if [ ! -f "$ICON_DIR/icon_512x512@2x.png" ]; then
    echo "❌ PNG 文件生成失败"
    exit 1
fi

echo "📸 PNG 文件生成完成"

# 使用 iconutil 创建 .icns 文件
if command -v iconutil &> /dev/null; then
    iconutil -c icns "$ICON_DIR" -o "$ICNS_FILE"
    
    if [ -f "$ICNS_FILE" ]; then
        echo "✅ 图标创建成功: $ICNS_FILE"
        
        # 清理临时目录
        rm -rf "$ICON_DIR"
        
        # 显示文件大小
        SIZE=$(du -h "$ICNS_FILE" | cut -f1)
        echo "📏 文件大小: $SIZE"
        
        echo ""
        echo "🎯 使用方法："
        echo "1. 运行 ./create-automator-app.sh 创建应用"
        echo "2. 新应用将自动包含这个图标"
        echo ""
        
    else
        echo "❌ .icns 文件创建失败"
        exit 1
    fi
else
    echo "❌ 未找到 iconutil 命令（仅在 macOS 上可用）"
    exit 1
fi