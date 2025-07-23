/**
 * Task Board Utils - 任务看板专用工具函数
 * 
 * 功能模块:
 * - DOM操作
 * - 数据处理
 * - 时间日期
 * - 防抖节流
 * - 安全处理
 * - 性能优化
 */

const TaskBoardUtils = {
    /**
     * DOM 操作工具
     */
    dom: {
        /**
         * Creates element with properties.
         */
        createElement(tag, props = {}, children = []) {
            const element = document.createElement(tag);
            
            Object.entries(props).forEach(([key, value]) => {
                if (key === 'className') {
                    element.className = value;
                } else if (key === 'style' && typeof value === 'object') {
                    Object.assign(element.style, value);
                } else if (key.startsWith('on')) {
                    const event = key.substring(2).toLowerCase();
                    element.addEventListener(event, value);
                } else if (key === 'html') {
                    element.innerHTML = value;
                } else {
                    element.setAttribute(key, value);
                }
            });
            
            children.forEach(child => {
                if (typeof child === 'string') {
                    element.appendChild(document.createTextNode(child));
                } else if (child instanceof Element) {
                    element.appendChild(child);
                }
            });
            
            return element;
        },

        /**
         * Queries elements with caching.
         */
        query: (() => {
            const cache = new Map();
            const maxCacheSize = 100;
            
            return (selector, context = document) => {
                const key = `${context === document ? '' : context.id || 'ctx'}_${selector}`;
                
                if (cache.has(key)) {
                    return cache.get(key);
                }
                
                const result = context.querySelector(selector);
                
                if (cache.size >= maxCacheSize) {
                    const firstKey = cache.keys().next().value;
                    cache.delete(firstKey);
                }
                
                cache.set(key, result);
                return result;
            };
        })(),

        /**
         * Batch DOM updates.
         */
        batchUpdate(updates) {
            const fragment = document.createDocumentFragment();
            updates(fragment);
            return fragment;
        },

        /**
         * Measures element without reflow.
         */
        measure(element, callback) {
            const display = element.style.display;
            const visibility = element.style.visibility;
            const position = element.style.position;
            
            element.style.display = 'block';
            element.style.visibility = 'hidden';
            element.style.position = 'absolute';
            
            const result = callback(element);
            
            element.style.display = display;
            element.style.visibility = visibility;
            element.style.position = position;
            
            return result;
        },

        /**
         * Animates element with RAF.
         */
        animate(element, props, duration = 300, easing = 'ease-out') {
            const start = performance.now();
            const initial = {};
            
            Object.keys(props).forEach(prop => {
                initial[prop] = parseFloat(window.getComputedStyle(element)[prop]) || 0;
            });
            
            const tick = (now) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = this.easing[easing](progress);
                
                Object.entries(props).forEach(([prop, target]) => {
                    const current = initial[prop] + (target - initial[prop]) * easedProgress;
                    element.style[prop] = prop.includes('olor') ? current : `${current}px`;
                });
                
                if (progress < 1) {
                    requestAnimationFrame(tick);
                }
            };
            
            requestAnimationFrame(tick);
        },

        /**
         * Easing functions.
         */
        easing: {
            linear: t => t,
            'ease-in': t => t * t,
            'ease-out': t => t * (2 - t),
            'ease-in-out': t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
        }
    },

    /**
     * 数据处理工具
     */
    data: {
        /**
         * Deep clones object/array.
         */
        deepClone(obj) {
            if (obj === null || typeof obj !== 'object') return obj;
            if (obj instanceof Date) return new Date(obj.getTime());
            if (obj instanceof Array) return obj.map(item => this.deepClone(item));
            if (obj instanceof Map) return new Map(Array.from(obj, ([k, v]) => [k, this.deepClone(v)]));
            if (obj instanceof Set) return new Set(Array.from(obj, v => this.deepClone(v)));
            
            const cloned = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    cloned[key] = this.deepClone(obj[key]);
                }
            }
            return cloned;
        },

        /**
         * Deep merges objects.
         */
        deepMerge(target, ...sources) {
            if (!sources.length) return target;
            const source = sources.shift();
            
            if (this.isObject(target) && this.isObject(source)) {
                for (const key in source) {
                    if (this.isObject(source[key])) {
                        if (!target[key]) Object.assign(target, { [key]: {} });
                        this.deepMerge(target[key], source[key]);
                    } else {
                        Object.assign(target, { [key]: source[key] });
                    }
                }
            }
            
            return this.deepMerge(target, ...sources);
        },

        /**
         * Checks if value is plain object.
         */
        isObject(item) {
            return item && typeof item === 'object' && !Array.isArray(item);
        },

        /**
         * Groups array by key.
         */
        groupBy(array, key) {
            return array.reduce((groups, item) => {
                const value = typeof key === 'function' ? key(item) : item[key];
                (groups[value] = groups[value] || []).push(item);
                return groups;
            }, {});
        },

        /**
         * Removes duplicates from array.
         */
        unique(array, key) {
            if (!key) return [...new Set(array)];
            
            const seen = new Set();
            return array.filter(item => {
                const value = typeof key === 'function' ? key(item) : item[key];
                if (seen.has(value)) return false;
                seen.add(value);
                return true;
            });
        },

        /**
         * Safely gets nested property.
         */
        get(object, path, defaultValue) {
            const keys = path.split('.');
            let result = object;
            
            for (const key of keys) {
                result = result?.[key];
                if (result === undefined) return defaultValue;
            }
            
            return result;
        },

        /**
         * Safely sets nested property.
         */
        set(object, path, value) {
            const keys = path.split('.');
            const last = keys.pop();
            
            const target = keys.reduce((obj, key) => {
                if (!obj[key]) obj[key] = {};
                return obj[key];
            }, object);
            
            target[last] = value;
            return object;
        }
    },

    /**
     * 时间日期工具
     */
    date: {
        /**
         * Formats date with template.
         */
        format(date, template = 'YYYY-MM-DD HH:mm:ss') {
            const d = date instanceof Date ? date : new Date(date);
            
            const map = {
                YYYY: d.getFullYear(),
                MM: String(d.getMonth() + 1).padStart(2, '0'),
                DD: String(d.getDate()).padStart(2, '0'),
                HH: String(d.getHours()).padStart(2, '0'),
                mm: String(d.getMinutes()).padStart(2, '0'),
                ss: String(d.getSeconds()).padStart(2, '0')
            };
            
            return template.replace(/YYYY|MM|DD|HH|mm|ss/g, match => map[match]);
        },

        /**
         * Gets relative time string.
         */
        relative(date) {
            const now = new Date();
            const target = date instanceof Date ? date : new Date(date);
            const diff = now - target;
            
            const seconds = Math.floor(diff / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            
            if (days > 30) return this.format(target, 'YYYY-MM-DD');
            if (days > 0) return `${days}天前`;
            if (hours > 0) return `${hours}小时前`;
            if (minutes > 0) return `${minutes}分钟前`;
            return '刚刚';
        },

        /**
         * Adds duration to date.
         */
        add(date, duration, unit = 'days') {
            const d = new Date(date);
            const units = {
                seconds: 1000,
                minutes: 60 * 1000,
                hours: 60 * 60 * 1000,
                days: 24 * 60 * 60 * 1000,
                weeks: 7 * 24 * 60 * 60 * 1000,
                months: 30 * 24 * 60 * 60 * 1000,
                years: 365 * 24 * 60 * 60 * 1000
            };
            
            d.setTime(d.getTime() + duration * (units[unit] || units.days));
            return d;
        },

        /**
         * Gets date range.
         */
        getRange(type = 'week') {
            const now = new Date();
            const start = new Date(now);
            const end = new Date(now);
            
            switch (type) {
                case 'day':
                    start.setHours(0, 0, 0, 0);
                    end.setHours(23, 59, 59, 999);
                    break;
                case 'week':
                    const day = start.getDay();
                    start.setDate(start.getDate() - day);
                    start.setHours(0, 0, 0, 0);
                    end.setDate(end.getDate() + (6 - day));
                    end.setHours(23, 59, 59, 999);
                    break;
                case 'month':
                    start.setDate(1);
                    start.setHours(0, 0, 0, 0);
                    end.setMonth(end.getMonth() + 1, 0);
                    end.setHours(23, 59, 59, 999);
                    break;
            }
            
            return { start, end };
        }
    },

    /**
     * 函数工具
     */
    fn: {
        /**
         * Debounces function execution.
         */
        debounce(func, wait = 300, immediate = false) {
            let timeout;
            
            return function executedFunction(...args) {
                const later = () => {
                    timeout = null;
                    if (!immediate) func.apply(this, args);
                };
                
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                
                if (callNow) func.apply(this, args);
            };
        },

        /**
         * Throttles function execution.
         */
        throttle(func, limit = 300) {
            let inThrottle;
            
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        /**
         * Memoizes function results.
         */
        memoize(func, resolver) {
            const cache = new Map();
            
            return function(...args) {
                const key = resolver ? resolver.apply(this, args) : JSON.stringify(args);
                
                if (cache.has(key)) {
                    return cache.get(key);
                }
                
                const result = func.apply(this, args);
                cache.set(key, result);
                
                // 限制缓存大小
                if (cache.size > 100) {
                    const firstKey = cache.keys().next().value;
                    cache.delete(firstKey);
                }
                
                return result;
            };
        },

        /**
         * Retries function execution.
         */
        async retry(func, times = 3, delay = 1000) {
            for (let i = 0; i < times; i++) {
                try {
                    return await func();
                } catch (error) {
                    if (i === times - 1) throw error;
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        },

        /**
         * Composes functions.
         */
        compose(...funcs) {
            return funcs.reduce((a, b) => (...args) => a(b(...args)));
        },

        /**
         * Pipes functions.
         */
        pipe(...funcs) {
            return funcs.reduce((a, b) => (...args) => b(a(...args)));
        }
    },

    /**
     * 安全处理工具
     */
    security: {
        /**
         * Escapes HTML to prevent XSS.
         */
        escapeHtml(str) {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        },

        /**
         * Sanitizes HTML content.
         */
        sanitizeHtml(html, allowedTags = ['b', 'i', 'em', 'strong', 'a']) {
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const walk = (node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (!allowedTags.includes(node.tagName.toLowerCase())) {
                        node.replaceWith(...node.childNodes);
                        return;
                    }
                    
                    // 移除危险属性
                    [...node.attributes].forEach(attr => {
                        if (attr.name.startsWith('on') || attr.name === 'style') {
                            node.removeAttribute(attr.name);
                        }
                    });
                    
                    // 清理href
                    if (node.tagName === 'A' && node.href) {
                        if (!node.href.startsWith('http://') && !node.href.startsWith('https://')) {
                            node.removeAttribute('href');
                        }
                    }
                }
                
                [...node.childNodes].forEach(walk);
            };
            
            walk(doc.body);
            return doc.body.innerHTML;
        },

        /**
         * Generates secure random ID.
         */
        generateId(prefix = '') {
            const timestamp = Date.now().toString(36);
            const random = Math.random().toString(36).substr(2, 9);
            return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`;
        },

        /**
         * Validates input against pattern.
         */
        validate(value, pattern) {
            if (pattern instanceof RegExp) {
                return pattern.test(value);
            }
            
            const patterns = {
                email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                url: /^https?:\/\/.+/,
                phone: /^1[3-9]\d{9}$/,
                number: /^\d+$/,
                alphanumeric: /^[a-zA-Z0-9]+$/
            };
            
            return patterns[pattern]?.test(value) || false;
        }
    },

    /**
     * 性能优化工具
     */
    performance: {
        /**
         * Lazy loads images.
         */
        lazyLoadImages(selector = 'img[data-src]') {
            const images = document.querySelectorAll(selector);
            
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    });
                });
                
                images.forEach(img => imageObserver.observe(img));
            } else {
                // Fallback
                images.forEach(img => {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                });
            }
        },

        /**
         * Virtual scroll implementation.
         */
        virtualScroll(container, items, rowHeight, renderItem) {
            const scrollTop = container.scrollTop;
            const containerHeight = container.clientHeight;
            
            const startIndex = Math.floor(scrollTop / rowHeight);
            const endIndex = Math.ceil((scrollTop + containerHeight) / rowHeight);
            
            const visibleItems = items.slice(startIndex, endIndex);
            const offsetY = startIndex * rowHeight;
            
            container.innerHTML = '';
            
            const wrapper = TaskBoardUtils.dom.createElement('div', {
                style: {
                    transform: `translateY(${offsetY}px)`,
                    height: `${items.length * rowHeight}px`
                }
            });
            
            visibleItems.forEach((item, index) => {
                const element = renderItem(item, startIndex + index);
                element.style.height = `${rowHeight}px`;
                wrapper.appendChild(element);
            });
            
            container.appendChild(wrapper);
        },

        /**
         * Request idle callback polyfill.
         */
        requestIdleCallback: window.requestIdleCallback || function(callback) {
            const start = Date.now();
            return setTimeout(() => {
                callback({
                    didTimeout: false,
                    timeRemaining: () => Math.max(0, 50 - (Date.now() - start))
                });
            }, 1);
        },

        /**
         * Measures function performance.
         */
        measure(name, func) {
            const start = performance.now();
            const result = func();
            const end = performance.now();
            
            console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
            return result;
        },

        /**
         * Creates resource pool.
         */
        createPool(factory, reset, maxSize = 10) {
            const pool = [];
            
            return {
                acquire() {
                    return pool.pop() || factory();
                },
                
                release(item) {
                    if (pool.length < maxSize) {
                        reset(item);
                        pool.push(item);
                    }
                },
                
                clear() {
                    pool.length = 0;
                }
            };
        }
    },

    /**
     * 存储工具
     */
    storage: {
        /**
         * Safe localStorage wrapper.
         */
        local: {
            get(key, defaultValue = null) {
                try {
                    const item = localStorage.getItem(key);
                    return item ? JSON.parse(item) : defaultValue;
                } catch (e) {
                    console.error('Storage get error:', e);
                    return defaultValue;
                }
            },
            
            set(key, value) {
                try {
                    localStorage.setItem(key, JSON.stringify(value));
                    return true;
                } catch (e) {
                    console.error('Storage set error:', e);
                    return false;
                }
            },
            
            remove(key) {
                try {
                    localStorage.removeItem(key);
                    return true;
                } catch (e) {
                    console.error('Storage remove error:', e);
                    return false;
                }
            },
            
            clear() {
                try {
                    localStorage.clear();
                    return true;
                } catch (e) {
                    console.error('Storage clear error:', e);
                    return false;
                }
            }
        },

        /**
         * IndexedDB wrapper.
         */
        async db(name = 'app', version = 1) {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(name, version);
                
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
                
                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains('data')) {
                        db.createObjectStore('data', { keyPath: 'id' });
                    }
                };
            });
        }
    }
};

// 导出到全局
window.TaskBoardUtils = TaskBoardUtils;