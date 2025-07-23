/**
 * App - 应用主入口
 * 
 * 功能职责:
 * - 初始化应用
 * - 管理生命周期
 * - 协调各模块
 * - 全局错误处理
 * - 性能监控
 */

class TaskBoardApp {
    constructor() {
        this.initialized = false;
        this.components = new Map();
        this.cleanupTasks = [];
        
        // 性能监控
        this.performanceObserver = null;
        this.metrics = {
            startTime: performance.now(),
            renderCount: 0,
            errorCount: 0
        };
    }

    /**
     * Initializes the application.
     */
    async init() {
        if (this.initialized) {
            console.warn('App already initialized');
            return;
        }
        
        try {
            console.log('🚀 Initializing Task Board App...');
            
            // 设置全局错误处理
            this.setupErrorHandling();
            
            // 设置性能监控
            this.setupPerformanceMonitoring();
            
            // 初始化状态管理器
            await this.initializeStateManager();
            
            // 初始化主题
            this.initializeTheme();
            
            // 渲染应用
            this.render();
            
            // 绑定全局事件
            this.bindGlobalEvents();
            
            // 标记初始化完成
            this.initialized = true;
            
            // 记录启动时间
            const loadTime = performance.now() - this.metrics.startTime;
            console.log(`✅ App initialized in ${loadTime.toFixed(2)}ms`);
            
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showErrorScreen(error);
        }
    }

