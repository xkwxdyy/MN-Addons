/**
 * Drag Manager - 统一拖拽管理系统
 * 
 * 功能特性:
 * - 统一的拖拽接口
 * - 拖拽状态管理
 * - 视觉反馈
 * - 拖拽数据传输
 * - 性能优化
 * - 内存泄漏防护
 */

class DragManager {
    constructor() {
        this.dragState = {
            isDragging: false,
            draggedElement: null,
            draggedData: null,
            draggedFrom: null,
            dropTarget: null,
            ghostElement: null,
            placeholder: null,
            offset: { x: 0, y: 0 },
            startPosition: { x: 0, y: 0 }
        };
        
        this.zones = new Map();
        this.listeners = new Map();
        this.config = {
            dragThreshold: 5,
            scrollSpeed: 10,
            scrollBoundary: 50,
            ghostOpacity: 0.8,
            animationDuration: 200
        };
        
        this.scrollInterval = null;
        this.rafId = null;
        
        this.init();
    }

    /**
     * Initializes global event listeners.
     */
    init() {
        // 使用捕获阶段处理事件，提高响应速度
        document.addEventListener('mousedown', this.handleMouseDown.bind(this), true);
        document.addEventListener('mousemove', this.handleMouseMove.bind(this), true);
        document.addEventListener('mouseup', this.handleMouseUp.bind(this), true);
        
        // 触摸事件支持
        document.addEventListener('touchstart', this.handleTouchStart.bind(this), true);
        document.addEventListener('touchmove', this.handleTouchMove.bind(this), true);
        document.addEventListener('touchend', this.handleTouchEnd.bind(this), true);
        
        // 键盘事件
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        
        // 防止默认拖拽行为
        document.addEventListener('dragstart', (e) => e.preventDefault());
    }

    /**
     * Registers a draggable element.
     */
    registerDraggable(element, options = {}) {
        const config = {
            data: null,
            handle: null,
            axis: null, // 'x', 'y', or null for both
            containment: null,
            revert: false,
            helper: 'clone', // 'clone', 'original', or function
            onStart: null,
            onDrag: null,
            onEnd: null,
            ...options
        };
        
        element.setAttribute('data-draggable', 'true');
        this.listeners.set(element, config);
        
        // 设置拖拽手柄
        const handle = config.handle 
            ? element.querySelector(config.handle) 
            : element;
        
        if (handle) {
            handle.style.cursor = 'move';
        }
        
        return () => this.unregisterDraggable(element);
    }

    /**
     * Unregisters a draggable element.
     */
    unregisterDraggable(element) {
        element.removeAttribute('data-draggable');
        this.listeners.delete(element);
    }

    /**
     * Registers a drop zone.
     */
    registerDropZone(element, options = {}) {
        const config = {
            accept: null, // function or string selector
            hoverClass: 'drag-over',
            tolerance: 'intersect', // 'intersect', 'pointer', 'fit', 'touch'
            onEnter: null,
            onOver: null,
            onLeave: null,
            onDrop: null,
            ...options
        };
        
        element.setAttribute('data-dropzone', 'true');
        this.zones.set(element, config);
        
        return () => this.unregisterDropZone(element);
    }

    /**
     * Unregisters a drop zone.
     */
    unregisterDropZone(element) {
        element.removeAttribute('data-dropzone');
        this.zones.delete(element);
    }

    /**
     * Handles mouse down event.
     */
    handleMouseDown(e) {
        const draggable = this.findDraggable(e.target);
        if (!draggable) return;
        
        const config = this.listeners.get(draggable);
        if (!config) return;
        
        // 检查是否点击在手柄上
        if (config.handle) {
            const handle = draggable.querySelector(config.handle);
            if (!handle || !handle.contains(e.target)) return;
        }
        
        this.startDrag(e, draggable, config);
    }

