// LaunchBar Action for MNTaskBoard
// 快速启动 MN 任务看板

const BOARD_DIR = '/Users/xiakangwei/Nutstore/Github/repository/MN-Addon/MNAddon-develop/mntask/MNTaskBoard';
const PORT = 3000;

function run(argument) {
    // 检查是否已经在运行
    const checkResult = LaunchBar.execute('/bin/bash', '-c', `lsof -Pi :${PORT} -sTCP:LISTEN -t`);
    
    if (checkResult && checkResult.trim().length > 0) {
        // 已经在运行，直接打开浏览器
        let url = `http://localhost:${PORT}`;
        
        if (argument) {
            switch (argument.toLowerCase()) {
                case 'focus':
                case '焦点':
                    url += '?view=focus';
                    LaunchBar.displayNotification({
                        title: 'MNTaskBoard',
                        string: '🎯 已打开焦点视图'
                    });
                    break;
                case 'kanban':
                case '看板':
                    url += '?view=kanban';
                    LaunchBar.displayNotification({
                        title: 'MNTaskBoard',
                        string: '📋 已打开看板视图'
                    });
                    break;
                case 'perspective':
                case '透视':
                    url += '?view=perspective';
                    LaunchBar.displayNotification({
                        title: 'MNTaskBoard',
                        string: '👁️ 已打开透视视图'
                    });
                    break;
                default:
                    LaunchBar.displayNotification({
                        title: 'MNTaskBoard',
                        string: '📍 任务看板已在运行'
                    });
                    break;
            }
        } else {
            LaunchBar.displayNotification({
                title: 'MNTaskBoard',
                string: '📍 任务看板已在运行'
            });
        }
        
        LaunchBar.openURL(url);
        return;
    }
    
    // 服务器未运行，需要启动
    LaunchBar.displayNotification({
        title: 'MNTaskBoard',
        string: '🚀 正在启动任务看板...'
    });
    
    // 检查并安装依赖
    const nodeModulesCheck = LaunchBar.execute('/bin/bash', '-c', `cd "${BOARD_DIR}" && [ -d "node_modules" ] && echo "exists" || echo "missing"`);
    
    if (nodeModulesCheck && nodeModulesCheck.trim() === 'missing') {
        LaunchBar.displayNotification({
            title: 'MNTaskBoard',
            string: '📦 正在安装依赖...'
        });
        LaunchBar.execute('/bin/bash', '-c', `cd "${BOARD_DIR}" && pnpm install`);
    }
    
    // 启动开发服务器（后台运行）
    LaunchBar.execute('/bin/bash', '-c', `cd "${BOARD_DIR}" && pnpm dev > /dev/null 2>&1 &`);
    
    // 等待服务器启动
    LaunchBar.executeAppleScript(`
        delay 3
        display notification "✅ 任务看板已启动" with title "MNTaskBoard"
    `);
    
    // 构造 URL 并打开
    let url = `http://localhost:${PORT}`;
    
    if (argument) {
        switch (argument.toLowerCase()) {
            case 'focus':
            case '焦点':
                url += '?view=focus';
                break;
            case 'kanban':
            case '看板':
                url += '?view=kanban';
                break;
            case 'perspective':
            case '透视':
                url += '?view=perspective';
                break;
        }
    }
    
    LaunchBar.openURL(url);
    
    return [{
        title: '任务看板已启动',
        subtitle: `访问地址: ${url}`,
        icon: 'TaskTemplate'
    }];
}

function runWithItem(item) {
    if (item && item.title) {
        return run(item.title);
    }
    return run();
}