    /**
     * Sets up global error handling.
     */
    setupErrorHandling() {
        // 捕获未处理的错误
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.metrics.errorCount++;
            
            // 显示错误提示
            this.showErrorNotification({
                message: event.error.message,
                stack: event.error.stack
            });
            
            // 阻止默认行为
            event.preventDefault();
        });
        
        // 捕获未处理的 Promise 拒绝
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.metrics.errorCount++;
            
            this.showErrorNotification({
                message: 'Unhandled promise rejection',
                details: event.reason
            });
            
            event.preventDefault();
        });
    }

    /**
     * Sets up performance monitoring.
     */
    setupPerformanceMonitoring() {
        if ('PerformanceObserver' in window) {
            // 监控长任务
            this.performanceObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 50) {
                        console.warn(`Long task detected: ${entry.duration.toFixed(2)}ms`);
                    }
                }
            });
            
            try {
                this.performanceObserver.observe({ entryTypes: ['longtask'] });
            } catch (e) {
                // 某些浏览器可能不支持 longtask
                console.log('Long task monitoring not supported');
            }
        }
        
        // 定期报告性能指标
        setInterval(() => {
            this.reportPerformanceMetrics();
        }, 30000);
    }

    /**
     * Initializes state manager with saved data.
     */
    async initializeStateManager() {
        // 加载保存的状态
        const savedState = TaskBoardUtils.storage.local.get('mntask-board-state');
        
        if (savedState) {
            console.log('Loading saved state...');
            
            // 恢复任务数据
            if (savedState.tasks) {
                StateManager.setState({
                    tasks: new Map(savedState.tasks)
                });
            }
            
            // 恢复视图状态
            if (savedState.view) {
                StateManager.setState({ view: savedState.view });
            }
            
            // 恢复筛选器
            if (savedState.filters) {
                StateManager.setState({ filters: savedState.filters });
            }
        }
        
        // 设置自动保存
        this.setupAutoSave();
    }

    /**
     * Sets up auto-save functionality.
     */
    setupAutoSave() {
        const saveState = TaskBoardUtils.fn.debounce(() => {
            const state = {
                tasks: Array.from(StateManager.getState('tasks').entries()),
                view: StateManager.getState('view'),
                filters: {
                    ...StateManager.getState('filters'),
                    statuses: Array.from(StateManager.getState('filters.statuses')),
                    types: Array.from(StateManager.getState('filters.types')),
                    priorities: Array.from(StateManager.getState('filters.priorities'))
                }
            };
            
            TaskBoardUtils.storage.local.set('mntask-board-state', state);
            console.log('State auto-saved');
        }, 5000);
        
        // 监听状态变化
        StateManager.subscribe('*', saveState);
        
        // 页面卸载时保存
        window.addEventListener('beforeunload', () => {
            saveState.flush();
        });
    }

    /**
     * Initializes theme based on user preference.
     */
    initializeTheme() {
        const savedTheme = localStorage.getItem('mntask-theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        StateManager.setState({ ui: { theme: savedTheme } });
    }

    /**
     * Renders the main application.
     */
    render() {
        const container = document.getElementById('app');
        if (!container) {
            throw new Error('App container not found');
        }
        
        // 创建应用布局
        const layout = h('div', { className: 'app-layout' },
            h('aside', { className: 'sidebar', id: 'sidebar' }),
            h('main', { className: 'main-content', id: 'main-content' }),
            h('div', { className: 'notifications', id: 'notifications' })
        );
        
        renderEngine.render(layout, container);
        
        // 渲染侧边栏
        this.renderSidebar();
        
        // 渲染主内容
        this.renderMainContent();
        
        this.metrics.renderCount++;
    }

    /**
     * Renders sidebar.
     */
    renderSidebar() {
        const sidebar = document.getElementById('sidebar');
        
        const sidebarComponent = h('div', { className: 'sidebar-content' },
            h('div', { className: 'logo' },
                h('img', { src: 'logo.png', alt: 'MNTask' }),
                h('h2', null, 'MNTask')
            ),
            h('nav', { className: 'nav-menu' },
                this.renderNavMenu()
            ),
            h('div', { className: 'sidebar-footer' },
                this.renderUserInfo(),
                this.renderSettings()
            )
        );
        
        renderEngine.render(sidebarComponent, sidebar);
    }

    /**
     * Renders navigation menu.
     */
    renderNavMenu() {
        const menuItems = [
            { id: 'dashboard', icon: '📊', label: '仪表盘' },
            { id: 'tasks', icon: '📋', label: '任务列表' },
            { id: 'timeline', icon: '📅', label: '时间轴' },
            { id: 'projects', icon: '📁', label: '项目' },
            { id: 'reports', icon: '📈', label: '报告' }
        ];
        
        return menuItems.map(item =>
            h('a', {
                className: 'nav-item',
                href: `#${item.id}`,
                onClick: (e) => {
                    e.preventDefault();
                    this.navigateTo(item.id);
                }
            },
                h('span', { className: 'nav-icon' }, item.icon),
                h('span', { className: 'nav-label' }, item.label)
            )
        );
    }

    /**
     * Renders main content area.
     */
    renderMainContent() {
        const mainContent = document.getElementById('main-content');
        
        // 创建任务看板实例
        const taskBoard = new TaskBoard({});
        this.components.set('taskBoard', taskBoard);
        
        // 渲染任务看板
        renderEngine.render(taskBoard.render(), mainContent);
    }

    /**
     * Binds global events.
     */
    bindGlobalEvents() {
        // 键盘快捷键
        document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));
        
        // 窗口大小改变
        window.addEventListener('resize', TaskBoardUtils.fn.debounce(() => {
            this.handleResize();
        }, 250));
        
        // 在线/离线状态
        window.addEventListener('online', () => this.handleOnlineStatusChange(true));
        window.addEventListener('offline', () => this.handleOnlineStatusChange(false));
        
        // 可见性改变
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.handleAppPause();
            } else {
                this.handleAppResume();
            }
        });
        
        // 清理任务
        this.cleanupTasks.push(() => {
            document.removeEventListener('keydown', this.handleKeyboardShortcuts);
        });
    }

    /**
     * Handles keyboard shortcuts.
     */
    handleKeyboardShortcuts(e) {
        // Cmd/Ctrl + S: 保存
        if ((e.metaKey || e.ctrlKey) && e.key === 's') {
            e.preventDefault();
            this.saveCurrentState();
        }
        
        // Cmd/Ctrl + F: 搜索
        if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
            e.preventDefault();
            this.openSearch();
        }
        
        // Cmd/Ctrl + N: 新建任务
        if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
            e.preventDefault();
            this.createNewTask();
        }
        
        // Esc: 关闭模态框
        if (e.key === 'Escape') {
            this.closeAllModals();
        }
    }

    /**
     * Navigation handler.
     */
    navigateTo(route) {
        console.log(`Navigating to: ${route}`);
        
        // 更新URL
        window.location.hash = route;
        
        // 更新视图
        switch (route) {
            case 'dashboard':
                this.showDashboard();
                break;
            case 'tasks':
                this.showTasks();
                break;
            case 'timeline':
                this.showTimeline();
                break;
            case 'projects':
                this.showProjects();
                break;
            case 'reports':
                this.showReports();
                break;
            default:
                this.show404();
        }
    }

    /**
     * Shows error screen.
     */
    showErrorScreen(error) {
        const container = document.getElementById('app');
        
        const errorScreen = h('div', { className: 'error-screen' },
            h('div', { className: 'error-content' },
                h('h1', null, '😵 出错了'),
                h('p', null, error.message),
                h('pre', null, error.stack),
                h('button', {
                    onClick: () => window.location.reload()
                }, '重新加载')
            )
        );
        
        renderEngine.render(errorScreen, container);
    }

    /**
     * Shows error notification.
     */
    showErrorNotification(error) {
        const notifications = document.getElementById('notifications');
        
        const notification = TaskBoardUtils.dom.createElement('div', {
            className: 'notification error'
        }, [
            TaskBoardUtils.dom.createElement('div', { className: 'notification-header' }, [
                '❌ 错误'
            ]),
            TaskBoardUtils.dom.createElement('div', { className: 'notification-body' }, [
                error.message
            ]),
            TaskBoardUtils.dom.createElement('button', {
                className: 'notification-close',
                onClick: (e) => e.target.parentElement.remove()
            }, ['×'])
        ]);
        
        notifications.appendChild(notification);
        
        // 自动移除
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    /**
     * Reports performance metrics.
     */
    reportPerformanceMetrics() {
        const metrics = {
            ...this.metrics,
            memory: performance.memory ? {
                used: Math.round(performance.memory.usedJSHeapSize / 1048576),
                total: Math.round(performance.memory.totalJSHeapSize / 1048576),
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
            } : null,
            renderStats: window.RenderStats?.getStats(),
            stateSize: StateManager.getAllTasks().length,
            uptime: Math.round((performance.now() - this.metrics.startTime) / 1000)
        };
        
        console.log('📊 Performance Metrics:', metrics);
        
        // 检查内存使用
        if (metrics.memory && metrics.memory.used > metrics.memory.total * 0.9) {
            console.warn('⚠️ High memory usage detected');
            this.performCleanup();
        }
    }

    /**
     * Performs cleanup to free memory.
     */
    performCleanup() {
        // 清理渲染引擎缓存
        window.RenderStats?.clearRecyclePool();
        
        // 清理 DOM 查询缓存
        TaskBoardUtils.dom.query.cache?.clear();
        
        // 触发垃圾回收（如果可用）
        if (window.gc) {
            window.gc();
        }
        
        console.log('✅ Cleanup completed');
    }

    /**
     * Handles app pause.
     */
    handleAppPause() {
        console.log('App paused (tab hidden)');
        
        // 暂停非关键更新
        StateManager.setState({
            performance: { isUpdating: true }
        });
        
        // 保存当前状态
        this.saveCurrentState();
    }

    /**
     * Handles app resume.
     */
    handleAppResume() {
        console.log('App resumed (tab visible)');
        
        // 恢复更新
        StateManager.setState({
            performance: { isUpdating: false }
        });
        
        // 检查数据更新
        this.checkForUpdates();
    }

    /**
     * Handles online status change.
     */
    handleOnlineStatusChange(isOnline) {
        console.log(`Network status: ${isOnline ? 'online' : 'offline'}`);
        
        const notification = {
            message: isOnline ? '已连接到网络' : '网络连接已断开',
            type: isOnline ? 'success' : 'warning'
        };
        
        this.showNotification(notification);
    }

    /**
     * Shows notification.
     */
    showNotification({ message, type = 'info' }) {
        const notifications = document.getElementById('notifications');
        
        const notification = TaskBoardUtils.dom.createElement('div', {
            className: `notification ${type}`
        }, [message]);
        
        notifications.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    /**
     * Saves current state.
     */
    saveCurrentState() {
        const state = {
            tasks: Array.from(StateManager.getState('tasks').entries()),
            view: StateManager.getState('view'),
            filters: StateManager.getState('filters'),
            timestamp: Date.now()
        };
        
        TaskBoardUtils.storage.local.set('mntask-board-state', state);
        this.showNotification({ message: '已保存', type: 'success' });
    }

    /**
     * Destroys the application.
     */
    destroy() {
        console.log('Destroying app...');
        
        // 执行清理任务
        this.cleanupTasks.forEach(task => task());
        
        // 销毁组件
        this.components.forEach(component => {
            if (component.destroy) {
                component.destroy();
            }
        });
        
        // 停止性能监控
        if (this.performanceObserver) {
            this.performanceObserver.disconnect();
        }
        
        // 清理全局对象
        window.dragManager?.destroy();
        
        // 重置状态
        this.initialized = false;
        
        console.log('App destroyed');
    }
}

// 创建应用实例
const app = new TaskBoardApp();

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}

// 导出应用实例
window.taskBoardApp = app;