    /**
     * Handles touch start event.
     */
    handleTouchStart(e) {
        const touch = e.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        const draggable = this.findDraggable(target);
        
        if (draggable) {
            e.preventDefault();
            this.handleMouseDown({ ...e, target, clientX: touch.clientX, clientY: touch.clientY });
        }
    }

    /**
     * Starts drag operation.
     */
    startDrag(e, element, config) {
        this.dragState.startPosition = { x: e.clientX, y: e.clientY };
        this.dragState.draggedElement = element;
        this.dragState.draggedData = config.data || this.extractData(element);
        this.dragState.draggedFrom = element.parentNode;
        
        const rect = element.getBoundingClientRect();
        this.dragState.offset = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        
        // 设置拖拽中标记
        element.setAttribute('data-dragging', 'true');
        
        // 等待达到拖拽阈值
        this.dragState.isPending = true;
    }

    /**
     * Handles mouse move event.
     */
    handleMouseMove(e) {
        if (!this.dragState.isPending && !this.dragState.isDragging) return;
        
        const dx = e.clientX - this.dragState.startPosition.x;
        const dy = e.clientY - this.dragState.startPosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 检查是否达到拖拽阈值
        if (this.dragState.isPending && distance < this.config.dragThreshold) {
            return;
        }
        
        // 开始实际拖拽
        if (this.dragState.isPending) {
            this.dragState.isPending = false;
            this.dragState.isDragging = true;
            this.initiateDrag(e);
        }
        
        if (this.dragState.isDragging) {
            e.preventDefault();
            this.updateDrag(e);
        }
    }

    /**
     * Handles touch move event.
     */
    handleTouchMove(e) {
        if (this.dragState.isDragging) {
            e.preventDefault();
            const touch = e.touches[0];
            this.handleMouseMove({ ...e, clientX: touch.clientX, clientY: touch.clientY });
        }
    }

    /**
     * Initiates actual drag.
     */
    initiateDrag(e) {
        const element = this.dragState.draggedElement;
        const config = this.listeners.get(element);
        
        // 创建拖拽助手
        this.createHelper(element, config);
        
        // 创建占位符
        this.createPlaceholder(element);
        
        // 触发开始回调
        if (config.onStart) {
            const result = config.onStart({
                element,
                data: this.dragState.draggedData,
                event: e
            });
            
            if (result === false) {
                this.cancelDrag();
                return;
            }
        }
        
        // 添加拖拽中的类
        document.body.classList.add('dragging');
        
        // 开始自动滚动检测
        this.startAutoScroll();
    }

    /**
     * Creates drag helper element.
     */
    createHelper(element, config) {
        let helper;
        
        if (config.helper === 'clone') {
            helper = element.cloneNode(true);
            helper.style.position = 'fixed';
            helper.style.zIndex = '10000';
            helper.style.opacity = this.config.ghostOpacity;
            helper.style.pointerEvents = 'none';
            helper.style.transition = 'none';
            helper.classList.add('drag-helper');
            
            // 保持原始尺寸
            const rect = element.getBoundingClientRect();
            helper.style.width = `${rect.width}px`;
            helper.style.height = `${rect.height}px`;
            
            document.body.appendChild(helper);
        } else if (config.helper === 'original') {
            helper = element;
            element.style.opacity = this.config.ghostOpacity;
        } else if (typeof config.helper === 'function') {
            helper = config.helper(element);
            document.body.appendChild(helper);
        }
        
        this.dragState.ghostElement = helper;
    }

    /**
     * Creates placeholder element.
     */
    createPlaceholder(element) {
        const placeholder = document.createElement('div');
        placeholder.className = 'drag-placeholder';
        
        const rect = element.getBoundingClientRect();
        const computed = window.getComputedStyle(element);
        
        placeholder.style.width = `${rect.width}px`;
        placeholder.style.height = `${rect.height}px`;
        placeholder.style.margin = computed.margin;
        placeholder.style.padding = computed.padding;
        placeholder.style.border = '2px dashed var(--glass-border)';
        placeholder.style.background = 'var(--bg-hover)';
        placeholder.style.borderRadius = computed.borderRadius;
        
        element.parentNode.insertBefore(placeholder, element);
        element.style.display = 'none';
        
        this.dragState.placeholder = placeholder;
    }

