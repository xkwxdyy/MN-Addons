

适配Gemini的思考参数，支持显示思考内容
修复第一个响应块不解析的问题
改进mermaid流程图渲染
改进模型刷新逻辑


增加配置备份功能，防止意外闪退导致的备份丢失，全自动，用户无需任何操作

修复函数调用的一些问题
文本内容提取增加本地缓存
支持通过doc的content变量获取文档全文内容，暂不支持按页获取内容

优化变量检测逻辑，减少资源消耗

编辑器改进，支持简单的markdown渲染
支持键盘弹出时自动上抬窗口
支持快捷键：

Cmd + Enter 发送
Cmd + B - Bold
Cmd + I - Italic
Cmd + K - Insert link
Cmd + Shift + 7 - Numbered list
Cmd + Shift + 8 - Bullet list

新编辑器不允许放大
新编辑器修改背景颜色
改进函数调用的显示

优化按钮渲染逻辑，引进渲染缓存以减少多余的渲染
支持复制/粘贴 用户/系统指令
尝试实现按钮的公式渲染

修复文档内容提取的问题
当PDF.js无法提取文本时，会尝试使用Moonshot方案
修复updatChat的报错

killall "MarginNote 4" && sleep 1 && open "/Applications/MarginNote 4.app"

pgrep -x "MarginNote 4" > /dev/null && (killall "MarginNote 4" && sleep 1 && open "/Applications/MarginNote 4.app") || open "/Applications/MarginNote 4.app"

osascript -e 'tell application "MarginNote 4" to quit' && sleep 1 && open "/Applications/MarginNote 4.app" || (killall "MarginNote 4" && sleep 1 && open "/Applications/MarginNote 4.app")
