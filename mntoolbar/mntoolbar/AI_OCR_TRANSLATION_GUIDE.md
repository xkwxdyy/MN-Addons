# OCR AI 翻译功能使用指南

## 功能概述

本功能为 MN Toolbar 添加了 OCR 识别后自动翻译的能力，可以将识别的外文内容自动翻译成中文并设置为卡片标题。

## 新增功能

1. **OCR 识别并翻译为标题** - 识别图片中的文字并自动翻译成中文
2. **批量 OCR 并翻译无标题子孙卡片** - 批量对无标题的子孙卡片进行 OCR 识别并翻译
3. **批量翻译子孙卡片** - 批量翻译选中卡片及其所有子孙卡片的内容

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

### 3. 批量 OCR 并翻译无标题子孙卡片

1. 选择一个父卡片（将处理它及其所有无标题的子孙卡片）
2. 点击 "🌐 批量 OCR 并翻译无标题子孙卡片"
3. 系统会显示找到的无标题卡片数量，确认操作
4. 使用当前配置的 OCR 源和翻译模型自动处理
5. 等待批量处理完成
6. 系统会显示成功和失败的数量

**注意**：此功能使用已配置的 OCR 源和翻译模型，如需更改请先使用菜单中的设置选项。

### 4. 批量翻译子孙卡片

1. 选择一个父卡片（将会翻译它及其所有子孙卡片）
2. 点击 "🌐 批量翻译子孙卡片"
3. 选择翻译方式：
   - 仅翻译标题
   - 仅翻译摘录
   - 翻译标题和摘录
   - 添加翻译到评论
4. 选择翻译模型
5. 等待批量翻译完成
6. 系统会显示成功和失败的数量

### 5. 支持的 OCR 源

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
- 翻译提示词配置：`toolbarUtils.translationConfig`

## 自定义翻译提示词

可以通过修改 `xdyy_utils_extensions.js` 中的 `toolbarUtils.translationConfig` 来自定义翻译提示词：

```javascript
toolbarUtils.translationConfig = {
  // 基础翻译提示词
  basicPrompt: "Translate the following text to {targetLang}. Only provide the translation without any explanation or additional text.",
  
  // 学术翻译提示词（用于批量翻译）
  academicPrompt: "You are a professional academic translator. Translate the following academic text to {targetLang}. Maintain academic terminology and style. Only provide the translation without any explanation."
}
```