    /**
     * Updates drag position.
     */
    updateDrag(e) {
        if (!this.dragState.ghostElement) return;
        
        const config = this.listeners.get(this.dragState.draggedElement);
        
        // 计算新位置
        let x = e.clientX - this.dragState.offset.x;
        let y = e.clientY - this.dragState.offset.y;
        
        // 应用轴约束
        if (config.axis === 'x') {
            y = this.dragState.startPosition.y - this.dragState.offset.y;
        } else if (config.axis === 'y') {
            x = this.dragState.startPosition.x - this.dragState.offset.x;
        }
        
        // 应用容器约束
        if (config.containment) {
            const bounds = this.getContainmentBounds(config.containment);
            x = Math.max(bounds.left, Math.min(x, bounds.right));
            y = Math.max(bounds.top, Math.min(y, bounds.bottom));
        }
        
        // 更新位置
        this.dragState.ghostElement.style.left = `${x}px`;
        this.dragState.ghostElement.style.top = `${y}px`;
        
        // 检测放置目标
        this.detectDropTarget(e);
        
        // 触发拖拽回调
        if (config.onDrag) {
            config.onDrag({
                element: this.dragState.draggedElement,
                helper: this.dragState.ghostElement,
                position: { x, y },
                event: e
            });
        }
    }

    /**
     * Detects current drop target.
     */
    detectDropTarget(e) {
        // 临时隐藏助手元素以获取下方元素
        if (this.dragState.ghostElement) {
            this.dragState.ghostElement.style.display = 'none';
        }
        
        const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
        
        if (this.dragState.ghostElement) {
            this.dragState.ghostElement.style.display = '';
        }
        
        const dropZone = this.findDropZone(elementBelow);
        
        // 处理离开事件
        if (this.dragState.dropTarget && this.dragState.dropTarget !== dropZone) {
            this.handleDropLeave(this.dragState.dropTarget);
        }
        
        // 处理进入事件
        if (dropZone && dropZone !== this.dragState.dropTarget) {
            if (this.handleDropEnter(dropZone, e)) {
                this.dragState.dropTarget = dropZone;
            }
        }
        
        // 处理悬停事件
        if (this.dragState.dropTarget) {
            this.handleDropOver(this.dragState.dropTarget, e);
        }
    }

    /**
     * Handles drop enter event.
     */
    handleDropEnter(zone, e) {
        const config = this.zones.get(zone);
        if (!config) return false;
        
        // 检查接受条件
        if (config.accept) {
            const accepted = typeof config.accept === 'function'
                ? config.accept(this.dragState.draggedData, this.dragState.draggedElement)
                : this.dragState.draggedElement.matches(config.accept);
            
            if (!accepted) return false;
        }
        
        // 添加悬停类
        zone.classList.add(config.hoverClass);
        
        // 触发进入回调
        if (config.onEnter) {
            config.onEnter({
                zone,
                data: this.dragState.draggedData,
                element: this.dragState.draggedElement,
                event: e
            });
        }
        
        return true;
    }

    /**
     * Handles drop over event.
     */
    handleDropOver(zone, e) {
        const config = this.zones.get(zone);
        if (!config) return;
        
        if (config.onOver) {
            config.onOver({
                zone,
                data: this.dragState.draggedData,
                element: this.dragState.draggedElement,
                position: { x: e.clientX, y: e.clientY },
                event: e
            });
        }
    }

    /**
     * Handles drop leave event.
     */
    handleDropLeave(zone) {
        const config = this.zones.get(zone);
        if (!config) return;
        
        // 移除悬停类
        zone.classList.remove(config.hoverClass);
        
        // 触发离开回调
        if (config.onLeave) {
            config.onLeave({
                zone,
                data: this.dragState.draggedData,
                element: this.dragState.draggedElement
            });
        }
    }

