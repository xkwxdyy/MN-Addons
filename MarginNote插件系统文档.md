# MarginNote 插件系统技术文档

## 一、系统架构概述

### 1.1 技术基础

MarginNote 的插件系统基于 Objective-C 和 JavaScript 的桥接技术（JSBridge）构建。插件表面上使用 JavaScript 编写，但实际是通过 JSBridge 框架调用底层的 Objective-C API 来实现功能。

**关键特点：**
- 使用较老的 JSBridge 框架，存在一些兼容性问题
- 无法使用 Node.js API
- Browser API 支持有限（基于 Safari 实现）
- iOS 和 macOS 平台存在差异

### 1.2 插件文件结构

MarginNote 插件以 `.mnaddon` 为后缀，本质是一个 ZIP 压缩包，包含以下核心文件：

```
plugin.mnaddon/
├── mnaddon.json    # 插件描述清单
├── main.js         # 插件主代码
└── logo.png        # 插件图标 (44x44)
```

#### mnaddon.json 配置清单

```json
{
  "addonid": "marginnote.extension.example",
  "author": "作者名",
  "title": "插件名称",
  "version": "1.0.0",
  "marginnote_version_min": "3.7.21",
  "cert_key": ""
}
```

- `addonid`: 插件唯一标识，统一使用 `marginnote.extension.` 前缀
- `marginnote_version_min`: 最低支持的 MarginNote 版本
- `cert_key`: 官方签名密钥（需申请）

## 二、插件对象（JSExtension）

### 2.1 插件创建机制

插件通过 `JSB.newAddon` 函数创建，返回一个继承自 `JSExtension` 的 Objective-C 类：

```javascript
JSB.newAddon = () => {
  return JSB.defineClass(
    "PluginName: JSExtension",  // 类名和父类
    {
      // 实例方法
    },
    {
      // 类方法（静态方法）
    }
  )
}
```

### 2.2 JSB.defineClass 参数说明

1. **类声明**：格式为 `"ClassName: ParentClass"`
2. **实例方法**：包含生命周期方法、事件处理方法、插件按钮交互等
3. **类方法**：主要包含插件安装和卸载的静态方法

### 2.3 self 对象

`self` 指代插件实例（Objective-C 对象），只能在实例方法中使用。

**重要提示**：MarginNote 支持多窗口，不同窗口的插件实例相互独立，但 JavaScript 变量是多窗口共用的。要区分窗口数据，必须将变量挂载到 `self` 上。

## 三、生命周期管理

### 3.1 实例方法生命周期

#### 窗口生命周期
- `sceneWillConnect()`: 新建 MN 窗口时触发
- `sceneDidDisconnect()`: 关闭 MN 窗口时触发
- `sceneWillResignActive()`: 窗口失去焦点时触发
- `sceneDidBecomeActive()`: 窗口获得焦点时触发

#### 笔记本生命周期
- `notebookWillOpen(topicid: string)`: 打开笔记本时触发
- `notebookWillClose(topicid: string)`: 关闭笔记本时触发

#### 文档生命周期
- `documentDidOpen(docmd5: string)`: 打开文档时触发
- `documentWillClose(docmd5: string)`: 关闭文档时触发

### 3.2 静态方法生命周期

- `addonDidConnect()`: 插件安装、启用或 MN 启动时触发
- `addonWillDisconnect()`: 插件卸载、停用时触发

**注意**：iPad 上直接划掉后台不会触发关闭事件，应在进入后台时处理相关逻辑。

## 四、事件监听系统

### 4.1 事件监听注册

通常在打开笔记本时添加事件监听：

```javascript
// 添加监听
NSNotificationCenter.defaultCenter().addObserverSelectorName(
  self,
  "onProcessNewExcerpt:",  // 注意冒号
  "ProcessNewExcerpt"
)

// 移除监听
NSNotificationCenter.defaultCenter().removeObserverName(
  self,
  "ProcessNewExcerpt"
)
```

### 4.2 核心事件类型

#### 摘录相关
- `ProcessNewExcerpt`: PDF 中摘录时触发
  - `userInfo.noteid`: 获取摘录笔记 ID
- `ChangeExcerptRange`: 修改摘录范围时触发
  - `userInfo.noteid`: 获取笔记 ID

