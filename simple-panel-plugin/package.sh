#!/bin/bash

# 打包 Simple Panel Plugin
# 使用方法: ./package.sh

# 获取脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# 插件名称
PLUGIN_NAME="simple-panel-plugin"
OUTPUT_FILE="${PLUGIN_NAME}.mnaddon"

# 删除旧的打包文件
if [ -f "$OUTPUT_FILE" ]; then
    echo "删除旧的打包文件..."
    rm "$OUTPUT_FILE"
fi

# 检查必需文件
echo "检查必需文件..."
for file in "mnaddon.json" "main.js" "logo.png" "simplePanelController.js"; do
    if [ ! -f "$file" ]; then
        echo "错误: 缺少必需文件 $file"
        exit 1
    fi
done

# 创建打包
echo "创建 .mnaddon 包..."
zip -r "$OUTPUT_FILE" mnaddon.json main.js logo.png simplePanelController.js README.md jsconfig.json

# 检查打包结果
if [ -f "$OUTPUT_FILE" ]; then
    echo "✅ 打包成功: $OUTPUT_FILE"
    echo "文件大小: $(du -h "$OUTPUT_FILE" | cut -f1)"
    echo ""
    echo "包含的文件:"
    unzip -l "$OUTPUT_FILE"
else
    echo "❌ 打包失败"
    exit 1
fi

echo ""
echo "下一步:"
echo "1. 在 MarginNote 中安装插件"
echo "2. 重启 MarginNote"
echo "3. 打开一个笔记本查看插件栏"