/**
 * State Manager - 统一状态管理系统
 * 
 * 功能特性:
 * - 集中式状态存储
 * - 发布-订阅模式
 * - 状态持久化
 * - 撤销/重做支持
 * - 状态验证和中间件
 */

class StateManager {
    constructor() {
        this.state = this.createInitialState();
        this.subscribers = new Map();
        this.middleware = [];
        this.history = [];
        this.historyIndex = -1;
        this.maxHistorySize = 50;
        this.localStorage = window.localStorage;
        this.localStorageKey = 'mntask-state';
        this.saveDebounceTimer = null;
        
        this.initializeState();
    }

    /**
     * Creates the initial state structure.
     */
    createInitialState() {
        return {
            // 任务数据
            tasks: new Map(),
            
            // 视图状态
            view: {
                currentView: 'overview',
                expandedNodes: new Set(),
                selectedTaskId: null,
                timeRange: 'week',
                dateRange: {
                    start: null,
                    end: null
                }
            },
            
            // 筛选状态
            filters: {
                statuses: new Set(['未开始', '进行中']),
                types: new Set(['目标', '关键结果', '项目', '动作']),
                priorities: new Set(['高', '中', '低']),
                hideCompletedActions: true,
                searchTerm: ''
            },
            
            // 拖拽状态
            drag: {
                isDragging: false,
                draggedTaskId: null,
                draggedOverTaskId: null,
                draggedFrom: null,
                draggedTo: null
            },
            
            // UI状态
            ui: {
                isSidebarOpen: true,
                isFilterPanelOpen: false,
                isModalOpen: false,
                modalType: null,
                modalData: null,
                theme: 'dark'
            },
            
            // 性能优化标记
            performance: {
                lastUpdate: Date.now(),
                pendingUpdates: new Set(),
                isUpdating: false
            }
        };
    }

    /**
     * Initializes state from localStorage or creates new state.
     */
    initializeState() {
        try {
            const savedState = this.localStorage.getItem(this.localStorageKey);
            if (savedState) {
                const parsed = JSON.parse(savedState);
                this.mergeState(parsed);
            }
        } catch (error) {
            console.error('Failed to load state from localStorage:', error);
        }
        
        this.saveToHistory();
    }

    /**
     * Merges saved state with current state structure.
     */
    mergeState(savedState) {
        // 恢复Map结构
        if (savedState.tasks && Array.isArray(savedState.tasks)) {
            this.state.tasks = new Map(savedState.tasks);
        }
        
        // 恢复Set结构
        if (savedState.view?.expandedNodes) {
            this.state.view.expandedNodes = new Set(savedState.view.expandedNodes);
        }
        if (savedState.filters) {
            for (const key of ['statuses', 'types', 'priorities']) {
                if (savedState.filters[key]) {
                    this.state.filters[key] = new Set(savedState.filters[key]);
                }
            }
        }
        
        // 合并其他状态
        Object.assign(this.state.view, savedState.view || {});
        Object.assign(this.state.ui, savedState.ui || {});
    }

    /**
     * Gets the current state or a specific path.
     */
    getState(path = null) {
        if (!path) return this.state;
        
        const keys = path.split('.');
        let result = this.state;
        
        for (const key of keys) {
            if (result && typeof result === 'object' && key in result) {
                result = result[key];
            } else {
                return undefined;
            }
        }
        
        return result;
    }

    /**
     * Updates state with validation and notification.
     */
    setState(updates, options = {}) {
        const { silent = false, skipHistory = false } = options;
        
        // 运行中间件
        const processedUpdates = this.runMiddleware(updates);
        
        // 应用更新
        this.applyUpdates(processedUpdates);
        
        // 保存历史
        if (!skipHistory) {
            this.saveToHistory();
        }
        
        // 通知订阅者
        if (!silent) {
            this.notifySubscribers(processedUpdates);
        }
        
        // 异步保存到localStorage
        this.debouncedSave();
    }

