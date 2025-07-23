/**
 * Task Board Component - 任务看板核心组件
 * 
 * 功能特性:
 * - 基于虚拟DOM的高性能渲染
 * - 统一状态管理
 * - 拖拽排序支持
 * - 响应式视图
 * - 生命周期管理
 */

class TaskBoard extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            loading: true,
            error: null,
            selectedView: 'overview',
            expandedTasks: new Set(),
            editingTaskId: null
        };
        
        // 组件引用
        this.containerRef = { current: null };
        this.timelineRef = { current: null };
        
        // 订阅状态更新
        this.unsubscribers = [];
        
        // 防抖/节流函数
        this.handleSearch = TaskBoardUtils.fn.debounce(this.handleSearch.bind(this), 300);
        this.handleScroll = TaskBoardUtils.fn.throttle(this.handleScroll.bind(this), 100);
    }

    componentDidMount() {
        // 订阅状态管理器
        this.subscribeToState();
        
        // 初始化拖拽
        this.initializeDrag();
        
        // 加载数据
        this.loadTasks();
        
        // 绑定全局事件
        this.bindEvents();
    }

    componentWillUnmount() {
        // 取消订阅
        this.unsubscribers.forEach(unsub => unsub());
        
        // 清理拖拽
        this.cleanupDrag();
        
        // 解绑事件
        this.unbindEvents();
    }

    /**
     * Subscribes to state manager.
     */
    subscribeToState() {
        // 订阅任务数据变化
        this.unsubscribers.push(
            StateManager.subscribe('tasks', () => {
                this.forceUpdate();
            })
        );
        
        // 订阅筛选器变化
        this.unsubscribers.push(
            StateManager.subscribe('filters', () => {
                this.forceUpdate();
            })
        );
        
        // 订阅视图变化
        this.unsubscribers.push(
            StateManager.subscribe('view', (view) => {
                this.setState({ selectedView: view.currentView });
            })
        );
    }

    /**
     * Initializes drag functionality.
     */
    initializeDrag() {
        // 稍后在渲染后初始化
        setTimeout(() => {
            this.registerDraggables();
            this.registerDropZones();
        }, 100);
    }

    /**
     * Registers draggable elements.
     */
    registerDraggables() {
        const taskCards = document.querySelectorAll('.task-card');
        
        taskCards.forEach(card => {
            dragManager.registerDraggable(card, {
                data: { taskId: card.dataset.taskId },
                handle: '.drag-handle',
                helper: 'clone',
                onStart: this.handleDragStart.bind(this),
                onEnd: this.handleDragEnd.bind(this)
            });
        });
    }

    /**
     * Registers drop zones.
     */
    registerDropZones() {
        // 时间轴时段
        const timeSlots = document.querySelectorAll('.time-slot');
        timeSlots.forEach(slot => {
            dragManager.registerDropZone(slot, {
                accept: '.task-card',
                hoverClass: 'drop-hover',
                onDrop: this.handleTimeSlotDrop.bind(this)
            });
        });
        
        // 项目容器
        const projectContainers = document.querySelectorAll('.project-tasks');
        projectContainers.forEach(container => {
            dragManager.registerDropZone(container, {
                accept: (data) => data.taskType === '动作',
                hoverClass: 'drop-hover',
                onDrop: this.handleProjectDrop.bind(this)
            });
        });
        
        // 状态列
        const statusColumns = document.querySelectorAll('.status-column');
        statusColumns.forEach(column => {
            dragManager.registerDropZone(column, {
                accept: '.task-card',
                hoverClass: 'drop-hover',
                onDrop: this.handleStatusDrop.bind(this)
            });
        });
    }

    /**
     * Loads tasks from data source.
     */
    async loadTasks() {
        try {
            this.setState({ loading: true, error: null });
            
            // 从测试数据加载
            if (window.testData) {
                const tasks = new Map();
                window.testData.forEach(task => {
                    tasks.set(task.id, task);
                });
                
                StateManager.setState({ tasks });
            }
            
            this.setState({ loading: false });
        } catch (error) {
            console.error('Failed to load tasks:', error);
            this.setState({ loading: false, error: error.message });
        }
    }

    /**
     * Renders the component.
     */
    render() {
        const { loading, error, selectedView } = this.state;
        
        if (loading) {
            return h('div', { className: 'loading-container' },
                h('div', { className: 'spinner' }),
                h('p', null, '加载中...')
            );
        }
        
        if (error) {
            return h('div', { className: 'error-container' },
                h('p', { className: 'error-message' }, error),
                h('button', { onClick: () => this.loadTasks() }, '重试')
            );
        }
        
        return h('div', { className: 'task-board', ref: this.containerRef },
            this.renderHeader(),
            this.renderFilters(),
            this.renderContent(),
            this.renderModals()
        );
    }

    /**
     * Renders header section.
     */
    renderHeader() {
        const stats = this.getTaskStats();
        
        return h('header', { className: 'board-header' },
            h('div', { className: 'header-left' },
                h('h1', null, 'MNTask 任务看板'),
                h('div', { className: 'stats' },
                    h('span', null, `总任务: ${stats.total}`),
                    h('span', null, `进行中: ${stats.inProgress}`),
                    h('span', null, `已完成: ${stats.completed}`)
                )
            ),
            h('div', { className: 'header-right' },
                this.renderViewSwitcher(),
                this.renderActions()
            )
        );
    }

    /**
     * Renders view switcher.
     */
    renderViewSwitcher() {
        const views = [
            { id: 'overview', name: '总览', icon: '📊' },
            { id: 'timeline', name: '时间轴', icon: '📅' },
            { id: 'kanban', name: '看板', icon: '📋' },
            { id: 'tree', name: '树形', icon: '🌳' }
        ];
        
        return h('div', { className: 'view-switcher' },
            views.map(view => 
                h('button', {
                    className: `view-btn ${this.state.selectedView === view.id ? 'active' : ''}`,
                    onClick: () => this.switchView(view.id)
                },
                    h('span', { className: 'icon' }, view.icon),
                    h('span', null, view.name)
                )
            )
        );
    }

    /**
     * Renders filter panel.
     */
    renderFilters() {
        const filters = StateManager.getState('filters');
        const isOpen = StateManager.getState('ui.isFilterPanelOpen');
        
        if (!isOpen) return null;
        
        return h('div', { className: 'filter-panel' },
            h('div', { className: 'filter-section' },
                h('h3', null, '状态筛选'),
                this.renderCheckboxGroup('statuses', ['未开始', '进行中', '已完成'])
            ),
            h('div', { className: 'filter-section' },
                h('h3', null, '类型筛选'),
                this.renderCheckboxGroup('types', ['目标', '关键结果', '项目', '动作'])
            ),
            h('div', { className: 'filter-section' },
                h('h3', null, '优先级筛选'),
                this.renderCheckboxGroup('priorities', ['高', '中', '低'])
            ),
            h('div', { className: 'filter-section' },
                h('label', null,
                    h('input', {
                        type: 'checkbox',
                        checked: filters.hideCompletedActions,
                        onChange: (e) => this.updateFilter('hideCompletedActions', e.target.checked)
                    }),
                    ' 隐藏已完成的动作'
                )
            ),
            h('div', { className: 'filter-actions' },
                h('button', { onClick: () => this.resetFilters() }, '重置'),
                h('button', { onClick: () => this.toggleFilterPanel() }, '关闭')
            )
        );
    }

    /**
     * Renders main content based on view.
     */
    renderContent() {
        const { selectedView } = this.state;
        
        switch (selectedView) {
            case 'overview':
                return this.renderOverviewView();
            case 'timeline':
                return this.renderTimelineView();
            case 'kanban':
                return this.renderKanbanView();
            case 'tree':
                return this.renderTreeView();
            default:
                return null;
        }
    }

    /**
     * Renders overview view.
     */
    renderOverviewView() {
        const tasks = StateManager.getFilteredTasks();
        const grouped = TaskBoardUtils.data.groupBy(tasks, 'type');
        
        return h('div', { className: 'overview-view' },
            Object.entries(grouped).map(([type, typeTasks]) =>
                h('section', { className: 'type-section' },
                    h('h2', null, `${this.getTypeIcon(type)} ${type} (${typeTasks.length})`),
                    h('div', { className: 'task-grid' },
                        typeTasks.map(task => this.renderTaskCard(task))
                    )
                )
            )
        );
    }

    /**
     * Renders timeline view.
     */
    renderTimelineView() {
        const tasks = StateManager.getFilteredTasks();
        const timeRange = StateManager.getState('view.timeRange');
        const dateRange = TaskBoardUtils.date.getRange(timeRange);
        
        // 生成时间段
        const timeSlots = this.generateTimeSlots(dateRange.start, dateRange.end);
        
        return h('div', { className: 'timeline-view', ref: this.timelineRef },
            h('div', { className: 'timeline-header' },
                this.renderTimeRangeSelector(),
                this.renderDateNavigator()
            ),
            h('div', { className: 'timeline-content' },
                h('div', { className: 'timeline-grid' },
                    timeSlots.map(slot => this.renderTimeSlot(slot, tasks))
                )
            )
        );
    }

    /**
     * Renders kanban view.
     */
    renderKanbanView() {
        const tasks = StateManager.getFilteredTasks();
        const columns = ['未开始', '进行中', '已完成'];
        
        return h('div', { className: 'kanban-view' },
            h('div', { className: 'kanban-board' },
                columns.map(status => {
                    const columnTasks = tasks.filter(task => task.status === status);
                    
                    return h('div', { className: 'kanban-column', 'data-status': status },
                        h('div', { className: 'column-header' },
                            h('h3', null, status),
                            h('span', { className: 'task-count' }, columnTasks.length)
                        ),
                        h('div', { className: 'column-content status-column' },
                            columnTasks.map(task => this.renderTaskCard(task))
                        )
                    );
                })
            )
        );
    }

    /**
     * Renders tree view.
     */
    renderTreeView() {
        const tasks = StateManager.getFilteredTasks();
        const tree = this.buildTaskTree(tasks);
        
        return h('div', { className: 'tree-view' },
            h('div', { className: 'tree-container' },
                tree.map(node => this.renderTreeNode(node))
            )
        );
    }

    /**
     * Renders task card.
     */
    renderTaskCard(task) {
        const isExpanded = this.state.expandedTasks.has(task.id);
        const isEditing = this.state.editingTaskId === task.id;
        
        return h('div', {
            className: `task-card ${task.type} ${task.status}`,
            'data-task-id': task.id,
            'data-task-type': task.type
        },
            h('div', { className: 'task-header' },
                h('span', { className: 'drag-handle' }, '⋮⋮'),
                h('span', { className: 'task-type' }, this.getTypeIcon(task.type)),
                h('span', { className: 'task-title' }, task.title),
                h('div', { className: 'task-actions' },
                    h('button', {
                        className: 'expand-btn',
                        onClick: () => this.toggleTaskExpand(task.id)
                    }, isExpanded ? '−' : '+'),
                    h('button', {
                        className: 'edit-btn',
                        onClick: () => this.editTask(task.id)
                    }, '✏️')
                )
            ),
            isExpanded && h('div', { className: 'task-details' },
                task.description && h('p', { className: 'description' }, task.description),
                task.priority && h('div', { className: 'priority' },
                    h('span', { className: `priority-badge ${task.priority}` }, task.priority)
                ),
                task.dueDate && h('div', { className: 'due-date' },
                    '📅 ', TaskBoardUtils.date.format(task.dueDate, 'MM-DD')
                ),
                task.progress !== undefined && h('div', { className: 'progress' },
                    h('div', { className: 'progress-bar' },
                        h('div', {
                            className: 'progress-fill',
                            style: { width: `${task.progress}%` }
                        })
                    ),
                    h('span', { className: 'progress-text' }, `${task.progress}%`)
                )
            ),
            isEditing && this.renderTaskEditor(task)
        );
    }

    /**
     * Renders task editor.
     */
    renderTaskEditor(task) {
        return h('div', { className: 'task-editor' },
            h('input', {
                type: 'text',
                value: task.title,
                onChange: (e) => this.updateTaskField(task.id, 'title', e.target.value)
            }),
            h('textarea', {
                value: task.description || '',
                onChange: (e) => this.updateTaskField(task.id, 'description', e.target.value)
            }),
            h('div', { className: 'editor-actions' },
                h('button', {
                    onClick: () => this.saveTask(task.id)
                }, '保存'),
                h('button', {
                    onClick: () => this.cancelEdit()
                }, '取消')
            )
        );
    }

    /**
     * Event handlers
     */
    
    handleDragStart({ element, data }) {
        StateManager.setState({
            drag: {
                isDragging: true,
                draggedTaskId: data.taskId,
                draggedFrom: element.parentNode
            }
        });
    }

    handleDragEnd({ dropped }) {
        StateManager.setState({
            drag: {
                isDragging: false,
                draggedTaskId: null,
                draggedFrom: null
            }
        });
        
        if (dropped) {
            this.saveToLocalStorage();
        }
    }

    handleTimeSlotDrop({ data, zone }) {
        const taskId = data.taskId;
        const slotDate = zone.dataset.date;
        
        StateManager.updateTask(taskId, {
            scheduledDate: new Date(slotDate)
        });
        
        return true;
    }

    handleProjectDrop({ data, zone }) {
        const taskId = data.taskId;
        const projectId = zone.dataset.projectId;
        
        StateManager.updateTask(taskId, {
            parentId: projectId
        });
        
        return true;
    }

    handleStatusDrop({ data, zone }) {
        const taskId = data.taskId;
        const status = zone.dataset.status;
        
        StateManager.updateTask(taskId, {
            status: status
        });
        
        return true;
    }

    /**
     * Utility methods
     */
    
    getTaskStats() {
        const tasks = StateManager.getAllTasks();
        
        return {
            total: tasks.length,
            inProgress: tasks.filter(t => t.status === '进行中').length,
            completed: tasks.filter(t => t.status === '已完成').length
        };
    }

    getTypeIcon(type) {
        const icons = {
            '目标': '🎯',
            '关键结果': '🔑',
            '项目': '📁',
            '动作': '✅'
        };
        return icons[type] || '📌';
    }

    buildTaskTree(tasks) {
        const taskMap = new Map(tasks.map(t => [t.id, { ...t, children: [] }]));
        const roots = [];
        
        taskMap.forEach(task => {
            if (task.parentId && taskMap.has(task.parentId)) {
                taskMap.get(task.parentId).children.push(task);
            } else {
                roots.push(task);
            }
        });
        
        return roots;
    }

    renderTreeNode(node, level = 0) {
        const isExpanded = this.state.expandedTasks.has(node.id);
        
        return h('div', { className: 'tree-node' },
            h('div', {
                className: 'node-content',
                style: { paddingLeft: `${level * 20}px` }
            },
                node.children.length > 0 && h('button', {
                    className: 'tree-toggle',
                    onClick: () => this.toggleTaskExpand(node.id)
                }, isExpanded ? '▼' : '▶'),
                this.renderTaskCard(node)
            ),
            isExpanded && node.children.length > 0 && h('div', { className: 'node-children' },
                node.children.map(child => this.renderTreeNode(child, level + 1))
            )
        );
    }

    toggleTaskExpand(taskId) {
        const expanded = new Set(this.state.expandedTasks);
        if (expanded.has(taskId)) {
            expanded.delete(taskId);
        } else {
            expanded.add(taskId);
        }
        this.setState({ expandedTasks: expanded });
    }

    saveToLocalStorage() {
        TaskBoardUtils.storage.local.set('mntask-board-state', {
            tasks: Array.from(StateManager.getState('tasks').entries()),
            view: StateManager.getState('view'),
            filters: StateManager.getState('filters')
        });
    }
}

// 注册组件
window.TaskBoard = TaskBoard;