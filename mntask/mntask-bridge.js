/**
 * MNTask 网页与插件通信桥接库
 * @module mntask-bridge
 * @version 1.0.0
 * @description 
 * 这个库封装了 MarginNote 插件中 WebView 与原生代码之间的通信逻辑。
 * 提供了简单易用的 API，让开发者可以专注于业务逻辑而不是通信细节。
 * 
 * @author MNTask 开发团队
 * @license MIT
 * 
 * @example
 * // 基本使用
 * const bridge = new MNTaskBridge({ debug: true });
 * 
 * // 发送消息到插件
 * bridge.send('updateTask', { taskId: '123', status: '已完成' });
 * 
 * // 监听插件发来的数据
 * bridge.on('tasks', (tasks) => {
 *     console.log('收到任务列表：', tasks);
 * });
 */

(function(window) {
    'use strict';
    
    /**
     * MNTask 通信桥接器类
     * @class MNTaskBridge
     * @param {Object} options - 配置选项
     * @param {boolean} [options.debug=false] - 是否开启调试模式
     * @param {string} [options.protocol='mntask://'] - URL 协议前缀
     * @param {number} [options.timeout=5000] - 请求超时时间（毫秒）
     * @param {boolean} [options.autoInit=true] - 是否自动初始化
     */
    class MNTaskBridge {
        constructor(options = {}) {
            // 配置选项
            this.options = {
                debug: false,
                protocol: 'mntask://',
                timeout: 5000,
                autoInit: true,
                ...options
            };
            
            // 内部状态
            this.ready = false;
            this.handlers = new Map();
            this.pendingCallbacks = new Map();
            this.callbackId = 0;
            
            // 性能统计
            this.stats = {
                messagesSent: 0,
                messagesReceived: 0,
                errors: 0
            };
            
            // 如果设置了自动初始化，则立即初始化
            if (this.options.autoInit) {
                this._init();
            }
        }
        
        // ==================== 初始化方法 ====================
        
        /**
         * 初始化桥接器
         * @private
         */
        _init() {
            this._log('初始化 MNTaskBridge...');
            
            // 确保在正确的时机初始化
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this._onDOMReady();
                });
            } else {
                this._onDOMReady();
            }
            
            // 监听全局错误，帮助调试
            if (this.options.debug) {
                window.addEventListener('error', (event) => {
                    this._log(`全局错误：${event.message}`, 'error', {
                        filename: event.filename,
                        lineno: event.lineno,
                        colno: event.colno
                    });
                });
            }
        }
        
        /**
         * DOM 就绪后的处理
         * @private
         */
        _onDOMReady() {
            // 将桥接器实例暴露到全局
            window.MNTaskBridge = this;
            window.mntaskBridge = this; // 别名，方便使用
            
            // 暴露接收函数供插件调用
            window.receiveFromPlugin = this.receive.bind(this);
            window.mntaskReceive = this.receive.bind(this); // 别名
            
            // 标记为就绪
            this.ready = true;
            this._log('MNTaskBridge 已就绪');
            
            // 通知插件页面已准备好
            this._notifyReady();
            
            // 触发 ready 事件
            this._emit('ready');
        }
        
        /**
         * 通知插件页面已准备就绪
         * @private
         */
        _notifyReady() {
            this._sendURL('ready', {
                version: '1.0.0',
                features: ['basic', 'callback', 'batch']
            });
        }
        
        // ==================== 核心通信方法 ====================
        
        /**
         * 发送消息到插件
         * @param {string} command - 命令名称
         * @param {*} data - 要发送的数据（会自动序列化）
         * @param {Function} [callback] - 可选的回调函数
         * @returns {Promise} 返回 Promise，如果提供了 callback 则也会调用 callback
         * 
         * @example
         * // 使用 Promise
         * bridge.send('getTaskList', { page: 1 })
         *     .then(result => console.log('任务列表：', result))
         *     .catch(error => console.error('获取失败：', error));
         * 
         * // 使用回调函数
         * bridge.send('updateTask', { id: '123', status: '完成' }, (error, result) => {
         *     if (error) {
         *         console.error('更新失败：', error);
         *     } else {
         *         console.log('更新成功：', result);
         *     }
         * });
         */
        send(command, data = null, callback = null) {
            return new Promise((resolve, reject) => {
                // 检查是否就绪
                if (!this.ready) {
                    const error = new Error('MNTaskBridge 尚未就绪');
                    this._log(error.message, 'error');
                    reject(error);
                    if (callback) callback(error);
                    return;
                }
                
                // 生成唯一的回调 ID
                const callbackId = ++this.callbackId;
                
                // 准备发送的数据
                const payload = {
                    command,
                    data,
                    callbackId,
                    timestamp: Date.now()
                };
                
                // 设置超时
                const timeout = setTimeout(() => {
                    this.pendingCallbacks.delete(callbackId);
                    const error = new Error(`请求超时：${command}`);
                    reject(error);
                    if (callback) callback(error);
                }, this.options.timeout);
                
                // 保存回调
                this.pendingCallbacks.set(callbackId, {
                    resolve,
                    reject,
                    callback,
                    timeout,
                    command,
                    timestamp: Date.now()
                });
                
                // 编码数据
                let encoded;
                try {
                    encoded = encodeURIComponent(JSON.stringify(payload));
                } catch (error) {
                    this._log(`编码数据失败：${error.message}`, 'error');
                    clearTimeout(timeout);
                    this.pendingCallbacks.delete(callbackId);
                    reject(error);
                    if (callback) callback(error);
                    return;
                }
                
                // 发送
                this._sendURL(command, { data: encoded });
                this.stats.messagesSent++;
                
                this._log(`发送命令：${command}`, 'info', data);
            });
        }
        
        /**
         * 接收来自插件的数据
         * @param {string} type - 数据类型
         * @param {string} jsonData - JSON 格式的数据字符串
         * 
         * @example
         * // 插件端调用：
         * webView.evaluateJavaScript(
         *     `receiveFromPlugin('tasks', '${JSON.stringify(tasks)}')`
         * );
         */
        receive(type, jsonData) {
            this.stats.messagesReceived++;
            
            try {
                // 解析数据
                const data = JSON.parse(jsonData);
                this._log(`接收数据：${type}`, 'info', data);
                
                // 检查是否是回调响应
                if (type === 'callback' && data.callbackId) {
                    this._handleCallback(data);
                    return;
                }
                
                // 触发对应的处理器
                this._emit(type, data);
                
            } catch (error) {
                this.stats.errors++;
                this._log(`解析数据错误：${error.message}`, 'error', {
                    type,
                    jsonData: jsonData.substring(0, 100) + '...'
                });
            }
        }
        
        /**
         * 处理回调响应
         * @private
         * @param {Object} response - 回调响应数据
         */
        _handleCallback(response) {
            const { callbackId, success, data, error } = response;
            
            const pending = this.pendingCallbacks.get(callbackId);
            if (!pending) {
                this._log(`未找到回调：${callbackId}`, 'warn');
                return;
            }
            
            // 清除超时
            clearTimeout(pending.timeout);
            this.pendingCallbacks.delete(callbackId);
            
            // 调用回调
            if (success) {
                pending.resolve(data);
                if (pending.callback) pending.callback(null, data);
            } else {
                const err = new Error(error || '未知错误');
                pending.reject(err);
                if (pending.callback) pending.callback(err);
            }
            
            // 性能统计
            const duration = Date.now() - pending.timestamp;
            this._log(`回调完成 [${pending.command}]，耗时：${duration}ms`);
        }
        
        // ==================== 事件处理方法 ====================
        
        /**
         * 监听特定类型的数据或事件
         * @param {string} type - 数据类型或事件名称
         * @param {Function} handler - 处理函数
         * @returns {Function} 返回取消监听的函数
         * 
         * @example
         * // 监听任务数据
         * const unsubscribe = bridge.on('tasks', (tasks) => {
         *     console.log('收到任务列表：', tasks);
         * });
         * 
         * // 监听错误事件
         * bridge.on('error', (error) => {
         *     console.error('发生错误：', error);
         * });
         * 
         * // 取消监听
         * unsubscribe();
         */
        on(type, handler) {
            if (typeof handler !== 'function') {
                throw new TypeError('Handler 必须是函数');
            }
            
            if (!this.handlers.has(type)) {
                this.handlers.set(type, new Set());
            }
            
            this.handlers.get(type).add(handler);
            this._log(`添加监听器：${type}`);
            
            // 返回取消监听的函数
            return () => {
                const handlers = this.handlers.get(type);
                if (handlers) {
                    handlers.delete(handler);
                    this._log(`移除监听器：${type}`);
                    
                    // 如果没有其他监听器，删除整个集合
                    if (handlers.size === 0) {
                        this.handlers.delete(type);
                    }
                }
            };
        }
        
        /**
         * 一次性监听
         * @param {string} type - 数据类型或事件名称
         * @param {Function} handler - 处理函数
         * @returns {Function} 返回取消监听的函数
         * 
         * @example
         * bridge.once('ready', () => {
         *     console.log('桥接器已就绪（只触发一次）');
         * });
         */
        once(type, handler) {
            const wrappedHandler = (data) => {
                handler(data);
                this.off(type, wrappedHandler);
            };
            
            return this.on(type, wrappedHandler);
        }
        
        /**
         * 取消监听
         * @param {string} type - 数据类型或事件名称
         * @param {Function} [handler] - 要取消的处理函数，不提供则取消所有
         * 
         * @example
         * // 取消特定处理函数
         * bridge.off('tasks', myHandler);
         * 
         * // 取消所有 tasks 监听器
         * bridge.off('tasks');
         */
        off(type, handler = null) {
            if (handler === null) {
                // 取消所有该类型的监听器
                this.handlers.delete(type);
                this._log(`移除所有监听器：${type}`);
            } else {
                // 取消特定的监听器
                const handlers = this.handlers.get(type);
                if (handlers) {
                    handlers.delete(handler);
                    if (handlers.size === 0) {
                        this.handlers.delete(type);
                    }
                }
            }
        }
        
        /**
         * 触发事件
         * @private
         * @param {string} type - 事件类型
         * @param {*} data - 事件数据
         */
        _emit(type, data) {
            const handlers = this.handlers.get(type);
            if (!handlers || handlers.size === 0) {
                this._log(`没有监听器：${type}`, 'debug');
                return;
            }
            
            handlers.forEach(handler => {
                try {
                    handler(data);
                } catch (error) {
                    this.stats.errors++;
                    this._log(`处理器错误 [${type}]：${error.message}`, 'error', error);
                }
            });
        }
        
        // ==================== 工具方法 ====================
        
        /**
         * 批量发送多个命令
         * @param {Array<Object>} commands - 命令数组
         * @returns {Promise<Array>} 返回所有结果的 Promise
         * 
         * @example
         * bridge.batch([
         *     { command: 'getTask', data: { id: '1' } },
         *     { command: 'getTask', data: { id: '2' } },
         *     { command: 'getTask', data: { id: '3' } }
         * ]).then(results => {
         *     console.log('所有任务：', results);
         * });
         */
        batch(commands) {
            const promises = commands.map(({ command, data }) => 
                this.send(command, data)
            );
            
            return Promise.all(promises);
        }
        
        /**
         * 等待桥接器就绪
         * @returns {Promise} 就绪后 resolve
         * 
         * @example
         * bridge.waitForReady().then(() => {
         *     console.log('桥接器已就绪，可以开始通信');
         * });
         */
        waitForReady() {
            if (this.ready) {
                return Promise.resolve();
            }
            
            return new Promise((resolve) => {
                this.once('ready', resolve);
            });
        }
        
        /**
         * 获取统计信息
         * @returns {Object} 统计数据
         * 
         * @example
         * const stats = bridge.getStats();
         * console.log(`已发送：${stats.messagesSent}，已接收：${stats.messagesReceived}`);
         */
        getStats() {
            return {
                ...this.stats,
                pendingCallbacks: this.pendingCallbacks.size,
                handlers: this.handlers.size
            };
        }
        
        /**
         * 重置桥接器
         * 清除所有监听器和待处理的回调
         */
        reset() {
            this._log('重置 MNTaskBridge');
            
            // 清除所有待处理的回调
            this.pendingCallbacks.forEach(({ timeout, reject }) => {
                clearTimeout(timeout);
                reject(new Error('桥接器已重置'));
            });
            this.pendingCallbacks.clear();
            
            // 清除所有监听器（除了内部的）
            const internalTypes = ['ready'];
            this.handlers.forEach((handlers, type) => {
                if (!internalTypes.includes(type)) {
                    this.handlers.delete(type);
                }
            });
            
            // 重置统计
            this.stats = {
                messagesSent: 0,
                messagesReceived: 0,
                errors: 0
            };
        }
        
        // ==================== 私有方法 ====================
        
        /**
         * 发送 URL 到插件
         * @private
         * @param {string} command - 命令
         * @param {Object} params - 参数
         */
        _sendURL(command, params = {}) {
            // 构建查询字符串
            const queryParts = Object.entries(params)
                .filter(([key, value]) => value !== undefined && value !== null)
                .map(([key, value]) => {
                    let encoded;
                    if (typeof value === 'object') {
                        encoded = encodeURIComponent(JSON.stringify(value));
                    } else {
                        encoded = encodeURIComponent(String(value));
                    }
                    return `${key}=${encoded}`;
                });
            
            const queryString = queryParts.length > 0 ? '?' + queryParts.join('&') : '';
            const url = `${this.options.protocol}${command}${queryString}`;
            
            this._log(`发送 URL: ${url}`, 'debug');
            
            // 设置 location
            try {
                window.location.href = url;
            } catch (error) {
                this._log(`发送 URL 失败：${error.message}`, 'error');
                throw error;
            }
        }
        
        /**
         * 日志输出
         * @private
         * @param {string} message - 日志消息
         * @param {string} [level='log'] - 日志级别 (log/info/warn/error/debug)
         * @param {*} [data] - 附加数据
         */
        _log(message, level = 'log', data = null) {
            if (!this.options.debug && level === 'debug') {
                return;
            }
            
            const prefix = '[MNTaskBridge]';
            const timestamp = new Date().toLocaleTimeString();
            const fullMessage = `${prefix} ${timestamp} - ${message}`;
            
            // 根据级别选择控制台方法
            const consoleMethods = {
                info: 'info',
                warn: 'warn',
                error: 'error',
                debug: 'log',
                log: 'log'
            };
            
            const method = consoleMethods[level] || 'log';
            
            if (data !== null) {
                console[method](fullMessage, data);
            } else {
                console[method](fullMessage);
            }
            
            // 如果是错误，也发送到插件端
            if (level === 'error' && this.ready) {
                this._sendURL('log', {
                    level: 'error',
                    message: message,
                    data: data
                });
            }
        }
    }
    
    // ==================== 辅助函数 ====================
    
    /**
     * 创建默认的桥接器实例
     * @type {MNTaskBridge}
     */
    const defaultBridge = new MNTaskBridge({
        debug: true,
        autoInit: true
    });
    
    // ==================== 导出 ====================
    
    // 支持多种模块系统
    if (typeof module !== 'undefined' && module.exports) {
        // CommonJS
        module.exports = MNTaskBridge;
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        define([], function() {
            return MNTaskBridge;
        });
    } else {
        // 浏览器全局变量
        window.MNTaskBridge = MNTaskBridge;
        window.bridge = defaultBridge; // 默认实例，方便使用
    }
    
})(typeof window !== 'undefined' ? window : this);