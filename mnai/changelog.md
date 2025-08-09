
复制图片后自动调用snipaste预览
更新mermaid版本并本地化
修复自动创建摘录的bug
新增源：PPIO
改进打开各源的开发平台逻辑
更新浮动窗口修改tools逻辑

为特定行为添加日志
自定义按钮增加stopOutput
自定义按钮支持触发Toolbar的动作
新增工具creatMermaidChart

恢复源KimiChat
修复部分场景提示On Sync的问题
优化自带OCR的体验
自定义按钮增加"回复"功能,用于在通知模式下快速给AI回复一条信息,提供多个预设
Action新增ToolbarActions,允许为prompt设置一个MN Toolbar的动作(需要订阅)

支持从url导入prompt
支持autoVision和autoOCR
OCR优化

优化深色模式下的链接颜色
修复不能取消toolbar动作的问题
新增通过markdown链接回答问题的支持

改进markdown链接回答问题的逻辑
大胡子模板变量增加currentDoc
自定义按钮增加一个进入编辑模式的功能
AI回答内容默认关闭编辑模式
增加了addnote和addcomment链接

killall "MarginNote 4" && sleep 1 && open "/Applications/MarginNote 4.app"

pgrep -x "MarginNote 4" > /dev/null && (killall "MarginNote 4" && sleep 1 && open "/Applications/MarginNote 4.app") || open "/Applications/MarginNote 4.app"

osascript -e 'tell application "MarginNote 4" to quit' && sleep 1 && open "/Applications/MarginNote 4.app" || (killall "MarginNote 4" && sleep 1 && open "/Applications/MarginNote 4.app")