    /**
     * Handles mouse up event.
     */
    handleMouseUp(e) {
        if (!this.dragState.isDragging && !this.dragState.isPending) return;
        
        this.endDrag(e);
    }

    /**
     * Handles touch end event.
     */
    handleTouchEnd(e) {
        if (this.dragState.isDragging) {
            const touch = e.changedTouches[0];
            this.handleMouseUp({ ...e, clientX: touch.clientX, clientY: touch.clientY });
        }
    }

    /**
     * Ends drag operation.
     */
    endDrag(e) {
        const wasDragging = this.dragState.isDragging;
        
        // 停止自动滚动
        this.stopAutoScroll();
        
        // 处理放置
        if (wasDragging && this.dragState.dropTarget) {
            this.handleDrop(e);
        }
        
        // 清理
        this.cleanup(wasDragging);
        
        // 触发结束回调
        if (wasDragging) {
            const config = this.listeners.get(this.dragState.draggedElement);
            if (config && config.onEnd) {
                config.onEnd({
                    element: this.dragState.draggedElement,
                    data: this.dragState.draggedData,
                    dropped: !!this.dragState.dropTarget,
                    event: e
                });
            }
        }
        
        // 重置状态
        this.resetState();
    }

    /**
     * Handles successful drop.
     */
    handleDrop(e) {
        const zone = this.dragState.dropTarget;
        const config = this.zones.get(zone);
        
        if (config && config.onDrop) {
            const dropData = {
                zone,
                data: this.dragState.draggedData,
                element: this.dragState.draggedElement,
                from: this.dragState.draggedFrom,
                position: { x: e.clientX, y: e.clientY },
                event: e
            };
            
            const result = config.onDrop(dropData);
            
            // 如果返回false，执行回退
            if (result === false && this.listeners.get(this.dragState.draggedElement)?.revert) {
                this.revertDrag();
            }
        }
    }

    /**
     * Reverts drag to original position.
     */
    revertDrag() {
        if (!this.dragState.ghostElement || !this.dragState.placeholder) return;
        
        const placeholder = this.dragState.placeholder;
        const element = this.dragState.draggedElement;
        const ghost = this.dragState.ghostElement;
        
        // 动画回退到原位
        const placeholderRect = placeholder.getBoundingClientRect();
        ghost.style.transition = `all ${this.config.animationDuration}ms ease-out`;
        ghost.style.left = `${placeholderRect.left}px`;
        ghost.style.top = `${placeholderRect.top}px`;
        
        setTimeout(() => {
            placeholder.parentNode.replaceChild(element, placeholder);
            element.style.display = '';
            element.style.opacity = '';
        }, this.config.animationDuration);
    }

    /**
     * Cleans up after drag.
     */
    cleanup(wasDragging) {
        // 清理占位符
        if (this.dragState.placeholder) {
            if (this.dragState.placeholder.parentNode) {
                if (!wasDragging || !this.dragState.dropTarget) {
                    // 恢复原始元素
                    this.dragState.placeholder.parentNode.replaceChild(
                        this.dragState.draggedElement,
                        this.dragState.placeholder
                    );
                } else {
                    this.dragState.placeholder.remove();
                }
            }
        }
        
        // 清理助手元素
        if (this.dragState.ghostElement && this.dragState.ghostElement !== this.dragState.draggedElement) {
            this.dragState.ghostElement.remove();
        }
        
        // 恢复原始元素
        if (this.dragState.draggedElement) {
            this.dragState.draggedElement.style.display = '';
            this.dragState.draggedElement.style.opacity = '';
            this.dragState.draggedElement.removeAttribute('data-dragging');
        }
        
        // 清理放置目标
        if (this.dragState.dropTarget) {
            this.handleDropLeave(this.dragState.dropTarget);
        }
        
        // 移除全局类
        document.body.classList.remove('dragging');
    }