    /**
     * Applies updates to state recursively.
     */
    applyUpdates(updates, target = this.state) {
        for (const [key, value] of Object.entries(updates)) {
            if (value && typeof value === 'object' && !Array.isArray(value) && 
                !(value instanceof Map) && !(value instanceof Set)) {
                // 递归更新嵌套对象
                if (!target[key]) target[key] = {};
                this.applyUpdates(value, target[key]);
            } else {
                // 直接赋值
                target[key] = value;
            }
        }
    }

    /**
     * Subscribes to state changes.
     */
    subscribe(path, callback) {
        if (!this.subscribers.has(path)) {
            this.subscribers.set(path, new Set());
        }
        this.subscribers.get(path).add(callback);
        
        // 返回取消订阅函数
        return () => {
            const callbacks = this.subscribers.get(path);
            if (callbacks) {
                callbacks.delete(callback);
                if (callbacks.size === 0) {
                    this.subscribers.delete(path);
                }
            }
        };
    }

    /**
     * Notifies subscribers of state changes.
     */
    notifySubscribers(updates) {
        const notified = new Set();
        
        // 通知具体路径的订阅者
        const checkPath = (obj, currentPath = '') => {
            for (const [key, value] of Object.entries(obj)) {
                const path = currentPath ? `${currentPath}.${key}` : key;
                
                // 通知当前路径的订阅者
                if (this.subscribers.has(path) && !notified.has(path)) {
                    notified.add(path);
                    const callbacks = this.subscribers.get(path);
                    callbacks.forEach(callback => {
                        try {
                            callback(this.getState(path), path);
                        } catch (error) {
                            console.error(`Subscriber error for path ${path}:`, error);
                        }
                    });
                }
                
                // 递归处理嵌套对象
                if (value && typeof value === 'object') {
                    checkPath(value, path);
                }
            }
        };
        
        checkPath(updates);
        
        // 通知全局订阅者
        if (this.subscribers.has('*')) {
            this.subscribers.get('*').forEach(callback => {
                try {
                    callback(this.state, updates);
                } catch (error) {
                    console.error('Global subscriber error:', error);
                }
            });
        }
    }

    /**
     * Adds middleware for state updates.
     */
    use(middleware) {
        this.middleware.push(middleware);
    }

    /**
     * Runs middleware chain.
     */
    runMiddleware(updates) {
        return this.middleware.reduce((acc, fn) => {
            try {
                return fn(acc, this.state) || acc;
            } catch (error) {
                console.error('Middleware error:', error);
                return acc;
            }
        }, updates);
    }

    /**
     * Saves current state to history.
     */
    saveToHistory() {
        // 序列化当前状态
        const snapshot = this.serializeState();
        
        // 如果不在历史末尾，删除后续历史
        if (this.historyIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyIndex + 1);
        }
        
        // 添加新历史
        this.history.push(snapshot);
        this.historyIndex++;
        
