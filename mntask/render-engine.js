/**
 * Render Engine - 虚拟DOM渲染引擎
 * 
 * 功能特性:
 * - 虚拟DOM实现
 * - 差异化更新算法
 * - 批量DOM操作
 * - 组件生命周期
 * - 性能优化
 */

class VNode {
    constructor(type, props = {}, children = []) {
        this.type = type;
        this.props = props;
        this.children = children;
        this.key = props.key || null;
        this.ref = props.ref || null;
        this.element = null;
    }
}

class RenderEngine {
    constructor() {
        this.componentInstances = new WeakMap();
        this.pendingUpdates = [];
        this.isUpdating = false;
        this.rafId = null;
        this.domOperationQueue = [];
        this.recycledElements = new Map();
    }

    /**
     * Creates a virtual node.
     */
    createElement(type, props, ...children) {
        // 扁平化子节点
        children = children.flat().filter(child => 
            child !== null && child !== undefined && child !== false
        );
        
        // 处理文本节点
        children = children.map(child => 
            typeof child === 'string' || typeof child === 'number' 
                ? new VNode('text', { value: String(child) })
                : child
        );
        
        return new VNode(type, props, children);
    }

    /**
     * Renders virtual DOM to real DOM.
     */
    render(vnode, container) {
        if (!container) {
            throw new Error('Container element is required');
        }
        
        // 批量更新
        this.scheduleUpdate(() => {
            const oldVNode = container._vnode || null;
            const element = this.diff(oldVNode, vnode, container);
            container._vnode = vnode;
            
            // 执行批量DOM操作
            this.flushDOMOperations();
        });
    }

    /**
     * Diffs and patches virtual DOM.
     */
    diff(oldVNode, newVNode, parent, index = 0) {
        // 新增节点
        if (!oldVNode) {
            const element = this.createElement(newVNode);
            if (parent) {
                this.queueDOMOperation(() => {
                    if (index === parent.childNodes.length) {
                        parent.appendChild(element);
                    } else {
                        parent.insertBefore(element, parent.childNodes[index]);
                    }
                });
            }
            return element;
        }
        
        // 删除节点
        if (!newVNode) {
            const element = oldVNode.element;
            if (element && parent) {
                this.queueDOMOperation(() => {
                    parent.removeChild(element);
                    this.recycleElement(oldVNode);
                });
            }
            return null;
        }
        
        // 替换节点
        if (this.shouldReplace(oldVNode, newVNode)) {
            const newElement = this.createElement(newVNode);
            const oldElement = oldVNode.element;
            if (oldElement && parent) {
                this.queueDOMOperation(() => {
                    parent.replaceChild(newElement, oldElement);
                    this.recycleElement(oldVNode);
                });
            }
            return newElement;
        }
        
        // 更新节点
        const element = oldVNode.element;
        newVNode.element = element;
        
        // 更新属性
        this.updateProps(element, oldVNode.props, newVNode.props);
        
        // 更新子节点
        this.updateChildren(element, oldVNode.children, newVNode.children);
        
        return element;
    }

    /**
     * Checks if node should be replaced.
     */
    shouldReplace(oldVNode, newVNode) {
        return oldVNode.type !== newVNode.type || 
               oldVNode.key !== newVNode.key;
    }

    /**
     * Creates DOM element from virtual node.
     */
    createElement(vnode) {
        let element;
        
        // 尝试从回收池获取元素
        if (this.recycledElements.has(vnode.type)) {
            const recycled = this.recycledElements.get(vnode.type);
            if (recycled.length > 0) {
                element = recycled.pop();
                this.clearElement(element);
            }
        }
        
        if (!element) {
            if (vnode.type === 'text') {
                element = document.createTextNode(vnode.props.value || '');
            } else if (typeof vnode.type === 'function') {
                // 组件
                element = this.createComponent(vnode);
            } else {
                element = document.createElement(vnode.type);
            }
        }
        
        vnode.element = element;
        
        // 设置属性
        if (vnode.type !== 'text') {
            this.setProps(element, vnode.props);
            
            // 递归创建子节点
            vnode.children.forEach(child => {
                const childElement = this.createElement(child);
                if (childElement) {
                    element.appendChild(childElement);
                }
            });
        }
        
        // 处理ref
        if (vnode.ref) {
            vnode.ref.current = element;
        }
        
        return element;
    }

