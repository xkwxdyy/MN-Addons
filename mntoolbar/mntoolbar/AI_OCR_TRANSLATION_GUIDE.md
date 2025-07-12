# OCR AI 翻译功能使用指南

## 功能概述

本功能为 MN Toolbar 添加了 OCR 识别后自动翻译的能力，可以将识别的外文内容自动翻译成中文并设置为卡片标题。

## 新增功能

1. **OCR 识别并翻译为标题** - 识别图片中的文字并自动翻译成中文

## 使用前提

需要确保已经安装并激活 MN Utils 插件，并在其中配置好 API Key。

## 使用步骤

### 1. 确保 MN Utils 已配置

使用前请确保：
- 已安装 MN Utils 插件
- 在 MN Utils 的 Subscription Manager 中填写了 API Key
- MN Utils 已激活

### 2. 使用 OCR 翻译功能

1. 选择一个卡片
2. 确保当前有可识别的图片（文档中的图片或卡片中的图片）
3. 点击 "🌐 OCR 识别并翻译为标题"
4. 选择 OCR 识别源
5. OCR 完成后，会询问是否翻译
6. 如果选择翻译，会让您选择翻译模型
7. 等待翻译完成
8. 翻译结果将自动设置为卡片标题

### 3. 支持的 OCR 源

- Doc2X - 专业文档识别
- SimpleTex - 数学公式
- GPT-4o - OpenAI 视觉
- glm-4v - 智谱AI
- Claude 3.5/3.7 Sonnet
- Gemini 2.0 Flash
- Moonshot-v1

## 测试方法

1. **基础测试**：
   - 创建一个新卡片
   - 选择一段包含英文的文档区域
   - 使用 OCR 翻译功能
   - 选择翻译模型
   - 检查标题是否为翻译后的中文

2. **模型测试**：
   - 测试不同的 AI 模型翻译效果
   - 验证模型选择是否正确生效

3. **错误处理测试**：
   - MN Utils 未激活时的提示
   - 网络错误时的处理
   - OCR 失败时的降级处理

## 注意事项

1. 需要在 MN Utils 中配置有效的 API Key
2. 翻译会产生 API 调用费用，请注意使用频率
3. 如果翻译失败，将使用原始 OCR 结果
4. 支持多种 AI 模型，可根据需要选择

## 故障排除

- **"请先安装并激活 MN Utils"**：需要安装 MN Utils 插件
- **"请在 MN Utils 中配置 API Key"**：在 MN Utils 的 Subscription Manager 中填写 API Key
- **"翻译失败"**：检查网络连接和 API Key 是否有效
- **"OCR 识别失败"**：确保有可识别的图片，尝试其他 OCR 源

## 技术实现

- AI 调用函数位于：`xdyy_utils_extensions.js`
- OCR 翻译动作位于：`xdyy_custom_actions_registry.js`
- 菜单注册位于：`xdyy_menu_registry.js`