#### 菜单相关
- `PopupMenuOnNote`: 点击笔记弹出菜单时触发
  - `userInfo.note`: 获取笔记对象
- `ClosePopupMenuOnNote`: 笔记菜单消失时触发
- `PopupMenuOnSelection`: PDF 中选中文字弹出菜单时触发
  - `userInfo.documentController.selectionText`: 获取选中文字
- `ClosePopupMenuOnSelection`: 选中文字菜单消失时触发

#### OCR 相关
- `OCRImageBegin`: OCR 开始时触发
- `OCRImageEnd`: OCR 结束时触发

#### URL Scheme
- `AddonBroadcast`: 打开特定格式 URL 时触发
  - 格式：`marginnote3app://addon/[addonid]?params`
  - `userInfo.message`: 获取 URL 参数

## 五、核心 API 体系

### 5.1 Application API

获取应用实例：
```javascript
const app = Application.sharedInstance()
```

主要属性和方法：
- `appVersion`: 版本号
- `currentTheme`: 当前主题
- `focusWindow`: 焦点窗口
- `osType`: 操作系统类型
- `studyController(window)`: 获取学习控制器
- `showHUD(message, view, duration)`: 显示提示信息
- `alert(message)`: 显示警告框
- `openURL(url)`: 打开 URL

### 5.2 Database API

获取数据库实例：
```javascript
const db = Database.sharedInstance()
```

主要方法：
- `getMediaByHash(hash)`: 根据哈希值获取媒体文件
- `refreshAfterDBChanged(notebookid)`: 刷新笔记数据

### 5.3 StudyController

控制学习界面的核心对象：

```javascript
const studyController = app.studyController(window)
```

主要属性：
- `studyMode`: 学习模式（0: 文档模式, 1: 学习模式, 2: 复习模式, 3: 脑图模式）
- `notebookController`: 笔记本控制器
- `readerController`: 阅读器控制器

主要方法：
- `refreshAddonCommands()`: 刷新插件按钮状态
- `becomeFirstResponder()`: 设置为第一响应者

### 5.4 插件按钮交互

通过 `queryAddonCommandStatus` 方法设置插件按钮：

```javascript
queryAddonCommandStatus() {
  return {
    image: "logo_44x44.png",  // 图标文件
    object: self,              // 处理对象
    selector: "onToggle:",     // 点击触发的方法
    checked: self.status       // 选中状态
  }
}
```

## 六、数据模型

### 6.1 MbBookNote（笔记对象）

#### 创建笔记
```javascript
const note = Note.createWithTitleNotebookDocument(
  title,     // 标题
  notebook,  // MbTopic 对象
  document   // MbBook 对象
)
```

#### 可写属性
- `excerptText`: 摘录文本
- `noteTitle`: 笔记标题
- `colorIndex`: 颜色索引 (0-15)
- `fillIndex`: 填充类型索引 (0-2)

#### 只读属性
- `noteId`: 笔记 ID
- `docMd5`: 文档 MD5
- `notebookId`: 笔记本 ID
- `createDate`: 创建日期
- `modifiedDate`: 修改日期
- `comments`: 评论数组
- `parentNote`: 父笔记
- `childNotes`: 子笔记数组
- `linkedNotes`: 链接笔记列表
- `excerptPic`: 摘录图片
- `mediaList`: 媒体列表（用 `-` 分隔的哈希值）

#### 实例方法
- `clearFormat()`: 清除格式
- `merge(note)`: 合并笔记
- `appendTextComment(text)`: 添加文本评论
- `appendHtmlComment(html, text, size, tag)`: 添加 HTML 评论
- `appendNoteLink(note)`: 添加笔记链接
- `removeCommentByIndex(index)`: 删除评论

### 6.2 评论系统

评论类型：
- `TextComment`: 文本评论
- `HtmlComment`: HTML 评论
- `LinkComment`: 链接评论（合并笔记产生）
- `PaintComment`: 图片评论

评论结构示例：
```javascript
{
  type: "TextNote",
  text: "评论内容",
  noteid: "笔记ID"  // 合并后有效
}
```

### 6.3 媒体处理

获取媒体文件：
```javascript
// 获取摘录图片
const imageData = db.getMediaByHash(note.excerptPic.paint)
const base64 = imageData?.base64Encoding()

// 获取所有媒体
const mediaHashes = note.mediaList?.split("-")
const mediaFiles = mediaHashes?.map(hash => db.getMediaByHash(hash))
```

