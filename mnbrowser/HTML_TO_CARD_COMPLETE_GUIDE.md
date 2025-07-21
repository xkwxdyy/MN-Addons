# 🌉 MarginNote 插件开发：HTML 与卡片数据传输完全指南

> 本教程专为 MarginNote 插件开发新手设计，手把手教你如何在 HTML 页面和 MarginNote 卡片之间建立数据通道，实现双向数据传输。

## 📚 教程结构

本教程分为以下几个部分，循序渐进：

1. **理解数据传输的意义** - 为什么需要 HTML 与卡片连接
2. **基础概念速成** - 快速了解必要的技术概念
3. **单向传输：HTML → 卡片** - 从网页提取数据到卡片
4. **单向传输：卡片 → HTML** - 从卡片发送数据到网页
5. **双向通信实战** - 实现完整的双向数据交互
6. **进阶技巧** - 图片、视频等复杂数据处理
7. **完整项目实战** - 做一个实用的功能
8. **常见问题与调试** - 解决开发中的问题

---

## 第一部分：理解数据传输的意义

### 🤔 为什么需要 HTML 与卡片的连接？

想象一下这些场景：

1. **在线视频学习**
   - 你在 B 站看教学视频
   - 想把某个重要时刻的画面和笔记保存到 MarginNote
   - 传统方法：截图 → 保存 → 导入 → 添加笔记（太麻烦！）
   - 有了数据传输：一键完成！

2. **网页内容收集**
   - 浏览维基百科或技术文档
   - 想把重要段落收集到笔记中
   - 传统方法：复制 → 粘贴 → 格式调整（格式经常乱掉）
   - 有了数据传输：保留原始格式，自动整理！

3. **AI 辅助学习**
   - 想用 AI 解释某个概念
   - 传统方法：复制到 AI → 得到答案 → 再复制回来
   - 有了数据传输：在插件内直接完成！

### 🎯 数据传输能实现什么？

通过建立 HTML 与卡片的数据通道，你可以：

#### 1. 数据采集功能
```
网页 → 插件 → 卡片
```
- 📝 提取网页文字并创建笔记
- 🖼️ 保存网页图片到卡片
- 🎥 截取视频画面作为笔记
- 🔗 保存原始链接和时间戳

#### 2. 数据展示功能
```
卡片 → 插件 → 网页
```
- 📊 在网页中展示笔记统计
- 🔍 实现笔记内容搜索
- 📈 可视化学习进度
- 🎨 自定义笔记展示样式

#### 3. 双向交互功能
```
卡片 ⟷ 插件 ⟷ 网页
```
- ✏️ 在网页中编辑，同步到卡片
- 🔄 卡片修改后，网页实时更新
- 🤖 AI 处理后的内容直接保存
- 📱 实现类似"应用"的交互体验

### 💡 真实案例展示

让我们看看 MNBrowser 插件是如何实现这些功能的：

#### 案例 1：B 站视频笔记
当你在看视频时，插件可以：
1. 获取当前视频的时间戳
2. 截取当前画面
3. 提取视频标题和链接
4. 一键创建包含所有信息的卡片

#### 案例 2：网页文本收集
选中网页文字后，插件可以：
1. 获取选中的文本
2. 保留文本的格式（粗体、斜体等）
3. 自动添加来源信息
4. 创建格式优美的卡片

### 🚀 开始前的准备

在深入技术细节之前，让我们确保你理解整个数据流：

```
用户操作
    ↓
HTML 页面（前端）
    ↓
JavaScript 桥接层
    ↓
插件控制器（后端）
    ↓
MarginNote API
    ↓
笔记卡片
```

每一层都有其作用：
- **HTML 页面**：用户看到和操作的界面
- **JavaScript**：处理用户操作，准备数据
- **插件控制器**：接收数据，调用 MN API
- **MarginNote API**：实际创建和修改卡片

### 📋 本章小结

通过 HTML 与卡片的数据传输，我们可以：
1. ✅ 大幅提升笔记效率
2. ✅ 实现自动化操作
3. ✅ 创建更丰富的交互体验
4. ✅ 整合外部服务（如 AI）

下一章，我们将学习实现这些功能所需的基础概念。如果你已经迫不及待想要开始编码，可以直接跳到第三部分的实战内容！

---

> 💡 **学习建议**：不要试图一次理解所有内容。先有个整体概念，然后通过实践逐步深入。记住，最好的学习方法是动手做！

---

## 第二部分：基础概念速成

### 🌐 什么是 WebView？

想象一下，WebView 就像是在你的插件里嵌入了一个迷你浏览器：

```
┌─────────────────────┐
│   MarginNote 插件    │
│  ┌───────────────┐  │
│  │   WebView     │  │ ← 这里可以显示网页！
│  │ 显示 HTML 内容 │  │
│  └───────────────┘  │
│  [插件的其他部分]    │
└─────────────────────┘
```

#### WebView 的特点：
- 🌏 可以加载任何网页（本地或在线）
- 🎨 支持完整的 HTML/CSS/JavaScript
- 🔗 可以与插件原生代码通信
- 📱 在 iOS 中使用 UIWebView 或 WKWebView

### 🌉 JavaScript 桥接 - 两个世界的对话

插件代码（Objective-C/JavaScript）和网页代码（JavaScript）是两个不同的世界，它们需要一个"桥梁"来通信：

```javascript
// 插件世界（原生 JavaScript）
let selectedText = await webview.evaluateJavaScript(`
    // 网页世界（网页 JavaScript）
    window.getSelection().toString()
`)
```

这就像是：
- 插件世界说："嘿，网页，告诉我用户选中了什么文字"
- 网页世界回答："用户选中了'Hello World'"
- 插件世界收到答案并处理

### 🔑 核心方法：evaluateJavaScript

这是最重要的方法，它让插件能够在网页中执行 JavaScript 代码：

```javascript
// 基本用法
let result = await this.webview.evaluateJavaScript(`1 + 1`)
console.log(result) // 输出: 2

// 获取网页标题
let title = await this.webview.evaluateJavaScript(`document.title`)

// 获取所有图片
let images = await this.webview.evaluateJavaScript(`
    Array.from(document.images).map(img => img.src)
`)
```

#### 重要提示：
1. ⚠️ 代码在网页环境中执行，不能访问插件变量
2. ⚠️ 返回值必须是可序列化的（字符串、数字、数组、对象）
3. ⚠️ 使用反引号 ` ` 可以写多行代码

### 📡 URL Scheme - 网页主动联系插件

除了插件主动询问网页，网页也可以主动联系插件，通过 URL Scheme：

```javascript
// 在网页中
window.location.href = "browser://action?data=hello"

// 在插件中接收
webViewDidFinishLoad: function(webView) {
    let url = webView.request.URL.absoluteString
    if (url.startsWith("browser://")) {
        // 处理来自网页的请求
        let action = this.parseURL(url)
        this.handleAction(action)
    }
}
```

常见的 URL Scheme 模式：
- `browser://copy?text=xxx` - 复制文本
- `browser://screenshot` - 截图
- `browser://close` - 关闭窗口

### 🎯 简单示例：获取网页标题并创建卡片

让我们通过一个完整但简单的例子来理解整个流程：

```javascript
// 步骤 1：在插件中获取网页标题
async function getTitleAndCreateCard() {
    // 执行网页 JavaScript，获取标题
    let title = await this.webview.evaluateJavaScript(`
        document.title
    `)
    
    // 步骤 2：使用 MNUtil 创建卡片
    if (title) {
        // 获取当前笔记本
        let currentNotebook = MNUtil.currentDocController.notebook
        
        // 创建新卡片
        let newNote = MNUtil.createNote(currentNotebook)
        
        // 设置卡片标题
        newNote.noteTitle = title
        
        // 添加到笔记本
        MNUtil.addNoteToDocument(newNote, currentNotebook)
        
        console.log("✅ 成功创建卡片：" + title)
    }
}
```

### 🔄 数据类型转换

在传输数据时，需要注意数据类型的转换：

```javascript
// 1. 简单类型 - 直接传输
let text = await webview.evaluateJavaScript(`"Hello"`) // 字符串
let number = await webview.evaluateJavaScript(`42`)     // 数字
let bool = await webview.evaluateJavaScript(`true`)     // 布尔值

// 2. 复杂类型 - 需要序列化
let data = await webview.evaluateJavaScript(`
    JSON.stringify({
        title: document.title,
        url: window.location.href,
        time: new Date().toISOString()
    })
`)
let parsed = JSON.parse(data) // 解析成对象

// 3. 特殊类型 - Base64 编码
let imageData = await webview.evaluateJavaScript(`
    // 将图片转为 Base64
    let img = document.querySelector('img')
    let canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    let ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
    canvas.toDataURL('image/png')
`)
```

### 📋 本章小结

现在你已经了解了：
1. ✅ WebView 是嵌入的网页浏览器
2. ✅ evaluateJavaScript 让插件执行网页代码
3. ✅ URL Scheme 让网页主动联系插件
4. ✅ 数据需要正确的类型转换

有了这些基础知识，我们就可以开始实战了！

---

## 第三部分：单向传输 HTML → 卡片

### 🎯 本章目标

学完本章，你将能够：
- 从网页提取各种数据（文本、图片、视频）
- 将数据转换为合适的格式
- 创建包含这些数据的卡片
- 处理各种边界情况

### 📝 提取网页文本

#### 1. 获取用户选中的文本

这是最常见的需求，用户选中一段文字后提取：

```javascript
// 在 webviewController.js 中
async getSelectedText() {
    let selectedText = await this.webview.evaluateJavaScript(`
        // 获取选中的文本
        let selection = window.getSelection()
        let text = selection.toString()
        
        // 如果没有选中文本，返回空
        if (!text) {
            ''
        } else {
            // 返回选中的文本和一些额外信息
            JSON.stringify({
                text: text,
                html: selection.rangeCount > 0 ? 
                      selection.getRangeAt(0).cloneContents().textContent : '',
                url: window.location.href,
                title: document.title
            })
        }
    `)
    
    // 解析返回的数据
    if (selectedText) {
        return JSON.parse(selectedText)
    }
    return null
}

// 使用示例
async function createNoteFromSelection() {
    let data = await this.getSelectedText()
    if (data && data.text) {
        // 创建卡片
        let note = MNUtil.createNote(MNUtil.currentNotebook)
        note.noteTitle = data.text.substring(0, 50) // 前50个字符作为标题
        note.noteText = data.text
        
        // 添加来源信息作为评论
        note.appendMarkdownComment(`来源：[${data.title}](${data.url})`)
        
        MNUtil.showHUD("✅ 已创建卡片")
    }
}
```

#### 2. 获取特定元素的内容

有时我们需要获取特定的内容，比如文章标题、作者等：

```javascript
async getArticleInfo() {
    let info = await this.webview.evaluateJavaScript(`
        // 尝试多种方式获取标题
        let title = document.querySelector('h1')?.innerText || 
                   document.querySelector('.article-title')?.innerText ||
                   document.title
        
        // 获取作者（根据网站结构调整选择器）
        let author = document.querySelector('.author')?.innerText ||
                    document.querySelector('[class*="author"]')?.innerText ||
                    '未知作者'
        
        // 获取发布时间
        let time = document.querySelector('.publish-time')?.innerText ||
                   document.querySelector('time')?.innerText ||
                   new Date().toLocaleDateString()
        
        // 获取正文
        let content = document.querySelector('article')?.innerText ||
                     document.querySelector('.content')?.innerText ||
                     document.body.innerText
        
        JSON.stringify({
            title: title,
            author: author,
            time: time,
            content: content.substring(0, 1000), // 限制长度
            url: window.location.href
        })
    `)
    
    return JSON.parse(info)
}
```

### 🖼️ 提取网页图片

#### 1. 获取单张图片

```javascript
async getImageAsBase64(imageUrl) {
    let base64 = await this.webview.evaluateJavaScript(`
        new Promise((resolve) => {
            let img = new Image()
            img.crossOrigin = 'anonymous' // 处理跨域
            img.onload = function() {
                // 创建 canvas
                let canvas = document.createElement('canvas')
                canvas.width = this.width
                canvas.height = this.height
                
                // 绘制图片
                let ctx = canvas.getContext('2d')
                ctx.drawImage(this, 0, 0)
                
                // 转为 Base64
                let dataURL = canvas.toDataURL('image/png')
                resolve(dataURL)
            }
            img.onerror = function() {
                resolve(null)
            }
            img.src = '${imageUrl}'
        })
    `)
    
    return base64
}

// 创建包含图片的卡片
async function createImageNote(imageUrl) {
    let base64 = await this.getImageAsBase64(imageUrl)
    if (base64) {
        let note = MNUtil.createNote(MNUtil.currentNotebook)
        note.noteTitle = "网页图片"
        
        // 使用 Markdown 格式插入图片
        note.appendMarkdownComment(`![image](${base64})`)
        
        // 添加原始链接
        note.appendTextComment(`原始链接：${imageUrl}`)
    }
}
```

#### 2. 批量获取页面所有图片

```javascript
async getAllImages() {
    let images = await this.webview.evaluateJavaScript(`
        // 获取所有图片元素
        let imgs = Array.from(document.querySelectorAll('img'))
        
        // 过滤并获取信息
        imgs.filter(img => img.src && img.width > 100) // 过滤小图片
            .map(img => ({
                src: img.src,
                alt: img.alt || '无描述',
                width: img.width,
                height: img.height
            }))
    `)
    
    return images
}
```

### 🎥 处理视频截图

这是 MNBrowser 的特色功能，让我们看看如何实现：

```javascript
async captureVideoFrame() {
    let videoInfo = await this.webview.evaluateJavaScript(`
        // 查找视频元素
        let video = document.querySelector('video')
        if (!video) {
            null
        } else {
            // 创建 canvas 截图
            let canvas = document.createElement('canvas')
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            
            let ctx = canvas.getContext('2d')
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
            
            // 获取视频信息
            JSON.stringify({
                screenshot: canvas.toDataURL('image/png'),
                currentTime: video.currentTime,
                duration: video.duration,
                title: document.title,
                url: window.location.href
            })
        }
    `)
    
    if (videoInfo) {
        let data = JSON.parse(videoInfo)
        
        // 创建视频笔记卡片
        let note = MNUtil.createNote(MNUtil.currentNotebook)
        note.noteTitle = `${data.title} - ${this.formatTime(data.currentTime)}`
        
        // 添加截图
        note.appendMarkdownComment(`![screenshot](${data.screenshot})`)
        
        // 添加时间戳链接（如果是 B 站）
        if (data.url.includes('bilibili.com')) {
            let timeUrl = `${data.url}?t=${Math.floor(data.currentTime)}`
            note.appendMarkdownComment(`[跳转到 ${this.formatTime(data.currentTime)}](${timeUrl})`)
        }
    }
}

// 格式化时间
formatTime(seconds) {
    let h = Math.floor(seconds / 3600)
    let m = Math.floor((seconds % 3600) / 60)
    let s = Math.floor(seconds % 60)
    
    if (h > 0) {
        return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    } else {
        return `${m}:${s.toString().padStart(2, '0')}`
    }
}
```