    /**
     * Resets drag state.
     */
    resetState() {
        this.dragState = {
            isDragging: false,
            isPending: false,
            draggedElement: null,
            draggedData: null,
            draggedFrom: null,
            dropTarget: null,
            ghostElement: null,
            placeholder: null,
            offset: { x: 0, y: 0 },
            startPosition: { x: 0, y: 0 }
        };
    }

    /**
     * Handles escape key to cancel drag.
     */
    handleKeyDown(e) {
        if (e.key === 'Escape' && this.dragState.isDragging) {
            this.cancelDrag();
        }
    }

    /**
     * Cancels current drag operation.
     */
    cancelDrag() {
        if (this.dragState.isDragging) {
            this.revertDrag();
            setTimeout(() => {
                this.cleanup(false);
                this.resetState();
            }, this.config.animationDuration);
        } else {
            this.cleanup(false);
            this.resetState();
        }
    }

    /**
     * Auto-scroll functionality.
     */
    startAutoScroll() {
        this.scrollInterval = setInterval(() => {
            if (!this.dragState.isDragging) {
                this.stopAutoScroll();
                return;
            }
            
            const mouseY = this.dragState.ghostElement
                ? parseInt(this.dragState.ghostElement.style.top) + this.dragState.offset.y
                : 0;
            
            const viewportHeight = window.innerHeight;
            const scrollSpeed = this.config.scrollSpeed;
            const boundary = this.config.scrollBoundary;
            
            if (mouseY < boundary) {
                window.scrollBy(0, -scrollSpeed);
            } else if (mouseY > viewportHeight - boundary) {
                window.scrollBy(0, scrollSpeed);
            }
        }, 16);
    }

    /**
     * Stops auto-scroll.
     */
    stopAutoScroll() {
        if (this.scrollInterval) {
            clearInterval(this.scrollInterval);
            this.scrollInterval = null;
        }
    }

    /**
     * Utility methods
     */
    
    findDraggable(element) {
        while (element && element !== document.body) {
            if (element.hasAttribute('data-draggable')) {
                return element;
            }
            element = element.parentElement;
        }
        return null;
    }

    findDropZone(element) {
        while (element && element !== document.body) {
            if (element.hasAttribute('data-dropzone')) {
                return element;
            }
            element = element.parentElement;
        }
        return null;
    }

    extractData(element) {
        return {
            id: element.id,
            type: element.getAttribute('data-type'),
            ...element.dataset
        };
    }

    getContainmentBounds(containment) {
        let container;
        
        if (typeof containment === 'string') {
            container = document.querySelector(containment);
        } else if (containment instanceof Element) {
            container = containment;
        } else if (containment === 'parent') {
            container = this.dragState.draggedElement.parentNode;
        } else if (containment === 'window') {
            return {
                left: 0,
                top: 0,
                right: window.innerWidth - this.dragState.ghostElement.offsetWidth,
                bottom: window.innerHeight - this.dragState.ghostElement.offsetHeight
            };
        }
        
        if (container) {
            const rect = container.getBoundingClientRect();
            return {
                left: rect.left,
                top: rect.top,
                right: rect.right - this.dragState.ghostElement.offsetWidth,
                bottom: rect.bottom - this.dragState.ghostElement.offsetHeight
            };
        }
        
        return null;
    }

    /**
     * Destroys drag manager and cleans up.
     */
    destroy() {
        // 移除事件监听器
        document.removeEventListener('mousedown', this.handleMouseDown, true);
        document.removeEventListener('mousemove', this.handleMouseMove, true);
        document.removeEventListener('mouseup', this.handleMouseUp, true);
        document.removeEventListener('touchstart', this.handleTouchStart, true);
        document.removeEventListener('touchmove', this.handleTouchMove, true);
        document.removeEventListener('touchend', this.handleTouchEnd, true);
        document.removeEventListener('keydown', this.handleKeyDown);
        
        // 清理当前拖拽
        this.cancelDrag();
        
        // 清理注册
        this.zones.clear();
        this.listeners.clear();
    }
}

// 创建全局实例
window.dragManager = new DragManager();