## 七、数据存储

### 7.1 NSUserDefaults 持久化

使用 NSUserDefaults 存储配置数据：

```javascript
// 存储数据
NSUserDefaults.standardUserDefaults().setObjectForKey(data, key)

// 读取数据
const data = NSUserDefaults.standardUserDefaults().objectForKey(key)
```

**注意事项**：
- 可直接存储 JSON 对象，无需转换为字符串
- 不能包含 `undefined` 值，否则会报错
- 数据在应用重启后依然保留

### 7.2 配置管理建议

建议使用分层的配置键名：
- 全局配置：`plugin_global_config`
- 笔记本配置：`plugin_notebook_${notebookId}`
- 文档配置：`plugin_doc_${docMd5}`

## 八、开发实践

### 8.1 基础插件示例

```javascript
JSB.newAddon = () => {
  return JSB.defineClass(
    "MyPlugin: JSExtension",
    {
      // 窗口打开时初始化
      sceneWillConnect() {
        self.app = Application.sharedInstance()
        self.studyController = self.app.studyController(self.window)
      },
      
      // 打开笔记本时添加事件监听
      notebookWillOpen(topicid) {
        NSNotificationCenter.defaultCenter().addObserverSelectorName(
          self,
          "onProcessNewExcerpt:",
          "ProcessNewExcerpt"
        )
      },
      
      // 处理摘录事件
      onProcessNewExcerpt(sender) {
        const noteid = sender.userInfo.noteid
        // 处理逻辑
      },
      
      // 关闭笔记本时清理
      notebookWillClose(topicid) {
        NSNotificationCenter.defaultCenter().removeObserverName(
          self,
          "ProcessNewExcerpt"
        )
      },
      
      // 插件按钮配置
      queryAddonCommandStatus() {
        return {
          image: "logo_44x44.png",
          object: self,
          selector: "onButtonClick:",
          checked: false
        }
      },
      
      // 按钮点击处理
      onButtonClick() {
        self.app.showHUD("Hello MarginNote!", self.window, 2)
      }
    },
    {
      // 插件安装时
      addonDidConnect() {
        // 初始化操作
      }
    }
  )
}
```

### 8.2 调试方法

使用 Console.app 查看日志：
```javascript
JSB.log("plugin-key %@", object)
```

在 Console.app 中通过插件 key 筛选日志输出。

### 8.3 多窗口处理

确保数据隔离：
```javascript
sceneWillConnect() {
  // 窗口特定数据挂载到 self
  self.windowData = {
    status: false,
    config: {}
  }
}
```

### 8.4 异步操作支持

插件支持 async/await：
```javascript
async onButtonClick() {
  const result = await someAsyncOperation()
  self.app.showHUD(result, self.window, 2)
}
```

## 九、平台差异

### 9.1 iOS vs macOS

- iOS 不支持某些快捷键操作
- macOS 有更完整的文件系统访问
- UI 控件表现可能不同

### 9.2 版本兼容

- MarginNote 3: 版本号 < 4.0.0
- MarginNote 4 (MNE): 版本号 >= 4.0.0
- 建议设置 `marginnote_version_min: "3.7.21"` 确保基础 API 支持

## 十、限制与注意事项

### 10.1 技术限制

- 无法使用 Node.js 模块
- 无法使用 fetch API（需使用 NSURLConnection）
- Safari 不支持的 JavaScript 特性无法使用
- 无法直接操作文件系统（需通过 NSFileManager）

### 10.2 性能注意

- 避免在主线程执行耗时操作
- 及时移除不需要的事件监听
- 合理使用缓存避免重复计算

### 10.3 安全考虑

- 未签名插件需要用户手动允许
- 避免存储敏感信息
- 谨慎处理用户数据

## 总结

MarginNote 插件系统虽然基于较老的技术栈，但提供了丰富的 API 接口，能够实现强大的笔记处理功能。开发者需要理解 Objective-C 与 JavaScript 的桥接机制，熟悉生命周期和事件系统，才能开发出稳定高效的插件。

通过合理利用 MbBookNote 数据模型、事件监听系统和持久化存储，可以实现自动化处理摘录、批量操作卡片、智能化管理笔记等复杂功能。