### 🔧 完整的数据提取流程

让我们整合上面的知识，创建一个完整的数据提取和卡片创建流程：

```javascript
// 主控制器类
class DataExtractor {
    constructor(webview) {
        this.webview = webview
    }
    
    // 智能提取网页内容
    async smartExtract() {
        let result = await this.webview.evaluateJavaScript(`
            // 检测页面类型
            let pageType = 'unknown'
            let data = {}
            
            // 检测视频网站
            if (window.location.host.includes('bilibili.com') || 
                window.location.host.includes('youtube.com')) {
                pageType = 'video'
                let video = document.querySelector('video')
                if (video) {
                    // 截取当前画面
                    let canvas = document.createElement('canvas')
                    canvas.width = video.videoWidth
                    canvas.height = video.videoHeight
                    canvas.getContext('2d').drawImage(video, 0, 0)
                    
                    data = {
                        type: 'video',
                        screenshot: canvas.toDataURL('image/png'),
                        currentTime: video.currentTime,
                        title: document.title,
                        url: window.location.href
                    }
                }
            }
            
            // 检测文章页面
            else if (document.querySelector('article') || 
                     document.querySelector('.post-content')) {
                pageType = 'article'
                data = {
                    type: 'article',
                    title: document.querySelector('h1')?.innerText || document.title,
                    content: document.querySelector('article')?.innerText || '',
                    author: document.querySelector('.author')?.innerText || '',
                    url: window.location.href
                }
            }
            
            // 默认：获取选中文本
            else {
                let selection = window.getSelection().toString()
                if (selection) {
                    data = {
                        type: 'selection',
                        text: selection,
                        title: document.title,
                        url: window.location.href
                    }
                }
            }
            
            JSON.stringify(data)
        `)
        
        return JSON.parse(result)
    }
    
    // 根据提取的数据创建卡片
    async createNoteFromData(data) {
        if (!data || !data.type) return
        
        let note = MNUtil.createNote(MNUtil.currentNotebook)
        
        switch (data.type) {
            case 'video':
                note.noteTitle = `📹 ${data.title}`
                note.appendMarkdownComment(`![视频截图](${data.screenshot})`)
                note.appendMarkdownComment(`⏱ 时间：${this.formatTime(data.currentTime)}`)
                note.appendMarkdownComment(`🔗 [查看原视频](${data.url})`)
                break
                
            case 'article':
                note.noteTitle = `📰 ${data.title}`
                note.noteText = data.content.substring(0, 500) + '...'
                note.appendMarkdownComment(`👤 作者：${data.author}`)
                note.appendMarkdownComment(`🔗 [阅读原文](${data.url})`)
                break
                
            case 'selection':
                note.noteTitle = data.text.substring(0, 50)
                note.noteText = data.text
                note.appendMarkdownComment(`📄 来源：[${data.title}](${data.url})`)
                break
        }
        
        MNUtil.showHUD(`✅ 已创建${this.getTypeEmoji(data.type)}笔记`)
    }
    
    getTypeEmoji(type) {
        const emojis = {
            'video': '视频',
            'article': '文章',
            'selection': '文本'
        }
        return emojis[type] || '普通'
    }
}
```

### 💡 实战技巧总结

1. **错误处理很重要**
   ```javascript
   try {
       let data = await this.webview.evaluateJavaScript(`...`)
       // 处理数据
   } catch (error) {
       console.error("提取数据失败：", error)
       MNUtil.showHUD("❌ 提取失败，请重试")
   }
   ```

2. **处理异步操作**
   ```javascript
   // 在 evaluateJavaScript 中使用 Promise
   let result = await this.webview.evaluateJavaScript(`
       new Promise((resolve) => {
           // 异步操作
           setTimeout(() => resolve('done'), 1000)
       })
   `)
   ```

3. **数据大小限制**
   - Base64 图片会比原图大 30% 左右
   - 避免一次传输过大的数据
   - 可以分批传输或压缩

4. **跨域问题处理**
   - 使用 `crossOrigin = 'anonymous'`
   - 或者通过代理服务器
   - 或者让用户手动保存

### 📋 本章小结

现在你已经掌握了从 HTML 提取数据到卡片的完整流程：
1. ✅ 使用 evaluateJavaScript 执行网页代码
2. ✅ 提取文本、图片、视频等各种数据
3. ✅ 将数据转换为合适的格式（JSON、Base64）
4. ✅ 使用 MNUtil API 创建和编辑卡片
5. ✅ 处理各种边界情况和错误

下一章，我们将学习反向的数据流：如何从卡片传输数据到 HTML 页面。

---

## 第四部分：单向传输 卡片 → HTML

### 🎯 本章目标

学完本章，你将能够：
- 读取 MarginNote 卡片的各种数据
- 将卡片数据传递到网页中
- 在网页中动态展示卡片内容
- 实现卡片数据的可视化

### 📖 读取卡片数据

#### 1. 获取当前选中的卡片

```javascript
// 获取当前焦点卡片
function getCurrentNote() {
    // 方法 1：获取当前选中的卡片
    let focusNote = MNNote.getFocusNote()
    if (!focusNote) {
        MNUtil.showHUD("❌ 请先选择一个卡片")
        return null
    }
    
    // 提取卡片的基本信息
    let noteData = {
        id: focusNote.noteId,
        title: focusNote.noteTitle || "无标题",
        text: focusNote.noteText || "",
        createTime: focusNote.createDate.getTime(),
        modifyTime: focusNote.modifyDate.getTime(),
        colorIndex: focusNote.colorIndex,
        // 获取所有评论
        comments: focusNote.comments.map(comment => ({
            type: comment.type, // 文本、链接、图片等
            text: comment.text || ""
        }))
    }
    
    return noteData
}
```

#### 2. 批量获取卡片数据

```javascript
// 获取当前笔记本的所有卡片
function getAllNotes() {
    let notebook = MNUtil.currentNotebook
    if (!notebook) return []
    
    // 获取所有卡片
    let allNotes = notebook.notes
    
    // 转换为可传输的格式
    return allNotes.map(note => ({
        id: note.noteId,
        title: note.noteTitle || "",
        text: note.noteText || "",
        parentId: note.parentNote?.noteId || null,
        childCount: note.childNotes.length,
        hasImage: note.comments.some(c => c.type === "image"),
        colorIndex: note.colorIndex,
        tags: note.linkedNotes.filter(n => n.noteTitle?.startsWith("#"))
                              .map(n => n.noteTitle)
    }))
}

// 获取特定条件的卡片
function getFilteredNotes(filter) {
    let notebook = MNUtil.currentNotebook
    if (!notebook) return []
    
    return notebook.notes.filter(note => {
        // 根据颜色筛选
        if (filter.color !== undefined && note.colorIndex !== filter.color) {
            return false
        }
        
        // 根据标签筛选
        if (filter.tag && !note.noteTitle?.includes(filter.tag)) {
            return false
        }
        
        // 根据创建时间筛选
        if (filter.afterDate && note.createDate.getTime() < filter.afterDate) {
            return false
        }
        
        return true
    }).map(note => ({
        id: note.noteId,
        title: note.noteTitle || "",
        text: note.noteText || ""
    }))
}
```

### 🚀 将数据传递到网页

#### 1. 直接注入数据

最简单的方法是直接将数据注入到网页的全局变量中：

```javascript
async function sendDataToWebView(data) {
    // 将数据转为 JSON 字符串
    let jsonData = JSON.stringify(data)
    
    // 注入到网页
    await this.webview.evaluateJavaScript(`
        // 在网页中创建全局变量
        window.MNData = ${jsonData};
        
        // 触发自定义事件，通知网页数据已更新
        window.dispatchEvent(new CustomEvent('MNDataUpdated', {
            detail: window.MNData
        }));
        
        // 返回确认
        'Data injected successfully'
    `)
}

// 使用示例
async function updateWebViewWithCurrentNote() {
    let noteData = getCurrentNote()
    if (noteData) {
        await sendDataToWebView(noteData)
        MNUtil.showHUD("✅ 数据已发送到网页")
    }
}
```

#### 2. 通过函数调用传递

更灵活的方法是在网页中定义接收函数，然后从插件调用：

```javascript
// 首先，在网页中定义接收函数
let webPageCode = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>卡片数据展示</title>
    <style>
        .note-card {
            border: 1px solid #ddd;
            padding: 15px;
            margin: 10px;
            border-radius: 8px;
            background: white;
        }
        .note-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .note-text {
            color: #666;
            white-space: pre-wrap;
        }
    </style>
</head>
<body>
    <div id="container"></div>
    
    <script>
        // 定义接收数据的函数
        window.receiveNoteData = function(noteData) {
            const container = document.getElementById('container');
            container.innerHTML = ''; // 清空容器
            
            // 显示单个卡片
            if (!Array.isArray(noteData)) {
                noteData = [noteData];
            }
            
            // 渲染每个卡片
            noteData.forEach(note => {
                const card = document.createElement('div');
                card.className = 'note-card';
                card.innerHTML = \`
                    <div class="note-title">\${note.title || '无标题'}</div>
                    <div class="note-text">\${note.text || '无内容'}</div>
                    <div class="note-meta">
                        创建时间：\${new Date(note.createTime).toLocaleString()}
                    </div>
                \`;
                container.appendChild(card);
            });
            
            return 'Rendered ' + noteData.length + ' notes';
        };
        
        // 定义更新统计信息的函数
        window.updateStats = function(stats) {
            document.getElementById('stats').innerHTML = \`
                总卡片数：\${stats.total}<br>
                今日创建：\${stats.todayCount}<br>
                带图片的：\${stats.withImages}
            \`;
        };
    </script>
</body>
</html>
`;

