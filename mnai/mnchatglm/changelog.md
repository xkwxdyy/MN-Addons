

修复交互按钮渲染错误的问题
改进思考内容显示
改进报错显示问题
当输入框中内容为空时，点击发送按钮（或cmd+enter）直接显示上次发送内容
增加一个api测试按钮
聊天模式也支持新的编辑器


killall "MarginNote 4" && sleep 1 && open "/Applications/MarginNote 4.app"

pgrep -x "MarginNote 4" > /dev/null && (killall "MarginNote 4" && sleep 1 && open "/Applications/MarginNote 4.app") || open "/Applications/MarginNote 4.app"

osascript -e 'tell application "MarginNote 4" to quit' && sleep 1 && open "/Applications/MarginNote 4.app" || (killall "MarginNote 4" && sleep 1 && open "/Applications/MarginNote 4.app")