    /**
     * Creates component instance.
     */
    createComponent(vnode) {
        const Component = vnode.type;
        let instance = this.componentInstances.get(vnode);
        
        if (!instance) {
            instance = new Component(vnode.props);
            this.componentInstances.set(vnode, instance);
            
            // 生命周期 - componentDidMount
            if (instance.componentDidMount) {
                this.queueDOMOperation(() => {
                    instance.componentDidMount();
                });
            }
        }
        
        // 渲染组件
        const rendered = instance.render();
        const element = this.createElement(rendered);
        instance.element = element;
        
        return element;
    }

    /**
     * Updates element properties.
     */
    updateProps(element, oldProps = {}, newProps = {}) {
        // 删除旧属性
        Object.keys(oldProps).forEach(key => {
            if (!(key in newProps)) {
                this.removeProp(element, key, oldProps[key]);
            }
        });
        
        // 设置新属性
        Object.keys(newProps).forEach(key => {
            if (oldProps[key] !== newProps[key]) {
                this.setProp(element, key, newProps[key], oldProps[key]);
            }
        });
    }

    /**
     * Sets element property.
     */
    setProp(element, key, value, oldValue) {
        if (key === 'className') {
            element.className = value || '';
        } else if (key === 'style') {
            this.updateStyles(element, oldValue, value);
        } else if (key.startsWith('on')) {
            const eventName = key.substring(2).toLowerCase();
            if (oldValue) {
                element.removeEventListener(eventName, oldValue);
            }
            if (value) {
                element.addEventListener(eventName, value);
            }
        } else if (key === 'dangerouslySetInnerHTML') {
            element.innerHTML = value?.__html || '';
        } else if (key in element && key !== 'list' && key !== 'form') {
            element[key] = value;
        } else {
            element.setAttribute(key, value);
        }
    }

    /**
     * Removes element property.
     */
    removeProp(element, key, oldValue) {
        if (key === 'className') {
            element.className = '';
        } else if (key === 'style') {
            element.style.cssText = '';
        } else if (key.startsWith('on')) {
            const eventName = key.substring(2).toLowerCase();
            element.removeEventListener(eventName, oldValue);
        } else if (key in element) {
            element[key] = undefined;
        } else {
            element.removeAttribute(key);
        }
    }

    /**
     * Updates element styles.
     */
    updateStyles(element, oldStyles = {}, newStyles = {}) {
        // 删除旧样式
        Object.keys(oldStyles).forEach(key => {
            if (!(key in newStyles)) {
                element.style[key] = '';
            }
        });
        
        // 设置新样式
        Object.keys(newStyles).forEach(key => {
            if (oldStyles[key] !== newStyles[key]) {
                element.style[key] = newStyles[key];
            }
        });
    }

    /**
     * Updates children with key-based reconciliation.
     */
    updateChildren(parent, oldChildren = [], newChildren = []) {
        const oldKeyed = new Map();
        const newKeyed = new Map();
        
        // 构建key映射
        oldChildren.forEach((child, index) => {
            if (child.key !== null) {
                oldKeyed.set(child.key, { vnode: child, index });
            }
        });
        
        newChildren.forEach((child, index) => {
            if (child.key !== null) {
                newKeyed.set(child.key, { vnode: child, index });
            }
        });
        
        // 更新或创建节点
        const maxLength = Math.max(oldChildren.length, newChildren.length);
        
        for (let i = 0; i < maxLength; i++) {
            const oldChild = oldChildren[i];
            const newChild = newChildren[i];
            
            // 使用key匹配
            if (newChild?.key !== null && oldKeyed.has(newChild.key)) {
                const oldMatch = oldKeyed.get(newChild.key);
                this.diff(oldMatch.vnode, newChild, parent, i);
            } else {
                this.diff(oldChild, newChild, parent, i);
            }
        }
    }