        // 限制历史大小
        if (this.history.length > this.maxHistorySize) {
            this.history.shift();
            this.historyIndex--;
        }
    }

    /**
     * Undoes the last state change.
     */
    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            const snapshot = this.history[this.historyIndex];
            this.restoreState(snapshot);
            return true;
        }
        return false;
    }

    /**
     * Redoes the next state change.
     */
    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            const snapshot = this.history[this.historyIndex];
            this.restoreState(snapshot);
            return true;
        }
        return false;
    }

    /**
     * Serializes state for storage.
     */
    serializeState() {
        return JSON.stringify({
            tasks: Array.from(this.state.tasks.entries()),
            view: {
                ...this.state.view,
                expandedNodes: Array.from(this.state.view.expandedNodes)
            },
            filters: {
                ...this.state.filters,
                statuses: Array.from(this.state.filters.statuses),
                types: Array.from(this.state.filters.types),
                priorities: Array.from(this.state.filters.priorities)
            },
            ui: this.state.ui
        });
    }

    /**
     * Restores state from snapshot.
     */
    restoreState(snapshot) {
        try {
            const parsed = JSON.parse(snapshot);
            this.state = this.createInitialState();
            this.mergeState(parsed);
            this.notifySubscribers(this.state);
        } catch (error) {
            console.error('Failed to restore state:', error);
        }
    }

    /**
     * Debounced save to localStorage.
     */
    debouncedSave() {
        clearTimeout(this.saveDebounceTimer);
        this.saveDebounceTimer = setTimeout(() => {
            this.saveToLocalStorage();
        }, 1000);
    }

    /**
     * Saves state to localStorage.
     */
    saveToLocalStorage() {
        try {
            const serialized = this.serializeState();
            this.localStorage.setItem(this.localStorageKey, serialized);
        } catch (error) {
            console.error('Failed to save state to localStorage:', error);
        }
    }

    /**
     * Clears all state and history.
     */
    reset() {
        this.state = this.createInitialState();
        this.history = [];
        this.historyIndex = -1;
        this.localStorage.removeItem(this.localStorageKey);
        this.notifySubscribers(this.state);
        this.saveToHistory();
    }

    /**
     * Task-specific state methods
     */
    
    addTask(task) {
        this.setState({
            tasks: new Map(this.state.tasks).set(task.id, task)
        });
    }

    updateTask(taskId, updates) {
        const task = this.state.tasks.get(taskId);
        if (task) {
            const updatedTask = { ...task, ...updates };
            this.setState({
                tasks: new Map(this.state.tasks).set(taskId, updatedTask)
            });
        }
    }

    deleteTask(taskId) {
        const tasks = new Map(this.state.tasks);
        tasks.delete(taskId);
        this.setState({ tasks });
    }

    getTask(taskId) {
        return this.state.tasks.get(taskId);
    }

    getAllTasks() {
        return Array.from(this.state.tasks.values());
    }

    getFilteredTasks() {
        const tasks = this.getAllTasks();
        const { statuses, types, priorities, hideCompletedActions, searchTerm } = this.state.filters;
        
        return tasks.filter(task => {
            // 特殊规则：隐藏已完成的动作
            if (hideCompletedActions && task.type === '动作' && task.status === '已完成') {
                return false;
            }
            
            // 状态筛选
            if (!statuses.has(task.status)) return false;
            
            // 类型筛选
            if (!types.has(task.type)) return false;
            
            // 优先级筛选
            if (!priorities.has(task.priority || '低')) return false;
            
            // 搜索筛选
            if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase())) {
                return false;
            }
            
            return true;
        });
    }

    /**
     * Performance optimization methods
     */
    
    batchUpdate(updateFn) {
        this.state.performance.isUpdating = true;
        const updates = updateFn(this.state);
        this.setState(updates, { silent: true });
        this.state.performance.isUpdating = false;
        this.notifySubscribers(updates);
    }

    requestUpdate(component, updateFn) {
        this.state.performance.pendingUpdates.add(component);
        
        if (!this.state.performance.isUpdating) {
            requestAnimationFrame(() => {
                this.processPendingUpdates();
            });
        }
    }

    processPendingUpdates() {
        const pendingUpdates = new Set(this.state.performance.pendingUpdates);
        this.state.performance.pendingUpdates.clear();
        
        pendingUpdates.forEach(component => {
            try {
                component.update();
            } catch (error) {
                console.error('Update error for component:', error);
            }
        });
        
        this.state.performance.lastUpdate = Date.now();
    }
}

// 创建单例实例
const stateManager = new StateManager();

// 添加常用中间件

// 日志中间件
stateManager.use((updates, state) => {
    if (window.DEBUG_MODE) {
        console.log('[StateManager] Updates:', updates);
        console.log('[StateManager] New State:', state);
    }
    return updates;
});

// 验证中间件
stateManager.use((updates, state) => {
    // 验证任务数据
    if (updates.tasks) {
        updates.tasks.forEach((task, id) => {
            if (!task.id || !task.title || !task.type) {
                console.error('Invalid task data:', task);
                throw new Error('Task must have id, title, and type');
            }
        });
    }
    
    return updates;
});

// 导出单例
window.StateManager = stateManager;