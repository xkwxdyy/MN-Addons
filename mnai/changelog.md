
复制图片后自动调用snipaste预览
更新mermaid版本并本地化
修复自动创建摘录的bug
新增源：PPIO
改进打开各源的开发平台逻辑
更新浮动窗口修改tools逻辑

killall "MarginNote 4" && sleep 1 && open "/Applications/MarginNote 4.app"

pgrep -x "MarginNote 4" > /dev/null && (killall "MarginNote 4" && sleep 1 && open "/Applications/MarginNote 4.app") || open "/Applications/MarginNote 4.app"

osascript -e 'tell application "MarginNote 4" to quit' && sleep 1 && open "/Applications/MarginNote 4.app" || (killall "MarginNote 4" && sleep 1 && open "/Applications/MarginNote 4.app")