    /**
     * Schedules batch update.
     */
    scheduleUpdate(updateFn) {
        this.pendingUpdates.push(updateFn);
        
        if (!this.isUpdating) {
            this.isUpdating = true;
            
            if (this.rafId) {
                cancelAnimationFrame(this.rafId);
            }
            
            this.rafId = requestAnimationFrame(() => {
                this.flushUpdates();
            });
        }
    }

    /**
     * Flushes pending updates.
     */
    flushUpdates() {
        const updates = this.pendingUpdates.slice();
        this.pendingUpdates = [];
        
        updates.forEach(updateFn => {
            try {
                updateFn();
            } catch (error) {
                console.error('Update error:', error);
            }
        });
        
        this.isUpdating = false;
        this.rafId = null;
    }

    /**
     * Queues DOM operation for batch execution.
     */
    queueDOMOperation(operation) {
        this.domOperationQueue.push(operation);
    }

    /**
     * Executes all queued DOM operations.
     */
    flushDOMOperations() {
        // 使用DocumentFragment优化批量插入
        const fragment = document.createDocumentFragment();
        const operations = this.domOperationQueue.slice();
        this.domOperationQueue = [];
        
        operations.forEach(operation => {
            try {
                operation(fragment);
            } catch (error) {
                console.error('DOM operation error:', error);
            }
        });
    }

    /**
     * Recycles element for reuse.
     */
    recycleElement(vnode) {
        if (!vnode.element || vnode.type === 'text') return;
        
        const element = vnode.element;
        
        // 清理事件监听器
        this.clearElement(element);
        
        // 添加到回收池
        if (!this.recycledElements.has(vnode.type)) {
            this.recycledElements.set(vnode.type, []);
        }
        
        const pool = this.recycledElements.get(vnode.type);
        if (pool.length < 100) { // 限制池大小
            pool.push(element);
        }
    }

    /**
     * Clears element for reuse.
     */
    clearElement(element) {
        // 清理属性
        while (element.attributes && element.attributes.length > 0) {
            element.removeAttribute(element.attributes[0].name);
        }
        
        // 清理子节点
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        
        // 清理样式
        element.style.cssText = '';
        
        // 清理类名
        element.className = '';
    }

    /**
     * Component base class.
     */
    static Component = class Component {
        constructor(props) {
            this.props = props;
            this.state = {};
            this.element = null;
        }

        setState(updates) {
            Object.assign(this.state, updates);
            this.forceUpdate();
        }

        forceUpdate() {
            if (this.element && this.element.parentNode) {
                const vnode = this.render();
                window.renderEngine.render(vnode, this.element.parentNode);
            }
        }

        componentDidMount() {}
        componentDidUpdate() {}
        componentWillUnmount() {}

        render() {
            throw new Error('Component must implement render method');
        }
    };
}

// 创建简化的JSX风格API
const h = (type, props, ...children) => {
    return new VNode(type, props, children);
};

// 创建全局实例
window.renderEngine = new RenderEngine();
window.h = h;
window.Component = RenderEngine.Component;

// 导出性能监控工具
window.RenderStats = {
    getStats() {
        return {
            pendingUpdates: window.renderEngine.pendingUpdates.length,
            domOperationQueue: window.renderEngine.domOperationQueue.length,
            recycledElements: Array.from(window.renderEngine.recycledElements.entries())
                .map(([type, pool]) => ({ type, count: pool.length }))
        };
    },
    
    clearRecyclePool() {
        window.renderEngine.recycledElements.clear();
    }
};