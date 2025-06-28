# MarginNote4 开发 MCP 服务器

这是一个专门为 MarginNote4 插件开发设计的 MCP (Model Context Protocol) 服务器，提供了多个实用工具来加速你的开发流程。

## 功能特性

### 1. 插件验证 (`validate_plugin`)
- 检查插件必需文件（main.js, mnaddon.json）
- 验证配置文件格式
- 提供错误和警告信息

### 2. 卡片类型生成器 (`generate_card_type`)
- 快速生成新的知识卡片类型定义
- 自动格式化为 MNMath.types 格式
- 支持自定义字段配置

### 3. 中文文本格式化 (`format_chinese_text`)
- 实现 Pangu.js 规则
- 中英文之间自动加空格
- 标点符号全角化

### 4. 插件打包 (`build_plugin`)
- 自动打包为 .mnaddon 文件
- 排除不必要的文件
- 支持自定义输出名称

### 5. 笔记结构分析 (`analyze_note_structure`)
- 解析笔记数据结构
- 识别字段和内容类型
- 提供详细的结构报告

## 安装步骤

### 1. 安装依赖
```bash
cd mcp-marginnote4
npm install
```

### 2. 添加到 Claude Code
```bash
# 使用绝对路径添加服务器
claude mcp add marginnote4-dev "node" "/Users/xiakangwei/Nutstore/Github/repository/MN-addon-develop/mnutils/mnutils/mcp-marginnote4/index.js"

# 或者如果你在 mcp-marginnote4 目录中
claude mcp add marginnote4-dev "node" "$(pwd)/index.js"
```

### 3. 验证安装
```bash
# 查看已安装的 MCP 服务器
claude mcp list

# 应该能看到 marginnote4-dev
```

## 使用方法

安装完成后，重新启动 Claude Code，我就能使用这些工具了。例如：

1. **验证你的插件**：
   - "帮我验证一下插件结构是否正确"
   
2. **生成新卡片类型**：
   - "创建一个'概念'类型的卡片，颜色索引5，包含'定义'和'例子'字段"

3. **格式化中文文本**：
   - "帮我格式化这段文本的中英文间距"

4. **打包插件**：
   - "把插件打包成 mnutils-v2.0.0.mnaddon"

## 配置说明

MCP 服务器配置保存在：
- macOS: `~/.config/claude/claude_desktop_config.json`
- 配置是持久化的，下次启动自动生效

## 卸载方法

如果需要移除这个 MCP 服务器：
```bash
claude mcp remove marginnote4-dev
```

## 注意事项

1. 这个 MCP 服务器完全在本地运行
2. 不会上传任何数据到云端
3. 所有操作都在你的电脑上完成
4. 可以随时查看和修改源代码