// 在插件中调用网页函数
async function sendNoteToWebView(note) {
    let noteData = {
        id: note.noteId,
        title: note.noteTitle,
        text: note.noteText,
        createTime: note.createDate.getTime()
    };
    
    // 调用网页中的函数
    let result = await this.webview.evaluateJavaScript(`
        window.receiveNoteData(${JSON.stringify(noteData)})
    `);
    
    console.log("网页返回：", result);
}
```

### 📊 在网页中展示卡片数据

#### 1. 创建交互式卡片列表

```javascript
// 完整的 HTML 页面示例
let interactiveHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>我的笔记管理器</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .search-box {
            padding: 8px 15px;
            border: 1px solid #ddd;
            border-radius: 20px;
            width: 300px;
        }
        
        .note-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 15px;
        }
        
        .note-card {
            background: white;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .note-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        
        .note-card.selected {
            border: 2px solid #007aff;
        }
        
        .color-indicator {
            width: 100%;
            height: 4px;
            margin: -15px -15px 10px -15px;
            border-radius: 8px 8px 0 0;
        }
        
        .color-0 { background: #ff6b6b; }
        .color-1 { background: #4ecdc4; }
        .color-2 { background: #45b7d1; }
        .color-3 { background: #96ceb4; }
        .color-4 { background: #feca57; }
        
        .stats-panel {
            background: white;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        
        .action-buttons {
            position: fixed;
            bottom: 20px;
            right: 20px;
            display: flex;
            gap: 10px;
        }
        
        .btn {
            padding: 10px 20px;
            background: #007aff;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
        }
        
        .btn:hover {
            background: #0051a8;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>我的笔记</h1>
        <input type="text" class="search-box" placeholder="搜索笔记..." id="searchBox">
    </div>
    
    <div class="stats-panel" id="statsPanel">
        加载中...
    </div>
    
    <div class="note-grid" id="noteGrid"></div>
    
    <div class="action-buttons">
        <button class="btn" onclick="refreshNotes()">刷新</button>
        <button class="btn" onclick="exportSelected()">导出选中</button>
    </div>
    
    <script>
        let allNotes = [];
        let selectedNotes = new Set();
        
        // 接收笔记数据
        window.receiveNotes = function(notes) {
            allNotes = notes;
            renderNotes(notes);
            updateStats();
        };
        
        // 渲染笔记
        function renderNotes(notes) {
            const grid = document.getElementById('noteGrid');
            grid.innerHTML = '';
            
            notes.forEach(note => {
                const card = createNoteCard(note);
                grid.appendChild(card);
            });
        }
        
        // 创建卡片元素
        function createNoteCard(note) {
            const card = document.createElement('div');
            card.className = 'note-card';
            if (selectedNotes.has(note.id)) {
                card.className += ' selected';
            }
            
            card.innerHTML = \`
                <div class="color-indicator color-\${note.colorIndex || 0}"></div>
                <h3>\${note.title || '无标题'}</h3>
                <p>\${note.text ? note.text.substring(0, 100) + '...' : '无内容'}</p>
                <div style="margin-top: 10px; font-size: 12px; color: #999;">
                    \${note.childCount || 0} 个子笔记
                    \${note.hasImage ? '📎' : ''}
                </div>
            \`;
            
            card.onclick = () => toggleSelect(note.id, card);
            
            return card;
        }
        
        // 切换选中状态
        function toggleSelect(noteId, card) {
            if (selectedNotes.has(noteId)) {
                selectedNotes.delete(noteId);
                card.classList.remove('selected');
            } else {
                selectedNotes.add(noteId);
                card.classList.add('selected');
            }
        }
        
        // 搜索功能
        document.getElementById('searchBox').oninput = function(e) {
            const keyword = e.target.value.toLowerCase();
            const filtered = allNotes.filter(note => 
                (note.title && note.title.toLowerCase().includes(keyword)) ||
                (note.text && note.text.toLowerCase().includes(keyword))
            );
            renderNotes(filtered);
        };
        
        // 更新统计信息
        function updateStats() {
            const today = new Date().setHours(0, 0, 0, 0);
            const todayNotes = allNotes.filter(n => n.createTime >= today);
            
            document.getElementById('statsPanel').innerHTML = \`
                <div style="display: flex; justify-content: space-around;">
                    <div>
                        <div style="font-size: 24px; font-weight: bold;">\${allNotes.length}</div>
                        <div style="color: #666;">总笔记数</div>
                    </div>
                    <div>
                        <div style="font-size: 24px; font-weight: bold;">\${todayNotes.length}</div>
                        <div style="color: #666;">今日新增</div>
                    </div>
                    <div>
                        <div style="font-size: 24px; font-weight: bold;">\${selectedNotes.size}</div>
                        <div style="color: #666;">已选中</div>
                    </div>
                </div>
            \`;
        }
        
        // 刷新数据
        function refreshNotes() {
            // 通知插件请求新数据
            window.location.href = 'browser://refresh-notes';
        }
        
        // 导出选中的笔记
        function exportSelected() {
            if (selectedNotes.size === 0) {
                alert('请先选择要导出的笔记');
                return;
            }
            
            const selectedData = allNotes.filter(n => selectedNotes.has(n.id));
            window.location.href = 'browser://export?data=' + 
                encodeURIComponent(JSON.stringify(selectedData));
        }
    </script>
</body>
</html>
`;
```

#### 2. 实时更新机制

```javascript
// 在插件中设置定时更新
class NoteDataSync {
    constructor(webview) {
        this.webview = webview;
        this.syncInterval = null;
    }
    
    // 开始同步
    startSync(intervalMs = 5000) {
        this.syncInterval = setInterval(() => {
            this.syncNotes();
        }, intervalMs);
        
        // 立即执行一次
        this.syncNotes();
    }
    
    // 停止同步
    stopSync() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
    }
    
    // 同步笔记数据
    async syncNotes() {
        try {
            // 获取所有笔记
            let notes = getAllNotes();
            
            // 发送到网页
            await this.webview.evaluateJavaScript(`
                if (window.receiveNotes) {
                    window.receiveNotes(${JSON.stringify(notes)});
                }
            `);
        } catch (error) {
            console.error("同步失败：", error);
        }
    }
    
    // 监听笔记变化
    watchNoteChanges() {
        // 监听笔记创建
        NSNotificationCenter.defaultCenter().addObserverSelectorName(
            this,
            'onNoteCreated:',
            'MNNoteCreatedNotification'
        );
        
        // 监听笔记修改
        NSNotificationCenter.defaultCenter().addObserverSelectorName(
            this,
            'onNoteModified:',
            'MNNoteModifiedNotification'
        );
    }
    
    // 笔记创建时立即同步
    onNoteCreated(notification) {
        this.syncNotes();
    }
    
    // 笔记修改时立即同步
    onNoteModified(notification) {
        // 延迟一下避免频繁更新
        if (this.updateTimer) {
            clearTimeout(this.updateTimer);
        }
        this.updateTimer = setTimeout(() => {
            this.syncNotes();
        }, 500);
    }
}
```

### 💡 实战案例：笔记统计仪表板

让我们创建一个完整的笔记统计仪表板：

```javascript
// 获取详细的统计数据
function getNoteStatistics() {
    let notebook = MNUtil.currentNotebook;
    if (!notebook) return null;
    
    let notes = notebook.notes;
    let now = new Date();
    let today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    let thisWeek = today - (7 * 24 * 60 * 60 * 1000);
    let thisMonth = today - (30 * 24 * 60 * 60 * 1000);
    
    // 统计数据
    let stats = {
        total: notes.length,
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
        byColor: {},
        byTag: {},
        withImages: 0,
        withLinks: 0,
        averageLength: 0,
        topTags: []
    };
    
    let totalLength = 0;
    let tagCount = {};
    
    notes.forEach(note => {
        let createTime = note.createDate.getTime();
        
        // 时间统计
        if (createTime >= today) stats.today++;
        if (createTime >= thisWeek) stats.thisWeek++;
        if (createTime >= thisMonth) stats.thisMonth++;
        
        // 颜色统计
        let color = note.colorIndex || 0;
        stats.byColor[color] = (stats.byColor[color] || 0) + 1;
        
        // 内容统计
        totalLength += (note.noteText || '').length;
        
        // 评论类型统计
        note.comments.forEach(comment => {
            if (comment.type === 'image') stats.withImages++;
            if (comment.type === 'link') stats.withLinks++;
        });
        
        // 标签统计
        let tags = (note.noteTitle || '').match(/#\w+/g) || [];
        tags.forEach(tag => {
            tagCount[tag] = (tagCount[tag] || 0) + 1;
        });
    });
    
    // 计算平均长度
    stats.averageLength = Math.round(totalLength / notes.length) || 0;
    
    // 获取热门标签
    stats.topTags = Object.entries(tagCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([tag, count]) => ({ tag, count }));
    
    return stats;
}

// 创建可视化仪表板
let dashboardHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>笔记统计仪表板</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f0f2f5;
        }
        
        .dashboard {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }
        
        .card {
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .metric {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .metric-value {
            font-size: 32px;
            font-weight: bold;
            color: #1890ff;
        }
        
        .metric-label {
            color: #666;
        }
        
        .chart-container {
            position: relative;
            height: 300px;
        }
        
        .tag-cloud {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        .tag {
            background: #e6f7ff;
            color: #1890ff;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <h1>笔记统计仪表板</h1>
    
    <div class="dashboard">
        <!-- 基础统计 -->
        <div class="card">
            <h3>基础统计</h3>
            <div class="metric">
                <span class="metric-label">总笔记数</span>
                <span class="metric-value" id="totalNotes">0</span>
            </div>
            <div class="metric">
                <span class="metric-label">今日新增</span>
                <span class="metric-value" id="todayNotes">0</span>
            </div>
            <div class="metric">
                <span class="metric-label">本周新增</span>
                <span class="metric-value" id="weekNotes">0</span>
            </div>
        </div>
        
        <!-- 颜色分布图 -->
        <div class="card">
            <h3>颜色分布</h3>
            <div class="chart-container">
                <canvas id="colorChart"></canvas>
            </div>
        </div>
        
        <!-- 热门标签 -->
        <div class="card">
            <h3>热门标签</h3>
            <div class="tag-cloud" id="tagCloud"></div>
        </div>
        
        <!-- 内容统计 -->
        <div class="card">
            <h3>内容统计</h3>
            <div class="metric">
                <span class="metric-label">平均长度</span>
                <span class="metric-value" id="avgLength">0</span>
            </div>
            <div class="metric">
                <span class="metric-label">含图片</span>
                <span class="metric-value" id="withImages">0</span>
            </div>
            <div class="metric">
                <span class="metric-label">含链接</span>
                <span class="metric-value" id="withLinks">0</span>
            </div>
        </div>
    </div>
    
    <script>
        let colorChart = null;
        
        // 接收统计数据
        window.updateStats = function(stats) {
            // 更新基础统计
            document.getElementById('totalNotes').textContent = stats.total;
            document.getElementById('todayNotes').textContent = stats.today;
            document.getElementById('weekNotes').textContent = stats.thisWeek;
            
            // 更新内容统计
            document.getElementById('avgLength').textContent = stats.averageLength;
            document.getElementById('withImages').textContent = stats.withImages;
            document.getElementById('withLinks').textContent = stats.withLinks;
            
            // 更新颜色分布图
            updateColorChart(stats.byColor);
            
            // 更新标签云
            updateTagCloud(stats.topTags);
        };
        
        // 更新颜色分布图
        function updateColorChart(colorData) {
            const ctx = document.getElementById('colorChart').getContext('2d');
            
            if (colorChart) {
                colorChart.destroy();
            }
            
            const colors = [
                '#ff6b6b', '#4ecdc4', '#45b7d1', 
                '#96ceb4', '#feca57', '#ff9ff3'
            ];
            
            colorChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(colorData).map(i => '颜色 ' + i),
                    datasets: [{
                        data: Object.values(colorData),
                        backgroundColor: colors
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
        
        // 更新标签云
        function updateTagCloud(tags) {
            const cloud = document.getElementById('tagCloud');
            cloud.innerHTML = '';
            
            tags.forEach(item => {
                const tag = document.createElement('div');
                tag.className = 'tag';
                tag.textContent = item.tag + ' (' + item.count + ')';
                cloud.appendChild(tag);
            });
        }
    </script>
</body>
</html>
`;
```

### 📋 本章小结

现在你已经掌握了从卡片传输数据到 HTML 的完整流程：
1. ✅ 读取各种卡片数据（单个、批量、筛选）
2. ✅ 通过 evaluateJavaScript 传递数据到网页
3. ✅ 在网页中创建交互式界面展示数据
4. ✅ 实现实时同步和自动更新
5. ✅ 创建数据可视化仪表板

---

## 第五部分：双向通信实战

### 🎯 本章目标

学完本章，你将能够：
- 建立完整的双向通信机制
- 实现网页和卡片的实时同步
- 处理复杂的交互场景
- 构建一个完整的任务管理系统

### 🔄 双向通信架构

#### 1. 通信流程设计

```javascript
// 定义通信协议
const Protocol = {
    // 从插件到网页的消息类型
    TO_WEB: {
        INIT: 'init',           // 初始化
        UPDATE_NOTE: 'updateNote', // 更新卡片
        DELETE_NOTE: 'deleteNote', // 删除卡片
        SYNC_ALL: 'syncAll'     // 同步所有数据
    },
    
    // 从网页到插件的消息类型
    TO_PLUGIN: {
        CREATE_NOTE: 'browser://create-note',
        UPDATE_NOTE: 'browser://update-note',
        DELETE_NOTE: 'browser://delete-note',
        GET_NOTES: 'browser://get-notes'
    }
};

// 消息处理器基类
class MessageHandler {
    constructor(webview) {
        this.webview = webview;
        this.handlers = new Map();
    }
    
    // 注册消息处理器
    on(messageType, handler) {
        this.handlers.set(messageType, handler);
    }
    
    // 发送消息到网页
    async send(type, data) {
        try {
            await this.webview.evaluateJavaScript(`
                if (window.handleMessage) {
                    window.handleMessage('${type}', ${JSON.stringify(data)});
                }
            `);
        } catch (error) {
            console.error("发送消息失败：", error);
        }
    }
    
    // 处理来自网页的消息
    handleWebMessage(url) {
        try {
            let urlObj = new URL(url);
            let action = urlObj.pathname.replace('//', '');
            let params = Object.fromEntries(urlObj.searchParams);
            
            let handler = this.handlers.get(action);
            if (handler) {
                handler(params);
            }
        } catch (error) {
            console.error("处理消息失败：", error);
        }
    }
}
```

#### 2. 网页端通信框架

```javascript
// 网页端的通信管理器
let webCommunicator = `
<script>
class WebCommunicator {
    constructor() {
        this.handlers = new Map();
        this.pendingRequests = new Map();
        this.requestId = 0;
        
        // 设置全局消息处理器
        window.handleMessage = this.handleMessage.bind(this);
    }
    
    // 注册消息处理器
    on(messageType, handler) {
        this.handlers.set(messageType, handler);
    }
    
    // 发送消息到插件
    send(action, data) {
        const url = action + '?' + new URLSearchParams(data).toString();
        window.location.href = url;
    }
    
    // 发送请求并等待响应
    async request(action, data) {
        return new Promise((resolve, reject) => {
            const id = ++this.requestId;
            this.pendingRequests.set(id, { resolve, reject });
            
            // 添加请求ID
            data.requestId = id;
            this.send(action, data);
            
            // 超时处理
            setTimeout(() => {
                if (this.pendingRequests.has(id)) {
                    this.pendingRequests.delete(id);
                    reject(new Error('Request timeout'));
                }
            }, 5000);
        });
    }
    
    // 处理来自插件的消息
    handleMessage(type, data) {
        // 检查是否是响应消息
        if (data.requestId && this.pendingRequests.has(data.requestId)) {
            const { resolve } = this.pendingRequests.get(data.requestId);
            this.pendingRequests.delete(data.requestId);
            resolve(data);
            return;
        }
        
        // 处理普通消息
        const handler = this.handlers.get(type);
        if (handler) {
            handler(data);
        }
    }
}

// 创建全局通信实例
const comm = new WebCommunicator();
</script>
`;
```

### 🏗️ 完整示例：任务管理系统

让我们创建一个完整的任务管理系统，展示双向通信的强大功能：

#### 1. 插件端实现

```javascript
// TaskManager.js - 任务管理器插件
class TaskManager {
    constructor() {
        this.webview = null;
        this.messageHandler = null;
        this.initWebView();
    }
    
    // 初始化 WebView
    initWebView() {
        // 创建 WebView
        this.webview = UIWebView.new();
        this.webview.frame = { x: 0, y: 0, width: 400, height: 600 };
        
        // 加载 HTML
        this.webview.loadHTMLStringBaseURL(this.getHTML(), null);
        
        // 初始化消息处理器
        this.messageHandler = new MessageHandler(this.webview);
        this.setupMessageHandlers();
    }
    
    // 设置消息处理器
    setupMessageHandlers() {
        // 创建任务
        this.messageHandler.on('create-task', async (params) => {
            let task = await this.createTask(params);
            // 发送创建成功的消息
            this.messageHandler.send('taskCreated', task);
        });
        
        // 更新任务
        this.messageHandler.on('update-task', async (params) => {
            let success = await this.updateTask(params.id, params);
            this.messageHandler.send('taskUpdated', { 
                id: params.id, 
                success 
            });
        });
        
        // 获取所有任务
        this.messageHandler.on('get-tasks', async () => {
            let tasks = await this.getAllTasks();
            this.messageHandler.send('tasksLoaded', tasks);
        });
        
        // 删除任务
        this.messageHandler.on('delete-task', async (params) => {
            let success = await this.deleteTask(params.id);
            if (success) {
                this.messageHandler.send('taskDeleted', { id: params.id });
            }
        });
    }
    
    // 创建任务（在 MarginNote 中创建卡片）
    async createTask(taskData) {
        let note = MNUtil.createNote(MNUtil.currentNotebook);
        
        // 设置任务标题
        note.noteTitle = `📋 ${taskData.title}`;
        
        // 添加任务详情
        note.appendTextComment(`状态：${taskData.status || '待办'}`);
        note.appendTextComment(`优先级：${taskData.priority || '中'}`);
        note.appendTextComment(`截止日期：${taskData.dueDate || '无'}`);
        
        if (taskData.description) {
            note.appendTextComment(`描述：${taskData.description}`);
        }
        
        // 设置颜色
        const priorityColors = { '高': 0, '中': 2, '低': 4 };
        note.colorIndex = priorityColors[taskData.priority] || 2;
        
        return {
            id: note.noteId,
            title: taskData.title,
            status: taskData.status,
            priority: taskData.priority,
            dueDate: taskData.dueDate,
            description: taskData.description
        };
    }
    
    // 更新任务
    async updateTask(noteId, updates) {
        let note = MNDatabase.sharedInstance().getNoteById(noteId);
        if (!note) return false;
        
        // 更新标题
        if (updates.title) {
            note.noteTitle = `📋 ${updates.title}`;
        }
        
        // 更新评论中的字段
        let comments = note.comments;
        for (let i = 0; i < comments.length; i++) {
            let comment = comments[i];
            if (comment.text.startsWith('状态：') && updates.status) {
                comment.text = `状态：${updates.status}`;
            }
            if (comment.text.startsWith('优先级：') && updates.priority) {
                comment.text = `优先级：${updates.priority}`;
                // 更新颜色
                const priorityColors = { '高': 0, '中': 2, '低': 4 };
                note.colorIndex = priorityColors[updates.priority] || 2;
            }
        }
        
        return true;
    }
    
    // 获取所有任务
    async getAllTasks() {
        let notebook = MNUtil.currentNotebook;
        if (!notebook) return [];
        
        // 筛选任务卡片（标题以📋开头）
        let taskNotes = notebook.notes.filter(note => 
            note.noteTitle && note.noteTitle.startsWith('📋')
        );
        
        return taskNotes.map(note => {
            let task = {
                id: note.noteId,
                title: note.noteTitle.replace('📋 ', ''),
                status: '待办',
                priority: '中',
                dueDate: null,
                description: ''
            };
            
            // 从评论中提取信息
            note.comments.forEach(comment => {
                if (comment.text.startsWith('状态：')) {
                    task.status = comment.text.replace('状态：', '');
                }
                if (comment.text.startsWith('优先级：')) {
                    task.priority = comment.text.replace('优先级：', '');
                }
                if (comment.text.startsWith('截止日期：')) {
                    task.dueDate = comment.text.replace('截止日期：', '');
                }
                if (comment.text.startsWith('描述：')) {
                    task.description = comment.text.replace('描述：', '');
                }
            });
            
            return task;
        });
    }
    
    // 删除任务
    async deleteTask(noteId) {
        let note = MNDatabase.sharedInstance().getNoteById(noteId);
        if (!note) return false;
        
        MNUtil.removeNoteFromDocument(note);
        return true;
    }
    
    // 获取 HTML 内容
    getHTML() {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>任务管理器</title>
    <style>
        * {
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f7fa;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }
        
        .add-task-form {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        
        .form-group {
            margin-bottom: 15px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
        }
        
        .task-list {
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .task-item {
            padding: 15px 20px;
            border-bottom: 1px solid #eee;
            display: flex;
            align-items: center;
            transition: background 0.2s;
        }
        
        .task-item:hover {
            background: #f8f9fa;
        }
        
        .task-checkbox {
            margin-right: 15px;
        }
        
        .task-content {
            flex: 1;
        }
        
        .task-title {
            font-weight: 500;
            margin-bottom: 5px;
        }
        
        .task-meta {
            font-size: 12px;
            color: #666;
        }
        
        .task-actions {
            display: flex;
            gap: 10px;
        }
        
        .btn {
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            cursor: pointer;
            transition: opacity 0.2s;
        }
        
        .btn:hover {
            opacity: 0.8;
        }
        
        .btn-primary {
            background: #007aff;
            color: white;
        }
        
        .btn-danger {
            background: #ff3b30;
            color: white;
        }
        
        .priority-high {
            border-left: 4px solid #ff3b30;
        }
        
        .priority-medium {
            border-left: 4px solid #ff9500;
        }
        
        .priority-low {
            border-left: 4px solid #34c759;
        }
        
        .status-completed {
            opacity: 0.6;
            text-decoration: line-through;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>任务管理器</h1>
            <button class="btn btn-primary" onclick="toggleAddForm()">
                + 新建任务
            </button>
        </div>
        
        <div class="add-task-form" id="addTaskForm" style="display: none;">
            <h3>新建任务</h3>
            <div class="form-group">
                <label>任务标题 *</label>
                <input type="text" id="taskTitle" placeholder="输入任务标题">
            </div>
            <div class="form-group">
                <label>优先级</label>
                <select id="taskPriority">
                    <option value="高">高</option>
                    <option value="中" selected>中</option>
                    <option value="低">低</option>
                </select>
            </div>
            <div class="form-group">
                <label>截止日期</label>
                <input type="date" id="taskDueDate">
            </div>
            <div class="form-group">
                <label>描述</label>
                <textarea id="taskDescription" rows="3" placeholder="任务描述（可选）"></textarea>
            </div>
            <div style="display: flex; gap: 10px;">
                <button class="btn btn-primary" onclick="createTask()">创建</button>
                <button class="btn" onclick="toggleAddForm()">取消</button>
            </div>
        </div>
        
        <div class="task-list" id="taskList">
            <div style="padding: 50px; text-align: center; color: #999;">
                加载中...
            </div>
        </div>
    </div>
    
    ${webCommunicator}
    
    <script>
        let tasks = [];
        
        // 注册消息处理器
        comm.on('tasksLoaded', (data) => {
            tasks = data;
            renderTasks();
        });
        
        comm.on('taskCreated', (task) => {
            tasks.push(task);
            renderTasks();
            toggleAddForm();
            clearForm();
        });
        
        comm.on('taskUpdated', (data) => {
            if (data.success) {
                loadTasks();
            }
        });
        
        comm.on('taskDeleted', (data) => {
            tasks = tasks.filter(t => t.id !== data.id);
            renderTasks();
        });
        
        // 加载任务
        function loadTasks() {
            comm.send('browser://get-tasks', {});
        }
        
        // 渲染任务列表
        function renderTasks() {
            const listEl = document.getElementById('taskList');
            
            if (tasks.length === 0) {
                listEl.innerHTML = '<div style="padding: 50px; text-align: center; color: #999;">暂无任务</div>';
                return;
            }
            
            listEl.innerHTML = tasks.map(task => \`
                <div class="task-item priority-\${task.priority.toLowerCase()} \${task.status === '已完成' ? 'status-completed' : ''}">
                    <input type="checkbox" 
                           class="task-checkbox" 
                           \${task.status === '已完成' ? 'checked' : ''}
                           onchange="toggleTaskStatus('\${task.id}', this.checked)">
                    <div class="task-content">
                        <div class="task-title">\${task.title}</div>
                        <div class="task-meta">
                            优先级：\${task.priority} | 
                            \${task.dueDate ? '截止：' + task.dueDate : '无截止日期'}
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="btn btn-danger" onclick="deleteTask('\${task.id}')">
                            删除
                        </button>
                    </div>
                </div>
            \`).join('');
        }
        
        // 切换添加表单
        function toggleAddForm() {
            const form = document.getElementById('addTaskForm');
            form.style.display = form.style.display === 'none' ? 'block' : 'none';
        }
        
        // 创建任务
        function createTask() {
            const title = document.getElementById('taskTitle').value.trim();
            if (!title) {
                alert('请输入任务标题');
                return;
            }
            
            const taskData = {
                title: title,
                priority: document.getElementById('taskPriority').value,
                dueDate: document.getElementById('taskDueDate').value,
                description: document.getElementById('taskDescription').value,
                status: '待办'
            };
            
            comm.send('browser://create-task', taskData);
        }
        
        // 切换任务状态
        function toggleTaskStatus(taskId, completed) {
            comm.send('browser://update-task', {
                id: taskId,
                status: completed ? '已完成' : '待办'
            });
        }
        
        // 删除任务
        function deleteTask(taskId) {
            if (confirm('确定要删除这个任务吗？')) {
                comm.send('browser://delete-task', { id: taskId });
            }
        }
        
        // 清空表单
        function clearForm() {
            document.getElementById('taskTitle').value = '';
            document.getElementById('taskPriority').value = '中';
            document.getElementById('taskDueDate').value = '';
            document.getElementById('taskDescription').value = '';
        }
        
        // 初始化
        window.onload = () => {
            loadTasks();
        };
    </script>
</body>
</html>
        `;
    }
}
```

### 💡 高级技巧

#### 1. 数据缓存与同步

```javascript
// 实现数据缓存以提高性能
class DataCache {
    constructor() {
        this.cache = new Map();
        this.dirty = new Set(); // 标记需要同步的数据
    }
    
    // 获取数据
    get(key) {
        return this.cache.get(key);
    }
    
    // 设置数据
    set(key, value) {
        this.cache.set(key, value);
        this.dirty.add(key);
    }
    
    // 批量同步
    async sync(syncFunction) {
        if (this.dirty.size === 0) return;
        
        let toSync = Array.from(this.dirty);
        this.dirty.clear();
        
        for (let key of toSync) {
            await syncFunction(key, this.cache.get(key));
        }
    }
}
```

#### 2. 错误处理与重试

```javascript
// 带重试机制的通信
class ReliableCommunicator {
    constructor(webview, maxRetries = 3) {
        this.webview = webview;
        this.maxRetries = maxRetries;
    }
    
    async sendWithRetry(code, retries = 0) {
        try {
            return await this.webview.evaluateJavaScript(code);
        } catch (error) {
            if (retries < this.maxRetries) {
                console.log(`重试 ${retries + 1}/${this.maxRetries}`);
                await this.delay(1000 * (retries + 1)); // 递增延迟
                return this.sendWithRetry(code, retries + 1);
            }
            throw error;
        }
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
```

### 📋 本章小结

恭喜你！现在你已经掌握了双向通信的核心技术：
1. ✅ 设计了完整的通信协议
2. ✅ 实现了消息处理框架
3. ✅ 创建了任务管理系统实例
4. ✅ 学会了数据缓存和错误处理
5. ✅ 理解了实时同步的实现方式

通过这个任务管理系统的例子，你可以看到：
- 网页提供了丰富的用户界面
- 插件负责数据的持久化存储
- 双向通信让两者完美配合

你可以基于这个框架开发更多功能，比如：
- 📊 数据分析仪表板
- 🤖 AI 辅助工具
- 📚 知识管理系统
- 🎯 学习进度追踪器

下一章，我们将学习一些进阶技巧，让你的插件更加专业和强大！

---

## 第六部分：进阶技巧

### 🎯 本章目标

学完本章，你将掌握：
- 高效处理图片和视频数据
- 优化性能和内存使用
- 处理大量数据的技巧
- 调试和错误处理的最佳实践

### 🖼️ Base64 图片处理进阶

#### 1. 图片压缩和优化

在处理图片时，Base64 编码会增加约 33% 的数据大小。这里是一些优化技巧：

```javascript
// 压缩图片质量
async function compressImage(imageUrl, quality = 0.8) {
    return await this.webview.evaluateJavaScript(`
        new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = function() {
                const canvas = document.createElement('canvas');
                
                // 计算合适的尺寸（最大 1000px）
                let width = this.width;
                let height = this.height;
                const maxSize = 1000;
                
                if (width > maxSize || height > maxSize) {
                    if (width > height) {
                        height = (height * maxSize) / width;
                        width = maxSize;
                    } else {
                        width = (width * maxSize) / height;
                        height = maxSize;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(this, 0, 0, width, height);
                
                // 使用 JPEG 格式和指定质量
                const dataUrl = canvas.toDataURL('image/jpeg', ${quality});
                
                // 返回压缩后的图片和信息
                resolve({
                    dataUrl: dataUrl,
                    originalSize: this.width + 'x' + this.height,
                    compressedSize: width + 'x' + height,
                    sizeReduction: Math.round((1 - dataUrl.length / (this.width * this.height * 4)) * 100)
                });
            };
            
            img.onerror = () => resolve(null);
            img.src = '${imageUrl}';
        })
    `);
}

// 批量处理图片
async function batchProcessImages(imageUrls, maxConcurrent = 3) {
    const results = [];
    const chunks = [];
    
    // 分组处理，避免一次性处理太多
    for (let i = 0; i < imageUrls.length; i += maxConcurrent) {
        chunks.push(imageUrls.slice(i, i + maxConcurrent));
    }
    
    for (const chunk of chunks) {
        const promises = chunk.map(url => compressImage(url));
        const chunkResults = await Promise.all(promises);
        results.push(...chunkResults);
        
        // 给浏览器一些喘息时间
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return results;
}
```

#### 2. 图片懒加载和渐进式显示

```javascript
// 创建占位图片
function createPlaceholder(width, height) {
    // 创建一个小的占位图
    const svg = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#f0f0f0"/>
            <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">
                加载中...
            </text>
        </svg>
    `;
    return 'data:image/svg+xml;base64,' + btoa(svg);
}

// 渐进式图片加载
let progressiveImageLoader = `
<script>
class ProgressiveImageLoader {
    constructor() {
        this.observer = null;
        this.init();
    }
    
    init() {
        // 使用 Intersection Observer 实现懒加载
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px' // 提前 50px 开始加载
        });
        
        // 观察所有懒加载图片
        document.querySelectorAll('img[data-src]').forEach(img => {
            this.observer.observe(img);
        });
    }
    
    async loadImage(img) {
        const src = img.dataset.src;
        
        // 先加载低质量版本
        if (img.dataset.lowSrc) {
            await this.loadSrc(img, img.dataset.lowSrc);
            img.style.filter = 'blur(5px)';
        }
        
        // 加载高质量版本
        await this.loadSrc(img, src);
        img.style.filter = 'none';
        img.style.transition = 'filter 0.3s';
    }
    
    loadSrc(img, src) {
        return new Promise((resolve) => {
            const tempImg = new Image();
            tempImg.onload = () => {
                img.src = src;
                resolve();
            };
            tempImg.onerror = resolve;
            tempImg.src = src;
        });
    }
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', () => {
    new ProgressiveImageLoader();
});
</script>
`;
```

### 🎥 视频处理高级技巧

#### 1. 精确的视频时间戳和预览

```javascript
// 高级视频截图类
class VideoProcessor {
    constructor(webview) {
        this.webview = webview;
    }
    
    // 获取多个时间点的截图
    async getMultipleFrames(timestamps) {
        return await this.webview.evaluateJavaScript(`
            new Promise(async (resolve) => {
                const video = document.querySelector('video');
                if (!video) {
                    resolve([]);
                    return;
                }
                
                const frames = [];
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth / 2; // 缩小尺寸
                canvas.height = video.videoHeight / 2;
                const ctx = canvas.getContext('2d');
                
                for (const timestamp of ${JSON.stringify(timestamps)}) {
                    // 跳转到指定时间
                    video.currentTime = timestamp;
                    
                    // 等待跳转完成
                    await new Promise(resolve => {
                        video.onseeked = resolve;
                    });
                    
                    // 截图
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    
                    frames.push({
                        timestamp: timestamp,
                        dataUrl: canvas.toDataURL('image/jpeg', 0.7),
                        timeString: formatTime(timestamp)
                    });
                }
                
                resolve(frames);
                
                function formatTime(seconds) {
                    const h = Math.floor(seconds / 3600);
                    const m = Math.floor((seconds % 3600) / 60);
                    const s = Math.floor(seconds % 60);
                    
                    if (h > 0) {
                        return h + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
                    }
                    return m + ':' + String(s).padStart(2, '0');
                }
            })
        `);
    }
    
    // 创建视频预览条
    async createVideoPreviewStrip(duration, frameCount = 10) {
        // 计算要截取的时间点
        const timestamps = [];
        const interval = duration / frameCount;
        
        for (let i = 0; i < frameCount; i++) {
            timestamps.push(i * interval);
        }
        
        const frames = await this.getMultipleFrames(timestamps);
        
        // 创建预览条的 HTML
        const previewHtml = frames.map(frame => `
            <div class="preview-frame" data-time="${frame.timestamp}">
                <img src="${frame.dataUrl}" alt="${frame.timeString}">
                <span class="time-label">${frame.timeString}</span>
            </div>
        `).join('');
        
        return `
            <div class="video-preview-strip">
                ${previewHtml}
            </div>
            <style>
                .video-preview-strip {
                    display: flex;
                    overflow-x: auto;
                    gap: 5px;
                    padding: 10px;
                    background: #f0f0f0;
                    border-radius: 8px;
                }
                .preview-frame {
                    flex-shrink: 0;
                    position: relative;
                    cursor: pointer;
                }
                .preview-frame img {
                    width: 120px;
                    height: 68px;
                    object-fit: cover;
                    border-radius: 4px;
                }
                .time-label {
                    position: absolute;
                    bottom: 2px;
                    right: 2px;
                    background: rgba(0, 0, 0, 0.7);
                    color: white;
                    padding: 2px 4px;
                    font-size: 10px;
                    border-radius: 2px;
                }
            </style>
        `;
    }
    
    // 智能视频分析
    async analyzeVideo() {
        return await this.webview.evaluateJavaScript(`
            const video = document.querySelector('video');
            if (!video) return null;
            
            // 收集视频信息
            const info = {
                duration: video.duration,
                currentTime: video.currentTime,
                playbackRate: video.playbackRate,
                volume: video.volume,
                muted: video.muted,
                paused: video.paused,
                buffered: [],
                // 视频质量信息
                videoWidth: video.videoWidth,
                videoHeight: video.videoHeight,
                // 获取视频标题
                title: document.title,
                // 获取视频源
                source: video.currentSrc || video.src
            };
            
            // 获取缓冲区信息
            for (let i = 0; i < video.buffered.length; i++) {
                info.buffered.push({
                    start: video.buffered.start(i),
                    end: video.buffered.end(i)
                });
            }
            
            // 计算观看进度
            info.watchProgress = (info.currentTime / info.duration * 100).toFixed(1) + '%';
            
            // 检测视频平台
            const host = window.location.hostname;
            if (host.includes('bilibili.com')) {
                info.platform = 'Bilibili';
                // 尝试获取 BV 号
                const bvMatch = window.location.pathname.match(/BV[0-9A-Za-z]+/);
                if (bvMatch) info.videoId = bvMatch[0];
            } else if (host.includes('youtube.com')) {
                info.platform = 'YouTube';
                const vMatch = window.location.search.match(/v=([^&]+)/);
                if (vMatch) info.videoId = vMatch[1];
            }
            
            return info;
        `);
    }
}
```

### 📝 Markdown 转换高级技巧

#### 1. 富文本到 Markdown 的智能转换

```javascript
// HTML 到 Markdown 转换器
class HtmlToMarkdownConverter {
    // 转换规则映射
    static rules = {
        'h1': (node) => `# ${node.textContent}\n\n`,
        'h2': (node) => `## ${node.textContent}\n\n`,
        'h3': (node) => `### ${node.textContent}\n\n`,
        'h4': (node) => `#### ${node.textContent}\n\n`,
        'h5': (node) => `##### ${node.textContent}\n\n`,
        'h6': (node) => `###### ${node.textContent}\n\n`,
        'p': (node) => `${this.processInlineElements(node)}\n\n`,
        'br': () => '\n',
        'hr': () => '\n---\n\n',
        'blockquote': (node) => `> ${this.processInlineElements(node)}\n\n`,
        'ul': (node) => this.processList(node, false),
        'ol': (node) => this.processList(node, true),
        'code': (node) => `\`${node.textContent}\``,
        'pre': (node) => `\`\`\`\n${node.textContent}\n\`\`\`\n\n`,
        'a': (node) => `[${node.textContent}](${node.href})`,
        'img': (node) => `![${node.alt || ''}](${node.src})`,
        'strong': (node) => `**${node.textContent}**`,
        'b': (node) => `**${node.textContent}**`,
        'em': (node) => `*${node.textContent}*`,
        'i': (node) => `*${node.textContent}*`,
        'del': (node) => `~~${node.textContent}~~`,
        'table': (node) => this.processTable(node)
    };
    
    static convert(html) {
        // 创建临时 DOM
        const div = document.createElement('div');
        div.innerHTML = html;
        
        return this.processNode(div);
    }
    
    static processNode(node) {
        let markdown = '';
        
        for (const child of node.childNodes) {
            if (child.nodeType === Node.TEXT_NODE) {
                markdown += child.textContent;
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                const tagName = child.tagName.toLowerCase();
                const rule = this.rules[tagName];
                
                if (rule) {
                    markdown += rule(child);
                } else {
                    // 递归处理未知元素
                    markdown += this.processNode(child);
                }
            }
        }
        
        return markdown;
    }
    
    static processInlineElements(node) {
        let text = '';
        
        for (const child of node.childNodes) {
            if (child.nodeType === Node.TEXT_NODE) {
                text += child.textContent;
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                const tagName = child.tagName.toLowerCase();
                const rule = this.rules[tagName];
                
                if (rule) {
                    text += rule(child);
                } else {
                    text += child.textContent;
                }
            }
        }
        
        return text;
    }
    
    static processList(listNode, ordered) {
        let markdown = '';
        const items = listNode.querySelectorAll('li');
        
        items.forEach((item, index) => {
            const prefix = ordered ? `${index + 1}. ` : '- ';
            markdown += prefix + this.processInlineElements(item) + '\n';
        });
        
        return markdown + '\n';
    }
    
    static processTable(tableNode) {
        let markdown = '';
        const rows = tableNode.querySelectorAll('tr');
        
        if (rows.length === 0) return '';
        
        // 处理表头
        const headerCells = rows[0].querySelectorAll('th, td');
        if (headerCells.length > 0) {
            markdown += '| ' + Array.from(headerCells)
                .map(cell => cell.textContent.trim())
                .join(' | ') + ' |\n';
            
            markdown += '| ' + Array(headerCells.length)
                .fill('---')
                .join(' | ') + ' |\n';
        }
        
        // 处理数据行
        for (let i = 1; i < rows.length; i++) {
            const cells = rows[i].querySelectorAll('td');
            markdown += '| ' + Array.from(cells)
                .map(cell => cell.textContent.trim())
                .join(' | ') + ' |\n';
        }
        
        return markdown + '\n';
    }
}

// 使用示例
async function convertWebPageToMarkdown() {
    const markdown = await this.webview.evaluateJavaScript(`
        // 获取主要内容区域
        const content = document.querySelector('article') || 
                       document.querySelector('.content') || 
                       document.querySelector('main') || 
                       document.body;
        
        // 清理不需要的元素
        const clone = content.cloneNode(true);
        clone.querySelectorAll('script, style, nav, aside').forEach(el => el.remove());
        
        // 转换为 Markdown
        ${HtmlToMarkdownConverter.toString()}
        HtmlToMarkdownConverter.convert(clone.innerHTML);
    `);
    
    return markdown;
}
```

### ⚡ 性能优化技巧

#### 1. 批量操作优化

```javascript
// 批量创建卡片的优化方案
class BatchNoteCreator {
    constructor() {
        this.queue = [];
        this.processing = false;
        this.batchSize = 10;
        this.delayBetweenBatches = 500;
    }
    
    // 添加到队列
    async add(noteData) {
        this.queue.push(noteData);
        
        if (!this.processing) {
            this.processQueue();
        }
    }
    
    // 处理队列
    async processQueue() {
        if (this.queue.length === 0) {
            this.processing = false;
            return;
        }
        
        this.processing = true;
        
        // 使用 undoGrouping 将批量操作作为一个撤销单元
        MNUtil.undoGrouping(() => {
            const batch = this.queue.splice(0, this.batchSize);
            
            batch.forEach(data => {
                const note = MNUtil.createNote(MNUtil.currentNotebook);
                note.noteTitle = data.title;
                note.noteText = data.text;
                
                // 批量添加评论
                if (data.comments) {
                    data.comments.forEach(comment => {
                        note.appendTextComment(comment);
                    });
                }
            });
        });
        
        // 显示进度
        const remaining = this.queue.length;
        if (remaining > 0) {
            MNUtil.showHUD(`正在处理... 剩余 ${remaining} 个`);
            
            // 继续处理下一批
            setTimeout(() => this.processQueue(), this.delayBetweenBatches);
        } else {
            MNUtil.showHUD("✅ 批量创建完成");
            this.processing = false;
        }
    }
}

// 内存优化：及时释放大对象
class MemoryManager {
    static cleanup(object) {
        if (typeof object !== 'object' || object === null) return;
        
        // 清理数组
        if (Array.isArray(object)) {
            object.length = 0;
            return;
        }
        
        // 清理对象属性
        for (let key in object) {
            if (object.hasOwnProperty(key)) {
                delete object[key];
            }
        }
    }
    
    // 监控内存使用
    static async checkMemory() {
        if (performance && performance.memory) {
            const used = performance.memory.usedJSHeapSize;
            const total = performance.memory.totalJSHeapSize;
            const percent = (used / total * 100).toFixed(1);
            
            console.log(`内存使用: ${percent}%`);
            
            // 如果内存使用超过 80%，建议清理
            if (percent > 80) {
                console.warn("内存使用率过高，建议清理缓存");
                return true;
            }
        }
        return false;
    }
}
```

#### 2. 防抖和节流

```javascript
// 工具函数
const Utils = {
    // 防抖：在停止触发后执行
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // 节流：固定时间间隔执行
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // 请求合并
    batchRequests(requestFn, delay = 100) {
        let pending = [];
        let timer = null;
        
        return function(data) {
            pending.push(data);
            
            if (timer) clearTimeout(timer);
            
            timer = setTimeout(() => {
                const batch = pending.slice();
                pending = [];
                requestFn(batch);
            }, delay);
        };
    }
};

// 使用示例：优化搜索
const optimizedSearch = Utils.debounce(async (keyword) => {
    const results = await searchNotes(keyword);
    updateSearchResults(results);
}, 300);

// 使用示例：优化滚动
const optimizedScroll = Utils.throttle(() => {
    updateVisibleCards();
}, 100);
```

### 🐛 调试技巧

#### 1. 增强的日志系统

```javascript
// 开发者工具类
class DevTools {
    static logLevels = {
        DEBUG: 0,
        INFO: 1,
        WARN: 2,
        ERROR: 3
    };
    
    static currentLevel = this.logLevels.DEBUG;
    static logs = [];
    static maxLogs = 1000;
    
    static log(level, category, message, data) {
        if (level < this.currentLevel) return;
        
        const entry = {
            timestamp: new Date().toISOString(),
            level: Object.keys(this.logLevels).find(k => this.logLevels[k] === level),
            category,
            message,
            data
        };
        
        this.logs.push(entry);
        
        // 限制日志数量
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
        
        // 控制台输出
        const color = ['blue', 'green', 'orange', 'red'][level];
        console.log(
            `%c[${entry.level}] ${category}: ${message}`,
            `color: ${color}; font-weight: bold`,
            data || ''
        );
    }
    
    static debug(category, message, data) {
        this.log(this.logLevels.DEBUG, category, message, data);
    }
    
    static info(category, message, data) {
        this.log(this.logLevels.INFO, category, message, data);
    }
    
    static warn(category, message, data) {
        this.log(this.logLevels.WARN, category, message, data);
    }
    
    static error(category, message, data) {
        this.log(this.logLevels.ERROR, category, message, data);
    }
    
    // 导出日志
    static exportLogs() {
        const logText = this.logs.map(log => 
            `${log.timestamp} [${log.level}] ${log.category}: ${log.message} ${
                log.data ? JSON.stringify(log.data) : ''
            }`
        ).join('\n');
        
        // 创建日志卡片
        const note = MNUtil.createNote(MNUtil.currentNotebook);
        note.noteTitle = `调试日志 - ${new Date().toLocaleString()}`;
        note.noteText = logText;
        
        MNUtil.showHUD("日志已导出到卡片");
    }
    
    // 性能测量
    static measure(name, fn) {
        const start = performance.now();
        const result = fn();
        const duration = performance.now() - start;
        
        this.info('Performance', `${name} took ${duration.toFixed(2)}ms`);
        
        return result;
    }
}

// 使用示例
DevTools.debug('DataExtractor', '开始提取数据', { url: window.location.href });
DevTools.measure('图片压缩', () => compressImage(imageUrl));
```

### 📋 本章小结

通过本章的学习，你已经掌握了：
1. ✅ 高效的图片处理和压缩技巧
2. ✅ 视频数据的高级处理方法
3. ✅ HTML 到 Markdown 的智能转换
4. ✅ 性能优化的各种策略
5. ✅ 专业的调试和日志系统

这些进阶技巧将帮助你开发出更加专业、高效的插件。记住：
- 始终考虑性能和用户体验
- 合理使用缓存和批处理
- 做好错误处理和日志记录
- 定期测试和优化代码

---

## 第七部分：完整项目实战 - 智能学习助手

### 🎯 项目目标

我们将创建一个功能完整的"智能学习助手"插件，它能够：
1. 📖 自动提取网页重点内容
2. 🤖 使用 AI 生成学习笔记
3. 📊 追踪学习进度
4. 🔄 双向同步笔记内容
5. 📈 生成学习报告

### 📐 项目架构设计

```
智能学习助手
├── 插件端 (main.js)
│   ├── 数据管理模块
│   ├── AI 接口模块
│   ├── 同步管理模块
│   └── 统计分析模块
├── 网页端 (webview.html)
│   ├── 内容提取界面
│   ├── AI 对话界面
│   ├── 进度追踪界面
│   └── 报告展示界面
└── 通信层
    ├── 消息协议定义
    └── 数据传输优化
```

### 💻 核心代码实现

#### 1. 主插件文件

```javascript
// SmartLearningAssistant.js
class SmartLearningAssistant {
    constructor() {
        this.name = "智能学习助手";
        this.version = "1.0.0";
        this.webview = null;
        this.messageHandler = null;
        this.aiService = new AIService();
        this.dataManager = new DataManager();
        this.syncManager = new SyncManager();
        
        this.init();
    }
    
    init() {
        // 创建 WebView
        this.createWebView();
        
        // 设置消息处理
        this.setupMessageHandlers();
        
        // 初始化数据
        this.loadUserData();
        
        // 注册插件命令
        this.registerCommands();
    }
    
    createWebView() {
        this.webview = UIWebView.new();
        this.webview.frame = { x: 0, y: 0, width: 450, height: 700 };
        this.webview.layer.cornerRadius = 10;
        this.webview.layer.shadowOpacity = 0.3;
        
        // 加载界面
        this.webview.loadHTMLStringBaseURL(this.getHTML(), null);
    }
    
    setupMessageHandlers() {
        this.messageHandler = new MessageHandler(this.webview);
        
        // 内容提取相关
        this.messageHandler.on('extract-content', this.handleExtractContent.bind(this));
        this.messageHandler.on('save-notes', this.handleSaveNotes.bind(this));
        
        // AI 相关
        this.messageHandler.on('ai-explain', this.handleAIExplain.bind(this));
        this.messageHandler.on('ai-summarize', this.handleAISummarize.bind(this));
        this.messageHandler.on('ai-quiz', this.handleAIQuiz.bind(this));
        
        // 进度追踪
        this.messageHandler.on('update-progress', this.handleUpdateProgress.bind(this));
        this.messageHandler.on('get-statistics', this.handleGetStatistics.bind(this));
        
        // 同步相关
        this.messageHandler.on('sync-notes', this.handleSyncNotes.bind(this));
    }
    
    // 智能内容提取
    async handleExtractContent(params) {
        try {
            DevTools.info('ContentExtraction', '开始提取内容', params);
            
            const content = await this.webview.evaluateJavaScript(`
                // 智能识别页面类型
                const pageAnalyzer = new PageAnalyzer();
                const pageType = pageAnalyzer.analyze();
                
                // 根据页面类型使用不同的提取策略
                let extractor;
                switch(pageType) {
                    case 'article':
                        extractor = new ArticleExtractor();
                        break;
                    case 'video':
                        extractor = new VideoExtractor();
                        break;
                    case 'pdf':
                        extractor = new PDFExtractor();
                        break;
                    default:
                        extractor = new GeneralExtractor();
                }
                
                extractor.extract();
            `);
            
            // 处理提取的内容
            const processed = await this.processExtractedContent(content);
            
            // 发送回网页
            this.messageHandler.send('content-extracted', processed);
            
        } catch (error) {
            DevTools.error('ContentExtraction', '提取失败', error);
            this.messageHandler.send('extraction-error', { 
                message: '内容提取失败，请重试' 
            });
        }
    }
    
    // AI 解释功能
    async handleAIExplain(params) {
        const { text, context } = params;
        
        try {
            // 调用 AI 服务
            const explanation = await this.aiService.explain(text, context);
            
            // 创建解释卡片
            const note = MNUtil.createNote(MNUtil.currentNotebook);
            note.noteTitle = `💡 AI 解释: ${text.substring(0, 30)}...`;
            
            // 格式化 AI 回复
            const formatted = this.formatAIResponse(explanation);
            note.noteText = formatted;
            
            // 添加元数据
            note.appendTextComment(`原文: ${text}`);
            note.appendTextComment(`时间: ${new Date().toLocaleString()}`);
            note.colorIndex = 3; // 蓝色标记
            
            // 更新学习记录
            this.dataManager.addLearningRecord({
                type: 'ai_explain',
                content: text,
                result: explanation,
                timestamp: Date.now()
            });
            
            this.messageHandler.send('ai-explained', {
                noteId: note.noteId,
                explanation: formatted
            });
            
        } catch (error) {
            DevTools.error('AI', 'AI解释失败', error);
            this.messageHandler.send('ai-error', {
                message: 'AI 服务暂时不可用'
            });
        }
    }
    
    // AI 总结功能
    async handleAISummarize(params) {
        const { content, type } = params;
        
        // 显示加载状态
        this.messageHandler.send('ai-processing', {
            message: '正在生成总结...'
        });
        
        try {
            // 根据内容类型选择总结策略
            let summary;
            if (type === 'article') {
                summary = await this.aiService.summarizeArticle(content);
            } else if (type === 'video') {
                summary = await this.aiService.summarizeVideo(content);
            } else {
                summary = await this.aiService.summarize(content);
            }
            
            // 创建总结卡片
            const note = this.createSummaryNote(summary, content);
            
            // 发送结果
            this.messageHandler.send('ai-summarized', {
                noteId: note.noteId,
                summary: summary
            });
            
        } catch (error) {
            this.handleAIError(error);
        }
    }
    
    // 学习进度追踪
    async handleUpdateProgress(params) {
        const { topicId, progress, timeSpent } = params;
        
        // 更新进度数据
        this.dataManager.updateProgress(topicId, {
            progress,
            timeSpent,
            lastUpdate: Date.now()
        });
        
        // 检查是否达到里程碑
        const milestones = this.checkMilestones(topicId, progress);
        if (milestones.length > 0) {
            this.celebrateMilestones(milestones);
        }
        
        // 生成进度报告
        const report = this.generateProgressReport(topicId);
        
        this.messageHandler.send('progress-updated', {
            report,
            milestones
        });
    }
    
    // 获取统计数据
    async handleGetStatistics() {
        const stats = {
            // 基础统计
            totalNotes: this.dataManager.getTotalNotes(),
            todayNotes: this.dataManager.getTodayNotes(),
            weeklyNotes: this.dataManager.getWeeklyNotes(),
            
            // 学习时间统计
            totalTime: this.dataManager.getTotalLearningTime(),
            todayTime: this.dataManager.getTodayLearningTime(),
            averageTime: this.dataManager.getAverageDailyTime(),
            
            // AI 使用统计
            aiUsage: {
                explains: this.dataManager.getAIUsageCount('explain'),
                summaries: this.dataManager.getAIUsageCount('summarize'),
                quizzes: this.dataManager.getAIUsageCount('quiz')
            },
            
            // 学习效率分析
            efficiency: this.analyzeLearmingEfficiency(),
            
            // 热门主题
            topTopics: this.dataManager.getTopTopics(5),
            
            // 学习曲线数据
            learningCurve: this.dataManager.getLearningCurve(30)
        };
        
        this.messageHandler.send('statistics-loaded', stats);
    }
    
    // 生成学习报告
    generateWeeklyReport() {
        const report = {
            period: this.getWeekPeriod(),
            summary: this.dataManager.getWeeklySummary(),
            achievements: this.dataManager.getWeeklyAchievements(),
            recommendations: this.generateRecommendations(),
            visualData: this.prepareVisualizationData()
        };
        
        // 创建报告卡片
        const note = MNUtil.createNote(MNUtil.currentNotebook);
        note.noteTitle = `📊 周学习报告 - ${report.period}`;
        
        // 生成 Markdown 格式的报告
        const markdown = this.formatWeeklyReport(report);
        note.noteText = markdown;
        
        // 添加可视化图表
        note.appendHtmlComment(this.generateCharts(report.visualData));
        
        return note;
    }
    
    // 获取完整的 HTML
    getHTML() {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>智能学习助手</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f7fa;
            color: #333;
        }
        
        .container {
            height: 100vh;
            display: flex;
            flex-direction: column;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .header h1 {
            font-size: 24px;
            margin-bottom: 10px;
        }
        
        .tabs {
            display: flex;
            background: white;
            border-bottom: 1px solid #e0e0e0;
            overflow-x: auto;
        }
        
        .tab {
            padding: 15px 20px;
            cursor: pointer;
            white-space: nowrap;
            border-bottom: 3px solid transparent;
            transition: all 0.3s;
        }
        
        .tab:hover {
            background: #f5f5f5;
        }
        
        .tab.active {
            border-bottom-color: #667eea;
            color: #667eea;
            font-weight: 500;
        }
        
        .content {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
        }
        
        .panel {
            display: none;
            animation: fadeIn 0.3s;
        }
        
        .panel.active {
            display: block;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        /* 提取面板样式 */
        .extract-panel {
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        
        .extract-options {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 10px;
            margin-bottom: 20px;
        }
        
        .option-card {
            padding: 15px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            cursor: pointer;
            text-align: center;
            transition: all 0.3s;
        }
        
        .option-card:hover {
            border-color: #667eea;
            transform: translateY(-2px);
        }
        
        .option-card.selected {
            background: #667eea;
            color: white;
            border-color: #667eea;
        }
        
        .extract-button {
            width: 100%;
            padding: 12px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            transition: background 0.3s;
        }
        
        .extract-button:hover {
            background: #5a67d8;
        }
        
        .extract-button:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
        
        /* AI 面板样式 */
        .ai-panel {
            display: grid;
            gap: 20px;
        }
        
        .ai-input {
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        
        .ai-input textarea {
            width: 100%;
            min-height: 100px;
            padding: 10px;
            border: 1px solid #e0e0e0;
            border-radius: 5px;
            resize: vertical;
            font-family: inherit;
        }
        
        .ai-actions {
            display: flex;
            gap: 10px;
            margin-top: 10px;
        }
        
        .ai-button {
            flex: 1;
            padding: 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .ai-button.explain {
            background: #48bb78;
            color: white;
        }
        
        .ai-button.summarize {
            background: #4299e1;
            color: white;
        }
        
        .ai-button.quiz {
            background: #ed8936;
            color: white;
        }
        
        .ai-response {
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            white-space: pre-wrap;
            line-height: 1.6;
        }
        
        /* 进度面板样式 */
        .progress-panel {
            display: grid;
            gap: 20px;
        }
        
        .progress-card {
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        
        .progress-bar {
            height: 20px;
            background: #e0e0e0;
            border-radius: 10px;
            overflow: hidden;
            margin: 10px 0;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2);
            transition: width 0.5s;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
        }
        
        /* 统计面板样式 */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
        }
        
        .stat-card {
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            text-align: center;
        }
        
        .stat-value {
            font-size: 36px;
            font-weight: bold;
            color: #667eea;
            margin: 10px 0;
        }
        
        .stat-label {
            color: #666;
            font-size: 14px;
        }
        
        .chart-container {
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            height: 400px;
            position: relative;
        }
        
        /* 加载动画 */
        .loader {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* 提示信息 */
        .toast {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #333;
            color: white;
            padding: 12px 24px;
            border-radius: 50px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            opacity: 0;
            transition: opacity 0.3s;
            z-index: 1000;
        }
        
        .toast.show {
            opacity: 1;
        }
        
        .toast.success {
            background: #48bb78;
        }
        
        .toast.error {
            background: #e53e3e;
        }
        
        .toast.info {
            background: #4299e1;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧠 智能学习助手</h1>
            <p>让学习更高效、更智能</p>
        </div>
        
        <div class="tabs">
            <div class="tab active" data-tab="extract">📖 内容提取</div>
            <div class="tab" data-tab="ai">🤖 AI 助手</div>
            <div class="tab" data-tab="progress">📈 学习进度</div>
            <div class="tab" data-tab="stats">📊 统计分析</div>
        </div>
        
        <div class="content">
            <!-- 内容提取面板 -->
            <div class="panel extract-panel active" data-panel="extract">
                <h2>智能内容提取</h2>
                <p style="margin: 10px 0; color: #666;">选择要提取的内容类型</p>
                
                <div class="extract-options">
                    <div class="option-card" data-type="auto">
                        <div style="font-size: 32px;">🔍</div>
                        <div>自动识别</div>
                    </div>
                    <div class="option-card" data-type="article">
                        <div style="font-size: 32px;">📰</div>
                        <div>文章</div>
                    </div>
                    <div class="option-card" data-type="video">
                        <div style="font-size: 32px;">📹</div>
                        <div>视频</div>
                    </div>
                    <div class="option-card" data-type="code">
                        <div style="font-size: 32px;">💻</div>
                        <div>代码</div>
                    </div>
                </div>
                
                <button class="extract-button" onclick="extractContent()">
                    开始提取
                </button>
                
                <div id="extractResult" style="margin-top: 20px;"></div>
            </div>
            
            <!-- AI 助手面板 -->
            <div class="panel ai-panel" data-panel="ai">
                <div class="ai-input">
                    <h3>输入要理解的内容</h3>
                    <textarea id="aiInput" placeholder="粘贴或输入文本..."></textarea>
                    <div class="ai-actions">
                        <button class="ai-button explain" onclick="aiExplain()">
                            💡 解释
                        </button>
                        <button class="ai-button summarize" onclick="aiSummarize()">
                            📝 总结
                        </button>
                        <button class="ai-button quiz" onclick="aiQuiz()">
                            ❓ 出题
                        </button>
                    </div>
                </div>
                
                <div id="aiResponse" class="ai-response" style="display: none;"></div>
            </div>
            
            <!-- 学习进度面板 -->
            <div class="panel progress-panel" data-panel="progress">
                <h2>今日学习进度</h2>
                
                <div class="progress-card">
                    <h3>总体进度</h3>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 0%">0%</div>
                    </div>
                    <p style="color: #666; margin-top: 10px;">
                        已学习 <span id="learnedCount">0</span> 个知识点
                    </p>
                </div>
                
                <div id="topicProgress"></div>
            </div>
            
            <!-- 统计分析面板 -->
            <div class="panel" data-panel="stats">
                <h2>学习统计</h2>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-label">总笔记数</div>
                        <div class="stat-value" id="totalNotes">0</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">今日新增</div>
                        <div class="stat-value" id="todayNotes">0</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">学习时长</div>
                        <div class="stat-value" id="totalTime">0h</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">AI 使用</div>
                        <div class="stat-value" id="aiUsage">0</div>
                    </div>
                </div>
                
                <div class="chart-container" style="margin-top: 20px;">
                    <canvas id="learningChart"></canvas>
                </div>
            </div>
        </div>
    </div>
    
    <!-- 消息提示 -->
    <div id="toast" class="toast"></div>
    
    ${webCommunicator}
    
    <script>
        // 页面控制逻辑
        let selectedExtractType = 'auto';
        let learningChart = null;
        
        // 标签切换
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                // 切换标签状态
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // 切换面板
                const tabName = tab.dataset.tab;
                document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
                document.querySelector(\`[data-panel="\${tabName}"]\`).classList.add('active');
                
                // 特殊处理
                if (tabName === 'stats') {
                    loadStatistics();
                }
            });
        });
        
        // 内容提取选项
        document.querySelectorAll('.option-card').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                selectedExtractType = card.dataset.type;
            });
        });
        
        // 默认选中自动识别
        document.querySelector('[data-type="auto"]').classList.add('selected');
        
        // 内容提取
        function extractContent() {
            const button = document.querySelector('.extract-button');
            button.disabled = true;
            button.innerHTML = '<span class="loader"></span> 提取中...';
            
            comm.send('browser://extract-content', {
                type: selectedExtractType,
                url: window.location.href
            });
        }
        
        // AI 功能
        function aiExplain() {
            const text = document.getElementById('aiInput').value.trim();
            if (!text) {
                showToast('请输入要解释的内容', 'error');
                return;
            }
            
            showAILoading();
            comm.send('browser://ai-explain', {
                text: text,
                context: document.title
            });
        }
        
        function aiSummarize() {
            const text = document.getElementById('aiInput').value.trim();
            if (!text) {
                showToast('请输入要总结的内容', 'error');
                return;
            }
            
            showAILoading();
            comm.send('browser://ai-summarize', {
                content: text,
                type: 'text'
            });
        }
        
        function aiQuiz() {
            const text = document.getElementById('aiInput').value.trim();
            if (!text) {
                showToast('请输入学习内容', 'error');
                return;
            }
            
            showAILoading();
            comm.send('browser://ai-quiz', {
                content: text,
                difficulty: 'medium'
            });
        }
        
        function showAILoading() {
            const response = document.getElementById('aiResponse');
            response.style.display = 'block';
            response.innerHTML = '<span class="loader"></span> AI 正在思考...';
        }
        
        // 加载统计数据
        function loadStatistics() {
            comm.send('browser://get-statistics', {});
        }
        
        // 消息处理
        comm.on('content-extracted', (data) => {
            const button = document.querySelector('.extract-button');
            button.disabled = false;
            button.textContent = '开始提取';
            
            const resultDiv = document.getElementById('extractResult');
            resultDiv.innerHTML = \`
                <div style="background: #f0fdf4; border: 1px solid #86efac; padding: 15px; border-radius: 8px;">
                    <h3 style="color: #16a34a; margin-bottom: 10px;">✅ 提取成功</h3>
                    <p>已创建 \${data.notesCount} 个笔记</p>
                    <p style="margin-top: 5px; color: #666;">提取类型：\${data.type}</p>
                </div>
            \`;
            
            showToast('内容提取成功！', 'success');
        });
        
        comm.on('ai-explained', (data) => {
            const response = document.getElementById('aiResponse');
            response.innerHTML = \`
                <h3>💡 AI 解释</h3>
                <div style="margin-top: 10px;">\${data.explanation}</div>
            \`;
        });
        
        comm.on('ai-summarized', (data) => {
            const response = document.getElementById('aiResponse');
            response.innerHTML = \`
                <h3>📝 AI 总结</h3>
                <div style="margin-top: 10px;">\${data.summary}</div>
            \`;
        });
        
        comm.on('statistics-loaded', (stats) => {
            // 更新统计卡片
            document.getElementById('totalNotes').textContent = stats.totalNotes;
            document.getElementById('todayNotes').textContent = stats.todayNotes;
            document.getElementById('totalTime').textContent = Math.round(stats.totalTime / 60) + 'h';
            document.getElementById('aiUsage').textContent = 
                stats.aiUsage.explains + stats.aiUsage.summaries + stats.aiUsage.quizzes;
            
            // 更新图表
            updateLearningChart(stats.learningCurve);
        });
        
        // 更新学习曲线图表
        function updateLearningChart(data) {
            const ctx = document.getElementById('learningChart').getContext('2d');
            
            if (learningChart) {
                learningChart.destroy();
            }
            
            learningChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.map(d => d.date),
                    datasets: [{
                        label: '学习时长（分钟）',
                        data: data.map(d => d.minutes),
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        tension: 0.4
                    }, {
                        label: '笔记数量',
                        data: data.map(d => d.notes),
                        borderColor: '#48bb78',
                        backgroundColor: 'rgba(72, 187, 120, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
        
        // 提示功能
        function showToast(message, type = 'info') {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.className = \`toast \${type} show\`;
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
        
        // 页面加载完成后初始化
        window.onload = () => {
            // 检查是否在支持的页面
            const supportedSites = ['article', 'video', 'pdf'];
            const pageType = detectPageType();
            
            if (supportedSites.includes(pageType)) {
                showToast(\`检测到\${pageType}类型页面，可以开始提取\`, 'info');
            }
        };
        
        // 页面类型检测
        function detectPageType() {
            // 简单的页面类型检测逻辑
            if (document.querySelector('video')) return 'video';
            if (document.querySelector('article')) return 'article';
            if (window.location.pathname.endsWith('.pdf')) return 'pdf';
            return 'general';
        }
    </script>
</body>
</html>
        `;
    }
}

// AI 服务模块
class AIService {
    constructor() {
        this.apiKey = this.loadAPIKey();
        this.baseURL = 'https://api.openai.com/v1';
        this.model = 'gpt-3.5-turbo';
    }
    
    async explain(text, context) {
        const prompt = `
作为一位专业的教师，请用简单易懂的语言解释以下内容：

内容：${text}
上下文：${context}

要求：
1. 用通俗的语言解释核心概念
2. 如果可能，举一个生活中的例子
3. 指出这个知识点的实际应用
4. 保持解释在 200 字以内
        `;
        
        return await this.complete(prompt);
    }
    
    async summarize(content) {
        const prompt = `
请对以下内容进行总结：

${content}

要求：
1. 提取 3-5 个关键要点
2. 每个要点用一句话概括
3. 最后用一段话总结主要观点
4. 总结保持在 300 字以内
        `;
        
        return await this.complete(prompt);
    }
    
    async generateQuiz(content, difficulty = 'medium') {
        const prompt = `
基于以下内容，生成 ${difficulty} 难度的测试题：

${content}

要求：
1. 生成 3 道选择题
2. 每题 4 个选项，只有一个正确答案
3. 题目要测试对内容的理解，不是简单记忆
4. 提供答案和简短解释
        `;
        
        return await this.complete(prompt);
    }
    
    async complete(prompt) {
        // 实际项目中，这里会调用真实的 AI API
        // 这里用模拟响应代替
        return this.simulateAIResponse(prompt);
    }
    
    simulateAIResponse(prompt) {
        // 模拟 AI 响应
        if (prompt.includes('解释')) {
            return `这个概念的核心是建立数据之间的双向连接。

想象一下，就像两个朋友通过电话交流：
- HTML 页面就像一个朋友
- MarginNote 卡片就像另一个朋友
- evaluateJavaScript 和 URL Scheme 就像电话线

通过这种连接，网页可以把看到的内容告诉卡片，卡片也可以把自己的信息展示在网页上。这在实际应用中非常有用，比如自动收集网页笔记、实时同步学习进度等。`;
        } else if (prompt.includes('总结')) {
            return `**关键要点：**
1. 🔗 双向通信是插件开发的核心技术
2. 📤 evaluateJavaScript 用于插件向网页发送指令
3. 📥 URL Scheme 用于网页向插件发送消息
4. 🔄 数据需要正确的格式转换（JSON、Base64）
5. ⚡ 性能优化很重要（批处理、缓存）

**总结：**
掌握 HTML 与卡片的数据传输技术，能让你开发出功能强大的 MarginNote 插件。这不仅提升了笔记效率，还能创造出全新的学习体验。`;
        } else {
            return '模拟的 AI 响应内容';
        }
    }
}

// 数据管理模块
class DataManager {
    constructor() {
        this.storage = NSUserDefaults.standardUserDefaults();
        this.prefix = 'SmartLearningAssistant_';
    }
    
    // 保存数据
    save(key, value) {
        const fullKey = this.prefix + key;
        this.storage.setObjectForKey(JSON.stringify(value), fullKey);
    }
    
    // 读取数据
    load(key, defaultValue = null) {
        const fullKey = this.prefix + key;
        const data = this.storage.objectForKey(fullKey);
        
        if (data) {
            try {
                return JSON.parse(data);
            } catch (e) {
                return defaultValue;
            }
        }
        
        return defaultValue;
    }
    
    // 学习记录管理
    addLearningRecord(record) {
        const records = this.load('learningRecords', []);
        records.push({
            ...record,
            id: Date.now().toString(),
            timestamp: Date.now()
        });
        
        // 只保留最近 1000 条记录
        if (records.length > 1000) {
            records.splice(0, records.length - 1000);
        }
        
        this.save('learningRecords', records);
    }
    
    // 统计功能
    getTotalNotes() {
        const notebook = MNUtil.currentNotebook;
        return notebook ? notebook.notes.length : 0;
    }
    
    getTodayNotes() {
        const notebook = MNUtil.currentNotebook;
        if (!notebook) return 0;
        
        const today = new Date().setHours(0, 0, 0, 0);
        return notebook.notes.filter(note => 
            note.createDate.getTime() >= today
        ).length;
    }
    
    getWeeklyNotes() {
        const notebook = MNUtil.currentNotebook;
        if (!notebook) return 0;
        
        const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        return notebook.notes.filter(note => 
            note.createDate.getTime() >= weekAgo
        ).length;
    }
    
    getTotalLearningTime() {
        const records = this.load('learningRecords', []);
        return records.reduce((total, record) => {
            return total + (record.duration || 0);
        }, 0);
    }
    
    getLearningCurve(days = 30) {
        const records = this.load('learningRecords', []);
        const curve = [];
        
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            
            const dayRecords = records.filter(r => {
                const recordDate = new Date(r.timestamp);
                return recordDate.toDateString() === date.toDateString();
            });
            
            curve.push({
                date: date.toLocaleDateString(),
                minutes: dayRecords.reduce((sum, r) => sum + (r.duration || 0), 0) / 60,
                notes: dayRecords.filter(r => r.type === 'note_created').length
            });
        }
        
        return curve;
    }
}

// 同步管理模块
class SyncManager {
    constructor() {
        this.syncInterval = null;
        this.lastSync = null;
    }
    
    startAutoSync(interval = 60000) {
        this.syncInterval = setInterval(() => {
            this.sync();
        }, interval);
    }
    
    stopAutoSync() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
    }
    
    async sync() {
        try {
            DevTools.info('Sync', '开始同步数据');
            
            // 同步笔记
            await this.syncNotes();
            
            // 同步学习进度
            await this.syncProgress();
            
            // 同步设置
            await this.syncSettings();
            
            this.lastSync = Date.now();
            
            DevTools.info('Sync', '同步完成');
            
        } catch (error) {
            DevTools.error('Sync', '同步失败', error);
        }
    }
    
    async syncNotes() {
        // 实现笔记同步逻辑
        // 可以同步到云端或其他设备
    }
    
    async syncProgress() {
        // 实现进度同步逻辑
    }
    
    async syncSettings() {
        // 实现设置同步逻辑
    }
}

// 页面分析器
const PageAnalyzer = \`
class PageAnalyzer {
    analyze() {
        // 检测视频
        if (document.querySelector('video')) {
            return 'video';
        }
        
        // 检测文章
        if (document.querySelector('article') || 
            document.querySelector('[class*="article"]') ||
            document.querySelector('[class*="post"]')) {
            return 'article';
        }
        
        // 检测 PDF
        if (window.location.pathname.endsWith('.pdf') ||
            document.querySelector('embed[type="application/pdf"]')) {
            return 'pdf';
        }
        
        // 检测代码
        if (document.querySelector('pre code') ||
            document.querySelector('.highlight') ||
            window.location.hostname.includes('github.com')) {
            return 'code';
        }
        
        return 'general';
    }
}
\`;

// 内容提取器基类
const ContentExtractor = \`
class ContentExtractor {
    extract() {
        throw new Error('Subclass must implement extract method');
    }
    
    cleanText(text) {
        return text.trim()
                  .replace(/\\s+/g, ' ')
                  .replace(/\\n{3,}/g, '\\n\\n');
    }
}

class ArticleExtractor extends ContentExtractor {
    extract() {
        const article = document.querySelector('article') || document.body;
        
        // 提取标题
        const title = document.querySelector('h1')?.textContent || 
                     document.title;
        
        // 提取作者
        const author = this.extractAuthor();
        
        // 提取发布时间
        const publishTime = this.extractPublishTime();
        
        // 提取正文
        const content = this.extractContent(article);
        
        // 提取图片
        const images = this.extractImages(article);
        
        return {
            type: 'article',
            title,
            author,
            publishTime,
            content,
            images,
            url: window.location.href
        };
    }
    
    extractAuthor() {
        const selectors = [
            '.author', '[class*="author"]', 
            '.by', '[class*="by"]',
            'meta[name="author"]'
        ];
        
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                return element.textContent || element.content || '未知作者';
            }
        }
        
        return '未知作者';
    }
    
    extractPublishTime() {
        const selectors = [
            'time', '.date', '[class*="publish"]',
            'meta[property="article:published_time"]'
        ];
        
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                return element.textContent || 
                       element.dateTime || 
                       element.content || 
                       new Date().toLocaleDateString();
            }
        }
        
        return new Date().toLocaleDateString();
    }
    
    extractContent(container) {
        // 克隆容器以避免修改原始 DOM
        const clone = container.cloneNode(true);
        
        // 移除不需要的元素
        const removeSelectors = [
            'script', 'style', 'nav', 'aside',
            '.ad', '[class*="advertisement"]',
            '.share', '[class*="share"]'
        ];
        
        removeSelectors.forEach(selector => {
            clone.querySelectorAll(selector).forEach(el => el.remove());
        });
        
        // 提取文本
        return this.cleanText(clone.textContent);
    }
    
    extractImages(container) {
        const images = [];
        
        container.querySelectorAll('img').forEach(img => {
            if (img.width > 100 && img.height > 100) {
                images.push({
                    src: img.src,
                    alt: img.alt || '',
                    caption: this.findImageCaption(img)
                });
            }
        });
        
        return images;
    }
    
    findImageCaption(img) {
        // 查找图片说明
        const parent = img.parentElement;
        const figcaption = parent.querySelector('figcaption');
        
        if (figcaption) {
            return figcaption.textContent;
        }
        
        // 查找临近的文本
        const nextElement = img.nextElementSibling;
        if (nextElement && nextElement.tagName === 'P') {
            const text = nextElement.textContent;
            if (text.length < 100) {
                return text;
            }
        }
        
        return '';
    }
}

class VideoExtractor extends ContentExtractor {
    extract() {
        const video = document.querySelector('video');
        if (!video) return null;
        
        return {
            type: 'video',
            title: document.title,
            duration: video.duration,
            currentTime: video.currentTime,
            thumbnail: this.getVideoThumbnail(video),
            source: video.currentSrc || video.src,
            platform: this.detectPlatform(),
            url: window.location.href
        };
    }
    
    getVideoThumbnail(video) {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 360;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        return canvas.toDataURL('image/jpeg', 0.8);
    }
    
    detectPlatform() {
        const hostname = window.location.hostname;
        
        if (hostname.includes('youtube.com')) return 'YouTube';
        if (hostname.includes('bilibili.com')) return 'Bilibili';
        if (hostname.includes('vimeo.com')) return 'Vimeo';
        
        return 'Unknown';
    }
}

class GeneralExtractor extends ContentExtractor {
    extract() {
        // 通用提取逻辑
        const selection = window.getSelection();
        
        if (selection.toString()) {
            // 如果有选中文本，提取选中内容
            return {
                type: 'selection',
                content: selection.toString(),
                context: this.getSelectionContext(selection),
                url: window.location.href
            };
        }
        
        // 否则提取页面主要内容
        return {
            type: 'general',
            title: document.title,
            content: this.extractMainContent(),
            url: window.location.href
        };
    }
    
    getSelectionContext(selection) {
        if (selection.rangeCount === 0) return '';
        
        const range = selection.getRangeAt(0);
        const container = range.commonAncestorContainer.parentElement;
        
        // 获取选中文本的上下文
        const context = {
            before: '',
            after: ''
        };
        
        // 简单实现：获取父元素的文本
        const fullText = container.textContent;
        const selectedText = selection.toString();
        const index = fullText.indexOf(selectedText);
        
        if (index !== -1) {
            context.before = fullText.substring(Math.max(0, index - 50), index);
            context.after = fullText.substring(
                index + selectedText.length, 
                Math.min(fullText.length, index + selectedText.length + 50)
            );
        }
        
        return context;
    }
    
    extractMainContent() {
        // 尝试找到主要内容区域
        const contentSelectors = [
            'main', 'article', '[role="main"]',
            '.content', '#content', '.main'
        ];
        
        for (const selector of contentSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                return this.cleanText(element.textContent);
            }
        }
        
        // 如果找不到，返回 body 的文本
        return this.cleanText(document.body.textContent);
    }
}
\`;

// 创建插件实例
const smartLearningAssistant = new SmartLearningAssistant();
```

### 📋 项目总结

通过这个完整的项目，我们实现了：

1. **智能内容提取**
   - 自动识别页面类型
   - 针对性的内容提取策略
   - 保留重要的元数据

2. **AI 辅助学习**
   - 内容解释和总结
   - 自动生成测试题
   - 个性化学习建议

3. **学习进度追踪**
   - 实时进度监控
   - 里程碑激励机制
   - 详细的学习报告

4. **数据可视化**
   - 学习曲线展示
   - 统计数据图表
   - 交互式数据探索

5. **双向数据同步**
   - 实时数据更新
   - 离线数据缓存
   - 跨设备同步支持

这个项目展示了如何将前面章节学到的所有技术整合到一个实用的插件中。你可以基于这个框架，根据自己的需求进行修改和扩展。

---

## 第八部分：常见问题与调试

### 🎯 本章目标

帮助你解决开发中的常见问题，掌握调试技巧，了解最佳实践。

### ❓ 常见问题及解决方案

#### 1. WebView 加载问题

**问题：WebView 显示空白**
```javascript
// ❌ 错误：路径不正确
webview.loadRequest(NSURLRequest.requestWithURL(
    NSURL.URLWithString("file://index.html")
));

// ✅ 正确：使用正确的文件路径
const htmlPath = MNUtil.getPluginPath() + "/index.html";
webview.loadRequest(NSURLRequest.requestWithURL(
    NSURL.fileURLWithPath(htmlPath)
));
```

**问题：CSS/JS 资源加载失败**
```javascript
// ✅ 使用 Base URL 加载本地资源
const html = \`
<html>
<head>
    <link rel="stylesheet" href="style.css">
    <script src="script.js"></script>
</head>
<body>内容</body>
</html>
\`;

const baseURL = NSURL.fileURLWithPath(MNUtil.getPluginPath());
webview.loadHTMLStringBaseURL(html, baseURL);
```

#### 2. 数据传输问题

**问题：evaluateJavaScript 返回 undefined**
```javascript
// ❌ 错误：没有返回值
await webview.evaluateJavaScript(\`
    document.title  // 没有显式返回
\`);

// ✅ 正确：确保有返回值
await webview.evaluateJavaScript(\`
    document.title  // 表达式会自动返回
\`);

// 或者使用显式返回
await webview.evaluateJavaScript(\`
    (() => {
        const title = document.title;
        return title;  // 显式返回
    })()
\`);
```

**问题：大数据传输失败**
```javascript
// ❌ 错误：数据太大
const hugeData = await webview.evaluateJavaScript(\`
    document.body.innerHTML  // 可能非常大
\`);

// ✅ 正确：分块传输
async function transferLargeData() {
    // 先获取数据大小
    const size = await webview.evaluateJavaScript(\`
        document.body.innerHTML.length
    \`);
    
    if (size > 1000000) {  // 1MB
        // 分块传输
        const chunks = [];
        const chunkSize = 100000;  // 100KB
        
        for (let i = 0; i < size; i += chunkSize) {
            const chunk = await webview.evaluateJavaScript(\`
                document.body.innerHTML.substring(${i}, ${i + chunkSize})
            \`);
            chunks.push(chunk);
        }
        
        return chunks.join('');
    } else {
        // 直接传输
        return await webview.evaluateJavaScript(\`
            document.body.innerHTML
        \`);
    }
}
```

#### 3. 内存泄漏问题

**问题：WebView 内存不断增长**
```javascript
// ❌ 错误：没有清理事件监听器
window.addEventListener('scroll', handleScroll);
// 页面切换时没有移除

// ✅ 正确：正确管理生命周期
class WebViewManager {
    constructor() {
        this.listeners = [];
    }
    
    addEventListener(element, event, handler) {
        element.addEventListener(event, handler);
        this.listeners.push({ element, event, handler });
    }
    
    cleanup() {
        // 移除所有监听器
        this.listeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        this.listeners = [];
        
        // 清理其他资源
        if (this.timers) {
            this.timers.forEach(timer => clearInterval(timer));
        }
        
        // 清理大对象
        this.cache = null;
        this.data = null;
    }
}
```

#### 4. 异步操作问题

**问题：Promise 没有正确处理**
```javascript
// ❌ 错误：没有等待 Promise
webview.evaluateJavaScript(\`
    fetch('/api/data').then(r => r.json())
\`);  // 返回 Promise 对象，不是数据

// ✅ 正确：等待 Promise 完成
const data = await webview.evaluateJavaScript(\`
    fetch('/api/data').then(r => r.json())
\`);

// 或者在网页中处理
const data = await webview.evaluateJavaScript(\`
    (async () => {
        const response = await fetch('/api/data');
        return await response.json();
    })()
\`);
```

### 🐞 调试技巧

#### 1. 使用 Safari 开发者工具

```javascript
// 启用 WebView 调试
webview.configuration.preferences.setValue(true, 'developerExtrasEnabled');

// 在 Safari 中：
// 1. 打开 Safari
// 2. 菜单栏 -> 开发 -> [你的设备名]
// 3. 选择你的 WebView
// 4. 现在可以使用完整的开发者工具了！
```

#### 2. 日志调试系统

```javascript
// 创建强大的日志系统
class Logger {
    constructor(enabled = true) {
        this.enabled = enabled;
        this.logs = [];
    }
    
    log(level, category, message, data) {
        if (!this.enabled) return;
        
        const entry = {
            timestamp: new Date().toISOString(),
            level,
            category,
            message,
            data,
            stack: new Error().stack
        };
        
        this.logs.push(entry);
        
        // 在控制台输出
        const color = {
            debug: 'gray',
            info: 'blue',
            warn: 'orange',
            error: 'red'
        }[level];
        
        console.log(
            \`%c[\${level.toUpperCase()}] \${category}: \${message}\`,
            \`color: \${color}; font-weight: bold\`,
            data || ''
        );
        
        // 发送到插件端
        if (window.location.href.startsWith('browser://')) {
            window.location.href = \`browser://log?level=\${level}&category=\${category}&message=\${encodeURIComponent(message)}\`;
        }
    }
    
    debug(category, message, data) {
        this.log('debug', category, message, data);
    }
    
    info(category, message, data) {
        this.log('info', category, message, data);
    }
    
    warn(category, message, data) {
        this.log('warn', category, message, data);
    }
    
    error(category, message, data) {
        this.log('error', category, message, data);
    }
    
    // 导出日志
    export() {
        return this.logs;
    }
    
    // 清空日志
    clear() {
        this.logs = [];
    }
}

// 全局日志实例
window.logger = new Logger();

// 使用示例
logger.info('DataExtraction', '开始提取数据', { url: window.location.href });
logger.error('Network', '请求失败', { status: 404, url: '/api/data' });
```

#### 3. 性能分析

```javascript
// 性能监控工具
class PerformanceMonitor {
    constructor() {
        this.measurements = {};
    }
    
    start(name) {
        this.measurements[name] = {
            start: performance.now(),
            memory: performance.memory ? performance.memory.usedJSHeapSize : 0
        };
    }
    
    end(name) {
        if (!this.measurements[name]) {
            console.warn(\`No measurement started for \${name}\`);
            return;
        }
        
        const measurement = this.measurements[name];
        const duration = performance.now() - measurement.start;
        const memoryDelta = performance.memory ? 
            performance.memory.usedJSHeapSize - measurement.memory : 0;
        
        console.log(\`
Performance: \${name}
Duration: \${duration.toFixed(2)}ms
Memory Delta: \${(memoryDelta / 1024 / 1024).toFixed(2)}MB
        \`);
        
        delete this.measurements[name];
        
        return { duration, memoryDelta };
    }
    
    async measure(name, fn) {
        this.start(name);
        try {
            const result = await fn();
            return result;
        } finally {
            this.end(name);
        }
    }
}

// 使用示例
const monitor = new PerformanceMonitor();

await monitor.measure('图片处理', async () => {
    await processImages(imageList);
});
```

### 💡 最佳实践总结

#### 1. 代码组织

```javascript
// 推荐的项目结构
/my-plugin
├── main.js           // 插件主入口
├── webview/
│   ├── index.html    // WebView 界面
│   ├── app.js        // 前端逻辑
│   └── style.css     // 样式
├── modules/
│   ├── data.js       // 数据管理
│   ├── sync.js       // 同步逻辑
│   └── ai.js         // AI 服务
├── utils/
│   ├── logger.js     // 日志工具
│   └── helpers.js    // 辅助函数
└── config.json       // 配置文件
```

#### 2. 错误处理

```javascript
// 全局错误处理
class ErrorHandler {
    static handle(error, context) {
        // 记录错误
        DevTools.error(context, error.message, {
            stack: error.stack,
            timestamp: Date.now()
        });
        
        // 用户友好的错误提示
        const userMessage = this.getUserMessage(error);
        MNUtil.showHUD(userMessage);
        
        // 错误恢复
        this.recover(error, context);
    }
    
    static getUserMessage(error) {
        const messages = {
            'NetworkError': '网络连接失败，请检查网络',
            'DataError': '数据处理失败，请重试',
            'AIError': 'AI 服务暂时不可用'
        };
        
        return messages[error.constructor.name] || '操作失败，请重试';
    }
    
    static recover(error, context) {
        // 根据错误类型进行恢复
        if (error instanceof NetworkError) {
            // 切换到离线模式
            AppState.setOfflineMode(true);
        }
    }
}

// 使用 try-catch 包装所有异步操作
async function safeExecute(fn, context) {
    try {
        return await fn();
    } catch (error) {
        ErrorHandler.handle(error, context);
        return null;
    }
}
```

#### 3. 性能优化检查清单

- [ ] 使用防抖和节流优化频繁操作
- [ ] 实现图片懒加载
- [ ] 批量处理数据操作
- [ ] 及时清理不用的对象和监听器
- [ ] 使用 Web Worker 处理耗时操作
- [ ] 缓存常用数据
- [ ] 避免深层嵌套的 Promise
- [ ] 使用虚拟滚动处理长列表

### 📚 进一步学习资源

1. **官方文档**
   - MarginNote API 文档
   - JSBox 文档（参考 JSB 框架）
   - MDN Web Docs（Web 技术）

2. **社区资源**
   - MarginNote 中文论坛
   - GitHub 上的开源插件
   - Discord/Telegram 开发者群组

3. **相关技术**
   - JavaScript 高级编程
   - iOS WebView 开发
   - 前端性能优化
   - 用户体验设计

4. **推荐项目**
   - MNUtils - 基础 API 框架
   - OhMyMN - 现代化插件框架
   - 各种优秀的开源插件

### 🎉 结语

恭喜你完成了整个教程！现在你已经掌握了：

1. ✅ HTML 与卡片数据传输的核心技术
2. ✅ 单向和双向通信的实现方法
3. ✅ 各种进阶技巧和性能优化
4. ✅ 完整项目的开发流程
5. ✅ 调试和问题解决能力

记住，优秀的插件不是一蹴而就的。持续学习、不断实践、积极分享，你会成为出色的 MarginNote 插件开发者！

**最后的建议：**
- 🚀 从简单的功能开始，逐步增加复杂度
- 💡 多看优秀插件的源码，学习最佳实践
- 🤝 参与社区，分享你的作品和经验
- 📈 持续优化，让插件越来越好用

祝你开发愉快，创造出令人惊叹的插件！🎊
